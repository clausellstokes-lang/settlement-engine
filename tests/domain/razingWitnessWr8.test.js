/**
 * razingWitnessWr8.test.js — WR-8 amendment R: THE WORLD JUDGES ON THE
 * OBSERVER'S AXIS, pinned.
 *
 * The amendment's sentence is "one event, read through every observer's
 * character", and the failure it names is a world that reacts to a razing with
 * ONE verdict. So the load-bearing pin here is not that a hit lands — it is that
 * TWO courts of different natures, hearing about the SAME burning, come out of
 * it holding measurably DIFFERENT relationships with the razer. That pin runs
 * the real emission and reads the real `relationshipStates` patch; a pin over
 * the band table alone would stay green through a wiring that judged everyone
 * benevolent.
 *
 * THREE OTHER CLASSES ARE PINNED HERE BECAUSE EACH ONE HAS A SILENT FAILURE:
 *   - THE SINGLE WRITER. The estate has exactly one sanctioned relationship
 *     writer, and a razing that grew a second one would still pass every
 *     behavioural pin above. The scan reads the STRIPPED source, so the module's
 *     own prose about not writing cannot satisfy it.
 *   - THE GHOST MATERIALIZATION. `applyRelationshipPatch` rebuilds its baseline
 *     from an EMPTY edge, so writing to an edge whose state record does not yet
 *     exist re-types it `neutral` unless the caller carries the truth across.
 *     The negative control drives exactly that case and asserts the authored
 *     type survives.
 *   - THE BAND TOTALITY. The alignment vocabulary is closed and the judgment
 *     table must be total over it in BOTH directions — a nature with no verdict,
 *     or a verdict with no nature, is a silent hole.
 *
 * @enforced-by this file
 */
import { readFileSync } from 'node:fs';

import { describe, expect, test } from 'vitest';

import {
  JUDGMENT_BAND_OF_NATURE,
  RAZING_JUDGMENT_BANDS,
  RAZING_WITNESS_TUNING,
  razingJudgmentBandFor,
  razingWitnessHits,
  razingWitnessTrustAdd,
} from '../../src/domain/worldPulse/razingWitness.js';
import {
  razingSiegeEmission,
  razingWitnessPatch,
  EMPTY_PATCH,
} from '../../src/domain/worldPulse/razingExecution.js';
import { applyRelationshipPatch } from '../../src/domain/worldPulse/relationshipEvolution.js';
import { RAZING_ALIGNMENT_BANDS } from '../../src/domain/worldPulse/razing.js';
import { ownNatureBandFor, CONQUEST_REQUIRED_RULES } from '../../src/domain/worldPulse/conquestDoctrineStage.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const SOURCE = (rel) => readFileSync(new URL(`../../${rel}`, import.meta.url), 'utf8');
/** Source with comments stripped — a scan must read what the code DOES. */
const CODE = (rel) => SOURCE(rel).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

const WITNESS_SOURCE = 'src/domain/worldPulse/razingWitness.js';
const EXECUTION_SOURCE = 'src/domain/worldPulse/razingExecution.js';

/** Every prerequisite flag true — WR-8 lights LAST, behind all seven. */
const LIT_RULES = Object.fromEntries(CONQUEST_REQUIRED_RULES.map((key) => [key, true]));

/**
 * A settlement record whose derived nature comes from the two inputs the
 * alignment kernel actually weighs hardest: the AUTHORED conscience of who runs
 * the place (W_MAL_CONSCIENCE 0.45) and the patron deity (W_MAL_DEITY 0.35). A
 * patron alone tops out at malice 0.6682 — just under the `malicious` floor of
 * 0.67 — so a fixture built on the deity alone reads `balanced` for everybody
 * and every band pin it carries goes vacuous. Both levers are set here on
 * purpose, and the resulting bands are asserted before they are relied on.
 */
function court(id, { patron, trait, population = 6000 }) {
  return [id, {
    id,
    settlement: {
      name: id,
      tier: 'town',
      population,
      npcs: [{ name: `${id} Elder`, importance: 'pillar', personality: { dominant: trait } }],
      config: {
        primaryDeitySnapshot: {
          name: patron === 'evil' ? 'The Iron Maw' : patron === 'good' ? 'The Open Hand' : 'The Grey Scale',
          alignmentAxis: patron,
        },
      },
    },
  }];
}

