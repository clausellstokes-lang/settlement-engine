/**
 * CoverImageField.jsx — gallery cover picker.
 *
 * Replaces the old "paste an image URL" input with a proper file flow:
 *   choose a file (button) OR drag-and-drop → landscape pan/zoom crop
 *   (ImageCropper) → upload the cropped JPEG to Supabase Storage → store the
 *   returned public URL. Shows a live preview of the current cover with
 *   Replace / Remove controls.
 *
 * The parent (ShareToGallery / gallery edit form) keeps owning the URL string;
 * this component only ever calls onChange(url) with a public URL or ''.
 */
import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';

import ImageCropper from './ImageCropper.jsx';
import Button from '../primitives/Button.jsx';
import { validateImageFile, uploadGalleryCover, removeGalleryCover } from '../../lib/imageUpload.js';
import { BORDER, BORDER2, CARD, CARD_ALT, INK, BODY, GOLD, MUTED, RED, sans, FS, R, SP } from '../theme.js';

const COVER_ASPECT = 16 / 9;

export default function CoverImageField({ value = '', onChange, ownerId, settlementId, alt = '' }) {
  const inputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const [editUrl, setEditUrl] = useState(null); // object URL while cropping
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Revoke any object URL we created on unmount.
  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
  }, []);

  const acceptFile = (file) => {
    setError(null);
    const check = validateImageFile(file);
    if (!check.ok) { setError(check.error); return; }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setEditUrl(url);
  };

  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (file) acceptFile(file);
    e.target.value = ''; // allow re-picking the same file
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) acceptFile(file);
  };

  const closeCropper = () => {
    if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null; }
    setEditUrl(null);
  };

  const onCommit = async (blob) => {
    setBusy(true); setError(null);
    try {
      const prev = value;
      const { url } = await uploadGalleryCover(blob, { ownerId, settlementId });
      onChange?.(url);
      closeCropper();
      // Best-effort: drop the previous upload we just replaced.
      if (prev && prev !== url) removeGalleryCover(prev);
    } catch (e) {
      setError(e.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const onRemove = () => {
    const prev = value;
    onChange?.('');
    if (prev) removeGalleryCover(prev);
  };

  // ── Cropping ──────────────────────────────────────────────────────────────
  if (editUrl) {
    return (
      <div style={{ display: 'grid', gap: SP.xs }}>
        <ImageCropper
          src={editUrl}
          aspect={COVER_ASPECT}
          busy={busy}
          onCancel={closeCropper}
          onCommit={onCommit}
        />
        {error && <ErrorLine text={error} />}
      </div>
    );
  }

  // ── Current cover preview ───────────────────────────────────────────────────
  if (value) {
    return (
      <div style={{ display: 'grid', gap: SP.xs }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: String(COVER_ASPECT), borderRadius: R.md, overflow: 'hidden', border: `1px solid ${BORDER2}`, background: CARD_ALT }}>
          <img src={value} alt={alt || 'Gallery cover'} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', gap: SP.sm }}>
          <Button variant="ghost" size="sm" icon={<ImagePlus size={13} />} onClick={() => inputRef.current?.click()}>
            Replace
          </Button>
          <Button variant="ghost" size="sm" icon={<Trash2 size={13} />} onClick={onRemove} style={{ color: MUTED }}>
            Remove
          </Button>
        </div>
        {error && <ErrorLine text={error} />}
        <input ref={inputRef} type="file" accept="image/*" onChange={onPick} aria-label="Choose a cover image file" style={{ display: 'none' }} />
      </div>
    );
  }

  // ── Empty: dropzone + picker ────────────────────────────────────────────────
  return (
    <div style={{ display: 'grid', gap: SP.xs }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: `${SP.md}px ${SP.sm}px`, minHeight: 96, textAlign: 'center',
          border: `1.5px dashed ${dragOver ? GOLD : BORDER}`, borderRadius: R.md,
          background: dragOver ? CARD_ALT : CARD, color: BODY, cursor: 'pointer',
          fontFamily: sans, fontSize: FS.xxs, transition: 'border-color 120ms, background 120ms',
        }}
      >
        <span style={{ color: INK, fontWeight: 800 }}>Drag an image here, or click to choose a file</span>
        <span style={{ color: MUTED }}>You’ll crop it to a landscape cover. JPEG, PNG, WebP, or GIF · up to 8&nbsp;MB.</span>
      </div>
      {error && <ErrorLine text={error} />}
      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} aria-label="Choose a cover image file" style={{ display: 'none' }} />
    </div>
  );
}

function ErrorLine({ text }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: RED, fontFamily: sans, fontSize: FS.xxs }}>
      {text}
    </span>
  );
}
