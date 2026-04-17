import Link from "next/link";
import type { Metadata } from "next";
import FadeInWrapper from "@/components/FadeInWrapper";

export const metadata: Metadata = {
  title: "Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] w-full max-w-3xl flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <FadeInWrapper direction="up">
        <span className="eyebrow">
          <span
            aria-hidden="true"
            className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]"
          />
          404 · Not Found
        </span>
      </FadeInWrapper>

      <FadeInWrapper direction="up" delay={0.05}>
        <h1 className="text-5xl font-bold tracking-[-0.06em] text-[var(--heading)] md:text-7xl">
          Nothing here<span className="text-[var(--accent)]">.</span>
        </h1>
      </FadeInWrapper>

      <FadeInWrapper direction="up" delay={0.1}>
        <p className="max-w-md text-base leading-relaxed text-[var(--text)] opacity-80 md:text-lg">
          This URL doesn&apos;t point to anything — moved, retired, or never
          shipped. Head back and see what&apos;s actually here.
        </p>
      </FadeInWrapper>

      <FadeInWrapper direction="up" delay={0.15}>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_28px_var(--accent-glow)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--accent-hover)]"
          >
            Back home
          </Link>
        </div>
      </FadeInWrapper>
    </div>
  );
}