/** The two natures the fixture uses, as {patron, trait} pairs. */
const NATURE = Object.freeze({
  good: { patron: 'good', trait: 'incorruptible' },
  evil: { patron: 'evil', trait: 'cruel' },
});

/**
 * ⚠️ THE WITNESS WORLD. Karrow (evil patron) is about to burn Thornwall. Two
 * OTHER courts border Karrow and both were close to Thornwall:
 *   - Mereth, good patron  — expected `benevolent` ⇒ monumental;
 *   - Vaskar, evil patron  — expected `malicious`  ⇒ recognition.
 * Their expected bands are ASSERTED in the pin rather than assumed, so a change
 * in how alignment is derived reds the premise instead of quietly emptying it.
 *
 * @param {{ mereth?: string, vaskar?: string, materializeObserverStates?: boolean }} [over]
 */
function witnessWorld(over = {}) {
  const merethPatron = over.mereth ?? 'good';
  const vaskarPatron = over.vaskar ?? 'evil';
  const observerStates = over.materializeObserverStates === false ? {} : {
    // The observers' edges to KARROW — what the judgment writes onto.
    'rel.Karrow.Mereth': { relationshipType: 'allied', trust: 0.7, resentment: 0.05, fear: 0.1 },
    'rel.Karrow.Vaskar': { relationshipType: 'neutral', trust: 0.4, resentment: 0.1, fear: 0.15 },
  };
  const worldState = {
    simulationRules: { ...LIT_RULES },
    tick: 40,
    relationshipStates: {
      'rel.Karrow.Thornwall': { relationshipType: 'hostile', resentment: 0.9, trust: 0.05, fear: 0.4 },
      // The observers' adequacy TO THE VICTIM — the grief half of the moral hit.
      'rel.Mereth.Thornwall': { relationshipType: 'allied', trust: 0.9, resentment: 0.02, fear: 0.05 },
      'rel.Thornwall.Vaskar': { relationshipType: 'allied', trust: 0.9, resentment: 0.02, fear: 0.05 },
      ...observerStates,
    },
    spatialLedgers: {
      warReasons: {
        'Karrow>Thornwall': {
          reasons: {
            grievance: { type: 'grievance', score: 0.9, tick: 40, receipt: 'blood is owed' },
          },
        },
      },
    },
  };
  const byId = new Map([
    court('Karrow', { ...NATURE.evil, population: 45000 }),
    court('Thornwall', { ...NATURE.good, population: 1200 }),
    court('Mereth', NATURE[merethPatron]),
    court('Vaskar', NATURE[vaskarPatron]),
  ]);
  const snapshot = {
    settlements: [...byId.values()],
    byId,
    worldState,
    regionalGraph: {
      edges: [
        { id: 'rel.Karrow.Thornwall', from: 'Karrow', to: 'Thornwall', relationshipType: 'hostile', type: 'hostile' },
        { id: 'rel.Karrow.Mereth', from: 'Karrow', to: 'Mereth', relationshipType: 'allied', type: 'allied' },
        { id: 'rel.Karrow.Vaskar', from: 'Karrow', to: 'Vaskar', relationshipType: 'neutral', type: 'neutral' },
        { id: 'rel.Mereth.Thornwall', from: 'Mereth', to: 'Thornwall', relationshipType: 'allied', type: 'allied' },
        { id: 'rel.Thornwall.Vaskar', from: 'Thornwall', to: 'Vaskar', relationshipType: 'allied', type: 'allied' },
      ],
    },
  };
  return { worldState, snapshot };
}

/** Drive the mouth's one call on the witness world. */
function burnThornwall(over = {}) {
  const { worldState, snapshot } = witnessWorld(over);
  const razed = razingSiegeEmission({
    worldState,
    snapshot,
    razerId: 'Karrow',
    victimId: 'Thornwall',
    razerName: 'Karrow',
    victimName: 'Thornwall',
    tick: 40,
    population: 1200,
    namedCastCount: 3,
    institutions: [{ id: 'shrine', name: 'Shrine of the Open Hand' }],
    movableWealth: 40,
    now: '2026-08-04T00:00:00.000Z',
  });
  return { razed, worldState, snapshot };
}

