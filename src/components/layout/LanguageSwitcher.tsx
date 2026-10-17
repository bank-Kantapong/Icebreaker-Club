'use client';

import { useI18n } from '@/i18n/I18nProvider';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t.nav.languageToggleAria}
      className="inline-flex items-center rounded-xl border border-border-ink/25 bg-warm-card p-0.5 text-xs font-extrabold"
    >
      <button
        type="button"
        onClick={() => setLocale('th')}
        aria-pressed={locale === 'th'}
        className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
          locale === 'th'
            ? 'bg-accent-crimson text-warm-card'
            : 'text-ink-muted hover:text-ink-charcoal'
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
            ? 'bg-accent-crimson text-warm-card'
            : 'text-ink-muted hover:text-ink-charcoal'
        }`}
      >
        EN
      </button>
    </div>
  );
}
