#!/usr/bin/env node
/**
 * premortem.mjs — the only instrument in this estate that runs BEFORE the error.
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * The owner's observation, which is correct: recorded hazard cures keep failing.
 * The diagnosis is that A RECORDED HAZARD IS A DOCUMENT, and a document requires
 * someone to read it at exactly the right moment while doing something else.
 * scripts/hazard-registry.json made the classes machine-readable and gate-checked
 * for INTEGRITY. This file closes the other half: it reads a CHANGESET and says
 * which recorded classes that shape exposes, and what the cure is — at the moment
 * the change exists, without anyone having remembered to go and look.
 *
 * ── THE RULE IT OBEYS ───────────────────────────────────────────────────────
 * DERIVE THE TRIGGER; DO NOT HAND-LIST IT. Every predicate that can read its
 * population out of a repo artifact does so at run time — the bundle metas, the
 * size baseline, the tsc ratchets, the mutation-coverage enumeration rule (the
 * MODULE, imported, not a copy of it), and git itself for renames. The derived /
 * authored ratio is printed on every run, because that ratio is this
 * instrument's predicted shelf life.
 *
 * ── ADVISORY, ON PURPOSE ────────────────────────────────────────────────────
 * Trigger predicates are heuristics and WILL false-positive. This prints loudly
 * and EXITS 0. A noisy blocker gets disabled, and a disabled instrument is worth
 * strictly less than no instrument. The one exception is `--self-check`, which
 * checks the INSTRUMENT rather than the changeset and exits non-zero — see below.
 *
 * ── THE SELF-CHECK, AND WHY IT IS THE POINT ─────────────────────────────────
 * An advisory instrument fails SILENTLY: if a predicate's population goes empty
 * (an artifact moved, a schema changed, a class id was renamed), the run prints
 * "no hazards" and everyone believes it. "I found nothing" and "I looked at
 * nothing" are different sentences. So `--self-check` is wired into `npm run
 * check` and proves, on every gate run:
 *   A. every classId a predicate names RESOLVES in the hazard registry;
 *   B. every artifact a predicate declares as a source EXISTS;
 *   C. every derived population is NON-EMPTY (the anti-vacuity arm);
 *   D. every derived predicate actually FIRES against a synthetic changeset built
 *      from its own live population — a guard that cannot be reddened cannot be
 *      proven, so this reddens it on purpose, every run;
 *   E. EVERY registry class is either covered by a predicate or NAMED in
 *      NOT_CHANGESET_EXPRESSIBLE with a stated reason. A new hazard class
 *      therefore cannot land silently uncovered — the same shape as the
 *      registry's own "a class with no status REDS" arm, one level up.
 *
 * ── LOGGING, AND WHY IT IS NOT OPTIONAL ─────────────────────────────────────
 * Every run appends one JSON row to scripts/.premortem-firings.jsonl with the
 * sha, the changed-file count and the classes named. Without that log we can
 * never answer "did it warn before the class that actually bit", and an
 * instrument whose value cannot be measured gets dropped in a month.
 *
 * ── USAGE ───────────────────────────────────────────────────────────────────
 *   npm run premortem                     # the STAGED set (default)
 *   npm run premortem -- --working        # unstaged + untracked
 *   npm run premortem -- --sha 67f8a58e   # one commit, read against its PARENT
 *   npm run premortem -- --range a..b
 *   npm run premortem -- --files src/x.js tests/y.test.js
 *   npm run premortem -- --json
 *   npm run premortem:retro               # replay the known-ground-truth corpus
 *   npm run validate:premortem            # the self-check (gate step, exits 1)
 *
 * Env seams (for the meta-tests): PREMORTEM_LOG, PREMORTEM_RETRO,
 * HAZARD_REGISTRY_PATH.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { execFileSync } from 'node:child_process';
import {
  PREDICATES, NOT_CHANGESET_EXPRESSIBLE, makeContext, loadEnumerationRule,
} from './lib/premortem-triggers.mjs';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const REGISTRY = process.env.HAZARD_REGISTRY_PATH || path.join(ROOT, 'scripts', 'hazard-registry.json');
const LOG = process.env.PREMORTEM_LOG || path.join(ROOT, 'scripts', '.premortem-firings.jsonl');
const RETRO = process.env.PREMORTEM_RETRO || path.join(ROOT, 'scripts', 'premortem-retro.json');

/** Predicate-count floor: a collapse in coverage is a scope event, not churn. */
const PREDICATE_FLOOR = 20;

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const valOf = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

