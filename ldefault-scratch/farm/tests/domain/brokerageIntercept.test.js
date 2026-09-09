/**
 * brokerageIntercept.test.js — [FP IN-0b] THE INTERCEPT CONSUMER.
 *
 * WHAT CHANGED, AND WHY IT NEEDED PINS AT ALL. `brokerage_intercept` shipped at I3/I4 as
 * NARRATION: it minted a headline and four metadata ids and constructed no claim, so the
 * one act in the estate whose whole subject is a stolen READ produced nothing that could be
 * read back. IN-0b makes it a real information movement — the rival composes claims out of
 * records that already exist, through the module's ONE claim constructor, fogged by the host
 * settlement's own HIDE posture.
 *
 * THE PINS, each with an executed control:
 *   1. THE CONSTRUCTOR IS STILL SINGULAR — a source scan over src/, not a promise.
 *   2. THE SOURCES ARE CLOSED AND HONEST — the query still admits exactly {belief, truth};
 *      the intercept admits exactly {record}; every claim resolves to a live address, with
 *      the record removed as the control.
 *   3. THE EMPTY-OUTBOUND REFUSAL, with its SEEDED-POSITIVE TWIN. An absence pin on an
 *      empty harness proves nothing, so the identical call with the record seeded is
 *      asserted to READ in the same test.
 *   4. THE FOG COMPOSES — a HIDE court yields a DEGRADED read or a REFUSAL, both arms
 *      reached from real secrecy levels.
 *   5. NO DEAD BAND — all four rungs are reached by a swept secrecy level. (The recorded
 *      dead-band class: a ladder whose top rung no input can reach is a ladder with three
 *      rungs and a lie.)
 *   6. THE REFUSAL VOCABULARY IS UNCHANGED — QUERY_REFUSALS is still exactly its five
 *      tokens and the intercept borrowed one rather than minting a sixth.
 *   7. THE MINTED CONSTANT IS INDEPENDENT — FOG_SECRECY_W is pinned DISTINCT from both HIDE
 *      constants it could have been mistaken for. See the note on pin 7 itself.
 *   8. REGISTRATION IS COMPLETE — all four acts route EXPLICITLY, with an unregistered
 *      token as the live control proving the predicate discriminates.
 *   9. TOTALITY — both new tables are total over the ladder, in both directions.
 *  10. DORMANCY — a dark flag yields no intercept at all, against a lit liveness anchor.
 *  11. LIFECYCLE — the claims survive the JSON round trip the candidate metadata takes.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  CLAIM_SOURCES,
  INTERCEPT_ENDINGS,
  INTERCEPT_FOG_TUNING,
  INTERCEPT_LEGIBLE_SOURCES,
  INTERCEPT_SOURCES,
  INTERCEPT_VAGUENESS_BANDS,
  QUERY_REFUSALS,
  answerBrokerageQuery,
  interceptOutboundRecord,
  interceptVagueness,
  localSecrecyLevel01,
} from '../../src/domain/worldPulse/brokerageServices.js';
import {
  BROKERAGE_ACTS,
  INTERCEPT_BAND_REASONS,
  evaluateBrokerageServiceRules,
} from '../../src/domain/worldPulse/brokerageServicesRules.js';
import { patronFeedEdges } from '../../src/domain/worldPulse/brokerageServicesFeed.js';
import { SIGHT_TUNING } from '../../src/domain/worldPulse/informationStatecraft.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import { isExplicitlyRouted, SECTION_OF } from '../../src/domain/realm/heraldRouting.js';
import { codeOnly } from '../lint/engineGatedRuleKeys.walker.test.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// ── The fixture, borrowed in shape from brokerageServices.test.js ────────────────

const EXCHANGE = Object.freeze({
  name: "Chroniclers' exchange",
  tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed'],
});
const FACTIONS = Object.freeze([
  { name: 'The Grey Council', category: 'government', power: 60, isGoverning: true },
  { name: 'Ashwater Syndicate', category: 'criminal', power: 40 },
  // The intercept needs a RIVAL eligible to keep the same kind of house.
  { name: 'Coin Guild', category: 'merchant', power: 30 },
]);

/** @param {string} id */
function itemOf(id) {
  return {
    id,
    settlement: {
      name: id,
      tier: 'city',
      institutions: [{ ...EXCHANGE }],
      factions: FACTIONS.map((f) => ({ ...f })),
      powerStructure: { factions: FACTIONS.map((f) => ({ ...f })) },
    },
  };
}

