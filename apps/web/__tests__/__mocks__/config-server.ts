export const serverEnv = {
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  DIRECT_URL: 'postgresql://test:test@localhost:5432/test',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  UPSTASH_REDIS_REST_URL: 'https://test.upstash.io',
  UPSTASH_REDIS_REST_TOKEN: 'test-token',
  ANTHROPIC_API_KEY: 'mock',
  RESEND_API_KEY: 'mock',
  CRON_SECRET: 'test-secret-that-is-at-least-32-chars-long',
  NODE_ENV: 'test' as const,
}
