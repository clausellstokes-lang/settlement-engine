/**
 * AdminSimTuningPanel.jsx — F1 sim-tuning dashboard (admin, isElevated-gated by
 * the parent AdminPanel). A cohesive sibling of AdminAnalyticsPanel /
 * AdminTrendsPanel that consumes what the SIMULATION emits — the live campaigns'
 * worldState ledgers (warPosture / deployments / occupations / tradeWarState /
 * dispositionStats / warExhaustion / pantheon), pulseHistory, and chronicle —
 * through the SAME pure display read-models the DM surfaces use, plus the engine
 * `*_TUNING` constants — and turns them into tuning views + balance warnings:
 *
 *   - war-outcome frequency (sieges, deployments, disposition standings)
 *   - military-strength comparison (latent host strength across the realm)
 *   - deployed-army status + attrition (armyStrength read-model)
 *   - occupation + resistance (occupationStatus read-model)
 *   - strategic-trade relationships (trade-war prizes)
 *   - deity / pantheon standings (B5 4-axis)
 *   - BALANCE WARNINGS (wars too frequent/rare? snowball? oscillation?)
 *   - DORMANT-SUBSYSTEM verification (a war-off campaign carries no war ledgers)
 *   - the PLAYER-SAFE VISIBILITY AUDIT tool (proves no covert leak to player views)
 *
 * Reads the live store campaigns (like RealmDashboard / LiveWarStatus). No engine
 * mutation, no rng, no wall clock. Heuristic phrasing reused from the read-models.
 */

import { useMemo, useState } from 'react';
import { useStore } from '../../store/index.js';
import { liveSieges, activeDeployments, dispositionStandings, liveTradeWars, warExhaustionStandings } from '../../domain/display/warStatus.js';
import { mobilizationStandings } from '../../domain/display/mobilizationStatus.js';
import { latentStrength, deployedArmyStandings } from '../../domain/display/armyStrength.js';
import { occupationStandings } from '../../domain/display/occupationStatus.js';
import { pantheonStandings, deityDisplayName } from '../../domain/display/pantheonDepth.js';
import { runVisibilityAudit } from '../../domain/display/visibilityAudit.js';
import { OCCUPATION_TUNING } from '../../domain/worldPulse/occupation.js';
import { normalizeSimulationRules } from '../../domain/worldPulse/simulationRules.js';
import { Card, BarList, MiniTable, Empty, Select } from './AdminTrendsCharts.jsx';
import Button from '../primitives/Button.jsx';
import { MUTED, GREEN, RED, sans, FS, SP } from '../theme.js';

/** Member settlement items ({ id, settlement }) for a campaign, from the store roster. */
function membersOf(campaign, savedSettlements) {
  const ids = new Set((campaign?.settlementIds || []).map(String));
  return (savedSettlements || [])
    .filter(sv => ids.has(String(sv?.id || sv?.settlement?.id)))
    .map(sv => ({ id: String(sv?.id || sv?.settlement?.id), settlement: sv?.settlement || sv }));
}

/** Coarse balance-warning heuristics over one campaign's live ledgers. */
function balanceWarnings(campaign, members) {
  const worldState = campaign?.worldState || {};
  const regionalGraph = campaign?.regionalGraph || worldState.regionalGraph || null;
  const out = [];
  const n = Math.max(1, members.length);

  const sieges = liveSieges({ worldState, regionalGraph }).length;
  const occupations = occupationStandings({ worldState });
  const weary = warExhaustionStandings(worldState);
  const standings = dispositionStandings(worldState);

  // Wars too frequent? more than ~40% of the realm besieged at once.
  if (sieges / n > 0.4) out.push({ level: 'warn', text: `Wars may be too frequent, with ${sieges} live sieges across ${n} settlements.` });
  // Snowball? a single occupier holds many settlements.
  const byOccupier = {};
  for (const o of occupations) byOccupier[o.occupierName] = (byOccupier[o.occupierName] || 0) + 1;
  const topOccupier = Object.entries(byOccupier).sort((a, b) => b[1] - a[1])[0];
  if (topOccupier && topOccupier[1] >= 3) out.push({ level: 'warn', text: `Possible snowball. ${topOccupier[0]} holds ${topOccupier[1]} occupations (cap relief is ${OCCUPATION_TUNING.OCCUPIER_BENEFIT_CONTAINMENT}).` });
  // Oscillation? many occupations stuck contested (not converging).
  const contested = occupations.filter(o => /contested|unstable/i.test(o.statePhrase)).length;
  if (occupations.length >= 3 && contested === occupations.length) out.push({ level: 'warn', text: `Occupations may be oscillating. All ${occupations.length} remain contested or unstable.` });
  // Persistent war-weariness across the realm?
  if (weary.length / n > 0.6) out.push({ level: 'info', text: `Realm is broadly war-weary. ${weary.length} of ${n} settlements carry an exhaustion scar.` });
  // Stalemate? everyone net-zero (no decisive outcomes).
  if (members.length >= 3 && standings.length === 0 && sieges > 0) out.push({ level: 'info', text: 'Active sieges but no disposition standings yet. Outcomes may be slow to resolve.' });

  if (!out.length) out.push({ level: 'good', text: 'No balance warnings. The realm looks well-tuned.' });
  return out;
}

