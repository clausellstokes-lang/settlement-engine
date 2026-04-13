import React, { useState } from 'react';
import { isMobile } from './tabConstants';
import { SUPPLY_CHAIN_NEEDS } from '../../data/supplyChainData.js';

// ── Build a lookup: chainId → full chain definition ──────────────────────────
const CHAIN_DEFS = {};
Object.values(SUPPLY_CHAIN_NEEDS || {}).forEach(cat => {
  (cat.chains || []).forEach(c => { if (c.id) CHAIN_DEFS[c.id] = c; });
});

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS = {
  running:     { color: '#1a5a28', bg: '#f0faf2', border: '#a8d8b0', label: 'Running',     dot: '●' },
  operational: { color: '#1a5a28', bg: '#f0faf2', border: '#a8d8b0', label: 'Running',     dot: '●' },
  vulnerable:  { color: '#8a5010', bg: '#fdf8ec', border: '#e0c070', label: 'Vulnerable',  dot: '◐' },
  impaired:    { color: '#8b1a1a', bg: '#fdf4f4', border: '#e8b0b0', label: 'Impaired',    dot: '○' },
  broken:      { color: '#8b1a1a', bg: '#fdf4f4', border: '#e8b0b0', label: 'Broken',      dot: '✕' },
};
const getStatus = s => STATUS[s] || STATUS.vulnerable;

// ── Arrow component ───────────────────────────────────────────────────────────
const Arrow = ({ color = '#9c8068' }) => (
  <span style={{ color, fontSize: 14, fontWeight: 700, flexShrink: 0, userSelect: 'none', padding: '0 3px' }}>→</span>
);

// ── Node: resource ────────────────────────────────────────────────────────────
const ResourceNode = ({ icon, label, depleted, st }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 4,
    background: depleted ? '#fdf8ec' : st.bg,
    border: `1px solid ${depleted ? '#d8b060' : st.border}`,
    borderRadius: 5, padding: '3px 8px', flexShrink: 0,
    opacity: depleted ? 0.75 : 1,
  }}>
    {icon && <span style={{ fontSize: 13 }}>{icon}</span>}
    <span style={{ fontSize: 11, fontWeight: 700, color: depleted ? '#8a5010' : st.color }}>
      {label}{depleted ? ' (depleted)' : ''}
    </span>
  </div>
);

// ── Node: institution ─────────────────────────────────────────────────────────
const InstNode = ({ name, present, st }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 3,
    background: present ? st.bg : '#f8f5f0',
    border: `1px ${present ? 'solid' : 'dashed'} ${present ? st.border : '#c8b898'}`,
    borderRadius: 5, padding: '3px 8px', flexShrink: 0,
  }}>
    <span style={{ fontSize: 10 }}></span>
    <span style={{ fontSize: 11, fontWeight: present ? 700 : 400,
      color: present ? st.color : '#9c8068',
      fontStyle: present ? 'normal' : 'italic' }}>
      {name}{!present ? ' (missing)' : ''}
    </span>
  </div>
);

// ── Node: import ──────────────────────────────────────────────────────────────
const ImportNode = ({ label }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 3,
    background: '#f0f4ff', border: '1px dashed #a0b0d8',
    borderRadius: 5, padding: '3px 8px', flexShrink: 0,
  }}>
    <span style={{ fontSize: 10 }}></span>
    <span style={{ fontSize: 11, fontWeight: 600, color: '#2a3a7a' }}>Import: {label}</span>
  </div>
);

// ── Node: output / export ─────────────────────────────────────────────────────
const OutputNode = ({ label, isExport }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 3,
    background: isExport ? '#f0faf2' : '#faf8f4',
    border: `1px solid ${isExport ? '#88c880' : '#d8c8a8'}`,
    borderRadius: 5, padding: '3px 8px', flexShrink: 0,
  }}>
    {isExport && <span style={{ fontSize: 9, fontWeight: 800, color: '#1a5a28' }}>↗</span>}
    <span style={{ fontSize: 11, fontWeight: isExport ? 700 : 500,
      color: isExport ? '#1a5a28' : '#6b5340' }}>
      {label}
    </span>
    {isExport && <span style={{ fontSize: 9, fontWeight: 800, color: '#1a5a28', marginLeft: 2 }}>EXPORT</span>}
  </div>
);

