import type { ReactNode } from "react";
import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";

interface ToolPageShellProps {
  title: string;
  description: string;
  /** Mono system label shown top-right (e.g. the route "/qr"). */
  eyebrow?: string;
  /** Widen the shell for tools that lay out two panes internally. */
  wide?: boolean;
  children: ReactNode;
}

export default function ToolPageShell({
  title,
  description,
  eyebrow,
  wide = false,
  children,
}: ToolPageShellProps) {
  return (
    <div
      className={`mx-auto flex w-full flex-col gap-6 pb-16 pt-4 md:gap-8 md:pb-24 md:pt-8 ${
        wide ? "max-w-5xl" : "max-w-3xl"
      }`}
    >
      <FadeInWrapper direction="up">
        <section className="surface-ink-elev overflow-hidden rounded-[1.25rem] md:rounded-[1.75rem]">
          {/* Meta bar — ties the page back to the homepage system */}
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3 md:px-7">
            <Link
              href="/"
              className="eyebrow-system transition-colors duration-200 hover:text-[var(--color-paper)]"
            >
              <span aria-hidden="true" className="text-[var(--color-red)]">
                &larr;
              </span>
              abdeen.dev
            </Link>
            {eyebrow && <span className="eyebrow-system">{eyebrow}</span>}
          </div>

          {/* Title block */}
          <div className="px-5 py-5 md:px-7 md:py-6">
            <h1 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--color-paper)] md:text-[1.7rem]">
              {title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--text)]">
              {description}
            </p>
          </div>

          {/* Body */}
          <div className="border-t border-white/[0.06] px-5 py-6 md:px-7 md:py-8">
            {children}
          </div>
        </section>
      </FadeInWrapper>
    </div>
  );
}
