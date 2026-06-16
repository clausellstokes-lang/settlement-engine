/**
 * CascadePreviewPanel.jsx — P105 / E-2 side-panel cascade preview.
 *
 * Opens when the user clicks "Preview cascade" in PendingChangesBar.
 * Reads the live settlement + pending queue, calls
 * `domain/pendingEdits.previewCascade()`, and renders the structured
 * delta: counts, narrative impact, warnings.
 *
 * The point is "no mystery edits" (E-2's headline). Before commit:
 *   - what counts change (institutions, resources, stressors)
 *   - what gets renamed
 *   - what the narrative layer's status becomes
 *   - any warnings (e.g. removing institutions leaves hooks anchored)
 *
 * Slide-in panel from the right, ~360px wide on desktop, full-width
 * sheet on mobile. Backdrop click closes.
 */

import { useEffect, useMemo } from 'react';
import { useStore } from '../../store/index.js';
import { previewCascade } from '../../domain/pendingEdits.js';
import { sans, serif_, FS, SP, R, swatch, PARCH, MUTED, GOLD_DEEP } from '../theme.js';

const VIOLET = '#7B4FCF';
const VIOLET_BG = '#EBE2FA';
const AMBER = '#D08020';
const AMBER_BG = '#FBEAD0';
const GREEN = '#4A7A3A';
const GREEN_BG = '#E2EEDB';
const BLUE = '#2A5A7A';
const BLUE_BG = '#E0E8F0';
const RED = '#A23434';
const RED_BG = '#F4DEDE';
const INK = '#1B1408';
const BORDER = '#E8D9B0';

function ImpactRow({ accent, accentBg, title, body }) {
  return (
    <div style={{
      padding: SP.sm,
      background: accentBg,
      borderLeft: `3px solid ${accent}`,
      borderRadius: R.sm,
      fontSize: FS.xs,
      color: swatch['#3A2F18'],
      lineHeight: 1.5,
    }}>
      <b style={{ color: accent }}>{title}</b>{' '}
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
    return savedSettlements.filter(s =>
      s.neighbourLinks?.some(link => link.targetId === settlement.id)
    ).length;
  }, [settlement, savedSettlements]);

  // Esc closes
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const summaryText = preview.summaryLines.length
    ? preview.summaryLines.join(' · ')
    : 'No structural changes.';

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- overlay backdrop: click/key here is dismiss-only; Escape also closes (see useEffect above)
    <div
      role="dialog"
      aria-label="Cascade preview"
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9100,
        background: 'rgba(24,20,16,0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- panel container: handlers only stop backdrop click/key from bubbling, not an interactive control */}
      <aside
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
        style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: 'min(400px, 100vw)',
          background: PARCH,
          borderLeft: `1px solid ${BORDER}`,
          boxShadow: '-12px 0 32px rgba(0,0,0,0.25)',
          display: 'flex', flexDirection: 'column',
          fontFamily: sans,
        }}
      >
        <header style={{
          padding: SP.lg,
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'baseline', gap: SP.sm,
        }}>
          <h2 style={{
            margin: 0, fontFamily: serif_, fontWeight: 600,
            fontSize: FS.xl, color: INK, flex: 1,
          }}>
            Cascade preview
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent', border: 'none',
              fontSize: FS.xxl, color: MUTED, cursor: 'pointer',
              padding: 0, lineHeight: 1,
            }}
          >×</button>
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
              accent={GREEN}
              accentBg={GREEN_BG}
              title="Structure"
              body={summaryText}
            />
          )}

          <div style={{ height: SP.sm }} />

          <ImpactRow
            accent={AMBER}
            accentBg={AMBER_BG}
            title="Downstream"
            body={
              `${preview.downstreamCounts.npcs ?? 0} NPCs, ` +
              `${preview.downstreamCounts.factions ?? 0} factions, ` +
              `${preview.downstreamCounts.hooks ?? 0} hooks reference this town.`
            }
          />

          <div style={{ height: SP.sm }} />

          {preview.narrativeImpact !== 'none' && (
            <>
              <ImpactRow
                accent={VIOLET}
                accentBg={VIOLET_BG}
                title="Narrative"
                body={
                  preview.narrativeImpact === 'regenerate-needed'
                    ? 'The narrative layer will need regeneration to stay coherent with these changes.'
                    : 'A narrative progression pass is suggested to evolve the prose against the renames.'
                }
              />
              <div style={{ height: SP.sm }} />
            </>
          )}

          {linkedSaves > 0 && (
            <>
              <ImpactRow
                accent={BLUE}
                accentBg={BLUE_BG}
                title="Linked saves"
                body={`${linkedSaves} ${linkedSaves === 1 ? 'save' : 'saves'} reference this settlement. They may see a flag.`}
              />
              <div style={{ height: SP.sm }} />
            </>
          )}

          {preview.warnings.map((w, i) => (
            <div key={i} style={{ marginBottom: SP.sm }}>
              <ImpactRow
                accent={RED}
                accentBg={RED_BG}
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
          <button
            type="button"
            onClick={onCommit}
            style={{
              flex: 1, padding: `${SP.sm}px ${SP.md}px`,
              background: GOLD_DEEP, color: swatch.white,
              border: 'none', borderRadius: R.sm,
              fontWeight: 700, cursor: 'pointer',
              fontFamily: sans, fontSize: FS.sm,
            }}
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: `${SP.sm}px ${SP.md}px`,
              background: swatch.white, color: swatch['#3A2F18'],
              border: `1px solid ${BORDER}`,
              borderRadius: R.sm,
              fontWeight: 600, cursor: 'pointer',
              fontFamily: sans, fontSize: FS.sm,
            }}
          >
            Cancel
          </button>
        </footer>
      </aside>
    </div>
  );
}
