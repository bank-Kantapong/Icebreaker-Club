'use client';

import Image from 'next/image';
import type { IllustrationId } from '@/types/game';
import { getIllustrationAsset } from '@/content/illustrations';
import { useI18n } from '@/i18n/I18nProvider';

interface CardIllustrationProps {
  illustrationId: IllustrationId;
  className?: string;
  decorative?: boolean;
  priority?: boolean;
}

export function CardIllustration({
  illustrationId,
  className = 'w-24 h-24',
  decorative = true,
  priority = false,
}: CardIllustrationProps) {
  const { locale } = useI18n();
  const asset = getIllustrationAsset(illustrationId);
  const altText = locale === 'th' ? asset.altTh : asset.altEn;

  return (
    <Image
      src={asset.path}
      alt={decorative ? '' : altText}
      aria-hidden={decorative ? 'true' : undefined}
      width={120}
      height={120}
      priority={priority}
      unoptimized
      className={`select-none object-contain ${className}`}
    />
  );
}
