// Password generation engine — pure logic, no React. Two modes:
//   Memorable — recreates Apple's discontinued Keychain "generate memorable password"
//               Format: [13-letter word][sep][6-digit number][special][sep][8-letter word]
//   Passphrase — diceware-style using EFF or BIP-39 curated word lists
//
// Word list credits:
//   common-words.txt — Public Domain Word Lists by Michael Wehar (github.com/MichaelWehar/Public-Domain-Word-Lists)
//   eff-large.txt    — EFF Large Wordlist for Passphrases, CC-BY-3.0 (eff.org/dice)
//   bip39.txt        — BIP-39 English Word List, MIT License (github.com/bitcoin/bips)

// ── Constants ──

export const SPECIAL_CHARACTERS = '!?$&*@#%^';

const SCRABBLE_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8,
  k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1,
  u: 1, v: 4, w: 4, x: 8, y: 4, z: 10,
};

const LEET_MAP: Record<string, string> = {
  a: '4', b: '8', e: '3', i: '1', l: '1', o: '0', s: '5', t: '7', g: '9',
};

// ── Types ──

export type Separator = '' | '-' | '.';
export type Mode = 'memorable' | 'passphrase';
export type PassphraseSource = 'eff' | 'bip39';

export interface GeneratedPassword {
  segments: { text: string; type: 'word' | 'number' | 'special' | 'separator' }[];
  full: string;
  entropy: number;
}

export interface WordLists {
  commonWords: string[];
  thirteenLetter: string[];
  eightLetter: string[];
  common13: string[];
  common8: string[];
  eff: string[];
  bip39: string[];
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

export function wordScore(word: string): number {
  return [...word.toLowerCase()].reduce((sum, ch) => sum + (SCRABBLE_SCORES[ch] ?? 0), 0);
}

export function numberScore(n: number): number {
  const s = String(n);
  if (/(\d)\1{2,}/.test(s)) return 1;
  if (/012|123|234|345|456|567|678|789/.test(s)) return 1;
  return 2;
}

function selectTopN<T>(items: T[], scoreFn: (item: T) => number, n = 1027): T {
  const sorted = [...items].sort((a, b) => scoreFn(a) - scoreFn(b));
  return secureChoice(sorted.slice(0, Math.min(n, sorted.length)));
}

export function leetify(word: string, probability: number): string {
  return [...word.toLowerCase()]
    .map((ch) => (LEET_MAP[ch] && secureRandom() < probability ? LEET_MAP[ch] : ch))
    .join('');
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Entropy ──

export function calcMemorableEntropy(pool13: number, pool8: number, passwordLength: number, useLeet: boolean): number {
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

export function calcPassphraseEntropy(poolSize: number, wordCount: number): number {
  return Math.round(Math.log2(poolSize) * wordCount);
}

export function getStrengthLabel(entropy: number): { label: string; level: number } {
  if (entropy >= 70) return { label: 'Exceptional', level: 4 };
  if (entropy >= 55) return { label: 'Strong', level: 3 };
  if (entropy >= 40) return { label: 'Good', level: 2 };
  return { label: 'Moderate', level: 1 };
}

// ── Generators ──

export function generateMemorable(
  lists: WordLists,
  sep: Separator,
  common: boolean,
  leet: boolean,
  leetAmt: number,
): GeneratedPassword {
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
}

export function generatePassphrase(
  lists: WordLists,
  sep: Separator,
  source: PassphraseSource,
  count: number,
  cap: boolean,
): GeneratedPassword {
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
}
