/**
 * domain/ai/groundingManifest.js — the CLIENT authority for THE TOTAL-GROUNDING LAW
 * (Surveyor S3 parley, DESIGN_AI_CONTROL_SURFACE §2d).
 *
 * The persona slice a parley posts must be a SUPERSET of the entity's engine-consumer
 * census — "any mechanism that begins reading an entity class automatically feeds its
 * voice." This module names the required manifest keys per entity class (the client mirror
 * of parleyCore.TOTAL_GROUNDING_MANIFEST — a cross-check pin proves they never drift) and
 * ties the PERSON facets back to the ONE enumerable engine-consumer census that exists in
 * the tree: NPC_FACET_KINDS (the no-dead-facet walker's denominator, consumed in reverse).
 *
 * PURITY / BUDGET: pure, no side effects, lazy-only (rides the parley panel chunk) — zero
 * eager bytes. Emits only key strings — never content.
 */

import { NPC_FACET_KINDS } from '../npc/npcBank.js';

/** The person facets a parley must carry for an NPC — the reverse-consumed no-dead-facet
 *  census. Sourced FROM NPC_FACET_KINDS so a facet added to the bank automatically becomes
 *  a required persona facet (the parity can never silently under-cover). */
export const PERSON_FACET_KEYS = Object.freeze([...NPC_FACET_KINDS]); // ['alignment','temperament','role','goal']

/** The §2d manifest — faction/power, fogged hegemony, rulings, deity/doctrine, economy,
 *  season, the NPC web, and the reframe stance on the asker. Applies to every entity class. */
export const MANIFEST_KEYS = Object.freeze([
  'faction', 'hegemony', 'rulings', 'deity_doctrine', 'economy', 'season', 'npc_web', 'reframes',
]);

/**
 * The manifest keys a persona of `entityClass` must cover. An NPC carries the person facets
 * PLUS the manifest; a settlement/faction carries the manifest only (no personal traits).
 * @param {'npc'|'settlement'|'faction'} entityClass
 * @returns {string[]}
 */
export function requiredManifestKeys(entityClass) {
  return entityClass === 'npc'
    ? [...PERSON_FACET_KEYS, ...MANIFEST_KEYS]
    : [...MANIFEST_KEYS];
}
