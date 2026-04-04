import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
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
    <FadeInWrapper direction="up">
      <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight mb-6">QR Generator</h1>
        <QRGenerator />
      </div>
    </FadeInWrapper>
  );
}
