#!/usr/bin/env node
/**
 * scripts/taste-measure.mjs — THE TASTE'S GATE (TASTE car M-7; the brief's nine measures).
 *
 * WHAT IT IS. The writing workflow calls this after EVERY round, on every arm, and reads its
 * JSON. It is the only thing standing between a wording set and the sitting, so it is written
 * to the estate's own rule: every figure comes from an instrument that already exists and is
 * already plant-convicted, nothing here re-implements a rule that lives somewhere else, and a
 * measure whose input is absent says NOT-EXECUTABLE rather than answering zero.
 *
 * THE NINE MEASURES, in the brief's own order:
 *   (a) the projection — `generate-dossier-state-prose.mjs --taste --check`, and the waivers
 *       it took, printed;
 *   (b) the COMPOSED WALK — exhaustive over the seven pools' units, plus the SAMPLED walk at
 *       N with its sha, N set from the measured per-unit cost and a stated confidence;
 *   (c) the MANIFEST and the CLASSIFIER against a base cells table: every affected cell
 *       ADDITIVE, and a REPLACED or RE-INDEXED cell is a STOP;
 *   (d) the VARIETY corpus's duplicate-unit rate, before and after;
 *   (e) per variant — length in words against the band, the four faces' sibling distance and
 *       their band position against the exemplar median;
 *   (f) the TIE RATE under the comparator;
 *   (g) the PROVENANCE move count and arm A13's verdicts;
 *   (h) the per-set ROUND COUNTERS, READ from the packet files and never written;
 *   (i) ONE TABLE per pool, and the machine-readable JSON beside it.
 *
 * ⛔ A POOL STILL CARRYING THE AUTHORING MARKER IS WITHHELD, BY NAME, AND ITS MEASURES ARE
 * NOT-EXECUTABLE. That is the harness's own honesty rule: an unwritten set must not read as a
 * clean one, and it must not read as a failing one either.
 *
 *   node scripts/taste-measure.mjs --arm draft --round 3
 *   node scripts/taste-measure.mjs --arm A --base <cells.json>
 *   node scripts/taste-measure.mjs --arm draft --variety 1     a cheap slice of measure (d)
 *
 * READ-ONLY except the JSON it writes at `$PACKETS/measure-<arm>.json`.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { estateGround, withEntryContext } from '../src/domain/prose/entryGround.js';
import {
  armA5, composedVerdictOf, provenanceCount, sampleOf, walkComposed,
} from '../src/domain/prose/composedWalker.js';
import { AUTHORING_MARKER } from './lib/dossier-annex-grammar.mjs';
import { fingerprint, RATE_METRICS, scoreAgainstBands } from '../src/domain/prose/proseFingerprint.js';
import { spineRows } from '../src/domain/prose/wiringCensus.js';
import { sourceOfForTown } from '../src/domain/prose/holderTable.js';
import { FACTION_ROLES } from '../src/generators/factionRoles.js';
import * as ROLE_CATALOG from '../src/generators/npc/factionRoleCatalog.js';
import { POWER_ROLES_BY_CATEGORY } from '../src/data/historyData.js';
import { ROLE_CATEGORY_KEYWORDS } from '../src/generators/roleCategory.js';
import { duplicateUnits, varietyConfigs } from '../tests/helpers/proseVarietyCorpus.js';
import { driftRun } from '../tests/helpers/dossierManifest.js';
import { classifyCells, diffLines } from './prose-manifest-diff.mjs';
import { TASTE_POOLS } from './prose-licence-card.mjs';
import { tasteTown, INTERESTED_TOWNS } from '../tests/fixtures/tasteTowns.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_RELATIONS } from '../src/data/dossierRelations.generated.js';
import { DOSSIER_PROSE_NORMS } from '../src/data/proseNorms.generated.js';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');

/**
 * ⭐ THE ESTATE'S OFFICE ROSTER, DERIVED FROM EVERY ROLE SOURCE and never transcribed — the
 * same derivation `proseComposed.walker.test.js` and `proseEntryContradiction.walker.test.js`
 * both make. It matters to every figure below: a first cut of the SEAM walker handed the
 * ground seven hand-written roles and the block re-walk then read 12 FAIL of 12 units, every
 * one of them arm C2 reporting an office the roster did not hold. A harness printing a number
 * it manufactured is the false green this file exists to refuse.
 * @returns {string[]}
 */
