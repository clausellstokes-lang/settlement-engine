/**
 * @vitest-environment jsdom
 *
 * exportSheetStrandedPick.test.jsx — pdf-export-2.
 *
 * ExportSheet is ALWAYS-MOUNTED (SettlementDetail keeps it in the tree). A
 * canon-only variant picked in canon, then dropped to draft (uncanonize),
 * survives in `picked` and used to export a GUTTED document — the exact hole
 * pdf-5's disable fix targeted. The effectivePicked guard (mirroring
 * effectiveFormat) must fall the CTA back to the phase's suggested variant.
 *
 * The stranded case is reachable without driving the picker: suggestVariant
 * ('canon', >=4 events) = 'timeline_packet' (a CANON_ONLY variant), so `picked`
 * initializes canon-only; flipping the store phase to 'draft' strands it.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

const storeState = {
  phase: 'canon',
  eventLog: [{}, {}, {}, {}, {}], // >=4 ⇒ suggestVariant → timeline_packet (canon-only)
  aiSettlement: null,
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

const { default: ExportSheet } = await import('../../src/components/settlement/ExportSheet.jsx');

afterEach(cleanup);

describe('ExportSheet — the stranded canon-only pick (pdf-export-2)', () => {
  it('a canon-only pick stranded by a drop to draft exports the phase-suggested variant, not the gutted one', () => {
    const onExport = vi.fn();
    storeState.phase = 'canon';
    const view = render(<ExportSheet open onClose={() => {}} onExport={onExport} exporting={false} />);

    // Sanity: in canon the CTA reflects the canon-only suggested variant.
    expect(view.getByRole('button', { name: /Export .*Timeline/i })).toBeTruthy();

    // Uncanonize: the settlement drops to draft while the sheet stays mounted.
    storeState.phase = 'draft';
    view.rerender(<ExportSheet open onClose={() => {}} onExport={onExport} exporting={false} />);

    // The CTA must now export the DRAFT-phase suggested variant, never the
    // stranded canon-only timeline_packet.
    fireEvent.click(view.getByRole('button', { name: /^Export /i }));
    expect(onExport).toHaveBeenCalledTimes(1);
    expect(onExport.mock.calls[0][0]).toBe('draft_brief');
    expect(onExport.mock.calls[0][0]).not.toBe('timeline_packet');
  });
});
