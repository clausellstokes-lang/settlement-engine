/**
 * ViabilityAssessment — chapter 08.
 *
 * Verdict callout up top (viable / not viable / uncertain) → issues table
 * with severity pills → warnings → structural violations → active stress
 * → key metrics dump.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { type, palette, space } from '../theme.js';

export function ViabilityAssessment({ settlement, narrativeMode, vm }) {
  const v = vm.viability;
  const verdict = verdictOf(v.viable);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="08"
        title="Viability Assessment"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {/* Verdict */}
        <Callout tone={verdict.tone} kicker="VERDICT" title={verdict.label}>
          {v.summary && <Text style={type.body}>{v.summary}</Text>}
        </Callout>

        {/* Issues */}
        {v.issues.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={3}>Active Issues</Heading>
            {v.issues.map((iss, i) => (
              <View
                key={`iss-${i}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  paddingVertical: 6,
                  borderBottom: i < v.issues.length - 1 ? `0.4pt solid ${palette.border}` : undefined,
                }}
                wrap={false}
              >
                <View style={{ width: 60 }}>
                  <Pill tone={severityTone(iss.severity)}>
                    {(iss.severity || 'NOTE').toUpperCase()}
                  </Pill>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...type.body_em, color: palette.ink }}>
                    {iss.title || iss.type || 'Issue'}
                  </Text>
                  {iss.institution && (
                    <Text style={{ ...type.caption, color: palette.muted }}>{iss.institution}</Text>
                  )}
                  {iss.description && (
                    <Text style={{ ...type.body, marginTop: 2 }}>{iss.description}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Warnings */}
        {v.warnings.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Warnings</Heading>
            {v.warnings.map((w, i) => (
              <View key={`w-${i}`} style={{ flexDirection: 'row', marginBottom: 3 }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.warn, marginRight: 6 }}>!</Text>
                <Text style={{ ...type.body, flex: 1 }}>{labelOf(w)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Structural violations */}
        {v.structuralViolations.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Structural Violations</Heading>
            {v.structuralViolations.map((sv, i) => (
              <View key={`sv-${i}`} style={{ flexDirection: 'row', marginBottom: 3 }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.bad, marginRight: 6 }}>✗</Text>
                <Text style={{ ...type.body, flex: 1 }}>{labelOf(sv)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Active stress */}
        {v.stress.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Active Stress</Heading>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {v.stress.map((s, i) => (
                <Pill key={`vs-${i}`} tone="bad">
                  {s.label || s.icon || s.type || 'Stress'}
                </Pill>
              ))}
            </View>
          </View>
        )}

        {/* Metrics */}
        {Object.keys(v.metrics).length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Key Metrics</Heading>
            {Object.entries(v.metrics).slice(0, 8).map(([k, val]) => (
              <View
                key={k}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 3,
                  borderBottom: `0.3pt solid ${palette.border}`,
                }}
              >
                <Text style={{ ...type.label, color: palette.muted, fontSize: 8, width: 140 }}>
                  {humanizeKey(k)}
                </Text>
                <Text style={{ ...type.body, flex: 1 }}>{formatVal(val)}</Text>
              </View>
            ))}
          </View>
        )}
      </Section>
    </PageChrome>
  );
}

function verdictOf(viable) {
  if (viable === true) return { tone: 'good', label: 'Viable' };
  if (viable === false) return { tone: 'bad', label: 'Not Viable' };
  return { tone: 'warn', label: 'Uncertain' };
}

function severityTone(s) {
  const x = (s || '').toString().toLowerCase();
  if (x === 'critical' || x === 'severe') return 'bad';
  if (x === 'major' || x === 'warning') return 'warn';
  if (x === 'note' || x === 'info') return 'muted';
  return 'gold';
}

function humanizeKey(k) {
  return k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
}

function labelOf(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.message || item.label || item.title || item.text || '';
}

function formatVal(v) {
  if (v == null) return '—';
  if (typeof v === 'object') {
    if (v.deficit != null && v.deficit > 0) return `−${v.deficit}`;
    if (v.surplus != null) return `+${v.surplus}`;
    if (v.label) return v.label;
    return '—';
  }
  return String(v);
}

export default ViabilityAssessment;
