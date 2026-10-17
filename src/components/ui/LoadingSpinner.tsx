'use client';

import { useI18n } from '@/i18n/I18nProvider';

export function LoadingSpinner() {
  const { t } = useI18n();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center"
    >
      {/* Tactile animated card stack */}
      <div className="relative mb-6 flex h-24 w-20 items-center justify-center">
        {/* Under cards for tactile physical deck aesthetic */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl border-2 border-border-ink bg-[#F6F1E7] shadow-[0_3px_0_0_var(--border-ink)]"
          style={{ transform: 'rotate(-6deg) translate(-4px, 2px)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-2xl border-2 border-border-ink bg-[#EFE8DA] shadow-[0_3px_0_0_var(--border-ink)]"
          style={{ transform: 'rotate(6deg) translate(4px, 2px)' }}
        />
        {/* Main top animated card */}
        <div
          aria-hidden="true"
          className="relative flex h-full w-full animate-float-gentle flex-col items-center justify-center rounded-2xl border-2 border-border-ink bg-warm-card shadow-[0_6px_0_0_var(--border-ink)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-ink bg-accent-crimson text-xs font-black text-warm-card shadow-sm">
            IBC
          </div>
        </div>
      </div>

      {/* Loading message */}
      <p className="text-lg font-black tracking-tight text-ink-charcoal sm:text-xl">
        {t.loading.preparingDeck}
      </p>
      <p className="mt-1.5 text-xs font-bold text-ink-muted sm:text-sm">
        {t.loading.shuffling}
      </p>

      {/* Subtle pulsing indicator */}
      <div
        aria-hidden="true"
        className="mt-5 flex items-center justify-center gap-1.5"
      >
        <span className="h-2 w-2 rounded-full bg-accent-crimson animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-accent-crimson animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-accent-crimson animate-bounce" />
      </div>

      {/* Screen reader only announcement */}
      <span className="sr-only">{t.loading.preparingDeck}</span>
    </div>
  );
}

