# LoyaltyFlowAI

> Plateforme de fidélisation client intelligente pour la restauration indépendante.

**Statut :** Phase 0 — Fondation | **Version :** 0.1.0-alpha | **Marché :** France

---

## Qu'est-ce que LoyaltyFlowAI ?

LoyaltyFlowAI donne aux restaurateurs les outils d'intelligence artificielle pour transformer leurs clients occasionnels en habitués — sans équipe data, sans budget exorbitant.

→ [Vision complète et stratégie](./MASTER_PLAN.md)

---

## Documentation

| Document | Description |
|---|---|
| [MASTER_PLAN.md](./MASTER_PLAN.md) | Source de vérité — vision, stratégie, stack, roadmap |
| [CHANGELOG.md](./CHANGELOG.md) | Journal des versions |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Conventions de contribution et processus PR |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Guide de développement local |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Guide de déploiement Vercel |
| [docs/product/PRD.md](./docs/product/PRD.md) | Product Requirements Document |
| [docs/technical/ARCHITECTURE.md](./docs/technical/ARCHITECTURE.md) | Décisions d'architecture (ADRs) |
| [docs/technical/DATABASE.md](./docs/technical/DATABASE.md) | Schéma de base de données |
| [docs/technical/API.md](./docs/technical/API.md) | Documentation API |
| [docs/technical/SECURITY.md](./docs/technical/SECURITY.md) | Politiques de sécurité |
| [docs/technical/ENVIRONMENTS.md](./docs/technical/ENVIRONMENTS.md) | Environnements dev / staging / prod |
| [docs/business/PRICING.md](./docs/business/PRICING.md) | Stratégie de pricing |
| [docs/business/GTM.md](./docs/business/GTM.md) | Go-to-market strategy |
| [docs/business/METRICS.md](./docs/business/METRICS.md) | Définition des métriques et KPIs |
| [docs/operations/RUNBOOK.md](./docs/operations/RUNBOOK.md) | Procédures opérationnelles |
| [docs/operations/INCIDENTS.md](./docs/operations/INCIDENTS.md) | Gestion des incidents et post-mortems |

---

## Architecture du projet

```
loyaltyflowai/
├── apps/
│   ├── web/        → Dashboard Next.js 14 (App Router, full-stack)
│   └── worker/     → Service de traitement en arrière-plan (cron, jobs)
└── packages/
    ├── config/     → Validation Zod des variables d'environnement
    ├── logger/     → Logger structuré JSON (compatible Pino/Sentry)
    ├── types/      → Types TypeScript partagés
    ├── ui/         → Composants shadcn/ui partagés
    └── utils/      → Fonctions utilitaires partagées
```

→ [Structure détaillée](./docs/technical/ARCHITECTURE.md) | [Stack technique](./MASTER_PLAN.md#22-stack-cible)

---

## Stack

| Couche | Technologie |
|---|---|
| Framework | Next.js 14+ (App Router, full-stack) |
| Language | TypeScript (strict mode) |
| Base de données | Supabase PostgreSQL (EU Frankfurt) |
| ORM | Prisma |
| Cache | Upstash Redis (EU Ireland) |
| Hosting | Vercel (EU) |
| IA | Claude API (Anthropic) |
| UI | shadcn/ui + Tailwind CSS |
| Monorepo | Turborepo + pnpm workspaces |

---

## Démarrage rapide

**Prérequis :** Node.js ≥ 20, pnpm ≥ 9, comptes Supabase et Upstash.

```bash
# 1. Installer les dépendances
pnpm install

# 2. Configurer les variables d'environnement
cp .env.example apps/web/.env.local
# → Remplir avec les valeurs de dev (voir DEVELOPMENT.md)

# 3. Générer le client Prisma et appliquer les migrations
pnpm --filter @loyaltyflowai/web exec prisma generate
pnpm --filter @loyaltyflowai/web exec prisma migrate dev

# 4. Démarrer le développement
pnpm dev
```

→ [Guide complet](./DEVELOPMENT.md)

---

## Commandes

```bash
pnpm dev          # Démarre tous les packages en mode watch
pnpm build        # Build de production
pnpm type-check   # Vérification TypeScript
pnpm lint         # ESLint sur tous les packages
pnpm test         # Tests unitaires
pnpm format       # Formatage Prettier
```

---

## Roadmap

| Phase | Période | Objectif |
|---|---|---|
| **Phase 0** (en cours) | Q3 2026 | Fondation — infra, auth, design system, design partners |
| Phase 1 | Q4 2026 | MVP — 10 clients payants |
| Phase 2 | Q1 2027 | Traction — intégrations, 100 clients |
| Phase 3 | Q2 2027 | Scale — API publique, mobile, 500 clients |
| Phase 4 | Q3 2027+ | Platform — white-label, marketplace |

→ [Roadmap détaillée](./MASTER_PLAN.md#24-roadmap-générale)

---

*LoyaltyFlowAI — Confidentiel — © 2026*
