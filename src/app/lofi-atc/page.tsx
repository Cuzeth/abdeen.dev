import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageShell from "@/components/ToolPageShell";
import LofiAtcRadio from "./LofiAtcRadio";

// DISABLED: flip to `true` to re-enable the Lo-fi ATC Radio tool.
// Also restore the disabled entries in:
//   - src/app/page.tsx           (tools array)
//   - src/app/sitemap.ts         (sitemap entry)
//   - src/app/layout.tsx         (JSON-LD WebApplication entry)
const ENABLED = false;

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
      title="Lo-fi ATC Radio"
      description="Lo-fi beats + live JFK Tower air-traffic control. Two streams, two sliders."
    >
      <LofiAtcRadio />
    </ToolPageShell>
  );
}
