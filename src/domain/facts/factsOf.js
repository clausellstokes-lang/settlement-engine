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
import { waterOf } from './water.js';
import { marketOf } from './market.js';
import { famineOf } from './famine.js';
import { magicOf } from './magic.js';
import { rulerKindOf } from './rulerKind.js';
import { migrationOf } from './migration.js';
import { warStateOf } from './warState.js';
import { hasInstitution } from './institutions.js';
import { populationBandOf } from './populationBand.js';
import { terrainClassOf } from './terrain.js';
import { hasOtherNpc } from './otherNpc.js';

/**
 * @param {any} record a settlement record
 * @param {{ worldStressors?: ReadonlyArray<unknown> | null, settlementId?: unknown, worldState?: unknown, regionalGraph?: unknown }} [options]
 *   the world, for the two facts a lone record cannot answer whole (the crisis's pulse stressors,
 *   the war state)
 */
export function factsOf(record, options = {}) {
  return Object.freeze({
    /** fact 1: the crisis kinds, families and the one siege reading */
    get crisis() { return crisisOf(record, options); },
    /** fact 2: the months of food in store (number | null) */
    get storesMonths() { return storesMonthsOf(record); },
    /** fact 3: walls / gate / watch / militia / garrison / hospital / healer */
    get defence() { return defenceOf(record); },
    /** fact 4: water a boat or a net could use */
    get water() { return waterOf(record); },
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
    /** fact 12: small / middling / large */
    get populationBand() { return populationBandOf(record); },
    /** fact 13: the terrain class */
    get terrain() { return terrainClassOf(record); },
    /** fact 14: a second, named NPC beside this one */
    hasOtherNpc: (/** @type {number | object} */ npc) => hasOtherNpc(record, npc),
  });
}
