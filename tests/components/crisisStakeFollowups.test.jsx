/**
 * FRAME-6 · C2B (FRAME-6's brief C2B-STAKES-FOLLOWUPS; the chair's rulings of 2026-11-20 15:58 UTC, each vetoable by the
 * owner): THE STAKES ROWS' THREE LOOSE ENDS, found by C2 (`frame6/C2-STAKES-PROSE-RESULTS.md` § found).
 *
 * (a) The Foundry journal's Crisis page is the third renderer of a Stakes row. It reads the page's one composition of the
 *     row's opening (`crisisPage.js :: stakeOpening`, through `pdf/lib/crisisPrint.js :: stakeLines`) like the tab and the
 *     PDF, inside its own frame: "- **The Religious Authorities** gain: the church gains while the seat struggles."
 *     Before C2B it composed its own opening on the bare leaf with a singular verb: "- **Religious Authorities** gains: …".
 *
 * (b) STORED, AT BIRTH ONLY: the `loses` reason said of a plural power takes the plural possessive by the names lane's own
 *     helper (`data/people/powerSentenceName.js :: fillAgreement`, the reason's agreement form `{power|its|their} own people…`): "The Merchant
 *     Guilds lose · their own people feel the crisis first". A singular power keeps "its". A saved town keeps its own
 *     string: the page reads the record, and there is no read-time rewrite. FRAME-7 · SR1 moved its born pin to the new
 *     wordings (the loss said by its matched system, in the same agreement).
 *
 * (c) RENDER: an at-odds reason (`crisisPage.js :: stakeShown`, by the record's own quarrels) names the other power as a
 *     sentence names a power (`governanceAccount.js :: powerNameInProse`): "in its own quarrel with the Elder Council",
 *     "… with the Guard", never the bare leaf ("with Elder Council", "with The Guard"). Nothing stored moves.
 *
 * THIS FILE REDS WHEN the journal prints a Stakes row whose opening is not `stakeOpening`'s; when a plural power is born
 * with "its own people feel the crisis first" or a singular one without it; or when the page rewrites a saved reason; or
 * when an at-odds reason names the other power without its article.
 */
