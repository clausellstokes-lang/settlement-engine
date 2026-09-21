#!/usr/bin/env node
/**
 * scripts/prose-wave-gate.mjs — THE WAVE'S GATE (REWRITE car 8a-5, generalised from the taste's
 * harness `scripts/taste-measure.mjs`, TASTE cars M-7 / M-9 / M-9b, which this file REPLACES).
 *
 * ⛔ ONE IMPLEMENTATION, NOT TWO. The old script is not aliased and not kept: it was renamed
 * into this one and its walker with it, in the same commit, because a gate that exists twice
 * is two gates that disagree the first time somebody cures one of them. Everything the taste
 * measured is still measured here; what is new is the SUBJECT (a DESK SECTION's spine pools
 * and their faces, which is the REWRITE's unit) and the five pieces the sitting found missing.
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
 * ⭐ THE FIVE PIECES SITTING §T.5 FOUND MISSING, EACH LANDED HERE WITH ITS PLANT:
 *   (a) THE BAND GRAIN, CURED. `bandPositionOf` scored 21 TEXT-level metrics against ONE
 *       sentence, and 13 of them read zero on any single sentence, so every face in all four
 *       taste JSONs carried the IDENTICAL tuple (exceeded 13/21 · share 0.619 · mean 0.486 ·
 *       deepest neighbourVariation 1.597 under). The band column was a constant wearing a
 *       measurement's clothes. Cured by splitting the metrics: the TEXT-level thirteen are
 *       scored on the pool's RENDERED CORPUS and the word-level eight on the FACE, and BOTH
 *       grains are printed so a reader can see which one moved.
 *   (b) A SIBLING DISTANCE on the estate's own ruler (`siblingDistance`) beside A5's
 *       synonym-swap count, which is a detector and not a distance. REPORTED at 8a; the floor
 *       is set at 8b's fold (SITTING §T.3 row 8).
 *   (c) THE EXEMPLAR CITATION RATE per unit, over whichever of the ten leaf registers has raw
 *       prose on this machine, with the denominator printed. The provenance budget of at most
 *       one citation per unit is PROVISIONAL until this is read (SITTING §T.4).
 *   (d) THE FIXTURE SECTION: the interested fact rendered BOTH WAYS on the captured town and
 *       the clean control, with the compiled passage asserted identical on both audiences.
 *   (e) `--shapes`, which reaches `scripts/prose-shape-report.mjs` (REWRITE car 8a-2).
 *
 * AND THE TWO-PHASE RULE of Part B §21 as the gate's own KEEP-OR-REVERT verdict, with the
 * BANKED count printed and shrink-only.
 *
 *   node scripts/prose-wave-gate.mjs --arm draft --round 3
 *   node scripts/prose-wave-gate.mjs --arm A --base <cells.json>
 *   node scripts/prose-wave-gate.mjs --arm draft --variety 1     a cheap slice of measure (d)
 *   node scripts/prose-wave-gate.mjs --section defense           a DESK SECTION's spine pools
 *   node scripts/prose-wave-gate.mjs --shapes --corpus <f>       item 2's distribution table
 *   node scripts/prose-wave-gate.mjs --arm A --out <path.json>   name the packet explicitly
 *
 * ⛔ ALWAYS PASS `--section` OR `--pools`. The bare roster is the taste's seven pool NAMES,
 * which are annex rows this tree does not carry, so a bare run composes ZERO units and every
 * row reads NOT-EXECUTABLE. That is honest and it is not a measurement; 8b's workflow names a
 * roster on every call (fold NEW-5).
 *
 * READ-ONLY except ONE JSON, written at `<scratch>/packets/<dock>/measure-<arm>.json` —
 * NAMESPACED BY DOCK since REWRITE car 8a-11 (SITTING §U c-1), overridable by `$PACKETS` (the
 * directory) or `--out` (the whole path), and REFUSED where the file already there names
 * another arm or a later round. It does not write into `$PACKETS/`, which is the writers'
 * shared packet root and is only ever listed.
 */
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync,
} from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { estateGround, withEntryContext } from '../src/domain/prose/entryGround.js';
import {
  armA0b, armA5, claimsField, composedVerdictOf, provenanceCount, sampleOf, walkComposed,
} from '../src/domain/prose/composedWalker.js';
import { sentencesOf } from '../src/domain/prose/entryWalker.js';
import { AUTHORING_MARKER } from './lib/dossier-annex-grammar.mjs';
// ⭐ THE ESTATE'S ONE UNIT BUILDER (REWRITE car 8a-2, consumed here at 8a-11 under SITTING §U
// c-2). `facesOf` comes with it: a second spelling of "the parent text and its wordings" is the
// same two-homes defect one function smaller.
import { facesOf, unitsOfPool as libUnitsOfPool } from './lib/prose-composed-units.mjs';
import { fingerprint, RATE_METRICS, scoreAgainstBands } from '../src/domain/prose/proseFingerprint.js';
import { spineRows } from '../src/domain/prose/wiringCensus.js';
import { fieldSynonymsFor } from '../src/domain/prose/fieldSynonyms.js';
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
import { composeStateProse } from '../src/domain/display/stateProse/composeStateProse.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../src/data/dossierStateProse/general.generated.js';
// ⭐ ALL SIX LEAVES (REWRITE car 8a-5). The taste read two because its seven pools lived in
// two; the REWRITE's subject is a DESK SECTION and there are six desks, so the gate must be
// able to walk any of them. `--section` names one; `--pools` names an explicit list.
import { DOSSIER_STATE_PROSE_ECONOMY } from '../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../src/data/dossierStateProse/warFaith.generated.js';
import { siblingDistance } from '../src/domain/prose/composedWalker.js';
import { INTERESTED_ROW } from './taste-holders.mjs';
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
/**
 * Where the WRITERS' packets live. READ ONLY: `roundsOf` lists this directory and opens
 * nothing in it. It is deliberately SHARED across docks, because a pool's rounds are the
 * wave's fact and not one dock's. Nothing writes here — see `packetTargetFor` for the write.
 */
export const PACKETS = path.join(SCRATCH, 'taste');

