import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const RING_SIZE = 216;
const STROKE = 7;
const R = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface ProgressRingProps {
  progress: number;
  doneCount: number;
  totalCount: number;
  accentColor?: string;
}

export function ProgressRing({
  progress,
  doneCount,
  totalCount,
  accentColor = colors.accent,
}: ProgressRingProps) {
  const { t } = useTranslation();
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clamped = Math.min(100, Math.max(0, progress));
    Animated.timing(progressAnim, {
      toValue: clamped,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const displayPercent = Math.round(progress);

  return (
    <View style={styles.block}>
      <View style={styles.wrapper}>
        <Svg width={RING_SIZE} height={RING_SIZE}>
          <Circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={R}
            stroke={colors.ringTrack}
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={R}
            stroke={accentColor}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
          />
        </Svg>
        <View style={styles.label}>
          <View style={styles.percentRow}>
            <Text style={styles.percent}>{displayPercent}</Text>
            <Text style={[styles.percentSign, { color: accentColor }]}>%</Text>
          </View>
        </View>
      </View>
      <Text style={styles.subtitle}>
        {t('today.progressHabits', { done: doneCount, total: totalCount })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
  },
  wrapper: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  percent: {
    color: colors.text,
    fontSize: 76,
    fontWeight: '800',
    letterSpacing: -4,
    lineHeight: 80,
  },
  percentSign: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 14,
    lineHeight: 24,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 17,
    fontWeight: '400',
    marginTop: 14,
    letterSpacing: -0.2,
  },
});