const git = (args, opts = {}) => execFileSync('git', args, {
  cwd: ROOT, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'], ...opts,
});

// ── Registry ────────────────────────────────────────────────────────────────

function loadRegistry() {
  try {
    const j = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));
    if (!j || !Array.isArray(j.classes)) return null;
    return j;
  } catch { return null; }
}

// ── Changeset resolution ────────────────────────────────────────────────────

/** Parse `--name-status -M` output into change records. */
function parseNameStatus(text) {
  const out = [];
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    const code = parts[0];
    const kind = code[0];
    if (kind === 'R' || kind === 'C') {
      out.push({ status: 'R', path: parts[2], oldPath: parts[1], score: code.slice(1) });
    } else {
      out.push({ status: kind, path: parts[1], oldPath: null, score: null });
    }
  }
  return out;
}

/** Parse a unified diff (-U0) into path -> added lines. */
function parseAdded(text) {
  const map = new Map();
  let cur = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('+++ ')) {
      const p = line.slice(4).replace(/^b\//, '');
      cur = p === '/dev/null' ? null : p;
      if (cur && !map.has(cur)) map.set(cur, []);
    } else if (line.startsWith('+') && !line.startsWith('+++') && cur) {
      map.get(cur).push(line.slice(1));
    }
  }
  return map;
}

/**
 * Resolve the changeset to examine, plus the rev whose ARTIFACTS describe the
 * world being changed. For a commit that is its PARENT — reading today's bundle
 * metas against a commit from last week would prove nothing.
 */
function resolveChangeset() {
  if (has('--files')) {
    const i = argv.indexOf('--files');
    const files = argv.slice(i + 1).filter((a) => !a.startsWith('--'));
    const changes = files.map((f) => {
      let known = true;
      try { git(['cat-file', '-e', `HEAD:${f}`]); } catch { known = false; }
      return { status: known ? 'M' : 'A', path: f, oldPath: null, score: null };
    });
    const added = new Map();
    for (const f of files) {
      const abs = path.join(ROOT, f);
      if (fs.existsSync(abs)) added.set(f, fs.readFileSync(abs, 'utf8').split('\n'));
    }
    return { mode: 'files', sha: null, base: null, changes, added };
  }
  const sha = valOf('--sha');
  if (sha) {
    const full = git(['rev-parse', sha]).trim();
    let base;
    try { base = git(['rev-parse', `${full}^`]).trim(); } catch { base = null; }
    const range = base ? [`${base}`, full] : ['--root', full];
    const ns = base ? git(['diff', '--name-status', '-M', base, full]) : git(['show', '--name-status', '-M', '--format=', full]);
    const df = base ? git(['diff', '-U0', '-M', base, full]) : git(['show', '-U0', '-M', '--format=', full]);
    void range;
    return { mode: 'sha', sha: full, base, changes: parseNameStatus(ns), added: parseAdded(df) };
  }
  const range = valOf('--range');
  if (range) {
    const [a, b] = range.split('..');
    const base = git(['rev-parse', a]).trim();
    const head = git(['rev-parse', b || 'HEAD']).trim();
    return {
      mode: 'range', sha: head, base,
      changes: parseNameStatus(git(['diff', '--name-status', '-M', base, head])),
      added: parseAdded(git(['diff', '-U0', '-M', base, head])),
    };
  }
  if (has('--working')) {
    const changes = parseNameStatus(git(['diff', '--name-status', '-M']));
    const untracked = git(['ls-files', '-o', '--exclude-standard']).split('\n').filter(Boolean);
    for (const u of untracked) changes.push({ status: 'A', path: u, oldPath: null, score: null });
    const added = parseAdded(git(['diff', '-U0', '-M']));
    for (const u of untracked) {
      const abs = path.join(ROOT, u);
      try { added.set(u, fs.readFileSync(abs, 'utf8').split('\n')); } catch { /* binary/unreadable */ }
    }
    return { mode: 'working', sha: null, base: null, changes, added };
  }
  return {
    mode: 'staged', sha: null, base: null,
    changes: parseNameStatus(git(['diff', '--cached', '--name-status', '-M'])),
    added: parseAdded(git(['diff', '--cached', '-U0', '-M'])),
  };
}

