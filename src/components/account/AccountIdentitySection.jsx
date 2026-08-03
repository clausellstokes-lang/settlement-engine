/**
 * AccountIdentitySection.jsx — Account ▸ Profile ▸ the public display identity
 * (DESIGN_PROFILE_IMAGE.md §3 the pipeline, §4 the settings).
 *
 * THE ORDER: "people should be able to upload an image in place of their profile
 * letter; it shows in their settlements, maps, and campaigns in the galleries
 * along with their display name; also the founders page; circular frame."
 *
 * ── WHAT THIS COMPONENT IS THE SINGLE WRITER OF
 * profiles.avatar_url. Before this lane the Account page wrote that column from a
 * free-text "Avatar URL" box on the Save-profile button; that box is GONE (see
 * AccountProfileSection) and this is now the only writer. Two writers to one
 * column was not a style problem: a stale draft string in the old input would
 * have clobbered a freshly uploaded image the next time anyone pressed Save.
 *
 * The pasted-URL box also had to go on its own merits — it hotlinked arbitrary
 * remote images, carried whatever EXIF the origin served, and could not be
 * moderated or swept. §3's pipeline replaces it.
 *
 * ── DORMANT-SAFE, THE FounderCreditToggle PATTERN
 * The consent column and the avatars bucket ship with migration 195, which is
 * DARK and undeployed. So each half feature-detects independently and hides
 * rather than spewing errors at a user for a migration that is not their fault:
 * the consent switch hides when the column is absent, and the uploader reports a
 * plain sentence when the bucket is absent. avatar_url itself is long deployed,
 * so uploading works the moment the bucket exists.
 *
 * ── ONE CONSENT, NOT TWO SWITCHES (§1)
 * There is exactly one opt-in here, and its copy states plainly where the PAIR
 * appears. There is deliberately no separate "show my image" toggle beside a
 * "show my name" toggle: two switches is how a surface ends up publishing half
 * an identity, and how withdrawal leaves a face behind somewhere.
 *
 * ── PRIVACY POSTURE OF THE PIPELINE ITSELF
 * Cropping and scaling happen ENTIRELY in this browser. The bytes that leave the
 * device are the re-encoded 512/128/32 WebP rungs — never the original file — so
 * the GPS coordinates in a phone photo never reach the server at all, rather than
 * reaching it and being deleted. That is §3.4 as a property of where the work
 * happens.
 */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

import ImageCropper from '../gallery/ImageCropper.jsx';
import Button from '../primitives/Button.jsx';
import PublicAvatar from '../primitives/PublicAvatar.jsx';
import { supabase } from '../../lib/supabase.js';
import { useStore } from '../../store/index.js';
import {
  buildAvatarLadder, decodeImageSource, sweepAvatarLadder, uploadAvatarLadder,
  validateAvatarDimensions, validateAvatarFile,
} from '../../lib/avatarUpload.js';
import { AVATAR_RUNGS } from '../../lib/publicIdentity.js';
import { BORDER, BORDER2, CARD, CARD_ALT, GOLD, MUTED, RED, SECOND, SP, FS, sans } from '../theme.js';

/**
 * The crop hands back a LOSSLESS PNG square; the rungs are then encoded to WebP
 * from that one decode. Cropping straight to WebP would put two generations of
 * lossy compression into the master for no benefit. The PNG never leaves memory.
 */
const CROP_INTERMEDIATE_TYPE = 'image/png';

