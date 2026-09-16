/**
 * @vitest-environment jsdom
 *
 * tests/components/powerStrata.test.jsx — the three-strata rework (owner order
 * 2026-07-22: "there are powers, there are factions, and there are the
 * relationships between several ... it needs a rework").
 *
 * Pins the rework's load-bearing invariants:
 *   - CENSUS: THE POWERS = exactly {governing seat} ∪ {coup contenders} the
 *     canonical derivation yields (criminal factions never a power); THE FACTIONS
 *     = every faction; each faction is flagged isPower iff it is a power. No
 *     duplication of an entity across the powers set.
 *   - WEB: relationships group by their finite typed kind, from REAL pipeline
 *     data, deterministically (same seed ⇒ byte-identical render).
 *   - LINK: a power's roster row carries a keyboard-operable "holds power" marker
 *     whose target power card exists in the DOM (the in-tab anchor).
 *   - FLUSH: within a stratum the cards are born flush — one framing border, a
 *     single 1px seam between cards, none on the last.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import {
  derivePowerStrata, groupRelationships, RELATIONSHIP_KIND_ORDER,
} from '../../src/domain/dossier/powerStrata.js';
import { governingFactionOf, nameOf } from '../../src/domain/rulingPower.js';
import { coupContenders } from '../../src/domain/rulingPowerCoup.js';
import { factionArchetype } from '../../src/domain/factionArchetypes.js';
import { factionIdFromName } from '../../src/lib/entities.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

afterEach(cleanup);

// A fully generated settlement — bare generatePowerStructure differs from the
// full pipeline (the recorded probe hazard), so the census must be proven
// against the pipeline output the dossier actually renders.
const city = generateSettlementPipeline(
  { settType: 'city', terrain: 'grassland', tradeRouteAccess: 'road' },
  null,
  { seed: 'power-strata-census', customContent: {} },
);

describe('powerStrata — THE POWERS / THE FACTIONS census (real pipeline)', () => {
  it('THE POWERS is exactly the governing seat plus the coup contenders', () => {
    const { powers } = derivePowerStrata(city);
    const gov = governingFactionOf(city);
    const cc = coupContenders(city);

    const expected = new Set([nameOf(gov), ...cc.challengers.map((c) => c.name)].filter(Boolean));
    expect(new Set(powers.map((p) => p.name))).toEqual(expected);

    // Exactly one ruler (the seat), the rest contenders.
    expect(powers.filter((p) => p.role === 'ruler').length).toBe(gov ? 1 : 0);
    expect(powers.filter((p) => p.role === 'contender').length).toBe(cc.challengers.length);

    // No entity double-lists across the powers set.
    expect(powers.length).toBe(new Set(powers.map((p) => p.name)).size);
  });

  it('THE FACTIONS is every faction, each flagged isPower iff it is a power', () => {
    const { powers, roster } = derivePowerStrata(city);
    const rawNames = city.powerStructure.factions.map((f) => nameOf(f));
    expect(roster.map((r) => r.name)).toEqual(rawNames);

    const powerNames = new Set(powers.map((p) => p.name));
    for (const r of roster) {
      expect(r.isPower).toBe(powerNames.has(r.name));
    }
  });

  it('no power is a criminal faction (criminals contest via capture, not coup)', () => {
    const { powers, roster } = derivePowerStrata(city);
    // The invariant: a criminal archetype never appears in THE POWERS — the
    // domain routes crime through the capture ladder, not the coup field.
    for (const p of powers) expect(p.archetype).not.toBe('criminal');
    // Any criminal faction the generator seeded is roster-only.
    const criminals = roster.filter((r) => factionArchetype(r.faction) === 'criminal');
    for (const c of criminals) expect(c.isPower).toBe(false);
  });
});

describe('powerStrata — THE WEB grouping from real relationships', () => {
  it('groups by the finite typed kind, in the fixed presentation order', () => {
    const groups = groupRelationships(city.powerStructure.factionRelationships);
    expect(groups.length).toBeGreaterThan(0);

    // Every group's kind is a real relationship kind, and every edge carries a
    // two-name pair (both link targets present).
    for (const g of groups) {
      expect(typeof g.kind).toBe('string');
      for (const e of g.edges) {
        expect(e.pair).toHaveLength(2);
        expect(e.type).toBe(g.kind);
      }
    }

    // Known kinds appear in RELATIONSHIP_KIND_ORDER order.
    const known = groups.map((g) => g.kind).filter((k) => RELATIONSHIP_KIND_ORDER.includes(k));
    const ordered = [...known].sort(
      (a, b) => RELATIONSHIP_KIND_ORDER.indexOf(a) - RELATIONSHIP_KIND_ORDER.indexOf(b),
    );
    expect(known).toEqual(ordered);
  });

  it('renders THE WEB deterministically from the same seed (byte-identical x2)', () => {
    const a = generateSettlementPipeline(
      { settType: 'city', terrain: 'grassland', tradeRouteAccess: 'road' },
      null,
      { seed: 'power-strata-web-det', customContent: {} },
    );
    const b = generateSettlementPipeline(
      { settType: 'city', terrain: 'grassland', tradeRouteAccess: 'road' },
      null,
      { seed: 'power-strata-web-det', customContent: {} },
    );

    const r1 = render(<PowerTab powerStructure={a.powerStructure} settlement={a} narrativeNote={null} />);
    const t1 = r1.container.textContent;
    cleanup();
    const r2 = render(<PowerTab powerStructure={b.powerStructure} settlement={b} narrativeNote={null} />);
    const t2 = r2.container.textContent;

    expect(t1).toBe(t2);
    // The Web actually rendered with at least one typed kind label.
    expect(t1).toMatch(/The Web/);
  });
});

// A crafted settlement: a governing seat, one non-criminal contender, one
// criminal (roster-only), and two typed relationships.
function craftedSettlement() {
  return {
    id: 'settlement.keyburg',
    name: 'Keyburg',
    powerStructure: {
      factions: [
        { faction: 'Town Council', power: 30, isGoverning: true, powerLabel: 'Strong', category: 'government', desc: 'The elected council.' },
        { faction: 'Merchant Guilds', power: 20, powerLabel: 'Significant', category: 'economy', desc: 'The traders.' },
        { faction: 'Thieves Guild', power: 8, category: 'criminal', desc: 'The underworld.' },
      ],
      factionRelationships: [
        { pair: ['Town Council', 'Merchant Guilds'], type: 'dependent', direction: 'stable', narrative: 'They need each other.' },
        { pair: ['Town Council', 'Thieves Guild'], type: 'competitive', direction: 'escalating', narrative: 'Open conflict.' },
      ],
    },
    institutions: [],
  };
}

describe('powerStrata — the holds-power marker links to the power card (in-tab anchor)', () => {
  it('a power roster row exposes a keyboard-operable marker whose card exists', () => {
    const s = craftedSettlement();
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);

    // Merchant Guilds is a contender → its roster row carries a holds-power marker.
    const marker = screen.getByRole('button', { name: /Merchant Guilds holds power/i });
    expect(marker.tagName).toBe('BUTTON');
    // Its target power card exists in the DOM (the anchor the marker scrolls to).
    const anchorId = `power-card-${factionIdFromName('Merchant Guilds')}`;
    expect(document.getElementById(anchorId)).toBeTruthy();
    // Keyboard-operable: activating it must not throw (scrollIntoView is a no-op in jsdom).
    expect(() => fireEvent.keyDown(marker, { key: 'Enter' })).not.toThrow();

    // The criminal faction is roster-only → NO holds-power marker.
    expect(screen.queryByRole('button', { name: /Thieves Guild holds power/i })).toBeNull();
  });
});

describe('powerStrata — flush stratum (born flush: 1px seams, one frame)', () => {
  it('THE POWERS cards sit in one bordered container with a single 1px seam between them', () => {
    const s = craftedSettlement();
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);

    const rulerCard = document.getElementById(`power-card-${factionIdFromName('Town Council')}`);
    const contenderCard = document.getElementById(`power-card-${factionIdFromName('Merchant Guilds')}`);
    expect(rulerCard).toBeTruthy();
    expect(contenderCard).toBeTruthy();

    // Both cards are siblings in ONE flush container.
    expect(rulerCard.parentElement).toBe(contenderCard.parentElement);
    const frame = rulerCard.parentElement;
    expect(frame.style.border).toMatch(/1px solid/);
    expect(frame.style.borderRadius === '' || frame.style.borderRadius === '0px').toBe(true);

    // 1px seam between cards; none on the last (the frame closes it).
    expect(rulerCard.style.borderBottomStyle).toBe('solid');
    expect(rulerCard.style.borderBottomWidth).toBe('1px');
    expect(contenderCard.style.borderBottomStyle).toBe('none');
  });
});