/** Dormant-subsystem verification: a war-off campaign must carry no war ledgers. */
function dormancyReport(campaign) {
  const ws = campaign?.worldState || {};
  // Rules live at worldState.simulationRules, NOT campaign.rules (the store never
  // writes campaign.rules — it was always undefined, so warOff was always true and
  // the dormancy card raised a false "war ledger present while war off" failure on
  // every war-ON campaign). Read the normalized rules off worldState like the engine.
  const warOff = !normalizeSimulationRules(ws.simulationRules).warLayerEnabled;
  const hasWarLedger = !!(ws.deployments && Object.keys(ws.deployments).length)
    || !!(ws.occupations && Object.keys(ws.occupations).length)
    || !!(ws.warPosture && Object.keys(ws.warPosture).length);
  return {
    warOff,
    hasWarLedger,
    ok: !warOff || !hasWarLedger, // war-off ⇒ must have no live war ledger
  };
}

export default function AdminSimTuningPanel() {
  const campaigns = useStore(s => s.campaigns);
  const savedSettlements = useStore(s => s.savedSettlements);
  const [campaignId, setCampaignId] = useState('');
  const [auditResult, setAuditResult] = useState(/** @type {any} */ (null));

  const options = useMemo(
    () => [{ key: '', label: 'Select a campaign' }, ...(campaigns || []).map(c => ({ key: String(c.id), label: c.name || String(c.id) }))],
    [campaigns],
  );

  const campaign = useMemo(
    () => (campaignId ? (campaigns || []).find(c => String(c.id) === campaignId) : null) || null,
    [campaigns, campaignId],
  );

  const data = useMemo(() => {
    if (!campaign) return null;
    const worldState = campaign.worldState || {};
    const regionalGraph = campaign.regionalGraph || worldState.regionalGraph || null;
    const members = membersOf(campaign, savedSettlements);
    const nameById = new Map(members.map(m => [m.id, m.settlement?.name || m.id]));
    const nameFor = (/** @type {any} */ id) => nameById.get(String(id)) || String(id);

    return {
      members,
      sieges: liveSieges({ worldState, regionalGraph }),
      deployments: activeDeployments(worldState),
      standings: dispositionStandings(worldState),
      tradeWars: liveTradeWars({ worldState, regionalGraph }),
      weary: warExhaustionStandings(worldState),
      mobilizing: mobilizationStandings({ worldState, includeCovert: true }),
      armies: deployedArmyStandings({ worldState, nameFor }),
      occupations: occupationStandings({ worldState, nameFor }),
      pantheon: pantheonStandings(worldState),
      strengthRows: members.map(m => ({ dim: m.settlement?.name || m.id, value: 0, phrase: latentStrength(m).phrase })),
      warnings: balanceWarnings(campaign, members),
      dormancy: dormancyReport(campaign),
      nameFor,
    };
  }, [campaign, savedSettlements]);

  return (
    <div style={{ display: 'grid', gap: SP.lg }}>
      <div style={{ display: 'flex', gap: SP.sm, alignItems: 'center', flexWrap: 'wrap' }}>
        <Select value={campaignId} onChange={setCampaignId} options={options} label="Campaign" />
        <Button variant="ghost" size="sm" onClick={() => setAuditResult(runVisibilityAudit())}>
          Run player-safe visibility audit
        </Button>
      </div>

      {/* ── Player-safe visibility audit result (the headline beta gate) ───── */}
      {auditResult && (
        <Card title="Player-safe visibility audit">
          <div style={{ fontFamily: sans, fontSize: FS.sm, fontWeight: 800, color: auditResult.ok ? GREEN : RED, marginBottom: SP.sm }}>
            {auditResult.ok ? '✓ Pass. No covert or GM state leaks to a player view.' : '✗ Fail. A covert leak was detected.'}
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontFamily: sans, fontSize: FS.xs, color: MUTED, lineHeight: 1.7 }}>
            {auditResult.checks.map((c, i) => (
              <li key={i} style={{ color: c.pass ? MUTED : RED }}>{c.pass ? '✓' : '✗'} {c.label}</li>
            ))}
          </ul>
        </Card>
      )}

      {!campaign && <Empty msg="Select a campaign to inspect its live simulation state." />}

      {campaign && data && (
        <>
          {/* ── Balance warnings ──────────────────────────────────────────── */}
          <Card title="Balance warnings">
            <ul style={{ margin: 0, paddingLeft: 18, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.7 }}>
              {data.warnings.map((w, i) => (
                <li key={i} style={{ color: w.level === 'warn' ? RED : w.level === 'good' ? GREEN : MUTED, fontWeight: w.level === 'warn' ? 800 : 600 }}>{w.text}</li>
              ))}
            </ul>
          </Card>

          {/* ── Dormant-subsystem verification ───────────────────────────── */}
          <Card title="Dormant-subsystem verification">
            <div style={{ fontFamily: sans, fontSize: FS.sm, color: data.dormancy.ok ? GREEN : RED, fontWeight: 800 }}>
              {data.dormancy.warOff
                ? (data.dormancy.ok ? '✓ War layer off and no live war ledger (byte-identical off-state holds).' : '✗ War layer off but a war ledger is present. Dormancy is violated.')
                : '⚙ War layer on. War ledgers are expected.'}
            </div>
          </Card>

          {/* ── War-outcome frequency ─────────────────────────────────────── */}
          <Card title="War activity">
            <MiniTable
              rows={[
                { metric: 'Live sieges', count: data.sieges.length },
                { metric: 'Armies in the field', count: data.deployments.length },
                { metric: 'Trade wars', count: data.tradeWars.length },
                { metric: 'Mobilizing (incl. covert)', count: data.mobilizing.length },
                { metric: 'War-weary settlements', count: data.weary.length },
                { metric: 'Occupations', count: data.occupations.length },
              ]}
              columns={['metric', 'count']}
              numeric={['count']}
            />
          </Card>

          {/* ── Disposition standings (aggressors / beaten) ───────────────── */}
          {data.standings.length > 0 && (
            <Card title="Disposition standings (W/L)">
              <MiniTable
                rows={data.standings.map(s => ({ settlement: data.nameFor(s.id), wins: s.wins, losses: s.losses, net: s.score }))}
                columns={['settlement', 'wins', 'losses', 'net']}
                numeric={['wins', 'losses', 'net']}
              />
            </Card>
          )}

          {/* ── Military-strength comparison (heuristic latent host) ───────── */}
          <Card title="Military strength (latent host, heuristic)">
            <MiniTable
              rows={data.strengthRows.map(r => ({ settlement: r.dim, host: r.phrase }))}
              columns={['settlement', 'host']}
            />
          </Card>

          {/* ── Deployed-army status + attrition ─────────────────────────── */}
          {data.armies.length > 0 && (
            <Card title="Deployed armies (strength + attrition)">
              <MiniTable
                rows={data.armies.map(a => ({ from: data.nameFor(a.homeId), against: a.targetName, strength: a.remainingPhrase, condition: a.conditionPhrase }))}
                columns={['from', 'against', 'strength', 'condition']}
              />
            </Card>
          )}

          {/* ── Occupation + resistance ──────────────────────────────────── */}
          {data.occupations.length > 0 && (
            <Card title="Occupations + resistance">
              <MiniTable
                rows={data.occupations.map(o => ({ occupied: o.occupiedName, occupier: o.occupierName, state: o.statePhrase, resistance: o.resistancePhrase, pays: o.pays ? 'yes' : 'no' }))}
                columns={['occupied', 'occupier', 'state', 'resistance', 'pays']}
              />
            </Card>
          )}

          {/* ── War-weariness (exhaustion band) ──────────────────────────── */}
          {data.weary.length > 0 && (
            <Card title="War-weariness (exhaustion band)">
              <BarList rows={data.weary.map(w => ({ dim: data.nameFor(w.id), value: Math.round(w.warExhaustion * 100) }))} />
            </Card>
          )}

          {/* ── Deity / pantheon standings (B5 4-axis) ───────────────────── */}
          {/* Reads the SAME live pantheon ledger selectors the DM PantheonPanel
              and the PDF liveWorld slice consume. Self-gating: a religion-dormant
              campaign carries no `pantheon` key ⇒ pantheonStandings → [] ⇒ this
              Card renders nothing (byte-identical off-state). */}
          {data.pantheon.length > 0 && (
            <Card title="Pantheon standings (seats + W/L)">
              <MiniTable
                rows={data.pantheon.map(p => ({
                  deity: deityDisplayName(p.id),
                  tier: p.tier,
                  seats: p.seats,
                  'W/L': `${p.wins}/${p.losses}`,
                }))}
                columns={['deity', 'tier', 'seats', 'W/L']}
                numeric={['seats']}
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
}
