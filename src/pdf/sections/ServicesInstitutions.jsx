/**
 * ServicesInstitutions — chapter 06.
 *
 * Lists every institution grouped by category (with a colored category dot
 * matching the on-screen tab palette), available services as green pills,
 * and active supply chains. Categories without any institutions are hidden.
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { Section } from '../primitives/Section.jsx';
import { Heading } from '../primitives/Heading.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, space, factionColors } from '../theme.js';

const CATEGORY_ORDER = [
  'government', 'military', 'religious', 'economy', 'magic',
  'crafts', 'infrastructure', 'defense', 'entertainment',
  'adventuring', 'criminal', 'other',
];

export function ServicesInstitutions({ settlement, narrativeMode, vm }) {
  const s = vm.services;
  const grouped = groupInstitutions(s.institutions);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="06"
        title="Services & Institutions"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        <Heading level={3}>Institutions</Heading>
        {CATEGORY_ORDER.filter(cat => grouped[cat]?.length).map(cat => (
          <View key={cat} style={{ marginBottom: space.sm }} wrap={false}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: factionColors[cat] || palette.gold,
                  marginRight: 6,
                }}
              />
              <Text style={{ ...type.label, color: palette.ink, fontSize: 9 }}>{cap(cat)}</Text>
              <Text style={{ ...type.caption, color: palette.muted, marginLeft: 6 }}>
                {grouped[cat].length} institution{grouped[cat].length === 1 ? '' : 's'}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginLeft: 14 }}>
              {grouped[cat].map((inst, i) => (
                <Pill key={`${cat}-${i}`} tone="muted">{labelOf(inst)}</Pill>
              ))}
            </View>
          </View>
        ))}
        {Object.keys(grouped).length === 0 && (
          <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
            No institutions registered.
          </Text>
        )}

        {/* Available services */}
        {Object.keys(s.available).length > 0 && (
          <View style={{ marginTop: space.lg }}>
            <Heading level={3}>Available Services</Heading>
            {Object.entries(s.available).map(([cat, services]) => {
              const list = Array.isArray(services)
                ? services
                : Object.entries(services).map(([k, v]) => (v ? k : null)).filter(Boolean);
              if (!list.length) return null;
              return (
                <View key={cat} style={{ marginBottom: space.sm }} wrap={false}>
                  <Text style={{ ...type.label, color: palette.gold, fontSize: 8, marginBottom: 3 }}>
                    {cap(cat)}
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
                    {list.map((svc, i) => (
                      <Pill key={`svc-${cat}-${i}`} tone="good">
                        + {typeof svc === 'string' ? svc : labelOf(svc)}
                      </Pill>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Supply chains */}
        {s.activeChains.length > 0 && (
          <View style={{ marginTop: space.lg }}>
            <Heading level={3}>Active Supply Chains</Heading>
            {s.activeChains.slice(0, 8).map((chain, i) => (
              <View key={`chain-${i}`} style={{ marginBottom: 6 }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.ink }}>
                  {chain.name || chain.title || `Chain ${i + 1}`}
                </Text>
                {chain.description && (
                  <Text style={{ ...type.caption, color: palette.muted }}>{chain.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Section>
    </PageChrome>
  );
}

function groupInstitutions(institutions) {
  const grouped = {};
  for (const inst of (institutions || [])) {
    const cat = (inst?.category || inst?.cat || 'other').toString().toLowerCase();
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(inst);
  }
  return grouped;
}

function cap(s) { return s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function labelOf(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.name || item.label || item.title || '';
}

export default ServicesInstitutions;
