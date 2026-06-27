import Anthropic from '@anthropic-ai/sdk'
import { serverEnv } from '@loyaltyflowai/config/server'

export const anthropic = new Anthropic({
  apiKey: serverEnv.ANTHROPIC_API_KEY,
})

export const AI_MODEL = 'claude-sonnet-4-6'
