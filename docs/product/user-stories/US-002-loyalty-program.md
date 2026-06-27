# US-002 — Création et gestion du programme de points

> **Module :** Programme de fidélité
> **Statut :** À affiner
> **Priorité :** Must Have
> **Phase :** 1 (MVP)
> **Lié à :** [PRD.md §5.2](../PRD.md#52-programme-de-fidélité) | [DATABASE.md](../../technical/DATABASE.md)

---

## User Stories

### US-002-A — Création du programme

```
En tant que restaurateur,
Je veux créer un programme de points en définissant les règles de gain et les récompenses,
Afin que mes clients accumulent des points à chaque visite et obtiennent des avantages.
```

### US-002-B — Configuration des règles de gain

```
En tant que restaurateur,
Je veux définir combien de points un client gagne par visite ou par euro dépensé,
Afin d'adapter le programme à la fréquence de mes clients.
```

### US-002-C — Configuration des récompenses

```
En tant que restaurateur,
Je veux créer des récompenses (ex. "café offert à 50 points", "repas à -20% à 200 points"),
Afin de motiver mes clients à revenir.
```

### US-002-D — Activation / désactivation

```
En tant que restaurateur,
Je veux activer ou suspendre mon programme en un clic,
Afin de gérer les périodes de fermeture ou de test sans perdre la configuration.
```

---

## Critères d'acceptation

### US-002-A
- **Given** je n'ai pas encore de programme
- **When** j'accède à "Mon programme" et je complète le formulaire de création
- **Then** mon programme est créé avec un statut "Inactif" par défaut, prêt à être configuré

### US-002-B
- **Given** je configure mon programme
- **When** je définis une règle de type "1€ dépensé = 1 point"
- **Then** cette règle s'applique automatiquement à tous les nouveaux enregistrements de visite

### US-002-C
- **Given** mon programme est configuré
- **When** j'ajoute une récompense avec un seuil de 100 points et une description
- **Then** la récompense apparaît dans le widget client dès qu'un client atteint 100 points

### US-002-D
- **Given** mon programme est Inactif
- **When** je clique "Activer"
- **Then** le programme passe en statut "Actif" et le widget devient visible pour les clients

---

## Notes techniques

- Un établissement = un programme de fidélité en Phase 1
- Les règles de gain sont stockées en base et évaluées côté serveur
- Le widget se met à jour en temps réel via polling ou websocket (à décider)
- Voir entité `loyalty_programs` et `rewards` dans [DATABASE.md](../../technical/DATABASE.md)

---

## Définition de "Terminé" (DoD)

- [ ] Création de programme fonctionnelle
- [ ] Au moins 2 types de règles de gain (par visite / par montant)
- [ ] Création / édition / suppression de récompenses
- [ ] Activation / désactivation du programme
- [ ] Tests unitaires sur le moteur de calcul de points
- [ ] Tests d'intégration sur les endpoints de gestion du programme
- [ ] Testé manuellement en staging