const LIT_RULES = Object.freeze({
  infoMode: 'unreliable', infoStatecraftEnabled: true, informationBrokeragesEnabled: true,
});
const DARK_RULES = Object.freeze({ infoMode: 'unreliable', infoStatecraftEnabled: true });

/** @param {number} band @param {string} label */
function belief(band, label) {
  return {
    readiness: 0.1, strengthBand: band, allianceLabel: label,
    faithLabel: 'secular', confidence01: 0.2, lastUpdateTick: 0,
  };
}

/**
 * @param {Record<string, unknown>} rules
 * @param {{ secrecy01?: number, intel?: boolean, plant?: boolean }} [seed]
 */
function worldOf(rules, seed = {}) {
  /** @type {Record<string, unknown>} */
  const ledgers = {
    beliefMaps: {
      aaa: {
        [GOVERNING_SEAT_KEY]: { bbb: belief(0, 'friendly') },
        criminal: { bbb: belief(0, 'friendly') },
      },
    },
  };
  if (typeof seed.secrecy01 === 'number') {
    ledgers.secrecyPostures = { aaa: { level01: seed.secrecy01, enteredTick: 1 } };
  }
  if (seed.intel) {
    // D-3's own key shape: intel.<seller>.<receiver>.<subject>.<tick>.
    ledgers.intelTransfers = {
      'intel.aaa.bbb.ccc.4': { sellerId: 'aaa', subjectId: 'ccc', depositTick: 4, mode: 'sale' },
    };
  }
  if (seed.plant) {
    ledgers.disinfo = { 'plant:aaa:bbb:ccc': { key: 'plant:aaa:bbb:ccc', seededTick: 4 } };
  }
  return {
    tick: 5,
    spatialCanonVersion: 1,
    simulationRules: rules,
    relationshipStates: {},
    factionStates: {
      'aaa:the_grey_council': {
        factionId: 'aaa:the_grey_council', settlementId: 'aaa', name: 'The Grey Council',
        archetype: 'civic', momentum: 0.9, exhaustion: 0.1, controlledInstitutions: [],
      },
      'aaa:ashwater_syndicate': {
        factionId: 'aaa:ashwater_syndicate', settlementId: 'aaa', name: 'Ashwater Syndicate',
        archetype: 'criminal', momentum: 0.9, exhaustion: 0.1, controlledInstitutions: [],
      },
      'aaa:coin_guild': {
        factionId: 'aaa:coin_guild', settlementId: 'aaa', name: 'Coin Guild',
        archetype: 'merchant', momentum: 0.9, exhaustion: 0.1, controlledInstitutions: [],
      },
    },
    spatialLedgers: ledgers,
  };
}

/** The real feed edge the producer itself would hand the intercept. */
function realEdge(world) {
  const edges = patronFeedEdges({ worldState: world, item: itemOf('aaa') });
  expect(edges.length).toBeGreaterThan(0); // the fixture is live, not an empty harness
  return edges[0];
}

// ── 1. THE CONSTRUCTOR IS STILL SINGULAR ─────────────────────────────────────────

/** Every .js under src/, repo-relative. */
function srcModules(dir = join(ROOT, 'src'), out = /** @type {string[]} */ ([])) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) srcModules(p, out);
    else if (p.endsWith('.js') || p.endsWith('.jsx')) out.push(relative(ROOT, p).replace(/\\/g, '/'));
  }
  return out;
}

