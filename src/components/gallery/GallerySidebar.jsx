import { SlidersHorizontal, X } from 'lucide-react';
import { useId } from 'react';

import { TIER_LABELS } from '../new/design.js';
import Button from '../primitives/Button.jsx';
import {
  BORDER,
  CARD_ALT,
  FS,
  GOLD,
  INK,
  R,
  SP,
  sans,
} from '../theme.js';
import {
  activeFilterCount,
  CULTURE_OPTIONS,
  human,
  MAGIC_OPTIONS,
  PROSPERITY_OPTIONS,
  TERRAIN_OPTIONS,
  TIER_OPTIONS,
} from './galleryUtils.js';

function SidebarSection({ title, count = 0, children }) {
  return (
    <section style={{ display: 'grid', gap: 8 }}>
      <h3 style={{
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: INK,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 950,
        textTransform: 'uppercase',
        letterSpacing: 0,
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
            fontSize: FS.xxs,
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(option => (
        <Button
          key={option}
          variant={selected.has(option) ? 'gold' : 'secondary'}
          size="sm"
          onClick={() => onToggle(option)}
          style={{ textTransform: 'capitalize' }}
        >
          {human(TIER_LABELS[option] || option)}
        </Button>
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
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={12} />}
            onClick={onClear}
            style={{ marginLeft: 'auto', color: GOLD }}
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
      <SidebarSection title="Magic" count={filters.magicLevel?.length || 0}>
        <FilterChips options={MAGIC_OPTIONS} value={filters.magicLevel} onToggle={option => onToggleArray('magicLevel', option)} />
      </SidebarSection>
      <SidebarSection title="Culture" count={filters.culture?.length || 0}>
        <FilterChips options={CULTURE_OPTIONS} value={filters.culture} onToggle={option => onToggleArray('culture', option)} />
      </SidebarSection>
      <SidebarSection title="Prosperity" count={filters.prosperity?.length || 0}>
        <FilterChips options={PROSPERITY_OPTIONS} value={filters.prosperity} onToggle={option => onToggleArray('prosperity', option)} />
      </SidebarSection>
      <SidebarSection title="Surface">
        <div style={{ display: 'grid', gap: 8 }}>
          <ToggleRow checked={filters.importable} label="Importable" onChange={value => onToggleBool('importable', value)} />
          <ToggleRow checked={filters.hasDeity} label="Has patron deity" onChange={value => onToggleBool('hasDeity', value)} />
          <ToggleRow checked={filters.hasImage} label="Has image" onChange={value => onToggleBool('hasImage', value)} />
          <ToggleRow checked={filters.hasComments} label="Has comments" onChange={value => onToggleBool('hasComments', value)} />
          <ToggleRow checked={filters.curatedOnly} label="Curated only" onChange={value => onToggleBool('curatedOnly', value)} />
        </div>
      </SidebarSection>
      </>)}
    </aside>
  );
}