/**
 * ⭐⭐ WHERE THE MEASUREMENT IS WRITTEN, NAMESPACED BY DOCK (REWRITE car 8a-11, SITTING §U c-1).
 *
 * ⛔ THE DEFECT THIS CURES, AND IT BIT A LIVE MEASUREMENT. Until this cure the run wrote
 * `${PACKETS}/measure-${arm}.json` — one SHARED path for every dock cut under the chair's
 * scratchpad — with no `--out`, no environment override, no refusal on an existing file, and
 * `--arm` defaulting to `draft`. A skeptic's bare read-only-looking probe therefore overwrote
 * laneTASTE's live round-4 draft packet (169,324 B down to 17,245 B; restored from
 * `measure-draft-prev.json`). The wave's writing workflow calls this gate after EVERY round on
 * EVERY arm, and 8b runs arms A and B concurrently by design, so a gate that clobbers a
 * sibling's measurement is the FALSE-GREEN INSTRUMENT class: the packet a folder later reads
 * would carry another run's figures under this run's name.
 *
 * ⛔ WHY THE DEFAULT IS `<scratch>/packets/<dock>/` AND NOT `<dock>/.packets/`. Both namespace
 * by dock. A directory INSIDE the worktree does not: an untracked `.packets/` shows up as `??`
 * in `git status --porcelain`, and porcelain 0 between commits is the law every gate run in
 * this program is held to — the cure would have broken the check it exists to protect, on
 * every dock, silently. So the namespace sits beside the docks rather than inside one, and the
 * dock's own directory name is the namespace.
 *
 * `$PACKETS` overrides the DIRECTORY; `--out` overrides the whole PATH, and the workflow
 * passes it per arm as belt and braces (SITTING §U c-1).
 * @param {string} [root] the dock, which is this file's own repository root
 * @returns {string}
 */
export function packetDirFor(root = ROOT) {
  const override = process.env.PACKETS;
  if (override && override.trim() !== '') return path.resolve(override);
  return path.join(path.resolve(root, '..'), 'packets', path.basename(path.resolve(root)));
}

/**
 * The file this run writes, which is a function of the dock, the arm and the flags — never a
 * constant.
 * @param {{arm: string, out?: string|null, root?: string}} options
 * @returns {string}
 */
export function packetTargetFor(options) {
  const { arm, out = null, root = ROOT } = options;
  if (out && String(out).trim() !== '') return path.resolve(String(out));
  return path.join(packetDirFor(root), `measure-${arm}.json`);
}

/**
 * ⛔ THE REFUSAL — a packet whose own header says it belongs to another run is never
 * overwritten, and the gate exits non-zero rather than writing.
 *
 * TWO SHAPES OF FOREIGN, and both are the incident above. (i) A DIFFERENT ARM: the file at the
 * target names an arm this run is not, which is what `--out` pointed at a sibling's path looks
 * like. (ii) A LATER ROUND: the file names a round GREATER than this run's, which is exactly
 * how a bare `--round 0` probe destroyed a round-4 measurement. Re-running the SAME arm at the
 * same or a later round is the workflow's own progress and is allowed, because a gate that
 * refused its own next round would be unusable.
 *
 * A packet carrying no header at all is not refused: it is not a packet.
 * @param {{existing: object|null|undefined, arm: string, round: number}} options
 * @returns {string|null} the refusal, or null where the write is this run's own
 */
export function packetRefusal(options) {
  const { existing, arm, round } = options;
  if (!existing || typeof existing !== 'object') return null;
  const theirArm = /** @type {any} */ (existing).arm;
  const theirRound = Number(/** @type {any} */ (existing).round);
  const stamped = /** @type {any} */ (existing).at;
  const whose = `it carries arm "${String(theirArm)}" round ${String(/** @type {any} */ (existing).round)}`
    + `${stamped ? ` written at ${String(stamped)}` : ''}`;
  if (theirArm !== undefined && String(theirArm) !== String(arm)) {
    return `REFUSED: the packet at this path belongs to another run — ${whose},`
      + ` and this run is arm "${arm}" round ${round}. Pass --out to name your own path.`;
  }
  if (Number.isFinite(theirRound) && theirRound > Number(round)) {
    return `REFUSED: the packet at this path is a LATER measurement — ${whose},`
      + ` and this run is arm "${arm}" round ${round}. Pass --out to name your own path.`;
  }
  return null;
}
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
const CORPUS = {
  ...DOSSIER_STATE_PROSE_DEFENSE, ...DOSSIER_STATE_PROSE_GENERAL, ...DOSSIER_STATE_PROSE_ECONOMY,
  ...DOSSIER_STATE_PROSE_POWER, ...DOSSIER_STATE_PROSE_STRESSORS, ...DOSSIER_STATE_PROSE_WAR_FAITH,
};

/**
 * ⭐⭐ A DESK SECTION IS A LEAF, AND THE ROSTER IS DERIVED RATHER THAN TRANSCRIBED.
 *
 * ⛔ THE FIRST CUT OF THIS TABLE WAS A HAND-WRITTEN PREFIX LIST AND IT DRIFTED IMMEDIATELY,
 * which is recorded here because it is the reason for the shape. Written by hand it read
 * general = DS-GEN, DS-HK, DS-CND and warFaith = DS-WAR, DS-FTH, DS-REL; the projector's own
 * DESKS table (`scripts/generate-dossier-state-prose.mjs:108`) says general = DS-GEN, DS-REL,
 * DS-POP, DS-HK and stressors = DS-STR, DS-CND. Two prefixes were on the wrong desk and DS-POP
 * was on none, so 29 of the 708 pools were reachable from no section at all — a gate silently
 * unable to walk part of its own corpus.
 *
 * The cure is to stop transcribing: a leaf IS a section. Each of the six generated leaves
 * exports exactly the blocks its desk owns, so the six of them partition the corpus BY
 * CONSTRUCTION and no prefix list can be wrong. `sectionsCoverEveryPool` below asserts the
 * partition rather than trusting it.
 * @type {Readonly<Record<string, object>>}
 */
export const SECTION_LEAVES = Object.freeze({
  defense: DOSSIER_STATE_PROSE_DEFENSE,
  economy: DOSSIER_STATE_PROSE_ECONOMY,
  general: DOSSIER_STATE_PROSE_GENERAL,
  power: DOSSIER_STATE_PROSE_POWER,
  stressors: DOSSIER_STATE_PROSE_STRESSORS,
  warFaith: DOSSIER_STATE_PROSE_WAR_FAITH,
});

/**
 * THE PARTITION, AS A MEASUREMENT. Every pool of the merged corpus belongs to exactly one
 * section, and every section's pools belong to the corpus — asserted by the walker so the
 * "derived, therefore correct" claim above is a figure rather than an argument.
 * @returns {{pools: number, sections: number, unreached: string[], twice: string[]}}
 */
export function sectionsCoverEveryPool() {
  /** @type {Map<string, number>} */
  const seen = new Map();
  for (const leaf of Object.values(SECTION_LEAVES)) {
    for (const block of Object.keys(leaf)) {
      for (const pool of Object.keys(leaf[block].pools || {})) {
        const at = `${block} :: ${pool}`;
        seen.set(at, (seen.get(at) || 0) + 1);
      }
    }
  }
  /** @type {string[]} */
  const unreached = [];
  for (const block of Object.keys(CORPUS)) {
    for (const pool of Object.keys(CORPUS[block].pools || {})) {
      if (!seen.has(`${block} :: ${pool}`)) unreached.push(`${block} :: ${pool}`);
    }
  }
  return {
    pools: seen.size,
    sections: Object.keys(SECTION_LEAVES).length,
    unreached,
    twice: [...seen].filter(([, n]) => n > 1).map(([at]) => at),
  };
}

