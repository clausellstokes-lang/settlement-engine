/**
 * aiSurfaceSourceScan.test.js — THE FINITE-SEMANTICS WALL, PROVEN PER AI SURFACE
 * (Enforcer E-D part 1; A+ bar 19 — AI STRUCTURE).
 *
 * tableEventsNoFreeText.test.js proves the wall at ONE apply path (the DM's table-event
 * `flavor` may only ever become the display `summary`, never a mechanical field). This
 * enforcer GENERALIZES that guarantee to EVERY AI surface: the finite-semantics law —
 * "AI is a bucketing clerk, never a writer; free text is flavor/receipt ONLY; typed
 * buckets alone touch the engine" — must hold per surface, not just at the one wall.
 *
 * THE CENSUS (the wall against an N-1 sweep): the AI-surface roster is DISCOVERED from
 * source — every supabase/functions/<fn> whose code calls the model. It is NEVER a
 * hand-list that can silently drift. A NEW model-calling edge surface that appears
 * without a disposition in AI_SURFACE_WALLS reds THIS test loudly (census completeness),
 * rather than shipping an un-walled surface a green suite would hide.
 *
 * THE PER-SURFACE PROOF (the disposition manifest): each surface declares HOW its model
 * output is kept off typed engine state:
 *   - 'shadow'  → the output commits to a DISPLAY-ONLY shadow object; the typed engine
 *                 state is never written by the overlay (narrative → aiSettlement).
 *   - 'walled'  → the client transport returns the output RAW; a deterministic DOMAIN
 *                 wall (a validator / a finite vocabulary) re-projects it onto typed
 *                 fields before any engine application (the Surveyor write stages).
 *   - 'display' → a read-only prose ANSWER; it never reaches typed state at all.
 *   - 'none'    → no client apply seam exists for the surface (nothing to breach); the
 *                 census tripwire fires if a future seam is wired without a disposition.
 *   - 'byok'    → a key/health management transport; returns status, never engine state.
 * The scan then reads each surface's seam and asserts the declared guard is present.
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';

const ROOT = resolve(process.cwd());
const FN_DIR = join(ROOT, 'supabase', 'functions');
const readSrc = (rel) => (existsSync(join(ROOT, rel)) ? readFileSync(join(ROOT, rel), 'utf8') : '');

// ── The DISCOVERED roster: every edge function that calls the model ──────────
// Walk each function's whole .ts tree (a call may live in a *Core.ts, not index.ts —
// parley's does). The token set names the provider seam without over-fitting one call
// shape; guard-the-guard below fails if it ever collapses to a vacuous set.
const MODEL_CALL = /anthropic|runCreditedCall|callAnthropic|messages\.create|createMessage|ANTHROPIC_CLAUDE|resolveModel|providerKey/i;

function tsFilesUnder(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return tsFilesUnder(p);
    return /\.ts$/.test(name) && !/\.test\.ts$/.test(name) ? [p] : [];
  });
}

function callsModel(fnName) {
  const dir = join(FN_DIR, fnName);
  if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
  return tsFilesUnder(dir).some((f) => MODEL_CALL.test(readFileSync(f, 'utf8')));
}

const AI_SURFACES = readdirSync(FN_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== '_shared')
  .map((d) => d.name)
  .filter(callsModel)
  .sort();

// ── The per-surface disposition manifest ─────────────────────────────────────
// Each rostered surface MUST have an entry. `seam` is the client-side module where the
// model output is consumed; `walls` are the deterministic symbols that must appear in
// (or guard) that seam. A surface with no entry, or an entry not in the roster, reds.
const AI_SURFACE_WALLS = Object.freeze({
  // The narrative overlay commits to a DISPLAY-ONLY shadow (`aiSettlement`); the typed
  // `settlement` is never written by the overlay, and every streamed string is scrubbed.
  'generate-narrative': {
    disposition: 'shadow',
    seam: 'src/store/aiSlice.js',
    transport: 'src/lib/ai.js',
    walls: ['verifyAiOverlay', 'scrubClerkRegister'],
  },
  // The Surveyor WRITE stages: raw output returned by lib/surveyorWrite.js, re-projected
  // by a deterministic domain wall (a finite vocabulary / a validator) before any apply.
  'custom-content':      { disposition: 'walled', seam: 'src/lib/surveyorWrite.js', walls: ['buildContentVocabulary'] },
  'style-overhaul':      { disposition: 'walled', seam: 'src/lib/surveyorWrite.js', walls: ['buildStyleVocabulary'] },
  'construct-settlement':{ disposition: 'walled', seam: 'src/lib/surveyorWrite.js', walls: ['buildConstructVocabulary'] },
  'construct-realm':     { disposition: 'walled', seam: 'src/lib/surveyorWrite.js', walls: ['buildConstructVocabulary'] },
  'interpret-session':   { disposition: 'walled', seam: 'src/lib/surveyorWrite.js', walls: ['buildOpVocabulary'] },
  'surveyor-autonomy':   { disposition: 'walled', seam: 'src/lib/surveyorWrite.js', walls: ['validateStopCondition', 'validateNudge'] },
  // Read-only prose ANSWERS — never reach typed state (the grounding they read is typed).
  'ai-analyst':          { disposition: 'display', seam: 'src/lib/aiAnalyst.js',       answerField: 'answer' },
  'interview':           { disposition: 'display', seam: 'src/lib/interview.js',        answerField: 'answer' },
  'generate-chronicle':  { disposition: 'display', seam: 'src/lib/campaignChronicle.js', answerField: 'chronicle' },
  // No client apply seam exists in the tree today (the edge is live server-side). The
  // census tripwire below fires if a client invocation is ever wired without a disposition.
  'parley':              { disposition: 'none' },
  // A key/health management transport — returns status rows, never engine state.
  'surveyor-byok':       { disposition: 'byok', seam: 'src/lib/surveyorByok.js' },
});

describe('AI-surface source scan — census completeness (the wall against an N-1 sweep)', () => {
  it('the discovered roster is non-empty (guard-the-guard: not a vacuous pass)', () => {
    // If this collapses, the MODEL_CALL detector broke and every per-surface check below
    // would vacuously pass. Today the roster is the ~12 model-calling edge surfaces.
    expect(AI_SURFACES.length).toBeGreaterThanOrEqual(11);
  });

  it('every discovered AI surface has a wall disposition (a NEW surface reds here)', () => {
    const unscanned = AI_SURFACES.filter((s) => !(s in AI_SURFACE_WALLS));
    expect(
      unscanned,
      `these model-calling edge surfaces have NO finite-semantics disposition in `
      + `AI_SURFACE_WALLS — a new AI surface must declare how its output is kept off typed `
      + `engine state (shadow/walled/display/none/byok) before it can ship: ${unscanned.join(', ')}`,
    ).toEqual([]);
  });

  it('the manifest carries no stale entry (every disposition maps to a live surface)', () => {
    const stale = Object.keys(AI_SURFACE_WALLS).filter((s) => !AI_SURFACES.includes(s));
    expect(stale, `AI_SURFACE_WALLS names surfaces not in the discovered roster: ${stale.join(', ')}`).toEqual([]);
  });
});

describe('AI-surface source scan — the wall proven per surface', () => {
  const entries = Object.entries(AI_SURFACE_WALLS);

  it.each(entries.filter(([, m]) => m.disposition === 'walled'))(
    '%s (walled): its raw output is re-projected through a deterministic domain wall',
    (name, m) => {
      const src = readSrc(m.seam);
      expect(src.length, `${name}: seam ${m.seam} is present`).toBeGreaterThan(0);
      for (const wall of m.walls) {
        expect(
          src.includes(wall),
          `${name}: the client seam ${m.seam} must route the model output through the `
          + `deterministic wall '${wall}' — a walled surface never lets raw model text reach a `
          + `typed engine field directly.`,
        ).toBe(true);
      }
    },
  );

  it('generate-narrative (shadow): the overlay commits DISPLAY-ONLY, never the typed settlement', () => {
    const store = readSrc('src/store/aiSlice.js');
    const transport = readSrc('src/lib/ai.js');
    expect(store.length).toBeGreaterThan(0);
    // The overlay commits to the display-only shadow field...
    expect(store).toMatch(/state\.aiSettlement\s*=/);
    // ...and setAiSettlement must NOT overwrite the typed engine state with the AI payload.
    const setBody = bodyOfArrow(store, 'setAiSettlement');
    expect(setBody, 'setAiSettlement body located').toBeTruthy();
    expect(
      /state\.settlement\s*=/.test(setBody),
      'setAiSettlement must never assign state.settlement — the AI overlay is a display-only '
      + 'shadow; the typed settlement is immutable to the model.',
    ).toBe(false);
    // The canon-preservation verifier runs on commit (drift is reported, never silently kept).
    expect(store).toMatch(/verifyAiOverlay|runOverlayVerifier/);
    // Every streamed string passes the clerk register scrub before the store meets it.
    expect(transport).toMatch(/scrubClerkRegister\s*\(/);
    expect(transport).toMatch(/setPath\(result,\s*msg\.field,\s*clean\)/);
  });

  it.each(entries.filter(([, m]) => m.disposition === 'display'))(
    '%s (display): a read-only answer transport that never writes typed engine state',
    (name, m) => {
      const src = readSrc(m.seam);
      expect(src.length, `${name}: seam ${m.seam} present`).toBeGreaterThan(0);
      // The transport returns a prose answer field...
      expect(src.includes(m.answerField), `${name}: returns a '${m.answerField}' field`).toBe(true);
      // ...and never mutates the typed settlement / worldState with the model output.
      expect(/state\.settlement\s*=/.test(src), `${name}: must not assign state.settlement`).toBe(false);
      expect(/\.worldState\s*=\s*/.test(src), `${name}: must not assign worldState`).toBe(false);
    },
  );

  it('parley (none): no client invocation seam is wired (nothing to breach)', () => {
    // parley is a live server-side surface with no client apply path in the tree. If one is
    // ever wired, this reds — forcing the maintainer to declare its disposition + wall.
    const offenders = clientFilesInvoking('parley');
    expect(
      offenders,
      `a client seam now invokes the 'parley' edge — declare its finite-semantics disposition `
      + `in AI_SURFACE_WALLS (walled/display) and wall its output before it can ship: ${offenders.join(', ')}`,
    ).toEqual([]);
  });

  it('surveyor-byok (byok): a status transport that never writes engine state', () => {
    const src = readSrc('src/lib/surveyorByok.js');
    expect(src.length).toBeGreaterThan(0);
    expect(/state\.settlement\s*=/.test(src)).toBe(false);
    expect(/\.worldState\s*=\s*/.test(src)).toBe(false);
  });
});

