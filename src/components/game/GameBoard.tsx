'use client';

import { useState } from 'react';
import type {
  DeckDefinition,
  IcebreakerCard,
  IntensityFilter,
} from '@/types/game';
import {
  calculateRemainingCards,
  drawNextCard,
  getVisibleCurrentCard,
  skipCurrentCard,
} from '@/features/game/drawCard';
import {
  createGameSession,
  resetGameSession,
} from '@/features/game/gameState';
import { useI18n } from '@/i18n/I18nProvider';
import { PlayingCard } from './PlayingCard';
import { GameControls } from './GameControls';
import { RoundCompleteView } from './RoundCompleteView';
import { EmptyDeckView } from './EmptyDeckView';

interface GameBoardProps {
  deck: DeckDefinition;
  allDeckCards: readonly IcebreakerCard[];
  initialIntensity?: IntensityFilter;
}

export function GameBoard({
  deck,
  allDeckCards,
  initialIntensity = 'all',
}: GameBoardProps) {
  const { t } = useI18n();
  const [session, setSession] = useState(() =>
    createGameSession({
      deckSlug: deck.slug,
      cards: allDeckCards,
      intensityFilter: initialIntensity,
    })
  );

  const visibleCard = getVisibleCurrentCard(session);
  const remainingCount = calculateRemainingCards(session);
  const playedCount = session.playedCardIds.length;
  const skippedCount = session.skippedCardIds.length;
  const totalInRound = session.cards.length;
  const cardNumber = session.currentIndex + 1;

  function handleRevealOrNext() {
    setSession((prev) => drawNextCard(prev));
  }

  function handleSkip() {
    setSession((prev) => skipCurrentCard(prev));
  }

  function handleResetRound() {
    setSession((prev) =>
      resetGameSession(prev, {
        allDeckCards,
        intensityFilter: prev.intensityFilter,
      })
    );
  }

  function handleChangeIntensity(nextFilter: IntensityFilter) {
    if (nextFilter === session.intensityFilter) return;
    setSession((prev) =>
      resetGameSession(prev, {
        allDeckCards,
        intensityFilter: nextFilter,
      })
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      {/* Hidden Accessible Counters for Screen Readers & Tests */}
      <div className="sr-only" aria-live="polite">
        <span>
          {t.game.roundPrefix} {session.round}
        </span>
        <span data-testid="played-count">
          {playedCount} {t.home.cardUnit}
        </span>
        <span data-testid="remaining-count">
          {remainingCount} {t.home.cardUnit}
        </span>
        <span data-testid="skipped-count">
          {skippedCount} {t.home.cardUnit}
        </span>
      </div>

      {session.phase === 'empty' ? (
        <EmptyDeckView
          onShowAllIntensities={() => handleChangeIntensity('all')}
        />
      ) : session.phase === 'completed' ? (
        <RoundCompleteView
          deck={deck}
          round={session.round}
          playedCount={playedCount}
          skippedCount={skippedCount}
          onResetRound={handleResetRound}
        />
      ) : (
        <div className="space-y-6">
          <PlayingCard
            deck={deck}
            card={visibleCard}
            isRevealed={session.isCurrentCardRevealed}
            cardNumber={cardNumber}
            totalCards={totalInRound}
            remainingCards={remainingCount}
            onRevealOrNext={handleRevealOrNext}
          />

          <GameControls
            deck={deck}
            currentCard={visibleCard}
            isCurrentCardRevealed={session.isCurrentCardRevealed}
            remainingCount={remainingCount}
            onSkip={handleSkip}
            onRevealOrNext={handleRevealOrNext}
            onResetRound={handleResetRound}
          />
        </div>
      )}
    </div>
  );
}
