/**
 * worldGenerationClockSeam.walker.test.js — THE PROMISE'S STRUCTURAL GUARD.
 *
 * THE LAW. *The same seed produces the same world, forever.* A wall-clock or unseeded-random
 * read anywhere on a world-generation path breaks it: the same seed produces a different world
 * tomorrow, and nothing in the estate notices, because the divergence is a timestamp nobody
 * diffs.
 *
 * WHAT WAS ALREADY GUARDED, AND THE HOLE IT LEFT. `eslint.config.js` bans the raw SPELLINGS —
 * `Math.random()`, `Date.now()`, no-arg `new Date()`, `localeCompare`, `Intl` — across
 * src/generators, src/domain, src/workers, src/kernel, src/lib/instantWorld and src/pdf, and
 * `tests/lint/determinismBanCoverage.test.js` pins that per-file coverage. `src/domain/clock.js`
 * is the one sanctioned seam those bans exempt. Every existing guard therefore watches the
 * SPELLING. None watched the SEAM ITSELF. At the cure, NINE files in the closure call
 * `wallClockNow()` across THIRTEEN sites, and only TWO of them carry the estate's own structural
 * pin guard — pulseKernel.js `assertNowPinnedInTest('simulateCampaignWorldPulse')` and its twin
 * on the interval entry. (CONTENT ANCHORS, not line numbers, because
 * `tests/lint/pulseKernelLineAddress.walker.test.js` bans the hand-keyed spelling at zero and is
 * right to — every one of the fifteen citations it retired had already rotted.)
 * The other eleven fall through to a live clock in silence, and a
 * store caller that simply forgets the options argument inherits that silence:
 * `campaignAdvanceSession.js` stamped every queue-mouth refusal entry from the wall clock
 * while the rest of the same advance carried its pinned `now`. (Those eleven are LEDGERED
 * below as boundary reads and each is proved unreached by Arm C — the point is that nothing
 * was checking.)
 *
 * THIS FILE CLOSES THE CLASS IN THREE ARMS, AND THEY CATCH DIFFERENT THINGS.
 *
 *   ARM A (source, the pure core) — computes the world-generation import closure from declared
 *   entry points and requires every clock/entropy read inside it to appear in LEDGER_A with a
 *   reason. Catches a NEW direct read added to any of the 673 reachable files. Blind to an
 *   INDIRECT reach: a generation-path file calling a normalizer that reads the clock two
 *   modules away shows nothing at the call site.
 *
 *   ARM B (source, the callers) — the wizardNews writers mint `createdAt`/`updatedAt` through
 *   the chain `entry.createdAt || options.now || wallClockNow()`, so a caller that omits the
 *   options argument silently takes a live instant. Every `src/**` call to those writers must
 *   pass a timestamp. Catches the caller-side defect at edit time, which is the shape that
 *   actually shipped. Blind to a timestamp passed under a name it does not recognise.
 *
 *   ARM C (runtime, the proof) — mocks the seam and RUNS world generation twice with the clock
 *   moved between runs, asserting byte identity AND ZERO seam calls. This is the arm that
 *   found `composeInstantWorld`, whose bytes were correct and whose read was not: it minted a
 *   wall-clock `updatedAt` and then overwrote it one property later by key order. Arms A and B
 *   are both blind to that by construction; only counting the calls sees it. It is also the
 *   only arm that proves the OTHER two are not vacuous.
 *
 * ⚠ DOCUMENTED EVASION PATHS, ACCEPTED AS COSTS (a guard that hides its holes is worse than
 * one that names them):
 *   • Arm A resolves imports by regex over `from '…'` and `import('…')` literals. A dynamic
 *     import with a COMPUTED specifier leaves its target outside the closure, unguarded.
 *   • Arm A reads TEXT, so a clock read reached through a bare-specifier package, `globalThis`,
 *     or an aliased binding (`const d = Date; d.now()`) is invisible to it. Arm C is the
 *     backstop for exactly that class on the paths it exercises.
 *   • Arm B accepts any call whose argument text mentions `now` or `createdAt`. A caller that
 *     threads a pinned instant under a third name reads as a violation (false red, cheap to
 *     fix); a caller that passes an unrelated identifier spelled `now` reads as clean.
 *   • Arm C exercises the instant-world composer and a two-year kernel advance. A generation
 *     path neither touches — a future composer, a new worker entry — is proved by A and B
 *     alone until it is added to the fixtures here.
 *   • LEDGER_A is keyed by file + kind + COUNT, deliberately not by line: this estate has been
 *     bitten by pinned line numbers that all moved under an unrelated edit. The cost is that
 *     swapping one sanctioned read for a different one in the same file passes.
 *
 * @enforced-by this file. Cures: §888 (the wall-clock leak).
 */
