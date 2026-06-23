/**
 * SimulationDrawer.jsx — slide-out for "how this was simulated".
 *
 * The original Simulation tab lived as the last entry on the dossier
 * tab strip, where it read as noise: most DMs
 * never open it, but it dilutes the strip and competes for attention
 * with the dossier-meaningful tabs. Moving it to a drawer:
 *
 *   • Removes the tab from the strip when the drawer is enabled.
 *   • Surfaces a small "How this was simulated" link below the
 *     dossier header so curious users still find it.
 *   • Renders the full PipelineRail inside a right-side panel that
 *     slides over the page chrome — no layout reflow.
 *
 * Fires EVENTS.SIMULATION_DRAWER_OPENED on first open so we can
 * measure whether the drawer's discoverability is acceptable.
 *
 * Pure visual; the rail itself is unchanged. If the flag is off, this
 * component renders nothing and the legacy Simulation tab path stays
 * the default.
 */

import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { FS, swatch } from '../theme.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

const PipelineRail = lazy(() => import('../PipelineRail.jsx'));

const GOLD = swatch['#8C6F32'];
const INK = swatch['#1B1408'];
const BODY = swatch['#3A2F18'];
const MUTED = swatch['#9C8068'];
const PARCH = swatch['#FBF5E6'];
const BORDER = swatch['#E8D9B0'];
const sans = '"Nunito", system-ui, sans-serif';

/**
 * Trigger button + drawer pair. The trigger renders inline wherever
 * the consumer mounts it; the drawer is portal-style — fixed-position
 * over the page chrome — so it doesn't push content around.
 */
export default function SimulationDrawer({ variant = 'inline' }) {
  // 'inline' = the parchment owner-action band (ghost + light border).
  // 'toolbar' = the dark sticky wizard toolbar, where the trigger joins Back /
  // Regenerate / New as a matching secondary button.
  const toolbar = variant === 'toolbar';
  const [open, setOpen] = useState(false);
  const firedRef = useRef(false);

  useEffect(() => {
    if (open && !firedRef.current) {
      firedRef.current = true;
      try { Funnel.track(EVENTS.SIMULATION_DRAWER_OPENED); } catch { /* silent */ }
    }
  }, [open]);

  // Esc-to-close keyboard handling — lives in an effect so the
  // listener is bound only while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <Button
        variant={toolbar ? 'secondary' : 'ghost'}
        size={toolbar ? 'md' : 'sm'}
        onClick={() => setOpen(true)}
        title="See the 17-step simulation pipeline that built this settlement"
        icon={toolbar ? undefined : <span style={{ color: GOLD }}>✦</span>}
        style={toolbar ? undefined : {
          border: `1px solid ${BORDER}`,
          color: MUTED,
        }}
      >
        How this was simulated
      </Button>

      {open && (
        <>
          {/* Scrim */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Close"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setOpen(false);
            }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.45)',
              zIndex: 90,
              animation: 'sf-sim-fade 0.18s ease-out',
            }}
          />
          {/* Panel */}
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="How this was simulated"
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: 'min(520px, 92vw)',
              background: swatch.white,
              borderLeft: `1px solid ${BORDER}`,
              boxShadow: '-12px 0 36px rgba(0,0,0,0.30)',
              zIndex: 100,
              display: 'flex', flexDirection: 'column',
              animation: 'sf-sim-slide 0.22s ease-out',
            }}
          >
            <header style={{
              padding: '14px 18px',
              // Top-pinned fixed panel: fold in the device safe-area inset so the
              // header clears a notch on mobile. Resolves to 0 on desktop, so the
              // desktop drawer is unchanged.
              paddingTop: 'calc(14px + env(safe-area-inset-top, 0px))',
              background: PARCH,
              borderBottom: `1px solid ${BORDER}`,
              display: 'flex', alignItems: 'center',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: FS.xxs, fontWeight: 800, color: GOLD,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  fontFamily: sans,
                }}>
                  Behind the curtain
                </div>
                <div style={{
                  fontFamily: '"Crimson Text", Georgia, serif',
                  fontSize: FS['18'], fontWeight: 600, color: INK,
                  marginTop: 2, lineHeight: 1.2,
                }}>
                  How this was simulated
                </div>
                <div style={{
                  marginTop: 4, fontSize: FS['11.5'], color: BODY,
                  lineHeight: 1.5, fontFamily: sans,
                }}>
                  Seventeen steps built this settlement, each one fixed by the
                  same seed. Tap a step to see what it decided and why.
                </div>
              </div>
              <IconButton
                glyph={'✕'}
                label="Close"
                tone="ghost"
                size="lg"
                onClick={() => setOpen(false)}
                style={{ marginLeft: 8 }}
              />
            </header>

            <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
              <Suspense fallback={
                <div style={{
                  padding: 16, color: MUTED, fontSize: FS.sm,
                  fontFamily: sans, textAlign: 'center',
                }}>
                  Loading pipeline…
                </div>
              }>
                <PipelineRail compact={false} />
              </Suspense>
            </div>
          </aside>

          <style>{`
            @keyframes sf-sim-fade {
              from { opacity: 0; }
              to   { opacity: 1; }
            }
            @keyframes sf-sim-slide {
              from { transform: translateX(100%); }
              to   { transform: translateX(0); }
            }
          `}</style>
        </>
      )}
    </>
  );
}
