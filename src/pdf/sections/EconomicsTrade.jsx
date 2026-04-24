/**
 * EconomicsTrade — chapter 04.
 *
 * Headline stats → income breakdown → 3-column trade flows → critical
 * dependencies → food balance → active issues → underworld hooks.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { BarMeter } from '../primitives/BarMeter.jsx';
import { StatTile } from '../primitives/StatTile.jsx';
import { type, palette, space } from '../theme.js';

export function EconomicsTrade({ settlement, narrativeMode, vm }) {
  const e = vm.economics;

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="04"
        title="Economics & Trade"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {/* Headline stats */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: space.md }}>
          <StatTile value={cap(e.prosperity) || '—'} label="PROSPERITY" />
          <StatTile value={cap(e.economicComplexity) || '—'} label="COMPLEXITY" />
          <StatTile
            value={e.economyOutput != null ? String(e.economyOutput) : '—'}
            label="OUTPUT"
            sublabel="economy score"
          />
          <StatTile value={cap(e.tradeAccess) || '—'} label="TRADE ACCESS" />
        </View>

        {/* Income sources */}
        {e.incomeSources.length > 0 && (
          <View style={{ marginBottom: space.md }}>
            <Heading level={3}>Income Sources</Heading>
            {e.incomeSources.map((src, i) => (
              <View key={`is-${i}`} style={{ marginBottom: 6 }} wrap={false}>
                <BarMeter
                  value={src.percentage || 0}
                  max={100}
                  label={src.source || 'Source'}
                  sublabel={`${src.percentage || 0}%`}
                  tone={src.isCriminal ? 'bad' : 'gold'}
                />
                {src.desc && (
                  <Text
                    style={{
                      ...type.caption,
                      color: palette.muted,
                      marginTop: 1,
                      marginLeft: 2,
                    }}
                  >
                    {src.desc}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Trade flows */}
        <Heading level={3}>Trade Flows</Heading>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: space.md }}>
          <TradeColumn title="Exports" tone="good" items={e.primaryExports} />
          <TradeColumn title="Imports" tone="cool" items={e.primaryImports} />
          <TradeColumn title="Local Production" tone="gold" items={e.localProduction} />
        </View>

        {/* Entrepôt flag */}
        {e.isEntrepot && (
          <Callout tone="cool" kicker="ENTREPÔT">
            <Text style={type.body}>
              Re-exports goods rather than producing them locally — a hub for trade flows.
            </Text>
          </Callout>
        )}

        {/* Trade dependencies */}
        {(e.tradeDependencies.length > 0 || e.criticalImports.length > 0) && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Critical Trade Dependencies</Heading>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {[...e.tradeDependencies, ...e.criticalImports].slice(0, 12).map((d, i) => (
                <Pill key={`td-${i}`} tone="warn">{labelOf(d)}</Pill>
              ))}
            </View>
          </View>
        )}

        {/* Food balance callout */}
        {e.foodBalance && (e.foodBalance.deficit > 0 || e.foodBalance.surplus > 0) && (
          <Callout
            tone={e.foodBalance.deficit > 0 ? 'bad' : 'good'}
            kicker="FOOD BALANCE"
          >
            <Text style={type.body}>
              {e.foodBalance.deficit > 0
                ? `Food deficit: ${e.foodBalance.deficit} units — depends on continuous import.`
                : `Food surplus: ${e.foodBalance.surplus} units — exportable food production.`}
            </Text>
          </Callout>
        )}

        {/* Issues */}
        {e.viabilityIssues.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Active Economic Issues</Heading>
            {e.viabilityIssues.slice(0, 8).map((iss, i) => (
              <View
                key={`issue-${i}`}
                style={{ flexDirection: 'row', marginBottom: 4, alignItems: 'center' }}
                wrap={false}
              >
                <Pill tone={severityTone(iss.severity)}>
                  {(iss.severity || 'NOTE').toUpperCase()}
                </Pill>
                <Text style={{ ...type.body, marginLeft: 6, flex: 1 }}>
                  {iss.title || iss.type || 'issue'}
                  {iss.institution ? ` (${iss.institution})` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Safety hooks */}
        {e.safetyHooks.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Underworld Hooks</Heading>
            {e.safetyHooks.slice(0, 4).map((h, i) => (
              <View key={`sh-${i}`} style={{ flexDirection: 'row', marginBottom: 4 }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.bad, marginRight: 6 }}>•</Text>
                <Text style={{ ...type.body, flex: 1 }}>{labelOf(h)}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>
    </PageChrome>
  );
}

function TradeColumn({ title, tone, items }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ ...type.label, color: palette[tone] || palette.gold, marginBottom: 4 }}>{title}</Text>
      {items.length === 0 && (
        <Text style={{ ...type.caption, color: palette.faint, fontStyle: 'italic' }}>none</Text>
      )}
      {items.slice(0, 8).map((item, i) => (
        <Text key={`item-${i}`} style={{ ...type.caption, marginBottom: 2 }}>
          · {labelOf(item)}
        </Text>
      ))}
    </View>
  );
}

function severityTone(s) {
  const x = (s || '').toString().toLowerCase();
  if (x === 'critical' || x === 'severe') return 'bad';
  if (x === 'major' || x === 'warning') return 'warn';
  if (x === 'note' || x === 'info') return 'muted';
  return 'gold';
}

function cap(s) { return s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function labelOf(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.good || item.name || item.label || item.title || '';
}

export default EconomicsTrade;
