/**
 * @vitest-environment jsdom
 *
 * safetyOwnerGuard.test.jsx — PAGE-1's SAFETY unit, THE GUARD (BUILD.md §SAFETY (3); the chair's ruling of 11:24: both
 * directions). Over the born pools (the chair's 300, measure A's recipe, and the page census's 720, `censusPlan('r2')`
 * through `configOf`): THE OWNER'S PAGE NEVER SHOWS THE SAFETY LABEL TWO STEPS OR MORE FROM FOUNDATIONS' LAW & ORDER
 * BAND, EITHER WAY, WITH NO LINE BETWEEN THEM. Nor where the ruling seat is in criminal hands or a crime wave stands and
 * the label reads Moderate or better, the two things the label could not see.
 *
 * THE REFERENCE IS THE MEASURE'S, NOT THE LEAF'S: the Safety label on PAGE-1 measure B's 0..4 scale (f3.out.txt, MAPS),
 * and the law's band as Foundations prints it (`foundationBandShown(t, 'law_order', model band)`, SubstrateTab's row). The
 * page is the rendered one: the Overview and Defense tabs as the owner reads them (`publicDossier` and `playerView` both
 * false) and the DM's own PDF (`dmView`, SettlementPDF's): its Cover, Overview and Defense chapters.
 */
import React from 'react';
import { beforeAll, describe, expect, test } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveCausalState } from '../../src/domain/causalState.js';
import { foundationBandShown } from '../../src/domain/display/foundationBandShown.js';
import { safetyBandOf } from '../../src/domain/display/labelBands.js';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { Overview } from '../../src/pdf/sections/Overview.jsx';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { SIZES, censusPlan, configOf } from '../components/pageCensusWalk.shared.mjs';

/** PAGE-1 measure B's scale (f3.out.txt, MAPS.SAFETY and MAPS.CAUSAL), copied, not imported. */
const SAFETY = { 'Very Safe': 4, Safe: 3, Moderate: 2, Unsafe: 1, Dangerous: 0, Controlled: 2, Tense: 2, Quarantined: 2, Strained: 1, Restricted: 1, Suspicious: 1, Desperate: 0, Volatile: 0, Critical: 0 };
const CAUSAL = { surplus: 4, adequate: 3, strained: 2, critical: 1, collapsed: 0 };
/** The owner's line between the two: the label's word, "day to day;", then what it could not see. */
const LINE = /\bday to day; [^.]+\./;

/** The PDF's text leaves (the goldenViewModel idiom). */
function collectText(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) collectText(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') return collectText(node.type(node.props), out);
    return collectText(node.props?.children, out);
  }
  return out;
}

/** What the measure reads off the record. @param {any} t */
function readingOf(t) {
  const label = t?.economicState?.safetyProfile?.safetyLabel;
  const safety = SAFETY[safetyBandOf(label) ?? label];
  const v = deriveCausalState(t)?.variables?.law_order;
  const law = v ? CAUSAL[foundationBandShown(t, 'law_order', v.band)] : undefined;
  const calmWord = safety >= 2;
  const seat = calmWord && ['corrupted', 'capture'].includes(t?.powerStructure?.criminalCaptureState);
  const tensions = t?.history?.currentTensions;
  const wave = calmWord && (Array.isArray(tensions) ? tensions : tensions ? [tensions] : []).some((x) => x?.type === 'crime_wave');
  const apart = safety != null && law != null && Math.abs(safety - law) >= 2;
  return { label, safety, law, apart, above: apart && safety > law, seat, wave, owed: apart || seat || wave };
}

const OWNER = { publicDossier: false, playerView: false };
/** @param {any} Tab @param {any} t */
const ownerText = (Tab, t) => { const { container } = render(<Tab settlement={t} narrativeNote={null} {...OWNER} />); const text = container.textContent || ''; cleanup(); return text; };
/** @param {any} t */
const ownerPdf = (t) => {
  const vm = buildViewModel({ settlement: t, dmView: true });
  return {
    cover: collectText(Cover({ settlement: t, vm })).join('\n'),
    overview: collectText(Overview({ settlement: t, vm })).join('\n'),
    defense: collectText(DefenseSecurity({ settlement: t, vm })).join('\n'),
  };
};

