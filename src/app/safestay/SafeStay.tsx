"use client";

import { useState, useEffect, useCallback } from "react";

interface OUIData {
  camera: Record<string, string>;
  chipset: Record<string, string>;
}

const PHYSICAL_CHECK = [
  {
    area: "Look at the obvious spots first",
    items: [
      "Smoke detectors, especially ones placed unusually low or aimed at a bed",
      "Air purifiers, alarm clocks, picture frames, mirrors, decorative plants",
      "USB chargers and power adapters plugged in near the bed or shower",
      "Vents, speakers, and any object with a small dark dot the size of a pencil tip",
    ],
  },
  {
    area: "Sweep the room with a flashlight in the dark",
    items: [
      "Turn off all lights and close the curtains",
      "Use a flashlight (phone torch works) and slowly sweep across surfaces from eye level",
      "A camera lens reflects a sharp, repeatable glint — different from glass or metal",
      "Inspect any glint up close: lift, twist, or unscrew the object if you can",
    ],
  },
  {
    area: "Use your phone's front camera to find IR LEDs",
    items: [
      "Open your phone's front-facing camera (not the rear — most rear cameras filter IR)",
      "Turn off the room lights. Point it at smoke detectors, vents, clocks, frames",
      "Night-vision cameras emit faint purple/white dots that are invisible to the eye but visible to your phone sensor",
      "If you see steady IR dots from an object that should not have a camera, treat it as a finding",
    ],
  },
  {
    area: "Check for cameras that don't use the WiFi",
    items: [
      "4G/LTE cameras have a SIM card and bypass the host network entirely — SafeStay cannot see them",
      "Look for objects with an unusual second power cable, or a small antenna nub",
      "SD-card recorders need no network at all — they just store video locally",
      "If you find a device you cannot explain, document it before touching it further",
    ],
  },
];

const POST_DETECTION_STEPS = [
  {
    area: "1. The host (per published safety reporting)",
    items: [
      "Widely-cited safety articles describe on-site confrontation as a common source of escalation, particularly for travellers far from home.",
      "Published accounts also describe unplugging or moving suspected devices as a frequent cause of lost evidence — one photo of the device in place is typically preserved first.",
      "Accusatory messaging from inside the unit is commonly described as counter-productive in the same accounts.",
    ],
  },
  {
    area: "2. Documentation (per Airbnb's resolution flow)",
    items: [
      "Airbnb's resolution submissions typically request timestamped photos and short video showing the device's location.",
      "SafeStay can export an HTML report (press 'e' in the app) that can be attached as one piece of evidence among others.",
      "The listing URL, host name, and exact check-in/check-out times are commonly requested.",
    ],
  },
  {
    area: "3. Local authorities (per Airbnb's guidance)",
    items: [
      "Airbnb's published guidance directs guests to contact local police before contacting Airbnb support.",
      "Police reports typically generate a reference number; Airbnb's resolution team commonly asks for it.",
      "Outside one's home country, the non-emergency police line varies by city — local search results are usually more accurate than 911.",
    ],
  },
  {
    area: "4. Airbnb's resolution centre",
    items: [
      "Per Airbnb's policy, hidden cameras anywhere inside a listing have been prohibited since April 2024.",
      "Per Airbnb's published terms, reporting within 72 hours of discovery is associated with eligibility for refund and rebooking.",
      "Typical submission contents per Airbnb's flow: photos, police report number, any scan report or evidence.",
    ],
  },
];

const LIMITS = [
  "Cameras on a 4G/LTE SIM card are invisible to any WiFi scan",
  "AP / client isolation hides every other device on the network from this tool",
  "Cameras that only write to an SD card and never go online cannot be detected",
  "Modern hidden cameras often run unbranded firmware on commodity chips (Tuya, ESP32, Anyka, Ingenic) — they may not match any known vendor",
  "This tool is a starting point, not a guarantee. Always pair it with a physical sweep",
];

