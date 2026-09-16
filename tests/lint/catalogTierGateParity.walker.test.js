/**
 * catalogTierGateParity.walker.test.js — [CH-3 §3.1 / J-CH-3-1] the UI reader and the
 * generator must agree about what a tier can produce.
 *
 * THE DEFECT THIS PINS. A catalog row may be AUTHORED in one tier's block and GATED to
 * a higher tier by `minTier` — "author here, gate there". Ten rows use that form: nine
 * city rows gated to metropolis (four Entertainment, five Exotic) and one village row
 * gated to city. `assembleInstitutions` refuses them below their gate as its first
 * in-loop act, but `lookups.js` used to return the raw block, so all three UI readers
 * offered ten institutions at a tier the generator would never roll them at. Measured
 * before the fix: `getInstitutionalCatalog`, `getInstitutionsForTier` and
 * `getFullCatalogWithTierMeta` all returned true for all ten; generator-eligible was
 * false for all ten.
 *
 * WHY A READER FIX AND NOT A DATA FIX (chair-ruled, J-CH-3-1). Both data rewrites are
 * measured content changes over the 420-settlement corpus: deleting `minTier` moves 97
 * rosters, and moving the rows into the block their gate names moves 108 while
 * colliding with the city's own `Smuggling network` row. Teaching the reader costs
 * zero same-seed shift, and it is provable here rather than merely argued — arm A5
 * pins that no generation-path module imports this file at all.
 *
 * WHAT THIS WALKER DOES NOT CLAIM. The generator's two FORCED-toggle loops deliberately
 * reach past the tier — that is what an out-of-tier override is — and neither consults
 * `minTier`. Measured on this base: force-requiring any of the ten puts it in 70 of 70
 * settlements at its authoring tier. A6 pins that asymmetry in source so nobody reads
 * the parity arms as "the row is unreachable". Making the force path honour `minTier`
 * would be a generation behaviour change, not a reader repair, and CH-3 does not take
 * it.
 *
 * The parity arms model the gate from the SHIPPED engine source (A0) and rebuild the
 * eligible set from the RAW catalog, never from the predicate under test — a set
 * compared with itself is not a proof.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  getInstitutionalCatalog,
  getFullCatalogWithTierMeta,
  getInstitutionsForTier,
} from '../../src/generators/lookups.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { TIER_ORDER } from '../../src/data/constants.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const readSrc = (rel) => readFileSync(join(ROOT, rel), 'utf8');

const ASSEMBLE = 'src/generators/steps/assembleInstitutions.js';

/** Every (tier, category, name, def) in the raw catalog. */
function* rawRows() {
  for (const tier of Object.keys(institutionalCatalog)) {
    for (const [category, insts] of Object.entries(institutionalCatalog[tier])) {
      for (const [name, def] of Object.entries(insts)) yield { tier, category, name, def };
    }
  }
}

/**
 * The gate, re-implemented here from the engine's own expression rather than imported
 * from the module under test. Mirrors `assembleInstitutions.js`:
 *   if (inst.minTier && tierIndex < TIER_ORDER.indexOf(inst.minTier)) return;
 */
const engineRefuses = (def, tier) =>
  !!def.minTier && TIER_ORDER.indexOf(tier) < TIER_ORDER.indexOf(def.minTier);

/**
 * The names the generator will consider at `tier` on its probabilistic/required path.
 * Mirrors `catalogForTier` in assembleInstitutions, metropolis merge included.
 */
function generatorEligibleNames(tier) {
  const blocks = tier === 'metropolis' ? ['city', 'metropolis'] : [tier];
  const byName = new Map();
  for (const t of blocks) {
    for (const insts of Object.values(institutionalCatalog[t] || {})) {
      // mergeCatalogs: a later block's row of the same name wins.
      for (const [name, def] of Object.entries(insts)) byName.set(name, def);
    }
  }
  const out = new Set();
  for (const [name, def] of byName) if (!engineRefuses(def, tier)) out.add(name);
  return out;
}

const namesOf = (catalog) => {
  const s = new Set();
  for (const insts of Object.values(catalog || {})) for (const n of Object.keys(insts)) s.add(n);
  return s;
};

const sorted = (set) => [...set].sort();

