import { useCallback, useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

import {
  addGalleryComment,
  deleteGalleryComment,
  fetchGalleryComments,
} from '../../lib/gallery.js';
import {
  BODY,
  BORDER,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  INK,
  MUTED,
  R,
  RED,
  RED_BG,
  SP,
  sans,
  serif_,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import { formatDate } from './galleryUtils.js';

export default function GalleryComments({ dossier, auth, onCountChange }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
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
      await reload();
    } catch (err) {
      setError(err?.message || 'Comment could not be deleted.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section style={{ display: 'grid', gap: SP.md }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <MessageCircle size={16} color={GOLD} />
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
              borderRadius: R.md,
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
        <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.md, padding: SP.md, color: BODY, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
          Sign in to comment. Anyone can read the discussion.
        </div>
      )}
      {error && (
        <div style={{ border: `1px solid ${RED}`, borderRadius: R.md, background: RED_BG, color: RED, padding: SP.sm, fontFamily: sans, fontSize: FS.xs, fontWeight: 850 }}>
          {error}
        </div>
      )}
      <div style={{ display: 'grid', gap: 8 }}>
        {comments.length === 0 ? (
          <div style={{ border: `1px dashed ${BORDER}`, borderRadius: R.md, padding: SP.md, color: MUTED, fontFamily: sans, fontSize: FS.sm, background: CARD_ALT }}>
            No comments yet.
          </div>
        ) : comments.map(comment => (
          <article key={comment.id} style={{ border: `1px solid ${BORDER}`, borderRadius: R.md, background: CARD, padding: SP.md, display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 950 }}>
                {comment.authorLabel}
              </span>
              <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 750 }}>
                {formatDate(comment.createdAt)}
              </span>
              {comment.canDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => remove(comment.id)}
                  disabled={busy}
                  style={{ marginLeft: 'auto' }}
                >
                  Delete
                </Button>
              )}
            </div>
            <p style={{ margin: 0, color: BODY, fontFamily: sans, fontSize: FS.sm, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
              {comment.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
