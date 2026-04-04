import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import PasswordGenerator from './PasswordGenerator';

export const metadata: Metadata = {
  title: 'Password Generator',
  description: 'Generate memorable, secure passwords inspired by Apple Keychain.',
};

export default function PasswordGeneratorPage() {
  return (
    <FadeInWrapper direction="up">
      <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight">Password Generator</h1>
        <p className="text-sm text-[var(--text)] mb-8 opacity-60">Memorable &middot; Secure &middot; Precise</p>
        <PasswordGenerator />
      </main>
    </FadeInWrapper>
  );
}
