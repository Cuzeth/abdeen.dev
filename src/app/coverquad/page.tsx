import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import CoverQuad from './CoverQuad';

export const metadata: Metadata = {
  title: 'CoverQuad',
  description:
    'Apple removed the classic 2\u00d72 album art playlist covers. CoverQuad brings them back \u2014 upload your own images or search for album art and export as high-resolution PNG.',
  alternates: { canonical: 'https://abdeen.dev/coverquad' },
  openGraph: {
    title: 'CoverQuad | abdeen.dev',
    description:
      'Apple removed the classic 2\u00d72 playlist covers. CoverQuad brings them back.',
    url: 'https://abdeen.dev/coverquad',
  },
};

export default function CoverQuadPage() {
  return (
    <FadeInWrapper direction="up">
      <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight mb-1.5">CoverQuad</h1>
        <p className="text-sm text-[var(--text)] opacity-50 mb-6">Apple killed the 2&times;2 playlist covers. This brings them back.</p>
        <CoverQuad />
      </div>
    </FadeInWrapper>
  );
}
