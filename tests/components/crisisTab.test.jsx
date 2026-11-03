/** @vitest-environment jsdom */
/**
 * tests/components/crisisTab.test.jsx — the Crisis tab (docs/DESIGN_CRISIS_TAB.md; the owner,
 * 2026-11-03: "the tab only appears when there is a crises and it should be black background with
 * red bold coloring (the tab) similar to criminal institutions and services").
 *
 *   1. PRESENCE: the tab is registered in the Summary strip beside the Overview only while a crisis
 *      is active, on both strips (desktop and phone), wearing the crisis tone; a crisis-free
 *      settlement renders neither; a player view never does (the cast is the DM's).
 *   2. THE PAGE: one section per crisis, worst first, the design's sections in it.
 *   3. TRUST THE DM: the cast is edited here, on the crisis entry (X-45's idiom), ✎ YOU where the DM
 *      spoke, "As the engine has it" reverts.
 *   4. ONE HOME: the Overview's crisis block is a one-line pointer to the tab.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  storeState: {
    settlement: null, savedSettlements: [], userPrefs: {}, editMode: false, auth: { tier: 'free', user: null },
    applyUserEditAction: () => {}, revertUserEditAction: () => {},
  },
}));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.storeState);
  useStore.getState = () => mocks.storeState;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/components/new/tabs/OverviewTab', () => ({ default: () => <div data-testid="overview-stub" /> }));

import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { TAB_CRISIS_MARK } from '../../src/components/new/tabs/tabPalette.js';
import { CAST_EDIT_PATH, CAST_REASONS } from '../../src/domain/crisis/crisisCast.js';
import { CRISIS_PAGE_COPY } from '../../src/domain/crisis/crisisPage.js';

function installMatchMedia(matches) {
  window.matchMedia = vi.fn((query) => ({ media: query, matches, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} }));
}
async function loadOutput() {
  vi.resetModules();
  return (await import('../../src/components/OutputContainer.jsx')).default;
}

const crisisTown = () => generateSettlementPipeline({ settType: 'town', stressTypes: ['famine', 'under_siege'] }, null, { seed: 'crisis-tab-pair', customContent: {} });
const calmTown = () => generateSettlementPipeline({ settType: 'village', selectedStressesRandom: false, selectedStresses: [] }, null, { seed: 'crisis-tab-calm', customContent: {} });

afterEach(() => { cleanup(); mocks.storeState.editMode = false; });

describe('the Crisis tab is present only in a crisis', () => {
  const presenceAt = async (mobile) => {
    installMatchMedia(mobile);
    const OutputContainer = await loadOutput();
    const { container, unmount } = render(<OutputContainer settlement={crisisTown()} />);
    const tab = await screen.findByRole('tab', { name: /Crisis/ });
    expect(tab.getAttribute('data-tone')).toBe('crisis');
    const ids = [...container.querySelectorAll('[role="tab"]')].map((t) => t.id);
    expect(ids.indexOf('sf-tab-crisis')).toBe(ids.indexOf('sf-tab-overview') + 1);
    unmount();

    const calm = calmTown();
    expect(calm.stress).toBeNull();
    const second = render(<OutputContainer settlement={calm} />);
    await screen.findByRole('tab', { name: /Overview/ });
    expect(second.container.querySelector('#sf-tab-crisis')).toBeNull(); // anchored: the Overview tab is found in this same strip
  };
  test('desktop: a crisis town carries the Crisis tab beside the Overview, in the crisis tone; a calm town carries none', () => presenceAt(false));
  test('phone: a crisis town carries the Crisis tab beside the Overview, in the crisis tone; a calm town carries none', () => presenceAt(true));

  test('a player view never carries the Crisis tab, crisis or not', async () => {
    installMatchMedia(false);
    const OutputContainer = await loadOutput();
    const { container } = render(<OutputContainer settlement={crisisTown()} playerView readOnly />);
    await screen.findByRole('tab', { name: /Overview/ });
    expect(container.querySelector('#sf-tab-crisis')).toBeNull(); // anchored: the strip rendered its Overview tab
  });
});

describe('the Crisis page', () => {
  test('one section per crisis, worst first: the event, the cast with reasons, the stakes, the levers, what is seen first, the escalation', async () => {
    installMatchMedia(false);
    vi.resetModules();
    const CrisisTab = (await import('../../src/components/new/tabs/CrisisTab.jsx')).default;
    const s = crisisTown();
    const entries = [...s.stress].sort((a, b) => a.cast.rank - b.cast.rank);
    render(<CrisisTab settlement={s} />);
    const sections = screen.getAllByTestId('crisis-section');
    expect(sections.map((x) => x.getAttribute('data-crisis'))).toEqual(entries.map((e) => e.type));
    sections.forEach((section, i) => {
      const entry = entries[i];
      const q = within(section);
      expect(q.getByTestId('crisis-event').textContent.startsWith(entry.label)).toBe(true);
      const rows = q.queryAllByTestId('crisis-cast-row');
      expect(rows.map((r) => r.getAttribute('data-role'))).toEqual(entry.cast.roles.map((r) => r.role));
      entry.cast.roles.forEach((r, j) => { expect(rows[j].textContent).toContain(r.name); expect(rows[j].textContent).toContain(r.reason); });
      expect(q.queryAllByTestId('crisis-stake').length).toBe(entry.cast.stakes.length);
      expect(q.queryAllByTestId('crisis-lever').length).toBe(entry.cast.levers.length);
      expect(q.getAllByTestId('crisis-see-first').length).toBeGreaterThan(0);
      expect(q.getByTestId('crisis-if-nothing').textContent).toBe(entry.viabilityNote);
    });
    expect(screen.getByTestId('crisis-tab').style.background).toBe(hexToRgb(TAB_CRISIS_MARK.ground));
  });
});

describe('the cast is the DM\'s to edit, here alone', () => {
  test('reassigning a role writes the cast as one line on the crisis entry', async () => {
    installMatchMedia(false);
    vi.resetModules();
    const apply = vi.fn();
    mocks.storeState.editMode = true;
    mocks.storeState.applyUserEditAction = apply;
    const CrisisTab = (await import('../../src/components/new/tabs/CrisisTab.jsx')).default;
    const s = crisisTown();
    const first = [...s.stress].sort((a, b) => a.cast.rank - b.cast.rank)[0];
    const index = s.stress.indexOf(first);
    const npcRow = first.cast.roles.findIndex((r) => r.kind === 'npc');
    expect(npcRow).toBeGreaterThanOrEqual(0);
    const other = s.npcs.find((n) => n.name && !n.ousted && n.id !== first.cast.roles[npcRow].id);
    render(<CrisisTab settlement={s} canAuthor />);
    const section = screen.getAllByTestId('crisis-section')[0];
    fireEvent.click(within(section).getByRole('button', { name: /Edit who/ }));
    const selects = within(section).getAllByRole('combobox');
    fireEvent.change(selects[first.cast.roles.slice(0, npcRow).filter((r) => r.kind === 'npc').length], { target: { value: other.id } });
    fireEvent.click(within(section).getByRole('button', { name: /^Done/ }));
    expect(apply).toHaveBeenCalledTimes(1);
    const [kind, at, path, line] = apply.mock.calls[0];
    expect([kind, at, path]).toEqual(['crisis', index, CAST_EDIT_PATH]);
    expect(line).toContain(`${first.cast.roles[npcRow].role}=npc:${other.id}`);
  });

  test('an edited cast wears ✎ YOU and the DM\'s reason; "As the engine has it" reverts', async () => {
    installMatchMedia(false);
    vi.resetModules();
    const revert = vi.fn();
    mocks.storeState.editMode = true;
    mocks.storeState.revertUserEditAction = revert;
    const CrisisTab = (await import('../../src/components/new/tabs/CrisisTab.jsx')).default;
    const s = crisisTown();
    const first = [...s.stress].sort((a, b) => a.cast.rank - b.cast.rank)[0];
    const who = s.npcs.find((n) => n.name && !n.ousted);
    first._userEdits = { [CAST_EDIT_PATH]: { value: `exploiter=npc:${who.id}`, editedAt: '2026-11-03T00:00:00Z' } };
    render(<CrisisTab settlement={s} canAuthor />);
    const section = screen.getAllByTestId('crisis-section')[0];
    expect(within(section).getByTestId('crisis-cast-authored').textContent).toBe(CRISIS_PAGE_COPY.edited);
    const rows = within(section).getAllByTestId('crisis-cast-row');
    expect(rows.map((r) => r.textContent)).toEqual([expect.stringContaining(who.name)]);
    expect(rows[0].textContent).toContain(CAST_REASONS.dm);
    fireEvent.click(within(section).getByRole('button', { name: /Edit who/ }));
    fireEvent.click(within(section).getByRole('button', { name: CRISIS_PAGE_COPY.revert }));
    expect(revert).toHaveBeenCalledWith('crisis', s.stress.indexOf(first), CAST_EDIT_PATH);
  });
});

describe('the Overview points at the Crisis tab (one home)', () => {
  test('the DM\'s Overview prints one pointer line and no crisis card; a player\'s keeps the record\'s summary', async () => {
    installMatchMedia(false);
    vi.resetModules();
    vi.doUnmock('../../src/components/new/tabs/OverviewTab');
    const { OverviewTab } = await import('../../src/components/new/tabs/OverviewTab.jsx');
    const s = crisisTown();
    const nav = vi.fn();
    const dm = render(<OverviewTab settlement={s} narrativeNote={null} onNavigateTab={nav} />);
    const pointer = dm.getByTestId('overview-crisis-pointer');
    for (const e of s.stress) expect(pointer.textContent).toContain(e.label);
    expect(dm.container.textContent).toContain('Active crisis');
    expect(dm.container.textContent).not.toContain(s.stress[0].summary); // anchored: the pointer names this crisis above
    fireEvent.click(within(pointer).getByRole('button', { name: CRISIS_PAGE_COPY.pointer }));
    expect(nav).toHaveBeenCalledWith('crisis');
    dm.unmount();
    const player = render(<OverviewTab settlement={s} narrativeNote={null} onNavigateTab={nav} playerView />);
    expect(player.container.textContent).toContain(s.stress[0].summary);
    expect(within(player.getByTestId('overview-crisis-pointer')).queryByRole('button')).toBeNull(); // anchored: the pointer itself is found
  });
});

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
}
