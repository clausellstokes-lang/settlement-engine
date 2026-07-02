/**
 * AutoSaveChip.jsx — visible save-state indicator.
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
 * campaign's persisted mapState via the shared content-aware
 * mapFingerprint (placement coords/ids + annotation content), so a
 * drag-move or a label rename is caught — a count-only key would miss
 * both and leave the chip stuck on "Saved".
 *
 * Self-gated on activeCampaignId. When there is no active campaign, the
 * chip renders nothing — the save target is undefined, so a save-status
 * indicator would be misleading.
 */

import { useEffect, useMemo, useState } from 'react';
import { FS, swatch } from '../theme.js';
import { useStore } from '../../store';
import { mapFingerprint } from '../../hooks/useMapAutosave.js';

const GOLD = swatch['#C9A24C'];
const AMBER = swatch['#D08020'];
const VIOLET = swatch['#7B4FCF'];
const TEXT = swatch['#3A2F18'];
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

export default function AutoSaveChip({ saving = false }) {
  const activeCampaignId = useStore(s => s.activeCampaignId);
  const campaign = useStore(s =>
    activeCampaignId ? (s.campaigns || []).find(c => c.id === activeCampaignId) : null,
  );
  const liveMapState = useStore(s => s.mapState);

  // Tick once a minute so the relative timestamp stays current.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!campaign?.mapState?.savedAt) return undefined;
    const id = setInterval(() => setTick(n => n + 1), 30_000);
    return () => clearInterval(id);
  }, [campaign?.mapState?.savedAt]);

  const dirty = useMemo(() => {
    if (!campaign?.mapState) return false;
    return mapFingerprint(liveMapState) !== mapFingerprint(campaign.mapState);
  }, [liveMapState, campaign?.mapState]);

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
        // Borderless tinted pill (P5 anti-box-soup): sitting beside the
        // bordered Save button, a second ring would read as a redundant frame.
        // The colored dot + label already carry state in two channels (P7).
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 9px',
        background: `${dotColor}10`,
        borderRadius: 12,
        // All states use a WCAG-passing ink (the idle "Saved …" state is the
        // most-shown, and muted failed 4.5:1 on the near-parchment tint).
        fontSize: FS.xs, color: TEXT,
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
