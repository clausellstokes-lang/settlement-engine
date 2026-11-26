/**
 * e1OfFormsBound.test.js — CURE-118 (4) and (5), the tenth chair's G45 (2) and (4): E1's "of" form (G5) WHERE A REWRITE
 * CANNOT BE SURE WHERE THE POSSESSED PHRASE ENDS LEAVES THE ORIGINAL SENTENCE (an awkward double possessive is a blemish;
 * a garbled sentence is a fault).
 *   (4) the state-prose fill (`stateProseKernel.js :: ofForms`) acts only on the template shapes E1 measured; it never
 *       rewrites because a PLACE's own name holds a possessive ("Dragon's Reach": the second reader's finding 2, "the
 *       gambling of Dragon's Reach tables") and never takes a word for the whole possessed phrase unless a mark or a
 *       joining word ends it.
 * Synthetic templates (no corpus sentence is a test anchor: proseDrawnAnchors); births by the second reader's seeds.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { fillSlots } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { buildPrintProse } from '../../src/domain/display/stateProse/printProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** every string of a value @param {unknown} v @param {string[]} acc */
const strings = (v, acc = []) => { if (typeof v === 'string') acc.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, acc)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, acc)); return acc; };

describe('CURE-118 (4): the fill\'s "of" form never acts on a place\'s own name, nor on a phrase it cannot bound', () => {
  it('a place whose name holds a possessive prints its template byte for byte', () => {
    const place = { settlement: "Dragon's Reach", counterpart: "King's Crossing", access: 'road' };
    for (const t of ["{settlement}'s dice halls take more than they give.", "Coin moves at {settlement}'s night market, and no one asks.",
      "None marches on {settlement}'s; all march on the road.", "{settlement}'s {access} is busy.", "{counterpart}'s riders reach {settlement} by noon.",
      "It is {counterpart}'s.", "{counterpart}'s word is law at {settlement}."]) {
      expect(fillSlots(t, place), t).toBe(t.replace(/\{([a-z]+)\}/g, (_w, k) => place[k]));
    }
  });
  it('a power\'s possessed phrase it cannot bound stands; one it can takes the "of" form; the measured institution shape holds', () => {
    const seat = { settlement: 'Xinba', seat: "Headman's Authority", faction: "the Thieves' Guild", institution: "Caravan masters' exchange" };
    expect(fillSlots("At {settlement} the {seat}'s hired armed men keep the gate.", seat)).toBe("At Xinba the Headman's Authority's hired armed men keep the gate.");
    expect(fillSlots("At {settlement} the {seat}'s men keep the gate.", seat)).toBe("At Xinba the Headman's Authority's men keep the gate.");
    expect(fillSlots("At {settlement} none would take the {seat}'s chair.", seat)).toBe("At Xinba none would take the chair of the Headman's Authority.");
    expect(fillSlots("A few sit in {faction}'s purse and say nothing.", seat)).toBe("A few sit in the purse of the Thieves' Guild and say nothing.");
    expect(fillSlots("{settlement}'s {institution} stands half empty.", seat)).toBe("The Caravan masters' exchange at Xinba stands half empty.");
  });
  for (const [settType, seed] of [['town', 'second-118-a'], ['city', 'second-118-c']]) {
    it(`a ${settType} named "Dragon's Reach" (${seed}): no composed sentence puts a word of the template inside the place's name`, () => {
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType, customName: "Dragon's Reach" }), null, { seed });
      const all = [...strings(buildPrintProse(s, { faithUnlocked: true })), ...strings(composePublicProse(s))];
      expect(all.some((t) => t.includes("Dragon's Reach")), 'the place is named').toBe(true);
      expect(all.filter((t) => /\b[Tt]he [a-z]+ of Dragon's Reach [a-z]/.test(t))).toEqual([]);
    }, 120_000);
  }
});
