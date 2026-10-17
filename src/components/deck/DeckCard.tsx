'use client';

import Link from 'next/link';
import type { DeckDefinition } from '@/types/game';
import { CardIllustration } from '@/components/ui/CardIllustration';
import { useI18n } from '@/i18n/I18nProvider';

interface DeckCardProps {
  deck: DeckDefinition;
  cardCount: number;
  priority?: boolean;
  staggerClass?: string;
}

export function DeckCard({
  deck,
  cardCount,
  priority = false,
  staggerClass = '',
}: DeckCardProps) {
  const { locale, t, pick, pickDeckTitle } = useI18n();
  const primaryTitle = pickDeckTitle(deck);
  const secondaryBadge = locale === 'th' ? deck.titleEn : deck.titleTh;

  return (
    <article
      className={`deck-box-stack animate-card-deal ${staggerClass} tactile-card tactile-card-interactive group mx-auto flex w-full max-w-77.5 flex-col justify-between rounded-[1.75rem] p-3.5 sm:p-4`}
    >
      {/* Full-Card Clickable Cover Box */}
      <Link
        href={`/play/${deck.slug}`}
        aria-label={`${t.home.startDeckAriaPrefix} ${primaryTitle}`}
        className={`flex min-h-75 sm:min-h-80 flex-col items-center justify-between rounded-[1.35rem] border-2 border-[#1C1917] ${deck.accentBgClass} p-5 text-center transition-colors focus-visible:outline-offset-4`}
      >
        {/* Top Deck Corner Indices */}
        <div className="flex w-full items-center justify-between gap-2">
          <span
            className={`rounded-full border border-[#1C1917] bg-[#FFFDF9] px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase ${deck.accentTextClass}`}
          >
            {secondaryBadge}
          </span>
          <span className="rounded-full border border-[#1C1917] bg-[#FFFDF9] px-2.5 py-0.5 text-[11px] font-extrabold text-[#1C1917]">
            {cardCount} {t.home.cardUnit}
          </span>
        </div>

        {/* Center Cover Artwork Emblem */}
        <div className="my-3 flex flex-col items-center gap-3.5">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-[#1C1917] bg-[#FFFDF9] p-5 shadow-[0_4px_0_0_#1C1917] transition-transform duration-300 group-hover:scale-105">
            <div className="animate-float-gentle">
              <CardIllustration
                illustrationId={deck.coverIllustration}
                className="h-18 w-18"
                decorative={false}
                priority={priority}
              />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1C1917]">
              {primaryTitle}
            </h2>
            <p className="text-xs font-bold text-[#57534E]">
              {pick(deck.audienceLabel)}
            </p>
          </div>
        </div>

        {/* Bottom Play Pill inside the Cover */}
        <span className="tactile-btn inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#9F1D2C] px-4 py-2.5 text-sm font-extrabold text-[#FFFDF9]">
          <span>{t.home.tapToDraw}</span>
          <span aria-hidden="true">→</span>
        </span>
      </Link>
    </article>
  );
}
