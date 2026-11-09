/**
 * X-50 in print (the owner, 2026-11-03: BOILERPLATE ONCE). The PDF Defense chapter gave each
 * criminal operation its enforcement note, so two operations that fall to the same note (the
 * catch-all, or two names one rule matches) printed it twice. The screen tab prints it on the
 * first row only (DefenseTab.jsx); the print chapter follows the same rule.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { criminalOpNote } from '../../src/domain/display/defenseDisplay.js';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = ['germanic', 'mediterranean', 'norse', 'celtic', 'slavic'];
const SEEDS = Array.from({ length: 60 }, (_, i) => ({
  seed: `x50-trim-${i}`,
  config: { settType: TIERS[i % TIERS.length], culture: CULTURES[i % CULTURES.length] },
}));

/** Every leaf string of an element tree, executing the hook-free PDF components. */
function deepText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const c of node) deepText(c, out); return out; }
  if (typeof node !== 'object') return out;
  if (typeof node.type === 'function') { deepText(node.type(node.props || {}), out); return out; }
  return deepText(node.props?.children, out);
}

const ROWS = [];
beforeAll(() => {
  for (const { seed, config } of SEEDS) {
    const settlement = generateSettlementPipeline(config, null, { seed, customContent: {} });
    const vm = buildViewModel({ settlement });
    const leaves = deepText(DefenseSecurity({ settlement, narrativeMode: false, vm, stateProse: null }));
    const ops = settlement.economicState?.safetyProfile?.criminalInstitutions || [];
    ROWS.push({ seed, leaves, notes: [...new Set(ops.map((n) => criminalOpNote(n)).filter(Boolean))], ops });
  }
  // SW-8 RENAME-POWERS (2026-11-09) re-keyed the anti-vacuity by identity: the corpus's only shared
  // note was "Multiple Criminal Factions" + "Red Light District" on the catch-all; the owner's map
  // renamed the first "Rival Gangs", which now (rightly) takes the gang note, so no generated town
  // shares a note any more. The guard keeps its case by PLANTING it: seed 11's own record with a
  // street gang beside its rival gangs, two operations that fall to the one gang note.
  {
    const settlement = generateSettlementPipeline(SEEDS[11].config, null, { seed: SEEDS[11].seed, customContent: {} });
    const sp = settlement.economicState.safetyProfile;
    sp.criminalInstitutions = [...sp.criminalInstitutions, 'Street Gang'];
    const vm = buildViewModel({ settlement });
    const leaves = deepText(DefenseSecurity({ settlement, narrativeMode: false, vm, stateProse: null }));
    const ops = sp.criminalInstitutions;
    ROWS.push({ seed: `${SEEDS[11].seed}+street-gang`, leaves, notes: [...new Set(ops.map((n) => criminalOpNote(n)).filter(Boolean))], ops });
  }
}, 600000);

describe('X-50: the PDF Defense chapter prints each criminal note once', () => {
  test('no criminal-operation note prints twice in the Defense chapter, over sixty settlements', () => {
    const offenders = [];
    let shared = 0;
    for (const { seed, leaves, notes, ops } of ROWS) {
      if (ops.length > notes.length) shared += 1;
      for (const note of notes) {
        const n = leaves.filter((l) => l === note).length;
        if (n !== 1) offenders.push(`${seed}: printed ${n}x: ${note}`);
      }
    }
    // anti-vacuity: some settlement had two operations sharing one note
    expect(shared, 'no settlement had two operations under one note').toBeGreaterThan(0);
    expect(offenders, offenders.slice(0, 20).join('\n')).toEqual([]);
  });
});
