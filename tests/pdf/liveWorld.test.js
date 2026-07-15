/**
 * @vitest-environment jsdom
 *
 * tests/pdf/liveWorld.test.js — UX Phase 7 PDF live-world plumbing.
 *
 * Pins the four hard invariants of the Phase-7 work:
 *
 *   1. EMPTY-WORLDSTATE BYTE-IDENTITY — a non-campaign / dormant settlement's
 *      buildViewModel output (and rendered chapter set) is IDENTICAL with vs
 *      without an empty worldState. A peaceful, deity-free save renders the same
 *      PDF as today: liveWorld is null in both cases ⇒ no Faith & War chapter.
 *
 *   2. LIVE CHAPTER PRESENT WHEN ACTIVE — a war/deity campaign settlement's
 *      view-model has the liveWorld slice populated and the Faith & War chapter
 *      renders. The deity rank/alignment/temperament come through from the
 *      `*Axis` fields (NOT undefined from reading a legacy tier/alignment).
 *
 *   3. PREMIUM DATA GATE — passing no campaign (the free/anon path) yields no
 *      live-world data, exactly like a dormant campaign.
 *
 *   4. NO SCREEN↔PDF DRIFT — the PDF liveWorld values equal the screen selectors'
 *      values for the same fixture (the PDF reads the same pure selectors).
 *
 * PDF section components are plain hook-free functions returning element trees,
 * so we execute them and collect text leaves (the same trade-off as the existing
 * goldenViewModel / sections.smoke tests — no PDF bytes).
 */
import { describe, it, expect } from 'vitest';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { buildPdfLiveWorld } from '../../src/pdf/lib/liveWorld.js';
import { FaithWar } from '../../src/pdf/sections/FaithWar.jsx';
import {
  settlementWarStatus, settlementWarExhaustion, warExhaustionBand,
  dispositionStandings, liveTradeWars,
} from '../../src/domain/display/warStatus.js';

// Recursively flatten an element tree to its text leaves. Function components
// are executed (plain functions in src/pdf — no hooks); hosts walked via children.
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

// ── Fixtures (mirror tests/components/warFaithSection.test.jsx exactly) ───────
const peacefulTown = {
  id: 'peace',
  name: 'Calmwater',
  population: 800,
  config: {},
  powerStructure: { factions: [{ faction: 'Council', archetype: 'government', power: 50, isGoverning: true }] },
  economicState: {},
};

const warTown = {
  id: 'A',
  name: 'Ashford',
  population: 1200,
  config: {
    primaryDeitySnapshot: { name: 'Maug', rankAxis: 'major', temperamentAxis: 'warlike', alignmentAxis: 'evil', domain: 'war' },
  },
  powerStructure: { factions: [{ faction: 'Warlord', archetype: 'military', power: 60, isGoverning: true }] },
  economicState: {},
};
const warWorldState = {
  deployments: { A: { targetId: 'B', sinceTick: 3, role: 'siege' } },
  warExhaustion: { A: 0.35 },
  dispositionStats: { A: { wins: 3, losses: 1, score: 2 } },
  tradeWarState: { 'B:grain': { winnerId: 'A', incumbentId: 'C', lastFlipTick: 5 } },
  pantheon: { 'deity:Maug': { seats: 4, tier: 'major', wins: 2, losses: 0 } },
};
const warGraph = {
  channels: [
    { type: 'war_front', status: 'confirmed', from: 'C', to: 'A', strength: 0.7, visibility: 'public' },
    { type: 'trade_dependency', from: 'A', to: 'B', goods: [{ id: 'grain', label: 'grain' }] },
  ],
};
const warCampaign = {
  settlementId: 'A',
  worldState: warWorldState,
  regionalGraph: warGraph,
  settlements: [{ id: 'A', name: 'Ashford' }, { id: 'B', name: 'Brightvale' }, { id: 'C', name: 'Caldmoor' }],
  nameFor: (id) => ({ A: 'Ashford', B: 'Brightvale', C: 'Caldmoor' }[id] || String(id)),
};

