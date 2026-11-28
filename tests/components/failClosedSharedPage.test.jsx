/** @vitest-environment jsdom */
/**
 * failClosedSharedPage.test.jsx — EVERY PAGE READER OF AN ALWAYS-WITHHELD KEY PRINTS NOTHING WHERE THE KEY IS ABSENT
 * (VEIL-53's FAIL-CLOSED PAGES, the chair's RULING V6 (b), vetoable by the owner; brief
 * docs/chair/2026-11-24/tenth/veil/briefs/V53-FAILCLOSED-BRIEF.md, commit 1; the slice sized in
 * docs/chair/2026-11-24/tenth/veil/out/v53/pages/SIZING.md).
 *
 * THE PAIR, as the slice read it (PAGES' probe, V43's pages.probe.mjs): P0 is the owner's public read
 * (`toPublicSafe(record)`); P1 is the gallery page of the veiled share with NOTHING hidden (the switch's "Show
 * everything criminal", every default address opened and every hideable house's card shown), as `gallery.js ::
 * sanitizeDossier` hands it to the page: `veilPublicPayload(rederiveForPage(projectServedVeil(<served>, <served
 * marker>)))`, the served body being the twin's `projectShareVeil(galleryPayloadFor(...))`. Each arm names the slice's
 * births: P0 prints the line; P1 prints NOTHING for it (no other band, no default).
 *
 * THE CLASSES (C): the Foundations' "Criminal opportunity", "Law & order" (the black market's capture) and "Defense
 * readiness" (the readiness score) rows; the Daily Life's recent-changes default (the legacy and its siege sentence);
 * the Defense tab's siege order sentence (the capture, through the law's band). The ring note is
 * tests/components/defenseRingNoteProjection.test.jsx's.
 *
 * THE FALSE BAND (RULING V29 (1); its rule, THE INTERVAL TEST, V33 (A); VEIL-56's PG): the page re-derives a condition's
 * severity from its served band on every read (pageRederive.js, VR37), the band's fixed default, so a Foundations row that
 * reads it can print a band the owner's page does not ("Trade connectivity" Strained beside the owner's Adequate). Such a
 * row prints only where it prints the same at both ends of the served band's interval (`activeConditions.js ::
 * severityBand`'s cuts). THE ORACLE is the same page with each condition's severity set to the OWNER'S STORED one, never
 * the rule respelled. Births: the slice's r2r-hamlet-36, and the tell gate's seeds as PG's two pools born them
 * (docs/chair/2026-11-27/eleventh/veil/v56/pg/PG-REPORT.md, M1).
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { censusPlan, configOf, BANKED_PREFIX } from './pageCensusWalk.shared.mjs';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { toPublicSafe, veilPublicPayload } from '../../src/domain/display/publicSafe.js';
import * as GV from '../../src/domain/display/galleryVeil.js';
import { presentCriminalGroupings, setCriminalVeil } from '../../src/domain/display/criminalVeilSwitch.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { rederiveForPage } from '../../src/domain/veil/pageRederive.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';

afterEach(cleanup);

const clone = (v) => JSON.parse(JSON.stringify(v));
const AT = { mode: 'live', at: '2026-11-01T00:00:00.000Z' };
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const PLAN = censusPlan(BANKED_PREFIX, 1);

/** The slice's birth (the census's banked corpus, prefix r2, publicProse stamped as at the owner's save). */
function birth(seed) {
  const row = PLAN.find((r) => r.seed === seed);
  if (!row) throw new Error(`no plan row ${seed}`);
  const town = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed, customContent: {} });
  return clone(withPublicProse(town, composePublicProse(town)));
}
/** The owner's hand marker with everything shown (the probe's `allShown`). */
function allShown(rec) {
  const pub = GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: null });
  const model = GV.curateModelFor(pub, []);
  const opened = OPEN.map((address) => ({ address, hidden: false }));
  const cards = (rec.institutions || []).filter((h) => isHideableHouse(h)).map((h) => ({ address: `card:institution:${GV.CARD_KINDS.institution.idOf(h)}`, hidden: false }));
  const crim = setCriminalVeil(opened, model.defaults, false, presentCriminalGroupings(pub), model);
  const defs = model.defaults.map((d) => ({ address: typeof d === 'string' ? d : d.address, hidden: false }));
  return [...crim, ...defs, ...cards];
}
/** P0 (the owner's public read) and P1 (the veiled page, nothing hidden). */
function pagesOf(rec) {
  const P0 = toPublicSafe(clone(rec));
  const ov = GV.writeShareVeil({}, allShown(rec), AT);
  const twin = GV.projectShareVeil(GV.galleryPayloadFor(clone(rec), { shareDm: false, memberOverrides: ov }), ov);
  const marker = { [GV.VEIL_OVERRIDE_KEY]: { v: GV.VEIL_LIMITS.servedVersion, mode: 'live', at: AT.at, groupings: Array.isArray(twin?.galleryVeil?.hidden) ? twin.galleryVeil.hidden : [] } };
  const P1 = veilPublicPayload(rederiveForPage(clone(GV.projectServedVeil(twin, marker)), { unveiled: false }));
  return { rec, P0, P1 };
}
const PAGES = new Map();
const pages = (seed) => PAGES.get(seed);

