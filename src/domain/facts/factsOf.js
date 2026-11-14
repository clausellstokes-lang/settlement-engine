/**
 * domain/facts/factsOf.js — ONE FACT, ONE HOME (CENSUS-1 wave 0; `docs/DESIGN_POOL_CENSUS.md` §1).
 *
 * `factsOf(record).<fact>` is the one answer to each atomic fact a drawn line may presume. Every
 * getter reads the record AS IT IS NOW (the live roster, the current crisis container): nothing
 * is cached, so a late write is seen by the next read, which is what the birth self-check
 * (`cert:false-presumption`, wave 1) re-asserts against the FINAL record.
 *
 * Each fact's logic lives in its own module beside this one; this file only names them. A
 * competing reader elsewhere in the tree is retired TO the module (a re-export shim where the
 * old name is imported widely), never re-implemented beside it. Climate and season have no
 * record field and so no home (the chair's ruling 8).
 *
 * Pure: no randomness, no clock, no write.
 */
import { crisisOf } from './crisisKind.js';
import { storesMonthsOf } from './storesMonths.js';
import { defenceOf } from './defence.js';
import { waterOf, waterOfKind } from './water.js';
import { marketOf } from './market.js';
import { famineOf } from './famine.js';
import { magicOf } from './magic.js';
import { rulerKindOf } from './rulerKind.js';
import { migrationOf } from './migration.js';
import { warStateOf } from './warState.js';
import { hasInstitution } from './institutions.js';
import { populationBandOf } from './populationBand.js';
import { terrainClassOf, tradeRouteOf } from './terrain.js';
import { hasOtherNpc } from './otherNpc.js';
import { faithReadingOf } from '../dossier/faithReading.js';
import { guildOf } from './guild.js';
import { canonExports, canonImports } from '../canonicalAccessors.js';
import { resolveSettlementCulture } from '../resolveCulture.js';
import { deriveCriminalStructure } from '../display/defenseDisplay.js';
import { prosperityLabelOf } from '../prosperityRank.js';
import { keepOf } from './keep.js';

/**
 * The two fields `factsOf` reads itself (every other fact is its home's own reading of the record).
 * @typedef {{
 *   tier?: unknown,
 *   economicState?: { prosperity?: unknown, foodSecurity?: { foodRecord?: { foodSources?: unknown } | null } | null } | null,
 * } | null | undefined} FactsOwnFields
 */

/**
 * @param {{} | null | undefined} record a settlement record (any value: each home reads it defensively)
 * @param {{ worldStressors?: ReadonlyArray<unknown> | null, settlementId?: unknown, worldState?: unknown, regionalGraph?: unknown, waterKind?: 'maritime'|'river'|'none' }} [options]
 *   the world, for the two facts a lone record cannot answer whole (the crisis's pulse stressors,
 *   the war state); and, for a birth IN PROGRESS whose partial record carries no terrain yet,
 *   `waterKind` — the generation world law's `portKind`, the same `waterAccessKind` rule
 *   (CENSUS-1c unit 1)
 */
