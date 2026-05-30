/**
 * ShareToGallery.jsx — Publish / unpublish a saved settlement.
 *
 * Mounts in the dossier toolbar for owned, persisted settlements. When
 * the dossier hasn't been saved yet, the button shows a soft-disabled
 * "save first" hint. Once published, swaps to an "unshare" affordance
 * plus a copyable /gallery/{slug} link.
 *
 * Visibility:
 *   - Hidden for anonymous users (they have no saved row to publish).
 *   - Hidden in readOnly mode (PublicDossierView, etc.).
 *
 * The slug + is_public state is round-tripped to the server via the
 * helpers in src/lib/gallery.js — this component owns no truth.
 */

import { useState } from 'react';
import { Globe, Lock, Copy, Check, AlertCircle } from 'lucide-react';
import { useStore } from '../store/index.js';
import { publishSettlement, unpublishSettlement } from '../lib/gallery.js';
import { GOLD, BORDER, sans, SP, R, FS, GREEN, RED } from './theme.js';

const MUTED = '#6b5340';
const _BODY  = '#4A3B22';

function publicUrlFor(slug) {
  if (typeof window === 'undefined') return `/gallery/${slug}`;
  return `${window.location.origin}/?view=gallery&slug=${slug}`;
}

export default function ShareToGallery({ saveId, isPublic: isPublicProp, publicSlug: slugProp }) {
  const auth = useStore(s => s.auth);
  const updateSavedSettlement = useStore(s => s.updateSavedSettlement);

  const [isPublic, setIsPublic] = useState(Boolean(isPublicProp));
  const [slug, setSlug]         = useState(slugProp || null);
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState(null);
  const [copied, setCopied]     = useState(false);

  if (!auth?.user) return null;
  if (!saveId) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderRadius: R.md,
        background: 'transparent', color: MUTED,
        fontSize: FS.xs, fontFamily: sans, fontStyle: 'italic',
      }}>
        <Lock size={12} /> Save first to share publicly
      </div>
    );
  }

  async function handlePublish() {
    setBusy(true); setError(null);
    try {
      const newSlug = await publishSettlement(saveId);
      setSlug(newSlug);
      setIsPublic(true);
      // Best-effort: update the cached saved-settlement row so other
      // surfaces (Settlements panel, AccountPage) see the new state
      // without a refetch. updateSavedSettlement may not be defined
      // in older builds — fall through silently if so.
      try {
        updateSavedSettlement?.(saveId, { is_public: true, public_slug: newSlug });
      } catch { /* non-fatal */ }
    } catch (e) {
      setError(e.message || 'Publish failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleUnpublish() {
    setBusy(true); setError(null);
    try {
      await unpublishSettlement(saveId);
      setIsPublic(false);
      try {
        updateSavedSettlement?.(saveId, { is_public: false });
      } catch { /* non-fatal */ }
    } catch (e) {
      setError(e.message || 'Unpublish failed');
    } finally {
      setBusy(false);
    }
  }

  function handleCopy() {
    if (!slug || typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(publicUrlFor(slug))
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => { /* clipboard refused; nothing to do */ });
  }

  // Published state — show "Public" badge + copy link + unshare.
  if (isPublic && slug) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: SP.sm,
        flexWrap: 'wrap', fontFamily: sans,
      }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 9px', borderRadius: R.md,
          background: 'rgba(74,122,58,0.10)', color: GREEN,
          border: '1px solid rgba(74,122,58,0.30)',
          fontSize: FS.xs, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          <Globe size={11} /> Public
        </span>
        <button
          type="button"
          onClick={handleCopy}
          title="Copy public URL"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 9px', borderRadius: R.md,
            background: 'transparent', color: GOLD,
            border: `1px solid ${GOLD}`,
            fontSize: FS.xs, fontFamily: sans, cursor: 'pointer',
          }}
        >
          {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy link</>}
        </button>
        <button
          type="button"
          onClick={handleUnpublish}
          disabled={busy}
          style={{
            padding: '4px 9px', borderRadius: R.md,
            background: 'transparent', color: MUTED,
            border: `1px solid ${BORDER}`,
            fontSize: FS.xs, fontFamily: sans, cursor: 'pointer',
            opacity: busy ? 0.6 : 1,
          }}
        >
          {busy ? 'Working…' : 'Unshare'}
        </button>
        {error && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: FS.xs, color: RED,
          }}>
            <AlertCircle size={11} /> {error}
          </span>
        )}
      </div>
    );
  }

  // Private state — publish button.
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: SP.sm,
      flexWrap: 'wrap', fontFamily: sans,
    }}>
      <button
        type="button"
        onClick={handlePublish}
        disabled={busy}
        title="Make this dossier readable to anyone with the link"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: R.md,
          background: 'transparent', color: GOLD,
          border: `1px solid ${GOLD}`,
          fontSize: FS.xs, fontFamily: sans, fontWeight: 700,
          cursor: busy ? 'wait' : 'pointer',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <Globe size={12} /> {busy ? 'Publishing…' : 'Share to gallery'}
      </button>
      {error && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: FS.xs, color: RED,
        }}>
          <AlertCircle size={11} /> {error}
        </span>
      )}
      <span style={{
        fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
      }}>
        Public dossiers appear in the gallery. Your name and email stay private.
      </span>
    </div>
  );
}
