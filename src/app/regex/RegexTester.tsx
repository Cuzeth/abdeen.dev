'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import styles from './regex.module.css';

type Flag = 'g' | 'i' | 'm' | 's';

const ALL_FLAGS: Flag[] = ['g', 'i', 'm', 's'];

const FLAG_NAMES: Record<Flag, string> = {
  g: 'Global',
  i: 'Case insensitive',
  m: 'Multiline',
  s: 'Dot matches newline',
};

interface MatchInfo {
  start: number;
  end: number;
  text: string;
  groups: (string | undefined)[];
}

// Matching runs in a Web Worker so a catastrophic-backtracking pattern
// (e.g. (a+)+$ against a long string) can be killed after a timeout
// instead of freezing the page.
const MATCH_TIMEOUT_MS = 2000;
const MAX_MATCHES = 5000;

const WORKER_SOURCE = `
self.onmessage = (e) => {
  const { id, pattern, flags, testString, replaceString, doReplace } = e.data;
  const matches = [];
  let replaceResult = '';
  try {
    const globalFlags = flags.includes('g') ? flags : flags + 'g';
    const re = new RegExp(pattern, globalFlags);
    let m;
    while ((m = re.exec(testString)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, text: m[0], groups: m.slice(1) });
      if (m[0].length === 0) re.lastIndex++;
      if (matches.length >= ${MAX_MATCHES}) break;
    }
    if (doReplace) {
      replaceResult = testString.replace(new RegExp(pattern, flags), replaceString);
    }
  } catch {
    // Syntax errors are surfaced on the main thread; ignore here.
  }
  self.postMessage({ id, matches, replaceResult });
};
`;