// ── Single chain row ──────────────────────────────────────────────────────────
function ChainRow({ chain, instNames, primaryExports, mobile }) {
  const st      = getStatus(chain.status);
  const def     = CHAIN_DEFS[chain.chainId] || {};
  const missing = chain.upstreamMissing || [];
  const isExportable = chain.exportable && !chain.entrepot;

  // Which processing institutions are actually present?
  const insts = (chain.processingInstitutions || []).map(name => ({
    name,
    present: instNames.some(n => n.toLowerCase().includes(name.toLowerCase().split(/[\s(]/)[0])),
  }));

  // Outputs: match against primaryExports
  const outputs = (chain.outputs || def.outputs || []).slice(0, 2).map(o => ({
    label: o,
    isExport: isExportable && (primaryExports || []).some(ex =>
      ex.toLowerCase().includes(o.toLowerCase().split(' ')[0]) ||
      o.toLowerCase().includes(ex.toLowerCase().split(' ')[0])
    ),
  }));
  const hasExport = outputs.some(o => o.isExport) || (isExportable && !outputs.length);

  // Upstream imports needed
  const importedUpstream = missing.map(uid => {
    const upDef = CHAIN_DEFS[uid];
    return upDef?.label || uid;
  });

  // Mobile: compressed single-line view
  if (mobile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
        background: st.bg, borderLeft: `3px solid ${st.border}`, borderRadius: 4 }}>
        <span style={{ fontSize: 12 }}>{chain.resourceIcon || '️'}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: st.color, flex: 1 }}>{chain.label}</span>
        {hasExport && <span style={{ fontSize: 9, fontWeight: 800, color: '#1a5a28', background: '#e8f5ec', border: '1px solid #a8d8b0', borderRadius: 3, padding: '1px 5px' }}>EXPORT</span>}
        {missing.length > 0 && <span style={{ fontSize: 9, color: '#2a3a7a', background: '#f0f4ff', border: '1px solid #a0b0d8', borderRadius: 3, padding: '1px 5px' }}> imported</span>}
        <span style={{ fontSize: 9, fontWeight: 700, color: st.color }}>{st.dot}</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 12px', background: st.bg,
      borderLeft: `3px solid ${st.border}`, borderRadius: '0 5px 5px 0',
      border: `1px solid ${st.border}`, borderLeftWidth: 3 }}>

      {/* Main chain flow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', rowGap: 4 }}>

        {/* Resource node */}
        {chain.resource && (
          <>
            <ResourceNode
              icon={chain.resourceIcon}
              label={chain.resource}
              depleted={chain.resourceDepleted}
              st={st} />
            <Arrow color={st.border} />
          </>
        )}

        {/* Import nodes (upstream dependencies covered by imports) */}
        {importedUpstream.map((imp, i) => (
          <React.Fragment key={i}>
            <ImportNode label={imp} />
            <Arrow color="#a0b0d8" />
          </React.Fragment>
        ))}

        {/* Institution nodes */}
        {insts.map((inst, i) => (
          <React.Fragment key={i}>
            <InstNode name={inst.name} present={inst.present} st={st} />
            {i < insts.length - 1 && <Arrow color={st.border} />}
          </React.Fragment>
        ))}

        {/* Outputs */}
        {outputs.length > 0 && (
          <>
            <Arrow color={st.border} />
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {outputs.map((o, i) => <OutputNode key={i} label={o.label} isExport={o.isExport} />)}
            </div>
          </>
        )}
      </div>

      {/* Upstream note */}
      {chain.upstreamNote && (
        <div style={{ marginTop: 4, fontSize: 10, color: '#6b5340', fontStyle: 'italic' }}>
          ↑ {chain.upstreamNote}
        </div>
      )}
    </div>
  );
}

