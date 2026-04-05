import type { Metadata } from 'next';
import ToolPageShell from '@/components/ToolPageShell';
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
    <ToolPageShell
      title="CoverQuad"
      description="Rebuild the classic 2x2 playlist cover look with a clean collage workflow, album art search, and high-resolution export."
    >
      <CoverQuad />
    </ToolPageShell>
  );
}
