# DECISIONS — Registre des décisions ouvertes

> **Version :** 1.0.0 | **Date :** 2026-06-28
> **Objectif :** Centraliser toutes les décisions architecturales, produit et business encore en suspens
> **Format :** ID | Question | Options | Recommandation | Impact | Statut

---

## Comment utiliser ce document

- **OPEN** : Décision non prise — doit être résolue
- **IN REVIEW** : Discussion en cours — deadline fixée
- **DECIDED** : Décision prise — migrer vers ADR (technique) ou documentation métier
- Chaque décision prise doit être supprimée d'ici et documentée dans son document de référence

---

## Catégorie 1 — Produit / UX

| ID         | Question                                                                                 | Options                                                                                                                | Recommandation                                                      | Impact                     | Statut   |
| ---------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------- | -------- |
| QO-MVP-01  | Widget : polling ou WebSocket pour la mise à jour en temps réel des points ?             | A) Polling 30s (simple, moins de coûts serveur) B) WebSocket (temps réel, plus complexe)                               | **A — Polling 30s** pour MVP. WebSocket en Phase 2 si besoin.       | Architecture widget        | **OPEN** |
| QO-MVP-02  | Identification client : email seul (magic link) ou email + QR code ?                     | A) Email seul (simple, friction minimale) B) Email + QR code au restaurant (plus sécurisé)                             | **A — Email seul** pour MVP. QR code optionnel en Phase 2.          | UX client final            | **OPEN** |
| QO-MVP-03  | Le client peut-il voir ses points sur le widget sans avoir "commandé" ?                  | A) Oui, accès libre après inscription B) Non, uniquement si points > 0                                                 | **A — Accès libre** : voir sa carte même vide = engagement          | UX widget                  | **OPEN** |
| QO-MVP-04  | Attribution des visites physiques : comment relier la visite physique au profil client ? | A) Saisie manuelle par l'employé (email/prénom) B) QR code personnel du client (scan) C) Intégration POS (automatique) | **A — Manuelle pour MVP**, B pour Phase 1, C pour Phase 2           | CRITIQUE — cœur du produit | **OPEN** |
| QO-OB-01   | Essai gratuit : 14 jours free trial ou freemium limité ?                                 | A) 14 jours trial (avec CB) B) 14 jours trial (sans CB) C) Freemium limité (toujours gratuit, 50 clients)              | **B — Trial sans CB** : réduit la friction d'inscription            | Acquisition                | **OPEN** |
| QO-OB-02   | Onboarding : vidéo (loom 2 min) ou uniquement textuel ?                                  | A) Texte + screenshots B) Vidéo courte (2-3 min) C) Texte + vidéo                                                      | **B — Vidéo** pour les étapes les plus complexes (widget)           | Activation                 | **OPEN** |
| QO-RGPD-01 | DPA : individuelle par restaurant ou intégrée aux CGU ?                                  | A) DPA séparée (plus claire, meilleure défense CNIL) B) Clause intégrée aux CGU (plus simple)                          | **A — DPA séparée** : meilleure protection juridique                | Légal                      | **OPEN** |
| QO-RGPD-02 | Widget : bannière de consentement explicite ou case à cocher dans le formulaire ?        | A) Bannière RGPD (mais ajoute de la friction) B) Case à cocher dans le formulaire                                      | **B — Case à cocher** : moins de friction, conforme si bien rédigée | UX + Légal                 | **OPEN** |

---

## Catégorie 2 — Business / Pricing

| ID         | Question                                                              | Options                                                                                             | Recommandation                                            | Impact      | Statut   |
| ---------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------- | -------- |
| QO-B-01    | Trial : avec ou sans CB demandée à l'inscription ?                    | A) Sans CB (plus de signups, plus de charge) B) Avec CB (moins de signups, meilleure qualification) | **A — Sans CB** pour maximiser les signups en early-stage | Acquisition | **OPEN** |
| QO-B-02    | Pause d'abonnement : permettre de suspendre 1 mois (fermeture août) ? | A) Oui, 1 pause/an de max 30 jours B) Non (simplifie le billing Stripe)                             | **A — Pause** : différenciateur fort vs FidMe             | Rétention   | **OPEN** |
| QO-B-03    | Coupon de réduction pour les 100 premiers clients (early adopters) ?  | A) -20 % permanent B) 2 mois offerts C) Aucun                                                       | **A — -20 % permanent** : valorise les early adopters     | Acquisition | **OPEN** |
| QO-TEAM-01 | Employé : inscription autonome (sans invitation) possible ?           | A) Invitation uniquement (sécurisé, contrôlé) B) Inscription libre avec code restaurant             | **A — Invitation uniquement**                             | Sécurité    | **OPEN** |
| QO-TEAM-02 | Nombre max de membres par plan ?                                      | A) Starter: 3, Growth: 10, Pro: illimité B) Starter: 5, Growth: 20, Pro: illimité                   | **A** : cohérent avec les segments de restaurants ciblés  | Pricing     | **OPEN** |