// ── Running the predicates ──────────────────────────────────────────────────

async function makeCtx(rev) {
  const ctx = makeContext({ root: ROOT, rev });
  ctx.enumRule = await loadEnumerationRule(ROOT);
  return ctx;
}

/**
 * @returns {{findings: object[], byClass: Map<string, object[]>}}
 */
function runPredicates(ctx, changeset) {
  const findings = [];
  for (const p of PREDICATES) {
    let rows;
    try { rows = p.run(ctx, changeset) || []; } catch (e) {
      rows = [{ severity: 'note', message: `predicate ${p.id} threw: ${e.message}`, evidence: [], predicateError: true }];
    }
    for (const r of rows) {
      findings.push({
        predicate: p.id,
        derivation: p.derivation,
        classIds: r.classIds || p.classIds,
        severity: r.severity || 'warn',
        message: r.message,
        evidence: r.evidence || [],
      });
    }
  }
  // COLLAPSE: one predicate firing eight times on one file is one finding with
  // eight examples, not eight findings. Un-collapsed, a single verbose file
  // drowns the classes that fired once — and volume is how an advisory
  // instrument gets ignored, then disabled.
  const merged = [];
  const seen = new Map();
  for (const f of findings) {
    const key = `${f.predicate}::${f.message.split(':')[0]}`;
    const prior = seen.get(key);
    if (prior) {
      prior.repeats += 1;
      for (const e of f.evidence) if (prior.evidence.length < 6) prior.evidence.push(e);
      continue;
    }
    const row = { ...f, evidence: [...f.evidence], repeats: 1 };
    seen.set(key, row);
    merged.push(row);
  }
  findings.length = 0;
  findings.push(...merged);

  const byClass = new Map();
  for (const f of findings) {
    for (const c of f.classIds.length ? f.classIds : ['(unclassed)']) {
      if (!byClass.has(c)) byClass.set(c, []);
      byClass.get(c).push(f);
    }
  }
  return { findings, byClass };
}

// ── Rendering ───────────────────────────────────────────────────────────────

const BAR = '='.repeat(78);

function cureFor(cls) {
  if (!cls) return null;
  const bits = [];
  if (cls.enforcer && cls.enforcer.note) bits.push(cls.enforcer.note);
  if (cls.upgradePath) bits.push(cls.upgradePath);
  return bits.join(' — ') || null;
}

