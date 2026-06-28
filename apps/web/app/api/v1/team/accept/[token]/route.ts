import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { apiError } from '@/lib/auth'
import { createClient as createSupabaseServerClient } from '@/lib/supabase/server'

// Public endpoint — no requireAuth (token IS the auth)
export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    const invitation = await db.invitation.findUnique({
      where: { token },
      include: { organization: { select: { id: true, name: true, slug: true } } },
    })

    if (!invitation) return apiError(404, 'INVALID_TOKEN', 'Invitation not found')
    if (invitation.accepted_at)
      return apiError(409, 'ALREADY_ACCEPTED', 'This invitation has already been used')
    if (invitation.expires_at < new Date())
      return apiError(410, 'EXPIRED', 'This invitation has expired')

    // Verify Supabase user from cookie
    const supabase = createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // Not logged in — redirect to register with invitation context
      const redirectUrl = `/register?invitation=${token}&email=${encodeURIComponent(invitation.email)}`
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    if (user.email !== invitation.email) {
      return apiError(
        403,
        'EMAIL_MISMATCH',
        `This invitation was sent to ${invitation.email}. Please log in with that account.`
      )
    }

    // Accept invitation — create TeamMember + mark invitation accepted
    await db.$transaction([
      db.teamMember.create({
        data: {
          organization_id: invitation.organization_id,
          user_id: user.id,
          email: invitation.email,
          role: invitation.role,
        },
      }),
      db.invitation.update({
        where: { token },
        data: { accepted_at: new Date() },
      }),
    ])

    return NextResponse.redirect(new URL('/dashboard', request.url))
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string }
      return apiError(e.status, e.code, e.message)
    }
    return apiError(500, 'INTERNAL_ERROR', 'Failed to accept invitation')
  }
}
