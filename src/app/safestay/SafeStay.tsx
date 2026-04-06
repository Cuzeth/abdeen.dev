"use client";

import { useState, useEffect, useCallback } from "react";

interface OUIData {
  camera: Record<string, string>;
  chipset: Record<string, string>;
}

const CHECKLIST_ITEMS = [
  {
    area: "Bedroom & Living Areas",
    items: [
      "Check smoke detectors — real ones don't have tiny lenses or extra LEDs",
      "Inspect alarm clocks and digital displays for pinholes or camera lenses",
      "Look behind wall art and mirrors for devices or wiring",
      "Check USB chargers and power adapters — some contain hidden cameras",
      "Scan air purifiers, Bluetooth speakers, and decorative objects",
      "Look for tiny holes in walls, ceilings, and shelving",
    ],
  },
  {
    area: "Bathroom",
    items: [
      "Check toiletry containers, tissue boxes, and soap dispensers",
      "Inspect the showerhead and any ceiling fixtures",
      "Look for devices behind towel hooks or wall-mounted accessories",
      "Examine electrical outlets and night lights",
    ],
  },
  {
    area: "Network & Tech",
    items: [
      "Run SafeStay Scanner on the WiFi network",
      "Check the router for unfamiliar connected devices",
      "Look for hidden Ethernet cables running to unexpected locations",
      "Note any devices with blinking LEDs you can't identify",
    ],
  },
  {
    area: "Quick Tests",
    items: [
      "Turn off all lights and look for faint LED glows",
      "Use your phone camera to detect infrared LEDs (appear purple/white on screen)",
      "Scan for unknown Bluetooth devices in your phone's settings",
      "Check if the WiFi network has unfamiliar device names",
    ],
  },
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

  return (
    <div className="flex w-full max-w-2xl flex-col gap-10">
      {/* ── Disclaimer ── */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-xs leading-6 text-[var(--text)] opacity-60">
        <p>
          This tool is intended for personal safety use only — to check for
          hidden cameras in spaces you are staying in (your Airbnb, hotel
          room, rental, etc.). Do not use this on networks you do not have
          authorization to scan. Unauthorized network scanning may violate
          local laws and terms of service.
        </p>
        <p className="mt-2">
          This tool is provided as-is, without warranty of any kind. The
          author assumes no liability for any damages, legal consequences, or
          losses arising from the use or misuse of this software. By
          downloading or using this tool, you accept full responsibility for
          your actions and agree that the author is not responsible for how it
          is used. Use at your own risk.
        </p>
      </div>

      {/* ── Section 1: Download ── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-bold tracking-[-0.02em] text-[var(--heading)]">
          Download
        </h2>
        <p className="text-sm leading-7 text-[var(--text)]">
          SafeStay scans your local WiFi network, identifies devices by
          manufacturer, checks for camera-specific ports (RTSP, P2P, telnet
          backdoors), and flags suspicious devices with risk levels. Runs
          entirely on your machine.
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
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text)] opacity-50">
            After downloading
          </p>
          <pre className="overflow-x-auto text-xs leading-6 text-[var(--text)]">
            <code>{`chmod +x safestay\nsudo ./safestay`}</code>
          </pre>
          <p className="text-xs leading-5 text-[var(--text)] opacity-50">
            Run with sudo for ARP scanning (finds more devices). Without sudo,
            falls back to nmap ping scan (requires nmap installed).
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
          . For a more comprehensive search with port scanning and risk
          assessment, download the full scanner above.
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
                    investigate further.
                  </p>
                </>
              )}
              {lookupResult.risk === "medium" && (
                <>
                  <span className="font-bold">
                    IoT chipset vendor: {lookupResult.vendor}
                  </span>
                  <p className="mt-1 opacity-80">
                    This chipset is commonly found inside hidden cameras and IoT
                    devices. Not definitive, but worth investigating.
                  </p>
                </>
              )}
              {lookupResult.risk === "none" && (
                <span>
                  No known camera manufacturer match for this MAC prefix. This
                  doesn&apos;t guarantee it&apos;s safe — some devices use
                  randomized MACs.
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="border-t border-white/[0.06]" />

      {/* ── Section 3: Physical Inspection Guide ── */}
      <section className="flex flex-col gap-4">
        <h2 className="text-base font-bold tracking-[-0.02em] text-[var(--heading)]">
          Physical Inspection Guide
        </h2>
        <p className="text-sm leading-7 text-[var(--text)]">
          A network scan only catches devices on WiFi. Use this guide to
          physically inspect your space for cameras that may be offline,
          hardwired, or recording to local storage.
        </p>

        <div className="flex flex-col gap-6">
          {CHECKLIST_ITEMS.map((group) => (
            <div key={group.area} className="flex flex-col gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--text)] opacity-50">
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
    </div>
  );
}
