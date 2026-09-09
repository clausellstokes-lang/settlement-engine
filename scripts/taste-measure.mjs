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
  armA0b, armA5, claimsField, composedVerdictOf, provenanceCount, sampleOf, walkComposed,
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
/** A clause as the TABLE prints it: one line, and long enough to be recognised. @param {string} text */
const quoted = (text) => {
  const flat = String(text || '').replace(/\s+/g, ' ').trim();
  return flat.length > 96 ? `${flat.slice(0, 93)}...` : flat;
};

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

// ── ⭐⭐ CAR M-9: THE SITE OF A FINDING — THE WRITERS' GRAIN, AND THE SPINE'S ────────

/**
 * ⭐⭐ WHY THIS SECTION EXISTS, AND THE MEASUREMENT THAT FORCED IT. Rounds 1 to 3 of the writing
 * workflow took a pool's verdict at the WHOLE-UNIT grain: a composed unit is WITHHELD when any
 * arm withholds on any part of it, and a pool is out of band while any of its units is withheld.
 * On the shipped corpus that verdict cannot be reached by writing, because the SPINE half of
 * every unit is pre-rewrite text the writers may not touch. At round 3 the projector accepted
 * all twelve rows of all seven pools VERBATIM and every band measure had cleared, and all seven
 * pools still read out of band on findings quoting the spine's own clauses: arm Q on
 * `stone keeps itself, and wages do not.`, F25 on `the books say`, A3 on `rather than in the
 * luck`. The loop was DRY BY CONSTRUCTION, because a writer cannot move a measure whose subject
 * is a sentence they did not write and may not edit.
 *
 * So the verdict is taken at TWO grains and both are printed. The UNIT grain is unchanged and is
 * what the REWRITE will be judged on. The OWNED grain counts a finding only where its SITE is
 * the modifier's own piece or the JOINT between the two, and the spine's own findings are
 * collected as INHERITED, printed with the arm, the spine key and the quoted clause, and never
 * counted against the pool.
 *
 * ⛔ THE DEFAULT IS OWNED AND NEVER INHERITED. The arranged unit is `spine + ' ' + modifier`
 * verbatim, so every clause of it lies inside the spine, inside the modifier, or across the
 * boundary; the third is the JOINT and it is the writers' own, because the connective, the seat
 * and the thread are what they chose. A finding whose evidence cannot be located in either piece
 * is therefore read at the joint and COUNTS. An unattributable finding must never be excused as
 * the spine's: that is the only direction of this rule that could hide a defect, and a gate that
 * hid one would be the false green the harness exists to refuse.
 */

/** The composed arms whose subject IS the join, so they can belong to no single piece. */
export const JOINT_ARMS = Object.freeze(['A1', 'A2']);

/**
 * One finding's name, in the grain the gate rounds already printed: the entry walker answers in
 * its closed `klass` vocabulary with a prose arm name, the composed arms answer with an arm id
 * and a subject.
 * @param {{arm?: string, klass?: string, subject?: string}} finding
 * @returns {string}
 */
export function labelOfFinding(finding) {
  const arm = String(finding.arm || '');
  return finding.klass ? `${finding.klass} · ${arm}` : `${arm} · ${String(finding.subject || '')}`;
}

/**
 * ⭐⭐ WHERE ONE FINDING SITS: the spine's own piece, the modifier's piece, or the JOINT.
 *
 * The handle is the one each family already carries and no new one is minted. An ENTRY finding
 * names the CLAUSE the detector fired in (`entryWalker.finding`'s own field), so the clause is
 * located in the pieces' texts. A COMPOSED finding names its arm: A1 and A2 read ACROSS the
 * pieces by construction, A13 names the citing piece by key on its row, and A3 quotes the
 * rejected alternative, which is located the same way a clause is.
 * @param {{arm?: string, klass?: string, clause?: string, value?: string}} finding
 * @param {{pieces?: ReadonlyArray<{role: string, key: string, text: string}>}} unit
 * @returns {{site: 'spine'|'modifier'|'joint', key: string, evidence: string, why: string}}
 */
