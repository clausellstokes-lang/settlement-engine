/**
 * WarCausalBrief.jsx — THE DRAMATIC-IRONY LEGIBILITY LINE, mounted (ambition-fit-1).
 *
 * The vision's flagship legibility read — warCausalBrief (peaceReasons.js) — was
 * built and tested but rendered by ZERO surfaces. This is its surface: the "Reasons"
 * lane the DM reads beside a treaty and beneath a live siege. It shows, for a
 * settlement pair, the typed WAR reasons pressing them apart and the PEACE reasons
 * pulling them together, each with its own receipt, and the dramatic-irony line the
 * design names ("4 of 6 peace reasons now present; this war is dying").
 *
 * PRESENTATION ONLY. Pure over the read-model — no store, no mutation. Self-gating:
 * a pair with no present reasons renders nothing (byte-identical). Lazy-loaded by
 * TreatyPanel / LiveWarStatus (both ride the Realm Inspector lazy chunk), so it and
 * the read-model add ZERO first-paint bytes.
 */

import { useMemo } from 'react';
import { Scale, Swords, HeartHandshake } from 'lucide-react';

import { warCausalBrief } from '../../domain/worldPulse/peaceReasons.js';
import { human } from './WorldPulseData.js';
import { INK, BODY, MUTED, SECOND, CARD, BORDER, BORDER2, RED, GREEN, sans, FS, SP } from '../theme.js';

/** One reason row: its human-named type + the ledger receipt. */
function ReasonRow({ type, receipt, tone }) {
  const accent = tone === 'war' ? RED : GREEN;
  return (
    <li style={{ display: 'flex', gap: 6, alignItems: 'flex-start', lineHeight: 1.4 }}>
      <span aria-hidden style={{ color: accent, flexShrink: 0, marginTop: 2, fontSize: FS.pico }}>●</span>
      <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs }}>
        <span style={{ color: INK, fontWeight: 800 }}>{human(type)}</span>
        {receipt ? <span style={{ color: SECOND }}> — {receipt}</span> : null}
      </span>
    </li>
  );
}

/**
 * @param {Object} props
 * @param {any} props.worldState        the live worldState (war/peace reason ledgers).
 * @param {string|number} props.partyId
 * @param {string|number} props.foeId
 * @param {boolean} [props.compact]     compact ⇒ only the dramatic-irony line (LiveWarStatus).
 * @returns {import('react').ReactElement|null}
 */
export default function WarCausalBrief({ worldState, partyId, foeId, compact = false }) {
  const brief = useMemo(
    () => (worldState && partyId != null && foeId != null ? warCausalBrief(worldState, partyId, foeId) : null),
    [worldState, partyId, foeId],
  );
  if (!brief) return null;
  const warReasons = brief.war.filter((r) => r.present);
  const peaceReasons = brief.peace.filter((r) => r.present);
  if (warReasons.length === 0 && peaceReasons.length === 0) return null;

  // The dramatic-irony line only reads when at least one peace reason has landed
  // (an empty peace side has nothing ironic to say).
  const ironyLine = peaceReasons.length > 0 ? brief.line : null;

  if (compact) {
    if (!ironyLine) return null;
    return (
      <div data-testid="war-causal-brief-line" style={{ display: 'flex', gap: 5, alignItems: 'center', color: SECOND, fontFamily: sans, fontSize: FS.pico, fontStyle: 'italic', lineHeight: 1.4 }}>
        <Scale size={11} color={MUTED} aria-hidden style={{ flexShrink: 0 }} />
        <span>{ironyLine}.</span>
      </div>
    );
  }

  return (
    <div data-testid="war-causal-brief" style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: SP.xs, border: `1px solid ${BORDER2}`, background: CARD }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Scale size={12} color={MUTED} aria-hidden />
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.pico, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Reasons
        </span>
      </div>
      {warReasons.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: RED, fontFamily: sans, fontSize: FS.pico, fontWeight: 800, borderBottom: `1px solid ${BORDER}`, paddingBottom: 3, marginBottom: 4 }}>
            <Swords size={11} color={RED} aria-hidden /> Toward war
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {warReasons.map((r) => <ReasonRow key={`w-${r.type}`} type={r.type} receipt={r.receipt} tone="war" />)}
          </ul>
        </div>
      )}
      {peaceReasons.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: GREEN, fontFamily: sans, fontSize: FS.pico, fontWeight: 800, borderBottom: `1px solid ${BORDER}`, paddingBottom: 3, marginBottom: 4 }}>
            <HeartHandshake size={11} color={GREEN} aria-hidden /> Toward peace
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
            {peaceReasons.map((r) => <ReasonRow key={`p-${r.type}`} type={r.type} receipt={r.receipt} tone="peace" />)}
          </ul>
        </div>
      )}
      {ironyLine && (
        <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.pico, fontStyle: 'italic', lineHeight: 1.4 }}>
          {ironyLine}.
        </div>
      )}
    </div>
  );
}
