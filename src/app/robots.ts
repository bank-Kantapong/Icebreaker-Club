import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/url';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    ...(siteUrl ? { sitemap: `${siteUrl.origin}/sitemap.xml` } : {}),
  };
}

