// Filter sidebar for the gallery MAPS tab. Mirrors GallerySidebar's structure
// (SidebarSection + chip rows + ToggleRow + Clear) but over map facets:
// backdrop, the importable toggle, and the dynamic tag vocabulary.
//
// The kind facet and the has-settlements toggle were struck when GALLERY-2
// phase 2 split campaign shares onto their own Campaigns tab: this tab is
// narrowed server-side to blank maps (kind=['map']), which carry no
// settlements, so both facets could only ever return the full set or nothing.
//
// Icons are OFF here — the gallery is not the Realm map surface, so chips are
// text/glyph only (gated Button primitives, variant gold/secondary). Theme
// tokens only; no raw hex or font sizes.
import { useId } from 'react';

import { FS, INK, SP, sans } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { activeMapFilterCount, BACKDROP_OPTIONS } from './galleryMapsFilters.js';
import { human } from './galleryUtils.js';
import GalleryFilterShell, { SidebarSection } from './GalleryFilterShell.jsx';

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

// The map facet body, shared by the desktop sidebar and the mobile sheet. The
// Clear control is rendered by the chrome so the body holds only the facets.
//
// `showHasSettlements` gates the has-settlements toggle: it is OFF for the Maps
// tab (pinned to blank maps, which carry no members — the facet could only ever
// return the full set or nothing) and ON for the Campaigns tab (map_with_campaign
// tiles carry a real member_count, so member_count > 0 is a meaningful filter the
// list_gallery_maps RPC honors — migration 090's hasSettlements arm).
function MapFilterBody({ filters, tagVocabulary = [], onToggleArray, onToggleBool, showHasSettlements = false }) {
  return (
    <>
      <SidebarSection title="Backdrop" count={filters.backdrop?.length || 0}>
        <PairChips options={BACKDROP_OPTIONS} value={filters.backdrop} onToggle={option => onToggleArray('backdrop', option)} />
      </SidebarSection>

      <SidebarSection title="Contents">
        <div style={{ display: 'grid', gap: SP.sm }}>
          {showHasSettlements && (
            <ToggleRow
              checked={!!filters.hasSettlements}
              label="Has settlements"
              onChange={value => onToggleBool('hasSettlements', value)}
            />
          )}
          <ToggleRow
            checked={!!filters.importable}
            label="Importable only"
            onChange={value => onToggleBool('importable', value)}
          />
        </div>
      </SidebarSection>

      {tagVocabulary.length > 0 && (
        <SidebarSection title="Tags" count={filters.tags?.length || 0}>
          <TagChips options={tagVocabulary} value={filters.tags} onToggle={option => onToggleArray('tags', option)} />
        </SidebarSection>
      )}
    </>
  );
}

/**
 * Gallery maps filter facets. Desktop: the sticky sidebar (byte-identical).
 * Mobile (<640): the facet wall moves into a BottomSheet behind a single
 * "Filters (N)" trigger, mirroring the settlements tab, so the map grid is not
 * pushed below a tall chip wall.
 *
 * @param {object} props
 * @param {object} props.filters         active map facet state
 * @param {string[]} [props.tagVocabulary]  dynamic tag options
 * @param {(key:string, value:string) => void} props.onToggleArray
 * @param {(key:string, value:boolean) => void} props.onToggleBool
 * @param {() => void} props.onClear
 * @param {boolean} [props.showHasSettlements]  show the has-settlements toggle
 *   (Campaigns tab only; struck on the blank-maps tab)
 */
export default function GalleryMapsSidebar({ filters, tagVocabulary = [], onToggleArray, onToggleBool, onClear, showHasSettlements = false }) {
  const activeCount = activeMapFilterCount(filters);
  return (
    <GalleryFilterShell activeCount={activeCount} onClear={onClear}>
      <MapFilterBody
        filters={filters}
        tagVocabulary={tagVocabulary}
        onToggleArray={onToggleArray}
        onToggleBool={onToggleBool}
        showHasSettlements={showHasSettlements}
      />
    </GalleryFilterShell>
  );
}
