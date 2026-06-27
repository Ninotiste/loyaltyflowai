# DATABASE.md — Schéma de base de données

> **Projet :** LoyaltyFlowAI
> **Version :** 0.1.0
> **Statut :** En conception — Phase 0
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [ARCHITECTURE.md](./ARCHITECTURE.md) | [PRD.md](../product/PRD.md) | [SECURITY.md](./SECURITY.md)

---

## Sommaire

1. [Principes de conception](#1-principes-de-conception)
2. [Entités principales](#2-entités-principales)
3. [Schéma Prisma (MVP)](#3-schéma-prisma-mvp)
4. [Diagramme entité-relation](#4-diagramme-entité-relation)
5. [Stratégie de migration](#5-stratégie-de-migration)
6. [Multi-tenancy et sécurité](#6-multi-tenancy-et-sécurité)
7. [Index et performances](#7-index-et-performances)
8. [Évolutions prévues](#8-évolutions-prévues)

---

## 1. Principes de conception

- **Multi-tenant par `tenant_id`** : toutes les tables de données métier portent un `tenant_id` lié à un `Organization`.
- **Row-Level Security (RLS)** : sécurité au niveau base de données via Supabase RLS.
- **Soft delete** : les enregistrements ne sont jamais physiquement supprimés (RGPD : export puis anonymisation).
- **UUID v4** : toutes les clés primaires sont des UUIDs pour éviter l'énumération.
- **Timestamps** : toutes les tables ont `created_at` et `updated_at`.
- **Convention** : `snake_case` pour les noms de tables et colonnes.

---

## 2. Entités principales

| Entité | Table | Description |
|---|---|---|
| Organisation | `organizations` | Un restaurateur = une organisation (tenant) |
| Membre d'équipe | `team_members` | Utilisateurs ayant accès au dashboard |
| Programme | `loyalty_programs` | Le programme de fidélité de l'organisation |
| Règle de gain | `earning_rules` | Comment les points sont gagnés |
| Récompense | `rewards` | Ce que les points permettent d'obtenir |
| Client | `customers` | Les clients du restaurateur |
| Transaction de points | `point_transactions` | Chaque attribution ou déduction de points |
| Score de churn | `churn_scores` | Score de risque calculé quotidiennement |
| Alerte | `alerts` | Notifications générées pour l'opérateur |
| Audit IA | `ai_audit_log` | Log de chaque décision ou suggestion IA |

---

## 3. Schéma Prisma (MVP)

> Ce schéma est la version de référence. Le fichier source est dans `apps/web/prisma/schema.prisma`.

```prisma
// Tenant principal
model Organization {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique
  logo_url    String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  team_members    TeamMember[]
  loyalty_program LoyaltyProgram?
  customers       Customer[]

  @@map("organizations")
}

// Membres de l'équipe (liés à Supabase Auth)
model TeamMember {
  id              String       @id @default(uuid())
  organization_id String
  user_id         String       @unique // Supabase Auth user ID
  role            TeamRole     @default(MEMBER)
  email           String
  created_at      DateTime     @default(now())
  updated_at      DateTime     @updatedAt

  organization Organization @relation(fields: [organization_id], references: [id])

  @@index([organization_id])
  @@map("team_members")
}

enum TeamRole {
  ADMIN
  MEMBER
}

// Programme de fidélité
model LoyaltyProgram {
  id              String        @id @default(uuid())
  organization_id String        @unique
  name            String
  status          ProgramStatus @default(INACTIVE)
  public_key      String        @unique // Clé publique pour le widget
  inactivity_threshold_days Int @default(30) // Seuil de churn
  primary_color   String?       @default("#000000")
  created_at      DateTime      @default(now())
  updated_at      DateTime      @updatedAt

  organization  Organization   @relation(fields: [organization_id], references: [id])
  earning_rules EarningRule[]
  rewards       Reward[]

  @@map("loyalty_programs")
}

enum ProgramStatus {
  ACTIVE
  INACTIVE
}

// Règles de gain de points
model EarningRule {
  id                 String          @id @default(uuid())
  loyalty_program_id String
  type               EarningRuleType
  points_per_unit    Int             // Points gagnés par unité
  unit_description   String?         // Ex. "visite", "1€ dépensé"
  is_active          Boolean         @default(true)
  created_at         DateTime        @default(now())
  updated_at         DateTime        @updatedAt

  loyalty_program LoyaltyProgram @relation(fields: [loyalty_program_id], references: [id])

  @@index([loyalty_program_id])
  @@map("earning_rules")
}

enum EarningRuleType {
  PER_VISIT
  PER_AMOUNT_SPENT
}

// Récompenses
model Reward {
  id                 String   @id @default(uuid())
  loyalty_program_id String
  name               String
  description        String?
  points_required    Int
  is_active          Boolean  @default(true)
  created_at         DateTime @default(now())
  updated_at         DateTime @updatedAt

  loyalty_program LoyaltyProgram @relation(fields: [loyalty_program_id], references: [id])

  @@index([loyalty_program_id])
  @@map("rewards")
}

// Clients du restaurateur
model Customer {
  id              String    @id @default(uuid())
  organization_id String
  email           String
  first_name      String?
  last_name       String?
  phone           String?
  total_points    Int       @default(0)
  last_visit_at   DateTime?
  deleted_at      DateTime? // Soft delete (RGPD)
  created_at      DateTime  @default(now())
  updated_at      DateTime  @updatedAt

  organization       Organization       @relation(fields: [organization_id], references: [id])
  point_transactions PointTransaction[]
  churn_scores       ChurnScore[]

  @@unique([organization_id, email])
  @@index([organization_id])
  @@index([organization_id, last_visit_at])
  @@map("customers")
}

// Transactions de points
model PointTransaction {
  id           String              @id @default(uuid())
  customer_id  String
  amount       Int                 // Positif = gain, négatif = dépense
  type         PointTransactionType
  reason       String?             // Note manuelle de l'opérateur
  created_at   DateTime            @default(now())

  customer Customer @relation(fields: [customer_id], references: [id])

  @@index([customer_id])
  @@index([customer_id, created_at])
  @@map("point_transactions")
}

enum PointTransactionType {
  EARN_VISIT
  EARN_AMOUNT
  EARN_MANUAL
  REDEEM_REWARD
  ADJUST_MANUAL
}

// Scores de churn
model ChurnScore {
  id          String     @id @default(uuid())
  customer_id String
  score       ChurnLevel
  calculated_at DateTime @default(now())
  days_since_last_visit Int

  customer Customer @relation(fields: [customer_id], references: [id])

  @@index([customer_id])
  @@map("churn_scores")
}

enum ChurnLevel {
  LOW
  MEDIUM
  HIGH
}

// Log d'audit IA
model AiAuditLog {
  id            String   @id @default(uuid())
  entity_type   String   // "customer", "churn_score", etc.
  entity_id     String
  model_used    String   // Ex. "claude-sonnet-4-6"
  model_version String?
  input_summary String?  // Résumé des inputs (pas les données brutes)
  output        String   // Output de l'IA
  created_at    DateTime @default(now())

  @@index([entity_type, entity_id])
  @@map("ai_audit_log")
}
```

---

## 4. Diagramme entité-relation

```
Organization ──< TeamMember
     │
     └── LoyaltyProgram ──< EarningRule
              │
              └──< Reward

Organization ──< Customer ──< PointTransaction
                    │
                    └──< ChurnScore
```

---

## 5. Stratégie de migration

- Les migrations sont générées avec `prisma migrate dev` en développement
- En production : `prisma migrate deploy` via CI/CD (GitHub Actions)
- Chaque migration est testée en staging avant la production
- **Règle :** Aucune migration destructive sans plan de rollback documenté

---

## 6. Multi-tenancy et sécurité

- Toutes les requêtes incluent un filtre `organization_id` au niveau applicatif
- La RLS PostgreSQL (Supabase) ajoute une couche de sécurité au niveau base de données
- Les soft deletes (`deleted_at`) permettent la conformité RGPD sans perte de cohérence des données
- Le `public_key` du programme de fidélité est la seule clé exposée au widget (jamais la clé secrète)

→ [Politique de sécurité complète](./SECURITY.md)

---

## 7. Index et performances

| Index | Table | Colonnes | Justification |
|---|---|---|---|
| `idx_customers_org` | `customers` | `organization_id` | Toutes les requêtes filtrent par org |
| `idx_customers_last_visit` | `customers` | `organization_id, last_visit_at` | Calcul du churn |
| `idx_transactions_customer` | `point_transactions` | `customer_id` | Historique client |
| `idx_transactions_date` | `point_transactions` | `customer_id, created_at` | Historique trié |
| `idx_churn_scores_customer` | `churn_scores` | `customer_id` | Jointure fiche client |

---

## 8. Évolutions prévues

| Phase | Évolution |
|---|---|
| Phase 2 | Table `referrals` (programme parrainage), table `tiers` (niveaux de fidélité) |
| Phase 2 | Table `email_campaigns` (notifications automatisées) |
| Phase 3 | Migration analytiques vers TimescaleDB ou ClickHouse |
| Phase 3 | Table `api_keys` (API publique) |
| Phase 4 | Support multi-programmes par organisation |
