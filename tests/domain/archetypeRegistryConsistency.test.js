import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { supportedConditionArchetypes } from '../../src/domain/activeConditions.js';
import {
  WAR_LAYER_ARCHETYPES, WAR_HOME_CONDITIONS, WAR_RECOVERY_CONDITIONS,
} from '../../src/domain/worldPulse/archetypeCatalog.js';

// ─────────────────────────────────────────────────────────────────────────
// F0 cross-registry drift invariant (guards the future F5 "archetypeCatalog"
// extraction). Today the condition-archetype vocabulary lives ONLY in
// activeConditions.js (CONDITION_ARCHETYPE_TEMPLATES, surfaced by
// supportedConditionArchetypes()). Several consumers hard-code archetype-id
// string Sets/lists that classify a live condition into a pressure/flow
// family:
//   • worldPulse/pressureModel.js  — FOOD/CONFLICT/TRADE/… _ARCHETYPES Sets
//   • worldPulse/populationDynamics.js — INFLUX/FOOD_CRISIS/… _ARCHETYPES Sets
//   • conditionPromotion.js        — STRESSOR_ARCHETYPE_RULES[].archetype, the
//                                    GEN-stressor → catalog-archetype mapping.
//
// A consumer Set that names an archetype the catalog DOESN'T define is a
// SILENT no-op: `someSet.has(condition.archetype)` simply never matches, so
// the pressure/flow it was meant to gate quietly stops firing — no error, no
// log, no test. This file turns that silent drift into a build failure: every
// referenced archetype id MUST resolve to a real catalog entry.
//
// Forward invariant only (each consumer Set ⊆ catalog). The reverse direction
// — catalog entries referenced by NO consumer Set — is NOT hard-failed here:
// most archetypes are reached through the generator/stressor/regional layers
// (regexes, channel templates) rather than these classification Sets, so a
// "dead entry" check would fail against current code. That direction is the
// future F5 concern (when archetypeCatalog.js lands and can own a single
// canonical reference index); it is exposed below as INFORMATIONAL only.
//
// Why read source text instead of importing the Sets: pressureModel and
// populationDynamics keep these Sets module-PRIVATE (not exported), and the
// whole point of the tripwire is to read what the consumer literally declares,
// not a re-exported convenience copy that could itself drift. The parse is
// guarded against silently matching nothing by per-Set non-empty assertions
// (see anti-vacuity).
// ─────────────────────────────────────────────────────────────────────────

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(HERE, '../../src');

function readSrc(rel) {
  return readFileSync(path.join(SRC, rel), 'utf8');
}

/**
 * Pull the single-quoted string literals out of a `NAME = new Set([ ... ])`
 * declaration in `src`. Returns null when the named Set is absent (a rename /
 * refactor the test must NOT silently treat as an empty, vacuously-passing
 * set).
 */
function extractSetLiterals(src, name) {
  const re = new RegExp(`${name}\\s*=\\s*new Set\\(\\[([^\\]]*)\\]`);
  const m = src.match(re);
  if (!m) return null;
  return [...m[1].matchAll(/'([^']+)'/g)].map(x => x[1]);
}

const CATALOG = new Set(supportedConditionArchetypes());

// The named archetype-id Sets in each consumer (found by grepping for
// `_ARCHETYPES = new Set([` in the worldPulse layer).
const PRESSURE_MODEL_SETS = [
  'FOOD_ARCHETYPES',
  'SUPPLIER_FOOD_CRISIS_ARCHETYPES',
  'DISEASE_ARCHETYPES',
  'CONFLICT_ARCHETYPES',
  'TRADE_ARCHETYPES',
  'LEGITIMACY_ARCHETYPES',
  'DEFENSE_ARCHETYPES',
  'CRIME_ARCHETYPES',
];
const POPULATION_DYNAMICS_SETS = [
  'INFLUX_ARCHETYPES',
  'FOOD_CRISIS_ARCHETYPES',
  'DISEASE_CRISIS_ARCHETYPES',
  'WAR_CRISIS_ARCHETYPES',
  'BURDEN_ARCHETYPES',
  'RECOVERY_ARCHETYPES',
  'CRISIS_FLIGHT_ARCHETYPES',
];

function loadConsumerSets() {
  const pmSrc = readSrc('domain/worldPulse/pressureModel.js');
  const pdSrc = readSrc('domain/worldPulse/populationDynamics.js');
  const sets = [];
  for (const name of PRESSURE_MODEL_SETS) {
    sets.push({ consumer: 'pressureModel.js', name, ids: extractSetLiterals(pmSrc, name) });
  }
  for (const name of POPULATION_DYNAMICS_SETS) {
    sets.push({ consumer: 'populationDynamics.js', name, ids: extractSetLiterals(pdSrc, name) });
  }
  return sets;
}

/**
 * Pull the `archetype: '…'` target values out of the
 * `STRESSOR_ARCHETYPE_RULES = Object.freeze([ … ])` table — the GEN-stressor →
 * condition-archetype mapping in conditionPromotion.js. Each value is an
 * archetype the promoter will STAMP onto a real condition, so each must exist
 * in the catalog or the promoted condition inherits no template (defaults).
 */
function loadPromotionArchetypes() {
  const src = readSrc('domain/conditionPromotion.js');
  const block = src.match(/STRESSOR_ARCHETYPE_RULES\s*=\s*Object\.freeze\(\[([\s\S]*?)\]\s*\)/);
  if (!block) return null;
  return [...block[1].matchAll(/archetype:\s*'([^']+)'/g)].map(x => x[1]);
}

