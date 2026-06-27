import { randomBytes } from 'crypto'

export function generatePublicKey(): string {
  const hex = randomBytes(24).toString('hex')
  return `pk_live_${hex}`
}