describe('the band table is total over the closed alignment vocabulary, both directions', () => {
  test('every alignment band has a filed verdict, and only `unknown` has none', () => {
    expect(RAZING_ALIGNMENT_BANDS.length).toBeGreaterThan(0);
    for (const nature of RAZING_ALIGNMENT_BANDS) {
      expect(Object.prototype.hasOwnProperty.call(JUDGMENT_BAND_OF_NATURE, nature)).toBe(true);
      const verdict = razingJudgmentBandFor(nature);
      if (nature === 'unknown') expect(verdict).toBeNull();
      else expect(RAZING_JUDGMENT_BANDS).toContain(verdict);
    }
    // …and no verdict is orphaned: every judgment band is reachable from some nature.
    const reached = new Set(RAZING_ALIGNMENT_BANDS.map(razingJudgmentBandFor).filter(Boolean));
    expect([...reached].sort()).toEqual([...RAZING_JUDGMENT_BANDS].sort());
  });

  test('NEGATIVE CONTROL — an unfiled word gets NO verdict rather than the neutral one', () => {
    for (const word of ['', 'lawful', 'chaotic', 'wicked', null, undefined, 7]) {
      expect(razingJudgmentBandFor(/** @type {never} */ (word))).toBeNull();
    }
  });

  test('an `unknown` observer produces no hit row at all — silence is not a verdict', () => {
    const hits = razingWitnessHits({
      observers: [{ observerId: 'Nowhere', alignmentBand: 'unknown', adequacyToVictim01: 1 }],
      road: 'initiation',
      severity01: 1,
    });
    expect(hits).toEqual([]);
  });
});

describe('the three bands are ordered, and recognition is neither outrage nor a no-op', () => {
  const rows = (band) => razingWitnessHits({
    observers: [{ observerId: 'X', alignmentBand: band, adequacyToVictim01: 1 }],
    road: 'initiation',
    severity01: 1,
  })[0];

  test('monumental is strictly harsher than lesser on all three axes', () => {
    const monumental = rows('benevolent');
    const lesser = rows('balanced');
    expect(monumental.band).toBe('monumental');
    expect(lesser.band).toBe('lesser');
    expect(monumental.resentmentAdd01).toBeGreaterThan(lesser.resentmentAdd01);
    expect(monumental.trustFactor).toBeLessThan(lesser.trustFactor);
    expect(monumental.fearAdd01).toBeGreaterThan(lesser.fearAdd01);
    // Both are REAL: a lesser verdict that rounded to nothing would be a
    // "lesser-but-real" band that is not real.
    expect(lesser.resentmentAdd01).toBeGreaterThan(0);
    expect(lesser.trustFactor).toBeLessThan(1);
  });

  test('recognition adds NO resentment, RAISES trust, and fears hardest of the three', () => {
    const recognition = rows('malicious');
    expect(recognition.band).toBe('recognition');
    expect(recognition.resentmentAdd01).toBe(0);
    expect(recognition.trustFactor).toBe(1);
    expect(razingWitnessTrustAdd(recognition)).toBeGreaterThan(0);
    expect(recognition.fearAdd01).toBeGreaterThan(rows('benevolent').fearAdd01);
    // …and the trust ADD is exclusive to recognition.
    expect(razingWitnessTrustAdd(rows('benevolent'))).toBe(0);
    expect(razingWitnessTrustAdd(rows('balanced'))).toBe(0);
  });
});

describe('R2 — the just razing is sanctioned, NOT free (both bounds, because either alone permits a forbidden reading)', () => {
  const hit = (road) => razingWitnessHits({
    observers: [{ observerId: 'X', alignmentBand: 'benevolent', adequacyToVictim01: 1 }],
    road,
    severity01: 1,
  })[0];

  test('a vengeance razing costs strictly less than an initiation razing', () => {
    expect(hit('vengeance').resentmentAdd01).toBeLessThan(hit('initiation').resentmentAdd01);
    expect(hit('vengeance').trustFactor).toBeGreaterThan(hit('initiation').trustFactor);
  });

  test('and strictly more than nothing — burning a city is still burning a city', () => {
    expect(hit('vengeance').resentmentAdd01).toBeGreaterThan(0);
    expect(hit('vengeance').trustFactor).toBeLessThan(1);
    expect(RAZING_WITNESS_TUNING.JUST_BAND).toBeGreaterThan(0);
    expect(RAZING_WITNESS_TUNING.JUST_BAND).toBeLessThan(1);
  });
});

