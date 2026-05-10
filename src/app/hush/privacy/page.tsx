import type { Metadata } from "next";
import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";

export const metadata: Metadata = {
  title: "Privacy Policy — Hush | abdeen.dev",
  description:
    "Hush does not collect, store, or transmit your personal data. Everything stays on your device.",
  alternates: { canonical: "https://abdeen.dev/hush/privacy" },
  openGraph: {
    title: "Privacy Policy — Hush | abdeen.dev",
    description:
      "Hush does not collect, store, or transmit your personal data.",
    url: "https://abdeen.dev/hush/privacy",
  },
};

export default function HushPrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-16 pt-4 md:gap-8 md:pb-24 md:pt-8">
      <FadeInWrapper direction="up">
        <section className="surface-ink-elev overflow-hidden rounded-[1.25rem] md:rounded-[2rem]">
          <div className="border-b border-white/[0.06] px-5 py-4 md:px-8 md:py-5">
            <h1 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
              Privacy Policy
            </h1>
            <p className="mt-1 text-sm text-[var(--text)] opacity-70">
              Hush for iOS
            </p>
          </div>
          <div className="flex flex-col gap-8 px-5 py-6 md:px-8 md:py-8">
            <p className="text-xs text-[var(--text)] opacity-40">
              Last updated: April 10, 2026
            </p>

            <div className="flex flex-col gap-6 text-sm leading-7 text-[var(--text)]">
              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  Data Collection
                </h2>
                <p>
                  Hush does not collect any personal data. There are no
                  accounts, no analytics, and no tracking. We do not transmit
                  any information from your device.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  Local Storage Only
                </h2>
                <p>
                  All data — including your saved presets, sound preferences,
                  and session state — remains exclusively on your device. Nothing
                  is uploaded to any server.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  No Analytics
                </h2>
                <p>
                  We do not use analytics, tracking pixels, or any third-party
                  services that could identify or profile you.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  Audio Content
                </h2>
                <p>
                  All noise generators run locally using real-time DSP. Ambient
                  sound files are bundled with the app and play entirely
                  offline. No network requests are made during playback.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  Contact
                </h2>
                <p>
                  If you have any questions about this policy, reach out at{" "}
                  <a
                    href="mailto:help@abdeen.dev"
                    className="text-[var(--accent)] transition-opacity hover:opacity-70"
                  >
                    help@abdeen.dev
                  </a>
                  .
                </p>
              </section>
            </div>

            <div className="flex gap-4 text-xs text-[var(--text)] opacity-40">
              <Link
                href="/hush"
                className="transition-opacity hover:opacity-70"
              >
                &larr; Hush
              </Link>
              <Link
                href="/hush/terms"
                className="transition-opacity hover:opacity-70"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </section>
      </FadeInWrapper>
    </div>
  );
}
