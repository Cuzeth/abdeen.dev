import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default async function Icon() {
  const arefRuqaa = await readFile(
    path.join(process.cwd(), 'public/fonts/brand/ArefRuqaa-Bold.ttf'),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#15110D',
          borderRadius: 7,
        }}
      >
        <span
          style={{
            fontFamily: 'Aref Ruqaa',
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1,
            color: '#CC1B1B',
            display: 'flex',
            direction: 'rtl',
          }}
        >
          ع
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Aref Ruqaa',
          data: arefRuqaa,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );
}
