/** @vitest-environment jsdom */
/**
 * registryRealityBadge.test.jsx — EM-F1e's acceptance over DESIGN §13, "Reality is shown":
 * every off-stage decree wears a PHANTOM or REAL badge in the registry, and the DM can see
 * before a tick whether a staged act has world consequence.
 *
 * ⛔ THE ARMS READ THE PRODUCT'S BINDING, NEVER A PROP THEY SUPPLIED THEMSELVES. That is the
 * whole reason this file exists beside `decreeRegistryPage.test.jsx`, whose arms drive the
 * container directly: the verifier's FIX-5 found `rewindLimit` dark for an entire programme
 * precisely because the page's own arm handed itself the prop the mount never bound, and an
 * arm of that shape would pass here on the day nobody bound the badge. So R1 and R3 RENDER
 * THE SHELL and read what a DM would see, and the only badge that reaches the assertions is
 * the one `src/store/phantomMintAction.js :: counterpartyBadgeOf` resolved out of the store's
 * own library rows.
 *
 * ⛔ NOTHING HERE RE-TYPES A PRODUCER'S ANSWER. The ops are built by EM-B1a's OWN `makeOp`,
 * so `stage` and `consequence` are the CATALOGUE's declaration and not two words typed into a
 * fixture; the registry is EM-C1's OWN `stage`; the phantom rows are the domain's OWN
 * `mintPhantom` over the estate's own `mintDmId` and `rollFrom`, composed exactly as
 * `phantomMintAction.js` composes them; and the words are the page's exported labels.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY, each absence measured beside
 * a live presence in the same arm, so no `// anchored:` marker is owed anywhere in this file.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import DecreeRegistryPage, {
  COUNTERPARTY_BADGE_LABELS,
} from '../../src/components/edit/DecreeRegistryPage.jsx';
import { makeOp } from '../../src/domain/edit/operations.js';
import { stage } from '../../src/domain/edit/registry.js';
import { mintDmId } from '../../src/domain/edit/dmLayer.js';
import { PHANTOM_KIND, mintPhantom } from '../../src/domain/edit/phantoms.js';
import { rollFrom } from '../../src/domain/edit/pools.js';
import { createAuthSlice } from '../../src/store/authSlice.js';
import { STAFF_ROLES } from '../../src/lib/staffEntitlements.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHELL_PATH = 'src/components/edit/EditModeShell.jsx';
const SHELL_SOURCE = readFileSync(join(ROOT, SHELL_PATH), 'utf8');
const PAGE_SOURCE = readFileSync(join(ROOT, 'src/components/edit/DecreeRegistryPage.jsx'), 'utf8');

const SAVE = 'save-1';
const SEED = 'seed-1';
const T0 = '2026-09-23T10:00:00.000Z';

/**
 * TWO PHANTOM RECORDS, MINTED BY THE DOMAIN'S OWN LEAF over the estate's own producers —
 * the same composition `phantomMintAction.js` makes at its mint.
 */
const mintAt = (n) => mintPhantom(mintDmId(SEED, PHANTOM_KIND, n), `Phantom ${n}`, n, {
  mintId: mintDmId, roll: rollFrom,
});

/** A phantom save keyed the way the LOCAL backend keys it: by the record's own minted id. */
const LOCAL_PHANTOM = (() => {
  const record = mintAt(0);
  return Object.freeze({ id: String(record.id), settlement: record });
})();

/**
 * A phantom save keyed the way the CLOUD backend keys it (EM-F3c): the server minted the row
 * key and that key was written back ONTO the record inside, so the row and its record agree.
 */
const CLOUD_KEY = '00000000-0000-4000-8000-000000000002';
const CLOUD_PHANTOM = (() => {
  const record = mintAt(1);
  return Object.freeze({ id: CLOUD_KEY, settlement: { ...record, id: CLOUD_KEY } });
})();

/** A REAL counterparty: a save row whose blob is an ordinary settlement, not a phantom. */
const REAL_SAVE_ID = 'save-neighbour';
const REAL_SAVE = Object.freeze({
  id: REAL_SAVE_ID,
  settlement: Object.freeze({ id: REAL_SAVE_ID, name: 'Wend', tier: 'town', culture: 'germanic' }),
});

/** An off-stage act against one counterparty, at the CATALOGUE's own declared shape. */
const offStageAgainst = (id) => makeOp('declare-war', { kind: PHANTOM_KIND, id }, { counterparty: id });
/** An ordinary home act, which names no counterparty at all. */
const homeAct = (id) => makeOp('set-field', { kind: 'npc', id }, {});

const FIRST_NPC = 'npc-1';

function recordOf(decrees) {
  return {
    id: SAVE,
    name: 'Stoneford',
    tier: 'town',
    culture: 'germanic',
    npcs: [{ id: FIRST_NPC, name: 'Alda', role: 'Reeve', status: 'active', note: '' }],
    institutions: [],
    powerStructure: { governingName: 'Alda', factions: [] },
    config: { terrainType: 'plains', culture: 'germanic' },
    decrees,
  };
}

