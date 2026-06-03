import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveHabitColor } from '../constants/habitColors';
import { cardBase, colors, spacing } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import type { Habit, WeekDay } from '../types/habit';
import { getWeekDayLabels } from '../utils/date';

interface ManageHabitCardProps {
  habit: Habit;
  weekRate: number;
  streak: number;
  hasIdentity?: boolean;
  onToggleDay: (day: WeekDay) => void;
  onDelete: () => void;
}

function rateColor(rate: number): string {
  if (rate >= 70) return colors.success;
  if (rate >= 40) return colors.orange;
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
              <View style={styles.streakBadge}>
                <Text style={styles.streakFire}>🔥</Text>
                <Text style={styles.streakVal}>{streak}</Text>
              </View>
            ) : null}
            <Text style={styles.category}>{habit.category}</Text>
          </View>
        </View>
        <Text style={[styles.rate, { color: rateColor(weekRate) }]}>{weekRate}%</Text>
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
                style={[
                  styles.dayPill,
                  active && { backgroundColor: `${habitColor}28`, borderColor: `${habitColor}66` },
                ]}
              >
                <Text style={[styles.dayPillText, active && { color: habitColor }]}>
                  {short}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={onDelete} hitSlop={12} style={styles.deleteBtn}>
          <Text style={styles.delete}>×</Text>
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
  rate: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -1,
    lineHeight: 34,
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
