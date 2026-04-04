import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import CoverQuad from './CoverQuad';

export const metadata: Metadata = {
  title: 'CoverQuad',
  description:
    'Create 2\u00d72 album art collages. Upload your own images or search MusicBrainz for album covers. Export as high-resolution PNG up to 3000px.',
  alternates: { canonical: 'https://abdeen.dev/coverquad' },
  openGraph: {
    title: 'CoverQuad | abdeen.dev',
    description:
      'Build beautiful 2\u00d72 album art collages. Upload images or search for covers. Export as PNG.',
    url: 'https://abdeen.dev/coverquad',
  },
};

export default function CoverQuadPage() {
  return (
    <FadeInWrapper direction="up">
      <div className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight">CoverQuad</h1>
        <p className="text-sm text-[var(--text)] mb-6">Create a 2&times;2 album art collage</p>
        <CoverQuad />
      </div>
    </FadeInWrapper>
  );
}
