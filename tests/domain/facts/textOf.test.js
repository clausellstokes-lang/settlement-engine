/**
 * tests/domain/facts/textOf.test.js — the table-consumer tolerance (R-C): a bare line comes back
 * as it is; a declared row gives back its `text` unchanged, so a consumer reading through it is
 * byte-identical whether or not its table carries declarations yet.
 *
 * @enforced-by npx vitest run tests/domain/facts/textOf.test.js
 */
import { describe, expect, it } from 'vitest';
import { textOf } from '../../../src/domain/facts/textOf.js';
import { ARRIVAL_PEOPLE, ARRIVAL_SENSES } from '../../../src/data/arrivalProse.js';
import { ARRIVAL_SCENES } from '../../../src/data/narrativeData.js';

describe('textOf', () => {
  it('a bare string or template comes back unchanged; a declared row gives back its text', () => {
    const f = (n) => `${n} wakes.`;
    expect(textOf('A line.')).toBe('A line.');
    expect(textOf(f)).toBe(f);
    expect(textOf({ text: f, excludes: ['crisis: threat'] })).toBe(f);
    expect(textOf({ text: 'A line.', needs: ['market'] })).toBe('A line.');
    expect(textOf(null)).toBe(null);
  });

  it('the arrival tables carry their declarations (CENSUS-2b item 3), each read back to a template', () => {
    const pilgrims = ARRIVAL_SENSES.find((s) => s.key === 'faith').dominant[2];
    expect(pilgrims).toEqual(expect.objectContaining({ excludes: ['crisis: threat', 'crisis: unrest'] }));
    expect(textOf(pilgrims)('X')).toBe('Pilgrims in travel-stained cloaks queue patiently for their turn at the holy places.');
    const rows = [...ARRIVAL_SENSES.flatMap((s) => [...s.lines, ...s.dominant]), ...Object.values(ARRIVAL_PEOPLE).flat(), ...Object.values(ARRIVAL_SCENES).flat()];
    expect(rows.every((r) => typeof textOf(r) === 'function' || typeof textOf(r) === 'string')).toBe(true);
    // 86 → 92 by cause: CENSUS-2f unit 2 (R-AP) declared the fish key's three bare lines and the faith key's bell, incense and hymn;
    // 92 → 99: CENSUS-2f unit 7 — fish.dominant[1] declares `fish` (R-AP amended) and six read bare lines are marked colour (R-AO)
    // 99 → 105: R2-CODE-A item 4 — the port scene's four harbour rows declare `docks` and two shore rows (`coast`) join them
    // W2-FIX-DATA, on its own lane from the same 99: 99 → 101 (the REVIEW-W2B cold list) — the smiths' ironwork carts (siege)
    // and the arabic water for travellers (siege) declare; 101 → 105 (W2-FIX-DATA-3, REVIEW-W2A-3 #366, #2) — the smiths'
    // three bare dominant lines declare `tier: ≥ town` (fb48fb8bc) and the mesoamerican craftspeople row declares `market`
    // (c0f8dd279); 105 → 109 (W2-FIX-DATA-HISTORY item F, 9d952d02b) — the east-asian lanes of trades (tier: ≥ town), the tea
    // for a merchant and the oath on the scales (market), and the timber planks waiting for carts (no crisis: under_siege).
    // → 115 at THE JOIN (JOIN-2, 2026-11-14, lane/join-2026-11-14): MEASURED by this assertion's own count at the joined tree,
    // re-keyed by identity: R2-CODE-A's six rows and W2-FIX-DATA's ten (six and the history's four) are disjoint rows.
    // 115 → 119 (TAIL-HISTORY batch 1, 2026-11-15, the chair's Y4, Y7; re-keyed by identity): four bare people lines declare —
    // the arabic broker, the east-asian clerk and the mesoamerican porters (no crisis: under_siege), the south-asian food
    // handed out (no crisis: hunger). The fair, the flapping fish and the baking were objects already.
    // 119 → 120 (TAIL-HISTORY-3, 2026-11-15, the chair's Y14; re-keyed by identity): the south-asian moneylender declares
    // (tier: ≥ village), and four twins join (the broker, the clerk and the cloth carts where no route reaches; the
    // moneylender's in a thorp or a hamlet). The broker, the clerk and the cloth carts were objects already.
    // 124 → 133 (TAIL-HISTORY-5, 2026-11-15, the chair's Y17 and its note of 04:08; re-keyed by identity): nine twins join
    // (the fish family's six catch lines, each under `crisis: hunger`; the steppe caravan broker's, where no market stands,
    // under a siege or where no route reaches; the greek money changer's and the cloth looms' under a siege). Every
    // original among them was an object already.
    // 133 → 134 (BAR2-PLACES batch 2, 2026-11-15, the chair's grant VW2; re-keyed by identity): one twin joins (the arms
    // key's blades line, where the iron is not at hand). Its original was an object already.
    // 134 → 143 (BAR4-SCENES, 2026-11-16, kind A1; re-keyed by identity, this batch's own count): six twins join (the
    // timber key's three, where no timber is at hand; the drovers and the penned cattle, where the herds failed; the
    // enchanting signs, where no house offers it) and three bare lines become declared objects (the sawn
    // timber, the saws, the enchanting signs): 6 + 3 = 9.
    // 143 → 188 (BAR4-SCENES-2, 2026-11-16, the chair's ruling HW1; re-keyed by identity, this batch's own count): 27 twins join
    // (kilns 7, stone 7, arcane 6, horses 5, the flapping basket, the mill wheel: each line the trade at work, the siege or the
    // famine can refuse keeps its slot) and 18 bare lines become declared objects (the kilns', stone's, arcane's and horses' lines,
    // and arcane's spellwork and reagent stalls): 27 + 18 = 45.
    // 188 → 189 (BAR5-THINGS, 2026-11-16, LAW 5; re-keyed by identity, this batch's own count): the fresh bread's twin joins (the
    // oven lit, the smell thin: where a hunger or a siege refuses the fresh bread).
    // 189 → 215 (BAR6-SCENES, 2026-11-16, LAW 6 rule 6b; re-keyed by identity, this batch's own count): 18 twins join (the forge 4, the
    // cloth 5, the goods sent out 4, the butter, the spice 2, the porters, the work party) and 8 bare lines become declared objects
    // (the ironwork's 4 and the cloth's 4): 18 + 8 = 26; and the Norse drying racks' twin (ARRIVAL_PEOPLE.norse): 216.
    // 216 -> 224 (the chair's ruling TW1, the same batch): the wood trades' four lines declared, each with its twin.
    // 224 -> 233 (SEAM-SCENES, 2026-11-17, BRIEF-BAR6-SEAM item 7; re-keyed by identity, a count two seats moved): BAR6-CULTURE's
    // hamlet arrival twin added three at the join (224 -> 227, the count the joined line read); the seam's own six twins join (the
    // smiths' four dominant lines, each now declaring the ironwork; the tanners' reek and drying frames, each declaring the leather):
    // 227 + 6 = 233. The tanners' hides twin is reworded, not added; the reek and the frames were objects already.
    // 233 -> 242 (BAR7-SCENES, 2026-11-17, BRIEF-BAR7 item 5; re-keyed by identity, this seat's own count): the tanners' four bare
    // `lines` become declared objects, each declaring the leather (4), with a twin each (4); the arms' racks line takes its twin (1):
    // 4 + 4 + 1 = 9. The dyer's, the tanners' dominant, the smiths', the brought-in and the work party's twins are reworded, not added.
    // 242 -> 244 (BAR8-SCENES, 2026-11-17, the chair's BR23 (1) and (3); re-keyed by identity): two declared twins join, the small
    // working quarry's ("A laden cart or two …") and enchanting offered with the arcane trade not at work ("Signs in … still offer …")
    // 244 -> 290 (L2, 2026-11-20, the arrival paragraph's thin pools deepened; re-keyed by identity, this unit's own count): of the
    // 76 lines APPENDED to the arrival tables (docs/chair/2026-11-20/content/page/L2-LINES.md), 40 are declared objects, and the
    // chair's cures of 15:35 declare six bare ones (fish dominant [6]-[8] `trade at work: fish`, arcane dominant [7]-[9]
    // `trade at work: arcane`): 40 + 6 = 46. No existing row changed shape.
    // 290 -> 293 (L2, the chair's three fish twins of 17:13; re-keyed by identity): the twins of fish dominant [6]-[8] join.
    expect(rows.filter((r) => typeof r === 'object').length).toBe(293);
  });
});
