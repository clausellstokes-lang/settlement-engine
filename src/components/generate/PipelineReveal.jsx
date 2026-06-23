/**
 * PipelineReveal.jsx — "the wow is the simulation."
 *
 * Renders a 2-3 second overlay narrating the pipeline steps the engine
 * just ran. Each user-facing step name is sourced from
 * copy.en.pipelineSteps (theatrical translations of the actual function
 * names — "casting NPCs…" instead of "generatePopulation").
 *
 * The reveal plays back from the `pipelineHistory` written by the
 * settlementSlice.generateSettlement action. Because the engine runs
 * synchronously, "live narration" isn't possible without paying for an
 * async refactor; instead we record + replay, which feels identical to
 * the user (the moment to convey is "the engine just did work" — not
 * the literal millisecond-by-millisecond timing).
 *
 * Lifecycle:
 *   1. Wizard sets `pipelineRevealActive: true` right after the engine
 *      returns. Reveal mounts.
 *   2. Reveal animates through pipelineHistory at ~280ms per step.
 *      Minimum total display = 2000ms even on tiny histories so the
 *      reveal lands.
 *   3. On final step, calls `onComplete` (typically clears the flag
 *      and renders the dossier).
 *
 * A11y:
 *   - role="status" + aria-live="polite" so screen readers hear each
 *     active step.
 *   - Esc dismisses immediately (power-user fast-path).
 *
 * Flag: `pipelineReveal` (default on in prod).
 */

import { useEffect, useState, useMemo, useRef } from 'react';
import { useStore } from '../../store/index.js';
import { tx } from '../../copy/index.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { GOLD, INK_DEEP, sans, serif_, FS, SP, R, swatch } from '../theme.js';

// Mono font for the step list. theme.js doesn't export one, so we
// declare it locally — kept tight (single value, used once).
const mono = '"JetBrains Mono", Consolas, monospace';

const STEP_INTERVAL_MS = 280;
const MIN_TOTAL_MS = 2000;

export default function PipelineReveal({ onComplete }) {
  const history = useStore(s => s.pipelineHistory || []);
  const settlementName = useStore(s => s.settlement?.name || 'this settlement');

  // Stable label lookup. tx() returns the whole map; we read once.
  const labelMap = useMemo(() => tx('pipelineSteps') || {}, []);

  // Pre-render: filter history to entries we have labels for. Some
  // internal pass steps (subsumptionPass, isolationPass) intentionally
  // don't have user-facing labels — skip them entirely.
  const steps = useMemo(() => {
    if (!Array.isArray(history)) return [];
    return history
      .map(h => ({ id: h.id, label: labelMap[h.id] }))
      .filter(s => s.label);
  }, [history, labelMap]);

  const [activeIndex, setActiveIndex] = useState(0);
  // Lazy-init the ref with null and stamp in the mount effect so we don't
  // call Date.now() during render (purity rule).
  const startedAtRef = useRef(null);

  // Drive the animation. Fire WOW_REVEAL_SHOWN once on mount; advance
  // through steps on a fixed interval; cap minimum total at 2s.
  useEffect(() => {
    if (!steps.length) {
      // Empty pipeline history (shouldn't happen, but safe): dismiss
      // immediately so the dossier shows.
      onComplete?.();
      return undefined;
    }
    Funnel.track(EVENTS.WOW_REVEAL_SHOWN, { steps: steps.length });
    // Stamp inside the effect (not in render — purity rule).
    startedAtRef.current = Date.now();

    const total = Math.max(MIN_TOTAL_MS, steps.length * STEP_INTERVAL_MS);
    const perStepMs = total / steps.length;

    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= steps.length) {
        clearInterval(id);
        Funnel.track(EVENTS.WOW_REVEAL_COMPLETED, {
          steps: steps.length,
          elapsedMs: Date.now() - (startedAtRef.current || Date.now()),
        });
        // Small grace period (200ms) on the final step so the user sees the ✓
        setTimeout(() => onComplete?.(), 200);
        return;
      }
      setActiveIndex(i);
    }, perStepMs);

    return () => clearInterval(id);
  }, [steps.length, onComplete]);

  // No skip / Esc fast-path: the reveal plays to completion so the first dossier
  // view is the finished settlement, not a half-played pipeline. It auto-dismisses
  // when playback finishes (the interval effect above calls onComplete).

  if (!steps.length) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        // Sits below the sticky top nav (z-index 50) so the header stays visible
        // through the reveal — the loading screen is the content area, not a full
        // viewport takeover.
        position: 'fixed', inset: 0, zIndex: 45,
        background: INK_DEEP,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: sans, color: swatch['#C8B098'],
        animation: 'sf-fadeIn 0.2s ease-out',
      }}
    >
      <div style={{
        maxWidth: 460, width: '90%',
        padding: `${SP.xxl}px ${SP.xl}px`,
        background: 'linear-gradient(180deg, rgba(43,33,16,0.85), rgba(27,20,8,0.95))',
        border: `1px solid ${GOLD}55`,
        borderRadius: R.lg,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: serif_, fontSize: FS.xl, fontWeight: 600,
          color: GOLD, marginBottom: SP.xl,
        }}>
          Forging {settlementName}…
        </div>
        <div style={{ textAlign: 'left', fontFamily: mono, fontSize: FS.sm }}>
          {steps.map((s, i) => {
            const done = i < activeIndex;
            const active = i === activeIndex;
            return (
              <div key={s.id} style={{
                padding: `${SP.xs}px ${SP.sm}px`, marginBottom: 2,
                color: active ? GOLD : done ? '#a08060' : '#5a4530',
                opacity: active ? 1 : done ? 0.7 : 0.4,
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', gap: SP.sm,
              }}>
                <span style={{ width: 12 }}>{done ? '✓' : active ? '▸' : ' '}</span>
                {s.label}
              </div>
            );
          })}
        </div>
        <div style={{
          marginTop: SP.lg, height: 3,
          background: 'rgba(201,162,76,0.15)',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, ((activeIndex + 1) / steps.length) * 100)}%`,
            background: GOLD, transition: 'width 0.3s',
          }} />
        </div>
      </div>
    </div>
  );
}
