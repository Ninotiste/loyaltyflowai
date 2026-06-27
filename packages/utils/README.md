# packages/utils — Fonctions utilitaires partagées

Fonctions utilitaires partagées entre `apps/web` et `apps/worker`.

## Contenu prévu

- `calculateChurnScore(customer)` — Calcul du score de churn (heuristiques)
- `formatPoints(points)` — Formatage des points pour l'affichage
- `validateCsvRow(row)` — Validation d'une ligne CSV d'import client
- `generatePublicKey()` — Génération de clé publique widget
- Utilitaires de date et de formatage

## Usage

```typescript
import { calculateChurnScore, formatPoints } from "@loyaltyflowai/utils"
```
