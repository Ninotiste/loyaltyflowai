# US-004 — Widget de fidélité embarquable

> **Module :** Widget client
> **Statut :** À affiner
> **Priorité :** Must Have
> **Phase :** 1 (MVP)
> **Lié à :** [PRD.md §5.4](../PRD.md#54-widget-de-fidélité-canal-client-final) | [API.md](../../technical/API.md)

---

## Contexte

Le widget est le point de contact entre LoyaltyFlowAI et les clients finaux du restaurateur. C'est un composant JavaScript léger que le restaurateur intègre sur son site web en copiant-collant un snippet.

---

## User Stories

### US-004-A — Intégration par le restaurateur

```
En tant que restaurateur,
Je veux obtenir un snippet JavaScript à copier-coller sur mon site,
Afin d'activer le widget de fidélité pour mes clients en moins de 5 minutes.
```

### US-004-B — Identification du client final

```
En tant que client d'un restaurant,
Je veux m'identifier sur le widget avec mon email,
Afin de consulter mon solde de points et mes récompenses disponibles.
```

### US-004-C — Consultation du solde

```
En tant que client identifié,
Je veux voir mon solde de points et la prochaine récompense à atteindre,
Afin d'être motivé à revenir.
```

### US-004-D — Personnalisation visuelle

```
En tant que restaurateur,
Je veux personnaliser les couleurs et le logo du widget,
Afin que l'expérience soit cohérente avec mon identité visuelle.
```

---

## Critères d'acceptation

### US-004-A
- **Given** je suis dans les paramètres de mon programme
- **When** je clique "Obtenir le code d'intégration"
- **Then** je vois un snippet `<script>` unique à mon établissement, prêt à être collé dans le `<head>` de mon site

### US-004-B
- **Given** le widget est chargé sur un site
- **When** un visiteur saisit son email et clique "Voir mes points"
- **Then** le widget affiche son solde de points s'il est client, ou propose l'inscription s'il est nouveau

### US-004-C
- **Given** le client est identifié
- **When** il consulte le widget
- **Then** il voit : solde actuel, progression vers la prochaine récompense (barre de progression), liste des récompenses débloquées

### US-004-D
- **Given** je configure mon programme
- **When** je choisis une couleur principale et upload mon logo
- **Then** le widget applique ces paramètres visuels en temps réel dans l'aperçu

---

## Notes techniques

- Le widget est un bundle JS isolé (shadow DOM ou iframe) pour éviter les conflits CSS
- L'API du widget est publique mais authentifiée par une clé publique (`public_key`) par tenant
- La clé secrète n'est jamais exposée côté client
- Les données client sont récupérées via une API dédiée `/api/v1/widget/customer`
- Le widget doit peser < 30 Ko (gzippé) pour ne pas impacter les performances du site hôte
- Voir [API.md — Endpoints widget](../../technical/API.md)

---

## Maquettes

→ [Wireframes du widget](../wireframes/README.md)

---

## Définition de "Terminé" (DoD)

- [ ] Snippet d'intégration généré dans le dashboard
- [ ] Identification client par email fonctionnelle
- [ ] Affichage du solde et des récompenses
- [ ] Personnalisation couleur + logo fonctionnelle
- [ ] Widget < 30 Ko gzippé
- [ ] Compatible Chrome, Firefox, Safari, Edge (2 dernières versions)
- [ ] Compatible iOS Safari et Chrome Android
- [ ] Tests E2E sur le flow complet (intégration → identification → affichage)
- [ ] Testé manuellement en staging sur un site de test
