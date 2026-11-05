/**
 * tests/domain/facts/census2DeclaredPools.test.js — CENSUS-2b Phase B item 2: THE SUMMARY
 * SURFACES' DS LEDGERS ARE APPLIED (`docs/CENSUS_2_LANE_2026-11-04.md`, "Phase B").
 *
 * The ledger (`docs/census/declarations/DS-*.json`, Phase A) is the source; the annex
 * (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`) carries it; the projected leaves are what the
 * kernel reads. This file holds the leaves to the ledger, family by family, and proves the point
 * of the opt-in on the real pools: a calm line is refused under a crisis and drawn in calm.
 *
 * The translation (the lane doc's rename table): a ledger `needs` atom is a tag-slot atom, an
 * `excludes` atom is `no <atom>`; in a `{crisis-scoped}` pool `crisis: "any"` is `crisis: any` and
 * `"calm"` is silence. A pool KEYED on a crisis (`poolCrisis`) is not opted in and does not
 * re-declare its key: under the vocabulary's conjunction (`factVocabulary.js :: crisisAdmits`) a
 * declared `crisis: <key>` would refuse the pool under any second active crisis.
 *
 * @enforced-by npx vitest run tests/domain/facts/census2DeclaredPools.test.js
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../../src/data/dossierStateProse/stressors.generated.js';
import { eligibleVariants } from '../../../src/domain/display/stateProse/stateProseKernel.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';

const LEAVES = { ...DOSSIER_STATE_PROSE_GENERAL, ...DOSSIER_STATE_PROSE_STRESSORS };
const ledger = (id) => JSON.parse(readFileSync(new URL(`../../../docs/census/declarations/${id}.json`, import.meta.url), 'utf8'));
/** the ledger's spellings → the vocabulary's (lines keep the kernel's own `deficit` mark) */
const rename = (a) => a.replace(/^population:\s*>=\s*/, 'population: ≥ ');
const poolRename = (a) => (a === 'deficit' ? 'starving' : rename(a));
const keyed = (p) => Array.isArray(p.poolCrisis) && p.poolCrisis.length > 0;

const FAMILIES = {
  'DS-GEN': ['DS-GEN-1', 'DS-GEN-2', 'DS-GEN-3', 'DS-GEN-5', 'DS-GEN-6', 'DS-GEN-7', 'DS-GEN-8', 'DS-GEN-9',
    'DS-GEN-10', 'DS-GEN-11', 'DS-GEN-12', 'DS-GEN-13', 'DS-GEN-14', 'DS-GEN-15', 'DS-GEN-16', 'DS-GEN-17', 'DS-GEN-18'],
  'DS-HK': ['DS-HK-1'],
  'DS-STR': ['DS-STR-1', 'DS-STR-2'],
};

const TOWN = { tier: 'town', population: 2400, institutions: [] };
const CALM = factsOf(TOWN);
const SIEGE = factsOf({ ...TOWN, stress: [{ type: 'under_siege' }] });

describe.each(Object.entries(FAMILIES))('%s: the annex carries the ledger', (_family, ids) => {
  it.each(ids)('%s: every pool ruling and every line atom is projected', (id) => {
    const block = LEAVES[id];
    const meta = block.poolMeta || {};
    /** @type {string[]} */ const missing = [];
    for (const p of ledger(id).pools) {
      const m = meta[p.pool] || {};
      const scoped = p.crisisScoped === true && !keyed(p);
      if (scoped && m.crisisScoped !== true) missing.push(`${p.pool}: {crisis-scoped}`);
      if (keyed(p) && m.crisisScoped === true) missing.push(`${p.pool}: keyed pool opted in`);
      if (p.colour === true && m.colour !== true) missing.push(`${p.pool}: {colour}`);
      const poolAtoms = [...(p.poolNeeds || []).map(poolRename), ...(p.poolExcludes || []).map((a) => `no ${poolRename(a)}`)];
      // a keyed pool's own crisis (DS-STR-2 wrote it as a pool atom) is the key's guarantee, not re-declared
      for (const a of poolAtoms.filter((x) => !(keyed(p) && /^crisis:/.test(x)))) if (!(m.declares || []).includes(a)) missing.push(`${p.pool}: pool atom ${a}`);
      for (const l of p.lines) {
        const v = block.pools[p.pool].find((x) => x.vid === Number(l.lineId.replace('vid:', '')));
        const marks = v.marks || [];
        const want = [...(l.needs || []).map(rename), ...(l.excludes || []).map((a) => `no ${rename(a)}`)];
        if (scoped && l.crisis === 'any') want.push('crisis: any');
        for (const a of want) if (!marks.includes(a)) missing.push(`${p.pool} ${l.lineId}: ${a}`);
        if (keyed(p) && marks.some((x) => /^crisis:/.test(x))) missing.push(`${p.pool} ${l.lineId}: re-declares its key`);
      }
    }
    expect(missing).toEqual([]);
  });
});

const read = (id, key, facts) => eligibleVariants(LEAVES[id].pools[key], {
  facts, crisisScoped: LEAVES[id].poolMeta?.[key]?.crisisScoped === true,
  poolDeclares: LEAVES[id].poolMeta?.[key]?.declares, dimensions: { walls: 'no walls' },
  slots: { settlement: 'Oakford', good: 'salt', season: 'spring', band: 'a few', faction: 'the guild', govFaction: 'the council', reason: 'its mill' },
}).map((v) => v.vid);

describe('the declarations do their work on the real pools', () => {
  it("DS-GEN-13's open-market lines are refused under a siege where they deny it, and kept in calm", () => {
    const market = { ...TOWN, institutions: [{ name: 'Weekly market', category: 'Economy' }] };
    expect(read('DS-GEN-13', 'MARKET-OPEN', factsOf(market))).toEqual([1, 2, 3, 4]);
    expect(read('DS-GEN-13', 'MARKET-OPEN', factsOf({ ...market, stress: [{ type: 'under_siege' }] }))).toEqual([2, 3, 4]);
  });

  it("DS-GEN-13's NO-MARKET lines (trade 'at the gate, at the inn') are refused where neither stands", () => {
    expect(read('DS-GEN-13', 'NO-MARKET', CALM)).toEqual([]);
    expect(read('DS-GEN-13', 'NO-MARKET', SIEGE)).toEqual([]);
    const gated = factsOf({ ...TOWN, institutions: [{ name: 'Town walls', category: 'Defense' }, { name: 'Tavern', category: 'Hospitality' }] });
    expect(gated.defence.gate && gated.hasInstitution('tavern')).toBe(true);
    expect(read('DS-GEN-13', 'NO-MARKET', gated)).toEqual([1, 2]);
  });

  it("DS-STR-1's calm framing (\"carries no emergency\") is refused under a siege and drawn in calm", () => {
    expect(read('DS-STR-1', "Overview's own section framing", SIEGE)).toEqual([]);
    expect(read('DS-STR-1', "Overview's own section framing", CALM)).toEqual([1, 2, 3]);
  });

  it("DS-STR-1's siege banner keeps its lines under a siege joined by a famine (the key is not re-declared)", () => {
    const both = factsOf({ ...TOWN, stress: [{ type: 'under_siege' }, { type: 'famine' }] });
    expect(read('DS-STR-1', 'UNDER SIEGE', both)).toEqual([5, 7, 8, 9, 10]);
  });
});
