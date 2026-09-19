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
import { defenseSlice, servicesSlice } from '../../src/pdf/lib/viewModelBodySlices.js';
import { DefenseSecurity } from '../../src/pdf/sections/DefenseSecurity.jsx';
import { deriveSupportingCapabilities } from '../../src/domain/display/defenseDisplay.js';
import { scoreBand } from '../../src/domain/display/defenseScoreBands.js';
import { statusCase } from '../../src/components/new/labelLadder.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { Institutions } from '../../src/pdf/sections/Institutions.jsx';
import { Services } from '../../src/pdf/sections/Services.jsx';
import { resourcesSlice } from '../../src/pdf/lib/viewModelBodySlices.js';
import { institutionDisplayName } from '../../src/domain/display/institutionDisplayName.js';

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

/**
 * ── THE DEAD MAGIC READER (review 10, 2026-09-18) ────────────────────────────────────
 *
 * Chapter 02's anchor panel carried a `MAGIC` chip fed by `identity.anchor.magicalCapability`,
 * which was read from `defenseProfile.magicalCapability` — A KEY NO WRITER PRODUCES.
 * `generateDefenseProfile` returns scores, readiness, institutions, magicDependency,
 * traditions, chainModifiers and economicGates; the world pulse re-spreads `scores` alone;
 * no save shape carries the key. The read was guarded (`|| null`) so it never threw — it
 * simply resolved to null on every settlement ever exported, and the chip never printed.
 *
 * ⛔ THE PIN IS ON THE CHIP LABELS, NOT ON THE PAGE TEXT, and the difference matters: the
 * same chapter renders a `Magic-dependent` TAG a few lines below from the live
 * `magicDependency` flag, so a text-level search for the word would either collide with a
 * fact that IS written or pass only by the accident of letter case. The anchor row's labels
 * are the exact surface the chip lived on, so that is what is read.
 */
describe('IdentityDailyLife — the magic word-grade with no writer is gone', () => {
  /** Every KeyValRow label in a chapter's element tree, in render order. */
  function chipLabels(node, out = []) {
    if (node == null || typeof node !== 'object') return out;
    if (Array.isArray(node)) { for (const c of node) chipLabels(c, out); return out; }
    if (Array.isArray(node?.props?.pairs)) {
      for (const pair of node.props.pairs) if (pair?.label) out.push(String(pair.label).toUpperCase());
    }
    if (typeof node?.type === 'function') { chipLabels(node.type({ ...node.props }), out); return out; }
    if (node?.props?.children != null) chipLabels(node.props.children, out);
    return out;
  }

  test('the view model offers no magicalCapability, on either slice that used to carry it', () => {
    // The ANCHOR slice (the chip's own feed) and the DEFENSE body slice both declared it.
    // `magicDependency` is the sibling that travels the same `dp?.` read on the same object,
    // so it proves the slice is built and correctly keyed rather than merely absent.
    expectAbsentWithAnchor(
      Object.keys(villageVm.identity.anchor), 'magicalCapability', 'magicDependency',
      'the chapter-02 anchor slice',
    );
    expectAbsentWithAnchor(
      Object.keys(defenseSlice(villageSettlement)), 'magicalCapability', 'magicDependency',
      'the PDF defense body slice',
    );
    // …and the threadbare save, which is the shape a resurrected field would first show on.
    expectAbsentWithAnchor(
      Object.keys(sparseVm.identity.anchor), 'magicalCapability', 'magicDependency',
      'the chapter-02 anchor slice on a threadbare save',
    );
  });

  test('the rendered chapter prints no MAGIC chip, for a full settlement or a sparse one', () => {
    // A REAL generated village: the sibling chips are the liveness anchor — the anchor row
    // rendered and chose its labels, so the exclusion is a removal and not an empty page.
    expectAbsentWithAnchor(chipLabels(IdentityDailyLife({
      settlement: villageSettlement, vm: villageVm,
    })), 'MAGIC', 'DEFENSE', 'chapter 02 on a generated village');
    expectAbsentWithAnchor(chipLabels(IdentityDailyLife({
      settlement: metropolisSettlement, vm: metropolisVm,
    })), 'MAGIC', 'DEFENSE', 'chapter 02 on a generated metropolis');
    // ⚠ THE THREADBARE SAVE IS NOT ASSERTED HERE, and the reason is the anchor rather than
    // the claim. Its whole anchor-facts panel is gated on having any anchor fact at all, so
    // it renders NO KeyValRow — the collection is legitimately empty, no sibling label
    // travels this path, and an exclusion over an empty list is the vacuity this helper
    // exists to refuse. The sparse shape is covered on the VIEW MODEL instead, one arm up,
    // where `magicDependency` is a real sibling.
  });

  test('THE WRITER REALLY IS ABSENT — the generated profile has no such key', () => {
    // The claim the deletion rests on, executed rather than reasoned. `scores` is the
    // sibling key that proves the profile was generated and is correctly shaped.
    expectAbsentWithAnchor(
      Object.keys(villageSettlement.defenseProfile), 'magicalCapability', 'scores',
      'generateDefenseProfile output',
    );
    expectAbsentWithAnchor(
      Object.keys(metropolisSettlement.defenseProfile), 'magicalCapability', 'scores',
      'generateDefenseProfile output (metropolis)',
    );
  });
});