/**
 * ⭐ THE POOL ROSTER THE GATE WALKS.
 *
 * ⛔ THE PACKET DIRECTORY IS DERIVED FROM THE KEY AND NEVER INVENTED. The taste's seven rows
 * carried a hand-written `dir`; a section's pools cannot, so the directory is a slug of
 * `block :: pool` and the round counter reads it exactly as it read the taste's. A pool with
 * no packet directory answers `draftRounds 0`, which is the honest reading of "nobody has
 * written for it yet" rather than an error.
 * @param {{section?: string|null, pools?: string|null}} options
 * @returns {{rows: Array<{block: string, pool: string, dir: string}>, why: string}}
 */
export function poolRosterOf(options) {
  const slug = (block, pool) => `${block}-${pool}`.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  if (options.pools) {
    const rows = String(options.pools).split(',').map((s) => s.trim()).filter(Boolean)
      .map((entry) => {
        const [block, pool] = entry.split('::').map((s) => s.trim());
        return { block, pool, dir: slug(block, pool) };
      });
    return { rows, why: `--pools named ${rows.length} pool(s) by hand` };
  }
  if (options.section) {
    const leaf = SECTION_LEAVES[options.section];
    if (!leaf) {
      return {
        rows: [],
        why: `NOT-EXECUTABLE: no desk section named \`${options.section}\`;`
          + ` the six are ${Object.keys(SECTION_LEAVES).join(', ')}`,
      };
    }
    /** @type {Array<{block: string, pool: string, dir: string}>} */
    const rows = [];
    for (const block of Object.keys(leaf).sort()) {
      for (const pool of Object.keys(leaf[block].pools || {}).sort()) {
        rows.push({ block, pool, dir: slug(block, pool) });
      }
    }
    return {
      rows,
      why: `--section ${options.section} over ${Object.keys(leaf).length} block(s) of its own leaf`,
    };
  }
  return { rows: [...TASTE_POOLS], why: 'no --section and no --pools: the taste\'s seven' };
}
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
 * ⛔⛔ THE THIRTEEN METRICS THAT READ ZERO ON ANY ONE SENTENCE (SITTING §T.5, CONFIRMED by the
 * chair's own probe over the harness's `bandPositionOf` and `exemplarBands`).
 *
 * THE DEFECT, IN ONE LINE: an 8-word face, a 15-word face and the taste draft's covert breach
 * line all scored `exceeded 13/21 · share 0.619 · mean 0.486 · deepest
 * wordsPerSentence.neighbourVariation 1.597 under`. Every face in all four taste JSONs carried
 * the identical tuple except one. The reason is arithmetic, not sampling: thirteen of the
 * twenty-one banded metrics are properties of a TEXT — a share of sentences, a rate per
 * sentence, a variation BETWEEN neighbours, a repeat of an opener — and on a single sentence
 * every one of them is 0 or undefined, which falls under every exemplar floor. The BUDGET was
 * then met vacuously (13 ≤ floor(21 × 2/3) = 14), and the only thing that could ever move a
 * face was an OVER-side lexicon trigger. The two-arm table's band column was STRUCK as a
 * discriminator on exactly this ground.
 *
 * THE CURE IS A GRAIN, NOT A THRESHOLD. These thirteen are scored on the pool's RENDERED
 * CORPUS — every unit the pool composes, joined as one text — where "a share of sentences over
 * thirty words" is a question with an answer. The remaining eight are word-level or closer
 * metrics that a single sentence really does answer, and they stay on the FACE. Both grains are
 * printed side by side, so a reader can see which one moved and neither can be mistaken for
 * the other.
 * @type {ReadonlyArray<string>}
 */
export const TEXT_LEVEL_METRICS = Object.freeze([
  'wordsPerSentence.shareUnder8',
  'wordsPerSentence.shareOver30',
  'wordsPerSentence.neighbourVariation',
  'punctuation.semicolonRate',
  'shapes.antithesisRate',
  'shapes.triadRate',
  'shapes.doubledAdjectiveRate',
  'shapes.adverbsPerSentence',
  'shapes.thereIsOpenerRate',
  'closers.abstractNounRate',
  'closers.pronounRate',
  'openers.sameOpenerAsPreviousRate',
  'runsOfThreeSameLengthBand',
]);

/**
 * The eight that a single sentence genuinely answers: a colon, an em dash, a question mark, an
 * exclamation, a parenthesis, a participial opener, a which-tail and a line of dialogue are all
 * visible in one sentence, and their absence there is a fact about the sentence rather than an
 * artefact of the grain.
 * @type {ReadonlyArray<string>}
 */
export const FACE_LEVEL_METRICS = Object.freeze(
  RATE_METRICS.filter((metric) => !TEXT_LEVEL_METRICS.includes(metric)),
);

/**
 * The bands restricted to one grain's metrics, so `scoreAgainstBands` scores only what the
 * grain can answer. A band the grain cannot answer is not scored as a pass; it is not scored.
 * @param {{bands: object|null, medians: object|null, why?: string}} exemplars
 * @param {ReadonlyArray<string>} metrics
 */
function bandsFor(exemplars, metrics) {
  if (!exemplars.bands) return null;
  /** @type {Record<string, {lo: number, hi: number}>} */
  const out = {};
  for (const metric of metrics) if (exemplars.bands[metric]) out[metric] = exemplars.bands[metric];
  return out;
}

/**
 * One text's band position at ONE GRAIN: which soft rules it exceeds, how deep, and how far it
 * sits from the exemplar MEDIAN of each band it is scored on.
 *
 * ⛔ `grain` NAMES WHICH METRICS ARE ASKED, and it is required rather than defaulted, because a
 * default is how the old defect survived: the caller must say whether it is handing over a FACE
 * or a CORPUS, and the answer carries the grain it was measured at.
 * @param {string} text
 * @param {{bands: object|null, medians: object|null, why?: string}} exemplars
 * @param {'face'|'corpus'} grain
 */
export function bandPositionAt(text, exemplars, grain) {
  const metrics = grain === 'corpus' ? TEXT_LEVEL_METRICS : FACE_LEVEL_METRICS;
  const scoped = bandsFor(exemplars, metrics);
  if (!scoped) return { executable: false, grain, why: exemplars.why };
  return { ...bandPositionOf(text, { ...exemplars, bands: scoped }), grain };
}

