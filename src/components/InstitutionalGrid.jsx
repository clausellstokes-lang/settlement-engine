import React, { useState, useMemo, useEffect, useRef } from 'react';
import {filterCatalogForMagic} from '../domain/magicFilter.js';
import ControlsStrip from './ControlsStrip.jsx';
import { GOLD as gold, INK as ink, MUTED as muted, BORDER as border, sans, FS, swatch, MUTED } from './theme.js';
import { useStore } from '../store/index.js';
import { selectTierForGrid, selectCurrentCatalog, selectTierInstitutionNames, selectIsManualTier } from '../store/selectors.js';
// Import from lookups.js directly (not engine.js) - keeps the
// generator pipeline out of this component's synchronous import graph.
import { getInstitutionalCatalog, getFullCatalogWithTierMeta } from '../generators/lookups.js';

const CAT_COLORS = {
  Essential:      '#1a4a20',
  Economy:        '#a0762a',
  Crafts:         '#8b5a2a',
  Religious:      '#1a5a28',
  Government:     '#2a3a7a',
  Infrastructure: '#3a5a6a',
  Defense:        '#8b1a1a',
  Magic:          '#5a2a8a',
  Adventuring:    '#2a5a8a',
  Criminal:       '#4a1a4a',
  Entertainment:  '#5a3a1a',
};

function getToggleState(toggles, tier, category, name, isOutOfTier = false) {
  const key = `${tier}::${category}::${name}`;
  const explicit = toggles[key];
  if (explicit) return explicit;
  // Out-of-tier institutions default to excluded (not allow)
  return isOutOfTier
    ? { allow: false, require: false, forceExclude: false, _autoExcluded: true }
    : { allow: true,  require: false, forceExclude: false };
}

