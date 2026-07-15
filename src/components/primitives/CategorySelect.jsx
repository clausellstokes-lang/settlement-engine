/**
 * CategorySelect.jsx — the shared category dropdown for custom content.
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
import { FS, swatch } from '../theme.js';

const NEW = '__new__';
const BORDER = swatch['#D8C8A8'];
const INK = swatch['#1B1408'];
const GOLD = swatch['#8C6F32'];
const MUTED = swatch['#9C8068'];
const sans = '"Nunito", system-ui, sans-serif';

export default function CategorySelect({
  type, value = '', onChange, customContent, style = {},
  // Optional overrides so the same picker drives non-`category` fields (e.g.
  // `satisfies`). `options` supplies the lists directly; builtins may be plain
  // strings (value===label) or { value, label } pairs (e.g. a key-stored field).
  options = null, placeholder = 'Select category…', newLabel = '+ New category…',
}) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');
  const raw = options || categoryOptions(type, customContent);
  const asPair = (b) => (typeof b === 'string' ? { value: b, label: b } : b);
  const builtins = (raw.builtins || []).map(asPair);
  const customs = (raw.customs || []).map((c) => (typeof c === 'string' ? c : c.value));

  if (adding) {
    const commit = () => { const v = text.trim(); setAdding(false); setText(''); if (v) onChange?.(v); };
    return (
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the just-revealed inline name field
          autoFocus
          aria-label="New category name"
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

  const lc = (s) => String(s).toLowerCase();
  const isKnownCustom = value && customs.some((c) => lc(c) === lc(value));
  const isBuiltin = value && builtins.some((b) => lc(b.value) === lc(value));

  return (
    <select
      value={value || ''}
      onChange={(e) => { const v = e.target.value; if (v === NEW) setAdding(true); else onChange?.(v); }}
      style={{ color: INK, ...style }}
    >
      <option value="">{placeholder}</option>
      <optgroup label="Standard">
        {builtins.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
      </optgroup>
      {customs.length > 0 && (
        <optgroup label="Custom">
          {customs.map((c) => <option key={c} value={c}>{c} – Custom</option>)}
        </optgroup>
      )}
      {/* A just-typed value not yet reflected in the derived lists. */}
      {value && !isBuiltin && !isKnownCustom && <option value={value}>{value} – Custom</option>}
      <option value={NEW}>{newLabel}</option>
    </select>
  );
}
