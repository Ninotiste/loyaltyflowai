# Widget client LoyaltyFlowAI

## 1. Présentation

Le widget LoyaltyFlowAI permet aux clients d'un établissement de consulter leurs points de fidélité et leurs récompenses directement depuis le site web, sans installer d'application.

Le code du widget se trouve dans :

- `apps/web/public/widget.js`

Le widget est écrit en JavaScript natif.

## 2. Intégration

Le script recherche une balise HTML `script` contenant l'attribut `data-public-key`.

Il utilise également l'attribut facultatif `data-base-url` pour déterminer l'adresse de l'API.

Si `data-base-url` n'est pas renseigné, il utilise l'origine du site courant.

Exemple de configuration des attributs :

```html
<script
  src="/widget.js"
  data-public-key="VOTRE_CLE_PUBLIQUE"
  data-base-url="https://votre-domaine.com"
  defer
></script>
```

**Important :** `/widget.js` est un exemple de chemin. L'adresse réelle du script dépend de son emplacement lors du déploiement.

## 3. Initialisation du widget

Au chargement de la page, le widget exécute la fonction `init()`.

Cette fonction :

1. Recherche les balises script contenant `data-public-key`.
2. Récupère la clé publique et l'adresse de base de l'API.
3. Vérifie que la clé publique est présente.
4. Crée le conteneur du widget.
5. Crée un Shadow DOM pour isoler son interface.
6. Vérifie si un token client existe dans `sessionStorage`.

Si un token existe, le widget appelle l'API pour récupérer le statut du client.

Sinon, il affiche le formulaire d'inscription.

## 4. Interface et parcours utilisateur

### 4.1. Bouton du widget

Le widget affiche un bouton flottant intitulé « Mes points 🎁 ».

Il est positionné en bas à droite de la page.

Un clic permet d'ouvrir ou de fermer le panneau du widget.

### 4.2. Inscription

Un nouveau client peut s'inscrire avec :

- Son adresse email (obligatoire).
- Son prénom (facultatif).
- Son consentement (obligatoire).

Le widget vérifie le format de l'adresse email et la présence du consentement.

Il envoie ensuite une requête `POST` à `/api/v1/widget/register`.

Si l'inscription réussit, le token reçu est enregistré dans `sessionStorage`, puis le widget récupère les informations du client.

### 4.3. Identification

Un client déjà inscrit peut sélectionner « Se connecter ».

Il doit saisir son adresse email.

Le widget envoie une requête `POST` à `/api/v1/widget/identify`, avec l'adresse email et la clé publique du programme.

Si le client est trouvé, l'API retourne un token qui permet d'accéder à ses informations.

### 4.4. Consultation des points

Une fois identifié, le client peut consulter :

- Son prénom.
- Son nombre de points.
- Sa prochaine récompense.
- Les récompenses disponibles.

Une barre de progression indique l'avancement vers la prochaine récompense.

### 4.5. Utilisation d'une récompense

Les récompenses accessibles sont affichées sous forme de boutons.

Lorsqu'un client sélectionne une récompense, le widget envoie une requête `POST` à `/api/v1/widget/redeem`.

Si l'opération réussit, l'API retourne un code de récompense.

Le widget affiche ce code et indique qu'il est valable 24 heures.

Le bouton correspondant est ensuite désactivé.

### 4.6. Déconnexion

Le client peut se déconnecter grâce au bouton prévu à cet effet.

Le widget supprime alors le token enregistré dans `sessionStorage` et revient à l'écran d'inscription.

## 5. Architecture technique

Le widget est constitué de trois éléments principaux :

- Un script JavaScript chargé dans le navigateur.
- Une interface isolée grâce au Shadow DOM.
- Une API REST qui communique avec la base de données.

Le navigateur communique avec les routes API du projet à l'aide de requêtes HTTP.

### Shadow DOM

Le widget utilise `attachShadow({ mode: 'open' })` pour créer un Shadow DOM.

Cette technique permet d'isoler les styles CSS du widget de ceux du site qui l'intègre.

Les styles du widget sont ajoutés dans le Shadow DOM à partir de la fonction `getShadowStyles()`.

## 6. Routes API utilisées

Toutes les routes utilisées par le widget sont préfixées par `/api/v1/widget`.

| Méthode | Route | Fonction |
|---|---|---|
| POST | `/register` | Inscrire un nouveau client |
| POST | `/identify` | Identifier un client existant |
| GET | `/status` | Récupérer les informations et les points du client |
| POST | `/redeem` | Utiliser une récompense |

### 6.1. Inscription

Route : `POST /api/v1/widget/register`

