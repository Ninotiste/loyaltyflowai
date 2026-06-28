# Changelog

> Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)
> Versioning : [Semantic Versioning](https://semver.org/lang/fr/)

---

## [Non publié]

## [0.4.0] — Amélioration maximale — 2026-06-28

### Sécurité (P0 résolus)

- `lib/email.ts` — `htmlEscape()` exportée, appliquée sur toutes les variables user-controlled dans les 6 templates email (injection HTML impossible)
- `lib/widget-token.ts` — Nouveau module centralisé pour JWT widget : throw explicite en production si `CRON_SECRET` absent (élimine le fallback prévisible `dev-secret-change-in-prod`)
- `lib/ai.ts` — Contexte passé via `JSON.stringify()` (prévient l'injection de prompt) ; validation de schéma sur `JSON.parse()` de la réponse Claude avec fallback loggué
- Routes widget × 4 — Rate limiting `widgetRatelimit` (60 req/min/IP) avec fallback gracieux si Redis indisponible ; import du module `widget-token` partagé (suppression duplication)
- `public/widget.js` — Sanitisation des inputs dans les deux panels : email (trim, lowercase, regex, max 254) et firstName (strip HTML chars, max 100)

### Qualité code

- `.eslintrc.json` — `no-console: ["warn", { allow: ["warn", "error"] }]` (logs exposés bloqués)
- `next.config.mjs` — Header `Content-Security-Policy` ajouté (default-src self, connect-src supabase + anthropic, frame-ancestors none)
- Suppression des 4 fichiers stubs morts : `(dashboard)/customers/`, `(dashboard)/customers/[id]/`, `(dashboard)/program/`, `(dashboard)/settings/`

### Tests (16 nouveaux)

- `apps/web/__tests__/email-escape.test.ts` — 8 tests pour `htmlEscape()` (XSS, encodage, cas limites)
- `apps/web/__tests__/widget-token.test.ts` — 8 tests JWT (sign/verify, secret différent, tamper, production throw, dev fallback)
- `apps/web/jest.config.js` — Config Jest + ts-jest pour apps/web, alias paths, mock jose ESM

### Developer Experience

- `husky` + `lint-staged` installés : pre-commit hook déclenche ESLint + Prettier sur `.ts/.tsx`
- `turbo.json` — task test : `outputs: [], cache: false` (suppression warnings Turbo)

**Résultat :** 42/42 tests, 0 erreur TypeScript, score sécurité : 52 → 78/100

## [0.3.0] — MVP Sprint Code — 2026-06-28

### Ajouté — API REST complète (26 endpoints)

- `POST /api/v1/auth/setup` — Setup organisation + admin Supabase
- `GET|POST|PATCH /api/v1/programs/current` — Programme de fidélité CRUD
- `POST|DELETE /api/v1/programs/earning-rules` — Règles de gain
- `POST|PATCH|DELETE /api/v1/programs/rewards` — Récompenses
- `GET|POST /api/v1/customers` — Liste paginée (cursor-based) + création
- `GET|PATCH|DELETE /api/v1/customers/[id]` — Profil client
- `POST /api/v1/customers/[id]/points` — Attribution points (montant ou manuel)
- `POST /api/v1/customers/[id]/redeem` — Utilisation récompense
- `GET /api/v1/customers/[id]/export` — Export RGPD JSON (Art.15)
- `POST /api/v1/customers/[id]/anonymize` — Anonymisation RGPD (Art.17)
- `GET|POST /api/v1/team` — Membres + invitations par email
- `DELETE /api/v1/team/[memberId]` — Révocation accès
- `GET /api/v1/team/accept/[token]` — Acceptation invitation (public)
- `GET /api/v1/dashboard/metrics` — KPIs dashboard
- `POST|GET|GET /api/v1/widget/*` — Widget identify, register, status, redeem
- `GET|POST|GET /api/v1/billing/*` — Subscription, upgrade, invoices
- `POST /api/v1/ai/suggest` — Suggestion campagne IA (Claude/mock)
- `POST /api/v1/alerts/send-reactivation` — Email réactivation client

### Ajouté — Dashboard complet

- Auth Supabase réelle (login + register + invitation flow)
- `/dashboard` — Métriques réelles depuis API
- `/dashboard/customers` — Liste avec badges churn, recherche, pagination
- `/dashboard/customers/[id]` — Profil complet, attribution, export RGPD
- `/dashboard/program` — Éditeur programme, règles, récompenses
- `/dashboard/settings` — Équipe, abonnement (plans), RGPD
- `/dashboard/alerts` — Clients à risque + suggestion Loyalty Brain
- `/dashboard/analytics` — Distribution clients, recommandations IA
- `/onboarding` — Flow 4 étapes guidé (< 30 min)

### Ajouté — Widget JS

- `public/widget.js` — Widget vanilla JS + Shadow DOM
- Flux complet inscription → identification → carte → récompense
- JWT widget (7 jours) stocké en sessionStorage

### Ajouté — Librairies

- `apps/web/lib/auth.ts` — requireAuth(), apiError(), apiSuccess()
- `apps/web/lib/ai.ts` — suggestCampaign(), generateReactivationMessage()
- `apps/web/lib/email.ts` — 6 templates email (mock Resend)
- `apps/web/lib/stripe.ts` — Billing mock Stripe

### Ajouté — Tests

- 26 tests unitaires Jest dans `packages/utils/src/__tests__/`
- Coverage : churn.ts, crypto.ts, format.ts

### Ajouté — Qualité

- 0 erreur TypeScript (7 packages vérifiés)
- `app/error.tsx` + `app/loading.tsx` — Error boundaries
- `docs/SPRINT_REPORT_V1.md` — Rapport de sprint complet

## [0.2.0] — Foundation Sprint V1 — 2026-06-28

### Ajouté — Documentation produit

- `docs/product/PRODUCT_BIBLE.md` (v1.0.0) — Source de vérité produit complète : Vision, JTBD (10 jobs), 5 Personas avec Empathy Maps, Customer Journey, 4 User Flows Mermaid, Feature Map MoSCoW, MVP/V2/V3, OKRs, NSM, Business Model Canvas, Lean Canvas, SWAT, Analyse concurrentielle (8 concurrents), Risques, Hypothèses, Glossaire
- `docs/product/user-stories/US-007-billing.md` — Gestion de l'abonnement (Stripe, factures, flow anti-churn)
- `docs/product/user-stories/US-008-rgpd.md` — Conformité RGPD (export, suppression, registre des traitements)
- `docs/product/user-stories/US-009-onboarding.md` — Onboarding guidé 4 étapes (< 30 min)
- `docs/product/user-stories/US-010-team.md` — Gestion de l'équipe (rôles Admin/Manager/Employé)
- `docs/product/user-stories/US-011-widget-client.md` — Expérience client final sur le widget JS

### Ajouté — Documentation business

- `docs/business/COMPETITIVE_ANALYSIS.md` (v1.0.0) — Analyse approfondie de 10 concurrents : FidMe, Loopy Loyalty, StampMe, Lightspeed, Toast, Square, Clover, Panthera, Apple Wallet, Google Wallet — Matrice comparative, analyse des prix, gaps de marché, stratégie de différenciation

### Ajouté — Documentation customer

- `docs/customer/CUSTOMER_LIFECYCLE.md` (v1.0.0) — Cycle de vie client final en 9 étapes : Découverte → Acquisition → Activation → 1ère visite → 1ère récompense → Rétention → Référence → Churn → Réactivation — Métriques par étape, points de friction, séquences d'emails

### Ajouté — Documentation UX

- `docs/ux/SCREENS.md` (v1.0.0) — Documentation UX complète : tous les écrans (login, onboarding, dashboard, clients, analytics, settings, widget), wireframes textuels, états (empty, loading, error), micro-interactions, animations, notifications, design tokens

### Ajouté — Documentation IA

- `docs/ai/LOYALTY_BRAIN.md` (v1.0.0) — Architecture IA complète à 3 niveaux : churn scoring heuristique → scoring multi-facteurs → ML propriétaire, segmentation intelligente, moteur de recommandations (Claude API), campagnes automatisées, analytics IA, considérations RGPD

### Ajouté — Documentation technique

- `docs/technical/DISCOVERY.md` (v1.0.0) — Technical Discovery complète : 8 modules applicatifs (Auth, Organisation, Programme, Clients, Points, IA, Widget, Billing), 3 flux de données détaillés avec diagrammes, threat model sécurité, stratégie de scalabilité par phase, CI/CD, observabilité

### Ajouté — Audit et revue

- `docs/AUDIT.md` (v1.0.0) — Audit complet : inventaire 25 documents, score global 6.2/10, 7 faiblesses critiques identifiées, 8 documents manquants, plan de remédiation priorisé
- `docs/INVESTMENT_REVIEW.md` (v1.0.0) — Revue multi-perspectives (VC, CTO, PM, restaurateur, dev) — 5 risques P0 identifiés, 5 forces à valoriser
- `docs/TODO.md` (v1.0.0) — Liste d'actions prioritisées P0 → P3 (35 actions documentées)
- `DECISIONS.md` (v1.0.0) — Registre des 20+ décisions ouvertes (produit, tech, business, GTM)

### Modifié

- `README.md` — Navigation complète vers tous les nouveaux documents, structure par catégorie
- `MASTER_PLAN.md` (v0.3.0 → v0.4.0) — Correction IC-01 (widget = MVP) et IC-02 (widget ajouté §12)

### Incohérences résolues

- **IC-01** : Widget classifié comme MVP Must Have (était incorrectement en Phase 3 dans MASTER_PLAN §13)
- **IC-02** : Widget ajouté à la liste des features MVP de MASTER_PLAN §12

### Ajouté

- `packages/config` — Validation lazy des variables d'environnement avec Zod (pattern Proxy + `SKIP_ENV_VALIDATION`)
- `packages/logger` — Logger structuré JSON avec méthode `child(ctx)` pour le contexte persistant
- Security headers HTTP dans `next.config.mjs` (X-Frame-Options, HSTS, CSP referrer, Permissions-Policy)
- Index Prisma `@@index([organization_id, deleted_at])` sur `Customer` pour les requêtes soft-delete
- Env passthrough `SKIP_ENV_VALIDATION` et `NEXT_PUBLIC_*` dans `turbo.json`
- Étape `Build` dans CI avec `SKIP_ENV_VALIDATION=1`
- Configuration Jest avec `ts-jest` dans `packages/utils`
- `CONTRIBUTING.md`, `DEVELOPMENT.md`, `DEPLOYMENT.md` — guides de développement

### Modifié

- `packages/config` — Passage de validation eager à lazy (n'échoue plus à l'import)
- `packages/logger` — Ajout de `child(ctx: LogContext): Logger` à l'interface
- `apps/web/next.config.mjs` — `poweredByHeader: false`, headers de sécurité
- `.github/workflows/ci.yml` — Ajout étape Build, timeout 20min
- `docs/technical/ARCHITECTURE.md` — Structure monorepo mise à jour (packages/config, packages/logger)
- `docs/technical/ENVIRONMENTS.md` — Ajout DIRECT_URL, CRON_SECRET, SKIP_ENV_VALIDATION

---

## [0.1.0-alpha] — 2026-06-27

### Sécurité (P0)

- `packages/utils/src/crypto.ts` — `Math.random()` remplacé par `crypto.randomBytes(24)` pour `generatePublicKey()`
- `apps/web/lib/db.ts` — Singleton Prisma corrigé (cache en production rétabli)
- `apps/web/prisma/schema.prisma` — `directUrl = env("DIRECT_URL")` séparé de `DATABASE_URL`
- `.env.example` — Ajout de `CRON_SECRET` et `DIRECT_URL`

### Ajouté

- `packages/config` (nouveau) — Validation Zod des variables d'environnement (serveur + client)
- `packages/logger` (nouveau) — Logger structuré JSON compatible Pino/Sentry/OpenTelemetry
- `apps/web/lib/services/calculateChurn.ts` — Implémentation du job churn avec pattern adaptateur
- `packages/utils/src/services/calculateChurn.ts` — Logique partagée du job churn (batch 500, upsert)

### Modifié

- `apps/web/prisma/schema.prisma` — `ChurnScore` : ajout `scored_date` + `@@unique([customer_id, scored_date])`
- `apps/web/next.config.ts` → `apps/web/next.config.mjs` (Next.js 14.x ne supporte pas `.ts`)
- `apps/worker/tsconfig.json` — `"noEmit": false` explicite
- `.eslintrc.json` (racine) — Configuration ESLint de base
- `.gitignore` — Correction du pattern `migration_lock.toml`

### Supprimé

- `apps/web/jobs/` — Dossier non-standard (remplacé par `lib/services/`)
- `apps/api/` — Dossier vide supprimé
- `@tanstack/react-query-devtools` — Déplacé de `dependencies` vers `devDependencies`

---

## [0.0.1] — 2026-06-27

### Ajouté

- Structure documentaire complète du projet
- MASTER_PLAN.md v0.2.0 — toutes les questions ouvertes résolues
- README.md, CHANGELOG.md et architecture de dossiers initiale
- MASTER_PLAN.md v0.1.0 — document fondateur du projet
- Arborescence de dossiers initiale (apps, docs, packages, infra, tests)
- Décisions structurantes : stack, segment, pricing, marché géographique

---

_Les releases de code suivront les milestones Phase 0 → Phase 1 → Phase 2._
