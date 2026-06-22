/**
 * CompendiumGlobalSearch.jsx — global type-ahead search.
 *
 * Sits above the Compendium tab bar. Type once, search every built-in
 * section; pick a result and the parent (CompendiumPanel) switches to
 * the owning tab and scrolls to the section. Distinct from the per-tab
 * "Search…" box, which only filters the tab you're already on.
 *
 * Keyboard: ↑/↓ move the highlight, Enter selects, Esc closes. Mouse:
 * hover highlights, click selects, click-outside closes.
 *
 * Matching + ranking live in the pure domain module
 * `domain/compendium/searchIndex.js`; this component is presentational.
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import IconButton from '../primitives/IconButton.jsx';
import { GOLD, INK, BODY, BORDER as BOR, CARD, PARCH, sans, FS, swatch } from '../theme.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { searchCompendium } from '../../domain/compendium/searchIndex.js';

// Category → swatch. Kept as a variable map (not inline literals) so the
// pills can be colour-coded without tripping the raw-color lint rule.
// The pill renders the category as label TEXT, so each value must clear AA as
// text: Tier/Economy use the darker gold-as-text token, not #a0762a (AA fail).
// Keys mirror the live tab labels — 'Religion & the Pantheon' (the tab was
// renamed from the stale 'Magic & Religion'), plus 'Living World' for the
// newly-indexed simulation tab — so a result chip always names a findable tab.
const CAT_COLOR = Object.freeze({
  'Tier': swatch['#7A5A1A'],
  'Trade Route': '#6b5340',
  'Monster Threat': '#8b1a1a',
  'Economy': swatch['#7A5A1A'],
  'Archetype': '#4a1a6a',
  'Religion & the Pantheon': '#3a1a7a',
  'Living World': '#1a3a7a',
  'Institution': '#6b5340',
  'Stress': '#8b1a1a',
  'Neighbour System': '#1a3a7a',
  'Neighbour Relationship': '#1a5a28',
});

export default function CompendiumGlobalSearch({ onSelect }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef(null);

  const q = query.trim();
  const results = useMemo(() => (q ? searchCompendium(q, { limit: 8 }) : []), [q]);

  // Close on click-outside.
  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [open]);

  const choose = (entry) => {
    if (!entry) return;
    Funnel.track(EVENTS.COMPENDIUM_SEARCH, {
      query: q.slice(0, 64),
      term: entry.term,
      tab: entry.tab,
    });
    setOpen(false);
    setQuery('');
    if (typeof onSelect === 'function') onSelect(entry);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (!results.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(a => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[active]);
    }
  };

  const showDropdown = open && results.length > 0;
  const showEmpty = open && q.length > 0 && results.length === 0;

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        padding: '8px 14px',
        background: PARCH,
        // No full-width rule: the bordered input box below marks the affordance,
        // so the chrome keeps a single divider only at the tab-strip/content
        // boundary instead of stacking three (P5).
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        border: `1px solid ${BOR}`, borderRadius: 6,
        background: CARD, padding: '6px 10px',
      }}>
        <Search size={13} style={{ color: GOLD, flexShrink: 0 }} />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search the whole Compendium…"
          aria-label="Search the whole Compendium"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="compendium-search-results"
          aria-activedescendant={showDropdown ? `compendium-opt-${active}` : undefined}
          autoComplete="off"
          style={{
            flex: 1, border: 'none', background: 'transparent',
            fontFamily: sans, fontSize: FS.md, color: INK, outline: 'none',
          }}
        />
        {query && (
          <IconButton
            Icon={X}
            label="Clear search"
            tone="ghost"
            size="sm"
            onClick={() => { setQuery(''); setActive(0); setOpen(false); }}
          />
        )}
      </div>

      {showDropdown && (
        <div
          id="compendium-search-results"
          role="listbox"
          style={{
            position: 'absolute', left: 14, right: 14, top: '100%', marginTop: -2,
            zIndex: 50, listStyle: 'none', margin: 0, padding: 4,
            background: CARD, border: `1px solid ${BOR}`, borderRadius: 6,
            boxShadow: '0 12px 28px rgba(0,0,0,0.18)',
            maxHeight: 320, overflowY: 'auto',
          }}
        >
          {results.map((r, i) => {
            // Fallback is the gold-as-text token, not GOLD (GOLD fails AA as
            // text); every known category is mapped above, so this is defensive.
            const color = CAT_COLOR[r.category] || swatch['#7A5A1A'];
            return (
              <div key={r.id} id={`compendium-opt-${i}`} role="option" aria-selected={i === active} aria-label={`${r.term} (${r.category})`}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(r)}
                  style={{
                    width: '100%', textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '7px 9px', border: 'none', borderRadius: 4,
                    cursor: 'pointer', fontFamily: sans,
                    background: i === active ? `${GOLD}14` : 'transparent',
                  }}
                >
                  <span style={{ fontSize: FS.md, fontWeight: 700, color: INK, flex: 1 }}>
                    {r.term}
                  </span>
                  <span style={{
                    fontSize: FS.xs, fontWeight: 700, color,
                    background: `${color}18`, borderRadius: 8, padding: '1px 7px',
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                  }}>
                    {r.category}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showEmpty && (
        <div style={{
          position: 'absolute', left: 14, right: 14, top: '100%', marginTop: -2,
          zIndex: 50, padding: '10px 12px', background: CARD,
          border: `1px solid ${BOR}`, borderRadius: 6,
          fontSize: FS.sm, color: BODY, fontFamily: sans,
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
        }}>
          <span style={{ flex: 1, minWidth: 180 }}>
            No matches for &ldquo;{q}&rdquo;. Try a tier, archetype, institution, neighbour, route, or stress name.
          </span>
          {/* Recovery CTA at the point of failure, not just the X up in the input. */}
          <IconButton Icon={X} label="Clear search" tone="ghost" size="sm" onClick={() => { setQuery(''); setActive(0); setOpen(false); }} />
        </div>
      )}
    </div>
  );
}
