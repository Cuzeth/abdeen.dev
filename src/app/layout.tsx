import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Manrope } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | abdeen.dev",
    default: "abdeen.dev — Free Tools, Carefully Engineered",
  },
  description:
    "Free and open-source tools by Jaafar Abdeen. No sign-up, no tracking.",
  metadataBase: new URL("https://abdeen.dev"),
  applicationName: "abdeen.dev",
  authors: [{ name: "Jaafar Abdeen", url: "https://jaafar.cv" }],
  creator: "Jaafar Abdeen",
  publisher: "Jaafar Abdeen",
  keywords: [
    "Jaafar Abdeen",
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
    "SafeStay",
    "hidden camera detector",
  ],
  alternates: {
    canonical: "https://abdeen.dev",
  },
  openGraph: {
    siteName: "abdeen.dev",
    type: "website",
    url: "https://abdeen.dev",
    title: "abdeen.dev — Free Tools, Carefully Engineered",
    description:
      "Free and open-source tools by Jaafar Abdeen. No sign-up required.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "abdeen.dev — Free Tools, Carefully Engineered",
    description:
      "Free and open-source tools — password generator, QR codes, regex tester, pomodoro timer, and more.",
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
  themeColor: "#000000",
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
        "Free and open-source tools by Jaafar Abdeen — password generator, QR code maker, regex tester, pomodoro timer, and more.",
      author: { "@id": "https://abdeen.dev/#person" },
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
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <Script
          id="json-ld"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>
        <header className="sticky top-0 z-40 w-full px-4 py-4 md:px-8" role="banner">
          <nav
            className="mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-black/20 px-3 py-2 shadow-[0_18px_48px_rgba(0,0,0,0.18)] backdrop-blur-xl"
            aria-label="Main"
          >
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3 rounded-full px-3 py-2 transition-opacity hover:opacity-90"
              aria-label="abdeen.dev — Home"
            >
              <span className="shrink-0 text-lg font-bold tracking-[-0.06em] text-[var(--heading)]">
                abdeen<span className="text-[var(--accent)]">.</span>dev
              </span>
            </Link>

            <a
              href="https://jaafar.cv"
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow transition-colors duration-200 hover:border-white/20 hover:text-[var(--heading)]"
            >
              jaafar.cv
            </a>
          </nav>
        </header>
        <main id="main-content" className="relative flex-1 px-4 md:px-8">{children}</main>
        <footer className="w-full px-4 pb-6 pt-2 md:px-8 md:pb-10" role="contentinfo">
          <div className="mx-auto max-w-6xl text-center text-xs text-[var(--text)] opacity-50">
            <span>&copy; {new Date().getFullYear()} Jaafar Abdeen</span>
          </div>
        </footer>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
