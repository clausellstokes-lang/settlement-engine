/**
 * SettlementEditor.jsx — CRUD editor for saved settlements.
 *
 * Searchable catalog-backed editor: institutions, resources, stressors,
 * trade goods, and priority sliders. "Add" opens a full catalog search
 * filtered by what's already in the settlement. Custom content from the
 * Compendium appears with a purple "Custom" badge.
 */
import React, { useState, useMemo } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Sliders, Search } from 'lucide-react';
import { institutionalCatalog } from '../data/institutionalCatalog.js';
import { RESOURCE_DATA } from '../data/resourceData.js';
import { STRESS_TYPE_MAP } from '../data/stressTypes.js';
import { EXPORT_GOODS_BY_TIER, IMPORT_GOODS_BY_TIER } from '../data/tradeGoodsData.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, CARD, sans, serif_ } from './theme.js';
import { useStore } from '../store/index.js';
import { classifyChange } from '../lib/narrativeMutations.js';
import { CREDIT_COSTS } from '../store/creditsSlice.js';
import NarrativeDriftModal from './NarrativeDriftModal.jsx';

// ── Sub-section wrapper ─────────────────────────────────────────────────────
function SubSection({ title, count, children }) {
  const [open, setOpen] = useState(false);
  const Toggle = open ? ChevronUp : ChevronDown;
  return (
    <div style={{ border:`1px solid ${BORDER}`, borderRadius:6, overflow:'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width:'100%', display:'flex', alignItems:'center', gap:6, padding:'8px 12px', background:open?'#f5ede0':CARD, border:'none', cursor:'pointer', textAlign:'left' }}>
        <span style={{ fontSize:11, fontWeight:700, color:INK, flex:1, fontFamily:sans, textTransform:'uppercase', letterSpacing:'0.05em' }}>{title}</span>
        {count != null && <span style={{ fontSize:10, color:MUTED }}>{count}</span>}
        <Toggle size={12} color={MUTED}/>
      </button>
      {open && <div style={{ padding:'10px 12px', background:CARD }}>{children}</div>}
    </div>
  );
}

// ── Pill badge ──────────────────────────────────────────────────────────────
function Pill({ label, color=SECOND, onRemove, isCustom }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'2px 8px', borderRadius:10, background:`${color}14`, border:`1px solid ${color}40`, fontSize:10, fontWeight:600, color, whiteSpace:'nowrap' }}>
      {isCustom && <span style={{ fontSize:8, fontWeight:800, color:'#7c3aed', background:'rgba(124,58,237,0.12)', borderRadius:3, padding:'0 3px', marginRight:1 }}>C</span>}
      {label}
      {onRemove && <button onClick={onRemove} style={{ background:'none', border:'none', cursor:'pointer', color, padding:0, display:'flex', lineHeight:1 }}><X size={10}/></button>}
    </span>
  );
}

