import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import SafeStay from "./SafeStay";

export const metadata: Metadata = {
  title: "SafeStay Scanner",
  description:
    "Detect hidden cameras at Airbnbs, hotels, and rentals. Download the network scanner, look up MAC addresses against 150+ camera manufacturers, and use the physical inspection checklist.",
  alternates: { canonical: "https://abdeen.dev/safestay" },
  openGraph: {
    title: "SafeStay Scanner | abdeen.dev",
    description:
      "Hidden camera detection toolkit — network scanner, MAC address lookup, and safety checklist for Airbnbs and rentals.",
    url: "https://abdeen.dev/safestay",
  },
};

export default function SafeStayPage() {
  return (
    <ToolPageShell
      title="SafeStay Scanner"
      description="Detect hidden cameras and suspicious devices at Airbnbs, hotels, and rentals."
    >
      <SafeStay />
    </ToolPageShell>
  );
}
