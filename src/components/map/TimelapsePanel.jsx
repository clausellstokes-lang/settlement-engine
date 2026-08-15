/**
 * TimelapsePanel — THE TIMELAPSE scrubber (VISION WAVE V-3).
 *
 * A slider over the realm's advance history. Moving it sets the shared
 * `timelapseTick`, which drives the realm TimelapseLayer (event pulses + grew/
 * declined tint) AND — when a town map is open — the V-15 aged-map overlay. The
 * track derives lazily from the durable pulseHistory (buildTimelineTrack). Mounting
 * this panel ACTIVATES the timelapse (at the latest tick); unmounting RESTORES the
 * tick that stood before it mounted — null in the common case (the overlays vanish
 * and the live view returns exactly), or the town map's own "Show the years" week,
 * so a visit to this panel never discards that toggle's selection (SB2).
 *
 * A new lazy chunk (mounted in RealmInspector under Suspense). Zero eager.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { History, ChevronLeft, ChevronRight, Radio, Download } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { buildTimelineTrack, frameAtTick, trackSettlementIds, settlementTimeline, serializeTimelapseClip } from '../../domain/display/timelineTrack.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, SP, sans, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { slugify } from '../../kernel/slugify.js';

const SELECT_STYLE = { fontSize: FS.micro, color: swatch.inkMag2, background: swatch['#FAF8F4'], border: `1px solid ${swatch['#EDE3CC']}`, padding: '3px 5px', maxWidth: '100%' };
/** A filesystem-safe slug from a campaign name (the export-filename idiom, kernel primitive). */
const clipSlug = (name) => slugify(name || 'realm', { fallback: 'realm' });

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

  // V-25d — the per-settlement drill (a pure slice of the same track).
  const [drillId, setDrillId] = useState('');
  const drillIds = useMemo(() => trackSettlementIds(track), [track]);
  const drill = useMemo(() => (drillId ? settlementTimeline(track, drillId) : null), [track, drillId]);

  // V-25d — export-as-clip: a deterministic, encode-free JSON frame sequence.
  const onExportClip = async () => {
    const clip = serializeTimelapseClip(track);
    const { downloadBlob } = await import('../../lib/townMapExport.js');
    const blob = new Blob([JSON.stringify(clip, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `timelapse-${clipSlug(campaign?.name)}.json`);
  };

  // Mounting activates the timelapse at the latest tick; unmounting RESTORES the
  // pre-mount tick, not a blanket null — the shared timelapseTick also carries the
  // town map's "Show the years" selection (SettlementMapEditControls), and a null
  // here silently discarded it. The ref captures the store value at first render
  // (before the mount effect writes), so restore is exact; null pre-mount (the
  // common case) still returns the live view exactly as before.
  const preMountTick = useRef(timelapseTick);
  useEffect(() => {
    const restoreTick = preMountTick.current; // captured once at first render; never reassigned
    if (frames.length > 0) setTimelapseTick(track.maxTick);
    return () => setTimelapseTick(restoreTick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.maxTick, frames.length]);

  if (frames.length === 0) {
    return (
      <div data-testid="timelapse-empty" style={{ padding: SP.md, border: `1px dashed ${BORDER2}`, color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 750, lineHeight: 1.5 }}>
        No history to replay yet. Advance the realm and the timelapse will let you scrub
        back through every pulse: who grew, who declined, and where the trouble struck.
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

      {/* V-25d — PER-SETTLEMENT DRILL: one settlement's slice of the same history. */}
      {drillIds.length > 0 && (
        <div style={{ display: 'grid', gap: 4, padding: SP.xs, border: `1px solid ${BORDER2}`, background: CARD }}>
          <label htmlFor="timelapse-drill" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: FS.micro, color: MUTED, fontWeight: 800 }}>
            Drill into
            <select id="timelapse-drill" aria-label="Drill into a settlement's history" value={drillId} onChange={(e) => setDrillId(e.target.value)} style={SELECT_STYLE}>
              <option value="">the whole realm</option>
              {drillIds.map((id) => <option key={id} value={id}>{resolveName(id) || id}</option>)}
            </select>
          </label>
          {drill && (
            <div data-testid="timelapse-drill-summary" style={{ color: BODY, fontFamily: sans, fontSize: FS.micro, lineHeight: 1.5 }}>
              {drill.points.length === 0
                ? <>Never struck, never moved. Quiet through every advance.</>
                : <>Struck <b>{drill.struck}</b>{drill.peakSeverity > 0 ? ` (peak ${Math.round(drill.peakSeverity * 100) / 100})` : ''} · <span style={{ color: SECOND, fontWeight: 800 }}>grew {drill.grew} · declined {drill.declined}</span> across {drill.points.length} advance{drill.points.length === 1 ? '' : 's'}.</>}
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap' }}>
        <Button variant="ghost" size="sm" onClick={onExportClip} aria-label="Export the timelapse as a deterministic clip (JSON frame sequence)">
          <Download size={12} /> Export clip
        </Button>
        <span style={{ fontSize: FS.micro, color: MUTED }}>A replayable frame sequence: no video, just the history itself.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: MUTED, fontFamily: sans, fontSize: FS.micro }}>
        <Radio size={9} /> Scrubbing history. Close this to return to the live realm.
      </div>
    </div>
  );
}
