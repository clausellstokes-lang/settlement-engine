/**
 * faithObservationFloorWf0.test.js — WF-0, THE OBSERVATION FLOOR (the faith program's first
 * wave, instrument-side, no flag): docs/DESIGN_FP_ARCH_WF.md "### WF-0 — THE OBSERVATION
 * FLOOR" (normative where the compiled block compresses it) and the block #32 in
 * docs/DESIGN_FP_ARCHITECTURE.md §5. Lane FP-F.
 *
 * WHAT THE WAVE BUYS, IN ONE SENTENCE: before it, every completed soak ran the religion layer
 * with its outer data gate SHUT (the corpus is deity-free by doctrine), so the faith rows'
 * zero could not be told from an absent precondition; after it, every v5 receipt carries the
 * count that tells them apart (`subsystems.deityBearers`), and ONE authored case
 * (`wf0-deity-bearing`) exists that opens the gate through the product's own affordances.
 *
 * THE ARMS, by the volume's own list:
 *   (a) the bearer-count invariant on the two faith certification rows;
 *   (b) the deityBearers field — CORRECT on the bearing fixture AND ZERO on the deity-free
 *       corpus (both arms, each anchored by the other), never derived from wizard-news ids,
 *       and the deity-free section byte-identical minus the new field (the hash arm);
 *   (c) the doctrine — the case's deities round-trip the custom-content path, and the bag
 *       alone never makes the generator seat a god; two opposed-quadrant deities;
 *   (d) J1 (R-1) — the affordances on canon (decrees drained at the head) and on a draft
 *       (plain corrections), pinned both ways;
 *   (e) WF-2's preconditions on drawsPilgrims' live bar (a grand observance at the patron
 *       host with a mapped, reachable neighbour);
 *   (f) one LIVE year through the product advance entry for each realm: the case opens the
 *       gate (the religionStates census the faith rows named as missing), the corpus stays
 *       the absent precondition;
 *   (g) the soak writes it — source-checked, because importing the soak runs one (§145.2).
 *
 * ⛔ EVERY FIXTURE IS DEITY-BEARING THROUGH SET_PRIMARY_DEITY / IMPOSE_CULT, never by writing
 * a config field: the bearing realm is the case module's own seating (the head-of-tick drain),
 * the draft arm replays the same events through the domain `applyEvent`.
 *
 * ⚠ THE WAVE'S TWO NEW MODULE SURFACES ARE RESOLVED DEFENSIVELY (a namespace import and a
 * caught dynamic import), so that planting the pre-WF-0 tree reds each arm BY TITLE — the
 * red-first law — instead of failing this file's load before any title exists.
 *
 * THE MUTANT (the bearer predicate collapsed to cult embeds only) is registered in
 * scripts/mutation-coverage-manifest.json as the meta row `meta:wf0-bearer-count-cult-only-mutant`.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildRegistry, mintDeityRef } from '../../src/lib/customRegistry.js';
import { deitySnapshotFrom } from '../../src/domain/deitySnapshot.js';
import { commitDeityEmbed } from '../../src/domain/deityCommitEmbed.js';
import { applyEvent } from '../../src/domain/events/applyEvent.js';
import { deriveFoundingTraditions } from '../../src/domain/traditions/genesis.js';
import { drawsPilgrims, pilgrimageDraw } from '../../src/domain/traditions/pilgrimage.js';
import { getSpatialLedger, isMapped, pathCost } from '../../src/domain/spatial/distanceRead.js';
import { isSubsystemActive } from '../../src/domain/worldPulse/subsystemActivation.js';
import { chaos01, evil01 } from '../../src/domain/worldPulse/deityAxes.js';
import { SACRED_CLAIM_TUNING, faithStandingBetween } from '../../src/domain/worldPulse/sacredClaim.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { SUBSYSTEM_CERTIFICATION_REGISTRY } from '../../src/domain/certification/subsystemCertification.js';
import * as observation from '../../scripts/audit/behavioral-observation.mjs';
import { composeSoakRules, soakAdvanceEpoch } from '../../scripts/audit/soakRules.mjs';
import { buildWholeWorldSoakSpatialCanon } from '../../scripts/audit/whole-world-soak-spatial-fixture.mjs';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const source = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const sha256 = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');

/** The case module, resolved so its absence (the pre-WF-0 tree) reds each arm by title. */
const deityCaseModule = await import('../../scripts/audit/whole-world-soak-deity-fixture.mjs')
  .catch(() => ({}));
