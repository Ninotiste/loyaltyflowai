import { createLogger } from '@loyaltyflowai/logger'
import { db } from '@/lib/db'
import type { AiSuggestion } from '@loyaltyflowai/types'

const logger = createLogger('ai')

const isMock = !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'mock'

interface CampaignContext {
  restaurantName: string
  restaurantType: string
  atRiskCount: number
  programName: string
  rewardName: string
  topDayOfWeek: string
}

const MOCK_SUGGESTIONS: AiSuggestion[] = [
  {
    title: 'Campagne vendredi midi — Clients à risque',
    message:
      "Bonjour {prénom} ! Ça fait un moment qu'on ne vous a pas vu. Ce vendredi, profitez d'un tampon bonus pour toute commande. On serait ravis de vous retrouver ! 😊",
    send_at: 'Jeudi 18h (veille du vendredi)',
    reason:
      "Vos clients visitent préférentiellement le vendredi. Envoyer le jeudi soir crée l'anticipation au bon moment.",
    estimated_roi:
      'Si 20 % des clients à risque reviennent, vous générez environ 40 visites supplémentaires.',
  },
  {
    title: 'Offre de réactivation — Surprise du chef',
    message:
      'Bonjour {prénom} ! Nous avons une petite surprise pour vous. Mentionnez cet email lors de votre prochaine visite et recevez un tampon bonus offert.',
    send_at: 'Mardi 11h (avant le déjeuner)',
    reason:
      'Les offres "surprise" ont 30 % de taux d\'ouverture de plus que les promotions habituelles.',
    estimated_roi:
      'Réactivation estimée de 15 à 25 % des clients inactifs, soit une valeur moyenne de 15 € par visite.',
  },
]

export async function suggestCampaign(context: CampaignContext): Promise<AiSuggestion> {
  if (isMock) {
    logger.info('[MOCK AI] Returning hardcoded suggestion', { context })
    return MOCK_SUGGESTIONS[Math.floor(Math.random() * MOCK_SUGGESTIONS.length)]
  }

  const { Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `Tu es Loyalty Brain, l'assistant IA de LoyaltyFlowAI.
Tu aides les gérants de restaurants indépendants français à fidéliser leurs clients.
Tes réponses sont en français, concrètes, orientées action.
Tu utilises un ton bienveillant et positif.

Contexte (JSON) :
${JSON.stringify(context, null, 2)}

Génère une suggestion de campagne email pour réactiver les clients à risque.
Réponds UNIQUEMENT en JSON avec ce format exact :
{
  "title": "...",
  "message": "... (utilise {prénom} pour la personnalisation)",
  "send_at": "...",
  "reason": "...",
  "estimated_roi": "..."
}`

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    let suggestion: AiSuggestion
    try {
      const raw = JSON.parse(text) as Record<string, unknown>
      if (!raw || typeof raw.title !== 'string' || typeof raw.message !== 'string') {
        throw new Error('Missing required fields')
      }
      suggestion = raw as unknown as AiSuggestion
    } catch {
      logger.warn('Claude response invalid, falling back to mock', { preview: text.slice(0, 200) })
      return MOCK_SUGGESTIONS[0]
    }

    // Log for audit
    await db.aiAuditLog.create({
      data: {
        entity_type: 'campaign_suggestion',
        entity_id: context.restaurantName,
        model_used: 'claude-sonnet-4-6',
        input_summary: `${context.atRiskCount} clients à risque, meilleur jour: ${context.topDayOfWeek}`,
        output: text,
      },
    })

    return suggestion
  } catch (err) {
    logger.error('Claude API error, falling back to mock', { error: String(err) })
    return MOCK_SUGGESTIONS[0]
  }
}

export async function generateReactivationMessage(
  firstName: string,
  restaurantName: string,
  daysSinceLastVisit: number
): Promise<string> {
  if (isMock) {
    return `Bonjour ${firstName} ! Ça fait ${daysSinceLastVisit} jours qu'on ne vous a pas vu chez ${restaurantName}. Votre carte de fidélité vous attend — revenez nous voir bientôt ! 😊`
  }

  const { Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    messages: [
      {
        role: 'user',
        content: `Écris un message de réactivation court et chaleureux (max 2 phrases) pour ${firstName}, client de ${restaurantName}, inactif depuis ${daysSinceLastVisit} jours. Ton bienveillant, pas insistant.`,
      },
    ],
  })

  return response.content[0].type === 'text'
    ? response.content[0].text
    : `Bonjour ${firstName}, ${restaurantName} vous manque !`
}