/** The Foundations rows a render prints: { label: band word }. */
function foundations(settlement) {
  const { container, unmount } = render(<SubstrateTab settlement={settlement} />);
  const rows = Object.fromEntries([...container.querySelectorAll('[data-substrate-row]')].map((r) => {
    const spans = r.querySelectorAll('span');
    return [(spans[0]?.textContent || '').trim(), (spans[spans.length - 1]?.textContent || '').trim()];
  }));
  unmount();
  return rows;
}
/** The paragraphs the Defense tab prints, whitespace-normalised. */
function defenseParagraphs(settlement, opts) {
  const { container, unmount } = render(<DefenseTab settlement={settlement} narrativeNote={null} playerView {...opts} />);
  const out = [...container.querySelectorAll('p')].map((p) => (p.textContent || '').replace(/\s+/g, ' ').trim());
  unmount();
  return out;
}
const recentChanges = (settlement) => String(deriveDailyLife(settlement, null).slots.recent_changes?.text ?? '');

const CRIME = ['r2r-city-24', 'r2r-city-36', 'r2r-hamlet-0'];
const READINESS = ['r2r-thorp-0', 'r2r-thorp-48', 'r2s-indebted-thorp-0', 'r2s-slave_revolt-thorp-0'];
const LAW = ['r2r-town-0', 'r2s-infiltrated-thorp-0', 'r2s-wartime-town-0'];
const LEGACY = ['r2r-city-12', 'r2r-thorp-48'];
/** The tell gate's seeds (`r3m-<size>-<crisis>-<k>-<idx>`), born as PG's pools were (the dump door's configs). */
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function birthR3m(seed) {
  const [, size, crisis] = /^r3m-([a-z]+)-([a-z_]+)-\d+-\d+$/.exec(seed) || [];
  const cfg = { ...DEFAULT_CONFIG, ...DIALS, settType: size, ...(crisis !== 'none' ? { selectedStresses: [crisis], selectedStressesRandom: false } : {}) };
  const town = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
  return clone(withPublicProse(town, composePublicProse(town)));
}
/** The false band's births (PG's M1: the page printed a band the owner's stored severity does not give). */
const FALSE_BAND = { 'r3m-metropolis-wartime-1-139': 'Trade connectivity', 'r3m-town-insurgency-0-24': 'Defense readiness', 'r3m-village-indebted-0-6': 'Trade connectivity', 'r3m-town-under_siege-1-88': 'Defense readiness' };
const SIEGE = 'r2s-under_siege-town-0';

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CRIME, ...READINESS, ...LAW, ...LEGACY, SIEGE, 'r2r-hamlet-36'])) PAGES.set(seed, pagesOf(birth(seed)));
  for (const seed of Object.keys(FALSE_BAND)) PAGES.set(seed, pagesOf(birthR3m(seed)));
}, 600_000);

