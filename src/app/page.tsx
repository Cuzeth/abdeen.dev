import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";
import SectionHeader from "@/components/SectionHeader";
import { apps, tools, type CatalogEntry } from "@/lib/catalog";

const principles = [
  {
    num: "01",
    title: "Free, forever",
    body: "Use every tool without a paywall, an account, an upsell, or an ad in the way.",
  },
  {
    num: "02",
    title: "Private by default",
    body: "Your inputs stay yours. The browser tools do their work on your device whenever possible.",
  },
  {
    num: "03",
    title: "Built in public",
    body: "The source is open on GitHub. Inspect the work, report a problem, or make it better.",
  },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function IndexRow({
  item,
  index,
  large = false,
}: {
  item: CatalogEntry;
  index: number;
  large?: boolean;
}) {
  const Tag = item.external ? "a" : Link;
  const externalProps = item.external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};
  const arrow = item.external ? "↗" : "→";

  return (
    <Tag
      href={item.href}
      className={`index-row grid-cols-[2.5rem_minmax(0,1fr)] items-baseline gap-x-3 pl-4 pr-2 md:grid-cols-[3.5rem_minmax(0,1fr)_auto] md:gap-x-8 md:pl-6 md:pr-3 ${large ? "py-7 md:py-9" : "py-5 md:py-6"
        }`}
      {...externalProps}
    >
      <span aria-hidden="true" className="index-num">
        {pad(index + 1)}
      </span>
      <span className="block">
        <span
          className={`block font-semibold tracking-[-0.02em] text-[var(--color-paper)] ${large ? "text-2xl md:text-[2rem]" : "text-lg md:text-xl"
            }`}
        >
          {item.title}
        </span>
        <span
          className={`mt-1.5 block max-w-2xl leading-7 text-[var(--text)] ${large ? "text-[0.95rem]" : "text-sm"
            }`}
        >
          {item.description}
        </span>
        <span className="mt-3 block md:hidden">
          <span className="eyebrow-system">
            {item.meta}
            <span aria-hidden="true" className="index-arrow">
              {arrow}
            </span>
          </span>
        </span>
      </span>
      <span className="hidden md:block">
        <span className="eyebrow-system gap-3">
          {item.meta}
          <span aria-hidden="true" className="index-arrow">
            {arrow}
          </span>
        </span>
      </span>
    </Tag>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 pb-20 pt-4 md:gap-24 md:pb-28 md:pt-10">
      {/* Hero */}
      <section className="relative overflow-x-clip" aria-label="Introduction">
        <span
          aria-hidden="true"
          className="hero-mark right-[-2rem] top-1/2 hidden -translate-y-1/2 text-[clamp(13rem,24vw,21rem)] sm:block"
        >
          عابدين
        </span>
        <FadeInWrapper direction="up" eager>
          <div className="relative flex min-h-[31rem] flex-col justify-center gap-6 py-8 md:min-h-[38rem] md:py-14">
            <span className="eyebrow-system">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-red)] shadow-[0_0_10px_var(--accent-glow)]"
              />
              Abdeen Labs · Independent software
            </span>
            <h1 className="max-w-4xl text-[clamp(2.85rem,7.5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-[var(--color-paper)]">
              Small tools,
              <br />
              carefully engineered
              <span className="text-[var(--color-red)]">.</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--text)] md:text-lg">
              Independent software for small, specific problems: native apps
              for Apple platforms and focused utilities for the browser. Free
              to use, open source, and built without account walls.
            </p>
            <p className="eyebrow-system flex-wrap gap-x-3 gap-y-1 pt-1">
              <a
                href="#apps"
                className="underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-[var(--color-paper)] hover:decoration-white/40"
              >
                {pad(apps.length)} apps
              </a>
              <span aria-hidden="true" className="opacity-40">·</span>
              <a
                href="#tools"
                className="underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-[var(--color-paper)] hover:decoration-white/40"
              >
                {pad(tools.length)} web tools
              </a>
              <span aria-hidden="true" className="opacity-40">·</span>
              <span>Free &amp; open source</span>
            </p>
          </div>
        </FadeInWrapper>
      </section>

      {/* Featured release */}
      <FadeInWrapper direction="up">
        <section aria-labelledby="featured-release-title" className="featured-release">
          <div className="featured-copy">
            <span className="eyebrow-system">
              <span aria-hidden="true" className="text-[var(--color-red)]">/</span>
              Featured release · macOS
            </span>
            <h2
              id="featured-release-title"
              className="mt-5 max-w-xl text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-[var(--color-paper)] md:text-5xl"
            >
              Lock every input. Keep the screen in view.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--text)] md:text-base md:leading-8">
              Frost freezes the keyboard, mouse, and trackpad while a build,
              render, or agent keeps running visibly. Unlock with TouchID or a
              paired Apple Watch.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/frost" className="btn btn-primary rounded-full px-5">
                Explore Frost <span aria-hidden="true">&rarr;</span>
              </Link>
              <span className="eyebrow-system">Free · Open source</span>
            </div>
          </div>
          <div className="featured-visual" aria-hidden="true">
            <div className="featured-menu">
              <span>FROST</span>
              <span className="featured-status-dot" />
            </div>
            <div className="featured-window featured-window-one" />
            <div className="featured-window featured-window-two" />
            <div className="featured-lock">
              <span className="featured-lock-mark">✳</span>
              <strong>Input Locked</strong>
              <span>TouchID to unlock</span>
            </div>
          </div>
        </section>
      </FadeInWrapper>

      {/* Apps */}
      <section id="apps" aria-label="Apps">
        <FadeInWrapper direction="up">
          <SectionHeader label="Apps" count={apps.length} inset />
        </FadeInWrapper>
        <div className="index-list">
          {apps.map((item, index) => (
            <FadeInWrapper key={item.href} direction="up" delay={0.04 + index * 0.04}>
              <IndexRow item={item} index={index} large />
            </FadeInWrapper>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" aria-label="Tools">
        <FadeInWrapper direction="up">
          <SectionHeader label="Web tools" count={tools.length} inset />
        </FadeInWrapper>
        <div className="index-list">
          {tools.map((item, index) => (
            <FadeInWrapper key={item.href} direction="up" delay={0.04 + index * 0.03}>
              <IndexRow item={item} index={index} />
            </FadeInWrapper>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section aria-label="Principles">
        <FadeInWrapper direction="up">
          <SectionHeader label="The operating principles" count={principles.length} />
        </FadeInWrapper>
        <FadeInWrapper direction="up" delay={0.04}>
          <div className="grid gap-8 border-t border-white/[0.08] pt-8 md:grid-cols-3 md:gap-6 md:pt-10">
            {principles.map((p) => (
              <div
                key={p.num}
                className="flex flex-col gap-2.5 md:border-l md:border-white/[0.08] md:pl-6 md:first:border-l-0 md:first:pl-0"
              >
                <span aria-hidden="true" className="index-num">{p.num}</span>
                <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
                  {p.title}
                </h3>
                <p className="text-sm leading-7 text-[var(--text)]">{p.body}</p>
              </div>
            ))}
          </div>
        </FadeInWrapper>
      </section>
    </div>
  );
}