const caseApi = () => {
  const api = /** @type {Record<string, any>} */ (deityCaseModule);
  if (!api.WF0_DEITY_BEARING_CASE) throw new Error('scripts/audit/whole-world-soak-deity-fixture.mjs does not load: the case is not built');
  return api;
};
const bearerApi = () => {
  const api = /** @type {Record<string, any>} */ (observation);
  if (typeof api.countDeityBearers !== 'function' || typeof api.isDeityBearer !== 'function') {
    throw new Error('behavioral-observation.mjs exports no bearer count: the v5 field is not built');
  }
  return api;
};

// ── THE SOAK'S OWN CORPUS, pinned against the soak's source in arm (g) ──────────────
const SOAK = 'scripts/audit/whole-world-soak.mjs';
const NOW = '2026-07-12T00:00:00.000Z';
const SEED = 'w0-soak';
const REGION_ARCHETYPES = Object.freeze([
  { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'crossroads' },
  { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  { settType: 'town', culture: 'celtic', terrain: 'coastal', tradeRouteAccess: 'port' },
  { settType: 'village', culture: 'norse', terrain: 'mountains', tradeRouteAccess: 'road' },
]);
const SEQ_IDS = Object.freeze(['soak-a', 'soak-b', 'soak-c', 'soak-d']);

/** The soak's `buildFixture` generation step, the bag being the only variable. */
function generateRealm(customContent) {
  return REGION_ARCHETYPES.map((config, i) => {
    const settlement = generateSettlementPipeline(config, null, { seed: `${SEED}-${i}`, customContent });
    return {
      id: SEQ_IDS[i],
      name: settlement.name || SEQ_IDS[i],
      phase: 'canon',
      settlement,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    };
  });
}

/** The deity-free corpus: the soak's realm with the historical empty bag. */
const CORPUS = generateRealm({});
let seatedMemo = null;
/** The bearing realm: the same generation handed the case's bag, then seated at the head. */
function bearing() {
  if (!seatedMemo) {
    const { WF0_DEITY_BEARING_CASE, seatDeityBearingCase } = caseApi();
    const generated = generateRealm(WF0_DEITY_BEARING_CASE.customContent);
    seatedMemo = { generated, ...seatDeityBearingCase(generated, WF0_DEITY_BEARING_CASE, { now: NOW }) };
  }
  return seatedMemo;
}

const itemOf = (save) => ({ id: save.id, settlement: save.settlement });
const gateOpensAlone = (save) => isSubsystemActive({ settlements: [itemOf(save)] }, 'religion');
const configOf = (save) => save.settlement?.config || {};
const hasPatron = (save) => Boolean(configOf(save).primaryDeitySnapshot);
const hasCult = (save) => (configOf(save).cultDeitySnapshots || []).length > 0;
const rowOf = (rule) => SUBSYSTEM_CERTIFICATION_REGISTRY.find((row) => row.rule === rule);
const bearerInvariantOf = (row) => row.invariants.find((inv) => inv.name === 'spread_needs_a_deity_bearer');

/** One live year through the product advance entry, threaded as the soak threads it. */
async function liveYear(saves) {
  const { fullRules } = composeSoakRules({ preset: SIMULATION_RULE_PRESETS.full_simulation.rules, seasons: 'preset', overlay: {} });
  const campaign = {
    id: 'wf0-live-year',
    name: 'WF-0 live year',
    settlementIds: saves.map((save) => save.id),
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }, { now: NOW }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: SEED,
      tick: 0,
      canonizedAt: NOW,
      ...buildWholeWorldSoakSpatialCanon(saves),
      simulationRules: fullRules,
      stressors: [],
    },
  };
  const result = await simulateCampaignWorldInterval({
    campaign,
    saves,
    interval: 'one_year',
    commit: true,
    now: NOW,
    autoResolve: true,
    advanceEpoch: soakAdvanceEpoch({ simulationRules: fullRules, seed: SEED, year: 1 }),
  });
  const byId = new Map((result.settlementUpdates || []).map((update) => [String(update.saveId), update.settlement]));
  const finalSaves = saves.map((save) => (byId.has(String(save.id)) ? { ...save, settlement: byId.get(String(save.id)) } : save));
  return { worldState: result.worldState, finalSaves };
}

