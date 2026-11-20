/**
 * IdentityDailyLife — chapter 02. Three-band layout (no quarters before the plat, X-47):
 *   1. Anchor facts panel — mirror DailyLifeTab anchor (governing, prosperity,
 *      safety, food, magic, stress).
 *   2. Identity rows — name/tier/population/race/terrain/layout/age/gov/founded.
 *   3. Daily Life — five AI passages (Dawn→Night) editable, or food balance
 *      fallback when AI prose is missing.
 *
 * Editable fields:
 *   - daily.<time>
 *   - daily.cultureNotes
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { formatCount } from '../../domain/formatNumber.js';
import { tokenCase } from '../../domain/display/labelCase.js';
import {
  ChapterBand, KeyValRow, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { EditableText, EditableProse } from '../primitives/Editable.jsx';
import { type, palette, space, pt } from '../theme.js';
import { humanize } from '../lib/format.js';
import { StateProse } from '../primitives/StateProse.jsx';
import { foodwaysLineOf } from '../../domain/foodways.js';
import { factsOf } from '../../domain/facts/factsOf.js';
import { architecturalDetailRefused, resolveCultureProfileKey } from '../../data/cultureProfiles.js';
import { foodWordShown } from '../../domain/display/foodWordShown.js';
import { cultureOnPage } from '../lib/cultureOnPage.js';
import { cultureScopeLine } from '../../domain/summary/settlementQuickGuide.js';

export function IdentityDailyLife({ settlement, narrativeMode, vm, stateProse }) {
  const id = vm.identity;
  const d = vm.daily;
  const a = id.anchor || {};
  const culture = id.culturalIdentity;
  const accent = narrativeMode ? palette.ai : palette.gold;
  const foodWord = foodWordShown(settlement); // the food word's one home (SURFACES-2 item 1)
  // EXPORTS-B24 · B2: the culture block's one reader (the scope line through the tab's reader; the six raw rows and the
  // generated notes in a town or larger only, each held to its declarations; the user's own notes always).
  const cultureBlock = cultureOnPage(settlement, a.culturalNotes);
  const scopeLine = cultureScopeLine(settlement); // the Overview's identity line (ruling (i)), never the profile's raw scope

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
        eyebrow="15"
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
          IS, so chapter 15 is where they belong. The premium seam is untouched: the builder
          withholds the two deity-naming positions unless `faithUnlocked`. ── */}
      <StateProse stateProse={stateProse} tab="daily_life" />
      <StateProse stateProse={stateProse} tab="faith" />

      {/* ── Anchor facts ─────────────────────────────────────── */}
      {(a.governingName || a.prosperity || a.safety || cultureBlock.notes ||
        foodWord || a.magicDependency || a.activeStress?.length > 0) && (
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
              // Governing, Prosperity and Safety print on Power and the Overview strip, and
              // Defense readiness on Defense (chair ruling D1's print half, 2026-10-30).
              a.complexity       ? { label: 'Complexity', value: humanize(a.complexity) } : null,
            ].filter(Boolean)}
          />
          <KeyValRow
            pairs={[
              // The state in a word, not the engine's daily units (STYLE-RULINGS-2 B4, 2026-11-09: the
              // machinery off the reader's page; the Economics chapter carries the food figures).
              // "Score avg", the mean of the defence scores, left with it: the Defense chapter
              // carries the readiness label.
              // THE FOOD WORD HAS ONE HOME (SURFACES-2 item 1, the chair's ruling (r2) of 2026-11-14): the
              // block prints the food band the Tonight page, the Overview and Daily Life print
              // (domain/display/foodWordShown.js), or no Food row. Its own second vocabulary (Deficit,
              // Surplus, Balanced off the view's daily figures) is gone: it said "Surplus" beside this
              // document's own Tonight "Secure" (729 of 772 births).
              foodWord ? { label: 'Food', value: foodWord.label } : null,
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
          {cultureBlock.notes && (
            <View style={{ marginTop: 3 }}>
              <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted, marginBottom: 1 }}>
                CULTURAL NOTES
              </Text>
              <EditableText
                name="daily.cultureNotes"
                defaultValue={cultureBlock.notes}
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
                ...type.label_plain,
                color: palette.muted,
                width: 100,
                fontSize: pt['7.5'],
              }}
            >
              {tokenCase(r.label)}
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
          {scopeLine && (
            <Text
              style={{
                ...type.body,
                color: palette.second,
                fontSize: pt['8.5'],
                fontStyle: 'italic',
                marginBottom: 3,
              }}
            >
              {scopeLine}
            </Text>
          )}
          <CultureRows culture={culture} rawRows={cultureBlock.rows} foodwaysLine={foodwaysLineOf(settlement)} architectureLine={architectureLineOf(settlement, culture)} />
        </View>
      )}

      {/* ⛔ NO COHERENCE BOX ON THE READER'S PAGE (STYLE-RULINGS-2 B4, 2026-11-09): "GENERATION
          COHERENCE · 17/17 checks passed · 8/8 formal judgments supported" is the engine's self-check,
          and an internal check prints only on the DM's "why" layer, the record's history page
          (components/settlement/VersionsTab.jsx :: GenerationReceipt; the chair's ruling of
          2026-11-08 for the battery judgment, widened here to the whole box). The view model keeps
          `identity.generationCoherence` and the record keeps the receipt (display only).
          tests/pdf/recordBatteryReceiptOnly.test.jsx */}

      {/* ⛔ NO QUARTERS BLOCK BEFORE THE PLAT (X-47, the owner, 2026-11-03: "No districts or
          taverns until we get the PLAT working"). The view model keeps `id.quarters` for the
          plat to read; no text surface prints a quarter's name. tests/pdf/quartersNotPrinted.test.jsx */}

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
                    ...type.label_plain,
                    color: accent,
                    fontSize: pt['9'],
                    marginBottom: 2,
                  }}
                >
                  {tokenCase(p.time)}
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
                    ? 'What is grown here and brought in falls short of what people eat each day, so some households eat less than they need.'
                    : d.foodBalance.surplus > 0
                      ? 'More is grown and brought in than people eat each day. The local food supply is reliable.'
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