export function siteOfFinding(finding, unit) {
  const pieces = unit && Array.isArray(unit.pieces) ? unit.pieces : [];
  const spine = pieces.find((piece) => piece.role === 'spine') || null;
  const modifier = pieces.find((piece) => piece.role === 'modifier') || null;
  const composedArm = finding.klass === undefined ? String(finding.arm || '') : '';
  if (JOINT_ARMS.includes(composedArm)) {
    return {
      site: 'joint',
      key: modifier ? modifier.key : '',
      evidence: String(finding.value || ''),
      why: `arm ${composedArm} reads across the pieces, so its subject is the joint and never one half of it`,
    };
  }
  if (composedArm === 'A13') {
    const named = String(finding.value || '');
    // ⛔ NOT A SPLIT ON THE COLON. Every taste pool key CARRIES a colon (`stores: short`), so a
    // `value.split(':')[0]` would name the pool `stores` and match nothing. The row is either the
    // bare key or `key: detail`, so the test is an exact match or that one prefix.
    const holds = (piece) => piece !== null && (named === piece.key || named.startsWith(`${piece.key}: `));
    if (holds(modifier)) {
      return {
        site: 'modifier', key: modifier.key, evidence: named, why: 'the citing piece named on the A13 row is the modifier',
      };
    }
    if (holds(spine)) {
      return {
        site: 'spine', key: spine.key, evidence: named, why: 'the citing piece named on the A13 row is the spine',
      };
    }
    return {
      site: 'joint', key: modifier ? modifier.key : '', evidence: named, why: 'the A13 row names no piece this unit carries, so the finding is read at the joint and counts',
    };
  }
  const evidence = String(finding.clause || (composedArm === 'A3' ? finding.value : '') || '').trim();
  const needle = evidence.toLowerCase();
  const inSpine = spine !== null && needle !== '' && String(spine.text).toLowerCase().includes(needle);
  const inModifier = modifier !== null && needle !== '' && String(modifier.text).toLowerCase().includes(needle);
  if (inSpine && !inModifier) {
    return {
      site: 'spine', key: spine.key, evidence, why: 'the clause the detector fired in lies inside the spine\'s own text, which the writers may not edit',
    };
  }
  if (inModifier && !inSpine) {
    return {
      site: 'modifier', key: modifier.key, evidence, why: 'the clause the detector fired in lies inside the modifier\'s own face',
    };
  }
  return {
    site: 'joint',
    key: modifier ? modifier.key : '',
    evidence,
    why: needle === ''
      ? 'the finding carries no locatable evidence, so it is read at the joint and counts against the pool'
      : 'the clause crosses the boundary between the two pieces, or stands in both, so it is the joint\'s and counts',
  };
}

/**
 * ⭐⭐ ONE WALK, TWO GRAINS. The unit verdicts are exactly what they were; the OWNED verdict of a
 * unit is taken over the findings whose site is the modifier or the joint, and the spine's are
 * grouped as inherited with their count.
 * @param {ReadonlyArray<object>} units
 * @param {(unit: object) => {entry: {fails: object[], withheld: object[]},
 *   composed: {fails: object[], withheld: object[]}}} walkOne
 */
