# Wireframes & Maquettes

> **Projet :** LoyaltyFlowAI
> **Statut :** À créer en Phase 0
> **Lié à :** [PRD.md](../PRD.md) | [MASTER_PLAN.md §20](../../../MASTER_PLAN.md#20-principes-ux)

---

## Objectif

Ce dossier centralise les liens vers les maquettes et prototypes de LoyaltyFlowAI. Les maquettes sont créées dans Figma et référencées ici.

---

## Outil de design

**Figma** — lien vers le projet : *[À renseigner lors de la création du fichier Figma]*

---

## Écrans à concevoir (Phase 0 — avant développement)

### Dashboard (opérateur)
- [ ] Page de connexion / inscription
- [ ] Tableau de bord principal (overview métriques)
- [ ] Liste des clients (avec scores de churn)
- [ ] Fiche client individuelle
- [ ] Création / configuration du programme
- [ ] Configuration des récompenses
- [ ] Page "Alertes" (clients à risque)
- [ ] Paramètres (profil, intégration widget)
- [ ] Onboarding (flow de démarrage)

### Widget (client final)
- [ ] État initial (non identifié)
- [ ] État connecté (solde + récompenses)
- [ ] État "Récompense débloquée"
- [ ] Version mobile

---

## Principes UX applicables

Toutes les maquettes doivent respecter les principes définis dans [MASTER_PLAN.md §20](../../../MASTER_PLAN.md#20-principes-ux) :

- **UX1 — Clarté avant tout** : une action principale évidente par écran
- **UX2 — Progressive Disclosure** : options avancées masquées par défaut
- **UX3 — Feedback immédiat** : retour visible en < 100 ms
- **UX5 — Cohérence** : design system shadcn/ui respecté
- **UX6 — Accessibilité** : WCAG 2.1 niveau AA

---

## Structure des fichiers dans ce dossier

*Les maquettes vivent dans Figma, pas dans ce dossier. Ce dossier contient uniquement les exports PNG/SVG des versions validées.*

```
wireframes/
├── README.md          ← Ce fichier
├── dashboard/         ← Exports PNG des écrans dashboard
└── widget/            ← Exports PNG des écrans widget
```
