import { useState } from 'react';
import { INK, BODY, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, sans, serif_, FS, SP, swatch } from '../theme.js';
import { Plus, Edit3, Trash2, Copy, Wand2, X } from 'lucide-react';
import { CRITICALITY, ECONOMIC_WEIGHT, DEFENSE_ROLES, POWER_AUTHORITIES, FOOD_IMPACT, DEITY_ALIGNMENT, DEITY_TEMPER, DEITY_TIER, DEITY_LAW, satisfiesOptions } from '../../domain/customContentSchema.js';
import SupplyChainsManager from './SupplyChainsManager.jsx';
import CategorySelect from '../primitives/CategorySelect.jsx';
import { useStore } from '../../store/index.js';
import { navigate } from '../../hooks/useRoute.js';
import { buildRegistry } from '../../lib/customRegistry.js';
import DeleteConfirmation from '../DeleteConfirmation';
import { Tag } from './primitives.jsx';
import { DependencySummary, DependenciesSection } from './Dependencies.jsx';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import DeityEffectPreview from './DeityEffectPreview.jsx';
import PantheonActivationStrip from './PantheonActivationStrip.jsx';
import ContentPackBar from './ContentPackBar.jsx';
import FactionEventBanner from './FactionEventBanner.jsx';
// Per-bucket schema + the two authoring lanes live in customCategories.js (data
// only) so they're importable without the manager (and re-exported here for the
// existing CUSTOM_CATEGORIES import sites, e.g. Dependencies.jsx).
import { CUSTOM_CATEGORIES, AUTHORING_LANES, CATEGORY_BY_KEY } from './customCategories.js';

export { CUSTOM_CATEGORIES, AUTHORING_LANES, CATEGORY_BY_KEY };

// ── Custom Content Manager ──────────────────────────────────────────────────

const STRESSOR_AFFECT_CATEGORIES = [
  'economy', 'safety', 'supply chains', 'military', 'religion', 'magic',
  'criminal', 'governance', 'population', 'morale',
];

const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const SEVERITY_LEVELS = ['minor','moderate','severe','catastrophic'];
const GOV_TYPES = ['monarchy','republic','theocracy','oligarchy','tribal','military junta','council','anarchy'];
const POSTURES = ['peaceful','defensive','aggressive','fortified','guerrilla'];

// Plain-language helper text under each field, so the form explains itself
// and stays as intuitive as possible. Keyed by field name; missing = no hint.
const FIELD_HINTS = {
  category:       'Which part of settlement life this belongs to, and where it appears in the dossier. Pick “+ New category…” to add your own.',
  authority:      'Which power it feeds in the settlement’s leadership. A temple feeds religious authority; a garrison feeds martial.',
  defenseRole:    'Whether and how this strengthens the settlement’s defense.',
  essential:      'Always included when this settlement is generated, like a mill or watch. Never rolled probabilistically.',
  foodImpact:     'Whether this raises or drains food security (a farm produces; a large garrison consumes). Moves the deficit.',
  satisfies:      'Trade category this good belongs to. Dragonbone Greatswords folds into Weapons & armour. In the Economics tab the good folds into this category line (incl. its name) instead of a separate pill. Demand categories (weapons/religious/maritime/luxury/alchemical) also cover local need + export surplus. Pick “Other” to type your own. It stays available while any item uses it.',
  criticality:    'How essential this is. Critical things (food, water, timber) cause crises when supply breaks; luxuries don’t.',
  economicWeight: 'How much this reinforces the local economy.',
  magical:        'Turn on if this is arcane or enchanted in nature.',
  criminal:       'Turn on if this operates outside the law.',
  tierMin:        'Smallest settlement size where this can appear (blank = any).',
  tierMax:        'Largest settlement size where this still appears (blank = no limit).',
  archetype:      'e.g. merchant guild, thieves’ cabal, knightly order.',
  agenda:         'What this faction is trying to achieve.',
  scale:          'How much reach and influence this faction has.',
  methods:        'How it pursues its agenda: bribery, force, diplomacy.',
  alignmentAxis:  'The god’s moral cast: good, evil, or neutral. Shapes how its faithful behave and which settlements it can win.',
  temperamentAxis:'Whether the god is warlike, peacelike, or neutral. A warlike god is a banner for conquest.',
  rankAxis:       'How grand the god is: a major pillar of the pantheon, a minor god, or a fringe cult. A major god anchors religious authority more strongly.',
  lawAxis:        'Whether the god is lawful, chaotic, or neutral. A lawful god strengthens law & order; a chaotic god erodes order and makes corruption more tolerated.',
  domain:         'What the god presides over (war, the harvest, the dead). Optional flavour.',
};

