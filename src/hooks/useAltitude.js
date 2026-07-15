/**
 * useAltitude — the single progressive-disclosure "altitude" hook (UX overhaul
 * Phase 1, plan §3.2).
 *
 * Returns the current altitude level (the persisted `userPrefs.detailLevel`) plus
 * a setter, so any surface can decide how much engine depth to render from ONE
 * axis rather than a scatter of per-surface depth flags. The three rungs:
 *
 *   'guided'   → Overview  (a new DM's clean face)
 *   'standard' → Detail    (band pills + plain "why")
 *   'expert'   → Engine    (full causal grid + pressures + strength)
 *
 * Pure store binding — no side effects beyond the setter. The default
 * ('guided') and validation live in uiSlice; this hook is the read/write seam
 * components consume.
 *
 *   const { level, setLevel, is } = useAltitude();
 *   if (is.expert) { ...render the 16-var grid... }
 */

import { useStore } from '../store/index.js';
import { DEFAULT_DETAIL_LEVEL } from '../store/uiSlice.js';

/**
 * @typedef {'guided'|'standard'|'expert'} AltitudeLevel
 */

/**
 * @returns {{
 *   level: AltitudeLevel,
 *   setLevel: (level: AltitudeLevel) => void,
 *   is: { guided: boolean, standard: boolean, expert: boolean },
 *   atLeast: (min: AltitudeLevel) => boolean,
 * }}
 */
export function useAltitude() {
  const level = /** @type {AltitudeLevel} */ (
    useStore(s => s.userPrefs?.detailLevel) || DEFAULT_DETAIL_LEVEL
  );
  const setLevel = useStore(s => s.setDetailLevel);
  return {
    level,
    setLevel,
    is: {
      guided: level === 'guided',
      standard: level === 'standard',
      expert: level === 'expert',
    },
    // Depth gate: true when the current rung is at or above `min`. Lets a block
    // say `atLeast('standard')` to show from Detail upward.
    atLeast: (min) => ALTITUDE_RANK[level] >= (ALTITUDE_RANK[min] ?? 0),
  };
}

/** Ascending depth rank for `atLeast` comparisons. */
const ALTITUDE_RANK = Object.freeze({ guided: 0, standard: 1, expert: 2 });

export { ALTITUDE_RANK };
