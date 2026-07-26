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

import { useCallback, useEffect, useRef, useState } from 'react';
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

/** @param {unknown} value @returns {string} */
function text(value) {
  return value == null ? '' : String(value).trim();
}

/** @param {Record<string, any>} item @returns {string} */
function realmItemKey(item) {
  return text(item?.presentationKey || item?.id);
}

/**
 * Read one preserved source record from the canonical RealmItem envelope.
 * Merged proposal/verdict items carry both records under `source.records`;
 * single-source items retain the same record under `payload.sourceRecord`.
 *
 * @param {Record<string, any>} item
 * @param {'proposal'|'paused_major'} sourceClass
 * @returns {Record<string, any>|null}
 */
function realmSourceRecord(item, sourceClass) {
  const sourceRecords = Array.isArray(item?.source?.records) ? item.source.records : [];
  const sourceEntry = sourceRecords.find(entry => (
    entry?.sourceClass === sourceClass
    && entry?.record
    && typeof entry.record === 'object'
  ));
  if (sourceEntry) return sourceEntry.record;

  const payloadRecords = Array.isArray(item?.payload?.sourceRecords)
    ? item.payload.sourceRecords : [];
  const payloadEntry = payloadRecords.find(entry => (
    entry?.sourceClass === sourceClass
    && entry?.record
    && typeof entry.record === 'object'
  ));
  if (payloadEntry) return payloadEntry.record;

  if (item?.source?.primaryClass === sourceClass
    && item?.payload?.sourceRecord
    && typeof item.payload.sourceRecord === 'object') {
    return item.payload.sourceRecord;
  }
  return null;
}

/** @param {Record<string, any>} item @param {string} actionId */
function realmAction(item, actionId) {
  return (Array.isArray(item?.legalActions) ? item.legalActions : [])
    .find(action => action?.actionId === actionId) || null;
}

/**
 * The action descriptor owns the routable proposal identity. The preserved
 * record is only a fallback for readable, disabled legacy/degraded evidence.
 *
 * @param {Record<string, any>} item
 * @param {Record<string, any>} record
 * @param {'proposal'|'paused_major'} sourceClass
 */
function realmDecisionSourceId(item, record, sourceClass) {
  const descriptor = sourceClass === 'proposal'
    ? realmAction(item, 'apply-proposal')
    : realmAction(item, 'keep-paused-major');
  const targetId = text(descriptor?.target?.sourceId);
  if (targetId) return targetId;
  if (sourceClass === 'paused_major') {
    return text(record?.proposalId ?? record?.id ?? record?.outcome?.id);
  }
  return text(record?.id ?? record?.eventId ?? record?.outcomeId ?? record?.impactId);
}

/** @param {ReadonlyArray<Record<string, any>>} items */
function canonicalProposalRows(items) {
  const rows = [];
  const seen = new Set();
  for (const item of items) {
    if (item?.resolution?.state !== 'unresolved') continue;
    // A proven proposal + paused-major merge is one verdict, rendered by the
    // paused surface below rather than duplicated as a second proposal card.
    const classes = Array.isArray(item?.source?.classes) ? item.source.classes : [];
    if (item?.workflow?.kind === 'verdict' && classes.includes('paused_major')) continue;
    const proposal = realmSourceRecord(item, 'proposal');
    if (!proposal) continue;
    const sourceId = realmDecisionSourceId(item, proposal, 'proposal');
    const itemId = realmItemKey(item);
    const key = itemId || sourceId;
    if (!sourceId || !key || seen.has(key)) continue;
    seen.add(key);
    rows.push({
      canonical: true,
      sourceId,
      itemId,
      item,
      proposal,
      applyAction: realmAction(item, 'apply-proposal'),
      dismissAction: realmAction(item, 'dismiss-proposal'),
    });
  }
  return rows;
}

/** @param {unknown} value @returns {number|null} */
function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

/** @param {unknown} value @returns {number|null} */
function recordedTime(value) {
  const time = Date.parse(text(value));
  return Number.isFinite(time) ? time : null;
}