const registryOf = (rows) => rows.reduce(
  (acc, [id, op]) => stage(acc, op, { id, orderedAt: T0 }), [],
);

const storeState = {};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  useStore.setState = (recipe) => recipe(storeState);
  return { useStore };
});

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), paidAction: vi.fn() },
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));

const authSlice = createAuthSlice(() => {}, () => storeState);

function seatState(decrees, savedSettlements) {
  for (const key of Object.keys(storeState)) delete storeState[key];
  Object.assign(storeState, {
    auth: { tier: 'premium', role: STAFF_ROLES[0], user: { id: 'u1' } },
    userPrefs: { editorMode: 'plain' },
    settlement: recordOf(decrees),
    savedSettlements,
    activeSaveId: SAVE,
    lastSeed: SEED,
    phase: 'draft',
    canEditSettlement: authSlice.canEditSettlement,
    isElevated: () => false,
    setUserPref: () => {},
    advanceInFlight: [],
    campaignMutationLocks: [],
    getSettlementDeletionBlock: () => null,
    getCampaignMutationBlock: () => null,
    getCampaignMembershipBlock: () => null,
    setPurchaseModalOpen: () => {},
  });
}

async function mountShell() {
  const Shell = (await import('../../src/components/edit/EditModeShell.jsx')).default;
  return render(<Shell />);
}

const rowFor = (container, entryId) => container.querySelector(`[data-entry-id="${entryId}"]`);
const badgeIn = (container, entryId) => rowFor(container, entryId)
  .querySelector('[data-testid="decree-entry-reality"]');
const badgeWordIn = (container, entryId) => {
  const node = badgeIn(container, entryId);
  return node === null ? '' : node.getAttribute('data-badge');
};
const realityNodes = (container) => [...container.querySelectorAll('[data-testid="decree-entry-reality"]')];

afterEach(() => cleanup());
beforeEach(() => {
  seatState(
    registryOf([
      ['d_phantom', offStageAgainst(LOCAL_PHANTOM.id)],
      ['d_real', offStageAgainst(REAL_SAVE_ID)],
      ['d_home', homeAct(FIRST_NPC)],
    ]),
    [LOCAL_PHANTOM, REAL_SAVE],
  );
});

