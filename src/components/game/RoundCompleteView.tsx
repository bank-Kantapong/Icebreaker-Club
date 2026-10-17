'use client';

import Link from 'next/link';
import type { DeckDefinition } from '@/types/game';
import { useI18n } from '@/i18n/I18nProvider';

interface RoundCompleteViewProps {
  deck: DeckDefinition;
  round: number;
  playedCount: number;
  skippedCount: number;
  onResetRound: () => void;
}

export function RoundCompleteView({
  deck,
  round,
  playedCount,
  skippedCount,
  onResetRound,
}: RoundCompleteViewProps) {
  const { t, pickDeckTitle } = useI18n();

  return (
    <section
      data-testid="round-complete-screen"
      className="animate-draw-flip-front tactile-card space-y-4 rounded-[1.75rem] p-7 text-center"
    >
      <span className="inline-flex items-center rounded-full border border-border-ink bg-accent-crimson-soft px-3.5 py-1 text-xs font-extrabold text-accent-crimson">
        {t.roundComplete.badgePrefix} {round} {t.roundComplete.badgeSuffix}
      </span>

      <h1 className="text-2xl font-extrabold text-ink-charcoal">
        {t.roundComplete.titlePrefix} &ldquo;{pickDeckTitle(deck)}&rdquo;{' '}
        {t.roundComplete.titleSuffix}
      </h1>

      <p className="mx-auto max-w-sm text-sm leading-relaxed text-ink-muted">
        {t.roundComplete.summaryPrefix}{' '}
        <strong className="text-ink-charcoal">
          {playedCount} {t.home.cardUnit}
        </strong>{' '}
        {skippedCount > 0 &&
          `(${t.roundComplete.skippedPrefix} ${skippedCount} ${t.home.cardUnit})`}
      </p>

      <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onResetRound}
          className="tactile-btn w-full rounded-2xl bg-accent-crimson px-6 py-3.5 text-sm font-extrabold text-warm-card cursor-pointer sm:w-auto"
        >
          {t.roundComplete.playAgainButton}
        </button>

        <Link
          href="/"
          className="tactile-btn w-full rounded-2xl bg-warm-bg px-6 py-3.5 text-sm font-bold text-ink-charcoal sm:w-auto"
        >
          {t.roundComplete.chooseAnotherDeck}
        </Link>
      </div>
    </section>
  );
}
