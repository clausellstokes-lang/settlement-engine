import { useState } from 'react';
import { ArchiveRestore } from 'lucide-react';
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
 * ArchivedContentLibrary — read-only archive inspection plus confirmed restore.
 *
 * Opening the panel never modifies the active generator projection. A
 * definition leaves this view only after the lifecycle command reports durable
 * persistence, then the authoritative archive projection is refreshed.
 */

function flattenArchived(grouped) {
  const entries = [];
  for (const category of Object.keys(grouped || {}).sort()) {
    for (const item of grouped?.[category] || []) {
      entries.push({ category, item });
    }
  }
  return entries;
}

function withoutDefinition(grouped, definitionId) {
  return Object.fromEntries(
    Object.entries(grouped || {}).map(([category, items]) => [
      category,
      (items || []).filter(item => definitionIdOf(item) !== definitionId),
    ]),
  );
}

function ArchivedDefinitionRow({
  category,
  item,
  confirming,
  busy,
  restoreDisabled,
  onAskRestore,
  onCancel,
  onRestore,
}) {
  return (
    <li style={{
      padding: '8px 9px',
      borderLeft: `3px solid ${MUTED}`,
      background: CARD,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 7,
        flexWrap: 'wrap',
      }}>
        <strong style={{ color: INK, fontFamily: serif_, fontSize: FS.sm }}>
          {definitionName(item)}
        </strong>
        <span style={{
          color: MUTED,
          fontSize: FS.micro,
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          {category}
        </span>
      </div>
      {item?.description && (
        <div style={{
          marginTop: 3,
          color: SECOND,
          fontSize: FS.xs,
          lineHeight: 1.4,
        }}>
          {item.description}
        </div>
      )}

      {!confirming && (
        <Button
          variant="secondary"
          size="sm"
          disabled={restoreDisabled}
          onClick={onAskRestore}
          style={{ marginTop: 7 }}
        >
          Restore definition
        </Button>
      )}

      {confirming && (
        <div
          role="group"
          aria-label={`Confirm restore of ${definitionName(item)}`}
          style={{
            marginTop: 7,
            padding: '7px 8px',
            border: `1px solid ${BORDER}`,
            background: CARD,
          }}
        >
          <div style={{ color: BODY, fontSize: FS.xs, lineHeight: 1.45 }}>
            Restore this definition to the active library? It can enter future
            generations again.
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
              busy={busy}
              onClick={onRestore}
            >
              Confirm restore
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={busy}
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

export default function ArchivedContentLibrary() {
  const archived = useStore(state => state.customContentArchived);
  const storeLoading = useStore(state => state.customContentArchivedLoading);
  const loadArchived = useStore(state => state.loadArchivedCustomContent);
  const restore = useStore(state => state.restoreCustomItem);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [restoreBusyId, setRestoreBusyId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const panelId = 'archived-custom-content-library';
  const visible = snapshot || archived || {};
  const entries = flattenArchived(visible);

  const refreshArchived = async () => {
    if (typeof loadArchived !== 'function') return {};
    setLoading(true);
    setError(null);
    setStatus('');
    try {
      const next = await loadArchived();
      const latestError = useStore.getState?.()?.customContentError;
      if (latestError) throw new Error(latestError);
      if (!next || typeof next !== 'object' || Array.isArray(next)) {
        throw new Error(t('errors.customContentArchiveInvalid'));
      }
      setSnapshot(next);
      setLoaded(true);
      const count = flattenArchived(next).length;
      const noun = count === 1 ? 'definition' : 'definitions';
      setStatus(`Loaded ${count} archived ${noun}.`);
      return next;
    } catch (loadError) {
      setLoaded(false);
      setError(
        loadError instanceof Error
          ? loadError.message
          : t('errors.customContentArchiveLoadFail'),
      );
      return {};
    } finally {
      setLoading(false);
    }
  };

  const toggleArchived = () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    setConfirmId(null);
    if (nextOpen && !loaded && !loading) void refreshArchived();
  };

  const restoreDefinition = async (category, item) => {
    const definitionId = definitionIdOf(item);
    if (!definitionId || restoreBusyId || typeof restore !== 'function') return;
    setRestoreBusyId(definitionId);
    setError(null);
    setStatus('');
    try {
      const receipt = await restore(
        category,
        definitionId,
        item?.revisionId || null,
      );
      if (!receiptIsConfirmed(receipt)) {
        setError(readableFailure(
          receipt,
          t('errors.customContentRestoreUnconfirmed'),
        ));
        return;
      }

      // This local removal follows, rather than anticipates, durable
      // confirmation. The authoritative archive projection is refreshed next.
      setSnapshot(current => withoutDefinition(
        current || visible,
        definitionId,
      ));
      setConfirmId(null);
      setStatus(
        `${definitionName(item)} was restored after persistence was confirmed.`,
      );
      try {
        const next = await loadArchived();
        const latestError = useStore.getState?.()?.customContentError;
        if (latestError) throw new Error(latestError);
        setSnapshot(next);
        setLoaded(true);
      } catch {
        setError(t('errors.customContentRestoreRefreshFail'));
      }
    } catch (restoreError) {
      setError(
        restoreError instanceof Error
          ? restoreError.message
          : t('errors.customContentRestoreFail'),
      );
    } finally {
      setRestoreBusyId(null);
    }
  };

  const isLoading = loading || storeLoading;

  return (
    <section style={{
      marginBottom: 12,
      border: `1px solid ${BORDER}`,
      background: CARD_ALT,
    }}>
      <Button
        variant="ghost"
        size="sm"
        icon={<ArchiveRestore size={12} />}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggleArchived}
        style={{
          width: '100%',
          justifyContent: 'flex-start',
          padding: '8px 10px',
        }}
      >
        Archived definitions
        {loaded && ` (${entries.length})`}
      </Button>

      {open && (
        <div
          id={panelId}
          style={{
            padding: '0 10px 10px',
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <div style={{
            marginTop: 8,
            color: SECOND,
            fontSize: FS.xs,
            lineHeight: 1.45,
          }}>
            Archived definitions are excluded from future generations. Their
            revisions and existing settlement references remain intact.
          </div>

          {isLoading && (
            <div role="status" aria-live="polite" style={{
              marginTop: 8,
              color: MUTED,
              fontSize: FS.xs,
              fontStyle: 'italic',
            }}>
              Loading archived definitions…
            </div>
          )}
          {!isLoading && loaded && entries.length === 0 && (
            <div style={{ marginTop: 8, color: MUTED, fontSize: FS.xs }}>
              No archived definitions.
            </div>
          )}
          {!isLoading && entries.length > 0 && (
            <ul style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              margin: '9px 0 0',
              padding: 0,
              listStyle: 'none',
            }}>
              {entries.map(({ category, item }) => {
                const definitionId = definitionIdOf(item);
                return (
                  <ArchivedDefinitionRow
                    key={`${category}:${definitionId}`}
                    category={category}
                    item={item}
                    confirming={confirmId === definitionId}
                    busy={restoreBusyId === definitionId}
                    restoreDisabled={Boolean(restoreBusyId)}
                    onAskRestore={() => {
                      setConfirmId(definitionId);
                      setError(null);
                      setStatus('');
                    }}
                    onCancel={() => setConfirmId(null)}
                    onRestore={() => restoreDefinition(category, item)}
                  />
                );
              })}
            </ul>
          )}
          <StatusNotice>{status}</StatusNotice>
          <ErrorNotice>{error}</ErrorNotice>
          {!isLoading && error && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => refreshArchived()}
              style={{ marginTop: 7 }}
            >
              Retry archive load
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
