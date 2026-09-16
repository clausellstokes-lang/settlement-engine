/**
 * tests/lib/instantWorld/mundaneRealmAcceptance.test.js — MG-4, THE MEASURE
 * (docs/DESIGN_REALM_MAGIC_TOGGLE §4).
 *
 * MG-2 pinned that the realm's answer is PROJECTED into every member's config. This file
 * asks the question one level up, the only one that matters to a DM: after that projection
 * has run through the whole generator, IS THE REALM ACTUALLY MUNDANE? The per-settlement
 * dead-magic suite (tests/generators/deadMagicLeaks.test.js) owns one settlement; MG-3
 * closed the leaks one at a time. This is the realm-scope acceptance harness that holds
 * all of it at once, on a fixed seed, across every member.
 *
 * FOUR MEASURES, per the design:
 *   1. THE MUNDANE-REALM PIN — every world_law_magic certification row green; zero arcane
 *      institutions, factions and services by the canonical census vocabulary; zero
 *      magical/wild_magic history events; zero teleport edges; magicProfile all-absent for
 *      every member.
 *   2. THE TWIN-WORLD ENVELOPE (MG-LAW-3) — a mundane realm is not a THINNER realm. Same
 *      seed, magic flipped: member, institution, service and faction counts land within a
 *      tolerance band. ⚠️ THE BANDS BELOW ARE PENDING — see PENDING_BANDS.
 *   3. THE PULSE PIN — advancing the mundane realm mints no magic_* stressor births.
 *   4. A CONTROL PER PIN. Every absence assertion here is paired with a positive control
 *      on the SAME harness that produces the thing being denied. An acceptance suite that
 *      can pass against an empty world is worse than no acceptance suite: it certifies.
 *
 * The censuses read the canonical detector (domain/arcaneIdentity, MG-3h / R-BLD-5) rather
 * than re-spelling "is this arcane?" a sixth time — which is the whole point of MG-3h.
 *
 * ── WHAT THIS HARNESS PROVABLY CATCHES (executed mutant controls, 2026-08-03) ──────────
 * Each closure was reverted individually in source and this file re-run:
 *   • MG-2's projection stamp deleted outright ................... 9 of 20 red
 *   • the projection's WORLD-FACT half dropped (dial-only stamp) .. 9 of 20 red
 *   • MG-3a's teleport world-law gate un-gated ................... 1 red (the teleport pin)
 *   • magicProfile's dead-magic envelope un-gated ................ 1 red (the profile pin)
 *
 * ── WHAT IT DOES NOT CATCH, AND WHY EACH IS NOT A HOLE ─────────────────────────────────
 *   • The projection's DIAL half dropped (`magicExists:false` stamped alone): 0 red, and
 *     correctly so. resolveConfig derives the effective dial from the world fact
 *     (resolveConfig.js:79), so the second field is the per-settlement UI's coupling
 *     rather than a load-bearing gate. The coupling itself is pinned by MG-2's own suite,
 *     not here.
 *   • magicFilter's arcane strip disabled: 0 red. Arcane content is suppressed by TWO
 *     independent mechanisms (the catalog strip and the zeroed dial inside
 *     institutionProbability), so removing either one alone still yields a mundane realm.
 *     Defense in depth, not coverage — but it does mean this file cannot attribute a
 *     content leak to one of those two.
 *   • MG-3h's L11 direct world-fact gate removed: 0 red, and that is the DESIGNED result —
 *     MG-3h pins that gate as a no-op on the resolved path, which is why it moves no
 *     same-seed golden. Its catching power lives in tests/domain/arcaneIdentity.test.js,
 *     which drives getBaseChance with an UNRESOLVED config; the composer never produces one.
 */

