import partyDrinksCardsData from '@/content/data/cards/party-drinks.json';
import type { IcebreakerCard } from '@/types/game';

export const PARTY_DRINKS_CARDS: readonly IcebreakerCard[] =
  partyDrinksCardsData as unknown as readonly IcebreakerCard[];
