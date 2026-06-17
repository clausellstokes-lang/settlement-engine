import { useMemo, useState } from 'react';
import { Activity, BookMarked, CheckCircle2, Clock3, XCircle } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, GOLD_BG, INK, MUTED, RED, SECOND, sans } from '../theme.js';
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

export default function WorldPulsePanel({ campaign }) {
  const applyProposal = useStore(s => s.applyWorldPulseProposal);
  const dismissProposal = useStore(s => s.dismissWorldPulseProposal);
  const canonizeCampaignWorld = useStore(s => s.canonizeCampaignWorld);
  const recordPartyImpact = useStore(s => s.recordPartyImpact);
  const [namingStressorId, setNamingStressorId] = useState(null);
  const [busyProposalId, setBusyProposalId] = useState(null);
  const [canonBusy, setCanonBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const saves = useStore(s => s.savedSettlements);
  const nameById = useMemo(() => nameMapFromSaves(saves), [saves]);
  if (!campaign) return null;

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

  if (!worldState.canonizedAt) {
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
            <div style={{ border: '1px solid rgba(197,74,74,0.45)', borderRadius: 8, padding: 10, marginBottom: 10, color: RED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, background: 'rgba(197,74,74,0.08)' }}>
              {actionError}
            </div>
          )}
          <OutcomeCard
            title="Canonize the campaign world first"
            summary="World Pulse advancement starts after you lock the map, placements, and campaign assumptions as canon."
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

      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        padding: 16,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 330px), 1fr))',
        gap: 16,
        alignItems: 'start',
      }}>
        <Section title="Pending Proposals" count={pending.length}>
          {actionError && (
            <div style={{ border: '1px solid rgba(197,74,74,0.45)', borderRadius: 8, padding: 10, marginBottom: 10, color: RED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, background: 'rgba(197,74,74,0.08)' }}>
              {actionError}
            </div>
          )}
          {pending.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No active stressors. The realm is quiet — for now.
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
                  title={`${stressor.label || human(stressor.type)} — in living memory`}
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
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
              No pulse history yet.
            </div>
          ) : impactDigest.length === 0 ? (
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
            <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 8, padding: 16, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
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
                    borderRadius: 8,
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
