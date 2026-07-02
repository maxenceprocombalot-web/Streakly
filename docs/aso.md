# ASO — Streakly

Squelette App Store Optimization pour **Streakly** (habit tracker premium : streaks, joker
mensuel qui sauve une série, challenges 30 jours, coach IA, partage social).

> Pré-rempli intelligemment. Les `TODO:` marquent les points où Maxence doit trancher
> (positionnement, A/B, choix des mots-clés selon la recherche réelle).
> Comptes de caractères vérifiés à la main — à re-vérifier après toute édition.

---

## 1. Titre (App Store title — max 30 caractères)

Le titre a le poids ASO le plus fort. On garde la marque + 1-2 mots-clés porteurs.

| Langue | Proposition | Caractères |
| ------ | ----------- | ---------- |
| FR | `Streakly: Habitudes & Séries` | 28 |
| EN | `Streakly: Habits & Streaks` | 26 |

Alternatives à A/B tester :
- FR : `Streakly - Suivi d'habitudes` (28)
- EN : `Streakly - Habit Tracker` (24)

> TODO: choisir marque-first (notoriété) vs mot-clé-first (acquisition froide).
> TODO: valider que « Séries » / « Streaks » ne prête pas à confusion (séries TV).

---

## 2. Sous-titre (subtitle — max 30 caractères)

Deuxième champ le plus pondéré. On y met le bénéfice + un mot-clé non présent dans le titre.

| Langue | Proposition | Caractères |
| ------ | ----------- | ---------- |
| FR | `Suivi d'habitudes & motivation` | 30 |
| EN | `Build habits that stick` | 23 |

Alternatives :
- FR : `Objectifs, défis 30 jours & IA` (30)
- EN : `Streaks, 30-day challenges & AI` (31 — TODO: raccourcir, ex. `30-day challenges & AI coach` = 28)

> TODO: le sous-titre doit compléter le titre en mots-clés, pas les répéter.

---

## 3. Mots-clés (keyword field — max 100 caractères, séparés par des virgules SANS espace)

Règles Apple : pas d'espace après les virgules (chaque espace = 1 caractère perdu), ne pas
répéter les mots déjà dans le titre/sous-titre (ils sont indexés à part), singulier suffit
(Apple gère le pluriel), pas de nom de marque concurrente.

### FR (100/100 caractères)

```
habitude,routine,serie,streak,motivation,objectif,discipline,coach,defi,challenge,productivite,suivi
```

### EN (99/100 caractères)

```
habit,routine,streak,tracker,motivation,goal,discipline,coach,challenge,productivity,daily,reminder
```

Réserve de mots-clés (à faire tourner selon les perfs) :
`rappel, bien-etre, focus, jour, calendrier, defi30, sport, meditation, lecture, sommeil,
habits, goals, focus, streaks, journal, self`

> TODO: valider les volumes de recherche réels (ex. via AppTweak / Sensor Tower / App Store
> Connect Search) avant de figer — cette liste est une hypothèse de départ.
> TODO: décider si on cible « coach IA » (mot-clé émergent, peu concurrentiel) plus agressivement.

---

## 4. Description longue — FR

Structure : **Hook** (2-3 lignes qui vendent, visibles avant « plus ») → **Features** →
**CTA**. La description compte peu en ASO iOS (non indexée) mais beaucoup en conversion.

```
Ne brisez plus jamais vos bonnes habitudes.

Streakly transforme vos objectifs en séries que vous ne voudrez plus jamais casser.
Chaque jour tenu allonge votre streak — et voir la chaîne grandir devient la meilleure
des motivations.

CE QUI REND STREAKLY DIFFÉRENT

• Séries qui motivent — Suivez chaque habitude jour après jour et regardez votre streak
  s'allonger. La preuve visuelle de votre régularité.

• Joker mensuel — Une mauvaise journée ? Utilisez votre joker du mois pour sauver votre
  série sans repartir de zéro. Parce que la vie arrive.

• Challenges 30 jours — Lancez-vous des défis clés en main pour installer une habitude
  durablement, un jour à la fois.

• Coach IA — Des conseils personnalisés et des encouragements au bon moment pour ne
  jamais lâcher.

• Partage social — Partagez vos séries et vos réussites avec vos amis pour rester
  responsable et célébrer vos victoires.

• Rappels intelligents — Des notifications qui vous relancent pile quand il le faut.

PENSÉE POUR DURER

Interface épurée, sombre et sans distraction. Vos données restent claires, vos progrès
toujours sous les yeux.

Commencez votre première série aujourd'hui. Téléchargez Streakly et ne cassez plus la chaîne.
```

