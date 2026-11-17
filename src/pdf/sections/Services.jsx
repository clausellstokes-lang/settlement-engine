/**
 * Services — chapter 08a. The DM-at-table reference: "what can my players
 * actually buy here?" Lodging, food, equipment, magic, healing, info,
 * transport, legal, employment, entertainment, criminal.
 *
 * Layout: a 2-column grid of category cards. Each card lists the category
 * label, count, and the buyable options as Pills. Notable absences and
 * active supply chains follow in their own panels.
 *
 * Companion chapter: Institutions (08b) — the per-category institution cards
 * with status, leadership, building, hooks, etc. Splitting them keeps each
 * page focused: this one for player-facing transactions, the other for the
 * factional/political map of who runs what.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { StatusCard } from '../primitives/Visuals.jsx';
import { type, palette, space, pt } from '../theme.js';
import { humanize, label, plural, stripZwnj } from '../lib/format.js';
import { tokenCase } from '../../domain/display/labelCase.js';
import { StateProse } from '../primitives/StateProse.jsx';
import { institutionHouseLabel } from '../../domain/display/institutionDisplayName.js';
import { chainHousesOf, chainSourceOf } from '../../domain/display/chainHouses.js';
// RS-14: the card titles read the one label map the screen and the absences callout read.
import { serviceLabel } from '../../domain/display/servicesDisplay.js';
// TAIL-EXPORTS-PDF-2 (rulings E3/E17): under a crisis a service or a chain that lives on what it stops is marked by the
// tabs' one leaf (domain/display/crisisStoppedRow.js): a pill, which prints no description, takes the leaf's word after
// its name, as the Institutions tab's doors do; a chain's card leads with the leaf's mark; the chapter says once, under
// its band, that its rows are of ordinary times. The words are the leaf's.
import { markedOnPage, ordinaryTimesOnPage, stoppedWordOnPage } from '../lib/crisisMarksOnPage.js';

const SERVICE_CATEGORY_ORDER = [
  'lodging', 'food', 'equipment', 'magic', 'healing',
  'information', 'transport', 'legal', 'employment',
  'entertainment', 'criminal',
];
const SERVICE_CAT_TONE = {
  lodging: 'good',
  food: 'good',
  equipment: 'good',
  magic: 'cool',
  healing: 'good',
  information: 'gold',
  transport: 'gold',
  legal: 'gold',
  employment: 'gold',
  entertainment: 'gold',
  criminal: 'bad',
};

export function Services({ settlement, narrativeMode, vm, stateProse }) {
  const s = vm.services || {};
  const cats = SERVICE_CATEGORY_ORDER
    .map(k => ({ key: k, items: normalizeServiceList(s.available?.[k]) }))
    .filter(c => c.items.length > 0);
  const total = cats.reduce((n, c) => n + c.items.length, 0);
  const ordinaryLine = ordinaryTimesOnPage(settlement, [
    ...cats.flatMap((c) => c.items).filter((svc) => svc && typeof svc === 'object').map((svc) => /** @type {const} */ (['service', svc])),
    ...(s.activeChains || []).map((chain) => /** @type {const} */ (['chain', chain])),
  ]);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="05"
        title="Services"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={`${total} buyable across ${cats.length} ${plural(cats.length, 'category', 'categories')}`}
      />

      {/* ── The mounted state prose (the screen's ProseBlock positions) ── */}
      <StateProse stateProse={stateProse} tab="services" />
      {ordinaryLine && (
        <Text style={{ ...type.italic, color: palette.second, fontSize: pt['8.5'], marginBottom: space.xs }}>{ordinaryLine}</Text>
      )}

      {cats.length === 0 && (
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          No buyable services surfaced for this settlement.
        </Text>
      )}

      {/* ── 2-col grid of service categories ──────────────────── */}
      <CategoryGrid cats={cats} town={settlement} />

      {/* ── Notable absences ──────────────────────────────────── */}
      {s.notableAbsences?.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <Callout tone="warn" kicker="NOTABLE ABSENCES">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {s.notableAbsences.map((a, i) => (
                <Tag key={`abs-${i}`} tone="warn">
                  {/* RS-18: the callout names a category exactly as its card title does, the
                      one label (servicesDisplay.js) through the same ladder. */}
                  {a && typeof a === 'object' && a.key
                    ? tokenCase(stripZwnj(serviceLabel(a.key)))
                    : (label(a) || humanize(String(a)))}
                </Tag>
              ))}
            </View>
          </Callout>
        </View>
      )}

      {/* ── Active supply chains ──────────────────────────────── */}
      {s.activeChains?.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>
            ACTIVE SUPPLY CHAINS · {s.activeChains.length}
          </Text>
          {s.activeChains.map((chain, i) => (
            <ChainCard key={`chain-${i}`} chain={chain} town={settlement} instNames={(settlement?.institutions || []).map((x) => x?.name)} />
          ))}
        </View>
      )}
    </PageChrome>
  );
}

