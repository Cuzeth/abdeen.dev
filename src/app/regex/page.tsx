import type { Metadata } from 'next';
import ToolPageShell from '@/components/ToolPageShell';
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
    <ToolPageShell
      title="Regex Tester"
      description="Test patterns, inspect matches, preview replacements, and keep your regex workflow readable while you iterate."
    >
      <RegexTester />
    </ToolPageShell>
  );
}
