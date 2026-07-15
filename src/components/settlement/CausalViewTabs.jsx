/**
 * CausalViewTabs — the 16-variable causal readout (UX overhaul Phase 2 spec).
 * Mounted via Systems -> Substrate (SubstrateTab) and the editor Workshop.
 *
 * Renders the engine's causal substrate for one settlement, driven by the single
 * altitude axis (useAltitude):
 *   - Overview (guided)  → nothing (the clean face; the 4-dim strip lives elsewhere)
 *   - Detail   (standard)→ the pressured variables as band pills + plain "why"
 *   - Engine   (expert)  → the FULL 16-var grid + 9 pressures + settlementStrength
 *
 * It consumes the pure read-models ONLY (no store writes, no rng):
 *   - deriveCausalState  → scores / bands / contributors[] ("why")
 *   - deriveSettlementPressures → the 9 pressure axes (0..1 + reasons[])
 *   - settlementStrength → the war-cost-aware strength dial + homeostasis story
 *
 * Polarity-aware sort: strained/critical/collapsed float to the top (the
 * pressuresOn order), honoring `criminal_opportunity`'s band-flip (higher = worse,
 * already handled by the engine's banding). De-emphasized numeric scores; bands
 * are the primary visual. Self-gating: a settlement with no meaningful causal
 * content / no pressure renders the empty-but-honest shell at Engine, nothing at
 * Overview. Lazy + memoized — the heavy derivation runs once per settlement.
 */

import { useMemo, useState } from 'react';
import { deriveCausalState, variablePolarity } from '../../domain/causalState.js';
import { deriveSettlementPressures } from '../../domain/worldPulse/pressureModel.js';
import { settlementStrength } from '../../domain/worldPulse/relationshipEvolution.js';
import { useAltitude } from '../../hooks/useAltitude.js';
import Button from '../primitives/Button.jsx';
import { INK, MUTED, BODY, BORDER, CARD, CARD_HDR, sans, FS, SP, R, swatch } from '../theme.js';

// ── Vocabulary ────────────────────────────────────────────────────────────────

const VARIABLE_LABEL = {
  food_security: 'Food security',
  labor_capacity: 'Labor capacity',
  public_legitimacy: 'Public legitimacy',
  ruling_authority: 'Ruling authority',
  faction_power: 'Faction power',
  trade_connectivity: 'Trade connectivity',
  healing_capacity: 'Healing capacity',
  defense_readiness: 'Defense readiness',
  criminal_opportunity: 'Criminal opportunity',
  religious_authority: 'Religious authority',
  housing_pressure: 'Housing pressure',
  infrastructure_condition: 'Infrastructure condition',
  magical_stability: 'Magical stability',
  social_trust: 'Social trust',
  economic_capacity: 'Economic capacity',
  law_order: 'Law & order',
};

// Color per causal band (the 5-band substrate vocabulary). Greener = healthier,
// redder = more pressure — same semantics as the dossier's 4-band chips.
const BAND_COLOR = {
  surplus: '#1a5a28',
  adequate: '#3f7d3f',
  strained: '#a0762a',
  critical: '#b15a1f',
  collapsed: '#8b1a1a',
};

// Sort weight: pressured bands float to the top.
const BAND_ORDER = { collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 };

// The pressure kinds that feed settlementStrength's pressure argument.
const STRENGTH_PRESSURE_KINDS = ['conflict', 'trade', 'legitimacy', 'economy'];

// ── Derivation seam (pure) ──────────────────────────────────────────────────

/**
 * Build the minimal worldSnapshot the pure read-models need for ONE settlement,
 * folding in the campaign worldState / regionalGraph when supplied (so a live
 * siege/condition colours the pressures) and degrading to a standalone snapshot
 * otherwise. Pure — no store, no mutation.
 * @param {any} settlement
 * @param {{ id?: string, worldState?: any, regionalGraph?: any }} opts
 */
function buildSoloSnapshot(settlement, { id, worldState, regionalGraph } = {}) {
  const sid = String(id || settlement?.id || settlement?.config?.id || 'self');
  const causal = deriveCausalState(settlement);
  const item = {
    id: sid,
    name: settlement?.name || settlement?.config?.customName || 'Settlement',
    settlement,
    causal,
    activeConditions: settlement?.activeConditions || [],
  };
  return {
    causal,
    snapshot: {
      settlements: [item],
      byId: new Map([[sid, item]]),
      worldState: worldState || {},
      regionalGraph: regionalGraph || { channels: [], edges: [] },
    },
    item,
    sid,
  };
}

/**
 * Reduce the 9-axis pressure list for one settlement into the
 * { conflict, trade, legitimacy, economy } shape settlementStrength reads.
 * @param {Array<{ kind: string, score: number }>} pressures
 */
