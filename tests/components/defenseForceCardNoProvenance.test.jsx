/** @vitest-environment jsdom */
/**
 * R3-TABS (round three's cut, ROUND-3-CUT-2026-11-13 §6 H6/M3 and class (b); the chair's ruling b1):
 * THE FORCE CARDS PRINT THE FORCE, NEVER THE GENERATOR'S PROVENANCE. `DefenseTab.jsx :: ForceCard`
 * printed "REQ" on a force whose record source is 'required' and "FORCED" on every other source that
 * is not 'generated' — 'coherence_repair', 'cascade', 'faction_boost', 'forced' — so a palisade the
 * coherence pass raised, an arcane post a dependency pulled in and a company a faction paid for all
 * read as forced by the user (cut #185 HIGH; #323 #378 #465 #719 #956 #1177 #1391). The ruling: both
 * badges are provenance and leave the page; the card keeps the force's name and its line.
 *
 * RED-FIRST, measured at the line's tip aac79b808 on the reader's twenty towns (app shape):
 * REQ 11 and FORCED 9 on the Defense tab; after the cure, none, and every force card's name prints.
 */
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import { arcaneDefenseOf } from '../../src/domain/display/defenseDisplay.js';
import { institutionDisplayName } from '../../src/domain/display/institutionDisplayName.js';

/** The app's own configuration shape (the stress panel with Random off), as the reader's towns were born. */
function appBirth(seed) {
  const m = seed.match(/^[a-z0-9]+-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/);
  const stresses = m[2] === 'calm' ? [] : m[2].split('+');
  const route = m[3] === 'rand' ? {} : { tradeRouteAccess: m[3] };
  const cfg = birthConfig({ ...DEFAULT_CONFIG, ...route, settType: m[1], selectedStressesRandom: false, selectedStresses: stresses, _randomizePriorities: true });
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}

// The reader's towns that printed a badge at aac79b808 (#185 is the hamlet under siege), and fresh ones.
const SEEDS = [
  'rr2s-hamlet-under_siege-rand-1', 'rr2s-village-monster_pressure-rand-1', 'rr2s-town-calm-rand-1',
  'rr2s-town-under_siege-rand-1', 'rr2s-city-calm-rand-1', 'rr2s-city-under_siege+famine-rand-1',
  'rr2s-metropolis-calm-rand-1', 'rr2s-metropolis-plague_onset-port-1',
  'r3t-village-calm-rand-1', 'r3t-town-occupied-port-2', 'r3t-city-calm-rand-1', 'r3t-metropolis-under_siege-rand-3',
];

function expandAll(container) {
  for (let pass = 0; pass < 4; pass += 1) {
    const shut = [...container.querySelectorAll('[aria-expanded="false"]')];
    if (shut.length === 0) return;
    for (const b of shut) fireEvent.click(b);
  }
}
/** Every text node, trimmed: a badge is its own node. */
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
    const s = appBirth(seed);
    const inst = s.defenseProfile?.institutions || {};
    const forces = [...(inst.walls || []), ...(inst.garrison || []), ...(inst.militia || []), ...(inst.watch || []),
      ...(inst.mercenary || []), ...(inst.charter || []), ...arcaneDefenseOf(s)];
    const { container } = render(<DefenseTab settlement={s} />);
    expandAll(container);
    TABS.push({ seed, forces, nodes: textNodes(container) });
    cleanup();
  }
}, 300000);
afterEach(cleanup);

describe('the Defense tab force cards carry no provenance badge (ruling b1)', () => {
  test('the towns hold forces of every provenance the generator writes', () => {
    const sources = new Set(TABS.flatMap(({ forces }) => forces.map((f) => f.source)));
    // the arm's own premise: a non-generated source is on the cards, so a badge WOULD print at the base
    expect([...sources].filter((x) => x && x !== 'generated').length, `sources ${[...sources]}`).toBeGreaterThan(1);
  });

  test('no card prints "REQ" or "FORCED"', () => {
    const offenders = TABS.flatMap(({ seed, nodes }) => nodes.filter((t) => t === 'REQ' || t === 'FORCED').map((t) => `${seed}: ${t}`));
    expect(offenders).toEqual([]);
  });

  // R3-TABS-5, ruling (a): RE-KEYED BY IDENTITY to the name as the card prints it, through the roster's label seam
  // ("Gates (if walled)" prints "Town gates": rr2s-town-under_siege-rand-1 here). Every card is still asserted.
  test('every force card still prints its force by name', () => {
    const missing = TABS.flatMap(({ seed, forces, nodes }) => forces.filter((f) => !nodes.includes(institutionDisplayName(f))).map((f) => `${seed}: ${f.name}`));
    expect(missing).toEqual([]);
  });
});
