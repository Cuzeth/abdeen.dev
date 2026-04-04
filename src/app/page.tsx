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
    <div className="px-4 md:px-8 pt-16 pb-20">
      <FadeInWrapper direction="up">
        <div className="max-w-5xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter text-[var(--heading)]">
            abdeen<span className="text-[var(--accent)]">.</span>dev
          </h1>
          <p className="text-lg md:text-xl text-[var(--text)] max-w-xl font-light">
            Small tools, carefully engineered.
          </p>
        </div>
      </FadeInWrapper>

      <div className="max-w-5xl mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((item) => (
          <FadeInWrapper key={item.href} direction="up">
            <Link
              href={item.href}
              className="block h-full rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
            >
              <h2 className="text-xl font-bold text-[var(--heading)] mb-2">
                {item.title}
              </h2>
              <p className="text-sm text-[var(--text)]">{item.description}</p>
            </Link>
          </FadeInWrapper>
        ))}
      </div>
    </div>
  );
}
