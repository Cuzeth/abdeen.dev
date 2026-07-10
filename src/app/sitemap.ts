import type { MetadataRoute } from 'next';
import { apps, tools } from '@/lib/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://abdeen.dev';
  const lastModified = new Date().toISOString().split('T')[0];

  // Catalog-driven: enabled entries with a sitemapPriority (external apps
  // and disabled tools drop out automatically).
  const catalogUrls: MetadataRoute.Sitemap = [...apps, ...tools]
    .filter((entry) => !entry.external && entry.sitemapPriority !== undefined)
    .map((entry) => ({
      url: `${base}${entry.href}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: entry.sitemapPriority,
    }));

  return [
    { url: base, lastModified, changeFrequency: 'monthly', priority: 1.0 },
    ...catalogUrls,
    { url: `${base}/hush/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/hush/terms`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
