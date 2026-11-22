/**
 * foreignPrimacyAxis.test.js — W-SEAT SEAT-2a: PRIMACY IS ORDERING, WEIGHT IS SCALAR.
 *
 * The owner's §735.2 "always just greater" is delivered as an ORDERING guarantee
 * over a typed decision-class list (law §2.3), never as a tuned number staying
 * bigger. These arms are the executable form of that promise: the register is
 * reachable, an OCCUPIER reaches it, a VASSAL overlord does not, and the whole
 * pass is reference-identical when dark.
 *
 * ⛔ THE ARM THAT MATTERS MOST IS THE REGISTER-REACHABILITY ONE. The estate's own
 * `CHANGE_AUTHORITY_POLICY` names `tier_change`, and NO producer ever emits that
 * string — `tierResourceDynamics.js` emits `tier_promotion`/`tier_demotion`. A
 * register copied from the policy names would have matched nothing, done nothing,
 * and passed every existence census while doing it. That is the recorded hazard
 * that a shape the corpus never produces looks clean, and it is why this file
 * scans the EMITTERS rather than trusting the policy table.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  FOREIGN_PRIMACY_CLASS,
  FOREIGN_PRIMACY_DISPOSITIONS,
  applyForeignPrimacy,
} from '../../src/domain/worldPulse/foreignPrimacy.js';

const SRC_ROOT = path.resolve(fileURLToPath(new URL('../../src', import.meta.url)));

function srcFiles() {
  /** @type {string[]} */
  const out = [];
  (function walk(dir) {
    for (const entry of readdirSync(dir).sort()) {
      const full = path.join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (full.endsWith('.js')) out.push(full);
    }
  }(SRC_ROOT));
  return out;
}

const ALL_SRC = srcFiles().map((f) => readFileSync(f, 'utf8')).join('\n');

/**
 * A settlement pair: `a` is the town, `o` the foreign court. The occupations
 * ledger is the only substrate these arms need — the resolver's other two
 * (relationship edges, treaty ties) are covered by the SEAT-1 resolver suite.
 */
function scene({ lit = true, rung = 'extractive' } = {}) {
  const town = (id, name) => ({
    id,
    name,
    settlement: {
      name,
      tier: 'city',
      npcs: [],
      powerStructure: {
        governingName: 'Crown',
        publicLegitimacy: { score: 40 },
        factions: [{ id: 'fac.crown', faction: 'Crown', power: 60, isGoverning: true }],
      },
    },
  });
  const items = [town('a', 'Aster'), town('o', 'Gloamhold')];
  return {
    settlements: items,
    byId: new Map(items.map((e) => [String(e.id), e])),
    worldState: {
      simulationRules: lit ? { foreignSeatEnabled: true } : {},
      occupations: { a: { occupierId: 'o', state: rung, resistance: 0.1 } },
    },
  };
}

const candidate = (over = {}) => ({
  id: `cand.${over.candidateType || 'x'}.a.7`,
  type: 'condition',
  candidateType: 'strategy_deploy',
  ruleFamily: 'strategy',
  targetSaveId: 'a',
  severity: 0.6,
  probability: 1,
  applyMode: 'auto',
  ...over,
});

