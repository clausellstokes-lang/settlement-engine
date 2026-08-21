/**
 * tests/lint/dossierContracts.walker.test.js — lane MF-W1b: **THE NEVER-RUN AUDIT, AS A PIN.**
 *
 * ⭐⭐⭐ THE STANDING LAW THIS FILE EXISTS TO ENFORCE (ODQ §270.1): **A MECHANISM WITHOUT A PIN
 * PROVING IT FIRES ON A REAL LEAF IS PRESUMED DARK.**
 *
 * The bill this was written against is exact and it is large. MF-INT1 ran the REAL generator
 * against the fabric and measured `readResourceWords()` returning `[]` on **16 of 16** leaves —
 * the entire §161a RESOURCE_GROUND machinery inert on every settlement the product has ever
 * made — and the active-condition bridge matching **1 of 9** keys against a vocabulary of 46.
 * Both endpoints were correct. Nothing red, because **a table whose keys never occur cannot
 * red**, and every fixture in the suite mirrored the reader.
 *
 * ⚠⚠ SO THE ARMS BELOW ARE NOT "DOES IT WORK" PINS. They are **"DID IT RUN"** pins, and the
 * difference is the whole point: a correctness pin over a fixture that mirrors the reader
 * passes on a dead mechanism. Every arm here builds a REAL settlement from
 * `generateSettlementPipeline` and asserts a non-empty result.
 */
import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { CONDITION_ARCHETYPE_TEMPLATES } from '../../src/domain/activeConditions.js';
import {
  readResourceWords, resourceContracts, resourceCoherence, RESOURCE_SPELLINGS,
} from '../../src/domain/townMap/fabric/substrate.js';
import {
  CONDITION_TO_STRESSOR, CONDITION_UNBRIDGED, STRESSOR_DISPOSITION, DANGER_STRESSORS,
  ARCHETYPE_SOURCES, stressorKeysOf, readState,
} from '../../src/domain/townMap/fabric/stateMarks.js';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** A REAL dossier, from the real pipeline. Never a fixture: a fixture that mirrors the
 *  reader is exactly what hid this class for nine waves. */
const real = (settType, seed, terrain) => generateSettlementPipeline(
  terrain ? { settType, terrainOverride: terrain } : { settType }, null, { seed },
);
const fabricOf = (s) => buildFabric(s, buildTownMapModel(s, null), {});

/** Every condition-archetype name the ENGINE can write. ⚠ TWO WRITERS — see below. */
function engineArchetypes(root = 'src') {
  const out = new Set(Object.keys(CONDITION_ARCHETYPE_TEMPLATES));
  const RE = /condition:\s*\{\s*archetype:\s*'([a-z_]+)'/g;
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) { walk(p); continue; }
      if (!name.endsWith('.js')) continue;
      const src = readFileSync(p, 'utf8');
      let m;
      while ((m = RE.exec(src))) out.add(m[1]);
    }
  };
  walk(root);
  return [...out].sort();
}

