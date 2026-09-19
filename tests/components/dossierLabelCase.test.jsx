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
 * ── THE OTHER END OF THE SAME RULE (ODQ §934.22 item 4, the second browser pass) ──────
 * This file caught a label that began in LOWER case. It could not catch one that began in
 * Title Case, and the browser pass found the class sitting in plain sight: "Very Safe" and
 * "Well-Defended" on the dossier, beside "Strong" and "Adequate" one card over. The reason
 * they survived the ladder is the ladder's own law — THE FROZEN VOCABULARIES ARE RE-CASED AT
 * THE RUNG THAT RENDERS THEM, NEVER AT THE SOURCE — so `safetyProfile.js` still declares
 * 'Very Safe' and `defenseGenerator.js` still declares 'Well-Defended', correctly, and the
 * defect is a MISSING CALL at a render site. A missing call is invisible to a source grep
 * (there is nothing to find) and invisible to the ALL-CAPS arm in
 * tests/pdf/labelLadderParity.test.jsx, because Title Case is not capitals. The second
 * describe below walks the same rendered pages and convicts a multiword status whose second
 * word is capitalised.
 *
 * Collapsed sections render no children at all (`Primitives.jsx` renders `{open && children}`),
 * so every closed disclosure is opened first: a defect inside a fold is still a defect.
 */
import React from 'react';
import { afterEach, beforeAll, describe, expect, test } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { SAFETY_BANDS, STABILITY_BANDS } from '../../src/domain/display/labelBands.js';
import { TABLE_KIND_LABEL } from '../../src/domain/summary/tonightAtTheTable.js';
import { tokenCase, statusCase, nameOrTokenCase } from '../../src/components/new/labelLadder.js';
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
import PlotHooksTab from '../../src/components/new/tabs/PlotHooksTab.jsx';

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

/**
 * The same leaves, WITH the style that decides whether their capitals are the word's or
 * the stylesheet's. Kept beside `SEEN` rather than replacing it: the lower-case arm has
 * only ever needed the text, and widening its input would move an arm nobody asked to move.
 * @type {Array<{ text: string, transform: string }>}
 */
const SEEN_RICH = [];

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
    const shown = aria ? aria.trim() : text;
    out.push(shown);
    SEEN_RICH.push({ text: shown, transform: String(el.style.textTransform || '') });
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

/**
 * THE READINESS LADDER'S SIX LABELS, transcribed from `defenseGenerator.js`'s band cascade.
 * They are not exported (the generator returns `{ score, label, color, … }` on the
 * settlement), so the arm below re-reads the generator's SOURCE and reds if a label here has
 * no counterpart there — a transcription that cannot fall behind silently.
 */
const READINESS_LABELS = Object.freeze([
  'Fortress', 'Well-Defended', 'Defensible', 'Lightly Defended', 'Vulnerable', 'Undefended',
]);

// ⚠ `process.cwd()`, NOT `import.meta.url`. This file runs in the JSDOM environment, where
// `import.meta.url` is an http URL and `fileURLToPath` throws 'The URL must be of scheme
// file' before a single arm runs — the same resolution the golden-master suite uses.
const GENERATOR_SRC = resolve(process.cwd(), 'src/generators/defenseGenerator.js');

/** Every frozen band word that is MULTIWORD and Title-Cased at its source. */
const TITLE_CASE_BANDS = Object.freeze([
  ...SAFETY_BANDS, ...STABILITY_BANDS, ...READINESS_LABELS,
].filter((band) => /[ -]/.test(band) && band !== statusCase(band)));

describe('the dossier speaks a status, it does not Title-Case one', () => {
  test('the band vocabulary this arm walks is real, and still spelled this way at its source', () => {
    // ⛔ GUARD THE GUARD. Every arm below is a search for members of this list; if the list
    // were empty, or named words no producer emits, they would all pass on nothing. The
    // readiness labels are checked against the generator's own source because they are the
    // only ones this file transcribes.
    const src = readFileSync(GENERATOR_SRC, 'utf8');
    const missing = READINESS_LABELS.filter((l) => !src.includes(`'${l}'`));
    expect(missing, 'a readiness label this file names is no longer in the generator').toEqual([]);
    // FOUR at this tip — 'Very Safe', 'Enforced Order', 'Well-Defended', 'Lightly Defended'
    // — and the floor is the measured number rather than a comfortable one, so a vocabulary
    // rename that emptied the list would red here instead of passing on nothing.
    expect(TITLE_CASE_BANDS.length, 'no multiword Title-Case band left to walk').toBeGreaterThanOrEqual(4);
    expect(TITLE_CASE_BANDS).toContain('Very Safe');
    expect(TITLE_CASE_BANDS).toContain('Well-Defended');
  });

  test('no rendered label prints a frozen band in its DECLARED case', () => {
    // The producers are RIGHT to declare 'Very Safe' — `labelCase.js` states the law: the
    // frozen vocabularies are re-cased at the rung that renders them, never at the source.
    // So a band appearing on the page in its declared spelling is a MISSING CALL at a render
    // site, which is exactly what the browser pass met on the Overview and Defense tabs.
    const offenders = new Set();
    for (const { text } of SEEN_RICH) {
      for (const band of TITLE_CASE_BANDS) {
        if (text.includes(band)) offenders.add(`${text}  (contains the declared "${band}")`);
      }
    }
    expect([...offenders]).toEqual([]);
  });

  test('and the sweep really did render that vocabulary, so the arm above is not vacuous', () => {
    // ⛔ WITHOUT THIS, a page that rendered no status at all would pass the arm above. The
    // check is over the WHOLE band vocabulary rather than the four multiword ones, and
    // deliberately: which band a fixture draws is the fixture's luck ('Safe' and 'Defensible'
    // are as likely as 'Very Safe'), and an arm that pinned luck would red on a tuning change
    // that broke nothing. What must hold is that these pages render STATUSES, in the
    // ladder's case.
    const vocabulary = [...SAFETY_BANDS, ...STABILITY_BANDS, ...READINESS_LABELS]
      .map((b) => String(statusCase(b)));
    const found = vocabulary.filter((c) => SEEN_RICH.some(({ text }) => text.includes(c)));
    expect(found.length, 'the sweep rendered no status band at all — it is testing nothing')
      .toBeGreaterThan(0);
  });
});

