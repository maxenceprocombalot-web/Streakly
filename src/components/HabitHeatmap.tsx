import { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { colors } from '../constants/theme';
import type { Completion, Habit } from '../types/habit';
import { startOfToday } from '../utils/date';
import { getHeatmapData } from '../utils/stats';

const CELL = 12;
const GAP = 3;
const WEEKS = 16;

interface HabitHeatmapProps {
  habits: Habit[];
  completions: Completion[];
}

function cellColor(ratio: number): string {
  if (ratio <= 0) return colors.ringTrack;
  if (ratio < 0.34) return 'rgba(124, 109, 250, 0.25)';
  if (ratio < 0.67) return 'rgba(124, 109, 250, 0.55)';
  return colors.accent;
}

export function HabitHeatmap({ habits, completions }: HabitHeatmapProps) {
  const today = useMemo(() => startOfToday(), []);
  const days = useMemo(
    () => getHeatmapData(habits, completions, today, WEEKS),
    [habits, completions, today],
  );

  const columns: { dateKey: string; ratio: number }[][] = useMemo(() => {
    const cols: { dateKey: string; ratio: number }[][] = [];
    for (let w = 0; w < WEEKS; w++) {
      cols.push(days.slice(w * 7, w * 7 + 7));
    }
    return cols;
  }, [days]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {columns.map((col, wi) => (
        <View key={wi} style={styles.col}>
          {col.map((day) => (
            <View
              key={day.dateKey}
              style={[styles.cell, { backgroundColor: cellColor(day.ratio) }]}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
  col: {
    flexDirection: 'column',
    gap: GAP,
  },
  cell: {
    width: CELL,
    height: CELL,
    borderRadius: 3,
  },
});
