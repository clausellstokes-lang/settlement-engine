/**
 * CategorySelect.jsx — the shared category dropdown for custom content (§14).
 *
 * Built-in categories for the type + dynamic "– Custom" categories (any value a
 * user typed that isn't built-in, shared across all types) + a "+ New category…"
 * option that swaps to a text fill-out. The "– Custom" suffix is DISPLAY ONLY —
 * the bare value is stored on the item, so it matches the generation taxonomy.
 *
 * Custom categories live as long as some item uses them: the option list is
 * derived from live customContent by categoryOptions(), so a deleted item's
 * category drops out automatically.
 */
import { useState } from 'react';

import { categoryOptions } from '../../domain/customCategories.js';
import { FS } from '../theme.js';

const NEW = '__new__';
const BORDER = '#d8c8a8';
const INK = '#1B1408';
const GOLD = '#8C6F32';
const MUTED = '#9C8068';
const sans = '"Nunito", system-ui, sans-serif';

export default function CategorySelect({ type, value = '', onChange, customContent, style = {} }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');
  const { builtins, customs } = categoryOptions(type, customContent);

  if (adding) {
    const commit = () => { const v = text.trim(); setAdding(false); setText(''); if (v) onChange?.(v); };
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') { setAdding(false); setText(''); } }}
          placeholder="New category name…"
          style={{ ...style, flex: 1 }}
        />
        <button type="button" onClick={commit} style={{ padding: '4px 9px', border: `1px solid ${GOLD}`, borderRadius: 4, background: 'transparent', color: GOLD, fontFamily: sans, fontSize: FS.xs, fontWeight: 700, cursor: 'pointer' }}>Add</button>
        <button type="button" onClick={() => { setAdding(false); setText(''); }} style={{ padding: '4px 9px', border: `1px solid ${BORDER}`, borderRadius: 4, background: 'transparent', color: MUTED, fontFamily: sans, fontSize: FS.xs, cursor: 'pointer' }}>Cancel</button>
      </div>
    );
  }

  const isKnownCustom = value && customs.some((c) => c.toLowerCase() === value.toLowerCase());
  const isBuiltin = value && builtins.some((c) => c.toLowerCase() === value.toLowerCase());

  return (
    <select
      value={value || ''}
      onChange={(e) => { const v = e.target.value; if (v === NEW) setAdding(true); else onChange?.(v); }}
      style={{ color: INK, ...style }}
    >
      <option value="">Select category…</option>
      <optgroup label="Standard">
        {builtins.map((c) => <option key={c} value={c}>{c}</option>)}
      </optgroup>
      {customs.length > 0 && (
        <optgroup label="Custom">
          {customs.map((c) => <option key={c} value={c}>{c} – Custom</option>)}
        </optgroup>
      )}
      {/* A just-typed value not yet reflected in the derived lists. */}
      {value && !isBuiltin && !isKnownCustom && <option value={value}>{value} – Custom</option>}
      <option value={NEW}>+ New category…</option>
    </select>
  );
}
