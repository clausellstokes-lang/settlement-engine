/** @vitest-environment jsdom */
/**
 * dossierDepthTabs.test.jsx — Phase 5 W4e dossier-depth tabs, extended by the
 * §805 split (WarFaithTab → WORLD-group WarTab + FaithTab).
 *
 * Pins, above all, THE CONSTITUTIONAL CHECK: the FAITH tab is built on OUR
 * gated FaithSection, so a FREE / ANON viewer NEVER sees a deity name in it
 * (no live pantheon, no leak). It also pins the §805 WAR tab's epistemic
 * surfaces — the believed unit position with its staleness band and source
 * grade, the DM-truth divergence ("you believe the host near X; in truth it
 * stands at Y"), the muster/condition reads, the named war with its sides, and
 * the DM-only belief band (fail-closed for every other viewer) — plus that
 * Substrate + Magic render their read-models and that a magic-free settlement's
 * Magic tab is dormant (honest, not fabricated).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { expectAbsentWithAnchor, expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';

// Mock the store: WarFaithTab reads campaigns/savedSettlements/auth, and its
// composed FaithSection reads auth.tier/isElevated/the upsell seam.
vi.mock('../../src/store/index.js', () => {
  const data = {};
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  useStore.__reset = () => {
    for (const k of Object.keys(data)) delete data[k];
    Object.assign(data, {
      auth: { tier: 'anon' },
      isElevated: () => false,
      setPurchaseModalOpen: () => {},
      setActivePricingMoment: () => {},
      campaigns: [],
      savedSettlements: [],
    });
  };
  return { useStore };
});

import { useStore } from '../../src/store/index.js';
import WarTab, { MARTIAL_CRISIS_TYPES, warTabHasContent } from '../../src/components/new/tabs/WarTab.jsx';
import FaithTab from '../../src/components/new/tabs/FaithTab.jsx';
import RumorsTab from '../../src/components/new/tabs/RumorsTab.jsx';
import { CURRENT_TREATY_TICKS_PER_YEAR } from '../../src/domain/worldPulse/treatyClock.js';
import SubstrateTab from '../../src/components/new/tabs/SubstrateTab.jsx';
import MagicTab from '../../src/components/new/tabs/MagicTab.jsx';
// DESK-4: the arms below assert the RENDERED DOM against the corpus itself rather than
// against transcribed prose, so a re-authored variant moves the pin with it.
import { DOSSIER_STATE_PROSE_WAR_FAITH as WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';

// A distinctive latent-deity name — if it ever appears in a free War & Faith
// render, the constitutional privacy gate has failed.
const LATENT_NAME = 'Zzyraxil the Unnamed';
const latentPantheonTown = () => ({
  name: 'Quietford',
  config: { latentPantheon: { patron: { name: LATENT_NAME, _deityRef: 'deity:core:zzyraxil' }, cults: [{ name: 'The Whispering Ash' }] } },
});
const activePatronTown = () => ({
  name: 'Sunhold',
  config: { primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major', lawAxis: 'lawful', domain: 'sun', alignmentAxis: 'good' } },
});

beforeEach(() => useStore.__reset());
afterEach(() => cleanup());

describe('FaithTab — the constitutional gate (free/anon see NO deity names)', () => {
  it('ANON + a latent-pantheon town shows the generic teaser and NEVER a deity name', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    const { container } = render(<FaithTab settlement={latentPantheonTown()} />);
    expect(screen.getByTestId('faith-tab')).toBeTruthy();
    // The gated faith surface degrades to the generic true-neutral teaser.
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(screen.queryByTestId('faith-section')).toBeNull();
    // THE non-negotiable guarantee: no latent deity / cult name reaches the DOM.
    expect(container.textContent).not.toContain(LATENT_NAME);
    expect(container.textContent).not.toContain('Whispering Ash');
    expect(container.textContent).toMatch(/no single creed holds sway/i);
  });

  it('FREE + a latent-pantheon town also shows only the teaser (never the latent name)', () => {
    useStore.__set({ auth: { tier: 'free' } });
    const { container } = render(<FaithTab settlement={latentPantheonTown()} />);
    expect(screen.getByTestId('faith-teaser')).toBeTruthy();
    expect(container.textContent).not.toContain(LATENT_NAME);
  });

  it('an owned/shared embed renders the read-only faith panel to everyone (a shared pantheon)', () => {
    // An anon viewer of a faith-active dossier legitimately sees the OWNED embed
    // (never the latent seed) — the same behaviour FaithSection guarantees.
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={activePatronTown()} publicDossier />);
    expect(screen.getByTestId('faith-section')).toBeTruthy();
    expect(screen.getByTestId('faith-patron').textContent).toMatch(/Sunlord Aurelian/);
  });

  it('a premium, deity-free town renders the honest absence note (never a blank body)', () => {
    useStore.__set({ auth: { tier: 'premium' } });
    const { container } = render(<FaithTab settlement={{ name: 'Quietford', config: {} }} />);
    expect(screen.queryByTestId('faith-section')).toBeNull();
    expect(screen.queryByTestId('faith-teaser')).toBeNull();
    expect(container.textContent).toMatch(/keeps no named faith/i);
  });
});

// ── §805 FAITH layout — the patron seat, niche occupancy, the realm pantheon ──
const liveFaithTown = () => ({
  id: 'home', name: 'Sunhold',
  config: {
    primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major' },
    faithProfile: {
      deities: [
        { deityRef: 'a', name: 'Sunlord Aurelian', niche: 'peacelike:good', share: 60, standing: 'ascendant', legitimacy: 0.8, isPatron: true },
        { deityRef: 'b', name: 'The Gloam', niche: 'warlike:evil', share: 25, standing: 'cult', legitimacy: 0.2, isPatron: false },
      ],
      contested: true, patronSecurity: 0.55, unaffiliated: 15,
    },
  },
});
const pantheonCampaign = () => ({
  id: 'c-faith', settlementIds: ['home'],
  worldState: { pantheon: { 'deity:sun': { seats: 2, wins: 1, losses: 0, tier: 'major' } } },
});

describe('FaithTab — the §805 layout (patron seat + niche occupancy + realm pantheon)', () => {
  it('renders the patron seat with its legitimacy NOW, and the contested marker', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={liveFaithTown()} />);
    const seat = screen.getByTestId('faith-patron-seat');
    expect(seat.textContent).toMatch(/Sunlord Aurelian holds the seat/);
    expect(seat.textContent).toMatch(/secure/);           // legitimacy 0.8 band
    // ⭐ THE BAND IS THE WHOLE READING, and the raw percentage that used to sit
    // beside it is GONE (T11 landing, 2026-08-31). It read "(rightful claim 80%)"
    // one space after the word "secure" — an engine scalar restating a band word,
    // the prose-numerics class this estate kills; tests/lint/proseNumerics.test.js
    // reddened on it at the landing gate. This pin is now the humanization itself.
    // anchored: the seat's name, band and contested marker are all asserted PRESENT on this same textContent (above and below), so an emptied node cannot pass this absence.
    expect(seat.textContent).not.toMatch(/\d+%/);
    expect(seat.textContent).toMatch(/contested/i);
  });

  it('renders niche occupancy — who occupies which niche, one row per creed', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={liveFaithTown()} />);
    const rows = screen.getAllByTestId('faith-niche-row');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toMatch(/peacelike · good: Sunlord Aurelian \(patron\)/);
    expect(rows[1].textContent).toMatch(/warlike · evil: The Gloam/);
    // THE FOLLOWING IS IN WORDS, and the two rungs are pinned APART so a band
    // table that collapsed to one word could not pass: share 60 and share 25 are
    // deliberately either side of the 50 cut. The standing token is the engine's
    // own finite word, rendered verbatim.
    expect(rows[0].textContent).toMatch(/ascendant · most of the town/);
    expect(rows[1].textContent).toMatch(/cult · a large minority/);
    // T11 landing: `{d.share}%` was copied in shape from FaithSection.jsx:174, which is
    // BANKED prose-numerics debt rather than a sanctioned idiom — hence the absence below.
    // anchored: BOTH rows are asserted above to carry their creed name, niche and banded following on this exact joined textContent, so an emptied render cannot pass this.
    expect(`${rows[0].textContent}${rows[1].textContent}`).not.toMatch(/\d+%/);
  });

  it('a static embed (no live profile) renders NO fabricated seat or occupancy', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={activePatronTown()} />);
    expect(screen.getByTestId('faith-section')).toBeTruthy();
    expect(screen.queryByTestId('faith-patron-seat')).toBeNull();
    expect(screen.queryByTestId('faith-niches')).toBeNull();
  });

  it('the realm pantheon mounts for the premium DM alone (never playerView / public / anon)', () => {
    useStore.__set({ auth: { tier: 'premium' }, campaigns: [pantheonCampaign()], savedSettlements: [] });
    const first = render(<FaithTab settlement={liveFaithTown()} saveId="home" />);
    expect(screen.getByTestId('faith-realm-pantheon')).toBeTruthy();
    first.unmount();

    useStore.__set({ auth: { tier: 'premium' }, campaigns: [pantheonCampaign()], savedSettlements: [] });
    const second = render(<FaithTab settlement={liveFaithTown()} saveId="home" playerView />);
    expect(screen.queryByTestId('faith-realm-pantheon')).toBeNull();
    second.unmount();

    useStore.__set({ auth: { tier: 'anon' }, campaigns: [pantheonCampaign()], savedSettlements: [] });
    render(<FaithTab settlement={liveFaithTown()} saveId="home" />);
    expect(screen.queryByTestId('faith-realm-pantheon')).toBeNull();
  });
});

// ── §805 WAR tab — the epistemic constitution made legible ────────────────────
const WAR_SAVES = [
  { id: 'home', settlement: { name: 'Homestead' } },
  { id: 'mid', settlement: { name: 'Midford' } },
  { id: 'foe', settlement: { name: 'Foehold' } },
];
/** A canonized campaign with: our column in transit under a CUT courier line
 *  (believed position ≠ true position), a live deployment (the named war + the
 *  muster), and a belief map (the DM-only band). */
