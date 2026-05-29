/**
 * Visuals — visualization primitives unique to the dossier.
 *
 *   StackedBar       — proportional segments labelled by colour. Used for
 *                      faction power distribution and institution category mix.
 *   ChainRow         — Resource → Processing → Output flow (single-line arrow row).
 *   ScoreCard        — Threat-style card: label + bar + factors[] bullet list.
 *   ScoreWithBreakdown — Banner with score number + breakdown chips (e.g.
 *                        legitimacy +10 economic / -5 fractured).
 *   StatusCard       — Generic name + status-pill + sub-fields card. Used for
 *                      economic chains, services with status, history events.
 *   FactionDistribution — Stacked bar + per-faction label legend.
 */
import { View, Text } from '@react-pdf/renderer';
import { type, palette, toneBg, factionColors, space, pt, swatch } from '../theme.js';
import { Pill } from './Pill.jsx';
import { Tag } from './Dense.jsx';
import { finite, safePct } from '../lib/format.js';

// ── StackedBar ───────────────────────────────────────────────────────────────
export function StackedBar({ segments, height = 8, showLabels = true, marginBottom = space.sm }) {
  const list = (segments || []).filter(s => {
    if (!s) return false;
    const v = finite(s.pct, 0) || finite(s.value, 0);
    return v > 0;
  });
  if (!list.length) return null;
  const total = list.reduce((a, s) => a + (finite(s.pct, 0) || finite(s.value, 0)), 0) || 1;
  return (
    <View style={{ marginBottom }}>
      <View
        style={{
          height,
          flexDirection: 'row',
          backgroundColor: swatch['#F0E8D8'],
          borderRadius: 1,
          overflow: 'hidden',
          border: `0.3pt solid ${palette.border}`,
        }}
      >
        {list.map((s, i) => {
          const raw = ((finite(s.pct, 0) || finite(s.value, 0)) / total) * 100;
          const pct = safePct(raw);
          const color = s.color || factionColors[s.category] || palette.gold;
          return (
            <View
              key={`seg-${i}`}
              style={{
                width: `${pct}%`,
                height: '100%',
                backgroundColor: color,
                opacity: s.dimmed ? 0.4 : 1,
              }}
            />
          );
        })}
      </View>
      {showLabels && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, gap: 6 }}>
          {list.map((s, i) => {
            const color = s.color || factionColors[s.category] || palette.gold;
            return (
              <View key={`leg-${i}`} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4 }}>
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: color,
                    borderRadius: 3,
                    marginRight: 3,
                  }}
                />
                <Text style={{ ...type.caption, fontSize: pt['7.5'], color: palette.muted }}>
                  {s.name}
                  {s.value != null ? ` ${Math.round(s.value)}` : ''}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

// ── ChainRow: Resource ▶ Inst ▶ Output ──────────────────────────────────────
export function ChainRow({ resource, processing, output, status, tone }) {
  const _statusColor = palette[tone] || palette.gold;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 4,
        borderBottom: `0.3pt solid ${palette.border}`,
      }}
      wrap={false}
    >
      <Text style={{ ...type.body, color: palette.ink, flex: 1.2, fontSize: pt['9'] }}>
        {resource || '—'}
      </Text>
      <Text style={{ color: palette.faint, marginHorizontal: 4, fontSize: pt['9'] }}>▶</Text>
      <Text style={{ ...type.body, color: palette.second, flex: 1.5, fontSize: pt['9'] }}>
        {processing || (status === 'unexploited' ? 'unprocessed' : '—')}
      </Text>
      <Text style={{ color: palette.faint, marginHorizontal: 4, fontSize: pt['9'] }}>▶</Text>
      <Text style={{ ...type.body, color: palette.second, flex: 1.5, fontSize: pt['9'] }}>
        {output || (status === 'unexploited' ? 'no output' : '—')}
      </Text>
      {status && (
        <View style={{ marginLeft: 4 }}>
          <Tag tone={tone || 'muted'}>{status}</Tag>
        </View>
      )}
    </View>
  );
}

