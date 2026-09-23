/**
 * editWorldFactResources.test.js — EM-B2b2's ACCEPTANCE BATTERY (A1 to A6).
 *
 * THE PROPERTY: the DM's word for `worldFact.resources` SURVIVES the step that resolves the
 * nearby-resource roster. EM-B2b routes an edited world fact into `config′` at its declared
 * `inputKey`, and for this one fact that key is `nearbyResources` — the very key
 * `src/generators/steps/resolveResources.js` RE-ROLLS in random mode and writes back onto
 * `record.config`. So the DM's roster stood only where the rolled roster happened to equal it.
 *
 * ⛔ THE MEASUREMENT THIS BATTERY EXISTS TO MOVE, reproduced at this branch's base (795d2a582)
 * before a line was written, over the live 63-row census corpus with the layer holding exactly
 * `worldFact:world:resources -> ['magical_node']`:
 *
 *     the DM's roster stands at `record.config.nearbyResources` on  1 of 63 rows.
 *
 * That is the estate's cardinal applied-looking-and-absent class in its second form: EM-B2b's
 * route reports APPLIED on all 63 and the fact the DM edited moves on one. Every arm below is
 * green only because that number moved.
 *
 * ⭐ THE CURE IS A MARK `config′` ALREADY CARRIES, NEVER A NEW FLAG. A new config key would be
 * spread onto `effectiveConfig` by `resolveConfig` and land on `record.config`, and a persisted
 * shape is the owner's. In RANDOM mode the roster key is GENERATOR-OWNED and the wizard writes
 * `null` into it, so an ARRAY there is an authored premise — unless it is the step's own resolved
 * echo, which always carries the `nearbyResourcesNative` sidecar beside it. A6 is that negative
 * control and it is the load-bearing half of the mechanism.
 *
 * ⭐ EVERY ASSERTED SET IS IMPORTED FROM ITS PRODUCER — the declaration table from EM-A1, the
 * record path from EM-R0a's register, the option set from its own home, the corpus from the
 * census helper. The only literals are the PRE-CHANGE digests of A2 and A6, and they were
 * captured BY COPY from the planted pre-change step rather than re-recorded from this tree.
 */
import { createHash } from 'node:crypto';

import { describe, expect, it } from 'vitest';