const warCampaign = () => ({
  id: 'c-war', settlementIds: ['home', 'mid', 'foe'],
  worldState: {
    tick: 8, canonizedAt: '2026-01-01T00:00:00.000Z',
    deployments: {
      home: {
        targetId: 'foe', sinceTick: 2, role: 'siege',
        maxStartStrength: 60, currentEffectiveStrength: 45,
        morale: 0.7, supplyIntegrity: 0.8, foodReserve: 0.8, equipmentCondition: 0.9,
        casusReasons: [{ type: 'grievance', score: 2 }],
      },
    },
    spatialLedgers: {
      armyTransit: {
        home: {
          armyId: 'home', role: 'march', originId: 'home', destId: 'foe',
          path: ['home', 'mid', 'foe'], departTick: 0, arrivalTick: 10,
          position01: 0.8, strength: 45, readiness: 0.6, supplyQuality: 1,
          funding: 0.5, beliefStaleness: 6, lastTick: 8,
        },
      },
      beliefMaps: {
        home: { seat: { foe: { strengthBand: 1, readiness: 0.8, allianceLabel: 'rival', faithLabel: null, confidence01: 0.6, lastUpdateTick: 4 } } },
      },
    },
  },
});
const homeTown = () => ({
  id: 'home', name: 'Homestead',
  config: { faithProfile: { martial: { readiness01: 0.8, experience01: 0.3, footing: 0.6 } } },
});