// eslint-disable-next-line no-unused-vars -- kept for potential reuse; render path bypasses it
function OutOfTierSection({ category, institutions, tier, toggles, onToggle, forcedCount, allCollapsed }) {
  const [open, setOpen] = React.useState(false);
  const instCount = Object.keys(institutions).length;
  if (instCount === 0) return null;

  // Override getToggleState for out-of-tier: default is EXCLUDED (allow:false), not allow:true
  const getOutToggleState = (name) => {
    const key = `${tier}::${category}::${name}`;
    const explicit = toggles[key];
    if (explicit) return explicit;
    return { allow: false, require: false, forceExclude: false }; // excluded by default
  };

  const handleToggle = (name, _instDef) => {
    const cur = getOutToggleState(name);
    const key = `${tier}::${category}::${name}`;
    // Cycle: excluded → forced → excluded (no "allow" for out-of-tier)
    if (cur.require) {
      onToggle(key, { allow: false, require: false, forceExclude: false }); // back to excluded
    } else {
      onToggle(key, { allow: false, require: true, forceExclude: false }); // force in
    }
  };

  return (
    <div style={{ marginBottom: 6 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 10px', background: swatch['#F5F0E8'],
          border: '1px dashed #c8b89a', borderRadius: 5,
          cursor: 'pointer', textAlign: 'left', marginBottom: open ? 4 : 0,
        }}
      >
        <span style={{ fontSize: FS.xxs, color: MUTED }}>▸</span>
        <span style={{ fontSize: FS.xxs, fontWeight: 700, color: MUTED, flex: 1,
          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Other-tier options ({instCount})
        </span>
        {forcedCount > 0 && (
          <span style={{ fontSize: FS.micro, fontWeight: 800, color: swatch['#8A3010'],
            background: swatch['#FDF0E8'], border: '1px solid #d8a080',
            borderRadius: 3, padding: '1px 6px' }}>
            {forcedCount} forced in
          </span>
        )}
        <span style={{ fontSize: FS.micro, color: MUTED, fontStyle: 'italic' }}>
          {open ? '▲ hide' : '▼ show'}
        </span>
      </button>

      {open && !allCollapsed && (
        <div style={{ paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: FS.xxs, color: MUTED, fontStyle: 'italic', marginBottom: 4, padding: '2px 6px',
            background: swatch['#FAF8F4'], borderRadius: 3, border: '1px solid #e8dcc8' }}>
            These institutions are excluded by default. Click to force-include - contradictions will appear in the Viability tab.
          </div>
          {Object.entries(institutions).sort(([a],[b])=>a.localeCompare(b)).map(([name, instDef]) => {
            const st = getOutToggleState(name);
            const isForced = st.require;
            return (
              <div key={name}
                onClick={() => handleToggle(name, instDef)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 8,
                  padding: '5px 8px', borderRadius: 5, cursor: 'pointer',
                  background: isForced ? '#fdf0e8' : '#faf8f4',
                  border: `1px ${isForced ? 'solid' : 'dashed'} ${isForced ? '#d8a080' : '#d8cdb8'}`,
                  opacity: isForced ? 1 : 0.65,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 14, height: 14, borderRadius: 3, marginTop: 1, flexShrink: 0,
                  background: isForced ? '#c05010' : 'transparent',
                  border: `2px solid ${isForced ? '#c05010' : '#a09080'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isForced && <span style={{ fontSize: FS.micro, color: swatch.white, fontWeight: 900 }}>F</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: FS['11.5'], fontWeight: isForced ? 700 : 500,
                    color: isForced ? '#8a3010' : '#6b5340' }}>
                    {name}
                    {instDef.nativeTier && (
                      <span style={{ fontSize: FS.micro, fontWeight: 600, marginLeft: 6,
                        color: MUTED, background: swatch['#F0E8D8'],
                        border: '1px solid #d8c8a8', borderRadius: 3, padding: '0 4px' }}>
                        {instDef.nativeTier}
                      </span>
                    )}
                  </div>
                  {instDef.desc && (
                    <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: 1, lineHeight: 1.4 }}>
                      {instDef.desc.slice(0, 80)}{instDef.desc.length > 80 ? '...' : ''}
                    </div>
                  )}
                </div>
                {isForced && (
                  <span style={{ fontSize: FS.micro, fontWeight: 800, color: swatch['#8A3010'],
                    background: swatch['#FDF0E8'], border: '1px solid #d8a080',
                    borderRadius: 3, padding: '1px 5px', flexShrink: 0 }}>FORCED</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InstitutionCard({ name, def, tier, category, state, onToggle, isOutOfTier }) {
  const { allow, require: req, forceExclude } = state;
  const catColor = CAT_COLORS[category] || muted;
  const reqOverridden = def.required && forceExclude;
  const isExcluded   = forceExclude || (!allow && !req && !def.required);
  const _isDimmed     = isExcluded || (isOutOfTier && !req);

  const handleClick = () => {
    if (def.required) {
      onToggle(tier, category, name, forceExclude ? 'allow' : 'exclude');
      return;
    }
    if (isOutOfTier) {
      // Out-of-tier: auto-excluded ↔ forced (two-state)
      if (req) onToggle(tier, category, name, 'clear');
      else     onToggle(tier, category, name, 'require');
      return;
    }
    // Normal in-tier cycle: allow → require → exclude → allow
    if (allow && !req && !forceExclude) onToggle(tier, category, name, 'require');
    else if (req)                        onToggle(tier, category, name, 'exclude');
    else                                 onToggle(tier, category, name, 'allow');
  };

  const borderLeft = reqOverridden     ? '3px solid #8b1a1a'
    : req && isOutOfTier               ? '3px solid #c05010'
    : req                              ? `3px solid ${catColor}`
    : def.required && !reqOverridden   ? `3px solid ${catColor}60`
    : '3px solid transparent';

  const bg = reqOverridden             ? '#fdf0f0'
    : req && isOutOfTier               ? '#fff0e0'
    : req                              ? '#efe8d0'
    : '#faf6ef';

  const nameColor = reqOverridden ? '#8b1a1a'
    : req && isOutOfTier         ? '#8a3010'
    : req                        ? catColor
    : isExcluded                 ? muted
    : ink;

  // Excluded = opacity only, no label. Forced/required still show label.
  const labelText = reqOverridden                  ? '✕ OVERRIDDEN'
    : def.required && !reqOverridden               ? '✦ Required'
    : req && isOutOfTier                           ? ' Cross-tier'
    : req                                          ? ' Forced'
    : null;

  const labelColor = reqOverridden ? '#8b1a1a'
    : req && isOutOfTier         ? '#8a3010'
    : req                        ? catColor
    : muted;

  return (
    <div
      onClick={handleClick}
      title={
        reqOverridden           ? 'Force-excluded - click to restore'
        : isOutOfTier && !req   ? `Out-of-tier (${def.nativeTier || 'other'} tier) - click to force include`
        : isOutOfTier && req    ? 'Cross-tier forced - click to remove'
        : def.required          ? 'Required - click to force-exclude'
        : def.desc
      }
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '6px 12px 6px 10px',
        background: bg, borderLeft,
        borderBottom: '1px solid #f0e8d8',
        cursor: 'pointer', userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'all 0.12s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: FS.sm, color: nameColor,
                textDecoration: isExcluded ? 'line-through' : 'none',
                opacity: isExcluded ? 0.7 : 1 }}>{name}</span>
          {def.p !== undefined && (
            <span style={{ fontSize: FS.xxs, color: muted, background: swatch['#F0EAD8'], borderRadius: 3, padding: '0 4px' }}>
              {Math.round((def.p || 0) * 100)}%
            </span>
          )}
          {def.exclusiveGroup && !def.required && (
            <span style={{ fontSize: FS.xxs, color: swatch.danger, background: swatch['#FDF0F0'], borderRadius: 3, padding: '0 4px' }}>
              excl.
            </span>
          )}
          {labelText && (
            <span style={{ fontSize: FS.micro, fontWeight: 700, color: labelColor,
              background: `${labelColor}15`, border: `1px solid ${labelColor}40`,
              borderRadius: 3, padding: '1px 4px',
              textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {labelText}
            </span>
          )}
        </div>
        {def.desc && (
          <p style={{ fontSize: FS.xxs, color: muted, margin: '2px 0 0',
            lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            textDecoration: isExcluded ? 'line-through' : 'none',
            opacity: isExcluded ? 0.6 : 1 }}>
            {def.desc}
          </p>
        )}
      </div>
    </div>
  );
}

function CategorySection({ category, institutions, tier, toggles, onToggle, isEnabled, _onCategoryToggle, forceCollapsed, _isManualTier, _tierInstitutionNames }) {
  const [collapsed, setCollapsed] = useState(true);
  // Sync local state when forceCollapsed goes from true → false: an
  // "Expand All" press should clear individual manual collapses. We
  // mirror the previous forceCollapsed in a ref + useEffect rather than
  // doing the comparison during render (react-hooks/refs forbids ref
  // writes during render; React Compiler enforces the same boundary).
  const prevForce = useRef(forceCollapsed);
  useEffect(() => {
    if (prevForce.current && !forceCollapsed) setCollapsed(false);
    prevForce.current = forceCollapsed;
  }, [forceCollapsed]);
  const isCollapsed = forceCollapsed || collapsed;
  const catColor = CAT_COLORS[category] || muted;
  const forceCount = Object.entries(toggles).filter(([k, v]) => k.startsWith(`${tier}::${category}::`) && v.require).length;
  const excludeCount = Object.entries(toggles).filter(([k, v]) => k.startsWith(`${tier}::${category}::`) && v.forceExclude).length;
  const overrideCount = Object.entries(toggles).filter(([k, v]) => {
    if (!k.startsWith(`${tier}::${category}::`)) return false;
    const instName = k.split('::')[2];
    const instDef = institutions[instName];
    return v.forceExclude && instDef?.required;
  }).length;

  return (
    <div style={{ borderBottom: `1px solid ${border}` }}>
      {/* Category header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 12px',
          background: isCollapsed ? '#faf4e8' : '#f0ead8',
          borderTop: `1px solid ${border}`,
          border: 'none', cursor: 'pointer',
          textAlign: 'left', userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ fontSize: FS.sm, fontWeight: 700, color: ink, fontFamily: "'Crimson Text', Georgia, serif" }}>
            {category}
          </span>
          {forceCount > 0 && (
            <span style={{ fontSize: FS.micro, fontWeight: 700, color: catColor, background: `${catColor}20`, borderRadius: 3, padding: '1px 5px' }}>
              {forceCount} forced
            </span>
          )}
          {excludeCount > 0 && (
            <span style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.danger, background: swatch.danger, borderRadius: 3, padding: '1px 5px' }}>
              {excludeCount} excluded
            </span>
          )}
          {overrideCount > 0 && (
            <span style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.danger, background: swatch['#FDF0F0'], border: '1px solid #e8a0a0', borderRadius: 3, padding: '1px 5px' }}>
              {overrideCount} req. overridden
            </span>
          )}
        </div>
        {forceCount===0 && excludeCount===0 && <span style={{ fontSize: FS.micro, color: muted, background: swatch['#EDE3CC'], borderRadius: 3, padding: '1px 5px', marginRight: 4 }}>
          {Object.keys(institutions).length} allowed
        </span>}
        {(forceCount>0 || excludeCount>0) && <>
          <span style={{ fontSize: FS.micro, color: muted, background: swatch['#EDE3CC'], borderRadius: 3, padding: '1px 5px' }}>
            {Object.keys(institutions).length - forceCount - excludeCount} allowed
          </span>
          {forceCount>0 && <span style={{ fontSize: FS.micro, fontWeight: 700, color: gold, background: `${gold}20`, borderRadius: 3, padding: '1px 5px' }}>
            {forceCount} forced
          </span>}
          {excludeCount>0 && <span style={{ fontSize: FS.micro, fontWeight: 700, color: swatch.danger, background: swatch.danger, borderRadius: 3, padding: '1px 5px' }}>
            {excludeCount} excluded
          </span>}
        </>}
        <span style={{ fontSize: FS.xxs, color: muted, marginRight: 4 }}>{isCollapsed ? '▼' : '▲'}</span>
      </button>

      {!isCollapsed && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {Object.entries(institutions).sort(([a],[b])=>a.localeCompare(b)).map(([name, def]) => (
            <InstitutionCard
              key={name}
              name={name}
              def={def}
              tier={tier}
              category={category}
              state={getToggleState(toggles, tier, category, name, !!(def._outOfTier))}
              isOutOfTier={!!(def._outOfTier)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}

      {!isCollapsed && !isEnabled && (
        <div style={{ padding: '6px 12px', fontSize: FS.xs, color: muted, fontStyle: 'italic' }}>
          Category disabled - no institutions from this category will appear.
        </div>
      )}
    </div>
  );
}

export default function InstitutionalGrid() {
  const tier = useStore(selectTierForGrid);
  const catalog = useStore(selectCurrentCatalog);
  const toggles = useStore(s => s.institutionToggles);
  const _categoryToggles = useStore(s => s.categoryToggles);
  const onToggle = useStore(s => s.toggleInstitution);
  const onCategoryToggle = useStore(s => s.toggleCategory);
  const config = useStore(s => s.config);
  const _goodsToggles = useStore(s => s.goodsToggles);
  const tierInstitutionNames = useStore(selectTierInstitutionNames);
  const isManualTier = useStore(selectIsManualTier);
  const bulkSetInstitutions = useStore(s => s.bulkSetInstitutions);

  const catalogGetter = isManualTier ? getFullCatalogWithTierMeta : getInstitutionalCatalog;
  const onBulkForce = () => bulkSetInstitutions(catalogGetter, tier, 'force');
  const onBulkExclude = () => bulkSetInstitutions(catalogGetter, tier, 'exclude');
  const onBulkAllow = () => bulkSetInstitutions(catalogGetter, tier, 'reset');
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // all | forced | excluded
  const [allCollapsed, setAllCollapsed] = useState(false);

  const categories = useMemo(() => Object.keys(catalog || {}), [catalog]);

  const filteredCatalog = useMemo(() => {
    const magicFiltered = filterCatalogForMagic(catalog || {}, config);
    if (!search && filterMode === 'all') return magicFiltered;
    const q = search.toLowerCase();
    const result = {};
    Object.entries(magicFiltered).forEach(([cat, insts]) => {
      const filtered = Object.fromEntries(
        Object.entries(insts).filter(([name, def]) => {
          const matchSearch = !search || name.toLowerCase().includes(q) || def.desc?.toLowerCase().includes(q);
          if (!matchSearch) return false;
          if (filterMode === 'forced') {
            const st = getToggleState(toggles, tier, cat, name);
            return st.require;
          }
          if (filterMode === 'excluded') {
            const st = getToggleState(toggles, tier, cat, name);
            return st.forceExclude;
          }
          return true;
        })
      );
      if (Object.keys(filtered).length > 0) result[cat] = filtered;
    });
    return result;
    // Added `config` - filterCatalogForMagic reads magic-related fields
    // from it, so the memo must invalidate when those change. Slightly
    // over-invalidating (any config field changing busts the cache) but
    // correct. Future: extract just the magic-relevant fields if this
    // becomes a perf concern.
  }, [catalog, search, filterMode, toggles, tier, config]);

  const forcedTotal = useMemo(() =>
    Object.values(toggles).filter(v => v.require).length,
    [toggles]
  );
  const excludedTotal = useMemo(() =>
    Object.values(toggles).filter(v => v.forceExclude).length,
    [toggles]
  );

  if (!catalog || categories.length === 0) {
    return <div style={{ padding: 16, color: muted, fontSize: FS.sm }}>No catalog for this tier.</div>;
  }

  return (
    <div style={{ fontFamily: sans }}>

      <ControlsStrip
        search={search}
        setSearch={setSearch}
        placeholder="Search institutions..."
        onForceAll={onBulkForce}
        onReset={onBulkAllow}
        onExcludeAll={onBulkExclude}
        onExpandAll={() => setAllCollapsed(false)}
        onCollapseAll={() => setAllCollapsed(true)}
        forcedCount={forcedTotal}
        excludedCount={excludedTotal}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        tier={tier}
      />

      {/* Category sections */}
      <div style={{ borderTop: `1px solid ${border}` }}>
      {Object.entries(filteredCatalog).sort(([a],[b])=>a.localeCompare(b)).map(([category, rawInsts]) => {
        // Merge in-tier (sorted first) and out-of-tier (sorted after) into one list
        const inTierEntries  = Object.entries(rawInsts)
          .filter(([name]) => !isManualTier || !tierInstitutionNames || tierInstitutionNames.has(name))
          .sort(([a],[b]) => a.localeCompare(b));
        const outTierEntries = Object.entries(rawInsts)
          .filter(([name]) => isManualTier && tierInstitutionNames && !tierInstitutionNames.has(name))
          .sort(([a],[b]) => a.localeCompare(b))
          .map(([name, def]) => [name, { ...def, _outOfTier: true }]);
        const mergedInsts = Object.fromEntries([...inTierEntries, ...outTierEntries]);
        if(Object.keys(mergedInsts).length === 0) return null;
        return (
          <CategorySection
            key={category}
            category={category}
            institutions={mergedInsts}
            tier={tier}
            toggles={toggles}
            onToggle={onToggle}
            isEnabled={true}
            onCategoryToggle={onCategoryToggle}
            forceCollapsed={allCollapsed}
            isManualTier={isManualTier}
            tierInstitutionNames={tierInstitutionNames}
          />
        );
      })}
      </div>
      {Object.keys(filteredCatalog).length === 0 && (
        <div style={{ padding: '20px 0', textAlign: 'center', color: muted, fontSize: FS.sm }}>
          No institutions match.
        </div>
      )}
    </div>
  );
}
