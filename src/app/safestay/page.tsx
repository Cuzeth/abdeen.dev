import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "@/components/ToolPageShell";
import SafeStay from "./SafeStay";

// DISABLED: flip to `true` to re-enable the SafeStay Scanner tool.
// Also restore the disabled entries in:
//   - src/app/page.tsx           (apps array)
//   - src/app/sitemap.ts         (sitemap entry)
//   - src/app/layout.tsx         (JSON-LD SoftwareApplication entry)
const ENABLED = false;

export const metadata: Metadata = ENABLED
  ? {
      title: "SafeStay Scanner",
      description:
        "Detect hidden cameras at Airbnbs, hotels, and rentals. Install the network scanner with one command, look up MAC addresses against a curated camera-manufacturer OUI table, and run the physical-check guide.",
      alternates: { canonical: "https://abdeen.dev/safestay" },
      openGraph: {
        title: "SafeStay Scanner | abdeen.dev",
        description:
          "Hidden-camera detection toolkit — network scanner, MAC address lookup, and physical-check guide for Airbnbs and rentals.",
        url: "https://abdeen.dev/safestay",
      },
    }
  : { robots: { index: false, follow: false } };

export default function SafeStayPage() {
  if (!ENABLED) notFound();

  return (
    <ToolPageShell
      eyebrow="/safestay"
      title="SafeStay Scanner"
      description="Detect hidden cameras and suspicious devices at Airbnbs, hotels, and rentals."
    >
      <SafeStay />
    </ToolPageShell>
  );
}