describe('WarTab — believed units, staleness bands, and the DM-truth divergence (§805)', () => {
  const asWarOwner = (tier = 'premium') => useStore.__set({
    auth: { tier }, campaigns: [warCampaign()], savedSettlements: WAR_SAVES,
  });

  it('renders the believed unit position with its staleness band and source grade', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const units = screen.getByTestId('war-units');
    // The believed picture: the last credible word is 6 weeks old (courier cut),
    // so the town still believes the host near HOME while it truly nears Foehold.
    expect(units.textContent).toMatch(/Believed near Homestead/);
    expect(screen.getByTestId('war-unit-staleness').textContent).toMatch(/aging/);
    expect(units.textContent).toMatch(/Last credible word, 6 weeks old/);
    expect(units.textContent).toMatch(/courier line home is cut/);
  });

  it('DM truth shows the TRUE picture and renders the divergence explicitly', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const truth = screen.getByTestId('war-unit-truth');
    expect(truth.textContent).toMatch(/Where it truly stands:\s*Foehold/);
    // The gap IS the drama — rendered, never smoothed.
    expect(truth.textContent).toMatch(/believes the host near Homestead; in truth it stands at Foehold/);
  });

  it('renders muster & condition (the clerk roll, the army status, the town under arms)', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const muster = screen.getByTestId('war-muster');
    expect(muster.textContent).toMatch(/The town under arms/);
    // experience01 0.3 with a rust term ⇒ the drill has dulled.
    expect(muster.textContent).toMatch(/rusted|blooded/);
  });

  it('renders the named war with sides read from the war edges', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const wars = screen.getByTestId('war-wars');
    expect(wars.textContent).toMatch(/Against:.*Foehold/);
    expect(wars.textContent).toMatch(/attacking/i);
  });

  it('the DM belief band renders for the premium owner and NEVER for anon / playerView', () => {
    asWarOwner();
    const first = render(<WarTab settlement={homeTown()} saveId="home" />);
    expect(screen.getByTestId('war-beliefs').textContent).toMatch(/Foehold: believed slight, in the field/);
    first.unmount();

    // Fail-closed: an anon viewer keeps the believed unit picture (the player
    // half of §805) but no truth disclosure and no belief band.
    useStore.__set({ auth: { tier: 'anon' }, campaigns: [warCampaign()], savedSettlements: WAR_SAVES });
    const second = render(<WarTab settlement={homeTown()} saveId="home" />);
    expect(screen.getByTestId('war-units')).toBeTruthy();
    expect(screen.queryByTestId('war-beliefs')).toBeNull();
    expect(screen.queryByTestId('war-unit-truth')).toBeNull();
    second.unmount();

    // The player view suppresses the truth even for a premium viewer.
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" playerView />);
    expect(screen.getByTestId('war-units')).toBeTruthy();
    expect(screen.queryByTestId('war-beliefs')).toBeNull();
    expect(screen.queryByTestId('war-unit-truth')).toBeNull();
  });

  it('a non-campaign settlement renders the one plain absence line, "No war." (W10)', () => {
    useStore.__set({ auth: { tier: 'premium' } });
    render(<WarTab settlement={{ id: 'lone', name: 'Lonetop' }} saveId={null} />);
    expect(screen.getByTestId('war-tab')).toBeTruthy();
    expect(screen.queryByTestId('war-units')).toBeNull();
    // The product explainer is gone (R1): the line states the fact and nothing else.
    expect(screen.getByTestId('war-dormant').textContent).toBe('No war.');
  });
});

