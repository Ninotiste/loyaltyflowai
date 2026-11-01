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
