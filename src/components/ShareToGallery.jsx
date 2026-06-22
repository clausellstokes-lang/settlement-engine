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
import { Globe, Copy, Check, Image as ImageIcon, Save } from 'lucide-react';
import { useStore } from '../store/index.js';
import { publishSettlement, unpublishSettlement, updateGalleryMetadata } from '../lib/gallery.js';
import { validateDossier } from '../domain/validation/consistency.js';
import { buildRealmArcSummary } from '../domain/display/realmArcSummary.js';
import GalleryDescriptionEditor from './GalleryDescriptionEditor.jsx';
import CoverImageField from './gallery/CoverImageField.jsx';
import Button from './primitives/Button.jsx';
import { BORDER, BORDER2, CARD, CARD_ALT, sans, SP, R, FS, GREEN, GREEN_BG, SUCCESS_BORDER, RED, INK, BODY, swatch } from './theme.js';

const MUTED = swatch['#6B5340'];
const _BODY  = swatch['#4A3B22'];

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

function Field({ label, htmlFor, children }) {
  return (
    // eslint-disable-next-line jsx-a11y/label-has-for -- generic wrapper; association is via the htmlFor prop wired at each call site, which the static rule can't verify.
    <label htmlFor={htmlFor} style={{ display: 'grid', gap: 4, minWidth: 0 }}>
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
  galleryShareDm = false,
  galleryImportable = false,
  onSaved = null,
}) {
  const auth = useStore(s => s.auth);
  const updateSavedSettlement = useStore(s => s.updateSavedSettlement);
  // The public gallery strips every AI overlay (sanitizePublicSettlement in
  // lib/gallery.js), so a published dossier is always the RAW simulation. Read
  // the save's AI data so we can say plainly when the prose won't be included.
  const liveAiData = useStore(s => (saveId ? (s.savedSettlements || []).find(x => x.id === saveId)?.aiData : null));
  // §S4 — the campaign this save belongs to, for the public-safe realm-arc digest.
  const owningCampaign = useStore(s => {
    if (!saveId) return null;
    return (s.campaigns || []).find(c => (c.settlementIds || []).map(String).includes(String(saveId))) || null;
  });
  const allSaves = useStore(s => s.savedSettlements);

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
  // Opt-in: publish the full DM view (secrets, hooks, notes, compass) unstripped.
  const [shareDm, setShareDm] = useState(Boolean(galleryShareDm));
  // Opt-in: let other users import (clone) this public dossier into their library.
  const [importable, setImportable] = useState(Boolean(galleryImportable));
  const canonReady = isCampaignCanonized(campaignState);
  // §S4 — derive the public-safe realm-arc digest from the owning campaign's LIVE
  // war/pantheon ledgers. Empty for a no-war/no-deity campaign (the field is then
  // omitted). This is a DERIVED scalar, never the raw chronicle.
  const realmArcSummary = useMemo(() => {
    if (!owningCampaign) return '';
    const ids = new Set((owningCampaign.settlementIds || []).map(String));
    const settlements = (allSaves || [])
      .filter(sv => ids.has(String(sv.id)))
      .map(sv => ({ id: sv.id, name: sv.name || sv.settlement?.name, settlement: sv.settlement }));
    return buildRealmArcSummary({
      worldState: owningCampaign.worldState,
      regionalGraph: owningCampaign.regionalGraph || owningCampaign.worldState?.regionalGraph,
      settlements,
    });
  }, [owningCampaign, allSaves]);
  const metadata = useMemo(() => ({
    description,
    imageUrl,
    imageAlt,
    tags: tagsInput,
    shareNarrated,
    shareDm,
    importable,
    realmArcSummary,
  }), [description, imageAlt, imageUrl, tagsInput, shareNarrated, shareDm, importable, realmArcSummary]);

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
      <span>
        {shareNarrated && hasNarrative
          ? <>The gallery displays your <strong>narrated dossier</strong>. Viewers read the refined prose. Private DM content (secrets, hooks, notes) remains hidden.</>
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
        Save the settlement first to share publicly.
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
      setError(`Cannot publish yet. ${blocking.length} consistency issue${blocking.length === 1 ? '' : 's'} to resolve: ${blocking.map(b => b.description).join(' · ')}`);
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
          gallery_share_dm: shareDm,
          gallery_share_narrated: shareNarrated,
          gallery_importable: importable,
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
      // Patch the cached save with EVERY field just persisted — including the two
      // share toggles, which were previously omitted. This keeps the cached save
      // truthful for the surfaces that re-render ShareToGallery straight from it
      // (OutputContainer / SettlementDetail) without waiting for a cloud refetch.
      // (This patch is NOT what fixed the disappearing gallery card — that card
      // gates on public_slug, which the Object.assign merge always preserves; the
      // reload below is what fixes it. This is plain cache hygiene.)
      updateSavedSettlement?.(saveId, {
        gallery_description: description,
        gallery_image_url: imageUrl,
        gallery_image_alt: imageAlt,
        gallery_tags: tagsInput.split(',').map(tag => tag.trim()).filter(Boolean),
        gallery_share_dm: shareDm,
        gallery_share_narrated: shareNarrated,
        gallery_importable: importable,
      });
      setSavedDetails(true);
      setTimeout(() => setSavedDetails(false), 1600);
      // Contextual refresh: only the gallery-detail owner card passes onSaved,
      // which re-fetches the public dossier in place so the live view reflects
      // the new narrated / DM-visibility choices. (A full page reload would land
      // on a fresh gallery URL with no saves hydrated, dropping the owner card —
      // see GalleryDetail.) The dossier/settlement editor usages omit onSaved.
      onSaved?.();
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
        <label htmlFor="share-to-gallery-narrated" style={{
          display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer',
          padding: SP.sm, border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD,
        }}>
          <input
            id="share-to-gallery-narrated"
            type="checkbox"
            aria-label="Publish the AI-narrated version"
            checked={shareNarrated}
            onChange={event => setShareNarrated(event.target.checked)}
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
            <strong style={{ color: INK }}>Publish the narrated version</strong> instead of the raw simulation. Viewers read your refined prose. Private DM content is removed unless you enable the option below. Save details or re-share to apply.
          </span>
        </label>
      )}
      {/* Owner opt-in: expose the full DM-private layer publicly. Off by default. */}
      <label htmlFor="share-to-gallery-dm" style={{
        display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer',
        padding: SP.sm, border: `1px solid ${shareDm ? RED : BORDER2}`, borderRadius: R.md, background: CARD,
      }}>
        <input
          id="share-to-gallery-dm"
          type="checkbox"
          aria-label="Reveal DM-private content"
          checked={shareDm}
          onChange={event => setShareDm(event.target.checked)}
          style={{ marginTop: 2, flexShrink: 0 }}
        />
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
          <strong style={{ color: shareDm ? RED : INK }}>Reveal DM-private content</strong>. Secrets, plot hooks, NPC goals and relationships, your DM notes, and the DM Compass become visible to all readers. Disabled by default; save details or re-share to enable.
        </span>
      </label>
      {/* Owner opt-in: allow other users to import (clone) this public dossier. */}
      <label htmlFor="share-to-gallery-importable" style={{
        display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer',
        padding: SP.sm, border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD,
      }}>
        <input
          id="share-to-gallery-importable"
          type="checkbox"
          aria-label="Allow others to import this settlement"
          checked={importable}
          onChange={event => setImportable(event.target.checked)}
          style={{ marginTop: 2, flexShrink: 0 }}
        />
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
          <strong style={{ color: INK }}>Allow others to import this settlement</strong>. Let other DMs clone the public version into their own library. Private DM content (secrets, notes) is never included in an import. Disabled by default; save details or re-share to enable.
        </span>
      </label>
      <Field label="Public description">
        <GalleryDescriptionEditor value={description} onChange={setDescription} />
      </Field>
      <Field label="Cover image">
        <CoverImageField
          value={imageUrl}
          onChange={setImageUrl}
          ownerId={auth?.user?.id}
          settlementId={saveId}
          alt={imageAlt || settlement?.name || ''}
        />
      </Field>
      <Field label="Image alt (description for screen readers)" htmlFor="share-to-gallery-image-alt">
        <input
          id="share-to-gallery-image-alt"
          aria-label="Image alt (description for screen readers)"
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
      <Field label="Gallery tags" htmlFor="share-to-gallery-tags">
        <input
          id="share-to-gallery-tags"
          aria-label="Gallery tags"
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
        <Button
          variant="gold"
          size="sm"
          icon={<Save size={12} />}
          onClick={handleSaveDetails}
          busy={busy}
          style={{ justifySelf: 'start' }}
        >
          {savedDetails ? 'Saved' : 'Save gallery details'}
        </Button>
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
          background: GREEN_BG, color: GREEN,
          border: `1px solid ${SUCCESS_BORDER}`,
          fontSize: FS.xs, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Public
        </span>
        <Button
          variant="gold"
          size="sm"
          onClick={handleCopy}
          title="Copy public URL"
          icon={copied ? <Check size={12} /> : <Copy size={12} />}
        >
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDetailsOpen(open => !open)}
          icon={<ImageIcon size={12} />}
        >
          Gallery details
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUnpublish}
          busy={busy}
        >
          {busy ? 'Working…' : 'Unshare'}
        </Button>
        {error && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: FS.xs, color: RED,
          }}>
            {error}
          </span>
        )}
        {aiOverlayNote}
        {/* Chronicle disclosure must also reach owners who published BEFORE
            the public chronicle existed — the gallery projects it at read
            time, so their event log is visible retroactively. */}
        <span style={{ flexBasis: '100%', fontSize: FS.xs, color: INK, opacity: 0.75 }}>
          Your settlement's event chronicle (event titles and summaries) is visible
          on the gallery page. Unshare to remove it.
        </span>
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
      <Button
        variant="gold"
        size="sm"
        onClick={handlePublish}
        busy={busy}
        disabled={!canonReady}
        title="Make this dossier readable to anyone with the link"
        icon={<Globe size={12} />}
      >
        {busy ? 'Publishing…' : 'Share to gallery'}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setDetailsOpen(open => !open)}
        icon={<ImageIcon size={12} />}
      >
        Details
      </Button>
      {error && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: FS.xs, color: RED,
        }}>
          {error}
        </span>
      )}
      <span style={{
        fontSize: FS.xs, color: MUTED, fontStyle: 'italic',
      }}>
        {canonReady
          ? "Public dossiers appear in the gallery. Your name and email stay private. Your settlement's event chronicle (event titles and summaries) is publicly visible on the gallery page."
          : 'Canonize this campaign world before sharing the dossier publicly.'}
      </span>
      {aiOverlayNote}
      {detailsForm}
    </div>
  );
}
