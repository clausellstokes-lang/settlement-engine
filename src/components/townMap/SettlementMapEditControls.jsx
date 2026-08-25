/**
 * components/townMap/SettlementMapEditControls — SM-3 cosmetic edit chrome + legend.
 *
 * Split out of SettlementMapPane (the pane stayed under the max-lines ceiling). Two
 * pure, presentational surfaces driven by props:
 *   • EDIT CHROME (reroll / labels / legend / reset) — rendered only when the pane
 *     says `editing` (canEdit + a saveId + desktop). Each button calls back into the
 *     pane, which commits through the store's applyMapEdit.
 *   • LEGEND — a district-category key. It is a legendPref honored for EVERY viewer
 *     (it rides the blob like a nudge), so its visibility is `showLegend`, NOT
 *     `editing`: a free-tier owner still sees a legend a premium editor turned on.
 *
 * Pure vector / theme tokens only; no lucide icons (the map's Icons-off posture).
 */
import Button from '../primitives/Button.jsx';
import { BORDER, CARD, ELEV, FS, INK, R, SP, sans } from '../theme.js';
import { districtColor } from './palette.js';

/**
 * @param {{
 *   editing: boolean,
 *   showLegend: boolean,
 *   legendPrefs: { showLabels: boolean, showLegend: boolean },
 *   hasEdits: boolean,
 *   districts: Array<{ category: string }>,
 *   onReroll: () => void,
 *   onToggleLabels: () => void,
 *   onToggleLegend: () => void,
 *   onReset: () => void,
 * }} props
 */
export default function SettlementMapEditControls({
  editing, showLegend, legendPrefs, hasEdits, districts,
  onReroll, onToggleLabels, onToggleLegend, onReset,
}) {
  return (
    <>
      {editing && (
        <div
          data-town-edit-chrome
          style={{
            position: 'absolute', top: SP.sm, right: SP.sm, zIndex: 4,
            display: 'flex', flexWrap: 'wrap', gap: SP.xs, maxWidth: 'calc(100% - 24px)',
            padding: SP.xs, background: CARD, border: `1px solid ${BORDER}`,
            borderRadius: R.md, boxShadow: ELEV[1],
          }}
        >
          {/* Accessible names via aria-label, never native title= — the guidance
              layer's title= census is shrink-only (guidanceRegistry.walker). */}
          <Button data-town-edit-reroll variant="secondary" size="sm" onClick={onReroll}
            aria-label="Reroll the layout — same settlement, a different deterministic arrangement">
            Reroll layout
          </Button>
          <Button data-town-edit-labels variant={legendPrefs.showLabels ? 'primary' : 'secondary'} size="sm"
            aria-pressed={legendPrefs.showLabels} onClick={onToggleLabels}
            aria-label="Show or hide district name labels">
            Labels
          </Button>
          <Button data-town-edit-legend variant={legendPrefs.showLegend ? 'primary' : 'secondary'} size="sm"
            aria-pressed={legendPrefs.showLegend} onClick={onToggleLegend}
            aria-label="Show or hide the district-category legend">
            Legend
          </Button>
          <Button data-town-edit-reset variant="ghost" size="sm" disabled={!hasEdits} onClick={onReset}
            aria-label="Clear all cosmetic map edits — restores the generated layout">
            Reset
          </Button>
        </div>
      )}
      {showLegend && <MapLegend districts={districts} />}
    </>
  );
}

/**
 * District-category legend (a legendPref surface). Lists the DISTINCT district
 * categories present on the map with their tint swatch — pure view. Non-interactive.
 * @param {{ districts: Array<{ category: string }> }} props
 */
function MapLegend({ districts }) {
  const cats = [];
  const seen = new Set();
  for (const d of districts) {
    const c = d.category || 'other';
    if (!seen.has(c)) { seen.add(c); cats.push(c); }
  }
  cats.sort();
  if (cats.length === 0) return null;
  return (
    <div
      data-town-legend
      style={{
        position: 'absolute', bottom: SP.sm, left: SP.sm, zIndex: 3,
        display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '40%', overflow: 'auto',
        padding: `${SP.xs}px ${SP.sm}px`, background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: R.md, boxShadow: ELEV[1], pointerEvents: 'none',
      }}
    >
      {cats.map((c) => (
        <div key={c} style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: districtColor(c), flexShrink: 0 }} />
          <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, textTransform: 'capitalize' }}>{c}</span>
        </div>
      ))}
    </div>
  );
}
