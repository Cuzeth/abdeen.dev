import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import LofiAtcRadio from "./LofiAtcRadio";

export const metadata: Metadata = {
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
};

export default function LofiAtcPage() {
  return (
    <ToolPageShell
      title="Lo-fi ATC Radio"
      description="Lo-fi beats + live JFK Tower air-traffic control. Two streams, two sliders."
    >
      <LofiAtcRadio />
    </ToolPageShell>
  );
}