function deriveOfficeRoster() {
  /** @type {Set<string>} */
  const roles = new Set();
  for (const list of Object.values(FACTION_ROLES)) for (const entry of list) if (entry.role) roles.add(entry.role);
  for (const value of Object.values(ROLE_CATALOG)) {
    if (!Array.isArray(value)) continue;
    for (const entry of value) {
      if (entry?.role) roles.add(entry.role);
      if (entry?.title) roles.add(entry.title);
    }
  }
  for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) {
    if (!Array.isArray(rows)) continue;
    for (const entry of rows) {
      if (entry?.role) roles.add(entry.role);
      if (entry?.title) roles.add(entry.title);
    }
  }
  for (const list of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const keyword of list) roles.add(keyword);
  return [...roles].sort();
}
const SCRATCH = path.resolve(ROOT, '..');
/** Where the writers' packets live, and where the JSON is written. */
export const PACKETS = path.join(SCRATCH, 'taste');
/** The research kit's exemplar fingerprints, which never ship. */
export const EXEMPLAR_DIR = path.join(SCRATCH, 'prose-research/primary');

/**
 * ⭐ THE TEN LEAF EXEMPLAR REGISTERS the chair's three numbers were measured over
 * (`RULES-V2-PART-B.md` §16.1, leave-one-out over the ten). The aggregates beside them
 * (`leguin-all`, `martin`, `tolkien-all`, `leguin-nonfiction`) are UNIONS of these and are
 * excluded: a band built from a record and its own parent is not a leave-one-out band.
 */
export const EXEMPLAR_LEAVES = Object.freeze([
  'leguin-fiction', 'leguin-nonfiction-spoken', 'leguin-nonfiction-written',
  'martin-chronicle', 'martin-narrative', 'tolkien-elevated', 'tolkien-plain',
  'dnd-flavor', 'dnd-rules', 'dnd-rules-srd52',
]);

/**
 * ⭐ THE THREE NUMBERS AT THE ENTRY GRAIN (`RULES-V2-PART-B.md` §16.2, the chair's ruling).
 * A wording FACE is one entry, so the entry band is the one that governs it: BUDGET two
 * thirds of the soft rules measurable on it, DEPTH 1.75 band-widths outside on any one, and
 * the PERFECTION CEILING at every grain.
 */
export const ENTRY_NUMBERS = Object.freeze({ budgetShare: 2 / 3, depth: 1.75 });

/** @param {string} text @returns {string} */
const sha256 = (text) => createHash('sha256').update(text).digest('hex');
/** @param {string} text @returns {number} */
const words = (text) => String(text).trim().split(/\s+/).filter(Boolean).length;

/** The corpus, as one block map. */
const CORPUS = { ...DOSSIER_STATE_PROSE_DEFENSE, ...DOSSIER_STATE_PROSE_GENERAL };
const CENSUS = JSON.parse(readFileSync(path.join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const CENSUS_ROWS = new Map(spineRows(CENSUS.rows).map((r) => [`${r.block} :: ${r.pool}`, r]));
const ALL_ROWS = new Map(CENSUS.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));

// ── (e) THE EXEMPLAR BANDS ──────────────────────────────────────────────────────────

/** A nested fingerprint flattened onto the dotted RATE_METRICS paths. */
function flatten(fp) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const metric of RATE_METRICS) {
    const parts = metric.split('.');
    let at = fp;
    for (const part of parts) at = at === undefined || at === null ? undefined : at[part];
    if (typeof at === 'number') out[metric] = at;
  }
  return out;
}

/**
 * The bands and the MEDIAN per metric, from the ten leaves. NOT-EXECUTABLE where the kit is
 * not on the machine, because a band invented on the spot would be a licence nobody measured.
 * @param {string} dir
 */
