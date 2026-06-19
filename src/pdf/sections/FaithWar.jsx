/**
 * FaithWar — chapter 03D, the PDF's LIVE "Faith & War" read surface
 * (UX overhaul Phase 7, plan §4.4).
 *
 * The screen↔PDF parity fix: the dossier's WarFaithSection has long rendered a
 * live war/faith block the PDF could not, because the PDF never received the
 * campaign worldState. With the Phase-7 plumbing in place, this chapter mirrors
 * WarFaithSection from the SAME pure selectors (via vm.liveWorld) — siege /
 * coalition / occupation status, deployments, disposition standing, war
 * exhaustion, trade-war prize, the patron deity and its describeDeityEffects
 * couplings (read from the `*Axis` fields), plus the realm pantheon + named arcs.
 *
 * CANON-ONLY + SELF-GATING. The chapter is variant-gated to canon (like the
 * Timeline) AND renders NOTHING when vm.liveWorld is null (dormant: no live war
 * status and no assigned deity). A peaceful, deity-free, non-campaign settlement
 * therefore produces a byte-identical PDF — this chapter never appears.
 */
import { View, Text } from '@react-pdf/renderer';
import { PageChrome } from '../primitives/PageChrome.jsx';
import { ChapterBand, ChapterHeadline, HairRule, Tag } from '../primitives/Dense.jsx';
import { type, palette, space, pt, swatch } from '../theme.js';
import { cap, humanize } from '../lib/format.js';

const POSTURE_TONE = {
  Belligerent: 'bad',
  Assertive: 'warn',
  'Even-handed': 'muted',
  Cautious: 'good',
  Pacific: 'good',
};

const ALIGN_TONE = { evil: 'bad', good: 'good', neutral: 'muted' };

function Stat({ label, value, sub, tone = 'ink', flex = 1 }) {
  const color = palette[tone] || palette.ink;
  return (
    <View style={{ flex, padding: 6, backgroundColor: swatch['#FAF3E8'], border: `0.4pt solid ${palette.border}`, borderRadius: 2 }}>
      <Text style={{ ...type.label, fontSize: pt['7'], color: palette.muted }}>{label}</Text>
      <Text style={{ ...type.body_em, fontSize: pt['11'], color, marginTop: 1 }}>{value}</Text>
      {sub && (
        <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['7.5'] }}>{sub}</Text>
      )}
    </View>
  );
}

function Line({ label, children, tone = 'ink' }) {
  return (
    <Text style={{ ...type.body, fontSize: pt['9.5'], color: palette.second, lineHeight: 1.45, marginBottom: 3 }}>
      <Text style={{ ...type.body_em, color: palette[tone] || palette.ink }}>{label} </Text>
      {children}
    </Text>
  );
}

