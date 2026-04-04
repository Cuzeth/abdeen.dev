import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import RegexTester from './RegexTester';

export const metadata: Metadata = {
  title: 'Regex Tester',
  description:
    'Free online regex tester with live match highlighting, capture group display, string replacement preview, and a built-in regex cheatsheet. No sign-up needed.',
  alternates: { canonical: 'https://abdeen.dev/regex' },
  openGraph: {
    title: 'Regex Tester | abdeen.dev',
    description:
      'Test and debug regular expressions with live highlighting, groups, and replace preview.',
    url: 'https://abdeen.dev/regex',
  },
};

export default function RegexTesterPage() {
  return (
    <FadeInWrapper direction="up">
      <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight mb-6">Regex Tester</h1>
        <RegexTester />
      </div>
    </FadeInWrapper>
  );
}
