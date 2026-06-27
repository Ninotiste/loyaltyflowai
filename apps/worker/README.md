# apps/worker — Worker LoyaltyFlowAI

Service de traitement en arrière-plan — jobs quotidiens et tâches asynchrones.

**Responsabilités :**
- Calcul quotidien des scores de churn (00h00)
- Génération des alertes pour les clients à risque
- Jobs de maintenance (nettoyage, agrégations)

→ [Architecture](../../docs/technical/ARCHITECTURE.md) | [US-005 — Score de churn](../../docs/product/user-stories/US-005-ai-churn.md)

## Structure

```
apps/worker/
└── src/
    ├── jobs/
    │   ├── calculateChurn.ts    → Calcul quotidien des scores de churn
    │   └── generateAlerts.ts    → Génération des alertes opérateur
    ├── lib/
    │   ├── db.ts                → Client Prisma
    │   └── redis.ts             → Client Upstash (locks, queues)
    └── index.ts                 → Point d'entrée + scheduler
```

## Démarrage

```bash
pnpm dev    # Démarrage en développement
pnpm build  # Build de production
pnpm test   # Tests des jobs
```

## Déploiement

Le worker est déployé sur Vercel en tant qu'application séparée.
Le scheduling est géré via Vercel Cron Jobs (configuré dans `vercel.json`).