describe('the never-run audit — every W1 mechanism FIRES on a real dossier', () => {
  it('⭐ `readResourceWords` reads the LIVE writer — MF-INT1 measured six spellings and ZERO hits', () => {
    // `resourceGenerator.js:372` writes `availableResources: nearbyResources`, a plain string
    // array, and that spelling was not among the six the reader listed.
    const words = readResourceWords(real('town', 'dark-words-01', 'riverside'));
    expect(words.length).toBeGreaterThan(0);
    expect(RESOURCE_SPELLINGS[0]).toBe('resourceAnalysis.availableResources');
    // ⛔ AND THE COUNTERFACTUAL THAT CONVICTS A RE-DEATH: a dossier carrying ONLY the old
    // spellings must still read (THE PROMISE — a world minted under an old spelling still
    // draws), and a dossier carrying NONE of them must read empty rather than throw.
    expect(readResourceWords({ economicState: { resources: ['iron_deposits'] } })).toEqual(['iron_deposits']);
    expect(readResourceWords({})).toEqual([]);
  });

  it('⭐ the §161a GROUND CONTRACTS fire on a real dossier, and the ground carries them', () => {
    const s = real('village', 'dark-contracts-01', 'mountain');
    const contracts = resourceContracts(s);
    expect(contracts.length).toBeGreaterThan(0);
    const f = fabricOf(s);
    expect((f.substrate.resourceSites || []).length).toBe(contracts.length);
    const coh = resourceCoherence(f.substrate);
    expect(coh.status).toBe('MEASURED');
    expect(coh.checked).toBeGreaterThan(0);
    expect(coh.coherent).toBe(true);
  });

  it('⭐ the ARCHETYPE BRIDGE fires on a real dossier — MF-INT1 measured 1 of 9 keys REAL', () => {
    // ⚠ NOT EVERY SEED CARRIES A CONDITION, so this sweeps a small ladder and asserts that at
    // least one real settlement's `activeConditions` reaches a catalog key. A single-seed
    // arm here would be a flake wearing a pin's name.
    const seeds = ['dark-bridge-01', 'dark-bridge-02', 'dark-bridge-03', 'dark-bridge-04'];
    let bridged = 0, sawCondition = 0;
    const keys = new Set();
    for (const seed of seeds) {
      for (const tier of ['town', 'city']) {
        const s = real(tier, `${seed}-${tier}`);
        const conds = Array.isArray(s.activeConditions) ? s.activeConditions : [];
        if (conds.length) sawCondition++;
        for (const c of conds) {
          const a = String((c && c.archetype) || '');
          if (CONDITION_TO_STRESSOR[a]) { bridged++; keys.add(a); }
        }
      }
    }
    expect(sawCondition).toBeGreaterThan(0);
    expect(bridged).toBeGreaterThan(0);
    // Every key that fired must be one the engine can actually produce.
    for (const k of keys) expect(engineArchetypes().includes(k)).toBe(true);
  });

  it('⭐ the STRESSOR reader fires on a real dossier whose `stressors` is an OBJECT', () => {
    // MF-INT1: `settlement.stressors` is a SINGLE OBJECT on a real dossier and the fabric's
    // `Array.isArray` test could not see any of them. The reader delegates the SHAPE question
    // to the estate's own accessor, so both shapes read.
    const seeds = ['dark-stress-01', 'dark-stress-02', 'dark-stress-03', 'dark-stress-04'];
    let fired = 0, sawObject = 0;
    for (const seed of seeds) {
      const s = real('town', seed, 'riverside');
      if (s.stressors && !Array.isArray(s.stressors)) sawObject++;
      if (stressorKeysOf(s).length) fired++;
    }
    expect(sawObject).toBeGreaterThan(0);       // the real shape is exercised
    expect(fired).toBeGreaterThan(0);           // and it reads
    // The array shape still reads — the four synthetic state leaves depend on it.
    expect(stressorKeysOf({ stressors: ['under_siege'] })).toEqual(['under_siege']);
  });

  it('⭐ the §16.5 DANGER set fires — three of its six old regex alternatives could match nothing', () => {
    // The assembly tested `/monster_raider_pressure|wartime|siege|occupation|insurgency|
    // rebellion/` over CATALOG KEYS; `monster_raider_pressure`, `occupation` and `rebellion`
    // are not catalog keys, so a settlement under monster pressure or under occupation did
    // not nucleate. Every key in the typed set must now BE a catalog key.
    for (const k of Object.keys(DANGER_STRESSORS)) {
      expect(STRESSOR_DISPOSITION[k], `'${k}' is not a catalog key`).toBeTruthy();
    }
    // …and it fires on a real dossier.
    // ⚠ THE SWEEP IS ACROSS TIERS, NOT SEEDS OF ONE TIER, AND THE FIRST SPELLING TAUGHT ME
    // WHY: four `town` seeds carried no danger stressor at all and the arm read 0. A
    // "does it fire" pin whose sample cannot contain the event is a pin that measures the
    // sample. The corpus's own thorp and metropolis carry one.
    let fired = 0, swept = 0;
    const keysSeen = new Set();
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (const seed of ['mf-thorp-01', 'mf-metro-01', 'dark-danger-01', 'dark-danger-02']) {
        swept++;
        const st = readState(real(tier, `${seed}|${tier}`));
        for (const k of st.active.keys()) if (DANGER_STRESSORS[k]) { fired++; keysSeen.add(k); }
      }
    }
    expect(swept).toBe(24);
    expect(fired, `no danger stressor on any of ${swept} real settlements`).toBeGreaterThan(0);
    // Every key that fired is one the OLD regex could or could not have matched — recorded so
    // a successor can see which of the three dead alternatives this corpus exercises.
    for (const k of keysSeen) expect(DANGER_STRESSORS[k]).toBeTruthy();
  });

  it('⭐ the W1 SUBSTRATE mechanisms fire on a real dossier — mask, bearing, coastline, plough', () => {
    const mountain = fabricOf(real('village', 'dark-w1-mtn', 'mountain'));
    const river = fabricOf(real('town', 'dark-w1-river', 'riverside'));
    const coast = fabricOf(real('city', 'dark-w1-coast', 'coastal'));
    // exit 2 — the refusal has a real subject and the plough was refused somewhere.
    expect(mountain.meta.buildable.refusedCells).toBeGreaterThan(0);
    expect(mountain.fields.refusedLands).toBeGreaterThan(0);
    // exit 1 — the relief FIELD, not a scalar.
    expect(mountain.meta.reliefField.bands).toHaveLength(8);
    expect(mountain.meta.reliefField.localMax).toBeGreaterThan(0);
    // exit 3 — the bearing.
    expect(river.meta.waterBearing).toBeTruthy();
    expect(river.meta.waterBearing.kind).toBe('river');
    // exit 6 — the two scales, on a leaf that has a coast.
    expect(coast.meta.waterBearing).toBeTruthy();
    expect(coast.meta.shoreScales).toBeTruthy();
    expect(coast.meta.shoreScales.status).toBe('MEASURED');
  });
});

