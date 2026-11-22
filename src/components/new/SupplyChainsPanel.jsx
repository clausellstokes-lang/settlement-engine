import React from 'react';
import { FS, swatch } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize } from '../../design/proseScale.js';
import { SUPPLY_CHAIN_NEEDS } from '../../data/goods/chains.js';
import { exactGoodId, goodText } from '../../domain/region/goodsCatalog.js';
import { institutionDisplayName } from '../../domain/display/institutionDisplayName.js';
import { supplyChainNoteInWords } from '../../domain/display/engineKeysInText.js';

// ── Build a lookup: chainId → full chain definition ──────────────────────────
const CHAIN_DEFS = {};
Object.values(SUPPLY_CHAIN_NEEDS || {}).forEach(cat => {
  (cat.chains || []).forEach(c => { if (c.id) CHAIN_DEFS[c.id] = c; });
});

// ── Status config ─────────────────────────────────────────────────────────────
export const STATUS = {
  active:      { color: '#1a5a28', bg: '#f0faf2', border: '#a8d8b0', label: 'Active',      dot: '●' },
  confirmed:   { color: '#6b5340', bg: '#f8f5f0', border: '#c8b898', label: 'Reviewed',    dot: '✓' },
  stale:       { color: '#8a5010', bg: '#fdf8ec', border: '#e0c070', label: 'Needs Review', dot: '◐' },
  blocked:     { color: '#8a5010', bg: '#fdf8ec', border: '#e0c070', label: 'Blocked',     dot: '◐' },
  ineligible:  { color: '#6b5340', bg: '#f8f5f0', border: '#c8b898', label: 'Ineligible',  dot: '○' },
  running:     { color: '#1a5a28', bg: '#f0faf2', border: '#a8d8b0', label: 'Running',     dot: '●' },
  operational: { color: '#1a5a28', bg: '#f0faf2', border: '#a8d8b0', label: 'Running',     dot: '●' },
  vulnerable:  { color: '#8a5010', bg: '#fdf8ec', border: '#e0c070', label: 'Vulnerable',  dot: '◐' },
  impaired:    { color: '#8b1a1a', bg: '#fdf4f4', border: '#e8b0b0', label: 'Impaired',    dot: '○' },
  broken:      { color: '#8b1a1a', bg: '#fdf4f4', border: '#e8b0b0', label: 'Broken',      dot: '✕' },
  // Ported master fix: computeActiveChains emits 'entrepot' (a healthy re-export
  // hub); without its own chip it fell through to Vulnerable.
  entrepot:            { color: '#a0762a', bg: '#faf6ec', border: '#d8c090', label: 'Entrepôt',            dot: '●' },
  // Ported master fix: EconomicsTab emits this status; without its own chip it
  // fell through to Vulnerable. Info-blue to match the magic tag (vetoable
  // cosmetic: master chose blue over the old purple).
  magically_sustained: { color: swatch.info, bg: swatch.infoBg, border: '#a0b0d8', label: 'Magically Sustained', dot: '✦' },
};
export const getStatus = s => STATUS[s] || STATUS.vulnerable;

// ── Arrow component ───────────────────────────────────────────────────────────
const Arrow = ({ color = '#9c8068' }) => (
  <span style={{ color, fontSize: FS['14'], fontWeight: 700, flexShrink: 0, userSelect: 'none', padding: '0 3px' }}>→</span>
);

// ── Node: resource ────────────────────────────────────────────────────────────
const ResourceNode = ({ icon, label, depleted, st }) => {
  const mobile = useIsMobile();
  return (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 4,
    background: depleted ? '#fdf8ec' : st.bg,
    border: `1px solid ${depleted ? '#d8b060' : st.border}`,
    padding: '3px 8px', flexShrink: 0,
    opacity: depleted ? 0.75 : 1,
  }}>
    {icon && <span style={{ fontSize: FS.md }}>{icon}</span>}
    <span style={{ fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700, color: depleted ? '#8a5010' : st.color }}>
      {label}{depleted ? ' (depleted)' : ''}
    </span>
  </div>
  );
};

