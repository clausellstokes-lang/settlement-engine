/** @vitest-environment jsdom */
/**
 * traditionsTab.test.jsx — THE TRADITIONS wave (T-1). The dossier tab renders in
 * PREVIEW mode for a draft settlement (no engine mirror): it labels the register
 * "founding traditions", lists the derived observances by name with their window
 * phrase, and (consolidation chair, 2026-10-30) prints NO owner/last-outcome row, no
 * epithet and no footer: ownership and outcomes exist only where time exists.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import TraditionsTab from '../../src/components/new/tabs/TraditionsTab.jsx';
import { deriveFoundingTraditions, describeTraditionWindow } from '../../src/domain/traditions/genesis.js';

afterEach(cleanup);

const DRAFT = {
  name: 'Briarwatch',
  _seed: 'tab-preview-1',
  tier: 'city',
  population: 14000,
  config: { culture: 'germanic', terrainType: 'riverside', tradeRouteAccess: 'river' },
};

describe('TraditionsTab — preview mode (draft settlement)', () => {
  it('renders the founding-traditions register with each derived tradition', () => {
    const expected = deriveFoundingTraditions(DRAFT);
    expect(expected.length).toBeGreaterThan(0);

    render(<TraditionsTab settlement={DRAFT} />);

    // the register surface + the preview voice (textContent is robust to the
    // mixed-content intro paragraph's text-node splitting)
    const container = screen.getByTestId('traditions-tab');
    expect(container.textContent).toMatch(/founding traditions/i);
    expect(container.textContent).toMatch(/Briarwatch/);

    // every derived tradition renders by name, with its window phrase
    for (const rec of expected) {
      expect(screen.getByText(rec.name)).toBeTruthy();
      const phrase = describeTraditionWindow(rec.window);
      expect(screen.getAllByText(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))).length).toBeGreaterThan(0);
    }

    // preview: no owner/outcome placeholders, no epithet, no footer, and the intro is its
    // first clause (chair rulings T1-T3, 2026-10-30).
    const text = container.textContent;
    const anchor = expected[0].name;
    expectAbsentWithAnchor(text, 'Owner:', anchor, 'preview owner placeholder');
    expectAbsentWithAnchor(text, 'Last held:', anchor, 'preview outcome placeholder');
    expectAbsentWithAnchor(text, 'In a living campaign they gain owners', anchor, 'T3 footer');
    expectAbsentWithAnchor(text, 'Ownership and outcomes come once the world turns.', anchor, 'T1 second clause');
    for (const rec of expected) {
      if (rec.expression?.epithet) expectAbsentWithAnchor(text, rec.expression.epithet, anchor, 'preview epithet');
    }
    expect(text).toMatch(/The founding traditions of Briarwatch\./);
  });

  it('the motif chip names the element; the act already ends the generated name', () => {
    const expected = deriveFoundingTraditions(DRAFT);
    render(<TraditionsTab settlement={DRAFT} />);
    const text = screen.getByTestId('traditions-tab').textContent;
    for (const rec of expected) {
      const act = String(rec.coreMotif?.act || '');
      // Generated names carry the act (measured 3074/3074 in the 1000-town sample).
      expect(rec.name.toLowerCase()).toContain(act.split('-').join(' ').toLowerCase());
      expectAbsentWithAnchor(text, ` · ${act.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ')}`, rec.name, 'the act half of the chip');
    }
  });

  it('renders an empty-state for a null settlement without throwing', () => {
    render(<TraditionsTab settlement={null} />);
    expect(screen.getByTestId('traditions-tab')).toBeTruthy();
    expect(screen.getByText(/No traditions are recorded/i)).toBeTruthy();
  });

  it('renders the engine mirror verbatim when present (forward-compat for T-2)', () => {
    const mirror = [{
      id: 'tradition.x.0', name: 'The Long Watch', coreMotif: { element: 'stars', act: 'vigil' },
      window: { startWeekOfYear: 40, weeks: 1 }, scaleBand: 4, ownerKey: 'fac.the_watch',
      ownerLabel: 'The Watch', deityRef: null, expression: { trappings: [], epithet: '' },
      mutationLog: [{ year: 12, kind: 'scale-up', cause: 'the town grew' }],
      lastHeldYear: 14, lastOutcome: 'triumph', suppressedBy: null, adoptedFrom: null,
    }];
    render(<TraditionsTab settlement={{ name: 'Karth', traditions: mirror }} />);
    expect(screen.getByText('The Long Watch')).toBeTruthy();
    expect(screen.getByText(/Owner: The Watch/)).toBeTruthy();
    expect(screen.getByText(/a triumph/)).toBeTruthy();
    expect(screen.getByText(/1 change recorded/)).toBeTruthy();
    // T-5 register polish: the motif glyph renders (stars ⇒ ✦).
    expect(screen.getByText('✦')).toBeTruthy();
  });

  it('renders the mutationLog as a provenance trail of its recent causes (T-5)', () => {
    const mirror = [{
      id: 'tradition.x.0', name: 'The Founders’ Feast', coreMotif: { element: 'founding', act: 'feast' },
      window: { startWeekOfYear: 4, weeks: 1 }, scaleBand: 4, ownerKey: 'seat',
      ownerLabel: 'The Council', deityRef: null, expression: { trappings: [], epithet: '' },
      mutationLog: [
        { year: 40, kind: 'scale-up', cause: 'the town outgrew the old scale' },
        { year: 71, kind: 'reassignment', cause: 'the seat changed hands by coup' },
        { year: 96, kind: 'restoration', cause: 'the occupation ended; the old rite returned' },
      ],
      lastHeldYear: 96, lastOutcome: 'good', suppressedBy: null, adoptedFrom: null,
    }];
    render(<TraditionsTab settlement={{ name: 'Karth', traditions: mirror }} />);
    const container = screen.getByTestId('traditions-tab');
    // the count + the trail of causes (most recent last)
    expect(container.textContent).toMatch(/3 changes recorded/);
    expect(container.textContent).toMatch(/the town outgrew the old scale/);
    expect(container.textContent).toMatch(/the occupation ended; the old rite returned/);
    // the motif glyph for a founding rite (⌂)
    expect(screen.getByText('⌂')).toBeTruthy();
  });
});
