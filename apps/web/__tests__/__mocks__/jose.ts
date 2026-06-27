import { createHmac } from 'crypto'

function b64url(data: Buffer | string): string {
  const buf = Buffer.isBuffer(data) ? data : Buffer.from(data as string)
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export class SignJWT {
  private _payload: Record<string, unknown>
  private _header: Record<string, unknown> = {}

  constructor(payload: Record<string, unknown>) {
    this._payload = { ...payload }
  }

  setProtectedHeader(header: Record<string, unknown>) {
    this._header = header
    return this
  }

  setExpirationTime(exp: string) {
    const days = parseInt(exp)
    this._payload.exp = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60
    return this
  }

  setIssuedAt() {
    this._payload.iat = Math.floor(Date.now() / 1000)
    return this
  }

  async sign(secret: Uint8Array): Promise<string> {
    const header = b64url(JSON.stringify(this._header))
    const payload = b64url(JSON.stringify(this._payload))
    const input = `${header}.${payload}`
    const sig = b64url(createHmac('sha256', Buffer.from(secret)).update(input).digest())
    return `${input}.${sig}`
  }
}

export async function jwtVerify(token: string, secret: Uint8Array) {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid JWT structure')

  const [header, payload, sig] = parts as [string, string, string]
  const input = `${header}.${payload}`
  const expectedSig = b64url(createHmac('sha256', Buffer.from(secret)).update(input).digest())

  if (expectedSig !== sig) throw new Error('Signature verification failed')

  const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf-8')) as Record<
    string,
    unknown
  >
  if (typeof decoded.exp === 'number' && decoded.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('JWT expired')
  }

  return { payload: decoded }
}
