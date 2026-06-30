/**
 * EventComposerTierField — the SHIFT_TIER "Direction" field for the Make Changes
 * composer (force a settlement up or down one size tier, a DM override of the
 * organic growth-and-decline drift). Only the legal move(s) appear: promotion is
 * hidden at the metropolis cap, demotion at the thorp floor.
 *
 * This is the picker half of the old standalone "Settlement Size" Workshop card,
 * folded into the event dropdown so a tier shift is authored, previewed, and staged
 * exactly like every other change. The companion clampTierDirection() hands the
 * composer the matching direction to assemble into the staged SHIFT_TIER event, so
 * the dropdown selection and the built event always agree (the SHIFT_TIER handler is
 * itself a no-op at the cap/floor, so a replayed-out-of-bounds shift is harmless).
 */

import { TIER_ORDER, popToTier } from '../../../data/constants.js';
import { selectStyle } from './EventComposerConstants.js';
import { Field } from './Field.jsx';

const cap = (/** @type {string} */ s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function tierBounds(settlement) {
  const tier = settlement?.tier || settlement?.config?.tier || popToTier(Number(settlement?.population) || 0);
  const idx = TIER_ORDER.indexOf(tier);
  return {
    nextTier: idx >= 0 && idx < TIER_ORDER.length - 1 ? TIER_ORDER[idx + 1] : null,
    prevTier: idx > 0 ? TIER_ORDER[idx - 1] : null,
  };
}

/** The direction clamped to a move the current tier can actually make. */
export function clampTierDirection(settlement, tierDirection) {
  const { nextTier, prevTier } = tierBounds(settlement);
  return tierDirection === 'demotion'
    ? (prevTier ? 'demotion' : 'promotion')
    : (nextTier ? 'promotion' : 'demotion');
}

export function EventComposerTierField({ settlement, tierDirection, setTierDirection }) {
  const { nextTier, prevTier } = tierBounds(settlement);
  const tierDir = clampTierDirection(settlement, tierDirection);
  return (
    <Field
      label="Direction"
      hint={tierDir === 'demotion'
        ? 'Resettles population down a band; institutions it can no longer support are left as ruined remnants.'
        : 'Resettles population up a band and raises the institutions the larger tier sustains.'}
    >
      <select value={tierDir} onChange={e => setTierDirection(e.target.value)} style={selectStyle}>
        {nextTier && <option value="promotion">Promote to {cap(nextTier)}</option>}
        {prevTier && <option value="demotion">Demote to {cap(prevTier)}</option>}
      </select>
    </Field>
  );
}
