/**
 * LiveWarStatus.jsx — the World Pulse panel's LIVE Faith & War block (§S3).
 *
 * Reads the LIVE worldState ledgers (deployments / tradeWarState / dispositionStats)
 * + the live regional graph (war_front coalitions) through the pure
 * domain/display/warStatus helpers and renders the current war / siege /
 * trade-war / disposition standings. This is the LIVE read-path the plan flags as
 * missing — the cards reflect the post-pulse world, not stale generation fields.
 *
 * INERT WHEN ABSENT: hasLiveWarState gates the whole block; a no-war campaign
 * renders nothing (byte-identical). Pure presentational — every value arrives via
 * props / the live store-fed campaign.
 */

import { Swords, Flag, ArrowLeftRight } from 'lucide-react';
import { Section } from './WorldPulsePrimitives.jsx';
import { human } from './WorldPulseData.js';
import {
  activeDeployments,
  dispositionStandings,
  hasLiveWarState,
  liveSieges,
  liveTradeWars,
} from '../../domain/display/warStatus.js';
import { liveBlockades, hasLiveBlockades } from '../../domain/display/navalDisplay.js';
import { BLUE, BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, RED, sans, swatch } from '../theme.js';
import WarCausalBrief from './WarCausalBrief.jsx';

function nameFor(nameById, id) {
  return nameById.get(String(id)) || String(id);
}

// Tone drives BOTH channels: the left-accent color AND a leading kind glyph, so
// severity never reads on color alone (1.4.1 use-of-color). danger→siege swords,
// trade→exchange arrows, default→deployment flag.
const TONE_ICON = { danger: Swords, trade: ArrowLeftRight, neutral: Flag };

// `heading` (not `title`) — a rendered heading div, never a native OS tooltip
// (keeps these rows off the title= census the guidance walker ratchets).
function StatusRow({ tone = 'neutral', heading, detail }) {
  const accent = tone === 'danger' ? RED : tone === 'trade' ? BLUE : GOLD;
  const KindIcon = TONE_ICON[tone] || Flag;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px 8px',
      alignItems: 'start',
      padding: '8px 10px',
      border: `1px solid ${BORDER2}`,
      borderLeft: `3px solid ${accent}`,
      background: CARD,
    }}>
      <KindIcon size={14} color={accent} aria-hidden style={{ gridRow: '1 / span 2', marginTop: 2, flexShrink: 0 }} />
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, lineHeight: 1.3 }}>{heading}</div>
      {detail && <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.4 }}>{detail}</div>}
    </div>
  );
}

export default function LiveWarStatus({ campaign, nameById = new Map() }) {
  const worldState = campaign?.worldState || {};
  const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;

  // experience-product-fit-5: a standing blockade lights the panel even when no
  // land war does ("a blockade is the same as a siege").
  if (!hasLiveWarState({ worldState, regionalGraph }) && !hasLiveBlockades(worldState)) return null;

  const sieges = liveSieges({ worldState, regionalGraph });
  const deployments = activeDeployments(worldState);
  const tradeWars = liveTradeWars({ worldState, regionalGraph });
  const standings = dispositionStandings(worldState);
  const blockades = liveBlockades(worldState);
  const count = sieges.length + blockades.length + deployments.length + tradeWars.length + standings.length;

  return (
    <Section title="War, Trade and Faith" count={count}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sieges.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Subhead label="Active sieges" />
            {sieges.map(siege => {
              const targetName = nameFor(nameById, siege.targetId);
              const attackers = siege.coalition.map(id => nameFor(nameById, id));
              const isCoalition = siege.coalition.length >= 2;
              return (
                <StatusRow
                  key={`siege-${siege.targetId}`}
                  tone="danger"
                  heading={isCoalition
                    ? `The War of ${targetName}, a coalition besieging the walls`
                    : `${attackers[0] || 'An army'} lays siege to ${targetName}`}
                  detail={<>
                    {isCoalition
                      ? `Coalition: ${attackers.join(', ')} (${siege.frontCount} fronts).`
                      : `${siege.frontCount} active war front${siege.frontCount === 1 ? '' : 's'}.`}
                    {/* ambition-fit-1: the dramatic-irony line — is this siege's war
                        already dying under the peace reasons? Self-gates to nothing. */}
                    <WarCausalBrief worldState={worldState} partyId={siege.coalition[0]} foeId={siege.targetId} compact />
                  </>}
                />
              );
            })}
          </div>
        )}

        {blockades.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Subhead label="Sea blockades" />
            {blockades.map(b => {
              const portName = nameFor(nameById, b.portId);
              const fleets = b.blockaders.map(id => nameFor(nameById, id));
              const isCoalition = b.blockaders.length >= 2;
              const phrase = `${b.phrase.charAt(0).toUpperCase()}${b.phrase.slice(1)}`;
              return (
                <StatusRow
                  key={`blockade-${b.portId}`}
                  tone="danger"
                  heading={isCoalition
                    ? `${portName} is blockaded by a coalition fleet`
                    : `${fleets[0] || 'A hostile fleet'} blockades ${portName}`}
                  detail={isCoalition
                    ? `${phrase}. ${fleets.join(', ')} command the sea approaches.`
                    : `${phrase}. The sea approaches are held.`}
                />
              );
            })}
          </div>
        )}

        {deployments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Subhead label="Armies abroad" />
            {deployments.map(dep => (
              <StatusRow
                key={`deploy-${dep.homeId}`}
                heading={`${nameFor(nameById, dep.homeId)}'s army is committed against ${nameFor(nameById, dep.targetId)}`}
                detail={`Deployed since tick ${dep.sinceTick}; home garrison thinned, war chest bleeding.`}
              />
            ))}
          </div>
        )}

        {tradeWars.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Subhead label="Trade wars" />
            {tradeWars.map(war => (
              <StatusRow
                key={`trade-${war.prizeId}`}
                tone="trade"
                heading={`The ${war.commodityLabel} Trade War`}
                detail={`${nameFor(nameById, war.winnerId)} now supplies ${nameFor(nameById, war.buyerId)}${war.incumbentId ? `, displacing ${nameFor(nameById, war.incumbentId)}` : ''}.`}
              />
            ))}
          </div>
        )}

        {standings.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Subhead label="War standings" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {standings.map(s => {
                const aggressor = s.score > 0;
                return (
                  <span key={`disp-${s.id}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '3px 8px',
                    border: `1px solid ${BORDER2}`,
                    background: aggressor ? swatch.dangerBg : CARD_ALT,
                    color: aggressor ? RED : BODY,
                    fontFamily: sans, fontSize: FS.xxs, fontWeight: 800,
                  }}>
                    {nameFor(nameById, s.id)}: {s.wins}W / {s.losses}L
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

function Subhead({ label }) {
  return (
    <div style={{
      color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      borderBottom: `1px solid ${BORDER}`, paddingBottom: 4,
    }}>
      {human(label)}
    </div>
  );
}
