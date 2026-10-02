/**
 * dmLayerGoldenIsolation.test.js — EM-B2a4's acceptance battery (ARCH §8 instrument 7).
 *
 * THE PROPERTY: a DM layer becomes a pin bag and a re-derivation WITHOUT the layer ever entering
 * the generators, without a new domain-to-generators import edge, and without one byte entering
 * the eager first-paint closure. A DORMANT layer pins NOTHING, so a re-derivation with no override
 * is the committed golden byte for byte; a one-root layer moves that root and nothing else in its
 * own collection.
 *
 * SEVEN ARMS, A1 A2 A4 A5 A6 A7 A8. A3 was retired with the pool refusal (judgment 176): pool
 * membership is a WRITE-TIME check at the single writer's door, so the orchestrator trusts the
 * layer's recorded values and re-validates nothing. The two surviving refusals live in A4.
 *
 * EVERY ASSERTED SET IS IMPORTED FROM ITS PRODUCER — the chooser roster from the runner, the
 * refusal set from the leaf, the eager closure from the build config's own derivation, the
 * boundary classes and the reacher manifest from the density boundary. A re-typed set is how two
 * instruments come to disagree while both report green.
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  EMPTY_DM_LAYER, REDERIVE_UNAPPLIED_REASONS, applyEdit, mintDmId, pinsFrom, rederive,
} from '../../src/domain/edit/dmLayer.js';
import { FIELD_DECLARATIONS, declarationsFor, isEditableCard } from '../../src/domain/edit/fieldDeclarations.js';
import { BOUNDARY_CLASSES, PIPELINE_REACHERS } from '../../src/domain/density/densityCreateBoundary.js';
import { GENERATION_TIER1 } from '../../src/domain/generation/generationForkRegistry.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { createPRNG } from '../../src/kernel/prng.js';
import { EAGER_FIRST_PAINT_MODULES } from '../../vite.config.js';
import { censusCorpus, runHeadless as runCensusRow } from '../helpers/generationForkCensus.js';
import { goldenCorpus, keyOf } from '../helpers/goldenMasterCorpus.js';

const ROOT = process.cwd();
const GOLDEN = resolve(ROOT, 'tests', 'fixtures', 'generator-golden-master.json');
const LEAF = 'src/domain/edit/dmLayer.js';
const SEAT = 'src/store/settlementRederiveAction.js';
const SLICE = 'src/store/editSlice.js';

const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** The injected handles, built the way the store's lazy seat builds them. */
const ENGINE = Object.freeze({ run: generateSettlementPipeline, getStepMeta });
const DECLARATIONS = Object.freeze({ declarationsFor });

/** One world, and the config it was generated from. */
function worldFor(row) {
  const { _seed, ...config } = row;
  return { config, seed: _seed, record: generateSettlementPipeline(config, null, { seed: _seed, customContent: {} }) };
}

/** A layer holding exactly the overrides given, at EM-C4a's own root-key spelling. */
const layerOf = (pairs) => ({
  roots: Object.fromEntries(pairs), worldFacts: {}, minted: {}, phantoms: {},
});
const rootKey = (cardType, entityId, field) => `${cardType}:${entityId}:${field}`;

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

/** Comments and string literals blanked, exactly as the create-boundary walker reads a module. */
function codeOnly(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');
}

const corpus = goldenCorpus();
const manifest = JSON.parse(readFileSync(GOLDEN, 'utf-8'));
/** A fixed stride over the same corpus, the estate's own sampling idiom. */
const stride = (n) => corpus.filter((_, index) => index % n === 0);

