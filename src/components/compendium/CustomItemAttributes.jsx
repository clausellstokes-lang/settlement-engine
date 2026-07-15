/**
 * CustomItemAttributes.jsx — leaf module for the saved-item "detail sheet".
 *
 * Extracted so BOTH the authoring manager (CustomContent.jsx) and the premium
 * upsell preview (CustomContentGate.jsx) can render it without the two files
 * importing each other — that mutual import was a fresh ESM cycle (see
 * tests/architecture/importCycles.test.js). A leaf with no sibling imports
 * breaks the cycle.
 */
import { swatch } from '../theme.js';
import {
  CRITICALITY, ECONOMIC_WEIGHT, DEFENSE_ROLES, POWER_AUTHORITIES, TRADE_CATEGORIES,
  DEITY_ALIGNMENT, DEITY_TEMPER, DEITY_TIER, DEITY_LAW,
} from '../../domain/customContentSchema.js';
import { Tag } from './primitives.jsx';

// Resolve a stored enum key to its human label for the detail view.
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
  if (item.rankAxis) chips.push({ label: `Rank · ${keyLabel(DEITY_TIER, item.rankAxis).split(':')[0]}`, color: '#7a5a1a' });
  if (item.lawAxis) chips.push({ label: `Law · ${keyLabel(DEITY_LAW, item.lawAxis).split(':')[0]}`, color: '#7a5a1a' });
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
