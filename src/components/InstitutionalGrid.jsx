import React, { useState, useMemo } from 'react';
import {filterCatalogForMagic} from './magicFilter.js';
import ControlsStrip from './ControlsStrip.jsx';
import {GOLD as gold, INK as ink, MUTED as muted, SECOND as second, BORDER as border, CARD as card, CARD_ALT as parch, sans} from './theme.js';
import { useStore } from '../store/index.js';
import { selectTierForGrid, selectCurrentCatalog, selectTierInstitutionNames, selectIsManualTier } from '../store/selectors.js';
import { getInstitutionalCatalog, getFullCatalogWithTierMeta } from '../generators/engine.js';

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

  const handleToggle = (name, instDef) => {
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
          padding: '5px 10px', background: '#f5f0e8',
          border: '1px dashed #c8b89a', borderRadius: 5,
          cursor: 'pointer', textAlign: 'left', marginBottom: open ? 4 : 0,
        }}
      >
        <span style={{ fontSize: 10, color: '#9c8068' }}>▸</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: '#9c8068', flex: 1,
          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Other-tier options ({instCount})
        </span>
        {forcedCount > 0 && (
          <span style={{ fontSize: 9, fontWeight: 800, color: '#8a3010',
            background: '#fdf0e8', border: '1px solid #d8a080',
            borderRadius: 3, padding: '1px 6px' }}>
            {forcedCount} forced in
          </span>
        )}
        <span style={{ fontSize: 9, color: '#9c8068', fontStyle: 'italic' }}>
          {open ? '▲ hide' : '▼ show'}
        </span>
      </button>

      {open && !allCollapsed && (
        <div style={{ paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 10, color: '#9c8068', fontStyle: 'italic', marginBottom: 4, padding: '2px 6px',
            background: '#faf8f4', borderRadius: 3, border: '1px solid #e8dcc8' }}>
            These institutions are excluded by default. Click to force-include — contradictions will appear in the Viability tab.
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
                  {isForced && <span style={{ fontSize: 9, color: '#fff', fontWeight: 900 }}>F</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, fontWeight: isForced ? 700 : 500,
                    color: isForced ? '#8a3010' : '#6b5340' }}>
                    {name}
                    {instDef.nativeTier && (
                      <span style={{ fontSize: 9, fontWeight: 600, marginLeft: 6,
                        color: '#9c8068', background: '#f0e8d8',
                        border: '1px solid #d8c8a8', borderRadius: 3, padding: '0 4px' }}>
                        {instDef.nativeTier}
                      </span>
                    )}
                  </div>
                  {instDef.desc && (
                    <div style={{ fontSize: 10, color: '#9c8068', marginTop: 1, lineHeight: 1.4 }}>
                      {instDef.desc.slice(0, 80)}{instDef.desc.length > 80 ? '…' : ''}
                    </div>
                  )}
                </div>
                {isForced && (
                  <span style={{ fontSize: 9, fontWeight: 800, color: '#8a3010',
                    background: '#fdf0e8', border: '1px solid #d8a080',
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
  const isDimmed     = isExcluded || (isOutOfTier && !req);

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
        reqOverridden           ? 'Force-excluded — click to restore'
        : isOutOfTier && !req   ? `Out-of-tier (${def.nativeTier || 'other'} tier) — click to force include`
        : isOutOfTier && req    ? 'Cross-tier forced — click to remove'
        : def.required          ? 'Required — click to force-exclude'
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
          <span style={{ fontWeight: 600, fontSize: 12, color: nameColor,
                textDecoration: isExcluded ? 'line-through' : 'none',
                opacity: isExcluded ? 0.7 : 1 }}>{name}</span>
          {def.p !== undefined && (
            <span style={{ fontSize: 10, color: muted, background: '#f0ead8', borderRadius: 3, padding: '0 4px' }}>
              {Math.round((def.p || 0) * 100)}%
            </span>
          )}
          {def.exclusiveGroup && !def.required && (
            <span style={{ fontSize: 10, color: '#8b1a1a', background: '#fdf0f0', borderRadius: 3, padding: '0 4px' }}>
              excl.
            </span>
          )}
          {labelText && (
            <span style={{ fontSize: 9, fontWeight: 700, color: labelColor,
              background: `${labelColor}15`, border: `1px solid ${labelColor}40`,
              borderRadius: 3, padding: '1px 4px',
              textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {labelText}
            </span>
          )}
        </div>
        {def.desc && (
          <p style={{ fontSize: 10, color: muted, margin: '2px 0 0',
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

function CategorySection({ category, institutions, tier, toggles, onToggle, isEnabled, onCategoryToggle, forceCollapsed, isManualTier, tierInstitutionNames }) {
  const [collapsed, setCollapsed] = useState(true);
  // Sync local state when forceCollapsed changes — ensures Expand All clears manual collapses
  const prevForce = React.useRef(forceCollapsed);
  if (prevForce.current !== forceCollapsed) {
    prevForce.current = forceCollapsed;
    if (!forceCollapsed && collapsed) setCollapsed(false);
  }
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
          <span style={{ fontSize: 12, fontWeight: 700, color: ink, fontFamily: "'Crimson Text', Georgia, serif" }}>
            {category}
          </span>
          {forceCount > 0 && (
            <span style={{ fontSize: 9, fontWeight: 700, color: catColor, background: `${catColor}20`, borderRadius: 3, padding: '1px 5px' }}>
              {forceCount} forced
            </span>
          )}
          {excludeCount > 0 && (
            <span style={{ fontSize: 9, fontWeight: 700, color: '#8b1a1a', background: '#8b1a1a18', borderRadius: 3, padding: '1px 5px' }}>
              {excludeCount} excluded
            </span>
          )}
          {overrideCount > 0 && (
            <span style={{ fontSize: 9, fontWeight: 700, color: '#8b1a1a', background: '#fdf0f0', border: '1px solid #e8a0a0', borderRadius: 3, padding: '1px 5px' }}>
              {overrideCount} req. overridden
            </span>
          )}
        </div>
        {forceCount===0 && excludeCount===0 && <span style={{ fontSize: 9, color: muted, background: '#ede3cc', borderRadius: 3, padding: '1px 5px', marginRight: 4 }}>
          {Object.keys(institutions).length} allowed
        </span>}
        {(forceCount>0 || excludeCount>0) && <>
          <span style={{ fontSize: 9, color: muted, background: '#ede3cc', borderRadius: 3, padding: '1px 5px' }}>
            {Object.keys(institutions).length - forceCount - excludeCount} allowed
          </span>
          {forceCount>0 && <span style={{ fontSize: 9, fontWeight: 700, color: gold, background: `${gold}20`, borderRadius: 3, padding: '1px 5px' }}>
            {forceCount} forced
          </span>}
          {excludeCount>0 && <span style={{ fontSize: 9, fontWeight: 700, color: '#8b1a1a', background: '#8b1a1a18', borderRadius: 3, padding: '1px 5px' }}>
            {excludeCount} excluded
          </span>}
        </>}
        <span style={{ fontSize: 10, color: muted, marginRight: 4 }}>{isCollapsed ? '▼' : '▲'}</span>
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
        <div style={{ padding: '6px 12px', fontSize: 11, color: muted, fontStyle: 'italic' }}>
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
  const categoryToggles = useStore(s => s.categoryToggles);
  const onToggle = useStore(s => s.toggleInstitution);
  const onCategoryToggle = useStore(s => s.toggleCategory);
  const config = useStore(s => s.config);
  const goodsToggles = useStore(s => s.goodsToggles);
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
  }, [catalog, search, filterMode, toggles, tier]);

  const forcedTotal = useMemo(() =>
    Object.values(toggles).filter(v => v.require).length,
    [toggles]
  );
  const excludedTotal = useMemo(() =>
    Object.values(toggles).filter(v => v.forceExclude).length,
    [toggles]
  );

  if (!catalog || categories.length === 0) {
    return <div style={{ padding: 16, color: muted, fontSize: 12 }}>No catalog for this tier.</div>;
  }

  return (
    <div style={{ fontFamily: sans }}>

      <ControlsStrip
        search={search}
        setSearch={setSearch}
        placeholder="Search institutions…"
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
        <div style={{ padding: '20px 0', textAlign: 'center', color: muted, fontSize: 12 }}>
          No institutions match.
        </div>
      )}
    </div>
  );
}
