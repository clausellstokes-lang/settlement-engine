/**
 * @vitest-environment jsdom
 *
 * foodMagicChannelPrint.test.js — THE PRINT CREDITS THE CHANNEL THAT FED THE TOWN.
 *
 * ── THE DEFECT (adversarial review of the second wave, MATERIAL) ───────────────
 * ODQ §934.20 carried the magical food offset into print, and put the line INSIDE the
 * DEFICIT column — which is gated on `deficit > 0`. But the writer SUBTRACTS the offset
 * when it computes the deficit (generators/economy/foodBalance.js: `deficit =
 * max(0, rawDeficit − importCoverage − magicFoodOffset)`, and the canonical reconcile
 * takes the deficit straight off `foodSecurity.deficitPct`). So the better the
 * provision, the more certainly the print hid it: a town whose shortfall magic closes
 * ENTIRELY reaches deficit 0 and printed no word of the channel, while the Economics
 * tab credited it in the production row all along and the PDF's own Overview chapter
 * printed it ungated. Three surfaces, two answers.
 *
 * ── THE FIXTURE IS THE WRITER'S, NOT THIS FILE'S ───────────────────────────────
 * A hand-typed `{ deficit: 0, magicOffset: 60 }` would prove the renderer prints what it
 * is given and nothing about whether that state is reachable. So the record comes from
 * `deriveFoodBalanceAnalysis` with a canonical `foodSecurity` whose `deficitPct` is 0,
 * and travels through `foodCore` — the PDF's own view-model primitive — exactly as it
 * does in a real export.
 *
 * react-pdf components in src/pdf are plain hook-free functions, so they are executed
 * directly and walked to their text leaves; no PDF bytes are rendered (those are not
 * deterministic under renderToBuffer, and none of this needs them).
 */
import { describe, it, expect } from 'vitest';

import { deriveFoodBalanceAnalysis } from '../../src/generators/economy/foodBalance.js';
import { foodCore } from '../../src/pdf/lib/viewModelPrimitives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { EconomicsTrade } from '../../src/pdf/sections/EconomicsTrade.jsx';

/** Flatten an element tree to its text leaves (the tests/pdf idiom). */
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
/**
 * ⚠ WHITESPACE IS NORMALISED, AND IT IS LOAD-BEARING HERE. The line under test is one
 * <Text> with THREE leaves — `{fb.magicChannel}`, ` provision covers `, `{smart(...)}` —
 * so a raw join leaves gaps inside the sentence and a `toContain` on the phrase fails
 * against a page that prints it perfectly. Collapsing runs of space lets the assertion
 * read the sentence the reader sees.
 */
const joined = (node) => collectText(node).join(' ').replace(/\s+/g, ' ').trim();

/**
 * The writer's own record for a town whose gap magic closes. `foodSecurity.deficitPct`
 * is the canonical band, and 0 there means the reconcile publishes deficit 0 while still
 * crediting the caster with the residual.
 * @param {{ deficitPct?: number, magicOffset?: number }} [over]
 */
function writtenRecord(over = {}) {
  const analysis = deriveFoodBalanceAnalysis(
    1200,
    { agricultureCapacity: 0.6 },
    [{ name: 'Druid Circle', type: 'druid circle' }],
    { magicExists: true, priorityMagic: 70, priorityReligion: 20, stressTypes: [] },
    {
      dailyProduction: 900, dailyNeed: 1000, rawDeficit: 100,
      deficitPct: 0, importCoverage: 40, magicOffset: 60, ...over,
    },
  );
  return analysis.foodBalance;
}

/** That record as the PDF's own view model sees it. */
const asViewModel = (record) => foodCore({ metrics: { foodBalance: record } });

const SETTLEMENT = generateSettlementPipeline(
  { settType: 'town', culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road', monsterThreat: 'civilized' },
  null,
  { seed: 'food-magic-channel-2026', customContent: {} },
);

/** The real chapter, with only the food record swapped for the fixture. */
function printed(fb) {
  const vm = buildViewModel({ settlement: SETTLEMENT });
  vm.economics = { ...vm.economics, foodBalance: fb };
  return joined(EconomicsTrade({ settlement: SETTLEMENT, vm, narrativeMode: false, stateProse: null }));
}

describe('THE FIXTURE — the state really is reachable, and the view model publishes it', () => {
  it('the writer closes the gap and still credits the caster', () => {
    const record = writtenRecord();
    expect(record.deficit, 'the writer did not close the gap — this fixture proves nothing').toBe(0);
    expect(record.magicFoodOffset, 'no magical provision was credited').toBeGreaterThan(0);
    expect(record.magicFoodNote).toMatch(/druidic/i);
  });

  it('foodCore carries the offset through, with no deficit to hang it on', () => {
    const fb = asViewModel(writtenRecord());
    expect(fb.magicOffset).toBeGreaterThan(0);
    expect(fb.magicChannel).toBe('druidic');
    // The old gate's condition, stated as the fixture's defining property.
    expect(fb.deficit > 0, 'the fixture has a deficit, so the old gate would have passed').toBe(false);
  });
});

describe('THE PRINT — the channel is named whether or not a gap survives it', () => {
  it('a gap CLOSED by magic still prints the channel and the figure', () => {
    const text = printed(asViewModel(writtenRecord()));
    expect(text, 'the section did not render its food block at all').toContain('FOOD SECURITY');
    expect(text, 'the print credits a channel the reader is never told about')
      .toContain('druidic provision covers 60');
  });

  it('CONTROL: a town with a real deficit prints exactly what it printed before', () => {
    // deficitPct 4 leaves a residual the reader can see, so the DEFICIT column renders
    // and the magic line sits under it — the arrangement §934.20 shipped.
    const fb = asViewModel(writtenRecord({ deficitPct: 4 }));
    expect(fb.deficit, 'the control fixture has no deficit').toBeGreaterThan(0);
    const text = printed(fb);
    expect(text).toContain('DEFICIT');
    expect(text).toContain('% of need');
    expect(text).toContain('druidic provision covers');
  });

  it('CONTROL: with no caster credited, nothing is invented', () => {
    const fb = asViewModel(writtenRecord({ magicOffset: 0, deficitPct: 4 }));
    expect(fb.magicOffset, 'the no-magic control still credits a caster').toBeNull();
    const text = printed(fb);
    expect(text).toContain('DEFICIT');
    // anchored: the line above proves this very fixture still prints its DEFICIT column, so the chapter is live and the absence below is a real absence.
    expect(text, 'a channel was named with nothing behind it').not.toContain('provision covers');
  });
});