// ═════════════════════════════════════════════════════════════════════════════════════════
describe('WF-0 (a) — the bearer-count invariant on the two faith certification rows', () => {
  test('both faith rows carry ONE bearer invariant, and it cites the v5 field the schema now writes', () => {
    const spread = rowOf('faithSpreadEnabled');
    const alias = rowOf('religionDynamicsEnabled');
    const invariant = bearerInvariantOf(spread);
    expect(invariant, 'the canonical faith row lost its bearer invariant').toBeTruthy();
    // ONE object on both rows: the legacy mirror's zero IS the canonical row's zero.
    expect(bearerInvariantOf(alias)).toBe(invariant);
    expect(invariant.check).toContain('subsystems.deityBearers');
    // The field the check cites is a field the v5 builder really emits, read off the check
    // itself so the prose and the schema cannot drift apart.
    const cited = /subsystems\.([A-Za-z]+)/.exec(invariant.check)[1];
    const section = bearerApi().buildSubsystemConfiguration({ presetId: 'x', rules: {}, yearlyCensuses: [], deityBearers: 2 });
    expect(Object.keys(section)).toContain(cited);
    expect(section[cited]).toBe(2);
    // anchored: the two assertions above prove the check is the live WF-0 text naming the field, so this absence of the old gap claim cannot be an empty string passing
    expect(invariant.check).not.toMatch(/NOT expressible/);
    // The case builds here and RUNS at the owner-held soak redo: nothing is certified yet.
    expect(spread.soakEvidence).toBe('unobserved');
    expect(alias.soakEvidence).toBe('unobserved');
    // The rows' shared prose names the case that closes the gap, by its program-owned id.
    expect(spread.aliveness.other).toContain(caseApi().WF0_DEITY_BEARING_CASE_ID);
    expect(alias.aliveness.other).toContain(caseApi().WF0_DEITY_BEARING_CASE_ID);
  });

  test('neither faith row declares a wizard-news id on any channel (the moverFamily skew law)', () => {
    for (const rule of ['faithSpreadEnabled', 'religionDynamicsEnabled']) {
      const { eventTypes, moverFamilies, stateKeys } = rowOf(rule).aliveness;
      const declared = [...eventTypes, ...moverFamilies, ...stateKeys];
      expect(eventTypes.length, `${rule} declares no channel, so the scan below would be vacuous`).toBe(3);
      // anchored: the line above proves this row declares its three spread literals, so an empty or renamed row reds there
      expect(declared.filter((token) => /wizard_news|wizardNews/.test(token))).toEqual([]);
    }
  });
});

