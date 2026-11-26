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
 * The joined proof (both corpora, owner pages AND the public projection) found five more joiners of source (1)/(2), cured by
 * the same rules: a fill's possessive standing alone ("one name, the Headman's Authority's,") reads "that of the …"; the
 * seat holder's "the {form's} seat" reads "the seat of the {form}"; the council's meetings; a bracketed qualifier that holds a
 * possessive ("Kathleen Farrell (the hospital's master)'s family") reads "the family of Kathleen Farrell (the hospital's
 * master)"; one secret's stakes.
 * THE ORACLE is the measure's own detector (`tools/e1-measure.mjs`, gap 1), read over the born record's strings and the
 * Power tab as rendered.
 */
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { fillSlots } from '../../src/domain/display/stateProse/stateProseKernel.js';
import { qualifiedPossessives, secondMentions } from '../../src/data/people/personMention.js';
import { seatHolderLinesOf } from '../../src/generators/factionDynamics.js';
import { SEAT_HOLDER_PATTERNS } from '../../src/data/seatHolderLines.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
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
const SEEDS = ['dp-city-101', 'dp-hamlet-136', 'dp-hamlet-106', 'dp-village-132', 'dp-metropolis-65', 'dp-hamlet-102', 'dp-hamlet-1', 'dp-hamlet-84', 'dp-town-100'];
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
    // synthetic templates of the three joiner shapes (no corpus sentence is a test anchor: proseDrawnAnchors)
    expect(fillSlots("At {settlement} none would take the {seat}'s chair.", { settlement: 'Dzibcoba', seat: "Headman's Authority" }))
      .toBe("At Dzibcoba none would take the chair of the Headman's Authority.");
    expect(fillSlots("A few at {settlement} sit in {faction}'s purse.", { settlement: 'Xinba', faction: "the Thieves' Guild" }))
      .toBe("A few at Xinba sit in the purse of the Thieves' Guild.");
    expect(fillSlots("{settlement}'s {institution} stands half empty.", { settlement: 'Uaymtzal', institution: "Caravan masters' exchange" }))
      .toBe("The Caravan masters' exchange at Uaymtzal stands half empty.");
    // a fill without a possessive: byte for byte
    expect(fillSlots("At {settlement} none would take the {seat}'s chair.", { settlement: 'Dzibcoba', seat: 'Elder Council' }))
      .toBe("At Dzibcoba none would take the Elder Council's chair.");
    expect(fillSlots("{settlement}'s {institution} stands half empty.", { settlement: 'Uaymtzal', institution: 'Weekly market' })).toBe("Uaymtzal's Weekly market stands half empty.");
    // a possessive standing alone: "that of"
    expect(fillSlots("Traders at {settlement} trust one word, {faction}'s, above the rest.", { settlement: 'Xinba', faction: "the Headman's Authority" }))
      .toBe("Traders at Xinba trust one word, that of the Headman's Authority, above the rest.");
    expect(fillSlots("At {settlement} the last word is never the {seat}'s.", { settlement: 'Xinba', seat: "Thieves' Guild" })).toBe('At Xinba the last word is never that of the Thieves\' Guild.');
    expect(fillSlots("At {settlement} the last word is never the {seat}'s.", { settlement: 'Xinba', seat: 'Elder Council' })).toBe("At Xinba the last word is never the Elder Council's.");
  });

  it('(2) the seat holder\'s lines take the "of" form for a form that holds a possessive, each still found by its own pool\'s pattern only', () => {
    const pools = /** @type {Array<'relation' | 'standing' | 'relationVacant' | 'standingVacant'>} */ (['relation', 'standing', 'relationVacant', 'standingVacant']);
    /** @type {string[]} */ const faults = [];
    for (const form of ["Headman's Authority", "Thieves' Guild", 'Elder Council']) {
      for (const pool of pools) for (const line of seatHolderLinesOf(pool, { form: { faction: form }, holder: { faction: 'Merchant Guilds' } })) {
        if (doubles(line).length) faults.push(`${pool} double: ${line}`);
        if (!SEAT_HOLDER_PATTERNS[pool].some((re) => re.test(line))) faults.push(`${pool} not found by its own pattern: ${line}`);
        for (const other of pools) if (other !== pool && SEAT_HOLDER_PATTERNS[other].some((re) => re.test(line))) faults.push(`${other} finds a ${pool} line: ${line}`);
      }
    }
    expect(faults).toEqual([]);
  });

  it('(1) a bracketed qualifier that holds a possessive takes the "of" form; one that holds none opens its bracket as before', () => {
    const cards = [{ name: "Kang Zhou (the network's head)" }, { name: 'Wei Lee (the miller)' }];
    expect(qualifiedPossessives("Ana Ruiz trusts Kang Zhou (the network's head)'s cousin.", cards)).toBe("Ana Ruiz trusts the cousin of Kang Zhou (the network's head).");
    expect(qualifiedPossessives("Kang Zhou (the network's head)'s old debts are paid.", cards)).toBe("The old debts of Kang Zhou (the network's head) are paid.");
    expect(qualifiedPossessives("Ana Ruiz trusts Wei Lee (the miller)'s cousin.", cards)).toBe("Ana Ruiz trusts Wei Lee the miller's cousin.");
  });

  it('(1) a later mention before "\'s" skips a role that holds a possessive; (3) the house fill takes the short title', () => {
    const cards = [{ name: 'Wei Lee', gender: 'male', role: 'the senior charter master' }, { name: 'Kang Zhou', gender: 'male', role: "the network's head" }];
    expect(secondMentions("Wei Lee wants Kang Zhou's position, and Wei Lee wants Kang Zhou's reputation.", cards))
      .toBe("Wei Lee wants Kang Zhou's position, and the senior charter master wants Zhou's reputation.");
    expect(secondMentions('Wei Lee owes Kang Zhou, and Wei Lee fears Kang Zhou.', cards)).toBe("Wei Lee owes Kang Zhou, and the senior charter master fears the network's head.");
    // D8 (the chair's G10): a Feudal Stewardship thorp's officer is "the lord's reeve": the role rung and the fill hold on it
    const reeve = [{ name: 'Wei Lee', gender: 'male', role: 'the elder' }, { name: 'Kang Zhou', gender: 'male', role: "the lord's reeve" }];
    expect(secondMentions("Wei Lee owes Kang Zhou, and Wei Lee wants Kang Zhou's ear.", reeve)).toBe("Wei Lee owes Kang Zhou, and the elder wants Zhou's ear.");
    expect(houseFill("lord's steward")).toBe("the steward's office");
    expect(houseFill("lord's reeve")).toBe("the reeve's office");
    expect(houseFill('cooper')).toBe("the cooper's yard");
  });

  it('no born record string, no string of the public projection and no Power tab of the births holds two possessives in a row', () => {
    /** @type {string[]} */ const hits = [];
    for (const [seed, s] of Object.entries(towns)) {
      for (const t of strings(s)) for (const d of doubles(t)) hits.push(`${seed} record: ${d} — ${t.slice(0, 120)}`);
      for (const t of strings(composePublicProse(s))) for (const d of doubles(t)) hits.push(`${seed} public: ${d} — ${t.slice(0, 120)}`);
      const { container } = render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
      for (const t of String(container.textContent).split(/(?<=[.!?])\s+/)) for (const d of doubles(t)) hits.push(`${seed} Power tab: ${d} — ${t.slice(0, 120)}`);
      cleanup();
    }
    expect(hits).toEqual([]);
  });
});
