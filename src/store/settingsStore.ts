import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  getDeviceLocale,
  LOCALE_STORAGE_KEY,
  setI18nLocale,
  type AppLocale,
} from '../i18n';

interface SettingsState {
  proModeEnabled: boolean;
  isPro: boolean;
  isPaywallOpen: boolean;
  locale: AppLocale;
  setProModeEnabled: (enabled: boolean) => void;
  setIsPro: (value: boolean) => void;
  openPaywall: () => void;
  closePaywall: () => void;
  setLocale: (locale: AppLocale) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      proModeEnabled: false,
      isPro: false,
      isPaywallOpen: false,
      locale: getDeviceLocale(),
      setProModeEnabled: (enabled: boolean) => set({ proModeEnabled: enabled }),
      setIsPro: (value: boolean) => set({ isPro: value }),
      openPaywall: () => set({ isPaywallOpen: true }),
      closePaywall: () => set({ isPaywallOpen: false }),
      setLocale: (locale: AppLocale) => {
        setI18nLocale(locale);
        void AsyncStorage.setItem(LOCALE_STORAGE_KEY, locale);
        set({ locale });
      },
    }),
    {
      name: 'streakly-settings-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        proModeEnabled: state.proModeEnabled,
        isPro: state.isPro,
        locale: state.locale,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.locale) {
          setI18nLocale(state.locale);
        }
      },
    },
  ),
);

/** Initialise la locale (stockée ou appareil) au démarrage */
export async function initAppLocale(): Promise<AppLocale> {
  const saved = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
  const locale: AppLocale =
    saved === 'fr' || saved === 'en' ? saved : getDeviceLocale();
  setI18nLocale(locale);
  useSettingsStore.setState({ locale });
  return locale;
}
