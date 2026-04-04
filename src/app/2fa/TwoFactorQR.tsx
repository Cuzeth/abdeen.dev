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

    try {
      const url = new URL(value);
      if (url.protocol !== 'otpauth:') return;

      const urlType = url.host || url.pathname.split('/')[2];
      if (urlType !== 'totp' && urlType !== 'hotp') return;
      if (!url.searchParams.has('secret')) return;

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
      // Invalid URL, just keep the raw text
    }
  }, []);

  const handleFieldChange = useCallback(() => {
    setUriEdited(false);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <label htmlFor="twofa-type" className={styles.label}>Type</label>
        <select
          id="twofa-type"
          className={styles.select}
          value={type}
          onChange={(e) => { setType(e.target.value as OTPType); handleFieldChange(); }}
        >
          <option value="totp">Time based (TOTP)</option>
          <option value="hotp">Counter based (HOTP)</option>
        </select>
      </div>

      <div className={styles.section}>
        <label htmlFor="twofa-secret" className={styles.label}>Secret (required)</label>
        <input
          id="twofa-secret"
          className={`${styles.input} ${secret === '' && label !== '' ? styles.invalid : ''}`}
          type="text"
          placeholder="e.g. JBSWY3DPEHPK3PXP"
          value={secret}
          onChange={(e) => { setSecret(e.target.value); handleFieldChange(); }}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className={styles.section}>
        <label htmlFor="twofa-label" className={styles.label}>Label (required)</label>
        <input
          id="twofa-label"
          className={`${styles.input} ${label === '' && secret !== '' ? styles.invalid : ''}`}
          type="text"
          placeholder="e.g. user@example.com"
          value={label}
          onChange={(e) => { setLabel(e.target.value); handleFieldChange(); }}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className={styles.section}>
        <label htmlFor="twofa-issuer" className={styles.label}>Issuer (optional)</label>
        <input
          id="twofa-issuer"
          className={styles.input}
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
        <div className={styles.section}>
          <label className={styles.label}>Initial Counter</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Defaults to 0"
            value={counter}
            onChange={(e) => { setCounter(e.target.value); handleFieldChange(); }}
            autoComplete="off"
          />
        </div>
      )}

      <label className={styles.checkRow}>
        <input
          type="checkbox"
          checked={showAdvanced}
          onChange={(e) => { setShowAdvanced(e.target.checked); handleFieldChange(); }}
        />
        Advanced options
      </label>

      {showAdvanced && (
        <>
          <p className={styles.advancedNote}>
            Advanced options are not supported by Google Authenticator (they are ignored). Yubico Authenticator supports them.
          </p>
          <div className={styles.section}>
            <label className={styles.label}>Algorithm</label>
            <select
              className={styles.select}
              value={algorithm}
              onChange={(e) => { setAlgorithm(e.target.value); handleFieldChange(); }}
            >
              <option value="SHA1">SHA1 (Default)</option>
              <option value="SHA256">SHA256</option>
              <option value="SHA512">SHA512</option>
            </select>
          </div>
          <div className={styles.section}>
            <label className={styles.label}>Digits</label>
            <select
              className={styles.select}
              value={digits}
              onChange={(e) => { setDigits(e.target.value); handleFieldChange(); }}
            >
              <option value="6">6 digits (Default)</option>
              <option value="8">8 digits</option>
            </select>
          </div>
          {type === 'totp' && (
            <div className={styles.section}>
              <label className={styles.label}>Period (seconds)</label>
              <input
                className={styles.input}
                type="text"
                placeholder="Defaults to 30"
                value={period}
                onChange={(e) => { setPeriod(e.target.value); handleFieldChange(); }}
                autoComplete="off"
              />
            </div>
          )}
        </>
      )}

      <hr className={styles.divider} />

      <div className={styles.section}>
        <label htmlFor="twofa-uri" className={styles.label}>OTPAuth URI</label>
        <input
          id="twofa-uri"
          className={styles.uriInput}
          type="text"
          placeholder="otpauth://"
          value={effectiveUri}
          onChange={(e) => parseUri(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {displayQr && (
        <div className={styles.qrSection}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayQr}
            alt="2FA QR Code"
            width={size}
            height={size}
            className={styles.qrImage}
          />
          <input
            className={styles.sizeSlider}
            type="range"
            min={50}
            max={400}
            step={25}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            title="QR Code Size"
          />
        </div>
      )}
    </div>
  );
}
