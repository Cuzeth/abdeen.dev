"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";
import SectionHeader from "@/components/SectionHeader";

const features = [
  {
    label: "Noise Generators",
    detail: "White, pink, brown, and gray noise synthesized in real-time.",
  },
  {
    label: "Binaural Beats",
    detail:
      "Alpha, SMR, Beta, and Gamma ranges with configurable carrier frequency.",
  },
  {
    label: "Isochronic Tones",
    detail: "Alternative brainwave entrainment with isochronic and monaural beats.",
  },
  {
    label: "80+ Ambient Sounds",
    detail: "Rain, fire, ocean, birds, cafe, train, forest, and many more.",
  },
  {
    label: "Layer & Mix",
    detail: "Combine up to 6 sounds with independent volume controls.",
  },
  {
    label: "Focus Timer",
    detail: "Built-in timer with fade-out for focused work sessions.",
  },
];

const presets = [
  "Focus",
  "Deep Work",
  "Sleep",
  "Calm",
  "Storm",
  "Coffee Shop",
  "Rainy Day",
  "Forest",
  "Cozy",
];

const REPO_URL = "https://github.com/cuzeth/hush";
const APP_STORE_URL: string | null = "https://apps.apple.com/us/app/hush-focus-sounds/id6761935532";

const screenshots = [
  "/hush/screen-1.png",
  "/hush/screen-2.png",
  "/hush/screen-3.png",
];

const APPLE_PATH =
  "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z";

/** Primary conversion action, shared by the hero and closing CTA. Falls back
 *  to a disabled "coming soon" chip while APP_STORE_URL is unset. */
function AppStoreButton() {
  if (!APP_STORE_URL) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-[var(--text)] opacity-50">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d={APPLE_PATH} />
        </svg>
        Coming soon on the App Store
      </span>
    );
  }
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] shadow-[0_14px_30px_-10px_var(--accent-glow)] transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[0_18px_40px_-10px_var(--accent-glow)] active:translate-y-0"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={APPLE_PATH} />
      </svg>
      Download on the App Store
    </a>
  );
}

function ScreenshotImage({ src, index }: { src: string; index: number }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative h-[480px] w-[222px] flex-shrink-0 rounded-[1.25rem] border border-white/[0.08] overflow-hidden bg-white/[0.02]">
      <Image
        src={src}
        alt={`Hush screenshot ${index + 1}`}
        width={222}
        height={480}
        priority
        className={`h-full w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        ref={(img) => {
          // Cached images can finish before hydration attaches onLoad
          if (img?.complete) setLoaded(true);
        }}
      />
    </div>
  );
}

/** Hero device: the first screenshot in a phone frame with an ambient glow. */
function HeroPhone() {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative mx-auto w-full max-w-[280px] lg:ml-auto lg:mr-0">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(204,27,27,0.18),transparent_70%)]" />
      <div className="relative rounded-[2.3rem] border border-white/[0.1] bg-white/[0.03] p-2.5 shadow-[0_40px_100px_rgba(0,0,0,0.55)]">
        <div className="overflow-hidden rounded-[1.8rem] border border-white/[0.06]">
          <Image
            src="/hush/screen-1.png"
            alt="Hush app interface"
            width={244}
            height={528}
            priority
            className={`block h-auto w-full transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            ref={(img) => {
              if (img?.complete) setLoaded(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Hush() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 pb-20 pt-4 md:gap-20 md:pb-28 md:pt-10">
      {/* Hero */}
      <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <FadeInWrapper direction="up">
          <div className="flex flex-col gap-5">
            <span className="eyebrow-system">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-red)] shadow-[0_0_10px_var(--accent-glow)]"
              />
              iOS App · Abdeen Labs
            </span>
            <h1 className="text-5xl font-semibold tracking-[-0.02em] text-[var(--color-paper)] md:text-7xl">
              Hush<span className="text-[var(--color-red)]">.</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-[var(--text)] md:text-lg">
              Focus sounds for iOS. Real-time DSP noise generators, binaural
              beats, and a curated library of 80+ ambient recordings, all mixed
              together in a simple, distraction-free interface.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
              <AppStoreButton />
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text)] transition-colors hover:text-[var(--color-paper)]"
              >
                View source &rarr;
              </a>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)]">
              Free &amp; open source &middot; No accounts, no tracking
            </p>
          </div>
        </FadeInWrapper>

        <FadeInWrapper direction="up" delay={0.08}>
          <HeroPhone />
        </FadeInWrapper>
      </section>

      {/* Screenshots */}
      <FadeInWrapper direction="up">
        <section>
          <SectionHeader label="Screenshots" />
          <div
            className="flex gap-4 overflow-x-auto pb-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-red)]"
            tabIndex={0}
            role="region"
            aria-label="App screenshots, scrollable"
          >
            {screenshots.map((src, i) => (
              <ScreenshotImage key={i} src={src} index={i} />
            ))}
          </div>
        </section>
      </FadeInWrapper>

      {/* Features Grid */}
      <section>
        <FadeInWrapper direction="up">
          <SectionHeader label="Features" count={features.length} />
        </FadeInWrapper>
        <FadeInWrapper direction="up" delay={0.05}>
          <div className="feature-grid sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div key={f.label} className="feature-cell">
                <span aria-hidden="true" className="index-num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
                    {f.label}
                  </h3>
                  <p className="mt-1.5 text-sm leading-7 text-[var(--text)]">
                    {f.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </FadeInWrapper>
      </section>

      {/* Presets */}
      <FadeInWrapper direction="up">
        <section>
          <SectionHeader label="Built-in Presets" />
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <span key={p} className="chip">
                {p}
              </span>
            ))}
          </div>
        </section>
      </FadeInWrapper>

      {/* Closing CTA */}
      <FadeInWrapper direction="up">
        <section
          aria-label="Get Hush"
          className="shell-panel rounded-[1.5rem] px-6 py-10 md:rounded-[2rem] md:px-12 md:py-14"
        >
          <div className="relative flex flex-col gap-6">
            <span className="eyebrow-system">
              <span aria-hidden="true" className="text-[var(--color-red)]">
                /
              </span>
              Get Hush
            </span>
            <h2 className="max-w-2xl text-3xl font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--color-paper)] md:text-5xl">
              Quiet the room,
              <br />
              keep the focus<span className="text-[var(--color-red)]">.</span>
            </h2>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <AppStoreButton />
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--text)] transition-colors hover:text-[var(--color-paper)]"
              >
                GitHub &rarr;
              </a>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)]">
              iOS &middot; Free &amp; open source &middot; GPL-3.0 &middot; No
              accounts, no tracking
            </p>
          </div>
        </section>
      </FadeInWrapper>

      {/* Legal */}
      <FadeInWrapper direction="up">
        <nav
          aria-label="Hush legal"
          className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text)]"
        >
          <Link
            href="/hush/privacy"
            className="transition-colors hover:text-[var(--color-paper)]"
          >
            Privacy Policy
          </Link>
          <Link
            href="/hush/terms"
            className="transition-colors hover:text-[var(--color-paper)]"
          >
            Terms of Service
          </Link>
        </nav>
      </FadeInWrapper>
    </div>
  );
}