describe('⭐ THE HEADLINE PIN — one razing, two observers of different alignments, two different verdicts', () => {
  test('the fixture\'s premise holds: Mereth reads benevolent and Vaskar reads malicious', () => {
    const { worldState, snapshot } = witnessWorld();
    expect(ownNatureBandFor(snapshot.byId.get('Mereth'), worldState)).toBe('benevolent');
    expect(ownNatureBandFor(snapshot.byId.get('Vaskar'), worldState)).toBe('malicious');
  });

  test('the same burning leaves the two courts holding measurably different relationships with the razer', () => {
    const { razed, worldState } = burnThornwall();
    expect(razed).not.toBeNull();
    expect(razed.worldStatePatch).not.toBe(EMPTY_PATCH);
    const states = razed.worldStatePatch.relationshipStates;
    expect(states).toBeTruthy();

    const before = worldState.relationshipStates;
    const mereth = states['rel.Karrow.Mereth'];
    const vaskar = states['rel.Karrow.Vaskar'];
    expect(mereth).toBeTruthy();
    expect(vaskar).toBeTruthy();

    // THE GOOD COURT: outrage. Resentment up, trust down hard.
    expect(mereth.resentment).toBeGreaterThan(before['rel.Karrow.Mereth'].resentment);
    expect(mereth.trust).toBeLessThan(before['rel.Karrow.Mereth'].trust);

    // THE EVIL COURT: no outrage at all, and trust does NOT fall.
    expect(vaskar.resentment).toBe(before['rel.Karrow.Vaskar'].resentment);
    expect(vaskar.trust).toBeGreaterThan(before['rel.Karrow.Vaskar'].trust);

    // THE VERDICTS DIFFER IN DIRECTION, not merely in size — which is the whole
    // claim. Trust moved DOWN for one court and UP for the other off one event.
    expect(Math.sign(mereth.trust - before['rel.Karrow.Mereth'].trust))
      .not.toBe(Math.sign(vaskar.trust - before['rel.Karrow.Vaskar'].trust));

    // Both courts fear the razer more than they did.
    expect(mereth.fear).toBeGreaterThan(before['rel.Karrow.Mereth'].fear);
    expect(vaskar.fear).toBeGreaterThan(before['rel.Karrow.Vaskar'].fear);
  });

  test('each judgment lands as a TYPED incident on the estate\'s own ring, naming the burning', () => {
    const { razed } = burnThornwall();
    const states = razed.worldStatePatch.relationshipStates;
    for (const key of ['rel.Karrow.Mereth', 'rel.Karrow.Vaskar']) {
      const incidents = states[key].recentIncidents;
      const witnessed = incidents.filter((row) => row.type === 'razing_witnessed');
      expect(witnessed).toHaveLength(1);
      expect(String(witnessed[0].outcomeId)).toContain(razed.outcome.id);
      expect(witnessed[0].tick).toBe(40);
    }
  });

  test('NEGATIVE CONTROL — two courts of the SAME nature return the SAME verdict shape', () => {
    const { razed } = burnThornwall({ vaskar: 'good' });
    const states = razed.worldStatePatch.relationshipStates;
    // Both benevolent now: both must lose trust. (The magnitudes may differ —
    // their prior standings and their adequacy to the victim differ — so the
    // claim under test is the DIRECTION, which is what the band decides.)
    expect(states['rel.Karrow.Mereth'].trust)
      .toBeLessThan(witnessWorld().worldState.relationshipStates['rel.Karrow.Mereth'].trust);
    expect(states['rel.Karrow.Vaskar'].trust)
      .toBeLessThan(witnessWorld().worldState.relationshipStates['rel.Karrow.Vaskar'].trust);
  });

  test('the license mint and the judgment ride ONE patch and touch DISJOINT keys', () => {
    const { razed } = burnThornwall();
    const keys = Object.keys(razed.worldStatePatch).sort();
    // The judgment always writes relationshipStates; the mint writes
    // spatialLedgers only when a license was actually minted. Neither key may
    // ever be absent when its writer ran, and no third key may appear.
    expect(keys).toContain('relationshipStates');
    for (const key of keys) expect(['relationshipStates', 'spatialLedgers']).toContain(key);
    expect(Object.isFrozen(razed.worldStatePatch)).toBe(true);
  });
});