/**
 * BOTH GRAINS FOR ONE FACE, which is what a writer's row prints: the word-level measures on
 * the face itself, and the text-level measures on the corpus the face is part of.
 * @param {string} face
 * @param {string} corpusText every unit of the pool, joined
 * @param {{bands: object|null, medians: object|null, why?: string}} exemplars
 */
export function bandGrainsOf(face, corpusText, exemplars) {
  return {
    face: bandPositionAt(face, exemplars, 'face'),
    corpus: bandPositionAt(corpusText, exemplars, 'corpus'),
  };
}

/**
 * One face's band position: which soft rules it exceeds, how deep, and how far it sits from
 * the exemplar MEDIAN of each band it is scored on.
 *
 * ⚠ KEPT AS THE SCORER BOTH GRAINS CALL, AND NO LONGER CALLED DIRECTLY BY THE MEASURE. It is
 * the arithmetic; `bandPositionAt` is the grain. Calling this with the whole 21-metric band set
 * on a single sentence is the defect SITTING §T.5 struck, so the measure never does.
 * @param {string} text
 * @param {{bands: object|null, medians: object|null, why?: string}} exemplars
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

// ── THE UNITS: ONE IMPLEMENTATION, IN scripts/lib/prose-composed-units.mjs ──────────

/**
 * ⭐⭐ EVERY COMPOSED UNIT THIS GATE WALKS, from the estate's ONE unit builder.
 *
 * ⛔ WHY THIS IS FOUR LINES AND NOT NINETY (REWRITE car 8a-11, SITTING §U c-2). Car 8a-5 landed
 * this gate with its own copy of the cartesian beside `scripts/lib/prose-composed-units.mjs`,
 * which car 8a-2 had already landed for exactly this purpose. The two then diverged on shipped
 * input the first time anybody drove both — `DS-DEF-11 :: WALLED-STRAINED` gate 2 / lib 0,
 * `WALLED-QUIET` 3 / 0, `DS-DEF-2 :: Disasters & Famine: granary AND hospital` 3 / 0 — because
 * the bare-spine branch lived only here, and NOTHING cross-checked them while both fed the same
 * sitting. That is the hazard this file's own header names one screen up: two gates that
 * disagree the first time somebody cures one of them.
 *
 * The bare-spine branch now lives in the lib behind `bareSpine`, and
 * `tests/lint/proseWaveGate.walker.test.js` drives BOTH exports over `poolRosterOf({section})`
 * and asserts they agree pool by pool.
 * @param {string} blockId
 * @param {string} poolKey
 * @returns {Array<object>} composed unit rows for the walker
 */
