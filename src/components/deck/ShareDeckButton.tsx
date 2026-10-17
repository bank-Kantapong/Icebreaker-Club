'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';

interface ShareDeckButtonProps {
  deckTitle: string;
  deckSlug: string;
  className?: string;
}

export function ShareDeckButton({
  deckTitle,
  deckSlug,
  className = '',
}: ShareDeckButtonProps) {
  const { t } = useI18n();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function handleShare() {
    const sharePath = `/decks/${deckSlug}`;
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${sharePath}`
        : sharePath;

    const shareData = {
      title: `${t.share.shareDeckTitlePrefix} "${deckTitle}"`,
      text: `${t.share.shareDeckTextPrefix} "${deckTitle}" ${t.share.shareDeckTextSuffix}`,
      url: shareUrl,
    };

    try {
      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function'
      ) {
        await navigator.share(shareData);
        setStatusMessage(t.share.shareDeckSuccess);
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
    }

    try {
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(shareUrl);
        setStatusMessage(t.share.copiedLink);
        setTimeout(() => setStatusMessage(null), 2500);
        return;
      }
    } catch {
      // Fallback notification if clipboard is blocked
    }

    setStatusMessage(`${t.share.fallbackLinkPrefix} ${shareUrl}`);
    setTimeout(() => setStatusMessage(null), 4000);
  }

  return (
    <div className="inline-flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={handleShare}
        className={`tactile-btn inline-flex items-center justify-center gap-2 rounded-xl bg-[#FAF7F2] px-4 py-2.5 text-sm font-bold text-[#1C1917] cursor-pointer ${className}`}
      >
        <span aria-hidden="true">↗</span>
        <span>{t.share.shareDeckButton}</span>
      </button>
      {statusMessage && (
        <span
          role="status"
          aria-live="polite"
          className="text-xs font-bold text-[#9F1D2C]"
        >
          {statusMessage}
        </span>
      )}
    </div>
  );
}
