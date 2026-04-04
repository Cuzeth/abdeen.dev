import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
  themeColor: "#080808",
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
      sameAs: ["https://jaafar.cv"],
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
      className={`${geistSans.variable} ${geistMono.variable}`}
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
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-white focus:rounded-md focus:text-sm"
        >
          Skip to content
        </a>
        <header className="w-full px-6 py-5" role="banner">
          <nav className="max-w-5xl mx-auto" aria-label="Main">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-[var(--heading)] hover:opacity-80 transition-opacity"
              aria-label="abdeen.dev — Home"
            >
              abdeen<span className="text-[var(--accent)]">.</span>dev
            </Link>
          </nav>
        </header>
        <main id="main-content" className="flex-1">{children}</main>
        <footer className="w-full px-6 py-8 border-t border-white/5" role="contentinfo">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text)]">
            <span className="opacity-50">
              &copy; {new Date().getFullYear()}{" "}
              <a
                href="https://jaafar.cv"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--heading)] transition-colors"
              >
                Jaafar Abdeen
              </a>
            </span>
            <a
              href="https://jaafar.cv"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-40 hover:opacity-80 transition-opacity"
            >
              jaafar.cv
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