describe('⚠️⚠️ TWO TOWNS ON ONE TICK — the judgment obeys the licenseState split', () => {
  /**
   * WZ-3 proved the MINT's accumulator seam and recorded that the mouth's own
   * threading had only a STRUCTURAL pin. The judgment inherits the identical
   * hazard for a different key: two sieges resolving on one tick call the
   * emission twice, each derives its patch from the state it was HANDED, and
   * without the fold the second razing's `relationshipStates` REPLACES the
   * first's — one town's mourners silently un-judging its burning.
   *
   * This drives the leaf seam directly, threading the accumulator exactly the
   * way `evaluateWarLayer` threads it. A mutant collapsing `licenseState ||
   * worldState` to `worldState` survives every single-razing pin in this file
   * and dies here.
   */
  function twoVictimWorld() {
    const { worldState, snapshot } = witnessWorld();
    // A SECOND victim Karrow also hates, and Mereth also loved.
    worldState.relationshipStates['rel.Karrow.Duskmere'] = { relationshipType: 'hostile', resentment: 0.9, trust: 0.05, fear: 0.4 };
    worldState.relationshipStates['rel.Mereth.Duskmere'] = { relationshipType: 'allied', trust: 0.9, resentment: 0.02, fear: 0.05 };
    worldState.spatialLedgers.warReasons['Karrow>Duskmere'] = {
      reasons: { grievance: { type: 'grievance', score: 0.9, tick: 40, receipt: 'blood is owed here too' } },
    };
    snapshot.byId.set('Duskmere', court('Duskmere', NATURE.good)[1]);
    snapshot.settlements = [...snapshot.byId.values()];
    snapshot.regionalGraph.edges.push(
      { id: 'rel.Karrow.Duskmere', from: 'Karrow', to: 'Duskmere', relationshipType: 'hostile', type: 'hostile' },
      { id: 'rel.Mereth.Duskmere', from: 'Mereth', to: 'Duskmere', relationshipType: 'allied', type: 'allied' },
    );
    return { worldState, snapshot };
  }

  const burn = (worldState, snapshot, licenseState, victimId) => razingSiegeEmission({
    worldState,
    licenseState,
    snapshot,
    razerId: 'Karrow',
    victimId,
    razerName: 'Karrow',
    victimName: victimId,
    tick: 40,
    population: 1200,
    namedCastCount: 3,
    institutions: [{ id: 'shrine', name: 'Shrine' }],
    movableWealth: 40,
    now: '2026-08-04T00:00:00.000Z',
  });

  test('a tick that burns TWO towns keeps BOTH judgments on the shared observer edge', () => {
    const { worldState, snapshot } = twoVictimWorld();
    // The mouth's fold, verbatim: worldState stays the tick's opening picture;
    // the accumulator carries each patch forward.
    let accumulator = worldState;
    const first = burn(worldState, snapshot, accumulator, 'Thornwall');
    expect(first).not.toBeNull();
    accumulator = { ...accumulator, ...first.worldStatePatch };
    const second = burn(worldState, snapshot, accumulator, 'Duskmere');
    expect(second).not.toBeNull();

    // The LAST patch is the only one the bag carries home, so it must contain
    // both burnings' judgments or the first town's mourners lost theirs.
    const merethIncidents = second.worldStatePatch
      .relationshipStates['rel.Karrow.Mereth'].recentIncidents
      .filter((row) => row.type === 'razing_witnessed');
    expect(merethIncidents).toHaveLength(2);
    expect(merethIncidents.map((row) => String(row.outcomeId)).sort())
      .toEqual([first.outcome.id, second.outcome.id].map((id) => `${id}:razing_witnessed:Mereth`).sort());
  });

  test('and the two burnings COMPOUND rather than one overwriting the other', () => {
    const { worldState, snapshot } = twoVictimWorld();
    const before = worldState.relationshipStates['rel.Karrow.Mereth'];
    const only = burn(worldState, snapshot, worldState, 'Thornwall');
    let accumulator = { ...worldState, ...only.worldStatePatch };
    const second = burn(worldState, snapshot, accumulator, 'Duskmere');

    const afterOne = only.worldStatePatch.relationshipStates['rel.Karrow.Mereth'];
    const afterTwo = second.worldStatePatch.relationshipStates['rel.Karrow.Mereth'];
    // Strictly more resentment and strictly less trust after the second town
    // than after the first — the arithmetic proof that the fold happened.
    expect(afterTwo.resentment).toBeGreaterThan(afterOne.resentment);
    expect(afterOne.resentment).toBeGreaterThan(before.resentment);
    expect(afterTwo.trust).toBeLessThan(afterOne.trust);
  });

  /**
   * ⚠️ THIS PIN IS STRUCTURAL, AND IT SAYS SO ON ITS FACE (the WZ-3 idiom).
   *
   * A mutant that takes the DECISION reads off the accumulator instead of the
   * tick's opening picture SURVIVES every behavioural pin in this file, and that
   * is an honest measurement rather than a gap in the fixtures: the judgment
   * writes ONLY observer↔razer edges, and no decision input reads one. The
   * observer census walks edges incident to the razer (topology, which no patch
   * moves), the stake is the observer's trust in the VICTIM (an edge the
   * judgment never touches), and the nature is a self-read off settlement
   * records and ledgers the patch does not carry.
   *
   * So the split is not currently observable HERE — it is observable at the
   * MINT, where WZ-3 proved it behaviourally. It is kept and pinned structurally
   * because the moment any future judgment writes an axis a decision reads, the
   * eye-for-an-eye re-entry the split exists to prevent becomes reachable
   * through this door, and a discipline that is only maintained while it happens
   * to be unobservable is not a discipline.
   */
  test('the two roles are SPELLED APART in the source — the decision reads never take the accumulator', () => {
    const code = CODE(EXECUTION_SOURCE);
    const body = code.slice(
      code.indexOf('export function razingWitnessPatch'),
      code.indexOf('export function razingSiegeEmission'),
    );
    expect(body.length).toBeGreaterThan(400);
    // The census and the nature read take `worldState`; only the fold's base
    // takes the accumulator.
    expect(body).toContain('razingHolderEdgesFor(worldState, snapshot, razer, victim)');
    expect(body).toContain('const base = licenseState || worldState;');
    expect(body).not.toContain('razingHolderEdgesFor(licenseState');
  });
});

