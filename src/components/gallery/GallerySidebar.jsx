import { Check, X } from 'lucide-react';
import { useId } from 'react';

import useIsMobile from '../../hooks/useIsMobile.js';
import { TIER_LABELS } from '../new/design.js';
import BottomSheet from '../primitives/BottomSheet.jsx';
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
  CULTURE_OPTIONS,
  human,
  MAGIC_OPTIONS,
  PROSPERITY_OPTIONS,
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

/**
 * The filter facet body, shared by the desktop sidebar and the mobile bottom
 * sheet. The Clear control is rendered by the chrome (desktop header / sheet
 * footer) so the body holds only the facet sections.
 */
function FilterBody({ filters, onToggleArray, onToggleBool, isSignedIn }) {
  return (
    <>
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
      <SidebarSection title="Surface" style={{ marginTop: SP.xs }}>
        <div style={{ display: 'grid', gap: SP.sm }}>
          <ToggleRow checked={filters.importable} label="Importable" onChange={value => onToggleBool('importable', value)} />
          <ToggleRow checked={filters.hasDeity} label="Has patron deity" onChange={value => onToggleBool('hasDeity', value)} />
          <ToggleRow checked={filters.hasImage} label="Has image" onChange={value => onToggleBool('hasImage', value)} />
          <ToggleRow checked={filters.hasComments} label="Has comments" onChange={value => onToggleBool('hasComments', value)} />
          <ToggleRow checked={filters.curatedOnly} label="Curated only" onChange={value => onToggleBool('curatedOnly', value)} />
        </div>
      </SidebarSection>
      </>)}
    </>
  );
}

/**
 * Gallery settlements filter facets. On desktop this is the sticky left
 * sidebar (byte-identical to before). On mobile (<640) the full ~30-chip wall
 * would otherwise stack above the results, so the same facet body moves into a
 * BottomSheet behind a single "Filters (N)" trigger — keeping the results in
 * the first viewport. The reflow stacking at 860 is unchanged; this is a
 * separate mobile-only chrome swap.
 *
 * @param {object} props
 * @param {object} props.filters         active facet state
 * @param {(key:string, value:string) => void} props.onToggleArray  multi-select facet toggle
 * @param {(key:string, value:boolean) => void} props.onToggleBool  boolean facet toggle
 * @param {() => void} props.onClear     reset all facets
 * @param {boolean} props.isSignedIn     gates the "yours" facet
 */
export default function GallerySidebar({ filters, onToggleArray, onToggleBool, onClear, isSignedIn }) {
  const isMobile = useIsMobile();
  const active = activeFilterCount(filters);
  const bodyProps = { filters, onToggleArray, onToggleBool, isSignedIn };

  if (isMobile) {
    // Mobile: a single Filters (N) trigger opens the sheet; the facet body and
    // a Clear control live inside it. Button already floors the trigger at 44px.
    return (
      <div style={{ marginBottom: SP.md }}>
        <BottomSheet title="Filters" triggerLabel="Filters" count={active} fullWidthTrigger>
          <div style={{ display: 'grid', gap: SP.lg }}>
            {active > 0 && (
              <Button
                variant="ghost"
                icon={<X size={12} />}
                onClick={onClear}
                aria-label={`Clear all ${active} active filters`}
                style={{ justifySelf: 'start', color: GOLD_TXT }}
              >
                Clear
              </Button>
            )}
            <FilterBody {...bodyProps} />
          </div>
        </BottomSheet>
      </div>
    );
  }

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
        {active > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={12} />}
            onClick={onClear}
            aria-label={`Clear all ${active} active filters`}
            style={{ marginLeft: 'auto', color: GOLD_TXT }}
          >
            Clear
          </Button>
        )}
      </div>
      <FilterBody {...bodyProps} />
    </aside>
  );
}
