/**
 * @vitest-environment jsdom
 *
 * The saved-item card — the half of the authoring manager that runs AFTER a
 * definition is written (CustomContent.jsx, the `filtered.map(...)` block).
 *
 * Its leaf parts are covered in isolation by
 * tests/components/customContentPresentationTranslation.test.jsx, and the
 * authoring form by tests/components/customContentManualTasteGate.test.jsx. What
 * was never covered is the seam between them: every other manager test renders
 * an EMPTY `customContent` bucket, so `filtered` is empty and the card never
 * mounts. Nothing proved the manager reaches the card at all, let alone hands it
 * the right props.
 *
 * Two props are load-bearing and only observable here:
 *   - `bucket={activeCat}` on CustomItemAttributes — enum labels are resolved
 *     PER BUCKET, so a wrong bucket degrades every chip to "Unrecognized
 *     setting" rather than throwing. Each fixture therefore carries at least one
 *     attribute its own bucket alone admits.
 *   - `deps={catDef.dependencies}` on DependencySummary — the category's
 *     dependency contract, resolved through the REAL registry against the real
 *     store content. Dependencies.jsx is deliberately not mocked; mocking it is
 *     what hid this seam.
 */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { storeState } = vi.hoisted(() => {
  // A small interlinked library: the institution under inspection, the two
  // items it points AT (forward dependency rows) plus one ref whose target was
  // deleted (the dangling-link warning), and the items that point BACK at it
  // (the derived reverse links — never stored, always recomputed).
  const observatory = {
    id: 'inst_astral_observatory',
    localUid: 'local_astral_observatory',
    definitionId: 'def_astral_observatory',
    revisionId: 'rev_astral_observatory_2',
    name: 'Astral Observatory',
    category: 'knowledge',
    description: 'A basalt drum where star-readers chart the drift of the northern lights.',
    tags: 'astronomy, scholarly',
    authority: 'arcane',
    economicWeight: 'backbone',
    magical: true,
    tierMin: 'town',
    tierMax: 'metropolis',
    produces: ['custom:local_ground_lensware'],
    requires: ['custom:local_starglass_seam', 'custom:local_demolished_kiln'],
  };
  const groundLensware = {
    id: 'good_ground_lensware',
    localUid: 'local_ground_lensware',
    name: 'Ground Lensware',
  };
  const starglassSeam = {
    id: 'res_starglass_seam',
    localUid: 'local_starglass_seam',
    name: 'Starglass Seam',
  };
  // Points AT the observatory: a service it provides, a faction that controls
  // it. Neither stores a back-reference; both surface on the observatory's card.
  const starCharting = {
    id: 'svc_star_charting',
    localUid: 'local_star_charting',
    name: 'Star-Charting Commission',
    providedBy: 'custom:local_astral_observatory',
  };
  const lamplighters = {
    id: 'fac_lamplighters',
    localUid: 'local_lamplighters',
    definitionId: 'def_lamplighters',
    name: 'The Lamplighter Compact',
    description: 'Night-wardens who trade in kept secrets and lit streets.',
    archetype: 'Night guild',
    authority: 'civic',
    scale: 'significant',
    criminal: true,
    agenda: 'Hold the night-watch contract for another generation.',
    methods: 'Patronage first, quiet leverage when patronage is refused.',
    controls: ['custom:local_astral_observatory'],
  };
  // Sources the faction card's reverse link ("Rival of"). Its own card is not
  // asserted: reverse links read `other.name` directly, but a forward
  // faction→faction ref has no registry category to resolve against.
  const ashenQuorum = {
    id: 'fac_ashen_quorum',
    localUid: 'local_ashen_quorum',
    definitionId: 'def_ashen_quorum',
    name: 'The Ashen Quorum',
    rivals: ['custom:local_lamplighters'],
  };

  return {
    storeState: {
      customContent: {
        institutions: [observatory],
        services: [starCharting],
        resources: [starglassSeam],
        stressors: [],
        tradeGoods: [groundLensware],
        deities: [],
        traditions: [],
        factions: [lamplighters, ashenQuorum],
        supplyChains: [],
      },
      applyCustomContentCommand: vi.fn(),
      canUseCustomContent: () => true,
      auth: { tier: 'premium', user: { id: 'saved-card-author' } },
      customContentLoading: false,
      customContentError: null,
      loadCustomContentFromCloud: vi.fn(),
      // Read by the card's usage echo — no history, so the echo reports the
      // definition as not yet materialized.
      savedSettlements: [],
      campaigns: [],
      // Read by the card's version-history control (collapsed until clicked).
      listCustomContentRevisions: vi.fn(),
      rollbackCustomItem: vi.fn(),
    },
  };
});

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});
// Panels that sit ABOVE the list. Stubbed so the pin isolates the card itself;
// the card's own children (attributes, dependencies, usage echo, version
// history) are all real.
vi.mock('../../src/components/compendium/ContentPackBar.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/compendium/SupplyChainsManager.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/compendium/PantheonActivationStrip.jsx', () => ({
  default: () => null,
}));
vi.mock(
  '../../src/components/contentStudio/ContentEnvironmentLifecycle.jsx',
  () => ({ default: () => null }),
);
vi.mock(
  '../../src/components/contentStudio/CampaignContentBindingLifecycle.jsx',
  () => ({ default: () => null }),
);
vi.mock(
  '../../src/components/contentStudio/CustomContentLifecycle.jsx',
  async (importOriginal) => ({
    ...(await importOriginal()),
    ArchivedContentLibrary: () => null,
  }),
);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/** The card element for a saved item — the usage echo's parent. */
function cardFor(name) {
  const card = screen
    .getAllByTestId('custom-content-usage-echo')
    .map(echo => echo.parentElement)
    .find(element => element.textContent.includes(name));
  expect(card, `no saved-item card rendered for ${name}`).toBeTruthy();
  return card;
}

