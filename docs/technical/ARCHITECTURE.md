# ARCHITECTURE.md — Décisions d'architecture

> **Projet :** LoyaltyFlowAI
> **Version :** 0.2.0
> **Statut :** Phase 0 — Fondation (post-hardening)
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [MASTER_PLAN.md §22](../../MASTER_PLAN.md#22-stack-cible) | [DATABASE.md](./DATABASE.md) | [ENVIRONMENTS.md](./ENVIRONMENTS.md)

---

## Sommaire

1. [Vue d'ensemble du système](#1-vue-densemble-du-système)
2. [Décisions d'architecture (ADRs)](#2-décisions-darchitecture-adrs)
3. [Structure du monorepo](#3-structure-du-monorepo)
4. [Flux de données principaux](#4-flux-de-données-principaux)
5. [Stratégie de scalabilité](#5-stratégie-de-scalabilité)
6. [ADRs — Archive](#6-adrs--archive)

---

## 1. Vue d'ensemble du système

LoyaltyFlowAI est une application **SaaS multi-tenant** construite sur un **monorepo Turborepo** avec une architecture **Next.js full-stack**.

```
┌─────────────────────────────────────────────────────────┐
│                    Internet                             │
└──────────────┬──────────────────────┬───────────────────┘
               │                      │
     ┌─────────▼──────────┐  ┌────────▼───────────┐
     │   Dashboard Web    │  │    Widget JS       │
     │  (restaurateur)    │  │ (client du resto)  │
     │   Next.js + Vercel │  │   Script embarqué  │
     └─────────┬──────────┘  └────────┬───────────┘
               │                      │
     ┌─────────▼──────────────────────▼───────────┐
     │              Next.js API Routes             │
     │          (Route Handlers — /api/v1)         │
     └──────┬──────────────┬──────────────┬────────┘
            │              │              │
   ┌────────▼────┐  ┌──────▼──────┐  ┌───▼────────────┐
   │  Supabase   │  │   Upstash   │  │   Claude API   │
   │  PostgreSQL │  │    Redis    │  │  (Anthropic)   │
   │  + Auth     │  │   (Cache)   │  │  (Suggestions) │
   └─────────────┘  └─────────────┘  └────────────────┘
            │
   ┌────────▼────────────┐
   │   Worker Service    │
   │ (Calcul churn, jobs │
   │  quotidiens)        │
   └─────────────────────┘
```

---

## 2. Décisions d'architecture (ADRs)

### ADR-001 — Next.js Full-Stack (API Routes)
- **Date :** 2026-06-27
- **Statut :** Acceptée
- **Contexte :** Fondateur solo, besoin de livrer vite, pas de DevOps dédié.
- **Décision :** Architecture full-stack Next.js avec App Router et Route Handlers. Pas de backend NestJS séparé pour le MVP.
- **Conséquences :** Déploiement simplifié sur Vercel. Partage de types entre UI et API via les packages partagés du monorepo. Limitation : si le backend doit être exposé à des clients tiers (API publique), il faudra refactorer en Phase 3.
- **Alternatives rejetées :** NestJS séparé (trop complexe pour Phase 0-1), Hono (moins d'écosystème).

### ADR-002 — Monorepo Turborepo
- **Date :** 2026-06-27
- **Statut :** Acceptée
- **Contexte :** Besoin de partager des types TypeScript entre le dashboard et le worker. Fondateur solo.
- **Décision :** Monorepo géré par Turborepo avec `apps/web`, `apps/worker`, `packages/config`, `packages/logger`, `packages/ui`, `packages/types`, `packages/utils`.
- **Conséquences :** Un seul `git push` deploy tout. Cache de build partagé. Complexité initiale de setup.
- **Alternatives rejetées :** Repos séparés (friction trop élevée), Nx (plus complexe que Turborepo pour ce cas).

### ADR-003 — Vercel + Supabase + Upstash
- **Date :** 2026-06-27
- **Statut :** Acceptée
- **Contexte :** Contrainte RGPD (données EU), budget < 500€/mois, zéro DevOps.
- **Décision :** Vercel (EU - Frankfurt) pour l'hébergement, Supabase (EU) pour PostgreSQL + Auth, Upstash (EU) pour Redis.
- **Conséquences :** Données hébergées en EU (conformité RGPD). Coût estimé MVP : 0-50€/mois. Vendor lock-in partiel sur Supabase Auth.
- **Alternatives rejetées :** AWS (trop de DevOps pour Phase 0), Scaleway (moins de services managés).

### ADR-004 — Prisma comme ORM
- **Date :** 2026-06-27
- **Statut :** Acceptée
- **Contexte :** TypeScript first, besoin de migrations et d'un schéma typé.
- **Décision :** Prisma comme ORM principal. Les migrations sont versionnées et appliquées via CI/CD.
- **Conséquences :** Génération de types automatique depuis le schéma. Légère overhead pour les requêtes complexes.
- **Alternatives rejetées :** Drizzle (moins mature en 2026), Knex (pas de types auto).

### ADR-005 — Multi-tenancy par Row-Level Security (RLS)
- **Date :** 2026-06-27
- **Statut :** Proposée — à valider en Phase 0
- **Contexte :** SaaS multi-tenant : chaque restaurateur ne doit voir que ses propres données.
- **Décision :** Utiliser la Row-Level Security (RLS) de PostgreSQL via Supabase, combinée à un champ `organization_id` sur toutes les tables.
- **Conséquences :** Isolation des données garantie au niveau base de données. Légère complexité de configuration initiale.
- **Alternatives rejetées :** Base de données séparée par tenant (trop coûteux), isolation uniquement applicative (risque de fuite de données).

### ADR-006 — Validation lazy des variables d'environnement
- **Date :** 2026-06-27
- **Statut :** Acceptée
- **Contexte :** La validation eager (à l'import du module) empêchait `pnpm build` sans vraies credentials. Le CI devait avoir des secrets réels même pour vérifier la compilation.
- **Décision :** Utiliser un Proxy ES6 dans `packages/config` pour que la validation Zod soit déclenchée uniquement lors du premier accès à une variable, pas à l'import. Ajout du flag `SKIP_ENV_VALIDATION=1` qui remplace les variables manquantes par des valeurs placeholder.
- **Conséquences :** `pnpm build` fonctionne sans credentials (CI propre). La validation échoue toujours au runtime si une variable est absente. Légère complexité du Proxy.
- **Alternatives rejetées :** Variables d'env hardcodées en CI (risque de fuite), validation uniquement en production (détection tardive).

### ADR-007 — Packages supplémentaires non créés en Phase 0
- **Date :** 2026-06-27
- **Statut :** Acceptée
- **Contexte :** Évaluation des packages `database`, `auth`, `emails`, `queue`, `analytics`, `ai`, `validation`, `testing`.
- **Décision :** Aucun de ces packages n'est créé en Phase 0. Raisons par package :
  - `packages/database` — Prisma est déjà isolé dans `apps/web`. Extraire en Phase 1 si le worker en a besoin.
  - `packages/auth` — Couplé à Next.js/Supabase. Extraire uniquement si un autre client OAuth est ajouté.
  - `packages/emails` — Pas d'emails implémentés. Ajouter Resend directement dans `apps/web/lib/` en Phase 1.
  - `packages/queue` — Pas de queue système en Phase 0. Le worker utilise des crons simples.
  - `packages/analytics` — Pas d'analytics implémentés. Ajouter PostHog en Phase 1 directement.
  - `packages/ai` — Une seule intégration Claude. Extraire si plusieurs modèles ou clients AI en Phase 2.
  - `packages/validation` — Zod est déjà dans `packages/config`. Les schémas API iront dans `apps/web/lib/` en Phase 1.
  - `packages/testing` — Pas de tests d'intégration complexes en Phase 0. Évaluer en Phase 1.
- **Conséquences :** Monorepo plus simple. Refactoring nécessaire en Phase 1 si les besoins évoluent.

---

## 3. Structure du monorepo

```
loyaltyflowai/                     ← Racine Turborepo
├── turbo.json                     ← Configuration Turborepo (tasks + env cache)
├── package.json                   ← Root package.json (workspaces pnpm)
├── tsconfig.json                  ← Config TypeScript de base (strict mode)
├── .eslintrc.json                 ← Config ESLint de base
│
├── apps/
│   ├── web/                       ← Next.js 14 full-stack (App Router)
│   │   ├── app/
│   │   │   ├── (dashboard)/       ← Routes protégées (restaurateur)
│   │   │   │   ├── page.tsx       ← Tableau de bord
│   │   │   │   ├── customers/     ← Gestion des clients
│   │   │   │   ├── program/       ← Programme de fidélité
│   │   │   │   └── settings/      ← Paramètres
│   │   │   ├── (auth)/            ← Routes publiques (login, register)
│   │   │   └── api/
│   │   │       └── v1/
│   │   │           ├── health/    ← Health check
│   │   │           ├── cron/      ← Jobs cron (calculate-churn)
│   │   │           ├── programs/
│   │   │           ├── customers/
│   │   │           └── widget/    ← API publique widget (clé publique)
│   │   ├── lib/
│   │   │   ├── db.ts              ← Singleton Prisma
│   │   │   ├── redis.ts           ← Client Upstash Redis
│   │   │   ├── anthropic.ts       ← Client Claude API
│   │   │   ├── supabase/
│   │   │   │   ├── server.ts      ← Client Supabase (Server Components)
│   │   │   │   └── client.ts      ← Client Supabase (Browser)
│   │   │   └── services/
│   │   │       └── calculateChurn.ts ← Adaptateur Prisma pour le job churn
│   │   └── prisma/
│   │       └── schema.prisma
│   │
│   └── worker/                    ← Service de jobs (cron, queues)
│       └── src/
│           ├── jobs/
│           │   └── calculateChurn.ts ← Adaptateur Prisma pour le worker
│           └── index.ts
│
└── packages/
    ├── config/                    ← Validation Zod lazy des env vars
    │   └── src/
    │       ├── server.ts          ← Variables serveur (DB, Supabase, Redis, etc.)
    │       ├── client.ts          ← Variables publiques (NEXT_PUBLIC_*)
    │       └── index.ts           ← Re-exports
    ├── logger/                    ← Logger structuré JSON
    │   └── src/
    │       └── index.ts           ← createLogger(name) + child(ctx)
    ├── types/                     ← Types TypeScript partagés
    ├── ui/                        ← Composants shadcn/ui partagés
    └── utils/                     ← Fonctions utilitaires pures
        └── src/
            ├── crypto.ts          ← generatePublicKey() (crypto.randomBytes)
            └── services/
                └── calculateChurn.ts ← Logique core du job churn (pattern adaptateur)
```

---

## 4. Flux de données principaux

### Flux 1 — Attribution de points (restaurateur)
```
Dashboard → POST /api/v1/customers/{id}/points
         → Validation (Zod)
         → Prisma: INSERT point_transaction
         → Prisma: UPDATE customer.total_points
         → Cache Redis invalidé
         → Réponse 201
```

### Flux 2 — Consultation du widget (client final)
```
Widget JS → GET /api/v1/widget/customer?email={email}
          → Vérification clé publique (organization_id)
          → Cache Redis (TTL 60s)
          → Si cache miss → Prisma: SELECT customer + points + rewards
          → Réponse 200 avec données client
```

### Flux 3 — Calcul des scores de churn (quotidien)
```
Cron (00:00) → POST /api/v1/cron/calculate-churn (Authorization: Bearer CRON_SECRET)
             → runCalculateChurnJob(adaptor) [packages/utils]
             → Par organisation → batch de 500 clients
             → Calcul du score (heuristique days_since_last_visit)
             → Prisma: UPSERT churn_scores (1 score par client par jour)
             → Log structuré JSON
```

---

## 5. Stratégie de scalabilité

| Phase | Charge estimée | Architecture |
|---|---|---|
| MVP (Phase 1) | 10-50 tenants, ~10K req/jour | Next.js Vercel (serverless) |
| Traction (Phase 2) | 100-500 tenants, ~500K req/jour | Vercel + Supabase Pro + Upstash Growth |
| Scale (Phase 3) | 500-2000 tenants, ~5M req/jour | Évaluer migration vers AWS / architecture microservices |

---

## 6. ADRs — Archive

Les ADRs obsolètes ou refusées sont archivées ici avec leur justification.

*Aucun ADR archivé pour l'instant.*