export function FaithWar({ settlement, narrativeMode, vm }) {
  const lw = vm?.liveWorld;
  if (!lw) return null; // dormant ⇒ byte-identical off-state.

  const { posture, exhaustion, standing, tradeWars, deity, pantheon, realmArcs } = lw;
  const postureTone = POSTURE_TONE[posture.label] || 'muted';

  const headline = lw.atWar
    ? 'This settlement is at war — the live front, the strategy posture, and the patron god.'
    : deity
      ? 'The patron god and the live geopolitical standing of the settlement.'
      : 'The live geopolitical standing of the settlement.';

  return (
    <PageChrome settlement={settlement} narrativeMode={narrativeMode}>
      <ChapterBand
        eyebrow="03D"
        title="Faith & War"
        accent={narrativeMode ? palette.ai : palette.bad}
        sub={lw.hasLive ? 'live campaign state' : 'pantheon'}
      />
      <ChapterHeadline tone={lw.atWar ? 'bad' : 'gold'}>{headline}</ChapterHeadline>

      {/* ── Posture / exhaustion / standing strip ─────────────────────── */}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: space.sm }}>
        <Stat
          label="POSTURE"
          value={posture.label}
          sub={`aggression ×${posture.value.toFixed(2)}`}
          tone={postureTone}
          flex={2}
        />
        {exhaustion && (
          <Stat
            label="WAR-WEARY"
            value={cap(exhaustion.band)}
            sub={exhaustion.value.toFixed(2)}
            tone={exhaustion.band === 'exhausted' ? 'bad' : exhaustion.band === 'near peace' ? 'good' : 'warn'}
          />
        )}
        {standing && (
          <Stat
            label="STANDING"
            value={`${standing.wins}W / ${standing.losses}L`}
            sub={`net ${standing.score > 0 ? '+' : ''}${standing.score}`}
            tone={standing.score > 0 ? 'good' : standing.score < 0 ? 'bad' : 'muted'}
          />
        )}
      </View>

      {/* ── Live war front ────────────────────────────────────────────── */}
      {(lw.besiegingTargets.length > 0 || lw.besiegedBy.length > 0 || lw.occupied) && (
        <View style={{ marginBottom: space.sm }}>
          {lw.besiegingTargets.length > 0 && (
            <Line label="At war." tone="bad">
              Its army besieges {lw.besiegingTargets.join(', ')}.
            </Line>
          )}
          {lw.besiegedBy.length > 0 && (
            <Line label="Under siege." tone="bad">
              {lw.besiegedBy.length >= 2
                ? `A coalition of ${lw.besiegedBy.join(', ')} holds the walls.`
                : `${lw.besiegedBy[0]} lays siege.`}
            </Line>
          )}
          {lw.occupied && (
            <Line label="Occupied." tone="bad">
              Held under {lw.occupied.occupier} by right of conquest
              {lw.occupied.sinceTick != null ? ` (since tick ${lw.occupied.sinceTick})` : ''}.
            </Line>
          )}
        </View>
      )}

      {/* ── Trade-war prizes ──────────────────────────────────────────── */}
      {tradeWars.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          {tradeWars.map(prize => (
            <Line key={prize.prizeId} label="Trade war." tone="warn">
              {prize.role === 'supplier'
                ? `Now the primary supplier of ${prize.commodityLabel} to ${prize.buyer}.`
                : prize.role === 'displaced'
                  ? `Displaced as supplier of ${prize.commodityLabel} to ${prize.buyer}.`
                  : `Contesting ${prize.commodityLabel} (${prize.buyer}).`}
            </Line>
          ))}
        </View>
      )}

      {/* ── Patron deity + faith effects ──────────────────────────────── */}
      {deity && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <View style={{ flexDirection: 'row', alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 3 }}>
            <Text style={{ ...type.body_em, fontSize: pt['11'], color: palette.ink, marginRight: 6 }}>
              {deity.name}
            </Text>
            {deity.rankAxis && <Tag tone="gold">{cap(deity.rankAxis)}</Tag>}
            {deity.alignmentAxis && <Tag tone={ALIGN_TONE[deity.alignmentAxis] || 'muted'}>{cap(deity.alignmentAxis)}</Tag>}
            {deity.temperamentAxis && <Tag tone={deity.temperamentAxis === 'warlike' ? 'bad' : 'cool'}>{cap(deity.temperamentAxis)}</Tag>}
          </View>
          {deity.domain && (
            <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], marginBottom: 3, fontStyle: 'italic' }}>
              Domain: {humanize(deity.domain)}
            </Text>
          )}
          {deity.effects.length > 0 && (
            <View>
              <Text style={{ ...type.label, color: palette.gold, fontSize: pt['7'] }}>FAITH EFFECTS</Text>
              {deity.effects.map((eff, i) => (
                <View key={i} style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'flex-start' }}>
                  <Text style={{ color: palette.gold, marginRight: 5, fontSize: pt['9.5'] }}>•</Text>
                  <Text style={{ ...type.body, flex: 1, fontSize: pt['9'], color: palette.second, lineHeight: 1.4 }}>{eff}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ── Realm pantheon standings ──────────────────────────────────── */}
      {pantheon.length > 0 && (
        <View style={{ marginBottom: space.sm }}>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>REALM PANTHEON</Text>
          {pantheon.map(p => (
            <View key={p.id} style={{ flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 }}>
              <Text style={{ ...type.body_em, fontSize: pt['9.5'], color: palette.ink, width: 120 }}>{p.name}</Text>
              <Text style={{ ...type.caption, color: palette.muted, fontSize: pt['8'], flex: 1 }}>
                {cap(p.tier)} · {p.seats} seat{p.seats === 1 ? '' : 's'}
                {p.tier !== 'major' && p.fromMajor > 0 ? ` · ${p.fromMajor} from Major` : ''}
                {p.wins || p.losses ? ` · ${p.wins}W/${p.losses}L` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* ── Named realm arcs ──────────────────────────────────────────── */}
      {realmArcs.length > 0 && (
        <View>
          <HairRule />
          <Text style={{ ...type.label, color: palette.gold, fontSize: pt['8'], marginBottom: 3 }}>REALM ARCS</Text>
          {realmArcs.map((arc, i) => (
            <View key={i} style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'flex-start' }}>
              <Text style={{ color: palette.gold, marginRight: 5, fontSize: pt['9.5'] }}>•</Text>
              <Text style={{ ...type.italic, flex: 1, fontSize: pt['9'], color: palette.second, lineHeight: 1.4 }}>{arc}</Text>
            </View>
          ))}
        </View>
      )}
    </PageChrome>
  );
}

export default FaithWar;
