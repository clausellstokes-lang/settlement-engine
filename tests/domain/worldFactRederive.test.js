/**
 * worldFactRederive.test.js — EM-B2b's ACCEPTANCE BATTERY (A1, A2, A3, A4, A5, A7).
 *
 * THE PROPERTY: a world fact the DM edits is ROUTED by its declaration's `provenance` into
 * `config′` and the settlement is RE-DERIVED from the changed world. Design §22.1 rules what the
 * DM is then shown: *"the consequence of an edit is the DIFFERENCE between two re-derivations"* —
 * so A1 measures that difference and asserts the DM's value AT THE FACT'S OWN DECLARED LEAF, the
 * one `GENERATION_TIER1`'s `recordPath` names. ⛔ Nothing here asserts that a record-built pin set
 * reproduces a record; that clause is refuted (the chair, judgment 33) and is not this car's
 * mechanism at all, because a world-fact root writes NO PIN.
 *
 * ⛔ THE MEASUREMENT THIS BATTERY EXISTS TO MOVE, reproduced at this branch's base before a line
 * was written: `applyEdit` stores a world-fact op in `roots` (`worldFacts` stays `{}` on all five
 * fields), `pinsFrom` PASS 1 then split `config.terrainType` into the collection `config`, no step
 * provides it, and the override was reported `unknown_key` — 63 of 63 census rows, for every one
 * of the five facts, pin bag empty 63/63, applied 0/63. The DM's word was ECHOED back onto
 * `record.config` while the fact she edited never moved. Every arm below is green only because
 * those numbers moved.
 *
 * ⭐ EVERY ASSERTED SET IS IMPORTED FROM ITS PRODUCER — the declaration table from EM-A1, the
 * record path from EM-R0a's register, the option-set roster and the five vocabularies from EM-P3's
 * own homes, the golden from its committed fixture. A re-typed set is how two instruments come to
 * disagree while both report green.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { EMPTY_DM_LAYER, applyEdit, pinsFrom, rederive } from '../../src/domain/edit/dmLayer.js';
import { FIELD_DECLARATIONS, declarationsFor, isEditableCard } from '../../src/domain/edit/fieldDeclarations.js';
import { GENERATION_TIER1 } from '../../src/domain/generation/generationForkRegistry.js';
import { deriveRegenerationDelta, regenerationDeltaSize } from '../../src/domain/regenerationDelta.js';
import { CULTURES, TERRAINS, WORLD_FACT_SOURCES } from '../../src/domain/worldFactOptions.js';
import { MONSTER_THREAT_TIERS } from '../../src/data/monsterThreat.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { censusCorpus } from '../helpers/generationForkCensus.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

const ROOT = process.cwd();
const GOLDEN = resolve(ROOT, 'tests', 'fixtures', 'generator-golden-master.json');
const PROSE_GOLDEN = resolve(ROOT, 'tests', 'fixtures', 'dossier-prose-manifest-golden.json');

const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const shaOfFile = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

/** The injected handles, built the way the store's lazy seat builds them. */
const ENGINE = Object.freeze({ run: generateSettlementPipeline, getStepMeta });

/**
 * ⭐ EM-P3's CANONICAL SETS, ON THE CONSULT (judgment 241 ruling 3). This is the CALLER's adapter
 * and it is the one place the vocabularies are read; ⛔ `src/domain/edit/dmLayer.js` imports
 * `src/domain/worldFactOptions.js` NOWHERE, which is what keeps judgment 148's first-importer cost
 * at zero. Each value is IMPORTED from the home `WORLD_FACT_SOURCES` cites, never re-typed here.
 */
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

/** One world, and the config the save stored for it. */
function worldFor(row) {
  const { _seed: seed, ...config } = row;
  return { config, seed, record: generateSettlementPipeline(config, null, { seed, customContent: {} }) };
}

/** A layer holding exactly the overrides given, at EM-C4a's own root-key spelling. */
const layerOf = (pairs) => ({
  roots: Object.fromEntries(pairs), worldFacts: {}, minted: {}, phantoms: {},
});
const rootKey = (cardType, entityId, field) => `${cardType}:${entityId}:${field}`;

/** The DECLARED record leaf of one world fact, read from EM-R0a's register through the row's own tier1. */
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

