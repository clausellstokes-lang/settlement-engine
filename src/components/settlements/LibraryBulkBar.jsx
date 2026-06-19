/**
 * LibraryBulkBar — the Library's bulk action bar + its delete confirmation,
 * wired to the useLibraryBulkSelect hook (UX overhaul Phase 3, plan §4.2).
 * Extracted from SettlementsPanel so the panel stays under the component-size
 * ratchet; pure presentational glue over the hook + BulkActionBar.
 */

import BulkActionBar from './BulkActionBar.jsx';
import DeleteConfirmation from '../DeleteConfirmation';

/**
 * @param {{
 *   bulk: ReturnType<typeof import('../../hooks/useLibraryBulkSelect.js').useLibraryBulkSelect>,
 *   campaigns: Array<{ id: string, name: string }>,
 *   canManageCampaigns: boolean,
 * }} props
 */
export default function LibraryBulkBar({ bulk, campaigns, canManageCampaigns }) {
  const n = bulk.selectedIds.size;
  return (
    <>
      <BulkActionBar
        selectedCount={n}
        campaigns={campaigns}
        canManageCampaigns={canManageCampaigns}
        onAddToCampaign={bulk.addToCampaignBulk}
        onCanonize={bulk.canonizeBulk}
        onExport={bulk.exportBulk}
        onDelete={() => bulk.setDeleteConfirm(true)}
        onClear={bulk.clear}
      />
      {bulk.deleteConfirm && (
        <DeleteConfirmation
          entityName={`${n} settlement${n === 1 ? '' : 's'}`}
          details="The selected settlements will be permanently deleted, along with any neighbour links to them. Data not exported as JSON is lost."
          onConfirm={bulk.confirmDelete}
          onCancel={() => bulk.setDeleteConfirm(false)}
        />
      )}
    </>
  );
}
