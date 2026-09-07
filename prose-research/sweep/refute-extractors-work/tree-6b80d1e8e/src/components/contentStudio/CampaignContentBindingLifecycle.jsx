/**
 * Campaign content migration and rollback.
 *
 * This surface never edits the account environment or a historical binding.
 * It forges a same-seed comparison, shows the exact definition/environment
 * delta, and submits that reviewed receipt through the campaign saved-map CAS.
 */

import { useState } from 'react';

import { useStore } from '../../store/index.js';
import {
  BORDER as BOR,
  FS,
  MUTED as MUT,
  SECOND as SEC,
  swatch,
} from '../theme.js';
import Button from '../primitives/Button.jsx';

function compactHash(value) {
  const hash = String(value || '');
  return hash ? `${hash.slice(0, 10)}…${hash.slice(-8)}` : 'Unavailable';
}

function materializedCount(sample, side) {
  const projection = sample?.[side] || {};
  return (
    (projection.institutions?.length || 0)
    + (projection.resources?.length || 0)
    + (projection.services?.length || 0)
  );
}

function BindingRow({ binding, onReview }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      border: `1px solid ${BOR}`,
      padding: '7px 9px',
    }}>
      <span style={{ color: SEC, fontSize: FS.xs }}>
        <strong>{binding.resolvedDefinitions?.length || 0}</strong>{' '}
        pinned definitions
      </span>
      <span style={{
        color: MUT,
        fontSize: FS.micro,
        overflowWrap: 'anywhere',
      }}>
        {compactHash(binding.bindingHash)}
      </span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onReview(binding.bindingHash)}
        style={{ marginLeft: 'auto' }}
      >
        Review campaign rollback
      </Button>
    </div>
  );
}

function ReviewPanel({ review, busy, onCancel, onConfirm }) {
  if (!review) return null;
  const changes = review.definitionChanges || [];
  const visible = changes.slice(0, 10);
  const sample = review.sameSeedSample;
  return (
    <div
      role="group"
      aria-label="Campaign content binding confirmation"
      style={{
        border: `1px solid ${swatch.magic}55`,
        background: `${swatch.magic}08`,
        padding: '9px 10px',
        marginTop: 8,
      }}
    >
      <div style={{ color: SEC, fontSize: FS.xs, lineHeight: 1.5 }}>
        This review pins {review.plan.targetBinding.resolvedDefinitions.length}{' '}
        definitions. It changes {changes.length} definition{' '}
        {changes.length === 1 ? 'head' : 'heads'} and{' '}
        {review.environmentChanges?.length || 0} environment fields.
      </div>
      {sample && (
        <div style={{
          marginTop: 6,
          color: MUT,
          fontSize: FS.micro,
          lineHeight: 1.45,
        }}>
          Same-seed unsaved sample <strong style={{ color: SEC }}>
            {sample.seed}
          </strong>: {materializedCount(sample, 'before')} custom entities before
          {' → '}{materializedCount(sample, 'after')} after.
        </div>
      )}
      {visible.length > 0 && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          marginTop: 7,
        }}>
          {visible.map(change => (
            <div
              key={change.definitionId}
              style={{ color: MUT, fontSize: FS.micro }}
            >
              <strong style={{ color: SEC }}>{change.change}</strong>
              {' · '}{change.category} · {change.definitionId}
            </div>
          ))}
          {changes.length > visible.length && (
            <span style={{ color: MUT, fontSize: FS.micro }}>
              {changes.length - visible.length} additional definition changes
            </span>
          )}
        </div>
      )}
      <div style={{
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
        marginTop: 8,
      }}>
        <Button
          variant="ai"
          size="sm"
          busy={busy}
          disabled={busy}
          onClick={onConfirm}
        >
          Apply reviewed campaign binding
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

