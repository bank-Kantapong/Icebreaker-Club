'use client';

import type { DeckDefinition } from '@/types/game';
import { CardIllustration } from '@/components/ui/CardIllustration';
import { useI18n } from '@/i18n/I18nProvider';

interface PlayingCardBackProps {
  deck: DeckDefinition;
  totalCards: number;
  onReveal: () => void;
}

export function PlayingCardBack({
  deck,
  totalCards,
  onReveal,
}: PlayingCardBackProps) {
  const { t, pickDeckTitle } = useI18n();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onReveal}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onReveal();
        }
      }}
      aria-label={t.game.revealCard}
      className="animate-card-deal tactile-card tactile-card-interactive relative flex h-97.5 sm:h-102.5 w-full flex-col justify-between rounded-[1.75rem] p-3.5 sm:p-4 text-center cursor-pointer select-none overflow-hidden"
    >
      {/* Inner Patterned Playing Card Back Frame */}
      <div className="card-back-pattern flex h-full w-full flex-col items-center justify-between rounded-[1.35rem] border-2 border-[#1C1917] p-5 sm:p-6 text-[#FFFDF9]">
        {/* Top Corner Indices */}
        <div className="flex w-full shrink-0 items-center justify-between text-[11px] font-extrabold tracking-wider uppercase">
          <span className="rounded-full border border-[#FFFDF9]/40 bg-[#1C1917]/25 px-2.5 py-0.5">
            {pickDeckTitle(deck)}
          </span>
          <span className="rounded-full border border-[#FFFDF9]/40 bg-[#1C1917]/25 px-2.5 py-0.5">
            {totalCards} {t.home.cardUnit}
          </span>
        </div>

        {/* Center Emblem Medallion */}
        <div className="my-2 flex flex-1 flex-col items-center justify-center gap-3.5">
          <div className="relative flex h-26 w-26 shrink-0 items-center justify-center rounded-full border-2 border-[#1C1917] bg-[#FFFDF9] p-4 shadow-[0_4px_0_0_#1C1917]">
            <div
              aria-hidden="true"
              className="animate-pulse-subtle absolute inset-1.5 rounded-full border border-dashed border-[#9F1D2C]/45"
            />
            <div className="animate-float-gentle">
              <CardIllustration
                illustrationId={deck.coverIllustration}
                className="h-16 w-16"
                decorative={true}
                priority={true}
              />
            </div>
          </div>

          <div className="max-w-xs space-y-1">
            <p className="text-[10px] font-extrabold tracking-widest text-[#FFFDF9]/80 uppercase">
              {t.game.cardBackTapHint}
            </p>
            <h2 className="text-xl font-extrabold tracking-tight text-[#FFFDF9] sm:text-2xl">
              {t.game.cardBackTitle}
            </h2>
          </div>
        </div>

        {/* Bottom Tactile Draw Pill */}
        <span className="tactile-btn inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFFDF9] px-5 py-3 text-sm font-extrabold text-[#1C1917]">
          <span>{t.game.revealCard}</span>
          <span aria-hidden="true">↻</span>
        </span>
      </div>
    </div>
  );
}
