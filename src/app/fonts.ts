import localFont from "next/font/local";

// Body, UI, display. Weights 400–700. Never 300 — brand rule #12.
export const switzer = localFont({
  variable: "--font-switzer",
  display: "swap",
  src: [
    { path: "../../public/fonts/switzer/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-Italic.woff2", weight: "400", style: "italic" },
    { path: "../../public/fonts/switzer/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../../public/fonts/switzer/Switzer-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-Bold.woff2", weight: "700", style: "normal" },
  ],
});

// IBM Plex Sans — wordmark only (brand rule #5). `display: block` because
// FOUT on the logo reads worse than a brief blank.
export const plexSans = localFont({
  variable: "--font-plex",
  display: "block",
  src: [
    {
      path: "../../public/fonts/brand/IBMPlexSans-Variable.ttf",
      weight: "100 700",
      style: "normal",
    },
  ],
});

// Aref Ruqaa — the Arabic calligraphic mark. Nowhere else.
export const arefRuqaa = localFont({
  variable: "--font-aref",
  display: "block",
  src: [
    {
      path: "../../public/fonts/brand/ArefRuqaa-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const jetbrainsMono = localFont({
  variable: "--font-jetbrains-mono",
  display: "swap",
  src: [
    { path: "../../public/fonts/brand/JetBrainsMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/brand/JetBrainsMono-Medium.ttf", weight: "500", style: "normal" },
  ],
});