/**
 * ── DESK CAR 4: THE WAR & FAITH DESK, DRAWN (the CITATION LAW's own arm) ─────────────
 *
 * The mount walker's reachability arm can only see that a mount id appears once as a
 * string literal under src/components — it cannot tell a real draw from a decorative
 * literal, so planting bare literals PASSES THE GATE AND LIES. A mount is real only if the
 * RENDERED DOM carries the corpus sentence or band. These arms are that proof, for both
 * host tabs of the first corpus leaf to span two.
 *
 * Each public-dossier arm asserts BOTH DIRECTIONS on the SAME settlement through
 * `expectPresentThenAbsent`, so it cannot pass vacuously: a render that simply produced
 * nothing fails the liveness half instead of passing a bare exclusion.
 */
describe('WarTab — the war half of the warFaith desk (DESK-4)', () => {
  const asWarOwner = () => useStore.__set({
    auth: { tier: 'premium' }, campaigns: [warCampaign()], savedSettlements: WAR_SAVES,
  });

  it('draws the DS-WAR-1 standing sentence — a REAL draw, not a planted literal', () => {
    asWarOwner();
    render(<WarTab settlement={homeTown()} saveId="home" />);
    const standing = screen.getByTestId('war-desk-standing');
    // Homestead has an army abroad besieging Foehold ⇒ the `On campaign` pool. The expected
    // text is READ OUT OF THE CORPUS rather than transcribed, so a re-authored variant moves
    // this pin with it instead of reddening on prose churn.
    const authored = WAR_FAITH['DS-WAR-1'].pools['statusLabel: On campaign']
      .map((v) => v.text.replace(/\{settlement\}/g, 'Homestead').replace(/\{counterpart\}/g, 'Foehold'));
    expect(authored.some((line) => standing.textContent.includes(line))).toBe(true);
  });

  it('THE PUBLIC GATE: the same town draws the sentence privately and NOTHING publicly', () => {
    asWarOwner();
    const priv = render(<WarTab settlement={homeTown()} saveId="home" />);
    const privText = priv.container.textContent;
    cleanup();
    asWarOwner();
    const pub = render(<WarTab settlement={homeTown()} saveId="home" publicDossier />);
    const pubText = pub.container.textContent;
    const line = WAR_FAITH['DS-WAR-1'].pools['statusLabel: On campaign']
      .map((v) => v.text.replace(/\{settlement\}/g, 'Homestead').replace(/\{counterpart\}/g, 'Foehold'))
      .find((t) => privText.includes(t));
    expect(line, 'the private render drew no DS-WAR-1 sentence to test the gate with').toBeTruthy();
    expectPresentThenAbsent(privText, pubText, line, 'the public gate: DS-WAR-1 on the war tab');
    // The DATUM is untouched by the gate — the war block's own rows still render.
    expect(pubText).toMatch(/Deployed\./);
  });

  it('the DORMANT NOTE replaces the plain line only when the whole PAGE-SET is at rest', () => {
    // A campaign settlement with no war beat, no treaty and no patron: DS-WAR-3's exact
    // condition, and the only block on this leaf whose condition spans both tabs.
    useStore.__set({
      auth: { tier: 'premium' },
      campaigns: [{ id: 'c-quiet', settlementIds: ['quiet'], worldState: { tick: 3, canonizedAt: '2026-01-01T00:00:00.000Z' } }],
      savedSettlements: [{ id: 'quiet', settlement: { name: 'Stillwater' } }],
    });
    const { container } = render(<WarTab settlement={{ id: 'quiet', name: 'Stillwater', config: {} }} saveId="quiet" />);
    const authored = WAR_FAITH['DS-WAR-3'].pools['*']
      .map((v) => v.text.replace(/\{settlement\}/g, 'Stillwater'));
    expect(authored.some((line) => container.textContent.includes(line))).toBe(true);
    // It REPLACES the plain sentence rather than standing under it — both say the town is
    // at peace, and printing them an inch apart is the page saying one thing twice.
    // anchored: the corpus line is asserted PRESENT in this same textContent on the line above, so an emptied render cannot pass this absence
    expect(container.textContent).not.toContain('no host abroad, no siege at the walls');
  });
});

