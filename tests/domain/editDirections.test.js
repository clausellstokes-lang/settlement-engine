/**
 * editDirections.test.js — EM-E5's acceptance battery (design §18 and §19 rulings 2, 4
 * and 6; the charter's wave-3 EM-E5 row; judgments 265 and 270).
 *
 * WHAT IS PROVEN HERE. That the direction surface is the world's own: the fifteen verbs
 * it offers ARE the realm manifest's proposal lane in both directions, each seal's
 * offered/grayed verdict is that verb's OWN predicate over the live world, the herald's
 * reason is the manifest's own sentence (or `realmVetoProse` over a code the verb itself
 * covers), and every ruled-in direction stages through EM-C1's `stage` and is refused by
 * EM-C1's own `resolveDecree` when its value is outside the list the source module owns.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY (the `cardEditorDialog`
 * idiom): set equalities, `toBe('')`, counts. So no `// anchored:` marker is owed
 * anywhere in this file, and no arm can quietly go vacuous by asserting the absence of
 * something that was never there.
 *
 * ⛔ THE VOCABULARIES ARE IMPORTED HERE TOO, FROM THEIR OWN MODULES, and compared against
 * the leaf's rows. That is the whole point of the binding arms: if the leaf ever retyped
 * a list, these equalities would still pass against the copy unless the comparison ran
 * against the SOURCE. It does.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  BELIEF_STRENGTH_BANDS, DIRECTION_OP_TYPES, DIRECTION_TYPES, INFORMATION_SOURCES,
  REALM_DIRECTION_FIELDS, REALM_DIRECTION_TYPE, REALM_DIRECTION_VERBS,
  levySuspension, offeredInformationFacts, realmRefusalProse, realmSealReason, realmSealsFor,
} from '../../src/domain/edit/directions.js';
import { RESOLUTION_MISSING_KINDS, resolveDecree, stage } from '../../src/domain/edit/registry.js';
import { WORLD_CONDITIONS } from '../../src/domain/edit/worldConditions.js';
import { REALM_MANIFEST, realmVetoProse } from '../../src/domain/events/realmManifest.js';
import { REGIONAL_CHANNEL_STATUSES } from '../../src/domain/region/graph.js';
import { advanceBeliefMaps, strengthBandOf } from '../../src/domain/worldPulse/beliefMap.js';
import { BROKERAGE_SERVICE_MENU_KEYS } from '../../src/domain/worldPulse/brokerageServices.js';
import { ENGAGEMENT_MOVES } from '../../src/domain/worldPulse/convergence.js';
import {
  CREDIBILITY_DELTA_KINDS, advanceCredibility, processLies, processSecrecy, processSight,
} from '../../src/domain/worldPulse/informationStatecraft.js';
import { RAMP } from '../../src/domain/worldPulse/mobilization.js';
import { TEMPO_TIERS } from '../../src/domain/worldPulse/narrativeTempo.js';
import { OCCUPATION_POSTURES } from '../../src/domain/worldPulse/occupation.js';
import { TAX_FORMS, TAX_RATE_BANDS, TREASURY_SUSPENSIONS } from '../../src/domain/worldPulse/treasury.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF_REL = 'src/domain/edit/directions.js';

/** The fourteen names design §19 ruling 2 and the charter's row both spell, plus the fifteenth:
 * GR-2b adds PROPOSE_PACT (J-EM-11; the chair's amendment of 2026-09-23), sorted. */
const CHARTERED_FIFTEEN = [
  'DECLARE_BLOCKADE', 'DECLARE_CASUS', 'DECLARE_TRADE_EMBARGO', 'FORCE_ABANDON',
  'FORCE_CALAMITY', 'FORCE_FOUND_STEADING', 'FORCE_RECONSIDERATION', 'FORCE_RESETTLE',
  'ORDER_CONVOY', 'ORDER_INTERVENTION', 'ORDER_SUPPLY_RAID', 'PROPOSE_PACT', 'REPUDIATE_TREATY',
  'SUE_FOR_PEACE', 'TRANSFER_SOVEREIGNTY',
].sort();

/** A two-settlement realm context, the shape every manifest `targetOptions` reads. */
const CTX = { settlements: [{ id: 'a', name: 'A', settlement: {} }, { id: 'b', name: 'B', settlement: {} }], tick: 3 };

