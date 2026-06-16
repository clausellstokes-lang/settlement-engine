import { SlidersHorizontal, X } from 'lucide-react';
import { useId } from 'react';

import { TIER_LABELS } from '../new/design.js';
import {
  BORDER,
  BORDER2,
  CARD,
  CARD_ALT,
  FS,
  GOLD,
  GOLD_BG,
  INK,
  R,
  SECOND,
  SP,
  sans,
} from '../theme.js';
import {
  activeFilterCount,
  GOVERNMENT_OPTIONS,
  human,
  MAGIC_OPTIONS,
  STABILITY_OPTIONS,
  TERRAIN_OPTIONS,
  TIER_OPTIONS,
} from './galleryUtils.js';

function chipStyle(active) {
  return {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: 26,
    padding: '4px 8px',
    border: `1px solid ${active ? GOLD : BORDER2}`,
    borderRadius: R.sm,
    background: active ? GOLD_BG : CARD,
    color: active ? GOLD : SECOND,
    fontFamily: sans,
    fontSize: FS.xxs,
    fontWeight: 850,
    textTransform: 'capitalize',
    cursor: 'pointer',
  };
}

function SidebarSection({ title, children }) {
  return (
    <section style={{ display: 'grid', gap: 8 }}>
      <h3 style={{
        margin: 0,
        color: INK,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 950,
        textTransform: 'uppercase',
        letterSpacing: 0,
      }}>
        {title}
      </h3>
      {children}
    </section>
  );
}

function FilterChips({ options, value = [], onToggle }) {
  const selected = new Set(value);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(option => (
        <button
          key={option}
          type="button"
          onClick={() => onToggle(option)}
          style={chipStyle(selected.has(option))}
        >
          {human(TIER_LABELS[option] || option)}
        </button>
      ))}
    </div>
  );
}

function ToggleRow({ checked, label, onChange }) {
  const inputId = useId();
  return (
    <label htmlFor={inputId} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
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

export default function GallerySidebar({ filters, onToggleArray, onToggleBool, onClear, isSignedIn }) {
  return (
    <aside className="gallery-sidebar-panel" style={{
      display: 'grid',
      gap: SP.lg,
      alignSelf: 'start',
      padding: SP.md,
      border: `1px solid ${BORDER}`,
      borderRadius: R.lg,
      background: CARD_ALT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SlidersHorizontal size={15} color={GOLD} />
        <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950 }}>
          Filters
        </h2>
        {activeFilterCount(filters) > 0 && (
          <button
            type="button"
            onClick={onClear}
            style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              border: 'none',
              background: 'transparent',
              color: GOLD,
              fontFamily: sans,
              fontSize: FS.xs,
              fontWeight: 850,
              cursor: 'pointer',
            }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>
      {isSignedIn && (
        <SidebarSection title="Yours">
          <ToggleRow checked={!!filters.mine} label="My settlements only" onChange={value => onToggleBool('mine', value)} />
        </SidebarSection>
      )}
      {!filters.mine && (<>
      <SidebarSection title="Tier">
        <FilterChips options={TIER_OPTIONS} value={filters.tier} onToggle={option => onToggleArray('tier', option)} />
      </SidebarSection>
      <SidebarSection title="Terrain">
        <FilterChips options={TERRAIN_OPTIONS} value={filters.terrain} onToggle={option => onToggleArray('terrain', option)} />
      </SidebarSection>
      <SidebarSection title="Government">
        <FilterChips options={GOVERNMENT_OPTIONS} value={filters.governmentType} onToggle={option => onToggleArray('governmentType', option)} />
      </SidebarSection>
      <SidebarSection title="Magic">
        <FilterChips options={MAGIC_OPTIONS} value={filters.magicLevel} onToggle={option => onToggleArray('magicLevel', option)} />
      </SidebarSection>
      <SidebarSection title="Stability">
        <FilterChips options={STABILITY_OPTIONS} value={filters.stability} onToggle={option => onToggleArray('stability', option)} />
      </SidebarSection>
      <SidebarSection title="Surface">
        <div style={{ display: 'grid', gap: 8 }}>
          <ToggleRow checked={filters.hasImage} label="Has image" onChange={value => onToggleBool('hasImage', value)} />
          <ToggleRow checked={filters.hasComments} label="Has comments" onChange={value => onToggleBool('hasComments', value)} />
          <ToggleRow checked={filters.curatedOnly} label="Curated only" onChange={value => onToggleBool('curatedOnly', value)} />
        </div>
      </SidebarSection>
      </>)}
    </aside>
  );
}