describe('WarTab — the martial crisis is the Overview\'s (X-3), and the tab never says peace beside it (owner order 2026-09-17)', () => {
  // The Overview's crisis card OWNS each `settlement.stress` entry (X-3): the War tab's old
  // "Active crisis" block restated it verbatim (95/95 martial rows in the 1000-town sample) and
  // is CUT. The 2026-09-17 order still binds: a town under a martial banner is never told
  // "No war." or the dormant note, in or out of a campaign.
  const PEACE_WORDS = Object.freeze([
    'No war.',
    'no host abroad, no siege at the walls',
    'there is no war picture to tell',
  ]);
  const bannered = (type) => ({
    id: 'held', name: 'Heldmark', config: {},
    stress: [{ type, label: `Crisis ${type}`, summary: `The ${type} summary as generated.` }],
  });
  const calm = () => ({ id: 'held', name: 'Heldmark', config: {}, stress: [{ type: 'famine', label: 'Famine' }] });
  const quietCampaign = () => [{ id: 'c-held', settlementIds: ['held'], worldState: { tick: 3, canonizedAt: '2026-01-01T00:00:00.000Z' } }];

  it('no martial banner prints on the War tab, and nothing there says peace beside one', () => {
    expect(MARTIAL_CRISIS_TYPES).toEqual(['under_siege', 'occupied', 'wartime', 'insurgency', 'slave_revolt']);
    for (const inCampaign of [true, false]) {
      // The liveness half: the SAME roster with a calm town draws a peace line, so the
      // absences below cannot pass on a page that simply renders nothing ever.
      useStore.__reset();
      useStore.__set({ auth: { tier: 'premium' }, campaigns: inCampaign ? quietCampaign() : [], savedSettlements: [{ id: 'held', settlement: { name: 'Heldmark' } }] });
      const calmText = render(<WarTab settlement={calm()} saveId="held" />).container.textContent;
      cleanup();
      const dormantLines = WAR_FAITH['DS-WAR-3'].pools['*'].map((v) => v.text.replace(/\{settlement\}/g, 'Heldmark'));
      const peace = [...PEACE_WORDS, ...dormantLines].find((line) => calmText.includes(line));
      expect(peace, `a calm town (in a campaign: ${inCampaign}) drew no peace line`).toBeTruthy();
      for (const type of MARTIAL_CRISIS_TYPES) {
        useStore.__reset();
        useStore.__set({ auth: { tier: 'premium' }, campaigns: inCampaign ? quietCampaign() : [], savedSettlements: [{ id: 'held', settlement: { name: 'Heldmark' } }] });
        const { container } = render(<WarTab settlement={bannered(type)} saveId="held" />);
        expect(screen.queryByTestId('war-martial-crisis')).toBeNull();
        expectPresentThenAbsent(calmText, container.textContent, peace, `${type}, in a campaign: ${inCampaign}`);
        expect(container.textContent).not.toContain(`The ${type} summary as generated.`); // anchored: expectPresentThenAbsent on the line above proves the same roster's page is live
        cleanup();
      }
    }
  });

  it('a calm town in the same quiet campaign still draws its dormant note (the pool is gated, not deleted)', () => {
    useStore.__set({
      auth: { tier: 'premium' },
      campaigns: quietCampaign(),
      savedSettlements: [{ id: 'held', settlement: { name: 'Heldmark' } }],
    });
    const { container } = render(<WarTab settlement={calm()} saveId="held" />);
    const dormantLines = WAR_FAITH['DS-WAR-3'].pools['*'].map((v) => v.text.replace(/\{settlement\}/g, 'Heldmark'));
    expect(dormantLines.some((line) => container.textContent.includes(line))).toBe(true);
    expect(screen.queryByTestId('war-martial-crisis')).toBeNull();
  });
});

