/**
 * Single source of truth for everything the site indexes: native apps and
 * browser tools. The homepage index, the footer navigation, and the
 * ToolPageShell "More tools" strip all render from these arrays, so an
 * entry added (or re-enabled) here appears everywhere at once.
 */
export interface CatalogEntry {
  title: string;
  description: string;
  href: string;
  /** Mono metadata shown next to the entry (platform or route). */
  meta: string;
  external?: boolean;
}

export const apps: CatalogEntry[] = [
  {
    title: "Frost",
    description:
      "Input locker for macOS. Freeze keyboard, mouse, and trackpad while the screen stays visible, then unlock with TouchID.",
    href: "/frost",
    meta: "macOS",
  },
  {
    title: "Hush",
    description:
      "A focused sound studio for iOS with real-time noise, binaural beats, and 80+ ambient recordings to layer and mix.",
    href: "/hush",
    meta: "iOS",
  },
  // DISABLED: SafeStay Scanner — re-enable by uncommenting this entry
  // and flipping ENABLED in src/app/safestay/page.tsx back to true.
  /*
  {
    title: "SafeStay Scanner",
    description:
      "Detect hidden cameras at Airbnbs and rentals. Network scanner, MAC lookup, and inspection checklist.",
    href: "/safestay",
    meta: "macOS · Linux",
  },
  */
  {
    title: "Strobe",
    description:
      "A rapid serial visual reader for iPhone, iPad, and Mac that turns PDFs, EPUBs, and plain text into a focused reading stream.",
    href: "https://strobefast.app",
    meta: "strobefast.app",
    external: true,
  },
];

export const tools: CatalogEntry[] = [
  {
    title: "CoverQuad",
    description:
      "Apple killed the 2×2 playlist covers. This brings them back.",
    href: "/coverquad",
    meta: "/coverquad",
  },
  {
    title: "Regex Tester",
    description:
      "Test and debug regular expressions with live match highlighting.",
    href: "/regex",
    meta: "/regex",
  },
  {
    title: "Pomodoro Timer",
    description: "A calm, adjustable focus timer with deliberate work intervals, breaks, and lightweight session tracking.",
    href: "/pomodoro",
    meta: "/pomodoro",
  },
  {
    title: "Password Generator",
    description:
      "Generate memorable passwords and diceware passphrases with clear entropy feedback and secure defaults.",
    href: "/pwgen",
    meta: "/pwgen",
  },
  {
    title: "2FA QR Generator",
    description:
      "Turn TOTP or HOTP secrets and otpauth links into authenticator-ready QR codes without exposing the secret.",
    href: "/2fa",
    meta: "/2fa",
  },
  {
    title: "QR Generator",
    description:
      "QR codes for links, WiFi, email, and phone. Styled, then downloaded.",
    href: "/qr",
    meta: "/qr",
  },
  // DISABLED: Lo-fi ATC Radio — re-enable by uncommenting this entry
  // and flipping ENABLED in src/app/lofi-atc/page.tsx back to true.
  /*
  {
    title: "Lo-fi ATC Radio",
    description:
      "Lo-fi beats mixed with live JFK Tower air-traffic control radio.",
    href: "/lofi-atc",
    meta: "/lofi-atc",
  },
  */
];

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
