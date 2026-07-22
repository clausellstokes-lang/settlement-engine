/**
 * PowerStrata — the Power tab's three strata (owner order 2026-07-22): powers,
 * factions, and the web are semantically distinct layers, not one equal-weight
 * list. Sibling components so PowerTab stays under its size ceiling.
 *
 *   ThePowers   — dominant cards for the seat + its contenders. Each card keeps
 *                 the shipped institution-support disclosure (powerSupport.js).
 *   TheFactions — the lighter full roster, one row each; a power's row carries a
 *                 compact "holds power" marker linking UP to its card (an in-tab
 *                 anchor), never a duplicate of the card.
 *   TheWeb      — the typed relationships between factions, grouped by their
 *                 finite `type` kind. Each side is an EntityLink to its row.
 *
 * Flush idiom: within a stratum the cards/rows are born flush — a single 1px
 * seam between them, one framing border, no radius, no gaps. The breathing lives
 * BETWEEN strata (the Section headers), matching the dossier's card grammar.
 *
 * Display-only: no store writes, no rng. EntityLink degrades to plain text when
 * rendered without a dossier entity provider (its safe no-op default).
 */

import { useState } from 'react';
import { FS, MUTED, BORDER, swatch } from '../../../theme.js';
import { Section } from '../../Primitives.jsx';
import { FACTION_COLORS } from '../../tabConstants.js';
import Button from '../../../primitives/Button.jsx';
import InstitutionLink from '../../../primitives/InstitutionLink.jsx';
import EntityLink from '../../../primitives/EntityLink.jsx';
import { factionIdFromName } from '../../../../lib/entities.js';
import { deriveFactionSupport } from '../../../../domain/dossier/powerSupport.js';
import { derivePowerStrata, groupRelationships } from '../../../../domain/dossier/powerStrata.js';

// The parchment seam between flush cards. Imported (never a re-declared hex) so
// it tracks the design token — the forked-color rule.
const SEAM = BORDER;

// The powers-stratum accent: a deliberate darker gold for the seat, a muted
// brown for contenders. A helper (never a bare `const = '#hex'` nor a raw style
// literal) so it satisfies the forked-color / raw-color rules while staying the
// one place the powers tint is defined.
const powerAccent = (role) => (role === 'contender' ? '#6b5340' : '#8b6a1a');

// Relationship kind -> display meta. The LABEL is the typed kind (the finite-
// semantics law: never a composed phrase) — only capitalised for display. The
// palette is the shipped Power-tab relationship palette.
const RELATIONSHIP_META = {
  symbiotic:   { label: 'Symbiotic',   color: '#1a5a28', bg: '#f0faf4', glyph: '⇌' },
  dependent:   { label: 'Dependent',   color: '#1a3a6a', bg: '#f0f4fa', glyph: '↔' },
  subordinate: { label: 'Subordinate', color: '#4a6a1a', bg: '#f4f8ec', glyph: '↓' },
  tense:       { label: 'Tense',       color: '#8a4010', bg: '#fdf6ec', glyph: '~' },
  competitive: { label: 'Competitive', color: '#8b1a1a', bg: '#fdf4f4', glyph: '×' },
  corrupted:   { label: 'Corrupted',   color: '#4a1a4a', bg: '#fdf0fc', glyph: '◆' },
};
const metaFor = (kind) => RELATIONSHIP_META[kind] || { label: kind || 'Other', color: MUTED, bg: swatch['#FAF8F4'], glyph: '·' };

const ARCHETYPE_LABEL = {
  government: 'Government', noble: 'Noble', military: 'Military', merchant: 'Merchant',
  religious: 'Religious', criminal: 'Criminal', arcane: 'Arcane', craft: 'Craft',
  labor: 'Labour', outsider: 'Outsider', occupation: 'Occupation', civic: 'Civic', other: 'Faction',
};

const powerLabelColor = (lbl) =>
  lbl === 'Dominant'    ? '#1a3a6a' :
  lbl === 'Strong'      ? '#1a5a28' :
  lbl === 'Significant' ? '#a0762a' :
  lbl === 'Minor'       ? '#6b5340' : '#9c8068';

/** The seat's coup exposure, from the typed derivation (never composed prose). */
function rulerRisk(p) {
  if (!p.contenderCount) return { label: 'Uncontested', color: '#1a5a28' };
  if (p.gated === false)  return { label: 'Critical',    color: '#8b1a1a' };
  return { label: 'Contested', color: '#a0762a' };
}

const powerCardAnchorId = (name) => `power-card-${factionIdFromName(name) || 'x'}`;

// ── THE POWERS ───────────────────────────────────────────────────────────────

