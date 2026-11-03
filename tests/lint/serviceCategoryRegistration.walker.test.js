/**
 * serviceCategoryRegistration.walker.test.js — THE SERVICE-CLASSIFIER
 * REGISTRATION RATCHET (structural-prevention Pattern 2; M5 of the F-SURVEY-1
 * classifier-coverage micro-wave, chair-ruled 2026-08-09 against the SAFE-HOUSE
 * RECON row's silent-fallthrough finding).
 *
 * THE CLASS: AN UNREGISTERED SERVICE NAME NEVER REDS. `classifyService`
 * (src/generators/services/serviceClassifier.js) consults the explicit
 * SERVICE_CATEGORY_MAP first; on a miss it runs a ~30-branch keyword ternary
 * over the lowercased service AND institution name and terminates at
 * `INSTITUTION_DEFAULT_CATEGORY[instName] || 'equipment'`. There is no throw
 * path and no default-case alarm, so a service name the catalog gained
 * yesterday is filed by keyword accident today and the only symptom is a
 * settlement that lists a smuggling tunnel under Equipment. Until this file
 * landed, `SERVICE_CATEGORY_MAP` and `classifyService` appeared NOWHERE in
 * tests/ — the classifier had no guard of any kind.
 *
 * THE GUARD: this walker DERIVES, from the live modules, the classifier's
 * complete input domain — every (institution, service) pair the authored
 * catalog can produce — and asserts every service name is EITHER
 *   (a) REGISTERED — an explicit SERVICE_CATEGORY_MAP row, the authoritative
 *       and host-independent answer, OR
 *   (b) QUARANTINED — named in HEURISTIC_UNREGISTERED below, the exact
 *       inventory of the names that ride the keyword ternary unverified today.
 * A NEW catalog service name that is neither reds here, forcing its author to
 * register it or to add it to the quarantine consciously.
 *
 * ⛔ THE QUARANTINE IS DEBT, NOT AN ALLOWLIST, AND IT IS SHRINK-ONLY. Every row
 * is a service whose category nobody has ever checked. Registering one and
 * deleting its row is the only permitted direction; the honesty arm reds if a
 * name is registered but left in the list, so a silent shrink is unavailable
 * too. (The idiom is ruinFilterRoster.walker.test.js's UNDISPOSITIONED
 * quarantine, and the reason is the same chair ruling: EXACT LEDGERS, NOT
 * CEILINGS — a bare count cap passes an identity swap at constant count.)
 *
 * NOTHING HERE IS HAND-TYPED. All three inventories were emitted from the live
 * modules by a derivation script and spliced as raw text. A list retyped from a
 * transcript is a list that has already drifted (derive-don't-restate).
 *
 * WHAT THE THREE LEDGERS ARE FOR, each a different direction of the same audit:
 *   • HEURISTIC_UNREGISTERED — corpus names with NO map row. The debt.
 *   • HOST_DEPENDENT_UNREGISTERED — the subset that folds to DIFFERENT
 *     categories at different hosts. This is the exact bug the SAFE-HOUSE wave
 *     fixed by registering 'Safe house': the identical name folded to `lodging`
 *     at an inn and `criminal` at a guild, because the classifier's
 *     `includes('inn')` branch preempts the criminal keywords. A name in this
 *     list is not merely unverified — it is provably inconsistent with itself,
 *     and registration is the cure. A NEW one reds.
 *   • REGISTERED_WITHOUT_PRODUCER — map rows no catalog institution can
 *     produce. These are the corpses of renamed services. They matter because a
 *     rename is silent on BOTH sides: the new spelling falls into the heuristic
 *     (caught by the quarantine arm) and the old row keeps asserting a category
 *     for a service that no longer exists (caught here). Together the two arms
 *     make a catalog rename loud.
 *
 * CANNOT-CATCH (this guard's stated evasion gaps):
 *   (a) CUSTOM CONTENT NEVER REACHES THE CLASSIFIER. A DM-authored service
 *       carries `source: 'custom'` and declares its own bounded category, and
 *       serviceRollMaterialization.js branches on that BEFORE calling
 *       classifyService. So the authored catalog genuinely is the classifier's
 *       total input domain — but if that branch is ever removed, custom names
 *       would start riding the heuristic and this walker would not see them.
 *   (b) WHETHER A REGISTERED CATEGORY IS *RIGHT*. This file proves a name was
 *       decided, never that it was decided well. `Sanctuary` sat registered as
 *       'healing' for the estate's whole life and was still wrong (see E6).
 *   (c) THE HEURISTIC'S OWN VERDICTS ARE NOT PINNED for the 651 quarantined
 *       names — only their host-CONSISTENCY is. (Discharged by RS-13, 2026-10-30:
 *       the quarantine is empty, every catalog name is registered, so the
 *       ternary no longer decides any catalog verdict.) Editing the ternary can re-fold
 *       any of them silently. Pinning 651 name→category verdicts was considered
 *       and deliberately deferred: it is a second instrument (a classifier
 *       golden) with a different maintenance contract, and the quarantine is
 *       meant to be burned down rather than frozen in place.
 *
 * TO COMPLY (new violation): add the service name to SERVICE_CATEGORY_MAP in
 * src/generators/services/serviceCategoryTables.js with the category its
 * authored `desc` actually describes. If you genuinely intend it to ride the
 * heuristic, add it to HEURISTIC_UNREGISTERED and raise no ceiling — the
 * ceilings below are monotone down. Never delete this guard to pass.
 */
