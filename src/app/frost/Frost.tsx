"use client";

import { useEffect, useState } from "react";
import FadeInWrapper from "@/components/FadeInWrapper";
import SectionHeader from "@/components/SectionHeader";

const REPO_URL = "https://github.com/Cuzeth/frost";
const RELEASES_URL = `${REPO_URL}/releases/latest`;

const features = [
  {
    label: "Locks Every Input",
    detail:
      "Keyboard, mouse, and trackpad are suppressed at the system level.",
  },
  {
    label: "Screen Stays Visible",
    detail:
      "A translucent overlay dims the desktop but never hides it, so you can watch a long task run while input is frozen.",
  },
  {
    label: "Every Display",
    detail:
      "The overlay covers all your monitors, and the unlock prompt follows the display you locked from.",
  },
  {
    label: "TouchID to Unlock",
    detail:
      "Authenticate right inside the overlay. Optionally arm TouchID the moment a lock begins.",
  },
  {
    label: "Apple Watch Unlock",
    detail:
      "Opt in to approve unlocks with a double-press on a paired Apple Watch. It works even on desktop Macs without TouchID.",
  },
  {
    label: "Lock from Shortcuts",
    detail:
      "A Lock Input action for Shortcuts and scripts starts the same lock as the menu item. Lock-only by design. Nothing can unlock Frost programmatically.",
  },
  {
    label: "Overlay Message",
    detail:
      "Show an optional message of your own on the locked screen, so anyone at the desk can see what's running.",
  },
  {
    label: "Auto-Lock",
    detail:
      "Lock automatically after the Mac sits idle, anywhere from 30 seconds to two hours.",
  },
  {
    label: "Stays Awake",
    detail:
      "Optionally hold the display on and keep the Mac from sleeping while it's locked.",
  },
];

const requirements = [
  "macOS 14.6+",
  "Apple Silicon & Intel",
  "TouchID (or Apple Watch)",
];

const APPLE_PATH =
  "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z";

type Release = {
  tag_name: string;
  assets: { name: string; browser_download_url: string }[];
};

/** Latest-release download target, shared by the hero and closing CTA so the
 *  GitHub API is only hit once per page view. */
function useLatestRelease() {
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
          // Same visual width as the fallback label — avoids the button
          // resizing under the cursor when the release info arrives
          setLabel(`Download ${data.tag_name.replace(/^v/, "")} for macOS`);
        }
      })
      .catch(() => {
        // Keep the /releases/latest fallback (e.g. GitHub API rate limit).
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { href, label };
}

function DownloadButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-red)] px-6 py-3 text-sm font-semibold text-[var(--color-paper)] shadow-[0_14px_30px_-10px_var(--accent-glow)] transition duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[var(--accent-hover)] hover:shadow-[0_18px_40px_-10px_var(--accent-glow)] active:translate-y-0"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={APPLE_PATH} />
      </svg>
      {label}
    </a>
  );
}

/** Product visual: a dimmed, frosted desktop with a TouchID unlock chip. */
function LockVisual() {
  return (
    <div className="surface-ink-elev relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem]">
      {/* Faux desktop behind the frost */}
      <div className="absolute -left-10 top-4 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(204,27,27,0.28),transparent_70%)]" />
      <div className="absolute -right-8 bottom-2 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(250,250,250,0.06),transparent_70%)]" />
      <div className="absolute left-8 top-12 h-28 w-48 rounded-xl border border-white/[0.06] bg-white/[0.03]" />
      <div className="absolute bottom-10 right-10 h-24 w-40 rounded-xl border border-white/[0.05] bg-white/[0.02]" />

      {/* Menu bar with the Frost mark */}
      <div className="absolute inset-x-0 top-0 flex h-7 items-center justify-end gap-2.5 bg-black/30 px-3">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-red)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
          <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
        </svg>
        <span className="h-1.5 w-1.5 rounded-full bg-white/25" />
      </div>

      {/* Frosted overlay */}
      <div className="absolute inset-0 bg-white/[0.05] backdrop-blur-md" />

      {/* Unlock chip */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.1] bg-[rgba(8,8,8,0.62)] px-8 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-red)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
            <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
            <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
            <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
            <path d="M8.65 22c.21-.66.45-1.32.57-2" />
            <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
            <path d="M2 16h.01" />
            <path d="M21.8 16c.2-2 .131-5.354 0-6" />
            <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
          </svg>
          <div className="text-center">
            <div className="text-sm font-semibold tracking-[-0.01em] text-[var(--color-paper)]">
              Input Locked
            </div>
            <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)]">
              TouchID to unlock
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Frost() {
  const release = useLatestRelease();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 pb-20 pt-4 md:gap-20 md:pb-28 md:pt-10">
      {/* Hero */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <FadeInWrapper direction="up">
          <div className="flex flex-col gap-5">
            <span className="eyebrow-system">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-red)] shadow-[0_0_10px_var(--accent-glow)]"
              />
              macOS App · Abdeen Labs
            </span>
            <h1 className="text-5xl font-semibold tracking-[-0.02em] text-[var(--color-paper)] md:text-7xl">
              Frost<span className="text-[var(--color-red)]">.</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-[var(--text)] md:text-lg">
              A menu-bar input locker for macOS. Freeze your keyboard, mouse, and
              trackpad while the screen stays fully visible. Then unlock with
              TouchID. Lock your desk while an agent, a build, or a render runs
              unattended.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
              <DownloadButton href={release.href} label={release.label} />
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
          <LockVisual />
        </FadeInWrapper>
      </section>

      {/* Features */}
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

      {/* Requirements */}
      <FadeInWrapper direction="up">
        <section>
          <SectionHeader label="Requirements" />
          <div className="flex flex-wrap gap-2">
            {requirements.map((r) => (
              <span key={r} className="chip">
                {r}
              </span>
            ))}
          </div>
        </section>
      </FadeInWrapper>

      {/* Safety */}
      <FadeInWrapper direction="up">
        <section>
          <p className="max-w-2xl text-sm leading-7 text-[var(--text)] opacity-70">
            Built to never trap you: a configurable unlock shortcut, and a clean
            teardown on SIGTERM so a remote{" "}
            <span className="font-mono">kill</span> over SSH always restores
            input. No accounts, no analytics, no tracking. Frost is not a screen
            lock or a replacement for the macOS login window.
          </p>
        </section>
      </FadeInWrapper>

      {/* Download */}
      <FadeInWrapper direction="up">
        <section
          aria-label="Download Frost"
          className="border-t border-white/[0.08] pt-8 md:pt-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-8">
            <div className="flex max-w-md flex-col gap-3">
              <h2 className="eyebrow-system">
                <span aria-hidden="true" className="text-[var(--color-red)]">
                  /
                </span>
                Download
              </h2>
              <p className="text-sm leading-7 text-[var(--text)]">
                One DMG, no installer, no account. Drag Frost to Applications
                and lock your desk from the menu bar.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)]">
                macOS 14.6+ &middot; Free &amp; open source
              </p>
            </div>
            <div className="flex flex-col items-start gap-3">
              <DownloadButton href={release.href} label={release.label} />
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text)]">
                <a
                  href={RELEASES_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--color-paper)]"
                >
                  All releases &rarr;
                </a>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[var(--color-paper)]"
                >
                  GitHub &rarr;
                </a>
              </div>
            </div>
          </div>
        </section>
      </FadeInWrapper>
    </div>
  );
}
