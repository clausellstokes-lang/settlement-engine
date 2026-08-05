/**
 * treatyLifecycleVoice.test.js — GR-0 THE LIFECYCLE VOICE battery.
 *
 * THE PINS THIS FILE OWES (docs/DESIGN_FP_ARCH_GR.md §5 GR-0, and the design volume's
 * "negative hardest" list), each with the reason it is shaped the way it is:
 *
 *   • THE FOG NEGATIVE (hardest): a term whose TRUE delivery has failed while the owed
 *     court's monitoring reach sits under DETECT_FLOOR mints NOTHING. The pin drives the
 *     SAME fixture across the floor in both directions, so it cannot pass by the fixture
 *     simply being quiet.
 *   • THE DETECTION CROSSING, over TWO TICKS. A single-tick harness cannot tell a
 *     crossing from a level — that is the vacuous-absence class — so the second tick
 *     feeds the first tick's OWN output world back in and asserts silence.
 *   • THE TWENTY-YEAR EULOGY, with a MOLD assertion rather than a substring: substring
 *     pins cannot see grammar (L7's mold-conformance warning, this program's own
 *     eighty-nine-percent lesson), so the composed sentence is checked against the
 *     CLOSED authored pool and against the shape of a house sentence.
 *   • ENDING TOTALITY over the closed vocabulary, every member reached through the real
 *     mover or the real read — including `hollowed_quiet`, which is deliberately never
 *     published and would otherwise be a vocabulary member nobody can prove exists.
 *   • THE GRAMMAR × INFORMATION SEAM: `treatiesPricedDuring` finds the treaty inside the
 *     window and NOTHING outside it, and the tripwire asserts the export is UNCONSUMED in
 *     src/ — it reds the day FP-INFORMATION wires the exposure path, which is the handoff.
 *   • THE OUTCOME-FREEZE PIN (GR seam 8): GR endings mint no new WR-2 disposition
 *     outcomes. One line, both programs safer.
 */

import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

import { advanceTreaties, treatyPairKey, TERM_CATALOG } from '../../src/domain/worldPulse/peaceTerms.js';
import {
  CURRENT_TREATY_TICKS_PER_YEAR, LEGACY_TREATY_TICKS_PER_YEAR,
} from '../../src/domain/worldPulse/treatyClock.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';
import {
  PACT_ENDINGS, PUBLIC_PACT_ENDINGS, TREATY_AGE_BANDS,
  pactEndingOf, treatiesPricedDuring, treatyAgeBandWord, treatyAgeClass, treatyAgeYears,
  treatyLifecycleVoiceActive,
} from '../../src/domain/worldPulse/treatyLifecycleVoice.js';
import { GRAMMAR_RECEIPTS } from '../../src/domain/worldPulse/grammarReceiptPools.js';
import { treatyDispositionDeltas } from '../../src/domain/worldPulse/treatyDisposition.js';
import { renderAllTreaties, treatyTrueStateChip } from '../../src/domain/display/treatyDocument.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/worldPulse/treatyLifecycleVoice.js';
const YEAR = CURRENT_TREATY_TICKS_PER_YEAR;
const LIT = { warLayerEnabled: true, peaceEngineEnabled: true, treatyLifecycleVoiceEnabled: true };
const DARK = { warLayerEnabled: true, peaceEngineEnabled: true };

/** A snapshot item with enough texture for settlementStrength (the peaceTerms harness's). */
function item(id, name) {
  return {
    id,
    name,
    settlement: {
      name, tier: 'town', population: 1800,
      config: { tradeRouteAccess: 'road', priorityMilitary: 35 },
      institutions: [{ name: 'State Granary', type: 'economic' }],
      economicState: {
        prosperity: 'Prosperous', primaryExports: [], primaryImports: [],
        foodSecurity: { storageMonths: 6, dailyNeed: 100, dailyProduction: 100, deficitPct: 0, surplusPct: 0, resilienceScore: 50 },
      },
      powerStructure: {
        publicLegitimacy: { score: 60, label: 'Stable' },
        factions: [{ faction: 'military seat', category: 'military', power: 78, isGoverning: true }],
        conflicts: [],
      },
      npcs: [], activeConditions: [],
    },
  };
}