describe('AI-surface source scan — the DM-input wall (the generalization anchor)', () => {
  // The origin wall the census generalizes: the DM's verbatim table-event `flavor` may
  // only ever become the display `summary`, never a mechanical field. Held here too so the
  // per-surface census and the one-wall exemplar live under one enforcer.
  const tableEvents = readSrc('src/domain/tableEvents.js');
  const applyBody = bodyOfFn(tableEvents, 'tableEventToNewsEntry');

  it('the table-event apply routes DM free text (flavor) ONLY to the display summary', () => {
    expect(applyBody, 'tableEventToNewsEntry located').toBeTruthy();
    const flavorLines = applyBody.split('\n').filter((l) => l.includes('flavor') && !l.trim().startsWith('//'));
    expect(flavorLines.length).toBeGreaterThan(0);
    for (const line of flavorLines) expect(line).toMatch(/summary\s*:/);
  });

  it('no mechanical field of the apply derives from flavor', () => {
    for (const field of ['severity', 'significance', 'impactKind', 'tick', 'settlementIds', 'tags']) {
      const fieldLine = applyBody.split('\n').find((l) => new RegExp(`\\b${field}\\s*:`).test(l));
      if (fieldLine) expect(fieldLine.includes('flavor')).toBe(false);
    }
  });
});

