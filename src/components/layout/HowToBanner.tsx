'use client';

import { useI18n } from '@/i18n/I18nProvider';

export function HowToBanner() {
  const { t } = useI18n();

  const steps = [
    { step: 1, text: t.home.step1 },
    { step: 2, text: t.home.step2 },
    { step: 3, text: t.home.step3 },
  ] as const;

  return (
    <section className="mx-auto max-w-xl space-y-3.5 text-center">
      <div
        aria-label={t.home.howToAria}
        className="mx-auto mb-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border-2 border-[#1C1917] bg-[#FFFDF9] px-3.5 py-1.5 text-xs font-bold text-[#1C1917] shadow-[0_2px_0_0_#1C1917]"
      >
        {steps.map((item, idx) => (
          <span key={item.step} className="inline-flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#9F1D2C] text-[10px] font-extrabold text-[#FFFDF9]">
                {item.step}
              </span>
              <span>{item.text}</span>
            </span>
            {idx < steps.length - 1 && (
              <span aria-hidden="true" className="text-[#57534E]">
                →
              </span>
            )}
          </span>
        ))}
      </div>

      <h1 className="text-2xl font-extrabold tracking-tight text-[#1C1917] sm:text-4xl">
        {t.home.title}
      </h1>
    </section>
  );
}