/**
 * Sort terminal decisions from recorded chronology, then stable identity.
 * Missing timestamps never borrow wall-clock time: in-world tick is the next
 * recorded ordering fact and the canonical item key is the final tie-break.
 */
function sortResolvedLog(entries) {
  return [...entries].sort((a, b) => {
    const timeDelta = (finiteNumber(b.recordedTime) ?? -1) - (finiteNumber(a.recordedTime) ?? -1);
    if (timeDelta) return timeDelta;
    const tickDelta = (finiteNumber(b.tick) ?? -1) - (finiteNumber(a.tick) ?? -1);
    if (tickDelta) return tickDelta;
    const aId = text(a.id);
    const bId = text(b.id);
    return aId < bId ? -1 : aId > bId ? 1 : 0;
  });
}

/** @param {ReadonlyArray<Record<string, any>>} items */
function canonicalResolvedRows(items) {
  const rows = [];
  const seen = new Set();
  for (const item of items) {
    const resolution = text(item?.resolution?.state);
    if (!['resolved', 'dismissed', 'superseded'].includes(resolution)) continue;
    const proposal = realmSourceRecord(item, 'proposal');
    if (!proposal) continue;
    const id = realmItemKey(item) || text(proposal.id);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const status = text(proposal.status).toLowerCase();
    const by = status === 'dismissed'
      ? 'dismissed by you'
      : status === 'refused'
        ? 'refused by the realm'
        : status === 'superseded' || status === 'expired'
          ? 'superseded'
          : 'applied by you';
    rows.push({
      id,
      headline: text(item?.headline || proposal.headline) || 'A decision',
      by,
      tick: item?.tick ?? proposal.tick ?? null,
      recordedTime: recordedTime(
        proposal.updatedAt
        ?? proposal.appliedAt
        ?? proposal.dismissedAt
        ?? proposal.resolvedAt,
      ),
    });
  }
  return sortResolvedLog(rows).slice(0, 15);
}

/** @param {ReadonlyArray<Record<string, any>>} items */
function canonicalPausedRows(items) {
  const rows = [];
  const seen = new Set();
  for (const item of items) {
    const major = realmSourceRecord(item, 'paused_major');
    if (!major) continue;
    const sourceId = realmDecisionSourceId(item, major, 'paused_major');
    const itemId = realmItemKey(item);
    const key = itemId || sourceId;
    if (!sourceId || !key || seen.has(key)) continue;
    seen.add(key);
    rows.push({ canonical: true, sourceId, itemId, item, major });
  }
  return rows;
}

/**
 * Revalidate the canonical descriptor before handing its exact source ID to the
 * existing store writer. The writer repeats live campaign-state validation.
 */
function proposalActionState(row, action, paused, locallyResolved) {
  if (paused) return { available: false, reason: 'The realm is mid-advance. Resume or undo first.' };
  if (locallyResolved) return { available: false, reason: 'This decision was already recorded.' };
  if (!row.canonical) return { available: true, reason: null };
  if (row.item?.identity?.interactive === false) {
    return {
      available: false,
      reason: text(row.item?.identity?.reason) || 'This decision has ambiguous identity and cannot be invoked safely.',
    };
  }
  const descriptor = action === 'apply' ? row.applyAction : row.dismissAction;
  const expectedAdapter = action === 'apply'
    ? 'applyWorldPulseProposal' : 'dismissWorldPulseProposal';
  if (!descriptor || descriptor.adapterKey !== expectedAdapter) {
    return { available: false, reason: 'The canonical decision does not expose this action.' };
  }
  if (text(descriptor?.target?.sourceId) !== row.sourceId) {
    return { available: false, reason: 'The decision action no longer targets this proposal.' };
  }
  const availability = descriptor.availability || {};
  return availability.available === true
    ? { available: true, reason: null }
    : {
      available: false,
      reason: text(availability.refusalReason) || 'This decision is not currently available.',
    };
}

/** Find the exact authoritative proposal returned by either proposal writer. */
function returnedProposal(result, proposalId) {
  const candidates = Array.isArray(result?.worldState?.proposals)
    ? result.worldState.proposals : [result];
  return candidates.find(proposal => (
    proposal
    && typeof proposal === 'object'
    && text(proposal.id) === proposalId
  )) || null;
}

