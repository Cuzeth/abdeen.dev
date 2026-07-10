import { describe, expect, test } from 'bun:test';
import {
  calcPassphraseEntropy,
  capitalize,
  generateMemorable,
  generatePassphrase,
  getStrengthLabel,
  leetify,
  numberScore,
  wordScore,
  type WordLists,
} from './generator';

const lists: WordLists = {
  commonWords: [],
  thirteenLetter: ['zzzzzzzzzzzzz'],
  eightLetter: ['zzzzzzzz'],
  common13: ['abcdefghijklm'],
  common8: ['abcdefgh'],
  eff: ['alpha', 'bravo', 'charlie'],
  bip39: ['delta', 'echo'],
};

describe('scoring', () => {
  test('wordScore sums Scrabble values, case-insensitively', () => {
    expect(wordScore('cab')).toBe(7); // 3 + 1 + 3
    expect(wordScore('QUIZ')).toBe(22); // 10 + 1 + 1 + 10
  });

  test('numberScore penalizes repeats and runs', () => {
    expect(numberScore(111234)).toBe(1); // triple repeat
    expect(numberScore(123987)).toBe(1); // ascending run
    expect(numberScore(864209)).toBe(2);
  });
});

describe('transforms', () => {
  test('capitalize uppercases the first letter only', () => {
    expect(capitalize('word')).toBe('Word');
  });

  test('leetify with probability 0 only lowercases', () => {
    expect(leetify('LEET', 0)).toBe('leet');
  });

  test('leetify with probability 1 substitutes every mapped character', () => {
    expect(leetify('aeiou', 1)).toBe('4310u');
  });
});

describe('entropy', () => {
  test('passphrase entropy is log2(pool) * words, rounded', () => {
    expect(calcPassphraseEntropy(7776, 5)).toBe(65);
    expect(calcPassphraseEntropy(2048, 4)).toBe(44);
  });

  test('strength labels at their boundaries', () => {
    expect(getStrengthLabel(70)).toEqual({ label: 'Exceptional', level: 4 });
    expect(getStrengthLabel(69)).toEqual({ label: 'Strong', level: 3 });
    expect(getStrengthLabel(55)).toEqual({ label: 'Strong', level: 3 });
    expect(getStrengthLabel(54)).toEqual({ label: 'Good', level: 2 });
    expect(getStrengthLabel(40)).toEqual({ label: 'Good', level: 2 });
    expect(getStrengthLabel(39)).toEqual({ label: 'Moderate', level: 1 });
  });
});

describe('generateMemorable', () => {
  test('produces word-number-special-word with the separator', () => {
    const pw = generateMemorable(lists, '-', true, false, 0);
    expect(pw.full).toMatch(/^abcdefghijklm-\d{6}[!?$&*@#%^]-Abcdefgh$/);
    expect(pw.segments.map((s) => s.text).join('')).toBe(pw.full);
    expect(pw.entropy).toBeGreaterThan(0);
  });

  test('omits separator segments when the separator is empty', () => {
    const pw = generateMemorable(lists, '', true, false, 0);
    expect(pw.segments).toHaveLength(4);
    expect(pw.full).toMatch(/^abcdefghijklm\d{6}[!?$&*@#%^]Abcdefgh$/);
  });

  test('uses the full word lists when common words are off', () => {
    const pw = generateMemorable(lists, '-', false, false, 0);
    expect(pw.full).toMatch(/^zzzzzzzzzzzzz-\d{6}[!?$&*@#%^]-Zzzzzzzz$/);
  });
});

describe('generatePassphrase', () => {
  test('joins capitalized words from the chosen pool', () => {
    const pw = generatePassphrase(lists, '.', 'eff', 4, true);
    expect(pw.full).toMatch(/^(Alpha|Bravo|Charlie)(\.(Alpha|Bravo|Charlie)){3}$/);
    expect(pw.segments).toHaveLength(7); // 4 words + 3 separators
    expect(pw.entropy).toBe(6); // round(log2(3) * 4)
  });

  test('respects the source and capitalization flags', () => {
    const pw = generatePassphrase(lists, '', 'bip39', 3, false);
    expect(pw.full).toMatch(/^(delta|echo){3}$/);
    expect(pw.segments).toHaveLength(3);
  });
});
