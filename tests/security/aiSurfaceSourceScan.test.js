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
 * THE CENSUS (the wall against an N-1 sweep) is TWO-SIDED, because an AI surface has two
 * halves and either one can exist without the other:
 *   - the EDGE side — every supabase/functions/<fn> whose code calls the model;
 *   - the CLIENT side — every edge slug the browser actually invokes.
 * Both are DISCOVERED from source by the SHARED census module, ./aiSurfaceCensus.js —
 * imported here and by E-D part 2 (tests/domain/aiFallbackTotality.test.js) so the two
 * walls can never again answer to different denominators. Neither side is a hand-list that
 * can silently drift. A NEW model-calling edge surface, or a NEW client transport, that
 * appears without a disposition in AI_SURFACE_WALLS reds THIS test loudly (census
 * completeness), rather than shipping an un-walled surface a green suite would hide.
 *
 * WHY THE CLIENT SIDE IS NOT REDUNDANT: an edge-directory walk cannot see a transport whose
 * edge half is not in the tree. `src/lib/tableClerk.js` invokes 'table-clerk', a live AI
 * transport whose edge function has never existed here — so before the client pass, the
 * census asserted NOTHING about it and no disposition was ever required. A surface deployed
 * out-of-band must fail the census, not hide from it.
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
 * An entry may also carry `edge: 'absent'` — the client transport is live but no edge
 * directory exists here (the server half is an owner-gated fold). The marker is checked
 * both ways: an un-declared dir-less AI surface reds, and so does an 'absent' marker on a
 * surface whose directory has since landed (the fold must re-enter the edge census).
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// THE CENSUS ITSELF LIVES IN ONE PLACE — tests/security/aiSurfaceCensus.js — and is
// imported by BOTH halves of E-D (this scan and tests/domain/aiFallbackTotality.test.js).
// It used to be a verbatim copy in each file, and the copies drifted: this file grew the
// client pass and found 'table-clerk' while part 2 kept walking only supabase/functions/*.
// One census, imported twice, is the structural cure for that class.
import {
  ROOT, MODEL_CALL, EDGE_DIRS, AI_SURFACES,
  DIRECT_INVOKE, INDIRECT_INVOKE, KEBAB_LITERAL, WORD_LITERAL,
  CLIENT_TRANSPORTS, NON_AI_CLIENT_TRANSPORTS, invokersOf, CENSUS_FLOORS,
} from './aiSurfaceCensus.js';

const readSrc = (rel) => (existsSync(join(ROOT, rel)) ? readFileSync(join(ROOT, rel), 'utf8') : '');

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
  // The Session Ledger's bucketing clerk. The edge returns RAW proposals; the pure client
  // schema wall (domain/tableLedger.reviewClerkProposals) re-validates every bucket against
  // the closed vocabulary, so an off-vocabulary bucket lands in `rejected`, never `accepted`
  // — the wall holds even against a compromised edge. Discovered by the CLIENT pass only:
  // no supabase/functions/table-clerk exists in this tree (owner-gated fold), which is
  // exactly the blind spot the client census closes.
  'table-clerk':         { disposition: 'walled', seam: 'src/lib/tableClerk.js', walls: ['reviewClerkProposals'], edge: 'absent' },
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

// NON_AI_CLIENT_TRANSPORTS — the explicit allowlist of client-invoked edges that carry no
// model output, each with its reason — now lives in the shared census module (both halves
// of E-D classify against it). Its honesty is enforced here: no stale row, and no
// model-calling surface smuggled through it.

describe('AI-surface source scan — census completeness (the wall against an N-1 sweep)', () => {
  it('the discovered roster is non-empty (guard-the-guard: not a vacuous pass)', () => {
    // If this collapses, the MODEL_CALL detector broke and every per-surface check below
    // would vacuously pass. Today the roster is the ~12 model-calling edge surfaces.
    expect(AI_SURFACES.length).toBeGreaterThanOrEqual(CENSUS_FLOORS.edgeSurfaces);
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
    // A manifest entry is REAL if it was discovered on either side — a model-calling edge
    // directory, or a client transport that invokes it. An entry backed by neither is
    // fiction, and fiction in a census is how a retired surface leaves ghost headroom.
    const stale = Object.keys(AI_SURFACE_WALLS)
      .filter((s) => !AI_SURFACES.includes(s) && !CLIENT_TRANSPORTS.has(s));
    expect(
      stale,
      `AI_SURFACE_WALLS names surfaces discovered on NEITHER side — no model-calling edge `
      + `directory AND no client invocation. Delete the dead entry: ${stale.join(', ')}`,
    ).toEqual([]);
  });
});