/** @type {Array<{ pool: string, seed: string, t: any, r: ReturnType<typeof readingOf> }>} */
const towns = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 50; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    towns.push({ pool: 'town300', seed, t, r: readingOf(t) });
  }
  for (const row of censusPlan('r2')) {
    const t = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
    towns.push({ pool: 'census720', seed: row.seed, t, r: readingOf(t) });
  }
}, 1800000);

describe('the owner\'s page never leaves two measures apart without a line between them', () => {
  test('the pools are what they claim, and the two directions both occur in them', () => {
    expect(towns.filter((x) => x.pool === 'town300').length).toBe(300);
    expect(towns.filter((x) => x.pool === 'census720').length).toBe(720);
    const unread = towns.filter((x) => x.r.safety == null || x.r.law == null).map((x) => `${x.seed} ${x.r.label}`);
    expect(unread).toEqual([]);
    const tally = (pool) => {
      const g = towns.filter((x) => x.pool === pool);
      return `${pool}: apart ${g.filter((x) => x.r.apart).length} (streets above the law ${g.filter((x) => x.r.above).length}, below ${g.filter((x) => x.r.apart && !x.r.above).length}); seat in criminal hands under a calm word ${g.filter((x) => x.r.seat).length}; crime wave under a calm word ${g.filter((x) => x.r.wave).length}; owed a line ${g.filter((x) => x.r.owed).length} of ${g.length}`;
    };
    console.log(`GUARD POOLS: ${tally('town300')} | ${tally('census720')}`);
    expect(towns.some((x) => x.r.above)).toBe(true);
    expect(towns.some((x) => x.r.apart && !x.r.above)).toBe(true);
  });

  test('screen: the owner\'s Overview and Defense tabs carry the line wherever it is owed, and it names the law where they stand apart', () => {
    const missing = [];
    for (const { seed, t, r } of towns) {
      if (!r.owed) continue;
      for (const [tab, Tab] of [['overview', OverviewTab], ['defense', DefenseTab]]) {
        const line = ownerText(Tab, t).match(LINE)?.[0];
        if (!line || (r.apart && !/\bthe law\b/.test(line))) missing.push(`${seed} ${tab} [${r.label} | law ${r.law}${r.seat ? ' | seat' : ''}${r.wave ? ' | wave' : ''}]`);
      }
    }
    console.log(`GUARD SCREEN: ${towns.filter((x) => x.r.owed).length} towns owed a line, ${missing.length} tab renders without it`);
    expect(missing).toEqual([]);
  }, 1800000);

  test('print: the DM\'s own PDF carries the line on its Cover, Overview and Defense chapters wherever it is owed', () => {
    const missing = [];
    for (const { seed, t, r } of towns) {
      if (!r.owed) continue;
      for (const [where, text] of Object.entries(ownerPdf(t))) {
        const line = text.match(LINE)?.[0];
        if (!line || (r.apart && !/\bthe law\b/.test(line))) missing.push(`${seed} ${where}`);
      }
    }
    console.log(`GUARD PRINT: ${missing.length} chapters without the line`);
    expect(missing).toEqual([]);
  }, 1800000);

  test('nowhere owed nothing: a town whose two measures agree and hides nothing prints no line on the owner\'s Overview', () => {
    const quiet = towns.filter((x) => !x.r.owed).filter((_, i) => i % 25 === 0);
    expect(quiet.length).toBeGreaterThan(10);
    const spoke = quiet.filter(({ t }) => LINE.test(ownerText(OverviewTab, t))).map((x) => x.seed);
    expect(spoke).toEqual([]);
  }, 600000);
});
