/**
 * SystemStateBar — Four bars, one per dimension, with band labels.
 *
 * Numbers are deliberately de-emphasized (small, gray) and bands are
 * the primary visual ("Strained", "Vulnerable") because the architect
 * critique is right that DMs don't think in spreadsheets. Drivers and
 * risks surface as a tooltip / details disclosure.
 */

import { useState } from 'react';
import { useStore } from '../../store/index.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { BAND_COLOR, BAND_HINT, dimensionScaleNote } from '../../domain/state/bands.js';
import { INK, MUTED, BORDER, CARD, sans, FS, SP, swatch } from '../theme.js';
import { statusCase } from '../new/labelLadder.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

// Labels + one-line descriptions only. Polarity is NOT re-declared here — it is
// read from bands.js (DIM_POLARITY), the single source the band itself is
// oriented by, so the bar fill and the band word can no longer disagree.
const DIM_META = {
  resilience:       { label: 'Resilience',        desc: 'Can the place absorb shocks?' },
  volatility:       { label: 'Volatility',        desc: 'How close is internal conflict?' },
  externalThreat:   { label: 'External Threat',   desc: 'Pressure from outside.' },
  resourcePressure: { label: 'Resource Pressure', desc: 'Are key materials strained?' },
};

const DIM_ORDER = ['resilience', 'volatility', 'externalThreat', 'resourcePressure'];

export default function SystemStateBar() {
  const systemState = useStore(s => s.systemState);
  if (!systemState) return null;
  return <SystemStateGrid systemState={systemState} />;
}

/**
 * Presentational 4-dimension grid (UX overhaul Phase 2). The store-bound
 * SystemStateBar above and the read-view ReadSystemStateBar (its own file,
 * ReadSystemStateBar.jsx — NOT below in this one) both render through this, so
 * the read-view strip in the dossier Summary and the edit-mode bar share ONE
 * visual. Pure — takes the already-derived systemState; no store read.
 * @param {{ systemState: any, title?: string }} props
 */
export function SystemStateGrid({ systemState, title = 'Settlement State' }) {
  const mobile = useIsMobile();
  const [openKey, setOpenKey] = useState(null);
  // The four dimension tiles sit two-up on desktop. At mobile width that pair of
  // columns crushes each band label and number into an unreadable sliver, so the
  // grid stacks to a single column below the breakpoint. Desktop is unchanged.
  const isMobile = useIsMobile();
  if (!systemState) return null;
  return (
    <div
      data-testid="system-state-grid"
      style={{
        background: CARD, border: `1px solid ${BORDER}`,
        padding: SP.sm,
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 800, fontFamily: sans,
        color: MUTED, letterSpacing: '0.06em', textTransform: 'uppercase',
        marginBottom: SP.xs,
      }}>
        {title}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: SP.sm }}>
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
  const mobile = useIsMobile();
  const meta = DIM_META[dimKey];
  const color = BAND_COLOR[dim.band] || MUTED;
  // ⭐ THE BAR DRAWS THE NUMBER IT PRINTS (bands.js dimensionScaleNote, the §934.20
  // chart-census cure). This row used to fill from `100 - dim.value` for the three
  // lower-is-better dimensions while printing the raw value two spans to the left, so
  // "Volatility · Critical · 88" drew a bar 12 % full. The run is now the same expression
  // as the figure, and where the dimension runs the other way the row says so under the
  // bar. The print twin (src/pdf/sections/SystemStateSnapshot.jsx) took the identical cure
  // in the same commit, off this same leaf, because the two surfaces are pinned to agree.
  const scaleNote = dimensionScaleNote(dimKey);

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
        border: `1px solid ${BORDER}`,
        background: CARD,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ fontSize: chromeFontSize(FS.xs, mobile), fontWeight: 700, color: INK, fontFamily: sans }}>
          {meta.label}
        </span>
        <span style={{ flex: 1 }} />
        {/* RUNG 3, THE STATUS VALUE — sentence case, colour and weight carrying the
            meaning (components/new/labelLadder.js). This strip is the one rung-3 site the
            screen's own ladder car missed, and the miss was invisible while the PDF shouted
            too: `SystemStateSnapshot`'s DimensionCard is this element's print twin and the
            two are pinned to agree CHARACTER FOR CHARACTER, so descending one without the
            other would have opened the divergence that lane exists to close. The card's
            eyebrow above keeps its capitals; this is a datum, not a section. */}
        <span style={{
          fontSize: chromeFontSize(FS.xxs, mobile), fontWeight: 800, color, fontFamily: sans,
        }}>
          {statusCase(dim.band)}
        </span>
        <span style={{ fontSize: chromeFontSize(FS.xxs, mobile), color: MUTED, fontFamily: sans, marginLeft: 4, opacity: 0.7 }}>
          {dim.value}
        </span>
      </div>
      <div style={{ height: 4, background: swatch['#E7D7B8'], overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${dim.value}%`,
          background: color, transition: 'width 200ms',
        }} />
      </div>
      {/* The scale note sits UNDER THE BAR, not behind the disclosure: the reader who
          needs it is the one looking at a long bar on a bad dimension, and the caption
          inside `isOpen` is exactly where they are not looking. */}
      {scaleNote && (
        <div style={{
          marginTop: 2, fontSize: chromeFontSize(FS.xxs, mobile), color: MUTED, fontFamily: sans, fontStyle: 'italic',
        }}>
          {scaleNote}
        </div>
      )}
      {isOpen && (
        <div style={{
          marginTop: SP.xs, padding: SP.xs,
          background: swatch.white, border: `1px solid ${BORDER}`,
          fontSize: proseFontSize(FS.xxs, mobile), color: INK, fontFamily: sans, lineHeight: 1.5,
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
