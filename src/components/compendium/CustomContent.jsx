import { useState } from 'react';
import { GOLD, INK, MUTED as MUT, SECOND as SEC, BORDER as BOR, CARD, sans, serif_, FS, swatch } from '../theme.js';
import { Sparkles, Plus, Edit3, Trash2, Copy, Wand2 } from 'lucide-react';
import { CRITICALITY, ECONOMIC_WEIGHT, DEFENSE_ROLES, POWER_AUTHORITIES, FOOD_IMPACT, TRADE_CATEGORIES, DEITY_ALIGNMENT, DEITY_TEMPER, DEITY_TIER, DEITY_LAW, satisfiesOptions } from '../../domain/customContentSchema.js';
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
  alignmentAxis:  'The god’s moral cast — good, evil, or neutral. Shapes how its faithful behave and which settlements it can win.',
  temperamentAxis:'Whether the god is warlike, peacelike, or neutral. A warlike god is a banner for conquest.',
  rankAxis:       'How grand the god is — a major pillar of the pantheon, a minor god, or a fringe cult. A major god anchors religious authority more strongly.',
  lawAxis:        'Whether the god is lawful, chaotic, or neutral. A lawful god strengthens law & order; a chaotic god erodes order and makes corruption more tolerated.',
  domain:         'What the god presides over — e.g. war, the harvest, the dead (optional flavour).',
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
  if (item.alignmentAxis) chips.push({ label: `Alignment · ${keyLabel(DEITY_ALIGNMENT, item.alignmentAxis)}`, color: '#7a5a1a' });
  if (item.temperamentAxis) chips.push({ label: `Temperament · ${keyLabel(DEITY_TEMPER, item.temperamentAxis)}`, color: '#7a5a1a' });
  if (item.rankAxis) chips.push({ label: `Rank · ${keyLabel(DEITY_TIER, item.rankAxis).split(' —')[0]}`, color: '#7a5a1a' });
  if (item.lawAxis) chips.push({ label: `Law · ${keyLabel(DEITY_LAW, item.lawAxis).split(' —')[0]}`, color: '#7a5a1a' });
  if (item.domain) chips.push({ label: `Domain · ${item.domain}`, color: '#7a5a1a' });
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
        Author your own institutions, services, resources, trade goods, and stressors &mdash;
        plus a living-world pantheon of deities that steer the simulation. Export and import
        content packs; everything syncs to your account across devices.
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
  // "Start from a built-in" — when open, surface the prebuilt seeds the author
  // can clone into an editable draft. Only meaningful for buckets that have a
  // prebuilt registry catalog (institutions/resources/stressors/tradeGoods).
  const [showSeeds, setShowSeeds] = useState(false);

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

  const resetDraft = () => { setDraft({}); setAddingNew(false); setEditingId(null); setShowSeeds(false); };

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
                padding:'2px 8px', borderRadius:10, fontSize:FS.xxs, minHeight:0,
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
      // Deity axes (Feature D / R1). Default to a valid enum so a saved deity
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

  const isLivingLane = AUTHORING_LANES.find(l => l.buckets.includes(activeCat))?.key === 'living';

  return (
    <div data-testid="custom-content-manager">
      {/* Content-pack export/import (premium reuse + sharing). */}
      <ContentPackBar />

      {/* Two authoring lanes: STATIC settlement content vs the LIVING-WORLD
          content that powers the simulation. The dead buckets appear in neither. */}
      {AUTHORING_LANES.map(lane => (
        <div key={lane.key} data-testid={`authoring-lane-${lane.key}`} style={{ marginBottom: 12 }}>
          <div style={{ fontSize:FS.xs, fontWeight:800, color: lane.key === 'living' ? swatch['#7A5A1A'] : INK, textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:2 }}>
            {lane.label}
          </div>
          <div style={{ fontSize:FS.micro, color:MUT, lineHeight:1.4, marginBottom:6 }}>{lane.blurb}</div>
          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
            {lane.buckets.map(key => {
              const c = CATEGORY_BY_KEY[key];
              if (!c) return null;
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
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:10 }}>
          <Button variant="ai" size="sm" icon={<Plus size={12}/>} onClick={() => { setAddingNew(true); setDraft(freshDraft()); setShowSeeds(false); }}>
            Add Custom {catDef.label.slice(0,-1)}
          </Button>
          {SEEDABLE.has(activeCat) && (
            <Button variant="secondary" size="sm" icon={<Copy size={12}/>} onClick={() => setShowSeeds(s => !s)} aria-pressed={showSeeds}>
              Start from a built-in
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={<Wand2 size={12}/>} onClick={() => navigate('generate')} title="Run a generation that draws on your custom content.">
            Test in a generation
          </Button>
        </div>
      )}

      {/* Built-in seed picker (clone a catalog entry into an editable draft). */}
      {!addingNew && !editingId && showSeeds && seedEntries.length > 0 && (
        <div data-testid="builtin-seed-picker" style={{ border:`1px solid ${BOR}`, borderRadius:7, padding:'8px 10px', marginBottom:10, background:CARD, maxHeight:200, overflowY:'auto' }}>
          <div style={{ fontSize:FS.xxs, fontWeight:700, color:MUT, textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:6 }}>
            Clone a built-in {catDef.label.toLowerCase().replace(/s$/,'')} as a starting point
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {seedEntries.map(entry => (
              <Button key={entry.refId} variant="ghost" size="sm" onClick={() => cloneFromSeed(entry)}
                style={{ display:'flex', alignItems:'center', gap:6, justifyContent:'flex-start', textAlign:'left', border:`1px solid ${BOR}`, borderRadius:5, padding:'5px 8px', background:'transparent', color:INK }}>
                <Copy size={11} style={{ color:MUT, flexShrink:0 }}/>
                <span style={{ fontSize:FS.xs, fontWeight:600, flex:1 }}>{entry.name}</span>
                {entry.subcategory && <Tag label={entry.subcategory} color={catDef.color}/>}
              </Button>
            ))}
          </div>
        </div>
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