/** Every `.js` and `.jsx` under a directory, repo-relative and POSIX. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) out.push(...walk(abs));
    else if (entry.endsWith('.js') || entry.endsWith('.jsx')) out.push(relative(ROOT, abs).split('\\').join('/'));
  }
  return out;
}

const census = censusCorpus();
const golden = goldenCorpus();
const manifest = JSON.parse(readFileSync(GOLDEN, 'utf-8'));
/** A fixed stride over a corpus, the estate's own sampling idiom. */
const stride = (rows, n) => rows.filter((_, index) => index % n === 0);

/**
 * ⭐ THE STATED BLAST RADIUS (A4), MEASURED AT THIS BRANCH'S BASE AND NOT INHERITED. Design §14
 * final rules a world-fact change's reach CONSEQUENCE BY DESIGN, so this packet may not BOUND it —
 * its duty is to keep it STATED. The roster is therefore EXACT in both directions and a new reader
 * REDS here rather than growing quietly.
 *
 * ⚠ TWENTY-TWO, NOT THE TWENTY-ONE THE PACKET COMPILED AT `1b073009f`. The twenty-second is
 * `src/generators/pipeline.js`, and it arrived with EM-R1c's own build commit — this branch's base
 * — as the record-path row `['culture', 'record.config.culture']`. It is a DECLARATION of where
 * the ctx key lands and not a step that shapes a world from the value, which is a distinction this
 * scan deliberately cannot draw: the scan reports every file that NAMES the fact, and the reading
 * of each name is the chair's. The row is reported as this lane's finding rather than filtered
 * away, because a filter is how a stated radius stops being stated.
 */
const CULTURE_READERS = Object.freeze([
  'src/generators/aiLayer.js',
  'src/generators/computeActiveChains.js',
  'src/generators/demandProfile.js',
  'src/generators/economy/foodBalance.js',
  'src/generators/economy/prosperity.js',
  'src/generators/foodGenerator.js',
  'src/generators/generateSettlementPipeline.js',
  'src/generators/generationCoherence.js',
  'src/generators/generationContext.js',
  'src/generators/institutionProbability.js',
  'src/generators/isolationGenerator.js',
  'src/generators/narrativeGenerator.js',
  'src/generators/npc/generatedNpcTitle.js',
  'src/generators/npcGenerator.js',
  'src/generators/npcStructure.js',
  'src/generators/pipeline.js',
  'src/generators/steps/assembleSettlement.js',
  'src/generators/steps/buildGenerationContext.js',
  'src/generators/steps/economyReconcilePass.js',
  'src/generators/steps/generatePopulation.js',
  'src/generators/steps/resolveConfig.js',
  'src/generators/steps/stepMetadata.js',
]);

