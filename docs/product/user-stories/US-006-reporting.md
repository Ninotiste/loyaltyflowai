# US-006 — Dashboard et exports

> **Module :** Reporting
> **Statut :** À affiner
> **Priorité :** Must Have
> **Phase :** 1 (MVP)
> **Lié à :** [PRD.md §5.6](../PRD.md#56-reporting) | [METRICS.md](../../business/METRICS.md)

---

## User Stories

### US-006-A — Dashboard principal

```
En tant que restaurateur,
Je veux voir un tableau de bord avec les métriques clés de mon programme,
Afin de comprendre en un coup d'œil si mon programme fonctionne.
```

### US-006-B — Export CSV

```
En tant que restaurateur,
Je veux exporter la liste de mes clients et leurs données de fidélité en CSV,
Afin d'analyser les données dans mon propre tableur ou de les partager avec mon comptable.
```

---

## Critères d'acceptation

### US-006-A

Le dashboard affiche les métriques suivantes :

| Métrique | Description |
|---|---|
| Clients actifs | Clients avec au moins 1 visite dans les 30 derniers jours |
| Clients à risque | Clients avec score de churn "Élevé" |
| Points émis (30j) | Total des points accordés sur les 30 derniers jours |
| Récompenses distribuées (30j) | Nombre de récompenses échangées |
| Taux de retour | % de clients ayant visité 2x ou plus dans les 60 derniers jours |

- Toutes les métriques sont accompagnées d'une évolution vs la période précédente (+X% ou -X%)
- Le dashboard se charge en < 2 secondes

### US-006-B
- **Given** je clique "Exporter"
- **When** l'export est généré
- **Then** je télécharge un fichier CSV avec : prénom, nom, email, total de points, dernière visite, score de risque, nombre de visites

---

## Notes techniques

- Les métriques sont calculées à la volée depuis PostgreSQL pour le MVP (pas d'analytique séparé)
- Phase 3+ : migration vers TimescaleDB ou ClickHouse pour les analytiques avancés
- Voir [METRICS.md](../../business/METRICS.md) pour les définitions précises des métriques

---

## Définition de "Terminé" (DoD)

- [ ] Dashboard avec les 5 métriques ci-dessus
- [ ] Évolution vs période précédente affichée
- [ ] Export CSV fonctionnel
- [ ] Dashboard se charge en < 2 secondes
- [ ] Tests d'intégration sur les calculs de métriques
- [ ] Testé manuellement en staging
