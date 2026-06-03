import { useState } from 'react';
import { Activity, CheckCircle2, Clock3, ShieldAlert, XCircle } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { BORDER, BORDER2, BODY, CARD, CARD_ALT, FS, GOLD, GOLD_BG, GREEN, INK, MUTED, RED, SECOND, sans, swatch } from '../theme.js';

function percent(value) {
  return `${Math.round((Number.isFinite(value) ? value : 0) * 100)}%`;
}

function human(value) {
  return String(value || '').replace(/_/g, ' ');
}

function Pill({ children, tone = 'neutral' }) {
  const bg = tone === 'major' ? GOLD_BG : tone === 'good' ? swatch.successBg : CARD_ALT;
  const color = tone === 'major' ? GOLD : tone === 'good' ? GREEN : SECOND;
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 22,
      padding: '2px 7px',
      border: `1px solid ${BORDER2}`,
      borderRadius: 6,
      background: bg,
      color,
      fontFamily: sans,
      fontSize: FS.xxs,
      fontWeight: 800,
      whiteSpace: 'nowrap',
      textTransform: 'capitalize',
    }}>
      {children}
    </span>
  );
}

function proposalDetails(outcome = {}) {
  const payload = outcome.proposalPayload || {};
  if (payload.kind === 'relationship_label_change') {
    return [`${human(payload.fromType)} -> ${human(payload.toType)}`, human(outcome.ruleId || outcome.ruleFamily)];
  }
  if (payload.kind === 'npc_action') {
    return [
      human(payload.actionFamily),
      payload.dotRankBefore && payload.dotRankAfter ? `${payload.dotRankBefore} dot -> ${payload.dotRankAfter} dot` : human(payload.roleArchetype),
    ].filter(Boolean);
  }
  if (payload.kind === 'government_change') {
    return [human(payload.governmentPreference), human(payload.legitimacyBand), 'preserve institutions'];
  }
  if (payload.kind === 'institution_suppression' || payload.kind === 'institution_capture') {
    return [human(payload.kind), payload.institutionName].filter(Boolean);
  }
  if (payload.kind === 'faction_power_shift') {
    return [human(payload.kind), human(payload.cause)].filter(Boolean);
  }
  return [human(outcome.ruleFamily), human(outcome.ruleId)].filter(Boolean).slice(0, 2);
}

function OutcomeCard({ title, summary, severity, reasons = [], actions = null, tone = 'normal', details = [] }) {
  const major = tone === 'major' || severity >= 0.7;
  return (
    <article style={{
      border: `1px solid ${major ? GOLD : BORDER}`,
      borderRadius: 8,
      background: major ? GOLD_BG : CARD,
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <ShieldAlert size={16} color={major ? GOLD : SECOND} style={{ marginTop: 1, flexShrink: 0 }} />
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{
            margin: 0,
            color: INK,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 900,
            lineHeight: 1.25,
            overflowWrap: 'anywhere',
          }}>
            {title}
          </h4>
          {summary && (
            <p style={{
              margin: '5px 0 0',
              color: BODY,
              fontFamily: sans,
              fontSize: FS.xs,
              lineHeight: 1.45,
              overflowWrap: 'anywhere',
            }}>
              {summary}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        <Pill tone={major ? 'major' : 'neutral'}>Severity {percent(severity)}</Pill>
        {details.slice(0, 3).map(detail => <Pill key={detail}>{detail}</Pill>)}
        {reasons.slice(0, 3).map(reason => <Pill key={reason}>{reason}</Pill>)}
      </div>
      {actions && (
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 2 }}>
          {actions}
        </div>
      )}
    </article>
  );
}

function SmallButton({ children, onClick, tone = 'neutral', title, disabled = false }) {
  const primary = tone === 'good';
  const danger = tone === 'danger';
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        minHeight: 30,
        padding: '5px 9px',
        border: `1px solid ${primary ? GREEN : danger ? RED : BORDER2}`,
        borderRadius: 6,
        background: primary ? swatch.successBg : danger ? 'rgba(197,74,74,0.08)' : CARD,
        color: primary ? GREEN : danger ? RED : SECOND,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 900,
        opacity: disabled ? 0.62 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </button>
  );
}

function Section({ title, count, children }) {
  return (
    <section style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <h3 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 900 }}>
          {title}
        </h3>
        <span style={{ marginLeft: 'auto', color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 800 }}>
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

export default function WorldPulsePanel({ campaign }) {
  const applyProposal = useStore(s => s.applyWorldPulseProposal);
  const dismissProposal = useStore(s => s.dismissWorldPulseProposal);
  const [busyProposalId, setBusyProposalId] = useState(null);
  const [actionError, setActionError] = useState(null);
  if (!campaign) return null;

  const worldState = campaign.worldState || {};
  const pending = (worldState.proposals || []).filter(proposal => proposal.status === 'pending');
  const latestPulse = (worldState.pulseHistory || [])[worldState.pulseHistory.length - 1] || null;
  const rolls = latestPulse?.rollExplanations || [];
  const resolved = latestPulse?.resolvedStressors || [];
  const selected = latestPulse?.selectedCount || 0;

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
              {resolved.map(stressor => (
                <OutcomeCard
                  key={stressor.id}
                  title={`${stressor.label} resolved`}
                  summary={`Resolution roll ${percent(stressor.resolutionRoll)} against ${percent(stressor.resolutionChance)} chance.`}
                  severity={stressor.resolutionChance}
                  reasons={['time bounded stressor', human(stressor.type)]}
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
                        <Pill tone={passed ? 'major' : 'neutral'}>{passed ? 'selected' : 'missed'}</Pill>
                        <Pill>Roll {percent(roll.roll)}</Pill>
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
