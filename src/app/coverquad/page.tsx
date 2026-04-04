import type { Metadata } from 'next';
import FadeInWrapper from '@/components/FadeInWrapper';
import CoverQuad from './CoverQuad';

export const metadata: Metadata = {
  title: 'CoverQuad',
  description: 'Create a 2\u00d72 album art collage. Upload images or search for album art.',
};

export default function CoverQuadPage() {
  return (
    <FadeInWrapper direction="up">
      <main className="min-h-screen flex flex-col items-center px-4 py-8 sm:py-12">
        <h1 className="text-2xl font-bold text-[var(--heading)] tracking-tight">CoverQuad</h1>
        <p className="text-sm text-[var(--text)] mb-6">Create a 2&times;2 album art collage</p>
        <CoverQuad />
      </main>
    </FadeInWrapper>
  );
}
