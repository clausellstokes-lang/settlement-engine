/**
 * GalleryMemberVisibility — the per-NPC visibility overrides for ShareToGallery
 * (migration 092). Each member inherits the settlement-level "Reveal DM content"
 * (shareDm) and "Allow import" (importable) flags; this lets the owner tighten a
 * single NPC without changing the whole settlement.
 *
 * We store ONLY deltas: a checkbox whose value equals the current settlement default
 * drops that member's entry, so un-overridden members keep following the settlement
 * flags as those change, and the stored column stays minimal. The key is
 * galleryMemberKey (npc.id, else a name slug) — the SAME key the server reads.
 */

import { useState } from 'react';
import { galleryMemberKey } from '../domain/display/publicSafe.js';
import { INK, BODY, MUTED, SECOND, BORDER, CARD, sans, FS, swatch } from './theme';
import Button from './primitives/Button.jsx';

export default function GalleryMemberVisibility({ settlement, shareDm, importable, memberOverrides, setMemberOverrides }) {
  const [open, setOpen] = useState(false);
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs.filter(n => n && (n.name || n.role)) : [];
  if (npcs.length === 0) return null;

  // Set/clear one flag for one member, dropping the entry when it matches the
  // settlement default so the override map only ever holds genuine deltas.
  function setFlag(key, field, value, settlementDefault) {
    setMemberOverrides(prev => {
      const next = { ...(prev || {}) };
      const entry = { ...(next[key] || {}) };
      if (value === settlementDefault) delete entry[field];
      else entry[field] = value;
      if (Object.keys(entry).length) next[key] = entry;
      else delete next[key];
      return next;
    });
  }

  const overrides = memberOverrides || {};
  const overriddenCount = npcs.filter(n => overrides[galleryMemberKey(n)]).length;

  return (
    <div style={{ marginTop: 10, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
      <Button
        variant="secondary"
        fullWidth
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        style={{ justifyContent: 'flex-start', gap: 8, padding: '10px 14px', borderRadius: open ? '8px 8px 0 0' : 8, background: open ? swatch['#FAF6EF'] : CARD, border: 'none', boxShadow: 'none', textAlign: 'left' }}
      >
        <span style={{ fontSize: FS.sm, fontWeight: 700, color: INK, flex: 1 }}>Per-member visibility</span>
        <span style={{ fontSize: FS.xxs, color: MUTED }}>
          {overriddenCount > 0 ? `${overriddenCount} customized` : 'All follow the settlement'}
        </span>
      </Button>
      {open && (
        <div style={{ padding: '8px 14px 12px', borderTop: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: FS.xxs, color: BODY, lineHeight: 1.5, marginBottom: 2 }}>
            Each member follows the settlement settings above. Override one to reveal or hide a single NPC, or to keep them out of imported copies.
          </div>
          {npcs.map(npc => {
            const key = galleryMemberKey(npc);
            const ov = overrides[key] || {};
            const reveal = typeof ov.revealDm === 'boolean' ? ov.revealDm : shareDm;
            const allowImport = typeof ov.allowImport === 'boolean' ? ov.allowImport : importable;
            const safe = key.replace(/[^a-zA-Z0-9_-]/g, '-');
            const revealId = `gm-reveal-${safe}`;
            const importId = `gm-import-${safe}`;
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '5px 0', borderTop: `1px solid ${BORDER}` }}>
                <span style={{ flex: 1, minWidth: 120, fontSize: FS.sm, color: INK }}>
                  <span style={{ fontWeight: 600 }}>{npc.name || 'Unnamed'}</span>
                  {npc.role ? <span style={{ color: SECOND, fontSize: FS.xxs }}> · {npc.role}</span> : null}
                </span>
                <label htmlFor={revealId} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: FS.xxs, fontFamily: sans, color: reveal ? swatch.danger : MUTED, cursor: 'pointer' }}>
                  <input
                    id={revealId}
                    type="checkbox"
                    checked={reveal}
                    aria-label={`Reveal DM content for ${npc.name || 'this member'}`}
                    onChange={e => setFlag(key, 'revealDm', e.target.checked, shareDm)}
                    style={{ accentColor: swatch.danger, cursor: 'pointer' }}
                  />
                  Reveal DM
                </label>
                <label htmlFor={importId} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: FS.xxs, fontFamily: sans, color: allowImport ? INK : MUTED, cursor: 'pointer' }}>
                  <input
                    id={importId}
                    type="checkbox"
                    checked={allowImport}
                    aria-label={`Allow import of ${npc.name || 'this member'}`}
                    onChange={e => setFlag(key, 'allowImport', e.target.checked, importable)}
                    style={{ cursor: 'pointer' }}
                  />
                  Allow import
                </label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
