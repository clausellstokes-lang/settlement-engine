/**
 * RealmIntrigue.jsx — the DM's court-and-standing block (domain-display-readmodels-4
 * residue). Surfaces the two engine systems that had no display consumer:
 *
 *   • POLITICS blocs / conspiracies (politicsRead) — coalitions inside the walls,
 *     and (DM view: includeCovert) the covert conspiracies against a seat.
 *   • CREDIBILITY (credibilityRead) — the Blainey stock that discounts a
 *     settlement's claims.
 *
 * DM territory: this sits in the Realm Inspector (never a party-facing surface),
 * so the covert conspiracies are surfaced. INERT WHEN ABSENT: returns null when
 * both ledgers are dormant (byte-identical). Pure presentational — values arrive
 * via the live store-fed campaign.
 */
import { Section } from './WorldPulsePrimitives.jsx';
import { realmPolitics, hasPolitics } from '../../domain/display/politicsRead.js';
import { realmCredibility, hasCredibility } from '../../domain/display/credibilityRead.js';
import { BODY, BORDER2, CARD, FS, INK, MUTED, RED, GOLD, sans } from '../theme.js';
import { AffectedSettlements } from './AddressChain.jsx';

function Subhead({ label }) {
  return (
    <div style={{
      color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900,
      textTransform: 'uppercase', letterSpacing: '0.06em',
      borderBottom: `1px solid ${BORDER2}`, paddingBottom: 4,
    }}>
      {label}
    </div>
  );
}

function Row({ accent, heading, detail, addressIds = [] }) {
  return (
    <div style={{
      padding: '8px 10px', border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${accent}`,
      background: CARD,
    }}>
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, lineHeight: 1.3 }}>{heading}</div>
      {detail && <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.4 }}>{detail}</div>}
      {/* THE NEWS ADDRESS LAW: the settlement this bloc/standing sits in, LINKED. */}
      {addressIds.length > 0 && <div style={{ marginTop: 2 }}><AffectedSettlements ids={addressIds} label="Settlement" /></div>}
    </div>
  );
}

export default function RealmIntrigue({ campaign, nameById = new Map() }) {
  const worldState = campaign?.worldState || {};
  if (!hasPolitics(worldState) && !hasCredibility(worldState)) return null;

  const nameFor = (id) => nameById.get(String(id)) || String(id);
  const tick = worldState.tick ?? 0;
  // DM view: conspiracies surfaced (the Realm Inspector is never party-facing).
  const politics = realmPolitics({ worldState, includeCovert: true, nameFor });
  const credibility = realmCredibility({ worldState, tick, nameFor });
  const count = politics.reduce((n, p) => n + p.blocs.length, 0) + credibility.length;

  return (
    <Section title="Court & Standing" count={count}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {politics.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Subhead label="Factions & conspiracies" />
            {politics.flatMap(p => p.blocs.map(b => (
              <Row
                key={`${p.settlementId}-${b.id}`}
                accent={b.covert ? RED : GOLD}
                addressIds={[p.settlementId]}
                heading={`${p.where}: ${b.covert ? 'a conspiracy' : 'a bloc'}${b.memberCount >= 2 ? ` of ${b.memberCount}` : ''}`}
                detail={<>{b.presence} <span style={{ color: MUTED }}>({b.cohesion})</span></>}
              />
            )))}
          </div>
        )}

        {credibility.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            <Subhead label="Standing (whose word is believed)" />
            {credibility.map(c => (
              <Row
                key={`cred-${c.settlementId}`}
                accent={c.band <= 0 ? RED : c.band >= 2 ? GOLD : BORDER2}
                addressIds={[c.settlementId]}
                heading={`${c.where}: ${c.reputation}`}
                detail={c.presence}
              />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
