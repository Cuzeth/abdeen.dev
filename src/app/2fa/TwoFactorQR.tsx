'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import styles from './twofa.module.css';

type OTPType = 'totp' | 'hotp';

const ISSUERS = [
  'Amazon', 'Apple', 'AWS', 'Blizzard', 'Cloudflare', 'Coinbase',
  'DigitalOcean', 'Discord', 'Docker', 'DreamHost', 'Dropbox', 'EA',
  'eBay', 'Epic Games', 'EVE Online', 'Evernote', 'Facebook', 'Fastly',
  'Firefox', 'GitHub', 'GitLab', 'GoDaddy', 'Google', 'Heroku',
  'Humble Bundle', 'LastPass', 'MailChimp', 'Mailgun', 'MaxCDN',
  'Microsoft', 'Namecheap', 'Newegg', 'npm', 'Okta',
  'Private Internet Access', 'ProtonMail', 'Reddit', 'Ring',
  'Salesforce', 'SendGrid', 'Slack', 'SparkPost', 'Threat Stack',
  'Ting', 'Twitch', 'Ubisoft', 'Ubuntu', 'Yahoo!',
];

export default function TwoFactorQR() {
  const [type, setType] = useState<OTPType>('totp');
  const [secret, setSecret] = useState('');
  const [label, setLabel] = useState('');
  const [issuer, setIssuer] = useState('');
  const [counter, setCounter] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [algorithm, setAlgorithm] = useState('SHA1');
  const [digits, setDigits] = useState('6');
  const [period, setPeriod] = useState('');
  const [size, setSize] = useState(200);
  const [uri, setUri] = useState('');
  const [uriEdited, setUriEdited] = useState(false);
  const [uriInvalid, setUriInvalid] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  const generateUri = useCallback(() => {
    let s = `otpauth://${type}/${encodeURIComponent(label)}?secret=${secret.replace(/ /g, '')}`;
    if (issuer) s += `&issuer=${encodeURIComponent(issuer)}`;
    if (type === 'hotp') s += `&counter=${counter || '0'}`;
    if (showAdvanced) {
      s += `&algorithm=${algorithm}&digits=${digits}`;
      if (type === 'totp') s += `&period=${period || '30'}`;
    }
    return s;
  }, [type, secret, label, issuer, counter, showAdvanced, algorithm, digits, period]);

  const effectiveUri = useMemo(
    () => (uriEdited ? uri : generateUri()),
    [uriEdited, uri, generateUri],
  );

  useEffect(() => {
    if (!effectiveUri) return;
    let cancelled = false;
    QRCode.toDataURL(effectiveUri, {
      width: size,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    }).catch(() => {
      if (!cancelled) setQrDataUrl(null);
    });
    return () => { cancelled = true; };
  }, [effectiveUri, size]);

  const displayQr = effectiveUri ? qrDataUrl : null;

  const parseUri = useCallback((value: string) => {
    setUri(value);
    setUriEdited(true);
    setUriInvalid(false);

    try {
      const url = new URL(value);
      if (url.protocol !== 'otpauth:') {
        setUriInvalid(true);
        return;
      }

      const urlType = url.host || url.pathname.split('/')[2];
      if (urlType !== 'totp' && urlType !== 'hotp') {
        setUriInvalid(true);
        return;
      }
      if (!url.searchParams.has('secret')) {
        setUriInvalid(true);
        return;
      }

      let urlLabel = decodeURIComponent(url.pathname.substring(url.host ? 1 : 7));
      const urlIssuer = url.searchParams.get('issuer') ? decodeURIComponent(url.searchParams.get('issuer')!) : '';

      if (urlLabel.startsWith(`${urlIssuer}:`)) {
        urlLabel = urlLabel.substring(urlIssuer.length + 1);
      }

      setType(urlType as OTPType);
      setLabel(urlLabel);
      setSecret(url.searchParams.get('secret') || '');
      setIssuer(urlIssuer);
      setCounter(url.searchParams.get('counter') || '');
      const hasAdvanced = url.searchParams.has('algorithm') || url.searchParams.has('digits') || url.searchParams.has('period');
      setShowAdvanced(hasAdvanced);
      setAlgorithm(url.searchParams.get('algorithm') || 'SHA1');
      setDigits(url.searchParams.get('digits') || '6');
      const p = url.searchParams.get('period');
      setPeriod(p === '30' ? '' : (p || ''));

      setUriEdited(false);
    } catch {
      // Invalid URL, keep the raw text but flag it
      if (value !== '') setUriInvalid(true);
    }
  }, []);

  const handleFieldChange = useCallback(() => {
    setUriEdited(false);
    setUriInvalid(false);
  }, []);

  const showQr = Boolean(displayQr && (secret || uriEdited));

  return (
    <div className="grid w-full gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-10">
      {/* LEFT — form */}
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="twofa-type" className="field-label">Type</label>
          <select
            id="twofa-type"
            className="select"
            value={type}
            onChange={(e) => { setType(e.target.value as OTPType); handleFieldChange(); }}
          >
            <option value="totp">Time based (TOTP)</option>
            <option value="hotp">Counter based (HOTP)</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="twofa-secret" className="field-label">Secret (required)</label>
          <input
            id="twofa-secret"
            className={`input input-mono ${secret === '' && label !== '' ? styles.invalid : ''}`}
            type="text"
            placeholder="e.g. JBSWY3DPEHPK3PXP"
            aria-invalid={secret === '' && label !== ''}
            value={secret}
            onChange={(e) => { setSecret(e.target.value); handleFieldChange(); }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="twofa-label" className="field-label">Label (required)</label>
          <input
            id="twofa-label"
            className={`input ${label === '' && secret !== '' ? styles.invalid : ''}`}
            type="text"
            placeholder="e.g. user@example.com"
            aria-invalid={label === '' && secret !== ''}
            value={label}
            onChange={(e) => { setLabel(e.target.value); handleFieldChange(); }}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="twofa-issuer" className="field-label">Issuer (optional)</label>
          <input
            id="twofa-issuer"
            className="input"
            type="text"
            placeholder="e.g. Google, GitHub, etc."
            value={issuer}
            onChange={(e) => { setIssuer(e.target.value); handleFieldChange(); }}
            list="issuers-list"
            spellCheck={false}
          />
          <datalist id="issuers-list">
            {ISSUERS.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>

        {type === 'hotp' && (
          <div className="flex flex-col gap-2">
            <label htmlFor="twofa-counter" className="field-label">Initial Counter</label>
            <input
              id="twofa-counter"
              className="input"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Defaults to 0"
              value={counter}
              onChange={(e) => { setCounter(e.target.value); handleFieldChange(); }}
              autoComplete="off"
            />
          </div>
        )}

        <label className="check-row mt-1">
          <input
            type="checkbox"
            checked={showAdvanced}
            onChange={(e) => { setShowAdvanced(e.target.checked); handleFieldChange(); }}
          />
          Advanced options
        </label>

        <div className={`${styles.advancedPanel} ${showAdvanced ? styles.advancedPanelOpen : ''}`}>
          <div className={styles.advancedPanelInner}>
            <p className={styles.advancedNote}>
              Advanced options are not supported by Google Authenticator (they are ignored). Yubico Authenticator supports them.
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="twofa-algorithm" className="field-label">Algorithm</label>
              <select
                id="twofa-algorithm"
                className="select"
                value={algorithm}
                onChange={(e) => { setAlgorithm(e.target.value); handleFieldChange(); }}
              >
                <option value="SHA1">SHA1 (Default)</option>
                <option value="SHA256">SHA256</option>
                <option value="SHA512">SHA512</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="twofa-digits" className="field-label">Digits</label>
              <select
                id="twofa-digits"
                className="select"
                value={digits}
                onChange={(e) => { setDigits(e.target.value); handleFieldChange(); }}
              >
                <option value="6">6 digits (Default)</option>
                <option value="8">8 digits</option>
              </select>
            </div>
            {type === 'totp' && (
              <div className="flex flex-col gap-2">
                <label htmlFor="twofa-period" className="field-label">Period (seconds)</label>
                <input
                  id="twofa-period"
                  className="input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Defaults to 30"
                  value={period}
                  onChange={(e) => { setPeriod(e.target.value); handleFieldChange(); }}
                  autoComplete="off"
                />
              </div>
            )}
          </div>
        </div>

        <hr className={styles.divider} />

        <div className="flex flex-col gap-2">
          <label htmlFor="twofa-uri" className="field-label">OTPAuth URI</label>
          <input
            id="twofa-uri"
            className="input input-mono text-xs"
            type="text"
            placeholder="otpauth://"
            aria-invalid={uriInvalid}
            aria-describedby={uriInvalid ? 'twofa-uri-error' : undefined}
            value={effectiveUri}
            onChange={(e) => parseUri(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
          {uriInvalid && (
            <p id="twofa-uri-error" role="alert" className="text-xs text-[var(--color-red)]">
              Not a valid otpauth:// URI — authenticator apps won&apos;t recognize this code.
            </p>
          )}
        </div>
      </div>

      {/* RIGHT — QR preview */}
      <div className="lg:border-l lg:border-white/[0.06] lg:pl-10">
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <span className="eyebrow-system">QR Code</span>
          <div className="tool-stage">
            {showQr ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayQr!}
                  alt="2FA QR Code"
                  width={size}
                  height={size}
                  className={styles.qrImage}
                />
                <div className="flex w-full flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="field-label">Size</span>
                    <span className="color-hex">{size}px</span>
                  </div>
                  <input
                    className="range"
                    type="range"
                    min={50}
                    max={400}
                    step={25}
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    aria-label="QR code size in pixels"
                  />
                </div>
              </>
            ) : (
              <div className={styles.placeholder}>
                Enter a secret and label to generate your code.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
