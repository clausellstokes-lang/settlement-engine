/**
 * ContentPackBar — export / import of custom-content packs (premium).
 *
 * Export: serializes the authored content lanes to a downloadable JSON pack
 * (buildContentPack). Import: reads an uploaded file, parses + re-validates +
 * re-namespaces it (parseContentPack → prepareImport), then commits each item
 * through the normal `addCustomItem` store action (which re-validates deities a
 * second time and assigns fresh ids). Re-namespacing guarantees a re-imported
 * pack never collides with content the user already has.
 *
 * The pack import is the seam where `validateDeity` runs again + refIds are
 * re-namespaced — see domain/contentPacks.js for the guarantees.
 *
 * "Share to Gallery as a content pack" is a labeled FOLLOW-UP stub (the gallery
 * share path ships a settlement, not a pack — wiring that is a separate change).
 */

import { useRef, useState } from 'react';
import { Download, Upload, Share2 } from 'lucide-react';
import { useStore } from '../../store/index.js';
import {
  buildContentPack, parseContentPack, prepareImport, PACK_BUCKETS,
} from '../../lib/contentPacks.js';
import { SECOND as SEC, BORDER as BOR, CARD, FS, swatch } from '../theme.js';
import Button from '../primitives/Button.jsx';

const ACCENT = swatch['#7C3AED'];

export default function ContentPackBar() {
  const customContent = useStore((s) => s.customContent);
  const addCustomItem = useStore((s) => s.addCustomItem);
  const fileRef = useRef(null);
  const [status, setStatus] = useState(null); // { ok: boolean, msg: string }

  const totalAuthored = PACK_BUCKETS.reduce(
    (sum, b) => sum + (Array.isArray(customContent?.[b]) ? customContent[b].length : 0), 0,
  );

  const handleExport = () => {
    const pack = buildContentPack(customContent);
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settlementforge-pack-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setStatus({ ok: true, msg: `Exported ${totalAuthored} item${totalAuthored === 1 ? '' : 's'}.` });
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (fileRef.current) fileRef.current.value = ''; // allow re-importing the same file
    if (!file) return;
    let text;
    try { text = await file.text(); }
    catch { setStatus({ ok: false, msg: 'Could not read the file.' }); return; }

    const parsed = parseContentPack(text);
    if (!parsed.ok) { setStatus({ ok: false, msg: parsed.error || 'Invalid pack.' }); return; }

    // Re-namespace + re-validate (deities through validateDeity). Then commit
    // each accepted item via the store action (which validates deities again and
    // mints ids). The fresh localUid from prepareImport is preserved by addCustomItem.
    const { items, rejected } = prepareImport(parsed.pack);
    let added = 0;
    for (const { bucket, item } of items) {
      const res = addCustomItem(bucket, item);
      // addCustomItem returns null only on a rejected (e.g. invalid deity) write.
      if (res !== null) added += 1;
    }
    const parts = [`Imported ${added} item${added === 1 ? '' : 's'}.`];
    if (rejected.length) parts.push(`${rejected.length} skipped (invalid).`);
    setStatus({ ok: rejected.length === 0, msg: parts.join(' ') });
  };

  return (
    <div
      data-testid="content-pack-bar"
      style={{
        marginBottom: 12, padding: '8px 12px', background: CARD,
        border: `1px solid ${BOR}`, borderRadius: 7,
        display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: FS.xxs, fontWeight: 800, color: ACCENT, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Content packs
      </span>
      <Button
        variant="secondary" size="sm" icon={<Download size={12} />}
        onClick={handleExport} disabled={totalAuthored === 0}
      >
        Export
      </Button>
      <Button
        variant="secondary" size="sm" icon={<Upload size={12} />}
        onClick={() => fileRef.current?.click()}
      >
        Import
      </Button>
      <input
        ref={fileRef} type="file" accept="application/json,.json"
        onChange={handleFile} style={{ display: 'none' }}
        aria-label="Import content pack file"
      />
      <Button
        variant="ghost" size="sm" icon={<Share2 size={12} />} disabled
        title="Coming soon — share an authored pack to the public Gallery."
      >
        Share to Gallery (soon)
      </Button>
      {status && (
        <span style={{ fontSize: FS.xs, color: status.ok ? SEC : swatch.danger, marginLeft: 'auto' }}>
          {status.msg}
        </span>
      )}
    </div>
  );
}
