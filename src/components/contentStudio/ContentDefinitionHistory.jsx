import { useState } from 'react';
import { useStore } from '../../store/index.js';
import { t } from '../../copy/index.js';
import Button from '../primitives/Button.jsx';
import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  INK,
  MUTED,
  SECOND,
  serif_,
  swatch,
} from '../theme.js';
import {
  definitionIdOf,
  definitionName,
  ErrorNotice,
  readableFailure,
  receiptIsConfirmed,
  StatusNotice,
} from './customContentLifecycleSupport.jsx';

/*
 * ContentDefinitionHistory — append-only inspection and recovery.
 *
 * The component never owns content state. It reads history and creates a
 * forward revision through the store's immutable command boundary, then waits
 * for explicit persistence confirmation before reporting success.
 */

function formatRevisionTime(value) {
  if (!value) return 'Time not recorded';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Time not recorded';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function revisionLabel(revision) {
  const number = Number(revision?.revisionNumber);
  return Number.isFinite(number) && number > 0
    ? `Version ${number}`
    : 'Earlier version';
}

const PANEL_STYLE = {
  marginTop: 5,
  padding: '9px 10px',
  border: `1px solid ${BORDER}`,
  background: CARD,
};

const LIST_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  margin: '9px 0 0',
  padding: 0,
  listStyle: 'none',
};

