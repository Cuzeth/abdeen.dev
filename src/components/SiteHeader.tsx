import Link from "next/link";

/** Sticky pill navigation: brand lockup, section anchors, GitHub, jaafar.cv. */
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full px-4 py-4 md:px-8" role="banner">
      <nav
        className="site-nav surface-card mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-3 py-1.5 backdrop-blur-xl md:px-4 md:py-2"
        aria-label="Main"
      >
        <Link
          href="/"
          className="group flex min-h-10 min-w-0 items-center gap-3 rounded-full px-2 py-1.5 transition-opacity hover:opacity-90"
          aria-label="Abdeen Labs · Home"
        >
          <span
            aria-hidden="true"
            className="brand-mark shrink-0 text-[26px] leading-none text-[var(--mark-default)] md:text-[30px]"
          >
            عابدين
          </span>
          <span className="brand-wordmark shrink-0 text-[10px] text-[var(--color-paper)] md:text-[11px]">
            Abdeen Labs
          </span>
        </Link>

        <div className="flex items-center gap-1.5 md:gap-2">
          <Link
            href="/#apps"
            className="hidden rounded-full px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)] transition-colors duration-200 hover:text-[var(--color-paper)] md:block"
          >
            Apps
          </Link>
          <Link
            href="/#tools"
            className="hidden rounded-full px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)] transition-colors duration-200 hover:text-[var(--color-paper)] md:block"
          >
            Tools
          </Link>
          <span
            aria-hidden="true"
            className="hidden h-4 w-px bg-white/[0.1] md:block"
          />
          <a
            href="https://github.com/Cuzeth"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cuzeth on GitHub"
            className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-[var(--color-graphite)] transition-colors duration-200 hover:bg-white/[0.04] hover:text-[var(--color-paper)]"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
          </a>
          <a
            href="https://jaafar.cv"
            target="_blank"
            rel="noopener noreferrer"
            className="eyebrow transition-colors duration-200 hover:border-white/20 hover:text-[var(--color-paper)]"
          >
            jaafar.cv
          </a>
        </div>
      </nav>
    </header>
  );
}
