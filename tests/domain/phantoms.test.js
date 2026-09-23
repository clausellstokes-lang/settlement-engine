/**
 * phantoms.test.js — EM-F1's domain acceptance (wave 5; design §2.8 and §13,
 * ODQ §934.43, the chair's judgment 261).
 *
 * THE CLAIM. `mintPhantom` answers a MINIMAL record, deterministically, from a seed it
 * is handed and pools the estate already holds; the discriminant is read in exactly one
 * place; `consequenceFor` is the apply-time resolver EM-B1b's off-stage rows point at;
 * the registry's badge and that policy are ONE fact read twice; and an off-stage act
 * produces design §13's two things and never a world fact.
 *
 * ⛔ NOTHING HERE RE-TYPES A PRODUCER'S SET. The record's key list, the trait table, the
 * two policy words and the two badges are all IMPORTED from the leaf, and the pool ids
 * are joined to the LIVE pool table rather than to a second copy of it — which is also
 * the only way the trait rows can be proved live rather than merely spelled.
 *
 * ⭐ THE TOOLS ARE THE REAL PRODUCERS. Every determinism arm binds the estate's own DM-id
 * mint and its own pool roller, so "deterministic from its seed" is proved end to end
 * rather than against a stub. The leaf imports neither (its own importer roster is an arm
 * below), and a TEST import is not a bundle edge.
 *
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { commentsOnly } from '../helpers/codeOnlySource.js';
import { mintDmId } from '../../src/domain/edit/dmLayer.js';
import { POOLS, poolValues, rollFrom } from '../../src/domain/edit/pools.js';
import { OFF_STAGE_OP_TYPES } from '../../src/domain/edit/operationsOffStage.js';
import { makeOp } from '../../src/domain/edit/operations.js';
import {
  COUNTERPARTY_BADGES,
  PHANTOM_CONSEQUENCE_POLICIES,
  PHANTOM_KIND,
  PHANTOM_RECORD_KEYS,
  PHANTOM_TRAIT_POOLS,
  applyOffStage,
  badgeFor,
  consequenceFor,
  isPhantomRecord,
  isPhantomSave,
  mintPhantom,
} from '../../src/domain/edit/phantoms.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_REL = 'src/domain/edit/phantoms.js';

/** The estate's own two producers, bound as the injected tool bag. */
const TOOLS = Object.freeze({ mintId: mintDmId, roll: rollFrom });

/** The four off-stage ops the charter row names, in codepoint order. */
const NAMED_OFF_STAGE = Object.freeze(['declare-war', 'open-trade', 'resolve-outcome', 'send-force']);

/** A world state the resolver must leave alone, deeply frozen so a write would throw. */
const worldState = () => Object.freeze({
  wars: Object.freeze([]),
  relationshipStates: Object.freeze({ 'rel.a.b': Object.freeze({ relationshipType: 'neutral' }) }),
  factionPower: Object.freeze({ crown: 40, guild: 60 }),
});

/** A REAL counterparty: a saved settlement row whose blob is an ordinary settlement. */
const realSave = () => ({ id: 'save-ashford', name: 'Ashford', tier: 'town', settlement: { name: 'Ashford', tier: 'town' } });

/** Every `.js` / `.jsx` file under a directory, repo-relative. */
function walkSources(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkSources(full, out);
    else if (/\.jsx?$/.test(entry)) out.push(relative(ROOT, full).split('\\').join('/'));
  }
  return out;
}

/**
 * THE IMPORTER MATCHER, as a function the live arm and its own planted control both run.
 * It reads CODE, never prose: a JSDoc `@typedef {import('…')}` is a type-only reference
 * that no bundler emits an edge for, and the estate's shared comment strip is what makes
 * the two distinguishable. The same predicate the landed edit-volume rosters use.
 * @param {ReadonlyArray<readonly [string, string]>} entries repo-relative path and source
 * @returns {string[]} one message per importer, `<file> imports <leaf>`
 */
