# Guide de déploiement

---

## Vue d'ensemble

| Environnement | Branche | URL | Déclencheur |
|---|---|---|---|
| Production | `main` | `app.loyaltyflowai.com` | Merge PR vers main |
| Staging | `develop` | `staging.loyaltyflowai.com` | Merge PR vers develop |
| Preview | `feat/*` | URL unique par PR | Push sur la branche |

---

## Vercel

### Projets

| Projet Vercel | Application | Root directory |
|---|---|---|
| `loyaltyflowai-web` | `apps/web` | `apps/web` |
| `loyaltyflowai-worker` | `apps/worker` | `apps/worker` |

### Configuration initiale (une seule fois)

```bash
# Installer Vercel CLI
npm install -g vercel

# Lier le projet web
cd apps/web && vercel link

# Lier le projet worker
cd apps/worker && vercel link
```

### Variables d'environnement Vercel

Configurer dans le dashboard Vercel (Settings → Environment Variables) pour chaque projet :

**`loyaltyflowai-web` :**
```
DATABASE_URL          → Production: connexion pooled PgBouncer
DIRECT_URL            → Production: connexion directe PostgreSQL (migrations)
SUPABASE_SERVICE_ROLE_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
ANTHROPIC_API_KEY
RESEND_API_KEY
CRON_SECRET
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL   → https://app.loyaltyflowai.com
```

---

## Migrations de base de données

Les migrations ne sont **pas appliquées automatiquement** en déploiement. Elles doivent être appliquées manuellement avant de déployer le code qui les requiert.

```bash
# Appliquer les migrations en production
# Utiliser DIRECT_URL (connexion non-poolée, port 5432)
DATABASE_URL=postgresql://... DIRECT_URL=postgresql://... \
  pnpm --filter @loyaltyflowai/web exec prisma migrate deploy
```

> **Ordre impératif :** Migration → Déploiement code. Jamais l'inverse.

---

## CI/CD (GitHub Actions)

Le pipeline CI (`.github/workflows/ci.yml`) exécute à chaque PR :

1. `pnpm install` — installation des dépendances
2. `prisma generate` — génération du client Prisma
3. `pnpm type-check` — vérification TypeScript
4. `pnpm lint` — ESLint
5. `pnpm test` — tests unitaires
6. `pnpm build` avec `SKIP_ENV_VALIDATION=1` — vérification du build

**Secrets GitHub requis** (Settings → Secrets → Actions) :

```
DATABASE_URL_TEST
DIRECT_URL_TEST
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY_TEST
UPSTASH_REDIS_REST_URL_TEST
UPSTASH_REDIS_REST_TOKEN_TEST
ANTHROPIC_API_KEY
RESEND_API_KEY
CRON_SECRET_TEST
```

---

## Checklist de déploiement

Avant chaque déploiement en production :

- [ ] CI passe en vert sur la PR
- [ ] Migrations appliquées si le schéma a changé
- [ ] Variables d'environnement à jour dans Vercel
- [ ] `pnpm build` vérifié localement
- [ ] Fonctionnalités testées sur staging
- [ ] CHANGELOG.md mis à jour

---

## Rollback

```bash
# Rollback via Vercel CLI (revient au déploiement précédent)
vercel rollback [deployment-url]

# Rollback de migration Prisma (si applicable)
# Note: Prisma ne supporte pas le rollback automatique.
# Écrire une migration manuelle inverse si nécessaire.
```

---

→ [DEVELOPMENT.md](./DEVELOPMENT.md) | [RUNBOOK.md](./docs/operations/RUNBOOK.md)
