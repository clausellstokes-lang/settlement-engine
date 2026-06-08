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

import { useMemo, useState } from 'react';
import { Globe, Lock, Copy, Check, AlertCircle, Image as ImageIcon, Save } from 'lucide-react';
import { useStore } from '../store/index.js';
import { publishSettlement, unpublishSettlement, updateGalleryMetadata } from '../lib/gallery.js';
import { validateDossier } from '../domain/validation/consistency.js';
import { GOLD, BORDER, BORDER2, CARD, CARD_ALT, sans, SP, R, FS, GREEN, RED, INK, BODY } from './theme.js';

const MUTED = '#6b5340';
const _BODY  = '#4A3B22';

function publicUrlFor(slug) {
  const path = `/gallery?slug=${encodeURIComponent(slug)}`;
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}

function isCampaignCanonized(campaignState) {
  if (!campaignState) return true;
  return Boolean(
    campaignState.phase === 'canon' ||
    campaignState.canonizedAt ||
    campaignState.worldState?.canonizedAt
  );
}

function suggestedTagsFor(settlement = {}) {
  return [
    settlement.tier,
    settlement.config?.terrain,
    settlement.config?.magicLevel ? `${settlement.config.magicLevel} magic` : null,
    settlement.powerStructure?.governmentType,
    settlement.viability?.stability,
    settlement.config?.nearbyResources?.[0],
  ].filter(Boolean).slice(0, 6);
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 4, minWidth: 0 }}>
      <span style={{ color: INK, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>
      {children}
    </label>
  );
}