const SNAPSHOT = {
  byId: new Map([['victor', item('victor', 'Ashford')], ['loser', item('loser', 'Irontown')]]),
  regionalGraph: { edges: [] },
};

/** A loser at the bottom of its economy: capacity below DEFAULT_FLOOR ⇒ a TRUE default. */
const STARVED = { bySettlement: { loser: [{ type: 'economy', severity: 0.98 }, { type: 'food', severity: 0.98 }] } };
/** A loser with headroom: capacity above HONORED_FLOOR ⇒ the term is truly kept. */
const HEALTHY = {};

const PAIR_KEY = treatyPairKey('victor', 'loser');

function treatyRecord({ mintedTick = 0, years = 20, ticksPerYear = YEAR, type = 'tribute' } = {}) {
  return {
    parties: ['victor', 'loser'],
    victorId: 'victor', loserId: 'loser',
    victorName: 'Ashford', loserName: 'Irontown',
    mintedTick,
    believedMarginAtSignature: 0.42,
    budgetGranted: 1, budgetSpent: 1,
    treatyTicksPerYear: ticksPerYear,
    complianceState: 'honored',
    receipts: [],
    terms: [{
      type, family: TERM_CATALOG[type].family, magnitude: 0.2,
      mintedTick, expiresTick: mintedTick + years * ticksPerYear,
      weightSpent: 1, complianceState: 'honored', trueState: 'honored', burden01: 0,
      deliveredToVictor: 0, extractedFromLoser: 0, receipt: 'tribute',
    }],
  };
}

/**
 * A world holding one standing treaty. `blindBand` installs a belief the owed court holds
 * about the obligor that is FAR from the truth — the measured way under DETECT_FLOOR,
 * since victorMonitorReach is 1 − |believed − truth| and the fixture's truth sits near
 * 0.67. Band 0 puts the belief at 0.1, an error of ~0.57, and the reach at ~0.43.
 */
function worldWith(treaty, { tick, rules = LIT, blindBand = null } = {}) {
  return {
    tick,
    simulationRules: blindBand == null ? { ...rules } : { ...rules, infoMode: 'unreliable' },
    ...(blindBand == null ? {} : { spatialCanonVersion: 1 }),
    spatialLedgers: {
      treaties: { [PAIR_KEY]: treaty },
      ...(blindBand == null ? {} : {
        beliefMaps: {
          victor: {
            [GOVERNING_SEAT_KEY]: {
              loser: {
                readiness: 0.2, strengthBand: blindBand, allianceLabel: 'hostile',
                faithLabel: null, confidence01: 0.8, lastUpdateTick: 1,
              },
            },
          },
        },
      }),
    },
  };
}

const advance = (worldState, tick, pIndex) => advanceTreaties({ snapshot: SNAPSHOT, worldState, pIndex, tick });
const kindsOf = (out) => out.newsEntries.map((entry) => String(entry.kind)).sort();

// ── A) THE PURE LEAF ─────────────────────────────────────────────────────────