export function unitsOfPool(blockId, poolKey) {
  return libUnitsOfPool(CORPUS, blockId, poolKey, { bareSpine: true });
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
  // The composite-key separator, BUILT and never typed. A raw NUL byte in source makes
  // git classify the whole file as binary, which hides every future diff of it from
  // review; tests/lint/controlBytes.test.js pins the rule for the whole tracked tree.
  const KEY_SEP = String.fromCharCode(0);
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
        const key = `${label}${KEY_SEP}${at.key}${KEY_SEP}${at.evidence}`;
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

// ── (b) THE SIBLING DISTANCE, ON THE ESTATE'S OWN RULER ─────────────────────────────

/**
 * ⭐ SITTING §T.3 row 8, and the gap it names: "⚠ the harness carries NO distance figure, and
 * the refuters found sibling PARAPHRASE on both arms that A5 cannot see".
 *
 * A5 is a DETECTOR: it reports a pair only when all three of its tests fire at once (same
 * opener AND same segment count AND an overlap at or above a floor that defaults to 10,000 bp,
 * i.e. an exact content-token match). That answers "is this pair a synonym swap"; it does not
 * answer "how far apart are these two faces", which is what a FLOOR has to be cut from. Seven
 * paraphrase pairs at the taste sat under A5's radar for exactly that reason.
 *
 * ⛔ NO NEW RULER. `siblingDistance` already exists in the composed walker and already measures
 * the three things `check-pair` measures — the two-word opener, the sentence count through the
 * estate's own splitter, and the content-token overlap in BASIS POINTS as an integer. This
 * function reports its DISTRIBUTION over a variant's faces; it sets no floor, because SITTING
 * §T.3 sets the floor at 8b's fold on the numbers this print produces.
 * @param {ReadonlyArray<string>} faces
 * @returns {{pairs: number, minOverlapBp: number|null, maxOverlapBp: number|null,
 *   medianOverlapBp: number|null, sameOpenerPairs: number, sameSegmentPairs: number,
 *   nearest: {a: number, b: number, overlapBp: number}|null, why: string}}
 */
export function siblingSpreadOf(faces) {
  const list = faces || [];
  if (list.length < 2) {
    return {
      pairs: 0,
      minOverlapBp: null,
      maxOverlapBp: null,
      medianOverlapBp: null,
      sameOpenerPairs: 0,
      sameSegmentPairs: 0,
      nearest: null,
      why: `NOT-EXECUTABLE: a distance needs two faces and this variant carries ${list.length}`,
    };
  }
  /** @type {Array<{a: number, b: number, overlapBp: number, sameOpener: boolean, sameSegments: boolean}>} */
  const rows = [];
  for (let a = 0; a < list.length; a += 1) {
    for (let b = a + 1; b < list.length; b += 1) {
      rows.push({ a, b, ...siblingDistance(list[a], list[b]) });
    }
  }
  const overlaps = rows.map((r) => r.overlapBp).sort((x, y) => x - y);
  const mid = Math.floor(overlaps.length / 2);
  return {
    pairs: rows.length,
    minOverlapBp: overlaps[0],
    maxOverlapBp: overlaps[overlaps.length - 1],
    // The median in BASIS POINTS as an integer, the even case averaged and floored — the
    // estate's rule against a float printed as a decimal, kept at the report grain too.
    medianOverlapBp: overlaps.length % 2 === 1
      ? overlaps[mid] : Math.floor((overlaps[mid - 1] + overlaps[mid]) / 2),
    sameOpenerPairs: rows.filter((r) => r.sameOpener).length,
    sameSegmentPairs: rows.filter((r) => r.sameSegments).length,
    nearest: rows.slice().sort((x, y) => y.overlapBp - x.overlapBp)[0] || null,
    why: '',
  };
}

// ── (c) THE EXEMPLAR CITATION RATE ──────────────────────────────────────────────────

/**
 * ⭐ SITTING §T.4: the provenance budget is "≤ 1 citation per unit, and only on a LICENSED
 * holder — SET BY RULE; ⚠ the exemplar citation rate per unit is NOT measured … the budget is
 * provisional until it is read".
 *
 * This reads it, over whichever of the ten leaf registers has RAW PROSE on this machine, using
 * the SAME `provenanceCount` the gate scores a face with — so the exemplar rate and the
 * corpus rate are one ruler and not two.
 *
 * ⛔ THE DENOMINATOR IS PRINTED AND THE ABSENT LEAVES ARE NAMED. `primary/raw` carries the raw
 * text for only some of the ten (the Martin, Tolkien and D&D intermediates were HTML and PDF
 * and the derived numbers are all that survive), so the rate is a measurement over a stated
 * subset and says which leaves it could not read. A rate averaged over "the exemplars" without
 * that denominator would be a figure nobody could check.
 * @param {string} dir the exemplar directory
 */
export function exemplarCitationRate(dir) {
  const raw = path.join(dir, 'raw');
  /** @type {Array<{leaf: string, sentences: number, citations: number, perUnitBp: number}>} */
  const rows = [];
  /** @type {string[]} */
  const absent = [];
  for (const leaf of EXEMPLAR_LEAVES) {
    // The raw files are named with underscores where the fingerprint leaves use hyphens.
    const at = path.join(raw, `${leaf.replace(/-/g, '_')}.txt`);
    if (!existsSync(at)) { absent.push(leaf); continue; }
    const text = readFileSync(at, 'utf8');
    const sentences = sentencesOf(text);
    const citations = sentences.reduce((n, sentence) => n + provenanceCount(sentence), 0);
    rows.push({
      leaf,
      sentences: sentences.length,
      citations,
      perUnitBp: sentences.length ? Math.round((citations * 10000) / sentences.length) : 0,
    });
  }
  const sentences = rows.reduce((n, r) => n + r.sentences, 0);
  const citations = rows.reduce((n, r) => n + r.citations, 0);
  // ⛔ THE NON-VACUITY CONTROL, RUN ON EVERY CALL. A rate of zero from a DEAD DETECTOR and a
  // rate of zero from prose that cites nothing are the same number and opposite findings, and
  // this is the estate's own rule about an instrument that can only answer one way. The probe
  // is one sentence the detector must find, and the report carries the answer beside the rate.
  const probe = provenanceCount('The muster roll is the watch\'s own, and the watch is bought.');
  return {
    executable: rows.length > 0,
    leavesRead: rows.length,
    leavesTotal: EXEMPLAR_LEAVES.length,
    absent,
    rows,
    sentences,
    citations,
    perUnitBp: sentences ? Math.round((citations * 10000) / sentences) : null,
    detectorLive: probe > 0,
    why: rows.length === 0
      ? `NOT-EXECUTABLE: no raw exemplar prose under ${raw}, so no rate can be read`
      : `${rows.length} of ${EXEMPLAR_LEAVES.length} leaf register(s) carry raw prose on this machine`
        + `${probe > 0 ? '' : ' — AND THE DETECTOR IS DEAD: the control sentence scored 0, so the rate below means nothing'}`,
  };
}

// ── (d) THE FIXTURE SECTION — THE INTERESTED FACT, BOTH WAYS, ON BOTH TOWNS ─────────

/**
 * ⭐⭐ SITTING §T.4, THE PEN LINE (agenda C‴), ADOPTED PROVISIONALLY AND OWED THIS PRINT:
 * "⚠ The taste could NOT compose the interested fact both ways: the harness has no fixture
 * section and no `--shapes` … so the side-by-side is OWED at 8a item 5d on the rate-9-2
 * fixture … and the adoption stays provisional until the owner has seen it."
 *
 * THE FOUR STRINGS, on the captured town `rate-9-2` and the clean control `rate-3-0`:
 *   1. THE PLAYER FACE AS COMPILED — the pool's own drawn sentence, filled, audience `player`.
 *   2. THE DM FACE INLINE — the C‴ rendering the owner asked to see REPLACED: a dm-only face
 *      woven into the passage in the player face's place.
 *   3. THE DM'S PEN LINE — the C‴ rendering the chair recommends: the same DM sentence beside
 *      the block, in the slot the DM page already keeps, with the passage untouched.
 *   4. THE COMPILED PASSAGE ON BOTH AUDIENCES, asserted IDENTICAL, which is the property the
 *      pen line buys and the whole reason the chair recommends it.
 *
 * ⛔⛔ THE DM SENTENCE IS THE GATE'S OWN ILLUSTRATION AND IT SAYS SO IN THE OUTPUT. No pool in
 * the corpus carries a `dm-only` face on this row, so there is nothing to draw; the gate builds
 * one from the HOLDER CENSUS's own answer for this town (the kind, the named holder, the
 * standing) and labels it `[gate illustration]` in the printed table. It is never written, never
 * projected and never a corpus byte — the wave's writers author the real one at SURFACES-DM.
 * What the sitting is being shown is the ARRANGEMENT of the two renderings, which is the
 * question C‴ asks, and the arrangement is real whatever the sentence is.
 * ⛔ IT TAKES NO `sourceOf` READER AND RESOLVES THE ROW ITSELF, deliberately: the caller's
 * reader is scoped to ONE pool of ONE block by the loop it lives in, and this fixture is about
 * a NAMED row on a NAMED pair of towns. Reaching for the caller's would have silently measured
 * whichever pool the loop was on.
 * @returns {object}
 */
export function fixtureSection() {
  const block = CORPUS[INTERESTED_ROW.block];
  const pool = block?.pools?.[INTERESTED_ROW.pool];
  if (!Array.isArray(pool) || pool.length === 0) {
    return {
      executable: false,
      why: `NOT-EXECUTABLE: the corpus carries no pool ${INTERESTED_ROW.block} ::`
        + ` ${INTERESTED_ROW.pool}, which is the row SITTING §R c-22 names`,
    };
  }
  const censusRow = ALL_ROWS.get(`${INTERESTED_ROW.block} :: ${INTERESTED_ROW.pool}`) || null;
  /** @type {Array<object>} */
  const towns = [];
  for (const spec of INTERESTED_TOWNS) {
    const settlement = tasteTown(spec);
    const source = censusRow ? sourceOfForTown(censusRow, settlement, {}) : null;
    const player = composeStateProse(CORPUS, INTERESTED_ROW.block, {
      spineKey: INTERESTED_ROW.pool, candidates: [], turns: [], slots: {}, seed: spec.seed, audience: 'player',
    });
    const dm = composeStateProse(CORPUS, INTERESTED_ROW.block, {
      spineKey: INTERESTED_ROW.pool, candidates: [], turns: [], slots: {}, seed: spec.seed, audience: 'dm',
    });
    const interested = Boolean(source && source.standing === 'INTERESTED');
    // ⛔ ONLY AN INTERESTED ROW HAS A DM SENTENCE AT ALL, AND THE CLEAN TOWN IS THE CONTROL.
    // `rate-3-0` resolves the same treasury row to a standing of LICENSED, so its pen slot is
    // EMPTY — which is the whole reason the pair is a pair. A fixture that printed a pen line
    // on both towns would be showing the arrangement without showing what governs it.
    const penSentence = interested && source && source.holder
      ? `The ${source.kind} that keeps this is the ${source.holder}, and the ${source.holder}`
        + ' stands to gain by what it says.'
      : null;
    const passage = player ? player.text : '';
    towns.push({
      label: spec.label,
      seed: spec.seed,
      standing: source ? source.standing : null,
      kind: source ? source.kind : null,
      holder: source ? source.holder : null,
      interested,
      playerCompiled: player ? player.text : null,
      dmCompiled: dm ? dm.text : null,
      dmSentence: penSentence,
      // ⭐ (2) THE INLINE RENDERING (C‴'s "replacement face"): on the DM page the interested
      // fact takes the PLAYER FACE'S PLACE inside the passage, so the two pages carry two
      // different passages. This is the rendering the owner asked to see beside the other.
      renderInline: {
        player: passage,
        dm: penSentence || passage,
        passagesDiffer: Boolean(penSentence),
      },
      // ⭐ (3) THE PEN-LINE RENDERING (C‴ as the chair recommends): the passage is the SAME on
      // both pages and the DM's knowledge rides in the adjacent slot the DM page already keeps.
      renderPenLine: {
        player: passage,
        dm: passage,
        pen: penSentence,
        passagesDiffer: false,
      },
      // (4) THE PROPERTY THE PEN LINE BUYS, measured on the composer's own output.
      passagesIdentical: Boolean(player && dm && player.text === dm.text),
    });
  }
  return {
    executable: true,
    at: `${INTERESTED_ROW.block} :: ${INTERESTED_ROW.pool}`,
    towns,
    // ⛔ THE ARM, NOT THE ILLUSTRATION: on EVERY fixture town the compiled passage must read
    // the same on both audiences. That is the paired-town arm at the passage grain, and it is
    // what makes the pen line's claim ("the compiled passage becomes AUDIENCE-INDEPENDENT") a
    // measurement. A dm-only face woven inline would break it, which is the point.
    pairedTownHolds: towns.every((t) => t.passagesIdentical),
    why: '',
  };
}

// ── (e) `--shapes` — REACHED, NEVER RE-SPELLED ──────────────────────────────────────

/**
 * ⭐ ITEM 5(e): "the `--shapes` report of item 2 reachable from the gate".
 *
 * ⛔ IT SHELLS OUT RATHER THAN IMPORTING, and that is deliberate. `prose-shape-report.mjs` is
 * an ENTRY script that prints a table; importing it would either run it at import time or force
 * it to be split into a lib for one caller. The gate is a REPORT harness, not a hot path, and a
 * subprocess is the honest way to say "this is the other instrument's answer, verbatim" — the
 * lines below are that script's own output and this file re-derives none of them.
 * @param {string|null} corpus a corpus JSON to drive the report on, or null for the product
 */
export function shapeReport(corpus) {
  const args = [path.join(ROOT, 'scripts/prose-shape-report.mjs'), ...(corpus ? ['--corpus', corpus] : [])];
  try {
    const text = execFileSync('node', args, { cwd: ROOT, encoding: 'utf8' });
    return { executable: true, corpus, lines: text.split('\n').filter(Boolean), why: '' };
  } catch (error) {
    const e = /** @type {any} */ (error);
    return {
      executable: false,
      corpus,
      lines: [],
      why: `the shape report exited non-zero: ${String(e.stderr || e.message).split('\n')[0]}`,
    };
  }
}

// ── THE TWO-PHASE RULE OF Part B §21, AS THE GATE'S KEEP-OR-REVERT VERDICT ──────────

/**
 * ⭐⭐ Part B §21.2, ENCODED (owner, 2026-09-08 ~21:2x), and amended by SITTING §T.4.
 *
 * "A lawful set keeps its refinement only if it stays lawful; an unlawful set keeps it if its
 * failure count falls or holds with no new failure; otherwise the set reverts. A set that
 * cannot be made lawful is banked as a refusal row with its faces, never trimmed, and the
 * banked count is printed and only ever falls."
 *
 * ⛔ THE THREE VERDICTS ARE NOT A RANKING. KEEP, REVERT and BANK answer different questions:
 * KEEP and REVERT are about ONE refinement against the draft it replaced; BANK is about a set
 * that has run out of rounds. A gate that folded them into "pass / fail" would lose the fact
 * that a REVERTED set still has its lawful draft and a BANKED set has none.
 *
 * ⛔ "NO NEW FAILURE" IS BY MEASURE NAME AND NOT BY COUNT. Two failures traded one for one
 * would hold the count and pass a count test while the set had moved sideways, which §21.2's
 * "with no new failure" refuses in terms. The names come from `inBandOf`'s `failing[]`.
 *
 * ⚠ AND THE VERDICT IS THE GATE'S, WHICH SITTING §T.4 SAYS IS NOT THE WHOLE ANSWER: the gate
 * read 0 owned findings on all 13 kept refinements at the taste while the blind refuters failed
 * 26 of 42 on grounds no owned arm carries. So a KEEP here is "the gate found nothing", and the
 * chair rules per variant on the refuters' CONFIRMED findings afterwards. The verdict names
 * that limit in its own `why`.
 * @param {{failing: ReadonlyArray<{measure: string}>}} draft the lawful-or-not draft state
 * @param {{failing: ReadonlyArray<{measure: string}>}} refined the state after the refinement
 * @param {{dryRounds?: number}} [options] two consecutive dry rounds bank the set (§21)
 * @returns {{verdict: 'KEEP'|'REVERT'|'BANK', why: string, before: number, after: number,
 *   newFailures: string[], cured: string[]}}
 */
export function keepOrRevert(draft, refined, options = {}) {
  const before = (draft.failing || []).map((f) => f.measure);
  const after = (refined.failing || []).map((f) => f.measure);
  const newFailures = after.filter((m) => !before.includes(m));
  const cured = before.filter((m) => !after.includes(m));
  if ((options.dryRounds || 0) >= 2 && after.length > 0) {
    return {
      verdict: 'BANK',
      why: `two consecutive rounds moved no failing measure and ${after.length} remain:`
        + ' the set is banked as a refusal row with its faces, never trimmed (Part B §21)',
      before: before.length,
      after: after.length,
      newFailures,
      cured,
    };
  }
  if (before.length === 0) {
    return after.length === 0
      ? {
        verdict: 'KEEP',
        why: 'a lawful set stayed lawful, so the refinement keeps — which is the GATE\'s'
          + ' verdict only; the refuters\' findings decide per variant afterwards (SITTING §T.4)',
        before: 0,
        after: 0,
        newFailures,
        cured,
      }
      : {
        verdict: 'REVERT',
        why: `a lawful set became unlawful: ${newFailures.join(', ') || after.join(', ')}`,
        before: 0,
        after: after.length,
        newFailures,
        cured,
      };
  }
  if (newFailures.length === 0 && after.length <= before.length) {
    return {
      verdict: 'KEEP',
      why: `an unlawful set kept its refinement: failures ${before.length} -> ${after.length}`
        + ` with none new${cured.length ? ` (cured ${cured.join(', ')})` : ''}`,
      before: before.length,
      after: after.length,
      newFailures,
      cured,
    };
  }
  return {
    verdict: 'REVERT',
    why: newFailures.length
      ? `the refinement added a failure that was not there: ${newFailures.join(', ')}`
      : `the failure count rose ${before.length} -> ${after.length}`,
    before: before.length,
    after: after.length,
    newFailures,
    cured,
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
 * @param {{arm: string, round: number, base: string|null, variety: number, exemplars: string,
 *   section?: string|null, pools?: string|null, shapes?: boolean, corpus?: string|null}} options
 */
export async function measure(options) {
  const started = Date.now();
  const roster = poolRosterOf({ section: options.section || null, pools: options.pools || null });
  /** @type {Record<string, unknown>} */
  const out = {
    arm: options.arm,
    round: options.round,
    at: new Date().toISOString().slice(0, 19),
    roster: { pools: roster.rows.length, why: roster.why },
    sections: sectionsCoverEveryPool(),
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
  for (const entry of roster.rows) {
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
      // ⭐ ARM Q'S TWO COLUMNS (REWRITE car 8a-6). The arm licenses a qualifier that names a
      // SECOND TYPED FIELD, which it could not see until the walker was handed the pool's own
      // `reads` and the census's ratified `fieldSynonyms`. Both come from the census and
      // neither is invented here.
      readsOf: (key) => (ALL_ROWS.get(`${entry.block} :: ${key}`)?.reads || []),
      vocabularyOf: (key) => fieldSynonymsFor(ALL_ROWS.get(`${entry.block} :: ${key}`) || {}),
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
        // ⭐ (b) THE DISTANCE BESIDE THE DETECTOR (SITTING §T.3 row 8). A5 answers "is this pair
        // a synonym swap"; this answers "how far apart are they", which is what a floor is cut
        // from. Reported at 8a; the floor is set at 8b's fold.
        spread: siblingSpreadOf(faces),
      };
    });
    // ⭐⭐ (a) THE POOL'S RENDERED CORPUS — every unit it composes, joined as one text. This is
    // what the THIRTEEN text-level metrics are scored on; scoring them against one sentence is
    // the defect SITTING §T.5 struck, and the two grains are carried apart from here on.
    const corpusText = units.map((unit) => unit.text).join(' ');
    const band = variants.flatMap((v, i) => facesOf(v)
      .map((face, f) => {
        const grains = bandGrainsOf(face, corpusText, exemplars);
        // The row keeps the FACE grain's shape at the top level so every existing reader —
        // `inBandOf`, the table, the walker's arms — goes on reading a band row, and gains
        // `grains` beside it so the corpus half is never mistaken for the face half.
        return {
          vid: v.vid ?? i, face: f, ...grains.face, grains,
        };
      }));
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
      // ⭐ (a) THE POOL'S CORPUS GRAIN, ONCE PER POOL rather than once per face: the thirteen
      // text-level metrics are a property of the corpus, so repeating them per face would be
      // the same number printed n times — which is how the old defect read as a measurement.
      corpusBand: bandPositionAt(corpusText, exemplars, 'corpus'),
      corpusWords: words(corpusText),
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

  // ⭐ (c) THE EXEMPLAR CITATION RATE — the band the provenance budget is provisional against.
  out.exemplarCitations = exemplarCitationRate(options.exemplars);

  // ⭐ (d) THE FIXTURE SECTION — the interested fact both ways, on both towns.
  out.fixture = fixtureSection();

  // ⭐ (e) THE SHAPE REPORT, reached and never re-spelled.
  out.shapes = options.shapes
    ? shapeReport(options.corpus || null)
    : { executable: false, why: 'the shape report was not asked for (no --shapes)' };

  // ⭐ THE BANKED COUNT, SHRINK-ONLY (Part B §21.2). A banked set is a refusal row with its
  // faces; it is never trimmed, and the count only ever falls. The gate prints it from the
  // pools' own verdicts so nobody has to keep a second list.
  const banked = pools.filter((pool) => pool.verdict === 'FAIL' && (pool.rounds?.draftRounds || 0) >= 2);
  out.banked = {
    count: banked.length,
    pools: banked.map((pool) => `${pool.block} :: ${pool.pool}`),
    rule: 'Part B §21.2: a set that cannot be made lawful is banked as a refusal row with its'
      + ' faces, never trimmed, and this count only ever falls',
  };

  out.seconds = Math.round((Date.now() - started) / 1000);
  return out;
}

/** ONE TABLE PER POOL — the thing a gate agent reads. */
export function tableLines(out) {
  const lines = [
    `PROSE WAVE GATE · arm ${out.arm}${out.round ? ` · round ${out.round}` : ''} · ${out.at}`,
    `  roster: ${out.roster.pools} pool(s) — ${out.roster.why}`,
    `  sections: ${out.sections.sections} leaves cover ${out.sections.pools} pool(s)`
      + ` · unreached ${out.sections.unreached.length} · counted twice ${out.sections.twice.length}`,
    `  projection: ${out.projection.ok ? 'GREEN' : 'RED'} — ${out.projection.detail}`,
    `  exemplar bands: ${out.exemplars.metricsBanded} metric(s) over ${out.exemplars.labels.length} leaves`
      + `${out.exemplars.why ? ` — NOT-EXECUTABLE: ${out.exemplars.why}` : ''}`,
    `  band GRAIN: ${TEXT_LEVEL_METRICS.length} text-level metric(s) on the pool's rendered corpus`
      + ` · ${FACE_LEVEL_METRICS.length} word-level on the face (SITTING §T.5's cure)`,
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
    for (const sib of pool.siblings) {
      lines.push(sib.spread.why
        ? `     sibling SPREAD #${sib.vid}: ${sib.spread.why}`
        : `     sibling SPREAD #${sib.vid}: ${sib.spread.pairs} pair(s) · overlap`
          + ` min ${sib.spread.minOverlapBp} / median ${sib.spread.medianOverlapBp} /`
          + ` max ${sib.spread.maxOverlapBp} bp · same opener ${sib.spread.sameOpenerPairs}`
          + ` · same segments ${sib.spread.sameSegmentPairs}`);
    }
    // ⭐⭐ BOTH GRAINS, PRINTED SIDE BY SIDE (SITTING §T.5's cure). The FACE row is the eight
    // word-level metrics on each face; the CORPUS row is the thirteen text-level metrics on the
    // pool's whole rendered corpus, ONCE. A reader who sees the same face figures on every face
    // is looking at a lexicon that agrees, not at an instrument that cannot tell them apart.
    const banded = pool.band.filter((b) => b.executable);
    if (banded.length) {
      const mean = Math.round((banded.reduce((n, b) => n + (b.meanDistanceFromMedian || 0), 0) / banded.length) * 1000) / 1000;
      lines.push(`     band position FACE grain (${FACE_LEVEL_METRICS.length} word-level metrics):`
        + ` mean distance from the exemplar median ${mean} band-widths`
        + ` · budget ok on ${banded.filter((b) => b.budgetOk).length}/${banded.length}`
        + ` · depth ok on ${banded.filter((b) => b.depthOk).length}/${banded.length}`
        + ` · perfection-suspect ${banded.filter((b) => b.perfectionSuspect).length}`
        + ` · distinct tuples ${new Set(banded.map((b) => `${b.exceeded}/${b.scored}:${b.meanDistanceFromMedian}`)).size}`
        + ` of ${banded.length} face(s)`);
    } else {
      lines.push('     band position FACE grain: NOT-EXECUTABLE');
    }
    const cb = pool.corpusBand;
    lines.push(cb && cb.executable
      ? `     band position CORPUS grain (${TEXT_LEVEL_METRICS.length} text-level metrics over`
        + ` ${pool.corpusWords} word(s)): exceeded ${cb.exceeded}/${cb.scored}`
        + ` · share ${cb.exceededShare} · mean ${cb.meanDistanceFromMedian}`
        + ` · deepest ${cb.deepest ? `${cb.deepest.metric} ${cb.deepest.depth} ${cb.deepest.side}` : 'none'}`
      : `     band position CORPUS grain: NOT-EXECUTABLE${cb && cb.why ? ` — ${cb.why}` : ''}`);
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
  // ⭐ (c) THE EXEMPLAR CITATION RATE — the band the provenance budget is provisional against.
  const ec = out.exemplarCitations;
  lines.push(ec.executable
    ? `  EXEMPLAR CITATION RATE: ${ec.citations} citation(s) over ${ec.sentences} sentence(s)`
      + ` = ${ec.perUnitBp} bp per unit, on ${ec.leavesRead} of ${ec.leavesTotal} leaf register(s)`
      + `${ec.detectorLive ? '' : ' ⛔ THE DETECTOR IS DEAD'}`
    : `  EXEMPLAR CITATION RATE: NOT-EXECUTABLE — ${ec.why}`);
  if (ec.executable) {
    lines.push(`        per leaf: ${ec.rows.map((r) => `${r.leaf} ${r.perUnitBp} bp`).join(' · ')}`);
    lines.push(`        no raw prose on this machine for: ${ec.absent.join(', ') || '(none)'}`);
    lines.push(`        the control sentence scores ${ec.detectorLive ? '> 0, so a zero above is the prose\'s' : '0 — nothing below means anything'}`);
  }
  // ⭐ (d) THE FIXTURE SECTION — the interested fact, both renderings, both towns.
  if (out.fixture.executable) {
    lines.push('');
    lines.push(`  FIXTURE · ${out.fixture.at} · the interested fact rendered BOTH WAYS (SITTING §T.4, agenda C‴)`);
    lines.push(`     the DM sentence below is the GATE'S OWN ILLUSTRATION, built from the holder`);
    lines.push('     census and never projected: what the sitting is shown is the ARRANGEMENT.');
    for (const town of out.fixture.towns) {
      lines.push(`     ── ${town.label} (${town.seed}) · ${town.kind} · holder ${town.holder || '(none)'}`
        + ` · standing ${town.standing}`);
      lines.push(`        1 PLAYER, as compiled     "${quoted(town.playerCompiled)}"`);
      lines.push(`        2 DM, INLINE replacement  "${quoted(town.renderInline.dm)}"`
        + `   [passages differ: ${town.renderInline.passagesDiffer ? 'YES' : 'no'}]`);
      lines.push(`        3 DM, PEN LINE beside     "${quoted(town.renderPenLine.dm)}"`);
      lines.push(`          + pen                   ${town.renderPenLine.pen ? `"${quoted(town.renderPenLine.pen)}"` : '(none: this holder is not interested here)'}`);
      lines.push(`        4 the compiled passage is identical on both audiences: ${town.passagesIdentical ? 'YES' : 'NO'}`);
    }
    lines.push(`     PAIRED-TOWN ARM over the fixture: ${out.fixture.pairedTownHolds ? 'HOLDS' : '⛔ BROKEN'}`);
  } else {
    lines.push(`  FIXTURE: NOT-EXECUTABLE — ${out.fixture.why}`);
  }
  // ⭐ (e) THE SHAPE REPORT.
  if (out.shapes.executable) {
    lines.push('');
    lines.push('  SHAPES (scripts/prose-shape-report.mjs, verbatim):');
    for (const line of out.shapes.lines) lines.push(`    ${line}`);
  } else {
    lines.push(`  SHAPES: NOT-EXECUTABLE — ${out.shapes.why}`);
  }
  lines.push(`  BANKED: ${out.banked.count} set(s) — ${out.banked.pools.join(' · ') || 'none'}`);
  lines.push(`          ${out.banked.rule}`);
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
    section: at('--section', null),
    pools: at('--pools', null),
    shapes: argv.includes('--shapes'),
    corpus: at('--corpus', null),
  });
  delete out.varietyCells;
  for (const line of tableLines(out)) console.log(line);
  // ⛔ THE PACKET IS NAMESPACED BY DOCK AND NEVER CLOBBERS A FOREIGN RUN (SITTING §U c-1).
  const target = packetTargetFor({ arm, out: at('--out', null) });
  const existing = existsSync(target)
    ? (() => { try { return JSON.parse(readFileSync(target, 'utf8')); } catch { return null; } })()
    : null;
  const refusal = packetRefusal({ existing, arm, round: Number(at('--round', 0)) });
  if (refusal) {
    console.error(`  ${refusal}`);
    console.error(`  target ${target}`);
    process.exitCode = 1;
    return;
  }
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, `${JSON.stringify(out, null, 1)}\n`);
  console.log(`  wrote ${target}`);
}

if (process.argv[1] && process.argv[1].endsWith('prose-wave-gate.mjs')) await main();
