import Purchases, { LOG_LEVEL, type PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

// Cles RevenueCat.
// En production, renseigner ces variables dans le fichier .env (non versionne) :
//   EXPO_PUBLIC_RC_KEY_IOS     = appl_xxx   (RevenueCat -> Project -> API keys -> Apple App Store)
//   EXPO_PUBLIC_RC_KEY_ANDROID = goog_xxx   (RevenueCat -> Project -> API keys -> Google Play Store)
// A defaut (dev / sandbox), on retombe sur la cle de test iOS. Ne JAMAIS committer de vraie cle prod.
const TEST_KEY_IOS = 'test_pvTbMNshuNxa0fnGeiUvYzMGozW';
const PLACEHOLDER_ANDROID = 'goog_REMPLACER_PAR_CLE_ANDROID';

const API_KEY_IOS = process.env.EXPO_PUBLIC_RC_KEY_IOS ?? TEST_KEY_IOS;
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_KEY_ANDROID ?? PLACEHOLDER_ANDROID;

const ENTITLEMENT_ID = 'Streakly Pro';

/** Vrai une fois Purchases.configure() appele avec une cle valide */
let configured = false;

function isPlaceholderKey(key: string): boolean {
  return !key || key.includes('REMPLACER');
}

export async function initialiserRevenueCat(): Promise<void> {
  if (Platform.OS === 'web' || configured) {
    return;
  }
  const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
  if (isPlaceholderKey(apiKey)) {
    // Cle non configuree pour cette plateforme : le Pro reste indisponible
    // mais l'app fonctionne normalement (pas de crash au demarrage).
    if (__DEV__) {
      console.warn(
        `[RevenueCat] Cle ${Platform.OS} manquante - achats desactives sur cette plateforme.`,
      );
    }
    return;
  }
  if (__DEV__) {
    await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }
  Purchases.configure({ apiKey });
  configured = true;
}

export async function estProActif(): Promise<boolean> {
  if (!configured) {
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
  if (!configured) {
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
  if (!configured) {
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
  if (!configured) {
    return false;
  }
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch {
    return false;
  }
}
