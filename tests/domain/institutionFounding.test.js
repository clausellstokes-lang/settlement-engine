/**
 * institutionFounding.test.js — MF-T2Q acceptance.
 *
 * The member is a dated stamp at the institution lifecycle seam plus a pure reader
 * leaf. These arms drive the REAL seam (applyWorldPulseOutcomes → the institution
 * patch applier) rather than the applier in isolation, because the whole seam question
 * is whether the calendar reaches it — an arm that hand-passes the context would prove
 * the applier works and nothing about the wiring.
 *
 * THE SEMANTIC UNDER TEST: `foundedAt` is the calendar year in which the founding
 * outcome was APPLIED. It is WRITE-ONCE — the constructions that create a new
 * institution stamp it; the ones that re-activate an existing record preserve it and
 * never write one. A founding-era institution is never handed an invented year.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { applyWorldPulseOutcomes } from '../../src/domain/worldPulse/applyWorldPulse.js';
import { normalizeSimulationRules } from '../../src/domain/worldPulse/simulationRules.js';
import { institutionFoundingOf, INSTITUTION_FOUNDING_KINDS } from '../../src/domain/institutionFounding.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const NOW = '2026-01-01T00:00:00.000Z';
const GRAPH = { nodes: [], edges: [], channels: [] };

/** A settlement the lifecycle applier will accept. */
function settlement(overrides = {}) {
  return {
    id: 'a',
    name: 'Ashford',
    tier: 'town',
    population: 2000,
    institutions: [],
    ...overrides,
  };
}

/** The world clock as the pulse carries it: a display calendar plus a pulse counter. */
function worldStateAt(year, tick) {
  return { tick, calendar: { elapsedWeeks: (year - 1) * 52, year }, simulationRules: normalizeSimulationRules() };
}

function snapshotFor(sett, ws) {
  const item = { id: 'a', name: sett.name, settlement: sett };
  return { worldState: ws, regionalGraph: GRAPH, settlements: [item], byId: new Map([['a', item]]) };
}

/** Run one institution outcome through the real apply seam at a given clock. */
function applyAt(sett, outcome, year, tick) {
  const ws = worldStateAt(year, tick);
  const result = applyWorldPulseOutcomes({
    snapshot: snapshotFor(sett, ws),
    worldState: ws,
    regionalGraph: GRAPH,
    settlementMap: new Map([['a', { saveId: 'a', settlement: sett }]]),
    outcomes: [outcome],
    tick,
    now: NOW,
    simulationRules: ws.simulationRules,
  });
  const updated = new Map((result.settlementUpdates || []).map(u => [u.saveId, u.settlement]));
  return updated.get('a') || sett;
}

function buildOutcome(name, extra = {}) {
  return {
    id: `candidate.institution.build.a.${name}`,
    type: 'institution',
    candidateType: 'institution_build',
    ruleId: 'institution_build_extraction',
    ruleFamily: 'institution_lifecycle',
    targetSaveId: 'a',
    severity: 0.4,
    applyMode: 'auto',
    headline: `Ashford may raise a ${name}`,
    institutionPatch: { saveId: 'a', action: 'build', name, category: 'industry', reason: 'Sustained prosperity.' },
    ...extra,
  };
}

function foundOutcome(name) {
  return {
    id: `candidate.institution.found.a.${name}`,
    type: 'institution',
    candidateType: 'institution_founding',
    ruleId: 'institution_founding',
    ruleFamily: 'institution_lifecycle',
    targetSaveId: 'a',
    severity: 0.4,
    applyMode: 'auto',
    headline: `Ashford may found a ${name}`,
    institutionPatch: { saveId: 'a', action: 'found', name, category: 'civic', reason: 'The patron seat.' },
  };
}

function instNamed(sett, name) {
  return (sett.institutions || []).find(i => i.name === name);
}

/** Every .js under a directory, tests excluded. */
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    if (statSync(abs).isDirectory()) walk(abs, out);
    else if (/\.(js|jsx)$/.test(entry) && !/\.test\./.test(entry)) out.push(abs);
  }
  return out;
}

