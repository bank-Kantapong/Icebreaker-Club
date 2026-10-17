import type { DeckSlug, IcebreakerCard } from '@/types/game';
import { GET_TO_KNOW_CARDS } from './get-to-know';
import { COUPLES_CARDS } from './couples';
import { PARTY_DRINKS_CARDS } from './party-drinks';

export const CARDS_BY_DECK: Record<DeckSlug, readonly IcebreakerCard[]> = {
  'get-to-know': GET_TO_KNOW_CARDS,
  couples: COUPLES_CARDS,
  'party-drinks': PARTY_DRINKS_CARDS,
};

export const ALL_CARDS: readonly IcebreakerCard[] = [
  ...GET_TO_KNOW_CARDS,
  ...COUPLES_CARDS,
  ...PARTY_DRINKS_CARDS,
];

export function getCardsByDeckSlug(slug: string): readonly IcebreakerCard[] {
  if (slug === 'get-to-know' || slug === 'couples' || slug === 'party-drinks') {
    return CARDS_BY_DECK[slug];
  }
  return [];
}