---

## Catégorie 3 — Technique / Architecture

| ID     | Question                                                   | Options                                                                                   | Recommandation                                                  | Impact              | Statut   |
| ------ | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------- | -------- |
| ADR-08 | Widget : polling vs WebSocket                              | A) Polling 30s B) WebSocket C) Server-Sent Events                                         | **A — Polling MVP**                                             | Architecture widget | **OPEN** |
| ADR-09 | Cron job de churn scoring : Vercel Cron ou worker séparé ? | A) Vercel Cron (limit 10s, suffisant pour petits volumes) B) apps/worker (plus robuste)   | **A — Vercel Cron pour MVP**, apps/worker dès Phase 1           | Infrastructure      | **OPEN** |
| ADR-10 | Multi-region : EU uniquement ou global dès le début ?      | A) EU uniquement (RGPD, simplicité, marché cible France) B) Global (expansion future)     | **A — EU only** jusqu'à expansion géographique décidée          | Compliance + Coût   | **OPEN** |
| ADR-11 | Widget : Shadow DOM ou iframe ?                            | A) Shadow DOM (isolation CSS, meilleure UX) B) iframe (isolation totale, plus simple)     | **A — Shadow DOM** : meilleure expérience, isolation suffisante | Widget architecture | **OPEN** |
| ADR-12 | Cache client widget : Redis uniquement ou CDN edge cache ? | A) Redis (dynamique, invalidation facile) B) CDN + Redis (plus performant, plus complexe) | **A — Redis uniquement pour MVP**                               | Performance widget  | **OPEN** |

---

## Catégorie 4 — Go-to-market

| ID        | Question                                                                       | Options                                                                                                  | Recommandation                                                      | Impact               | Statut   |
| --------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------- | -------- |
| QO-GTM-01 | Quel est le canal d'acquisition prioritaire pour les 50 premiers restaurants ? | A) Réseau personnel (zéro coût) B) LinkedIn + contenu C) Partenariats UMIH/GHR D) Cold email restaurants | **A d'abord, puis B** : réseau = moins de 2 mois, contenu = 6+ mois | Croissance initiale  | **OPEN** |
| QO-GTM-02 | Faut-il un commercial dès 50 clients ou rester full self-serve ?               | A) Full self-serve (Product-Led Growth) B) Commercial à temps partiel dès 30 clients                     | **A — PLG d'abord** : adapter si taux de conversion < 5 %           | Modèle de croissance | **OPEN** |
| QO-GTM-03 | Lancer une liste d'attente avant le MVP ?                                      | A) Oui (valide la demande, crée de l'anticipation) B) Non (accélère le time-to-market)                   | **A — Liste d'attente** avec page landing simple                    | Validation marché    | **OPEN** |

---

## Décisions prises (archivées)

| ID      | Décision                                           | Date       | Document de référence |
| ------- | -------------------------------------------------- | ---------- | --------------------- |
| IC-01   | Widget = MVP Must Have (et non Phase 3)            | 2026-06-28 | MASTER_PLAN.md v0.4.0 |
| IC-02   | MRR cible 12 mois = 10 000 € (cible conservatrice) | 2026-06-28 | PRODUCT_BIBLE.md      |
| Pricing | 49/149/299 €/mois (3 plans)                        | 2026-06-20 | PRICING.md            |
| Stack   | Next.js full-stack + Supabase + Vercel + Upstash   | 2026-06-20 | ARCHITECTURE.md       |
| Marché  | France uniquement Phase 0-1                        | 2026-06-20 | MASTER_PLAN.md        |
| Segment | Restauration indépendante (pas les chaînes)        | 2026-06-20 | MASTER_PLAN.md        |

---

## Processus de décision

Pour résoudre une décision :

1. **Analyser** les options (avantages, inconvénients, coût)
2. **Prototyper** si nécessaire (1-2 jours max pour une décision technique)
3. **Décider** et documenter dans le document approprié (ADR pour tech, docs métier pour produit)
4. **Supprimer** l'entrée de ce fichier + ajouter à la section "Décisions prises"
5. **Mettre à jour** CHANGELOG.md avec la décision

---

_LoyaltyFlowAI — Confidentiel — © 2026_