// ── Catalog Search Panel ────────────────────────────────────────────────────
function CatalogSearch({ items, onAdd, placeholder, categoryFilters }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filtered = useMemo(() => {
    let list = items;
    if (catFilter !== 'All') list = list.filter(i => i.category === catFilter);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(i =>
        (i.name||'').toLowerCase().includes(q) ||
        (i.desc||i.description||'').toLowerCase().includes(q) ||
        (i.category||'').toLowerCase().includes(q) ||
        (i.tags||[]).some(t => (t||'').toLowerCase().includes(q))
      );
    }
    return list.slice(0, 30);
  }, [items, query, catFilter]);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', background:GOLD_BG, color:GOLD, border:`1px solid rgba(160,118,42,0.3)`, borderRadius:4, cursor:'pointer', fontSize:10, fontWeight:700, fontFamily:sans, marginTop:6 }}>
        <Plus size={11}/> Add from catalog ({items.length} available)
      </button>
    );
  }

  return (
    <div style={{ marginTop:6, border:`1px solid ${BORDER}`, borderRadius:6, background:'#faf6ef', overflow:'hidden' }}>
      {/* Search bar */}
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', borderBottom:`1px solid ${BORDER}` }}>
        <Search size={11} color={MUTED}/>
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder={placeholder || 'Search catalog...'} autoFocus style={{ flex:1, border:'none', background:'transparent', fontSize:11, fontFamily:sans, color:INK, outline:'none' }}/>
        <button onClick={() => { setOpen(false); setQuery(''); setCatFilter('All'); }} style={{ background:'none', border:'none', cursor:'pointer', color:MUTED, padding:0 }}><X size={12}/></button>
      </div>

      {/* Category filter pills */}
      {categoryFilters && categoryFilters.length > 1 && (
        <div style={{ display:'flex', gap:3, padding:'4px 8px', flexWrap:'wrap', borderBottom:`1px solid ${BORDER}` }}>
          {['All', ...categoryFilters].map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding:'1px 7px', borderRadius:8, fontSize:9, fontWeight:catFilter===c?700:500, cursor:'pointer', border:`1px solid ${catFilter===c?GOLD:BORDER}`, background:catFilter===c?GOLD_BG:'transparent', color:catFilter===c?GOLD:SECOND }}>
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <div style={{ maxHeight:200, overflowY:'auto', padding:4 }}>
        {filtered.length === 0 ? (
          <div style={{ padding:'8px 6px', fontSize:10, color:MUTED, textAlign:'center' }}>No matching items</div>
        ) : filtered.map(item => (
          <button key={item.id || item.name} onClick={() => { onAdd(item); }}
            style={{ width:'100%', display:'flex', alignItems:'flex-start', gap:6, padding:'5px 8px', border:'none', background:'none', cursor:'pointer', borderRadius:4, textAlign:'left', fontFamily:sans }}
            onMouseEnter={e => e.currentTarget.style.background='#f0ebe0'}
            onMouseLeave={e => e.currentTarget.style.background='none'}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:600, color:INK, display:'flex', alignItems:'center', gap:4 }}>
                {item.name}
                {item.isCustom && <span style={{ fontSize:8, fontWeight:800, color:'#7c3aed', background:'rgba(124,58,237,0.12)', borderRadius:3, padding:'0 4px' }}>Custom</span>}
              </div>
              {item.desc && <div style={{ fontSize:9, color:MUTED, lineHeight:1.3, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.desc}</div>}
            </div>
            {item.category && <span style={{ fontSize:9, fontWeight:600, color:SECOND, background:`${SECOND}10`, borderRadius:3, padding:'1px 5px', flexShrink:0 }}>{item.category}</span>}
            {item.alreadyAdded && <span style={{ fontSize:9, color:MUTED, fontStyle:'italic' }}>Added</span>}
          </button>
        ))}
        {items.length > 30 && !query && <div style={{ padding:'4px 8px', fontSize:9, color:MUTED, textAlign:'center' }}>Search to see more...</div>}
      </div>
    </div>
  );
}

// ── Priority slider ─────────────────────────────────────────────────────────
// Drag fires onChange (live visual update); release fires onCommit, which is
// where the drift gate runs. This keeps the slider feeling responsive without
// popping a modal for every integer tick.
function PrioritySlider({ label, value, onChange, onCommit, color=GOLD }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ fontSize:10, fontWeight:600, color:SECOND, minWidth:65, fontFamily:sans }}>{label}</span>
      <input
        type="range" min={0} max={100} value={value}
        onChange={e => onChange(+e.target.value)}
        onMouseUp={onCommit}
        onTouchEnd={onCommit}
        onKeyUp={onCommit}
        onBlur={onCommit}
        style={{ flex:1, accentColor:color, height:4 }}
      />
      <span style={{ fontSize:10, fontWeight:700, color:INK, minWidth:24, textAlign:'right', fontFamily:'monospace' }}>{value}</span>
    </div>
  );
}

