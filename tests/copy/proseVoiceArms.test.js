/**
 * proseVoiceArms.test.js — TWO MECHANICAL ARMS ON THE DOSSIER'S VOICE
 * (ADDENDUM 18 ruling 33 NO FORECAST, and ruling 40 (d) THE FAIR COPY DOES NOT CITE ITSELF;
 * car 8b-W-18o-r).
 *
 * ── WHY THESE ARE RATCHETS AND NOT REFUSALS, WHICH IS A DEPARTURE FROM THE BRIEF ─────
 *
 * The brief chartered both as REFUSALS at the projector — a face carrying one of these is
 * thrown out where the writer can read it. THE CORPUS SAYS OTHERWISE, and the measurement is
 * the argument:
 *
 *     the future indicative on any face           85 rows across 42 blocks
 *     the fair copy citing itself (player only)     5 rows across  4 blocks
 *
 * A refusal would red `generate-dossier-state-prose.mjs --check` on the next run and demand a
 * cure sweep across FORTY-TWO BLOCKS — which this lane is forbidden to run (the owner, 2026-09-11:
 * *"only ever have one lane up at a time"*, and this lane is DS-DEF-2). The choice is not
 * between a refusal and nothing; it is between a refusal that cannot land for weeks and a
 * RATCHET that binds every new face from today. The ratchet is the estate's own idiom, and
 * `voiceMechanics.test.js` beside this file is the same shape: a committed per-block baseline
 * that may only FALL. A block absent from the baseline must measure ZERO.
 *
 * ⛔ SO THE ARMS BIND THE LANE THAT IS OPEN AND BANK THE REST BY NAME. DS-DEF-2's two
 * self-citation rows are cured in the next car of this same lane and its baseline entry falls
 * to zero there; the other blocks' rows are banked, visible, and can never grow.
 *
 * ⚠ AND THE FORECAST ARM'S FALSE-POSITIVE PATH IS DOCUMENTED RATHER THAN DENIED, because the
 * brief asked for it by name. `\b(will|shall)\s+<verb>` catches two things ruling 33 does not
 * mean:
 *   THE GENERIC FUTURE. *"A stranger will find no bargains"* is not a prediction about the
 *     town's fate, it is a habitual: anyone who looks, finds. Most of the 85 banked rows are
 *     this, and they are banked rather than cured for exactly that reason.
 *   `will` AS A NOUN. *"the will of the council"* — rare, and none exists in the corpus today
 *     (this file measures it and prints zero), but the pattern would catch `will of`.
 * The escape is the CHAIR'S, by lowering a baseline entry in a commit that says why. There is
 * no per-row waiver, on purpose: a waiver that lives beside the row is a waiver nobody reads.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE = join(ROOT, 'tests/copy/.prose-voice-arms-baseline.json');
const UPDATE = process.env.UPDATE_PROSE_VOICE_ARMS === '1';

/**
 * ⭐ THE FUTURE INDICATIVE (ruling 33). `will` or `shall` followed by a verb. The CONDITIONAL
 * and the SUBJUNCTIVE stay, which the ruling says outright — "would", "could", "might" and
 * "may" are all untouched, and that is the difference between a forecast and a possibility.
 */
const FORECAST_RE = /\b(?:will|shall)\s+(?:not\s+|never\s+)?[a-z]+\b/i;

/**
 * ⭐ THE FAIR COPY CITING ITSELF (ruling 40 (d), the owner's: *"the survey should not refer to
 * itself"*). A CLOSED list of the struck frames, and deliberately NOT the bare word "the
 * record" — which appears 48 times in the annex as the town's OWN record, a lawful noun, and a
 * blanket bar on it would convict the thing ruling 40 explicitly permits ("a specific record
 * this town keeps by name may be cited for what it holds").
 */
const SELF_CITATION = Object.freeze([
  'the survey', 'this office', 'the record has', 'entered as', 'entered here as',
  'set down here', 'so far as the survey', "in the survey's time", "by the survey's",
]);
const SELF_RE = new RegExp(`\\b(?:${SELF_CITATION.join('|')})\\b`, 'i');

/** `will` as a NOUN — the documented false-positive path, measured so it stays at zero. */
const WILL_AS_NOUN_RE = /\b(?:the|a|his|her|their|its)\s+will\b/i;

const CORPORA = Object.freeze([
  ['DEFENSE', DOSSIER_STATE_PROSE_DEFENSE], ['ECONOMY', DOSSIER_STATE_PROSE_ECONOMY],
  ['POWER', DOSSIER_STATE_PROSE_POWER], ['WAR_FAITH', DOSSIER_STATE_PROSE_WAR_FAITH],
  ['STRESSORS', DOSSIER_STATE_PROSE_STRESSORS], ['GENERAL', DOSSIER_STATE_PROSE_GENERAL],
]);

