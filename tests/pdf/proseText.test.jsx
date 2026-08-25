/**
 * tests/pdf/proseText.test.jsx — the byte-safety pin for the PDF entity-ref
 * renderer (finding code-quality-1, no-golden-shift track).
 *
 * proseToPlainText is wired at golden-covered PDF prose sites (Overview thesis,
 * and available for NotableNPCs). It MUST return token-free prose byte-identical
 * to the input, because every same-seed PDF golden fixture is token-free (entity
 * tokens exist only in live AI narratives, never in deterministic output). This
 * pins that invariant so a future edit can't silently shift a golden. It also pins
 * the actual fix: token-bearing prose de-tokenizes to plain names, never leaking
 * the raw ⟦entity:…⟧ literal.
 */
import { describe, it, expect } from 'vitest';
import { proseToPlainText } from '../../src/pdf/primitives/ProseText.jsx';

describe('proseToPlainText — byte-identity for token-free prose', () => {
  const TOKEN_FREE = [
    'A plain thesis with no tokens.',
    'Multi\n\nparagraph\nprose, exactly preserved.',
    '   leading and trailing whitespace   ',
    'Punctuation: em—dashes, "quotes", & ampersands stay put.',
  ];
  for (const s of TOKEN_FREE) {
    it(`returns ${JSON.stringify(s.slice(0, 24))}… unchanged`, () => {
      expect(proseToPlainText(s)).toBe(s);
    });
  }

  it('passes non-strings and empties through untouched', () => {
    expect(proseToPlainText('')).toBe('');
    expect(proseToPlainText(null)).toBe(null);
    expect(proseToPlainText(undefined)).toBe(undefined);
  });
});

describe('proseToPlainText — token-bearing prose de-tokenizes to plain names', () => {
  it('renders the display name, never the raw ⟦entity:…⟧ literal', () => {
    const tok = 'The mayor ⟦entity:npc.jon|Jon Vale⟧ rules ⟦entity:faction.guild|the Guild⟧.';
    const out = proseToPlainText(tok);
    expect(out).toBe('The mayor Jon Vale rules the Guild.');
    expect(out).not.toMatch(/⟦entity:/);
  });
});
