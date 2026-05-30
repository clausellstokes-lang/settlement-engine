/**
 * QuickInspector.jsx — P136 / M-6 hover-peek for placed settlements.
 *
 * When the user hovers a placement marker (without clicking), this
 * floating card surfaces three high-leverage lines:
 *   • Name + tier · pop
 *   • Pressure sentence (the engine's headline tension)
 *   • Top hook title — the Tier-A plot hook if there is one
 *
 * The full PlacementDetailCard is still the click-to-open surface.
 * QuickInspector is the "what's this place?" peek so the user doesn't
 * have to commit to opening the side card to glance.
 *
 * Position: fixed-top-right of the viewport, just under the toolbar.
 * Matches PlacementDetailCard's corner so the two never compete; the
 * Inspector hides whenever a click-selection is active (the bigger
 * card takes over the spot).
 *
 * Self-gated on:
 *   • hoveredSettlementId is set
 *   • selectedSettlementId is NOT set (committed selection wins)
 *
 * The hover-emit lives in MapOverlay (placement marker handlers). This
 * component is purely presentational.
 */

import { useMemo } from 'react';
import { FS, VIOLET } from '../theme.js';
import { useStore } from '../../store';

const GOLD = '#C9A24C';
const INK = '#1B1408';
const BODY = '#3A2F18';
const MUTED = '#9C8068';
const BORDER = '#E8D9B0';
const PARCH = '#FBF5E6';
const serif = '"Crimson Text", Georgia, serif';
const sans = '"Nunito", system-ui, sans-serif';

export default function QuickInspector() {
  const hoveredId = useStore(s => s.hoveredSettlementId);
  const selectedId = useStore(s => s.selectedSettlementId);
  const saves = useStore(s => s.savedSettlements);

  const save = useMemo(() => {
    if (!hoveredId) return null;
    return (saves || []).find(s => s.id === hoveredId) || null;
  }, [hoveredId, saves]);

  if (!hoveredId) return null;
  if (selectedId) return null;  // click-selection takes the slot
  if (!save) return null;

  const s = save.settlement || save;
  const name = s.name || save.name || 'Unnamed';
  const tier = s.tier || save.tier || '—';
  const pop = (s.population || 0).toLocaleString();
  const pressure = s.pressureSentence || '';
  const topHook = (() => {
    const hooks = Array.isArray(s.plotHooks) ? s.plotHooks
                : Array.isArray(s.hooks) ? s.hooks : [];
    if (!hooks.length) return null;
    const sorted = [...hooks].sort((a, b) => {
      const order = { A: 0, B: 1, C: 2 };
      return (order[a.tier] ?? 3) - (order[b.tier] ?? 3);
    });
    return sorted[0]?.title || sorted[0]?.headline || null;
  })();

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'absolute',
        top: 12, right: 12,
        zIndex: 30,
        minWidth: 240, maxWidth: 320,
        padding: 10,
        background: PARCH,
        border: `1px solid ${BORDER}`,
        borderLeft: `3px solid ${GOLD}`,
        borderRadius: 5,
        boxShadow: '0 4px 14px rgba(0,0,0,0.20)',
        fontFamily: sans,
        pointerEvents: 'none',  // never blocks clicks on the map underneath
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'baseline',
        gap: 6, justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: serif, fontWeight: 700, fontSize: FS['14'],
          color: INK, minWidth: 0, overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
        }}>
          {name}
        </div>
        <div style={{
          fontSize: FS.micro, fontWeight: 800, color: GOLD,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          peek
        </div>
      </div>
      <div style={{
        fontSize: FS.xxs, color: MUTED, marginTop: 1,
      }}>
        {String(tier).toUpperCase()} · {pop} pop
      </div>
      {pressure && (
        <div style={{
          fontFamily: serif, fontSize: FS['11.5'],
          color: BODY, lineHeight: 1.5,
          marginTop: 6,
          display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {pressure}
        </div>
      )}
      {topHook && (
        <div style={{
          fontSize: FS.xs, color: VIOLET, marginTop: 6,
          display: 'flex', gap: 5, alignItems: 'baseline',
        }}>
          <span style={{
            fontSize: FS.nano, fontWeight: 800, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: VIOLET,
          }}>
            Hook
          </span>
          <span style={{
            color: INK, fontWeight: 600,
            minWidth: 0, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {topHook}
          </span>
        </div>
      )}
    </div>
  );
}