export default function CampaignContentBindingLifecycle() {
  const activeCampaignId = useStore(state => state.activeCampaignId);
  const campaign = useStore(state => (
    (state.campaigns || []).find(candidate => (
      String(candidate?.id) === String(state.activeCampaignId)
    )) || null
  ));
  const previewMigration = useStore(
    state => state.previewCampaignContentBindingMigration,
  );
  const previewRollback = useStore(
    state => state.previewCampaignContentBindingRollback,
  );
  const applyMigration = useStore(
    state => state.applyCampaignContentBindingMigration,
  );
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [review, setReview] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (!activeCampaignId || !campaign?.contentBinding) return null;

  const beginReview = async (targetHash = null) => {
    setBusy(true);
    setReview(null);
    setMessage(null);
    setError(null);
    try {
      const next = targetHash
        ? await previewRollback?.(campaign.id, targetHash)
        : await previewMigration?.(campaign.id);
      if (!next?.ok) {
        setError(
          next?.reason === 'campaign_content_binding_already_active'
            ? 'This campaign already uses the active account environment.'
            : next?.message || next?.reason
              || 'The campaign content change could not be reviewed.',
        );
        return;
      }
      setReview(next);
    } catch (previewError) {
      setError(
        previewError instanceof Error
          ? previewError.message
          : 'The campaign content change could not be reviewed.',
      );
    } finally {
      setBusy(false);
    }
  };

  const applyReview = async () => {
    if (!review || busy) return;
    setBusy(true);
    setMessage(null);
    setError(null);
    try {
      const receipt = await applyMigration?.(campaign.id, review);
      if (
        !receipt?.ok
        || receipt.status !== 'applied'
        || receipt.persistence?.state !== 'confirmed'
      ) {
        setError(
          receipt?.reason === 'campaign_content_binding_conflict'
            ? 'Another tab or device changed this campaign binding first. '
              + 'The remote binding is now loaded; forge a new review before applying.'
            : receipt?.reason === 'campaign_content_persistence_unknown'
              ? 'Cloud confirmation was interrupted. Retry this exact review; '
                + 'the command is idempotent and will not overwrite a newer binding.'
              : receipt?.status === 'stale'
                ? 'The campaign binding changed after review. Forge a new review before applying.'
            : receipt?.message || receipt?.reason
              || 'The campaign binding was not durably confirmed.',
        );
        return;
      }
      setReview(null);
      setMessage(
        review.plan.kind === 'campaign.content-binding.rollback'
          ? 'The prior immutable binding is active as a new forward campaign revision.'
          : 'The reviewed account environment is now pinned to this campaign.',
      );
    } catch (applyError) {
      setError(
        applyError instanceof Error
          ? applyError.message
          : 'The campaign binding could not be persisted.',
      );
    } finally {
      setBusy(false);
    }
  };

  const historical = (campaign.contentBindingHistory || []).filter(binding => (
    binding.bindingHash !== campaign.contentBinding.bindingHash
  ));

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
          Active campaign content
        </span>
        <span style={{ color: SEC, fontSize: FS.xs }}>
          <strong>{campaign.contentBinding.resolvedDefinitions.length}</strong>{' '}
          pinned definitions · {compactHash(campaign.contentBinding.bindingHash)}
        </span>
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={open}
          aria-controls="campaign-content-binding-history"
          onClick={() => {
            setOpen(value => !value);
            setReview(null);
            setMessage(null);
            setError(null);
          }}
          style={{ marginLeft: 'auto' }}
        >
          {open ? 'Hide campaign revisions' : 'Manage campaign content'}
        </Button>
      </div>
      {open && (
        <div id="campaign-content-binding-history" style={{ marginTop: 8 }}>
          <div style={{
            color: MUT,
            fontSize: FS.micro,
            lineHeight: 1.5,
          }}>
            Campaign simulation reads only this portable cutoff. Migrating never
            follows future library edits; rollback activates an earlier snapshot
            without rewriting history.
          </div>
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={() => beginReview()}
            style={{ marginTop: 8 }}
          >
            Review active account environment
          </Button>
          {historical.length > 0 && (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              marginTop: 8,
            }}>
              {historical.map(binding => (
                <BindingRow
                  key={binding.bindingHash}
                  binding={binding}
                  onReview={beginReview}
                />
              ))}
            </div>
          )}
          <ReviewPanel
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
