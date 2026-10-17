'use client';

import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import { useI18n } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useI18n();

  return (
    <header className="border-b-2 border-border-ink bg-warm-bg/95 sticky top-0 z-30 backdrop-blur-xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-lg py-0.5 focus-visible:outline-offset-4"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-border-ink bg-accent-crimson text-xs font-extrabold tracking-wider text-warm-card shadow-[0_2px_0_0_var(--border-ink)]"
          >
            {BRAND.shortName}
          </span>
          <span className="text-base font-extrabold tracking-tight text-ink-charcoal sm:text-lg">
            {BRAND.name}
          </span>
        </Link>

        <nav aria-label={t.nav.mainMenuAria} className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-xl border border-border-ink/20 bg-warm-card px-3 py-1.5 text-xs font-bold text-ink-charcoal hover:border-border-ink sm:text-sm"
          >
            {t.nav.chooseDeck}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