describe('EM-B2a4 — the DM layer, its pin bag and the golden isolation property', () => {
  it('A1 — pinsFrom reads its roster from the producer, and an edit pins its whole closure', () => {
    const { record } = worldFor(corpus[0]);
    const roster = getStepMeta();
    const rosterKeys = [...new Set(roster.flatMap((step) => step.provides))].sort();

    const dormant = pinsFrom(record, EMPTY_DM_LAYER, DECLARATIONS, ENGINE);
    expect(Object.keys(dormant.pins), 'a dormant layer pins NOTHING, which is what makes a '
      + 're-derivation with no override the golden itself').toEqual([]);
    expect(dormant.unapplied).toEqual([]);

    const victim = record.npcs[0];
    const edited = pinsFrom(record, layerOf([[rootKey('npc', victim.id, 'role'), 'Warden']]), DECLARATIONS, ENGINE);
    const pinned = Object.keys(edited.pins);
    // The closure: every chooser of every step that provides the edited collection, to a fixpoint.
    const expected = [...new Set(roster
      .filter((step) => step.provides.includes('npcs'))
      .flatMap((step) => step.provides))].sort();
    expect(pinned, 'the pin closure is the roster\'s own, both directions').toEqual(expected);
    expect(pinned.length, 'the closure is non-empty, or every claim here is green on nothing')
      .toBeGreaterThan(0);
    expect(pinned.every((key) => rosterKeys.includes(key)),
      'every pinned key is a key a registered step provides').toBe(true);
    expect(edited.missing.every((row) => typeof row.step === 'string' && Array.isArray(row.keys)),
      'every unpinnable step is NAMED with the keys it lacks').toBe(true);
  });

  it('A2 — a dormant, absent, null or malformed layer all behave identically, and nothing mutates', () => {
    const { config, record } = worldFor(corpus[0]);
    const before = sha(record);
    const shapes = [undefined, null, 7, [], EMPTY_DM_LAYER, {}];
    const hashes = shapes.map((layer) => sha(rederive(record, config, layer, ENGINE, DECLARATIONS).record));
    const envelopes = shapes.map((layer) => rederive(record, config, layer, ENGINE, DECLARATIONS).unapplied);
    expect(new Set(hashes).size, 'all six absence shapes give ONE result').toBe(1);
    expect(envelopes.flat(), 'a dormant layer refuses nothing').toEqual([]);
    expect(sha(record), 'the input record is byte-identical after every call').toBe(before);
  });

  it('A4 — boundary and sparse: the casualties are reported, the reason set is closed both ways', () => {
    const { config, record } = worldFor(corpus[0]);
    const before = sha(record);
    const victim = record.npcs[0];
    const layer = layerOf([
      [rootKey('npc', victim.id, 'role'), 'Warden'],
      [rootKey('npc', victim.id, 'status'), 'retired'],
      [rootKey('npc', 'npc.this-entity-is-not-in-the-record', 'role'), 'Reeve'],
      [rootKey('npc', victim.id, 'note'), 'an annotation carries no outputKey'],
      [rootKey('worldFact', victim.id, 'terrain'), 'riverside'],
      ['a-key-with-no-coordinates', 'nothing'],
    ]);
    const out = rederive(record, config, layer, ENGINE, DECLARATIONS);
    const reasons = [...new Set(out.unapplied.map((row) => row.reason))].sort();
    expect(reasons.length, 'the refusals are non-empty, or the closure below is vacuous')
      .toBeGreaterThan(0);
    expect(reasons.every((reason) => REDERIVE_UNAPPLIED_REASONS.includes(reason)),
      'every reported reason is a member of the module\'s own closed set').toBe(true);
    expect([...REDERIVE_UNAPPLIED_REASONS].sort(),
      'the closed set is exactly two, so a third member reds here').toEqual(['step_not_pinnable', 'unknown_key']);
    const keys = out.unapplied.map((row) => row.key);
    expect(keys, 'unapplied is ASCII-ascending and deduplicated on key')
      .toEqual([...new Set(keys)].sort());
    const applied = out.record.npcs.find((npc) => npc.id === victim.id);
    expect(applied.role, 'the two applicable overrides landed').toBe('Warden');
    expect(applied.status).toBe('retired');
    const ghost = out.record.npcs.map((npc) => npc.id);
    // anchored: the roster is asserted non-empty and equal in length to the record's on the line
    // below, so a vanished roster cannot make this absence true by accident.
    expect(ghost.includes('npc.this-entity-is-not-in-the-record'),
      'a casualty is reported, NEVER re-created').toBe(false);
    expect(ghost.length, 'the roster is live and unshrunk').toBe(record.npcs.length);
    expect(sha(record), 'the record is unmutated and the layer still holds every override').toBe(before);
    expect(Object.keys(layer.roots).length).toBe(6);
  });

  it('A5 — the same arguments give the same world, twice, across a stride of the corpus', () => {
    const rows = stride(75);
    const verdicts = [];
    for (const row of rows) {
      const { config, record } = worldFor(row);
      const layer = layerOf([[rootKey('npc', record.npcs[0].id, 'role'), 'Warden']]);
      const first = rederive(record, config, layer, ENGINE, DECLARATIONS);
      const second = rederive(record, config, layer, ENGINE, DECLARATIONS);
      verdicts.push(sha(first.record) === sha(second.record));
    }
    expect(verdicts.length, 'the stride is non-empty').toBeGreaterThan(0);
    expect(new Set(verdicts), 'same seed, same config, same layer, same world, every row')
      .toEqual(new Set([true]));
  }, 300_000);

  it('A6 — the layer survives the persist hop at arity three, and the minted id survives with it', () => {
    const { config, record } = worldFor(corpus[0]);
    const victim = record.npcs[0];
    expect(isEditableCard('npc'), 'the consult resolves the card, or the round trip is vacuous').toBe(true);
    const op = {
      kind: 'set-root', key: rootKey('npc', victim.id, 'role'), cardType: 'npc', field: 'role', value: 'Warden',
    };
    const built = applyEdit(EMPTY_DM_LAYER, op, { isEditableCard, declarationsFor });
    expect(built.ok, 'applyEdit takes the declaration consult as its THIRD argument').toBe(true);
    const hopped = JSON.parse(JSON.stringify(built.layer));
    expect(sha(hopped.roots), 'the overrides survive the JSON hop byte-exact').toBe(sha(built.layer.roots));
    const before = mintDmId(String(record._seed), 'minted', 1);
    const after = mintDmId(String(JSON.parse(JSON.stringify(record))._seed), 'minted', 1);
    expect(after, 'the same triple mints the same id across the hop').toBe(before);
    const fresh = generateSettlementPipeline(config, null, { seed: record._seed, customContent: {} });
    const out = rederive(fresh, config, hopped, ENGINE, DECLARATIONS);
    expect(out.record.npcs.find((npc) => npc.id === victim.id).role,
      'the hopped layer re-derives the same override').toBe('Warden');
  }, 300_000);

  it('A7 — THE ISOLATION PROPERTY: a dormant layer is the committed golden on EVERY corpus row, and a one-root layer moves that root', () => {
    expect(corpus.length, 'the corpus is live').toBeGreaterThan(500);
    expect(Object.keys(manifest).length, 'the committed golden is live').toBe(corpus.length);
    const dormantMisses = [];
    const recordsMoved = [];
    for (const row of corpus) {
      const { config, record } = worldFor(row);
      const before = sha(record);
      const dormant = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
      if (sha(dormant.record) !== manifest[keyOf(row)]) dormantMisses.push(keyOf(row));
      if (sha(record) !== before) recordsMoved.push(keyOf(row));
    }
    expect(dormantMisses, 'a dormant layer pins nothing, so its re-derivation IS the golden')
      .toEqual([]);
    expect(recordsMoved, 'the runner spreads the bag into its context AND hands the same object to '
      + 'every step, so an aliased bag writes through into the caller\'s own record; the bag is '
      + 'cloned immediately before the run and no row may move').toEqual([]);

    const moved = [];
    for (const row of stride(75)) {
      const { config, record } = worldFor(row);
      const victim = record.npcs[0];
      const a = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
      const b = rederive(record, config, layerOf([[rootKey('npc', victim.id, 'role'), '__EM_B2A4_A7B__']]),
        ENGINE, DECLARATIONS);
      const seat = b.record.npcs.find((npc) => npc.id === victim.id);
      const others = record.npcs.filter((npc) => npc.id !== victim.id);
      moved.push(seat.role === '__EM_B2A4_A7B__'
        && sha(a.record) !== sha(b.record)
        && others.every((npc) => {
          const same = b.record.npcs.find((candidate) => candidate.id === npc.id);
          return same !== undefined && same.name === npc.name && same.role === npc.role;
        }));
    }
    expect(moved.length, 'the anti-vacuity stride is non-empty').toBeGreaterThan(0);
    expect(new Set(moved), 'a one-root layer moves THAT root and leaves its siblings at the '
      + 'record\'s own values, or the layer was never consulted').toEqual(new Set([true]));
  }, 900_000);

  it('A8 — the closure probe, the layer boundary and the create boundary, each read from its producer', () => {
    const eager = new Set([...EAGER_FIRST_PAINT_MODULES].map((abs) => relative(ROOT, abs).split('\\').join('/')));
    // (4) ANTI-VACUITY FIRST: every claim below is green on nothing without these.
    expect(eager.size, 'the eager graph is non-empty').toBeGreaterThan(50);
    expect(eager.has('src/main.jsx'), 'the eager graph contains the entry').toBe(true);
    expect(Object.keys(PIPELINE_REACHERS).length, 'the reacher manifest is non-empty').toBeGreaterThan(0);

    // (1) MEMBERSHIP: not one module of this member is in the first-paint closure.
    const members = [LEAF, SEAT, SLICE].filter((rel) => eager.has(rel));
    expect(members, 'a member here is a first-paint rise, and that ceiling is the owner\'s').toEqual([]);

    // (2) THE LAYER BOUNDARY over this member's own domain territory.
    const editFiles = walk(join(ROOT, 'src', 'domain', 'edit'));
    expect(editFiles.length, 'the edit volume walk found files').toBeGreaterThan(0);
    const offenders = editFiles.filter((rel) => /(?:from\s*['"]|import\(\s*['"])[^'"]*\/generators\//
      .test(readFileSync(resolve(ROOT, rel), 'utf-8')));
    expect(offenders, 'no module under src/domain/edit names a generators specifier, static or '
      + 'dynamic: the engine is a parameter').toEqual([]);

    // (3) THE CREATE BOUNDARY, both halves, read from the producers.
    const leafCode = codeOnly(readFileSync(resolve(ROOT, LEAF), 'utf-8'));
    const seatCode = codeOnly(readFileSync(resolve(ROOT, SEAT), 'utf-8'));
    expect(/\bgenerateSettlementPipeline\b/.test(seatCode),
      'the seat IS the one file of this member that names the engine, or the probe below is vacuous').toBe(true);
    // anchored: the line above proves the same predicate finds the symbol in the seat, so this
    // absence measures the domain leaf rather than a scanner that stopped working.
    expect(/\bgenerateSettlementPipeline\b/.test(leafCode),
      'the domain leaf names the engine NOWHERE in code, which is what keeps it out of the '
      + 'reacher set').toBe(false);
    expect(Object.keys(PIPELINE_REACHERS).includes(SEAT), 'the seat is classified').toBe(true);
    expect(Object.keys(PIPELINE_REACHERS).includes(LEAF), 'the domain leaf is NOT a reacher').toBe(false);
    expect(PIPELINE_REACHERS[SEAT].class, 'and its class is the one the walker defines as '
      + 're-deriving an existing world').toBe('DERIVED');
    expect(BOUNDARY_CLASSES.includes(PIPELINE_REACHERS[SEAT].class),
      'the class is a member of the producer\'s own closed vocabulary').toBe(true);
    expect([...PIPELINE_REACHERS[SEAT].payloadAwaitedBy]).toEqual([SEAT]);
  });
});

/** The census corpus's own declared row count (EM-P2's 63): the floor every figure below rests on. */
const CENSUS_ROWS = 63;
/** The DM's power-card override, at EM-C4a's own root-key spelling. */
const SEAT_HOLDER = 'The Warden of the Probe';
/**
 * The ONE entity coordinate A7 spells. It is deliberately a constant: the bag `pinsFrom` builds is
 * decided by the declaration's COLLECTION and the record's own keys, and the entity id only picks
 * which row PASS 4 writes into. A7 asks what the RUNNER does with the bag, so a placeholder keeps
 * the arm free of per-card knowledge the declaration table already owns.
 */
const PROBE_ENTITY = 'the-probe-entity';

describe('EM-R1b — the power card stops being refused', () => {
  it('A6 — EM-R1b: a power-seat edit comes back APPLIED on every census row, with a bag of exactly the structure', () => {
    const rows = censusCorpus();
    expect(rows, 'the census corpus is live, or every count below is a count of nothing')
      .toHaveLength(CENSUS_ROWS);
    const layer = layerOf([[rootKey('powerSeat', 'seat', 'holder'), SEAT_HOLDER]]);
    // ANTI-VACUITY: the layer is NON-DORMANT. A dormant layer refuses nothing by construction and
    // would pass the emptiness below on air.
    expect(Object.keys(layer.roots), 'a dormant layer applies nothing and proves nothing here')
      .toHaveLength(1);
    expect(isEditableCard('powerSeat'), 'the consult resolves the card, or the edit never resolves')
      .toBe(true);

    const refused = [];
    const bags = [];
    for (const row of rows) {
      const { config, record } = worldFor(row);
      const { pins } = pinsFrom(record, layer, DECLARATIONS, ENGINE);
      bags.push(Object.keys(pins).sort().join(','));
      const out = rederive(record, config, layer, ENGINE, DECLARATIONS);
      if (out.unapplied.length > 0) {
        refused.push(`${keyOf(row)}: ${out.unapplied.map((entry) => entry.reason).join(',')}`);
      }
    }
    expect(refused, 'the DM\'s power-seat edit is still refused through the real rederive').toEqual([]);
    expect([...new Set(bags)], 'the bag pinsFrom builds for a power edit is exactly the structure')
      .toEqual(['powerStructure']);
    // The refusal the base gave is a member of the leaf's OWN closed set, read from the producer,
    // so the emptiness above cannot be green because the vocabulary moved underneath it.
    expect([...REDERIVE_UNAPPLIED_REASONS].sort(), 'the closed refusal set is exactly two: this '
      + 'member removes a CAUSE of step_not_pinnable and adds no reason')
      .toEqual(['step_not_pinnable', 'unknown_key']);
  }, 900_000);

  it('A7 — EM-R1b: every bag pinsFrom builds for a declared collection is one the runner accepts', () => {
    // THE COLLECTION SET IS READ FROM ITS PRODUCER, never re-typed: every editable card's own
    // declarations, each one an override this leaf must be able to turn into a bag.
    const cards = Object.keys(FIELD_DECLARATIONS).filter((cardType) => isEditableCard(cardType));
    const overrides = cards.flatMap((cardType) => declarationsFor(cardType)
      .filter((declaration) => typeof declaration.outputKey === 'string')
      .map((declaration) => [cardType, declaration.field]));
    expect(cards.length, 'the declaration table named no editable card').toBeGreaterThan(0);
    expect(overrides.length, 'no declared field carries an outputKey, so no bag can be built')
      .toBeGreaterThan(0);

    const rows = censusCorpus();
    const violations = [];
    const threw = [];
    const built = [];
    for (const row of rows) {
      const { record } = worldFor(row);
      // The bag is decided by the declaration's COLLECTION, so two fields of one collection build
      // the same bag: every override is still RESOLVED here, and the runner pass is taken once per
      // distinct bag rather than once per field.
      const driven = new Set();
      for (const [cardType, field] of overrides) {
        const layer = layerOf([[rootKey(cardType, PROBE_ENTITY, field), SEAT_HOLDER]]);
        const { pins } = pinsFrom(record, layer, DECLARATIONS, ENGINE);
        const signature = Object.keys(pins).sort().join(',');
        if (signature === '') continue;
        built.push(`${cardType}.${field}=${signature}`);
        if (driven.has(signature)) continue;
        driven.add(signature);
        try {
          runCensusRow(row, createPRNG(row._seed), {
            pins: structuredClone(pins),
            onStrictViolation: (violation) => {
              if (violation.kind === 'pin') violations.push(`${violation.step}[${violation.keys.join(',')}]`);
            },
          });
        } catch (error) {
          threw.push(`${keyOf(row)}|${cardType}.${field}: ${error.message}`);
        }
      }
    }
    // ANTI-VACUITY: at least one bag was non-empty and really went through the runner, and the
    // overrides reached MORE THAN ONE collection — so the two empty lists below are measurements
    // over both channels rather than an empty loop or a single surviving one.
    expect(built.length, 'every bag came back empty: nothing was ever driven through the runner')
      .toBeGreaterThan(0);
    expect([...new Set(built.map((entry) => entry.split('=')[1]))].length,
      'the declared overrides reached ONE collection: a channel this member cures is unpinnable')
      .toBeGreaterThan(1);
    expect(threw, 'a bag pinsFrom built made the runner throw').toEqual([]);
    expect([...new Set(violations)], 'the leaf built a bag the runner calls a PARTIAL PIN: the two '
      + 'channels have drifted apart, which is the whole failure this arm exists to catch')
      .toEqual([]);
  }, 900_000);

  it('A8 — EM-R1b, CURED BY EM-R1c: the institution card applies on 63 of 63 rows, its nested blocker gone and its value at the declared leaf', () => {
    const rows = censusCorpus();
    const reasons = [];
    const blockers = [];
    const landed = [];
    let measured = 0;
    for (const row of rows) {
      const { config, record } = worldFor(row);
      const institution = (record.institutions || [])[0];
      if (institution === undefined) continue;
      measured += 1;
      // THE RULED JOIN, not a bare `.id`: an institution's identity IS its name (design §22.4), and
      // 0 of 2,428 generated institutions carry an `id` at all — the root key this arm built before
      // EM-R1c's unit 2 therefore named an entity the leaf could never find.
      const layer = layerOf([[rootKey('institution', institution.name, 'state'), 'struggling']]);
      const out = rederive(record, config, layer, ENGINE, DECLARATIONS);
      for (const entry of out.unapplied) reasons.push(entry.reason);
      const missing = pinsFrom(record, layer, DECLARATIONS, ENGINE).missing
        .find((entry) => entry.step === 'assembleInstitutions');
      blockers.push((missing?.keys || []).join(','));
      // ⭐ THE VALUE AT ITS DECLARED LEAF, never `unapplied === []`: the quiet-lie class this
      // member's unit 2 exists to remove is an edit that REPORTS applied and reaches no entity.
      const hit = (out.record?.institutions || []).find((entry) => entry.name === institution.name);
      landed.push(hit?.state);
    }
    expect(measured, 'no corpus row carried an institution, so this arm measured nothing')
      .toBe(CENSUS_ROWS);
    expect(reasons.length, 'the institution card is refused again: the nested record path is no '
      + 'longer being read, or the ruled join no longer reaches the named entity').toBe(0);
    expect([...new Set(landed)], 'the DM\'s state did not reach the NAMED institution on every row')
      .toEqual(['struggling']);
    // THE BLOCKING KEY THAT REMAINS, AND WHY IT STILL BLOCKS NOTHING. `generationRepairs` HAS a
    // record path and that path is NESTED, so before EM-R1c the bag builder — which read a chooser
    // by its ctx-key NAME at the record's top level — could not hold it and the step was unpinnable.
    // Unit 1 reads it where the register says it lives, so `catalogForTier` is the only key the
    // record genuinely does not carry.
    expect([...new Set(blockers)], 'the institution step is blocked by a different key set than the '
      + 'one this cure was measured on').toEqual(['catalogForTier']);
    const repairsRows = GENERATION_TIER1
      .filter((entry) => entry.key === 'generationRepairs' && entry.via === 'provides')
      .map((entry) => entry.recordPath);
    expect(repairsRows.length, 'the register declares the formerly blocking key nowhere, so the path '
      + 'below is a claim about an empty list').toBeGreaterThan(0);
    expect([...new Set(repairsRows)], 'the formerly blocking key\'s record path moved: the cure is '
      + 'not the one that was measured').toEqual(['record.generationCoherenceReceipt.repairs']);
    expect([...REDERIVE_UNAPPLIED_REASONS], 'the closed refusal set is unmoved at two')
      .toEqual(['step_not_pinnable', 'unknown_key']);
  }, 900_000);
});

/** The DM's institution override, one per ROOT field of the card (`note` is an annotation). */
const INSTITUTION_EDITS = Object.freeze([
  Object.freeze({ field: 'state', value: 'struggling' }),
  Object.freeze({ field: 'category', value: 'probed-category' }),
  Object.freeze({ field: 'name', value: 'A Probed Institution Name' }),
]);

/** The DM's faction overrides, one per declared field of the card. */
const FACTION_EDITS = Object.freeze([
  Object.freeze({ field: 'faction', value: 'A Probed Faction' }),
  Object.freeze({ field: 'category', value: 'probed-category' }),
  Object.freeze({ field: 'power', value: 40 }),
]);

/** A literal `<collection>[].<field>` key anywhere in a bag: the quiet lie, in one predicate. */
const carriesStrayBracketKey = (pins) => JSON.stringify(pins).includes('[].');

describe('EM-R1c — a chooser is read at its declared record path, and the DM\'s value lands at the named entity', () => {
  it('A4 — EM-R1c: all THREE institution ROOT fields apply on every census row AND carry their value at the declared leaf', () => {
    const rows = censusCorpus();
    expect(rows, 'the census corpus is live, or every count below is a count of nothing')
      .toHaveLength(CENSUS_ROWS);
    const applied = new Map(INSTITUTION_EDITS.map((edit) => [edit.field, 0]));
    const carried = new Map(INSTITUTION_EDITS.map((edit) => [edit.field, 0]));
    const reasons = [];
    let measured = 0;
    for (const row of rows) {
      const { config, record } = worldFor(row);
      const institution = (record.institutions || [])[0];
      if (institution === undefined) continue;
      measured += 1;
      for (const edit of INSTITUTION_EDITS) {
        const layer = layerOf([[rootKey('institution', institution.name, edit.field), edit.value]]);
        const out = rederive(record, config, layer, ENGINE, DECLARATIONS);
        if (out.unapplied.length === 0) applied.set(edit.field, applied.get(edit.field) + 1);
        for (const entry of out.unapplied) reasons.push(`${edit.field}:${entry.reason}`);
        // `name` is the card's FREE-CASCADE field and therefore RENAMES the join field itself: the
        // root key names the OLD name and the write sets the new one, resolved in ONE hop. So the
        // entry is found by whichever name it should now carry.
        const wanted = edit.field === 'name' ? edit.value : institution.name;
        const hit = (out.record?.institutions || []).find((entry) => entry.name === wanted);
        if (hit?.[edit.field] === edit.value) carried.set(edit.field, carried.get(edit.field) + 1);
      }
    }
    expect(measured, 'no corpus row carried an institution, so every figure below is a figure of '
      + 'nothing').toBe(CENSUS_ROWS);
    expect([...applied].map(([field, count]) => `${field}:${count}`),
      'an institution ROOT field is still refused through the real rederive').toEqual([
      `state:${CENSUS_ROWS}`, `category:${CENSUS_ROWS}`, `name:${CENSUS_ROWS}`,
    ]);
    // ⭐ THE ARM THAT MATTERS: the VALUE at `record.institutions[<the named one>].<field>`, never
    // `unapplied === []`. An edit that reports applied and reaches no entity passes the line above
    // and fails this one — which is exactly the class judgment 233d named.
    expect([...carried].map(([field, count]) => `${field}:${count}`),
      'an institution ROOT field reports applied while its value reaches no entity').toEqual([
      `state:${CENSUS_ROWS}`, `category:${CENSUS_ROWS}`, `name:${CENSUS_ROWS}`,
    ]);
    expect(reasons, 'the institution card refused at least once').toEqual([]);
  }, 900_000);

  it('A5 — EM-R1c: a faction RENAME lands on the renamed entry, because the join field is the one being written', () => {
    const rows = censusCorpus();
    const edit = FACTION_EDITS[0];
    let measured = 0;
    let carried = 0;
    let stray = 0;
    for (const row of rows) {
      const { config, record } = worldFor(row);
      const faction = (record.powerStructure?.factions || [])[0];
      if (faction === undefined) continue;
      measured += 1;
      const layer = layerOf([[rootKey('faction', faction.faction, edit.field), edit.value]]);
      const { pins } = pinsFrom(record, layer, DECLARATIONS, ENGINE);
      if (carriesStrayBracketKey(pins)) stray += 1;
      const out = rederive(record, config, layer, ENGINE, DECLARATIONS);
      const hit = (out.record?.powerStructure?.factions || []).find((entry) => entry.faction === edit.value);
      if (hit?.faction === edit.value) carried += 1;
    }
    expect(measured, 'no corpus row carried a faction, so both figures below are figures of nothing')
      .toBe(CENSUS_ROWS);
    expect(carried, 'the DM\'s new faction name did not reach the renamed entry: the join field is '
      + 'the field being written, and the one hop that resolves it is gone').toBe(CENSUS_ROWS);
    expect(stray, 'the bag still carries a literal `[].` key: the write did not walk the declared '
      + 'record path').toBe(0);
  }, 900_000);

  it('A6 — EM-R1c: a faction CATEGORY edit lands on the named faction rather than on a literal key', () => {
    const rows = censusCorpus();
    const edit = FACTION_EDITS[1];
    let measured = 0;
    let carried = 0;
    let stray = 0;
    for (const row of rows) {
      const { config, record } = worldFor(row);
      const faction = (record.powerStructure?.factions || [])[0];
      if (faction === undefined) continue;
      measured += 1;
      const layer = layerOf([[rootKey('faction', faction.faction, edit.field), edit.value]]);
      const { pins } = pinsFrom(record, layer, DECLARATIONS, ENGINE);
      if (carriesStrayBracketKey(pins)) stray += 1;
      const out = rederive(record, config, layer, ENGINE, DECLARATIONS);
      const hit = (out.record?.powerStructure?.factions || []).find((entry) => entry.faction === faction.faction);
      if (hit?.category === edit.value) carried += 1;
    }
    expect(measured, 'no corpus row carried a faction, so both figures below are figures of nothing')
      .toBe(CENSUS_ROWS);
    expect(carried, 'the DM\'s category did not reach the named faction on every row').toBe(CENSUS_ROWS);
    expect(stray, 'the bag still carries a literal `[].` key').toBe(0);
  }, 900_000);

  it('A7 — EM-R1c: the faction SHARE lands at its declared leaf, and no literal bracket key survives anywhere in the bag', () => {
    const rows = censusCorpus();
    const edit = FACTION_EDITS[2];
    let measured = 0;
    let carried = 0;
    let stray = 0;
    let reported = 0;
    for (const row of rows) {
      const { config, record } = worldFor(row);
      const faction = (record.powerStructure?.factions || [])[0];
      if (faction === undefined) continue;
      measured += 1;
      const layer = layerOf([[rootKey('faction', faction.faction, edit.field), edit.value]]);
      const { pins } = pinsFrom(record, layer, DECLARATIONS, ENGINE);
      if (carriesStrayBracketKey(pins)) stray += 1;
      const out = rederive(record, config, layer, ENGINE, DECLARATIONS);
      if (out.unapplied.length === 0) reported += 1;
      const hit = (out.record?.powerStructure?.factions || []).find((entry) => entry.faction === faction.faction);
      if (hit?.power === edit.value) carried += 1;
    }
    expect(measured, 'no corpus row carried a faction, so every figure below is a figure of nothing')
      .toBe(CENSUS_ROWS);
    // ⭐ THE QUIET LIE, IN ONE PAIR OF LINES. Before this member the card REPORTED applied on every
    // row (the line below was already green) while the share reached no faction at all and a key
    // nothing reads sat in the bag. Reporting alone is not evidence; the value is.
    expect(reported, 'the faction card is refused through the real rederive').toBe(CENSUS_ROWS);
    expect(carried, 'the DM\'s share did not reach the named faction: the write landed somewhere '
      + 'nothing reads').toBe(CENSUS_ROWS);
    expect(stray, 'a literal `factions[].power` key survives in the bag, which is the whole defect '
      + 'this member removes').toBe(0);
  }, 900_000);

  it('A8 — EM-R1c: the npc and power-seat cards are UNMOVED, and a dormant layer still re-derives the record byte for byte', () => {
    const rows = censusCorpus();
    let measured = 0;
    let npcCarried = 0;
    let seatCarried = 0;
    let dormantIdentical = 0;
    const reasons = [];
    for (const row of rows) {
      const { config, record } = worldFor(row);
      const npc = (record.npcs || [])[0];
      if (npc === undefined) continue;
      measured += 1;

      const npcLayer = layerOf([[rootKey('npc', npc.id, 'status'), 'missing']]);
      const npcOut = rederive(record, config, npcLayer, ENGINE, DECLARATIONS);
      for (const entry of npcOut.unapplied) reasons.push(`npc:${entry.reason}`);
      const npcHit = (npcOut.record?.npcs || []).find((entry) => entry.id === npc.id);
      if (npcHit?.status === 'missing') npcCarried += 1;

      const seatLayer = layerOf([[rootKey('powerSeat', 'seat', 'holder'), SEAT_HOLDER]]);
      const seatOut = rederive(record, config, seatLayer, ENGINE, DECLARATIONS);
      for (const entry of seatOut.unapplied) reasons.push(`powerSeat:${entry.reason}`);
      if (seatOut.record?.powerStructure?.governingName === SEAT_HOLDER) seatCarried += 1;

      // THE DORMANCY CONTROL, and it is the goldens' protection BY CONSTRUCTION: this member
      // changes how a bag is READ and WRITTEN, and an empty layer builds no bag at all.
      const dormant = rederive(record, config, EMPTY_DM_LAYER, ENGINE, DECLARATIONS);
      if (sha(dormant.record) === sha(record)) dormantIdentical += 1;
    }
    expect(measured, 'no corpus row carried an npc, so every figure below is a figure of nothing')
      .toBe(CENSUS_ROWS);
    expect(npcCarried, 'the npc card MOVED: its value no longer reaches the entity `id` names')
      .toBe(CENSUS_ROWS);
    expect(seatCarried, 'the power-seat card MOVED: its plain-object leaf is no longer written')
      .toBe(CENSUS_ROWS);
    expect(reasons, 'a card this member leaves alone started being refused').toEqual([]);
    expect(dormantIdentical, 'a dormant layer stopped re-deriving the record byte for byte, which '
      + 'is the property every committed golden rests on').toBe(CENSUS_ROWS);
  }, 900_000);
});
