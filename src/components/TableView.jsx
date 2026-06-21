/**
 * TableView.jsx — phone-optimized "at the table" view.
 *
 * A ~380px single-column takeover for running a settlement live during a
 * session. Where the dossier is the wide read-at-home surface, this is the
 * glance-at-your-phone surface: the name, the one-line tension, the people
 * you'll voice tonight, the hook you'll drop, the twist you're holding, and
 * the one thing NOT to mention.
 *
 * Content reuses the same pure composer the magazine Summary uses
 * (`domain/summary/tonightAtTheTable`) so the cheat sheet here and the right
 * column there can never drift apart.
 *
 * Presentational + a close affordance:
 *   props.settlement — the settlement to run (raw or AI-refined; caller picks)
 *   props.onClose    — () => dismiss the overlay
 *
 * Esc and backdrop-click both close. Self-gating (flag + the tableViewOpen
 * pref) is the caller's job — OutputContainer only mounts this when
 * flag('tableView') && userPrefs.tableViewOpen, so this component renders
 * unconditionally when present.
 */

import { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { FS, ELEV, swatch } from './theme.js';
import { tonightAtTheTable } from '../domain/summary/tonightAtTheTable.js';
import IconButton from './primitives/IconButton.jsx';

const GOLD = swatch['#8C6F32'];
const GOLD_ACCENT = swatch['#C9A24C'];
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

const KIND_ACCENT = { NPC: GREEN, HOOK: AMBER, TWIST: VIOLET, RED };
const KIND_LABEL = { NPC: 'NPC', HOOK: 'HOOK', TWIST: 'TWIST', RED: 'RED' };

export default function TableView({ settlement, onClose }) {
  // Esc closes — mirrors HelpPopover. Registered unconditionally because the
  // caller only mounts TableView when it should be open.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const entries = useMemo(() => tonightAtTheTable(settlement), [settlement]);
  const stressors = Array.isArray(settlement?.stressors) ? settlement.stressors : [];
  const pressure = settlement?.pressureSentence || '';
  const prosperity = settlement?.economicState?.prosperity?.tier || '';

  return (
    // Backdrop click/Enter/Space closes the modal; role="dialog" is required for modal semantics so it can't become a native button.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Table view: ${settlement?.name || 'settlement'}`}
      onClick={onClose}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(12,8,4,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 12,
      }}
    >
      {/* Handlers only stopPropagation to keep clicks/keys inside the panel from closing the backdrop; the panel is not itself interactive. */}
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 380,
          height: '100%', maxHeight: 760,
          background: PARCH,
          border: `1px solid ${BORDER}`,
          borderRadius: 14,
          boxShadow: ELEV[3],
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          fontFamily: sans,
        }}
      >
        {/* Sticky header */}
        <header style={{
          flexShrink: 0,
          padding: '14px 16px',
          background: `linear-gradient(135deg, ${INK} 0%, ${INK_DEEP} 100%)`,
          display: 'flex', alignItems: 'flex-start', gap: 10,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{
              margin: 0,
              fontFamily: serif, fontWeight: 600, fontSize: FS.xxl,
              color: GOLD_ACCENT, lineHeight: 1.12,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {settlement?.name || 'Untitled settlement'}
            </h1>
            <div style={{
              marginTop: 3, fontSize: FS.xxs, color: MUTED, letterSpacing: '0.04em',
            }}>
              {String(settlement?.tier || 'SETTLEMENT').toUpperCase()}
              {settlement?.population != null && (
                <> · {settlement.population.toLocaleString()} pop</>
              )}
              {prosperity && <> · {String(prosperity).toUpperCase()}</>}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <IconButton
              Icon={X}
              label="Close table view"
              onClick={onClose}
              tone="ghost"
              size="lg"
            />
          </div>
        </header>

        {/* Scrollable body */}
        <div style={{
          flex: 1, minHeight: 0, overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {/* Tension line */}
          {pressure && (
            <div style={{
              padding: '10px 12px',
              background: swatch.white,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: 6,
              fontFamily: serif, fontSize: FS.lg, fontStyle: 'italic',
              color: INK_DEEP, lineHeight: 1.5,
            }}>
              {pressure}
            </div>
          )}

          {/* Stressor chips */}
          {stressors.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {stressors.map((s, i) => (
                <span key={i} style={{
                  fontSize: FS.micro, fontWeight: 800,
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  color: RED, background: 'rgba(162,52,52,0.08)',
                  border: '1px solid rgba(162,52,52,0.25)',
                  borderRadius: 4, padding: '3px 8px',
                }}>
                  {s.label || s.type}
                </span>
              ))}
            </div>
          )}

          {/* Tonight at the table */}
          <div>
            <div style={{
              fontSize: FS.micro, fontWeight: 800,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: AMBER, marginBottom: 8,
            }}>
              🕯 Tonight at the table
            </div>

            {entries.length === 0 ? (
              <div style={{
                fontSize: FS.sm, color: MUTED, fontStyle: 'italic', lineHeight: 1.5,
              }}>
                No table-night entries derived yet. Generate a richer settlement
                or run the narrative layer.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {entries.map((row, i) => {
                  const accent = KIND_ACCENT[row.kind] || GOLD;
                  return (
                    <div key={i} style={{
                      padding: '10px 12px',
                      background: swatch.white,
                      border: `1px solid ${BORDER}`,
                      borderLeft: `4px solid ${accent}`,
                      borderRadius: 6,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'baseline', gap: 8, marginBottom: 3,
                      }}>
                        <span style={{
                          fontFamily: serif, fontWeight: 700, fontSize: FS.md,
                          color: INK, minWidth: 0,
                        }}>
                          {row.title}
                        </span>
                        <span style={{
                          fontSize: FS.nano, fontWeight: 800,
                          color: accent, letterSpacing: '0.08em', flexShrink: 0,
                        }}>
                          {KIND_LABEL[row.kind] || row.kind}
                        </span>
                      </div>
                      <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
                        {row.body}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{
            marginTop: 'auto', paddingTop: 6,
            fontSize: FS.xxs, color: MUTED, textAlign: 'center', fontStyle: 'italic',
          }}>
            Tap outside or press Esc to close
          </div>
        </div>
      </div>
    </div>
  );
}
