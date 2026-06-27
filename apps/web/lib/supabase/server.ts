import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { clientEnv } from '@loyaltyflowai/config/client'
import { serverEnv } from '@loyaltyflowai/config/server'

type CookieOptions = Parameters<ReturnType<typeof cookies>['set']>[2]

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // Silently ignored in Server Components (read-only context)
        }
      },
    },
  })
}

export function createServiceClient() {
  return createServerClient(clientEnv.NEXT_PUBLIC_SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  })
}
