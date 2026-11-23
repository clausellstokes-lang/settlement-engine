/**
 * tests/generators/bar4HistoryOneTelling.test.js — BAR4-HISTORY (BRIEF-BAR4 amendment K4, 2026-11-16): THE GUARD OF KIND T1,
 * ONE PAST EVENT, ONE TELLING (`tests/helpers/oneEventOneTelling.js :: oneEventOneTellingInstances`).
 *
 * (a) THE POSITIVE CONTROLS: constructed records on which each arm of the detector MUST fire (a surge placed in two
 *     districts; a legacy note that dates an event at an age the timeline does not give it; two events each called the one
 *     that made the town), so the detector cannot go blind.
 * (b) THE READ TOWN (C24951, bar0-metropolis-calm-rand-21): red at the base (8aef8e7d46): its wild-magic tension placed the
 *     surge in the merchants' quarter beside its past event's temple district; now both say the temple district. Since
 *     PAGE-2 T1 (2026-11-20) the tension's form is one of the canonical and its spares (historyData.js :: tensionWording),
 *     so its sentence is computed through that module with the event's own place, never quoted (still red at that base).
 * (c) THE ZERO on the record arms (PLACE, DATE) over the census's towns the detector fired in at the base and a stride of
 *     the 720 (every 24th seed), born as the census bears them (CENSUS-3 seedcfg.mjs). The census itself (corpus + dumps,
 *     the SHAPE arm with the page's lines) is the measure over the whole 720 and the fresh 300 (the hand-back's table).
 * And (d) the degree word of C26840 (dmPowerLines.js, the adversarial rung): the ruler is ahead; (e) C26792 (the
 * chair's grant of 07:54): an approved or endorsed seat's legitimacy tension takes its twin (rosterText.js :: settleTensionsToRoster);
 * (g) T1-SHAPE (the chair's SH1b): the general desk's history row yields its -MARKED twin where the record's character names
 * ANOTHER event as the one that shaped the place (facts/shapingEvent.js :: shapeYieldingKey), red at the base in the census's
 * towns named; (h) C14176 (the chair's FS2): the rank-1 power that is the first challenger beside a Contested seat.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { oneEventOneTellingInstances } from '../helpers/oneEventOneTelling.js';
import { variantByVid } from '../helpers/drawnProse.js';
import { generateSettlementPipeline, regenHistoryPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { CAPTURE_LINES } from '../../src/data/people/dmPowerLines.js';
import { HISTORICAL_EVENTS_DATA, LEGITIMACY_HELD_TWINS, historyDescVariantsOf, ownEventPlace, tensionWording } from '../../src/data/historyData.js';
import { renderHistoryTemplate } from '../../src/generators/historyTemplate.js';
import { shapeYieldingKey } from '../../src/domain/facts/shapingEvent.js';
import { generalDeskLines } from '../../src/components/new/generalDeskRead.js';
import { SEAT_CONTESTED_STANDING } from '../../src/generators/power/factionStanding.js';

const SIZE = '(thorp|hamlet|village|town|city|metropolis)';
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
/** The census's own configuration (CENSUS-3 seedcfg.mjs: its r2r-, r2s- and bar0- arms). @param {string} seed */
const cfgFor = (seed) => {
  let m = seed.match(new RegExp(`^r2r-${SIZE}-\\d+$`));
  if (m) return birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] });
  m = seed.match(new RegExp(`^bar0-${SIZE}-([a-z_+]+)-([a-z_]+)-\\d+$`));
  if (m) {
    const st = m[2] === 'calm' ? [] : m[2].split('+'); const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: st, _randomizePriorities: true });
  }
  m = /** @type {RegExpMatchArray} */ (seed.match(new RegExp(`^r2s-(\\w+)-${SIZE}-\\d+$`)));
  return birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
};
/** @type {Map<string, any>} */
const births = new Map();
/** @param {string} seed @returns {any} */
const born = (seed) => {
  if (!births.has(seed)) births.set(seed, generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} }));
  return births.get(seed);
};

/** The census's towns the detector's record arms fired in at the base (8aef8e7d46; scratch scanT1.mjs over the census). */
const FIRED_AT_BASE = Object.freeze(['r2r-city-2', 'r2s-infiltrated-metropolis-3', 'r2s-under_siege-city-3']);
/** A stride of the 720 (CENSUS-3 seeds.txt: r2r-<size>-<0..59>, r2s-<stress>-<size>-<n>): every 24th of the r2r half. */
const STRIDE = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].flatMap((size) => [0, 24, 48].map((n) => `r2r-${size}-${n}`)));

