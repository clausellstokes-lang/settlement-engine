/**
 * Entity model + impairment propagation tests.
 *
 * Direction-of-causality only: not snapshotting exact severity numbers
 * so the propagation engine can be retuned without rewriting tests.
 */

import { describe, test, expect } from 'vitest';
import {
  STATUS_ACTIVE, STATUS_IMPAIRED, STATUS_REMOVED,
  effectiveStatus, withImpairment, withoutEventImpairments, severityFor, isFullyActive,
} from '../../src/domain/entities/status.js';
import { propagateImpairment } from '../../src/domain/entities/propagate.js';
import { createNpc, killNpc, assignNpcToRole, inferImportance, importanceWeight } from '../../src/domain/entities/npcs.js';
import { normalizeNpcTraits } from '../../src/domain/dossier/entityLinks.js';

describe('entity status', () => {
  test('default-active when no impairments', () => {
    expect(effectiveStatus({ name: 'X' })).toBe(STATUS_ACTIVE);
    expect(isFullyActive({ name: 'X' })).toBe(true);
  });

  test('withImpairment auto-bumps to impaired', () => {
    const next = withImpairment({ name: 'X', impairments: [] }, {
      type: 'capacity', severity: 0.6, causeEventId: 'e1', description: 'Burned',
    });
    expect(next.status).toBe(STATUS_IMPAIRED);
    expect(next.impairments).toHaveLength(1);
  });

  test('withImpairment is idempotent on same type+cause', () => {
    let inst = { name: 'X' };
    inst = withImpairment(inst, { type: 'capacity', severity: 0.5, causeEventId: 'e1', description: 'A' });
    inst = withImpairment(inst, { type: 'capacity', severity: 0.7, causeEventId: 'e1', description: 'A2' });
    expect(inst.impairments).toHaveLength(1);
    expect(inst.impairments[0].severity).toBe(0.7);
  });

  test('different cause stacks', () => {
    let inst = { name: 'X' };
    inst = withImpairment(inst, { type: 'capacity', severity: 0.5, causeEventId: 'e1', description: 'A' });
    inst = withImpairment(inst, { type: 'capacity', severity: 0.4, causeEventId: 'e2', description: 'B' });
    expect(inst.impairments).toHaveLength(2);
  });

  test('withoutEventImpairments scrubs by cause', () => {
    let inst = { name: 'X' };
    inst = withImpairment(inst, { type: 'capacity', severity: 0.5, causeEventId: 'e1', description: 'A' });
    inst = withImpairment(inst, { type: 'capacity', severity: 0.4, causeEventId: 'e2', description: 'B' });
    const stripped = withoutEventImpairments(inst, 'e1');
    expect(stripped.impairments).toHaveLength(1);
    expect(stripped.impairments[0].causeEventId).toBe('e2');
  });

  test('severityFor compounds without exceeding 1', () => {
    const inst = withImpairment(
      withImpairment({ name: 'X' }, { type: 'capacity', severity: 0.5, causeEventId: 'e1', description: 'A' }),
      { type: 'capacity', severity: 0.5, causeEventId: 'e2', description: 'B' },
    );
    const s = severityFor(inst, 'capacity');
    expect(s).toBeGreaterThan(0.5);
    expect(s).toBeLessThan(1);
  });

  test('removed status is sticky — withImpairment does not override it', () => {
    const removed = { name: 'X', status: STATUS_REMOVED };
    const next = withImpairment(removed, { type: 'capacity', severity: 0.5, causeEventId: 'e1', description: 'A' });
    expect(next.status).toBe(STATUS_REMOVED);
  });
});