/** A world with three waves lit and the rest dark, so both verdicts are witnessed at once. */
const HALF_LIT = {
  simulationRules: {
    warLayerEnabled: true,
    peaceEngineEnabled: true,
    supplyWebWarfareEnabled: true,
    settlementLifecycleEnabled: true,
  },
};

/** The vocabulary a direction row declares, by field name. */
const valuesOf = (type, field) => [...(DIRECTION_OP_TYPES[type].payload[field].values || [])];

/** Stage one op onto an empty registry with the caller's own id and stamp. */
const staged = (type, payload) => stage([], { type, target: { kind: 'settlement', id: 'a' }, payload }, {
  id: `d-${type}`, orderedAt: '2026-09-23T00:00:00.000Z',
});

/** Resolve one staged entry against THESE rows, as EM-C1's header says catalogues arrive. */
const resolved = (type, payload) => resolveDecree(staged(type, payload)[0], { opTypes: DIRECTION_OP_TYPES, pools: {} });

describe('EM-E5 — direction: the realm manifest surfaced on the cards (design §19 ruling 2)', () => {
  it('E5-1: the surfaced set EQUALS the manifest proposal lane, both directions, and it is the chartered fifteen', () => {
    const laneProposal = Object.values(REALM_MANIFEST).filter((v) => v.lane === 'proposal').map((v) => v.verb);
    expect([...REALM_DIRECTION_VERBS].sort(), 'every surfaced verb is a proposal-lane verb, and every proposal-lane verb is surfaced')
      .toEqual([...laneProposal].sort());
    expect([...REALM_DIRECTION_VERBS].sort(), 'and the set is exactly the fourteen the charter row and design §19 ruling 2 spell, and GR-2b\'s PROPOSE_PACT')
      .toEqual(CHARTERED_FIFTEEN);
    // GR-2b adds PROPOSE_PACT: fourteen became fifteen, and the manifest sixteen seventeen.
    expect(REALM_DIRECTION_VERBS.length, 'fifteen, measured rather than assumed').toBe(15);
    expect(Object.keys(REALM_MANIFEST).length, 'out of the manifest seventeen').toBe(17);
  });

  it('E5-2: the direct-realm row vocabulary IS that surfaced set, so a verb outside the manifest cannot be staged', () => {
    expect(valuesOf(REALM_DIRECTION_TYPE, 'verb'), 'the row declares the live lane, never a copy of it')
      .toEqual([...REALM_DIRECTION_VERBS]);
    expect([...REALM_DIRECTION_FIELDS], 'and the payload is the verb plus its dials, in codepoint order')
      .toEqual(['dials', 'verb']);
  });

  it('E5-3: every one of the seventeen renders as a seal, and its OWN predicate decides offered or grayed', () => {
    const seals = realmSealsFor(HALF_LIT, CTX);
    expect(seals.map((s) => s.verb), 'the seventeen, in the manifest own order')
      .toEqual(Object.values(REALM_MANIFEST).map((v) => v.verb));
    const byVerb = new Map(seals.map((s) => [s.verb, s]));
    const live = Object.values(REALM_MANIFEST)
      .filter((v) => v.predicate(HALF_LIT, CTX).available === true)
      .map((v) => v.verb);
    expect(seals.filter((s) => s.offered).map((s) => s.verb), 'offered is the predicate own verdict, verb for verb')
      .toEqual(live);
    expect(live.length > 0, 'and the lit half is non-empty, so the equality is not vacuous').toBe(true);
    expect(seals.filter((s) => s.offered === false).length > 0, 'as is the dark half').toBe(true);
    expect(byVerb.get('ORDER_SUPPLY_RAID').offered, 'a lit wave offers its verb').toBe(true);
    expect(byVerb.get('ORDER_CONVOY').offered, 'a dark wave does not').toBe(false);
  });

  it('E5-4: a grayed seal reason is the manifest OWN sentence, and an offered one has none', () => {
    const seals = realmSealsFor(HALF_LIT, CTX);
    const byVerb = new Map(seals.map((s) => [s.verb, s]));
    expect(realmSealReason(byVerb.get('ORDER_CONVOY')), 'the naval gate speaks its own refusal, verbatim')
      .toBe(REALM_MANIFEST.ORDER_CONVOY.predicate(HALF_LIT, CTX).reasons[0]);
    expect(realmSealReason(byVerb.get('FORCE_RESETTLE')), 'and a seal-level refusal speaks its own too')
      .toBe(REALM_MANIFEST.FORCE_RESETTLE.predicate(HALF_LIT, CTX).reasons[0]);
    expect(realmSealReason(byVerb.get('ORDER_SUPPLY_RAID')), 'an offered seal carries no reason at all').toBe('');
  });

  it('E5-5: REINFORCE and INTERCEPT are the deferred pair, grayed with the manifest own reason and its veto prose', () => {
    const seals = realmSealsFor(HALF_LIT, CTX);
    const deferred = seals.filter((s) => s.lane === 'deferred');
    expect(deferred.map((s) => s.verb), 'exactly the two whose spatial-column seam is not built')
      .toEqual(['REINFORCE', 'INTERCEPT']);
    expect(deferred.map((s) => s.offered), 'neither is ever offered, on any world').toEqual([false, false]);
    expect(deferred.map((s) => s.covers[0]), 'each covers its own deferral code')
      .toEqual(['reinforce_deferred', 'intercept_deferred']);
    expect(realmSealReason(deferred[0]), 'and the grayed line is the manifest own predicate sentence')
      .toBe(REALM_MANIFEST.REINFORCE.predicate(HALF_LIT, CTX).reasons[0]);
    expect(realmRefusalProse('REINFORCE', 'reinforce_deferred'), 'while the applier refusal is REALM_VETO_PROSE own')
      .toBe(realmVetoProse('reinforce_deferred', ''));
  });

  it('E5-6: the veto prose a card speaks is only for a code THAT verb covers', () => {
    expect(realmRefusalProse('DECLARE_BLOCKADE', 'blockade_no_navy'), 'a covered code is spoken in the herald voice')
      .toBe(realmVetoProse('blockade_no_navy', ''));
    expect(realmRefusalProse('REINFORCE', 'blockade_no_navy'), 'another verb code is not this card to explain').toBe('');
    expect(realmRefusalProse('NOT_A_VERB', 'blockade_no_navy'), 'and an unknown verb speaks nothing').toBe('');
    expect(realmRefusalProse('DECLARE_BLOCKADE', ''), 'as does an absent code').toBe('');
  });

  it('E5-7: the seal reader is total on a malformed world and on a malformed seal', () => {
    const seals = realmSealsFor(null, null);
    // GR-2b adds PROPOSE_PACT: sixteen seals became seventeen.
    expect(seals.length, 'seventeen seals on an absent world').toBe(17);
    expect(seals.filter((s) => s.offered).length, 'and not one of them is offered').toBe(0);
    expect(realmSealReason(null), 'a malformed seal has no reason').toBe('');
    expect(realmSealReason({ offered: true }), 'nor does an offered one').toBe('');
  });
});