describe('AI-surface source scan — the CLIENT transport census (an edge directory is not required)', () => {
  it('client discovery is non-vacuous, and keeps the three hard cases (guard-the-guard)', () => {
    // If discovery collapses, every check below passes vacuously. These three are the
    // shapes that broke earlier drafts of the scanner — keep them pinned by name.
    expect(CLIENT_TRANSPORTS.size).toBeGreaterThanOrEqual(CENSUS_FLOORS.clientTransports);
    for (const [slug, why] of [
      ['table-clerk', 'pass A; an AI transport with NO edge directory at all — the whole reason this pass exists'],
      ['construct-realm', 'pass B; assigned by a ternary and posted through a helper, never a literal at the call'],
      ['interview', 'pass A; a single-word slug, which a kebab-only pattern silently drops'],
    ]) {
      expect(CLIENT_TRANSPORTS.has(slug), `client discovery lost '${slug}' (${why})`).toBe(true);
    }
  });

  it('every client-invoked edge is dispositioned (an AI wall, or a named non-AI transport)', () => {
    const undeclared = [...CLIENT_TRANSPORTS.keys()]
      .filter((s) => !(s in AI_SURFACE_WALLS) && !(s in NON_AI_CLIENT_TRANSPORTS))
      .sort();
    expect(
      undeclared,
      `these edge functions are invoked from client code with NO disposition. The browser `
      + `talks to them, so the finite-semantics law applies whether or not the edge half is `
      + `in this tree. Either give the surface an AI_SURFACE_WALLS entry (shadow/walled/`
      + `display/none/byok — plus edge:'absent' if no directory exists yet), or record it in `
      + `NON_AI_CLIENT_TRANSPORTS with the reason it carries no model output: `
      + undeclared.map((s) => `${s} (invoked by ${invokersOf(s)})`).join('; '),
    ).toEqual([]);
  });

  it('the non-AI allowlist stays honest (no stale row, and no AI surface hiding in it)', () => {
    const stale = Object.keys(NON_AI_CLIENT_TRANSPORTS).filter((s) => !CLIENT_TRANSPORTS.has(s));
    expect(
      stale,
      `NON_AI_CLIENT_TRANSPORTS names transports no client invokes any more — delete the row `
      + `rather than leaving standing permission for a slug nothing uses: ${stale.join(', ')}`,
    ).toEqual([]);

    const smuggled = Object.keys(NON_AI_CLIENT_TRANSPORTS)
      .filter((s) => AI_SURFACES.includes(s) || s in AI_SURFACE_WALLS);
    expect(
      smuggled,
      `these are declared non-AI but DO call the model (or already carry an AI disposition) — `
      + `a model-calling surface may never be waved through the non-AI allowlist: ${smuggled.join(', ')}`,
    ).toEqual([]);
  });

  it("an AI surface with no edge directory is declared out-of-band (edge: 'absent')", () => {
    const undeclaredOutOfBand = Object.entries(AI_SURFACE_WALLS)
      .filter(([name, m]) => !EDGE_DIRS.has(name) && m.edge !== 'absent')
      .map(([name]) => name);
    expect(
      undeclaredOutOfBand,
      `these AI surfaces have a client transport but NO supabase/functions/<name> directory. `
      + `That is a surface deployed out-of-band: mark it edge:'absent' so the gap is recorded, `
      + `or land the edge half: ${undeclaredOutOfBand.join(', ')}`,
    ).toEqual([]);

    // The marker cannot rot: once the edge lands, the surface must re-enter the EDGE census
    // (where MODEL_CALL scans its real server code) instead of coasting on a stale claim.
    const rotted = Object.entries(AI_SURFACE_WALLS)
      .filter(([name, m]) => m.edge === 'absent' && EDGE_DIRS.has(name))
      .map(([name]) => name);
    expect(
      rotted,
      `these carry edge:'absent' but their edge directory now EXISTS — drop the marker so the `
      + `edge-side census scans the newly-landed server half: ${rotted.join(', ')}`,
    ).toEqual([]);
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

  it("a 'none' surface has no client invocation seam (nothing to breach)", () => {
    // parley is a live server-side surface with no client apply path in the tree. If one is
    // ever wired, this reds — forcing the maintainer to declare its disposition + wall. The
    // check now rides the shared client census, so a slug reaching invoke() through a helper
    // or a const is caught too, not only a literal at the call site.
    const wired = Object.entries(AI_SURFACE_WALLS)
      .filter(([name, m]) => m.disposition === 'none' && CLIENT_TRANSPORTS.has(name))
      .map(([name]) => `${name} (invoked by ${invokersOf(name)})`);
    expect(
      wired,
      `a client seam now invokes an edge declared 'none' — declare its finite-semantics `
      + `disposition in AI_SURFACE_WALLS (walled/display) and wall its output before it can `
      + `ship: ${wired.join('; ')}`,
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

  it('the direct-invoke detector reads a literal slug and a functions/v1 URL', () => {
    const slugs = (s) => [...s.matchAll(DIRECT_INVOKE)].map((m) => m[1]);
    expect(slugs("await supabase.functions.invoke('table-clerk', { body })")).toEqual(['table-clerk']);
    expect(slugs('fetch(`${base}/functions/v1/generate-narrative`, init)')).toEqual(['generate-narrative']);
    expect(slugs("await supabase.functions.invoke('interview', { body })")).toEqual(['interview']);
    expect(slugs("await supabase.from('gallery').select('*')")).toEqual([]);
  });

  it('the indirect-router detector separates a variable slug from a literal one', () => {
    // Pass B only harvests inside files that route a slug through a variable — this is the
    // predicate that keeps the harvest from running over the whole of src/.
    expect(INDIRECT_INVOKE.test('supabase.functions.invoke(slug, { body })')).toBe(true);
    expect(INDIRECT_INVOKE.test('supabase.functions.invoke(FN_NAME, { body })')).toBe(true);
    expect(INDIRECT_INVOKE.test("supabase.functions.invoke('admin-actions', { body })")).toBe(false);
  });

  it('the kebab harvest reads a ternary-assigned slug and skips a bare word', () => {
    const harvest = (s) => [...s.matchAll(KEBAB_LITERAL)].map((m) => m[1]);
    expect(harvest("const slug = scope === 'realm' ? 'construct-realm' : 'construct-settlement';"))
      .toEqual(['construct-realm', 'construct-settlement']);
    // The documented Pass B gap: a single word is NOT harvested unless it names an edge dir.
    expect(harvest("const FN = 'parley';")).toEqual([]);
    expect([..."const FN = 'parley';".matchAll(WORD_LITERAL)].map((m) => m[1])).toEqual(['parley']);
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

// (`clientFilesInvoking` was retired here: the 'none'-disposition tripwire now rides the
//  shared CLIENT_TRANSPORTS census, which also catches helper- and const-routed slugs.)
