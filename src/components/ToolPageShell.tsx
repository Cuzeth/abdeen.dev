import type { ReactNode } from "react";
import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";
import { relatedTools } from "@/lib/catalog";

interface ToolPageShellProps {
  title: string;
  description: string;
  /** Mono system label shown top-right (e.g. the route "/qr"). */
  eyebrow?: string;
  /** Catalog href of this tool — keys the "Continue exploring" rotation. */
  currentPath?: string;
  /** Widen the shell for tools that lay out two panes internally. */
  wide?: boolean;
  children: ReactNode;
}

export default function ToolPageShell({
  title,
  description,
  eyebrow,
  currentPath,
  wide = false,
  children,
}: ToolPageShellProps) {
  return (
    <div
      className={`mx-auto flex w-full flex-col gap-6 pb-16 pt-4 md:gap-8 md:pb-24 md:pt-8 ${
        wide ? "max-w-5xl" : "max-w-3xl"
      }`}
    >
      <FadeInWrapper direction="up" eager>
        <section className="tool-shell surface-ink-elev overflow-hidden rounded-[1.25rem] md:rounded-[1.75rem]">
          {/* Meta bar — ties the page back to the homepage system */}
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-5 py-3.5 md:px-8">
            <Link
              href="/#tools"
              className="eyebrow-system transition-colors duration-200 hover:text-[var(--color-paper)]"
            >
              <span aria-hidden="true" className="text-[var(--color-red)]">
                &larr;
              </span>
              All tools
            </Link>
            {eyebrow && <span className="eyebrow-system">{eyebrow}</span>}
          </div>

          {/* Title block */}
          <div className="px-5 py-6 md:px-8 md:py-8">
            <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.025em] text-[var(--color-paper)] md:text-[2.15rem]">
              {title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text)] md:text-[0.95rem]">
              {description}
            </p>
          </div>

          {/* Body */}
          <div className="border-t border-white/[0.06] px-5 py-7 md:px-8 md:py-9">
            {children}
          </div>
        </section>
      </FadeInWrapper>

      {/* Cross-navigation — keeps every tool one click from the next */}
      <FadeInWrapper direction="up" delay={0.08}>
        <nav
          aria-label="More tools"
          className="px-1"
        >
          <div className="mb-4 flex items-center justify-between gap-4">
            <span className="eyebrow-system">
              <span aria-hidden="true" className="text-[var(--color-red)]">/</span>
              Continue exploring
            </span>
            <Link
              href="/#tools"
              className="eyebrow-system transition-colors duration-200 hover:text-[var(--color-paper)]"
            >
              View all <span aria-hidden="true" className="index-arrow">&rarr;</span>
            </Link>
          </div>
          <div className="related-index">
            {relatedTools(currentPath ?? "").map((tool, index) => (
              <Link key={tool.href} href={tool.href} className="related-link">
                <span aria-hidden="true" className="index-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-medium tracking-[-0.01em] text-[var(--color-paper)]">
                  {tool.title}
                </span>
                <span aria-hidden="true" className="index-arrow ml-auto">&rarr;</span>
              </Link>
            ))}
          </div>
        </nav>
      </FadeInWrapper>
    </div>
  );
}
