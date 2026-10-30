/**
 * PlotHooks — chapter 11. Aggregates every hook the engine has surfaced
 * (NPC personal hooks, conflict hooks, underworld hooks, viability-crisis
 * hooks, tension hooks, relationship hooks, historical-event hooks) into a
 * single ledger grouped by source, with priority dots and category tags.
 *
 * Editable fields:
 *   - hooks.<source>.<i>
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import {
  ChapterBand, ChapterHeadline, HairRule, Tag,
} from '../primitives/Dense.jsx';
import { hooksHeadline } from '../lib/headlines.js';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, space, pt } from '../theme.js';
import { cap, hookText, humanize } from '../lib/format.js';
import { StateProse } from '../primitives/StateProse.jsx';
// The screen's grouping, from the same domain leaf (already in this bundle through
// viewModel.js's collectPlotHooks import, so it costs the worker nothing).
import { groupPlotHooksBySourcePage } from '../../domain/dossier/plotHooks.js';

// THE CARDS ARE GROUPED BY THE PAGE THEIR SOURCE FACT LIVES ON, as on the screen (chair
// ruling, RULINGS-T1 Plot Hooks, 2026-10-30): domain/dossier/plotHooks.js ::
// groupPlotHooksBySourcePage, keyed on the collector's own category and source label (the
// view model carries both as `category` and `sourceName`). The old per-token labels and
// order, and the per-card category tag, are gone with the screen's.

const PRIORITY_TONE = {
  high: 'bad', critical: 'bad', major: 'bad',
  medium: 'warn', moderate: 'warn',
  low: 'muted', minor: 'muted',
};

export function PlotHooks({ settlement, narrativeMode, vm, stateProse }) {
  const hooks = vm.hooks?.all || [];
  const tensions = vm.hooks?.tensions || [];

  // Group by source
  const groups = groupPlotHooksBySourcePage(
    hooks.map((row) => ({ row, category: row.category, source: row.sourceName })),
  ).map(({ page, hooks: members }) => ({ page, list: members.map((m) => m.row) }));

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="05"
        title="Plot Hooks & Quests"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={`${hooks.length} hook${hooks.length === 1 ? '' : 's'}`}
      />

      <ChapterHeadline tone="gold">
        {hooksHeadline(vm.hooks)}
      </ChapterHeadline>

      {/* ── The mounted state prose (the screen's ProseBlock positions) ── */}
      <StateProse stateProse={stateProse} tab="plot_hooks" />

      {hooks.length === 0 && (
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          No plot hooks surfaced for this settlement yet.
        </Text>
      )}

      {/* ── Source groups ────────────────────────────────────── */}
      {groups.map(({ page, list: members }) => {
        const source = page.id;
        const list = members.filter(h => hookText(h?.hook).trim().length > 0);
        if (!list.length) return null;
        return (
          <View key={`grp-${source}`} style={{ marginBottom: space.sm }}>
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
              <Pill tone="gold">{page.label}</Pill>
              <Text style={{ ...type.caption, color: palette.muted, marginLeft: 5, fontSize: pt['8'] }}>
                {list.length} hook{list.length === 1 ? '' : 's'}
              </Text>
            </View>
            <HookGrid items={list} source={source} />
          </View>
        );
      })}

      {/* ── Underlying tensions short list ──────────────────── */}
      {tensions.length > 0 && (
        <View style={{ marginTop: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.warn, fontSize: pt['8'], marginBottom: 3 }}>
            UNDERLYING TENSIONS
          </Text>
          {tensions.map((t, i) => (
            <View
              key={`ut-${i}`}
              style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'flex-start' }}
              wrap={false}
            >
              <Text style={{ color: palette.warn, marginRight: 4, fontSize: pt['9'] }}>•</Text>
              <Text style={{ ...type.body, flex: 1, fontSize: pt['9'] }}>
                <Text style={{ ...type.body_em, color: palette.ink }}>
                  {humanize(t.label || t.type || 'Tension')}
                </Text>
                {t.description ? `  ${t.description}` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}
    </PageChrome>
  );
}

/**
 * HookGrid — 2-col layout for a hook source group. Each cell is a
 * HookCard. Pairs of cards share a row so the chapter stops being a tall
 * single-column scroll; long source groups now fit inside one page.
 */
function HookGrid({ items, source }) {
  const rows = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push([items[i], items[i + 1] || null]);
  }
  return (
    <View>
      {rows.map((pair, ri) => (
        <View key={`hr-${source}-${ri}`} style={{ flexDirection: 'row', marginBottom: 3 }}>
          <View style={{ flex: 1, marginRight: 5 }}>
            {pair[0] && <HookCard hook={pair[0]} number={ri * 2 + 1} />}
          </View>
          <View style={{ flex: 1 }}>
            {pair[1] && <HookCard hook={pair[1]} number={ri * 2 + 2} />}
          </View>
        </View>
      ))}
    </View>
  );
}

function HookCard({ hook, number }) {
  const text = hookText(hook.hook);
  const pri  = (hook.priority || '').toLowerCase();
  const priTone = PRIORITY_TONE[pri] || null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 3,
        paddingHorizontal: 5,
        borderLeft: `1.5pt solid ${palette.gold}`,
        backgroundColor: palette.card,
        minHeight: 44,
      }}
      wrap={false}
    >
      <Text
        style={{
          ...type.label_em,
          color: palette.gold,
          width: 18,
          fontSize: pt['8'],
          paddingTop: 1,
        }}
      >
        {String(number).padStart(2, '0')}
      </Text>
      <View style={{ flex: 1 }}>
        {/* Hook prose — extractable, what the DM reads */}
        <Text style={{ ...type.body, fontSize: pt['9'], color: palette.ink, lineHeight: 1.35 }}>
          {text}
        </Text>
        {/* Provenance + tags demoted to a small follow-up line */}
        {(hook.sourceName || priTone) && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'wrap',
              marginTop: 2,
            }}
          >
            {hook.sourceName && (
              <Text style={{ ...type.caption, color: palette.faint, fontSize: pt['7'], marginRight: 4 }}>
                {humanize(hook.sourceName)}
              </Text>
            )}
            {priTone && <Tag tone={priTone}>{cap(pri)}</Tag>}
          </View>
        )}
      </View>
    </View>
  );
}

export default PlotHooks;