// ═════════════════════════════════════════════════════════════════════════════════════════
describe('WF-0 (b) — the deityBearers receipt field, both arms', () => {
  test('CORRECT on the bearing fixture: three bearers, the religion gate\'s own count, and neither half of the predicate reaches it', () => {
    const { countDeityBearers } = bearerApi();
    const { saves } = bearing();
    expect(countDeityBearers(saves)).toBe(3);
    // The count IS the gate's, asked of one settlement at a time — never a second spelling.
    expect(saves.filter(gateOpensAlone).map((save) => save.id)).toEqual(['soak-a', 'soak-b', 'soak-c']);
    // THE FIXTURE CONVICTS BOTH HALF-PREDICATES (the mutant's control, run on every gate):
    // patrons alone and cults alone each read TWO, so a predicate collapsed to either half
    // reds the three above rather than passing it.
    expect(saves.filter(hasPatron).map((save) => save.id)).toEqual(['soak-a', 'soak-b']);
    expect(saves.filter(hasCult).map((save) => save.id)).toEqual(['soak-b', 'soak-c']);
    // …and a settlement bearing both kinds counts ONCE, not twice.
    expect(saves.filter((save) => hasPatron(save) && hasCult(save)).map((save) => save.id)).toEqual(['soak-b']);
  });

  test('ZERO on the deity-free corpus, and the zero is non-vacuous', () => {
    const { countDeityBearers } = bearerApi();
    // Non-vacuity: the corpus is the SAME four settlements the bearing arm counts three in.
    expect(CORPUS.map((save) => save.id)).toEqual([...SEQ_IDS]);
    expect(countDeityBearers(bearing().saves)).toBe(3);
    // anchored: the two assertions above prove the counter reads this realm and answers three when it is seated, so this zero is the corpus's own
    expect(countDeityBearers(CORPUS)).toBe(0);
    // anchored: the gate opens on the seated twin in the arm above; here it stays shut for every settlement
    expect(CORPUS.filter(gateOpensAlone)).toEqual([]);
    // anchored: the generator's settlements are real (four ids above), so the missing embed keys are a doctrine fact, not an empty object
    expect(CORPUS.flatMap((save) => Object.keys(configOf(save)).filter((key) => /Deity|latentPantheon/.test(key)))).toEqual([]);
    // Total on garbage: never a throw, never a count.
    expect(countDeityBearers(null)).toBe(0);
    expect(countDeityBearers([null, {}, { settlement: null }])).toBe(0);
  });

  test('NEVER derived from wizard_news ids: faith-kind news on every settlement moves neither count', () => {
    const { countDeityBearers } = bearerApi();
    const news = (save) => ({
      ...save,
      settlement: {
        ...save.settlement,
        wizardNews: [
          { id: `wizard_news.52.faith_conversion.${save.id}`, kind: 'faith_foothold_recruited', impactKind: 'religious_authority' },
          { id: `wizard_news.53.deity.${save.id}`, kind: 'faith_pact_formed' },
        ],
      },
    });
    expect(countDeityBearers(CORPUS.map(news))).toBe(0);
    expect(countDeityBearers(bearing().saves.map(news))).toBe(3);
    // And the counter's own source reads the gate, never a news id or the mover classifier.
    const text = source('scripts/audit/behavioral-observation.mjs');
    const start = text.indexOf('export function isDeityBearer(');
    const end = text.indexOf('export function buildSubsystemConfiguration(');
    expect(start, 'the bearer predicate is not where the v5 builder lives').toBeGreaterThan(0);
    const slice = text.slice(start, end).split('\n').filter((line) => !/^\s*(\*|\/\/|\/\*)/.test(line)).join('\n');
    expect(slice).toContain('isSubsystemActive(');
    expect(slice).toContain("'religion'");
    // anchored: the two assertions above prove the slice is the live predicate's code, so this absence is a real exclusion
    expect(slice).not.toMatch(/wizard|news|moverFamilyOf/i);
  });

  test('the v5 section carries the count LAST, and a deity-free receipt is byte-identical minus the field (the hash arm)', () => {
    const { buildSubsystemConfiguration } = bearerApi();
    // THE WITNESS OF THE PRE-WF-0 BYTES. Recorded at ⟨BASE⟩ bfe4830d0 by planting
    // `git show bfe4830d0:scripts/audit/behavioral-observation.mjs` over the tree and hashing
    // this exact input through the BASE builder (plant-and-restore, sha256-verified). A later
    // wave that deliberately changes the section re-records it with its cause.
    const BASE_SECTION_SHA256 = '0651f66df8d0cfe759189c5f2f1ef531700c0673641eb480fd3434c4284ee8cc';
    const input = {
      presetId: 'full_simulation',
      rules: { faithSpreadEnabled: true, presetId: 'full_simulation', propagationMode: 'full', religionDynamicsEnabled: true, traditionsEnabled: true, warLayerEnabled: false },
      yearlyCensuses: [
        { 'spatialLedgers.traditions': 4, stressors: 2, tick: 1 },
        { 'spatialLedgers.traditions': 4, stressors: 3, tick: 1, wars: 1 },
      ],
    };
    const unmeasured = buildSubsystemConfiguration(input);
    expect(sha256(unmeasured), 'a caller that measured nothing no longer gets the pre-WF-0 section').toBe(BASE_SECTION_SHA256);
    const corpus = buildSubsystemConfiguration({ ...input, deityBearers: 0 });
    expect(corpus.deityBearers).toBe(0);
    expect(Object.keys(corpus).at(-1)).toBe('deityBearers');
    const { deityBearers, ...minusField } = corpus;
    expect(deityBearers).toBe(0);
    expect(sha256(minusField)).toBe(BASE_SECTION_SHA256);
    expect(JSON.stringify(corpus)).toBe(`${JSON.stringify(unmeasured).slice(0, -1)},"deityBearers":0}`);
    // A figure that is not a count is dropped rather than published.
    for (const bad of [-1, 1.5, '3', null, Number.NaN]) {
      expect(Object.keys(buildSubsystemConfiguration({ ...input, deityBearers: bad })), `${String(bad)} was published`).toHaveLength(Object.keys(unmeasured).length);
    }
  });
});

