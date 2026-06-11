/**
 * domain/stressorPicker.js — ONE stressor vocabulary for every picker.
 *
 * Two stressor catalogs grew up independently:
 *   - STRESS_TYPE_MAP (data/stressTypes.js): the GENERATION vocabulary —
 *     15 settlement-stress types (under_siege, plague_onset, ...) with rich
 *     crisis hooks. The Roster's stressor section picked from this alone.
 *   - STRESSOR_CATALOG (worldPulse/stressors.js): the CAMPAIGN vocabulary —
 *     20 roaming types (siege, disease_outbreak, ... rebellion, market_shock,
 *     criminal_corridor, magical_instability, coup_detat).
 *
 * The drift meant rebellion / market_shock / criminal_corridor /
 * magical_instability (and now coup_detat) were UNPICKABLE anywhere — the
 * world pulse could birth them but a DM could never author one. This module
 * is the union: generation types first (their hooks are richer), then the
 * campaign-only types, then the user's custom stressors — deduped through
 * the alias map so "under_siege" and "siege" never both appear.
 *
 * Pure data assembly; no store, no React.
 */

import { STRESS_TYPE_MAP } from '../data/stressTypes.js';
import { STRESSOR_CATALOG } from './worldPulse/stressors.js';
import { canonStressors } from './canonicalAccessors.js';

/**
 * Generation-time stress key → roaming world-pulse type. Used to dedupe the
 * union and to register the matching ROAMING stressor when an authored
 * stressor event lands inside a canon campaign.
 */
export const GEN_TO_PULSE_TYPE = Object.freeze({
  under_siege: 'siege',
  famine: 'famine',
  occupied: 'occupation',
  politically_fractured: 'political_fracture',
  indebted: 'indebtedness',
  recently_betrayed: 'betrayal',
  infiltrated: 'infiltration',
  plague_onset: 'disease_outbreak',
  succession_void: 'succession_void',
  monster_pressure: 'monster_raider_pressure',
  insurgency: 'insurgency',
  religious_conversion: 'religious_conversion_fracture',
  slave_revolt: 'slave_revolt',
  wartime: 'wartime',
  mass_migration: 'mass_migration',
});

/** The roaming type an authored stressor key maps to (identity for campaign-only types). */
export function pulseTypeForStressorKey(key) {
  if (!key) return null;
  if (GEN_TO_PULSE_TYPE[key]) return GEN_TO_PULSE_TYPE[key];
  return STRESSOR_CATALOG[key] ? key : null;
}

function pulseDesc(def) {
  const systems = (def.affectedSystems || [])
    .slice(0, 3)
    .map(s => String(s).replace(/_/g, ' '))
    .join(', ');
  return `Campaign crisis${systems ? ` — pressures ${systems}` : ''}.`;
}

/**
 * Every stressor a DM can author, as CatalogPicker items
 * ({ id, key, name, category, desc, isCustom?, severity?, pulseType }).
 *
 * @param {any[]} [existingStresses]  the settlement's current stress entries (filtered out)
 * @param {any[]} [customStressors]   customContent.stressors
 */
export function buildStressorPickerItems(existingStresses = [], customStressors = []) {
  // Callers pass the raw stress container, and legacy saves store a single
  // stressor as a bare OBJECT (stressGenerator returns one entry un-wrapped) —
  // canonStressors normalizes both shapes to an array.
  const existing = new Set(
    canonStressors({ stressors: existingStresses }).map(s => s?.type).filter(Boolean),
  );
  const items = [];

  for (const [key, def] of Object.entries(STRESS_TYPE_MAP)) {
    if (existing.has(key)) continue;
    items.push({
      id: key,
      key,
      name: def.label || key,
      category: 'Settlement',
      desc: def.crisisHook || def.viabilityNote || '',
      pulseType: GEN_TO_PULSE_TYPE[key] || null,
    });
  }

  const covered = new Set(Object.values(GEN_TO_PULSE_TYPE).map(String));
  for (const [type, def] of Object.entries(STRESSOR_CATALOG)) {
    if (covered.has(type) || existing.has(type)) continue;
    items.push({
      id: type,
      key: type,
      name: def.label || type,
      category: 'Campaign',
      desc: pulseDesc(def),
      pulseType: type,
    });
  }

  for (const cs of customStressors || []) {
    if (!cs?.name || existing.has(cs.name)) continue;
    items.push({
      id: cs.id || cs.localUid || cs.name,
      key: cs.name,
      name: cs.name,
      category: 'Custom',
      desc: cs.description || '',
      isCustom: true,
      severity: cs.severity,
      pulseType: null,
    });
  }

  return items.sort((a, b) => a.name.localeCompare(b.name));
}
