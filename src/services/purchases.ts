import Purchases, { LOG_LEVEL, type PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// Clés RevenueCat.
// En production, renseigner ces variables dans le fichier .env (non versionné) :
//   EXPO_PUBLIC_RC_KEY_IOS     = appl_xxxxxxxxxxxxxxxxxxxx   (RevenueCat → Project → API keys → Apple App Store)
//   EXPO_PUBLIC_RC_KEY_ANDROID = goog_xxxxxxxxxxxxxxxxxxxx   (RevenueCat → Project → API keys → Google Play Store)
// À défaut (dev / sandbox), on retombe sur la clé de test iOS ci-dessous. Ne JAMAIS committer de vraie clé prod.
const TEST_KEY_IOS = 'test_pvTbMNshuNxa0fnGeiUvYzMGozW';

const API_KEY_IOS = process.env.EXPO_PUBLIC_RC_KEY_IOS ?? TEST_KEY_IOS;
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_KEY_ANDROID ?? '';

const ENTITLEMENT_ID = 'Streakly Pro';

export async function initialiserRevenueCat(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  if (__DEV__) {
    await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  if (Platform.OS === 'ios') {
    Purchases.configure({ apiKey: API_KEY_IOS });
  } else if (Platform.OS === 'android') {
    if (!API_KEY_ANDROID) {
      if (__DEV__) {
        console.warn(
          '[RevenueCat] EXPO_PUBLIC_RC_KEY_ANDROID manquante — achats désactivés sur Android.',
        );
      }
      return;
    }
    Purchases.configure({ apiKey: API_KEY_ANDROID });
  }
}

export async function estProActif(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    const info = await Purchases.getCustomerInfo();
    return info.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}

export async function getOfferings() {
  if (Platform.OS === 'web') {
    return null;
  }
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch {
    return null;
  }
}

export async function acheterAbonnement(rcPackage: PurchasesPackage): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    const { customerInfo } = await Purchases.purchasePackage(rcPackage);
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (e: any) {
    if (e?.userCancelled) {
      return false;
    }
    throw e;
  }
}

export async function restaurerAchats(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}
