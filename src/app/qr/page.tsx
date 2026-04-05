import type { Metadata } from 'next';
import ToolPageShell from '@/components/ToolPageShell';
import QRGenerator from './QRGenerator';

export const metadata: Metadata = {
  title: 'QR Generator',
  description:
    'Generate custom QR codes for URLs, WiFi networks, email, and phone numbers. Customize colors, dot styles, and gradients. Download as PNG — free, no sign-up.',
  alternates: { canonical: 'https://abdeen.dev/qr' },
  openGraph: {
    title: 'QR Generator | abdeen.dev',
    description:
      'Create QR codes for text, WiFi, email, and phone. Customize styles and download as PNG.',
    url: 'https://abdeen.dev/qr',
  },
};

export default function QRGeneratorPage() {
  return (
    <ToolPageShell
      title="QR Generator"
      description="Generate QR codes for links, WiFi credentials, contact details, and more with tasteful styling controls and quick download."
    >
      <QRGenerator />
    </ToolPageShell>
  );
}
