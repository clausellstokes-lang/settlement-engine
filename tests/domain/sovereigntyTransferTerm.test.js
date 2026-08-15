/**
 * sovereigntyTransferTerm.test.js — WR-10a: THE CATALOG ROW, and the proof that
 * registering it changed nothing (DESIGN_WAR_RULINGS_ARCHITECTURE.md §WR-10,
 * "The instrument": a settlement trade IS a treaty).
 *
 * THE REGISTRATION-FIRST PRECEDENT. `non_intervention` landed the same way one wave
 * earlier: `executor:'seam'` and NO `CLASS_TERM` entry, with the inline rationale
 * "no producer yet ⇒ never drafted ⇒ byte-identical". This file makes that claim
 * MECHANICAL for `sovereignty_transfer` rather than repeating it as prose, because
 * the whole value of a registration-first row is that the world does not move when
 * it lands, and an unproven "it cannot be drafted" is exactly the kind of sentence
 * that is true on the day it is written and false four waves later.
 *
 * THE BYTE-IDENTITY ARGUMENT, STATED SO IT CAN BE FALSIFIED. A term reaches a treaty
 * through exactly one road: `peaceTermsAppraisal` maps an asset class to a term type
 * via `CLASS_TERM`, and `draftTerms` walks the resulting ranked assets. A term type
 * that no asset class names is therefore unreachable from every production caller —
 * not "not currently drafted", but structurally unreachable. That is the claim pinned
 * below, and it is pinned WITH ITS MUTANT: the same predicate is run against a
 * CLASS_TERM that DOES name the term, and must catch it. Without the mutant the
 * absence pin is vacuous the moment the map is reshaped.
 *
 * THE FAMILY IS FORCED, NOT CHOSEN, and that is worth a pin of its own. Amendment S
 * puts "the asset on one side, ANY composition of EXISTING term families on the
 * other". Under §13 one-per-family stacking (peaceTermsDrafting.js), a
 * sovereignty_transfer sharing a family with any existing term would make itself
 * mutually exclusive with the very consideration it is exchanged for. The pin asserts
 * the family is UNSHARED — which is the property amendment S actually needs, and it
 * would have caught the tempting-but-wrong 'sovereignty' placement (already held by
 * non_intervention, and slated to hold TB-4's route_restriction).
 */
import { describe, it, expect } from 'vitest';
import {
  TERM_CATALOG, TERM_TYPES, TERM_FAMILIES, CLASS_TERM, termLabel,
} from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { draftTerms } from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { SUBORDINATING_TERM_TYPES } from '../../src/domain/worldPulse/hegemony.js';
import { TREATY_COMPLIANCE_VOICE, treatyStrainLine } from '../../src/domain/display/treatyDocument.js';

const TYPE = 'sovereignty_transfer';

/** THE PREDICATE UNDER TEST, extracted so the mutant can run the SAME code path.
 *  Which term types can a production caller reach? Exactly the values of CLASS_TERM
 *  (peaceTermsAppraisal.js:202 is the only read, and `resource_share` falls back to
 *  `tribute` there — a fallback that also names a catalog key, so the value set is
 *  the whole reachable set). @param {Record<string,string>} classTerm */
const draftableTypes = (classTerm) => new Set(Object.values(classTerm).map(String));

