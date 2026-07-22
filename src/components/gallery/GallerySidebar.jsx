import { Check } from 'lucide-react';
import { useId } from 'react';

import { TIER_LABELS } from '../new/design.js';
import Button from '../primitives/Button.jsx';
import { FS, INK, sans } from '../theme.js';
import {
  activeFilterCount,
  CULTURE_OPTIONS,
  human,
  MAGIC_OPTIONS,
  PROSPERITY_OPTIONS,
  TERRAIN_OPTIONS,
  TIER_OPTIONS,
} from './galleryUtils.js';
import GalleryFilterShell, { SidebarSection } from './GalleryFilterShell.jsx';

function FilterChips({ options, value = [], onToggle }) {
  const selected = new Set(value);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
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

/**
 * The filter facet body, shared by the desktop sidebar and the mobile bottom
 * sheet. The Clear control is rendered by the chrome (desktop header / sheet
 * body) so this holds only the facet sections.
 */
function FilterBody({ filters, onToggleArray, onToggleBool, isSignedIn }) {
  return (
    <>
      {isSignedIn && (
        <SidebarSection title="Yours">
          <div style={{ display: 'grid', gap: 8 }}>
            <ToggleRow checked={!!filters.mine} label="My settlements only" onChange={value => onToggleBool('mine', value)} />
            <ToggleRow checked={!!filters.unlistedMine} label="My unlisted only" onChange={value => onToggleBool('unlistedMine', value)} />
          </div>
        </SidebarSection>
      )}
      {!filters.mine && !filters.unlistedMine && (<>
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
          <ToggleRow checked={filters.featuredOnly} label="Featured only" onChange={value => onToggleBool('featuredOnly', value)} />
        </div>
      </SidebarSection>
      </>)}
    </>
  );
}

/**
 * Gallery settlements filter facets. The chrome (bordered aside + Filters header +
 * Clear, or the mobile BottomSheet) is the shared GalleryFilterShell (owner order
 * 2026-07-22 — the three gallery tabs share one filter design); this component
 * supplies only the settlement facet body.
 */
export default function GallerySidebar({ filters, onToggleArray, onToggleBool, onClear, isSignedIn }) {
  const active = activeFilterCount(filters);
  return (
    <GalleryFilterShell activeCount={active} onClear={onClear}>
      <FilterBody filters={filters} onToggleArray={onToggleArray} onToggleBool={onToggleBool} isSignedIn={isSignedIn} />
    </GalleryFilterShell>
  );
}
