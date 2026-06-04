/**
 * TonightAtTheTable - chapter 02. The single page a DM can pull up at the
 * table when running this settlement on the fly.
 *
 * Picks the most useful three of each: hooks (top by source priority), NPCs
 * (top by power), active crises (all of them, capped at 4). Each item is one
 * actionable line, editable so the DM can rewrite as the session unfolds.
 *
 * Editable fields:
 *   - tonight.hook.<i>
 *   - tonight.npc.<i>.note
 *   - tonight.crisis.<i>.followup
 *   - tonight.scratch
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline, GoldRule, HairRule, Tag } from '../primitives/Dense.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { NotesField } from '../primitives/Editable.jsx';
import { type, palette, space, pt } from '../theme.js';
import { hookText, humanize } from '../lib/format.js';

// Source rank: which hook source category to prefer when picking the top 3.
const SOURCE_RANK = ['crisis', 'tension', 'conflict', 'crime', 'npc', 'relationship', 'history'];

function rankHook(h) {
  const idx = SOURCE_RANK.indexOf(h?.source || 'other');
  return idx === -1 ? SOURCE_RANK.length : idx;
}

export function TonightAtTheTable({ settlement, narrativeMode, vm }) {
  const all = vm?.hooks?.all || [];
  // Pick three best hooks: ordered by source rank, then preserving listed order
  const hooks = all
    .map((h, i) => ({ h, i }))
    .sort((a, b) => {
      const r = rankHook(a.h) - rankHook(b.h);
      if (r !== 0) return r;
      return a.i - b.i;
    })
    .map(x => x.h)
    .filter(h => hookText(h?.hook).trim().length > 0)
    .slice(0, 3);

  const npcs = (vm?.npcs?.sorted || []).slice(0, 3);
  const crises = (vm?.summary?.crisis?.chips || []).slice(0, 4);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="02"
        title="Tonight at the Table"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub="Quick-grab session prep"
      />

      <ChapterHeadline tone="gold">
        {crises.length > 0
          ? 'Three hooks, three faces, the active pressures. Use this page if you only have five minutes.'
          : 'Three hooks, three faces. Use this page if you only have five minutes.'}
      </ChapterHeadline>

      {/* ── Hooks ─────────────────────────────────────────────── */}
      <View style={{ marginBottom: space.sm }}>
        <Text style={{ ...type.label, color: palette.gold, fontSize: pt['9'], marginBottom: 4 }}>
          USE TONIGHT - HOOKS
        </Text>
        {hooks.length === 0 && (
          <Text style={{ ...type.italic, color: palette.muted, fontSize: pt['9'] }}>
            No hooks surfaced. Improvise from the active crises below.
          </Text>
        )}
        {hooks.map((h, i) => {
          const text = hookText(h?.hook);
          const sourceLabel = humanize(h?.source || 'other');
          const sourceNameLabel = h?.sourceName ? humanize(h.sourceName) : '';
          return (
            <View
              key={`th-${i}`}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: 7,
                paddingLeft: 8,
                borderLeft: `2pt solid ${palette.gold}`,
                paddingTop: 2,
                paddingBottom: 2,
              }}
              wrap={false}
            >
              <Text
                style={{
                  fontFamily: 'Lora',
                  fontWeight: 700,
                  color: palette.gold,
                  fontSize: pt['14'],
                  width: 18,
                  paddingTop: 1,
                }}
              >
                {i + 1}
              </Text>
              <View style={{ flex: 1 }}>
                {/* Hook text leads - large, scannable. Plain Text so the
                    prose extracts cleanly from the PDF. */}
                <Text style={{ ...type.body, fontSize: pt['10.5'], color: palette.ink, lineHeight: 1.35 }}>
                  {text}
                </Text>
                {/* Source demoted to a small tag underneath */}
                <View style={{ flexDirection: 'row', marginTop: 2 }}>
                  <Tag tone="gold">{sourceLabel}</Tag>
                  {sourceNameLabel && <Tag tone="muted">{sourceNameLabel}</Tag>}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <HairRule />

      {/* ── NPCs ──────────────────────────────────────────────── */}
      <View style={{ marginBottom: space.sm }}>
        <Text style={{ ...type.label, color: palette.cool, fontSize: pt['9'], marginBottom: 4 }}>
          THREE FACES TO REMEMBER
        </Text>
        {npcs.length === 0 && (
          <Text style={{ ...type.italic, color: palette.muted, fontSize: pt['9'] }}>
            No NPCs detailed for this settlement.
          </Text>
        )}
        {npcs.map((npc, i) => (
          <View
            key={`tn-${i}`}
            style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 }}
            wrap={false}
          >
            <View
              style={{
                width: 22, height: 22,
                backgroundColor: palette.coolBg,
                borderRadius: 11,
                alignItems: 'center', justifyContent: 'center',
                marginRight: 6, marginTop: 1,
              }}
            >
              <Text style={{ ...type.label_em, color: palette.cool, fontSize: pt['9'] }}>
                {(npc.name || '?').slice(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['10.5'], marginRight: 6 }}>
                  {npc.name}
                </Text>
                {npc.title && (
                  <Text style={{ ...type.italic, color: palette.muted, fontSize: pt['9'] }}>
                    {npc.title}
                  </Text>
                )}
                <View style={{ flex: 1 }} />
                <Pill tone="cool">PWR {npc.power || 0}</Pill>
              </View>
              {/* What they want this session - extractable prose */}
              <View style={{ flexDirection: 'row', marginTop: 1, alignItems: 'flex-start' }}>
                <Text style={{ ...type.label, color: palette.cool, fontSize: pt['7'], marginRight: 4, paddingTop: 2 }}>
                  WANTS:
                </Text>
                <Text style={{ ...type.body, fontSize: pt['9'], color: palette.second, flex: 1 }}>
                  {npc.motivation || npc.blurb || 'leverage tonight\u2019s table'}
                </Text>
              </View>
              {npc.factionLabel && (
                <Text style={{ ...type.caption, color: palette.cool, fontSize: pt['7.5'], marginTop: 1 }}>
                  {npc.factionLabel}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* ── Active crises (only when present - no contradiction with the "active pressures" headline) ── */}
      {crises.length > 0 && (
        <>
          <HairRule />
          <View style={{ marginBottom: space.sm }}>
            <Text style={{ ...type.label, color: palette.bad, fontSize: pt['9'], marginBottom: 4 }}>
              ACTIVE CRISES - KEEP IN MIND
            </Text>
            {crises.map((c, i) => (
              <View
                key={`tc-${i}`}
                style={{
                  marginBottom: 4,
                  paddingLeft: 6,
                  borderLeft: `2pt solid ${palette.bad}`,
                }}
                wrap={false}
              >
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 1 }}>
                  <Text style={{ ...type.body_em, color: palette.bad, fontSize: pt['10'], marginRight: 4 }}>
                    {humanize(c.label || c.icon || 'Crisis')}
                  </Text>
                  {c.summary && (
                    <Text style={{ ...type.italic, color: palette.second, fontSize: pt['9'], flex: 1 }}>
                      {c.summary}
                    </Text>
                  )}
                </View>
                {hookText(c.hook) && (
                  <Text style={{ ...type.body, fontSize: pt['8.5'], color: palette.muted, fontStyle: 'italic' }}>
                    {hookText(c.hook)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </>
      )}

      <GoldRule />

      <NotesField name="tonight.scratch" lines={6} label="SESSION SCRATCH" />
    </PageChrome>
  );
}

export default TonightAtTheTable;
