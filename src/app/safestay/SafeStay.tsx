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
const OUI_DB_URL =
  "https://github.com/Cuzeth/airbnb-safety-tools/blob/main/internal/oui/oui.go";
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
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
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
          a network scan cannot see (4G/SIM, SD-card-only, separate VLAN). Runs
          entirely on your machine.
        </p>
        <p className="text-xs leading-6 text-[var(--text)] opacity-50">
          Hobby project. MIT-licensed, AS IS, no warranty, no liability. Not
          legal advice. Network scanning may be illegal where you are — that&apos;s
          on you to check before running it.
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
            Installs to <code>~/.local/bin</code> and verifies the binary
            against the release&apos;s SHA-256 checksums before installing.
            Never asks for sudo. Inspect the script before running it.
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
            <code>{`sudo safestay  # best results (raw ICMP fills the ARP cache)\nsafestay       # unprivileged fallback (TCP/UDP probes only)`}</code>
          </pre>
          <p className="text-xs leading-5 text-[var(--text)] opacity-50">
            Press <code className="rounded bg-white/[0.06] px-1">?</code> inside
            the app at any time for the physical-check guide and the limits of
            what a network scan can see.
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
          </a>{" "}
          (derived from the IEEE MA-L public registry). Vendor labels are
          technical references, not confirmed identifications — MAC addresses
          can be spoofed and OUI assignments can be reused. For full detection
          with port scanning, risk assessment, and the physical-check guide,
          install the scanner above.
        </p>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={macInput}
            onChange={(e) => lookupMAC(e.target.value)}
            placeholder="e.g. 00:BC:99:1A:2B:3C"
            spellCheck={false}
            autoComplete="off"
            className="input input-mono"
          />

          {lookupResult && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm ${
                lookupResult.risk === "high"
                  ? "border-[rgba(204,27,27,0.4)] bg-[rgba(204,27,27,0.08)] text-[var(--color-paper)]"
                  : lookupResult.risk === "medium"
                    ? "border-white/15 bg-white/[0.04] text-[var(--color-paper)]"
                    : "border-white/[0.08] bg-white/[0.02] text-[var(--color-graphite)]"
              }`}
            >
              {lookupResult.risk === "high" && (
                <>
                  <span className="font-bold">
                    OUI registered to: {lookupResult.vendor}
                  </span>
                  <p className="mt-1 opacity-80">
                    This MAC prefix is registered to a surveillance or camera
                    company. That is not, on its own, proof of what the
                    physical device actually is — MACs can be spoofed and OUI
                    assignments can be reused. If a major-brand camera shows
                    up that you didn&apos;t expect, it may be a legitimately
                    disclosed device — check the listing.
                  </p>
                </>
              )}
              {lookupResult.risk === "medium" && (
                <>
                  <span className="font-bold">
                    OUI registered to chipset vendor: {lookupResult.vendor}
                  </span>
                  <p className="mt-1 opacity-80">
                    This chipset is commonly found inside hidden cameras and
                    IoT devices, but also inside many legitimate ones. Not
                    definitive on its own — worth investigating only if
                    combined with camera-streaming ports being open.
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

      {/* ── Section 4: What This Tool Cannot See ── */}
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

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Footer notice ── */}
      <section className="flex flex-col gap-4">
        <p className="text-sm leading-7 text-[var(--text)] opacity-70">
          Hobby project. MIT-licensed, AS IS, no warranty, no liability. Not
          legal advice. Detection is heuristic — false positives and false
          negatives are expected. Network scanning may be illegal where you
          are; confirming you have authorization is on you.
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[var(--text)] opacity-50">
          <a
            href={`${REPO_URL}/blob/main/LICENSE`}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            License
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            Source
          </a>
        </div>
      </section>
    </div>
  );
}
