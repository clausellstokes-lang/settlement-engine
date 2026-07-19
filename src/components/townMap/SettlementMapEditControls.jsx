/**
 * components/townMap/SettlementMapEditControls — SM-3 cosmetic edit chrome + legend
 * + the MAP STYLES lens switcher.
 *
 * Split out of SettlementMapPane (the pane stayed under the max-lines ceiling).
 * Presentational surfaces driven by props:
 *   • EDIT CHROME (reroll / labels / legend / reset) — rendered only when the pane
 *     says `editing` (canEdit + a saveId + desktop). Each button calls back into the
 *     pane, which commits through the store's applyMapEdit.
 *   • LEGEND — a district-category key. It is a legendPref honored for EVERY viewer
 *     (it rides the blob like a nudge), so its visibility is `showLegend`, NOT
 *     `editing`: a free-tier owner still sees a legend a premium editor turned on.
 *   • LENS SWITCHER — the four named lenses (parchment / watercolor / dark fantasy /
 *     VTT). Shown for EVERY viewer (switching is instant + free — a derived view);
 *     the choice PERSISTS only when the pane can edit (`lensPersisted`), else it is
 *     an ephemeral session preview. The switcher follows the legend model, not the
 *     edit chrome: a re-skin never touches geometry or an edit (non-destructive).
 *
 * Pure vector / theme tokens only; no lucide icons (the map's Icons-off posture).
 */
import Button from '../primitives/Button.jsx';
import { useStore } from '../../store/index.js';
import { BORDER, CARD, ELEV, FS, INK, MUTED, R, SP, sans } from '../theme.js';
import { resolveTownMapStyle } from '../../domain/townMap/index.js';
import { districtColor } from './palette.js';

/** A small drawn padlock — the map chrome is lucide-free (the fog controls precedent). */
function LockGlyph({ size = 14 }) {
  return (
    <svg data-testid="dm-pins-lock" width={size} height={size} viewBox="0 0 14 14" aria-hidden="true">
      <rect x="2.5" y="6" width="9" height="6.5" rx="1.5" fill="none" stroke={INK} strokeWidth="1.5" />
      <path d="M 4.5 6 V 4.2 a 2.5 2.5 0 0 1 5 0 V 6" fill="none" stroke={INK} strokeWidth="1.5" />
    </svg>
  );
}

/**
 * @param {{
 *   editing: boolean,
 *   showLegend: boolean,
 *   legendPrefs: { showLabels: boolean, showLegend: boolean },
 *   hasEdits: boolean,
 *   districts: Array<{ category: string }>,
 *   styleIds?: ReadonlyArray<string>,
 *   bespokeSkins?: ReadonlyArray<{ id: string, label: string }>,
 *   activeLens?: string,
 *   lensPersisted?: boolean,
 *   onPickLens?: (id: string) => void,
 *   onReroll: () => void,
 *   onToggleLabels: () => void,
 *   onToggleLegend: () => void,
 *   onReset: () => void,
 *   entitled?: boolean,
 *   savedMap?: boolean,
 * }} props
 */