// ── Main editor ─────────────────────────────────────────────────────────────
export default function SettlementEditor({
  settlement, config, saveId, onEdit,
  // Drift gating: when the save has an AI narrative, structural/seismic edits
  // must be paired with an explicit resolution (regenerate or revert) per
  // design decision 4 ("kill leave stale"). If narrated is false, edits apply
  // silently as before.
  narrated = false,
  onRegenerateNarrative,  // async () => void — re-run narrative pipeline
  onProgressNarrative,    // async (changeType, changeLabel) => void — evolve narrative (AI-4)
  onRevertToRaw,          // async () => void — clear narrative, keep raw
}) {
  const [open, setOpen] = useState(false);
  const customContent = useStore(s => s.customContent);

  // Pending mutation awaiting the user's drift resolution. Holds enough state
  // to (a) label the change in the modal and (b) actually run the edit once
  // the user picks Regenerate or Revert.
  //
  // Shape: { changeType, changeLabel, changeClass, applyFn }
  const [pendingMutation, setPendingMutation] = useState(null);

  // Local draft for priority sliders so we can let them drag freely and only
  // trigger the drift gate on commit (mouseUp/touchEnd/blur/keyUp).
  // Shape: { key, val }
  const [priorityDraft, setPriorityDraft] = useState(null);

  const tier = settlement?.tier?.toLowerCase() || 'village';
  const institutions = settlement?.institutions || [];
  const stresses = Array.isArray(settlement?.stress) ? settlement.stress : settlement?.stress ? [settlement.stress] : [];
  const resources = settlement?.resourceAnalysis?.availableResources || [];
  const exports_ = settlement?.economicState?.primaryExports || [];
  const imports_ = settlement?.economicState?.primaryImports || [];

  // ── Drift gate ─────────────────────────────────────────────────────────────
  // Every structural/seismic mutation flows through this helper. If the save
  // is not narrated, or the change is cosmetic, we just run applyFn. Otherwise
  // we park the mutation and let the modal decide.
  const confirmStructuralEdit = (changeType, changeLabel, applyFn) => {
    const changeClass = classifyChange(changeType);
    if (!narrated || changeClass === 'cosmetic') {
      applyFn();
      return;
    }
    setPendingMutation({ changeType, changeLabel, changeClass, applyFn });
  };

  const handleDriftRegenerate = async () => {
    if (!pendingMutation) return;
    const { applyFn } = pendingMutation;
    setPendingMutation(null);
    applyFn();
    if (onRegenerateNarrative) {
      try { await onRegenerateNarrative(); }
      catch (e) { console.error('Failed to regenerate narrative after structural edit:', e); }
    }
  };

  // Progress (AI-4) — apply the edit, then evolve the existing narrative
  // against the change diff rather than rewriting from scratch. The
  // changeType/changeLabel are threaded to the endpoint so the server can
  // run the right subset of refinement passes and produce a chronicle entry.
  const handleDriftProgress = async () => {
    if (!pendingMutation) return;
    const { applyFn, changeType, changeLabel } = pendingMutation;
    setPendingMutation(null);
    applyFn();
    if (onProgressNarrative) {
      try { await onProgressNarrative(changeType, changeLabel); }
      catch (e) { console.error('Failed to progress narrative after structural edit:', e); }
    }
  };

  const handleDriftRevert = async () => {
    if (!pendingMutation) return;
    const { applyFn } = pendingMutation;
    setPendingMutation(null);
    applyFn();
    if (onRevertToRaw) {
      try { await onRevertToRaw(); }
      catch (e) { console.error('Failed to revert narrative after structural edit:', e); }
    }
  };

  const handleDriftCancel = () => {
    // Cancelling the modal drops the pending mutation AND any in-flight slider
    // draft — the slider reverts to its committed value because the display
    // reads from priorityDraft when present, otherwise from `priorities`.
    setPendingMutation(null);
    setPriorityDraft(null);
  };

  // ── Institutions: FULL catalog across ALL tiers + custom ───────────────
  const institutionCatalogItems = useMemo(() => {
    const existing = new Set(institutions.map(i => i.name));
    const items = [];
    const seen = new Set();

    // All tiers from built-in catalog
    for (const [tierKey, tierData] of Object.entries(institutionalCatalog || {})) {
      for (const [cat, entries] of Object.entries(tierData || {})) {
        for (const [name, def] of Object.entries(entries || {})) {
          if (seen.has(name)) continue;
          seen.add(name);
          items.push({
            id: name, name, category: cat, tierKey,
            desc: def.desc || '', tags: def.tags || [],
            def, alreadyAdded: existing.has(name),
          });
        }
      }
    }

    // Custom institutions
    for (const ci of (customContent.institutions || [])) {
      if (seen.has(ci.name)) continue;
      seen.add(ci.name);
      items.push({
        id: ci.id, name: ci.name, category: ci.category || 'Custom',
        desc: ci.description || '', tags: typeof ci.tags === 'string' ? ci.tags.split(',').map(t => t.trim()) : (ci.tags || []),
        isCustom: true, alreadyAdded: existing.has(ci.name),
      });
    }

    return items.filter(i => !i.alreadyAdded).sort((a, b) => a.name.localeCompare(b.name));
  }, [institutions, customContent.institutions]);

  const institutionCategories = useMemo(() => [...new Set(institutionCatalogItems.map(i => i.category).filter(Boolean))].sort(), [institutionCatalogItems]);

  const addInstitution = (item) => {
    const newInst = { name: item.name, category: item.category, source: item.isCustom ? 'custom' : 'manual', ...(item.def || {}) };
    confirmStructuralEdit(
      'addInstitution',
      `Add institution: ${item.name}`,
      () => onEdit(saveId, { settlement: { institutions: [...institutions, newInst] } }),
    );
  };

  const removeInstitution = (idx) => {
    const name = institutions[idx]?.name || 'institution';
    confirmStructuralEdit(
      'removeInstitution',
      `Remove institution: ${name}`,
      () => onEdit(saveId, { settlement: { institutions: institutions.filter((_, i) => i !== idx) } }),
    );
  };

  // ── Resources: full catalog + custom ──────────────────────────────────────
  const resourceCatalogItems = useMemo(() => {
    const existing = new Set(resources);
    const items = Object.entries(RESOURCE_DATA)
      .filter(([key]) => !existing.has(key))
      .map(([key, def]) => ({ id: key, name: def.label || key, key, category: def.category || 'land', desc: def.desc || '' }));

    for (const cr of (customContent.resources || [])) {
      if (existing.has(cr.name)) continue;
      items.push({ id: cr.id, name: cr.name, key: cr.name, category: cr.category || 'custom', desc: cr.description || '', isCustom: true });
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [resources, customContent.resources]);

  const addResource = (item) => {
    confirmStructuralEdit(
      'addResource',
      `Add resource: ${item.name}`,
      () => onEdit(saveId, { settlement: { resourceAnalysis: { ...(settlement?.resourceAnalysis || {}), availableResources: [...resources, item.key] } } }),
    );
  };

  const removeResource = (key) => {
    const label = RESOURCE_DATA[key]?.label || key;
    confirmStructuralEdit(
      'removeResource',
      `Remove resource: ${label}`,
      () => onEdit(saveId, { settlement: { resourceAnalysis: { ...(settlement?.resourceAnalysis || {}), availableResources: resources.filter(r => r !== key) } } }),
    );
  };

  // ── Stressors: full catalog + custom ──────────────────────────────────────
  const stressCatalogItems = useMemo(() => {
    const existing = new Set(stresses.map(s => s.type));
    const items = Object.entries(STRESS_TYPE_MAP)
      .filter(([key]) => !existing.has(key))
      .map(([key, def]) => ({ id: key, name: def.label || key, key, desc: def.crisisHook || def.viabilityNote || '' }));

    for (const cs of (customContent.stressors || [])) {
      if (existing.has(cs.name)) continue;
      items.push({ id: cs.id, name: cs.name, key: cs.name, desc: cs.description || '', isCustom: true, severity: cs.severity });
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [stresses, customContent.stressors]);

  const addStress = (item) => {
    const def = STRESS_TYPE_MAP[item.key];
    const entry = { type: item.key, label: item.name, severity: item.severity || 'medium', description: def?.crisisHook || item.desc || '', settlement: settlement?.name || '', isCustom: item.isCustom };
    confirmStructuralEdit(
      'addStressor',
      `Add stressor: ${item.name}`,
      () => onEdit(saveId, { settlement: { stress: [...stresses, entry] } }),
    );
  };

  const removeStress = (idx) => {
    const s = stresses[idx];
    const label = STRESS_TYPE_MAP[s?.type]?.label || s?.label || s?.type || 'stressor';
    confirmStructuralEdit(
      'removeStressor',
      `Remove stressor: ${label}`,
      () => onEdit(saveId, { settlement: { stress: stresses.filter((_, i) => i !== idx) } }),
    );
  };

  // ── Trade goods: full catalog across ALL tiers + custom ───────────────────
  const exportCatalogItems = useMemo(() => {
    const existing = new Set(exports_.map(e => typeof e === 'string' ? e : e.name || e.good));
    const items = [];
    const seen = new Set();
    for (const [, tierGoods] of Object.entries(EXPORT_GOODS_BY_TIER || {})) {
      for (const [name, def] of Object.entries(tierGoods || {})) {
        if (seen.has(name) || existing.has(name)) continue;
        seen.add(name);
        items.push({ id: name, name, category: def.category || '', desc: def.desc || '' });
      }
    }
    for (const cg of (customContent.tradeGoods || [])) {
      if (seen.has(cg.name) || existing.has(cg.name)) continue;
      items.push({ id: cg.id, name: cg.name, category: cg.category || 'Custom', desc: cg.description || '', isCustom: true });
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [exports_, customContent.tradeGoods]);

  const importCatalogItems = useMemo(() => {
    const existing = new Set(imports_.map(e => typeof e === 'string' ? e : e.name || e.good));
    const items = [];
    const seen = new Set();
    for (const [, tierImports] of Object.entries(IMPORT_GOODS_BY_TIER || {})) {
      for (const arr of Object.values(tierImports || {})) {
        if (!Array.isArray(arr)) continue;
        for (const item of arr) {
          if (!item.name || seen.has(item.name) || existing.has(item.name)) continue;
          seen.add(item.name);
          items.push({ id: item.name, name: item.name, category: item.category || '', desc: item.desc || '' });
        }
      }
    }
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [imports_]);

  const addExport = (item) => {
    const entry = { name: item.name, good: item.name, category: item.isCustom ? 'custom' : 'manual', desc: '' };
    confirmStructuralEdit(
      'addTradeGood',
      `Add export: ${item.name}`,
      () => onEdit(saveId, { settlement: { economicState: { ...(settlement?.economicState || {}), primaryExports: [...exports_, entry] } } }),
    );
  };

  const removeExport = (idx) => {
    const e = exports_[idx];
    const name = typeof e === 'string' ? e : e?.name || e?.good || 'export';
    confirmStructuralEdit(
      'removeTradeGood',
      `Remove export: ${name}`,
      () => onEdit(saveId, { settlement: { economicState: { ...(settlement?.economicState || {}), primaryExports: exports_.filter((_, i) => i !== idx) } } }),
    );
  };

  const addImport = (item) => {
    const entry = { name: item.name, good: item.name, category: 'manual', desc: '' };
    confirmStructuralEdit(
      'addTradeGood',
      `Add import: ${item.name}`,
      () => onEdit(saveId, { settlement: { economicState: { ...(settlement?.economicState || {}), primaryImports: [...imports_, entry] } } }),
    );
  };

  const removeImport = (idx) => {
    const e = imports_[idx];
    const name = typeof e === 'string' ? e : e?.name || e?.good || 'import';
    confirmStructuralEdit(
      'removeTradeGood',
      `Remove import: ${name}`,
      () => onEdit(saveId, { settlement: { economicState: { ...(settlement?.economicState || {}), primaryImports: imports_.filter((_, i) => i !== idx) } } }),
    );
  };

  // ── Priority sliders ──────────────────────────────────────────────────────
  const priorities = {
    economy: config?.priorityEconomy ?? 50,
    military: config?.priorityMilitary ?? 50,
    magic: config?.priorityMagic ?? 50,
    religion: config?.priorityReligion ?? 50,
    criminal: config?.priorityCriminal ?? 50,
  };

  // Display value reads the draft when one is in flight so the slider tracks
  // the user's drag, and falls back to the committed value otherwise.
  const getSliderValue = (key) =>
    priorityDraft?.key === key ? priorityDraft.val : priorities[key];

  // Drag handler — update local draft only (no persistence).
  const handleSliderChange = (key, val) => {
    setPriorityDraft({ key, val });
  };

  // Release handler — run the drift gate (which will either apply immediately
  // when unnarrated, or park and show the modal when narrated).
  const handleSliderCommit = () => {
    if (!priorityDraft) return;
    const { key, val } = priorityDraft;
    if (val === priorities[key]) {
      // Nothing actually moved. Clear the draft and bail.
      setPriorityDraft(null);
      return;
    }
    setPriorityDraft(null);
    const configKey = `priority${key.charAt(0).toUpperCase() + key.slice(1)}`;
    confirmStructuralEdit(
      'setPrioritySlider',
      `Set ${key} priority to ${val}`,
      () => onEdit(saveId, { config: { [configKey]: val } }),
    );
  };

  const Toggle = open ? ChevronUp : ChevronDown;

  return (
    <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, overflow:'hidden', marginBottom:14 }}>
      <button onClick={() => setOpen(!open)} style={{ width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:open?'#f5ede0':CARD, border:'none', cursor:'pointer', textAlign:'left' }}>
        <Sliders size={14} color={GOLD}/>
        <span style={{ fontFamily:serif_, fontSize:13, fontWeight:600, color:INK, flex:1 }}>Settlement Editor</span>
        <span style={{ fontSize:10, color:MUTED }}>Institutions, resources, stressors, trade, priorities</span>
        <Toggle size={13} color={MUTED}/>
      </button>

      {open && (
        <div style={{ padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>

          {/* Institutions */}
          <SubSection title="Institutions" count={institutions.length}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:6 }}>
              {institutions.map((inst, i) => (
                <Pill key={i} label={`${inst.name} (${inst.category})`} color="#2a5a7a" isCustom={inst.source==='custom'} onRemove={() => removeInstitution(i)}/>
              ))}
              {!institutions.length && <span style={{ fontSize:10, color:MUTED }}>No institutions</span>}
            </div>
            <CatalogSearch items={institutionCatalogItems} onAdd={addInstitution} placeholder="Search institutions..." categoryFilters={institutionCategories}/>
          </SubSection>

          {/* Resources */}
          <SubSection title="Resources" count={resources.length}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:6 }}>
              {resources.map(key => {
                const def = RESOURCE_DATA[key];
                return <Pill key={key} label={def?.label || key} color="#2a7a2a" onRemove={() => removeResource(key)}/>;
              })}
              {!resources.length && <span style={{ fontSize:10, color:MUTED }}>No resources</span>}
            </div>
            <CatalogSearch items={resourceCatalogItems} onAdd={addResource} placeholder="Search resources..." categoryFilters={['water','land','special','subterranean']}/>
          </SubSection>

          {/* Stressors */}
          <SubSection title="Stressors" count={stresses.length}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:6 }}>
              {stresses.map((s, i) => {
                const def = STRESS_TYPE_MAP[s.type];
                return <Pill key={i} label={def?.label || s.type} color={def?.colour || '#8b1a1a'} isCustom={s.isCustom} onRemove={() => removeStress(i)}/>;
              })}
              {!stresses.length && <span style={{ fontSize:10, color:MUTED }}>No active stressors</span>}
            </div>
            <CatalogSearch items={stressCatalogItems} onAdd={addStress} placeholder="Search stressors..."/>
          </SubSection>

          {/* Trade Goods */}
          <SubSection title="Trade Goods" count={exports_.length + imports_.length}>
            <div style={{ marginBottom:8 }}>
              <div style={{ fontSize:9, fontWeight:700, color:MUTED, textTransform:'uppercase', marginBottom:4 }}>Exports</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:4 }}>
                {exports_.map((e, i) => {
                  const name = typeof e === 'string' ? e : e.name || e.good || 'unknown';
                  return <Pill key={i} label={name} color="#5a7a2a" onRemove={() => removeExport(i)}/>;
                })}
                {!exports_.length && <span style={{ fontSize:10, color:MUTED }}>None</span>}
              </div>
              <CatalogSearch items={exportCatalogItems} onAdd={addExport} placeholder="Search exports..."/>
            </div>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:MUTED, textTransform:'uppercase', marginBottom:4 }}>Imports</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:4 }}>
                {imports_.map((e, i) => {
                  const name = typeof e === 'string' ? e : e.name || e.good || 'unknown';
                  return <Pill key={i} label={name} color="#7a5a2a" onRemove={() => removeImport(i)}/>;
                })}
                {!imports_.length && <span style={{ fontSize:10, color:MUTED }}>None</span>}
              </div>
              <CatalogSearch items={importCatalogItems} onAdd={addImport} placeholder="Search imports..."/>
            </div>
          </SubSection>

          {/* Priority Sliders */}
          <SubSection title="Priorities">
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <PrioritySlider label="Economy"  value={getSliderValue('economy')}  onChange={v => handleSliderChange('economy',  v)} onCommit={handleSliderCommit} color="#2a7a2a"/>
              <PrioritySlider label="Military" value={getSliderValue('military')} onChange={v => handleSliderChange('military', v)} onCommit={handleSliderCommit} color="#7a2a2a"/>
              <PrioritySlider label="Magic"    value={getSliderValue('magic')}    onChange={v => handleSliderChange('magic',    v)} onCommit={handleSliderCommit} color="#5a2a8a"/>
              <PrioritySlider label="Religion" value={getSliderValue('religion')} onChange={v => handleSliderChange('religion', v)} onCommit={handleSliderCommit} color="#a0762a"/>
              <PrioritySlider label="Criminal" value={getSliderValue('criminal')} onChange={v => handleSliderChange('criminal', v)} onCommit={handleSliderCommit} color="#4a4a4a"/>
            </div>
          </SubSection>
        </div>
      )}

      {/* Narrative drift gate — opens when a structural/seismic edit is
          attempted on a narrated save. Per design decision 4, there's no
          "leave stale" option. Progress is only offered when the parent
          wired up onProgressNarrative (i.e. we have a saveId and are online);
          the modal also hides it automatically for seismic changes. */}
      <NarrativeDriftModal
        open={!!pendingMutation}
        changeLabel={pendingMutation?.changeLabel || ''}
        changeClass={pendingMutation?.changeClass || 'structural'}
        onRegenerate={handleDriftRegenerate}
        onProgress={onProgressNarrative ? handleDriftProgress : undefined}
        progressionCost={CREDIT_COSTS.progression}
        onRevert={handleDriftRevert}
        onCancel={handleDriftCancel}
      />
    </div>
  );
}
