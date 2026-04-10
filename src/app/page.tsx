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
  {
    title: "Lo-fi ATC Radio",
    description:
      "Lo-fi beats mixed with live JFK Tower air-traffic control radio.",
    href: "/lofi-atc",
  },
  {
    title: "SafeStay Scanner",
    description:
      "Detect hidden cameras at Airbnbs and rentals. Network scanner, MAC lookup, and inspection checklist.",
    href: "/safestay",
  },
  {
    title: "Hush",
    description:
      "Focus sounds for iOS. Noise generators, binaural beats, and 80+ ambient sounds.",
    href: "/hush",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-20 pt-4 md:gap-10 md:pb-28 md:pt-8">
      <FadeInWrapper direction="up">
        <div className="mb-2">
          <h1 className="text-4xl font-bold tracking-[-0.06em] text-[var(--heading)] md:text-5xl">
            abdeen<span className="text-[var(--accent)]">.</span>dev
          </h1>
          <p className="mt-3 text-base text-[var(--text)] md:text-lg">
            Small tools, carefully engineered.
          </p>
        </div>
      </FadeInWrapper>

      <section aria-label="Tools">
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
  );
}
