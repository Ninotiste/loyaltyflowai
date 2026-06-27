# RUNBOOK.md — Procédures opérationnelles

> **Projet :** LoyaltyFlowAI
> **Version :** 0.1.0
> **Statut :** En cours de rédaction — Phase 0
> **Dernière mise à jour :** 2026-06-27
> **Lié à :** [ARCHITECTURE.md](../technical/ARCHITECTURE.md) | [ENVIRONMENTS.md](../technical/ENVIRONMENTS.md) | [INCIDENTS.md](./INCIDENTS.md)

---

## Sommaire

1. [Déploiement en production](#1-déploiement-en-production)
2. [Rollback d'un déploiement](#2-rollback-dun-déploiement)
3. [Migrations de base de données](#3-migrations-de-base-de-données)
4. [Gestion des secrets et variables d'environnement](#4-gestion-des-secrets-et-variables-denvironnement)
5. [Surveillance et monitoring](#5-surveillance-et-monitoring)
6. [Maintenance planifiée](#6-maintenance-planifiée)
7. [Sauvegardes](#7-sauvegardes)
8. [Procédures de support client](#8-procédures-de-support-client)

---

## 1. Déploiement en production

### Déploiement standard (automatique)
```
git checkout develop
git pull origin develop
# Merge de la PR validée
git checkout main
git merge develop
git push origin main
# → Vercel déclenche automatiquement le déploiement
```

**Vérifications post-déploiement :**
- [ ] Vérifier le statut dans Vercel Dashboard
- [ ] Vérifier les erreurs dans Sentry (0 nouvelles erreurs critiques)
- [ ] Tester manuellement le flow critique (connexion → dashboard → widget)
- [ ] Vérifier l'uptime sur la status page

### Critères de go / no-go avant un déploiement
- [ ] Tous les tests CI passent (GitHub Actions)
- [ ] La PR a été revue et approuvée
- [ ] La fonctionnalité a été testée en staging
- [ ] Pas d'incident ouvert en production
- [ ] Pas de maintenance planifiée en cours

---

## 2. Rollback d'un déploiement

### Via Vercel (méthode recommandée)
1. Ouvrir Vercel Dashboard → Projet `loyaltyflowai-web`
2. Onglet "Deployments"
3. Identifier le dernier déploiement stable
4. Cliquer "..." → "Promote to Production"
5. Vérifier que le rollback est effectif (~ 30 secondes)

### Via Git
```bash
git revert HEAD --no-edit
git push origin main
```

### Rollback de migration de base de données
> ⚠️ Les migrations Prisma ne sont pas automatiquement réversibles.
> Voir la section [§3 Migrations](#3-migrations-de-base-de-données) pour les procédures de rollback.

---

## 3. Migrations de base de données

### Appliquer une migration
```bash
# En staging (avant production)
cd apps/web
pnpm prisma migrate deploy

# Vérifier que la migration s'est appliquée
pnpm prisma migrate status
```

### Règles impératives
- **Toujours tester en staging avant la production**
- **Pas de migration destructive sans plan de rollback documenté**
- **Les migrations sont incluses dans la PR** qui ajoute la feature correspondante
- **Aucune modification de schéma directement en production** (toujours via Prisma)

### Rollback de migration
Prisma ne supporte pas nativement le rollback de migration. Procédure manuelle :
1. Documenter le rollback SQL dans `scripts/migrations/rollback-{migration-name}.sql`
2. Exécuter le rollback SQL via Supabase SQL Editor (staging d'abord)
3. Supprimer l'entrée de la migration dans `_prisma_migrations`
4. Tester la cohérence des données

---

## 4. Gestion des secrets et variables d'environnement

### Ajouter une nouvelle variable
1. Identifier dans quel environnement elle est nécessaire (dev / staging / prod)
2. L'ajouter dans Vercel Dashboard → Settings → Environment Variables
3. Ajouter la clé (sans valeur) dans `.env.example`
4. Documenter dans [ENVIRONMENTS.md](../technical/ENVIRONMENTS.md)
5. **Ne jamais committer la valeur dans Git**

### Rotation d'une clé compromise
1. Générer une nouvelle clé dans le service concerné (Supabase, Anthropic, Upstash…)
2. Mettre à jour dans Vercel Dashboard
3. Redéployer pour que la nouvelle clé soit prise en compte
4. Invalider l'ancienne clé dans le service
5. Documenter l'incident dans [INCIDENTS.md](./INCIDENTS.md)

---

## 5. Surveillance et monitoring

### Tableau de bord de surveillance
| Outil | URL | Ce qu'il surveille |
|---|---|---|
| Vercel Dashboard | vercel.com/dashboard | Déploiements, uptime, performance |
| Sentry | sentry.io | Erreurs et exceptions en production |
| Supabase Dashboard | supabase.com/dashboard | Base de données, Auth, logs |
| Upstash Console | console.upstash.com | Redis, utilisation, latence |

### Vérifications quotidiennes (5 minutes)
- [ ] Sentry : aucune erreur critique non traitée
- [ ] Vercel : dernier déploiement stable
- [ ] Supabase : pas d'alerte de connexion ou de quota

### Alertes configurées
→ Voir [METRICS.md §7](../business/METRICS.md#7-alertes-et-seuils-dalerte)

---

## 6. Maintenance planifiée

### Communication
- Informer les clients par email **48h avant** toute maintenance > 5 minutes
- Mettre à jour la page de statut avant le début
- Heure recommandée : 03h00-05h00 (faible trafic)

### Procédure
1. Annoncer la maintenance (email + status page)
2. Mettre la plateforme en mode maintenance (page de maintenance)
3. Effectuer les opérations
4. Valider que tout fonctionne
5. Retirer le mode maintenance
6. Confirmer la fin de maintenance aux clients

---

## 7. Sauvegardes

### Base de données (Supabase)
- **Fréquence :** Sauvegardes automatiques quotidiennes par Supabase (plan Pro)
- **Rétention :** 7 jours (plan Pro) → 30 jours en Phase 2
- **Localisation :** EU (Frankfurt), chiffrées

### Restauration de sauvegarde
Via Supabase Dashboard → Backups → Restore.

**Test de restauration :** À réaliser trimestriellement en staging pour valider la procédure.

---

## 8. Procédures de support client

### Canal de support (Phase 1)
Email : `support@loyaltyflowai.com`

### SLA Phase 1
| Priorité | Délai de réponse | Délai de résolution |
|---|---|---|
| Critique (service down) | < 2 heures | < 4 heures |
| Haute (feature bloquante) | < 24 heures | < 48 heures |
| Normale | < 48 heures | < 7 jours |

### Tickets fréquents et réponses
*À documenter au fil des premiers tickets reçus en Phase 1.*