/**
 * Every PLAYER face of the corpus — the spine and every wording of every variant NOT marked
 * `dm-only`. ⭐ THE NOTEBOOK IS EXEMPT FROM THE SELF-CITATION ARM AND ONLY FROM THAT ONE
 * (ruling 40 (a): *"it is the archiver's own working notes for a successor, and 'this office',
 * 'whoever reads this next' are its nature"*). The FORECAST arm binds the notebook too, which
 * ruling 33 says in as many words: *"barred on every player face AND NOTE"*. So the covert
 * variants are gathered here with their audience, and each arm decides for itself.
 */
function everyFace() {
  const out = [];
  for (const [, corpus] of CORPORA) {
    for (const [blockId, block] of Object.entries(corpus)) {
      for (const [poolKey, pool] of Object.entries(block.pools)) {
        for (const variant of pool) {
          const covert = Array.isArray(variant.marks) && variant.marks.includes('dm-only');
          for (const text of [variant.text, ...(variant.wordings || [])]) {
            out.push({ blockId, poolKey, text, covert });
          }
        }
      }
    }
  }
  return out;
}

/** Count per block, dropping zeroes, so a cured block leaves the baseline entirely. */
function tally(rows) {
  const out = {};
  for (const row of rows) out[row.blockId] = (out[row.blockId] || 0) + 1;
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => (a < b ? -1 : 1)));
}

const FACES = everyFace();
const forecasts = FACES.filter((f) => FORECAST_RE.test(f.text));
// The notebook is exempt from THIS arm and this arm only (ruling 40 (a)).
const citations = FACES.filter((f) => !f.covert && SELF_RE.test(f.text));
const current = { forecast: tally(forecasts), selfCitation: tally(citations) };

if (UPDATE) {
  writeFileSync(BASELINE, `${JSON.stringify({
    _doc: 'THE TWO VOICE ARMS (ADDENDUM 18 rulings 33 and 40 (d); car 8b-W-18o-r). SHRINK-ONLY, per BLOCK. A count may FALL and never grow; a block absent here must measure ZERO. Regenerate an APPROVED fall with UPDATE_PROSE_VOICE_ARMS=1 npx vitest run tests/copy/proseVoiceArms.test.js, in a commit that says which block fell and why. There is no per-row waiver: a waiver that lives beside the row is a waiver nobody reads.',
    _forecast: 'ruling 33 NO FORECAST — the future indicative on any face, the notebook included. Most banked rows are the GENERIC future ("a stranger will find no bargains"), which is a habitual and not a prediction; they are banked rather than cured because curing them is a forty-two-block sweep and this lane is DS-DEF-2 alone.',
    _selfCitation: 'ruling 40 (d) THE FAIR COPY DOES NOT CITE ITSELF — the closed list of struck frames, on PLAYER faces only (the notebook is exempt by ruling 40 (a)). DS-DEF-2 falls to zero in the pool re-cut of this same lane.',
    ...current,
  }, null, 2)}\n`);
}

describe('E2 · NO FORECAST (ADDENDUM 18 ruling 33) — shrink-only, per block', () => {
  it('the committed baseline exists', () => {
    expect(
      existsSync(BASELINE),
      'baseline missing — for an APPROVED fall run: UPDATE_PROSE_VOICE_ARMS=1 npx vitest run tests/copy/proseVoiceArms.test.js',
    ).toBe(true);
  });

  it('⛔ no block\'s forecast debt GREW, and a block absent from the baseline carries none', () => {
    const baseline = JSON.parse(readFileSync(BASELINE, 'utf8')).forecast || {};
    const grew = [];
    for (const block of new Set([...Object.keys(baseline), ...Object.keys(current.forecast)])) {
      const was = baseline[block] || 0;
      const now = current.forecast[block] || 0;
      if (now > was) grew.push(`${block}: ${was} → ${now}`);
    }
    expect(grew, 'a NEW future indicative — rewrite it; never raise the baseline').toEqual([]);
    process.stdout.write(`\n[forecast] ${forecasts.length} rows over ${FACES.length} faces: ${
      Object.entries(current.forecast).map(([b, n]) => `${b} ${n}`).join(' · ')}\n`);
  });

  it('⚠ the FALSE-POSITIVE path is measured, not assumed: `will` as a noun is at zero', () => {
    // If this ever fires, the pattern is convicting a noun and the arm needs a carve-out —
    // which is why it is measured here rather than asserted in a comment.
    const nouns = FACES.filter((f) => WILL_AS_NOUN_RE.test(f.text));
    expect(nouns.map((f) => `${f.blockId} :: ${f.text}`)).toEqual([]);
  });

  it('⭐ the CONDITIONAL and the SUBJUNCTIVE are untouched — that is the whole distinction', () => {
    // Ruling 33: "the conditional and subjunctive stay". A forecast says what WILL happen; a
    // conditional says what would, could or might, which is a door left ajar and is the law's
    // entire posture (§1: "a door left ajar, not a verdict").
    for (const ok of [
      'The stores would carry the town through a hungry season.',
      'A stranger might find no bargains here.',
      'It may be that both accounts describe different weeks.',
      'The wall could be held if anybody were paid to stand on it.',
    ]) expect(FORECAST_RE.test(ok), ok).toBe(false);
    for (const bad of [
      'The stores will carry the town through hunger.',
      'Nothing here shall hold against a siege.',
      'The town will not answer another call.',
    ]) expect(FORECAST_RE.test(bad), bad).toBe(true);
  });
});

