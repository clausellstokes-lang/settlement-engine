/**
 * DefenseSecurity — chapter 05.
 *
 * Readiness pill at top, then five threat-score bars, defense-institutions
 * checklist, and the crime/safety block (label, ratio, crime types,
 * criminal organisations, black-market capture).
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

const SCORE_KEYS = [
  { key: 'military', label: 'Military Threat' },
  { key: 'monster',  label: 'Monster Threat' },
  { key: 'internal', label: 'Internal Threat' },
  { key: 'economic', label: 'Economic Threat' },
  { key: 'magical',  label: 'Magical Threat' },
];

const INST_LABELS = {
  walls:      'Walls',
  garrison:   'Garrison',
  militia:    'Militia',
  watch:      'Town Watch',
  mercenary:  'Mercenary Companies',
  charter:    'Adventurer Charter',
  magicDef:   'Magical Defenses',
};

export function DefenseSecurity({ settlement, narrativeMode, vm }) {
  const d = vm.defense;

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <Section
        eyebrow="05"
        title="Defense & Security"
        accent={narrativeMode ? palette.ai : palette.gold}
      >
        {/* Readiness banner */}
        {d.readiness && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: space.md,
            }}
          >
            <Text style={{ ...type.label, color: palette.muted }}>READINESS</Text>
            <Pill tone={readinessTone(d.readiness)} large>
              {d.readiness.label || (typeof d.readiness === 'string' ? d.readiness : '—')}
            </Pill>
          </View>
        )}

        {/* Threat scores */}
        <Heading level={3}>Threat Scores</Heading>
        <View style={{ marginBottom: space.md }}>
          {SCORE_KEYS.map(({ key, label }) => (
            <BarMeter
              key={key}
              value={d.scores[key] || 0}
              max={100}
              label={label}
              sublabel={`${d.scores[key] || 0}/100`}
              tone={threatTone(d.scores[key])}
            />
          ))}
        </View>

        {/* Defense institutions */}
        <Heading level={3}>Defense Institutions</Heading>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: space.md }}>
          {Object.entries(INST_LABELS).map(([key, label]) => {
            const present = !!d.institutions[key];
            return (
              <Pill key={key} tone={present ? 'good' : 'muted'}>
                {present ? '+ ' : '· '}{label}
              </Pill>
            );
          })}
        </View>

        {/* Crime / safety summary row */}
        <Heading level={3}>Crime & Safety</Heading>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: space.sm }}>
          {d.safetyLabel && (
            <View style={{ flex: 1 }}>
              <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5 }}>SAFETY</Text>
              <Text style={{ ...type.body_em, color: palette.ink, marginTop: 2 }}>
                {cap(d.safetyLabel)}
              </Text>
            </View>
          )}
          {typeof d.safetyRatio === 'number' && (
            <View style={{ flex: 1 }}>
              <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5 }}>ENFORCEMENT RATIO</Text>
              <Text style={{ ...type.body_em, color: palette.ink, marginTop: 2 }}>
                {d.safetyRatio.toFixed(2)}
              </Text>
            </View>
          )}
          {d.foodResilience != null && (
            <View style={{ flex: 1 }}>
              <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5 }}>FOOD RESILIENCE</Text>
              <Text style={{ ...type.body_em, color: palette.ink, marginTop: 2 }}>
                {d.foodResilience}/100
              </Text>
            </View>
          )}
        </View>

        {/* Crime types */}
        {d.crimeTypes.length > 0 && (
          <View style={{ marginBottom: space.sm }}>
            <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5, marginBottom: 4 }}>
              ACTIVE CRIME TYPES
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {d.crimeTypes.map((c, i) => (
                <Pill key={`c-${i}`} tone="bad">{labelOf(c)}</Pill>
              ))}
            </View>
          </View>
        )}

        {/* Criminal organizations */}
        {d.criminalInstitutions.length > 0 && (
          <View style={{ marginBottom: space.sm }}>
            <Text style={{ ...type.label, color: palette.muted, fontSize: 7.5, marginBottom: 4 }}>
              CRIMINAL ORGANIZATIONS
            </Text>
            {d.criminalInstitutions.map((c, i) => (
              <View key={`ci-${i}`} style={{ flexDirection: 'row', marginBottom: 3 }} wrap={false}>
                <Text style={{ ...type.body_em, color: palette.bad, marginRight: 6 }}>•</Text>
                <Text style={{ ...type.body, flex: 1 }}>{labelOf(c)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Black market */}
        {d.blackMarketCapture && (
          <Callout tone="bad" kicker="BLACK MARKET CAPTURE">
            <Text style={type.body}>
              {typeof d.blackMarketCapture === 'string'
                ? d.blackMarketCapture
                : (d.blackMarketCapture.summary || d.blackMarketCapture.label || 'Significant criminal capture detected.')}
            </Text>
          </Callout>
        )}
      </Section>
    </PageChrome>
  );
}

function threatTone(score) {
  if (score == null) return 'muted';
  if (score >= 70) return 'bad';
  if (score >= 40) return 'warn';
  return 'good';
}

function readinessTone(r) {
  const lbl = (r?.label || r || '').toString().toLowerCase();
  if (lbl.includes('high') || lbl.includes('ready') || lbl.includes('strong')) return 'good';
  if (lbl.includes('weak') || lbl.includes('low') || lbl.includes('vulnerable')) return 'bad';
  return 'warn';
}

function cap(s) { return s && typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function labelOf(item) {
  if (!item) return '';
  if (typeof item === 'string') return item;
  return item.name || item.label || item.title || item.type || '';
}

export default DefenseSecurity;