describe('AI-surface source scan — self-checks (the detectors mean what they claim)', () => {
  it('the model-call detector distinguishes a model-calling function from a plain one', () => {
    expect(MODEL_CALL.test("const r = await callAnthropic(prompt)")).toBe(true);
    expect(MODEL_CALL.test("const m = Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_5_MODEL')")).toBe(true);
    expect(MODEL_CALL.test("await supabaseAdmin.from('gallery').select('*')")).toBe(false);
  });

  it('the typed-write detector flags an AI text write into typed state', () => {
    // Prove the wall would RED a regression that routed model text into the engine.
    const bad = 'set(state => { state.settlement = aiData; });';
    const good = 'set(state => { state.aiSettlement = aiData; });';
    expect(/state\.settlement\s*=/.test(bad)).toBe(true);
    expect(/state\.settlement\s*=/.test(good)).toBe(false);
  });
});

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract a `function NAME(...) { ... }` body (brace-matched). */
function bodyOfFn(src, name) {
  const start = src.indexOf(`function ${name}(`);
  if (start === -1) return '';
  return braceBody(src, src.indexOf('{', start));
}

/** Extract an arrow/object-method body for `NAME: (...) => set(state => { ... })` or
 *  `NAME: (...) => { ... }`. Returns the outermost brace body after the key. */
function bodyOfArrow(src, name) {
  const start = src.indexOf(`${name}:`);
  if (start === -1) return '';
  return braceBody(src, src.indexOf('{', start));
}

function braceBody(src, open) {
  if (open === -1) return '';
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(open, i + 1); }
  }
  return '';
}

/** Every client (src/) file that invokes the given edge slug. */
function clientFilesInvoking(slug) {
  const SRC = join(ROOT, 'src');
  const re = new RegExp(`invoke\\(\\s*['"\`]${slug}['"\`]|functions/v1/${slug}\\b`);
  const walk = (dir) => readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walk(p);
    if (!/\.(js|jsx|ts|tsx)$/.test(name)) return [];
    return re.test(readFileSync(p, 'utf8')) ? [p.replace(ROOT + '/', '')] : [];
  });
  return existsSync(SRC) ? walk(SRC) : [];
}
