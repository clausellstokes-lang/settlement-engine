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

import { Section } from './WorldPulsePrimitives.jsx';
import { human } from './WorldPulseData.js';
import {
  activeDeployments,
  dispositionStandings,
  hasLiveWarState,
  liveSieges,
  liveTradeWars,
} from '../../domain/display/warStatus.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, RED, sans, swatch } from '../theme.js';

function nameFor(nameById, id) {
  return nameById.get(String(id)) || String(id);
}

function StatusRow({ tone = 'neutral', title, detail }) {
  const accent = tone === 'danger' ? RED : tone === 'trade' ? '#0f766e' : GOLD;
  return (
    <div style={{
      display: 'grid', gap: 2,
      padding: '8px 10px',
      border: `1px solid ${BORDER2}`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: 6,
      background: CARD,
    }}>
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, lineHeight: 1.3 }}>{title}</div>
      {detail && <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.4 }}>{detail}</div>}
    </div>
  );
}

export default function LiveWarStatus({ campaign, nameById = new Map() }) {
  const worldState = campaign?.worldState || {};
  const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;

  if (!hasLiveWarState({ worldState, regionalGraph })) return null;

  const sieges = liveSieges({ worldState, regionalGraph });
  const deployments = activeDeployments(worldState);
  const tradeWars = liveTradeWars({ worldState, regionalGraph });
  const standings = dispositionStandings(worldState);
  const count = sieges.length + deployments.length + tradeWars.length + standings.length;

  return (
    <Section title="War, Trade & Faith" count={count}>
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
                  title={isCoalition
                    ? `The War of ${targetName} — a coalition besieges the walls`
                    : `${attackers[0] || 'An army'} lays siege to ${targetName}`}
                  detail={isCoalition
                    ? `Coalition: ${attackers.join(', ')} (${siege.frontCount} fronts).`
                    : `${siege.frontCount} active war front${siege.frontCount === 1 ? '' : 's'}.`}
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
                title={`${nameFor(nameById, dep.homeId)}'s army is committed against ${nameFor(nameById, dep.targetId)}`}
                detail={`Deployed since tick ${dep.sinceTick} — home garrison thinned, war chest bleeding.`}
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
                title={`The ${war.commodityLabel} Trade War`}
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
                    padding: '3px 8px', borderRadius: 6,
                    border: `1px solid ${BORDER2}`,
                    background: aggressor ? swatch.dangerBg || '#fbeaea' : CARD_ALT,
                    color: aggressor ? RED : MUTED,
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
