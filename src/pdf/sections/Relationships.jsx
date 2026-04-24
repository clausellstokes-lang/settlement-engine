/**
 * Relationships — chapter 12.
 *
 * Three blocks:
 *   • Saved neighbour network        — formal links between this save and
 *                                      others (rival, allied, trade_partner …).
 *                                      Coloured by relationship type.
 *   • Inter-settlement relationships  — runtime-resolved relationships from
 *                                      shared NPCs and conflicts.
 *   • Cross-settlement conflicts      — campaigns spanning multiple saves.
 *
 * Empty section gets a single explanatory line so the printed page never
 * looks broken.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, space, relColors } from '../theme.js';

const REL_LABELS = {
  rival:            'Rival',
  cold_war:         'Cold War',
  hostile:          'Hostile',
  allied:           'Allied',
  secret_alliance:  'Secret Alliance',
  trade_partner:    'Trade Partner',
  patron:           'Patron',
  client:           'Client',
  criminal_network: 'Criminal Network',
};

export function Relationships({ settlement, narrativeMode, vm }) {
  const r = vm.relationships;
  const hasAny =
    r.neighbours.length > 0 ||
    r.interSettlement.length > 0 ||
    r.crossConflicts.length > 0 ||
    r.internal.length > 0 ||
    !!r.neighborSingle;

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="12"
        title="Relationships"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {!hasAny && (
          <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
            This settlement is not yet linked to any neighbours, conflicts, or shared NPCs.
            Use the Settlements panel to build a network.
          </Text>
        )}

        {/* Neighbour network */}
        {r.neighbours.length > 0 && (
          <View style={{ marginBottom: space.md }}>
            <Heading level={3}>Neighbour Network</Heading>
            {r.neighbours.map((n, i) => (
              <View
                key={`n-${i}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 6,
                  borderBottom:
                    i < r.neighbours.length - 1 ? `0.3pt solid ${palette.border}` : undefined,
                }}
                wrap={false}
              >
                <Text style={{ ...type.body_em, color: palette.ink, width: 140 }}>
                  {n.neighbourName || n.name || '—'}
                </Text>
                <View style={{ width: 130 }}>
                  <RelPill type={n.relationshipType} />
                </View>
                <Text style={{ ...type.caption, color: palette.muted, flex: 1 }}>
                  {n.description || ''}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Single live neighbour (when settlement isn't saved yet) */}
        {!r.neighbours.length && r.neighborSingle && (
          <View style={{ marginBottom: space.md }}>
            <Heading level={3}>Generated Neighbour</Heading>
            <View
              style={{
                padding: 10,
                border: `0.5pt solid ${palette.border}`,
                borderRadius: 3,
                backgroundColor: '#fffaf0',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Text style={{ ...type.body_em, color: palette.ink, flex: 1 }}>
                  {r.neighborSingle.neighbourName || r.neighborSingle.name || '—'}
                </Text>
                <RelPill type={r.neighborSingle.relationshipType} />
              </View>
              {r.neighborSingle.description && (
                <Text style={type.body}>{r.neighborSingle.description}</Text>
              )}
            </View>
          </View>
        )}

        {/* Inter-settlement relationships */}
        {r.interSettlement.length > 0 && (
          <View style={{ marginBottom: space.md }}>
            <Heading level={3}>Shared Figures & Stories</Heading>
            {r.interSettlement.map((rel, i) => (
              <View
                key={`is-${i}`}
                style={{
                  paddingVertical: 6,
                  borderBottom: i < r.interSettlement.length - 1 ? `0.3pt solid ${palette.border}` : undefined,
                }}
                wrap={false}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <Text style={{ ...type.body_em, color: palette.ink, flex: 1 }}>
                    {rel.npcName || rel.title || rel.label || `Relationship ${i + 1}`}
                  </Text>
                  {rel.relationshipType && <RelPill type={rel.relationshipType} />}
                </View>
                {rel.description && (
                  <Text style={{ ...type.body, color: palette.second }}>{rel.description}</Text>
                )}
                {rel.otherSettlement && (
                  <Text style={{ ...type.caption, color: palette.muted, marginTop: 2 }}>
                    With: {rel.otherSettlement}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Cross-settlement conflicts */}
        {r.crossConflicts.length > 0 && (
          <View style={{ marginBottom: space.md }}>
            <Heading level={3}>Cross-Settlement Conflicts</Heading>
            {r.crossConflicts.map((c, i) => (
              <View key={`cc-${i}`} style={{ marginBottom: space.sm }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.ink }}>
                  {c.title || (Array.isArray(c.parties) ? c.parties.join(' vs ') : `Conflict ${i + 1}`)}
                </Text>
                {c.description && <Text style={type.body}>{c.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Internal relationships (rare; mostly NPC alliances) */}
        {r.internal.length > 0 && (
          <View>
            <Heading level={3}>Internal Relationships</Heading>
            {r.internal.slice(0, 8).map((rel, i) => (
              <View key={`i-${i}`} style={{ flexDirection: 'row', marginBottom: 4 }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.cool, marginRight: 6 }}>•</Text>
                <Text style={{ ...type.body, flex: 1 }}>
                  {rel.label || rel.title || (rel.from && rel.to ? `${rel.from} ↔ ${rel.to}` : '—')}
                  {rel.description ? ` — ${rel.description}` : ''}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Section>
    </PageChrome>
  );
}

function RelPill({ type: relType }) {
  if (!relType) return null;
  const label = REL_LABELS[relType] || relType;
  const color = relColors[relType] || palette.muted;
  return (
    <View
      style={{
        backgroundColor: hexWithAlpha(color, 0.12),
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          fontFamily: 'Nunito',
          fontSize: 8.5,
          fontWeight: 700,
          letterSpacing: 0.4,
          color,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

// Convert a hex string + alpha into a 0xAARRGGBB-style hex8 that react-pdf
// accepts in some background contexts. (rgba() is fine for backgroundColor
// in v4, but hex8 is the safest fallback.)
function hexWithAlpha(hex, alpha) {
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  // hex is like "#a0762a" — append the alpha channel
  return `${hex}${a}`;
}

export default Relationships;
