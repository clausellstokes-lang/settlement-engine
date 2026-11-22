/**
 * CENSUS-1i unit 5 (R-AT's wider audit, the chair's block m answer 5): a resolution's tie-break key
 * carries the settlement's identity. `drawDeclared`'s argmax (and its registry resolution) hashes
 * `key::lineId`; with no key it falls back to the pool id, a constant across settlements, so every
 * refused birth resolves to the same row. Every `drawDeclared` caller in `src` passes a `key`, and
 * a generator-time caller's key leads with the active stream's seed (`getActiveRng().seed`, read
 * with no roll — CENSUS-1h's method) or names the settlement; the display callers below key on a
 * seed or identity they are handed, or are listed by name with the reason they are not yet keyed.
 */
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';

/** Callers whose key is content-derived (no settlement identity), listed for the chair, not yet re-keyed. */
const CONTENT_KEYED = Object.freeze({
  'src/generators/power/relationshipArchetypes.js': 'keys on the two NPC names and the archetype: names are drawn per settlement, so the key varies by birth; a render-stable tie key (CENSUS-1e)',
  // re-keyed #232 → #266 by identity (the same createConflictHookDraw call; SW-10 HOOKS 2026-11-09: the party descriptor's helpers above it moved the line)
  'src/domain/dossier/hookLines.js#266': 'a display draw keyed on the faction pair and issue (render-time; no seed in scope at this site)',
  'src/domain/display/causeLifecycleVocabulary.js': 'a display draw keyed on state, cause class and role (render-time; no seed in scope at this site)',
});

/** @param {string} src @param {number} at the index of `drawDeclared(` @returns {string} the call's text */
function callText(src, at) {
  let depth = 0;
  for (let i = src.indexOf('(', at); i < src.length; i += 1) {
    if (src[i] === '(') depth += 1;
    else if (src[i] === ')') { depth -= 1; if (depth === 0) return src.slice(at, i + 1); }
  }
  return src.slice(at);
}

describe('drawDeclared keys carry the settlement (R-AT, CENSUS-1i unit 5)', () => {
  const files = execSync("git grep -l 'drawDeclared(' -- src", { encoding: 'utf8' }).trim().split('\n').filter((f) => f !== 'src/domain/facts/drawDeclared.js');
  const calls = [];
  for (const f of files) {
    const src = readFileSync(f, 'utf8');
    for (let at = src.indexOf('drawDeclared('); at >= 0; at = src.indexOf('drawDeclared(', at + 1)) {
      if (/function\s+$|\.\s*$/.test(src.slice(Math.max(0, at - 12), at))) continue;
      const line = src.slice(0, at).split('\n').length;
      calls.push({ where: `${f}#${line}`, file: f, text: callText(src, at) });
    }
  }

  it('finds the callers', () => { expect(calls.length).toBeGreaterThan(20); });

  it('every caller passes a key', () => {
    const keyless = calls.filter((c) => !/\bkey:/.test(c.text)).map((c) => c.where);
    expect(keyless).toEqual([]);
  });

  it('a generator-time key leads with the stream seed or names the settlement; a display key uses its seed or identity; the rest are listed', () => {
    const bad = [];
    for (const c of calls) {
      if (CONTENT_KEYED[c.file] || CONTENT_KEYED[c.where]) continue;
      const key = /\bkey:\s*([^\n]*)/.exec(c.text)?.[1] ?? '';
      if (/getActiveRng\(\)\?\.seed|\bseed\w*\b|identity|\$\{s\}/.test(key)) continue;
      bad.push(`${c.where}: ${key.slice(0, 80)}`);
    }
    expect(bad).toEqual([]);
  });
});
