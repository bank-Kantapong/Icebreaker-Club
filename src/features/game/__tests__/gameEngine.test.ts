import { describe, expect, it } from 'vitest';
import { GET_TO_KNOW_CARDS } from '@/content/cards/get-to-know';
import { COUPLES_CARDS } from '@/content/cards/couples';
import { PARTY_DRINKS_CARDS } from '@/content/cards/party-drinks';
import { createSeededRng, shuffleDeck } from '../shuffle';
import {
  calculateRemainingCards,
  drawNextCard,
  filterCardsByIntensity,
  getVisibleCurrentCard,
  skipCurrentCard,
} from '../drawCard';
import {
  createGameSession,
  isValidDeckSlug,
  parseIntensityFilter,
  resetGameSession,
} from '../gameState';

describe('Game Engine — Pure Functions', () => {
  it('shuffleDeck preserves exact card count and all original cards without mutating input', () => {
    const original = [...GET_TO_KNOW_CARDS];
    const snapshotIds = original.map((c) => c.id);
    const rng = createSeededRng(42);

    const shuffled = shuffleDeck(original, rng);

    expect(shuffled).toHaveLength(original.length);
    expect(original.map((c) => c.id)).toEqual(snapshotIds);
    expect(shuffled.map((c) => c.id).sort()).toEqual([...snapshotIds].sort());
    // Ensure order actually changed for a 32-card deck
    expect(shuffled.map((c) => c.id)).not.toEqual(snapshotIds);
  });

  it('does not expose the next card before it is revealed', () => {
    const session = createGameSession({
      deckSlug: 'get-to-know',
      rng: createSeededRng(7),
    });

    expect(session.phase).toBe('ready');
    expect(session.isCurrentCardRevealed).toBe(false);
    expect(getVisibleCurrentCard(session)).toBeNull();
    expect(calculateRemainingCards(session)).toBe(32);

    const afterFirstDraw = drawNextCard(session);
    expect(afterFirstDraw.phase).toBe('playing');
    expect(afterFirstDraw.isCurrentCardRevealed).toBe(true);
    expect(getVisibleCurrentCard(afterFirstDraw)?.id).toBe(
      afterFirstDraw.cards[0]?.id
    );
    expect(calculateRemainingCards(afterFirstDraw)).toBe(31);
  });

  it('draws every card without repetition within a round and terminates cleanly when exhausted', () => {
    let state = createGameSession({
      deckSlug: 'couples',
      rng: createSeededRng(101),
    });

    const drawnIds: string[] = [];
    const totalCards = state.cards.length;
    expect(totalCards).toBe(32);

    for (let i = 0; i < totalCards; i++) {
      state = drawNextCard(state);
      const visible = getVisibleCurrentCard(state);
      expect(visible).not.toBeNull();
      drawnIds.push(visible!.id);
      expect(calculateRemainingCards(state)).toBe(totalCards - (i + 1));
    }

    // All 32 drawn IDs must be unique
    expect(new Set(drawnIds).size).toBe(totalCards);
    expect(state.playedCardIds).toHaveLength(totalCards);

    // One more draw transitions to `completed` and does not loop or throw
    const finishedState = drawNextCard(state);
    expect(finishedState.phase).toBe('completed');
    expect(finishedState.isCurrentCardRevealed).toBe(false);
    expect(getVisibleCurrentCard(finishedState)).toBeNull();
    expect(calculateRemainingCards(finishedState)).toBe(0);

    // Subsequent calls in `completed` state are no-ops
    const extraDraw = drawNextCard(finishedState);
    expect(extraDraw).toEqual(finishedState);
  });

  it('skipCurrentCard removes the skipped card from the round and never replays it', () => {
    let state = createGameSession({
      deckSlug: 'party-drinks',
      rng: createSeededRng(2026),
    });

    // Reveal first card
    state = drawNextCard(state);
    const firstCardId = getVisibleCurrentCard(state)!.id;

    // Skip the first card
    state = skipCurrentCard(state);
    expect(state.skippedCardIds).toContain(firstCardId);
    expect(state.playedCardIds).not.toContain(firstCardId);

    const secondCardId = getVisibleCurrentCard(state)!.id;
    expect(secondCardId).not.toBe(firstCardId);

    // Draw through the rest of the deck and verify firstCardId never appears again
    const seenAfterSkip = new Set<string>([secondCardId]);
    while (state.phase !== 'completed') {
      state = drawNextCard(state);
      const current = getVisibleCurrentCard(state);
      if (current) {
        seenAfterSkip.add(current.id);
      }
    }

    expect(seenAfterSkip.has(firstCardId)).toBe(false);
    expect(seenAfterSkip.size).toBe(PARTY_DRINKS_CARDS.length - 1);
  });

  it('resetGameSession starts a fresh round with newly shuffled cards and resets counters', () => {
    let state = createGameSession({
      deckSlug: 'get-to-know',
      rng: createSeededRng(11),
    });
    const firstRoundOrder = state.cards.map((c) => c.id);

    state = drawNextCard(state);
    state = drawNextCard(state);
    expect(state.playedCardIds).toHaveLength(2);

    const nextRound = resetGameSession(state, {
      rng: createSeededRng(99),
    });

    expect(nextRound.round).toBe(2);
    expect(nextRound.phase).toBe('ready');
    expect(nextRound.isCurrentCardRevealed).toBe(false);
    expect(nextRound.playedCardIds).toHaveLength(0);
    expect(nextRound.skippedCardIds).toHaveLength(0);
    expect(calculateRemainingCards(nextRound)).toBe(32);
    expect(nextRound.cards.map((c) => c.id)).not.toEqual(firstRoundOrder);
  });

  it('filters cards by intensity before shuffling and calculates remaining count accurately', () => {
    const level2Cards = filterCardsByIntensity(COUPLES_CARDS, 2);
    expect(level2Cards.length).toBeGreaterThan(0);
    expect(level2Cards.every((c) => c.intensity === 2)).toBe(true);

    const session = createGameSession({
      deckSlug: 'couples',
      intensityFilter: 2,
      rng: createSeededRng(55),
    });

    expect(session.cards).toHaveLength(level2Cards.length);
    expect(calculateRemainingCards(session)).toBe(level2Cards.length);
    expect(session.cards.every((c) => c.intensity === 2)).toBe(true);
  });

  it('handles empty card list and invalid deck IDs gracefully with phase="empty"', () => {
    expect(isValidDeckSlug('get-to-know')).toBe(true);
    expect(isValidDeckSlug('non-existent-deck')).toBe(false);

    const invalidDeckSession = createGameSession({
      deckSlug: 'non-existent-deck',
    });
    expect(invalidDeckSession.phase).toBe('empty');
    expect(invalidDeckSession.cards).toHaveLength(0);
    expect(calculateRemainingCards(invalidDeckSession)).toBe(0);
    expect(drawNextCard(invalidDeckSession).phase).toBe('empty');
    expect(skipCurrentCard(invalidDeckSession).phase).toBe('empty');

    const emptyCustomDeckSession = createGameSession({
      deckSlug: 'get-to-know',
      cards: [],
    });
    expect(emptyCustomDeckSession.phase).toBe('empty');
    expect(calculateRemainingCards(emptyCustomDeckSession)).toBe(0);
  });

  it('parses intensity query parameters safely', () => {
    expect(parseIntensityFilter('1')).toBe(1);
    expect(parseIntensityFilter('2')).toBe(2);
    expect(parseIntensityFilter('3')).toBe(3);
    expect(parseIntensityFilter('all')).toBe('all');
    expect(parseIntensityFilter('invalid')).toBe('all');
    expect(parseIntensityFilter(undefined)).toBe('all');
  });
});

