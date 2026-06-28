import { generatePublicKey } from '../crypto'

describe('generatePublicKey', () => {
  it('starts with pk_live_ prefix', () => {
    const key = generatePublicKey()
    expect(key.startsWith('pk_live_')).toBe(true)
  })

  it('has correct total length (pk_live_ + 48 hex chars = 56 chars)', () => {
    const key = generatePublicKey()
    expect(key.length).toBe(56) // 'pk_live_' (8) + 24 bytes * 2 hex chars (48)
  })

  it('is unique across multiple calls', () => {
    const keys = new Set(Array.from({ length: 100 }, () => generatePublicKey()))
    expect(keys.size).toBe(100)
  })

  it('contains only valid characters after prefix', () => {
    const key = generatePublicKey()
    const hex = key.replace('pk_live_', '')
    expect(/^[0-9a-f]+$/.test(hex)).toBe(true)
  })
})
