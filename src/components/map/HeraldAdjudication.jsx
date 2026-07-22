// HeraldAdjudication.jsx — THE DECISIONS DESK (Herald section: adjudication).
//
// The one door that can DEMAND action: the DM's pending decisions and the realm's
// forcing surface, re-homed out of the old Pulse panel so the reportage doors stay
// pure news. It carries exactly the functional controls the newspaper frame must
// not lose: the world-clock gate, the pending proposals (apply / dismiss), the
// paused-interval verdict surface (resume with keep/dismiss), and the realm-verb
// composer (issue an order). Every store action is reused verbatim — NO new store
// action is introduced (the recorded-store-action law).
//
// The resolved LOG (manual + autoresolve results) is the Phase-5 deepening; this
// phase lands the PENDING half + the operational controls so nothing regresses.

import { useCallback, useState } from 'react';
import { BookMarked, CheckCircle2, Clock3, XCircle } from 'lucide-react';

import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import { BODY, BORDER, BORDER2, CARD, CARD_ALT, FS, GOLD, INK, MUTED, SECOND, sans } from '../theme.js';
import { ClerkNote } from '../generate/ClerkNote.jsx';
import { OutcomeCard, Section, SmallButton } from './WorldPulsePrimitives.jsx';
import RealmVerbComposer from './RealmVerbComposer.jsx';
import {
  collectSettlementIds,
  human,
  involvedEntities,
  nameMapFromSaves,
  outcomeSubjectDescriptor,
  proposalDetails,
} from './WorldPulseData.js';
import { politicalAutonomyOf } from '../../domain/worldPulse/simulationRules.js';

// Cluster pending proposals by the settlement they touch (collectSettlementIds[0]),
// realm-wide (no settlement) last — the uncapped wall becomes navigable at scale.
function groupProposalsBySettlement(proposals = [], nameById = new Map()) {
  const bySettlement = new Map();
  const realmWide = [];
  for (const p of proposals) {
    const sid = collectSettlementIds(p)[0];
    if (sid == null) { realmWide.push(p); continue; }
    const key = String(sid);
    const list = bySettlement.get(key) || [];
    list.push(p);
    bySettlement.set(key, list);
  }
  const groups = [];
  for (const [key, items] of bySettlement) groups.push({ key, name: nameById.get(key) || key, items });
  if (realmWide.length) groups.push({ key: '__realm__', name: 'Across the realm', items: realmWide });
  return groups;
}