const DOWNLOAD_LINKS = [
  { label: "macOS (Apple Silicon)", file: "safestay-darwin-arm64" },
  { label: "macOS (Intel)", file: "safestay-darwin-amd64" },
  { label: "Linux (x86_64)", file: "safestay-linux-amd64" },
  { label: "Linux (ARM64)", file: "safestay-linux-arm64" },
];

const RELEASES_BASE =
  "https://github.com/Cuzeth/airbnb-safety-tools/releases/latest/download";
const REPO_URL = "https://github.com/Cuzeth/airbnb-safety-tools";
const DISCLAIMER_URL =
  "https://github.com/Cuzeth/airbnb-safety-tools/blob/main/DISCLAIMER.md";
const OUI_DB_URL =
  "https://github.com/Cuzeth/airbnb-safety-tools/blob/main/internal/oui/oui.go";
const AIRBNB_HELP_URL = "https://www.airbnb.com/help/article/3061";
const INSTALL_CMD =
  "curl -fsSL https://raw.githubusercontent.com/Cuzeth/airbnb-safety-tools/main/install.sh | bash";

function normalizeMAC(input: string): string {
  const cleaned = input.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
  if (cleaned.length < 6) return "";
  const octets = cleaned.match(/.{2}/g);
  if (!octets || octets.length < 3) return "";
  return `${octets[0]}:${octets[1]}:${octets[2]}`;
}

