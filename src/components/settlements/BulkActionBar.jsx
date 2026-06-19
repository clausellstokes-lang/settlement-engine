/**
 * BulkActionBar — the Library multi-select action bar (UX overhaul Phase 3, plan
 * §4.2). Appears when the Select toggle is on; reflects the current selection and
 * offers the bulk actions: Add to campaign · Canonize · Export · Delete.
 *
 * Pure presentational + a small popover for the campaign target. Owns no library
 * state — the parent (SettlementsPanel) holds the selected-id set and passes the
 * action callbacks in. Add-to-campaign / Canonize are premium-campaign actions, so
 * they self-hide when `canManageCampaigns` is false.
 *
 * No store reads, no rng.
 */

import { useState } from 'react';
import { FolderOpen, BookMarked, Download, Trash2, X } from 'lucide-react';
import Button from '../primitives/Button.jsx';
import { GOLD, INK, MUTED, BORDER, CARD, FS, sans, swatch } from '../theme.js';

/**
 * @param {{
 *   selectedCount: number,
 *   campaigns: Array<{ id: string, name: string }>,
 *   canManageCampaigns: boolean,
 *   onAddToCampaign: (campaignId: string) => void,
 *   onCanonize: () => void,
 *   onExport: () => void,
 *   onDelete: () => void,
 *   onClear: () => void,
 * }} props
 */
export default function BulkActionBar({
  selectedCount,
  campaigns = [],
  canManageCampaigns,
  onAddToCampaign,
  onCanonize,
  onExport,
  onDelete,
  onClear,
}) {
  const [moveOpen, setMoveOpen] = useState(false);
  const disabled = selectedCount === 0;

  return (
    <div
      data-testid="bulk-action-bar"
      style={{
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        padding: '8px 12px', background: swatch['#F5EDE0'], border: `1px solid ${BORDER}`,
        borderRadius: 7, fontFamily: sans, fontSize: FS.xs, color: INK,
      }}
    >
      <span style={{ fontWeight: 700, color: INK, minWidth: 90 }}>
        {selectedCount} selected
      </span>

      {canManageCampaigns && (
        <div style={{ position: 'relative' }}>
          <Button variant="gold" size="sm" disabled={disabled} icon={<FolderOpen size={12} />}
            onClick={() => setMoveOpen(o => !o)}>
            Add to campaign
          </Button>
          {moveOpen && !disabled && (
            <div style={{ position: 'absolute', left: 0, top: '100%', marginTop: 4, zIndex: 20, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, boxShadow: '0 4px 16px rgba(0,0,0,0.15)', minWidth: 160, padding: 4 }}>
              {campaigns.length === 0 && <div style={{ padding: '5px 8px', fontSize: FS.xxs, color: MUTED }}>No campaigns yet</div>}
              {campaigns.map(c => (
                <Button key={c.id} variant="secondary" fullWidth icon={<FolderOpen size={10} color={GOLD} />}
                  onClick={() => { onAddToCampaign(c.id); setMoveOpen(false); }}
                  style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '5px 8px', border: 'none', background: 'none', minHeight: 0, gap: 4, fontSize: FS.xs, color: INK, fontWeight: 400, borderRadius: 3 }}>
                  {c.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {canManageCampaigns && (
        <Button variant="gold" size="sm" disabled={disabled} icon={<BookMarked size={12} />} onClick={onCanonize}>
          Canonize
        </Button>
      )}

      <Button variant="info" size="sm" disabled={disabled} icon={<Download size={12} />} onClick={onExport}>
        Export
      </Button>

      <Button variant="danger" size="sm" disabled={disabled} icon={<Trash2 size={12} />} onClick={onDelete}>
        Delete
      </Button>

      <Button variant="ghost" size="sm" icon={<X size={12} />} onClick={onClear} style={{ marginLeft: 'auto' }}>
        Done
      </Button>
    </div>
  );
}
