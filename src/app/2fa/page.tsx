import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import TwoFactorQR from './TwoFactorQR';

export const metadata: Metadata = {
  title: '2FA QR Generator',
  description:
    'Generate two-factor authentication QR codes from TOTP and HOTP secrets. Compatible with Google Authenticator, Authy, and Yubico. Parse or create otpauth:// URIs.',
  alternates: { canonical: 'https://abdeen.dev/2fa' },
  openGraph: {
    title: '2FA QR Generator | abdeen.dev',
    description:
      'Create 2FA QR codes from TOTP/HOTP secrets. Works with Google Authenticator and Authy.',
    url: 'https://abdeen.dev/2fa',
  },
};

export default function TwoFactorQRPage() {
  return (
    <FadeInWrapper direction="up">
      <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight">2FA QR Generator</h1>
        <p className="text-sm text-[var(--text)] mb-6">Generate QR codes from two-factor authentication secrets</p>
        <TwoFactorQR />
      </div>
    </FadeInWrapper>
  );
}
