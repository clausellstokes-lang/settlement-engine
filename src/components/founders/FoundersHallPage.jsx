/**
 * founders/FoundersHallPage.jsx — THE FOUNDERS' HALL (/founders).
 *
 * Thirty numbered chairs, I–XXX, ALL BY INVITATION and NONE EVER SOLD
 * (docs/DESIGN_FOUNDERS_HALL.md). Not a modal, not a section: a place. This file
 * is the place's composition; every rule it obeys lives in lib/foundersHall.js
 * so the ceremony and the truth can never drift.
 *
 * WHAT REPLACED WHAT. This surface supersedes the seat-LINEAGE page (the $99
 * transferable-seat design of the Founder lane brief). Three things died with
 * that design and none of them may come back:
 *   • the purchase path — a chair is granted, never bought (§1);
 *   • the transfer/lineage rows — a chair is bound to one founder permanently (§2);
 *   • the vacant pedestals — the roll renders HELD CHAIRS ONLY, so a hall of three
 *     is a hall of three, never a hall of twenty-seven vacancies (§2 display law).
 *
 * THE LADDER HOLDS EVEN HERE (§2b):
 *   glance    — how many chairs are held, of thirty;
 *   sentence  — any plate, read aloud (each plate's accessible name is the sentence);
 *   table     — the roll as a real table beneath the ceremony, so the Hall is never
 *               the only path to the facts.
 *
 * FAIL-CLOSED + ZERO EAGER. The chair projection is undeployed (its schema is
 * owner-gated, §8), so today this renders the dignified pre-launch Hall: the
 * covenant, an honest counter, and the letterbox. The route is lazy and every
 * backend module is dynamically imported on mount.
 *
 * @param {{ onNavigate?: (view: string) => void }} props
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import Page from '../primitives/Page.jsx';
import { useStore } from '../../store/index.js';
import ChairPlate from './ChairPlate.jsx';
import ChairDrawer from './ChairDrawer.jsx';
import HallCovenant from './HallCovenant.jsx';
import RequestChairLetter from './RequestChairLetter.jsx';
import { HALL, HALL_CEREMONY_CSS, covenantProseStyle, quietLineStyle, numeralStyle } from './hallRegister.js';
import {
  HALL_CHAIR_COUNT, buildHallRoll, hallCount, showsRequestControl,
  chairNumeral, seatedLabel,
} from '../../lib/foundersHall.js';
import { PAGE_MAX, SP, FS, sans, serif_ } from '../theme.js';

/** The glance line. Held and open come from ONE count object — they cannot drift. */
function HallCounter({ count }) {
  return (
    <p
      aria-live="polite"
      style={{
        margin: 0, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: HALL.gold,
      }}
    >
      {count.held === 0
        ? `${count.total} chairs stand ready`
        : `${count.held} of ${count.total} chairs held`}
    </p>
  );
}