import { describe, test, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const rel = (p) => path.relative(REPO, p).split(path.sep).join('/');

// ── THE WORLD-GENERATION ENTRY POINTS ────────────────────────────────────────────────────
// Every product path that turns a seed into world state. Adding a new one is how a new
// generation surface joins this guard; the closure floor below makes deleting one visible.
const ENTRY_POINTS = [
  'src/generators/generateSettlementPipeline.js',
  'src/generators/pipeline.js',
  'src/domain/worldPulse/advanceCampaignWorld.js',
  'src/domain/worldPulse/pulseKernel.js',
  'src/domain/worldPulse/advanceInterval.js',
  'src/domain/worldPulse/forecastRun.js',
  'src/domain/events/drainQueuedEvents.js',
  'src/domain/instantWorld/worldPlan.js',
  'src/lib/instantWorld/composeInstantWorld.js',
  'src/workers/advanceInterval.worker.js',
];

const IMPORT_RE = /(?:^|\n)\s*(?:import|export)\b[\s\S]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function resolveSpec(fromFile, spec) {
  if (!spec.startsWith('.')) return null; // bare specifier: node_modules, out of scope
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const c of [base, `${base}.js`, `${base}.jsx`, path.join(base, 'index.js'), path.join(base, 'index.jsx')]) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

/** Every file transitively reachable from the world-generation entry points. */
function generationClosure() {
  const seen = new Set();
  const stack = ENTRY_POINTS.map((e) => path.join(REPO, e));
  while (stack.length) {
    const f = stack.pop();
    if (seen.has(f)) continue;
    seen.add(f);
    let txt;
    try { txt = fs.readFileSync(f, 'utf8'); } catch { continue; }
    IMPORT_RE.lastIndex = 0;
    let m;
    while ((m = IMPORT_RE.exec(txt))) {
      const r = resolveSpec(f, m[1] || m[2] || '');
      if (r) stack.push(r);
    }
  }
  return [...seen].map(rel).sort();
}

/**
 * Blank out comments and string/template bodies, PRESERVING newlines, so a scan sees code
 * only and a prose mention of `Date.now()` in a docblock is not a finding.
 */
function codeOnly(t) {
  const blank = (m) => m.replace(/[^\n]/g, ' ');
  return t
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + ' ')
    // ⭐ TEMPLATES FIRST, AND THE ORDER IS LOAD-BEARING (car STRIPPER-UNIFY). An
    // apostrophe inside backticks — which this estate writes constantly — otherwise
    // opens a spurious single-quote span that swallows the code after it, and a read
    // inside that span is invisible to every arm below. The quote classes already stop
    // at a newline, so the reorder is the whole cure: measured over src/ at this base,
    // the landed spelling mis-stripped 527 of 2,174 files (29,705 characters) and the
    // reorder takes that to 0. Pinned by a fixture in the detector control test below.
    .replace(/`(?:\\.|[^`\\])*`/g, blank)
    .replace(/'(?:\\.|[^'\\\n])*'/g, "''")
    .replace(/"(?:\\.|[^"\\\n])*"/g, '""');
}

const READS = [
  ['wallClockNow', /\bwallClockNow\s*\(/g],
  ['wallClockMs', /\bwallClockMs\s*\(/g],
  ['Date.now', /\bDate\s*\.\s*now\s*\(/g],
  ['new Date()', /\bnew\s+Date\s*\(\s*\)/g],
  ['performance.now', /\bperformance\s*\.\s*now\s*\(/g],
  ['Math.random', /\bMath\s*\.\s*random\s*\(/g],
  ['crypto.randomUUID', /\brandomUUID\s*\(/g],
  ['crypto.getRandomValues', /\bgetRandomValues\s*\(/g],
];

/**
 * ── LEDGER A — every sanctioned clock/entropy read inside the generation closure ─────────
 * `count` is a CEILING that may only fall. A new read in a listed file, or any read in an
 * unlisted one, reds with the file named. Removing a read means lowering its count here.
 */
const LEDGER_A = [
  {
    file: 'src/domain/clock.js', kind: 'new Date()', count: 1,
    reason: 'THE sanctioned wall-clock seam. eslint exempts this file by name and '
      + 'tests/lint/determinismBanCoverage.test.js pins that exemption; every other domain '
      + 'file must come through here, which is what makes Arm C able to count the reads.',
  },
  {
    file: 'src/domain/clock.js', kind: 'Date.now', count: 1,
    reason: 'The millisecond half of the same seam (wallClockMs).',
  },
  {
    file: 'src/kernel/prng.js', kind: 'Date.now', count: 1,
    reason: 'generateSeed() mints ambient entropy BY DESIGN — it is the sole seed-minting '
      + 'entry, and everything downstream of a seed is pure IN that seed. Banning it would '
      + 'leave the product unable to offer the user a fresh world.',
  },
  {
    file: 'src/kernel/prng.js', kind: 'Math.random', count: 1,
    reason: 'generateSeed()\'s fallback where no WebCrypto is exposed. Same reason.',
  },
  {
    file: 'src/kernel/prng.js', kind: 'crypto.getRandomValues', count: 1,
    reason: 'generateSeed()\'s preferred entropy source. Same reason.',
  },
  {
    file: 'src/kernel/rngContext.js', kind: 'Math.random', count: 1,
    reason: 'unseededRandom() — the fail-closed draw for a context with no seed. eslint '
      + 'FORBIDS the Math.random ban on this file for exactly this seam (determinismBanCoverage '
      + 'asserts the exemption), and a seeded context never reaches it.',
  },
  {
    file: 'src/domain/worldPulse/pulseKernel.js', kind: 'wallClockNow', count: 1,
    reason: 'The boundary default, and it is GUARDED: the line reads '
      + '`if (now == null) { assertNowPinnedInTest(...); now = wallClockNow(); }`, so an '
      + 'unpinned call THROWS in NODE_ENV=test and is a no-op in the browser, where a real '
      + 'caller has already pinned. This is the shape the other eight sites lacked.',
  },
  {
    file: 'src/domain/worldPulse/advanceInterval.js', kind: 'wallClockNow', count: 1,
    reason: 'The same guarded boundary default on the interval entry; one pinned `now` then '
      + 'threads every interior tick.',
  },
  {
    file: 'src/domain/worldPulse/worldState.js', kind: 'wallClockNow', count: 3,
    reason: 'canonizeWorldState\'s default param and the two proposal-patch `updatedAt` '
      + 'fallbacks. All three are DM boundary actions (canonize, adjudicate a proposal) — a '
      + 'human decision at a wall-clock instant, not a seed-driven derivation. Arm C proves '
      + 'none of them is reached by a pinned advance.',
  },
  {
    file: 'src/domain/worldPulse/applyWorldPulse.js', kind: 'wallClockNow', count: 2,
    reason: 'applyWorldPulseProposal / mintRealmVerbProposal default params — both DM '
      + 'boundary actions, same reason as worldState above.',
  },
  {
    file: 'src/domain/region/wizardNews.js', kind: 'wallClockNow', count: 1,
    reason: 'nowIso(), the module\'s single chokepoint — now behind resolveStamp rather than '
      + 'six `options.now ||` fallthroughs. ⭐ UPDATED at the `now: null` cure. This row used '
      + 'to say the fallthrough could not be removed "because removing it means making the '
      + 'stamp nullable … a schema change, which is owner-gated". Half of that still stands '
      + 'and half no longer describes the code. The FALLTHROUGH IS NOT REMOVED and must not '
      + 'be: an ABSENT `now` still takes the wall clock, which is why this count is still 1 '
      + 'and why the ~120 boundary callers are unaffected. What changed is that an EXPLICIT '
      + '`now: null` is honoured as NO STAMP instead of being coerced to a live clock, so the '
      + 'field type is `string|null`. That type widening IS a persisted-shape change and is '
      + 'flagged to the owner; it moves no stored byte, because the chain is '
      + '`row.createdAt || resolveStamp(now)` and a row that HAS a stamp never reaches the '
      + 'resolver (proved by the "AN EXISTING STAMP IS NEVER ERASED" arm in '
      + 'tests/domain/regionalNowThreading.test.js).',
  },
  {
    file: 'src/domain/region/graph.js', kind: 'wallClockNow', count: 1,
    reason: 'The regional graph\'s own nowIso() fallback, for DM-direct graph edits, reached '
      + 'only through resolveStamp\'s absent-`now` branch. Every sim caller threads `{ now }`; '
      + 'Arm C proves the advance never reaches it.',
  },
  {
    file: 'src/domain/region/propagation.js', kind: 'wallClockNow', count: 2,
    reason: 'The pre-stamp on minted impacts, OVERWRITTEN by the deterministic re-stamp at '
      + 'deriveRegionalImpacts exit on every pinned path. Dead work on the sim path, live only '
      + 'for now-less boundary callers. Removing it moves now-less-caller bytes, so it is a '
      + 'behaviour change owed to a wave that owns those bytes, not to this guard.',
  },
  {
    file: 'src/domain/region/discoverDependencyCandidates.js', kind: 'wallClockNow', count: 0,
    reason: 'CURED at §888 — it minted `discoveredAt` per candidate from the wall clock and let '
      + 'normalizeChannel mint `updatedAt` from a SECOND read, hundreds of times per realm '
      + 'compose. It now threads `now` through normalizeChannel\'s own parameter, which was '
      + 'always there. Row kept at 0 so the file cannot quietly re-acquire a read.',
  },
  {
    file: 'src/domain/events/drainQueuedEvents.js', kind: 'wallClockNow', count: 1,
    reason: 'Boundary default param; the pulse path threads `now`.',
  },
  {
    file: 'src/domain/userEdits.js', kind: 'wallClockNow', count: 1,
    reason: '`editedAt` on a user edit. A user edit IS a wall-clock event — this is boundary '
      + 'metadata about a human action, not a derivation from the seed.',
  },
  {
    file: 'src/domain/trace.js', kind: 'wallClockMs', count: 1,
    reason: 'Diagnostic trace `ts`, and only when the deterministic `_traceClock` (a monotonic '
      + 'counter) is absent. Generation threads that clock; trace ts is never a sim input.',
  },
  {
    file: 'src/store/configSlice.js', kind: 'new Date()', count: 0,
    reason: 'In the closure ONLY because composeInstantWorld imports the DEFAULT_CONFIG object '
      + 'literal from it. Its own two nondeterministic reads are `import.meta.env.DEV` guards '
      + 'around console.error in updateConfig — a store action no generation path calls. Row '
      + 'kept at count 0 so that a real clock read appearing in this file still reds.',
  },
];

// ── ARM B's SUBJECTS — the wizardNews writers that mint a stamp ───────────────────────────
// Every one of these ends at `… || options.now || nowIso()`. `projectWizardNewsForAudience`,
// `summarizeWizardNews`, `deriveNewsThreads` and `wizardNewsCurrentTick` are deliberately
// ABSENT: they are pure reads that mint nothing.
const STAMP_MINTING_WRITERS = [
  'ensureWizardNewsFeed',
  'appendWizardNewsEntries',
  'appendObservedWizardNewsEntries',
  'advanceWizardNewsFeed',
  'createWizardNewsEntryFromImpact',
  'deriveWizardNewsEntriesFromGraphChange',
];

/** Executable files under a root (jsx included — the store and components call these too). */
function srcFiles(dir = path.join(REPO, 'src'), out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) srcFiles(fp, out);
    else if (/\.(js|jsx)$/.test(e.name)) out.push(fp);
  }
  return out;
}

/** Extract the full parenthesised argument text of every call to `name` in `code`. */
function callArgs(code, name) {
  const out = [];
  const re = new RegExp(`\\b${name}\\s*\\(`, 'g');
  let m;
  while ((m = re.exec(code))) {
    // A definition/import, not a call site.
    const before = code.slice(Math.max(0, m.index - 24), m.index);
    if (/\b(function|export function)\s*$/.test(before)) continue;
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < code.length && depth > 0; i += 1) {
      if (code[i] === '(') depth += 1;
      else if (code[i] === ')') depth -= 1;
    }
    out.push({ index: m.index, args: code.slice(m.index + m[0].length, i - 1) });
  }
  return out;
}

describe('ARM A — no unledgered clock or entropy read inside the world-generation closure', () => {
  const closure = generationClosure();

  test('the closure is non-vacuous (a broken resolver must not pass as a clean sweep)', () => {
    // Measured at the cure: 673 files. A floor, not a pin — the estate grows.
    expect(closure.length).toBeGreaterThan(500);
    for (const entry of ENTRY_POINTS) {
      expect(closure, `declared entry point ${entry} is not in its own closure — it moved or was deleted`).toContain(entry);
    }
    expect(closure).toContain('src/domain/region/wizardNews.js');
    expect(closure).toContain('src/kernel/prng.js');
  });

  test('every read is ledgered, and no ledger row is dead', () => {
    /** @type {Map<string, number>} */
    const measured = new Map();
    for (const f of closure) {
      let txt;
      try { txt = codeOnly(fs.readFileSync(path.join(REPO, f), 'utf8')); } catch { continue; }
      for (const [kind, re] of READS) {
        re.lastIndex = 0;
        const n = (txt.match(re) || []).length;
        if (n > 0) measured.set(`${f}::${kind}`, n);
      }
    }
    const ledger = new Map(LEDGER_A.map((r) => [`${r.file}::${r.kind}`, r.count]));
    const problems = [];
    for (const [key, n] of measured) {
      if (!ledger.has(key)) {
        problems.push(
          `UNLEDGERED: ${key} — ${n} read(s) on a world-generation path.\n`
          + '    The same seed will produce a different world tomorrow. Thread the value from the\n'
          + '    caller (the store boundary mints one `now` per action), or, if this really is a\n'
          + '    boundary read, add a LEDGER_A row here saying why it cannot be threaded.',
        );
      } else if (n > ledger.get(key)) {
        problems.push(`GREW: ${key} — ledger allows ${ledger.get(key)}, found ${n}. A new unpinned read was added.`);
      }
    }
    for (const [key, allowed] of ledger) {
      const n = measured.get(key) || 0;
      if (allowed > 0 && n === 0) {
        problems.push(`DEAD ROW: ${key} — ledger allows ${allowed}, file now has none. Lower the count (this is a ratchet).`);
      }
    }
    expect(problems, `\n${problems.join('\n')}\n`).toEqual([]);
  });

  test('LIVENESS: a synthetic unpinned read in a closure file WOULD be convicted', () => {
    // Arm A's own cannot-catch is a scan that silently matches nothing. Prove the detector
    // fires on text, at a path the closure contains, without writing that text to disk.
    const victim = codeOnly('export const f = () => { const t = Date.now(); return new Date(); };\n');
    const hits = READS.filter(([, re]) => { re.lastIndex = 0; return re.test(victim); }).map(([k]) => k);
    expect(hits).toContain('Date.now');
    expect(hits).toContain('new Date()');
    // …and it must DISCRIMINATE: a parsing call and a prose mention are both legal.
    const innocent = codeOnly('/* never call Date.now() here */\nexport const g = (at) => new Date(at).getTime();\n');
    // ⚠ THE FIXTURE IS ONE LINE ON PURPOSE: this stripper's quote classes already stop
    // at a newline, so a multi-line fixture would survive the unsound order and pin
    // nothing — measured, not reasoned (plant-out M1).
    expect(READS.filter(([, re]) => { re.lastIndex = 0; return re.test(innocent); }).map(([k]) => k)).toEqual([]);
    // ⭐⭐ AND THE STRIPPER'S PASS ORDER IS PINNED (car STRIPPER-UNIFY). The fixture is a
    // LITERAL built on these lines and goes FALSE under the spelling that was landed on
    // this file's base — a single-quote pass running BEFORE the template pass, where an
    // apostrophe inside backticks (which this estate writes constantly) opens a spurious
    // span that eats the code between the two templates. A read hiding in that span is
    // invisible to Arm A, so the sweep reports a clean closure it never measured.
    // Measured over src/ at this base: 527 of 2,174 files mis-stripped, 0 after.
    const behindAnApostrophe = codeOnly([
      "const a = `the mayor's seat`;",
      'export const f = () => Date.now();',
      "const b = `the guild's hall`;",
    ].join(' '));
    expect(READS.filter(([, re]) => { re.lastIndex = 0; return re.test(behindAnApostrophe); }).map(([k]) => k))
      .toContain('Date.now');
  });
});

