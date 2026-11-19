/** @vitest-environment jsdom */
/**
 * R3-TABS-5, the chair's ruling (a) of 2026-11-14 on the other lane's reader's H3-T2 (HIGH): NO SURFACE PRINTS A
 * CATALOGUE NAME'S BRACKET. `DefenseTab.jsx :: ForceCard` printed the force's catalogue key raw, so a walled town's
 * gate card read "Gates (if walled) / Controlled entry points with gatekeepers.": the registry's gating condition,
 * not a fact a reader is told. The card now prints the name through the label seam the roster prints a house with
 * (`institutionDisplayName`: "Town gates"); the record and every match keep the raw key.
 *
 * RED-FIRST at 301572583 on the second reader's 1,536 births: "Gates (if walled)" on the force cards of 14 towns
 * (every one walled, every one a town), and no other bracketed catalogue name on a card. The towns below are three
 * of the 14: the reader's own (an insurgency), a famine (the smallest, 737) and an occupation (the largest, 2,465).
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { arcaneDefenseOf } from '../../src/domain/display/defenseDisplay.js';
import { standingDefenseForces } from '../../src/domain/institutions/defenseInstitutionBuckets.js';

/** The census's own cfgFor (the reader's births.mjs) and the app's shape, verbatim. */
const dials = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
function birth(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, settType: m[1] }), null, { seed, customContent: {} });
  m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/);
  if (m) return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...dials, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] }), null, { seed, customContent: {} });
  m = seed.match(/^rr3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-rand-(\d+)$/);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: m[1], selectedStressesRandom: false, selectedStresses: m[2] === 'calm' ? [] : m[2].split('+'), _randomizePriorities: true }), null, { seed, customContent: {} });
}

const SEEDS = ['r2r-town-11', 'r2s-famine-town-3', 'rr3-town-occupied-rand-4'];
/** The catalogue's machinery in a name: a digit-led count range or floor, or the registry's gating condition. */
const CATALOGUE_BRACKET = /\((?:\d[^)]*|high magic|if walled)\)/i;

function expandAll(container) {
  for (let pass = 0; pass < 4; pass += 1) {
    const shut = [...container.querySelectorAll('[aria-expanded="false"]')];
    if (shut.length === 0) return;
    for (const b of shut) fireEvent.click(b);
  }
}
function textNodes(root) {
  const walker = root.ownerDocument.createTreeWalker(root, 4 /* NodeFilter.SHOW_TEXT */);
  const out = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) if (n.nodeValue.trim()) out.push(n.nodeValue.trim());
  return out;
}

const TABS = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) {
    const s = birth(seed);
    const inst = s.defenseProfile?.institutions || {};
    const forces = [...(inst.walls || []), ...(inst.garrison || []), ...(inst.militia || []), ...(inst.watch || []),
      ...(inst.mercenary || []), ...(inst.charter || []), ...arcaneDefenseOf(s)];
    const { container } = render(<DefenseTab settlement={s} />);
    expandAll(container);
    TABS.push({ seed, s, forces, nodes: textNodes(container) });
    cleanup();
  }
}, 300000);
afterEach(cleanup);

describe('the Defense tab force cards print no catalogue bracket (ruling (a), H3-T2)', () => {
  test('the premise: each town holds the gate key on its walls, and walls', () => {
    const off = TABS.filter(({ s, forces }) => !forces.some((f) => f.name === 'Gates (if walled)') || !standingDefenseForces(s).walls.present)
      .map(({ seed }) => seed);
    expect(off).toEqual([]);
  });

  test('no text on the tab carries a catalogue name\'s bracket', () => {
    const offenders = TABS.flatMap(({ seed, nodes }) => nodes.filter((t) => CATALOGUE_BRACKET.test(t)).map((t) => `${seed}: ${t}`));
    expect(offenders).toEqual([]);
  });

  test('the gate card prints the house as the roster names it', () => {
    const missing = TABS.filter(({ nodes }) => !nodes.includes('Town gates')).map(({ seed }) => seed);
    expect(missing).toEqual([]);
  });
});
