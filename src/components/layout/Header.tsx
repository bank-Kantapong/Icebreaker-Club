'use client';

import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import { useI18n } from '@/i18n/I18nProvider';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useI18n();

  return (
    <header className="border-b-2 border-[#1C1917] bg-[#FAF7F2]/95 sticky top-0 z-30 backdrop-blur-xs">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 rounded-lg py-0.5 focus-visible:outline-offset-4"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#1C1917] bg-[#9F1D2C] text-xs font-extrabold tracking-wider text-[#FFFDF9] shadow-[0_2px_0_0_#1C1917]"
          >
            {BRAND.shortName}
          </span>
          <span className="text-base font-extrabold tracking-tight text-[#1C1917] sm:text-lg">
            {BRAND.name}
          </span>
        </Link>

        <nav aria-label={t.nav.mainMenuAria} className="flex items-center gap-2">
          <Link
            href="/"
            className="rounded-xl border border-[#1C1917]/20 bg-[#FFFDF9] px-3 py-1.5 text-xs font-bold text-[#1C1917] hover:border-[#1C1917] sm:text-sm"
          >
            {t.nav.chooseDeck}
          </Link>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
