/**
 * Institutions — chapter 08b. The factional/political map of who runs what:
 * government, military, religious, economy, magic, crafts, infrastructure,
 * defense, entertainment, adventuring, criminal.
 *
 * Layout: per-category header (with status counts), then a 2-column grid of
 * institution cards. Each card shows status, leadership, building, and a
 * tight summary with hooks and pressures. Splitting Services vs.
 * Institutions keeps each chapter focused — Services is the player-facing
 * "what can I buy" page, Institutions is the DM-facing "who's in charge" page.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, StatStrip, KeyValRow, Tag,
} from '../primitives/Dense.jsx';
import { servicesHeadline } from '../lib/headlines.js';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, space, factionColors, pt } from '../theme.js';
import { cap, label, humanize, hookText, plural } from '../lib/format.js';
import { displayInstitutionName } from '../../domain/display/institutionDisplay.js';
import { anchorTarget } from '../primitives/EntityRef.jsx';

const CATEGORY_ORDER = [
  'government', 'military', 'religious', 'economy', 'magic',
  'crafts', 'infrastructure', 'defense', 'entertainment',
  'adventuring', 'criminal', 'other',
];

const STATUS_TONE = {
  healthy: 'good', stable: 'good', productive: 'good',
  vulnerable: 'warn', degraded: 'warn',
  impaired: 'bad', critical: 'bad',
};

export function Institutions({ settlement, narrativeMode, vm }) {
  const s = vm.services;
  const index = vm.entityIndex; // Phase-D id→card resolver
  const detailed = s.detailed || [];
  const grouped  = groupBy(detailed, i => (i.category || 'other').toLowerCase());
  const categories = orderedCategories(grouped);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="08B"
        title="Institutions"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={`${detailed.length} ${plural(detailed.length, 'institution')}`}
      />

      <ChapterHeadline tone="gold">
        {servicesHeadline(s)}
      </ChapterHeadline>

      {/* ── Health header ────────────────────────────────────── */}
      <StatStrip
        stats={[
          { label: 'TOTAL', value: detailed.length },
          { label: 'CATEGORIES', value: categories.length },
          {
            label: 'IMPAIRED',
            value: s.totals?.impaired ?? 0,
            tone: (s.totals?.impaired ?? 0) > 0 ? 'bad' : 'muted',
          },
          {
            label: 'DEGRADED',
            value: s.totals?.degraded ?? 0,
            tone: (s.totals?.degraded ?? 0) > 0 ? 'warn' : 'muted',
          },
          {
            label: 'VULNERABLE',
            value: s.totals?.vulnerable ?? 0,
            tone: (s.totals?.vulnerable ?? 0) > 0 ? 'warn' : 'muted',
          },
        ]}
      />

      {/* ── Empty state ──────────────────────────────────────── */}
      {detailed.length === 0 && (
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          No institutions detailed for this settlement.
        </Text>
      )}

      {/* ── Per-category blocks ──────────────────────────────── */}
      {categories.map(cat => {
        const list = grouped[cat] || [];
        const catStats = countStatuses(list);
        return (
          <View key={`cat-${cat}`} style={{ marginBottom: space.sm }}>
            <CategoryHeader cat={cat} count={list.length} stats={catStats} />
            <CategoryGrid items={list} catKey={cat} entityIndex={index} />
          </View>
        );
      })}
    </PageChrome>
  );
}

function CategoryHeader({ cat, count, stats }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
        paddingBottom: 2,
        borderBottom: `0.5pt solid ${palette.border}`,
      }}
      wrap={false}
    >
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: factionColors[cat] || palette.gold,
          marginRight: 5,
        }}
      />
      <Text style={{ ...type.label_em, color: palette.ink, fontSize: pt['9'] }}>
        {humanize(cat)}
      </Text>
      <Text style={{ ...type.caption, color: palette.muted, marginLeft: 5, fontSize: pt['8'] }}>
        {count} {plural(count, 'institution')}
      </Text>
      <View style={{ flex: 1 }} />
      {stats.impaired > 0 && <Tag tone="bad">{stats.impaired} impaired</Tag>}
      {stats.degraded > 0 && <Tag tone="warn">{stats.degraded} reduced</Tag>}
      {stats.vulnerable > 0 && <Tag tone="warn">{stats.vulnerable} vulnerable</Tag>}
    </View>
  );
}

