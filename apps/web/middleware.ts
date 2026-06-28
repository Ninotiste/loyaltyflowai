import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_PATHS = ['/', '/login', '/register', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname.startsWith(p))

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured (env vars missing or placeholder), redirect unauthenticated paths to login
  if (
    !supabaseUrl ||
    !supabaseAnonKey ||
    supabaseUrl.includes('placeholder') ||
    supabaseAnonKey.includes('placeholder')
  ) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: object }>) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(
              name,
              value,
              options as Parameters<typeof supabaseResponse.cookies.set>[2]
            )
          )
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isPublicPath && pathname !== '/') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  } catch {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/v1/widget).*)'],
}
