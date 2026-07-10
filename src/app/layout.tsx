import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { switzer, plexSans, arefRuqaa, jetbrainsMono } from "./fonts";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
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
        <SiteHeader />
        <main id="main-content" tabIndex={-1} className="relative flex-1 px-4 md:px-8 outline-none">{children}</main>
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
