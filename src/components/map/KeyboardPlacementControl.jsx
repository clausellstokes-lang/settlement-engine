/**
 * KeyboardPlacementControl.jsx — Enforcer E-I (bar 9, ACCESSIBILITY).
 *
 * The keyboard settlement-placement session. Before this control, placement was
 * pointer-only (drag a palette card onto the map at a screen coordinate), so a
 * keyboard or screen-reader user was dead-ended — the palette's F28 live region
 * could only announce "use a mouse or touch". This overlay closes that gap:
 *
 *   arm    — SettlementPalette's card Enter handler asks WorldMapStage to mount
 *            this control for one settlement; focus lands here on mount.
 *   move   — arrow keys steer a visible target square over the map container
 *            (fractional 0..1 coordinates; Shift takes larger steps). Every move
 *            is announced through the palette's existing aria-live footer (the
 *            `announce` prop — the ONE placement announcer, F28).
 *   commit — Enter routes through the SAME seam pointer placement uses. FMG
 *            mode: bridge.placeSettlement(screen x/y) → the iframe echoes
 *            fmg:settlementPlaced → useMapBridge → addPlacement, the store's
 *            authoritative gate (campaign / canon / no-duplicate). Image mode:
 *            the drop handler's inverse-projection (container px → image px via
 *            the live overlay transform) → addPlacement directly. There is NO
 *            second commit path — this control is a keyboard input adapter in
 *            front of the exact gates the pointer path clears.
 *   end    — Escape (or a commit, or focus leaving) unmounts via onDone; the
 *            stage restores focus to the palette card that armed the session.
 *
 * Lazy leaf by design: WorldMapStage mounts it via lazy(import()) only when a
 * session arms, so it rides its own chunk — zero first-paint bytes (the whole
 * WorldMap subtree is already lazy, and this defers further to interaction
 * time). The composite closure margin is ~25 B; nothing here may go eager.
 */

import { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store/index.js';
import { PLACEMENT_REJECT_COPY } from '../../hooks/useMapBridge.js';
import { clamp01 } from '../../kernel/math.js';
import { GOLD, INK, PARCH_100, FS, sans } from '../theme.js';

// Fractional step per arrow press (2% of the map container; Shift = 10%).
const STEP = 0.02;
const BIG_STEP = 0.1;
const pct = (v) => `${Math.round(v * 100)}%`;

// Bounded wait for the FMG echo round-trip: the placeSettlement REPLY message
// resolves one task BEFORE the fmg:settlementPlaced PUSH message commits to the
// store (sf-bridge posts reply then push; each is its own message task), so the
// store must be polled briefly — this is message-ordering, not a race bug.
async function waitForPlacement(burgId, tries = 40) {
  for (let i = 0; i < tries; i++) {
    if (useStore.getState().mapState?.placements?.[burgId]) return true;
    await new Promise((r) => setTimeout(r, 25));
  }
  return !!useStore.getState().mapState?.placements?.[burgId];
}

export default function KeyboardPlacementControl({
  save, imageMode, bridgeRef, iframeRef, containerRef, transformRef, announce, onDone,
}) {
  const addPlacement = useStore((s) => s.addPlacement);
  const [pos, setPos] = useState({ fx: 0.5, fy: 0.5 });
  const [busy, setBusy] = useState(false);
  const rootRef = useRef(null);
  const name = save?.name || save?.settlement?.name || 'The settlement';

  // Focus the session and speak the instructions once, on mount only — the
  // announce/name identities are stable for the life of one session.
  useEffect(() => {
    rootRef.current?.focus();
    announce(`Placing ${name}. Use the arrow keys to move the target, Enter to place, Escape to cancel.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function commit() {
    if (busy) return;
    setBusy(true);
    try {
      if (imageMode) {
        // Image-backdrop mode: no iframe/bridge — mirror handleDrop's inverse
        // projection (container px → image px through the live overlay
        // transform), then the authoritative store gate directly.
        const t = transformRef?.current;
        const rect = containerRef?.current?.getBoundingClientRect?.();
        if (!t?.scale || !rect) {
          announce('The map is not ready yet. Try again in a moment.');
          return;
        }
        // `via:'keyboard'` — the MAP_PLACEMENT_ADDED analytics enum only knows
        // picker/drop and coarsens this to 'drop'; deliberate, no new enum.
        const res = addPlacement({
          burgId: `sf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          settlementId: save.id,
          x: (pos.fx * rect.width - t.tx) / t.scale,
          y: (pos.fy * rect.height - t.ty) / t.scale,
          via: 'keyboard',
        });
        if (res && res.ok === false) {
          announce(PLACEMENT_REJECT_COPY[res.reason] || `${name} could not be placed.`);
          return;
        }
      } else {
        // FMG mode: the pointer path's exact seam — screen x/y into
        // bridge.placeSettlement; the iframe snaps to a cell and echoes
        // fmg:settlementPlaced, which useMapBridge routes through addPlacement
        // (the ONE gate). The reply's burgId lets us confirm the round-trip.
        const bridge = bridgeRef?.current;
        const rect = (iframeRef?.current || containerRef?.current)?.getBoundingClientRect?.();
        if (!bridge || !rect) {
          announce('The map is not ready yet. Try again in a moment.');
          return;
        }
        const reply = await bridge.placeSettlement({
          settlementId: save.id,
          x: pos.fx * rect.width,
          y: pos.fy * rect.height,
          name,
          population: save?.settlement?.population || save?.population || 0,
        });
        const landed = reply?.burgId ? await waitForPlacement(reply.burgId) : false;
        if (!landed) {
          // The store gate refused the echo (useMapBridge already toasted the
          // reason for sighted users); speak a polite refusal here too.
          announce(`${name} could not be placed.`);
          return;
        }
      }
      announce(`${name} placed on the map.`);
      onDone();
    } catch (err) {
      announce(`Placement failed: ${err?.message || err}`);
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e) {
    let dx = 0;
    let dy = 0;
    if (e.key === 'ArrowLeft') dx = -1;
    else if (e.key === 'ArrowRight') dx = 1;
    else if (e.key === 'ArrowUp') dy = -1;
    else if (e.key === 'ArrowDown') dy = 1;
    if (dx || dy) {
      e.preventDefault();
      e.stopPropagation();
      const step = e.shiftKey ? BIG_STEP : STEP;
      const next = { fx: clamp01(pos.fx + dx * step), fy: clamp01(pos.fy + dy * step) };
      setPos(next);
      announce(`Target at ${pct(next.fx)} across, ${pct(next.fy)} down.`);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      commit();
      return;
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      announce('Placement cancelled.');
      onDone();
    }
  }

  return (
    // role="application" tells screen readers to pass raw key events through
    // (browse-mode virtual cursors would otherwise swallow the arrows).
    // tabIndex={-1}: focus arrives programmatically at arm time; the session is
    // never a stop on the page's Tab order. pointerEvents:'none' keeps every
    // pointer affordance beneath it fully live — this overlay is keyboard-only.
    // a11y: the jsx-a11y rule doesn't know role="application" (the pass-through
    // widget role); this focusable session IS the interactive element.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      ref={rootRef}
      role="application"
      tabIndex={-1}
      aria-label={`Keyboard placement for ${name}. Arrow keys move the target, Enter places it, Escape cancels.`}
      data-testid="keyboard-placement-session"
      onKeyDown={onKeyDown}
      onBlur={() => { if (!busy) onDone(); }}
      style={{ position: 'absolute', inset: 0, outline: 'none', pointerEvents: 'none' }}
    >
      {/* The target square (square corners — the house de-round doctrine). */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `${pos.fx * 100}%`,
          top: `${pos.fy * 100}%`,
          transform: 'translate(-50%, -50%)',
          width: 26,
          height: 26,
          border: `2px solid ${GOLD}`,
          // Contrast ring in ink (outline, not a z-axis shadow — depth is ink).
          outline: `2px solid ${INK}`,
        }}
      >
        <div style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 4, height: 4, background: GOLD,
        }}
        />
      </div>
      {/* Sighted-keyboard instruction chip — same recipe as the drop-preview card. */}
      <div style={{
        position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
        background: INK, color: PARCH_100, border: `1px solid ${GOLD}`,
        padding: '6px 10px', fontSize: FS.xs, fontFamily: sans, lineHeight: 1.45,
        maxWidth: 320, textAlign: 'center',
      }}
      >
        <span style={{ fontWeight: 700, color: GOLD }}>Placing {name}.</span>{' '}
        Arrow keys move the target (hold Shift for larger steps). Enter places it; Escape cancels.
      </div>
    </div>
  );
}