// ═════════════════════════════════════════════════════════════════════════════════════════
describe('WF-0 (c) — the authored case and the doctrine: deities round-trip the custom-content path', () => {
  test('the pantheon bag never makes the generator seat a god: generation with it is byte-identical to the empty bag', () => {
    const { generated } = bearing();
    expect(generated.map((save) => sha256(save.settlement))).toEqual(CORPUS.map((save) => sha256(save.settlement)));
    // anchored: the hash equality above proves the four generated settlements are the corpus's, so a missing deity here is the generator's doctrine
    expect(generated.filter(gateOpensAlone)).toEqual([]);
  });

  test('every seat is the store\'s resolution and the handler\'s commit, and its ref resolves back to the authored record', () => {
    const { WF0_DEITY_BEARING_CASE } = caseApi();
    const { saves, plan } = bearing();
    const registry = buildRegistry(WF0_DEITY_BEARING_CASE.customContent);
    const authored = registry.listCustom('deities');
    expect(authored.map((entry) => entry.name)).toEqual(['The Dawn Warden', 'The Ash Tyrant']);
    expect(plan.seats.map((seat) => `${seat.saveId}:${seat.type}`)).toEqual([
      'soak-a:SET_PRIMARY_DEITY', 'soak-b:SET_PRIMARY_DEITY', 'soak-b:IMPOSE_CULT', 'soak-c:IMPOSE_CULT',
    ]);
    for (const seat of plan.seats) {
      const raw = authored.find((entry) => mintDeityRef(entry.raw) === seat.deityRef)?.raw;
      expect(raw, `${seat.deityRef} is not the identity mint of an authored deity`).toBeTruthy();
      // The minted identity ref round-trips back to the authored record through its scope.
      expect(registry.resolve(seat.deityRef)?.raw).toBe(raw);
      expect(seat.deityRef.startsWith(`deity:${raw.localUid}:`)).toBe(true);
      const expected = commitDeityEmbed(seat.deityRef, deitySnapshotFrom(raw));
      const config = configOf(saves.find((save) => save.id === seat.saveId));
      if (seat.type === 'SET_PRIMARY_DEITY') {
        expect(config.primaryDeityRef).toBe(seat.deityRef);
        expect(config.primaryDeitySnapshot).toEqual(expected);
      } else {
        expect(config.cultDeitySnapshots).toContainEqual(expected);
      }
    }
  });

  test('the two deities sit on OPPOSED quadrants, and the two patron hosts read a claim-bearing quadrant', () => {
    const { saves, plan } = bearing();
    const host = saves.find((save) => save.id === plan.patronHostId);
    const rival = saves.find((save) => save.id === plan.rivalHostId);
    const patron = configOf(host).primaryDeitySnapshot;
    const opposed = configOf(rival).primaryDeitySnapshot;
    expect([evil01(patron), chaos01(patron)]).toEqual([0, 0]);
    expect([evil01(opposed), chaos01(opposed)]).toEqual([1, 1]);
    const standing = faithStandingBetween(itemOf(host), itemOf(rival));
    expect(standing?.quadrant).toBe('natural_enemy');
    expect(SACRED_CLAIM_TUNING.CLAIM_BY_QUADRANT[standing.quadrant]).toBeGreaterThan(0);
  });

  test('the soak flag resolves: empty is the corpus, the id is the case, anything else is refused by name', () => {
    const { resolveDeityCase, WF0_DEITY_BEARING_CASE, WF0_DEITY_BEARING_CASE_ID } = caseApi();
    expect(WF0_DEITY_BEARING_CASE_ID).toBe('wf0-deity-bearing');
    expect(resolveDeityCase('')).toEqual({ deityCase: null, refusals: [] });
    expect(resolveDeityCase(WF0_DEITY_BEARING_CASE_ID)).toEqual({ deityCase: WF0_DEITY_BEARING_CASE, refusals: [] });
    const refused = resolveDeityCase('wf0-deity-baring');
    expect(refused.deityCase).toBe(null);
    expect(refused.refusals).toHaveLength(1);
    expect(refused.refusals[0]).toMatch(/^REFUSED: --deity-case "wf0-deity-baring"/);
    // Seating never reads a clock: a missing `now` is refused, not defaulted.
    expect(() => caseApi().seatDeityBearingCase(CORPUS, WF0_DEITY_BEARING_CASE, {})).toThrow(/pinned `now`/);
  });
});

