/**
 * emigreErrand.test.js — INT-3b. The émigré mint seam's eight-case acceptance matrix.
 *
 * ⚠ EVERY ABSENCE HERE IS SPELLED AS AN EQUALITY AGAINST AN EMPTY LIST WITH A POSITIVE
 * CONTROL BESIDE IT, never as `not.toContain` / `not.toMatch` / `not.toHaveProperty`. That
 * is deliberate and it is the §31 anchor preflight discharged BY CONSTRUCTION: this file is
 * NEW, and `.negative-assertion-anchor`'s frozen worklist is shrink-only and exact, so a new
 * row for a new file is precisely the edit that ratchet forbids. Spelling the absences as
 * `toEqual([])` past a driven detector buys the same proof and owes no row — and it is the
 * stronger shape anyway, because an empty-list equality PRINTS the offenders it found.
 *
 * ⚠ STRAIGHT-LINE REGISTRATION, LITERAL TITLES, ONE `describe`. No `test.each()`, no
 * `describe.runIf()`, no conditional registration anywhere: a `.each` case is invisible to
 * the estate lighting census by construction and a `runIf` parks the file WHOLE, either of
 * which would close that census's arithmetic while measuring nothing.
 *
 * ⚠ `errandSpineEnabled` IS SPELLED AS A LITERAL in A1/A2/A3 rather than through a computed
 * key. Not for lit-coverage credit — that flag is SP's and is already covered — but because
 * a computed key attributes to NO key, and this estate has already paid once for learning it.
 *
 * @enforced-by itself
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';

import { emigreErrandFor } from '../../src/domain/worldPulse/emigreErrand.js';
import { ERRAND_CONSUMERS } from '../../src/domain/worldPulse/envoyErrandVocabulary.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = join(ROOT, 'src');
const MODULE_REL = 'src/domain/worldPulse/emigreErrand.js';
const EXPORT_NAME = 'emigreErrandFor';

/** Strip comments, so the module's own prose can neither create nor hide a finding. */
const executableSource = (source) => source
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/.*$/gm, '');

const moduleSource = executableSource(readFileSync(join(ROOT, MODULE_REL), 'utf8'));

/** One defeated claimant's flight from the seat he lost to the town that will host him. */
const flight = (worldState) => emigreErrandFor({
  worldState,
  fromId: 'seat-of-the-loser',
  toId: 'haven-across-the-water',
  departTick: 4,
  arrivalTick: 9,
});

/** The same claimant, refused: a flight to the seat he is fleeing is not a journey. */
const flightToNowhere = (worldState) => emigreErrandFor({
  worldState,
  fromId: 'seat-of-the-loser',
  toId: 'seat-of-the-loser',
  departTick: 4,
  arrivalTick: 9,
});

