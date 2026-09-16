/**
 * settlementRumors.test.js — STEP 3.5 read-model contract: the DM/player
 * split on the includeCovert/includeGroundTruth convention, and THE
 * ADVERSARIAL WHITELIST SCRUB (§3.3): a free/anon projection NEVER contains a
 * latent deity name, a covert tag, or a ground-truth field — attacked with a
 * deity-carrying event fixture that plants the name in every channel an entry
 * has (structured field, headline, tags, causeClass).
 */
import { describe, expect, it } from 'vitest';

import {
  activatedDeityNamesFrom,
  confidenceBand,
  distanceBand,
  freshnessBand,
  hasRumorLedgers,
  HEADLINE_FRAMES,
  settlementRumors,
  whatPhrase,
} from '../../src/domain/display/settlementRumors.js';
import { WHAT_PHRASE_POOLS } from '../../src/domain/display/rumorPhrasePools.js';
import { advanceRumorLedgers, rumorEventKey } from '../../src/domain/spatial/rumorNetwork.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';

const DEITY = 'Maglubiyet the Latent';
const IDS = ['a', 'b', 'c', 'd'];

function digestFor(ids = IDS) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, ids.length).map((p, i) => ({ id: ids[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

const tradeChannel = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed' });
const GRAPH = { channels: [
  tradeChannel('ch.a.b', 'a', 'b'),
  tradeChannel('ch.b.c', 'b', 'c'),
  tradeChannel('ch.c.d', 'c', 'd'),
] };

/**
 * THE ADVERSARIAL FIXTURE — a deity-carrying, covert-cause event that plants
 * the latent name in EVERY channel a feed entry has. The capture whitelist
 * must keep the prose out entirely; the projection scrub must gate the
 * structured deityName and drop causeClass.
 */
function deityEvent({ tick = 5 } = {}) {
  return {
    id: `wizard_news.${tick}.applied.evtD`,
    tick,
    significance: 'major',
    score: 92,
    severity: 0.85,
    scope: 'regional',
    kind: 'applied',
    impactKind: 'religious_pressure',
    settlementIds: ['a'],
    sourceEventId: 'evtD',
    headline: `${DEITY}'s wrath strikes Ashford`,
    summary: `The cult of ${DEITY} is blamed for the burning granaries.`,
    tags: ['world_pulse', DEITY, 'covert_corruption'],
    reasons: [`${DEITY} demanded tribute`],
    causeClass: 'covert_corruption',
    deityName: DEITY,
  };
}

/** Drive the pure advance to a settled ledger and hand back a worldState. */
function worldWith({ mode = 'unreliable', entries = [deityEvent()], to = 14, seed = 'sr' } = {}) {
  const digest = digestFor();
  let ledgers = null;
  for (let tick = 5; tick <= to; tick += 1) {
    const result = advanceRumorLedgers({
      worldState: {
        simulationRules: { infoMode: mode },
        spatialCanonVersion: 1,
        spatialDigest: digest,
        ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
      },
      feedEntries: entries,
      graph: GRAPH,
      tick,
      rng: createPRNG(`${seed}::tick:${tick}`),
    });
    if (result.changed) ledgers = result.next;
  }
  return { tick: to, spatialLedgers: { rumorLedgers: ledgers } };
}

describe('THE ADVERSARIAL WHITELIST SCRUB (free/anon projection)', () => {
  it('a player projection never contains the deity name, the covert tag, or a ground-truth field', () => {
    const worldState = worldWith({});
    for (const sid of IDS) {
      const rumors = settlementRumors({ worldState, settlementId: sid });
      const serialized = JSON.stringify(rumors);
      // The latent deity name is NOWHERE in the player projection…
      expect(serialized.includes(DEITY)).toBe(false);
      expect(serialized.toLowerCase().includes('maglubiyet')).toBe(false);
      // …nor the covert cause class…
      expect(serialized.includes('covert')).toBe(false);
      expect(serialized.includes('causeClass')).toBe(false);
      // …nor any fidelity/provenance/lineage internal.
      for (const banned of ['completeness01', 'accuracy01', 'provenance', 'lineageIds', 'corroborationRoots', 'truth', 'relayIds', 'originId', 'score']) {
        expect(serialized.includes(banned), `player projection leaks ${banned} at ${sid}`).toBe(false);
      }
    }
  });

  it('the player field set is EXACTLY the whitelist — nothing rides along', () => {
    const worldState = worldWith({});
    const rumors = settlementRumors({ worldState, settlementId: 'b' });
    expect(rumors.length).toBeGreaterThan(0);
    for (const rumor of rumors) {
      expect(Object.keys(rumor).sort()).toEqual([
        'agoTicks', 'arrivalTick', 'carrier', 'confidence', 'deityName',
        'detail', 'distance', 'freshness', 'headline', 'id', 'knownWhenTick',
        'magnitude', 'significance', 'subjectIds', 'whereId',
      ].sort());
    }
  });

  it('the deity name appears ONLY when it resolves to an ACTIVATED public snapshot', () => {
    const worldState = worldWith({});
    // Fail-closed default: no activated set ⇒ scrubbed (asserted above). Now
    // the anti-vacuity half: with the name in the ACTIVATED set, it renders.
    const activated = new Set([DEITY]);
    const rumors = settlementRumors({
      worldState, settlementId: 'b', activatedDeityNames: activated,
    });
    const withDeity = rumors.find((r) => r.deityName === DEITY);
    expect(withDeity).toBeTruthy();
    expect(withDeity.detail.includes(DEITY)).toBe(true);
    // A DIFFERENT activated name still scrubs this one.
    const other = settlementRumors({
      worldState, settlementId: 'b', activatedDeityNames: new Set(['Pelor']),
    });
    expect(JSON.stringify(other).includes(DEITY)).toBe(false);
  });

  it('event prose (headline/summary/tags/reasons) never enters the packet at all', () => {
    // Even the DM view cannot recover the entry's PROSE from the record —
    // only the structured fields; the true headline arrives via the explicit
    // wizardNews join. So a player surface can never leak it by accident.
    const worldState = worldWith({});
    const dm = settlementRumors({ worldState, settlementId: 'b', includeGroundTruth: true });
    expect(dm.length).toBeGreaterThan(0);
    const serialized = JSON.stringify(dm.map((r) => ({ ...r, truth: { ...r.truth, deityName: null, causeClass: null } })));
    expect(serialized.includes('wrath strikes')).toBe(false);
    expect(serialized.includes('burning granaries')).toBe(false);
  });
});

describe('the DM projection (includeGroundTruth — premium/DM surfaces only)', () => {
  it('adds ground truth + provenance + divergence on top of the player fields', () => {
    const worldState = worldWith({});
    const feed = { entries: [deityEvent()] };
    const rumors = settlementRumors({
      worldState, settlementId: 'c', includeGroundTruth: true, wizardNews: feed,
    });
    expect(rumors.length).toBeGreaterThan(0);
    const rumor = rumors[0];
    expect(rumor.truth).toBeTruthy();
    expect(rumor.truth.eventRef).toBe('evtD');
    expect(rumor.truth.causeClass).toBe('covert_corruption'); // DM sees the covert cause
    expect(rumor.truth.deityName).toBe(DEITY);                // …and the raw name
    expect(rumor.truth.provenance.originId).toBe('a');
    expect(Array.isArray(rumor.truth.lineageIds)).toBe(true);
    expect(rumor.truth.lineageIds[0]).toBe('evtD');
    expect(typeof rumor.truth.independentSources).toBe('number');
    expect(rumor.truth.trueHeadline).toBe(`${DEITY}'s wrath strikes Ashford`);
    expect(Array.isArray(rumor.truth.divergence)).toBe(true);
  });
});

describe('read-model mechanics', () => {
  it('in-transit records are invisible until they arrive (both projections)', () => {
    const digest = digestFor();
    // One advance tick: 'b' holds an IN-TRANSIT record (arrival 6 > tick 5).
    const step = advanceRumorLedgers({
      worldState: { simulationRules: { infoMode: 'perfect_delayed' }, spatialCanonVersion: 1, spatialDigest: digest },
      feedEntries: [deityEvent()],
      graph: GRAPH,
      tick: 5,
    });
    const inTransit = step.next?.b?.[rumorEventKey('evtD')];
    expect(inTransit).toBeTruthy();
    expect(inTransit.arrivalTick).toBeGreaterThan(5);
    const atFive = { tick: 5, spatialLedgers: { rumorLedgers: step.next } };
    expect(settlementRumors({ worldState: atFive, settlementId: 'b' })).toEqual([]);
    expect(settlementRumors({ worldState: atFive, settlementId: 'b', includeGroundTruth: true })).toEqual([]);
    // Once the clock reaches the arrival tick, it shows.
    const later = { tick: inTransit.arrivalTick, spatialLedgers: { rumorLedgers: step.next } };
    expect(settlementRumors({ worldState: later, settlementId: 'b' }).length).toBe(1);
  });

  it('is inert-not-crash on garbage and absent ledgers', () => {
    expect(settlementRumors({ worldState: null, settlementId: 'a' })).toEqual([]);
    expect(settlementRumors({ worldState: {}, settlementId: 'a' })).toEqual([]);
    expect(settlementRumors({ worldState: { spatialLedgers: { rumorLedgers: [] } }, settlementId: 'a' })).toEqual([]);
    expect(settlementRumors({ worldState: { spatialLedgers: { rumorLedgers: { a: null } } }, settlementId: 'a' })).toEqual([]);
    expect(settlementRumors({ worldState: worldWith({}), settlementId: null })).toEqual([]);
    expect(hasRumorLedgers(null)).toBe(false);
    expect(hasRumorLedgers({ spatialLedgers: { rumorLedgers: {} } })).toBe(false);
    expect(hasRumorLedgers(worldWith({}))).toBe(true);
  });

  it('renders fiction from names, not ids, and bands the internals', () => {
    const worldState = worldWith({ mode: 'perfect_delayed' });
    const names = new Map([['a', 'Ashford'], ['b', 'Briarwatch'], ['c', 'Crownhold'], ['d', 'Deepmoor']]);
    const rumors = settlementRumors({
      worldState, settlementId: 'd', nameFor: (id) => names.get(id) || id,
    });
    expect(rumors.length).toBe(1);
    const rumor = rumors[0];
    expect(rumor.headline.includes('Ashford')).toBe(true);
    expect(['fresh', 'recent', 'old']).toContain(rumor.freshness);
    expect(['firsthand', 'nearby word', 'distant word']).toContain(rumor.distance);
    expect(['certain', 'corroborated', 'credible', 'unverified']).toContain(rumor.confidence);
    // Perfect-but-Delayed keeps full detail: magnitude + when are known.
    expect(rumor.magnitude).toBeTruthy();
    expect(rumor.knownWhenTick).toBe(5);
  });

  it('bands behave at their edges', () => {
    expect(freshnessBand(0)).toBe('fresh');
    expect(freshnessBand(4)).toBe('recent');
    expect(freshnessBand(9)).toBe('old');
    expect(distanceBand(0)).toBe('firsthand');
    expect(distanceBand(2)).toBe('nearby word');
    expect(distanceBand(3)).toBe('distant word');
    expect(confidenceBand({ hopCount: 0, corroborationRoots: ['x'] })).toBe('certain');
    expect(confidenceBand({ hopCount: 3, corroborationRoots: ['x', 'y'] })).toBe('corroborated');
    expect(confidenceBand({ hopCount: 1, corroborationRoots: ['x'] })).toBe('credible');
    expect(confidenceBand({ hopCount: 3, corroborationRoots: ['x'] })).toBe('unverified');
  });

  it('renders an in-world PHRASE for the subject, never a raw engine token (content-immersion-1)', () => {
    // A hand-built ledger record lets us drive an arbitrary `what` token straight
    // into the player projection and assert the headline speaks fiction, not engine.
    const NAMES = new Map([['s2', 'Thornwall']]);
    const nameFor = (id) => NAMES.get(id) || id;
    function headlineFor(what, { hopCount = 2, completeness01 = 0.9 } = {}) {
      const worldState = {
        tick: 10,
        spatialLedgers: { rumorLedgers: { s1: { k1: {
          arrivalTick: 8, hopCount, completeness01, eventTick: 5, score: 40,
          content: { what, whereId: 's2', magnitude: 2, partyIds: ['s2'] },
        } } } },
      };
      const rumors = settlementRumors({ worldState, settlementId: 's1', nameFor });
      expect(rumors.length).toBe(1);
      return `${rumors[0].headline} ${rumors[0].detail}`;
    }

    // The marquee leaks the finding named — now spoken as fiction.
    const deploy = headlineFor('strategy_deploy');
    expect(deploy).toContain('soldiers marching to war');
    expect(deploy.toLowerCase()).not.toContain('strategy deploy');
    const schism = headlineFor('stressor_birth_religious_pact_betrayal');
    expect(schism.toLowerCase()).not.toContain('stressor');

    // No KNOWN engine token — candidate types, regional impact kinds, spatial /
    // seasonal kinds — reaches a rendered headline as a raw slug or engine word.
    const KNOWN_WHAT = [
      'strategy_deploy', 'war_mobilization', 'war_conscription', 'war_levy', 'war_spoils',
      'army_homecoming', 'siege_lifted', 'conquest', 'field_battle', 'conflict_pressure',
      'protection_gap', 'coup_succeeded', 'coup_suppressed', 'faction_exhaustion',
      'faction_government_challenge', 'faction_rival_power_contest', 'faction_capture',
      'hierarchy_cascade', 'authority_instability', 'occupation_lifted', 'occupation_vassalized', 'treaty_breached',
      'faith_foothold_recruited', 'faith_pact_formed', 'religious_pressure', 'pantheon_ascendancy',
      'pantheon_twilight', 'moral_reckoning', 'belief_misjudgment',
      'stressor_birth_religious_conversion_fracture', 'stressor_birth_religious_pact_betrayal',
      'flow_trade_scarcity', 'import_shortage', 'export_market_loss', 'route_disruption',
      'tax_revenue_disruption', 'service_disruption', 'resource_depletion', 'resource_recovery',
      'harvest', 'hungry_gap', 'spring_thaw', 'flow_migration', 'migration_pressure',
      'population_emigration', 'institution_build', 'institution_closure', 'institution_founding',
      'npc_goal_culmination', 'npc_goal_rebranch', 'plague_arrival', 'calamity',
      'information_shock', 'criminal_pressure', 'stressor_residual', 'party_stressor_residual',
      'stressor_aftermath', 'stressor_graduated', 'stressor_wind_down', 'cause_lifecycle',
    ];
    // Engine-jargon markers that must never reach the player surface. (Single
    // real-English tokens like "conquest"/"harvest"/"siege" are fine words and
    // are deliberately not denied — the finding is about system slugs.)
    const DENY = ['_', 'deploy', 'stressor', 'npc', 'impactkind', 'candidatetype', 'queued', 'applied'];
    for (const what of KNOWN_WHAT) {
      for (const hopCount of [0, 2]) {
        const text = headlineFor(what, { hopCount }).toLowerCase();
        for (const bad of DENY) {
          expect(text.includes(bad), `engine token "${bad}" leaks for ${what}`).toBe(false);
        }
      }
    }

    // Bare lifecycle kinds (impactKind absent ⇒ `what` falls to the transition)
    // neutralize to an in-world word, never "applied"/"queued".
    for (const kind of ['applied', 'queued', 'ready', 'resolved', 'expired', 'ignored']) {
      expect(whatPhrase(kind)).toBe('unrest');
    }
    expect(whatPhrase('')).toBe('unrest');
    expect(whatPhrase(null)).toBe('unrest');
    expect(whatPhrase('treaty_breached')).toBe('an oath between realms broken');
    // An unknown future token degrades to readable words, never a raw slug.
    expect(whatPhrase('npc_some_future_arc')).toBe('some future arc');
    expect(whatPhrase('utterly_new_beat')).toBe('utterly new beat');
  });

  // ── HEADLINE FRAME variety (content-vt-2) ──────────────────────────────────
  const NAMES = new Map([['s2', 'Thornwall']]);
  const nameFor = (id) => NAMES.get(id) || id;
  function renderHeadline(what, { eventRef, hopCount = 2, completeness01 = 0.9, settlementId = 's1' } = {}) {
    const worldState = {
      tick: 10,
      spatialLedgers: { rumorLedgers: { [settlementId]: { k1: {
        arrivalTick: 8, hopCount, completeness01, eventTick: 5, score: 40, eventRef,
        content: { what, whereId: 's2', magnitude: 2, partyIds: ['s2'] },
      } } } },
    };
    return settlementRumors({ worldState, settlementId, nameFor })[0].headline;
  }
  // hopCount/completeness that land each completeness band (thresholds 0.5 / 0.3).
  const BANDS = {
    firsthand: { hopCount: 0, completeness01: 1 },
    outline: { hopCount: 2, completeness01: 0.9 },
    vague: { hopCount: 2, completeness01: 0.4 },
    thin: { hopCount: 2, completeness01: 0.2 },
  };

  it('every frame template carries its slots and no engine token (register)', () => {
    const DENY = ['_', 'deploy', 'stressor', 'npc', 'impactkind', 'candidatetype', 'queued', 'applied'];
    for (const [band, pool] of Object.entries(HEADLINE_FRAMES)) {
      expect(pool.length, `${band} has variety`).toBeGreaterThanOrEqual(2);
      for (const frame of pool) {
        expect(frame.includes('{where}'), `${band}: "${frame}" carries {where}`).toBe(true);
        if (band !== 'thin') {
          expect(/\{[Ww]hat\}/.test(frame), `${band}: "${frame}" carries the subject`).toBe(true);
        }
        const lc = frame.toLowerCase();
        for (const bad of DENY) {
          expect(lc.includes(bad), `${band}: "${frame}" leaks "${bad}"`).toBe(false);
        }
      }
    }
  });

  it('DETERMINISM: same event ref ⇒ same frame; frame is stable across viewers', () => {
    for (const band of Object.keys(BANDS)) {
      const a = renderHeadline('conflict_pressure', { eventRef: 'evt.stable.9', ...BANDS[band] });
      const b = renderHeadline('conflict_pressure', { eventRef: 'evt.stable.9', ...BANDS[band] });
      expect(a, band).toBe(b);
      // Seed is the event ref, NOT the viewer — a different listening settlement
      // hearing the SAME event frames it identically (the where is the same too).
      const other = renderHeadline('conflict_pressure', { eventRef: 'evt.stable.9', settlementId: 's7', ...BANDS[band] });
      expect(other, `${band} cross-viewer`).toBe(a);
    }
  });

  it('the subject phrase + place ride EVERY selected frame (facts never move)', () => {
    // Across many event refs (⇒ different frames), the fiction still names the
    // subject phrase and the place — only the connective framing changes.
    for (let i = 0; i < 40; i++) {
      const h = renderHeadline('strategy_deploy', { eventRef: `e${i}`, ...BANDS.outline });
      expect(h.includes('Thornwall'), h).toBe(true);
      expect(h.includes('soldiers marching to war'), h).toBe(true);
      expect(h.toLowerCase().includes('strategy deploy'), h).toBe(false);
    }
  });

  it('ANTI-REPETITION: distinct event refs reach the whole pool of each band', () => {
    // THE CARRIER MUST BE SINGLE-VOICED, and that is now a real constraint rather than an
    // accident. This test counts DISTINCT RENDERED HEADLINES and reads that count as the
    // number of reachable FRAMES — which is only sound while the subject phrase is
    // constant across event refs. The legacy retrofit (RECEIPT_POOLS_LEGACY.md §3/§4)
    // widened the subject phrase of 170 kinds, so a widened carrier makes this count
    // frames × phrases instead: 'conflict_pressure' was the original carrier and now
    // yields 32 (4 frames × 8 phrases), not 4.
    //
    // 'war_mobilization' is registered in WHAT_PHRASES and appears in NEITHER §3 nor §4,
    // so it is single-voiced and stays that way — the retrofit is closed at 170 of 170
    // and cannot consume it. tests/domain/rumorPhrasePools.test.js pins the same kind as
    // its unwired control, so if that ever stops being true, this test's premise reds
    // there by name rather than silently inflating a count here.
    const SINGLE_VOICED = 'war_mobilization';
    expect(WHAT_PHRASE_POOLS[SINGLE_VOICED], `${SINGLE_VOICED} must stay single-voiced for this count to mean frames`)
      .toBeUndefined();
    for (const [band, cfg] of Object.entries(BANDS)) {
      const seen = new Set();
      for (let i = 0; i < 300; i++) seen.add(renderHeadline(SINGLE_VOICED, { eventRef: `ev_${i}`, ...cfg }));
      expect(seen.size, `${band} fully reachable`).toBe(HEADLINE_FRAMES[band].length);
    }
  });

  it('a WIDENED carrier reaches frames × phrases — except in the subject-less thin band', () => {
    // The positive counterpart of the pin above, and the reason it had to change: the
    // same census over a widened kind now walks BOTH axes, so the disclosed prose shift is
    // measured at the headline surface rather than asserted.
    //
    // THE THIN BAND IS THE EXCEPTION, AND IT IS A REAL PROPERTY, NOT A TOLERANCE. Its
    // frames carry no {what} slot at all — the register test above encodes that as
    // `if (band !== 'thin')` — because a rumor this degraded has stopped being about a
    // specific subject and is only "trouble near {where}". So the widened pool CANNOT
    // reach thin headlines, and thin stays at exactly its frame count. Anything else
    // would mean a subject leaked into the vaguest band.
    const pool = 1 + (WHAT_PHRASE_POOLS.conflict_pressure?.length ?? 0);
    expect(pool, 'conflict_pressure must be wired for this pin to mean anything').toBeGreaterThan(1);
    for (const [band, cfg] of Object.entries(BANDS)) {
      const seen = new Set();
      for (let i = 0; i < 300; i++) seen.add(renderHeadline('conflict_pressure', { eventRef: `ev_${i}`, ...cfg }));
      const axes = band === 'thin' ? 1 : pool;
      expect(seen.size, `${band}: frames × phrases`).toBe(HEADLINE_FRAMES[band].length * axes);
    }
  });

  it('CANONICAL-AT-ZERO: a telling with no stable seed renders the original frame', () => {
    // No eventRef and no ledger key seed ⇒ index-0 frame (the pre-content-vt-2
    // wording), so any seedless path is byte-identical.
    const worldState = {
      tick: 10,
      spatialLedgers: { rumorLedgers: { s1: { '': {
        arrivalTick: 8, hopCount: 2, completeness01: 0.9, eventTick: 5, score: 40,
        content: { what: 'conflict_pressure', whereId: 's2', magnitude: 2, partyIds: ['s2'] },
      } } } },
    };
    const h = settlementRumors({ worldState, settlementId: 's1', nameFor })[0].headline;
    expect(h).toBe('Merchants bring word of the drums of war in Thornwall');
  });

  it('activatedDeityNamesFrom reads ONLY the public embedded snapshots', () => {
    const saves = [
      { settlement: { config: { primaryDeitySnapshot: { name: 'Pelor' }, cultDeitySnapshots: [{ name: 'The Maw' }] } } },
      { settlement: { config: { latentPantheon: [{ name: DEITY }] } } }, // latent NEVER enters
      null,
      { settlement: {} },
    ];
    const names = activatedDeityNamesFrom(saves);
    expect(names.has('Pelor')).toBe(true);
    expect(names.has('The Maw')).toBe(true);
    expect(names.has(DEITY)).toBe(false);
    expect(activatedDeityNamesFrom(null).size).toBe(0);
  });
});