/** The table rung of the ladder — folded away, but always reachable. */
function HallTable({ roll }) {
  if (roll.length === 0) return null;
  const cell = { padding: `${SP.xs}px ${SP.md}px ${SP.xs}px 0`, textAlign: 'left', fontFamily: sans, fontSize: FS.xs, color: HALL.body };
  return (
    <details style={{ marginTop: SP.lg }}>
      <summary style={{ ...quietLineStyle, color: HALL.gold, cursor: 'pointer', fontWeight: 700 }}>
        The roll, as a table
      </summary>
      <table style={{ marginTop: SP.sm, borderCollapse: 'collapse', width: '100%' }}>
        <caption style={{ ...quietLineStyle, color: HALL.faint, textAlign: 'left', paddingBottom: SP.xs }}>
          Every held chair, in the order the Hall shows them.
        </caption>
        <thead>
          <tr>
            <th scope="col" style={{ ...cell, color: HALL.faint }}>Chair</th>
            <th scope="col" style={{ ...cell, color: HALL.faint }}>Founder</th>
            <th scope="col" style={{ ...cell, color: HALL.faint }}>Seated</th>
          </tr>
        </thead>
        <tbody>
          {roll.map((c) => (
            <tr key={c.chair}>
              <th scope="row" style={{ ...cell, color: HALL.gold, fontWeight: 700 }}>{chairNumeral(c.chair)}</th>
              <td style={cell}>{c.displayName || 'Held'}</td>
              <td style={cell}>{seatedLabel(c.seatedAt) || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

export default function FoundersHallPage({ onNavigate: _onNavigate }) {
  const auth = useStore((s) => s.auth);
  const [chairs, setChairs] = useState([]);
  const [openChair, setOpenChair] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchFounderChairs } = await import('../../lib/foundersHall.js');
        const live = await fetchFounderChairs();
        if (!cancelled) setChairs(live);
      } catch {
        /* fail-closed: the pre-launch Hall is a complete Hall */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const roll = useMemo(() => buildHallRoll(chairs), [chairs]);
  const count = useMemo(() => hallCount(roll), [roll]);
  const letterboxOpen = showsRequestControl(count);

  // The letterbox's backend seam is imported lazily at the moment it is used, so
  // a visitor who never writes a letter never fetches its module.
  const loadStanding = useCallback(async (userId) => {
    const { fetchChairRequestStanding } = await import('../../lib/founderChairRequest.js');
    return fetchChairRequestStanding(userId);
  }, []);
  const submitLetter = useCallback(async (letter) => {
    const { submitChairRequest } = await import('../../lib/founderChairRequest.js');
    return submitChairRequest(letter);
  }, []);

  return (
    <div style={{ background: HALL.ground }}>
      <style>{HALL_CEREMONY_CSS}</style>
      <Page max={PAGE_MAX}>
        {/* The Hall's own header: the ceremonial register renders gold-on-dark, so
            it does not route through PageHeader (whose INK title is built for
            parchment and would be unreadable here). */}
        <header style={{ marginBottom: SP.xl }}>
          <p style={{ ...numeralStyle, margin: `0 0 ${SP.xs}px` }}>By invitation, I&ndash;XXX</p>
          <h1 style={{
            margin: 0, fontFamily: serif_, fontSize: FS['28'], fontWeight: 700,
            color: HALL.ink, lineHeight: 1.12,
          }}>
            The Founders&rsquo; Hall
          </h1>
          <p style={{ ...covenantProseStyle, marginTop: SP.sm, fontStyle: 'italic' }}>
            Thirty chairs, given to the people who carried SettlementForge before it
            could carry itself.
          </p>
        </header>

        <div style={{ marginBottom: SP.lg }}><HallCounter count={count} /></div>

        {/* THE ROLL — held chairs only. Zero unfilled slots reach the DOM. */}
        {roll.length > 0 ? (
          <ul style={{
            margin: 0, padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: SP.md,
          }}>
            {roll.map((chair, i) => (
              <ChairPlate key={chair.chair} chair={chair} index={i} onOpen={setOpenChair} />
            ))}
          </ul>
        ) : (
          <p style={covenantProseStyle}>
            No chair has been taken yet. The Hall opens with its covenant, and the
            first name will be written into it by invitation.
          </p>
        )}

        <HallTable roll={roll} />

        <div style={{ marginTop: SP.xxl }}><HallCovenant /></div>

        {/* THE PRESENCE LAW (§5b): at thirty held the Request control is ABSENT —
            not disabled — and the completed truth stands in its place. Both arms
            derive from the SAME count the glance line renders. */}
        <div style={{ marginTop: SP.xl }}>
          {letterboxOpen ? (
            <RequestChairLetter auth={auth} onSubmit={submitLetter} onLoadStanding={loadStanding} />
          ) : (
            <p style={{ ...covenantProseStyle, color: HALL.ink }}>
              The Hall is full &mdash; {HALL_CHAIR_COUNT} chairs, {HALL_CHAIR_COUNT} names.
            </p>
          )}
        </div>
      </Page>

      <ChairDrawer chair={openChair} onClose={() => setOpenChair(null)} />
    </div>
  );
}
