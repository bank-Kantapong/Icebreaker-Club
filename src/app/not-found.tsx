'use client';

import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="tactile-card rounded-3xl p-8 space-y-4">
        <p className="text-xs font-extrabold tracking-widest text-[#9F1D2C] uppercase">
          {t.notFound.badge}
        </p>
        <h1 className="text-2xl font-extrabold text-[#1C1917] sm:text-3xl">
          {t.notFound.title}
        </h1>
        <p className="text-sm text-[#57534E]">{t.notFound.subtitle}</p>
        <div className="pt-2">
          <Link
            href="/"
            className="tactile-btn inline-flex items-center justify-center rounded-2xl bg-[#9F1D2C] px-6 py-3 text-sm font-extrabold text-[#FFFDF9]"
          >
            {t.notFound.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
