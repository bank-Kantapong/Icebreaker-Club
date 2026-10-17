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
      <h2 className="text-xl font-extrabold text-[#1C1917]">
        {t.deckDetail.howToPlayPrefix} &ldquo;{pickDeckTitle(deck)}&rdquo;
      </h2>

      <ol className="space-y-2.5 text-sm leading-relaxed text-[#1C1917]">
        {steps.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#1C1917] bg-[#FAF7F2] text-xs font-extrabold">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>

      {deck.safetyNotice && (
        <div className="mt-4 rounded-2xl border border-[#1C1917]/30 bg-[#FAF7F2] p-4 text-xs leading-relaxed font-medium text-[#57534E]">
          <strong className="text-[#1C1917]">
            {t.deckDetail.etiquetteLabel}
          </strong>
          {pick(deck.safetyNotice)}
        </div>
      )}
    </section>
  );
}
