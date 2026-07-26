/**
 * Canonical content JSON primitives.
 *
 * Native JSON.parse silently accepts repeated object keys. Constitutional
 * manifests and portable packs reject that ambiguity before any hash or review
 * can bless the parser's last-key-wins interpretation.
 */

import { describe, expect, it } from 'vitest';

import {
  canonicalContentJson,
  parseContentJson,
} from '../../src/domain/content/contentFingerprint.js';

describe('parseContentJson', () => {
  it('parses ordinary nested JSON', () => {
    expect(parseContentJson('{"a":[{"b":1}],"c":true}')).toEqual({
      a: [{ b: 1 }],
      c: true,
    });
  });

  it('rejects repeated keys within the same object', () => {
    expect(() => parseContentJson('{"a":1,"a":2}'))
      .toThrow(/\$\.a is declared more than once/);
  });

  it('treats escaped and literal spellings of one decoded key as duplicates', () => {
    expect(() => parseContentJson('{"name":1,"n\\u0061me":2}'))
      .toThrow(/\$\.name is declared more than once/);
  });

  it('allows the same key in different objects', () => {
    expect(parseContentJson('[{"id":1},{"id":2}]')).toEqual([
      { id: 1 },
      { id: 2 },
    ]);
  });

  it('rejects text that PostgreSQL jsonb cannot represent', () => {
    for (const invalid of [
      'A\u0000B',
      'A\ud800B',
      'A\udc00B',
    ]) {
      expect(() => canonicalContentJson({ label: invalid }))
        .toThrow(/U\+0000|unpaired .* surrogate/);
    }
    expect(() => canonicalContentJson({ ['bad\u0000key']: true }))
      .toThrow(/U\+0000/);
    expect(() => parseContentJson('{"label":"A\\u0000B"}'))
      .toThrow(/U\+0000/);
  });

  it('preserves valid non-BMP Unicode scalar text', () => {
    expect(canonicalContentJson({ label: 'Foundry \ud83d\udee0' }))
      .toBe('{"label":"Foundry 🛠"}');
  });
});
