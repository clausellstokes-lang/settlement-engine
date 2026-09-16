import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// The bundled Lora/Nunito faces embed NO arrow/dingbat glyphs — verified with fontTools,
// every codepoint below is absent from all 8 faces. ⛔ CORRECTED 2026-09-01: react-pdf does
// NOT print a .notdef box; it prints a plausible wrong letter. EconomicsTrade was fixed once
// (economicsTradeGlyphTofu.test.js, a render-level check) but the same glyphs had crept
// into 10 other sections as row markers and directional arrows. This scans EVERY
// section's RENDERED source for the whole set so a reintroduced glyph reds the gate rather
// than shipping a WRONG LETTER (影→"q", →→"’": substituted NON-EMBEDDED Helvetica, low-byte
// truncation) to a customer. Comments excluded (SupplyChainFlow documents some deliberately).
//
// Font-covered replacements in use: ✦→*, ↯→·, →→», ←→«, ↔→·, ⚠→!, ▸→» (all present in
// every face). If you need a marker/arrow, use one of those, not a dingbat.
const TOFU = ['✦', '↯', '←', '→', '↔', '⚠', '▸'];
const DIR = 'src/pdf/sections';
const isComment = (l) => {
  const t = l.trimStart();
  return t.startsWith('//') || t.startsWith('*') || t.startsWith('/*');
};

describe('pdf sections embed no un-embedded (tofu) glyphs', () => {
  const files = readdirSync(DIR).filter((f) => f.endsWith('.jsx'));

  it('the scan actually sees the section tree (not vacuous)', () => {
    expect(files.length).toBeGreaterThan(15);
  });

  it.each(files)('%s renders no tofu glyph', (f) => {
    const lines = readFileSync(join(DIR, f), 'utf8').split('\n');
    const hits = [];
    lines.forEach((line, i) => {
      if (isComment(line)) return;
      for (const g of TOFU) if (line.includes(g)) hits.push(`${f}:${i + 1} '${g}'`);
    });
    expect(hits, `un-embedded glyph in rendered source (renders as a tofu box): ${hits.join(', ')}`).toEqual([]);
  });
});
