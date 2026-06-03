import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cardBase, colors, spacing, typography } from '../constants/theme';
import { getWeekDayShortLabels } from '../i18n';
import { useTranslation } from '../i18n/useTranslation';
import type { DayProgress } from '../utils/stats';
import { getPerformanceMessage } from '../utils/stats';

interface StatsOverviewProps {
  totalHabits: number;
  currentStreak: number;
  bestStreak: number;
  weekRate: number;
  weekDone: number;
  weekTotal: number;
  weekProgress: DayProgress[];
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export function StatsOverview({
  totalHabits,
  currentStreak,
  bestStreak,
  weekRate,
  weekDone,
  weekTotal,
  weekProgress,
}: StatsOverviewProps) {
  const { t, locale } = useTranslation();
  const message = getPerformanceMessage(weekRate);
  const dayLabels = useMemo(() => getWeekDayShortLabels(), [locale]);

  return (
    <View>
      <View style={styles.grid}>
        <Metric label={t('stats.metrics.habits')} value={String(totalHabits)} />
        <Metric label={t('stats.metrics.streak')} value={String(currentStreak)} />
        <Metric label={t('stats.metrics.record')} value={String(bestStreak)} />
        <Metric label={t('stats.metrics.week7')} value={`${weekRate}%`} />
      </View>

      <Text style={styles.section}>{t('stats.last7Days')}</Text>
      <View style={styles.chart}>
        {weekProgress.map((day, i) => {
          const h = day.total > 0 ? Math.max(6, day.ratio * 84) : 3;
          const active = day.total > 0 && day.ratio > 0;
          return (
            <View key={day.dateKey} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.bar,
                    { height: h },
                    active && styles.barActive,
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{dayLabels[i]}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.messageBox}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.messageSub}>
          {t('stats.completions', { done: weekDone, total: weekTotal })}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metric: {
    width: '48%',
    ...cardBase,
    padding: spacing.md,
  },
  metricLabel: {
    ...typography.caption,
    fontSize: 12,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  metricValue: {
    color: colors.text,
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: -2,
    lineHeight: 48,
  },
  section: {
    ...typography.sectionTitle,
    marginBottom: spacing.md,
  },
  chart: {
    ...cardBase,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.md,
    paddingBottom: spacing.sm,
    marginBottom: spacing.lg,
    alignItems: 'flex-end',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    height: 84,
    justifyContent: 'flex-end',
    width: '80%',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    backgroundColor: colors.ringTrack,
  },
  barActive: {
    backgroundColor: colors.accent,
    opacity: 0.85,
  },
  barLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  messageBox: {
    ...cardBase,
    padding: spacing.md,
  },
  message: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  messageSub: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
});
