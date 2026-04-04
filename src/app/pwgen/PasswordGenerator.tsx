// Password Generator
// Two modes:
//   Memorable — recreates Apple's discontinued Keychain "generate memorable password"
//               Format: [13-letter word][sep][6-digit number][special][sep][8-letter word]
//   Passphrase — diceware-style using EFF or BIP-39 curated word lists
//
// Word list credits:
//   common-words.txt — Public Domain Word Lists by Michael Wehar (github.com/MichaelWehar/Public-Domain-Word-Lists)
//   eff-large.txt    — EFF Large Wordlist for Passphrases, CC-BY-3.0 (eff.org/dice)
//   bip39.txt        — BIP-39 English Word List, MIT License (github.com/bitcoin/bips)

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './pwgen.module.css';

// ── Constants ──

const SPECIAL_CHARACTERS = '!?$&*@#%^';

const SCRABBLE_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8,
  k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1,
  u: 1, v: 4, w: 4, x: 8, y: 4, z: 10,
};

const LEET_MAP: Record<string, string> = {
  a: '4', b: '8', e: '3', i: '1', l: '1', o: '0', s: '5', t: '7', g: '9',
};

type Separator = '' | '-' | '.';
type Mode = 'memorable' | 'passphrase';
type PassphraseSource = 'eff' | 'bip39';

// ── Types ──

interface GeneratedPassword {
  segments: { text: string; type: 'word' | 'number' | 'special' | 'separator' }[];
  full: string;
  entropy: number;
}

// ── Crypto helpers ──

function secureRandom(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1);
}

function secureChoice<T>(arr: T[]): T {
  return arr[Math.floor(secureRandom() * arr.length)];
}

function secureRandInt(min: number, max: number): number {
  return Math.floor(secureRandom() * (max - min + 1)) + min;
}

// ── Scoring helpers (memorable mode) ──

function wordScore(word: string): number {
  return [...word.toLowerCase()].reduce((sum, ch) => sum + (SCRABBLE_SCORES[ch] ?? 0), 0);
}

function numberScore(n: number): number {
  const s = String(n);
  if (/(\d)\1{2,}/.test(s)) return 1;
  if (/012|123|234|345|456|567|678|789/.test(s)) return 1;
  return 2;
}

function selectTopN<T>(items: T[], scoreFn: (item: T) => number, n = 1027): T {
  const sorted = [...items].sort((a, b) => scoreFn(a) - scoreFn(b));
  return secureChoice(sorted.slice(0, Math.min(n, sorted.length)));
}

