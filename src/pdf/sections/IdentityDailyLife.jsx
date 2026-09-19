/**
 * IdentityDailyLife — chapter 02. Three-band layout:
 *   1. Anchor facts panel — mirror DailyLifeTab anchor (governing, prosperity,
 *      safety, food, magic, stress).
 *   2. Identity rows — name/tier/population/race/terrain/layout/age/gov/founded.
 *   3. Quarters — name + description (editable) + landmarks list.
 *   4. Daily Life — five AI passages (Dawn→Night) editable, or food balance
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
import { formatCount } from '../../domain/formatNumber.js';
import {
  ChapterBand, KeyValRow, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt } from '../theme.js';
import { smart, humanize, num } from '../lib/format.js';
import { StateProse } from '../primitives/StateProse.jsx';

export function IdentityDailyLife({ settlement, narrativeMode, vm, stateProse }) {
  const id = vm.identity;
  const d = vm.daily;
  const a = id.anchor || {};
  const culture = id.culturalIdentity;
  const coherence = id.generationCoherence;
  const accent = narrativeMode ? palette.ai : palette.gold;

  const founded = foundingLabel(id.founding);
  const idRows = [
    { label: 'Name',          value: id.name },
    { label: 'Tier',          value: id.tier || '–' },
    { label: 'Population',    value: id.population ? formatCount(id.population) : '–' },
    id.dominantRace   ? { label: 'Dominant Race', value: humanize(id.dominantRace) } : null,
    id.terrain        ? { label: 'Terrain',       value: humanize(id.terrain) } : null,
    id.layout         ? { label: 'Layout',        value: humanize(id.layout) } : null,
    id.age != null    ? { label: 'Age',           value: `${id.age} years` } : null,
    id.governmentType ? { label: 'Government',    value: humanize(id.governmentType) } : null,
    id.tradeAccess    ? { label: 'Trade Access',  value: humanize(id.tradeAccess) } : null,
    founded           ? { label: 'Founded',       value: founded } : null,
  ].filter(Boolean);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="07"
        title="Identity & Daily Life"
        accent={accent}
        sub={id.tier || null}
      />

      {/* ── The mounted state prose (the screen's ProseBlock positions) ──
          ⭐ THE FAITH POSITIONS RENDER HERE, AND THE REASON IS REACHABILITY (review 4).
          They were drawn from FaithWar.jsx, which returns null on a dormant `vm.liveWorld`
          and is gated by `faithChapterVisible` on `included && hasLiveWorld && faithUnlocked`
          — so on a measured 12 of 12 generated settlements the builder composed a faith
          position and NOT ONE of them could reach a page. The PDF has no faith chapter
          outside that premium live-world one, and DS-FTH-1/2/3 are facts about what the town
          IS, so chapter 07 is where they belong. The premium seam is untouched: the builder
          withholds the two deity-naming positions unless `faithUnlocked`. ── */}
      <StateProse stateProse={stateProse} tab="daily_life" />
      <StateProse stateProse={stateProse} tab="faith" />

      {/* ── Anchor facts ─────────────────────────────────────── */}
      {(a.governingName || a.prosperity || a.safety || a.culturalNotes ||
        a.foodDeficit != null ||
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
              // Tri-state, matching every sibling renderer (EconomicsTrade's
              // FoodBalanceBlock and Overview's FoodBalanceBar both guard on
              // `> 0`) and the domain's own word for the third state
              // (dossierViewModel.js:141 `display = 'Balanced'`). The old
              // `foodSurplus != null` fallback printed "+0 units" for a
              // settlement in balance. The no-data case is nulled upstream in
              // viewModel.js, so a missing row here means "not calculated".
              a.foodDeficit > 0
                ? { label: 'FOOD',  value: `−${num(a.foodDeficit)} units` }
                : a.foodSurplus > 0
                  ? { label: 'FOOD',  value: `+${num(a.foodSurplus)} units` }
                  : (a.foodDeficit != null || a.foodSurplus != null)
                    ? { label: 'FOOD',  value: 'Balanced' }
                    : null,
              a.defenseLabel     ? { label: 'DEFENSE',   value: humanize(a.defenseLabel) } : null,
              a.defenseScoreAvg != null ? { label: 'SCORE AVG', value: smart(a.defenseScoreAvg) } : null,
              /* ⛔ THE `MAGIC` CHIP IS GONE, AND IT IS A DELETION RATHER THAN A REPAIR.
                 It printed `humanize(a.magicalCapability)`, and `defenseProfile.magicalCapability`
                 HAS NO WRITER: `generateDefenseProfile` returns scores/readiness/institutions/
                 magicDependency/traditions/chainModifiers/economicGates and nothing else, the
                 world pulse only ever re-spreads `scores`, and no save shape carries the key —
                 the observed-shape ratchet has it frozen as a reader-with-no-writer finding in
                 both view-model files. So the chip was dead on every settlement ever exported.
                 The reader-without-writer dock's ruling is REMOVE, not keep warm: a guarded read
                 of a key nothing produces is an arm that can never run, and leaving it invites a
                 later car to "fix" it by inventing a writer for a fact the Defense tab already
                 owns. The magic facts the dossier really has are elsewhere on the page-set —
                 `magicDependency` is the tag six lines below, and the Defense tab's Arcane
                 Support row is the presence read. ── */
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

      {/* ── Structured cultural identity ─────────────────────── */}
      {culture && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 3,
            }}
          >
            <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginRight: 5 }}>
              CULTURAL IDENTITY
            </Text>
            {culture.label && <Tag tone="gold">{culture.label}</Tag>}
          </View>
          {culture.scope && (
            <Text
              style={{
                ...type.body,
                color: palette.second,
                fontSize: pt['8.5'],
                fontStyle: 'italic',
                marginBottom: 3,
              }}
            >
              {culture.scope}
            </Text>
          )}
          <CultureRows culture={culture} />
        </View>
      )}

      {/* The receipt is an owner diagnostic, not player-safe certification. The
          current PDF variants are DM artifacts; a future player variant must
          omit or explicitly project this block. */}
      {coherence && (
        <GenerationCoherence receipt={coherence} />
      )}

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
              // ⚠ TRI-STATE, not a binary. The `else` branch used to claim a
              // "Surplus of 0 units" in the GOOD tone for a settlement that
              // simply ran level — a verdict off a number that says nothing.
              // `warn` is the print-gold tone the screen already spends on this
              // exact state (EconomicsTab:297-298 pairs 'Balanced' with #a0762a,
              // which IS palette.warn).
              <Callout
                tone={d.foodBalance.deficit > 0 ? 'bad' : d.foodBalance.surplus > 0 ? 'good' : 'warn'}
                kicker="FOOD BALANCE"
              >
                <Text style={{ ...type.body, fontSize: pt['9.5'] }}>
                  {d.foodBalance.deficit > 0
                    ? `Deficit of ${smart(d.foodBalance.deficit)} units. The settlement depends on imports for daily survival.`
                    : d.foodBalance.surplus > 0
                      ? `Surplus of ${smart(d.foodBalance.surplus)} units. The local food supply is reliable.`
                      : 'Production and need are in balance. The settlement feeds itself, with nothing spare against a bad year.'}
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

