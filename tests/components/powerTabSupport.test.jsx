/**
 * @vitest-environment jsdom
 *
 * tests/components/powerTabSupport.test.jsx
 *
 * ORDER A (owner 2026-07-22): clicking a power in the Power tab reveals the
 * institutions that stand behind it.
 *
 * THREE-STRATA REWORK (owner order 2026-07-22, "there are powers, there are
 * factions, and there are the relationships between several ... it needs a
 * rework"): the institution-support disclosure now lives on THE POWERS card (the
 * dominant stratum), not on the flat faction row — a faction's roster row carries
 * a compact "holds power" marker instead, so the web is never duplicated. These
 * pins were updated to target the power card accordingly. The two fixture
 * factions carry no `isGoverning`, so both are coup contenders → both are powers.
 * The disclosure is still keyboard-operable end to end:
 *   - the support list is hidden until the POWER CARD is expanded;
 *   - the card is a keyboard-operable disclosure (Enter / Space toggles it, and
 *     aria-expanded tracks state);
 *   - once open, each supporting institution renders with its typed basis line;
 *   - the institution name is itself an interactive link (per ORDER B: institutions
 *     link to their in-context profile, which surfaces the compendium identity).
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, within } from '@testing-library/react';
import PowerTab from '../../src/components/new/tabs/PowerTab.jsx';
import { SUPPORT_BASIS } from '../../src/domain/dossier/powerSupport.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { rulingChainOf } from '../../src/domain/dossier/powerStrata.js';
import { coupContenders, coupRiskLabel } from '../../src/domain/rulingPowerCoup.js';
import { structuralLensOf } from '../../src/domain/spatial/cohesionWeave.js';
import { settlementBlocs as politicsBlocsOf } from '../../src/domain/display/politicsRead.js';
import { powerStateProse } from '../../src/domain/display/stateProse/powerStateProse.js';
import { tierNounFor } from '../../src/domain/display/stateProse/weaveBlock.js';

afterEach(cleanup);

// A minimal settlement whose institutions map to two different powers:
//  - Grand Market (economy)  -> aligned under Merchant Guild (top economy faction)
//  - City Barracks (military, factionSource) -> founded under the Watch
// Neither faction is the governing seat, so both present as coup contenders in
// THE POWERS stratum (each gets a power card).
function makeSettlement() {
  return {
    id: 'settlement.testburg',
    name: 'Testburg',
    powerStructure: {
      factions: [
        { faction: 'Merchant Guild', power: 60, category: 'economy', desc: 'The traders who hold the market.' },
        { faction: 'The Watch', power: 40, category: 'military', desc: 'The guards who hold the walls.' },
      ],
    },
    institutions: [
      { name: 'Grand Market', priorityCategory: 'economy' },
      { name: 'City Barracks', priorityCategory: 'military', factionSource: 'The Watch' },
    ],
  };
}

const render_ = () => {
  const s = makeSettlement();
  return render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
};

describe('PowerTab — the institution-support web (on THE POWERS card)', () => {
  it('hides the support list until the power card is expanded', () => {
    render_();
    // The support heading is not present while every power card is collapsed.
    expect(screen.queryByText(/Institutions behind this power/i)).toBeNull();
    expect(screen.queryByText('Grand Market')).toBeNull();
  });

  it('expands on Enter and reveals the supporting institutions with their basis', () => {
    render_();
    const card = screen.getByRole('button', { name: 'Merchant Guild power details' });
    expect(card.getAttribute('aria-expanded')).toBe('false');

    fireEvent.keyDown(card, { key: 'Enter' });

    expect(card.getAttribute('aria-expanded')).toBe('true');
    const detail = document.getElementById(card.getAttribute('aria-controls'));
    expect(detail).toBeTruthy();
    // The aligned institution + its typed basis phrase are shown.
    expect(within(detail).getByText('Grand Market')).toBeTruthy();
    expect(within(detail).getByText(SUPPORT_BASIS.aligned.merchant)).toBeTruthy();
    // Its name is an interactive link (opens the institution's in-context profile,
    // which surfaces the compendium-authored identity). The accessible name is the
    // institution name; the "View ... profile" hint rides the button title.
    const instLink = within(detail).getByRole('button', { name: 'Grand Market' });
    expect(instLink.getAttribute('title')).toMatch(/Grand Market profile/i);
  });

  it('toggles closed on a second Space press', () => {
    render_();
    const card = screen.getByRole('button', { name: 'Merchant Guild power details' });
    fireEvent.keyDown(card, { key: ' ' });
    expect(card.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(card, { key: ' ' });
    expect(card.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByText('Grand Market')).toBeNull();
  });

  it('lists a founded institution under the faction that raised it', () => {
    render_();
    const card = screen.getByRole('button', { name: 'The Watch power details' });
    fireEvent.click(card);
    const detail = document.getElementById(card.getAttribute('aria-controls'));
    expect(within(detail).getByText('City Barracks')).toBeTruthy();
    expect(within(detail).getByText(SUPPORT_BASIS.founded)).toBeTruthy();
  });
});

// ── THE BASIS IS A CAPTION, NOT A ROW (2026-09-18) ──────────────────────────
// `why` is keyed by the BACKING FACTION'S archetype, so every aligned institution
// under one power carries the same sentence. Printed per row it read as a stutter:
// a merchant power with three houses behind it said "A commercial house of this
// power" three times down the card. The phrase now captions the group.
describe('PowerTab — the support basis is said once per group', () => {
  const manyAligned = () => ({
    id: 'settlement.stutterburg',
    name: 'Stutterburg',
    powerStructure: {
      factions: [
        { faction: 'Merchant Guild', power: 70, category: 'economy', desc: 'The traders who hold the market.' },
      ],
    },
    institutions: [
      { name: 'Grand Market', priorityCategory: 'economy' },
      { name: 'Coin Hall', priorityCategory: 'economy' },
      { name: 'Wool Exchange', priorityCategory: 'economy' },
    ],
  });

  it('says the aligned phrase ONCE for a bucket holding several aligned institutions', () => {
    const s = manyAligned();
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const card = screen.getByRole('button', { name: 'Merchant Guild power details' });
    fireEvent.click(card);
    const detail = document.getElementById(card.getAttribute('aria-controls'));

    // All three houses are listed…
    expect(within(detail).getByText('Grand Market')).toBeTruthy();
    expect(within(detail).getByText('Coin Hall')).toBeTruthy();
    expect(within(detail).getByText('Wool Exchange')).toBeTruthy();
    // …under exactly one copy of the basis phrase.
    expect(within(detail).getAllByText(SUPPORT_BASIS.aligned.merchant)).toHaveLength(1);
  });

  it('a bucket carrying both bases captions each group separately', () => {
    // The Watch raised the Barracks (founded) and backs the Armoury (aligned).
    const s = {
      id: 'settlement.bothburg',
      name: 'Bothburg',
      powerStructure: {
        factions: [{ faction: 'The Watch', power: 60, category: 'military', desc: 'The guards who hold the walls.' }],
      },
      institutions: [
        { name: 'City Barracks', priorityCategory: 'military', factionSource: 'The Watch' },
        { name: 'The Armoury', priorityCategory: 'military' },
      ],
    };
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const card = screen.getByRole('button', { name: 'The Watch power details' });
    fireEvent.click(card);
    const detail = document.getElementById(card.getAttribute('aria-controls'));

    expect(within(detail).getAllByText(SUPPORT_BASIS.founded)).toHaveLength(1);
    expect(within(detail).getAllByText(SUPPORT_BASIS.aligned.military)).toHaveLength(1);
    expect(within(detail).getByText('City Barracks')).toBeTruthy();
    expect(within(detail).getByText('The Armoury')).toBeTruthy();
  });
});

// ── §815 — THE RULING CHAIN: power → faction → named NPC, honest absence ─────
describe('PowerTab — the §815 ruling chain ("Who runs this place?")', () => {
  const base = () => ({
    id: 'settlement.chainburg',
    name: 'Chainburg',
    powerStructure: {
      government: 'Town Council',
      factions: [
        { faction: 'Merchant Guild', power: 55, powerLabel: 'Dominant', category: 'economy', isGoverning: true },
        { faction: 'The Watch', power: 30, category: 'military' },
      ],
    },
    npcs: [],
  });

  it('renders all three links when a ruler-titled NPC sits in the governing faction', () => {
    const s = base();
    s.npcs = [
      { id: 'n1', name: 'Aldric Vane', role: 'Guildmaster Mayor', factionAffiliation: 'Merchant Guild' },
      { id: 'n2', name: 'Plain Member', role: 'Clerk', factionAffiliation: 'Merchant Guild' },
    ];
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const chain = screen.getByTestId('ruling-chain');
    expect(chain.textContent).toContain('Who runs this place?');
    expect(chain.textContent).toContain('Merchant Guild');
    expect(chain.textContent).toContain('Town Council');
    expect(screen.getByTestId('ruling-chain-npc').textContent).toBe('Aldric Vane');
    expect(screen.queryByTestId('ruling-chain-absence')).toBeNull();
  });

  it('NEVER shows a merely-senior member as the seat — the chain ends honestly at the faction', () => {
    const s = base();
    s.npcs = [{ id: 'n2', name: 'Plain Member', role: 'Senior Clerk', factionAffiliation: 'Merchant Guild', importance: 9 }];
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    expect(screen.queryByTestId('ruling-chain-npc')).toBeNull();
    const absence = screen.getByTestId('ruling-chain-absence');
    expect(absence.textContent).toMatch(/No named seat-holder stands in the record/);
    expect(screen.getByTestId('ruling-chain').textContent).not.toContain('Plain Member'); // anchored: the chain block and its absence line were proven present above, so the surface lives; the absent name is the never-merely-senior claim.
  });

  it('a live missing-seat stressor reads AS the stressor story — the seat stands empty; claimants circle', () => {
    const s = base();
    s.powerStructure.factions[0].modifiers = ['vacant'];
    s.powerStructure.factions.push(
      { faction: 'Claimant Bloc A', power: 18, desc: 'Legal claim.' },
      { faction: 'Claimant Bloc B', power: 15, desc: 'Popular claim.' },
    );
    // Even a ruler-titled NPC does not fill a VACANT seat — the stressor owns it.
    s.npcs = [{ id: 'n1', name: 'Old Mayor', role: 'Mayor (deposed)', factionAffiliation: 'Merchant Guild' }];
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const absence = screen.getByTestId('ruling-chain-absence');
    expect(absence.textContent).toMatch(/The seat stands empty; 2 claimants circle: Claimant Bloc A, Claimant Bloc B\./);
    expect(screen.getByTestId('ruling-chain').textContent).toMatch(/the seat itself stands vacant/);
    expect(screen.queryByTestId('ruling-chain-npc')).toBeNull();
  });

  it('a ladder-lit world resolves the seat from the governing faction top rung (warSeatBooks convention)', () => {
    const s = base();
    s.npcLadder = {
      factions: {
        // The mirror key is ladderFactionKeyOf's own spelling: `fac.` + slug.
        'fac.merchant_guild': { rungs: [{ npcId: 'x1', name: 'Serena Copperlane', standing: 0.9 }, { npcId: 'x2', name: 'Under Clerk', standing: 0.4 }] },
      },
    };
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    expect(screen.getByTestId('ruling-chain-npc').textContent).toBe('Serena Copperlane');
  });

  it('STOP-1 (R7): the governing faction modifier rides the power line, its one home since T2-17 cut the Governing authority box', () => {
    const s = base();
    s.powerStructure.factions[0].modifier = 'corruption-riddled';
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const chip = screen.getByTestId('ruling-chain-modifier');
    expect(chip.textContent).toBe('corruption-riddled');
    expect(screen.getByTestId('ruling-chain').textContent.split('corruption-riddled').length - 1, 'said once on the page').toBe(1);
    cleanup();
    render(<PowerTab powerStructure={base().powerStructure} settlement={base()} narrativeNote={null} />);
    expect(screen.getByTestId('ruling-chain').textContent).toContain('Merchant Guild');
    expect(screen.queryByTestId('ruling-chain-modifier'), 'no modifier, no chip').toBeNull(); // anchored: the chain block renders on this render
  });

  it('a pre-density settlement with no NPCs renders the chain as far as the data goes', () => {
    const s = base();
    render(<PowerTab powerStructure={s.powerStructure} settlement={s} narrativeNote={null} />);
    const chain = screen.getByTestId('ruling-chain');
    expect(chain.textContent).toContain('Merchant Guild');
    expect(screen.getByTestId('ruling-chain-absence').textContent).toMatch(/ends, honestly, at the faction/);
  });
});

/**
 * ⭐ UX CONSOLIDATION 2026-10-30 — THE POWER PAGE SAYS WHO GOVERNS ONCE (RULINGS-T2 T2-17..T2-19;
 * RUBRIC R2, R4, R6; RULINGS-CROSS X-4). A REAL generated town, because the desk lines this
 * describe watches are drawn from generated state. Each absence is anchored on the same render.
 */
