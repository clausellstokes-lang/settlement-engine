/**
 * EconomicsTrade — chapter 03. Full economy parity with EconomicsTab.
 *
 *   - 4 stat tiles: prosperity / complexity / output / trade access
 *   - Income sources bars
 *   - 3-column trade flows + entrepôt callout + necessity imports flag
 *   - Food security balance bar with full breakdown
 *   - Economic Flows (chains) with status badges + processing → outputs
 *   - Institutional services breakdown
 *   - Resource exploitation (full / partial / unexploited)
 *   - Shadow economy: capture rate + operations + criminal chains + crime types
 *   - Active economic issues with descriptions, priorities, suggested fixes
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, StatStrip, ThreeCol, BulletList, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { economicsHeadline, economicsTone } from '../lib/headlines.js';
import { StatusCard } from '../primitives/Visuals.jsx';
import { BarMeter } from '../primitives/BarMeter.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt, swatch } from '../theme.js';
import { cap, num, smart, label, hookText, finite, safePct } from '../lib/format.js';
import { flag } from '../../lib/flags.js';
import { SupplyChainFlow } from './SupplyChainFlow.jsx';

export function EconomicsTrade({ settlement, narrativeMode, vm }) {
  const e = vm.economics;

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="09"
        title="Economics & Trade"
        accent={narrativeMode ? palette.ai : palette.gold}
      />

      <ChapterHeadline tone={economicsTone(e)}>
        {economicsHeadline(e)}
      </ChapterHeadline>

      <StatStrip
        stats={[
          { label: 'PROSPERITY', value: cap(e.prosperity) || ', ' },
          { label: 'COMPLEXITY', value: cap(e.economicComplexity) || ', ' },
          { label: 'OUTPUT', value: smart(e.economyOutput) },
          { label: 'TRADE', value: cap(e.tradeAccess) || ', ' },
        ]}
      />

      {/* ── Income sources ─────────────────────────────────────── */}
      {e.incomeSources?.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            INCOME SOURCES
          </Text>
          {e.incomeSources.map((s, i) => (
            <View key={`inc-${i}`} style={{ marginBottom: 3 }} wrap={false}>
              <BarMeter
                label={cap(s.source || s.name || 'Source')}
                value={s.percentage || 0}
                sublabel={`${num(s.percentage || 0)}%`}
                tone={s.isCriminal ? 'bad' : 'gold'}
                height={3}
              />
              {s.desc && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginTop: -2, marginLeft: 6 }}>
                  {s.desc}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ── Trade flows ───────────────────────────────────────── */}
      {(e.primaryExports?.length > 0 || e.primaryImports?.length > 0 || e.localProduction?.length > 0) && (
        <>
      <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
        TRADE FLOWS
      </Text>
      <ThreeCol
        a={
          <View>
            <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.good }}>EXPORTS</Text>
            <BulletList
              items={e.primaryExports}
              tone="good"
              emptyText="None significant"
              itemRender={(item) => label(item)}
            />
          </View>
        }
        b={
          <View>
            <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.warn }}>IMPORTS</Text>
            <BulletList
              items={e.primaryImports}
              tone="warn"
              emptyText="None significant"
              itemRender={(item) => label(item)}
            />
          </View>
        }
        c={
          <View>
            <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted }}>LOCAL PRODUCTION</Text>
            <BulletList
              items={e.localProduction}
              tone="muted"
              emptyText="None recorded"
              itemRender={(item) => label(item)}
            />
          </View>
        }
      />
        </>
      )}

      {/* Entrepôt + necessity flags */}
      {(e.isEntrepot || e.necessityImports) && (
        <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, marginBottom: space.sm }}>
          {e.isEntrepot && <Tag tone="cool">ENTREPÔT</Tag>}
          {e.necessityImports && <Tag tone="bad">NECESSITY IMPORTS</Tag>}
        </View>
      )}

      {/* Critical trade dependencies */}
      {(e.tradeDependencies?.length > 0 || e.criticalImports?.length > 0) && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            CRITICAL DEPENDENCIES
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
            {[...(e.tradeDependencies || []), ...(e.criticalImports || [])].map((d, i) => (
              <Tag key={`dep-${i}`} tone="bad">{label(d)}</Tag>
            ))}
          </View>
        </View>
      )}

      {hasFoodData(e.foodBalance) && (
        <>
          <HairRule />
          {/* ── Food security ─────────────────────────────────────── */}
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            FOOD SECURITY
          </Text>
          <FoodBalanceBlock fb={e.foodBalance} />
        </>
      )}

      {/* ── Economic flows / chains ───────────────────────────── */}
      {e.chains?.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            ECONOMIC FLOWS · {e.chains.length} CHAIN{e.chains.length === 1 ? '' : 'S'}
          </Text>
          {flag('pdfVisualChains') ? (
            <SupplyChainFlow
              chains={settlement?.economicState?.activeChains}
              instNames={(settlement?.institutions || []).map((inst) => inst.name || '')}
              primaryExports={settlement?.economicState?.primaryExports || []}
              tier={settlement?.tier}
            />
          ) : e.chains.map((c, i) => (
            <StatusCard
              key={`ch-${i}`}
              compact
              name={c.name}
              status={c.status}
              statusLabel={cap(c.status)}
              meta={[
                c.processingInstitutions?.length ? { label: 'PROC', value: c.processingInstitutions.map(label).filter(Boolean).join(', ') } : null,
                c.outputs?.length ? { label: 'OUT', value: c.outputs.map(label).filter(Boolean).join(', ') } : null,
                c.dependency ? { label: 'DEP', value: depText(c.dependency) } : null,
                c.incomeContribution != null ? { label: 'INC', value: smart(c.incomeContribution) } : null,
              ].filter(b => b && b.value)}
              description={c.description || null}
              body={
                c.hooks?.length > 0 ? (
                  <View style={{ marginTop: 2 }}>
                    {c.hooks.map((h, hi) => (
                      <View key={`chk-${i}-${hi}`} style={{ flexDirection: 'row' }}>
                        <Text style={{ color: palette.gold, marginRight: 3, fontSize: pt['8'] }}>↳</Text>
                        <EditableText
                          name={`economics.chain.${i}.hook.${hi}`}
                          defaultValue={hookText(h)}
                          style={{ ...type.italic, fontSize: pt['8.5'], color: palette.second }}
                        />
                      </View>
                    ))}
                  </View>
                ) : null
              }
            />
          ))}
        </View>
      )}

      {/* ── Resource exploitation ─────────────────────────────── */}
      {e.resourceExploitation && (e.resourceExploitation.full?.length > 0 || e.resourceExploitation.partial?.length > 0 || e.resourceExploitation.unexploited?.length > 0) && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            RESOURCE EXPLOITATION
          </Text>
          <ThreeCol
            a={
              <View>
                <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.good }}>FULL</Text>
                <BulletList items={e.resourceExploitation.full} tone="good" emptyText="None" itemRender={label} />
              </View>
            }
            b={
              <View>
                <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.warn }}>PARTIAL</Text>
                <BulletList items={e.resourceExploitation.partial} tone="warn" emptyText="None" itemRender={label} />
              </View>
            }
            c={
              <View>
                <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted }}>UNEXPLOITED</Text>
                <BulletList items={e.resourceExploitation.unexploited} tone="muted" emptyText="None" itemRender={label} />
              </View>
            }
          />
        </View>
      )}

      {/* ── Shadow economy ─────────────────────────────────────── */}
      {(e.shadowEconomy.captureRate != null || e.shadowEconomy.operations?.length > 0 || e.shadowEconomy.crimeTypes?.length > 0) && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            SHADOW ECONOMY
          </Text>
          {e.shadowEconomy.captureRate != null && (
            <Text style={{ ...type.body, fontSize: pt['9'], color: palette.bad, marginBottom: 3 }}>
              Black market capture: <Text style={{ fontWeight: 700 }}>{smart(e.shadowEconomy.captureRate)}%</Text> of economy
            </Text>
          )}
          {e.shadowEconomy.crimeTypes?.length > 0 && (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginBottom: 4 }}>
              {e.shadowEconomy.crimeTypes.map((ct, i) => (
                <Tag key={`crm-${i}`} tone="bad">{label(ct)}</Tag>
              ))}
            </View>
          )}
          {e.shadowEconomy.operations?.length > 0 && (
            <View style={{ marginBottom: 4 }}>
              <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted }}>ECONOMIC OPERATIONS</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 2 }}>
                {e.shadowEconomy.operations.map((op, i) => (
                  <View
                    key={`op-${i}`}
                    style={{
                      backgroundColor: palette.badBg,
                      borderWidth: 0.4,
                      borderColor: palette.bad,
                      borderRadius: 3,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                    }}
                  >
                    <Text style={{ ...type.body_em, fontSize: pt['8.5'], color: palette.bad }}>
                      {label(op)}
                    </Text>
                    {op?.econ && (
                      <Text style={{ ...type.caption, fontSize: pt['7'], color: palette.muted }}>
                        {op.econ}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}
          {e.shadowEconomy.criminalChains?.length > 0 && (
            <View>
              <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted, marginTop: 2 }}>CRIMINAL SUPPLY CHAINS</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: 2 }}>
                {e.shadowEconomy.criminalChains.map((c, i) => (
                  <Tag key={`cc-${i}`} tone="bad">{label(c)}</Tag>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      {/* ── Economic issues + suggested fixes ─────────────────── */}
      {e.viabilityIssues?.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            ACTIVE ECONOMIC ISSUES
          </Text>
          {e.viabilityIssues.map((iss, i) => (
            <View key={`iss-${i}`} style={{ marginBottom: 4 }} wrap={false}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                {iss.severity && <Pill tone={severityTone(iss.severity)}>{iss.severity}</Pill>}
                <Text style={{ ...type.body_em, fontSize: pt['9'], color: palette.ink, marginLeft: 4, flex: 1 }}>
                  {iss.title}
                </Text>
                {iss.institution && (
                  <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
                    {iss.institution}
                  </Text>
                )}
              </View>
              {iss.description && (
                <EditableProse
                  name={`economics.issue.${i}.description`}
                  defaultValue={iss.description}
                  lines={1}
                  style={{ ...type.body, fontSize: pt['9'] }}
                />
              )}
              {iss.priorityNote && (
                <Text style={{ ...type.caption, color: palette.warn, fontSize: pt['8'], fontStyle: 'italic' }}>
                  {iss.priorityNote}
                </Text>
              )}
              {iss.suggestedFixes?.length > 0 && (
                <View style={{ marginTop: 1, marginLeft: 6 }}>
                  <Text style={{ ...type.label, color: palette.good, fontSize: pt['7'] }}>SUGGESTED FIXES</Text>
                  {iss.suggestedFixes.map((fix, fi) => (
                    <View key={`fix-${i}-${fi}`} style={{ flexDirection: 'row' }}>
                      <Text style={{ color: palette.good, marginRight: 3, fontSize: pt['8'] }}>+</Text>
                      <EditableText
                        name={`economics.issue.${i}.fix.${fi}`}
                        defaultValue={typeof fix === 'string' ? fix : (fix?.text || fix?.description || '')}
                        style={{ ...type.body, fontSize: pt['8.5'], flex: 1 }}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ── Hooks (compressed) ──────────────────────────────────── */}
      {(e.viabilityHooks?.length > 0 || e.safetyHooks?.length > 0) && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            ECONOMIC HOOKS
          </Text>
          {[...(e.viabilityHooks || []), ...(e.safetyHooks || [])].map((h, i) => (
            <View key={`eh-${i}`} style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={{ color: palette.gold, marginRight: 4, fontSize: pt['9'] }}>·</Text>
              <EditableText
                name={`economics.hook.${i}`}
                defaultValue={hookText(h)}
                style={{ ...type.body, fontSize: pt['9'] }}
              />
            </View>
          ))}
        </View>
      )}
    </PageChrome>
  );
}

function FoodBalanceBlock({ fb }) {
  if (!fb) return null;
  const prod = finite(fb.production, 0);
  const need = finite(fb.need, 0);
  // §1c — produced/needed are only meaningful if at least one is non-zero.
  // Both zero + a deficit/surplus means the engine didn't compute them; show
  // "Not calculated" rather than the misleading "PRODUCED 0 / NEEDED 0".
  const rawKnown = prod > 0 || need > 0;
  const max = Math.max(prod, need, 1);
  const prodPct = safePct((prod / max) * 100);
  const needPct = safePct((need / max) * 100);
  return (
    <View style={{ marginBottom: space.sm }} wrap={false}>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {rawKnown ? (<>
        <View style={{ flex: 1 }}>
          <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted }}>PRODUCED</Text>
          <View style={{ height: 5, backgroundColor: swatch['#F0E8D8'], borderRadius: 1, marginTop: 1 }}>
            <View style={{ width: `${prodPct}%`, height: '100%', backgroundColor: palette.good }} />
          </View>
          <Text style={{ ...type.caption, fontSize: pt['8'], marginTop: 1 }}>{smart(prod)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted }}>NEEDED</Text>
          <View style={{ height: 5, backgroundColor: swatch['#F0E8D8'], borderRadius: 1, marginTop: 1 }}>
            <View style={{ width: `${needPct}%`, height: '100%', backgroundColor: palette.bad }} />
          </View>
          <Text style={{ ...type.caption, fontSize: pt['8'], marginTop: 1 }}>{smart(need)}</Text>
        </View>
        </>) : (
        <View style={{ flex: 2 }}>
          <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted }}>PRODUCED / NEEDED</Text>
          <Text style={{ ...type.caption, fontSize: pt['9'], color: palette.muted, fontStyle: 'italic', marginTop: 2 }}>Not calculated</Text>
        </View>
        )}
        {fb.deficit > 0 && (
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.bad }}>DEFICIT</Text>
            <Text style={{ ...type.numeric, fontSize: pt['13'], color: palette.bad }}>{smart(fb.deficit)}</Text>
            {fb.coveragePct != null && (
              <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted }}>
                imports cover {fb.coveragePct}% of gap
              </Text>
            )}
          </View>
        )}
        {fb.surplus > 0 && (
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.good }}>SURPLUS</Text>
            <Text style={{ ...type.numeric, fontSize: pt['13'], color: palette.good }}>{smart(fb.surplus)}</Text>
          </View>
        )}
      </View>
      {(fb.agricultureModifier != null || fb.stressModifier != null) && (
        <Text style={{ ...type.caption, fontSize: pt['8'], color: palette.muted, marginTop: 3 }}>
          {fb.agricultureModifier != null && `Ag mod ${smart(fb.agricultureModifier)}  ·  `}
          {fb.stressModifier != null && `Stress mod ${smart(fb.stressModifier)}`}
        </Text>
      )}
      {fb.summary && (
        <EditableProse
          name="economics.foodBalance.summary"
          defaultValue={fb.summary}
          lines={1}
          style={{ ...type.italic, fontSize: pt['9'], color: palette.second, marginTop: 3 }}
        />
      )}
    </View>
  );
}

function severityTone(s) {
  const k = String(s || '').toLowerCase();
  if (k === 'critical' || k === 'high' || k === 'severe') return 'bad';
  if (k === 'medium' || k === 'moderate' || k === 'warning') return 'warn';
  return 'muted';
}

// foodBalance has data worth showing if any of production/need/deficit/surplus
// is non-zero. Empty engine output should not produce an empty section header.
function hasFoodData(fb) {
  if (!fb) return false;
  return [fb.production, fb.need, fb.deficit, fb.surplus]
    .some(n => n != null && Number(n) > 0);
}

// Chain dependency may be a string ("imports/iron") or an object
// ({ resource, type, critical }) — coerce to a presentable string.
function depText(d) {
  if (!d) return '';
  if (typeof d === 'string') return d;
  if (typeof d === 'object') {
    const parts = [];
    if (d.resource) parts.push(label(d.resource));
    else if (d.name) parts.push(label(d.name));
    else if (d.type) parts.push(label(d.type));
    if (d.scope) parts.push(`(${d.scope})`);
    if (d.critical) parts.push('critical');
    return parts.filter(Boolean).join(' ');
  }
  return String(d);
}

export default EconomicsTrade;
