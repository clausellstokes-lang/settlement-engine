/**
 * CatalogPicker — searchable catalog list shared by the Settlement Editor's
 * roster sections and the Make Changes composer's catalog-backed events
 * (ADD_INSTITUTION). One implementation so the two surfaces can't drift apart.
 *
 * Two modes:
 *   - default (closeOnPick=false): a "roster add" list. Clicking an item calls
 *     onAdd and the panel stays open so the user can add several in a row.
 *   - closeOnPick=true: a single-select picker. Clicking an item calls onAdd
 *     and collapses the panel — used where the choice fills one field (the
 *     event target) rather than a growing list.
 *
 * Items are { id?, name, category?, desc?|description?, tags?, isCustom?,
 * alreadyAdded? }.
 */
import { useState, useMemo } from 'react';
import { Plus, X } from 'lucide-react';
import { GOLD, INK, MUTED, SECOND, BORDER, sans, FS, swatch, CARD_ALT } from '../theme.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

export default function CatalogPicker({
  items,
  onAdd,
  placeholder,
  categoryFilters,
  closeOnPick = false,
  triggerLabel,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filtered = useMemo(() => {
    let list = items;
    if (catFilter !== 'All') list = list.filter(i => i.category === catFilter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(i =>
        (i.name || '').toLowerCase().includes(q) ||
        (i.desc || i.description || '').toLowerCase().includes(q) ||
        (i.category || '').toLowerCase().includes(q) ||
        (i.tags || []).some(t => (t || '').toLowerCase().includes(q))
      );
    }
    return list.slice(0, 30);
  }, [items, query, catFilter]);

  const collapse = () => { setOpen(false); setQuery(''); setCatFilter('All'); };

  const handlePick = (item) => {
    onAdd(item);
    if (closeOnPick) collapse();
  };

  if (!open) {
    return (
      <Button variant="gold" size="sm" icon={<Plus size={11}/>} onClick={() => setOpen(true)} style={{ marginTop:6 }}>
        {triggerLabel || `Add from catalog (${items.length} available)`}
      </Button>
    );
  }

  return (
    <div style={{ marginTop:6, border:`1px solid ${BORDER}`, borderRadius:6, background:CARD_ALT, overflow:'hidden' }}>
      {/* Search bar */}
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', borderBottom:`1px solid ${BORDER}` }}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus -- focus the search field when the picker panel expands */}
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder={placeholder || 'Search catalog...'} aria-label={placeholder || 'Search catalog'} autoFocus style={{ flex:1, border:'none', background:'transparent', fontSize:FS.xs, fontFamily:sans, color:INK, outline:'none' }}/>
        <IconButton Icon={X} label="Close catalog" tone="ghost" size="md" onClick={collapse}/>
      </div>

      {/* Category filter pills */}
      {categoryFilters && categoryFilters.length > 1 && (
        <div style={{ display:'flex', gap:3, padding:'4px 8px', flexWrap:'wrap', borderBottom:`1px solid ${BORDER}` }}>
          {['All', ...categoryFilters].map(c => (
            <Button key={c} variant={catFilter===c ? 'gold' : 'ghost'} size="sm" aria-pressed={catFilter===c} onClick={() => setCatFilter(c)}
              style={{ minHeight:'auto', padding:'1px 7px', borderRadius:8, fontSize:FS.micro, fontWeight:catFilter===c?700:500, border:`1px solid ${catFilter===c?GOLD:BORDER}`, color:catFilter===c?GOLD:SECOND }}>
              {c}
            </Button>
          ))}
        </div>
      )}

      {/* Results */}
      <div style={{ maxHeight:200, overflowY:'auto', padding:4 }}>
        {filtered.length === 0 ? (
          <div style={{ padding:'8px 6px', fontSize:FS.xxs, color:MUTED, textAlign:'center' }}>No matching items</div>
        ) : filtered.map(item => (
          <button type="button" key={item.id || item.name} onClick={() => handlePick(item)}
            style={{ width:'100%', display:'flex', alignItems:'flex-start', gap:6, padding:'5px 8px', border:'none', background:'none', cursor:'pointer', borderRadius:4, textAlign:'left', fontFamily:sans }}
            onMouseEnter={e => e.currentTarget.style.background='#f0ebe0'}
            onMouseLeave={e => e.currentTarget.style.background='none'}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:FS.xs, fontWeight:600, color:INK, display:'flex', alignItems:'center', gap:4 }}>
                {item.name}
                {item.isCustom && <span style={{ fontSize:FS.nano, fontWeight:800, color:swatch['#7C3AED'], background:'rgba(124,58,237,0.12)', borderRadius:3, padding:'0 4px' }}>Custom</span>}
              </div>
              {item.desc && <div style={{ fontSize:FS.micro, color:MUTED, lineHeight:1.3, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.desc}</div>}
            </div>
            {item.category && <span style={{ fontSize:FS.micro, fontWeight:600, color:SECOND, background:`${SECOND}10`, borderRadius:3, padding:'1px 5px', flexShrink:0 }}>{item.category}</span>}
            {item.alreadyAdded && <span style={{ fontSize:FS.micro, color:MUTED, fontStyle:'italic' }}>Added</span>}
          </button>
        ))}
        {items.length > 30 && !query && <div style={{ padding:'4px 8px', fontSize:FS.micro, color:MUTED, textAlign:'center' }}>Search to see more...</div>}
      </div>
    </div>
  );
}
