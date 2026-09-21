/**
 * NpcTrailSection.jsx — "who this one contested, and what it cost them"
 * (LONG TAIL #39 / docs/world-pulse-roadmap.md §4d, the NPC half).
 *
 * RealmIntrigue, two blocks up in the same War door, says who stands where in the
 * court right now. This says how they got there: the ladder's own dated record of
 * head-to-head contests and real governing-seat changes — an archive the engine
 * has been keeping since the ladder shipped and that nothing outside the engine
 * ever read.
 *
 * ⛔ DM ONLY, AND THE GATE IS IN THE READ MODEL. Every row comes from
 * npcInteriority's groundTruth block, which is fail-closed on `includeGroundTruth`
 * (npcInteriorityRead.js's own constitution). Without ground truth this component
 * asks for nothing and renders nothing at all — there is no player-facing form of
 * this page, because a contest the loser never learned of is the loser's secret.
 *
 * ⚠ NAMES COME FROM THE SETTLEMENT'S OWN PERSISTED LADDER MIRROR
 * (`settlement.npcLadder.factions[].rungs[] = { npcId, name }`), which is the one
 * place a ladder nid is already paired with a person's name in display-safe state.
 * That is deliberate over re-deriving the composite nid rule here: a second
 * spelling of an engine key is a drift waiting to happen. THE PRICE IS STATED: a
 * figure the mirror no longer carries — one that has left every rung — is not
 * listed, and where such a figure appears as the OTHER party in someone else's
 * row the sentence names nobody rather than printing a key.
 *
 * READ-ONLY: no store write, no engine call, no persisted byte. A realm whose
 * ladder has recorded nothing renders NOTHING (the empty-state discipline).
 */

import { useMemo } from 'react';

import { useStore } from '../../store/index.js';
import { npcInteriority } from '../../domain/display/npcInteriorityRead.js';
import { tickCalendarDetailLabel } from '../../domain/display/humanizeEngineTokens.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, SP, sans } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

/** Every (npcId, name) pair the saved rosters' ladder mirrors carry, deduped. */
function nameByNidOf(saves) {
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const save of Array.isArray(saves) ? saves : []) {
    const factions = save?.settlement?.npcLadder?.factions;
    if (!factions || typeof factions !== 'object') continue;
    for (const key of Object.keys(factions)) {
      for (const rung of factions[key]?.rungs || []) {
        if (rung?.npcId && rung?.name) map.set(String(rung.npcId), String(rung.name));
      }
    }
  }
  return map;
}

/** One person's dated trail. */
function TrailCard({ name, rows }) {
  const mobile = useIsMobile();
  return (
    <div
      data-testid="npc-trail-row"
      style={{ border: `1px solid ${BORDER2}`, borderLeft: `3px solid ${GOLD}`, background: CARD, padding: '8px 10px', display: 'grid', gap: 4 }}
    >
      <div style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 850 }}>
        {`${name}: ${rows.length} recorded ${rows.length === 1 ? 'turning' : 'turnings'}`}
      </div>
      {rows.map(row => (
        <div
          key={row.id}
          data-testid="npc-trail-line"
          data-kind={row.kind}
          style={{ display: 'flex', gap: 6, color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5 }}
        >
          <span aria-hidden="true" style={{ color: SECOND, fontWeight: 900, flexShrink: 0 }}>•</span>
          <span>
            <span style={{ color: MUTED, fontWeight: 800 }}>
              {row.week == null ? 'at a time the record does not fix' : tickCalendarDetailLabel(row.week)}
            </span>
            {': '}
            {row.text}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * @param {{ campaign: any }} props
 */
export default function NpcTrailSection({ campaign }) {
  const mobile = useIsMobile();
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const saves = useStore(s => s.savedSettlements);
  // The court's dated record is DM knowledge — BeliefDivergenceBand's question
  // verbatim, and this file's census row says so.
  const includeGroundTruth = tier === 'premium' || elevated;

  const people = useMemo(() => {
    if (!includeGroundTruth) return [];
    const worldState = campaign?.worldState;
    if (!worldState) return [];
    const names = nameByNidOf(saves);
    const resolveNpcName = (nid) => names.get(String(nid)) || null;
    const tick = Number(worldState.tick) || 0;
    /** @type {Array<{ nid: string, name: string, rows: any[] }>} */
    const out = [];
    for (const [nid, name] of [...names.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))) {
      const view = npcInteriority({ npc: { name }, worldState, nid, tick, includeGroundTruth: true, resolveNpcName });
      const rows = view?.groundTruth?.trail || [];
      if (rows.length) out.push({ nid, name, rows });
    }
    return out;
  }, [campaign, saves, includeGroundTruth]);

  // Nothing recorded — or nobody entitled to read it — and the section is absent.
  if (people.length === 0) return null;

  return (
    <section
      data-testid="npc-trail"
      style={{ border: `1px solid ${BORDER}`, background: CARD_ALT, padding: '9px 11px', display: 'grid', gap: SP.sm }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {/* Text twin, not a lucide glyph (the LU-2 icons-off doctrine). */}
        <span aria-hidden="true" style={{ color: GOLD, fontWeight: 900, fontSize: chromeFontSize(FS.xs, mobile) }}>⚔</span>
        <span style={{ color: INK, fontFamily: sans, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 900 }}>
          Who contested whom
        </span>
        <span
          style={{ marginLeft: 'auto', color: GOLD, fontFamily: sans, fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 850 }}
          aria-label="The court's dated record: yours to know, and not shown in a player-facing view."
        >
          DM only
        </span>
      </div>
      <div style={{ display: 'grid', gap: 5 }}>
        {people.map(person => <TrailCard key={person.nid} name={person.name} rows={person.rows} />)}
      </div>
      <div style={{ color: MUTED, fontFamily: sans, fontSize: proseFontSize(FS.micro, mobile), lineHeight: 1.5 }}>
        Every line is a contest the ladder opened or a seat that actually changed hands. A figure
        who has left every rung is no longer listed here, and where one appears in someone else&rsquo;s
        line it goes unnamed rather than shown as a record key.
      </div>
    </section>
  );
}
