/**
 * SummaryTabV2.jsx — P129 / D-2 magazine-spread Summary.
 *
 * Two-column layout:
 *   LEFT  — the shared settlement quick guide: one identity sentence,
 *           three defining truths, and one immediate pressure.
 *   RIGHT — the same guide's three important people and one entry point.
 *
 * The composer is shared with Table View, Session Mode, and the PDF. Summary
 * therefore stays a projection of canonical settlement data rather than growing
 * a second, hand-maintained interpretation of the generated dossier.
 *
 *   FOOTER — "📱 Open in Table View" button that triggers the
 *     P142 / D-6 Table View flag in user preferences.
 *
 * Self-gates upstream — OutputContainer renders SummaryTabV2 vs the
 * legacy SummaryTab based on flag('summaryMagazineV2').
 *
 * Read-only on the props. No store mutation, no state. The user-edits
 * surfaces (E-1 inline rename on faction/NPC etc.) live in PeopleTab
 * and friends; the Summary tab is the "read this at the table" view.
 */

import { useMemo } from 'react';
import { FS, swatch } from '../theme.js';
import { formatCount } from '../../domain/formatNumber.js';
import { composeSettlementQuickGuide } from '../../domain/summary/settlementQuickGuide.js';
import EconomyFreshnessNote from './EconomyFreshnessNote.jsx';
import ReadSystemStateBar from '../settlement/ReadSystemStateBar.jsx';
import Button from '../primitives/Button.jsx';

const GOLD = swatch['#8C6F32'];
const INK = swatch['#1B1408'];
const INK_DEEP = swatch['#2C2210'];
const BODY = swatch['#3A2F18'];
const MUTED = swatch['#9C8068'];
const PARCH = swatch['#FBF5E6'];
const BORDER = swatch['#E8D9B0'];

const GREEN = swatch['#4A7A3A'];
const AMBER = swatch['#D08020'];
const RED = swatch['#A23434'];

const serif = '"Crimson Text", Georgia, serif';
const sans = '"Nunito", system-ui, sans-serif';

