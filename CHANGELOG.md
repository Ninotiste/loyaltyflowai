# Changelog

> Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)
> Versioning : [Semantic Versioning](https://semver.org/lang/fr/)

---

## [Non publié]

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

*Les releases de code suivront les milestones Phase 0 → Phase 1 → Phase 2.*