describe('EM-B2b — world facts by consequence: the route, the refusals and the stated radius', () => {
  it('A1 — THE DIFFERENCE BETWEEN TWO RE-DERIVATIONS: the DM\'s terrain stands at the fact\'s own declared leaf, and the world answers', () => {
    // ANTI-VACUITY FIRST. The leaf is read from EM-R0a's register through the row's own tier1
    // pointer; if either moved, every claim below would be green on nothing.
    const leaf = declaredLeafOf('terrain');
    expect(leaf, 'the terrain row\'s tier1 pair resolves on GENERATION_TIER1').toBe('record.config.terrainType');
    expect(census.length, 'the census corpus is live').toBe(63);
    expect(isEditableCard('worldFact'), 'the world-fact card is declared, or the layer below holds nothing').toBe(true);

    const layer = layerOf([[rootKey('worldFact', 'world', 'terrain'), 'coastal']]);
    const missed = [];
    const controlAlreadyCoastal = [];
    const unmovedWhereItShould = [];
    for (const row of census) {
      const { config, record } = worldFor(row);
      const control = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
      const moved = rederive(record, config, layer, ENGINE, DECLARATIONS);
      // ⛔ THE ASSERTION IS ON THE VALUE AT THE DECLARED LEAF, never on `unapplied === []`: the
      // measured defect this packet cures reported an EMPTY refusal list while the fact the DM
      // edited never moved, and `record.config` echoed her word back at her 63 times out of 63.
      const at = readAt(moved.record, leaf);
      if (!at.found || at.value !== 'coastal') missed.push(keyOf(row));
      const before = readAt(control.record, leaf);
      if (before.value === 'coastal') controlAlreadyCoastal.push(keyOf(row));
      else if (sha(control.record) === sha(moved.record)) unmovedWhereItShould.push(keyOf(row));
    }
    expect(missed, 'the DM\'s world fact stands at its OWN declared record leaf on every census row')
      .toEqual([]);
    expect(controlAlreadyCoastal.length, 'the corpus is not already all coastal, or the difference '
      + 'below would be vacuous').toBeLessThan(census.length);
    expect(unmovedWhereItShould, 'where the coast is NEW, the two re-derivations DIFFER: a world '
      + 'fact that changed nothing is the packet failing to do the one thing it claims').toEqual([]);

    // AND THE DIFFERENCE IS REPORTED, ENTITY BY ENTITY AND FIELD BY FIELD (design §22.1).
    const reported = [];
    for (const row of stride(census, 9)) {
      const { config, record } = worldFor(row);
      const control = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
      const moved = rederive(record, config, layer, ENGINE, DECLARATIONS);
      if (readAt(control.record, leaf).value === 'coastal') continue;
      reported.push(regenerationDeltaSize(deriveRegenerationDelta(control.record, moved.record, DECLARATIONS)));
    }
    expect(reported.length, 'the stride found no row whose coast is new, so the report below is vacuous')
      .toBeGreaterThan(0);
    expect(reported.filter((size) => size === 0), 'moving a settlement to the coast re-derives the '
      + 'world around it, and design §14 final rules that consequence by design rather than an error')
      .toEqual([]);
  }, 900_000);

  it('A2 — DORMANT AND ABSENT: no world-fact root re-derives exactly as today, and the inert worldFacts bag is read by nobody', () => {
    const { config, record } = worldFor(census[0]);
    const before = sha(record);

    // (1) NO WORLD-FACT ROOT: the config channel is never entered and `config′` IS `config`.
    const plain = layerOf([[rootKey('npc', record.npcs[0].id, 'role'), 'Warden']]);
    const dormant = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
    const rooted = rederive(record, config, plain, ENGINE, DECLARATIONS);
    expect(pinsFrom(record, EMPTY_DM_LAYER, DECLARATIONS, ENGINE).routed,
      'a dormant layer routes nothing').toEqual([]);
    expect(pinsFrom(record, plain, DECLARATIONS, ENGINE).routed,
      'a root of any other provenance takes the landed pin path and routes nothing').toEqual([]);
    expect(rooted.record.npcs.find((npc) => npc.id === record.npcs[0].id).role,
      'the plain root still lands, so unit A is invisible to every other card').toBe('Warden');

    // (2) THE INERT BAG. ⛔ Nobody writes `layer.worldFacts` — `applyEdit` stores a world-fact op
    // in `roots`, measured on all five fields — so a leaf that read it would report an empty
    // section for every edit a DM ever makes. A layer carrying a NON-EMPTY bag is byte-identical
    // to the same layer with an empty one, which is that inertness stated as a property.
    const withBag = { ...plain, worldFacts: { terrainOverride: 'desert', culture: 'norse' } };
    expect(sha(rederive(record, config, withBag, ENGINE, DECLARATIONS).record),
      'the inert bag reaches NOTHING: it is kept in the shipped shape because removing it is a '
      + 'persistence-shape change, and that is the owner\'s').toBe(sha(rooted.record));
    const bagOnly = { roots: {}, worldFacts: { terrainOverride: 'desert' }, minted: {}, phantoms: {} };
    expect(sha(rederive(record, config, bagOnly, ENGINE, DECLARATIONS).record))
      .toBe(sha(dormant.record));

    // (3) AND THE DELTA AGREES: no world-fact ROOT means no world-fact SECTION, whatever the bag holds.
    const delta = deriveRegenerationDelta(record, { ...record, dmLayer: withBag }, DECLARATIONS);
    expect(delta.dmFields.worldFacts, 'the section is built from roots and never from the bag').toEqual([]);
    expect(delta.dmFields.roots.map((entry) => entry.field), 'the plain root is still named').toEqual(['role']);
    expect(sha(record), 'the input record is byte-identical after every call').toBe(before);
  }, 300_000);

  it('A3 — NO SILENT FALLBACK, AND THE ENGINE WILL NOT HELP: an undeclared key, an out-of-set value and an unusable consult each REFUSE', () => {
    const { config, record } = worldFor(census[0]);
    const layer = layerOf([[rootKey('worldFact', 'world', 'culture'), 'dwarven']]);

    // ⛔ THE MEASUREMENT THAT MAKES THIS ARM THIS PACKET'S OWN: the ENGINE does not refuse a bad
    // world fact. `culture: 'dwarven'` resolves SILENTLY to 'mixed' — so an arm that passed
    // because the engine "handled" the value would have proved nothing at all.
    const normalised = generateSettlementPipeline({ ...config, culture: 'dwarven' }, null,
      { seed: record._seed, customContent: {} });
    expect(normalised.config.culture, 'the engine normalises an unknown culture instead of '
      + 'refusing it, which is why the throw below is this leaf\'s own').not.toBe('dwarven');
    expect(CULTURES.includes('dwarven'), 'the plant is outside EM-P3\'s canonical set').toBe(false);

    // (1) A VALUE OUTSIDE THE INJECTED OPTION SET: throws, naming the key and the accepted set.
    expect(() => rederive(record, config, layer, ENGINE, DECLARATIONS))
      .toThrow(/value_not_in_option_set/);
    expect(() => rederive(record, config, layer, ENGINE, DECLARATIONS)).toThrow(/config\.culture/);
    expect(() => rederive(record, config, layer, ENGINE, DECLARATIONS)).toThrow(/germanic/);

    // (2) A WORLD FACT WHOSE DECLARATION NAMES NO ENGINE KEY: throws. The stub consult declares a
    // world-fact row with no `inputKey`, which is the shape unit B's walker refuses on the real
    // table and which this leaf must refuse rather than guess a key for.
    const keyless = {
      declarationsFor: (cardType) => (cardType === 'worldFact'
        ? [{ card: 'worldFact', field: 'terrain', kind: 'pool', provenance: 'world-fact', outputKey: 'config.terrainType' }]
        : []),
      worldFactOptions: (field) => OPTION_SETS[field] ?? [],
    };
    expect(() => rederive(record, config, layerOf([[rootKey('worldFact', 'world', 'terrain'), 'coastal']]), ENGINE, keyless))
      .toThrow(/unknown_world_fact/);

    // (3) AN UNUSABLE INJECTED CONSULT: FAILS CLOSED, exactly as `usableDeclarations` already does
    // for a root. It validates nothing, so it REFUSES every world-fact root — including a
    // PERFECTLY VALID one — and the re-derivation is the one with no world fact in it at all.
    // ⛔ It can only shut the door, never widen it: nothing falls back to the stored value,
    // nothing is clamped, and no bad value continues into the engine.
    const leaf = declaredLeafOf('terrain');
    const valid = layerOf([[rootKey('worldFact', 'world', 'terrain'), 'coastal']]);
    expect(TERRAINS.includes('coastal'), 'the value is a real member, or arm (3) proves nothing').toBe(true);
    const adopted = rederive(record, config, valid, ENGINE, DECLARATIONS);
    expect(readAt(adopted.record, leaf).value, 'the same override lands with an ADOPTED consult, '
      + 'or the refusals below are indistinguishable from a channel that never worked').toBe('coastal');
    const shut = sha(rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS).record);
    for (const notAdopted of [{ declarationsFor }, { declarationsFor, worldFactOptions: null }]) {
      const out = rederive(record, config, valid, ENGINE, notAdopted);
      expect(sha(out.record), 'a consult carrying no option-set member has not adopted the world-'
        + 'fact channel, so the door is SHUT and the run is the one with no world fact at all')
        .toBe(shut);
      expect(readAt(out.record, leaf).value, 'and the DM\'s value is NOT at the leaf').not.toBe('coastal');
      expect(out.unapplied.map((row) => row.key), '⛔ and it is not reported as a PIN refusal '
        + 'either: a routed world fact leaves the pin population entirely').toEqual([]);
    }
    // ⭐ NOT WIRED IS QUIET; WIRED AND WRONG IS LOUD. A consult that CARRIES the member and answers
    // nothing usable has adopted the channel and broken it, so it refuses by THROWING.
    expect(() => rederive(record, config, valid, ENGINE, { declarationsFor, worldFactOptions: () => 'not a set' }))
      .toThrow(/value_not_in_option_set/);

    // ⛔ AND NOTHING FELL BACK, CLAMPED OR WARNED: the record never moved.
    expect(sha(worldFor(census[0]).record)).toBe(sha(record));
  }, 300_000);

  it('A4 — THE STATED BLAST RADIUS IS COMPLETE: the culture reader set under src/generators is EXACT in both directions', () => {
    const files = walk(join(ROOT, 'src', 'generators'));
    expect(files.length, 'the src/generators walk found nothing, so the roster below is vacuous')
      .toBeGreaterThan(100);
    const readers = files.filter((rel) => readFileSync(resolve(ROOT, rel), 'utf-8').includes('culture')).sort();
    expect(
      readers,
      'the culture reader set under src/generators is EXACT in BOTH directions. An UNLISTED reader'
      + ' means the blast radius of a world-fact change grew without anybody saying so, which is'
      + ' what design §14 final\'s consequence-by-design ruling forbids this packet to let happen'
      + ' quietly; a MISSING listed one means the roster has aged instead of convicting. The set is'
      + ' STATED here and it is NOT bounded anywhere.',
    ).toEqual([...CULTURE_READERS].sort());
    // The two heads of the step graph are in it, which is the measured reason a culture change
    // re-derives essentially the whole world: both sit upstream of every chooser.
    expect(readers).toContain('src/generators/steps/resolveConfig.js');
    expect(readers).toContain('src/generators/steps/buildGenerationContext.js');
  });

  it('A5 — IDEMPOTENCY AND PURITY: three identical config\u2032 re-derives are byte-identical and nothing is mutated', () => {
    // \u26d4 THE SUBJECT MUST BE A RE-DERIVATION THAT ACTUALLY TOOK THE CONFIG CHANNEL. Without the
    // leaf clause below, this arm is green on a tree that REFUSES every world fact, because three
    // identical refusals are also byte-identical: a purity claim over a door that never opened.
    const leaf = declaredLeafOf('terrain');
    const verdicts = [];
    for (const row of stride(census, 13)) {
      const { config, record } = worldFor(row);
      const layer = layerOf([[rootKey('worldFact', 'world', 'terrain'), 'coastal']]);
      const recordBefore = sha(record);
      const configBefore = sha(config);
      const layerBefore = sha(layer);
      const runs = [0, 1, 2].map(() => rederive(record, config, layer, ENGINE, DECLARATIONS).record);
      verdicts.push(new Set(runs.map(sha)).size === 1
        && runs.every((each) => readAt(each, leaf).value === 'coastal')
        && sha(record) === recordBefore
        && sha(config) === configBefore
        && sha(layer) === layerBefore);
    }
    expect(verdicts.length, 'the stride is non-empty').toBeGreaterThan(0);
    expect(new Set(verdicts), 'same record, same config\u2032, same layer, same world, three times '
      + 'over, with the DM\'s fact standing at its declared leaf in all three; and the record, the '
      + 'stored config and the layer are all unmutated').toEqual(new Set([true]));
  }, 600_000);

  it('A7 — THE GOLDENS CANNOT SEE ANY OF IT: both fixtures are byte-identical and a no-layer re-derivation is still the committed golden', () => {
    // ⛔ BYTE-IDENTITY, BY SHA-256, AGAINST THE VALUES MEASURED AT THIS PACKET'S BASE. §11 makes a
    // single byte of movement a STOP, and a re-record is the chair's word and never a lane's.
    expect(shaOfFile(GOLDEN), 'tests/fixtures/generator-golden-master.json moved')
      .toBe('7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e');
    expect(shaOfFile(PROSE_GOLDEN), 'tests/fixtures/dossier-prose-manifest-golden.json moved')
      .toBe('88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084');

    // AND THE REASON THEY CANNOT MOVE: fresh generation passes no layer, so no world fact is ever
    // routed and `config′` is `config` itself. Measured against the committed manifest.
    expect(golden.length, 'the golden corpus is live').toBeGreaterThan(500);
    expect(Object.keys(manifest).length, 'the committed golden is live').toBe(golden.length);
    const misses = [];
    for (const row of stride(golden, 75)) {
      const { config, record } = worldFor(row);
      const out = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
      if (sha(out.record) !== manifest[keyOf(row)]) misses.push(keyOf(row));
    }
    expect(misses.length, 'the stride is non-empty, or the absence above is vacuous').toBe(0);
    expect(stride(golden, 75).length).toBeGreaterThan(0);

    // ⛔ AND `applyEdit`'s SHIPPED ENVELOPE IS UNTOUCHED: a world-fact op is still a `set-root`
    // into `roots`, with `worldFacts` empty, exactly as EM-B2a1 shipped it. EM-C4a's mutation-path
    // roster watches THIS function, and unit A did not move it.
    const applied = applyEdit(EMPTY_DM_LAYER, {
      kind: 'set-root', key: rootKey('worldFact', 'world', 'terrain'), cardType: 'worldFact', field: 'terrain', value: 'coastal',
    }, { isEditableCard, declarationsFor });
    expect(applied.ok).toBe(true);
    expect(Object.keys(applied.layer.roots)).toEqual(['worldFact:world:terrain']);
    expect(applied.layer.worldFacts, 'the bag stays empty: the DECLARATION routes a world fact, '
      + 'never its address in the layer').toEqual({});
    expect(Object.keys(WORLD_FACT_SOURCES), 'EM-P3\'s roster still carries every field this '
      + 'battery\'s adapter serves').toEqual(expect.arrayContaining(Object.keys(OPTION_SETS)));
  }, 900_000);

  it('A9 — THE ROUTE IS TOTAL OVER ALL FIVE FACTS (EM-B2b2): each DM word lands at its OWN declared outputKey, on three fixed rows', () => {
    // ⭐⭐ WHY THIS ARM EXISTS, AND WHY IT IS HERE RATHER THAN IN A FILE OF ITS OWN. A1 proves the
    // route for ONE fact, and a route proven on one member is a route measured on one member: the
    // gap it left was found by EM-R7's corpus ratchet and cured by EM-B2b2. MEASURED at
    // 795d2a582, with each fact's own in-set plant carried into `config′`:
    //
    //     terrain 3/3 · culture 3/3 · monsterThreat 3/3 · stressors 3/3 · resources 0/3
    //
    // `worldFact.resources` is the one fact whose declared `inputKey` is ALSO the key its producing
    // step WRITES BACK (`config.nearbyResources`), so the random branch re-rolled the roster and
    // the DM's word was gone on 62 of the 63 census rows. The totality below is the instrument that
    // would have said so at this packet's own landing, and it now covers every member in both
    // directions: a sixth fact joins it the day it joins the table.
    //
    // ⛔ IT READS `record.<outputKey>` AND NOT THE TIER-1 recordPath, deliberately. The tier-1 pair
    // is allowed to be a PREFIX of the landing address (the walker's own branch c), and for
    // `monsterThreat` it is exactly that — `record.config`, the WHOLE config. `outputKey` is the
    // one address that is EXACT for all five, which is what makes one loop able to hold all five.
    const PLANTS = Object.freeze({
      terrain: 'coastal',
      culture: 'norse',
      monsterThreat: MONSTER_THREAT_TIERS[MONSTER_THREAT_TIERS.length - 1],
      stressors: [Object.keys(STRESS_TYPE_MAP)[0]],
      resources: ['magical_node'],
    });
    const FIXED = [0, 21, 42];
    expect(FIELD_DECLARATIONS.worldFact.map((row) => row.field).sort(),
      'the five declared world facts, read from the table rather than re-typed here')
      .toEqual(Object.keys(PLANTS).sort());

    // ANTI-VACUITY, PER FACT AND IN BOTH DIRECTIONS: every plant is a member of the set the
    // consult serves (or the re-derivation would REFUSE rather than carry), and the world does not
    // already hold it on all three rows (or equality below would measure nothing).
    const outOfSet = Object.entries(PLANTS).filter(([field, value]) => {
      const members = OPTION_SETS[field] ?? [];
      return (Array.isArray(value) ? value : [value]).some((each) => !members.includes(each));
    });
    expect(outOfSet.map(([field]) => field), 'every plant is inside its own option set').toEqual([]);

    const landedAt = (record, row) => readAt(record, `record.${row.outputKey}`);
    const carried = {};
    const alreadyHeld = {};
    for (const row of FIELD_DECLARATIONS.worldFact) {
      carried[row.field] = 0;
      alreadyHeld[row.field] = 0;
      for (const index of FIXED) {
        const { config, record } = worldFor(census[index]);
        const control = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
        const layer = layerOf([[rootKey('worldFact', 'world', row.field), PLANTS[row.field]]]);
        const moved = rederive(record, config, layer, ENGINE, DECLARATIONS);
        if (sha(landedAt(control.record, row).value) === sha(PLANTS[row.field])) alreadyHeld[row.field] += 1;
        if (sha(landedAt(moved.record, row).value) === sha(PLANTS[row.field])) carried[row.field] += 1;
      }
    }
    expect(Object.entries(alreadyHeld).filter(([, held]) => held === FIXED.length).map(([field]) => field),
      'no fact is already at its plant on all three rows, or its carried count below is vacuous')
      .toEqual([]);
    expect(carried, 'EVERY declared world fact the DM edits stands at its OWN declared outputKey on '
      + 'every fixed row. A fact that carries on some rows and not others is the applied-looking-'
      + 'and-absent class, and it is the exact shape EM-B2b2 cured for `resources`.')
      .toEqual({ terrain: 3, culture: 3, monsterThreat: 3, stressors: 3, resources: 3 });
  }, 900_000);
});