export function scopedWalkOf(units, walkOne) {
  /** @type {Record<string, number>} */
  const verdicts = { FAIL: 0, WITHHELD: 0, PASS: 0 };
  /** @type {Record<string, number>} */
  const ownedVerdicts = { FAIL: 0, WITHHELD: 0, PASS: 0 };
  /** @type {Array<object>} */
  const findings = [];
  /** @type {Array<object>} */
  const owned = [];
  /** @type {Map<string, {label: string, arm: string, klass: string, channel: string,
   *   spineKey: string, clause: string, description: string, count: number}>} */
  const inherited = new Map();
  /** @type {Map<string, number>} */
  const ownedByLabel = new Map();
  for (const unit of units || []) {
    const result = walkOne(unit);
    verdicts[composedVerdictOf(/** @type {any} */ (result))] += 1;
    /** @type {Array<object>} */
    const here = [];
    // ⛔ THE ORDER IS THE ONE THE JSON ALREADY SHIPS — composed fails, entry fails, then the two
    // withheld lists — because `walk.findings` is that list capped at 40 and a reordering here
    // would move a figure this car does not touch.
    for (const f of [...result.composed.fails, ...result.entry.fails]) here.push({ channel: 'FAIL', ...f });
    for (const f of [...result.composed.withheld, ...result.entry.withheld]) here.push({ channel: 'WITHHELD', ...f });
    findings.push(...here);
    let fail = 0;
    let withheld = 0;
    for (const f of here) {
      const at = siteOfFinding(f, unit);
      const label = labelOfFinding(f);
      if (at.site === 'spine') {
        const key = `${label} ${at.key} ${at.evidence}`;
        const seen = inherited.get(key);
        if (seen) {
          seen.count += 1;
        } else {
          inherited.set(key, {
            label,
            arm: String(f.arm || ''),
            klass: String(f.klass || ''),
            channel: String(f.channel || ''),
            spineKey: at.key,
            clause: at.evidence,
            description: String(f.description || ''),
            count: 1,
          });
        }
        continue;
      }
      owned.push({
        ...f, site: at.site, siteKey: at.key, siteWhy: at.why,
      });
      ownedByLabel.set(label, (ownedByLabel.get(label) || 0) + 1);
      if (f.channel === 'FAIL') fail += 1; else withheld += 1;
    }
    if (fail > 0) ownedVerdicts.FAIL += 1;
    else if (withheld > 0) ownedVerdicts.WITHHELD += 1;
    else ownedVerdicts.PASS += 1;
  }
  const rows = [...inherited.values()];
  return {
    verdicts,
    findings,
    owned: {
      verdicts: ownedVerdicts,
      findings: owned.slice(0, 40),
      findingCount: owned.length,
      byLabel: [...ownedByLabel].map(([label, count]) => ({ label, count })),
    },
    inherited: rows,
    inheritedCount: rows.reduce((n, r) => n + r.count, 0),
  };
}

/**
 * ⭐⭐ THE GATE'S OWN VERDICT, SCOPED. A pool is IN BAND when every face sits inside every band it
 * is measured on and every OWNED arm is green. The failing measures are returned in the shape the
 * writing workflow's schema already asks a gate agent for (`measure`, `value`, `band`), so the
 * gate copies them rather than composing a sentence of its own about a number it did not measure.
 *
 * ⛔ `inBand` IS `failing.length === 0` AND IS NOT A SECOND OPINION. A verdict computed apart
 * from its own reason list is a pair that can disagree, and the disagreement is always silent.
 * @param {{band?: Array<object>|null, lengths?: {form: string, ceiling: number|null,
 *   rows: Array<{faces: number[]}>}|null, owned?: {verdicts: Record<string, number>,
 *   byLabel: Array<{label: string, count: number}>}|null}} pool
 * @returns {{inBand: boolean, failing: Array<{measure: string, value: string, band: string}>}}
 */
export function inBandOf(pool) {
  /** @type {Array<{measure: string, value: string, band: string}>} */
  const failing = [];
  const band = Array.isArray(pool.band) ? pool.band : [];
  const measured = band.filter((face) => face.executable);
  const absent = band.filter((face) => !face.executable);
  if (band.length === 0) {
    failing.push({
      measure: 'band position',
      value: 'NOT-EXECUTABLE: no face was measured',
      band: 'every face measured against the ten leaf registers',
    });
  } else if (absent.length) {
    failing.push({
      measure: 'band position',
      value: `NOT-EXECUTABLE on ${absent.length} of ${band.length} face(s): ${absent[0].why}`,
      band: 'every face measured against the ten leaf registers',
    });
  }
  /** @type {Map<string, {depth: number, side: string, faces: number}>} */
  const deep = new Map();
  for (const face of measured) {
    if (face.depthOk || !face.deepest) continue;
    const seen = deep.get(face.deepest.metric) || { depth: 0, side: face.deepest.side, faces: 0 };
    seen.faces += 1;
    if (face.deepest.depth > seen.depth) {
      seen.depth = face.deepest.depth;
      seen.side = face.deepest.side;
    }
    deep.set(face.deepest.metric, seen);
  }
  for (const [metric, seen] of deep) {
    failing.push({
      measure: `band depth · ${metric} (${seen.side})`,
      value: `${seen.depth} band-widths on ${seen.faces} of ${measured.length} face(s)`,
      band: `DEPTH at most ${ENTRY_NUMBERS.depth} band-widths on every face`,
    });
  }
  const overBudget = measured.filter((face) => face.budgetOk === false);
  if (overBudget.length) {
    failing.push({
      measure: 'band budget',
      value: `over on ${overBudget.length} of ${measured.length} face(s)`,
      band: 'a face exceeds at most two thirds of the soft rules measurable on it',
    });
  }
  const lengths = pool.lengths || null;
  if (lengths && lengths.ceiling) {
    const over = (lengths.rows || []).flatMap((r) => r.faces).filter((n) => n > lengths.ceiling);
    if (over.length) {
      failing.push({
        measure: `words per face (${lengths.form} form)`,
        value: `${over.join(', ')} word(s) on ${over.length} face(s)`,
        band: `at most ${lengths.ceiling} words`,
      });
    }
  }
  const owned = pool.owned || null;
  if (owned) {
    for (const { label, count } of owned.byLabel) {
      failing.push({
        measure: `composed walk · ${label}`,
        value: `${count} owned finding(s)`,
        band: 'every owned arm green: FAIL 0 and WITHHELD 0 over the pool\'s composed units',
      });
    }
    if (owned.verdicts.FAIL > 0 || owned.verdicts.WITHHELD > 0) {
      failing.push({
        measure: 'composed walk · owned unit verdicts',
        value: `FAIL ${owned.verdicts.FAIL} · WITHHELD ${owned.verdicts.WITHHELD} · PASS ${owned.verdicts.PASS}`,
        band: 'FAIL 0 and WITHHELD 0 on the writers\' own grain',
      });
    }
  }
  return { inBand: failing.length === 0, failing };
}