function render(registry, changeset, result, meta) {
  const idx = new Map((registry ? registry.classes : []).map((c) => [c.id, c]));
  const lines = [];
  lines.push(BAR);
  lines.push('PRE-MORTEM — recorded hazard classes this changeset shape exposes');
  lines.push(`  mode ${changeset.mode}${changeset.sha ? `  sha ${changeset.sha.slice(0, 8)}` : ''}`
    + `${changeset.base ? `  artifacts read at ${changeset.base.slice(0, 8)}` : '  artifacts read from the worktree'}`
    + `  files ${changeset.changes.length}`);
  lines.push(BAR);

  if (changeset.changes.length === 0) {
    lines.push('  (empty changeset — nothing to examine. This is NOT an all-clear.)');
    lines.push(BAR);
    return lines.join('\n');
  }
  if (result.findings.length === 0) {
    lines.push('  No recorded class matched this changeset shape.');
    lines.push('  Read that precisely: it means no PREDICATE fired, not that the change is safe.');
    lines.push(`  ${meta.derived} of ${meta.total} predicates are artifact-derived; the rest are authored`);
    lines.push('  patterns and cover only what someone thought to write down.');
    lines.push(BAR);
    return lines.join('\n');
  }

  const order = [...result.byClass.entries()].sort((a, b) => {
    const w = (rows) => rows.some((r) => r.severity === 'warn') ? 0 : 1;
    return w(a[1]) - w(b[1]) || b[1].length - a[1].length;
  });

  for (const [classId, rows] of order) {
    const cls = idx.get(classId);
    const warn = rows.some((r) => r.severity === 'warn');
    lines.push('');
    lines.push(`${warn ? '!!' : '::'} ${classId}${cls ? ` — ${cls.title}` : ' — (NOT IN THE REGISTRY)'}`);
    if (cls) lines.push(`   status ${cls.status}  |  instances ${cls.instances}  |  enforcer ${(cls.enforcer.paths || []).join(', ') || '(none)'}`);
    for (const r of rows) {
      lines.push(`   • [${r.predicate}]${r.repeats > 1 ? ` (x${r.repeats})` : ''} ${r.message}`);
      for (const e of r.evidence.slice(0, 6)) lines.push(`       ${e}`);
    }
    const cure = cureFor(cls);
    if (cure) lines.push(`   CURE: ${cure}`);
    if (cls && cls.memory && cls.memory.length) lines.push(`   memory: ${cls.memory.slice(0, 3).join(', ')}`);
  }

  lines.push('');
  lines.push(BAR);
  lines.push(`  ${result.findings.length} finding(s) across ${result.byClass.size} class(es).`
    + `  ADVISORY — exits 0 by design.`);
  lines.push(`  triggers: ${meta.derived} derived / ${meta.authored} authored (${meta.hybrid} of the authored are`);
  lines.push('  hybrid: derived population, authored pattern). The derived share is the shelf life.');
  lines.push(BAR);
  return lines.join('\n');
}

// ── The firing log ──────────────────────────────────────────────────────────

function appendLog(row) {
  try {
    fs.appendFileSync(LOG, `${JSON.stringify(row)}\n`, 'utf8');
    return true;
  } catch { return false; }
}

// ── Derivation census ───────────────────────────────────────────────────────

function derivationCensus() {
  const derived = PREDICATES.filter((p) => p.derivation === 'derived').length;
  const hybrid = PREDICATES.filter((p) => p.derivation === 'hybrid').length;
  const authoredOnly = PREDICATES.filter((p) => p.derivation === 'authored').length;
  return { total: PREDICATES.length, derived, hybrid, authored: hybrid + authoredOnly, authoredOnly };
}

// ── Self-check (the gate step) ──────────────────────────────────────────────

