/**
 * components/townMap/MapTabShell — TC-0, THE DOSSIER MAP TAB SUB-TAB SHELL
 * (DESIGN_TOWN_CARTOGRAPHY.md §12 / J-TC-8, BINDING).
 *
 * The Map tab stops being one surface and becomes a CONTAINER with one sub-tab
 * per settlement map presentation:
 *
 *     Map ▸ [ Plan | Panorama | 3D Portrait | Player View ]
 *
 * §12 seats `Illustrated` here too; that id joins the vocabulary at TC-5, when
 * the cartography painter exists to render it. The shell ships FIRST, on the
 * presentations that already work, so the UI restructure is proven long before
 * the new renderer lands.
 *
 * ONE TAB SYSTEM, NOT TWO. The projections were previously chosen by a Segmented
 * switch floating over the plan inside SettlementMapPane. This shell takes that
 * choice over through the pane's optional `presentation` / `onPresentationChange`
 * seam, and the pane's own switch stands down (`showSwitch={false}`) while the
 * shell drives. Every OTHER mount of the pane (the public gallery dossier, the
 * library hero) passes no presentation and is unchanged.
 *
 * PRESENCE, NEVER DISABLED. Which sub-tabs exist is decided by the headless
 * `resolveMapSubTabs` (src/lib/mapSubTabs.js) from resolved facts, so the rule is
 * pinned directly rather than read out of a rendered strip — the
 * `realmInspectorSectionsFor` idiom. A dark 3D portrait, or a machine with no
 * WebGL2, has no Portrait tab at all; a visitor or an unsaved draft has no Player
 * View tab.
 *
 * LAZY BY CONSTRUCTION (§7: first-paint cost ZERO). This chrome holds NO static
 * edge to any map body: both leaves are `lazy(() => import(...))`, and the shell
 * itself is reached only through OutputContainer's own lazy Map mount. Pinned in
 * three layers by tests/build/mapTabShellLazy.test.js, including the SECOND
 * assertion (the parent is itself lazy, so entry-absence alone proves nothing:
 * each leaf must ride a chunk of its own) and the THIRD (the chrome's static
 * import list must not name the heavy leaf at all).
 *
 * STATE. The selected sub-tab is a DEVICE display preference
 * (`displayPrefs.mapSubTab`, the persisted bag), addressable by a deep link
 * (`?mapview=<id>`) and re-normalized against the present set on every render so
 * a stale link or a retired id lands on Plan instead of an empty panel.
 * Presentation choices are mirrored into the existing device-local last-viewed
 * sidecar so THE LIVING BACKDROP keeps washing the composition the owner last
 * looked at.
 */

import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { BORDER, CARD, FS, INK, MUTED, SP, sans } from '../theme.js';
import MobileTabStrip from '../primitives/MobileTabStrip.jsx';
import { useStore } from '../../store/index.js';
import { useFlag } from '../../lib/flags.js';
import { detectTownSceneCapability } from '../../lib/townScene/viewPolicy.js';
import { readLastMapView, writeLastMapView } from '../../lib/lastMapView.js';
import {
  MAP_SUB_TAB_PLAYER,
  normalizeMapSubTab,
  presentationViewFor,
  readMapSubTabParam,
  resolveMapSubTabs,
  townSceneSelectable,
} from '../../lib/mapSubTabs.js';

// THE TWO LEAVES. Both behind lazy() — a static edge here would fold a map body
// into the dossier chunk every reader pays for whether or not they open the Map
// tab. The plan/panorama/portrait projections share ONE leaf on purpose: they are
// three views of one mounted pane, so switching between them must not tear down
// the camera, the pinned card, or the fog session.
const SettlementMapPane = lazy(() => import('./SettlementMapPane.jsx'));
const MapPlayerSubTab = lazy(() => import('./subtabs/MapPlayerSubTab.jsx'));

const ID_PREFIX = 'sfmap';

/**
 * Build sentinel (the TOWN_SCENE_3D_LAZY_SENTINEL precedent). A string literal
 * survives minification, so this is a stable fingerprint of THIS module in a
 * built chunk. tests/build/mapTabShellLazy.test.js reads it to prove the shell
 * rides a chunk of its own, separate from the map bodies it mounts — the check
 * that an entry-closure absence test cannot make, because the shell's own parent
 * is already lazy.
 */
export const MAP_TAB_SHELL_LAZY_SENTINEL = 'settlementforge:map-tab-shell:lazy-v1';

/** The narrated wait. The witnessed-wait ratchet forbids a silent boundary here:
 *  a map body is a perceptible surface, so it says what is being drawn. */
