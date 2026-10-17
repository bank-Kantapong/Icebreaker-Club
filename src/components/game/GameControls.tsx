'use client';

import type { DeckDefinition, IcebreakerCard } from '@/types/game';
import { ShareDeckButton } from '@/components/deck/ShareDeckButton';
import { useI18n } from '@/i18n/I18nProvider';
import { ShareCardStoryButton } from './ShareCardStoryButton';

interface GameControlsProps {
  deck: DeckDefinition;
  currentCard: IcebreakerCard | null;
  isCurrentCardRevealed: boolean;
  remainingCount: number;
  onSkip: () => void;
  onRevealOrNext: () => void;
  onResetRound: () => void;
}

export function GameControls({
  deck,
  currentCard,
  isCurrentCardRevealed,
  remainingCount,
  onSkip,
  onRevealOrNext,
  onResetRound,
}: GameControlsProps) {
  const { t, pickDeckTitle } = useI18n();

  return (
    <div className="mx-auto max-w-87.5 space-y-3 pt-4 sm:max-w-92.5">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onSkip}
          className="tactile-btn rounded-2xl bg-[#FAF7F2] px-4 py-3 text-sm font-bold text-[#1C1917] cursor-pointer"
        >
          {t.game.skipCard}
        </button>

        <button
          type="button"
          onClick={onRevealOrNext}
          className="tactile-btn rounded-2xl bg-[#9F1D2C] px-4 py-3 text-sm font-extrabold text-[#FFFDF9] cursor-pointer"
        >
          {!isCurrentCardRevealed
            ? t.game.revealCard
            : remainingCount > 0
              ? t.game.nextCard
              : t.game.finishRound}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onResetRound}
          className="rounded-lg px-2 py-1 text-xs font-bold text-[#57534E] underline-offset-4 hover:text-[#1C1917] hover:underline cursor-pointer"
        >
          {t.game.reshuffleRound}
        </button>

        {isCurrentCardRevealed && currentCard ? (
          <ShareCardStoryButton deck={deck} card={currentCard} />
        ) : (
          <ShareDeckButton
            deckTitle={pickDeckTitle(deck)}
            deckSlug={deck.slug}
            className="px-3! py-1! text-xs!"
          />
        )}
      </div>
    </div>
  );
}
