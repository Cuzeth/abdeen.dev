import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import TwoFactorQR from './TwoFactorQR';

export const metadata: Metadata = {
  title: '2FA QR Generator',
  description: 'Generate QR codes from two-factor authentication secrets.',
};

export default function TwoFactorQRPage() {
  return (
    <FadeInWrapper direction="up">
      <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight">2FA QR Generator</h1>
        <p className="text-sm text-[var(--text)] mb-6">Generate QR codes from two-factor authentication secrets</p>
        <TwoFactorQR />
      </main>
    </FadeInWrapper>
  );
}
