/**
 * MapShareEditor.jsx — Publish / unpublish a saved campaign's MAP.
 *
 * The maps-and-campaigns analogue of ShareToGallery. Mounts wherever an owned,
 * cloud-synced campaign offers a "share this map" affordance. Lets the owner pick
 * what travels with the share (bare map vs the populated living world), seed a
 * cover from the rendered map, write a public description, tag the share, opt into
 * import, and choose which world sections a viewer may read. Once published, swaps
 * to a Public badge plus a copyable /gallery?slug= link and an Unshare control.
 *
 * Visibility / self-gating mirrors ShareToGallery:
 *   - Hidden for anonymous users (no owned saved_maps row to publish).
 *   - A campaign with no synced uuid shows a soft "save first" hint.
 *
 * Truth lives on the server: shareMap / unshareMap / updateMapGalleryMetadata own
 * the publish state; this component owns no truth, only the editor draft. The
 * public world snapshot is built here (serializeWorldSnapshotPublic) and passed to
 * shareMap as-is — the serializer is the security boundary, not this UI.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Globe, Copy, Check, Image as ImageIcon, Save } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { shareMap, unshareMap, updateMapGalleryMetadata, fetchCampaignGalleryFields } from '../../lib/gallery.js';
import { serializeWorldSnapshotPublic } from '../../domain/display/worldSnapshotPublic.js';
import { buildRealmArcSummary } from '../../domain/display/realmArcSummary.js';
import { captureMapThumb, captureCampaignThumb } from '../../lib/mapThumb.js';
import {
  KIND_OPTIONS,
  suggestedTagsForCampaign,
  campaignFacets,
} from './galleryMapsUtils.js';
import GalleryDescriptionEditor from '../GalleryDescriptionEditor.jsx';
import CoverImageField from './CoverImageField.jsx';
import WorldSectionToggles, { WORLD_SECTIONS } from './WorldSectionToggles.jsx';
import Button from '../primitives/Button.jsx';
import {
  BORDER, BORDER2, CARD, CARD_ALT, sans, SP, R, FS, GREEN, GREEN_BG,
  SUCCESS_BORDER, RED, INK, BODY, MUTED,
} from '../theme.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function publicUrlFor(slug) {
  const path = `/gallery?slug=${encodeURIComponent(slug)}`;
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
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

/**
 * Segmented kind picker: "Map only" vs "Map and campaign". The campaign option is
 * enabled only when the realm has at least one member settlement; otherwise it is
 * shown disabled with its helper copy, so the owner sees the option exists but
 * understands why it is unavailable.
 */
function KindPicker({ value, onChange, canShareCampaign }) {
  return (
    <div role="radiogroup" aria-label="What to share" style={{ display: 'grid', gap: SP.xs }}>
      <div style={{ display: 'flex', gap: SP.xs, flexWrap: 'wrap' }}>
        {KIND_OPTIONS.map(([id, label]) => {
          const disabled = id === 'map_with_campaign' && !canShareCampaign;
          const active = value === id;
          return (
            <Button
              key={id}
              role="radio"
              aria-checked={active}
              variant={active ? 'gold' : 'secondary'}
              size="sm"
              disabled={disabled}
              onClick={() => onChange(id)}
              style={{ flex: '1 1 0', minWidth: 140, justifyContent: 'flex-start' }}
            >
              {label}
            </Button>
          );
        })}
      </div>
      {KIND_OPTIONS.map(([id, , helper]) => (value === id ? (
        <span key={id} style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
          {helper}
        </span>
      ) : null))}
      {!canShareCampaign && (
        <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontStyle: 'italic' }}>
          Add a settlement to the campaign to share the living world alongside the map.
        </span>
      )}
    </div>
  );
}

const ALL_SECTION_KEYS = WORLD_SECTIONS.map(([key]) => key);

