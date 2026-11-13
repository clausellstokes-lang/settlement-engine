// src/data/defenceWeights.js — EVERY NUMBER DEFENCE USES, ONE HOME (COHERENCE-UPKEEP-5, V3 with the
// chair's R13 and R14; docs/chair/2026-11-13/UPKEEP-DEFENCE-PARTS.md, the addendum's weight table).
//
// `DEFENCE_TUNING` holds the numbers, frozen; `DEFENCE_WEIGHT_REASONS` holds each row's one-line
// reason, keyed by the same row names (tests/generators/defenceParts.test.js holds the two key sets
// equal), so the numbers stay a table of numbers the tuning register can unit, and every row says
// why. `DEFENCE_WORDS` holds every part's label and source as the record and the Defense tab print
// them. The values are the measured V3 (each the owner's to veto); nothing here is tuned anew.
//
// Points are on a score's 0..100 scale (military `mil`, monsters `mon`, order `int`, supply `sup`,
// magic `mag`); readiness points are a score's points divided by the number of scores the world has.
// No import. Pure data.

export const DEFENCE_TUNING = Object.freeze({
  walls: Object.freeze({ mil: 30, mon: 20 }),
  wallKind: Object.freeze({ stone: 1, palisade: 0.6 }),
  houseScale: Object.freeze({ least: 0.8, greatest: 1.2 }), // UPKEEP-CAPACITY C1 (the chair's ruling B): a house counts by its rung on its own ladder
  garrison: Object.freeze({ mil: 28, mon: 20, int: 15 }),
  militia: Object.freeze({ mil: 10, mon: 12, int: 8 }),
  watch: Object.freeze({ mil: 7, int: 18 }),
  court: Object.freeze({ int: 20 }),
  prison: Object.freeze({ int: 15 }),
  wardens: Object.freeze({ mon: 12 }),
  company: Object.freeze({ mil: 14, contract: 4 }),
  charter: Object.freeze({ mil: 10, mon: 35, int: 5 }),
  dial: Object.freeze({ mil: 0.35, int: 0.25, intNoLaw: 0.04, none: 0.06, hiredExtra: 0.29 }),
  neighbour: Object.freeze({ hostile: 1.2, rival: 1.2, cold_war: 1.18, tense: 1.1, allied: 0.92, trade_partner: 0.96 }),
  community: Object.freeze({
    remoteness: Object.freeze({ isolated: 8, road: 4, other: 2 }),
    arms: Object.freeze({ thorp: 6, hamlet: 8, village: 10 }),
    close: Object.freeze({ thorp: 18, hamlet: 14, village: 10 }),
    parishMil: 3, parishInt: 8, eldersMil: 3, eldersInt: 6,
  }),
  arcane: Object.freeze({
    mil: 10, milPerDial: 0.25, milMax: 15, tower: 5, guild: 8,
    mon: 15, monPerDial: 0.2, monMax: 10, intFrom: 50, intPerDial: 0.16, intMax: 8,
  }),
  clergy: Object.freeze({ mon: 18, intFrom: 60, intPerDial: 0.25, intMax: 10, blessing: 6, blessingFrom: 70 }),
  druids: Object.freeze({ mon: 12 }),
  traditionsMonsterMax: 35,
  traditionGates: Object.freeze({ arcane: 35, arcaneGuild: 55, divine: 55, divineShrine: 65, divineStrong: 65, druid: 30, alchemy: 15 }),
  stores: Object.freeze({ firstMonth: 10, toSixMonths: 7, sixMonths: 6, afterSix: 4, max: 70, granaryMonths: 4, noGranaryMonths: 1 }),
  market: Object.freeze({ sup: 10 }),
  hospital: Object.freeze({ sup: 10, mon: 5 }),
  alchemists: Object.freeze({ sup: 8 }),
  purse: Object.freeze({ sup: 20 }),
  sea: Object.freeze({ sup: 10 }),
  crossroads: Object.freeze({ sup: 8 }),
  threat: Object.freeze({
    folk: Object.freeze({ plagued: 8, frontier: 4 }),
    plaguedCountry: -15,
    penalty: Object.freeze({ plagued: 15, frontier: 7 }), // readiness points
  }),
  terrain: Object.freeze({ mountain: 1.28, hills: 1.18, forest: 1.12, riverside: 1.06, coastal: 1.02 }),
  crime: Object.freeze({ int: 0.4 }),
  size: Object.freeze({ thorp: 12, hamlet: 8, village: 4, town: 2 }),
  floors: Object.freeze({ mil: 0.6, mon: 0.7, int: 0.65, sup: 0.45, mag: 0.45, disaster: 0.55 }),
  chains: Object.freeze({ provisioned: 5, unprovisioned: -5, masons: 6, unmended: -4, foodWorking: 5, foodBroken: -8 }),
  crises: Object.freeze({
    under_siege: Object.freeze({ crime: 1.25, sup: 25, int: 15, teleportFrom: 65, teleportEco: 0.4, guildFrom: 50, guildInt: 0.53, strongInt: 0.53, druidFrom: 40, druidEco: 0.72 }),
    famine: Object.freeze({ crime: 1.35, sup: 20, mil: 10, int: 20, mon: 8, druidFrom: 30, druidEco: 0.4, druidMil: 0.5, druidMon: 0.5, divineEco: 12, divineMil: 6, arcaneFrom: 50, arcaneEco: 15, alchemyEco: 3 }),
    occupied: Object.freeze({ crime: 0.6, mil: 35, int: 20 }),
    plague_onset: Object.freeze({ crime: 1.2, mil: 15, sup: 15, divineMil: 0.33, divineEco: 0.53, alchemyMil: 8, alchemyEco: 10, arcaneFrom: 50, arcaneMil: 10 }),
    succession_void: Object.freeze({ mil: 15, int: 20 }),
    politically_fractured: Object.freeze({ int: 20 }),
    recently_betrayed: Object.freeze({ crime: 1.15, int: 10, mil: 10 }),
    indebted: Object.freeze({ crime: 1.2, sup: 15, mil: 10 }),
    infiltrated: Object.freeze({ int: 15, mil: 8 }),
    monster_pressure: Object.freeze({ mon: 20, mil: 5, arcaneFrom: 40, arcaneMon: 0.25, divineMon: 0.4, druidMon: 0.5 }),
    wartime: Object.freeze({ sup: 15 }), // COHERENCE-UPKEEP-6 (C, R16): war drains what sustains a town; the starting weight, for the owner's veto. No crime row (ruling 3).
    // COHERENCE-UPKEEP-6 (ruling 3): the crises with no defence row but a crime effect, at the size it had.
    insurgency: Object.freeze({ crime: 1.25 }),
    mass_migration: Object.freeze({ crime: 1.18 }),
    religious_conversion: Object.freeze({ crime: 1.22 }),
    slave_revolt: Object.freeze({ crime: 1.3 }),
  }),
});

