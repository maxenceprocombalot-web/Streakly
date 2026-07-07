import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';

import { colors, radius } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import { useHabitStore } from '../store/habitStore';
import { getHeatmapData } from '../utils/stats';
import { startOfToday } from '../utils/date';

const CARD_WIDTH = 320;
const HEATMAP_WEEKS = 8;
const CELL = 14;
const CELL_GAP = 4;

function heatColor(ratio: number): string {
  if (ratio <= 0) return 'rgba(255, 255, 255, 0.06)';
  if (ratio < 0.34) return 'rgba(124, 109, 250, 0.35)';
  if (ratio < 0.67) return 'rgba(124, 109, 250, 0.6)';
  if (ratio < 1) return 'rgba(124, 109, 250, 0.8)';
  return colors.accent;
}

interface ShareStreakCardProps {
  streak: number;
}

/**
 * Carte visuelle partageable (capturée en image via ViewShot).
 * Format vertical adapté aux stories Instagram / TikTok.
 */
export const ShareStreakCard = forwardRef<ViewShot, ShareStreakCardProps>(
  function ShareStreakCard({ streak }, ref) {
    const { t } = useTranslation();
    const habits = useHabitStore((s) => s.habits);
    const completions = useHabitStore((s) => s.completions);

    const heatmap = getHeatmapData(
      habits,
      completions,
      startOfToday(),
      HEATMAP_WEEKS,
    );
    const columns: (typeof heatmap)[] = [];
    for (let w = 0; w < HEATMAP_WEEKS; w++) {
      columns.push(heatmap.slice(w * 7, w * 7 + 7));
    }

    return (
      <ViewShot ref={ref} options={{ format: 'png', quality: 1 }}>
        <LinearGradient
          colors={['#12101f', '#080a0e']}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.fire}>🔥</Text>
          <Text style={styles.streakValue}>{streak}</Text>
          <Text style={styles.streakLabel}>{t('share.daysStreak')}</Text>

          <View style={styles.heatmap}>
            {columns.map((week, wi) => (
              <View key={wi} style={styles.heatCol}>
                {week.map((day) => (
                  <View
                    key={day.dateKey}
                    style={[styles.heatCell, { backgroundColor: heatColor(day.ratio) }]}
                  />
                ))}
              </View>
            ))}
          </View>
          <Text style={styles.heatCaption}>{t('share.heatmapCaption')}</Text>

          <View style={styles.footer}>
            <Text style={styles.brand}>Streakly</Text>
            <Text style={styles.tagline}>{t('share.tagline')}</Text>
          </View>
        </LinearGradient>
      </ViewShot>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 28,
    paddingHorizontal: 24,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(124, 109, 250, 0.25)',
  },
  fire: {
    fontSize: 56,
    marginBottom: 4,
  },
  streakValue: {
    color: colors.text,
    fontSize: 88,
    fontWeight: '800',
    letterSpacing: -4,
    lineHeight: 92,
  },
  streakLabel: {
    color: colors.orange,
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 28,
  },
  heatmap: {
    flexDirection: 'row',
    gap: CELL_GAP,
  },
  heatCol: {
    gap: CELL_GAP,
  },
  heatCell: {
    width: CELL,
    height: CELL,
    borderRadius: 3,
  },
  heatCaption: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 10,
    marginBottom: 28,
  },
  footer: {
    alignItems: 'center',
  },
  brand: {
    color: colors.accent,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