function importersOfLeaf(entries) {
  const importers = [];
  for (const [rel, source] of entries) {
    for (const match of commentsOnly(source).matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (!specifier.startsWith('.')) continue;
      const resolved = relative(ROOT, resolve(dirname(join(ROOT, rel)), specifier)).split('\\').join('/');
      if (resolved === LEAF_REL) importers.push(`${rel} imports ${resolved}`);
    }
  }
  return importers;
}

describe('EM-F1 — the phantom record, minted minimally and deterministically', () => {
  test('A1: the minted record carries EXACTLY the declared keys, frozen, and not one more', () => {
    const record = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    expect(record, 'the mint answered nothing, so every claim below would be vacuous').not.toBeNull();
    expect(Object.keys(/** @type {object} */ (record)).sort(),
      'the record is MINIMAL, asserted set-equal in BOTH directions against the leafs own key list:'
      + ' an extra key is a persisted shape nobody ruled, and a missing one is a hole in a shape'
      + ' that is already written').toEqual([...PHANTOM_RECORD_KEYS].sort());
    expect(record?.kind, 'the discriminant is the one word the shelf, the badge and the resolver all read')
      .toBe(PHANTOM_KIND);
    expect(record?.name, 'the name is the free field the found-phantom op carries, verbatim').toBe('Greymoor');
    expect(record?.seed, 'and the seed is carried so promotion can forge the same world from it').toBe('seed-ashford');
    expect(Object.isFrozen(record), 'the record is frozen').toBe(true);
    expect(Object.isFrozen(record?.traits), 'and so is its trait bag, or the freeze would be shallow theatre').toBe(true);
    expect(Object.keys(/** @type {object} */ (record?.traits)).sort(),
      'the trait bag holds exactly the declared traits').toEqual(Object.keys(PHANTOM_TRAIT_POOLS).sort());
  });

  test('A2: the same seed and index mint the same record forever, and a different seed or index a different one', () => {
    const first = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    const again = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    expect(JSON.stringify(again), 'byte-identical, so the id and all three rolls are reproducible without replay')
      .toBe(JSON.stringify(first));

    const nextIndex = mintPhantom('seed-ashford', 'Greymoor', 1, TOOLS);
    const otherSeed = mintPhantom('seed-redhollow', 'Greymoor', 0, TOOLS);
    expect(nextIndex?.id, 'a second phantom founded from the same settlement is a different phantom')
      .not.toBe(first?.id);
    expect(otherSeed?.id, 'and a different settlement mints a different phantom for the same name')
      .not.toBe(first?.id);
    expect(first?.id, 'the id is the DM layers own identity class, so no second hash is spelled in the leaf')
      .toBe(mintDmId('seed-ashford', PHANTOM_KIND, 0));
  });

  test('A3: every declared trait pool is a LIVE pool id and every rolled trait is a member of its own pool', () => {
    const declared = Object.entries(PHANTOM_TRAIT_POOLS);
    expect(declared.length, 'the trait table is non-empty, or the join below would be vacuous').toBeGreaterThan(0);
    const unknown = declared.filter(([, poolId]) => !Object.hasOwn(POOLS, poolId)).map(([trait]) => trait);
    expect(unknown, 'THE JOIN: every trait names a pool the live table holds, so a renamed pool reds here'
      + ' rather than rolling nothing at the door').toEqual([]);

    const record = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    expect(record, 'the mint answered, so the membership join below is not vacuous').not.toBeNull();
    const traits = /** @type {Record<string, string>} */ ({ ...record?.traits });
    const offenders = declared
      .filter(([trait, poolId]) => !poolValues(poolId, null).includes(traits[trait]))
      .map(([trait]) => trait);
    expect(offenders, 'and every rolled value is a MEMBER of its own live pool — the FINITE-SEMANTICS law:'
      + ' a typed bucket, never free text').toEqual([]);
  });

  test('A4: a malformed argument, an unusable tool bag or a producer that throws all answer null, never a partial record', () => {
    const throwingId = { mintId: () => { throw new TypeError('no'); }, roll: rollFrom };
    const emptyRoll = { mintId: mintDmId, roll: () => null };
    const refusals = [
      ['a non-string seed', mintPhantom(7, 'Greymoor', 0, TOOLS)],
      ['a blank name', mintPhantom('seed-ashford', '', 0, TOOLS)],
      ['a negative index', mintPhantom('seed-ashford', 'Greymoor', -1, TOOLS)],
      ['a fractional index', mintPhantom('seed-ashford', 'Greymoor', 0.5, TOOLS)],
      ['an absent tool bag', mintPhantom('seed-ashford', 'Greymoor', 0, null)],
      ['a tool bag missing the roller', mintPhantom('seed-ashford', 'Greymoor', 0, { mintId: mintDmId })],
      ['a minter that throws', mintPhantom('seed-ashford', 'Greymoor', 0, throwingId)],
      ['a pool that answers nothing', mintPhantom('seed-ashford', 'Greymoor', 0, emptyRoll)],
    ];
    expect(refusals.filter(([, answer]) => answer !== null).map(([why]) => why),
      'every refusal answers null and NOTHING answers a half-built record — a partial record is a'
      + ' persisted shape with a hole in it').toEqual([]);
    expect(mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS),
      'the CONTROL: the same call with real tools still mints, so the refusals above are not vacuous')
      .not.toBeNull();
  });

  test('A5: the discriminant is read in one place, over a record and over a save row alike', () => {
    const record = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    expect(isPhantomRecord(record), 'a minted record reads as a phantom').toBe(true);
    expect(isPhantomSave({ id: 'ph-1', name: 'Greymoor', settlement: record }),
      'and so does the save row whose BLOB is that record').toBe(true);

    const unreal = [
      ['a real save row', isPhantomSave(realSave())],
      ['an ordinary settlement blob', isPhantomRecord({ name: 'Ashford', tier: 'town' })],
      ['an absent value', isPhantomRecord(null)],
      ['an array', isPhantomRecord([PHANTOM_KIND])],
      ['a save row with no blob', isPhantomSave({ id: 'x', name: 'x' })],
      ['an INHERITED kind', isPhantomRecord(Object.create({ kind: PHANTOM_KIND }))],
    ];
    expect(unreal.filter(([, answer]) => answer !== false).map(([why]) => why),
      'and nothing else reads as one: own-property only, so a prototype member is not a discriminant')
      .toEqual([]);
  });
});

