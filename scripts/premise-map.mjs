#!/usr/bin/env node
/**
 * premise-map.mjs — the §77 re-charter redundancy machinery (DBE §2.4; ODQ §77/§79).
 *
 * The three §77 redundancies, executable. R1 (dual-family ready queue), R2 (the
 * premise map and scoped truncation) and R3 (pre-ruled conditional forks) are
 * law in DBE §2.4; this file is the machinery that makes each of them checkable
 * instead of asserted, and PACKET_STANDARD's "Premise maps and scoped
 * truncation" section is what obliges a train plan to carry one.
 *
 * CURE PASS (laneREFF, chair-ordered, ODQ §83/§86): R-M1 schema (dependsOn /
 * flagMember / transitive STOP closure incl. flag-slice edges), R-M2 (row-id
 * charset+NFC law, --annex existence check, near-miss conviction), R-D12
 * (contradictory duplicate premises convicted), R-D13 (whole-train citation is
 * a FULL-STOP exit 1), R-D14 (queue entries need real families; the queue
 * binds to the plan's own train), R-D15 (FORKED is its own bucket, never
 * STOP), R-H3 (unknown-key warnings), R-H4 (charset law forecloses `--` ids).
 *
 * THREE SUBCOMMANDS, one per §77 mechanism:
 *
 *   validate <plan.json> [--annex <file>]
 *                                 R2/R3 shape law: every member declares its
 *                                 premises (or premiseFree:true explicitly);
 *                                 forks may target only rows graded
 *                                 UNVERIFIABLE-AT-BASE, on members that cite
 *                                 them; row ids obey the charset law; the
 *                                 dependency graph (dependsOn/flagMember) is
 *                                 well-formed; with --annex, every cited row
 *                                 id must EXIST in the named annex file.
 *   scope <plan.json> <rowId>     R2 truncation calculus with the R-M1
 *                                 transitive closure: STOP = citing members
 *                                 plus everything depending on a stopped OR
 *                                 forked member (dependsOn edges, plus the
 *                                 implicit slice→flagMember edge). FORKED =
 *                                 citing members whose refutation the chair
 *                                 pre-signed (they land as M′ — they are not
 *                                 stopped). LAW-graded citations, an
 *                                 invalid/absent plan, a NEAR-MISS row id, or
 *                                 a truncation that leaves nothing to continue
 *                                 all yield FULL-STOP — the conservative
 *                                 default is structural, not optional.
 *   queue-check <plan.json>       R1: the plan's queue block names the next
 *                                 TWO executor slots, compiled+TTS-simulated,
 *                                 from at least TWO distinct NON-EMPTY
 *                                 families, and slot 1 is this plan's own
 *                                 train.
 *
 * PLAN SCHEMA v2 (authored by the compile lane, checked here, cited in the
 * train plan; the chair signs it with the plan):
 * {
 *   "train":  "wc-1",
 *   "family": "WC",
 *   "annex":  "docs/implementation/preverification/WC-SUBSTRATE.md",
 *   "flagMember": "WC-1F",                          // optional; §2.5 trains only
 *   "members":[
 *     { "name":"WC-1F", "premises":[ { "row":"WCS-001", "grade":"MEASURED-TRUE" } ] },
 *     { "name":"WC-1A", "dependsOn":["WC-1F"],
 *       "premises":[ { "row":"WCS-012", "grade":"MEASURED-TRUE" },
 *                    { "row":"WCS-044", "grade":"UNVERIFIABLE-AT-BASE" } ] },
 *     { "name":"WC-1B", "dependsOn":["WC-1F"], "premiseFree":true, "premises":[] }
 *   ],
 *   "forks":[ { "row":"WCS-044", "member":"WC-1A",
 *               "landsAs":"WC-1A': the narrowed shape, one line" } ],
 *   "queue":[ { "train":"wc-1", "family":"WC", "ttsSimulated":true },
 *             { "train":"rn-1", "family":"RN", "ttsSimulated":true } ]
 * }
 *
 * ROW-ID LAW: after NFC normalization a row id must match /^[A-Z0-9][A-Z0-9._-]*$/
 * (ASCII; no whitespace; no unicode dashes; cannot begin with `-`). A refuted id
 * that matches no citation exactly but matches one after normalization/trim/
 * dash-folding is a NEAR-MISS and forces FULL-STOP — an ambiguous refutation
 * cannot scope.
 *
 * GRADES: MEASURED-TRUE | UNVERIFIABLE-AT-BASE | LAW. A LAW citation marks a
 * member built on design law, and law contamination is never member-local.
 * One row id carries ONE grade plan-wide; contradictory grades are convicted.
 *
 * DEPENDENCY LAW (R-M1): dependsOn names EARLIER members only (declaration
 * order is build order; no self/forward edges). A plan with flagMember is a
 * §2.5-shaped train: every other member must declare dependsOn on it, and
 * scope treats the slice→flag edge as present regardless. Dependents of a
 * STOPPED member stop transitively. Dependents of a FORKED member also stop
 * (conservative: the shape they were built against changes to M′; the chair
 * may continue them by explicit ruling, never by this tool's default).
 *
 * EXITS: 0 = valid / scope computed with a surviving tail; 1 = violation or
 * FULL-STOP verdict; 2 = usage/parse/read failure (no verdict implied). Pure
 * file-in/file-out: this tool touches no git state, no network, no test
 * runner, and is safe beside any live executor.
 */