/**
 * ⭐ THE CENSUS'S WORD-LEVEL SYNONYM TABLE, if it ships one. It does not at this tip, and the
 * report says so by NAMING the columns it looked for and what the census's only alias rows
 * actually key, rather than by asserting an absence nobody can check.
 * @param {Record<string, unknown>} census
 * @returns {{table: Record<string, ReadonlyArray<string>>, why: string}}
 */
export function censusSynonymTable(census) {
  for (const key of ['fieldVocabulary', 'fieldSynonyms', 'synonyms']) {
    const at = census ? census[key] : null;
    if (at && typeof at === 'object' && !Array.isArray(at)) {
      return { table: /** @type {any} */ (at), why: '' };
    }
  }
  const aliases = /** @type {any} */ (census || {}).ratifiedAliases;
  const rows = aliases && Array.isArray(aliases.rows) ? aliases.rows.length : 0;
  return {
    table: {},
    why: 'the wiring census ships NO word-level synonym table (no fieldVocabulary, fieldSynonyms or'
      + ` synonyms column); its ${rows} ratified alias row(s) key an ENDPOINT to a read ROOT and`
      + ' never a noun to a field, so a noun the field name does not contain can map to nothing',
  };
}

/**
 * ⭐⭐ ARM Q'S VOCABULARY, REPORTED AND NOT CURED (the chair's car M-9 item 3).
 *
 * `stone keeps itself, and wages do not.` is the owner's exemplar line and it is LAWFUL: the
 * spine reads the pay gate and `wages` names it. Arm Q flags the coordinate as naming no second
 * field because the arm's reader is `claimsField`, whose vocabulary is derived from the field's
 * own PATH (`economicGates.military` yields "military") plus whatever synonym table the caller
 * brings. So this function asks the question the sitting needs answered and changes no arm: for
 * each inherited Q finding, do the clause's own words map to a field the SPINE declares it reads,
 * under the census's synonym table? The arm is car 5's and the cure is the REWRITE's or a 5d.
 * ⛔ AND IT DECLARES ITSELF NOT-EXECUTABLE RATHER THAN ANSWERING NO. Where the census recovered
 * no reading for the spine, or recovered its own SYNTHETIC TABLE LABEL instead of a field path
 * (DS-DEF-2's four key functions were tabled at SEAM car 3h, so its spine's only reading is
 * `disasterRowSituation(...) (via DISASTER_ROW_POOL ...)`), no text can claim it and "maps to no
 * field" would read as a negative answer to a question that was never askable. THE RULE IS NOT
 * RE-IMPLEMENTED HERE: `armA0b` owns both limbs and this function asks IT, so the one place the
 * synthetic-label rule lives stays the one place it lives.
 * @param {ReadonlyArray<{klass: string, clause: string, spineKey: string, count: number}>} inherited
 * @param {(key: string) => ReadonlyArray<string>} readsOf
 * @param {{table: Record<string, ReadonlyArray<string>>, why: string}} vocabulary
 */