describe('EM-E5 — the directions the survey ruled in, each bound to its own module', () => {
  it('E5-8: the roster is the twelve, authored in codepoint order', () => {
    expect(DIRECTION_TYPES, 'the direction catalogue, in codepoint order').toEqual([
      'correct-belief', 'direct-credibility', 'direct-force', 'direct-realm', 'mutate-belief',
      'offer-brokerage', 'set-belief-confidence', 'set-channel-status', 'set-levy', 'set-muster',
      'set-occupation-posture', 'set-tempo',
    ]);
    expect(Object.keys(DIRECTION_OP_TYPES), 'and the authored order is that order').toEqual(DIRECTION_TYPES);
  });

  it('E5-9: NOT ONE VOCABULARY IS RETYPED — every enum is its own module live list', () => {
    expect(valuesOf('direct-force', 'move'), 'the engagement moves are convergence own').toEqual([...ENGAGEMENT_MOVES]);
    expect(valuesOf('set-muster', 'posture'), 'the muster rungs are the mobilization ramp').toEqual([...RAMP]);
    expect(valuesOf('set-levy', 'form'), 'the levy forms are the treasury eight').toEqual([...TAX_FORMS]);
    expect(valuesOf('set-levy', 'band'), 'and its bands the treasury five').toEqual([...TAX_RATE_BANDS]);
    expect(valuesOf('set-occupation-posture', 'posture'), 'the occupier hand is occupation own three').toEqual([...OCCUPATION_POSTURES]);
    expect(valuesOf('set-tempo', 'tier'), 'the tempo tiers are narrativeTempo own four').toEqual([...TEMPO_TIERS]);
    expect(valuesOf('offer-brokerage', 'service'), 'the menu is the brokerage key list').toEqual([...BROKERAGE_SERVICE_MENU_KEYS]);
    expect(valuesOf('set-channel-status', 'status'), 'the statuses are the regional graph four').toEqual([...REGIONAL_CHANNEL_STATUSES]);
    expect(valuesOf('direct-credibility', 'kind'), 'the credibility kinds are the fold own four').toEqual([...CREDIBILITY_DELTA_KINDS]);
  });

  it('E5-9b: and the rows SPELL those symbols, so a byte-identical retype cannot pass E5-9', () => {
    const leaf = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    const imported = new Set([...leaf.matchAll(/^import\s+\{([^}]*)\}\s+from\s+'[^']+';$/gm)]
      .flatMap((m) => m[1].split(',').map((w) => w.trim()).filter(Boolean)));
    expect(imported.size, 'the import list really parsed, so the membership below is not vacuous').toBeGreaterThan(10);
    /** The two locally-derived lists, each built FROM an import at module load. */
    const derived = ['BELIEF_STRENGTH_BANDS', 'REALM_DIRECTION_VERBS'];
    const args = [...leaf.matchAll(/pick\(([^)]*)\)/g)].map((m) => m[1].trim());
    expect(args.length, 'eleven picks: one per vocabulary-bearing field, and the levy declares two').toBe(11);
    expect(args.filter((a) => a.startsWith('[')), 'not one of them is an inline list: a retype would show up here')
      .toEqual([]);
    const roots = args.map((a) => a.split('.')[0]);
    expect(roots.filter((r) => imported.has(r) || derived.includes(r)), 'every one names an imported symbol or a list derived from one')
      .toEqual(roots);
  });

  it('E5-10: every requires.world id is a LIVE row of the world-conditions roster', () => {
    const declared = [...new Set(Object.values(DIRECTION_OP_TYPES).flatMap((r) => [...r.requires.world]))].sort();
    const liveRows = Object.keys(WORLD_CONDITIONS).filter((id) => WORLD_CONDITIONS[id].source === 'live').sort();
    expect(declared, 'the conditions this catalogue names, corrected by design §19 ruling 6')
      .toEqual(['beliefExists', 'forceInField', 'openRoute', 'tradeWith']);
    expect(declared.filter((id) => liveRows.includes(id)), 'and every one of them is a LIVE row, none honestly absent')
      .toEqual(declared);
  });

  it('E5-11: each direction STAGES as a decree through EM-C1 stage, pending and in order', () => {
    const one = staged('set-tempo', { tier: TEMPO_TIERS[0] });
    expect(one.length, 'one entry').toBe(1);
    expect([one[0].status, one[0].addedBy, one[0].orderIndex], 'pending, the DM own, at the head of the list')
      .toEqual(['pending', 'dm', 0]);
    expect(one[0].op.type, 'carrying the direction type verbatim').toBe('set-tempo');
    const two = stage(one, { type: 'set-muster', target: { kind: 'settlement', id: 'a' }, payload: { posture: RAMP[0] } }, {
      id: 'd-2', orderedAt: '2026-09-23T00:00:01.000Z',
    });
    expect(two.map((e) => e.orderIndex), 'and a second direction takes the next index').toEqual([0, 1]);
  });

  it('E5-12: an out-of-vocabulary value is REFUSED by EM-C1 own resolution, and an in-vocabulary one is not', () => {
    const rows = ['direct-credibility', 'direct-force', 'direct-realm', 'mutate-belief', 'offer-brokerage',
      'set-channel-status', 'set-levy', 'set-muster', 'set-occupation-posture', 'set-tempo'];
    const field = { 'direct-credibility': 'kind', 'direct-force': 'move', 'direct-realm': 'verb',
      'mutate-belief': 'band', 'offer-brokerage': 'service', 'set-channel-status': 'status',
      'set-levy': 'form', 'set-muster': 'posture', 'set-occupation-posture': 'posture', 'set-tempo': 'tier' };
    const refusals = [];
    const accepts = [];
    for (const type of rows) {
      refusals.push(resolved(type, { [field[type]]: 'a-word-no-module-owns' }));
      accepts.push(resolved(type, { [field[type]]: valuesOf(type, field[type])[0] }));
    }
    expect(refusals.map((r) => r.ok), 'every row refuses a word its source module does not own')
      .toEqual(rows.map(() => false));
    expect([...new Set(refusals.map((r) => r.missing))], 'with EM-C1 OWN refusal word, never a minted one')
      .toEqual([RESOLUTION_MISSING_KINDS[4]]);
    expect([...new Set(refusals.map((r) => r.was))], 'naming the word that failed').toEqual(['a-word-no-module-owns']);
    expect(accepts.map((r) => r.ok), 'and the live first member of every list resolves')
      .toEqual(rows.map(() => true));
  });

  it('E5-13: the refusal word is EM-C1 own reserved member, so this member mints no vocabulary', () => {
    expect(RESOLUTION_MISSING_KINDS[4], 'the kind a stale catalogue value takes').toBe('pool-value');
    const leaf = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    const importsKinds = /^import\s[^;]*RESOLUTION_MISSING_KINDS[^;]*;$/m.test(leaf);
    expect(importsKinds, 'and the leaf never imports the kinds: EM-C1 own resolution speaks them').toBe(false);
  });
});

