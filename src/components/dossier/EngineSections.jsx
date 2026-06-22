/**
 * EngineSections — self-gating "deepen the static tab with the live engine"
 * sections (UX overhaul Phase 2, plan §4.1). Each is appended to its owning tab
 * (Economics / Defense / Power / NPCs) and self-gates to NOTHING when there is no
 * live or causal content to add, so the default dossier stays clean and a
 * non-campaign / peaceful settlement is byte-identical.
 *
 * All read pure display read-models (deriveBlockadeRelief, deriveCausalState,
 * coupContenders, previousGovernments, NPC agency fields). No store writes, no
 * rng. Altitude-aware where the spec asks for it (band detail at Detail+).
 */

import { useMemo } from 'react';
import { deriveBlockadeRelief } from '../../domain/display/dossierViewModel.js';
import { deriveCausalState } from '../../domain/causalState.js';
import { coupContenders } from '../../domain/rulingPower.js';
import { useAltitude } from '../../hooks/useAltitude.js';
import {
  FS, INK, MUTED, BODY, BORDER, CARD, CARD_HDR, GOLD, GREEN, RED, AMBER, sans, SP, R, swatch,
} from '../theme.js';

const BAND_COLOR = {
  surplus: '#1a5a28', adequate: '#3f7d3f', strained: '#a0762a',
  critical: '#b15a1f', collapsed: '#8b1a1a',
};

function BandPill({ band }) {
  if (!band) return null;
  return (
    <span data-band={band} style={{
      display: 'inline-block', padding: '1px 7px', borderRadius: R.sm, fontSize: FS.xxs,
      fontWeight: 800, letterSpacing: 0.3, textTransform: 'uppercase', color: swatch.white,
      background: BAND_COLOR[band] || MUTED,
    }}>{band}</span>
  );
}