/**
 * R2's counterfactual, as roster flags laid over the place's own (the owner's rule: a hired-only place
 * never reads above the same place with a watch in its hired force's stead).
 */
export const WATCH_IN_STEAD = Object.freeze({ hasMercenary: false, hasCharterHall: false, hasWatch: true });

/** Each weight row's one-line reason (the addendum's weight table), keyed as DEFENCE_TUNING. */
export const DEFENCE_WEIGHT_REASONS = Object.freeze({
  walls: 'the largest built defence; holds against raiders and beasts alike',
  wallKind: 'a stone wall at its full value; a palisade counts for less (the roster\'s "Palisade or earthworks", and any earthwork, reads as a palisade; the starting weight, for the owner\'s veto)',
  houseScale: 'a house counts by its rung on its own ladder (the catalogue\'s scale tiers of the same function): the least rung at `least`, the greatest at `greatest`, evenly between, the middle at today\'s points; a one-rung ladder at 1; a part reads its greatest house (the owner: "a single alchemist should not have the same influence as an alchemist district"; the chair\'s ruling B)',
  garrison: 'a standing professional force; it also keeps order',
  militia: 'citizens under arms: less than soldiers, good against beasts',
  watch: 'a police force first',
  court: 'law that is heard',
  prison: 'law that is enforced',
  wardens: 'rangers: beast lore and tracking',
  company: 'half a standing force, bought (more with a working contract chain)',
  charter: 'bounty work against beasts above all',
  dial: 'how far the town puts itself to arms (the slider), held to the armed bodies that carry it (R13)',
  neighbour: 'a hostile neighbour sharpens a town\'s will to arms (R14)',
  community: 'the unpaid defence of a small place',
  arcane: 'retained casters',
  clergy: 'turning the dead, compelled truth, a battle blessing',
  druids: 'beast lore',
  traditionsMonsterMax: 'one job, counted once (R2)',
  traditionGates: 'a tradition opens only where the world\'s dial carries it',
  stores: 'diminishing returns on months laid by',
  market: 'supply bought and sold in the town',
  hospital: 'medicine for the wounded and the sick',
  alchemists: 'preservation of the grain',
  purse: 'what the town can spend in a crisis (R6)',
  sea: 'a land siege cannot cut the sea',
  crossroads: 'many roads in',
  threat: 'the land\'s own dangers',
  terrain: 'the ground strengthens what is built and stands',
  crime: 'crime works against order',
  size: 'a small place is easier to hold',
  floors: 'unpaid soldiers desert slowly, never at once',
  chains: 'what the economy keeps working',
  crises: 'today\'s points, with today\'s relief by faith, druids, arcana and alchemy; each acts once, on the parts it touches; war drains the stores, the purse and the market (R16); a crisis row\'s `crime` is what it does to crime, at the size the crime reading gave it (ruling 3), and war has none',
});