describe('the Foundations: a row whose band reads an absent, always-withheld key is not printed', () => {
  it('"Criminal opportunity" (the capture, registry safety.blackMarketCapture): P0 prints "Elevated"; P1 prints no row (r2r-city-24, -36, r2r-hamlet-0)', () => {
    for (const seed of CRIME) {
      const { rec, P0, P1 } = pages(seed);
      expect('blackMarketCapture' in rec.economicState.safetyProfile, `${seed}: the owner's record carries the capture`).toBe(true);
      expect('blackMarketCapture' in P1.economicState.safetyProfile, `${seed}: the page does not hold it`).toBe(false);
      expect(foundations(P0)['Criminal opportunity'], `${seed} P0`).toBe('Elevated');
      expect(foundations(P1)['Criminal opportunity'], `${seed} P1: no band read from nothing`).toBeUndefined();
    }
  });
  it('"Law & order" (the capture): P0 prints its band; P1 prints no row, so no band the owner\'s read lacks appears (r2r-town-0, r2s-infiltrated-thorp-0, r2s-wartime-town-0)', () => {
    const owner = { 'r2r-town-0': 'Critical', 'r2s-infiltrated-thorp-0': 'Critical', 'r2s-wartime-town-0': 'Strained' };
    for (const seed of LAW) {
      const { P0, P1 } = pages(seed);
      expect(foundations(P0)['Law & order'], `${seed} P0`).toBe(owner[seed]);
      expect(foundations(P1)['Law & order'], `${seed} P1: no row, no gained band`).toBeUndefined();
    }
  });
  it('"Defense readiness" (registry defence.readiness.score): P0 prints its band; where the page re-derives no score, P1 prints no row (r2r-thorp-0, -48, r2s-indebted-thorp-0, r2s-slave_revolt-thorp-0)', () => {
    const owner = { 'r2r-thorp-0': 'Strained', 'r2r-thorp-48': 'Strained', 'r2s-indebted-thorp-0': 'Strained', 'r2s-slave_revolt-thorp-0': 'Critical' };
    for (const seed of READINESS) {
      const { rec, P0, P1 } = pages(seed);
      expect(typeof rec.defenseProfile.readiness.score, `${seed}: the owner's record carries the score`).toBe('number');
      expect('score' in P1.defenseProfile.readiness, `${seed}: the page holds no score (outside the served label's band)`).toBe(false);
      expect(foundations(P0)['Defense readiness'], `${seed} P0`).toBe(owner[seed]);
      expect(foundations(P1)['Defense readiness'], `${seed} P1: no band read from 50`).toBeUndefined();
    }
  });
  it('the owner\'s own record prints every row it printed before, the three rows among them (the eleven births above)', () => {
    for (const seed of new Set([...CRIME, ...READINESS, ...LAW])) {
      const rows = foundations(pages(seed).rec);
      for (const label of ['Criminal opportunity', 'Law & order', 'Defense readiness']) expect(typeof rows[label], `${seed} owner: ${label}`).toBe('string');
    }
  });
});

describe('the Daily Life\'s recent changes: no default sentence where the legacy is withheld', () => {
  it('P0 prints the legacy line; P1 prints nothing, not "Life goes on as usual" nor its siblings (r2r-city-12, r2r-thorp-48)', () => {
    const owner = { 'r2r-city-12': 'Ask how things came to be as they are here, and the Guild War soon comes up.', 'r2r-thorp-48': 'The Religious Conflict still shapes how people here go about things.' };
    for (const seed of LEGACY) {
      const { rec, P0, P1 } = pages(seed);
      expect('siegeNarrative' in rec.history, `${seed}: the owner's record carries the siege sentence's key`).toBe(true);
      expect(['legacyAnnotations' in P1.history, 'siegeNarrative' in P1.history], `${seed}: the page holds neither`).toEqual([false, false]);
      expect(recentChanges(P0), `${seed} P0`).toBe(owner[seed]);
      expect(recentChanges(P1), `${seed} P1: nothing`).toBe('');
    }
  });
  it('the owner\'s own record prints its recent changes as before', () => {
    expect(recentChanges(pages('r2r-city-12').rec)).toBe('Ask how things came to be as they are here, and the Guild War soon comes up.');
  });
});

