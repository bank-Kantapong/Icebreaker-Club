import decksData from '@/content/data/decks.json';
import type { DeckDefinition } from '@/types/game';

export const DECKS: readonly DeckDefinition[] =
  decksData as unknown as readonly DeckDefinition[];

export function getDeckBySlug(slug: string): DeckDefinition | undefined {
  return DECKS.find((deck) => deck.slug === slug);
}
