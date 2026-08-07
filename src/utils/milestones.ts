/** Jalons de streak célébrés (jours consécutifs) */
export const MILESTONES = [3, 7, 14, 21, 30, 50, 100, 200, 365] as const;

export type Milestone = (typeof MILESTONES)[number];

/** Emoji associé à chaque jalon */
export const MILESTONE_EMOJI: Record<Milestone, string> = {
  3: '✨',
  7: '💪',
  14: '⚡',
  21: '🧠',
  30: '🏆',
  50: '🚀',
  100: '💯',
  200: '🌟',
  365: '👑',
};

/** Clé i18n du titre de chaque jalon (milestone.title{N}) */
export function milestoneTitleKey(milestone: Milestone): string {
  return `milestone.title${milestone}`;
}

/**
 * Retourne le jalon franchi entre deux valeurs de streak,
 * en ignorant ceux déjà célébrés. Renvoie le plus haut jalon atteint.
 */
export function getCrossedMilestone(
  streakBefore: number,
  streakAfter: number,
  celebrated: number[],
): Milestone | null {
  for (let i = MILESTONES.length - 1; i >= 0; i--) {
    const m = MILESTONES[i];
    if (streakAfter >= m && streakBefore < m && !celebrated.includes(m)) {
      return m;
    }
  }
  return null;
}
