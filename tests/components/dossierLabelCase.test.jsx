/** @vitest-environment jsdom */
/**
 * tests/components/dossierLabelCase.test.jsx — NO LABEL STARTS IN LOWER CASE.
 *
 * ── THE DEFECT THIS EXISTS FOR (review pass 3, 2026-09-18) ───────────────────────────
 * The label ladder took `textTransform:'uppercase'` off rung-2 and rung-3 elements. Several
 * of those elements were not rendering a WORD at all — they were rendering a raw engine
 * token, and the capitals had been doing the work of making it look like English:
 *
 *   attacking · defending · honored · strained · defaulted · dear · cheap · surplus ·
 *   adequate · collapsed · blockade · tithe · drawdown · government · military
 *
 * In capitals those read as labels. In sentence case they read as debug output. The cure is
 * `tokenCase` at the render site (components/new/labelLadder.js); THIS is the arm that says
 * the class is gone and stays gone, because the next token pill added to any of these tabs
 * would otherwise repeat it silently.
 *
 * ── WHAT IT ASSERTS ──────────────────────────────────────────────────────────────────
 * On a freshly forged town, across the Power, Defense, War, Economics and Viability tabs:
 * every LEAF element that reads as a label or a pill — short, emphasised text — begins with
 * a capital, a digit or a mark. Prose is excluded by length, because a sentence fragment may
 * legitimately begin in lower case and this arm is not about prose.
 *
 * ⛔ IT IS NOT A CASE RULE FOR THE WHOLE PAGE. Provenance and meta tags stay lower case by
 * the ladder's own ruling ("seed · lf-033", "derived · npcs"), so the rule is scoped to
 * EMPHASISED leaves (fontWeight 700+), which is what a label or a pill is and what a meta
 * tag is not. `ALLOWED` below carries the deliberate exceptions, each with its reason.
 *
 * Collapsed sections render no children at all (`Primitives.jsx` renders `{open && children}`),
 * so every closed disclosure is opened first: a defect inside a fold is still a defect.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { tokenCase, statusCase } from '../../src/components/new/labelLadder.js';
import { PowerTab } from '../../src/components/new/tabs/PowerTab.jsx';
import { DefenseTab } from '../../src/components/new/tabs/DefenseTab.jsx';
import WarTab from '../../src/components/new/tabs/WarTab.jsx';
import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { ViabilityTab } from '../../src/components/new/tabs/ViabilityTab.jsx';
import { OverviewTab } from '../../src/components/new/tabs/OverviewTab.jsx';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import MarketPricesSection from '../../src/components/new/tabs/MarketPricesSection.jsx';
import { PowerSuccessionSection } from '../../src/components/dossier/EngineSections.jsx';
import SessionMode from '../../src/components/session/SessionMode.jsx';

/** Deliberately lower case, with the reason. Anything else that starts lower is a defect. */
const ALLOWED = new Set([
  'cheat sheet',   // the quick guide's own meta tag (the ladder leaves meta tags alone)
]);

/** Towns chosen to light different branches; every one is a FRESH generation. */
const CASES = [
  ['village', { settType: 'village', culture: 'germanic', terrainOverride: 'grassland', tradeRouteAccess: 'road' }, 'label-case-village'],
  ['city', { settType: 'city', culture: 'mediterranean', terrainOverride: 'coastal', tradeRouteAccess: 'port' }, 'label-case-city'],
];

/** Every label the sweep looked at, for the one global anti-vacuity arm below. */
const SEEN = [];

const settlements = new Map();
beforeAll(() => {
  for (const [name, config, seed] of CASES) {
    settlements.set(name, generateSettlementPipeline(config, null, { seed, customContent: {} }));
  }
});
afterEach(cleanup);

/** Open every closed disclosure, so a label inside a fold is scanned too. */
function expandAll(container) {
  for (let pass = 0; pass < 4; pass += 1) {
    const shut = [...container.querySelectorAll('[aria-expanded="false"]')];
    if (shut.length === 0) return;
    for (const b of shut) fireEvent.click(b);
  }
}

/**
 * Every leaf that reads as a label or a pill: its own text, short and emphasised.
 * @param {HTMLElement} root
 */
function labelLeaves(root) {
  const out = [];
  for (const el of root.querySelectorAll('*')) {
    if (el.children.length > 0) continue;                       // leaves only
    const text = (el.textContent || '').trim();
    if (!text || text.length > 40) continue;                    // prose is not a label
    if (text.split(/\s+/).length > 5) continue;
    const weight = Number(el.style.fontWeight || 0);
    if (weight < 700) continue;                                 // a meta tag is not emphasised
    // An element that carries its OWN accessible name is a deliberate abbreviation:
    // PowerStrata's coup weight reads "w 13" to the eye and aria-label="Coup weight 13"
    // to a screen reader, which is the whole point of it. So the ACCESSIBLE NAME is
    // judged in the visible text's place — never waved through, or the next token pill
    // regresses silently the moment someone gives it a label.
    const aria = el.getAttribute('aria-label');
    out.push(aria ? aria.trim() : text);
  }
  return out;
}