/**
 * The maps / campaigns share editor.
 *
 * @param {Object} props
 * @param {Object} props.campaign       the owned campaign row (id IS the saved_maps id; carries mapState, isPublic, publicSlug, shareKind, galleryDescription, galleryTags).
 * @param {Object} [props.worldState]   the campaign's live worldState (snapshot source).
 * @param {Object} [props.regionalGraph] the campaign's live regional graph (war/channel source).
 * @param {Array}  [props.members]      member view [{ name, tier, settlement }] for facets, tags, id→name.
 * @param {Object} [props.bridge]       the FMG map bridge (mapBridge.js) for thumbnail capture.
 * @param {string} [props.ownerId]      auth uid; the RLS folder for the cover/thumb upload. Defaults to the signed-in user.
 * @param {string} [props.galleryImageUrl] the live cover image URL (seeds the draft).
 * @param {string} [props.galleryImageAlt] the live cover alt text (seeds the draft).
 * @param {boolean} [props.galleryImportable] the live import opt-in (seeds the draft).
 * @param {string[]} [props.galleryWorldSections] the live enabled-section keys (seeds the toggles; absent ⇒ all on).
 * @param {Function} [props.onSaved]    optional callback after a successful edit-after-publish (contextual refresh).
 */
export default function MapShareEditor({
  campaign,
  worldState = null,
  regionalGraph = null,
  members = [],
  bridge = null,
  ownerId: ownerIdProp = null,
  galleryImageUrl = '',
  galleryImageAlt = '',
  galleryImportable = false,
  galleryWorldSections = null,
  onSaved = null,
}) {
  const auth = useStore(s => s.auth);
  const updateSavedCampaign = useStore(s => s.updateSavedCampaign);

  const campaignId = campaign?.id || null;
  const ownerId = ownerIdProp || auth?.user?.id || null;
  const canSync = UUID_RE.test(String(campaignId || ''));
  const memberList = useMemo(() => (Array.isArray(members) ? members : []), [members]);
  const canShareCampaign = memberList.length >= 1;

  const [kind, setKind] = useState(() => (campaign?.shareKind === 'map_with_campaign' && canShareCampaign ? 'map_with_campaign' : 'map'));
  const [isPublic, setIsPublic] = useState(Boolean(campaign?.isPublic));
  const [slug, setSlug] = useState(campaign?.publicSlug || null);
  const [detailsOpen, setDetailsOpen] = useState(!campaign?.isPublic);
  const [description, setDescription] = useState(campaign?.galleryDescription || '');
  const [imageUrl, setImageUrl] = useState(galleryImageUrl || '');
  const [imageAlt, setImageAlt] = useState(galleryImageAlt || '');
  const [tagsInput, setTagsInput] = useState(
    ((campaign?.galleryTags?.length ? campaign.galleryTags : suggestedTagsForCampaign(campaign || {}, memberList)) || []).join(', '),
  );
  // Import opt-in: PRESERVE-ON-OMIT. Initialized to undefined (not a concrete
  // false), so a Save fired before the async gallery-field seed lands omits
  // gallery_importable from the metadata bag and the patch keeps the prior value.
  // The async seed (fetchCampaignGalleryFields) and the owner's own toggle replace
  // it with a real boolean; until then the prop is only the checkbox's display
  // fallback, never a write. The campaign-load SELECT omits the 088 gallery
  // columns, so the prop cannot be trusted as the persisted truth on first mount.
  const [importable, setImportable] = useState(undefined);
  // The five living-world sections an owner may reveal. Default ALL ON; a saved
  // share seeds from the persisted enabled-keys (an empty list still means "none
  // on", so only a null/absent seed falls back to every key).
  const [enabledSections, setEnabledSections] = useState(() => new Set(
    Array.isArray(galleryWorldSections) ? galleryWorldSections : ALL_SECTION_KEYS,
  ));
  const [busy, setBusy] = useState(false);
  const [seedingCover, setSeedingCover] = useState(false);
  const seedKeyRef = useRef(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [savedDetails, setSavedDetails] = useState(false);

  // Seed the cover from the rendered map the first time the editor is opened with
  // no cover yet: the bare terrain for a map-only share, the terrain-plus-markers
  // composite for a campaign share. Best-effort — a failed capture leaves the
  // dropzone, and the owner can always choose a file. Re-runs when the kind flips
  // (map-only and campaign want different captures) but never overwrites a cover
  // the owner already has.
  useEffect(() => {
    let cancelled = false;
    if (imageUrl || !bridge?.isReady || !ownerId || !campaignId) return undefined;
    // Re-seed only on a genuine kind flip, not on every render — a key built from
    // the inputs guards against re-firing the (idempotent but costly) capture.
    const seedKey = `${kind}:${campaignId}`;
    if (seedKeyRef.current === seedKey) return undefined;
    seedKeyRef.current = seedKey;
    setSeedingCover(true);
    const capture = kind === 'map_with_campaign'
      ? captureCampaignThumb({ bridge, ownerId, campaignId })
      : captureMapThumb({ bridge, ownerId, campaignId });
    capture
      .then(result => { if (!cancelled && result?.imageUrl) setImageUrl(result.imageUrl); })
      .catch(() => { /* non-fatal: keep the dropzone */ })
      .finally(() => { if (!cancelled) setSeedingCover(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- imageUrl is read as a one-time guard, not a trigger; re-seeding is keyed by kind + campaignId.
  }, [kind, bridge, ownerId, campaignId]);

  // Seed the edit-after-publish draft from the PERSISTED gallery fields when the
  // campaign is already public. The campaign-load SELECT deliberately omits the 088
  // gallery columns (cover, alt, importable, world sections), so without this seed
  // the draft mounts empty and "Save gallery details" would null the saved cover +
  // re-enable every section. A dedicated owner-scoped fetch fills the draft; it
  // fails gracefully (returns null pre-088), so the editor keeps its defaults then.
  // Runs once per published campaign id.
  const seededFieldsRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    if (!isPublic || !campaignId || seededFieldsRef.current === campaignId) return undefined;
    seededFieldsRef.current = campaignId;
    fetchCampaignGalleryFields(campaignId)
      .then(fields => {
        if (cancelled || !fields) return;
        // Seed the cover only when one is persisted, so the map-capture seed (which
        // runs only when imageUrl is empty) still fires for a share saved without a
        // cover. This also marks the cover-seed guard satisfied, preventing a
        // capture from racing the persisted cover.
        if (fields.imageUrl) {
          setImageUrl(fields.imageUrl);
          seedKeyRef.current = `${kind}:${campaignId}`;
        }
        if (fields.imageAlt) setImageAlt(fields.imageAlt);
        setImportable(fields.importable);
        // null ⇒ seed unknown (keep ALL sections on); an array is an explicit choice.
        if (Array.isArray(fields.worldSections)) {
          setEnabledSections(new Set(fields.worldSections));
        }
      })
      .catch(() => { /* non-fatal: keep the default draft */ });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seeds once per published campaign id; kind is read only to mark the cover-seed guard, not to re-trigger.
  }, [isPublic, campaignId]);

  const shareCampaign = kind === 'map_with_campaign' && canShareCampaign;

  // The realm-arc digest + facets are DERIVED from the live ledgers, never owner
  // free-text — the same posture ShareToGallery uses for the dossier.
  const realmArcSummary = useMemo(() => {
    if (!shareCampaign) return '';
    return buildRealmArcSummary({ worldState, regionalGraph, settlements: memberList });
  }, [shareCampaign, worldState, regionalGraph, memberList]);

  // saved_maps facets are CAMPAIGN-shaped (member_band / dominant_culture /
  // tier_spread / at_war — migration 088), so pass campaignFacets' keys straight
  // through. publish_map (p_facets) and galleryMapMetadataPatch both read exactly
  // memberBand / dominantCulture / tierSpread / atWar; remapping to the settlement-
  // shaped facetCulture/facetDeity would write columns saved_maps does not have.
  const facets = useMemo(() => {
    if (!shareCampaign) return null;
    return campaignFacets(campaign || {}, memberList);
  }, [shareCampaign, campaign, memberList]);

  if (!auth?.user) return null;
  if (!canSync) {
    return (
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', borderRadius: R.md,
        background: 'transparent', color: MUTED,
        fontSize: FS.xs, fontFamily: sans, fontStyle: 'italic',
      }}>
        Save the campaign first to share its map publicly.
      </div>
    );
  }

  const enabledKeys = ALL_SECTION_KEYS.filter(key => enabledSections.has(key));
  const anySectionOn = enabledKeys.length > 0;

  // Build the shareMap opts from the current draft. The world snapshot is the
  // public-safe projection of the live world, gated per section by the toggles;
  // it rides along only for a campaign share with at least one section on.
  function buildShareOpts() {
    const includeWorld = shareCampaign && anySectionOn;
    const sectionOpts = {
      worldClock: enabledSections.has('worldClock'),
      chronicle: enabledSections.has('chronicle'),
      pantheon: enabledSections.has('pantheon'),
      warNetwork: enabledSections.has('warNetwork'),
      dashboard: enabledSections.has('dashboard'),
    };
    const snapshot = includeWorld
      ? serializeWorldSnapshotPublic(worldState, regionalGraph, memberList, sectionOpts)
      : null;
    return {
      kind: shareCampaign ? 'map_with_campaign' : 'map',
      description,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      importable,
      imageUrl,
      imageAlt,
      shareWorld: includeWorld,
      worldSections: includeWorld ? enabledKeys : [],
      worldSnapshot: snapshot,
      realmArcSummary: shareCampaign ? realmArcSummary : '',
      ...(facets ? { facets } : {}),
    };
  }

  // The cache patch mirrors the campaign row shape (lib/campaigns.js) so the tile
  // and any re-render off the cached campaign reflect the publish/edit at once.
  function cachePatch(extra = {}) {
    return {
      shareKind: shareCampaign ? 'map_with_campaign' : 'map',
      galleryDescription: description,
      galleryTags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      ...extra,
    };
  }

  async function handlePublish() {
    setBusy(true); setError(null);
    try {
      const newSlug = await shareMap(campaignId, buildShareOpts());
      setSlug(newSlug);
      setIsPublic(true);
      try { updateSavedCampaign?.(campaignId, cachePatch({ isPublic: true, publicSlug: newSlug })); } catch { /* non-fatal */ }
    } catch (e) {
      setError(e.message || 'Map share failed');
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveDetails() {
    if (!campaignId) return;
    setBusy(true); setError(null); setSavedDetails(false);
    try {
      const opts = buildShareOpts();
      // World-snapshot PRESERVE-ON-OMIT: a persisted campaign share whose member
      // settlements have not hydrated on this surface forces kind back to 'map'
      // (canShareCampaign is false with an empty member list), so buildShareOpts
      // would emit shareWorld:false / worldSections:[] / worldSnapshot:null. A save
      // from that stale mount must NOT null the living world, so omit the world trio
      // from the bag in that case and galleryMapMetadataPatch keeps the prior value.
      const persistedCampaignShare = campaign?.shareKind === 'map_with_campaign';
      const worldUnloaded = persistedCampaignShare && !shareCampaign;
      await updateMapGalleryMetadata(campaignId, {
        description: opts.description,
        imageUrl: opts.imageUrl,
        imageAlt: opts.imageAlt,
        tags: opts.tags,
        // Import opt-in PRESERVE-ON-OMIT: undefined until the async seed lands, so
        // a save before the seed resolves omits gallery_importable entirely and the
        // patch keeps the persisted choice rather than flipping it to false.
        ...(opts.importable === undefined ? {} : { importable: opts.importable }),
        realmArcSummary: opts.realmArcSummary,
        ...(worldUnloaded ? {} : {
          shareWorld: opts.shareWorld,
          worldSections: opts.worldSections,
          worldSnapshot: opts.worldSnapshot,
        }),
        ...(facets ? facets : {}),
      });
      try { updateSavedCampaign?.(campaignId, cachePatch()); } catch { /* non-fatal */ }
      setSavedDetails(true);
      setTimeout(() => setSavedDetails(false), 1600);
      onSaved?.();
    } catch (e) {
      setError(e.message || 'Gallery details could not be saved');
    } finally {
      setBusy(false);
    }
  }

  async function handleUnshare() {
    setBusy(true); setError(null);
    try {
      await unshareMap(campaignId);
      setIsPublic(false);
      try { updateSavedCampaign?.(campaignId, { isPublic: false }); } catch { /* non-fatal */ }
    } catch (e) {
      setError(e.message || 'Map unshare failed');
    } finally {
      setBusy(false);
    }
  }

  function handleCopy() {
    if (!slug || typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(publicUrlFor(slug))
      .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
      .catch(() => { /* clipboard refused; nothing to do */ });
  }

  const detailsForm = detailsOpen && (
    <div style={{
      width: '100%', display: 'grid', gap: SP.sm, padding: SP.sm,
      border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD_ALT, marginTop: SP.xs,
    }}>
      <Field label="What to share">
        <KindPicker value={kind} onChange={setKind} canShareCampaign={canShareCampaign} />
      </Field>
      {/* Owner opt-in: allow other DMs to import (clone) the shared map. */}
      <label htmlFor="map-share-importable" style={{
        display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer',
        padding: SP.sm, border: `1px solid ${BORDER2}`, borderRadius: R.md, background: CARD,
      }}>
        <input
          id="map-share-importable"
          type="checkbox"
          aria-label="Allow others to import this map"
          // Controlled: while the seed is in flight (importable === undefined) fall
          // back to the tile facet prop for DISPLAY only, never for the write.
          checked={importable === undefined ? galleryImportable === true : importable}
          onChange={event => setImportable(event.target.checked)}
          style={{ marginTop: 2, flexShrink: 0 }}
        />
        <span style={{ color: BODY, fontFamily: sans, fontSize: FS.xxs, lineHeight: 1.45 }}>
          <strong style={{ color: INK }}>Allow others to import this map</strong>. Let other DMs clone the public version into their own library. Private world detail is never included in an import. Disabled by default.
        </span>
      </label>
      {shareCampaign && (
        <WorldSectionToggles enabled={enabledSections} onToggle={setEnabledSections} />
      )}
      <Field label="Public description">
        <GalleryDescriptionEditor value={description} onChange={setDescription} />
      </Field>
      <Field label="Cover image">
        {seedingCover && !imageUrl ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: 96, border: `1px dashed ${BORDER}`, borderRadius: R.md,
            background: CARD, color: MUTED, fontFamily: sans, fontSize: FS.xxs,
          }}>
            Capturing the map for the cover…
          </div>
        ) : (
          <CoverImageField
            value={imageUrl}
            onChange={setImageUrl}
            ownerId={ownerId}
            settlementId={campaignId}
            alt={imageAlt || campaign?.name || ''}
          />
        )}
      </Field>
      <Field label="Image alt (description for screen readers)" htmlFor="map-share-image-alt">
        <input
          id="map-share-image-alt"
          aria-label="Image alt (description for screen readers)"
          value={imageAlt}
          onChange={event => setImageAlt(event.target.value)}
          placeholder={campaign?.name ? `Map of ${campaign.name}` : 'Image description'}
          style={{
            minHeight: 32, border: `1px solid ${BORDER}`, borderRadius: R.md,
            background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs, padding: '6px 8px',
          }}
        />
      </Field>
      <Field label="Gallery tags" htmlFor="map-share-tags">
        <input
          id="map-share-tags"
          aria-label="Gallery tags"
          value={tagsInput}
          onChange={event => setTagsInput(event.target.value)}
          placeholder="coastal, small realm, at war"
          style={{
            minHeight: 32, border: `1px solid ${BORDER}`, borderRadius: R.md,
            background: CARD, color: INK, fontFamily: sans, fontSize: FS.xs, padding: '6px 8px',
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

  // Published state — Public badge + copy link + unshare.
  if (isPublic && slug) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', fontFamily: sans, width: '100%' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 9px', borderRadius: R.md,
          background: GREEN_BG, color: GREEN, border: `1px solid ${SUCCESS_BORDER}`,
          fontSize: FS.xs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Public
        </span>
        <Button variant="gold" size="sm" onClick={handleCopy} title="Copy public URL" icon={copied ? <Check size={12} /> : <Copy size={12} />}>
          {copied ? 'Copied' : 'Copy link'}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setDetailsOpen(open => !open)} icon={<ImageIcon size={12} />}>
          Gallery details
        </Button>
        <Button variant="ghost" size="sm" onClick={handleUnshare} busy={busy}>
          {busy ? 'Working…' : 'Unshare'}
        </Button>
        {error && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: FS.xs, color: RED }}>
            {error}
          </span>
        )}
        {detailsForm}
      </div>
    );
  }

  // Private state — publish button.
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap', fontFamily: sans, width: '100%' }}>
      <Button
        variant="gold"
        size="sm"
        onClick={handlePublish}
        busy={busy}
        title="Make this map readable to anyone with the link"
        icon={<Globe size={12} />}
      >
        {busy ? 'Publishing…' : 'Share to gallery'}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => setDetailsOpen(open => !open)} icon={<ImageIcon size={12} />}>
        Details
      </Button>
      {error && (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: FS.xs, color: RED }}>
          {error}
        </span>
      )}
      <span style={{ fontSize: FS.xs, color: MUTED, fontStyle: 'italic' }}>
        Public maps appear in the gallery. Your name and email stay private. A campaign share also shows the living world sections you leave enabled below.
      </span>
      {detailsForm}
    </div>
  );
}