describe('UX consolidation — Power (T2-17..T2-19)', () => {
  const town = generateSettlementPipeline({ settType: 'town', tradeRouteAccess: 'road' }, null, { seed: 'power-u5-c', customContent: {} });
  const desk = (playerView = false) => powerStateProse(town, {
    ...(coupContenders(town) ? { contenders: coupContenders(town), riskLabel: coupRiskLabel(coupContenders(town)) } : {}),
    structuralLens: structuralLensOf(town),
    politics: politicsBlocsOf({ worldState: null, settlementId: town.id, includeGroundTruth: !playerView, includeCovert: !playerView }),
  }, { seed: String(town._seed ?? town.id ?? ''), audience: playerView ? 'player' : 'dm', tierNoun: tierNounFor(town.tier) });
  const view = (props = {}) => render(<PowerTab powerStructure={town.powerStructure} settlement={town} narrativeNote={null} {...props} />).container.textContent;

  it('T2-17: the ruling chain names the power once; no faction row, no Governing authority, no TabIntro', () => {
    const chain = rulingChainOf(town);
    expect(chain.faction.name, 'fixture premise: the faction IS the power').toBe(chain.power.name);
    const text = view({ publicDossier: true });
    const block = screen.getByTestId('ruling-chain');
    expect(block.textContent).toContain(chain.power.name);
    expect(block.textContent.split(chain.power.name).length - 1, 'the power is named once in the chain').toBe(1);
    expect(block.textContent).not.toContain('holds the governing seat'); // anchored: the power name is asserted in this block above
    expect(text).not.toContain('Governing authority'); // anchored: the chain block is on this render
  });

  it('T2-18: the legitimacy breakdown label is "Breakdown" and the fracture note is one sentence', () => {
    const text = view({ publicDossier: true });
    expect(text).toContain('Breakdown');
    expect(text).not.toContain('(base 50)'); // anchored: toContain('Breakdown') on this render
    const fractured = { ...town, powerStructure: { ...town.powerStructure, publicLegitimacy: { ...town.powerStructure.publicLegitimacy, governanceFractured: true } } };
    cleanup();
    const f = render(<PowerTab powerStructure={fractured.powerStructure} settlement={fractured} narrativeNote={null} publicDossier />).container.textContent;
    expect(f).toContain('Governance fractured.');
    expect(f).not.toContain('appears to govern is not the faction that governs'); // anchored: toContain('Governance fractured.') on this render
  });

  it('T2-18: the cut lenses do not draw (DS-POW-2 lens, legitimacy hold, governing title, dormant blocs) and the kept ones do', () => {
    const d = desk(false);
    const text = view({ publicDossier: false });
    expect(d.stabilityHeader?.sentence, 'fixture premise: the stability ladder line draws').toBeTruthy();
    expect(text).toContain(d.stabilityHeader.sentence.slice(-40));
    expect(text).toContain(d.successionRisk.sentence.slice(-40));
    for (const [lens, rung] of [['stabilityLens', d.stabilityLens], ['successionHold', d.successionHold], ['governingTitle', d.governingTitle], ['blocPresence (dormant)', d.blocPresence]]) {
      if (!rung?.sentence) continue;
      expect(text, `${lens} still draws`).not.toContain(rung.sentence.slice(-40)); // anchored: the stability and succession lines are asserted on this render above
    }
    expect(String(d.blocPresence?.provenance?.poolKey)).toMatch(/^layer DORMANT/);
    expect(text).not.toContain('Sides and combinations'); // anchored: same render as the kept lenses above
  });

  it('T2-18: the coup-risk and capture chips stand on public and yield where their sentences speak', () => {
    expect(town.powerStructure.criminalCaptureState).toBe('equilibrium');
    const pub = view({ publicDossier: true });
    expect(pub).toContain('Criminal: Tolerated');
    expect(document.querySelector('[aria-label^="Coup risk:"]'), 'the public ruler card keeps its coup chip').toBeTruthy();
    cleanup();
    const d = desk(false);
    const dm = view({ publicDossier: false });
    expect(dm).toContain(d.successionRisk.sentence.slice(-40));
    expect(document.querySelector('[aria-label^="Coup risk:"]'), 'the coup chip beside its own sentence').toBeNull();
    if (d.captureReading?.sentence) expect(dm).not.toContain('Criminal: Tolerated'); // anchored: the succession sentence is asserted on this render
  });

  it('T2-19: Current Tensions and Active Conflicts are not on the Power page', () => {
    expect(town.conflicts.length, 'fixture premise: the town has a conflict').toBeGreaterThan(0);
    expect(town.history.currentTensions.length, 'fixture premise: the town has tensions').toBeGreaterThan(0);
    const text = view({ publicDossier: true });
    expect(text).toContain('The Factions');
    expect(text).not.toMatch(/Current Tensions \(|Active Conflicts \(/); // anchored: toContain('The Factions') on this render
    expect(text).not.toContain(town.conflicts[0].issue); // anchored: same render
  });
});
