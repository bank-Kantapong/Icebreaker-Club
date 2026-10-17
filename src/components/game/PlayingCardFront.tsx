'use client';

import type { DeckDefinition, IcebreakerCard } from '@/types/game';
import { CardIllustration } from '@/components/ui/CardIllustration';
import { useI18n } from '@/i18n/I18nProvider';

interface PlayingCardFrontProps {
  deck: DeckDefinition;
  card: IcebreakerCard;
  cardNumber: number;
  totalCards: number;
}

export function PlayingCardFront({
  deck,
  card,
  cardNumber,
  totalCards,
}: PlayingCardFrontProps) {
  const { t, pick, pickList } = useI18n();
  const intensityKey = String(card.intensity) as '1' | '2' | '3';
  const tags = pickList(card.tags);

  return (
    <div className="relative h-97.5 sm:h-102.5">
      {/* Transient 3D Card Back that flips away during the first half of the draw */}
      <div
        aria-hidden="true"
        className="animate-draw-flip-back tactile-card absolute inset-0 rounded-[1.75rem] p-3.5 sm:p-4"
      >
        <div className="card-back-pattern flex h-full w-full items-center justify-center rounded-[1.35rem] border-2 border-[#1C1917]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#1C1917] bg-[#FFFDF9] p-3">
            <CardIllustration
              illustrationId={deck.coverIllustration}
              className="h-12 w-12"
              decorative={true}
            />
          </div>
        </div>
      </div>

      {/* Revealed Card Front with Constant Height & 4-Line Clamped Prompt */}
      <article
        aria-live="polite"
        className="animate-draw-flip-front tactile-card relative flex h-full w-full flex-col justify-between rounded-[1.75rem] p-3.5 sm:p-4 overflow-hidden"
      >
        {/* Inner Editorial Playing Card Frame */}
        <div className="flex h-full w-full flex-col justify-between rounded-[1.35rem] border border-[#1C1917]/15 bg-[#FFFDF9] p-4 sm:p-5 overflow-hidden">
          {/* Top Card Corner Header */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#1C1917]/10 pb-2.5">
            <span
              className={`inline-flex items-center rounded-full border border-[#1C1917] px-2.5 py-0.5 text-[11px] font-extrabold ${deck.accentBgClass} ${deck.accentTextClass}`}
            >
              {t.game.cardTypes[card.type]}
            </span>

            <div className="flex items-center gap-1.5">
              <span className="rounded-full border border-[#1C1917]/30 bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-bold text-[#1C1917]">
                {t.game.intensities[intensityKey]}
              </span>
              <span className="text-xs font-extrabold text-[#57534E]">
                {cardNumber}/{totalCards}
              </span>
            </div>
          </div>

          {/* Center Illustration & Fixed 4-Line Prompt Slot */}
          <div className="my-2 flex flex-1 flex-col items-center justify-center text-center overflow-hidden">
            <div
              className={`mb-2.5 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#1C1917]/30 ${deck.accentBgClass} p-2.5`}
            >
              <div className="animate-float-gentle">
                <CardIllustration
                  illustrationId={card.illustration}
                  className="h-10 w-10"
                  decorative={false}
                />
              </div>
            </div>

            {/* Prompt Container — Maximum 4 lines with reserved height */}
            <div className="flex min-h-26 w-full items-center justify-center px-1">
              <p className="line-clamp-4 text-base font-extrabold leading-relaxed tracking-tight text-[#1C1917] sm:text-lg wrap-break-word">
                {pick(card.prompt)}
              </p>
            </div>

            {card.followUp && (
              <div className="mt-2 w-full shrink-0 rounded-xl border border-dashed border-[#1C1917]/25 bg-[#FAF7F2] px-3 py-1.5 text-left">
                <p className="line-clamp-2 text-[11px] leading-snug font-semibold text-[#57534E] sm:text-xs">
                  <strong className="text-[#9F1D2C]">
                    {t.game.followUpLabel}
                  </strong>
                  {pick(card.followUp)}
                </p>
              </div>
            )}
          </div>

          {/* Bottom Card Tags & Serial Number */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#1C1917]/10 pt-2 text-[11px] text-[#57534E]">
            <div className="flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md bg-[#FAF7F2] px-2 py-0.5 text-[10px] font-semibold text-[#57534E]"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <span className="font-mono text-[10px] font-bold uppercase">
              {card.id}
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
