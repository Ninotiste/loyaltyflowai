import { htmlEscape } from '../lib/email'

describe('htmlEscape', () => {
  it('escapes & to &amp;', () => {
    expect(htmlEscape('Tom & Jerry')).toBe('Tom &amp; Jerry')
  })

  it('escapes < and > to prevent tag injection', () => {
    expect(htmlEscape('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('escapes double quotes', () => {
    expect(htmlEscape('"quoted"')).toBe('&quot;quoted&quot;')
  })

  it('escapes single quotes', () => {
    expect(htmlEscape("it's")).toBe('it&#x27;s')
  })

  it('leaves safe characters unchanged', () => {
    expect(htmlEscape('Le Petit Bistrot 2024')).toBe('Le Petit Bistrot 2024')
  })

  it('handles XSS attempt in restaurant name', () => {
    const malicious = '</strong><img src=x onerror=alert(1)><strong>'
    const escaped = htmlEscape(malicious)
    expect(escaped).not.toContain('<')
    expect(escaped).not.toContain('>')
    expect(escaped).toContain('&lt;')
    expect(escaped).toContain('&gt;')
  })

  it('handles empty string', () => {
    expect(htmlEscape('')).toBe('')
  })

  it('handles numbers coerced to string', () => {
    expect(htmlEscape(String(42))).toBe('42')
  })
})
