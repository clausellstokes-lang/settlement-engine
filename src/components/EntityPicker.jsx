/**
 * EntityPicker — multi-select chip input that resolves refIds across the
 * unified prebuilt + custom registry.
 *
 * Used by the Custom Content forms in CompendiumPanel to wire up dependency
 * fields like `produces`, `requires`, `feedsChains`, `requiredInstitution`,
 * etc.
 *
 * Stores refId strings on the parent draft. Renders selected items as chips
 * with a "Custom" badge for custom-source entries and an inline warning for
 * dangling references (target deleted or never existed).
 *
 * Props:
 *   category   - registry category to pick from ('institutions', 'resources',
 *                'stressors', 'tradeGoods', 'resourceChains')
 *   value      - string[] of refIds (or string for single-select mode)
 *   onChange   - (next) => void, receives the new refId array (or string)
 *   single     - if true, restrict to a single value
 *   placeholder
 *   maxSuggestions  - how many suggestions to show (default 12)
 */

import React, { useMemo, useState } from 'react';
import { X, Search, AlertTriangle } from 'lucide-react';
import { useStore } from '../store';
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, sans } from './theme.js';
import { buildRegistry } from '../lib/customRegistry.js';

const PURPLE = '#7c3aed';

export default function EntityPicker({
  category,
  value,
  onChange,
  single = false,
  placeholder = 'Search to add…',
  maxSuggestions = 12,
}) {
  const customContent = useStore(s => s.customContent);
  const registry = useMemo(() => buildRegistry(customContent), [customContent]);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  // Normalize value -> array for internal handling
  const refIds = useMemo(() => {
    if (single) return value ? [value] : [];
    return Array.isArray(value) ? value : [];
  }, [value, single]);

  const selectedSet = useMemo(() => new Set(refIds), [refIds]);

  // Resolve current selections (pairs each refId with its entry or null)
  const selectedEntries = useMemo(() => {
    return refIds.map(r => ({ refId: r, entry: registry.resolve(r) }));
  }, [refIds, registry]);

  // Suggestion list: anything in this category not already selected, filtered
  // by the search query.
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = registry.listAll(category) || [];
    const filtered = all.filter(e => {
      if (selectedSet.has(e.refId)) return false;
      if (!q) return true;
      return (
        (e.name || '').toLowerCase().includes(q) ||
        (e.subcategory || '').toLowerCase().includes(q) ||
        (e.tags || []).some(t => (t || '').toLowerCase().includes(q))
      );
    });
    // custom items first when no query (encourage discovery of own content)
    if (!q) {
      filtered.sort((a, b) => {
        if (a.source !== b.source) return a.source === 'custom' ? -1 : 1;
        return (a.name || '').localeCompare(b.name || '');
      });
    }
    return filtered.slice(0, maxSuggestions);
  }, [query, registry, category, selectedSet, maxSuggestions]);

  const emit = (nextRefIds) => {
    if (single) onChange(nextRefIds[0] || '');
    else onChange(nextRefIds);
  };

  const addRef = (refId) => {
    if (single) {
      emit([refId]);
    } else if (!selectedSet.has(refId)) {
      emit([...refIds, refId]);
    }
    setQuery('');
  };

  const removeRef = (refId) => {
    emit(refIds.filter(r => r !== refId));
  };

  return (
    <div style={{
      border: `1px solid ${BORDER}`, borderRadius: 6,
      background: CARD, padding: 6,
    }}>
      {/* Selected chips */}
      {selectedEntries.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
          {selectedEntries.map(({ refId, entry }) => {
            const missing = !entry;
            const isCustom = entry?.source === 'custom';
            const accent = missing ? '#8b1a1a' : (isCustom ? PURPLE : GOLD);
            const label = entry?.name || (refId.startsWith('custom:')
              ? '(deleted custom)'
              : refId.startsWith('prebuilt:')
                ? `(missing: ${refId.split(':').slice(2).join(':')})`
                : refId);
            return (
              <span
                key={refId}
                title={missing
                  ? `Reference no longer exists: ${refId}`
                  : `${entry.source === 'custom' ? 'Custom · ' : ''}${entry.subcategory || ''}`}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '2px 6px 2px 8px',
                  background: missing ? '#fdebec' : `${accent}14`,
                  border: `1px solid ${accent}55`,
                  borderRadius: 12,
                  fontSize: 11, fontWeight: 600,
                  color: accent, fontFamily: sans,
                }}
              >
                {missing && <AlertTriangle size={9} />}
                <span>{label}</span>
                {isCustom && !missing && (
                  <span style={{
                    fontSize: 8, fontWeight: 800, letterSpacing: '0.05em',
                    background: `${PURPLE}28`, color: PURPLE,
                    borderRadius: 4, padding: '0 3px',
                  }}>CUSTOM</span>
                )}
                <button
                  type="button"
                  onClick={() => removeRef(refId)}
                  style={{
                    background: 'transparent', border: 'none',
                    color: accent, cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center',
                  }}
                  title="Remove"
                >
                  <X size={10} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Search input (hidden when single+selected and not focused) */}
      {(!single || refIds.length === 0 || focused) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 6px',
          border: `1px solid ${focused ? GOLD : BORDER}`,
          borderRadius: 4,
          background: '#fff',
        }}>
          <Search size={11} color={MUTED} />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: sans, fontSize: 12, color: INK,
            }}
          />
        </div>
      )}

      {/* Suggestion dropdown */}
      {focused && suggestions.length > 0 && (
        <div style={{
          marginTop: 4,
          border: `1px solid ${BORDER}`, borderRadius: 4,
          background: '#fff',
          maxHeight: 220, overflowY: 'auto',
          boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
        }}>
          {suggestions.map(s => (
            <button
              key={s.refId}
              type="button"
              onMouseDown={e => { e.preventDefault(); addRef(s.refId); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                padding: '5px 8px', border: 'none', background: 'transparent',
                cursor: 'pointer', textAlign: 'left',
                borderBottom: `1px solid ${BORDER}33`,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#faf6ef')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: INK, flex: 1 }}>
                {s.name}
              </span>
              {s.subcategory && (
                <span style={{ fontSize: 10, color: MUTED }}>
                  {s.subcategory}
                </span>
              )}
              {s.source === 'custom' && (
                <span style={{
                  fontSize: 8, fontWeight: 800, letterSpacing: '0.05em',
                  background: `${PURPLE}20`, color: PURPLE,
                  borderRadius: 4, padding: '1px 4px',
                }}>CUSTOM</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Empty hint */}
      {focused && suggestions.length === 0 && query && (
        <div style={{
          marginTop: 4, padding: '6px 8px',
          fontSize: 11, color: MUTED, fontStyle: 'italic',
          border: `1px dashed ${BORDER}`, borderRadius: 4,
        }}>
          No matches in {category}. Add a custom entry first if needed.
        </div>
      )}

      {/* Validation summary (missing refs) */}
      {selectedEntries.some(s => !s.entry) && (
        <div style={{
          marginTop: 6, padding: '4px 8px',
          background: '#fdebec', border: '1px solid #f0c8cc',
          borderRadius: 4,
          fontSize: 10, color: '#8b1a1a',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <AlertTriangle size={10} />
          <span>
            {selectedEntries.filter(s => !s.entry).length} reference(s) point
            to deleted or missing items. Remove or replace them.
          </span>
        </div>
      )}
    </div>
  );
}

export { SECOND };
