/**
 * W2-FIX-DATA-2 items 2 and 3 (2026-11-13) — the tensions and the guild war the cold list read against the record
 * (REVIEW-W2B, `docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json` on lane/review-w2b-2026-11-13):
 *   row 31, 300  "The last strong leader died or left, and no one has yet consolidated their position" as the CURRENT
 *                tension of a town whose record calls its power Stable, its seat held, its succession settled;
 *   row 40       "A speculative frenzy … collapsed … ruining fortunes" in a city the record calls Prosperous (the
 *                trade collapse makes the same claim in the same towns, so it is declared beside it);
 *   row 314      "Competing guilds struggled for control of the market" in a hamlet with neither.
 * The rule is `historyGenerator.js :: trueToRecordAt`, read at the three selection sites; a refused template is set
 * aside and the loop draws again, the shape the crime signal's own guard uses (R-Q).
 *
 * THIS FILE REDS WHEN: the rule admits a template the record makes false, or refuses one it makes true (both arms are
 * executed over the bands' whole ladders); when a fixture town prints its false sentence again; or when the rule's own
 * homes are bypassed (the stability band, the prosperity band and the guild atom are read, never a name test).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import {
  HISTORY_TEMPLATE_RECORD_DECLARATIONS,
  RICH_PROSPERITY_BANDS,
  SETTLED_STABILITY_BANDS,
  TENSIONS_FALSE_UNDER_A_SETTLED_POWER,
  TENSIONS_FALSE_WHERE_THE_PLACE_IS_RICH,
  trueToRecordAt,
} from '../../src/generators/historyGenerator.js';
import { STABILITY_BANDS } from '../../src/domain/display/labelBands.js';
import { PROSPERITY_LABELS } from '../../src/domain/prosperityRank.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { guildOf } from '../../src/domain/facts/guild.js';

/** The birth facts a history holds, as a double: only the guild atom is read from them here. */
// RE-KEYED BY CAUSE (W2-FIX-DATA-HISTORY item A): the crash now needs the market it speaks of, so the fixture answers the
// market home (a market stands); the guild's answer and every assertion are as they were.
const factsWith = (/** @type {boolean} */ guild) => ({ guild, market: true });

