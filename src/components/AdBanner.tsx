import { Platform, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

import { useSettingsStore } from '../store/settingsStore';

const BANNER_UNIT_ID = __DEV__
  ? Platform.select({
      ios: TestIds.ADAPTIVE_BANNER,
      android: TestIds.ADAPTIVE_BANNER,
    }) ?? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-8940748455732058/5292346978';

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