describe('warTabHasContent — the War tab\'s presence predicate (W10 / X-7)', () => {
  // The treaty ledger's real shape (treatyDossierTab.test.jsx :: campaignWithTreaty), cut
  // to one honored term: a campaign whose only martial record is the treaty.
  const treatyCampaign = () => ({
    id: 'c-treaty', settlementIds: ['iron', 'weak'],
    worldState: {
      tick: 60, canonizedAt: '2026-01-01T00:00:00.000Z',
      spatialLedgers: { treaties: { 'iron>weak': {
        parties: ['iron', 'weak'], victorId: 'iron', loserId: 'weak', victorName: 'Ironhold', loserName: 'Weakmoor',
        mintedTick: 12, believedMarginAtSignature: 0.4, budgetGranted: 3, budgetSpent: 1, complianceState: 'honored',
        treatyTicksPerYear: CURRENT_TREATY_TICKS_PER_YEAR,
        terms: [
          { type: 'non_aggression', family: 'security', magnitude: 1, mintedTick: 12, expiresTick: 60 + (3 * CURRENT_TREATY_TICKS_PER_YEAR), weightSpent: 0.4, complianceState: 'honored', trueState: 'honored', burden01: 0, receipt: 'n' },
        ],
        receipts: ['The Peace of Weakmoor.'],
      } } },
    },
  });

  it('is false with no campaign, in a quiet campaign, and for a martial banner the war ledger does not carry', () => {
    const lone = { id: 'lone', name: 'Lonetop' };
    expect(warTabHasContent(lone)).toBe(false);
    expect(warTabHasContent(lone, { saveId: 'lone', campaigns: [] })).toBe(false);
    const quiet = [{ id: 'c-q', settlementIds: ['held'], worldState: { tick: 3, canonizedAt: '2026-01-01T00:00:00.000Z' } }];
    expect(warTabHasContent({ id: 'held', name: 'Heldmark', config: {} }, { saveId: 'held', campaigns: quiet })).toBe(false);
    const sieged = { id: 'held', name: 'Heldmark', config: {}, stress: [{ type: 'under_siege', label: 'Under Siege' }] };
    expect(warTabHasContent(sieged, { saveId: 'held', campaigns: quiet })).toBe(false);
    // An uncanonized campaign carries no war picture either.
    expect(warTabHasContent(homeTown(), { saveId: 'home', campaigns: [{ ...warCampaign(), worldState: { ...warCampaign().worldState, canonizedAt: null } }] })).toBe(false);
  });

  it('is true for a live war picture, and for a treaty alone', () => {
    expect(warTabHasContent(homeTown(), { saveId: 'home', campaigns: [warCampaign()] })).toBe(true);
    // The settlement id stands in for the save id when none is passed (the tab's own rule).
    expect(warTabHasContent(homeTown(), { campaigns: [warCampaign()] })).toBe(true);
    const weak = { id: 'weak', name: 'Weakmoor' };
    expect(warTabHasContent(weak, { saveId: 'weak', campaigns: [treatyCampaign()] })).toBe(true);
  });

  it('agrees with the tab: true exactly when the tab shows something other than "No war."', () => {
    const cases = [
      [{ id: 'lone', name: 'Lonetop' }, null, []],
      [{ id: 'held', name: 'Heldmark', config: {} }, 'held', [{ id: 'c-q', settlementIds: ['held'], worldState: { tick: 3, canonizedAt: '2026-01-01T00:00:00.000Z' } }]],
      [homeTown(), 'home', [warCampaign()]],
      [{ id: 'weak', name: 'Weakmoor' }, 'weak', [treatyCampaign()]],
    ];
    const answers = [];
    for (const [settlement, saveId, campaigns] of cases) {
      useStore.__reset();
      // Public dossier: the desk is silent, so the plain line is the only absence text.
      useStore.__set({ auth: { tier: 'anon' }, campaigns, savedSettlements: WAR_SAVES });
      render(<WarTab settlement={settlement} saveId={saveId} publicDossier />);
      const showsNoWar = screen.queryByTestId('war-dormant')?.textContent === 'No war.';
      const present = warTabHasContent(settlement, { saveId, campaigns });
      expect(present, `${settlement.name}`).toBe(!showsNoWar);
      answers.push(present);
      cleanup();
    }
    // Both answers are exercised, so the agreement cannot hold vacuously.
    expect(answers).toEqual([false, false, true, true]);
  });
});

