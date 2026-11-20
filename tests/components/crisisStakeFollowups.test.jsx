/**
 * FRAME-6 · C2B (FRAME-6's brief C2B-STAKES-FOLLOWUPS; the chair's rulings of 2026-11-20 15:58 UTC, each vetoable by the
 * owner): THE STAKES ROWS' THREE LOOSE ENDS, found by C2 (`frame6/C2-STAKES-PROSE-RESULTS.md` § found).
 *
 * (a) The Foundry journal's Crisis page is the third renderer of a Stakes row. It reads the page's one composition of the
 *     row's opening (`crisisPage.js :: stakeOpening`, through `pdf/lib/crisisPrint.js :: stakeLines`) like the tab and the
 *     PDF, inside its own frame: "- **The Religious Authorities** gain: the church gains while the seat struggles."
 *     Before C2B it composed its own opening on the bare leaf with a singular verb: "- **Religious Authorities** gains: …".
 *
 * THIS FILE REDS WHEN the journal prints a Stakes row whose opening is not `stakeOpening`'s.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { STAKE_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { composeCrisisPage, CRISIS_PAGE_COPY, stakeOpening } from '../../src/domain/crisis/crisisPage.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildJournalPages } from '../../src/foundry/journalPages.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/** A born town of B7's crisis pool (gen.mjs's birth) whose stakes hold the Religious Authorities' gain (measured by C2). */
const BORN_SEED = 'b7-famine-town-0';
/** @type {any} */
let born;
beforeAll(() => {
  born = generateSettlementPipeline({ settType: 'town', stressType: 'famine' }, null, { seed: BORN_SEED, customContent: {} });
}, 120_000);

/** The journal's Crisis page lines, unescaped. @param {any} s @returns {string[]} */
const journalLines = (s) => {
  const page = buildJournalPages(buildViewModel({ settlement: s }), { settlement: s }).find((p) => p.name === CRISIS_PAGE_COPY.tab);
  const entity = { '&#39;': "'", '&quot;': '"', '&lt;': '<', '&gt;': '>', '&amp;': '&' };
  return String(page?.markdown || '').replace(/\\([\\`*_{}[\]()#+\-.!|>~<])/g, '$1')
    .replace(/&#39;|&quot;|&lt;|&gt;|&amp;/g, (e) => entity[/** @type {keyof typeof entity} */ (e)]).split('\n');
};

describe('C2B (a): the Foundry journal opens a Stakes row on the page\'s one composition', () => {
  it(`${BORN_SEED}: "- **The Religious Authorities** gain: …", never "- **Religious Authorities** gains: …"`, () => {
    const lines = journalLines(born);
    expectAbsentWithAnchor(lines, `- **Religious Authorities** gains: ${STAKE_REASONS.gainsChurch}.`,
      `- **The Religious Authorities** gain: ${STAKE_REASONS.gainsChurch}.`, `${BORN_SEED} journal: the plural power`);
  });

  it(`${BORN_SEED}: every Stakes row the page composes prints in the journal as "- **<subject>** <verb>: <reason>."`, () => {
    const lines = journalLines(born);
    const rows = composeCrisisPage(born, { audience: 'owner' }).flatMap((sec) => sec.stakes);
    expect(rows.length).toBeGreaterThan(1);
    for (const k of rows) {
      const { subject, verb } = stakeOpening(k);
      expect(lines, `${k.factionId} ${k.stake}`).toContain(`- **${subject}** ${verb}: ${k.reason}.`);
    }
  });
});
