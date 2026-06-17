import { useState } from 'react';
import { GOLD, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, sans, serif_, FS, swatch } from '../theme.js';
import { Sparkles, AlertTriangle, Link2, Building2, Plus, Edit3, Trash2, Package, HeartHandshake, Flag, Coins } from 'lucide-react';
import { CRITICALITY, ECONOMIC_WEIGHT, DEFENSE_ROLES, POWER_AUTHORITIES, FOOD_IMPACT, TRADE_CATEGORIES, satisfiesOptions } from '../../domain/customContentSchema.js';
import SupplyChainsManager from './SupplyChainsManager.jsx';
import CategorySelect from '../primitives/CategorySelect.jsx';
import { useStore } from '../../store/index.js';
import DeleteConfirmation from '../DeleteConfirmation';
import { Tag } from './primitives.jsx';
import { DependencySummary, DependenciesSection } from './Dependencies.jsx';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';

// ── Custom Content Manager ──────────────────────────────────────────────────

// Per-category schema:
//   fields:        flat scalar fields rendered in the main form
//   dependencies:  refId-array fields rendered in the always-visible Dependencies
//                  section (it's what wires custom content into generation + chain
//                  discovery, so it never collapses). Each dep field is
//                  { key, label, category | categories[], single?, hint? } where
//                  `category` (or `categories` for a multi-bucket picker, e.g.
//                  tradeGoods + services) is the registry category to pick from.
export const CUSTOM_CATEGORIES = [
  { key:'institutions', label:'Institutions', Icon:Building2, color:'#1a3a7a',
    fields:['name','category','authority','tags','essential','magical','criminal','defenseRole','foodImpact','satisfies','description','tierMin','tierMax'],
    dependencies: [
      { key:'produces',    label:'Produces (goods/services)', categories:['tradeGoods','services'],
        hint:'Trade goods or services this institution generates when present.' },
      { key:'requires',    label:'Requires (inputs)',          categories:['resources','tradeGoods','services'],
        hint:'Resources, goods, or services this institution consumes — its absence makes the institution viability-marginal.' },
      { key:'subsumes',    label:'Subsumes (absorbs)',         category:'institutions',
        hint:'Institutions this one represents — when present, the smaller ones aren’t listed separately.' },
    ],
  },
  { key:'services',     label:'Services',     Icon:HeartHandshake, color:'#0e7c86',
    fields:['name','category','authority','criticality','economicWeight','magical','criminal','foodImpact','description','tierMin','tierMax'],
    dependencies: [
      { key:'providedBy', label:'Provided by (institution)', category:'institutions', single:true,
        hint:'The institution that offers this service (a service is something an institution provides).' },
      { key:'requires',   label:'Requires (inputs)',          categories:['resources','tradeGoods','services'],
        hint:'Resources, goods, or services this service consumes to operate.' },
    ],
  },
  { key:'resources',    label:'Resources',    Icon:Package,   color:'#1a5a28',
    fields:['name','category','criticality','foodImpact','commodities','description'],
    dependencies: [
      { key:'yields',  label:'Output (goods/services)', categories:['tradeGoods','services'],
        hint:'Goods or services this base resource yields once worked (built-in + custom) — feeds supply-chain discovery as the resource → processor → output flow.' },
      { key:'enables', label:'Enables institutions', category:'institutions',
        hint:'Institutions whose viability is boosted by access to this resource.' },
    ],
  },
  { key:'stressors',    label:'Stressors',    Icon:AlertTriangle, color:'#8b1a1a',
    fields:['name','description','severity','affects'],
    dependencies: [
      { key:'disablesInstitutions', label:'Disables institutions', category:'institutions',
        hint:'Institutions suspended or degraded while this stressor is active.' },
      { key:'disablesGoods',        label:'Disables trade goods',  category:'tradeGoods',
        hint:'Goods whose production halts under this stressor.' },
    ],
  },
  { key:'tradeGoods',   label:'Trade Goods',  Icon:Coins,     color:'#a0762a',
    fields:['name','category','criticality','economicWeight','foodImpact','satisfies','description'],
    dependencies: [
      { key:'requiredInstitution', label:'Required institution',  category:'institutions', single:true,
        hint:'Single institution that must be present for this good to be produced.' },
      { key:'requiredResources',   label:'Required resources',     categories:['resources','tradeGoods','services'],
        hint:'Resources, intermediate goods, or services needed to produce this good (built-in + custom).' },
    ],
  },
  { key:'factions',     label:'Factions',     Icon:Flag,      color:'#6a1a4a',
    fields:['name','authority','archetype','agenda','scale','methods','magical','criminal','defenseRole','description','tierMin'],
    dependencies: [
      { key:'controls',  label:'Controls institutions', category:'institutions',
        hint:'Institutions this faction holds sway over.' },
      { key:'rivals',    label:'Rivals (conflicts with)', category:'factions',
        hint:'Factions this one is in conflict with — flagged if both are present.' },
    ],
  },
  // Supply Chains are DISCOVERED (inferred from the inputs/outputs of the types
  // above), not hand-authored — this tab renders its own discover/verify
  // manager (SupplyChainsManager) instead of the generic add form.
  { key:'supplyChains', label:'Supply Chains', Icon:Link2,   color:'#a0762a', discovered:true },
  // Trade Routes / Power Presets / Defense Presets removed (§14): redundant with
  // the trade-route, government, and defense controls already in the generation
  // config. Supply chains are not hand-authored here either — they're discovered
  // (see the Supply Chains tab) from entity inputs/outputs.
];

