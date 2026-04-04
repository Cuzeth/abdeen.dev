import Link from "next/link";
import FadeInWrapper from "@/components/FadeInWrapper";

const tools = [
  {
    title: "CoverQuad",
    description:
      "Create a 2\u00d72 album art collage. Upload images or search for album art.",
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
];

export default function HomePage() {
  return (
    <div className="px-4 md:px-8 pt-10 pb-16">
      <FadeInWrapper direction="up">
        <div className="max-w-5xl mx-auto mb-10">
          <h1 className="text-4xl md:text-6xl font-black mb-3 tracking-tighter text-[var(--heading)]">
            abdeen<span className="text-[var(--accent)]">.</span>dev
          </h1>
          <p className="text-base md:text-lg text-[var(--text)] max-w-xl font-light">
            Small tools, carefully engineered.
          </p>
        </div>
      </FadeInWrapper>

      <section className="max-w-5xl mx-auto" aria-label="Tools">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((item) => (
            <FadeInWrapper key={item.href} direction="up">
              <Link
                href={item.href}
                className="group block h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-200 hover:bg-white/[0.07] hover:border-white/15 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
              >
                <span className="block font-mono text-[11px] text-[var(--text)] opacity-30 mb-3 tracking-wide">
                  {item.href}
                </span>
                <h2 className="text-lg font-semibold text-[var(--heading)] mb-1.5 group-hover:text-[var(--accent)] transition-colors duration-200">
                  {item.title}
                </h2>
                <p className="text-sm text-[var(--text)] leading-relaxed opacity-70">{item.description}</p>
              </Link>
            </FadeInWrapper>
          ))}
        </div>
      </section>
    </div>
  );
}
