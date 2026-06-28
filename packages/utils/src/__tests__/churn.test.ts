import { getDaysSinceLastVisit, calculateChurnLevel } from '../churn'

describe('getDaysSinceLastVisit', () => {
  it('returns Infinity when lastVisitAt is null', () => {
    expect(getDaysSinceLastVisit(null)).toBe(Infinity)
  })

  it('returns 0 for a visit today', () => {
    const now = new Date()
    expect(getDaysSinceLastVisit(now)).toBe(0)
  })

  it('returns correct days for past dates', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    expect(getDaysSinceLastVisit(twoDaysAgo)).toBe(2)
  })
})

describe('calculateChurnLevel', () => {
  const threshold = 60

  it('returns LOW for a recent visit (< 30 days)', () => {
    const recentDate = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    expect(calculateChurnLevel(recentDate, threshold)).toBe('LOW')
  })

  it('returns LOW for exactly 0 days', () => {
    expect(calculateChurnLevel(new Date(), threshold)).toBe('LOW')
  })

  it('returns MEDIUM for 30 days exactly (boundary)', () => {
    const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    expect(calculateChurnLevel(thirtyDays, threshold)).toBe('MEDIUM')
  })

  it('returns MEDIUM for 45 days', () => {
    const fortyFive = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    expect(calculateChurnLevel(fortyFive, threshold)).toBe('MEDIUM')
  })

  it('returns HIGH for 60 days exactly (boundary)', () => {
    const sixtyDays = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
    expect(calculateChurnLevel(sixtyDays, threshold)).toBe('HIGH')
  })

  it('returns HIGH for 61 days', () => {
    const sixtyOne = new Date(Date.now() - 61 * 24 * 60 * 60 * 1000)
    expect(calculateChurnLevel(sixtyOne, threshold)).toBe('HIGH')
  })

  it('returns HIGH for null last visit (never visited)', () => {
    expect(calculateChurnLevel(null, threshold)).toBe('HIGH')
  })

  it('uses custom threshold correctly', () => {
    const thirtyDays = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    expect(calculateChurnLevel(thirtyDays, 30)).toBe('HIGH')
    expect(calculateChurnLevel(thirtyDays, 120)).toBe('LOW')
  })
})
