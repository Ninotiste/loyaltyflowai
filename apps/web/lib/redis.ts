import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { serverEnv } from '@loyaltyflowai/config/server'

type RatelimitInstance = {
  limit: (
    identifier: string
  ) => Promise<{ success: boolean; limit: number; remaining: number; reset: number }>
}

let _instances: { redis: Redis; auth: Ratelimit; api: Ratelimit; widget: Ratelimit } | undefined

function getInstance() {
  if (_instances) return _instances
  const r = new Redis({
    url: serverEnv.UPSTASH_REDIS_REST_URL,
    token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
  })
  _instances = {
    redis: r,
    auth: new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      prefix: 'rl:auth',
    }),
    api: new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(100, '1 m'),
      prefix: 'rl:api',
    }),
    widget: new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      prefix: 'rl:widget',
    }),
  }
  return _instances
}

export const redis: Redis = new Proxy({} as Redis, {
  get: (_, prop) => getInstance().redis[prop as keyof Redis],
})

export const authRatelimit: RatelimitInstance = {
  limit: (id) => getInstance().auth.limit(id),
}

export const apiRatelimit: RatelimitInstance = {
  limit: (id) => getInstance().api.limit(id),
}

export const widgetRatelimit: RatelimitInstance = {
  limit: (id) => getInstance().widget.limit(id),
}