const STRESSOR_AFFECT_CATEGORIES = [
  'economy', 'safety', 'supply chains', 'military', 'religion', 'magic',
  'criminal', 'governance', 'population', 'morale',
];

const TIERS = ['thorp','hamlet','village','town','city','metropolis'];
const SEVERITY_LEVELS = ['minor','moderate','severe','catastrophic'];
const GOV_TYPES = ['monarchy','republic','theocracy','oligarchy','tribal','military junta','council','anarchy'];
const POSTURES = ['peaceful','defensive','aggressive','fortified','guerrilla'];

// Plain-language helper text under each field, so the form explains itself
// (spec §14: as intuitive as possible). Keyed by field name; missing = no hint.
const FIELD_HINTS = {
  category:       'Which part of settlement life this belongs to — also where it appears in the dossier. Pick “+ New category…” to add your own.',
  authority:      'Which power it feeds in the settlement’s leadership — e.g. a temple → religious authority, a garrison → martial.',
  defenseRole:    'Whether and how this strengthens the settlement’s defense.',
  essential:      'Always included when this settlement is generated — like a mill or watch — never rolled probabilistically.',
  foodImpact:     'Whether this raises or drains food security (a farm produces; a large garrison consumes). Moves the deficit.',
  satisfies:      'Trade category this good belongs to — e.g. Dragonbone Greatswords → Weapons & armour. In the Economics tab the good folds into this category line (incl. its name) instead of a separate pill. Demand categories (weapons/religious/maritime/luxury/alchemical) also cover local need + export surplus. Pick “Other” to type your own — it stays available while any item uses it.',
  criticality:    'How essential this is. Critical things (food, water, timber) cause crises when supply breaks; luxuries don’t.',
  economicWeight: 'How much this reinforces the local economy.',
  magical:        'Turn on if this is arcane or enchanted in nature.',
  criminal:       'Turn on if this operates outside the law.',
  tierMin:        'Smallest settlement size where this can appear (blank = any).',
  tierMax:        'Largest settlement size where this still appears (blank = no limit).',
  archetype:      'e.g. merchant guild, thieves’ cabal, knightly order.',
  agenda:         'What this faction is trying to achieve.',
  scale:          'How much reach and influence this faction has.',
  methods:        'How it pursues its agenda — e.g. bribery, force, diplomacy.',
};

// §14 — resolve a stored enum key to its human label for the detail view.
const keyLabel = (list, key) => (list.find((o) => o.key === key)?.label) || key;

/**
 * CustomItemAttributes — the post-creation "detail sheet" for a saved custom
 * item, mirroring how the prebuilt catalog surfaces an object's properties.
 * Renders only the attributes the author actually set, as labelled chips, so a
 * saved item reads like a real compendium entry rather than just a name + blurb.
 */
