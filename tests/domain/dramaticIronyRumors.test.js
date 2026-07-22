/**
 * dramaticIronyRumors.test.js — cycle-3 Wave 2, H14 pin.
 *
 * THE BUG (H14). dramaticIronyBrief's rumor branch read each rumor's `r.belief`
 * and `r.truth` as sibling scalars and compared them. But settlementRumors()
 * returns the belief AS the projection (fields headline/detail/whereId/…) with a
 * nested `truth` OBJECT and NO `belief` key — so the guard `r.belief != null` was
 * ALWAYS false and the ENTIRE rumor-irony branch was dead: the DM never saw a
 * single rumor divergence surfaced.
 *
 * THE FIX + PIN. The branch now reads the real shape (projection headline = the
 * belief; nested truth.divergence = the gap). This pin builds a REAL rumor ledger
 * via the actual rumorNetwork advance (NOT a hand-shaped fixture — the faction-key
 * class hid behind fixtures every time), proves the projection shape has NO
 * `belief` key (why the old read was dead), and proves the irony branch now
 * surfaces the divergence.
 */
import { describe, it, expect } from 'vitest';
import { settlementRumors } from '../../src/domain/display/settlementRumors.js';
import { dramaticIronyBrief } from '../../src/domain/briefs/index.js';
import { advanceRumorLedgers } from '../../src/domain/spatial/rumorNetwork.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { createPRNG } from '../../src/kernel/prng.js';

const IDS = ['a', 'b', 'c', 'd'];

function digestFor() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

const tradeChannel = (id, from, to) => ({ id, type: 'trade_route', from, to, status: 'confirmed' });
const GRAPH = { channels: [tradeChannel('ch.a.b', 'a', 'b'), tradeChannel('ch.b.c', 'b', 'c'), tradeChannel('ch.c.d', 'c', 'd')] };

// A real feed event at 'a'; word degrades as it travels the chain (unreliable mode).
function newsEvent(tick = 5) {
  return {
    id: `wizard_news.${tick}.applied.evt1`, tick, significance: 'major', score: 90, severity: 0.85,
    scope: 'regional', kind: 'applied', impactKind: 'strategy_deploy', settlementIds: ['a'],
    sourceEventId: 'evt1', headline: 'Ashford marshals for war', summary: 'Soldiers gather.',
    tags: ['world_pulse'], reasons: ['a levy called'],
  };
}

/** Drive the REAL rumor advance to a settled ledger. */
function realRumorWorld() {
  const digest = digestFor();
  let ledgers = null;
  for (let tick = 5; tick <= 16; tick += 1) {
    const result = advanceRumorLedgers({
      worldState: {
        simulationRules: { infoMode: 'unreliable' }, spatialCanonVersion: 1, spatialDigest: digest,
        ...(ledgers ? { spatialLedgers: { rumorLedgers: ledgers } } : {}),
      },
      feedEntries: [newsEvent()], graph: GRAPH, tick, rng: createPRNG(`irony::tick:${tick}`),
    });
    if (result.changed) ledgers = result.next;
  }
  return { tick: 16, spatialLedgers: { rumorLedgers: ledgers } };
}

describe('H14 — dramatic-irony rumor branch reads the real projection shape', () => {
  const world = realRumorWorld();

  // Find a settlement whose DM rumor read carries a real divergence.
  function firstDivergent() {
    for (const id of IDS) {
      const rumors = settlementRumors({ worldState: world, settlementId: id, includeGroundTruth: true });
      const hit = rumors.find((r) => r && r.truth && Array.isArray(r.truth.divergence) && r.truth.divergence.length > 0);
      if (hit) return { id, rumor: hit };
    }
    return null;
  }

  it('the real ledger produces a divergent rumor (world sanity)', () => {
    expect(firstDivergent(), 'expected at least one divergent rumor in the real ledger').toBeTruthy();
  });

  it('the real projection shape has NO `belief`/`subject` key (why the old read was dead)', () => {
    const { rumor } = firstDivergent();
    // The OLD code keyed on r.belief != null and r.subject — neither exists.
    expect(Object.prototype.hasOwnProperty.call(rumor, 'belief')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(rumor, 'subject')).toBe(false);
    // The belief IS the projection: it has a rendered headline and a truth OBJECT.
    expect(typeof rumor.headline).toBe('string');
    expect(typeof rumor.truth).toBe('object');
    expect(Array.isArray(rumor.truth.divergence)).toBe(true);
  });

  it('dramaticIronyBrief now SURFACES the rumor divergence (branch is live)', () => {
    const { id } = firstDivergent();
    const brief = dramaticIronyBrief({ settlement: { id }, worldState: world, tick: 16 });
    const ironySection = brief.sections.find((s) => s && s.id === 'irony');
    expect(ironySection, 'the irony section must exist').toBeTruthy();
    const rumorIronies = ironySection.items.filter((it) => it && it.kind === 'rumor');
    expect(rumorIronies.length, 'at least one rumor irony must be surfaced').toBeGreaterThan(0);
    // Each rumor irony carries the belief (headline) and the divergence reasons.
    for (const it of rumorIronies) {
      expect(typeof it.believed).toBe('string');
      expect(Array.isArray(it.divergence) && it.divergence.length > 0).toBe(true);
    }
  });
});
