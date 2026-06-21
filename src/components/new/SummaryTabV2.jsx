/**
 * SummaryTabV2.jsx — magazine-spread Summary.
 *
 * Two-column layout:
 *   LEFT (flex 1.2) — "The town in 4 sentences"
 *     Serif elevator pitch with an italic accent line on the key tension.
 *     Pulls from settlement.pressureSentence + arrivalScene, with
 *     the italic accent picked from settlement.pressureSentence
 *     itself (the sentence the engine already wrote as the
 *     headline tension).
 *
 *   RIGHT (flex 0.95) — "Tonight at the table"
 *     NPC / Hook / Twist / Red flag cards composed by
 *     domain/summary/tonightAtTheTable.js. Color-coded left borders
 *     mirror the canvas mockup.
 *
 *   FOOTER — "📱 Open in Table View" button that triggers the
 *     Table View flag in user preferences.
 *
 * Self-gates upstream — OutputContainer renders SummaryTabV2 vs the
 * legacy SummaryTab based on flag('summaryMagazineV2').
 *
 * Read-only on the props. No store mutation, no state. The user-edits
 * surfaces (inline rename on faction/NPC etc.) live in PeopleTab
 * and friends; the Summary tab is the "read this at the table" view.
 */

import { useMemo } from 'react';
import { FS, swatch } from '../theme.js';
import { tonightAtTheTable } from '../../domain/summary/tonightAtTheTable.js';
import Button from '../primitives/Button.jsx';

const GOLD = swatch['#8C6F32'];
const INK = swatch['#1B1408'];
const INK_DEEP = swatch['#2C2210'];
const BODY = swatch['#3A2F18'];
const MUTED = swatch['#9C8068'];
const PARCH = swatch['#FBF5E6'];
const BORDER = swatch['#E8D9B0'];

const GREEN = swatch['#4A7A3A'];
const VIOLET = swatch['#7B4FCF'];
const AMBER = swatch['#D08020'];
const RED = swatch['#A23434'];

const serif = '"Crimson Text", Georgia, serif';
const sans = '"Nunito", system-ui, sans-serif';

const KIND_ACCENT = {
  NPC:   GREEN,
  HOOK:  AMBER,
  TWIST: VIOLET,
  RED:   RED,
};

const KIND_LABEL = {
  NPC:   'NPC',
  HOOK:  'HOOK',
  TWIST: 'TWIST',
  RED:   'RED',
};

/**
 * Pick the italic accent line — the one phrase that names the headline
 * tension. We prefer pressureSentence if it's a single sentence with a
 * clear "because" / "stopped pretending" / "runs a quiet" pattern,
 * else we just take the first sentence of pressureSentence.
 */
function pickAccentLine(pressureSentence) {
  if (!pressureSentence) return null;
  const trimmed = String(pressureSentence).trim();
  // Try to find an italicizable clause — the part after a comma or
  // dash if there is one, which often carries the punch.
  const dashMatch = trimmed.match(/—\s*([^.!?—]+[.!?]?)/);
  if (dashMatch && dashMatch[1].length > 12 && dashMatch[1].length < 90) {
    return dashMatch[1].trim();
  }
  // Otherwise, the whole sentence (capped at the first .).
  const dot = trimmed.indexOf('.');
  if (dot > 24) return trimmed.slice(0, dot + 1);
  return trimmed;
}