export default function SafeStay() {
  const [ouiData, setOuiData] = useState<OUIData | null>(null);
  const [macInput, setMacInput] = useState("");
  const [lookupResult, setLookupResult] = useState<{
    vendor: string;
    risk: "high" | "medium" | "none";
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/data/safestay/oui-camera.json")
      .then((r) => r.json())
      .then((data: OUIData) => setOuiData(data))
      .catch(() => {});
  }, []);

  const lookupMAC = useCallback(
    (value: string) => {
      setMacInput(value);
      if (!ouiData) return;

      const prefix = normalizeMAC(value);
      if (!prefix) {
        setLookupResult(null);
        return;
      }

      const cameraVendor = ouiData.camera[prefix];
      if (cameraVendor) {
        setLookupResult({ vendor: cameraVendor, risk: "high" });
        return;
      }

      const chipsetVendor = ouiData.chipset[prefix];
      if (chipsetVendor) {
        setLookupResult({ vendor: chipsetVendor, risk: "medium" });
        return;
      }

      setLookupResult({ vendor: "", risk: "none" });
    },
    [ouiData],
  );

  const copyInstall = useCallback(() => {
    navigator.clipboard?.writeText(INSTALL_CMD).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  }, []);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      {/* ── Legal Notice ── */}
      <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/[0.03] px-4 py-4 text-xs leading-6">
        <p className="font-bold uppercase tracking-[0.18em] text-yellow-400/90">
          Legal Notice — read before using
        </p>
        <p className="mt-2 text-[var(--text)] opacity-80">
          SafeStay is provided <strong>AS IS</strong>, with <strong>NO WARRANTY</strong>{" "}
          and <strong>NO LIABILITY</strong> of any kind. It is{" "}
          <strong>NOT legal advice</strong>. The author does{" "}
          <strong>not condone, encourage, or recommend</strong> its use against
          any network, device, host, or person.
        </p>
        <p className="mt-2 text-[var(--text)] opacity-80">
          Network scanning may be illegal or restricted under the laws of your
          jurisdiction and the terms of service of the network you are connected
          to. <strong>You alone are responsible</strong> for confirming you have
          lawful authorization to scan, before you scan.
        </p>
        <p className="mt-2 text-[var(--text)] opacity-80">
          SafeStay is{" "}
          <strong>not affiliated with Airbnb, any hotel chain, or any camera vendor</strong>.
          Vendor names appear as technical references only. If you believe a
          crime has occurred, contact local law enforcement and a licensed
          attorney — not this tool.
        </p>
        <p className="mt-3 text-[var(--text)] opacity-70">
          By downloading or using this tool you agree to the full{" "}
          <a
            href={DISCLAIMER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--heading)] underline decoration-yellow-500/40 underline-offset-2 transition-colors hover:decoration-yellow-500/80"
          >
            DISCLAIMER
          </a>
          . If you do not agree, do not use this software.
        </p>
      </div>

      {/* ── Section 1: Install ── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-bold tracking-[-0.02em] text-[var(--heading)]">
          Install
        </h2>
        <p className="text-sm leading-7 text-[var(--text)]">
          SafeStay scans your local WiFi network, identifies devices by
          manufacturer, probes camera-specific ports (RTSP, ONVIF, Tuya P2P,
          MQTT-TLS, debug backdoors), and flags suspicious devices with risk
          levels. It also ships an in-app physical-check guide for the cameras
          a network scan cannot see (4G/SIM, SD-card-only, separate VLAN).
          Runs entirely on your machine.
        </p>

        <div className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-graphite)]">
            One-liner (macOS &amp; Linux)
          </p>
          <div className="flex items-center justify-between gap-3">
            <pre className="min-w-0 flex-1 overflow-x-auto text-xs leading-6 text-[var(--text)]">
              <code>{INSTALL_CMD}</code>
            </pre>
            <button
              type="button"
              onClick={copyInstall}
              className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text)] transition-colors hover:border-white/[0.18] hover:text-[var(--heading)]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-xs leading-5 text-[var(--text)] opacity-50">
            Installs to <code>~/.local/bin</code>. Never asks for sudo. Inspect
            the script before running it.
          </p>
        </div>

        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-graphite)]">
          Or download a prebuilt binary
        </p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DOWNLOAD_LINKS.map((dl) => (
            <a
              key={dl.file}
              href={`${RELEASES_BASE}/${dl.file}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-[var(--text)] transition-colors duration-200 hover:border-white/[0.16] hover:text-[var(--heading)]"
            >
              <span>{dl.label}</span>
              <svg
                className="h-4 w-4 shrink-0 opacity-40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-graphite)]">
            After install
          </p>
          <pre className="overflow-x-auto text-xs leading-6 text-[var(--text)]">
            <code>{`sudo safestay        # best results (enables ARP scanning)\nsafestay             # unprivileged fallback\nsafestay --disclaimer  # full legal notice`}</code>
          </pre>
          <p className="text-xs leading-5 text-[var(--text)] opacity-50">
            Press <code className="rounded bg-white/[0.06] px-1">?</code> inside
            the app at any time for the in-app safety guide — physical-check
            checklist, what to do if you found something, and limits.
          </p>
        </div>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-xs text-[var(--text)] opacity-50 transition-opacity hover:opacity-80"
        >
          View source on GitHub &rarr;
        </a>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Section 2: MAC Address Lookup ── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-bold tracking-[-0.02em] text-[var(--heading)]">
          MAC Address Lookup
        </h2>
        <p className="text-sm leading-7 text-[var(--text)]">
          Quick check against 150+ camera manufacturer OUI prefixes from
          the{" "}
          <a
            href={OUI_DB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--heading)] underline decoration-white/20 underline-offset-2 transition-colors hover:decoration-white/40"
          >
            SafeStay OUI database
          </a>
          . For comprehensive detection with port scanning, risk assessment, and
          the physical-check guide, install the full scanner above.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={macInput}
            onChange={(e) => lookupMAC(e.target.value)}
            placeholder="e.g. 00:BC:99:1A:2B:3C"
            spellCheck={false}
            autoComplete="off"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 font-mono text-sm text-[var(--heading)] placeholder:text-[var(--text)] placeholder:opacity-30 focus:border-white/[0.2] focus:outline-none"
          />

          {lookupResult && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                lookupResult.risk === "high"
                  ? "border-red-500/30 bg-red-500/[0.06] text-red-400"
                  : lookupResult.risk === "medium"
                    ? "border-yellow-500/30 bg-yellow-500/[0.06] text-yellow-400"
                    : "border-green-500/30 bg-green-500/[0.06] text-green-400"
              }`}
            >
              {lookupResult.risk === "high" && (
                <>
                  <span className="font-bold">
                    Known camera manufacturer: {lookupResult.vendor}
                  </span>
                  <p className="mt-1 opacity-80">
                    This MAC prefix is registered to a surveillance/camera
                    company. If you didn&apos;t expect a camera on this network,
                    investigate further. Major consumer brands (Ring, Nest,
                    Wyze, Arlo, Eufy, Tapo) must be disclosed by Airbnb hosts —
                    check the listing.
                  </p>
                </>
              )}
              {lookupResult.risk === "medium" && (
                <>
                  <span className="font-bold">
                    IoT/SoC vendor: {lookupResult.vendor}
                  </span>
                  <p className="mt-1 opacity-80">
                    This chipset is commonly found inside hidden cameras and IoT
                    devices. Not definitive on its own, but worth investigating —
                    especially if combined with camera-streaming ports being
                    open.
                  </p>
                </>
              )}
              {lookupResult.risk === "none" && (
                <span>
                  No known camera manufacturer match for this MAC prefix. This
                  does <strong>not</strong> mean the device is safe — modern
                  hidden cameras frequently use unregistered or randomized MAC
                  addresses precisely so they don&apos;t appear in vendor
                  databases.
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Section 3: Physical Check ── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-bold tracking-[-0.02em] text-[var(--heading)]">
          Physical Check
        </h2>
        <p className="text-sm leading-7 text-[var(--text)]">
          Network scanning misses an entire class of threats: cameras on a
          separate VLAN, cameras with a 4G/LTE SIM, SD-card-only recorders, and
          anything an AP-isolated network hides from a scanner. Do this
          60-second sweep in addition to the scan — you can do it from your
          phone if you can&apos;t install the tool right now.
        </p>

        <div className="flex flex-col gap-6">
          {PHYSICAL_CHECK.map((group) => (
            <div key={group.area} className="flex flex-col gap-2">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-graphite)]">
                {group.area}
              </h3>
              <ul className="flex flex-col gap-1.5 pl-1">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-7 text-[var(--text)]"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Section 4: If You Found Something ── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-bold tracking-[-0.02em] text-[var(--heading)]">
          If You Found Something
        </h2>
        <p className="text-sm leading-7 text-[var(--text)]">
          The list below summarises Airbnb&apos;s own published guidance and
          widely-cited safety reporting.{" "}
          <strong>It is not advice from this software&apos;s author.</strong>{" "}
          Personal-safety decisions are yours alone — for those, contact local
          authorities and a licensed attorney in the relevant jurisdiction.
        </p>

        <div className="flex flex-col gap-6">
          {POST_DETECTION_STEPS.map((step) => (
            <div key={step.area} className="flex flex-col gap-2">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-graphite)]">
                {step.area}
              </h3>
              <ul className="flex flex-col gap-1.5 pl-1">
                {step.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-7 text-[var(--text)]"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <a
          href={AIRBNB_HELP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start text-xs text-[var(--text)] opacity-60 transition-opacity hover:opacity-90"
        >
          Airbnb&apos;s help article on security cameras &rarr;
        </a>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Section 5: What This Tool Cannot See ── */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold tracking-[-0.02em] text-[var(--heading)]">
          What This Tool Cannot See
        </h2>
        <p className="text-sm leading-7 text-[var(--text)]">
          A clean network scan is not a guarantee. SafeStay covers one slice
          of the threat surface — these are the parts it doesn&apos;t.
        </p>
        <ul className="flex flex-col gap-1.5 pl-1">
          {LIMITS.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-7 text-[var(--text)]"
            >
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/20" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