describe('FaithTab — the faith half of the warFaith desk (DESK-4)', () => {
  it('draws the DS-FTH-1 seat sentences and the DS-FTH-3 creed sentences', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={liveFaithTown()} />);
    expect(screen.getByTestId('faith-desk-seat').textContent).toContain('Sunlord Aurelian');
    // DS-FTH-3 speaks at `faith.creedStanding`: the patron's standing is `ascendant`.
    const creed = screen.getByTestId('faith-desk-creed');
    const authored = WAR_FAITH['DS-FTH-3'].pools['STANDING: ascendant']
      .map((v) => v.text.replace(/\{creed\}/g, 'Sunlord Aurelian').replace(/\{settlement\}/g, 'Sunhold'));
    expect(authored.some((line) => creed.textContent.includes(line))).toBe(true);
  });

  it('⭐ THE ONE GLANCE ROW: the niche row keeps the band word and does NOT speak', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    render(<FaithTab settlement={liveFaithTown()} />);
    const glance = screen.getByTestId('faith-desk-niche-glance');
    // The band word the row already carries survives...
    expect(glance.textContent).toMatch(/ascendant/);
    // ...and the corpus sentence does NOT, because the registry says `glance` here. This is
    // C3 held across a real page: DS-FTH-3 speaks ONCE, at faith.creedStanding above.
    const spoken = screen.getByTestId('faith-desk-creed').textContent;
    // anchored: the SAME sentence is asserted present in `spoken` on the line below, so this absence is the rung being stripped rather than the corpus being silent
    expect(glance.textContent).not.toContain(spoken.slice(0, 40));
    expect(spoken.length).toBeGreaterThan(40);
  });

  it('THE PUBLIC GATE: the same town speaks privately and says NOTHING publicly', () => {
    useStore.__set({ auth: { tier: 'anon' } });
    const priv = render(<FaithTab settlement={liveFaithTown()} />);
    const privText = priv.container.textContent;
    cleanup();
    useStore.__set({ auth: { tier: 'anon' } });
    const pub = render(<FaithTab settlement={liveFaithTown()} publicDossier />);
    const pubText = pub.container.textContent;
    const line = WAR_FAITH['DS-FTH-3'].pools['STANDING: ascendant']
      .map((v) => v.text.replace(/\{creed\}/g, 'Sunlord Aurelian').replace(/\{settlement\}/g, 'Sunhold'))
      .find((t) => privText.includes(t));
    expect(line, 'the private render drew no DS-FTH-3 sentence to test the gate with').toBeTruthy();
    expectPresentThenAbsent(privText, pubText, line, 'the public gate: DS-FTH-3 on the faith tab');
    // The DATUM survives: the patron seat, its band and the niche rows are all untouched.
    expect(pubText).toContain('Sunlord Aurelian holds the seat');
    expect(pubText).toMatch(/ascendant/);
  });

  it('⭐ THE PATRON-LESS TOWN speaks DS-FTH-2, and names no creed', () => {
    // A premium viewer of a deity-free town: FaithSection renders NOTHING (its HIDDEN
    // mode), which is the only branch where DS-FTH-2 can draw without doubling — its
    // `[street]` variant is a byte-identical copy of FaithSection's own teaser body.
    useStore.__set({ auth: { tier: 'premium' } });
    const { container } = render(<FaithTab settlement={{ id: 'quiet', name: 'Quietford', config: {} }} />);
    const teaser = screen.getByTestId('faith-desk-teaser');
    const authored = WAR_FAITH['DS-FTH-2'].pools['PRIVATE DOSSIER']
      .map((v) => v.text.replace(/\{settlement\}/g, 'Quietford'));
    expect(authored.some((line) => teaser.textContent.includes(line))).toBe(true);
    // The standing message keeps its call to action beside it — product furniture, not a
    // fact about the town, so the two are not twins the way the war note and its fallback are.
    expect(container.textContent).toMatch(/Assign a patron deity/);
    // And the honest-absence guarantee holds: the seat, the niches and the creed lines are
    // all absent, because there is no creed to name.
    expect(screen.queryByTestId('faith-desk-seat')).toBeNull();
    expect(screen.queryByTestId('faith-desk-niche-glance')).toBeNull();
  });
});

