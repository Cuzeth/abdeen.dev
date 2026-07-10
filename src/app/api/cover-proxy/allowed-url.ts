// Upstream allowlist for the cover-art proxy. Kept out of route.ts so it can
// be unit-tested (Next only permits handler exports from a route file).

const ALLOWED_HOSTS = ['coverartarchive.org', 'archive.org'];
// Internet Archive image servers look like ia800123.us.archive.org — anchor
// the match so e.g. ia800.evil.com can't slip through the allowlist
const IA_HOST_PATTERN = /^ia\d+\.(?:[a-z0-9-]+\.)*archive\.org$/;

export function isAllowedUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;
    return (
      ALLOWED_HOSTS.some(
        (host) => parsed.hostname === host || parsed.hostname.endsWith('.' + host),
      ) || IA_HOST_PATTERN.test(parsed.hostname)
    );
  } catch {
    return false;
  }
}
