import Constants from 'expo-constants';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageHeader } from '../components/PageHeader';
import { cardBase, colors, radius, spacing, typography } from '../constants/theme';
import type { AppLocale } from '../i18n';
import { useTranslation } from '../i18n/useTranslation';
import { restaurerAchats } from '../services/purchases';
import { requestReviewNow } from '../services/storeReview';
import { useSettingsStore } from '../store/settingsStore';
import { useHabitStore } from '../store/habitStore';
import { isJokerAvailable } from '../utils/joker';

export function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { t, locale, setLocale } = useTranslation();
  const jokerUsedMonth = useHabitStore((s) => s.jokerUsedMonth);
  const jokerAvailable = isJokerAvailable(jokerUsedMonth);
  const proModeEnabled = useSettingsStore((s) => s.proModeEnabled);
  const setProModeEnabled = useSettingsStore((s) => s.setProModeEnabled);
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';
  const isPro = useSettingsStore((s) => s.isPro);
  const openPaywall = useSettingsStore((s) => s.openPaywall);
  const setIsPro = useSettingsStore((s) => s.setIsPro);
  const [restoring, setRestoring] = useState(false);

  const pickLocale = (next: AppLocale): void => {
    if (next !== locale) {
      setLocale(next);
    }
  };

  const handleShareApp = async (): Promise<void> => {
    try {
      await Share.share({ message: t('settings.shareMessage') });
    } catch {
      // Partage annulé
    }
  };

  const handleRestore = async (): Promise<void> => {
    if (restoring) {
      return;
    }
    setRestoring(true);
    const restored = await restaurerAchats();
    if (restored) {
      setIsPro(true);
    }
    setRestoring(false);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.sm,
        paddingBottom: insets.bottom + 100,
        paddingHorizontal: spacing.md,
      }}
      showsVerticalScrollIndicator={false}
    >
      <PageHeader title={t('settings.title')} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Streakly</Text>
        <Text style={styles.cardText}>{t('settings.version', { version: appVersion })}</Text>
      </View>

      {!isPro ? (
        <Pressable
          onPress={openPaywall}
          style={({ pressed }) => [styles.proCard, pressed && styles.pressed]}
        >
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.proTitle}>{t('settings.upgradeTitle')}</Text>
              <Text style={styles.proHintText}>{t('settings.upgradeHint')}</Text>
            </View>
            <Text style={styles.proArrow}>→</Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('settings.proActiveTitle')}</Text>
          <Text style={styles.cardText}>{t('settings.proActiveText')}</Text>
        </View>
      )}

      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => void handleShareApp()}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
        >
          <Text style={styles.actionEmoji}>📣</Text>
          <Text style={styles.actionLabel}>{t('settings.shareApp')}</Text>
        </Pressable>
        <Pressable
          onPress={() => void requestReviewNow()}
          style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed]}
        >
          <Text style={styles.actionEmoji}>⭐</Text>
          <Text style={styles.actionLabel}>{t('settings.rateApp')}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.language')}</Text>
        <View style={styles.langRow}>
          <Pressable
            onPress={() => pickLocale('fr')}
            style={[styles.langBtn, locale === 'fr' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, locale === 'fr' && styles.langTextActive]}>
              {t('settings.languageFr')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => pickLocale('en')}
            style={[styles.langBtn, locale === 'en' && styles.langBtnActive]}
          >
            <Text style={[styles.langText, locale === 'en' && styles.langTextActive]}>
              {t('settings.languageEn')}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={styles.cardTitle}>{t('settings.proMode')}</Text>
            <Text style={styles.cardHint}>{t('settings.proHint')}</Text>
          </View>
          <Switch
            value={proModeEnabled}
            onValueChange={setProModeEnabled}
            trackColor={{ false: colors.ringTrack, true: colors.accentSoft }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.joker')}</Text>
        <Text style={styles.cardText}>
          {jokerAvailable ? t('settings.jokerAvailable') : t('settings.jokerUsed')}
        </Text>
        <Text style={styles.cardHint}>{t('settings.jokerHint')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.data')}</Text>
        <Text style={styles.cardText}>{t('settings.dataText')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.notifications')}</Text>
        <Text style={styles.cardText}>{t('settings.notificationsText')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('settings.streakInfo')}</Text>
        <Text style={styles.cardText}>{t('settings.streakInfoText')}</Text>
      </View>

      <Pressable
        onPress={() => void handleRestore()}
        style={({ pressed }) => [pressed && styles.pressed]}
        disabled={restoring}
      >
        <Text style={styles.restoreText}>
          {restoring ? t('settings.restoring') : t('settings.restorePurchases')}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowText: {
    flex: 1,
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  langBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: cardBase.borderColor,
    alignItems: 'center',
  },
  langBtnActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  langText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  langTextActive: {
    color: colors.text,
    fontWeight: '600',
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.xs,
    letterSpacing: -0.2,
  },
  cardText: {
    ...typography.body,
    fontWeight: '500',
  },
  cardHint: {
    ...typography.caption,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  proCard: {
    ...cardBase,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderColor: 'rgba(124, 109, 250, 0.45)',
    backgroundColor: colors.accentSoft,
  },
  proTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  proHintText: {
    ...typography.caption,
    lineHeight: 18,
  },
  proArrow: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionBtn: {
    ...cardBase,
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.card,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionLabel: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
  restoreText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
