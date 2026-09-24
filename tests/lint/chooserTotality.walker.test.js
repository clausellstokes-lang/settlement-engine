/**
 * chooserTotality.walker.test.js — HB-1. THE CHOOSER-TOTALITY STOP LAW, MADE MACHINERY,
 * and the owner's named-domain checklist asserted three separate ways.
 *
 * ⛔ THE LAW: every weighted decision fork in `src/domain` is classified in the habit fork
 * registry. A fork that lands unclassified REDS, and a wave that finds one STOPS.
 *
 * ── THE PARTITION HAS TWO HALVES AND ONE OF THEM IS BLIND ───────────────────────
 *
 * `discovered` is what the FOUR idiom signatures find: the softmax-and-sample pair, the
 * keyed race, an inline extremum over a computed score array, and the explicit register of
 * guard-chain choosers. `classified` is every registry row that is not a checklist row.
 * The two are asserted EXACTLY equal, both directions.
 *
 * ⚠ THE WALKER'S OWN BLIND SPOT, DECLARED rather than discovered later: an argmin over a
 * cost computed in a helper the scan cannot follow, a Bernoulli chance gate, and any fork
 * expressed as an if/else ladder over thresholds are NOT discoverable by signature. Those
 * are covered by the registry's hand-maintained checklist rows, which carry their own
 * totality assertion below — a declared blind spot with a second instrument beside it,
 * never a silent hole.
 *
 * ⭐⭐ THE ROOT-SET SELF-ASSERTION (and it earned its keep on its first run). The scan roots
 * are DECLARED here and then checked against the tree: any `src/domain/*` directory holding
 * a live idiom signature must be one of them. The failure mode this closes was never a
 * missed file, it was a missed PLACE — a totality walker whose roots miss a whole domain
 * directory does not report a gap, it reports SUCCESS. The volume widened its roots once
 * already, for a faith fork living outside them; this arm caught a second directory the
 * widening had missed, holding the very contest one of the owner-named rows depends on.
 *
 * ⭐⭐ U10 — THE THIRD HALF, AND THE PLACE THE ROOT MECHANISM COULD NOT EXPRESS. Judgment
 * 282 measured that this walker could not admit `src/domain/rulingPowerCoup.js` AT ALL: the
 * root-set arm keyed a file's place by its first THREE path segments, which for a top-level
 * domain file is the FILE, while `IN_ROOTS` keyed membership by `startsWith(root + '/')`,
 * which no `SCAN_ROOTS` value could satisfy for that same file. Two keyings, one tree, and
 * the owner-named coup verdict fell between them — an instrument gap, not a cured fork. It
 * is closed here by ONE place function used by BOTH (`placeOf` below), and `src/domain`
 * itself joins the roots as the top-level files' place. MEASURED INERT for the weighted
 * half at this tip: +109 files enter the scan and DISCOVERED stays 30, the identical set.
 *
 * ⛔ AND THE BARE HALF ITSELF, DECLARED RATHER THAN DISCOVERED. Judgment 282 rules the
 * coup's two unweighted uniforms STAY BARE, and judgment 265 (c) sends the processes design
 * §19 ruling 3 named that resolve on a keyed HASH or draw NOTHING to the same place: the
 * registry's `discovery: 'bare'` rows. Those rows are not free prose — the U10 arms below
 * re-derive each one from the tree (the site's own slice), hold the bare-DRAW roster
 * SET-EQUAL against the survey's Table 4 "B" column in both directions, and demand that
 * EVERY bare draw anywhere in `src/domain` be placed by a registry row or by a Table 4
 * verdict. A new bare draw reds; a declared-bare fork that acquires a weighted signature
 * reds; a declared-dry process that acquires a draw reds. ⚠ WHAT IT IS NOT: a census of
 * HASHED forks. The two hashed rows are judgment 265 (c)'s two NAMES, and sweeping the tree
 * for every keyed-hash fork is a chair-sized program (judgment 282's own words), with
 * `npcCirculation.js`'s pressure-gated rehost hash as the measured notice that it would
 * find more.
 *
 * ⭐ THE ONE NORMALIZATION POINT. The registry stores EXTENSIONLESS module ids so that it
 * cannot read as an importer to a raw-source scan keyed on a filename. `moduleFile()` below
 * is the single place the `.js` suffix is appended, and the guard-the-guard case proves the
 * append is real work rather than a no-op — an id that already carried the suffix would make
 * this function silently idempotent and the siting cure silently undone.
 *
 * ⚠ DERIVE, DON'T RESTATE. Every denominator below is a QUERY over the registry or the
 * tree. The only hand-written numbers are the two frozen ceilings, which exist precisely so
 * that moving them is a reviewable act rather than a silent one.
 *
 * @enforced-by itself (a source scan plus a registry query; no runtime coupling)
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import { codeOnly as blankCommentsAndStrings } from '../helpers/codeOnlySource.js';

import {
  FORK_ARITIES,
  FORK_CLASS_VOCABULARY,
  FORK_DISPOSITIONS,
  HABIT_FORK_REGISTRY,
  NAMED_DOMAIN_LABELS,
  OWNER_DOMAIN_MAPPING,
} from '../../src/domain/worldPulse/habitForkRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * THE DECLARED ROOTS, which are PLACES rather than prefixes. Checked against the tree
 * below, never trusted.
 * ⭐ `src/domain` JOINED AT U10 and it is the TOP-LEVEL FILES' place, not the whole subtree:
 * membership goes through `placeOf`, so `src/domain/npc/foo.js` still lives in the place
 * `src/domain/npc` and is still outside. Judgment 282 measured the widening INERT for the
 * weighted half (29 = 29 then; +109 files and DISCOVERED 30 = 30 at this tip, the identical
 * set), which is what makes it a place the instrument can finally SEE rather than a census.
 * @type {readonly string[]}
 */
const SCAN_ROOTS = Object.freeze([
  'src/domain/worldPulse',
  'src/domain/spatial',
  'src/domain/traditions',
  'src/domain/region',
  'src/domain',
]);

