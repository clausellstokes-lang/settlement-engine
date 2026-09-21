/**
 * WarTab — the dossier's WORLD-group WAR tab (§805: the war half of the old
 * WarFaithTab, split out and deepened to the owner's charter). Five surfaces,
 * each self-gating to honest absence:
 *
 *   • STANDING — siege / deployment / occupation / mobilization / war-weariness
 *     from OUR light read-models (warStatus / mobilizationStatus /
 *     occupationStatus), moved verbatim from WarFaithTab.
 *   • THE WARS — the live named wars this settlement stands in (TE-NAME's
 *     liveWarNames: origin pair + typed casus + the coalition folded onto the
 *     origin war), with allies and enemies read from the same rows.
 *   • MUSTER & CONDITION — what marched out (forceCompositionLine, the §746
 *     clerk), the army's status at time of checking (armyStrength condition
 *     phrases), and the settlement's own martial condition (readiness /
 *     experience / rust from martialReadiness — rendered only when the record
 *     exists; absent machinery renders NOTHING, never a fabricated zero).
 *   • UNITS ABROAD, AS BELIEVED — the §805 epistemic constitution made legible.
 *     The believed position of our own column derives from the transit record's
 *     courier umbilical (beliefStaleness): the last credible word, banded
 *     (current / aging / stale) with its source grade. The DM/user truth
 *     disclosure (the RumorsTab `includeGroundTruth` convention) shows the TRUE
 *     position AND THE DIVERGENCE — "you believe the host nears X; in truth it
 *     stands at Y" — the gap rendered explicitly, never smoothed.
 *   • WHAT THIS TOWN BELIEVES OF ITS NEIGHBOURS — settlementBeliefs rows,
 *     DM-only by that read-model's own fail-closed constitution (the player
 *     projection is EMPTY; §805's player half is carried by the believed unit
 *     positions above, which are the town's knowledge of its OWN army). The
 *     truthOf divergence join stays unbuilt here — assembling GroundTruthCtx in
 *     the display layer is the documented two-writer hazard
 *     (BeliefDivergenceBand's header carries the scoped follow-up).
 *
 * Treaties (TreatyBlock) move here whole from WarFaithTab. Faith is the FAITH
 * tab's job — this file reads NO deity data.
 */

import { tokenCase } from '../labelLadder.js';
import { useMemo } from 'react';
import { useStore } from '../../../store/index.js';
import { settlementWarStatus, settlementWarExhaustion, warExhaustionBand } from '../../../domain/display/warStatus.js';
import { settlementMobilization } from '../../../domain/display/mobilizationStatus.js';
import { tickDurationLabel } from '../../../domain/display/humanizeEngineTokens.js';
import { settlementOccupation, occupierHoldings } from '../../../domain/display/occupationStatus.js';
import { renderTreatiesForSettlement } from '../../../domain/display/treatyDocument.js';
import { liveWarNames } from '../../../domain/display/warAndRoadNames.js';
import { forceCompositionLine } from '../../../domain/display/forceComposition.js';
import { deployedArmyStatus } from '../../../domain/display/armyStrength.js';
import { settlementBeliefs, hasBeliefMaps, beliefStalenessBand } from '../../../domain/display/settlementBeliefs.js';
import { armyTransitLedger, stepArmyPosition, currentRegion, ARMY_ROLES } from '../../../domain/spatial/armyTransit.js';
import { hasMartialRecord, readinessOf, experienceOf, rustOf } from '../../../domain/worldPulse/martialReadiness.js';
// DS-WAR-3's faith half, through the CANONICAL reader rather than a second config read.
// `faithPanelModel` answers `{ hasEmbed: false }` for a town that keeps no named faith, and
// it is the same reader the faith tab uses — so the two halves of the page-set cannot
// disagree about whether this town has a patron. Only that BOOLEAN is taken: no deity name,
// no axis, no rank reaches this file, so the header's claim above still holds exactly.
import { faithPanelModel } from '../../settlement/faithPanelModel.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
// THE WAR & FAITH DESK, drawn through its one gated call site (WarFaithDesk.jsx). This tab
// does NOT call the desk itself: `warFaith` is one corpus leaf spanning two tabs, and the
// mount walker admits exactly one caller per desk so the public-dossier gate stays in one
// place. Faith is still the FAITH tab's job — nothing below reads deity data beyond the
// ABSENCE test DS-WAR-3's own condition names.
import {
  WarDormantNote, WarStandingLines, WarTreatyLines, warFaithDeskRungs,
} from './WarFaithDesk.jsx';
import {
  FS, MUTED, BODY, BORDER, BORDER2, CARD, CARD_ALT, INK, RED, GOLD, GREEN, SECOND, sans,
} from '../../theme.js';

