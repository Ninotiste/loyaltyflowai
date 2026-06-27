import { z } from 'zod'

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required'),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .default('http://localhost:3000'),
})

export type ClientEnv = z.infer<typeof clientSchema>

let _cache: ClientEnv | undefined

function get(): ClientEnv {
  if (_cache !== undefined) return _cache

  if (process.env['SKIP_ENV_VALIDATION'] === '1') {
    _cache = clientSchema.parse({
      // Explicit property access required — Next.js statically replaces NEXT_PUBLIC_* at build time
      NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? 'placeholder-anon-key',
      NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
    })
    return _cache
  }

  // Explicit property access required — Next.js statically replaces NEXT_PUBLIC_* at build time
  const result = clientSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  })
  if (!result.success) {
    const lines = Object.entries(result.error.flatten().fieldErrors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
      .join('\n')
    throw new Error(`❌ Missing or invalid client environment variables:\n${lines}`)
  }
  _cache = result.data
  return _cache
}

export const clientEnv: ClientEnv = new Proxy({} as ClientEnv, {
  get(_, prop) {
    return get()[prop as keyof ClientEnv]
  },
})
