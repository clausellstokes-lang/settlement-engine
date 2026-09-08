/**
 * rosterProvenance.test.js — the derivation table for the ONE read-side
 * provenance record (R-5b item #10, atlas economy-family gap 11b).
 *
 * WHY EVERY FIXTURE IS DRIVEN, NEVER HAND-ROLLED. The module's whole job is to
 * recognise the stamps two independent writers actually leave behind. A
 * hand-written `{ createdByWorldPulseOutcomeId: 'x' }` fixture would pin the
 * module against my memory of those writers rather than against the writers —
 * the faction-key defect class, wearing provenance clothing. So every
 * institution below is produced by EXECUTING the real writer:
 *
 *   composer  → events/mutateEntities addInstitution / removeInstitution /
 *               shiftTier, and the full events/applyEvent pipeline for the
 *               event-log trail;
 *   pulse     → worldPulse/institutionLifecycle applyInstitutionLifecycleOutcome
 *               (build / close / abolish / found / reopen) and
 *               worldPulse/tierOutcomeApply applyTierOutcomeToSettlement
 *               (promotion additions, reactivation, demotion fates).
 *
 * DELIBERATE COVERAGE GAP (recorded, not lost): entrepotKernel's
 * foundInstitution mints the SAME `createdByWorldPulseOutcomeId` +
 * `_worldPulseEconomyBuilt` pair, but it is a module-private function reachable
 * only through advanceEntrepotLayer's full multi-settlement shipment tally. Its
 * stamp shape is instead held structurally by the minter census in
 * tests/lint/provenanceStampSingleWriter.walker.test.js, which names
 * entrepotKernel.js as a declared minter of that exact key.
 */

import { describe, expect, test } from 'vitest';

import {
  institutionProvenanceOf,
  resourceProvenanceOf,
  DM_REALM_ORDER_PREFIX,
} from '../../../src/domain/provenance/rosterProvenance.js';
import { addInstitution, removeInstitution, shiftTier } from '../../../src/domain/events/mutateEntities.js';
import { applyInstitutionLifecycleOutcome } from '../../../src/domain/worldPulse/institutionLifecycle.js';
import { applyTierOutcomeToSettlement } from '../../../src/domain/worldPulse/tierOutcomeApply.js';
import { applyEvent } from '../../../src/domain/events/applyEvent.js';

// ── Drivers ──────────────────────────────────────────────────────────────────

/** A minimal settlement the real writers accept. */
function settlementWith(institutions = [], extra = {}) {
  return {
    id: 'settlement.test',
    name: 'Testhaven',
    tier: 'town',
    population: 1800,
    institutions,
    config: { tier: 'town', settType: 'town', nearbyResources: [], nearbyResourcesCustom: [] },
    ...extra,
  };
}

/** The named institution off a driven settlement (case-insensitive). */
function inst(settlement, name) {
  const found = (settlement.institutions || [])
    .find(i => String(i.name || '').toLowerCase() === name.toLowerCase());
  expect(found, `the writer never produced an institution named "${name}"`).toBeTruthy();
  return found;
}

/** Drive the composer's ADD_INSTITUTION handler. */
function driveComposerAdd(settlement, name, eventId = 'evt.add.1') {
  return addInstitution(settlement, {
    id: eventId,
    type: 'ADD_INSTITUTION',
    targetId: `institution.${name.replace(/ /g, '_')}`,
    description: `${name} opens its doors.`,
    payload: { category: 'civic' },
  });
}

/** Drive a world-pulse institution-lifecycle outcome. */
function drivePulse(settlement, outcomeId, patch) {
  return applyInstitutionLifecycleOutcome(settlement, { id: outcomeId, institutionPatch: patch });
}

// ── Institutions: the creation slot ──────────────────────────────────────────

