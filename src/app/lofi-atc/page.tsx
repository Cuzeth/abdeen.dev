import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "@/components/ToolPageShell";
import { entryEnabled } from "@/lib/catalog";
import LofiAtcRadio from "./LofiAtcRadio";

// Toggled via `enabled` on the /lofi-atc entry in src/lib/catalog.ts, which
// also drives the homepage index, footer, sitemap, and JSON-LD at once.
const ENABLED = entryEnabled("/lofi-atc");

export const metadata: Metadata = ENABLED
  ? {
      title: "Lo-fi ATC Radio",
      description:
        "Lo-fi beats mixed with live JFK Tower air-traffic control radio. Two streams, two volume sliders, zero distractions.",
      alternates: { canonical: "https://abdeen.dev/lofi-atc" },
      openGraph: {
        title: "Lo-fi ATC Radio | abdeen.dev",
        description:
          "Lo-fi beats mixed with live JFK Tower air-traffic control radio.",
        url: "https://abdeen.dev/lofi-atc",
        type: "website",
      },
    }
  : { robots: { index: false, follow: false } };

export default function LofiAtcPage() {
  if (!ENABLED) notFound();

  return (
    <ToolPageShell
      currentPath="/lofi-atc"
      title="Lo-fi ATC Radio"
      description="Lo-fi beats + live JFK Tower air-traffic control. Two streams, two sliders."
    >
      <LofiAtcRadio />
    </ToolPageShell>
  );
}
