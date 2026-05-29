/**
 * SummaryPage — chapter 00. The "elevator pitch" page.
 *
 * Mirrors the on-screen Summary tab, which had no PDF counterpart in the
 * previous build. Densely packed: identity strip → crisis banner → arrival
 * scene → pressure sentence → 3-tile situation row → faction bar →
 * key figures (top 4 NPCs) → notable connection → DM notes pad.
 *
 * Most content text is editable so a DM can rewrite the elevator pitch in
 * their own voice while keeping the engine output as a starting draft.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, StatStrip, KeyValRow, ThreeCol, GoldRule, HairRule } from '../primitives/Dense.jsx';
import { StackedBar } from '../primitives/Visuals.jsx';
import { EditableText, EditableProse, NotesField } from '../primitives/Editable.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, space, pt } from '../theme.js';
import { cap, label } from '../lib/format.js';

export function SummaryPage({ settlement, narrativeMode, vm }) {
  const su = vm.summary;
  const id = su.identity;
  const populationFmt = id.population ? id.population.toLocaleString() : '—';

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="00"
        title="Summary"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub="Elevator pitch"
      />

      {/* ── Identity strip ─────────────────────────────────────────── */}
      <StatStrip
        stats={[
          { label: 'TIER',       value: id.tier || '—' },
          { label: 'POPULATION', value: populationFmt },
          { label: 'RACE',       value: cap(id.dominantRace) || '—' },
          { label: 'TERRAIN',    value: cap(id.terrain) || '—' },
          { label: 'GOVERNANCE', value: shortGovernance(su.situation.power) || '—' },
        ]}
      />

      {/* ── Active crisis ─────────────────────────────────────────── */}
      {su.crisis.active && (
        <View style={{ marginBottom: space.sm }} wrap={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
            {su.crisis.chips.map((c, i) => (
              <Pill key={`crisis-${i}`} tone="bad">{c.label || c.icon || 'Crisis'}</Pill>
            ))}
          </View>
          {su.crisis.chips.filter(c => c.summary).map((c, i) => (
            <View key={`csum-${i}`} style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={{ ...type.body_em, color: palette.bad, fontSize: pt['9'], marginRight: 4 }}>
                {c.label}:
              </Text>
              <Text style={{ ...type.body, fontSize: pt['9'], flex: 1, color: palette.second }}>
                {c.summary}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Arrival scene + pressure sentence (AI mode) ───────────── */}
      {su.arrivalScene && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.ai, fontSize: pt['8'], marginBottom: 3 }}>
            ARRIVAL SCENE
          </Text>
          <EditableProse
            name="summary.arrivalScene"
            defaultValue={su.arrivalScene}
            lines={3}
            style={{ ...type.prose, fontStyle: 'italic', fontSize: pt['10'] }}
          />
        </View>
      )}

      {su.pressureSentence && (
        <View style={{ marginBottom: space.sm }}>
          <EditableText
            name="summary.pressureSentence"
            defaultValue={su.pressureSentence}
            style={{ ...type.body_em, color: palette.bad, fontSize: pt['10'] }}
          />
        </View>
      )}

      <GoldRule />

      {/* ── 3-tile situation row ──────────────────────────────────── */}
      <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 4 }}>
        SITUATION
      </Text>
      <ThreeCol
        a={
          <View>
            <Text style={{ ...type.label, color: palette.muted, fontSize: pt['7.5'] }}>POWER</Text>
            <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], marginTop: 1 }}>
              {cap(su.situation.power.governanceType) || 'Unspecified'}
            </Text>
            {su.situation.power.governingName && (
              <EditableText
                name="summary.power.governingName"
                defaultValue={su.situation.power.governingName}
                style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}
              />
            )}
          </View>
        }
        b={
          <View>
            <Text style={{ ...type.label, color: palette.gold, fontSize: pt['7.5'] }}>ECONOMY</Text>
            <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], marginTop: 1 }}>
              {cap(su.situation.economy.complexity) || 'Unknown'}
            </Text>
            {su.situation.economy.topExport && (
              <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
                exports {su.situation.economy.topExport}
              </Text>
            )}
          </View>
        }
        c={
          <View>
            <Text style={{ ...type.label, color: palette.cool, fontSize: pt['7.5'] }}>DEFENSE</Text>
            <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], marginTop: 1 }}>
              {su.situation.defense.readiness || 'Unknown'}
            </Text>
            {su.situation.defense.scoreAvg != null && (
              <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
                avg {su.situation.defense.scoreAvg}/100
              </Text>
            )}
          </View>
        }
      />

      {/* ── Power & Conflict bar ───────────────────────────────────── */}
      {su.factionsPower.length > 0 && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <KeyValRow
            pairs={[
              { label: 'FACTIONS', value: su.factionsPower.length },
              { label: 'TENSIONS', value: su.tensionsCount },
            ]}
            style={{ marginBottom: 3 }}
          />
          <StackedBar
            segments={su.factionsPower.map(f => ({
              name: f.name,
              value: f.power,
              isGoverning: f.isGoverning,
              category: f.isGoverning ? 'government' : null,
            }))}
            height={6}
            showLabels={false}
          />
        </View>
      )}

      <GoldRule />

      {/* ── Key Figures: top 4 NPCs ────────────────────────────────── */}
      {su.keyFigures.length > 0 && (
        <View wrap={false}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 4 }}>
            KEY FIGURES
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {su.keyFigures.map((npc, i) => (
              <View
                key={`kf-${i}`}
                style={{
                  width: '48%',
                  padding: 6,
                  border: `0.4pt solid ${palette.border}`,
                  borderRadius: 2,
                  backgroundColor: '#fffbf5',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <EditableText
                    name={`summary.npc.${i}.name`}
                    defaultValue={npc.name || 'Unnamed'}
                    style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'] }}
                  />
                  <Pill tone="gold">PWR {npc.power}</Pill>
                </View>
                <EditableText
                  name={`summary.npc.${i}.title`}
                  defaultValue={npc.title || ''}
                  style={{ ...type.italic, color: palette.muted, fontSize: pt['8.5'] }}
                />
                {npc.faction && (
                  <Text style={{ ...type.caption, color: palette.cool, fontSize: pt['7.5'], marginTop: 1 }}>
                    {npc.faction}
                  </Text>
                )}
                {npc.sentence && (
                  <View style={{ marginTop: 3 }}>
                    <EditableProse
                      name={`summary.npc.${i}.sentence`}
                      defaultValue={npc.sentence}
                      lines={2}
                      style={{ ...type.body, fontSize: pt['8.5'], lineHeight: 1.4 }}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── Prominent Relationship ─────────────────────────────────── */}
      {su.prominentRelationship && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.cool, fontSize: pt['8'], marginBottom: 3 }}>
            NOTABLE CONNECTION
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
            <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], marginRight: 4 }}>
              {label(su.prominentRelationship.otherSettlement) || 'Neighbour'}
            </Text>
            <Pill tone="cool">{cap(su.prominentRelationship.relationshipType || su.prominentRelationship.type) || 'linked'}</Pill>
          </View>
          {su.prominentRelationship.description && (
            <EditableProse
              name="summary.prominentRelationship.description"
              defaultValue={su.prominentRelationship.description}
              lines={2}
              style={{ ...type.body, fontSize: pt['9'] }}
            />
          )}
        </View>
      )}

      {/* ── DM Notes pad ──────────────────────────────────────────── */}
      <NotesField name="summary.dmNotes" lines={4} label="DM NOTES" />
    </PageChrome>
  );
}

function shortGovernance(power) {
  if (!power) return '';
  return cap(power.governanceType || '');
}

export default SummaryPage;
