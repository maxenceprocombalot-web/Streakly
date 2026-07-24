# 🚀 Checklist de lancement Streakly

Tout ce qui reste à faire, dans l'ordre. Les cases ✅ sont déjà faites (par le code).

## ✅ Déjà fait dans le code
- [x] ATT (App Tracking Transparency) + SKAdNetwork configurés pour iOS
- [x] RevenueCat sécurisé : pas de crash si clé manquante (Android)
- [x] AdMob : bannière de test servie tant que l'ID Android réel n'est pas configuré
- [x] Politique de confidentialité + CGU hébergées sur GitHub Pages
- [x] Liens légaux dans le paywall (exigé par Apple pour les abonnements)
- [x] Textes de fiche store FR/EN prêts (`store/listing-fr.md` / `listing-en.md`)

## 1️⃣ Comptes (à faire une fois)
- [ ] Apple Developer Program — 99 €/an → https://developer.apple.com/programs/enroll/
- [ ] Google Play Console — 25 $ une fois → https://play.google.com/console/signup
- [ ] Compte Expo (gratuit) pour EAS Build → https://expo.dev

## 2️⃣ RevenueCat (30 min)
Dashboard → https://app.revenuecat.com
- [ ] App Store Connect : créer les 3 achats intégrés (In-App Purchases) :
      - `streakly_pro_monthly` (abo auto-renouvelable 2,99 €/mois)
      - `streakly_pro_annual` (abo auto-renouvelable 19,99 €/an)
      - `streakly_pro_lifetime` (achat non consommable 49,99 €)
- [ ] Google Play Console : créer les mêmes produits
- [ ] RevenueCat : lier les produits → Entitlement **"Streakly Pro"** → Offering "default"
      avec les packages Monthly / Annual / Lifetime
- [ ] Récupérer la **clé publique iOS** (appl_xxx) et la **clé Android** (goog_xxx)
- [ ] Les coller dans `src/services/purchases.ts` (remplacer la clé test et le placeholder)

## 3️⃣ AdMob (15 min)
Dashboard → https://apps.admob.com
- [ ] Créer l'app **Android** dans AdMob → copier l'App ID (ca-app-pub-xxx~yyy)
      → le mettre dans `app.json` (`androidAppId`, remplace l'ID d'exemple Google)
- [ ] Créer un bloc **bannière Android** → copier l'ID (ca-app-pub-xxx/yyy)
      → le mettre dans `src/components/AdBanner.tsx` (`PROD_UNIT_ID_ANDROID`)
- [ ] Vérifier que l'app iOS existe bien dans AdMob avec l'App ID d'`app.json`
- [ ] Après publication : lier chaque app AdMob à sa fiche store (obligatoire pour être payé)

## 4️⃣ Coach IA (décision)
La clé OpenAI (`EXPO_PUBLIC_OPENAI_KEY`) ne doit **jamais** être embarquée dans
l'app publiée (extractible → facture illimitée à ta charge). Deux options :
- [ ] Option A (recommandé v1) : ne pas définir la clé → le Coach reste en mode démo
- [ ] Option B (plus tard) : petit backend proxy (Cloudflare Worker) qui garde la clé

## 5️⃣ Builds (1h + attente)
```bash
npm install                          # récupère les nouvelles dépendances
npx eas login                        # ton compte Expo
npx eas build --platform ios --profile production
npx eas build --platform android --profile production
```
- [ ] Tester le build iOS via TestFlight sur ton iPhone :
      notifications, achat sandbox, partage de la carte streak, pubs test
- [ ] Tester le build Android (APK/AAB interne)

## 6️⃣ Fiches store (2h)
- [ ] Screenshots iOS : 6,7" (1290×2796) obligatoire — 3 à 5 écrans
      (Aujourd'hui avec streak, Stats heatmap, carte de partage, défis, paywall)
- [ ] Screenshots Android : téléphone (1080×1920 min)
- [ ] Copier les textes depuis `store/listing-fr.md` et `store/listing-en.md`
- [ ] URL de confidentialité : https://maxenceprocombalot-web.github.io/Streakly/privacy.html
- [ ] Formulaire « Confidentialité de l'app » (App Store) / « Sécurité des données » (Play) :
      déclarer Identifiants publicitaires + Données d'utilisation (AdMob),
      Historique d'achats (RevenueCat), pas de données de santé collectées
- [ ] App Store : classification 4+ · Play : questionnaire de contenu

## 7️⃣ Soumission
```bash
npx eas submit --platform ios
npx eas submit --platform android
```
- [ ] iOS : review Apple ~24–48 h
- [ ] Android (compte perso créé après nov. 2023) : test fermé obligatoire
      **12 testeurs pendant 14 jours** avant l'accès production
      → recrute 12 amis/famille dès maintenant pour lancer le chrono

## ⚠️ Pièges connus
- Le **package Android** est `com.streaklyapp.ios` (suffixe ".ios" sur Android).
  Il est définitif après le premier upload Play. Si tu veux le corriger en
  `com.streaklyapp.android`, c'est MAINTENANT ou jamais.
- Les achats sandbox iOS nécessitent un **compte Sandbox** (App Store Connect →
  Utilisateurs et accès → Sandbox).
- La demande ATT apparaît au premier lancement — ne pas la retirer, Apple la vérifie.