describe('⚠️⚠️ the ghost-materialization guard', () => {
  test('an observer edge with NO state record keeps its AUTHORED type through the write', () => {
    const { razed } = burnThornwall({ materializeObserverStates: false });
    const states = razed.worldStatePatch.relationshipStates;
    // Neither observer edge had a relationshipStates record before the razing.
    // `applyRelationshipPatch` rebuilds its baseline from an EMPTY edge, so
    // without the carried type both of these would read 'neutral' here.
    expect(states['rel.Karrow.Mereth'].relationshipType).toBe('allied');
    expect(states['rel.Karrow.Vaskar'].relationshipType).toBe('neutral');
  });

  test('NEGATIVE CONTROL — the cure is in THE WRITER now, and the failure it prevents is real', () => {
    // ⚠️ THIS PIN MOVED WITH THE CURE (WZ-5). It used to assert the razing carried
    // `relationshipType` in its own patch, because the writer could not type an
    // unmaterialized edge. The writer takes the edge now, so the guard lives there
    // — and this control drives the WRITER directly, in both polarities, which is
    // a strictly stronger proof than reading the old call site's source.
    const authoredEdge = { id: 'rel.Karrow.Mereth', from: 'Karrow', to: 'Mereth', relationshipType: 'allied' };
    const bare = { relationshipStates: {}, tick: 40 };
    const incident = {
      id: 'ghost-control',
      relationshipKey: 'rel.Karrow.Mereth',
      relationshipPatch: { fear: 0.5 },
      metadata: { incidentType: 'razing_witnessed' },
      proposalPayload: null,
    };
    // WITHOUT the edge: the old behaviour, and the defect is real rather than
    // theoretical — an authored ALLIED edge is written back as `neutral`.
    const blind = applyRelationshipPatch(bare, incident, null);
    expect(blind.relationshipStates['rel.Karrow.Mereth'].relationshipType).toBe('neutral');
    // WITH the edge: the authored type survives a write to a record that never existed.
    const cured = applyRelationshipPatch(bare, incident, null, authoredEdge);
    expect(cured.relationshipStates['rel.Karrow.Mereth'].relationshipType).toBe('allied');
    // And the razing hands its edge over rather than re-deriving the truth by hand.
    expect(CODE(EXECUTION_SOURCE)).toContain('}, now, pair.edge)');
  });
});

