import { describe, expect, test } from 'bun:test';
import { buildOtpauthUri, parseOtpauthUri, type OtpauthBuildInput } from './otpauth';

const base: OtpauthBuildInput = {
  type: 'totp',
  secret: 'JBSWY3DPEHPK3PXP',
  label: 'user@example.com',
  issuer: '',
  counter: '',
  includeAdvanced: false,
  algorithm: 'SHA1',
  digits: '6',
  period: '',
};

describe('buildOtpauthUri', () => {
  test('minimal TOTP URI', () => {
    expect(buildOtpauthUri(base)).toBe(
      'otpauth://totp/user%40example.com?secret=JBSWY3DPEHPK3PXP',
    );
  });

  test('strips spaces from the secret', () => {
    expect(buildOtpauthUri({ ...base, secret: 'JBSW Y3DP EHPK 3PXP' })).toContain(
      'secret=JBSWY3DPEHPK3PXP',
    );
  });

  test('appends the issuer when set', () => {
    expect(buildOtpauthUri({ ...base, issuer: 'GitHub' })).toContain('&issuer=GitHub');
  });

  test('HOTP defaults the counter to 0', () => {
    const uri = buildOtpauthUri({ ...base, type: 'hotp' });
    expect(uri).toStartWith('otpauth://hotp/');
    expect(uri).toContain('&counter=0');
  });

  test('advanced options include a default period for TOTP', () => {
    const uri = buildOtpauthUri({
      ...base,
      includeAdvanced: true,
      algorithm: 'SHA256',
      digits: '8',
    });
    expect(uri).toContain('&algorithm=SHA256&digits=8&period=30');
  });
});

describe('parseOtpauthUri', () => {
  test('parses a minimal TOTP URI with defaults', () => {
    expect(parseOtpauthUri('otpauth://totp/user@example.com?secret=ABC')).toEqual({
      type: 'totp',
      label: 'user@example.com',
      secret: 'ABC',
      issuer: '',
      counter: '',
      hasAdvanced: false,
      algorithm: 'SHA1',
      digits: '6',
      period: '',
    });
  });

  test('strips the issuer prefix from the label', () => {
    const fields = parseOtpauthUri('otpauth://totp/GitHub:user?secret=ABC&issuer=GitHub');
    expect(fields?.label).toBe('user');
    expect(fields?.issuer).toBe('GitHub');
  });

  test('normalizes the default 30s period to empty', () => {
    const fields = parseOtpauthUri('otpauth://totp/x?secret=ABC&period=30');
    expect(fields?.period).toBe('');
    expect(fields?.hasAdvanced).toBe(true);
  });

  test('keeps a non-default period', () => {
    expect(parseOtpauthUri('otpauth://totp/x?secret=ABC&period=60')?.period).toBe('60');
  });

  test('rejects non-otpauth protocols, unknown types, and missing secrets', () => {
    expect(parseOtpauthUri('https://totp/x?secret=ABC')).toBeNull();
    expect(parseOtpauthUri('otpauth://motp/x?secret=ABC')).toBeNull();
    expect(parseOtpauthUri('otpauth://totp/x')).toBeNull();
    expect(parseOtpauthUri('not a url')).toBeNull();
    expect(parseOtpauthUri('')).toBeNull();
  });

  test('round-trips what buildOtpauthUri produces', () => {
    const uri = buildOtpauthUri({
      type: 'hotp',
      secret: 'ABCDEF',
      label: 'me@x.com',
      issuer: 'Acme',
      counter: '7',
      includeAdvanced: true,
      algorithm: 'SHA512',
      digits: '8',
      period: '',
    });
    expect(parseOtpauthUri(uri)).toEqual({
      type: 'hotp',
      label: 'me@x.com',
      secret: 'ABCDEF',
      issuer: 'Acme',
      counter: '7',
      hasAdvanced: true,
      algorithm: 'SHA512',
      digits: '8',
      period: '',
    });
  });
});