export function qVocabularyReport(inherited, readsOf, vocabulary) {
  /** @type {Array<object>} */
  const rows = [];
  for (const row of inherited || []) {
    if (row.klass !== 'Q') continue;
    const reads = readsOf(row.spineKey) || [];
    const asked = armA0b({ id: row.spineKey, text: row.clause, reads });
    if (asked.notExecutable.length) {
      rows.push({
        clause: row.clause,
        spineKey: row.spineKey,
        count: row.count,
        reads: [...reads],
        mapped: [],
        executable: false,
        verdict: `NOT-EXECUTABLE: ${asked.notExecutable[0].description}`,
        synonymTable: vocabulary.why || 'a word-level synonym table ships and was applied',
      });
      continue;
    }
    /** @type {string[]} */
    const mapped = [];
    for (const field of reads) {
      const token = claimsField(row.clause, field, vocabulary.table);
      if (token !== '') mapped.push(`${field} (as "${token}")`);
    }
    rows.push({
      clause: row.clause,
      spineKey: row.spineKey,
      count: row.count,
      reads: [...reads],
      mapped,
      executable: true,
      verdict: mapped.length
        ? 'the clause DOES name a field the spine declares it reads, so the arm and the census disagree'
        : 'the clause names no field the spine declares it reads, under the vocabulary the census supplies',
      synonymTable: vocabulary.why || 'a word-level synonym table ships and was applied',
    });
  }
  return rows;
}

/**
 * ⭐ THE HONESTY ROW — a pool whose wording set is still unwritten. It is a function so the arm
 * that holds the rule stays ARMED after every pool has been written: a test can plant a marked
 * variant list and read the row this file itself builds, rather than a re-implementation of it.
 * @param {{block: string, pool: string, dir: string}} entry
 * @param {{variants: ReadonlyArray<object>, marked: ReadonlyArray<object>, attach: string[],
 *   rateBp: number|null, departure: number|null, rounds: object}} input
 */
export function withheldPoolRow(entry, input) {
  return {
    block: entry.block,
    pool: entry.pool,
    dir: entry.dir,
    verdict: 'WITHHELD',
    why: `${input.marked.length} of ${input.variants.length} variant(s) still carry ${AUTHORING_MARKER}:`
      + ' the wording set has not been written, so every measure below is NOT-EXECUTABLE',
    variants: input.variants.length,
    faces: input.variants.map((v) => facesOf(v).length),
    attach: input.attach,
    rateBp: input.rateBp,
    // ⛔ THE BIT IS THE NORM LEAF'S AND NOT THE CENSUS ROW'S. The census keeps the RATE
    // as a report and `row.departure` is null on every row by construction; the FROZEN
    // bit is what the composer's salience band reads, so that is what the table prints.
    departure: input.departure,
    rounds: input.rounds,
    units: 0,
    walk: null,
    lengths: null,
    siblings: null,
    band: null,
    provenance: null,
    inBand: false,
    failing: [{
      measure: 'the wording set',
      value: `${input.marked.length} of ${input.variants.length} variant(s) carry ${AUTHORING_MARKER}`,
      band: 'a written set, whose measures are executable',
    }],
    owned: null,
    inherited: [],
    inheritedCount: 0,
    spineWithheld: false,
    qVocabulary: [],
  };
}

