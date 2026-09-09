/**
 * @vitest-environment jsdom
 *
 * Smoke tests for src/pdf/sections/* — the PDF chapter components.
 *
 * What this catches: the class of bug where a PDF chapter crashes
 * during render because a settlement field is unexpectedly null/empty.
 * The build verifies imports compile; this verifies the chapter body
 * actually executes against several settlement shapes (full + sparse).
 *
 * Approach: PDF section components are regular React functions that
 * return @react-pdf/renderer element trees. Smoke = call the function
 * with props and assert it returns truthy without throwing. This
 * exercises the body-level logic (where the bugs live) without paying
 * the cost of an actual PDF render (~seconds each, plus the fontkit
 * subsystem doesn't always play nicely with jsdom).
 *
 * The four chapters chosen are the ones the recommendation called out:
 * Cover (the page DMs see first), IdentityDailyLife (most field-rich),
 * PowerStructure (the most-frequently-restructured chapter), and
 * EconomicsTrade (the supply-chain heavy chapter most likely to choke
 * on partial data).
 */

import { describe, test, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { Cover } from '../../src/pdf/sections/Cover.jsx';
import { IdentityDailyLife } from '../../src/pdf/sections/IdentityDailyLife.jsx';
import { PowerStructure } from '../../src/pdf/sections/PowerStructure.jsx';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';

const SEED = 'pdf-smoke-2026-05';

let villageSettlement;
let villageVm;
let metropolisSettlement;
let metropolisVm;
let sparseSettlement;
let sparseVm;

beforeAll(() => {
  villageSettlement = generateSettlementPipeline(
    { settType: 'village', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
    null,
    { seed: SEED, customContent: {} },
  );
  villageVm = buildViewModel({ settlement: villageSettlement });

  metropolisSettlement = generateSettlementPipeline(
    { settType: 'metropolis', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
    null,
    { seed: `${SEED}-metro`, customContent: {} },
  );
  metropolisVm = buildViewModel({ settlement: metropolisSettlement });

  // Deliberately threadbare — simulates partial generation / mid-migration
  // saves the user can encounter. PDF chapters should handle gracefully.
  sparseSettlement = { name: 'Sparse', tier: 'thorp', population: 30 };
  sparseVm = buildViewModel({ settlement: sparseSettlement });
});

// Helper: call a PDF chapter as a function; assert it returns a truthy
// element tree without throwing. We don't render to PDF bytes — that's
// integration-test territory and slow. This catches the bugs the user
// actually encounters (chapter blows up on render for X settlement shape).
function smokeChapter(Chapter, props) {
  let result;
  expect(() => { result = Chapter(props); }).not.toThrow();
  expect(result).toBeTruthy();
}

describe('Cover smoke', () => {
  test('renders for a full village settlement', () => {
    smokeChapter(Cover, { settlement: villageSettlement, vm: villageVm });
  });
  test('renders for a full metropolis settlement', () => {
    smokeChapter(Cover, { settlement: metropolisSettlement, vm: metropolisVm });
  });
  test('renders for a sparse settlement', () => {
    smokeChapter(Cover, { settlement: sparseSettlement, vm: sparseVm });
  });
  test('renders in narrative mode (uses AI fields when present)', () => {
    smokeChapter(Cover, { settlement: villageSettlement, vm: villageVm, narrativeMode: true });
  });
});

describe('IdentityDailyLife smoke', () => {
  test('renders for a full village settlement', () => {
    smokeChapter(IdentityDailyLife, { settlement: villageSettlement, vm: villageVm });
  });
  test('renders for a full metropolis settlement', () => {
    smokeChapter(IdentityDailyLife, { settlement: metropolisSettlement, vm: metropolisVm });
  });
  test('renders for a sparse settlement', () => {
    smokeChapter(IdentityDailyLife, { settlement: sparseSettlement, vm: sparseVm });
  });
});

describe('PowerStructure smoke', () => {
  test('renders for a full village settlement', () => {
    smokeChapter(PowerStructure, { settlement: villageSettlement, vm: villageVm });
  });
  test('renders for a full metropolis settlement', () => {
    smokeChapter(PowerStructure, { settlement: metropolisSettlement, vm: metropolisVm });
  });
  test('renders for a sparse settlement', () => {
    smokeChapter(PowerStructure, { settlement: sparseSettlement, vm: sparseVm });
  });
});

describe('EconomicsTrade smoke', () => {
  test('renders for a full village settlement', () => {
    smokeChapter(EconomicsTrade, { settlement: villageSettlement, vm: villageVm });
  });
  test('renders for a full metropolis settlement', () => {
    smokeChapter(EconomicsTrade, { settlement: metropolisSettlement, vm: metropolisVm });
  });
  test('renders for a sparse settlement', () => {
    smokeChapter(EconomicsTrade, { settlement: sparseSettlement, vm: sparseVm });
  });
});

/**
 * FOOD BALANCE IS A TRI-STATE, AND THIS CHAPTER READ IT AS A BINARY.
 *
 * Every sibling renderer guards strictly — EconomicsTrade's FoodBalanceBlock draws
 * a DEFICIT block on `fb.deficit > 0` and a SURPLUS block on `fb.surplus > 0`, and
 * Overview's FoodBalanceBar does the same — so a settlement in balance simply gets
 * neither, and the domain names that third state itself: dossierViewModel.js:141
 * sets `display = 'Balanced'` when neither is positive, exactly as the screen's
 * EconomicsTab:298 does. IdentityDailyLife was the one chapter that forced the
 * tri-state into `deficit > 0 ? … : surplus`, so a balanced settlement was told,
 * on a paid page, that it ran a "+0 units" surplus and that "the local food supply
 * is reliable" — a verdict in the GOOD tone off a number that says nothing.
 *
 * Worse at the anchor: `deriveFoodBalance` returns `available:false` with 0/0 for a
 * settlement whose economy was never computed, so a threadbare save printed
 * "FOOD +0 units" — a fact asserted where none exists. Both sites are cured here;
 * the anchor's is cured in the view model, where `available` is already known.
 */
describe('IdentityDailyLife — the food balance reads as a tri-state, not a binary', () => {
  function collectText(node, out = []) {
    if (node == null || node === false || node === true) return out;
    if (typeof node === 'string') { out.push(node); return out; }
    if (typeof node === 'number') { out.push(String(node)); return out; }
    if (Array.isArray(node)) { for (const c of node) collectText(c, out); return out; }
    if (typeof node?.type === 'function') { collectText(node.type({ ...node.props }), out); return out; }
    const children = node?.props?.children;
    if (children != null) collectText(children, out);
    return out;
  }

  function chapterText(foodBalance) {
    const settlement = {
      name: 'Balanceford', tier: 'town', population: 900,
      ...(foodBalance ? { economicViability: { metrics: { foodBalance } } } : {}),
    };
    const vm = buildViewModel({ settlement });
    return collectText(IdentityDailyLife({ settlement, vm })).join(' ');
  }

  const BALANCED = { dailyProduction: 500, dailyNeed: 500, surplus: 0, deficit: 0 };
  const SURPLUS  = { dailyProduction: 700, dailyNeed: 500, surplus: 200, deficit: 0 };
  const DEFICIT  = { dailyProduction: 300, dailyNeed: 500, surplus: 0, deficit: 200 };

  test('a DEFICIT still reads as a deficit (control, unchanged)', () => {
    const text = chapterText(DEFICIT);
    expect(text).toContain('−200 units');
    expect(text).toContain('depends on imports for daily survival');
  });

  test('a SURPLUS still reads as a surplus (control, unchanged)', () => {
    const text = chapterText(SURPLUS);
    expect(text).toContain('+200 units');
    expect(text).toContain('The local food supply is reliable');
  });

  test('a BALANCED settlement is never told it runs a surplus of zero', () => {
    const text = chapterText(BALANCED);
    // The anchor row and the Daily Life callout both stop claiming a surplus.
    expect(text).not.toContain('+0 units'); // anchored: 'Balanced' + 'in balance' are asserted PRESENT below — the chapter rendered and chose the third word
    expect(text).not.toContain('Surplus of 0 units'); // anchored: same — the callout rendered ('in balance' below)
    expect(text).not.toContain('The local food supply is reliable'); // anchored: same — the verdict sentence rendered as 'in balance' below
    // ...and both say the estate's own third word instead.
    expect(text).toContain('Balanced');
    expect(text).toContain('in balance');
  });

  test('a settlement whose food was never calculated asserts nothing about food', () => {
    const text = chapterText(null);
    // anchored: the chapter demonstrably rendered (the identity rows are present),
    // so the absence below is a suppression rather than an empty page.
    expect(text).toContain('Balanceford');
    expect(text).not.toContain('+0 units'); // anchored: 'Balanceford' asserted present above — the chapter rendered, so this absence is a suppression
    expect(text).not.toContain('Surplus of 0 units'); // anchored: same anchor ('Balanceford' above)
    expect(text).not.toContain('Balanced'); // anchored: same anchor ('Balanceford' above) — no food data means NO third word either
  });
});
