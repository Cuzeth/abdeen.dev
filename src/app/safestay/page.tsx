import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "@/components/ToolPageShell";
import { entryEnabled } from "@/lib/catalog";
import SafeStay from "./SafeStay";

// Toggled via `enabled` on the /safestay entry in src/lib/catalog.ts, which
// also drives the homepage index, footer, sitemap, and JSON-LD at once.
// (The layout keywords list keeps two SafeStay terms commented separately.)
const ENABLED = entryEnabled("/safestay");

export const metadata: Metadata = ENABLED
  ? {
      title: "SafeStay Scanner",
      description:
        "Detect hidden cameras at Airbnbs, hotels, and rentals. Install the network scanner with one command, look up MAC addresses against a curated camera-manufacturer OUI table, and run the physical-check guide.",
      alternates: { canonical: "https://abdeen.dev/safestay" },
      openGraph: {
        title: "SafeStay Scanner | abdeen.dev",
        description:
          "Hidden-camera detection toolkit: network scanner, MAC address lookup, and physical-check guide for Airbnbs and rentals.",
        url: "https://abdeen.dev/safestay",
      },
    }
  : { robots: { index: false, follow: false } };

export default function SafeStayPage() {
  if (!ENABLED) notFound();

  return (
    <ToolPageShell
      eyebrow="/safestay"
      currentPath="/safestay"
      title="SafeStay Scanner"
      description="Detect hidden cameras and suspicious devices at Airbnbs, hotels, and rentals."
    >
      <SafeStay />
    </ToolPageShell>
  );
}
