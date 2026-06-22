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
import { GOLD, INK, BODY, BORDER, CARD, RED, RED_BG, FS, sans, swatch } from '../theme.js';
import DeleteConfirmation from '../DeleteConfirmation';

/**
 * @param {{
 *   bulk: ReturnType<typeof import('../../hooks/useLibraryBulkSelect.js').useLibraryBulkSelect>,
 *   campaigns: Array<{ id: string, name: string }>,
 *   canManageCampaigns: boolean,
 * }} props
 */
export default function BulkActionBar({ bulk, campaigns = [], canManageCampaigns }) {
  const [moveOpen, setMoveOpen] = useState(false);
  const selectedCount = bulk.selectedIds.size;
  const disabled = selectedCount === 0;

  return (
    <>
      <div
        data-testid="bulk-action-bar"
        style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          padding: '8px 12px', background: swatch['#F5EDE0'],
          fontFamily: sans, fontSize: FS.xs, color: INK,
        }}
      >
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          style={{ fontWeight: 700, fontSize: FS.sm, color: INK, minWidth: 90 }}>
          {selectedCount} selected
        </span>

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

        <Button variant="ghost" size="sm" disabled={disabled} icon={<Trash2 size={12} />} onClick={() => bulk.setDeleteConfirm(true)} style={{ marginLeft: 'auto' }}>
          Delete
        </Button>

        <Button variant="ghost" size="sm" icon={<X size={12} />} onClick={bulk.clear}>
          Done
        </Button>
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