/**
 * ⛔⛔ THE ABSENT ROW — a pool the corpus does not carry, or one no spine offers a seat
 * (REWRITE car 8a-3; cured at cause on the finding this car's own tree produced).
 *
 * THE DEFECT, REPRODUCED BEFORE IT WAS CURED. `TASTE_POOLS` is a list of NAMES on the licence
 * card; the pools those names point at are annex rows. Run the harness in a tree that carries
 * the instruments and not the rows and every name resolves to `undefined`: `variants` falls
 * back to `[]`, `unitsOfPool` answers `[]`, the walk over an empty unit set returns
 * `{FAIL: 0, WITHHELD: 0, PASS: 0}`, and the verdict line — `FAIL > 0 ? … : 'PASS'` — reads
 * **PASS with an empty `why`**. A pool that does not exist was reported as a clean one. The
 * gate did not pass it (`inBandOf` puts `band position: no face was measured` in `failing`, so
 * `inBand` is false), but the WORD a reader sees was PASS and the reason column was blank,
 * which is the same class of lie car M-9 built `withheldPoolRow` to stop for an UNWRITTEN set.
 * An unwritten set was guarded; an ABSENT one fell through the guard.
 *
 * The row below is that guard's other half, and it is deliberately built by the same shape:
 * a verdict of its own, the reason spelled out, every measure `null` rather than zero, and one
 * `failing` row so no arithmetic anywhere can round it up to lawful.
 * @param {{block: string, pool: string, dir: string}} entry
 * @param {{why: string, variants: ReadonlyArray<object>, attach: string[],
 *   rateBp: number|null, departure: number|null, rounds: object}} input
 */