import { describe, expect, test } from 'vitest';

import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import {
  INSTITUTION_SERVICES as INSTITUTION_SERVICES_VIA_GENERATOR_PATH,
} from '../../src/data/tradeGoodsData.js';
import {
  INSTITUTION_DEFAULT_CATEGORY,
  SERVICE_CATEGORY_MAP,
} from '../../src/generators/services/serviceCategoryTables.js';
import { classifyService } from '../../src/generators/services/serviceClassifier.js';
import { generateAvailableServices } from '../../src/generators/servicesGenerator.js';

/**
 * ⛔ THE HEURISTIC QUARANTINE — SHRINK-ONLY, EXACT IDENTITY BOTH DIRECTIONS.
 *
 * Every authored catalog service name with NO SERVICE_CATEGORY_MAP row: its
 * category today is whatever the ~30-branch keyword ternary happens to return.
 * Measured from the live modules at this landing; see the header for why it is
 * a ledger and not a count.
 *
 * EMPTY since RS-13 (chair ruling 2026-10-30): all 647 quarantined names were
 * registered in one derived splice (the classifier's verdict, except where the
 * chair's rulings RS-1..RS-12 re-filed a name). The ledger stays, empty, so a
 * new unregistered catalog name still reds in the arm below.
 */
const HEURISTIC_UNREGISTERED = Object.freeze([
]);

/**
 * ⚠⚠ PROVABLY SELF-INCONSISTENT — the subset of the quarantine that folds to a
 * DIFFERENT category depending on which institution hosts it. Each comment
 * records the verdicts measured at this landing. Registering the name in
 * SERVICE_CATEGORY_MAP makes it host-independent and removes it from BOTH this
 * list and the quarantine above.
 *
 * SHRINK-ONLY. A new host-dependent name means a catalog author gave an
 * existing service name to a second institution whose keywords pull the other
 * way — the Safe-house bug, re-minted.
 *
 * EMPTY since RS-13: the nine names (Caravan organization, Cargo inspection,
 * Civic administration, Combat instruction, Dispute resolution, Hospitality,
 * Information, Parcel forwarding, Secure communications) each have one home.
 */
const HOST_DEPENDENT_UNREGISTERED = Object.freeze([
]);

/**
 * ⚠ DEAD REGISTRATIONS — SHRINK-ONLY. SERVICE_CATEGORY_MAP rows that no
 * authored institution can produce. Each is either the corpse of a renamed
 * service or a registration written against a service that never shipped.
 * Harmless at runtime (an unreachable lookup), which is exactly why they
 * accumulate; they are inventoried so a catalog rename cannot quietly add one.
 */
