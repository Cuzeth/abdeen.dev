import { describe, expect, test } from 'bun:test';
import { relatedTools, tools } from './catalog';

describe('relatedTools', () => {
  test('returns the next three tools in catalog order', () => {
    const related = relatedTools(tools[0].href);
    expect(related.map((t) => t.href)).toEqual(tools.slice(1, 4).map((t) => t.href));
  });

  test('wraps around at the end of the catalog', () => {
    const last = tools[tools.length - 1];
    const related = relatedTools(last.href);
    expect(related.map((t) => t.href)).toEqual(tools.slice(0, 3).map((t) => t.href));
  });

  test('never includes the current tool', () => {
    for (const tool of tools) {
      const related = relatedTools(tool.href);
      expect(related).toHaveLength(3);
      expect(related.some((t) => t.href === tool.href)).toBe(false);
    }
  });

  test('falls back to the first tools for an unknown href', () => {
    const related = relatedTools('/nope');
    expect(related.map((t) => t.href)).toEqual(tools.slice(0, 3).map((t) => t.href));
  });
});