/**
 * ── THE PDF'S CAPABILITY ROWS SPEAK IN BAND WORDS, NOT DIGITS (owner fold, 2026-09-18) ──
 *
 * `DefenseSecurity.jsx` printed `Math.round(sc.score)` beside each Supporting Capabilities
 * row while its screen twin printed the band word from the shared ladder — R-5b item #20's
 * law held on one surface and not the other, so one number read as two verdicts depending on
 * where a DM met it. The PDF now prints exactly what the screen prints, through the same two
 * functions.
 *
 * ⚠ THE PIN LIVES HERE RATHER THAN IN statBandsOverDigits.test.jsx, deliberately: that file
 * is being re-cut by the peer capability-row car on the consist, and a pin that can sit
 * clear of a contended file should.
 */
describe('DefenseSecurity — the capability score is a band word on the page', () => {
  function texts(node, out = []) {
    if (node == null || node === false || node === true) return out;
    if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
    if (Array.isArray(node)) { for (const c of node) texts(c, out); return out; }
    if (typeof node?.type === 'function') { texts(node.type({ ...node.props }), out); return out; }
    if (node?.props?.children != null) texts(node.props.children, out);
    return out;
  }

  test('every scored capability row prints its band word, and no bare digit survives', () => {
    for (const [name, settlement, vm] of [
      ['village', villageSettlement, villageVm], ['metropolis', metropolisSettlement, metropolisVm],
    ]) {
      const caps = deriveSupportingCapabilities(settlement).filter((c) => c.score !== null);
      expect(caps.length, `${name}: no scored capability row, so this arm judges nothing`)
        .toBeGreaterThan(0);
      const printed = texts(DefenseSecurity({ settlement, vm })).map((t) => t.trim());
      for (const capRow of caps) {
        const band = statusCase(scoreBand(Math.min(100, Math.max(0, capRow.score))));
        expect(printed, `${name}: ${capRow.label} does not print its band word`).toContain(band);
        // …and the digit it replaced is not on the page as a standalone value. The anchor is
        // the band assertion just above: the row demonstrably rendered.
        expectAbsentWithAnchor(printed, String(Math.round(capRow.score)), band,
          `${name}: ${capRow.label}'s retired digit`);
      }
    }
  });
});


// ── THE INSTITUTION LABEL: SCREEN AND PRINT SAY ONE WORD (ODQ §934.13) ───────────────
/**
 * The parish-church ruling was a DISPLAY SEAM, which means its whole correctness claim is
 * a RELATION between two surfaces rather than a string: the paid document and the screen
 * must print the same label for the same institution, and the persisted settlement under
 * both must be untouched.
 *
 * ⛔ WHY THIS IS NOT A GOLDEN OVER THE WORD. Pinning 'House of worship' here would pass
 * just as happily if the PDF printed it and the screen printed the raw key. The arm that
 * is worth having asserts PRINT === SCREEN, plus the separate fact that neither of them
 * still says the setting-specific word.
 */
