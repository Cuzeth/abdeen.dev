import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'abdeen.dev — Small tools, carefully engineered.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#080808',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: '#FAFAFA',
            letterSpacing: '-0.05em',
            display: 'flex',
          }}
        >
          abdeen
          <span style={{ color: '#DC2626' }}>.</span>
          dev
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#A1A1AA',
            marginTop: 16,
            fontWeight: 300,
          }}
        >
          Small tools, carefully engineered.
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: 4,
            background: 'linear-gradient(90deg, #DC2626 0%, #DC2626 33%, #FECACA 66%, #DC2626 100%)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