async function selfCheck() {
  const problems = [];
  const registry = loadRegistry();
  if (!registry || registry.classes.length === 0) {
    // A registry of ZERO classes parses fine and would send every predicate down the
    // orphan-classId arm, burying the real cause under 40 derived messages. Name the
    // cause once, and never let 'nothing to check' read as 'checked'.
    console.error('[premortem] ANTI-VACUITY: the hazard registry is missing, unreadable, or declares ZERO classes — failing closed.');
    console.error('  Every classId below would resolve to nothing and the instrument would print a');
    console.error('  confident, empty all-clear. "I found nothing" is not "I looked at nothing".');
    process.exit(1);
  }
  const ids = new Set(registry.classes.map((c) => c.id));
  const ctx = await makeCtx(null);

  // Anti-vacuity on the predicate set itself.
  if (PREDICATES.length < PREDICATE_FLOOR) {
    problems.push(`SCOPE: ${PREDICATES.length} predicates, below the floor of ${PREDICATE_FLOOR}.`
      + ' Predicates were removed; lower PREDICATE_FLOOR in the same commit so the shrink is reviewed.');
  }
  const census = derivationCensus();
  if (census.derived === 0) {
    problems.push('ANTI-VACUITY: ZERO artifact-derived predicates remain — the instrument is a hand-list.');
  }

  const covered = new Set();
  for (const p of PREDICATES) {
    // A. every named class resolves.
    for (const c of p.classIds) {
      if (!ids.has(c)) {
        problems.push(`${p.id}: names class ${c}, which is NOT in the registry. An orphan predicate`
          + ' prints a warning nobody can look up — rename it or add the class.');
      } else covered.add(c);
    }
    // B. every declared source exists.
    for (const s of p.sources) {
      if (!ctx.exists(s)) {
        problems.push(`${p.id}: declared derivation source ${s} DOES NOT EXIST. The predicate is`
          + ' reading nothing and will match nothing, silently.');
      }
    }
    // C. derived populations are non-empty.
    if (typeof p.population === 'function') {
      let pop = null;
      try { pop = p.population(ctx); } catch (e) { problems.push(`${p.id}: population() threw: ${e.message}`); }
      if (pop && (!Array.isArray(pop.items) || pop.items.length === 0)) {
        problems.push(`${p.id}: derived population "${pop.label}" is EMPTY. This is the silent failure`
          + ' this arm exists for: an empty population matches nothing and reads as an all-clear.');
      }
    }
    // D. synthetic firing — reddening the guard on purpose, every run.
    if (typeof p.synthetic === 'function') {
      let synth = null;
      try { synth = p.synthetic(ctx); } catch (e) { problems.push(`${p.id}: synthetic() threw: ${e.message}`); }
      if (synth) {
        const cs = { changes: synth.changes, added: new Map(synth.added || []) };
        let rows = [];
        try { rows = p.run(ctx, cs) || []; } catch (e) { problems.push(`${p.id}: run() threw on its own synthetic: ${e.message}`); }
        if (rows.length === 0) {
          problems.push(`${p.id}: DID NOT FIRE against a synthetic changeset built from its own live`
            + ' population. A predicate that cannot be made to warn cannot be trusted to warn.');
        }
      }
    }
  }

  // E. every registry class is covered or explicitly exempted, with a reason.
  for (const c of registry.classes) {
    if (covered.has(c.id)) continue;
    const why = NOT_CHANGESET_EXPRESSIBLE[c.id];
    if (!why || String(why).trim().length < 20) {
      problems.push(`registry class ${c.id} has NO trigger predicate and no stated reason in`
        + ' NOT_CHANGESET_EXPRESSIBLE. A class the pre-mortem cannot route to a change is a class'
        + ' that stays a document — say why, or give it a trigger.');
    }
  }
  for (const k of Object.keys(NOT_CHANGESET_EXPRESSIBLE)) {
    if (!ids.has(k)) problems.push(`NOT_CHANGESET_EXPRESSIBLE names ${k}, which is not a registry class (stale exemption).`);
  }

  if (problems.length) {
    console.error('[premortem] SELF-CHECK FAILURES:');
    console.error(problems.map((p) => `  - ${p}`).join('\n'));
    console.error('\nThe pre-mortem is ADVISORY, but its integrity is not: a predicate that cannot fire');
    console.error('is indistinguishable from a clean changeset, and that is the exact defect this');
    console.error('whole round exists to stop.');
    process.exit(1);
  }
  console.log(`[premortem] SELF-CHECK OK — ${PREDICATES.length} predicates`
    + ` (${census.derived} derived, ${census.authored} authored of which ${census.hybrid} hybrid),`
    + ` ${covered.size}/${registry.classes.length} registry classes routed to a trigger,`
    + ` ${registry.classes.length - covered.size} uncovered and each explicitly exempted with a reason.`);
  process.exit(0);
}

// ── Retro acceptance: run against commits that ALREADY tripped a class ──────

