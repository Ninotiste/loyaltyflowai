import { formatPoints, formatDate, maskEmail } from '../format'

describe('formatPoints', () => {
  it('formats zero correctly', () => {
    expect(formatPoints(0)).toBe('0 pts')
  })

  it('formats positive numbers', () => {
    expect(formatPoints(42)).toBe('42 pts')
  })

  it('formats large numbers with French locale (space separator)', () => {
    const result = formatPoints(1000)
    // French locale uses narrow no-break space or regular space as thousands separator
    expect(result).toContain('pts')
    expect(result).toContain('1')
    expect(result).toContain('000')
  })
})

describe('formatDate', () => {
  it('returns a non-empty string for any date', () => {
    const result = formatDate(new Date('2025-06-15'))
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('contains the year', () => {
    const result = formatDate(new Date('2025-06-15'))
    expect(result).toContain('2025')
  })

  it('contains the day', () => {
    const result = formatDate(new Date('2025-06-15'))
    expect(result).toContain('15')
  })
})

describe('maskEmail', () => {
  it('masks the local part after 2 chars', () => {
    expect(maskEmail('john@example.com')).toBe('jo***@example.com')
  })

  it('preserves the domain', () => {
    const masked = maskEmail('alice@restaurant.fr')
    expect(masked.endsWith('@restaurant.fr')).toBe(true)
  })

  it('uses *** as the mask', () => {
    const masked = maskEmail('bob@test.com')
    expect(masked).toContain('***')
  })

  it('handles short local parts gracefully', () => {
    const masked = maskEmail('ab@test.com')
    expect(masked.startsWith('ab')).toBe(true)
    expect(masked).toContain('@test.com')
  })

  it('returns the email unchanged if no @ is found', () => {
    expect(maskEmail('notanemail')).toBe('notanemail')
  })
})
