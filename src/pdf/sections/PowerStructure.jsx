/**
 * PowerStructure — chapter 03.
 *
 * Stability + legitimacy banner at top, then a sorted faction list (each as
 * a card with name, power bar, AI blurb when narrative mode, and modifier
 * pills). Recent conflict, live tensions, and full conflict list trail.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { BarMeter } from '../primitives/BarMeter.jsx';
import { type, palette, space } from '../theme.js';

export function PowerStructure({ settlement, narrativeMode, vm }) {
  const p = vm.power;
  const factions = [...p.factions].sort((a, b) => (b.power || 0) - (a.power || 0));

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="03"
        title="Power Structure"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {/* Stability + legitimacy banner */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: space.md }}>
          <View style={statBoxStyle}>
            <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5 }}>STABILITY</Text>
            <Text style={{ ...type.numeric, fontSize: 14, color: palette.ink, marginTop: 4 }}>
              {p.stability || '—'}
            </Text>
          </View>
          {p.legitimacy && (
            <View style={statBoxStyle}>
              <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5 }}>LEGITIMACY</Text>
              <Text style={{ ...type.numeric, fontSize: 14, color: palette.ink, marginTop: 4 }}>
                {p.legitimacy.score != null ? `${p.legitimacy.score}/100` : (p.legitimacy.label || '—')}
              </Text>
              {p.legitimacy.label && p.legitimacy.score != null && (
                <Text style={{ ...type.caption, color: palette.muted, marginTop: 2 }}>
                  {p.legitimacy.label}
                </Text>
              )}
            </View>
          )}
          {p.criminalCapture && (
            <View style={statBoxStyle}>
              <Text style={{ ...type.label, color: palette.bad, fontSize: 7.5 }}>CRIMINAL CAPTURE</Text>
              <Text style={{ ...type.numeric, fontSize: 14, color: palette.bad, marginTop: 4 }}>
                {typeof p.criminalCapture === 'string' ? p.criminalCapture : 'Active'}
              </Text>
            </View>
          )}
        </View>

        {p.legitimacy?.governanceFractured && (
          <Callout tone="bad" kicker="GOVERNANCE FRACTURED">
            <Text style={type.body}>
              Multiple factions hold competing claims to authority. The governing seat is contested.
            </Text>
          </Callout>
        )}

        {/* Faction list */}
        <Heading level={3}>Factions</Heading>
        <View>
          {factions.map((f, i) => (
            <View
              key={`f-${i}`}
              style={{
                marginBottom: space.md,
                padding: 10,
                border: `0.5pt solid ${palette.border}`,
                borderRadius: 3,
                backgroundColor: '#fffaf0',
              }}
              wrap={false}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                }}
              >
                <Text style={{ ...type.body_em, color: palette.ink, fontSize: 11 }}>
                  {f.name || `Faction ${i + 1}`}
                </Text>
                {f.isGoverning && <Pill tone="gold">GOVERNING</Pill>}
              </View>
              <BarMeter
                value={f.power}
                max={100}
                label="Power"
                sublabel={`${f.power || 0}/100`}
                tone={f.isGoverning ? 'gold' : 'cool'}
              />
              {f.blurb && (
                <Text
                  style={{
                    ...type.italic,
                    color: palette.second,
                    marginTop: 6,
                    fontSize: 9.5,
                  }}
                >
                  {f.blurb}
                </Text>
              )}
              {f.modifiers && f.modifiers.length > 0 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                  {f.modifiers.map((m, mi) => (
                    <Pill key={`m-${mi}`} tone="muted">
                      {typeof m === 'string' ? m : (m.label || m.type || 'mod')}
                    </Pill>
                  ))}
                </View>
              )}
            </View>
          ))}
          {factions.length === 0 && (
            <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
              No formal factions identified.
            </Text>
          )}
        </View>

        {/* Recent conflict */}
        {p.recentConflict && (
          <Callout tone="warn" kicker="RECENT INTERNAL CONFLICT">
            <Text style={type.body}>
              {typeof p.recentConflict === 'string'
                ? p.recentConflict
                : (p.recentConflict.summary || p.recentConflict.description || JSON.stringify(p.recentConflict))}
            </Text>
          </Callout>
        )}

        {/* Tensions */}
        {p.tensions.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Live Tensions</Heading>
            {p.tensions.map((t, i) => (
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

        {/* Internal conflicts */}
        {p.conflicts.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Internal Conflicts</Heading>
            {p.conflicts.map((c, i) => (
              <View key={`c-${i}`} style={{ marginBottom: space.sm }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.ink }}>
                  {Array.isArray(c.parties) ? c.parties.join(' vs ') : (c.title || `Conflict ${i + 1}`)}
                </Text>
                {c.description && <Text style={type.body}>{c.description}</Text>}
              </View>
            ))}
          </View>
        )}
      </Section>
    </PageChrome>
  );
}

const statBoxStyle = {
  flex: 1,
  padding: 10,
  backgroundColor: '#faf3e8',
  border: `0.5pt solid #e0d0b0`,
  borderRadius: 3,
};

export default PowerStructure;