describe('Phase 7 — empty-worldState byte-identity (the hard invariant)', () => {
  it('liveWorld is null for a non-campaign settlement (no campaign passed)', () => {
    const vm = buildViewModel({ settlement: peacefulTown });
    expect(vm.liveWorld).toBeNull();
  });

  it('an EMPTY worldState produces the IDENTICAL view-model liveWorld (null) as no worldState', () => {
    const noCampaign = buildViewModel({ settlement: peacefulTown });
    const emptyCampaign = buildViewModel({
      settlement: peacefulTown,
      campaign: { settlementId: 'peace', worldState: {}, regionalGraph: { channels: [] }, settlements: [] },
    });
    expect(emptyCampaign.liveWorld).toBeNull();
    // The WHOLE view-model is structurally identical between the two paths —
    // the off-state is byte-identical.
    expect(JSON.stringify(emptyCampaign)).toBe(JSON.stringify(noCampaign));
  });

  it('the Faith & War chapter renders NOTHING (null) when liveWorld is dormant', () => {
    const vm = buildViewModel({ settlement: peacefulTown, campaign: { worldState: {}, regionalGraph: {} } });
    expect(FaithWar({ settlement: peacefulTown, vm })).toBeNull();
  });
});

describe('Phase 7 — live chapter present + the *Axis-not-tier fix', () => {
  it('a war/deity campaign settlement populates the liveWorld slice', () => {
    const vm = buildViewModel({ settlement: warTown, campaign: warCampaign });
    expect(vm.liveWorld).not.toBeNull();
    expect(vm.liveWorld.hasLive).toBe(true);
    expect(vm.liveWorld.atWar).toBe(true);
  });

  it('the deity rank/alignment/temperament come through from the *Axis fields (NOT tier/alignment)', () => {
    const lw = buildPdfLiveWorld({ settlement: warTown, campaign: warCampaign });
    // The known prior bug: reading `tier`/`alignment` would yield undefined.
    expect(lw.deity).not.toBeNull();
    expect(lw.deity.rankAxis).toBe('major');
    expect(lw.deity.alignmentAxis).toBe('evil');
    expect(lw.deity.temperamentAxis).toBe('warlike');
    // describeDeityEffects (read from *Axis) produced the engine couplings.
    expect(lw.deity.effects.length).toBeGreaterThan(0);
    expect(lw.deity.effects.join(' ')).toMatch(/corrupt/i);   // evil → corruption
    expect(lw.deity.effects.join(' ')).toMatch(/aggression/i); // warlike → aggression
    expect(lw.deity.effects.join(' ')).toMatch(/magic legality/i); // major → magic
  });

  it('the rendered Faith & War chapter prints the live front, the deity, and its axes', () => {
    const vm = buildViewModel({ settlement: warTown, campaign: warCampaign });
    const texts = collectText(FaithWar({ settlement: warTown, vm })).join(' ');
    expect(texts).toMatch(/Faith & War/);
    expect(texts).toMatch(/Maug/);
    expect(texts).toMatch(/major/i);    // rankAxis printed
    expect(texts).toMatch(/warlike/i);  // temperamentAxis printed
    expect(texts).toMatch(/grain/i);    // trade-war prize printed
    expect(texts).toMatch(/Brightvale/); // besieged target resolved by nameFor
  });
});

describe('Phase 7 — premium data gate', () => {
  it('a free/anon export (no campaign) yields NO live-world data for a war settlement', () => {
    // Same war-capable settlement, but the caller passes no campaign (the
    // data-layer gate for free/anon). The deity is still embedded, so the slice
    // is non-null (a faith line is legitimate), BUT no LIVE war state appears.
    const vm = buildViewModel({ settlement: warTown });
    expect(vm.liveWorld?.hasLive ?? false).toBe(false);
    expect(vm.liveWorld?.atWar ?? false).toBe(false);
    expect(vm.liveWorld?.standing ?? null).toBeNull();
    expect(vm.liveWorld?.tradeWars ?? []).toEqual([]);
  });

  it('a deity-free settlement with no campaign has a fully null liveWorld (no chapter)', () => {
    const vm = buildViewModel({ settlement: peacefulTown });
    expect(vm.liveWorld).toBeNull();
  });
});