// ═════════════════════════════════════════════════════════════════════════════════════════
describe('WF-0 (d) — J1: the affordances on canon (a decree drained at the head) and on a draft (a correction)', () => {
  test('the head drains every seat as a tick-resolved decree, and the draft path commits the identical embeds with no tick', () => {
    const { planDeityBearingSeats, WF0_DEITY_BEARING_CASE } = caseApi();
    const { generated, saves } = bearing();
    const { seats } = planDeityBearingSeats(generated, WF0_DEITY_BEARING_CASE, { now: NOW });
    for (const id of ['soak-a', 'soak-b', 'soak-c']) {
      const mine = seats.filter((seat) => seat.saveId === id);
      const log = saves.find((save) => save.id === id).campaignState.eventLog;
      // CANON: one tick-resolved entry per seat, in plan order — the queued decree at the head.
      expect(log.map((entry) => [entry.event.type, entry.viaTick])).toEqual(mine.map((seat) => [seat.event.type, 0]));
      // DRAFT: the same events as plain corrections through the domain applyEvent.
      let draft = generated.find((save) => save.id === id).settlement;
      for (const seat of mine) {
        const out = applyEvent({ settlement: draft, systemState: null, event: seat.event, now: null });
        expect(out.veto).toBe(null);
        expect(out.logEntry.appliedAt).toBe(null);
        expect(Object.prototype.hasOwnProperty.call(out.logEntry, 'viaTick')).toBe(false);
        draft = out.nextSettlement;
      }
      const canon = configOf(saves.find((save) => save.id === id));
      for (const key of ['primaryDeityRef', 'primaryDeitySnapshot', 'cultDeitySnapshots']) {
        expect(draft.config?.[key], `${id}.${key}: the draft correction and the canon decree disagree`).toEqual(canon[key]);
      }
    }
    // The deity-free member takes no seat on either path.
    expect(seats.map((seat) => seat.saveId)).toContain('soak-a');
    expectAbsentWithAnchor(seats.map((seat) => seat.saveId), 'soak-d', 'soak-c', 'the fourth settlement stays deity-free');
  });
});

