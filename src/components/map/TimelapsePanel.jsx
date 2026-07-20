/**
 * TimelapsePanel — THE TIMELAPSE scrubber (VISION WAVE V-3).
 *
 * A slider over the realm's advance history. Moving it sets the shared
 * `timelapseTick`, which drives the realm TimelapseLayer (event pulses + grew/
 * declined tint) AND — when a town map is open — the V-15 aged-map overlay. The
 * track derives lazily from the durable pulseHistory (buildTimelineTrack). Mounting
 * this panel ACTIVATES the timelapse (at the latest tick); unmounting DEACTIVATES it
 * (timelapseTick → null), so the overlays vanish and the live view returns exactly.
 *
 * A new lazy chunk (mounted in RealmInspector under Suspense). Zero eager.
 */

import { useEffect, useMemo } from 'react';
import { History, ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { buildTimelineTrack, frameAtTick } from '../../domain/display/timelineTrack.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';

/**
 * @param {Object} props
 * @param {any} props.campaign
 * @param {(id: string) => string} [props.nameFor]
 */
export default function TimelapsePanel({ campaign, nameFor }) {
  const timelapseTick = useStore((s) => s.timelapseTick);
  const setTimelapseTick = useStore((s) => s.setTimelapseTick);
  const resolveName = nameFor || ((id) => String(id));

  const track = useMemo(() => buildTimelineTrack({ worldState: campaign?.worldState }), [campaign]);
  const frames = track.frames;

  // Mounting activates the timelapse at the latest tick; unmounting returns to live.
  useEffect(() => {
    if (frames.length > 0) setTimelapseTick(track.maxTick);
    return () => setTimelapseTick(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.maxTick, frames.length]);

  if (frames.length === 0) {
    return (
      <div data-testid="timelapse-empty" style={{ padding: SP.md, border: `1px dashed ${BORDER2}`, color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 750, lineHeight: 1.5 }}>
        No history to replay yet. Advance the realm and the timelapse will let you scrub
        back through every pulse — who grew, who declined, and where the trouble struck.
      </div>
    );
  }

  const activeFrame = frameAtTick(track, timelapseTick);
  const idx = activeFrame ? Math.max(0, frames.findIndex((f) => f.tick === activeFrame.tick)) : frames.length - 1;
  const grew = activeFrame ? Object.values(activeFrame.deltas).filter((d) => d === 'up').length : 0;
  const fell = activeFrame ? Object.values(activeFrame.deltas).filter((d) => d === 'down').length : 0;
  const struckNames = activeFrame
    ? activeFrame.pulses.map((p) => resolveName(p.settlementId)).filter(Boolean).slice(0, 3)
    : [];

  const goto = (i) => {
    const clamped = Math.max(0, Math.min(frames.length - 1, i));
    setTimelapseTick(frames[clamped].tick);
  };

  return (
    <div data-testid="timelapse-panel" style={{ display: 'grid', gap: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
        <History size={13} /> Timelapse
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, padding: `6px ${SP.sm}px`, border: `1px solid ${BORDER}`, background: CARD_ALT }}>
        <Button variant="ghost" size="sm" aria-label="Earlier tick" disabled={idx <= 0} onClick={() => goto(idx - 1)} style={{ minHeight: undefined, padding: 2 }}>
          <ChevronLeft size={15} />
        </Button>
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>tick {activeFrame ? activeFrame.tick : '–'}</div>
          <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro }}>{idx + 1} of {frames.length}</div>
        </div>
        <Button variant="ghost" size="sm" aria-label="Later tick" disabled={idx >= frames.length - 1} onClick={() => goto(idx + 1)} style={{ minHeight: undefined, padding: 2 }}>
          <ChevronRight size={15} />
        </Button>
      </div>

      <input
        type="range"
        aria-label="Scrub the realm's history"
        min={0}
        max={frames.length - 1}
        value={idx}
        onChange={(e) => goto(Number(e.target.value))}
        style={{ width: '100%', accentColor: GOLD }}
      />

      <div data-testid="timelapse-frame-summary" style={{ color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.5, padding: SP.xs, background: CARD, border: `1px solid ${BORDER2}` }}>
        {activeFrame && activeFrame.pulses.length > 0
          ? <>Struck: {struckNames.join(', ')}{activeFrame.pulses.length > 3 ? ` +${activeFrame.pulses.length - 3}` : ''}. </>
          : 'A quiet advance. '}
        <span style={{ color: SECOND, fontWeight: 800 }}>{grew} grew · {fell} declined.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: MUTED, fontFamily: sans, fontSize: FS.micro }}>
        <Radio size={9} /> Scrubbing history — close this to return to the live realm.
      </div>
    </div>
  );
}