export function exemplarBands(dir) {
  if (!existsSync(dir)) {
    return { bands: null, medians: null, why: `the exemplar fingerprints are not at ${dir}` };
  }
  /** @type {Record<string, Record<string, number>>} */
  const metrics = {};
  for (const label of EXEMPLAR_LEAVES) {
    const at = path.join(dir, `${label}.fingerprint.json`);
    if (!existsSync(at)) continue;
    metrics[label] = flatten(JSON.parse(readFileSync(at, 'utf8')));
  }
  const labels = Object.keys(metrics);
  if (labels.length < 3) {
    return { bands: null, medians: null, why: `only ${labels.length} exemplar leaves found in ${dir}` };
  }
  /** @type {Record<string, {lo: number, hi: number}>} */
  const bands = {};
  /** @type {Record<string, number>} */
  const medians = {};
  for (const metric of RATE_METRICS) {
    const values = labels.map((l) => metrics[l][metric]).filter((v) => typeof v === 'number').sort((a, b) => a - b);
    if (values.length !== labels.length) continue;
    bands[metric] = { lo: values[0], hi: values[values.length - 1] };
    const mid = Math.floor(values.length / 2);
    medians[metric] = values.length % 2 === 1 ? values[mid] : (values[mid - 1] + values[mid]) / 2;
  }
  return {
    bands, medians, labels, why: '',
  };
}

/**
 * One face's band position: which soft rules it exceeds, how deep, and how far it sits from
 * the exemplar MEDIAN of each band it is scored on.
 * @param {string} text
 * @param {{bands: object|null, medians: object|null}} exemplars
 */
export function bandPositionOf(text, exemplars) {
  if (!exemplars.bands) return { executable: false, why: exemplars.why };
  const fp = fingerprint([text]);
  const scored = scoreAgainstBands(fp.metrics, exemplars.bands);
  /** @type {Array<{metric: string, fromMedianBandWidths: number}>} */
  const distances = [];
  for (const metric of scored.scored) {
    const band = exemplars.bands[metric];
    const width = band.hi - band.lo;
    if (!(width > 0)) continue;
    distances.push({
      metric,
      fromMedianBandWidths: Math.round((Math.abs(fp.metrics[metric] - exemplars.medians[metric]) / width) * 1000) / 1000,
    });
  }
  const mean = distances.length
    ? Math.round((distances.reduce((n, d) => n + d.fromMedianBandWidths, 0) / distances.length) * 1000) / 1000
    : null;
  const deepest = scored.exceeded.slice().sort((a, b) => b.depth - a.depth)[0] || null;
  return {
    executable: true,
    sentences: fp.sentences,
    scored: scored.scored.length,
    exceeded: scored.exceeded.length,
    exceededShare: scored.scored.length
      ? Math.round((scored.exceeded.length / scored.scored.length) * 1000) / 1000 : null,
    deepest: deepest ? { metric: deepest.metric, depth: Math.round(deepest.depth * 1000) / 1000, side: deepest.side } : null,
    meanDistanceFromMedian: mean,
    budgetOk: scored.scored.length
      ? scored.exceeded.length <= Math.floor(scored.scored.length * ENTRY_NUMBERS.budgetShare) : null,
    depthOk: !deepest || deepest.depth <= ENTRY_NUMBERS.depth,
    perfectionSuspect: scored.scored.length > 0 && scored.exceeded.length === 0,
  };
}

// ── THE UNITS: the CARTESIAN composition of a modifier pool with its attach set ──────

/** The pool's variants, with their faces expanded (parent + wordings). */
function facesOf(variant) {
  return [variant.text, ...(Array.isArray(variant.wordings) ? variant.wordings : [])];
}

/**
 * ⭐ EVERY COMPOSED UNIT ONE MODIFIER POOL CAN PRODUCE: each spine of its attach set, times
 * each variant of that spine, times each variant of the pool, times each FACE of each.
 *
 * ⛔ THE ARRANGEMENT IS THE COMPOSER'S OWN RULE AND NOT THIS FILE'S GUESS. Every taste pool is
 * an `addition` at the SENTENCE seat, whose connective list holds exactly the EMPTY OPENER
 * (ARCH §4.5, E-F10), and `arrange` down-cases the modifier's first token only AFTER A
 * NON-EMPTY opener. So the unit is `spine + ' ' + modifier`, verbatim. `--check-arrangement`
 * drives the real composer on a real town and asserts this reproduces it.
 * @param {string} blockId
 * @param {string} poolKey
 * @returns {Array<object>} composed unit rows for the walker
 */
