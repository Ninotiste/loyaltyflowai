# US-005 — Score de churn et alertes automatiques

> **Module :** Intelligence Artificielle
> **Statut :** À affiner
> **Priorité :** Must Have
> **Phase :** 1 (MVP)
> **Lié à :** [PRD.md §5.5](../PRD.md#55-ia--score-de-churn) | [MASTER_PLAN.md §23](../../../MASTER_PLAN.md#23-règles-ia)

---

## Contexte

Le score de churn MVP est volontairement simple : il repose sur des règles heuristiques basées sur l'inactivité (pas de ML en Phase 1). Le modèle ML sera introduit en Phase 2.

**Règle MVP :** Un client est considéré "à risque" si sa dernière visite remonte à plus de X jours (seuil configurable par le restaurateur, défaut : 30 jours).

---

## User Stories

### US-005-A — Score de risque visible

```
En tant que restaurateur,
Je veux voir le score de risque de chaque client dans ma liste,
Afin d'identifier en un coup d'œil qui est sur le point de partir.
```

### US-005-B — Alerte pour les clients à risque

```
En tant que restaurateur,
Je veux recevoir une alerte dans mon dashboard quand des clients passent en "à risque",
Afin de pouvoir agir avant de les perdre.
```

### US-005-C — Suggestion de récompense

```
En tant que restaurateur,
Je veux qu'une récompense me soit suggérée pour chaque client à risque,
Afin de savoir quoi leur offrir pour les faire revenir.
```

### US-005-D — Configuration du seuil d'inactivité

```
En tant que restaurateur,
Je veux configurer le nombre de jours d'inactivité qui déclenche une alerte,
Afin d'adapter le score à la fréquence naturelle de mes clients (hebdomadaire vs mensuelle).
```

---

## Critères d'acceptation

### US-005-A
- **Given** je consulte la liste de mes clients
- **When** un client n'a pas visité depuis plus de 30 jours (défaut)
- **Then** son score de risque affiche "Élevé" (rouge) et un indicateur visuel est présent

**Niveaux de risque :**
| Niveau | Condition (défaut) | Couleur |
|---|---|---|
| Faible | Visite < 15 jours | Vert |
| Moyen | Visite entre 15 et 30 jours | Orange |
| Élevé | Visite > 30 jours | Rouge |

### US-005-B
- **Given** un client passe de "Moyen" à "Élevé"
- **When** le calcul quotidien est effectué
- **Then** une notification apparaît dans le dashboard avec le nom du client et son dernier passage

### US-005-C
- **Given** je consulte un client à risque
- **When** la fiche client s'affiche
- **Then** une suggestion de récompense apparaît (ex. "Offrez-lui un café gratuit — il représente X visites")

### US-005-D
- **Given** je suis dans les paramètres du programme
- **When** je modifie le seuil d'inactivité à 45 jours
- **Then** tous les scores sont recalculés avec le nouveau seuil lors du prochain cycle

---

## Notes techniques

- Le score est calculé par un **job quotidien** dans `apps/worker`
- Phase 1 : règles heuristiques uniquement (pas de ML)
- Phase 2 : remplacement par un modèle ML (scikit-learn ou équivalent)
- Toute décision IA est loggée (audit trail) — voir [MASTER_PLAN.md §23 R5](../../../MASTER_PLAN.md#23-règles-ia)
- La suggestion de récompense est générée par l'**API Claude** (Anthropic) avec le contexte du client
- Voir entité `churn_scores` dans [DATABASE.md](../../technical/DATABASE.md)

---

## Définition de "Terminé" (DoD)

- [ ] Score de risque calculé quotidiennement pour tous les clients
- [ ] Affichage des scores dans la liste clients (3 niveaux)
- [ ] Alerte dans le dashboard pour les nouveaux clients "à risque"
- [ ] Suggestion de récompense sur la fiche client
- [ ] Seuil d'inactivité configurable par le restaurateur
- [ ] Audit trail de chaque calcul de score
- [ ] Tests unitaires sur le moteur de calcul de score
- [ ] Testé manuellement en staging