describe('EM-E5 — the levy, suspended by siege and by occupation (design §19 the survey condition)', () => {
  it('E5-14: the two suspension words are the treasury OWN, in its own precedence order', () => {
    expect([...TREASURY_SUSPENSIONS], 'siege outranks occupation, as the treasury ruled').toEqual(['siege', 'occupation']);
    expect(levySuspension({ type: 'siege' }), 'a siege blockade record suspends the levy').toBe('siege');
    expect(levySuspension({ type: 'occupation' }), 'so does an occupation one').toBe('occupation');
  });

  it('E5-15: an unblockaded town, an absent record and a foreign word all leave the levy free', () => {
    expect(levySuspension(null), 'no blockade record at all').toBe('');
    expect(levySuspension({}), 'a record with no type').toBe('');
    expect(levySuspension({ type: 'famine' }), 'a blockade the treasury does not price as a suspension').toBe('');
    expect(levySuspension('siege'), 'and a bare string is not the record the granary derived').toBe('');
  });
});

describe('EM-E5 — information: each fact from its declared source (design §19 rulings 4 and 6)', () => {
  it('E5-16: every declared source names a LIVE export of the module it claims', () => {
    const live = {
      advanceBeliefMaps, advanceCredibility, processLies, processSecrecy, processSight,
    };
    const symbols = Object.values(INFORMATION_SOURCES).map((s) => s.symbol);
    expect(symbols.sort(), 'the five facts, each at the writer that owns it')
      .toEqual(['advanceBeliefMaps', 'advanceCredibility', 'processLies', 'processSecrecy', 'processSight']);
    expect(symbols.map((s) => typeof live[s]), 'and every one of them resolves to a live function')
      .toEqual(symbols.map(() => 'function'));
    expect([...new Set(Object.values(INFORMATION_SOURCES).map((s) => s.condition))], 'under design §18 belief condition')
      .toEqual(['beliefExists']);
  });

  it('E5-17: sight is not a seal, and ruling 4 is the reason it says out loud', () => {
    expect(INFORMATION_SOURCES.sight.offered, 'the observation noise is never offered').toBe(false);
    expect(INFORMATION_SOURCES.sight.reason.includes('ruling 4'), 'and the row names the ruling that withholds it').toBe(true);
    expect(INFORMATION_SOURCES.secrecy.offered, 'a secrecy level has no banded words, so it is measurement owed').toBe(false);
    expect(INFORMATION_SOURCES.secrecy.reason.includes('Measurement is owed'), 'and says so rather than inventing them').toBe(true);
    expect(offeredInformationFacts(), 'three facts are offered, two are withheld with their reason')
      .toEqual(['belief', 'credibility', 'lies']);
  });

  it('E5-18: the three belief acts are declared, each under the belief condition', () => {
    const beliefOps = DIRECTION_TYPES.filter((t) => DIRECTION_OP_TYPES[t].requires.world.includes('beliefExists'));
    expect(beliefOps, 'the rumour card three, plus the credibility direction that rides the same ledger')
      .toEqual(['correct-belief', 'direct-credibility', 'mutate-belief', 'set-belief-confidence']);
    expect(DIRECTION_OP_TYPES['correct-belief'].conflictsWith, 'correcting and twisting one belief contradict')
      .toEqual(['mutate-belief']);
    expect(DIRECTION_OP_TYPES['mutate-belief'].conflictsWith, 'in both directions').toEqual(['correct-belief']);
  });

  it('E5-19: the belief bands are DERIVED from the writer own classifier, never retyped', () => {
    const fromWriter = [...new Set([0, 0.1, 0.25, 0.4, 0.5, 0.6, 0.75, 0.9, 1].map(strengthBandOf))].sort((a, b) => a - b);
    expect([...BELIEF_STRENGTH_BANDS], 'the distinct answers strengthBandOf gives across its clamped domain')
      .toEqual(fromWriter);
    expect(valuesOf('mutate-belief', 'band'), 'and the twist row offers exactly those bands as words')
      .toEqual(BELIEF_STRENGTH_BANDS.map(String));
  });

  it('E5-20: the credibility kinds are the fold OWN four, at value level', () => {
    expect([...CREDIBILITY_DELTA_KINDS], 'the closed union the fold tests word for word')
      .toEqual(['proven_true', 'deception', 'fracture', 'climb_down']);
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/informationStatecraft.js'), 'utf8');
    expect(CREDIBILITY_DELTA_KINDS.filter((kind) => source.includes(`d.kind === '${kind}'`)).length,
      'and each one is a word the fold really branches on, so the list cannot drift from the behaviour').toBe(4);
  });
});