export default function SummaryTabV2({ settlement, onOpenTableView }) {
  // NOTE: keep ALL hooks above any early return. React Hooks must be
  // called in the same order every render — gating the useMemos behind
  // an early `if (!settlement)` would create a hooks-order violation
  // flagged by react-hooks/rules-of-hooks.
  const tableEntries = useMemo(
    () => tonightAtTheTable(settlement),
    [settlement],
  );

  const pressure = settlement?.pressureSentence || '';
  const arrival = settlement?.arrivalScene || '';
  const accent = useMemo(() => pickAccentLine(pressure), [pressure]);
  const pressureTail = useMemo(() => {
    if (!accent || !pressure) return pressure;
    // Strip the accent from the pressure sentence so we don't repeat
    // the phrase. The accent renders inside the prose as the
    // italicized clause.
    const idx = pressure.indexOf(accent);
    if (idx < 0) return pressure;
    return pressure.replace(accent, '').replace(/\s{2,}/g, ' ').trim();
  }, [pressure, accent]);

  // Plot hooks moved out to their own Summary sub-tab (PlotHooksTab, spec §8)
  // so DM Summary and Plot Hooks read as distinct surfaces.

  // Deferred null check (after hooks have been registered).
  if (!settlement) {
    return (
      <div style={{ padding: 24, color: MUTED, fontFamily: sans }}>
        No settlement to summarise.
      </div>
    );
  }

  return (
    <div style={{
      padding: 0,
      fontFamily: sans,
      background: swatch.white,
    }}>
      {/* Header band — name + meta */}
      <header style={{
        padding: '16px 18px 12px',
        background: PARCH,
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <h1 style={{
          margin: 0,
          fontFamily: serif, fontWeight: 600, fontSize: FS['22'],
          color: INK, letterSpacing: '-0.005em',
          lineHeight: 1.15,
        }}>
          {settlement.name || 'Untitled settlement'}
        </h1>
        <div style={{
          marginTop: 2,
          fontSize: FS.xxs, color: MUTED,
          letterSpacing: '0.04em',
        }}>
          {String(settlement.tier || 'SETTLEMENT').toUpperCase()}
          {settlement.population != null && (
            <> · {settlement.population.toLocaleString()} pop</>
          )}
          {settlement.config?.tradeRouteAccess && (
            <> · {String(settlement.config.tradeRouteAccess).replace(/_/g, ' ')}</>
          )}
        </div>
      </header>

      {/* Two-column body */}
      <div style={{
        display: 'flex', gap: 14,
        padding: '16px 18px',
        alignItems: 'flex-start',
      }}>
        {/* LEFT — identity prose */}
        <div style={{ flex: 1.2, minWidth: 0 }}>
          <div style={{
            fontSize: FS.micro, fontWeight: 800,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: GOLD,
          }}>
            The town in 4 sentences
          </div>

          <p style={{
            margin: '8px 0 0',
            fontFamily: serif, fontSize: FS['14.5'],
            color: INK_DEEP, lineHeight: 1.65,
          }}>
            {accent && (
              <em style={{ color: GOLD, fontStyle: 'italic' }}>
                {accent}
              </em>
            )}
            {accent && pressureTail && ' '}
            {pressureTail}
            {arrival && (
              <>
                {' '}
                <span style={{ color: MUTED }}>{arrival}</span>
              </>
            )}
          </p>

          {settlement.economicState?.prosperity?.tier && (
            <div style={{
              marginTop: 14,
              fontSize: FS.xs, color: BODY, lineHeight: 1.6,
            }}>
              <strong style={{ color: GOLD, letterSpacing: '0.04em' }}>
                {String(settlement.economicState.prosperity.tier).toUpperCase()}
              </strong>{' '}
              prosperity tier.{' '}
              {settlement.stressors?.length > 0 && (
                <>
                  Active stressors: {settlement.stressors.map(s => s.label || s.type).join(', ')}.
                </>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Tonight at the table */}
        <aside style={{
          flex: 0.95,
          padding: 12,
          background: PARCH,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 2,
          }}>
            <span style={{ fontSize: FS.xs, color: AMBER }}>🕯</span>
            <span style={{
              fontSize: FS.micro, fontWeight: 800,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: AMBER,
            }}>
              Tonight at the table
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: FS.micro, color: MUTED, fontStyle: 'italic' }}>
              cheat sheet
            </span>
          </div>

          {tableEntries.length === 0 ? (
            <div style={{
              padding: '8px 6px',
              fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
            }}>
              No table-night entries derived yet. Generate a richer
              settlement or run the narrative layer.
            </div>
          ) : (
            tableEntries.map((row, i) => {
              const accent = KIND_ACCENT[row.kind] || GOLD;
              return (
                <div
                  key={i}
                  style={{
                    padding: '6px 8px',
                    background: swatch.white,
                    border: `1px solid ${BORDER}`,
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: 4,
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 6,
                  }}>
                    <span style={{
                      fontFamily: serif, fontWeight: 700, fontSize: FS['11.5'],
                      color: INK, minWidth: 0, overflow: 'hidden',
                      textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {row.title}
                    </span>
                    <span style={{
                      fontSize: FS['7.5'], fontWeight: 800,
                      color: accent, letterSpacing: '0.08em',
                      flexShrink: 0,
                    }}>
                      {KIND_LABEL[row.kind] || row.kind}
                    </span>
                  </div>
                  <div style={{
                    fontSize: FS.xxs, color: BODY,
                    marginTop: 2, lineHeight: 1.4,
                  }}>
                    {row.body}
                  </div>
                </div>
              );
            })
          )}

          {typeof onOpenTableView === 'function' && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              fullWidth
              onClick={onOpenTableView}
              style={{ marginTop: 6 }}
            >
              📱 Open in Table View
            </Button>
          )}
        </aside>
      </div>

    </div>
  );
}
