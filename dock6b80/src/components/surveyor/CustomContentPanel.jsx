/**
 * Surveyor Content Studio — controlled compilation of homebrew intent.
 *
 * The provider proposes; the canonical manifest interprets; the deterministic
 * engine previews; the application-command boundary lands immutable revisions.
 * Those authorities stay visibly separate throughout:
 *
 *   Describe → Inspect → Effects → Sample → Revise → Approve → Receipt
 *
 * The transport, preview worker, and command implementation are all reached
 * lazily from this already-lazy panel. Nothing here grants the provider a field,
 * simulation rule, or persistence capability.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useStore } from '../../store/index.js';
import { getSurveyorAiCost } from '../../config/pricing.js';
import {
  CONTENT_STUDIO_STAGE,
  CONTENT_STUDIO_STATUS,
  contentDraftProgress,
  createContentDraftSession,
  reduceContentDraftSession,
} from '../../domain/content/contentDraftSession.js';
import { projectContentEffects } from '../../domain/content/contentEffectProjection.js';
import { reviewContentDraft } from '../../domain/content/contentReview.js';
import { fingerprintContent } from '../../domain/content/contentFingerprint.js';
import { BORDER, MUTED, GREEN, FS, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { useSurveyorContext } from './useSurveyorContext.js';
import {
  MoneyLine,
  RefusalNote,
  MusingsBlock,
  FieldLabelBadge,
  Eyebrow,
  PromptArea,
  ProposalSlipLine,
} from './surveyorPanelKit.jsx';
import ContentDraftEntry from '../contentStudio/ContentDraftEntry.jsx';
import ContentInterpretation from '../contentStudio/ContentInterpretation.jsx';
import ContentSampleReceipt from '../contentStudio/ContentSampleReceipt.jsx';

function progressLabel(session) {
  const progress = contentDraftProgress(session);
  return `Content Studio step ${progress.current} of ${progress.total}: ${progress.stage}`;
}

export default function CustomContentPanel({ initialPrompt = '' }) {
  // Resolved per render, not once at import: the price becomes per-user the moment
  // the owner activates the capability-tier multiplier (config/pricing.js). A plain
  // number, so re-resolving costs nothing and cannot churn a memo.
  const cost = getSurveyorAiCost('customContent');
  const { creditBalance, ctx } = useSurveyorContext();
  // Preview the content actually active in the current environment. The author
  // library can contain newer heads or definitions deliberately excluded from
  // a pinned campaign, so using it here would misstate the sample's baseline.
  const previewBaseContent = useStore((state) => (
    state.activeContentEnvironmentContent ?? state.customContent ?? {}
  ));
  const previewBaselineFingerprint = useMemo(
    () => fingerprintContent(previewBaseContent),
    [previewBaseContent],
  );
  const applyCustomContentCommand = useStore((state) => state.applyCustomContentCommand);

  const [session, dispatch] = useReducer(
    reduceContentDraftSession,
    { intent: initialPrompt, source: 'surveyor' },
    createContentDraftSession,
  );
  const [responseMeta, setResponseMeta] = useState(null);
  const resultRef = useRef(null);
  const receiptRef = useRef(null);
  const previewAbortRef = useRef(null);
  const previewBaselineRef = useRef(previewBaselineFingerprint);

  const draft = session.draft;
  const entries = Array.isArray(draft?.entries) ? draft.entries : [];
  const unsupported = Array.isArray(draft?.unsupported) ? draft.unsupported : [];
  const review = useMemo(
    () => reviewContentDraft(draft, session.decisions),
    [draft, session.decisions],
  );
  const invalidReviewed = review.rejected.filter(
    (entry) => entry.reason === 'invalid_entry',
  );
  const anyApproved = review.accepted.length > 0;
  const interpretation = useMemo(
    () => (draft ? projectContentEffects(draft, session.decisions) : null),
    [draft, session.decisions],
  );

  useEffect(() => () => previewAbortRef.current?.abort(), []);
  useEffect(() => {
    if (previewBaselineRef.current === previewBaselineFingerprint) return;
    previewBaselineRef.current = previewBaselineFingerprint;
    previewAbortRef.current?.abort();
    dispatch({ type: 'baseline.changed' });
  }, [previewBaselineFingerprint]);
  useEffect(() => {
    if (session.stage === CONTENT_STUDIO_STAGE.INSPECT) resultRef.current?.focus();
    if (session.stage === CONTENT_STUDIO_STAGE.RECEIPT) receiptRef.current?.focus();
  }, [session.stage]);

  const compile = useCallback(async () => {
    const intent = session.intent.trim();
    if (!intent || session.status === CONTENT_STUDIO_STATUS.WORKING) return;
    previewAbortRef.current?.abort();
    dispatch({ type: 'compile.started' });
    setResponseMeta(null);
    try {
      const { compileCustomContent } = await import('../../lib/surveyorWrite.js');
      const result = await compileCustomContent({ ...ctx, intent });
      if (!result.ok) {
        setResponseMeta(result);
        dispatch({ type: 'compile.failed', error: result.error });
        return;
      }
      setResponseMeta(result);
      dispatch({ type: 'compile.succeeded', draft: result.draft });
    } catch {
      dispatch({
        type: 'compile.failed',
        error: 'The Surveyor is unavailable right now.',
      });
    }
  }, [ctx, session.intent, session.status]);

  const decide = useCallback((index, decision) => {
    dispatch({ type: 'decision.changed', index, decision });
  }, []);

  const inspectEffects = useCallback(() => {
    if (!interpretation) return;
    dispatch({ type: 'effects.viewed', interpretation });
  }, [interpretation]);

  const forgeSample = useCallback(async () => {
    const canStartSample = session.stage === CONTENT_STUDIO_STAGE.EFFECTS
      || (
        session.stage === CONTENT_STUDIO_STAGE.SAMPLE
        && session.status === CONTENT_STUDIO_STATUS.FAILED
      );
    if (
      !draft
      || !interpretation
      || !session.interpretation
      || !canStartSample
    ) {
      return;
    }
    const controller = new AbortController();
    previewAbortRef.current?.abort();
    previewAbortRef.current = controller;
    dispatch({ type: 'sample.started' });
    try {
      const { runCustomContentPreview } = await import('../../lib/customContentPreviewClient.js');
      const sample = await runCustomContentPreview({
        seed: 'custom-content-taste-gate-v1',
        baseContent: previewBaseContent,
        accepted: review.accepted,
      }, { signal: controller.signal });
      dispatch({ type: 'sample.succeeded', sample });
    } catch (error) {
      if (error?.name === 'AbortError') return;
      dispatch({
        type: 'sample.failed',
        error: error instanceof Error
          ? error.message
          : 'The sample settlement could not be forged.',
      });
    } finally {
      if (previewAbortRef.current === controller) previewAbortRef.current = null;
    }
  }, [
    draft,
    interpretation,
    previewBaseContent,
    review,
    session.interpretation,
    session.stage,
    session.status,
  ]);

  const reviewApproval = useCallback(() => {
    dispatch({ type: 'approval.reviewed' });
  }, []);

  const applyApproved = useCallback(async () => {
    if (
      !draft
      || !interpretation
      || session.stage !== CONTENT_STUDIO_STAGE.APPROVE
      || session.status === CONTENT_STUDIO_STATUS.WORKING
    ) {
      return;
    }
    const { accepted } = review;
    if (accepted.length === 0) return;
    dispatch({ type: 'approval.started' });

    let receipt;
    if (typeof applyCustomContentCommand !== 'function') {
      receipt = {
        ok: false,
        status: 'failed',
        persistence: { state: 'not-required' },
        reason: 'The immutable content writer is unavailable. Nothing was changed.',
      };
    } else {
      try {
        receipt = await applyCustomContentCommand({
          kind: 'content.definition.create-revision',
          entries: accepted.map((candidate) => ({
            category: candidate.bucket,
            item: candidate.entry,
          })),
          source: {
            type: 'surveyor',
            ref: responseMeta?.summary?.requestId || null,
            pack: null,
          },
          expected: {},
        });
      } catch (error) {
        // Once a command crosses the writer boundary, a transport exception
        // cannot prove whether the authority applied it. Preserve that
        // ambiguity and direct the author toward reconciliation instead of
        // retrying a mutation that may already exist.
        receipt = {
          ok: false,
          status: 'reconcile-required',
          persistence: { state: 'unconfirmed' },
          reason: error instanceof Error
            ? error.message
            : 'Command confirmation was interrupted.',
        };
      }
    }
    dispatch({ type: 'approval.received', receipt });
  }, [
    applyCustomContentCommand,
    draft,
    interpretation,
    review,
    responseMeta,
    session.stage,
    session.status,
  ]);

  const applied = session.receipt;
  const appliedConfirmed = applied?.ok === true
    && applied.status === 'applied'
    && applied.persistence?.state === 'confirmed';
  const landed = Number(
    applied?.result?.landed
    ?? applied?.result?.created
    ?? applied?.perEntry?.filter?.((entry) => entry.ok !== false).length
    ?? 0,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
      <div
        role="status"
        aria-live="polite"
        style={{ fontSize: FS.micro, color: MUTED, fontFamily: sans }}
      >
        {progressLabel(session)}
      </div>

      <Eyebrow>Homebrew content: describe what you want</Eyebrow>
      <PromptArea
        value={session.intent}
        onChange={(intent) => dispatch({ type: 'intent.changed', intent })}
        label="Describe the custom content you want the Surveyor to draft"
        placeholder="e.g. a haunted glassworks controlled by a forbidden guild…"
        disabled={session.status === CONTENT_STUDIO_STATUS.WORKING}
      />
      <MoneyLine
        cost={cost}
        creditBalance={creditBalance}
        busy={session.stage === CONTENT_STUDIO_STAGE.DESCRIBE
          && session.status === CONTENT_STUDIO_STATUS.WORKING}
        disabled={!session.intent.trim()}
        onSubmit={compile}
        submitLabel={draft ? 'Compile revision' : 'Draft it'}
        busyLabel="Drafting…"
      />

      {session.error && session.stage === CONTENT_STUDIO_STAGE.DESCRIBE && (
        <RefusalNote
          error={session.error}
          refusalClass={responseMeta?.refusalClass}
          doors={responseMeta?.doors}
        />
      )}
      {responseMeta?.usageWarning && (
        <div role="status" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          {String(responseMeta.usageWarning)}
        </div>
      )}
      <MusingsBlock musings={responseMeta?.musings} />

      {draft && (
        <section
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="content-review-title"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: SP.sm,
            borderTop: `1px solid ${BORDER}`,
            paddingTop: SP.sm,
            outline: 'none',
          }}
        >
          <Eyebrow>
            <span id="content-review-title">Inspect each entry · approve, edit, or reject</span>
          </Eyebrow>
          <ProposalSlipLine />
          {entries.length === 0 && (
            <p style={{ margin: 0, fontSize: FS.sm, color: MUTED }}>
              Nothing mapped to a registered content type.
            </p>
          )}
          {entries.map((entry, index) => (
            <ContentDraftEntry
              key={`${entry.bucket || 'entry'}:${index}`}
              entry={entry}
              index={index}
              decision={session.decisions[index]}
              onDecide={decide}
            />
          ))}

          {invalidReviewed.length > 0 && (
            <div
              role="alert"
              data-testid="content-invalid-reviewed"
              style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.45 }}
            >
              {invalidReviewed.length === 1 ? 'One reviewed entry no longer' : `${invalidReviewed.length} reviewed entries no longer`}{' '}
              pass the registered content schema. Correct or reject
              {invalidReviewed.length === 1 ? ' it' : ' them'} before approval;
              invalid entries will not enter the sample or writer command.
            </div>
          )}

          {unsupported.length > 0 && (
            <div
              data-testid="content-unsupported"
              style={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              <Eyebrow>Asked for, but the engine has no registered rule</Eyebrow>
              {unsupported.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
                  <FieldLabelBadge kind="unsupported" />
                  <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
                    {String(entry.requested ?? entry.field ?? entry.key ?? 'unknown')}
                    {entry.reason ? `: ${entry.reason}` : ''}
                  </span>
                </div>
              ))}
            </div>
          )}

          <ContentInterpretation interpretation={interpretation} />

          <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap' }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={!anyApproved}
              onClick={inspectEffects}
            >
              Inspect effect map
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={
                !anyApproved
                || !session.interpretation
                || !(
                  session.stage === CONTENT_STUDIO_STAGE.EFFECTS
                  || (
                    session.stage === CONTENT_STUDIO_STAGE.SAMPLE
                    && session.status === CONTENT_STUDIO_STATUS.FAILED
                  )
                )
                || session.status === CONTENT_STUDIO_STATUS.WORKING
              }
              busy={session.stage === CONTENT_STUDIO_STAGE.SAMPLE
                && session.status === CONTENT_STUDIO_STATUS.WORKING}
              onClick={forgeSample}
            >
              Forge unsaved sample
            </Button>
          </div>

          {session.error && session.stage === CONTENT_STUDIO_STAGE.SAMPLE && (
            <div role="alert" style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
              {session.error}
            </div>
          )}
          <ContentSampleReceipt sample={session.sample} />

          {session.stage !== CONTENT_STUDIO_STAGE.APPROVE
            && session.stage !== CONTENT_STUDIO_STAGE.RECEIPT && (
            <Button
              variant="primary"
              size="sm"
              disabled={
                !anyApproved
                || session.stage !== CONTENT_STUDIO_STAGE.REVISE
                || !session.sample
              }
              onClick={reviewApproval}
            >
              Review approval
            </Button>
          )}
          {session.stage === CONTENT_STUDIO_STAGE.APPROVE && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xs }}>
              <div style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.45 }}>
                Approval creates immutable definition revisions. Future edits create
                new revisions; pinned campaigns keep the version they reviewed.
              </div>
              <Button
                variant="primary"
                size="sm"
                busy={session.status === CONTENT_STUDIO_STATUS.WORKING}
                disabled={!anyApproved || session.status === CONTENT_STUDIO_STATUS.WORKING}
                onClick={applyApproved}
              >
                Add approved to my content
              </Button>
            </div>
          )}

          {applied && (
            <div
              ref={receiptRef}
              tabIndex={-1}
              role={appliedConfirmed ? 'status' : 'alert'}
              aria-live="polite"
              data-testid="content-applied"
              style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, lineHeight: 1.5, outline: 'none' }}
            >
              <span style={{ color: appliedConfirmed ? GREEN : MUTED }}>◆</span>{' '}
              {!appliedConfirmed
                ? applied.status === 'reconcile-required'
                  ? `Commit confirmation was interrupted: ${
                    applied.reason || 'reconcile before retrying'
                  }`
                  : `Content was not committed: ${applied.reason || applied.status}`
                : `Added ${landed} immutable revision${landed === 1 ? '' : 's'} to your content`}
              {applied.commandId && <span> · command {applied.commandId}</span>}
              {applied.persistence?.state && <span> · {applied.persistence.state}</span>}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
