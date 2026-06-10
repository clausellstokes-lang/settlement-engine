/**
 * primitives/RegenerationDeltaCard — Tier 5.1 UI surface.
 *
 * The roadmap's "trust problem with stochastic reruns" is solved
 * here: after a user change + regenerate, surface what changed so
 * the DM can see the engine kept canon, propagated their change,
 * and made plausible procedural decisions everywhere else.
 *
 * Consumes the output of domain/regenerationDelta.js#
 * deriveRegenerationDelta(before, after). Pure presentational.
 *
 * Layout: collapsible card with seven sections, each rendering only
 * when it has content:
 *   1. Direct effects    — system state deltas (immediate result of
 *                          the change)
 *   2. Ripple effects    — causal-state band shifts
 *   3. Capacity shifts   — supply/demand band changes per capacity
 *   4. Daily-life shifts — slot-level prose changes
 *   5. Preserved canon   — entities that survived the rerun
 *   6. New opportunities — hooks the rerun introduced
 *   7. New risks         — threats / conditions / clocks introduced
 *
 * Broken dependencies surfaces inline as a warning row when present.
 *
 * Returns null when the delta is empty or missing.
 */

import { useState } from 'react';
import { FS, swatch } from '../theme.js';

const COLORS = Object.freeze({
  bg:        '#fffbf5',
  border:    '#d2bd96',
  headerBg:  'rgba(160,118,42,0.10)',
  ink:       '#1c1409',
  muted:     '#9c8068',
  gold:      '#a0762a',
  direct:    '#2a3a7a',   // navy — direct effects
  ripple:    '#5a2a8a',   // violet — ripple effects
  capacity:  '#1a5a28',   // green — capacity
  daily:     '#7a4f0f',   // amber — daily life
  canon:     '#1a4a20',   // forest — preserved canon
  hook:      '#a0762a',   // gold — opportunities
  risk:      '#8b1a1a',   // red — risks
  broken:    'rgba(196,128,60,0.12)',
  brokenBdr: 'rgba(196,128,60,0.4)',
});

function countItems(delta) {
  if (!delta) return 0;
  return (
    (delta.directEffects?.length || 0) +
    (delta.rippleEffects?.length || 0) +
    (delta.capacityShifts?.length || 0) +
    (delta.dailyLifeShifts?.length || 0) +
    (delta.preservedCanon?.length || 0) +
    (delta.newEntities?.length || 0) +
    (delta.removedEntities?.length || 0) +
    (delta.brokenDependencies?.length || 0)
  );
}

