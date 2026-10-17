'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export function BackToHomeLink() {
  const { t } = useI18n();

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-xl border border-[#1C1917]/30 bg-[#FFFDF9] px-3.5 py-2 text-xs font-extrabold text-[#1C1917] hover:border-[#1C1917]"
    >
      <span aria-hidden="true">←</span>
      <span>{t.nav.backToHome}</span>
    </Link>
  );
}

