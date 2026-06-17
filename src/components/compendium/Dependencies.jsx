import { useMemo } from 'react';
import { MUTED as MUT, SECOND as SEC, BORDER as BOR, FS, swatch } from '../theme.js';
import { useStore } from '../../store/index.js';
import EntityPicker from '../EntityPicker.jsx';
import { buildRegistry, customRefIdFromItem } from '../../lib/customRegistry.js';
import { CUSTOM_CATEGORIES } from './CustomContent.jsx';

// Maps a dependency field (as stored on ANOTHER custom item) to the relationship
// verb from THIS item's perspective. Powers the derived reverse-links below:
// dependencies are stored one-directionally (a service names its `providedBy`
// institution; a good names its `requiredInstitution`), but we surface the
// inverse so the institution's own card reflects the services/goods that later
// pointed at it. This is a derived view — no fragile stored back-writes, so it
// survives deletes/edits/reorders of either side.
const REVERSE_VERB = {
  providedBy:           'Provides',
  requiredInstitution:  'Produces',
  produces:             'Produced by',
  requires:             'Used by',
  requiredResources:    'Used by',
  subsumes:             'Subsumed by',
  enables:              'Enabled by',
  yields:               'Yielded by',
  controls:             'Controlled by',
  rivals:               'Rival of',
  disablesInstitutions: 'Disabled by',
  disablesGoods:        'Disabled by',
};
const CUSTOM_INK = '#7c3aed';
const CUSTOM_BG = '#7c3aed12';
const CUSTOM_BORDER = '#7c3aed40';

/**
 * DependencySummary — read-only inline display of dependency refs on a saved
 * custom item card. Resolves refIds via the registry and surfaces missing
 * targets so the user knows when a delete elsewhere created a dangling link.
 * Also derives reverse-links (other custom items that point AT this one) so the
 * relationship reads bidirectionally without storing back-references.
 */
