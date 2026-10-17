'use client';

import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

interface DecksSectionProps {
  children: ReactNode;
}

export function DecksSection({ children }: DecksSectionProps) {
  const { t } = useI18n();

  return (
    <section id="decks" aria-label={t.home.decksSectionAria} className="pb-4">
      {children}
    </section>
  );
}

