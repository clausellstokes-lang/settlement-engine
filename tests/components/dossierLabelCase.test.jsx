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

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse } from 'espree';

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { SAFETY_BANDS, STABILITY_BANDS } from '../../src/domain/display/labelBands.js';
import { FOOD_SECURITY_BANDS, READINESS_BANDS } from '../../src/data/bandLadders.js';
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
import { DailyLifeTab } from '../../src/components/new/tabs/DailyLifeTab.jsx';
import { extractSettlementContext } from '../../src/components/new/dailyLifeLogic.js';

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
    // PowerStrata's coup-risk badge reads "Contested" to the eye and
    // aria-label="Coup risk: Contested" to a screen reader, which is the whole point of
    // it. So the ACCESSIBLE NAME is judged in the visible text's place — never waved
    // through, or the next token pill regresses silently the moment someone gives it a
    // label. (The example this comment used to name, the "w 13" coup weight, was retired
    // from the reader's view by browser pass 3 — the rule outlived its first instance.)
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
  // The World group's Daily Life strip (browser pass 3): it prints the readiness band on an
  // anchor fact, and no arm here had ever rendered it.
  ['DailyLife', (s) => <DailyLifeTab settlement={s} />],
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

/**
 * THE FOOD-SECURITY AND CRIMINAL-STRUCTURE VOCABULARIES, transcribed the same way and for the
 * same reason: the food band rides on `economicState.foodSecurity.label` and the criminal one
 * on a frozen table inside `defenseDisplay.js`, and browser pass 3 met both
 * in their declared case — "Import-Dependent" in Overview's Systems Health and
 * "Semi-Organized" on Defense. The guard arm re-reads both sources, so a transcription cannot
 * fall behind silently.
 */
const FOOD_SECURITY_LABELS = Object.freeze([
  'Deficit \u2014 Active Famine', 'Deficit', 'Import-Dependent', 'Pressured', 'Surplus', 'Secure',
]);
const CRIMINAL_STRUCTURE_LABELS = Object.freeze([
  'Organized Syndicate', 'Semi-Organized Networks', 'Diffuse Criminal Presence',
]);

// ⚠ `process.cwd()`, NOT `import.meta.url`. This file runs in the JSDOM environment, where
// `import.meta.url` is an http URL and `fileURLToPath` throws 'The URL must be of scheme
// file' before a single arm runs — the same resolution the golden-master suite uses.
const CRIMINAL_SRC = resolve(process.cwd(), 'src/domain/display/defenseDisplay.js');

/** Every frozen band word that is MULTIWORD and Title-Cased at its source. */
const TITLE_CASE_BANDS = Object.freeze([
  ...SAFETY_BANDS, ...STABILITY_BANDS, ...READINESS_LABELS,
  ...FOOD_SECURITY_LABELS, ...CRIMINAL_STRUCTURE_LABELS,
].filter((band) => /[ -]/.test(band) && band !== statusCase(band)));

