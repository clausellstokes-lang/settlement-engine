#!/usr/bin/env node
/**
 * check-hazard-registry.mjs — the gate that makes the hazard registry REAL.
 *
 * ── WHY THIS FILE EXISTS ────────────────────────────────────────────────────
 * The owner's observation, which is correct: recorded hazard cures keep failing.
 * The diagnosis is that A RECORDED HAZARD IS A DOCUMENT, and a document requires
 * someone to read it at exactly the right moment while doing something else.
 * Proof from a single day: the config-slot trap was recorded WITH its exact cure
 * and a lane walked into it; the piped-exit-code hazard is recorded and the chair
 * hit it twice while briefing others against it; the edge-bundle law is recorded
 * and the chair broke it by reading "touching" too narrowly.
 *
 * THE RULE THAT FOLLOWS: every confirmed hazard class either becomes MACHINERY,
 * or is EXPLICITLY ACCEPTED as a document with a stated reason.
 *
 * AND THE TRAP THIS FILE EXISTS TO AVOID: that rule is itself a document. A
 * registry nobody validates commits the exact defect it diagnoses. So the
 * registry's integrity is GATE-ENFORCED here — step one of `npm run check` —
 * rather than asserted in prose, and this script's own failure paths are
 * EXERCISED by tests/lint/hazardRegistryFailClosed.test.js through the env seams
 * below rather than merely claimed to work.
 *
 * ── WHAT IT ENFORCES ────────────────────────────────────────────────────────
 *  A. SHAPE          every entry has id/title/status/memory/enforcer/instances/
 *                    triggers; ids unique and well-formed.
 *  B. STATUS         status ∈ {MACHINERY, PARTIAL, DOCUMENT, ACCEPTED}. A NEW
 *                    CLASS ADDED WITH NO STATUS REDS — the arm that keeps the
 *                    registry alive instead of letting it silently accrete.
 *  C. MACHINERY      must name at least one enforcer path.
 *  D. PATHS EXIST    EVERY named enforcer path, at EVERY status, must exist on
 *                    disk. Deliberately wider than the brief's MACHINERY-only
 *                    rule: a PARTIAL whose enforcer was deleted or renamed is
 *                    the same lie, and this arm caught one on its first run
 *                    (the census named scripts/check-tail.sh, which does not
 *                    exist — see the HZ-PIPEEXIT entry's correction note).
 *  E. ACCEPTED       must carry a non-empty acceptedReason. An acceptance
 *                    without a reason is a SILENT SURRENDER and reds.
 *  F. IN-CHAIN       enforcer.inChain is RE-DERIVED from package.json's `check`
 *                    chain on every run and compared against the claim. This is
 *                    HZ-DERIVE-DONT-RESTATE applied to this file itself: the one
 *                    field that could rot into a comfortable fiction cannot,
 *                    because nothing here is trusted to have stayed true.
 *  G. DOCUMENT COUNT SHRINK-ONLY against documentBaseline. That is the ratchet on
 *                    the treadmill itself — the owed pile may only get smaller.
 *  H. SENTINELS      anti-vacuity (empty/unparseable/zero-class registry FAILS
 *                    CLOSED, never reads as "no violations") and scope (a class
 *                    count below classFloor fails loudly).
 *
 * ── THE ANTI-VACUITY SENTINEL, AND WHY IT IS THE POINT ──────────────────────
 * Pattern carried from scripts/check-full-typecheck.mjs and
 * scripts/check-domain-strict.mjs. A registry of ZERO classes passes every
 * assertion above vacuously — no MACHINERY entry to check, no ACCEPTED entry
 * missing a reason, a DOCUMENT count of 0 that is trivially <= baseline. That
 * green would be the exact failure this whole round exists to prevent, so a
 * missing, empty, unparseable or classless registry EXITS NON-ZERO. "I verified
 * nothing" and "I found no violations" are different sentences and this script
 * never confuses them.
 *
 * ── USAGE ───────────────────────────────────────────────────────────────────
 *   npm run validate:hazard-registry     # the gate step
 *   node scripts/check-hazard-registry.mjs --report   # human summary, same checks
 *
 * ── TESTABILITY SEAMS ───────────────────────────────────────────────────────
 * HAZARD_REGISTRY_PATH          — point at an injected registry fixture.
 * HAZARD_REGISTRY_PACKAGE_JSON  — point at an injected package.json (exercises
 *                                 the in-chain derivation and its own sentinel).
 * A ratchet whose failure paths are never RUN is a ratchet nobody has proven
 * works — the same reason domainStrictFailClosed.test.js exists.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..');
const REGISTRY = process.env.HAZARD_REGISTRY_PATH
  || path.join(ROOT, 'scripts', 'hazard-registry.json');
const PACKAGE_JSON = process.env.HAZARD_REGISTRY_PACKAGE_JSON
  || path.join(ROOT, 'package.json');
const REPORT = process.argv.includes('--report');

const STATUS_VALUES = ['MACHINERY', 'PARTIAL', 'DOCUMENT', 'ACCEPTED'];
const ID_RE = /^HZ-[A-Z0-9]+$/;

/** Fail closed: print the reason and exit non-zero. Never "0 violations". */
function fatal(headline, detail) {
  console.error(`[hazard-registry] ${headline}`);
  if (detail) console.error(detail);
  console.error(
    '\nThis gate verified NOTHING; it did not measure "no violations". A hazard registry'
    + '\nthat cannot be read is strictly worse than no registry, because it looks solved.',
  );
  process.exit(1);
}

