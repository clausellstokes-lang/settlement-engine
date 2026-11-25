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
 * tests/components/defenseRingNoteProjection.test.jsx's. STOPPED (reported, not here): "Labor capacity" and the
 * severity half of "Defense readiness" (r2r-hamlet-36, r2s-insurgency-town-0, r2s-occupied-town-0): the page re-derives a
 * condition's severity from its served band on every read (pageRederive.js, VR37), so the key is never absent on the page.
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
const SIEGE = 'r2s-under_siege-town-0';

beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of new Set([...CRIME, ...READINESS, ...LAW, ...LEGACY, SIEGE])) PAGES.set(seed, pagesOf(birth(seed)));
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
