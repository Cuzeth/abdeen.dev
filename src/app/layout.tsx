import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { switzer, plexSans, arefRuqaa, jetbrainsMono } from "./fonts";
import { apps, tools } from "@/lib/catalog";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | abdeen.dev",
    default: "abdeen.dev · Small tools, carefully engineered",
  },
  description:
    "Independent apps and free, open-source browser tools by Jaafar Abdeen. No sign-up required.",
  metadataBase: new URL("https://abdeen.dev"),
  applicationName: "abdeen.dev",
  authors: [{ name: "Jaafar Abdeen", url: "https://jaafar.cv" }],
  creator: "Jaafar Abdeen",
  publisher: "Abdeen Labs",
  keywords: [
    "Jaafar Abdeen",
    "Abdeen Labs",
    "abdeen.dev",
    "free browser tools",
    "password generator",
    "QR code generator",
    "regex tester",
    "pomodoro timer",
    "2FA QR generator",
    "album art collage",
    "open source tools",
    "developer tools",
    "online utilities",
    "Hush",
    "focus sounds",
    "iOS app",
    // DISABLED: SafeStay Scanner — re-enable alongside src/app/safestay/page.tsx
    // "SafeStay",
    // "hidden camera detector",
  ],
  alternates: {
    canonical: "https://abdeen.dev",
  },
  openGraph: {
    siteName: "abdeen.dev",
    type: "website",
    url: "https://abdeen.dev",
    title: "abdeen.dev · Small tools, carefully engineered",
    description:
      "Independent apps and free, open-source browser tools by Jaafar Abdeen. No sign-up required.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "abdeen.dev · Small tools, carefully engineered",
    description:
      "Free and open-source tools: password generator, QR codes, regex tester, pomodoro timer, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0A0A",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://abdeen.dev/#website",
      name: "abdeen.dev",
      url: "https://abdeen.dev",
      description:
        "Free and open-source tools by Jaafar Abdeen: password generator, QR code maker, regex tester, pomodoro timer, and more.",
      author: { "@id": "https://abdeen.dev/#person" },
      publisher: { "@id": "https://abdeen.dev/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://abdeen.dev/#organization",
      name: "Abdeen Labs",
      url: "https://abdeen.dev",
      founder: { "@id": "https://abdeen.dev/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://abdeen.dev/#person",
      name: "Jaafar Abdeen",
      url: "https://jaafar.cv",
      sameAs: [
        "https://jaafar.cv",
        "https://github.com/Cuzeth",
        "https://linkedin.com/in/jaafar-abdeen",
        "https://strobefast.app",
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": "https://abdeen.dev/#collection",
      name: "Free Tools",
      description:
        "A curated collection of free and open-source tools.",
      url: "https://abdeen.dev",
      isPartOf: { "@id": "https://abdeen.dev/#website" },
      about: [
        {
          "@type": "WebApplication",
          name: "Password Generator",
          url: "https://abdeen.dev/pwgen",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "WebApplication",
          name: "QR Code Generator",
          url: "https://abdeen.dev/qr",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "WebApplication",
          name: "Regex Tester",
          url: "https://abdeen.dev/regex",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "WebApplication",
          name: "Pomodoro Timer",
          url: "https://abdeen.dev/pomodoro",
          applicationCategory: "UtilityApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "WebApplication",
          name: "2FA QR Generator",
          url: "https://abdeen.dev/2fa",
          applicationCategory: "SecurityApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "WebApplication",
          name: "CoverQuad",
          url: "https://abdeen.dev/coverquad",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        {
          "@type": "SoftwareApplication",
          name: "Frost",
          url: "https://abdeen.dev/frost",
          applicationCategory: "UtilityApplication",
          operatingSystem: "macOS",
          description:
            "Input locker for macOS. Freeze keyboard, mouse, and trackpad while the screen stays visible. Unlocks with TouchID.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        // DISABLED: Lo-fi ATC Radio — re-enable alongside src/app/lofi-atc/page.tsx
        /*
        {
          "@type": "WebApplication",
          name: "Lo-fi ATC Radio",
          url: "https://abdeen.dev/lofi-atc",
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        */
        {
          "@type": "MobileApplication",
          name: "Hush",
          url: "https://abdeen.dev/hush",
          applicationCategory: "UtilityApplication",
          operatingSystem: "iOS",
          description:
            "Focus sounds for iOS. Noise generators, binaural beats, and 80+ ambient sounds.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        // DISABLED: SafeStay Scanner — re-enable alongside src/app/safestay/page.tsx
        /*
        {
          "@type": "SoftwareApplication",
          name: "SafeStay Scanner",
          url: "https://abdeen.dev/safestay",
          applicationCategory: "SecurityApplication",
          operatingSystem: "macOS, Linux",
          description:
            "CLI tool to detect hidden cameras on WiFi networks. ARP scanning, MAC address lookup, and port detection.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        */
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars = [
    switzer.variable,
    plexSans.variable,
    arefRuqaa.variable,
    jetbrainsMono.variable,
  ].join(" ");

  return (
    <html lang="en" className={fontVars} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--color-red)] focus:px-4 focus:py-2 focus:text-sm focus:text-[var(--color-paper)]"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-40 w-full px-4 py-4 md:px-8" role="banner">
          <nav
            className="site-nav surface-card mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-1.5 backdrop-blur-xl md:px-4 md:py-2"
            aria-label="Main"
          >
            <Link
              href="/"
              className="group flex min-h-10 min-w-0 items-center gap-3 rounded-full px-2 py-1.5 transition-opacity hover:opacity-90"
              aria-label="Abdeen Labs · Home"
            >
              <span
                aria-hidden="true"
                className="brand-mark shrink-0 text-[26px] leading-none text-[var(--mark-default)] md:text-[30px]"
              >
                عابدين
              </span>
              <span className="brand-wordmark shrink-0 text-[10px] text-[var(--color-paper)] md:text-[11px]">
                Abdeen Labs
              </span>
            </Link>

            <div className="flex items-center gap-1.5 md:gap-2">
              <Link
                href="/#apps"
                className="hidden rounded-full px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)] transition-colors duration-200 hover:text-[var(--color-paper)] md:block"
              >
                Apps
              </Link>
              <Link
                href="/#tools"
                className="hidden rounded-full px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)] transition-colors duration-200 hover:text-[var(--color-paper)] md:block"
              >
                Tools
              </Link>
              <span
                aria-hidden="true"
                className="hidden h-4 w-px bg-white/[0.1] md:block"
              />
              <a
                href="https://github.com/Cuzeth"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Cuzeth on GitHub"
                className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-[var(--color-graphite)] transition-colors duration-200 hover:bg-white/[0.04] hover:text-[var(--color-paper)]"
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
              </a>
              <a
                href="https://jaafar.cv"
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow transition-colors duration-200 hover:border-white/20 hover:text-[var(--color-paper)]"
              >
                jaafar.cv
              </a>
            </div>
          </nav>
        </header>
        <main id="main-content" tabIndex={-1} className="relative flex-1 px-4 md:px-8 outline-none">{children}</main>
        <footer className="w-full px-4 pb-8 pt-10 md:px-8 md:pb-12 md:pt-16" role="contentinfo">
          <div className="mx-auto w-full max-w-6xl border-t border-white/[0.08] pt-8 md:pt-12">
            <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="brand-mark text-[26px] leading-none text-[var(--mark-default)]"
                  >
                    عابدين
                  </span>
                  <span className="brand-wordmark text-[10px] text-[var(--color-paper)]">
                    Abdeen Labs
                  </span>
                </div>
                <p className="max-w-xs text-sm leading-7 text-[var(--text)]">
                  Small tools, carefully engineered. Free, open source, and
                  private by default.
                </p>
              </div>
              <nav aria-label="Apps" className="flex flex-col gap-3">
                <h2 className="eyebrow-system">
                  <span aria-hidden="true" className="text-[var(--color-red)]">
                    /
                  </span>
                  Apps
                </h2>
                <ul className="flex flex-col gap-2 text-sm text-[var(--text)]">
                  {apps.map((app) => (
                    <li key={app.href}>
                      {app.external ? (
                        <a
                          href={app.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                        >
                          {app.title} ↗
                        </a>
                      ) : (
                        <Link
                          href={app.href}
                          className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                        >
                          {app.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label="Web tools" className="flex flex-col gap-3">
                <h2 className="eyebrow-system">
                  <span aria-hidden="true" className="text-[var(--color-red)]">
                    /
                  </span>
                  Web tools
                </h2>
                <ul className="flex flex-col gap-2 text-sm text-[var(--text)]">
                  {tools.map((tool) => (
                    <li key={tool.href}>
                      <Link
                        href={tool.href}
                        className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                      >
                        {tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label="Elsewhere" className="flex flex-col gap-3">
                <h2 className="eyebrow-system">
                  <span aria-hidden="true" className="text-[var(--color-red)]">
                    /
                  </span>
                  Elsewhere
                </h2>
                <ul className="flex flex-col gap-2 text-sm text-[var(--text)]">
                  <li>
                    <a
                      href="https://github.com/Cuzeth"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                    >
                      GitHub ↗
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://jaafar.cv"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                    >
                      jaafar.cv ↗
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6 md:mt-12">
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)]">
                &copy; {new Date().getFullYear()} Jaafar Abdeen
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)] opacity-70">
                An Abdeen Labs property
              </span>
            </div>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