describe('SubstrateTab — surfaces OUR 16-variable causal read-model', () => {
  it('renders the substrate grid for a settlement', () => {
    const { container } = render(<SubstrateTab settlement={{ name: 'Testburg', config: { size: 'town' } }} />);
    expect(screen.getByTestId('substrate-tab')).toBeTruthy();
    // The read-model yields the 16 system variables as rows.
    const rows = [...container.querySelectorAll('[data-substrate-row]')];
    expect(rows.length).toBeGreaterThan(0);
    expect(screen.getByTestId('substrate-pressures')).toBeTruthy();
    expect(screen.getByText('What is holding, what is strained')).toBeTruthy();
    expect(screen.getByText('Settlement foundations')).toBeTruthy();
    expect(container.textContent).not.toMatch(/causal substrate|engine simulates|system|variable/i);
    for (const row of rows) {
      expect(row.textContent).not.toMatch(/\b(?:100|[1-9]?\d)\b/);
    }
  });
});

describe('MagicTab — 10-facet posture + magic-free dormancy', () => {
  it('renders the envelope facets + roles for a magical settlement', () => {
    const { container } = render(<MagicTab settlement={{ config: { magicLevel: 'moderate' } }} />);
    expect(screen.getByTestId('magic-tab')).toBeTruthy();
    expect(container.querySelectorAll('[data-facet]').length).toBe(6);
    expect(screen.getByTestId('magic-roles')).toBeTruthy();
  });

  it('is DORMANT for a magic-free world — honest, not fabricated (no facets)', () => {
    const { container } = render(<MagicTab settlement={{ config: { magicExists: false } }} />);
    expect(screen.getByTestId('magic-tab')).toBeTruthy();
    // Dormancy law: no fabricated envelope for a dead-magic world.
    expect(container.querySelectorAll('[data-facet]').length).toBe(0);
    expect(container.textContent).toMatch(/does not function/i);
  });

  it('surfaces the deity⇄magic-legality coupling when a MAJOR deity regulates', () => {
    const settlement = { config: { magicLevel: 'moderate', primaryDeitySnapshot: { name: 'Sunlord Aurelian', rankAxis: 'major' } } };
    render(<MagicTab settlement={settlement} />);
    expect(screen.getByTestId('magic-deity-coupling').textContent).toMatch(/magic legality/i);
  });
});

describe('RumorsTab — the absence states the fact (chair ruling U3, 2026-10-30)', () => {
  it('with no rumor ledger the tab says no word has reached the town, and promises nothing', () => {
    useStore.__set({ auth: { tier: 'premium' }, campaigns: [], savedSettlements: [] });
    const { container } = render(<RumorsTab settlement={{ id: 'quiet', name: 'Stillwater' }} saveId="quiet" />);
    const text = screen.getByTestId('rumors-tab').textContent;
    expect(text).toBe('No word has reached Stillwater.');
    expectAbsentWithAnchor(container.textContent, 'the moment it happens', 'No word has reached Stillwater.', 'U3 contradiction');
  });
});