const REGISTERED_WITHOUT_PRODUCER = Object.freeze([
  "Animal hire (daily)",
  "Anonymous deposit",
  "Arcane services (illicit)",
  "Armed patrol",
  "Auction services",
  "Automated labour",
  "Barber services",
  "Bodyguard hire",
  "Bookmaking on all events",
  "Cantrips and minor magic",
  "Caravan escort (armed)",
  "Cargo assembly",
  "Cargo handling",
  "Charcoal",
  "Child placement",
  "Coal",
  "Combat training",
  "Contract negotiation",
  "Creature components",
  "Curse removal (claimed)",
  "Customs clearance",
  "Debt enforcement",
  "Diplomatic access",
  "Discreet meeting venues",
  "Document copying",
  "Donkey purchase",
  "Draft horse purchase",
  "Dressed stone",
  "Emergency muster",
  "Exhibition bouts",
  "Extraplanar goods",
  "Farriery",
  "Fence (word of mouth)",
  "Firewood (seasoned)",
  "Fish prices (market rate)",
  "Games of chance (all kinds)",
  "Garrison contract",
  "Gem appraisal",
  "High-stakes gambling",
  "Hired muscle",
  "Horse purchase",
  "Horse stabling",
  "Horse training",
  "Import/export permits",
  "Institutional lending",
  "International finance",
  "Investigation services",
  "Investment banking",
  "Iron ore",
  "Magical entertainment",
  "Magical references",
  "Message delivery",
  "Mount hire (daily)",
  "Mule purchase",
  "Musical education",
  "No law, bring coin",
  "Patrol and watch",
  "Peat fuel",
  "Performances (events)",
  "Planar services",
  "Post horse hire",
  "Prisoner holding",
  "Protection (informal)",
  "Public announcements",
  "Quality leather",
  "Quarried stone",
  "Reading aloud",
  "Rumour and news",
  "Saddlery leather",
  "Salt for preservation",
  "Sea salt",
  "Ship repair",
  "Siege specialists",
  "Soft cheese",
  "Stabling (long-term)",
  "Training services",
  "Vessel hire",
  "Watch rotation",
]);

/**
 * MONOTONE-DOWN LITERALS. Hand-written ceilings, never `list.length` — a
 * ceiling derived from the list it caps proves list == list (the
 * self-referential pin class) and rises silently with every row added.
 * You may burn these; you may never pad them.
 */
const UNREGISTERED_CEILING = 0;
const HOST_DEPENDENT_CEILING = 0;
const ORPHAN_REGISTRATION_CEILING = 78;

/** Floors on the discovered population: a walker that stops discovering is a disabled guard. */
const CORPUS_NAME_FLOOR = 800;
const CORPUS_PAIR_FLOOR = 900;
const MAP_ROW_FLOOR = 250;

/**
 * The classifier's complete input domain, derived from the authored catalog.
 * @returns {{ pairs: Array<{ institution: string, service: string, category: string }>,
 *             byName: Map<string, Map<string, string>> }}
 */
function discoverClassifierDomain() {
  const pairs = [];
  const byName = new Map();
  for (const [institution, defs] of Object.entries(INSTITUTION_SERVICES)) {
    for (const service of Object.keys(defs)) {
      const category = classifyService(service, institution);
      pairs.push({ institution, service, category });
      if (!byName.has(service)) byName.set(service, new Map());
      byName.get(service).set(institution, category);
    }
  }
  return { pairs, byName };
}

/** The eleven buckets, taken from the REAL producer rather than restated here. */
function liveBucketNames() {
  return Object.keys(generateAvailableServices('town', [], {}, {}, null));
}

