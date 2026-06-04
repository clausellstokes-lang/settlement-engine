/**
 * IdentityDailyLife - chapter 02. Three-band layout:
 *   1. Anchor facts panel - mirror DailyLifeTab anchor (governing, prosperity,
 *      safety, food, magic, stress).
 *   2. Identity rows - name/tier/population/race/terrain/layout/age/gov/founded.
 *   3. Quarters - name + description (editable) + landmarks list.
 *   4. Daily Life - five AI passages (Dawn→Night) editable, or food balance
 *      fallback when AI prose is missing.
 *
 * Editable fields:
 *   - identity.quarter.<i>.description
 *   - identity.quarter.<i>.landmark.<j>
 *   - daily.<time>
 *   - daily.cultureNotes
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, KeyValRow, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt } from '../theme.js';
import { smart, humanize, num } from '../lib/format.js';

export function IdentityDailyLife({ settlement, narrativeMode, vm }) {
  const id = vm.identity;
  const d = vm.daily;
  const a = id.anchor || {};
  const accent = narrativeMode ? palette.ai : palette.gold;

  const idRows = [
    { label: 'Name',          value: id.name },
    { label: 'Tier',          value: id.tier || '-' },
    { label: 'Population',    value: id.population ? id.population.toLocaleString() : '-' },
    id.dominantRace   ? { label: 'Dominant Race', value: humanize(id.dominantRace) } : null,
    id.terrain        ? { label: 'Terrain',       value: humanize(id.terrain) } : null,
    id.layout         ? { label: 'Layout',        value: humanize(id.layout) } : null,
    id.age != null    ? { label: 'Age',           value: `${id.age} years` } : null,
    id.governmentType ? { label: 'Government',    value: humanize(id.governmentType) } : null,
    id.tradeAccess    ? { label: 'Trade Access',  value: humanize(id.tradeAccess) } : null,
    id.founding       ? { label: 'Founded',       value: foundingLabel(id.founding) } : null,
  ].filter(Boolean);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="07"
        title="Identity & Daily Life"
        accent={accent}
        sub={id.tier || null}
      />

      {/* ── Anchor facts ─────────────────────────────────────── */}
      {(a.governingName || a.prosperity || a.safety || a.foodDeficit != null ||
        a.foodSurplus != null || a.magicDependency || a.activeStress?.length > 0) && (
        <View
          style={{
            marginBottom: space.sm,
            padding: 6,
            backgroundColor: palette.card,
            border: `0.4pt solid ${palette.border}`,
            borderRadius: 2,
          }}
        >
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            ANCHOR FACTS
          </Text>
          <KeyValRow
            pairs={[
              a.governingName    ? { label: 'GOVERNING',  value: humanize(a.governingName) } : null,
              a.prosperity       ? { label: 'PROSPERITY', value: humanize(a.prosperity) } : null,
              a.complexity       ? { label: 'COMPLEXITY', value: humanize(a.complexity) } : null,
              a.safety           ? { label: 'SAFETY',     value: humanize(a.safety) } : null,
            ].filter(Boolean)}
          />
          <KeyValRow
            pairs={[
              a.foodDeficit > 0
                ? { label: 'FOOD',  value: `−${num(a.foodDeficit)} units` }
                : a.foodSurplus != null
                  ? { label: 'FOOD',  value: `+${num(a.foodSurplus)} units` }
                  : null,
              a.defenseLabel     ? { label: 'DEFENSE',   value: humanize(a.defenseLabel) } : null,
              a.defenseScoreAvg != null ? { label: 'SCORE AVG', value: smart(a.defenseScoreAvg) } : null,
              a.magicalCapability ? { label: 'MAGIC', value: humanize(a.magicalCapability) } : null,
            ].filter(Boolean)}
          />
          {a.magicDependency && (
            <View style={{ marginTop: 3 }}>
              <Tag tone="ai">Magic-dependent</Tag>
            </View>
          )}
          {a.activeStress?.length > 0 && (
            <View style={{ marginTop: 3, flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
              {a.activeStress.map((s, i) => (
                <Tag key={`as-${i}`} tone="bad">{humanize(String(s))}</Tag>
              ))}
            </View>
          )}
          {a.culturalNotes && (
            <View style={{ marginTop: 3 }}>
              <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
                CULTURAL NOTES
              </Text>
              <EditableText
                name="daily.cultureNotes"
                defaultValue={a.culturalNotes}
                style={{ ...type.body, fontSize: pt['8.5'], fontStyle: 'italic' }}
              />
            </View>
          )}
        </View>
      )}

      {/* ── Identity rows (two-column stat-block layout) ─────── */}
      <View style={{ marginBottom: space.sm }}>
        <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
          IDENTITY
        </Text>
        {idRows.map((r, i) => (
          <View
            key={`idr-${i}`}
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              paddingVertical: 3,
              borderBottom: i < idRows.length - 1 ? `0.3pt solid ${palette.border}` : undefined,
            }}
            wrap={false}
          >
            <Text
              style={{
                ...type.label,
                color: palette.muted,
                width: 100,
                fontSize: pt['7.5'],
                letterSpacing: 0.2,
              }}
            >
              {r.label.toUpperCase()}
            </Text>
            <Text style={{ ...type.body, color: palette.ink, flex: 1, fontSize: pt['9.5'] }}>
              {r.value}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Quarters ─────────────────────────────────────────── */}
      {id.quarters?.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            QUARTERS · {id.quarters.length}
          </Text>
          {id.quarters.map((q, i) => (
            <QuarterCard key={`q-${i}`} q={q} idx={i} />
          ))}
        </View>
      )}

      {/* ── Daily Life ───────────────────────────────────────── */}
      {(d.hasPassages || d.foodBalance) && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: accent, fontSize: pt['8'], marginBottom: 3 }}>
            DAILY LIFE
          </Text>
          {d.hasPassages ? (
            d.passages.map((p, i) => (
              <View key={`p-${i}`} style={{ marginBottom: space.sm }} wrap={false}>
                <Text
                  style={{
                    ...type.label,
                    color: accent,
                    fontSize: pt['9'],
                    letterSpacing: 0.2,
                    marginBottom: 2,
                  }}
                >
                  {p.time.toUpperCase()}
                </Text>
                <EditableProse
                  name={`daily.${p.time.toLowerCase()}`}
                  defaultValue={p.text || ''}
                  lines={3}
                  style={{ ...type.prose, fontSize: pt['9.5'] }}
                />
              </View>
            ))
          ) : (
            d.foodBalance && (
              <Callout
                tone={d.foodBalance.deficit > 0 ? 'bad' : 'good'}
                kicker="FOOD BALANCE"
              >
                <Text style={{ ...type.body, fontSize: pt['9.5'] }}>
                  {d.foodBalance.deficit > 0
                    ? `Deficit of ${smart(d.foodBalance.deficit)} units - the settlement depends on imports for daily survival.`
                    : `Surplus of ${smart(d.foodBalance.surplus || 0)} units - the local food supply is reliable.`}
                </Text>
              </Callout>
            )
          )}
        </View>
      )}
    </PageChrome>
  );
}