function Line({ strong, tone = BODY, children }) {
  const mobile = useIsMobile();
  return (
    <div style={{ color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xs, mobile), lineHeight: 1.5, marginBottom: 5 }}>
      {strong && <strong style={{ color: tone }}>{strong} </strong>}{children}
    </div>
  );
}

function Eyebrow({ color = SECOND, children }) {
  const mobile = useIsMobile();
  return (
    <div style={{ fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
      {children}
    </div>
  );
}

/**
 * THE TOWN'S OWN MARTIAL CRISES (owner order 2026-09-17, "fix the remaining contradictions").
 *
 * The Overview prints an ACTIVE CRISIS card for every entry in `settlement.stress`, and five of
 * those stressors are martial facts: a siege at the walls, an occupier in the hall, a war the
 * town is supplying, an insurgency against its authority, a slave revolt in its districts. The
 * campaign's war ledger is a DIFFERENT record and can be silent about all five (a generated
 * siege is not a ledger siege), so a tab that read only the ledger said "This settlement is at
 * peace: no host abroad, no siege at the walls" beside that card. This reader is the one place
 * the tab asks the town's own record; the rows are the banners themselves, never a re-derivation.
 */
export const MARTIAL_CRISIS_TYPES = Object.freeze(['under_siege', 'occupied', 'wartime', 'insurgency', 'slave_revolt']);

/**
 * @param {{stress?: unknown}|null|undefined} settlement
 * @returns {Array<{type: string, label?: string, summary?: string, colour?: string}>}
 */
export function martialCrisisBanners(settlement) {
  const raw = settlement?.stress;
  const banners = (Array.isArray(raw) ? raw : raw ? [raw] : []).filter(Boolean);
  return banners.filter((banner) => MARTIAL_CRISIS_TYPES.includes(banner?.type));
}

/** The martial crises the town's own record carries, in the banners' own words. */
function MartialCrisisBlock({ crises }) {
  return (
    <div data-testid="war-martial-crisis" style={{
      background: CARD, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${RED}`,
      padding: '12px 14px', marginBottom: 14,
    }}>
      <Eyebrow color={RED}>Active crisis</Eyebrow>
      {crises.map((crisis, index) => (
        <Line key={`${crisis.type}:${index}`} strong={`${crisis.label || crisis.type}.`} tone={RED}>
          {crisis.summary || ''}
        </Line>
      ))}
    </div>
  );
}

/** The war half — pure OUR light war read-models (moved verbatim from WarFaithTab). */
function WarBlock({ war, nameFor }) {
  const mobile = useIsMobile();
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
        <span style={{ fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: RED, textTransform: 'uppercase', letterSpacing: '0.07em' }}>War</span>
        <span style={{ marginLeft: 'auto', fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color: statusColor }}>{statusLabel}</span>
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
            <span style={{ color: MUTED }}>{` Roughly ${tickDurationLabel(mobilization.ticksToDeploy)} from marching.`}</span>
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

/** The live named wars this settlement stands in — allies and enemies from the
 *  war edges themselves (coalition joiners fold onto the origin pair; the typed
 *  casus rides each row's derived line). */
function WarsBlock({ wars, sid, nameFor }) {
  const mobile = useIsMobile();
  return (
    <div data-testid="war-wars" style={{ marginBottom: 14 }}>
      <Eyebrow color={RED}>{wars.length === 1 ? 'The war' : 'The wars'}</Eyebrow>
      {wars.map((war) => {
        const onAttack = war.participants.includes(sid);
        const allies = onAttack
          ? war.participants.filter(id => id !== sid).map(nameFor)
          : [];
        const enemies = onAttack ? [nameFor(war.defenderId)] : war.participants.map(nameFor);
        return (
          <div key={war.key} style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
              <strong style={{ color: INK, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800 }}>{war.name}</strong>
              <span style={{ marginLeft: 'auto', color: onAttack ? GOLD : RED, fontSize: chromeFontSize(FS.pico, mobile), fontWeight: 800 }}>
                {onAttack ? 'Attacking' : 'Defending'}
              </span>
            </div>
            {war.line && <div style={{ color: SECOND, fontSize: proseFontSize(FS.xxs, mobile), fontStyle: 'italic', lineHeight: 1.5, marginTop: 3 }}>{war.line}</div>}
            <div style={{ color: BODY, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.5, marginTop: 4 }}>
              {allies.length > 0 && (<span><strong style={{ color: GREEN }}>Beside:</strong> {allies.join(', ')} · </span>)}
              <strong style={{ color: RED }}>Against:</strong> {enemies.join(', ')}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// The martial-condition words. Readiness reuses the belief model's own scale
// semantics (in the field / mobilizing / on alert / at peace live in
// settlementBeliefs and describe OTHERS); this is the town's own drill, so the
// words describe practice, not posture.
function experienceWords(experience01, rust01) {
  if (experience01 >= 0.75) return { word: 'seasoned', note: 'its captains have fought and remember how' };
  if (experience01 >= 0.45) return { word: 'blooded', note: 'it has seen enough war to keep its drill honest' };
  return rust01 > 0.1
    ? { word: 'rusted', note: 'a long peace has dulled the drill; its first war will teach hard lessons' }
    : { word: 'green', note: 'it has yet to be tested' };
}
function readinessWords(readiness01) {
  if (readiness01 >= 0.75) return 'on a war footing';
  if (readiness01 >= 0.5) return 'braced for war';
  if (readiness01 >= 0.25) return 'watchful';
  return 'settled to peace';
}

/** Muster & condition — what marched out, its status at time of checking, and the
 *  town's own martial condition. Every row self-gates on its data existing. */
function MusterBlock({ musterLine, armyStatus, martial }) {
  return (
    <div data-testid="war-muster" style={{ marginBottom: 14 }}>
      <Eyebrow>Muster &amp; condition</Eyebrow>
      {musterLine && <Line strong="Marched out.">{musterLine}</Line>}
      {armyStatus && (
        <Line strong="Condition." tone={armyStatus.weakened ? RED : BODY}>
          Before {armyStatus.targetName}: {armyStatus.remainingPhrase}
          {armyStatus.conditionPhrase && <span style={{ color: MUTED }}>{`; ${armyStatus.conditionPhrase}`}</span>}.
        </Line>
      )}
      {martial && (
        <Line strong="The town under arms.">
          {`This settlement stands ${martial.readinessWord}; its soldiery is ${martial.experience.word}`}
          <span style={{ color: MUTED }}>{`: ${martial.experience.note}.`}</span>
        </Line>
      )}
    </div>
  );
}

const ROLE_WORD = Object.freeze({
  [ARMY_ROLES.MARCH]: 'marching on',
  [ARMY_ROLES.REINFORCEMENT]: 'reinforcing',
  [ARMY_ROLES.RETREAT]: 'retreating toward',
  [ARMY_ROLES.CONVOY]: 'carried by sea toward',
  [ARMY_ROLES.BLOCKADE]: 'blockading',
});
const STALENESS_TONE = Object.freeze({ current: GREEN, aging: GOLD, stale: RED });

/** One unit entry: the believed position + staleness band + source grade, with the
 *  DM-truth disclosure showing the true picture and the divergence. */
function UnitEntry({ unit, includeGroundTruth }) {
  const mobile = useIsMobile();
  const { roleWord, destName, believedAt, trueAt, staleness, stalenessBand, arrivedWord } = unit;
  return (
    <article data-testid="war-unit" style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '10px 12px', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
        <strong style={{ color: INK, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800 }}>The host, {roleWord} {destName}</strong>
        <span data-testid="war-unit-staleness" style={{ marginLeft: 'auto', color: STALENESS_TONE[stalenessBand] || MUTED, fontSize: chromeFontSize(FS.pico, mobile), fontWeight: 800, whiteSpace: 'nowrap' }}>
          Word {stalenessBand}
        </span>
      </div>
      <div style={{ color: BODY, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.5, marginTop: 4 }}>
        {arrivedWord
          ? arrivedWord
          : <>Believed {believedAt.same ? 'at' : 'near'} <strong style={{ color: INK }}>{believedAt.name}</strong>.</>}
      </div>
      <div style={{ color: SECOND, fontSize: chromeFontSize(FS.pico, mobile), fontWeight: 700, marginTop: 3 }}>
        {staleness > 0
          ? `Last credible word, ${tickDurationLabel(staleness)} old. The courier line home is cut.`
          : 'Fresh word. The courier line home holds.'}
      </div>
      {includeGroundTruth && (
        <details style={{ marginTop: 8, border: `1px solid ${BORDER2}`, background: CARD_ALT, overflow: 'hidden' }}>
          <summary style={{ cursor: 'pointer', padding: '5px 9px', color: GOLD, fontFamily: sans, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 900 }}>
            DM truth
          </summary>
          <div data-testid="war-unit-truth" style={{ padding: '7px 9px', color: BODY, fontFamily: sans, fontSize: proseFontSize(FS.xxs, mobile), lineHeight: 1.5 }}>
            <div><strong style={{ color: INK }}>Where it truly stands:</strong> {trueAt.name}.</div>
            {trueAt.name !== believedAt.name ? (
              <div style={{ color: SECOND }}>
                <strong style={{ color: INK }}>The gap:</strong>{' '}
                {`The town believes the host ${believedAt.same ? 'at' : 'near'} ${believedAt.name}; in truth it stands at ${trueAt.name}.`}
              </div>
            ) : (
              <div style={{ color: SECOND }}>The believed picture holds true.</div>
            )}
          </div>
        </details>
      )}
    </article>
  );
}

/** DM-only: what this town privately believes of its neighbours (settlementBeliefs —
 *  fail-closed player projection, so this renders under includeGroundTruth alone). */
function BeliefsBlock({ beliefs }) {
  const mobile = useIsMobile();
  return (
    <div data-testid="war-beliefs" style={{ marginBottom: 14 }}>
      <Eyebrow color={GOLD}>DM · what this town believes of its neighbours</Eyebrow>
      {beliefs.map((b) => {
        // BOTH OF THESE ARE BAND WORDS, and they are named as words here.
        // settlementBeliefs returns `confidence`/`staleness` already banded
        // (beliefConfidenceBand and its staleness sibling) — the very fields the
        // same record spells `strengthWord`/`readinessWord` one line above. The
        // model just forgot the suffix on two of five, and to the prose-numerics
        // walker `confidence` is a FLOAT_TOKEN, so a word read like a scalar.
        // ⚠ FOR THE CHAIR: the honest whole-estate cure is to rename those two
        // keys IN settlementBeliefs.js so the model stops contradicting itself,
        // but that read-model has three other consumers; declared locally here.
        const confidenceWord = b.confidence;
        const stalenessWord = b.staleness;
        return (
          <div key={b.subjectId} style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '8px 10px', marginBottom: 6 }}>
            <span style={{ color: INK, fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800 }}>{b.subjectName}</span>
            <span style={{ color: BODY, fontSize: chromeFontSize(FS.xxs, mobile) }}>{`: believed ${b.believed.strengthWord}, ${b.believed.readinessWord}`}</span>
            <span style={{ color: MUTED, fontSize: chromeFontSize(FS.pico, mobile), fontWeight: 700 }}>
              {` · ${confidenceWord} · ${stalenessWord}${b.agoTicks > 0 ? `, heard ${tickDurationLabel(b.agoTicks)} ago` : ''}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** The treaty half — the settlement's treaties as documents (W-PEACE-3 §13), moved
 *  verbatim from WarFaithTab. */
function TreatyBlock({ treaties, sid }) {
  const mobile = useIsMobile();
  return (
    <div data-testid="treaty-block" style={{ marginBottom: 14 }}>
      <Eyebrow>{treaties.length === 1 ? 'Treaty' : 'Treaties'}</Eyebrow>
      {treaties.map((doc) => {
        // THE ROLE WORD COMES FROM THE LEDGER'S OWN ORIENTATION (chair ruling
        // CR-WR10-G): the read-model carries the closed word for each side of
        // whichever instrument this is, falling back to the war spelling for any
        // document minted before it did.
        const role = doc.victorId === sid ? `as ${doc.receiverRole || 'victor'}`
          : doc.loserId === sid ? `as ${doc.giverRole || 'the bound party'}` : 'as a party';
        return (
          <div key={doc.pairKey} style={{ border: `1px solid ${BORDER}`, background: CARD, padding: '10px 12px', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
              <strong style={{ color: BODY, fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800 }}>{doc.title}</strong>
              <span style={{ color: MUTED, fontSize: chromeFontSize(FS.pico, mobile), fontWeight: 700 }}>{role}</span>
              <span style={{ marginLeft: 'auto', color: doc.complianceState === 'defaulted' ? RED : doc.complianceState === 'strained' ? GOLD : GREEN, fontSize: chromeFontSize(FS.pico, mobile), fontWeight: 800 }}>{tokenCase(doc.complianceState)}</span>
            </div>
            {doc.termLines.map((term) => (
              <div key={term.type} style={{ fontSize: proseFontSize(FS.xxs, mobile), color: BODY, lineHeight: 1.5, marginBottom: 3 }}>
                <strong style={{ color: term.fraying ? RED : BODY, textTransform: 'capitalize' }}>{term.label}</strong>
                <span style={{ color: MUTED }}>{term.yearsRemaining > 0 ? ` · ${term.yearsRemaining}y left` : ' · lapsing'}</span>
                <span style={{ color: SECOND, fontStyle: 'italic' }}>{` · ${term.strainLine}`}</span>
              </div>
            ))}
            {doc.frayingLine && <div style={{ color: RED, fontSize: chromeFontSize(FS.pico, mobile), fontWeight: 700, marginTop: 4 }}>{doc.frayingLine}</div>}
            {/* GR-0 the longevity voice — null while the lifecycle-voice flag is dark. */}
            {doc.ageLine && <div style={{ color: SECOND, fontSize: chromeFontSize(FS.pico, mobile), fontStyle: 'italic', marginTop: 4 }}>{doc.ageLine}</div>}
            {/* GR-4b-iii-b the open-question dossier line — same block as the realm panel. */}
            {doc.successionLines.map((line, index) => (
              <div key={`${index}:${line}`} data-testid="treaty-succession-question-line" style={{ color: SECOND, fontSize: chromeFontSize(FS.pico, mobile), fontStyle: 'italic', marginTop: 4 }}>{line}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/**
 * @param {{ settlement: any, saveId?: string|null, playerView?: boolean, publicDossier?: boolean }} props
 */
export default function WarTab({ settlement, saveId = null, playerView = false, publicDossier = false }) {
  const sid = saveId != null ? String(saveId)
    : (settlement?.id != null ? String(settlement.id) : null);

  const campaigns = useStore(s => s.campaigns);
  const savedSettlements = useStore(s => s.savedSettlements);
  const tier = useStore(s => s.auth?.tier);
  const elevated = useStore(s => (typeof s.isElevated === 'function' ? s.isElevated() : false));
  // The DM truth reveal (the includeGroundTruth convention, RumorsTab verbatim):
  // never on the player view, never on a public/shared dossier.
  const includeGroundTruth = (tier === 'premium' || elevated) && !playerView && !publicDossier;

  const nameFor = useMemo(() => {
    const byId = new Map();
    (savedSettlements || []).forEach(s => {
      const i = String(s?.id ?? s?.settlement?.id ?? '');
      if (i) byId.set(i, s?.settlement?.name || s?.name || i);
    });
    return (id) => byId.get(String(id)) || String(id);
  }, [savedSettlements]);

  // Resolve the owning campaign's LIVE worldState from the settlement's save id —
  // a plain roster scan (the WarFaithTab lineage). worldState feeds ONLY the war
  // read-models; no deity data is read here.
  const war = useMemo(() => {
    if (!sid || !Array.isArray(campaigns)) return null;
    const campaign = campaigns.find(c =>
      (c.settlementIds || []).map(String).includes(sid) && c.worldState?.canonizedAt);
    if (!campaign) return null;
    const worldState = campaign.worldState;
    const regionalGraph = campaign.regionalGraph || worldState.regionalGraph || null;
    const status = settlementWarStatus({ settlementId: sid, worldState, regionalGraph });
    const exhaustionRaw = settlementWarExhaustion({ settlementId: sid, worldState });
    const deployments = worldState.deployments && typeof worldState.deployments === 'object' ? worldState.deployments : {};
    const record = deployments[sid] || null;
    const tick = Math.max(0, Math.floor(Number(worldState.tick) || 0));

    // §805 UNITS: our own column's BELIEVED position, derived from the transit
    // record's own courier umbilical — the position as of the last credible word
    // (lastTick − beliefStaleness), re-stepped through the ledger's own kinematics
    // (stepArmyPosition / currentRegion — reuse, never a re-derivation).
    const transit = armyTransitLedger(worldState);
    const ours = transit && transit[sid] ? transit[sid] : null;
    let unit = null;
    if (ours) {
      const staleness = Math.max(0, Math.floor(Number(ours.beliefStaleness) || 0));
      const believedTick = Math.max(ours.departTick, (Number(ours.lastTick) || tick) - staleness);
      const believedRegionId = currentRegion(stepArmyPosition(ours, believedTick));
      const trueRegionId = currentRegion(ours);
      unit = {
        roleWord: ROLE_WORD[ours.role] || 'marching on',
        destName: nameFor(ours.destId),
        believedAt: { name: nameFor(believedRegionId), same: believedRegionId === ours.destId },
        trueAt: { name: nameFor(trueRegionId) },
        staleness,
        stalenessBand: beliefStalenessBand(staleness),
        arrivedWord: null,
      };
    } else if (record && record.targetId != null && status?.besiegingTargets?.length > 0) {
      // Arrived and in place: the deployment record without a transit column.
      unit = {
        roleWord: 'besieging',
        destName: nameFor(record.targetId),
        believedAt: { name: nameFor(record.targetId), same: true },
        trueAt: { name: nameFor(record.targetId) },
        staleness: 0,
        stalenessBand: 'current',
        arrivedWord: `Stands before the walls of ${nameFor(record.targetId)}.`,
      };
    }

    // Muster & condition — each row self-gates on its record existing.
    const musterLine = record ? forceCompositionLine({ settlement, record, homeId: sid, nameFor }) : null;
    const armyStatus = deployedArmyStatus({ settlementId: sid, worldState, nameFor });
    const martial = hasMartialRecord(settlement)
      ? {
          readinessWord: readinessWords(readinessOf(settlement)),
          experience: experienceWords(experienceOf(settlement), rustOf(settlement)),
        }
      : null;

    // The named wars this settlement stands in (attacker side rides participants;
    // the defender is the row's defenderId).
    const wars = liveWarNames({ worldState, nameFor })
      .filter(w => w.participants.includes(sid) || w.defenderId === sid);

    // DM-only: the town's private picture of its neighbours (fail-closed).
    const beliefs = includeGroundTruth && hasBeliefMaps(worldState)
      ? settlementBeliefs({ worldState, observerId: sid, includeGroundTruth: true, nameFor })
      : [];

    // THE DESK'S TWO EXTRA READINGS, and both are deliberate rather than convenient.
    //
    // `postureState` is the RAW ledger token. `settlementMobilization` converts it to a
    // PHRASE and the desk cannot key on a phrase (the label trap), but the sharper reason
    // is that `ticksToDeploy` returns 0 at BOTH ends of the ramp — for `mobilized` and for
    // `demobilizing` alike — so a desk without the token would print the muster complete
    // over a town standing down. The token is the producer's own datum, not a re-derivation.
    //
    // `counterpart` is the ONE opposing town resolved to a NAME here, with this tab's own
    // roster, because the ids in `status` are save ids and the desk never turns an id into
    // a name. A COALITION HAS NO COUNTERPART: the corpus's `{counterpart}` seams are
    // singular, so two besiegers leave it empty and anchored liveness drops those variants
    // rather than the page naming an enemy by array order.
    const posture = worldState.warPosture && typeof worldState.warPosture === 'object'
      ? worldState.warPosture[sid] : null;
    const lone = (ids) => (Array.isArray(ids) && ids.length === 1 ? nameFor(ids[0]) : '');

    // ⛔ THE OCCUPIER'S WIDER POSITION, TAKEN FOR THE OCCUPIER AND NOT FOR US. The corpus
    // pools named `occupierHoldings.*` are written from the OCCUPIED town's chair —
    // "{counterpart} holds more than it can garrison properly, and {settlement} is one of
    // the places where the thinness shows" — while `occupierHoldings()` is the reading for
    // the HOLDER's own dossier. Handing it our own holdings would print "the garrison at
    // <us> is stronger for the occupier's other successes" about the town that owns the
    // garrison: fluent, confident and false. So the reading is taken for the power holding
    // US. The occupier's ID comes off the ledger record because `settlementOccupation`
    // returns its NAME and not its id.
    const occupationRecord = worldState.occupations && typeof worldState.occupations === 'object'
      ? worldState.occupations[sid] : null;
    const occupierId = occupationRecord && occupationRecord.occupierId != null
      ? occupationRecord.occupierId : null;

    return {
      status,
      exhaustionRaw,
      exhaustionBand: warExhaustionBand(exhaustionRaw),
      mobilization: settlementMobilization({ settlementId: sid, worldState }), // covert excluded
      occupied: settlementOccupation({ settlementId: sid, worldState, nameFor }),
      holdings: occupierHoldings({ settlementId: sid, worldState, nameFor }),
      treaties: renderTreatiesForSettlement(worldState, sid),
      postureState: posture && typeof posture === 'object' ? String(posture.state || '') : '',
      counterpart: lone(status?.besiegedBy) || lone(status?.besiegingTargets),
      occupierPosition: occupierId != null
        ? occupierHoldings({ settlementId: occupierId, worldState, nameFor })
        : null,
      unit, musterLine, armyStatus, martial, wars, beliefs,
    };
  }, [sid, campaigns, nameFor, settlement, includeGroundTruth]);

  const hasWar = !!war && (
    war.status?.besiegedBy?.length > 0
    || war.status?.besiegingTargets?.length > 0
    || war.exhaustionRaw > 0
    || !!war.mobilization
    || !!war.occupied
    || !!war.holdings
  );
  const hasTreaties = !!war && war.treaties?.length > 0;
  const hasMuster = !!war && (war.musterLine || war.armyStatus || war.martial);
  // The town's own martial banners count as "anything" in or out of a campaign, so neither the
  // dormant note nor either fallback ("at peace", "no war picture to tell") can print beside one.
  const martialCrises = martialCrisisBanners(settlement);
  const anything = martialCrises.length > 0
    || (!!war && (hasWar || hasTreaties || hasMuster || war.unit || war.wars.length > 0 || war.beliefs.length > 0));

  // THE DESK, read ONCE per render through its single gated call site and routed by the
  // mount registry below. `warBeat` is this tab's own reading of "anything martial is
  // happening", which DS-WAR-1's residue pool and DS-WAR-3's dormant condition both need;
  // it is the martial half only, so the treaty half stays a separate term the way the
  // block's own condition spells it.
  const deskProse = warFaithDeskRungs({
    settlement,
    publicDossier,
    playerView,
    readings: war
      ? {
          settlementId: sid,
          // DS-WAR-3's FAITH half: the canonical reader's own ABSENCE answer, and the
          // only deity-adjacent value on this tab. The desk takes it as a reading because
          // a desk reads no settlement record of its own.
          hasPatron: !!faithPanelModel(settlement).hasEmbed,
          war: {
            status: war.status,
            exhaustionBand: war.exhaustionBand,
            mobilization: war.mobilization,
            postureState: war.postureState,
            occupation: war.occupied,
            occupierPosition: war.occupierPosition,
            treaties: war.treaties,
            counterpart: war.counterpart,
            warBeat: !!(hasWar || war.unit || war.wars.length > 0),
          },
        }
      : {},
  });

  return (
    <div data-testid="war-tab" style={{ padding: '12px 14px', fontFamily: sans }}>
      {!hasWar && martialCrises.length > 0 && <MartialCrisisBlock crises={martialCrises} />}
      {hasWar && <WarBlock war={war} nameFor={nameFor} />}
      {/* ── war.standing (DS-WAR-1) — the martial record in the town's own voice ── */}
      <WarStandingLines desk={deskProse} settlement={settlement} />
      {war && war.wars.length > 0 && <WarsBlock wars={war.wars} sid={sid} nameFor={nameFor} />}
      {hasMuster && <MusterBlock musterLine={war.musterLine} armyStatus={war.armyStatus} martial={war.martial} />}
      {war && war.unit && (
        <div data-testid="war-units" style={{ marginBottom: 14 }}>
          <Eyebrow>Units abroad, as this town believes</Eyebrow>
          <UnitEntry unit={war.unit} includeGroundTruth={includeGroundTruth} />
        </div>
      )}
      {war && war.beliefs.length > 0 && <BeliefsBlock beliefs={war.beliefs} />}
      {hasTreaties && <TreatyBlock treaties={war.treaties} sid={sid} />}
      {/* ── war.treaties (DS-WAR-2) — the clause that is under the most strain ── */}
      {hasTreaties && <WarTreatyLines desk={deskProse} settlement={settlement} />}
      {!anything && (
        // ── war.dormantNote (DS-WAR-3) — the WHOLE PAGE-SET at rest. The corpus line
        // REPLACES the plain sentence rather than standing under it: both say the town is
        // at peace, and printing them an inch apart is the page saying one thing twice.
        // The plain sentence stays the standing text for every reader the desk does not
        // draw for — a public dossier, or a town whose faith is not hidden.
        <WarDormantNote desk={deskProse} fallback={war
          ? 'This settlement is at peace: no host abroad, no siege at the walls, no treaty binding it.'
          : 'War is a campaign story. This settlement stands outside any live campaign, so there is no war picture to tell.'} />
      )}
    </div>
  );
}
