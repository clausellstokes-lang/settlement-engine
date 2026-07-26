/**
 * CustomItemAttributes.jsx — leaf module for the saved-item "detail sheet".
 *
 * Extracted so the authoring manager (CustomContent.jsx) and the premium upsell
 * preview (CustomContentGate.jsx) could render it without the two files
 * importing each other — that mutual import was a fresh ESM cycle (see
 * tests/architecture/importCycles.test.js). The Gate does not render it today,
 * so CustomContent.jsx is the only importer; the leaf shape stays because it
 * keeps the manager under the component-size ratchet.
 */
import { MUTED as MUT, SECOND as SEC, FS, swatch } from '../theme.js';
import {
  CRITICALITY, ECONOMIC_WEIGHT, DEFENSE_ROLES, FOOD_IMPACT, POWER_AUTHORITIES,
  TRADE_CATEGORIES,
} from '../../domain/customContentSchema.js';
import { getCustomContentField } from '../../domain/content/customContentManifest.js';
import { Tag } from './primitives.jsx';

// These older arrays decorate admitted values with established copy. They do
// not decide which values are valid; that remains the manifest's job.
const ENUM_LABELS = new Map([
  ...CRITICALITY,
  ...ECONOMIC_WEIGHT,
  ...DEFENSE_ROLES,
  ...FOOD_IMPACT,
  ...POWER_AUTHORITIES,
].map(option => [option.key, option.label]));

function humanize(value) {
  return String(value || '')
    .split('-')
    .map(word => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
}

function enumLabel(bucket, field, value) {
  const admitted = getCustomContentField(bucket, field)?.values;
  if (!admitted?.includes(value)) return 'Unrecognized setting';
  return ENUM_LABELS.get(value) || humanize(value);
}

function tradeCategoryLabel(value) {
  return TRADE_CATEGORIES.find(option => option.key === value)?.label || value;
}

/**
 * CustomItemAttributes — the post-creation "detail sheet" for a saved custom
 * item, mirroring how the prebuilt catalog surfaces an object's properties.
 * Renders only the attributes the author actually set, as labelled chips, so a
 * saved item reads like a real compendium entry rather than just a name + blurb.
 *
 * Enum-ish attributes become chips; the two free-text faction attributes (agenda,
 * methods) become labelled prose lines beneath them — a sentence does not fit in
 * a tag. This is the consumer the manifest declares for factions.agenda and
 * factions.methods (schema/custom-content.manifest.json), pinned by
 * tests/domain/customContentConsumerEvidence.walker.test.js.
 */
export function CustomItemAttributes({ item, bucket }) {
  const chips = [];
  if (item.essential === true) {
    chips.push({ label: 'Essential', color: '#1a4a20' });
  }
  if (item.magical === true) {
    chips.push({ label: 'Magical', color: swatch.magic });
  }
  if (item.criminal === true) {
    chips.push({ label: 'Criminal', color: '#8b1a1a' });
  }
  if (item.authority) {
    chips.push({
      label: `Authority · ${enumLabel(bucket, 'authority', item.authority)}`,
      color: '#1a3a7a',
    });
  }
  if (item.defenseRole) {
    chips.push({
      label: `Defense · ${enumLabel(bucket, 'defenseRole', item.defenseRole)}`,
      color: '#8b1a1a',
    });
  }
  if (item.criticality) {
    chips.push({
      label: enumLabel(bucket, 'criticality', item.criticality),
      color: '#a0762a',
    });
  }
  if (item.economicWeight) {
    chips.push({
      label: enumLabel(bucket, 'economicWeight', item.economicWeight),
      color: '#1a5a28',
    });
  }
  if (item.foodImpact) {
    chips.push({
      label: `Food · ${enumLabel(bucket, 'foodImpact', item.foodImpact)}`,
      color: '#7a5010',
    });
  }
  if (item.satisfies) {
    chips.push({
      label: `Trade category · ${tradeCategoryLabel(item.satisfies)}`,
      color: '#7c3aed',
    });
  }
  if (item.archetype) {
    chips.push({ label: `Archetype · ${item.archetype}`, color: '#6a1a4a' });
  }
  if (item.scale) {
    chips.push({
      label: `Scale · ${enumLabel(bucket, 'scale', item.scale)}`,
      color: '#6a1a4a',
    });
  }
  if (item.severity) {
    chips.push({
      label: `Severity · ${enumLabel(bucket, 'severity', item.severity)}`,
      color: '#8b1a1a',
    });
  }
  // Deity axes — moral / order / rank / domain (never the derived temper). Use
  // compact labels for valid manifest keys, not raw legacy tokens.
  if (item.alignmentAxis) {
    chips.push({
      label: `Moral · ${enumLabel(bucket, 'alignmentAxis', item.alignmentAxis)}`,
      color: '#7c3aed',
    });
  }
  if (item.lawAxis && item.lawAxis !== 'neutral') {
    chips.push({
      label: `Order · ${enumLabel(bucket, 'lawAxis', item.lawAxis)}`,
      color: '#7c3aed',
    });
  }
  if (item.rankAxis) {
    chips.push({
      label: `Rank · ${enumLabel(bucket, 'rankAxis', item.rankAxis)}`,
      color: '#435463',
    });
  }
  if (item.domain) {
    chips.push({ label: `Domain · ${item.domain}`, color: '#7a5010' });
  }
  if (item.tierMin || item.tierMax) {
    const tierMin = item.tierMin
      ? enumLabel(bucket, 'tierMin', item.tierMin)
      : 'Any';
    const tierMax = item.tierMax
      ? enumLabel(bucket, 'tierMax', item.tierMax)
      : '∞';
    chips.push({ label: `Tiers · ${tierMin}–${tierMax}`, color: '#6b5340' });
  }
  // Faction prose — what the faction wants and how it pursues it. Authored as
  // free text, so these read as labelled lines under the chips rather than as
  // tags. Until this landed they were the only faction fields the saved card
  // stored and never showed anywhere.
  const prose = [
    ['Agenda', item.agenda],
    ['Methods', item.methods],
  ].filter(([, text]) => typeof text === 'string' && text.trim());
  if (!chips.length && !prose.length) return null;
  return (
    <>
      {chips.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 6 }}>
          {chips.map(chip => (
            <Tag key={chip.label} label={chip.label} color={chip.color} />
          ))}
        </div>
      )}
      {prose.map(([label, text]) => (
        <div key={label} style={{ fontSize: FS.xs, color: SEC, lineHeight: 1.4, marginTop: 6 }}>
          <span style={{
            fontSize: FS.micro, fontWeight: 700, color: MUT, marginRight: 5,
            textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>{label}</span>
          {text.trim()}
        </div>
      ))}
    </>
  );
}