import { readFileSync } from 'node:fs';

const GRADES = new Set(['MEASURED-TRUE', 'UNVERIFIABLE-AT-BASE', 'LAW']);
const ROW_ID_RE = /^[A-Z0-9][A-Z0-9._-]*$/;
const TOP_KEYS = new Set(['train', 'family', 'annex', 'flagMember', 'members', 'forks', 'queue']);
const MEMBER_KEYS = new Set(['name', 'premises', 'premiseFree', 'dependsOn']);
const PREMISE_KEYS = new Set(['row', 'grade']);
const FORK_KEYS = new Set(['row', 'member', 'landsAs']);
const QUEUE_KEYS = new Set(['train', 'family', 'ttsSimulated']);

function fail(code, msg) {
  console.error(`[premise-map] ${msg}`);
  process.exit(code);
}

function loadPlan(path) {
  let raw;
  try { raw = readFileSync(path, 'utf8'); } catch (e) { fail(2, `cannot read ${path}: ${e.message}`); }
  try { return JSON.parse(raw); } catch (e) { fail(2, `${path} is not valid JSON: ${e.message}`); }
}

/** Fold an id for near-miss comparison ONLY: NFC + trim + unicode dashes → '-'. */
function foldRow(id) {
  return String(id).normalize('NFC').trim().replace(/[‐-―−]/g, '-');
}

function rowIdViolation(id) {
  if (typeof id !== 'string' || id.length === 0) return 'lacks a row id';
  const nfc = id.normalize('NFC');
  if (nfc !== id || !ROW_ID_RE.test(nfc)) {
    return `row id ${JSON.stringify(id)} violates the charset law (NFC ASCII, /^[A-Z0-9][A-Z0-9._-]*$/ — no whitespace, no unicode dashes)`;
  }
  return null;
}

function warnUnknownKeys(plan) {
  const warn = (where, key) => console.error(`[premise-map] WARNING: unknown key ${JSON.stringify(key)} in ${where} — ignored (typo of a lawful field dies silently without this line)`);
  for (const k of Object.keys(plan)) if (!TOP_KEYS.has(k)) warn('plan', k);
  for (const m of Array.isArray(plan.members) ? plan.members : []) {
    if (m && typeof m === 'object') for (const k of Object.keys(m)) if (!MEMBER_KEYS.has(k)) warn(`member ${m.name ?? '?'}`, k);
    for (const p of Array.isArray(m?.premises) ? m.premises : []) {
      if (p && typeof p === 'object') for (const k of Object.keys(p)) if (!PREMISE_KEYS.has(k)) warn(`premise of ${m.name ?? '?'}`, k);
    }
  }
  for (const f of Array.isArray(plan.forks) ? plan.forks : []) {
    if (f && typeof f === 'object') for (const k of Object.keys(f)) if (!FORK_KEYS.has(k)) warn('a fork', k);
  }
  for (const q of Array.isArray(plan.queue) ? plan.queue : []) {
    if (q && typeof q === 'object') for (const k of Object.keys(q)) if (!QUEUE_KEYS.has(k)) warn('a queue entry', k);
  }
}

