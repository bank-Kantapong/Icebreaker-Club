'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { generateCardStoryBlob } from '@/lib/shareCardImage';
import type { DeckDefinition, IcebreakerCard } from '@/types/game';

interface ShareCardStoryButtonProps {
  deck: DeckDefinition;
  card: IcebreakerCard;
  className?: string;
}

export function ShareCardStoryButton({
  deck,
  card,
  className = '',
}: ShareCardStoryButtonProps) {
  const { locale, t } = useI18n();
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  function showTemporaryStatus(msg: string, duration = 3000) {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), duration);
  }

  async function handleSaveCardImage() {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const blob = await generateCardStoryBlob({
        deck,
        card,
        locale,
        t,
      });

      if (!blob) {
        showTemporaryStatus(t.share.shareStoryError);
        return;
      }

      const fileName = `icebreaker-${card.id}-${locale}.png`;
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);

      showTemporaryStatus(t.share.downloadStorySuccess);
    } catch {
      showTemporaryStatus(t.share.shareStoryError);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleSaveCardImage}
        disabled={isGenerating}
        className={`tactile-btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent-crimson-soft px-3.5 py-2 text-xs font-extrabold text-accent-crimson cursor-pointer ${className}`}
      >
        <span aria-hidden="true">⬇</span>
        <span>
          {isGenerating
            ? t.share.generatingStory
            : t.share.saveCardImageButton}
        </span>
      </button>

      {statusMessage && (
        <span
          role="status"
          aria-live="polite"
          className="text-[11px] font-bold text-accent-crimson"
        >
          {statusMessage}
        </span>
      )}
    </div>
  );
}
