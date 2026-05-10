import type { Metadata } from "next";
import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";

export const metadata: Metadata = {
  title: "Terms of Service — Hush | abdeen.dev",
  description: "Terms of service for Hush, a focus sounds app for iOS.",
  alternates: { canonical: "https://abdeen.dev/hush/terms" },
  openGraph: {
    title: "Terms of Service — Hush | abdeen.dev",
    description: "Terms of service for Hush, a focus sounds app for iOS.",
    url: "https://abdeen.dev/hush/terms",
  },
};

export default function HushTermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 pb-16 pt-4 md:gap-8 md:pb-24 md:pt-8">
      <FadeInWrapper direction="up">
        <section className="surface-ink-elev overflow-hidden rounded-[1.25rem] md:rounded-[2rem]">
          <div className="border-b border-white/[0.06] px-5 py-4 md:px-8 md:py-5">
            <h1 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
              Terms of Service
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
                  Use of the App
                </h2>
                <p>
                  Hush is a focus sounds app. By using it, you agree to use the
                  app responsibly and in accordance with these terms and all
                  applicable laws.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  Audio Content
                </h2>
                <p>
                  Ambient sound recordings included in Hush are sourced under
                  permissive licenses (Pixabay Content License, CC0, and MIT).
                  Noise generators and brainwave entrainment tones are
                  synthesized locally on your device.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  No Warranties
                </h2>
                <p>
                  Hush is provided &quot;as is&quot; without warranties of any
                  kind. We do not guarantee that the app will be uninterrupted
                  or error-free. Hush is not a medical device and does not
                  provide medical advice.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  Limitation of Liability
                </h2>
                <p>
                  We will not be liable for any indirect, incidental, or
                  consequential damages arising from your use of Hush.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  Changes to Terms
                </h2>
                <p>
                  We may update these terms from time to time. Continued use of
                  Hush after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="mb-2 font-semibold text-[var(--heading)]">
                  Contact
                </h2>
                <p>
                  Questions? Reach out at{" "}
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
                href="/hush/privacy"
                className="transition-opacity hover:opacity-70"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </section>
      </FadeInWrapper>
    </div>
  );
}
