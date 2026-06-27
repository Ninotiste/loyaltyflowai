import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { clientEnv } from '@loyaltyflowai/config/client'

const PUBLIC_PATHS = ['/login', '/register', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  if (!user && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/v1/widget).*)'],
}
