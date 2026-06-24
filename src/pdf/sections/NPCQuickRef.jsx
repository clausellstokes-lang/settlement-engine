/**
 * NPCQuickRef — chapter 03. The "look it up fast" page.
 *
 * Every named NPC in the settlement, listed in a compressed two-column table
 * with name / title / faction / power. When a player asks "who's the priest at
 * the temple?" the DM can scan one page rather than flipping through detailed
 * sheets. The full-sheet treatment lives in the Notable NPCs chapter.
 *
 * Editable: nothing — this page is a stable index. Edits live on the detailed
 * sheets in chapter 04.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline } from '../primitives/Dense.jsx';
import { Pill } from '../primitives/Pill.jsx';
import { type, palette, pt } from '../theme.js';
import { humanize } from '../lib/format.js';
import { EntityRef, anchorTarget } from '../primitives/EntityRef.jsx';

// NPC ages are usually descriptive strings ('mid-forties'); only append the
// 'y' suffix when the age is purely numeric.
function ageLabel(age) {
  return /^\d+$/.test(String(age)) ? `${age}y` : age;
}

// NPC power is a 1-10 scale (generateNPCGoal: high 8-10, mid 4-7, low 1-3).
// The old 40/60/80 thresholds were 0-100 and never tinted anything.
function powerTone(p) {
  if (p == null) return 'muted';
  if (p >= 8) return 'bad';
  if (p >= 6) return 'warn';
  if (p >= 4) return 'gold';
  return 'muted';
}

function NPCRow({ npc, index }) {
  // Phase-D: each row is the anchor TARGET for this NPC; the faction cell links
  // to the faction card when the affiliation resolves in-doc.
  const anchor = anchorTarget(index, npc.id);
  const factionLinks = !!(index && npc.factionLink && index.resolve?.(npc.factionLink));
  return (
    <View
      id={anchor}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 3,
        borderBottom: `0.3pt solid ${palette.border}`,
      }}
      wrap={false}
    >
      <View style={{ flex: 1.4, paddingRight: 4 }}>
        <Text style={{ ...type.body_em, color: palette.ink, fontSize: pt['9.5'] }}>
          {npc.name || 'Unnamed'}
        </Text>
        {npc.title && (
          <Text style={{ ...type.italic, color: palette.muted, fontSize: pt['8'] }}>
            {npc.title}
          </Text>
        )}
      </View>
      <View style={{ flex: 1, paddingRight: 4 }}>
        {npc.factionLabel && (
          <Text style={{ ...type.caption, color: palette.cool, fontSize: pt['7.5'] }}>
            {factionLinks
              ? <EntityRef id={npc.factionLink} index={index} type="faction" fallback={npc.factionLabel} />
              : npc.factionLabel}
          </Text>
        )}
        {(npc.race || npc.gender || npc.age) && (
          <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'] }}>
            {[npc.race && humanize(npc.race), npc.gender && humanize(npc.gender), npc.age && ageLabel(npc.age)]
              .filter(Boolean).join(' · ')}
          </Text>
        )}
      </View>
      <View style={{ width: 38, alignItems: 'flex-end' }}>
        <Pill tone={powerTone(npc.power)}>{npc.power || 0}</Pill>
      </View>
    </View>
  );
}

export function NPCQuickRef({ settlement, narrativeMode, vm }) {
  const all = vm?.npcs?.sorted || [];
  const index = vm?.entityIndex; // Phase-D id→card resolver
  // Two columns side-by-side, balanced
  const half = Math.ceil(all.length / 2);
  const left = all.slice(0, half);
  const right = all.slice(half);

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="03"
        title="NPC Quick Reference"
        accent={narrativeMode ? palette.ai : palette.gold}
        sub={`${all.length} face${all.length === 1 ? '' : 's'}`}
      />

      <ChapterHeadline tone="gold">
        Every named figure on one page. Power tints flag who's worth caring about. Detailed sheets in chapter 04.
      </ChapterHeadline>

      {all.length === 0 && (
        <Text style={{ ...type.body, color: palette.muted, fontStyle: 'italic' }}>
          No NPCs detailed for this settlement.
        </Text>
      )}

      {/* ── Column header ─────────────────────────────────────── */}
      {all.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 3,
            borderBottom: `1pt solid ${palette.gold}`,
            marginBottom: 4,
          }}
        >
          <View style={{ flex: 1.4 }}>
            <Text style={{ ...type.label, color: palette.gold, fontSize: pt['7'] }}>NAME</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ ...type.label, color: palette.gold, fontSize: pt['7'] }}>FACTION · NOTES</Text>
          </View>
          <View style={{ width: 38, alignItems: 'flex-end' }}>
            <Text style={{ ...type.label, color: palette.gold, fontSize: pt['7'] }}>PWR</Text>
          </View>
        </View>
      )}

      {/* ── Two-column listing ────────────────────────────────── */}
      {all.length > 0 && (
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            {left.map((npc, i) => (
              <NPCRow key={`l-${i}`} npc={npc} index={index} />
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {right.map((npc, i) => (
              <NPCRow key={`r-${i}`} npc={npc} index={index} />
            ))}
          </View>
        </View>
      )}
    </PageChrome>
  );
}

export default NPCQuickRef;