// ── Node: institution ─────────────────────────────────────────────────────────
const InstNode = ({ name, present, st }) => {
  const mobile = useIsMobile();
  return (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 3,
    background: present ? st.bg : '#f8f5f0',
    border: `1px ${present ? 'solid' : 'dashed'} ${present ? st.border : '#c8b898'}`,
    padding: '3px 8px', flexShrink: 0,
  }}>
    <span style={{ fontSize: chromeFontSize(FS.xs, mobile), fontWeight: present ? 700 : 400,
      color: present ? st.color : '#9c8068',
      fontStyle: present ? 'normal' : 'italic' }}>
      {name}{!present ? ' (missing)' : ''}
    </span>
  </div>
  );
};

// ── Node: import ──────────────────────────────────────────────────────────────
const ImportNode = ({ label }) => {
  const mobile = useIsMobile();
  return (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 3,
    background: swatch['#FAF8F4'], border: '1px dashed #a0b0d8',
    padding: '3px 8px', flexShrink: 0,
  }}>
    <span style={{ fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 600, color: swatch.info }}>Import: {label}</span>
  </div>
  );
};

// ── Node: output / export ─────────────────────────────────────────────────────
const OutputNode = ({ label, isExport }) => {
  const mobile = useIsMobile();
  return (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 3,
    background: isExport ? '#f0faf2' : '#faf8f4',
    border: `1px solid ${isExport ? '#88c880' : '#d8c8a8'}`,
    padding: '3px 8px', flexShrink: 0,
  }}>
    {isExport && <span style={{ fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 800, color: swatch.success }}>↗</span>}
    <span style={{ fontSize: chromeFontSize(FS.xs, mobile), fontWeight: isExport ? 700 : 500,
      color: isExport ? '#1a5a28' : '#6b5340' }}>
      {label}
    </span>
    {isExport && <span style={{ fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 800, color: swatch.success, marginLeft: 2, textTransform: 'uppercase' }}>Export</span>}
  </div>
  );
};

// ── The chain facts only this diagram carried ─────────────────────────────────
/**
 * THE FOUR FACTS A CHAIN CARD OWES THE READER BEYOND ITS STATUS (UX consolidation
 * 2026-10-30, RULINGS-T2 T2-6). The Economics tab used to print every chain twice — once as
 * an Economic Flows card, once as a Supply Chains diagram row (974/974 identical sets) — and
 * only the diagram carried these four. Economic Flows is now the ONE rendering on the tab,
 * so it reads them from here, and `ChainRow` (still the Compendium's chain renderer) reads
 * the same derivation: one source, two hosts, no drift.
 *
 * @param {object} chain an `economicState.activeChains[]` row
 * @param {ReadonlyArray<string>} instNames the settlement's institution names, raw
 * @returns {{resource: string|null, resourceDepleted: boolean,
 *   institutions: Array<{name: string, present: boolean}>, importedUpstream: string[],
 *   upstreamNote: string|null}}
 */