// CustomItemAttributes lives in its own leaf module so the upsell preview can
// reuse it without CustomContent ↔ CustomContentGate importing each other (a
// fresh ESM cycle). Re-exported here for existing import sites.
export { CustomItemAttributes } from './CustomItemAttributes.jsx';
import { CustomItemAttributes } from './CustomItemAttributes.jsx';

// The premium upsell card lives in a sibling file to keep this manager under the
// size ratchet; re-exported for existing import sites. ReadOnlyCustomContentList
// stays here (its colored category pills are raw buttons tracked in the
// raw-button burn-down baseline for this path).
export { CustomContentUpsell } from './CustomContentGate.jsx';
import { CustomContentUpsell } from './CustomContentGate.jsx';

// ── Read-only viewer for grandfathered local items (free tier) ─────────────
export function ReadOnlyCustomContentList({ search }) {
  const customContent = useStore(s => s.customContent);
  const [activeCat, setActiveCat] = useState('institutions');
  const catDef = CUSTOM_CATEGORIES.find(c => c.key === activeCat);
  const items = customContent[activeCat] || [];
  const filtered = search
    ? items.filter(i => (i.name || '').toLowerCase().includes(search) || (i.description || '').toLowerCase().includes(search))
    : items;
  const totalLocal = Object.values(customContent).reduce((sum, arr) => sum + (arr?.length || 0), 0);
  if (totalLocal === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{
        fontSize: FS.xs, fontWeight: 700, color: MUT, textTransform: 'uppercase',
        letterSpacing: '0.05em', marginBottom: 8,
      }}>
        Grandfathered items &middot; read only
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {CUSTOM_CATEGORIES.map(c => {
          const count = (customContent[c.key] || []).length;
          if (count === 0) return null;
          return (
            <button key={c.key} type="button" aria-pressed={activeCat === c.key} onClick={() => setActiveCat(c.key)} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', minHeight: 44,
              borderRadius: 12, fontSize: FS.xs,
              fontWeight: activeCat === c.key ? 700 : 500, cursor: 'pointer',
              border: `1px solid ${activeCat === c.key ? c.color : BOR}`,
              background: activeCat === c.key ? `${c.color}14` : 'transparent',
              color: activeCat === c.key ? c.color : SEC,
            }}>
              {c.label}
              <span style={{
                fontSize: FS.micro, fontWeight: 700, background: `${c.color}20`, color: c.color,
                borderRadius: 6, padding: '0 4px', marginLeft: 2,
              }}>{count}</span>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: '14px', textAlign: 'center', fontSize: FS.sm, color: BODY }}>
          No items in {catDef.label.toLowerCase()}.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              borderLeft: `3px solid #7c3aed`, borderRadius: 7,
              padding: '8px 12px', background: 'rgba(255,251,245,0.95)', opacity: 0.85,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK, flex: 1 }}>
                  {item.name}
                </span>
                <Tag label="Local" color="#7c3aed" title="Saved on this device only, not in your library. Readable on the free tier." />
                {item.category && <Tag label={item.category} color={catDef.color} />}
              </div>
              {item.description && (
                <div style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.4, marginTop: 4 }}>
                  {item.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Clone a prebuilt registry seed into an editable draft. Maps the registry
 *  entry's stable display fields onto the form's draft shape — a starting point
 *  the author then edits + saves as their own custom item ("start from a built-in"). */
function seedDraftFromPrebuilt(entry) {
  if (!entry) return {};
  const draft = {
    name: entry.name ? `${entry.name} (copy)` : '',
    description: entry.desc || '',
  };
  if (entry.subcategory && entry.subcategory !== 'custom') draft.category = entry.subcategory;
  if (Array.isArray(entry.tags) && entry.tags.length) draft.tags = entry.tags.join(', ');
  if (entry.tierMin) draft.tierMin = entry.tierMin;
  return draft;
}

export function CustomContentManager({ search, initialCat }) {
  const customContent = useStore(s => s.customContent);
  const addCustomItem = useStore(s => s.addCustomItem);
  const updateCustomItem = useStore(s => s.updateCustomItem);
  const deleteCustomItem = useStore(s => s.deleteCustomItem);
  const canUseCustomContent = useStore(s => s.canUseCustomContent());
  const authTier = useStore(s => s.auth.tier);
  const customContentLoading = useStore(s => s.customContentLoading);
  const customContentError = useStore(s => s.customContentError);
  const loadCustomContentFromCloud = useStore(s => s.loadCustomContentFromCloud);

  // A ?cat=<bucket> deep-link (e.g. the picker's "Author a deity" jump) can
  // pre-select a bucket. Validated against the known categories so a bad param
  // falls back to the default rather than selecting a non-existent bucket.
  const [activeCat, setActiveCat] = useState(
    initialCat && CATEGORY_BY_KEY[initialCat] ? initialCat : 'institutions',
  );
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState({});
  // "Start from a built-in" — when open, surface the prebuilt seeds the author
  // can clone into an editable draft. Only meaningful for buckets that have a
  // prebuilt registry catalog (institutions/resources/stressors/tradeGoods).
  const [showSeeds, setShowSeeds] = useState(false);
  // Authoring form: essentials (name/category/description) always show; the
  // long schema tail collapses behind a progressive-disclosure toggle so the
  // form leads with a focal essentials tier instead of a flat field wall.
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Name of the item just saved (new, not edited). Drives a one-shot peak/end
  // affordance so the authoring loop closes on a runnable next step ("test it")
  // rather than just snapping back to the form-closed list (P9). Dismissible.
  const [justSaved, setJustSaved] = useState(null);

  const catDef = CUSTOM_CATEGORIES.find(c => c.key === activeCat);
  const items = customContent[activeCat] || [];
  const filtered = search ? items.filter(i => {
    const tagStr = Array.isArray(i.tags) ? i.tags.join(' ') : String(i.tags || '');
    return (i.name||'').toLowerCase().includes(search)
        || (i.description||'').toLowerCase().includes(search)
        || tagStr.toLowerCase().includes(search);
  }) : items;

  // ── Premium gate ─────────────────────────────────────────────────────────
  // Free / anon users see an upsell card. If they have grandfathered local
  // items, they can browse them in read-only mode below the upsell.
  if (!canUseCustomContent) {
    const totalCount = Object.values(customContent).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    return (
      <div>
        <CustomContentUpsell existingCount={totalCount} isAnon={authTier === 'anon'} />
        <ReadOnlyCustomContentList search={search} />
      </div>
    );
  }

  const resetDraft = () => { setDraft({}); setAddingNew(false); setEditingId(null); setShowSeeds(false); setJustSaved(null); };

  // A fresh draft for the active bucket — deities open with valid default axes so
  // validateDeity passes; everything else starts blank.
  const freshDraft = () => (activeCat === 'deities'
    ? { alignmentAxis: 'neutral', temperamentAxis: 'neutral', rankAxis: 'minor', lawAxis: 'neutral' }
    : {});

  const handleSave = () => {
    if (!draft.name?.trim()) return;
    if (editingId) {
      updateCustomItem(activeCat, editingId, draft);
      setEditingId(null);
    } else {
      addCustomItem(activeCat, draft);
      setAddingNew(false);
      // New item saved — close the loop on a runnable next step (P9).
      setJustSaved(draft.name.trim());
    }
    setDraft({});
    setShowSeeds(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setDraft({ ...item });
    setAddingNew(false);
    setShowSeeds(false);
  };

  // "Start from a built-in" — clone a prebuilt registry seed into an editable
  // draft (the author then tweaks + saves it as their own custom item).
  const cloneFromSeed = (entry) => {
    setDraft(seedDraftFromPrebuilt(entry));
    setAddingNew(true);
    setEditingId(null);
    setShowSeeds(false);
  };
  // Buckets with a prebuilt catalog to clone from.
  const SEEDABLE = new Set(['institutions', 'services', 'resources', 'stressors', 'tradeGoods']);
  const seedEntries = (showSeeds && SEEDABLE.has(activeCat))
    ? buildRegistry(customContent).listPrebuilt(activeCat === 'services' ? 'services' : activeCat).slice(0, 60)
    : [];

  // Multi-select "pill" picker for controlled-vocabulary list fields (tags,
  // commodities, stressor channels) — selectable, not free text. Stores the
  // selection as an array; parses a legacy comma-string on read so older
  // free-text entries still load.
  const renderPills = (field, options, accent) => {
    const cur = draft[field];
    const arr = Array.isArray(cur)
      ? cur
      : (typeof cur === 'string' && cur ? cur.split(',').map(s => s.trim()).filter(Boolean) : []);
    const set = new Set(arr);
    return (
      <div style={{ display:'flex', flexWrap:'wrap', gap:4, padding:'4px 0' }}>
        {options.map(opt => {
          const on = set.has(opt);
          return (
            <Button
              key={opt}
              variant={on ? 'gold' : 'secondary'}
              size="sm"
              aria-pressed={on}
              onClick={() => { const next = new Set(set); if (on) next.delete(opt); else next.add(opt); setDraft(d => ({ ...d, [field]: Array.from(next) })); }}
              style={{
                padding:'2px 8px', borderRadius:10, fontSize:FS.xxs,
                letterSpacing:'0.03em',
                border:`1px solid ${on?accent:BOR}`,
                background:on?`${accent}14`:'transparent',
                color:on?accent:SEC,
              }}
            >{opt}</Button>
          );
        })}
      </div>
    );
  };

  const renderField = (field) => {
    const val = draft[field] || '';
    const shared = { id:`ccm-field-${field}`, value:val, onChange:e => setDraft(d=>({...d,[field]:e.target.value})), style:{ width:'100%', padding:'5px 8px', border:`1px solid ${BOR}`, borderRadius:4, fontSize:FS.sm, fontFamily:sans, color:INK, outline:'none', background:CARD } };

    switch(field) {
      case 'category': return <CategorySelect type={activeCat} value={val} customContent={customContent} onChange={v => setDraft(d => ({ ...d, category: v }))} style={shared.style} />;
      case 'tierMin': return <select {...shared} value={val||''}><option value="">Any tier</option>{TIERS.map(t=><option key={t} value={t}>{t}</option>)}</select>;
      case 'tierMax': return <select {...shared} value={val||''}><option value="">No upper limit</option>{TIERS.map(t=><option key={t} value={t}>{t}</option>)}</select>;
      case 'foodImpact': return <select {...shared} value={val||''}><option value="">No food impact</option>{FOOD_IMPACT.filter(f=>f.key!=='none').map(f=><option key={f.key} value={f.key}>{f.label}</option>)}</select>;
      case 'satisfies': return <CategorySelect options={satisfiesOptions(customContent)} value={val} onChange={v => setDraft(d => ({ ...d, satisfies: v }))} placeholder="Doesn’t fold into a trade category" newLabel="+ Other category…" style={shared.style} />;
      case 'authority': return <select {...shared} value={val||''}><option value="">No authority contribution</option>{POWER_AUTHORITIES.map(a=><option key={a.key} value={a.key}>{a.label}</option>)}</select>;
      case 'defenseRole': return <select {...shared} value={val||''}><option value="">No defense role</option>{DEFENSE_ROLES.map(d=><option key={d.key} value={d.key}>{d.label}</option>)}</select>;
      case 'criticality': return <select {...shared} value={val||''}><option value="">Select…</option>{CRITICALITY.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}</select>;
      case 'economicWeight': return <select {...shared} value={val||''}><option value="">Select…</option>{ECONOMIC_WEIGHT.map(w=><option key={w.key} value={w.key}>{w.label}</option>)}</select>;
      case 'scale': return <select {...shared} value={val||''}><option value="">Select…</option>{['cell','minor','significant','dominant'].map(s=><option key={s} value={s}>{s}</option>)}</select>;
      // Deity axes (Feature D). Default to a valid enum so a saved deity
      // always passes validateDeity / the 049 DB CHECK; never an empty option.
      case 'alignmentAxis': return <select {...shared} value={val||'neutral'}>{DEITY_ALIGNMENT.map(a=><option key={a.key} value={a.key}>{a.label}</option>)}</select>;
      case 'temperamentAxis': return <select {...shared} value={val||'neutral'}>{DEITY_TEMPER.map(t=><option key={t.key} value={t.key}>{t.label}</option>)}</select>;
      case 'rankAxis': return <select {...shared} value={val||'minor'}>{DEITY_TIER.map(r=><option key={r.key} value={r.key}>{r.label}</option>)}</select>;
      case 'lawAxis': return <select {...shared} value={val||'neutral'}>{DEITY_LAW.map(l=><option key={l.key} value={l.key}>{l.label}</option>)}</select>;
      case 'essential':
      case 'magical':
      case 'criminal': {
        const on = draft[field] === true;
        const accent = field === 'essential' ? '#1a4a20' : field === 'magical' ? swatch.magic : '#8b1a1a';
        const lbl = field === 'essential' ? 'Essential' : field === 'magical' ? 'Magical' : 'Criminal';
        return (
          <Button
            variant={on ? 'gold' : 'secondary'}
            size="sm"
            aria-pressed={on}
            onClick={() => setDraft(d => ({ ...d, [field]: !on }))}
            style={on ? { border:`1px solid ${accent}`, background:`${accent}14`, color:accent } : undefined}
          >
            {on ? '✓ ' : ''}{lbl}
          </Button>
        );
      }
      case 'severity': return <select {...shared} value={val||'moderate'}>{SEVERITY_LEVELS.map(s=><option key={s} value={s}>{s}</option>)}</select>;
      case 'governmentType': return <select {...shared} value={val||''}><option value="">Select...</option>{GOV_TYPES.map(g=><option key={g} value={g}>{g}</option>)}</select>;
      case 'posture': return <select {...shared} value={val||''}><option value="">Select...</option>{POSTURES.map(p=><option key={p} value={p}>{p}</option>)}</select>;
      case 'stability': return <select {...shared} value={val||'stable'}>{['stable','unstable','crisis','collapsing'].map(s=><option key={s} value={s}>{s}</option>)}</select>;
      case 'fortification': return <select {...shared} value={val||'none'}>{['none','basic','moderate','heavy','legendary'].map(f=><option key={f} value={f}>{f}</option>)}</select>;
      case 'militiaLevel': return <select {...shared} value={val||'none'}>{['none','volunteer','trained','professional','elite'].map(m=><option key={m} value={m}>{m}</option>)}</select>;
      case 'factionCount': return <input {...shared} type="number" min="1" max="10" placeholder="Number of factions"/>;
      case 'tags': return <input {...shared} placeholder="Comma-separated keywords for search (e.g. ancient, foreign, ceremonial)" onChange={e=>setDraft(d=>({...d,tags:e.target.value}))}/>;
      case 'commodities': return <input {...shared} placeholder="Comma-separated (e.g. iron ore, coal, gemstones)" onChange={e=>setDraft(d=>({...d,commodities:e.target.value}))}/>;
      case 'affects': return renderPills('affects', STRESSOR_AFFECT_CATEGORIES, '#8b1a1a');
      case 'description': return <textarea {...shared} rows={2} placeholder="Description..." style={{...shared.style, resize:'vertical'}}/>;
      default: return <input {...shared} placeholder={field.charAt(0).toUpperCase()+field.slice(1)}/>;
    }
  };

  // One labelled form field (label nests the control + its hint).
  const renderFormField = (f) => (
    <div key={f}>
      {/* eslint-disable-next-line jsx-a11y/label-has-for -- deprecated rule; label nests the renderField control + has matching htmlFor, but the static nesting check can't see through renderField(). label-has-associated-control passes. */}
      <label htmlFor={`ccm-field-${f}`} style={{ fontSize:FS.xs, fontWeight:700, color:BODY, textTransform:'uppercase', letterSpacing:'0.04em' }}>
        {f.replace(/([A-Z])/g,' $1')}
        {renderField(f)}
      </label>
      {FIELD_HINTS[f] && <div style={{ fontSize:FS.xs, color:BODY, fontStyle:'italic', marginTop:2, lineHeight:1.4 }}>{FIELD_HINTS[f]}</div>}
    </div>
  );

  const renderForm = () => {
    // Essentials (name/category/description) lead at full prominence; the rest
    // of the bucket's schema is the demoted "Advanced attributes" tail.
    const ESSENTIAL_FIELDS = ['name', 'category', 'description'];
    const essentials = catDef.fields.filter(f => ESSENTIAL_FIELDS.includes(f));
    const advanced = catDef.fields.filter(f => !ESSENTIAL_FIELDS.includes(f));
    return (
    <div style={{ padding:'10px 12px', background:swatch['#F8F4FF'], borderLeft:`3px solid ${swatch.magic}`, borderRadius:7, marginBottom:10 }}>
      <div style={{ fontSize:FS.xs, fontWeight:700, color:swatch.magic, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>
        {editingId ? 'Edit item' : 'New custom ' + catDef.label.slice(0,-1)}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {essentials.map(renderFormField)}
      </div>
      {advanced.length > 0 && (
        <div style={{ marginTop:10 }}>
          <Button variant="ghost" size="sm" aria-expanded={showAdvanced} onClick={() => setShowAdvanced(s => !s)}>
            {showAdvanced ? '▾' : '▸'} Advanced attributes ({advanced.length})
          </Button>
          {showAdvanced && (
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:8 }}>
              {advanced.map(renderFormField)}
            </div>
          )}
        </div>
      )}

      {/* Deity Effect Preview — "this god will…", read live from the shared
          single-source describeDeityEffects (the SAME numbers the engine uses). */}
      {activeCat === 'deities' && <DeityEffectPreview draft={draft} />}

      {/* Dependencies — collapsible. Categories without `dependencies` skip this. */}
      {Array.isArray(catDef.dependencies) && catDef.dependencies.length > 0 && (
        <DependenciesSection
          deps={catDef.dependencies}
          draft={draft}
          setDraft={setDraft}
        />
      )}

      <div style={{ display:'flex', gap:6, marginTop:8 }}>
        <Button variant="ai" size="sm" onClick={handleSave} disabled={!draft.name?.trim()}>{editingId?'Update':'Add'}</Button>
        <Button variant="secondary" size="sm" onClick={resetDraft}>Cancel</Button>
      </div>
    </div>
    );
  };

  const isLivingLane = AUTHORING_LANES.find(l => l.buckets.includes(activeCat))?.key === 'living';

  return (
    <div data-testid="custom-content-manager">
      {/* Content-pack export/import (premium reuse + sharing). */}
      <ContentPackBar />

      {/* Sync status — visible whenever a cloud sync is in flight, regardless of
          which bucket is active or whether it already has cached items. Without
          this, switching to a cached bucket during a background sync showed no
          status, so a subsequent sync error popped with no preceding process to
          end (P10). The full skeleton still covers the empty-bucket first load. */}
      {customContentLoading && !customContentError && (
        <div role="status" style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 12px', marginBottom:10, fontSize:FS.xs, color:BODY, fontStyle:'italic' }}>
          Syncing your custom content…
        </div>
      )}

      {/* Sync failure — a paid synced-write surface must not fail silently.
          Surface the error in plain language with a one-click retry. */}
      {customContentError && (
        <div role="alert" style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', padding:'8px 12px', marginBottom:10, background:`${swatch.danger}10`, borderLeft:`3px solid ${swatch.danger}`, borderRadius:6 }}>
          <span style={{ flex:1, minWidth:180, fontSize:FS.sm, color:BODY, lineHeight:1.45 }}>
            Your custom content could not sync: {customContentError}
          </span>
          <Button variant="secondary" size="sm" onClick={() => loadCustomContentFromCloud()}>Retry sync</Button>
        </div>
      )}

      {/* Two authoring lanes: STATIC settlement content vs the LIVING-WORLD
          content that powers the simulation. The dead buckets appear in neither. */}
      {AUTHORING_LANES.map((lane, li) => (
        // Wider gap between lanes than within one, so the two clusters read as
        // distinct from spacing alone (the primary IA split of this surface).
        <div key={lane.key} data-testid={`authoring-lane-${lane.key}`} style={{ marginBottom: li < AUTHORING_LANES.length - 1 ? SP.xl : SP.md }}>
          <div style={{ fontSize:FS.xs, fontWeight:800, color: lane.key === 'living' ? swatch['#7A5A1A'] : INK, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>
            {lane.label}
          </div>
          <div style={{ fontSize:FS.xs, color:BODY, lineHeight:1.4, marginBottom:6 }}>{lane.blurb}</div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {lane.buckets.map(key => {
              const c = CATEGORY_BY_KEY[key];
              if (!c) return null;
              const count = (customContent[c.key]||[]).length;
              return (
                <button key={c.key} type="button" aria-pressed={activeCat===c.key} onClick={() => { setActiveCat(c.key); resetDraft(); }}
                  style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', minHeight:44, borderRadius:12, fontSize:FS.xs, fontWeight:activeCat===c.key?700:500, cursor:'pointer', border:`1px solid ${activeCat===c.key?c.color:BOR}`, background:activeCat===c.key?`${c.color}14`:'transparent', color:activeCat===c.key?c.color:SEC }}>
                  {c.label}
                  {count > 0 && <span style={{ fontSize:FS.micro, fontWeight:700, background:`${c.color}20`, color:c.color, borderRadius:6, padding:'0 4px', marginLeft:2 }}>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Pantheon activation strip — only meaningful in the living-world lane. */}
      {isLivingLane && <PantheonActivationStrip />}

      {/* Faction relabel banner — factions arrive via an in-world event, not generation. */}
      {activeCat === 'factions' && <FactionEventBanner />}

      {/* Supply Chains: discovered + verified, not hand-authored — its own manager. */}
      {activeCat === 'supplyChains' && <SupplyChainsManager />}

      {/* Add / Start-from-a-built-in / Test-in-a-generation affordances. */}
      {activeCat !== 'supplyChains' && !addingNew && !editingId && (
        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:10 }}>
          {/* Create affordances cluster on the left … */}
          <Button variant="ai" size="sm" icon={<Plus size={12}/>} onClick={() => { setAddingNew(true); setDraft(freshDraft()); setShowSeeds(false); setJustSaved(null); }}>
            Add custom {catDef.label.slice(0,-1)}
          </Button>
          {SEEDABLE.has(activeCat) && (
            <Button variant="secondary" size="sm" icon={<Copy size={12}/>} onClick={() => setShowSeeds(s => !s)} aria-pressed={showSeeds}>
              Start from a built-in
            </Button>
          )}
          {/* … the forward exit from authoring is pushed to the right, set
              apart from the create actions as a distinct next step. */}
          <Button variant="secondary" size="sm" icon={<Wand2 size={12}/>} onClick={() => navigate('generate')} title="Run a generation that draws on your custom content." style={{ marginLeft:'auto' }}>
            Test in a generation
          </Button>
        </div>
      )}

      {/* Built-in seed picker (clone a catalog entry into an editable draft). */}
      {!addingNew && !editingId && showSeeds && seedEntries.length > 0 && (
        <div data-testid="builtin-seed-picker" style={{ borderLeft:`3px solid ${swatch.magic}`, borderRadius:7, padding:'8px 10px', marginBottom:10, background:CARD, maxHeight:200, overflowY:'auto' }}>
          <div style={{ fontSize:FS.xxs, fontWeight:700, color:MUT, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6 }}>
            Clone a built-in {catDef.label.toLowerCase().replace(/s$/,'')} as a starting point
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {seedEntries.map(entry => (
              <Button key={entry.refId} variant="ghost" size="sm" onClick={() => cloneFromSeed(entry)}
                style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-start', textAlign:'left', border:`1px solid ${BOR}`, borderRadius:5, padding:'5px 8px', background:'transparent', color:INK }}>
                <span style={{ fontSize:FS.xs, fontWeight:600, flex:1 }}>{entry.name}</span>
                {entry.subcategory && <Tag label={entry.subcategory} color={catDef.color}/>}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Add/edit form */}
      {activeCat !== 'supplyChains' && (addingNew || editingId) && renderForm()}

      {/* Peak/end: the authoring loop just closed on a save — offer the one
          forward action (run a generation that uses it) instead of snapping
          silently back to the list. Dismissible; hidden while authoring (P9). */}
      {justSaved && !addingNew && !editingId && (
        <div role="status" style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', padding:'8px 12px', marginBottom:10, background:`${swatch.magic}0d`, borderLeft:`3px solid ${swatch.magic}`, borderRadius:7 }}>
          <span style={{ flex:1, minWidth:160, fontSize:FS.sm, color:BODY, lineHeight:1.45 }}>
            <strong>{justSaved}</strong> saved. See it shape a world.
          </span>
          <Button variant="ai" size="sm" icon={<Wand2 size={12}/>} onClick={() => navigate('generate')}>
            Test in a generation
          </Button>
          <IconButton Icon={X} glyph="×" label="Dismiss" tone="ghost" size="sm" onClick={() => setJustSaved(null)} />
        </div>
      )}

      {/* Items list */}
      {activeCat !== 'supplyChains' && (
        customContentLoading && items.length === 0 ? (
        <div data-testid="custom-content-loading" style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ height:44, borderRadius:7, background:`${swatch.magic}0d`, border:`1px solid ${BOR}` }}/>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        // Honest empty states: distinguish "filtered to nothing" from
        // "truly none yet", and offer a one-click out of each.
        search && items.length > 0 ? (
          <div style={{ padding:'20px 16px', textAlign:'center' }}>
            <div style={{ fontSize:FS.sm, color:BODY, marginBottom:10 }}>
              No custom {catDef.label.toLowerCase()} match &ldquo;{search}&rdquo;.
            </div>
          </div>
        ) : (
          <div style={{ padding:'20px 16px', textAlign:'center' }}>
            <div style={{ fontSize:FS.sm, color:BODY, marginBottom: SEEDABLE.has(activeCat) ? 10 : 0 }}>
              No custom {catDef.label.toLowerCase()} yet. Use the Add button above to create one.
            </div>
            {SEEDABLE.has(activeCat) && (
              <Button variant="secondary" size="sm" icon={<Copy size={12}/>} onClick={() => setShowSeeds(true)}>
                Start from a built-in {catDef.label.slice(0,-1).toLowerCase()}
              </Button>
            )}
          </div>
        )
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ borderLeft:`3px solid #7c3aed`, borderRadius:7, padding:'8px 12px', background:'rgba(255,251,245,0.95)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontFamily:serif_, fontSize:FS.md, fontWeight:700, color:INK, flex:1 }}>{item.name}</span>
                <Tag label="Custom" color='#7c3aed'/>
                {item.category && <Tag label={item.category} color={catDef.color}/>}
                <IconButton Icon={Edit3} label="Edit item" tone="ghost" size="sm" onClick={() => handleEdit(item)} />
                <IconButton Icon={Trash2} label="Delete item" tone="danger" size="sm" onClick={() => setDeleteId(deleteId===item.id?null:item.id)} />
              </div>
              {item.description && <div style={{ fontSize:FS.xs, color:SEC, lineHeight:1.4, marginTop:4 }}>{item.description}</div>}
              <CustomItemAttributes item={item} />
              {item.tags && <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginTop:4 }}>{(typeof item.tags==='string'?item.tags.split(','):item.tags).map((t,i)=><Tag key={i} label={t.trim()} color={MUT}/>)}</div>}
              {/* Affects pills (stressors only) */}
              {Array.isArray(item.affects) && item.affects.length > 0 && (
                <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginTop:4 }}>
                  {item.affects.map((a, i) => (
                    <span key={i} style={{
                      fontSize:FS.xs, fontWeight:700, color:swatch.danger,
                      // Translucent danger fill — was solid swatch.danger on
                      // swatch.danger text, rendering the label invisible.
                      background:`${swatch.danger}14`, border:'1px solid #8b1a1a44',
                      borderRadius:8, padding:'1px 6px',
                      textTransform:'uppercase', letterSpacing:'0.04em',
                    }}>{a}</span>
                  ))}
                </div>
              )}
              {/* Dependencies summary + dangling-ref warnings */}
              {Array.isArray(catDef.dependencies) && catDef.dependencies.length > 0 && (
                <DependencySummary deps={catDef.dependencies} item={item} />
              )}
              {deleteId === item.id && (
                <DeleteConfirmation
                  entityName={item.name}
                  details="Removing from catalog only. Existing settlements that use this item keep their copy."
                  onConfirm={() => { deleteCustomItem(activeCat, item.id); setDeleteId(null); }}
                  onCancel={() => setDeleteId(null)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
