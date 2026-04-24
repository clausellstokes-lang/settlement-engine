/**
 * HistoryFounding — chapter 09.
 *
 * Top: age stat + character quote.
 * Founding callout when present.
 * Chronological event list (most recent first), each with a yearsAgo badge
 * and severity-coded body.
 * Live tensions list as a tail.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { type, palette, space } from '../theme.js';

export function HistoryFounding({ settlement, narrativeMode, vm }) {
  const h = vm.history;
  const events = [...h.events].sort((a, b) => (a.yearsAgo || 0) - (b.yearsAgo || 0));

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="09"
        title="History & Founding"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {/* Age + character */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: space.md }}>
          <View
            style={{
              width: 110,
              padding: 10,
              backgroundColor: '#faf3e8',
              border: `0.5pt solid ${palette.border}`,
              borderRadius: 3,
              alignItems: 'center',
            }}
          >
            <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5 }}>SETTLEMENT AGE</Text>
            <Text style={{ ...type.numeric_xl, color: palette.ink, marginTop: 4, fontSize: 22 }}>
              {h.age || '—'}
            </Text>
            <Text style={{ ...type.caption, color: palette.muted }}>
              {h.age === 1 ? 'year' : 'years'}
            </Text>
          </View>
          {h.historicalCharacter && (
            <View style={{ flex: 1 }}>
              <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5, marginBottom: 4 }}>
                HISTORICAL CHARACTER
              </Text>
              <Text style={{ ...type.italic, color: palette.ink, fontSize: 11, lineHeight: 1.45 }}>
                {h.historicalCharacter}
              </Text>
            </View>
          )}
        </View>

        {/* Founding */}
        {h.founding && (
          <Callout tone="gold" kicker="FOUNDING">
            <Text style={type.body}>{foundingText(h.founding)}</Text>
          </Callout>
        )}

        {/* Events */}
        {events.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={3}>Historical Events</Heading>
            {events.map((ev, i) => (
              <View
                key={`ev-${i}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  paddingVertical: 7,
                  borderBottom: i < events.length - 1 ? `0.4pt solid ${palette.border}` : undefined,
                }}
                wrap={false}
              >
                <View style={{ width: 66 }}>
                  <Text style={{ ...type.label, color: palette.gold, fontSize: 8 }}>
                    {ev.yearsAgo != null ? `${ev.yearsAgo}y AGO` : 'PAST'}
                  </Text>
                  {ev.severity && (
                    <View style={{ marginTop: 3 }}>
                      <Pill tone={severityTone(ev.severity)}>{(ev.severity || '').toUpperCase()}</Pill>
                    </View>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  {ev.type && (
                    <Text style={{ ...type.body_em, color: palette.ink }}>{cap(ev.type)}</Text>
                  )}
                  {ev.description && (
                    <Text style={{ ...type.body, marginTop: 1 }}>{ev.description}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Live tensions */}
        {h.tensions.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Live Tensions</Heading>
            {h.tensions.map((t, i) => (
              <View key={`t-${i}`} style={{ flexDirection: 'row', marginBottom: 4 }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.warn, marginRight: 6 }}>•</Text>
                <Text style={{ ...type.body, flex: 1 }}>
                  {t.label || t.type || ''}
                  {t.description ? ` — ${t.description}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Section>
    </PageChrome>
  );
}

function foundingText(f) {
  if (!f) return '';
  if (typeof f === 'string') return f;
  return f.summary || f.event || f.description || JSON.stringify(f);
}

function severityTone(s) {
  const x = (s || '').toString().toLowerCase();
  if (x === 'critical' || x === 'severe' || x === 'catastrophe') return 'bad';
  if (x === 'major' || x === 'warning') return 'warn';
  if (x === 'minor' || x === 'note') return 'muted';
  return 'gold';
}

function cap(s) { return s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

export default HistoryFounding;