export function chainFlowFacts(chain, instNames = []) {
  const names = (instNames || []).map(n => String(n || '').toLowerCase());
  return {
    resource: chain?.resource || null,
    resourceDepleted: !!chain?.resourceDepleted,
    // Which processing institutions are actually present?
    institutions: (chain?.processingInstitutions || []).map(name => ({
      name,
      present: names.some(n => n.includes(String(name).toLowerCase().split(/[\s(]/)[0])),
    })),
    // Upstream imports needed — the generator stores chain IDS; the reader gets labels.
    importedUpstream: (chain?.upstreamMissing || []).map(uid => CHAIN_DEFS[uid]?.label || uid),
    // The generator joins CHAIN IDS into this sentence, so the seam resolves them against
    // the same table the labels above are drawn from.
    upstreamNote: chain?.upstreamNote ? supplyChainNoteInWords(chain.upstreamNote, CHAIN_DEFS) : null,
  };
}

// ── Single chain row ──────────────────────────────────────────────────────────
export function ChainRow({ chain, instNames, primaryExports, mobile }) {
  const st      = getStatus(chain.status);
  const def     = CHAIN_DEFS[chain.chainId] || {};
  const missing = chain.upstreamMissing || [];
  const isExportable = chain.exportable && !chain.entrepot;
  const facts = chainFlowFacts(chain, instNames);

  // Which processing institutions are actually present?
  const insts = facts.institutions;

  // Outputs: match against primaryExports — canonical good id first
  // (subsumption renames within a good: 'Boots and shoes' can survive as
  // 'Leather goods', which the first-word check below can't see), then the
  // substring check as the fallback for custom/unrecognized labels.
  const exportIds = new Set((primaryExports || []).map(exactGoodId).filter(Boolean));
  const outputs = (chain.outputs || def.outputs || []).slice(0, 2).map(o => {
    const oid = exactGoodId(o);
    return {
      label: o,
      isExport: isExportable && (
        (oid != null && exportIds.has(oid)) ||
        (primaryExports || []).some(ex => {
          // ex may be a bare string OR the {good/name/label} object shape —
          // goodText() keeps `.toLowerCase()` from throwing on an object export.
          const e = goodText(ex).toLowerCase();
          return e.includes(o.toLowerCase().split(' ')[0]) ||
            o.toLowerCase().includes(e.split(' ')[0]);
        })
      ),
    };
  });
  const hasExport = outputs.some(o => o.isExport) || (isExportable && !outputs.length);

  // Upstream imports needed
  const importedUpstream = facts.importedUpstream;

  // Mobile: compressed single-line view
  if (mobile) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
        background: st.bg, borderLeft: `3px solid ${st.border}`}}>
        {/* Icon sweep 2026-08-03: the built-in corpus authors no resourceIcon, so
            this slot renders ONLY for custom/AI-authored chains that carry one.
            An unguarded span emitted an empty box that still ate the flex gap. */}
        {chain.resourceIcon && <span style={{ fontSize: FS.sm }}>{chain.resourceIcon}</span>}
        <span style={{ fontSize: FS.sm, fontWeight: 700, color: st.color, flex: 1 }}>{chain.label}</span>
        {hasExport && <span style={{ fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 800, color: swatch.success, background: swatch['#E8F5EC'], border: '1px solid #a8d8b0', padding: '1px 5px', textTransform: 'uppercase' }}>Export</span>}
        {missing.length > 0 && <span style={{ fontSize: chromeFontSize(FS.micro, mobile), color: swatch.info, background: swatch['#FAF8F4'], border: '1px solid #a0b0d8', padding: '1px 5px' }}>imported</span>}
        <span style={{ fontSize: chromeFontSize(FS.micro, mobile), fontWeight: 700, color: st.color }}>{st.dot}</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '8px 12px', background: st.bg,
      borderLeft: `3px solid ${st.border}`, 
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
            {/* §934.13 — the NODE's word is the display label; `inst.present` above was
                computed from the raw name against the settlement's raw roster. */}
            <InstNode name={institutionDisplayName(inst.name)} present={inst.present} st={st} />
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

      {/* Upstream note — the generator joins CHAIN IDS into this sentence, so the seam
          resolves them against the same table the nodes above are drawn from. */}
      {facts.upstreamNote && (
        <div style={{ marginTop: 4, fontSize: chromeFontSize(FS.xxs, mobile), color: swatch.inkMag3, fontStyle: 'italic' }}>
          ↑ {facts.upstreamNote}
        </div>
      )}
    </div>
  );
}

// ── The panel that used to mount here ─────────────────────────────────────────
// The grouped SupplyChainsPanel (category groups, legend) left the Economics tab in the UX
// consolidation of 2026-10-30 (RULINGS-T2 T2-6): it rendered the same chain set Economic
// Flows renders, on 974 of 974 towns. Its four unique facts travel through
// `chainFlowFacts` above into Economic Flows; `ChainRow` stays for the Compendium.
