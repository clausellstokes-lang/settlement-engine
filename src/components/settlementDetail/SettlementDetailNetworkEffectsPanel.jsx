import { useMemo } from 'react';
import { getSettlementModifiers, EFFECT_CATEGORIES, fmtMod, REL_LABELS } from '../../lib/relationshipGraph.js';
import { INK, MUTED, SECOND, BORDER, sans, FS, swatch } from '../theme';

// ── Network Effects panel — shows cascading modifiers from the relationship graph ──

export default function NetworkEffectsPanel({ settlementId, saves, relColors }) {
  const mods = useMemo(
    () => getSettlementModifiers(settlementId, saves),
    [settlementId, saves]
  );

  const hasEffects = mods.sources.length > 0;
  if (!hasEffects) return null;

  const maxAbs = Math.max(0.01, ...EFFECT_CATEGORIES.map(c => Math.abs(mods.totals[c.key])));

  return (
    <div style={{ background: swatch['#F8F4EE'], border: `1px solid ${BORDER}`, borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
      <div style={{ fontSize: FS.xs, fontWeight: 700, color: swatch['#5A3A1A'], textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>
        Network Effects
      </div>

      {/* Category bars */}
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
                color: Math.abs(val) < 0.005 ? MUTED : isPos ? '#1a5a28' : '#8b1a1a',
              }}>
                {fmtMod(val)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Source breakdown */}
      <div style={{ fontSize: FS.xxs, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
        Sources
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {mods.sources.map((src, i) => {
          const relLabel = REL_LABELS[src.relType] || src.relType;
          const relColor = relColors[src.relType] || MUTED;
          const dominant = EFFECT_CATEGORIES.reduce((best, c) =>
            Math.abs(src.modifiers[c.key]) > Math.abs(src.modifiers[best] || 0) ? c.key : best
          , EFFECT_CATEGORIES[0].key);
          const domVal = src.modifiers[dominant];
          const depthLabel = src.depth > 1 ? ` (${src.depth}-hop, ${Math.round(src.decay * 100)}% strength)` : '';
          const trLabel = src.tierRatio && Math.abs(src.tierRatio - 1) > 0.05
            ? ` TR:${src.tierRatio.toFixed(1)}x` : '';

          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0', borderBottom: i < mods.sources.length - 1 ? '1px solid #e8e0d4' : 'none' }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: relColor, flexShrink: 0 }} />
              <span style={{ fontSize: FS.xs, fontWeight: 600, color: INK, flex: 1 }}>
                {src.settlementName}
              </span>
              <span style={{ fontSize: FS.micro, color: relColor, fontWeight: 600, background: `${relColor}18`, padding: '1px 5px', borderRadius: 3 }}>
                {relLabel}
              </span>
              <span style={{ fontSize: FS.micro, color: MUTED }}>{depthLabel}{trLabel}</span>
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
