import { signWidgetToken, verifyWidgetToken } from '../lib/widget-token'

const TEST_SECRET = 'test-secret-that-is-at-least-32-chars-long'

beforeEach(() => {
  process.env.CRON_SECRET = TEST_SECRET
  ;(process.env as Record<string, string>).NODE_ENV = 'test'
})

afterEach(() => {
  delete process.env.CRON_SECRET
})

describe('signWidgetToken', () => {
  it('creates a JWT with correct payload', async () => {
    const token = await signWidgetToken('customer-123', 'org-456')
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // header.payload.signature
  })

  it('creates different tokens for different customers', async () => {
    const token1 = await signWidgetToken('customer-1', 'org-1')
    const token2 = await signWidgetToken('customer-2', 'org-1')
    expect(token1).not.toBe(token2)
  })
})

describe('verifyWidgetToken', () => {
  it('verifies a valid token and returns correct claims', async () => {
    const token = await signWidgetToken('customer-123', 'org-456')
    const claims = await verifyWidgetToken(token)
    expect(claims.sub).toBe('customer-123')
    expect(claims.org).toBe('org-456')
  })

  it('rejects a token signed with a different secret', async () => {
    const token = await signWidgetToken('customer-123', 'org-456')
    process.env.CRON_SECRET = 'different-secret-also-at-least-32-chars'
    await expect(verifyWidgetToken(token)).rejects.toThrow()
  })

  it('rejects a tampered token', async () => {
    const token = await signWidgetToken('customer-123', 'org-456')
    const tampered = token.slice(0, -5) + 'XXXXX'
    await expect(verifyWidgetToken(tampered)).rejects.toThrow()
  })

  it('rejects a malformed string', async () => {
    await expect(verifyWidgetToken('not.a.token')).rejects.toThrow()
  })
})

describe('CRON_SECRET protection', () => {
  it('throws in production when CRON_SECRET is missing', async () => {
    delete process.env.CRON_SECRET
    ;(process.env as Record<string, string>).NODE_ENV = 'production'
    await expect(signWidgetToken('c', 'o')).rejects.toThrow('CRON_SECRET is required in production')
    ;(process.env as Record<string, string>).NODE_ENV = 'test'
  })

  it('uses dev fallback when CRON_SECRET is missing in non-production', async () => {
    delete process.env.CRON_SECRET
    ;(process.env as Record<string, string>).NODE_ENV = 'development'
    const token = await signWidgetToken('customer-123', 'org-456')
    const claims = await verifyWidgetToken(token)
    expect(claims.sub).toBe('customer-123')
    ;(process.env as Record<string, string>).NODE_ENV = 'test'
  })
})
