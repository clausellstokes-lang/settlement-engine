/**
 * @vitest-environment jsdom
 *
 * uiCohortDisplayReaderRepairs.test.jsx — THE READER/WRITER DEPTH PINS for the
 * four display defects repaired out of the UNREVIEWED-UI cohort triage.
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * Every one of these was a DISPLAY READER asking a record for a key at a depth
 * (or under a spelling) NO WRITER EVER PRODUCES. None could throw; each degraded
 * to a falsy default and took a rendered affordance down with it, silently, on
 * every world, forever:
 *
 *   1. ProvenanceBlock  `save.campaignId`            → the Campaign row was an
 *      em-dash for EVERY settlement, campaign members included. Membership runs
 *      the other way (`campaign.settlementIds`); no `campaign_id` column was
 *      ever created (migration 104).
 *   2. PlacementsLayer  `settlement.tradeRouteAccess` → one level too shallow
 *      (the writer is `config.tradeRouteAccess`), so PortBadge never appeared.
 *   3. PlacementDetailCard `s.culture` / `s.terrain`  → no writer at either
 *      spelling; the whole Culture/Terrain block was gated on two permanently
 *      empty strings and never MOUNTED.
 *   4. heraldFeed `decreed` / `source==='dm'` / `visibility==='covert'` → zero
 *      writers between them; the 'decreed' provenance was unreachable.
 *
 * ── ⚠⚠ WHAT MAKES THESE PINS RATHER THAN DECORATION ──────────────────────────
 * A pin that only asserts the NEW depth works would stay green if someone
 * re-added the old dead leg as an extra OR-arm — which is exactly how this class
 * regenerates. So every positive here is paired with a NEGATIVE CONTROL that
 * feeds the dead spelling and asserts the affordance stays DARK. The pair is the
 * pin: the positive catches the read being deleted, the negative catches it
 * being widened back to the never-written key.
 *
 * ── ⚠⚠ AND WHY EVERY DENIAL CARRIES A LIVENESS ANCHOR ────────────────────────
 * A denial against a RENDERED SURFACE has a second way to pass that has nothing
 * to do with the defect: the surface may not have rendered at all. An unmounted
 * card, a card whose selection lookup missed, a block gated off — each yields an
 * empty string that satisfies every absence question ever asked of it. That is
 * the drift-neutered class (tests/lint/negativeAssertionAnchor.walker.test.js),
 * and it is especially sharp HERE, because these pins exist to prove a dead read
 * stays dead: a dead read and a dead RENDERER are indistinguishable from the
 * outside. So each denial runs through tests/helpers/anchoredNegatives.js with a
 * live positive control that travels the SAME path as the thing being denied —
 * a member render for the campaign row, a live sibling ROW inside the very block
 * whose other row must stay dark. Break the renderer and the anchor reds first.
 *
 * SCOPE NOTE (pin 1): the membership scan itself — String-normalized, active-
 * campaign-only — is already pinned in tests/store/campaignMembershipIdNormalization.js.
 * What is pinned HERE is the WIRING: that the card resolves its campaign through
 * that selector and NOT through a field on the save. The save fixtures below
 * therefore carry no `campaignId`, exactly as a real save row carries none.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

const { useStore, ctx } = vi.hoisted(() => {
  const state = {
    // ProvenanceBlock reads
    lastSeed: 'seed-1',
    generatedAt: null,
    editedAt: null,
    canonizedAt: null,
    lastExportAt: null,
    campaigns: [],
    getCampaignForSettlement: () => null,
    // Placement-surface reads
    mapState: { placements: {}, viewport: { scale: 1 } },
    savedSettlements: [],
    selectedBurgId: null,
    selectedSettlementId: null,
    activeCampaignId: null,
    setSelectedBurgId: () => {},
    setSelectedSettlementId: () => {},
    updatePlacement: () => {},
    setHoveredSettlementId: () => {},
    clearHoveredSettlementId: () => {},
    clearSelectedSettlementId: () => {},
    clearSelectedBurgId: () => {},
    removePlacementLocal: () => {},
  };
  const store = (selector) => selector(state);
  store.getState = () => state;
  store.subscribe = () => () => {};
  return { useStore: store, ctx: { state } };
});

vi.mock('../../src/store/index.js', () => ({ useStore }));

import ProvenanceBlock from '../../src/components/settlement/ProvenanceBlock.jsx';
import PlacementsLayer from '../../src/components/map/PlacementsLayer.jsx';
import PlacementDetailCard from '../../src/components/map/PlacementDetailCard.jsx';
import { toHeraldItem } from '../../src/components/map/heraldFeed.js';

const transformRef = { current: { tx: 0, ty: 0, scale: 1 } };

/** PlacementsLayer returns a bare <g>, so it must mount inside an <svg>. */
function renderLayer() {
  return render(<svg><PlacementsLayer transformRef={transformRef} /></svg>);
}

