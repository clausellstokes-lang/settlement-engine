/**
 * stressorSpinePhrases.js — the NOUN-PHRASE vocabulary the simulation spine
 * speaks about stressors.
 *
 * Why this file exists (the defect it retires):
 *
 * The spine composes single-line answers by dropping a phrase into a frame:
 * "It is currently strained by ___" and "Its people fear ___". Both slots want
 * a NOUN PHRASE. Nothing else in the stressor catalog is one:
 *
 *   - `STRESS_TYPE_MAP[t].label` is a DISPLAY label in title case ("Under
 *     Siege", "Beast & Raider Threat"). Dropped into the frame it produced
 *     "strained by under Siege" once the old composer lowercased only the
 *     first character.
 *   - `entry.summary` and the governance vignette in
 *     `powerStructure.recentConflict` are multi-sentence NARRATIVE BODIES.
 *     Spliced into the fear slot, one of them shipped this to every first-run
 *     user: "People fear a return of the settlement is under active siege.
 *     Every resource decision is a military decision. The debate is no longer
 *     about policy - it is about survival.." A body is not a phrase, and no
 *     amount of string surgery makes it one.
 *   - `crisisHook` and `viabilityNote` are likewise whole paragraphs aimed at
 *     the DM, not at a slot in a sentence.
 *
 * So the phrase a settlement is STRAINED BY, and the thing its people FEAR,
 * are authored here as typed buckets, exactly once, in the grammatical form
 * the slot requires: lowercase, no terminal punctuation, no leading article
 * beyond what the phrase itself needs, and readable immediately after the
 * frame word. FINITE-SEMANTICS LAW: a closed authored vocabulary keyed by the
 * catalog's own type token, never prose lifted from a description field.
 *
 * `strain` answers "It is currently strained by ___."
 * `fear`   answers "Its people fear ___."
 *
 * The fear form is deliberately NOT a restatement of the strain form. A siege
 * is the strain; what the people inside it fear is the wall coming down before
 * relief arrives. Keeping the two distinct is the whole reason the fear rung
 * is a separate question.
 *
 * TOTALITY: every key of `STRESS_TYPE_META` (src/data/stressTypesMeta.js) must
 * appear here, and no key may appear here that is not in that catalog. The pin
 * lives in tests/domain/simulationSpine.test.js — a stressor added to the
 * catalog without a phrase pair reds there rather than silently falling back
 * to a lowercased display label.
 *
 * Pure data. No imports. No closures. No runtime work.
 */

/** @typedef {{ strain: string, fear: string }} StressorSpinePhrases */

/** @type {Readonly<Record<string, StressorSpinePhrases>>} */
export const STRESSOR_SPINE_PHRASES = Object.freeze({
  under_siege: {
    strain: 'an active siege',
    fear: 'the wall coming down before any relief arrives',
  },
  famine: {
    strain: 'famine',
    fear: 'a second failed harvest on top of the first',
  },
  occupied: {
    strain: 'a foreign occupation',
    fear: 'what the occupier will take next',
  },
  politically_fractured: {
    strain: 'a governing council that no longer meets',
    fear: 'the quarrel turning into something with blood in it',
  },
  indebted: {
    strain: 'debt to an outside power',
    fear: 'the creditor calling in the whole of what is owed',
  },
  recently_betrayed: {
    strain: 'a betrayal still working its way through the town',
    fear: 'that whoever did it is still living among them',
  },
  infiltrated: {
    strain: 'quiet penetration by an outside interest',
    fear: 'learning at last who has been listening',
  },
  plague_onset: {
    strain: 'a disease outbreak',
    fear: 'the sickness reaching their own doorway',
  },
  succession_void: {
    strain: 'an empty seat of authority',
    fear: 'the wrong claimant reaching that seat first',
  },
  monster_pressure: {
    strain: 'beast and raider pressure out of the surrounding country',
    fear: 'whatever is out there working its way closer',
  },
  insurgency: {
    strain: 'an active insurgency',
    fear: 'being made to choose a side in the open',
  },
  religious_conversion: {
    strain: 'a change of faith the community did not choose',
    fear: 'the old observances being forbidden outright',
  },
  slave_revolt: {
    strain: 'a slave revolt',
    fear: 'the reprisal that follows whichever way it ends',
  },
  wartime: {
    strain: 'a war it cannot step out of',
    fear: 'the next levy taking the rest of their sons',
  },
  mass_migration: {
    strain: 'an arrival of people it was never built to hold',
    fear: 'there not being enough to go round',
    // WIRING-W0 (2026-11-07, R-W7 e): the phrases above are the ARRIVALS direction, the one a
    // drawn migration carries at birth; a record whose `stress[].direction` is 'departures' reads
    // these instead (simulationSpine.js :: strainPhraseOf / fearPhraseOf; domain/migrationDirection.js).
    departures: {
      strain: 'a departure of people it cannot spare',
      fear: 'being among the last ones left',
    },
  },
});

/**
 * THE DECLARED PHRASES (CENSUS-2d unit 3; Phase A's ledger STRESSOR_SPINE_PHRASES.json), in the
 * dissolved-twin shape keyed by the original's text (R-P 3): the cells stay strings for
 * `strainPhraseOf` / `fearPhraseOf`; the T wiring (CENSUS-1e) resolves a printed phrase through
 * `resolveSibling`. The keyed stressor is never re-declared (R-B1). Each twin is the chair's ruling
 * (R-G), recorded with its share in docs/CENSUS_2_LANE_2026-11-04.md "CENSUS-2d".
 * @type {Readonly<Record<string, ReadonlyArray<Readonly<{ text: string, needs?: string[], excludes?: string[], twinOf?: string }>>>>}
 */
export const STRESSOR_SPINE_SIBLINGS = Object.freeze({
  [STRESSOR_SPINE_PHRASES.under_siege.fear]: Object.freeze([
    Object.freeze({ text: STRESSOR_SPINE_PHRASES.under_siege.fear, needs: ['walls'] }),
    Object.freeze({ text: 'the stores running out before any relief arrives', twinOf: STRESSOR_SPINE_PHRASES.under_siege.fear, excludes: ['walls'] }),
  ]),
  [STRESSOR_SPINE_PHRASES.politically_fractured.strain]: Object.freeze([
    Object.freeze({ text: STRESSOR_SPINE_PHRASES.politically_fractured.strain, needs: ['ruler: council'] }),
    Object.freeze({ text: 'powers that each hold part of the place and will not yield', twinOf: STRESSOR_SPINE_PHRASES.politically_fractured.strain, excludes: ['ruler: council'] }),
  ]),
});