describe('service-classifier registration ratchet (structural-prevention Pattern 2)', () => {
  const { pairs, byName } = discoverClassifierDomain();
  const mapKeys = Object.keys(SERVICE_CATEGORY_MAP);

  test('the walker measures the SAME catalog object the generator reads', () => {
    // The generator imports INSTITUTION_SERVICES from data/tradeGoodsData.js, which
    // re-exports it from data/institutionServices.js. If that re-export is ever
    // replaced by a second literal, this walker would audit a catalog nobody
    // generates from — a guard measuring the wrong estate reads as clean forever.
    expect(INSTITUTION_SERVICES_VIA_GENERATOR_PATH).toBe(INSTITUTION_SERVICES);
  });

  test('the scan discovers a real corpus (non-vacuous)', () => {
    expect(pairs.length).toBeGreaterThanOrEqual(CORPUS_PAIR_FLOOR);
    expect(byName.size).toBeGreaterThanOrEqual(CORPUS_NAME_FLOOR);
    expect(mapKeys.length).toBeGreaterThanOrEqual(MAP_ROW_FLOOR);
  });

  test('classifyService is TOTAL over the corpus — every pair lands in a real bucket', () => {
    // A TOTAL POSITIVE PREDICATE, deliberately not an enumeration of known-bad
    // categories: an enumeration on the credit side fails open, greening any
    // category nobody thought to list. The bucket set comes from the producer.
    const buckets = new Set(liveBucketNames());
    expect(buckets.size).toBe(11);
    const strays = pairs
      .filter((p) => !buckets.has(p.category))
      .map((p) => `${p.service} @ ${p.institution} -> ${JSON.stringify(p.category)}`);
    expect(strays).toEqual([]);
    // RS-13 (chair ruling 2026-10-30): the bare `|| 'equipment'` sink is reached by no
    // catalog pair, because every menu-bearing institution has a default row of its own.
    const noDefault = Object.keys(INSTITUTION_SERVICES)
      .filter((institution) => !INSTITUTION_DEFAULT_CATEGORY[institution]);
    expect(noDefault).toEqual([]);
    const strayDefaults = Object.entries(INSTITUTION_DEFAULT_CATEGORY)
      .filter(([, category]) => !buckets.has(category))
      .map(([institution, category]) => `${institution} -> ${category}`);
    expect(strayDefaults).toEqual([]);
  });

  test('every catalog service name is REGISTERED or QUARANTINED', () => {
    const quarantined = new Set(HEURISTIC_UNREGISTERED);
    const violations = [];
    for (const service of [...byName.keys()].sort()) {
      if (service in SERVICE_CATEGORY_MAP) continue;
      if (quarantined.has(service)) continue;
      const hosts = [...byName.get(service).entries()]
        .map(([i, c]) => `${c} @ ${i}`).join(' | ');
      violations.push(
        `${JSON.stringify(service)}: a catalog service with no SERVICE_CATEGORY_MAP row. `
        + `The keyword heuristic currently files it as ${hosts}.\n`
        + '  Register it in src/generators/services/serviceCategoryTables.js with the '
        + 'category its authored desc describes (the authoritative, host-independent '
        + 'answer), or add it to HEURISTIC_UNREGISTERED in this file if it is genuinely '
        + 'meant to ride the heuristic. Never delete the guard to pass.',
      );
    }
    expect(violations).toEqual([]);
    // RS-1..RS-11 (chair rulings 2026-10-30): the re-filed verdicts the owner and the
    // census named, driven through the REAL function at the real host, so a silent
    // revert of any one reds. The full set is the derived registration; these are its
    // load-bearing witnesses, one or two per ruling.
    const ruled = [
      ['Fresh fish retail', 'Fish market', 'food'], // RS-1, the owner's sighting
      ['Fresh fish', 'Fishmonger', 'food'], // RS-1, a registered row re-filed
      ['Grain grinding', 'Mills (2-5)', 'food'], // RS-1, was the bare sink
      ['General trade', 'Weekly market', 'equipment'], // RS-2, markets to Goods & Crafts
      ['Civic administration', 'City administration', 'legal'], // RS-3
      ['Gated entry', 'Palisade or earthworks', 'legal'], // RS-3, one home for gatekeeping
      ['Law enforcement', 'Professional city watch', 'legal'], // RS-3
      ['Last refuge', 'Citadel', 'employment'], // RS-4
      ['Standing question', 'Listening post', 'information'], // RS-5, 'quest' in "question"
      ['Commissioned maps', "Cartographer's guild", 'information'], // RS-5, behind the guild arm
      ['Horse change', 'Coaching inn', 'transport'], // RS-6, the false metropolis absence
      ['Parcel forwarding', 'Post relay station', 'transport'], // RS-6, 'ward' in "forwarding"
      ['Recovery wards', 'Major hospital', 'healing'], // RS-7
      ['Hospitality', 'Monastery or friary', 'lodging'], // RS-8
      ['Discreet passage', 'Underground network', 'criminal'], // RS-9, the recorded mis-fold
      ['Escort contracts', 'Free company hall', 'employment'], // RS-10, 'contract'
      ['Rune inscription', "Enchanter's shop", 'magic'], // RS-11
      ['Political power', 'Craft guilds (100-150+)', 'legal'], // RS-10 reading confirmed
      // the chair's follow-up rulings on the lane's report (same signed shift)
      ['Patrol service', 'City walls and gates', 'legal'],
      ['Curfew enforcement', 'Gates (if walled)', 'legal'],
      ['Smuggling investigation', 'Customs house', 'legal'],
      ['Black market access', 'Inn/Tavern District', 'criminal'],
      ['Gambling', 'Inn/Tavern', 'entertainment'],
    ];
    const wrong = ruled
      .filter(([service, host, category]) => classifyService(service, host) !== category)
      .map(([service, host, category]) => `${service} @ ${host}: ${classifyService(service, host)} (ruled ${category})`);
    expect(wrong).toEqual([]);
  });

  test('⛔ quarantine honesty: the list is EXACT — an un-banked registration reds too', () => {
    // Audited in BOTH directions, which is what stops the quarantine becoming a
    // second, softer allowlist:
    //   • a row now REGISTERED is a WIN, and it reds here until it is banked —
    //     a quarantine that silently keeps stale rows stops meaning anything;
    //   • a row the catalog no longer produces is a rename or a deletion, and it
    //     reds so the ledger cannot describe an estate that no longer exists;
    //   • a NEW unregistered name never reaches this list at all — it reds in the
    //     REGISTERED-or-QUARANTINED arm above, which is the whole point.
    const stale = [];
    for (const service of HEURISTIC_UNREGISTERED) {
      if (!byName.has(service)) {
        stale.push(`${JSON.stringify(service)}: no catalog institution produces this name any more (renamed/deleted) — delete its quarantine row`);
      } else if (service in SERVICE_CATEGORY_MAP) {
        stale.push(`${JSON.stringify(service)}: now registered in SERVICE_CATEGORY_MAP — delete its quarantine row (bank the win)`);
      }
    }
    expect(stale).toEqual([]);
    expect(new Set(HEURISTIC_UNREGISTERED).size).toBe(HEURISTIC_UNREGISTERED.length);
    // anchored: the exactness assertion above proves the list was walked against
    // the live catalog, so the ceiling below caps a REAL population.
    expect(
      HEURISTIC_UNREGISTERED.length,
      'the heuristic quarantine may only shrink — register names, never widen the ceiling',
    ).toBeLessThanOrEqual(UNREGISTERED_CEILING);
  });

  test('⚠⚠ host-dependence: the self-inconsistent set is EXACT and shrink-only', () => {
    const declared = new Set(HOST_DEPENDENT_UNREGISTERED);
    const live = [];
    for (const service of [...byName.keys()].sort()) {
      if (service in SERVICE_CATEGORY_MAP) continue;
      if (new Set(byName.get(service).values()).size > 1) live.push(service);
    }
    const missing = live.filter((s) => !declared.has(s)).map((service) => {
      const hosts = [...byName.get(service).entries()]
        .map(([i, c]) => `${c} @ ${i}`).join(' | ');
      return `${JSON.stringify(service)}: the SAME service name folds to different categories `
        + `depending on its host (${hosts}) — the Safe-house bug re-minted. Register it in `
        + 'SERVICE_CATEGORY_MAP to make it host-independent.';
    });
    expect(missing).toEqual([]);
    const stale = HOST_DEPENDENT_UNREGISTERED
      .filter((s) => !live.includes(s))
      .map((s) => `${JSON.stringify(s)}: no longer host-dependent (registered, renamed, or its second host left) — delete its row (bank the win)`);
    expect(stale).toEqual([]);
    expect(
      HOST_DEPENDENT_UNREGISTERED.length,
      'the host-dependent set may only shrink',
    ).toBeLessThanOrEqual(HOST_DEPENDENT_CEILING);
  });

  test('⚠ dead registrations: map rows with no producer are EXACT and shrink-only', () => {
    const declared = new Set(REGISTERED_WITHOUT_PRODUCER);
    const live = mapKeys.filter((k) => !byName.has(k)).sort();
    const missing = live
      .filter((k) => !declared.has(k))
      .map((k) => `${JSON.stringify(k)}: SERVICE_CATEGORY_MAP registers a category for a service `
        + 'no authored institution produces. If a catalog service was renamed, the NEW spelling is '
        + 'now riding the heuristic — register that instead and delete this row.');
    expect(missing).toEqual([]);
    const stale = REGISTERED_WITHOUT_PRODUCER
      .filter((k) => byName.has(k) || !(k in SERVICE_CATEGORY_MAP))
      .map((k) => `${JSON.stringify(k)}: has a producer again, or its map row is gone — delete its dead-registration row (bank the win)`);
    expect(stale).toEqual([]);
    expect(
      REGISTERED_WITHOUT_PRODUCER.length,
      'dead registrations may only shrink',
    ).toBeLessThanOrEqual(ORPHAN_REGISTRATION_CEILING);
  });

  /**
   * ⭐ THE E6 DISCLOSED-SHIFT PIN (F-S1-E6, chair-ruled 2026-08-09).
   *
   * Sanctuary shipped registered as 'healing'. Its authored desc at Church/Temple
   * is "Legal protection on holy ground" and at both cathedrals "the ancient right
   * of refuge" — a legal immunity claimed on consecrated ground, not medical care.
   * The re-map to 'legal' was the ONE authorized behaviour shift of this wave.
   *
   * MEASURED AT THE LANDING: 0 of the 525 golden-master rows carry Sanctuary
   * (Church/Temple is a dead resolution key; both cathedral rows are `on: false`),
   * so a full-corpus object regeneration and field-by-field deep diff moved ZERO
   * rows and ZERO fields. No golden was re-recorded, and none was owed. The same
   * instrument was proven sensitive first by a negative control that moved exactly
   * the 16 rows it was predicted to.
   *
   * This pin exists so a silent revert to 'healing' reds instead of passing.
   */
  test('E6: Sanctuary is LEGAL at every host, and host-independently so', () => {
    expect(SERVICE_CATEGORY_MAP.Sanctuary).toBe('legal');
    const hosts = [...(byName.get('Sanctuary')?.keys() ?? [])];
    expect(hosts.length).toBeGreaterThanOrEqual(3);
    // Drive the REAL function at every host, not just the table it reads.
    for (const host of hosts) {
      expect(classifyService('Sanctuary', host), `Sanctuary @ ${host}`).toBe('legal');
    }
  });

  /**
   * M5's one repaired mis-fold. `Hideout rental` is Outlaw shelter's flagship
   * service ("Secure hiding place for fugitives. Paid in advance.") and folded to
   * 'equipment'; its own sibling `Underground contacts` already folded 'criminal'.
   * It carries 0 of 525 golden rows, so the repair measured dark on the corpus —
   * the reason it is the only one of the three recorded mis-folds fixed here.
   */
  test('M5: Hideout rental is CRIMINAL at Outlaw shelter', () => {
    expect(SERVICE_CATEGORY_MAP['Hideout rental']).toBe('criminal');
    expect(classifyService('Hideout rental', 'Outlaw shelter')).toBe('criminal');
  });
});