/** PortBadge's anchor glyph — the one path unique to it in TierIcon.jsx. */
const PORT_BADGE = 'path[d^="M 0 -1.8 L 0 1.8"]';

/**
 * The membership scan, spelled as campaignSlice spells it. Used ONLY to make the
 * mocked selector behave like the real one; the selector's own semantics are
 * pinned in tests/store/campaignMembershipIdNormalization.test.js.
 */
function campaignForSettlement(campaigns, settlementId) {
  if (settlementId == null) return null;
  const sid = String(settlementId);
  return (campaigns || []).find(
    (c) => (c.settlementIds || []).map(String).includes(sid),
  ) || null;
}

afterEach(() => {
  cleanup();
  ctx.state.campaigns = [];
  ctx.state.getCampaignForSettlement = () => null;
  ctx.state.mapState = { placements: {}, viewport: { scale: 1 } };
  ctx.state.savedSettlements = [];
  ctx.state.selectedSettlementId = null;
});

// ── 1 · PROVENANCE: the Campaign row ────────────────────────────────────────
describe('ProvenanceBlock — the Campaign row resolves through membership, not a save field', () => {
  beforeEach(() => {
    ctx.state.campaigns = [{ id: 'c1', name: 'The Iron Marches', settlementIds: ['s1'] }];
    ctx.state.getCampaignForSettlement = (id) => campaignForSettlement(ctx.state.campaigns, id);
  });

  test('a member save — carrying NO campaignId, as every real save row does — shows its campaign name', () => {
    const { container } = render(<ProvenanceBlock save={{ id: 's1' }} />);
    expect(container.textContent).toContain('The Iron Marches');
  });

  test('NEGATIVE CONTROL: a save.campaignId pointing at a campaign it is not a MEMBER of shows nothing', () => {
    // The old reader trusted this field and would print the name. Membership is
    // the only truth: 's9' is in no campaign's settlementIds, so the row is empty.
    //
    // ANCHOR: the control render is a genuine MEMBER driven through this same
    // component and this same selector, so it prints the name. Without it, a
    // ProvenanceBlock that rendered no Campaign row at all — or a mocked selector
    // that stopped resolving — would satisfy the denial while the defect this pin
    // guards (trusting save.campaignId again) sat wide open.
    const memberRender = render(<ProvenanceBlock save={{ id: 's1' }} />).container.textContent;
    const campaignIdOnly = render(<ProvenanceBlock save={{ id: 's9', campaignId: 'c1' }} />).container.textContent;
    expectPresentThenAbsent(
      memberRender, campaignIdOnly, 'The Iron Marches',
      'campaign row: member render, then a non-member carrying the dead campaignId field',
    );
  });

  test('a non-member save leaves the row empty rather than naming a campaign', () => {
    // ANCHOR as above, and for the same reason: the member render proves the name
    // is reachable through this component at all, so the empty row for 's2'
    // measures NON-MEMBERSHIP rather than a Campaign row that no longer renders.
    const memberRender = render(<ProvenanceBlock save={{ id: 's1' }} />).container.textContent;
    const nonMemberRender = render(<ProvenanceBlock save={{ id: 's2' }} />).container.textContent;
    expectPresentThenAbsent(
      memberRender, nonMemberRender, 'The Iron Marches',
      'campaign row: member render, then a save belonging to no campaign',
    );
  });
});

