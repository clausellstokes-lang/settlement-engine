/**
 * DevFlagPanel.jsx - Floating DEV-only overlay for flipping feature flags.
 *
 * Renders nothing in production (gated on import.meta.env.DEV). In DEV
 * it shows every flag from the registry with a toggle, a description,
 * and an indicator for whether the value is currently overridden vs
 * coming from the registry default.
 *
 * Usage: mount once at the App root.
 *
 *   import DevFlagPanel from './components/dev/DevFlagPanel.jsx';
 *   <DevFlagPanel />
 *
 * The panel collapses to a tiny bookmark when not in use so it doesn't
 * obstruct the canvas. State (collapsed/open) lives in localStorage
 * so it survives reloads.
 */

import { useState, useSyncExternalStore } from 'react';
import { FS, swatch, GOLD, PARCH, VIOLET, VIOLET_BG, BODY } from '../theme.js';
import { FLAGS, flag, setFlagOverride } from '../../lib/flags.js';

const STORAGE_KEY = 'flag.__devPanelOpen';

// External-store subscription so toggling one flag re-reads every flag
// (overrides written via setFlagOverride trigger notifyAll → all rows
// reflect the new state immediately).
const listeners = new Set();
function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
// Keep a tick counter so getSnapshot returns a fresh value when flags change.
let tick = 0;
function notifyAll() { tick++; for (const fn of listeners) fn(); }
function getTick() { return tick; }

// Wrap setFlagOverride so we also nudge the local subscription.
function setOverrideWithNotify(name, value) {
  setFlagOverride(name, value);
  notifyAll();
}

function readIsOverridden(name) {
  try {
    return window.localStorage.getItem('flag.' + name) != null;
  } catch {
    return false;
  }
}

export default function DevFlagPanel() {
  // Hooks first - bailing on !DEV happens AFTER all hooks are declared
  // so React's invariants hold across the prod / dev render paths.
  const [open, setOpen] = useState(() => {
    try { return window.localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });
  // Force re-renders when any flag override changes.
  useSyncExternalStore(subscribe, getTick, () => 0);

  // Hard-gate on DEV. The component renders nothing in prod builds; Vite
  // tree-shakes the rest of this file out via dead-code elimination once
  // the static condition resolves to false.
  if (!import.meta.env.DEV) return null;

  function toggleOpen() {
    setOpen(o => {
      const next = !o;
      try { window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* private mode */ }
      return next;
    });
  }

  const baseStyle = {
    position: 'fixed', bottom: 12, right: 12, zIndex: 10000,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: FS.sm, color: '#1c1409',
  };

  if (!open) {
    return (
      <button
        type="button"
        data-pt-allow-small="1"
        onClick={toggleOpen}
        title="Open feature flag panel (DEV only)"
        style={{
          ...baseStyle,
          padding: '6px 10px',
          background: swatch.inkMag, color: GOLD,
          border: '1px solid #c9a24c', borderRadius: 6,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        }}
      >
        ⚑ flags
      </button>
    );
  }

  const flagNames = Object.keys(FLAGS);

  return (
    <div style={{
      ...baseStyle,
      width: 340, maxHeight: '70vh',
      display: 'flex', flexDirection: 'column',
      background: PARCH, border: '2px solid #1c1409',
      borderRadius: 8,
      boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'linear-gradient(to right, #1c1409, #2c2210)',
        color: GOLD,
        borderBottom: '1px solid #1c1409',
      }}>
        <span style={{ fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: FS.xs }}>
          ⚑ Feature flags (DEV)
        </span>
        <button
          type="button"
          onClick={toggleOpen}
          aria-label="Close flag panel"
          style={{
            background: 'transparent', border: 'none',
            color: GOLD, cursor: 'pointer', fontSize: FS['14'], lineHeight: 1,
          }}
        >×</button>
      </div>

      {/* Flag rows */}
      <div style={{ overflow: 'auto', padding: '4px 0' }}>
        {flagNames.map(name => {
          const value = flag(name);
          const overridden = readIsOverridden(name);
          return (
            <label
              key={name}
              style={{
                display: 'grid',
                gridTemplateColumns: '36px 1fr auto',
                gap: 8,
                alignItems: 'flex-start',
                padding: '6px 10px',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(28,20,9,0.08)',
              }}
            >
              <input
                type="checkbox"
                checked={value}
                onChange={e => setOverrideWithNotify(name, e.target.checked)}
                style={{ marginTop: 2, accentColor: '#c9a24c', width: 18, height: 18, cursor: 'pointer' }}
              />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, color: swatch.inkMag,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {name}
                  {overridden && (
                    <span title="Override set (clear to use default)" style={{
                      fontSize: FS.micro, fontWeight: 700, color: VIOLET,
                      background: VIOLET_BG, border: '1px solid #7B4FCF',
                      borderRadius: 3, padding: '0 4px', letterSpacing: '0.04em',
                    }}>
                      OVERRIDE
                    </span>
                  )}
                </div>
                <div style={{ fontSize: FS.xs, color: BODY, lineHeight: 1.45, marginTop: 2 }}>
                  {FLAGS[name].description}
                </div>
                <div style={{ fontSize: FS.xxs, color: swatch.inkMag3, marginTop: 2 }}>
                  default: <strong>{String(FLAGS[name].default)}</strong>
                </div>
              </div>
              {overridden && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setOverrideWithNotify(name, null); }}
                  title="Clear override (revert to default)"
                  style={{
                    fontSize: FS.xxs,
                    background: 'transparent', border: '1px solid #6b5340',
                    color: swatch.inkMag3, borderRadius: 4,
                    padding: '2px 6px', cursor: 'pointer',
                    alignSelf: 'center',
                  }}
                >
                  clear
                </button>
              )}
            </label>
          );
        })}
      </div>

      <div style={{
        padding: '6px 10px',
        fontSize: FS.xxs, color: swatch.inkMag3,
        background: 'rgba(28,20,9,0.05)',
        borderTop: '1px solid rgba(28,20,9,0.08)',
      }}>
        Overrides persist in localStorage. URL params (?flag.X=true) also work.
      </div>
    </div>
  );
}
