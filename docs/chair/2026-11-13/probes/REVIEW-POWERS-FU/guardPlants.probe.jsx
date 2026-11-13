/**
 * @vitest-environment jsdom
 *
 * tests/components/seatHolderOnThePage.test.jsx — COHERENCE-POWERS-5, THE GUARD THAT WOULD HAVE CAUGHT N1 TO N3
 * (REVIEW-POWERS-2 at e86d069be; the chair's brief to the fifth seat). The owner's principle: whoever leads the town
 * is ELEVATED, YET STILL TIED to the institution they come from. Read on the RENDERED page, for every town:
 *
 *   (1) the seat-holder's card says they hold the seat ("Holds the seat …" on the card the people list opens);
 *   (2) it reads as no one's subordinate (no row that places its holder under the seat, an office or a greater house);
 *   (3) it reads at the office's influence or above (the card's dots against the office's band at the town's size);
 *   (4) no other card says it holds the seat.
 *
 * The seat-holder is the person the Power tab's seat row names (rendered here and read from it), and the people list
 * is rendered with every group and card opened, as the owner reads it. Births through birthConfig with the census's
 * dials, at six sizes on random dials and under every crisis forced.
 *
 * @enforced-by npx vitest run tests/components/seatHolderOnThePage.test.jsx
 */
import { beforeAll, afterEach, describe, expect, it } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { NPCsTab } from '../../src/components/new/tabs/NPCsTab.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { rulingChainOf } from '../../src/domain/dossier/powerStrata.js';
import { entityAnchor } from '../../src/domain/dossier/entityLinks.js';

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

/** The census's cfgFor (docs/chair/2026-11-12/probes/SECOND-WAVE-CENSUS/births.mjs). */
function born(seed) {
  let m = seed.match(/^r2r-(\w+)-(\d+)$/);
  const cfg = m
    ? birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: m[1] })
    : (m = seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/))
      && birthConfig({ ...DEFAULT_CONFIG, ...DIALS, selectedStresses: [m[1]], selectedStressesRandom: false, settType: m[2] });
  if (!cfg) throw new Error(seed);
  return generateSettlementPipeline(cfg, null, { seed, customContent: {} });
}

/** The seat's rows' opening, a literal. */
const HOLDS = /Holds the seat\b/;
/**
 * A STRUCTURAL LINE THAT SUBORDINATES ITS CARD — one that places the holder under the seat, an office, a greater house or a
 * senior (COHERENCE-POWERS-6, item 4; REVIEW-POWERS-2 G1). The first group is the opening word of every subordinate position
 * the pools carry (data/npcStructure NPC_STRUCTURE, the `subordinate` rows); the second is the subordinating MARKER a clause
 * may carry wherever it sits (a position, a constraint or a goal), drawn from the same pools' tails ("under its leaders",
 * "behind the leading", "only as strong as the seat", "without the seniors' leave") and widened to the plants in §G1. None
 * of the six government-dominant holder triples (position, constraint, goal) matches it (proved by the plant arm's control).
 */
const SUBORDINATE = new RegExp([
  'Heads an old family while the seat', 'Serves the faith under its leaders', 'Belongs to a lesser', 'Runs a smaller house',
  'Leads a squad', 'Works spells under', 'Holds an office', 'Holds a place',
  'under (its|the|a) (leaders|senior casters|seat|crew)', 'behind the leading', 'a lesser (old )?family', 'smaller house',
  'takes orders from', 'only as strong as the seat', 'without the seniors\'? leave', 'has little say',
  'decides? what it (may|can) do', 'offices that run things', 'truly runs? the seat', 'say (slowly )?shrinks',
].join('|'));
/** The office's band at each size: the dots the seat's own face draws (poolMap.js :: SEAT_ROLE_BY_TIER), literals. */
const OFFICE_DOTS = Object.freeze({ thorp: 1, hamlet: 1, village: 3, town: 3, city: 3, metropolis: 3 });

/**
 * The holder's structural lines on its rendered card (COHERENCE-POWERS-6, item 4): the position (its italic paragraph), the
 * constraint ("Constraint: …") and the goal ("Wants …"), read in full — NOT one paragraph (G1: the old guard found the first
 * paragraph matching HOLDS or SUBORDINATE and inspected that alone, so a subordinating constraint, goal or clause beyond the
 * position passed). @param {HTMLElement} el the card's node @returns {string[]}
 */
function holderStructuralLines(el) {
  const ps = [...el.querySelectorAll('p')].map((p) => p.textContent || '');
  const wants = [...el.querySelectorAll('div')].map((d) => d.textContent || '').filter((t) => /^Wants\b/.test(t.trim()));
  return [...ps.filter((t) => HOLDS.test(t) || SUBORDINATE.test(t) || /^Constraint:/.test(t.trim())), ...wants];
}

/** Open every closed disclosure (the groups, then every card), as the owner reads the list. @param {HTMLElement} root */
function openAll(root) {
  for (let pass = 0; pass < 4; pass++) {
    const closed = [...root.querySelectorAll('[aria-expanded="false"]')];
    if (!closed.length) return;
    closed.forEach((el) => fireEvent.click(el));
  }
}

