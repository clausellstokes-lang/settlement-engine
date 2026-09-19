/**
 * refusalNoticeCoverage.walker.test.js — NO GATE REFUSES SILENTLY, AND THE CLASS
 * CANNOT COME BACK.
 *
 * ── THE CLASS (owner ruling, ODQ §934.24(c)) ───────────────────────────────────
 * The generation lane refuses by returning `null`. For as long as that was ALL it
 * did, a caller could not say why, so four surfaces each hand-rolled their own
 * pre-flight for the same anonymous daily cap — and three of the four answered a
 * refusal by NAVIGATING with nothing said:
 *
 *   generate/FoundingWorlds.jsx   onNavigate('generate')  — and it renders ON /create
 *   home/LandingArtifacts.jsx     onNavigate('generate')
 *   howto/ForgeExactDemo.jsx      navigate('generate')
 *   GenerateWizard.jsx            onSignIn()              — a door with no reason on it
 *
 * The 2026-09-19 walk clicked one of them and reported, exactly: no settlement, no
 * toast, no role=alert, zero console output.
 *
 * ── WHAT IS PROVED HERE ────────────────────────────────────────────────────────
 * The cure is a REGISTER (src/lib/refusalReasons.js), one copy block
 * (copy/en.js `refusals`), and one component (primitives/RefusalNotice.jsx). Three
 * things can rot independently and each one silently:
 *
 *   1. COPY    — every registered reason resolves to a rubric AND a body (following
 *                `bodyRef` when the reason defers to an existing `errors.*` key).
 *                A reason with no words renders NOTHING, which is the defect again.
 *   2. RAISED  — every registered reason is raised somewhere in src/. A reason
 *                nothing raises is dead vocabulary that reads as coverage.
 *   3. RENDERED— RefusalNotice is mounted on every surface that can receive a
 *                refusal. A reason recorded on a page with no notice is a refusal
 *                the reader never sees.
 *
 * ⛔ ARM 3'S DENOMINATOR WAS SELF-FULFILLING, AND THAT IS WHY IT PROVED NOTHING
 * (adversarial review of the second wave). It read "every file that reads
 * `lastRefusal`" and then asked whether those files render the notice — but a surface
 * that never learned about the register reads no `lastRefusal`, so the three silent
 * ones (HomeHero, SettlementsPanel, SeedField) were not in the set being measured.
 * The walker was green over the exact defect it was written for.
 *
 * The denominator is now derived from the STORE'S OWN GENERATION ENTRY POINT: a
 * component that binds `s.generateSettlement` can receive a refusal, because that action
 * is the one thing in the tree that records one. That is a fact about the surface rather
 * than about how much of the cure it happens to have adopted, so a NEW caller is in the
 * denominator on the day it lands and must either render the notice or be admitted by
 * name with a reason. ARM 3c drives the detector over PLANTED sources so a walker that
 * stopped convicting reds here rather than in production.
 *
 * ⚠ KNOWN EDGE, STATED BECAUSE IT HID ONE OF THE THREE. The walk is per FILE. Measured
 * against the consist base 13ab242e3, this denominator convicts HomeHero.jsx and
 * SettlementsPanel.jsx — exactly the two surfaces that rendered no notice at all — but
 * NOT generate/LayeredConfigurationPanel.jsx, whose SeedField refused in silence while
 * the same file mounted the notice for a different reason a few lines above. A file-level
 * walker cannot see a second control inside a surface that already says something. The
 * per-CONTROL property is proved where controls exist: tests/components/
 * silentRefusalSurfaces.test.jsx clicks each one and reads the DOM back.
 *
 * …and the fourth arm is the habitat: NO surface may hand-roll the cap pre-flight
 * again. `anonAtCap()` is admitted in the generation lane (where the gate belongs)
 * and on the ONE surface that uses it to choose what to RENDER rather than to refuse
 * — HomeHero, whose at-cap unlock block is a deliberate, visible surface. Anywhere
 * else it is the class returning, and it reds.
 */

import { describe, expect, test } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { REFUSAL_REASON_IDS } from '../../src/lib/refusalReasons.js';
import { en } from '../../src/copy/index.js';
import { codeOnly } from '../helpers/codeOnlySource.js';

const ROOT = process.cwd();

/** The component every refusal must be said through. */
const NOTICE = 'src/components/primitives/RefusalNotice.jsx';

/**
 * ⛔ WHO MAY READ THE CAP COUNTER DIRECTLY, AND WHY.
 *
 * The gate itself belongs in the generation lane; everywhere else, reading the
 * counter to decide whether to ACT is the hand-rolled pre-flight this walker exists
 * against. The one admitted UI reader uses it to decide what to RENDER.
 */