export function unitsOfPool(blockId, poolKey) {
  const block = CORPUS[blockId];
  const meta = block?.poolMeta?.[poolKey];
  const pool = block?.pools?.[poolKey] || [];
  /** @type {Array<object>} */
  const units = [];
  for (const spineKey of meta?.attach || []) {
    const spinePool = block.pools[spineKey] || [];
    for (const spine of spinePool) {
      for (const spineFace of facesOf(spine)) {
        for (const variant of pool) {
          for (const face of facesOf(variant)) {
            units.push({
              blockId,
              poolKey: spineKey,
              text: `${spineFace} ${face}`,
              pieces: [
                {
                  role: 'spine',
                  key: spineKey,
                  text: spineFace,
                  slots: spine.slots || [],
                  marks: spine.marks || [],
                },
                {
                  role: 'modifier',
                  key: poolKey,
                  text: face,
                  slots: variant.slots || [],
                  marks: variant.marks || [],
                  relation: meta.relation,
                  declaredRelation: meta.relation,
                  seat: meta.seat || 'sentence',
                },
              ],
            });
          }
        }
      }
    }
  }
  return units;
}

// ── (h) THE ROUND COUNTERS, READ AND NEVER WRITTEN ──────────────────────────────────

/**
 * The packet files a pool's writers have left, and nothing else. This function OPENS no packet
 * and writes none: the round count is a property of the directory listing.
 * @param {string} dir
 */
export function roundsOf(dir) {
  const at = path.join(PACKETS, dir);
  if (!existsSync(at)) return { draftRounds: 0, refineA: false, refineB: false, files: [] };
  const files = readdirSync(at).filter((f) => f.endsWith('.md')).sort();
  const draft = files.filter((f) => /^draft-round-\d+\.md$/.test(f))
    .map((f) => Number(f.replace(/\D+/g, '')));
  return {
    draftRounds: draft.length ? Math.max(...draft) : 0,
    rounds: draft.sort((a, b) => a - b),
    refineA: files.includes('refine-A.md'),
    refineB: files.includes('refine-B.md'),
    files,
  };
}

// ── (f) THE TIE RATE UNDER THE COMPARATOR ───────────────────────────────────────────

/**
 * ⭐ THE TIE RATE (ARCH §4.3, arm A4). Two candidates at one rung TIE when their salience
 * band is equal AND their seeded permutation hash is equal, at which point the comparator
 * falls to an ascending CODE-UNIT comparison of the key. A tie is not a defect — the law
 * resolves it deterministically — but its RATE is what says whether the seeded permutation is
 * doing any work at all, which is why §4.3 asks for it printed.
 *
 * ⛔ MEASURED ON THE REAL PAIRS AND NOT ON A SYNTHETIC DRAW. The only rungs that can carry two
 * candidates at this tip are DS-DEF-11's WALLED-* (the country pool and a watch pool) and
 * DS-DEF-2's disaster cell (the two stock pools, which are EXCLUSIVE and so can never both
 * fire). The measure walks the RATE grid's seeds over each such rung.
 * @param {ReadonlyArray<string>} seeds
 */
export function tieRate(seeds) {
  /** @type {Array<{at: string, keys: string[]}>} */
  const rungs = [];
  for (const { block, pool } of TASTE_POOLS) {
    const meta = CORPUS[block]?.poolMeta?.[pool];
    for (const spine of meta?.attach || []) {
      const seat = rungs.find((r) => r.at === `${block} :: ${spine}`);
      if (seat) seat.keys.push(pool); else rungs.push({ at: `${block} :: ${spine}`, keys: [pool] });
    }
  }
  const multi = rungs.filter((r) => r.keys.length > 1);
  let pairs = 0;
  let ties = 0;
  for (const rung of multi) {
    const [blockId, spineKey] = rung.at.split(' :: ');
    for (const seed of seeds) {
      for (let a = 0; a < rung.keys.length; a += 1) {
        for (let b = a + 1; b < rung.keys.length; b += 1) {
          pairs += 1;
          const key = (k) => `${seed}::${blockId}::${spineKey}::salience::${k}`;
          if (sha256(key(rung.keys[a])).slice(0, 8) === sha256(key(rung.keys[b])).slice(0, 8)) ties += 1;
        }
      }
    }
  }
  return {
    rungs: rungs.length,
    multiCandidateRungs: multi.length,
    pairs,
    ties,
    tieBp: pairs ? Math.round((ties / pairs) * 10000) : 0,
    note: multi.length === 0
      ? 'NOT-EXECUTABLE: no rung of the taste carries two candidates that can fire together'
      : '',
  };
}

