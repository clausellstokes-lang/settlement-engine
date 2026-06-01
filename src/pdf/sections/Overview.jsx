/**
 * Overview — chapter 01. Systems Health Dashboard + crises + situation.
 *
 * Dense, character-sheet style. Mirrors OverviewTab.jsx with full parity:
 *   - Identity strip
 *   - Active crises (chips + per-crisis hook + summary)
 *   - Systems Health Dashboard (5 score bars, prosperity/safety, food)
 *   - Tensions & Conflicts list with descriptions and parties
 *   - Situation prose (arrival scene + pressure sentence in AI mode)
 *   - Settlement origin
 *   - Prominent relationship
 *   - Geography (terrainAdvantages, terrainCriticals, nearbyResources)
 *   - Spatial Layout (quarters with descriptions and landmarks)
 *   - Warnings & coherence notes
 *   - Institutions panel with category distribution + counts
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, StatStrip, ThreeCol, BulletList, HairRule,
} from '../primitives/Dense.jsx';
import { overviewHeadline, overviewTone } from '../lib/headlines.js';
import { StackedBar } from '../primitives/Visuals.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { BarMeter } from '../primitives/BarMeter.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { type, palette, space, pt, swatch } from '../theme.js';
import { cap, smart, label, hookText, finite, safePct, humanize } from '../lib/format.js';

export function Overview({ settlement, narrativeMode, vm }) {
  const o = vm.overview;
  const id = vm.identity;

  const populationFmt = id.population ? id.population.toLocaleString() : '—';
  const ageFmt = id.age ? `${id.age} yr${id.age === 1 ? '' : 's'}` : '—';

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="01"
        title="Overview"
        accent={narrativeMode ? palette.ai : palette.gold}
      />

      <ChapterHeadline tone={overviewTone(o)}>
        {overviewHeadline(o, id)}
      </ChapterHeadline>

      {/* ── Thesis (AI mode only) ─────────────────────────────────── */}
      {o.thesis && (
        <Callout tone="ai" kicker="THESIS">
          <Text style={{ ...type.italic, color: palette.ink, fontSize: pt['10.5'] }}>
            {o.thesis}
          </Text>
        </Callout>
      )}

      {/* ── Identity strip ───────────────────────────────────────── */}
      <StatStrip
        stats={[
          { label: 'POPULATION', value: populationFmt, sublabel: id.tier },
          { label: 'AGE',        value: ageFmt, sublabel: id.terrain },
          { label: 'PROSPERITY', value: cap(o.prosperity) || '—', tone: o.prosperityTone },
          { label: 'SAFETY',     value: cap(o.safety) || '—', tone: o.safetyTone },
          { label: 'STABILITY',  value: cap(o.stability) || '—' },
        ]}
      />

      {/* ── Active crises ─────────────────────────────────────────── */}
      {o.stress.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['8'], marginBottom: 3 }}>
            ACTIVE CRISES
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 3 }}>
            {o.stress.map((s, i) => (
              <Pill key={`p-${i}`} tone="bad">{s.label || s.icon || 'Crisis'}</Pill>
            ))}
          </View>
          {o.stress.filter(s => s.summary || s.hook).map((s, i) => (
            <View key={`s-${i}`} style={{ marginBottom: 3 }} wrap={false}>
              {s.summary && (
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ ...type.body_em, color: palette.bad, fontSize: pt['9'], marginRight: 4 }}>
                    {s.label}:
                  </Text>
                  <Text style={{ ...type.body, fontSize: pt['9'], flex: 1 }}>{s.summary}</Text>
                </View>
              )}
              {s.hook && (
                <View style={{ flexDirection: 'row', marginTop: 1 }}>
                  <Text style={{ color: palette.bad, marginRight: 4, fontSize: pt['9'] }}>↳</Text>
                  <Text style={{ ...type.italic, color: palette.second, fontSize: pt['9'], flex: 1 }}>
                    {hookText(s.hook)}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ── Systems Health Dashboard ─────────────────────────────── */}
      {hasSystemsHealth(o) && (
        <>
      <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3, marginTop: 4 }}>
        SYSTEMS HEALTH
      </Text>
      <View style={{ flexDirection: 'row', gap: space.md }}>
        <View style={{ flex: 1 }}>
          {/* defense score bars — only render numeric entries (engine may
              include object-shaped fields like magicDependency that aren't
              0-100 scores) */}
          {Object.entries(o.defenseScores || {})
            .map(([key, val]) => [key, scoreNum(val)])
            .filter(([, n]) => n != null)
            .map(([key, n]) => (
              <BarMeter
                key={`def-${key}`}
                label={cap(humanizeKey(key))}
                value={n}
                sublabel={`${Math.round(n)}/100`}
                tone={toneForScore(n)}
                height={4}
              />
            ))}
        </View>
        <View style={{ flex: 1 }}>
          {/* Enforcement ratio + food balance bar */}
          {o.safetyRatio != null && (
            <View style={{ marginBottom: 6 }}>
              <Text style={{ ...type.label, fontSize: pt['8'], color: palette.ink }}>Enforcement ratio</Text>
              <Text style={{ ...type.body, fontSize: pt['9'], color: palette.second }}>
                {smart(o.safetyRatio)} watch:pop
              </Text>
            </View>
          )}
          {o.foodBalance && (o.foodBalance.production != null || o.foodBalance.deficit != null) && (
            <View style={{ marginBottom: 6 }}>
              <FoodBalanceBar fb={o.foodBalance} />
            </View>
          )}
          {o.viabilityVerdict && (
            <View>
              <Text style={{ ...type.label, fontSize: pt['8'], color: palette.ink }}>Viability</Text>
              <Text style={{ ...type.body, fontSize: pt['9'], color: palette[verdictTone(o.viabilityVerdict)] || palette.muted }}>
                {cap(o.viabilityVerdict)}
              </Text>
            </View>
          )}
        </View>
      </View>
        </>
      )}

      {/* ── Tensions & Conflicts ──────────────────────────────────── */}
      {(o.tensions.length > 0 || o.conflicts.length > 0) && (
        <View style={{ marginTop: space.sm }}>
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            TENSIONS & CONFLICTS
          </Text>
          {o.tensions.map((t, i) => (
            <View
              key={`t-${i}`}
              style={{
                marginBottom: 5,
                paddingLeft: 6,
                borderLeft: `2pt solid ${palette.warn}`,
                paddingTop: 1,
                paddingBottom: 2,
              }}
              wrap={false}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
                {t.severity && <Pill tone={severityTone(t.severity)}>{humanize(t.severity)}</Pill>}
                <Text
                  style={{
                    ...type.body_em,
                    fontSize: pt['9.5'],
                    color: palette.ink,
                    marginLeft: t.severity ? 6 : 0,
                    flex: 1,
                  }}
                >
                  {humanize(t.label || t.type || 'Tension')}
                </Text>
              </View>
              {t.description && (
                <Text style={{ ...type.body, fontSize: pt['9'], marginTop: 1 }}>
                  {t.description}
                </Text>
              )}
              {t.parties?.length > 0 && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginTop: 1 }}>
                  {t.parties.map(label).filter(Boolean).join(' / ')}
                </Text>
              )}
              {t.hooks?.length > 0 && (
                <View style={{ marginTop: 2 }}>
                  {t.hooks.slice(0, 3).map((h, hi) => (
                    <View key={`th-${i}-${hi}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
                      <Text style={{ color: palette.warn, marginRight: 4, fontSize: pt['8.5'] }}>↳</Text>
                      <Text style={{ ...type.italic, color: palette.second, fontSize: pt['8.5'], flex: 1 }}>
                        {hookText(h)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
          {o.conflicts.map((c, i) => (
            <View
              key={`c-${i}`}
              style={{
                marginBottom: 5,
                paddingLeft: 6,
                borderLeft: `2pt solid ${palette.bad}`,
                paddingTop: 1,
                paddingBottom: 2,
              }}
              wrap={false}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {c.intensity && <Pill tone={severityTone(c.intensity)}>{humanize(c.intensity)}</Pill>}
                <Text
                  style={{
                    ...type.body_em,
                    fontSize: pt['9.5'],
                    color: palette.ink,
                    marginLeft: c.intensity ? 6 : 0,
                    flex: 1,
                  }}
                >
                  {Array.isArray(c.parties) ? c.parties.map(label).filter(Boolean).join(' vs ') : 'Conflict'}
                </Text>
              </View>
              {c.issue && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginTop: 1 }}>
                  <Text style={{ color: palette.faint }}>Issue: </Text>
                  {c.issue}
                </Text>
              )}
              {c.description && (
                <Text style={{ ...type.body, fontSize: pt['9'], marginTop: 1 }}>
                  {c.description}
                </Text>
              )}
              {c.stakes && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], fontStyle: 'italic', marginTop: 1 }}>
                  Stakes: {c.stakes}
                </Text>
              )}
              {c.hooks?.length > 0 && (
                <View style={{ marginTop: 2 }}>
                  {c.hooks.slice(0, 3).map((h, hi) => (
                    <View key={`ch-${i}-${hi}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
                      <Text style={{ color: palette.bad, marginRight: 4, fontSize: pt['8.5'] }}>↳</Text>
                      <Text style={{ ...type.italic, color: palette.second, fontSize: pt['8.5'], flex: 1 }}>
                        {hookText(h)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ── Character / origin ────────────────────────────────────── */}
      {(o.character || o.history?.foundedBy || o.history?.origin) && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            CHARACTER & ORIGIN
          </Text>
          {o.character && (
            <Text style={{ ...type.prose, fontSize: pt['9.5'] }}>
              {o.character}
            </Text>
          )}
          {o.settlementReason && (
            <Text style={{ ...type.body, marginTop: 3, fontSize: pt['9'] }}>
              <Text style={{ color: palette.muted }}>Reason settled: </Text>
              {o.settlementReason}
            </Text>
          )}
        </View>
      )}

      {/* ── Prominent relationship ────────────────────────────────── */}
      {o.prominentRelationship && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.cool, fontSize: pt['8'], marginBottom: 3 }}>
            NOTABLE CONNECTION
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
            <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'], marginRight: 4 }}>
              {label(o.prominentRelationship.otherSettlement) || 'Neighbour'}
            </Text>
            <Pill tone="cool">{cap(o.prominentRelationship.relationshipType || o.prominentRelationship.type) || 'linked'}</Pill>
          </View>
          {o.prominentRelationship.description && (
            <Text style={{ ...type.body, fontSize: pt['9'] }}>
              {o.prominentRelationship.description}
            </Text>
          )}
        </View>
      )}

      {/* ── Geography ─────────────────────────────────────────────── */}
      {(o.geography?.terrainAdvantages?.length > 0 || o.geography?.terrainCriticals?.length > 0 || o.geography?.nearbyResources?.length > 0) && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.good, fontSize: pt['8'], marginBottom: 3 }}>
            GEOGRAPHY & RESOURCES
          </Text>
          <ThreeCol
            a={
              <View>
                <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted }}>ADVANTAGES</Text>
                <BulletList
                  items={o.geography.terrainAdvantages}
                  tone="good"
                  emptyText="None"
                  itemRender={(it) => label(it)}
                />
              </View>
            }
            b={
              <View>
                <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.bad }}>CRITICALS</Text>
                <BulletList
                  items={o.geography.terrainCriticals}
                  tone="bad"
                  emptyText="None"
                  itemRender={(it) => label(it)}
                />
              </View>
            }
            c={
              <View>
                <Text style={{ ...type.label, fontSize: pt['7.5'], color: palette.muted }}>NEARBY</Text>
                <BulletList
                  items={o.geography.nearbyResources?.slice(0, 6) || []}
                  tone="muted"
                  emptyText="None recorded"
                  itemRender={(it) => label(it)}
                />
              </View>
            }
          />
        </View>
      )}

      {/* ── Spatial layout: quarters ─────────────────────────────── */}
      {o.quarters?.length > 0 && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            QUARTERS
          </Text>
          {o.quarters.map((q, i) => (
            <View key={`q-${i}`} style={{ marginBottom: 4 }} wrap={false}>
              <Text style={{ ...type.body_em, fontSize: pt['9.5'], color: palette.ink }}>{q.name}</Text>
              {q.description && (
                <Text style={{ ...type.body, fontSize: pt['9'] }}>
                  {q.description}
                </Text>
              )}
              {q.landmarks?.length > 0 && (
                <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'] }}>
                  Landmarks: {q.landmarks.map(l => label(l)).filter(Boolean).join(', ')}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* ── Warnings ───────────────────────────────────────────── */}
      {(o.warnings?.length > 0 || o.coherenceNotes?.length > 0 || o.structuralSuggestions?.length > 0) && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            WARNINGS & NOTES
          </Text>
          <BulletList
            items={[
              ...(o.warnings || []),
              ...(o.coherenceNotes || []),
              ...(o.structuralSuggestions || []),
            ]}
            tone="warn"
            emptyText="None"
            itemRender={(it) => label(it) || (typeof it === 'string' ? it : '')}
          />
        </View>
      )}

      {/* ── Institutions snapshot ─────────────────────────────── */}
      {o.categoryDistribution?.length > 0 && (
        <View style={{ marginTop: space.sm }} wrap={false}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            INSTITUTIONS · {o.institutionsCount} TOTAL
          </Text>
          <StackedBar
            segments={o.categoryDistribution.map(c => ({
              name: c.category,
              value: c.count,
              category: c.category,
            }))}
            height={6}
            showLabels
          />
        </View>
      )}
    </PageChrome>
  );
}

// ── helpers ─────────────────────────────────────────────────────────────────

function toneForScore(v) {
  if (v == null) return 'muted';
  if (v >= 70) return 'good';
  if (v >= 40) return 'warn';
  return 'bad';
}

// Systems-health block has data if there's at least one numeric defense score
// or any of the side-bar fields (enforcement ratio, food balance, viability).
function hasSystemsHealth(o) {
  if (!o) return false;
  const anyScore = Object.values(o.defenseScores || {}).some(v => {
    if (typeof v === 'number') return Number.isFinite(v);
    if (v && typeof v === 'object') {
      return [v.score, v.value, v.level, v.rating].some(n => typeof n === 'number' && Number.isFinite(n));
    }
    return false;
  });
  return anyScore
    || o.safetyRatio != null
    || o.viabilityVerdict
    || (o.foodBalance && (o.foodBalance.production != null || o.foodBalance.deficit != null));
}

// Defense scores may arrive as numbers or as { score, value, level, ... }
// objects (the engine sometimes wraps a score with extra metadata). Extract
// the numeric value or return null for things that aren't really scores
// (booleans, strings, etc.).
function scoreNum(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (v && typeof v === 'object') {
    const candidates = [v.score, v.value, v.level, v.rating];
    for (const c of candidates) {
      if (typeof c === 'number' && Number.isFinite(c)) return c;
    }
    return null;
  }
  return null;
}

// camelCase → "Camel Case"
function humanizeKey(k) {
  if (!k || typeof k !== 'string') return String(k || '');
  return k
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase();
}

function severityTone(s) {
  const k = String(s || '').toLowerCase();
  if (k === 'critical' || k === 'high' || k === 'severe') return 'bad';
  if (k === 'medium' || k === 'moderate' || k === 'warning') return 'warn';
  if (k === 'low' || k === 'mild') return 'muted';
  return 'muted';
}

function verdictTone(v) {
  const k = String(v || '').toLowerCase();
  if (k === 'viable' || k === 'coherent') return 'good';
  if (k === 'marginal') return 'warn';
  if (k === 'notviable' || k === 'notcoherent') return 'bad';
  return 'muted';
}

function FoodBalanceBar({ fb }) {
  const prod = finite(fb?.production, 0);
  const need = finite(fb?.need, 0);
  const max = Math.max(prod, need, 1);
  const prodPct = safePct((prod / max) * 100);
  const needPct = safePct((need / max) * 100);
  return (
    <View>
      <Text style={{ ...type.label, fontSize: pt['8'], color: palette.ink }}>Food balance</Text>
      <View style={{ marginTop: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 1 }}>
          <Text style={{ ...type.caption, fontSize: pt['7.5'], width: 40 }}>Produced</Text>
          <View style={{ flex: 1, height: 4, backgroundColor: swatch['#F0E8D8'], borderRadius: 1 }}>
            <View style={{ width: `${prodPct}%`, height: '100%', backgroundColor: palette.good }} />
          </View>
          <Text style={{ ...type.caption, fontSize: pt['7.5'], marginLeft: 4 }}>{smart(prod)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ ...type.caption, fontSize: pt['7.5'], width: 40 }}>Needed</Text>
          <View style={{ flex: 1, height: 4, backgroundColor: swatch['#F0E8D8'], borderRadius: 1 }}>
            <View style={{ width: `${needPct}%`, height: '100%', backgroundColor: palette.bad }} />
          </View>
          <Text style={{ ...type.caption, fontSize: pt['7.5'], marginLeft: 4 }}>{smart(need)}</Text>
        </View>
      </View>
      {fb?.deficit > 0 && (
        <Text style={{ ...type.caption, color: palette.bad, fontSize: pt['8'], marginTop: 1 }}>
          Deficit: {smart(fb.deficit)}
          {fb.importCoverage != null ? ` · imports cover ${smart(fb.importCoverage)}%` : ''}
        </Text>
      )}
      {fb?.surplus > 0 && (
        <Text style={{ ...type.caption, color: palette.good, fontSize: pt['8'], marginTop: 1 }}>
          Surplus: {smart(fb.surplus)}
        </Text>
      )}
    </View>
  );
}

export default Overview;