export function factsOf(record, options = {}) {
  return Object.freeze({
    /** fact 1: the crisis kinds, families and the one siege reading */
    get crisis() { return crisisOf(record, options); },
    /** fact 2: the months of food in store (number | null) */
    get storesMonths() { return storesMonthsOf(record); },
    /** fact 3: walls / gate / watch / militia / garrison / hospital / healer */
    get defence() { return defenceOf(record); },
    /** the ONE composite (the vocabulary rulings §3): watch ∨ garrison ∨ militia ∨ hired company */
    get guardPresence() { const d = defenceOf(record); return d.watch || d.garrison || d.militia || d.mercenary; },
    /** the rulings §2 (CENSUS-1c, R-E): soldiers = a garrison or a hired company (`forceWordsOf`'s `soldiers`) */
    get soldiers() { const d = defenceOf(record); return d.garrison || d.mercenary; },
    /** the rulings §2 (CENSUS-1c, R-E): someone commands a garrison (`defenseFactsOf.hasCommander`) */
    get commander() { return defenceOf(record).commander; },
    /** the rulings §2 (CENSUS-1c, R-E): the ONE faith reading (`dossier/faithReading.js :: faithReadingOf`) */
    get faith() { return faithReadingOf(record); },
    /** fact 4: water a boat or a net could use */
    get water() { return options.waterKind ? waterOfKind(options.waterKind) : waterOf(record); },
    /** fact 5: a live market */
    get market() { return marketOf(record); },
    /** fact 6: the one starving rule */
    get famine() { return famineOf(record); },
    /** fact 7: magic functions; its level */
    get magic() { return magicOf(record); },
    /** fact 8: elder / lord / priest / mayor / occupier / council */
    get rulerKind() { return rulerKindOf(record); },
    /** fact 9: the mass migration's direction */
    get migration() { return migrationOf(record); },
    /** fact 10: front / aggressor / at war / peace */
    get warState() { return warStateOf(record, options); },
    /** fact 11: a live institution of a kind */
    hasInstitution: (/** @type {string} */ kind) => hasInstitution(record, kind),
    /** R-AE (CENSUS-1f): THE ONE composite sacred house — a temple-kind house (church, cathedral, shrine, chapel, abbey) ∨ a monastery-kind house (monastery, friary), as the roster names them; `temple` stays narrow */
    get sacredHouse() { return hasInstitution(record, 'temple') || hasInstitution(record, 'monastery'); },
    /** CENSUS-4b (the chair's answer 4): a live non-criminal guild on the roster ∨ a guild power (`guild.js`) */
    get guild() { return guildOf(record); },
    /** fact 12: small / middling / large */
    get populationBand() { return populationBandOf(record); },
    /** fact 13: the terrain class */
    get terrain() { return terrainClassOf(record); },
    /** fact 13: the trade-route kind (the terrain home's second reader) */
    get route() { return tradeRouteOf(record); },
    /** the tier (a field; the vocabulary's `tier` band) */
    get tier() { return typeof /** @type {FactsOwnFields} */ (record)?.tier === 'string' ? /** @type {{ tier: string }} */ (record).tier : undefined; },
    /** fact 14: a second, named NPC beside this one */
    hasOtherNpc: (/** @type {number | object} */ npc) => hasOtherNpc(record, npc),
    // ── CENSUS-3b unit 1 (the chair's ruling R-E; the vocabulary rulings §2): DELEGATIONS to the
    // one canonical reader each — no field reader, no new logic. ──
    /** the food record's sources (`foodBalance.js :: deriveFoodRecord`), or undefined when it carries none */
    get foodSources() { const v = /** @type {FactsOwnFields} */ (record)?.economicState?.foodSecurity?.foodRecord?.foodSources; return Array.isArray(v) ? v : undefined; },
    /** the import list (`canonicalAccessors.js :: canonImports`) */
    get imports() { return canonImports(record); },
    /** the export list (`canonicalAccessors.js :: canonExports`) */
    get exports() { return canonExports(record); },
    /** the culture key (`resolveCulture.js :: resolveSettlementCulture`) */
    get culture() { return resolveSettlementCulture(record); },
    /** the criminal structure (`defenseDisplay.js :: deriveCriminalStructure`): its key, or 'none' */
    get crime() { return deriveCriminalStructure(record)?.key ?? 'none'; },
    /** the prosperity band (`prosperityRank.js :: prosperityLabelOf`), lower-cased, or undefined */
    get prosperity() { const l = prosperityLabelOf(/** @type {FactsOwnFields} */ (record)?.economicState?.prosperity).toLowerCase(); return l || undefined; },
    /** what the place can keep up (`keep.js :: keepOf`), read off the prosperity label: `{ bought, funded }` */
    get keep() { return keepOf(/** @type {FactsOwnFields} */ (record)?.economicState?.prosperity); },
  });
}

/**
 * THE FACTS OF A BIRTH IN PROGRESS (CENSUS-1c unit 2): a draw site inside the pipeline holds a
 * partial record — the roster, the config, the tier — and the world law. The crisis home reads
 * `stress` entries (`canonStressors`), so the config's `stressTypes` are handed in that shape; the
 * water home takes the world law's `portKind` (the same `waterAccessKind` rule). The self-check
 * (`cert:false-presumption`) re-asserts every declared atom against the FINAL record, so a fact a
 * later step changes is caught by name.
 * `powerStructure` (CENSUS-4d, R-V): a site drawn after the power step hands ONLY the parts
 * measured as settled at its draw — the NPC goal site hands `{ government }`, so the ruler kind
 * reads (0 of 585 births differ between `generatePopulation` and birth, CENSUS-4c); the factions
 * are not settled there (the density law can empty a guild faction later), so they are not
 * handed. Absent, the record carries none, as before.
 * @param {{ institutions?: unknown, config?: { stressTypes?: unknown, tier?: unknown } | null, tier?: unknown, stress?: unknown, powerStructure?: unknown }} [partial]
 * @param {{ portKind?: 'maritime'|'river'|'none' } | null} [worldLaw]
 */
export function birthFactsOf(partial = {}, worldLaw = null) {
  const config = partial.config || {};
  const stress = partial.stress ?? (Array.isArray(config.stressTypes) ? config.stressTypes.map((/** @type {unknown} */ type) => ({ type })) : []);
  return factsOf({ institutions: partial.institutions, config, tier: partial.tier ?? config.tier, stress, powerStructure: partial.powerStructure }, worldLaw?.portKind ? { waterKind: worldLaw.portKind } : {});
}