describe('a badge\'s capitals belong to its style, never to its word', () => {
  test("the Tonight card's kind badge carries the display word and an uppercase transform", () => {
    // THE DEFECT (§934.22 item 4): this badge rendered the raw model token 'HOOK' with
    // `textTransform` unset, so the cheat sheet said 'Hook' and the session card shouted the
    // same entry's kind. Literal capitals in a string cannot be re-cased by anything
    // downstream, which is the whole reason rung 1 puts them in the stylesheet.
    const settlement = settlements.get('city');
    const { container } = render(<SessionMode settlement={settlement} onClose={() => {}} />);
    const badges = [...container.querySelectorAll('#sf-session-tonight span')]
      .filter((el) => Object.values(TABLE_KIND_LABEL).includes((el.textContent || '').trim()));
    // anchored: the card must have rendered badges at all, or "no offenders" means nothing.
    expect(badges.length, 'the Tonight section rendered no kind badge').toBeGreaterThan(0);
    for (const el of badges) {
      const text = (el.textContent || '').trim();
      expect(Object.values(TABLE_KIND_LABEL), `"${text}" is not one of the display words`).toContain(text);
      expect(el.style.textTransform, `"${text}" gets its case from the string, not the style`).toBe('uppercase');
      // The raw token never reaches the page except where the token IS the display word.
      if (!/^[A-Z]+$/.test(text)) expect(text).not.toBe(text.toUpperCase());
    }
    cleanup();
  }, 60000);
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

/**
 * A town with exactly the two hook sources that pull in opposite directions: a PERSON, whose
 * name is whatever the culture's generator spelled, and an ENGINE CATEGORY, which is a bare
 * snake_case id. Hand-built rather than forged, because a generated town's hook list is its
 * own luck and this arm needs both shapes on one card every run.
 */
const HOOK_SOURCE_TOWN = Object.freeze({
  name: 'Ashcombe',
  tier: 'village',
  npcs: [{
    name: 'Sita Goswami',
    role: 'Mayor',
    plotHooks: ['She holds the only key to the tithe barn, and will not say why.'],
  }],
  economicViability: {
    plotHooks: [{ hook: 'The caravans have stopped coming through the pass.', category: 'trade_route' }],
  },
});

describe('a hook source is a name or a token, and the card may not confuse the two', () => {
  test("the Plot Hooks card keeps an NPC's own spelling and still cases an engine category", () => {
    // THE DEFECT (browser pass 3, 2026-09-19): this mount ran `hook.source` through
    // `tokenCase`, which is right for the economic hook's 'trade_route' and wrong for the
    // NPC hook's name — the card said "Sita goswami" while the Power tab two clicks away
    // said "Sita Goswami", off the same generated person.
    const { container } = render(<PlotHooksTab settlement={HOOK_SOURCE_TOWN} />);
    const text = container.textContent || '';
    expect(text, 'the card rendered no hooks at all').toContain('Sita Goswami');
    // anchored: the line above proves the NPC hook rendered, so the absence below is real.
    expect(text).not.toContain('Sita goswami');
    expect(text, 'the engine category still has to become a word').toContain('Trade route');
    // anchored: the assertion above proves the economic hook rendered.
    expect(text).not.toContain('trade_route');
    cleanup();
  }, 60000);

  test('nameOrTokenCase cases a token and hands a written name straight back', () => {
    expect(nameOrTokenCase('trade_route')).toBe('Trade route');
    expect(nameOrTokenCase('npc')).toBe('NPC');
    expect(nameOrTokenCase('criminal-opportunity')).toBe('Criminal-opportunity');
    // Anything a writer has already cased — a generated person, a joined pair, an authored
    // source label — is returned byte-identical. This is the half `tokenCase` gets wrong.
    expect(nameOrTokenCase('Sita Goswami')).toBe('Sita Goswami');
    expect(nameOrTokenCase('Safety & Crime')).toBe('Safety & Crime');
    expect(nameOrTokenCase('Reeve Alder & Brother Tomas')).toBe('Reeve Alder & Brother Tomas');
    expect(tokenCase('Sita Goswami'), 'the function it replaced still lower-cases the surname')
      .toBe('Sita goswami');
    // Not a string, or empty: handed straight back, like its two siblings.
    expect(nameOrTokenCase('')).toBe('');
    expect(nameOrTokenCase(null)).toBe(null);
  });
});