describe('GR-0 substrate — age, bands, endings', () => {
  it('age is read on the treaty\'s OWN clock marker, from signedTick where one exists', () => {
    // V-5's provenance discipline: a legacy record priced a year at twelve ticks and is
    // never reinterpreted. Twenty-four ticks is TWO legacy years and less than one
    // current year — the same elapsed time, two honest answers.
    expect(treatyAgeYears({ mintedTick: 0, treatyTicksPerYear: LEGACY_TREATY_TICKS_PER_YEAR }, 24)).toBe(2);
    expect(treatyAgeYears({ mintedTick: 0, treatyTicksPerYear: YEAR }, 24)).toBe(0);
    // An unmarked record IS a legacy record (treatyTicksPerYearOf's contract).
    expect(treatyAgeYears({ mintedTick: 0 }, 24)).toBe(2);
    // signedTick wins where the record carries one — the carried-sheet road stamps it.
    expect(treatyAgeYears({ mintedTick: 0, signedTick: 10 * YEAR, treatyTicksPerYear: YEAR }, 30 * YEAR)).toBe(20);
    // Total on nonsense: never negative, never NaN.
    expect(treatyAgeYears({}, 100)).toBe(0);
    expect(treatyAgeYears({ mintedTick: 500, treatyTicksPerYear: YEAR }, 10)).toBe(0);
  });

  it('the age BAND is a word, the three classes partition, and no band carries a digit', () => {
    expect(TREATY_AGE_BANDS.map((band) => band.id)).toEqual(['young', 'settled', 'old']);
    expect(treatyAgeClass(0)).toBe('young');
    expect(treatyAgeClass(4)).toBe('young');
    expect(treatyAgeClass(5)).toBe('settled');
    expect(treatyAgeClass(19)).toBe('settled');
    expect(treatyAgeClass(20)).toBe('old');
    expect(treatyAgeClass(400)).toBe('old');
    for (const band of TREATY_AGE_BANDS) {
      expect(band.word.length).toBeGreaterThan(0);
      // anchored: the word is pinned non-empty on the line above, so this exclusion is
      // read against a real string rather than satisfied by an empty one.
      expect(band.word).not.toMatch(/\d/);
    }
    expect(treatyAgeBandWord(20)).toBe('a great many');
  });

  it('pactEndingOf separates what the courts RECORDED from what happened', () => {
    // Clean: nothing broken on either axis.
    expect(pactEndingOf({ observedWorst: 'honored', trueWorst: 'honored' }))
      .toEqual({ ending: 'ran_its_term', trueEnding: 'ran_its_term' });
    // Caught: the observed state carries the break, so both agree and both are public.
    expect(pactEndingOf({ observedWorst: 'defaulted', trueWorst: 'defaulted' }))
      .toEqual({ ending: 'hollowed_detected', trueEnding: 'hollowed_detected' });
    expect(pactEndingOf({ observedWorst: 'strained', trueWorst: 'strained' }))
      .toEqual({ ending: 'hollowed_detected', trueEnding: 'hollowed_detected' });
    // THE QUIET HOLLOWING — the whole reason the vocabulary has three members. The
    // public ending is what the courts believe; the truth is recorded and unspoken.
    expect(pactEndingOf({ observedWorst: 'honored', trueWorst: 'defaulted' }))
      .toEqual({ ending: 'ran_its_term', trueEnding: 'hollowed_quiet' });
    // Total on absent input.
    expect(pactEndingOf()).toEqual({ ending: 'ran_its_term', trueEnding: 'ran_its_term' });
  });

  it('the endings vocabulary is closed, and the public half EXCLUDES the quiet hollowing', () => {
    expect([...PACT_ENDINGS]).toEqual(['ran_its_term', 'hollowed_detected', 'hollowed_quiet']);
    expect([...PUBLIC_PACT_ENDINGS]).toEqual(['ran_its_term', 'hollowed_detected']);
    // Law One, as an assertion rather than a comment: the ending a public beat may speak
    // is a strict subset, and the member it omits is exactly the unbelieved one.
    expect(PUBLIC_PACT_ENDINGS).not.toContain('hollowed_quiet');
    for (const ending of PUBLIC_PACT_ENDINGS) expect(PACT_ENDINGS).toContain(ending);
    // Every public ending has an authored pool; the quiet one deliberately has none.
    for (const ending of PUBLIC_PACT_ENDINGS) expect(GRAMMAR_RECEIPTS[ending]).toBeTruthy();
    expect(GRAMMAR_RECEIPTS.hollowed_quiet).toBeUndefined();
  });

  it('the gate is by NAME and strict — absent, false and truthy-but-not-true are all dark', () => {
    expect(treatyLifecycleVoiceActive({ simulationRules: { treatyLifecycleVoiceEnabled: true } })).toBe(true);
    expect(treatyLifecycleVoiceActive({ simulationRules: {} })).toBe(false);
    expect(treatyLifecycleVoiceActive({ simulationRules: { treatyLifecycleVoiceEnabled: false } })).toBe(false);
    expect(treatyLifecycleVoiceActive({ simulationRules: { treatyLifecycleVoiceEnabled: 1 } })).toBe(false);
    expect(treatyLifecycleVoiceActive({ simulationRules: { treatyLifecycleVoiceEnabled: 'true' } })).toBe(false);
    expect(treatyLifecycleVoiceActive(null)).toBe(false);
    expect(treatyLifecycleVoiceActive({})).toBe(false);
  });
});