describe('SEAT-2a — the primacy register is reachable from real emitters', () => {
  it('every register key is a string some producer actually emits', () => {
    // Either a literal `candidateType: 'x'`, or derivable from a named template.
    const TEMPLATES = Object.freeze({
      tier_promotion: 'candidateType: `tier_${drift.direction}`',
      tier_demotion: 'candidateType: `tier_${drift.direction}`',
    });
    const unreachable = [];
    for (const key of Object.keys(FOREIGN_PRIMACY_CLASS)) {
      const literal = new RegExp(`candidateType: *['"\`]${key}['"\`]`).test(ALL_SRC);
      const template = TEMPLATES[key] ? ALL_SRC.includes(TEMPLATES[key]) : false;
      if (!literal && !template) unreachable.push(key);
    }
    expect(unreachable).toEqual([]);
    // anchored: the scan must be able to FAIL, or the arm above proves nothing.
    // `tier_change` is the policy table's name and no emitter writes it — exactly
    // the trap this file exists to keep the register out of.
    expect(/candidateType: *['"`]tier_change['"`]/.test(ALL_SRC)).toBe(false);
  });

  it('the dispositions are closed and BOTH are live in the register', () => {
    expect(FOREIGN_PRIMACY_DISPOSITIONS).toEqual(['referred', 'vetoed']);
    const used = new Set(Object.values(FOREIGN_PRIMACY_CLASS).map((r) => r.disposition));
    for (const d of FOREIGN_PRIMACY_DISPOSITIONS) {
      expect(used.has(d), `disposition '${d}' is declared but no register row uses it`).toBe(true);
    }
    for (const d of used) expect(FOREIGN_PRIMACY_DISPOSITIONS).toContain(d);
  });

  it('the register does NOT reach the pressured-only families the coverage table excludes', () => {
    // Car 0 rules faith, justice, culture, faction competition and relationship
    // relabels PRESSURED-ONLY — force can bias their inputs and never decide them.
    // Keying on `ruleFamily` instead of `candidateType` would have swept them in.
    for (const excluded of [
      'faction_competition', 'faction_rival_power_contest', 'relationship_label_change',
      'relationship_evolution', 'institution_build', 'institution_closure',
      'stressor_birth', 'population_emigration', 'coup_succeeded',
    ]) {
      expect(FOREIGN_PRIMACY_CLASS[excluded], `${excluded} must stay out of the override class`)
        .toBeUndefined();
    }
  });
});

describe('SEAT-2a — the pass is dormant by REFERENCE, not by arithmetic', () => {
  it('returns the same array reference when the flag is dark', () => {
    const s = scene({ lit: false });
    const list = [candidate(), candidate({ candidateType: 'tier_promotion' })];
    expect(applyForeignPrimacy(list, s)).toBe(list); // anchored: identity, not equality
  });

  it('refuses every truthy-non-true value of the key', () => {
    const list = [candidate()];
    for (const truthy of ['true', 1, {}, [], 'yes']) {
      const s = scene({ lit: false });
      s.worldState.simulationRules.foreignSeatEnabled = truthy;
      expect(applyForeignPrimacy(list, s), `truthy ${JSON.stringify(truthy)}`).toBe(list);
    }
  });

  it('returns the same reference when LIT but nothing in the list is in the class', () => {
    const s = scene({ lit: true });
    const list = [candidate({ candidateType: 'faction_competition' }), candidate({ candidateType: 'stressor_birth_famine' })];
    expect(applyForeignPrimacy(list, s)).toBe(list);
  });

  it('returns the same reference when LIT over a settlement with no seat at all', () => {
    const s = scene({ lit: true });
    s.worldState.occupations = {};
    const list = [candidate()];
    expect(applyForeignPrimacy(list, s)).toBe(list);
  });
});

describe('SEAT-2a — an OCCUPIER reaches the override class', () => {
  it('REFERS a war initiation to the authority lane, carrying a typed ruling', () => {
    const s = scene({ lit: true });
    const list = [candidate()];
    const out = applyForeignPrimacy(list, s);
    expect(out).not.toBe(list);
    expect(out).toHaveLength(1);
    expect(out[0].applyMode).toBe('proposal'); // anchored: it was 'auto'
    expect(out[0].foreignPrimacy).toEqual({
      disposition: 'referred',
      decisionClass: 'war_initiation',
      seatId: 'o',
      regime: 'occupation',
      band: expect.any(String),
      rung: 'extractive',
    });
    // The input is not mutated — the pass is pure.
    expect(list[0].applyMode).toBe('auto');
    expect('foreignPrimacy' in list[0]).toBe(false);
  });

  it('VETOES a compact repudiation outright — the candidate does not survive', () => {
    const s = scene({ lit: true });
    const list = [candidate({ candidateType: 'treaty_breached' }), candidate({ candidateType: 'faction_competition' })];
    const out = applyForeignPrimacy(list, s);
    expect(out.map((c) => c.candidateType)).toEqual(['faction_competition']);
    // anchored: the untouched sibling survives BY REFERENCE, so the veto removed
    // exactly one thing and did not rebuild the world around it.
    expect(out[0]).toBe(list[1]);
  });

  it('reads the settlement id from metadata when targetSaveId is absent', () => {
    const s = scene({ lit: true });
    const list = [{ ...candidate(), targetSaveId: undefined, metadata: { settlementId: 'a' } }];
    expect(applyForeignPrimacy(list, s)[0].applyMode).toBe('proposal');
  });

  it('leaves a STATE-ONLY record alone, so a mechanical refresh is never a casualty', () => {
    // The choke installs this bypass one line above for exactly this reason and
    // undoing it here would have been silent — the record would still exist, just
    // in the proposal budget instead of the reducer lane.
    const s = scene({ lit: true });
    const list = [candidate({ recordMode: 'state_only' })];
    expect(applyForeignPrimacy(list, s)).toBe(list);
  });

  it('ranges over the whole ladder BELOW vassalized', () => {
    for (const rung of ['contested', 'unstable', 'extractive', 'stabilized']) {
      const out = applyForeignPrimacy([candidate()], scene({ lit: true, rung }));
      expect(out[0].foreignPrimacy?.rung, `rung ${rung}`).toBe(rung);
      expect(out[0].applyMode).toBe('proposal');
    }
  });
});

describe('SEAT-2a — a VASSAL overlord does NOT (law §2.3)', () => {
  it('leaves the class untouched at the vassalized rung — weight, never ordering', () => {
    // A1.1.8 rules `vassalized` OUT of occupation. Reading mere seat EXISTENCE here
    // would hand every matured vassal the occupier's powers, which is the very
    // inversion A1.1.8 exists to prevent, arriving through a second door.
    const s = scene({ lit: true, rung: 'vassalized' });
    const list = [candidate(), candidate({ candidateType: 'treaty_breached' })];
    expect(applyForeignPrimacy(list, s)).toBe(list);
  });

  it('and the discrimination is real: the SAME list under an occupation DOES move', () => {
    // anchored: without this the arm above passes for any reason at all, including
    // a resolver that returns null for every world.
    const list = [candidate()];
    expect(applyForeignPrimacy(list, scene({ lit: true, rung: 'vassalized' }))).toBe(list);
    expect(applyForeignPrimacy(list, scene({ lit: true, rung: 'stabilized' }))).not.toBe(list);
  });
});