/** The FOUR idiom signatures. The fourth is a register rather than a scan, by design. */
const IDIOM_SIGNATURES = Object.freeze({
  SOFTMAX_SAMPLE: /\b(?:softmaxWeights|stableSampleByWeight)\s*\(/,
  KEYED_RACE: /\bhash01\s*\(/,
  SCORE_EXTREMUM: /\.sort\(\s*\([^)]*\)\s*=>[^;]*?\b[A-Za-z_$][\w$]*\s*\.\s*(?:[A-Za-z_$][\w$]*)?(?:[Ss]core|[Cc]ost|[Ww]eight)\b[^;]*?\)\s*\[\s*0\s*\]/,
});

/**
 * THE FOURTH SIGNATURE: guard-chain choosers cannot be found by shape, because a chain of
 * early returns looks like any other chain. One member today, and it is registered rather
 * than omitted because it was carried as a learning site in one table while two others
 * already ruled it deterministic.
 */
const GUARD_CHAIN_CHOOSERS = Object.freeze([
  'src/domain/worldPulse/espionage/espionageMath.js#deliberationRead',
]);

/** A module that DECLARES an idiom helper is not using it. */
const DECLARES_IDIOM = /(?:export\s+)?function\s+(?:hash01|softmaxWeights|stableSampleByWeight)\s*\(/;

/**
 * ⭐ U10 — THE BARE SIGNATURE, and it is deliberately NOT one of the four above. It finds a
 * plain uniform off a threaded stream: no weights, no key, nothing a weighted-chooser
 * signature could recognise. It is kept OUT of `IDIOM_SIGNATURES` because a bare draw is
 * not evidence of a fork — most of the estate's are rates, mints and primitives — so it
 * drives a PLACEMENT arm ("every one of these is placed, by a registry row or by the
 * survey's own verdict") rather than the partition's classification law.
 */
const BARE_DRAW = /\.\s*random\s*\(\s*\)/;

/** A module-local hash roll: the shape that resolves a fork while consuming ZERO rng. */
const LOCAL_HASH_ROLL = /\b(?:[A-Za-z_$][\w$]*Roll01|fnv1a32|hashUnit|hash32)\s*\(/;

/**
 * THE DEFER CEILING, exact in BOTH directions. Growth means a fork JOINED the defer list,
 * which the stop law forbids — a newly discovered fork is a chair-sized event, not an
 * automatic deferral. A shrink means a row found its close, and the number moves DOWN in
 * that same commit so the win is banked and the slot cannot be refilled unreviewed. This is
 * the argued-roster idiom, and it is why the constant is a COUNT rather than a list: a list
 * would restate what the registry already answers.
 */
// 29 -> 30 at IN-1c-a (HBF-33, ODQ §85.1); 30 -> 31 at WF-8a (HBF-34, ODQ §350); 31 -> 35 at ENC-1 (HBF-36..HBF-41, ODQ §885.7); 35 -> 36 at
// ENC-4 (HBF-42, the ROAD B ruling) — each move a chair-authorized registry mint landing its
// fork row, never a lane absorbing a discovery. ⭐ HBF-42 is the FOURTH member of the HBF-07 /
// HBF-33 / HBF-34 prose-pick family: the same cured `hash01` pick, copied verbatim a fourth
// time, taking its siblings' disposition rather than a fresh reading. Filing it STAY would rule
// for CHANCE_MEETING alone the question all three leave open, so the four close together.
// 36 -> 77 at EM-E0 (HBF-43..HBF-86, design §19 ruling 1 over the SIM-SEALS survey's Table 4
// "R") — the SAME chair-authorized-mint move as the four above and the largest of them, not a
// lane absorbing anything: the forty-four were found by a chair-commissioned survey, ruled
// registration-owed in the design, and land as forty-one deferrals plus three measured STAYs.
// ⛔ THE CEILING'S MEANING IS UNCHANGED — it is still every DEFER row in both directions — and
// the registration is pinned SEPARATELY below (SURVEY_REGISTRATION_ROWS and its split), so a
// row leaking between the two populations reds even though this one total would absorb it.
// 77 -> 79 at U10 (the unfreeze train, runbook act 6), and it is the SAME chair-authorized
// mint as every move above rather than a lane absorbing a discovery: HBF-87, the coup
// verdict's two bare uniforms that judgment 282 rules STAY BARE, and HBF-88, the court's
// verdict, a genuinely weighted arm resolved on an FNV-1a reading of a labelled key that
// takes no draw at all (judgment 265 (c)). Both were MEASURED at their sites and neither is
// discoverable: that is why they arrive DECLARED. ⛔ The other four U10 rows are STAY and
// touch this number not at all, which is the ceiling working as written: a permanent
// finding is not a deferral.
// 79 -> 83 at WF-0 (FP-ARCHITECTURE-FOLD-2026-09-23.md J-EM-5, the faith registration debt):
// all FOUR of politics.js's pulse-time forks land DEFER (HBF-93 claimRoll, HBF-94 driftDue,
// HBF-95 pickOwner, HBF-96 reexpressed) and touch this number. HBF-95 measures as unweighted
// and codepoint-presorted — the HBF-37/HBF-91 STAY shape, spelled out in its own row — but is
// filed DEFER rather than promoted: a permanent ruling is the chair's to bank, not this
// registration's to presume. The five founding derivations (HBF-97..HBF-101, genesis.js +
// customFounding.js) are STAY and do not touch this number, the same shape U10's four STAY
// rows held against 77 -> 79 above.
// 83 -> 82 at WF-0's RULING FP-14 (the chair, vetoable by the owner): HBF-95 (pickOwner)
// re-files STAY on the HBF-37/HBF-91 precedent — the chair banking exactly the measurement
// this wave's own row already carried, with a re-file note ("if WF-2/WF-5 mints a
// tradition-owner direction") living in the row's reason rather than a closeOwed, since a
// STAY row carries none. Three DEFER rows remain from this registration: HBF-93 claimRoll,
// HBF-94 driftDue, HBF-96 reexpressed. No SURVEY_DEFERRED/SURVEY_SETTLED arm moves: HBF-95
// carries domain:'FAITH' and was never a SURVEY_ROWS member (domain === null only).
// 82 -> 84 at FP IN-3 (lane FP-I3, 2026-09-24; SR-1): the wave REGISTERS AT MINT the two forks its
// own leaves create, as its brief's EDITOR line (a) orders: HBF-103 (resolveSweep, the sweep's keyed
// catch draw, WITH its outcome vocabulary SWEEP_OUTCOMES and the pin seam as its closeOwed) and
// HBF-104 (exposedPatronInstitutions, the exposure producer's keyed zero-draw reading, whether it
// takes a pin or a direction owed). Neither is a DISCOVERED fork filed on the way past: both are
// the wave's own, named in the same commit that mints them, and neither presumes a STAY ruling.
const DEFER_CEILING = 84;

/** The named-domain checklist's row count, asserted rather than read off.
 *  14 -> 23 at WF-0: nine FAITH rows (HBF-93..HBF-101) for the traditions registration
 *  debt join HBF-21/HBF-22/HBF-23 — a LATER measurement pass (EM-FP-SEAM-MEASUREMENT.md
 *  §4's draw scan) finding more forks in an already-named domain, not a new domain; the
 *  eight-label set (J-HB-23 (b)) and the owner's seven-domain mapping (J-HB-23 (c)) are
 *  both untouched. */
// 23 -> 24 at FP IN-3 (lane FP-I3, 2026-09-24; SR-1): HBF-103, the sweep's keyed catch draw, joins
// the named-domain checklist under INTER-SETTLEMENT DYNAMICS (a court hunting a neighbour's agents),
// a fork the wave mints and registers at mint; no label and no owner mapping moves.
const NAMED_DOMAIN_ROWS = 24;

/**
 * ⭐⭐ EM-E0 — THE REGISTRATION'S ROSTER IS THE SURVEY'S, AND IT IS PARSED RATHER THAN RESTATED.
 * Design §19 ruling 1 rules that the draws Table 4 marks "R" become registry rows. Restating
 * those forty-four here would make this arm a copy of the thing it checks; the walker reads the
 * survey markdown and derives them, so the survey and the registry are held equal to each other
 * rather than each to a third transcription.
 */
const SURVEY_SOURCE = 'docs/implementation/surveys/SIM-SEALS-SURVEY-2026-09-19.md';

/** `| U-NN | `symbol` · `path:lines` | draws | R? | lands |` — Table 4's row shape. */
const SURVEY_TABLE4_ROW = /^\|\s*(U-\d+)\s*\|\s*`([A-Za-z_$][\w$]*)`[^|]*?·\s*`([^`]+)`\s*\|\s*(\d+)\s*\|([^|]*)\|/gm;

/**
 * The survey's own stated totals, so a parser that silently stopped matching cannot pass.
 * ⭐ RE-RECORDED AT U10, 51 -> 55, AND THE CAUSE IS THE TABLE'S OWN ROOTS. The survey
 * censused six roots and could see neither the TOP-LEVEL `src/domain` files nor the
 * generation directories, so four bare draws were never placed by the one table that claims
 * draw totality — the coup verdict among them. Re-measured over the WHOLE `src/domain` at
 * `799103301`: U-52 (the coup, marked B) plus U-53/54/55 (an id mint and two draw
 * primitives, ruled "no" in the table's own existing idiom). Every row above them is
 * untouched, which is why the second figure does NOT move.
 * ⛔ 44 IS RE-RECORDED UNMOVED, AND THAT IS THE POINT OF A NEW MARK. `**B**` cannot pass the
 * `^\*\*R\*\*` filter, so declaring a draw BARE creates no registration and offers no seal:
 * judgment 282 in the one place a later reader would otherwise have to take on trust.
 */
const SURVEY_SYMBOLS = 55;
const SURVEY_REGISTRATION_ROWS = 44;

/** Of the fifty-five: the bare-draw roster, held set-equal to the registry's bare rows. */
const SURVEY_BARE_ROWS = 1;

/** Of the forty-four: three are measured NON-choosers (rng readers and weighted-sample helpers). */
const SURVEY_DEFERRED = 41;
const SURVEY_SETTLED = 3;

/** How many rows in the WHOLE registry declare an outcome vocabulary. Exact, both directions. */
// ⭐ 5 -> 6 AT EM-E0b, AND IT IS A WIN BANKED IN THE SAME COMMIT rather than a bump. This
// arm's own message says growth means "a fork learned to name its own outcomes", and that is
// exactly what happened: EM-E7 landed `STAY_DETECTION_OUTCOMES` as an EXPORT of the draw's
// OWN module (`espionageGauntlet.js`, beside `STAY_DETECTION_FORK_ID`) and pinned HBF-05's
// null so the hand-off could not be lost; this member moves the row, which is the order
// design §19 ruling 1 asks and HBF-44's `closeOwed` spells — the export first, the row after.
// ⛔ THE REGISTRATION'S OWN FOUR ARE UNMOVED AT FOUR, and that is structural rather than
// lucky: HBF-05 carries `discovery: 'idiom'`, so it is not a SURVEY_ROW and neither the
// set-equality against Table 4 nor the registration's DEFER/STAY split can absorb it. The
// row is held to the STRICTER form regardless, because arm (b) resolves the name BY IMPORT
// off `moduleFile(row)` — HBF-05's own module — so `offModule` stays one row long and HBF-17
// is still the estate's only off-module declaration.
// 6 -> 7 AT FP IN-2 (lane FP-I, 2026-09-24; SR-1), the same banked win: IN-2 adds HBF-72's
// LIE_OUTCOMES (told, believed, caught), minted in infoLure.js beside the one exposure law and
// re-exported by informationStatecraft.js, the fork's own module, so arm (b) resolves it there.
// 7 -> 8 AT FP IN-3 (lane FP-I3, 2026-09-24; SR-1), the same banked win: HBF-103 declares
// SWEEP_OUTCOMES (clean_miss, false_accusation, caught), minted in counterIntelSweep.js, the fork's
// own module, beside the producer that answers one of the three for every sweep.
const ROWS_WITH_ACTION_VOCABULARY = 8;

/**
 * Table 4's rows as `module.js#symbol`, split by the "R" (registration owed) and "B" (bare,
 * U10) marks. `placed` is EVERY row's key whatever its mark, because the table's "no — …"
 * verdicts place a draw just as finally as a registration does, and the bare-draw totality
 * arm below is only honest if it reads them.
 */
