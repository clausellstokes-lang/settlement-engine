/**
 * NotableNPCs — chapter 10.
 *
 * Sorted by power, broken into three tiers so the printed dossier has a
 * scannable hierarchy:
 *
 *   • Power ≥ 70 → "Major Figures"        — full card per NPC
 *                                            (name, title, faction, blurb,
 *                                            up to two plot hooks)
 *   • 40–69      → "Notable Figures"      — half cards, two per row
 *   • < 40       → "Other Names of Note"  — single-line listing
 *
 * NPC cards wrap={false} so a card never breaks across pages.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, space } from '../theme.js';

export function NotableNPCs({ settlement, narrativeMode, vm }) {
  const all = vm.npcs.sorted;
  const major = all.filter(n => (n.power || 0) >= 70);
  const notable = all.filter(n => (n.power || 0) >= 40 && (n.power || 0) < 70);
  const other = all.filter(n => (n.power || 0) < 40);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="10"
        title="Notable NPCs"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {all.length === 0 && (
          <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
            No NPCs detailed for this settlement.
          </Text>
        )}

        {/* Major figures */}
        {major.length > 0 && (
          <View style={{ marginBottom: space.md }}>
            <Heading level={3}>Major Figures</Heading>
            {major.map((npc, i) => (
              <FullCard key={`maj-${i}`} npc={npc} />
            ))}
          </View>
        )}

        {/* Notable figures — two per row */}
        {notable.length > 0 && (
          <View style={{ marginBottom: space.md }}>
            <Heading level={3}>Notable Figures</Heading>
            {chunk(notable, 2).map((row, ri) => (
              <View key={`row-${ri}`} style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                {row.map((npc, ci) => (
                  <View key={`n-${ri}-${ci}`} style={{ flex: 1 }}>
                    <CompactCard npc={npc} />
                  </View>
                ))}
                {/* Pad row if odd count */}
                {row.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            ))}
          </View>
        )}

        {/* Other names */}
        {other.length > 0 && (
          <View>
            <Heading level={3}>Other Names of Note</Heading>
            {other.map((npc, i) => (
              <View
                key={`o-${i}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  paddingVertical: 3,
                  borderBottom: i < other.length - 1 ? `0.3pt solid ${palette.border}` : undefined,
                }}
                wrap={false}
              >
                <Text style={{ ...type.body_em, color: palette.ink, width: 130 }}>
                  {npc.name || 'Unnamed'}
                </Text>
                <Text style={{ ...type.body, color: palette.second, flex: 1 }}>
                  {npc.title || '—'}
                </Text>
                {npc.factionAffiliation && (
                  <Text style={{ ...type.caption, color: palette.muted }}>
                    {labelOfFaction(npc.factionAffiliation)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Section>
    </PageChrome>
  );
}

function FullCard({ npc }) {
  const hooks = (npc.plotHooks || []).slice(0, 2);
  return (
    <View
      style={{
        marginBottom: space.md,
        padding: 12,
        border: `0.5pt solid ${palette.border}`,
        borderRadius: 3,
        backgroundColor: '#fffaf0',
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...type.body_em, color: palette.ink, fontSize: 13 }}>
            {npc.name || 'Unnamed'}
          </Text>
          <Text style={{ ...type.italic, color: palette.muted, fontSize: 10 }}>
            {npc.title || ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {npc.factionAffiliation && (
            <Pill tone="cool">{labelOfFaction(npc.factionAffiliation)}</Pill>
          )}
          <Pill tone="gold">PWR {npc.power || 0}</Pill>
        </View>
      </View>
      {npc.blurb && (
        <Text style={{ ...type.body, color: palette.second, marginTop: 4 }}>{npc.blurb}</Text>
      )}
      {npc.influence && (
        <Text style={{ ...type.caption, color: palette.muted, marginTop: 4 }}>
          Influence: {typeof npc.influence === 'string' ? npc.influence : (npc.influence.label || JSON.stringify(npc.influence))}
        </Text>
      )}
      {hooks.length > 0 && (
        <View style={{ marginTop: 6 }}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: 7.5, marginBottom: 3 }}>
            PLOT HOOKS
          </Text>
          {hooks.map((h, i) => (
            <View key={`h-${i}`} style={{ flexDirection: 'row', marginBottom: 3 }}>
              <Text style={{ ...type.body_em, color: palette.gold, marginRight: 6 }}>•</Text>
              <Text style={{ ...type.body, flex: 1 }}>{labelOfHook(h)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function CompactCard({ npc }) {
  const firstHook = (npc.plotHooks || [])[0];
  return (
    <View
      style={{
        padding: 8,
        border: `0.5pt solid ${palette.border}`,
        borderRadius: 3,
        backgroundColor: '#fffaf0',
        height: '100%',
      }}
      wrap={false}
    >
      <Text style={{ ...type.body_em, color: palette.ink, fontSize: 11 }}>{npc.name || 'Unnamed'}</Text>
      <Text style={{ ...type.italic, color: palette.muted, fontSize: 9, marginBottom: 3 }}>
        {npc.title || ''}
      </Text>
      <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
        {npc.factionAffiliation && (
          <Pill tone="cool">{labelOfFaction(npc.factionAffiliation)}</Pill>
        )}
        <Pill tone="gold">PWR {npc.power || 0}</Pill>
      </View>
      {firstHook && (
        <Text style={{ ...type.caption, color: palette.second, lineHeight: 1.4 }}>
          {labelOfHook(firstHook)}
        </Text>
      )}
    </View>
  );
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

function labelOfFaction(f) {
  if (!f) return '';
  if (typeof f === 'string') return f;
  return f.faction || f.name || f.label || '';
}

function labelOfHook(h) {
  if (!h) return '';
  if (typeof h === 'string') return h;
  return h.hook || h.text || h.description || h.title || '';
}

export default NotableNPCs;