export function absentPoolRow(entry, input) {
  return {
    block: entry.block,
    pool: entry.pool,
    dir: entry.dir,
    verdict: 'NOT-EXECUTABLE',
    why: input.why,
    variants: input.variants.length,
    faces: input.variants.map((v) => facesOf(v).length),
    attach: input.attach,
    rateBp: input.rateBp,
    departure: input.departure,
    rounds: input.rounds,
    units: 0,
    walk: null,
    lengths: null,
    siblings: null,
    band: null,
    provenance: null,
    inBand: false,
    failing: [{
      measure: 'the unit set',
      value: `NOT-EXECUTABLE: ${input.why}`,
      band: 'a pool that composes at least one unit',
    }],
    owned: null,
    inherited: [],
    inheritedCount: 0,
    spineWithheld: false,
    qVocabulary: [],
  };
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
  // ⭐ CAR M-9 item 3: the vocabulary arm Q's reader is given, and the honest note when the
  // census supplies none. Read ONCE, so every pool's report names the same table.
  const synonyms = censusSynonymTable(CENSUS);
  const exemplars = exemplarBands(options.exemplars);
  out.exemplars = {
    dir: options.exemplars,
    labels: exemplars.labels || [],
    metricsBanded: exemplars.bands ? Object.keys(exemplars.bands).length : 0,
    why: exemplars.why,
  };
  out.synonymTable = { fields: Object.keys(synonyms.table).length, why: synonyms.why };

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
    // ⛔ THE ABSENT POOL IS ANSWERED FIRST, because every branch below it reads a variant list
    // that would be empty and would answer as though it had measured one. See `absentPoolRow`.
    if (variants.length === 0) {
      pools.push(absentPoolRow(entry, {
        why: `the corpus carries no pool ${entry.block} :: ${entry.pool}, so there is nothing`
          + ' to walk, measure or band',
        variants,
        attach: meta?.attach || [],
        rateBp: row?.rateBp ?? null,
        departure: DOSSIER_PROSE_NORMS[`${entry.block}::${entry.pool}`]?.departure ?? null,
        rounds,
      }));
      continue;
    }
    if (marked.length > 0) {
      pools.push(withheldPoolRow(entry, {
        variants,
        marked,
        attach: meta?.attach || [],
        rateBp: row?.rateBp ?? null,
        departure: DOSSIER_PROSE_NORMS[`${entry.block}::${entry.pool}`]?.departure ?? null,
        rounds,
      }));
      continue;
    }
    const units = unitsOfPool(entry.block, entry.pool);
    // ⛔ AND A POOL THAT EXISTS BUT COMPOSES NOTHING takes the same row for the same reason: an
    // empty attach set means no spine offers it a seat, so the walk below would read zero
    // verdicts and call the silence a PASS.
    if (units.length === 0) {
      pools.push(absentPoolRow(entry, {
        why: `${entry.block} :: ${entry.pool} composes no unit: its attach set is`
          + ` ${(meta?.attach || []).length === 0 ? 'empty' : 'unseated'}, so no spine offers it a seat`,
        variants,
        attach: meta?.attach || [],
        rateBp: row?.rateBp ?? null,
        departure: DOSSIER_PROSE_NORMS[`${entry.block}::${entry.pool}`]?.departure ?? null,
        rounds,
      }));
      continue;
    }
    allUnits.push(...units);
    const options2 = {
      relations: DOSSIER_RELATIONS,
      primaryOf: (key) => (CENSUS_ROWS.get(`${entry.block} :: ${key}`)?.reads || [])[0] || '',
      fieldOf: (key) => (ALL_ROWS.get(`${entry.block} :: ${key}`)?.reads || [])[0] || '',
      siblingKeys: Object.keys(block.pools),
      register: 'R1',
      sourceOf,
    };
    // ⭐⭐ CAR M-9: ONE WALK, READ AT TWO GRAINS. The unit verdicts are what they always were;
    // the OWNED verdicts and the INHERITED list are the writers' grain and the spine's.
    const scoped = scopedWalkOf(units, (unit) => walkComposed(unit, withEntryContext(ground, {}), options2));
    const verdicts = scoped.verdicts;
    const findings = scoped.findings;
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
    const built = {
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
      owned: scoped.owned,
      inherited: scoped.inherited,
      inheritedCount: scoped.inheritedCount,
      spineWithheld: scoped.inheritedCount > 0,
      qVocabulary: qVocabularyReport(
        scoped.inherited,
        (key) => (ALL_ROWS.get(`${entry.block} :: ${key}`)?.reads || []),
        synonyms,
      ),
    };
    pools.push({ ...built, ...inBandOf(built) });
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
    lines.push(`  ── ${pool.block} :: ${pool.pool}   [${pool.verdict}]  inBand ${pool.inBand ? 'YES' : 'NO'}`);
    if (pool.why) lines.push(`     ${pool.why}`);
    lines.push(`     variants ${pool.variants} · faces ${pool.faces.join('/') || '-'}`
      + ` · attach ${pool.attach.length} · units ${pool.units}`
      + ` · rate ${pool.rateBp === null ? 'ABSENT' : `${pool.rateBp} bp`}`
      + ` · departure ${pool.departure === null ? 'ABSENT' : pool.departure}`);
    lines.push(`     rounds: draft ${pool.rounds.draftRounds} · refine-A ${pool.rounds.refineA ? 'yes' : 'no'}`
      + ` · refine-B ${pool.rounds.refineB ? 'yes' : 'no'}`);
    // ⭐⭐ CAR M-9: the failing measures are the WRITERS' OWN, and they are the whole of the
    // reason `inBand` reads what it reads (`inBand` IS `failing.length === 0`).
    for (const fail of pool.failing || []) {
      lines.push(`     failing: ${fail.measure} = ${fail.value} | band ${fail.band}`);
    }
    if (!pool.walk) continue;
    lines.push(`     walk: FAIL ${pool.walk.verdicts.FAIL} · WITHHELD ${pool.walk.verdicts.WITHHELD}`
      + ` · PASS ${pool.walk.verdicts.PASS} · findings ${pool.walk.findingCount}`);
    lines.push(`     unit: FAIL ${pool.walk.verdicts.FAIL} · WITHHELD ${pool.walk.verdicts.WITHHELD}`
      + ` · PASS ${pool.walk.verdicts.PASS}   ·   owned: FAIL ${pool.owned.verdicts.FAIL}`
      + ` · WITHHELD ${pool.owned.verdicts.WITHHELD} · PASS ${pool.owned.verdicts.PASS}`
      + ` (${pool.owned.findingCount} owned finding(s), ${pool.inheritedCount} inherited)`);
    for (const row of pool.inherited) {
      lines.push(`     inherited (the SPINE's own, never counted against this pool): ${row.label}`
        + ` · spine \`${row.spineKey}\` · "${quoted(row.clause)}" x ${row.count}`);
    }
    for (const row of pool.qVocabulary) {
      lines.push(`     arm Q vocabulary REPORT (no arm changed): "${quoted(row.clause)}" against spine`
        + ` \`${row.spineKey}\` reads [${row.reads.join(', ') || 'none recovered'}]`);
      lines.push(row.executable
        ? `       ${row.mapped.length ? `maps to ${row.mapped.join(' · ')}` : 'maps to no field'} — ${row.verdict}`
        : `       ${row.verdict}`);
      lines.push(`       ${row.synonymTable}`);
    }
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
