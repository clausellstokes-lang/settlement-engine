import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, BookMarked, CheckCircle2, Clock3, XCircle } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GOLD_BG, INK, MUTED, SECOND, sans } from '../theme.js';
import { ClerkNote } from '../generate/ClerkNote.jsx';
import {
  ACTIVE_UI_STAGES,
  WAR_SHAPED_TYPES,
  attackerEntity,
  collectSettlementIds,
  digestDetails,
  human,
  involvedEntities,
  nameMapFromSaves,
  outcomeDetails,
  outcomeSubjectDescriptor,
  percent,
  proposalDetails,
  rollIsDeterministic,
  stressorDetails,
  stressorSummary,
} from './WorldPulseData.js';
import { NameAttackerControl, OutcomeCard, Pill, Section, SmallButton } from './WorldPulsePrimitives.jsx';
import WhileYouWereAway from './WhileYouWereAway.jsx';
import RealmDocket from './RealmDocket.jsx';
import RealmVerbComposer from './RealmVerbComposer.jsx';
import { politicalAutonomyOf } from '../../domain/worldPulse/simulationRules.js';
import { t } from '../../copy/index.js';

export default function WorldPulsePanel({ campaign, advancing = false }) {
  const applyProposal = useStore(s => s.applyWorldPulseProposal);
  const dismissProposal = useStore(s => s.dismissWorldPulseProposal);
  const canonizeCampaignWorld = useStore(s => s.canonizeCampaignWorld);
  const recordPartyImpact = useStore(s => s.recordPartyImpact);
  // experience-product-fit-1: the resume-with-verdicts action. The store action
  // already accepts a per-major `decisions` map (dismissed ⇒ excluded; unset ⇒
  // recommended); the pause surface below is what finally collects it.
  const resolveIntervalMajors = useStore(s => s.resolveIntervalMajors);
  const [namingStressorId, setNamingStressorId] = useState(null);
  const [busyProposalId, setBusyProposalId] = useState(null);
  const [canonBusy, setCanonBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  // The majors the DM has toggled to DISMISS on the paused fork (Set of ids).
  const [dismissedMajorIds, setDismissedMajorIds] = useState(() => new Set());
  const [resumeBusy, setResumeBusy] = useState(false);
  const campaignId = campaign?.id;
  const toggleDismissMajor = useCallback((id) => {
    setDismissedMajorIds(prev => {
      const next = new Set(prev);
      if (next.has(String(id))) next.delete(String(id)); else next.add(String(id));
      return next;
    });
  }, []);
  const submitVerdicts = useCallback(async () => {
    if (resumeBusy || !campaignId) return;
    setResumeBusy(true);
    setActionError(null);
    try {
      const decisions = {};
      for (const id of dismissedMajorIds) decisions[String(id)] = { decision: 'dismissed' };
      const result = await resolveIntervalMajors(campaignId, decisions);
      if (result && result.ok === false) {
        setActionError(t('errors.realmContinueFail'));
      } else {
        setDismissedMajorIds(new Set());
      }
    } catch (err) {
      setActionError(t('errors.resumeFail'));
    } finally {
      setResumeBusy(false);
    }
  }, [resumeBusy, campaignId, dismissedMajorIds, resolveIntervalMajors]);
  const saves = useStore(s => s.savedSettlements);
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);

  // H2 · THE FIRST ADVANCE — the almanac's new page turns in. On the session's
  // first committed advance, the pulse page pivots at its binding (oc-m-pageturn)
  // as it settles. Detection is read-side off the existing advance counter
  // (worldState.pulseHistory grows by one per advance), baselined at mount; the
  // panel mounts before the advance commits (openInspectorAt('pulse') runs ahead
  // of the commit), so the first increase is the DM's first advance. Component-
  // local refs keep it once — NO new store field, NO persisted state; reduced-
  // motion collapses the turn to instant via the global [class*='oc-m-'] rule.
  const almanacPulseLen = campaign?.worldState?.pulseHistory?.length || 0;
  const almanacBaselineRef = useRef(null);
  const almanacTurnedRef = useRef(false);
  const [almanacTurn, setAlmanacTurn] = useState(false);
  useEffect(() => {
    if (almanacBaselineRef.current == null) { almanacBaselineRef.current = almanacPulseLen; return undefined; }
    if (almanacTurnedRef.current) { almanacBaselineRef.current = almanacPulseLen; return undefined; }
    if (almanacPulseLen <= almanacBaselineRef.current) return undefined;
    almanacTurnedRef.current = true;
    almanacBaselineRef.current = almanacPulseLen;
    setAlmanacTurn(true);
    const timer = setTimeout(() => setAlmanacTurn(false), 900);
    return () => clearTimeout(timer);
  }, [almanacPulseLen]);

  // M10b catch-up now fires from campaign ACTIVATION (setActiveCampaign — the
  // §0.6.1-named site), not from this panel's mount, so the world moves on every
  // open path rather than only when the Pulse tab happens to render
  // (experience-product-fit-1). The result is surfaced by the "while you were away"
  // digest (WhileYouWereAway, fed by the transient livingCatchUp store field).

  if (!campaign) return null;

  const worldState = campaign.worldState || {};
  // worldpulse-core-1: a campaign PAUSED mid-interval for DM verdicts is not idle —
  // resolveIntervalMajors re-derives the paused segment from the cursor's pre-tick
  // snapshot and wholesale-commits it, so any Apply/Dismiss/party-impact made during
  // the parked window is silently discarded on resume. The store mutators now no-op
  // while paused; gate the affordances here too so the buttons don't invite a write
  // that vanishes. The DM resolves/undoes the pause (elsewhere) before acting.
  const paused = !!worldState.pausedAdvance;
  // experience-product-fit-1: the batched majors the paused advance is waiting on.
  const pendingMajors = paused ? (worldState.pausedAdvance?.pendingMajors || []) : [];
  const pending = (worldState.proposals || []).filter(proposal => proposal.status === 'pending');
  const pulseHistory = worldState.pulseHistory || [];
  const latestPulse = pulseHistory[pulseHistory.length - 1] || null;
  const rules = worldState.simulationRules || {};
  // M10a (CL-3) — the RATIONALE surface. The realm's approval custom frames the
  // pending queue: recommendations proposes WITH its reasoning, dm_only asks about
  // everything, and routine-with-major-approval routes the actor-initiated majors
  // (a war declaration, a coup) here. Each card already renders the candidate's
  // reasons[] as its rationale; this note names WHY the turn is waiting on the DM.
  const autonomy = politicalAutonomyOf(rules);
  const routineMajorApproval = autonomy === 'routine' && rules.routineMajorApproval === true;
  const proposalNote = autonomy === 'recommendations'
    ? 'The realm recommends these turns and shows its reasoning with each. Apply or dismiss.'
    : autonomy === 'dm_only'
      ? 'Every major turn awaits your word. Each carries the reasoning behind it.'
      : routineMajorApproval
        ? 'Routine life runs itself; the campaign-altering turns (a war declaration, a coup) wait here for your word. They stand down on their own if left unanswered.'
        : null;
  const rolls = latestPulse?.rollExplanations || [];
  const resolved = latestPulse?.resolvedStressors || [];
  const appliedOutcomes = latestPulse?.selectedOutcomes || [];
  const impactDigest = latestPulse?.impactDigest || [];
  const selected = latestPulse?.selectedCount || 0;
  const liveStressors = worldState.stressors || [];
  const activeStressors = liveStressors.filter(s => ACTIVE_UI_STAGES.has(s.lifecycleStage || 'active'));
  const echoes = liveStressors.filter(s => s.status === 'residual');

  const runProposalAction = async (proposalId, action) => {
    if (busyProposalId || paused) return;
    setBusyProposalId(`${action}:${proposalId}`);
    setActionError(null);
    try {
      const fn = action === 'apply' ? applyProposal : dismissProposal;
      const updated = await fn(campaign.id, proposalId);
      if (!updated) setActionError(t('errors.proposalUpdateFail'));
    } catch (err) {
      setActionError(t('errors.proposalUpdateFail'));
    } finally {
      setBusyProposalId(null);
    }
  };

  const runCanonizeWorld = async () => {
    if (canonBusy) return;
    setCanonBusy(true);
    setActionError(null);
    try {
      await canonizeCampaignWorld(campaign.id);
    } catch (err) {
      setActionError(t('errors.worldClockStartFail'));
    } finally {
      setCanonBusy(false);
    }
  };

  if (!worldState.canonizedAt) {
    return (
      <section style={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        background: CARD,
        border: `1px solid ${BORDER}`,
        overflow: 'hidden',
      }}>
        <header style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '13px 16px',
          borderBottom: `1px solid ${BORDER}`,
          background: CARD_ALT,
        }}>
          <div style={{
            width: 34,
            height: 34,
            border: `1px solid ${BORDER2}`,
            background: CARD,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Activity size={18} color={GOLD} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.2, fontWeight: 900 }}>
              World Pulse
            </h2>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 4, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
              <span>{campaign.name}</span>
              <span>Draft world</span>
            </div>
          </div>
        </header>
        <div style={{ padding: 16 }}>
          {actionError && (
            <ClerkNote rubric="The realm balked" role="alert" style={{ marginBottom: 10 }}>
              {actionError}
            </ClerkNote>
          )}
          <OutcomeCard
            title="Start the campaign's World Clock first"
            summary="World Pulse advancement starts after you lock the map, placements, and campaign assumptions and start the world clock."
            severity={0.45}
            details={['required before advancement']}
            actions={(
              <SmallButton tone="good" onClick={runCanonizeWorld} disabled={canonBusy} title="Start the campaign's world clock">
                <BookMarked size={13} /> {canonBusy ? 'Starting…' : t('canon.startWorldClock')}
              </SmallButton>
            )}
          />
        </div>
      </section>
    );
  }

  return (
    <section style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      background: CARD,
      border: `1px solid ${BORDER}`,
      overflow: 'hidden',
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '13px 16px',
        borderBottom: `1px solid ${BORDER}`,
        background: CARD_ALT,
      }}>
        <div style={{
          width: 34,
          height: 34,
          border: `1px solid ${BORDER2}`,
          background: CARD,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Activity size={18} color={GOLD} />
        </div>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.lg, lineHeight: 1.2, fontWeight: 900 }}>
            World Pulse
          </h2>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 4, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
            <span>{campaign.name}</span>
            <span>Tick {worldState.tick || 0}</span>
            <span>{human(worldState.calendar?.season || 'spring')}</span>
            <span>{human(rules.propagationMode || 'full')}</span>
            <span>{human(rules.intensity || 'normal')}</span>
            <span>{pending.length} pending</span>
          </div>
        </div>
      </header>

      {advancing && (
        <div role="status" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 16px', borderBottom: `1px solid ${BORDER}`,
          background: GOLD_BG, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 800,
        }}>
          <Activity size={14} color={GOLD} />
          Advancing the realm… the pulse below updates when it settles.
        </div>
      )}

      <div
        className={almanacTurn ? 'oc-m-pageturn' : undefined}
        style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
        gap: 16,
        alignItems: 'start',
      }}>
        {/* components-dossier-4: the "while you were away" catch-up digest, spanning
            the full width above the pulse sections. Self-gates to nothing. */}
        <div style={{ gridColumn: '1 / -1' }}>
          <WhileYouWereAway campaignId={campaign.id} />
        </div>
        {/* W-COMPOSER-2 §10: THE DOCKET — the realm's staged future (queued
            member orders in drain order) + THE FORECAST attached to it. */}
        <div style={{ gridColumn: '1 / -1' }}>
          <RealmDocket campaign={campaign} />
        </div>
        {/* W-COMPOSER-2 §6: REALM ORDERS — the forcing surface over the realm
            affordance manifest (force-as-proposal; approval applies above). */}
        <div style={{ gridColumn: '1 / -1' }}>
          <RealmVerbComposer campaign={campaign} />
        </div>
        <Section title="Pending Proposals" count={pending.length}>
          {actionError && (
            <ClerkNote rubric="The realm balked" role="alert" style={{ marginBottom: 10 }}>
              {actionError}
            </ClerkNote>
          )}
          {paused && (
            <div data-testid="paused-verdict-surface" style={{ border: `1px solid ${GOLD}`, padding: 12, marginBottom: 10, background: GOLD_BG, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, lineHeight: 1.5 }}>
                The advance paused for your word. {pendingMajors.length > 0
                  ? `${pendingMajors.length} major turn${pendingMajors.length === 1 ? '' : 's'} await your verdict. Keep each (it applies as recommended) or dismiss it, then resume the interval.`
                  : 'Resume or undo the advance to continue. Applying, dismissing, or naming here would be undone on resume.'}
              </div>
              {pendingMajors.map((major) => {
                const id = String(major?.id ?? '');
                const dismissed = dismissedMajorIds.has(id);
                return (
                  <OutcomeCard
                    key={id}
                    title={major.headline || major.outcome?.headline || 'A major turn awaits your word'}
                    summary={major.summary || major.outcome?.summary || ''}
                    severity={typeof major.severity === 'number' ? major.severity : 0.8}
                    reasons={major.reasons || major.outcome?.reasons || []}
                    details={proposalDetails(major.outcome || major)}
                    involved={involvedEntities(major, nameById)}
                    subject={outcomeSubjectDescriptor(major)}
                    affectedIds={collectSettlementIds(major)}
                    tone={dismissed ? 'normal' : 'major'}
                    actions={(
                      <SmallButton
                        tone={dismissed ? 'danger' : 'good'}
                        onClick={() => toggleDismissMajor(id)}
                        disabled={resumeBusy}
                      >
                        {dismissed ? <><XCircle size={13} /> Dismissed</> : <><CheckCircle2 size={13} /> Keep</>}
                      </SmallButton>
                    )}
                  />
                );
              })}
              <SmallButton
                tone="good"
                onClick={submitVerdicts}
                disabled={resumeBusy}
              >
                <Clock3 size={13} /> {resumeBusy
                  ? 'Resuming'
                  : dismissedMajorIds.size > 0
                    ? `Resume with your verdicts (${dismissedMajorIds.size} dismissed)`
                    : 'Resume with recommendations'}
              </SmallButton>
            </div>
          )}
          {pending.length > 0 && proposalNote && (
            <ClerkNote rubric="The realm's counsel" style={{ marginBottom: 10 }}>
              {proposalNote}
            </ClerkNote>
          )}
          {pending.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No pending proposals.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pending.map(proposal => (
                <OutcomeCard
                  key={proposal.id}
                  title={proposal.headline}
                  summary={proposal.summary}
                  severity={proposal.severity}
                  reasons={proposal.reasons}
                  details={proposalDetails(proposal.outcome)}
                  involved={involvedEntities(proposal, nameById)}
                  subject={outcomeSubjectDescriptor(proposal)}
                  affectedIds={collectSettlementIds(proposal)}
                  tone="major"
                  actions={(
                    <>
                      <SmallButton
                        tone="good"
                        onClick={() => runProposalAction(proposal.id, 'apply')}
                        title={paused ? 'The realm is mid-advance. Resume or undo first' : 'Apply proposal'}
                        disabled={!!busyProposalId || paused}
                      >
                        <CheckCircle2 size={13} /> {busyProposalId === `apply:${proposal.id}` ? 'Applying' : 'Apply'}
                      </SmallButton>
                      <SmallButton
                        tone="danger"
                        onClick={() => runProposalAction(proposal.id, 'dismiss')}
                        title={paused ? 'The realm is mid-advance. Resume or undo first' : 'Dismiss proposal'}
                        disabled={!!busyProposalId || paused}
                      >
                        <XCircle size={13} /> {busyProposalId === `dismiss:${proposal.id}` ? 'Dismissing' : 'Dismiss'}
                      </SmallButton>
                    </>
                  )}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Active Stressors & Echoes" count={activeStressors.length + echoes.length}>
          {activeStressors.length + echoes.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No active stressors. The realm is quiet, for now.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeStressors.map(stressor => {
                const attacker = attackerEntity(stressor, nameById);
                const unnamed = WAR_SHAPED_TYPES.has(stressor.type)
                  && !stressor.originContext?.attackerLabel
                  && !stressor.originContext?.attackerSettlementId;
                const nameThisAttacker = async (label) => {
                  if (!recordPartyImpact || namingStressorId || paused) return;
                  setNamingStressorId(stressor.id);
                  setActionError(null);
                  try {
                    await recordPartyImpact(campaign.id, {
                      kind: 'name_attacker',
                      stressorId: stressor.id,
                      attackerLabel: label,
                      label: `Named the force behind ${stressor.label || human(stressor.type)}`,
                    });
                  } catch (err) {
                    setActionError(t('errors.namingFail'));
                  } finally {
                    setNamingStressorId(null);
                  }
                };
                return (
                  <OutcomeCard
                    key={stressor.id}
                    title={stressor.label || human(stressor.type)}
                    summary={stressorSummary(stressor)}
                    severity={stressor.severity}
                    details={stressorDetails(stressor)}
                    involved={[
                      ...involvedEntities(stressor, nameById),
                      ...(attacker ? [attacker] : []),
                    ]}
                    tone={stressor.severity >= 0.72 ? 'major' : 'normal'}
                    actions={unnamed && recordPartyImpact ? (
                      <NameAttackerControl
                        stressor={stressor}
                        busy={!!namingStressorId || paused}
                        onName={nameThisAttacker}
                      />
                    ) : null}
                  />
                );
              })}
              {echoes.map(stressor => (
                <OutcomeCard
                  key={`echo-${stressor.id}`}
                  title={`${stressor.label || human(stressor.type)}, in living memory`}
                  summary="Resolved, not forgotten: this echo still colors new events and can re-ignite while warm."
                  severity={stressor.memoryStrength ?? 0}
                  details={[`memory ${percent(stressor.memoryStrength ?? 0)}`, 'fading', human(stressor.type)]}
                  involved={involvedEntities(stressor, nameById)}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Latest Pulse" count={latestPulse ? selected : 0}>
          {!latestPulse ? (
            <div style={{ border: `1px dashed ${BORDER}`, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No pulse history yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <OutcomeCard
                title={`Tick ${latestPulse.tick} advanced`}
                summary={`${latestPulse.autoAppliedCount || 0} drift item(s), ${latestPulse.proposalCount || 0} proposal(s), ${latestPulse.candidateCount || 0} candidate(s).`}
                severity={Math.min(1, selected / 8)}
                reasons={[latestPulse.interval, latestPulse.calendar?.season, `${rolls.length} rolls`].filter(Boolean)}
              />
              {appliedOutcomes.slice(0, 10).map(outcome => (
                <OutcomeCard
                  key={outcome.id}
                  title={outcome.headline || human(outcome.candidateType)}
                  summary={outcome.summary}
                  severity={outcome.severity}
                  reasons={outcome.reasons}
                  details={outcomeDetails(outcome, nameById)}
                  involved={involvedEntities(outcome, nameById)}
                  subject={outcomeSubjectDescriptor(outcome)}
                  affectedIds={collectSettlementIds(outcome)}
                  tone={outcome.applyMode === 'proposal' ? 'major' : 'normal'}
                />
              ))}
              {resolved.map(stressor => (
                <OutcomeCard
                  key={stressor.id}
                  title={`${stressor.label} resolved`}
                  summary={`Resolution roll ${percent(stressor.resolutionRoll)} against ${percent(stressor.resolutionChance)} chance.`}
                  severity={stressor.resolutionChance}
                  reasons={['time bounded stressor', human(stressor.type)]}
                  involved={involvedEntities(stressor, nameById)}
                  affectedIds={collectSettlementIds(stressor)}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Impact Digest" count={impactDigest.length}>
          {!latestPulse ? (
            <div style={{ border: `1px dashed ${BORDER}`, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No pulse history yet.
            </div>
          ) : impactDigest.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No regional impacts recorded for this pulse.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {impactDigest.slice(0, 12).map(entry => (
                <OutcomeCard
                  key={entry.id}
                  title={entry.headline}
                  summary={entry.summary}
                  severity={entry.severity ?? Math.min(1, (entry.score || 0) / 100)}
                  reasons={entry.reasons}
                  details={digestDetails(entry, nameById)}
                  involved={involvedEntities(entry, nameById)}
                  subject={outcomeSubjectDescriptor(entry)}
                  affectedIds={collectSettlementIds(entry)}
                  tone={entry.significance === 'major' ? 'major' : 'normal'}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Roll Explanations" count={rolls.length}>
          {rolls.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No rolls recorded.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rolls.slice(0, 18).map(roll => {
                const passed = !!roll.passed;
                const deterministic = rollIsDeterministic(roll);
                return (
                  <article key={roll.candidateId} style={{
                    display: 'grid',
                    gridTemplateColumns: '24px minmax(0, 1fr)',
                    gap: 8,
                    padding: 10,
                    border: `1px solid ${passed ? GOLD : BORDER}`,
                    background: passed ? GOLD_BG : CARD,
                  }}>
                    <Clock3 size={15} color={passed ? GOLD : MUTED} style={{ marginTop: 2 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, overflowWrap: 'anywhere' }}>
                        {human(roll.candidateType)}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                        <Pill tone={passed ? 'major' : 'neutral'}>{deterministic ? 'deterministic' : passed ? 'selected' : 'missed'}</Pill>
                        {!deterministic && <Pill>Roll {percent(roll.roll)}</Pill>}
                        <Pill>Chance {percent(roll.probability)}</Pill>
                        <Pill>Severity {percent(roll.severity)}</Pill>
                        {roll.ruleFamily && <Pill>{human(roll.ruleFamily)}</Pill>}
                        {roll.proposalPayload?.kind && <Pill>{human(roll.proposalPayload.kind)}</Pill>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </Section>
      </div>
    </section>
  );
}
