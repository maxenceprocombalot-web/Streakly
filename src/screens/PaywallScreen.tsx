import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { PurchasesPackage } from 'react-native-purchases';
import { PackageType } from 'react-native-purchases';

import { colors, radius, spacing } from '../constants/theme';
import { useTranslation } from '../i18n/useTranslation';
import {
  acheterAbonnement,
  getOfferings,
  restaurerAchats,
} from '../services/purchases';
import { useSettingsStore } from '../store/settingsStore';

const BENEFITS = [
  { emoji: '🚫', label: 'Sans publicités' },
  { emoji: '📊', label: 'Stats avancées' },
  { emoji: '🎨', label: 'Couleurs illimitées' },
  { emoji: '🪟', label: 'Widgets iOS (bientôt)' },
  { emoji: '🤖', label: 'Coach IA personnel' },
];

interface ProductTier {
  id: 'monthly' | 'annual' | 'lifetime';
  label: string;
  price: string;
  badge?: string;
  rcPackage: PurchasesPackage | null;
}

const FALLBACK_TIERS: Omit<ProductTier, 'rcPackage'>[] = [
  { id: 'monthly', label: 'Mensuel', price: '2,99€ / mois' },
  { id: 'annual', label: 'Annuel', price: '19,99€ / an', badge: 'Économie 44%' },
  { id: 'lifetime', label: 'Lifetime', price: '49,99€' },
];

interface PaywallScreenProps {
  onClose: () => void;
}

export function PaywallScreen({ onClose }: PaywallScreenProps) {
  const { t } = useTranslation();
  const setIsPro = useSettingsStore((s) => s.setIsPro);
  const closePaywall = useSettingsStore((s) => s.closePaywall);

  const [tiers, setTiers] = useState<ProductTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    void loadOfferings();
  }, []);

  const loadOfferings = async (): Promise<void> => {
    setLoading(true);
    const offering = await getOfferings();
    const pkgs = offering?.availablePackages ?? [];

    const find = (type: PackageType): PurchasesPackage | null =>
      pkgs.find((p) => p.packageType === type) ?? null;

    const monthly = find(PackageType.MONTHLY);
    const annual = find(PackageType.ANNUAL);
    const lifetime = find(PackageType.LIFETIME);

    setTiers([
      {
        id: 'monthly',
        label: 'Mensuel',
        price: monthly?.product.priceString ?? '2,99€ / mois',
        rcPackage: monthly,
      },
      {
        id: 'annual',
        label: 'Annuel',
        price: annual?.product.priceString ?? '19,99€ / an',
        badge: 'Économie 44%',
        rcPackage: annual,
      },
      {
        id: 'lifetime',
        label: 'Lifetime',
        price: lifetime?.product.priceString ?? '49,99€',
        rcPackage: lifetime,
      },
    ]);
    setLoading(false);
  };

  const handlePurchase = async (tier: ProductTier): Promise<void> => {
    if (!tier.rcPackage) {
      Alert.alert('Indisponible', 'Produit non configuré dans RevenueCat.');
      return;
    }
    setPurchasing(tier.id);
    try {
      const success = await acheterAbonnement(tier.rcPackage);
      if (success) {
        setIsPro(true);
        closePaywall();
      }
    } catch (e: any) {
      Alert.alert('Erreur', e?.message ?? 'Achat impossible.');
    } finally {
      setPurchasing(null);
    }
  };

  const handleRestore = async (): Promise<void> => {
    setRestoring(true);
    try {
      const success = await restaurerAchats();
      if (success) {
        setIsPro(true);
        closePaywall();
      } else {
        Alert.alert('Aucun achat trouvé', 'Aucun abonnement actif associé à ce compte.');
      }
    } catch {
      Alert.alert('Erreur', 'Impossible de restaurer les achats.');
    } finally {
      setRestoring(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
        <Text style={styles.closeText}>✕</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Text style={styles.crown}>🔥</Text>
        <Text style={styles.heroTitle}>Streakly Pro</Text>
        <Text style={styles.heroSub}>
          Débloquez tout le potentiel de Streakly
        </Text>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          {BENEFITS.map((b) => (
            <View key={b.label} style={styles.benefitRow}>
              <Text style={styles.benefitEmoji}>{b.emoji}</Text>
              <Text style={styles.benefitLabel}>{b.label}</Text>
            </View>
          ))}
        </View>

        {/* Products */}
        {loading ? (
          <ActivityIndicator color={colors.accent} style={styles.loader} />
        ) : (
          <View style={styles.tiers}>
            {tiers.map((tier) => {
              const isRecommended = tier.id === 'annual';
              const isBuying = purchasing === tier.id;
              return (
                <Pressable
                  key={tier.id}
                  style={[
                    styles.tierCard,
                    isRecommended && styles.tierCardRecommended,
                  ]}
                  onPress={() => void handlePurchase(tier)}
                  disabled={purchasing !== null || restoring}
                >
                  {isRecommended ? (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedBadgeText}>⭐ Populaire</Text>
                    </View>
                  ) : null}
                  <View style={styles.tierRow}>
                    <Text style={styles.tierLabel}>{tier.label}</Text>
                    {tier.badge ? (
                      <View style={styles.savingBadge}>
                        <Text style={styles.savingText}>{tier.badge}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.tierPrice, isRecommended && styles.tierPriceAccent]}>
                    {tier.price}
                  </Text>
                  {isBuying ? (
                    <ActivityIndicator
                      color={isRecommended ? colors.white : colors.accent}
                      style={styles.buyingSpinner}
                    />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Restore */}
        <Pressable
          style={styles.restoreBtn}
          onPress={() => void handleRestore()}
          disabled={purchasing !== null || restoring}
        >
          {restoring ? (
            <ActivityIndicator color={colors.textSecondary} />
          ) : (
            <Text style={styles.restoreText}>Restaurer mes achats</Text>
          )}
        </Pressable>

        <Text style={styles.legal}>
          L'abonnement se renouvelle automatiquement. Annulable à tout moment.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeBtn: {
    position: 'absolute',
    top: 56,
    right: spacing.md,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingTop: 64,
    paddingHorizontal: spacing.md,
    paddingBottom: 48,
    alignItems: 'center',
  },
  crown: {
    fontSize: 52,
    marginBottom: spacing.sm,
  },
  heroTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1.5,
    marginBottom: spacing.xs,
  },
  heroSub: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '400',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  benefitsCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  benefitLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  loader: {
    marginVertical: spacing.xl,
  },
  tiers: {
    width: '100%',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tierCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: spacing.md,
  },
  tierCardRecommended: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  recommendedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: 3,
    marginBottom: spacing.xs,
  },
  recommendedBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 4,
  },
  tierLabel: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  savingBadge: {
    backgroundColor: 'rgba(29, 184, 104, 0.18)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  savingText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  tierPrice: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  tierPriceAccent: {
    color: 'rgba(255,255,255,0.8)',
  },
  buyingSpinner: {
    marginTop: spacing.xs,
  },
  restoreBtn: {
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  legal: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.6,
    paddingHorizontal: spacing.md,
  },
});