import { EMPTY_DM_LAYER, rederive } from '../../src/domain/edit/dmLayer.js';
import { FIELD_DECLARATIONS, declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { GENERATION_TIER1 } from '../../src/domain/generation/generationForkRegistry.js';
import { deriveRegenerationDelta } from '../../src/domain/regenerationDelta.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import { MONSTER_THREAT_TIERS } from '../../src/data/monsterThreat.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { CULTURES, TERRAINS } from '../../src/domain/worldFactOptions.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { censusCorpus } from '../helpers/generationForkCensus.js';

const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** The injected handles, built the way the store's lazy seat builds them. */
const ENGINE = Object.freeze({ run: generateSettlementPipeline, getStepMeta });

/** EM-P3's canonical sets on the consult, each IMPORTED from the home WORLD_FACT_SOURCES cites. */
const OPTION_SETS = Object.freeze({
  terrain: TERRAINS,
  culture: CULTURES,
  monsterThreat: MONSTER_THREAT_TIERS,
  stressors: Object.keys(STRESS_TYPE_MAP),
  resources: Object.keys(RESOURCE_DATA),
});
const DECLARATIONS = Object.freeze({
  declarationsFor,
  worldFactOptions: (field) => OPTION_SETS[field] ?? [],
});

const layerOf = (pairs) => ({
  roots: Object.fromEntries(pairs), worldFacts: {}, minted: {}, phantoms: {},
});
const ROOT_KEY = 'worldFact:world:resources';

/** THE DM'S WORD. One member, a real key of the option set, and a RARE one: A1's anti-vacuity. */
const DM_ROSTER = Object.freeze(['magical_node']);

/** The DECLARED record leaf of one world fact, read from EM-R0a's register through its own tier1. */
function declaredLeafOf(field) {
  const row = FIELD_DECLARATIONS.worldFact.find((each) => each.field === field);
  const held = GENERATION_TIER1.find((each) => each.step === row.tier1.step && each.key === row.tier1.key);
  return held?.recordPath ?? null;
}

/** Read a `record.a.b` path off a settlement, own-keys only. */
function readAt(record, path) {
  let cursor = record;
  for (const segment of String(path).split('.').slice(1)) {
    if (!cursor || typeof cursor !== 'object' || !Object.hasOwn(cursor, segment)) return { found: false, value: undefined };
    cursor = cursor[segment];
  }
  return { found: true, value: cursor };
}

const census = censusCorpus();

/** One world, and the config the save stored for it — the B2b battery's own idiom. */
function worldFor(row) {
  const { _seed: seed, ...config } = row;
  return { config, seed, record: generateSettlementPipeline(config, null, { seed, customContent: {} }) };
}

/**
 * THE THREE FIXED ROWS, by INDEX into the live census so the corpus stays the producer. Chosen
 * across two tiers and two trade routes; each one carried the DM's word on NEITHER at the base.
 */
const FIXED = Object.freeze([0, 21, 42]);

/**
 * ⛔ THE PRE-CHANGE DIGESTS, CAPTURED BY COPY AND NEVER RE-RECORDED. Measured at 795d2a582 with
 * `git show HEAD:src/generators/steps/resolveResources.js` planted over the tree (sha256
 * 62e16d59b75cb173e741da40db8e6208bd021c43696a9f5d9b18fbbecaa70145) and the tree restored
 * byte-identically afterwards. `derived` is the no-layer re-derivation, which at the base equals
 * the fresh generation exactly; `replay` is the RESOLVED `record.config` handed back in as a
 * generation input, which is the shape A6 proves this change cannot see.
 */
const PRE_CHANGE = Object.freeze({
  0: Object.freeze({
    derived: '6d6a00a32714b90ee401710772a327c8bcd5a3eefe9bc253b503bcadade38c9c',
    replay: '811c1d883ebdf15f665a8cedfc9a027500ddcfea10f8966827508f2023e1d92f',
  }),
  21: Object.freeze({
    derived: 'b77b5909009112855bad4dacf881847d06e43385f64a15f4b528e0d30c91c3ce',
    replay: '9eee1a5b114212bf577bec50634c88e90b28443f397e47632ce2d98d6d7add01',
  }),
  42: Object.freeze({
    derived: '483e61a32aaffbb8dbe731f9f92ebcfb6ff5c2dee8a0fb39028c94684d1fe0f0',
    replay: 'e15fd95d7dccb6e6cce21e30a9807b2ee7fbf33c97677cddce1f35eb55aaf8b3',
  }),
});

describe('EM-B2b2 — the DM\'s nearby-resources word survives resolveResources', () => {
  it('A1 — THE DM\'S ROSTER STANDS AT ITS OWN DECLARED LEAF: byte-equal on three fixed seeds, and carried on every census row', () => {
    // ANTI-VACUITY FIRST. The leaf is read from EM-R0a's register through the row's own tier1
    // pointer, and the plant is a real member of the option set the consult serves; if either
    // moved, every claim below would be green on nothing.
    const leaf = declaredLeafOf('resources');
    expect(leaf, 'the resources row\'s tier1 pair resolves on GENERATION_TIER1').toBe('record.config.nearbyResources');
    expect(census.length, 'the census corpus is live').toBe(63);
    expect(OPTION_SETS.resources.includes(DM_ROSTER[0]), 'the DM\'s word is a real member of the '
      + 'option set, or the re-derivation below would be refused rather than carried').toBe(true);

    const layer = layerOf([[ROOT_KEY, [...DM_ROSTER]]]);

    // (1) THE THREE FIXED ROWS, BYTE-EQUAL. ⛔ The assertion is on the VALUE at the declared leaf
    // and never on `unapplied === []`: the defect this member cures reported an EMPTY refusal list
    // while the roster the DM stated was re-rolled out from under her.
    for (const index of FIXED) {
      const { config, record } = worldFor(census[index]);
      const moved = rederive(record, config, layer, ENGINE, DECLARATIONS);
      const at = readAt(moved.record, leaf);
      expect(at.found, `row ${index}: the declared leaf is present on the re-derived record`).toBe(true);
      expect(at.value, `row ${index}: the DM's roster stands at ${leaf}, byte-equal to her word`)
        .toEqual([...DM_ROSTER]);
    }

    // (2) AND THE WHOLE CENSUS. This is the figure EM-R7's corpus ratchet A2 row
    // `'worldFact.resources'` must read once this lands: 1 at the base, 63 here.
    const missed = [];
    for (let index = 0; index < census.length; index += 1) {
      const { config, record } = worldFor(census[index]);
      const moved = rederive(record, config, layer, ENGINE, DECLARATIONS);
      if (sha(readAt(moved.record, leaf).value) !== sha([...DM_ROSTER])) missed.push(index);
    }
    expect(missed, 'the DM\'s world fact stands at its OWN declared record leaf on every census '
      + 'row. The base carried it on ONE, and that one was the row whose rolled roster happened '
      + 'to equal her word.').toEqual([]);
  }, 900_000);

  it('A2 — THE NO-EDIT PATH IS UNMOVED: a dormant re-derivation is byte-identical to the PRE-CHANGE step\'s own output', () => {
    // ⛔ AGAINST THE PRE-CHANGE STEP, CAPTURED BY COPY — never against a golden re-recorded from
    // this tree, which would be this arm asserting its own change is correct.
    const drift = [];
    for (const index of FIXED) {
      const { config, record } = worldFor(census[index]);
      const dormant = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
      if (sha(dormant.record) !== PRE_CHANGE[index].derived) drift.push(index);
      // The fresh generation is the same world at this base, which is what makes the digest above
      // a claim about the ENGINE rather than about the re-derivation wrapper alone.
      if (sha(record) !== PRE_CHANGE[index].derived) drift.push(`${index}:fresh`);
    }
    expect(drift, 'a config carrying NO world-fact roster resolves exactly as it did before this '
      + 'change: the mark is absent, the branch is not taken, and not one byte of the world moves')
      .toEqual([]);
  }, 600_000);

  it('A3 — THE REPORT NAMES THE ROW AS CARRIED: the regeneration delta shows the DM\'s value against the world\'s previous answer', () => {
    const leaf = declaredLeafOf('resources');
    const layer = layerOf([[ROOT_KEY, [...DM_ROSTER]]]);
    const rows = [];
    for (const index of FIXED) {
      const { config, record } = worldFor(census[index]);
      const control = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
      const moved = rederive(record, config, layer, ENGINE, DECLARATIONS);
      // `dmFieldsOf` reads the layer off the AFTER snapshot, so the layer is attached the way
      // EM-B2b's own A2 arm attaches it; `rederive` returns the engine's record and no layer.
      const delta = deriveRegenerationDelta(control.record, { ...moved.record, dmLayer: layer }, DECLARATIONS);
      rows.push({
        index,
        section: delta.dmFields.worldFacts,
        roots: delta.dmFields.roots,
        carried: sha(readAt(moved.record, leaf).value) === sha(delta.dmFields.worldFacts[0]?.dmValue),
      });
    }
    expect(rows.map((row) => row.section.map((entry) => entry.configKey)),
      'the twelfth key\'s world-fact section names the resources row by the ENGINE\'s own config key')
      .toEqual([['nearbyResources'], ['nearbyResources'], ['nearbyResources']]);
    expect(rows.map((row) => row.section[0].dmValue), 'and it reports the DM\'s own word')
      .toEqual([[...DM_ROSTER], [...DM_ROSTER], [...DM_ROSTER]]);
    expect(rows.map((row) => row.roots.length), 'a world fact is NOT reported as a root: the '
      + 'partition is by provenance and it is total').toEqual([0, 0, 0]);
    expect(rows.filter((row) => !row.carried).map((row) => row.index),
      'THE CARRIED FIGURE: the value the report names as the DM\'s is the value standing at the '
      + 'declared leaf, on 3 of 3 fixed rows').toEqual([]);
    // ⛔ AND THE ENGINE'S PREVIOUS ANSWER IS STILL REPORTED BESIDE IT, or the section would show
    // the DM her own word twice and call it a difference.
    const engineValues = rows.map((row) => row.section[0].engineValue);
    expect(engineValues.filter((value) => Array.isArray(value)).length,
      'the stored config\'s own roster is reported as the engine value on every row').toBe(FIXED.length);
    expect(engineValues.filter((value) => sha(value) === sha([...DM_ROSTER])),
      'and it DIFFERS from the DM\'s word on all three, which is what makes the section a '
      + 'difference rather than an echo').toEqual([]);
  }, 600_000);

  it('A4 — THE OPTION SET STILL REFUSES: a roster naming a value outside RESOURCE_DATA throws EM-B2b\'s own refusal, unchanged', () => {
    const { config, record } = worldFor(census[0]);
    const invented = 'orichalcum_seam';
    expect(OPTION_SETS.resources.includes(invented), 'the plant is outside the canonical set, or '
      + 'the refusal below proves nothing').toBe(false);
    const layer = layerOf([[ROOT_KEY, [DM_ROSTER[0], invented]]]);
    // An ARRAY value is validated MEMBER BY MEMBER, so a roster that is half real is still refused.
    expect(() => rederive(record, config, layer, ENGINE, DECLARATIONS)).toThrow(/value_not_in_option_set/);
    expect(() => rederive(record, config, layer, ENGINE, DECLARATIONS)).toThrow(/config\.nearbyResources/);
    // ⛔ AND NOTHING FELL BACK OR CLAMPED: the refusal is a throw, so no world was built from it.
    expect(sha(worldFor(census[0]).record), 'the record is byte-identical after the refusal')
      .toBe(sha(record));
  }, 300_000);

  it('A6 — THE MARK IS NOT THE ECHO: the step\'s own resolved write-back, handed back in as a generation input, resolves exactly as before', () => {
    // ⛔⛔ THE LOAD-BEARING NEGATIVE CONTROL OF THE WHOLE MECHANISM. `record.config` IS a live
    // generation input (`densityCreateBoundary.js`'s REPLAY, and the Library's saved-config fork),
    // and it carries an ARRAY at the roster key exactly as `config′` does. What tells them apart is
    // the `nearbyResourcesNative` SIDECAR, which this step writes back beside the roster on every
    // run and which no wizard config carries. If that clause ever weakens, a replay would freeze
    // its own roster and a custom resource would be counted as native.
    const drift = [];
    for (const index of FIXED) {
      const { seed, record } = worldFor(census[index]);
      expect(Array.isArray(record.config.nearbyResources), `row ${index}: the echo carries an array `
        + 'at the roster key, or this arm is not testing the ambiguity it exists to resolve').toBe(true);
      expect(Array.isArray(record.config.nearbyResourcesNative), `row ${index}: the echo carries the `
        + 'native sidecar, which is the mark\'s own discriminator').toBe(true);
      const replay = generateSettlementPipeline(record.config, null, { seed, customContent: {} });
      if (sha(replay) !== PRE_CHANGE[index].replay) drift.push(index);
    }
    expect(drift, 'a replay from the resolved config is byte-identical to the PRE-CHANGE step\'s '
      + 'own replay: the generator\'s answer is never mistaken for the DM\'s word').toEqual([]);
  }, 600_000);

  it('A5 — U39 STOPS ON ITS OWN ROW: no Tier-1 pair resolves to the monsterThreat leaf, so the narrowing has no shape at this base', () => {
    // U39 asked for `worldFact.monsterThreat`'s tier1 leaf to be narrowed from the WHOLE config to
    // the tier's own key. MEASURED here rather than assumed: the row's pair resolves to
    // `record.config`, and GENERATION_TIER1 carries no pair at all whose recordPath is the narrow
    // leaf. The `tier1` typedef is `{ step, key }` with no sub-path, so narrowing would need a new
    // key on a shape `src/domain/edit/types.js` owns and a new row on a SHARED register — neither
    // of which is this member's. ⛔ The row is therefore UNTOUCHED and the STOP is recorded here.
    // ⭐ WHEN a pair does resolve to the narrow leaf, this arm REDS and row 120 is narrowed then.
    const row = FIELD_DECLARATIONS.worldFact.find((each) => each.field === 'monsterThreat');
    expect(row.tier1, 'the row still names the pair U39 measured').toEqual({ step: 'resolveConfig', key: 'effectiveConfig' });
    expect(declaredLeafOf('monsterThreat'), 'and that pair still resolves to the WHOLE config')
      .toBe('record.config');
    expect(GENERATION_TIER1.length, 'the register is live, or the absence below is vacuous').toBeGreaterThan(0);
    const narrow = GENERATION_TIER1.filter((each) => each.recordPath === 'record.config.monsterThreat');
    expect(narrow.map((each) => `${each.step}.${each.key}`), 'no Tier-1 pair holds the narrow leaf, '
      + 'so U39\'s second row has no shape to land in at this base and is STOPPED, not silently '
      + 'widened. The sibling facts show the shape exists where a step provides the leaf: terrain '
      + 'and culture both resolve to their own key on record.config.').toEqual([]);
    // The anti-vacuity: the same register DOES hold the narrow leaf for the facts whose step
    // provides it, so the absence above is a fact about monsterThreat and not about the scan.
    expect(declaredLeafOf('terrain'), 'terrain resolves to its own narrow leaf').toBe('record.config.terrainType');
    expect(declaredLeafOf('resources'), 'and so does the fact this member cures').toBe('record.config.nearbyResources');
  });
});
