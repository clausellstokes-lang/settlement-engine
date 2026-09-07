/**
 * PerspectiveStandings.jsx — DESK-4: "the world as X believes it".
 *
 * One settlement picked as the OBSERVER; every relation it holds phrased in
 * plain language, each term carrying its explainer (tooltips via aria-label —
 * the churn-badge idiom, never a bare jargon word). HONESTLY BELIEF-SCOPED:
 * the war edges and treaty roles are the realm's own public facts (the same
 * warStatus / treatyDocument reads the War and Trade doors already render);
 * the BELIEVED half (what the observer privately models about its neighbours)
 * is DM knowledge by settlementBeliefs' own fail-closed constitution and
 * renders only under the includeGroundTruth convention.
 *
 * THE REFUSED HALF, kept refused: upstream's omniscient N×N relations matrix
 * is deliberately NOT adopted — only the relations the data actually records
 * render, one observer at a time, and a pair with nothing recorded renders
 * nothing (never a fabricated "neutral").
 *
 * Mounts in the War door beside BeliefDivergenceBand (same gating family).
 * Pure read; no store writes; no persisted state.
 */

import { useMemo, useState } from 'react';

import { useStore } from '../../store/index.js';
import { settlementWarStatus } from '../../domain/display/warStatus.js';
import { liveWarNames } from '../../domain/display/warAndRoadNames.js';
import { renderTreatiesForSettlement } from '../../domain/display/treatyDocument.js';
import { settlementBeliefs, hasBeliefMaps } from '../../domain/display/settlementBeliefs.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, SP, sans } from '../theme.js';

const TERM_HELP = Object.freeze({
  siege: 'A live siege from the war ledgers: a public fact of the realm.',
  coalition: 'March-mates in the same named war, read from the war edges.',
  treaty: 'A standing treaty document; the role word is the ledger\'s own.',
  belief: 'What this settlement privately believes: its own scouts and rumors, not necessarily the truth. DM knowledge.',
});

function Line({ kind, children }) {
  return (
    <div
      aria-label={TERM_HELP[kind]}
      style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5, display: 'flex', gap: 6 }}
    >
      <span style={{ color: kind === 'belief' ? GOLD : SECOND, fontWeight: 900, flexShrink: 0 }}>•</span>
      <span>{children}</span>
    </div>
  );
}

/**
 * @param {{ campaign: any, nameById?: Map<string,string> }} props
 */
export default function PerspectiveStandings({ campaign, nameById }) {
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  // The believed half is DM knowledge (the includeGroundTruth convention).
  const includeGroundTruth = tier === 'premium' || elevated;

  const ids = useMemo(() => (campaign?.settlementIds || []).map(String), [campaign]);
  const nameFor = useMemo(() => (id) => nameById?.get(String(id)) || String(id), [nameById]);
  const [pickedId, setPickedId] = useState(null);
  const observerId = pickedId != null && ids.includes(pickedId) ? pickedId : (ids[0] || null);

  const rows = useMemo(() => {
    if (!observerId) return [];
    const worldState = campaign?.worldState || {};
    const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;
    /** @type {Array<{ key: string, kind: string, text: string }>} */
    const out = [];

    // The realm's public war facts, from the observer's own standpoint.
    const status = settlementWarStatus({ settlementId: observerId, worldState, regionalGraph });
    for (const id of status?.besiegingTargets || []) {
      out.push({ key: `siege-out:${id}`, kind: 'siege', text: `lays siege to ${nameFor(id)}.` });
    }
    for (const id of status?.besiegedBy || []) {
      out.push({ key: `siege-in:${id}`, kind: 'siege', text: `is besieged by ${nameFor(id)}.` });
    }
    for (const war of liveWarNames({ worldState, nameFor })) {
      if (!war.participants.includes(observerId) && war.defenderId !== observerId) continue;
      const mates = war.participants.filter(id => id !== observerId);
      if (war.participants.includes(observerId) && mates.length > 0) {
        out.push({ key: `coalition:${war.key}`, kind: 'coalition', text: `campaigns beside ${mates.map(nameFor).join(', ')} in ${war.name}.` });
      }
    }

    // Standing treaties — the ledger's own role words.
    for (const doc of renderTreatiesForSettlement(worldState, observerId)) {
      const otherId = String(doc.victorId) === String(observerId) ? doc.loserId : doc.victorId;
      const role = String(doc.victorId) === String(observerId)
        ? (doc.receiverRole || 'victor')
        : (doc.giverRole || 'the bound party');
      out.push({ key: `treaty:${doc.pairKey}`, kind: 'treaty', text: `is bound to ${nameFor(otherId)} by ${doc.title} (as ${role}), ${doc.complianceState}.` });
    }

    // The BELIEVED half — DM only, fail-closed at the read-model itself.
    if (includeGroundTruth && hasBeliefMaps(worldState)) {
      for (const b of settlementBeliefs({ worldState, observerId, includeGroundTruth: true, nameFor })) {
        out.push({
          key: `belief:${b.subjectId}`,
          kind: 'belief',
          text: `believes ${b.subjectName} ${b.believed.strengthWord}, ${b.believed.readinessWord} (${b.confidence}, word ${b.staleness}).`,
        });
      }
    }
    return out;
  }, [campaign, observerId, nameFor, includeGroundTruth]);

  // A realm with no settlements has no standpoint; render nothing at all.
  if (!observerId) return null;

  return (
    <section data-testid="perspective-standings" style={{ border: `1px solid ${BORDER}`, background: CARD_ALT, padding: '9px 11px', display: 'grid', gap: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {/* Text twin, not a lucide glyph (the LU-2 icons-off doctrine; also keeps
            the icon census untouched). */}
        <span aria-hidden="true" style={{ color: GOLD, fontWeight: 900, fontSize: FS.xs }}>◉</span>
        <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
          The world as {nameFor(observerId)} knows it
        </span>
        <select
          aria-label="Pick the observing settlement"
          value={observerId}
          onChange={(e) => setPickedId(e.target.value)}
          style={{ marginLeft: 'auto', fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, color: INK, background: CARD, border: `1px solid ${BORDER2}`, padding: '2px 6px' }}
        >
          {ids.map(id => <option key={id} value={id}>{nameFor(id)}</option>)}
        </select>
      </div>
      {rows.length === 0 ? (
        <div style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontStyle: 'italic', lineHeight: 1.5 }}>
          {nameFor(observerId)} records no standing toward another settlement: no siege, no treaty{includeGroundTruth ? ', no modelled belief' : ''}.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 4 }}>
          {rows.map(row => <Line key={row.key} kind={row.kind}>{`${nameFor(observerId)} ${row.text}`}</Line>)}
        </div>
      )}
    </section>
  );
}