function RevisionRow({
  revision,
  confirming,
  mutationBusy,
  onAskRestore,
  onCancel,
  onRestore,
}) {
  const label = revisionLabel(revision);
  const current = revision.isHead === true;
  return (
    <li style={{
      padding: '7px 8px',
      borderLeft: `3px solid ${current ? swatch.success : BORDER}`,
      background: current ? `${swatch.success}0a` : CARD_ALT,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 7,
        flexWrap: 'wrap',
      }}>
        <strong style={{ color: INK, fontFamily: serif_, fontSize: FS.sm }}>
          {label}
        </strong>
        {current && (
          <span style={{
            color: swatch.success,
            fontSize: FS.micro,
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            Current
          </span>
        )}
        <span style={{ marginLeft: 'auto', color: MUTED, fontSize: FS.micro }}>
          {formatRevisionTime(revision.createdAt)}
        </span>
      </div>
      <div style={{
        marginTop: 3,
        color: SECOND,
        fontSize: FS.xs,
        lineHeight: 1.4,
      }}>
        {definitionName(revision.data)}
        {revision.data?.description ? `: ${revision.data.description}` : ''}
      </div>

      {!current && !confirming && (
        <Button
          variant="secondary"
          size="sm"
          disabled={mutationBusy}
          onClick={onAskRestore}
          style={{ marginTop: 7 }}
        >
          Restore {label.toLowerCase()} as new revision
        </Button>
      )}

      {confirming && (
        <div
          role="group"
          aria-label={`Confirm restore of ${label.toLowerCase()}`}
          style={{
            marginTop: 7,
            padding: '7px 8px',
            border: `1px solid ${BORDER}`,
            background: CARD,
          }}
        >
          <div style={{ color: BODY, fontSize: FS.xs, lineHeight: 1.45 }}>
            Create a new current revision from {label.toLowerCase()}? The
            present head will remain in history.
          </div>
          <div style={{
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            marginTop: 7,
          }}>
            <Button
              variant="primary"
              size="sm"
              busy={mutationBusy}
              onClick={onRestore}
            >
              Create forward revision
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={mutationBusy}
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </li>
  );
}

export default function ContentDefinitionHistory({ category, item }) {
  const listRevisions = useStore(state => state.listCustomContentRevisions);
  const rollback = useStore(state => state.rollbackCustomItem);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [rollbackBusy, setRollbackBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const definitionId = definitionIdOf(item);
  const panelId = `content-history-${definitionId}`;

  const loadHistory = async () => {
    if (!definitionId || typeof listRevisions !== 'function') return [];
    setLoading(true);
    setError(null);
    setStatus('');
    try {
      const next = await listRevisions(definitionId);
      if (!Array.isArray(next)) {
        throw new Error(t('errors.customContentHistoryInvalid'));
      }
      setRevisions(next);
      setLoaded(true);
      const noun = next.length === 1 ? 'version' : 'versions';
      setStatus(`Loaded ${next.length} immutable ${noun}.`);
      return next;
    } catch (loadError) {
      setLoaded(false);
      setError(
        loadError instanceof Error
          ? loadError.message
          : t('errors.customContentHistoryLoadFail'),
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const toggleHistory = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    setTargetId(null);
    if (nextOpen && !loaded && !loading) void loadHistory();
  };

  const restoreRevision = async revision => {
    if (rollbackBusy || !definitionId || typeof rollback !== 'function') return;
    setRollbackBusy(true);
    setError(null);
    setStatus('');
    try {
      const receipt = await rollback(
        category,
        definitionId,
        revision.id,
        item?.revisionId || null,
      );
      if (!receiptIsConfirmed(receipt)) {
        setError(readableFailure(
          receipt,
          t('errors.customContentRevisionRestoreUnconfirmed'),
        ));
        return;
      }

      setTargetId(null);
      setStatus(
        `${revisionLabel(revision)} was copied into a new, confirmed current revision.`,
      );
      // The command is already durable. Refresh failure is reported separately
      // and never recasts the confirmed write as failed.
      try {
        const next = await listRevisions(definitionId);
        if (!Array.isArray(next)) throw new Error();
        setRevisions(next);
        setLoaded(true);
      } catch {
        setError(t('errors.customContentHistoryRefreshFail'));
      }
    } catch (rollbackError) {
      setError(
        rollbackError instanceof Error
          ? rollbackError.message
          : t('errors.customContentRevisionRestoreFail'),
      );
    } finally {
      setRollbackBusy(false);
    }
  };

  if (!definitionId) return null;

  return (
    <div style={{ marginTop: 8 }}>
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleHistory}
        style={{ paddingInline: 0 }}
      >
        Version history for {definitionName(item)}
      </Button>

      {open && (
        <section
          id={panelId}
          aria-label={`Version history for ${definitionName(item)}`}
          style={PANEL_STYLE}
        >
          <div style={{ color: SECOND, fontSize: FS.xs, lineHeight: 1.45 }}>
            Restoring an earlier version appends a new current revision. Existing
            history remains unchanged and referenceable.
          </div>

          {loading && (
            <div role="status" aria-live="polite" style={{
              marginTop: 8,
              color: MUTED,
              fontSize: FS.xs,
              fontStyle: 'italic',
            }}>
              Loading immutable history…
            </div>
          )}
          {!loading && loaded && revisions.length === 0 && (
            <div style={{ marginTop: 8, color: MUTED, fontSize: FS.xs }}>
              No revision history is available for this definition.
            </div>
          )}
          {!loading && revisions.length > 0 && (
            <ol style={LIST_STYLE}>
              {revisions.map(revision => (
                <RevisionRow
                  key={revision.id}
                  revision={revision}
                  confirming={String(targetId) === String(revision.id)}
                  mutationBusy={rollbackBusy}
                  onAskRestore={() => {
                    setTargetId(revision.id);
                    setError(null);
                    setStatus('');
                  }}
                  onCancel={() => setTargetId(null)}
                  onRestore={() => restoreRevision(revision)}
                />
              ))}
            </ol>
          )}
          <StatusNotice>{status}</StatusNotice>
          <ErrorNotice>{error}</ErrorNotice>
          {!loading && (loaded || error) && (
            <Button
              variant="secondary"
              size="sm"
              disabled={rollbackBusy}
              onClick={() => loadHistory()}
              style={{ marginTop: 7 }}
            >
              {loaded ? 'Refresh history' : 'Retry history load'}
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