// ═════════════════════════════════════════════════════════════════════════════════════════
describe('WF-0 (e) — WF-2\'s preconditions, on drawsPilgrims\' live bar', () => {
  test('the patron host holds a qualifying grand observance with a mapped, reachable neighbour, and the live draw is above zero', () => {
    const { saves, plan } = bearing();
    expect(plan.preconditionsMet).toBe(true);
    expect(plan.patronHostId).toBe('soak-a');
    const digest = buildWholeWorldSoakSpatialCanon(saves).spatialDigest;
    expect(digest, 'the case is not spatially canonized').toBeTruthy();
    const host = saves.find((save) => save.id === plan.patronHostId);
    expect(isMapped(digest, host.id)).toBe(true);
    const reachable = saves
      .filter((save) => save.id !== host.id && isMapped(digest, save.id) && pathCost(digest, host.id, save.id) != null)
      .map((save) => save.id);
    expect(reachable.length).toBeGreaterThanOrEqual(1);
    // The founding set the FIRST LIT TICK mints (the genesis leaf, patron seated), read
    // through the LIVE bar rather than a copy of its dials.
    const qualifying = deriveFoundingTraditions(host.settlement).filter(drawsPilgrims);
    expect(qualifying.length).toBeGreaterThanOrEqual(1);
    for (const rec of qualifying) {
      expect(rec.scaleBand).toBeGreaterThanOrEqual(3);
      expect(['procession', 'offering', 'fair']).toContain(rec.coreMotif.act);
    }
    const settlements = saves.map(itemOf);
    const draw = pilgrimageDraw({ hostId: host.id, hostRec: qualifying[0], settlements, digest });
    expect(draw).toBeGreaterThan(0);
    // anchored: the same host and rec draw above zero on the line above, so this zero is the aspatial arm, not a dead helper
    expect(pilgrimageDraw({ hostId: host.id, hostRec: qualifying[0], settlements, digest: null })).toBe(0);
  });
});

