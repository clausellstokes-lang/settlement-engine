/**
 * WarFaithTab — the dossier's "War & Faith" sub-tab (Phase 5 W4e), built on OUR
 * floor. Two halves, each self-gating:
 *
 *   • WAR half — OUR LIGHT war display read-models (the same warStatus /
 *     mobilizationStatus / occupationStatus surfaces W4b reads): siege,
 *     deployment / mobilization, occupation, and war-weariness, resolved from the
 *     owning campaign's LIVE worldState. Renders NOTHING for a peaceful or
 *     non-campaign town, and NO deity data — faith is the other half's job.
 *
 *     These are deliberately the ZERO-to-light-import projections (warStatus.js
 *     has no imports at all). We do NOT reach for warResolve's resolve/supply
 *     band here — that pulls militaryStrength → the heavy engine chain, which
 *     would drag weight toward first paint. Siege/deployment/occupation tell the
 *     war story without it.
 *
 *   • FAITH half — OUR gated `FaithSection` (the Phase-4 W-F6 CONSTITUTIONAL
 *     premium seam), UNCHANGED. Free/anon see the generic true-neutral teaser and
 *     NEVER a deity name; an owned/shared embed renders the read-only panel to
 *     everyone.
 *
 * THE NON-NEGOTIABLE: this composes OUR FaithSection. It does NOT adopt THEIRS'
 * ungated `WarFaithSection` / `useSettlementLiveWorld`, which read
 * `worldState.religionStates` (the live pantheon: names, standings, legitimacy)
 * with no tier check and leak it to free/lapsed users. We resolve worldState ONLY
 * for the war read-models, which never touch the pantheon.
 */

import { useMemo } from 'react';
import { useStore } from '../../../store/index.js';
import { settlementWarStatus, settlementWarExhaustion, warExhaustionBand } from '../../../domain/display/warStatus.js';
import { settlementMobilization } from '../../../domain/display/mobilizationStatus.js';
import { settlementOccupation, occupierHoldings } from '../../../domain/display/occupationStatus.js';
import { renderTreatiesForSettlement } from '../../../domain/display/treatyDocument.js';
import FaithSection from '../../settlement/FaithSection.jsx';
import {
  FS, MUTED, BODY, BORDER, RED, GOLD, GREEN, SECOND, CARD, sans,
} from '../../theme.js';

function Line({ strong, tone = BODY, children }) {
  return (
    <div style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5, marginBottom: 5 }}>
      {strong && <strong style={{ color: tone }}>{strong} </strong>}{children}
    </div>
  );
}