/**
 * 2-col grid of institution cards. Half the page width per card so the
 * category sections stack tighter and the chapter fits on one page in
 * the common case.
 */
function CategoryGrid({ items, catKey, entityIndex }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1] || null]);
  }
  return (
    <View>
      {rows.map((pair, ri) => (
        <View key={`r-${catKey}-${ri}`} style={{ flexDirection: 'row', marginBottom: 3 }}>
          <View style={{ flex: 1, marginRight: 4 }}>
            {pair[0] && <InstitutionCard inst={pair[0]} idx={`${catKey}-${ri}-a`} entityIndex={entityIndex} />}
          </View>
          <View style={{ flex: 1 }}>
            {pair[1] && <InstitutionCard inst={pair[1]} idx={`${catKey}-${ri}-b`} entityIndex={entityIndex} />}
          </View>
        </View>
      ))}
    </View>
  );
}

function InstitutionCard({ inst, idx, entityIndex }) {
  const status = (inst.status || 'healthy').toLowerCase();
  // Phase-D: this card is the anchor TARGET for any institution id reference.
  const anchor = anchorTarget(entityIndex, inst.id);
  const tone = STATUS_TONE[status] || 'muted';
  // §14 — custom institutions added by the user. Print equivalent of the web's
  // shimmering gold row: a gold tint (goldBg) + gold outline + a ✦ marker.
  const isCustom = String(inst.source || '').toLowerCase() === 'custom';
  const meta = [
    inst.subCategory ? { label: 'TYPE', value: humanize(inst.subCategory) } : null,
    inst.leader ? {
      label: 'HEAD',
      value: typeof inst.leader === 'string' ? inst.leader : (inst.leader.name || label(inst.leader)),
    } : null,
    inst.building ? {
      label: 'BLDG',
      value: typeof inst.building === 'string' ? inst.building : (inst.building.name || label(inst.building)),
    } : null,
    inst.staffing ? { label: 'STAFF', value: inst.staffing } : null,
    inst.capacity ? { label: 'CAP', value: inst.capacity } : null,
    inst.prominence ? { label: 'SCALE', value: humanize(inst.prominence) } : null,
    inst.chainDepth != null ? { label: 'CHAIN', value: `depth ${inst.chainDepth}` } : null,
    inst.source ? { label: 'SOURCE', value: humanize(inst.source) } : null,
    inst.founded ? {
      label: 'EST',
      value: typeof inst.founded === 'number' ? `${inst.founded}` : inst.founded,
    } : null,
  ].filter(Boolean);

  return (
    <View
      id={anchor}
      style={{
        padding: 5,
        border: `0.4pt solid ${isCustom ? palette.gold : palette.border}`,
        borderLeft: `2pt solid ${palette[tone] || palette.muted}`,
        borderRadius: 2,
        backgroundColor: isCustom ? palette.goldBg : palette.card,
        minHeight: 60,
      }}
      wrap={false}
    >
      {/* Title row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10'] }}>
            {displayInstitutionName(inst.name)}
          </Text>
          {isCustom && (
            <Text style={{ color: palette.gold, fontSize: pt['9'], marginLeft: 3 }}>✦</Text>
          )}
        </View>
        {status !== 'healthy' && <Pill tone={tone}>{cap(status)}</Pill>}
      </View>

      {/* Tags */}
      {inst.tags?.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 2 }}>
          {inst.tags.slice(0, 4).map((t, i) => (
            <Tag key={`tg-${idx}-${i}`} tone="muted">{label(t) || humanize(String(t))}</Tag>
          ))}
        </View>
      )}

      {meta.length > 0 && <KeyValRow pairs={meta} />}

      {inst.description && (
        <Text style={{ ...type.body, fontSize: pt['8.5'], color: palette.second, marginTop: 2, lineHeight: 1.35 }}>
          {inst.description}
        </Text>
      )}

      {inst.statusReason && (
        <Text style={{
          ...type.caption,
          color: palette[tone] || palette.muted,
          fontSize: pt['7.5'],
          fontStyle: 'italic',
          marginTop: 1,
        }}>
          {inst.statusReason}
        </Text>
      )}

      {inst.products?.length > 0 && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted }}>PRODUCES</Text>
          <Text style={{ ...type.caption, fontSize: pt['7.5'], color: palette.second }}>
            {inst.products.slice(0, 6).map(p => label(p) || humanize(String(p))).filter(Boolean).join(', ')}
          </Text>
        </View>
      )}

      {inst.requirements?.length > 0 && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.warn }}>NEEDS</Text>
          <Text style={{ ...type.caption, fontSize: pt['7.5'], color: palette.second }}>
            {inst.requirements.slice(0, 6).map(r => label(r) || humanize(String(r))).filter(Boolean).join(', ')}
          </Text>
        </View>
      )}

      {inst.notableUnits && (
        <Text style={{ ...type.caption, fontSize: pt['7.5'], color: palette.muted, marginTop: 1 }}>
          <Text style={{ color: palette.faint }}>Notable: </Text>
          {typeof inst.notableUnits === 'string'
            ? inst.notableUnits
            : (Array.isArray(inst.notableUnits)
              ? inst.notableUnits.map(label).filter(Boolean).join(', ')
              : '')}
        </Text>
      )}

      {inst.pressures?.length > 0 && (
        <View style={{ marginTop: 1 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.bad }}>PRESSURES</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {inst.pressures.slice(0, 4).map((p, i) => (
              <Tag key={`pr-${idx}-${i}`} tone="warn">{label(p) || humanize(String(p))}</Tag>
            ))}
          </View>
        </View>
      )}

      {inst.plotHooks?.length > 0 && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label, fontSize: pt['7'], color: palette.gold }}>HOOKS</Text>
          {inst.plotHooks.slice(0, 2).map((h, i) => {
            const t = hookText(h);
            if (!t) return null;
            return (
              <View key={`ih-${idx}-${i}`} style={{ flexDirection: 'row', marginBottom: 1, alignItems: 'flex-start' }}>
                <Text style={{ color: palette.gold, marginRight: 3, fontSize: pt['8'] }}>•</Text>
                <Text style={{ ...type.body, fontSize: pt['8'], flex: 1, lineHeight: 1.3 }}>{t}</Text>
              </View>
            );
          })}
        </View>
      )}

      {inst.notes && (
        <Text style={{ ...type.italic, fontSize: pt['8'], color: palette.muted, marginTop: 2 }}>
          {inst.notes}
        </Text>
      )}
    </View>
  );
}

// ── Helpers ────────────────────────────────────────────────────

function groupBy(list, fn) {
  const out = {};
  for (const item of (list || [])) {
    const key = fn(item) || 'other';
    if (!out[key]) out[key] = [];
    out[key].push(item);
  }
  return out;
}

function orderedCategories(grouped) {
  const known = CATEGORY_ORDER.filter(c => grouped[c]?.length);
  const extra = Object.keys(grouped)
    .filter(c => !CATEGORY_ORDER.includes(c) && grouped[c]?.length)
    .sort();
  return [...known, ...extra];
}

function countStatuses(list) {
  const out = { impaired: 0, degraded: 0, vulnerable: 0, healthy: 0 };
  for (const i of list) {
    const k = (i.status || 'healthy').toLowerCase();
    if (out[k] != null) out[k]++;
  }
  return out;
}

export default Institutions;