// ── THE MEASURE ─────────────────────────────────────────────────────────────────────

/**
 * ⭐ N, SET FROM THE MEASURED PER-UNIT COST WITH ITS CONFIDENCE STATED (ARCH §6.1, X-F8).
 *
 * The sample exists to bound the arms' FIRE RATE, so N is chosen the way any proportion is:
 * the widest 95 % normal-approximation half-width is at p = 0.5, where it is
 * `1.96 * sqrt(0.25 / N)`. At N = 384 that half-width is 5.0 percentage points, which is the
 * resolution the sitting reads an arm's rate at. The measured per-unit COST decides whether
 * the sample is needed at all: if the exhaustive walk costs less than a second, N is the whole
 * population and the sample buys nothing — which is the honest answer at this tip and the one
 * SEAM car 5 predicted.
 * @param {number} total
 * @param {number} msPerUnit
 */
export function sampleSizeFor(total, msPerUnit) {
  const target = 384;
  const exhaustiveMs = Math.round(total * msPerUnit);
  if (exhaustiveMs <= 1000 || total <= target) {
    return {
      n: total,
      exhaustive: true,
      msPerUnit,
      exhaustiveMs,
      confidence: 'the whole population is walked, so every arm rate is exact and no interval applies',
    };
  }
  return {
    n: target,
    exhaustive: false,
    msPerUnit,
    exhaustiveMs,
    confidence: 'N = 384: the widest 95 per cent half-width on an arm fire rate (at p = 0.5)'
      + ' is 5.0 percentage points, which is the resolution the sitting reads a rate at',
  };
}

/**
 * THE WHOLE MEASURE for one arm.
 * @param {{arm: string, round: number, base: string|null, variety: number,
 *   exemplars: string}} options
 */