// ── Load, with the anti-vacuity sentinel wrapped around every failure ────────
if (!fs.existsSync(REGISTRY)) {
  fatal(`ANTI-VACUITY: no registry at ${path.relative(ROOT, REGISTRY) || REGISTRY} — failing closed.`);
}
let raw;
try {
  raw = fs.readFileSync(REGISTRY, 'utf8');
} catch (e) {
  fatal(`ANTI-VACUITY: registry unreadable — failing closed.`, `  ${e.message}`);
}
if (!raw || !raw.trim()) {
  fatal('ANTI-VACUITY: registry is EMPTY — failing closed.');
}
let registry;
try {
  registry = JSON.parse(raw);
} catch (e) {
  fatal('ANTI-VACUITY: registry is UNPARSEABLE JSON — failing closed.', `  ${e.message}`);
}
if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
  fatal('ANTI-VACUITY: registry root is not an object — failing closed.');
}

const classes = registry.classes;
if (!Array.isArray(classes)) {
  fatal('ANTI-VACUITY: registry.classes is missing or not an array — failing closed.');
}
if (classes.length === 0) {
  fatal(
    'ANTI-VACUITY: registry declares ZERO hazard classes — failing closed.',
    '  A registry of zero classes passes every assertion below vacuously. That green is\n'
    + '  the exact failure this gate exists to prevent.',
  );
}

// ── Scope sentinel ───────────────────────────────────────────────────────────
// A collapse in class count is a scope event, not routine churn. Deliberate
// removals lower classFloor explicitly, in the same commit, where it is reviewable.
const classFloor = Number.isInteger(registry.classFloor) ? registry.classFloor : null;
if (classFloor === null) {
  fatal('SCOPE SENTINEL: registry.classFloor is missing or not an integer — failing closed.');
}
if (classes.length < classFloor) {
  fatal(
    `SCOPE SENTINEL: class count COLLAPSED to ${classes.length}, below the frozen floor of ${classFloor}.`,
    '  Classes were removed from the registry. If that is deliberate, lower classFloor in the\n'
    + '  same commit so the shrink is reviewed rather than absorbed.',
  );
}

const documentBaseline = Number.isInteger(registry.documentBaseline) ? registry.documentBaseline : null;
if (documentBaseline === null) {
  fatal('ANTI-VACUITY: registry.documentBaseline is missing or not an integer — failing closed.');
}

// ── Derive the `check` chain, so `inChain` cannot rot into a fiction ─────────
/**
 * Recursively expand `npm run <name>` through package.json scripts, returning the
 * LEAF command strings the chain actually executes.
 * @returns {{ leaves: string[], visited: string[] }}
 */
function expandChain(scripts, entry) {
  const leaves = [];
  const visited = new Set();
  const walk = (name) => {
    if (visited.has(name)) return; // cycle guard
    visited.add(name);
    const body = scripts[name];
    if (typeof body !== 'string') return;
    // Split on shell separators; `npm run x && npm run y | tee` all decompose here.
    for (const seg of body.split(/&&|\|\||;|\|/)) {
      const cmd = seg.trim();
      if (!cmd) continue;
      const m = /^(?:npm|pnpm|yarn)\s+run\s+([A-Za-z0-9:_-]+)/.exec(cmd);
      if (m) walk(m[1]);
      else leaves.push(cmd);
    }
  };
  walk(entry);
  return { leaves, visited: [...visited] };
}