describe('CustomContentManager — the saved-item card', () => {
  it('renders a saved institution with its attributes, dependencies, and reverse links', async () => {
    const { CustomContentManager } = await import(
      '../../src/components/compendium/CustomContent.jsx'
    );
    render(<CustomContentManager search="" />);

    const card = cardFor('Astral Observatory');

    // Identity and the author's own words.
    expect(within(card).getByText('Astral Observatory')).toBeTruthy();
    expect(card.textContent).toContain(
      'A basalt drum where star-readers chart the drift of the northern lights.',
    );
    expect(within(card).getByText('Custom')).toBeTruthy();
    expect(within(card).getByText('knowledge')).toBeTruthy();
    expect(within(card).getByText('astronomy')).toBeTruthy();
    expect(within(card).getByText('scholarly')).toBeTruthy();
    expect(within(card).getByRole('button', { name: /edit item/i })).toBeTruthy();
    expect(within(card).getByRole('button', { name: /archive item/i })).toBeTruthy();

    // Attributes, translated. `economicWeight` and `tierMax` are admitted by
    // the institutions manifest and no other bucket here, so these labels only
    // resolve if the active bucket reached CustomItemAttributes.
    expect(card.textContent).toContain('Authority · Arcane authority');
    expect(card.textContent).toContain('Backbone of the economy');
    expect(card.textContent).toContain('Tiers · Town–Metropolis');
    expect(within(card).getByText('Magical')).toBeTruthy();
    expect(card.textContent).not.toContain('Unrecognized setting');

    // Forward dependency rows, resolved through the real registry: one row per
    // populated dependency field of the institutions category.
    expect(
      within(card).getByText('Produces').parentElement.textContent,
    ).toContain('Ground Lensware');
    const requires = within(card).getByText('Requires').parentElement;
    expect(requires.textContent).toContain('Starglass Seam');
    expect(requires.textContent).toContain('Deleted custom item');
    // `subsumes` was never authored, so it contributes no row.
    expect(within(card).queryByText('Subsumes')).toBeNull();
    // The dangling ref is explained in words, never as a raw id.
    expect(card.textContent).toContain('1 linked item could not be found.');
    expect(card.textContent).not.toContain('custom:local_demolished_kiln');

    // Reverse links — derived from other custom items pointing at this one,
    // grouped under the inverse verb. Nothing stores these.
    expect(card.textContent).toContain(
      'Auto-linked from your other custom content',
    );
    expect(
      within(card).getByText('Provides').parentElement.textContent,
    ).toContain('Star-Charting Commission');
    expect(
      within(card).getByText('Controlled by').parentElement.textContent,
    ).toContain('The Lamplighter Compact');

    // The usage echo and version-history control mount for the saved item.
    expect(card.textContent).toContain('Eligible in town–metropolis');
    expect(
      within(card).getByRole('button', {
        name: /version history for astral observatory/i,
      }),
    ).toBeTruthy();
  });

  it('renders a saved faction with its prose attributes and cross-bucket links', async () => {
    const { CustomContentManager } = await import(
      '../../src/components/compendium/CustomContent.jsx'
    );
    render(<CustomContentManager search="" />);

    fireEvent.click(screen.getByRole('button', {
      name: /Factions/,
      pressed: false,
    }));

    const card = cardFor('The Lamplighter Compact');

    expect(within(card).getByText('The Lamplighter Compact')).toBeTruthy();
    expect(card.textContent).toContain(
      'Night-wardens who trade in kept secrets and lit streets.',
    );

    // `scale` is a factions-only field: reading it as "Significant" rather than
    // "Unrecognized setting" is what proves the switched bucket reached the card.
    expect(card.textContent).toContain('Scale · Significant');
    expect(card.textContent).toContain('Archetype · Night guild');
    expect(card.textContent).toContain('Authority · Civic / legal authority');
    expect(within(card).getByText('Criminal')).toBeTruthy();
    expect(card.textContent).not.toContain('Unrecognized setting');

    // The two free-text faction fields render as labelled prose, not chips.
    expect(card.textContent).toContain('Agenda');
    expect(card.textContent).toContain(
      'Hold the night-watch contract for another generation.',
    );
    expect(card.textContent).toContain('Methods');
    expect(card.textContent).toContain(
      'Patronage first, quiet leverage when patronage is refused.',
    );

    // A faction's dependency contract differs from an institution's: it names
    // the institutions it controls, and inherits its rivals' pointers back.
    expect(
      within(card).getByText('Controls institutions').parentElement.textContent,
    ).toContain('Astral Observatory');
    expect(card.textContent).toContain(
      'Auto-linked from your other custom content',
    );
    expect(
      within(card).getByText('Rival of').parentElement.textContent,
    ).toContain('The Ashen Quorum');
  });
});