describe('NPC importance + weight', () => {
  test('inferImportance picks pillar for high-priest-style roles', () => {
    expect(inferImportance({ name: 'X', role: 'High Priestess' })).toBe('pillar');
    expect(inferImportance({ name: 'X', role: 'Lord Mayor' })).toBe('pillar');
  });

  test('inferImportance picks key for guildmaster-style roles', () => {
    expect(inferImportance({ name: 'X', role: 'Watch Captain' })).toBe('key');
    expect(inferImportance({ name: 'X', role: 'Guildmaster' })).toBe('key');
  });

  test('inferImportance falls back to minor for plain NPCs', () => {
    expect(inferImportance({ name: 'X', role: 'Stable hand' })).toBe('minor');
  });

  test('weight is monotonic by importance tier', () => {
    expect(importanceWeight({ importance: 'minor' })).toBe(0);
    expect(importanceWeight({ importance: 'notable' })).toBeLessThan(importanceWeight({ importance: 'key' }));
    expect(importanceWeight({ importance: 'key' })).toBeLessThan(importanceWeight({ importance: 'pillar' }));
  });
});

describe('createNpc descriptive traits', () => {
  test('retains authored flaw / temperament / goal / constraint / secret in the shapes the read card reads', () => {
    const npc = createNpc({
      name: 'Mira the Bold', importance: 'key',
      flaw: 'Reckless under pressure',
      temperament: 'Hot-tempered',
      goal: 'Reclaim her family name',
      constraint: 'Bound by an old debt',
      secret: 'Secretly funds the smugglers',
    });
    // Stored in the exact shapes the NPCInlineCard + normalizer read.
    expect(npc.flaw).toBe('Reckless under pressure');
    expect(npc.personality.dominant).toBe('Hot-tempered');
    expect(npc.goal).toEqual({ short: 'Reclaim her family name' });
    expect(npc.activeConstraint).toBe('Bound by an old debt');
    expect(npc.secret).toEqual({ what: 'Secretly funds the smugglers' });
  });

  test('the read-card normalizer surfaces exactly what was authored', () => {
    const npc = createNpc({
      name: 'Mira', importance: 'notable',
      flaw: 'Reckless', temperament: 'Hot-tempered',
      goal: 'Reclaim her name', secret: 'Funds the smugglers',
    });
    const traits = normalizeNpcTraits(npc);
    const byLabel = Object.fromEntries(traits.map(t => [t.label, t.value]));
    expect(byLabel.Flaw).toBe('Reckless');
    expect(byLabel.Temperament).toBe('Hot-tempered');
    expect(byLabel.Goal).toBe('Reclaim her name');
    expect(byLabel.Secret).toBe('Funds the smugglers');
    // The secret stays GM-only.
    expect(traits.find(t => t.label === 'Secret').visibility).toBe('gm');
  });

  test('accepts goals (plural) as an alias and pre-shaped objects, and omits absent traits', () => {
    const fromPlural = createNpc({ name: 'A', goals: 'Win the seat' });
    expect(fromPlural.goal).toEqual({ short: 'Win the seat' });
    const fromObject = createNpc({ name: 'B', goal: { short: 'Already shaped' }, secret: { what: 'kept', stakes: 'high' } });
    expect(fromObject.goal).toEqual({ short: 'Already shaped' });
    expect(fromObject.secret).toEqual({ what: 'kept', stakes: 'high' });
    // No traits authored → none of the optional keys appear (old footprint preserved).
    const bare = createNpc({ name: 'C' });
    expect(bare.flaw).toBeUndefined();
    expect(bare.goal).toBeUndefined();
    expect(bare.secret).toBeUndefined();
    expect(bare.activeConstraint).toBeUndefined();
    expect(bare.personality).toBeUndefined();
  });
});

describe('killNpc', () => {
  test('minor NPC death produces no propagation', () => {
    const npc = createNpc({ name: 'Stable hand', importance: 'minor', linkedInstitutionIds: ['inst.stable'] });
    const result = killNpc(npc, 'e1');
    expect(result.npc.status).toBe('dead');
    expect(result.institutionImpairments).toHaveLength(0);
    expect(result.factionImpairments).toHaveLength(0);
  });

  test('key NPC death produces staffing impairment', () => {
    const npc = createNpc({
      name: 'Watch Captain', importance: 'key',
      linkedInstitutionIds: ['inst.watch'],
      linkedFactionIds: ['faction.militia'],
    });
    const result = killNpc(npc, 'e1');
    expect(result.npc.status).toBe('dead');
    expect(result.institutionImpairments).toHaveLength(1);
    expect(result.institutionImpairments[0].impairment.type).toBe('staffing');
    expect(result.factionImpairments).toHaveLength(1);
  });

  test('pillar NPC death adds legitimacy impairment on top of staffing', () => {
    const npc = createNpc({
      name: 'High Priestess', importance: 'pillar',
      linkedInstitutionIds: ['inst.temple'],
    });
    const result = killNpc(npc, 'e1');
    const types = result.institutionImpairments.map(x => x.impairment.type);
    expect(types).toContain('staffing');
    expect(types).toContain('legitimacy');
  });
});

