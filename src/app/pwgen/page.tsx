import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import PasswordGenerator from './PasswordGenerator';

export const metadata: Metadata = {
  title: 'Password Generator',
  description:
    'Generate strong, memorable passwords inspired by Apple Keychain, or secure diceware passphrases with EFF and BIP-39 word lists. Entropy calculation, batch generation, and clipboard copy.',
  alternates: { canonical: 'https://abdeen.dev/pwgen' },
  openGraph: {
    title: 'Password Generator | abdeen.dev',
    description:
      'Generate strong, memorable passwords or secure passphrases. Free, no sign-up required.',
    url: 'https://abdeen.dev/pwgen',
  },
};

export default function PasswordGeneratorPage() {
  return (
    <FadeInWrapper direction="up">
      <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight mb-8">Password Generator</h1>
        <PasswordGenerator />
      </div>
    </FadeInWrapper>
  );
}