function strengthPressure(pressures) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const p of pressures) {
    if (STRENGTH_PRESSURE_KINDS.includes(p.kind)) out[p.kind] = p.score;
  }
  return out;
}

/** A one-line homeostasis story for the strength dial. */
function homeostasisStory(strength, warPenaltyPresent) {
  const pct = Math.round(strength * 100);
  if (warPenaltyPresent) {
    return `Strength ${pct}%. War is eroding it; sustained fighting drives this realm toward suing for peace.`;
  }
  if (strength >= 0.6) return `Strength ${pct}%. Confident enough to project power.`;
  if (strength >= 0.42) return `Strength ${pct}%. Holds its own but cautious.`;
  return `Strength ${pct}%. Too weak to open a war; it defends, it does not deploy.`;
}

// ── Sub-views ────────────────────────────────────────────────────────────────

function BandPill({ band }) {
  return (
    <span
      data-band={band}
      style={{
        display: 'inline-block',
        padding: '1px 7px',
        borderRadius: R.sm,
        fontSize: FS.xxs,
        fontWeight: 800,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
        color: swatch.white,
        background: BAND_COLOR[band] || MUTED,
      }}
    >
      {band}
    </span>
  );
}

function VariableRow({ variable, expanded, onToggle }) {
  const label = VARIABLE_LABEL[variable.variable] || variable.variable;
  const contributors = Array.isArray(variable.contributors) ? variable.contributors : [];
  const hasWhy = contributors.length > 0;
  const polarity = variablePolarity(variable.variable);
  return (
    <div
      data-variable={variable.variable}
      style={{ borderBottom: `1px solid ${BORDER}` }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={hasWhy ? onToggle : undefined}
        aria-expanded={hasWhy ? expanded : undefined}
        disabled={!hasWhy}
        style={{
          minHeight: 44, borderRadius: 0, justifyContent: 'flex-start',
          background: 'none', border: 'none', padding: `${SP.xs}px 0`,
          width: '100%', display: 'flex', alignItems: 'center', gap: SP.sm,
          cursor: hasWhy ? 'pointer' : 'default', fontFamily: sans,
          fontWeight: 700, opacity: 1, textAlign: 'left',
        }}
      >
        <span style={{ flex: 1, fontSize: FS.sm, fontWeight: 700, color: INK }}>{label}</span>
        <BandPill band={variable.band} />
        {/* Numbers deliberately de-emphasized (small, gray). */}
        <span style={{ fontSize: FS.xs, color: MUTED, minWidth: 24, textAlign: 'right' }}>
          {variable.score}
        </span>
        {hasWhy && (
          <span aria-hidden style={{ fontSize: FS.xs, color: MUTED, width: 12 }}>
            {expanded ? '▾' : '▸'}
          </span>
        )}
      </Button>
      {polarity === 'lower_is_better' && (
        <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: 2 }}>higher = worse</div>
      )}
      {hasWhy && expanded && (
        <ul style={{ margin: `${SP.xs}px 0 0`, padding: `0 0 0 ${SP.md}px`, listStyle: 'none' }}>
          {contributors.map((c, i) => (
            <li key={i} style={{ fontSize: FS.xs, color: BODY, marginBottom: 2 }}>
              <span style={{ color: c.delta > 0 ? BAND_COLOR.adequate : c.delta < 0 ? BAND_COLOR.critical : MUTED, fontWeight: 700 }}>
                {c.delta > 0 ? `+${c.delta}` : c.delta < 0 ? `${c.delta}` : '·'}
              </span>{' '}
              {c.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PressureBar({ pressure }) {
  const pct = Math.round((pressure.score || 0) * 100);
  const reasons = Array.isArray(pressure.reasons) ? pressure.reasons : [];
  return (
    <div data-pressure={pressure.kind} style={{ marginBottom: SP.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <span style={{ flex: 1, fontSize: FS.xs, fontWeight: 700, color: INK }}>{pressure.label}</span>
        <span style={{ fontSize: FS.xxs, color: MUTED }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: BORDER, borderRadius: R.sm, overflow: 'hidden', marginTop: 2 }}>
        <div
          style={{
            width: `${pct}%`, height: '100%',
            background: pct >= 60 ? BAND_COLOR.critical : pct >= 35 ? BAND_COLOR.strained : BAND_COLOR.adequate,
          }}
        />
      </div>
      {reasons.length > 0 && (
        <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: 2 }}>{reasons.join(' · ')}</div>
      )}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: FS.xs, fontWeight: 800, color: MUTED, textTransform: 'uppercase',
      letterSpacing: 0.4, margin: `${SP.md}px 0 ${SP.xs}px`,
    }}>
      {children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * @param {{
 *   settlement: any,
 *   settlementId?: string,
 *   worldState?: any,
 *   regionalGraph?: any,
 *   forceLevel?: 'guided'|'standard'|'expert',
 *   flat?: boolean,
 * }} props
 */
export default function CausalViewTabs({ settlement, settlementId, worldState, regionalGraph, forceLevel, flat = false }) {
  const { level: prefLevel } = useAltitude();
  const level = forceLevel || prefLevel;
  const [openVar, setOpenVar] = useState(/** @type {string|null} */ (null));

  const model = useMemo(() => {
    if (!settlement) return null;
    const { causal, snapshot, item } = buildSoloSnapshot(settlement, { id: settlementId, worldState, regionalGraph });
    const pressures = deriveSettlementPressures(snapshot);
    const pressure = strengthPressure(pressures);
    const strength = settlementStrength(item, pressure);
    const warPenaltyPresent = (item.activeConditions || []).some(
      (/** @type {any} */ c) => c?.archetype === 'war_drain' || c?.archetype === 'war_exhaustion',
    );

    // Polarity-aware sort: pressured bands float to the top, then alphabetical.
    const rows = Object.values(causal.variables).sort((/** @type {any} */ a, /** @type {any} */ b) => {
      const ba = BAND_ORDER[a.band] ?? 9;
      const bb = BAND_ORDER[b.band] ?? 9;
      if (ba !== bb) return ba - bb;
      return (VARIABLE_LABEL[a.variable] || a.variable).localeCompare(VARIABLE_LABEL[b.variable] || b.variable);
    });
    const pressured = rows.filter((/** @type {any} */ v) => v.band === 'strained' || v.band === 'critical' || v.band === 'collapsed');

    return { rows, pressured, pressures, strength, warPenaltyPresent };
  }, [settlement, settlementId, worldState, regionalGraph]);

  if (!model) return null;
  // Overview hides the substrate entirely (the clean face).
  if (level === 'guided') return null;

  const showFullGrid = level === 'expert';
  const variableRows = showFullGrid ? model.rows : model.pressured;

  return (
    <div
      data-testid="causal-view-tabs"
      data-level={level}
      data-flat={flat ? '' : undefined}
      style={
        flat
          ? { fontFamily: sans }
          : {
              background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
              padding: SP.md, fontFamily: sans,
            }
      }
    >
      {flat ? (
        // Mounted inside a Workshop card: the card's own header and border carry
        // the framing, so the substrate reads flat with a plain eyebrow rather
        // than a second filled header strip (no false floor).
        <SectionTitle>
          Causal substrate · {showFullGrid ? 'all 16 variables' : 'where the pressure is'}
        </SectionTitle>
      ) : (
        <div style={{
          fontSize: FS.sm, fontWeight: 800, color: INK,
          display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.xs,
          background: CARD_HDR, margin: `-${SP.md}px -${SP.md}px ${SP.sm}px`, padding: `${SP.sm}px ${SP.md}px`,
          borderBottom: `1px solid ${BORDER}`, borderRadius: `${R.md}px ${R.md}px 0 0`,
        }}>
          Causal substrate
          <span style={{ fontWeight: 600, fontSize: FS.xs, color: MUTED }}>
            {showFullGrid ? 'all 16 variables' : 'where the pressure is'}
          </span>
        </div>
      )}

      {/* The variable grid. At Detail we show only the pressured rows; at Engine, all 16. */}
      {variableRows.length === 0 ? (
        <div style={{ fontSize: FS.sm, color: BODY, padding: `${SP.xs}px 0` }}>
          All variables sit within the adequate band. Nothing is under pressure.
        </div>
      ) : (
        <div data-testid="causal-grid">
          {variableRows.map((/** @type {any} */ v) => (
            <VariableRow
              key={v.variable}
              variable={v}
              expanded={openVar === v.variable}
              onToggle={() => setOpenVar(openVar === v.variable ? null : v.variable)}
            />
          ))}
        </div>
      )}

      {/* Pressures + strength only at Engine altitude. */}
      {showFullGrid && (
        <>
          <SectionTitle>Pressures</SectionTitle>
          <div data-testid="pressure-section">
            {model.pressures.map((/** @type {any} */ p) => (
              <PressureBar key={p.kind} pressure={p} />
            ))}
          </div>

          <SectionTitle>Strength</SectionTitle>
          <div data-testid="strength-readout" style={{ fontSize: FS.sm, color: BODY }}>
            {homeostasisStory(model.strength, model.warPenaltyPresent)}
          </div>
        </>
      )}
    </div>
  );
}