let pkg;
try {
  pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));
} catch (e) {
  fatal('IN-CHAIN DERIVATION: package.json unreadable/unparseable — failing closed.', `  ${e.message}`);
}
const scripts = (pkg && pkg.scripts) || {};
if (typeof scripts.check !== 'string') {
  fatal(
    'IN-CHAIN DERIVATION: package.json has no `check` script — failing closed.',
    '  Without the chain there is nothing to derive `inChain` against, and every claim\n'
    + '  would pass as "not in chain" by default — a vacuous green on the one field this\n'
    + '  registry re-derives specifically so it cannot rot.',
  );
}
const { leaves } = expandChain(scripts, 'check');
if (leaves.length === 0) {
  fatal('IN-CHAIN DERIVATION: the `check` chain expanded to ZERO leaf commands — failing closed.');
}

const chainText = leaves.join('\n');
// A runner that executes the WHOLE tests/ tree. Recognising this is what lets a
// test file count as in-chain without being named literally anywhere.
const FULL_SUITE_MARKERS = ['check-test-ratchet.mjs'];
const fullSuiteInChain = FULL_SUITE_MARKERS.some((m) => chainText.includes(m));
// Narrower runners: `vitest run tests/build/` covers only that prefix.
const vitestPrefixes = [];
for (const leaf of leaves) {
  for (const m of leaf.matchAll(/vitest\s+run\s+((?:tests|src)[^\s]*)/g)) vitestPrefixes.push(m[1]);
}
if (!fullSuiteInChain && vitestPrefixes.length === 0) {
  fatal(
    'IN-CHAIN DERIVATION: no vitest runner found anywhere in the `check` chain — failing closed.',
    '  Every tests/** enforcer would derive as NOT in chain, which would either mass-red this\n'
    + '  gate on a lie or (if the claims were flipped to match) bank a false all-clear. If the\n'
    + '  test runner genuinely moved, update FULL_SUITE_MARKERS here in the same commit.',
  );
}

/** Is one enforcer path executed by the `check` chain? */
function pathInChain(p) {
  if (chainText.includes(p)) return true;
  if (fullSuiteInChain && p.startsWith('tests/')) return true;
  return vitestPrefixes.some((pref) => p.startsWith(pref));
}

// ── The assertions ──────────────────────────────────────────────────────────
const problems = [];
const seenIds = new Set();
let documentCount = 0;
const byStatus = Object.fromEntries(STATUS_VALUES.map((s) => [s, 0]));