describe('EM-F1 — the phantom consequence rule, resolved at apply time', () => {
  test('A6: an unreal counterparty admits the record-only consequence and a saved settlement admits the world', () => {
    const record = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    const recordOnly = [
      ['the phantom record itself', consequenceFor(record)],
      ['the phantom save row', consequenceFor({ id: 'ph-1', name: 'Greymoor', settlement: record })],
      ['a bare entity reference', consequenceFor({ kind: PHANTOM_KIND, id: 'dm:phantom:0123456789abcdef' })],
      ['a reference the caller could not resolve', consequenceFor(null)],
      ['a row carrying no blob', consequenceFor({ id: 'save-x', name: 'x' })],
    ];
    expect(recordOnly.filter(([, policy]) => policy !== PHANTOM_CONSEQUENCE_POLICIES[0]).map(([why]) => why),
      'FAIL CLOSED means fail toward the phantom: only a PROVEN saved settlement admits world'
      + ' consequence, so an unresolved target can never reach world state').toEqual([]);
    expect(consequenceFor(realSave()),
      'and a real counterparty routes to the simulator — the CONTROL that keeps the arm above honest')
      .toBe(PHANTOM_CONSEQUENCE_POLICIES[1]);
  });

  test('A7: the badge and the policy are ONE fact read twice, in both directions', () => {
    const record = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    const targets = [record, { id: 'ph-1', settlement: record }, { kind: PHANTOM_KIND, id: 'dm:phantom:0' },
      null, undefined, [], realSave(), { id: 'save-y', settlement: { name: 'Y' } }];
    const disagreements = targets.filter((target) => (
      (badgeFor(target) === COUNTERPARTY_BADGES[1]) !== (consequenceFor(target) === PHANTOM_CONSEQUENCE_POLICIES[1])
    ));
    expect(disagreements, 'a row badged REAL can never resolve record-only and a row badged PHANTOM can'
      + ' never reach world state: one predicate, two names').toEqual([]);
    expect(new Set(targets.map(badgeFor)),
      'and BOTH badges really occur over this population, or the biconditional above is vacuous')
      .toEqual(new Set(COUNTERPARTY_BADGES));
  });

  test('A8: each off-stage op touches the home procedures and the record only — the world comes back by identity, byte-identical', () => {
    const record = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    const target = { id: 'ph-1', name: 'Greymoor', settlement: record };
    const world = worldState();
    const before = JSON.stringify(world);

    const answers = NAMED_OFF_STAGE.map((type) => {
      const op = makeOp(type, { kind: PHANTOM_KIND, id: String(record?.id) }, {
        counterparty: String(record?.id),
        ...(type === 'resolve-outcome' ? { outcome: 'lost' } : {}),
        ...(type === 'send-force' ? { strength: 3 } : {}),
      });
      expect(op, `the op catalogue built ${type}, so the arm below is not vacuous`).not.toBeNull();
      return [type, applyOffStage(op, target, world)];
    });

    expect(answers.filter(([, out]) => out.world !== world).map(([type]) => type),
      'THE RULE MADE STRUCTURAL: the world comes back BY IDENTITY from every off-stage op, so the'
      + ' editor cannot have read it, let alone written it').toEqual([]);
    expect(JSON.stringify(world), 'and the world state is byte-identical after all four acts').toBe(before);
    expect(answers.filter(([, out]) => out.worldFacts.length !== 0).map(([type]) => type),
      'design §13s "what it never produces": no war state, no treaty, no route, no envoy state and'
      + ' no derived power or legitimacy shift').toEqual([]);
    expect(answers.filter(([, out]) => out.policy !== PHANTOM_CONSEQUENCE_POLICIES[0]).map(([type]) => type),
      'every act against a phantom resolves to the home procedures and the record').toEqual([]);

    const real = applyOffStage(
      makeOp('declare-war', { kind: 'settlement', id: 'save-ashford' }, { counterparty: 'save-ashford' }),
      realSave(), world,
    );
    expect(real.policy, 'a REAL counterparty resolves to the world — the simulators path, not the editors')
      .toBe(PHANTOM_CONSEQUENCE_POLICIES[1]);
    expect(real.world, 'and even there the editor writes nothing: it only hands the decree on').toBe(world);
  });

  test('A9: the chronicle mark rides every off-stage act, naming the counterparty and carrying the outcome only when the op declares one', () => {
    const record = mintPhantom('seed-ashford', 'Greymoor', 0, TOOLS);
    const target = { id: 'ph-1', name: 'Greymoor', settlement: record };
    const marks = NAMED_OFF_STAGE.map((type) => applyOffStage(
      makeOp(type, { kind: PHANTOM_KIND, id: String(record?.id) }, {
        counterparty: String(record?.id),
        ...(type === 'resolve-outcome' ? { outcome: 'won' } : {}),
        ...(type === 'send-force' ? { strength: 2 } : {}),
      }), target, worldState(),
    ).record);

    expect(marks.filter((mark) => mark?.offStage !== true).length,
      'every off-stage act is MARKED off-stage; the heralds WORDS are EM-E2s pools and no prose is'
      + ' minted here').toBe(0);
    expect(marks.map((mark) => mark?.counterparty),
      'and each names the counterparty it absorbed, off the ops own payload')
      .toEqual(NAMED_OFF_STAGE.map(() => String(record?.id)));
    expect(marks.map((mark) => mark?.badge),
      'wearing the PHANTOM badge design §13 asks the registry to show')
      .toEqual(NAMED_OFF_STAGE.map(() => COUNTERPARTY_BADGES[0]));
    expect(marks.map((mark) => mark?.outcome),
      'the outcome is the DMs word where the op declares one and ABSENT elsewhere — the absence is'
      + ' the fact, not a default')
      .toEqual(NAMED_OFF_STAGE.map((type) => (type === 'resolve-outcome' ? 'won' : null)));

    const home = applyOffStage(makeOp('add-npc', { kind: 'npc', id: 'n-1' }, { name: 'Mara', role: 'Reeve' }),
      target, worldState());
    expect(home.policy, 'an op whose declared consequence is not by-target-reality is not this resolvers,'
      + ' and it answers no policy rather than guessing one').toBeNull();
    expect(home.record, 'and mints no chronicle mark at all').toBeNull();
  });

  test('A10: every off-stage row in the catalogue is one this resolver answers for, and the four the charter names are among them', () => {
    const declared = Object.keys(OFF_STAGE_OP_TYPES);
    expect(declared.length, 'the off-stage catalogue loaded rows at all').toBeGreaterThan(0);
    const unanswered = declared.filter((type) => OFF_STAGE_OP_TYPES[type].consequence !== 'by-target-reality');
    expect(unanswered, 'EM-B1bs rows all carry the by-target-reality flag this leaf resolves, so no'
      + ' off-stage act is left without a consequence at apply time').toEqual([]);
    expect(NAMED_OFF_STAGE.filter((type) => !declared.includes(type)),
      'and the four the charter row names are rows of that same catalogue, not words this test invented')
      .toEqual([]);
  });
});