function collectViolations(plan, annexText) {
  const v = [];
  if (!plan.train || typeof plan.train !== 'string') v.push('plan.train missing');
  if (!plan.family || typeof plan.family !== 'string') v.push('plan.family missing');
  if (!plan.annex || typeof plan.annex !== 'string') v.push('plan.annex missing (the row ids must have a named home)');
  if (!Array.isArray(plan.members) || plan.members.length === 0) {
    v.push('plan.members missing or empty');
    return v;
  }
  const names = new Set();
  const gradeByRow = new Map(); // row id -> Set of grades, plan-wide
  for (const m of plan.members) {
    if (!m.name || typeof m.name !== 'string') { v.push('a member lacks a name'); continue; }
    if (names.has(m.name)) v.push(`duplicate member name ${m.name}`);
    names.add(m.name);
    if (!Array.isArray(m.premises)) { v.push(`${m.name}: premises must be an array`); continue; }
    if (m.premises.length === 0 && m.premiseFree !== true) {
      v.push(`${m.name}: empty premises without premiseFree:true — silence is not a declaration`);
    }
    if (m.premises.length > 0 && m.premiseFree === true) {
      v.push(`${m.name}: premiseFree:true contradicts its ${m.premises.length} declared premise(s)`);
    }
    const seenRows = new Set();
    for (const p of m.premises) {
      const idBad = rowIdViolation(p?.row);
      if (idBad) { v.push(`${m.name}: a premise ${idBad}`); continue; }
      if (seenRows.has(p.row)) v.push(`${m.name}: duplicate premise row ${p.row} within one member`);
      seenRows.add(p.row);
      if (!GRADES.has(p.grade)) v.push(`${m.name}/${p.row}: grade ${JSON.stringify(p.grade)} is not one of ${[...GRADES].join(' | ')}`);
      else {
        if (!gradeByRow.has(p.row)) gradeByRow.set(p.row, new Set());
        gradeByRow.get(p.row).add(p.grade);
      }
      if (annexText != null && !new RegExp(`(^|[^A-Z0-9._-])${p.row.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^A-Z0-9._-]|$)`, 'm').test(annexText)) {
        v.push(`${m.name}/${p.row}: row id not found in the cited annex — the map's completeness is a compile-verified claim (§77 R2)`);
      }
    }
  }
  for (const [row, grades] of gradeByRow) {
    if (grades.size > 1) v.push(`row ${row} carries contradictory grades (${[...grades].join(' vs ')}) — one row, one grade, plan-wide`);
  }
  // dependency graph (R-M1)
  const order = new Map(plan.members.map((m, i) => [m.name, i]));
  for (const m of plan.members) {
    if (m.dependsOn === undefined) continue;
    if (!Array.isArray(m.dependsOn)) { v.push(`${m.name}: dependsOn must be an array of earlier member names`); continue; }
    for (const d of m.dependsOn) {
      if (typeof d !== 'string' || !order.has(d)) { v.push(`${m.name}: dependsOn names unknown member ${JSON.stringify(d)}`); continue; }
      if (d === m.name) v.push(`${m.name}: dependsOn names itself`);
      else if (order.get(d) >= order.get(m.name)) v.push(`${m.name}: dependsOn ${d} is not an EARLIER member — declaration order is build order`);
    }
  }
  if (plan.flagMember !== undefined) {
    if (typeof plan.flagMember !== 'string' || !order.has(plan.flagMember)) {
      v.push(`flagMember ${JSON.stringify(plan.flagMember)} does not name a member`);
    } else {
      for (const m of plan.members) {
        if (m.name === plan.flagMember) continue;
        if (!Array.isArray(m.dependsOn) || !m.dependsOn.includes(plan.flagMember)) {
          v.push(`${m.name}: a §2.5 flag-train slice must declare dependsOn on the flag member ${plan.flagMember}`);
        }
      }
    }
  }
  for (const f of plan.forks ?? []) {
    if (!f.row || !f.member || !f.landsAs) { v.push('a fork lacks row/member/landsAs'); continue; }
    const m = plan.members.find((x) => x.name === f.member);
    if (!m) { v.push(`fork on ${f.row}: member ${f.member} does not exist`); continue; }
    const p = (m.premises ?? []).find((x) => x.row === f.row);
    if (!p) v.push(`fork on ${f.row}: member ${f.member} does not cite that row`);
    else if (p.grade !== 'UNVERIFIABLE-AT-BASE') {
      v.push(`fork on ${f.row}: grade is ${p.grade} — forks are lawful ONLY on UNVERIFIABLE-AT-BASE premises (§77 R3)`);
    }
  }
  return v;
}