async function retro() {
  let spec;
  try { spec = JSON.parse(fs.readFileSync(RETRO, 'utf8')); } catch (e) {
    console.error(`[premortem] retro corpus unreadable at ${RETRO}: ${e.message}`);
    process.exit(1);
  }
  const cases = spec.cases || [];
  if (cases.length === 0) {
    console.error('[premortem] retro corpus has ZERO cases — a hit rate over nothing is not a hit rate.');
    process.exit(1);
  }
  const results = [];
  for (const c of cases) {
    const saved = argv.slice();
    argv.length = 0;
    argv.push('--sha', c.sha);
    let changeset;
    try { changeset = resolveChangeset(); } catch (e) {
      results.push({ ...c, ok: false, why: `changeset unresolvable: ${e.message}`, got: [] });
      argv.length = 0; argv.push(...saved);
      continue;
    }
    argv.length = 0; argv.push(...saved);
    const ctx = await makeCtx(changeset.base);
    const { byClass, findings } = runPredicates(ctx, changeset);
    const got = [...byClass.keys()];
    const gotPreds = [...new Set(findings.map((f) => f.predicate))];
    const missClasses = (c.expectClasses || []).filter((x) => !got.includes(x));
    const missPreds = (c.expectPredicates || []).filter((x) => !gotPreds.includes(x));
    // A NEGATIVE CONTROL is not optional. Without one, a predicate that fires on
    // EVERY changeset would post a perfect hit rate while carrying no information.
    const falsePos = (c.expectAbsentPredicates || []).filter((x) => gotPreds.includes(x));
    results.push({
      ...c, ok: missClasses.length === 0 && missPreds.length === 0 && falsePos.length === 0,
      got, gotPreds, missClasses, missPreds, falsePos,
    });
  }
  const hits = results.filter((r) => r.ok).length;
  console.log(BAR);
  console.log('PRE-MORTEM RETRO ACCEPTANCE — replayed against commits that ALREADY tripped a class');
  console.log(BAR);
  for (const r of results) {
    console.log(`${r.ok ? 'HIT ' : 'MISS'}  ${r.sha.slice(0, 8)}  ${r.name}`);
    console.log(`        expected classes: ${(r.expectClasses || []).join(', ') || '(none)'}`);
    if (r.expectPredicates) console.log(`        expected predicates: ${r.expectPredicates.join(', ')}`);
    console.log(`        fired: ${r.got.join(', ') || '(nothing)'}`);
    if (!r.ok) {
      if (r.missClasses.length) console.log(`        MISSED classes: ${r.missClasses.join(', ')}`);
      if (r.missPreds.length) console.log(`        MISSED predicates: ${r.missPreds.join(', ')}`);
      if ((r.falsePos || []).length) console.log(`        FALSE POSITIVE (negative control): ${r.falsePos.join(', ')}`);
      if (r.why) console.log(`        ${r.why}`);
      if (r.knownMissReason) console.log(`        KNOWN MISS: ${r.knownMissReason}`);
    }
  }
  console.log(BAR);
  console.log(`HIT RATE: ${hits}/${results.length}`);
  const misses = results.filter((r) => !r.ok);
  if (misses.length) {
    console.log('MISSES (reported honestly — a pre-mortem that cannot retro-warn is decoration):');
    for (const m of misses) console.log(`  - ${m.sha.slice(0, 8)} ${m.name}: ${m.missClasses.concat(m.missPreds).join(', ')}`);
  }
  console.log(BAR);
  // One row PER CASE, not just a summary: the question this log exists to answer
  // is "did the instrument name class X before the commit that tripped X", and a
  // summary count cannot answer it.
  const ts = new Date().toISOString();
  const logging = !has('--no-log');
  for (const r of logging ? results : []) {
    appendLog({
      ts, mode: 'retro-case', sha: r.sha, name: r.name, hit: r.ok,
      expected: r.expectClasses || [], classes: r.got, predicates: r.gotPreds,
    });
  }
  if (logging) appendLog({ ts, mode: 'retro', hits, cases: results.length, misses: misses.map((m) => m.sha.slice(0, 8)) });
  process.exit(has('--strict') && misses.length ? 1 : 0);
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  if (has('--self-check')) return selfCheck();
  if (has('--retro')) return retro();

  const registry = loadRegistry();
  const changeset = resolveChangeset();
  const ctx = await makeCtx(changeset.base);
  const result = runPredicates(ctx, changeset);
  const census = derivationCensus();

  const row = {
    ts: new Date().toISOString(),
    mode: changeset.mode,
    sha: changeset.sha,
    base: changeset.base,
    files: changeset.changes.length,
    classes: [...result.byClass.keys()],
    predicates: [...new Set(result.findings.map((f) => f.predicate))],
    findings: result.findings.length,
    triggers: { derived: census.derived, authored: census.authored },
  };
  if (!has('--no-log')) row.logged = appendLog(row);

  if (has('--json')) {
    console.log(JSON.stringify({ ...row, detail: result.findings }, null, 2));
  } else {
    console.log(render(registry, changeset, result, census));
    if (!registry) console.log('  ⚠ the hazard registry could not be read — class titles and cures are missing.');
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(`[premortem] ${e.stack || e.message}`);
  // Advisory: a crash must not block a commit. It is loud, and it exits 0.
  process.exit(0);
});
