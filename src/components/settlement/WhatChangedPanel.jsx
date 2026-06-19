/**
 * WhatChangedPanel — the "What changed & why" read surface (UX overhaul Phase 2,
 * plan §4.1). Shown only POST-ADVANCE, when a prior causal snapshot exists: it
 * diffs the prior vs current causal state per variable (compareCausalState) and
 * renders the before→band→after story, plus the population arc from
 * populationHistory.
 *
 * SELF-GATING — renders NOTHING when there is no prior snapshot (a freshly
 * generated, never-advanced settlement) and no population history. A new DM at a
 * just-generated town sees nothing extra; depth appears once the world has moved.
 *
 * Pure read-model + presentation. The diff is computed by the engine's
 * compareCausalState (same function the event pipeline uses), so the panel can
 * never disagree with the substrate.
 */

import { useMemo } from 'react';
import { compareCausalState, deriveCausalState } from '../../domain/causalState.js';
import {
  INK, MUTED, BODY, BORDER, CARD, CARD_HDR, sans, FS, SP, R,
} from '../theme.js';

const BAND_COLOR = {
  surplus: '#1a5a28', adequate: '#3f7d3f', strained: '#a0762a',
  critical: '#b15a1f', collapsed: '#8b1a1a',
};

function deltaColor(entry) {
  const better = (entry.polarity === 'higher_is_better' && entry.change > 0) ||
                 (entry.polarity === 'lower_is_better' && entry.change < 0);
  return better ? BAND_COLOR.adequate : BAND_COLOR.critical;
}

/**
 * Resolve the prior/current causal states to diff. Accepts either explicit
 * causal-state objects (`before`/`after`) or settlement objects
 * (`priorSettlement`/`settlement`) it derives from. The current side falls back
 * to deriving from `settlement` when no explicit `after` is given.
 * @param {{ before?: any, after?: any, priorSettlement?: any, settlement?: any }} args
 */
function resolveStates({ before, after, priorSettlement, settlement }) {
  const beforeState = before || (priorSettlement ? deriveCausalState(priorSettlement) : null);
  const afterState = after || (settlement ? deriveCausalState(settlement) : null);
  return { beforeState, afterState };
}

/**
 * @param {{
 *   settlement?: any,
 *   priorSettlement?: any,
 *   before?: any,
 *   after?: any,
 *   populationHistory?: Array<number|{ population?: number, tick?: number }>,
 * }} props
 */
export default function WhatChangedPanel({ settlement, priorSettlement, before, after, populationHistory }) {
  const model = useMemo(() => {
    const { beforeState, afterState } = resolveStates({ before, after, priorSettlement, settlement });
    const deltas = beforeState && afterState ? compareCausalState(beforeState, afterState) : [];
    const history = Array.isArray(populationHistory)
      ? populationHistory
        .map(p => (typeof p === 'number' ? p : Number(p?.population)))
        .filter(n => Number.isFinite(n))
      : (Array.isArray(settlement?.populationHistory)
          ? settlement.populationHistory
            .map((/** @type {any} */ p) => (typeof p === 'number' ? p : Number(p?.population)))
            .filter((/** @type {any} */ n) => Number.isFinite(n))
          : []);
    return { deltas, history, hasPrior: !!beforeState };
  }, [settlement, priorSettlement, before, after, populationHistory]);

  // Self-gate: no prior snapshot and no population arc ⇒ nothing to say.
  if (!model.hasPrior && model.history.length < 2) return null;
  if (model.deltas.length === 0 && model.history.length < 2) return null;

  const popFirst = model.history[0];
  const popLast = model.history[model.history.length - 1];
  const popChange = popLast - popFirst;

  return (
    <div
      data-testid="what-changed-panel"
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
        marginBottom: 12, fontFamily: sans, overflow: 'hidden',
      }}
    >
      <div style={{
        fontSize: FS.sm, fontWeight: 800, color: INK, background: CARD_HDR,
        padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`,
      }}>
        What changed &amp; why
        <span style={{ fontWeight: 600, fontSize: FS.xs, color: MUTED, marginLeft: SP.sm }}>
          since the world last moved
        </span>
      </div>

      <div style={{ padding: SP.md }}>
        {model.deltas.length > 0 ? (
          <ul data-testid="what-changed-list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {model.deltas.map(entry => (
              <li
                key={entry.variable}
                data-variable={entry.variable}
                style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5, marginBottom: 4 }}
              >
                <span style={{ color: deltaColor(entry), fontWeight: 800, marginRight: 4 }}>
                  {entry.change > 0 ? `+${entry.change}` : entry.change}
                </span>
                {entry.explanation}
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ fontSize: FS.sm, color: MUTED }}>
            The causal substrate held steady — no variable moved.
          </div>
        )}

        {model.history.length >= 2 && (
          <div data-testid="population-arc" style={{ marginTop: SP.sm, fontSize: FS.sm, color: BODY }}>
            <strong>Population:</strong> {popFirst.toLocaleString()} → {popLast.toLocaleString()}{' '}
            <span style={{ color: popChange >= 0 ? BAND_COLOR.adequate : BAND_COLOR.critical, fontWeight: 700 }}>
              ({popChange >= 0 ? '+' : ''}{popChange.toLocaleString()})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
