import type { Metadata } from "next";
import ToolPageShell from "@/components/ToolPageShell";
import SafeStay from "./SafeStay";

export const metadata: Metadata = {
  title: "SafeStay Scanner",
  description:
    "Detect hidden cameras at Airbnbs, hotels, and rentals. Install the network scanner with one command, look up MAC addresses against 150+ camera manufacturers, run the physical-check guide, and follow the post-detection script if you find something.",
  alternates: { canonical: "https://abdeen.dev/safestay" },
  openGraph: {
    title: "SafeStay Scanner | abdeen.dev",
    description:
      "Hidden-camera detection toolkit — network scanner, MAC address lookup, physical-check guide, and what-to-do-next script for Airbnbs and rentals.",
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