describe('E2 · THE FAIR COPY DOES NOT CITE ITSELF (ruling 40 (d)) — shrink-only, per block', () => {
  it('⛔ no block\'s self-citation debt GREW, and a block absent from the baseline carries none', () => {
    const baseline = JSON.parse(readFileSync(BASELINE, 'utf8')).selfCitation || {};
    const grew = [];
    for (const block of new Set([...Object.keys(baseline), ...Object.keys(current.selfCitation)])) {
      const was = baseline[block] || 0;
      const now = current.selfCitation[block] || 0;
      if (now > was) grew.push(`${block}: ${was} → ${now}`);
    }
    expect(grew, 'the fair copy cited itself in a NEW face — state the fact bare (ruling 40)').toEqual([]);
    process.stdout.write(`[self-citation] ${citations.length} rows over ${FACES.length} player faces: ${
      Object.entries(current.selfCitation).map(([b, n]) => `${b} ${n}`).join(' · ') || 'none'}\n`);
    for (const row of citations) {
      process.stdout.write(`[self-citation]   ${row.blockId} :: ${row.poolKey}\n`);
    }
  });

  it('⛔ the list is CLOSED and does NOT bar the town\'s own record, which ruling 40 permits', () => {
    // Ruling 40 keeps the citation of a record the town actually keeps: "a muster roll only
    // where a militia keeps one; a toll book only where a gate is held". A blanket bar on "the
    // record" would convict exactly what the ruling licenses — and it would convict 48 lawful
    // annex rows. So the list bars `the record HAS` (the survey frame) and not `the record`.
    // ⭐ AND THE DISCRIMINATION IS EXACT, which this arm found by failing: "the hall's record
    // has the walls in it" is NOT caught, because the record being cited is the HALL'S and the
    // hall is a source the town keeps. "The record has the walls kept" IS caught, because there
    // the record is the dossier citing itself. The possessive is the whole difference.
    expect(SELF_RE.test("the hall's record has the walls in it")).toBe(false);
    expect(SELF_RE.test('The record has the walls kept and nobody on them.')).toBe(true);
    expect(SELF_RE.test('Nothing in the record explains where it came from.')).toBe(false);
    expect(SELF_RE.test('The muster roll is short by a dozen names.')).toBe(false);
    for (const struck of ['The survey finds the walls kept.', 'So far as the survey can find, it is kept.',
      'Entered as kept, with nobody behind it.', 'Set down here: a wall and no force.',
      'This office has watched the gate at dusk.']) {
      expect(SELF_RE.test(struck), struck).toBe(true);
    }
  });

  it('⭐ THE NOTEBOOK IS EXEMPT from this arm, and from this arm ONLY (ruling 40 (a))', () => {
    // "it is the archiver's own working notes for a successor, and 'this office', 'whoever
    // reads this next' are its nature". The forecast arm has no such exemption — ruling 33
    // bars the future indicative "on every player face AND NOTE" — so the two arms gather
    // different sets, and this asserts they really do.
    const covert = FACES.filter((f) => f.covert);
    expect(covert.length, 'the corpus carries covert variants at all').toBeGreaterThan(0);
    expect(citations.every((f) => !f.covert), 'the citation arm skips the notebook').toBe(true);
    expect(forecasts.some((f) => f.covert) || covert.every((f) => !FORECAST_RE.test(f.text)),
      'the forecast arm does NOT skip the notebook').toBe(true);
  });
});
