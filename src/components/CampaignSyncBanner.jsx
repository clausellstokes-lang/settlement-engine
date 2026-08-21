/**
 * CampaignSyncBanner.jsx — the durable-outbox status chip (Track K §C3).
 *
 * persistSaveUpdate is now an enqueue+drain against a durable outbox: a save
 * commits locally in one frame, then the cloud catches up in the background and
 * survives a tab close. This chip is the reconcile surface for that queue —
 * fail-visible, never fail-silent:
 *   • while writes are in flight it shows a quiet "Saving n change(s)…";
 *   • when writes park after exhausting their backoff it turns to a warning with
 *     the failed count and a Retry action (revive the parked ops + re-drain).
 *
 * It remains a live region (the auth Alert precedent): assertive when something
 * failed, polite while merely syncing. `campaignSyncError` (the pre-C3 boolean
 * banner) still carries the human message and is retained here unchanged.
 */
import { X, RefreshCw } from 'lucide-react';
import { useStore } from '../store/index.js';
import { RED, AMBER, PARCH, FS, SP, sans } from './theme.js';
import IconButton from './primitives/IconButton.jsx';
import Button from './primitives/Button.jsx';

export default function CampaignSyncBanner() {
  const error = useStore(s => s.campaignSyncError);
  const loadError = useStore(s => s.campaignLoadError);
  const status = useStore(s => s.outboxStatus) || { queued: 0, failed: 0, inflight: 0 };
  const clear = useStore(s => s.clearCampaignSyncError);
  const retryOutbox = useStore(s => s.retryOutbox);
  const loadCampaigns = useStore(s => s.loadCampaigns);

  const failed = status.failed || 0;
  const syncing = (status.queued || 0) + (status.inflight || 0);
  const danger = !!error || !!loadError || failed > 0;

  // Nothing pending and nothing failed → nothing to say.
  if (!danger && syncing === 0) return null;

  const counts = [];
  if (syncing > 0) counts.push(`${syncing} syncing`);
  if (failed > 0) counts.push(`${failed} failed`);
  const countsLabel = counts.join(' · ');

  const message = loadError?.message || error
    || (danger
      ? 'Some changes could not be saved to the cloud.'
      : 'Saving your changes to the cloud…');
  const retry = () => {
    const work = [];
    try {
      if (loadError && typeof loadCampaigns === 'function') {
        work.push(Promise.resolve(loadCampaigns()));
      }
      if (typeof retryOutbox === 'function') {
        work.push(Promise.resolve(retryOutbox()));
      }
    } catch (retryError) {
      work.push(Promise.reject(retryError));
    }
    // Both store actions own their visible error state. allSettled prevents a
    // recovery button from creating an unhandled rejection if either transport
    // fails again; the banner remains visible for another attempt.
    void Promise.allSettled(work);
  };

  return (
    <div
      role={danger ? 'alert' : 'status'}
      aria-live={danger ? 'assertive' : 'polite'}
      style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 260, maxWidth: 'min(92vw, 560px)',
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.sm}px ${SP.md}px`,
        border: `1px solid ${danger ? RED : AMBER}`,
        borderLeft: `3px solid ${danger ? RED : AMBER}`,
        background: PARCH, color: danger ? RED : AMBER,
        fontFamily: sans, fontSize: FS.sm, fontWeight: 700,
      }}
    >
      <span style={{ flex: 1 }}>
        {message}
        {countsLabel ? ` (${countsLabel})` : ''}
      </span>
      {danger && (
        <Button
          variant="danger"
          size="sm"
          icon={<RefreshCw size={12} aria-hidden="true" />}
          onClick={retry}
        >
          Retry
        </Button>
      )}
      {danger && (
        <IconButton
          Icon={X}
          label="Dismiss cloud-sync warning"
          onClick={clear}
          tone="danger"
          size="sm"
        />
      )}
    </div>
  );
}