describe('W2-FIX-DATA-2 item 2: a tension the record\'s own power or purse makes false', () => {
  it('the leadership vacuum is refused under every settled band and admitted under every other one', () => {
    const refused = [];
    const lost = [];
    for (const band of STABILITY_BANDS) {
      const admitted = trueToRecordAt({ type: 'leadership_vacuum' }, factsWith(true), true, band, 'Modest');
      if (SETTLED_STABILITY_BANDS.includes(band) && admitted) refused.push(band);
      if (!SETTLED_STABILITY_BANDS.includes(band) && !admitted) lost.push(band);
    }
    expect({ admittedThoughSettled: refused, refusedThoughUnsettled: lost }).toEqual({ admittedThoughSettled: [], refusedThoughUnsettled: [] });
  });

  it('the band is read, not the label: a gloss after the band does not change the answer', () => {
    for (const label of ['Stable', 'Stable (theocratic governance)', 'Ordered (strong military presence)', 'Enforced Order (authoritarian)']) {
      expect(trueToRecordAt({ type: 'leadership_vacuum' }, factsWith(true), true, label, 'Modest'), label).toBe(false);
    }
    for (const label of ['Volatile — power is available to whoever moves first', 'Fractured — no stable governing authority', 'Unstable (insurgency contests authority)']) {
      expect(trueToRecordAt({ type: 'leadership_vacuum' }, factsWith(true), true, label, 'Modest'), label).toBe(true);
    }
  });

  it('the crash and the collapse are refused on every rich band and admitted on every other rung', () => {
    const bad = [];
    for (const type of TENSIONS_FALSE_WHERE_THE_PLACE_IS_RICH) {
      for (const label of [...PROSPERITY_LABELS, 'Subsistence']) {
        const admitted = trueToRecordAt({ type }, factsWith(true), true, 'Volatile', label);
        if (RICH_PROSPERITY_BANDS.includes(label) === admitted) bad.push(`${type} @ ${label} -> ${admitted}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('a past event is not judged by the present power or purse (the timeline keeps its account)', () => {
    for (const type of [...TENSIONS_FALSE_UNDER_A_SETTLED_POWER, ...TENSIONS_FALSE_WHERE_THE_PLACE_IS_RICH]) {
      expect(trueToRecordAt({ type }, factsWith(true), false, 'Stable', 'Wealthy'), type).toBe(true);
    }
  });
});

describe('W2-FIX-DATA-2 item 3: the guild war needs a guild, as a tension and as a past event', () => {
  it('guild_conflict declares the guild atom and is judged on the timeline too', () => {
    expect(HISTORY_TEMPLATE_RECORD_DECLARATIONS.guild_conflict).toEqual({ needs: ['guild'], timeline: true });
  });

  it('refused where no guild stands, admitted where one does, in both places', () => {
    for (const tension of [true, false]) {
      expect(trueToRecordAt({ type: 'guild_conflict' }, factsWith(false), tension, 'Volatile', 'Modest')).toBe(false);
      expect(trueToRecordAt({ type: 'guild_conflict' }, factsWith(true), tension, 'Volatile', 'Modest')).toBe(true);
    }
  });

  it('an unanswered guild fact refuses (fail-closed: unanswered is never read as present)', () => {
    expect(trueToRecordAt({ type: 'guild_conflict' }, {}, true, 'Volatile', 'Modest')).toBe(false);
    expect(trueToRecordAt({ type: 'guild_conflict' }, null, true, 'Volatile', 'Modest')).toBe(false);
  });

  it('a template with no declaration is admitted everywhere (silence is neutral)', () => {
    expect(trueToRecordAt({ type: 'religious_tension' }, factsWith(false), true, 'Stable', 'Wealthy')).toBe(true);
  });
});

/** The cold list's fixture towns for these rows, with its own configurations and seeds. */
const CALM = { selectedStressesRandom: false, selectedStresses: [], stressType: null, stressTypes: [] };
const FIXTURE = [
  { id: 'c16-town-none', seed: 'review-w2b-16', config: { settType: 'town', ...CALM }, rows: [31], text: 'The last strong leader died or left', where: 'tension' },
  { id: 'c05-thorp-random', seed: 'review-w2b-5', config: { settType: 'thorp' }, rows: [300], text: 'The last strong leader died or left', where: 'tension' },
  { id: 'c21-city-none', seed: 'review-w2b-21', config: { settType: 'city', ...CALM }, rows: [40], text: 'A speculative frenzy', where: 'tension' },
  { id: 'c10-hamlet-random', seed: 'review-w2b-10', config: { settType: 'hamlet' }, rows: [314], text: 'Competing guilds struggled', where: 'history' },
];

describe('W2-FIX-DATA-2 items 2 and 3: the fixture towns, re-born', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });
  for (const t of FIXTURE) {
    it(`${t.id} (row ${t.rows.join(', ')}): "${t.text}" is gone, and the ${t.where} still speaks`, () => {
      const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...t.config }), null, { seed: t.seed, customContent: {} });
      const tensions = s.history.currentTensions || [];
      const events = s.history.historicalEvents || [];
      const all = [...tensions, ...events].map((e) => String(e.description));
      expect(all.filter((d) => d.includes(t.text))).toEqual([]);
      expect(tensions.length, 'the town still carries a current tension').toBeGreaterThan(0);
      expect(events.length, 'the town still carries its history').toBeGreaterThan(0);
      // and what stands in its place is true to the record
      const guild = guildOf(s);
      expect(tensions.filter((x) => x.type === 'guild_conflict').length === 0 || guild, 'a guild war only where a guild stands').toBeTruthy();
      expect(events.filter((x) => x.templateType === 'guild_conflict').length === 0 || guild, 'a guild war only where a guild stands').toBeTruthy();
    }, 60_000);
  }
});
