import { Platform, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { useSettingsStore } from '../store/settingsStore';

/**
 * ⚠️ PRODUCTION Android : créer l'app + le bloc bannière dans AdMob
 * et remplacer le placeholder ci-dessous par le vrai ID (ca-app-pub-xxx/yyy).
 */
const PROD_UNIT_ID_IOS = 'ca-app-pub-8940748455732058/5292346978';
const PROD_UNIT_ID_ANDROID = 'REMPLACER_PAR_ID_BANNIERE_ANDROID';

const prodUnitId =
  Platform.select({ ios: PROD_UNIT_ID_IOS, android: PROD_UNIT_ID_ANDROID }) ??
  PROD_UNIT_ID_IOS;

// Tant que l'ID réel n'est pas configuré, on sert la bannière de test
// (afficher l'ID d'exemple en prod = zéro revenu + risque de ban AdMob).
const BANNER_UNIT_ID =
  __DEV__ || prodUnitId.includes('REMPLACER')
    ? TestIds.ADAPTIVE_BANNER
    : prodUnitId;

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