export function CustomItemAttributes({ item }) {
  const chips = [];
  if (item.essential === true) chips.push({ label: 'Essential', color: '#1a4a20' });
  if (item.magical === true) chips.push({ label: 'Magical', color: swatch.magic });
  if (item.criminal === true) chips.push({ label: 'Criminal', color: '#8b1a1a' });
  if (item.authority) chips.push({ label: `Authority · ${keyLabel(POWER_AUTHORITIES, item.authority)}`, color: '#1a3a7a' });
  if (item.defenseRole) chips.push({ label: `Defense · ${keyLabel(DEFENSE_ROLES, item.defenseRole)}`, color: '#8b1a1a' });
  if (item.criticality) chips.push({ label: keyLabel(CRITICALITY, item.criticality), color: '#a0762a' });
  if (item.economicWeight) chips.push({ label: keyLabel(ECONOMIC_WEIGHT, item.economicWeight), color: '#1a5a28' });
  if (item.foodImpact) chips.push({ label: `Food · ${item.foodImpact}`, color: '#7a5010' });
  if (item.satisfies) chips.push({ label: `Trade category · ${keyLabel(TRADE_CATEGORIES, item.satisfies) || item.satisfies}`, color: '#7c3aed' });
  if (item.archetype) chips.push({ label: `Archetype · ${item.archetype}`, color: '#6a1a4a' });
  if (item.scale) chips.push({ label: `Scale · ${item.scale}`, color: '#6a1a4a' });
  if (item.severity) chips.push({ label: `Severity · ${item.severity}`, color: '#8b1a1a' });
  if (item.tierMin || item.tierMax) chips.push({ label: `Tiers · ${item.tierMin || 'any'}–${item.tierMax || '∞'}`, color: '#6b5340' });
  if (!chips.length) return null;
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
      {chips.map((c, i) => <Tag key={i} label={c.label} color={c.color} />)}
    </div>
  );
}

