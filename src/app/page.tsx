import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";
import SectionHeader from "@/components/SectionHeader";
import { apps, tools, type CatalogEntry } from "@/lib/catalog";

const principles = [
  {
    num: "01",
    title: "Free, forever",
    body: "Everything on this site is free to use. No paywalls, no upsells, no ads.",
  },
  {
    num: "02",
    title: "Private by default",
    body: "No accounts and no sign-ups. The tools do their work in your browser.",
  },
  {
    num: "03",
    title: "Open source",
    body: "The code is public on GitHub. Read it, fork it, or file an issue.",
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 pb-20 pt-6 md:gap-24 md:pb-28 md:pt-12">
      {/* Hero */}
      <section className="relative overflow-x-clip" aria-label="Introduction">
        <span
          aria-hidden="true"
          className="hero-mark right-[-2rem] top-1/2 hidden -translate-y-1/2 text-[clamp(13rem,24vw,21rem)] sm:block"
        >
          عابدين
        </span>
        <FadeInWrapper direction="up">
          <div className="relative flex flex-col gap-6 py-6 md:py-12">
            <span className="eyebrow-system">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-red)] shadow-[0_0_10px_var(--accent-glow)]"
              />
              Abdeen Labs · Independent software
            </span>
            <h1 className="max-w-4xl text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.02em] text-[var(--color-paper)] md:text-7xl">
              Small tools,
              <br />
              carefully engineered
              <span className="text-[var(--color-red)]">.</span>
            </h1>
            <p className="max-w-xl text-base leading-8 text-[var(--text)] md:text-lg">
              Native apps for Apple platforms and free utilities for the
              browser, built and maintained by Abdeen. Nothing to buy,
              nothing to sign up for.
            </p>
            <p className="eyebrow-system flex-wrap gap-x-3 gap-y-1">
              <a
                href="#apps"
                className="underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-[var(--color-paper)] hover:decoration-white/40"
              >
                {pad(apps.length)} apps
              </a>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <a
                href="#tools"
                className="underline decoration-white/20 underline-offset-4 transition-colors duration-200 hover:text-[var(--color-paper)] hover:decoration-white/40"
              >
                {pad(tools.length)} web tools
              </a>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span>Free &amp; open source</span>
            </p>
          </div>
        </FadeInWrapper>
      </section>

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
      <FadeInWrapper direction="up">
        <section
          aria-label="Principles"
          className="grid gap-8 border-t border-white/[0.08] pt-8 md:grid-cols-3 md:gap-6 md:pt-10"
        >
          {principles.map((p) => (
            <div
              key={p.num}
              className="flex flex-col gap-2.5 md:border-l md:border-white/[0.08] md:pl-6 md:first:border-l-0 md:first:pl-0"
            >
              <span aria-hidden="true" className="index-num">
                {p.num}
              </span>
              <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
                {p.title}
              </h3>
              <p className="text-sm leading-7 text-[var(--text)]">{p.body}</p>
            </div>
          ))}
        </section>
      </FadeInWrapper>
    </div>
  );
}
