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

import { useMemo, useState } from 'react';
import { FS, SP, swatch, GOLD_TXT, AMBER_DEEP } from '../theme.js';
import { tonightAtTheTable } from '../../domain/summary/tonightAtTheTable.js';
import { buildSummaryMarkdown } from '../../domain/summary/buildSummaryMarkdown.js';
import Button from '../primitives/Button.jsx';
// The living-world differentiator: when a prior causal snapshot exists, the
// default Summary leads with what moved since the world last advanced. Same
// self-gating read-model the legacy SummaryTab used (renders nothing on a
// freshly-generated, never-advanced settlement), so V2 no longer hides deltas.
import WhatChangedPanel from '../settlement/WhatChangedPanel.jsx';

const GOLD = swatch['#8C6F32'];
const INK = swatch['#1B1408'];
const INK_DEEP = swatch['#2C2210'];
const BODY = swatch['#3A2F18'];
const PARCH = swatch['#FBF5E6'];
const BORDER = swatch['#E8D9B0'];

const GREEN = swatch['#4A7A3A'];
const VIOLET = swatch['#7B4FCF'];
const AMBER = swatch['#D08020'];
const RED = swatch['#A23434'];

const serif = '"Crimson Text", Georgia, serif';
const sans = '"Nunito", system-ui, sans-serif';

// Border accent (non-text, 3:1 floor) keeps the vivid hues. The HOOK amber
// (#D08020) fails the 4.5:1 text floor on the white card, so its TEXT role uses
// AMBER_DEEP — the indicator-vs-textColor split the tab strip already uses for
// gold. The other three already clear AA as text and reuse their accent.
const KIND_ACCENT = {
  NPC:   GREEN,
  HOOK:  AMBER,
  TWIST: VIOLET,
  RED:   RED,
};
const KIND_TEXT = {
  NPC:   GREEN,
  HOOK:  AMBER_DEEP,
  TWIST: VIOLET,
  RED:   RED,
};

