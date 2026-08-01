/**
 * heraldFeedSources.test.js — buildHeraldFeed's SOURCE CONTRACT.
 *
 * The Herald-doors gap of 2026-07-31 survived because NO test imported
 * buildHeraldFeed: the module header promised "pulse + wizard-news records" while
 * the implementation read only pulseHistory, so the late-lane beats (momentum
 * cracks, supply-web campaigns, infowar, treaties) — whose receipts are appended
 * AFTER the impactDigest freeze — never reached any door, and nothing could red.
 * This battery pins the wired contract:
 *
 *   1. A late-lane beat present ONLY in campaign.wizardNews.entries files into
 *      its routed door, under both lenses.
 *   2. The advance lens is the latest pulse's tick window; the campaign lens is
 *      the whole feed.
 *   3. An entry recorded in BOTH sources (the impactDigest twin) files ONCE.
 *   4. Severity flows through to the HeraldItem (the "Severity 0%" regression).
 *   5. An id-less record never files from the feed source (alignment with the
 *      wizardNews authoring guard: id-less means dropped, everywhere).
 */
import { describe, expect, test } from 'vitest';
import { buildHeraldFeed } from '../../src/components/map/heraldFeed.js';
import { climbDownNews } from '../../src/domain/worldPulse/momentum.js';
import { appendWizardNewsEntries } from '../../src/domain/region/wizardNews.js';

const NOW = '2026-01-01T00:00:00.000Z';
const nameOf = (id) => ({ a: 'Aldermoor', b: 'Brackwater', v: 'Irondell' })[id] || String(id);

/** A raid beat at an OLD tick (outside the latest advance). */
const olderRaid = () => ({
  id: 'wizard_news.3.webwar_raid.a.v.b', kind: 'webwar_raid', significance: 'major',
  severity: 0.65, score: 70, tick: 3, headline: 'Aldermoor raids Irondell', summary: 'x',
  settlementIds: ['a', 'v', 'b'],
});

/** A campaign whose latest pulse is tick 7 and whose feed holds `entries`. */
function campaignWith(entries, { digest = [] } = {}) {
  return {
    worldState: {
      pulseHistory: [
        { tick: 3, selectedOutcomes: [], impactDigest: [], resolvedStressors: [] },
        { tick: 7, selectedOutcomes: [], impactDigest: digest, resolvedStressors: [] },
      ],
      stressors: [],
    },
    wizardNews: appendWizardNewsEntries({}, entries, { now: NOW }),
  };
}

describe('buildHeraldFeed — the wizard-news source (the late-lane doors)', () => {
  test('a late-lane beat present only in the feed files into its routed door', () => {
    const beat = climbDownNews('a', 'b', nameOf, 2.4, 1.2, { price01: 0.6 }, '', 7);
    const { bySection } = buildHeraldFeed(campaignWith([beat]), { lens: 'advance' });
    const item = bySection.war.find((i) => i.kind === 'momentum_climb_down');
    expect(item, 'the climb-down reaches the war door').toBeTruthy();
    // The regression this battery exists for: severity must flow to the meter.
    expect(item.severity).toBe(0.6);
    expect(item.major).toBe(true);
    expect(item.headline).toContain('Aldermoor');
  });

  test('the advance lens is the latest tick window; the campaign lens is the whole feed', () => {
    const beat = climbDownNews('a', 'b', nameOf, 2.4, 1.2, { price01: 0.6 }, '', 7);
    const campaign = campaignWith([beat, olderRaid()]);
    const adv = buildHeraldFeed(campaign, { lens: 'advance' });
    const camp = buildHeraldFeed(campaign, { lens: 'campaign' });
    expect(adv.bySection.war.map((i) => i.kind)).toEqual(['momentum_climb_down']);
    expect(camp.bySection.war.map((i) => i.kind).sort()).toEqual(['momentum_climb_down', 'webwar_raid']);
    // CONTROL: the old beat exists in the feed both times — the advance/campaign
    // difference above measures the lens, not a missing entry.
    expect(campaign.wizardNews.entries.some((e) => e.kind === 'webwar_raid')).toBe(true);
  });

  test('an impactDigest twin files once (dedupe by id across sources)', () => {
    const beat = climbDownNews('a', 'b', nameOf, 2.4, 1.2, { price01: 0.6 }, '', 7);
    const campaign = campaignWith([beat], { digest: [{ ...beat }] });
    const { bySection } = buildHeraldFeed(campaign, { lens: 'advance' });
    expect(bySection.war.filter((i) => i.kind === 'momentum_climb_down').length).toBe(1);
  });

  test('an id-less record never files from the feed source', () => {
    // The feed itself refuses id-less entries (normalizeEntry), so build the campaign
    // with a hand-rolled feed that bypasses normalization — the belt-and-braces guard
    // in the source loop must still skip it.
    const { id: _stripped, ...idless } = climbDownNews('a', 'b', nameOf, 2.4, 1.2, { price01: 0.6 }, '', 7);
    const campaign = {
      worldState: { pulseHistory: [{ tick: 7, selectedOutcomes: [], impactDigest: [], resolvedStressors: [] }], stressors: [] },
      wizardNews: { entries: [idless] },
    };
    const { bySection } = buildHeraldFeed(campaign, { lens: 'advance' });
    // anchored: the positive twin (test 1 above) proves this exact beat DOES file when it carries an id, so an empty door here measures the missing id, not a dead source.
    expect(bySection.war.length).toBe(0);
  });
});
