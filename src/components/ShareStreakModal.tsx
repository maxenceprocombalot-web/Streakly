import { useRef, useState } from 'react';
import {
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Sharing from 'expo-sharing';
import type ViewShot from 'react-native-view-shot';

import { colors, radius, spacing } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import { hapticSuccess } from '../utils/haptics';
import {
  MILESTONE_EMOJI,
  milestoneTitleKey,
  type Milestone,
} from '../utils/milestones';
import { ConfettiAnimation } from './ConfettiAnimation';
import { ShareStreakCard } from './ShareStreakCard';

interface ShareStreakModalProps {
  visible: boolean;
  streak: number;
  /** Jalon franchi — null pour un partage manuel sans célébration */
  milestone: Milestone | null;
  onClose: () => void;
}

/**
 * Modal de célébration de jalon + partage de la carte streak.
 * Capture la carte en image et ouvre la feuille de partage native.
 */
export function ShareStreakModal({
  visible,
  streak,
  milestone,
  onClose,
}: ShareStreakModalProps) {
  const { t } = useTranslation();
  const shotRef = useRef<ViewShot>(null);
  const [sharing, setSharing] = useState(false);

  const handleShare = async (): Promise<void> => {
    if (sharing) {
      return;
    }
    setSharing(true);
    try {
      const uri = await shotRef.current?.capture?.();
      if (uri && (await Sharing.isAvailableAsync())) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: t('share.dialogTitle'),
        });
        void hapticSuccess();
      } else {
        await Share.share({ message: t('share.message', { count: streak }) });
      }
    } catch {
      // Partage annulé par l'utilisateur : rien à faire
    } finally {
      setSharing(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {milestone !== null ? <ConfettiAnimation active={visible} /> : null}

        <View style={styles.content}>
          {milestone !== null ? (
            <>
              <Text style={styles.milestoneEmoji}>
                {MILESTONE_EMOJI[milestone]}
              </Text>
              <Text style={styles.milestoneTitle}>
                {t(milestoneTitleKey(milestone))}
              </Text>
              <Text style={styles.milestoneSub}>
                {t('milestone.subtitle', { count: milestone })}
              </Text>
            </>
          ) : null}

          <ShareStreakCard ref={shotRef} streak={streak} />

          <Pressable
            onPress={() => void handleShare()}
            style={({ pressed }) => [
              styles.shareBtn,
              pressed && styles.pressed,
            ]}
            disabled={sharing}
          >
            <Text style={styles.shareBtnText}>
              {sharing ? t('share.sharing') : t('share.cta')}
            </Text>
          </Pressable>

          <Pressable onPress={onClose} hitSlop={12}>
            <Text style={styles.closeText}>{t('share.close')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  milestoneEmoji: {
    fontSize: 44,
    marginBottom: spacing.xs,
  },
  milestoneTitle: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  milestoneSub: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: 4,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  shareBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.button,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    minWidth: 220,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  shareBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
    marginTop: spacing.md,
    padding: spacing.xs,
  },
});
