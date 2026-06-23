// Filter sidebar for the gallery MAPS tab. Mirrors GallerySidebar's structure
// (SidebarSection + chip rows + ToggleRow + Clear) but over map facets: kind,
// backdrop, a has-settlements toggle, and the dynamic tag vocabulary.
//
// Icons are OFF here — the gallery is not the Realm map surface, so chips are
// text/glyph only (gated Button primitives, variant gold/secondary). Theme
// tokens only; no raw hex or font sizes.
import { useId } from 'react';

import {
  CARD_ALT,
  FS,
  GOLD,
  GOLD_TXT,
  INK,
  R,
  SP,
  sans,
} from '../theme.js';
import Button from '../primitives/Button.jsx';
import {
  activeMapFilterCount,
  BACKDROP_OPTIONS,
  human,
  KIND_OPTIONS,
} from './galleryMapsUtils.js';

function SidebarSection({ title, count = 0, children, style }) {
  return (
    <section style={{ display: 'grid', gap: SP.sm, ...style }}>
      <h3 style={{
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: SP.xs,
        color: INK,
        fontFamily: sans,
        fontSize: FS.sm,
        fontWeight: 950,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
      }}>
        {title}
        {count > 0 && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 16,
            height: 16,
            padding: '0 5px',
            borderRadius: 999,
            background: GOLD,
            color: INK,
            fontFamily: sans,
            fontSize: FS.xs,
            fontWeight: 950,
          }}>
            {count}
          </span>
        )}
      </h3>
      {children}
    </section>
  );
}

// Chips over [value, label] pairs (kind/backdrop). Text only — no icon — so the
// chip reads as a glyph toggle, not a Realm-map control.
function PairChips({ options, value = [], onToggle }) {
  const selected = new Set(value);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
      {options.map(([id, label]) => {
        const isOn = selected.has(id);
        return (
          <Button
            key={id}
            variant={isOn ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => onToggle(id)}
            aria-pressed={isOn}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
}

// Chips over the dynamic tag vocabulary (plain string values).
function TagChips({ options, value = [], onToggle }) {
  const selected = new Set(value);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
      {options.map(tag => {
        const isOn = selected.has(tag);
        return (
          <Button
            key={tag}
            variant={isOn ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => onToggle(tag)}
            aria-pressed={isOn}
            style={{ textTransform: 'capitalize' }}
          >
            {human(tag)}
          </Button>
        );
      })}
    </div>
  );
}

function ToggleRow({ checked, label, onChange }) {
  const inputId = useId();
  return (
    <label htmlFor={inputId} style={{
      display: 'flex',
      alignItems: 'center',
      gap: SP.sm,
      color: INK,
      fontFamily: sans,
      fontSize: FS.xs,
      fontWeight: 850,
      cursor: 'pointer',
    }}>
      <input id={inputId} type="checkbox" aria-label={label} checked={checked} onChange={event => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

export default function GalleryMapsSidebar({ filters, tagVocabulary = [], onToggleArray, onToggleBool, onClear }) {
  const activeCount = activeMapFilterCount(filters);
  return (
    <aside className="gallery-sidebar-panel" style={{
      display: 'grid',
      gap: SP.lg,
      alignSelf: 'start',
      padding: SP.md,
      borderRadius: R.lg,
      background: CARD_ALT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm }}>
        <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950 }}>
          Filters
        </h2>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            aria-label={`Clear all ${activeCount} active filters`}
            style={{ marginLeft: 'auto', color: GOLD_TXT }}
          >
            Clear
          </Button>
        )}
      </div>

      <SidebarSection title="Kind" count={filters.kind?.length || 0}>
        <PairChips options={KIND_OPTIONS} value={filters.kind} onToggle={option => onToggleArray('kind', option)} />
      </SidebarSection>

      <SidebarSection title="Backdrop" count={filters.backdrop?.length || 0}>
        <PairChips options={BACKDROP_OPTIONS} value={filters.backdrop} onToggle={option => onToggleArray('backdrop', option)} />
      </SidebarSection>

      <SidebarSection title="Settlements">
        <ToggleRow
          checked={!!filters.hasSettlements}
          label="Has settlements"
          onChange={value => onToggleBool('hasSettlements', value)}
        />
      </SidebarSection>

      <SidebarSection title="Import">
        <ToggleRow
          checked={!!filters.importable}
          label="Importable only"
          onChange={value => onToggleBool('importable', value)}
        />
      </SidebarSection>

      {tagVocabulary.length > 0 && (
        <SidebarSection title="Tags" count={filters.tags?.length || 0}>
          <TagChips options={tagVocabulary} value={filters.tags} onToggle={option => onToggleArray('tags', option)} />
        </SidebarSection>
      )}
    </aside>
  );
}
