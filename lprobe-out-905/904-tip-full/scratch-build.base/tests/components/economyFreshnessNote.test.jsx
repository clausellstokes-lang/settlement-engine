/** @vitest-environment jsdom */
/**
 * tests/components/economyFreshnessNote.test.jsx — the stale-window
 * declaration renders at every covered economy display site (atlas
 * economy-family gap 2, "no silent staleness" exit criterion).
 *
 * Wave R-3 shipped three hand-copied paragraphs (EconomicsTab, ServicesTab,
 * SummaryTab). Wave R-4 collapsed the sentence into
 * domain/display/economyFreshness.js and the paragraph into
 * components/new/EconomyFreshnessNote.jsx, then wired the three uncovered LIVE
 * surfaces the R-3 verification measured: SummaryTabV2 (the default summary
 * tab), TableView, and SessionMode. All six are pinned here.
 *
 * Pins:
 *   • Each covered surface shows its one-string freshness note (byte-pinned —
 *     the copy is the vetoable unit) when the settlement's reconciliationLog
 *     carries an economy-touching event since the last survey.
 *   • The five "tallies" surfaces render the IDENTICAL sentence bytes and the
 *     services catalog renders the one catalog wording: the pair is one
 *     vetoable copy decision, not six.
 *   • No surface shows the note on a fresh settlement (no trail) or when a
 *     'regenerate' boundary is newer than every event — the note is
 *     conditional, never ambient chrome.
 *   • Every covered surface renders BYTE-IDENTICALLY for a fresh settlement
 *     and for a rebuilt one (trail present, 'regenerate' newest): the detector
 *     must be invisible everywhere except the one conditional paragraph. Each
 *     equality carries its own negative control (the stale render differs), so
 *     none of them can pass vacuously on a note that never renders.
 *
 * The census walker tests/lint/economyReadModelCoverage.walker.test.js is the
 * structural half: it fails closed when a NEW economy reader lands unclassified.
 */
import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = { campaigns: [] };
  function useStore(selector) { return selector(data); }
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore, default: useStore };
});

// useIsMobile reads matchMedia; jsdom lacks it — pin the desktop answer.
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

// SessionMode mounts the constitutional faith seam, which is a whole premium
// surface of its own. This test is about the economy note, so the seam is
// stubbed to a marker: FaithSection's own gate has its own suites.
vi.mock('../../src/components/settlement/FaithSection.jsx', () => ({
  default: () => <div data-testid="faith-stub" />,
}));

import { EconomicsTab } from '../../src/components/new/tabs/EconomicsTab.jsx';
import { ServicesTab } from '../../src/components/new/tabs/ServicesTab.jsx';
import SummaryTab from '../../src/components/new/SummaryTab.jsx';
import SummaryTabV2 from '../../src/components/new/SummaryTabV2.jsx';
import TableView from '../../src/components/TableView.jsx';
import SessionMode from '../../src/components/session/SessionMode.jsx';
import { ECONOMY_FRESHNESS_SENTENCES } from '../../src/domain/display/economyFreshness.js';

const ECON_NOTE = /Events recorded after this settlement's last survey may not be fully counted in these tallies yet\./;
const SVC_NOTE = /Events recorded after this settlement's last survey may not be fully counted in this catalog yet\./;

function entry(source, changeType) {
  return { at: null, source, changeType, changeLabel: null, preservedWorldConditionIds: [] };
}

function makeSettlement(reconciliationLog) {
  return {
    id: 'test-settlement',
    tier: 'town',
    name: 'Pinvale',
    economicState: {
      prosperity: 'Modest',
      economicComplexity: 'Simple market town',
      activeChains: [],
      institutionalServices: [],
      tradeDependencies: [],
      customChains: [],
      incomeSources: [],
    },
    institutions: [],
    ...(reconciliationLog ? { reconciliationLog } : {}),
  };
}

const STALE_TRAIL = [entry('canon_event', 'ADD_INSTITUTION')];
const REBUILT_TRAIL = [entry('canon_event', 'ADD_INSTITUTION'), entry('regenerate', 'GENERATE_SETTLEMENT')];
const SERVICES = { general: [{ name: 'Blacksmithing', institution: 'Smithy' }] };

afterEach(cleanup);

