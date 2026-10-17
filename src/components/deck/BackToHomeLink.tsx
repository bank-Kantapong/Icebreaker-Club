'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export function BackToHomeLink() {
  const { t } = useI18n();

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 rounded-xl border border-border-ink/30 bg-warm-card px-3.5 py-2 text-xs font-extrabold text-ink-charcoal hover:border-border-ink"
    >
      <span aria-hidden="true">←</span>
      <span>{t.nav.backToHome}</span>
    </Link>
  );
}
