/**
 * F1 DEFENCE-WORDS, UNIT 4 — THE INSTRUMENT READS DEFENCE CLAIMS, NOT VOCABULARY (soak 1000 rung
 * 1B; docs/F1_DEFENCE_WORDS_2026-11-04.md §2 bucket a). The rung's own quotes: every reach reading
 * is licensed by rule, and every real claim stays a finding.
 */
import { describe, expect, it } from 'vitest';
import { isDefenceClaim, isDefenceReach } from '../../scripts/audit/soak-review/defenceReach.mjs';

/** @type {ReadonlyArray<[string, string]>} the rung's bucket-a quotes */
const REACH = [
  ['soldiers', 'Founded by: a discharged soldier who liked the view and had nowhere better to be'],
  ['soldiers', 'Veteran Soldier · devoted · Priest'],
  ['soldiers', 'Where retired soldiers and sellswords do their drinking.'],
  ['soldiers', 'A drinking hall for old soldiers and mercenaries put out to pasture.'],
  ['soldiers', 'Practical clothing for soldiers and servants.'],
  ['soldiers', 'Stabling, horse-dealing, and farriery gathered in one quarter, serving merchants, soldiers, and travellers in want of a fresh mount.'],
  ['soldiers', "A district given to stables, horse-trade, and the farrier's craft, for any merchant, soldier, or traveller needing a new mount."],
  ['walls', 'A walled plot gated against livestock, kept by the households in turn.'],
  ['walls', 'A substantial walled compound for desert merchants: stabling for camels, locked storage, a well, and sleeping quarters for fifty.'],
  ['walls', 'Builds the walls and churches of half the region.'],
  ['walls', 'Something was sealed inside the walls during construction, deliberately'],
  ['walls', "The merchant quarter and the labourers' quarter remain walled apart"],
  ['walls', 'Stone-walled holdings climbing a south-facing hillside'],
  ['garrison', 'Contract supply of bows and arrows to garrison and militia.'],
  ['garrison', 'Caravan escort, garrison work, and short-term hire go at day-wages here.'],
  ['hospital', '— Found an institution (a hospital, a school) that will outlast them by centuries'],
  ['hospital', 'Religious community. May operate hospital/school.'],
  ['hospital', 'It may keep a hospital or a school.'],
];

/** @type {ReadonlyArray<[string, string]>} real claims: these stay findings */
const CLAIMS = [
  ['walls', 'The population that now fills these walls is neither fixed nor familiar.'],
  ['garrison', 'Manouel Iasites has begun collecting a road toll for the garrison.'],
  ['walls', 'Stone-walled village on a south-facing slope, paths converging at the market cross'],
  ['soldiers', 'There are soldiers on Satyawadi\'s streets, but they move in pairs and do not linger.'],
  ['soldiers', 'Two soldiers at the gate.'],
  ['garrison', 'The garrison handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume.'],
  ['hospital', 'Land grants, hospital networks, and moral authority give them leverage across multiple civic domains.'],
  ['walls', 'A walled plot by the church, and the walls of the town are thin.'],
];

describe('defence reach, by rule', () => {
  for (const [term, sentence] of REACH) {
    it(`licenses "${sentence.slice(0, 60)}"`, () => expect(isDefenceReach(term, sentence)).toBe(true));
  }
  for (const [term, sentence] of CLAIMS) {
    it(`keeps the claim "${sentence.slice(0, 60)}" red`, () => expect(isDefenceReach(term, sentence)).toBe(false));
  }
  it('reads only defence-words findings, and a term it has no rule for is a claim', () => {
    expect(isDefenceClaim({ check: 'food-words', quote: 'A walled plot.', detail: 'x without y' })).toBe(true);
    expect(isDefenceClaim({ check: 'defense-words', quote: 'Garrison Commander', detail: 'Garrison Commander without a garrison' })).toBe(true);
    expect(isDefenceClaim({ check: 'defense-words', quote: 'A walled plot gated against livestock.', detail: 'walls without walls, a palisade or earthworks' })).toBe(false);
  });
});