describe('INT-3b emigre errand — the mint seam, dark-safe and number-free', () => {
  test('A1 LIT: a defeated claimant priced from a real pair mints through the spine, and the plan carries the caller\'s own ticks unchanged', () => {
    const answer = flight({ simulationRules: { errandSpineEnabled: true } });
    expect(answer.reason).toBe('spine');
    expect(answer.ok).toBe(true);
    expect(answer.lit).toBe(true);
    // THE CLASS RESOLVED, and `reason: 'spine'` is the proof rather than a separate read:
    // an unlawful or unresolvable class returns `invalid_purpose_class` from the same call,
    // so reaching 'spine' at all is the head certifying that 'factional' was accepted.
    const legs = /** @type {Array<Record<string, unknown>>} */ (answer.plan?.legs);
    expect(legs).toHaveLength(1);
    expect(legs[0].fromId).toBe('seat-of-the-loser');
    expect(legs[0].toId).toBe('haven-across-the-water');
    expect(legs[0].journey).toBe('outbound');
    // ⭐ THE TICKS ARE THE CALLER'S OWN, UNCHANGED. This leaf owns no clock fraction and
    // prices no journey; a leg that came back rounded, floored or shifted would mean the
    // seam had grown a speed law the transit owner is supposed to hold alone.
    expect(legs[0].departTick).toBe(4);
    expect(legs[0].arrivalTick).toBe(9);
  });

  test('A2 FENCE, dormancy: with the flag absent the same call answers dark, the road is still priced, and no field block rides out', () => {
    const lit = flight({ simulationRules: { errandSpineEnabled: true } });
    const dark = flight({ simulationRules: {} });
    expect(dark.reason).toBe('dark');
    expect(dark.ok).toBe(true);
    expect(dark.lit).toBe(false);
    // THE NARROWED SHAPE IS THE WHOLE SURFACE, asserted as an exact key set rather than as
    // an absence: the head's `fields` block never rides out of this leaf in EITHER world, so
    // a dark world cannot carry a class and a lit world cannot leak one past the narrowing.
    expect(Object.keys(dark).sort()).toEqual(['lit', 'ok', 'plan', 'reason']);
    expect(Object.keys(lit).sort()).toEqual(['lit', 'ok', 'plan', 'reason']);
    // ⭐ AND THE FLAG MOVED EXACTLY TWO ANSWERS AND NOTHING ELSE. Asserted only AFTER A1 has
    // shown the lit path really mints: the plan is byte-identical across the two worlds, so
    // the gate changes what the errand IS and never whether the roads are real.
    expect(JSON.stringify(dark.plan)).toBe(JSON.stringify(lit.plan));
    expect({ ...dark, reason: lit.reason, lit: lit.lit }).toEqual(lit);
  });

  test('A3 FENCE, absent vs false: an explicit false and an absent key are one state at the decision site', () => {
    const explicitlyFalse = flight({ simulationRules: { errandSpineEnabled: false } });
    const absent = flight({ simulationRules: {} });
    // BYTE-IDENTICAL, not merely equivalent. The gate is read `=== true`, so there is no
    // third state for a later reader to discover — and no campaign pays a byte for a flag
    // it never lit.
    expect(JSON.stringify(explicitlyFalse)).toBe(JSON.stringify(absent));
    expect(explicitlyFalse.reason).toBe('dark');
  });

  test('A4 the road is not the flag\'s to change: an unpriceable flight is refused identically lit and dark', () => {
    const lit = flightToNowhere({ simulationRules: { errandSpineEnabled: true } });
    const dark = flightToNowhere({ simulationRules: {} });
    expect(lit.reason).toBe('invalid_route_plan');
    expect(lit.ok).toBe(false);
    expect(lit.lit).toBe(false);
    expect(lit.plan).toBeNull();
    // The head normalizes the plan FIRST and unconditionally, so the refusal is the SAME
    // refusal at the SAME moment in both worlds — a flag that could make an impossible road
    // possible would be a flag that owns the map.
    expect(JSON.stringify(dark)).toBe(JSON.stringify(lit));
  });

  test('A5 THE REGISTRY IS TRUE: the pre-reserved ambitious row now names a module that exists and really mints', () => {
    const row = ERRAND_CONSUMERS.find((candidate) => candidate.consumer === 'ambitious');
    expect(row).toBeDefined();
    expect(row?.built).toBe(true);
    expect(row?.purposeClass).toBe('factional');
    expect(row?.module).toBe(MODULE_REL);
    expect(row?.wave).toBe('INT-3b');
    // The address the registry chose at SP-D is now a file. Before this wave the row was a
    // promise pointing at nothing; the walker measures the other direction, and this is the
    // acceptance side of the same fact.
    expect(existsSync(join(ROOT, String(row?.module)))).toBe(true);
  });

  test('A6 THE IDENTITY CLAIM: nothing in src/ calls the export, so the seam is dormant by having no caller at all', () => {
    /** @param {string} dir @param {string[]} out */
    const walk = (dir, out) => {
      for (const entry of readdirSync(dir)) {
        const path = join(dir, entry);
        if (statSync(path).isDirectory()) walk(path, out);
        else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(path);
      }
      return out;
    };
    /** @type {string[]} */
    const files = walk(SRC, []);
    // NON-VACUITY FIRST: a collapsed walk would make the absence below trivially true.
    expect(files.length).toBeGreaterThan(1500);
    const callRe = new RegExp(`(?:^|[^\\w$.])${EXPORT_NAME}\\s*\\(`);
    // POSITIVE CONTROL: the detector really does fire on the spelling it is hunting, driven
    // here rather than trusted, so an empty result below is a measurement and not a regex
    // that quietly stopped matching.
    expect(callRe.test(`const answer = ${EXPORT_NAME}({ worldState });`)).toBe(true);
    expect(callRe.test(`import { ${EXPORT_NAME} } from './emigreErrand.js';`)).toBe(false);
    const callers = files
      .map((absolute) => ({
        rel: relative(ROOT, absolute).replace(/\\/g, '/'),
        code: executableSource(readFileSync(absolute, 'utf8')),
      }))
      .filter(({ rel }) => rel !== MODULE_REL)
      .filter(({ code }) => callRe.test(code))
      .map(({ rel }) => rel)
      .sort();
    // ⭐ THE WAVE'S IDENTITY, and the reason its dormancy needs no fence: with no caller, no
    // seed, flag, preset or lifecycle path can reach the module, so every lifecycle path is
    // the same path. INT-3b-ii's trigger is what will retire this case.
    expect(callers).toEqual([]);
  });

  test('A7 ZERO AUTHORED NUMBERS: the module\'s executable source contains no numeric literal at all', () => {
    // NON-VACUITY: the stripped source must still be the real module, or "no digits" is a
    // statement about an empty string.
    expect(moduleSource).toContain('mintErrandSpine(');
    expect(moduleSource).toContain('export function emigreErrandFor(');
    // ⭐ THE WHOLE POINT: a share, band, cap, window, threshold or tuning key authored here
    // would be a chair act under OQ §42/§43, and this member spends nothing the chair has
    // not signed. The five values the design volume names for the émigré all belong to named
    // successors, each owed its own executed derivation.
    expect(moduleSource.match(/\d/g) ?? []).toEqual([]);
  });

  test('A8 THE ONE-READER LAW FROM THE INSIDE: the class rides the mint call as a quoted literal, never as a field read', () => {
    const FIELDS = 'purposeClass|declaredPurpose|truePurpose';
    const rawFieldRe = new RegExp(`\\.\\s*(?:${FIELDS})\\b`);
    const computedFieldRe = new RegExp(`\\[\\s*['"\`](?:${FIELDS})['"\`]\\s*\\]`);
    const patternElementRe = new RegExp(
      `^\\s*(?:${FIELDS})\\s*(?::\\s*[A-Za-z_$][\\w$]*)?(?:=[^,]*)?\\s*$`,
    );
    /** @param {string} code */
    const readsByPattern = (code) => (code.match(/\{[^{}]*\}/g) || []).some((group) => group
      .slice(1, -1).split(',').some((element) => patternElementRe.test(element)));
    /** @param {string} code */
    const readsAField = (code) => rawFieldRe.test(code)
      || computedFieldRe.test(code) || readsByPattern(code);
    // EACH DOOR DRIVEN THROUGH THE COMPOSED PREDICATE, never merely pinned on its own regex:
    // a predicate assembled from three halves hides its own deletion otherwise, which this
    // estate measured once already on the walker this case mirrors.
    expect(readsAField("if (errand.purposeClass === 'covert') run();")).toBe(true);
    expect(readsAField('return errand["truePurpose"];')).toBe(true);
    expect(readsAField('const { truePurpose } = errand;')).toBe(true);
    // ⛔ THE OFFENDING SPELLING THIS CASE EXISTS TO FORBID, and the clean one beside it: a
    // NAMED CONSTANT for the class is an element renamed to an identifier and reds the law,
    // while a quoted literal is clean. That is why this module defines no constant for its
    // own class — measured at the code of record, not assumed.
    expect(readsAField('mint({ purposeClass: EMIGRE_CLASS });')).toBe(true);
    expect(readsAField("mint({ purposeClass: 'factional' });")).toBe(false);
    // ⭐ AND THE MODULE ITSELF IS CLEAN UNDER ALL THREE DOORS.
    expect(readsAField(moduleSource)).toBe(false);
    expect(moduleSource).toContain("purposeClass: 'factional'");
  });
});
