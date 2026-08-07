import { Platform, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { useSettingsStore } from '../store/settingsStore';

// IDs d'unité AdMob de production, externalisés dans le .env (jamais commités).
// Chaque plateforme a sa propre unité (convention AdMob).
const PROD_BANNER_UNIT_ID = Platform.select({
  ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS,
  android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID,
});

// En dev, ou si l'ID de prod n'est pas renseigné, on retombe sur les IDs de test
// Google : jamais d'unité vide ni de « vraie » pub servie par erreur en développement.
const BANNER_UNIT_ID =
  __DEV__ || !PROD_BANNER_UNIT_ID ? TestIds.ADAPTIVE_BANNER : PROD_BANNER_UNIT_ID;

export function AdBanner() {
  const isPro = useSettingsStore((s) => s.isPro);
  const proModeEnabled = useSettingsStore((s) => s.proModeEnabled);

  if (isPro || proModeEnabled) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <BannerAd
        unitId={BANNER_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: false }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    width: '100%',
  },
});
