import type {
  DeckSlug,
  GameSessionState,
  IcebreakerCard,
  IntensityFilter,
} from '@/types/game';
import { getCardsByDeckSlug } from '@/content/cards';
import { filterCardsByIntensity } from './drawCard';
import { type RandomFn, shuffleDeck } from './shuffle';

export interface CreateGameSessionOptions {
  deckSlug: string;
  cards?: readonly IcebreakerCard[];
  intensityFilter?: IntensityFilter;
  rng?: RandomFn;
  round?: number;
}

const VALID_DECK_SLUGS: readonly DeckSlug[] = [
  'get-to-know',
  'couples',
  'party-drinks',
];

export function isValidDeckSlug(slug: string): slug is DeckSlug {
  return (VALID_DECK_SLUGS as readonly string[]).includes(slug);
}

export function parseIntensityFilter(raw?: string | null): IntensityFilter {
  if (raw === '1') return 1;
  if (raw === '2') return 2;
  if (raw === '3') return 3;
  return 'all';
}

/**
 * Initializes a new game session by filtering cards by intensity first,
 * then shuffling the filtered deck. Handles invalid deck slugs and empty card sets gracefully.
 */
export function createGameSession({
  deckSlug,
  cards,
  intensityFilter = 'all',
  rng = Math.random,
  round = 1,
}: CreateGameSessionOptions): GameSessionState {
  const normalizedDeckId: DeckSlug = isValidDeckSlug(deckSlug)
    ? deckSlug
    : 'get-to-know';

  const sourceCards = isValidDeckSlug(deckSlug)
    ? (cards ?? getCardsByDeckSlug(deckSlug))
    : [];

  const filtered = filterCardsByIntensity(sourceCards, intensityFilter);
  const shuffled = shuffleDeck(filtered, rng);

  if (shuffled.length === 0) {
    return {
      deckId: normalizedDeckId,
      intensityFilter,
      cards: [],
      currentIndex: 0,
      isCurrentCardRevealed: false,
      playedCardIds: [],
      skippedCardIds: [],
      round,
      phase: 'empty',
    };
  }

  return {
    deckId: normalizedDeckId,
    intensityFilter,
    cards: shuffled,
    currentIndex: 0,
    isCurrentCardRevealed: false,
    playedCardIds: [],
    skippedCardIds: [],
    round,
    phase: 'ready',
  };
}

/**
 * Resets the current game session for a new round, re-filtering and re-shuffling
 * all matching cards without needing a page reload.
 */
export function resetGameSession(
  currentState: GameSessionState,
  options?: {
    allDeckCards?: readonly IcebreakerCard[];
    intensityFilter?: IntensityFilter;
    rng?: RandomFn;
  }
): GameSessionState {
  const nextFilter = options?.intensityFilter ?? currentState.intensityFilter;
  const sourceCards =
    options?.allDeckCards ?? getCardsByDeckSlug(currentState.deckId);

  return createGameSession({
    deckSlug: currentState.deckId,
    cards: sourceCards,
    intensityFilter: nextFilter,
    rng: options?.rng ?? Math.random,
    round: currentState.round + 1,
  });
}

