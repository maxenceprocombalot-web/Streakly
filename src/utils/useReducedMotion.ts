import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Suit le réglage système « Réduire les animations » (iOS) / « Supprimer les
 * animations » (Android). Renvoie `true` quand l'utilisateur préfère limiter le
 * mouvement — les composants animés doivent alors afficher un état statique.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setReduced(enabled);
      }
    });

    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);

    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  return reduced;
}
