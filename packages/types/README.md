# packages/types — Types TypeScript partagés

Types TypeScript partagés entre `apps/web`, `apps/worker`, et `packages/utils`.

→ [Convention TypeScript](../../MASTER_PLAN.md#16-conventions-de-nommage) — pas de préfixe `I`

## Contenu

- Types des entités métier (inférés depuis le schéma Prisma)
- Types des payloads API (request / response)
- Types partagés utilitaires

## Convention

```typescript
// ✅ Correct
type User = { id: string; email: string }
interface LoyaltyProgram { name: string; status: ProgramStatus }

// ❌ Incorrect
interface IUser { id: string; email: string }
```

## Usage

```typescript
import type { Customer, ChurnLevel } from "@loyaltyflowai/types"
```
