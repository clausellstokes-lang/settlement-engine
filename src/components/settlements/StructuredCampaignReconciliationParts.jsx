/**
 * Presentational pieces for the structured-import reviewer.
 *
 * Keeping evidence rows and effect disclosure separate leaves the controller
 * focused on admission, recovery, and command orchestration.
 */

import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  GREEN,
  INK,
  MUTED,
  SP,
  sans,
  serif_,
} from '../theme.js';

export const reconciliationFieldStyle = {
  minHeight: 34,
  padding: `${SP.xs}px ${SP.sm}px`,
  border: `1px solid ${BORDER}`,
  background: CARD,
  color: INK,
  fontFamily: sans,
  fontSize: FS.xs,
};

function choiceValue(proposal) {
  if (!proposal.decision) return '';
  if (proposal.decision.action !== 'match') return proposal.decision.action;
  const candidate = proposal.candidates.find(item => (
    item.targetSaveId === proposal.decision.targetSaveId
  ));
  return candidate ? `match:${candidate.candidateId}` : '';
}

function evidenceLabel(candidate) {
  if (candidate.matchClass === 'stable_source_id') return 'same stable save ID';
  if (candidate.matchClass === 'stable_import_provenance') {
    return 'same prior import provenance';
  }
  return 'same name only';
}

export function ImportProposalRow({
  proposal,
  conflicts,
  unsupported,
  onChoose,
}) {
  const decisionId = `reconciliation-decision-${proposal.proposalId}`;
  return (
    <li style={{
      listStyle: 'none',
      border: `1px solid ${proposal.decision ? GREEN : BORDER}`,
      background: CARD_ALT,
      padding: SP.md,
      display: 'flex',
      flexDirection: 'column',
      gap: SP.sm,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: SP.sm,
        flexWrap: 'wrap',
      }}>
        <strong style={{ color: INK, fontFamily: serif_, fontSize: FS.md }}>
          {proposal.sourceName}
        </strong>
        {proposal.sourceTier && (
          <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs }}>
            {proposal.sourceTier}
          </span>
        )}
        <span style={{
          marginLeft: 'auto',
          color: MUTED,
          fontFamily: sans,
          fontSize: FS.xxs,
        }}>
          Source ID: {proposal.sourceSaveId || 'none'}
        </span>
      </div>

      <label
        htmlFor={decisionId}
        style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}
      >
        <span style={{
          color: BODY,
          fontFamily: sans,
          fontSize: FS.xs,
          fontWeight: 700,
        }}>
          What should happen?
        </span>
        <select
          id={decisionId}
          aria-label={`Decision for ${proposal.sourceName}`}
          value={choiceValue(proposal)}
          onChange={event => onChoose(event.target.value)}
          style={reconciliationFieldStyle}
        >
          <option value="">Choose an action…</option>
          <option value="create">Create a new settlement and add it</option>
          {proposal.candidates.map(candidate => (
            <option key={candidate.candidateId} value={`match:${candidate.candidateId}`}>
              Use {candidate.targetName} ({evidenceLabel(candidate)})
            </option>
          ))}
          <option value="skip">Skip this settlement</option>
          <option value="defer">Decide later</option>
        </select>
      </label>

      {conflicts.map(conflict => (
        <p key={conflict.conflictId} style={{
          margin: 0,
          color: BODY,
          fontFamily: sans,
          fontSize: FS.xxs,
          lineHeight: 1.45,
        }}>
          Review evidence: {conflict.message}
        </p>
      ))}
      {unsupported.map(issue => (
        <p key={issue.issueId} style={{
          margin: 0,
          color: MUTED,
          fontFamily: sans,
          fontSize: FS.xxs,
          lineHeight: 1.45,
        }}>
          Not applied in this pass: {issue.message}
        </p>
      ))}
    </li>
  );
}

export function ImportPreviewFacts({ preview }) {
  const facts = [
    ['New settlements', preview.effects.settlementsToCreate],
    ['Existing settlements reused', preview.effects.existingSettlementsToReuse],
    ['Campaign memberships added', preview.effects.membershipsToAdd],
    ['Old campaign memberships removed', preview.effects.membershipsToRemove],
    ['Settlements rehomed', preview.effects.settlementsToRehome],
    ['Already in this campaign', preview.effects.membershipsAlreadyPresent],
    ['Skipped', preview.effects.skipped],
    ['Deferred', preview.effects.deferred],
    ['Relationships deferred', preview.effects.relationshipsDeferred],
  ];
  return (
    <dl style={{
      margin: 0,
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      border: `1px solid ${BORDER}`,
      background: CARD_ALT,
    }}>
      {facts.map(([label, value]) => (
        <div key={label} style={{ display: 'contents' }}>
          <dt style={{
            padding: `${SP.xs}px ${SP.sm}px`,
            borderBottom: `1px solid ${BORDER}`,
            color: BODY,
            fontFamily: sans,
            fontSize: FS.xs,
          }}>
            {label}
          </dt>
          <dd style={{
            margin: 0,
            padding: `${SP.xs}px ${SP.sm}px`,
            borderBottom: `1px solid ${BORDER}`,
            color: INK,
            fontFamily: sans,
            fontSize: FS.xs,
            fontWeight: 800,
            textAlign: 'right',
          }}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function ImportMembershipTransfers({ session }) {
  const transfers = session.preview?.membershipTransfers || [];
  if (transfers.length === 0) return null;
  const proposals = new Map(
    session.proposals.map(proposal => [proposal.proposalId, proposal]),
  );
  return (
    <div style={{
      border: `1px solid ${GOLD}`,
      background: CARD_ALT,
      padding: SP.sm,
      color: BODY,
      fontFamily: sans,
      fontSize: FS.xs,
      lineHeight: 1.45,
    }}>
      <strong style={{ color: INK }}>Exclusive membership changes</strong>
      <ul
        aria-label="Campaign memberships to remove"
        style={{ margin: `${SP.xs}px 0 0`, paddingLeft: SP.lg }}
      >
        {transfers.map((transfer) => {
          const proposal = proposals.get(transfer.proposalId);
          const names = transfer.fromCampaigns.map(
            item => item.campaignName || item.campaignId,
          );
          return (
            <li key={`${transfer.proposalId}:${transfer.saveId}`}>
              {proposal?.sourceName || transfer.saveId} will leave
              {' '}{names.join(', ')} and belong only to this campaign.
            </li>
          );
        })}
      </ul>
    </div>
  );
}
