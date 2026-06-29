/**
 * domain/institutions/institutionCatalog.js — build the "addable institutions"
 * list: the full institutional catalog (every tier) plus the user's Compendium
 * institutions, minus whatever the settlement already has.
 *
 * Shared by the Settlement Editor's roster and the Make Changes composer's
 * catalog-backed ADD_INSTITUTION event, so the two can't drift apart.
 *
 * Pure: no store, no React, no I/O.
 */

import { institutionalCatalog } from '../../data/institutionalCatalog.js';

/**
 * @param {Array<any>} institutions  institutions already present
 * @param {Array<any>} customInstitutions     Compendium institutions
 * @returns {Array<{ id:string, name:string, category:string, tierKey?:string,
 *   desc:string, tags:string[], def?:Object, isCustom?:boolean, alreadyAdded:boolean }>}
 */
export function buildInstitutionCatalog(institutions = [], customInstitutions = []) {
  const existing = new Set((institutions || []).map(i => i.name));
  const items = [];
  const seen = new Set();

  // Every tier of the built-in catalog.
  for (const [tierKey, tierData] of Object.entries(institutionalCatalog || {})) {
    for (const [cat, entries] of Object.entries(tierData || {})) {
      for (const [name, def] of Object.entries(entries || {})) {
        if (seen.has(name)) continue;
        seen.add(name);
        items.push({
          id: name, name, category: cat, tierKey,
          desc: def.desc || '', tags: def.tags || [],
          def, alreadyAdded: existing.has(name),
        });
      }
    }
  }

  // Custom institutions from the Compendium.
  for (const ci of (customInstitutions || [])) {
    if (seen.has(ci.name)) continue;
    seen.add(ci.name);
    items.push({
      id: ci.id, name: ci.name, category: ci.category || 'Custom',
      desc: ci.description || '',
      tags: typeof ci.tags === 'string' ? ci.tags.split(',').map((/** @type {any} */ t) => t.trim()) : (ci.tags || []),
      isCustom: true, alreadyAdded: existing.has(ci.name),
    });
  }

  return items.filter(i => !i.alreadyAdded).sort((a, b) => a.name.localeCompare(b.name));
}