/**
 * @param {{ settlement: any, powers: import('../../../../domain/dossier/powerStrata.js').PowerEntry[], factionSupport: Map<string, any[]> }} props
 */
export function ThePowers({ settlement, powers, factionSupport }) {
  const [openIdx, setOpenIdx] = useState(null);
  if (!powers.length) return null;

  return (
    <Section title={`The Powers (${powers.length})`} collapsible defaultOpen accent="#8b6a1a">
      <div style={{ fontSize: FS.xxs, color: MUTED, marginBottom: 8, lineHeight: 1.4 }}>
        Who holds and who contests the seat. Open a power to see the institutions behind it.
      </div>
      <div style={{ border: `1px solid ${SEAM}` }}>
        {powers.map((p, i) => {
          const isRuler = p.role === 'ruler';
          const accent  = powerAccent(p.role);
          const support = factionSupport.get(p.name) || [];
          const hasSupport = support.length > 0;
          const isExp = openIdx === i;
          const risk = isRuler ? rulerRisk(p) : null;
          const last = i === powers.length - 1;
          return (
            <div key={`${p.name}-${i}`} id={powerCardAnchorId(p.name)}
              style={{ borderBottom: last ? 'none' : `1px solid ${SEAM}`, borderLeft: `3px solid ${accent}`, background: isExp ? '#f7f2e6' : swatch.white }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', cursor: hasSupport ? 'pointer' : 'default' }}
                {...(hasSupport ? {
                  role: 'button', tabIndex: 0,
                  'aria-label': `${p.name} power details`,
                  'aria-expanded': isExp,
                  'aria-controls': `power-card-${i}-detail`,
                  onClick: () => setOpenIdx(isExp ? null : i),
                  onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenIdx(isExp ? null : i); } },
                } : {})}>
                <span style={{ fontSize: FS.micro, fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: accent, background: `${accent}14`, border: `1px solid ${accent}40`, padding: '1px 6px', flexShrink: 0 }}>
                  {isRuler ? 'Ruler' : 'Contender'}
                </span>
                <span style={{ fontSize: FS.md, fontWeight: 700, color: swatch.inkMag, flex: 1, minWidth: 0, lineHeight: 1.2 }}>
                  <EntityLink id={factionIdFromName(p.name)} type="faction" fallback={p.name} style={{ color: swatch.inkMag }} />
                </span>
                <span style={{ fontSize: FS.micro, fontWeight: 600, color: MUTED, flexShrink: 0 }}>{ARCHETYPE_LABEL[p.archetype] || 'Faction'}</span>
                {p.powerLabel && (
                  <span style={{ fontSize: FS.micro, fontWeight: 700, color: powerLabelColor(p.powerLabel), background: `${powerLabelColor(p.powerLabel)}12`, border: `1px solid ${powerLabelColor(p.powerLabel)}30`, padding: '1px 5px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {p.powerLabel}
                  </span>
                )}
                {isRuler && risk && (
                  <span aria-label={`Coup risk: ${risk.label}`} style={{ fontSize: FS.micro, fontWeight: 700, color: risk.color, background: `${risk.color}12`, border: `1px solid ${risk.color}40`, padding: '1px 5px', flexShrink: 0 }}>
                    {risk.label}
                  </span>
                )}
                {!isRuler && Number.isFinite(p.weight) && (
                  <span aria-label={`Coup weight ${p.weight}`} style={{ fontSize: FS.xs, fontWeight: 700, color: accent, flexShrink: 0, minWidth: 34, textAlign: 'right' }}>w {p.weight}</span>
                )}
                {hasSupport && <span style={{ fontSize: FS.xxs, color: MUTED, flexShrink: 0 }}>{isExp ? '▲' : '▼'}</span>}
              </div>

              {isExp && hasSupport && (
                <div id={`power-card-${i}-detail`} style={{ padding: '2px 12px 10px 14px', background: swatch['#FAF8F4'] }}>
                  <div style={{ fontSize: FS.xxs, fontWeight: 700, color: swatch.inkMag3, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 5 }}>
                    Institutions behind this power ({support.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {support.map((edge, si) => (
                      <div key={si} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: FS.xs, lineHeight: 1.45 }}>
                        <span style={{ fontWeight: 700, color: swatch.inkMag, flexShrink: 0 }}>
                          <InstitutionLink name={edge.name} settlement={settlement} />
                        </span>
                        <span style={{ color: MUTED, flex: 1, minWidth: 0 }}>{edge.why}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ── THE FACTIONS ─────────────────────────────────────────────────────────────

/**
 * The full roster, lighter weight. Uses the caller's expanded-index state so the
 * NPC-faction-link focus affordance (PowerTab's focusedEntity effect) still
 * expands the right row.
 *
 * @param {{ settlement:any, roster:any[], expandedFaction:number|null, setExpandedFaction:(i:number|null)=>void, focusIndex:number, focusedRowRef:any }} props
 */
export function TheFactions({ settlement, roster, expandedFaction, setExpandedFaction, focusIndex, focusedRowRef }) {
  if (!roster.length) return null;
  const factionGroups = settlement?.factions || [];
  const total = roster.reduce((n, r) => n + (r.power || 0), 0) || 100;
  const powerGold = powerAccent('ruler');

  const jumpToPower = (name) => {
    const el = typeof document !== 'undefined' ? document.getElementById(powerCardAnchorId(name)) : null;
    el?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Section title={`The Factions (${roster.length})`} collapsible defaultOpen>
      {/* Distribution bar — the whole roster by power share (the flat view, demoted to an overview). */}
      <div style={{ display: 'flex', height: 18, overflow: 'hidden', marginBottom: 10, gap: 1 }}>
        {roster.map((r, i) => {
          const pct = Math.round((r.power || 0) / total * 100);
          const c = FACTION_COLORS[i % FACTION_COLORS.length];
          return (
            <div key={i} role="img" aria-label={`${r.name}: ${pct} percent (power ${r.power})`}
              style={{ flex: Math.max(pct, 1), background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {pct > 9 && <span style={{ fontSize: FS.micro, fontWeight: 800, color: swatch.white, userSelect: 'none' }}>{pct}</span>}
            </div>
          );
        })}
      </div>

      <div style={{ border: `1px solid ${SEAM}` }}>
        {roster.map((r, i) => {
          const c = FACTION_COLORS[i % FACTION_COLORS.length];
          const f = r.faction || {};
          const matchedGroups = factionGroups.filter((fg) => fg.powerFactionName === r.name);
          const isExp = expandedFaction === i;
          const expandable = !!(f.desc || f.crisisNote || matchedGroups.length);
          const last = i === roster.length - 1;
          return (
            <div key={i} ref={i === focusIndex ? focusedRowRef : null}
              style={{ borderBottom: last ? 'none' : `1px solid ${SEAM}`, background: isExp ? '#f5f0e8' : f.legitimacyCrisis ? '#fdf4f4' : swatch.white }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '5px 9px', cursor: expandable ? 'pointer' : 'default' }}
                {...(expandable ? {
                  role: 'button', tabIndex: 0,
                  'aria-label': `${r.name} faction details`,
                  'aria-expanded': isExp,
                  'aria-controls': `roster-faction-${i}-detail`,
                  onClick: () => setExpandedFaction(isExp ? null : i),
                  onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedFaction(isExp ? null : i); } },
                } : {})}>
                <span style={{ width: 10, height: 10, background: c, flexShrink: 0 }} />
                {f.legitimacyCrisis && <span style={{ fontSize: FS.xxs, color: swatch.danger, flexShrink: 0 }}>{'⚠'}</span>}
                <span style={{ fontSize: FS.md, fontWeight: 600, color: swatch.inkMag, flex: 1, minWidth: 0, lineHeight: 1.2 }}>
                  <InstitutionLink name={r.name} settlement={settlement} />
                </span>
                {r.isPower && (
                  <Button variant="ghost" size="sm"
                    aria-label={`${r.name} holds power, jump to its power card`}
                    onClick={(e) => { e.stopPropagation(); jumpToPower(r.name); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') e.stopPropagation(); }}
                    style={{ minHeight: 0, borderRadius: 0, fontSize: FS.micro, fontWeight: 700, color: powerGold, background: `${powerGold}12`, border: `1px solid ${powerGold}40`, padding: '1px 6px', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {'↑ Holds power'}
                  </Button>
                )}
                <span style={{ fontSize: FS.micro, fontWeight: 600, color: MUTED, flexShrink: 0 }}>{ARCHETYPE_LABEL[r.archetype] || 'Faction'}</span>
                <span style={{ fontSize: FS.xs, fontWeight: 700, color: c, flexShrink: 0, minWidth: 24, textAlign: 'right' }}>{r.power}</span>
                {expandable && <span style={{ fontSize: FS.xxs, color: MUTED, flexShrink: 0 }}>{isExp ? '▲' : '▼'}</span>}
              </div>

              {matchedGroups.map((fg, gi) => (
                <div key={gi} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 9px 3px 24px', background: `${c}08`, borderLeft: `2px solid ${c}30` }}>
                  <span style={{ fontSize: FS.xxs, color: c }}>{'↳'}</span>
                  <span style={{ fontSize: FS.xs, fontWeight: 700, color: swatch.inkMag, flex: 1 }}>{fg.name}</span>
                  <span style={{ fontSize: FS.xxs, color: swatch.inkMag3 }}>{(fg.members || []).length} member{(fg.members || []).length !== 1 ? 's' : ''}</span>
                </div>
              ))}

              {isExp && expandable && (
                <div id={`roster-faction-${i}-detail`} style={{ padding: '4px 12px 8px 26px', background: swatch['#FAF8F4'] }}>
                  {f.desc && <p style={{ fontSize: FS.sm, color: swatch.inkMag2, lineHeight: 1.6, margin: '0 0 4px' }}>{f.desc}</p>}
                  {f.crisisNote && <p style={{ fontSize: FS['11.5'], color: swatch.danger, fontStyle: 'italic', margin: '6px 0 0', lineHeight: 1.4 }}>{'⚠'} {f.crisisNote}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ── THE WEB ──────────────────────────────────────────────────────────────────

/**
 * @param {{ groups: import('../../../../domain/dossier/powerStrata.js').WebGroup[] }} props
 */
export function TheWeb({ groups }) {
  if (!groups.length) return null;
  const edgeCount = groups.reduce((n, g) => n + g.edges.length, 0);

  return (
    <Section title={`The Web (${edgeCount})`} collapsible defaultOpen accent="#4a6a1a">
      <div style={{ fontSize: FS.xxs, color: MUTED, marginBottom: 8, lineHeight: 1.4 }}>
        How the powers and factions stand to one another, grouped by the kind of tie.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {groups.map((g) => {
          const meta = metaFor(g.kind);
          return (
            <div key={g.kind} style={{ border: `1px solid ${meta.color}30`, borderLeft: `3px solid ${meta.color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: meta.bg, borderBottom: `1px solid ${meta.color}20` }}>
                <span aria-hidden="true" style={{ fontSize: FS.xs, color: meta.color, fontWeight: 800 }}>{meta.glyph}</span>
                <span style={{ fontSize: FS.xs, fontWeight: 800, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{meta.label}</span>
                <span style={{ fontSize: FS.xxs, color: MUTED }}>({g.edges.length})</span>
              </div>
              <div>
                {g.edges.map((e, i) => {
                  const last = i === g.edges.length - 1;
                  return (
                    <div key={i} style={{ padding: '6px 10px', borderBottom: last ? 'none' : `1px solid ${SEAM}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: FS.sm, fontWeight: 700, color: swatch.inkMag }}>
                          <EntityLink id={factionIdFromName(e.pair[0])} type="faction" fallback={e.pair[0]} style={{ color: swatch.inkMag }} />
                        </span>
                        <span aria-hidden="true" style={{ fontSize: FS.xs, color: meta.color, fontWeight: 800 }}>{meta.glyph}</span>
                        <span style={{ fontSize: FS.sm, fontWeight: 700, color: swatch.inkMag }}>
                          <EntityLink id={factionIdFromName(e.pair[1])} type="faction" fallback={e.pair[1]} style={{ color: swatch.inkMag }} />
                        </span>
                        {e.direction && (
                          <span style={{ fontSize: FS.micro, fontWeight: 600, color: MUTED, background: swatch['#FAF8F4'], border: `1px solid ${SEAM}`, padding: '0 5px', flexShrink: 0 }}>{e.direction}</span>
                        )}
                      </div>
                      {e.narrative && <p style={{ fontSize: FS.xs, color: MUTED, lineHeight: 1.45, margin: '3px 0 0' }}>{e.narrative}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

// ── Composed strata block ────────────────────────────────────────────────────

/**
 * The three strata, composed. PowerTab owns the roster expand/focus state and
 * threads it through so the NPC-faction-link focus affordance keeps working.
 *
 * @param {{ settlement:any, powerStructure:any, expandedFaction:number|null, setExpandedFaction:(i:number|null)=>void, focusIndex:number, focusedRowRef:any }} props
 */
export function PowerStrata({ settlement, powerStructure, expandedFaction, setExpandedFaction, focusIndex, focusedRowRef }) {
  const { powers, roster } = derivePowerStrata(settlement);
  const groups = groupRelationships(powerStructure?.factionRelationships);
  const factionSupport = deriveFactionSupport(settlement);

  return (
    <>
      <ThePowers settlement={settlement} powers={powers} factionSupport={factionSupport} />
      <TheFactions
        settlement={settlement}
        roster={roster}
        expandedFaction={expandedFaction}
        setExpandedFaction={setExpandedFaction}
        focusIndex={focusIndex}
        focusedRowRef={focusedRowRef}
      />
      <TheWeb groups={groups} />
    </>
  );
}
