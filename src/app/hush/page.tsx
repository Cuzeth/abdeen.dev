import type { Metadata } from "next";
import Hush from "./Hush";

export const metadata: Metadata = {
  title: "Hush",
  description:
    "Focus sounds for iOS. Real-time noise generators, binaural beats, and 80+ ambient sounds in a distraction-free interface.",
  alternates: { canonical: "https://abdeen.dev/hush" },
  openGraph: {
    title: "Hush | abdeen.dev",
    description:
      "Focus sounds for iOS. Noise generators, binaural beats, and 80+ ambient sounds.",
    url: "https://abdeen.dev/hush",
  },
};

export default function HushPage() {
  return <Hush />;
}