classes.forEach((entry, i) => {
  const where = `classes[${i}]`;
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    problems.push(`${where}: not an object`);
    return;
  }
  const id = entry.id;
  const at = typeof id === 'string' && id ? id : where;

  // A. SHAPE
  if (typeof id !== 'string' || !ID_RE.test(id)) {
    problems.push(`${where}: id missing or malformed (expected /^HZ-[A-Z0-9]+$/, got ${JSON.stringify(id)})`);
  } else if (seenIds.has(id)) {
    problems.push(`${at}: DUPLICATE id — two entries claim the same class, so one of them is invisible`);
  } else {
    seenIds.add(id);
  }
  if (typeof entry.title !== 'string' || !entry.title.trim()) {
    problems.push(`${at}: title missing or empty`);
  }
  if (!Array.isArray(entry.memory) || entry.memory.length === 0) {
    problems.push(`${at}: memory must be a non-empty array — a class with no recorded evidence is a rumour`);
  }
  if (!Number.isInteger(entry.instances) || entry.instances < 1) {
    problems.push(`${at}: instances must be an integer >= 1 (a class with no confirmed instance is not a confirmed class)`);
  }
  if (typeof entry.instanceEvidence !== 'string' || !entry.instanceEvidence.trim()) {
    problems.push(`${at}: instanceEvidence missing — an instance count with no evidence is a transcription`);
  }
  if (!Array.isArray(entry.triggers) || entry.triggers.length === 0) {
    problems.push(`${at}: triggers must be a non-empty array — a hazard nobody can route to a change is unactionable`);
  }

  // B. STATUS — the arm that keeps the registry alive.
  const status = entry.status;
  if (typeof status !== 'string' || !STATUS_VALUES.includes(status)) {
    problems.push(
      `${at}: status is ${JSON.stringify(status)} — must be one of ${STATUS_VALUES.join(', ')}.`
      + ' A class added with no status REDS: it must be triaged, not parked.',
    );
  } else {
    byStatus[status] += 1;
    if (status === 'DOCUMENT') documentCount += 1;
  }

  // enforcer shape
  const enf = entry.enforcer;
  if (!enf || typeof enf !== 'object' || Array.isArray(enf)) {
    problems.push(`${at}: enforcer must be an object { paths, inChain, note }`);
    return;
  }
  const paths = enf.paths;
  if (!Array.isArray(paths) || paths.some((p) => typeof p !== 'string')) {
    problems.push(`${at}: enforcer.paths must be an array of strings (use [] for none)`);
    return;
  }

  // C. MACHINERY must name an enforcer.
  if (status === 'MACHINERY' && paths.length === 0) {
    problems.push(
      `${at}: status MACHINERY but enforcer.paths is EMPTY — MACHINERY means something reds`
      + ' without anyone remembering the hazard. Name it, or the status is a claim.',
    );
  }

  // D. Every named path must EXIST — at every status.
  for (const p of paths) {
    if (!fs.existsSync(path.join(ROOT, p))) {
      problems.push(
        `${at}: enforcer path DOES NOT EXIST on disk: ${p}`
        + (status === 'MACHINERY' ? '  (status MACHINERY — the class is claimed closed by a file that is not there)' : ''),
      );
    }
  }

  // E. ACCEPTED needs a stated reason.
  if (status === 'ACCEPTED') {
    const reason = entry.acceptedReason;
    if (typeof reason !== 'string' || reason.trim().length < 20) {
      problems.push(
        `${at}: status ACCEPTED with no stated reason (acceptedReason must be a non-empty`
        + ' string of substance). An acceptance without a reason is a SILENT SURRENDER —'
        + ' indistinguishable from having forgotten the class.',
      );
    }
  } else if (typeof entry.acceptedReason === 'string' && entry.acceptedReason.trim()) {
    problems.push(`${at}: acceptedReason is set but status is ${status} — only ACCEPTED carries a reason`);
  }

  // F. IN-CHAIN is DERIVED, never trusted.
  const claimed = enf.inChain;
  if (typeof claimed !== 'boolean') {
    problems.push(`${at}: enforcer.inChain must be a boolean (it is checked against the derived chain)`);
  } else {
    const derived = paths.some(pathInChain);
    if (derived !== claimed) {
      problems.push(
        `${at}: enforcer.inChain claims ${claimed} but the \`check\` chain says ${derived}`
        + ` (paths: ${paths.length ? paths.join(', ') : '(none)'}).`
        + ' DERIVE-DONT-RESTATE: fix the claim, or wire the enforcer in — never reword this.',
      );
    }
  }
});

// G. The DOCUMENT ratchet — the treadmill only shrinks.
if (documentCount > documentBaseline) {
  problems.push(
    `DOCUMENT COUNT GREW: ${documentCount} > baseline ${documentBaseline}.`
    + '\n  The owed pile is SHRINK-ONLY. A new hazard class must arrive as MACHINERY, as PARTIAL'
    + '\n  with a real enforcer, or as ACCEPTED with a stated reason. Adding another undefended'
    + '\n  document is the treadmill this registry exists to stop.'
    + '\n  If a class genuinely regressed to DOCUMENT, say so and raise the baseline deliberately'
    + '\n  in the same commit — where it is reviewable — rather than letting it drift.',
  );
}

if (problems.length) {
  console.error('[hazard-registry] REGISTRY INTEGRITY FAILURES:');
  console.error(problems.map((p) => `  - ${p}`).join('\n'));
  console.error(
    `\nRegistry: ${path.relative(ROOT, REGISTRY) || REGISTRY}`
    + `\nSee scripts/check-hazard-registry.mjs for what each arm means and why it exists.`,
  );
  process.exit(1);
}

const summary = STATUS_VALUES.map((s) => `${s} ${byStatus[s]}`).join(', ');
console.log(
  `[hazard-registry] OK — ${classes.length} class(es): ${summary}.`
  + ` DOCUMENT ${documentCount}/${documentBaseline} (shrink-only), floor ${classFloor}.`,
);

if (REPORT) {
  console.log('\n  id                  status      inChain  instances  enforcer');
  console.log('  ' + '-'.repeat(88));
  for (const e of classes) {
    const paths = (e.enforcer && e.enforcer.paths) || [];
    const derived = paths.some(pathInChain);
    console.log(
      `  ${String(e.id).padEnd(20)}${String(e.status).padEnd(12)}`
      + `${(derived ? 'yes' : 'no').padEnd(9)}${String(e.instances).padEnd(11)}`
      + (paths.length ? paths.join(', ') : '(none)'),
    );
  }
  const owed = classes.filter((e) => e.status === 'DOCUMENT' || e.status === 'PARTIAL');
  console.log(`\n  OWED (DOCUMENT + PARTIAL): ${owed.length} of ${classes.length}`);
}

process.exit(0);
