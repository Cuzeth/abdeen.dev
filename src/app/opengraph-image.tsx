import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const alt = 'abdeen.dev — Small tools, carefully engineered.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Satori can't ingest Switzer's woff2 distribution or IBM Plex Sans as a
// variable TTF, so the OG image uses the shipped brand lockup SVG (which
// bakes the Plex wordmark into path data) for the mark and JetBrains Mono
// (static TTF) for the URL + tagline — monospaced is brand-appropriate for
// a technical value like a URL.
export default async function OGImage() {
  const [lockupSvg, monoMedium, monoRegular] = await Promise.all([
    readFile(
      path.join(process.cwd(), 'public/abdeen_assets/svg/horizontal_signature.svg'),
      'utf-8',
    ),
    readFile(path.join(process.cwd(), 'public/fonts/brand/JetBrainsMono-Medium.ttf')),
    readFile(path.join(process.cwd(), 'public/fonts/brand/JetBrainsMono-Regular.ttf')),
  ]);
  const lockupDataUri = `data:image/svg+xml;base64,${Buffer.from(lockupSvg).toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '72px 80px',
          position: 'relative',
          fontFamily: 'JetBrains Mono',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(140deg, rgba(26,26,26,0.98) 0%, rgba(18,18,18,0.92) 58%, rgba(12,12,12,0.96) 100%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(204,27,27,0.28) 0%, rgba(204,27,27,0) 70%)',
            display: 'flex',
          }}
        />

        <img
          src={lockupDataUri}
          width={360}
          height={106}
          alt=""
          style={{ position: 'relative' }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontWeight: 500,
              fontSize: 108,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              color: '#FAFAFA',
              display: 'flex',
            }}
          >
            abdeen<span style={{ color: '#CC1B1B' }}>.</span>dev
          </div>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontWeight: 400,
              fontSize: 26,
              letterSpacing: '0.02em',
              color: '#A39F97',
              display: 'flex',
            }}
          >
            Small tools, carefully engineered.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 4,
            background:
              'linear-gradient(90deg, #CC1B1B 0%, #7A1212 35%, #3A2A24 70%, #A39F97 100%)',
            display: 'flex',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'JetBrains Mono', data: monoMedium, weight: 500, style: 'normal' },
        { name: 'JetBrains Mono', data: monoRegular, weight: 400, style: 'normal' },
      ],
    },
  );
}