// The foodways sentence has ONE home: the food record's line, read through the one reader
// (domain/foodways.js :: foodwaysLineOf, FOOD-4). The culture's authored line is printed only
// for a save older than that record (lane WIRING-2, FOOD R-print).

// W2-FIX-DATA-12 item 2: the Architecture row prints the materialized detail through the one reading the arrival's
// sight beat uses (data/cultureProfiles.js :: architecturalDetailRefused): held to its row's declaration against the
// whole record, a detail naming a market, a palisade or a river the town lacks prints nothing, never raw.
function architectureLineOf(settlement, culture) {
  const detail = culture.architecturalDetail;
  if (!detail) return null;
  const profileKey = resolveCultureProfileKey(culture.key || settlement?.config?.culture || 'germanic');
  return architecturalDetailRefused(detail, profileKey, () => factsOf(settlement)) ? null : detail;
}

// EXPORTS-B24 · B2: the six raw rows are the reader's (pdf/lib/cultureOnPage.js: a town or larger only, each held to its
// declarations); Foodways and Architecture already pass their own readers and print at every size.
function CultureRows({ culture, rawRows, foodwaysLine, architectureLine }) {
  const raw = new Map(rawRows);
  const rows = [
    ['Built form', raw.get('Built form')],
    ['Civic pattern', raw.get('Civic pattern')],
    ['Exchange', raw.get('Exchange')],
    ['Foodways', foodwaysLine || culture.foodways],
    ['Sacred life', raw.get('Sacred life')],
    ['Defense', raw.get('Defense')],
    ['Social texture', raw.get('Social texture')],
    ['Architecture', architectureLine],
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
              ...type.label_plain,
              color: palette.muted,
              width: 78,
              fontSize: pt['7'],
              marginRight: 5,
            }}
          >
            {tokenCase(label)}
          </Text>
          <Text style={{ ...type.body, color: palette.ink, flex: 1, fontSize: pt['8.5'] }}>
            {value}
          </Text>
        </View>
      ))}
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
