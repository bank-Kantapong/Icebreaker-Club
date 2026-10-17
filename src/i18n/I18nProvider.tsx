'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import thMessages from '@/i18n/locales/th.json';
import enMessages from '@/i18n/locales/en.json';
import type {
  DeckDefinition,
  Locale,
  LocalizedStringList,
  LocalizedText,
} from '@/types/game';

export type Messages = typeof thMessages;

const DICTIONARIES: Record<Locale, Messages> = {
  th: thMessages,
  en: enMessages,
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (nextLocale: Locale) => void;
  toggleLocale: () => void;
  t: Messages;
  pick: (value: LocalizedText) => string;
  pickList: (value: LocalizedStringList) => readonly string[];
  pickDeckTitle: (deck: DeckDefinition) => string;
}

const DEFAULT_LOCALE: Locale = 'th';

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
  toggleLocale: () => undefined,
  t: DICTIONARIES[DEFAULT_LOCALE],
  pick: (value) => value[DEFAULT_LOCALE],
  pickList: (value) => value[DEFAULT_LOCALE],
  pickDeckTitle: (deck) => deck.titleTh,
});

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = nextLocale;
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next: Locale = prev === 'th' ? 'en' : 'th';
      if (typeof document !== 'undefined') {
        document.documentElement.lang = next;
      }
      return next;
    });
  }, []);

  const pick = useCallback(
    (value: LocalizedText): string => value[locale],
    [locale]
  );

  const pickList = useCallback(
    (value: LocalizedStringList): readonly string[] => value[locale],
    [locale]
  );

  const pickDeckTitle = useCallback(
    (deck: DeckDefinition): string =>
      locale === 'th' ? deck.titleTh : deck.titleEn,
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: DICTIONARIES[locale],
      pick,
      pickList,
      pickDeckTitle,
    }),
    [locale, setLocale, toggleLocale, pick, pickList, pickDeckTitle]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}

