import { NextResponse } from 'next/server'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import type { TeamRole } from '@loyaltyflowai/types'

export interface AuthContext {
  userId: string
  orgId: string
  role: TeamRole
  email: string
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string
  ) {
    super(message)
  }
}

export function apiError(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status })
}

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export async function requireAuth(_request: Request): Promise<AuthContext> {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required')
  }

  const member = await db.teamMember.findUnique({
    where: { user_id: user.id },
    select: { id: true, organization_id: true, role: true, email: true },
  })

  if (!member) {
    throw new ApiError(403, 'NO_ORGANIZATION', 'User has no organization. Complete setup first.')
  }

  return {
    userId: user.id,
    orgId: member.organization_id,
    role: member.role as TeamRole,
    email: member.email,
  }
}

export function requireRole(ctx: AuthContext, allowed: TeamRole[]) {
  if (!allowed.includes(ctx.role)) {
    throw new ApiError(403, 'FORBIDDEN', 'Insufficient permissions')
  }
}

export function withAuth(
  handler: (
    request: Request,
    ctx: AuthContext,
    params?: Record<string, string>
  ) => Promise<Response>
) {
  return async (request: Request, { params }: { params?: Record<string, string> } = {}) => {
    try {
      const auth = await requireAuth(request)
      return await handler(request, auth, params)
    } catch (err) {
      if (err instanceof ApiError) {
        return apiError(err.status, err.code, err.message)
      }
      console.error('[withAuth] unexpected error', err)
      return apiError(500, 'INTERNAL_ERROR', 'An unexpected error occurred')
    }
  }
}
