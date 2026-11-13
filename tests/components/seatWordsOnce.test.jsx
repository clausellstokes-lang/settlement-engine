/**
 * @vitest-environment jsdom
 *
 * tests/components/seatWordsOnce.test.jsx — COHERENCE-POWERS-5 (REVIEW-POWERS-2 at e86d069be, N5–N7; the chair's
 * ruling to the fifth seat): the words the seat's rows print, read on the rendered page.
 *
 * N5 — the DM block's title "The ruling three of X" reads the number of names it heads, at its print site (the
 * review: "The ruling three of Household Council / Head · Philippos Bryennios" and nothing else; the census row 16a).
 *
 * N6 — the holder's own house's Connection row names the office the holder holds, as the seat row does (the review:
 * "Connection: Headman Cosij Chan" on the Fishing community, "Elder Cosij Chan, the boat-headman" two rows down).
 *
 * Births through birthConfig with the census's dials (DEFAULT_CONFIG and the browser's random dials, the review's own
 * seeds); the Power tab rendered as the DM reads it.
 */
import { beforeAll, afterEach, describe, expect, it } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import InstitutionsTab from '../../src/components/new/tabs/InstitutionsTab.jsx';
import { rulingChainOf } from '../../src/domain/dossier/powerStrata.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';

afterEach(cleanup);

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});
const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const CRISES = Object.freeze(['under_siege', 'famine', 'occupied', 'politically_fractured', 'indebted', 'recently_betrayed',
  'infiltrated', 'plague_onset', 'succession_void', 'monster_pressure', 'insurgency', 'religious_conversion',
  'slave_revolt', 'wartime', 'mass_migration']);

/** The census's cfgFor (docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/births.mjs), so a review town is the review's. */
function born(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  const cfg = m
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] })
    : (m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/))
      && birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  if (!cfg) throw new Error(seed);
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}

/** The Power tab as the DM reads it. @param {any} s */
const powerTab = (s) => render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />).container;

/** The count word each heading must carry for its names, literals. */
const COUNT_WORDS = Object.freeze({ 3: /^The ruling three of /, 2: /^The ruling two of /, 1: /^Who leads /, 0: /^No one stands at the head of / });

/** N5's misses on one rendered tab. @param {any} s @param {string} key */
function n5MissesOf(s, key) {
  const c = powerTab(s);
  const panel = c.querySelector('[data-testid="who-runs-this-town"]');
  cleanup();
  if (!panel) return [];
  const names = panel.querySelectorAll('[data-testid="dm-ruling-face"]').length;
  const head = panel.querySelector('[data-testid="dm-ruling-head"]')?.textContent
    || [...panel.querySelectorAll('div')].map((d) => d.textContent).find((t) => /^The ruling three of /.test(t || '')) || '';
  return COUNT_WORDS[names]?.test(head) ? [] : [`${key}: "${head}" heads ${names} name(s)`];
}

/** N6's misses on one rendered Institutions tab: every Connection row naming the holder opens on the office held. */
function n6MissesOf(s, key) {
  const name = rulingChainOf(s).npc?.name;
  const holder = name ? (s.npcs || []).find((c) => c.name === name) : null;
  const office = holder && holder.institution?.kind === 'house' && holder.role !== holder.title ? holder.role : null;
  if (!office) return [];
  const c = render(<InstitutionsTab settlement={s} />).container;
  const rows = [...c.querySelectorAll('[data-testid="institution-face"]')].map((r) => r.textContent || '').filter((t) => t.includes(name));
  cleanup();
  return rows.filter((t) => !t.startsWith(`Connection: ${office} ${name}`)).map((t) => `${key}: "${t}" (the seat: ${office})`);
}

describe('COHERENCE-POWERS-5 — the seat\'s words on the page (REVIEW-POWERS-2 N5–N7)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  it('N5: the review\'s town — the title over one name says who leads, not "the ruling three"', () => {
    expect(n5MissesOf(born('r2s-famine-thorp-0'), 'r2s-famine-thorp-0')).toEqual([]);
  }, 120_000);

  it('N5: at every size, random and under every crisis — the title reads the number of names it heads', () => {
    const misses = [];
    for (const t of TIERS) {
      for (let i = 0; i < 4; i++) misses.push(...n5MissesOf(born(`r2r-${t}-${i}`), `r2r-${t}-${i}`));
      for (const x of CRISES) misses.push(...n5MissesOf(born(`r2s-${x}-${t}-0`), `r2s-${x}-${t}-0`));
    }
    expect(misses).toEqual([]);
  }, 900_000);

  it('N6: the review\'s town — the holder\'s own house names the office held, not another office word', () => {
    expect(n6MissesOf(born('r2r-thorp-0'), 'r2r-thorp-0')).toEqual([]);
  }, 120_000);

  it('N6: at every size, random and under every crisis — every Connection row naming the holder opens on the office held', () => {
    const misses = [];
    for (const t of TIERS) {
      for (let i = 0; i < 4; i++) misses.push(...n6MissesOf(born(`r2r-${t}-${i}`), `r2r-${t}-${i}`));
      for (const x of CRISES) misses.push(...n6MissesOf(born(`r2s-${x}-${t}-0`), `r2s-${x}-${t}-0`));
    }
    expect(misses).toEqual([]);
  }, 900_000);
});