describe('BAR4-HISTORY T1: one past event, one telling', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); });

  it('(a) the detector fires on each arm of a constructed record (the positive controls)', () => {
    const place = oneEventOneTellingInstances({ history: {
      historicalEvents: [{ templateType: 'wild_magic', name: 'The Wild Magic', yearsAgo: 252, description: 'A surge of magic no one could contain marked the temple district and everyone caught in it, and what it did has never entirely worn away' }],
      currentTensions: [{ type: 'wild_magic', description: "An uncontrolled surge of magic left its mark on the merchants' quarter and on the people who were there, and the effects have never fully faded" }],
    } });
    expect(place.map((i) => [i.arm, i.values])).toEqual([['PLACE', ['the temple district', "the merchants' quarter"]]]);
    const date = oneEventOneTellingInstances({ history: {
      historicalEvents: [{ templateType: 'succession_crisis', name: 'The Succession Crisis', yearsAgo: 110, description: 'x' }],
      legacyAnnotations: [{ annotation: 'As of the founding survey, the Succession Crisis (90 years ago) hit the settlement hard' }],
    } });
    expect(date.map((i) => [i.arm, i.values])).toEqual([['DATE', ['110', '90']]]);
    const shape = oneEventOneTellingInstances({ history: { historicalCharacter: 'The Interregnum is why this place looks as it does: it stood here before, but what stands today was rebuilt afterwards' } },
      [variantByVid({ leaf: 'general', blockId: 'DS-GEN-16', poolKey: 'LEGACY-SHIFTED', vid: 2, slots: { settlement: 'Fortesaltus', calamity: 'Pilgrimage', timeband_age: 'older than anyone living' } })]);
    expect(shape.map((i) => [i.arm, i.values])).toEqual([['SHAPE', ['interregnum', 'pilgrimage']]]);
  });

  it('(b) C24951: the read town places its surge once, in the temple district (red at the base)', () => {
    const h = born('bar0-metropolis-calm-rand-21').history;
    const ev = h.historicalEvents.find((/** @type {any} */ e) => e.templateType === 'wild_magic');
    const tn = h.currentTensions.find((/** @type {any} */ t) => t.type === 'wild_magic');
    expect(ev.description).toMatch(/marked the temple district/); // KEEP: the past event's own place
    // the surge placed ONCE, in the temple district, and not its own past event's sentence
    expect(tn.description).toContain('the temple district');
    expect(tn.description).not.toContain("the merchants' quarter"); // anchored: the same sentence holds 'the temple district' (line above) and is pinned whole by the toBe below
    expect(tn.description).not.toBe(ev.description);
    // PAGE-2 T1: the sentence itself, computed through the module: its form on the town's seed, placed where its event was,
    // and, where that form is the event's own sentence (as here), the first spare that differs (COHERENCE-PRESUME)
    const place = ownEventPlace('wild_magic', h.historicalEvents);
    expect(place).toBe('the temple district');
    const render = (/** @type {string} */ form) => renderHistoryTemplate(form, { '{quarter}': place });
    const canonical = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'wild_magic')?.description;
    const chosen = render(tensionWording({ type: 'wild_magic', description: String(canonical) }, { _seed: 'bar0-metropolis-calm-rand-21' }));
    expect(tn.description).toBe(chosen === ev.description ? historyDescVariantsOf('wild_magic').map(render).find((t) => t !== ev.description) : chosen);
    expect(oneEventOneTellingInstances(born('bar0-metropolis-calm-rand-21'))).toEqual([]);
  });

  it('(c) the zero: no town of the fired set or the stride gives one past event two places or two ages', () => {
    const failures = collectSeedFailures([...FIRED_AT_BASE, ...STRIDE], (seed) => {
      expect(oneEventOneTellingInstances(born(seed)).filter((i) => i.arm !== 'SHAPE')).toEqual([]);
    });
    expectNoSeedFailures(failures, 'T1: one past event, one place and one age, wherever it is told');
  }, 600000);

  it('(d) C26840: the adversarial rung says the ruler is ahead, as its relation row does', () => {
    const f = { ruler: 'Grand Guild Consortium', underworld: "The Thieves' Guild", agents: [] };
    expect(CAPTURE_LINES.adversarial[0](/** @type {any} */ (f))).toMatch(/^The Thieves' Guild works against the Grand Guild Consortium, and the Grand Guild Consortium is ahead\. Nobody at its head answers to the criminals\.$/); // NAMES-1 (CN1): the article
  });

  /** The census's towns that printed "widely questioned" beside an approved or endorsed seat at the base (8 of the 720). */
  // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23): lit (2bc483fc8), r2r-city-12, r2r-metropolis-21,
  // r2s-infiltrated-metropolis-0 and r2s-religious_conversion-city-1 hold no approved seat. Each is re-picked, lit, by the
  // case's own predicate (publicLegitimacy.isApproved, and a legitimacy_crisis tension), never by its words: the lowest seed
  // of its own family of 200 not already listed (r2r-city: 18 30 39 75 196; r2r-metropolis: 56 122; r2s-infiltrated-
  // metropolis: 33 70 ...). r2s-religious_conversion-city holds the case on 0 of 500 lit (0 approved), so its row takes the
  // same stress at the next size down that holds it, r2s-religious_conversion-town-62 (the lowest of 100; was city-1).
  const HELD_AT_BASE = ['r2r-city-75', 'r2r-city-18', 'r2r-city-30', 'r2r-city-39', 'r2r-metropolis-122', 'r2r-metropolis-56', 'r2s-infiltrated-metropolis-33', 'r2s-religious_conversion-town-62'];
  it('(e) C26792: an accepted seat\'s legitimacy tension says most accept it (red at the base in each of the eight)', () => {
    const twins = new Set(Object.values(LEGITIMACY_HELD_TWINS));
    const failures = collectSeedFailures(HELD_AT_BASE, (seed) => {
      const s = born(seed);
      expect(s.powerStructure.publicLegitimacy.isApproved).toBe(true);
      const said = s.history.currentTensions.filter((/** @type {any} */ t) => t.type === 'legitimacy_crisis').map((/** @type {any} */ t) => t.description);
      expect(said.length).toBeGreaterThan(0);
      expect(said.filter((/** @type {string} */ d) => !twins.has(d))).toEqual([]);
    });
    expectNoSeedFailures(failures, 'C26792: no "widely questioned" beside an accepted seat');
  }, 300000);

  it('(e2) C26792: the twin prints only beside an accepted seat (r2s-infiltrated-hamlet-0: accepted at the history step, Endorsed at the end)', () => {
    const twins = new Set(Object.values(LEGITIMACY_HELD_TWINS));
    const failures = collectSeedFailures(['r2s-infiltrated-hamlet-0', ...STRIDE], (seed) => {
      const s = born(seed);
      const twinned = s.history.currentTensions.filter((/** @type {any} */ t) => twins.has(t.description) || (t.plotHooks || []).some((/** @type {string} */ h) => twins.has(h)));
      expect(twinned.length === 0 || s.powerStructure.publicLegitimacy.isApproved === true).toBe(true);
    });
    expectNoSeedFailures(failures, 'C26792: no twin beside a seat the record does not call approved');
    // the lit birth's value (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23): r2s-infiltrated-hamlet-0 is Endorsed at the end lit (Tolerated
    // before), so its tension takes the twin (was /openly and widely questioned/). No r2s-infiltrated-hamlet of 200 lit is
    // accepted at the history step and unapproved at the end, so the case cannot be re-picked in its family.
    expect(born('r2s-infiltrated-hamlet-0').history.currentTensions.find((/** @type {any} */ t) => t.type === 'legitimacy_crisis').description).toMatch(/^Most here accept the current authority's right to rule, but some question it openly/); // KEEP: its twin, true there
  }, 300000);

  it('(f) C26792: the history section regeneration derives the same line (the chair\'s condition 3)', () => {
    const twins = new Set(Object.values(LEGITIMACY_HELD_TWINS));
    const failures = collectSeedFailures(HELD_AT_BASE.slice(0, 3), (seed) => {
      const s = born(seed);
      const { history } = regenHistoryPipeline(s, cfgFor(seed), { seed: `${seed}::regen` });
      const said = history.currentTensions.filter((/** @type {any} */ t) => t.type === 'legitimacy_crisis' && /questioned/.test(t.description)).map((/** @type {any} */ t) => t.description);
      expect(said.filter((/** @type {string} */ d) => !twins.has(d))).toEqual([]);
    });
    expectNoSeedFailures(failures, 'C26792: a regenerated history says what the born one says of an accepted seat');
  }, 300000);

  /** Every string a generated structure holds, flattened (the desk's lines live at several depths). @param {unknown} v @returns {string[]} */
  const strings = (v) => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
  /** The census's towns where the SHAPE arm fired at the base (8aef8e7d46): the record's character and the desk's row. */
  const SHAPE_AT_BASE = ['r2r-thorp-14', 'r2r-thorp-54', 'r2r-village-28', 'r2r-village-31', 'r2r-town-9', 'r2r-town-23', 'r2r-town-30', 'r2r-town-34'];
  it('(g) T1-SHAPE: one shaping event a page (the key yields; the census towns read zero)', () => {
    const pools = { 'LEGACY-SHIFTED': [], 'LEGACY-SHIFTED-MARKED': [], 'LEGACY-LINKED': [] };
    const occupation = 'The Occupation is why this place looks as it does: it stood here before, but what stands today was rebuilt afterwards';
    expect(shapeYieldingKey('LEGACY-SHIFTED', 'religious conflict', occupation, pools)).toBe('LEGACY-SHIFTED-MARKED');
    expect(shapeYieldingKey('LEGACY-SHIFTED', 'occupation', occupation, pools)).toBe('LEGACY-SHIFTED'); // KEEP: its own event
    expect(shapeYieldingKey('LEGACY-LINKED', 'religious conflict', occupation, pools)).toBe('LEGACY-LINKED'); // KEEP: claims no shape
    expect(shapeYieldingKey('LEGACY-SHIFTED', 'religious conflict', 'Its character built up slowly, with no single break', pools)).toBe('LEGACY-SHIFTED'); // KEEP: no claim
    const failures = collectSeedFailures(SHAPE_AT_BASE, (seed) => {
      const s = born(seed);
      const lines = strings(generalDeskLines(s, { audience: 'dm' }));
      expect(lines.length).toBeGreaterThan(0);
      expect(oneEventOneTellingInstances(s, lines).filter((i) => i.arm === 'SHAPE')).toEqual([]);
    });
    expectNoSeedFailures(failures, 'T1-SHAPE: no page names two events as the one that shaped it');
  }, 300000);

  /** The towns where the rank-1 challenger stood "too far behind" a Contested seat at the base (C14176). */
  // RE-PICKED BY THE PREMISE (THE FLIP, CLOSE-6 F-FORTUNE, 2026-11-23; CLOSE-5's ruling on 9df6731ee: a KEEP-side case that no
  // longer holds is a premise): lit, the seat of r2s-religious_conversion-village-0 reads Holding, and that of
  // bar0-city-under_siege+famine-rand-110 reads Holding with its seat's holder apart. Each is re-picked, lit, by the case's own
  // predicate (power/factionStanding.js's contested rung: the coup reading Contested with the rank-1 power its first
  // challenger, a governing first power, the top two's gap over 6, the rank-1 power not the seat's holder apart), never by the
  // line's words: the lowest of its own family of 200 (village-21; rand-5). Was village-0 and rand-110.
  const CONTESTED_AT_BASE = ['r2r-village-43', 'r2s-religious_conversion-village-21', 'bar0-hamlet-under_siege-rand-101', 'bar0-hamlet-under_siege-rand-108', 'bar0-city-under_siege+famine-rand-5'];
  it('(h) C14176: the rank-1 power that could take a Contested seat says so (red at the base in each)', () => {
    const failures = collectSeedFailures(CONTESTED_AT_BASE, (seed) => {
      const f = born(seed).powerStructure.factions;
      expect(f[0].isGoverning).toBe(true);
      expect(String(f[1].desc)).toContain(SEAT_CONTESTED_STANDING);
    });
    expectNoSeedFailures(failures, 'C14176: the challenger is not told it is too far behind');
    // KEEP: where the rank-1 power is not the challenger the top power is no seat, and the line is true (r2s-under_siege-town-1)
    expect(String(born('r2s-under_siege-town-1').powerStructure.factions[1].desc)).toMatch(/by too much to challenge openly, so they get their way through petitions and procedure instead\.$/);
  }, 300000);
});
