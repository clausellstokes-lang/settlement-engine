/**
 * criminalSwitchSalt.test.js — R4I-PAGE-2 S1, THE SWITCH'S ONE SALT (VEIL-38; the chair's E136 (b), ruled; vetoable by
 * the owner; brief docs/chair/2026-11-20/veil/briefs/R4I-PAGE-2-BRIEF.md).
 *
 * THE FAULT: criminalVeilSwitch.js :: presentCriminalGroupings compares two applyVeil copies byte for byte; since the
 * re-key (R4-IDS, galleryVeilPeople.js) each applyVeil call draws its own salt, so every grouping "differed" and the
 * curate switch (CurateMode.jsx, the OWNER's screen) offered every default. THE CURE AS RULED: applyVeil takes an
 * optional `{ salt }`; presentCriminalGroupings draws ONE readSalt() and passes it to every applyVeil call it makes; no
 * other caller passes a salt, and the server takes none from a caller.
 *
 *   1. THE WALKER: among src/, applyVeil's third argument is passed from criminalVeilSwitch.js alone (every call site,
 *      its top-level arguments counted); a plant (a three-argument call in another file) shows it can fail.
 *   2. THE SERVER: 212's text. The entry _gallery_veil and the three reads (get_gallery_dossier, get_unlisted_dossier,
 *      import_gallery_dossier) have no parameter named like a salt; _gallery_veil draws its salt inside
 *      (gen_random_uuid()); every function of 212 that DOES take a salt is one of 212's six named salt carriers, each
 *      revoked from public, anon and authenticated (no caller reaches one).
 *   3. THE ARM ("the switch offers exactly what it offered before the re-key"): the REFERENCE is this tree with
 *      rekeyPeople mocked to the identity (`REF.on`); presentCriminalGroupings, criminalSwitchStateOf, setCriminalVeil
 *      (hidden and shown) and flipCriminalVeil must be EQUAL, set for set (criminalSwitchSalt.shared.mjs :: switchOffer),
 *      Reveal DM off and on, on: CurateMode's two hand towns (tests/components/curateModeCriminalSwitch.test.jsx), the
 *      six born towns of criminalSwitchHandReach.pglite.test.js, and four of the tell gate's births (tell-common.mjs ::
 *      pool's seeds and dials; the whole 92 + 48 run through out/v38/r4ip2/switch-offer.probe.jsx).
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { switchOffer, offerDiff } from './criminalSwitchSalt.shared.mjs';

const REF = vi.hoisted(() => ({ on: false }));
vi.mock('../../src/domain/display/galleryVeilPeople.js', async (importOriginal) => {
  const real = await importOriginal();
  return { ...real, rekeyPeople: (s, salt) => (REF.on ? s : real.rekeyPeople(s, salt)) };
});

const ROOT = resolve(process.cwd());
const BIRTH_TIMEOUT_MS = 900_000; // deadlock guard, not a perf budget

/** A source with every comment and string literal blanked (newlines kept), so a call is matched in code only. */
function codeOnly(src) {
  let out = ''; let q = null; let line = false; let block = false;
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i]; const n = src[i + 1];
    if (line) { if (c === '\n') { line = false; out += c; } else out += ' '; continue; }
    if (block) { if (c === '*' && n === '/') { block = false; out += '  '; i += 1; } else out += c === '\n' ? c : ' '; continue; }
    if (q) { if (c === '\\') { out += '  '; i += 1; } else if (c === q) { q = null; out += c; } else out += c === '\n' ? c : ' '; continue; }
    if (c === '/' && n === '/') { line = true; out += '  '; i += 1; continue; }
    if (c === '/' && n === '*') { block = true; out += '  '; i += 1; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; out += c; continue; }
    out += c;
  }
  return out;
}

/** Every applyVeil call site of a source: [line, number of top-level arguments]. Strings and comments are skipped. */
export function applyVeilCalls(source) {
  const src = codeOnly(source);
  const out = [];
  const re = /\bapplyVeil\s*\(/g;
  let m;
  while ((m = re.exec(src))) {
    if (/function\s*$/.test(src.slice(Math.max(0, m.index - 9), m.index))) continue; // the definition
    let depth = 0; let args = 0; let any = false;
    for (let i = m.index + m[0].length - 1; i < src.length; i += 1) {
      const c = src[i];
      if (c === '(' || c === '[' || c === '{') { depth += 1; if (depth > 1) any = true; continue; }
      if (c === ')' || c === ']' || c === '}') { depth -= 1; if (depth === 0) break; continue; }
      if (depth === 1 && c === ',') { args += 1; continue; }
      if (depth === 1 && !/\s/.test(c)) any = true;
    }
    out.push([src.slice(0, m.index).split('\n').length, any ? args + 1 : 0]);
  }
  return out;
}

/** The sites passing a third argument, over [path, source] pairs: `path:line (n args)`. */
export function saltedSites(files) {
  return files.flatMap(([p, src]) => applyVeilCalls(src).filter(([, n]) => n >= 3).map(([l, n]) => `${p}:${l} (${n} args)`));
}

function srcFiles(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) srcFiles(p, out);
    else if (/\.(js|jsx|mjs|ts|tsx)$/.test(e)) out.push([relative(ROOT, p).split('\\').join('/'), readFileSync(p, 'utf8')]);
  }
  return out;
}