/**
 * Every part's words, as the record stores them and the Defense tab prints them (the owner's to
 * veto). `label` is the part's name; `source` names its one home.
 */
export const DEFENCE_WORDS = Object.freeze({
  walls: { label: 'Walls', source: 'roster' },
  masons: { label: 'Masons at work on the defences', source: 'supply chains' },
  unmended: { label: 'Defences going unmended', source: 'supply chains' },
  garrison: { label: 'Garrison', source: 'roster' },
  militia: { label: 'Militia', source: 'roster' },
  watch: { label: 'Watch', source: 'roster' },
  court: { label: 'Court', source: 'roster' },
  prison: { label: 'Prison', source: 'roster' },
  wardens: { label: 'Wardens', source: 'roster' },
  will: { label: 'Martial will', source: 'military dial (config) and neighbour' },
  company: { label: 'Hired company', source: 'roster + contract chain' },
  charter: { label: 'Adventurers\' charter', source: 'roster' },
  households: { label: 'Armed households', source: 'tier' },
  parish: { label: 'Parish as rallying point', source: 'roster' },
  elders: { label: 'Elders and reeve', source: 'roster' },
  close: { label: 'Close-knit self-policing', source: 'tier' },
  arcane: { label: 'Arcane practitioners', source: 'roster + magic dial' },
  clergy: { label: 'Clergy', source: 'roster + religion dial' },
  druids: { label: 'Druids', source: 'roster + magic dial' },
  stores: { label: 'Stores', source: 'stores months (food record)' },
  alchemists: { label: 'Alchemists preserving the grain', source: 'roster' },
  hospital: { label: 'Healing (hospital)', source: 'roster' },
  market: { label: 'Market', source: 'roster' },
  purse: { label: 'The purse', source: 'standing label' },
  foodWorking: { label: 'Food processing working', source: 'supply chains' },
  foodBroken: { label: 'Food processing broken', source: 'supply chains' },
  provisioned: { label: 'Provisions for the force: supplied', source: 'supply chains' },
  unprovisioned: { label: 'Provisions for the force: short', source: 'supply chains' },
  magic: { label: 'Magic (wards, healing, countermagic)', source: 'magic presence (roster, magic dial)' },
  remoteness: { label: 'Remoteness (alarm and flight)', source: 'route' },
  sea: { label: 'Sea supply', source: 'route' },
  crossroads: { label: 'Many roads in', source: 'route' },
  folk: { label: 'Folk used to beasts', source: 'threat' },
  plaguedCountry: { label: 'Plagued country', source: 'threat' },
  crime: { label: 'Crime', source: 'criminal reading' },
  terrain: { label: 'Terrain', source: 'terrain' },
  size: { label: 'Size: a small place is easier to hold', source: 'tier' },
  danger: { label: 'Threat: the land\'s own dangers', source: 'threat' },
  willHeld: { label: 'Martial will held to the armed bodies that carry it', source: 'rule (R13)' },
  wallsUnmanned: { label: 'Walls with no one to man them', source: 'rule (limit 2)' },
  sustainsHeld: { label: 'Stores and supply can carry no more than the force can use', source: 'rule (limit 1)' },
  full: { label: 'more than enough, held in reserve', source: 'rule (fullness)' },
  floor: { label: 'below nothing, brought to nothing', source: 'rule (fullness)' },
  scaleTop: { label: 'Readiness full', source: 'rule (the scale\'s top)' },
  scaleBottom: { label: 'Readiness at nothing', source: 'rule (the scale\'s bottom)' },
  rounding: { label: 'Rounded to the whole point the page prints', source: 'rule (the printed figure)' },
  scores: { mil: 'Military', mon: 'Beasts', int: 'Order', sup: 'Supply', mag: 'Magic' },
});
