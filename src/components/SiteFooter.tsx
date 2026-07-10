import Link from "next/link";
import { apps, tools } from "@/lib/catalog";

/** Structured footer: brand column plus Apps / Web tools / Elsewhere nav,
 *  all rendered from the catalog. */
export default function SiteFooter() {
  return (
    <footer className="w-full px-4 pb-8 pt-10 md:px-8 md:pb-12 md:pt-16" role="contentinfo">
      <div className="mx-auto w-full max-w-6xl border-t border-white/[0.08] pt-8 md:pt-12">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="brand-mark text-[26px] leading-none text-[var(--mark-default)]"
              >
                عابدين
              </span>
              <span className="brand-wordmark text-[10px] text-[var(--color-paper)]">
                Abdeen Labs
              </span>
            </div>
            <p className="max-w-xs text-sm leading-7 text-[var(--text)]">
              Small tools, carefully engineered. Free, open source, and
              private by default.
            </p>
          </div>
          <nav aria-label="Apps" className="flex flex-col gap-3">
            <h2 className="eyebrow-system">
              <span aria-hidden="true" className="text-[var(--color-red)]">
                /
              </span>
              Apps
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-[var(--text)]">
              {apps.map((app) => (
                <li key={app.href}>
                  {app.external ? (
                    <a
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                    >
                      {app.title} ↗
                    </a>
                  ) : (
                    <Link
                      href={app.href}
                      className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                    >
                      {app.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Web tools" className="flex flex-col gap-3">
            <h2 className="eyebrow-system">
              <span aria-hidden="true" className="text-[var(--color-red)]">
                /
              </span>
              Web tools
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-[var(--text)]">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                  >
                    {tool.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Elsewhere" className="flex flex-col gap-3">
            <h2 className="eyebrow-system">
              <span aria-hidden="true" className="text-[var(--color-red)]">
                /
              </span>
              Elsewhere
            </h2>
            <ul className="flex flex-col gap-2 text-sm text-[var(--text)]">
              <li>
                <a
                  href="https://github.com/Cuzeth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href="https://jaafar.cv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200 hover:text-[var(--color-paper)]"
                >
                  jaafar.cv ↗
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6 md:mt-12">
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)]">
            &copy; {new Date().getFullYear()} Jaafar Abdeen
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-graphite)] opacity-70">
            An Abdeen Labs property
          </span>
        </div>
      </div>
    </footer>
  );
}
