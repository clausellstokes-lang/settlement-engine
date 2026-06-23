/**
 * ResourcesProduction — chapter 07. Strategic terrain footprint, raw resource
 * chain flows, nearby resource catalogue with depletion status, imports,
 * export potential, terrain effects, and gaps/opportunities.
 *
 * Editable fields:
 *   - resources.strategicValue
 *   - resources.export.<i>.reason
 *   - resources.terrainEffect.<i>.effect
 *   - resources.priorityNote.<i>
 *   - resources.gap.<i>.impact
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { resourcesHeadline } from '../lib/headlines.js';
import { ChainRow } from '../primitives/Visuals.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt, swatch, factionColors } from '../theme.js';
import { cap, label, humanize } from '../lib/format.js';

const _STATUS_TONE = { full: 'good', partial: 'warn', unexploited: 'bad' };
const VALUE_TONE  = { 'very high': 'good', high: 'good', medium: 'warn', low: 'muted' };
const SEVERITY_TONE = { high: 'bad', medium: 'warn', low: 'muted' };

export function ResourcesProduction({ settlement, narrativeMode, vm }) {
  const r = vm.resources;

  // Group chain rows by status for sectioning
  const fullRows      = r.chainRows.filter(c => c.status === 'full');
  const partialRows   = r.chainRows.filter(c => c.status === 'partial');
  const unexpRows     = r.chainRows.filter(c => c.status === 'unexploited');

  const importsCritical    = r.imports?.critical || [];
  const importsRecommended = r.imports?.recommended || [];

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="10"
        title="Resources & Production"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={r.terrain ? cap(r.terrain) : null}
      />

      <ChapterHeadline tone="gold">
        {/* resourcesHeadline reads exportPotential + nearbyDepleted; the old
            `primaryImports` key was never consulted, so the depleted-resources
            clause silently dropped. Pass the keys the function actually expects. */}
        {resourcesHeadline({ exportPotential: r.exportPotential, nearbyDepleted: r.nearbyDepleted })}
      </ChapterHeadline>

      {/* ── Strategic value ────────────────────────────────────── */}
      {r.strategicValue && (
        <Callout tone="gold" kicker="STRATEGIC VALUE">
          <EditableProse
            name="resources.strategicValue"
            defaultValue={r.strategicValue}
            lines={2}
            style={{ ...type.body, fontSize: pt['9.5'] }}
          />
        </Callout>
      )}

      {/* ── Terrain advantages / criticals ─────────────────────── */}
      {(r.terrainAdvantages?.length > 0 || r.terrainCriticals?.length > 0) && (
        <View style={{ flexDirection: 'row', gap: space.md, marginBottom: space.sm }}>
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.good, marginBottom: 2 }}>
              TERRAIN ADVANTAGES
            </Text>
            {r.terrainAdvantages?.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                {r.terrainAdvantages.map((t, i) => (
                  <Tag key={`adv-${i}`} tone="good">{label(t)}</Tag>
                ))}
              </View>
            ) : (
              <Text style={{ ...type.caption, color: palette.faint, fontStyle: 'italic', fontSize: pt['8'] }}>
                none noted
              </Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.bad, marginBottom: 2 }}>
              TERRAIN CRITICALS
            </Text>
            {r.terrainCriticals?.length > 0 ? (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                {r.terrainCriticals.map((t, i) => (
                  <Tag key={`crit-${i}`} tone="bad">{label(t)}</Tag>
                ))}
              </View>
            ) : (
              <Text style={{ ...type.caption, color: palette.faint, fontStyle: 'italic', fontSize: pt['8'] }}>
                none noted
              </Text>
            )}
          </View>
        </View>
      )}

      {/* ── Economic strengths ─────────────────────────────────── */}
      {r.economicStrengths.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.good, fontSize: pt['8'], marginBottom: 3 }}>
            ECONOMIC STRENGTHS
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {r.economicStrengths.map((s, i) => (
              <Pill key={`es-${i}`} tone="good">{label(s)}</Pill>
            ))}
          </View>
        </View>
      )}

      {/* ── Chain flows ────────────────────────────────────────── */}
      {r.chainRows.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            RESOURCE CHAINS
          </Text>
          {fullRows.length > 0 && (
            <ChainGroup title="Fully Exploited" tone="good" rows={fullRows} />
          )}
          {partialRows.length > 0 && (
            <ChainGroup title="Partially Exploited" tone="warn" rows={partialRows} />
          )}
          {unexpRows.length > 0 && (
            <ChainGroup title="Unexploited" tone="bad" rows={unexpRows} />
          )}
        </View>
      )}

      {/* ── Nearby resources ───────────────────────────────────── */}
      {(r.nearbyAbundant?.length > 0 || r.nearbyDepleted?.length > 0 || r.availableCommodities?.length > 0) && (
        <View style={{ marginBottom: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            NEARBY RESOURCES
          </Text>
          {r.nearbyDepleted?.length > 0 && (
            <ResourceRow
              kicker="DEPLETED"
              hint="consumed locally · export potential reduced"
              tone="bad"
              items={r.nearbyDepleted}
              customNames={r.nearbyCustom}
            />
          )}
          {r.nearbyAbundant?.length > 0 && (
            <ResourceRow
              kicker="ABUNDANT"
              hint="full export potential"
              tone="good"
              items={r.nearbyAbundant}
              customNames={r.nearbyCustom}
            />
          )}
          {r.availableCommodities?.length > 0 && (
            <ResourceRow
              kicker="COMMODITIES AVAILABLE"
              hint="processed/refined in this settlement"
              tone="muted"
              items={r.availableCommodities}
            />
          )}
        </View>
      )}

      {/* ── Imports ────────────────────────────────────────────── */}
      {(importsCritical.length > 0 || importsRecommended.length > 0) && (
        <View style={{ marginBottom: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            IMPORT DEPENDENCIES
          </Text>
          {importsCritical.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.bad, marginBottom: 2 }}>
                CRITICAL
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                {importsCritical.map((imp, i) => (
                  <Tag key={`ci-${i}`} tone="bad">{label(imp)}</Tag>
                ))}
              </View>
            </View>
          )}
          {importsRecommended.length > 0 && (
            <View>
              <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted, marginBottom: 2 }}>
                RECOMMENDED
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
                {importsRecommended.map((imp, i) => (
                  <Tag key={`ri-${i}`} tone="muted">{label(imp)}</Tag>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* ── Export potential ──────────────────────────────────── */}
      {r.exportPotential?.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.good, fontSize: pt['8'], marginBottom: 3 }}>
            EXPORT POTENTIAL
          </Text>
          {[...r.exportPotential]
            .sort((a, b) => orderRank(b?.value) - orderRank(a?.value))
            .map((e, i) => {
              const v = (e?.value || 'medium').toLowerCase();
              const tone = VALUE_TONE[v] || 'muted';
              return (
                <View
                  key={`exp-${i}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    paddingVertical: 3,
                    borderBottom: `0.3pt solid ${palette.border}`,
                  }}
                  wrap={false}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                      <Text style={{ ...type.body_em, fontSize: pt['9.5'], color: palette.ink, flex: 1 }}>
                        {humanize(e?.product || e?.good || e?.name) || '–'}
                      </Text>
                      <Tag tone={tone}>{cap(e?.value || 'Medium')}</Tag>
                    </View>
                    {(e?.reason || e?.note) && (
                      <EditableText
                        name={`resources.export.${i}.reason`}
                        defaultValue={e?.reason || e?.note || ''}
                        style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}
                      />
                    )}
                  </View>
                </View>
              );
            })}
        </View>
      )}

      {/* ── Terrain effects ───────────────────────────────────── */}
      {r.terrainEffects?.length > 0 && (
        <View style={{ marginBottom: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.cool, fontSize: pt['8'], marginBottom: 3 }}>
            TERRAIN EFFECTS
          </Text>
          {r.terrainEffects.map((te, i) => {
            const feature = typeof te === 'object' ? (te?.feature || te?.terrain || te?.name) : null;
            const effect  = typeof te === 'object' ? (te?.effect || te?.description) : String(te);
            return (
              <View
                key={`te-${i}`}
                style={{ flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 2 }}
              >
                {feature && (
                  <Text style={{ ...type.body_em, fontSize: pt['9'], color: palette.cool, width: 90 }}>
                    {humanize(feature)}
                  </Text>
                )}
                <View style={{ flex: 1 }}>
                  <EditableText
                    name={`resources.terrainEffect.${i}.effect`}
                    defaultValue={effect || ''}
                    style={{ ...type.body, fontSize: pt['9'] }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* ── Gaps & opportunities ──────────────────────────────── */}
      {(r.priorityNotes?.length > 0 || r.structuralGaps?.length > 0) && (
        <View>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            GAPS & OPPORTUNITIES
          </Text>
          {r.priorityNotes?.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              {r.priorityNotes.map((note, i) => (
                <View
                  key={`pn-${i}`}
                  style={{
                    flexDirection: 'row',
                    marginBottom: 2,
                    padding: 4,
                    backgroundColor: swatch['#F8F4FD'],
                    borderLeft: `2pt solid #5a2a8a`,
                    borderRadius: 1,
                  }}
                  wrap={false}
                >
                  <Text style={{ color: factionColors.magic, marginRight: 4, fontSize: pt['9'] }}>✦</Text>
                  <View style={{ flex: 1 }}>
                    <EditableText
                      name={`resources.priorityNote.${i}`}
                      defaultValue={typeof note === 'string' ? note : (note?.text || label(note))}
                      style={{ ...type.body, fontSize: pt['9'] }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
          {r.structuralGaps?.length > 0 && (
            <View>
              {r.structuralGaps.map((g, i) => {
                const isObj    = typeof g === 'object';
                const chain    = isObj ? g?.chain : null;
                const severity = isObj ? (g?.severity || 'low') : 'low';
                const tone     = SEVERITY_TONE[severity] || 'muted';
                const impact   = isObj
                  ? (g?.impact || (g?.missing || []).map(humanize).join(', '))
                  : String(g);
                return (
                  <View
                    key={`gap-${i}`}
                    style={{
                      flexDirection: 'row',
                      marginBottom: 2,
                      padding: 4,
                      borderLeft: `2pt solid ${palette[tone] || palette.muted}`,
                      borderRadius: 1,
                      backgroundColor: palette.card,
                    }}
                    wrap={false}
                  >
                    <Tag tone={tone}>{cap(severity)}</Tag>
                    <View style={{ flex: 1, marginLeft: 4 }}>
                      {chain && (
                        <Text style={{ ...type.body_em, fontSize: pt['9'], color: palette.ink }}>
                          {humanize(chain)}
                        </Text>
                      )}
                      <EditableText
                        name={`resources.gap.${i}.impact`}
                        defaultValue={impact || ''}
                        style={{ ...type.body, fontSize: pt['9'] }}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      )}
    </PageChrome>
  );
}

function ChainGroup({ title, tone, rows }) {
  return (
    <View style={{ marginBottom: 4 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          marginBottom: 1,
        }}
      >
        <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette[tone] || palette.muted }}>
          {title.toUpperCase()}
        </Text>
        <Text style={{ ...type.caption, color: palette.faint, marginLeft: 4, fontSize: pt['7.5'] }}>
          {rows.length}
        </Text>
      </View>
      {rows.map((c, i) => (
        <ChainRow
          key={`c-${title}-${i}`}
          resource={humanize(c.resource)}
          processing={c.processing ? humanize(c.processing) : null}
          output={c.output ? humanize(c.output) : null}
          status={c.chainStatus || c.status}
          tone={tone}
        />
      ))}
    </View>
  );
}

function ResourceRow({ kicker, hint, tone, items, customNames = [] }) {
  const customSet = new Set(customNames);
  return (
    <View style={{ marginBottom: 4 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 1 }}>
        <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette[tone] || palette.muted }}>
          {kicker}
        </Text>
        {hint && (
          <Text style={{ ...type.caption, fontSize: pt['7.5'], color: palette.faint, marginLeft: 5 }}>
            · {hint}
          </Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
        {items.map((it, i) => {
          // §14 — custom resources render gold with a ✦ marker.
          if (customSet.has(it)) {
            return (
              <View
                key={`r-${kicker}-${i}`}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: palette.goldBg,
                  border: `0.5pt solid ${palette.gold}`,
                  borderRadius: 2, paddingHorizontal: 5, paddingVertical: 1,
                  marginRight: 3, marginBottom: 2,
                }}
              >
                <Text style={{ ...type.pill, fontSize: pt['8'], color: palette.gold }}>{humanize(label(it))}</Text>
                <Text style={{ fontSize: pt['7.5'], color: palette.gold, marginLeft: 3 }}>✦</Text>
              </View>
            );
          }
          return <Tag key={`r-${kicker}-${i}`} tone={tone}>{humanize(label(it))}</Tag>;
        })}
      </View>
    </View>
  );
}

function orderRank(v) {
  const k = (v || 'medium').toLowerCase();
  if (k === 'very high') return 4;
  if (k === 'high') return 3;
  if (k === 'medium') return 2;
  return 1;
}

export default ResourcesProduction;
