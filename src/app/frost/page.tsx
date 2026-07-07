import type { Metadata } from "next";
import Frost from "./Frost";

export const metadata: Metadata = {
  title: "Frost",
  description:
    "A macOS menu-bar input locker. Freezes the keyboard, mouse, and trackpad while keeping the display visible. Unlocks with TouchID or, optionally, a paired Apple Watch.",
  alternates: { canonical: "https://abdeen.dev/frost" },
  openGraph: {
    title: "Frost | abdeen.dev",
    description:
      "A macOS menu-bar input locker. Freezes input while the screen stays visible. Unlocks with TouchID or Apple Watch.",
    url: "https://abdeen.dev/frost",
  },
};

export default function FrostPage() {
  return <Frost />;
}
