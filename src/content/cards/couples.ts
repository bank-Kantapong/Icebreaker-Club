import couplesCardsData from '@/content/data/cards/couples.json';
import type { IcebreakerCard } from '@/types/game';

export const COUPLES_CARDS: readonly IcebreakerCard[] =
  couplesCardsData as unknown as readonly IcebreakerCard[];
