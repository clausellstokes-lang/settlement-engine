/**
 * Content-environment inspection and recovery.
 *
 * Definitions are versioned separately from generation defaults. This surface
 * makes that distinction visible, previews every environment change, and only
 * claims success after the durable command receipt is confirmed.
 */

import { useMemo, useState } from 'react';

import {
  contentRuntimeFromEnvironment,
  makeLibraryContentEnvironmentRevision,
  VANILLA_CONTENT_ENVIRONMENT,
  VANILLA_ENVIRONMENT_REVISION_ID,
} from '../../domain/content/contentEnvironment.js';
import {
  AUTHORABLE_CONTENT_CATEGORIES,
} from '../../domain/content/customContentVersioning.js';
import { useStore } from '../../store/index.js';
import {
  BORDER as BOR,
  FS,
  MUTED as MUT,
  SECOND as SEC,
  swatch,
} from '../theme.js';
import Button from '../primitives/Button.jsx';

const EMPTY_CUSTOM_CONTENT = Object.freeze({});

function confirmed(receipt) {
  return Boolean(
    receipt?.ok
    && receipt.status === 'applied'
    && receipt.persistence?.state === 'confirmed',
  );
}

function displayValue(value) {
  if (value == null) return 'Not set';
  if (typeof value === 'string') return value;
  const text = JSON.stringify(value);
  return text.length > 90 ? `${text.slice(0, 87)}…` : text;
}

function environmentName(environment) {
  if (
    !environment
    || environment.environmentRevisionId === VANILLA_ENVIRONMENT_REVISION_ID
  ) return 'Vanilla defaults';
  if (environment.source === 'imported-pack') return 'Imported pack defaults';
  return environment.source === 'personal'
    ? 'Personal defaults'
    : 'Versioned defaults';
}

function EnvironmentSummary({ environment }) {
  const active = environment || VANILLA_CONTENT_ENVIRONMENT;
  const tunableCount = Object.keys(active.tunables || {}).length;
  const visualCount = Object.keys(active.visualSelection || {}).length;
  const packCount = active.packVersions?.length || 0;
  const definitionCount = active.directDefinitions?.length || 0;
  return (
    <span style={{ fontSize: FS.xs, color: SEC }}>
      <strong>{environmentName(active)}</strong>
      {' · '}{definitionCount} {definitionCount === 1 ? 'definition' : 'definitions'}
      {' · '}{packCount} {packCount === 1 ? 'pack' : 'packs'}
      {' · '}{tunableCount} {tunableCount === 1 ? 'setting' : 'settings'}
      {' · '}{visualCount} visual {visualCount === 1 ? 'selection' : 'selections'}
    </span>
  );
}

function EnvironmentHistoryRow({ activeRevisionId, environment, onReview }) {
  const isActive = environment.environmentRevisionId === activeRevisionId;
  return (
    <div style={{
      border: `1px solid ${isActive ? swatch.magic : BOR}`,
      padding: '7px 9px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
    }}>
      <EnvironmentSummary environment={environment} />
      <span style={{
        color: MUT,
        fontSize: FS.micro,
        overflowWrap: 'anywhere',
      }}>
        {environment.environmentRevisionId}
      </span>
      {isActive ? (
        <span style={{
          marginLeft: 'auto',
          color: swatch.magic,
          fontSize: FS.micro,
          fontWeight: 800,
          textTransform: 'uppercase',
        }}>
          Active
        </span>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onReview(environment)}
          style={{ marginLeft: 'auto' }}
        >
          Review rollback
        </Button>
      )}
    </div>
  );
}