export default function ShareToGallery({
  saveId,
  isPublic: isPublicProp,
  publicSlug: slugProp,
  campaignState = null,
  settlement = null,
  galleryDescription = '',
  galleryImageUrl = '',
  galleryImageAlt = '',
  galleryTags = [],
  galleryShareNarrated = false,
}) {
  const auth = useStore(s => s.auth);
  const updateSavedSettlement = useStore(s => s.updateSavedSettlement);
  // The public gallery strips every AI overlay (sanitizePublicSettlement in
  // lib/gallery.js), so a published dossier is always the RAW simulation. Read
  // the save's AI data so we can say plainly when the prose won't be included.
  const liveAiData = useStore(s => (saveId ? (s.savedSettlements || []).find(x => x.id === saveId)?.aiData : null));

  const [isPublic, setIsPublic] = useState(Boolean(isPublicProp));
  const [slug, setSlug]         = useState(slugProp || null);
  const [detailsOpen, setDetailsOpen] = useState(!isPublicProp);
  const [description, setDescription] = useState(galleryDescription || '');
  const [imageUrl, setImageUrl] = useState(galleryImageUrl || '');
  const [imageAlt, setImageAlt] = useState(galleryImageAlt || '');
  const [tagsInput, setTagsInput] = useState((galleryTags?.length ? galleryTags : suggestedTagsFor(settlement)).join(', '));
  const [busy, setBusy]         = useState(false);
  const [error, setError]       = useState(null);
  const [copied, setCopied]     = useState(false);
  const [savedDetails, setSavedDetails] = useState(false);
  // Opt-in: publish the AI-narrated dossier instead of the raw simulation.
  const [shareNarrated, setShareNarrated] = useState(Boolean(galleryShareNarrated));
  const canonReady = isCampaignCanonized(campaignState);
  const metadata = useMemo(() => ({
    description,
    imageUrl,
    imageAlt,
    tags: tagsInput,
    shareNarrated,
  }), [description, imageAlt, imageUrl, tagsInput, shareNarrated]);

  const hasNarrative = !!(liveAiData?.aiSettlement) || liveAiData?.narrativeMode === 'narrated';
  const hasDailyLife = !!(liveAiData?.aiDailyLife);
  const aiKinds = [hasNarrative && 'narrative', hasDailyLife && 'daily-life'].filter(Boolean).join(' and ');
  // Shown when an AI overlay exists, so the user knows the gallery publishes
  // the raw simulation, not the narrated version.
  const aiOverlayNote = aiKinds ? (
    <div style={{
      width: '100%', display: 'flex', alignItems: 'flex-start', gap: 6,
      padding: '7px 9px', marginTop: SP.xs,
      border: `1px solid ${BORDER2}`, borderRadius: R.md,
      background: CARD_ALT, color: BODY,
      fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45,
    }}>
      {shareNarrated && hasNarrative
        ? <Globe size={12} style={{ marginTop: 1, flexShrink: 0, color: GREEN }} />
        : <Lock size={12} style={{ marginTop: 1, flexShrink: 0, color: MUTED }} />}
      <span>
        {shareNarrated && hasNarrative
          ? <>The gallery will show your <strong>AI-narrated dossier</strong>. Viewers see the refined prose; DM-private content (secrets, hooks, notes) is still removed.</>
          : <>The gallery shows the <strong>raw simulation</strong>. Your AI {aiKinds} prose stays private and is not included in the public dossier.</>}
      </span>
    </div>
  ) : null;

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
    if (!canonReady) {
      setError('Canonize the campaign world before sharing this dossier publicly.');
      return;
    }
    // Trust gate (feature doc §1b): never publish a dossier whose facts
    // contradict across surfaces — public content must be internally consistent.
    const { blocking } = validateDossier(settlement);
    if (blocking.length > 0) {
      setError(`Can't publish yet — ${blocking.length} consistency issue${blocking.length === 1 ? '' : 's'} to resolve: ${blocking.map(b => b.description).join(' · ')}`);
      return;
    }
    setBusy(true); setError(null);
    try {
      const newSlug = await publishSettlement(saveId, metadata);
      setSlug(newSlug);
      setIsPublic(true);
      // Best-effort: update the cached saved-settlement row so other
      // surfaces (Settlements panel, AccountPage) see the new state
      // without a refetch. updateSavedSettlement may not be defined
      // in older builds — fall through silently if so.
      try {
        updateSavedSettlement?.(saveId, {
          is_public: true,
          public_slug: newSlug,
          gallery_description: description,
          gallery_image_url: imageUrl,
          gallery_image_alt: imageAlt,
          gallery_tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
        });
      } catch { /* non-fatal */ }
    } catch (e) {
      setError(e.message || 'Publish failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveDetails() {
    if (!saveId) return;
    setBusy(true);
    setError(null);
    setSavedDetails(false);
    try {
      await updateGalleryMetadata(saveId, metadata);
      updateSavedSettlement?.(saveId, {
        gallery_description: description,
        gallery_image_url: imageUrl,
        gallery_image_alt: imageAlt,
        gallery_tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
      });
      setSavedDetails(true);
      setTimeout(() => setSavedDetails(false), 1600);
    } catch (e) {
      setError(e.message || 'Gallery details could not be saved');
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

  const detailsForm = detailsOpen && (
    <div style={{
      width: '100%',
      display: 'grid',
      gap: SP.sm,
      padding: SP.sm,
      border: `1px solid ${BORDER2}`,
      borderRadius: R.md,
      background: CARD_ALT,
      marginTop: SP.xs,
    }}>
      {hasNarrative && (
        <label style={{
          display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer',
          padding: SP.sm, border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD,
        }}>
          <input
            type="checkbox"
            checked={shareNarrated}
            onChange={event => setShareNarrated(event.target.checked)}
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
            <strong style={{ color: INK }}>Publish the AI-narrated version</strong> instead of the raw simulation. Viewers see your refined prose; DM-private content is still stripped. Save details (or re-share) to apply.
          </span>
        </label>
      )}
      <Field label="Public description">
        <textarea
          value={description}
          onChange={event => setDescription(event.target.value)}
          rows={3}
          maxLength={1200}
          placeholder="A short public note for DMs browsing the gallery."
          style={{
            width: '100%',
            boxSizing: 'border-box',
            resize: 'vertical',
            border: `1px solid ${BORDER}`,
            borderRadius: R.md,
            background: CARD,
            color: INK,
            fontFamily: sans,
            fontSize: FS.xs,
            lineHeight: 1.45,
            padding: SP.sm,
          }}
        />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: SP.sm }}>
        <Field label="Image URL">
          <input
            value={imageUrl}
            onChange={event => setImageUrl(event.target.value)}
            placeholder="https://..."
            style={{
              minHeight: 32,
              border: `1px solid ${BORDER}`,
              borderRadius: R.md,
              background: CARD,
              color: INK,
              fontFamily: sans,
              fontSize: FS.xs,
              padding: '6px 8px',
            }}
          />
        </Field>
        <Field label="Image alt">
          <input
            value={imageAlt}
            onChange={event => setImageAlt(event.target.value)}
            placeholder={settlement?.name ? `Image for ${settlement.name}` : 'Image description'}
            style={{
              minHeight: 32,
              border: `1px solid ${BORDER}`,
              borderRadius: R.md,
              background: CARD,
              color: INK,
              fontFamily: sans,
              fontSize: FS.xs,
              padding: '6px 8px',
            }}
          />
        </Field>
      </div>
      <Field label="Gallery tags">
        <input
          value={tagsInput}
          onChange={event => setTagsInput(event.target.value)}
          placeholder="frontier, high magic, unstable"
          style={{
            minHeight: 32,
            border: `1px solid ${BORDER}`,
            borderRadius: R.md,
            background: CARD,
            color: INK,
            fontFamily: sans,
            fontSize: FS.xs,
            padding: '6px 8px',
          }}
        />
      </Field>
      {isPublic && (
        <button
          type="button"
          onClick={handleSaveDetails}
          disabled={busy}
          style={{
            justifySelf: 'start',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            minHeight: 30,
            padding: '5px 9px',
            border: `1px solid ${GOLD}`,
            borderRadius: R.md,
            background: CARD,
            color: GOLD,
            fontFamily: sans,
            fontSize: FS.xs,
            fontWeight: 850,
            cursor: busy ? 'wait' : 'pointer',
          }}
        >
          <Save size={12} /> {savedDetails ? 'Saved' : 'Save gallery details'}
        </button>
      )}
    </div>
  );

  // Published state — show "Public" badge + copy link + unshare.
  if (isPublic && slug) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        flexWrap: 'wrap', fontFamily: sans, width: '100%',
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
          onClick={() => setDetailsOpen(open => !open)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 9px', borderRadius: R.md,
            background: 'transparent', color: BODY,
            border: `1px solid ${BORDER}`,
            fontSize: FS.xs, fontFamily: sans, cursor: 'pointer',
          }}
        >
          <ImageIcon size={12} /> Gallery details
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
        {aiOverlayNote}
        {detailsForm}
      </div>
    );
  }

  // Private state — publish button.
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: SP.sm,
      flexWrap: 'wrap', fontFamily: sans, width: '100%',
    }}>
      <button
        type="button"
        onClick={handlePublish}
        disabled={busy || !canonReady}
        title="Make this dossier readable to anyone with the link"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: R.md,
          background: 'transparent', color: GOLD,
          border: `1px solid ${GOLD}`,
          fontSize: FS.xs, fontFamily: sans, fontWeight: 700,
          cursor: busy ? 'wait' : canonReady ? 'pointer' : 'not-allowed',
          opacity: busy || !canonReady ? 0.6 : 1,
        }}
      >
        <Globe size={12} /> {busy ? 'Publishing…' : 'Share to gallery'}
      </button>
      <button
        type="button"
        onClick={() => setDetailsOpen(open => !open)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 9px', borderRadius: R.md,
          background: 'transparent', color: BODY,
          border: `1px solid ${BORDER}`,
          fontSize: FS.xs, fontFamily: sans, cursor: 'pointer',
        }}
      >
        <ImageIcon size={12} /> Details
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
        {canonReady
          ? 'Public dossiers appear in the gallery. Your name and email stay private.'
          : 'Canonize this campaign world before sharing the dossier publicly.'}
      </span>
      {aiOverlayNote}
      {detailsForm}
    </div>
  );
}