// ── 2 · PLACEMENTS: the port anchor badge ───────────────────────────────────
describe('PlacementsLayer — PortBadge reads tradeRouteAccess at CONFIG depth', () => {
  beforeEach(() => {
    ctx.state.mapState = {
      placements: { b1: { settlementId: 's1', x: 10, y: 10, name: 'Saltmere' } },
      viewport: { scale: 1 },
    };
  });

  test('a save whose config says port renders the anchor badge', () => {
    ctx.state.savedSettlements = [
      { id: 's1', name: 'Saltmere', tier: 'town', population: 900, config: { tradeRouteAccess: 'port' } },
    ];
    expect(renderLayer().container.querySelector(PORT_BADGE)).toBeTruthy();
  });

  test('the RESOLVED route drives the badge — the random_trade sentinel cannot reach it', () => {
    // resolveConfig.js rolls the sentinel away into effectiveConfig and records
    // the intent separately as `_routeIntent`, so a save whose route was rolled
    // to port reads as port here.
    ctx.state.savedSettlements = [
      { id: 's1', name: 'Saltmere', tier: 'town', config: { tradeRouteAccess: 'port', _routeIntent: 'random' } },
    ];
    expect(renderLayer().container.querySelector(PORT_BADGE)).toBeTruthy();
  });

  test('an unresolved random_trade sentinel does NOT light the badge', () => {
    ctx.state.savedSettlements = [
      { id: 's1', name: 'Saltmere', tier: 'town', config: { tradeRouteAccess: 'random_trade' } },
    ];
    expect(renderLayer().container.querySelector(PORT_BADGE)).toBeFalsy();
  });

  test('NEGATIVE CONTROL: the never-written TOP-LEVEL spellings must NOT light the badge', () => {
    // If this reds, the shallow read was re-added as an OR-arm and the defect is
    // back: no writer has ever produced either of these keys on a save row.
    ctx.state.savedSettlements = [
      { id: 's1', name: 'Saltmere', tier: 'town', tradeRouteAccess: 'port', port: true },
    ];
    expect(renderLayer().container.querySelector(PORT_BADGE)).toBeFalsy();
  });

  test('a road settlement stays badge-free', () => {
    ctx.state.savedSettlements = [
      { id: 's1', name: 'Saltmere', tier: 'town', config: { tradeRouteAccess: 'road' } },
    ];
    expect(renderLayer().container.querySelector(PORT_BADGE)).toBeFalsy();
  });
});

