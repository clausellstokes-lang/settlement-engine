/**
 * Workshop.jsx — Additive advanced generation sandbox.
 *
 * Power-user config tool that exposes ALL settlement generator
 * parameters simultaneously in a single-page dashboard (unlike the
 * step-by-step wizard). Users can fine-tune:
 *
 *   - Settlement tier & population
 *   - Culture, terrain, trade route
 *   - Magic toggle & monster threat
 *   - All five priority sliders (economy, military, magic, religion, criminal)
 *   - Resource selection with depletion states
 *   - Stress scenario selection
 *   - Institution category toggles
 *   - Custom name override
 *   - Seed control for reproducibility
 *
 * Reads from / writes to the Zustand config slice, then dispatches
 * generation via the settlement slice.
 */
import React, { useState, useMemo, useCallback } from 'react';
import {
  Sliders, Play, RotateCcw, Save, Bookmark, ChevronDown, ChevronRight,
  Shield, Coins, Sparkles, Flame, Skull, Swords, Crown, Globe, Mountain,
  Trees, Waves, Compass, Users, Tent, Building2, Castle, Landmark,
  AlertTriangle, Lock, Unlock, Dice5, Hash, Wand2,
} from 'lucide-react';
import { useStore } from '../store/index.js';
import { DEFAULT_CONFIG } from '../store/configSlice.js';
import {
  GOLD, GOLD_B, GOLD_BG, INK, INK_DEEP, MUTED, SECOND, BORDER, BORDER2,
  CARD, CARD_HDR, CARD_ALT, PARCH, sans, serif_, SP, R, FS,
} from './theme.js';

// ── Static data ──────────────────────────────────────────────────────────────

const TIERS = [
  { id: 'thorp',      label: 'Thorp',      pop: '8–60',       Icon: Tent },
  { id: 'hamlet',     label: 'Hamlet',     pop: '61–240',     Icon: Tent },
  { id: 'village',    label: 'Village',    pop: '401–900',    Icon: Building2 },
  { id: 'town',       label: 'Town',       pop: '901–5,000',  Icon: Building2 },
  { id: 'city',       label: 'City',       pop: '5,001–25k',  Icon: Castle },
  { id: 'metropolis', label: 'Metropolis', pop: '25,001–100k', Icon: Landmark },
];

const CULTURES = [
  { id: 'random_culture', label: 'Random' },
  { id: 'germanic',       label: 'Germanic' },
  { id: 'latin',          label: 'Latin' },
  { id: 'celtic',         label: 'Celtic' },
  { id: 'arabic',         label: 'Arabic' },
  { id: 'norse',          label: 'Norse' },
  { id: 'slavic',         label: 'Slavic' },
  { id: 'east_asian',     label: 'East Asian' },
  { id: 'mesoamerican',   label: 'Mesoamerican' },
  { id: 'south_asian',    label: 'South Asian' },
  { id: 'steppe',         label: 'Steppe' },
  { id: 'greek',          label: 'Greek' },
];

const TRADE_ROUTES = [
  { id: 'random_trade', label: 'Random' },
  { id: 'crossroads',   label: 'Crossroads' },
  { id: 'road',         label: 'Road' },
  { id: 'river',        label: 'River' },
  { id: 'port',         label: 'Port' },
  { id: 'isolated',     label: 'Isolated' },
];

const THREATS = [
  { id: 'random_threat', label: 'Random' },
  { id: 'none',          label: 'None' },
  { id: 'low',           label: 'Low' },
  { id: 'moderate',      label: 'Moderate' },
  { id: 'high',          label: 'High' },
  { id: 'extreme',       label: 'Extreme' },
];

const PRIORITY_SLIDERS = [
  { key: 'priorityEconomy',  label: 'Economy',  Icon: Coins,    color: '#8a7a2a' },
  { key: 'priorityMilitary', label: 'Military', Icon: Swords,   color: '#6b2a2a' },
  { key: 'priorityMagic',    label: 'Arcane',   Icon: Sparkles, color: '#5a3a8a' },
  { key: 'priorityReligion', label: 'Religion', Icon: Crown,    color: '#2a6a8a' },
  { key: 'priorityCriminal', label: 'Criminal', Icon: Skull,    color: '#4a4a4a' },
];

const RESOURCES = [
  { id: 'fishing_grounds',     label: 'Fishing Grounds',   cat: 'water' },
  { id: 'salt_flats',          label: 'Salt Flats',        cat: 'mineral' },
  { id: 'deep_harbour',        label: 'Deep Harbour',      cat: 'water' },
  { id: 'shipbuilding_timber', label: 'Shipbuilding Timber', cat: 'forest' },
  { id: 'river_mills',         label: 'River Mills',       cat: 'water' },
  { id: 'river_clay',          label: 'River Clay',        cat: 'water' },
  { id: 'fertile_floodplain',  label: 'Fertile Floodplain', cat: 'agri' },
  { id: 'river_fish',          label: 'River Fish',        cat: 'water' },
  { id: 'hunting_grounds',     label: 'Hunting Grounds',   cat: 'agri' },
  { id: 'managed_forest',      label: 'Managed Forest',    cat: 'forest' },
  { id: 'foraging_areas',      label: 'Foraging Areas',    cat: 'agri' },
  { id: 'ancient_grove',       label: 'Ancient Grove',     cat: 'forest' },
  { id: 'grain_fields',        label: 'Grain Fields',      cat: 'agri' },
  { id: 'grazing_land',        label: 'Grazing Land',      cat: 'agri' },
  { id: 'crossroads_position', label: 'Crossroads Position', cat: 'trade' },
  { id: 'iron_deposits',       label: 'Iron Deposits',     cat: 'mineral' },
  { id: 'stone_quarry',        label: 'Stone Quarry',      cat: 'mineral' },
  { id: 'precious_metals',     label: 'Precious Metals',   cat: 'mineral' },
  { id: 'gemstone_deposits',   label: 'Gemstone Deposits', cat: 'mineral' },
  { id: 'coal_deposits',       label: 'Coal Deposits',     cat: 'mineral' },
  { id: 'ancient_ruins',       label: 'Ancient Ruins',     cat: 'exotic' },
  { id: 'hot_springs',         label: 'Hot Springs',       cat: 'exotic' },
  { id: 'magical_node',        label: 'Magical Node',      cat: 'exotic' },
  { id: 'alpine_pasture',      label: 'Alpine Pasture',    cat: 'agri' },
  { id: 'herbs',               label: 'Herbs',             cat: 'agri' },
  { id: 'hides',               label: 'Hides',             cat: 'agri' },
  { id: 'wool',                label: 'Wool',              cat: 'agri' },
  { id: 'flax',                label: 'Flax',              cat: 'agri' },
  { id: 'grapes',              label: 'Grapes',            cat: 'agri' },
  { id: 'glass_sand',          label: 'Glass Sand',        cat: 'mineral' },
  { id: 'desert_salt',         label: 'Desert Salt',       cat: 'mineral' },
  { id: 'camel_herds',         label: 'Camel Herds',       cat: 'exotic' },
  { id: 'date_palms',          label: 'Date Palms',        cat: 'agri' },
  { id: 'oasis_water',         label: 'Oasis Water',       cat: 'exotic' },
  { id: 'mountain_timber',     label: 'Mountain Timber',   cat: 'forest' },
  { id: 'marshlands',          label: 'Marshlands',        cat: 'water' },
  { id: 'defended_pass',       label: 'Defended Pass',     cat: 'trade' },
];

