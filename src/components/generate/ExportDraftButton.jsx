/**
 * ExportDraftButton.jsx — "Export PDF" for the just-generated, unsaved draft.
 *
 * On the Create page post-generation, an export-capable user (Cartographer /
 * Founder / elevated) can export the in-memory draft to a PDF WITHOUT saving it
 * first. generateSettlementPDF takes the settlement object directly, and an
 * unsaved draft passes `campaign: null` (no worldState) + `faithUnlocked: false`,
 * so the base draft_brief PDF renders — no live-campaign faith/war chapter.
 *
 * GATE — OUR floor, not THEIRS. THEIRS routed through a `useDossierExportAccess`
 * hook built on `tierHasUnlimitedPdfExport` (a pricing helper OUR tree does not
 * have). OUR export ladder lives in the store gates `canExport()` / `isElevated()`
 * (the same pair BuyThisDossier's resolveExportAccess folds into
 * `canExportFreely`). For an UNSAVED draft (no saveId) only those unlimited-export
 * tiers can export in place — a free account must SAVE first (then its per-save
 * durable right or purchase applies on the saved view), and anon gets the
 * one-shot Buy CTA on the hero. So this button self-hides for free + anon and
 * never competes with Buy.
 *
 * Reuses OUR worker-based PDF render (F41) via the shared generateSettlementPDF
 * (dynamic import keeps the PDF chunk out of first paint). Opens the shared
 * ExportSheet variant picker, which defaults to draft_brief and disables the
 * canon-only variants in draft.
 */
import { useState, lazy, Suspense } from 'react';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import { sans, FS, SP, swatch } from '../theme.js';

// Lazy so the PDF chunk only loads when the user actually exports.
const generateSettlementPDF = (...args) =>
  import('../../utils/generateSettlementPDF.js').then(m => m.generateSettlementPDF(...args));
const ExportSheet = lazy(() => import('../settlement/ExportSheet.jsx'));

export default function ExportDraftButton() {
  const settlement = useStore(s => s.settlement);
  // OUR export-access seam: elevated roles or an export-capable tier gate. For a
  // null (unsaved) draft this is the only rung that can export in place.
  const canExportFreely = useStore(s => (typeof s.isElevated === 'function' && s.isElevated())
    || (typeof s.canExport === 'function' && s.canExport()));

  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  // Unlimited-export tiers only; nothing to export without a settlement.
  if (!settlement || !canExportFreely) return null;

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
        // Unsaved draft: no owning campaign, so no live worldState / faith chapter.
        campaign: null,
        faithUnlocked: false,
        variant,
        isFounder: s.isFounder?.() ?? false,
      });
      s.markExported?.();
      setOpen(false);
    } catch (err) {
      console.error('[draft PDF export] failed:', err);
      setError(t('errors.pdfExportFail', { detail: err?.message || String(err) || 'unknown error' }));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: SP.xs }}>
      <Button
        variant="secondary"
        size="lg"
        onClick={() => { setError(null); setOpen(true); }}
        title="Export this draft as a PDF without saving it"
      >
        Export PDF
      </Button>
      {error && (
        // role=alert (SB5): the export failure appears after the user acts, so
        // it must interrupt assistive tech (WCAG 4.1.3).
        <span role="alert" style={{ color: swatch.danger, fontSize: FS.xs, fontFamily: sans, maxWidth: 320, textAlign: 'center' }}>
          {error}
        </span>
      )}
      {open && (
        <Suspense fallback={null}>
          <ExportSheet
            open
            onClose={() => { setOpen(false); setError(null); }}
            onExport={handleExport}
            exporting={exporting}
          />
        </Suspense>
      )}
    </div>
  );
}