function CultureRows({ culture }) {
  const rows = [
    ['Built form', culture.builtForm],
    ['Civic pattern', culture.civicPattern],
    ['Exchange', culture.exchangePattern],
    ['Foodways', culture.foodways],
    ['Sacred life', culture.sacredLife],
    ['Defense', culture.defensePattern],
    ['Social texture', culture.socialTexture],
    ['Architecture', culture.architecturalDetail],
  ].filter(([, value]) => value);

  return (
    <View>
      {rows.map(([label, value], index) => (
        <View
          key={`culture-${label}`}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: 2,
            borderBottom: index < rows.length - 1
              ? `0.3pt solid ${palette.border}`
              : undefined,
          }}
        >
          <Text
            style={{
              ...type.label,
              color: palette.muted,
              width: 78,
              fontSize: pt['7'],
              marginRight: 5,
            }}
          >
            {label.toUpperCase()}
          </Text>
          <Text style={{ ...type.body, color: palette.ink, flex: 1, fontSize: pt['8.5'] }}>
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function GenerationCoherence({ receipt }) {
  const tone = receipt.status === 'coherent'
    ? 'good'
    : receipt.status === 'coherent_with_authored_tensions'
      ? 'warn'
      : 'bad';
  const failed = receipt.checks.filter(check => check.status === 'fail');
  const reviewJudgments = receipt.judgments.filter(
    judgment => judgment.status === 'needs_review',
  );
  const summary = [
    `${receipt.passedChecks}/${receipt.totalChecks} checks passed`,
    receipt.totalJudgments > 0
      ? `${receipt.supportedJudgments}/${receipt.totalJudgments} formal judgments supported`
      : null,
    receipt.repairCount > 0
      ? `${receipt.repairCount} repair${receipt.repairCount === 1 ? '' : 's'} recorded`
      : null,
    receipt.authoredTensions.length > 0
      ? `${receipt.authoredTensions.length} authored tension${receipt.authoredTensions.length === 1 ? '' : 's'}`
      : null,
  ].filter(Boolean).join(' · ');

  return (
    <View
      style={{
        marginBottom: space.sm,
        padding: 6,
        backgroundColor: palette.card,
        border: `0.4pt solid ${palette.border}`,
        borderRadius: 2,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
        <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginRight: 5 }}>
          GENERATION COHERENCE
        </Text>
        <Tag tone={tone}>{humanize(receipt.status)}</Tag>
      </View>
      <Text style={{ ...type.body, color: palette.second, fontSize: pt['8.5'] }}>
        {summary}
      </Text>
      {failed.map(check => (
        <View key={check.id || check.label} style={{ marginTop: 2 }}>
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['7'] }}>
            {check.label.toUpperCase()}
          </Text>
          {check.findings.map((finding, index) => (
            <Text
              key={`${check.id || check.label}-${index}`}
              style={{ ...type.body, color: palette.second, fontSize: pt['8'] }}
            >
              {`• ${finding.detail || 'Review required.'}${finding.evidence ? `: ${finding.evidence}` : ''}`}
            </Text>
          ))}
        </View>
      ))}
      {reviewJudgments.map(judgment => (
        <View key={judgment.id || judgment.label} style={{ marginTop: 2 }}>
          <Text style={{ ...type.label, color: palette.bad, fontSize: pt['7'] }}>
            {`${judgment.label.toUpperCase()}: NEEDS REVIEW`}
          </Text>
          <Text style={{ ...type.body, color: palette.second, fontSize: pt['8'] }}>
            {judgment.summary || 'Formal judgment needs review.'}
          </Text>
        </View>
      ))}
    </View>
  );
}

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

// The engine founding object (narrativeGenerator genArrivalDetail) carries
// {age, reason, foundedBy, initialChallenge, overcoming, stressNote} — no
// summary/event/label — so fall through to foundedBy/reason and let the
// caller omit the row entirely when nothing usable exists.
function foundingLabel(f) {
  if (!f) return null;
  if (typeof f === 'string') return f;
  return f.summary || f.event || f.label || f.foundedBy || f.reason || null;
}

export default IdentityDailyLife;