function surveyTable4() {
  const raw = readFileSync(join(ROOT, SURVEY_SOURCE), 'utf8');
  const all = [...raw.matchAll(SURVEY_TABLE4_ROW)];
  const keyOf = (m) => `src/domain/${m[3].replace(/:.*$/, '')}#${m[2]}`;
  const owed = all.filter((m) => /^\*\*R\*\*/.test(m[5].trim())).map(keyOf);
  const bare = all.filter((m) => /^\*\*B\*\*/.test(m[5].trim())).map(keyOf);
  return {
    all, owed: [...owed].sort(), bare: [...bare].sort(), placed: new Set(all.map(keyOf)),
  };
}

/**
 * ⭐ THE PARTITION KEY, DERIVED FROM ONE FACT rather than from a second roster. A checklist row
 * WITH an owner-named domain is the owner's named-domain instrument; a checklist row WITHOUT one
 * is EM-E0's registration. Nothing else in the registry has that shape, which is what lets both
 * populations be counted without either being restated here.
 */
const SURVEY_ROWS = HABIT_FORK_REGISTRY
  .filter((row) => row.discovery === 'checklist' && row.domain === null);
const VOCABULARY_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.actionVocabulary !== null);

/**
 * ⭐ U10 — THE BARE HALF: rows DECLARED because nothing can discover them (judgment 282 for
 * the coup, judgment 265 (c) for the hashed and the dry). Each row's opening sentence is a
 * CLAIM ABOUT THE TREE, and `bareFamilyOf` below re-derives which of the three the tree
 * actually says, so the sentence cannot drift away from the site it describes.
 */
const BARE_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.discovery === 'bare');

/** The three families, in the words a row must open with. */
const BARE_DRAW_SENTENCE = 'A BARE DRAW.';
const BARE_HASHED_SENTENCE = 'HASHED, NOT DRAWN.';
const BARE_DRY_SENTENCE = 'NO WEIGHT, NO FORK.';

/**
 * ⭐ THE ONE NORMALIZATION POINT between the registry's extensionless ids and the tree's
 * real filenames. Nothing else in this file appends a suffix.
 * @param {{ module: string }} row @returns {string}
 */
function moduleFile(row) {
  return `${row.module}.js`;
}

/**
 * A repo-relative module path as an ABSOLUTE file URL, for the vocabulary arm's dynamic import.
 * ⛔ NOT a second normalization point — it appends no suffix and takes a path `moduleFile()`
 * already made. It exists because a bare `import(\`../../${p}\`)` carries no static extension,
 * which the bundler's dynamic-import analysis cannot follow and warns on; an absolute file URL
 * is resolved by the runtime alone and is what the import really means.
 * @param {string} rel @returns {string}
 */
