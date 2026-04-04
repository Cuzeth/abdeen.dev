'use client';

import { useState, useMemo, useCallback } from 'react';
import styles from './regex.module.css';

type Flag = 'g' | 'i' | 'm' | 's';

const ALL_FLAGS: Flag[] = ['g', 'i', 'm', 's'];

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

  const { regex, error } = useMemo(() => {
    if (!pattern) return { regex: null, error: null };
    try {
      const flagStr = ALL_FLAGS.filter((f) => flags.has(f)).join('');
      return { regex: new RegExp(pattern, flagStr), error: null };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flags]);

  const matches = useMemo(() => {
    if (!regex || !testString) return [];
    const results: { start: number; end: number; text: string; groups: string[] }[] = [];
    const globalRegex = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
    let match;
    while ((match = globalRegex.exec(testString)) !== null) {
      results.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[0],
        groups: match.slice(1),
      });
      if (match[0].length === 0) globalRegex.lastIndex++;
    }
    return results;
  }, [regex, testString]);

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

  const replaceResult = useMemo(() => {
    if (!regex || !testString || !showReplace) return '';
    try {
      return testString.replace(regex, replaceString);
    } catch {
      return '';
    }
  }, [regex, testString, showReplace, replaceString]);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <label htmlFor="regex-pattern" className={styles.sectionLabel}>Pattern</label>
        <div className={styles.patternRow}>
          <input
            id="regex-pattern"
            type="text"
            className={`${styles.patternInput} ${error ? styles.error : ''}`}
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
                title={
                  f === 'g' ? 'Global' : f === 'i' ? 'Case insensitive' : f === 'm' ? 'Multiline' : 'Dot matches newline'
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        {error && <span id="regex-error" className={styles.errorMsg} role="alert">{error}</span>}
      </div>

      <div className={styles.section}>
        <label htmlFor="regex-test" className={styles.sectionLabel}>Test String</label>
        <textarea
          id="regex-test"
          className={styles.testArea}
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="Enter test string..."
          spellCheck={false}
        />
      </div>

      {testString && pattern && !error && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Matches</span>
          <div className={styles.highlightBox}>{highlighted}</div>
          <div className={styles.info}>
            <span className={styles.infoBadge}>
              {matches.length} match{matches.length !== 1 ? 'es' : ''}
            </span>
            {matches.length > 0 && matches[0].groups.length > 0 && (
              <span className={styles.infoBadge}>{matches[0].groups.length} group{matches[0].groups.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}

      {matches.length > 0 && matches.some((m) => m.groups.length > 0) && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>Capture Groups</span>
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

      <div className={styles.section}>
        <button
          className={`${styles.replaceToggle} ${showReplace ? styles.replaceToggleActive : ''}`}
          onClick={() => setShowReplace(!showReplace)}
        >
          {showReplace ? 'Hide Replace' : 'Show Replace'}
        </button>
        {showReplace && (
          <>
            <input
              type="text"
              className={styles.replaceInput}
              value={replaceString}
              onChange={(e) => setReplaceString(e.target.value)}
              placeholder="Replacement string..."
              spellCheck={false}
            />
            {testString && regex && (
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Result</span>
                <div className={styles.resultBox}>{replaceResult}</div>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.section}>
        <button
          className={`${styles.replaceToggle} ${showCheatsheet ? styles.replaceToggleActive : ''}`}
          onClick={() => setShowCheatsheet(!showCheatsheet)}
        >
          {showCheatsheet ? 'Hide Cheatsheet' : 'Regex Cheatsheet'}
        </button>
        {showCheatsheet && (
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
        )}
      </div>
    </div>
  );
}