const STRESSES = [
  { id: 'under_siege',          label: 'Under Siege',          color: '#8b1a1a' },
  { id: 'famine',               label: 'Famine',               color: '#8b5a1a' },
  { id: 'occupied',             label: 'Under Occupation',     color: '#4a3a6b' },
  { id: 'politically_fractured', label: 'Politically Fractured', color: '#5a4a1a' },
  { id: 'indebted',             label: 'Indebted',             color: '#6b3a2a' },
  { id: 'recently_betrayed',    label: 'Recently Betrayed',    color: '#4a2a2a' },
  { id: 'infiltrated',          label: 'Infiltrated',          color: '#2a3a4a' },
  { id: 'plague_onset',         label: 'Plague Onset',         color: '#3a5a2a' },
  { id: 'succession_void',      label: 'Succession Void',     color: '#5a3a5a' },
  { id: 'monster_pressure',     label: 'Monster Pressure',    color: '#6b2a3a' },
  { id: 'insurgency',           label: 'Insurgency',          color: '#3a3a3a' },
  { id: 'religious_conversion', label: 'Religious Conversion', color: '#2a5a6b' },
  { id: 'slave_revolt',         label: 'Slave Revolt',        color: '#5a2a1a' },
  { id: 'wartime',              label: 'Wartime',             color: '#6b1a1a' },
  { id: 'mass_migration',       label: 'Mass Migration',      color: '#4a5a2a' },
];

const RES_CATEGORIES = {
  mineral: 'Mineral',
  agri: 'Agriculture',
  forest: 'Forestry',
  water: 'Aquatic',
  trade: 'Trade',
  exotic: 'Exotic',
};

// ── UI helpers ───────────────────────────────────────────────────────────────

function Panel({ title, icon: Icon, children, color, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  const accent = color || GOLD;
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
        {open ? <ChevronDown size={13} color={MUTED} /> : <ChevronRight size={13} color={MUTED} />}
        {Icon && <Icon size={15} color={accent} />}
        <span style={{ fontFamily: serif_, fontSize: FS.lg, fontWeight: 600, color: INK, flex: 1 }}>
          {title}
        </span>
      </div>
      {open && <div style={{ padding: SP.lg }}>{children}</div>}
    </div>
  );
}

function SliderRow({ label, Icon, color, value, onChange, min = 0, max = 100 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.sm }}>
      {Icon && <Icon size={14} color={color || GOLD} style={{ flexShrink: 0 }} />}
      <span style={{
        fontSize: FS.sm, fontWeight: 600, color: SECOND, minWidth: 64,
        fontFamily: sans,
      }}>
        {label}
      </span>
      <input
        type="range" min={min} max={max} value={value}
        onChange={e => onChange(parseInt(e.target.value, 10))}
        style={{ flex: 1, accentColor: color || GOLD, cursor: 'pointer' }}
      />
      <span style={{
        fontSize: FS.sm, fontWeight: 700, color: color || GOLD,
        fontFamily: 'monospace', minWidth: 28, textAlign: 'right',
      }}>
        {value}
      </span>
    </div>
  );
}

function OptionGrid({ options, value, onChange, columns = 3 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: SP.xs,
    }}>
      {options.map(opt => {
        const active = value === opt.id;
        const Ic = opt.Icon;
        return (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 2, padding: `${SP.sm}px ${SP.xs}px`,
              background: active ? GOLD_BG : 'transparent',
              border: `1px solid ${active ? GOLD : BORDER2}`,
              borderRadius: R.lg, cursor: 'pointer',
              color: active ? GOLD : SECOND,
              fontSize: FS.xxs, fontWeight: active ? 700 : 500,
              fontFamily: sans, transition: 'all 0.15s',
            }}
          >
            {Ic && <Ic size={16} />}
            <span>{opt.label}</span>
            {opt.pop && <span style={{ fontSize: 9, color: MUTED }}>{opt.pop}</span>}
          </button>
        );
      })}
    </div>
  );
}

