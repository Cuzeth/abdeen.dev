import type { Metadata } from 'next';
import ToolPageShell from '@/components/ToolPageShell';
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
    <ToolPageShell
      title="Password Generator"
      description="Generate polished passwords or passphrases with strong defaults, useful entropy feedback, and quick batch creation."
    >
      <PasswordGenerator />
    </ToolPageShell>
  );
}