export default function SettlementMapEditControls({
  editing, showLegend, legendPrefs, hasEdits, districts,
  styleIds, bespokeSkins, activeLens, lensPersisted, onPickLens,
  onReroll, onToggleLabels, onToggleLegend, onReset,
  annotating, onToggleAnnotate, entitled = false, savedMap = false,
}) {
  return (
    <>
      <MapLensSwitcher styleIds={styleIds} bespokeSkins={bespokeSkins} activeLens={activeLens} persisted={!!lensPersisted} onPickLens={onPickLens} />
      {/* THE DM PIN GATE (THE FREELY-GIVEN RULINGS: DM pins are Cartographer). The
          locked state is VISIBLE, never absent (the fog/mapChains premium-seam law):
          a free owner with a saved map sees the affordance with a drawn padlock +
          teaser; clicking fires the purchase modal (the cosmetic-edit gate's own
          moment — no new pricing-moment vocabulary). No annotate mode mounts and the
          stored annotations are never rewritten, so an upgrade restores them intact. */}
      {savedMap && !entitled && <LockedMarkers />}
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
          {typeof onToggleAnnotate === 'function' && (
            <Button data-town-edit-annotate variant={annotating ? 'primary' : 'secondary'} size="sm"
              aria-pressed={!!annotating} onClick={onToggleAnnotate}
              aria-label="Toggle DM marker placement — click the map to drop a labelled pin">
              Markers
            </Button>
          )}
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
 * THE LOCKED DM-PINS TEASER — the free-tier premium moment for DM markers. A drawn
 * padlock + one line of teaser + the "(Premium)" button that opens the purchase modal
 * (the fog controls' locked-panel precedent). Positioned where the working Markers
 * button would sit (top-right, the edit-chrome corner). It touches NO annotation state:
 * clicking only surfaces the pricing moment, so stored markers survive an upgrade.
 */
function LockedMarkers() {
  const setPurchaseModalOpen = useStore((s) => s.setPurchaseModalOpen);
  const onUnlock = () => { if (typeof setPurchaseModalOpen === 'function') setPurchaseModalOpen(true); };
  return (
    <div
      data-town-pins-locked
      style={{
        position: 'absolute', top: SP.sm, right: SP.sm, zIndex: 4,
        display: 'flex', flexDirection: 'column', gap: SP.xs, maxWidth: 'min(78vw, 220px)',
        padding: SP.sm, background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: R.md, boxShadow: ELEV[1], fontFamily: sans,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: SP.xs }}>
        <strong style={{ fontSize: FS.sm, letterSpacing: '0.02em', color: INK }}>DM markers</strong>
        <LockGlyph />
      </div>
      <div style={{ color: MUTED, fontSize: FS.xs }}>
        Drop labelled pins for secrets, quest hooks, and player-visible landmarks.
      </div>
      <Button
        variant="secondary" size="sm" onClick={onUnlock}
        aria-label="DM markers are a Cartographer premium feature — upgrade to unlock"
      >
        DM markers (Premium)
      </Button>
      <div style={{ color: MUTED, fontSize: FS.xs }}>Unlocks with Cartographer.</div>
    </div>
  );
}

/**
 * The MAP STYLES lens switcher — a compact segmented row (top-left), one button per
 * named lens. Shown for every viewer; the active lens is highlighted. Accessible
 * names via aria-label, never native title= (the guidance title= census is
 * shrink-only). Theme tokens only.
 *
 * THE SKIN REGISTRY (IT-4): saved bespoke skins (AI-minted style overhauls) are listed AFTER the
 * base lenses under a rubric DIVIDER, so a saved skin can finally be SELECTED and WORN (the dead
 * seam, closed). A skin button uses the skin's OWN saved label (not resolveTownMapStyle, which
 * would collapse a bespoke id to the parchment label) and, selected, wears the same active-highlight
 * as a base lens. Selecting one calls the same onPickLens the base lenses use — the render surfaces
 * resolve it through resolveActiveStyle. Absent any saved skins ⇒ no divider (byte-identical chrome).
 * @param {{ styleIds?: ReadonlyArray<string>, bespokeSkins?: ReadonlyArray<{ id:string, label:string }>,
 *   activeLens?: string, persisted: boolean, onPickLens?: (id:string)=>void }} props
 */
function MapLensSwitcher({ styleIds, bespokeSkins, activeLens, persisted, onPickLens }) {
  if (!Array.isArray(styleIds) || styleIds.length === 0 || typeof onPickLens !== 'function') return null;
  const skins = Array.isArray(bespokeSkins) ? bespokeSkins : [];
  return (
    <div
      data-town-lens-switcher
      style={{
        position: 'absolute', top: SP.sm, left: SP.sm, zIndex: 4,
        display: 'flex', flexWrap: 'wrap', gap: 2, maxWidth: 'calc(100% - 24px)',
        padding: 2, background: CARD, border: `1px solid ${BORDER}`,
        borderRadius: R.md, boxShadow: ELEV[1],
      }}
    >
      {styleIds.map((id) => {
        const on = id === activeLens;
        const label = resolveTownMapStyle(id).label;
        return (
          <Button
            key={id}
            data-town-lens={id}
            variant={on ? 'primary' : 'ghost'}
            size="sm"
            aria-pressed={on}
            onClick={() => onPickLens(id)}
            aria-label={`Draw this map in the ${label} lens${persisted ? ' and keep it as the chosen style' : ''}`}
            style={{ minHeight: 0, padding: '2px 8px' }}
          >
            {label}
          </Button>
        );
      })}
      {skins.length > 0 && (
        <>
          {/* THE RUBRIC DIVIDER — a thin vertical rule separating the shipped base lenses from
              the owner's saved AI skins (no lucide; a bare bordered span). */}
          <span
            data-town-lens-divider
            aria-hidden="true"
            style={{ alignSelf: 'stretch', width: 1, margin: '2px 4px', background: BORDER }}
          />
          {skins.map((skin) => {
            const on = skin.id === activeLens;
            return (
              <Button
                key={skin.id}
                data-town-skin={skin.id}
                variant={on ? 'primary' : 'ghost'}
                size="sm"
                aria-pressed={on}
                onClick={() => onPickLens(skin.id)}
                aria-label={`Draw this map in your saved skin ${skin.label}${persisted ? ' and keep it as the chosen style' : ''}`}
                style={{ minHeight: 0, padding: '2px 8px' }}
              >
                {skin.label}
              </Button>
            );
          })}
        </>
      )}
    </div>
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
