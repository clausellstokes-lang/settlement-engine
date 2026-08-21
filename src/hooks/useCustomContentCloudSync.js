import { useEffect } from 'react';

/**
 * Reconcile browser-local custom content when auth enters a cloud-capable tier.
 *
 * The transfer action hydrates after a real upload. This hook hydrates only
 * when there was no local graph (or no transfer service), avoiding a duplicate
 * cloud read. Failed or ambiguous receipts block hydration so their visible
 * retry reason is not erased while the CAS-protected local ledger still waits.
 */
export default function useCustomContentCloudSync({
  authTier,
  authUserId,
  authLoading,
  isElevated,
  migrateLocalCustomContentToCloud,
  loadCustomContentFromCloud,
  clearCloudCustomContent,
}) {
  useEffect(() => {
    if (authLoading) return undefined;
    let cancelled = false;
    const canSyncCloud = authTier === 'premium' || isElevated;
    if (canSyncCloud) {
      migrateLocalCustomContentToCloud()
        .then((receipt) => {
          if (cancelled || receipt?.ok === false) return undefined;
          if (
            receipt
            && receipt.persistence?.authority !== 'no-local-content'
          ) {
            return undefined;
          }
          return loadCustomContentFromCloud();
        })
        .catch((error) => {
          if (!cancelled) {
            console.error('Custom content cloud sync failed:', error);
          }
        });
    } else if (authTier === 'anon') {
      clearCloudCustomContent();
    }
    return () => { cancelled = true; };
  }, [
    authTier,
    authUserId,
    authLoading,
    isElevated,
    migrateLocalCustomContentToCloud,
    loadCustomContentFromCloud,
    clearCloudCustomContent,
  ]);
}
