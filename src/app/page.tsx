import { DECKS } from '@/content/decks';
import { getCardsByDeckSlug } from '@/content/cards';
import { DeckCard } from '@/components/deck/DeckCard';
import { DecksSection } from '@/components/deck/DecksSection';
import { HowToBanner } from '@/components/layout/HowToBanner';

const STAGGER_CLASSES = ['stagger-1', 'stagger-2', 'stagger-3'] as const;

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-10">
      <HowToBanner />

      <DecksSection>
        <div className="grid gap-7 sm:grid-cols-2 md:grid-cols-3 lg:gap-8">
          {DECKS.map((deck, index) => {
            const deckCards = getCardsByDeckSlug(deck.slug);
            return (
              <DeckCard
                key={deck.id}
                deck={deck}
                cardCount={deckCards.length}
                priority={index === 0}
                staggerClass={STAGGER_CLASSES[index] ?? ''}
              />
            );
          })}
        </div>
      </DecksSection>
    </div>
  );
}
