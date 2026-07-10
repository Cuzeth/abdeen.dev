/**
 * Single source of truth for everything the site indexes: native apps and
 * browser tools. The homepage index, the footer navigation, the ToolPageShell
 * "More tools" strip, the sitemap, and the layout JSON-LD all render from
 * these arrays, so an entry added (or re-enabled) here appears everywhere at
 * once. Set `enabled: false` to pull an entry from all of those surfaces;
 * the route's page.tsx reads the same flag via entryEnabled() to 404 itself.
 */
export interface CatalogEntry {
  title: string;
  description: string;
  href: string;
  /** Mono metadata shown next to the entry (platform or route). */
  meta: string;
  external?: boolean;
  /** Defaults to true. False hides the entry everywhere and 404s its page. */
  enabled?: boolean;
  /** schema.org application entry for the layout JSON-LD graph. Entries
   *  without one (external apps) stay out of the graph. */
  schema?: {
    type: "WebApplication" | "SoftwareApplication" | "MobileApplication";
    /** Override when the schema.org name differs from the catalog title. */
    name?: string;
    applicationCategory: string;
    operatingSystem: string;
    description?: string;
  };
  /** Sitemap priority; entries without one (external apps) are omitted. */
  sitemapPriority?: number;
}

const allApps: CatalogEntry[] = [
  {
    title: "Frost",
    description:
      "Input locker for macOS. Freeze keyboard, mouse, and trackpad while the screen stays visible, then unlock with TouchID.",
    href: "/frost",
    meta: "macOS",
    sitemapPriority: 0.9,
    schema: {
      type: "SoftwareApplication",
      applicationCategory: "UtilityApplication",
      operatingSystem: "macOS",
      description:
        "Input locker for macOS. Freeze keyboard, mouse, and trackpad while the screen stays visible. Unlocks with TouchID.",
    },
  },
  {
    title: "Hush",
    description:
      "A focused sound studio for iOS with real-time noise, binaural beats, and 80+ ambient recordings to layer and mix.",
    href: "/hush",
    meta: "iOS",
    sitemapPriority: 0.9,
    schema: {
      type: "MobileApplication",
      applicationCategory: "UtilityApplication",
      operatingSystem: "iOS",
      description:
        "Focus sounds for iOS. Noise generators, binaural beats, and 80+ ambient sounds.",
    },
  },
  {
    title: "SafeStay Scanner",
    description:
      "Detect hidden cameras at Airbnbs and rentals. Network scanner, MAC lookup, and inspection checklist.",
    href: "/safestay",
    meta: "macOS · Linux",
    enabled: false,
    sitemapPriority: 0.8,
    schema: {
      type: "SoftwareApplication",
      applicationCategory: "SecurityApplication",
      operatingSystem: "macOS, Linux",
      description:
        "CLI tool to detect hidden cameras on WiFi networks. ARP scanning, MAC address lookup, and port detection.",
    },
  },
  {
    title: "Strobe",
    description:
      "A rapid serial visual reader for iPhone, iPad, and Mac that turns PDFs, EPUBs, and plain text into a focused reading stream.",
    href: "https://strobefast.app",
    meta: "strobefast.app",
    external: true,
  },
];

const allTools: CatalogEntry[] = [
  {
    title: "CoverQuad",
    description:
      "Apple killed the 2×2 playlist covers. This brings them back.",
    href: "/coverquad",
    meta: "/coverquad",
    sitemapPriority: 0.8,
    schema: {
      type: "WebApplication",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
    },
  },
  {
    title: "Regex Tester",
    description:
      "Test and debug regular expressions with live match highlighting.",
    href: "/regex",
    meta: "/regex",
    sitemapPriority: 0.9,
    schema: {
      type: "WebApplication",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
    },
  },
  {
    title: "Pomodoro Timer",
    description: "A calm, adjustable focus timer with deliberate work intervals, breaks, and lightweight session tracking.",
    href: "/pomodoro",
    meta: "/pomodoro",
    sitemapPriority: 0.8,
    schema: {
      type: "WebApplication",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
    },
  },
  {
    title: "Password Generator",
    description:
      "Generate memorable passwords and diceware passphrases with clear entropy feedback and secure defaults.",
    href: "/pwgen",
    meta: "/pwgen",
    sitemapPriority: 0.9,
    schema: {
      type: "WebApplication",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
    },
  },
  {
    title: "2FA QR Generator",
    description:
      "Turn TOTP or HOTP secrets and otpauth links into authenticator-ready QR codes without exposing the secret.",
    href: "/2fa",
    meta: "/2fa",
    sitemapPriority: 0.8,
    schema: {
      type: "WebApplication",
      applicationCategory: "SecurityApplication",
      operatingSystem: "Any",
    },
  },
  {
    title: "QR Generator",
    description:
      "QR codes for links, WiFi, email, and phone. Styled, then downloaded.",
    href: "/qr",
    meta: "/qr",
    sitemapPriority: 0.9,
    schema: {
      type: "WebApplication",
      name: "QR Code Generator",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Any",
    },
  },
  {
    title: "Lo-fi ATC Radio",
    description:
      "Lo-fi beats mixed with live JFK Tower air-traffic control radio.",
    href: "/lofi-atc",
    meta: "/lofi-atc",
    enabled: false,
    sitemapPriority: 0.8,
    schema: {
      type: "WebApplication",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Any",
    },
  },
];

const isLive = (entry: CatalogEntry) => entry.enabled !== false;

/** Enabled entries only — what the site actually shows and indexes. */
export const apps: CatalogEntry[] = allApps.filter(isLive);
export const tools: CatalogEntry[] = allTools.filter(isLive);

/** Whether the catalog entry for `href` exists and is enabled. Route pages
 *  for toggleable tools use this to decide between rendering and 404. */
export function entryEnabled(href: string): boolean {
  const entry = [...allApps, ...allTools].find((e) => e.href === href);
  return !!entry && isLive(entry);
}

/**
 * Tools related to `currentHref`, in catalog order starting just after the
 * current tool (wrapping around), so every page cross-links a different trio.
 */
export function relatedTools(currentHref: string, limit = 3): CatalogEntry[] {
  const others = tools.filter((t) => t.href !== currentHref);
  const index = tools.findIndex((t) => t.href === currentHref);
  if (index === -1) return others.slice(0, limit);
  const start = index % others.length;
  return [...others.slice(start), ...others.slice(0, start)].slice(0, limit);
}
