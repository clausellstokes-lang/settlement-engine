/**
 * domain/display/visibilityAudit.js — the RUNTIME player-safe visibility-audit
 * tool (F1). Proves, against synthetic worst-case fixtures, that NO player-facing
 * display read-model surfaces gm/hidden/COVERT state:
 *   - covert MOBILIZATION (a settlement secretly gearing for war), and
 *   - covert SMUGGLING (battlefield-enemy trade — the only tie that can exist).
 *
 * The admin Sim-Tuning panel runs this live (a button); the beta-gate test
 * (tests/domain/display/visibilityAudit.test.js) asserts the SAME property
 * statically. Both go through the ONE seam every surface (dossier / Realm / PDF /
 * map) consumes — the display read-models — so a pass here is the property for
 * every consumer.
 *
 * PRESENTATION ONLY. Pure: builds fixed in-memory fixtures, runs the player-safe
 * (includeCovert: false) read-models, and checks the result carries no covert
 * tie. No store, no React, no rng, no wall clock, no mutation.
 *
 * Strict-clean (typecheck:domain:strict). No React/Zustand imports.
 */

import { mobilizationStandings, settlementMobilization, hasLiveMobilization } from './mobilizationStatus.js';
import { settlementTradePressure } from './tradePressure.js';

/** A confirmed trade-dependency channel between battlefield enemies. */
function hostileGraph() {
  return {
    edges: [{ id: 'eh', from: 'forge', to: 'warhawk', relationshipType: 'hostile' }],
    channels: [
      { type: 'trade_dependency', from: 'forge', to: 'warhawk', status: 'confirmed', strength: 0.8, goods: [{ id: 'iron', label: 'Iron' }] },
    ],
  };
}

/** Two settlement items for the smuggling fixture. */
function hostileMembers() {
  const mk = (/** @type {string} */ id, /** @type {string} */ name, /** @type {any} */ eco) => ({
    id,
    settlement: {
      id, name, tier: 'town', population: 4000,
      config: { tradeRouteAccess: 'road' },
      institutions: [],
      economicState: { prosperity: 'Prosperous', primaryExports: eco.exports || [], primaryImports: eco.imports || [] },
      powerStructure: { publicLegitimacy: { score: 60, label: 'Stable' }, factions: [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }] },
      activeConditions: [],
    },
  });
  return [mk('warhawk', 'Warhawk', { imports: ['Iron'] }), mk('forge', 'Forgeholt', { exports: ['Iron'] })];
}

/**
 * Run the full player-safe visibility audit against worst-case fixtures.
 * @returns {{ ok: boolean, checks: Array<{ label: string, pass: boolean }> }}
 */
export function runVisibilityAudit() {
  /** @type {Array<{ label: string, pass: boolean }>} */
  const checks = [];

  // ── 1. Covert mobilization never reaches a player view ───────────────────
  const mobWorld = {
    warPosture: {
      overt: { state: 'mobilized', progress: 1, sinceTick: 0, covert: false },
      secret: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: true },
    },
  };
  const playerStandings = mobilizationStandings({ worldState: mobWorld }); // default false
  checks.push({
    label: 'Covert mobilizer omitted from player standings',
    pass: !playerStandings.some(s => s.id === 'secret') && playerStandings.every(s => s.covert !== true),
  });
  checks.push({
    label: 'Covert mobilizer returns null for a single-settlement player read',
    pass: settlementMobilization({ settlementId: 'secret', worldState: mobWorld }) === null,
  });
  checks.push({
    label: 'A covert-only world reports no live mobilization to players',
    pass: hasLiveMobilization({ worldState: { warPosture: { x: { state: 'mobilized', covert: true } } } }) === false,
  });

  // ── 2. Covert smuggling never reaches a player view ──────────────────────
  const graph = hostileGraph();
  const members = hostileMembers();
  const worldState = { tick: 5, relationshipStates: { eh: { relationshipType: 'hostile' } } };
  const playerTies = settlementTradePressure({
    settlementId: 'warhawk', regionalGraph: graph, settlements: members, worldState, tick: 5, includeCovert: false, nameFor: (id) => String(id),
  });
  checks.push({
    label: 'No covert smuggling tie in a player trade-pressure read',
    pass: playerTies.every(t => t.covert !== true) && !playerTies.some(t => /smuggl/i.test(t.phrase)),
  });

  const ok = checks.every(c => c.pass);
  return { ok, checks };
}

export default runVisibilityAudit;
