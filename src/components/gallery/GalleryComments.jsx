import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { supabase } from '../../lib/supabase.js';
import {
  addGalleryComment, deleteGalleryComment, fetchGalleryComments, } from '../../lib/gallery.js';
import {
  BODY, BORDER, CARD, CARD_ALT, FS, INK, MUTED, RED, RED_BG, SP, sans, serif_ } from '../theme.js';
import Button from '../primitives/Button.jsx';
import DeleteConfirmation from '../DeleteConfirmation.jsx';
import { formatDate, REPORT_REASON_OPTIONS } from './galleryUtils.js';

/**
 * CommentActions — the single per-comment overflow (kebab ⋮) menu that folds the
 * Report affordance (any signed-in reader) and the author's own Delete into one
 * consistent control (owner UI spec, Amendment 2a). E-I keyboard rules: the
 * trigger is a real button with an accessible name + aria-haspopup/expanded;
 * Escape and outside-click close it; the items are keyboard-reachable buttons.
 */
function CommentActions({ comment, canReport, onDelete, onReport }) {
  const [open, setOpen] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reason, setReason] = useState('unsafe_content');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const rootRef = useRef(null);
  const reasonId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open]);

  if (!canReport && !comment.canDelete) return null;

  const field = { border: `1px solid ${BORDER}`, background: CARD_ALT, color: INK, fontFamily: sans, fontSize: FS.sm, padding: '6px 8px' };

  const submitReport = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true); setErr(null);
    try { await onReport(comment.id, reason, body); setReporting(false); setBody(''); }
    catch (e2) { setErr(e2?.message || 'Report could not be sent.'); }
    finally { setBusy(false); }
  };

  return (
    <div ref={rootRef} style={{ marginLeft: 'auto', position: 'relative' }}>
      {/* Glyph trigger (no lucide import — a new eager icon would breach the
          razor-thin first-paint closure budget). Button keeps a11y + focus ring. */}
      <Button
        variant="ghost"
        size="sm"
        aria-label="Comment options"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => { setOpen(o => !o); setReporting(false); }}
        style={{ minHeight: 44, minWidth: 44, color: MUTED, fontSize: FS.lg, lineHeight: 1, padding: 0 }}
      >
        <span aria-hidden="true">⋮</span>
      </Button>
      {open && (
        <div role="menu" aria-label="Comment options" style={{ position: 'absolute', right: 0, top: '100%', zIndex: 5, background: CARD, border: `1px solid ${BORDER}`, minWidth: 150, display: 'grid' }}>
          {canReport && (
            <Button variant="ghost" size="sm" role="menuitem" fullWidth
              style={{ justifyContent: 'flex-start', borderRadius: 0 }}
              onClick={() => { setOpen(false); setReporting(true); }}>
              Report
            </Button>
          )}
          {comment.canDelete && (
            <Button variant="ghost" size="sm" role="menuitem" fullWidth
              style={{ justifyContent: 'flex-start', borderRadius: 0, color: RED }}
              onClick={() => { setOpen(false); onDelete(comment.id); }}>
              Delete
            </Button>
          )}
        </div>
      )}
      {reporting && (
        <form onSubmit={submitReport} style={{ position: 'absolute', right: 0, top: '100%', zIndex: 6, background: CARD, border: `1px solid ${BORDER}`, padding: SP.sm, width: 260, display: 'grid', gap: SP.sm }}>
          {/* eslint-disable-next-line jsx-a11y/label-has-for -- associated via htmlFor/id */}
          <label htmlFor={reasonId} style={{ fontSize: FS.xs, fontWeight: 900, color: INK, fontFamily: sans }}>Reason</label>
          <select id={reasonId} value={reason} onChange={e => setReason(e.target.value)} style={field}>
            {REPORT_REASON_OPTIONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
          </select>
          <textarea aria-label="Report notes" value={body} onChange={e => setBody(e.target.value)} rows={3} maxLength={2000}
            placeholder="Add context for the moderation queue" style={{ ...field, resize: 'vertical' }} />
          {err && <p role="alert" style={{ margin: 0, color: RED, fontSize: FS.xs, fontFamily: sans }}>{err}</p>}
          <div style={{ display: 'flex', gap: SP.sm, justifyContent: 'flex-end' }}>
            <Button variant="secondary" size="sm" onClick={() => setReporting(false)} disabled={busy}>Cancel</Button>
            <Button type="submit" variant="primary" size="sm" busy={busy}>Send report</Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function GalleryComments({ dossier, auth, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  // Which comment's inline delete-confirmation is open. A one-click danger
  // button on an irreversible action is the exact case DeleteConfirmation guards
  // everywhere else in the app (P10 / P11 cross-surface consistency).
  const [confirmingId, setConfirmingId] = useState(null);
  const dossierId = dossier?.id || null;

  const applyRows = useCallback((rows) => {
    setComments(rows);
    onCountChange?.(rows.length);
  }, [onCountChange]);

  const reload = useCallback(async () => {
    if (!dossierId) return;
    const rows = await fetchGalleryComments(dossierId);
    applyRows(rows);
  }, [applyRows, dossierId]);

  useEffect(() => {
    let cancelled = false;
    if (!dossierId) return () => {};
    fetchGalleryComments(dossierId).then(rows => {
      if (!cancelled) applyRows(rows);
    });
    return () => { cancelled = true; };
  }, [applyRows, dossierId]);

  const submit = async () => {
    if (!auth?.user || !commentText.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      await addGalleryComment(dossierId, commentText);
      setCommentText('');
      await reload();
    } catch (err) {
      setError(err?.message || 'Comment could not be posted.');
    } finally {
      setBusy(false);
    }
  };

  const remove = async (commentId) => {
    setBusy(true);
    setError(null);
    try {
      await deleteGalleryComment(commentId);
      setConfirmingId(null);
      await reload();
    } catch (err) {
      setError(err?.message || 'Comment could not be deleted.');
    } finally {
      setBusy(false);
    }
  };

  // Report a comment to the moderation queue (169 RPC, called inline — gallery.js
  // is at its line cap). Throws on failure so the kebab's report form surfaces it.
  const reportComment = useCallback(async (commentId, reason, body) => {
    const { error: rErr } = await supabase.rpc('report_gallery_comment', {
      target_comment_id: commentId, report_reason: reason, report_body: body,
    });
    if (rErr) throw new Error(rErr.message || 'Report failed');
  }, []);

  return (
    <section style={{ display: 'grid', gap: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <h2 style={{ margin: 0, color: INK, fontFamily: serif_, fontSize: FS.xl, fontWeight: 700 }}>
          Comments
        </h2>
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
          {comments.length}
        </span>
      </div>
      {auth?.user ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <textarea
            value={commentText}
            onChange={event => setCommentText(event.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="Add a public comment"
            aria-label="Add a public comment"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              resize: 'vertical',
              border: `1px solid ${BORDER}`,
              background: CARD,
              color: INK,
              fontFamily: sans,
              fontSize: FS.sm,
              lineHeight: 1.5,
              padding: SP.sm,
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="md"
              onClick={submit}
              busy={busy}
              disabled={busy || !commentText.trim()}
            >
              {busy ? 'Posting...' : 'Post comment'}
            </Button>
            <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xs, fontWeight: 750 }}>
              {commentText.length}/2000
            </span>
          </div>
        </div>
      ) : (
        <div style={{ border: `1px dashed ${BORDER}`, padding: SP.md, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
          Sign in to comment. Anyone can read the discussion.
        </div>
      )}
      {error && (
        <div style={{ border: `1px solid ${RED}`, background: RED_BG, color: RED, padding: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gap: 8 }}>
        {comments.length === 0 ? (
          <div style={{ border: `1px dashed ${BORDER}`, padding: SP.md, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
            No comments yet.
          </div>
        ) : comments.map(comment => (comment.moderated ? (
          // Moderation TOMBSTONE (172): stays in place; the original body + author
          // never reach the client. Distinct from an author delete (which is hidden).
          <article key={comment.id} aria-label="Removed comment" style={{ border: `1px dashed ${BORDER}`, background: CARD_ALT, padding: SP.md }}>
            <p style={{ margin: 0, color: MUTED, fontFamily: sans, fontSize: FS.sm, fontStyle: 'italic' }}>
              This comment was removed by moderation.
            </p>
          </article>
        ) : (
          <article key={comment.id} style={{ border: `1px solid ${BORDER}`, background: CARD, padding: SP.md, display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
                {comment.authorLabel}
              </span>
              {/* Date is read-content (a reader parses it), so BODY (AA), not the
                  chrome-only MUTED; de-emphasized by weight, not a sub-AA hue. */}
              <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xs, fontWeight: 600 }}>
                {formatDate(comment.createdAt)}
              </span>
              {confirmingId !== comment.id && (
                <CommentActions
                  comment={comment}
                  canReport={!!auth?.user}
                  onDelete={setConfirmingId}
                  onReport={reportComment}
                />
              )}
            </div>
            <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {comment.body}
            </p>
            {comment.canDelete && confirmingId === comment.id && (
              <DeleteConfirmation
                entityName="this comment"
                details="This permanently removes the comment from the public discussion."
                onConfirm={() => remove(comment.id)}
                onCancel={() => setConfirmingId(null)}
              />
            )}
          </article>
        )))}
      </div>
    </section>
  );
}
