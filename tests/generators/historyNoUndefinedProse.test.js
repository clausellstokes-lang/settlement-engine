/**
 * historyNoUndefinedProse.test.js — the literal 'undefined' must never reach prose.
 *
 * generateHistory's resource_scarcity tension interpolated
 * `economicViability.issues[0].message`, but viability issues carry `.description`
 * canonically (only stress-derived ones set `.message`). So a description-only top
 * issue — common for isolated / import-dependent settlements — rendered the literal
 * word 'undefined' into history.currentTensions (and onward into the dossier, the
 * PDF, and the AI-grounding inputs). The consumer now falls back to `.description`.
 *
 * The primary guard drives generateHistory with a DESCRIPTION-ONLY viability issue
 * across many seeds — the exact shape that used to leak 'undefined' — and asserts
 * (a) the resource_scarcity branch actually fires (so the guard is non-vacuous) and
 * (b) no tension text ever contains 'undefined'. A broad pipeline sweep backs it up.
 */
import { describe, it, expect } from 'vitest';
import { generateHistory } from '../../src/generators/historyGenerator.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { setActiveRng, clearActiveRng } from '../../src/kernel/rngContext.js';
import { createPRNG } from '../../src/kernel/prng.js';

// A viability whose TOP issue has ONLY `.description` (no `.message`) — the shape
// that used to interpolate the literal 'undefined'.
const VIABILITY_DESC_ONLY = {
  issues: [{ severity: 'critical', type: 'import_dependency', description: 'Settlement must import grain to survive.' }],
  stability: 'Stable',
};

describe('history prose never leaks the literal "undefined"', () => {
  it('resource_scarcity tension uses .description, never "undefined" (targeted, non-vacuous)', () => {
    let sawResourceScarcity = false;
    const offenders = [];
    for (let i = 0; i < 200; i++) {
      setActiveRng(createPRNG(`hist-undef-${i}`));
      try {
        const h = generateHistory(
          'town',
          { neighborRelationship: null },
          [],                       // institutions
          VIABILITY_DESC_ONLY,
          {},                       // economicState → commodity falls back to 'key goods'
          { factions: [] },
        );
        for (const t of h.currentTensions || []) {
          if (t.type === 'resource_scarcity' || /economic backbone/.test(t.description || '')) {
            sawResourceScarcity = true;
          }
          const text = `${t.description || ''} ${t.specificIssue || ''}`;
          if (text.includes('undefined')) offenders.push({ seed: i, text: text.slice(0, 140) });
        }
      } finally {
        clearActiveRng();
      }
    }
    expect(sawResourceScarcity, 'the resource_scarcity branch never fired — guard would be vacuous').toBe(true);
    expect(offenders, `history tension contained "undefined":\n${JSON.stringify(offenders.slice(0, 5), null, 2)}`).toHaveLength(0);
  });

  it('holds across a full-pipeline config × seed sweep (broad backstop)', () => {
    const collectStrings = (node, out) => {
      if (node == null) return out;
      if (typeof node === 'string') { out.push(node); return out; }
      if (Array.isArray(node)) { for (const v of node) collectStrings(v, out); return out; }
      if (typeof node === 'object') { for (const v of Object.values(node)) collectStrings(v, out); return out; }
      return out;
    };
    const offenders = [];
    let generated = 0;
    // Live terrainOverride vocabulary (their file swept the dead `terrain` key).
    for (const settType of ['thorp', 'village', 'town', 'city']) {
      for (const terrainOverride of ['plains', 'mountain', 'desert', 'coastal']) {
        for (const tradeRouteAccess of ['isolated', 'none', 'road']) {
          for (let i = 0; i < 4; i++) {
            let s;
            try {
              s = generateSettlementPipeline(
                { settType, culture: 'germanic', terrainOverride, tradeRouteAccess },
                null,
                { seed: `noundef-${settType}-${terrainOverride}-${tradeRouteAccess}-${i}`, customContent: {} },
              );
            } catch { continue; }
            generated++;
            for (const str of collectStrings(s?.history ?? {}, [])) {
              if (str.includes('undefined')) offenders.push({ settType, terrainOverride, tradeRouteAccess, i, snippet: str.slice(0, 120) });
            }
          }
        }
      }
    }
    expect(generated, 'every config × seed case must generate; a throw is a test failure, not a skipped sample')
      .toBe(192);
    expect(offenders, `history prose contained "undefined":\n${JSON.stringify(offenders.slice(0, 5), null, 2)}`).toHaveLength(0);
  }, 60_000);
});