describe('the single writer, and the law leaf that cannot reach anything', () => {
  test('the judgment LAW holds no imports at all', () => {
    const code = CODE(WITNESS_SOURCE);
    expect(code.length).toBeGreaterThan(1500);
    expect(/^\s*import\s/m.test(code)).toBe(false);
    // A non-empty member check, so the pin cannot go vacuous on a relocation.
    for (const symbol of ['razingWitnessHits', 'razingJudgmentBandFor', 'RAZING_WITNESS_TUNING']) {
      expect(code).toContain(symbol);
    }
  });

  test('the assembly writes relationships ONLY through applyRelationshipPatch', () => {
    const code = CODE(EXECUTION_SOURCE);
    expect(code).toContain('applyRelationshipPatch(next, {');
    // No second spelling of a relationship write anywhere in the razing estate.
    for (const rel of [EXECUTION_SOURCE, WITNESS_SOURCE, 'src/domain/worldPulse/razing.js']) {
      expectAbsentWithAnchor(
        CODE(rel),
        'relationshipStates: {',
        'export',
        `${rel} builds a relationshipStates map by hand`,
      );
    }
  });

  test('the razing estate never writes an axis the judgment does not name', () => {
    const code = CODE(EXECUTION_SOURCE);
    // The patch's key set is the contract: THE THREE THE JUDGMENT MOVES, and only
    // those. A new axis appearing here is a design change that must be argued, not
    // absorbed. The five formerly CARRIED axes are deliberately absent now — the
    // writer derives them from the edge (WZ-5), so re-listing them here would be a
    // second, drifting copy of a baseline that has one owner.
    const patchBody = code.slice(code.indexOf('relationshipPatch: {'));
    const patchKeys = patchBody.slice(0, patchBody.indexOf('},'));
    for (const axis of ['trust', 'resentment', 'fear']) {
      expect(patchKeys).toContain(`${axis}:`);
    }
    for (const carried of ['relationshipType', 'dependency', 'leverage', 'tradeBalance', 'pactStrength']) {
      expect(patchKeys).not.toContain(`${carried}:`);
    }
    for (const forbidden of ['militaryBurden', 'aidBurden', 'obligationFatigue']) {
      expect(patchBody.slice(0, patchBody.indexOf('},'))).not.toContain(forbidden);
    }
  });
});

describe('dormancy — the judgment is unreachable in every world that did not burn a town', () => {
  test('no observers ⇒ no patch, and the caller keeps its frozen empty by REFERENCE', () => {
    expect(razingWitnessPatch({})).toBeNull();
    expect(razingWitnessPatch({
      worldState: {}, snapshot: {}, razerId: 'Karrow', victimId: 'Thornwall',
      road: 'initiation', severity01: 1,
    })).toBeNull();
  });

  test('a dark doctrine emits nothing at all — the judgment is never reached', () => {
    const { snapshot } = witnessWorld();
    const razed = razingSiegeEmission({
      worldState: { tick: 40, relationshipStates: {} },
      snapshot,
      razerId: 'Karrow',
      victimId: 'Thornwall',
      tick: 40,
    });
    expect(razed).toBeNull();
  });
});