describe('IN-0b — a claim still has exactly one constructor', () => {
  test('claimFrom is declared once, exported nowhere, and named in no other module', () => {
    const modules = srcModules();
    expect(modules.length).toBeGreaterThan(200); // the scan is live, not an empty walk

    const HOME = 'src/domain/worldPulse/brokerageServices.js';
    const home = readFileSync(join(ROOT, HOME), 'utf8');
    // Exactly one DECLARATION, and it is not exported — an exported constructor would let
    // any module mint a claim, which is precisely the property this module's law forbids.
    expect(home.match(/function claimFrom\(/g)).toHaveLength(1);
    expect(home).not.toMatch(/export\s+function\s+claimFrom/);
    expect(home).not.toMatch(/export\s*\{[^}]*\bclaimFrom\b/);

    // NO OTHER module so much as names it. The home is excluded and asserted separately
    // above, so this is a real absence over a non-empty remainder.
    const others = modules.filter((rel) => rel !== HOME);
    expect(others.length).toBeGreaterThan(200);
    const offenders = others.filter((rel) => readFileSync(join(ROOT, rel), 'utf8').includes('claimFrom'));
    expect(offenders).toEqual([]);

    // LIVE CONTROL for that absence: the scan DOES find the token in the home file, so an
    // `includes` that had silently stopped matching would be caught here.
    expect(home).toContain('claimFrom');
  });
});

// ── 2. THE SOURCES ARE CLOSED AND HONEST ─────────────────────────────────────────

describe('IN-0b — the claim sources are closed, and each one resolves', () => {
  test('the QUERY still admits exactly belief and truth (the I3 law, unmoved)', () => {
    const world = worldOf(LIT_RULES);
    const result = answerBrokerageQuery({
      worldState: world, item: itemOf('aaa'), subjectId: 'bbb', channel: 'war',
      patronId: 'aaa:the_grey_council', tick: 5, delayTicks: 0,
    });
    expect(result.refused).toBe(false);
    expect(result.answer.claims.length).toBeGreaterThan(0);
    for (const claim of result.answer.claims) expect(['belief', 'truth']).toContain(claim.from);
    // Widening CLAIM_SOURCES must never widen the QUERY: 'record' is admissible in the
    // module and inadmissible in an answer, and this is what says so.
    expect(result.answer.claims.map((c) => c.from)).not.toContain('record');
  });

  test('the INTERCEPT admits exactly record, and every ref resolves into a live ledger', () => {
    const world = worldOf(LIT_RULES, { intel: true, plant: true });
    const taken = interceptOutboundRecord({ worldState: world, hostId: 'aaa', edge: realEdge(world) });

    expect(taken.refused).toBe(false);
    expect(taken.ending).toBe('read');
    expect(INTERCEPT_ENDINGS).toContain(taken.ending);
    expect(taken.claims.length).toBe(3); // all three sources legible at zero secrecy
    for (const claim of taken.claims) {
      expect(claim.from).toBe('record');
      expect(CLAIM_SOURCES).toContain(claim.from);
      expect(typeof claim.ref).toBe('string');
      expect(claim.ref.length).toBeGreaterThan(0);
    }

    // EVERY claim names a record that is actually there. Addresses are resolved by their
    // own shape rather than by re-running the producer, so this cannot mirror the deriver.
    const byAxis = new Map(taken.claims.map((c) => [c.axis, c]));
    expect([...byAxis.keys()].sort()).toEqual(['commissions', 'feedChannels', 'intelTransfers']);
    expect(byAxis.get('feedChannels').ref).toContain('patronFeedEdges.aaa.');
    expect(byAxis.get('intelTransfers').ref).toBe('spatialLedgers.intelTransfers[sellerId=aaa]');
    expect(byAxis.get('commissions').ref).toBe('spatialLedgers.disinfo[plant:aaa:*]');
    expect(Object.keys(world.spatialLedgers.intelTransfers)
      .filter((k) => world.spatialLedgers.intelTransfers[k].sellerId === 'aaa'))
      .toHaveLength(byAxis.get('intelTransfers').value);
    expect(Object.keys(world.spatialLedgers.disinfo).filter((k) => k.startsWith('plant:aaa:')))
      .toHaveLength(byAxis.get('commissions').value);

    // THE CONTROL: remove the two seeded records and those two claims are GONE, while the
    // contract claim — which reads a derived edge, not a ledger — survives. Without this
    // the resolutions above could be reading constants.
    const stripped = interceptOutboundRecord({
      worldState: worldOf(LIT_RULES), hostId: 'aaa', edge: realEdge(worldOf(LIT_RULES)),
    });
    expect(stripped.claims.map((c) => c.axis)).toEqual(['feedChannels']);
  });
});

// ── 3. THE EMPTY-OUTBOUND REFUSAL, AND ITS SEEDED-POSITIVE TWIN ──────────────────

describe('IN-0b — an intercept that made out nothing refuses honestly', () => {
  test('EMPTY OUTBOUND ⇒ no_record refusal; the SAME call with the record seeded READS', () => {
    const world = worldOf(LIT_RULES);

    // THE ABSENCE. A house whose contract carries no channel, in a town that couriered
    // nothing out and commissioned nothing: there is genuinely nothing to overhear.
    const empty = interceptOutboundRecord({
      worldState: world, hostId: 'aaa', edge: { institutionId: 'inst.aaa.1', pullByChannel: {} },
    });
    expect(empty.refused).toBe(true);
    expect(empty.ending).toBe('refused');
    expect(empty.claims).toEqual([]);
    expect(empty.refusal.reason).toBe('no_record');

    // THE SEEDED-POSITIVE TWIN, and it is the whole point of the pin above. The same
    // function, the same world, the same host — only the outbound record is real — and it
    // READS. An absence measured on a harness that could not have produced a presence is
    // worth nothing, and this is what stops that here.
    const seeded = interceptOutboundRecord({ worldState: world, hostId: 'aaa', edge: realEdge(world) });
    expect(seeded.refused).toBe(false);
    expect(seeded.claims.length).toBeGreaterThan(0);
    expect(seeded.band).toBe(empty.band); // the fog is identical; only the record differs
  });

  test('a refusal is NOT an event — the producer mints no candidate for one', () => {
    // Full fog refuses the read, and the act then falls silent rather than narrating a
    // failure. (The query arm has carried this law since I3; the intercept now shares it.)
    const sealed = worldOf(LIT_RULES, { secrecy01: 1 });
    const mintedUnderFog = [];
    for (let tick = 0; tick < 8; tick += 1) {
      for (const c of evaluateBrokerageServiceRules({ worldState: sealed, settlements: [itemOf('aaa')], byId: new Map() }, null, { tick })) {
        if (c.candidateType === 'brokerage_intercept') mintedUnderFog.push(c);
      }
    }
    expect(mintedUnderFog).toEqual([]);

    // LIVENESS ANCHOR: the identical sweep with the gates DOWN does mint the act, so the
    // empty above is the fog's doing and not a fixture that never intercepts.
    const open = worldOf(LIT_RULES);
    const mintedOpen = [];
    for (let tick = 0; tick < 8; tick += 1) {
      for (const c of evaluateBrokerageServiceRules({ worldState: open, settlements: [itemOf('aaa')], byId: new Map() }, null, { tick })) {
        if (c.candidateType === 'brokerage_intercept') mintedOpen.push(c);
      }
    }
    expect(mintedOpen.length).toBeGreaterThan(0);
  });
});

// ── 4 + 5. THE FOG COMPOSES, AND NO BAND IS DEAD ────────────────────────────────

describe('IN-0b — HIDE fogs the intercept', () => {
  test('a HIDE court yields a DEGRADED read or a REFUSAL, and both arms are reached', () => {
    const edgeOf = (w) => realEdge(w);

    // Gates down: the whole record is legible.
    const open = worldOf(LIT_RULES, { intel: true, plant: true });
    const clear = interceptOutboundRecord({ worldState: open, hostId: 'aaa', edge: edgeOf(open) });
    expect(clear.band).toBe('legible');
    expect(clear.claims).toHaveLength(3);

    // DEGRADED ARM: gates part-raised. Strictly fewer sources survive, and the act still
    // happens — the rival gets less, not nothing.
    const guarded = worldOf(LIT_RULES, { secrecy01: 0.6, intel: true, plant: true });
    const degraded = interceptOutboundRecord({ worldState: guarded, hostId: 'aaa', edge: edgeOf(guarded) });
    expect(degraded.refused).toBe(false);
    expect(degraded.claims.length).toBeLessThan(clear.claims.length);
    expect(degraded.claims.length).toBeGreaterThan(0);

    // REFUSED ARM: gates fully up on the SAME seeded records.
    const sealed = worldOf(LIT_RULES, { secrecy01: 1, intel: true, plant: true });
    const refused = interceptOutboundRecord({ worldState: sealed, hostId: 'aaa', edge: edgeOf(sealed) });
    expect(refused.refused).toBe(true);
    expect(refused.band).toBe('opaque');

    // The three outcomes came from ONE differing input. Anything else about the worlds is
    // identical, so the fog is what moved them.
    expect(localSecrecyLevel01(open, 'aaa')).toBe(0);
    expect(localSecrecyLevel01(sealed, 'aaa')).toBe(1);
  });

  test('NO DEAD BAND — every rung of the ladder is reached by a real secrecy level', () => {
    // The recorded dead-band class: a ladder rung no input can reach is a lie in a frozen
    // array. Swept finely enough that a band narrower than the step cannot hide.
    const reached = new Set();
    for (let i = 0; i <= 1000; i += 1) reached.add(interceptVagueness(i / 1000).band);
    expect([...reached].sort()).toEqual([...INTERCEPT_VAGUENESS_BANDS].sort());

    // And the ladder is MONOTONE in secrecy: more gates never makes a watcher see more.
    let last = -1;
    for (let i = 0; i <= 1000; i += 1) {
      const rank = INTERCEPT_VAGUENESS_BANDS.indexOf(interceptVagueness(i / 1000).band);
      expect(rank).toBeGreaterThanOrEqual(last);
      last = rank;
    }

    // TOTAL: an unreadable level is no secrecy, never opaque (fail toward the open gate).
    for (const junk of [undefined, null, NaN, 'lots', {}]) {
      expect(interceptVagueness(junk).band).toBe('legible');
    }
  });
});

// ── 6. THE REFUSAL VOCABULARY IS UNCHANGED ──────────────────────────────────────

describe('IN-0b — the closed vocabularies did not grow', () => {
  test('QUERY_REFUSALS is still EXACTLY its five tokens, and the intercept borrowed one', () => {
    // Asserted by VALUE and by LENGTH, in order. A sixth refusal would be a second word
    // for an idea the module already has, and the whole value of a closed vocabulary is
    // that a reader can enumerate it.
    expect([...QUERY_REFUSALS]).toEqual([
      'dormant', 'no_house', 'channel_declined', 'cannot_pay', 'no_record',
    ]);
    expect(QUERY_REFUSALS).toHaveLength(5);

    const world = worldOf(LIT_RULES);
    const empty = interceptOutboundRecord({
      worldState: world, hostId: 'aaa', edge: { institutionId: 'i', pullByChannel: {} },
    });
    expect(QUERY_REFUSALS).toContain(empty.refusal.reason);
  });

  test('the endings this act can reach today are exactly {read, refused}', () => {
    // `caught` is IN-3's sweep and is DECLARED cross-wave, not built. Pinning the set
    // closed here is what makes IN-3's widening a deliberate act rather than a drift.
    expect([...INTERCEPT_ENDINGS]).toEqual(['read', 'refused']);
    const world = worldOf(LIT_RULES);
    const seen = new Set([
      interceptOutboundRecord({ worldState: world, hostId: 'aaa', edge: realEdge(world) }).ending,
      interceptOutboundRecord({
        worldState: worldOf(LIT_RULES, { secrecy01: 1 }), hostId: 'aaa', edge: realEdge(world),
      }).ending,
    ]);
    expect([...seen].sort()).toEqual(['read', 'refused']);
  });
});

// ── 7. THE MINTED CONSTANT IS INDEPENDENT ───────────────────────────────────────

describe('IN-0b — the fog factor is a mint, not a borrowed lookalike', () => {
  test('FOG_SECRECY_W is DISTINCT from both HIDE constants it could be confused with', () => {
    // ⚠ THE REASON THIS PIN EXISTS. IN-0b was specified to wire "HIDE's -0.7 rivals'-reads
    // factor", and VERIFY-AT-BUILD found no such constant: SIGHT_TUNING.HIDE_STALENESS is a
    // belief-DECAY rate and HIDE_WEAKNESS_W is a weight inside the concealment PRESSURE that
    // opens a posture. Both happen to be 0.7. Binding the intercept to either because the
    // number matched would have made a coincidence into a coupling — a later soak retuning
    // belief decay would silently retune what a spy can read. This asserts they stayed
    // separate numbers, so that fusing them later has to be done on purpose.
    expect(SIGHT_TUNING.HIDE_STALENESS).toBe(0.7);
    expect(SIGHT_TUNING.HIDE_WEAKNESS_W).toBe(0.7);
    expect(INTERCEPT_FOG_TUNING.FOG_SECRECY_W).not.toBe(SIGHT_TUNING.HIDE_STALENESS);
    expect(INTERCEPT_FOG_TUNING.FOG_SECRECY_W).not.toBe(SIGHT_TUNING.HIDE_WEAKNESS_W);

    // The intercept's own module must not read the statecraft tuning table at all: the
    // independence above is worthless if the fog is composed from it by another route.
    //
    // SCANNED OVER CODE ONLY, through the engine-gated-key walker's own comment/string
    // blanker rather than a second regex. The module header NAMES both constants in prose
    // — that is the whole record of why they were not borrowed — and a raw text scan would
    // therefore red on its own documentation and push a later reader to delete the
    // explanation to green the pin. A gate written in prose is not a gate; neither is a
    // warning written in prose a read.
    const home = codeOnly(readFileSync(join(ROOT, 'src/domain/worldPulse/brokerageServices.js'), 'utf8'));
    expect(home).not.toMatch(/import[^;]*informationStatecraft\.js/);
    expect(home).not.toContain('HIDE_STALENESS');
    expect(home).not.toContain('SIGHT_TUNING');

    // LIVE CONTROL for the blanker: it must still be able to SEE code. If `codeOnly` ever
    // blanked everything, the three absences above would pass having proved nothing.
    expect(home).toContain('FOG_SECRECY_W');
    expect(home).toContain('interceptOutboundRecord');
  });
});

// ── 8. REGISTRATION ─────────────────────────────────────────────────────────────

describe('IN-0b — registration is complete for the acts this wave makes real', () => {
  test('all four brokerage acts route EXPLICITLY, not through the catch-all', () => {
    // I3/I4 measured this one-line registration as owed and deferred it because
    // heraldRouting.js belonged to a concurrent session that wave. IN-0b makes it. The
    // SECTION is unchanged — what changed is that it is a decision instead of a fall-through.
    for (const act of BROKERAGE_ACTS) {
      expect(isExplicitlyRouted(act)).toBe(true);
      expect(SECTION_OF(act)).toBe('events');
    }

    // THE LIVE CONTROL, and it is what makes the assertion above non-vacuous: an
    // UNREGISTERED token still LANDS on 'events' through the declared catch-all, so
    // asserting the section alone would have passed with no registration at all. Only
    // `isExplicitlyRouted` can tell the two apart, and here it does.
    expect(SECTION_OF('brokerless_thing')).toBe('events');
    expect(isExplicitlyRouted('brokerless_thing')).toBe(false);
  });
});

// ── 9. TOTALITY ─────────────────────────────────────────────────────────────────

describe('IN-0b — the new tables are total over the ladder, both directions', () => {
  test('legible-source and reason tables cover every band and no band more', () => {
    expect(Object.keys(INTERCEPT_LEGIBLE_SOURCES).sort())
      .toEqual([...INTERCEPT_VAGUENESS_BANDS].sort());
    expect(Object.keys(INTERCEPT_BAND_REASONS).sort())
      .toEqual([...INTERCEPT_VAGUENESS_BANDS].sort());

    for (const band of INTERCEPT_VAGUENESS_BANDS) {
      for (const source of INTERCEPT_LEGIBLE_SOURCES[band]) {
        expect(INTERCEPT_SOURCES).toContain(source);
      }
      const reason = INTERCEPT_BAND_REASONS[band];
      expect(typeof reason).toBe('string');
      expect(reason.length).toBeGreaterThan(0);
      expect(reason).not.toMatch(/_/); // prose, never a raw slug
      // The band word itself never appears in the sentence: the surface reads the prose,
      // never the token (the legibility law).
      expect(reason.toLowerCase()).not.toContain(band);
    }

    // The ladder strips sources MONOTONICALLY — a foggier band never reveals more.
    let last = Infinity;
    for (const band of INTERCEPT_VAGUENESS_BANDS) {
      const n = INTERCEPT_LEGIBLE_SOURCES[band].length;
      expect(n).toBeLessThanOrEqual(last);
      last = n;
    }
    expect(INTERCEPT_LEGIBLE_SOURCES.opaque).toEqual([]);
  });
});

// ── 10 + 11. DORMANCY AND LIFECYCLE ─────────────────────────────────────────────

describe('IN-0b — dormancy and the metadata lifecycle', () => {
  test('DORMANCY — a dark flag yields no intercept, against a lit liveness anchor', () => {
    const snap = (rules) => ({
      worldState: worldOf(rules, { intel: true, plant: true }),
      settlements: [itemOf('aaa')],
      byId: new Map(),
    });
    for (let tick = 0; tick < 8; tick += 1) {
      expect(evaluateBrokerageServiceRules(snap(DARK_RULES), null, { tick })).toEqual([]);
    }
    // The same ticks LIT produce acts, so the empties above are the flag's doing.
    const lit = [];
    for (let tick = 0; tick < 8; tick += 1) {
      lit.push(...evaluateBrokerageServiceRules(snap(LIT_RULES), null, { tick }));
    }
    expect(lit.length).toBeGreaterThan(0);

    // And the read itself is inert on a dark world: no posture ledger ⇒ no secrecy.
    expect(localSecrecyLevel01(worldOf(DARK_RULES), 'aaa')).toBe(0);
  });

  test('LIFECYCLE — the claims survive the JSON round trip candidate metadata takes', () => {
    // Candidate metadata is carried through the apply lane and the history compactor as
    // JSON (IN-0a measured that retention for `metadata.plant`). A claim that cannot make
    // that trip intact is a claim the DM never sees, so it is measured rather than assumed.
    const world = worldOf(LIT_RULES, { intel: true, plant: true });
    const minted = [];
    for (let tick = 0; tick < 8; tick += 1) {
      for (const c of evaluateBrokerageServiceRules({ worldState: world, settlements: [itemOf('aaa')], byId: new Map() }, null, { tick })) {
        if (c.candidateType === 'brokerage_intercept') minted.push(c);
      }
    }
    expect(minted.length).toBeGreaterThan(0);

    const candidate = minted[0];
    expect(candidate.metadata.vagueness).toBe('legible');
    expect(candidate.metadata.ending).toBe('read');
    expect(candidate.metadata.claims.length).toBe(3);

    const roundTripped = JSON.parse(JSON.stringify(candidate));
    expect(roundTripped.metadata).toEqual(JSON.parse(JSON.stringify(candidate.metadata)));
    expect(roundTripped.metadata.claims).toHaveLength(3);
    for (const claim of roundTripped.metadata.claims) {
      expect(claim.from).toBe('record');
      expect(typeof claim.ref).toBe('string');
      expect(claim.ref.length).toBeGreaterThan(0);
    }
    // The reason sentence the band selected is the one the table holds for it.
    expect(candidate.reasons).toContain(INTERCEPT_BAND_REASONS.legible);
  });
});