describe('ARM B — every caller of a stamp-minting wizardNews writer threads a timestamp', () => {
  test('no src/** call site omits the instant', () => {
    const problems = [];
    for (const abs of srcFiles()) {
      const f = rel(abs);
      // The writers' own module and its barrel are the definitions, not call sites.
      if (f === 'src/domain/region/wizardNews.js' || f === 'src/domain/region/index.js') continue;
      const code = codeOnly(fs.readFileSync(abs, 'utf8'));
      for (const fn of STAMP_MINTING_WRITERS) {
        for (const { args } of callArgs(code, fn)) {
          if (/\bnow\b|\bcreatedAt\b/.test(args)) continue;
          problems.push(
            `${f}: ${fn}(…) is called with no timestamp.\n`
            + `    Its stamp chain is \`entry.createdAt || options.now || wallClockNow()\`, so this\n`
            + '    call takes a LIVE instant. Pass the action\'s pinned `now` (the store boundary\n'
            + '    mints exactly one per action; the advance mints it in runAdvanceCampaignWorld).\n'
            + `    args were: ${args.replace(/\s+/g, ' ').slice(0, 120)}`,
          );
        }
      }
    }
    expect(problems, `\n${problems.join('\n')}\n`).toEqual([]);
  });

  test('LIVENESS: the extractor finds real calls and the rule convicts an untimestamped one', () => {
    // A call-finder that silently matches nothing would make the arm above pass forever.
    const sample = codeOnly([
      'const a = appendWizardNewsEntries(feed, entries, { now });',
      'const b = appendWizardNewsEntries(feed, entries);',
      'const c = ensureWizardNewsFeed(feed, { now: options.createdAt });',
    ].join('\n'));
    const appends = callArgs(sample, 'appendWizardNewsEntries');
    expect(appends.length, 'the call extractor found no calls in text that is two calls').toBe(2);
    expect(appends.filter((x) => !/\bnow\b|\bcreatedAt\b/.test(x.args)).length).toBe(1);
    expect(callArgs(sample, 'ensureWizardNewsFeed').length).toBe(1);
    // …and it must not convict the estate's real, cured call sites: this arm passing on an
    // EMPTY sweep is the vacuity that matters, so require the sweep to have seen real ones.
    let seen = 0;
    for (const abs of srcFiles()) {
      const f = rel(abs);
      if (f === 'src/domain/region/wizardNews.js' || f === 'src/domain/region/index.js') continue;
      const code = codeOnly(fs.readFileSync(abs, 'utf8'));
      for (const fn of STAMP_MINTING_WRITERS) seen += callArgs(code, fn).length;
    }
    expect(seen, 'the sweep found no wizardNews writer call sites at all — the walk is broken').toBeGreaterThan(20);
  });

  // ── THE DECEPTIVE SPELLING, BANNED AT ZERO ACROSS src/ AND tests/ ──────────────────────
  // ⭐ NARROWED at the `now: null` cure. It used to convict BOTH `null` and `undefined`.
  //
  // WHAT IT ORIGINALLY GUARDED. `{ now: null }` read as "pin this to nothing" and behaved as
  // "no pin at all", because the stamp chain was an `||` and `null` is falsy. It is the exact
  // shape that produced the estate's only declared known-red: two appends in
  // tests/domain/fieldBattleRegion.test.js, both "pinned" to null, stamping different wall
  // clocks 3 ms apart, 0.392% of the time. The guard FENCED the trap at these six writers.
  //
  // WHY THE `null` HALF IS RETIRED. The trap itself is gone: the writers now route every
  // stamp through `resolveStamp`, and `now: null` MEANS "no stamp" — honoured, not coerced.
  // The ban's own stated rationale ("reads as a pin and is not one") is simply false for null
  // now, and a guard that convicts correct code is a false red that teaches readers to ignore
  // guards. It is also unprovable-in-place: the cure's proof arms in
  // tests/domain/regionalNowThreading.test.js MUST write `now: null` against these very
  // writers to demonstrate the contract, so keeping the null arm would convict the receipt.
  //
  // WHY THE `undefined` HALF IS KEPT, AND MUST BE. `now: undefined` still reads as a pin and
  // still is not one. It CANNOT be cured the way null was: `undefined` has to keep meaning
  // "absent" so the documented wall-clock boundary survives for the ~120 call sites that
  // legitimately omit the option, and so that a spread of an option-less object
  // (`{ ...opts }` where opts has no `now`) keeps behaving as absence. So exactly half of the
  // original trap is removed and half is permanent — and the permanent half keeps its fence.
  //
  // ⚠ STILL SCOPED TO THESE SIX WRITERS, NOT TO THE SPELLING. `now: null` remains a
  // legitimate and widespread estate idiom (126 sites) because most consumers write `now`
  // THROUGH (treasuryNews's own test asserts `createdAt` comes back null).
  test('no caller passes the DECEPTIVE `now: undefined` to a writer that falls through to a clock', () => {
    const DECEPTIVE_NOW = /\bnow\s*:\s*undefined\b/;
    const problems = [];
    const roots = [path.join(REPO, 'src'), path.join(REPO, 'tests')];
    for (const abs of roots.flatMap((r) => srcFiles(r))) {
      const f = rel(abs);
      if (f === 'src/domain/region/wizardNews.js' || f === 'src/domain/region/index.js') continue;
      if (f === rel(url.fileURLToPath(import.meta.url))) continue; // this file names the shape
      const code = codeOnly(fs.readFileSync(abs, 'utf8'));
      for (const fn of STAMP_MINTING_WRITERS) {
        for (const { args } of callArgs(code, fn)) {
          if (!DECEPTIVE_NOW.test(args)) continue;
          problems.push(
            `${f}: ${fn}(…) passes \`now: undefined\`.\n`
            + '    That reads as a pin and is not one — `undefined` means ABSENT, so the call\n'
            + '    takes the wall-clock boundary fallback and two calls milliseconds apart\n'
            + '    produce different bytes. Pass a fixed ISO-8601 instant, or `now: null` if\n'
            + '    you genuinely want NO STAMP (that spelling is now honoured literally).',
          );
        }
      }
    }
    expect(problems, `\n${problems.join('\n')}\n`).toEqual([]);
  });

  test('LIVENESS: the deceptive-spelling rule convicts undefined, and SPARES the now-honoured null', () => {
    const DECEPTIVE_NOW = /\bnow\s*:\s*undefined\b/;
    expect(DECEPTIVE_NOW.test('{ now: undefined }')).toBe(true);
    // The cure's whole point: this spelling is honest now, so the guard must not convict it.
    expect(DECEPTIVE_NOW.test('{ now: null }')).toBe(false);
    expect(DECEPTIVE_NOW.test("{ now: '2026-01-01T00:00:00.000Z' }")).toBe(false);
    expect(DECEPTIVE_NOW.test('{ now }')).toBe(false);
    // …and it must not fire on a ROW field that is legitimately undefined.
    expect(DECEPTIVE_NOW.test('{}, [{ id: 1, createdAt: undefined }], { now: PINNED }')).toBe(false);
  });

  // ── THE FLATTENING BAN (habitat removal for the class the cure created) ────────────────
  //
  // THE CLASS, and it bit three times inside one lane. `undefined` and `null` used to be
  // INTERCHANGEABLE on a `now` path — both falsy, both landing on the wall clock — so the
  // estate flattened one into the other freely: `now = null` default params, `options.now ||
  // null`, `options.now ?? null`. The cure makes them MEAN DIFFERENT THINGS (absent ⇒ the
  // boundary wall clock; null ⇒ NO STAMP), which silently converts every surviving
  // flattening into a bug: a caller that omitted `now` reaches a resolver as an explicit
  // null and gets NO STAMP where it had asked for the boundary default — or the reverse.
  //
  // It is invisible to every other arm here. Arm A counts clock READS and a flattening adds
  // none. Arm B reads CALL ARGUMENTS and a flattening lives in a parameter list. Arm C runs
  // world generation, where every caller pins a real instant, so the divergence never
  // executes. The one that caught it was an ordinary unit assertion on the ABSENT-now
  // boundary — after the fix was already written.
  //
  // SCOPED TO src/domain/region/**, which is where the two resolvers live and therefore the
  // only tree where absent-vs-null is load-bearing. Elsewhere `now = null` is the correct
  // and widespread idiom for news AUTHORS that write `now` through as DATA (they never
  // resolve it against a clock), and banning it estate-wide would convict ~60 correct sites.
  test('no undefined→null flattening on a `now` path inside src/domain/region', () => {
    // A default param (`now = null`), or a coercion (`now || null` / `now ?? null`) — each
    // destroys the distinction between "absent" and "explicitly no stamp" before the value
    // can reach resolveStamp.
    const FLATTEN = [
      ['default param `now = null`', /\bnow\s*=\s*null\b/],
      ['coercion `… .now || null`', /\.now\s*\|\|\s*null\b/],
      ['coercion `… .now ?? null`', /\.now\s*\?\?\s*null\b/],
    ];
    const problems = [];
    for (const abs of srcFiles(path.join(REPO, 'src', 'domain', 'region'))) {
      const f = rel(abs);
      const code = codeOnly(fs.readFileSync(abs, 'utf8'));
      for (const [label, re] of FLATTEN) {
        if (!re.test(code)) continue;
        problems.push(
          `${f}: ${label}.\n`
          + '    On a `now` path inside src/domain/region this flattens ABSENT into an explicit\n'
          + '    null, and the two now mean different things: absent ⇒ the documented wall-clock\n'
          + '    boundary, null ⇒ NO STAMP. Pass the option through untouched and let\n'
          + '    resolveStamp (region/graph.js, region/wizardNews.js) decide.',
        );
      }
    }
    expect(problems, `\n${problems.join('\n')}\n`).toEqual([]);
  });

  test('LIVENESS: the flattening rule convicts each spelling and spares the cured form', () => {
    const DEFAULT_NULL = /\bnow\s*=\s*null\b/;
    const OR_NULL = /\.now\s*\|\|\s*null\b/;
    const NULLISH_NULL = /\.now\s*\?\?\s*null\b/;
    expect(DEFAULT_NULL.test('function candidate(raw, now = null) {')).toBe(true);
    expect(OR_NULL.test('candidate(row, options.now || null)')).toBe(true);
    expect(NULLISH_NULL.test('const now = options.now ?? null;')).toBe(true);
    // The cured spellings must all pass.
    expect(DEFAULT_NULL.test('function candidate(raw, now) {')).toBe(false);
    expect(OR_NULL.test('candidate(row, options.now)')).toBe(false);
    expect(NULLISH_NULL.test('const now = options.now;')).toBe(false);
    // …and a genuine `now: null` ARGUMENT is not a flattening — it is the cured contract.
    expect(DEFAULT_NULL.test('ensureRegionalGraph(g, { now: null })')).toBe(false);
    // The sweep must actually reach files, or the arm above passes on an empty walk.
    expect(srcFiles(path.join(REPO, 'src', 'domain', 'region')).length).toBeGreaterThan(5);
  });
});

