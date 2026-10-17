import type {
  GameSessionState,
  IcebreakerCard,
  IntensityFilter,
} from '@/types/game';

/**
 * Pure function to filter a deck of cards by intensity level BEFORE shuffling.
 */
export function filterCardsByIntensity(
  cards: readonly IcebreakerCard[],
  intensityFilter: IntensityFilter
): IcebreakerCard[] {
  if (intensityFilter === 'all') {
    return [...cards];
  }
  return cards.filter((card) => card.intensity === intensityFilter);
}

/**
 * Returns the currently active card ONLY when the current card is revealed.
 * Prevents accidental preview or leakage of unrevealed cards.
 */
export function getVisibleCurrentCard(
  state: GameSessionState
): IcebreakerCard | null {
  if (
    state.phase !== 'playing' ||
    !state.isCurrentCardRevealed ||
    state.currentIndex < 0 ||
    state.currentIndex >= state.cards.length
  ) {
    return null;
  }
  return state.cards[state.currentIndex] ?? null;
}

/**
 * Calculates how many cards remain unopened/unprocessed in the current round.
 * - When in `empty` or `completed` phase: 0
 * - When in `ready` phase (no card opened yet): total cards in round
 * - When in `playing` phase and current card is revealed: cards after currentIndex
 * - When in `playing` phase and current card is unrevealed (face-down): cards from currentIndex inclusive
 */
export function calculateRemainingCards(state: GameSessionState): number {
  if (state.phase === 'empty' || state.phase === 'completed') {
    return 0;
  }
  const total = state.cards.length;
  if (total === 0) {
    return 0;
  }
  if (state.phase === 'ready') {
    return total;
  }
  const consumedCount = state.isCurrentCardRevealed
    ? state.currentIndex + 1
    : state.currentIndex;
  return Math.max(0, total - consumedCount);
}

/**
 * Reveals the current face-down card or advances and reveals the next card in the deck.
 * Ensures no duplicate card is ever drawn within a round and never loops infinitely when exhausted.
 */
export function drawNextCard(state: GameSessionState): GameSessionState {
  if (state.phase === 'empty' || state.cards.length === 0) {
    return {
      ...state,
      phase: 'empty',
      isCurrentCardRevealed: false,
    };
  }

  if (state.phase === 'completed') {
    return state;
  }

  // Case 1: Current card at `currentIndex` is still face-down (either `ready` phase or after a skip/stage)
  if (!state.isCurrentCardRevealed) {
    const currentCard = state.cards[state.currentIndex];
    if (!currentCard) {
      return {
        ...state,
        phase: 'completed',
        isCurrentCardRevealed: false,
      };
    }

    const alreadyRecorded = state.playedCardIds.includes(currentCard.id);
    return {
      ...state,
      phase: 'playing',
      isCurrentCardRevealed: true,
      playedCardIds: alreadyRecorded
        ? state.playedCardIds
        : [...state.playedCardIds, currentCard.id],
    };
  }

  // Case 2: Current card is already revealed; advance to the next card in the shuffled deck
  const nextIndex = state.currentIndex + 1;
  if (nextIndex >= state.cards.length) {
    return {
      ...state,
      phase: 'completed',
      isCurrentCardRevealed: false,
    };
  }

  const nextCard = state.cards[nextIndex]!;
  const alreadyRecorded = state.playedCardIds.includes(nextCard.id);

  return {
    ...state,
    phase: 'playing',
    currentIndex: nextIndex,
    isCurrentCardRevealed: true,
    playedCardIds: alreadyRecorded
      ? state.playedCardIds
      : [...state.playedCardIds, nextCard.id],
  };
}

/**
 * Skips the current card so it will not reappear in the current round.
 * If another card exists after it, advances and reveals the next card immediately (or transitions to completed if last card).
 */
export function skipCurrentCard(state: GameSessionState): GameSessionState {
  if (
    state.phase === 'empty' ||
    state.phase === 'completed' ||
    state.cards.length === 0
  ) {
    return state;
  }

  const currentCard = state.cards[state.currentIndex];
  if (!currentCard) {
    return {
      ...state,
      phase: 'completed',
      isCurrentCardRevealed: false,
    };
  }

  // Remove the skipped card from playedCardIds if it was revealed, and add to skippedCardIds
  const updatedPlayedIds = state.playedCardIds.filter(
    (id) => id !== currentCard.id
  );
  const updatedSkippedIds = state.skippedCardIds.includes(currentCard.id)
    ? state.skippedCardIds
    : [...state.skippedCardIds, currentCard.id];

  const nextIndex = state.currentIndex + 1;
  if (nextIndex >= state.cards.length) {
    return {
      ...state,
      playedCardIds: updatedPlayedIds,
      skippedCardIds: updatedSkippedIds,
      phase: 'completed',
      isCurrentCardRevealed: false,
    };
  }

  // Move to the next card in face-down state or revealed state depending on whether user was already playing
  const shouldAutoRevealNext = state.isCurrentCardRevealed;
  const nextCard = state.cards[nextIndex]!;

  return {
    ...state,
    currentIndex: nextIndex,
    phase: shouldAutoRevealNext ? 'playing' : 'ready',
    isCurrentCardRevealed: shouldAutoRevealNext,
    playedCardIds:
      shouldAutoRevealNext && !updatedPlayedIds.includes(nextCard.id)
        ? [...updatedPlayedIds, nextCard.id]
        : updatedPlayedIds,
    skippedCardIds: updatedSkippedIds,
  };
}