// ── Sub-components ─────────────────────────────────────────────

function QuarterCard({ q, idx }) {
  return (
    <View
      style={{
        marginBottom: 4,
        padding: 5,
        border: `0.4pt solid ${palette.border}`,
        borderRadius: 2,
        backgroundColor: palette.card,
      }}
      wrap={false}
    >
      <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'] }}>
        {humanize(q.name || `Quarter ${idx + 1}`)}
      </Text>
      {q.description && (
        <View style={{ marginTop: 2 }}>
          <EditableProse
            name={`identity.quarter.${idx}.description`}
            defaultValue={q.description}
            lines={2}
            style={{ ...type.body, fontSize: pt['9'] }}
          />
        </View>
      )}
      {q.landmarks?.length > 0 && (
        <View style={{ marginTop: 3 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
            LANDMARKS
          </Text>
          {q.landmarks.map((lm, j) => (
            <View key={`lm-${idx}-${j}`} style={{ flexDirection: 'row', marginBottom: 1 }}>
              <Text style={{ color: palette.gold, marginRight: 4, fontSize: pt['8'] }}>·</Text>
              <View style={{ flex: 1 }}>
                <EditableText
                  name={`identity.quarter.${idx}.landmark.${j}`}
                  defaultValue={typeof lm === 'string' ? lm : (lm?.name || lm?.label || '')}
                  style={{ ...type.body, fontSize: pt['8.5'] }}
                />
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function foundingLabel(f) {
  if (!f) return '-';
  if (typeof f === 'string') return f;
  return f.summary || f.event || f.label || '-';
}

export default IdentityDailyLife;