> TODO: aligner le ton (vouvoiement vs tutoiement) avec le reste de l'app.
> TODO: mentionner explicitement Streakly Pro (abonnement) si exigé par la review Apple —
> voir section 6.

---

## 5. Description longue — EN

```
Never break your good habits again.

Streakly turns your goals into streaks you won't want to break. Every day you show up,
your streak grows longer — and watching the chain build becomes the best motivation there is.

WHAT MAKES STREAKLY DIFFERENT

• Streaks that motivate — Track every habit day by day and watch your streak grow.
  Visual proof of your consistency.

• Monthly Joker — Had a bad day? Use your monthly joker to save your streak instead of
  starting over. Because life happens.

• 30-day challenges — Take on ready-made challenges to build a lasting habit, one day
  at a time.

• AI coach — Personalized tips and encouragement at the right moment so you never quit.

• Social sharing — Share your streaks and wins with friends to stay accountable and
  celebrate your progress.

• Smart reminders — Notifications that nudge you exactly when you need them.

BUILT TO LAST

Clean, dark, distraction-free interface. Your data stays clear, your progress always in view.

Start your first streak today. Download Streakly and don't break the chain.
```

> TODO: relecture par un natif anglophone avant soumission.

---

## 6. Notes de catégorie & métadonnées

- **Catégorie principale** : `Santé et forme` (Health & Fitness) — cœur du sujet habitudes/
  bien-être, forte intention.
- **Catégorie secondaire** : `Productivité` (Productivity) — capte la recherche « habit
  tracker / discipline / objectifs ».
  > TODO: arbitrer principale vs secondaire selon la concurrence (Health & Fitness est très
  > disputée ; Productivity peut mieux ranker au lancement).
- **Classification d'âge** : 4+ attendu (pas de contenu sensible).
- **Modèle éco** : freemium + **Streakly Pro** (abonnement, géré via RevenueCat). Les fonctions
  premium (coach IA, challenges illimités, joker) doivent être décrites honnêtement dans les
  captures et, si Apple l'exige, dans la description + le champ « Notes pour la review ».
- **Monétisation additionnelle** : publicités (Google AdMob) en version gratuite → à déclarer
  dans le questionnaire de confidentialité App Store Connect (données de suivi / IDFA).
- **Localisations à couvrir** : FR (primaire) + EN. TODO: prévoir ES / DE / IT si expansion.

### Notes pour l'équipe de review Apple (brouillon)

```
Streakly est un habit tracker. Streakly Pro est un abonnement auto-renouvelable géré via
RevenueCat qui débloque le coach IA, les challenges illimités et le joker mensuel. La version
gratuite affiche des publicités (Google AdMob). Aucun compte n'est requis pour tester les
fonctions de base. TODO: fournir un compte de démonstration Pro si nécessaire.
```

> TODO: compléter les champs App Store Connect associés (URL support, politique de
> confidentialité, URL marketing) — non couverts par ce document.

---

## 7. Checklist avant soumission

- [ ] Titre FR / EN ≤ 30 caractères, marque + mot-clé validés
- [ ] Sous-titre FR / EN ≤ 30 caractères
- [ ] Champ mots-clés FR / EN ≤ 100 caractères, sans espace après les virgules
- [ ] Volumes de recherche des mots-clés vérifiés (outil ASO)
- [ ] Descriptions relues (ton FR, natif EN)
- [ ] Catégories principale + secondaire arbitrées
- [ ] Abonnement Pro & pubs déclarés (confidentialité + notes review)
- [ ] Captures d'écran cohérentes avec les features listées (TODO: hors de ce doc)
```