// ── ARM C — THE PROOF BY EXECUTION ────────────────────────────────────────────────────────
// The seam is mocked so every read is COUNTED and its value is CONTROLLED. Two runs of the
// same seed, with the clock a century apart, must produce identical bytes and must not touch
// the clock at all. The byte check alone would have passed over composeInstantWorld's
// masked read; the call count is what convicts it.
const seamCalls = [];
let CLOCK_ISO = '2001-01-01T00:00:00.000Z';
let CLOCK_MS = 978307200000;

vi.mock('../../src/domain/clock.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    wallClockNow: () => { seamCalls.push(new Error('seam').stack); return CLOCK_ISO; },
    wallClockMs: () => { seamCalls.push(new Error('seam').stack); return CLOCK_MS; },
  };
});

const { composeInstantWorld } = await import('../../src/lib/instantWorld/composeInstantWorld.js');
// ⭐ THE CREATE BOUNDARY'S ASYNC PRELUDE (2026-09-08, lane LIGHT car 1b). The
// composer is a classified BIRTH and is SYNCHRONOUS, so it cannot load the lazy
// payload the law it mints needs; since the living-content dial was lit the seam
// THROWS rather than degrading when nothing loaded it. Awaited beside the import
// that reaches the composer, which is the same shape the composer's three
// production callers take.
const { loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
await loadGenerationLawPayloads();
const { simulateCampaignWorldInterval } = await import('../../src/domain/worldPulse/advanceInterval.js');
const { ensureRegionalGraph } = await import('../../src/domain/region/graph.js');
const { SIMULATION_RULE_PRESETS } = await import('../../src/domain/worldPulse/simulationRules.js');
const { soakAdvanceEpoch } = await import('../../scripts/audit/soakRules.mjs');

const PINNED_NOW = '2024-01-01T00:00:00.000Z';

function advanceFixture(seed) {
  const ids = ['leg-a', 'leg-b', 'leg-c', 'leg-d'];
  const saves = ids.map((id, i) => ({
    id,
    name: `Leg ${id}`,
    phase: 'canon',
    settlement: {
      id, name: `Leg ${id}`, tier: 'village', population: 400 + i * 50,
      config: { tradeRouteAccess: 'road' },
      economicState: { primaryExports: ['Grain'], primaryImports: ['Iron'] },
      institutions: [], powerStructure: { factions: [], conflicts: [] },
      npcs: [], activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }));
  return {
    saves,
    campaign: {
      id: 'seam-probe', name: 'Seam Probe', settlementIds: ids,
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.leg-a.leg-b', from: 'leg-a', to: 'leg-b', relationshipType: 'trade_partner' },
          { id: 'edge.leg-b.leg-c', from: 'leg-b', to: 'leg-c', relationshipType: 'trade_partner' },
          { id: 'edge.leg-a.leg-c', from: 'leg-a', to: 'leg-c', relationshipType: 'rival' },
        ],
        channels: [
          { type: 'trade_dependency', from: 'leg-a', to: 'leg-b', status: 'confirmed', strength: 0.55, goods: [] },
        ],
      }, { now: PINNED_NOW }),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: {
        rngSeed: seed, tick: 0, canonizedAt: PINNED_NOW,
        simulationRules: SIMULATION_RULE_PRESETS.full_simulation.rules,
        stressors: [{
          id: 'world_stressor.famine.leg-c', type: 'famine', severity: 0.85,
          affectedSettlementIds: ['leg-c'],
        }],
      },
    },
  };
}

