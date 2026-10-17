'use client';

import { useI18n } from '@/i18n/I18nProvider';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.nav.languageToggleAria}
      className="inline-flex items-center rounded-xl border border-[#1C1917]/25 bg-[#FFFDF9] p-0.5 text-xs font-extrabold"
    >
      <button
        type="button"
        onClick={() => setLocale('th')}
        aria-pressed={locale === 'th'}
        className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
          locale === 'th'
            ? 'bg-[#9F1D2C] text-[#FFFDF9]'
            : 'text-[#57534E] hover:text-[#1C1917]'
        }`}
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
          locale === 'en'
            ? 'bg-[#9F1D2C] text-[#FFFDF9]'
            : 'text-[#57534E] hover:text-[#1C1917]'
        }`}
      >
        EN
      </button>
    </div>
  );
}