export function DependencySummary({ deps, item }) {
  const customContent = useStore(s => s.customContent);
  const registry = useMemo(() => buildRegistry(customContent), [customContent]);

  // Reverse-links: scan all custom content for items whose dependency refs point
  // at THIS item, grouped by the inverse verb (e.g. a service with providedBy=X
  // shows up under "Provides" on institution X's card).
  const reverseLinks = useMemo(() => {
    const selfRefId = item ? customRefIdFromItem(item) : null;
    if (!selfRefId) return [];
    const groups = new Map(); // verb -> Set<name>
    for (const cat of CUSTOM_CATEGORIES) {
      if (!Array.isArray(cat.dependencies)) continue;
      const list = Array.isArray(customContent?.[cat.key]) ? customContent[cat.key] : [];
      for (const other of list) {
        if (!other || customRefIdFromItem(other) === selfRefId) continue;
        for (const dep of cat.dependencies) {
          const verb = REVERSE_VERB[dep.key];
          if (!verb) continue;
          const raw = other[dep.key];
          const refs = dep.single ? (raw ? [raw] : []) : (Array.isArray(raw) ? raw : []);
          if (!refs.includes(selfRefId)) continue;
          if (!groups.has(verb)) groups.set(verb, new Set());
          groups.get(verb).add(other.name || '(unnamed)');
        }
      }
    }
    return [...groups.entries()].map(([verb, names]) => ({ verb, names: [...names] }));
  }, [item, customContent]);

  if (!item || !Array.isArray(deps)) return null;

  // Build per-field { label, entries: [{name, missing, source}] }
  const fields = deps.map(dep => {
    if (!dep || !dep.key) return null;
    const raw = item[dep.key];
    const refIds = dep.single
      ? (raw ? [raw] : [])
      : (Array.isArray(raw) ? raw : []);
    if (refIds.length === 0) return null;
    const entries = refIds.map(r => {
      const e = registry.resolve(r);
      return { refId: r, name: e?.name || '(missing)', missing: !e, source: e?.source };
    });
    return { dep, entries };
  }).filter(Boolean);

  if (fields.length === 0 && reverseLinks.length === 0) return null;

  const totalMissing = fields.reduce(
    (sum, f) => sum + f.entries.filter(e => e.missing).length, 0
  );

  return (
    <div style={{ marginTop:6, paddingTop:5, borderTop:`1px dashed ${BOR}` }}>
      {fields.map(({ dep, entries }) => (
        <div key={dep.key} style={{ display:'flex', gap:6, alignItems:'flex-start', marginTop:3 }}>
          <span style={{
            fontSize:FS.micro, fontWeight:700, color:MUT, minWidth:84, flexShrink:0,
            textTransform:'uppercase', letterSpacing:'0.04em', paddingTop:2,
          }}>{dep.label.replace(/\s*\(.*\)$/, '')}</span>
          <div style={{ display:'flex', flexWrap:'wrap', gap:3, flex:1 }}>
            {entries.map((e, i) => (
              <span
                key={`${e.refId}-${i}`}
                title={e.missing ? `Reference missing: ${e.refId}` : ''}
                style={{
                  fontSize:FS.micro, fontWeight:700,
                  color: e.missing ? '#8b1a1a' : (e.source==='custom' ? '#7c3aed' : SEC),
                  background: e.missing ? '#fdebec' : (e.source==='custom' ? '#7c3aed14' : '#0001'),
                  border:`1px solid ${e.missing ? '#f0c8cc' : (e.source==='custom' ? '#7c3aed44' : BOR)}`,
                  borderRadius:8, padding:'1px 5px',
                }}
              >
                {e.missing && '! '}{e.name}
              </span>
            ))}
          </div>
        </div>
      ))}
      {totalMissing > 0 && (
        <div style={{
          marginTop:4, fontSize:FS.xxs, color:swatch.danger,
          fontStyle:'italic',
        }}>
          {totalMissing} dangling reference{totalMissing===1?'':'s'}. Edit this item to fix.
        </div>
      )}
      {reverseLinks.length > 0 && (
        <div style={{ marginTop:5, paddingTop:4, borderTop:`1px dotted ${BOR}` }}>
          <div style={{
            fontSize:FS.nano, fontWeight:700, color:MUT, marginBottom:2,
            textTransform:'uppercase', letterSpacing:'0.05em',
          }}>
            Auto-linked from your other custom content
          </div>
          {reverseLinks.map(({ verb, names }) => (
            <div key={verb} style={{ display:'flex', gap:6, alignItems:'flex-start', marginTop:3 }}>
              <span style={{
                fontSize:FS.micro, fontWeight:700, color:CUSTOM_INK, minWidth:84, flexShrink:0,
                textTransform:'uppercase', letterSpacing:'0.04em', paddingTop:2,
              }}>{verb}</span>
              <div style={{ display:'flex', flexWrap:'wrap', gap:3, flex:1 }}>
                {names.map((n, i) => (
                  <span key={`${verb}-${i}`} style={{
                    fontSize:FS.micro, fontWeight:700, color:CUSTOM_INK,
                    background:CUSTOM_BG, border:`1px solid ${CUSTOM_BORDER}`,
                    borderRadius:8, padding:'1px 5px',
                  }}>{n}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Human labels for registry category keys, used to build friendly picker
// placeholders ("Search goods / services…" rather than "Add tradeGoods…").
const CAT_LABEL = {
  tradeGoods: 'goods', services: 'services', resources: 'resources',
  institutions: 'institutions', factions: 'factions', stressors: 'stressors',
  resourceChains: 'chains',
};

/**
 * DependenciesSection — always-visible group of EntityPicker rows for the
 * dependency fields of a custom-content category. Each picker stores
 * refId arrays (or a single refId for `single:true`) on the draft. Never
 * collapses — this is what wires custom content into generation + discovery.
 */
export function DependenciesSection({ deps, draft, setDraft }) {
  // Always-visible (not collapsible): dependencies are what wire custom content
  // into generation + supply-chain discovery, so they shouldn't be hidden.
  const total = deps.reduce((sum, d) => {
    const v = draft[d.key];
    if (d.single) return sum + (v ? 1 : 0);
    return sum + (Array.isArray(v) ? v.length : 0);
  }, 0);
  return (
    <div style={{ marginTop:10, borderTop:`1px dashed ${BOR}`, paddingTop:8 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'2px 0', marginBottom:4 }}>
        <span style={{
          fontSize:FS.xs, fontWeight:700, color:swatch.magic,
          textTransform:'uppercase', letterSpacing:'0.05em',
        }}>
          Dependencies {total > 0 && (
            <span style={{
              marginLeft:6, background:'rgba(124,58,237,0.15)', color:swatch.magic,
              borderRadius:8, padding:'1px 6px', fontSize:FS.micro, fontWeight:800,
            }}>{total}</span>
          )}
        </span>
        <span style={{ marginLeft:'auto', fontSize:FS.micro, color:MUT, fontStyle:'italic' }}>
          wire this into generation &amp; supply chains
        </span>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {deps.map(dep => (
          <div key={dep.key}>
            {/* eslint-disable-next-line jsx-a11y/label-has-for -- deprecated rule; label nests the EntityPicker control + has htmlFor, but the static nesting check can't see through the component. label-has-associated-control passes. */}
            <label htmlFor={`ccm-dep-${dep.key}`} style={{
              fontSize:FS.xxs, fontWeight:700, color:MUT,
              textTransform:'uppercase', letterSpacing:'0.04em',
              display:'block', marginBottom:3,
            }}>
              {dep.label}
              <EntityPicker
                category={dep.category}
                categories={dep.categories}
                single={!!dep.single}
                value={draft[dep.key] ?? (dep.single ? '' : [])}
                onChange={(next) => setDraft(d => ({ ...d, [dep.key]: next }))}
                placeholder={`Search ${(dep.categories || [dep.category]).filter(Boolean).map(c => CAT_LABEL[c] || c).join(' / ') || 'catalog'}…`}
              />
            </label>
            {dep.hint && (
              <div style={{
                fontSize:FS.xxs, color:MUT, fontStyle:'italic', marginTop:2,
              }}>{dep.hint}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
