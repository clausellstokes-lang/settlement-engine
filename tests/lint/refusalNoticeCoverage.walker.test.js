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
    // A surface can receive one when it reads `lastRefusal` off the store.
    const readers = SOURCES.filter(({ rel, src }) => rel.startsWith('src/components/')
      && rel !== NOTICE && /\blastRefusal\b/.test(src)).map((f) => f.rel);
    expect(readers.length, 'no surface reads lastRefusal — the register reaches no reader')
      .toBeGreaterThanOrEqual(4);
    const withoutNotice = readers.filter((rel) => {
      const src = SOURCES.find((f) => f.rel === rel).src;
      return !/<RefusalNotice\b/.test(src);
    });
    expect(
      withoutNotice,
      '\nA surface reads `lastRefusal` but never renders <RefusalNotice>. Reading the reason and '
      + 'not showing it is the defect with an extra step:\n'
      + `${withoutNotice.join('\n')}\n`,
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