describe('archetype registry — cross-consumer drift invariant', () => {
  test('the catalog (activeConditions.js) is the non-trivial source of truth', () => {
    // Anti-vacuity: a plausibly-large catalog, so the subset checks below are
    // not satisfied by a near-empty universe. (30 today; the >10 floor is the
    // tripwire, not a freeze.)
    expect(CATALOG.size).toBeGreaterThan(10);
    // Spot-check a couple of canonical members the consumers rely on, proving
    // we loaded the real registry and not an empty stand-in.
    expect(CATALOG.has('famine')).toBe(true);
    expect(CATALOG.has('regional_migration_pressure')).toBe(true);
    expect(CATALOG.has('custom_crisis')).toBe(true);
  });

  test('every pressureModel + populationDynamics archetype Set is a non-empty subset of the catalog', () => {
    const sets = loadConsumerSets();

    // Anti-vacuity #1: we actually located all 15 named Sets. A rename that
    // makes extractSetLiterals return null must fail LOUDLY here, not pass by
    // iterating over nothing.
    const missing = sets.filter(s => s.ids === null).map(s => `${s.consumer}:${s.name}`);
    expect(missing).toEqual([]);

    // Anti-vacuity #2: every located Set parsed at least one archetype id, so
    // the per-Set subset assertions below are exercised, not vacuously true.
    for (const s of sets) {
      expect(s.ids.length, `${s.consumer}:${s.name} parsed no archetype ids`).toBeGreaterThan(0);
    }
    const totalReferenced = sets.reduce((n, s) => n + s.ids.length, 0);
    expect(totalReferenced).toBeGreaterThan(10);

    // The forward invariant: NOTHING a consumer Set names may be absent from
    // the catalog. Any offender is named in the failure (consumer:set -> id).
    const drift = [];
    for (const s of sets) {
      for (const id of s.ids) {
        if (!CATALOG.has(id)) drift.push(`${s.consumer}:${s.name} -> '${id}'`);
      }
    }
    expect(drift).toEqual([]);
  });

  test('every STRESSOR_ARCHETYPE_RULES promotion target resolves to a catalog entry', () => {
    const targets = loadPromotionArchetypes();

    // Anti-vacuity: the rules table was found and yielded promotion targets.
    expect(targets).not.toBeNull();
    expect(targets.length).toBeGreaterThan(5);

    const drift = [...new Set(targets)].filter(a => !CATALOG.has(a));
    expect(drift).toEqual([]);
  });

  test('per-consumer subset holds set-by-set (locates the offending family, not just "some drift")', () => {
    for (const { consumer, name, ids } of loadConsumerSets()) {
      expect(ids, `${consumer}:${name} not found`).not.toBeNull();
      const offenders = ids.filter(id => !CATALOG.has(id));
      expect(offenders, `${consumer}:${name} references non-catalog archetypes`).toEqual([]);
    }
  });

  // INFORMATIONAL (NOT a hard failure today): catalog entries that none of the
  // classification Sets above reference. These are reached by the generator /
  // stressor regexes / regional channel templates, not these Sets — so a
  // hard "dead entry" assertion would fail against current code. This pin
  // simply EXPOSES the set so the F5 archetypeCatalog work has a baseline; it
  // asserts only that the unreferenced list is a well-formed subset of the
  // catalog (never names a phantom), and is the documented future direction.
  test('[informational] catalog entries unreferenced by the classification Sets are a documented baseline', () => {
    const referenced = new Set();
    for (const { ids } of loadConsumerSets()) {
      for (const id of ids || []) referenced.add(id);
    }
    for (const id of loadPromotionArchetypes() || []) referenced.add(id);

    const unreferenced = [...CATALOG].filter(id => !referenced.has(id)).sort();

    // Sanity: the "unreferenced" set is genuinely drawn from the catalog —
    // every entry is a real archetype, so this informational surface can
    // never accuse a phantom.
    for (const id of unreferenced) expect(CATALOG.has(id)).toBe(true);

    // And the classification Sets are NOT exhaustive of the catalog (proving
    // this informational direction is live, not vacuous) — there genuinely are
    // catalog archetypes those Sets never name.
    expect(unreferenced.length).toBeGreaterThan(0);
  });

  // F5: the declarative war-layer groupings in archetypeCatalog.js are a new
  // CONSUMER — every id they name must resolve to a real catalog entry, or a typo
  // in the grouping silently no-ops at a deployment/recovery site.
  test('every archetypeCatalog war-layer grouping is a subset of the catalog', () => {
    expect(WAR_LAYER_ARCHETYPES.length).toBeGreaterThan(5); // anti-vacuity
    const drift = WAR_LAYER_ARCHETYPES.filter(a => !CATALOG.has(a));
    expect(drift, 'archetypeCatalog war-layer groupings reference non-catalog archetypes').toEqual([]);
    // The aggressor-home + recovery archetypes F5 introduced are present.
    for (const a of [...WAR_HOME_CONDITIONS, ...WAR_RECOVERY_CONDITIONS]) {
      expect(CATALOG.has(a), `${a} missing from the catalog`).toBe(true);
    }
    expect(CATALOG.has('war_drain')).toBe(true);
    expect(CATALOG.has('army_deployed')).toBe(true);
  });
});
