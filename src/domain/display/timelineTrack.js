/**
 * domain/display/timelineTrack.js — THE TIMELAPSE track (VISION WAVE V-3).
 *
 * "Scrub the realm's history." No per-tick world snapshots exist (correctly — too
 * big); the track DERIVES lazily from the DURABLE `worldState.pulseHistory[]` (the
 * collapsed per-advance records). Each advance becomes one FRAME carrying its event
 * PULSES (which settlements were struck, and how hard) and its settlement TINT
 * DELTAS (who grew / who declined that advance, from the record's populationDeltas).
 * The overlay interpolates across frames as the scrubber moves.
 *
 * Pure, deterministic, RNG-free, clock-free — a view-time projection over the
 * durable store only (the chronicle/SM town-map precedent). Zero engine import.
 * Absent/empty pulseHistory ⇒ an empty track ⇒ the overlay renders nothing
 * (byte-inert to a world that never advanced).
 *
 * @enforced-by tests/domain/timelineTrack.test.js (derivation + determinism) and
 *   tests/property/timelineTrackGolden.test.js (the same-seed track hash).
 */

/** Codepoint-stable compare (never locale-sensitive). */
const byStr = (/** @type {string} */ a, /** @type {string} */ b) => (a < b ? -1 : a > b ? 1 : 0);

/**
 * @typedef {Object} TimelinePulse
 * @property {string} settlementId
 * @property {number} severity      the strongest event severity striking it this frame (0..1)
 */

/**
 * @typedef {Object} TimelineFrame
 * @property {number} tick
 * @property {TimelinePulse[]} pulses                     sorted by settlementId
 * @property {Record<string, 'up'|'down'>} deltas         population delta sign per settlement this frame
 */

/**
 * @typedef {Object} TimelineTrack
 * @property {number[]} ticks         ascending advance ticks (aligned with frames)
 * @property {TimelineFrame[]} frames ascending by tick
 * @property {number|null} minTick
 * @property {number|null} maxTick
 */

/** The raw fields a pulse record's outcome carries that this reads. Everything else rides through.
 * @typedef {Object} TrackOutcome
 * @property {number} [severity]
 * @property {ReadonlyArray<string>} [settlementIds]
 * @property {ReadonlyArray<string>} [affectedSettlementIds]
 * @property {{ id?: string, severity?: number, affectedSettlementIds?: ReadonlyArray<string> }} [stressor]
 * @property {Record<string, number>} [populationDeltas]
 */

/**
 * Aggregate one advance record into a frame. Deterministic: settlement ids sorted,
 * severity is the MAX event severity striking a settlement, delta sign is from the
 * record's populationDeltas (positive ⇒ 'up', negative ⇒ 'down'; zero omitted).
 * @param {number} tick
 * @param {ReadonlyArray<TrackOutcome>} outcomes
 * @returns {TimelineFrame}
 */
function frameFromOutcomes(tick, outcomes) {
  /** @type {Map<string, number>} */
  const severityBy = new Map();
  /** @type {Map<string, number>} */
  const deltaBy = new Map();
  const strike = (/** @type {string} */ id, /** @type {number} */ sev) => {
    if (!id) return;
    const prev = severityBy.get(id);
    if (prev == null || sev > prev) severityBy.set(id, sev);
  };
  for (const o of outcomes) {
    const sev = Number.isFinite(o?.severity) ? Number(o.severity) : (Number.isFinite(o?.stressor?.severity) ? Number(o.stressor?.severity) : 0);
    for (const id of o?.settlementIds || []) strike(String(id), sev);
    for (const id of o?.affectedSettlementIds || []) strike(String(id), sev);
    for (const id of o?.stressor?.affectedSettlementIds || []) strike(String(id), sev);
    const pops = o?.populationDeltas;
    if (pops && typeof pops === 'object') {
      for (const [saveId, delta] of Object.entries(pops)) {
        const d = Number(delta);
        if (Number.isFinite(d) && d !== 0) deltaBy.set(String(saveId), (deltaBy.get(String(saveId)) || 0) + d);
      }
    }
  }
  /** @type {TimelinePulse[]} */
  const pulses = [...severityBy.keys()].sort(byStr).map((settlementId) => ({ settlementId, severity: severityBy.get(settlementId) || 0 }));
  /** @type {Record<string, 'up'|'down'>} */
  const deltas = {};
  for (const id of [...deltaBy.keys()].sort(byStr)) {
    const total = deltaBy.get(id) || 0;
    if (total > 0) deltas[id] = 'up';
    else if (total < 0) deltas[id] = 'down';
  }
  return { tick, pulses, deltas };
}

/**
 * Build the timelapse track from a worldState's durable pulseHistory. Frames are
 * ascending by tick; ties (rare — one record per tick) collapse by keeping the
 * later record's outcomes appended (still deterministic).
 * @param {Object} args
 * @param {unknown} args.worldState
 * @returns {TimelineTrack}
 */
export function buildTimelineTrack({ worldState }) {
  const ws = worldState && typeof worldState === 'object' ? /** @type {Record<string, unknown>} */ (worldState) : null;
  const history = ws && Array.isArray(ws.pulseHistory) ? ws.pulseHistory : [];
  /** @type {Array<{ tick: number, record: Record<string, unknown> }>} */
  const records = [];
  for (const record of history) {
    if (!record || typeof record !== 'object') continue;
    const r = /** @type {Record<string, unknown>} */ (record);
    const tick = Number.isFinite(r.tick) ? Number(r.tick) : 0;
    records.push({ tick, record: r });
  }
  records.sort((a, b) => a.tick - b.tick || 0);
  /** @type {TimelineFrame[]} */
  const frames = records.map(({ tick, record }) => {
    const selected = Array.isArray(record.selectedOutcomes) ? /** @type {ReadonlyArray<TrackOutcome>} */ (record.selectedOutcomes) : [];
    const impacts = Array.isArray(record.impactDigest) ? /** @type {ReadonlyArray<TrackOutcome>} */ (record.impactDigest) : [];
    return frameFromOutcomes(tick, [...selected, ...impacts]);
  });
  const ticks = frames.map((f) => f.tick);
  return {
    ticks,
    frames,
    minTick: ticks.length ? ticks[0] : null,
    maxTick: ticks.length ? ticks[ticks.length - 1] : null,
  };
}

/**
 * The frame to render at a scrub tick: the latest frame whose tick ≤ scrubTick, or
 * the first frame when scrubTick precedes the track (a stable, total lookup).
 * Returns null for an empty track.
 * @param {TimelineTrack} track
 * @param {number|null} scrubTick  null ⇒ the latest frame (live)
 * @returns {TimelineFrame|null}
 */
export function frameAtTick(track, scrubTick) {
  const frames = track && Array.isArray(track.frames) ? track.frames : [];
  if (frames.length === 0) return null;
  if (scrubTick == null) return frames[frames.length - 1];
  const t = Number(scrubTick);
  let chosen = frames[0];
  for (const f of frames) {
    if (f.tick <= t) chosen = f; else break;
  }
  return chosen;
}