export function RegenerationDeltaCard({ delta, onDismiss }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!delta || countItems(delta) === 0) return null;

  return (
    <div
      role="region"
      aria-label="Regeneration delta summary"
      style={{
        margin: '8px 18px',
        background: COLORS.bg,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <header
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px',
          background: COLORS.headerBg,
          borderBottom: collapsed ? 'none' : `1px solid ${COLORS.border}`,
        }}
      >
        <span style={{
          fontSize: FS.xs, fontWeight: 800, color: COLORS.gold,
          textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          What changed in the rerun
        </span>
        <span style={{ fontSize: FS.xs, color: COLORS.muted, flex: 1 }}>
          {summarizeCounts(delta)}
        </span>
        <button
          type="button"
          onClick={() => setCollapsed(c => !c)}
          aria-expanded={!collapsed}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: FS.xxs, fontWeight: 700, color: COLORS.muted,
            padding: '2px 6px',
          }}
        >
          {collapsed ? 'Show' : 'Hide'}
        </button>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            title="Dismiss this delta summary. Run another regenerate to recompute."
            style={{
              background: 'none', border: `1px solid ${COLORS.border}`,
              borderRadius: 3, cursor: 'pointer',
              fontSize: FS.xxs, fontWeight: 700, color: COLORS.muted,
              padding: '2px 7px',
            }}
          >
            ✕
          </button>
        )}
      </header>

      {!collapsed && (
        <div id="regen-delta-body" style={{ padding: '8px 12px 10px' }}>
          {/* Broken dependencies — warn loudly */}
          <BrokenDependenciesRow items={delta.brokenDependencies} />

          {/* The seven sections */}
          <Section title="Direct effects"
            items={delta.directEffects}
            color={COLORS.direct}
            describe={d => d.label || d.field}
            detail={d => formatBandChange(d.before, d.after)}
          />
          {/* Ripple entries (compareCausalState) carry bandBefore/bandAfter;
              capacity entries (compareCapacityStates) nest the band under
              before/after objects. Fall back across spellings either way. */}
          <Section title="Ripple effects"
            items={delta.rippleEffects}
            color={COLORS.ripple}
            describe={d => d.variable || d.label}
            detail={d => formatBandChange(d.bandBefore ?? d.beforeBand, d.bandAfter ?? d.afterBand)}
          />
          <Section title="Capacity shifts"
            items={delta.capacityShifts}
            color={COLORS.capacity}
            describe={d => d.capacity || d.label}
            detail={d => formatBandChange(d.before?.band ?? d.beforeBand, d.after?.band ?? d.afterBand)}
          />
          <Section title="Daily-life shifts"
            items={delta.dailyLifeShifts}
            color={COLORS.daily}
            describe={d => d.slot}
            detail={d => d.summary || `${d.beforeKey || ''} → ${d.afterKey || ''}`}
          />
          <Section title="Preserved canon"
            items={delta.preservedCanon}
            color={COLORS.canon}
            describe={d => `${d.type}: ${d.label}`}
            detail={() => 'kept across the rerun'}
          />
          <Section title="New opportunities"
            // Use ?? so an empty explicit array doesn't fall back to
            // the newEntities filter — but a missing key does.
            items={
              (Array.isArray(delta.newOpportunities) && delta.newOpportunities.length > 0)
                ? delta.newOpportunities
                : delta.newEntities?.filter(e => e.type === 'hook')
            }
            color={COLORS.hook}
            describe={d => `${d.type}: ${d.label}`}
            detail={() => 'introduced by the change'}
          />
          <Section title="New risks"
            items={
              (Array.isArray(delta.newRisks) && delta.newRisks.length > 0)
                ? delta.newRisks
                : delta.newEntities?.filter(e => ['threat', 'condition', 'clock'].includes(e.type))
            }
            color={COLORS.risk}
            describe={d => `${d.type}: ${d.label}`}
            detail={() => 'introduced by the change'}
          />

          {/* Summary lines from the derivation, if any */}
          {Array.isArray(delta.summary) && delta.summary.length > 0 && (
            <div style={{
              marginTop: 6, paddingTop: 6,
              borderTop: `1px dashed ${COLORS.border}`,
              fontSize: FS.xs, color: COLORS.muted, lineHeight: 1.5,
            }}>
              {delta.summary.map((line, i) => (
                <div key={i}>· {line}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, items, color, describe, detail }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <section style={{ marginBottom: 8 }}>
      <h4 style={{
        margin: '4px 0',
        fontSize: FS.xxs, fontWeight: 800, letterSpacing: '0.05em',
        textTransform: 'uppercase', color,
      }}>
        {title} ({items.length})
      </h4>
      <ul style={{
        listStyle: 'none', margin: 0, padding: 0,
        background: swatch['#FAF6EE'],
        border: `1px solid ${COLORS.border}`,
        borderRadius: 4,
      }}>
        {items.map((item, idx) => (
          <li
            key={`${title}-${idx}`}
            style={{
              display: 'flex', alignItems: 'baseline', gap: 8,
              padding: '4px 8px',
              borderBottom: idx === items.length - 1 ? 'none' : `1px solid ${COLORS.border}`,
            }}
          >
            <span style={{ flex: 1, fontSize: FS['11.5'], color: COLORS.ink, fontWeight: 600 }}>
              {safeText(describe(item))}
            </span>
            <span style={{ fontSize: FS['10.5'], color: COLORS.muted, textAlign: 'right' }}>
              {safeText(detail(item))}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BrokenDependenciesRow({ items }) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div
      role="alert"
      style={{
        marginBottom: 8,
        padding: '6px 9px',
        background: COLORS.broken,
        border: `1px solid ${COLORS.brokenBdr}`,
        borderRadius: 4,
        fontSize: FS.xs, color: swatch['#7A4F0F'], lineHeight: 1.5,
      }}
    >
      <strong>Broken dependencies:</strong> {items.join(' · ')}
    </div>
  );
}

function summarizeCounts(delta) {
  const parts = [];
  if (delta.directEffects?.length)      parts.push(`${delta.directEffects.length} direct`);
  if (delta.rippleEffects?.length)      parts.push(`${delta.rippleEffects.length} ripple`);
  if (delta.capacityShifts?.length)     parts.push(`${delta.capacityShifts.length} capacity`);
  if (delta.dailyLifeShifts?.length)    parts.push(`${delta.dailyLifeShifts.length} daily-life`);
  if (delta.preservedCanon?.length)     parts.push(`${delta.preservedCanon.length} preserved`);
  if (delta.newEntities?.length)        parts.push(`+${delta.newEntities.length}`);
  if (delta.removedEntities?.length)    parts.push(`−${delta.removedEntities.length}`);
  if (delta.brokenDependencies?.length) parts.push(`${delta.brokenDependencies.length} broken`);
  return parts.join(' · ');
}

function formatBandChange(before, after) {
  if (!before && !after) return '';
  if (!before) return `→ ${after}`;
  if (!after) return `${before} →`;
  if (before === after) return `${before}`;
  return `${before} → ${after}`;
}

function safeText(v) {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return String(v);
}

export default RegenerationDeltaCard;
