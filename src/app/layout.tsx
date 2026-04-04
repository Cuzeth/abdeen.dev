import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
    default: "abdeen.dev — Small tools, carefully engineered.",
  },
  description:
    "Free, open-source browser tools: password generator, QR codes, regex tester, pomodoro timer, and more.",
  metadataBase: new URL("https://abdeen.dev"),
  applicationName: "abdeen.dev",
  authors: [{ name: "Jaafar Abdeen", url: "https://jaafar.cv" }],
  keywords:
    "tools, password generator, QR code, regex tester, pomodoro timer, 2FA, open source, FOSS",
  openGraph: {
    siteName: "abdeen.dev",
    type: "website",
    url: "https://abdeen.dev",
    title: "abdeen.dev — Small tools, carefully engineered.",
    description:
      "Free, open-source browser tools: password generator, QR codes, regex tester, pomodoro timer, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "abdeen.dev — Small tools, carefully engineered.",
    description:
      "Free, open-source browser tools: password generator, QR codes, regex tester, pomodoro timer, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080808",
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
        <header className="w-full px-6 py-5">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-[var(--heading)] hover:opacity-80 transition-opacity"
            >
              abdeen.dev
            </Link>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="w-full px-6 py-6">
          <div className="max-w-5xl mx-auto text-xs text-[var(--text)] opacity-40">
            <a
              href="https://jaafar.cv"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 transition-opacity"
            >
              jaafar.cv
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
