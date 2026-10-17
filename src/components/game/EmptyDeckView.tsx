'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

interface EmptyDeckViewProps {
  onShowAllIntensities: () => void;
}

export function EmptyDeckView({ onShowAllIntensities }: EmptyDeckViewProps) {
  const { t } = useI18n();

  return (
    <section className="animate-card-deal tactile-card space-y-4 rounded-[1.75rem] p-7 text-center">
      <h1 className="text-xl font-extrabold text-ink-charcoal">
        {t.emptyDeck.title}
      </h1>
      <p className="text-sm text-ink-muted">{t.emptyDeck.subtitle}</p>
      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onShowAllIntensities}
          className="tactile-btn rounded-xl bg-accent-crimson px-5 py-2.5 text-sm font-bold text-warm-card cursor-pointer"
        >
          {t.emptyDeck.showAllButton}
        </button>
        <Link
          href="/"
          className="tactile-btn rounded-xl bg-warm-bg px-5 py-2.5 text-sm font-bold text-ink-charcoal"
        >
          {t.emptyDeck.backToDecksButton}
        </Link>
      </div>
    </section>
  );
}