export default function AccountIdentitySection() {
  const avatarUrl = useStore((s) => s.auth?.avatarUrl || '');
  const displayName = useStore((s) => s.auth?.displayName || '');
  const setAvatarUrl = useStore((s) => s.setAvatarUrl);

  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const [editUrl, setEditUrl] = useState(null);   // object URL while cropping
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [optedIn, setOptedIn] = useState(null);   // null = unknown
  const [consentAvailable, setConsentAvailable] = useState(true);
  const [consentSaving, setConsentSaving] = useState(false);
  const consentId = useId();

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  // Feature-detect the consent column (dark migration 195).
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { if (alive) setConsentAvailable(false); return; }
        const { data, error: readError } = await supabase
          .from('profiles').select('public_identity_opt_in').eq('id', user.id).maybeSingle();
        if (!alive) return;
        if (readError) { setConsentAvailable(false); return; } // column undeployed → hide
        setOptedIn(data?.public_identity_opt_in === true);
      } catch {
        if (alive) setConsentAvailable(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const closeCropper = useCallback(() => {
    if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null; }
    setEditUrl(null);
  }, []);

  const acceptFile = useCallback(async (file) => {
    setError(null);
    const check = validateAvatarFile(file);
    if (!check.ok) { setError(check.error); return; }

    // ⚠️ THE DIMENSION FLOOR IS CHECKED ON THE *SOURCE*, BEFORE CROPPING, and it
    // has to be. The cropper's output is always 512x512 by construction, so
    // measuring it would be measuring our own canvas — a 64x64 photo would sail
    // through, get upscaled into a blurry face, and the §3.1 floor would be a
    // comment rather than a rule. Decoding here costs one image decode and is the
    // only moment the user's real pixel dimensions exist.
    let decoded;
    try {
      decoded = await decodeImageSource(file);
    } catch {
      setError('Could not read that image.');
      return;
    }
    const dims = validateAvatarDimensions({ width: decoded.width, height: decoded.height });
    if (!dims.ok) { setError(dims.error); return; }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setEditUrl(url);
  }, []);

  const onPick = (e) => {
    const file = e.target.files?.[0];
    // acceptFile is async (it decodes to measure the source); catch so a decode
    // failure becomes a sentence rather than an unhandled rejection.
    if (file) acceptFile(file).catch(() => setError('Could not read that image.'));
    e.target.value = ''; // allow re-picking the same file
  };

  /**
   * The crop is committed: derive the ladder, upload it, repoint the profile,
   * and only THEN sweep the superseded objects.
   *
   * The order is the whole correctness story. Sweeping first (or in parallel)
   * would leave a live public avatar on a dead URL for every failure between the
   * two — and a failure here is a network blip, not an exotic case.
   */
  const onCommit = useCallback(async (squarePngBlob) => {
    setBusy(true); setError(null);
    const previous = avatarUrl;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be signed in to upload a profile image.');

      // No dimension check here: this blob is our own 512 square crop, so
      // measuring it would measure our canvas rather than the user's photo. The
      // floor is enforced on the SOURCE in acceptFile, before cropping.
      const source = await decodeImageSource(squarePngBlob);
      const ladder = await buildAvatarLadder(source);
      const { url } = await uploadAvatarLadder(ladder, { userId: user.id });

      const { error: writeError } = await supabase
        .from('profiles').update({ avatar_url: url }).eq('id', user.id);
      if (writeError) throw new Error(writeError.message || 'Could not save your profile image.');

      setAvatarUrl(url);
      closeCropper();

      // Persisted — now, and only now, the old ladder is genuinely superseded.
      if (previous && previous !== url) await sweepAvatarLadder(previous);
    } catch (e) {
      setError(e?.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }, [avatarUrl, closeCropper, setAvatarUrl]);

  /**
   * Remove → back to the letter-circle immediately, everywhere (§4).
   * The letter-circle is the PERMANENT fallback, so this is a complete, ordinary
   * end state and not a degraded one.
   */
  const onRemove = useCallback(async () => {
    setBusy(true); setError(null);
    const previous = avatarUrl;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be signed in to change your profile image.');
      const { error: writeError } = await supabase
        .from('profiles').update({ avatar_url: null }).eq('id', user.id);
      if (writeError) throw new Error(writeError.message || 'Could not remove your profile image.');
      setAvatarUrl(null);
      if (previous) await sweepAvatarLadder(previous);
    } catch (e) {
      setError(e?.message || 'Could not remove your profile image.');
    } finally {
      setBusy(false);
    }
  }, [avatarUrl, setAvatarUrl]);

  const onConsentChange = useCallback(async (next) => {
    setConsentSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setConsentAvailable(false); return; }
      const { error: writeError } = await supabase
        .from('profiles').update({ public_identity_opt_in: next }).eq('id', user.id);
      if (writeError) { setConsentAvailable(false); return; } // column undeployed → hide
      setOptedIn(next);
    } catch {
      setConsentAvailable(false);
    } finally {
      setConsentSaving(false);
    }
  }, []);

  // The previews render through the SAME component every public surface uses, at
  // BOTH shipped rungs (§4: "the current image always previewed in the circular
  // frame at 128 and 32 so the user sees every size they ship"). Because
  // PublicAvatar renders nothing without consent, the preview passes optedIn:true
  // explicitly — this is the user looking at their own identity, not a public
  // surface publishing it.
  const previewIdentity = { displayName, imageUrl: avatarUrl, optedIn: true };

  if (editUrl) {
    return (
      <div style={{ display: 'grid', gap: SP.sm }}>
        <FieldLabel>Profile image</FieldLabel>
        <div style={{ maxWidth: 320 }}>
          <ImageCropper
            src={editUrl}
            aspect={1}
            circular
            outputMaxWidth={AVATAR_RUNGS.master}
            outputType={CROP_INTERMEDIATE_TYPE}
            applyLabel="Use this image"
            busy={busy}
            onCancel={closeCropper}
            onCommit={onCommit}
          />
        </div>
        {error && <ErrorLine text={error} />}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: SP.sm }}>
      <FieldLabel>Profile image</FieldLabel>

      <div style={{ display: 'flex', alignItems: 'center', gap: SP.lg, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.md }}>
          <PublicAvatar identity={previewIdentity} rung="standard" size={72} ring="plain" eager />
          <PublicAvatar identity={previewIdentity} rung="micro" ring="plain" eager />
        </div>
        <div style={{ display: 'flex', gap: SP.sm, flexWrap: 'wrap' }}>
          <Button
            variant="ghost" size="sm" icon={<ImagePlus size={13} />}
            disabled={busy} onClick={() => inputRef.current?.click()}
          >
            {avatarUrl ? 'Replace' : 'Upload an image'}
          </Button>
          {avatarUrl && (
            <Button
              variant="ghost" size="sm" icon={<Trash2 size={13} />}
              disabled={busy} onClick={onRemove} style={{ color: MUTED }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>

      <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
        PNG, JPEG, or WebP, at least {AVATAR_RUNGS.standard}×{AVATAR_RUNGS.standard} pixels.
        You’ll crop it to a circle. Cropping happens on your device — the original
        file, and anything your camera recorded in it, never leaves this browser.
      </span>

      {!avatarUrl && (
        <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans }}>
          Without an image you keep your initial, which is a perfectly good way to appear.
        </span>
      )}

      {error && <ErrorLine text={error} />}

      <input
        ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp"
        onChange={onPick} aria-label="Choose a profile image file"
        style={{ display: 'none' }}
      />

      {consentAvailable && optedIn !== null && (
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 4,
          marginTop: SP.xs, padding: SP.sm,
          border: `1px solid ${optedIn ? GOLD : BORDER2}`, background: CARD,
        }}>
          <label
            htmlFor={consentId}
            style={{ display: 'flex', alignItems: 'center', gap: SP.sm, fontSize: FS.sm, color: SECOND, fontWeight: 700, fontFamily: sans }}
          >
            <input
              id={consentId} type="checkbox" checked={optedIn} disabled={consentSaving}
              aria-label="Show my name and image publicly"
              onChange={(e) => onConsentChange(e.target.checked)}
            />
            Show my name and image publicly
          </label>
          <span style={{ fontSize: FS.xs, color: MUTED, fontFamily: sans, paddingLeft: 24 }}>
            Your name and image appear on your published settlements, maps, and
            campaigns, and — if you hold a chair — the Founders’ Hall. Turn this
            off and both disappear from every public page at once; your image
            stays in your account.
          </span>
        </div>
      )}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <span style={{ fontSize: FS.xs, fontWeight: 700, color: SECOND, fontFamily: sans }}>
      {children}
    </span>
  );
}

function ErrorLine({ text }) {
  return (
    <span role="alert" style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      color: RED, fontFamily: sans, fontSize: FS.xxs,
      border: `1px solid ${BORDER}`, background: CARD_ALT, padding: `4px ${SP.sm}px`,
    }}>
      {text}
    </span>
  );
}