const CHEATSHEET = [
  {
    title: 'Characters',
    items: [
      { pattern: '.', desc: 'Any character (except newline)' },
      { pattern: '\\d', desc: 'Digit (0-9)' },
      { pattern: '\\D', desc: 'Not a digit' },
      { pattern: '\\w', desc: 'Word character (a-z, A-Z, 0-9, _)' },
      { pattern: '\\W', desc: 'Not a word character' },
      { pattern: '\\s', desc: 'Whitespace (space, tab, newline)' },
      { pattern: '\\S', desc: 'Not whitespace' },
    ],
  },
  {
    title: 'Anchors',
    items: [
      { pattern: '^', desc: 'Start of string (or line with m flag)' },
      { pattern: '$', desc: 'End of string (or line with m flag)' },
      { pattern: '\\b', desc: 'Word boundary' },
    ],
  },
  {
    title: 'Quantifiers',
    items: [
      { pattern: '*', desc: 'Zero or more' },
      { pattern: '+', desc: 'One or more' },
      { pattern: '?', desc: 'Zero or one (optional)' },
      { pattern: '{n}', desc: 'Exactly n times' },
      { pattern: '{n,m}', desc: 'Between n and m times' },
      { pattern: '*?', desc: 'Zero or more (lazy)' },
    ],
  },
  {
    title: 'Groups & Lookaround',
    items: [
      { pattern: '(abc)', desc: 'Capture group' },
      { pattern: '(?:abc)', desc: 'Non-capturing group' },
      { pattern: '(?=abc)', desc: 'Lookahead' },
      { pattern: '(?!abc)', desc: 'Negative lookahead' },
      { pattern: '(?<=abc)', desc: 'Lookbehind' },
      { pattern: 'a|b', desc: 'Either a or b' },
    ],
  },
  {
    title: 'Character Classes',
    items: [
      { pattern: '[abc]', desc: 'Any of a, b, or c' },
      { pattern: '[^abc]', desc: 'Not a, b, or c' },
      { pattern: '[a-z]', desc: 'Range: a through z' },
      { pattern: '[0-9]', desc: 'Range: 0 through 9' },
    ],
  },
  {
    title: 'Flags',
    items: [
      { pattern: 'g', desc: 'Global \u2014 find all matches' },
      { pattern: 'i', desc: 'Case insensitive' },
      { pattern: 'm', desc: 'Multiline \u2014 ^ and $ match per line' },
      { pattern: 's', desc: 'Dotall \u2014 . matches newlines too' },
    ],
  },
] as const;

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [testString, setTestString] = useState('');
  const [flags, setFlags] = useState<Set<Flag>>(new Set(['g']));
  const [showReplace, setShowReplace] = useState(false);
  const [replaceString, setReplaceString] = useState('');
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  const toggleFlag = useCallback((flag: Flag) => {
    setFlags((prev) => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  }, []);

  const flagStr = useMemo(() => ALL_FLAGS.filter((f) => flags.has(f)).join(''), [flags]);

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: null };
    try {
      return { regex: new RegExp(pattern, flagStr), error: null };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flagStr]);

  // Results are keyed to the inputs that produced them; anything else in
  // state is stale and rendered as "no result yet".
  const inputKey = regex && testString
    ? [regex.source, regex.flags, testString, showReplace ? replaceString : ''].join('\u0000')
    : '';
  const [result, setResult] = useState<{
    key: string;
    matches: MatchInfo[];
    replaceResult: string;
    timedOut: boolean;
  }>({ key: '', matches: [], replaceResult: '', timedOut: false });

  const { matches, replaceResult, timedOut } =
    result.key === inputKey && inputKey !== ''
      ? result
      : { matches: [] as MatchInfo[], replaceResult: '', timedOut: false };

  const workerRef = useRef<Worker | null>(null);
  const workerUrlRef = useRef<string | null>(null);
  const requestIdRef = useRef(0);

  const spawnWorker = useCallback(() => {
    if (!workerUrlRef.current) {
      workerUrlRef.current = URL.createObjectURL(
        new Blob([WORKER_SOURCE], { type: 'text/javascript' }),
      );
    }
    workerRef.current = new Worker(workerUrlRef.current);
    return workerRef.current;
  }, []);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      if (workerUrlRef.current) URL.revokeObjectURL(workerUrlRef.current);
    };
  }, []);

  useEffect(() => {
    if (!regex || !testString || !inputKey) return;

    const key = inputKey;
    const id = ++requestIdRef.current;
    const worker = workerRef.current ?? spawnWorker();

    const timer = window.setTimeout(() => {
      if (requestIdRef.current !== id) return;
      // Pattern is still running — kill the worker and report it
      worker.terminate();
      workerRef.current = null;
      setResult({ key, matches: [], replaceResult: '', timedOut: true });
    }, MATCH_TIMEOUT_MS);

    worker.onmessage = (e: MessageEvent<{ id: number; matches: MatchInfo[]; replaceResult: string }>) => {
      if (e.data.id !== id) return;
      window.clearTimeout(timer);
      setResult({ key, matches: e.data.matches, replaceResult: e.data.replaceResult, timedOut: false });
    };

    worker.postMessage({
      id,
      pattern: regex.source,
      flags: regex.flags,
      testString,
      replaceString,
      doReplace: showReplace,
    });

    return () => window.clearTimeout(timer);
  }, [regex, testString, replaceString, showReplace, inputKey, spawnWorker]);

  const highlighted = useMemo(() => {
    if (!testString) return null;
    if (matches.length === 0) return <span>{testString}</span>;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    matches.forEach((m, i) => {
      if (m.start > lastIndex) {
        parts.push(<span key={`t-${i}`}>{testString.slice(lastIndex, m.start)}</span>);
      }
      parts.push(
        <span key={`m-${i}`} className={styles.match}>
          {m.text}
        </span>
      );
      lastIndex = m.end;
    });
    if (lastIndex < testString.length) {
      parts.push(<span key="tail">{testString.slice(lastIndex)}</span>);
    }
    return parts;
  }, [testString, matches]);

  const hasResult = Boolean(pattern && testString && !error && !timedOut);

  return (
    <div className="flex flex-col gap-7">
      {/* Two-pane: inputs | live results */}
      <div className="grid gap-7 lg:grid-cols-2 lg:gap-9">
        {/* LEFT — inputs */}
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="regex-pattern" className="field-label">Pattern</label>
            <div className={styles.patternRow}>
              <input
                id="regex-pattern"
                type="text"
                className={`input input-mono ${error ? styles.inputError : ''}`}
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                spellCheck={false}
                aria-invalid={!!error}
                aria-describedby={error ? 'regex-error' : undefined}
              />
              <div className={styles.flags}>
                {ALL_FLAGS.map((f) => (
                  <button
                    key={f}
                    className={`${styles.flagBtn} ${flags.has(f) ? styles.flagBtnActive : ''}`}
                    onClick={() => toggleFlag(f)}
                    title={FLAG_NAMES[f]}
                    aria-label={`${FLAG_NAMES[f]} flag`}
                    aria-pressed={flags.has(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            {error && <span id="regex-error" className="text-xs text-[var(--color-red)]" role="alert">{error}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="regex-test" className="field-label">Test String</label>
            <textarea
              id="regex-test"
              className="textarea input-mono"
              style={{ minHeight: '160px' }}
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter test string..."
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col">
            <button
              className="btn btn-ghost btn-block"
              data-active={showReplace}
              onClick={() => setShowReplace(!showReplace)}
            >
              {showReplace ? 'Hide Replace' : 'Show Replace'}
            </button>
            <div className={`${styles.collapse} ${showReplace ? styles.collapseOpen : ''}`}>
              <div className={styles.collapseInner}>
                <input
                  type="text"
                  className="input input-mono"
                  value={replaceString}
                  onChange={(e) => setReplaceString(e.target.value)}
                  placeholder="Replacement string..."
                  aria-label="Replacement string"
                  spellCheck={false}
                />
                {testString && regex && (
                  <div className="flex flex-col gap-2">
                    <span className="field-label">Result</span>
                    <div className={styles.outputBox}>{replaceResult}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — live results */}
        <div className="lg:border-l lg:border-white/[0.06] lg:pl-9">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <span className="eyebrow-system">Matches</span>
              {hasResult && (
                <div className="flex items-center gap-2">
                  <span className="chip">
                    {matches.length} match{matches.length !== 1 ? 'es' : ''}
                  </span>
                  {matches.length > 0 && matches[0].groups.length > 0 && (
                    <span className="chip">
                      {matches[0].groups.length} group{matches[0].groups.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>

            {error ? (
              <div className={styles.placeholder}>{error}</div>
            ) : timedOut ? (
              <div className={styles.placeholder} role="alert">
                This pattern took too long to run and was stopped — it may
                suffer from catastrophic backtracking. Try simplifying it.
              </div>
            ) : hasResult ? (
              <div className={styles.outputBox}>{highlighted}</div>
            ) : (
              <div className={styles.placeholder}>
                Enter a pattern and test string to see matches.
              </div>
            )}

            {matches.length > 0 && matches.some((m) => m.groups.length > 0) && (
              <div className="flex flex-col gap-2">
                <span className="field-label">Capture Groups</span>
                <div className={styles.groups}>
                  {matches.map((m, mi) =>
                    m.groups.map((g, gi) => (
                      <div key={`${mi}-${gi}`} className={styles.group}>
                        <span className={styles.groupIndex}>
                          Match {mi + 1}, Group {gi + 1}:
                        </span>
                        {g ?? '(empty)'}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cheatsheet — full width */}
      <div className="flex flex-col">
        <button
          className="btn btn-ghost btn-block"
          data-active={showCheatsheet}
          onClick={() => setShowCheatsheet(!showCheatsheet)}
        >
          {showCheatsheet ? 'Hide Cheatsheet' : 'Regex Cheatsheet'}
        </button>
        <div className={`${styles.collapse} ${showCheatsheet ? styles.collapseOpen : ''}`}>
          <div className={styles.collapseInner}>
            <div className={styles.cheatsheet}>
              {CHEATSHEET.map((section) => (
                <div key={section.title} className={styles.cheatSection}>
                  <h3 className={styles.cheatTitle}>{section.title}</h3>
                  <div className={styles.cheatItems}>
                    {section.items.map((item) => (
                      <div key={item.pattern} className={styles.cheatItem}>
                        <code className={styles.cheatPattern}>{item.pattern}</code>
                        <span className={styles.cheatDesc}>{item.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
