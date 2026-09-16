/**
 * TableView.jsx — P142 / D-6 phone-optimized "at the table" view.
 *
 * A ~380px single-column takeover for running a settlement live during a
 * session. Where the dossier is the wide read-at-home surface, this is the
 * glance-at-your-phone surface: the name, the one-line tension, the people
 * you'll voice tonight, the hook you'll drop, the twist you're holding, and
 * the one thing NOT to mention.
 *
 * Content reuses the same compact guide as Summary, Session Mode, and PDF for
 * identity, defining truths, and pressure. The richer table-entry composer
 * remains underneath for twists and red flags that are valuable during play.
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
import { FS, swatch } from './theme.js';
import { formatCount } from '../domain/formatNumber.js';
import { tonightAtTheTable, prosperityLabel } from '../domain/summary/tonightAtTheTable.js';
import { composeSettlementQuickGuide } from '../domain/summary/settlementQuickGuide.js';
import EconomyFreshnessNote from './new/EconomyFreshnessNote.jsx';
import { FIELD_INK } from '../design/organic/ink.js';
import { LAMP_ACCENTS } from '../design/organic/lampTones.js';
import IconButton from './primitives/IconButton.jsx';
import { useDialogFocusTrap } from './primitives/useDialogFocusTrap.js';

// THE LANTERN TABLE (C14) — the desk by night (reference plate 04): a warm umber
// ground, cream ink, the four cheat-sheet kinds lit as lamp tones. The header
// stays the dark ink band it already was; the body drops from parchment to the
// field-notebook (dim) ramp so the whole surface reads as one pool of lamplight.
const GOLD_ACCENT = swatch['#C9A24C']; // header title on the dark ink band
const INK = swatch['#1B1408'];         // header gradient — deepest ink
const INK_DEEP = swatch['#2C2210'];    // header gradient — second stop
const MUTED = swatch['#9C8068'];       // header subtitle on the dark band

// The dim/field ramp (contrast-proven in tests/design/contrast.test.js).
const UMBER_DESK = FIELD_INK.ground;   // #211B12 — the night desk (panel ground)
const UMBER_CARD = FIELD_INK.panel;    // #2C2416 — a lifted plate on the desk (the umber)
const CREAM = FIELD_INK.ink;           // #ECE0C6 — primary ink in field mode
const CREAM_BODY = FIELD_INK.body;     // #D8C8A8 — body copy in field mode
const CREAM_FAINT = FIELD_INK.faint;   // #9C8C6E — faint labels (AA on the panel)
const FIELD_RULE = FIELD_INK.hairline; // #5A4E38 — the feint rule tone on the dark ground

const serif = '"Crimson Text", Georgia, serif';
const sans = '"Nunito", system-ui, sans-serif';

// The four lamp-tone kind accents (moss/gold/slate/ember), legible on UMBER_CARD.
const KIND_ACCENT = LAMP_ACCENTS;
const KIND_LABEL = { NPC: 'NPC', HOOK: 'HOOK', TWIST: 'TWIST', RED: 'RED' };

export default function TableView({ settlement, onClose }) {
  // Shared modal focus management (M12): focus-in on open, Tab/Shift+Tab cycling
  // trapped inside the panel, Escape-to-close, and focus restore on unmount.
  // Replaces the hand-rolled Escape-only listener — a full-screen aria-modal
  // dialog with no trap leaked keyboard focus to the obscured app behind it.
  const dialogRef = useDialogFocusTrap(true, onClose);

  // FIELD MODE wake lock (Organic Craft law §7 — the cook-mode pattern): while
  // the at-table view is open the screen stays awake, where supported. The lock
  // is auto-released by the platform when the tab hides; we re-acquire on
  // visibilitychange so returning mid-session keeps the table lit. Fails silent
  // (older Safari): the surface works identically without it. Interruption
  // persistence is already the caller's tableViewOpen pref (the store idiom).
  useEffect(() => {
    let lock = null;
    let disposed = false;
    const acquire = async () => {
      try {
        if (!disposed && document.visibilityState === 'visible') {
          lock = await navigator.wakeLock?.request?.('screen');
        }
      } catch { /* unsupported or denied — the view works without it */ }
    };
    const onVis = () => { if (document.visibilityState === 'visible') acquire(); };
    acquire();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVis);
      try { lock?.release?.(); } catch { /* already released */ }
    };
  }, []);

  const guide = useMemo(
    () => composeSettlementQuickGuide(settlement),
    [settlement],
  );
  const entries = useMemo(() => tonightAtTheTable(settlement), [settlement]);
  const stressors = Array.isArray(settlement?.stressors) ? settlement.stressors : [];
  const pressure = guide.immediatePressure.text;
  // components-dossier-library-3: prosperity is a STRING label, not a { tier }
  // object — the tolerant read is the SummaryTabV2 sibling.
  const prosperity = prosperityLabel(settlement?.economicState?.prosperity);

  return (
    // Backdrop: a presentational scrim that dismisses only on a click of the
    // scrim itself (currentTarget), the shared modal idiom. Escape + focus
    // management live in the panel's useDialogFocusTrap.
    <div
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1100,
        background: 'rgba(12,8,4,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 12,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Table view: ${settlement?.name || 'settlement'}`}
        tabIndex={-1}
        style={{
          width: '100%', maxWidth: 380,
          height: '100%', maxHeight: 760,
          background: UMBER_DESK,
          border: `1px solid ${FIELD_RULE}`,
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
                <> · {formatCount(settlement.population)} pop</>
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
          {/* Canonical first glance — the same facts lead every compact surface. */}
          <div>
            <div style={{
              fontFamily: serif, fontSize: FS.md,
              color: CREAM, lineHeight: 1.5,
            }}>
              {guide.identitySentence}
            </div>
            <div style={{
              display: 'flex', flexDirection: 'column',
              gap: 5, marginTop: 8,
            }}>
              {guide.definingTruths.map((truth) => (
                <div key={truth.id} style={{
                  paddingLeft: 8,
                  borderLeft: `2px solid ${FIELD_RULE}`,
                }}>
                  <span style={{
                    fontSize: FS.nano, fontWeight: 800,
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: CREAM_FAINT, marginRight: 5,
                  }}>
                    {truth.label}
                  </span>
                  <span style={{
                    fontSize: FS.xs, color: CREAM_BODY, lineHeight: 1.45,
                  }}>
                    {truth.text}
                  </span>
                </div>
              ))}
            </div>
            {/* ECONOMY FRESHNESS (Wave R-4) — this surface makes TWO economy
                claims from the generation-time read-model: the identity strip's
                prosperity label, and the "How it lives" defining truth
                (composeMaterialTruth's prosperity / food security / exports
                fold). Neither is re-derived when an event lands, so the shared
                note qualifies them here. CREAM_FAINT, not the parchment MUTED:
                this is the lantern-table dark ramp. Conditional, so an
                un-shifted settlement renders byte-identically. */}
            <EconomyFreshnessNote
              settlement={settlement}
              variant="tallies"
              margin="10px 0 0"
              color={CREAM_FAINT}
            />
          </div>

          {/* Tension line */}
          {pressure && (
            <div style={{
              padding: '10px 12px',
              background: UMBER_CARD,
              border: `1px solid ${FIELD_RULE}`,
              borderLeft: `3px solid ${LAMP_ACCENTS.HOOK}`,
              fontFamily: serif, fontSize: FS.lg, fontStyle: 'italic',
              color: CREAM, lineHeight: 1.5,
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
                  color: LAMP_ACCENTS.RED, background: 'transparent',
                  border: `1px solid ${LAMP_ACCENTS.RED}`,
                  padding: '3px 8px',
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
              color: LAMP_ACCENTS.HOOK, marginBottom: 8,
            }}>
              Tonight at the table
            </div>

            {entries.length === 0 ? (
              <div style={{
                fontSize: FS.sm, color: CREAM_FAINT, fontStyle: 'italic', lineHeight: 1.5,
              }}>
                No table-night entries derived yet. Generate a richer settlement
                or run the narrative layer.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {entries.map((row, i) => {
                  const accent = KIND_ACCENT[row.kind] || CREAM_FAINT;
                  return (
                    <div key={i} style={{
                      padding: '10px 12px',
                      background: UMBER_CARD,
                      border: `1px solid ${FIELD_RULE}`,
                      borderLeft: `4px solid ${accent}`,
                    }}>
                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'baseline', gap: 8, marginBottom: 3,
                      }}>
                        <span style={{
                          fontFamily: serif, fontWeight: 700, fontSize: FS.md,
                          color: CREAM, minWidth: 0,
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
                      <div style={{ fontSize: FS.sm, color: CREAM_BODY, lineHeight: 1.5 }}>
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
            fontSize: FS.xxs, color: CREAM_FAINT, textAlign: 'center', fontStyle: 'italic',
          }}>
            Tap outside or press Esc to close
          </div>
        </div>
      </div>
    </div>
  );
}
