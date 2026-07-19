/**
 * components/townMap/SettlementMapPane — the SM-2 town-map VIEWER.
 *
 * Renders buildTownMapModel(settlement) — a deterministic, view-time 0..1000 ×
 * 0..1000 vector model (SM-1, src/domain/townMap/) — as a pan/zoom SVG map. The
 * model persists NOTHING onto the settlement, so this pane adds no state and no
 * golden shift; it is pure derivation on top of the frozen model.
 *
 * Interaction (the two-tier QuickInspector precedent):
 *   • desktop hover (non-touch) → a transient card/label;
 *   • click / touch tap → a PINNED card that stays until dismissed or another
 *     pin. The displayed card = pinned ?? hovered.
 *   • building → the real InstitutionCard popover (parity by construction — it
 *     re-derives deriveInstitutionProfile internally, reading no store/config).
 *   • district → a map-native district card (deriveAllDistricts, joined by id).
 *   • hazard / condition overlays → a small label.
 *
 * Camera clones MapOverlay's self-owned image-mode pan/zoom: a plain transform
 * ref mutated by direct DOM writes (no per-frame re-render), a pixel-rect viewBox
 * with a contain-fit of the 0..1000 space, wheel zoom-at-cursor, and two-pointer
 * pinch. Pure vector only — NO <image>, NO lucide imports here; colors are theme
 * tokens (the no-raw-color lint bans raw hex).
 *
 * SM-3 — cosmetic editing (design §5, Class A). When `canEdit` (the same
 * premium/founder gate SettlementDetail uses) AND a `saveId` exists AND the
 * pointer is fine (desktop), the pane exposes cosmetic affordances: drag-to-nudge
 * a building/district (the PlacementsLayer precedent — pointer capture, dead-zone,
 * commit-on-up), a layout-variant REROLL, and label/legend prefs. Each commits
 * through the store's `applyMapEdit` action (the applyEvent persist triple) into
 * the blob-resident `settlement.mapEdits`, so the edit rides the dossier through
 * every lifecycle path (save/load, snapshot/revert, undo, export/import). VIEWING
 * stays free on every tier and platform; the mobile posture holds (view + hover
 * only). Derivation is tier-NEUTRAL — the model takes no entitlement input, so the
 * same seed+variant lays out identically for every tier.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AMBER, AMBER_BG, BLUE, BORDER, BORDER_STRONG, CARD, GOLD, INK, MUTED, PARCH, R, RED, RED_BG, sans,
} from '../theme.js';
import InstitutionCard from '../primitives/InstitutionCard.jsx';
import { useStore } from '../../store/index.js';
// THE LIVING BACKDROP (owner ruling 2026-07-18) — device-local last-viewed {view,lens}
// memory. Written here (READ-ONLY to map state; never touches the mapEdits blob); read
// by the library dossier's SettlementDossierBackdrop wash. Fail-silent leaf.
import { writeLastMapView } from '../../lib/lastMapView.js';
import {
  buildTownMapModel, viewerPalette, TOWN_MAP_STYLE_IDS, DEFAULT_STYLE_ID,
  buildTownMapPanoramaDrawList, buildChangeView,
} from '../../domain/townMap/index.js';
import {
  readMapEdits, readLegendPrefs, readStyleLens, normalizeMapEdits,
  withPinNudge, withLayoutVariant, nextLayoutVariant, withLegendPref, withStyleLens,
} from '../../domain/townMap/mapEdits.js';
import { deriveAllDistricts } from '../../domain/districtProfile.js';
import { buildingHoverModel } from './hoverModel.js';
import { districtProvenance, mapProvenanceStory } from './provenanceModel.js';
import { buildEdgeAnnotations } from './edgeAnnotations.js';
import { districtColor } from './palette.js';
import SettlementMapNotes from './SettlementMapNotes.jsx';
import SettlementMapEdgeLabels from './SettlementMapEdgeLabels.jsx';
import SettlementMapAnnotations from './SettlementMapAnnotations.jsx';
import AnnotationComposer from './AnnotationComposer.jsx';
import { useMapCamera } from './useMapCamera.js';
import { useMapAnnotations } from './useMapAnnotations.js';
import { useMapLayerAnalytics } from './useMapLayerAnalytics.js';
import SettlementMapEditControls from './SettlementMapEditControls.jsx';
import SettlementMapExportMenu from './SettlementMapExportMenu.jsx';
import SettlementMapPanorama from './SettlementMapPanorama.jsx';
import Segmented from '../primitives/Segmented.jsx';
import { FloatingLabel, DistrictCard } from './SettlementMapCards.jsx';
// THE NON-WATER LANDFORM (task #38 fenced follow-up) — the marsh/dune/mountain terrain
// texture, drawn under the urban layer from the SAME marks the exports use. A lazy leaf
// (re-export idiom) so the max-lines-capped pane grows by one element, not a block.
import SettlementMapLandform from './SettlementMapLandform.jsx';
// DOOR 2 — THE TABLE LAYER (fog of war). The pane threads three leaves: the map-space overlay
// (+ the reveal-brush capture), the wiring hook (optimistic mirror + persist + controller), and
// the DM chrome (controls + lazy player view + handout export). Kept out-of-file so the pane
// (a max-lines-capped hot file) grows by a handful of lines, not a block (lazy leaf + re-export).
import SettlementMapFog, { FogBrushCapture } from './fog/SettlementMapFog.jsx';
import SettlementMapFogChrome from './fog/SettlementMapFogChrome.jsx';
import { useFogLayer } from './fog/useFogLayer.js';

const pointsOf = (polygon) => polygon.map(([x, y]) => `${x},${y}`).join(' ');
// Apply a transient drag-preview offset (map units) to a polygon / point.
const offsetPoints = (polygon, p) => (p ? polygon.map(([x, y]) => [x + p.dx, y + p.dy]) : polygon);
const offsetXY = (x, y, p) => (p ? { x: x + p.dx, y: y + p.dy } : { x, y });

/** VTT grid line segments across the 0..1000 view space, every `step` units. */
function gridLines(step) {
  const lines = [];
  for (let x = step; x < 1000; x += step) lines.push({ x1: x, y1: 0, x2: x, y2: 1000 });
  for (let y = step; y < 1000; y += step) lines.push({ x1: 0, y1: y, x2: 1000, y2: y });
  return lines;
}


