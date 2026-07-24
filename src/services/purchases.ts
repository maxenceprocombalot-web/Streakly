import Purchases, { LOG_LEVEL, type PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

/**
 * Clés publiques RevenueCat (dashboard → Project settings → API keys).
 * ⚠️ PRODUCTION : remplacer la clé iOS de test par la clé publique réelle
 * (appl_xxx) et renseigner la clé Android (goog_xxx) avant soumission.
 */
const API_KEY_IOS = 'test_pvTbMNshuNxa0fnGeiUvYzMGozW';
const API_KEY_ANDROID = 'goog_REMPLACER_PAR_CLE_ANDROID';

const ENTITLEMENT_ID = 'Streakly Pro';

/** Vrai une fois Purchases.configure() appelé avec une clé valide */
let configured = false;

function isPlaceholderKey(key: string): boolean {
  return key.includes('REMPLACER');
}

export async function initialiserRevenueCat(): Promise<void> {
  if (Platform.OS === 'web' || configured) {
    return;
  }
  const apiKey = Platform.OS === 'ios' ? API_KEY_IOS : API_KEY_ANDROID;
  if (isPlaceholderKey(apiKey)) {
    // Clé non configurée pour cette plateforme : le Pro reste indisponible
    // mais l'app fonctionne normalement (pas de crash au démarrage).
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