describe('EM-F1e — reality is shown in the registry (design §13)', () => {
  it('R1 the mounted page badges an off-stage decree PHANTOM or REAL out of the store own library', async () => {
    // THE FIXTURE IS THE CATALOGUE'S: `makeOp` copied the declaration, so these really are
    // the off-stage consequence the resolver answers for, and the home act really is not.
    expect(offStageAgainst(LOCAL_PHANTOM.id).consequence).toBe('by-target-reality');
    expect(homeAct(FIRST_NPC).consequence).toBe('home');

    const { container } = await mountShell();

    // The two off-stage entries wear DIFFERENT badges, each in the page's own words.
    expect(badgeWordIn(container, 'd_phantom')).toBe('PHANTOM');
    expect(badgeWordIn(container, 'd_real')).toBe('REAL');
    expect(badgeIn(container, 'd_phantom').textContent).toBe(COUNTERPARTY_BADGE_LABELS.PHANTOM);
    expect(badgeIn(container, 'd_real').textContent).toBe(COUNTERPARTY_BADGE_LABELS.REAL);
    // GUARD-THE-GUARD: the two answers really are two, so a resolver that answered one word
    // for everything could not satisfy the pair above.
    expect(badgeWordIn(container, 'd_phantom') === badgeWordIn(container, 'd_real')).toBe(false);

    // AND THE HOME ACT WEARS NONE, measured beside the two that do: exactly two of the three
    // entries carry a badge at all.
    expect(badgeIn(container, 'd_home')).toBe(null);
    expect(realityNodes(container).length).toBe(2);

    // A COUNTERPARTY THE LIBRARY DOES NOT HOLD IS NOT REAL. The same op against an id no save
    // row carries reads PHANTOM, which is the resolver's fail-closed clause seen from the page.
    cleanup();
    seatState(registryOf([['d_missing', offStageAgainst('save-nobody')]]), [LOCAL_PHANTOM, REAL_SAVE]);
    const missing = (await mountShell()).container;
    expect(badgeWordIn(missing, 'd_missing')).toBe('PHANTOM');
  });

  it('R2 a registry with no counterparty act renders exactly the page that was never told a reader', async () => {
    seatState(registryOf([['d_home', homeAct(FIRST_NPC)]]), [LOCAL_PHANTOM, REAL_SAVE]);
    const { container } = await mountShell();
    // Through the PRODUCT's binding, a page of ordinary decrees carries no badge at all.
    expect(realityNodes(container).length).toBe(0);

    // AND ITS MARKUP IS THE OLD ONE, BYTE FOR BYTE. The same props drawn by a page that is
    // handed no reader at all is what this page rendered before EM-F1e existed, so the two
    // markups are held equal rather than a copied literal being trusted to age well.
    const props = { saveId: SAVE, decrees: storeState.settlement.decrees };
    const told = render(<DecreeRegistryPage {...props} badgeFor={() => null} />).container.innerHTML;
    cleanup();
    const untold = render(<DecreeRegistryPage {...props} />).container.innerHTML;
    cleanup();
    expect(told).toBe(untold);

    // THE EQUALITY IS NOT VACUOUS: the same props with a reader that DOES answer move it.
    const answered = render(<DecreeRegistryPage {...props} badgeFor={() => 'PHANTOM'} />).container.innerHTML;
    expect(answered === untold).toBe(false);
    expect(answered.includes(COUNTERPARTY_BADGE_LABELS.PHANTOM)).toBe(true);

    // A WORD THE PAGE HAS NO LABEL FOR DRAWS NOTHING, so a resolver that learned a third
    // badge cannot put an unlabelled string in front of a DM.
    cleanup();
    const unknown = render(<DecreeRegistryPage {...props} badgeFor={() => 'SPECTRAL'} />).container.innerHTML;
    expect(unknown).toBe(untold);
  });

  it('R3 a counterparty stored under a server uuid resolves exactly as a local dm phantom id does', async () => {
    // EM-F3c's TWO KEYINGS, side by side. The local row is keyed by the record's own minted
    // `dm:phantom:` id; the cloud row is keyed by the server's uuid, which EM-F3c writes back
    // onto the record inside it. The ids really are the two different shapes.
    expect(LOCAL_PHANTOM.id.startsWith('dm:phantom:')).toBe(true);
    expect(CLOUD_PHANTOM.id).toBe(CLOUD_KEY);
    expect(String(CLOUD_PHANTOM.settlement.id)).toBe(CLOUD_PHANTOM.id);
    expect(LOCAL_PHANTOM.id === CLOUD_PHANTOM.id).toBe(false);

    seatState(
      registryOf([
        ['d_local', offStageAgainst(LOCAL_PHANTOM.id)],
        ['d_cloud', offStageAgainst(CLOUD_PHANTOM.id)],
        ['d_real', offStageAgainst(REAL_SAVE_ID)],
      ]),
      [LOCAL_PHANTOM, CLOUD_PHANTOM, REAL_SAVE],
    );
    const { container } = await mountShell();

    // ONE ANSWER FOR BOTH BACKENDS: the id the record holds is the row's key either way, so
    // the walk that finds one finds the other.
    expect(badgeWordIn(container, 'd_local')).toBe('PHANTOM');
    expect(badgeWordIn(container, 'd_cloud')).toBe('PHANTOM');
    // Measured beside a row that reads differently, so "both PHANTOM" is a reading and not a
    // constant this arm could not tell apart from a stuck resolver.
    expect(badgeWordIn(container, 'd_real')).toBe('REAL');
  });

  it('R4 the reading is BOUND at the mount and resolved in the store leaf, never imported by either component', async () => {
    // THE BINDING IS READ OFF THE SHELL'S SOURCE BY NAME: the mount hands the page the store
    // function's answer, so a mount that re-typed a badge word at this prop would be seen.
    expect(SHELL_SOURCE.includes('badgeFor={badgeForEntry}')).toBe(true);
    expect(SHELL_SOURCE.includes('counterpartyBadgeOf(saved, entry)')).toBe(true);
    const literalBadgesAtTheMount = [...SHELL_SOURCE.matchAll(/badgeFor=\{'(?:PHANTOM|REAL)'\}/g)];
    expect(literalBadgesAtTheMount).toEqual([]);
    expect([...`badgeFor={'PHANTOM'}`.matchAll(/badgeFor=\{'(?:PHANTOM|REAL)'\}/g)].length).toBe(1);

    // NEITHER COMPONENT REACHES THE PHANTOM LEAF. The shell's edge set and that leaf's
    // importer roster are pinned in their own suites (editShellPlusDoor D5, phantoms A12);
    // what is held here is the reason those stay green — the word is in neither source.
    const leafEdgesIn = (src) => [...src.matchAll(/from '[^']*domain\/edit\/phantoms\.js'/g)].map((hit) => hit[0]);
    expect(leafEdgesIn(SHELL_SOURCE)).toEqual([]);
    expect(leafEdgesIn(PAGE_SOURCE)).toEqual([]);
    expect(leafEdgesIn("import { badgeFor } from '../../domain/edit/phantoms.js';").length).toBe(1);

    // AND THE PAGE STILL NAMES NO STORE ADDRESS AT ALL.
    const storeWordsIn = (src) => ['src/store/', '../../store/'].filter((word) => src.includes(word));
    expect(storeWordsIn(PAGE_SOURCE)).toEqual([]);
    expect(storeWordsIn("import { x } from '../../store/editSlice.js';")).toEqual(['../../store/']);
  });
});
