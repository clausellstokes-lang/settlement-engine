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
  ChapterBand, ChapterHeadline, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { Callout } from '../primitives/Callout.jsx';
import { StatusCard } from '../primitives/Visuals.jsx';
import { type, palette, space, pt } from '../theme.js';
import { humanize, label, plural, upper } from '../lib/format.js';

const SERVICE_CATEGORY_ORDER = [
  'lodging', 'food', 'equipment', 'magic', 'healing',
  'information', 'transport', 'legal', 'employment',
  'entertainment', 'criminal',
];
const SERVICE_CAT_LABEL = {
  lodging: 'Lodging',
  food: 'Food & Drink',
  equipment: 'Equipment',
  magic: 'Magic',
  healing: 'Healing',
  information: 'Information',
  transport: 'Transport',
  legal: 'Legal',
  employment: 'Employment',
  entertainment: 'Entertainment',
  criminal: 'Criminal',
};
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

export function Services({ settlement, narrativeMode, vm }) {
  const s = vm.services || {};
  const cats = SERVICE_CATEGORY_ORDER
    .map(k => ({ key: k, items: normalizeServiceList(s.available?.[k]) }))
    .filter(c => c.items.length > 0);
  const total = cats.reduce((n, c) => n + c.items.length, 0);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="08A"
        title="Services"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={`${total} buyable across ${cats.length} ${plural(cats.length, 'category', 'categories')}`}
      />

      <ChapterHeadline tone="gold">
        What players can actually purchase here. Match a need to the right counter.
      </ChapterHeadline>

      {cats.length === 0 && (
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          No buyable services surfaced for this settlement.
        </Text>
      )}

      {/* ── 2-col grid of service categories ──────────────────── */}
      <CategoryGrid cats={cats} />

      {/* ── Notable absences ──────────────────────────────────── */}
      {s.notableAbsences?.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <Callout tone="warn" kicker="NOTABLE ABSENCES">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {s.notableAbsences.map((a, i) => (
                <Tag key={`abs-${i}`} tone="warn">
                  {label(a) || humanize(String(a))}
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
            <ChainCard key={`chain-${i}`} chain={chain} />
          ))}
        </View>
      )}
    </PageChrome>
  );
}

function CategoryGrid({ cats }) {
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
            {pair[0] && <CategoryCard cat={pair[0]} />}
          </View>
          <View style={{ flex: 1 }}>
            {pair[1] && <CategoryCard cat={pair[1]} />}
          </View>
        </View>
      ))}
    </View>
  );
}

function CategoryCard({ cat }) {
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
          {upper(SERVICE_CAT_LABEL[cat.key] || humanize(cat.key))}
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
                <Text style={{ fontSize: pt['8'], color: palette.gold, marginLeft: 3 }}>✦</Text>
              </View>
            );
          }
          return (
            <Pill key={`svc-${cat.key}-${i}`} tone={tone}>
              {svcLabel(svc)}
            </Pill>
          );
        })}
      </View>
    </View>
  );
}

function ChainCard({ chain }) {
  // Honor the chain's own disruption status first — the card used to label
  // trade-impaired/vulnerable chains 'Active', contradicting the web panel.
  const status = String(chain.status || '').toLowerCase();
  const tone = status === 'impaired' || status === 'blocked' || status === 'collapsing' || chain.resourceDepleted
    ? 'bad'
    : status === 'vulnerable' || status === 'strained' || status === 'scarce' || chain.substituteActive
      ? 'warn'
      : chain.entrepot
        ? 'cool'
        : 'good';
  const statusLabel = status === 'impaired' || status === 'blocked' || status === 'collapsing'
    ? 'Impaired'
    : status === 'vulnerable' || status === 'strained' || status === 'scarce'
      ? 'Vulnerable'
      : chain.resourceDepleted
        ? 'Resource Depleted'
        : chain.substituteActive
          ? 'On Substitute'
          : chain.entrepot
            ? 'Entrepôt'
            : 'Active';
  const flow = [
    chain.resource ? humanize(label(chain.resource)) : null,
    (chain.processingInstitutions || []).map(humanize).join(' + ') || null,
    (chain.outputs || []).map(humanize).slice(0, 4).join(', ') || null,
  ].filter(Boolean).join(' \u00bb ');

  const meta = [
    chain.needLabel ? { label: 'NEED', value: chain.needLabel } : null,
    chain.exportable ? { label: 'EXPORT', value: 'yes' } : null,
    chain.activatedByResource ? { label: 'BY', value: 'local resource' } : null,
  ].filter(Boolean);

  const note = chain.externalMillNote || chain.entrepotNote;

  return (
    <StatusCard
      compact
      name={chain.label || chain.chainId || 'Chain'}
      status={statusLabel}
      statusLabel={statusLabel}
      tone={tone}
      meta={meta}
      description={flow}
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
  if (typeof svc === 'string') return humanize(svc);
  return humanize(svc.name || svc.label || '') ||
         (svc.institution ? humanize(svc.institution) : '');
}

export default Services;