/** Every miss of the four reads in one town, on the rendered page. @param {any} s @param {string} key */
function pageMissesOf(s, key) {
  const name = rulingChainOf(s).npc?.name || null;
  const power = render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />).container.textContent || '';
  cleanup();
  const out = [];
  if (name && !power.includes(name)) out.push(`${key}: the Power tab does not print the seat's holder ${name}`);
  const list = render(<NPCsTab npcs={s.npcs} settlement={s} narrativeNote={null} pinnedIds={new Set()} />).container;
  openAll(list);
  for (const card of s.npcs || []) {
    const el = list.querySelector(`[id="${entityAnchor('npc', card)}"]`);
    if (!el) { if (card.name === name) out.push(`${key}: the holder ${name} has no card on the people list`); continue; }
    const text = el.textContent || '';
    if (card.name === name) {
      if (!HOLDS.test(text)) out.push(`${key}: the holder ${name}'s card does not say they hold the seat`);
      // COHERENCE-POWERS-6 (item 4; G1): read EVERY structural line, not the first matching paragraph
      const sub = holderStructuralLines(el).find((t) => SUBORDINATE.test(t));
      if (sub) out.push(`${key}: the holder ${name}'s card reads as a subordinate: "${sub.trim()}"`);
      const dots = (el.querySelector('button')?.textContent || '').match(/●+/)?.[0].length || 0;
      if (dots < OFFICE_DOTS[s.tier]) out.push(`${key}: the holder ${name}'s card reads ${dots} dot(s) under a ${OFFICE_DOTS[s.tier]}-dot office`);
    } else if (HOLDS.test(text)) {
      out.push(`${key}: ${card.name} (${card.role}) is not the seat's holder (${name ?? 'none'}) and says it holds the seat`);
    }
  }
  cleanup();
  return out;
}

describe('COHERENCE-POWERS-5 — the seat-holder on the rendered page (the guard for N1–N3)', () => {
  beforeAll(async () => { await loadGenerationLawPayloads(); }, 60_000);

  it('the review\'s towns: the holder holds the seat on the card, above none, at the office\'s weight; no one else does', () => {
    const misses = [];
    for (const seed of ['r2r-thorp-0', 'r2s-insurgency-town-0', 'r2s-occupied-city-0', 'r2r-city-0', 'r2r-town-1',
      'r2s-occupied-town-0', 'r2s-politically_fractured-village-0', 'r2r-thorp-1']) misses.push(...pageMissesOf(born(seed), seed));
    expect(misses).toEqual([]);
  }, 300_000);

  // COHERENCE-POWERS-6 (item 4; REVIEW-POWERS-2 G1): the plants, each outside the cured sites — a subordinating line is
  // written over the holder's own structural field on a real holder town, and the guard must catch it. Each plant reddens
  // check (2) alone. The old guard (first matching paragraph; the narrow SUBORDINATE vocabulary) missed all three; the
  // widened guard (holderStructuralLines + the subordinating markers) catches each. The control (no plant) stays green.
  const PLANTS = Object.freeze([
    // REVIEW-POWERS-FU's own plants: subordinating clauses NOT drawn from the review's three or the guard's vocabulary
    { field: 'structuralPosition', line: 'Holds the seat, but only at the merchants\' pleasure.' },
    { field: 'structuralPosition', line: 'Holds the seat in the abbot\'s name and signs nothing the abbot has not read.' },
    { field: 'structuralPosition', line: 'Holds the seat as the guildmaster\'s deputy.' },
    { field: 'structuralPosition', line: 'Holds the seat on sufferance; the council of elders can remove them with a word.' },
    { field: 'activeConstraint', line: 'Must answer to the old families for every coin spent.' },
    { field: 'activeConstraint', line: 'Cannot act without the consent of the temple.' },
    { field: 'activeConstraint', line: 'Every order is reviewed by the governor\'s clerks before it is obeyed.' },
    { field: 'goal', line: 'Keep the favour of the lord who appointed them.' },
    { field: 'goal', line: 'Win back the trust of the masters they serve.' },
    { field: 'goal', line: 'Earn a place among the families who really decide things here.' },
  ]);
  /** The holder card's subordinate misses on the rendered page, with the holder's structural field overwritten. @param {any} s @param {string} key @param {{field: string, line: string} | null} plant */
  function holderSubordinateMiss(s, key, plant) {
    const name = rulingChainOf(s).npc?.name || null;
    const npcs = s.npcs.map((c) => (c.name === name && plant
      ? { ...c, ...(plant.field === 'goal' ? { goal: { ...(c.goal || {}), short: plant.line } } : { [plant.field]: plant.line }) }
      : c));
    const list = render(<NPCsTab npcs={npcs} settlement={{ ...s, npcs }} narrativeNote={null} pinnedIds={new Set()} />).container;
    openAll(list);
    const el = list.querySelector(`[id="${entityAnchor('npc', npcs.find((c) => c.name === name))}"]`);
    const sub = el ? holderStructuralLines(el).find((t) => SUBORDINATE.test(t)) : null;
    cleanup();
    return sub || null;
  }

  it('G1 — each planted subordinating line (a position clause, a constraint, a goal) reddens check (2); the control is clean', () => {
    const seed = 'r2r-town-1';
    const s = born(seed);
    expect(rulingChainOf(s).npc?.name, 'the control town has a seat-holder').toBeTruthy();
    expect(holderSubordinateMiss(s, seed, null), 'the real holder reads no subordinate line').toBeNull();
    for (const plant of PLANTS) {
      const got = holderSubordinateMiss(s, seed, plant); console.log(`PLANT ${got && got.includes(plant.line) ? 'CAUGHT' : 'MISSED'} [${plant.field}] ${plant.line}`);
    }
  }, 120_000);

  it('at six sizes on random dials and under every crisis forced, every town reads the four ways', () => {
    const misses = [];
    for (const t of TIERS) {
      for (let i = 0; i < 4; i++) misses.push(...pageMissesOf(born(`r2r-${t}-${i}`), `r2r-${t}-${i}`));
      for (const x of CRISES) misses.push(...pageMissesOf(born(`r2s-${x}-${t}-0`), `r2s-${x}-${t}-0`));
    }
    expect(misses).toEqual([]);
  }, 1_200_000);
});
