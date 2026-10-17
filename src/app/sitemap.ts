import type { MetadataRoute } from 'next';
import { DECKS } from '@/content/decks';
import { getSiteUrl } from '@/lib/url';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const base = siteUrl ? siteUrl.origin : '';

  const deckEntries: MetadataRoute.Sitemap = DECKS.flatMap((deck) => [
    {
      url: `${base}/decks/${deck.slug}`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${base}/play/${deck.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]);

  return [
    {
      url: `${base}/`,
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...deckEntries,
  ];
}