// ── Category group ────────────────────────────────────────────────────────────
function CategoryGroup({ needKey, needLabel, needIcon, needColor, chains, instNames, primaryExports, mobile, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen !== false);
  const impaired = chains.filter(c => c.status === 'impaired' || c.status === 'broken').length;
  const vulnerable = chains.filter(c => c.status === 'vulnerable').length;

  return (
    <div style={{ marginBottom: 8 }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', background: '#faf8f4',
        border: '1px solid #e0d0b0', borderRadius: 5,
        cursor: 'pointer', textAlign: 'left',
      }}>
        <span style={{ fontSize: 14 }}>{needIcon || '️'}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: needColor || '#1c1409', flex: 1,
          textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {needLabel || needKey}
        </span>
        <span style={{ fontSize: 11, color: '#9c8068' }}>{chains.length} chain{chains.length !== 1 ? 's' : ''}</span>
        {impaired > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: '#8b1a1a', background: '#fdf4f4', border: '1px solid #e8b0b0', borderRadius: 3, padding: '1px 5px' }}>✕ {impaired}</span>}
        {vulnerable > 0 && <span style={{ fontSize: 9, fontWeight: 800, color: '#8a5010', background: '#fdf8ec', border: '1px solid #e0c070', borderRadius: 3, padding: '1px 5px' }}>◐ {vulnerable}</span>}
        <span style={{ fontSize: 9, color: '#9c8068' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 4, paddingLeft: 8 }}>
          {chains.map((c, i) => (
            <ChainRow key={c.chainId || i} chain={c} instNames={instNames}
              primaryExports={primaryExports} mobile={mobile} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export function SupplyChainsPanel({ settlement, eco: ecoProp }) {
  const mobile = isMobile();
  const eco    = ecoProp || settlement?.economicState;
  const chains = (eco?.activeChains || []).filter(c =>
    // Show: running, operational, vulnerable (impaired only if has any institution)
    c.status !== 'unexploited'
  );

  if (!chains.length) return null;

  const instNames     = (settlement?.institutions || []).map(i => i.name || '');
  const primaryExports = eco?.primaryExports || [];
  const tier          = settlement?.tier || 'village';
  const isTownPlus    = ['town', 'city', 'metropolis'].includes(tier);

  // Group by needKey for town+, flat for smaller
  if (isTownPlus) {
    const groups = {};
    chains.forEach(c => {
      const key = c.needKey || 'other';
      if (!groups[key]) groups[key] = {
        needKey: key,
        needLabel: c.needLabel,
        needIcon: c.needIcon,
        needColor: c.needColor,
        chains: [],
      };
      groups[key].chains.push(c);
    });

    const sortedGroups = Object.values(groups).sort((a, b) => {
      // Impaired groups first, then vulnerable, then running
      const severity = g => g.chains.filter(c => ['impaired','broken'].includes(c.status)).length * 100
        + g.chains.filter(c => c.status === 'vulnerable').length * 10;
      return severity(b) - severity(a) || (a.needLabel || '').localeCompare(b.needLabel || '');
    });

    return (
      <div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
          <Legend />
        </div>
        {sortedGroups.map(g => (
          <CategoryGroup key={g.needKey} {...g}
            instNames={instNames} primaryExports={primaryExports}
            mobile={mobile} defaultOpen={g.chains.some(c => ['impaired','broken','vulnerable'].includes(c.status))} />
        ))}
      </div>
    );
  }

  // Flat list for village/hamlet/thorp
  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
        <Legend />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {chains.map((c, i) => (
          <ChainRow key={c.chainId || i} chain={c} instNames={instNames}
            primaryExports={primaryExports} mobile={mobile} />
        ))}
      </div>
    </div>
  );
}

function Legend() {
  const items = [
    { dot: '●', color: '#1a5a28', label: 'Running' },
    { dot: '◐', color: '#8a5010', label: 'Vulnerable — upstream imported' },
    { dot: '○', color: '#8b1a1a', label: 'Impaired — institution missing' },
    { text: '', label: 'Import fills gap' },
    { text: '↗ EXPORT', color: '#1a5a28', label: 'Exported for income' },
  ];
  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 10, color: '#6b5340' }}>
      {items.map((it, i) => (
        <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontWeight: 700, color: it.color }}>{it.dot || it.text}</span>
          {it.label}
        </span>
      ))}
    </div>
  );
}

export default SupplyChainsPanel;
