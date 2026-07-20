/**
 * SubstrateTab — the Substrate sub-tab (Phase 5 W4e dossier depth). Surfaces OUR
 * 16-variable causal engine read (`deriveCausalState`) as a legible grid: every
 * system variable with its health band + 0–100 score, the systems under pressure
 * called out first.
 *
 * Settlement-only + pure read-model. OUR substrate reads the settlement's OWN
 * activeConditions (siege / outbreak / drawdown are already baked into the
 * scores), so — unlike THEIRS' SubstrateTab — no live campaign `worldState` is
 * threaded in. That keeps this tab a pure read of already-public settlement facts
 * with no leak surface, and it renders honestly for a standalone (non-campaign)
 * settlement too.
 *
 * Dormancy-correct: a settlement whose read-model yields nothing degrades to a
 * short note rather than a fabricated grid.
 */

import { useMemo } from 'react';
import { deriveCausalState } from '../../../domain/causalState.js';
import { FS, INK, MUTED, BODY, BORDER, BORDER2, CARD, CARD_ALT, CARD_HDR, GREEN, AMBER, RED, sans, SP, swatch } from '../../theme.js';

// Humanized labels for the 16 SYSTEM_VARIABLES (mirrors causalState.js's internal
// VARIABLE_LABEL, kept here so the display layer owns its own copy).
const VAR_LABEL = {
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

// The band vocabulary IS the model's health signal (it drives summary + pressuresOn),
// so colour by band directly — worst (collapsed) → best (surplus).
const BAND_TONE = {
  surplus: GREEN,
  adequate: '#3f7d3f',
  strained: AMBER,
  critical: '#b15a1f',
  collapsed: RED,
};
const BAND_RANK = { collapsed: 0, critical: 1, strained: 2, adequate: 3, surplus: 4 };

function BandPill({ band }) {
  const tone = BAND_TONE[band] || MUTED;
  return (
    <span data-band={band} style={{
      display: 'inline-block', minWidth: 66, textAlign: 'center', padding: '1px 7px', 
      fontSize: FS.pico, fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase',
      color: swatch.white, background: tone,
    }}>{band}</span>
  );
}

/**
 * @param {{ settlement: any }} props
 */
export default function SubstrateTab({ settlement }) {
  const model = useMemo(() => (settlement ? deriveCausalState(settlement) : null), [settlement]);

  const rows = useMemo(() => {
    if (!model?.variables) return [];
    return Object.entries(model.variables)
      .map(([key, v]) => ({
        key,
        label: VAR_LABEL[key] || key,
        band: v.band,
        score: typeof v.score === 'number' ? v.score : (model.scores?.[key] ?? null),
      }))
      // Pressures first: worst band, then lowest score, then stable by label.
      .sort((a, b) =>
        (BAND_RANK[a.band] ?? 5) - (BAND_RANK[b.band] ?? 5)
        || (a.score ?? 100) - (b.score ?? 100)
        || a.label.localeCompare(b.label));
  }, [model]);

  if (!model || rows.length === 0) {
    return (
      <div data-testid="substrate-tab" style={{ padding: 24, color: MUTED, fontFamily: sans, fontSize: FS.sm }}>
        The causal substrate has not been assessed for this settlement.
      </div>
    );
  }

  const summary = model.summary || {};
  const pressures = [
    ...(summary.collapsed || []),
    ...(summary.critical || []),
    ...(summary.strained || []),
  ].map(k => VAR_LABEL[k] || k);

  return (
    <div data-testid="substrate-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      <div style={{ fontSize: FS.lg, fontWeight: 800, color: INK, marginBottom: 4 }}>Causal substrate</div>
      <p style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5, margin: '0 0 12px' }}>
        The sixteen forces the engine simulates — food, legitimacy, defense, trade, and the rest.
        Bands read the settlement&apos;s own conditions; a live siege, drawdown, or outbreak is already
        pressed into the scores below.
      </p>

      {/* Pressures callout — the systems the model flags strained-or-worse. */}
      <div data-testid="substrate-pressures" style={{
        background: CARD_ALT,
        border: `1px solid ${pressures.length ? BORDER : BORDER2}`,
        borderLeft: `3px solid ${pressures.length ? RED : GREEN}`,
        padding: `${SP.sm}px ${SP.md}px`, marginBottom: 12,
      }}>
        {pressures.length ? (
          <div style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
            <strong style={{ color: RED }}>Under pressure:</strong> {pressures.join(', ')}.
          </div>
        ) : (
          <div style={{ fontSize: FS.sm, color: GREEN, lineHeight: 1.5 }}>
            <strong>All systems holding.</strong> No variable reads strained or worse.
          </div>
        )}
      </div>

      {/* The 16-variable grid. */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
        <div style={{
          fontSize: FS.xs, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em',
          background: CARD_HDR, padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`,
        }}>System variables</div>
        <div style={{ padding: `0 ${SP.md}px` }}>
          {rows.map(row => (
            <div key={row.key} data-substrate-row style={{
              display: 'flex', alignItems: 'center', gap: SP.sm,
              padding: `${SP.sm}px 0`, borderBottom: `1px solid ${BORDER}`,
            }}>
              <span style={{ flex: 1, fontSize: FS.sm, fontWeight: 600, color: INK }}>{row.label}</span>
              {row.score != null && (
                <span style={{ fontSize: FS.xs, fontWeight: 700, color: MUTED, minWidth: 26, textAlign: 'right' }}>{row.score}</span>
              )}
              <BandPill band={row.band} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