export async function measure(options) {
  const started = Date.now();
  /** @type {Record<string, unknown>} */
  const out = {
    arm: options.arm, round: options.round, at: new Date().toISOString().slice(0, 19),
  };

  // (a) THE PROJECTION.
  /** @type {{ok: boolean, waivers: string[], detail: string}} */
  const projection = (() => {
    try {
      const text = execFileSync('node', [path.join(ROOT, 'scripts/generate-dossier-state-prose.mjs'), '--taste', '--check'],
        { cwd: ROOT, encoding: 'utf8' });
      return {
        ok: true,
        waivers: text.split('\n').filter((l) => l.includes('--taste WAIVED') || /^\[dossier-prose\] {3}/.test(l)),
        detail: text.split('\n').filter((l) => l.includes('verified')).join(' '),
      };
    } catch (error) {
      const e = /** @type {any} */ (error);
      return { ok: false, waivers: [], detail: String(e.stderr || e.message).split('\n').slice(0, 4).join(' ') };
    }
  })();
  out.projection = projection;

  // THE GROUND every arm is walked against.
  const ground = estateGround({ officeRoster: deriveOfficeRoster() });
  const captured = tasteTown(INTERESTED_TOWNS[0]);
  /** @param {string} key */
  const sourceOf = (key) => {
    const row = ALL_ROWS.get(`${key}`) || [...ALL_ROWS.values()].find((r) => r.pool === key);
    if (!row) return null;
    const resolved = sourceOfForTown(row, captured, {});
    return { kind: resolved.kind, holder: resolved.holder, standing: resolved.standing };
  };
  const exemplars = exemplarBands(options.exemplars);
  out.exemplars = {
    dir: options.exemplars,
    labels: exemplars.labels || [],
    metricsBanded: exemplars.bands ? Object.keys(exemplars.bands).length : 0,
    why: exemplars.why,
  };

  // (b) (e) (g) PER POOL.
  /** @type {Array<object>} */
  const pools = [];
  /** @type {Array<object>} */
  const allUnits = [];
  for (const entry of TASTE_POOLS) {
    const block = CORPUS[entry.block];
    const meta = block?.poolMeta?.[entry.pool];
    const variants = block?.pools?.[entry.pool] || [];
    const marked = variants.filter((v) => String(v.text).includes(AUTHORING_MARKER));
    const rounds = roundsOf(entry.dir);
    const row = ALL_ROWS.get(`${entry.block} :: ${entry.pool}`);
    if (marked.length > 0) {
      pools.push({
        block: entry.block,
        pool: entry.pool,
        dir: entry.dir,
        verdict: 'WITHHELD',
        why: `${marked.length} of ${variants.length} variant(s) still carry ${AUTHORING_MARKER}:`
          + ' the wording set has not been written, so every measure below is NOT-EXECUTABLE',
        variants: variants.length,
        faces: variants.map((v) => facesOf(v).length),
        attach: meta?.attach || [],
        rateBp: row?.rateBp ?? null,
        // ⛔ THE BIT IS THE NORM LEAF'S AND NOT THE CENSUS ROW'S. The census keeps the RATE
        // as a report and `row.departure` is null on every row by construction; the FROZEN
        // bit is what the composer's salience band reads, so that is what the table prints.
        departure: DOSSIER_PROSE_NORMS[`${entry.block}::${entry.pool}`]?.departure ?? null,
        rounds,
        units: 0,
        walk: null,
        lengths: null,
        siblings: null,
        band: null,
        provenance: null,
      });
      continue;
    }
    const units = unitsOfPool(entry.block, entry.pool);
    allUnits.push(...units);
    const options2 = {
      relations: DOSSIER_RELATIONS,
      primaryOf: (key) => (CENSUS_ROWS.get(`${entry.block} :: ${key}`)?.reads || [])[0] || '',
      fieldOf: (key) => (ALL_ROWS.get(`${entry.block} :: ${key}`)?.reads || [])[0] || '',
      siblingKeys: Object.keys(block.pools),
      register: 'R1',
      sourceOf,
    };
    /** @type {Record<string, number>} */
    const verdicts = { FAIL: 0, WITHHELD: 0, PASS: 0 };
    /** @type {Array<object>} */
    const findings = [];
    for (const unit of units) {
      const result = walkComposed(unit, withEntryContext(ground, {}), options2);
      verdicts[composedVerdictOf(result)] += 1;
      for (const f of [...result.composed.fails, ...result.entry.fails]) {
        findings.push({ channel: 'FAIL', ...f });
      }
      for (const f of [...result.composed.withheld, ...result.entry.withheld]) {
        findings.push({ channel: 'WITHHELD', ...f });
      }
    }
    // (e) LENGTHS, SIBLING DISTANCE, BAND POSITION — per variant, over its faces.
    const form = meta?.form || 'sentence';
    const ceiling = form === 'fragment' ? 12 : null;
    const lengths = variants.map((v, i) => ({
      vid: v.vid ?? i,
      faces: facesOf(v).map((face) => words(face)),
    }));
    const siblings = variants.map((v, i) => {
      const faces = facesOf(v);
      const a5 = armA5({ id: `${entry.block} :: ${entry.pool} #${i}`, faces });
      return {
        vid: v.vid ?? i,
        faces: faces.length,
        synonymSwaps: a5.reports.length,
        notExecutable: a5.notExecutable.length,
      };
    });
    const band = variants.flatMap((v, i) => facesOf(v)
      .map((face, f) => ({ vid: v.vid ?? i, face: f, ...bandPositionOf(face, exemplars) })));
    const cited = variants.reduce((n, v) => n + facesOf(v).reduce((m, face) => m + provenanceCount(face), 0), 0);
    pools.push({
      block: entry.block,
      pool: entry.pool,
      dir: entry.dir,
      verdict: verdicts.FAIL > 0 ? 'FAIL' : (verdicts.WITHHELD > 0 ? 'WITHHELD' : 'PASS'),
      why: '',
      variants: variants.length,
      faces: variants.map((v) => facesOf(v).length),
      attach: meta?.attach || [],
      rateBp: row?.rateBp ?? null,
      departure: DOSSIER_PROSE_NORMS[`${entry.block}::${entry.pool}`]?.departure ?? null,
      rounds,
      units: units.length,
      walk: { verdicts, findings: findings.slice(0, 40), findingCount: findings.length },
      lengths: { form, ceiling, rows: lengths },
      siblings,
      band,
      provenance: { citations: cited, a13: findings.filter((f) => f.arm === 'A13').length },
    });
  }
  out.pools = pools;

  // (b) THE SAMPLED WALK, and N from the measured cost.
  const walkStarted = Date.now();
  let walked = 0;
  for (const unit of allUnits.slice(0, Math.min(allUnits.length, 200))) {
    walkComposed(unit, withEntryContext(ground, {}), { register: 'R1' });
    walked += 1;
  }
  const msPerUnit = walked ? (Date.now() - walkStarted) / walked : 0;
  const size = sampleSizeFor(allUnits.length, msPerUnit);
  const picked = sampleOf(allUnits, size.n);
  /** @type {Record<string, number>} */
  const sampleVerdicts = { FAIL: 0, WITHHELD: 0, PASS: 0 };
  for (const unit of picked.picked) {
    sampleVerdicts[composedVerdictOf(walkComposed(unit, withEntryContext(ground, {}), { register: 'R1' }))] += 1;
  }
  out.walk = {
    totalUnits: allUnits.length,
    ...size,
    sampleSha: sha256(picked.addresses.join('\n')),
    verdicts: sampleVerdicts,
  };

  // (c) THE MANIFEST AND THE CLASSIFIER.
  if (options.base && existsSync(options.base)) {
    const run = await driftRun({});
    const base = JSON.parse(readFileSync(options.base, 'utf8'));
    const diff = classifyCells(base.cells || base, run.cells);
    const byClass = Object.fromEntries([...diff.byClass].map(([k, v]) => [k, v.cells.length]));
    out.manifest = {
      base: options.base,
      cells: run.cells.length,
      byClass,
      added: diff.added.length,
      removed: diff.removed.length,
      indexOnly: diff.indexOnly,
      lines: diffLines(diff),
      stop: byClass.REPLACED > 0 || byClass['RE-INDEXED'] > 0 || diff.added.length > 0 || diff.removed.length > 0,
    };
    out.varietyCells = run.cells;
  } else {
    out.manifest = { executable: false, why: 'no --base cells table was supplied, so no cell can be classified' };
  }

  // (d) THE DUPLICATE-UNIT RATE.
  if (options.variety > 0) {
    const configs = varietyConfigs({ seeds: options.variety });
    const run = await driftRun({ configs });
    out.variety = {
      seeds: options.variety,
      towns: run.towns,
      ...duplicateUnits(run.cells),
      byPosition: undefined,
    };
  } else {
    out.variety = { executable: false, why: 'the VARIETY run was not asked for (--variety 0)' };
  }

  // (f) THE TIE RATE.
  out.ties = tieRate(['rate-9-2', 'rate-3-0', 'prose-0', 'prose-1', 'golden-master-v3']);

  out.seconds = Math.round((Date.now() - started) / 1000);
  return out;
}