const TABS = [
  ['Power', (s) => <PowerTab powerStructure={s.powerStructure} settlement={s} />],
  ['Defense', (s) => <DefenseTab settlement={s} />],
  ['War', (s) => <WarTab settlement={s} />],
  ['Economics', (s) => <EconomicsTab economicState={s.economicState} settlement={s} />],
  ['Viability', (s) => <ViabilityTab settlement={s} />],
  // The surfaces this lane's own token cures landed on — each needs an arm of its own,
  // or the cure is pinned only where the first sweep happened to look.
  ['Overview', (s) => <OverviewTab settlement={s} />],
  ['Causes', (s) => <SubstrateTab settlement={s} />],
  ['Succession', (s) => <PowerSuccessionSection settlement={s} />],
  ['MarketPrices', (s) => <MarketPricesSection prices={s.economicState?.marketPrices || { highlight: null, exports: [], imports: [] }} />],
  ['SessionMode', (s) => <SessionMode settlement={s} onClose={() => {}} />],
];

describe('the dossier renders words, not engine tokens', () => {
  // ONE NAMED TEST LOOPING ITS ROWS, never a parameterised table. A file that parks on the
  // each-family credits NO titles to the lighting census, so every pin below was invisible
  // to it. Both rows and every assertion are unchanged, and the message already names the
  // town and the tab, so a failure still says exactly which pair broke.
  //
  // ⚠ THE LOOP CLEANS UP AFTER ITSELF. `afterEach` fires once per TEST, not once per row, so
  // without this each iteration would leave its tree mounted and the next would render on
  // top of it — the containers stay distinct, but the DOM would grow for twenty renders.
  test('no label or pill begins in lower case, on every town and every tab', () => {
    const ROWS = CASES.flatMap(([townName]) => TABS.map(([tabName, renderFn]) => [townName, tabName, renderFn]));
    for (const [town, tab, render_] of ROWS) {
      const settlement = settlements.get(town);
      const { container } = render(render_(settlement));
      expandAll(container);

      const leaves = labelLeaves(container);
      SEEN.push(...leaves);

      const offenders = [...new Set(leaves.filter((t) => /^[a-z]/.test(t) && !ALLOWED.has(t)))];
      expect(offenders, `${town} / ${tab} renders a raw token where a word belongs`).toEqual([]);
      cleanup();
    }
    // ⚠ AN EXPLICIT TIMEOUT, because folding a table into one test folds its BUDGET too.
    // Twenty full tab renders with every disclosure expanded used to be twenty tests with
    // 20s each; they are now one test, and the global 20s would fail this as a TIMEOUT under
    // parallel load rather than as the label defect it exists to catch.
  }, 120000);

  // ANTI-VACUITY, ONCE AND GLOBALLY rather than per tab. A tab may legitimately render
  // nothing — WarTab on a town at peace is empty by design, and asserting a label count
  // there would pin the fixture's luck rather than the rule. What must hold is that the
  // sweep as a whole really looked at labels.
  test('the sweep saw a real page, so the arms above are not vacuous', () => {
    expect(SEEN.length, 'the sweep found almost no labels — it is testing nothing').toBeGreaterThan(200);
    expect(new Set(SEEN).size, 'the sweep saw one label repeated, not a page').toBeGreaterThan(40);
  });
});

describe('the two casing helpers', () => {
  test('tokenCase makes a machine token a word, and keeps the estate initialisms', () => {
    expect(tokenCase('blockade')).toBe('Blockade');
    expect(tokenCase('surplus')).toBe('Surplus');
    expect(tokenCase('criminal_opportunity')).toBe('Criminal opportunity');
    expect(tokenCase('npc')).toBe('NPC');
    expect(tokenCase('npcs')).toBe('NPCs');
    // WORD-WISE: an initialism inside a phrase survives, which a whole-string guard missed.
    expect(tokenCase('npc contacts')).toBe('NPC contacts');
    expect(tokenCase('NPC contacts')).toBe('NPC contacts');
    expect(tokenCase('ai notes')).toBe('AI notes');
    expect(tokenCase('Black Market')).toBe('Black market');
    // Already a word: left alone rather than re-cased into something else.
    expect(tokenCase('Essential')).toBe('Essential');
    // Not a string, or empty: handed straight back, never coerced.
    expect(tokenCase('')).toBe('');
    expect(tokenCase(null)).toBe(null);
    expect(tokenCase(7)).toBe(7);
  });

  test('statusCase is the ALL-CAPS half, and this is why the two are not one function', () => {
    expect(statusCase('ACTIVE CRISIS')).toBe('Active crisis');
    expect(statusCase('STRONG')).toBe('Strong');
    // The difference that earns the second function: statusCase cannot know an initialism.
    expect(statusCase('npc')).toBe('Npc');
    expect(tokenCase('npc')).toBe('NPC');
  });
});
