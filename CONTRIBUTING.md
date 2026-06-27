# Guide de contribution

> LoyaltyFlowAI — Phase 0 (fondateur solo)

---

## Branches

| Branche | Usage |
|---|---|
| `main` | Production — merge uniquement depuis `develop` via PR |
| `develop` | Staging — branche d'intégration |
| `feat/nom-court` | Nouvelles fonctionnalités |
| `fix/nom-court` | Corrections de bugs |
| `chore/nom-court` | Maintenance (deps, config, docs) |

---

## Commits

Format : `type(scope): description courte`

```
feat(auth): ajouter la page de connexion Supabase
fix(churn): corriger le calcul du score pour les nouveaux clients
chore(deps): mettre à jour Next.js vers 14.3
docs(arch): documenter ADR-006 validation lazy
```

**Types :** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`

---

## Pull Requests

1. Branche depuis `develop` (jamais depuis `main`)
2. Les 4 commandes doivent passer en vert avant merge :
   - `pnpm type-check`
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build`
3. PR title suit le même format que les commits
4. Description : contexte + décision + impact

---

## Conventions de code

### TypeScript
- Strict mode activé — pas de `any` explicite
- Pas de préfixe `I` sur les interfaces (`User` et non `IUser`)
- Exports nommés uniquement (pas d'export default sauf pages Next.js)
- Types Prisma et types métier séparés (voir `packages/types`)

### Nommage
- Fichiers : `kebab-case.ts`
- Composants : `PascalCase.tsx`
- Variables / fonctions : `camelCase`
- Constantes globales : `SCREAMING_SNAKE_CASE`
- Variables d'env : `SCREAMING_SNAKE_CASE`

### Structure
- La logique métier appartient à `apps/web/lib/` (services, helpers)
- Les composants UI partagés vont dans `packages/ui/`
- Les types partagés vont dans `packages/types/`
- Les fonctions utilitaires pures vont dans `packages/utils/`
- Pas de logique métier dans les composants React
- Pas de `console.log` — utiliser `createLogger` de `@loyaltyflowai/logger`

### Variables d'environnement
- Accéder via `serverEnv` ou `clientEnv` de `@loyaltyflowai/config` — jamais `process.env` directement
- `NEXT_PUBLIC_*` uniquement pour les valeurs non-sensibles exposées au navigateur

---

## Tests

- Tests unitaires dans `src/__tests__/nom.test.ts` (même dossier que le fichier testé)
- Pas de mocks de la base de données pour les tests d'intégration
- Couverture minimale requise : fonctions utilitaires de `packages/utils`

---

## Dépendances

- Toujours justifier l'ajout d'une dépendance (impact bundle, maintenance, alternatives)
- Éviter les packages sans maintenance active (dernier commit > 1 an)
- Préférer les packages avec types TypeScript natifs (pas `@types/xxx` séparé si possible)

---

→ [Guide de développement local](./DEVELOPMENT.md) | [Architecture](./docs/technical/ARCHITECTURE.md)
