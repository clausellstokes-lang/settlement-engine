/**
 * PendingIntentions — Campaign-clock (Phase C3).
 *
 * When a settlement is bound to a canonized campaign world, events authored on
 * it don't resolve immediately — they queue and resolve simultaneously with
 * every other member at the next World Pulse. This panel surfaces THIS
 * settlement's queued intentions with a per-item cancel, so the DM can retract
 * an intention before the tick resolves it.
 *
 * Renders nothing when the settlement isn't clock-bound or has no queue.
 */

import { useMemo } from 'react';
import { Hourglass, X } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { MUTED, INK, BORDER, CARD, sans, FS, SP, R } from '../theme.js';
import Button from '../primitives/Button.jsx';

const TYPE_LABELS = {
  APPLY_STRESSOR: 'Apply stressor',
  RESOLVE_STRESSOR: 'Resolve stressor',
  ADD_INSTITUTION: 'Add institution',
  REMOVE_INSTITUTION: 'Remove institution',
  ADD_RESOURCE: 'Add resource',
  REMOVE_RESOURCE: 'Remove resource',
  ADD_TRADE_GOOD: 'Add trade good',
  REMOVE_TRADE_GOOD: 'Remove trade good',
  DEPLETE_RESOURCE: 'Deplete resource',
  RECOVERED_RESOURCE: 'Recover resource',
  CUT_TRADE_ROUTE: 'Cut trade route',
  PLAGUE: 'Plague',
  DESTROY_SETTLEMENT: 'Destroy settlement',
};

function labelFor(event) {
  const base = TYPE_LABELS[event?.type]
    || (event?.type ? String(event.type).replace(/_/g, ' ').toLowerCase() : 'change');
  const target = event?.payload?.label || event?.targetId;
  return target ? `${base}: ${target}` : base;
}

export default function PendingIntentions() {
  const activeSaveId = useStore(s => s.activeSaveId);
  const campaigns = useStore(s => s.campaigns);
  const cancelQueuedEvent = useStore(s => s.cancelQueuedEvent);

  // Resolve the clock-bound campaign + this settlement's queue from the raw
  // campaigns array (stable ref until it changes) to avoid selector churn.
  const { campaignId, queued } = useMemo(() => {
    if (activeSaveId == null) return { campaignId: null, queued: [] };
    const sid = String(activeSaveId);
    const c = (campaigns || []).find(x =>
      (x?.accessState || 'active') === 'active'
      && (x.settlementIds || []).map(String).includes(sid)
      && x.worldState?.canonizedAt);
    if (!c) return { campaignId: null, queued: [] };
    return {
      campaignId: c.id,
      queued: (c.worldState.pendingEvents || []).filter(e => String(e.saveId) === sid),
    };
  }, [campaigns, activeSaveId]);

  if (!campaignId || queued.length === 0) return null;

  return (
    <div style={{
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
      padding: SP.sm, marginTop: SP.sm,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.sm,
      }}>
        <Hourglass size={12} />
        Queued for next World Pulse
        <span style={{ color: MUTED, opacity: 0.7, marginLeft: 6, textTransform: 'none', fontWeight: 400 }}>
          {queued.length} pending
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
        {queued.map(item => (
          <div key={item.queueId} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: SP.sm, background: CARD,
            border: `1px solid ${BORDER}`, borderRadius: R.sm,
          }}>
            <span style={{ flex: 1, fontSize: FS.xs, color: INK, fontFamily: sans }}>
              {labelFor(item.event)}
            </span>
            <Button
              variant="danger"
              size="sm"
              icon={<X size={10} />}
              onClick={() => cancelQueuedEvent(campaignId, item.queueId)}
              title="Cancel this queued intention before the next World Pulse"
            >
              Cancel
            </Button>
          </div>
        ))}
      </div>

      <p style={{ fontSize: FS.xxs, color: MUTED, margin: '8px 0 0', fontStyle: 'italic', lineHeight: 1.5 }}>
        These resolve simultaneously with every settlement when the world map advances time.
      </p>
    </div>
  );
}
