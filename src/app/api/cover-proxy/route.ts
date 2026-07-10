import { NextResponse } from 'next/server';
import { isAllowedUrl } from './allowed-url';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  if (!isAllowedUrl(url)) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CoverQuad/1.0 (https://abdeen.dev/coverquad)' },
      redirect: 'follow',
      // Don't leave the client's slot spinner hanging on a stalled upstream
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Upstream timed out' }, { status: 504 });
    }
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 502 });
  }
}
