'use client';

import Link from 'next/link';
import type { DeckDefinition } from '@/types/game';
import { CardIllustration } from '@/components/ui/CardIllustration';
import { useI18n } from '@/i18n/I18nProvider';
import { ShareDeckButton } from './ShareDeckButton';

interface DeckOverviewHeroProps {
  deck: DeckDefinition;
  cardCount: number;
}

export function DeckOverviewHero({ deck, cardCount }: DeckOverviewHeroProps) {
  const { locale, t, pick, pickDeckTitle } = useI18n();
  const primaryTitle = pickDeckTitle(deck);
  const subtitleTitle = locale === 'th' ? deck.titleEn : deck.titleTh;

  return (
    <section className="tactile-card rounded-3xl p-6 sm:p-8">
      <div className="grid items-center gap-6 md:grid-cols-12">
        <div className="flex justify-center md:col-span-4">
          <div
            className={`flex h-44 w-44 items-center justify-center rounded-3xl border-2 border-dashed border-border-ink/40 ${deck.accentBgClass} p-6`}
          >
            <CardIllustration
              illustrationId={deck.coverIllustration}
              className="h-28 w-28"
              decorative={false}
              priority={true}
            />
          </div>
        </div>

        <div className="space-y-4 md:col-span-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border border-border-ink px-3 py-1 text-xs font-extrabold ${deck.accentBgClass} ${deck.accentTextClass}`}
            >
              {pick(deck.badgeText)}
            </span>
            <span className="rounded-full border border-border-ink bg-warm-bg px-3 py-1 text-xs font-extrabold text-ink-charcoal">
              {t.deckDetail.totalCards} {cardCount} {t.home.cardUnit}
            </span>
            <span className="rounded-full bg-warm-bg px-3 py-1 text-xs font-bold text-ink-muted">
              {t.deckDetail.playersPrefix} {pick(deck.recommendedPlayers)}
            </span>
          </div>

          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-ink-charcoal sm:text-4xl">
              {primaryTitle}{' '}
              <span className="text-lg font-bold text-ink-muted">
                ({subtitleTitle})
              </span>
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted sm:text-base">
              {pick(deck.longDescription)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={`/play/${deck.slug}`}
              className="tactile-btn inline-flex items-center justify-center gap-2 rounded-2xl bg-accent-crimson px-6 py-3 text-sm font-extrabold text-warm-card"
            >
              <span>{t.deckDetail.startNowAllLevels}</span>
              <span aria-hidden="true">→</span>
            </Link>

            <ShareDeckButton deckTitle={primaryTitle} deckSlug={deck.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}
