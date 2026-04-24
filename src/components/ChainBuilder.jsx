/**
 * ChainBuilder.jsx — Supply chain builder & editor.
 *
 * Visual editor for creating, editing, and managing supply chain
 * definitions that drive the map overlay system. Users can:
 *   - View all built-in chains (CHAIN_DEFS) at a glance
 *   - Create custom chains with picked resources/consumers
 *   - Toggle chains on/off for the active map overlay
 *   - Save custom chains with campaigns
 *
 * Integrates with:
 *   - supplyChains.js (CHAIN_DEFS, buildChainEdges)
 *   - mapSlice (activeOverlays, toggleOverlay)
 *   - mapSaves (campaign persistence)
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Link2, Plus, Trash2, Edit3, Check, X, ChevronDown, ChevronRight,
  Eye, EyeOff, Layers, ArrowRight, Package, Factory, Palette, Save,
  RotateCcw, Copy, Zap,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { CHAIN_DEFS } from '../lib/supplyChains.js';
import {
  GOLD, GOLD_B, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER2,
  CARD, CARD_HDR, CARD_ALT, PARCH, sans, serif_, SP, R, FS,
} from './theme.js';

// ── Available resources and consumer institution types ────────────────────────
// Comprehensive lists drawn from the data layer
const ALL_RESOURCES = [
  { id: 'iron_ore',      label: 'Iron Ore',          cat: 'mineral' },
  { id: 'copper_ore',    label: 'Copper Ore',        cat: 'mineral' },
  { id: 'tin_ore',       label: 'Tin Ore',           cat: 'mineral' },
  { id: 'gold_ore',      label: 'Gold Ore',          cat: 'mineral' },
  { id: 'silver_ore',    label: 'Silver Ore',        cat: 'mineral' },
  { id: 'coal_deposits', label: 'Coal',              cat: 'mineral' },
  { id: 'gems',          label: 'Gemstones',         cat: 'mineral' },
  { id: 'precious_metals', label: 'Precious Metals', cat: 'mineral' },
  { id: 'quarry_stone',  label: 'Quarry Stone',      cat: 'mineral' },
  { id: 'marble',        label: 'Marble',            cat: 'mineral' },
  { id: 'granite',       label: 'Granite',           cat: 'mineral' },
  { id: 'glass_sand',    label: 'Glass Sand',        cat: 'mineral' },
  { id: 'salt_flats',    label: 'Salt',              cat: 'mineral' },
  { id: 'grain',         label: 'Grain',             cat: 'agri' },
  { id: 'wheat',         label: 'Wheat',             cat: 'agri' },
  { id: 'barley',        label: 'Barley',            cat: 'agri' },
  { id: 'livestock',     label: 'Livestock',         cat: 'agri' },
  { id: 'grazing_land',  label: 'Grazing Land',      cat: 'agri' },
  { id: 'grain_fields',  label: 'Grain Fields',      cat: 'agri' },
  { id: 'grapes',        label: 'Grapes',            cat: 'agri' },
  { id: 'flax',          label: 'Flax',              cat: 'agri' },
  { id: 'herbs',         label: 'Herbs',             cat: 'agri' },
  { id: 'rare_herbs',    label: 'Rare Herbs',        cat: 'agri' },
  { id: 'date_palms',    label: 'Date Palms',        cat: 'agri' },
  { id: 'timber',        label: 'Timber',            cat: 'forest' },
  { id: 'hardwood',      label: 'Hardwood',          cat: 'forest' },
  { id: 'softwood',      label: 'Softwood',          cat: 'forest' },
  { id: 'managed_forest', label: 'Managed Forest',   cat: 'forest' },
  { id: 'mountain_timber', label: 'Mountain Timber', cat: 'forest' },
  { id: 'wool',          label: 'Wool',              cat: 'textile' },
  { id: 'silk',          label: 'Silk',              cat: 'textile' },
  { id: 'hides',         label: 'Hides',             cat: 'textile' },
  { id: 'fishing_grounds', label: 'Fishing Grounds', cat: 'water' },
  { id: 'river_fish',    label: 'River Fish',        cat: 'water' },
  { id: 'deep_harbour',  label: 'Deep Harbour',      cat: 'water' },
  { id: 'spices',        label: 'Spices',            cat: 'exotic' },
  { id: 'camel_herds',   label: 'Camel Herds',       cat: 'exotic' },
  { id: 'oasis_water',   label: 'Oasis Water',       cat: 'exotic' },
];

const ALL_CONSUMERS = [
  { id: 'smithy',        label: 'Smithy',          cat: 'craft' },
  { id: 'armorer',       label: 'Armorer',         cat: 'craft' },
  { id: 'weaponsmith',   label: 'Weaponsmith',     cat: 'craft' },
  { id: 'carpenter',     label: 'Carpenter',       cat: 'craft' },
  { id: 'mason',         label: 'Mason',           cat: 'craft' },
  { id: 'sculptor',      label: 'Sculptor',        cat: 'craft' },
  { id: 'tailor',        label: 'Tailor',          cat: 'craft' },
  { id: 'tanner',        label: 'Tanner',          cat: 'craft' },
  { id: 'weaver',        label: 'Weaver',          cat: 'craft' },
  { id: 'jeweler',       label: 'Jeweler',         cat: 'luxury' },
  { id: 'goldsmith',     label: 'Goldsmith',       cat: 'luxury' },
  { id: 'perfumer',      label: 'Perfumer',        cat: 'luxury' },
  { id: 'bakery',        label: 'Bakery',          cat: 'food' },
  { id: 'brewery',       label: 'Brewery',         cat: 'food' },
  { id: 'tavern',        label: 'Tavern',          cat: 'food' },
  { id: 'market',        label: 'Market',          cat: 'trade' },
  { id: 'shipwright',    label: 'Shipwright',      cat: 'industry' },
  { id: 'siege_works',   label: 'Siege Works',     cat: 'industry' },
  { id: 'cathedral',     label: 'Cathedral',       cat: 'civic' },
  { id: 'apothecary',    label: 'Apothecary',      cat: 'services' },
];

const RESOURCE_CATEGORIES = {
  mineral: 'Mineral',
  agri: 'Agriculture',
  forest: 'Forestry',
  textile: 'Textiles',
  water: 'Aquatic',
  exotic: 'Exotic',
};

const CONSUMER_CATEGORIES = {
  craft: 'Crafts',
  luxury: 'Luxury',
  food: 'Food & Drink',
  trade: 'Trade',
  industry: 'Industry',
  civic: 'Civic',
  services: 'Services',
};

const PRESET_COLORS = [
  '#6b7a8a', '#8a7a2a', '#4a7a3a', '#7a3a5a', '#8a8a7a', '#a0762a',
  '#3a6a8a', '#8a3a3a', '#5a3a8a', '#2a8a6a', '#8a5a2a', '#4a4a8a',
];

// ── Shared UI pieces ─────────────────────────────────────────────────────────

function Section({ title, icon: Icon, children, actions, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      border: `1px solid ${BORDER}`, borderRadius: R.xl, overflow: 'hidden',
      background: CARD,
    }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: SP.sm,
          padding: `${SP.md}px ${SP.lg}px`,
          background: CARD_HDR, borderBottom: open ? `1px solid ${BORDER2}` : 'none',
          cursor: 'pointer', userSelect: 'none',
        }}
      >
        {open ? <ChevronDown size={14} color={MUTED} /> : <ChevronRight size={14} color={MUTED} />}
        {Icon && <Icon size={16} color={GOLD} />}
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, flex: 1 }}>
          {title}
        </span>
        {actions}
      </div>
      {open && (
        <div style={{ padding: `${SP.lg}px` }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Chip({ label, color, active, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: `${SP.xs}px ${SP.sm + 2}px`,
        background: active ? (color || GOLD) + '22' : 'transparent',
        border: `1px solid ${active ? (color || GOLD) : BORDER2}`,
        borderRadius: R.lg, cursor: 'pointer',
        fontSize: FS.xxs, fontWeight: active ? 700 : 500,
        fontFamily: sans, color: active ? (color || GOLD) : SECOND,
        transition: 'all 0.15s',
        lineHeight: 1.2,
      }}
    >
      {Icon && <Icon size={10} />}
      {label}
    </button>
  );
}

function ColorDot({ color, size = 10 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      borderRadius: '50%', background: color,
      border: '1px solid rgba(0,0,0,0.15)',
      flexShrink: 0,
    }} />
  );
}

// ── Chain card (built-in or custom) ──────────────────────────────────────────

function ChainCard({ chain, isActive, isCustom, onToggle, onEdit, onDelete, onDuplicate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      border: `1px solid ${isActive ? chain.color + '66' : BORDER2}`,
      borderRadius: R.lg, overflow: 'hidden',
      background: isActive ? chain.color + '08' : CARD_ALT,
      transition: 'all 0.2s',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.md}px ${SP.lg - 2}px`,
      }}>
        <ColorDot color={chain.color} size={12} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: FS.md, fontWeight: 700, color: INK, fontFamily: serif_,
            display: 'flex', alignItems: 'center', gap: SP.sm,
          }}>
            {chain.name}
            {isCustom && (
              <span style={{
                fontSize: FS.xxs, color: '#7c3aed', background: 'rgba(124,58,237,0.08)',
                padding: '1px 6px', borderRadius: R.sm, fontWeight: 600, fontFamily: sans,
              }}>Custom</span>
            )}
          </div>
          <div style={{ fontSize: FS.xxs, color: MUTED, marginTop: 1 }}>
            {chain.description}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
          <button
            onClick={onToggle}
            title={isActive ? 'Hide overlay' : 'Show overlay'}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: `${SP.xs + 1}px ${SP.sm + 2}px`,
              background: isActive ? chain.color : 'transparent',
              color: isActive ? '#fff' : MUTED,
              border: `1px solid ${isActive ? chain.color : BORDER2}`,
              borderRadius: R.sm, cursor: 'pointer',
              fontSize: FS.xxs, fontWeight: 700, fontFamily: sans,
            }}
          >
            {isActive ? <Eye size={11} /> : <EyeOff size={11} />}
            {isActive ? 'On' : 'Off'}
          </button>

          <button onClick={() => setExpanded(e => !e)}
            style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', padding: 2 }}>
            {expanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </button>

          {isCustom && (
            <>
              <button onClick={onEdit}
                style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', padding: 2 }}>
                <Edit3 size={12} />
              </button>
              <button onClick={onDelete}
                style={{ background: 'none', border: 'none', color: '#8b1a1a', cursor: 'pointer', padding: 2 }}>
                <Trash2 size={12} />
              </button>
            </>
          )}
          {!isCustom && (
            <button onClick={onDuplicate} title="Duplicate as custom"
              style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', padding: 2 }}>
              <Copy size={12} />
            </button>
          )}
        </div>
      </div>

      {expanded && (
        <div style={{
          padding: `${SP.sm}px ${SP.lg}px ${SP.md}px`,
          borderTop: `1px solid ${BORDER2}`,
          display: 'flex', gap: SP.xl, flexWrap: 'wrap',
        }}>
          <div style={{ flex: '1 1 180px' }}>
            <div style={{
              fontSize: FS.xxs, fontWeight: 700, color: SECOND,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Package size={10} /> Resources
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {chain.resources.map(r => (
                <span key={r} style={{
                  padding: '2px 8px', background: chain.color + '15',
                  borderRadius: R.sm, fontSize: FS.xxs, color: SECOND,
                  border: `1px solid ${chain.color}33`,
                }}>
                  {r.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', color: MUTED, alignSelf: 'center',
          }}>
            <ArrowRight size={16} />
          </div>
          <div style={{ flex: '1 1 180px' }}>
            <div style={{
              fontSize: FS.xxs, fontWeight: 700, color: SECOND,
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.xs,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Factory size={10} /> Consumers
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {chain.consumers.map(c => (
                <span key={c} style={{
                  padding: '2px 8px', background: chain.color + '15',
                  borderRadius: R.sm, fontSize: FS.xxs, color: SECOND,
                  border: `1px solid ${chain.color}33`,
                }}>
                  {c.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Chain editor (for creating / editing custom chains) ──────────────────────

function ChainEditor({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [color, setColor] = useState(initial?.color || PRESET_COLORS[6]);
  const [resources, setResources] = useState(new Set(initial?.resources || []));
  const [consumers, setConsumers] = useState(new Set(initial?.consumers || []));
  const [resCatFilter, setResCatFilter] = useState(null);
  const [consCatFilter, setConsCatFilter] = useState(null);

  const toggleResource = (id) => {
    setResources(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleConsumer = (id) => {
    setConsumers(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredResources = resCatFilter
    ? ALL_RESOURCES.filter(r => r.cat === resCatFilter)
    : ALL_RESOURCES;

  const filteredConsumers = consCatFilter
    ? ALL_CONSUMERS.filter(c => c.cat === consCatFilter)
    : ALL_CONSUMERS;

  const valid = name.trim() && resources.size > 0 && consumers.size > 0;

  const handleSave = () => {
    if (!valid) return;
    onSave({
      id: initial?.id || `custom_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `Custom chain: ${name.trim()}`,
      color,
      resources: [...resources],
      consumers: [...consumers],
      isCustom: true,
    });
  };

  return (
    <div style={{
      border: `2px solid ${GOLD}`, borderRadius: R.xl,
      background: CARD, overflow: 'hidden',
    }}>
      <div style={{
        padding: `${SP.md}px ${SP.lg}px`,
        background: GOLD_BG, borderBottom: `1px solid ${GOLD}44`,
        display: 'flex', alignItems: 'center', gap: SP.sm,
      }}>
        <Layers size={16} color={GOLD} />
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK }}>
          {initial ? 'Edit Chain' : 'New Custom Chain'}
        </span>
      </div>

      <div style={{ padding: SP.lg, display: 'flex', flexDirection: 'column', gap: SP.lg }}>
        {/* Name & description */}
        <div style={{ display: 'flex', gap: SP.md, flexWrap: 'wrap' }}>
          <div style={{ flex: '2 1 200px' }}>
            <label style={{ fontSize: FS.xxs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Chain Name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Arcane Materials"
              style={{
                width: '100%', marginTop: SP.xs,
                padding: `${SP.sm}px ${SP.md}px`,
                border: `1px solid ${BORDER}`, borderRadius: R.md,
                fontSize: FS.sm, fontFamily: sans, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ flex: '3 1 240px' }}>
            <label style={{ fontSize: FS.xxs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Description
            </label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of this supply chain..."
              style={{
                width: '100%', marginTop: SP.xs,
                padding: `${SP.sm}px ${SP.md}px`,
                border: `1px solid ${BORDER}`, borderRadius: R.md,
                fontSize: FS.sm, fontFamily: sans, outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label style={{ fontSize: FS.xxs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Palette size={10} /> Overlay Color
          </label>
          <div style={{ display: 'flex', gap: SP.sm, marginTop: SP.sm, flexWrap: 'wrap', alignItems: 'center' }}>
            {PRESET_COLORS.map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: c, border: color === c ? '3px solid ' + INK : '2px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer', padding: 0,
                  boxShadow: color === c ? '0 0 0 2px #fff, 0 0 0 4px ' + c : 'none',
                }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              style={{ width: 28, height: 28, border: 'none', cursor: 'pointer', padding: 0, borderRadius: R.sm }}
              title="Custom color"
            />
          </div>
        </div>

        {/* Resources picker */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.sm }}>
            <label style={{ fontSize: FS.xxs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Package size={10} /> Resources ({resources.size} selected)
            </label>
            <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
              <Chip label="All" active={!resCatFilter} onClick={() => setResCatFilter(null)} />
              {Object.entries(RESOURCE_CATEGORIES).map(([key, label]) => (
                <Chip key={key} label={label} active={resCatFilter === key} onClick={() => setResCatFilter(key)} />
              ))}
            </div>
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 4,
            maxHeight: 140, overflowY: 'auto',
            padding: SP.sm, background: PARCH, borderRadius: R.md,
            border: `1px solid ${BORDER2}`,
          }}>
            {filteredResources.map(r => (
              <Chip
                key={r.id}
                label={r.label}
                color={color}
                active={resources.has(r.id)}
                onClick={() => toggleResource(r.id)}
              />
            ))}
          </div>
        </div>

        {/* Consumers picker */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.sm }}>
            <label style={{ fontSize: FS.xxs, fontWeight: 700, color: SECOND, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Factory size={10} /> Consumers ({consumers.size} selected)
            </label>
            <div style={{ display: 'flex', gap: 3, marginLeft: 'auto' }}>
              <Chip label="All" active={!consCatFilter} onClick={() => setConsCatFilter(null)} />
              {Object.entries(CONSUMER_CATEGORIES).map(([key, label]) => (
                <Chip key={key} label={label} active={consCatFilter === key} onClick={() => setConsCatFilter(key)} />
              ))}
            </div>
          </div>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 4,
            maxHeight: 140, overflowY: 'auto',
            padding: SP.sm, background: PARCH, borderRadius: R.md,
            border: `1px solid ${BORDER2}`,
          }}>
            {filteredConsumers.map(c => (
              <Chip
                key={c.id}
                label={c.label}
                color={color}
                active={consumers.has(c.id)}
                onClick={() => toggleConsumer(c.id)}
              />
            ))}
          </div>
        </div>

        {/* Preview arrow */}
        {resources.size > 0 && consumers.size > 0 && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: SP.md,
            padding: `${SP.sm}px ${SP.md}px`,
            background: color + '0a', borderRadius: R.md,
            border: `1px dashed ${color}44`,
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, flex: 1 }}>
              {[...resources].slice(0, 4).map(r => (
                <span key={r} style={{ fontSize: FS.xxs, color: SECOND }}>
                  {r.replace(/_/g, ' ')}
                </span>
              ))}
              {resources.size > 4 && <span style={{ fontSize: FS.xxs, color: MUTED }}>+{resources.size - 4}</span>}
            </div>
            <ArrowRight size={16} color={color} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, flex: 1 }}>
              {[...consumers].slice(0, 4).map(c => (
                <span key={c} style={{ fontSize: FS.xxs, color: SECOND }}>
                  {c.replace(/_/g, ' ')}
                </span>
              ))}
              {consumers.size > 4 && <span style={{ fontSize: FS.xxs, color: MUTED }}>+{consumers.size - 4}</span>}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: SP.sm, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: `${SP.sm}px ${SP.lg}px`,
            background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
            cursor: 'pointer', fontSize: FS.sm, color: SECOND, fontFamily: sans,
          }}>
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!valid}
            style={{
              display: 'flex', alignItems: 'center', gap: SP.xs,
              padding: `${SP.sm}px ${SP.xl}px`,
              background: valid ? GOLD : '#ccc',
              color: '#fff', border: 'none', borderRadius: R.md,
              cursor: valid ? 'pointer' : 'not-allowed',
              fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
            }}
          >
            <Save size={13} /> {initial ? 'Update Chain' : 'Create Chain'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function ChainBuilder() {
  const activeOverlays = useStore(s => s.activeOverlays);
  const toggleOverlay  = useStore(s => s.toggleOverlay);
  const canUseMapChains = useStore(s => s.canUseMapChains?.() ?? true);

  // Custom chains stored in component state (persisted via campaigns)
  const [customChains, setCustomChains] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sf_custom_chains') || '[]');
    } catch { return []; }
  });
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingChain, setEditingChain] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Persist custom chains
  const persistCustom = useCallback((chains) => {
    setCustomChains(chains);
    localStorage.setItem('sf_custom_chains', JSON.stringify(chains));
  }, []);

  // All chains combined
  const allChains = useMemo(() => [
    ...CHAIN_DEFS.map(c => ({ ...c, isCustom: false })),
    ...customChains.map(c => ({ ...c, isCustom: true })),
  ], [customChains]);

  const handleCreateOrUpdate = (chain) => {
    if (editingChain) {
      // Update existing
      persistCustom(customChains.map(c => c.id === chain.id ? chain : c));
    } else {
      // Create new
      persistCustom([...customChains, chain]);
    }
    setEditorOpen(false);
    setEditingChain(null);
  };

  const handleEdit = (chain) => {
    setEditingChain(chain);
    setEditorOpen(true);
  };

  const handleDelete = (id) => {
    persistCustom(customChains.filter(c => c.id !== id));
    setDeleteConfirm(null);
  };

  const handleDuplicate = (chain) => {
    const copy = {
      ...chain,
      id: `custom_${Date.now()}`,
      name: `${chain.name} (Copy)`,
      isCustom: true,
    };
    persistCustom([...customChains, copy]);
  };

  const activeCount = activeOverlays.length;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: SP.lg,
      maxWidth: 720, margin: '0 auto', padding: `${SP.lg}px 0`,
    }}>
      {/* Header info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.md,
        padding: `${SP.md}px ${SP.lg}px`,
        background: GOLD_BG, borderRadius: R.xl,
        border: `1px solid ${GOLD}33`,
      }}>
        <Layers size={20} color={GOLD} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: FS.md, fontWeight: 700, color: INK, fontFamily: serif_ }}>
            Supply Chain Builder
          </div>
          <div style={{ fontSize: FS.xxs, color: MUTED }}>
            Define resource→consumer chains for map overlays. Toggle chains on to visualize trade routes between linked settlements.
          </div>
        </div>
        <div style={{
          padding: `${SP.xs}px ${SP.md}px`, background: activeCount > 0 ? '#2a7a2a15' : CARD_HDR,
          borderRadius: R.lg, textAlign: 'center',
          border: `1px solid ${activeCount > 0 ? '#4a8a60' : BORDER2}`,
        }}>
          <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active</div>
          <div style={{ fontSize: FS.lg, fontWeight: 700, color: activeCount > 0 ? '#2a7a2a' : MUTED }}>
            {activeCount}
          </div>
        </div>
      </div>

      {/* Permission gate */}
      {!canUseMapChains && (
        <div style={{
          padding: `${SP.md}px ${SP.lg}px`,
          background: '#fef9ee', border: `1px solid ${GOLD}`,
          borderRadius: R.md, fontSize: FS.sm, color: SECOND,
          display: 'flex', alignItems: 'center', gap: SP.sm,
        }}>
          <Zap size={14} color={GOLD} />
          Supply chain overlays require a premium subscription. You can still build and preview chains.
        </div>
      )}

      {/* Built-in chains */}
      <Section title="Built-in Chains" icon={Link2} defaultOpen>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
          {CHAIN_DEFS.map(chain => (
            <ChainCard
              key={chain.id}
              chain={chain}
              isActive={activeOverlays.includes(chain.id)}
              isCustom={false}
              onToggle={() => toggleOverlay(chain.id)}
              onDuplicate={() => handleDuplicate(chain)}
            />
          ))}
        </div>
      </Section>

      {/* Custom chains */}
      <Section
        title={`Custom Chains (${customChains.length})`}
        icon={Layers}
        defaultOpen
        actions={
          <button
            onClick={(e) => { e.stopPropagation(); setEditingChain(null); setEditorOpen(true); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: `${SP.xs}px ${SP.sm + 2}px`,
              background: GOLD, color: '#fff', border: 'none',
              borderRadius: R.sm, cursor: 'pointer',
              fontSize: FS.xxs, fontWeight: 700, fontFamily: sans,
            }}
          >
            <Plus size={11} /> New Chain
          </button>
        }
      >
        {customChains.length === 0 && !editorOpen ? (
          <div style={{ textAlign: 'center', padding: SP.xl, color: MUTED, fontSize: FS.sm }}>
            No custom chains yet. Create one to define your own resource→consumer trade routes.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.sm }}>
            {customChains.map(chain => (
              <React.Fragment key={chain.id}>
                <ChainCard
                  chain={chain}
                  isActive={activeOverlays.includes(chain.id)}
                  isCustom
                  onToggle={() => toggleOverlay(chain.id)}
                  onEdit={() => handleEdit(chain)}
                  onDelete={() => setDeleteConfirm(chain.id)}
                />
                {deleteConfirm === chain.id && (
                  <div style={{
                    padding: `${SP.sm}px ${SP.md}px`,
                    background: '#fdf4f4', borderRadius: R.md,
                    display: 'flex', alignItems: 'center', gap: SP.sm,
                  }}>
                    <span style={{ flex: 1, fontSize: FS.sm, color: '#8b1a1a' }}>
                      Delete "{chain.name}"?
                    </span>
                    <button onClick={() => handleDelete(chain.id)} style={{
                      padding: `${SP.xs}px ${SP.md}px`, background: '#8b1a1a',
                      color: '#fff', border: 'none', borderRadius: R.sm,
                      cursor: 'pointer', fontSize: FS.xxs, fontWeight: 700,
                    }}>Yes</button>
                    <button onClick={() => setDeleteConfirm(null)} style={{
                      padding: `${SP.xs}px ${SP.md}px`, background: CARD,
                      color: SECOND, border: `1px solid ${BORDER}`, borderRadius: R.sm,
                      cursor: 'pointer', fontSize: FS.xxs,
                    }}>Cancel</button>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Inline editor */}
        {editorOpen && (
          <div style={{ marginTop: SP.md }}>
            <ChainEditor
              initial={editingChain}
              onSave={handleCreateOrUpdate}
              onCancel={() => { setEditorOpen(false); setEditingChain(null); }}
            />
          </div>
        )}
      </Section>

      {/* Quick toggle bar */}
      <div style={{
        padding: `${SP.md}px ${SP.lg}px`,
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.xl,
      }}>
        <div style={{
          fontSize: FS.xxs, fontWeight: 700, color: SECOND,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.sm,
        }}>
          Quick Toggle — All Chains
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.xs }}>
          {allChains.map(chain => (
            <button
              key={chain.id}
              onClick={() => toggleOverlay(chain.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: `${SP.xs + 1}px ${SP.sm + 4}px`,
                background: activeOverlays.includes(chain.id) ? chain.color : 'transparent',
                color: activeOverlays.includes(chain.id) ? '#fff' : SECOND,
                border: `1px solid ${activeOverlays.includes(chain.id) ? chain.color : BORDER2}`,
                borderRadius: R.lg, cursor: 'pointer',
                fontSize: FS.xxs, fontWeight: 600, fontFamily: sans,
                transition: 'all 0.15s',
              }}
            >
              <ColorDot color={chain.color} size={8} />
              {chain.name}
            </button>
          ))}
          {allChains.some(c => activeOverlays.includes(c.id)) && (
            <button
              onClick={() => useStore.getState().clearOverlays()}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: `${SP.xs + 1}px ${SP.sm + 4}px`,
                background: 'transparent', color: '#8b1a1a',
                border: `1px solid #8b1a1a44`, borderRadius: R.lg,
                cursor: 'pointer', fontSize: FS.xxs, fontWeight: 600, fontFamily: sans,
              }}
            >
              <RotateCcw size={10} /> Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