describe('WR-10a — the sovereignty_transfer catalog row', () => {
  it('is registered, well-formed, and a seam executor (the non_intervention precedent)', () => {
    const spec = TERM_CATALOG[TYPE];
    expect(spec, 'sovereignty_transfer is a TERM_CATALOG row').toBeTruthy();
    expect(spec.executor).toBe('seam');
    expect(spec.stream).toBe(false);
    expect(spec.baseMag).toBe(1); // sovereignty does not come in fractions
    expect(spec.weight).toBeGreaterThan(0);
    expect(spec.maxYears).toBeGreaterThanOrEqual(spec.baseYears);
    expect(TERM_TYPES).toContain(TYPE);
    expect(TERM_FAMILIES).toContain(spec.family);
  });

  it('is the HEAVIEST and most DURABLE ask in the catalog (a town conveyed outprices a seat installed)', () => {
    const others = TERM_TYPES.filter((t) => t !== TYPE).map((t) => TERM_CATALOG[t]);
    const spec = TERM_CATALOG[TYPE];
    expect(spec.weight).toBeGreaterThan(Math.max(...others.map((s) => s.weight)));
    expect(spec.maxYears).toBeGreaterThan(Math.max(...others.map((s) => s.maxYears)));
  });

  it('holds its family ALONE — amendment S needs it composable with every existing family', () => {
    const family = TERM_CATALOG[TYPE].family;
    const sharers = TERM_TYPES.filter((t) => t !== TYPE && TERM_CATALOG[t].family === family);
    expect(sharers, `no other term may share ${family} — §13 stacking would make them exclusive`).toEqual([]);
    // The concrete near-miss this pin exists to catch: 'sovereignty' is already taken.
    expect(family).not.toBe('sovereignty'); // anchored: non_intervention holds 'sovereignty' and is asserted present on the line below, so this cannot pass by the family vocabulary emptying
    expect(TERM_CATALOG.non_intervention.family).toBe('sovereignty');
  });

  // ── BYTE-IDENTITY: unreachable from every production caller ────────────────
  it('NO asset class drafts it — and the same predicate CATCHES a class that does (executed mutant)', () => {
    expect(draftableTypes(CLASS_TERM).has(TYPE), 'live CLASS_TERM cannot reach it').toBe(false);
    // THE MUTANT. Give `government` the transfer instead of puppet_seat; the predicate
    // must flip. A green here with a red above would mean the scan stopped seeing the map.
    const mutant = { ...CLASS_TERM, government: TYPE };
    expect(draftableTypes(mutant).has(TYPE), 'the mutant map IS caught').toBe(true);
  });

  it('GUARD-THE-GUARD: the same predicate finds the classes that DO draft, so it has not gone blind', () => {
    const reachable = draftableTypes(CLASS_TERM);
    expect(reachable.has('tribute')).toBe(true);
    expect(reachable.has('puppet_seat')).toBe(true);
    // Every reachable name is a real catalog key — a map naming a ghost would be the
    // other way this scan could rot into agreement with itself.
    for (const t of reachable) expect(TERM_CATALOG[t], `${t} is a catalog key`).toBeTruthy();
  });

  it('the real drafter emits nothing when the appraisal offers every class it can (no ghost term)', () => {
    // Feed draftTerms exactly what appraiseLoserPortfolio can produce: one asset per
    // asset class, at its canonical term type. The conveyance cannot appear because no
    // class names it — this is the drafting-side half of the unreachability claim.
    const ranked = Object.keys(CLASS_TERM).sort().map((assetClass, i) => ({
      assetClass, termType: CLASS_TERM[assetClass], value: 1 - i * 0.01,
    }));
    const { terms } = draftTerms({ ranked, budget: 99, margin01: 1, press: 1.4, tick: 0 });
    expect(terms.length).toBeGreaterThan(0); // non-vacuity: the drafter really ran
    expect(terms.map((t) => t.type)).not.toContain(TYPE); // anchored: the line above proves the drafted set is non-empty, so this cannot pass by drafting nothing at all
  });

  // ── THE SURFACES A NEW TYPE + NEW FAMILY OWE ──────────────────────────────
  it('carries an authored label rather than the underscore fallback', () => {
    expect(termLabel(TYPE)).toBe('cession of sovereignty');
    expect(termLabel(TYPE)).not.toBe(TYPE.replace(/_/g, ' ')); // anchored: the exact expected label is asserted on the line above, so this cannot pass by termLabel returning empty
  });

  it('the new family carries an authored house voice in all three compliance states', () => {
    const family = TERM_CATALOG[TYPE].family;
    const row = TREATY_COMPLIANCE_VOICE[family];
    expect(row, `${family} has a voice row (peaceTermsWave3 totality would red without it)`).toBeTruthy();
    for (const state of ['honored', 'strained', 'defaulted']) {
      expect(typeof row[state]).toBe('string');
      expect(/[.!?]$/.test(row[state]), 'terminal punctuation').toBe(true);
      // It must be the AUTHORED row, not the generic floor reached through the fallback.
      expect(treatyStrainLine(family, state)).toBe(row[state]);
    }
  });

  it('is NOT a subordinating tie: a sold satellite is property changing owner, not a knee bending', () => {
    expect(SUBORDINATING_TERM_TYPES.length).toBeGreaterThan(0); // non-vacuity
    expect(SUBORDINATING_TERM_TYPES).not.toContain(TYPE); // anchored: the line above proves the roster is non-empty, and the line below names a member that must stay in it
    expect(SUBORDINATING_TERM_TYPES).toContain('puppet_seat');
  });
});
