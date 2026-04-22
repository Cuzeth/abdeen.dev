import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";

const tools = [
  {
    title: "CoverQuad",
    description:
      "Apple killed the 2×2 playlist covers. This brings them back.",
    href: "/coverquad",
  },
  {
    title: "Regex Tester",
    description:
      "Test and debug regular expressions with live match highlighting.",
    href: "/regex",
  },
  {
    title: "Pomodoro Timer",
    description: "A minimal focus timer to stay productive.",
    href: "/pomodoro",
  },
  {
    title: "Password Generator",
    description:
      "Generate memorable, secure passwords inspired by Apple Keychain.",
    href: "/pwgen",
  },
  {
    title: "2FA QR Generator",
    description:
      "Generate QR codes from two-factor authentication secrets.",
    href: "/2fa",
  },
  {
    title: "QR Generator",
    description: "Generate QR codes for text, WiFi, email, and phone.",
    href: "/qr",
  },
  // DISABLED: Lo-fi ATC Radio — re-enable by uncommenting this entry
  // and flipping ENABLED in src/app/lofi-atc/page.tsx back to true.
  /*
  {
    title: "Lo-fi ATC Radio",
    description:
      "Lo-fi beats mixed with live JFK Tower air-traffic control radio.",
    href: "/lofi-atc",
  },
  */
];

const apps = [
  {
    title: "Hush",
    description:
      "Focus sounds for iOS. Noise generators, binaural beats, and 80+ ambient sounds.",
    href: "/hush",
    external: false,
  },
  {
    title: "SafeStay Scanner",
    description:
      "Detect hidden cameras at Airbnbs and rentals. Network scanner, MAC lookup, and inspection checklist.",
    href: "/safestay",
    external: false,
  },
  {
    title: "Strobe",
    description:
      "Rapid serial visual reader for iPhone, iPad, and Mac. Read PDFs, EPUBs, and text at speed.",
    href: "https://strobefast.app",
    external: true,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-20 pt-4 md:gap-10 md:pb-28 md:pt-8">
      <FadeInWrapper direction="up">
        <div className="mb-2 flex flex-col gap-4">
          <span className="eyebrow self-start">
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-red)] shadow-[0_0_10px_var(--accent-glow)]"
            />
            An Abdeen Labs property
          </span>
          <h1 className="font-semibold tracking-[-0.02em] text-[var(--color-paper)] text-5xl leading-[1.02] md:text-6xl">
            abdeen<span className="text-[var(--color-red)]">.</span>dev
          </h1>
          <p className="max-w-xl text-base leading-7 text-[var(--text)] md:text-lg">
            Small tools, carefully engineered.
          </p>
        </div>
      </FadeInWrapper>

      <div className="relative grid gap-8 md:gap-10 lg:grid-cols-[1fr_2fr]">
        {/* Fading divider line (visible only side-by-side) */}
        <div className="pointer-events-none absolute inset-y-0 left-[calc(33.333%+0.5rem)] hidden w-px lg:block" style={{ background: "linear-gradient(to bottom, transparent, var(--text) 30%, var(--text) 70%, transparent)", opacity: 0.1 }} />
        {/* Apps */}
        <section aria-label="Apps">
          <FadeInWrapper direction="up" delay={0.02}>
            <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-graphite)]">
              Apps
            </h2>
          </FadeInWrapper>
          <div className="grid gap-4">
            {apps.map((item, index) => {
              const Tag = item.external ? "a" : Link;
              const externalProps = item.external
                ? { target: "_blank" as const, rel: "noopener noreferrer" }
                : {};
              return (
                <FadeInWrapper
                  key={item.href}
                  direction="up"
                  delay={0.04 + index * 0.03}
                >
                  <Tag
                    href={item.href}
                    className="group surface-panel block h-full rounded-[1.1rem] px-4 py-4 transition-transform duration-300 hover:-translate-y-1 md:rounded-[1.6rem] md:px-5 md:py-5"
                    {...externalProps}
                  >
                    <div className="flex h-full flex-col gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text)] opacity-45">
                        {item.external
                          ? new URL(item.href).hostname
                          : item.href}
                      </span>
                      <div>
                        <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--color-paper)] transition-colors duration-200 group-hover:text-[var(--color-red)]">
                          {item.title}
                        </h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--text)]">
                          {item.description}
                        </p>
                      </div>
                      {item.external && (
                        <span className="mt-auto text-xs text-[var(--text)] opacity-40 transition-opacity duration-200 group-hover:opacity-70">
                          Visit site &rarr;
                        </span>
                      )}
                    </div>
                  </Tag>
                </FadeInWrapper>
              );
            })}
          </div>
        </section>

        {/* Tools */}
        <section aria-label="Tools">
          <FadeInWrapper direction="up" delay={0.02}>
            <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-graphite)]">
              Tools
            </h2>
          </FadeInWrapper>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((item, index) => (
              <FadeInWrapper
                key={item.href}
                direction="up"
                delay={0.04 + index * 0.03}
              >
                <Link
                  href={item.href}
                  className="group surface-panel block h-full rounded-[1.1rem] px-4 py-4 transition-transform duration-300 hover:-translate-y-1 md:rounded-[1.6rem] md:px-5 md:py-5"
                >
                  <div className="flex h-full flex-col gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--text)] opacity-45">
                      {item.href}
                    </span>
                    <div>
                      <h2 className="text-xl font-bold tracking-[-0.04em] text-[var(--heading)] transition-colors duration-200 group-hover:text-[var(--accent)]">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-7 text-[var(--text)]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </FadeInWrapper>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