describe('the dossier speaks a status, it does not Title-Case one', () => {
  test('the band vocabulary this arm walks is real, and still spelled this way at its source', () => {
    // ⛔ GUARD THE GUARD. Every arm below is a search for members of this list; if the list
    // were empty, or named words no producer emits, they would all pass on nothing. The
    // readiness and food-security labels are checked against the band ladders' one home,
    // src/data/bandLadders.js, as ARRAY EQUALITIES — a strict upgrade on the source-text
    // search this replaced, which could not see a reordering, a duplicate or an addition.
    expect(READINESS_LABELS, 'a readiness label this file names is no longer in the leaf')
      .toEqual(READINESS_BANDS.map((band) => band.label));
    expect(FOOD_SECURITY_LABELS, 'a food-security label this file names is no longer in the leaf')
      .toEqual(Object.values(FOOD_SECURITY_BANDS).map((band) => band.label));
    const crimSrc = readFileSync(CRIMINAL_SRC, 'utf8');
    expect(CRIMINAL_STRUCTURE_LABELS.filter((l) => !crimSrc.includes(`'${l}'`)),
      'a criminal-structure label this file names is no longer in the classifier').toEqual([]);
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
    const vocabulary = [
      ...SAFETY_BANDS, ...STABILITY_BANDS, ...READINESS_LABELS,
      ...FOOD_SECURITY_LABELS, ...CRIMINAL_STRUCTURE_LABELS,
    ].map((b) => String(statusCase(b)));
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

  /**
   * ⭐⭐ THE SAME RULE AS A FACT ABOUT THE SOURCE, OVER THE WHOLE DOSSIER
   * (ODQ §934.63 noticed 6).
   *
   * The arm above is the rule proved on ONE badge, rendered. The public-path walk found the
   * class it could not see: `FOUNDED` and `NOW` on the History timeline's axis, `STILL
   * RELEVANT TODAY` on an anchored-event banner, and the tier printed as `VILLAGE` on the
   * DM Summary — capitals typed into the CONTENT, a few lines from kickers that set the
   * identical look with `textTransform`. A rendered walk cannot catch them (they look
   * exactly like a styled kicker on screen, which is the point), and no grep can tell a
   * shouted word from an acronym.
   *
   * ⛔ THE RULING, PER SITE, AS THE CHAIR PUT IT: a status word takes the case ladder, a
   * genuine acronym stays, a kicker's capitals go in its style. Measured over the dossier,
   * all THIRTEEN remaining sites were kickers or badges and all thirteen are now written
   * words wearing `textTransform`. There is no acronym among them, so the census is held to
   * ZERO with no register — the exemption can be written the day a real acronym needs one,
   * by somebody who has to say which word it is.
   *
   * ⚠ THE BAR IS FOUR LETTERS, and that is a judgment rather than a measurement. Three-letter
   * stamps ('REQ', 'YOU') are legend CODES, each glossed in words on the same screen
   * ("REQ = Historically required"), and sentence-casing a two-or-three character stamp buys
   * a reader nothing. Raising the bar would let a shouted word back in; lowering it would
   * convict the legend.
   */
  test('no dossier component types a shouted word into its content', () => {
    const DOSSIER = resolve(process.cwd(), 'src/components/new');
    /** A SHOUTED WORD: four or more capitals, optionally a run of such words. */
    const SHOUT = /(?:^|[^A-Za-z])([A-Z]{4,}(?:[ '-][A-Z]{2,})*)(?:[^A-Za-z]|$)/;

    const files = [];
    (function walk(dir) {
      for (const entry of readdirSync(dir)) {
        const p = join(dir, entry);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) files.push(p);
      }
    }(DOSSIER));

    const offenders = [];
    let textNodes = 0;
    for (const abs of files) {
      const rel = abs.slice(process.cwd().length + 1).replace(/\\/g, '/');
      const src = readFileSync(abs, 'utf8');
      let ast;
      // A parse failure THROWS: a scanner that silently drops what it cannot read is the
      // vacuity this arm exists against.
      try {
        ast = parse(src, { ecmaVersion: 2024, sourceType: 'module', loc: true, ecmaFeatures: { jsx: true } });
      } catch (e) { throw new Error(`${rel} did not parse: ${e.message}`, { cause: e }); }
      const stack = [ast];
      while (stack.length) {
        const node = stack.pop();
        if (!node || typeof node.type !== 'string') continue;
        if (node.type === 'JSXText') {
          const text = node.value.trim();
          if (text) {
            textNodes += 1;
            const m = SHOUT.exec(text);
            if (m) offenders.push(`  ${rel}:${node.loc.start.line}  "${text.slice(0, 60)}"  (${m[1]})`);
          }
        }
        for (const key in node) {
          if (key === 'loc' || key === 'range') continue;
          const v = node[key];
          if (Array.isArray(v)) {
            for (const c of v) if (c && typeof c.type === 'string') stack.push(c);
          } else if (v && typeof v.type === 'string') stack.push(v);
        }
      }
    }

    // ⛔ ANTI-VACUITY, both halves: the tree and the detector.
    expect(files.length, 'the dossier tree is empty — has src/components/new moved?').toBeGreaterThanOrEqual(45);
    expect(textNodes, 'the walk found no JSX text at all — the node shape has changed').toBeGreaterThanOrEqual(100);
    expect(SHOUT.test('STILL RELEVANT TODAY'), 'the detector no longer convicts a shouted phrase').toBe(true);
    expect(SHOUT.test('Still relevant today'), 'the detector convicts a written word').toBe(false);
    expect(SHOUT.test('REQ = Historically required'), 'the detector convicts a three-letter legend code').toBe(false);

    expect(
      offenders,
      '\nA dossier component types capitals into its CONTENT where the estate puts them in the STYLE.\n'
      + 'Write the word and add `textTransform: \'uppercase\'` to the element\'s style: literal capitals '
      + 'cannot be re-cased by anything downstream, they read as a different voice beside the kickers that '
      + 'do it properly, and a screen reader spells some of them out.\n'
      + 'If the word is a genuine ACRONYM it stays — say which it is, here, in a register with its reason.\n'
      + `${offenders.join('\n')}\n`,
    ).toEqual([]);
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

describe('the three mounts browser pass 3 met, each pinned to the band it must re-case', () => {
  // ⛔ EACH FIXTURE PINS THE BAND RATHER THAN HOPING THE SEED ROLLS IT. The sweep above is a
  // net; these are the three specific mounts the pass read in their declared case, and an arm
  // that waited for a generated town to produce 'Import-Dependent' would pass vacuously on
  // most seeds and red on a tuning change that broke nothing.
  test('Overview → Systems Health speaks the food band instead of declaring it', () => {
    const s = settlements.get('village');
    const fixture = {
      ...s,
      economicState: {
        ...s.economicState,
        foodSecurity: { ...(s.economicState?.foodSecurity || {}), label: 'Import-Dependent', color: '#8a3010', resilienceScore: 42 },
      },
    };
    const { container } = render(<OverviewTab settlement={fixture} />);
    expandAll(container);
    const text = container.textContent || '';
    expect(text, 'the Food Security row did not render').toContain('Import-dependent');
    // anchored: the line above proves the row rendered, so this absence is about the case.
    expect(text).not.toContain('Import-Dependent');
    // ⭐ AND THE DATA IS UNMOVED — the state-prose pools key on the declared spelling
    // (`foodSecurity.label: Import-Dependent`), which is why this is cured at the mount.
    expect(fixture.economicState.foodSecurity.label).toBe('Import-Dependent');
    cleanup();
  }, 60000);

  test('World → Daily Life speaks the readiness band on its anchor strip', () => {
    const s = settlements.get('village');
    const dp = s.defenseProfile || {};
    const fixture = {
      ...s,
      defenseProfile: { ...dp, readiness: { ...(dp.readiness || {}), label: 'Well-Defended', color: '#1a3a6a' } },
    };
    const { container } = render(<DailyLifeTab settlement={fixture} />);
    const text = container.textContent || '';
    expect(text, 'the Defense anchor fact did not render').toContain('Well-defended');
    // anchored: the line above proves the anchor fact rendered.
    expect(text).not.toContain('Well-Defended');
    // The reader that keys the daily-life prose off this label still sees the declared
    // spelling, which is the whole reason the case is made at the mount.
    expect(extractSettlementContext(fixture).defenseReadinessLabel).toBe('Well-Defended');
    cleanup();
  }, 60000);

  test('Defense speaks the criminal-structure classification', () => {
    // THE ROSTER IS REPLACED, NOT APPENDED TO, because `deriveCriminalStructure` is a
    // CASCADE: the forged city already carries a thieves' guild, which outranks a smuggling
    // ring and would have pinned 'Organized Syndicate' instead of the band this arm names.
    // One institution, one branch, one answer.
    const s = settlements.get('city');
    const fixture = {
      ...s,
      institutions: [{ id: 'inst-smug', name: 'Smuggling ring', category: 'Criminal', status: 'healthy' }],
    };
    const { container } = render(<DefenseTab settlement={fixture} />);
    expandAll(container);
    const text = container.textContent || '';
    expect(text, 'the criminal-structure row did not render').toContain('Semi-organized networks');
    // anchored: the line above proves the row rendered.
    expect(text).not.toContain('Semi-Organized');
    cleanup();
  }, 60000);
});