// ── B) THE LAPSE BEAT ────────────────────────────────────────────────────────

describe('GR-0 the lapse beat — the eulogy at the prune site', () => {
  it('THE TWENTY-YEAR PACT: a pact runs its full term and the beat speaks its age', () => {
    const at = 20 * YEAR;
    const out = advance(worldWith(treatyRecord({ mintedTick: 0, years: 20 }), { tick: at }), at, HEALTHY);
    expect(kindsOf(out)).toEqual(['treaty_lapsed']);
    const beat = out.newsEntries[0];
    expect(beat.ageYears).toBe(20);
    expect(beat.ending).toBe('ran_its_term');
    expect(beat.id).toBe(`wizard_news.${at}.treaty_lapsed.victor.loser`);
    // The instrument really left the ledger — the beat narrates a prune that happened.
    expect(out.worldState.spatialLedgers?.treaties).toBeUndefined();
  });

  it('THE MOLD, not a substring: every composed sentence is an authored house sentence', () => {
    const at = 20 * YEAR;
    const beat = advance(worldWith(treatyRecord({ mintedTick: 0, years: 20 }), { tick: at }), at, HEALTHY).newsEntries[0];
    // The eulogy is a MEMBER of the closed pool, rendered — not a lookalike a substring
    // pin would accept. The interp is reconstructed from the beat's own address chain,
    // so a composer that quietly reworded its output fails here.
    const rendered = GRAMMAR_RECEIPTS.treaty_lapsed.map((variant) => (
      typeof variant === 'function'
        ? variant({ settlement: 'Ashford', counterpart: 'Irontown', band: 'a great many', term: 'tribute' })
        : variant));
    expect(rendered).toContain(beat.summary);
    // THE HOUSE MOLD. Each of these is a grammar property a token grep cannot see: a
    // complete sentence, terminally punctuated, carrying no engine token, no digit, no
    // unresolved slot, and no rendered `undefined` where a name belonged.
    const sentences = [beat.summary, ...beat.reasons];
    for (const line of sentences) {
      expect(line.length, 'a composed line must be a real sentence').toBeGreaterThan(20);
      expect(line[0]).toBe(line[0].toUpperCase());
      expect(line).toMatch(/[.!?]$/);
      // anchored: the length and capitalization pins above prove `line` is a real
      // non-empty sentence, so these exclusions cannot pass on an empty string.
      expect(line).not.toMatch(/\{|\}|\$\{|\bundefined\b|\bNaN\b|_/);
      expect(line).not.toMatch(/\d/);
    }
    // The warning clause and the ending line both landed — three sentences, not one.
    expect(beat.reasons).toHaveLength(3);
    expect(new Set(sentences).size).toBe(sentences.length);
  });

  it('ENDING TOTALITY: every member of the closed vocabulary is really reachable', () => {
    const reached = new Set();
    // 1. ran_its_term — a clean pact reaching its horizon.
    const cleanAt = 20 * YEAR;
    const clean = advance(worldWith(treatyRecord({ years: 20 }), { tick: cleanAt }), cleanAt, HEALTHY);
    reached.add(String(clean.newsEntries[0].ending));

    // 2. hollowed_detected — a pact the owed court CAUGHT, then let expire. Two ticks:
    //    the first records the observed default, the second is the horizon.
    const seen = advance(worldWith(treatyRecord({ years: 20 }), { tick: cleanAt - 1 }), cleanAt - 1, STARVED);
    expect(seen.worldState.spatialLedgers.treaties[PAIR_KEY].complianceState).toBe('defaulted');
    const seenNext = { ...seen.worldState, tick: cleanAt };
    const caught = advance(seenNext, cleanAt, STARVED);
    expect(kindsOf(caught)).toEqual(['treaty_lapsed']);
    reached.add(String(caught.newsEntries[0].ending));

    // 3. hollowed_quiet — the same failure BEHIND THE FOG. The public beat still says
    //    the pact ran its term (Law One), and the ground-truth ending is the third
    //    member. Reached through the real read on the real ledger state.
    const quiet = advance(worldWith(treatyRecord({ years: 20 }), { tick: cleanAt - 1, blindBand: 0 }), cleanAt - 1, STARVED);
    const quietTerm = quiet.worldState.spatialLedgers.treaties[PAIR_KEY].terms[0];
    expect(quietTerm.trueState).toBe('defaulted');
    expect(quietTerm.complianceState).toBe('honored');
    const quietEnding = pactEndingOf({ observedWorst: 'honored', trueWorst: quietTerm.trueState });
    reached.add(quietEnding.trueEnding);
    const quietNext = { ...quiet.worldState, tick: cleanAt };
    const quietOut = advance(quietNext, cleanAt, STARVED);
    expect(quietOut.newsEntries[0].ending).toBe('ran_its_term');

    expect([...reached].sort()).toEqual([...PACT_ENDINGS].sort());
  });

  it('a public beat NEVER carries the ground-truth ending', () => {
    const at = 20 * YEAR;
    const quiet = advance(worldWith(treatyRecord({ years: 20 }), { tick: at - 1, blindBand: 0 }), at - 1, STARVED);
    const beat = advance({ ...quiet.worldState, tick: at }, at, STARVED).newsEntries[0];
    // The beat exists and speaks (so this is not an empty-collection pass), and no key
    // on it carries the DM-only ending anywhere in its serialized body.
    expect(beat.kind).toBe('treaty_lapsed');
    expect(JSON.stringify(beat)).not.toMatch(/hollowed_quiet/);
    expect(PUBLIC_PACT_ENDINGS).toContain(String(beat.ending));
  });
});

// ── C) THE DETECTION BEAT ────────────────────────────────────────────────────

describe('GR-0 the detection beat — the observed crossing', () => {
  it('THE FOG NEGATIVE (hardest): an undetected cheat mints NOTHING, in any feed', () => {
    const seenWorld = worldWith(treatyRecord({ years: 20 }), { tick: 10 });
    const blindWorld = worldWith(treatyRecord({ years: 20 }), { tick: 10, blindBand: 0 });
    // THE SAME true failure, the SAME tick, the SAME fixture — only the owed court's
    // reach differs. One speaks; the other is silent and reads the term as kept.
    const seen = advance(seenWorld, 10, STARVED);
    const blind = advance(blindWorld, 10, STARVED);
    expect(kindsOf(seen)).toEqual(['treaty_default_detected']);
    expect(blind.newsEntries).toEqual([]);
    const blindTerm = blind.worldState.spatialLedgers.treaties[PAIR_KEY].terms[0];
    expect(blindTerm.trueState).toBe('defaulted');
    expect(blindTerm.complianceState).toBe('honored');
    // …and the ledger records no oathbreaker, so nothing downstream can learn of it.
    expect(blind.worldState.spatialLedgers.treaties[PAIR_KEY].defaultedBy).toBeUndefined();
  });

  it('THE CROSSING IS A TRANSITION, NOT A LEVEL — proven over two ticks', () => {
    const first = advance(worldWith(treatyRecord({ years: 20 }), { tick: 10 }), 10, STARVED);
    expect(kindsOf(first)).toEqual(['treaty_default_detected']);
    // TICK TWO feeds the FIRST TICK'S OWN OUTPUT back in. The default is still standing
    // and still observed; a beat keyed on the level would fire again here, every tick,
    // for the life of the treaty. This is why the fixture is two ticks and not one.
    const second = advance({ ...first.worldState, tick: 11 }, 11, STARVED);
    expect(second.worldState.spatialLedgers.treaties[PAIR_KEY].complianceState).toBe('defaulted');
    expect(second.newsEntries).toEqual([]);
  });

  it('a treaty minted THIS tick cannot cross: one observation is a level', () => {
    // The record is absent from the incoming ledger, so this tick is its first
    // observation. Without the prevLedger arm the beat would fire on a "transition"
    // nobody could have watched happen.
    const fresh = advanceTreaties({
      snapshot: SNAPSHOT,
      worldState: { tick: 10, simulationRules: { ...LIT }, spatialLedgers: {} },
      pIndex: STARVED,
      tick: 10,
    });
    expect(fresh.newsEntries).toEqual([]);
  });

  it('the beat names the owed court and the obligor in the right roles', () => {
    const beat = advance(worldWith(treatyRecord({ years: 20 }), { tick: 10 }), 10, STARVED).newsEntries[0];
    expect(beat.headline).toBe("Ashford's court enters Irontown in default");
    expect(beat.settlementNames).toEqual(['Ashford', 'Irontown']);
    expect(beat.settlementIds).toEqual(['victor', 'loser']);
    expect(beat.observedState).toBe('defaulted');
    expect(beat.impactKind).toBe('treaty_default_detected');
    // The address law's fourth field, present and speakable.
    expect(beat.reasons[0]).toMatch(/[.!?]$/);
  });
});

// ── D) THE DOSSIER SURFACES ──────────────────────────────────────────────────

describe('GR-0 the dossier voice', () => {
  it('the age line rides the read-model only while the flag is lit', () => {
    const lit = renderAllTreaties(worldWith(treatyRecord({ years: 20 }), { tick: 20 * YEAR - 1 }));
    expect(lit).toHaveLength(1);
    expect(lit[0].ageYears).toBe(19);
    expect(typeof lit[0].ageLine).toBe('string');
    expect(lit[0].ageLine).toMatch(/[.!?]$/);
    const dark = renderAllTreaties(worldWith(treatyRecord({ years: 20 }), { tick: 20 * YEAR - 1, rules: DARK }));
    expect(dark).toHaveLength(1);
    expect(dark[0].ageYears).toBeUndefined();
    expect(dark[0].ageLine).toBeNull();
  });

  it('the age line never claims an age the parchment does not have', () => {
    // A two-year pact and a forty-year pact draw from DISJOINT honest halves of the
    // authored pool. Without the context filter the young one could draw "Old enough
    // that the roads it opened are simply the roads now" — entailed by nothing.
    const young = renderAllTreaties(worldWith(treatyRecord({ years: 40 }), { tick: 2 * YEAR }))[0];
    const old = renderAllTreaties(worldWith(treatyRecord({ years: 40 }), { tick: 30 * YEAR }))[0];
    expect(young.ageYears).toBe(2);
    expect(old.ageYears).toBe(30);
    const youngOnly = ['Young yet, as treaties go — the ink is barely set, and neither court has been tested.'];
    const oldOnly = [
      'Signed before most of the traders in the market were born, and still in force.',
      'Old enough that the roads it opened are simply the roads now.',
    ];
    expect(oldOnly).not.toContain(young.ageLine);
    expect(youngOnly).not.toContain(old.ageLine);
    // NON-VACUITY: both lines are real authored members, so the exclusions above are read
    // against sentences that actually exist rather than against nulls. The comparison is
    // SENTENCE-CASED because one authored family opens with the `{band}` slot and the
    // renderer capitalises the head — without this the pin would pass or fail on WHICH
    // family the seed happened to reach, which is luck rather than evidence.
    const sentenceCase = (line) => line.charAt(0).toUpperCase() + line.slice(1);
    const renderAll = (band) => GRAMMAR_RECEIPTS.treaty_age_line.map((v) => sentenceCase(
      typeof v === 'function' ? v({ settlement: 'Ashford', counterpart: 'Irontown', band }) : v));
    const authored = [...renderAll('a few'), ...renderAll('a great many')];
    expect(authored).toContain(young.ageLine);
    expect(authored).toContain(old.ageLine);
    // And the slot-opening family really is in play: its rendered head is upper case
    // while its authored template's is not, so the renderer is doing measurable work.
    expect(authored).toContain('A few years this peace has held.');
    expect(GRAMMAR_RECEIPTS.treaty_age_line[0]({ band: 'a few' })).toBe('a few years this peace has held.');
  });

  it('THE DM CHIP is fail-closed and speaks only where the truth diverges', () => {
    const quiet = advance(worldWith(treatyRecord({ years: 20 }), { tick: 10, blindBand: 0 }), 10, STARVED);
    // Without ground-truth authority the chip refuses before it reads a single term —
    // a free surface never learns that this term is quietly failing.
    expect(treatyTrueStateChip(quiet.worldState, PAIR_KEY, {})).toBeNull();
    expect(treatyTrueStateChip(quiet.worldState, PAIR_KEY, { includeGroundTruth: false })).toBeNull();
    const chip = treatyTrueStateChip(quiet.worldState, PAIR_KEY, { includeGroundTruth: true });
    expect(typeof chip).toBe('string');
    expect(chip).toMatch(/[.!?]$/);
    // An HONEST treaty earns no chip even for a DM — the surface reports divergence,
    // never merely the existence of a treaty.
    const honest = advance(worldWith(treatyRecord({ years: 20 }), { tick: 10 }), 10, HEALTHY);
    expect(treatyTrueStateChip(honest.worldState, PAIR_KEY, { includeGroundTruth: true })).toBeNull();
  });
});

// ── E) THE SEAMS ─────────────────────────────────────────────────────────────

describe('GR-0 seams — the INFORMATION read and the WR-2 outcome freeze', () => {
  it('treatiesPricedDuring finds the peace inside the lie\'s window and nothing outside it', () => {
    const world = worldWith(treatyRecord({ mintedTick: 300, years: 20 }), { tick: 400 });
    const found = treatiesPricedDuring(world, 'victor', 'loser', { fromTick: 290, toTick: 310 });
    expect(found).toHaveLength(1);
    expect(found[0]).toMatchObject({ pairKey: PAIR_KEY, signedTick: 300 });
    expect(found[0].believedMarginAtSignature).toBeCloseTo(0.42, 5);
    // THE NEGATIVE (the window misses), the wrong pair, and an inverted window.
    expect(treatiesPricedDuring(world, 'victor', 'loser', { fromTick: 301, toTick: 400 })).toEqual([]);
    expect(treatiesPricedDuring(world, 'victor', 'loser', { fromTick: 0, toTick: 299 })).toEqual([]);
    expect(treatiesPricedDuring(world, 'victor', 'elsewhere', { fromTick: 0, toTick: 400 })).toEqual([]);
    expect(treatiesPricedDuring(world, 'victor', 'loser', { fromTick: 310, toTick: 290 })).toEqual([]);
    expect(treatiesPricedDuring(null, 'victor', 'loser', { fromTick: 0, toTick: 400 })).toEqual([]);
    // Boundaries are INCLUSIVE on both ends, stated rather than left to a reader.
    expect(treatiesPricedDuring(world, 'victor', 'loser', { fromTick: 300, toTick: 300 })).toHaveLength(1);
  });

  it('THE HANDOFF TRIPWIRE: the read is exported and UNCONSUMED in src/ — it reds when INFO wires it', () => {
    const files = walkSource(join(ROOT, 'src'));
    // A CONSUMER, not a mention: the symbol must appear in a real IMPORT SPECIFIER for
    // this leaf. A prose reference in a header is not a consumer, and treating one as the
    // handoff signal would fire the tripwire on a comment — a false "INFORMATION has
    // landed". grammarReceiptPools.js names both the module and this symbol in its own
    // header for exactly the reason the two absences are deferred, and it must not count.
    const IMPORT_RE = /import\s*\{([^}]*)\}\s*from\s*['"][^'"]*treatyLifecycleVoice\.js['"]/g;
    const consumersOf = (symbol) => files.filter(({ rel, src }) => {
      if (rel === LEAF) return false;
      return [...src.matchAll(IMPORT_RE)]
        .some((match) => match[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0]).includes(symbol));
    }).map(({ rel }) => rel).sort();
    // NON-VACUITY, three ways: the scan reached the tree, it reached the definition, and
    // the DETECTOR ITSELF is proven to find a real consumer of a sibling export from the
    // same module. Without that third arm an emptied `files` (or a broken predicate)
    // would report "unconsumed" for every symbol in the estate.
    expect(files.length).toBeGreaterThan(200);
    expect(files.some(({ rel }) => rel === LEAF)).toBe(true);
    expect(consumersOf('treatyAgeYears')).toContain('src/domain/worldPulse/peaceTermsDocument.js');
    expect(
      consumersOf('treatiesPricedDuring'),
      'treatiesPricedDuring has gained a src/ consumer. That is GR seam 5 landing: '
      + 'FP-INFORMATION is wiring the exposure path, so this tripwire has done its job — '
      + 'move the reachability obligation into that wave and retire this pin.',
    ).toEqual([]);
  });

  it('THE OUTCOME FREEZE (GR seam 8): GR endings mint no new WR-2 disposition outcome', () => {
    // WR-2 owns this vocabulary. A GR wave wanting a new member is a STOP-and-report to
    // the war chair, and this is the line that makes the ask visible instead of silent.
    const sourceKinds = new Set();
    for (const outcome of ['held', 'defaulted', 'mediated']) {
      for (const delta of treatyDispositionDeltas({
        enabled: true, outcome, previousCompliance: 'honored',
        treaty: { parties: ['victor', 'loser'] }, victorId: 'victor', loserId: 'loser',
        mediatorId: 'broker', severity01: 0.5,
      })) {
        sourceKinds.add(String(delta.sourceKind));
        expect(['win', 'loss']).toContain(String(delta.outcome));
        expect(String(delta.channel)).toBe('diplomatic');
      }
    }
    expect([...sourceKinds].sort()).toEqual(['mediation_landed', 'treaty_default', 'treaty_held']);
    // And GR-0's own beats are NOT disposition deltas: the lapse tick's learning is
    // WR-2's pre-existing 'held', and the lifecycle beats ride newsEntries alone.
    const at = 20 * YEAR;
    const out = advance(worldWith(treatyRecord({ years: 20 }), { tick: at }), at, HEALTHY);
    expect(out.dispositionDeltas).toBeUndefined();
    for (const beat of out.newsEntries) expect(beat.channel).toBeUndefined();
  });
});

/** Every .js/.jsx file under a root, as { rel, src }. */
function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.(js|jsx)$/.test(entry)) {
      out.push({ rel: relative(ROOT, p).replace(/\\/g, '/'), src: readFileSync(p, 'utf8') });
    }
  }
  return out;
}
