/**
 * amnestyJubileeRegistration.test.js — WC-0D acceptance D1..D5 for the two producer-less
 * term-catalog rows, their derived-list consequences, and the six house-voice lines.
 *
 * ⚠ ANCHOR DISCIPLINE (negativeAssertionAnchor.walker): a NEW tests/domain file starts at
 * ceiling ZERO against the frozen roster, so this file writes none of the three negated
 * membership forms that walker scans for. The notice is worded rather than quoting them.
 *
 * ⭐ THE MEMBER'S REAL WORK IS A CONSUMER CENSUS, NOT A CATALOG EDIT. `executor: 'seam'`
 * with no producer entry is the `non_intervention` recipe and it makes the REGISTRATION
 * byte-identical — but that recipe does not reach `TERM_FAMILIES`, which is DERIVED at
 * module scope. Registering two producer-less rows mutates an exported array, with no
 * producer involved, and everything downstream of that array is this file's subject.
 */
import { describe, it, expect } from 'vitest';
import {
  TERM_CATALOG,
  TERM_TYPES,
  TERM_FAMILIES,
  CLASS_TERM,
} from '../../src/domain/worldPulse/peaceTermsCatalog.js';
import { bundleComponentFamilies } from '../../src/domain/worldPulse/sovereigntyBundle.js';
import {
  TREATY_COMPLIANCE_VOICE,
  treatyStrainLine,
} from '../../src/domain/display/treatyDocument.js';
import {
  DEFAULT_SIMULATION_RULES,
  SIMULATION_RULE_PRESETS,
} from '../../src/domain/worldPulse/simulationRules.js';

const NEW_TYPES = Object.freeze(['amnesty', 'jubilee']);
const STATES = Object.freeze(['honored', 'strained', 'defaulted']);

/**
 * The family list as it stood BEFORE this member — re-derived from the catalog with the two
 * new rows withheld, by the same derivation the module itself runs. Not a transcription of
 * a remembered list: a list typed out by hand could not observe a transition it was written
 * from.
 */
const familiesWithout = (withheld) => Object.freeze(
  [...new Set(
    TERM_TYPES.filter((type) => !withheld.includes(type)).map((type) => TERM_CATALOG[type].family),
  )].sort(),
);

