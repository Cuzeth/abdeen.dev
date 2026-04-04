import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import QRGenerator from './QRGenerator';

export const metadata: Metadata = {
  title: 'QR Generator',
  description: 'Generate QR codes for text, WiFi, email, and phone.',
};

export default function QRGeneratorPage() {
  return (
    <FadeInWrapper direction="up">
      <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight">QR Generator</h1>
        <p className="text-sm text-[var(--text)] mb-6">Generate QR codes for text, WiFi, email, and phone</p>
        <QRGenerator />
      </main>
    </FadeInWrapper>
  );
}