import { beforeAll, describe, expect, it } from 'vitest';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { STAKE_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { composeCrisisPage, CRISIS_PAGE_COPY, stakeOpening } from '../../src/domain/crisis/crisisPage.js';
import { powerNameInProse } from '../../src/domain/display/governanceAccount.js';
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

/** A born town of B7's pool whose stakes hold two plural powers and one singular power that lose (measured at the base). */
const LOSES_SEED = 'b7-under_siege-town-1';

describe('C2B (b): a plural power is born with the plural possessive in its loses reason', () => {
  // FRAME-7 · SR1 (the pin moves, by its cause: SR1-RESULTS.md): a new birth says the loss by its matched system, in the
  // stake's own power's number (`STAKE_REASON_LINES`, filled by `fillAgreement`); C2B (b)'s law, held here on the new words.
  it(`${LOSES_SEED}: the Merchant Guilds and the Craft Guilds lose in their own number ("their", "they"); the singular loser says "it"`, () => {
    const s = generateSettlementPipeline({ settType: 'town', stressType: 'under_siege' }, null, { seed: LOSES_SEED, customContent: {} });
    const stakes = (Array.isArray(s.stress) ? s.stress : [s.stress]).filter(Boolean).flatMap((/** @type {any} */ e) => e.cast?.stakes || []).filter((/** @type {any} */ k) => k.stake === 'loses');
    const many = stakes.filter((/** @type {any} */ k) => ['Merchant Guilds', 'Craft Guilds'].includes(k.factionId));
    const one = stakes.filter((/** @type {any} */ k) => !['Merchant Guilds', 'Craft Guilds'].includes(k.factionId) && k.reason !== STAKE_REASONS.losesSeat);
    expect(many.map((/** @type {any} */ k) => k.factionId).sort()).toEqual(['Craft Guilds', 'Merchant Guilds']);
    expect(one.length).toBeGreaterThan(0);
    const said = Object.fromEntries(stakes.map((/** @type {any} */ k) => [k.factionId, k.reason]));
    expectAbsentWithAnchor([said['Merchant Guilds']], 'its trade is the first thing the crisis cuts', 'their trade is the first thing the crisis cuts', `${LOSES_SEED} Merchant Guilds`);
    expectAbsentWithAnchor([said['Craft Guilds']], 'it lives by trade, and trade is what suffers', 'they live by trade, and trade is what suffers', `${LOSES_SEED} Craft Guilds`);
    // anchored: each plural reason is pinned present by the expectAbsentWithAnchor pair just above
    for (const k of many) expect(k.reason, k.factionId).not.toMatch(/\bits?\b/);
    expect(one.map((/** @type {any} */ k) => [k.factionId, k.reason])).toEqual([['Town Council', 'people look to it first for an answer']]);
    // the page prints the stored reason after its plural verb: "The Merchant Guilds lose · their trade is the first thing the crisis cuts"
    const rows = composeCrisisPage(s, { audience: 'owner' }).flatMap((sec) => sec.stakes).filter((k) => k.factionId === 'Merchant Guilds');
    expect(rows.map((k) => `${stakeOpening(k).subject} ${stakeOpening(k).verb} · ${k.reason}`)).toEqual(['The Merchant Guilds lose · their trade is the first thing the crisis cuts']);
  });

  it('a saved town keeps its own string: no read-time rewrite of a stored "its own people" after a plural power', () => {
    const saved = { tier: 'town', name: 'Testholm', stress: [{ type: 'under_siege', label: 'Under Siege',
      cast: { nature: 'military', roles: [], absent: [], levers: [], stakes: [{ factionId: 'Merchant Guilds', stake: 'loses', reason: STAKE_REASONS.loses }] } }] };
    const rows = composeCrisisPage(/** @type {any} */ (saved), { audience: 'owner' }).flatMap((sec) => sec.stakes);
    expect(rows.map((k) => k.reason)).toEqual([STAKE_REASONS.loses]);
  });
});

/** The at-odds rows a page composes, as the tab and the PDF print them. @param {any} s */
const atOddsRows = (s) => composeCrisisPage(s, { audience: 'owner' }).flatMap((sec) => sec.stakes)
  .filter((k) => k.stake === 'atOdds' || k.stake === 'atOddsMany').map((k) => `${stakeOpening(k).subject} ${stakeOpening(k).verb} · ${k.reason}`);

describe('C2B (c): an at-odds reason names the other power as a sentence names a power', () => {
  it('b7-under_siege-village-3: "in its own quarrel with the Elder Council", never "with Elder Council"', () => {
    const s = generateSettlementPipeline({ settType: 'village', stressType: 'under_siege' }, null, { seed: 'b7-under_siege-village-3', customContent: {} });
    const rows = atOddsRows(s);
    expectAbsentWithAnchor(rows, 'The Manor Household is already at odds · in its own quarrel with Elder Council',
      `The Manor Household is already at odds · in its own quarrel with ${powerNameInProse('Elder Council')}`, 'b7-under_siege-village-3');
  });

  it('b7-famine-town-1: a name that carries its own article is lowered mid-sentence: "with the Guard", never "with The Guard"', () => {
    const s = generateSettlementPipeline({ settType: 'town', stressType: 'famine' }, null, { seed: 'b7-famine-town-1', customContent: {} });
    const rows = atOddsRows(s);
    expectAbsentWithAnchor(rows, 'The Craft Guilds are already at odds · in their own quarrel with The Guard',
      `The Craft Guilds are already at odds · in their own quarrel with ${powerNameInProse('Military/Guard')}`, 'b7-famine-town-1');
  });

  it('a crafted town: every power the quarrels name stands with its article, listed with "and"; the row itself is the record\'s', () => {
    const town = { tier: 'town', name: 'Testholm',
      powerStructure: { factions: [], conflicts: [{ parties: ['Manor Household', 'Elder Council'] }, { parties: ['Military/Guard', 'Manor Household'] }] },
      stress: [{ type: 'famine', label: 'Famine', cast: { nature: 'natural', roles: [], absent: [], levers: [],
        stakes: [{ factionId: 'Manor Household', stake: 'split', reason: STAKE_REASONS.untouched }] } }] };
    expect(atOddsRows(town)).toEqual([`The Manor Household is already at odds · in its own quarrel with ${powerNameInProse('Elder Council')} and ${powerNameInProse('Military/Guard')}`]);
    expect(atOddsRows(town)[0].endsWith('with the Elder Council and the Guard')).toBe(true);
    // the stored stake is untouched: the page reads it
    expect(town.stress[0].cast.stakes[0].reason).toBe(STAKE_REASONS.untouched);
  });
});
