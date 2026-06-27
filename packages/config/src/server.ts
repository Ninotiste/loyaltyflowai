import { z } from 'zod'

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required (non-pooled Supabase connection for migrations)'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  UPSTASH_REDIS_REST_URL: z.string().url('UPSTASH_REDIS_REST_URL must be a valid URL'),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1, 'UPSTASH_REDIS_REST_TOKEN is required'),
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, 'ANTHROPIC_API_KEY is required')
    .refine((v) => v.startsWith('sk-ant-'), 'ANTHROPIC_API_KEY must start with sk-ant-'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  CRON_SECRET: z.string().min(32, 'CRON_SECRET must be at least 32 characters long'),
})

export type ServerEnv = z.infer<typeof serverSchema>

let _cache: ServerEnv | undefined

function get(): ServerEnv {
  if (_cache !== undefined) return _cache

  // SKIP_ENV_VALIDATION=1 allows builds and tests without real credentials.
  // Provide placeholder values; the app will fail at runtime if vars are missing.
  if (process.env['SKIP_ENV_VALIDATION'] === '1') {
    _cache = serverSchema.parse({
      NODE_ENV: process.env['NODE_ENV'] ?? 'development',
      DATABASE_URL: process.env['DATABASE_URL'] ?? 'postgresql://localhost:5432/placeholder',
      DIRECT_URL: process.env['DIRECT_URL'] ?? 'postgresql://localhost:5432/placeholder',
      SUPABASE_SERVICE_ROLE_KEY: process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? 'placeholder-key',
      UPSTASH_REDIS_REST_URL: process.env['UPSTASH_REDIS_REST_URL'] ?? 'https://placeholder.upstash.io',
      UPSTASH_REDIS_REST_TOKEN: process.env['UPSTASH_REDIS_REST_TOKEN'] ?? 'placeholder-token',
      ANTHROPIC_API_KEY: process.env['ANTHROPIC_API_KEY'] ?? 'sk-ant-placeholder-key',
      RESEND_API_KEY: process.env['RESEND_API_KEY'] ?? 'placeholder-resend-key',
      CRON_SECRET: process.env['CRON_SECRET'] ?? 'placeholder-cron-secret-32-chars-min',
    })
    return _cache
  }

  const result = serverSchema.safeParse(process.env)
  if (!result.success) {
    const lines = Object.entries(result.error.flatten().fieldErrors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(', ')}`)
      .join('\n')
    throw new Error(`❌ Missing or invalid server environment variables:\n${lines}`)
  }
  _cache = result.data
  return _cache
}

export const serverEnv: ServerEnv = new Proxy({} as ServerEnv, {
  get(_, prop) {
    return get()[prop as keyof ServerEnv]
  },
})
