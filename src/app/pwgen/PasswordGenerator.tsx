// Password Generator UI. The generation engine (modes, scoring, entropy,
// word list credits) lives in ./generator.ts.

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSlider } from '@/hooks/useSlider';
import {
  generateMemorable,
  generatePassphrase,
  getStrengthLabel,
  capitalize,
  type GeneratedPassword,
  type Mode,
  type PassphraseSource,
  type Separator,
  type WordLists,
} from './generator';
import styles from './pwgen.module.css';

const BATCH_SIZE = 5;

// ── Component ──

export default function PasswordGenerator() {
  const [wordLists, setWordLists] = useState<WordLists | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [copyFailed, setCopyFailed] = useState(false);
  const [passwords, setPasswords] = useState<GeneratedPassword[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Shared
  const [mode, setMode] = useState<Mode>('memorable');
  const [separator, setSeparator] = useState<Separator>('-');
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  // Memorable mode
  const [useCommon, setUseCommon] = useState(true);
  const [useLeet, setUseLeet] = useState(false);
  const [leetAmount, setLeetAmount] = useState(30);

  // Passphrase mode
  const [passphraseSource, setPassphraseSource] = useState<PassphraseSource>('eff');
  const [wordCount, setWordCount] = useState(5);
  const [passphraseCapitalize, setPassphraseCapitalize] = useState(true);

  const modeSlider = useSlider(mode);
  const sepSlider = useSlider(separator);
  const sourceSlider = useSlider(passphraseSource);

  useEffect(() => {
    const load = (path: string) =>
      fetch(path).then((r) => {
        if (!r.ok) throw new Error(`${path}: ${r.status}`);
        return r.text();
      });
    Promise.all([
      load('/data/pwgen/common-words.txt'),
      load('/data/pwgen/thirteen-letter.txt'),
      load('/data/pwgen/eight-letter.txt'),
      load('/data/pwgen/eff-large.txt'),
      load('/data/pwgen/bip39.txt'),
    ]).then(([common, thirteen, eight, eff, bip39]) => {
      const commonWords = common.split('\n').filter(Boolean);
      const thirteenLetter = thirteen.split('\n').filter(Boolean);
      const eightLetter = eight.split('\n').filter(Boolean);
      setWordLists({
        commonWords,
        thirteenLetter,
        eightLetter,
        common13: commonWords.filter((w) => w.length === 13),
        common8: commonWords.filter((w) => w.length === 8),
        eff: eff.split('\n').filter(Boolean),
        bip39: bip39.split('\n').filter(Boolean),
      });
      setLoading(false);
    }).catch(() => {
      setLoadError(true);
      setLoading(false);
    });
  }, [loadAttempt]);

  // Regenerate when options or seed change (render-time state adjustment)
  const optionsKey = `${mode}-${separator}-${useCommon}-${useLeet}-${leetAmount}-${passphraseSource}-${wordCount}-${passphraseCapitalize}-${seed}`;
  const [prevOptionsKey, setPrevOptionsKey] = useState('');

  if (wordLists && optionsKey !== prevOptionsKey) {
    const batch = Array.from({ length: BATCH_SIZE }, () =>
      mode === 'memorable'
        ? generateMemorable(wordLists, separator, useCommon, useLeet, leetAmount)
        : generatePassphrase(wordLists, separator, passphraseSource, wordCount, passphraseCapitalize),
    );
    setPasswords(batch);
    setSelectedIndex(0);
    setCopied(false);
    setPrevOptionsKey(optionsKey);
  }

  const generate = useCallback(() => {
    setSeed((s) => s + 1);
  }, []);

  // ── Keyboard shortcuts ──

  const copyToClipboard = useCallback(async () => {
    if (!passwords[selectedIndex]) return;
    try {
      await navigator.clipboard.writeText(passwords[selectedIndex].full);
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyFailed(true);
      setTimeout(() => setCopyFailed(false), 3000);
    }
  }, [passwords, selectedIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't hijack keys aimed at an interactive element (button, link,
      // the copyable result, form fields) — Space there activates it instead.
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea, select, [role="button"]')) return;
      if (e.code === 'Space') {
        e.preventDefault();
        generate();
      }
      if (e.code === 'KeyC' && !e.metaKey && !e.ctrlKey) {
        copyToClipboard();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [generate, copyToClipboard]);

  // ── Render ──

  if (loading) {
    return (
      <div className={styles.loading} role="status" aria-label="Loading word lists">
        <div className={styles.loadingDot} />
        <div className={styles.loadingDot} />
        <div className={styles.loadingDot} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center" role="alert">
        <p className="text-sm text-[var(--text)]">
          Couldn&apos;t load the word lists. Check your connection and try again.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => {
            setLoading(true);
            setLoadError(false);
            setLoadAttempt((n) => n + 1);
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const selected = passwords[selectedIndex];
  const strength = selected ? getStrengthLabel(selected.entropy) : null;

  return (
    <div className="grid w-full gap-7 lg:grid-cols-2 lg:gap-10">
      {/* LEFT — controls */}
      <div className="flex min-w-0 flex-col gap-5">
        {/* Mode selector */}
        <div
          className="segmented segmented--accent"
          ref={modeSlider}
        >
          <div className="segmented-thumb" />
          <button
            data-active={mode === 'memorable'}
            className="segmented-item"
            onClick={() => setMode('memorable')}
          >
            Memorable
          </button>
          <button
            data-active={mode === 'passphrase'}
            className="segmented-item"
            onClick={() => setMode('passphrase')}
          >
            Passphrase
          </button>
        </div>

        {/* Controls */}
        <div className={styles.controls}>
          {/* Separator — shared */}
          <div className={styles.controlRow}>
            <span className={styles.controlLabel}>Separator</span>
            <div
              className="segmented"
              ref={sepSlider}
            >
              <div className="segmented-thumb" />
              {([['', 'None'], ['-', 'Hyphen'], ['.', 'Dot']] as [Separator, string][]).map(([val, label]) => (
                <button
                  key={val}
                  data-active={separator === val}
                  className="segmented-item"
                  onClick={() => setSeparator(val)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {mode === 'memorable' && (
            <>
              <label className={styles.controlRow} style={{ cursor: 'pointer' }}>
                <span className={styles.controlLabel}>Common Words</span>
                <span className="switch">
                  <input type="checkbox" checked={useCommon} onChange={(e) => setUseCommon(e.target.checked)} />
                  <span className="switch-track" />
                </span>
              </label>

              <label className={styles.controlRow} style={{ cursor: 'pointer' }}>
                <span className={styles.controlLabel}>Leetify</span>
                <span className="switch">
                  <input type="checkbox" checked={useLeet} onChange={(e) => setUseLeet(e.target.checked)} />
                  <span className="switch-track" />
                </span>
              </label>

              {useLeet && (
                <div className={styles.rangeGroup}>
                  <div className={styles.rangeHeader}>
                    <span className={styles.controlLabel}>Leetify Amount</span>
                    <span className={styles.rangeValue}>{leetAmount}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={leetAmount}
                    onChange={(e) => setLeetAmount(Number(e.target.value))}
                    className="range"
                  />
                </div>
              )}
            </>
          )}

          {mode === 'passphrase' && (
            <>
              <div className={styles.controlRow}>
                <span className={styles.controlLabel}>Word List</span>
                <div
                  className="segmented"
                  ref={sourceSlider}
                >
                  <div className="segmented-thumb" />
                  <button
                    data-active={passphraseSource === 'eff'}
                    className="segmented-item"
                    onClick={() => setPassphraseSource('eff')}
                  >
                    EFF
                  </button>
                  <button
                    data-active={passphraseSource === 'bip39'}
                    className="segmented-item"
                    onClick={() => setPassphraseSource('bip39')}
                  >
                    BIP-39
                  </button>
                </div>
              </div>

              <div className={styles.rangeGroup}>
                <div className={styles.rangeHeader}>
                  <span className={styles.controlLabel}>Words</span>
                  <span className={styles.rangeValue}>{wordCount}</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={8}
                  value={wordCount}
                  onChange={(e) => setWordCount(Number(e.target.value))}
                  className="range"
                />
              </div>

              <label className={styles.controlRow} style={{ cursor: 'pointer' }}>
                <span className={styles.controlLabel}>Capitalize</span>
                <span className="switch">
                  <input type="checkbox" checked={passphraseCapitalize} onChange={(e) => setPassphraseCapitalize(e.target.checked)} />
                  <span className="switch-track" />
                </span>
              </label>
            </>
          )}
        </div>

        {/* Generate button */}
        <button className="btn btn-primary btn-block" onClick={generate}>
          <span>Generate</span>
          <kbd className="kbd">Space</kbd>
        </button>

        {/* Source credits */}
        <div className={styles.credit}>
          <a href="https://github.com/MichaelWehar/Public-Domain-Word-Lists" target="_blank" rel="noopener noreferrer">
            Public Domain Word Lists
          </a>
          {' '}&middot;{' '}
          <a href="https://www.eff.org/dice" target="_blank" rel="noopener noreferrer">
            EFF Large Wordlist
          </a>
          {' '}(CC-BY-3.0) &middot;{' '}
          <a href="https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt" target="_blank" rel="noopener noreferrer">
            BIP-39
          </a>
          {' '}(MIT)
        </div>
      </div>

      {/* RIGHT — result */}
      <div className="lg:border-l lg:border-white/[0.06] lg:pl-10">
        <div className="flex flex-col gap-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between gap-3">
            <span className="eyebrow-system">Result</span>
            <div className={styles.hints}>
              <span><kbd className="kbd">Space</kbd> new</span>
              <span><kbd className="kbd">C</kbd> copy</span>
            </div>
          </div>

          {/* Primary password display */}
          {selected && (
            <div
              className={`${styles.result} ${copied ? styles.resultCopied : ''}`}
              onClick={copyToClipboard}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyToClipboard(); } }}
              title="Click to copy"
              role="button"
              tabIndex={0}
              aria-label={`Password: ${selected.full}. Click to copy.`}
            >
              <div className={styles.passwordSegments}>
                {selected.segments.map((seg, i) => (
                  <span key={i} className={styles[`seg${capitalize(seg.type)}` as keyof typeof styles]}>
                    {seg.text}
                  </span>
                ))}
              </div>
              <div className={styles.resultMeta}>
                <span className={styles.charCount}>{selected.full.length} chars</span>
                <span className={styles.copyHint}>
                  {copyFailed ? 'Copy failed. Select and copy manually' : copied ? 'Copied!' : 'Click to copy'}
                </span>
              </div>
            </div>
          )}

          {/* Announce copy feedback without reading the password aloud */}
          <span className="sr-only" aria-live="polite">
            {copyFailed ? 'Copy failed' : copied ? 'Password copied to clipboard' : ''}
          </span>

          {/* Strength meter */}
          {strength && (
            <div className="flex w-full items-center gap-3">
              <div className="meter">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="meter-seg" data-on={i <= strength.level} />
                ))}
              </div>
              <span className="whitespace-nowrap font-mono text-[0.66rem] uppercase tracking-[0.06em] tabular-nums text-[var(--color-graphite)]">
                {selected.entropy} bits &middot; {strength.label}
              </span>
            </div>
          )}

          {/* Batch list */}
          <div className={styles.batchList}>
            {passwords.map((p, i) => (
              <button
                key={i}
                className={`${styles.batchItem} ${i === selectedIndex ? styles.batchSelected : ''}`}
                onClick={() => {
                  setSelectedIndex(i);
                  setCopied(false);
                }}
              >
                <span className={styles.batchPassword}>{p.full}</span>
                <span className={styles.batchIndex}>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