async function runAdvance(seed, years) {
  let { campaign, saves } = advanceFixture(seed);
  for (let y = 1; y <= years; y += 1) {
    const result = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_year', commit: true, now: PINNED_NOW, autoResolve: true,
      // LIT-0 (2026-09-24): each yearly interval is one ADVANCE, so it threads the flag-gated epoch the
      // kernel demands once `advanceEpochEnabled` is lit (the soak's own `soakAdvanceEpoch`, keyed on
      // seed and year). Dark it is null, byte-identical; the epoch reads no clock either way.
      advanceEpoch: soakAdvanceEpoch({ simulationRules: campaign.worldState?.simulationRules, seed, year: y }),
    });
    campaign = {
      ...campaign,
      worldState: result.worldState,
      wizardNews: result.wizardNews,
      regionalGraph: result.regionalGraph ?? campaign.regionalGraph,
    };
    saves = result.saves ?? saves;
  }
  return JSON.stringify({ campaign, saves });
}

/** Run `fn` with the clock at one instant, returning its bytes and the seam reads it made. */
async function withClock(iso, ms, fn) {
  seamCalls.length = 0;
  CLOCK_ISO = iso;
  CLOCK_MS = ms;
  const bytes = await fn();
  return { bytes, reads: [...seamCalls] };
}

