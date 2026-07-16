/**
 * tests/domain/events/realmCoverage.walker.test.js — THE REALM COVERAGE WALKER
 * (Composer V2 §6/§8, the W-COMPOSER-2 lift's enforcement arm).
 *
 * The empirical denominator: this walker SOURCE-SCANS src/domain/worldPulse for
 * parked registrable-verb shapes — `registered: false` markers, verb factories
 * (`verb: 'X'` + `candidateType`), and entry factories (`type: 'FORCE_X'`) —
 * and asserts (a) NO `registered: false` park marker remains (the lift is
 * total; a future wave parks a verb only by adding it to the shrink-only
 * PARKED ledger below), and (b) every factory-shaped verb name is claimed by
 * the REALM_MANIFEST (or the settlement AFFORDANCE_MANIFEST). A new mover
 * cannot ship a forceable shape that the composer never learns about — the
 * Counterpart Criterion (design LAW 2), fail-closed at the realm trunk.
 *
 * (Whisper + glossary presence per realm verb are asserted in
 * tests/domain/guidanceRegistry.walker.test.js and tests/docs/
 * glossaryFreshness.test.js respectively — the W-COMPOSER-2 voice stage.)
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  REALM_MANIFEST, realmVerbs, realmVerbFor, executableRealmVerbs, realmVetoProse,
  REALM_SEVERITY_VALUES,
} from '../../../src/domain/events/realmManifest.js';
import { AFFORDANCE_MANIFEST } from '../../../src/domain/events/affordanceManifest.js';
import { CHANGE_AUTHORITY_POLICY } from '../../../src/domain/worldPulse/changeAuthorityPolicy.js';

// ── The shrink-only PARKED ledger (ZERO at the lift — keep it that way) ──────
const PARKED_VERBS = Object.freeze({
  // (empty — every registrable shape is registered; a future wave may park a
  // verb ONLY by naming it here with the wave that lifts it)
});
const PARKED_CEILING = 0;

const WORLD_PULSE_DIR = join(process.cwd(), 'src/domain/worldPulse');

function stripComments(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

/** Source-scan the worldPulse tree for parked/factory verb shapes. */
function scanWorldPulse() {
  /** @type {Set<string>} */
  const factoryVerbs = new Set();
  /** @type {Set<string>} */
  const entryFactoryTypes = new Set();
  /** @type {Array<{ file: string }>} */
  const parkMarkers = [];
  for (const file of readdirSync(WORLD_PULSE_DIR).filter(f => f.endsWith('.js'))) {
    const code = stripComments(readFileSync(join(WORLD_PULSE_DIR, file), 'utf-8'));
    if (/registered:\s*false/.test(code)) parkMarkers.push({ file });
    // Verb factories: a `verb: 'X'` literal near a candidateType (the frozen
    // factory shape the convergence/naval/momentum verbs ship).
    if (/candidateType:/.test(code)) {
      for (const m of code.matchAll(/verb:\s*'([A-Z_]+)'/g)) factoryVerbs.add(m[1]);
    }
    // Entry factories: the forceCalamityEntry shape (`type: 'FORCE_X'` inside a
    // frozen affordance-entry literal).
    for (const m of code.matchAll(/type:\s*'(FORCE_[A-Z_]+)'/g)) entryFactoryTypes.add(m[1]);
  }
  return { factoryVerbs, entryFactoryTypes, parkMarkers };
}

// The pure-mutation verbs (declare/sue/raid/embargo) carry no factory literal —
// their registrable shape is the exported gated fn + VETO_PROSE feed. Their
// claim is asserted by name below (the census is closed by the prose-feed scan).
const PURE_MUTATION_VERBS = ['DECLARE_CASUS', 'SUE_FOR_PEACE', 'ORDER_SUPPLY_RAID', 'DECLARE_TRADE_EMBARGO'];

