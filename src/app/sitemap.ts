import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://abdeen.dev';
  const lastModified = '2026-04-04';

  return [
    { url: base, lastModified, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/pwgen`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/qr`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/regex`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pomodoro`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/2fa`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/coverquad`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
  ];
}