import { describe, test, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { composeInstantWorld } from '../../../src/lib/instantWorld/composeInstantWorld.js';
import { buildGenerationCoherenceReceipt } from '../../../src/generators/generationCoherence.js';
import { deriveMagicProfile } from '../../../src/domain/magicProfile.js';
import { isArcaneFaction } from '../../../src/domain/arcaneIdentity.js';
import { isArcaneInstitution } from '../../../src/domain/arcaneInstitutionIdentity.js';
import { buildTeleportEdges } from '../../../src/domain/spatial/teleportEdges.js';
import { evaluateStressorRules, normalizeStressor } from '../../../src/domain/worldPulse/stressors.js';
import { pressureIndex } from '../../../src/domain/worldPulse/index.js';
import { realmMagicIsMundane } from '../../../src/domain/worldPulse/simulationRules.js';

// ── The realm under test ───────────────────────────────────────────────────

const SEED = 'mg4-acceptance';
const KNOBS = { realmSize: 'small', tone: 'realistic_regional', mapKind: 'highIsland' };

function build(magic) {
  let n = 0;
  return composeInstantWorld({
    seed: SEED,
    basicConfig: { ...KNOBS, magic },
    idFactory: () => `id-${n++}`,
    clock: () => '2026-07-16T00:00:00.000Z',
  });
}

/** The composed member is a SAVE ENTRY; the generated settlement is nested inside it. */
const membersOf = (realm) => realm.settlements.map((entry) => entry.settlement);

const MUNDANE = build('no');
const MAGICAL = build('yes');

// ── The census vocabulary (MG-3h's canonical detector, never a sixth regex) ──

const MAGIC_HISTORY_TYPES = ['magical', 'magical_controversy', 'wild_magic'];

/** @param {any} settlement */
function arcaneInstitutions(settlement) {
  return (settlement.institutions || []).filter((i) => isArcaneInstitution(i));
}

/** @param {any} settlement */
function arcaneFactions(settlement) {
  const rows = settlement.powerStructure?.factions || settlement.factions || [];
  return rows.filter((f) => isArcaneFaction(f));
}

/** availableServices is category → [{ name, institution }]. Both fields can carry it. */
function arcaneServices(settlement) {
  const out = [];
  for (const rows of Object.values(settlement.availableServices || {})) {
    for (const row of (rows || [])) {
      if (isArcaneInstitution(row?.institution) || isArcaneInstitution(row?.name)) out.push(row);
    }
  }
  return out;
}

/** @param {any} settlement */
function magicalHistoryEvents(settlement) {
  const events = settlement.history?.historicalEvents || [];
  return events.filter((e) => MAGIC_HISTORY_TYPES.includes(e?.type));
}

/** Every count the twin-world envelope compares, for one realm. */
function realmCensus(realm) {
  const members = membersOf(realm);
  const tally = { members: members.length, institutions: 0, factions: 0, services: 0, historyEvents: 0 };
  for (const s of members) {
    tally.institutions += (s.institutions || []).length;
    tally.factions += (s.powerStructure?.factions || s.factions || []).length;
    for (const rows of Object.values(s.availableServices || {})) tally.services += (rows || []).length;
    tally.historyEvents += (s.history?.historicalEvents || []).length;
  }
  return tally;
}

// ── 1. THE MUNDANE-REALM PIN ───────────────────────────────────────────────

describe('MG-4.1 — the mundane realm, measured across every member', () => {
  test('the harness built a real realm (this suite cannot pass on an empty world)', () => {
    const members = membersOf(MUNDANE);
    expect(members.length).toBeGreaterThan(1);
    const census = realmCensus(MUNDANE);
    expect(census.institutions).toBeGreaterThan(20);
    expect(census.factions).toBeGreaterThan(2);
    expect(census.services).toBeGreaterThan(2);
    expect(census.historyEvents).toBeGreaterThan(2);
    // …and the realm actually recorded the answer it was asked.
    expect(realmMagicIsMundane(MUNDANE.campaign.worldState.simulationRules)).toBe(true);
    expect(realmMagicIsMundane(MAGICAL.campaign.worldState.simulationRules)).toBe(false);
  });

  test('every member is minted magic-off, both fields together', () => {
    for (const s of membersOf(MUNDANE)) {
      expect(s.config.magicExists).toBe(false);
      expect(s.config.priorityMagic).toBe(0);
      // The RAW config a full regen replays carries it too, or the projection
      // evaporates on the next rebuild.
      expect(s._config.magicExists).toBe(false);
    }
  });

  test('every world_law_magic certification row is green', () => {
    const rows = membersOf(MUNDANE).map((s) => {
      const receipt = buildGenerationCoherenceReceipt(s, { seed: s._seed });
      return receipt.checks.find((c) => c.id === 'world_law_magic');
    });
    expect(rows.length).toBe(membersOf(MUNDANE).length);
    for (const row of rows) {
      expect(row, 'every member must CARRY the row, not merely not-fail it').toBeTruthy();
      expect(row.status).toBe('pass');
    }
  });

  test('zero arcane institutions, by the canonical census vocabulary', () => {
    const found = membersOf(MUNDANE).flatMap((s) => arcaneInstitutions(s).map((i) => i.name));
    expect(found).toEqual([]);
    // CONTROL: the same census over the SAME-SEED MAGICAL TWIN finds them. This is the
    // control that matters — a synthetic fixture proves only that the predicate works,
    // while the twin proves this realm's generator PRODUCES the thing being denied.
    expect(membersOf(MAGICAL).flatMap((s) => arcaneInstitutions(s)).length).toBeGreaterThan(0);
  });

  test('zero arcane factions', () => {
    const found = membersOf(MUNDANE).flatMap((s) => arcaneFactions(s).map((f) => f.faction || f.name));
    expect(found).toEqual([]);
    // CONTROL: the magical twin carries at least one on this seed.
    expect(membersOf(MAGICAL).flatMap((s) => arcaneFactions(s)).length).toBeGreaterThan(0);
    // …and an authored magic-pool faction is counted by the same predicate.
    expect(arcaneFactions({ powerStructure: { factions: [{ faction: 'The Arcane Circle' }] } }))
      .toHaveLength(1);
  });

  test('zero arcane services', () => {
    const found = membersOf(MUNDANE).flatMap((s) => arcaneServices(s).map((r) => r.name));
    expect(found).toEqual([]);
    // CONTROL: the magical twin's services DO carry arcane rows.
    expect(membersOf(MAGICAL).flatMap((s) => arcaneServices(s)).length).toBeGreaterThan(0);
  });

  test('a cathedral\'s PILGRIMAGE is not arcane content (the substring the census caught)', () => {
    // MG-4 found this live on a large mundane realm: 'mage' inside 'PILGRIMAGE' made a
    // cathedral's services read as arcane. The detector anchors at word boundaries; this
    // pin is the receipt, and it fails the moment the anchoring is lost.
    expect(arcaneServices({
      availableServices: {
        healing: [
          { name: 'Pilgrimage destination', institution: 'Cathedral (10,000+ only)' },
          { name: 'Pilgrimage services', institution: 'Great cathedral' },
        ],
      },
    })).toEqual([]);
    // …while the real thing still counts, so the anchoring did not blunt the census.
    expect(arcaneServices({
      availableServices: { magic: [{ name: 'Spell components', institution: "Mages' district" }] },
    })).toHaveLength(1);
  });

  test('zero magical or wild-magic history events', () => {
    const found = membersOf(MUNDANE).flatMap((s) => magicalHistoryEvents(s).map((e) => e.type));
    expect(found).toEqual([]);
    // CONTROL: the magical twin mints them on this seed…
    expect(membersOf(MAGICAL).flatMap((s) => magicalHistoryEvents(s)).length).toBeGreaterThan(0);
    // …and the census counts each planted type.
    for (const type of MAGIC_HISTORY_TYPES) {
      expect(magicalHistoryEvents({ history: { historicalEvents: [{ type }] } })).toHaveLength(1);
    }
  });

  test('zero teleport edges — even with a legacy circle standing in two members', () => {
    // The L1 reproduction, raised to realm scope. Planting the circle is the point: a
    // mundane realm has no circle to begin with, so asserting "no edges" on the bare
    // roster would measure nothing at all.
    const members = membersOf(MUNDANE);
    const seeds = members.map((s, i) => ({ id: `s${i}`, cellId: i }));
    const institutionsById = Object.fromEntries(seeds.map((seed, i) => [
      seed.id,
      i < 2 ? ['Teleportation circle'] : (members[i].institutions || []).map((x) => x.name),
    ]));
    const mundaneMagicById = Object.fromEntries(seeds.map((seed, i) => [seed.id, members[i].config.magicExists]));

    expect(buildTeleportEdges(seeds, institutionsById, mundaneMagicById)).toBeNull();

    // CONTROL: the identical roster in a world where magic functions DOES form the bloc,
    // so the null above is the world law and not an empty institution map.
    const magicalMagicById = Object.fromEntries(seeds.map((seed) => [seed.id, true]));
    const edges = buildTeleportEdges(seeds, institutionsById, magicalMagicById);
    expect(edges).not.toBeNull();
    expect(edges.edges.length).toBeGreaterThan(0);
  });

  test('magicProfile reads all-absent for every member', () => {
    const ABSENT_AXES = ['availability', 'legality', 'cost', 'risk'];
    for (const s of membersOf(MUNDANE)) {
      const profile = deriveMagicProfile(s);
      expect(profile.magicExists).toBe(false);
      for (const axis of ABSENT_AXES) expect(profile[axis], `${s.name}.${axis}`).toBe('absent');
      for (const [role, value] of Object.entries(profile.roles)) {
        expect(value, `${s.name}.roles.${role}`).toBe('absent');
      }
    }
    // CONTROL: the same reader on the magical twin is NOT all-absent, so the loop above
    // is reading the world and not a constant envelope.
    const magicalProfiles = membersOf(MAGICAL).map((s) => deriveMagicProfile(s));
    expect(magicalProfiles.every((p) => p.magicExists)).toBe(true);
    expect(magicalProfiles.some((p) => p.availability !== 'absent')).toBe(true);
  });
});

// ── 2. THE TWIN-WORLD ENVELOPE (MG-LAW-3) ──────────────────────────────────

/**
 * ⚠️ PENDING — NOT OWNER-SIGNED. The design (§6) puts the twin-world tolerance bands on
 * the SOAK, as a tuning surface the owner signs. These numbers are deliberately GENEROUS
 * provisional floors chosen to catch a collapse, not to certify a distribution: they exist
 * so the harness is standing and measuring before the soak runs, and so that a change that
 * genuinely thins a mundane realm cannot land unnoticed in the meantime.
 *
 * MEASURED (seed 'mg4-acceptance', small/realistic_regional/highIsland). ALL FIVE AXES the
 * envelope compares, mundane vs magical, machine-checked by the last pin in MG-4.2 against
 * this very line — see THE RECORD IS CHECKED below:
 *   RECORDED-CENSUS: members 5 vs 5 · institutions 134 vs 133 · factions 22 vs 24 · services 193 vs 189 · historyEvents 24 vs 25
 * Ratios: members 1.000 · institutions 1.008 · factions 0.917 · services 1.021 ·
 * historyEvents 0.960 — the mundane realm is at or above parity on three of five axes.
 * ⚠️ CORRECTED 2026-08-03: this block previously recorded `institutions 156 vs 158 ·
 * factions 23 vs 23` and omitted services and historyEvents entirely. No harness run
 * reproduces those institution counts; they were a hand-carried record that had drifted
 * from what the file measures. That is why the pin below now re-derives this line rather
 * than trusting it.
 * The real distribution is a seed-FAMILY question, and one seed cannot answer it — which
 * is exactly why the bands are owner-signed at the soak and not frozen here. When they are
 * signed, replace PENDING_BANDS and delete this note.
 */
const PENDING_BANDS = Object.freeze({
  members: 0.9,
  institutions: 0.8,
  factions: 0.75,
  services: 0.75,
  historyEvents: 0.75,
});

describe('MG-4.2 — the twin-world envelope: a mundane realm is not a thinner realm', () => {
  const mundane = realmCensus(MUNDANE);
  const magical = realmCensus(MAGICAL);

  test('the twins are genuinely different worlds (the envelope is not comparing one world to itself)', () => {
    expect(MUNDANE.fingerprint).not.toEqual(MAGICAL.fingerprint);
  });

  test.each(Object.keys(PENDING_BANDS))('%s lands within the PENDING tolerance band', (axis) => {
    const ratio = magical[axis] === 0 ? 1 : mundane[axis] / magical[axis];
    expect(
      ratio,
      `MG-LAW-3: the mundane realm's ${axis} is ${mundane[axis]} against the magical twin's `
      + `${magical[axis]} (ratio ${ratio.toFixed(3)}, PENDING floor ${PENDING_BANDS[axis]}). `
      + 'Suppression is supposed to ride the substitution arms, not delete content. If this '
      + 'reds, a substitution arm has stopped substituting.',
    ).toBeGreaterThanOrEqual(PENDING_BANDS[axis]);
  });

  test('the measured ratios are recorded where the soak can read them', () => {
    // Not an assertion about balance — an assertion that the harness MEASURES, so the
    // owner-signing step has numbers rather than adjectives to sign.
    const measured = Object.fromEntries(Object.keys(PENDING_BANDS).map((axis) => [
      axis,
      { mundane: mundane[axis], magical: magical[axis] },
    ]));
    for (const [axis, pair] of Object.entries(measured)) {
      expect(pair.magical, `${axis} must be produced by the magical twin at all`).toBeGreaterThan(0);
    }
    expect(Object.keys(measured)).toEqual(Object.keys(PENDING_BANDS));
  });

  /**
   * THE RECORD IS CHECKED. The header's MEASURED block and DESIGN_REALM_MAGIC_TOGGLE.md's
   * MG-4 block quote these figures to the soak and to the owner-signing step; a quoted
   * number nobody re-derives is a number that quietly stops being true. This one had:
   * the authored record said institutions 156 vs 158 and omitted services and history
   * events entirely, while the harness has always produced a five-axis census. So the
   * record now READS ITSELF — every axis, both twins, parsed out of the header line.
   *
   * WHEN THIS REDS, IT IS NOT ASKING FOR A BAND CHANGE. It is asking you to (1) confirm
   * the generation shift was intended, and (2) carry the new figures into BOTH places:
   * the RECORDED-CENSUS line above and DESIGN_REALM_MAGIC_TOGGLE.md's MG-4 landed block.
   * The tolerance question stays with PENDING_BANDS, which is the owner's to sign.
   */
  test('the recorded census figures are the ones the harness actually produces', () => {
    const header = readFileSync(fileURLToPath(import.meta.url), 'utf8');
    const line = header.match(/RECORDED-CENSUS:(.+)/)?.[1];
    expect(line, 'the header must carry a RECORDED-CENSUS line for the record to be checkable')
      .toBeTruthy();

    /** @type {Record<string, { mundane: number, magical: number }>} */
    const recorded = {};
    for (const clause of line.split('·')) {
      const m = clause.trim().match(/^(\w+)\s+(\d+)\s+vs\s+(\d+)$/);
      if (m) recorded[m[1]] = { mundane: Number(m[2]), magical: Number(m[3]) };
    }

    const live = Object.fromEntries(Object.keys(PENDING_BANDS).map((axis) => [
      axis,
      { mundane: mundane[axis], magical: magical[axis] },
    ]));
    const render = (/** @type {any} */ t) => Object.entries(t)
      .map(([axis, p]) => `${axis} ${p.mundane} vs ${p.magical}`).join(' · ');

    expect(
      recorded,
      'THE RECORDED TWIN-CENSUS HAS DRIFTED FROM THE HARNESS.\n'
      + `  recorded: ${render(recorded)}\n`
      + `  measured: ${render(live)}\n`
      + 'Every axis the envelope compares must be recorded, mundane first. Update the\n'
      + 'RECORDED-CENSUS line in this file\'s header AND the MG-4 landed block in\n'
      + 'docs/DESIGN_REALM_MAGIC_TOGGLE.md — the soak reads the second one.\n',
    ).toEqual(live);
  });
});

// ── 3. THE PULSE PIN ───────────────────────────────────────────────────────

/**
 * The four pulse magic kinds the design grep-censused. Kept as a NAMED list so the
 * vocabulary is legible and pinned — but the census below matches on the PREFIX, not on
 * this list. A hand-maintained list is a census that silently stops counting the day
 * somebody adds a fifth kind, and the first draft of this file proved the point: it missed
 * `magical_instability` entirely.
 */
const PULSE_MAGIC_TYPES = Object.freeze([
  'magic_deadzone', 'magic_practitioner', 'magic_regime_promoted', 'magic_regime_demoted',
]);

/** @param {unknown} candidateType */
function magicStressorType(candidateType) {
  const type = String(candidateType || '').replace(/^stressor_birth_/, '');
  return /^magic/i.test(type) ? type : null;
}

/**
 * Drive N ticks of stressor evaluation over a realm and collect every magic_* birth.
 * @param {any} realm
 * @param {number} ticks
 */
function magicBirthsOverPulse(realm, ticks) {
  const members = membersOf(realm);
  // ⚠️ byId values are WRAPPERS ({ settlement, causal }), not bare settlements. Passing
  // the settlement directly makes every gate read undefined and the whole census silently
  // returns zero — which is how this pin was vacuous when first written, and what the
  // control below exists to catch.
  const byId = new Map(members.map((s, i) => [`s${i}`, { settlement: s, causal: { scores: {} } }]));
  const pressures = members.map((s, i) => ({
    settlementId: `s${i}`,
    settlementName: s.name,
    kind: 'legitimacy',
    label: 'Legitimacy pressure',
    score: 0.75,
    reasons: ['unrest'],
  }));
  /** @type {string[]} */
  const births = [];
  for (let tick = 1; tick <= ticks; tick += 1) {
    const snapshot = {
      worldState: {
        tick,
        stressors: [],
        simulationRules: realm.campaign.worldState.simulationRules,
      },
      regionalGraph: { edges: [], channels: [] },
      byId,
    };
    const candidates = evaluateStressorRules(snapshot, pressureIndex(pressures), { tick, pressures });
    for (const c of candidates) {
      const type = magicStressorType(c.candidateType);
      if (type) births.push(`t${tick}:${type}`);
    }
  }
  return births;
}

describe('MG-4.3 — N advances of the mundane realm mint no magic events', () => {
  test('eight ticks, zero magic_* stressor births', () => {
    expect(magicBirthsOverPulse(MUNDANE, 8)).toEqual([]);
  });

  test('CONTROL: the MAGICAL TWIN, same seed and same harness, births them in quantity', () => {
    // The strongest control available: not a synthetic fixture but the very realm this
    // suite is comparing against, driven through the identical helper. If this ever falls
    // to zero, the pin above has stopped measuring the world and started measuring a
    // broken harness — which is exactly what happened on this file's first draft, where
    // `byId` held bare settlements and BOTH arms silently returned zero.
    const twin = magicBirthsOverPulse(MAGICAL, 8);
    expect(twin.length).toBeGreaterThan(0);
    expect(twin.some((b) => b.includes('magic_deadzone'))).toBe(true);
  });

  test('CONTROL: the census matches by prefix, so a fifth magic kind cannot slip past it', () => {
    // The named vocabulary must all be real catalog types…
    for (const type of PULSE_MAGIC_TYPES) {
      expect(normalizeStressor({ type, originSettlementId: 'a', affectedSettlementIds: ['a'] }).type)
        .toBe(type);
      expect(magicStressorType(`stressor_birth_${type}`)).toBe(type);
    }
    // …and the matcher must also catch the one the hand-written list missed.
    expect(magicStressorType('stressor_birth_magical_instability')).toBe('magical_instability');
    // Negative side: it must not sweep up unrelated births.
    expect(magicStressorType('stressor_birth_political_fracture')).toBeNull();
    expect(magicStressorType('stressor_birth_rebellion')).toBeNull();
  });
});
