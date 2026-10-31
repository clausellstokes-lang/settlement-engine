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
import { anchorTarget } from '../primitives/EntityRef.jsx';
import { institutionDisplayName } from '../../domain/display/institutionDisplayName.js';
import { edged } from '../../design/edgedBox.js';
import { PROXY_SERVICE_HOSTS } from '../../data/servicesData.js';

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
  const index = vm.entityIndex; // Phase-D id»card resolver
  const detailed = s.detailed || [];
  const grouped  = groupBy(detailed, i => (i.category || 'other').toLowerCase());
  const categories = orderedCategories(grouped);
  // T1-15 (the owner, 2026-10-30): each house lists the service rows that name it, the same
  // rows the screen's Institutions tab prints under it. Joined HERE on the display name
  // (the slice carries the display label, and `institutionDisplayName` is the one spelling
  // both sides use), so the pinned view model does not move.
  const servicesByHouse = servicesByDisplayName(settlement?.availableServices);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="06"
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
          { label: 'Total', value: detailed.length },
          { label: 'Categories', value: categories.length },
          {
            label: 'Impaired',
            value: s.totals?.impaired ?? 0,
            tone: (s.totals?.impaired ?? 0) > 0 ? 'bad' : 'muted',
          },
          {
            label: 'Degraded',
            value: s.totals?.degraded ?? 0,
            tone: (s.totals?.degraded ?? 0) > 0 ? 'warn' : 'muted',
          },
          {
            label: 'Vulnerable',
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
            <CategoryGrid items={list} catKey={cat} entityIndex={index} servicesByHouse={servicesByHouse} />
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
function CategoryGrid({ items, catKey, entityIndex, servicesByHouse }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1] || null]);
  }
  return (
    <View>
      {rows.map((pair, ri) => (
        <View key={`r-${catKey}-${ri}`} style={{ flexDirection: 'row', marginBottom: 3 }}>
          <View style={{ flex: 1, marginRight: 4 }}>
            {pair[0] && <InstitutionCard inst={pair[0]} idx={`${catKey}-${ri}-a`} entityIndex={entityIndex} services={servicesByHouse?.get(pair[0].name)} />}
          </View>
          <View style={{ flex: 1 }}>
            {pair[1] && <InstitutionCard inst={pair[1]} idx={`${catKey}-${ri}-b`} entityIndex={entityIndex} services={servicesByHouse?.get(pair[1].name)} />}
          </View>
        </View>
      ))}
    </View>
  );
}

function InstitutionCard({ inst, idx, entityIndex, services = [] }) {
  const status = (inst.status || 'healthy').toLowerCase();
  // Phase-D: this card is the anchor TARGET for any institution id reference.
  const anchor = anchorTarget(entityIndex, inst.id);
  const tone = STATUS_TONE[status] || 'muted';
  // §14 — custom institutions added by the user. Print equivalent of the web's
  // shimmering gold row: a gold tint (goldBg) + gold outline + a ✦ marker.
  const isCustom = String(inst.source || '').toLowerCase() === 'custom';
  const meta = [
    inst.subCategory ? { label: 'Type', value: humanize(inst.subCategory) } : null,
    inst.leader ? {
      label: 'Head',
      value: typeof inst.leader === 'string' ? inst.leader : (inst.leader.name || label(inst.leader)),
    } : null,
    inst.building ? {
      label: 'Building',
      value: typeof inst.building === 'string' ? inst.building : (inst.building.name || label(inst.building)),
    } : null,
    inst.staffing ? { label: 'Staff', value: inst.staffing } : null,
    inst.capacity ? { label: 'Capacity', value: inst.capacity } : null,
    inst.prominence ? { label: 'Scale', value: humanize(inst.prominence) } : null,
    inst.chainDepth != null ? { label: 'Chain', value: `depth ${inst.chainDepth}` } : null,
    inst.source ? { label: 'Source', value: humanize(inst.source) } : null,
    inst.founded ? {
      label: 'Established',
      value: typeof inst.founded === 'number' ? `${inst.founded}` : inst.founded,
    } : null,
  ].filter(Boolean);

  return (
    <View
      id={anchor}
      style={{
        padding: 5,
        ...edged(`0.4pt solid ${isCustom ? palette.gold : palette.border}`, `2pt solid ${palette[tone] || palette.muted}`),
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
            {institutionDisplayName(inst)}
          </Text>
          {isCustom && (
            <Text style={{ color: palette.gold, fontSize: pt['9'], marginLeft: 3 }}>*</Text>
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

      {services.length > 0 && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label_plain, fontSize: pt['7'], color: palette.muted }}>Services</Text>
          {services.map((svc, i) => (
            <Text key={`sv-${idx}-${i}`} style={{ ...type.caption, fontSize: pt['7.5'], color: palette.second }}>
              <Text style={{ color: palette.ink }}>{institutionDisplayName(svc.name)}</Text>
              {svc.desc ? `: ${svc.desc}` : ''}
            </Text>
          ))}
        </View>
      )}

      {inst.products?.length > 0 && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label_plain, fontSize: pt['7'], color: palette.muted }}>Produces</Text>
          <Text style={{ ...type.caption, fontSize: pt['7.5'], color: palette.second }}>
            {inst.products.slice(0, 6).map(p => label(p) || humanize(String(p))).filter(Boolean).join(', ')}
          </Text>
        </View>
      )}

      {inst.requirements?.length > 0 && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label_plain, fontSize: pt['7'], color: palette.warn }}>Needs</Text>
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
          <Text style={{ ...type.label_plain, fontSize: pt['7'], color: palette.bad }}>Pressures</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {inst.pressures.slice(0, 4).map((p, i) => (
              <Tag key={`pr-${idx}-${i}`} tone="warn">{label(p) || humanize(String(p))}</Tag>
            ))}
          </View>
        </View>
      )}

      {inst.plotHooks?.length > 0 && (
        <View style={{ marginTop: 2 }}>
          <Text style={{ ...type.label_plain, fontSize: pt['7'], color: palette.gold }}>Hooks</Text>
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

/**
 * The service rows of `availableServices`, keyed by the DISPLAY name of the institution each
 * row names (T1-15). Rows naming no house on the roster (proxy attributions such as
 * "(smuggling)") key under a name no card carries, and stay in the Services chapter only.
 * @param {unknown} availableServices
 * @returns {Map<string, Array<{name?: string, desc?: string}>>}
 */
function servicesByDisplayName(availableServices) {
  const map = new Map();
  const lists = Array.isArray(availableServices)
    ? [availableServices]
    : Object.values(availableServices && typeof availableServices === 'object' ? availableServices : {});
  for (const list of lists) {
    for (const svc of Array.isArray(list) ? list : []) {
      if (!svc || typeof svc !== 'object' || !svc.institution) continue;
      // VERIFIER F14 (RS-19): a menu a PROXY host only surfaces prints in the Services chapter,
      // never under the proxy house (the screen's InstitutionsTab twin).
      if (PROXY_SERVICE_HOSTS[String(svc.institution).toLowerCase()]) continue;
      const key = institutionDisplayName(svc.institution);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(svc);
    }
  }
  return map;
}

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