function Chip({ label, active, color, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3,
        padding: `${SP.xs}px ${SP.sm + 2}px`,
        background: active ? (color || GOLD) + '22' : 'transparent',
        border: `1px solid ${active ? (color || GOLD) : BORDER2}`,
        borderRadius: R.lg, cursor: 'pointer',
        fontSize: FS.xxs, fontWeight: active ? 700 : 500,
        fontFamily: sans, color: active ? (color || GOLD) : SECOND,
        transition: 'all 0.15s', lineHeight: 1.2,
      }}
    >
      {label}
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function Workshop({ isMobile }) {
  const config       = useStore(s => s.config);
  const updateConfig = useStore(s => s.updateConfig);
  const resetConfig  = useStore(s => s.resetConfig);
  const settlement   = useStore(s => s.settlement);

  const generateSettlement = useStore(s => s.generateSettlement);
  const isGenerating = useStore(s => s.isGenerating);

  // Local workshop-specific state
  const [seed, setSeed] = useState('');
  const [useSeed, setUseSeed] = useState(false);
  const [resCatFilter, setResCatFilter] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState(null);

  // Derived
  const selectedResources = useMemo(() => {
    if (config.nearbyResourcesRandom) return new Set();
    return new Set(config.nearbyResources || []);
  }, [config.nearbyResources, config.nearbyResourcesRandom]);

  const depleted = useMemo(() => new Set(config.nearbyResourcesDepleted || []), [config.nearbyResourcesDepleted]);
  const selectedStresses = useMemo(() => new Set(config.selectedStresses || []), [config.selectedStresses]);

  const filteredResources = resCatFilter
    ? RESOURCES.filter(r => r.cat === resCatFilter)
    : RESOURCES;

  // Handlers
  const setField = useCallback((key, value) => {
    updateConfig({ [key]: value });
  }, [updateConfig]);

  const toggleResource = useCallback((id) => {
    const current = config.nearbyResources || [];
    const next = current.includes(id)
      ? current.filter(r => r !== id)
      : [...current, id];
    updateConfig({
      nearbyResources: next,
      nearbyResourcesRandom: false,
    });
  }, [config.nearbyResources, updateConfig]);

  const toggleDepletion = useCallback((id) => {
    const current = config.nearbyResourcesDepleted || [];
    const next = current.includes(id)
      ? current.filter(r => r !== id)
      : [...current, id];
    updateConfig({ nearbyResourcesDepleted: next });
  }, [config.nearbyResourcesDepleted, updateConfig]);

  const toggleStress = useCallback((id) => {
    const current = config.selectedStresses || [];
    const next = current.includes(id)
      ? current.filter(s => s !== id)
      : [...current, id];
    updateConfig({
      selectedStresses: next,
      selectedStressesRandom: next.length === 0,
    });
  }, [config.selectedStresses, updateConfig]);

  const handleGenerate = useCallback(async () => {
    if (generating) return;
    setGenerating(true);
    setMessage(null);
    try {
      const opts = {};
      if (useSeed && seed.trim()) {
        opts.seed = seed.trim();
      }
      if (config.customName?.trim()) {
        opts.customName = config.customName.trim();
      }
      await generateSettlement(opts);
      setMessage('Settlement generated!');
      setTimeout(() => setMessage(null), 3000);
    } catch (e) {
      console.error('Workshop generation failed:', e);
      setMessage('Generation failed: ' + (e.message || 'unknown error'));
    } finally {
      setGenerating(false);
    }
  }, [generating, useSeed, seed, config.customName, generateSettlement]);

  const handleReset = useCallback(() => {
    resetConfig();
    setSeed('');
    setUseSeed(false);
    setResCatFilter(null);
    setMessage('Configuration reset to defaults.');
    setTimeout(() => setMessage(null), 2000);
  }, [resetConfig]);

  const randomSeed = () => {
    const s = Math.random().toString(36).slice(2, 10);
    setSeed(s);
    setUseSeed(true);
  };

  // Count how many params differ from default
  const diffCount = useMemo(() => {
    let count = 0;
    for (const [key, def] of Object.entries(DEFAULT_CONFIG)) {
      const cur = config[key];
      if (JSON.stringify(cur) !== JSON.stringify(def)) count++;
    }
    if (useSeed && seed) count++;
    return count;
  }, [config, useSeed, seed]);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: SP.lg,
      maxWidth: 780, margin: '0 auto', padding: `${SP.lg}px 0`,
    }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.md,
        padding: `${SP.md}px ${SP.lg}px`,
        background: 'linear-gradient(135deg, rgba(160,118,42,0.12), rgba(124,58,237,0.08))',
        borderRadius: R.xl, border: `1px solid ${GOLD}33`,
      }}>
        <Sliders size={22} color={GOLD} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: FS.xl, fontWeight: 700, color: INK, fontFamily: serif_ }}>
            Custom Generate
          </div>
          <div style={{ fontSize: FS.xxs, color: MUTED }}>
            Fine-tune every generator parameter at once. All settings visible simultaneously.
          </div>
        </div>
        {diffCount > 0 && (
          <div style={{
            padding: `${SP.xs}px ${SP.md}px`, background: '#7c3aed15',
            borderRadius: R.lg, border: '1px solid rgba(124,58,237,0.3)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: FS.xxs, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Modified</div>
            <div style={{ fontSize: FS.lg, fontWeight: 700, color: '#7c3aed' }}>{diffCount}</div>
          </div>
        )}
      </div>

      {/* Message toast */}
      {message && (
        <div style={{
          padding: `${SP.sm + 2}px ${SP.lg}px`,
          background: message.includes('failed') ? '#fdf4f4' : '#f0faf2',
          border: `1px solid ${message.includes('failed') ? '#8b1a1a' : '#4a8a60'}`,
          borderRadius: R.md, fontSize: FS.sm,
          color: message.includes('failed') ? '#8b1a1a' : '#1a5a28',
          fontWeight: 600, textAlign: 'center',
        }}>
          {message}
        </div>
      )}

      {/* ── Generate bar (sticky) ─────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 62, zIndex: 20,
        display: 'flex', alignItems: 'center', gap: SP.sm,
        padding: `${SP.md}px ${SP.lg}px`,
        background: 'rgba(28,20,9,0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: R.xl, border: '1px solid rgba(160,118,42,0.3)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
      }}>
        {/* Seed control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.xs }}>
          <button
            onClick={() => setUseSeed(u => !u)}
            title={useSeed ? 'Using fixed seed' : 'Using random seed'}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: `${SP.xs + 1}px ${SP.sm}px`,
              background: useSeed ? 'rgba(124,58,237,0.2)' : 'transparent',
              border: `1px solid ${useSeed ? '#7c3aed' : 'rgba(160,118,42,0.3)'}`,
              borderRadius: R.sm, cursor: 'pointer',
              color: useSeed ? '#c8a0f0' : MUTED,
              fontSize: FS.xxs, fontWeight: 600, fontFamily: sans,
            }}
          >
            {useSeed ? <Lock size={10} /> : <Unlock size={10} />}
            Seed
          </button>
          {useSeed && (
            <>
              <input
                type="text"
                value={seed}
                onChange={e => setSeed(e.target.value)}
                placeholder="seed..."
                style={{
                  width: 90, padding: `${SP.xs}px ${SP.sm}px`,
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(160,118,42,0.3)',
                  borderRadius: R.sm, color: '#e8d8c0',
                  fontSize: FS.xxs, fontFamily: 'monospace', outline: 'none',
                }}
              />
              <button onClick={randomSeed} title="Random seed" style={{
                background: 'none', border: 'none', color: MUTED, cursor: 'pointer', padding: 2,
              }}>
                <Dice5 size={13} />
              </button>
            </>
          )}
        </div>

        {/* Custom name */}
        <input
          type="text"
          value={config.customName || ''}
          onChange={e => setField('customName', e.target.value)}
          placeholder="Custom name (optional)"
          style={{
            flex: 1, padding: `${SP.xs + 1}px ${SP.md}px`,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(160,118,42,0.25)',
            borderRadius: R.sm, color: '#e8d8c0',
            fontSize: FS.sm, fontFamily: sans, outline: 'none',
            minWidth: 0,
          }}
        />

        <button onClick={handleReset} title="Reset all" style={{
          display: 'flex', alignItems: 'center', gap: 3,
          padding: `${SP.xs + 1}px ${SP.sm + 2}px`,
          background: 'transparent', color: '#c88a8a',
          border: '1px solid rgba(200,138,138,0.3)', borderRadius: R.sm,
          cursor: 'pointer', fontSize: FS.xxs, fontWeight: 600, fontFamily: sans,
        }}>
          <RotateCcw size={11} /> Reset
        </button>

        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            display: 'flex', alignItems: 'center', gap: SP.xs,
            padding: `${SP.sm}px ${SP.xl}px`,
            background: generating ? '#666' : 'linear-gradient(135deg, #a0762a, #c49a3c)',
            color: '#fff', border: 'none', borderRadius: R.md,
            cursor: generating ? 'wait' : 'pointer',
            fontSize: FS.sm, fontWeight: 700, fontFamily: sans,
            boxShadow: generating ? 'none' : '0 2px 8px rgba(160,118,42,0.4)',
          }}
        >
          <Play size={14} />
          {generating ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {/* ── Parameter panels ──────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: SP.lg,
      }}>
        {/* Settlement Type */}
        <Panel title="Settlement Tier" icon={Building2}>
          <OptionGrid
            options={TIERS.map(t => ({ ...t, id: t.id }))}
            value={config.settType === 'random' ? null : config.settType}
            onChange={v => setField('settType', v)}
            columns={3}
          />
          <div style={{ marginTop: SP.md }}>
            <button
              onClick={() => setField('settType', 'random')}
              style={{
                width: '100%', padding: `${SP.sm}px`,
                background: config.settType === 'random' ? GOLD_BG : 'transparent',
                border: `1px solid ${config.settType === 'random' ? GOLD : BORDER2}`,
                borderRadius: R.md, cursor: 'pointer',
                fontSize: FS.sm, fontWeight: config.settType === 'random' ? 700 : 500,
                color: config.settType === 'random' ? GOLD : SECOND,
                fontFamily: sans, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.xs,
              }}
            >
              <Dice5 size={13} /> Random Tier
            </button>
          </div>
          {config.settType === 'custom' && (
            <div style={{ marginTop: SP.md }}>
              <label style={{ fontSize: FS.xxs, fontWeight: 700, color: SECOND, textTransform: 'uppercase' }}>
                Exact Population
              </label>
              <input
                type="number" min={1} max={200000}
                value={config.population}
                onChange={e => setField('population', parseInt(e.target.value, 10) || 1)}
                style={{
                  width: '100%', marginTop: SP.xs,
                  padding: `${SP.sm}px ${SP.md}px`,
                  border: `1px solid ${BORDER}`, borderRadius: R.md,
                  fontSize: FS.sm, fontFamily: sans, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}
        </Panel>

        {/* Culture */}
        <Panel title="Culture" icon={Globe}>
          <OptionGrid
            options={CULTURES}
            value={config.culture}
            onChange={v => setField('culture', v)}
            columns={3}
          />
        </Panel>

        {/* Trade Route */}
        <Panel title="Trade Route Access" icon={Compass}>
          <OptionGrid
            options={TRADE_ROUTES}
            value={config.tradeRouteAccess}
            onChange={v => setField('tradeRouteAccess', v)}
            columns={3}
          />
        </Panel>

        {/* Monster Threat */}
        <Panel title="Monster Threat" icon={Skull}>
          <OptionGrid
            options={THREATS}
            value={config.monsterThreat}
            onChange={v => setField('monsterThreat', v)}
            columns={3}
          />
        </Panel>
      </div>

      {/* ── Priority Sliders (full width) ─────────────────────── */}
      <Panel title="Priority Weights" icon={Sliders} color={GOLD}>
        <div style={{
          fontSize: FS.xxs, color: MUTED, marginBottom: SP.md,
          lineHeight: 1.5,
        }}>
          Control the relative weight of each institutional category during generation.
          Higher values increase the likelihood and number of related institutions.
        </div>
        {PRIORITY_SLIDERS.map(({ key, label, Icon, color }) => (
          <SliderRow
            key={key}
            label={label}
            Icon={Icon}
            color={color}
            value={config[key] ?? 50}
            onChange={v => setField(key, v)}
          />
        ))}
        <div style={{
          display: 'flex', gap: SP.sm, marginTop: SP.md,
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={() => {
              PRIORITY_SLIDERS.forEach(({ key }) => setField(key, 50));
            }}
            style={{
              padding: `${SP.xs}px ${SP.md}px`,
              background: 'transparent', border: `1px solid ${BORDER}`,
              borderRadius: R.sm, cursor: 'pointer',
              fontSize: FS.xxs, color: SECOND, fontFamily: sans,
            }}
          >
            Reset to 50
          </button>
          <button
            onClick={() => {
              PRIORITY_SLIDERS.forEach(({ key }) =>
                setField(key, Math.floor(Math.random() * 100)),
              );
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: `${SP.xs}px ${SP.md}px`,
              background: GOLD_BG, border: `1px solid ${GOLD}44`,
              borderRadius: R.sm, cursor: 'pointer',
              fontSize: FS.xxs, color: GOLD, fontWeight: 600, fontFamily: sans,
            }}
          >
            <Dice5 size={10} /> Randomize
          </button>
        </div>
      </Panel>

      {/* ── Magic Toggle ──────────────────────────────────────── */}
      <Panel title="Magic System" icon={Wand2} color="#5a3a8a">
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.md }}>
          <button
            onClick={() => setField('magicExists', true)}
            style={{
              flex: 1, padding: `${SP.md}px`,
              background: config.magicExists ? 'rgba(90,58,138,0.12)' : 'transparent',
              border: `1px solid ${config.magicExists ? '#5a3a8a' : BORDER2}`,
              borderRadius: R.lg, cursor: 'pointer',
              fontSize: FS.sm, fontWeight: config.magicExists ? 700 : 500,
              color: config.magicExists ? '#5a3a8a' : SECOND,
              fontFamily: sans, textAlign: 'center',
            }}
          >
            <Sparkles size={16} style={{ display: 'block', margin: '0 auto 4px' }} />
            Magic Enabled
          </button>
          <button
            onClick={() => setField('magicExists', false)}
            style={{
              flex: 1, padding: `${SP.md}px`,
              background: !config.magicExists ? 'rgba(139,26,26,0.08)' : 'transparent',
              border: `1px solid ${!config.magicExists ? '#8b1a1a' : BORDER2}`,
              borderRadius: R.lg, cursor: 'pointer',
              fontSize: FS.sm, fontWeight: !config.magicExists ? 700 : 500,
              color: !config.magicExists ? '#8b1a1a' : SECOND,
              fontFamily: sans, textAlign: 'center',
            }}
          >
            <Shield size={16} style={{ display: 'block', margin: '0 auto 4px' }} />
            Low Magic / No Magic
          </button>
        </div>
        {!config.magicExists && (
          <div style={{
            marginTop: SP.sm, padding: `${SP.xs + 2}px ${SP.md}px`,
            background: 'rgba(139,26,26,0.05)', borderRadius: R.md,
            fontSize: FS.xxs, color: SECOND,
          }}>
            Arcane institutions will be suppressed. The Arcane priority slider above is overridden to 0.
          </div>
        )}
      </Panel>

      {/* ── Resources ─────────────────────────────────────────── */}
      <Panel title="Nearby Resources" icon={Mountain}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.md }}>
          <button
            onClick={() => updateConfig({ nearbyResourcesRandom: true, nearbyResources: null })}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: `${SP.xs + 1}px ${SP.sm + 4}px`,
              background: config.nearbyResourcesRandom ? GOLD_BG : 'transparent',
              border: `1px solid ${config.nearbyResourcesRandom ? GOLD : BORDER2}`,
              borderRadius: R.lg, cursor: 'pointer',
              fontSize: FS.xxs, fontWeight: config.nearbyResourcesRandom ? 700 : 500,
              color: config.nearbyResourcesRandom ? GOLD : SECOND,
              fontFamily: sans,
            }}
          >
            <Dice5 size={10} /> Auto (terrain-based)
          </button>
          {!config.nearbyResourcesRandom && (
            <span style={{ fontSize: FS.xxs, color: MUTED }}>
              {selectedResources.size} selected · {depleted.size} depleted
            </span>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 3 }}>
            <Chip label="All" active={!resCatFilter} onClick={() => setResCatFilter(null)} />
            {Object.entries(RES_CATEGORIES).map(([k, v]) => (
              <Chip key={k} label={v} active={resCatFilter === k} onClick={() => setResCatFilter(k)} />
            ))}
          </div>
        </div>

        {!config.nearbyResourcesRandom && (
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 4,
            maxHeight: 200, overflowY: 'auto',
            padding: SP.sm, background: PARCH, borderRadius: R.md,
            border: `1px solid ${BORDER2}`,
          }}>
            {filteredResources.map(r => {
              const selected = selectedResources.has(r.id);
              const isDepleted = depleted.has(r.id);
              return (
                <div key={r.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 0 }}>
                  <button
                    onClick={() => toggleResource(r.id)}
                    style={{
                      padding: `${SP.xs}px ${SP.sm + 2}px`,
                      background: selected ? GOLD + '22' : 'transparent',
                      border: `1px solid ${selected ? GOLD : BORDER2}`,
                      borderRadius: isDepleted ? `${R.lg}px 0 0 ${R.lg}px` : `${R.lg}px`,
                      borderRight: selected ? 'none' : undefined,
                      cursor: 'pointer',
                      fontSize: FS.xxs, fontWeight: selected ? 700 : 500,
                      fontFamily: sans, color: isDepleted ? '#8b1a1a' : (selected ? GOLD : SECOND),
                      textDecoration: isDepleted ? 'line-through' : 'none',
                      lineHeight: 1.2,
                    }}
                  >
                    {r.label}
                  </button>
                  {selected && (
                    <button
                      onClick={() => toggleDepletion(r.id)}
                      title={isDepleted ? 'Mark as active' : 'Mark as depleted'}
                      style={{
                        padding: `${SP.xs}px ${SP.xs + 2}px`,
                        background: isDepleted ? '#8b1a1a22' : 'transparent',
                        border: `1px solid ${isDepleted ? '#8b1a1a' : BORDER2}`,
                        borderRadius: `0 ${R.lg}px ${R.lg}px 0`,
                        cursor: 'pointer',
                        fontSize: 9, color: isDepleted ? '#8b1a1a' : MUTED,
                        fontFamily: sans,
                      }}
                    >
                      {isDepleted ? '✗' : '~'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {config.nearbyResourcesRandom && (
          <div style={{
            padding: `${SP.sm}px ${SP.md}px`,
            background: GOLD_BG, borderRadius: R.md,
            fontSize: FS.xxs, color: SECOND, textAlign: 'center',
          }}>
            Resources will be automatically assigned based on terrain and tier.
            Switch off "Auto" to manually select resources.
          </div>
        )}
      </Panel>

      {/* ── Stresses ──────────────────────────────────────────── */}
      <Panel title="Active Stresses" icon={AlertTriangle} color="#8b1a1a">
        <div style={{ display: 'flex', alignItems: 'center', gap: SP.sm, marginBottom: SP.md }}>
          <button
            onClick={() => updateConfig({ selectedStressesRandom: true, selectedStresses: [] })}
            style={{
              display: 'flex', alignItems: 'center', gap: 3,
              padding: `${SP.xs + 1}px ${SP.sm + 4}px`,
              background: config.selectedStressesRandom ? GOLD_BG : 'transparent',
              border: `1px solid ${config.selectedStressesRandom ? GOLD : BORDER2}`,
              borderRadius: R.lg, cursor: 'pointer',
              fontSize: FS.xxs, fontWeight: config.selectedStressesRandom ? 700 : 500,
              color: config.selectedStressesRandom ? GOLD : SECOND,
              fontFamily: sans,
            }}
          >
            <Dice5 size={10} /> Random (probability-weighted)
          </button>
          {!config.selectedStressesRandom && (
            <span style={{ fontSize: FS.xxs, color: MUTED }}>
              {selectedStresses.size} selected
            </span>
          )}
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: SP.xs,
        }}>
          {STRESSES.map(s => (
            <button
              key={s.id}
              onClick={() => toggleStress(s.id)}
              style={{
                padding: `${SP.xs + 1}px ${SP.sm + 4}px`,
                background: selectedStresses.has(s.id) ? s.color + '18' : 'transparent',
                border: `1px solid ${selectedStresses.has(s.id) ? s.color : BORDER2}`,
                borderRadius: R.lg, cursor: 'pointer',
                fontSize: FS.xxs, fontWeight: selectedStresses.has(s.id) ? 700 : 500,
                fontFamily: sans, color: selectedStresses.has(s.id) ? s.color : SECOND,
                transition: 'all 0.15s', lineHeight: 1.2,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {selectedStresses.size > 2 && (
          <div style={{
            marginTop: SP.sm, padding: `${SP.xs + 2}px ${SP.md}px`,
            background: 'rgba(139,26,26,0.05)', borderRadius: R.md,
            fontSize: FS.xxs, color: '#8b1a1a',
          }}>
            Multiple stresses create compounding narrative pressure. This can produce extreme or unstable settlements — ideal for crisis scenarios.
          </div>
        )}
      </Panel>

      {/* ── Config Summary ────────────────────────────────────── */}
      <div style={{
        padding: `${SP.md}px ${SP.lg}px`,
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.xl,
      }}>
        <div style={{
          fontSize: FS.xxs, fontWeight: 700, color: SECOND,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: SP.sm,
        }}>
          Configuration Summary
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: SP.sm,
          fontSize: FS.xxs, color: MUTED,
        }}>
          <SummaryBadge label="Tier" value={config.settType} />
          <SummaryBadge label="Culture" value={config.culture?.replace('_', ' ')} />
          <SummaryBadge label="Trade" value={config.tradeRouteAccess?.replace('_', ' ')} />
          <SummaryBadge label="Threat" value={config.monsterThreat?.replace('_', ' ')} />
          <SummaryBadge label="Magic" value={config.magicExists ? 'Yes' : 'No'} />
          <SummaryBadge label="Econ" value={config.priorityEconomy} />
          <SummaryBadge label="Mil" value={config.priorityMilitary} />
          <SummaryBadge label="Arc" value={config.magicExists ? config.priorityMagic : 0} />
          <SummaryBadge label="Rel" value={config.priorityReligion} />
          <SummaryBadge label="Crim" value={config.priorityCriminal} />
          {!config.nearbyResourcesRandom && <SummaryBadge label="Res" value={`${selectedResources.size} manual`} />}
          {selectedStresses.size > 0 && <SummaryBadge label="Stress" value={selectedStresses.size} />}
          {useSeed && seed && <SummaryBadge label="Seed" value={seed} />}
          {config.customName && <SummaryBadge label="Name" value={config.customName} />}
        </div>
      </div>

      {/* ── Custom Content Panels (Premium) ────────────────── */}
      <CustomContentPanels config={config} updateConfig={updateConfig} />

      {/* Bottom generate button (convenience) */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: SP.sm,
          padding: `${SP.lg}px`,
          background: generating ? '#666' : 'linear-gradient(135deg, #a0762a, #c49a3c)',
          color: '#fff', border: 'none', borderRadius: R.xl,
          cursor: generating ? 'wait' : 'pointer',
          fontSize: FS.lg, fontWeight: 700, fontFamily: sans,
          boxShadow: generating ? 'none' : '0 4px 16px rgba(160,118,42,0.4)',
          letterSpacing: '0.04em',
        }}
      >
        <Play size={18} />
        {generating ? 'Generating Settlement...' : 'Generate Settlement'}
      </button>
    </div>
  );
}

// ── Custom Content Panels (Phase D) ──────────────────────────────────────────
// These panels let premium users define custom institutions, resources,
// trade routes, power dynamics, and defense scenarios for generation.

const INST_CATEGORIES = ['Government', 'Religious', 'Criminal', 'Economy', 'Crafts', 'Markets', 'Defense', 'Infrastructure', 'Education', 'Entertainment'];

function CustomContentPanels({ config, updateConfig }) {
  const customInstitutions = config.customInstitutions || [];
  const customResources = config.customResources || [];
  const customTradeRoutes = config.customTradeRoutes || [];
  const powerConfig = config.powerDynamicsConfig || {};
  const defenseConfig = config.defenseScenarioConfig || {};

  const [instDraft, setInstDraft] = useState({ name: '', category: 'Economy', tags: '', desc: '' });
  const [resDraft, setResDraft] = useState({ name: '', category: 'land', commodities: '', desc: '' });
  const [routeDraft, setRouteDraft] = useState({ name: '', source: '', dest: '', goods: '', desc: '' });

  const addInstitution = () => {
    if (!instDraft.name.trim()) return;
    const entry = {
      name: instDraft.name.trim(),
      category: instDraft.category,
      tags: instDraft.tags.split(',').map(t => t.trim()).filter(Boolean),
      desc: instDraft.desc.trim(),
      source: 'custom',
    };
    updateConfig({ customInstitutions: [...customInstitutions, entry] });
    setInstDraft({ name: '', category: 'Economy', tags: '', desc: '' });
  };

  const addResource = () => {
    if (!resDraft.name.trim()) return;
    const entry = {
      id: resDraft.name.trim().toLowerCase().replace(/\s+/g, '_'),
      label: resDraft.name.trim(),
      category: resDraft.category,
      commodities: resDraft.commodities.split(',').map(c => c.trim()).filter(Boolean),
      desc: resDraft.desc.trim(),
      source: 'custom',
    };
    updateConfig({ customResources: [...customResources, entry] });
    setResDraft({ name: '', category: 'land', commodities: '', desc: '' });
  };

  const addTradeRoute = () => {
    if (!routeDraft.name.trim()) return;
    const entry = {
      name: routeDraft.name.trim(),
      source: routeDraft.source.trim(),
      destination: routeDraft.dest.trim(),
      goods: routeDraft.goods.split(',').map(g => g.trim()).filter(Boolean),
      desc: routeDraft.desc.trim(),
    };
    updateConfig({ customTradeRoutes: [...customTradeRoutes, entry] });
    setRouteDraft({ name: '', source: '', dest: '', goods: '', desc: '' });
  };

  const removeFrom = (key, idx) => {
    updateConfig({ [key]: config[key].filter((_, i) => i !== idx) });
  };

  const inputStyle = {
    flex: 1, padding: '5px 8px', fontSize: 11, borderRadius: 4,
    border: `1px solid ${BORDER}`, fontFamily: sans, color: INK,
    background: '#fff', outline: 'none',
  };
  const labelStyle = { fontSize: 10, fontWeight: 600, color: SECOND, minWidth: 55 };
  const rowStyle = { display: 'flex', alignItems: 'center', gap: 6 };
  const addBtnStyle = {
    padding: '5px 14px', background: GOLD, color: '#fff', border: 'none',
    borderRadius: 4, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: sans,
  };
  const pillStyle = (color = '#2a5a7a') => ({
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '3px 8px', borderRadius: 10,
    background: `${color}14`, border: `1px solid ${color}40`,
    fontSize: 10, fontWeight: 600, color, whiteSpace: 'nowrap',
  });

  return (
    <>
      {/* ── Custom Institutions ──────────────────────────────── */}
      <Panel title="Custom Institutions" icon={Building2} color="#2a5a7a" defaultOpen={false}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, lineHeight: 1.5 }}>
          Define new institution types that will be included in generation.
        </div>
        {customInstitutions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {customInstitutions.map((inst, i) => (
              <span key={i} style={pillStyle('#2a5a7a')}>
                {inst.name} ({inst.category})
                <button onClick={() => removeFrom('customInstitutions', i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a5a7a', padding: 0, fontSize: 12, lineHeight: 1 }}>&times;</button>
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={rowStyle}>
            <span style={labelStyle}>Name</span>
            <input value={instDraft.name} onChange={e => setInstDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="Institution name" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Category</span>
            <select value={instDraft.category} onChange={e => setInstDraft(d => ({ ...d, category: e.target.value }))}
              style={{ ...inputStyle, flex: 'none', width: 130 }}>
              {INST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Tags</span>
            <input value={instDraft.tags} onChange={e => setInstDraft(d => ({ ...d, tags: e.target.value }))}
              placeholder="trade, guild, military (comma-separated)" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Desc</span>
            <input value={instDraft.desc} onChange={e => setInstDraft(d => ({ ...d, desc: e.target.value }))}
              placeholder="Brief description" style={inputStyle} />
          </div>
          <button onClick={addInstitution} disabled={!instDraft.name.trim()} style={addBtnStyle}>
            Add Institution
          </button>
        </div>
      </Panel>

      {/* ── Custom Resources ─────────────────────────────────── */}
      <Panel title="Custom Resources" icon={Mountain} color="#2a7a2a" defaultOpen={false}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, lineHeight: 1.5 }}>
          Define new resource types for terrain and economy generation.
        </div>
        {customResources.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {customResources.map((res, i) => (
              <span key={i} style={pillStyle('#2a7a2a')}>
                {res.label}
                <button onClick={() => removeFrom('customResources', i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a7a2a', padding: 0, fontSize: 12, lineHeight: 1 }}>&times;</button>
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={rowStyle}>
            <span style={labelStyle}>Name</span>
            <input value={resDraft.name} onChange={e => setResDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="Resource name" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Type</span>
            <select value={resDraft.category} onChange={e => setResDraft(d => ({ ...d, category: e.target.value }))}
              style={{ ...inputStyle, flex: 'none', width: 130 }}>
              <option value="land">Land</option>
              <option value="water">Water</option>
              <option value="subterranean">Subterranean</option>
              <option value="special">Special</option>
              <option value="desert">Desert</option>
              <option value="mountain">Mountain</option>
            </select>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Goods</span>
            <input value={resDraft.commodities} onChange={e => setResDraft(d => ({ ...d, commodities: e.target.value }))}
              placeholder="iron, timber, gems (comma-separated)" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Desc</span>
            <input value={resDraft.desc} onChange={e => setResDraft(d => ({ ...d, desc: e.target.value }))}
              placeholder="Brief description" style={inputStyle} />
          </div>
          <button onClick={addResource} disabled={!resDraft.name.trim()} style={addBtnStyle}>
            Add Resource
          </button>
        </div>
      </Panel>

      {/* ── Custom Trade Routes ──────────────────────────────── */}
      <Panel title="Custom Trade Routes" icon={Compass} color="#7a5a2a" defaultOpen={false}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, lineHeight: 1.5 }}>
          Define trade dependencies and supply connections.
        </div>
        {customTradeRoutes.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 10 }}>
            {customTradeRoutes.map((route, i) => (
              <span key={i} style={pillStyle('#7a5a2a')}>
                {route.name}
                <button onClick={() => removeFrom('customTradeRoutes', i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7a5a2a', padding: 0, fontSize: 12, lineHeight: 1 }}>&times;</button>
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={rowStyle}>
            <span style={labelStyle}>Name</span>
            <input value={routeDraft.name} onChange={e => setRouteDraft(d => ({ ...d, name: e.target.value }))}
              placeholder="Route name" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Source</span>
            <input value={routeDraft.source} onChange={e => setRouteDraft(d => ({ ...d, source: e.target.value }))}
              placeholder="Origin settlement/region" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Dest</span>
            <input value={routeDraft.dest} onChange={e => setRouteDraft(d => ({ ...d, dest: e.target.value }))}
              placeholder="Destination settlement/region" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Goods</span>
            <input value={routeDraft.goods} onChange={e => setRouteDraft(d => ({ ...d, goods: e.target.value }))}
              placeholder="spices, silk, iron (comma-separated)" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Desc</span>
            <input value={routeDraft.desc} onChange={e => setRouteDraft(d => ({ ...d, desc: e.target.value }))}
              placeholder="Route description" style={inputStyle} />
          </div>
          <button onClick={addTradeRoute} disabled={!routeDraft.name.trim()} style={addBtnStyle}>
            Add Trade Route
          </button>
        </div>
      </Panel>

      {/* ── Power Dynamics ───────────────────────────────────── */}
      <Panel title="Power Dynamics" icon={Crown} color="#5a3a8a" defaultOpen={false}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, lineHeight: 1.5 }}>
          Pre-set faction relationships, government preferences, and political tensions.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={rowStyle}>
            <span style={labelStyle}>Gov Type</span>
            <select value={powerConfig.preferredGovernment || ''} onChange={e => updateConfig({
              powerDynamicsConfig: { ...powerConfig, preferredGovernment: e.target.value || null }
            })} style={{ ...inputStyle, flex: 'none', width: 160 }}>
              <option value="">Random</option>
              <option value="autocracy">Autocracy</option>
              <option value="oligarchy">Oligarchy</option>
              <option value="council">Council</option>
              <option value="theocracy">Theocracy</option>
              <option value="guild_republic">Guild Republic</option>
              <option value="military_junta">Military Junta</option>
              <option value="merchant_league">Merchant League</option>
            </select>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Stability</span>
            <select value={powerConfig.stability || ''} onChange={e => updateConfig({
              powerDynamicsConfig: { ...powerConfig, stability: e.target.value || null }
            })} style={{ ...inputStyle, flex: 'none', width: 160 }}>
              <option value="">Random</option>
              <option value="stable">Stable</option>
              <option value="uneasy">Uneasy</option>
              <option value="volatile">Volatile</option>
              <option value="collapse">Near Collapse</option>
            </select>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Factions</span>
            <select value={powerConfig.factionCount || ''} onChange={e => updateConfig({
              powerDynamicsConfig: { ...powerConfig, factionCount: e.target.value ? +e.target.value : null }
            })} style={{ ...inputStyle, flex: 'none', width: 160 }}>
              <option value="">Random</option>
              <option value="1">1 — Monopoly</option>
              <option value="2">2 — Duopoly</option>
              <option value="3">3 — Triad</option>
              <option value="4">4+ — Fractured</option>
            </select>
          </div>
        </div>
      </Panel>

      {/* ── Defense Scenarios ────────────────────────────────── */}
      <Panel title="Defense Scenarios" icon={Shield} color="#6b2a2a" defaultOpen={false}>
        <div style={{ fontSize: 11, color: MUTED, marginBottom: 8, lineHeight: 1.5 }}>
          Pre-configure defense posture, fortification level, and threat response.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={rowStyle}>
            <span style={labelStyle}>Posture</span>
            <select value={defenseConfig.posture || ''} onChange={e => updateConfig({
              defenseScenarioConfig: { ...defenseConfig, posture: e.target.value || null }
            })} style={{ ...inputStyle, flex: 'none', width: 160 }}>
              <option value="">Random</option>
              <option value="peaceful">Peaceful</option>
              <option value="defensive">Defensive</option>
              <option value="aggressive">Aggressive</option>
              <option value="paranoid">Paranoid</option>
            </select>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Walls</span>
            <select value={defenseConfig.fortification || ''} onChange={e => updateConfig({
              defenseScenarioConfig: { ...defenseConfig, fortification: e.target.value || null }
            })} style={{ ...inputStyle, flex: 'none', width: 160 }}>
              <option value="">Random</option>
              <option value="none">None</option>
              <option value="palisade">Palisade</option>
              <option value="stone_walls">Stone Walls</option>
              <option value="fortified">Fortified</option>
              <option value="citadel">Citadel</option>
            </select>
          </div>
          <div style={rowStyle}>
            <span style={labelStyle}>Militia</span>
            <select value={defenseConfig.militiaLevel || ''} onChange={e => updateConfig({
              defenseScenarioConfig: { ...defenseConfig, militiaLevel: e.target.value || null }
            })} style={{ ...inputStyle, flex: 'none', width: 160 }}>
              <option value="">Random</option>
              <option value="untrained">Untrained</option>
              <option value="militia">Militia</option>
              <option value="professional">Professional Guard</option>
              <option value="standing_army">Standing Army</option>
            </select>
          </div>
        </div>
      </Panel>
    </>
  );
}

// ── Summary badge ────────────────────────────────────────────────────────────

function SummaryBadge({ label, value }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: `2px ${SP.sm}px`, background: CARD_HDR,
      borderRadius: R.sm, border: `1px solid ${BORDER2}`,
      fontSize: FS.xxs, whiteSpace: 'nowrap',
    }}>
      <span style={{ color: MUTED }}>{label}:</span>
      <span style={{ fontWeight: 700, color: INK }}>{String(value)}</span>
    </span>
  );
}