// ── ScoreCard: header bar + factors bullets ─────────────────────────────────
export function ScoreCard({ label, score, max = 100, tone = 'gold', description, factors }) {
  const fg = palette[tone] || palette.gold;
  const v = finite(score, 0);
  const m = finite(max, 100) || 100;
  const pct = safePct((v / m) * 100);
  return (
    <View
      style={{
        marginBottom: space.sm,
        padding: 8,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2pt solid ${fg}`,
        borderRadius: 2,
        backgroundColor: palette.card,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ ...type.label_em, color: palette.ink, fontSize: pt['10'] }}>{label}</Text>
        <Text style={{ ...type.numeric, color: fg, fontSize: pt['13'] }}>{score ?? '—'}</Text>
      </View>
      <View
        style={{
          height: 4,
          backgroundColor: swatch['#F0E8D8'],
          borderRadius: 1,
          marginTop: 3,
          overflow: 'hidden',
        }}
      >
        <View style={{ width: `${pct}%`, height: '100%', backgroundColor: fg }} />
      </View>
      {description && (
        <Text style={{ ...type.caption, color: palette.second, marginTop: 4, lineHeight: 1.4 }}>
          {description}
        </Text>
      )}
      {factors?.length > 0 && (
        <View style={{ marginTop: 4 }}>
          {factors.map((f, i) => (
            <View key={`fac-${i}`} style={{ flexDirection: 'row', marginBottom: 1.5 }}>
              <Text style={{ color: fg, marginRight: 4, fontSize: pt['9'] }}>·</Text>
              <Text style={{ ...type.caption, flex: 1, color: palette.second, fontSize: pt['8'] }}>
                {typeof f === 'string' ? f : (f?.text || f?.label || f?.description || '')}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ── ScoreWithBreakdown ──────────────────────────────────────────────────────
export function ScoreWithBreakdown({ label, score, scoreLabel, tone = 'gold', breakdown, footer }) {
  const fg = palette[tone] || palette.gold;
  const bg = toneBg[tone] || toneBg.gold;
  return (
    <View
      style={{
        marginBottom: space.sm,
        padding: 8,
        backgroundColor: bg,
        borderLeft: `2pt solid ${fg}`,
        borderRadius: 2,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Text style={{ ...type.label, color: fg, fontSize: pt['8'] }}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ ...type.numeric, color: fg, fontSize: pt['16'], marginRight: 4 }}>
            {score ?? '—'}
          </Text>
          {scoreLabel && (
            <Text style={{ ...type.label, color: palette.second, fontSize: pt['8'] }}>{scoreLabel}</Text>
          )}
        </View>
      </View>
      {breakdown?.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, gap: 4 }}>
          {breakdown.map((b, i) => {
            const delta = typeof b === 'object' ? (b?.delta ?? b?.value) : null;
            const bLabel = typeof b === 'object' ? (b?.label || b?.name) : String(b);
            const sign = delta != null ? (delta > 0 ? '+' : '') : '';
            const bTone = delta != null ? (delta > 0 ? 'good' : 'bad') : 'muted';
            const bg2 = toneBg[bTone] || toneBg.muted;
            const fg2 = palette[bTone] || palette.muted;
            return (
              <View
                key={`br-${i}`}
                style={{
                  backgroundColor: bg2,
                  paddingHorizontal: 4,
                  paddingVertical: 1,
                  borderRadius: 1.5,
                }}
              >
                <Text style={{ ...type.pill, fontSize: pt['7.5'], color: fg2 }}>
                  {delta != null ? `${sign}${delta} ` : ''}
                  {bLabel}
                </Text>
              </View>
            );
          })}
        </View>
      )}
      {footer && (
        <Text style={{ ...type.caption, color: palette.muted, marginTop: 4, fontSize: pt['8'] }}>
          {footer}
        </Text>
      )}
    </View>
  );
}

// ── StatusCard: name + status-pill + sub-fields ─────────────────────────────
const STATUS_TONE = {
  productive: 'good', healthy: 'good', stable: 'good',
  impaired: 'bad', critical: 'bad', degraded: 'warn',
  vulnerable: 'warn', entrepot: 'cool', magic: 'ai',
  service: 'cool', services: 'cool',
  unexploited: 'muted', partial: 'warn', full: 'good',
};

export function StatusCard({
  name, status, statusLabel, description,
  meta, // [{label, value}] — KeyValRow style
  body, // children-style content (multi-line, charts)
  badges, // [{tone, text}]
  tone, // override status tone
  compact = false,
}) {
  const sTone = tone || STATUS_TONE[(status || '').toLowerCase()] || 'muted';
  return (
    <View
      style={{
        marginBottom: compact ? 4 : 6,
        padding: compact ? 6 : 8,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2pt solid ${palette[sTone] || palette.muted}`,
        borderRadius: 2,
        backgroundColor: palette.card,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
        <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], flex: 1 }}>{name}</Text>
        {status && <Pill tone={sTone}>{statusLabel || status}</Pill>}
      </View>
      {badges?.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 3 }}>
          {badges.map((b, i) => (
            <Tag key={`bg-${i}`} tone={b.tone || 'muted'}>{b.text}</Tag>
          ))}
        </View>
      )}
      {meta?.length > 0 && (
        <Text style={{ ...type.caption, color: palette.muted, marginBottom: 2, fontSize: pt['8'] }}>
          {meta.filter(m => m && m.value).map(m => `${m.label} ${m.value}`).join('  ·  ')}
        </Text>
      )}
      {description && (
        <Text style={{ ...type.body, fontSize: pt['9'], color: palette.second }}>{description}</Text>
      )}
      {body}
    </View>
  );
}

export default {
  StackedBar, ChainRow, ScoreCard, ScoreWithBreakdown, StatusCard,
};
