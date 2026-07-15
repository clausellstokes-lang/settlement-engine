import { useMemo } from 'react';
import { getSettlementModifiers, EFFECT_CATEGORIES, fmtMod, REL_LABELS } from '../../lib/relationshipGraph.js';
import { INK, MUTED, BODY, SECOND, sans, FS, swatch } from '../theme';

// ── Network Effects panel — shows cascading modifiers from the relationship graph ──

export default function NetworkEffectsPanel({ settlementId, saves, relColors }) {
  const mods = useMemo(
    () => getSettlementModifiers(settlementId, saves),
    [settlementId, saves]
  );

  const hasEffects = mods.sources.length > 0;
  if (!hasEffects) return null;

  const maxAbs = Math.max(0.01, ...EFFECT_CATEGORIES.map(c => Math.abs(mods.totals[c.key])));

  // Lead with the anomaly: the single largest-magnitude category is the
  // headline fact ("what is this link doing to me?") so the GM grabs the
  // dominant signal before the full bar list reads as the drill-down.
  const dominantCat = EFFECT_CATEGORIES.reduce((best, c) =>
    Math.abs(mods.totals[c.key]) > Math.abs(mods.totals[best.key]) ? c : best
  , EFFECT_CATEGORIES[0]);
  const dominantVal = mods.totals[dominantCat.key];
  const dominantIsPos = dominantVal >= 0;
  const hasDominant = Math.abs(dominantVal) >= 0.005;

  return (
    // Demoted to spacing + tint (border + self-margin removed): it is one of the
    // three relationship pieces, grouped by the parent's gap, not a standalone
    // bordered card (P5 anti-box-soup; the self-margin double-counted the parent
    // flex gap and broke the spacing rhythm).
    <div role="group" aria-labelledby="network-effects-heading" style={{ background: swatch['#F8F4EE'], borderRadius: 8, padding: '12px 14px' }}>
      {/* Level-1 panel keyword + the dominant signal as the headline fact. */}
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: '2px 10px', marginBottom: 10 }}>
        <h3 id="network-effects-heading" style={{ fontSize: FS.sm, fontWeight: 700, color: swatch['#5A3A1A'], textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
          Network Effects
        </h3>
        {hasDominant && (
          <span style={{ fontSize: FS.xs, color: SECOND, fontFamily: sans }}>
            {dominantCat.label}{' '}
            <span style={{ fontWeight: 700, fontFamily: 'monospace', color: dominantIsPos ? '#1a5a28' : '#8b1a1a' }}>{fmtMod(dominantVal)}</span>
          </span>
        )}
      </div>

      {/* Category bars — the drill-down behind the headline fact above. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
        {EFFECT_CATEGORIES.map(({ key, label, _color }) => {
          const val = mods.totals[key];
          const pct = Math.min(Math.abs(val) / maxAbs, 1) * 100;
          const isPos = val >= 0;
          return (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: FS.xxs, fontWeight: 600, color: SECOND, minWidth: 80, fontFamily: sans }}>{label}</span>
              <div style={{ flex: 1, height: 8, background: swatch['#E8E0D4'], borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  [isPos ? 'left' : 'right']: 0,
                  top: 0, height: '100%',
                  width: `${pct}%`,
                  background: isPos ? '#2a7a3a' : '#8b1a1a',
                  borderRadius: 4,
                  transition: 'width 0.3s',
                }} />
              </div>
              <span style={{
                fontSize: FS.xxs, fontWeight: 700, fontFamily: 'monospace', minWidth: 42, textAlign: 'right',
                color: Math.abs(val) < 0.005 ? BODY : isPos ? '#1a5a28' : '#8b1a1a',
              }}>
                {fmtMod(val)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Source breakdown — a subordinate sub-heading (level-2) below the
          panel's level-1 keyword title, so the panel reads as a clear two-tier
          scent rather than two peer lists. */}
      <div style={{ fontSize: FS.xxs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        Sources
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {mods.sources.map((src, i) => {
          const relLabel = REL_LABELS[src.relType] || src.relType;
          const relColor = relColors[src.relType] || MUTED;
          const dominant = EFFECT_CATEGORIES.reduce((best, c) =>
            Math.abs(src.modifiers[c.key]) > Math.abs(src.modifiers[best] || 0) ? c.key : best
          , EFFECT_CATEGORIES[0].key);
          const domVal = src.modifiers[dominant];
          const depthLabel = src.depth > 1 ? `${src.depth}-hop, ${Math.round(src.decay * 100)}% strength` : '';
          const hasTier = src.tierRatio && Math.abs(src.tierRatio - 1) > 0.05;
          const trLabel = hasTier ? `${src.tierRatio.toFixed(1)}× tier leverage` : '';
          // The causal "why" (multi-hop depth, decay strength, tier leverage) is
          // trust-building detail, so it reads at BODY (AA) not chrome MUTED, and
          // 'TR:' is expanded to a self-explaining label (P2/P7). One line; the
          // full phrasing is also the title tooltip when width is tight.
          const causalLabel = [depthLabel, trLabel].filter(Boolean).join(' · ');

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: relColor, flexShrink: 0 }} />
              <span style={{ fontSize: FS.xs, fontWeight: 600, color: INK, flex: 1 }}>
                {src.settlementName}
              </span>
              <span style={{ fontSize: FS.xs, color: relColor, fontWeight: 600, background: `${relColor}18`, padding: '1px 5px', borderRadius: 3 }}>
                {relLabel}
              </span>
              {causalLabel && <span style={{ fontSize: FS.xs, color: BODY }} title={causalLabel}>{causalLabel}</span>}
              <span style={{
                fontSize: FS.xxs, fontWeight: 700, fontFamily: 'monospace',
                color: domVal >= 0 ? '#1a5a28' : '#8b1a1a',
              }}>
                {fmtMod(domVal)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
