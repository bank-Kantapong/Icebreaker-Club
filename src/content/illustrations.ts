import illustrationsData from '@/content/data/illustrations.json';
import type { IllustrationAsset, IllustrationId } from '@/types/game';

export const ILLUSTRATION_LIST: readonly IllustrationAsset[] =
  illustrationsData as unknown as readonly IllustrationAsset[];

export const ILLUSTRATIONS: Record<IllustrationId, IllustrationAsset> =
  Object.fromEntries(
    ILLUSTRATION_LIST.map((item) => [item.id, item])
  ) as Record<IllustrationId, IllustrationAsset>;

export function getIllustrationAsset(id: IllustrationId): IllustrationAsset {
  return ILLUSTRATIONS[id];
}
