import { createLogger } from '@loyaltyflowai/logger'

const logger = createLogger('email')

export function htmlEscape(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

interface EmailPayload {
  to: string
  subject: string
  html: string
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey || apiKey === 'mock') {
    // Mock mode — log to console
    logger.info('📧 [MOCK EMAIL]', {
      to: payload.to,
      subject: payload.subject,
      preview: payload.html.slice(0, 200).replace(/<[^>]+>/g, ''),
    })
    return
  }

  const { Resend } = await import('resend')
  const resend = new Resend(apiKey)
  await resend.emails.send({
    from: 'LoyaltyFlowAI <noreply@loyaltyflowai.fr>',
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  })
}

export async function sendWelcomeRestaurant(to: string, restaurantName: string): Promise<void> {
  await sendEmail({
    to,
    subject: `Bienvenue sur LoyaltyFlowAI 🎉`,
    html: `
      <h1>Bienvenue sur LoyaltyFlowAI !</h1>
      <p>Votre compte pour <strong>${htmlEscape(restaurantName)}</strong> est prêt.</p>
      <p>Commencez par configurer votre programme de fidélité.</p>
      <a href="${htmlEscape(process.env.NEXT_PUBLIC_APP_URL ?? 'https://loyaltyflowai.fr')}/onboarding" style="background:#2563EB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">
        Configurer mon programme
      </a>
    `,
  })
}

export async function sendTeamInvitation(
  to: string,
  restaurantName: string,
  inviteLink: string
): Promise<void> {
  await sendEmail({
    to,
    subject: `Invitation à rejoindre ${htmlEscape(restaurantName)} sur LoyaltyFlowAI`,
    html: `
      <h1>Vous avez été invité !</h1>
      <p><strong>${htmlEscape(restaurantName)}</strong> vous invite à rejoindre leur espace LoyaltyFlowAI.</p>
      <a href="${htmlEscape(inviteLink)}" style="background:#2563EB;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">
        Accepter l'invitation
      </a>
      <p style="margin-top:16px;color:#6B7280;font-size:14px">Ce lien est valide 7 jours.</p>
    `,
  })
}

export async function sendWelcomeCustomer(
  to: string,
  firstName: string,
  restaurantName: string,
  programName: string
): Promise<void> {
  await sendEmail({
    to,
    subject: `Bienvenue chez ${htmlEscape(restaurantName)} 🎁`,
    html: `
      <h1>Bienvenue, ${htmlEscape(firstName)} !</h1>
      <p>Vous venez de rejoindre le programme de fidélité <strong>${htmlEscape(programName)}</strong> de ${htmlEscape(restaurantName)}.</p>
      <p>Chaque visite vous rapproche d'une récompense.</p>
    `,
  })
}

export async function sendRewardUnlocked(
  to: string,
  firstName: string,
  restaurantName: string,
  rewardName: string
): Promise<void> {
  await sendEmail({
    to,
    subject: `Votre récompense est prête chez ${htmlEscape(restaurantName)} 🎊`,
    html: `
      <h1>Félicitations, ${htmlEscape(firstName)} !</h1>
      <p>Vous avez débloqué votre récompense : <strong>${htmlEscape(rewardName)}</strong></p>
      <p>Mentionnez-la lors de votre prochaine visite chez ${htmlEscape(restaurantName)}.</p>
    `,
  })
}

export async function sendChurnAlert(
  to: string,
  restaurantName: string,
  atRiskCount: number
): Promise<void> {
  await sendEmail({
    to,
    subject: `⚠️ ${atRiskCount} client(s) à risque chez ${htmlEscape(restaurantName)}`,
    html: `
      <h1>Alerte fidélité</h1>
      <p><strong>${atRiskCount} client(s)</strong> de ${htmlEscape(restaurantName)} n'ont pas visité depuis plus de 60 jours.</p>
      <p>Il est temps de les réactiver !</p>
      <a href="${htmlEscape(process.env.NEXT_PUBLIC_APP_URL ?? 'https://loyaltyflowai.fr')}/dashboard/alerts" style="background:#DC2626;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">
        Voir les alertes
      </a>
    `,
  })
}

export async function sendReactivationEmail(
  to: string,
  firstName: string,
  restaurantName: string,
  customMessage: string
): Promise<void> {
  await sendEmail({
    to,
    subject: `${htmlEscape(restaurantName)} vous a réservé une surprise 🎁`,
    html: `
      <h1>Bonjour ${htmlEscape(firstName)},</h1>
      <p>${htmlEscape(customMessage)}</p>
      <p style="color:#6B7280;font-size:14px;margin-top:24px">
        Cet email vous a été envoyé par ${htmlEscape(restaurantName)} via LoyaltyFlowAI.
      </p>
    `,
  })
}
