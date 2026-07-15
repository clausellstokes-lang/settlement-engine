/**
 * DefenseSecurity — chapter 04. Threat detail + criminal architecture +
 * supporting capabilities.
 *
 *   - Active military status override banner (siege/occupied/civil war)
 *   - Readiness banner + score average
 *   - Defense readiness rows (threat assessment reframed: label + bar + badge + prose)
 *   - Armed forces & fortifications, grouped (fortifications/standing/contracted/charter/arcane)
 *   - Criminal architecture: capture state, operations, criminal faction
 *   - Supporting capabilities (legal/medical/logistics/naval)
 *   - Vulnerabilities list
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, StatStrip, BulletList, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { defenseHeadline, defenseTone } from '../lib/headlines.js';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt } from '../theme.js';
import { cap, smart, label, hookText } from '../lib/format.js';

// Armed-forces groups in render order, mirroring the web Defense tab.
const FORCE_GROUPS = [
  { key: 'fortifications', label: 'FORTIFICATIONS', accent: palette.muted },
  { key: 'standing', label: 'STANDING FORCES', accent: palette.bad },
  { key: 'contracted', label: 'CONTRACTED FORCES', accent: palette.gold },
  { key: 'charter', label: 'MONSTER RESPONSE (CHARTER)', accent: palette.cool },
  { key: 'arcane', label: 'ARCANE DEFENSE', accent: palette.ai },
];

export function DefenseSecurity({ settlement, narrativeMode, vm }) {
  const d = vm.defense;

  // Criminal capture arrives as a ladder string ('none' → 'adversarial' →
  // 'equilibrium' → 'corrupted' → 'capture') on powerStructure.criminalCaptureState,
  // not an object — drop the card at 'none', otherwise pair the state with the
  // same safetyProfile.blackMarketCapture % the economics page renders.
  const captureState = typeof d.criminalCapture === 'string'
    ? (d.criminalCapture === 'none' ? null : d.criminalCapture)
    : (d.criminalCapture?.label || d.criminalCapture?.classification || null);
  const captureScore = typeof d.blackMarketCapture === 'number'
    ? d.blackMarketCapture
    : d.blackMarketCapture?.score ?? null;
  const captureDesc = typeof d.criminalCapture === 'object'
    ? d.criminalCapture?.description || null
    : null;

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
          <Text style={{ ...type.body_em, color: palette.bad, fontSize: pt['11'] }}>
            {d.militaryStress.label || cap(d.militaryStress.icon || 'Active')}
          </Text>
          {d.militaryStress.summary && (
            <EditableProse
              name="defense.militaryStress.summary"
              defaultValue={d.militaryStress.summary}
              lines={1}
              style={{ ...type.body, fontSize: pt['9.5'] }}
            />
          )}
        </Callout>
      )}

      {/* ── Readiness strip ──────────────────────────────────────── */}
      <StatStrip
        stats={[
          { label: 'READINESS', value: d.readiness?.label },
          { label: 'SCORE AVG', value: smart(d.scoreAvg), tone: scoreTone(d.scoreAvg) },
          { label: 'SAFETY', value: cap(d.safetyLabel) },
          { label: 'WATCH:POP', value: smart(d.safetyRatio) },
          { label: 'FOOD RES.', value: smart(d.foodResilience) },
        ]}
      />

      {/* ── Guard assessment ─────────────────────────────────────── */}
      {d.guardAssessment && (
        <View style={{ marginBottom: space.sm }} wrap={false}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            GUARD ASSESSMENT
          </Text>
          <EditableProse
            name="defense.guardAssessment"
            defaultValue={d.guardAssessment}
            lines={2}
            style={{ ...type.body, fontSize: pt['9.5'] }}
          />
        </View>
      )}

      {/* ── Defense readiness (threat assessment, reframed) ──────── */}
      <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 1 }}>
        THREAT ASSESSMENT
      </Text>
      <Text style={{ ...type.caption, fontSize: pt['7.5'], color: palette.muted, fontStyle: 'italic', marginBottom: 4 }}>
        Bars show defense readiness against each threat. Higher is better.
      </Text>
      {d.threatReadiness.map((row, i) => (
        <View
          key={`rd-${i}`}
          wrap={false}
          style={{
            marginBottom: 4,
            padding: 5,
            backgroundColor: palette.card,
            borderWidth: 0.4,
            borderColor: palette.border,
            borderLeftWidth: 3,
            borderLeftColor: row.barColor,
            borderRadius: 2,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
            <Text style={{ ...type.body_em, fontSize: pt['10'], color: palette.ink, flex: 1, marginRight: 6 }}>
              {row.label}
            </Text>
            <View style={{ width: 56, height: 4, backgroundColor: palette.border, borderRadius: 2, marginRight: 6, overflow: 'hidden' }}>
              <View style={{ width: `${Math.max(0, Math.min(100, row.score))}%`, height: '100%', backgroundColor: row.barColor }} />
            </View>
            <Text style={{ ...type.pill, fontSize: pt['7.5'], color: row.statusColor }}>
              {row.status}
            </Text>
          </View>
          <Text style={{ ...type.body, fontSize: pt['9'], color: palette.second, lineHeight: 1.4 }}>
            {row.assess}
          </Text>
        </View>
      ))}

      {/* ── Armed forces & fortifications ────────────────────────── */}
      <View style={{ marginTop: space.sm }}>
        <HairRule />
        <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
          ARMED FORCES & FORTIFICATIONS
        </Text>
        {FORCE_GROUPS.map(group => {
          const forces = d.armedForces?.[group.key] || [];
          if (!forces.length) return null;
          return (
            <View key={group.key} style={{ marginBottom: 4 }}>
              <Text style={{ ...type.label, fontSize: pt['7.5'], color: group.accent, marginBottom: 2 }}>
                {group.label}
              </Text>
              {forces.map((force, i) => (
                <View
                  key={`f-${group.key}-${i}`}
                  wrap={false}
                  style={{
                    marginBottom: 3,
                    padding: 4,
                    backgroundColor: palette.card,
                    borderWidth: 0.4,
                    borderColor: palette.border,
                    borderLeftWidth: 2,
                    borderLeftColor: group.accent,
                    borderRadius: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...type.body_em, fontSize: pt['9.5'], color: palette.ink, flex: 1, marginRight: 6 }}>
                      {force.name}
                    </Text>
                    {force.source && force.source !== 'generated' && (
                      <Tag tone="gold">{force.source === 'required' ? 'REQ' : 'FORCED'}</Tag>
                    )}
                  </View>
                  {force.desc && (
                    <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted, lineHeight: 1.35, marginTop: 1 }}>
                      {force.desc}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          );
        })}
        {!FORCE_GROUPS.some(g => (d.armedForces?.[g.key] || []).length) && (
          <Text style={{ ...type.body, fontSize: pt['9'], color: palette.muted, fontStyle: 'italic' }}>
            No organized defensive force. Defense relies on armed citizens.
          </Text>
        )}
      </View>

      {/* ── Criminal architecture ─────────────────────────────── */}
      {(captureState || d.criminalOps?.length > 0 || d.crimeTypes?.length > 0) && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            CRIMINAL ARCHITECTURE
          </Text>
          {captureState && (
            <View
              style={{
                padding: 5,
                marginBottom: 4,
                backgroundColor: palette.badBg,
                borderLeft: `2pt solid ${palette.bad}`,
                borderRadius: 2,
              }}
              wrap={false}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ ...type.body_em, color: palette.bad, fontSize: pt['10'], flex: 1, marginRight: 6 }}>
                  Criminal capture · {cap(captureState)}
                </Text>
                {captureScore != null && (
                  <Pill tone="bad">{`${captureScore}%`}</Pill>
                )}
              </View>
              {captureDesc && (
                <EditableProse
                  name="defense.criminalCapture.description"
                  defaultValue={captureDesc}
                  lines={1}
                  style={{ ...type.body, fontSize: pt['9'] }}
                />
              )}
            </View>
          )}
          {d.criminalStructure && (
            <View
              wrap={false}
              style={{
                padding: 5,
                marginBottom: 4,
                backgroundColor: palette.card,
                borderWidth: 0.4,
                borderColor: palette.border,
                borderLeftWidth: 3,
                borderLeftColor: d.criminalStructure.color,
                borderRadius: 2,
              }}
            >
              <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.bad, marginBottom: 1 }}>
                CRIMINAL STRUCTURE · {d.criminalStructure.label}
              </Text>
              <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted, lineHeight: 1.35 }}>
                {d.criminalStructure.note}
              </Text>
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
              <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted, marginBottom: 2 }}>ACTIVE CRIMINAL OPERATIONS</Text>
              {d.criminalOps.map((op, i) => (
                <View
                  key={`cop-${i}`}
                  wrap={false}
                  style={{
                    marginBottom: 3,
                    padding: 4,
                    backgroundColor: palette.card,
                    borderWidth: 0.4,
                    borderColor: palette.border,
                    borderLeftWidth: 2,
                    borderLeftColor: palette.bad,
                    borderRadius: 2,
                  }}
                >
                  <Text style={{ ...type.body_em, fontSize: pt['9.5'], color: palette.bad, marginBottom: 1 }}>
                    {label(op)}
                  </Text>
                  {op?.note && (
                    <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted, lineHeight: 1.35 }}>
                      {op.note}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
          {d.criminalFaction && (
            <View style={{ padding: 5, border: `0.4pt solid ${palette.bad}`, borderRadius: 2, marginBottom: 4 }}>
              <Text style={{ ...type.body_em, fontSize: pt['10'], color: palette.bad }}>
                {d.criminalFaction.faction || d.criminalFaction.name}
              </Text>
              {d.criminalFaction.blurb && (
                <EditableProse
                  name="defense.criminalFaction.blurb"
                  defaultValue={d.criminalFaction.blurb}
                  lines={1}
                  style={{ ...type.body, fontSize: pt['9'] }}
                />
              )}
            </View>
          )}
          {d.orderHooks?.length > 0 && (
            <View>
              <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted }}>ORDER HOOKS</Text>
              {d.orderHooks.map((h, i) => (
                <View key={`oh-${i}`} style={{ flexDirection: 'row' }}>
                  <Text style={{ color: palette.bad, marginRight: 4, fontSize: pt['9'] }}>·</Text>
                  <EditableText
                    name={`defense.orderHook.${i}`}
                    defaultValue={hookText(h)}
                    style={{ ...type.body, fontSize: pt['9'] }}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── Supporting capabilities ───────────────────────────── */}
      {d.supportingCapabilities?.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            SUPPORTING CAPABILITIES
          </Text>
          {d.supportingCapabilities.map((sc, i) => (
            <View
              key={`sc-${i}`}
              wrap={false}
              style={{
                flexDirection: 'row',
                marginBottom: 3,
                padding: 4,
                backgroundColor: palette.card,
                borderWidth: 0.4,
                borderColor: palette.border,
                borderLeftWidth: 2,
                borderLeftColor: sc.color,
                borderRadius: 2,
                alignItems: 'flex-start',
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 1 }}>
                  <Text style={{ ...type.body_em, fontSize: pt['9'], color: palette.ink, marginRight: 5 }}>
                    {sc.label}
                  </Text>
                  <Text style={{ ...type.caption, fontSize: pt['8'], color: sc.color, fontWeight: 700 }}>
                    {sc.status}
                  </Text>
                </View>
                <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted, lineHeight: 1.35 }}>
                  {sc.note}
                </Text>
              </View>
              {sc.score != null && (
                <Text style={{ ...type.numeric, fontSize: pt['10'], color: sc.color, marginLeft: 6 }}>
                  {Math.round(sc.score)}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ── Vulnerabilities ───────────────────────────────────── */}
      {d.vulnerabilities?.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
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

export default DefenseSecurity;
