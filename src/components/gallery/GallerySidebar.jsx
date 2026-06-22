import { Check, SlidersHorizontal, X } from 'lucide-react';
import { useId } from 'react';

import { TIER_LABELS } from '../new/design.js';
import Button from '../primitives/Button.jsx';
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
import {
  activeFilterCount,
  GOVERNMENT_OPTIONS,
  human,
  MAGIC_OPTIONS,
  STABILITY_OPTIONS,
  TERRAIN_OPTIONS,
  TIER_OPTIONS,
} from './galleryUtils.js';

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

function FilterChips({ options, value = [], onToggle }) {
  const selected = new Set(value);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
      {options.map(option => {
        const isOn = selected.has(option);
        return (
          <Button
            key={option}
            variant={isOn ? 'gold' : 'secondary'}
            size="sm"
            onClick={() => onToggle(option)}
            aria-pressed={isOn}
            icon={isOn ? <Check size={12} /> : undefined}
            style={{ textTransform: 'capitalize' }}
          >
            {human(TIER_LABELS[option] || option)}
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

export default function GallerySidebar({ filters, onToggleArray, onToggleBool, onClear, isSignedIn }) {
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
        <SlidersHorizontal size={15} color={GOLD} />
        <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950 }}>
          Filters
        </h2>
        {activeFilterCount(filters) > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={12} />}
            onClick={onClear}
            aria-label={`Clear all ${activeFilterCount(filters)} active filters`}
            style={{ marginLeft: 'auto', color: GOLD_TXT }}
          >
            Clear
          </Button>
        )}
      </div>
      {isSignedIn && (
        <SidebarSection title="Yours">
          <ToggleRow checked={!!filters.mine} label="My settlements only" onChange={value => onToggleBool('mine', value)} />
        </SidebarSection>
      )}
      {!filters.mine && (<>
      <SidebarSection title="Tier" count={filters.tier?.length || 0}>
        <FilterChips options={TIER_OPTIONS} value={filters.tier} onToggle={option => onToggleArray('tier', option)} />
      </SidebarSection>
      <SidebarSection title="Terrain" count={filters.terrain?.length || 0}>
        <FilterChips options={TERRAIN_OPTIONS} value={filters.terrain} onToggle={option => onToggleArray('terrain', option)} />
      </SidebarSection>
      <SidebarSection title="Government" count={filters.governmentType?.length || 0}>
        <FilterChips options={GOVERNMENT_OPTIONS} value={filters.governmentType} onToggle={option => onToggleArray('governmentType', option)} />
      </SidebarSection>
      <SidebarSection title="Magic" count={filters.magicLevel?.length || 0}>
        <FilterChips options={MAGIC_OPTIONS} value={filters.magicLevel} onToggle={option => onToggleArray('magicLevel', option)} />
      </SidebarSection>
      <SidebarSection title="Stability" count={filters.stability?.length || 0}>
        <FilterChips options={STABILITY_OPTIONS} value={filters.stability} onToggle={option => onToggleArray('stability', option)} />
      </SidebarSection>
      <SidebarSection title="Surface" style={{ marginTop: SP.xs }}>
        <div style={{ display: 'grid', gap: SP.sm }}>
          <ToggleRow checked={filters.hasImage} label="Has image" onChange={value => onToggleBool('hasImage', value)} />
          <ToggleRow checked={filters.hasComments} label="Has comments" onChange={value => onToggleBool('hasComments', value)} />
          <ToggleRow checked={filters.curatedOnly} label="Curated only" onChange={value => onToggleBool('curatedOnly', value)} />
        </div>
      </SidebarSection>
      </>)}
    </aside>
  );
}
