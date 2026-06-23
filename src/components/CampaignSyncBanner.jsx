/**
 * CampaignSyncBanner.jsx — surfaces a failed cloud save of campaign/save state.
 *
 * persistSaveUpdate (campaignSlice) used to swallow save failures with only a
 * console.warn: the user saw success while Supabase drifted from local state,
 * which surfaced later as a settlement that "reverts" on reload. The slice now
 * records the failure in `campaignSyncError`; this dismissible top banner makes
 * it visible so the user knows their change may not have persisted.
 */
import { X } from 'lucide-react';
import { useStore } from '../store/index.js';
import { RED, RED_BG, FS, R, SP, sans, ELEV } from './theme.js';
import IconButton from './primitives/IconButton.jsx';

export default function CampaignSyncBanner() {
  const error = useStore(s => s.campaignSyncError);
  const clear = useStore(s => s.clearCampaignSyncError);
  if (!error) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 260, maxWidth: 'min(92vw, 560px)',
        display: 'flex', alignItems: 'flex-start', gap: SP.sm,
        padding: `${SP.sm}px ${SP.md}px`,
        border: `1px solid ${RED}`, borderRadius: R.lg,
        background: RED_BG, color: RED,
        fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
        boxShadow: ELEV[2],
      }}
    >
      <span style={{ flex: 1 }}>{error}</span>
      <IconButton
        Icon={X}
        label="Dismiss cloud-sync warning"
        onClick={clear}
        tone="danger"
        size="xl"
      />
    </div>
  );
}