/** The war half — pure OUR light war read-models; NO deity data (faith is gated below). */
function WarBlock({ war, nameFor }) {
  const { status, exhaustionRaw, exhaustionBand, mobilization, occupied, holdings } = war;
  const besieged = status?.besiegedBy?.length > 0;
  const deploying = status?.besiegingTargets?.length > 0;
  const statusLabel = besieged ? 'Under siege' : deploying ? 'On campaign' : occupied ? 'Occupied' : 'At war';
  const statusColor = besieged || occupied ? RED : deploying ? GOLD : MUTED;
  return (
    <div data-testid="war-block" style={{
      background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${RED}`,
      padding: '12px 14px', marginBottom: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
        <span style={{ fontSize: FS.xxs, fontWeight: 800, color: RED, textTransform: 'uppercase', letterSpacing: '0.07em' }}>War</span>
        <span style={{ marginLeft: 'auto', fontSize: FS.xxs, fontWeight: 800, color: statusColor }}>{statusLabel}</span>
      </div>

      {besieged && (
        <Line strong="Under siege." tone={RED}>
          {status.besiegedBy.length >= 2
            ? `A coalition of ${status.besiegedBy.map(nameFor).join(', ')} holds the walls.`
            : `${nameFor(status.besiegedBy[0])} lays siege.`}
        </Line>
      )}
      {deploying && (
        <Line strong="Deployed." tone={GOLD}>
          An army is abroad, besieging {status.besiegingTargets.map(nameFor).join(', ')}; the home garrison is thinned while it campaigns.
        </Line>
      )}
      {mobilization && (
        <Line strong="Mobilization.">
          {mobilization.phrase}
          {mobilization.ticksToDeploy > 0 && (
            <span style={{ color: MUTED }}>{` Roughly ${mobilization.ticksToDeploy} ${mobilization.ticksToDeploy === 1 ? 'tick' : 'ticks'} from marching.`}</span>
          )}
        </Line>
      )}
      {occupied && (
        <Line strong="Occupied." tone={RED}>
          Held by {occupied.occupierName}, {occupied.statePhrase}
          <span style={{ color: MUTED }}>{`; the population is ${occupied.resistancePhrase}.`}</span>
        </Line>
      )}
      {holdings && (
        <Line strong="Occupier.">
          Holds {holdings.holds.map(h => h.name).join(', ')}
          {holdings.stretchedThin && <span style={{ color: RED }}>{', stretched thin holding them'}</span>}
          {!holdings.stretchedThin && holdings.strengthened && <span style={{ color: GREEN }}>{', they now pay for themselves'}</span>}.
        </Line>
      )}
      {exhaustionRaw > 0 && (
        <Line strong="War-weary.">
          {exhaustionBand}
          {exhaustionBand === 'near peace' && <span style={{ color: MUTED }}>. The scar is healing; this realm leans toward peace.</span>}
          {exhaustionBand === 'exhausted' && <span style={{ color: MUTED }}>. Sustained fighting is pushing it to sue for peace.</span>}
        </Line>
      )}
    </div>
  );
}

/** The treaty half — the settlement's treaties as documents (W-PEACE-3 §13), from
 *  the light treatyDocument read-model. Shows the settlement's role, each term's
 *  compliance in the house voice, and the fraying seam. */
function TreatyBlock({ treaties, sid }) {
  return (
    <div data-testid="treaty-block" style={{ marginBottom: 14 }}>
      <div style={{ fontSize: FS.xxs, fontWeight: 800, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
        {treaties.length === 1 ? 'Treaty' : 'Treaties'}
      </div>
      {treaties.map((doc) => {
        const role = doc.victorId === sid ? 'as victor' : doc.loserId === sid ? 'as the bound party' : 'as a party';
        return (
          <div key={doc.pairKey} style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <strong style={{ color: BODY, fontSize: FS.xs, fontWeight: 800 }}>{doc.title}</strong>
              <span style={{ color: MUTED, fontSize: FS.pico, fontWeight: 700 }}>{role}</span>
              <span style={{ marginLeft: 'auto', color: doc.complianceState === 'defaulted' ? RED : doc.complianceState === 'strained' ? GOLD : GREEN, fontSize: FS.pico, fontWeight: 800, textTransform: 'uppercase' }}>{doc.complianceState}</span>
            </div>
            {doc.termLines.map((term) => (
              <div key={term.type} style={{ fontSize: FS.xxs, color: BODY, lineHeight: 1.5, marginBottom: 3 }}>
                <strong style={{ color: term.fraying ? RED : BODY, textTransform: 'capitalize' }}>{term.label}</strong>
                <span style={{ color: MUTED }}>{term.yearsRemaining > 0 ? ` · ${term.yearsRemaining}y left` : ' · lapsing'}</span>
                <span style={{ color: SECOND, fontStyle: 'italic' }}>{` — ${term.strainLine}`}</span>
              </div>
            ))}
            {doc.frayingLine && <div style={{ color: RED, fontSize: FS.pico, fontWeight: 700, marginTop: 4 }}>{doc.frayingLine}</div>}
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {{ settlement: any, saveId?: string|null, publicDossier?: boolean }} props
 */
export default function WarFaithTab({ settlement, saveId = null, publicDossier = false }) {
  const sid = saveId != null ? String(saveId)
    : (settlement?.id != null ? String(settlement.id) : null);

  const campaigns = useStore(s => s.campaigns);
  const savedSettlements = useStore(s => s.savedSettlements);
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  const isPremium = tier === 'premium' || elevated;

  const nameFor = useMemo(() => {
    const byId = new Map();
    (savedSettlements || []).forEach(s => {
      const i = String(s?.id ?? s?.settlement?.id ?? '');
      if (i) byId.set(i, s?.settlement?.name || s?.name || i);
    });
    return (id) => byId.get(String(id)) || String(id);
  }, [savedSettlements]);

  // Resolve the owning campaign's LIVE worldState from the settlement's save id —
  // a plain roster scan, NOT THEIRS' useSettlementLiveWorld (which also exposes
  // the pantheon). worldState is read ONLY by the light war read-models below.
  const war = useMemo(() => {
    if (!sid || !Array.isArray(campaigns)) return null;
    const campaign = campaigns.find(c =>
      (c.settlementIds || []).map(String).includes(sid) && c.worldState?.canonizedAt);
    if (!campaign) return null;
    const worldState = campaign.worldState;
    const regionalGraph = campaign.regionalGraph || worldState.regionalGraph || null;
    const status = settlementWarStatus({ settlementId: sid, worldState, regionalGraph });
    const exhaustionRaw = settlementWarExhaustion({ settlementId: sid, worldState });
    return {
      status,
      exhaustionRaw,
      exhaustionBand: warExhaustionBand(exhaustionRaw),
      mobilization: settlementMobilization({ settlementId: sid, worldState }), // covert excluded
      occupied: settlementOccupation({ settlementId: sid, worldState, nameFor }),
      holdings: occupierHoldings({ settlementId: sid, worldState, nameFor }),
      // W-PEACE-3: the settlement's treaties as documents (light read-model; dark ⇒ []).
      treaties: renderTreatiesForSettlement(worldState, sid),
    };
  }, [sid, campaigns, nameFor]);

  // War half self-gate: only a live campaign with siege / deployment / mobilization
  // / occupation / war-weariness has anything to say. A quiet campaign town shows
  // no war block.
  const hasWar = !!war && (
    war.status?.besiegedBy?.length > 0
    || war.status?.besiegingTargets?.length > 0
    || war.exhaustionRaw > 0
    || !!war.mobilization
    || !!war.occupied
    || !!war.holdings
  );
  // The treaty half self-gates independently: a settlement at peace UNDER a treaty
  // still shows its treaty document even with no live war beat.
  const hasTreaties = !!war && war.treaties?.length > 0;

  // Faith half renders SOMETHING unless the viewer is premium/elevated AND the
  // settlement carries no deity embed (FaithSection's HIDDEN mode). Mirror that so
  // an entirely-dormant tab shows an honest note rather than a blank body.
  const hasEmbed = !!(settlement?.config?.primaryDeitySnapshot
    && typeof settlement.config.primaryDeitySnapshot === 'object');
  const faithWillRender = hasEmbed || !isPremium;

  return (
    <div data-testid="war-faith-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {hasWar && <WarBlock war={war} nameFor={nameFor} />}
      {hasTreaties && <TreatyBlock treaties={war.treaties} sid={sid} />}
      {/* The gated faith surface — the constitutional seam, unchanged. */}
      <FaithSection settlement={settlement} publicDossier={publicDossier} />
      {!hasWar && !hasTreaties && !faithWillRender && (
        <div style={{ padding: 24, textAlign: 'center', color: MUTED, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.6 }}>
          This settlement is at peace and keeps no named faith.
        </div>
      )}
    </div>
  );
}
