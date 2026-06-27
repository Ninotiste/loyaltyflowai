import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { serverEnv } from '@loyaltyflowai/config/server'

export const redis = new Redis({
  url: serverEnv.UPSTASH_REDIS_REST_URL,
  token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
})

export const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  prefix: 'rl:auth',
})

export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  prefix: 'rl:api',
})

export const widgetRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'),
  prefix: 'rl:widget',
})