const SWITCH = 'src/domain/display/criminalVeilSwitch.js';

describe('S1 THE WALKER: applyVeil takes a salt from the curate switch alone', () => {
  const files = srcFiles(join(ROOT, 'src'));
  it('every salted applyVeil call site in src/ is in criminalVeilSwitch.js, and the switch makes every one of its calls salted', () => {
    const sites = saltedSites(files);
    expect(sites.filter((s) => !s.startsWith(`${SWITCH}:`)), 'a salted applyVeil call outside the switch').toEqual([]);
    const own = applyVeilCalls(files.find(([p]) => p === SWITCH)[1]);
    expect(own.length, 'the switch calls applyVeil').toBeGreaterThan(0);
    expect(own.filter(([, n]) => n < 3), 'an unsalted applyVeil call in the switch').toEqual([]);
    // anti-vacuity: the walker sees the two-argument callers (projectShareVeil, projectServedVeil)
    const twoArg = files.flatMap(([p, src]) => applyVeilCalls(src).filter(([, n]) => n === 2).map(([l]) => `${p}:${l}`));
    expect(twoArg.filter((s) => s.startsWith('src/domain/display/galleryVeil.js:')).length).toBeGreaterThanOrEqual(2);
  });
  it('THE PLANT: a salted call in another file reds the walker by name; a comment and a string do not', () => {
    const planted = [...files, ['src/components/gallery/Planted.jsx', "const x = applyVeil(pub, [], { salt: 's' });\n// applyVeil(a, b, c)\nconst y = 'applyVeil(a, b, c)';"]];
    const outside = saltedSites(planted).filter((s) => !s.startsWith(`${SWITCH}:`));
    expect(outside).toEqual(['src/components/gallery/Planted.jsx:1 (3 args)']);
  });
});

describe('S1 THE SERVER: 212 takes no salt from a caller', () => {
  const name = readdirSync(join(ROOT, 'supabase/migrations')).find((f) => /^212_.*\.sql$/.test(f) && !/rollback/i.test(f));
  const sql = readFileSync(join(ROOT, 'supabase/migrations', name), 'utf8');
  /** Every function definition of 212: { name, params, body }. */
  const defs = [...sql.matchAll(/create or replace function public\.(\w+)\s*\(([\s\S]*?)\)\s*returns[\s\S]*?\$(\w*)\$([\s\S]*?)\$\3\$/gi)]
    .map((m) => ({ name: m[1], params: m[2], body: m[4] }));
  const SALTY = /salt|nonce|seed|pepper|\bkey\b/i;
  const CARRIERS = ['_gallery_veil_rekey_id', '_gallery_veil_rekey_ref', '_gallery_veil_rekey_at', '_gallery_veil_rekey_each', '_gallery_veil_rekey', '_gallery_veil_rekey_served'];
  it('the entry and the three reads have no salt parameter; the entry draws one inside', () => {
    for (const fn of ['_gallery_veil', 'get_gallery_dossier', 'get_unlisted_dossier', 'import_gallery_dossier']) {
      const mine = defs.filter((d) => d.name === fn);
      expect(mine.length, `${fn} is defined in ${name}`).toBeGreaterThan(0);
      for (const d of mine) expect(d.params, `${fn}(${d.params})`).not.toMatch(SALTY);
    }
    for (const d of defs.filter((x) => x.name === '_gallery_veil')) expect(d.body).toMatch(/\bsalt\s+text\s*:=\s*gen_random_uuid\(\)::text/);
  });
  it('every function that takes a salt is one of the six named carriers, and no caller can execute one', () => {
    const takers = [...new Set(defs.filter((d) => /\bsalt\b/i.test(d.params)).map((d) => d.name))].sort();
    expect(takers).toEqual([...CARRIERS].sort());
    for (const fn of CARRIERS) expect(sql, `${fn} revoked`).toMatch(new RegExp(`revoke execute on function public\\.${fn}\\([^)]*\\) from public, anon, authenticated`));
    for (const fn of CARRIERS) expect(sql, `${fn} granted`).not.toMatch(new RegExp(`grant execute on function public\\.${fn}\\(`));
  });
});

