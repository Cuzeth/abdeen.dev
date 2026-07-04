'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type QRCodeStyling from 'qr-code-styling';
import { useSlider } from '@/hooks/useSlider';
import styles from './qr.module.css';

type TabType = 'text' | 'wifi' | 'email' | 'phone';
type DotType = 'square' | 'dots' | 'rounded' | 'classy' | 'classy-rounded' | 'extra-rounded';
type CornerSquareType = 'square' | 'dot' | 'extra-rounded';
type CornerDotType = 'square' | 'dot';
type GradientType = 'linear' | 'radial';

const TABS: { key: TabType; label: string }[] = [
  { key: 'text', label: 'Text' },
  { key: 'wifi', label: 'WiFi' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
];

const DOT_STYLES: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dots', label: 'Dots' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

const CORNER_STYLES: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Rounded' },
  { value: 'extra-rounded', label: 'Extra Rounded' },
];

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState<TabType>('text');
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [showStyle, setShowStyle] = useState(false);

  // Data fields
  const [text, setText] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiHidden, setWifiHidden] = useState(false);
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneMessage, setPhoneMessage] = useState('');

  // Style options
  const [dotStyle, setDotStyle] = useState<DotType>('rounded');
  const [cornerStyle, setCornerStyle] = useState<CornerSquareType>('dot');
  const [cornerDotStyle, setCornerDotStyle] = useState<CornerDotType>('dot');
  const [dotColor, setDotColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [useGradient, setUseGradient] = useState(false);
  const [gradientColor1, setGradientColor1] = useState('#000000');
  const [gradientColor2, setGradientColor2] = useState('#4a00e0');
  const [gradientType, setGradientType] = useState<GradientType>('linear');

  const tabSlider = useSlider(activeTab);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);
  const lastData = useRef<string>('');
  const styleSectionRef = useRef<HTMLDivElement>(null);

  const buildQRData = useCallback((): string | null => {
    switch (activeTab) {
      case 'text': {
        const val = text.trim();
        if (!val) { setError('Please enter some text or a URL'); return null; }
        return val;
      }
      case 'wifi': {
        const ssid = wifiSSID.trim();
        if (!ssid) { setError('Please enter a network name (SSID)'); return null; }
        if (wifiSecurity !== 'nopass' && !wifiPassword) {
          setError('Please enter a password for the secured network');
          return null;
        }
        // Backslash-escape the WIFI: format's reserved characters so networks
        // with e.g. ";" or ":" in the name/password still join correctly
        const esc = (v: string) => v.replace(/([\\;,:"])/g, '\\$1');
        return `WIFI:T:${wifiSecurity};S:${esc(ssid)};P:${esc(wifiPassword)};H:${wifiHidden ? 'true' : 'false'};;`;
      }
      case 'email': {
        const to = emailTo.trim();
        if (!to) { setError('Please enter an email address'); return null; }
        const params = new URLSearchParams();
        if (emailSubject.trim()) params.append('subject', emailSubject.trim());
        if (emailBody.trim()) params.append('body', emailBody.trim());
        const qs = params.toString();
        return `mailto:${to}${qs ? '?' + qs : ''}`;
      }
      case 'phone': {
        const num = phoneNumber.trim();
        if (!num) { setError('Please enter a phone number'); return null; }
        const msg = phoneMessage.trim();
        return msg ? `smsto:${num}:${msg}` : `tel:${num}`;
      }
      default:
        return null;
    }
  }, [activeTab, text, wifiSSID, wifiSecurity, wifiPassword, wifiHidden, emailTo, emailSubject, emailBody, phoneNumber, phoneMessage]);

  const getStyleOptions = useCallback(() => {
    const dotsOptions: Record<string, unknown> = {
      type: dotStyle,
    };
    if (useGradient) {
      dotsOptions.gradient = {
        type: gradientType,
        colorStops: [
          { offset: 0, color: gradientColor1 },
          { offset: 1, color: gradientColor2 },
        ],
      };
    } else {
      dotsOptions.color = dotColor;
    }

    return {
      width: 300,
      height: 300,
      margin: 8,
      dotsOptions,
      cornersSquareOptions: {
        type: cornerStyle,
        color: useGradient ? gradientColor1 : dotColor,
      },
      cornersDotOptions: {
        type: cornerDotStyle,
        color: useGradient ? gradientColor2 : dotColor,
      },
      backgroundOptions: {
        color: bgColor,
      },
      qrOptions: {
        errorCorrectionLevel: 'M',
      },
    };
  }, [dotStyle, cornerStyle, cornerDotStyle, dotColor, bgColor, useGradient, gradientColor1, gradientColor2, gradientType]);

  // Initialize QR instance via dynamic import (avoids SSR issues)
  useEffect(() => {
    let cancelled = false;
    import('qr-code-styling').then((mod) => {
      if (cancelled) return;
      const QRCodeStylingClass = mod.default;
      const instance = new QRCodeStylingClass({
        ...getStyleOptions(),
        data: ' ',
      } as ConstructorParameters<typeof QRCodeStylingClass>[0]);
      qrInstance.current = instance;
      if (qrRef.current) {
        while (qrRef.current.firstChild) {
          qrRef.current.removeChild(qrRef.current.firstChild);
        }
        instance.append(qrRef.current);
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update style when options change (only after first generate)
  useEffect(() => {
    if (!qrInstance.current || !generated) return;
    qrInstance.current.update({
      ...getStyleOptions(),
      data: lastData.current,
    } as Parameters<QRCodeStyling['update']>[0]);
  }, [getStyleOptions, generated]);

  const generate = useCallback(async () => {
    setError(null);
    const data = buildQRData();
    if (!data) return;

    lastData.current = data;

    if (qrInstance.current) {
      qrInstance.current.update({
        ...getStyleOptions(),
        data,
      } as Parameters<QRCodeStyling['update']>[0]);
      setGenerated(true);
    }
  }, [buildQRData, getStyleOptions]);

  const download = useCallback(() => {
    if (!qrInstance.current || !generated) return;
    qrInstance.current.download({
      name: `qrcode-${activeTab}`,
      extension: 'png',
    });
  }, [generated, activeTab]);

  // Ctrl/Cmd + Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [generate]);

  return (
    <div className="grid w-full gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)] lg:gap-10">
      {/* LEFT — controls */}
      <div className="flex min-w-0 flex-col gap-5">
        {/* Type selector */}
        <div
          className="segmented segmented--accent"
          role="tablist"
          aria-label="QR code type"
          ref={tabSlider}
        >
          <div className="segmented-thumb" />
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              data-active={activeTab === key}
              aria-selected={activeTab === key}
              className="segmented-item"
              onClick={() => { setActiveTab(key); setError(null); }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Forms */}
        <div className={styles.form} key={activeTab}>
          {activeTab === 'text' && (
            <>
              <label htmlFor="qr-text" className="field-label">Text or URL</label>
              <textarea
                id="qr-text"
                className="textarea"
                placeholder="Enter text or URL..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </>
          )}

          {activeTab === 'wifi' && (
            <>
              <label htmlFor="qr-wifi-ssid" className="field-label">Network Name (SSID)</label>
              <input
                id="qr-wifi-ssid"
                className="input"
                placeholder="e.g. MyWiFi"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
              />
              <label htmlFor="qr-wifi-security" className="field-label">Security</label>
              <select
                id="qr-wifi-security"
                className="select"
                value={wifiSecurity}
                onChange={(e) => {
                  setWifiSecurity(e.target.value);
                  if (e.target.value === 'nopass') setWifiPassword('');
                }}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
              <label htmlFor="qr-wifi-password" className="field-label">Password</label>
              <input
                id="qr-wifi-password"
                className="input"
                type="password"
                placeholder="Network password"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                disabled={wifiSecurity === 'nopass'}
              />
              <label className="check-row mt-1">
                <input
                  type="checkbox"
                  checked={wifiHidden}
                  onChange={(e) => setWifiHidden(e.target.checked)}
                />
                Hidden network
              </label>
            </>
          )}

          {activeTab === 'email' && (
            <>
              <label htmlFor="qr-email-to" className="field-label">Email Address</label>
              <input
                id="qr-email-to"
                className="input"
                type="email"
                placeholder="recipient@example.com"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
              />
              <label htmlFor="qr-email-subject" className="field-label">Subject</label>
              <input
                id="qr-email-subject"
                className="input"
                placeholder="Email subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
              <label htmlFor="qr-email-body" className="field-label">Message</label>
              <textarea
                id="qr-email-body"
                className="textarea"
                placeholder="Email body..."
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </>
          )}

          {activeTab === 'phone' && (
            <>
              <label htmlFor="qr-phone" className="field-label">Phone Number</label>
              <input
                id="qr-phone"
                className="input"
                type="tel"
                placeholder="+1 234 567 8900"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <label htmlFor="qr-phone-msg" className="field-label">SMS Message (optional)</label>
              <textarea
                id="qr-phone-msg"
                className="textarea"
                placeholder="Leave blank for call, or enter a message for SMS..."
                value={phoneMessage}
                onChange={(e) => setPhoneMessage(e.target.value)}
              />
            </>
          )}
        </div>

        {/* Generate */}
        <button className="btn btn-primary btn-block" onClick={generate}>
          Generate QR Code
        </button>

        {error && <p className="text-center text-sm text-[var(--color-red)]">{error}</p>}

        {/* Style Panel */}
        <button
          className="btn btn-ghost btn-block"
          data-active={showStyle}
          onClick={() => setShowStyle(!showStyle)}
        >
          {showStyle ? 'Hide Style Options' : 'Customize Style'}
        </button>

        <div
          className={`${styles.collapse} ${showStyle ? styles.collapseOpen : ''}`}
          ref={styleSectionRef}
        >
          <div className={styles.collapseInner}>
            <div className={styles.panel}>
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="qr-dot-style" className="field-label">Dot Style</label>
                  <select
                    id="qr-dot-style"
                    className="select"
                    value={dotStyle}
                    onChange={(e) => setDotStyle(e.target.value as DotType)}
                  >
                    {DOT_STYLES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="qr-corner-style" className="field-label">Corner Style</label>
                  <select
                    id="qr-corner-style"
                    className="select"
                    value={cornerStyle}
                    onChange={(e) => setCornerStyle(e.target.value as CornerSquareType)}
                  >
                    {CORNER_STYLES.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="qr-corner-dot" className="field-label">Corner Dot</label>
                  <select
                    id="qr-corner-dot"
                    className="select"
                    value={cornerDotStyle}
                    onChange={(e) => setCornerDotStyle(e.target.value as CornerDotType)}
                  >
                    <option value="square">Square</option>
                    <option value="dot">Rounded</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="field-label">Background</label>
                  <div className="flex items-center gap-2.5">
                    <input
                      type="color"
                      className="color-swatch"
                      aria-label="Background color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                    />
                    <span className="color-hex">{bgColor}</span>
                  </div>
                </div>
              </div>

              {/* Color / Gradient */}
              <div className="flex flex-col gap-3.5">
                <label className="check-row">
                  <input
                    type="checkbox"
                    checked={useGradient}
                    onChange={(e) => setUseGradient(e.target.checked)}
                  />
                  Use gradient
                </label>

                {useGradient ? (
                  <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="field-label">Color 1</label>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          className="color-swatch"
                          aria-label="Gradient color 1"
                          value={gradientColor1}
                          onChange={(e) => setGradientColor1(e.target.value)}
                        />
                        <span className="color-hex">{gradientColor1}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="field-label">Color 2</label>
                      <div className="flex items-center gap-2.5">
                        <input
                          type="color"
                          className="color-swatch"
                          aria-label="Gradient color 2"
                          value={gradientColor2}
                          onChange={(e) => setGradientColor2(e.target.value)}
                        />
                        <span className="color-hex">{gradientColor2}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="qr-gradient-type" className="field-label">Type</label>
                      <select
                        id="qr-gradient-type"
                        className="select"
                        value={gradientType}
                        onChange={(e) => setGradientType(e.target.value as GradientType)}
                      >
                        <option value="linear">Linear</option>
                        <option value="radial">Radial</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="field-label">Dot Color</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        className="color-swatch"
                        aria-label="Dot color"
                        value={dotColor}
                        onChange={(e) => setDotColor(e.target.value)}
                      />
                      <span className="color-hex">{dotColor}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — preview */}
      <div className="lg:border-l lg:border-white/[0.06] lg:pl-10">
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <span className="eyebrow-system">Preview</span>
          <div className="tool-stage">
            <div className="relative flex aspect-square w-full max-w-[240px] items-center justify-center">
              <div
                ref={qrRef}
                className={`${styles.qr} ${generated ? '' : styles.qrHidden}`}
                aria-label="Generated QR code"
              />
              {!generated && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border border-dashed border-white/10 px-6 text-center text-xs leading-5 text-[var(--color-graphite)]">
                  Generate to preview your code
                </div>
              )}
            </div>
            {generated ? (
              <button className="btn btn-ghost btn-block" onClick={download}>
                Download PNG
              </button>
            ) : (
              <span className="chip">&#8984; / Ctrl + Enter</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