function EnvironmentChangeReview({ review, busy, onCancel, onConfirm }) {
  if (!review) return null;
  const visibleChanges = review.changes.slice(0, 12);
  const hiddenCount = Math.max(0, review.changes.length - visibleChanges.length);
  return (
    <div
      role="group"
      aria-label="Content environment change confirmation"
      style={{
        border: `1px solid ${swatch.magic}55`,
        background: `${swatch.magic}08`,
        padding: '9px 10px',
        marginTop: 8,
      }}
    >
      <div style={{
        color: SEC,
        fontSize: FS.xs,
        lineHeight: 1.45,
        marginBottom: 7,
      }}>
        Review {review.changes.length} deterministic environment{' '}
        {review.changes.length === 1 ? 'change' : 'changes'} before activation.
        Existing campaign bindings will not be rewritten.
      </div>
      {visibleChanges.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          marginBottom: 8,
        }}>
          {visibleChanges.map(change => (
            <div key={change.path} style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(120px, 0.8fr) minmax(0, 1fr)',
              gap: 8,
              fontSize: FS.micro,
            }}>
              <strong style={{ color: SEC, overflowWrap: 'anywhere' }}>
                {change.path}
              </strong>
              <span style={{ color: MUT, overflowWrap: 'anywhere' }}>
                {displayValue(change.before)} → {displayValue(change.after)}
              </span>
            </div>
          ))}
          {hiddenCount > 0 && (
            <span style={{ color: MUT, fontSize: FS.micro }}>
              {hiddenCount} additional {hiddenCount === 1 ? 'change' : 'changes'}
            </span>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button
          variant="ai"
          size="sm"
          busy={busy}
          disabled={busy}
          onClick={onConfirm}
        >
          Activate reviewed revision
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
  );
}

