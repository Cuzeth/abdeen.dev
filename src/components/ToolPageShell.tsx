import type { ReactNode } from "react";
import FadeInWrapper from "@/components/FadeInWrapper";

interface ToolPageShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ToolPageShell({
  title,
  description,
  children,
}: ToolPageShellProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-16 pt-4 md:gap-8 md:pb-24 md:pt-8">
      <FadeInWrapper direction="up">
        <section className="surface-panel overflow-hidden rounded-[1.25rem] md:rounded-[2rem]">
          <div className="border-b border-white/[0.06] px-5 py-4 md:px-8 md:py-5">
            <h1 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-paper)]">
              {title}
            </h1>
            <p className="mt-1 text-sm text-[var(--text)] opacity-70">
              {description}
            </p>
          </div>
          <div className="px-4 py-5 md:px-8 md:py-8">
            <div className="mx-auto flex w-full justify-center">{children}</div>
          </div>
        </section>
      </FadeInWrapper>
    </div>
  );
}