describe('MF-T2Q — the institution founding year', () => {
  it('dates a pulse-built institution by the calendar year it came to stand', () => {
    const after = applyAt(settlement(), buildOutcome('Mine'), 18, 40);
    const mine = instNamed(after, 'Mine');
    expect(mine, 'the build outcome must actually land, or every later arm is vacuous').toBeTruthy();
    expect(mine.foundedAt).toEqual({ year: 18, tick: 40 });
    expect(institutionFoundingOf(mine)).toEqual({ kind: 'FOUNDED', year: 18, tick: 40 });
    // The founding lane (the patron seat) dates its new records the same way.
    const founded = instNamed(applyAt(settlement(), foundOutcome('Almshouse'), 18, 40), 'Almshouse');
    expect(founded.foundedAt).toEqual({ year: 18, tick: 40 });
  });

  it('never re-dates on the re-founded path — a founding is its FIRST founding', () => {
    // (a) a record the pulse founded in year 3, let close, and re-founds in year 19.
    const old = {
      name: 'Almshouse', category: 'civic', status: 'remnant', _worldPulseInactive: true,
      _worldPulseFounded: true, foundedAt: { year: 3, tick: 7 },
    };
    const reFounded = applyAt(settlement({ institutions: [old] }), foundOutcome('Almshouse'), 19, 61);
    const raised = instNamed(reFounded, 'Almshouse');
    expect(raised.status).toBe('active');
    expect(raised.foundedAt, 'the original founding year must survive the re-founding').toEqual({ year: 3, tick: 7 });
    expect(institutionFoundingOf(raised)).toEqual({ kind: 'FOUNDED', year: 3, tick: 7 });
    // ...and the re-founding is not lost: it is its own dated history entry.
    const entry = reFounded.institutionHistory.at(-1);
    expect(entry.fate).toBe('founded');
    expect({ year: entry.year, tick: entry.tick }).toEqual({ year: 19, tick: 61 });

    // (b) a FOUNDING-ERA record (no stamp) re-founded in year 19 is NOT handed year 19
    // as its founding — that is the invented-given-past line.
    const cathedral = { name: 'Cathedral', category: 'civic', status: 'remnant', _worldPulseInactive: true };
    const after = applyAt(settlement({ institutions: [cathedral] }), foundOutcome('Cathedral'), 19, 61);
    const risen = instNamed(after, 'Cathedral');
    // anchored: arm (a) two blocks up proves this same path DOES carry a foundedAt when the record has one
    expect(risen.foundedAt).toBeUndefined();
    expect(after.institutionHistory.at(-1).year, 'the re-founding itself is still dated').toBe(19);
  });

  it('dates a deferred outcome by when it landed, not by when it was proposed', () => {
    // The proposal path re-applies the STORED outcome through this very seam, with the
    // CURRENT worldState (applyWorldPulseProposal → applyWorldPulseOutcomes). So the
    // same frozen outcome object, applied at two different clocks, must take the clock
    // it was applied at.
    const stored = buildOutcome('Tannery');
    const early = instNamed(applyAt(settlement(), stored, 18, 40), 'Tannery');
    const late = instNamed(applyAt(settlement(), stored, 19, 61), 'Tannery');
    expect(early.foundedAt).toEqual({ year: 18, tick: 40 });
    expect(late.foundedAt).toEqual({ year: 19, tick: 61 });
    // The outcome itself was never mutated — the date is not riding in the patch.
    expect(stored.institutionPatch.foundedAt).toBeUndefined(); // anchored: both readings above are non-undefined, so the field really is produced at apply time
  });

  it('types every institution, and absence is the typed value', () => {
    // Positive control first (§P3): a stamped record really does read FOUNDED.
    expect(institutionFoundingOf({ name: 'Mine', foundedAt: { year: 18, tick: 40 } }))
      .toEqual({ kind: 'FOUNDED', year: 18, tick: 40 });
    // A generation-era institution: no stamp, no pulse marker ⇒ it has stood since the founding.
    expect(institutionFoundingOf({ name: 'Cathedral' })).toEqual({ kind: 'PRE_SEED' });
    // A legacy save the pulse built BEFORE the stamp existed is not pre-seed, and no
    // year is invented for it either.
    expect(institutionFoundingOf({ name: 'Mine', createdByWorldPulseOutcomeId: 'o1' }))
      .toEqual({ kind: 'FOUNDED_UNDATED' });
    // THE MARKER-SET CORRECTNESS PIN: a founding-era institution the pulse merely
    // REOPENED carries _worldPulseEconomyBuilt, and must still read PRE_SEED.
    expect(institutionFoundingOf({ name: 'Cathedral', _worldPulseEconomyBuilt: true, reopenedByWorldPulseOutcomeId: 'o2' }))
      .toEqual({ kind: 'PRE_SEED' });
    // A half-written stamp is absence, not a repairable date.
    expect(institutionFoundingOf({ name: 'Mine', foundedAt: { year: 18 } })).toEqual({ kind: 'PRE_SEED' });
    expect(institutionFoundingOf(null)).toEqual({ kind: 'PRE_SEED' });
    expect(INSTITUTION_FOUNDING_KINDS).toEqual(['FOUNDED', 'FOUNDED_UNDATED', 'PRE_SEED']);
  });

  it('dates institutionHistory entries without moving the 24-entry ring cap', () => {
    const filler = Array.from({ length: 24 }, (_, i) => ({ name: `Old ${i}`, fate: 'shuttered' }));
    const before = settlement({ institutionHistory: filler });
    expect(before.institutionHistory).toHaveLength(24);
    const after = applyAt(before, buildOutcome('Mine'), 18, 40);
    expect(after.institutionHistory, 'the ring cap must not move').toHaveLength(24);
    const entry = after.institutionHistory.at(-1);
    expect(entry.fate).toBe('built');
    expect({ year: entry.year, tick: entry.tick }).toEqual({ year: 18, tick: 40 });
    // The damping still reads `fate` off entries that now also carry a date.
    expect(entry.name).toBe('Mine');
    // The oldest filler really was pushed out — the cap is a ring, not a truncation.
    expect(after.institutionHistory[0].name).toBe('Old 1'); // anchored: the pre-apply array is length-pinned at 24 three lines up
  });

  it('stays unreachable from generation, so the generator golden cannot move', () => {
    // The generator golden hashes JSON.stringify(settlement) WHOLE, so the leaf's
    // dormancy claim IS this reachability fence.
    const sources = [...walk(join(ROOT, 'src/generators')), ...walk(join(ROOT, 'src/data'))]
      .map(abs => relative(ROOT, abs).replace(/\\/g, '/'));
    expect(sources.length, 'guard-the-guard: the scan must actually read the generation tree').toBeGreaterThan(20);
    const IMPORT_RE = /institutionFounding(\.js)?['"]/;
    // Guard-the-guard: the matcher really does fire on the string it is hunting.
    expect(IMPORT_RE.test("import { institutionFoundingOf } from '../domain/institutionFounding.js'")).toBe(true);
    const importers = sources.filter(rel => IMPORT_RE.test(readFileSync(join(ROOT, rel), 'utf8')));
    expect(importers, 'a generation-path import of the founding leaf would put it inside the golden').toEqual([]);
  });

  it('leaves the already-standing no-op a same-reference no-op', () => {
    const standing = settlement({ institutions: [{ name: 'Mine', category: 'industry', status: 'active' }] });
    const ws = worldStateAt(18, 40);
    const result = applyWorldPulseOutcomes({
      snapshot: snapshotFor(standing, ws),
      worldState: ws,
      regionalGraph: GRAPH,
      settlementMap: new Map([['a', { saveId: 'a', settlement: standing }]]),
      outcomes: [buildOutcome('Mine')],
      tick: 40,
      now: NOW,
      simulationRules: ws.simulationRules,
    });
    const updated = new Map((result.settlementUpdates || []).map(u => [u.saveId, u.settlement]));
    // The house contract: nothing changed, so the SAME settlement object comes back —
    // a stamp must never turn an idempotent re-apply into a write.
    expect(updated.get('a')).toBe(standing);
    expect(instNamed(standing, 'Mine').foundedAt).toBeUndefined(); // anchored: arm 1 proves a real build on this same seam does produce foundedAt
  });
});