export default function SummaryTabV2({ settlement, onOpenTableView }) {
  // NOTE: keep ALL hooks above any early return. React Hooks must be
  // called in the same order every render — gating the useMemos behind
  // an early `if (!settlement)` would create a hooks-order violation
  // flagged by react-hooks/rules-of-hooks.
  const guide = useMemo(
    () => composeSettlementQuickGuide(settlement),
    [settlement],
  );

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
            <> · {formatCount(settlement.population)} pop</>
          )}
          {settlement.config?.tradeRouteAccess && (
            <> · {String(settlement.config.tradeRouteAccess).replace(/_/g, ' ')}</>
          )}
        </div>
      </header>

      {/* The 4-dimension glance (R-5b #22). The Summary used to open at
          "sentence" with no glance above it; the strip restores the top rung of
          the legibility ladder for read-mode and public-gallery readers, who
          previously could not see these four dimensions at all (the store-bound
          SystemStateBar is edit-mode only). The strip renders nothing only when
          there is no settlement at all — deriveSystemState is total, so a
          sanitized gallery projection degrades to neutral bands rather than
          vanishing (measured, pinned). Derivation stays INSIDE the strip —
          this tab remains read-only on its props, no store. */}
      <div style={{ padding: '14px 18px 0' }}>
        <ReadSystemStateBar settlement={settlement} />
      </div>

      {/* Two-column body */}
      <div style={{
        display: 'flex', gap: 14,
        padding: '16px 18px',
        alignItems: 'flex-start',
      }}>
        {/* LEFT — one identity, three truths, one pressure. */}
        <div style={{ flex: 1.2, minWidth: 0 }}>
          <div style={{
            fontSize: FS.micro, fontWeight: 800,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: GOLD,
          }}>
            Settlement quick guide
          </div>

          <p className="oc-dropcap-prose" style={{
            margin: '8px 0 0',
            fontFamily: serif, fontSize: FS['14.5'],
            color: INK_DEEP, lineHeight: 1.65,
          }}>
            {guide.identitySentence}
          </p>

          <div style={{
            display: 'flex', flexDirection: 'column', gap: 8,
            marginTop: 12,
          }}>
            {guide.definingTruths.map((truth) => (
              <div
                key={truth.id}
                style={{
                  paddingLeft: 9,
                  borderLeft: `2px solid ${BORDER}`,
                }}
              >
                <div style={{
                  fontSize: FS.nano, fontWeight: 800,
                  letterSpacing: '0.09em', textTransform: 'uppercase',
                  color: MUTED,
                }}>
                  {truth.label}
                </div>
                <div style={{
                  marginTop: 1,
                  fontSize: FS.xs, color: BODY, lineHeight: 1.5,
                }}>
                  {truth.text}
                </div>
              </div>
            ))}
          </div>

          {/* ECONOMY FRESHNESS (Wave R-4) — the third defining truth ("How it
              lives") is composeMaterialTruth's fold of economicState prosperity /
              food security / primary exports, the same generation-time read-model
              EconomicsTab tallies. It is not re-derived when an event lands, so
              this surface carries the same one shared sentence. Anchored under the
              truths so it qualifies THEM, not the pressure line or the cheat sheet.
              Conditional: a fresh settlement renders byte-identically. */}
          <EconomyFreshnessNote settlement={settlement} variant="tallies" margin="10px 0 0" />

          <div style={{
            marginTop: 13,
            padding: '9px 11px',
            background: PARCH,
            border: `1px solid ${BORDER}`,
            borderLeft: `3px solid ${RED}`,
          }}>
            <div style={{
              fontSize: FS.nano, fontWeight: 800,
              letterSpacing: '0.09em', textTransform: 'uppercase',
              color: RED,
            }}>
              {guide.immediatePressure.label}
            </div>
            <div style={{
              marginTop: 2,
              fontFamily: serif, fontSize: FS.sm, fontStyle: 'italic',
              color: INK_DEEP, lineHeight: 1.5,
            }}>
              {guide.immediatePressure.text}
            </div>
          </div>
        </div>

        {/* RIGHT — three people and one entry point. */}
        <aside style={{
          flex: 0.95,
          padding: 12,
          background: PARCH,
          border: `1px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            marginBottom: 2,
          }}>
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

          <div style={{
            padding: '7px 9px',
            background: swatch.white,
            border: `1px solid ${BORDER}`,
            borderLeft: `3px solid ${AMBER}`,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', gap: 6,
            }}>
              <span style={{
                fontFamily: serif, fontWeight: 700, fontSize: FS['11.5'],
                color: INK,
              }}>
                {guide.entryPoint.label}
              </span>
              <span style={{
                fontSize: FS['7.5'], fontWeight: 800,
                color: AMBER, letterSpacing: '0.08em',
              }}>
                HOOK
              </span>
            </div>
            <div style={{
              marginTop: 2,
              fontSize: FS.xxs, color: BODY, lineHeight: 1.4,
            }}>
              {guide.entryPoint.text}
            </div>
          </div>

          {guide.importantPeople.length === 0 ? (
            <div style={{
              padding: '8px 6px',
              fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
            }}>
              No important people have been generated yet.
            </div>
          ) : guide.importantPeople.map((person) => (
            <div
              key={person.id}
              style={{
                padding: '7px 9px',
                background: swatch.white,
                border: `1px solid ${BORDER}`,
                borderLeft: `3px solid ${GREEN}`,
              }}
            >
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', gap: 6,
              }}>
                <span style={{
                  fontFamily: serif, fontWeight: 700, fontSize: FS['11.5'],
                  color: INK, minWidth: 0, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {person.name}
                </span>
                <span style={{
                  fontSize: FS['7.5'], fontWeight: 800,
                  color: GREEN, letterSpacing: '0.08em',
                  flexShrink: 0,
                }}>
                  NPC
                </span>
              </div>
              <div style={{
                marginTop: 1,
                fontSize: FS.nano, color: MUTED, lineHeight: 1.35,
              }}>
                {person.role}
              </div>
              <div style={{
                marginTop: 2,
                fontSize: FS.xxs, color: BODY, lineHeight: 1.4,
              }}>
                {person.detail}
              </div>
            </div>
          ))}

          {typeof onOpenTableView === 'function' && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              fullWidth
              onClick={onOpenTableView}
              style={{ marginTop: 6 }}
            >
              Open in Table View
            </Button>
          )}
        </aside>
      </div>

    </div>
  );
}