describe('EM-E5 — the structural fence (design §19 ruling 2 one write path; judgment 270)', () => {
  it('E5-21: the leaf reaches no store, no application layer and no op producer', () => {
    const leaf = readFileSync(join(ROOT, LEAF_REL), 'utf8');
    const imports = [...leaf.matchAll(/^import\s[^;]*?from\s+'([^']+)';$/gm)].map((m) => m[1]).sort();
    expect(imports.filter((p) => p.includes('/store/') || p.includes('/application/')).length,
      'src/domain/edit imports nothing from the store or the application layer').toBe(0);
    expect(imports.filter((p) => p.endsWith('/operations.js') || p.endsWith('/dmLayer.js')).length,
      'and it is no second mutation path: it imports neither op producer').toBe(0);
    expect(imports.length, 'eleven imports, every one of them a vocabulary at its own source').toBe(11);
  });

  it('E5-22: the rows are NOT spliced into the composed op catalogue, which a landed arm pins at twenty-two', () => {
    const catalogue = readFileSync(join(ROOT, 'src/domain/edit/operations.js'), 'utf8');
    expect(catalogue.includes('directions.js'), 'operations.js spreads no direction leaf').toBe(false);
    expect(catalogue.includes('DIRECTION_OP_TYPES'), 'and names none of its rows').toBe(false);
    expect(DIRECTION_TYPES.length, 'the twelve stand as their own catalogue, handed to resolveDecree as an argument').toBe(12);
  });

  it('E5-23: the leaf lands DARK — no src module imports it, so the first-paint closure cannot move', () => {
    const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (
      e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]
    )).filter((f) => f.endsWith('.js') || f.endsWith('.jsx'));
    const sources = walk(join(ROOT, 'src'));
    expect(sources.length > 500, 'the scan really walked the estate, so the count below is not vacuous').toBe(true);
    const importers = sources
      .filter((f) => relative(join(ROOT, 'src'), f) !== relative(join(ROOT, 'src'), join(ROOT, LEAF_REL)))
      .filter((f) => /from\s+'[^']*edit\/directions\.js'/.test(readFileSync(f, 'utf8')))
      .map((f) => relative(ROOT, f));
    expect(importers, 'zero src importers, so the leaf is in no chunk and in no first-paint closure').toEqual([]);
    expect(DIRECTION_OP_TYPES[REALM_DIRECTION_TYPE].stage, 'and every direction acts at home').toBe('home');
    expect([...new Set(Object.values(DIRECTION_OP_TYPES).map((r) => r.consequence))], 'with a home consequence').toEqual(['home']);
  });

  it('E5-24: every row carries all eleven declaration fields, guard coverage STATED when empty', () => {
    const keys = ['target', 'payload', 'stage', 'consequence', 'requires', 'enables', 'relatedTo',
      'conflictsWith', 'duration', 'guards', 'guardsStated'].sort();
    const shapes = DIRECTION_TYPES.map((t) => Object.keys(DIRECTION_OP_TYPES[t]).sort());
    expect(shapes, 'ARCH §5 stated-when-empty, on every one of the twelve').toEqual(DIRECTION_TYPES.map(() => keys));
    expect(DIRECTION_TYPES.filter((t) => DIRECTION_OP_TYPES[t].guards.length === 0).length,
      'no rule is authored here: the rules are EM-C3 own, and the guards judge rather than refuse').toBe(12);
    expect(DIRECTION_TYPES.filter((t) => DIRECTION_OP_TYPES[t].guardsStated.length > 0).length,
      'and every empty coverage is written down where a reader can see it').toBe(12);
  });
});
