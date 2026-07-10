import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { switzer, plexSans, arefRuqaa, jetbrainsMono } from "./fonts";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { buildJsonLd } from "@/lib/structured-data";
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
    // Disabled while SafeStay is off (enabled: false in src/lib/catalog.ts)
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

// Application entries derive from src/lib/catalog.ts, so a catalog toggle
// updates the structured data automatically.
const jsonLd = buildJsonLd();

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