// ── Premium upsell card (shown to free / anon users in the Custom tab) ─────
export function CustomContentUpsell({ existingCount, isAnon }) {
  const setPurchaseModalOpen = useStore(s => s.setPurchaseModalOpen);
  return (
    <div style={{
      padding: '24px 20px', textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(160,118,42,0.06) 100%)',
      border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10,
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(124,58,237,0.12)', marginBottom: 12,
      }}>
        <Sparkles size={26} color="#7c3aed" />
      </div>
      <div style={{
        fontSize: FS['18'], fontWeight: 700, fontFamily: serif_, color: INK, marginBottom: 4,
      }}>
        Custom Compendium &mdash; Premium
      </div>
      <div style={{
        fontSize: FS.md, color: SEC, lineHeight: 1.55, marginBottom: 16,
        maxWidth: 460, margin: '0 auto 16px',
      }}>
        Build your own institutions, resources, stressors, trade goods, power presets, and defense
        scenarios. Custom content is synced to your account and available across devices.
      </div>

      {existingCount > 0 && (
        <div style={{
          padding: '10px 14px', background: 'rgba(160,118,42,0.10)',
          border: `1px solid ${GOLD}55`, borderRadius: 7,
          fontSize: FS.sm, color: GOLD, fontWeight: 600, marginBottom: 16,
          maxWidth: 460, margin: '0 auto 16px',
        }}>
          You have <strong>{existingCount}</strong> grandfathered custom item{existingCount === 1 ? '' : 's'}.
          They&rsquo;re still browseable below in read-only mode.
        </div>
      )}

      {isAnon ? (
        <div style={{ fontSize: FS.sm, color: MUT }}>Sign in and upgrade to Premium to unlock.</div>
      ) : (
        <Button variant="ai" size="lg" onClick={() => setPurchaseModalOpen(true)}>
          Upgrade to Premium
        </Button>
      )}
    </div>
  );
}

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
            <button key={c.key} type="button" onClick={() => setActiveCat(c.key)} style={{
              display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px',
              borderRadius: 12, fontSize: FS.xs,
              fontWeight: activeCat === c.key ? 700 : 500, cursor: 'pointer',
              border: `1px solid ${activeCat === c.key ? c.color : BOR}`,
              background: activeCat === c.key ? `${c.color}14` : 'transparent',
              color: activeCat === c.key ? c.color : SEC,
            }}>
              <c.Icon size={11} /> {c.label}
              <span style={{
                fontSize: FS.micro, fontWeight: 700, background: `${c.color}20`, color: c.color,
                borderRadius: 6, padding: '0 4px', marginLeft: 2,
              }}>{count}</span>
            </button>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <div style={{ padding: '14px', textAlign: 'center', fontSize: FS.sm, color: MUT }}>
          No items in {catDef.label.toLowerCase()}.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(item => (
            <div key={item.id} style={{
              border: `1px solid ${BOR}`, borderLeft: `3px solid #7c3aed`, borderRadius: 7,
              padding: '8px 12px', background: 'rgba(255,251,245,0.95)', opacity: 0.85,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: serif_, fontSize: FS.md, fontWeight: 700, color: INK, flex: 1 }}>
                  {item.name}
                </span>
                <Tag label="Local" color="#7c3aed" />
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

export function CustomContentManager({ search }) {
  const customContent = useStore(s => s.customContent);
  const addCustomItem = useStore(s => s.addCustomItem);
  const updateCustomItem = useStore(s => s.updateCustomItem);
  const deleteCustomItem = useStore(s => s.deleteCustomItem);
  const canUseCustomContent = useStore(s => s.canUseCustomContent());
  const authTier = useStore(s => s.auth.tier);
  const _customContentLoading = useStore(s => s.customContentLoading);
  const _customContentError = useStore(s => s.customContentError);

  const [activeCat, setActiveCat] = useState('institutions');
  const [addingNew, setAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [draft, setDraft] = useState({});

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

  const resetDraft = () => { setDraft({}); setAddingNew(false); setEditingId(null); };

  const handleSave = () => {
    if (!draft.name?.trim()) return;
    if (editingId) {
      updateCustomItem(activeCat, editingId, draft);
      setEditingId(null);
    } else {
      addCustomItem(activeCat, draft);
      setAddingNew(false);
    }
    setDraft({});
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setDraft({ ...item });
    setAddingNew(false);
  };

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
            <button
              key={opt}
              type="button"
              onClick={() => { const next = new Set(set); if (on) next.delete(opt); else next.add(opt); setDraft(d => ({ ...d, [field]: Array.from(next) })); }}
              style={{
                padding:'2px 8px', borderRadius:10, fontSize:FS.xxs, fontWeight:700,
                cursor:'pointer', border:`1px solid ${on?accent:BOR}`,
                background:on?`${accent}14`:'transparent',
                color:on?accent:SEC, fontFamily:sans, letterSpacing:'0.03em',
              }}
            >{opt}</button>
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
      case 'essential':
      case 'magical':
      case 'criminal': {
        const on = draft[field] === true;
        const accent = field === 'essential' ? '#1a4a20' : field === 'magical' ? swatch.magic : '#8b1a1a';
        const lbl = field === 'essential' ? 'Essential' : field === 'magical' ? 'Magical' : 'Criminal';
        return (
          <button
            type="button"
            onClick={() => setDraft(d => ({ ...d, [field]: !on }))}
            aria-pressed={on}
            style={{
              display:'inline-flex', alignItems:'center', gap:6, padding:'4px 12px', borderRadius:14,
              fontSize:FS.xs, fontWeight:700, cursor:'pointer', fontFamily:sans,
              border:`1px solid ${on ? accent : BOR}`, background:on ? `${accent}14` : 'transparent',
              color:on ? accent : SEC,
            }}
          >
            {on ? '✓ ' : ''}{lbl}
          </button>
        );
      }
      case 'severity': return <select {...shared} value={val||'moderate'}>{SEVERITY_LEVELS.map(s=><option key={s} value={s}>{s}</option>)}</select>;
      case 'governmentType': return <select {...shared} value={val||''}><option value="">Select...</option>{GOV_TYPES.map(g=><option key={g} value={g}>{g}</option>)}</select>;
      case 'posture': return <select {...shared} value={val||''}><option value="">Select...</option>{POSTURES.map(p=><option key={p} value={p}>{p}</option>)}</select>;
      case 'stability': return <select {...shared} value={val||'stable'}>{['stable','unstable','crisis','collapsing'].map(s=><option key={s} value={s}>{s}</option>)}</select>;
      case 'fortification': return <select {...shared} value={val||'none'}>{['none','basic','moderate','heavy','legendary'].map(f=><option key={f} value={f}>{f}</option>)}</select>;
      case 'militiaLevel': return <select {...shared} value={val||'none'}>{['none','volunteer','trained','professional','elite'].map(m=><option key={m} value={m}>{m}</option>)}</select>;
      case 'factionCount': return <input {...shared} type="number" min="1" max="10" placeholder="Number of factions"/>;
      case 'tags': return <input {...shared} placeholder="Comma-separated keywords (e.g. ancient, foreign, ceremonial) — used for search" onChange={e=>setDraft(d=>({...d,tags:e.target.value}))}/>;
      case 'commodities': return <input {...shared} placeholder="Comma-separated (e.g. iron ore, coal, gemstones)" onChange={e=>setDraft(d=>({...d,commodities:e.target.value}))}/>;
      case 'affects': return renderPills('affects', STRESSOR_AFFECT_CATEGORIES, '#8b1a1a');
      case 'description': return <textarea {...shared} rows={2} placeholder="Description..." style={{...shared.style, resize:'vertical'}}/>;
      default: return <input {...shared} placeholder={field.charAt(0).toUpperCase()+field.slice(1)}/>;
    }
  };

  const renderForm = () => (
    <div style={{ padding:'10px 12px', background:swatch['#F8F4FF'], border:'1px solid #d0c0e0', borderRadius:7, marginBottom:10 }}>
      <div style={{ fontSize:FS.xs, fontWeight:700, color:swatch.magic, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>
        {editingId ? 'Edit Item' : 'New Custom ' + catDef.label.slice(0,-1)}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {catDef.fields.map(f => (
          <div key={f}>
            {/* eslint-disable-next-line jsx-a11y/label-has-for -- deprecated rule; label nests the renderField control + has matching htmlFor, but the static nesting check can't see through renderField(). label-has-associated-control passes. */}
            <label htmlFor={`ccm-field-${f}`} style={{ fontSize:FS.xxs, fontWeight:700, color:MUT, textTransform:'uppercase', letterSpacing:'0.04em' }}>
              {f.replace(/([A-Z])/g,' $1')}
              {renderField(f)}
            </label>
            {FIELD_HINTS[f] && <div style={{ fontSize:FS.micro, color:MUT, fontStyle:'italic', marginTop:2, lineHeight:1.4 }}>{FIELD_HINTS[f]}</div>}
          </div>
        ))}
      </div>

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

  return (
    <div>
      {/* Category tabs */}
      <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:12 }}>
        {CUSTOM_CATEGORIES.map(c => {
          const count = (customContent[c.key]||[]).length;
          return (
            <button key={c.key} type="button" onClick={() => { setActiveCat(c.key); resetDraft(); }}
              style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:12, fontSize:FS.xs, fontWeight:activeCat===c.key?700:500, cursor:'pointer', border:`1px solid ${activeCat===c.key?c.color:BOR}`, background:activeCat===c.key?`${c.color}14`:'transparent', color:activeCat===c.key?c.color:SEC }}>
              <c.Icon size={11}/> {c.label}
              {count > 0 && <span style={{ fontSize:FS.micro, fontWeight:700, background:`${c.color}20`, color:c.color, borderRadius:6, padding:'0 4px', marginLeft:2 }}>{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Supply Chains: discovered + verified, not hand-authored — its own manager. */}
      {activeCat === 'supplyChains' && <SupplyChainsManager />}

      {/* Add button */}
      {activeCat !== 'supplyChains' && !addingNew && !editingId && (
        <Button variant="ai" size="sm" icon={<Plus size={12}/>} onClick={() => { setAddingNew(true); setDraft({}); }} style={{ marginBottom:10 }}>
          Add Custom {catDef.label.slice(0,-1)}
        </Button>
      )}

      {/* Add/edit form */}
      {activeCat !== 'supplyChains' && (addingNew || editingId) && renderForm()}

      {/* Items list */}
      {activeCat !== 'supplyChains' && (filtered.length === 0 ? (
        <div style={{ padding:'20px 16px', textAlign:'center', fontSize:FS.sm, color:MUT }}>
          No custom {catDef.label.toLowerCase()} yet. Click "Add" to create one.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ border:`1px solid ${BOR}`, borderLeft:`3px solid #7c3aed`, borderRadius:7, padding:'8px 12px', background:'rgba(255,251,245,0.95)' }}>
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
                      fontSize:FS.micro, fontWeight:700, color:swatch.danger,
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
