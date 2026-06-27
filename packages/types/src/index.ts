// ─── Enums ────────────────────────────────────────────────────────────────────

export type TeamRole = 'ADMIN' | 'MEMBER'

export type ProgramStatus = 'ACTIVE' | 'INACTIVE'

export type EarningRuleType = 'PER_VISIT' | 'PER_AMOUNT_SPENT'

export type PointTransactionType =
  | 'EARN_VISIT'
  | 'EARN_AMOUNT'
  | 'EARN_MANUAL'
  | 'REDEEM_REWARD'
  | 'ADJUST_MANUAL'

export type ChurnLevel = 'LOW' | 'MEDIUM' | 'HIGH'

// ─── Entités métier ───────────────────────────────────────────────────────────

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  created_at: Date
  updated_at: Date
}

export interface TeamMember {
  id: string
  organization_id: string
  user_id: string
  role: TeamRole
  email: string
  created_at: Date
  updated_at: Date
}

export interface LoyaltyProgram {
  id: string
  organization_id: string
  name: string
  status: ProgramStatus
  public_key: string
  inactivity_threshold_days: number
  primary_color: string | null
  created_at: Date
  updated_at: Date
}

export interface EarningRule {
  id: string
  loyalty_program_id: string
  type: EarningRuleType
  points_per_unit: number
  unit_description: string | null
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Reward {
  id: string
  loyalty_program_id: string
  name: string
  description: string | null
  points_required: number
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface Customer {
  id: string
  organization_id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  total_points: number
  last_visit_at: Date | null
  deleted_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface PointTransaction {
  id: string
  customer_id: string
  amount: number
  type: PointTransactionType
  reason: string | null
  created_at: Date
}

export interface ChurnScore {
  id: string
  customer_id: string
  score: ChurnLevel
  calculated_at: Date
  days_since_last_visit: number
}

export interface AiAuditLog {
  id: string
  entity_type: string
  entity_id: string
  model_used: string
  model_version: string | null
  input_summary: string | null
  output: string
  created_at: Date
}

// ─── Payloads API ─────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
  }
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface CustomerWithChurn extends Customer {
  churn_score: ChurnLevel | null
}

export interface DashboardMetrics {
  active_customers: number
  at_risk_customers: number
  points_issued_30d: number
  rewards_redeemed_30d: number
  return_rate: number
  active_customers_change: number
  at_risk_customers_change: number
  points_issued_change: number
}