describe('institution label — screen↔print parity', () => {
  /** The screen's own read: every roster pill, card heading and service row calls this. */
  const screenLabel = (inst) => institutionDisplayName(inst);

  test('a village carrying the parish church prints one label on both surfaces', () => {
    // A FIXTURE, not a generated draw: the arm must light the institution rather than hope
    // the seed rolls it. The shape is what assembleInstitutions persists.
    const fixture = {
      ...villageSettlement,
      institutions: [
        { id: 'inst-pc', name: 'Parish church', category: 'Religious', source: 'generated', status: 'healthy' },
        { id: 'inst-bs', name: 'Blacksmith', category: 'Crafts', source: 'generated', status: 'healthy' },
      ],
    };

    const printed = servicesSlice(fixture).detailed;
    expect(printed).toHaveLength(2);

    for (const [i, inst] of fixture.institutions.entries()) {
      // THE PARITY CLAIM, stated as the relation and not as a word.
      expect(printed[i].name).toBe(screenLabel(inst));
    }
    expect(printed[0].name).toBe('House of worship');
    // The unmapped institution proves the seam is not rewriting everything it touches.
    expect(printed[1].name).toBe('Blacksmith');

    // ⭐ AND THE MODEL UNDER BOTH IS UNMOVED — the seam reads, it never migrates.
    expect(fixture.institutions[0].name).toBe('Parish church');
  });

  test('neither surface prints the setting-specific word', () => {
    const fixture = {
      ...villageSettlement,
      institutions: [
        { id: 'inst-pc', name: 'Parish church', category: 'Religious', source: 'generated', status: 'healthy' },
      ],
    };
    const printedName = servicesSlice(fixture).detailed[0].name;
    expect(printedName).not.toMatch(/parish|church/i); // anchored: printedName is read off detailed[0] above (an emptied slice throws there) and the exact label is pinned on the next line
    expect(printedName).toBe('House of worship');
    expect(screenLabel(fixture.institutions[0])).toBe(printedName);
  });

  test('the Institutions chapter renders the labelled roster without throwing', () => {
    const fixture = {
      ...villageSettlement,
      institutions: [
        { id: 'inst-pc', name: 'Parish church', category: 'Religious', source: 'generated', status: 'healthy' },
      ],
    };
    const vm = { ...villageVm, services: servicesSlice(fixture) };
    expect(Institutions({ settlement: fixture, narrativeMode: false, vm })).toBeTruthy();
  });

  test('every scale variant and the access service agree across surfaces', () => {
    const family = [
      'Parish church', 'Parish churches (2-5)',
      'Parish churches (10-30)', 'Parish churches (50-100+)',
    ];
    const fixture = {
      ...villageSettlement,
      institutions: family.map((name, i) => ({
        id: `inst-${i}`, name, category: 'Religious', source: 'generated', status: 'healthy',
      })),
    };
    const printed = servicesSlice(fixture).detailed.map((d) => d.name);
    expect(printed).toEqual(family.map((n) => screenLabel({ name: n })));
    expect(printed).toEqual([
      'House of worship', 'Houses of worship (2-5)',
      'Houses of worship (10-30)', 'Houses of worship (50-100+)',
    ]);
  });

  // ── THE CHAIN FLOW, WHICH THE FIRST INSTALL OF THE SEAM MISSED (browser pass 3) ────
  /**
   * The roster went through the seam; the SUPPLY-CHAIN rows did not, at two sites. Both
   * print the very same `processingInstitutions` the screen's Economics tab already routes
   * through `institutionDisplayName`, so the Canon Dossier read "BY local resource Parish
   * church + Monastery" beside a screen that said "House of worship". The arms below walk
   * the two shapes separately because the defects are at different layers: one is a PRINT
   * in the chapter, the other is a JOIN in the slice that reaches the chapter as one string.
   */
  /** Text leaves of a @react-pdf element tree, calling each function component as it goes. */
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

  test("the Services chapter's chain flow prints the labelled institution, never the catalogue key", () => {
    // A BARE services slice, so the only institution in the chapter's text is the one this
    // arm put there — otherwise a stray 'parish' from the village's own roster would decide
    // the result instead of the chain row.
    const vm = {
      ...villageVm,
      services: {
        available: {},
        notableAbsences: [],
        activeChains: [{
          label: 'Cloth finishing',
          resource: 'wool',
          processingInstitutions: ['Parish church', 'Blacksmith'],
          outputs: ['broadcloth'],
          status: 'productive',
        }],
      },
    };
    const text = collectText(Services({ settlement: villageSettlement, narrativeMode: false, vm })).join(' ');
    expect(text, 'the chapter rendered no chain flow at all').toContain('House of worship');
    // anchored: the line above proves the flow rendered, so this absence is about the label.
    expect(text).not.toMatch(/parish/i);
    // The unmapped institution proves the seam is not rewriting every name it touches.
    expect(text, 'the second processing institution must survive the seam').toContain('Blacksmith');
  });

  test('the resources slice joins DISPLAY names, because the chapter can no longer unjoin them', () => {
    const fixture = {
      ...villageSettlement,
      resourceAnalysis: {
        ...(villageSettlement.resourceAnalysis || {}),
        exploitation: {
          fullyExploited: [{
            rawResource: 'wool',
            processingInstitutions: ['Parish church', 'Blacksmith'],
            finalProducts: ['broadcloth'],
          }],
          partiallyExploited: [],
          unexploited: [],
        },
      },
    };
    const rows = resourcesSlice(fixture).chainRows;
    expect(rows, 'the slice built no chain row to judge').toHaveLength(1);
    expect(rows[0].processing).toBe('House of worship, Blacksmith');
    // ⭐ AND THE MODEL UNDER IT IS UNMOVED — the seam reads, it never migrates.
    expect(fixture.resourceAnalysis.exploitation.fullyExploited[0].processingInstitutions[0])
      .toBe('Parish church');
  });
});