function CategoryGrid({ cats, town }) {
  // Render in pairs so each row is two columns side-by-side.
  const rows = [];
  for (let i = 0; i < cats.length; i += 2) {
    rows.push([cats[i], cats[i + 1] || null]);
  }
  return (
    <View>
      {rows.map((pair, ri) => (
        <View key={`row-${ri}`} style={{ flexDirection: 'row', marginBottom: 5 }}>
          <View style={{ flex: 1, marginRight: 6 }}>
            {pair[0] && <CategoryCard cat={pair[0]} town={town} />}
          </View>
          <View style={{ flex: 1 }}>
            {pair[1] && <CategoryCard cat={pair[1]} town={town} />}
          </View>
        </View>
      ))}
    </View>
  );
}

function CategoryCard({ cat, town }) {
  const tone = SERVICE_CAT_TONE[cat.key] || 'gold';
  const accent = palette[tone] || palette.gold;
  return (
    <View
      style={{
        padding: 6,
        border: `0.4pt solid ${palette.border}`,
        borderLeft: `2pt solid ${accent}`,
        borderRadius: 2,
        backgroundColor: palette.card,
        minHeight: 60,
      }}
      wrap={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 3 }}>
        <Text style={{ ...type.label_em, color: palette.ink, fontSize: pt['9'] }}>
          {tokenCase(stripZwnj(serviceLabel(cat.key)))}
        </Text>
        <Text style={{ ...type.caption, color: palette.muted, marginLeft: 5, fontSize: pt['7.5'] }}>
          {cat.items.length} option{cat.items.length === 1 ? '' : 's'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cat.items.map((svc, i) => {
          // §14 — custom services render gold (the print equivalent of the
          // web's shimmering pill) with a ✦ marker.
          const isCustom = svc && typeof svc === 'object' && (svc.custom === true || svc.source === 'custom');
          if (isCustom) {
            return (
              <View
                key={`svc-${cat.key}-${i}`}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: palette.goldBg,
                  border: `0.5pt solid ${palette.gold}`,
                  borderRadius: 2, paddingHorizontal: 6, paddingVertical: 2,
                  marginRight: 4, marginBottom: 2,
                }}
              >
                <Text style={{ ...type.pill, fontSize: pt['8.5'], color: palette.gold }}>{svcLabel(svc)}</Text>
                <Text style={{ fontSize: pt['8'], color: palette.gold, marginLeft: 3 }}>*</Text>
              </View>
            );
          }
          return (
            <Pill key={`svc-${cat.key}-${i}`} tone={tone}>
              {((word) => (word ? `${svcLabel(svc)} (${word})` : svcLabel(svc)))(svc && typeof svc === 'object' ? stoppedWordOnPage(town, 'service', svc) : null)}
            </Pill>
          );
        })}
      </View>
    </View>
  );
}