/** ONE TABLE PER POOL — the thing a gate agent reads. */
export function tableLines(out) {
  const lines = [
    `TASTE MEASURE · arm ${out.arm}${out.round ? ` · round ${out.round}` : ''} · ${out.at}`,
    `  projection: ${out.projection.ok ? 'GREEN' : 'RED'} — ${out.projection.detail}`,
    `  exemplar bands: ${out.exemplars.metricsBanded} metric(s) over ${out.exemplars.labels.length} leaves`
      + `${out.exemplars.why ? ` — NOT-EXECUTABLE: ${out.exemplars.why}` : ''}`,
  ];
  for (const pool of out.pools) {
    lines.push('');
    lines.push(`  ── ${pool.block} :: ${pool.pool}   [${pool.verdict}]`);
    if (pool.why) lines.push(`     ${pool.why}`);
    lines.push(`     variants ${pool.variants} · faces ${pool.faces.join('/') || '-'}`
      + ` · attach ${pool.attach.length} · units ${pool.units}`
      + ` · rate ${pool.rateBp === null ? 'ABSENT' : `${pool.rateBp} bp`}`
      + ` · departure ${pool.departure === null ? 'ABSENT' : pool.departure}`);
    lines.push(`     rounds: draft ${pool.rounds.draftRounds} · refine-A ${pool.rounds.refineA ? 'yes' : 'no'}`
      + ` · refine-B ${pool.rounds.refineB ? 'yes' : 'no'}`);
    if (!pool.walk) continue;
    lines.push(`     walk: FAIL ${pool.walk.verdicts.FAIL} · WITHHELD ${pool.walk.verdicts.WITHHELD}`
      + ` · PASS ${pool.walk.verdicts.PASS} · findings ${pool.walk.findingCount}`);
    const lens = pool.lengths.rows.flatMap((r) => r.faces);
    lines.push(`     words per face: ${lens.join(' · ')}`
      + `${pool.lengths.ceiling ? ` (fragment ceiling ${pool.lengths.ceiling})` : ' (sentence form)'}`);
    lines.push(`     sibling distance: ${pool.siblings.map((s) => `#${s.vid} ${s.faces} faces, ${s.synonymSwaps} synonym swap(s)`).join(' · ')}`);
    const banded = pool.band.filter((b) => b.executable);
    if (banded.length) {
      const mean = Math.round((banded.reduce((n, b) => n + (b.meanDistanceFromMedian || 0), 0) / banded.length) * 1000) / 1000;
      lines.push(`     band position: mean distance from the exemplar median ${mean} band-widths`
        + ` · budget ok on ${banded.filter((b) => b.budgetOk).length}/${banded.length}`
        + ` · depth ok on ${banded.filter((b) => b.depthOk).length}/${banded.length}`
        + ` · perfection-suspect ${banded.filter((b) => b.perfectionSuspect).length}`);
    } else {
      lines.push('     band position: NOT-EXECUTABLE');
    }
    lines.push(`     provenance: ${pool.provenance.citations} citation(s) · A13 rows ${pool.provenance.a13}`);
  }
  lines.push('');
  lines.push(`  WALK: ${out.walk.totalUnits} unit(s) · N ${out.walk.n}`
    + `${out.walk.exhaustive ? ' (EXHAUSTIVE)' : ''} · ${out.walk.msPerUnit.toFixed ? '' : ''}`
    + `${Math.round(out.walk.msPerUnit * 1000)} microseconds per unit · sha ${out.walk.sampleSha.slice(0, 16)}`);
  lines.push(`        ${out.walk.confidence}`);
  lines.push(`        sample verdicts: FAIL ${out.walk.verdicts.FAIL} · WITHHELD ${out.walk.verdicts.WITHHELD}`
    + ` · PASS ${out.walk.verdicts.PASS}`);
  if (out.manifest.executable === false) {
    lines.push(`  MANIFEST: NOT-EXECUTABLE — ${out.manifest.why}`);
  } else {
    lines.push(`  MANIFEST: ${out.manifest.stop ? 'STOP' : 'ADDITIVE ONLY'} — `
      + Object.entries(out.manifest.byClass).map(([k, v]) => `${k} ${v}`).join(' · ')
      + ` · ADDED ${out.manifest.added} · REMOVED ${out.manifest.removed}`);
  }
  if (out.variety.executable === false) {
    lines.push(`  VARIETY: NOT-EXECUTABLE — ${out.variety.why}`);
  } else {
    lines.push(`  VARIETY: ${out.variety.towns} towns / ${out.variety.seeds} seed(s) · duplicate-unit rate`
      + ` ${out.variety.rateBp} bp (${out.variety.duplicateUnits} of ${out.variety.units})`);
  }
  lines.push(`  TIES: ${out.ties.multiCandidateRungs} multi-candidate rung(s) · ${out.ties.ties} of`
    + ` ${out.ties.pairs} pair(s) tie · ${out.ties.tieBp} bp${out.ties.note ? ` — ${out.ties.note}` : ''}`);
  lines.push(`  ${out.seconds} s`);
  return lines;
}

/** The entry point. */
async function main() {
  const argv = process.argv.slice(2);
  const at = (flag, fallback) => {
    const i = argv.indexOf(flag);
    return i >= 0 && argv[i + 1] !== undefined ? argv[i + 1] : fallback;
  };
  const arm = String(at('--arm', 'draft'));
  const out = await measure({
    arm,
    round: Number(at('--round', 0)),
    base: at('--base', null),
    variety: Number(at('--variety', 0)),
    exemplars: String(at('--exemplars', EXEMPLAR_DIR)),
  });
  delete out.varietyCells;
  for (const line of tableLines(out)) console.log(line);
  const target = path.join(PACKETS, `measure-${arm}.json`);
  writeFileSync(target, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`  wrote ${target}`);
}

if (process.argv[1] && process.argv[1].endsWith('taste-measure.mjs')) await main();