function cmdValidate(path, annexPath) {
  const plan = loadPlan(path);
  warnUnknownKeys(plan);
  let annexText = null;
  if (annexPath) {
    try { annexText = readFileSync(annexPath, 'utf8'); } catch (e) { fail(2, `cannot read annex ${annexPath}: ${e.message}`); }
  }
  const v = collectViolations(plan, annexText);
  if (v.length) {
    for (const line of v) console.error(`[premise-map] VIOLATION: ${line}`);
    fail(1, `${plan.train ?? path}: ${v.length} violation(s)`);
  }
  const forkCount = (plan.forks ?? []).length;
  const annexNote = annexText != null ? ', every cited row present in the annex' : '';
  console.log(`[premise-map] VALID: ${plan.train} — ${plan.members.length} member(s), ${forkCount} signed fork(s), annex ${plan.annex}${annexNote}`);
  process.exit(0);
}

function cmdScope(path, rowId, flags) {
  const plan = loadPlan(path);
  if (!rowId) fail(2, 'scope needs a refuted row id');
  const v = collectViolations(plan, null);
  if (v.length) {
    console.log(`[premise-map] FULL-STOP: the plan fails validation (${v.length} violation(s)) — an unproven map cannot scope a refutation (§77 R2 conservative default)`);
    process.exit(1);
  }
  const citing = plan.members.filter((m) => (m.premises ?? []).some((p) => p.row === rowId));
  const lawCiting = plan.members.filter((m) => (m.premises ?? []).some((p) => p.row === rowId && p.grade === 'LAW'));
  if (flags.has('--law') || lawCiting.length > 0) {
    console.log(`[premise-map] FULL-STOP: ${rowId} is LAW-shaped${lawCiting.length ? ` (cited as LAW by ${lawCiting.map((m) => m.name).join(', ')})` : ' (--law)'} — law contamination is never member-local`);
    process.exit(1);
  }
  if (citing.length === 0) {
    // near-miss law (R-M2): an id that matches only after normalization cannot scope.
    const near = [];
    for (const m of plan.members) {
      for (const p of m.premises ?? []) {
        if (p.row !== rowId && foldRow(p.row) === foldRow(rowId)) near.push(`${m.name} cites ${JSON.stringify(p.row)}`);
      }
    }
    if (near.length) {
      console.log(`[premise-map] FULL-STOP: ${JSON.stringify(rowId)} is a NEAR-MISS (${near.join('; ')} — equal after normalization, not byte-equal) — an ambiguous refutation cannot scope (§77 R2 conservative default)`);
      process.exit(1);
    }
    console.log(`[premise-map] NO-OP: no member of ${plan.train} cites ${rowId}; the refutation voids annex rows, not this train`);
    process.exit(0);
  }
  const forks = (plan.forks ?? []).filter((f) => f.row === rowId);
  const forkedNames = new Set(forks.map((f) => f.member));
  const forked = citing.filter((m) => forkedNames.has(m.name));
  const stopped = new Set(citing.filter((m) => !forkedNames.has(m.name)).map((m) => m.name));
  // R-M1 transitive closure: dependsOn edges plus the implicit slice→flagMember edge.
  // Dependents of a STOPPED member stop; dependents of a FORKED member also stop
  // (their built-against shape changes to M′) — continuing them is a chair act.
  const stopSeed = new Set([...stopped, ...forked.map((m) => m.name)]);
  const depReason = new Map();
  let grew = true;
  while (grew) {
    grew = false;
    for (const m of plan.members) {
      if (stopped.has(m.name) || forkedNames.has(m.name)) continue;
      const deps = new Set(m.dependsOn ?? []);
      if (plan.flagMember && m.name !== plan.flagMember) deps.add(plan.flagMember);
      for (const d of deps) {
        if (stopSeed.has(d) || stopped.has(d)) {
          stopped.add(m.name);
          depReason.set(m.name, d);
          grew = true;
          break;
        }
      }
    }
  }
  const cont = plan.members.filter((m) => !stopped.has(m.name) && !forkedNames.has(m.name));
  if (cont.length === 0 && forked.length === 0) {
    console.log(`[premise-map] FULL-STOP: every member of ${plan.train} stops on refuted ${rowId} (cited or dependency-reached, no signed fork survives) — nothing continues`);
    process.exit(1);
  }
  console.log(`[premise-map] SCOPED TRUNCATION for ${plan.train} on refuted ${rowId}:`);
  console.log(`  STOP:     ${stopped.size ? [...stopped].map((n) => depReason.has(n) ? `${n} (depends on ${depReason.get(n)})` : n).join(', ') : '(none)'}`);
  for (const f of forks) console.log(`  FORKED:   ${f.member} lands as → ${f.landsAs} (chair-signed §77 R3 — continues in the altered shape, not stopped)`);
  console.log(`  CONTINUE: ${cont.length ? cont.map((m) => m.name).join(', ') : '(none beyond the forked member)'}`);
  console.log('  The surviving tail RE-CHAINS by exact-manifest cherry-pick (never lands its original commits); the disposition rides the receipt into the chair CAS collection.');
  process.exit(0);
}