// Cluster pending proposals by the settlement they touch (collectSettlementIds[0]),
// realm-wide (no settlement) last — the uncapped wall becomes navigable at scale.
function groupProposalsBySettlement(rows = [], nameById = new Map()) {
  const bySettlement = new Map();
  const realmWide = [];
  for (const row of rows) {
    const sid = collectSettlementIds(row.proposal)[0];
    if (sid == null) { realmWide.push(row); continue; }
    const key = String(sid);
    const list = bySettlement.get(key) || [];
    list.push(row);
    bySettlement.set(key, list);
  }
  const groups = [];
  for (const [key, items] of bySettlement) groups.push({ key, name: nameById.get(key) || key, items });
  if (realmWide.length) groups.push({ key: '__realm__', name: 'Across the realm', items: realmWide });
  return groups;
}

function DecisionAnchor({ itemId, activeItemKey, nodes, children }) {
  const active = !!itemId && itemId === activeItemKey;
  return (
    <div
      ref={(node) => {
        if (!itemId) return;
        if (node) nodes.current.set(itemId, node);
        else nodes.current.delete(itemId);
      }}
      data-testid={itemId ? 'herald-decision-item' : undefined}
      data-realm-item-id={itemId || undefined}
      aria-current={active ? 'true' : undefined}
      tabIndex={active ? -1 : undefined}
      style={{ outline: active ? `2px solid ${SECOND}` : 'none', outlineOffset: active ? 2 : 0 }}
    >
      {children}
    </div>
  );
}