describe('assignNpcToRole', () => {
  test('competent replacement returns a non-zero recovery factor', () => {
    const npc = createNpc({ name: 'Replacement', importance: 'notable' });
    const result = assignNpcToRole({ npc, institutionId: 'inst.watch', role: 'Captain', quality: 'competent', eventId: 'e2' });
    expect(result.recoveryQuality).toBeGreaterThan(0);
    expect(result.npc.linkedInstitutionIds).toContain('inst.watch');
  });

  test('popular replacement adds a legitimacy bonus restoration', () => {
    const npc = createNpc({ name: 'Hero', importance: 'key' });
    const result = assignNpcToRole({ npc, institutionId: 'inst.watch', role: 'Captain', quality: 'popular', eventId: 'e2' });
    const bonuses = result.restorations.filter(r => r.impairment.severity < 0);
    expect(bonuses.length).toBeGreaterThan(0);
  });

  test('corrupt replacement adds a legitimacy hit (positive severity)', () => {
    const npc = createNpc({ name: 'Crook', importance: 'key' });
    const result = assignNpcToRole({ npc, institutionId: 'inst.watch', role: 'Captain', quality: 'corrupt', eventId: 'e2' });
    const hits = result.restorations.filter(r => r.impairment.severity > 0);
    expect(hits.length).toBeGreaterThan(0);
  });
});

describe('propagateImpairment', () => {
  function settlement() {
    return {
      institutions: [
        { id: 'inst.granary', name: 'Granary' },
        { id: 'inst.temple',  name: 'Temple' },
      ],
      factions: [
        { id: 'faction.merchants', name: 'Merchant Guild', controlsInstitutionIds: ['inst.granary'] },
        { id: 'faction.clergy',    name: 'Temple Clergy',  controlsInstitutionIds: ['inst.temple'] },
      ],
      npcs: [],
    };
  }

  test('institution impairment propagates to controlling faction', () => {
    const next = propagateImpairment({
      settlement: settlement(),
      origin: {
        entityType: 'institution',
        entityId: 'inst.granary',
        impairment: { type: 'capacity', severity: 0.8, causeEventId: 'e1', description: 'Burned' },
      },
    });
    const merchants = next.factions.find(f => f.id === 'faction.merchants');
    expect(merchants.impairments).toBeTruthy();
    expect(merchants.impairments.length).toBeGreaterThan(0);
    expect(merchants.impairments[0].causeEventId).toBe('e1');
  });

  test('damping reduces severity at each hop', () => {
    const next = propagateImpairment({
      settlement: settlement(),
      origin: {
        entityType: 'institution',
        entityId: 'inst.granary',
        impairment: { type: 'capacity', severity: 0.8, causeEventId: 'e1', description: 'Burned' },
      },
      opts: { damping: 0.5 },
    });
    const merchants = next.factions.find(f => f.id === 'faction.merchants');
    expect(merchants.impairments[0].severity).toBeLessThan(0.8);
  });

  test('unrelated institutions are not impaired by one event', () => {
    const next = propagateImpairment({
      settlement: settlement(),
      origin: {
        entityType: 'institution',
        entityId: 'inst.granary',
        impairment: { type: 'capacity', severity: 0.8, causeEventId: 'e1', description: 'Burned' },
      },
    });
    const temple = next.institutions.find(i => i.id === 'inst.temple');
    expect(temple.impairments || []).toHaveLength(0);
  });
});
