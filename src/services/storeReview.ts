import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';

const REVIEW_ASKED_KEY = '@streakly/review-asked';

/** Jalon minimum avant de demander un avis (pic émotionnel positif) */
const MIN_MILESTONE_FOR_REVIEW = 7;

/**
 * Demande un avis App Store après un jalon de streak.
 * Une seule demande par installation — iOS/Android limitent
 * de toute façon la fréquence d'affichage réelle.
 */
export async function maybeAskForReview(milestone: number): Promise<void> {
  if (milestone < MIN_MILESTONE_FOR_REVIEW) {
    return;
  }
  try {
    const alreadyAsked = await AsyncStorage.getItem(REVIEW_ASKED_KEY);
    if (alreadyAsked) {
      return;
    }
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
      await AsyncStorage.setItem(REVIEW_ASKED_KEY, new Date().toISOString());
    }
  } catch {
    // L'avis est un bonus : ne jamais bloquer le flux principal
  }
}

/** Ouvre la fiche App Store / Play Store pour noter l'app manuellement */
export async function requestReviewNow(): Promise<void> {
  try {
    if (await StoreReview.isAvailableAsync()) {
      await StoreReview.requestReview();
    }
  } catch {
    // silencieux
  }
}