export default function HeraldAdjudication({ campaign, focusId = null, focusName = '' }) {
  const applyProposal = useStore(s => s.applyWorldPulseProposal);
  const dismissProposal = useStore(s => s.dismissWorldPulseProposal);
  const canonizeCampaignWorld = useStore(s => s.canonizeCampaignWorld);
  const resolveIntervalMajors = useStore(s => s.resolveIntervalMajors);
  const saves = useStore(s => s.savedSettlements);
  const nameById = nameMapFromSaves(saves);

  const [busyProposalId, setBusyProposalId] = useState(null);
  const [canonBusy, setCanonBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [dismissedMajorIds, setDismissedMajorIds] = useState(() => new Set());
  const [resumeBusy, setResumeBusy] = useState(false);

  const toggleDismissMajor = useCallback((id) => {
    setDismissedMajorIds(prev => {
      const next = new Set(prev);
      if (next.has(String(id))) next.delete(String(id)); else next.add(String(id));
      return next;
    });
  }, []);

  if (!campaign) return null;
  const worldState = campaign.worldState || {};
  const paused = !!worldState.pausedAdvance;
  const pendingMajors = paused ? (worldState.pausedAdvance?.pendingMajors || []) : [];
  const allPending = (worldState.proposals || []).filter(p => p.status === 'pending');
  // FOCUS scopes the decisions desk too (the whole paper is the local edition): a
  // proposal touching the focused settlement stays. Then the uncapped wall becomes
  // collapsible group-by-settlement sections.
  const pending = focusId != null
    ? allPending.filter(p => collectSettlementIds(p).map(String).includes(String(focusId)))
    : allPending;
  const pendingGroups = groupProposalsBySettlement(pending, nameById);

  // THE RESOLVED LOG (styled apart from the pending desk): manual decisions (the
  // proposals you applied/dismissed) + autoresolve results (the latest pulse's
  // auto-applied significant turns). Focus-scoped, capped, most-recent first.
  const latestPulse = (worldState.pulseHistory || [])[(worldState.pulseHistory || []).length - 1] || null;
  const touchesFocus = (record) => focusId == null || collectSettlementIds(record).map(String).includes(String(focusId));
  const resolvedLog = [
    ...(worldState.proposals || [])
      .filter(p => (p.status === 'applied' || p.status === 'dismissed') && touchesFocus(p))
      .map(p => ({ id: `prop-${p.id}`, headline: p.headline || 'A decision', by: `${p.status} by you`, tick: p.tick })),
    ...((latestPulse?.selectedOutcomes || [])
      .filter(o => o.applyMode !== 'proposal' && (o.significance === 'major' || (o.severity ?? 0) >= 0.72) && touchesFocus(o))
      .map(o => ({ id: `auto-${o.id}`, headline: o.headline || human(o.candidateType) || 'A turn', by: 'by autoresolve', tick: latestPulse?.tick }))),
  ].slice(0, 15);
  const rules = worldState.simulationRules || {};
  const autonomy = politicalAutonomyOf(rules);
  const routineMajorApproval = autonomy === 'routine' && rules.routineMajorApproval === true;
  const proposalNote = autonomy === 'recommendations'
    ? 'The realm recommends these turns and shows its reasoning with each. Apply or dismiss.'
    : autonomy === 'dm_only'
      ? 'Every major turn awaits your word. Each carries the reasoning behind it.'
      : routineMajorApproval
        ? 'Routine life runs itself; the campaign-altering turns wait here for your word. They stand down on their own if left unanswered.'
        : null;

  const runProposalAction = async (proposalId, action) => {
    if (busyProposalId || paused) return;
    setBusyProposalId(`${action}:${proposalId}`);
    setActionError(null);
    try {
      const fn = action === 'apply' ? applyProposal : dismissProposal;
      const updated = await fn(campaign.id, proposalId);
      if (!updated) setActionError(t('errors.proposalUpdateFail'));
    } catch {
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
    } catch {
      setActionError(t('errors.worldClockStartFail'));
    } finally {
      setCanonBusy(false);
    }
  };

  const submitVerdicts = async () => {
    if (resumeBusy || !campaign.id) return;
    setResumeBusy(true);
    setActionError(null);
    try {
      const decisions = {};
      for (const id of dismissedMajorIds) decisions[String(id)] = { decision: 'dismissed' };
      const result = await resolveIntervalMajors(campaign.id, decisions);
      if (result && result.ok === false) setActionError(t('errors.realmContinueFail'));
      else setDismissedMajorIds(new Set());
    } catch {
      setActionError(t('errors.resumeFail'));
    } finally {
      setResumeBusy(false);
    }
  };

  // The world-clock gate: before canonization there is nothing to adjudicate.
  if (!worldState.canonizedAt) {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {actionError && <ClerkNote rubric="The realm balked" role="alert">{actionError}</ClerkNote>}
        <OutcomeCard
          title="Start the campaign's World Clock first"
          summary="Decisions and orders open once you lock the map, placements, and assumptions and start the world clock."
          severity={0.45}
          details={['required before advancement']}
          actions={(
            <SmallButton tone="good" onClick={runCanonizeWorld} disabled={canonBusy} title="Start the campaign's world clock">
              <BookMarked size={13} /> {canonBusy ? 'Starting…' : t('canon.startWorldClock')}
            </SmallButton>
          )}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {actionError && <ClerkNote rubric="The realm balked" role="alert">{actionError}</ClerkNote>}

      {paused && (
        <div data-testid="paused-verdict-surface" style={{ border: `1px solid ${GOLD}`, borderLeft: `3px solid ${GOLD}`, padding: 12, background: CARD_ALT, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, lineHeight: 1.5 }}>
            The advance paused for your word. {pendingMajors.length > 0
              ? `${pendingMajors.length} major turn${pendingMajors.length === 1 ? '' : 's'} await your verdict. Keep each (it applies as recommended) or dismiss it, then resume the interval.`
              : 'Resume or undo the advance to continue.'}
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
                  <SmallButton tone={dismissed ? 'danger' : 'good'} onClick={() => toggleDismissMajor(id)} disabled={resumeBusy}>
                    {dismissed ? <><XCircle size={13} /> Dismissed</> : <><CheckCircle2 size={13} /> Keep</>}
                  </SmallButton>
                )}
              />
            );
          })}
          <SmallButton tone="good" onClick={submitVerdicts} disabled={resumeBusy}>
            <Clock3 size={13} /> {resumeBusy ? 'Resuming'
              : dismissedMajorIds.size > 0 ? `Resume with your verdicts (${dismissedMajorIds.size} dismissed)`
                : 'Resume with recommendations'}
          </SmallButton>
        </div>
      )}

      <Section title="Pending Decisions" count={pending.length}>
        {pending.length > 0 && proposalNote && <ClerkNote rubric="The realm's counsel">{proposalNote}</ClerkNote>}
        {pending.length === 0 ? (
          <div style={{ border: `1px dashed ${BORDER}`, padding: 14, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
            {focusId != null ? `No decision awaits at ${focusName}.` : 'No decision awaits you. The realm runs on its own for now.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingGroups.map(group => (
              <details key={group.key} open data-testid="adjudication-group" style={{ border: `1px solid ${BORDER}`, background: CARD_ALT }}>
                <summary style={{ cursor: 'pointer', padding: '6px 10px', color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {group.name}
                  <span style={{ marginLeft: 'auto', color: MUTED, fontWeight: 800 }}>{group.items.length}</span>
                </summary>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 8 }}>
                  {group.items.map(proposal => (
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
                          <SmallButton tone="good" onClick={() => runProposalAction(proposal.id, 'apply')} title={paused ? 'The realm is mid-advance. Resume or undo first' : 'Apply proposal'} disabled={!!busyProposalId || paused}>
                            <CheckCircle2 size={13} /> {busyProposalId === `apply:${proposal.id}` ? 'Applying' : 'Apply'}
                          </SmallButton>
                          <SmallButton tone="danger" onClick={() => runProposalAction(proposal.id, 'dismiss')} title={paused ? 'The realm is mid-advance. Resume or undo first' : 'Dismiss proposal'} disabled={!!busyProposalId || paused}>
                            <XCircle size={13} /> {busyProposalId === `dismiss:${proposal.id}` ? 'Dismissing' : 'Dismiss'}
                          </SmallButton>
                        </>
                      )}
                    />
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </Section>

      {/* The realm-orders forcing surface (force-as-proposal; approval applies above). */}
      <RealmVerbComposer campaign={campaign} />

      {/* THE RESOLVED LOG — past decisions, styled APART from the pending desk: muted,
          no action controls, each tagged by who resolved it (you / autoresolve). */}
      {resolvedLog.length > 0 && (
        <details data-testid="adjudication-resolved" style={{ border: `1px solid ${BORDER}`, background: CARD }}>
          <summary style={{ cursor: 'pointer', padding: '6px 10px', color: SECOND, fontFamily: sans, fontSize: FS.xs, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
            Resolved log
            <span style={{ marginLeft: 'auto', color: MUTED, fontWeight: 800 }}>{resolvedLog.length}</span>
          </summary>
          <div style={{ display: 'grid', gap: 6, padding: 8 }}>
            {resolvedLog.map(entry => (
              <div key={entry.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8, borderLeft: `2px solid ${BORDER2}`, paddingLeft: 8 }}>
                <span style={{ flex: 1, color: BODY, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, overflowWrap: 'anywhere' }}>{entry.headline}</span>
                <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.micro, fontWeight: 800, whiteSpace: 'nowrap' }}>{entry.by}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