const CAP_READERS_ADMITTED = Object.freeze({
  'src/store/settlementGenerateAction.js':
    'THE GATE. One point of enforcement for every generation path, which is what let the '
    + 'four surface copies be deleted rather than four times corrected.',
  'src/components/HomeHero.jsx':
    'RENDERS rather than refuses: `atCap` swaps the hero CTA for the at-cap unlock block '
    + '(a visible, deliberate surface with its own copy and its own door), and the '
    + 'free-today line reads the two buckets to say how much is left. Neither is a refusal.',
});

/**
 * ⛔ THE STORE'S GENERATION ENTRY POINT — the ONE action in this tree that records a
 * refusal (store/settlementGenerateAction.js is its body). A component that binds it can
 * receive one, whether or not it has ever heard of `lastRefusal`.
 *
 * The lookahead is load-bearing: `generateSettlementPDF` and `generateSettlementPipeline`
 * are different calls with no gate behind them, and a bare prefix match would drag four
 * export surfaces and the Surveyor's direct-pipeline probe into a denominator they have
 * no business in. The leading dot is load-bearing too — it matches the store READ
 * (`useStore(s => s.generateSettlement)`), not whatever local name the caller gave it.
 */
const GENERATION_ENTRY_RE = /\.generateSettlement(?![A-Za-z0-9_$])/;

/**
 * Surfaces that may be handed a refusal and deliberately do not render it, BY NAME.
 *
 * Empty today, and that is the honest state: all seven generation callers render the
 * notice. The mechanism exists because the alternative to a named exception is a widened
 * detector — and a detector widened to stay green is exactly how arm 3's denominator came
 * to measure its own adoption. A row here must say WHY the reader is not told.
 * @type {Readonly<Record<string, string>>}
 */
const GENERATION_CALLERS_ADMITTED = Object.freeze({});

