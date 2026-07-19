/**
 * CascadePreviewPanel.jsx — side-panel cascade preview.
 *
 * Opens when the user clicks "Preview cascade" in PendingChangesBar.
 * Reads the live settlement + pending queue, calls
 * `domain/pendingEdits.previewCascade()`, and renders the structured
 * delta: counts, narrative impact, warnings.
 *
 * The point is "no mystery edits". Before commit:
 *   - what counts change (institutions, resources, stressors)
 *   - what gets renamed
 *   - what the narrative layer's status becomes
 *   - any warnings (e.g. removing institutions leaves hooks anchored)
 *
 * Slide-in panel from the right, ~360px wide on desktop, full-width
 * sheet on mobile. Backdrop click closes.
 */

import { useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { previewCascade } from '../../domain/pendingEdits.js';
import { sans, serif_, FS, SP, swatch, PARCH, GOLD_DEEP } from '../theme.js';
import { INK as OINK } from '../../design/organic/ink.js';
import { RUBRIC } from '../../design/organic/rubrication.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import { X } from 'lucide-react';
import useDialogFocusTrap from '../primitives/useDialogFocusTrap.js';

// THE PREVIEW INSTRUMENT PLATE (Deep Craft — the dossier's instrument register):
// the cascade preview reads as a rule-framed plate of labeled impact lines, not
// tinted SaaS callout washes stacked in a shadowed panel. Print has no z-axis —
// the plate edge is a rule, never elevation. The apparatus speaks in TWO rationed
// rubric tones (both contrast-PINNED as text on parchment): the gold entry mark
// for the informational lines, the oxblood for the critical Warning line. The
// category is carried by each line's title word, never colour alone.
const APPARATUS = RUBRIC.entry;   // informational impact lines — the gold entry apparatus
const CRITICAL = RUBRIC.rubric;   // the Warning line — oxblood, the critical voice
const RULE = OINK.hairline;       // the feint ledger rule between lines (decorative)
const INK = swatch['#1B1408'];
const BORDER = swatch['#E8D9B0'];

function ImpactRow({ accent, title, body }) {
  return (
    <div style={{
      padding: SP.sm,
      borderLeft: `3px solid ${accent}`,
      borderBottom: `1px solid ${RULE}`,
      fontSize: FS.xs,
      color: OINK.body,
      lineHeight: 1.5,
    }}>
      <b style={{ color: accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</b>{' '}
      {body}
    </div>
  );
}

export default function CascadePreviewPanel({ onClose, onCommit }) {
  const settlement = useStore(s => s.settlement);
  const queue = useStore(s => s.pendingEditsQueue || []);
  const savedSettlements = useStore(s => s.savedSettlements || []);

  // Re-derive the preview whenever the queue or settlement changes. Pure
  // function — no side effects, safe to call on every render.
  const preview = useMemo(
    () => previewCascade(settlement, queue),
    [settlement, queue],
  );

  // The domain module can't see saved settlements; we fill linkedSaves
  // count here from the store-side data.
  const linkedSaves = useMemo(() => {
    if (!settlement || !Array.isArray(savedSettlements)) return 0;
    // The neighbour list lives at settlement.neighbourNetwork (mirrored to the
    // Supabase row's neighbour_links); the old top-level save.neighbourLinks
    // field never exists, so the previous read always returned 0. A neighbour
    // entry carries the linked save's id as `id` (see useChangeQueueCascade),
    // with `targetId` as the alternate key (see map/RelationshipEdges).
    return savedSettlements.filter(s =>
      (s.settlement?.neighbourNetwork || s.neighbour_links || [])
        .some(link => (link?.id ?? link?.targetId) === settlement.id)
    ).length;
  }, [settlement, savedSettlements]);

  // Shared modal focus management: trap Tab inside the panel, restore focus to the
  // trigger on close, and dismiss on Escape (topmost dialog only). Backs the
  // aria-modal promise below with real focus behavior.
  const dialogRef = useDialogFocusTrap(true, onClose);

  const summaryText = preview.summaryLines.length
    ? preview.summaryLines.join(' · ')
    : 'No structural changes.';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9100 }}>
      {/* Presentational backdrop — click dismisses; the KEYBOARD dismiss is Escape,
          handled by the shared focus trap (useDialogFocusTrap) on the dialog, so the
          backdrop needs no key handler of its own. A sibling (not a parent) of the
          dialog, so a click on the panel never reaches it and no stopPropagation is
          needed. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- dismiss-only backdrop; Escape (focus trap) is the keyboard path */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(24,20,16,0.5)',
          backdropFilter: 'blur(4px)',
        }}
      />
      <aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Cascade preview"
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: 'min(400px, 100vw)',
          background: PARCH,
          borderLeft: `1px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column',
          fontFamily: sans,
        }}
      >
        <header style={{
          padding: SP.lg,
          // Top-pinned fixed panel: fold in the device safe-area inset so the
          // header clears a notch on mobile. Resolves to 0 on desktop.
          paddingTop: `calc(${SP.lg}px + env(safe-area-inset-top, 0px))`,
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'baseline', gap: SP.sm,
        }}>
          <h2 style={{
            margin: 0, fontFamily: serif_, fontWeight: 600,
            fontSize: FS.xl, color: INK, flex: 1,
          }}>
            Cascade preview
          </h2>
          <IconButton
            Icon={X}
            label="Close"
            onClick={onClose}
            tone="ghost"
            size="lg"
          />
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: SP.lg }}>
          <div style={{
            fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: GOLD_DEEP,
            marginBottom: SP.xs,
          }}>
            Summary
          </div>
          <div style={{
            fontFamily: serif_, fontSize: FS.md,
            color: INK, lineHeight: 1.5, marginBottom: SP.lg,
          }}>
            {summaryText}
          </div>

          {preview.summaryLines.length > 0 && (
            <ImpactRow
              accent={APPARATUS}
              title="Structure"
              body={summaryText}
            />
          )}

          <div style={{ height: SP.sm }} />

          <ImpactRow
            accent={APPARATUS}
            title="Downstream"
            body={
              `${preview.downstreamCounts.npcs ?? 0} NPCs, ` +
              `${preview.downstreamCounts.factions ?? 0} factions, ` +
              `${preview.downstreamCounts.hooks ?? 0} hooks tie to this town.`
            }
          />

          <div style={{ height: SP.sm }} />

          {preview.narrativeImpact !== 'none' && (
            <>
              <ImpactRow
                accent={APPARATUS}
                title="Narrative"
                body={
                  preview.narrativeImpact === 'regenerate-needed'
                    ? 'The Narrative Layer will need a fresh pass to stay true to these changes.'
                    : 'A narrative pass will carry the prose forward over the renames.'
                }
              />
              <div style={{ height: SP.sm }} />
            </>
          )}

          {linkedSaves > 0 && (
            <>
              <ImpactRow
                accent={APPARATUS}
                title="Linked saves"
                body={`${linkedSaves} ${linkedSaves === 1 ? 'save links' : 'saves link'} to this settlement and may be flagged for review.`}
              />
              <div style={{ height: SP.sm }} />
            </>
          )}

          {preview.warnings.map((w, i) => (
            <div key={i} style={{ marginBottom: SP.sm }}>
              <ImpactRow
                accent={CRITICAL}
                title="Warning"
                body={w}
              />
            </div>
          ))}
        </div>

        <footer style={{
          padding: SP.lg,
          borderTop: `1px solid ${BORDER}`,
          display: 'flex', gap: SP.sm,
        }}>
          <Button
            variant="primary"
            onClick={onCommit}
            style={{ flex: 1 }}
          >
            Apply
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
        </footer>
      </aside>
    </div>
  );
}
