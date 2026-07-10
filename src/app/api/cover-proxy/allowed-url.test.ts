import { describe, expect, test } from 'bun:test';
import { isAllowedUrl } from './allowed-url';

describe('isAllowedUrl', () => {
  test('allows the cover art hosts over https', () => {
    expect(isAllowedUrl('https://coverartarchive.org/release-group/x/front-250')).toBe(true);
    expect(isAllowedUrl('https://archive.org/download/x/y.jpg')).toBe(true);
    expect(isAllowedUrl('https://ia800123.us.archive.org/1/items/x/y.jpg')).toBe(true);
    expect(isAllowedUrl('https://sub.coverartarchive.org/x')).toBe(true);
  });

  test('rejects plain http and non-http schemes', () => {
    expect(isAllowedUrl('http://coverartarchive.org/x')).toBe(false);
    expect(isAllowedUrl('ftp://archive.org/x')).toBe(false);
  });

  test('rejects lookalike hosts', () => {
    expect(isAllowedUrl('https://ia800.evil.com/x')).toBe(false);
    expect(isAllowedUrl('https://evilarchive.org/x')).toBe(false);
    expect(isAllowedUrl('https://coverartarchive.org.evil.com/x')).toBe(false);
  });

  test('rejects unparseable input', () => {
    expect(isAllowedUrl('not a url')).toBe(false);
    expect(isAllowedUrl('')).toBe(false);
  });
});
