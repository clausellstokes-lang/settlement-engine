/**
 * ResourcesProduction — chapter 07.
 *
 * Terrain pill + strategic-value callout up top, then economic strengths,
 * a 3-column exploitation table (unexploited / partial / full), and the
 * imports block split into critical vs recommended.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { type, palette, space } from '../theme.js';

export function ResourcesProduction({ settlement, narrativeMode, vm }) {
  const r = vm.resources;

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="07"
        title="Resources & Production"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {/* Terrain */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: space.md,
          }}
        >
          <Text style={{ ...type.label, color: palette.muted }}>TERRAIN</Text>
          <Pill tone="cool" large>{cap(r.terrain) || '—'}</Pill>
        </View>

        {/* Strategic value */}
        {r.strategicValue && (
          <Callout tone="gold" kicker="STRATEGIC VALUE">
            <Text style={type.body}>{r.strategicValue}</Text>
          </Callout>
        )}

        {/* Economic strengths */}
        {r.economicStrengths.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={3}>Economic Strengths</Heading>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {r.economicStrengths.map((s, i) => (
                <Pill key={`es-${i}`} tone="good">{labelOf(s)}</Pill>
              ))}
            </View>
          </View>
        )}

        {/* Exploitation */}
        <View style={{ marginTop: space.md }}>
          <Heading level={3}>Resource Exploitation</Heading>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <ExpColumn title="Unexploited" tone="bad" items={r.exploitation.unexploited} />
            <ExpColumn title="Partial" tone="warn" items={r.exploitation.partiallyExploited} />
            <ExpColumn title="Fully Exploited" tone="good" items={r.exploitation.fullyExploited} />
          </View>
        </View>

        {/* Imports */}
        {(r.imports.critical?.length > 0 || r.imports.recommended?.length > 0) && (
          <View style={{ marginTop: space.md }}>
            <Heading level={3}>Imports</Heading>
            {r.imports.critical?.length > 0 && (
              <View style={{ marginBottom: space.sm }}>
                <Text style={{ ...type.label, color: palette.bad, fontSize: 8, marginBottom: 4 }}>
                  CRITICAL
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                  {r.imports.critical.map((imp, i) => (
                    <Pill key={`ci-${i}`} tone="bad">{labelOf(imp)}</Pill>
                  ))}
                </View>
              </View>
            )}
            {r.imports.recommended?.length > 0 && (
              <View>
                <Text style={{ ...type.label, color: palette.muted, fontSize: 8, marginBottom: 4 }}>
                  RECOMMENDED
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                  {r.imports.recommended.map((imp, i) => (
                    <Pill key={`ri-${i}`} tone="muted">{labelOf(imp)}</Pill>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </Section>
    </PageChrome>
  );
}

function ExpColumn({ title, tone, items }) {
  const list = items || [];
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ ...type.label, color: palette[tone] || palette.muted, marginBottom: 4 }}>{title}</Text>
      {list.length === 0 && (
        <Text style={{ ...type.caption, color: palette.faint, fontStyle: 'italic' }}>none</Text>
      )}
      {list.slice(0, 8).map((item, i) => (
        <Text key={`x-${i}`} style={{ ...type.caption, marginBottom: 2 }}>· {labelOf(item)}</Text>
      ))}
    </View>
  );
}

function cap(s) { return s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function labelOf(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.name || item.label || item.resource || item.good || '';
}

export default ResourcesProduction;
