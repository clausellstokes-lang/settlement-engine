/**
 * @vitest-environment jsdom
 *
 * doublePossessive.test.jsx — E1 (WORDS-1; the tenth chair's ruling G5 of 2026-11-25): NO COMPOSED SENTENCE PRINTS TWO
 * POSSESSIVES IN A ROW ("the network's head's reputation", "the Headman's Authority's place", "the lord's steward's
 * office", "Uaymtzal's Caravan masters' exchange"). Measured at 0ec96f13d (`docs/chair/2026-11-24/tenth/gen/words-1/
 * reports/E1.md`): C 125 hits in 122 places, V 145 in 126, four sources. RULED, by source: (1) a later mention's role
 * that holds a possessive is skipped before "'s" (the next rung); (2) a power name that holds one takes the "of" form at
 * each joiner; (3) the want's house fill takes the short title; (4) "{settlement}'s {institution}" with an institution that
 * holds one reads "the {institution} at {settlement}". A name without a possessive prints as before, byte for byte.
 * THE ORACLE is the measure's own detector (`tools/e1-measure.mjs`, gap 1), read over the born record's strings and the
 * Power tab as rendered.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { fillSlots } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { secondMentions } from '../../src/data/people/personMention.js';
import { houseFill } from '../../src/generators/people/goals.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';

afterEach(cleanup);

// the measure's detector: two possessive words with at most one plain word between, contractions out
const WORD = String.raw`[\p{L}\p{N}][\p{L}\p{N}\-]*`;
const POSS = new RegExp(String.raw`(?<![\p{L}\p{N}])(${WORD})(?:['’]s|s['’])(?![\p{L}\p{N}])`, 'gu');
const NOT = new Set(['it', 'that', 'there', 'he', 'she', 'what', 'who', 'let', 'here', 'where', 'how', 'one', 'this', 'when', 'why', 'another']);
const STOP = new Set(['is', 'are', 'was', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'by', 'for', 'with', 'from', 'the', 'a', 'an', 'as', 'that', 'has', 'have', 'will', 'would', 'not', 'no', 'its', 'their', 'his', 'her']);
/** @param {string} s @returns {string[]} */
function doubles(s) {
  const ps = [...s.matchAll(POSS)].filter((m) => !(NOT.has(m[1].toLowerCase()) && /['’]s$/.test(m[0]))).map((m) => ({ start: m.index, end: m.index + m[0].length }));
  const out = [];
  for (let i = 0; i + 1 < ps.length; i++) {
    const between = s.slice(ps[i].end, ps[i + 1].start).trim();
    const words = between ? between.split(/\s+/) : [];
    if (words.length > 1 || words.some((w) => STOP.has(w.toLowerCase()) || !/^[\p{L}\p{N}-]+$/u.test(w))) continue;
    out.push(s.slice(ps[i].start, ps[i + 1].end));
  }
  return out;
}
/** every string of a value @param {unknown} v @param {string[]} acc */
const strings = (v, acc = []) => { if (typeof v === 'string') acc.push(v); else if (Array.isArray(v)) v.forEach((x) => strings(x, acc)); else if (v && typeof v === 'object') Object.values(v).forEach((x) => strings(x, acc)); return acc; };

/** births of the measure (C), one or more per source: the role rung, the house fill, the standing, the ordained tie, the requests, the seat's place */
const SEEDS = ['dp-city-101', 'dp-hamlet-136', 'dp-hamlet-106', 'dp-village-132', 'dp-metropolis-65', 'dp-hamlet-102'];
/** @type {Record<string, any>} */ const towns = {};
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) towns[seed] = generateSettlementPipeline(birthConfig({ settType: /** @type {RegExpMatchArray} */ (seed.match(/^dp-(\w+)-\d+$/))[1] }), null, { seed, customContent: {} });
}, 600000);

describe('E1 · the double possessive', () => {
  it('the detector sees the class (its control)', () => {
    expect(doubles("Wei Lee wants the network's head's reputation.")).toEqual(["network's head's"]);
    expect(doubles("one road's report against another's")).toEqual([]);
  });

  it('(2)(4) the fill writes the "of" form where a fill holds a possessive, and nothing else moves', () => {
    expect(fillSlots("Nobody at {settlement} is in a position to take the {seat}'s place.", { settlement: 'Dzibcoba', seat: "Headman's Authority" }))
      .toBe("Nobody at Dzibcoba is in a position to take the place of the Headman's Authority.");
    expect(fillSlots("Some at {settlement} are in {faction}'s pocket.", { settlement: 'Xinba', faction: "the Thieves' Guild" }))
      .toBe("Some at Xinba are in the pocket of the Thieves' Guild.");
    expect(fillSlots("{settlement}'s {institution} is open but short of supplies.", { settlement: 'Uaymtzal', institution: "Caravan masters' exchange" }))
      .toBe("The Caravan masters' exchange at Uaymtzal is open but short of supplies.");
    // a fill without a possessive: byte for byte
    expect(fillSlots("Nobody at {settlement} is in a position to take the {seat}'s place.", { settlement: 'Dzibcoba', seat: 'Elder Council' }))
      .toBe("Nobody at Dzibcoba is in a position to take the Elder Council's place.");
    expect(fillSlots("{settlement}'s {institution} is open.", { settlement: 'Uaymtzal', institution: 'Weekly market' })).toBe("Uaymtzal's Weekly market is open.");
  });

  it('(1) a later mention before "\'s" skips a role that holds a possessive; (3) the house fill takes the short title', () => {
    const cards = [{ name: 'Wei Lee', gender: 'male', role: 'the senior charter master' }, { name: 'Kang Zhou', gender: 'male', role: "the network's head" }];
    expect(secondMentions("Wei Lee wants Kang Zhou's position, and Wei Lee wants Kang Zhou's reputation.", cards))
      .toBe("Wei Lee wants Kang Zhou's position, and the senior charter master wants Zhou's reputation.");
    expect(secondMentions('Wei Lee owes Kang Zhou, and Wei Lee fears Kang Zhou.', cards)).toBe("Wei Lee owes Kang Zhou, and the senior charter master fears the network's head.");
    expect(houseFill("lord's steward")).toBe("the steward's office");
    expect(houseFill("lord's reeve")).toBe("the reeve's office");
    expect(houseFill('cooper')).toBe("the cooper's yard");
  });

  it('no born record string and no Power tab of the births holds two possessives in a row', () => {
    /** @type {string[]} */ const hits = [];
    for (const [seed, s] of Object.entries(towns)) {
      for (const t of strings(s)) for (const d of doubles(t)) hits.push(`${seed} record: ${d} — ${t.slice(0, 120)}`);
      const { container } = render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
      for (const t of String(container.textContent).split(/(?<=[.!?])\s+/)) for (const d of doubles(t)) hits.push(`${seed} Power tab: ${d} — ${t.slice(0, 120)}`);
      cleanup();
    }
    expect(hits).toEqual([]);
  });
});
