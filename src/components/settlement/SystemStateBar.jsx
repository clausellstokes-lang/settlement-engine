/**
 * SystemStateBar — Four bars, one per dimension, with band labels.
 *
 * Numbers are deliberately de-emphasized (small, gray) and bands are
 * the primary visual ("Strained", "Vulnerable") because the architect
 * critique is right that DMs don't think in spreadsheets. Drivers and
 * risks surface as a tooltip / details disclosure.
 */

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Skull, Boxes, Info } from 'lucide-react';
import { useStore } from '../../store/index.js';
import { BAND_COLOR, BAND_HINT } from '../../domain/state/bands.js';
import { INK, MUTED, BORDER, CARD, sans, FS, SP, R, swatch } from '../theme.js';

const DIM_META = {
  resilience:       { label: 'Resilience',        Icon: ShieldCheck,    higherIsBetter: true,  desc: 'Can the place absorb shocks?' },
  volatility:       { label: 'Volatility',        Icon: AlertTriangle,  higherIsBetter: false, desc: 'How close is internal conflict?' },
  externalThreat:   { label: 'External Threat',   Icon: Skull,          higherIsBetter: false, desc: 'Pressure from outside.' },
  resourcePressure: { label: 'Resource Pressure', Icon: Boxes,          higherIsBetter: false, desc: 'Are key materials strained?' },
};

const DIM_ORDER = ['resilience', 'volatility', 'externalThreat', 'resourcePressure'];

export default function SystemStateBar() {
  const systemState = useStore(s => s.systemState);
  if (!systemState) return null;
  return <SystemStateGrid systemState={systemState} />;
}

/**
 * Presentational 4-dimension grid (UX overhaul Phase 2). The store-bound
 * SystemStateBar above and the read-view ReadSystemStateBar below both render
 * through this, so the promoted read-view strip and the edit-mode bar share ONE
 * visual. Pure — takes the already-derived systemState; no store read.
 * @param {{ systemState: any, title?: string }} props
 */
export function SystemStateGrid({ systemState, title = 'Settlement State' }) {
  const [openKey, setOpenKey] = useState(null);
  if (!systemState) return null;
  return (
    <div
      data-testid="system-state-grid"
      style={{
        background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.md,
        padding: SP.sm,
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: FS.xs, fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.xs,
      }}>
        {title}
        <Info size={11} style={{ opacity: 0.6 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: SP.sm }}>
        {DIM_ORDER.map(key => {
          const dim = systemState[key];
          if (!dim) return null;
          return (
            <DimensionRow
              key={key}
              dimKey={key}
              dim={dim}
              isOpen={openKey === key}
              onToggle={() => setOpenKey(openKey === key ? null : key)}
            />
          );
        })}
      </div>
    </div>
  );
}

function DimensionRow({ dimKey, dim, isOpen, onToggle }) {
  const meta = DIM_META[dimKey];
  const Icon = meta.Icon;
  const color = BAND_COLOR[dim.band] || MUTED;
  // For "lower is better" dims (volatility, threat, pressure), render
  // the bar from the right so bigger values look heavier and a "good"
  // value reads as a small bar — matches DM intuition.
  const fillPct = meta.higherIsBetter ? dim.value : (100 - dim.value);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      title={`${meta.label}: ${dim.band}. Click for details.`}
      style={{
        cursor: 'pointer',
        padding: SP.xs,
        border: `1px solid ${BORDER}`, borderRadius: R.sm,
        background: CARD,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <Icon size={12} color={color} />
        <span style={{ fontSize: FS.xs, fontWeight: 700, color: INK, fontFamily: sans }}>
          {meta.label}
        </span>
        <span style={{ flex: 1 }} />
        <span style={{
          fontSize: FS.xxs, fontWeight: 800, color, fontFamily: sans,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {dim.band}
        </span>
        <span style={{ fontSize: FS.xxs, color: MUTED, fontFamily: sans, marginLeft: 4, opacity: 0.7 }}>
          {dim.value}
        </span>
      </div>
      <div style={{ height: 4, background: swatch['#E7D7B8'], borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${fillPct}%`,
          background: color, transition: 'width 200ms',
        }} />
      </div>
      {isOpen && (
        <div style={{
          marginTop: SP.xs, padding: SP.xs,
          background: swatch.white, border: `1px solid ${BORDER}`, borderRadius: R.sm,
          fontSize: FS.xxs, color: INK, fontFamily: sans, lineHeight: 1.5,
        }}>
          <div style={{ fontStyle: 'italic', color: MUTED, marginBottom: 4 }}>
            {meta.desc} {BAND_HINT[dim.band]}
          </div>
          {dim.drivers?.length > 0 && (
            <div>
              <strong>Drivers:</strong>
              <ul style={{ margin: '2px 0 4px', paddingLeft: 16 }}>
                {dim.drivers.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}
          {dim.risks?.length > 0 && (
            <div>
              <strong>Risks:</strong>
              <ul style={{ margin: '2px 0 0', paddingLeft: 16 }}>
                {dim.risks.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
