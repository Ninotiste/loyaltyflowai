# Variables d’environnement

Ce document explique le rôle des principales variables d’environnement utilisées par LoyaltyFlowAI.

## Supabase

- `NEXT_PUBLIC_SUPABASE_URL` : adresse du projet Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : clé publique utilisée par l’application.
- `SUPABASE_SERVICE_ROLE_KEY` : clé privée réservée au serveur. Ne jamais l’exposer côté client.

## Base de données

- `DATABASE_URL` : connexion à PostgreSQL via le pooler PgBouncer pour les requêtes de l’application.
- `DIRECT_URL` : connexion directe à PostgreSQL, notamment utilisée pour les migrations Prisma.

## Services externes

- `UPSTASH_REDIS_REST_URL` : adresse de l’instance Redis.
- `UPSTASH_REDIS_REST_TOKEN` : jeton d’accès à Redis.
- `ANTHROPIC_API_KEY` : clé d’accès à l’API Anthropic.
- `RESEND_API_KEY` : clé utilisée pour l’envoi des emails.

## Sécurité

- `CRON_SECRET` : secret utilisé pour sécuriser les tâches planifiées.

## Application

- `NEXT_PUBLIC_APP_URL` : URL de l’application.
- `NODE_ENV` : environnement d’exécution (`development` ou `production`).

## Bonnes pratiques

- Ne jamais publier de véritables clés API ou mots de passe.
- Ne jamais partager le fichier `.env` contenant les secrets.
- Utiliser `.env.example` comme modèle.
- Les variables commençant par `NEXT_PUBLIC_` sont accessibles côté navigateur : ne jamais y placer de secret.