/**
 * The frame that is actually to blame, for an error message a reader can act on.
 * Skips clock.js AND the per-module `nowIso()` wrappers — naming the wrapper tells you the
 * seam was used, which you already know; naming its CALLER tells you who forgot to thread.
 * Deduped, because one compose reaches the same site a hundred times and a hundred identical
 * lines of failure output hide the one line that differs.
 */
function cite(stacks) {
  const seen = new Set();
  for (const stack of stacks) {
    const frames = String(stack).split('\n').filter((l) => /\/src\//.test(l));
    const blame = frames.find((l) => !/clock\.js/.test(l) && !/\bat nowIso\b/.test(l)) || frames[0] || '?';
    seen.add(blame.trim().replace(REPO, '<repo>'));
  }
  return [...seen];
}

describe('ARM C — the same seed produces the same world with the clock moved', () => {
  test('the seeded instant-world composer reads the clock ZERO times and is byte-identical', async () => {
    const a = await withClock('2001-01-01T00:00:00.000Z', 978307200000,
      async () => JSON.stringify(composeInstantWorld({ seed: 'seam-probe-a', basicConfig: { realmSize: 'small' } })));
    const b = await withClock('2099-12-31T23:59:59.000Z', 4102444799000,
      async () => JSON.stringify(composeInstantWorld({ seed: 'seam-probe-a', basicConfig: { realmSize: 'small' } })));

    expect(
      cite(a.reads),
      'the seeded composer READ THE WALL CLOCK. Its whole contract is a pure function of the '
      + 'seed (`now` defaults to EPOCH_ISO through the injected clock), so a read here forfeits '
      + 'replayability even when the bytes happen to survive — composeInstantWorld once minted a '
      + 'clock `updatedAt` that a spread overwrote one property later, and only this count saw it.',
    ).toEqual([]);
    expect(cite(b.reads)).toEqual([]);
    expect(a.bytes.length).toBeGreaterThan(1000); // non-vacuous: it really composed a world
    expect(a.bytes === b.bytes, 'the same seed composed two different realms a century apart').toBe(true);
  }, 120000);

  test('a two-year kernel advance reads the clock ZERO times and is byte-identical', async () => {
    const a = await withClock('2001-01-01T00:00:00.000Z', 978307200000, () => runAdvance('seam-probe', 2));
    const b = await withClock('2099-12-31T23:59:59.000Z', 4102444799000, () => runAdvance('seam-probe', 2));

    expect(
      cite(a.reads),
      'the pinned advance READ THE WALL CLOCK — a caller on the advance path is not threading '
      + '`now`. The frame above names it.',
    ).toEqual([]);
    expect(a.bytes.length).toBeGreaterThan(10000);
    expect(a.bytes === b.bytes, 'the same seed advanced into two different worlds a century apart').toBe(true);
  }, 180000);

  test('NEGATIVE CONTROL: the mocked seam really is wired, and really does vary', async () => {
    // Every assertion above is `reads === []` and `bytes equal`, both of which a DEAD mock
    // satisfies perfectly. Reach the seam deliberately and prove the mock is live and moves.
    const { wallClockNow, wallClockMs } = await import('../../src/domain/clock.js');
    const first = await withClock('2001-01-01T00:00:00.000Z', 978307200000, async () => wallClockNow());
    const second = await withClock('2099-12-31T23:59:59.000Z', 4102444799000, async () => wallClockNow());
    expect(first.bytes).toBe('2001-01-01T00:00:00.000Z');
    expect(second.bytes).toBe('2099-12-31T23:59:59.000Z');
    expect(first.reads.length, 'the mock did not record the read it just served').toBe(1);
    expect(wallClockMs()).toBe(4102444799000);
  });
});
