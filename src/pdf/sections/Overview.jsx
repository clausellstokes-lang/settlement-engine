/**
 * Overview — chapter 01. The single-page elevator pitch for the settlement.
 *
 * Layout, top to bottom:
 *   [Thesis callout]  (only when narrativeMode + ai.thesis)
 *   [4 stat tiles: pop / age / prosperity / safety]
 *   [Character paragraph from history.historicalCharacter]
 *   [Active crises pills + per-crisis blurb]
 *   [3-column at-a-glance: Economy / Defense / Society]
 *
 * The thesis callout uses the AI accent (purple); the section accent rule
 * also flips to purple in narrativeMode so the chapter telegraphs "this page
 * has been touched by the AI" without a label.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { StatTile } from '../primitives/StatTile.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { type, palette, space } from '../theme.js';

export function Overview({ settlement, narrativeMode, vm }) {
  const o = vm.overview;
  const id = vm.identity;

  const populationFmt = id.population ? id.population.toLocaleString() : '—';
  const ageFmt = id.age ? `${id.age} yr${id.age === 1 ? '' : 's'}` : '—';
  const defenseAvg = avgDefenseScore(o.defenseScores);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="01"
        title="Overview"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {/* Thesis — narrative-only */}
        {o.thesis && (
          <Callout tone="ai" kicker="THESIS">
            <Text style={{ ...type.italic, color: palette.ink, fontSize: 11.5, lineHeight: 1.45 }}>
              {o.thesis}
            </Text>
          </Callout>
        )}

        {/* Headline stat row */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: space.sm, marginBottom: space.md }}>
          <StatTile value={populationFmt} label="POPULATION" sublabel={id.tier || undefined} />
          <StatTile value={ageFmt} label="AGE" sublabel={id.terrain || undefined} />
          <StatTile
            value={cap(o.prosperity) || '—'}
            label="PROSPERITY"
            tone={o.prosperityTone}
          />
          <StatTile
            value={cap(o.safety) || '—'}
            label="SAFETY"
            tone={o.safetyTone}
          />
        </View>

        {/* Character */}
        {o.character && (
          <View style={{ marginBottom: space.md }} wrap={false}>
            <Heading level={3} marginTop={space.sm}>Character</Heading>
            <Text style={type.prose}>{o.character}</Text>
          </View>
        )}

        {/* Active crises */}
        {o.stress.length > 0 && (
          <View style={{ marginBottom: space.md }}>
            <Heading level={3}>Active Crises</Heading>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: space.sm }}>
              {o.stress.map((s, i) => (
                <Pill key={`p-${i}`} tone="bad">{s.label || s.icon || 'Crisis'}</Pill>
              ))}
            </View>
            {o.stress
              .filter(s => s.summary)
              .map((s, i) => (
                <View key={`s-${i}`} style={{ marginBottom: 6 }} wrap={false}>
                  <Text style={{ ...type.body_em, color: palette.bad }}>{s.label}</Text>
                  <Text style={type.body}>{s.summary}</Text>
                </View>
              ))}
          </View>
        )}

        {/* At a glance — 3 columns */}
        <Heading level={3}>At a Glance</Heading>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.label, color: palette.gold, marginBottom: 4 }}>Economy</Text>
            <Text style={type.caption}>
              {cap(o.economicComplexity) || 'Complexity unknown'}
              {o.economyOutput != null ? ` · output ${o.economyOutput}` : ''}
            </Text>
            {o.primaryExports.slice(0, 3).map((e, i) => (
              <Text key={`ex-${i}`} style={type.caption}>
                · exports {labelOf(e)}
              </Text>
            ))}
            {o.primaryExports.length === 0 && (
              <Text style={type.caption}>· no notable exports</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.label, color: palette.cool, marginBottom: 4 }}>Defense</Text>
            <Text style={type.caption}>
              {o.defenseReadiness?.label || 'Readiness unknown'}
              {defenseAvg != null ? ` · ${defenseAvg}/100` : ''}
            </Text>
            {o.magicDependency && <Text style={type.caption}>· magic-dependent</Text>}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.label, color: palette.muted, marginBottom: 4 }}>Society</Text>
            <Text style={type.caption}>
              {o.factionsCount} faction{o.factionsCount === 1 ? '' : 's'} · {o.npcsCount} NPC{o.npcsCount === 1 ? '' : 's'}
            </Text>
            <Text style={type.caption}>{o.institutionsCount} institutions</Text>
            {o.tensions.length > 0 && (
              <Text style={type.caption}>
                · {o.tensions.length} live tension{o.tensions.length === 1 ? '' : 's'}
              </Text>
            )}
          </View>
        </View>
      </Section>
    </PageChrome>
  );
}

// ── helpers ─────────────────────────────────────────────────────────────────

function avgDefenseScore(scores) {
  const vals = Object.values(scores || {}).filter(v => typeof v === 'number');
  if (!vals.length) return null;
  return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
}

function cap(s) {
  if (!s || typeof s !== 'string') return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function labelOf(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.good || item.name || item.label || '';
}

export default Overview;
