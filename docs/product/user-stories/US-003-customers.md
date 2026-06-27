# US-003 — Import et gestion des clients

> **Module :** Clients & Données
> **Statut :** À affiner
> **Priorité :** Must Have
> **Phase :** 1 (MVP)
> **Lié à :** [PRD.md §5.3](../PRD.md#53-clients--données) | [DATABASE.md](../../technical/DATABASE.md) | [SECURITY.md](../../technical/SECURITY.md)

---

## User Stories

### US-003-A — Import CSV

```
En tant que restaurateur,
Je veux importer ma liste de clients existants depuis un fichier CSV,
Afin de démarrer avec ma base clients sans ressaisie manuelle.
```

### US-003-B — Fiche client

```
En tant que restaurateur,
Je veux consulter la fiche d'un client (historique de points, visites, statut de risque),
Afin de comprendre son comportement et agir en conséquence.
```

### US-003-C — Attribution manuelle de points

```
En tant que restaurateur,
Je veux attribuer des points manuellement à un client,
Afin de corriger une erreur ou récompenser une action spéciale.
```

### US-003-D — Ajout manuel d'un client

```
En tant que restaurateur,
Je veux ajouter un nouveau client manuellement (nom, email, téléphone),
Afin d'enregistrer un nouveau fidèle sans attendre qu'il s'inscrit lui-même.
```

---

## Critères d'acceptation

### US-003-A
- **Given** j'ai un fichier CSV avec les colonnes : prénom, nom, email, téléphone (optionnel)
- **When** j'importe le fichier
- **Then** les clients valides sont créés, les doublons (même email) sont ignorés, et un rapport d'import est affiché (X créés, Y ignorés, Z erreurs)

### US-003-B
- **Given** je clique sur un client dans la liste
- **When** sa fiche s'ouvre
- **Then** je vois : nom, email, total de points, historique des 10 dernières transactions, score de churn, date de dernière visite

### US-003-C
- **Given** je suis sur la fiche d'un client
- **When** j'attribue +50 points avec une note de raison
- **Then** le solde du client est mis à jour immédiatement et la transaction est loggée dans son historique

### US-003-D
- **Given** je clique "Ajouter un client"
- **When** je saisis les informations et je soumets
- **Then** le client est créé avec un solde de 0 points et apparaît dans la liste

---

## Notes techniques

- Email = identifiant unique par tenant (pas de doublon par établissement)
- Les données clients sont isolées par tenant (voir [SECURITY.md](../../technical/SECURITY.md))
- Le CSV doit être validé avant import (colonnes requises, format email)
- RGPD : les clients peuvent demander la suppression de leurs données → prévoir un flow de suppression
- Voir entité `customers` et `point_transactions` dans [DATABASE.md](../../technical/DATABASE.md)

---

## Définition de "Terminé" (DoD)

- [ ] Import CSV avec rapport d'erreurs
- [ ] Liste clients avec pagination et recherche
- [ ] Fiche client avec historique de points
- [ ] Attribution manuelle de points avec log de raison
- [ ] Ajout manuel d'un client
- [ ] Suppression d'un client (RGPD)
- [ ] Tests d'intégration sur tous les endpoints clients
- [ ] Testé manuellement en staging
