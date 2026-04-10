"use client";

import FadeInWrapper from "@/components/FadeInWrapper";

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

const REPO_URL = "https://github.com/cuzethcom/hush";
const APP_STORE_URL: string | null = null; // TODO: replace with App Store link

const screenshots = [
  // TODO: add screenshot paths, e.g. "/hush/screen-1.png"
] as string[];

export default function Hush() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-20 pt-4 md:gap-14 md:pb-28 md:pt-8">
      {/* Hero */}
      <FadeInWrapper direction="up">
        <div className="flex flex-col gap-4">
          <span className="eyebrow w-fit">iOS App</span>
          <h1 className="text-4xl font-bold tracking-[-0.06em] text-[var(--heading)] md:text-5xl">
            Hush
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--text)] md:text-lg md:leading-8">
            Focus sounds for iOS. Real-time DSP noise generators, binaural
            beats, and a curated library of 80+ ambient recordings — all mixed
            together in a simple, distraction-free interface.
          </p>
          <div className="mt-2 flex items-center gap-3">
            {APP_STORE_URL ? (
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] transition-colors duration-200 hover:border-white/[0.22] hover:bg-white/[0.08]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Download on the App Store
              </a>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-5 py-2.5 text-sm text-[var(--text)] opacity-50">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Coming soon on the App Store
              </span>
            )}
          </div>
        </div>
      </FadeInWrapper>

      {/* Screenshots */}
      <FadeInWrapper direction="up" delay={0.06}>
        <section>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text)] opacity-50">
            Screenshots
          </h2>
          {screenshots.length > 0 ? (
            <div className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {screenshots.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Hush screenshot ${i + 1}`}
                  className="h-[480px] w-auto flex-shrink-0 rounded-[1.25rem] border border-white/[0.08] object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-4">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex h-[480px] w-[222px] flex-shrink-0 items-center justify-center rounded-[1.25rem] border border-dashed border-white/[0.1] bg-white/[0.02]"
                >
                  <span className="text-xs text-[var(--text)] opacity-30">
                    Screenshot {n}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </FadeInWrapper>

      {/* Features Grid */}
      <section>
        <FadeInWrapper direction="up" delay={0.08}>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text)] opacity-50">
            Features
          </h2>
        </FadeInWrapper>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeInWrapper key={f.label} direction="up" delay={0.1 + i * 0.04}>
              <div className="surface-panel flex h-full flex-col gap-2 rounded-[1.1rem] px-5 py-5 md:rounded-[1.6rem]">
                <h3 className="text-base font-bold tracking-[-0.02em] text-[var(--heading)]">
                  {f.label}
                </h3>
                <p className="text-sm leading-7 text-[var(--text)]">
                  {f.detail}
                </p>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </section>

      {/* Presets */}
      <FadeInWrapper direction="up" delay={0.12}>
        <section>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text)] opacity-50">
            Built-in Presets
          </h2>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <span
                key={p}
                className="eyebrow"
              >
                {p}
              </span>
            ))}
          </div>
        </section>
      </FadeInWrapper>

      {/* Privacy + Links */}
      <FadeInWrapper direction="up" delay={0.16}>
        <section className="flex flex-col gap-4">
          <p className="text-sm leading-7 text-[var(--text)] opacity-70">
            No accounts, no analytics, no tracking. Open source under GPL-3.0.
          </p>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-sm text-[var(--text)] opacity-50 transition-opacity hover:opacity-80"
          >
            View source on GitHub &rarr;
          </a>
        </section>
      </FadeInWrapper>
    </div>
  );
}