function ChainCard({ chain, town, instNames = [] }) { const shown = chainPrintName(chain, town); // COHERENCE-AGREE-6 (F1): the name and the source printed read the town's access
  // SURFACES-1 item 1 (LV-CHAINSTATE-PDF): the state the tab's card prints, in its chip's words
  // (pdf/lib/chainStateOnPage.js): a siege or a famine in force leaves Impaired, a chain run only through a
  // neighbour's house prints no state. The card printed the record's stored state ("Active" beside "Field work
  // and trade have stopped"). A depleted ground is said on the source, as the tab's card says it.
  // PDF-2 items 5 and 6 (BRIEF-BAR8, 2026-11-17; vetoable by the owner): the card reads the chain the tab's card renders
  // (`crisisMarksOnPage.js :: chainCardOnPage`: `chainCardUnderSiege` over `chainAsShown`), its word, its outputs and its
  // houses, not the stored chain (34 towns of the census's 720 printed an output the tab's card withholds).
  const card = chainCardOnPage(chain, town);
  const { key: status, word: statusLabel } = card;
  const onCard = card.chain;
  const tone = status === 'impaired' || chain.resourceDepleted
    ? 'bad'
    : status === 'vulnerable' || chain.substituteActive
      ? 'warn'
      : status === '' ? 'muted' : chain.entrepot
        ? 'cool'
        : 'good';
  // ⛔ THE PROCESSING NAMES ARE CATALOGUE KEYS AND THIS IS A PRINT (§934.13, browser pass 3).
  // `humanize` returns any string carrying whitespace unchanged, so this row printed the
  // catalogue's own 'Parish church' into the paid document while the screen's Economics tab
  // — which already routes the same field through the seam — said 'House of worship'. The
  // seam goes BEFORE humanize so an unmapped institution still gets its casing.
  const flow = [
    // R2-CODE-B round 3, ruling (d) (#804): no ground the record says is absent (chainHouses.js); with the town, a toll
    // renamed by its access names that access (COHERENCE-AGREE-6 F1), as the screen's card reads it (R2-CODE-B-7).
    chainSourceOf(chain, shown) ? `${humanize(label(chainSourceOf(chain, shown)))}${chain.resourceDepleted ? ' (depleted)' : ''}` : null,
    // R2-CODE-B item 1: the houses by the seam's house label, each once (domain/display/chainHouses.js),
    // the screen's chain card's own read: no rank's count range the roster does not hold.
    // Ruling (e): the roster is read, so a house held only as a road to elsewhere is named as the page names it.
    // PDF-2 item 1 (ruling BR10 (3), amended): handed the card and its town, as the tab's card is (chainHouses.js ::
    // chainHousesOf): no source house the supply rule reads at work on another ground of its own, on a spent ground's card.
    chainHousesOf(chain.processingInstitutions, instNames, town ? { chain: onCard, town } : null).map((h) => humanize(h.name)).join(' + ') || null,
    // SURFACES-1 item 2: the outputs the tab's card prints, as many as it prints; LEFT-PDF L2 (BRIEF-LEFT, 2026-11-17;
    // vetoable by the owner): by the tab card's own reading (`economicsCrisisMarks.js :: chainOutputsOnCard`, ruling CY1: a
    // refused yield names no service the page keeps on offer), not the reading beneath it (`chainOutputsShown`)
    ((outputs) => (outputs && chainYieldRefused(onCard) ? `${NORMALLY_YIELDS}: ${outputs}` : outputs))(chainOutputsOnCard(onCard, town).map(humanize).slice(0, 3).join(', ') || null),
  ].filter(Boolean).join(' \u00bb ');

  const meta = [
    chain.needLabel ? { label: 'NEED', value: chain.needLabel } : null,
    chain.exportable ? { label: 'EXPORT', value: 'yes' } : null,
    // "BY local resource" left (B4, 2026-11-09): the engine's activation flag; the flow line names the resource.
  ].filter(Boolean);

  const note = chain.externalMillNote || chain.entrepotNote;

  return (
    <StatusCard
      compact
      name={shown.label || chain.chainId || 'Chain'}
      status={statusLabel}
      statusLabel={statusLabel}
      tone={tone}
      meta={meta}
      description={markedOnPage(town, 'chain', chain, flow)}
      body={
        note ? (
          <View style={{ marginTop: 3 }}>
            <Text style={{ ...type.body, fontSize: pt['8.5'], lineHeight: 1.35 }}>
              {note}
            </Text>
          </View>
        ) : null
      }
    />
  );
}

function normalizeServiceList(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'object') {
    return Object.entries(raw)
      .map(([name, v]) => (v && typeof v === 'object' ? v : (v ? { name } : null)))
      .filter(Boolean);
  }
  return [];
}

function svcLabel(svc) {
  if (!svc) return '';
  // §934.13 — every arm goes through the label seam. `humanize` returns any string
  // containing whitespace unchanged, so it composes with the seam's authored case
  // rather than title-casing 'Access to a house of worship'.
  // ROUND THREE, ruling (a): through the house's label, the one display leaf (no catalogue count
  // range, household range, gate or condition).
  if (typeof svc === 'string') return humanize(institutionHouseLabel(svc));
  return humanize(institutionHouseLabel(svc)) ||
         (svc.institution ? humanize(institutionHouseLabel(svc.institution)) : '');
}

export default Services;

// COHERENCE-AGREE-4 (item 3′): at the end of the file so no line-keyed register row above it moves.
import { NORMALLY_YIELDS, chainYieldRefused } from '../../domain/chainYield.js';
import { chainPrintName } from '../../domain/display/chainPrintName.js';
import { chainCardOnPage } from '../lib/crisisMarksOnPage.js'; // PDF-2 items 5, 6: the chain the tab's card renders, and its word
import { chainOutputsOnCard } from '../../domain/display/economicsCrisisMarks.js'; // LEFT-PDF L2: the tab card's outputs