export default function HeraldAdjudication({
  campaign,
  focusId = null,
  focusName = '',
  realmDecisionItems,
  activeDecisionItemId = null,
}) {
  const applyProposal = useStore(s => s.applyWorldPulseProposal);
  const dismissProposal = useStore(s => s.dismissWorldPulseProposal);
  const canonizeCampaignWorld = useStore(s => s.canonizeCampaignWorld);
  const resolveIntervalMajors = useStore(s => s.resolveIntervalMajors);
  const saves = useStore(s => s.savedSettlements);
  const nameById = nameMapFromSaves(saves);

  const [busyProposalId, setBusyProposalId] = useState(null);
  const [canonBusy, setCanonBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionReceipt, setActionReceipt] = useState(null);
  const [locallyResolvedProposalIds, setLocallyResolvedProposalIds] = useState(() => new Set());
  const [dismissedMajorIds, setDismissedMajorIds] = useState(() => new Set());
  const [resumeBusy, setResumeBusy] = useState(false);
  const decisionNodes = useRef(new Map());

  const toggleDismissMajor = useCallback((id) => {
    setDismissedMajorIds(prev => {
      const next = new Set(prev);
      if (next.has(String(id))) next.delete(String(id)); else next.add(String(id));
      return next;
    });
  }, []);

  const worldState = campaign?.worldState || {};
  const paused = !!worldState.pausedAdvance;
  const canonicalMode = Array.isArray(realmDecisionItems);
  const canonicalItems = canonicalMode ? realmDecisionItems : [];
  const pendingMajors = paused
    ? canonicalMode
      ? canonicalPausedRows(canonicalItems)
      : (worldState.pausedAdvance?.pendingMajors || [])
        .map(major => ({
          canonical: false,
          sourceId: text(major?.proposalId ?? major?.id ?? major?.outcome?.id),
          itemId: null,
          item: null,
          major,
        }))
    : [];
  const allPending = (worldState.proposals || []).filter(p => p.status === 'pending');
  // FOCUS scopes the decisions desk too (the whole paper is the local edition): a
  // proposal touching the focused settlement stays. Then the uncapped wall becomes
  // collapsible group-by-settlement sections.
  const pending = canonicalMode
    ? canonicalProposalRows(canonicalItems)
    : (focusId != null
      ? allPending.filter(p => collectSettlementIds(p).map(String).includes(String(focusId)))
      : allPending)
      .map(proposal => ({
        canonical: false,
        // Legacy mode must retain the raw writer argument byte-for-byte. The
        // canonical flagged path above owns normalized RealmItem source IDs.
        sourceId: proposal.id,
        itemId: null,
        item: null,
        proposal,
        applyAction: null,
        dismissAction: null,
      }));
  const pendingGroups = groupProposalsBySettlement(pending, nameById);

  // A Briefing jump carries the canonical RealmItem key, not a raw proposal ID.
  // Focus the exact matching decision after the destination mounts; optional
  // chaining keeps jsdom and older browsers safe without weakening navigation.
  const activeItemKey = text(activeDecisionItemId);
  const renderedDecisionKeys = [
    ...pending.map(row => row.itemId),
    ...pendingMajors.map(row => row.itemId),
  ].filter(Boolean).join('|');
  useEffect(() => {
    if (!canonicalMode || !activeItemKey) return;
    const node = decisionNodes.current.get(activeItemKey);
    if (!node) return;
    node.scrollIntoView?.({ block: 'nearest' });
    node.focus?.({ preventScroll: true });
  }, [canonicalMode, activeItemKey, renderedDecisionKeys]);

  if (!campaign) return null;

  // THE RESOLVED LOG (styled apart from the pending desk): manual decisions (the
  // proposals you applied/dismissed) + autoresolve results (the latest pulse's
  // auto-applied significant turns). Focus-scoped, capped, most-recent first.
  const latestPulse = (worldState.pulseHistory || [])[(worldState.pulseHistory || []).length - 1] || null;
  const touchesFocus = (record) => focusId == null || collectSettlementIds(record).map(String).includes(String(focusId));
  const resolvedLog = canonicalMode
    ? canonicalResolvedRows(canonicalItems)
    : sortResolvedLog([
      ...(worldState.proposals || [])
        .filter(p => ['applied', 'dismissed', 'refused'].includes(p.status) && touchesFocus(p))
        .map(p => ({
          id: `prop-${p.id}`,
          headline: p.headline || 'A decision',
          by: p.status === 'refused' ? 'refused by the realm' : `${p.status} by you`,
          tick: p.tick,
          recordedTime: recordedTime(p.updatedAt ?? p.appliedAt ?? p.dismissedAt),
        })),
      ...((latestPulse?.selectedOutcomes || [])
        .filter(o => o.applyMode !== 'proposal' && (o.significance === 'major' || (o.severity ?? 0) >= 0.72) && touchesFocus(o))
        .map(o => ({
          id: `auto-${o.id}`,
          headline: o.headline || human(o.candidateType) || 'A turn',
          by: 'by autoresolve',
          tick: latestPulse?.tick,
          recordedTime: recordedTime(o.updatedAt ?? o.appliedAt),
        }))),
    ]).slice(0, 15);
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

  const runProposalAction = async (row, action) => {
    const proposalId = row.sourceId;
    const actionState = proposalActionState(
      row,
      action,
      paused,
      locallyResolvedProposalIds.has(proposalId),
    );
    if (busyProposalId || !actionState.available) {
      if (canonicalMode && actionState.reason) setActionError(actionState.reason);
      return;
    }
    setBusyProposalId(`${action}:${proposalId}`);
    setActionError(null);
    if (canonicalMode) setActionReceipt(null);
    try {
      const fn = action === 'apply' ? applyProposal : dismissProposal;
      const updated = await fn(campaign.id, proposalId);
      if (!updated) {
        setActionError(canonicalMode
          ? 'No decision was recorded. The proposal changed or became unavailable before this action landed.'
          : t('errors.proposalUpdateFail'));
        return;
      }
      if (!canonicalMode) return;

      const terminal = returnedProposal(updated, proposalId);
      const status = text(terminal?.status);
      const heading = text(row.item?.headline || row.proposal?.headline) || proposalId;
      const accepted = action === 'dismiss'
        ? status === 'dismissed'
        : status === 'applied' || status === 'refused';
      if (!accepted) {
        setActionError(t('errors.proposalReceiptMissing'));
        return;
      }

      const message = status === 'dismissed'
        ? `Dismissed “${heading}”. The authoritative proposal is recorded as dismissed.`
        : status === 'refused'
          ? `“${heading}” was not applied. The authoritative proposal is recorded as refused.`
          : `Applied “${heading}”. The authoritative proposal is recorded as applied.`;
      setActionReceipt({ proposalId, status, message });
      setLocallyResolvedProposalIds(previous => {
        const next = new Set(previous);
        next.add(proposalId);
        return next;
      });
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
          heading="Start the campaign's World Clock first"
          summary="Decisions and orders open once you lock the map, placements, and assumptions and start the world clock."
          severity={0.45}
          details={['required before advancement']}
          actions={(
            <SmallButton tone="good" onClick={runCanonizeWorld} disabled={canonBusy} hint="Start the campaign's world clock">
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
      {canonicalMode && actionReceipt && (
        <ClerkNote rubric="Decision recorded" role="status">
          {actionReceipt.message}
        </ClerkNote>
      )}

      {paused && (
        <div data-testid="paused-verdict-surface" style={{ border: `1px solid ${GOLD}`, borderLeft: `3px solid ${GOLD}`, padding: 12, background: CARD_ALT, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 800, lineHeight: 1.5 }}>
            The advance paused for your word. {pendingMajors.length > 0
              ? `${pendingMajors.length} major turn${pendingMajors.length === 1 ? '' : 's'} await your verdict. Keep each (it applies as recommended) or dismiss it, then resume the interval.`
              : 'Resume or undo the advance to continue.'}
          </div>
          {pendingMajors.map((row) => {
            const major = row.major;
            const id = row.sourceId;
            const dismissed = dismissedMajorIds.has(id);
            return (
              <DecisionAnchor
                key={row.itemId || id}
                itemId={row.itemId}
                activeItemKey={activeItemKey}
                nodes={decisionNodes}
              >
                <OutcomeCard
                  heading={row.item?.headline || major.headline || major.outcome?.headline || 'A major turn awaits your word'}
                  summary={row.item?.summary || major.summary || major.outcome?.summary || ''}
                  severity={Number(row.item?.attention?.significance) || (typeof major.severity === 'number' ? major.severity : 0.8)}
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
              </DecisionAnchor>
            );
          })}
          <SmallButton tone="good" onClick={submitVerdicts} disabled={resumeBusy}>
            <Clock3 size={13} /> {resumeBusy ? 'Resuming'
              : dismissedMajorIds.size > 0 ? `Resume with your verdicts (${dismissedMajorIds.size} dismissed)`
                : 'Resume with recommendations'}
          </SmallButton>
        </div>
      )}

      <Section heading="Pending Decisions" count={pending.length}>
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
                  {group.items.map((row) => {
                    const proposal = row.proposal;
                    const resolvedLocally = locallyResolvedProposalIds.has(row.sourceId);
                    const applyState = proposalActionState(row, 'apply', paused, resolvedLocally);
                    const dismissState = proposalActionState(row, 'dismiss', paused, resolvedLocally);
                    return (
                      <DecisionAnchor
                        key={row.itemId || row.sourceId}
                        itemId={row.itemId}
                        activeItemKey={activeItemKey}
                        nodes={decisionNodes}
                      >
                        <OutcomeCard
                          heading={row.item?.headline || proposal.headline}
                          summary={row.item?.summary || proposal.summary}
                          severity={Number(row.item?.attention?.significance) || proposal.severity}
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
                                onClick={() => runProposalAction(row, 'apply')}
                                hint={applyState.reason || 'Apply proposal'}
                                disabled={!!busyProposalId || !applyState.available}
                              >
                                <CheckCircle2 size={13} /> {busyProposalId === `apply:${row.sourceId}` ? 'Applying' : 'Apply'}
                              </SmallButton>
                              <SmallButton
                                tone="danger"
                                onClick={() => runProposalAction(row, 'dismiss')}
                                hint={dismissState.reason || 'Dismiss proposal'}
                                disabled={!!busyProposalId || !dismissState.available}
                              >
                                <XCircle size={13} /> {busyProposalId === `dismiss:${row.sourceId}` ? 'Dismissing' : 'Dismiss'}
                              </SmallButton>
                            </>
                          )}
                        />
                      </DecisionAnchor>
                    );
                  })}
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
