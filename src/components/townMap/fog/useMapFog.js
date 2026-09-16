/**
 * components/townMap/fog/useMapFog — DOOR 2 the reveal-brush + session controller.
 *
 * The fog twin of useMapAnnotations: owns the active session, the brush mode/granularity, the
 * screen→map coordinate conversion, and the commit calls (the fogSessions merge ops through the
 * pane's single commitFog writer). SEMANTIC-SNAP: a brush point resolves to the nearest
 * district/street/building along the model's REAL edges (snapToSemantic), never a pixel daub —
 * so a reveal follows the graph and survives a reroll (the edits-delta law lives in the model).
 *
 * ENTITLEMENT SEAM (owner-pending ladder ruling): fog EDITING rides the pane's existing `editing`
 * predicate (canEdit + saveId + desktop — the same gate every cosmetic map edit uses). Viewing a
 * revealed map is free. The final free/premium split for the table layer is ONE predicate away —
 * it lives in whatever feeds `editing`/`canEdit`; this module adds no new gate class.
 *
 * Pure interaction wiring; the persisted reveal state rides settlement.fogSessions, fail-closed
 * off every public projection, so it survives every lifecycle path like any cosmetic edit.
 */
import { useCallback, useMemo, useState } from 'react';
import {
  readFogSession, readReveal, listFogSessionIds, sessionHasReveal,
  withSession, withoutSession, withRevealed, withRevealSet, withClearedReveal,
  snapToSemantic, allRevealIds,
} from '../../../domain/townMap/index.js';

const clamp01k = (v) => (v < 0 ? 0 : v > 1000 ? 1000 : v);

/**
 * @param {{
 *   fogSessions: Record<string, any> | null,
 *   model: any,
 *   editing: boolean,
 *   commitFog: (next: Record<string, any> | null) => void,
 *   wrapperRef: import('react').MutableRefObject<HTMLElement|null>,
 *   transformRef: import('react').MutableRefObject<{ tx:number, ty:number, scale:number, width:number, height:number }>,
 *   onReveal?: (kind: string) => void,
 *   onSession?: (count: number) => void,
 * }} deps
 */
export function useMapFog({ fogSessions, model, editing, commitFog, wrapperRef, transformRef, onReveal, onSession }) {
  const sessionIds = useMemo(() => listFogSessionIds(fogSessions), [fogSessions]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [fogActive, setFogActive] = useState(false);          // is the fog overlay engaged
  const [brushMode, setBrushMode] = useState('reveal');       // 'reveal' | 'hide' (off ⇒ not painting)
  const [brushKind, setBrushKind] = useState('auto');         // 'auto'|'districts'|'streets'|'buildings'
  const [painting, setPainting] = useState(false);            // is the brush actively painting

  // The effective active session: the selection if it still exists, else the first session.
  const effectiveId = (activeSessionId && sessionIds.includes(activeSessionId)) ? activeSessionId : (sessionIds[0] || null);
  const activeEntry = useMemo(() => readFogSession(fogSessions, effectiveId), [fogSessions, effectiveId]);
  const activeReveal = useMemo(() => (fogActive && effectiveId ? readReveal(activeEntry) : null), [fogActive, effectiveId, activeEntry]);
  const sessionName = (activeEntry && activeEntry.name) || effectiveId || '';

  // Fog editing only lives while the map is editable AND a session is active; a non-editor
  // never paints. `brushEnabled` gates whether the capture overlay is mounted (so a pointer-down
  // can even reach the brush); `painting` (set on down) only decides whether a MOVE paints.
  const brushEnabled = editing && fogActive && !!effectiveId;

  /** Screen point → map units (invert the pane's pan/zoom transform — the useMapAnnotations idiom). */
  const toMapCoords = useCallback((clientX, clientY) => {
    const el = wrapperRef.current;
    const rect = el ? el.getBoundingClientRect() : { left: 0, top: 0 };
    const { tx, ty, scale } = transformRef.current;
    const s = scale || 1;
    return { x: clamp01k((clientX - rect.left - tx) / s), y: clamp01k((clientY - rect.top - ty) / s) };
  }, [wrapperRef, transformRef]);

  /** Reveal (or hide) the semantic element under a screen point; returns true if it snapped. */
  const paintAt = useCallback((clientX, clientY) => {
    if (!brushEnabled) return false;
    const { x, y } = toMapCoords(clientX, clientY);
    const hit = snapToSemantic(model, x, y, { kind: brushKind });
    if (!hit) return false;
    const next = withRevealed(fogSessions, effectiveId, hit.kind, hit.id, brushMode === 'reveal');
    commitFog(next);
    if (typeof onReveal === 'function') onReveal(hit.kind);
    return true;
  }, [brushEnabled, effectiveId, toMapCoords, model, brushKind, fogSessions, brushMode, commitFog, onReveal]);

  // Pointer handlers for the brush-capture overlay (down starts a stroke; move paints; up ends).
  const onBrushDown = useCallback((e) => { setPainting(true); paintAt(e.clientX, e.clientY); }, [paintAt]);
  const onBrushMove = useCallback((e) => { if (painting) paintAt(e.clientX, e.clientY); }, [painting, paintAt]);
  const onBrushUp = useCallback(() => setPainting(false), []);

  // ── Session ops (through commitFog) ───────────────────────────────────────
  const createSession = useCallback((name) => {
    const clean = (typeof name === 'string' && name.trim()) || 'Session';
    const next = withSession(fogSessions, clean);
    commitFog(next);
    // Select the freshly-created session so the brush targets it.
    setActiveSessionId(listFogSessionIds(next).find((id) => readFogSession(next, id)?.name === clean.trim().slice(0, 60)) || null);
    setFogActive(true);
    if (typeof onSession === 'function') onSession(listFogSessionIds(next).length);
  }, [fogSessions, commitFog, onSession]);

  const renameActive = useCallback((name) => {
    if (!effectiveId) return;
    commitFog(withSession(withoutSession(fogSessions, effectiveId), name));
  }, [fogSessions, effectiveId, commitFog]);

  const deleteActive = useCallback(() => {
    if (!effectiveId) return;
    commitFog(withoutSession(fogSessions, effectiveId));
    setActiveSessionId(null);
  }, [fogSessions, effectiveId, commitFog]);

  const revealAll = useCallback(() => {
    if (!effectiveId) return;
    const all = allRevealIds(model);
    let next = fogSessions;
    for (const kind of ['districts', 'streets', 'buildings']) next = withRevealSet(next, effectiveId, kind, all[kind]);
    commitFog(next);
    if (typeof onReveal === 'function') onReveal('all');
  }, [effectiveId, model, fogSessions, commitFog, onReveal]);

  const hideAll = useCallback(() => {
    if (!effectiveId) return;
    commitFog(withClearedReveal(fogSessions, effectiveId));
    if (typeof onReveal === 'function') onReveal('none');
  }, [effectiveId, fogSessions, commitFog, onReveal]);

  const toggleFog = useCallback(() => setFogActive((v) => !v), []);
  const selectSession = useCallback((id) => { setActiveSessionId(id); setFogActive(true); }, []);

  return {
    sessionIds, activeSessionId: effectiveId, sessionName,
    activeEntry, activeReveal, hasReveal: sessionHasReveal(activeEntry),
    fogActive, toggleFog, selectSession,
    brushMode, setBrushMode, brushKind, setBrushKind, brushEnabled,
    onBrushDown, onBrushMove, onBrushUp,
    createSession, renameActive, deleteActive, revealAll, hideAll,
  };
}