Données envoyées :

- `email`
- `first_name` (facultatif)
- `public_key`
- `consent`

L'API vérifie les données, recherche le programme de fidélité et crée ou met à jour le client.

Elle retourne un token et les informations du client.

### 6.2. Identification

Route : `POST /api/v1/widget/identify`

Données envoyées :

- `email`
- `public_key`

L'API recherche le client dans l'organisation associée au programme.

Si le client existe, elle génère un token d'accès.

### 6.3. Consultation du statut

Route : `GET /api/v1/widget/status`

Cette route nécessite un token transmis dans l'en-tête HTTP :

`Authorization: Bearer <token>`

Elle retourne notamment :

- Les informations du client.
- Son solde de points.
- Sa prochaine récompense.
- Les récompenses disponibles.
- Les dix dernières transactions.

### 6.4. Utilisation d'une récompense

Route : `POST /api/v1/widget/redeem`

Cette route nécessite également un token d'accès.

Donnée envoyée :

- `reward_id`

L'API vérifie que le client existe, que la récompense est active et que le client possède suffisamment de points.

Elle déduit ensuite les points nécessaires et crée une transaction.

Un code de récompense est retourné avec une date d'expiration de 24 heures.

## 7. Authentification et sécurité

Le widget utilise un token JWT pour identifier le client après son inscription ou sa connexion.

Ce token :

- Est signé avec l'algorithme HS256.
- Contient l'identifiant du client et celui de son organisation.
- Est associé au type `widget`.
- Expire après 7 jours.

Le token est conservé dans `sessionStorage` sous la clé :

`lf_widget_token`

Les routes `status` et `redeem` vérifient ce token avant de traiter les demandes.

Les routes du widget utilisent également un système de limitation des requêtes (`widgetRatelimit`) afin de limiter les abus.

Les données reçues par l'API sont validées avec Zod.

## 8. Paramètres de configuration

Les paramètres actuellement lus par le script sont :

| Paramètre | Obligatoire | Description |
|---|---|---|
| `data-public-key` | Oui | Clé publique du programme de fidélité |
| `data-base-url` | Non | Adresse de base de l'API |

La clé publique est utilisée lors de l'inscription et de l'identification.

Le token client est conservé dans la session du navigateur.

## 9. Gestion des erreurs

L'API peut retourner différents codes d'erreur :

| Code HTTP | Code d'erreur | Signification |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Données envoyées invalides |
| 401 | `UNAUTHORIZED` | Token manquant |
| 401 | `INVALID_TOKEN` | Token invalide ou expiré |
| 404 | `PROGRAM_NOT_FOUND` | Programme introuvable ou inactif |
| 404 | `CUSTOMER_NOT_FOUND` | Client introuvable |
| 404 | `NOT_FOUND` | Ressource introuvable |
| 429 | `RATE_LIMIT` | Trop de requêtes |
| 500 | `INTERNAL_ERROR` | Erreur interne du serveur |

Le widget affiche certains messages d'erreur directement dans son interface.

En cas d'erreur lors de la récupération du statut, il revient à l'écran d'inscription.

## 10. Limites de l'implémentation actuelle

La documentation doit distinguer les fonctionnalités réellement présentes dans le code de celles qui sont seulement prévues dans les spécifications produit.

Voici quelques limites constatées :

- La personnalisation des couleurs depuis le dashboard n'est pas implémentée.
- L'historique des transactions est retourné par l'API, mais n'est pas affiché dans l'interface actuelle.
- Aucun QR code n'est généré pour les récompenses.
- Aucune mise à jour automatique des points en temps réel n'est implémentée.
- La fonction `injectStyles()` est actuellement vide.
- Certaines erreurs réseau ne sont pas affichées de manière détaillée à l'utilisateur.

Ces éléments pourront être améliorés dans de futures versions du widget.

## 11. Fichiers importants

| Fichier | Rôle |
|---|---|
| `apps/web/public/widget.js` | Interface et logique du widget |
| `apps/web/app/api/v1/widget/register/route.ts` | Inscription |
| `apps/web/app/api/v1/widget/identify/route.ts` | Identification |
| `apps/web/app/api/v1/widget/status/route.ts` | Consultation du statut |
| `apps/web/app/api/v1/widget/redeem/route.ts` | Utilisation des récompenses |
| `apps/web/lib/widget-token.ts` | Création et vérification des tokens JWT |

---

**Note :** cette documentation décrit le fonctionnement observé dans le code source actuel. Elle ne présente pas les fonctionnalités prévues dans les spécifications comme si elles étaient déjà disponibles.