describe('Phase 7 — no screen↔PDF drift (same selectors, same values)', () => {
  it('the PDF liveWorld values equal the screen selectors for the same fixture', () => {
    const lw = buildPdfLiveWorld({ settlement: warTown, campaign: warCampaign });

    const status = settlementWarStatus({ settlementId: 'A', worldState: warWorldState, regionalGraph: warGraph });
    const exhaustionRaw = settlementWarExhaustion({ settlementId: 'A', worldState: warWorldState });
    const standing = dispositionStandings(warWorldState).find(s => s.id === 'A');
    const prizes = liveTradeWars({ worldState: warWorldState, regionalGraph: warGraph })
      .filter(t => t.winnerId === 'A' || t.incumbentId === 'A' || t.buyerId === 'A');

    // atWar / siege targets resolve through nameFor but the underlying selector
    // value is what the screen reads.
    expect(lw.atWar).toBe(!!status.atWar);
    expect(lw.besiegingTargets).toEqual(status.besiegingTargets.map(warCampaign.nameFor));
    expect(lw.besiegedBy).toEqual(status.besiegedBy.map(warCampaign.nameFor));

    // exhaustion band matches the shared band function.
    expect(lw.exhaustion.value).toBe(exhaustionRaw);
    expect(lw.exhaustion.band).toBe(warExhaustionBand(exhaustionRaw));

    // disposition standing is the same selector row.
    expect(lw.standing).toEqual({ wins: standing.wins, losses: standing.losses, score: standing.score });

    // trade-war prize commodity label is the selector's label.
    expect(lw.tradeWars.length).toBe(prizes.length);
    expect(lw.tradeWars[0].commodityLabel).toBe(prizes[0].commodityLabel);
  });
});

// ── Living pantheon in the PDF: per-settlement cults + standings + legitimacy +
//    the patron-contest forecast + the divine mandate (mirrors WarFaithSection). ─
describe('living pantheon in the PDF', () => {
  const theoTown = {
    id: 'T', name: 'Highmoor', population: 9000,
    config: {
      primaryDeitySnapshot: { name: 'Aurelia', rankAxis: 'major', temperamentAxis: 'peaceful', alignmentAxis: 'good' },
      cultDeitySnapshots: [{ name: 'Vorr', rankAxis: 'minor', temperamentAxis: 'warlike', alignmentAxis: 'evil' }],
      faithProfile: { patron: { name: 'Aurelia' }, deities: [], contested: true, patronSecurity: 0.2 },
    },
    powerStructure: { government: 'Theocratic Council', publicLegitimacy: { score: 40, label: 'Wavering' }, factions: [{ faction: 'Temple', archetype: 'religious', power: 60, isGoverning: true }] },
    economicState: {},
  };
  const theoWorldState = {
    religionStates: {
      T: {
        patronRef: 'd.aurelia',
        deities: {
          'd.aurelia': { deityRef: 'd.aurelia', snapshot: { name: 'Aurelia' }, niche: 'peaceful:good', share: 52, standing: 'ascendant', legitimacy: 0.3, suppressed: false },
          'd.vorr': { deityRef: 'd.vorr', snapshot: { name: 'Vorr' }, niche: 'peaceful:evil', share: 48, standing: 'established', legitimacy: 0.6, suppressed: false },
        },
      },
    },
  };
  const theoCampaign = { settlementId: 'T', worldState: theoWorldState, regionalGraph: { channels: [] }, settlements: [{ id: 'T', name: 'Highmoor' }] };

  it('the slice carries livePantheon (patron flagged, share-sorted), cults, and the divine mandate', () => {
    const lw = buildPdfLiveWorld({ settlement: theoTown, campaign: theoCampaign });
    expect(lw.livePantheon.length).toBe(2);
    expect(lw.livePantheon[0].isPatron).toBe(true);            // Aurelia 52% sorts first
    expect(lw.livePantheon[0].legitimacy).toBeCloseTo(0.3, 5);
    expect(lw.cults.map((c) => c.name)).toContain('Vorr');
    expect(lw.mandate).not.toBeNull();                         // theocracy + faithProfile ⇒ a mandate read
    expect(lw.mandate.propping).toBe(false);                   // contested + low security ⇒ weakens the throne
  });

  it('the FaithWar chapter renders the LIVING PANTHEON block', () => {
    const vm = buildViewModel({ settlement: theoTown, campaign: theoCampaign });
    const text = collectText(FaithWar({ settlement: theoTown, vm })).join(' ');
    expect(text).toMatch(/LIVING PANTHEON/);
    expect(text).toMatch(/Aurelia/);
    expect(text).toMatch(/tenuous|established|contested|secure/i);   // a legitimacy band
    expect(text).toMatch(/Divine mandate/);
  });

  it('a deity-free non-campaign settlement still renders no pantheon (byte-identity)', () => {
    const lw = buildPdfLiveWorld({ settlement: peacefulTown });
    expect(lw).toBeNull();
  });
});
