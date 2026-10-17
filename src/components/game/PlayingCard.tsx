'use client';

import type { DeckDefinition, IcebreakerCard } from '@/types/game';
import { PlayingCardBack } from './PlayingCardBack';
import { PlayingCardFront } from './PlayingCardFront';

interface PlayingCardProps {
  deck: DeckDefinition;
  card: IcebreakerCard | null;
  isRevealed: boolean;
  cardNumber: number;
  totalCards: number;
  remainingCards: number;
  onRevealOrNext: () => void;
}

export function PlayingCard({
  deck,
  card,
  isRevealed,
  cardNumber,
  totalCards,
  remainingCards,
  onRevealOrNext,
}: PlayingCardProps) {
  return (
    <div className="physical-deck-stage mx-auto w-full max-w-87.5 sm:max-w-92.5 py-1">
      {/* Physical Stacked Cards Underneath — Shows deck depth as long as cards remain */}
      {remainingCards > 0 && <div aria-hidden="true" className="deck-under-card-1" />}
      {remainingCards > 2 && <div aria-hidden="true" className="deck-under-card-2" />}
      {remainingCards > 5 && <div aria-hidden="true" className="deck-under-card-3" />}

      {!isRevealed ? (
        <PlayingCardBack
          deck={deck}
          totalCards={totalCards}
          onReveal={onRevealOrNext}
        />
      ) : (
        card && (
          <PlayingCardFront
            key={card.id}
            deck={deck}
            card={card}
            cardNumber={cardNumber}
            totalCards={totalCards}
          />
        )
      )}
    </div>
  );
}