describe('realm coverage walker (parked shapes → realm manifest, fail-closed)', () => {
  const { factoryVerbs, entryFactoryTypes, parkMarkers } = scanWorldPulse();

  it('finds a real denominator (the scan is not vacuous)', () => {
    expect(factoryVerbs.size).toBeGreaterThanOrEqual(6);   // convergence 3 + naval 2 + momentum 1
    expect(entryFactoryTypes.size).toBeGreaterThanOrEqual(4); // calamity + steading + abandon + resettle
  });

  it('NO `registered: false` park marker survives the lift (shrink-only ledger)', () => {
    expect(
      parkMarkers.map(m => m.file),
      'parked registrable verbs remain — register them in REALM_MANIFEST or add them to the PARKED ledger with their lifting wave',
    ).toEqual([]);
    expect(Object.keys(PARKED_VERBS).length).toBeLessThanOrEqual(PARKED_CEILING);
  });

  it('every factory-shaped verb is claimed by the realm (or settlement) manifest', () => {
    const claimed = new Set([...Object.keys(REALM_MANIFEST), ...Object.keys(AFFORDANCE_MANIFEST)]);
    const unclaimed = [...factoryVerbs, ...entryFactoryTypes].filter(v => !claimed.has(v) && !(v in PARKED_VERBS));
    expect(
      unclaimed,
      `registrable shapes with no manifest entry: ${unclaimed.join(', ')} — the Counterpart Criterion is fail-closed (design LAW 2)`,
    ).toEqual([]);
  });

  it('the pure-mutation verbs (the decree four) are registered by name', () => {
    for (const v of PURE_MUTATION_VERBS) {
      expect(realmVerbFor(v), `${v} missing from REALM_MANIFEST`).toBeTruthy();
    }
  });

  it('the lift census holds: 14 realm verbs — 12 executable, 2 honestly deferred', () => {
    expect(realmVerbs()).toHaveLength(14);
    expect(executableRealmVerbs()).toHaveLength(12);
    const deferred = realmVerbs().filter(v => v.lane === 'deferred').map(v => v.verb).sort();
    expect(deferred).toEqual(['INTERCEPT', 'REINFORCE']);
  });

  it('every entry carries the full §2 surface (predicate shape, dials ≤4, lane, authority)', () => {
    for (const v of realmVerbs()) {
      expect(typeof v.verb, 'verb name').toBe('string');
      expect(typeof v.label).toBe('string');
      expect(typeof v.predicate, `${v.verb} predicate`).toBe('function');
      expect(Array.isArray(v.dials), `${v.verb} dials`).toBe(true);
      expect(v.dials.length, `${v.verb} has ${v.dials.length} dials`).toBeLessThanOrEqual(4);
      expect(['proposal', 'deferred']).toContain(v.lane);
      expect(typeof v.candidateType, `${v.verb} candidateType`).toBe('string');
      expect(typeof v.authority).toBe('string');
      expect(Array.isArray(v.coversVetoCodes)).toBe(true);
      for (const d of v.dials) {
        expect(['enum', 'band', 'range', 'target', 'toggle', 'text']).toContain(d.kind);
        if (d.kind === 'band') {
          expect(Object.keys(d.bandWords).length).toBeGreaterThanOrEqual(2);
          for (const n of Object.values(d.bandWords)) {
            expect(n).toBeGreaterThanOrEqual(d.min ?? 0);
            expect(n).toBeLessThanOrEqual(d.max ?? 1);
          }
        }
        if (d.kind === 'enum') {
          expect(d.options.length).toBeGreaterThanOrEqual(1);
          // composer-realm-verbs-1: NO placeholder-only dial. Every enum option must
          // be a real, apply-resolvable value — never a '__live__'-style sentinel that
          // stages a value the apply arm cannot resolve (the FORCE_RECONSIDERATION bug).
          for (const opt of d.options) {
            expect(String(opt).startsWith('__'), `${v.verb}.${d.key} carries a placeholder option '${opt}'`).toBe(false);
          }
        }
      }
      // The predicate SHAPE is feasibilityGate's: verdict + WHY + unlocks —
      // total over an empty world (never throws on a dark campaign).
      const p = v.predicate({}, { settlements: [] });
      expect(typeof p.available).toBe('boolean');
      expect(Array.isArray(p.reasons)).toBe(true);
      expect(Array.isArray(p.unlocks)).toBe(true);
      if (!p.available) expect(p.reasons.length).toBeGreaterThan(0);
    }
  });

  it('deferred-lane entries are grayed-WITH-REASON (never silently absent, never available)', () => {
    for (const v of realmVerbs().filter(e => e.lane === 'deferred')) {
      const p = v.predicate({ simulationRules: { warLayerEnabled: true, interventionEnabled: true } }, { settlements: [] });
      expect(p.available, `${v.verb} is deferred — its predicate must refuse`).toBe(false);
      expect(p.reasons.join(' ')).toMatch(/deferral|deferred/i);
    }
  });

  it('every coversVetoCodes code renders DM-facing prose (no fallback shrug)', () => {
    for (const v of realmVerbs()) {
      for (const code of v.coversVetoCodes) {
        const prose = realmVetoProse(code, 'X');
        expect(prose, `${v.verb} code ${code}`).toBeTruthy();
        expect(prose).not.toMatch(/^The (change|order) was refused \(/);
      }
    }
  });

  it('candidateTypes are unique across the realm manifest, and the lifecycle pair reuses the ORGANIC types', () => {
    const types = realmVerbs().map(v => v.candidateType);
    expect(new Set(types).size).toBe(types.length);
    // Force ≡ organic at the applier: the forced death/rebirth ride the SAME
    // candidateTypes the organic evaluator emits — zero new apply paths for them.
    expect(realmVerbFor('FORCE_ABANDON').candidateType).toBe('settlement_terminal_death');
    expect(realmVerbFor('FORCE_RESETTLE').candidateType).toBe('settlement_resettled');
  });

  it('the actor-initiated majors keep their contract-tested authority entries', () => {
    // The two re-mint candidateTypes must stay in the canonical policy map —
    // the proposal re-mint closure leans on their auto-with-approval-routing.
    expect(CHANGE_AUTHORITY_POLICY.intervention_ordered).toBeTruthy();
    expect(CHANGE_AUTHORITY_POLICY.blockade_declared).toBeTruthy();
  });

  it('band words stay on the house table (words at the table, numbers in the engine)', () => {
    expect(REALM_SEVERITY_VALUES).toEqual({ minor: 0.35, moderate: 0.6, severe: 0.85 });
  });

  it('THE VOICE: every realm verb is in the glossary; the mechanism whispers are registered', async () => {
    const { buildGlossaryEntries } = await import('../../../src/domain/display/glossary.js');
    const entries = buildGlossaryEntries();
    for (const v of realmVerbs()) {
      expect(
        entries.some(e => e.category === 'realm-verb' && e.term === v.label),
        `${v.verb} missing from the glossary`,
      ).toBe(true);
    }
    // The criterion's final clause: every MECHANISM ships its registered whisper
    // (per-verb teaching rides the existing organs: veto prose, LAPSED badges,
    // grayed-with-reason predicates, the glossary above).
    const { GUIDANCE_WHISPERS } = await import('../../../src/domain/display/guidanceRegistry.js');
    const ids = new Set(GUIDANCE_WHISPERS.map(w => w.id));
    expect(ids.has('realm_orders_teaching')).toBe(true);
    expect(ids.has('realm_docket_teaching')).toBe(true);
  });
});