// ── 3 · PLACEMENT DETAIL: the Culture / Terrain block ───────────────────────
describe('PlacementDetailCard — the Culture/Terrain block MOUNTS off the resolved config', () => {
  beforeEach(() => {
    ctx.state.selectedSettlementId = 's1';
    ctx.state.mapState = {
      placements: { b1: { settlementId: 's1', x: 10, y: 10 } },
      viewport: { scale: 1 },
    };
  });

  test('a settlement with config.culture + config.terrainType shows both rows', () => {
    ctx.state.savedSettlements = [{
      id: 's1',
      name: 'Aldermoor',
      settlement: { name: 'Aldermoor', tier: 'town', population: 900, config: { culture: 'germanic', terrainType: 'riverside' } },
    }];
    const { container } = render(<PlacementDetailCard />);
    expect(container.textContent).toContain('Culture:');
    expect(container.textContent).toContain('germanic');
    expect(container.textContent).toContain('Terrain:');
    expect(container.textContent).toContain('riverside');
  });

  test('terrain resolves through the config CHAIN, not a bare key (terrainOverride leg)', () => {
    ctx.state.savedSettlements = [{
      id: 's1',
      name: 'Aldermoor',
      settlement: { name: 'Aldermoor', tier: 'town', config: { terrainOverride: 'coastal' } },
    }];
    expect(render(<PlacementDetailCard />).container.textContent).toContain('coastal');
  });

  test("NEGATIVE CONTROL: the 'auto' UI sentinel is never displayed as a terrain", () => {
    // THE DISCRIMINATOR between routing through resolveSettlementTerrain and
    // reading a bare `s.terrain`: the resolver guards every leg with
    // terrainOrNull, so the sentinel resolves to null. The old raw read would
    // have printed the word "auto" to the user.
    //
    // ANCHOR: the fixture also carries config.culture, so the block still MOUNTS
    // (it is gated on `culture || terrain`) and its Culture row renders off the
    // same resolved-config read the terrain leg uses. The dark Terrain row is
    // therefore the sentinel being REFUSED — not the card failing to select, not
    // the block gating itself off, which is exactly how a denial against this
    // surface goes vacuous. Both sentinel legs are fed at once: the top-level
    // `terrain` an imported dossier can carry, and config.terrainOverride, the
    // one leg the engine itself writes verbatim.
    ctx.state.savedSettlements = [{
      id: 's1',
      name: 'Aldermoor',
      settlement: {
        name: 'Aldermoor', tier: 'town', terrain: 'auto',
        config: { culture: 'germanic', terrainOverride: 'auto' },
      },
    }];
    expectAbsentWithAnchor(
      render(<PlacementDetailCard />).container.textContent,
      'Terrain:', 'Culture:', "the 'auto' sentinel resolves to null inside a MOUNTED block",
    );
  });

  test('NEGATIVE CONTROL: the never-written CULTURE spellings must NOT light the Culture row', () => {
    // `culture` and `cultureName` have no writer at settlement ROOT — the engine
    // persists the resolved culture at config.culture (resolveConfig.js). A red
    // here means a dead leg was re-added and the row is mounting on a key the
    // engine cannot produce.
    //
    // ANCHOR: the fixture carries config.terrainType — the engine-written terrain
    // spelling — so the block MOUNTS and its Terrain row renders. The denial is
    // therefore about the CULTURE row specifically staying dark INSIDE a live
    // block, which is a strictly sharper claim than the one this test made when
    // an unmounted block (or an unrendered card) would have satisfied it too.
    //
    // ⚠ TERRAIN IS DELIBERATELY NOT ASSERTED DARK HERE. A top-level `terrain` is
    // a leg resolveSettlementTerrain OWNS on purpose (its docstring: "the legacy
    // top-level `terrain` some imported dossiers carry"). Routing through the
    // canonical resolver means inheriting that tolerance, which is the correct
    // outcome — an imported dossier SHOULD show its terrain. The engine-written
    // path is pinned positively above; the sentinel guard is pinned above that.
    ctx.state.savedSettlements = [{
      id: 's1',
      name: 'Aldermoor',
      settlement: {
        name: 'Aldermoor', tier: 'town', culture: 'nordic', cultureName: 'Nordic',
        config: { terrainType: 'riverside' },
      },
    }];
    expectAbsentWithAnchor(
      render(<PlacementDetailCard />).container.textContent,
      'Culture:', 'Terrain:', 'root-level culture spellings have no writer',
    );
  });
});

// ── 4 · HERALD: the deleted 'decreed' provenance ────────────────────────────
describe("heraldFeed — 'decreed' is gone and its live siblings are intact", () => {
  const rec = (extra) => ({ id: 'r1', tick: 1, headline: 'A thing happened', ...extra });

  test('NEGATIVE CONTROL: every disjunct of the deleted arm files as plain canon', () => {
    // No writer produces any of these three. If a red appears here, the dead arm
    // was restored without a writer to justify it.
    expect(toHeraldItem(rec({ decreed: true })).provenance).toBe('canon');
    expect(toHeraldItem(rec({ outcome: { decreed: true } })).provenance).toBe('canon');
    expect(toHeraldItem(rec({ outcome: { source: 'dm' } })).provenance).toBe('canon');
    expect(toHeraldItem(rec({ outcome: { visibility: 'covert' } })).provenance).toBe('canon');
  });

  test('the LIVE covert writers still file as covert', () => {
    // pulseHelpers / warRulingsNews / npcVerdictPulse / corruptionLeash all mint
    // `covert: true`. Deleting the dead visibility disjunct must not touch these.
    expect(toHeraldItem(rec({ covert: true })).provenance).toBe('covert');
    expect(toHeraldItem(rec({ outcome: { covert: true } })).provenance).toBe('covert');
  });

  test('the LIVE amendable writers still file as amendable', () => {
    expect(toHeraldItem(rec({ status: 'pending' })).provenance).toBe('amendable');
    expect(toHeraldItem(rec({ outcome: { applyMode: 'proposal' } })).provenance).toBe('amendable');
  });

  test('an ordinary record is canon', () => {
    expect(toHeraldItem(rec({})).provenance).toBe('canon');
  });
});
