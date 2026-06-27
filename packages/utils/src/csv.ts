const REQUIRED_HEADERS = ['email'] as const
const OPTIONAL_HEADERS = ['first_name', 'last_name', 'phone'] as const

export function validateCsvHeaders(headers: string[]): {
  valid: boolean
  missing: string[]
} {
  const normalized = headers.map((h) => h.trim().toLowerCase())
  const missing = REQUIRED_HEADERS.filter((h) => !normalized.includes(h))
  return { valid: missing.length === 0, missing }
}

export function parseCsvRow(
  headers: string[],
  row: string[]
): Record<string, string> {
  const result: Record<string, string> = {}
  const allHeaders = [...REQUIRED_HEADERS, ...OPTIONAL_HEADERS]
  headers.forEach((header, index) => {
    const normalized = header.trim().toLowerCase()
    if (allHeaders.includes(normalized as (typeof allHeaders)[number])) {
      result[normalized] = (row[index] ?? '').trim()
    }
  })
  return result
}
