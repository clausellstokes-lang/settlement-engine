/**
 * tests/domain/relationshipCompatibility.test.js — Phase B0 §5 compatibility matrix.
 *
 * Pins the proposal §5 rules:
 *   - rivals who trade: OK            (rival + trade_partner)
 *   - allies who trade: OK           (allied + trade_partner)
 *   - battlefield enemies as NORMAL trade: NOT OK (hostile + trade_partner)
 *   - …EXCEPT via covert / forced / mediated / temporary channels
 *     (smuggling / forced_tribute / mediated_commerce / ceasefire_commerce).
 *   - allowedSecondaries(primary) returns the unconditional set.
 *   - validateRelationship flags every incoherent combination with a code.
 *   - the secondary-status vocabulary is a frozen registry.
 *   - MOUNTED NOWHERE (grep-proven).
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import {
  isCompatible,
  allowedSecondaries,
  validateRelationship,
  PRIMARY_RELATIONSHIP_TYPES,
  SECONDARY_RELATIONSHIP_STATUSES,
  SECONDARY_STATUS_IDS,
  EXCEPTION_FLAGS,
  isAdversarialTradingPrimary,
  isBattlefieldPrimary,
} from '../../src/domain/worldPulse/relationshipCompatibility.js';

describe('vocabulary registries', () => {
  it('exposes the 10 canonical primary relationship types, frozen', () => {
    expect(PRIMARY_RELATIONSHIP_TYPES).toHaveLength(10);
    expect(Object.isFrozen(PRIMARY_RELATIONSHIP_TYPES)).toBe(true);
    for (const t of ['neutral', 'trade_partner', 'allied', 'patron', 'client', 'vassal', 'rival', 'cold_war', 'hostile', 'criminal_network']) {
      expect(PRIMARY_RELATIONSHIP_TYPES).toContain(t);
    }
  });

  it('the secondary-status registry is frozen and lists the proposal vocabulary', () => {
    expect(Object.isFrozen(SECONDARY_RELATIONSHIP_STATUSES)).toBe(true);
    for (const id of [
      'trade_partner', 'preferred_supplier', 'critical_supplier', 'military_supplier',
      'client', 'patron', 'creditor', 'debtor', 'tribute',
      'embargo', 'sanctioned', 'proxy',
      'smuggling', 'forced_tribute', 'mediated_commerce', 'ceasefire_commerce',
    ]) {
      expect(SECONDARY_STATUS_IDS, `missing secondary status: ${id}`).toContain(id);
    }
  });

  it('the four exception flags are covert/forced/mediated/temporary', () => {
    expect([...EXCEPTION_FLAGS].sort()).toEqual(['covert', 'forced', 'mediated', 'temporary']);
  });
});

describe('§5 core rules', () => {
  it('rivals who trade: OK', () => {
    expect(isCompatible('rival', 'trade_partner')).toBe(true);
    expect(isCompatible('rival', 'preferred_supplier')).toBe(true);
    expect(isAdversarialTradingPrimary('rival')).toBe(true);
  });

  it('allies who trade: OK', () => {
    expect(isCompatible('allied', 'trade_partner')).toBe(true);
    expect(isCompatible('allied', 'military_supplier')).toBe(true);
  });

  it('battlefield enemies as NORMAL trade: NOT OK', () => {
    expect(isBattlefieldPrimary('hostile')).toBe(true);
    expect(isCompatible('hostile', 'trade_partner')).toBe(false);
    expect(isCompatible('hostile', 'preferred_supplier')).toBe(false);
    expect(isCompatible('hostile', 'military_supplier')).toBe(false);
  });

  it('battlefield enemies CAN trade through the covert/forced/mediated/temporary exceptions', () => {
    expect(isCompatible('hostile', 'smuggling', { covert: true })).toBe(true);
    expect(isCompatible('hostile', 'forced_tribute', { forced: true })).toBe(true);
    expect(isCompatible('hostile', 'mediated_commerce', { mediated: true })).toBe(true);
    expect(isCompatible('hostile', 'ceasefire_commerce', { temporary: true })).toBe(true);
  });

  it('an exception channel WITHOUT its flag is forbidden', () => {
    expect(isCompatible('hostile', 'smuggling')).toBe(false);
    expect(isCompatible('hostile', 'smuggling', { forced: true })).toBe(false); // wrong flag
    expect(isCompatible('hostile', 'ceasefire_commerce', { covert: true })).toBe(false);
  });

  it('exception channels are incoherent under a non-battlefield primary', () => {
    // smuggling belongs to criminal_network (unconditional) or hostile (via covert);
    // under a plain trade_partner it is incoherent.
    expect(isCompatible('trade_partner', 'smuggling', { covert: true })).toBe(false);
    // criminal_network lists smuggling unconditionally.
    expect(isCompatible('criminal_network', 'smuggling')).toBe(true);
  });

  it('rejects unknown primary or secondary', () => {
    expect(isCompatible('not_a_type', 'trade_partner')).toBe(false);
    expect(isCompatible('rival', 'not_a_status')).toBe(false);
  });
});

describe('allowedSecondaries', () => {
  it('returns the unconditional set for a primary', () => {
    const rival = allowedSecondaries('rival');
    expect(rival).toContain('trade_partner');
    expect(rival).toContain('embargo');
    // hostile gets NO normal commerce in the unconditional set.
    const hostile = allowedSecondaries('hostile');
    expect(hostile).not.toContain('trade_partner');
    expect(hostile).toContain('embargo');
  });

  it('returns a fresh copy (not the frozen original) and [] for unknown', () => {
    const a = allowedSecondaries('allied');
    a.push('mutated');
    expect(allowedSecondaries('allied')).not.toContain('mutated');
    expect(allowedSecondaries('bogus')).toEqual([]);
  });

  it('every unconditionally-allowed secondary is isCompatible', () => {
    for (const primary of PRIMARY_RELATIONSHIP_TYPES) {
      for (const sec of allowedSecondaries(primary)) {
        expect(isCompatible(primary, sec), `${primary} + ${sec}`).toBe(true);
      }
    }
  });
});

describe('validateRelationship', () => {
  it('passes a coherent edge', () => {
    const r = validateRelationship('rival', ['trade_partner', 'embargo']);
    expect(r.ok).toBe(true);
    expect(r.issues).toEqual([]);
  });

  it('flags normal commerce on a battlefield enemy', () => {
    const r = validateRelationship('hostile', ['trade_partner']);
    expect(r.ok).toBe(false);
    expect(r.issues[0].code).toBe('commerce_with_battlefield_enemy');
  });

  it('flags an exception channel missing its flag (orphan_exception)', () => {
    const r = validateRelationship('hostile', [{ status: 'smuggling' }]);
    expect(r.ok).toBe(false);
    expect(r.issues[0].code).toBe('orphan_exception');
  });

  it('passes the exception channel when the flag is supplied', () => {
    const r = validateRelationship('hostile', [{ status: 'smuggling', covert: true }]);
    expect(r.ok).toBe(true);
  });

  it('flags unknown primary and unknown secondary', () => {
    expect(validateRelationship('bogus', []).issues[0].code).toBe('unknown_primary');
    expect(validateRelationship('rival', ['bogus']).issues[0].code).toBe('unknown_secondary');
  });

  it('accepts string or object secondary entries', () => {
    const r = validateRelationship('allied', ['trade_partner', { status: 'military_supplier' }]);
    expect(r.ok).toBe(true);
  });
});

describe('B4 consumers — the overlay is enforced, not parallel', () => {
  it('only the sanctioned B4 consumers import relationshipCompatibility', () => {
    // B0 mounted it nowhere. B4 ENFORCES the overlay: tradeSalience.js derives the
    // compatibility-gated secondary statuses, relationshipRulesAdversarial.js reads the
    // battlefield-primary check for the coercion/embargo rules (the rule evaluators
    // were extracted out of relationshipEvolution.js in the god-module split). Any
    // OTHER importer is an unsanctioned coupling (or a new parallel ruleset) and
    // should be flagged.
    const hits = execSync(
      "grep -rln \"relationshipCompatibility\" src tests || true",
      { cwd: process.cwd(), encoding: 'utf8' },
    ).trim().split('\n').filter(Boolean).map(p => p.replace(/\/{2,}/g, '/'));
    const SANCTIONED = [
      'src/domain/worldPulse/relationshipCompatibility.js',
      'tests/domain/relationshipCompatibility.test.js',
      // B4 consumers (this phase):
      'src/domain/worldPulse/tradeSalience.js',
      'src/domain/worldPulse/relationshipRulesAdversarial.js',
      'tests/domain/tradeSalience.test.js',
    ];
    const offenders = hits.filter(p => !SANCTIONED.some(s => p.endsWith(s)));
    expect(offenders, `unexpected importers: ${offenders.join(', ')}`).toEqual([]);
  });
});
