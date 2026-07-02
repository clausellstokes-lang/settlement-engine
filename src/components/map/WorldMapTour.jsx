/**
 * WorldMapTour — §16 guided help for the world map. A dimmed, step-by-step
 * walkthrough: each step spotlights one control (matched by a `data-tour`
 * attribute) and explains it; the rest of the UI is greyed out. Next / Back /
 * Skip, Esc to leave, arrow keys to navigate. Completion is remembered in
 * localStorage but the "?" button always replays it.
 *
 * Implementation: a fixed box sized to the target's bounding rect with a huge
 * spreading box-shadow dims everything except the target (no z-index surgery on
 * the underlying controls). A tooltip is placed above or below the target
 * depending on available space; a step whose target isn't on screen shows a
 * centered card. No manual memoization — the React Compiler handles it.
 */
import { useEffect, useState } from 'react';
import { GOLD, INK, BODY, CARD, BORDER, sans, FS, SP, R } from '../theme.js';
import Button from '../primitives/Button.jsx';

const DONE_KEY = 'sf_worldmap_tour_done';
const PAD = 6;
const TIP_W = 320;

export function markWorldMapTourSeen() { try { localStorage.setItem(DONE_KEY, '1'); } catch { /* ignore */ } }
export function hasSeenWorldMapTour() { try { return localStorage.getItem(DONE_KEY) === '1'; } catch { return false; } }

export default function WorldMapTour({ open, steps = [], onClose }) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState(null);

  // Reset to the first step whenever the tour (re)opens.
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on open
  useEffect(() => { if (open) setI(0); }, [open]);

  // Measure the current step's target + wire keyboard / reflow listeners.
  useEffect(() => {
    if (!open) return undefined;
    const measure = () => {
      const step = steps[i];
      const el = step?.sel ? document.querySelector(`[data-tour="${step.sel}"]`) : null;
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    const close = () => { markWorldMapTourSeen(); onClose?.(); };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') setI((n) => (n + 1 >= steps.length ? n : n + 1));
      else if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1));
    };
    measure();
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', measure, { passive: true, capture: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, { capture: true });
      window.removeEventListener('keydown', onKey);
    };
  }, [open, i, steps, onClose]);

  if (!open || !steps[i]) return null;
  const step = steps[i];
  const last = i + 1 >= steps.length;
  const finish = () => { markWorldMapTourSeen(); onClose?.(); };
  const onNext = () => { if (last) finish(); else setI(i + 1); };

  // Tooltip placement: below the target if there's room, else above; centered
  // when there's no target rect.
  let tip;
  if (!rect) {
    tip = { left: Math.max(SP.md, (window.innerWidth - TIP_W) / 2), top: Math.max(SP.xxl, window.innerHeight / 2 - 80) };
  } else {
    const below = rect.top + rect.height + 12;
    const room = window.innerHeight - below > 160;
    const left = Math.min(Math.max(SP.md, rect.left), window.innerWidth - TIP_W - SP.md);
    tip = room ? { left, top: below } : { left, top: Math.max(SP.md, rect.top - 150) };
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 4000 }} aria-live="polite">
      {rect ? (
        <div style={{
          position: 'fixed',
          top: rect.top - PAD, left: rect.left - PAD,
          width: rect.width + PAD * 2, height: rect.height + PAD * 2,
          borderRadius: R.sm, border: `2px solid ${GOLD}`,
          boxShadow: '0 0 0 9999px rgba(20,14,6,0.62)',
          pointerEvents: 'none', transition: 'all 0.18s ease',
        }} />
      ) : (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,14,6,0.62)', pointerEvents: 'none' }} />
      )}

      <div style={{
        position: 'fixed', top: tip.top, left: tip.left, width: TIP_W,
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg,
        boxShadow: '0 8px 28px rgba(0,0,0,0.45)', padding: SP.lg, fontFamily: sans,
      }}>
        <div style={{ fontSize: FS.xxs, fontWeight: 700, color: GOLD, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Step {i + 1} of {steps.length}
        </div>
        <div style={{ fontSize: FS.lg, fontWeight: 700, color: INK, marginBottom: 6 }}>{step.title}</div>
        <p style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5, margin: `0 0 ${SP.md}px` }}>{step.body}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
          <Button variant="ghost" size="sm" onClick={finish}>Skip tour</Button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: SP.sm }}>
            {i > 0 && <Button variant="secondary" size="md" onClick={() => setI((n) => Math.max(0, n - 1))}>Back</Button>}
            <Button variant="primary" size="md" onClick={onNext}>{last ? 'Done' : 'Next'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
