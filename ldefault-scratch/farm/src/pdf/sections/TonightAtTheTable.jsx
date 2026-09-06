/**
 * TonightAtTheTable — chapter 02. The single page a DM can pull up at the
 * table when running this settlement on the fly.
 *
 * Uses the shared 1 / 3 / 1 / 3 / 1 quick guide: one identity sentence, three
 * defining truths, one pressure, three faces, and one entry point. The deeper
 * hook and crisis chapters remain available elsewhere in the dossier; this page
 * is deliberately the five-minute brief instead of another exhaustive index.
 *
 * Editable fields:
 *   - tonight.npc.<i>.note
 *   - tonight.scratch
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline, GoldRule, HairRule, Tag } from '../primitives/Dense.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { NotesField } from '../primitives/Editable.jsx';
import { type, palette, space, pt } from '../theme.js';
import { humanize } from '../lib/format.js';
import { composeSettlementQuickGuide } from '../../domain/summary/settlementQuickGuide.js';

export function TonightAtTheTable({ settlement, narrativeMode, vm }) {
  const guide = composeSettlementQuickGuide(settlement);
  const npcs = (vm?.npcs?.sorted || []).slice(0, 3);
  const hasEntryPoint = !guide.entryPoint.text.startsWith('No immediate entry point');

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="02"
        title="Tonight at the Table"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub="Quick-grab session prep"
      />

      <ChapterHeadline tone="gold">
        One place, three truths, one pressure, three faces, one way into play.
      </ChapterHeadline>

      {/* ── Identity and three defining truths ───────────────── */}
      <View style={{ marginBottom: space.sm }}>
        <Text style={{
          ...type.body_em,
          color: palette.ink,
          fontSize: pt['10.5'],
          lineHeight: 1.35,
          marginBottom: 5,
        }}>
          {guide.identitySentence}
        </Text>
        {guide.definingTruths.map((truth) => (
          <View
            key={truth.id}
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginBottom: 3,
              paddingLeft: 6,
              borderLeft: `1.5pt solid ${palette.border}`,
            }}
            wrap={false}
          >
            <Text style={{
              ...type.label,
              color: palette.muted,
              fontSize: pt['7.5'],
              width: 76,
              marginRight: 5,
              paddingTop: 1,
            }}>
              {truth.label.toUpperCase()}
            </Text>
            <Text style={{
              ...type.body,
              color: palette.second,
              fontSize: pt['8.5'],
              lineHeight: 1.3,
              flex: 1,
            }}>
              {truth.text}
            </Text>
          </View>
        ))}
      </View>

      <View style={{
        marginBottom: space.sm,
        padding: 6,
        backgroundColor: palette.badBg,
        borderLeft: `2pt solid ${palette.bad}`,
      }} wrap={false}>
        <Text style={{
          ...type.label,
          color: palette.bad,
          fontSize: pt['7.5'],
          marginBottom: 2,
        }}>
          WHAT IS URGENT
        </Text>
        <Text style={{
          ...type.italic,
          color: palette.ink,
          fontSize: pt['9'],
          lineHeight: 1.35,
        }}>
          {guide.immediatePressure.text}
        </Text>
      </View>

      {/* ── One entry point ────────────────────────────────────── */}
      <View style={{ marginBottom: space.sm }}>
        <Text style={{ ...type.label, color: palette.gold, fontSize: pt['9'], marginBottom: 4 }}>
          START HERE
        </Text>
        {!hasEntryPoint && (
          <Text style={{ ...type.italic, color: palette.muted, fontSize: pt['9'] }}>
            {guide.entryPoint.text}
          </Text>
        )}
        {hasEntryPoint && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
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
              1
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{
                ...type.body,
                fontSize: pt['10.5'],
                color: palette.ink,
                lineHeight: 1.35,
              }}>
                {guide.entryPoint.text}
              </Text>
              <View style={{ flexDirection: 'row', marginTop: 2 }}>
                <Tag tone="gold">{humanize(guide.entryPoint.label)}</Tag>
              </View>
            </View>
          </View>
        )}
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
              {/* What they want this session — extractable prose */}
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

      <GoldRule />

      <NotesField name="tonight.scratch" lines={6} label="SESSION SCRATCH" />
    </PageChrome>
  );
}

export default TonightAtTheTable;
