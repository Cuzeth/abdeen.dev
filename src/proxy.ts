import { NextResponse, NextRequest } from 'next/server';
import { LRUCache } from 'lru-cache';

const rateLimitCache = new LRUCache<string, { count: number; timestamp: number }>({
  max: 500,
  ttl: 60000,
});

const RATE_LIMIT = 5;
const TIME_WINDOW = 60 * 1000;

export function proxy(request: NextRequest) {
  // Skip rate limiting for cover-proxy (image passthrough)
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/api/cover-proxy')) {
    return NextResponse.next();
  }

  const ip = request.headers.get('x-real-ip') || request.headers.get('x-forwarded-for')?.split(',')[0] || 'default-ip';

  const currentTime = Date.now();
  const record = rateLimitCache.get(ip);

  if (!record) {
    rateLimitCache.set(ip, { count: 1, timestamp: currentTime });
  } else {
    if (currentTime - record.timestamp < TIME_WINDOW) {
      if (record.count >= RATE_LIMIT) {
        return new NextResponse('Too Many Requests', { status: 429 });
      } else {
        record.count += 1;
        rateLimitCache.set(ip, record);
      }
    } else {
      rateLimitCache.set(ip, { count: 1, timestamp: currentTime });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
