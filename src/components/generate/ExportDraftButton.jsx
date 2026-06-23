/**
 * ExportDraftButton.jsx — "Export PDF" for the just-generated, unsaved draft.
 *
 * On the Create page post-generation, a premium (or elevated) user can export
 * the in-memory draft to a PDF WITHOUT saving it first. generateSettlementPDF
 * takes the settlement object directly, and an unsaved draft passes
 * `campaign: null` (no worldState), so the base draft_brief PDF renders — the
 * same path SettlementDetail's export uses for a free/unsaved export.
 *
 * Gated on canExport() (premium / elevated). Free + anon users do not see it:
 * anon gets the one-time BuyThisDossier purchase instead, and free signed-in
 * users get the subscription CTA. So this button never competes with Buy (which
 * is anon-only). It opens the shared ExportSheet variant picker, which itself
 * defaults to draft_brief and disables the canon-only variants in draft.
 */
import { useState, lazy, Suspense } from 'react';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';

// Lazy so the PDF chunk only loads when the user actually exports.
const generateSettlementPDF = (...args) =>
  import('../../utils/generateSettlementPDF.js').then(m => m.generateSettlementPDF(...args));
const ExportSheet = lazy(() => import('../settlement/ExportSheet.jsx'));

export default function ExportDraftButton() {
  const settlement = useStore(s => s.settlement);
  const canExport = useStore(s => s.canExport());

  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  // Premium / elevated only; nothing to export without a settlement.
  if (!settlement || !canExport) return null;

  const handleExport = async (variant, useAi) => {
    if (exporting) return;
    setExporting(true);
    setError(null);
    try {
      // Read live at export time so refines/edits since open are included.
      const s = useStore.getState();
      await generateSettlementPDF(s.settlement, {
        aiSettlement: s.aiSettlement,
        aiDailyLife: s.aiDailyLife,
        narrativeMode: useAi,
        systemState: s.systemState,
        eventLog: s.eventLog,
        phase: s.phase,
        // Unsaved draft: no owning campaign, so no live worldState chapter.
        campaign: null,
        variant,
        isFounder: s.isFounder?.() ?? false,
      });
      s.markExported?.();
      setOpen(false);
    } catch (err) {
      console.error('[draft PDF export] failed:', err);
      setError(`PDF export failed: ${err?.message || String(err) || 'unknown error'}`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="lg"
        onClick={() => { setError(null); setOpen(true); }}
        title="Export this draft as a PDF without saving it"
      >
        Export PDF
      </Button>
      {open && (
        <Suspense fallback={null}>
          <ExportSheet
            onClose={() => { setOpen(false); setError(null); }}
            onExport={handleExport}
            exporting={exporting}
            error={error}
          />
        </Suspense>
      )}
    </>
  );
}
