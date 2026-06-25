"use client";

import { useEffect, useState } from "react";
import FadeInWrapper from "@/components/FadeInWrapper";

const REPO_URL = "https://github.com/Cuzeth/frost";
const RELEASES_URL = `${REPO_URL}/releases/latest`;

const features = [
  {
    label: "Locks Every Input",
    detail:
      "Keyboard, mouse, and trackpad are suppressed at the system level — not just in your frontmost app.",
  },
  {
    label: "Screen Stays Visible",
    detail:
      "A translucent overlay dims the desktop but never hides it, so you can watch a long task run while input is frozen.",
  },
  {
    label: "Touch ID to Unlock",
    detail:
      "Authenticate right inside the overlay. Optionally arm Touch ID the moment a lock begins.",
  },
  {
    label: "Every Display",
    detail:
      "The overlay covers all your monitors, and the unlock prompt follows the display you locked from.",
  },
  {
    label: "Auto-Lock",
    detail:
      "Lock automatically after the Mac sits idle — anywhere from 30 seconds to two hours.",
  },
  {
    label: "Stays Awake",
    detail:
      "Optionally hold the display on and keep the Mac from sleeping while it's locked.",
  },
];

const requirements = [
  "macOS 14+",
  "Apple silicon & Intel",
  "Touch ID required",
  "Accessibility permission",
];

type Release = {
  tag_name: string;
  assets: { name: string; browser_download_url: string }[];
};

function DownloadButton() {
  const [href, setHref] = useState(RELEASES_URL);
  const [label, setLabel] = useState("Download for macOS");

  useEffect(() => {
    let cancelled = false;
    fetch("https://api.github.com/repos/Cuzeth/frost/releases/latest", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((r) => (r.ok ? (r.json() as Promise<Release>) : Promise.reject(r.status)))
      .then((data) => {
        if (cancelled) return;
        const dmg = data.assets?.find((a) =>
          a.name.toLowerCase().endsWith(".dmg")
        );
        if (dmg) {
          setHref(dmg.browser_download_url);
          setLabel(`Download Frost ${data.tag_name.replace(/^v/, "")}`);
        }
      })
      .catch(() => {
        // Keep the /releases/latest fallback (e.g. GitHub API rate limit).
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-[var(--heading)] transition-colors duration-200 hover:border-white/[0.22] hover:bg-white/[0.08]"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      {label}
    </a>
  );
}

export default function Frost() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 pb-20 pt-4 md:gap-14 md:pb-28 md:pt-8">
      {/* Hero */}
      <FadeInWrapper direction="up">
        <div className="flex flex-col gap-4">
          <span className="eyebrow w-fit">macOS App</span>
          <h1 className="text-4xl font-semibold tracking-[-0.02em] text-[var(--color-paper)] md:text-5xl">
            Frost
          </h1>
          <p className="max-w-xl text-base leading-8 text-[var(--text)] md:text-lg md:leading-8">
            A menu-bar input locker for macOS. Freeze your keyboard, mouse, and
            trackpad while the screen stays fully visible — then unlock with
            Touch ID. Lock your desk while an agent, a build, or a render runs
            unattended.
          </p>
          <div className="mt-2 flex items-center gap-3">
            <DownloadButton />
          </div>
        </div>
      </FadeInWrapper>

      {/* Features */}
      <section>
        <FadeInWrapper direction="up" delay={0.06}>
          <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-graphite)]">
            Features
          </h2>
        </FadeInWrapper>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FadeInWrapper key={f.label} direction="up" delay={0.08 + i * 0.04}>
              <div className="surface-card flex h-full flex-col gap-2 rounded-[1.1rem] px-5 py-5 md:rounded-[1.6rem]">
                <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
                  {f.label}
                </h3>
                <p className="text-sm leading-7 text-[var(--text)]">{f.detail}</p>
              </div>
            </FadeInWrapper>
          ))}
        </div>
      </section>

      {/* Requirements */}
      <FadeInWrapper direction="up" delay={0.12}>
        <section>
          <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-graphite)]">
            Requirements
          </h2>
          <div className="flex flex-wrap gap-2">
            {requirements.map((r) => (
              <span key={r} className="eyebrow">
                {r}
              </span>
            ))}
          </div>
        </section>
      </FadeInWrapper>

      {/* Safety + Links */}
      <FadeInWrapper direction="up" delay={0.16}>
        <section className="flex flex-col gap-4">
          <p className="text-sm leading-7 text-[var(--text)] opacity-70">
            Built to never trap you: a configurable unlock shortcut, and a clean
            teardown on SIGTERM so a remote{" "}
            <span className="font-mono">kill</span> over SSH always restores
            input. No accounts, no analytics, no tracking. Frost is not a screen
            lock or a replacement for the macOS login window.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text)] opacity-50">
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              GitHub &rarr;
            </a>
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              All releases &rarr;
            </a>
          </div>
        </section>
      </FadeInWrapper>
    </div>
  );
}