function SectionShell({ title, accent = GOLD, testid, children }) {
  return (
    <div data-testid={testid} style={{
      background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${accent}`,
      borderRadius: R.md, overflow: 'hidden', margin: '12px 0', fontFamily: sans,
    }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em',
        background: CARD_HDR, padding: `${SP.sm}px ${SP.md}px`, borderBottom: `1px solid ${BORDER}`,
      }}>{title}</div>
      <div style={{ padding: SP.md }}>{children}</div>
    </div>
  );
}

// ── Economics: economic_capacity band + live granary gauge ────────────────────

/**
 * @param {{ settlement: any }} props
 */
export function EconomicsGranarySection({ settlement }) {
  const { level } = useAltitude();
  const model = useMemo(() => {
    if (!settlement) return null;
    const relief = deriveBlockadeRelief(settlement);
    const causal = deriveCausalState(settlement);
    const cap = causal.variables.economic_capacity || null;
    const sp = settlement?.economicState?.foodSecurity?.stockpile || null;
    const storageMonths = Number.isFinite(sp?.storageMonths) ? sp.storageMonths : null;
    const capacityMonths = Number.isFinite(sp?.capacityMonths) ? sp.capacityMonths : null;
    const flags = [];
    if (sp?.tithe) flags.push('tithe');
    if (sp?.drawdown) flags.push('drawdown');
    if (relief.blockaded) flags.push('blockade');
    if (sp?.deployment || sp?.deployed) flags.push('deployment');
    return { relief, cap, storageMonths, capacityMonths, flags, hasStockpile: relief.available };
  }, [settlement]);

  if (!model) return null;
  // Self-gate: nothing to add when there's no economic_capacity band AND no live
  // stockpile record (a settlement the pulse never touched).
  if (!model.cap && !model.hasStockpile) return null;

  const pct = model.capacityMonths && model.storageMonths != null
    ? Math.max(0, Math.min(100, Math.round((model.storageMonths / model.capacityMonths) * 100)))
    : null;

  return (
    <SectionShell title="Economic capacity and granary" accent={GOLD} testid="economics-granary-section">
      {model.cap && (
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.sm }}>
          <span style={{ fontSize: FS.sm, fontWeight: 700, color: INK, flex: 1 }}>Economic capacity</span>
          <BandPill band={model.cap.band} />
          {level !== 'guided' && <span style={{ fontSize: FS.xs, color: MUTED }}>{model.cap.score}</span>}
        </div>
      )}
      {model.storageMonths != null && (
        <div data-testid="granary-gauge" style={{ marginBottom: SP.sm }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: 3 }}>
            <span style={{ fontSize: FS.sm, fontWeight: 700, color: INK, flex: 1 }}>Granary</span>
            <span style={{ fontSize: FS.xs, color: MUTED }}>
              {model.storageMonths.toFixed(1)}{model.capacityMonths ? ` / ${model.capacityMonths}` : ''} mo
            </span>
          </div>
          {pct != null && (
            <div style={{ height: 8, background: BORDER, borderRadius: R.sm, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: pct >= 50 ? GREEN : pct >= 25 ? AMBER : RED }} />
            </div>
          )}
        </div>
      )}
      {model.flags.length > 0 && (
        <div data-testid="granary-flags" style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: model.relief.display ? SP.sm : 0 }}>
          {model.flags.map(f => (
            <span key={f} style={{
              fontSize: FS.xxs, fontWeight: 700, color: f === 'blockade' ? RED : GOLD,
              background: CARD_HDR, border: `1px solid ${BORDER}`, borderRadius: 3, padding: '1px 6px',
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>{f}</span>
          ))}
        </div>
      )}
      {model.relief.display && (
        <p style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5, margin: 0 }}>{model.relief.display}</p>
      )}
    </SectionShell>
  );
}

// ── Defense: frozen scores → live defense_readiness + war-front readout ───────

/**
 * @param {{ settlement: any, warStatus?: any, nameFor?: (id:any)=>string }} props
 */
export function DefenseWarFrontSection({ settlement, warStatus = null, nameFor = (id) => String(id) }) {
  const model = useMemo(() => {
    if (!settlement) return null;
    const causal = deriveCausalState(settlement);
    const readiness = causal.variables.defense_readiness || null;
    const contributors = Array.isArray(readiness?.contributors) ? readiness.contributors : [];
    const frozen = settlement?.defenseProfile?.scores || null;
    return { readiness, contributors, frozen };
  }, [settlement]);

  if (!model) return null;
  const live = warStatus && (warStatus.besiegingTargets?.length || warStatus.besiegedBy?.length);
  // Self-gate: nothing live AND no readiness band ⇒ render nothing.
  if (!live && !model.readiness) return null;

  return (
    <SectionShell title="Defense readiness (live)" accent={RED} testid="defense-warfront-section">
      {model.readiness && (
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.sm }}>
          <span style={{ fontSize: FS.sm, fontWeight: 700, color: INK, flex: 1 }}>Defense readiness</span>
          <BandPill band={model.readiness.band} />
          <span style={{ fontSize: FS.xs, color: MUTED }}>{model.readiness.score}</span>
        </div>
      )}
      {model.contributors.length > 0 && (
        <ul style={{ margin: `0 0 ${SP.sm}px`, padding: '0 0 0 14px', listStyle: 'none' }}>
          {model.contributors.slice(0, 6).map((c, i) => (
            <li key={i} style={{ fontSize: FS.xs, color: BODY, marginBottom: 2 }}>
              <span style={{ color: c.delta > 0 ? BAND_COLOR.adequate : c.delta < 0 ? BAND_COLOR.critical : MUTED, fontWeight: 700 }}>
                {c.delta > 0 ? `+${c.delta}` : c.delta < 0 ? `${c.delta}` : '·'}
              </span>{' '}{c.reason}
            </li>
          ))}
        </ul>
      )}
      {live && (
        <div data-testid="war-front-readout" style={{ fontSize: FS.sm, color: BODY, lineHeight: 1.5 }}>
          {warStatus.besiegedBy?.length > 0 && (
            <p style={{ margin: '0 0 4px' }}>
              <strong style={{ color: RED }}>War front:</strong>{' '}
              {warStatus.besiegedBy.length >= 2
                ? `Besieged by a coalition (${warStatus.besiegedBy.map(nameFor).join(', ')}). The garrison is thinning under sustained assault.`
                : `Besieged by ${nameFor(warStatus.besiegedBy[0])}. The garrison holds the walls.`}
            </p>
          )}
          {warStatus.besiegingTargets?.length > 0 && (
            <p style={{ margin: 0 }}>
              <strong style={{ color: GOLD }}>Deployed:</strong>{' '}
              An army is abroad besieging {warStatus.besiegingTargets.map(nameFor).join(', ')}; the home garrison is thinned while it campaigns.
            </p>
          )}
        </div>
      )}
    </SectionShell>
  );
}

// ── Power: ruler identity, coup forecast, lineage, disposition ────────────────

/**
 * @param {{ settlement: any }} props
 */
export function PowerSuccessionSection({ settlement }) {
  const { level } = useAltitude();
  const model = useMemo(() => {
    if (!settlement) return null;
    const ps = settlement.powerStructure || {};
    const contenders = coupContenders(settlement);
    const previous = Array.isArray(ps.previousGovernments) ? ps.previousGovernments : [];
    return { ps, contenders, previous };
  }, [settlement]);

  if (!model) return null;
  const { ps, contenders, previous } = model;
  const incumbentName = contenders.incumbent?.name || ps.governingName || ps.government || null;
  // Self-gate: a placeholder with no ruler, no challengers, no lineage adds nothing.
  if (!incumbentName && contenders.challengers.length === 0 && previous.length === 0) return null;

  // A coarse coup-risk read from the gated/ungated incumbent case (no rng).
  let riskLabel = 'Stable', riskColor = GREEN;
  if (contenders.challengers.length) {
    if (!contenders.incumbent.gated) { riskLabel = 'Critical. The seat could fall'; riskColor = RED; }
    else if (contenders.incumbent.amplifiedWeight < contenders.challengers[0].weight) { riskLabel = 'Contested'; riskColor = AMBER; }
    else { riskLabel = 'Holding'; riskColor = GOLD; }
  }

  return (
    <SectionShell title="Rule and succession" accent={GOLD} testid="power-succession-section">
      {incumbentName && (
        <div style={{ fontSize: FS.sm, color: BODY, marginBottom: SP.xs }}>
          <strong>Ruler:</strong> {incumbentName}
          {Number.isFinite(contenders.incumbent?.govMultiplier) && level !== 'guided' && (
            <span style={{ color: MUTED }}> · legitimacy ×{contenders.incumbent.govMultiplier}</span>
          )}
        </div>
      )}
      <div data-testid="coup-risk" style={{ fontSize: FS.sm, color: BODY, marginBottom: SP.xs }}>
        <strong>Coup risk:</strong>{' '}
        <span style={{ color: riskColor, fontWeight: 700 }}>{riskLabel}</span>
      </div>
      {level !== 'guided' && contenders.challengers.length > 0 && (
        <div style={{ marginBottom: SP.xs }}>
          <div style={{ fontSize: FS.xxs, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Contenders</div>
          {contenders.challengers.map((c, i) => (
            <div key={i} style={{ fontSize: FS.xs, color: BODY, display: 'flex', gap: SP.sm }}>
              <span style={{ flex: 1 }}>{c.name}</span>
              <span style={{ color: MUTED }}>{c.archetype}</span>
              <span style={{ fontWeight: 700, color: INK }}>w {c.weight}</span>
            </div>
          ))}
        </div>
      )}
      {previous.length > 0 && (
        <div data-testid="government-lineage">
          <div style={{ fontSize: FS.xxs, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>Lineage</div>
          {previous.slice(-4).map((g, i) => (
            <div key={i} style={{ fontSize: FS.xs, color: BODY }}>
              {g.label || g.government || 'Prior government'}
              {g.cause ? <span style={{ color: MUTED }}>, {g.cause}</span> : null}
            </div>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

// ── NPCs: agency disclosure (goals / ambition / rivalries / consequence) ──────

/** Whether any NPC carries agency fields worth disclosing. */
function npcHasAgency(npc) {
  return !!(
    (npc?.goals && npc.goals.length) || npc?.goal?.short || npc?.ambition ||
    (npc?.rivalries && npc.rivalries.length) || (npc?.rivals && npc.rivals.length) ||
    npc?.consequenceIfRemoved
  );
}

/**
 * @param {{ npcs?: any[] }} props
 */
export function NpcAgencySection({ npcs }) {
  const agents = useMemo(() => {
    const list = Array.isArray(npcs) ? npcs : [];
    return list
      .filter(npcHasAgency)
      .sort((a, b) => (b.power || 0) - (a.power || 0))
      .slice(0, 6);
  }, [npcs]);

  if (agents.length === 0) return null;

  return (
    <SectionShell title="NPC agency" accent={GOLD} testid="npc-agency-section">
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
        {agents.map((npc, i) => {
          const goal = npc.goal?.short || (Array.isArray(npc.goals) ? npc.goals[0] : null);
          const rivals = Array.isArray(npc.rivalries) ? npc.rivalries : Array.isArray(npc.rivals) ? npc.rivals : [];
          return (
            <div key={i} data-npc-agent style={{ borderBottom: i < agents.length - 1 ? `1px solid ${BORDER}` : 'none', paddingBottom: SP.xs }}>
              <div style={{ fontSize: FS.sm, fontWeight: 700, color: INK }}>{npc.name}{npc.title ? <span style={{ color: MUTED, fontWeight: 400 }}> · {npc.title}</span> : null}</div>
              {goal && <div style={{ fontSize: FS.xs, color: BODY }}><span style={{ color: GOLD, fontWeight: 700 }}>Goal:</span> {goal}</div>}
              {npc.ambition && <div style={{ fontSize: FS.xs, color: BODY }}><span style={{ color: GOLD, fontWeight: 700 }}>Ambition:</span> {npc.ambition}</div>}
              {rivals.length > 0 && <div style={{ fontSize: FS.xs, color: BODY }}><span style={{ color: RED, fontWeight: 700 }}>Rivals:</span> {rivals.map(r => (typeof r === 'string' ? r : r?.name)).filter(Boolean).join(', ')}</div>}
              {npc.consequenceIfRemoved && <div style={{ fontSize: FS.xs, color: MUTED, fontStyle: 'italic' }}>If removed: {npc.consequenceIfRemoved}</div>}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