const KIND_LABEL = {
  NPC:   'NPC',
  HOOK:  'Hook',
  TWIST: 'Twist',
  RED:   'Red flag',
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

// The clipboard markdown builder now lives in the shared
// domain/summary/buildSummaryMarkdown.js module so this magazine view and the
// legacy SummaryTab can never drift on the at-the-table export shape.

export default function SummaryTabV2({ settlement, onOpenTableView, hideIdentity = false }) {
  const [copied, setCopied] = useState(false);
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

  // Has the world moved? A prior causal snapshot (priorSettlement /
  // priorCausalState) or a population arc of >=2 points is exactly the condition
  // under which WhatChangedPanel renders content. We gate the wrapper on the same
  // signal so an un-advanced settlement paints no empty band, and the panel still
  // owns the authoritative self-gate.
  const hasDelta = !!(
    settlement?.priorSettlement ||
    settlement?.priorCausalState ||
    (Array.isArray(settlement?.populationHistory) && settlement.populationHistory.length >= 2)
  );

  // Active crises — for a time-pressured GM the LIVE crisis is the runnable
  // essential (P1), so it leads the spread as the one loud top element. Same
  // self-gating read the legacy SummaryTab used; a peaceful town shows nothing.
  const stresses = (Array.isArray(settlement?.stress) ? settlement.stress : settlement?.stress ? [settlement.stress] : []).filter(Boolean);

  const copyDossier = () => {
    navigator.clipboard?.writeText(buildSummaryMarkdown(settlement, tableEntries));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Plot hooks moved out to their own Summary sub-tab (PlotHooksTab, spec §8)
  // so DM Summary and Plot Hooks read as distinct surfaces.

  // Deferred null check (after hooks have been registered).
  if (!settlement) {
    return (
      <div style={{ padding: 24, color: BODY, fontFamily: sans }}>
        No settlement to summarise.
      </div>
    );
  }

  return (
    <div style={{
      padding: 0,
      fontFamily: sans,
      background: swatch.white,
      // No own page cap: width discipline is the parent dossier card's job (it
      // is already capped at PAGE/PROSE by every caller). Re-declaring a 1200
      // cap here only painted a slab narrower than the already-capped parent in
      // the gallery mount. The per-content prose measure (the 38em left column)
      // is the legitimate inner cap and stays. (P12 / finding.)
    }}>
      {/* Header band — name + meta + subordinate Copy. Suppressed when the
          dossier's own DossierHeaderRow is shown (saved-settlement view), so
          the identity isn't rendered twice within ~200px. */}
      {!hideIdentity && (
        <header style={{
          // The tabpanel column now owns the horizontal inset (SP.lg) shared
          // by every tab body. This full-bleed parchment header re-expresses
          // its edge-to-edge band with a negative margin equal to that inset so
          // the strip still spans the card edges, then re-pads its own content.
          // (P12 — column owns the frame; the bleed is the intentional override.)
          margin: `0 -${SP.lg}px`,
          padding: `16px ${SP.lg}px 12px`,
          background: PARCH,
          borderBottom: `1px solid ${BORDER}`,
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: 10,
        }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            {/* Name is the page hero — raised to 28px and paired with weight +
                ink color so identity (not the eyebrow) wins the squint test. */}
            <h1 style={{
              margin: 0,
              fontFamily: serif, fontWeight: 700, fontSize: FS['28'],
              color: INK, letterSpacing: '-0.005em',
              lineHeight: 1.12,
            }}>
              {settlement.name || 'Untitled settlement'}
            </h1>
            <div style={{
              marginTop: 3,
              fontSize: FS.xs, color: BODY,
              letterSpacing: '0.04em',
            }}>
              <span style={{ textTransform: 'uppercase' }}>
                {String(settlement.tier || 'settlement')}
              </span>
              {settlement.population != null && (
                <> · {settlement.population.toLocaleString()} pop</>
              )}
              {settlement.config?.tradeRouteAccess && (
                <> · {String(settlement.config.tradeRouteAccess).replace(/_/g, ' ')}</>
              )}
            </div>
          </div>
          {/* Subordinate ghost Copy — restores the legacy at-the-table dossier
              export V2 had dropped, placed so it does not out-shout the name. */}
          <Button variant="ghost" size="sm" onClick={copyDossier} style={{ flexShrink: 0 }}>
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
        </header>
      )}

      {/* What changed since the world last moved — leads the default read when a
          prior snapshot exists; the wrapper is gated on the same signal so an
          un-advanced settlement paints no empty band (WhatChangedPanel still owns
          the authoritative self-gate inside). */}
      {hasDelta && (
        <div style={{ padding: '14px 0 0' }}>
          <WhatChangedPanel
            settlement={settlement}
            priorSettlement={settlement?.priorSettlement || null}
            before={settlement?.priorCausalState || null}
            populationHistory={settlement?.populationHistory}
          />
        </div>
      )}

      {/* ── ACTIVE CRISIS (the runnable essential — leads the spread) ─────────
          A freshly generated tense town must show its live crisis on the default
          tab, not open straight into flavour prose. Kept as a single compact
          accent-left row (3px left border + tint, not the legacy 2px full box)
          so it stays loud without reintroducing box-soup on the magazine layout.
          Self-gates on stresses. (P1 content-is-hero / P3 / P4.) */}
      {stresses.length > 0 && (
        <div style={{ padding: '12px 0 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {stresses.map((v, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, alignItems: 'flex-start',
              background: `${v.colour}0e`, borderLeft: `3px solid ${v.colour}`,
              padding: '8px 12px',
            }}>
              <span style={{ fontSize: FS.md, flexShrink: 0 }}>{v.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: serif, fontSize: FS.sm, fontWeight: 700, color: v.colour }}>{v.label}</span>
                  <span style={{ fontSize: FS.micro, fontWeight: 800, color: v.colour, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active Crisis</span>
                </div>
                {v.crisisHook && (
                  <p style={{ margin: '3px 0 0', fontSize: FS.xs, color: BODY, fontStyle: 'italic', lineHeight: 1.4 }}>
                    <span style={{ fontStyle: 'normal', fontWeight: 700, color: v.colour }}>Hook: </span>{v.crisisHook}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Two-column body — reflows to a single readable column on a tablet at
          the table (flexWrap + flex-basis minimums) so the cheat sheet is never
          squeezed into a narrow rail. (P12 / checklist 26.) */}
      <div style={{
        display: 'flex', gap: 14, flexWrap: 'wrap',
        // Horizontal inset is now owned by the tabpanel column; only the
        // vertical rhythm is local. (P12.)
        padding: '16px 0',
        alignItems: 'flex-start',
      }}>
        {/* LEFT — identity prose */}
        <div style={{ flex: '1.2 1 320px', minWidth: 0 }}>
          {/* Demoted to the quieter eyebrow (muted weight-700): the right-column
              cheat sheet is the runnable hero, so the serif identity prose below
              should read as the dominant left-column content. (P4 / P6.) */}
          <h2 style={{
            margin: 0,
            fontSize: FS.micro, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: BODY,
          }}>
            The town in 4 sentences
          </h2>

          <p style={{
            margin: '8px 0 0',
            maxWidth: '38em',   // hold the ~45-75ch prose measure (P12)
            fontFamily: serif, fontSize: FS['14.5'],
            color: INK_DEEP, lineHeight: 1.65,
          }}>
            {accent && (
              <em style={{ color: GOLD_TXT, fontStyle: 'italic' }}>
                {accent}
              </em>
            )}
            {accent && pressureTail && ' '}
            {pressureTail}
            {arrival && (
              <>
                {' '}
                <span style={{ color: BODY }}>{arrival}</span>
              </>
            )}
          </p>

          {/* Degraded state: when there is no identity prose at all, mirror the
              right column's empty-state pattern so the focal column never
              collapses to a bare label. (P10 / checklist 22.) */}
          {!pressure && !arrival && !settlement.economicState?.prosperity?.tier && (
            <p style={{
              margin: '8px 0 0',
              fontSize: FS.xs, color: BODY, fontStyle: 'italic', lineHeight: 1.6,
            }}>
              No identity prose yet. Run the Narrative Layer to draw out the
              town's pitch.
            </p>
          )}

          {settlement.economicState?.prosperity?.tier && (
            <div style={{
              marginTop: 14,
              fontSize: FS.xs, color: BODY, lineHeight: 1.6,
            }}>
              <strong style={{ color: GOLD_TXT, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {String(settlement.economicState.prosperity.tier)}
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

        {/* RIGHT — Tonight at the table (the runnable hero; kept as the louder
            anchor eyebrow against the demoted left one). */}
        <aside style={{
          flex: '0.95 1 320px',
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
            {/* Heading is the cheat-sheet column's squint-test winner, so it
                must clear AA: AMBER_DEEP (vs the sub-AA #D08020) at the FS.xs
                floor, keeping the 🕯 glyph + tracking as the second channel. */}
            <span style={{ fontSize: FS.xs, color: AMBER_DEEP }}>🕯</span>
            <h2 style={{
              margin: 0,
              fontSize: FS.xs, fontWeight: 800,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: AMBER_DEEP,
            }}>
              Tonight at the table
            </h2>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: FS.xs, color: BODY, fontStyle: 'italic' }}>
              cheat sheet
            </span>
          </div>

          {tableEntries.length === 0 ? (
            <div style={{
              padding: '8px 6px',
              fontSize: FS.xs, color: BODY, fontStyle: 'italic',
            }}>
              Nothing to run tonight yet. Run the Narrative Layer to
              draw out the night's cast and hooks.
            </div>
          ) : (
            tableEntries.map((row, i) => {
              const accent = KIND_ACCENT[row.kind] || GOLD;
              const labelColor = KIND_TEXT[row.kind] || GOLD_TXT;
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
                    {/* KIND text label is the primary categoriser AND the
                        non-color second channel beside the colored left border;
                        raised to the FS.xs floor so it stays legible. (P7.) */}
                    <span style={{
                      fontSize: FS.xs, fontWeight: 800,
                      color: labelColor, letterSpacing: '0.08em',
                      flexShrink: 0,
                    }}>
                      {KIND_LABEL[row.kind] || row.kind}
                    </span>
                  </div>
                  {/* Runnable detail — raised off the 10px floor toward the
                      legacy 13px since this column is the at-the-table hero. */}
                  <div style={{
                    fontSize: FS.sm, color: BODY,
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