/** CurateMode's two hand towns (tests/components/curateModeCriminalSwitch.test.jsx, byte for byte). */
const HAND = {
  Redwick: {
    name: 'Redwick', tier: 'town', population: 1800, config: {},
    institutions: [
      { id: 'inst-den', name: "Thieves' den", category: 'Criminal', desc: 'A den under the docks.' },
      { id: 'inst-mill', name: 'Mill', category: 'Economy', desc: 'Grain.' },
    ],
    availableServices: { criminal: [{ name: 'Fencing', institution: "Thieves' den" }], economy: [{ name: 'Milling', institution: 'Mill' }] },
    npcs: [{ id: 'n1', name: 'Ada', role: 'Miller' }],
  },
  Quietford: {
    name: 'Quietford', tier: 'hamlet', population: 90, config: {},
    institutions: [{ id: 'inst-mill', name: 'Mill', category: 'Economy', desc: 'Grain.' }],
    npcs: [{ id: 'n1', name: 'Ada', role: 'Miller' }],
  },
};
/** criminalSwitchHandReach.pglite.test.js :: TOWNS and its birth (BROWSER dials, publicProse composed). */
const HAND_REACH = [['v102-thorp-0', 'thorp'], ['v102-hamlet-6', 'hamlet'], ['v102-village-3', 'village'], ['v102-town-1', 'town'], ['v102-city-0', 'city'], ['v102-metropolis-1', 'metropolis']];
/** Four of the tell gate's 140 births (tell-common.mjs :: pool(2, [0, 1]), seeds and dials byte for byte). */
const TELL_SEEDS = ['r3m-village-none-0-1', 'r3m-town-infiltrated-0-12', 'r3m-city-insurgency-0-34', 'r3m-metropolis-under_siege-0-58'];

describe('S1 THE ARM: the switch offers exactly what it offered before the re-key (the reference: rekeyPeople the identity)', () => {
  /** @type {Array<[string, unknown]>} */
  const towns = Object.entries(HAND);
  let veil; let sw;
  beforeAll(async () => {
    veil = await import('../../src/domain/display/galleryVeil.js');
    sw = await import('../../src/domain/display/criminalVeilSwitch.js');
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const density = await import('../../src/domain/density/densityCreateBoundary.js');
    const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');
    const { composePublicProse } = await import('../../src/components/new/publicProseCompose.js');
    const { loadEngine } = await import('../../docs/chair/2026-11-20/veil/out/v27/tell/measure/tell-common.mjs');
    await density.loadGenerationLawPayloads();
    const BROWSER = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
    for (const [seed, settType] of HAND_REACH) {
      const raw = generateSettlementPipeline(density.birthConfig({ ...DEFAULT_CONFIG, ...BROWSER, settType }), null, { seed, customContent: {} });
      towns.push([seed, JSON.parse(JSON.stringify({ ...raw, publicProse: composePublicProse(raw) }))]);
    }
    const E = await loadEngine(ROOT);
    const pool = E.pool(2, [0, 1]).filter((b) => TELL_SEEDS.includes(b.seed));
    expect(pool.map((b) => b.seed).sort(), 'the tell seeds are the pool\'s').toEqual([...TELL_SEEDS].sort());
    for (const b of pool) towns.push([b.seed, E.birth(b.cfg, b.seed, null)]);
  }, BIRTH_TIMEOUT_MS);

  it('cured = reference, set for set, Reveal DM off and on, on every town', () => {
    const faults = [];
    let compared = 0;
    let presentSeen = 0;
    for (const [name, rec] of towns) {
      for (const dm of [false, true]) {
        REF.on = true;
        let ref;
        try { ref = switchOffer(veil, sw, rec, dm); } finally { REF.on = false; }
        const cured = switchOffer(veil, sw, rec, dm);
        const d = offerDiff(cured, ref);
        compared += 1;
        presentSeen += ref.present.length;
        if (d.length) faults.push(`${name} dm=${dm}: ${d.length} differ: ${d.slice(0, 3).join(' | ')}`);
      }
    }
    expect(compared, 'every town read twice').toBe(towns.length * 2);
    expect(presentSeen, 'anti-vacuity: the reference finds groupings present').toBeGreaterThan(0);
    expect(faults, `${faults.length} of ${compared} reads differ`).toEqual([]);
  });

  it('anti-vacuity: the reference reads "none" on the town with no criminal part, and the cured tree agrees', () => {
    REF.on = true;
    let ref;
    try { ref = switchOffer(veil, sw, HAND.Quietford, false); } finally { REF.on = false; }
    expect(ref.present).toEqual([]);
    expect(ref.none.state).toBe('none');
    expect(switchOffer(veil, sw, HAND.Quietford, false).none.state).toBe('none');
  });
});
