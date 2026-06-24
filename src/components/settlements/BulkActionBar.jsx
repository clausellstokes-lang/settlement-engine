/**
 * BulkActionBar — the Library multi-select action bar (UX overhaul Phase 3, plan
 * §4.2). Appears when the Select toggle is on; reflects the current selection and
 * offers the bulk actions: Add to campaign · Canonize · Export · Delete. It also
 * owns its own delete-confirmation + export-error surfaces (the thin LibraryBulkBar
 * wrapper was folded in here — one component, one call site).
 *
 * Drives directly off the useLibraryBulkSelect hook the parent owns. Add-to-campaign
 * / Canonize are premium-campaign actions, so they self-hide when
 * `canManageCampaigns` is false. No store reads, no rng.
 */

import { useState } from 'react';
import { FolderOpen, BookMarked, Download, Trash2, X } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import { GOLD, INK, BODY, BORDER, CARD, RED, RED_BG, FS, SP, sans, swatch } from '../theme.js';
import DeleteConfirmation from '../DeleteConfirmation';
import useIsMobile from '../../hooks/useIsMobile.js';

/**
 * Layout wrapper that is a no-op on desktop and a wrapping flex row on mobile.
 *
 * On desktop it renders a bare Fragment so the action buttons stay DIRECT
 * children of the bar's single flexWrap row (the desktop DOM is unchanged). On
 * mobile it wraps its children in a flex row so the column-stacked bar groups
 * its actions cleanly; `mobileTrailing` right-aligns the group (used for the
 * Delete + Done pair so Delete keeps its right-anchor within its own row).
 *
 * @param {{ isMobile: boolean, mobileTrailing?: boolean, children: React.ReactNode }} props
 */
function ActionGroup({ isMobile, mobileTrailing = false, children }) {
  if (!isMobile) return <>{children}</>;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
      justifyContent: mobileTrailing ? 'flex-end' : 'flex-start',
    }}>
      {children}
    </div>
  );
}

/**
 * @param {{
 *   bulk: ReturnType<typeof import('../../hooks/useLibraryBulkSelect.js').useLibraryBulkSelect>,
 *   campaigns: Array<{ id: string, name: string }>,
 *   canManageCampaigns: boolean,
 * }} props
 */
export default function BulkActionBar({ bulk, campaigns = [], canManageCampaigns }) {
  const [moveOpen, setMoveOpen] = useState(false);
  const isMobile = useIsMobile();
  const selectedCount = bulk.selectedIds.size;
  const disabled = selectedCount === 0;

  // On mobile the single flexWrap row collapses into a ragged stack and the
  // `marginLeft:auto` right-anchor on Delete breaks once it wraps to its own
  // line. Stack the bar as a column there: the selection count leads, the
  // constructive actions wrap as a group, and the destructive Delete + Done
  // sit together on a trailing row (Delete still pushed away from the
  // constructive cluster, just within its own row rather than across a wrap).
  const containerStyle = isMobile
    ? {
        display: 'flex', flexDirection: 'column', gap: SP.sm,
        padding: '8px 12px', background: swatch['#F5EDE0'],
        fontFamily: sans, fontSize: FS.xs, color: INK,
      }
    : {
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        padding: '8px 12px', background: swatch['#F5EDE0'],
        fontFamily: sans, fontSize: FS.xs, color: INK,
      };

  return (
    <>
      <div
        data-testid="bulk-action-bar"
        style={containerStyle}
      >
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{ fontWeight: 700, fontSize: FS.sm, color: INK, minWidth: 90 }}>
          {selectedCount} selected
        </span>

        {/* Constructive actions — Add to campaign / Canonize / Export. On mobile
            they share one wrapping row inside the column; on desktop they are
            direct children of the bar (byte-identical via the Fragment). */}
        <ActionGroup isMobile={isMobile}>
          {canManageCampaigns && (
            <div style={{ position: 'relative' }}>
              <Button variant="primary" size="sm" disabled={disabled} icon={<FolderOpen size={12} />}
                aria-haspopup="menu" aria-expanded={moveOpen}
                onClick={() => setMoveOpen(o => !o)}>
                Add to campaign
              </Button>
              {moveOpen && !disabled && (
                <div role="menu" style={{ position: 'absolute', left: 0, top: '100%', marginTop: 4, zIndex: 20, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: 160, padding: 4 }}>
                  {campaigns.length === 0 && <div style={{ padding: '5px 8px', fontSize: FS.xs, color: BODY }}>No campaigns yet</div>}
                  {campaigns.map(c => (
                    // No minHeight override: menu items inherit Button's sm floor so
                    // these (the only path to bulk add-to-campaign) aren't the
                    // smallest targets on the surface (P7).
                    <Button key={c.id} variant="ghost" fullWidth role="menuitem" icon={<FolderOpen size={10} color={GOLD} />}
                      onClick={() => { bulk.addToCampaignBulk(c.id); setMoveOpen(false); }}
                      style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '6px 8px', gap: 4, fontSize: FS.xs, color: INK, fontWeight: 400, borderRadius: 3 }}>
                      {c.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}

          {canManageCampaigns && (
            <Button variant="secondary" size="sm" disabled={disabled} icon={<BookMarked size={12} />} onClick={bulk.canonizeBulk}>
              Canonize
            </Button>
          )}

          <Button variant="secondary" size="sm" disabled={disabled} icon={<Download size={12} />} onClick={bulk.exportBulk}>
            Export
          </Button>
        </ActionGroup>

        {/* Destructive + dismiss. On desktop Delete carries marginLeft:auto to
            push it (and Done) to the right of the single row. On mobile the
            margin is dropped and the pair sits on its own trailing row, with
            Delete pushed to the right within that row instead. */}
        <ActionGroup isMobile={isMobile} mobileTrailing>
          <Button variant="ghost" size="sm" disabled={disabled} icon={<Trash2 size={12} />} onClick={() => bulk.setDeleteConfirm(true)} style={{ marginLeft: 'auto' }}>
            Delete
          </Button>

          <Button variant="ghost" size="sm" icon={<X size={12} />} onClick={bulk.clear}>
            Done
          </Button>
        </ActionGroup>
      </div>

      {/* Export-error — a failed bulk export is no longer silent (P10); the
          selection is preserved (hook does not clear on failure) so retry works. */}
      {bulk.exportError && (
        <div role="alert" style={{ padding: '6px 12px', fontSize: FS.xs, color: RED, background: RED_BG, fontFamily: sans }}>
          {bulk.exportError}
        </div>
      )}

      {bulk.deleteConfirm && (
        <DeleteConfirmation
          entityName={`${selectedCount} settlement${selectedCount === 1 ? '' : 's'}`}
          details="The selected settlements will be permanently deleted, along with any neighbour links to them. Data not exported as JSON is lost."
          onConfirm={bulk.confirmDelete}
          onCancel={() => bulk.setDeleteConfirm(false)}
        />
      )}
    </>
  );
}