describe('[CH-3 §3.1] catalog tier-gate parity: the UI reader and the generator agree', () => {
  test('A0: the engine gate this walker models is the gate the shipped source contains', () => {
    const src = readSrc(ASSEMBLE);
    // The literal first in-loop statement of the catalog iteration. If this moves, the
    // model above is stale and every parity arm below is measuring the wrong thing.
    expect(
      src.includes('if (inst.minTier && tierIndex < TIER_ORDER.indexOf(inst.minTier)) return;'),
    ).toBe(true);
    // …and it is read against the SETTLEMENT's tier index, not the block's.
    expect(src.includes('const tierIndex = TIER_ORDER.indexOf(tier);')).toBe(true);
  });

  test('A1: the gated class is the measured ten, enumerated', () => {
    const gated = [];
    for (const { tier, name, def } of rawRows()) {
      if (engineRefuses(def, tier)) gated.push(`${tier}/${name}→${def.minTier}`);
    }
    expect(gated.sort()).toEqual([
      'city/Airship docking (high magic)→metropolis',
      'city/Colosseum/arena→metropolis',
      'city/Dragon resident→metropolis',
      'city/Dream parlors (high magic)→metropolis',
      'city/Gambling district→metropolis',
      'city/Message network (high magic)→metropolis',
      'city/Multiple theaters→metropolis',
      'city/Opera house→metropolis',
      'city/Planar traders→metropolis',
      'village/Smuggling network→city',
    ]);
  });

  test('A2: getInstitutionalCatalog(tier) === the generator-eligible set, at every tier', () => {
    for (const tier of TIER_ORDER) {
      expect({ tier, names: sorted(namesOf(getInstitutionalCatalog(tier))) })
        .toEqual({ tier, names: sorted(generatorEligibleNames(tier)) });
    }
  });

  test('A3: getInstitutionsForTier(tier) === the generator-eligible set, at every tier', () => {
    for (const tier of TIER_ORDER) {
      expect({ tier, names: sorted(getInstitutionsForTier(tier)) })
        .toEqual({ tier, names: sorted(generatorEligibleNames(tier)) });
    }
    // Non-vacuity: the sets are large, and the gate actually removes something.
    expect(getInstitutionsForTier('metropolis').size).toBeGreaterThan(100);
    expect(generatorEligibleNames('city').size)
      .toBeLessThan(namesOf(institutionalCatalog.city).size);
  });

  test('A4: the cross-tier browse is the deliberate exemption and stays whole', () => {
    // 'all' is not a tier, so no gate applies: a metropolis-gated row IS reachable —
    // at metropolis — and hiding it from the browse would hide it everywhere.
    const all = namesOf(getInstitutionalCatalog('all'));
    const everyRow = new Set([...rawRows()].map((r) => r.name));
    expect(sorted(all)).toEqual(sorted(everyRow));
    for (const tier of TIER_ORDER) {
      for (const n of generatorEligibleNames(tier)) expect({ tier, n, in: all.has(n) }).toEqual({ tier, n, in: true });
    }
    // The full-meta view likewise keeps every row; what it fixes is the LABEL.
    expect(sorted(namesOf(getFullCatalogWithTierMeta()))).toEqual(sorted(everyRow));
  });

  test('A5: no generation-path module imports lookups.js, so the reader fix cannot move a seed', () => {
    // This is the structural half of the zero-shift claim: the filter is unreachable
    // from the pipeline by construction, not merely unobserved in one corpus run.
    const importersUnder = (tree) => {
      const hits = [];
      const walk = (dir) => {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
          const p = join(dir, e.name);
          if (e.isDirectory()) { walk(p); continue; }
          if (!/\.(js|jsx)$/.test(e.name)) continue;
          const rel = p.slice(ROOT.length + 1).replace(/\\/g, '/');
          if (rel === 'src/generators/lookups.js') continue;
          if (/from\s+['"][^'"]*\/lookups\.js['"]/.test(readFileSync(p, 'utf8'))) hits.push(rel);
        }
      };
      walk(join(ROOT, tree));
      return hits.sort();
    };

    expect([
      ...importersUnder('src/generators'),
      ...importersUnder('src/domain'),
      ...importersUnder('src/lib'),
    ]).toEqual([]);

    // Positive control — the scan can find an importer when one exists, so the empty
    // list above is a verdict rather than a predicate that answers false to everything.
    expect([...importersUnder('src/components'), ...importersUnder('src/store')].length)
      .toBeGreaterThan(0);
  });

  test('A6: the FORCE path deliberately does not consult minTier — recorded, not repaired', () => {
    const lines = readSrc(ASSEMBLE).split('\n');
    // Both forced-toggle loops exist — the `_`-form and the `::`-form…
    const loopLines = lines
      .map((l, i) => (/Object\.entries\(institutionToggles\)\.forEach/.test(l) ? i : -1))
      .filter((i) => i >= 0);
    expect(loopLines.length).toBe(2);
    // …and `minTier` is named on exactly ONE line of the whole file: the gate.
    const gateLines = lines
      .map((l, i) => (l.includes('minTier') ? i : -1))
      .filter((i) => i >= 0);
    expect(gateLines.length).toBe(1);
    expect(lines[gateLines[0]].trim())
      .toBe('if (inst.minTier && tierIndex < TIER_ORDER.indexOf(inst.minTier)) return;');
    // …and it sits BEFORE both forced loops, i.e. inside the probabilistic iteration.
    expect({ gate: gateLines[0] < loopLines[0] }).toEqual({ gate: true });
    // If a future car teaches the force path the gate, that is a generation behaviour
    // change and this arm must be re-ruled, not silently updated.
  });

  test('A7: the tier-less preview path is the village view, gate included', () => {
    const village = sorted(namesOf(getInstitutionalCatalog('village')));
    for (const t of [undefined, null, '', 'random', 'custom']) {
      expect({ t: String(t), names: sorted(namesOf(getInstitutionalCatalog(t))) })
        .toEqual({ t: String(t), names: village });
    }
    // …and the village row the gate refuses is absent from all of them. ANCHORED, because a
    // bare absence is true both when the row is correctly gated out and when the collection
    // drifted out from under the test: `Underground network` is its own shelf-sibling on
    // village/Criminal and travels the identical code path, so it vanishes under exactly the
    // drift that would make this negative vacuous.
    expectAbsentWithAnchor(village, 'Smuggling network', 'Underground network',
      'the village Smuggling network row is gated to city, so the village view must refuse it');
  });
});
