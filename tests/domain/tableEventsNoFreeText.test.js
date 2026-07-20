/**
 * tableEventsNoFreeText.test.js — V-17 PIN: no free text reaches mechanics.
 *
 * The finite-semantics law's hardest guarantee, enforced STRUCTURALLY (a source scan
 * over the apply path), not just behaviorally: the DM's verbatim `flavor` may only
 * ever become DISPLAY prose (the news `summary`). It must never feed a mechanical
 * field — severity/magnitude, tick, kind, band, significance, impactKind, targets,
 * or the deterministic record id. A refactor that accidentally routes flavor into a
 * mechanical field reds this pin.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, it, expect } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(join(ROOT, 'src/domain/tableEvents.js'), 'utf8');

/** Extract a function body by name (from `function NAME(` to its matching close). */
function bodyOf(name) {
  const start = src.indexOf(`function ${name}(`);
  expect(start).toBeGreaterThan(-1);
  // Walk braces from the first { after the signature.
  const open = src.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(open, i + 1); }
  }
  throw new Error(`no body for ${name}`);
}

describe('the news-projection apply path (tableEventToNewsEntry)', () => {
  const body = bodyOf('tableEventToNewsEntry');
  const flavorLines = body.split('\n').filter(l => l.includes('flavor') && !l.trim().startsWith('//'));

  it('references flavor ONLY on the summary line', () => {
    expect(flavorLines.length).toBeGreaterThan(0); // it IS used (as summary)
    for (const line of flavorLines) {
      expect(line).toMatch(/summary\s*:/);
    }
  });

  it('never routes flavor into a mechanical field', () => {
    for (const field of ['severity', 'significance', 'impactKind', 'tick', 'settlementIds', 'tags']) {
      const fieldLine = body.split('\n').find(l => new RegExp(`\\b${field}\\s*:`).test(l));
      if (fieldLine) expect(fieldLine.includes('flavor')).toBe(false);
    }
  });
});

describe('the record builder (buildTableEvent)', () => {
  const body = bodyOf('buildTableEvent');

  it('the deterministic id does not depend on flavor (flavor is not mechanical)', () => {
    const idLine = body.split('\n').find(l => /\bid\s*:/.test(l) || /const disc\s*=/.test(l));
    // The id is composed from kind/band/tick/targets/index — never flavor.
    const discLine = body.split('\n').find(l => /const disc\s*=/.test(l));
    expect(discLine).toBeTruthy();
    expect(discLine.includes('flavor')).toBe(false);
    if (idLine) expect(idLine.includes('flavor')).toBe(false);
  });

  it('magnitude derives from the band only, never flavor', () => {
    const magLine = body.split('\n').find(l => /magnitude\s*:/.test(l));
    expect(magLine).toBeTruthy();
    expect(magLine.includes('flavor')).toBe(false);
    expect(magLine).toMatch(/bandMagnitude/);
  });
});