function leetify(word: string, probability: number): string {
  return [...word.toLowerCase()]
    .map((ch) => (LEET_MAP[ch] && secureRandom() < probability ? LEET_MAP[ch] : ch))
    .join('');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Entropy ──

function calcMemorableEntropy(pool13: number, pool8: number, passwordLength: number, useLeet: boolean): number {
  const genEntropy =
    Math.log2(pool13) +
    Math.log2(pool8) +
    Math.log2(900000) +
    Math.log2(SPECIAL_CHARACTERS.length) +
    (useLeet ? 4 : 0);

  const charsetSize = 26 + 26 + 10 + SPECIAL_CHARACTERS.length;
  const charEntropy = Math.log2(charsetSize) * passwordLength;

  return Math.round(Math.max(genEntropy, charEntropy * 0.4));
}

function calcPassphraseEntropy(poolSize: number, wordCount: number): number {
  return Math.round(Math.log2(poolSize) * wordCount);
}

function getStrengthLabel(entropy: number): { label: string; level: number } {
  if (entropy >= 70) return { label: 'Exceptional', level: 4 };
  if (entropy >= 55) return { label: 'Strong', level: 3 };
  if (entropy >= 40) return { label: 'Good', level: 2 };
  return { label: 'Moderate', level: 1 };
}

// ── Word lists ──

interface WordLists {
  commonWords: string[];
  thirteenLetter: string[];
  eightLetter: string[];
  common13: string[];
  common8: string[];
  eff: string[];
  bip39: string[];
}

const BATCH_SIZE = 5;

// ── Component ──

export default function PasswordGenerator() {
  const [wordLists, setWordLists] = useState<WordLists | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState<GeneratedPassword[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Shared
  const [mode, setMode] = useState<Mode>('memorable');
  const [separator, setSeparator] = useState<Separator>('-');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Memorable mode
  const [useCommon, setUseCommon] = useState(true);
  const [useLeet, setUseLeet] = useState(false);
  const [leetAmount, setLeetAmount] = useState(30);

  // Passphrase mode
  const [passphraseSource, setPassphraseSource] = useState<PassphraseSource>('eff');
  const [wordCount, setWordCount] = useState(5);
  const [passphraseCapitalize, setPassphraseCapitalize] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/pwgen/common-words.txt').then((r) => r.text()),
      fetch('/data/pwgen/thirteen-letter.txt').then((r) => r.text()),
      fetch('/data/pwgen/eight-letter.txt').then((r) => r.text()),
      fetch('/data/pwgen/eff-large.txt').then((r) => r.text()),
      fetch('/data/pwgen/bip39.txt').then((r) => r.text()),
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
    });
  }, []);

  // ── Generators ──

  const generateMemorable = useCallback(
    (lists: WordLists, sep: Separator, common: boolean, leet: boolean, leetAmt: number): GeneratedPassword => {
      let word13: string;
      let word8: string;
      let pool13: number;
      let pool8: number;

      if (common) {
        word13 = selectTopN(lists.common13, wordScore);
        word8 = capitalize(selectTopN(lists.common8, wordScore));
        pool13 = lists.common13.length;
        pool8 = lists.common8.length;
      } else {
        word13 = secureChoice(lists.thirteenLetter);
        word8 = capitalize(secureChoice(lists.eightLetter));
        pool13 = lists.thirteenLetter.length;
        pool8 = lists.eightLetter.length;
      }

      const possibleNumbers = Array.from({ length: 1000 }, () => secureRandInt(100000, 999999));
      const number = String(selectTopN(possibleNumbers, numberScore));

      if (leet) {
        word13 = leetify(word13, leetAmt / 100);
        word8 = capitalize(leetify(word8, leetAmt / 100));
      }

      const special = secureChoice([...SPECIAL_CHARACTERS]);

      const segments: GeneratedPassword['segments'] = [
        { text: word13, type: 'word' },
        ...(sep ? [{ text: sep, type: 'separator' as const }] : []),
        { text: number, type: 'number' },
        { text: special, type: 'special' },
        ...(sep ? [{ text: sep, type: 'separator' as const }] : []),
        { text: word8, type: 'word' },
      ];

      const full = segments.map((s) => s.text).join('');
      const entropy = calcMemorableEntropy(pool13, pool8, full.length, leet);

      return { segments, full, entropy };
    },
    [],
  );

  const generatePassphrase = useCallback(
    (lists: WordLists, sep: Separator, source: PassphraseSource, count: number, cap: boolean): GeneratedPassword => {
      const pool = source === 'eff' ? lists.eff : lists.bip39;
      const words = Array.from({ length: count }, () => {
        const w = secureChoice(pool);
        return cap ? capitalize(w) : w;
      });

      const segments: GeneratedPassword['segments'] = [];
      words.forEach((w, i) => {
        if (i > 0 && sep) segments.push({ text: sep, type: 'separator' });
        segments.push({ text: w, type: 'word' });
      });

      const full = segments.map((s) => s.text).join('');
      const entropy = calcPassphraseEntropy(pool.length, count);

      return { segments, full, entropy };
    },
    [],
  );

  const generate = useCallback(() => {
    if (!wordLists) return;
    setGenerating(true);
    const batch = Array.from({ length: BATCH_SIZE }, () =>
      mode === 'memorable'
        ? generateMemorable(wordLists, separator, useCommon, useLeet, leetAmount)
        : generatePassphrase(wordLists, separator, passphraseSource, wordCount, passphraseCapitalize),
    );
    setPasswords(batch);
    setSelectedIndex(0);
    setCopied(false);
    requestAnimationFrame(() => setGenerating(false));
  }, [wordLists, mode, useCommon, useLeet, leetAmount, separator, passphraseSource, wordCount, passphraseCapitalize, generateMemorable, generatePassphrase]);

  useEffect(() => {
    if (wordLists) generate();
  }, [wordLists, generate]);

  // ── Keyboard shortcuts ──

  const copyToClipboard = useCallback(async () => {
    if (!passwords[selectedIndex]) return;
    await navigator.clipboard.writeText(passwords[selectedIndex].full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [passwords, selectedIndex]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
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
      <div className={styles.loading}>
        <div className={styles.loadingDot} />
        <div className={styles.loadingDot} />
        <div className={styles.loadingDot} />
      </div>
    );
  }

  const selected = passwords[selectedIndex];
  const strength = selected ? getStrengthLabel(selected.entropy) : null;

  return (
    <div className={styles.container} ref={containerRef}>
      {/* Mode selector */}
      <div className={styles.modeRow}>
        <button
          className={`${styles.modeBtn} ${mode === 'memorable' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('memorable')}
        >
          Memorable
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'passphrase' ? styles.modeBtnActive : ''}`}
          onClick={() => setMode('passphrase')}
        >
          Passphrase
        </button>
      </div>

      {/* Primary password display */}
      {selected && (
        <div
          className={`${styles.result} ${copied ? styles.resultCopied : ''}`}
          onClick={copyToClipboard}
          title="Click to copy"
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
            <span className={styles.copyHint}>{copied ? 'Copied!' : 'Click to copy'}</span>
          </div>
        </div>
      )}

      {/* Strength meter */}
      {strength && (
        <div className={styles.strengthRow}>
          <div className={styles.strengthBar}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`${styles.strengthSegment} ${i <= strength.level ? styles[`strength${strength.level}`] : ''}`}
              />
            ))}
          </div>
          <span className={styles.strengthLabel}>
            {selected.entropy} bits &middot; {strength.label}
          </span>
        </div>
      )}

      {/* Batch list */}
      <div className={`${styles.batchList} ${generating ? styles.batchFresh : ''}`}>
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

      {/* Generate button */}
      <button className={styles.generateBtn} onClick={generate}>
        <span>Generate</span>
        <kbd className={styles.kbd}>Space</kbd>
      </button>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Separator — shared */}
        <div className={styles.controlRow}>
          <span className={styles.controlLabel}>Separator</span>
          <div className={styles.segmentedControl}>
            {([['', 'None'], ['-', 'Hyphen'], ['.', 'Dot']] as [Separator, string][]).map(([val, label]) => (
              <button
                key={val}
                className={`${styles.segBtn} ${separator === val ? styles.segBtnActive : ''}`}
                onClick={() => setSeparator(val)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'memorable' && (
          <>
            <label className={styles.toggle}>
              <span className={styles.controlLabel}>Common Words</span>
              <input type="checkbox" checked={useCommon} onChange={(e) => setUseCommon(e.target.checked)} />
              <span className={styles.slider} />
            </label>

            <label className={styles.toggle}>
              <span className={styles.controlLabel}>Leetify</span>
              <input type="checkbox" checked={useLeet} onChange={(e) => setUseLeet(e.target.checked)} />
              <span className={styles.slider} />
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
                  className={styles.range}
                />
              </div>
            )}
          </>
        )}

        {mode === 'passphrase' && (
          <>
            <div className={styles.controlRow}>
              <span className={styles.controlLabel}>Word List</span>
              <div className={styles.segmentedControl}>
                <button
                  className={`${styles.segBtn} ${passphraseSource === 'eff' ? styles.segBtnActive : ''}`}
                  onClick={() => setPassphraseSource('eff')}
                >
                  EFF
                </button>
                <button
                  className={`${styles.segBtn} ${passphraseSource === 'bip39' ? styles.segBtnActive : ''}`}
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
                className={styles.range}
              />
            </div>

            <label className={styles.toggle}>
              <span className={styles.controlLabel}>Capitalize</span>
              <input type="checkbox" checked={passphraseCapitalize} onChange={(e) => setPassphraseCapitalize(e.target.checked)} />
              <span className={styles.slider} />
            </label>
          </>
        )}
      </div>

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

      {/* Keyboard hints */}
      <div className={styles.hints}>
        <span><kbd className={styles.kbdSmall}>Space</kbd> regenerate</span>
        <span><kbd className={styles.kbdSmall}>C</kbd> copy</span>
      </div>
    </div>
  );
}
