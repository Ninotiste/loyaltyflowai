import { SignJWT, jwtVerify } from 'jose'

function getJwtSecret(): Uint8Array {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CRON_SECRET is required in production')
    }
    return new TextEncoder().encode('dev-only-not-for-production-requires-cron-secret-env-var')
  }
  return new TextEncoder().encode(secret)
}

export async function signWidgetToken(customerId: string, orgId: string): Promise<string> {
  return new SignJWT({ sub: customerId, org: orgId, type: 'widget' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(getJwtSecret())
}

export async function verifyWidgetToken(token: string): Promise<{ sub: string; org: string }> {
  const { payload } = await jwtVerify(token, getJwtSecret())
  if (payload.type !== 'widget' || !payload.sub || !payload.org) {
    throw new Error('Invalid widget token')
  }
  return { sub: payload.sub as string, org: payload.org as string }
}
