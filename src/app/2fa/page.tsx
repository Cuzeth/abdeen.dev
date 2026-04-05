import type { Metadata } from 'next';
import ToolPageShell from '@/components/ToolPageShell';
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
    <ToolPageShell
      title="2FA QR Generator"
      description="Create authenticator-ready QR codes from TOTP or HOTP secrets, or generate them directly from an otpauth URI."
    >
      <TwoFactorQR />
    </ToolPageShell>
  );
}