/** True when the device has a fine pointer (desktop) — the edit posture. Absent
 *  matchMedia (SSR / jsdom) ⇒ treat as desktop so the affordances are testable;
 *  real mobile browsers report coarse and hide them. */
function detectFinePointer() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  try { return window.matchMedia('(pointer: fine)').matches; } catch { return true; }
}

/**
 * @param {{ settlement: any, canEdit?: boolean, saveId?: string|number|null }} props
 */
export default function SettlementMapPane({ settlement, canEdit = false, saveId = null }) {
  const applyMapEdit = useStore(s => s.applyMapEdit);

  // ── SM-3 cosmetic edit state ────────────────────────────────────────────────
  // Local OPTIMISTIC working edits (the PlacementsLayer dragPreview precedent):
  // the model re-derives instantly, while applyMapEdit persists the blob-resident
  // truth. Seeded from the settlement's persisted mapEdits; re-seeded when a
  // DIFFERENT settlement is opened (keyed on its stable id). Absent ⇒ null ⇒ the
  // model is byte-identical to view-only (the dormancy law).
  const settlementKey = settlement?.id ?? settlement?._seed ?? null;
  const [mapEdits, setMapEdits] = useState(() => readMapEdits(settlement));
  // Re-seed the optimistic edits when a DIFFERENT settlement is opened — the
  // React "adjust state on prop change" pattern (a setState DURING render, not in
  // an effect: it re-renders before commit, no cascading effect). Keyed on the
  // stable settlement id so re-renders of the SAME settlement keep the working edits.
  // MAP STYLES: an EPHEMERAL lens override so any viewer (owner, or a read-only
  // gallery visitor) can flip lenses instantly + free — a derived view. The
  // persisted choice (settlement.mapEdits.styleLens) is the base; the override wins
  // for the session. Re-seeded to null on a settlement change, like the edits.
  const [lensOverride, setLensOverride] = useState(null);
  // THE PANORAMA PROJECTION (#38): a view option — 'plan' (the interactive flat map)
  // or 'panorama' (the oblique 2.5D projection). A PROJECTION, not a lens: it composes
  // WITH the active lens and honors the same cosmetic mapEdits (WYSIWYG). Available to
  // every viewer (viewing is free); reset to 'plan' on a settlement change.
  const [viewMode, setViewMode] = useState('plan');
  const [seededKey, setSeededKey] = useState(settlementKey);
  if (seededKey !== settlementKey) {
    setSeededKey(settlementKey);
    setMapEdits(readMapEdits(settlement));
    setLensOverride(null);
    setViewMode('plan');
  }

  const [desktop, setDesktop] = useState(detectFinePointer);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    let mq; try { mq = window.matchMedia('(pointer: fine)'); } catch { return undefined; }
    const onChange = () => setDesktop(!!mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  const editing = !!canEdit && saveId != null && desktop;
  const legendPrefs = readLegendPrefs(mapEdits);

  // The active lens = the ephemeral override, else the persisted choice. For the
  // DEFAULT (parchment) the pane keeps its theme-adaptive tokens (its pre-existing
  // print-twin/screen divergence); a chosen lens paints from the style's concrete
  // palette (imported from the src/design token zone — no raw hex in this file).
  const activeLens = lensOverride ?? readStyleLens(mapEdits);
  const pal = activeLens === DEFAULT_STYLE_ID ? null : viewerPalette(activeLens);
  // Role → concrete color: the lens palette when a lens is active, else theme tokens.
  const C = {
    water: pal ? pal.water : BLUE,
    road: pal ? pal.road : MUTED,
    street: pal ? pal.street : BORDER_STRONG,
    anchorFill: pal ? pal.anchor : GOLD,
    anchorStroke: pal ? pal.anchorStroke : INK,
    wall: pal ? pal.wall : INK,
    gateFill: pal ? pal.gate : PARCH,
    gateStroke: pal ? pal.gateStroke : INK,
    buildingIdle: pal ? pal.buildingFill : CARD,
    ink: pal ? pal.ink : INK,
    bg: pal ? pal.bg : PARCH,
    hazHi: pal ? pal.hazardHigh : RED,
    hazHiBg: pal ? pal.hazardHighBg : RED_BG,
    hazMid: pal ? pal.hazardMid : AMBER,
    hazMidBg: pal ? pal.hazardMidBg : AMBER_BG,
  };
  const districtTint = pal ? pal.district : districtColor;
  const gridStep = pal ? pal.grid : 0;

  // The single writer: update the optimistic view AND persist to the blob.
  const commitEdits = useCallback((next) => {
    const norm = normalizeMapEdits(next);
    setMapEdits(norm);
    if (saveId != null && typeof applyMapEdit === 'function') applyMapEdit(saveId, norm);
  }, [saveId, applyMapEdit]);

  const model = useMemo(() => buildTownMapModel(settlement, mapEdits), [settlement, mapEdits]);
  // The oblique panorama draw-ops — computed only in panorama mode, under the active
  // lens (so it re-poses the SAME model the plan shows, honoring edits + lens).
  const panoramaOps = useMemo(
    () => (viewMode === 'panorama' ? buildTownMapPanoramaDrawList(model, activeLens) : null),
    [viewMode, model, activeLens],
  );
  const districtsById = useMemo(() => {
    const m = new Map();
    for (const d of deriveAllDistricts(settlement)) m.set(d.id, d);
    return m;
  }, [settlement]);
  // THE LEGIBILITY DRAWER (SM-5) — the map-level surveyor's read (response mode +
  // site cause + declined-advantage map). Null for a v1 map ⇒ the drawer self-gates.
  const mapStory = useMemo(() => mapProvenanceStory(model), [model]);
  // THE CHANGE VIEW (SM-5) — the chronicle's spatial twin. Empty-when-dark by the
  // fabricRead contract; the drawer shows a whisper then. `rebuiltClasses` drives a
  // restrained on-map cue (dashed accent) on quarters rebuilt after a catastrophe.
  const changeView = useMemo(() => buildChangeView(settlement), [settlement]);
  const rebuiltClasses = useMemo(() => new Set(changeView.rebuiltClasses), [changeView]);
  // EDGE ANNOTATIONS (SM-5) — the map's exits labelled to named neighbours. Honest:
  // names + relationship only (the town-scale data carries no distance), no invented
  // numbers. Empty ⇒ no labels, no drawer section (a neighbour-less town is unchanged).
  const edgeAnnotations = useMemo(() => buildEdgeAnnotations(model, settlement), [model, settlement]);

  const wrapperRef = useRef(null);
  const gRef = useRef(null);
  const transformRef = useRef({ tx: 0, ty: 0, scale: 1, width: 0, height: 0 });
  const fittedRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  // THE DM PIN/ANNOTATION LAYER (SM-5) — annotate-mode, the click-to-place composer,
  // and the persisted markers (mapEdits.annotations). Editing rides the SAME `editing`
  // gate as every cosmetic edit; the final free/premium split is one predicate away
  // (owner-pending). Markers ride the blob and show for every viewer of the owner map.
  // MAP-LAYER ANALYTICS (SM-5) — the generation profile + legibility engagement, one
  // feature-discriminated event, best-effort, from the UI layer only.
  const mapAnalytics = useMapLayerAnalytics({ model, settlement, hasEdgeLabels: edgeAnnotations.length > 0 });
  const ann = useMapAnnotations({
    mapEdits, editing, commitEdits, wrapperRef, transformRef,
    onAdded: (count) => mapAnalytics.fire('annotation_add', { count }),
  });
  // DOOR 2 THE TABLE LAYER — the fog wiring (optimistic mirror + persist + reveal-brush/session
  // controller), bundled in a leaf so the pane grows by one call. Analytics ride SM-5's map-layer
  // helper, feature-discriminated (fog_session / fog_reveal), enums/counts only, best-effort.
  const fog = useFogLayer({
    settlement, settlementKey, model, editing, saveId, wrapperRef, transformRef, fire: mapAnalytics.fire,
  });

  // Interaction state machine: displayed card = pinned ?? hovered.
  // Each entry: { kind:'building'|'district'|'hazard'|'condition', payload, anchor:{x,y} }.
  const [hovered, setHovered] = useState(null);
  const [pinned, setPinned] = useState(null);

  const clearPin = useCallback(() => { setPinned(null); setHovered(null); }, []);

  // Direct-DOM transform write (no re-render) — the MapOverlay idiom.
  const writeTransform = useCallback((t) => {
    transformRef.current = { ...transformRef.current, ...t };
    const { tx, ty, scale } = transformRef.current;
    if (gRef.current) gRef.current.setAttribute('transform', `translate(${tx}, ${ty}) scale(${scale})`);
  }, []);

  // ── Wrapper size (drives the pixel-rect viewBox) ────────────────────────────
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      setSize((prev) => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Contain-fit the 0..1000 town space into the pixel viewBox (once per size) ─
  useEffect(() => {
    const W = size.width;
    const H = size.height;
    if (W > 1 && H > 1) {
      const key = `${W}x${H}`;
      if (fittedRef.current !== key) {
        fittedRef.current = key;
        const fit = Math.min(W, H) / 1000 || 1;
        writeTransform({ scale: fit, tx: (W - 1000 * fit) / 2, ty: (H - 1000 * fit) / 2, width: W, height: H });
      }
    }
  }, [size.width, size.height, writeTransform]);

  // ── Self-owned pan / wheel-zoom / two-pointer pinch (extracted leaf) ─────────
  useMapCamera({ wrapperRef, transformRef, writeTransform });

  // ── Hover / pin handlers (touch drops hover; tap pins) ──────────────────────
  const anchorFrom = (e) => ({ x: e.clientX, y: e.clientY });

  const onBuildingEnter = (building) => (e) => {
    if (e.pointerType === 'touch') return;
    const hm = buildingHoverModel(building, settlement);
    setHovered({ kind: 'building', payload: { building, ...hm }, anchor: anchorFrom(e) });
  };
  const onBuildingClick = (building) => (e) => {
    e.stopPropagation();
    const hm = buildingHoverModel(building, settlement);
    if (!hm.show) { clearPin(); return; } // honesty gate — nothing to pin
    setPinned({ kind: 'building', payload: { building, ...hm }, anchor: anchorFrom(e) });
  };

  const districtCardFor = (mapDistrict) => districtsById.get(mapDistrict.id) || null;
  // THE MAP EXPLAINS ITSELF (SM-5) — the v2 engine's recorded cause(s) for this
  // quarter, joined by district id. A v1 model has no provenance ⇒ [] ⇒ the card
  // shows no section (graceful degradation, never a broken affordance).
  const districtPayload = (mapDistrict) => ({
    mapDistrict,
    profile: districtCardFor(mapDistrict),
    provenance: districtProvenance(model, mapDistrict.id),
  });
  const onDistrictEnter = (mapDistrict) => (e) => {
    if (e.pointerType === 'touch') return;
    const payload = districtPayload(mapDistrict);
    if (payload.provenance.length > 0) mapAnalytics.fireOnce('provenance_hover');
    setHovered({ kind: 'district', payload, anchor: anchorFrom(e) });
  };
  const onDistrictClick = (mapDistrict) => (e) => {
    e.stopPropagation();
    setPinned({ kind: 'district', payload: districtPayload(mapDistrict), anchor: anchorFrom(e) });
  };

  const onOverlayEnter = (kind, payload) => (e) => {
    if (e.pointerType === 'touch') return;
    setHovered({ kind, payload, anchor: anchorFrom(e) });
  };
  const onOverlayClick = (kind, payload) => (e) => {
    e.stopPropagation();
    setPinned({ kind, payload, anchor: anchorFrom(e) });
  };

  const clearHover = () => setHovered((h) => (h && !pinned ? null : h));

  // ── SM-3 drag-to-nudge (PlacementsLayer precedent: pointer capture, dead-zone,
  //    transient preview, commit-on-up) ─────────────────────────────────────────
  // dragRef holds the in-flight drag; dragPreview is the live incremental map-unit
  // offset applied to the dragged element only (no per-move store write, no whole-
  // model re-derive). movedRef gates click-to-pin suppression after a real drag.
  const dragRef = useRef(null);
  const movedRef = useRef(false);
  const [dragPreview, setDragPreview] = useState(null);

  const beginDrag = (anchor) => (e) => {
    if (!editing) return;
    if (e.pointerType === 'touch') return;          // mobile posture: no drag
    if (e.button != null && e.button > 0) return;   // primary only
    e.stopPropagation();
    movedRef.current = false;
    dragRef.current = { anchor, pointerId: e.pointerId, sx: e.clientX, sy: e.clientY };
    try { e.currentTarget.setPointerCapture?.(e.pointerId); } catch { /* jsdom / unsupported */ }
  };
  const moveDrag = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const sdx = e.clientX - d.sx;
    const sdy = e.clientY - d.sy;
    if (!movedRef.current && Math.abs(sdx) < 4 && Math.abs(sdy) < 4) return; // dead-zone
    movedRef.current = true;
    const scale = transformRef.current.scale || 1;
    setDragPreview({ anchor: d.anchor, dx: Math.round(sdx / scale), dy: Math.round(sdy / scale) });
  };
  const endDrag = (e) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    try { e.currentTarget.releasePointerCapture?.(e.pointerId); } catch { /* ignore */ }
    const preview = dragPreview && dragPreview.anchor === d.anchor ? dragPreview : null;
    dragRef.current = null;
    setDragPreview(null);
    if (movedRef.current && preview && (preview.dx !== 0 || preview.dy !== 0)) {
      commitEdits(withPinNudge(mapEdits, d.anchor, preview.dx, preview.dy));
    }
  };
  // A click fires at pointerup after a drag — swallow it so a nudge never also pins.
  const consumedDragClick = () => { if (movedRef.current) { movedRef.current = false; return true; } return false; };
  const previewFor = (anchor) => (dragPreview && dragPreview.anchor === anchor ? dragPreview : null);

  // ── SM-3 edit-action callbacks (each commits the whole normalized container) ──
  const doReroll = () => commitEdits(withLayoutVariant(mapEdits, nextLayoutVariant(mapEdits)));
  const doToggleLabels = () => commitEdits(withLegendPref(mapEdits, 'showLabels', !legendPrefs.showLabels));
  const doToggleLegend = () => commitEdits(withLegendPref(mapEdits, 'showLegend', !legendPrefs.showLegend));
  const doReset = () => commitEdits(null);
  // Pick a lens: always update the ephemeral view; PERSIST it when the owner can
  // edit (rides applyMapEdit into the blob, honored on every full-blob read). Free
  // + instant + non-destructive — a re-skin never touches geometry or an edit. The
  // trailing writeLastMapView records the device-local last-lens for THE LIVING
  // BACKDROP (localStorage only; independent of the blob).
  const doPickLens = (id) => {
    setLensOverride(id); if (editing) commitEdits(withStyleLens(mapEdits, id));
    mapAnalytics.fire('lens_switch', { lens: id }); writeLastMapView(saveId, { view: viewMode, lens: id });
  };
  const hasEdits = !!mapEdits;

  const active = pinned ?? hovered;
  const isPinned = !!pinned;

  const { frame, skeleton, districts, buildings, fortifications, overlays } = model;
  const hoverKey = active
    ? (active.kind === 'building' ? active.payload.building.anchorKey
      : active.kind === 'district' ? active.payload.mapDistrict.id
        : active.payload.id)
    : null;
  const districtsWithFill = useMemo(() => {
    const set = new Set();
    for (const b of buildings) if (b.kind === 'fill') set.add(b.districtId);
    return set;
  }, [buildings]);

  return (
    <div
      ref={wrapperRef}
      data-town-map
      style={{
        position: 'relative',
        width: '100%',
        height: 'min(72vh, 720px)',
        minHeight: 360,
        border: `1px solid ${BORDER}`,
        borderRadius: R.lg,
        background: C.bg,
        overflow: 'hidden',
        touchAction: 'none',
        cursor: 'grab',
      }}
    >
      <svg
        style={{ display: 'block', width: '100%', height: '100%', overflow: 'hidden' }}
        viewBox={`0 0 ${size.width || 1} ${size.height || 1}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`Town map of ${settlement?.name || 'settlement'}`}
      >
        {/* Screen-space background: a click on empty map area clears the pin;
            a press begins a pan (isBackground). Sibling to <g>, so building /
            district clicks (which pin) never reach it. */}
        <rect
          data-town-bg
          x={0} y={0} width={size.width || 1} height={size.height || 1}
          fill="transparent"
          onClick={(e) => { if (ann.beginCompose(e)) return; clearPin(); }}
          style={{ pointerEvents: 'all', cursor: ann.annotateMode ? 'crosshair' : undefined }}
        />
        <g ref={gRef}>
          {/* ── VTT coordinate grid (a functional lens; drawn beneath the map) ── */}
          {gridStep > 0 && (
            <g data-town-grid style={{ pointerEvents: 'none' }}>
              {gridLines(gridStep).map((ln, i) => (
                <line key={`grid.${i}`} x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2} stroke={C.ink} strokeOpacity={0.14} strokeWidth={0.75} />
              ))}
            </g>
          )}

          {/* ── water ─────────────────────────────────────────────────────── */}
          {frame.water && (
            frame.water.kind === 'coast'
              ? (
                <polygon
                  data-town-water
                  points={`${pointsOf(frame.water.path)} 1000,1000 0,1000`}
                  fill={C.water} fillOpacity={0.16} stroke={C.water} strokeOpacity={0.5} strokeWidth={2}
                />
              )
              : (
                <polyline
                  data-town-water
                  points={pointsOf(frame.water.path)}
                  fill="none" stroke={C.water} strokeOpacity={0.55} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round"
                />
              )
          )}

          {/* ── non-water landform (marsh reeds / dune contours / mountain
              hachures) — terrain texture beneath the urban layer. Renders nothing
              for a water/plain/v1 site. Honors the active lens (WYSIWYG). ────── */}
          <SettlementMapLandform landform={frame.landform} lens={activeLens} ink={C.ink} />

          {/* ── approach roads ────────────────────────────────────────────── */}
          {frame.roads.map((r) => (
            <line
              key={r.id}
              x1={r.from[0]} y1={r.from[1]} x2={r.to[0]} y2={r.to[1]}
              stroke={C.road} strokeOpacity={0.5} strokeWidth={2 + r.weight} strokeLinecap="round"
            />
          ))}

          {/* ── skeleton streets + anchor ─────────────────────────────────── */}
          {skeleton.streets.map((st, i) => (
            <line
              key={`street.${i}`}
              x1={st.from.x} y1={st.from.y} x2={st.to.x} y2={st.to.y}
              stroke={C.street} strokeOpacity={0.55} strokeWidth={3} strokeLinecap="round"
            />
          ))}
          <circle cx={skeleton.anchor.x} cy={skeleton.anchor.y} r={8} fill={C.anchorFill} stroke={C.anchorStroke} strokeWidth={1.5} />

          {/* ── district polygons (drawn first → buildings win z-order) ────── */}
          {districts.map((d) => {
            const color = districtTint(d.category);
            const on = hoverKey === d.id;
            const pv = previewFor(d.anchorKey);
            const poly = offsetPoints(d.polygon, pv);
            return (
              <g key={d.id}>
                <polygon
                  data-town-district={d.id}
                  points={pointsOf(poly)}
                  fill={color}
                  fillOpacity={on ? 0.24 : 0.14}
                  stroke={color}
                  strokeOpacity={on ? 0.95 : 0.45}
                  strokeWidth={on ? 3 : 1.5}
                  style={{ cursor: editing ? 'move' : 'pointer', pointerEvents: 'auto' }}
                  onPointerEnter={onDistrictEnter(d)}
                  onPointerLeave={clearHover}
                  onPointerDown={editing ? beginDrag(d.anchorKey) : undefined}
                  onPointerMove={editing ? moveDrag : undefined}
                  onPointerUp={editing ? endDrag : undefined}
                  onPointerCancel={editing ? endDrag : undefined}
                  onClick={(e) => { if (consumedDragClick()) return; onDistrictClick(d)(e); }}
                />
                {/* aggregate lodging/mass-residential → a subtle district-fill accent */}
                {districtsWithFill.has(d.id) && (
                  <polygon
                    points={pointsOf(poly)}
                    fill={color} fillOpacity={0.08}
                    stroke="none"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                {/* THE CHANGE VIEW (SM-5) — a restrained dashed accent on quarters
                    rebuilt after a catastrophe (fabric rebirths). Dormant when the
                    fabric records no rebuild ⇒ the common map is visually unchanged. */}
                {rebuiltClasses.has(d.category) && (
                  <polygon
                    data-town-rebuilt={d.id}
                    points={pointsOf(poly)}
                    fill="none"
                    stroke={C.ink} strokeOpacity={0.7} strokeWidth={2}
                    strokeDasharray="6 4"
                    style={{ pointerEvents: 'none' }}
                  />
                )}
                {/* SM-3 label show/hide (legendPref) — district name at its centroid */}
                {legendPrefs.showLabels && (() => {
                  const c = offsetXY(d.centroid.x, d.centroid.y, pv);
                  return (
                    <text
                      x={c.x} y={c.y} textAnchor="middle" dominantBaseline="central"
                      fill={C.ink} fontFamily={sans} fontSize={13} fontWeight={700}
                      stroke={C.bg} strokeWidth={3} paintOrder="stroke"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {d.name}
                    </text>
                  );
                })()}
              </g>
            );
          })}

          {/* ── fortifications (walls + gates) ────────────────────────────── */}
          {fortifications && (
            <g style={{ pointerEvents: 'none' }}>
              <polygon
                data-town-walls
                points={pointsOf(fortifications.walls)}
                fill="none" stroke={C.wall} strokeOpacity={0.8}
                strokeWidth={1.5 + fortifications.wallWeight} strokeLinejoin="round"
              />
              {fortifications.gates.map((g, i) => (
                <circle key={`gate.${i}`} cx={g.x} cy={g.y} r={7} fill={C.gateFill} stroke={C.gateStroke} strokeWidth={2} />
              ))}
            </g>
          )}

          {/* ── building landmarks (fill buildings render as the accent above) ─ */}
          {buildings.filter((b) => b.kind === 'landmark').map((b) => {
            const color = districtTint(districts.find((d) => d.id === b.districtId)?.category);
            const on = hoverKey === b.anchorKey;
            const s = on ? 11 : 8;
            const pv = previewFor(b.anchorKey);
            const pos = offsetXY(b.position.x, b.position.y, pv);
            return (
              <rect
                key={b.anchorKey}
                data-town-building={b.anchorKey}
                x={pos.x - s} y={pos.y - s} width={s * 2} height={s * 2}
                rx={3}
                fill={on ? color : C.buildingIdle}
                fillOpacity={on ? 0.9 : 1}
                stroke={color} strokeWidth={on ? 2.5 : 1.5}
                style={{ cursor: editing ? 'move' : 'pointer', pointerEvents: 'auto' }}
                onPointerEnter={onBuildingEnter(b)}
                onPointerLeave={clearHover}
                onPointerDown={editing ? beginDrag(b.anchorKey) : undefined}
                onPointerMove={editing ? moveDrag : undefined}
                onPointerUp={editing ? endDrag : undefined}
                onPointerCancel={editing ? endDrag : undefined}
                onClick={(e) => { if (consumedDragClick()) return; onBuildingClick(b)(e); }}
              />
            );
          })}

          {/* ── overlays: condition badges (district-level, living layer) ──── */}
          {overlays.conditions.map((c) => {
            const d = districts.find((x) => x.id === c.districtId);
            if (!d) return null;
            const high = c.severityBand === 'severe' || c.severityBand === 'high' || c.severity >= 0.66;
            const on = hoverKey === c.id;
            return (
              <g
                key={`cond.${c.id}`}
                data-town-condition={c.id}
                transform={`translate(${d.centroid.x}, ${d.centroid.y})`}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                onPointerEnter={onOverlayEnter('condition', c)}
                onPointerLeave={clearHover}
                onClick={onOverlayClick('condition', c)}
              >
                <rect x={-9} y={-9} width={18} height={18} rx={4}
                  fill={high ? C.hazHiBg : C.hazMidBg} stroke={high ? C.hazHi : C.hazMid}
                  strokeWidth={on ? 2.5 : 1.5} />
                <circle cx={0} cy={0} r={2.5} fill={high ? C.hazHi : C.hazMid} />
              </g>
            );
          })}

          {/* ── overlays: hazard markers ──────────────────────────────────── */}
          {overlays.hazards.map((h) => {
            const high = h.severityBand === 'severe' || h.severityBand === 'high' || h.severity >= 0.66;
            const on = hoverKey === h.id;
            return (
              <g
                key={`haz.${h.id}`}
                data-town-hazard={h.id}
                transform={`translate(${h.position.x}, ${h.position.y})`}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                onPointerEnter={onOverlayEnter('hazard', h)}
                onPointerLeave={clearHover}
                onClick={onOverlayClick('hazard', h)}
              >
                <path d="M 0 -10 L 9 6 L -9 6 Z"
                  fill={high ? C.hazHiBg : C.hazMidBg} stroke={high ? C.hazHi : C.hazMid}
                  strokeWidth={on ? 2.5 : 1.5} strokeLinejoin="round" />
                <rect x={-1} y={-4} width={2} height={5} fill={high ? C.hazHi : C.hazMid} />
                <rect x={-1} y={2} width={2} height={2} fill={high ? C.hazHi : C.hazMid} />
              </g>
            );
          })}

          {/* ── EDGE ANNOTATIONS (SM-5) — the map's exits labelled to named
              neighbours (drawn last so labels read over the linework). ──────── */}
          <SettlementMapEdgeLabels annotations={edgeAnnotations} ink={C.ink} bg={C.bg} />

          {/* ── DM PIN/ANNOTATION LAYER (SM-5) — the owner's persisted markers;
              DM-only vs player-visible distinguished visually. ─────────────── */}
          <SettlementMapAnnotations
            annotations={ann.annotations}
            editing={ann.annotateMode}
            onRemove={ann.removeAnnotation}
            ink={C.ink} bg={C.bg} accent={C.anchorFill}
          />

          {/* ── DOOR 2 THE TABLE LAYER — the fog overlay (last child ⇒ on top of the
              linework, in 0..1000 map space so it pans/zooms). The DM sees a light
              tint marking what players cannot see; the player view / handout render
              the SAME mask opaque (WYSIWYG). pointerEvents:none — the brush + hover
              handlers underneath still fire. ─────────────────────────────────── */}
          <SettlementMapFog model={model} reveal={fog.activeReveal} color={C.ink} />
        </g>

        {/* ── DOOR 2 the reveal-BRUSH capture (screen space, on top of <g> so a click
            anywhere on the map snaps to the nearest feature). ─────────────────── */}
        <FogBrushCapture fog={fog} width={size.width} height={size.height} enabled={viewMode === 'plan'} />
      </svg>

      {/* ── DM marker placement popover (edit + annotate mode only). Keyed on the
          placement point so each new placement remounts with fresh fields. ──── */}
      <AnnotationComposer
        key={ann.composing ? `${ann.composing.x}:${ann.composing.y}:${ann.composing.screenX}` : 'idle'}
        composing={ann.composing}
        onAdd={ann.addAnnotation}
        onCancel={ann.cancelCompose}
      />

      {/* ── THE PANORAMA PROJECTION (#38) — a static oblique overlay shown in
          'panorama' view mode. Self-contained 0..1000 vector layer over the plan
          (the plan stays mounted behind it, so a flip back is instant). It reads the
          SAME model + active lens, so it honors every cosmetic mapEdit (WYSIWYG). No
          pointer events: the panorama is a presentation view, hover/edit stay in the
          plan. ─────────────────────────────────────────────────────────────── */}
      {viewMode === 'panorama' && panoramaOps && (
        <SettlementMapPanorama ops={panoramaOps} bg={C.bg} name={settlement?.name} />
      )}

      {/* ── View toggle (Plan / Panorama) — top-left, always available (viewing is
          free at every tier). A projection switch, not an edit. The canonical
          Segmented pill (a primitive — focus ring, aria-pressed, min target). ── */}
      {(districts.length > 0 || buildings.length > 0) && (
        <div data-town-view-toggle style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
          <Segmented
            size="sm"
            ariaLabel="Map view"
            value={viewMode}
            onChange={(m) => { setViewMode(m); if (m === 'panorama') mapAnalytics.fireOnce('panorama'); writeLastMapView(saveId, { view: m, lens: activeLens }); }}
            options={[{ id: 'plan', label: 'Plan' }, { id: 'panorama', label: 'Panorama' }]}
          />
        </div>
      )}

      {/* ── SM-5 THE LEGIBILITY DRAWER — a left-edge "Read" drawer surfacing the
          surveyor's read (+ change view + roads out, added in their deliverables).
          Self-gates: renders nothing when no section has content (e.g. a v1 map). ── */}
      <SettlementMapNotes
        settlement={settlement} story={mapStory} changes={changeView} roads={edgeAnnotations}
        entitled={!!canEdit}
        onOpen={() => mapAnalytics.fireOnce('change_view')}
      />

      {/* ── SM-3 edit chrome (desktop + canEdit + a saved blob only) + the
          legend (a legendPref honored for every viewer once set) ──────────── */}
      <SettlementMapEditControls
        editing={editing}
        showLegend={legendPrefs.showLegend}
        legendPrefs={legendPrefs}
        hasEdits={hasEdits}
        districts={districts}
        styleIds={TOWN_MAP_STYLE_IDS}
        activeLens={activeLens}
        lensPersisted={editing}
        onPickLens={doPickLens}
        onReroll={doReroll}
        onToggleLabels={doToggleLabels}
        onToggleLegend={doToggleLegend}
        onReset={doReset}
        annotating={ann.annotateMode}
        onToggleAnnotate={ann.toggleAnnotate}
        entitled={!!canEdit}
        savedMap={saveId != null}
      />

      {/* ── MAP EXPORTS — the per-settlement export affordance (bottom-right).
          Owner-only by construction: rendered only when a saveId is present (the
          public gallery view passes saveId=null) AND the map has something to
          draw. Gating (the $2.99 export-bundle lane) lives inside the menu. ── */}
      {saveId != null && (districts.length > 0 || buildings.length > 0) && (
        <SettlementMapExportMenu settlement={settlement} saveId={saveId} style={activeLens} />
      )}

      {/* ── DOOR 2 THE TABLE LAYER — the DM fog chrome (controls + live player view +
          handout export). Owner-only by construction (saveId present); the panel self-
          gates its edit affordances on `editing`. All rendering lives in the leaf. ── */}
      {saveId != null && (districts.length > 0 || buildings.length > 0) && (
        <SettlementMapFogChrome fog={fog} editing={editing} entitled={!!canEdit} settlement={settlement} activeLens={activeLens} fire={mapAnalytics.fire} />
      )}

      {/* ── Cards / labels (displayed = pinned ?? hovered) ─────────────────── */}
      {active && active.kind === 'building' && isPinned && active.payload.show && (
        <InstitutionCard
          open
          institution={active.payload.institution}
          settlement={settlement}
          onClose={clearPin}
        />
      )}
      {active && active.kind === 'building' && !isPinned && active.payload.show && (
        <FloatingLabel anchor={active.anchor}>
          <strong style={{ color: INK, fontWeight: 800 }}>{active.payload.institution?.name}</strong>
          <span style={{ color: MUTED }}> — click for profile</span>
        </FloatingLabel>
      )}
      {active && active.kind === 'district' && (
        <DistrictCard
          anchor={active.anchor}
          mapDistrict={active.payload.mapDistrict}
          profile={active.payload.profile}
          provenance={active.payload.provenance}
          pinned={isPinned}
          onClose={clearPin}
        />
      )}
      {active && (active.kind === 'hazard' || active.kind === 'condition') && (
        <FloatingLabel anchor={active.anchor}>
          <strong style={{ color: INK, fontWeight: 800 }}>{active.payload.label || active.payload.archetype}</strong>
          <span style={{ color: MUTED }}>{` · ${active.payload.severityBand || ''}`}</span>
        </FloatingLabel>
      )}
    </div>
  );
}