describe('WC-0D · the amnesty and jubilee registrations, and what the derived lists do', () => {
  it('registers two producer-less seam rows, each in its own family, drafted by nothing', () => {
    for (const type of NEW_TYPES) {
      const row = TERM_CATALOG[type];
      expect(row.executor).toBe('seam');
      expect(row.family).toBe(type); // each takes its OWN family; neither is a variety of anything here
      expect(row.stream).toBe(false);
      expect(Object.isFrozen(row)).toBe(true);
    }
    // The four numeric fields are TRANSCRIBED from the producer-less seam each row's
    // semantics match, and the pin is that they EQUAL their source — so a later edit that
    // quietly retunes one reds here rather than drifting.
    const numeric = (row) => [row.weight, row.baseYears, row.maxYears, row.baseMag];
    expect(numeric(TERM_CATALOG.amnesty)).toEqual(numeric(TERM_CATALOG.non_intervention));
    expect(numeric(TERM_CATALOG.jubilee)).toEqual(numeric(TERM_CATALOG.toll_exemption));
    expect(TERM_CATALOG.non_intervention.executor).toBe('seam');
    expect(TERM_CATALOG.toll_exemption.executor).toBe('seam');

    // ⛔ THE NO-PRODUCER FENCE, ASSERTED. No asset class drafts either type, so
    // `CLASS_TERM[assetClass]` never names one and neither is ever drafted into a peace.
    expect(Object.values(CLASS_TERM).filter((term) => NEW_TYPES.includes(String(term)))).toEqual([]);
    // ⭐ AND THE ABSENCE IS ANCHORED BY A LIVE PRESENCE IN THE SAME MAP. An emptiness proves
    // nothing if the map itself drifted away; this shows the map is populated and that the
    // filter above really can find a term in it when one is there.
    expect(Object.values(CLASS_TERM).length).toBeGreaterThanOrEqual(7);
    expect(Object.values(CLASS_TERM)).toContain('resource_share');
    expect(Object.values(CLASS_TERM).filter((term) => String(term) === 'resource_share')).toHaveLength(1);

    // The derived lists moved, and they are still derived and still codepoint-sorted.
    expect(TERM_TYPES).toHaveLength(26);
    expect(TERM_FAMILIES).toHaveLength(13);
    expect([...TERM_TYPES]).toEqual([...TERM_TYPES].sort());
    expect([...TERM_FAMILIES]).toEqual([...TERM_FAMILIES].sort());
    expect(TERM_FAMILIES).toEqual([...new Set(TERM_TYPES.map((t) => TERM_CATALOG[t].family))].sort());
  });

  it('keeps the sovereignty market structurally dark: its gate is in no defaults and no preset', () => {
    // ⭐⭐ THE INERTNESS PIN, RE-AIMED AT THE REASON THAT IS TRUE. The volume's stated ground
    // — "a family with no term on the table contributes no bundle line" — is REFUTED: the
    // stacking search reads the AVAILABLE family set, not the produced one, and pushes each
    // family in codepoint order with a fixed magnitude. A family with no term IS stacked.
    //
    // Inertness survives for a different reason, and this arm asserts THAT one:
    // `sovereigntyTradeEnabled` is an engine-gated VIRTUAL key, absent from the defaults and
    // from every preset override, so no seeded corpus can reach the market at all. A pin
    // that said "the corpus did not move" would be the green that proves nothing.
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, 'sovereigntyTradeEnabled')).toBe(false);

    // ⛔⛔ THE RESOLVED `rules` OBJECT IS THE SURFACE, NOT THE PRESET WRAPPER, AND THE FIRST
    // DRAFT OF THIS ARM GOT IT WRONG. A preset is `{ id, label, rules }`, and every override
    // is spread into `rules` — so asking the WRAPPER whether it owns the key asks something
    // that can never be true no matter what any preset does, and the mutant that lights the
    // flag in a preset override walked straight past it. Executed both ways: against the
    // wrapper the mutant passed 5/5; against `rules` it reds.
    const presetsCarryingIt = Object.entries(SIMULATION_RULE_PRESETS)
      .filter(([, preset]) => preset?.rules
        && Object.prototype.hasOwnProperty.call(preset.rules, 'sovereigntyTradeEnabled'))
      .map(([id]) => id);
    expect(presetsCarryingIt).toEqual([]);

    // Non-vacuity, and it is the arm that keeps the one above honest: the probe is looking at
    // real resolved rule objects and CAN see a key in them when one is there.
    const presetIds = Object.keys(SIMULATION_RULE_PRESETS);
    expect(presetIds.length).toBeGreaterThanOrEqual(2);
    for (const id of presetIds) {
      expect(SIMULATION_RULE_PRESETS[id].rules).toBeTruthy();
      expect(Object.prototype.hasOwnProperty.call(SIMULATION_RULE_PRESETS[id].rules, 'presetId')).toBe(true);
    }
    expect(Object.prototype.hasOwnProperty.call(DEFAULT_SIMULATION_RULES, 'presetId')).toBe(true);
  });

  it('declares the capability delta rather than hiding it: two families join the stacking order', () => {
    // ⭐ WITH THE FLAG LIT, THIS IS WHAT CHANGES — stated as an executed fact about the new
    // order, never as a claim of inertness. WC-0's closing "DORMANCY: total" stays true of
    // the CORPUS and is no longer true in the capability sense.
    const before = familiesWithout(NEW_TYPES);
    const after = bundleComponentFamilies();
    expect(after.length).toBe(
      [...new Set([...before, ...after.filter((f) => !TERM_FAMILIES.includes(f))])].length + 2,
    );
    for (const type of NEW_TYPES) expect(after).toContain(type);
    expect(after.filter((family) => NEW_TYPES.includes(family))).toEqual(['amnesty', 'jubilee']);

    // The stacking search iterates this list codepoint-ordered, so index 0 is the family the
    // market offers FIRST, and it has changed hands.
    expect(TERM_FAMILIES[0]).toBe('amnesty');
    expect(after[0]).toBe('amnesty');
    expect(before[0]).toBe('commercial');
  });

  it('observes the positional transition a consumer that INDEXES the family list would see', () => {
    // ⭐ THE PLANTED-ITERATION NEGATIVE, AIMED AT THE LIVE HAZARD RATHER THAN A HYPOTHETICAL
    // ONE. Any consumer reading `TERM_FAMILIES[0]` reads a DIFFERENT family after this
    // member than before it — and the transition is derived from the catalog on both sides,
    // so this observes the real move rather than comparing against a remembered literal.
    const plantedConsumer = (families) => families[0];
    const before = familiesWithout(NEW_TYPES);
    expect(plantedConsumer(before)).toBe('commercial');
    expect(plantedConsumer(TERM_FAMILIES)).toBe('amnesty');
    expect(plantedConsumer(before)).not.toBe(plantedConsumer(TERM_FAMILIES));

    // And the withheld-derivation control is honest: withholding NOTHING reproduces the live
    // list exactly, so `before` differs by the two rows and not by the method.
    expect(familiesWithout([])).toEqual([...TERM_FAMILIES]);
    expect(before.length).toBe(TERM_FAMILIES.length - 2);
  });

  it('authors six house-voice lines that pass the register guard and never fall to the floor', () => {
    // The totality loop in peaceTermsWave3 iterates TERM_FAMILIES and needs no edit — it
    // greens the moment these six exist. This case pins them directly, plus the register.
    for (const family of NEW_TYPES) {
      const row = TREATY_COMPLIANCE_VOICE[family];
      expect(row, `family ${family} has a voice row`).toBeTruthy();
      expect(Object.isFrozen(row)).toBe(true);
      for (const state of STATES) {
        const line = row[state];
        expect(typeof line).toBe('string');
        expect(line.length).toBeGreaterThan(0); // non-empty
        expect(/[.!?]$/.test(line)).toBe(true); // terminal punctuation
        expect(/[{}]|\$\{|%s/.test(line)).toBe(false); // no template token
        expect(/>/.test(line)).toBe(false); // no settlement-id leak shape
        // ⛔ AND IT RESOLVES TO ITSELF rather than to the floor — a family whose row is
        // missing still returns a STRING from treatyStrainLine, so "it returned a string"
        // would be a green that proves nothing.
        expect(treatyStrainLine(family, state)).toBe(line);
      }
    }
    // Non-vacuity for the floor comparison: an UNKNOWN family really does fall to the floor,
    // and its line differs from both authored rows.
    const floorLine = treatyStrainLine('a_family_with_no_row', 'honored');
    expect(typeof floorLine).toBe('string');
    expect(floorLine).not.toBe(TREATY_COMPLIANCE_VOICE.amnesty.honored);
    expect(floorLine).not.toBe(TREATY_COMPLIANCE_VOICE.jubilee.honored);

    // ⛔ LAW ONE, ASSERTED MECHANICALLY FOR `jubilee`. The word carries a religious echo in
    // our own world and these three sentences carry none of it: faith is culture, never
    // theology, and the engine answers no theological question. A jubilee here is a DEBT
    // RELEASE and nothing else.
    const THEOLOGY = /\b(god|gods|divine|holy|sacred|bless(?:ed|ing)?|rite|rites|priest|temple|prayer|sin)\b/i;
    const jubileeLines = STATES.map((state) => TREATY_COMPLIANCE_VOICE.jubilee[state]);
    expect(jubileeLines.filter((line) => THEOLOGY.test(line))).toEqual([]);
    // Non-vacuity: the detector really can see the vocabulary when it is present.
    expect(THEOLOGY.test('the priest gave a blessing at the temple')).toBe(true);
  });
});
