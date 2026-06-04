import Purchases, { LOG_LEVEL, type PurchasesPackage } from 'react-native-purchases';
import { Platform } from 'react-native';

const API_KEY_IOS = 'test_pvTbMNshuNxa0fnGeiUvYzMGozW';
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
