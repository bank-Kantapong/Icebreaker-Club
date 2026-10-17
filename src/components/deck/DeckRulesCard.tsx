'use client';

import type { DeckDefinition } from '@/types/game';
import { useI18n } from '@/i18n/I18nProvider';

interface DeckRulesCardProps {
  deck: DeckDefinition;
}

export function DeckRulesCard({ deck }: DeckRulesCardProps) {
  const { t, pick, pickList, pickDeckTitle } = useI18n();
  const steps = pickList(deck.howToPlaySteps);

  return (
    <section className="tactile-card space-y-4 rounded-3xl p-6 sm:p-8">
      <h2 className="text-xl font-extrabold text-ink-charcoal">
        {t.deckDetail.howToPlayPrefix} &ldquo;{pickDeckTitle(deck)}&rdquo;
      </h2>

      <ol className="space-y-2.5 text-sm leading-relaxed text-ink-charcoal">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-ink bg-warm-bg text-xs font-extrabold">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {deck.safetyNotice && (
        <div className="mt-4 rounded-2xl border border-border-ink/30 bg-warm-bg p-4 text-xs leading-relaxed font-medium text-ink-muted">
          <strong className="text-ink-charcoal">
            {t.deckDetail.etiquetteLabel}
          </strong>
          {pick(deck.safetyNotice)}
        </div>
      )}
    </section>
  );
}
