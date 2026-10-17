import getToKnowCardsData from '@/content/data/cards/get-to-know.json';
import type { IcebreakerCard } from '@/types/game';

export const GET_TO_KNOW_CARDS: readonly IcebreakerCard[] =
  getToKnowCardsData as unknown as readonly IcebreakerCard[];
