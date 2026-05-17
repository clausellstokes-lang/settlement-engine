/**
 * DefenseSecurity — chapter 04. Threat detail + criminal architecture +
 * supporting capabilities.
 *
 *   - Active military status override banner (siege/occupied/civil war)
 *   - Readiness banner + score average
 *   - Per-threat ScoreCard with description + factors[]
 *   - Defense institutions detail (notableUnits, loyaltyNote, arcaneCorps)
 *   - Criminal architecture: capture state, operations, criminal faction
 *   - Supporting capabilities (legal/medical/logistics/naval)
 *   - Vulnerabilities list
 */
import React from 'react';
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, StatStrip, KeyValRow, BulletList, GoldRule, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { defenseHeadline, defenseTone } from '../lib/headlines.js';
import { ScoreCard, ScoreWithBreakdown, StatusCard } from '../primitives/Visuals.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { BarMeter } from '../primitives/BarMeter.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space } from '../theme.js';
import { cap, num, smart, label, hookText } from '../lib/format.js';

export function DefenseSecurity({ settlement, narrativeMode, vm }) {
  const d = vm.defense;

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="11"
        title="Defense & Security"
        accent={narrativeMode ? palette.ai : palette.gold}
      />

      <ChapterHeadline tone={defenseTone(d)}>
        {defenseHeadline(d, vm.identity)}
      </ChapterHeadline>

      {/* ── Military status override ──────────────────────────────── */}
      {d.militaryStress && (
        <Callout tone="bad" kicker="ACTIVE MILITARY STATUS">
          <Text style={{ ...type.body_em, color: palette.bad, fontSize: 11 }}>
            {d.militaryStress.label || cap(d.militaryStress.icon || 'Active')}
          </Text>
          {d.militaryStress.summary && (
            <EditableProse
              name="defense.militaryStress.summary"
              defaultValue={d.militaryStress.summary}
              lines={1}
              style={{ ...type.body, fontSize: 9.5 }}
            />
          )}
        </Callout>
      )}

      {/* ── Readiness strip ──────────────────────────────────────── */}
      <StatStrip
        stats={[
          { label: 'READINESS', value: d.readiness?.label || '—' },
          { label: 'SCORE AVG', value: smart(d.scoreAvg), tone: scoreTone(d.scoreAvg) },
          { label: 'SAFETY', value: cap(d.safetyLabel) || '—' },
          { label: 'WATCH:POP', value: smart(d.safetyRatio) },
          { label: 'FOOD RES.', value: smart(d.foodResilience) },
        ]}
      />

      {/* ── Guard assessment ─────────────────────────────────────── */}
      {d.guardAssessment && (
        <View style={{ marginBottom: space.sm }} wrap={false}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: 8, marginBottom: 3 }}>
            GUARD ASSESSMENT
          </Text>
          <EditableProse
            name="defense.guardAssessment"
            defaultValue={d.guardAssessment}
            lines={2}
            style={{ ...type.body, fontSize: 9.5 }}
          />
        </View>
      )}

      {/* ── Threat scores with descriptions and factors ──────────── */}
      <Text style={{ ...type.label, color: palette.bad, fontSize: 8, marginBottom: 3 }}>
        THREAT ASSESSMENT
      </Text>
      {d.threats.map((t, i) => (
        <ScoreCard
          key={`th-${i}`}
          label={t.label}
          score={t.score}
          tone={scoreTone(t.score)}
          description={t.description}
          factors={t.factors}
        />
      ))}

      {/* ── Defense institutions ────────────────────────────────── */}
      <View style={{ marginTop: space.sm }}>
        <HairRule />
        <Text style={{ ...type.label, color: palette.gold, fontSize: 8, marginBottom: 3 }}>
          ARMED FORCES
        </Text>
        {d.defenseInstitutions.filter(inst => inst.present).map((inst, i) => (
          <View
            key={`di-${inst.key}`}
            style={{
              marginBottom: 4,
              padding: 5,
              border: `0.4pt solid ${palette.border}`,
              borderRadius: 2,
              backgroundColor: '#fffbf5',
            }}
            wrap={false}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ ...type.body_em, fontSize: 10, color: palette.ink, flex: 1, marginRight: 6 }}>
                {inst.name || inst.label}
              </Text>
              <Tag tone="good">PRESENT</Tag>
            </View>
            {(inst.notableUnits || inst.loyaltyNote || inst.arcaneCorps || inst.staffing) && (
              <Text style={{ ...type.caption, color: palette.muted, fontSize: 8, marginTop: 2 }}>
                {[
                  inst.notableUnits && `Units: ${inst.notableUnits}`,
                  inst.loyaltyNote && `Loyalty: ${inst.loyaltyNote}`,
                  inst.arcaneCorps && `Arcane: ${inst.arcaneCorps}`,
                  inst.staffing && `Staffing: ${inst.staffing}`,
                ].filter(Boolean).join('  ·  ')}
              </Text>
            )}
            {inst.notes && (
              <EditableText
                name={`defense.inst.${inst.key}.notes`}
                defaultValue={inst.notes}
                style={{ ...type.body, fontSize: 9 }}
              />
            )}
          </View>
        ))}
        {/* Show absent institutions inline */}
        {d.defenseInstitutions.filter(inst => !inst.present).length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 }}>
            <Text style={{ ...type.label, fontSize: 7.5, color: palette.muted, marginRight: 4 }}>
              ABSENT:
            </Text>
            {d.defenseInstitutions.filter(inst => !inst.present).map(inst => (
              <Tag key={`absent-${inst.key}`} tone="muted">{inst.label}</Tag>
            ))}
          </View>
        )}
      </View>

      {/* ── Criminal architecture ─────────────────────────────── */}
      {(d.criminalCapture || d.criminalOps?.length > 0 || d.crimeTypes?.length > 0) && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: 8, marginBottom: 3 }}>
            CRIMINAL ARCHITECTURE
          </Text>
          {d.criminalCapture && (
            <View
              style={{
                padding: 5,
                marginBottom: 4,
                backgroundColor: '#fde8e8',
                borderLeft: `2pt solid ${palette.bad}`,
                borderRadius: 2,
              }}
              wrap={false}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ ...type.body_em, color: palette.bad, fontSize: 10, flex: 1, marginRight: 6 }}>
                  {cap(d.criminalCapture.label || d.criminalCapture.classification) || 'Criminal capture'}
                </Text>
                {d.criminalCapture.score != null && (
                  <Pill tone="bad">{d.criminalCapture.score}</Pill>
                )}
              </View>
              {d.criminalCapture.description && (
                <EditableProse
                  name="defense.criminalCapture.description"
                  defaultValue={d.criminalCapture.description}
                  lines={1}
                  style={{ ...type.body, fontSize: 9 }}
                />
              )}
            </View>
          )}
          {d.crimeTypes?.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 3 }}>
              {d.crimeTypes.map((ct, i) => (
                <Tag key={`crm-${i}`} tone="bad">{label(ct)}</Tag>
              ))}
            </View>
          )}
          {d.criminalOps?.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <Text style={{ ...type.label, fontSize: 7.5, color: palette.muted }}>OPERATIONS</Text>
              {d.criminalOps.map((op, i) => (
                <View key={`cop-${i}`} style={{ marginBottom: 2 }}>
                  <Text style={{ ...type.body_em, fontSize: 9, color: palette.bad }}>
                    {label(op)}
                  </Text>
                  {(op?.scope || op?.target) && (
                    <Text style={{ ...type.caption, fontSize: 8, color: palette.muted }}>
                      {op?.scope && `Scope: ${op.scope}`}
                      {op?.scope && op?.target && '  ·  '}
                      {op?.target && `Target: ${op.target}`}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
          {d.criminalFaction && (
            <View style={{ padding: 5, border: `0.4pt solid ${palette.bad}`, borderRadius: 2, marginBottom: 4 }}>
              <Text style={{ ...type.body_em, fontSize: 10, color: palette.bad }}>
                {d.criminalFaction.faction || d.criminalFaction.name}
              </Text>
              {d.criminalFaction.blurb && (
                <EditableProse
                  name="defense.criminalFaction.blurb"
                  defaultValue={d.criminalFaction.blurb}
                  lines={1}
                  style={{ ...type.body, fontSize: 9 }}
                />
              )}
            </View>
          )}
          {d.orderHooks?.length > 0 && (
            <View>
              <Text style={{ ...type.label, fontSize: 7.5, color: palette.muted }}>ORDER HOOKS</Text>
              {d.orderHooks.map((h, i) => (
                <View key={`oh-${i}`} style={{ flexDirection: 'row' }}>
                  <Text style={{ color: palette.bad, marginRight: 4, fontSize: 9 }}>·</Text>
                  <EditableText
                    name={`defense.orderHook.${i}`}
                    defaultValue={hookText(h)}
                    style={{ ...type.body, fontSize: 9 }}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── Supporting capabilities ───────────────────────────── */}
      {Object.values(d.supportingCapabilities).some(Boolean) && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: 8, marginBottom: 3 }}>
            SUPPORTING CAPABILITIES
          </Text>
          {Object.entries(d.supportingCapabilities).filter(([, v]) => v).map(([key, v]) => (
            <View
              key={`sc-${key}`}
              style={{ flexDirection: 'row', marginBottom: 3, alignItems: 'flex-start' }}
            >
              <Text style={{ ...type.label, fontSize: 7.5, color: palette.muted, width: 100 }}>
                {capKey(key)}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={{ ...type.body, fontSize: 9, color: palette.ink }}>
                  {typeof v === 'string' ? v : (v?.label || cap(v?.level) || '—')}
                </Text>
                {typeof v === 'object' && v?.description && (
                  <EditableText
                    name={`defense.cap.${key}.description`}
                    defaultValue={v.description}
                    style={{ ...type.caption, fontSize: 8, color: palette.muted }}
                  />
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── Vulnerabilities ───────────────────────────────────── */}
      {d.vulnerabilities?.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: 8, marginBottom: 3 }}>
            VULNERABILITIES
          </Text>
          <BulletList
            items={d.vulnerabilities}
            tone="warn"
            itemRender={(v) => label(v) || (typeof v === 'string' ? v : '')}
          />
        </View>
      )}
    </PageChrome>
  );
}

function scoreTone(v) {
  if (v == null) return 'muted';
  if (v >= 70) return 'good';
  if (v >= 40) return 'warn';
  return 'bad';
}

function capKey(s) {
  if (!s) return '';
  return s.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()).trim();
}

export default DefenseSecurity;