describe('institutionProvenanceOf — creation, driven by the real writers', () => {
  test('the composer\'s ADD_INSTITUTION reads as dm-event, carrying the event id', () => {
    const next = driveComposerAdd(settlementWith(), 'Copper Exchange', 'evt.add.copper');
    const record = institutionProvenanceOf(inst(next, 'Copper Exchange'));
    expect(record.kind).toBe('institution');
    expect(record.created).toEqual({
      origin: 'dm-event', refKind: 'event', refId: 'evt.add.copper', sourceTag: null, reason: null,
    });
    expect(record.lastLifecycle).toBeNull();
  });

  test('a world-pulse BUILD reads as world-pulse, carrying the outcome id and its reason', () => {
    const next = drivePulse(settlementWith(), 'pulse.build.7', {
      action: 'build', name: 'Tannery', category: 'craft', reason: 'Three good years of hides.',
    });
    const record = institutionProvenanceOf(inst(next, 'Tannery'));
    expect(record.created.origin).toBe('world-pulse');
    expect(record.created.refKind).toBe('pulse-outcome');
    expect(record.created.refId).toBe('pulse.build.7');
    expect(record.created.reason).toBe('Three good years of hides.');
  });

  test('a world-pulse FOUND reads as world-pulse through the founding stamp', () => {
    const next = drivePulse(settlementWith(), 'pulse.found.3', {
      action: 'found', name: 'Shrine of the Deep', category: 'religious', reason: 'The patron seat willed it.',
    });
    const founded = inst(next, 'Shrine of the Deep');
    expect(founded.foundedByWorldPulseOutcomeId).toBe('pulse.found.3');
    expect(institutionProvenanceOf(founded).created).toMatchObject({
      origin: 'world-pulse', refKind: 'pulse-outcome', refId: 'pulse.found.3',
    });
  });

  test('a pulse outcome that carried no id still reads as world-pulse, with refId null', () => {
    const next = drivePulse(settlementWith(), '', {
      action: 'build', name: 'Ropewalk', category: 'craft', reason: 'Rigging demand.',
    });
    const built = inst(next, 'Ropewalk');
    expect(built.createdByWorldPulseOutcomeId).toBeNull();
    expect(built._worldPulseEconomyBuilt).toBe(true);
    expect(institutionProvenanceOf(built).created).toMatchObject({
      origin: 'world-pulse', refKind: 'pulse-outcome', refId: null,
    });
  });

  test('a generation row reads as generation and reports its source tag verbatim', () => {
    for (const tag of ['required', 'forced', 'auto-resolved']) {
      const record = institutionProvenanceOf({ name: 'Granary', status: 'active', source: tag });
      expect(record.created).toEqual({
        origin: 'generation', refKind: null, refId: null, sourceTag: tag, reason: null,
      });
    }
  });

  test('a fully unstamped legacy row is honestly unknown, never guessed', () => {
    const record = institutionProvenanceOf({ id: 'institution.old_mill', name: 'Old Mill', status: 'active' });
    expect(record.created).toEqual({
      origin: 'unknown', refKind: null, refId: null, sourceTag: null, reason: null,
    });
    expect(record.lastLifecycle).toBeNull();
  });

  test('a custom row outranks any pulse stamp it may be wearing', () => {
    // The pulse writers refuse to touch materialized custom content at all, so a
    // custom row carrying a pulse stamp is a legacy artifact — the ✦ ownership
    // boundary wins regardless.
    const record = institutionProvenanceOf({
      name: 'The Lanternwright', status: 'active', isCustom: true,
      createdByWorldPulseOutcomeId: 'pulse.build.9', _worldPulseEconomyBuilt: true,
    });
    expect(record.created.origin).toBe('custom');
    expect(record.created.refId).toBeNull();
  });

  test('a GENERATION-born institution reactivated by a promotion stays generation', () => {
    // tierOutcomeApply's reactivation branch writes
    // `createdByWorldPulseOutcomeId: inst.createdByWorldPulseOutcomeId || outcome.id`
    // onto a row it did not create. Reading the pulse id before `source` would
    // relabel the town's own granary as world-grown; a reactivation is a
    // lifecycle touch, not a birth.
    const closed = drivePulse(
      settlementWith([{ id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active', source: 'required', tags: [] }]),
      'pulse.close.2',
      { action: 'close', name: 'Granary' },
    );
    const promoted = applyTierOutcomeToSettlement(
      { ...closed, tier: 'town' },
      { id: 'pulse.tier.5', tierChange: { fromTier: 'town', toTier: 'city', direction: 'promotion' } },
    );
    const granary = inst(promoted, 'Granary');
    expect(granary.createdByWorldPulseOutcomeId ?? null).not.toBe(undefined);
    expect(institutionProvenanceOf(granary).created).toMatchObject({
      origin: 'generation', sourceTag: 'required',
    });
  });

  test('never throws, whatever it is handed', () => {
    for (const junk of [null, undefined, 0, '', 'granary', [], [{ name: 'x' }], NaN, true]) {
      expect(institutionProvenanceOf(junk).created.origin).toBe('unknown');
    }
  });
});

// ── The namespace pin (spec §4.2) ────────────────────────────────────────────

describe('the dm_shift_tier namespace is the whole tell between the two lanes', () => {
  const promotionOutcome = tier => ({ fromTier: tier, toTier: 'city', direction: 'promotion' });

  test('SHIFT_TIER is a composer verb wearing PULSE stamps — and reads as dm-realm-order', () => {
    const next = shiftTier(settlementWith(), { payload: { direction: 'promotion' } });
    const added = (next.institutions || []).filter(i => i._worldPulseTierAdded);
    expect(added.length, 'the promotion added no institutions to classify').toBeGreaterThan(0);
    for (const row of added) {
      expect(String(row.createdByWorldPulseOutcomeId)).toMatch(/^dm_shift_tier:/);
      expect(institutionProvenanceOf(row).created).toMatchObject({
        origin: 'dm-realm-order', refKind: 'pulse-outcome',
      });
    }
  });

  test('the SAME tier surgery under an ORGANIC outcome id reads as world-pulse', () => {
    const next = applyTierOutcomeToSettlement(settlementWith(), { id: 'pulse.tier.11', tierChange: promotionOutcome('town') });
    const added = (next.institutions || []).filter(i => i._worldPulseTierAdded);
    expect(added.length).toBeGreaterThan(0);
    for (const row of added) {
      expect(institutionProvenanceOf(row).created).toMatchObject({
        origin: 'world-pulse', refId: 'pulse.tier.11',
      });
    }
  });

  test('the prefix constant is the one the composer actually mints', () => {
    const next = shiftTier(settlementWith(), { payload: { direction: 'promotion' } });
    const stamped = (next.institutions || []).find(i => i.createdByWorldPulseOutcomeId);
    expect(String(stamped.createdByWorldPulseOutcomeId).startsWith(DM_REALM_ORDER_PREFIX)).toBe(true);
  });
});

// ── Institutions: the lifecycle slot ─────────────────────────────────────────

describe('institutionProvenanceOf — the latest lifecycle touch', () => {
  const withGranary = () => settlementWith([
    { id: 'institution.brewhouse', name: 'Brewhouse', category: 'craft', status: 'active', source: 'auto-resolved', tags: [] },
  ]);

  test('a composer REMOVE reads as a dm-event removal carrying the event id', () => {
    const next = removeInstitution(withGranary(), { id: 'evt.rm.4', type: 'REMOVE_INSTITUTION', targetId: 'institution.Brewhouse' });
    const record = institutionProvenanceOf(inst(next, 'Brewhouse'));
    expect(record.created.origin).toBe('generation');
    expect(record.lastLifecycle).toEqual({
      fate: 'removed', origin: 'dm-event', refKind: 'event', refId: 'evt.rm.4', reason: null,
    });
  });

  test('a world-pulse CLOSE reads as a world-pulse fate carrying the remnant reason', () => {
    const next = drivePulse(withGranary(), 'pulse.close.8', { action: 'close', name: 'Brewhouse' });
    const closed = inst(next, 'Brewhouse');
    const record = institutionProvenanceOf(closed);
    expect(record.lastLifecycle.origin).toBe('world-pulse');
    expect(record.lastLifecycle.refId).toBe('pulse.close.8');
    expect(record.lastLifecycle.fate).toBe(closed.worldPulseFate);
    expect(record.lastLifecycle.reason).toBe(closed.remnantReason);
  });

  test('a world-pulse ABOLISH reads as a world-pulse fate too', () => {
    const next = drivePulse(
      settlementWith([{ id: 'institution.fighting_pit', name: 'Fighting Pit', category: 'civic', status: 'active', tags: ['cruel'] }]),
      'pulse.abolish.1',
      { action: 'abolish', name: 'Fighting Pit', reason: 'The patron would not abide it.' },
    );
    const record = institutionProvenanceOf(inst(next, 'Fighting Pit'));
    expect(record.lastLifecycle).toMatchObject({
      origin: 'world-pulse', refKind: 'pulse-outcome', refId: 'pulse.abolish.1',
    });
    expect(record.lastLifecycle.reason).toBe('The patron would not abide it.');
  });

  test('a demotion fate reads as world-pulse and survives the removed/remnant split', () => {
    const promoted = applyTierOutcomeToSettlement(settlementWith(), { id: 'pulse.tier.20', tierChange: { fromTier: 'town', toTier: 'city', direction: 'promotion' } });
    const demoted = applyTierOutcomeToSettlement(
      { ...promoted, tier: 'city' },
      { id: 'pulse.tier.21', tierChange: { fromTier: 'city', toTier: 'town', direction: 'demotion' } },
    );
    const fallen = (demoted.institutions || []).filter(i => i._worldPulseInactive);
    expect(fallen.length, 'the demotion deactivated nothing to classify').toBeGreaterThan(0);
    for (const row of fallen) {
      const record = institutionProvenanceOf(row);
      expect(record.lastLifecycle.origin).toBe('world-pulse');
      expect(record.lastLifecycle.fate).toBe(row.worldPulseFate);
    }
  });

  test('THE STANDING GUARD: a reopened institution never reports its healed closure', () => {
    const closed = drivePulse(withGranary(), 'pulse.close.9', { action: 'close', name: 'Brewhouse' });
    const reopened = drivePulse(closed, 'pulse.build.10', { action: 'build', name: 'Brewhouse', category: 'craft', reason: 'Custom returned.' });
    const row = inst(reopened, 'Brewhouse');
    // The reopen branch deliberately keeps the old closure stamps on the record.
    expect(row.closedByWorldPulseOutcomeId).toBe('pulse.close.9');
    expect(row.status).toBe('active');
    const record = institutionProvenanceOf(row);
    expect(record.lastLifecycle).toMatchObject({ fate: 'reopened', origin: 'world-pulse', refId: 'pulse.build.10' });
  });

  test('THE TIE-BREAK: current status decides when both lanes left a closure stamp', () => {
    const pulseClosed = inst(drivePulse(withGranary(), 'pulse.close.11', { action: 'close', name: 'Brewhouse' }), 'Brewhouse');
    // A DM then strikes the remnant outright: the composer's own STATUS_REMOVED
    // vocabulary is what the LAST writer left behind, so the composer wins.
    const bothStamped = removeInstitution(
      settlementWith([pulseClosed]),
      { id: 'evt.rm.12', type: 'REMOVE_INSTITUTION', targetId: 'institution.Brewhouse' },
    );
    const row = inst(bothStamped, 'Brewhouse');
    expect(row.closedByWorldPulseOutcomeId).toBe('pulse.close.11');
    expect(row.removedByEventId).toBe('evt.rm.12');
    expect(institutionProvenanceOf(row).lastLifecycle).toMatchObject({
      origin: 'dm-event', refId: 'evt.rm.12', fate: 'removed',
    });
  });

  test('THE RAISING CASE: re-founding a fallen generation row is a TOUCH, not a birth', () => {
    const closed = drivePulse(withGranary(), 'pulse.close.13', { action: 'close', name: 'Brewhouse' });
    const raised = drivePulse(closed, 'pulse.found.14', {
      action: 'found', name: 'Brewhouse', category: 'craft', reason: 'The patron seat raised it again.',
    });
    const row = inst(raised, 'Brewhouse');
    expect(row.foundedByWorldPulseOutcomeId).toBe('pulse.found.14');
    expect(row.status).toBe('active');
    const record = institutionProvenanceOf(row);
    expect(record.created).toMatchObject({ origin: 'generation', sourceTag: 'auto-resolved' });
    expect(record.lastLifecycle).toMatchObject({
      fate: 'founded', origin: 'world-pulse', refId: 'pulse.found.14',
    });
  });

  test('a genuinely pulse-FOUNDED row reports its birth once, never twice', () => {
    const next = drivePulse(settlementWith(), 'pulse.found.15', {
      action: 'found', name: 'Shrine of the Deep', category: 'religious', reason: 'The patron seat willed it.',
    });
    const record = institutionProvenanceOf(inst(next, 'Shrine of the Deep'));
    expect(record.created.refId).toBe('pulse.found.15');
    expect(record.lastLifecycle).toBeNull();
  });

  test('a standing, never-touched institution has no lifecycle slot at all', () => {
    expect(institutionProvenanceOf({ name: 'Granary', status: 'active', source: 'required' }).lastLifecycle).toBeNull();
  });
});

// ── Resources: both trails, and the honesty about ordering ───────────────────

describe('resourceProvenanceOf — both trails, no faked ordering', () => {
  const withResources = (extra = {}) => ({
    ...settlementWith(),
    config: { tier: 'town', settType: 'town', nearbyResources: ['Iron ore'], nearbyResourcesCustom: [] },
    ...extra,
  });

  /** Drive the real event pipeline so the log entry is the one the store persists. */
  function driveResourceEvent(settlement, type, targetId, eventId) {
    const { logEntry, nextSettlement } = applyEvent({
      settlement,
      systemState: null,
      event: { id: eventId, type, targetId, description: `${type} ${targetId}`, payload: {} },
      now: '2026-01-01T00:00:00.000Z',
    });
    return { logEntry, nextSettlement };
  }

  test('an absent event log degrades to an empty events trail rather than throwing', () => {
    const record = resourceProvenanceOf('Iron ore', withResources());
    expect(record.kind).toBe('resource');
    expect(record.trails).toEqual({ events: [], pulse: [] });
    expect(record.created.origin).toBe('unknown');
    expect(record.lastLifecycle).toBeNull();
  });

  test('a real ADD_RESOURCE log entry attributes a CATALOG key to the DM', () => {
    const { logEntry, nextSettlement } = driveResourceEvent(withResources(), 'ADD_RESOURCE', 'gemstone_deposits', 'evt.res.add.1');
    const record = resourceProvenanceOf('gemstone_deposits', nextSettlement, { eventLog: [logEntry] });
    expect(record.created).toMatchObject({ origin: 'dm-event', refKind: 'event', refId: 'evt.res.add.1' });
    expect(record.trails.events).toHaveLength(1);
    expect(record.trails.pulse).toEqual([]);
  });

  test('a DM-added CUSTOM key reads as custom — and still shows the event that opened it', () => {
    // ADD_RESOURCE on a name with no catalog entry lands verbatim in
    // nearbyResourcesCustom (mutateWorld.addResource), so the ✦ ownership
    // boundary claims it. The DM's event is not lost: it is in the trail.
    const { logEntry, nextSettlement } = driveResourceEvent(withResources(), 'ADD_RESOURCE', 'Moonpetal grove', 'evt.res.add.0');
    expect(nextSettlement.config.nearbyResourcesCustom).toContain('Moonpetal grove');
    const record = resourceProvenanceOf('Moonpetal grove', nextSettlement, { eventLog: [logEntry] });
    expect(record.created.origin).toBe('custom');
    expect(record.trails.events).toHaveLength(1);
  });

  test('the key match is SLUG-tolerant, the same tolerance the mutation handlers use', () => {
    const { logEntry, nextSettlement } = driveResourceEvent(withResources(), 'ADD_RESOURCE', 'Moonpetal grove', 'evt.res.add.2');
    for (const spelling of ['Moonpetal grove', 'moonpetal_grove', 'MOONPETAL GROVE', 'Moonpetal  Grove']) {
      expect(resourceProvenanceOf(spelling, nextSettlement, { eventLog: [logEntry] }).trails.events).toHaveLength(1);
    }
    expect(resourceProvenanceOf('Iron ore', nextSettlement, { eventLog: [logEntry] }).trails.events).toEqual([]);
  });

  test('a pulse discovery attributes the key to the living world', () => {
    const settlement = withResources({
      resourceHistory: [{ resource: 'Silver seam', state: 'discovered', outcomeId: 'pulse.res.4', reason: 'A collapse opened the seam.' }],
    });
    const record = resourceProvenanceOf('Silver seam', settlement, { eventLog: [] });
    expect(record.created).toMatchObject({
      origin: 'world-pulse', refKind: 'pulse-outcome', refId: 'pulse.res.4', reason: 'A collapse opened the seam.',
    });
    expect(record.trails.pulse).toHaveLength(1);
  });

  test('when BOTH trails could account for the key, the record refuses to pick', () => {
    // resourceHistory carries no tick and eventLog's appliedAt is a different
    // clock, so cross-journal ordering is undecidable for every saved row. The
    // honest answer is 'unknown' with both trails shown — never "last changed by".
    const { logEntry, nextSettlement } = driveResourceEvent(
      withResources({ resourceHistory: [{ resource: 'gemstone_deposits', state: 'discovered', outcomeId: 'pulse.res.5', reason: 'Bloom year.' }] }),
      'ADD_RESOURCE', 'gemstone_deposits', 'evt.res.add.3',
    );
    const record = resourceProvenanceOf('gemstone_deposits', nextSettlement, { eventLog: [logEntry] });
    expect(record.created.origin).toBe('unknown');
    expect(record.trails.events).toHaveLength(1);
    expect(record.trails.pulse).toHaveLength(1);
    expect(record.lastLifecycle).toBeNull();
  });

  test('a DEPLETION explains a state, never a presence — it cannot attribute the key', () => {
    const { logEntry, nextSettlement } = driveResourceEvent(withResources(), 'DEPLETE_RESOURCE', 'Iron ore', 'evt.res.dep.1');
    const record = resourceProvenanceOf('Iron ore', nextSettlement, { eventLog: [logEntry] });
    expect(record.trails.events).toHaveLength(1);
    expect(record.created.origin).toBe('unknown');
  });

  test('a custom resource key reads as custom', () => {
    const settlement = withResources({
      config: { tier: 'town', settType: 'town', nearbyResources: [], nearbyResourcesCustom: ['Moonpetal grove'] },
    });
    expect(resourceProvenanceOf('Moonpetal grove', settlement).created.origin).toBe('custom');
  });

  test('never throws, whatever it is handed', () => {
    for (const junk of [null, undefined, 0, '', [], NaN]) {
      expect(resourceProvenanceOf(junk, junk, junk === null ? undefined : {}).kind).toBe('resource');
    }
  });
});
