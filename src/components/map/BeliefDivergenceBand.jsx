/**
 * BeliefDivergenceBand.jsx — the DM's "what they believe vs what is true" band
 * (experience-product-fit-2). Wires the built-and-tested settlementBeliefs read-model
 * (Phase 5.5 Wave A) — which had ZERO UI consumers — into the Realm Inspector's War &
 * Diplomacy surface, so the fog of war becomes watchable: for each settlement that
 * models the realm, what it believes about the others (their strength, war readiness,
 * the bond between them, their faith), with a confidence + staleness band, and — when
 * a ground-truth provider is supplied — exactly where that belief is WRONG.
 *
 * THE ASYMMETRY SEAM (mirrors RumorsTab / FaithSection). Beliefs are inherently DM
 * knowledge. The read-model follows the includeGroundTruth convention: the PLAYER
 * projection (the default, fail-closed) is EMPTY, and only a premium / elevated DM
 * view passes includeGroundTruth:true. This band is rendered ONLY inside the DM's
 * Realm Inspector (never a shared/public dossier or a free/anon PDF export), and it
 * additionally self-gates to nothing for a non-premium viewer — so a settlement's
 * internal model of the world, and any deity name it carries, never reaches a player.
 *
 * Self-gates on hasBeliefMaps (a dormant / belief-inactive world carries no belief
 * ledger ⇒ the band renders nothing ⇒ byte-identical UI). Lazy: mounted inside the
 * already-lazy Realm Inspector chunk, so no first-paint bytes.
 *
 * DIVERGENCE JOIN (truthOf): the read-model reports a per-axis divergence when the
 * caller supplies the current ground truth for a subject. That truth is assembled by
 * the kernel's GroundTruthCtx (settlementStrength + the pressure index); building it
 * in the display layer would duplicate that engine-internal logic (a two-writer
 * hazard), so v1 ships the belief band without the truth join — a documented,
 * scoped follow-up. The divergence rows below are already wired for the day a
 * display-safe truth provider lands.
 */

import { useMemo } from 'react';
import { Eye } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { settlementBeliefs, hasBeliefMaps } from '../../domain/display/settlementBeliefs.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GOLD_BG, INK, MUTED, SECOND, SP, sans } from '../theme.js';

const CONFIDENCE_LABEL = { certain: 'certain', confident: 'confident', uncertain: 'uncertain', vague: 'only a vague sense' };
const STALENESS_LABEL = { current: 'current', aging: 'aging', stale: 'stale' };

function Pill({ children, tone }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '1px 7px', borderRadius: 999,
      border: `1px solid ${tone === 'warn' ? GOLD : BORDER2}`,
      background: tone === 'warn' ? GOLD_BG : CARD,
      color: tone === 'warn' ? GOLD : SECOND,
      fontFamily: sans, fontSize: FS.micro, fontWeight: 800, whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

function BeliefRow({ belief }) {
  const b = belief.believed || {};
  const divergence = Array.isArray(belief.divergence) ? belief.divergence : [];
  return (
    <article style={{
      border: `1px solid ${divergence.length ? GOLD : BORDER}`,
      background: divergence.length ? GOLD_BG : CARD,
      padding: '8px 10px',
    }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', flexWrap: 'wrap' }}>
        <strong style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, overflowWrap: 'anywhere' }}>
          {belief.subjectName}
        </strong>
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
          believed {b.strengthWord}, {b.readinessWord}
        </span>
      </div>
      <div style={{ marginTop: 5, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        <Pill>{CONFIDENCE_LABEL[belief.confidence] || belief.confidence}</Pill>
        <Pill>{STALENESS_LABEL[belief.staleness] || belief.staleness}{belief.agoTicks > 0 ? ` · ${belief.agoTicks}w ago` : ''}</Pill>
        {b.allianceLabel && b.allianceLabel !== 'unknown' && <Pill>reads the bond as {String(b.allianceLabel).replace(/_/g, ' ')}</Pill>}
        {b.faithLabel && <Pill>faith {b.faithLabel}</Pill>}
      </div>
      {divergence.length > 0 && (
        <ul style={{ margin: '6px 0 0', paddingLeft: 15, color: SECOND, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.5 }}>
          {divergence.map((line, i) => <li key={i} style={{ marginBottom: 2 }}>{line}</li>)}
        </ul>
      )}
    </article>
  );
}

/**
 * @param {{ campaign: any, nameById?: Map<string, string> }} props
 */
export default function BeliefDivergenceBand({ campaign, nameById }) {
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  // includeGroundTruth convention: beliefs are DM knowledge. Premium / elevated only;
  // every other viewer gets the empty player projection (fail-closed).
  const includeGroundTruth = tier === 'premium' || elevated;

  const nameFor = useMemo(() => (/** @type {any} */ id) => nameById?.get(String(id)) || String(id), [nameById]);
  const worldState = campaign?.worldState || null;

  const observers = useMemo(() => {
    if (!includeGroundTruth || !hasBeliefMaps(worldState)) return [];
    return (campaign?.settlementIds || [])
      .map((/** @type {any} */ id) => ({
        observerId: String(id),
        name: nameFor(id),
        beliefs: settlementBeliefs({ worldState, observerId: String(id), includeGroundTruth: true, nameFor }),
      }))
      .filter((o) => o.beliefs.length > 0);
  }, [campaign, worldState, includeGroundTruth, nameFor]);

  // Player projection / dormant world / no modelled beliefs ⇒ render nothing.
  if (!includeGroundTruth || !hasBeliefMaps(worldState) || observers.length === 0) return null;

  return (
    <section data-testid="belief-divergence-band" style={{ display: 'grid', gap: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
        <Eye size={13} /> What they believe
      </div>
      <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
        The fog of war, made watchable: each settlement&apos;s picture of the others, as it believes it.
      </p>
      {observers.map((o) => (
        <div key={o.observerId} style={{
          border: `1px solid ${BORDER}`, background: CARD_ALT, padding: '9px 11px',
          display: 'grid', gap: 6,
        }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900 }}>
            {o.name} believes…
          </div>
          <div style={{ display: 'grid', gap: 6 }}>
            {o.beliefs.map((b) => <BeliefRow key={b.subjectId} belief={b} />)}
          </div>
        </div>
      ))}
    </section>
  );
}
