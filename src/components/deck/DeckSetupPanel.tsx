'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  DeckDefinition,
  IcebreakerCard,
  IntensityFilter,
} from '@/types/game';
import { filterCardsByIntensity } from '@/features/game/drawCard';
import { useI18n } from '@/i18n/I18nProvider';

interface DeckSetupPanelProps {
  deck: DeckDefinition;
  cards: readonly IcebreakerCard[];
}

export function DeckSetupPanel({ deck, cards }: DeckSetupPanelProps) {
  const router = useRouter();
  const { t, pick } = useI18n();
  const [selectedIntensity, setSelectedIntensity] =
    useState<IntensityFilter>('all');

  const matchingCards = filterCardsByIntensity(cards, selectedIntensity);

  function handleStartGame() {
    const query =
      selectedIntensity === 'all' ? '' : `?intensity=${selectedIntensity}`;
    router.push(`/play/${deck.slug}${query}`);
  }

  return (
    <section
      aria-labelledby="setup-heading"
      className="tactile-card rounded-3xl p-6 sm:p-8"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="setup-heading"
            className="text-xl font-extrabold text-[#1C1917] sm:text-2xl"
          >
            {t.deckDetail.setupTitle}
          </h2>
          <p className="text-sm text-[#57534E]">{t.deckDetail.setupSubtitle}</p>
        </div>
        <div className="mt-2 sm:mt-0">
          <span className="inline-flex items-center rounded-full border-2 border-[#1C1917] bg-[#FAF7F2] px-3.5 py-1 text-xs font-extrabold text-[#1C1917]">
            {t.deckDetail.readyToPlay} {matchingCards.length} {t.home.cardUnit}
          </span>
        </div>
      </div>

      <div
        role="radiogroup"
        aria-label={t.deckDetail.intensityGroupAria}
        className="mt-6 grid gap-3 sm:grid-cols-2"
      >
        <button
          type="button"
          role="radio"
          aria-checked={selectedIntensity === 'all'}
          onClick={() => setSelectedIntensity('all')}
          className={`flex flex-col items-start rounded-2xl border-2 p-4 text-left transition cursor-pointer ${
            selectedIntensity === 'all'
              ? 'border-[#1C1917] bg-[#FFF5F5] shadow-[0_3px_0_0_#1C1917]'
              : 'border-[#1C1917]/30 bg-[#FAF7F2] hover:border-[#1C1917]'
          }`}
        >
          <div className="flex w-full items-center justify-between">
            <span className="text-sm font-extrabold text-[#1C1917]">
              {t.deckDetail.allIntensitiesLabel}
            </span>
            <span className="rounded-full bg-[#1C1917] px-2 py-0.5 text-[11px] font-bold text-[#FFFDF9]">
              {cards.length} {t.home.cardUnit}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#57534E]">
            {t.deckDetail.allIntensitiesDesc}
          </p>
        </button>

        {deck.intensityLevels.map((item) => {
          const levelCount = filterCardsByIntensity(cards, item.level).length;
          const isSelected = selectedIntensity === item.level;
          return (
            <button
              key={item.level}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setSelectedIntensity(item.level)}
              className={`flex flex-col items-start rounded-2xl border-2 p-4 text-left transition cursor-pointer ${
                isSelected
                  ? 'border-[#1C1917] bg-[#FFF5F5] shadow-[0_3px_0_0_#1C1917]'
                  : 'border-[#1C1917]/30 bg-[#FAF7F2] hover:border-[#1C1917]'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-extrabold text-[#1C1917]">
                  {pick(item.label)}
                </span>
                <span className="rounded-full border border-[#1C1917] bg-[#FFFDF9] px-2 py-0.5 text-[11px] font-bold text-[#1C1917]">
                  {levelCount} {t.home.cardUnit}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#57534E]">
                {pick(item.description)}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-[#57534E]">
          {t.deckDetail.shuffleNote}
        </p>
        <button
          type="button"
          onClick={handleStartGame}
          disabled={matchingCards.length === 0}
          className="tactile-btn inline-flex items-center justify-center gap-2 rounded-2xl bg-[#9F1D2C] px-7 py-3.5 text-base font-extrabold text-[#FFFDF9] cursor-pointer"
        >
          <span>
            {t.deckDetail.startDeckWithCount} ({matchingCards.length}{' '}
            {t.home.cardUnit})
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