function MapSubTabWaiting() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        minHeight: 240, display: 'grid', placeItems: 'center', gap: SP.xs,
        padding: SP.lg, background: CARD, border: `1px solid ${BORDER}`,
        fontFamily: sans, fontSize: FS.sm, color: MUTED, textAlign: 'center',
      }}
    >
      <div style={{ color: INK, fontWeight: 800 }}>Unfolding the surveyor&rsquo;s sheets&hellip;</div>
      <div>The streets are inked before the roofs.</div>
    </div>
  );
}

/**
 * @param {{
 *   settlement: any,
 *   canEdit?: boolean,
 *   saveId?: string|number|null,
 *   worldState?: any,
 *   regionalGraph?: any,
 *   audience?: 'dm'|'player'|'public',
 * }} props
 * The prop surface is deliberately IDENTICAL to SettlementMapPane's, so the
 * dossier's Map case swapped one mount for another with no threading change.
 */
export default function MapTabShell({
  settlement,
  canEdit = false,
  saveId = null,
  worldState = null,
  regionalGraph = null,
  audience = 'dm',
}) {
  // Portrait PRESENCE and portrait SELECTABILITY are the same question, asked
  // through the same helper the pane's presentation hook uses — two spellings of
  // one predicate is how a strip offers a tab the renderer then refuses.
  const sceneFlagOn = useFlag('settlementScene3d');
  const [sceneCapability] = useState(() => detectTownSceneCapability());
  const sceneAvailable = townSceneSelectable(sceneFlagOn, sceneCapability);

  const present = useMemo(
    () => resolveMapSubTabs({ audience, sceneAvailable, savedMap: saveId != null }),
    [audience, sceneAvailable, saveId],
  );

  const persistedSubTab = useStore((s) => s.displayPrefs?.mapSubTab);
  const setMapSubTab = useStore((s) => s.setMapSubTab);

  // The deep link is read ONCE, at mount, exactly like the handbook's `?tab=`
  // precedent: an address is an opening instruction, not a live binding that
  // would fight the reader's own clicks for the rest of the session.
  const [chosen, setChosen] = useState(
    () => readMapSubTabParam(typeof window === 'undefined' ? '' : window.location.search),
  );

  // Re-normalized EVERY render against what is actually present, so a retired id,
  // a hand-typed link, or a portrait tab that vanished when WebGL failed all land
  // on Plan rather than on an empty panel.
  const selected = normalizeMapSubTab(chosen ?? persistedSubTab, present);

  const selectSubTab = useCallback((id, { focus = false } = {}) => {
    setChosen(id);
    if (typeof setMapSubTab === 'function') setMapSubTab(id);
    // Mirror a PRESENTATION choice into the device-local last-viewed sidecar so
    // THE LIVING BACKDROP keeps its composition. Read-modify-write: the sidecar
    // also carries the lens, and a blind write would erase it. A non-presentation
    // sub-tab writes nothing — `player` is not in that vocabulary and would be
    // silently coerced to 'plan', recording a view nobody chose.
    const view = presentationViewFor(id);
    if (view && saveId != null) {
      writeLastMapView(saveId, { view, lens: readLastMapView(saveId)?.lens ?? undefined });
    }
    if (focus && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        try { document.getElementById(`${ID_PREFIX}-tab-${id}`)?.focus(); } catch { /* no-op */ }
      });
    }
  }, [saveId, setMapSubTab]);

  // A presentation change reported from BELOW: the pane's own recovery paths (a
  // WebGL/chunk failure returning to the plan, or the "Use 2D plan" button in the
  // scene's waiting state). The strip follows the pane down and takes focus,
  // because the control the reader was standing on has just unmounted.
  const handlePresentationChange = useCallback((view) => {
    selectSubTab(view, { focus: true });
  }, [selectSubTab]);

  if (!selected) return null;

  return (
    <div data-map-tab-shell={MAP_TAB_SHELL_LAZY_SENTINEL}>
      <MobileTabStrip
        tabs={present}
        value={selected}
        onChange={(id) => selectSubTab(id)}
        ariaLabel="Map views"
        idPrefix={ID_PREFIX}
      />
      <div
        role="tabpanel"
        id={`${ID_PREFIX}-panel-${selected}`}
        aria-labelledby={`${ID_PREFIX}-tab-${selected}`}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- WAI-ARIA tabs pattern: a tabpanel is an intentional focus stop so keyboard users can reach and scroll the panel after the tablist; tabIndex=0 is the spec-mandated affordance here
        tabIndex={0}
      >
        <Suspense fallback={<MapSubTabWaiting />}>
          {selected === MAP_SUB_TAB_PLAYER ? (
            <MapPlayerSubTab settlement={settlement} />
          ) : (
            <SettlementMapPane
              settlement={settlement}
              canEdit={canEdit}
              saveId={saveId}
              worldState={worldState}
              regionalGraph={regionalGraph}
              audience={audience}
              presentation={selected}
              onPresentationChange={handlePresentationChange}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
}
