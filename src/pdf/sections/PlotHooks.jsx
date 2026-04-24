/**
 * PlotHooks — chapter 11.
 *
 * Aggregates every hook the engine has surfaced (NPC personal hooks,
 * conflict hooks, underworld hooks, viability-crisis hooks) into a single
 * numbered ledger. Each hook is tagged with a source pill so the GM knows
 * where to look in the rest of the dossier for the related characters.
 *
 * Live tensions follow as a short addendum.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, space } from '../theme.js';

const SOURCE_LABELS = {
  npc:      { label: 'NPC',      tone: 'cool' },
  conflict: { label: 'CONFLICT', tone: 'warn' },
  crime:    { label: 'CRIME',    tone: 'bad' },
  crisis:   { label: 'CRISIS',   tone: 'bad' },
};

export function PlotHooks({ settlement, narrativeMode, vm }) {
  const hooks = vm.hooks.all;
  const tensions = vm.hooks.tensions;

  // Group by source for readability
  const grouped = {};
  for (const h of hooks) {
    if (!grouped[h.source]) grouped[h.source] = [];
    grouped[h.source].push(h);
  }

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="11"
        title="Plot Hooks & Quests"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {hooks.length === 0 && (
          <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
            No plot hooks surfaced for this settlement yet.
          </Text>
        )}

        {/* Render each source group */}
        {Object.entries(grouped).map(([source, list]) => {
          const cfg = SOURCE_LABELS[source] || { label: source.toUpperCase(), tone: 'gold' };
          return (
            <View key={source} style={{ marginBottom: space.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Pill tone={cfg.tone}>{cfg.label}</Pill>
                <Text style={{ ...type.caption, color: palette.muted, marginLeft: 6 }}>
                  {list.length} hook{list.length === 1 ? '' : 's'}
                </Text>
              </View>
              {list.map((h, i) => (
                <View
                  key={`${source}-${i}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    paddingVertical: 6,
                    borderBottom: i < list.length - 1 ? `0.3pt solid ${palette.border}` : undefined,
                  }}
                  wrap={false}
                >
                  <Text
                    style={{
                      ...type.label_em,
                      color: palette.gold,
                      width: 24,
                      fontSize: 9,
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                  <View style={{ flex: 1 }}>
                    {h.sourceName && (
                      <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5, marginBottom: 1 }}>
                        {h.sourceName.toUpperCase()}
                      </Text>
                    )}
                    <Text style={type.body}>{labelOfHook(h.hook)}</Text>
                  </View>
                </View>
              ))}
            </View>
          );
        })}

        {/* Live tensions */}
        {tensions.length > 0 && (
          <View style={{ marginTop: space.md }}>
            <Heading level={4}>Underlying Tensions</Heading>
            {tensions.map((t, i) => (
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

function labelOfHook(h) {
  if (!h) return '';
  if (typeof h === 'string') return h;
  return h.hook || h.text || h.description || h.title || '';
}

export default PlotHooks;