function walkSource(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkSource(p, out);
    else if (/\.jsx?$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

const SOURCES = walkSource(join(ROOT, 'src'))
  .map((abs) => ({ rel: relative(ROOT, abs).replace(/\\/g, '/'), src: readFileSync(abs, 'utf8') }))
  .sort((a, b) => a.rel.localeCompare(b.rel));

/**
 * THE DENOMINATOR, as a function over SOURCE ROWS so the plants below can drive the same
 * code the live walk drives. A surface qualifies two ways, and both are needed: it BINDS
 * the store's generation entry point (it can be handed a refusal), or it already READS
 * `lastRefusal` (a route-raised reason — the Realm's and the admin route's — reaches a
 * page that never generates anything).
 *
 * Read through `codeOnly`: a call cannot execute from inside a comment, and three of the
 * files that merely DISCUSS `generateSettlement` in prose would otherwise be convicted for
 * describing it.
 * @param {{rel: string, src: string}[]} files
 * @returns {string[]}
 */
function refusalSurfacesIn(files) {
  return files
    .filter(({ rel, src }) => rel.startsWith('src/components/') && rel !== NOTICE
      && (GENERATION_ENTRY_RE.test(codeOnly(src)) || /\blastRefusal\b/.test(codeOnly(src))))
    .map((f) => f.rel)
    .sort();
}

/**
 * Of those, the ones that say NOTHING: no notice mounted and no admission on record.
 * @param {{rel: string, src: string}[]} files
 * @param {Readonly<Record<string, string>>} [admitted]
 * @returns {string[]}
 */
function silentSurfacesIn(files, admitted = GENERATION_CALLERS_ADMITTED) {
  const srcOf = new Map(files.map((f) => [f.rel, f.src]));
  return refusalSurfacesIn(files)
    .filter((rel) => !(rel in admitted) && !/<RefusalNotice\b/.test(codeOnly(srcOf.get(rel) || '')));
}

/** `dailyCap` -> `DAILY_CAP`, the register's own SCREAMING_SNAKE spelling. */
function screamingOf(id) {
  return id.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase();
}

/** Resolve a dotted key against the `en` table. */
function resolveKey(dotted) {
  let cur = en;
  for (const part of dotted.split('.')) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return cur;
}

describe('THE REFUSAL REGISTER — every reason has words, a raiser and a render site', () => {
  test('the walk is live', () => {
    // ⛔ ANTI-VACUITY: every arm below is "this list is empty" or "this set matches",
    // which an empty corpus or an empty register also satisfies.
    expect(SOURCES.length, 'the src tree is empty — has it moved?').toBeGreaterThanOrEqual(2200);
    expect(REFUSAL_REASON_IDS.length, 'the refusal register is empty').toBeGreaterThanOrEqual(5);
    expect(SOURCES.some((f) => f.rel === NOTICE), `${NOTICE} is gone`).toBe(true);
  });

  test('1. COPY: every registered reason resolves to a rubric and a body', () => {
    const broken = [];
    for (const reason of REFUSAL_REASON_IDS) {
      const row = resolveKey(`refusals.${reason}`);
      if (row == null || typeof row !== 'object') { broken.push(`${reason}: no refusals.${reason} block`); continue; }
      if (typeof row.rubric !== 'string' || !row.rubric.trim()) broken.push(`${reason}: no rubric`);
      if (typeof row.bodyRef === 'string') {
        const target = resolveKey(row.bodyRef);
        if (typeof target !== 'string' || !target.trim()) {
          broken.push(`${reason}: bodyRef "${row.bodyRef}" resolves to nothing`);
        }
      } else if (typeof row.body !== 'string' || !row.body.trim()) {
        broken.push(`${reason}: no body and no bodyRef`);
      }
    }
    expect(
      broken,
      '\nA registered refusal reason has no words. RefusalNotice renders NOTHING for a reason it '
      + 'cannot resolve, so this is the silent refusal coming back through the dictionary.\n'
      + 'Give it `rubric` plus `body` in copy/en.js `refusals`, or `bodyRef` pointing at an '
      + 'existing key that already carries the sentence:\n'
      + `${broken.join('\n')}\n`,
    ).toEqual([]);
  });

  test('1b. no copy row without a registered reason (dead vocabulary reds too)', () => {
    const rows = Object.keys(en.refusals || {});
    expect(rows.length, 'the refusals copy block is empty').toBeGreaterThanOrEqual(5);
    expect(
      rows.filter((r) => !REFUSAL_REASON_IDS.includes(r)),
      'copy/en.js `refusals` carries a row no reason in lib/refusalReasons.js names — '
      + 'register it or delete it; an unreachable sentence reads as coverage',
    ).toEqual([]);
  });

  test('2. RAISED: every registered reason is raised somewhere in src/', () => {
    // Matched by the CONSTANT a raiser uses, not by the bare string: the register
    // exists so that nobody writes these ids by hand, and a walker that accepted the
    // literal would quietly bless the habit it is meant to prevent.
    const unraised = REFUSAL_REASON_IDS.filter((reason) => !SOURCES.some(
      ({ rel, src }) => rel !== 'src/lib/refusalReasons.js'
        && src.includes(`REFUSAL_REASONS.${screamingOf(reason)}`),
    ));
    expect(
      unraised,
      '\nA registered refusal reason is raised by nothing in src/. Either a gate stopped recording '
      + 'it (the refusal is silent again) or the reason is dead and should be deleted from the '
      + 'register and the dictionary together:\n'
      + `${unraised.join('\n')}\n`,
    ).toEqual([]);
  });

  test('3. RENDERED: the notice is mounted on every surface that can receive a refusal', () => {
    const surfaces = refusalSurfacesIn(SOURCES);
    // ANTI-VACUITY: the denominator is the tree's generation callers, so an entry point
    // that was renamed (or a strip that broke) empties it and every arm below goes green
    // on nothing. Measured against this tree: seven callers, all rendering the notice.
    expect(
      surfaces.length,
      'no component binds the store\'s generation entry point — has `generateSettlement` '
      + 'been renamed? The denominator is empty, so this arm proves nothing.',
    ).toBeGreaterThanOrEqual(7);
    const silent = silentSurfacesIn(SOURCES);
    expect(
      silent,
      '\nA surface can be handed a refusal and never renders <RefusalNotice>. The lane answers '
      + 'a gate by returning null, so a caller that does not render the recorded reason IS the '
      + 'silent refusal — whether or not it has ever read `lastRefusal`:\n'
      + `${silent.join('\n')}\n`
      + 'Render the notice where the reader clicked, or admit the surface by name in '
      + 'GENERATION_CALLERS_ADMITTED with the reason the reader is not told.\n',
    ).toEqual([]);
  });

  test('3a. no stale admission: every named exception is still a generation surface', () => {
    const surfaces = refusalSurfacesIn(SOURCES);
    expect(
      Object.keys(GENERATION_CALLERS_ADMITTED).filter((rel) => !surfaces.includes(rel)),
      'GENERATION_CALLERS_ADMITTED names a file that can no longer receive a refusal — delete '
      + 'the stale row rather than leaving a standing permission nothing needs',
    ).toEqual([]);
  });

  test('3c. GUARD-THE-GUARD: the detector convicts a planted silent caller', () => {
    const CALLER = 'const forge = useStore((s) => s.generateSettlement);\nawait forge();';
    const planted = [
      { rel: 'src/components/PlantedSilent.jsx', src: CALLER },
      { rel: 'src/components/PlantedSaying.jsx', src: `${CALLER}\nreturn <RefusalNotice refusal={r} />;` },
      // A file that only TALKS about the entry point is prose, not a call site.
      { rel: 'src/components/PlantedProse.jsx', src: '// s.generateSettlement is called by its parent' },
      // …and the two homonyms that have no gate behind them.
      { rel: 'src/components/PlantedPdf.jsx', src: 'const p = useStore((s) => s.generateSettlementPDF);\np();' },
      { rel: 'src/components/PlantedPipeline.jsx', src: 'core.generateSettlementPipeline(cfg, null, { seed });' },
    ];
    expect(
      refusalSurfacesIn(planted),
      'the denominator no longer sees a plain generation caller, or it now sees prose and the PDF',
    ).toEqual(['src/components/PlantedSaying.jsx', 'src/components/PlantedSilent.jsx']);
    expect(
      silentSurfacesIn(planted, {}),
      'a planted caller that renders NOTHING was not convicted — the walker has stopped walking',
    ).toEqual(['src/components/PlantedSilent.jsx']);
    // …and the named admission really is the escape hatch it claims to be.
    expect(
      silentSurfacesIn(planted, { 'src/components/PlantedSilent.jsx': 'planted, for this arm' }),
      'an admitted surface was convicted anyway',
    ).toEqual([]);
  });

  test('3b. the notice is the ONLY renderer of refusal copy', () => {
    const offenders = SOURCES.filter(({ rel, src }) => rel !== NOTICE
      && /t\(\s*[`'"]refusals\./.test(src)).map((f) => f.rel);
    expect(
      offenders,
      '\nA surface reads the `refusals.*` copy directly instead of rendering <RefusalNotice>. '
      + 'One reason, one sentence, ONE component — a second renderer is a second idiom that '
      + 'agrees today and drifts by the month:\n'
      + `${offenders.join('\n')}\n`,
    ).toEqual([]);
  });

  test('4. HABITAT: no surface hand-rolls the cap pre-flight again', () => {
    // The counter's OWN module is the definition site, not a reader — it names and
    // calls its own export. Excluded by path rather than admitted by prose, because
    // "the module that defines it" is a structural fact and not a judgement anyone
    // should have to re-make.
    const COUNTER = 'src/lib/anonGenCounter.js';
    const readers = SOURCES
      .filter(({ rel, src }) => rel !== COUNTER && /\banonAtCap\s*\(/.test(src))
      .map((f) => f.rel);
    expect(readers.length, 'nothing reads the cap counter — has it moved?').toBeGreaterThanOrEqual(2);
    const unadmitted = readers.filter((rel) => !(rel in CAP_READERS_ADMITTED));
    expect(
      unadmitted,
      '\nA module calls anonAtCap() outside the generation lane. That is how the class began: four '
      + 'surfaces each checking the cap themselves and each answering a refusal their own way, '
      + 'three of them by navigating with nothing said.\n'
      + 'Let the lane refuse — it already enforces this gate for every path — and render its '
      + 'recorded reason with <RefusalNotice>. If a surface genuinely needs the counter to decide '
      + 'what to RENDER (not whether to act), admit it in CAP_READERS_ADMITTED with the reason:\n'
      + `${unadmitted.join('\n')}\n`,
    ).toEqual([]);
    expect(
      Object.keys(CAP_READERS_ADMITTED).filter((rel) => !readers.includes(rel)),
      'CAP_READERS_ADMITTED names a module that no longer reads the counter — delete the stale row',
    ).toEqual([]);
  });

  test('5. the exemption is an ARGUMENT, never a persisted config key', () => {
    // ⛔ THE STICKY-EXEMPTION TRAP (ODQ §934.24(b), and the 2026-09-16 production bug
    // it rhymes with). store/persistProjection.js persists `config`, so an exemption
    // read off a config key would outlive the fork that earned it and quietly un-cap
    // that browser for good.
    const lane = SOURCES.find((f) => f.rel === 'src/store/settlementGenerateAction.js').src;
    expect(lane, 'the lane no longer reads the intent argument').toMatch(/intentOf\(\s*options\s*\)/);
    expect(
      /_forkedFromSample/.test(lane.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '')),
      'the generation lane reads `_forkedFromSample` in CODE — the exemption must never be '
      + 'derived from the persisted config, only from the call argument',
    ).toBe(false);
  });
});
