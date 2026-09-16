import { useMemo, useRef, useState } from 'react';
import {
  BODY,
  BORDER,
  CARD,
  FS,
  GOLD_SOFT,
  INK,
  SECOND,
} from '../../theme.js';
import Button from '../../primitives/Button.jsx';

const panelStyle = {
  border: `1px solid ${BORDER}`,
  borderRadius: 0,
  background: CARD,
  color: INK,
};

const controlStyle = {
  minHeight: 36,
  border: `1px solid ${BORDER}`,
  borderRadius: 0,
  background: CARD,
  color: INK,
  font: 'inherit',
};

function normalized(value) {
  return String(value || '').trim().toLowerCase();
}

function semanticPriority(semantic) {
  if (semantic.entityKind === 'district') return 0;
  if (
    semantic.entityKind === 'building'
    && semantic.canonicalRef?.kind === 'institution'
    && semantic.label
  ) return 1;
  if (semantic.entityKind === 'gate') return 2;
  if (['road', 'wall', 'water', 'bridge', 'quay'].includes(semantic.entityKind)) return 3;
  return 4;
}

function cameraLabel(preset) {
  if (preset.label || preset.name) return preset.label || preset.name;
  return String(preset.id || 'view')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * The canvas is never the settlement's accessibility tree. This companion
 * exposes the same stable semantic ids as conventional buttons, with search,
 * district grouping, roving list focus, and named camera controls.
 */
export default function TownSceneSemanticList({
  semantics = [],
  districts = [],
  cameraPresets = [],
  selectedNodeId = null,
  selectedCameraId = null,
  onSelect,
  onRequestCamera,
}) {
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const districtNames = useMemo(() => new Map(
    districts.map((district) => [
      district.id || district.districtId,
      district.label || district.name || 'Unassigned district',
    ]),
  ), [districts]);
  const ordered = useMemo(() => {
    const needle = normalized(query);
    return semantics
      .filter((semantic) => {
        if (!needle) return true;
        return [
          semantic.label,
          semantic.entityKind,
          districtNames.get(semantic.districtId),
        ].some((value) => normalized(value).includes(needle));
      })
      .sort((a, b) => {
        const priority = semanticPriority(a) - semanticPriority(b);
        if (priority) return priority;
        const left = String(a.label || a.sceneId);
        const right = String(b.label || b.sceneId);
        return left < right ? -1 : left > right ? 1 : 0;
      });
  }, [districtNames, query, semantics]);
  // Generated fabric, route segments, and retaining walls remain available
  // under "Show all" without burying the places a GM names at the table.
  const collapsed = useMemo(
    () => ordered.filter((semantic) => semanticPriority(semantic) <= 2).slice(0, 24),
    [ordered],
  );
  const visible = expanded || query ? ordered : collapsed;
  const hiddenCount = Math.max(0, ordered.length - collapsed.length);

  const onListKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setQuery('');
      onSelect?.(null, null);
      searchRef.current?.focus();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...(listRef.current?.querySelectorAll('[data-town-scene-semantic]') || [])];
    if (!buttons.length) return;
    event.preventDefault();
    const current = buttons.indexOf(document.activeElement);
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = buttons.length - 1;
    else if (event.key === 'ArrowDown') next = Math.min(buttons.length - 1, current + 1);
    else next = Math.max(0, current < 0 ? 0 : current - 1);
    buttons[next]?.focus();
  };

  return (
    <section aria-labelledby="town-scene-places-title" style={{ ...panelStyle, padding: 12 }}>
      <h3 id="town-scene-places-title" style={{ margin: 0, fontSize: FS.sm }}>
        Settlement in words
      </h3>
      <p style={{ margin: '4px 0 10px', fontSize: FS.xs, color: BODY }}>
        Search or move through the same places shown in the portrait.
      </p>

      {cameraPresets.length > 0 && (
        <div aria-label="Camera views" role="group" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {cameraPresets.map((preset) => (
            <Button
              key={preset.id}
              size="sm"
              variant="secondary"
              aria-pressed={selectedCameraId === preset.id}
              onClick={() => onRequestCamera?.(preset)}
              style={{
                ...controlStyle,
                padding: '5px 9px',
                background: selectedCameraId === preset.id ? GOLD_SOFT : controlStyle.background,
                cursor: 'pointer',
              }}
            >
              {cameraLabel(preset)}
            </Button>
          ))}
        </div>
      )}

      <label htmlFor="town-scene-place-search" style={{ display: 'grid', gap: 4, fontSize: FS.xs, fontWeight: 700 }}>
        Find a place
        <input
          ref={searchRef}
          id="town-scene-place-search"
          type="search"
          aria-label="Find a settlement place"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onListKeyDown}
          placeholder="Market, gate, district…"
          style={{ ...controlStyle, padding: '6px 9px' }}
        />
      </label>

      <div
        ref={listRef}
        role="list"
        aria-label="Settlement places"
        style={{ display: 'grid', gap: 5, marginTop: 10, maxHeight: 330, overflowY: 'auto' }}
      >
        {visible.map((semantic) => {
          const selected = semantic.sceneId === selectedNodeId;
          const district = districtNames.get(semantic.districtId);
          return (
            <div key={semantic.sceneId} role="listitem">
              <Button
                size="sm"
                variant="secondary"
                data-town-scene-semantic={semantic.sceneId}
                aria-current={selected ? 'true' : undefined}
                onClick={() => onSelect?.(semantic.sceneId, semantic)}
                onKeyDown={onListKeyDown}
                style={{
                  ...controlStyle,
                  width: '100%',
                  minHeight: 44,
                  padding: '7px 9px',
                  display: 'grid',
                  gap: 2,
                  textAlign: 'left',
                  background: selected ? GOLD_SOFT : CARD,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: FS.sm, fontWeight: 800 }}>{semantic.label || 'Unnamed place'}</span>
                <span style={{ fontSize: FS.xs, color: SECOND }}>
                  {[semantic.entityKind, district].filter(Boolean).join(' · ')}
                </span>
              </Button>
            </div>
          );
        })}
        {visible.length === 0 && (
          <p role="status" style={{ margin: 0, padding: 8, fontSize: FS.xs, color: BODY }}>
            No visible places match that search.
          </p>
        )}
      </div>

      {hiddenCount > 0 && !query && (
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setExpanded((value) => !value)}
          style={{ ...controlStyle, marginTop: 8, padding: '5px 9px', cursor: 'pointer' }}
        >
          {expanded ? 'Show named places first' : `Show ${hiddenCount} more map features`}
        </Button>
      )}
    </section>
  );
}