export default function ContentEnvironmentLifecycle() {
  const activeEnvironment = useStore(
    state => state.activeContentEnvironment,
  ) || VANILLA_CONTENT_ENVIRONMENT;
  const environmentHistory = useStore(
    state => state.customContentEnvironmentHistory,
  ) || [];
  const loadEnvironments = useStore(
    state => state.loadCustomContentEnvironments,
  );
  const previewMigration = useStore(
    state => state.previewCustomContentEnvironmentMigration,
  );
  const resetToVanilla = useStore(
    state => state.resetCustomContentEnvironmentToVanilla,
  );
  const migrateEnvironment = useStore(
    state => state.migrateCustomContentEnvironment,
  );
  const rollbackEnvironment = useStore(
    state => state.rollbackCustomContentEnvironment,
  );
  const customContent = useStore(
    state => state.customContent,
  ) || EMPTY_CUSTOM_CONTENT;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const openHistory = async () => {
    const next = !open;
    setOpen(next);
    setReview(null);
    setMessage(null);
    setError(null);
    if (!next || typeof loadEnvironments !== 'function') return;
    setLoading(true);
    try {
      await loadEnvironments();
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Setting revision history could not be loaded.',
      );
    } finally {
      setLoading(false);
    }
  };

  const beginReview = async (target, action) => {
    if (typeof previewMigration !== 'function') return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const preview = await previewMigration(target);
      if (!preview?.ok) {
        setError(preview?.reason || 'This setting revision could not be reviewed.');
        return;
      }
      setReview({
        action,
        target,
        changes: preview.changes || [],
        previewFingerprint: preview.previewFingerprint,
      });
    } catch (previewError) {
      setError(
        previewError instanceof Error
          ? previewError.message
          : 'This setting revision could not be reviewed.',
      );
    } finally {
      setBusy(false);
    }
  };

  const beginLibraryReview = async () => {
    try {
      const nextRevisionNumber = Math.max(
        activeEnvironment.revisionNumber || 0,
        ...environmentHistory.map(environment => (
          Number(environment?.revisionNumber) || 0
        )),
      ) + 1;
      const target = makeLibraryContentEnvironmentRevision(customContent, {
        revisionNumber: nextRevisionNumber,
        tunables: activeEnvironment.tunables,
        visualSelection: activeEnvironment.visualSelection,
      });
      await beginReview(target, 'library');
    } catch (libraryError) {
      setError(
        libraryError instanceof Error
          ? libraryError.message
          : 'The authored library could not be prepared for review.',
      );
    }
  };

  const applyReview = async () => {
    if (!review || busy) return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const options = { previewFingerprint: review.previewFingerprint };
      const receipt = review.action === 'vanilla'
        ? await resetToVanilla(options)
        : review.action === 'library'
          ? await migrateEnvironment(review.target, options)
          : await rollbackEnvironment(
            review.target.environmentRevisionId,
            options,
          );
      if (!confirmed(receipt)) {
        setError(
          receipt?.status === 'stale'
            ? 'The environment changed after review. Review it again before activating.'
            : `The revision was not confirmed. ${
                receipt?.reason || 'No active defaults were changed.'
              }`,
        );
        return;
      }
      setReview(null);
      setMessage(
        review.action === 'vanilla'
          ? 'Vanilla generation defaults are active. Authored definitions remain in the Compendium and are excluded from future standalone generation.'
          : review.action === 'library'
            ? 'The reviewed authored-library revision is active for future standalone generations.'
            : 'The selected immutable setting revision is active for future standalone generations.',
      );
      await loadEnvironments?.();
    } catch (applyError) {
      setError(
        applyError instanceof Error
          ? applyError.message
          : 'The setting revision could not be activated.',
      );
    } finally {
      setBusy(false);
    }
  };

  const history = [
    activeEnvironment,
    ...environmentHistory,
  ].filter((environment, index, all) => (
    all.findIndex(candidate => (
      candidate.environmentRevisionId === environment.environmentRevisionId
    )) === index
  ));
  const isVanilla = activeEnvironment.environmentRevisionId
    === VANILLA_ENVIRONMENT_REVISION_ID;
  const authoredDefinitionCount = AUTHORABLE_CONTENT_CATEGORIES
    .map(category => customContent[category])
    .reduce((count, items) => (
      count + (Array.isArray(items)
        ? items.filter(item => item && !item.archivedAt).length
        : 0)
    ), 0);
  const runtimeResolution = useMemo(() => (
    contentRuntimeFromEnvironment(
      activeEnvironment,
      customContent,
    ).resolution
  ), [activeEnvironment, customContent]);

  return (
    <section style={{
      marginBottom: 12,
      padding: '8px 12px',
      border: `1px solid ${BOR}`,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}>
        <span style={{
          color: swatch.magic,
          fontSize: FS.xxs,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Generation defaults
        </span>
        <EnvironmentSummary environment={activeEnvironment} />
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={open}
          aria-controls="content-environment-history"
          onClick={openHistory}
          style={{ marginLeft: 'auto' }}
        >
          {open ? 'Hide revisions' : 'Manage revisions'}
        </Button>
      </div>
      {runtimeResolution.ok === false && (
        <div role="alert" style={{
          color: swatch.danger,
          fontSize: FS.xs,
          lineHeight: 1.45,
          marginTop: 7,
        }}>
          This revision no longer resolves every exact definition head. Future
          standalone generations are using vanilla until you review the current
          authored library or activate another immutable revision.
        </div>
      )}

      {open && (
        <div id="content-environment-history" style={{ marginTop: 8 }}>
          <div style={{
            color: MUT,
            fontSize: FS.micro,
            lineHeight: 1.45,
            marginBottom: 7,
          }}>
            These defaults affect future standalone generations. Authored
            definitions enter generation only when an exact library or pack
            revision is active. Every existing campaign keeps its pinned cutoff.
          </div>
          {loading ? (
            <div role="status" style={{ color: MUT, fontSize: FS.xs }}>
              Loading immutable setting revisions…
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {history.map(environment => (
                <EnvironmentHistoryRow
                  key={environment.environmentRevisionId}
                  activeRevisionId={activeEnvironment.environmentRevisionId}
                  environment={environment}
                  onReview={target => beginReview(target, 'rollback')}
                />
              ))}
            </div>
          )}
          {!isVanilla && (
            <Button
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={() => beginReview(
                VANILLA_CONTENT_ENVIRONMENT,
                'vanilla',
              )}
              style={{ marginTop: 8 }}
            >
              Review vanilla reset
            </Button>
          )}
          {authoredDefinitionCount > 0 && (
            <Button
              variant="secondary"
              size="sm"
              disabled={busy}
              onClick={beginLibraryReview}
              style={{ marginTop: 8, marginLeft: isVanilla ? 0 : 8 }}
            >
              Review authored library ({authoredDefinitionCount})
            </Button>
          )}
          <EnvironmentChangeReview
            review={review}
            busy={busy}
            onCancel={() => setReview(null)}
            onConfirm={applyReview}
          />
          {message && (
            <div role="status" style={{
              color: SEC,
              fontSize: FS.xs,
              marginTop: 8,
            }}>
              {message}
            </div>
          )}
          {error && (
            <div role="alert" style={{
              color: swatch.danger,
              fontSize: FS.xs,
              marginTop: 8,
            }}>
              {error}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