function cmdQueueCheck(path) {
  const plan = loadPlan(path);
  const q = plan.queue;
  if (!Array.isArray(q) || q.length < 2) fail(1, 'R1 VIOLATION: the queue block must name at least the next TWO executor slots');
  const head = q.slice(0, 2);
  for (const [i, e] of head.entries()) {
    if (!e || typeof e.train !== 'string' || e.train.length === 0) fail(1, `R1 VIOLATION: queue slot ${i + 1} lacks a train name`);
    if (typeof e.family !== 'string' || e.family.length === 0) fail(1, `R1 VIOLATION: queue slot ${i + 1} (${e.train}) lacks a non-empty family — a family-less slot cannot prove diversity`);
  }
  if (typeof plan.train !== 'string' || q[0].train !== plan.train) {
    fail(1, `R1 VIOLATION: queue slot 1 is ${JSON.stringify(q[0].train)} but this plan is ${JSON.stringify(plan.train)} — the queue block binds to its own train`);
  }
  const families = new Set(head.map((e) => e.family));
  const unsimulated = head.filter((e) => e.ttsSimulated !== true);
  if (families.size < 2) fail(1, `R1 VIOLATION: the next two slots are one family (${[...families].join('')}) — a STOP there stalls the pipeline`);
  if (unsimulated.length) fail(1, `R1 VIOLATION: not TTS-simulated: ${unsimulated.map((e) => e.train).join(', ')}`);
  console.log(`[premise-map] R1 HOLDS: next two slots ${q[0].train}(${q[0].family}) + ${q[1].train}(${q[1].family}), both TTS-simulated`);
  process.exit(0);
}

const argv = process.argv.slice(2);
const [cmd, file] = argv;
const rest = argv.slice(2);
const flags = new Set();
let annexPath;
let rowId;
for (let i = 0; i < rest.length; i += 1) {
  const a = rest[i];
  if (a === '--annex') { annexPath = rest[i + 1]; i += 1; }
  else if (typeof a === 'string' && a.startsWith('--')) flags.add(a);
  else if (rowId === undefined) rowId = a;
}
if (cmd === 'validate' && file) cmdValidate(file, annexPath);
else if (cmd === 'scope' && file) cmdScope(file, rowId, flags);
else if (cmd === 'queue-check' && file) cmdQueueCheck(file);
else fail(2, 'usage: premise-map.mjs validate <plan.json> [--annex <file>] | scope <plan.json> <rowId> [--law] | queue-check <plan.json>');