describe('⭐⭐ THE TOTALITY WALKER — the structural cure, not the instance cure', () => {
  it('EVERY engine condition-archetype has a bridge row OR a written ruling — none may be silent', () => {
    // ⭐⭐⭐ THIS IS THE ARM THAT MAKES THE CLASS UNREPEATABLE. Curing the nine fictional keys
    // was an INSTANCE fix; the class is "a table whose keys never occur cannot red", and the
    // only structural answer is a walker over the ENGINE'S OWN vocabulary that reds when a
    // new archetype arrives unruled. MEASURED at MF-W1b's first run: **18 real archetypes
    // with no row and no ruling** — a third of the vocabulary, silently partial.
    const arch = engineArchetypes();
    const missing = arch.filter((k) => !CONDITION_TO_STRESSOR[k] && !CONDITION_UNBRIDGED[k]);
    expect(missing, `unruled engine archetypes: ${missing.join(', ')}`).toEqual([]);
    // ⚠ NON-VACUITY: the vocabulary must be a real one. A walker over an empty set passes.
    expect(arch.length).toBeGreaterThan(40);
  });

  it('NO bridge row is FICTIONAL — every key the fabric maps is one the engine can write', () => {
    // The mirror arm, and it is the one MF-INT1's finding actually convicted: 8 of 9 keys
    // named nothing. ⚠ THE VOCABULARY HAS TWO WRITERS and a check over one of them produces
    // FALSE CONVICTIONS as well as false clean bills — MF-W1b's own first audit convicted
    // `occupation_seed`, which `worldPulse/convergence.js` mints directly.
    const arch = new Set(engineArchetypes());
    const fictional = Object.keys(CONDITION_TO_STRESSOR).filter((k) => !arch.has(k));
    expect(fictional, `bridge keys no engine writer produces: ${fictional.join(', ')}`).toEqual([]);
    expect(ARCHETYPE_SOURCES.length).toBe(2);
  });

  it('every bridge TARGET is a catalog key the fabric can express or has cut with a reason', () => {
    // The bridge's far end. A row pointing at a key `STRESSOR_DISPOSITION` has never heard of
    // is the same defect from the other side.
    for (const [arch, key] of Object.entries(CONDITION_TO_STRESSOR)) {
      expect(STRESSOR_DISPOSITION[key], `${arch} → '${key}' is not a catalog key`).toBeTruthy();
    }
  });

  it('a ruling is an ARGUMENT, not a placeholder — every unbridged row states a reason', () => {
    for (const [k, why] of Object.entries(CONDITION_UNBRIDGED)) {
      expect(typeof why, k).toBe('string');
      expect(why.length, `'${k}' has a reason too short to be an argument`).toBeGreaterThan(30);
    }
    // ⚠ AND THE TWO SETS ARE DISJOINT. A key with both a row and a ruling is two answers.
    const both = Object.keys(CONDITION_TO_STRESSOR).filter((k) => CONDITION_UNBRIDGED[k]);
    expect(both).toEqual([]);
  });
});
