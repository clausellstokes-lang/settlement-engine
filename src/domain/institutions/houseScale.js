/**
 * institutions/houseScale.js — A HOUSE'S RUNG ON ITS OWN LADDER, read from the catalogue's one home for scale
 * (UPKEEP-CAPACITY C1; the chair's ruling B on docs/chair/2026-11-13/UPKEEP-CAPACITY-MEASURE.md).
 *
 * The owner (2026-11-13): "tier or size/capacity should also be calculated for defense. A single alchemist should
 * not have the same influence as an alchemist district". A house's scale is its rung on the ladder of the SAME
 * function at several scales — `institutionLadders.js :: UPGRADE_CHAINS`, the catalogue's family ladders unioned
 * with the authored cross-family pairs — restricted to the houses that do the job being asked about. This file
 * holds NO table of names: every name it compares is the catalogue's own, and it compares them by identity
 * (case-insensitive equality), never by keyword.
 *
 * WHAT "THE JOB" IS, the caller says: `jobsOf(house)` answers which jobs one house does, alone. The ladder of a job
 * is the pairs of UPGRADE_CHAINS whose two names both do it, so a house that does a job on no such pair (the fish
 * market among the markets) stands on a ladder of one rung. A house's rung is its depth on that ladder (1 = no
 * lesser name does the job) and `of` is the ladder's top depth. Measured: on 3,756 births every house stands on the
 * rung its ladder writes at the place's own tier (probes/UPKEEP-CAPACITY/measure2.txt).
 *
 * Pure: no randomness, no clock, no store. The ladders of one `jobsOf` are derived once and kept by its identity.
 */
import { UPGRADE_CHAINS } from '../../data/institutionLadders.js';
import { institutionalCatalog } from '../../data/institutionalCatalog.js';
import { nativeSemanticName } from '../content/customContentSemanticAuthority.js';

/** @typedef {{ rung: number, of: number }} HouseRung */
/** @typedef {(house: unknown) => ReadonlyArray<string>} JobsOf */

/** @type {WeakMap<JobsOf, Map<string, Map<string, HouseRung>>>} */
const LADDERS = new WeakMap();

/** @param {unknown} house @returns {string} */
const keyOf = (house) => nativeSemanticName(house).toLowerCase();

/**
 * Every job's ladder: job → (lowered catalogue name → its rung). Derived once per `jobsOf`.
 * @param {JobsOf} jobsOf
 * @returns {Map<string, Map<string, HouseRung>>}
 */
function laddersOf(jobsOf) {
  const known = LADDERS.get(jobsOf);
  if (known) return known;
  /** @type {Map<string, Set<string>>} */
  const jobsByName = new Map();
  for (const name of new Set(UPGRADE_CHAINS.flat())) jobsByName.set(name.toLowerCase(), new Set(jobsOf({ name })));
  /** @type {Map<string, Map<string, HouseRung>>} */
  const out = new Map();
  const jobs = new Set([...jobsByName.values()].flatMap((s) => [...s]));
  for (const job of jobs) {
    const doing = (/** @type {string} */ n) => jobsByName.get(n.toLowerCase())?.has(job) === true;
    const edges = UPGRADE_CHAINS.filter(([lesser, greater]) => doing(lesser) && doing(greater))
      .map(([lesser, greater]) => [lesser.toLowerCase(), greater.toLowerCase()]);
    const names = [...new Set(edges.flat())];
    /** @type {Map<string, number>} */
    const depth = new Map();
    /** @param {string} n @param {Set<string>} seen @returns {number} */
    const depthOf = (n, seen) => {
      if (depth.has(n)) return /** @type {number} */ (depth.get(n));
      if (seen.has(n)) return 1;
      seen.add(n);
      const lessers = edges.filter(([, g]) => g === n).map(([l]) => l);
      const d = lessers.length ? 1 + Math.max(...lessers.map((l) => depthOf(l, new Set(seen)))) : 1;
      depth.set(n, d);
      return d;
    };
    // One ladder per connected run of pairs: its top depth is the `of` of every name on it.
    /** @type {Map<string, string>} */
    const root = new Map(names.map((n) => [n, n]));
    /** @param {string} n @returns {string} */
    const find = (n) => { let r = n; while (root.get(r) !== r) r = /** @type {string} */ (root.get(r)); return r; };
    for (const [l, g] of edges) root.set(find(l), find(g));
    /** @type {Map<string, number>} */
    const top = new Map();
    for (const n of names) top.set(find(n), Math.max(top.get(find(n)) ?? 0, depthOf(n, new Set())));
    out.set(job, new Map(names.map((n) => [n, Object.freeze({ rung: depthOf(n, new Set()), of: /** @type {number} */ (top.get(find(n))) })])));
  }
  LADDERS.set(jobsOf, out);
  return out;
}

/**
 * THE ONE READER: for each job any house on the roster does, the rung of every house doing it (a house on no
 * ladder of that job stands on a ladder of one rung). The caller reads the house it wants (defence: the greatest).
 * @param {unknown} institutions the roster
 * @param {JobsOf} jobsOf which jobs one house does, alone; keep one function for the life of the module
 * @returns {Record<string, HouseRung[]>}
 */
export function houseRungsOf(institutions, jobsOf) {
  const ladders = laddersOf(jobsOf);
  /** @type {Record<string, HouseRung[]>} */
  const out = {};
  for (const house of Array.isArray(institutions) ? institutions : []) {
    const name = keyOf(house);
    for (const job of jobsOf(house)) {
      (out[job] ||= []).push(ladders.get(job)?.get(name) ?? Object.freeze({ rung: 1, of: 1 }));
    }
  }
  return out;
}

/**
 * THE RUNG A JOB'S LADDER WRITES AT A TIER (the counterfactual house, the chair's ruling on C1): the greatest rung of
 * the job's ladders whose catalogue name is written at that tier; where none is written there (a watch at a thorp),
 * the least rung. A house no roster holds, read from the same ladder: e.g. "the same place with a watch in its stead"
 * is the place's own tier's watch (a village's Village watch, a city's Professional city watch).
 * @param {string} job @param {string} tier @param {JobsOf} jobsOf
 * @returns {HouseRung}
 */
export function jobRungAtTier(job, tier, jobsOf) {
  const ladder = laddersOf(jobsOf).get(job);
  if (!ladder || !ladder.size) return Object.freeze({ rung: 1, of: 1 });
  /** @type {Record<string, Record<string, unknown>>} */
  const shelves = Object.hasOwn(institutionalCatalog, tier) ? institutionalCatalog[tier] : {};
  const written = new Set(Object.values(shelves).flatMap((rows) => Object.keys(rows || {}).map((n) => n.toLowerCase())));
  const at = [...ladder.entries()].filter(([n]) => written.has(n)).map(([, r]) => r);
  if (at.length) return at.reduce((a, r) => ((r.rung - 1) / (r.of - 1) > (a.rung - 1) / (a.of - 1) ? r : a));
  const all = [...ladder.values()];
  return Object.freeze({ rung: 1, of: Math.max(...all.map((r) => r.of)) });
}