describe('EM-F1 — the leaf imports nothing, draws nothing, and the shelf is its one reader', () => {
  test('A11: the runtime import list is EMPTY, no clock is read and no draw is taken', () => {
    const source = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    const specifiers = [...commentsOnly(source).matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)]
      .map((hit) => hit[1]);
    expect(specifiers, 'THE IMPORT LIST IS EXACTLY EMPTY. The id mint and the pool roller are INJECTED,'
      + ' because both of their leaves carry an EXACT importer roster a landed arm pins in both'
      + ' directions — a runtime edge from here would red an arm this packet does not own — and'
      + ' because the LIBRARY SHELF imports this leaf for one predicate and must not gain a pool'
      + ' catalogue with it').toEqual([]);
    const forbidden = ['Math.random', 'Date.now', 'createPRNG', 'toLocale', 'src/store', 'src/components'];
    expect(forbidden.filter((needle) => source.includes(needle)),
      'and the leaf reads no clock, takes no draw, resolves no locale and names neither the store nor'
      + ' a component').toEqual([]);
    expect(source.includes('PHANTOM_KIND'),
      'the CONTROL for the two scans above: the source really was read').toBe(true);
  });

  test('A12: the leafs importer roster under src is EXACT, in both directions — the library shelf and nothing else', () => {
    const scanned = walkSources(join(ROOT, 'src')).filter((rel) => rel !== LEAF_REL);
    expect(scanned.length, 'the src walk found nothing, so the roster below would be vacuous').toBeGreaterThan(400);
    const importers = importersOfLeaf(scanned.map((rel) => [rel, readFileSync(join(ROOT, rel), 'utf8')]));
    const EXPECTED_IMPORTERS = [
      // ⭐ The library toolbars pure filter pipeline, and it is LAZY: the shelf is not in the
      // eager first-paint module graph, so this edge costs the first paint nothing. The leaf
      // itself imports nothing at all, so the shelf gains one zero-dependency module and no
      // transitive closure with it.
      'src/components/library/LibraryToolbar.jsx imports src/domain/edit/phantoms.js',
    ];
    expect([...importers].sort(),
      'the importer roster is EXACT in both directions. An UNLISTED importer is a bundle edge nobody'
      + ' priced; a MISSING listed one means the shelfs own hiding is gone and the roster has aged'
      + ' instead of convicting').toEqual([...EXPECTED_IMPORTERS].sort());

    // GUARD-THE-GUARD, through the SAME predicate: a runtime import must still convict, and a
    // JSDoc type reference must not. Both probes are SYNTHETIC source strings — no file is
    // written under src — so the pair travels with the arm it defends.
    const plantedAt = 'src/components/edit/PlantedPhantom.jsx';
    expect(importersOfLeaf([[plantedAt, "import { isPhantomSave } from '../../domain/edit/phantoms.js';\n"]]),
      'a RUNTIME import of the leaf must convict, naming the file and the leaf')
      .toEqual([`${plantedAt} imports ${LEAF_REL}`]);
    expect(importersOfLeaf([[plantedAt, "/** @typedef {import('../../domain/edit/phantoms.js').PhantomRecord} P */\n"]]),
      'and a JSDoc typedef names a TYPE, enters no bundle closure and is not an importer').toEqual([]);
  });
});