describe('EconomicsTab freshness note', () => {
  it('shows the note when an economy event postdates the last survey', () => {
    render(<EconomicsTab settlement={makeSettlement(STALE_TRAIL)} narrativeNote={null} />);
    expect(screen.getByText(ECON_NOTE)).toBeTruthy();
  });

  it('hides the note on a fresh settlement and after a rebuild boundary', () => {
    const { unmount } = render(<EconomicsTab settlement={makeSettlement(null)} narrativeNote={null} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
    unmount();
    render(<EconomicsTab settlement={makeSettlement(REBUILT_TRAIL)} narrativeNote={null} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
  });
});

describe('ServicesTab freshness note', () => {
  it('shows the note when an economy event postdates the last survey', () => {
    render(<ServicesTab services={SERVICES} settlement={makeSettlement(STALE_TRAIL)} narrativeNote={null} />);
    expect(screen.getByText(SVC_NOTE)).toBeTruthy();
  });

  it('hides the note on a fresh settlement and after a rebuild boundary', () => {
    const { unmount } = render(<ServicesTab services={SERVICES} settlement={makeSettlement(null)} narrativeNote={null} />);
    expect(screen.queryByText(SVC_NOTE)).toBeNull();
    unmount();
    render(<ServicesTab services={SERVICES} settlement={makeSettlement(REBUILT_TRAIL)} narrativeNote={null} />);
    expect(screen.queryByText(SVC_NOTE)).toBeNull();
  });
});

// SummaryTab (the legacy single-column summary, rendered when
// flag('summaryMagazineV2') is off) shows prosperity in its Economy situation
// tile — the same stale read-model EconomicsTab tallies, so it carries the
// same note. Wave R-3 Lane C must-fix.
describe('SummaryTab freshness note', () => {
  it('shows the note when an economy event postdates the last survey', () => {
    render(<SummaryTab settlement={makeSettlement(STALE_TRAIL)} />);
    expect(screen.getByText(ECON_NOTE)).toBeTruthy();
  });

  it('hides the note on a fresh settlement and after a rebuild boundary', () => {
    const { unmount } = render(<SummaryTab settlement={makeSettlement(null)} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
    unmount();
    render(<SummaryTab settlement={makeSettlement(REBUILT_TRAIL)} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
  });

  // The detector must be invisible in the un-shifted world: a rebuilt
  // settlement renders byte-for-byte what a never-touched one renders.
  it('renders byte-identically for a fresh and a rebuilt settlement', () => {
    const fresh = render(<SummaryTab settlement={makeSettlement(null)} />);
    const freshHtml = fresh.container.innerHTML;
    fresh.unmount();
    const rebuilt = render(<SummaryTab settlement={makeSettlement(REBUILT_TRAIL)} />);
    expect(rebuilt.container.innerHTML).toBe(freshHtml);
    // Negative control: the stale render is NOT byte-identical — otherwise the
    // equality above would pass vacuously on a note that never renders.
    rebuilt.unmount();
    const stale = render(<SummaryTab settlement={makeSettlement(STALE_TRAIL)} />);
    expect(stale.container.innerHTML).not.toBe(freshHtml);
  });

  // The two tally surfaces are ONE copy decision: if someone re-words either
  // sentence without the other, this reds.
  it('uses the same sentence EconomicsTab uses', () => {
    const econ = render(<EconomicsTab settlement={makeSettlement(STALE_TRAIL)} narrativeNote={null} />);
    const econText = screen.getByText(ECON_NOTE).textContent;
    econ.unmount();
    render(<SummaryTab settlement={makeSettlement(STALE_TRAIL)} />);
    expect(screen.getByText(ECON_NOTE).textContent).toBe(econText);
  });
});

// ── Wave R-4: the three LIVE surfaces R-3's verification measured uncovered ──
// Each renders composeMaterialTruth's "How it lives" fact — the same
// generation-time economicState fold EconomicsTab tallies — and each ships
// flag-TRUE (summaryMagazineV2 / tableView / sessionMode in lib/flagRegistry.js).

describe('SummaryTabV2 freshness note (the DEFAULT summary tab)', () => {
  it('shows the note when an economy event postdates the last survey', () => {
    render(<SummaryTabV2 settlement={makeSettlement(STALE_TRAIL)} />);
    expect(screen.getByText(ECON_NOTE)).toBeTruthy();
  });

  it('hides the note on a fresh settlement and after a rebuild boundary', () => {
    const { unmount } = render(<SummaryTabV2 settlement={makeSettlement(null)} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
    unmount();
    render(<SummaryTabV2 settlement={makeSettlement(REBUILT_TRAIL)} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
  });

  it('renders byte-identically for a fresh and a rebuilt settlement', () => {
    const fresh = render(<SummaryTabV2 settlement={makeSettlement(null)} />);
    const freshHtml = fresh.container.innerHTML;
    fresh.unmount();
    const rebuilt = render(<SummaryTabV2 settlement={makeSettlement(REBUILT_TRAIL)} />);
    expect(rebuilt.container.innerHTML).toBe(freshHtml);
    rebuilt.unmount();
    const stale = render(<SummaryTabV2 settlement={makeSettlement(STALE_TRAIL)} />);
    expect(stale.container.innerHTML).not.toBe(freshHtml);
  });
});

describe('TableView freshness note (LIVE: flagRegistry ships tableView true)', () => {
  const noop = () => {};

  it('shows the note when an economy event postdates the last survey', () => {
    render(<TableView settlement={makeSettlement(STALE_TRAIL)} onClose={noop} />);
    expect(screen.getByText(ECON_NOTE)).toBeTruthy();
  });

  it('hides the note on a fresh settlement and after a rebuild boundary', () => {
    const { unmount } = render(<TableView settlement={makeSettlement(null)} onClose={noop} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
    unmount();
    render(<TableView settlement={makeSettlement(REBUILT_TRAIL)} onClose={noop} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
  });

  it('renders byte-identically for a fresh and a rebuilt settlement', () => {
    const fresh = render(<TableView settlement={makeSettlement(null)} onClose={noop} />);
    const freshHtml = fresh.container.innerHTML;
    fresh.unmount();
    const rebuilt = render(<TableView settlement={makeSettlement(REBUILT_TRAIL)} onClose={noop} />);
    expect(rebuilt.container.innerHTML).toBe(freshHtml);
    rebuilt.unmount();
    const stale = render(<TableView settlement={makeSettlement(STALE_TRAIL)} onClose={noop} />);
    expect(stale.container.innerHTML).not.toBe(freshHtml);
  });
});

describe('SessionMode freshness note (the wired JUDGMENT, vetoable)', () => {
  const noop = () => {};

  it('shows the note when an economy event postdates the last survey', () => {
    render(<SessionMode settlement={makeSettlement(STALE_TRAIL)} onClose={noop} />);
    expect(screen.getByText(ECON_NOTE)).toBeTruthy();
  });

  it('hides the note on a fresh settlement and after a rebuild boundary', () => {
    const { unmount } = render(<SessionMode settlement={makeSettlement(null)} onClose={noop} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
    unmount();
    render(<SessionMode settlement={makeSettlement(REBUILT_TRAIL)} onClose={noop} />);
    expect(screen.queryByText(ECON_NOTE)).toBeNull();
  });

  it('renders byte-identically for a fresh and a rebuilt settlement', () => {
    const fresh = render(<SessionMode settlement={makeSettlement(null)} onClose={noop} />);
    const freshHtml = fresh.container.innerHTML;
    fresh.unmount();
    const rebuilt = render(<SessionMode settlement={makeSettlement(REBUILT_TRAIL)} onClose={noop} />);
    expect(rebuilt.container.innerHTML).toBe(freshHtml);
    rebuilt.unmount();
    const stale = render(<SessionMode settlement={makeSettlement(STALE_TRAIL)} onClose={noop} />);
    expect(stale.container.innerHTML).not.toBe(freshHtml);
  });
});

// ── ONE copy decision across six surfaces ────────────────────────────────────
// The R-4 point of the shared leaf: re-word the sentence once and every surface
// moves together. If anyone re-introduces a hand-copy that drifts, this reds.
describe('the sentence is ONE vetoable copy unit across every covered surface', () => {
  const noop = () => {};

  it('all five tally surfaces render the identical sentence bytes', () => {
    const texts = [];
    for (const node of [
      <EconomicsTab key="e" settlement={makeSettlement(STALE_TRAIL)} narrativeNote={null} />,
      <SummaryTab key="s" settlement={makeSettlement(STALE_TRAIL)} />,
      <SummaryTabV2 key="v" settlement={makeSettlement(STALE_TRAIL)} />,
      <TableView key="t" settlement={makeSettlement(STALE_TRAIL)} onClose={noop} />,
      <SessionMode key="m" settlement={makeSettlement(STALE_TRAIL)} onClose={noop} />,
    ]) {
      const view = render(node);
      texts.push(screen.getByText(ECON_NOTE).textContent);
      view.unmount();
    }
    expect(new Set(texts).size, `surfaces disagree on the sentence: ${JSON.stringify(texts)}`).toBe(1);
    expect(texts[0]).toBe(ECONOMY_FRESHNESS_SENTENCES.tallies);
  });

  it('the services catalog renders the one catalog wording', () => {
    render(<ServicesTab services={SERVICES} settlement={makeSettlement(STALE_TRAIL)} narrativeNote={null} />);
    expect(screen.getByText(SVC_NOTE).textContent).toBe(ECONOMY_FRESHNESS_SENTENCES.catalog);
  });
});
