/**
 * @vitest-environment jsdom
 *
 * Smoke tests for src/pdf/sections/* - the PDF chapter components.
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

  // Deliberately threadbare - simulates partial generation / mid-migration
  // saves the user can encounter. PDF chapters should handle gracefully.
  sparseSettlement = { name: 'Sparse', tier: 'thorp', population: 30 };
  sparseVm = buildViewModel({ settlement: sparseSettlement });
});

// Helper: call a PDF chapter as a function; assert it returns a truthy
// element tree without throwing. We don't render to PDF bytes - that's
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