// ═════════════════════════════════════════════════════════════════════════════════════════
describe('WF-0 (f) — one LIVE year through the product advance entry, each realm', () => {
  test('the bearing case OPENS the gate: religionStates for exactly its bearers, the qualifying observance minted, the count still the gate\'s', async () => {
    const { countDeityBearers, buildSubsystemConfiguration } = bearerApi();
    const { saves, plan } = bearing();
    const { worldState, finalSaves } = await liveYear(saves);
    const census = observation.censusWorldStateKeys(worldState);
    // THE OBSERVATION THE FAITH ROWS NAMED AS MISSING: a census over worldState.religionStates.
    expect(census.religionStates).toBe(3);
    expect(Object.keys(worldState.religionStates).sort()).toEqual(['soak-a', 'soak-b', 'soak-c']);
    expect(countDeityBearers(finalSaves)).toBe(finalSaves.filter(gateOpensAlone).length);
    expect(countDeityBearers(finalSaves)).toBe(3);
    // The first lit tick minted the host's founding set from the SEATED settlement, and it
    // carries the grand observance WF-2 needs, on the tick-time ledger itself.
    const minted = getSpatialLedger(worldState, 'traditions')?.[plan.patronHostId] || [];
    expect(minted.filter(drawsPilgrims).length).toBeGreaterThanOrEqual(1);
    const preview = deriveFoundingTraditions(saves.find((save) => save.id === plan.patronHostId).settlement);
    expect(minted.map((rec) => `${rec.id}:${rec.coreMotif.element}:${rec.coreMotif.act}`))
      .toEqual(preview.map((rec) => `${rec.id}:${rec.coreMotif.element}:${rec.coreMotif.act}`));
    expect(buildSubsystemConfiguration({ presetId: 'full_simulation', rules: {}, yearlyCensuses: [census], deityBearers: countDeityBearers(finalSaves) }).deityBearers).toBe(3);
  }, 120_000);

  test('the deity-free corpus stays the ABSENT PRECONDITION: no religion state at all, zero bearers, the section minus the field unchanged', async () => {
    const { countDeityBearers, buildSubsystemConfiguration } = bearerApi();
    const { worldState, finalSaves } = await liveYear(CORPUS);
    const census = observation.censusWorldStateKeys(worldState);
    // Non-vacuity: the world really advanced a lit year (the traditions ledger is censused).
    expect(census['spatialLedgers.traditions']).toBe(4);
    // anchored: the census above is live and carries the lit traditions ledger, so the absent religionStates key is the shut gate, not an empty census
    expect(Object.keys(census)).not.toContain('religionStates');
    expect(countDeityBearers(finalSaves)).toBe(0);
    const unmeasured = buildSubsystemConfiguration({ presetId: 'full_simulation', rules: {}, yearlyCensuses: [census] });
    const measured = buildSubsystemConfiguration({ presetId: 'full_simulation', rules: {}, yearlyCensuses: [census], deityBearers: countDeityBearers(finalSaves) });
    const { deityBearers, ...minusField } = measured;
    expect(deityBearers).toBe(0);
    expect(sha256(minusField)).toBe(sha256(unmeasured));
  }, 120_000);
});

// ═════════════════════════════════════════════════════════════════════════════════════════
describe('WF-0 (g) — the soak writes it (source-checked: importing the soak runs one, §145.2)', () => {
  test('the receipt composes the count over run A\'s final saves, the case is named only when named, and the corpus above is the soak\'s own', () => {
    const soak = source(SOAK);
    expect(soak).toContain("import { resolveDeityCase, seatDeityBearingCase } from './whole-world-soak-deity-fixture.mjs';");
    expect(soak).toContain('deityBearers: countDeityBearers(runA.finalSaves),');
    expect(soak).toContain('finalSaves: runningSaves,');
    expect(soak).toContain("const DEITY_CASE_ID = String(arg('deity-case', ''));");
    expect(soak).toContain('...deityCaseResolution.refusals,');
    expect(soak).toContain('customContent: DEITY_CASE ? DEITY_CASE.customContent : {}');
    expect(soak).toContain('seatDeityBearingCase(generated, DEITY_CASE, { now: NOW })');
    expect(soak).toContain('...(runA.deityCasePlan ? { deityCase: runA.deityCasePlan } : {}),');
    // The corpus this file generates is the soak's: its archetypes, ids, default seed and clock.
    for (const archetype of REGION_ARCHETYPES) {
      const line = `{ settType: '${archetype.settType}', culture: '${archetype.culture}', terrain: '${archetype.terrain}', tradeRouteAccess: '${archetype.tradeRouteAccess}' },`;
      expect(soak, `the soak's region no longer carries ${line}`).toContain(line);
    }
    expect(soak).toContain("const SEQ_IDS = ['soak-a', 'soak-b', 'soak-c', 'soak-d'];");
    expect(soak).toContain("const SEED = String(arg('seed', 'w0-soak'));");
    expect(soak).toContain(`const NOW = '${NOW}';`);
  });
});
