/**
 * IdentityDailyLife — chapter 02.
 *
 * Two stacked sub-sections on one chapter page:
 *   • Identity   — definition list of physical / political facts
 *   • Daily Life — five AI prose passages (Dawn → Night) when available;
 *                  otherwise a raw-data fallback (food balance + nudge to
 *                  generate the AI narrative).
 *
 * Identity stays compact; Daily Life can flow to a continuation page if the
 * five passages run long. We keep each passage's heading+text together via
 * wrap={false} so a passage never starts at the very bottom of a page.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { type, palette, space } from '../theme.js';

export function IdentityDailyLife({ settlement, narrativeMode, vm }) {
  const id = vm.identity;
  const d = vm.daily;
  const accent = narrativeMode ? palette.ai : palette.gold;

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section eyebrow="02" title="Identity & Daily Life" accent={accent}>

        {/* ── IDENTITY ──────────────────────────────────────────────── */}
        <Heading level={3}>Identity</Heading>
        <View style={{ marginBottom: space.md }}>
          <DefRow label="Name" value={id.name} />
          <DefRow label="Tier" value={id.tier || '—'} />
          <DefRow
            label="Population"
            value={id.population ? id.population.toLocaleString() : '—'}
          />
          {id.dominantRace && <DefRow label="Dominant Race" value={id.dominantRace} />}
          {id.terrain && <DefRow label="Terrain" value={cap(id.terrain)} />}
          {id.layout && <DefRow label="Layout" value={cap(id.layout)} />}
          {id.age && <DefRow label="Age" value={`${id.age} years`} />}
          {id.governmentType && <DefRow label="Government" value={cap(id.governmentType)} />}
          {id.tradeAccess && <DefRow label="Trade Access" value={cap(id.tradeAccess)} />}
          {id.founding && <DefRow label="Founded" value={foundingLabel(id.founding)} />}
        </View>

        {/* Quarters */}
        {id.quarters.length > 0 && (
          <View style={{ marginBottom: space.md }} wrap={false}>
            <Heading level={4}>Quarters</Heading>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {id.quarters.map((q, i) => (
                <Pill key={`q-${i}`} tone="muted">
                  {labelOfQuarter(q, i)}
                </Pill>
              ))}
            </View>
          </View>
        )}

        {/* ── DAILY LIFE ────────────────────────────────────────────── */}
        <View style={{ marginTop: space.lg }}>
          <Heading level={3}>Daily Life</Heading>

          {d.hasPassages ? (
            d.passages.map((p, i) => (
              <View key={`p-${i}`} style={{ marginBottom: space.md }} wrap={false}>
                <Text
                  style={{
                    ...type.sub,
                    color: palette.ai,
                    fontSize: 10.5,
                    marginBottom: 4,
                  }}
                >
                  {p.time.toUpperCase()}
                </Text>
                <Text style={type.prose}>{p.text}</Text>
              </View>
            ))
          ) : (
            <View>
              {d.foodBalance && (
                <Callout
                  tone={d.foodBalance.deficit > 0 ? 'bad' : 'good'}
                  kicker="FOOD BALANCE"
                >
                  <Text style={type.body}>
                    {d.foodBalance.deficit > 0
                      ? `Deficit of ${d.foodBalance.deficit} units — the settlement depends on imports for daily survival.`
                      : `Surplus of ${d.foodBalance.surplus || 0} units — the local food supply is reliable.`}
                  </Text>
                </Callout>
              )}
              <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
                Generate the AI narrative to populate dawn-to-night prose passages here.
              </Text>
            </View>
          )}
        </View>

      </Section>
    </PageChrome>
  );
}

// ── tiny components ─────────────────────────────────────────────────────────

function DefRow({ label, value }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: 4,
        borderBottom: `0.3pt solid ${palette.border}`,
      }}
    >
      <Text
        style={{
          ...type.label,
          color: palette.muted,
          width: 100,
          fontSize: 8.5,
        }}
      >
        {label}
      </Text>
      <Text style={{ ...type.body, color: palette.ink, flex: 1 }}>{value}</Text>
    </View>
  );
}

// ── helpers ─────────────────────────────────────────────────────────────────

function cap(s) {
  if (!s || typeof s !== 'string') return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function foundingLabel(f) {
  if (!f) return '—';
  if (typeof f === 'string') return f;
  return f.summary || f.event || f.label || '—';
}

function labelOfQuarter(q, i) {
  if (!q) return `Q${i + 1}`;
  if (typeof q === 'string') return q;
  return q.name || q.label || `Q${i + 1}`;
}

export default IdentityDailyLife;