describe('the Defense tab\'s siege order sentence: nothing where the capture is withheld', () => {
  const OWNER = 'The military command holds out, but order among the people has gone, and things get worse as the food runs down.';
  const STORED = 'The military command has taken charge of the streets, and more harshly as the food runs down.';
  const REST = 'People quarrel over rations, food is sold under the counter, and the hungry have started to steal.';
  it('P0 prints the clause the law\'s band gives; P1 prints neither the clause nor its stored form, and the rest of the line stands (r2s-under_siege-town-0)', () => {
    const { P0, P1 } = pages(SIEGE);
    const p0 = defenseParagraphs(P0, { publicDossier: true }).join('\n');
    const p1 = defenseParagraphs(P1, { publicDossier: true }).join('\n');
    expect(p0, 'P0').toContain(`${OWNER} ${REST}`);
    expect(p1, 'P1: no order clause').not.toContain('order among the people has gone');
    expect(p1, 'P1: no stored clause either').not.toContain(STORED);
    expect(p1, 'P1: the rest of the line').toContain(REST);
  });
  it('the owner\'s own record prints the clause as before', () => {
    expect(defenseParagraphs(pages(SIEGE).rec, {}).join('\n')).toContain(`${OWNER} ${REST}`);
  });
});

describe('THE FALSE BAND (V29 (1), the interval test V33 (A)): a row that reads a re-derived severity prints only where both ends of the served band agree', () => {
  /** The page with each condition's severity set to the owner's stored one, the page's mark taken off (the oracle). */
  const withStoredSeverity = (rec, page) => {
    const p = clone(page);
    for (const c of p.activeConditions || []) { const o = (rec.activeConditions || []).find((x) => x?.id === c?.id); if (o && typeof o.severity === 'number') { c.severity = o.severity; delete c.severityFromBand; } }
    return p;
  };
  it('the page prints no false band: the row the re-derived default moved is not printed, and every row it prints is the row the stored severity gives (four births of the pools, r2r-hamlet-36)', () => {
    for (const [seed, label] of Object.entries(FALSE_BAND)) {
      const { rec, P1 } = pages(seed);
      const oracle = foundations(withStoredSeverity(rec, P1));
      const page = foundations(P1);
      expect(page[label], `${seed} P1: no false "${label}" (the stored severity gives ${oracle[label]})`).toBeUndefined();
      for (const [l, b] of Object.entries(page)) expect(b, `${seed} P1 "${l}"`).toBe(oracle[l]);
    }
    for (const seed of ['r2r-hamlet-36', ...CRIME, ...READINESS]) {
      const { rec, P1 } = pages(seed);
      const oracle = foundations(withStoredSeverity(rec, P1));
      for (const [l, b] of Object.entries(foundations(P1))) expect(b, `${seed} P1 "${l}"`).toBe(oracle[l]);
    }
  });
  it('a row whose two ends agree still prints (the interval test, not the blunt rule): "Public legitimacy" and "Strength of the powers" read the re-derived severity and print on the pools\' births', () => {
    let printed = 0;
    for (const seed of Object.keys(FALSE_BAND)) {
      const page = foundations(pages(seed).P1);
      if (page['Public legitimacy']) printed += 1;
    }
    expect(printed, 'the legitimacy row stays where both ends agree').toBeGreaterThan(0);
  });
  it('the owner\'s own record prints every row as before (no condition carries the page\'s re-derive mark; the four births and r2r-hamlet-36)', () => {
    for (const seed of [...Object.keys(FALSE_BAND), 'r2r-hamlet-36']) {
      const { rec, P0 } = pages(seed);
      expect((rec.activeConditions || []).some((c) => c && 'severityFromBand' in c), `${seed}: the owner's record carries no mark`).toBe(false);
      expect(foundations(rec)[FALSE_BAND[seed] || 'Labor capacity'], `${seed} owner`).toBe(foundations(P0)[FALSE_BAND[seed] || 'Labor capacity'] ?? foundations(rec)[FALSE_BAND[seed] || 'Labor capacity']);
      expect(Object.keys(foundations(rec)).length, `${seed} owner: every row`).toBeGreaterThanOrEqual(14);
    }
  });
});
