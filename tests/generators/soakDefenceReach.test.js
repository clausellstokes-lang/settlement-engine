/**
 * F1 DEFENCE-WORDS, UNIT 4 — THE INSTRUMENT READS DEFENCE CLAIMS, NOT VOCABULARY (soak 1000 rung
 * 1B; docs/F1_DEFENCE_WORDS_2026-11-04.md §2 bucket a). The rung's own quotes: every reach reading
 * is licensed by rule, and every real claim stays a finding.
 */
import { describe, expect, it } from 'vitest';
import { isDefenceClaim, isDefenceReach } from '../../scripts/audit/soak-review/defenceReach.mjs';
import { variantByVid } from '../helpers/drawnProse.js';

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

/**
 * F11 unit 2, ENCLOSURE-WALLS (docs/SOAK_10000_RUNG2_2026-11-04.md §2 kind 4; the chair's ruling of
 * 2026-11-04: a building's own walls are NOT a fortification). Rung 2's 43 enclosure findings are
 * silent; a perimeter claim still fires. "its walls" is the building's only in the building's own
 * description: the same words of the settlement ("armed men on its walls") stay a claim.
 */
describe('F11 · a building\'s own walls are not a fortification', () => {
  const WALLS = 'walls without walls, a palisade or earthworks';
  const CARAVANSERAI = 'Behind its walls, merchants shelter their animals and cargo overnight in security.';
  const FOUNDLING = 'Takes in abandoned infants and small children and keeps them in basic care until they are apprenticed, placed with families, or raised on within its walls.';
  const TIDEMARK = 'A tidemark from the flood still stains the lower walls of the oldest houses.';
  /** @param {string} desc */
  const rosterWith = (desc) => ({ institutions: [{ name: 'X', desc: `${desc} The church usually runs it.` }] });
  /** @param {string} quote @param {any} [s] */
  const claims = (quote, s) => isDefenceClaim({ check: 'defense-words', quote, detail: WALLS }, s);

  it('the three enclosure lines of rung 2 are silent', () => {
    expect(claims(CARAVANSERAI, rosterWith(CARAVANSERAI))).toBe(false);
    expect(claims(FOUNDLING, rosterWith(FOUNDLING))).toBe(false);
    expect(claims(TIDEMARK)).toBe(false);
  });
  it('the Foundry journal\'s labelled, escaped row of the same description is silent too', () => {
    expect(claims(`- **Caravanserai**: ${CARAVANSERAI}`, rosterWith(CARAVANSERAI))).toBe(false);
    expect(claims(`- **Foundling home**: ${FOUNDLING}`, rosterWith(FOUNDLING))).toBe(false);
    expect(claims(`- **Caravanserai**: ${CARAVANSERAI}`)).toBe(true);
  });
  it('a building named with "of the" or a possessive keeps its walls', () => {
    expect(isDefenceReach('walls', 'Refuge inside the walls of the great temple')).toBe(true);
    expect(isDefenceReach('walls', "The hall's walls sweat in the wet season.")).toBe(true);
  });
  it('the reserve line and the siege pool line still fire', () => {
    expect(claims('The settlement keeps more in reserve than its size explains: granaries a little too large, walls a little too strong.')).toBe(true);
    // The siege pool line, computed (proseDrawnAnchors: never a literal state-prose anchor).
    expect(claims(variantByVid({ leaf: 'power', blockId: 'DS-POW-2', poolKey: 'siege matched', vid: 1, slots: { settlement: 'Ford' } }))).toBe(true);
  });
  it('a perimeter claim still fires: the walls, walled, the town\'s walls, outside the walls, its walls of the settlement', () => {
    for (const quote of [
      'Outside the walls, the camps grow by the week.',
      'A walled town on the river.',
      "The town's walls are older than its charter.",
      'Ashby can put a real body of armed men on its walls.',
    ]) expect(claims(quote, rosterWith(CARAVANSERAI))).toBe(true);
    expect(claims(CARAVANSERAI)).toBe(true); // not on the roster: "its" is not known to be the building's
  });
});
