# apps/web — Dashboard LoyaltyFlowAI

Application Next.js 14+ full-stack — Dashboard opérateur et API.

**Stack :** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Prisma · Supabase Auth

→ [Architecture](../../docs/technical/ARCHITECTURE.md) | [Environments](../../docs/technical/ENVIRONMENTS.md)

## Structure

```
apps/web/
├── app/
│   ├── (auth)/          → Pages connexion / inscription
│   ├── (dashboard)/     → Pages dashboard (protégées)
│   └── api/v1/          → Route Handlers (API)
├── components/          → Composants React spécifiques à cette app
├── lib/
│   ├── db.ts            → Client Prisma
│   ├── supabase.ts      → Client Supabase Auth
│   └── redis.ts         → Client Upstash Redis
└── prisma/
    └── schema.prisma    → Schéma de base de données
```

## Démarrage

```bash
pnpm dev        # Démarrage en développement (port 3000)
pnpm build      # Build de production
pnpm lint       # Lint ESLint
pnpm type-check # Vérification TypeScript
pnpm test       # Tests unitaires et d'intégration
```

→ [Guide de setup complet](../../docs/operations/ONBOARDING.md)
