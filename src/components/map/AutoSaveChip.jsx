/**
 * AutoSaveChip.jsx — P136 / M-5 visible save-state indicator.
 *
 * A pill that tells the user "Saved 2 min ago" so they don't keep
 * pressing Ctrl-S out of anxiety. Lives in the WorldMap top toolbar
 * alongside the existing save button. Three visual states:
 *
 *   • idle    — gold dot · "Saved 2 min ago"   (default — the campaign
 *               map has been persisted; nothing pending)
 *   • dirty   — amber dot · "Unsaved changes"  (placements/labels/etc
 *               changed since the last save)
 *   • saving  — purple dot · "Saving…"         (a save is in flight;
 *               state is observable via WorldMap's local saving flag)
 *
 * The "dirty" state derives from comparing the live mapState to the
 * campaign's persisted mapState (deep-equal on placements/labels). A
 * cheap fingerprint check (Object.keys lengths + JSON length) is good
 * enough; the user rarely cares about precise diff.
 *
 * Self-gated on `mapAutoSaveChip` flag + activeCampaignId. When there
 * is no active campaign, the chip renders nothing — the save target
 * is undefined, so a save-status indicator would be misleading.
 */

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../../store';
import { flag } from '../../lib/flags.js';

const GOLD = '#C9A24C';
const AMBER = '#D08020';
const VIOLET = '#7B4FCF';
const MUTED = '#9C8068';
const sans = '"Nunito", system-ui, sans-serif';

function formatRelative(savedAt) {
  if (!savedAt) return null;
  const ts = typeof savedAt === 'string' ? Date.parse(savedAt) : savedAt;
  if (!Number.isFinite(ts)) return null;
  const delta = Math.max(0, Date.now() - ts);
  if (delta < 60_000) return 'just now';
  const m = Math.floor(delta / 60_000);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

/** Cheap fingerprint of the parts of mapState the user can edit. Used
 *  to spot "dirty" without a deep equality on every render. */
function fingerprint(s) {
  if (!s) return '';
  const placements = Object.keys(s.placements || {}).sort().join(',');
  const labelCount = (s.labels?.length || 0);
  const markerCount = (s.markers?.length || 0);
  const forestCount = (s.forests?.length || 0);
  return `${placements}|${labelCount}|${markerCount}|${forestCount}`;
}

export default function AutoSaveChip({ saving = false }) {
  const enabled = flag('mapAutoSaveChip');
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const campaign = useStore(s =>
    activeCampaignId ? (s.campaigns || []).find(c => c.id === activeCampaignId) : null,
  );
  const liveMapState = useStore(s => s.mapState);

  // Tick once a minute so the relative timestamp stays current.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!enabled || !campaign?.mapState?.savedAt) return undefined;
    const id = setInterval(() => setTick(n => n + 1), 30_000);
    return () => clearInterval(id);
  }, [enabled, campaign?.mapState?.savedAt]);

  const dirty = useMemo(() => {
    if (!campaign?.mapState) return false;
    return fingerprint(liveMapState) !== fingerprint(campaign.mapState);
  }, [liveMapState, campaign?.mapState]);

  if (!enabled) return null;
  if (!activeCampaignId || !campaign) return null;

  let dotColor = GOLD;
  let label = 'Saved';
  const saved = campaign.mapState?.savedAt;
  const relative = formatRelative(saved);

  if (saving) {
    dotColor = VIOLET;
    label = 'Saving…';
  } else if (dirty) {
    dotColor = AMBER;
    label = 'Unsaved changes';
  } else if (relative) {
    label = `Saved ${relative}`;
  } else if (!saved) {
    dotColor = AMBER;
    label = 'Unsaved changes';
  }

  return (
    <span
      role="status"
      aria-live="polite"
      title={saved ? `Last saved at ${new Date(saved).toLocaleString()}` : 'Not yet saved'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 9px',
        background: `${dotColor}10`,
        border: `1px solid ${dotColor}45`,
        borderRadius: 12,
        fontSize: 11, color: dirty || saving ? '#3A2F18' : MUTED,
        fontFamily: sans, fontWeight: 600,
        userSelect: 'none',
      }}
    >
      <span style={{
        width: 6, height: 6, borderRadius: 3,
        background: dotColor,
        boxShadow: saving ? `0 0 0 2px ${dotColor}30` : 'none',
        animation: saving ? 'sf-asc-pulse 1.2s ease-in-out infinite' : 'none',
      }} />
      {label}
      <style>{`
        @keyframes sf-asc-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
      `}</style>
    </span>
  );
}
