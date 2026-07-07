'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 pb-20 pt-16 md:pt-24">
      <span className="eyebrow self-start">
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-red)] shadow-[0_0_10px_var(--accent-glow)]"
        />
        Something went wrong
      </span>
      <h1 className="font-semibold tracking-[-0.02em] text-[var(--color-paper)] text-4xl leading-[1.05] md:text-5xl">
        This page hit an error<span className="text-[var(--color-red)]">.</span>
      </h1>
      <p className="max-w-xl text-base leading-7 text-[var(--text)]">
        Nothing you did. Something broke on this end. You can try again, or
        head back to the homepage.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="surface-card rounded-full px-5 py-2.5 text-sm font-medium text-[var(--color-paper)] transition-colors duration-200 hover:text-[var(--color-red)]"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm text-[var(--text)] underline underline-offset-4 transition-colors duration-200 hover:text-[var(--color-paper)]"
        >
          Back to abdeen.dev
        </Link>
      </div>
    </div>
  );
}