function moduleUrl(rel) {
  return pathToFileURL(join(ROOT, rel)).href;
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

/**
 * ⛔ THE STRIP IS THE ESTATE'S OWN, NOT A SECOND SPELLING OF IT — and the first cut of this
 * cure WAS that second spelling, which is why the retirement is recorded rather than
 * quietly done. `codeOnly` already existed, already blanked comments AND string text with
 * offsets preserved, already kept template `${...}` interpolations standing, and was
 * already imported by ten files; it lived in a `.test.js`, so adopting it cost a lighting
 * census re-freeze (a test-file import re-registers that file's suites). The body moved to
 * `tests/helpers/codeOnlySource.js`, the old home re-exports it, and this walker imports it
 * — one guard, one spelling, no register moved.
 *
 * ⛔ WHY THIS WALKER NEEDS IT AT ALL, AND IT IS THIS ESTATE'S OWN LAW AT ITS SEVENTH SITE.
 * The claim here is a USE claim ("does this module INVOKE a weighted-chooser idiom"), and
 * for a use claim a string is a CITATION: a call cannot execute from inside a quoted
 * literal. The comment strip already conceded that for prose. The registry is the file that
 * proves the concession was incomplete — `habitForkRegistry.js` lives inside a scan root and
 * every row DESCRIBES an idiom in a `reason` string, so the moment a row quoted a call with
 * its own open paren the totality walker CONVICTED ITS OWN REGISTRY, minting
 * `habitForkRegistry.js#HABIT_FORK_REGISTRY` as a "discovered fork" that can never be
 * classified because it is not a fork. Three earlier rows escaped only by punctuation — they
 * spell the name with the paren on the wrong side — so the hole was live and invisible from
 * the registry's first commit.
 */

/**
 * Comments, string-literal text and import specifiers blanked, OFFSETS AND LINES PRESERVED.
 * Without this the scan reads a JSDoc mention, a quoted citation and an import line as uses —
 * the narrower-than-claim defect class in its other direction.
 *
 * ⛔ HORIZONTAL WHITESPACE ONLY, AND THE CLASS `[ \t]` IS THE WHOLE CURE. The mask replaces its
 * match with spaces of the same LENGTH, so any newline it swallows comes back as a SPACE.
 * Anchored `^\s*` under the multiline flag it swallowed the blank line standing above an
 * import — `\s` matches `\n` — and the blanked blob lost lines while keeping every offset, so
 * the length pin in the arm above stayed green over it. `[^\n]*?` already holds the body to
 * one line; the two `\s` classes were the whole leak. MEASURED before the cure, over every
 * file this walker reads: 26,345 newlines destroyed across 700 of 1,057 files, with the
 * walker's FINDINGS identical either way. Pinned by the line-structure arm below.
 * @param {string} src @returns {string}
 */
function codeOnly(src) {
  return blankCommentsAndStrings(src).replace(
    /^[ \t]*(?:import|export)\b[^\n]*?from[ \t]*['"][^'"]*['"];?[^\n]*$/gm,
    (m) => ' '.repeat(m.length),
  );
}

/** The top-level declaration boundaries of a blanked module, in source order. */
const TOP_LEVEL_DECL = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/gm;

/** The nearest preceding top-level declaration name at an offset. */
function enclosingSymbol(code, index) {
  let best = null;
  for (const m of [...code.matchAll(new RegExp(TOP_LEVEL_DECL.source, 'gm'))]) {
    if (m.index > index) break;
    best = m[1] || m[2];
  }
  return best;
}

/**
 * ⭐ U10 — A SYMBOL'S OWN SLICE, which is the unit a bare row's claim is made about. A
 * module-wide read would be the wrong instrument and the measurement says so: the exile's
 * landing carries no roll, while two OTHER symbols in its module do. Runs from a top-level
 * declaration to the next one, over the blanked source, so a citation in a neighbour's
 * comment cannot answer for this symbol.
 * @param {string} code @returns {Map<string, string>}
 */
function symbolSlices(code) {
  const marks = [...code.matchAll(new RegExp(TOP_LEVEL_DECL.source, 'gm'))]
    .map((m) => ({ name: m[1] || m[2], at: m.index }));
  /** @type {Map<string, string>} */
  const slices = new Map();
  for (let i = 0; i < marks.length; i += 1) {
    const end = i + 1 < marks.length ? marks[i + 1].at : code.length;
    slices.set(marks[i].name, code.slice(marks[i].at, end));
  }
  return slices;
}

/**
 * ⭐⭐ U10 — THE ONE PLACE KEY, and the gap it closes was two keyings of the same idea. A
 * file's PLACE is its directory under `src/domain`, which for a TOP-LEVEL domain file is
 * `src/domain` itself rather than the file's own name. The root-set arm and `IN_ROOTS` both
 * go through this, so a root that the arm would demand is a root membership can honour —
 * which `startsWith(root + '/')` could never be for a top-level file (judgment 282).
 * @param {string} rel @returns {string}
 */
function placeOf(rel) {
  const segments = rel.split('/');
  return segments.length > 3 ? segments.slice(0, 3).join('/') : segments.slice(0, 2).join('/');
}

const DOMAIN_FILES = walk(join(ROOT, 'src/domain'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

const IN_ROOTS = DOMAIN_FILES.filter((rel) => SCAN_ROOTS.includes(placeOf(rel)));

/** Every `module#symbol` a signature finds inside the declared roots. */
function scanIdiomForks(files) {
  const found = new Set();
  for (const rel of files) {
    const code = codeOnly(readFileSync(join(ROOT, rel), 'utf8'));
    if (DECLARES_IDIOM.test(code)) continue;
    for (const re of Object.values(IDIOM_SIGNATURES)) {
      for (const m of code.matchAll(new RegExp(re.source, 'g'))) {
        found.add(`${rel}#${enclosingSymbol(code, m.index) || '<module>'}`);
      }
    }
  }
  return [...found].sort();
}

/**
 * ⭐ U10 — every `module#symbol` taking a BARE uniform, over the WHOLE `src/domain` rather
 * than the declared roots. The roots exist to bound the CLASSIFICATION law; placement is
 * cheap and total, so this one asks the whole tree and every answer must be placed.
 * @returns {Map<string, number[]>} key -> the 1-based lines it draws on
 */
function scanBareDraws() {
  /** @type {Map<string, number[]>} */
  const found = new Map();
  for (const rel of DOMAIN_FILES) {
    const code = codeOnly(readFileSync(join(ROOT, rel), 'utf8'));
    if (DECLARES_IDIOM.test(code)) continue;
    for (const m of code.matchAll(new RegExp(BARE_DRAW.source, 'g'))) {
      const key = `${rel}#${enclosingSymbol(code, m.index) || '<module>'}`;
      found.set(key, [...(found.get(key) || []), code.slice(0, m.index).split('\n').length]);
    }
  }
  return found;
}

const DISCOVERED = [...new Set([...scanIdiomForks(IN_ROOTS), ...GUARD_CHAIN_CHOOSERS])].sort();
const BARE_SITES = scanBareDraws();
const BARE_DISCOVERED = [...BARE_SITES.keys()].sort();
/**
 * ⛔ THE PARTITION'S OWN HALF IS THE SIGNATURE-BACKED KINDS, NAMED rather than negated. It
 * read `discovery !== 'checklist'` while there were two kinds and a third arriving would
 * have joined this side silently and convicted the partition of a phantom: U10's `bare` is
 * that third kind, so the membership is now positive and the exhaustiveness is asserted.
 */
const SIGNATURE_KINDS = Object.freeze(['idiom', 'guard-chain']);
const CLASSIFIED = HABIT_FORK_REGISTRY
  .filter((row) => SIGNATURE_KINDS.includes(String(row.discovery)))
  .map((row) => `${moduleFile(row)}#${row.symbol}`)
  .sort();
const CHECKLIST_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.discovery === 'checklist');
const DOMAIN_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.domain !== null);

/** module#symbol -> its rows, for the two uniqueness arms. */
const BY_SYMBOL = new Map();
for (const row of HABIT_FORK_REGISTRY) {
  if (!row.symbol) continue;
  const key = `${moduleFile(row)}#${row.symbol}`;
  BY_SYMBOL.set(key, [...(BY_SYMBOL.get(key) || []), row]);
}

describe('HB-1 — the chooser-totality partition and the named-domain checklist', () => {
  test('the scan, the roots, the registry and the normalization are all real (guard the guard)', () => {
    // Every absence and every equality below is worthless if the walk, the detectors or the
    // registry silently emptied. The positive control is a chooser everyone agrees is
    // there: the estate's anchor softmax.
    expect(DOMAIN_FILES.length).toBeGreaterThan(400);
    expect(IN_ROOTS.length).toBeGreaterThan(300);
    expect(HABIT_FORK_REGISTRY.length).toBeGreaterThan(20);
    expect(Object.keys(IDIOM_SIGNATURES)).toHaveLength(3);
    expect(DISCOVERED).toContain('src/domain/worldPulse/settlementStrategy.js#evaluateSettlementStrategyRules');
    expect(DISCOVERED.length).toBeGreaterThan(GUARD_CHAIN_CHOOSERS.length);
    // ⭐ U10 — THE PLACE KEY IS REAL WORK IN BOTH SHAPES, and the top-level case is the whole
    // reason it exists: a three-segment key answers a top-level file with its own FILENAME,
    // which no root can ever equal, and the coup verdict fell through exactly that hole.
    expect(placeOf('src/domain/rulingPowerCoup.js')).toBe('src/domain');
    expect(placeOf('src/domain/worldPulse/espionage/espionageMath.js')).toBe('src/domain/worldPulse');
    expect(placeOf('src/domain/npc/npcOps.js')).toBe('src/domain/npc');
    expect(IN_ROOTS, 'the widened roots stopped admitting the coup file').toContain('src/domain/rulingPowerCoup.js');
    // anchored: the line above proves IN_ROOTS is populated and holds the coup file, so this absence is a real exclusion rather than an empty collection
    expect(IN_ROOTS, 'the place key widened into a whole subtree: a generation directory is NOT a declared root').not.toContain('src/domain/npc/npcOps.js');
    // …and the BARE scan is live, with the coup as its positive control. A placement arm
    // over an empty scan is the missed-root failure wearing a different hat.
    expect(BARE_DISCOVERED.length).toBeGreaterThan(30);
    expect(BARE_DISCOVERED).toContain('src/domain/rulingPowerCoup.js#resolveCoupVerdict');
    expect(BARE_SITES.get('src/domain/rulingPowerCoup.js#resolveCoupVerdict'), 'the coup draws twice: the hold roll and the winner sample').toHaveLength(2);
    // anchored: the subject is a LITERAL built on this line and the positive case below runs the same matcher over the same stripper, so a strip that returned nothing reds there
    expect(codeOnly('const r = \'a bare rng.random() draw\';'), 'a quoted CITATION reads as a bare draw').not.toMatch(BARE_DRAW);
    expect(codeOnly('const r = rng.random();'), 'a REAL bare draw stopped being read').toMatch(BARE_DRAW);
    // ⭐ THE STRING STRIP IS PINNED IN BOTH DIRECTIONS, because a strip that blanked one
    // character too many would silently DELETE discoveries and this whole walker would
    // report SUCCESS for the same reason a missed root does. The registry's own row shape
    // is the negative case (it convicted `habitForkRegistry.js#HABIT_FORK_REGISTRY` before
    // the strip existed); a plain call and an INTERPOLATED call are the two positives.
    const stripped = codeOnly(`const reason = 'a keyed hash01(principalId) race';`);
    // anchored: the subject is a LITERAL built on the line above and the length arm below proves the strip returned that exact string rather than nothing
    expect(stripped, 'a quoted CITATION still reads as a use').not.toMatch(/\bhash01\s*\(/);
    expect(stripped, 'the strip changed the line length — offsets no longer line up')
      .toHaveLength(`const reason = 'a keyed hash01(principalId) race';`.length);
    expect(codeOnly(`const roll = hash01(seed);`), 'a REAL call stopped minting')
      .toMatch(/\bhash01\s*\(/);
    expect(
      codeOnly('const key = `${hash01(seed)}`;'),
      'a template INTERPOLATION is code, not text — blanking it would hide a real use',
    ).toMatch(/\bhash01\s*\(/);
    expect(
      codeOnly(`const s = 'it\\'s quoted'; const roll = softmaxWeights(w);`),
      'an ESCAPED quote ended the literal early and swallowed the code after it',
    ).toMatch(/\bsoftmaxWeights\s*\(/);
    // ⭐ THE NORMALIZATION IS REAL WORK, not a no-op. If a row ever carried its own suffix
    // this function would be silently idempotent for it, the registry would read as an
    // importer to every filename-keyed source scan, and the siting cure would be undone
    // without a single assertion changing. Both halves are checked: the append CHANGES the
    // string, and the result RESOLVES to a file on disk.
    for (const row of HABIT_FORK_REGISTRY) {
      expect(moduleFile(row), `${row.forkId} already carried a file extension`).not.toBe(row.module);
      expect(
        existsSync(join(ROOT, moduleFile(row))),
        `${row.forkId} names a module that does not resolve: ${moduleFile(row)}`,
      ).toBe(true);
    }
  });

  test('the import mask keeps the source\'s LINE STRUCTURE, not merely its length', () => {
    // ⛔ THE OTHER HALF OF THE OFFSET PIN ABOVE, AND IT WAS MISSING FOR AS LONG AS THE MASK HAS
    // EXISTED. The strip is LENGTH-preserving, which is all `enclosingSymbol` needs, so the arm
    // above passed while the mask quietly destroyed LINES: it was anchored `^\s*` under the
    // multiline flag, and `\s` MATCHES A NEWLINE, so a blank line standing above an import was
    // swallowed into the match and came back as a SPACE. Offsets survived; the blob stopped
    // being line-addressable. MEASURED at this tip over every file this walker reads: 26,345
    // newlines destroyed across 700 of 1,057 files. `lawBandTable.walker.test.js` docketed the
    // same defect from the outside and named it HB-1's own one-character fix; this is that fix's
    // instrument, and it lives here so the mask cannot silently re-acquire a vertical class.
    const fixture = [
      'const first = 1;',
      '',
      "  import { thing } from './thing.js';",
      'const roll = hash01(seed);',
      '',
    ].join('\n');
    const blanked = codeOnly(fixture);
    expect(blanked, 'the mask stopped preserving offsets').toHaveLength(fixture.length);
    expect(
      blanked.split('\n'),
      'the mask ate the newline of the blank line above the import. Every ^-anchored read of the'
      + ' blanked source below that point is now aimed at the wrong line, and a length-only pin'
      + ' cannot see it: blank the indentation with HORIZONTAL whitespace only.',
    ).toHaveLength(fixture.split('\n').length);
    expect(blanked.split('\n')[2].trim(), 'the import line itself was left unmasked').toBe('');
    expect(blanked.split('\n')[3], 'a real call under a masked import stopped being readable')
      .toBe('const roll = hash01(seed);');
  });

  test('⭐ THE ROOT SET is asserted against the tree — no domain directory with a live idiom escapes it', () => {
    const declared = new Set(SCAN_ROOTS);
    const missed = new Set();
    for (const rel of DOMAIN_FILES) {
      const directory = placeOf(rel);
      if (declared.has(directory)) continue;
      const code = codeOnly(readFileSync(join(ROOT, rel), 'utf8'));
      if (DECLARES_IDIOM.test(code)) continue;
      if (Object.values(IDIOM_SIGNATURES).some((re) => re.test(code))) missed.add(directory);
    }
    expect(
      [...missed].sort(),
      'a src/domain directory holds a live idiom signature and is NOT in SCAN_ROOTS. A'
      + ' totality walker whose roots miss a whole domain directory does not report a gap —'
      + ' it reports SUCCESS. Widen SCAN_ROOTS and classify what the widening discovers.',
    ).toEqual([]);
  });

  test('⭐⭐ THE PARTITION: every discovered fork is classified, and every classified fork is discovered', () => {
    const unclassified = DISCOVERED.filter((key) => !CLASSIFIED.includes(key));
    expect(
      unclassified,
      'an unclassified weighted decision fork is live in the tree. THE STOP LAW: a wave that'
      + ' finds one STOPS — it does not file it as a deferral on the way past.',
    ).toEqual([]);
    const phantom = CLASSIFIED.filter((key) => !DISCOVERED.includes(key));
    expect(
      phantom,
      'the registry classifies a fork no signature finds. Either the symbol moved and the'
      + ' row must be re-aimed, or the row belongs on the CHECKLIST half, which is the'
      + ' hand-maintained instrument for forks no signature can see.',
    ).toEqual([]);
    expect(CLASSIFIED).toEqual(DISCOVERED);
  });

  test('no symbol carries TWO dispositions, and none carries TWO arities', () => {
    // Two assertions over two fields, because a guard over one cannot police the other.
    // The arity arm exists on an executed instance: one chooser read as flatly dyadic in one
    // table and per-action in two others, while all three agreed on the disposition — so the
    // disposition arm passed green on a record that told an implementer to bind a
    // counterpart to ten moves that have none.
    const symbolsWithTwoDispositions = [...BY_SYMBOL]
      .filter(([, rows]) => new Set(rows.map((r) => r.disposition)).size > 1)
      .map(([key]) => key).sort();
    expect(symbolsWithTwoDispositions).toEqual([]);
    const symbolsWithTwoArities = [...BY_SYMBOL]
      .filter(([, rows]) => new Set(rows.filter((r) => r.arity).map((r) => r.arity)).size > 1)
      .map(([key]) => key).sort();
    expect(symbolsWithTwoArities).toEqual([]);
    for (const row of HABIT_FORK_REGISTRY) {
      expect(FORK_DISPOSITIONS).toContain(row.disposition);
      if (row.arity !== null) expect(FORK_ARITIES).toContain(row.arity);
      for (const cls of row.circumstanceClasses) expect(FORK_CLASS_VOCABULARY).toContain(cls);
    }
  });

  test('every DEFER row carries a written close owed, and the defer list is exact', () => {
    const deferred = HABIT_FORK_REGISTRY.filter((row) => row.disposition === 'DEFER');
    const silent = deferred
      .filter((row) => !row.closeOwed || String(row.closeOwed).trim().length < 20)
      .map((row) => row.forkId);
    expect(
      silent,
      'a deferred fork carries no written close owed. An absent reason is how a blind spot'
      + ' signs its own clearance — the deferral has to say what would have to exist.',
    ).toEqual([]);
    expect(
      deferred.length,
      'the defer list CHANGED SIZE. If it GREW, a fork joined it — the stop law forbids that:'
      + ' a newly discovered fork is a chair conversation, not an automatic deferral. If it'
      + ' SHRANK, a row found its close: lower DEFER_CEILING in this same commit so the win'
      + ' is banked and the slot cannot be refilled unreviewed.',
    ).toBe(DEFER_CEILING);
    expect(new Set(HABIT_FORK_REGISTRY.map((row) => row.forkId)).size)
      .toBe(HABIT_FORK_REGISTRY.length);
    // ⛔ NOT ONE ROW SAYS LEARN AT THIS WAVE. The registry is born seeing the whole surface.
    expect(HABIT_FORK_REGISTRY.filter((row) => row.disposition === 'LEARN')).toEqual([]);
  });

  test('J-HB-23 (a) — FOURTEEN named-domain rows, each with a disposition and a non-empty reason', () => {
    expect(
      DOMAIN_ROWS.length,
      'the named-domain checklist changed size. The owner named these domains BY NAME, and a'
      + ' row inside another table is a row that gets lost — a table edit and its count are'
      + ' ONE edit.',
    ).toBe(NAMED_DOMAIN_ROWS);
    for (const row of DOMAIN_ROWS) {
      expect(FORK_DISPOSITIONS, `${row.forkId} has no recognised disposition`).toContain(row.disposition);
      expect(String(row.reason || '').length, `${row.forkId} is dispositioned without a reason`)
        .toBeGreaterThan(40);
    }
    // The checklist half is the declared blind spot's instrument, so it must be non-empty
    // independently of the idiom half — otherwise the "second instrument" is a sentence.
    expect(CHECKLIST_ROWS.length).toBeGreaterThan(0);
  });

  test('J-HB-23 (b) — the label set is SET-EQUAL both directions to the closed explicit eight', () => {
    const used = [...new Set(DOMAIN_ROWS.map((row) => row.domain))].sort();
    // ⛔ A DISTINCT-STRING COUNT IS THE VACUOUS FORM AND IS REFUSED: it passes green on a
    // table that dropped one label and misspelled another twice. This is set equality.
    expect(used).toEqual([...NAMED_DOMAIN_LABELS].sort());
    expect(NAMED_DOMAIN_LABELS).toHaveLength(8);
    expect(new Set(NAMED_DOMAIN_LABELS).size).toBe(NAMED_DOMAIN_LABELS.length);
  });

  test('J-HB-23 (c) — the owner\'s SEVEN spoken domains map TOTAL onto those eight labels', () => {
    const spoken = Object.keys(OWNER_DOMAIN_MAPPING);
    expect(spoken).toHaveLength(7);
    const covered = new Set();
    for (const [domain, labels] of Object.entries(OWNER_DOMAIN_MAPPING)) {
      expect(labels.length, `the owner domain "${domain}" maps to nothing`).toBeGreaterThan(0);
      for (const label of labels) {
        expect(NAMED_DOMAIN_LABELS, `"${domain}" maps to an unknown label ${label}`).toContain(label);
        covered.add(label);
      }
    }
    // TOTAL in both directions: every label is reached by some spoken domain, and the one
    // domain that reaches TWO is exactly why the label count is eight while the owner's is
    // seven. Writing the mapping down is what stops a later round "correcting" one into the
    // other.
    expect([...covered].sort()).toEqual([...NAMED_DOMAIN_LABELS].sort());
    expect(Object.values(OWNER_DOMAIN_MAPPING).filter((labels) => labels.length > 1)).toHaveLength(1);
  });

  test('⭐⭐ EM-E0 (a) — the SURVEY\'S Table 4 "R" roster and the registration are SET-EQUAL, both directions', () => {
    const { all, owed } = surveyTable4();
    // GUARD THE GUARD FIRST. A parser that stopped matching would make the equality below
    // vacuously true against an empty roster, which is the same failure a missed scan root is:
    // it does not report a gap, it reports SUCCESS. Both of the survey's own stated totals are
    // asserted before anything is compared, so the regex cannot quietly drift off the table.
    expect(all, `${SURVEY_SOURCE} — Table 4 stopped parsing`).toHaveLength(SURVEY_SYMBOLS);
    expect(owed, 'the "R" column stopped parsing').toHaveLength(SURVEY_REGISTRATION_ROWS);
    const registered = SURVEY_ROWS.map((row) => `${moduleFile(row)}#${row.symbol}`).sort();
    expect(
      registered,
      'the registration and the survey disagree. A key the SURVEY found and the registry lacks'
      + ' is a draw design §19 ruling 1 rules registration-owed and this file forgot; a key the'
      + ' REGISTRY carries and the survey never found is a row invented here, which is the same'
      + ' defect pointing the other way. The roster belongs to the survey, not to this file.',
    ).toEqual(owed);
    // The registration is DISJOINT from the two instruments that already existed: it adds no
    // owner-named domain row, and it adds nothing a signature can see (all forty-four were
    // found over a WIDER idiom set and WIDER roots than this walker scans, which is exactly
    // why they are checklist rows rather than idiom ones).
    expect(DOMAIN_ROWS.length, 'the registration moved the named-domain checklist').toBe(NAMED_DOMAIN_ROWS);
    expect(registered.filter((key) => DISCOVERED.includes(key)), 'a registered draw IS signature-visible — it belongs on the idiom half').toEqual([]);
  });

  test('⭐ EM-E0 (b) — every declared actionVocabulary RESOLVES BY IMPORT to a non-empty export, and only ONE row\'s lives off its own module', async () => {
    // ⛔ RESOLVED, NOT SPELLED. §16 claimed forty-two forks each carried a typed outcome
    // vocabulary; the survey measured ONE. A name checked against a name would have passed on
    // that claim too, so this arm IMPORTS and reads the binding. A vocabulary that moved
    // module, lost its export or emptied out reds here by fork id.
    expect(
      VOCABULARY_ROWS.length,
      'the count of rows declaring an outcome vocabulary MOVED. Growth means a fork learned to'
      + ' name its own outcomes, which is a win to bank in this same commit; a shrink means a'
      + ' vocabulary was dropped or invented away. Either way it is a reviewable act.',
    ).toBe(ROWS_WITH_ACTION_VOCABULARY);
    /** fork id -> where the words actually live, collected then asserted once. */
    const offModule = [];
    for (const row of VOCABULARY_ROWS) {
      const name = String(row.actionVocabulary);
      // Exactly ONE module may DEFINE the name — the cross-volume collision contract's own
      // claim, checked here rather than trusted. A re-export is not a second definition.
      const definers = DOMAIN_FILES.filter(
        (rel) => new RegExp(`^export\\s+const\\s+${name}\\s*=`, 'm').test(readFileSync(join(ROOT, rel), 'utf8')),
      );
      expect(
        definers,
        `${row.forkId} declares ${name}: exactly one src/domain module must define it, or the`
        + ' registry is naming a word two volumes spell differently.',
      ).toHaveLength(1);
      const own = /** @type {Record<string, unknown>} */ (await import(moduleUrl(moduleFile(row))));
      const onOwnModule = Object.prototype.hasOwnProperty.call(own, name);
      if (!onOwnModule) offModule.push(`${row.forkId}: ${definers[0]}`);
      const mod = onOwnModule ? own : /** @type {Record<string, unknown>} */ (await import(moduleUrl(definers[0])));
      const value = mod[name];
      const size = Array.isArray(value) ? value.length : Object.keys(/** @type {object} */ (value)).length;
      expect(size, `${row.forkId} declares ${name} and it is EMPTY`).toBeGreaterThan(0);
    }
    // ⭐⭐ THE MEASURED DIFFERENCE, PINNED RATHER THAN FLATTENED — and it was this arm's own
    // first run that found it. The estate's ONE pre-EM-E0 declaration names a vocabulary its
    // draw's module does not export and does not even mention: the strategy moves are minted
    // as a DEPENDENCY-FREE leaf by the cross-volume collision contract while the fork spells
    // its branches as literals, which is the estate's design rather than a defect. EM-E0's
    // four are held to the STRICTER form below, so the register is one row long and a second
    // arrival is a chair conversation rather than a paste.
    expect(
      offModule,
      'a row declares an outcome vocabulary that its own draw module does not export. Outside'
      + ' the one registered case that is how a seal comes to name words the module drawing'
      + ' them never types (FINITE-SEMANTICS) — the row owes a measurement, not a declaration.',
    ).toEqual(['HBF-17: src/domain/worldPulse/strategyMoves.js']);
    // …and EM-E0's own four resolve from the DRAW'S OWN MODULE, which is the form design §19
    // ruling 1 asks of a pin: the words a fork is sealed over are typed where it draws them.
    for (const row of SURVEY_ROWS.filter((r) => r.actionVocabulary !== null)) {
      const mod = /** @type {Record<string, unknown>} */ (await import(moduleUrl(moduleFile(row))));
      expect(
        Object.prototype.hasOwnProperty.call(mod, String(row.actionVocabulary)),
        `${row.forkId} declares ${row.actionVocabulary}, which ${moduleFile(row)} does not export`,
      ).toBe(true);
    }
  });

  test('⭐ U18 — a REGISTERED fork\'s declared vocabulary CONTAINS the words its own pin may name', async () => {
    // ⛔ THE CONTRADICTION THIS CLOSES, AND IT WAS LIVE. A row can declare a vocabulary its
    // module really exports and still be naming the WRONG words: EM-E0 (b) above resolves a
    // NAME and is structurally blind to that. HBF-86 declared `SIEGE_FALL_ODDS_WORDS` — the
    // world's honest READING of `pFall`, printed into the receipt — while the words a
    // directive may actually pin are `SIEGE_VERDICT_BANDS`' four bands, which is what design
    // §19 ruling 4 requires a pin to carry. The two lists are DISJOINT, and
    // `tests/simulation/forkSitesConsult.test.js` case E4b-4 already proved every odds word
    // is refused at the fold: the registry was advertising a seal nobody could ever stage.
    // So this arm resolves the FORK rather than the name, for every fork that has one.
    /** The words a vocabulary constant types, however it types them: a list, or an object
     * whose KEYS are the words (`SIEGE_VERDICT_BANDS`) or whose VALUES are
     * (`TRADITION_OUTCOME`). Reading only one side would pass vacuously on the other shape. */
    const wordsOf = (/** @type {unknown} */ value) => (Array.isArray(value)
      ? value.map(String)
      : [...Object.keys(/** @type {object} */ (value)), ...Object.values(/** @type {object} */ (value))]
        .filter((word) => typeof word === 'string'));
    expect(wordsOf(['a']).concat(wordsOf({ b: true })).concat(wordsOf({ c: 'd' })),
      'the reader is proved LIVE on all three shapes, or every membership below is vacuous')
      .toEqual(['a', 'b', 'c', 'd']);

    /** fork id -> the offence, collected then asserted once as a full list. */
    const strangers = [];
    const covered = [];
    for (const row of VOCABULARY_ROWS) {
      const own = /** @type {Record<string, unknown>} */ (await import(moduleUrl(moduleFile(row))));
      for (const [name, value] of Object.entries(own)) {
        if (!/_FORK$/.test(name)) continue;
        const declared = /** @type {{ id?: unknown, outcomes?: unknown }} */ (value);
        if (!declared || typeof declared !== 'object' || declared.id !== row.forkId) continue;
        covered.push(`${row.forkId}:${name}`);
        const words = wordsOf(own[String(row.actionVocabulary)]);
        for (const outcome of /** @type {readonly string[]} */ (declared.outcomes)) {
          if (!words.includes(outcome)) {
            strangers.push(`${row.forkId} may be pinned to "${outcome}", which ${row.actionVocabulary} does not type`);
          }
        }
      }
    }
    expect(strangers, 'a registered fork\'s pin words must be typed by the vocabulary its own'
      + ' registry row declares, or the row advertises a seal whose words the fold refuses;'
      + ' this is the full offender list').toEqual([]);
    // ⭐ AND THE SWEEP IS NOT EMPTY. The two forks that carry a registered `*_FORK` constant
    // today are named, so a fork that loses its constant reds here instead of dropping
    // silently out of the loop above and leaving this arm green over nothing.
    expect(covered.sort(), 'the registered-fork sweep found nothing to check')
      .toEqual(['HBF-85:TRADITION_FORK', 'HBF-86:SIEGE_FORK']);
  });

  test('⭐ EM-E0 (c) — the totality figures RE-DERIVED: the registry, the defer list and the registration\'s own split', () => {
    // Every number here is a QUERY, and each one is exact in both directions so that moving it
    // is a reviewable act. The registration's split is pinned SEPARATELY from DEFER_CEILING
    // because one total would absorb a row leaking between the two populations: forty-four rows
    // arriving while forty-four older ones quietly left would leave the total untouched.
    // ⭐ THE IDENTITY GAINED ITS THIRD TERM AT U10 (86 = 30 + 56 -> 92 = 30 + 56 + 6), and it
    // is the arm that makes a new discovery kind safe: a row that drifts between the three
    // halves moves two of these terms at once, and a kind nobody counted would break the sum
    // rather than hide inside it. The kind vocabulary is asserted closed just below.
    expect(HABIT_FORK_REGISTRY.length)
      .toBe(DISCOVERED.length + CHECKLIST_ROWS.length + BARE_ROWS.length);
    expect(
      [...new Set(HABIT_FORK_REGISTRY.map((row) => String(row.discovery)))].sort(),
      'a FOURTH population arrived: a discovery kind no term of the identity above counts',
    ).toEqual(['bare', 'checklist', 'guard-chain', 'idiom']);
    expect(SURVEY_ROWS.length, 'the registration changed size').toBe(SURVEY_REGISTRATION_ROWS);
    expect(
      SURVEY_ROWS.filter((row) => row.disposition === 'DEFER').length,
      'the registration\'s DEFER count moved. It is born deferring: this wave registers the'
      + ' forks, it does not dispose them.',
    ).toBe(SURVEY_DEFERRED);
    expect(
      SURVEY_ROWS.filter((row) => row.disposition === 'STAY').length,
      'the registration\'s SETTLED count moved. The three are MEASURED non-choosers — an rng'
      + ' reader and two weighted-sample helpers — recorded rather than dropped, on the'
      + ' guard-chain row\'s precedent. A fourth is a chair conversation, not a lane\'s call.',
    ).toBe(SURVEY_SETTLED);
    // …and the registration really is the WHOLE of the checklist half that carries no
    // owner-named domain, derived rather than pinned, so the partition key above cannot
    // silently acquire a third population that neither instrument would then count.
    expect(CHECKLIST_ROWS.length)
      .toBe(CHECKLIST_ROWS.filter((row) => row.domain !== null).length + SURVEY_ROWS.length);
  });

  test('⭐⭐ U10 (a) — EVERY bare draw in src/domain is PLACED, and the declared ones are still bare', () => {
    // ⛔ THE LAW THIS ARM CARRIES, AND IT IS DELIBERATELY WEAKER THAN THE PARTITION'S. A bare
    // uniform is not evidence of a fork: most of the estate's are rates, mints and stream
    // primitives. So the demand is PLACEMENT, not classification — every bare draw is either
    // a habit-fork registry row or a row of the survey's Table 4 carrying that table's own
    // verdict. What it refuses is a bare draw NOBODY has looked at, which is what the coup
    // verdict was until this act: judgment 282 could rule it stays bare precisely because
    // someone measured it, and this arm is what keeps that true of the next one.
    const placed = surveyTable4().placed;
    const registryKeys = new Set(HABIT_FORK_REGISTRY.map((row) => `${moduleFile(row)}#${row.symbol}`));
    const unplaced = BARE_DISCOVERED
      .filter((key) => !registryKeys.has(key) && !placed.has(key))
      .map((key) => `${key} :${(BARE_SITES.get(key) || []).join(',')}`);
    expect(
      unplaced,
      'a BARE DRAW is live in src/domain and no instrument has placed it. Measure the site,'
      + ' then either give it a habit-fork registry row or place it in the survey\'s Table 4'
      + ' with the verdict the measurement supports (a fork, a rate, a mint, a primitive).'
      + ' ⛔ A draw nobody has read is not "bare by decision" — judgment 282 is a ruling over'
      + ' a MEASURED fork, never a licence to skip the measurement.',
    ).toEqual([]);
    // ⭐ AND THE DECLARED ONES ARE STILL BARE, which is the other direction and the one that
    // rots. A bare row whose symbol acquires a weighted signature belongs on the idiom half
    // that same commit — EM-E0 (a)'s "a registered draw IS signature-visible" law, pointed at
    // the half that exists because nothing can see it.
    const nowVisible = BARE_ROWS
      .map((row) => `${moduleFile(row)}#${row.symbol}`)
      .filter((key) => DISCOVERED.includes(key));
    expect(
      nowVisible,
      'a DECLARED-BARE fork now answers an idiom signature: it gained weights the scan can'
      + ' read, so it is discoverable and belongs on the idiom half with a disposition, not'
      + ' on the half reserved for what no instrument can find.',
    ).toEqual([]);
    // …and the roster is not empty, so neither absence above is vacuous.
    expect(BARE_ROWS.length).toBeGreaterThan(0);
  });

  test('⭐ U10 (b) — each bare row\'s OPENING SENTENCE is re-derived from its own site, and the draw roster is the survey\'s', () => {
    // ⛔ WHY A SENTENCE IS AN ASSERTION HERE. U62's register named its writers in prose and
    // was true the day it was written and false three landings later, because nothing
    // re-derived it. These rows make three kinds of claim about the tree — it draws bare, it
    // rolls a hash and takes no draw, it has no roll at all — so the tree is asked which one
    // is true of each site and the row must already say that one.
    /** @type {Map<string, Map<string, string>>} rel -> symbol -> its blanked slice */
    const sliceCache = new Map();
    const sliceOf = (rel, symbol) => {
      if (!sliceCache.has(rel)) sliceCache.set(rel, symbolSlices(codeOnly(readFileSync(join(ROOT, rel), 'utf8'))));
      return (sliceCache.get(rel) || new Map()).get(symbol) || '';
    };
    const bareFamilyOf = (rel, symbol) => {
      const key = `${rel}#${symbol}`;
      if (BARE_DISCOVERED.includes(key)) return BARE_DRAW_SENTENCE;
      const slice = sliceOf(rel, symbol);
      if (LOCAL_HASH_ROLL.test(slice)) return BARE_HASHED_SENTENCE;
      if (Object.values(IDIOM_SIGNATURES).some((re) => re.test(slice))) return 'SIGNATURE-VISIBLE';
      return BARE_DRY_SENTENCE;
    };
    // GUARD THE GUARD: the reader is proved live on all three families before any row is
    // judged by it, over sites this file names rather than over whatever the rows happen to
    // point at — otherwise a slicer that returned '' would call the whole registry dry.
    expect([
      bareFamilyOf('src/domain/rulingPowerCoup.js', 'resolveCoupVerdict'),
      bareFamilyOf('src/domain/worldPulse/npcVerdictTable.js', 'resolveVerdict'),
      bareFamilyOf('src/domain/worldPulse/narrativeTempo.js', 'foldNarrativeTempo'),
    ]).toEqual([BARE_DRAW_SENTENCE, BARE_HASHED_SENTENCE, BARE_DRY_SENTENCE]);
    const wrong = [];
    for (const row of BARE_ROWS) {
      const said = bareFamilyOf(moduleFile(row), String(row.symbol));
      if (!String(row.reason).startsWith(said)) {
        wrong.push(`${row.forkId}: the site says "${said}" and the row opens "${String(row.reason).slice(0, 20)}…"`);
      }
    }
    expect(
      wrong,
      'a bare row\'s opening sentence no longer matches what its own site measures. The three'
      + ' sentences ARE the claim: a dry process that gained a draw, or a bare draw whose'
      + ' uniform moved away, must move its row in the same commit that moved the code.',
    ).toEqual([]);
    // ⭐ THE DRAW FAMILY'S ROSTER BELONGS TO THE SURVEY, exactly as the registration's does:
    // Table 4's "B" column and the registry's bare DRAW rows are one roster read twice, so a
    // name invented here reds as loudly as a bare draw the table placed and this file forgot.
    const { bare } = surveyTable4();
    expect(bare, 'the "B" column stopped parsing').toHaveLength(SURVEY_BARE_ROWS);
    const declaredDraws = BARE_ROWS
      .filter((row) => String(row.reason).startsWith(BARE_DRAW_SENTENCE))
      .map((row) => `${moduleFile(row)}#${row.symbol}`)
      .sort();
    expect(
      declaredDraws,
      'the registry\'s bare DRAW rows and Table 4\'s "B" roster disagree. The roster belongs'
      + ' to the survey: place the draw there first, then declare it here.',
    ).toEqual(bare);
  });
});
