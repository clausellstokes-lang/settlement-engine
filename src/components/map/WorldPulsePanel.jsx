import { useMemo, useState } from 'react';
import { Activity, BookMarked, CheckCircle2, Clock3, PauseCircle, PlayCircle, XCircle } from 'lucide-react';

import { flag } from '../../lib/flags.js';
import { useStore } from '../../store/index.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, AMBER, AMBER_BG, AMBER_DEEP, DANGER_BORDER, FS, GOLD, GOLD_BG, INK, MUTED, RED, RED_BG, SECOND, SP, R, sans, serif_ } from '../theme.js';
import {
  ACTIVE_UI_STAGES,
  WAR_SHAPED_TYPES,
  attackerEntity,
  digestDetails,
  human,
  involvedEntities,
  nameMapFromSaves,
  outcomeDetails,
  percent,
  proposalDetails,
  rollIsDeterministic,
  stressorDetails,
  stressorSummary,
} from './WorldPulseData.js';
import { NameAttackerControl, OutcomeCard, Pill, Section, SmallButton } from './WorldPulsePrimitives.jsx';
import LiveWarStatus from './LiveWarStatus.jsx';

export default function WorldPulsePanel({ campaign, advancing = false }) {
  const applyProposal = useStore(s => s.applyWorldPulseProposal);
  const dismissProposal = useStore(s => s.dismissWorldPulseProposal);
  const canonizeCampaignWorld = useStore(s => s.canonizeCampaignWorld);
  const recordPartyImpact = useStore(s => s.recordPartyImpact);
  // Advance-scaling Stage 4: resume the paused interval with the DM's verdicts.
  const resolveIntervalMajors = useStore(s => s.resolveIntervalMajors);
  const [namingStressorId, setNamingStressorId] = useState(null);
  const [busyProposalId, setBusyProposalId] = useState(null);
  const [canonBusy, setCanonBusy] = useState(false);
  const [resumeBusy, setResumeBusy] = useState(false);
  // Per-major DM verdict ({ [id]: 'dismissed' }); absent ⇒ recommended on resume.
  const [majorDecisions, setMajorDecisions] = useState({});
  const [actionError, setActionError] = useState(null);
  const saves = useStore(s => s.savedSettlements);
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);
  if (!campaign) return null;

  // While the realm is advancing, the section it routes to (P10) shows a
  // simulation-stage skeleton instead of sitting on the PREVIOUS tick's numbers —
  // so progress reads in two channels (the toolbar label flip + this in-place
  // status) and the GM never mistakes stale results for the new ones.
  if (advancing) {
    return <AdvancingSkeleton />;
  }

  const worldState = campaign.worldState || {};
  const pending = (worldState.proposals || []).filter(proposal => proposal.status === 'pending');
  const pulseHistory = worldState.pulseHistory || [];
  const latestPulse = pulseHistory[pulseHistory.length - 1] || null;
  const rules = worldState.simulationRules || {};
  const rolls = latestPulse?.rollExplanations || [];
  const resolved = latestPulse?.resolvedStressors || [];
  const appliedOutcomes = latestPulse?.selectedOutcomes || [];
  const impactDigest = latestPulse?.impactDigest || [];
  const selected = latestPulse?.selectedCount || 0;
  const liveStressors = worldState.stressors || [];
  const activeStressors = liveStressors.filter(s => ACTIVE_UI_STAGES.has(s.lifecycleStage || 'active'));
  const echoes = liveStressors.filter(s => s.status === 'residual');

  const runProposalAction = async (proposalId, action) => {
    if (busyProposalId) return;
    setBusyProposalId(`${action}:${proposalId}`);
    setActionError(null);
    try {
      const fn = action === 'apply' ? applyProposal : dismissProposal;
      const updated = await fn(campaign.id, proposalId);
      if (!updated) setActionError('Proposal could not be updated.');
    } catch (err) {
      setActionError(`Proposal update failed: ${err?.message || err}`);
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
      setActionError(`Canonize failed: ${err?.message || err}`);
    } finally {
      setCanonBusy(false);
    }
  };

  // Advance-scaling Stage 4: the paused-advance cursor for this campaign, read off
  // worldState so it survives a reload. Flag-gated: the legacy single-tick advance
  // never parks a cursor, so this is always null with the flag off (no banner).
  const pausedAdvance = flag('advanceMultiTick') ? (worldState.pausedAdvance || null) : null;

  const toggleMajor = (id) => {
    setMajorDecisions(prev => {
      const next = { ...prev };
      if (next[id] === 'dismissed') delete next[id];
      else next[id] = 'dismissed';
      return next;
    });
  };

  // Continue the paused interval with the DM's verdicts. A major toggled off is
  // dismissed; every other batched major resolves to its recommended outcome. The
  // store re-derives the paused tick deterministically and continues the remaining
  // ticks (re-parking a fresh pause if the next tick surfaces majors).
  const runContinueAdvance = async () => {
    if (resumeBusy || !resolveIntervalMajors) return;
    setResumeBusy(true);
    setActionError(null);
    try {
      const decisions = {};
      for (const [id, verdict] of Object.entries(majorDecisions)) {
        decisions[id] = { decision: verdict };
      }
      await resolveIntervalMajors(campaign.id, decisions);
      setMajorDecisions({});
    } catch (err) {
      setActionError(`Could not continue advancing: ${err?.message || err}`);
    } finally {
      setResumeBusy(false);
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
        borderRadius: R.lg,
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
            borderRadius: R.lg,
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
            <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['22'], lineHeight: 1.14, fontWeight: 700 }}>
              World Pulse
            </h2>
            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 4, color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 700 }}>
              <span>{campaign.name}</span>
              <span>Draft world</span>
            </div>
          </div>
        </header>
        <div style={{ padding: SP.lg }}>
          {actionError && (
            <div style={{ border: `1px solid ${DANGER_BORDER}`, borderRadius: R.lg, padding: 10, marginBottom: 10, color: RED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, background: RED_BG }}>
              {actionError}
            </div>
          )}
          <OutcomeCard
            title="Canonize the campaign world first"
            summary="The realm advances only after you lock the map, the placements, and the campaign assumptions as canon."
            severity={0.45}
            details={['required before advancement']}
            actions={(
              <SmallButton tone="good" onClick={runCanonizeWorld} disabled={canonBusy} title="Canonize campaign world">
                <BookMarked size={13} /> {canonBusy ? 'Canonizing' : 'Canonize world'}
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
      borderRadius: 8,
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
          borderRadius: 8,
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
          <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS['22'], lineHeight: 1.14, fontWeight: 700 }}>
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

      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: SP.lg,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
        gap: SP.lg,
        alignItems: 'start',
      }}>
        {/* Advance-scaling Stage 4 PAUSED banner — an amber decision surface,
            visually distinct from the loading skeleton, presenting this pause's
            batched majors as Apply/Dismiss cards with a Continue CTA. Spans the
            full grid so it sits above the sections, not in a column. */}
        {pausedAdvance && (
          <div style={{ gridColumn: '1 / -1' }}>
            <PausedAdvanceBanner
              pausedAdvance={pausedAdvance}
              decisions={majorDecisions}
              onToggle={toggleMajor}
              onContinue={runContinueAdvance}
              busy={resumeBusy}
              nameById={nameById}
            />
          </div>
        )}

        {/* §S3 — LIVE war/trade/faith status from the post-pulse worldState +
            regional graph. Self-gates: a no-war campaign renders nothing. */}
        <LiveWarStatus campaign={campaign} nameById={nameById} />

        <Section title="Pending Proposals" count={pending.length}>
          {actionError && (
            <div style={{ border: `1px solid ${DANGER_BORDER}`, borderRadius: R.lg, padding: 10, marginBottom: 10, color: RED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, background: RED_BG }}>
              {actionError}
            </div>
          )}
          {pending.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.lg, padding: SP.lg, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
                  tone="major"
                  actions={(
                    <>
                      <SmallButton
                        tone="good"
                        onClick={() => runProposalAction(proposal.id, 'apply')}
                        title="Apply proposal"
                        disabled={!!busyProposalId}
                      >
                        <CheckCircle2 size={13} /> {busyProposalId === `apply:${proposal.id}` ? 'Applying' : 'Apply'}
                      </SmallButton>
                      <SmallButton
                        tone="danger"
                        onClick={() => runProposalAction(proposal.id, 'dismiss')}
                        title="Dismiss proposal"
                        disabled={!!busyProposalId}
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
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.lg, padding: SP.lg, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
                  if (!recordPartyImpact || namingStressorId) return;
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
                    setActionError(`Naming failed: ${err?.message || err}`);
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
                        busy={!!namingStressorId}
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
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.lg, padding: SP.lg, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Impact Digest" count={impactDigest.length}>
          {!latestPulse ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.lg, padding: SP.lg, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No pulse history yet.
            </div>
          ) : impactDigest.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.lg, padding: SP.lg, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
                  tone={entry.significance === 'major' ? 'major' : 'normal'}
                />
              ))}
            </div>
          )}
        </Section>

        <Section title="Roll Explanations" count={rolls.length}>
          {rolls.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.lg, padding: SP.lg, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
                    borderRadius: R.lg,
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

// Advance-scaling Stage 4: the PAUSED banner. An amber, steady (non-animated)
// decision surface — deliberately unlike the AdvancingSkeleton's pulsing spinner —
// so a paused interval reads as waiting BY DESIGN for the DM, not stuck loading.
// Presents the batched majors as Apply/Dismiss decision cards (reusing OutcomeCard)
// and a Continue CTA that names how many ticks remain.
//
// a11y: role=region + aria-label states "waiting for your decisions" so the wait is
// announced as intentional. Each major's verdict is a real toggle button carrying
// aria-pressed; the amber framing is never the only signal (the heading text +
// per-card "Will apply / Dismissed" label carry it too).
function PausedAdvanceBanner({ pausedAdvance, decisions, onToggle, onContinue, busy, nameById }) {
  const majors = Array.isArray(pausedAdvance?.pendingMajors) ? pausedAdvance.pendingMajors : [];
  const total = pausedAdvance?.ticksTotal || 0;
  const done = pausedAdvance?.ticksDone || 0;
  const remaining = Math.max(0, total - done);
  const interval = human(pausedAdvance?.interval || '');
  return (
    <section
      data-testid="advance-paused-banner"
      aria-label="Advance paused, waiting for your decisions on the major forks"
      style={{
        border: `1px solid ${AMBER}`,
        borderLeft: `4px solid ${AMBER}`,
        borderRadius: R.lg,
        background: AMBER_BG,
        padding: SP.lg,
        display: 'flex',
        flexDirection: 'column',
        gap: SP.md,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <PauseCircle size={20} color={AMBER_DEEP} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h3 style={{ margin: 0, color: AMBER_DEEP, fontFamily: serif_, fontSize: FS.lg, fontWeight: 800, lineHeight: 1.2 }}>
            Advance paused at a major fork
          </h3>
          <p style={{ margin: '4px 0 0', color: BODY, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
            {majors.length === 1 ? 'One change' : `${majors.length} changes`} could reshape the {interval || 'interval'}.
            Keep the ones you want, dismiss the rest, then continue. {remaining} of {total} steps remain.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {majors.map((major, i) => {
          const id = major.id || `major-${i}`;
          const dismissed = decisions[id] === 'dismissed';
          return (
            <div key={id} style={{ opacity: dismissed ? 0.6 : 1 }}>
              <OutcomeCard
                title={major.headline || human(major.candidateType)}
                summary={major.summary}
                severity={major.severity}
                reasons={major.reasons}
                involved={involvedEntities(major, nameById)}
                tone="major"
                actions={(
                  <SmallButton
                    tone={dismissed ? 'good' : 'danger'}
                    title={dismissed ? 'Keep this change' : 'Dismiss this change'}
                    onClick={() => onToggle(id)}
                    disabled={busy}
                  >
                    {dismissed
                      ? <><CheckCircle2 size={13} /> Keep</>
                      : <><XCircle size={13} /> Dismiss</>}
                  </SmallButton>
                )}
              />
              <div style={{ marginTop: 4, color: dismissed ? RED : AMBER_DEEP, fontFamily: sans, fontSize: FS.xxs, fontWeight: 800 }}>
                {dismissed ? 'Dismissed, will not apply' : 'Will apply on continue'}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SmallButton
          tone="good"
          title="Apply your decisions and continue advancing the realm"
          onClick={onContinue}
          disabled={busy}
        >
          <PlayCircle size={14} /> {busy ? 'Continuing' : `Continue advancing (${remaining} of ${total} remaining)`}
        </SmallButton>
      </div>
    </section>
  );
}

// While advanceCampaignWorld runs, the Pulse section shows this instead of the
// prior tick (P10). A pulsing spinner + a named stage line + ghost rows read as
// "the engine is computing depth", not a bare spinner, and self-clear when the
// real digest replaces them.
function AdvancingSkeleton() {
  return (
    <section data-testid="world-pulse-advancing" aria-busy="true" style={{ display: 'grid', gap: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>
        <Activity size={15} color={GOLD} className="sf-spin" aria-hidden />
        Advancing the realm…
      </div>
      <div style={{ color: SECOND, fontFamily: sans, fontSize: FS.xs, lineHeight: 1.5 }}>
        Simulating wars, faiths, trade, and migration for this tick.
      </div>
      <div style={{ display: 'grid', gap: SP.sm }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ height: 44, borderRadius: R.md, background: CARD_ALT, border: `1px solid ${BORDER2}`, opacity: 1 - i * 0.22 }} />
        ))}
      </div>
    </section>
  );
}
