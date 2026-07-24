import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveHabitColor } from '../constants/habitColors';
import { cardBase, colors, spacing } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import type { Habit, WeekDay } from '../types/habit';
import { getWeekDayFull, getWeekDayLabels } from '../utils/date';

interface ManageHabitCardProps {
  habit: Habit;
  weekRate: number;
  streak: number;
  hasIdentity?: boolean;
  onToggleDay: (day: WeekDay) => void;
  onDelete: () => void;
}

function rateColor(rate: number): string {
  if (rate >= 80) return colors.success;
  if (rate >= 50) return colors.orange;
  return colors.danger;
}

export function ManageHabitCard({
  habit,
  weekRate,
  streak,
  hasIdentity = false,
  onToggleDay,
  onDelete,
}: ManageHabitCardProps) {
  const { t, locale } = useTranslation();
  const weekDayLabels = useMemo(() => getWeekDayLabels(), [locale]);
  const fullDayLabels = useMemo(
    () => new Map(getWeekDayFull().map(({ day, label }) => [day, label])),
    [locale],
  );
  const habitColor = resolveHabitColor(habit.color);

  return (
    <View style={[styles.card, { borderLeftColor: habitColor }]}>
      <View style={styles.topRow}>
        <Text style={styles.emoji}>{habit.emoji}</Text>
        <View style={styles.middle}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{habit.name}</Text>
            {hasIdentity ? <Text style={styles.trophy}>🏆</Text> : null}
          </View>
          <View style={styles.metaRow}>
            {streak > 0 ? (
              <View
                style={styles.streakBadge}
                accessible
                accessibilityLabel={t('manage.a11y.streak', { days: streak })}
              >
                <Text style={styles.streakFire}>🔥</Text>
                <Text style={styles.streakVal}>{streak}</Text>
              </View>
            ) : null}
            <Text style={styles.category}>{habit.category}</Text>
          </View>
        </View>
        <View
          style={styles.rateBlock}
          accessible
          accessibilityLabel={t('manage.a11y.weekRate', { rate: weekRate })}
        >
          <Text style={[styles.rate, { color: rateColor(weekRate) }]}>{weekRate}%</Text>
          <Text style={styles.rateLabel}>7J</Text>
          <View style={styles.rateTrack} importantForAccessibility="no-hide-descendants">
            <View
              style={[
                styles.rateFill,
                { width: `${weekRate}%` as any, backgroundColor: rateColor(weekRate) },
              ]}
            />
          </View>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.days}>
          {weekDayLabels.map(({ day, short }) => {
            const weekDay = day as WeekDay;
            const active = habit.daysOfWeek.includes(weekDay);
            return (
              <Pressable
                key={`${habit.id}-${day}`}
                onPress={() => onToggleDay(weekDay)}
                accessibilityRole="button"
                accessibilityLabel={fullDayLabels.get(day) ?? short}
                accessibilityState={{ selected: active }}
                accessibilityHint={t('manage.a11y.dayToggleHint')}
                style={[
                  styles.dayPill,
                  active && { backgroundColor: `${habitColor}28`, borderColor: `${habitColor}66` },
                ]}
              >
                <Text
                  style={[styles.dayPillText, active && { color: habitColor }]}
                  importantForAccessibility="no"
                >
                  {short}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          onPress={onDelete}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={t('manage.a11y.deleteHabit', { name: habit.name })}
          style={styles.deleteBtn}
        >
          <Text style={styles.delete} importantForAccessibility="no">×</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...cardBase,
    padding: spacing.md,
    paddingLeft: spacing.md + 3,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 28,
    lineHeight: 34,
  },
  middle: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    flex: 1,
  },
  trophy: {
    fontSize: 15,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  streakFire: {
    fontSize: 13,
  },
  streakVal: {
    color: colors.orange,
    fontSize: 13,
    fontWeight: '700',
  },
  category: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  rateBlock: {
    alignItems: 'center',
    minWidth: 52,
  },
  rate: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 32,
  },
  rateLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 1,
  },
  rateTrack: {
    width: 44,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.ringTrack,
    marginTop: 4,
    overflow: 'hidden',
  },
  rateFill: {
    height: '100%',
    borderRadius: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  days: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  dayPill: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  dayPillText: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    paddingHorizontal: 4,
  },
  delete: {
    color: colors.textSecondary,
    fontSize: 24,
    fontWeight: '300',
    lineHeight: 24,
  },
});
