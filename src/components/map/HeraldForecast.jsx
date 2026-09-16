// HeraldForecast.jsx — THE FORECAST entry (the Divination door). NOT a past report:
// the pressure/emergence substrate read in PRESENT-PROGRESSIVE grammar, and visually
// unmistakable as a forecast (the weather-page distinction) — a dashed frame, the
// forecast glyph, and the `amendable` chip on EVERY entry, so a prediction is never
// read as a fact.
//
// FINITE-SEMANTICS: the present-progressive frame ("Pressure builds toward") is a
// FROZEN authored lead from a finite lexicon (the discourse-kernel connective idiom);
// the outcome it builds toward is the recorded label, byte-verbatim. No em-dash or
// exclamation in any copy string (the separators are styled layout elements).

import { CloudDrizzle } from 'lucide-react';

import { BORDER2, CARD_ALT, FS, INK, MUTED, SECOND, sans, swatch } from '../theme.js';
import { AddressChain, AffectedSettlements } from './AddressChain.jsx';
import { Pill } from './WorldPulsePrimitives.jsx';
import { headlineSlotsOf } from './heraldGrammar.js';

/** The frozen present-progressive lead — a forecast reads as BUILDING, never past. */
const FORECAST_LEAD = 'Pressure builds toward';

/**
 * @param {object} props
 * @param {import('./heraldFeed.js').HeraldItem} props.item
 * @param {Map<string,string>} [props.nameById]
 */
export default function HeraldForecast({ item }) {
  const slots = headlineSlotsOf(item);
  return (
    <article
      data-testid="herald-forecast"
      style={{
        border: `1px dashed ${swatch['#A0762A']}`,
        background: CARD_ALT,
        padding: 9,
        display: 'grid',
        gap: 4,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <CloudDrizzle size={13} color={SECOND} aria-hidden="true" />
        <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.micro, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {FORECAST_LEAD}
        </span>
        {/* THE AMENDABLE CHIP — forced on every forecast entry (a prediction). */}
        <Pill tone="neutral">amendable</Pill>
      </div>

      {/* The subject building the pressure (linked, as deep as recorded). */}
      <AddressChain descriptor={slots.subject} />

      {/* The outcome it builds toward — the recorded label, byte-verbatim. */}
      <div style={{ color: INK, fontFamily: sans, fontSize: FS.xs, fontWeight: 850, lineHeight: 1.3, overflowWrap: 'anywhere' }}>
        {slots.glance}
      </div>

      {/* The region it builds in + the recorded drivers. */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        {slots.affectedIds.length > 0 && <AffectedSettlements ids={slots.affectedIds} label="In" />}
        {slots.reason && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', minHeight: 12, background: BORDER2 }} />
            <span style={{ color: MUTED, fontFamily: sans, fontSize: FS.xxs, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Drivers</span>
            <span style={{ color: SECOND, fontFamily: sans, fontSize: FS.xxs, fontWeight: 700, overflowWrap: 'anywhere' }}>{slots.reason}</span>
          </span>
        )}
      </div>
    </article>
  );
}
