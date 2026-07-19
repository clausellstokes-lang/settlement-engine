/**
 * components/townMap/SettlementMapSeasonControl — THE SEASON OVERRIDE control (THE ILLUSTRATED
 * TOWN, IT3-c).
 *
 * A compact DM affordance to PIN the illustrated map's season ("this is the winter map"),
 * independent of the live world clock — or 'Auto' to follow it. A SELF-CONTAINED LAZY LEAF: it
 * reads the current override from `mapEdits` and writes through the pane's single writer
 * (`onCommit(withSeasonOverride(...))`), so the max-lines-capped pane grows by ONE element, not a
 * block (all the read/write/positioning lives here). Choosing 'Auto' clears the key ⇒
 * byte-identical dormancy (the map follows the live season again).
 */
import { SEASON_OVERRIDE_IDS, readSeasonOverride, withSeasonOverride } from '../../domain/townMap/mapEdits.js';
import { BORDER, CARD, FS, INK, MUTED, R, sans } from '../theme.js';

/** Display labels for the bounded season vocabulary. */
const LABELS = { spring: 'Spring', summer: 'Summer', autumn: 'Autumn', winter: 'Winter' };

/**
 * @param {{ mapEdits: any, onCommit: (edits: any) => void }} props
 *   `mapEdits` is the pane's current cosmetic container; `onCommit` is its single writer.
 */
export default function SettlementMapSeasonControl({ mapEdits, onCommit }) {
  const value = readSeasonOverride(mapEdits);
  return (
    <span
      data-town-season
      style={{
        position: 'absolute', top: 8, right: 8, zIndex: 2,
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: sans, fontSize: FS.sm, color: MUTED,
      }}
    >
      <span>Season</span>
      <select
        aria-label="Map season"
        value={value || 'auto'}
        onChange={(e) => onCommit(withSeasonOverride(mapEdits, e.target.value === 'auto' ? null : e.target.value))}
        style={{
          fontFamily: sans, fontSize: FS.sm, color: INK, background: CARD,
          border: `1px solid ${BORDER}`, borderRadius: R?.sm ?? 4, padding: '3px 6px',
        }}
      >
        <option value="auto">Auto</option>
        {SEASON_OVERRIDE_IDS.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
      </select>
    </span>
  );
}
