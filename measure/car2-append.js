
// ── ARCH car 2 — THE COMPOSED-PROSE CORPUS IS LAZY, AND ITS CHUNK HAS A ROW ───
// (ARCH-COMPOSED-PROSE §10, §12 row 2; lane MEASURE car 2.)
//
// WHAT RIDES ON THIS. The composed-prose model grows the dossier's authored corpus
// from 641,410 raw bytes over six state leaves toward a declared ceiling of about
// 2.8 MB (§10's arithmetic on measured unit costs). That is more than twice the
// ENTIRE first-paint closure this file's constitutional budget governs. The corpus
// is affordable only because it is LAZY: the leaves are imported by the six state
// desks, the desks by the lazy dossier tab components, so the whole corpus rides
// the data-lazy chunk and is fetched with the first lazy tab. If one eager static
// edge ever reaches a leaf, vite's DERIVED isEagerData classifier re-files it into
// the first-paint 'data' chunk and the closure budget goes from 5,878 B of margin to
// hundreds of kilobytes over — the FP-G16 cultureProfiles mechanism exactly, at four
// times the size. Car 2 pins that shut here, where the estate already measures it,
// rather than minting a second first-paint ruler (§11 refuses one in terms).
//
// TWO HALVES, AND THE SPLIT IS THE STALE-DIST POLICY AT THE TOP OF THIS FILE.
//   • The ABSENCE half runs UNGATED and needs no build: it reads the eager module
//     graph from vite.config.js's OWN derivation (EAGER_FIRST_PAINT_MODULES) and
//     asserts no prose leaf and no prose desk is in it. This is the half that
//     actually stops the regression, and it stops it at source-edit time.
//   • The MEMBERSHIP and SIZE half is VERIFY_DIST-gated, because it reads emitted
//     chunks and a stale dist would measure the previous build.
//
// THE FINGERPRINTS ARE DERIVED, NEVER HAND-PICKED. A pinned sentence would rot the
// first time car 8's rewrite wave touches the leaf that carries it, and a membership
// guard whose marker matches nothing passes forever. Each leaf's fingerprint is
// instead re-derived from its own source on every run: the longest quote-free,
// backslash-free `"text"` value it holds, which minification preserves verbatim as a
// string literal. Car 8 may rewrite every sentence in the estate and this arm still
// knows where the leaf landed.
const PROSE_STATE_LEAF_DIR = 'src/data/dossierStateProse';
const PROSE_CAUSAL_LEAF = 'src/data/dossierCausalProse.generated.js';

// The data-lazy chunk's ceiling is ARCH §10's corpus ceiling, carried onto the chunk
// that ships it: measured 939,520 raw at car 2's build, plus the corpus's whole
// declared growth allowance (2,800,000 - 641,410 = 2,158,590). The gzip ceiling is
// built the same way (622,222 - 121,630 = 500,592 over the measured 271,305). NO
// extra platform margin is taken and that is deliberate: the allowance is ~2.16 MB,
// three orders of magnitude past the few hundred bytes of cross-environment Rollup
// drift this file's own wave-5b note measures, so a margin here would only spend
// headroom no measurement asks for. Unlike the first-paint budgets above, these are
// NOT constitutional and NOT owner-signed — they are the model's own arithmetic, and
// scripts/.prose-byte-baseline.json is where a leaf's growth is declared row by row.
const DATA_LAZY_RAW_CEILING_BYTES = 3_098_110;
const DATA_LAZY_GZIP_CEILING_BYTES = 771_897;
// A collapse is as much a regression as a breach: if the corpus leaves this chunk it
// has gone somewhere, and the somewhere is what the membership arms then name.
const DATA_LAZY_FLOOR_BYTES = 500_000;

/** Every prose leaf on disk, repo-relative. DERIVED from the directory, so a leaf car 4
 *  projects is claimed the day it lands rather than the day someone remembers. */
function proseLeafFiles() {
  const dir = resolve(process.cwd(), PROSE_STATE_LEAF_DIR);
  const state = readdirSync(dir)
    .filter((f) => f.endsWith('.generated.js'))
    .map((f) => `${PROSE_STATE_LEAF_DIR}/${f}`)
    .sort();
  return [...state, PROSE_CAUSAL_LEAF];
}

/** The longest quote-free, backslash-free authored sentence in a leaf. Quote-free so the
 *  emitted chunk's own escaping cannot make the search miss; longest so the match cannot
 *  be an accident of common phrasing. Returns null when the leaf holds no such sentence,
 *  which the anti-vacuity arm below turns into a loud failure rather than a silent pass. */
function proseLeafFingerprint(rel) {
  const src = readFileSync(resolve(process.cwd(), rel), 'utf-8');
  const safe = /^[A-Za-z0-9 ,.:;()-]+$/;
  const texts = [...src.matchAll(/^\s*"text": "([^"\\]+)",?$/gm)]
    .map((m) => m[1])
    .filter((t) => safe.test(t));
  texts.sort((a, b) => (b.length - a.length) || (a < b ? -1 : 1));
  return texts.length ? texts[0] : null;
}

describe('ARCH car 2 — the prose corpus is ABSENT from the first-paint module graph', () => {
  const srcFiles = goodsSrcFiles();
  const sources = new Map(srcFiles.map((rel) => [rel, readFileSync(resolve(process.cwd(), rel), 'utf-8')]));
  const eagerRel = new Set([...EAGER_FIRST_PAINT_MODULES].map((abs) => relative(process.cwd(), abs)));
  const isEager = (rel) => eagerRel.has(rel);
  const leaves = proseLeafFiles();
  // The six state desks are the leaves' only product importers; the causal reader is
  // the seventh. Guarding the DESKS as well as the leaves catches the edge one hop
  // earlier, where the failure is still legible as "an eager module imports a desk".
  const PROSE_DESKS = [
    'src/domain/display/stateProse/defenseStateProse.js',
    'src/domain/display/stateProse/economyStateProse.js',
    'src/domain/display/stateProse/generalStateProse.js',
    'src/domain/display/stateProse/powerStateProse.js',
    'src/domain/display/stateProse/stressorsStateProse.js',
    'src/domain/display/stateProse/warFaithStateProse.js',
    'src/domain/display/stateProse/causalDossierProse.js',
  ];

  it('anti-vacuity: the eager graph is live and the leaf roster is non-empty', () => {
    expect(eagerRel.size).toBeGreaterThan(50);
    expect(eagerRel.has('src/main.jsx'), 'the entry must be in the eager graph').toBe(true);
    expect(leaves.length, 'the prose leaf walk found nothing').toBeGreaterThanOrEqual(7);
    for (const rel of leaves) {
      expect(existsSync(resolve(process.cwd(), rel)), `${rel} is rostered but absent`).toBe(true);
    }
    for (const desk of PROSE_DESKS) {
      expect(sources.has(desk), `${desk} is named here but no longer exists`).toBe(true);
    }
  });

  it('no prose LEAF is in the first-paint module graph', () => {
    const eagerLeaves = leaves.filter(isEager);
    expect(
      eagerLeaves,
      `prose leaf/leaves ${eagerLeaves.join(', ')} entered the eager graph. vite's isEagerData is`
      + ' DERIVED from that graph, so the whole corpus re-files into the first-paint data chunk'
      + ' against 5,878 B of closure margin (the FP-G16 cultureProfiles mechanism, four times the'
      + ' size). Find the eager importer and route it through a lazy surface.',
    ).toEqual([]);
  });

  it('no prose DESK is in the first-paint module graph', () => {
    const eagerDesks = PROSE_DESKS.filter(isEager);
    expect(
      eagerDesks,
      `prose desk(s) ${eagerDesks.join(', ')} entered the eager graph — they import the leaves`
      + ' statically, so this is the leaf breach one hop before it is visible as one.',
    ).toEqual([]);
  });

  it('NO module in the first-paint graph imports a prose leaf', () => {
    const offenders = leaves.flatMap((leaf) =>
      eagerImportersOf(leaf, sources, isEager).map((rel) => `${rel} -> ${leaf}`));
    expect(offenders, `first-paint module(s) statically import the corpus:\n  ${offenders.join('\n  ')}`).toEqual([]);
  });

  it('MUTANT: a fabricated eager importer of a prose leaf is caught', () => {
    // A control that cannot fail proves nothing. Drive the SAME pure reader the three
    // arms above use with a synthetic tree in which an eager module reaches a leaf.
    const target = `${PROSE_STATE_LEAF_DIR}/general.generated.js`;
    const fabricated = new Map([
      [target, 'export const DOSSIER_STATE_PROSE_GENERAL = {};\n'],
      ['src/fake/eagerProseOffender.js', "import { DOSSIER_STATE_PROSE_GENERAL } from '../data/dossierStateProse/general.generated.js';\n"],
      ['src/fake/lazyProseConsumer.js', "import { DOSSIER_STATE_PROSE_GENERAL } from '../data/dossierStateProse/general.generated.js';\n"],
    ]);
    const fabricatedEager = (rel) => rel === 'src/fake/eagerProseOffender.js';
    const caught = eagerImportersOf(target, fabricated, fabricatedEager);
    expect(caught, 'the reader failed to catch a planted eager importer of a prose leaf').toEqual(['src/fake/eagerProseOffender.js']);
  });

  it('MUTANT: a DYNAMIC import of a prose leaf is not counted (the lazy boundary)', () => {
    // The mirror control: the reader must not fire on the edge that is legitimately
    // lazy, or every dynamic-import consumer becomes a false red.
    const target = `${PROSE_STATE_LEAF_DIR}/general.generated.js`;
    const fabricated = new Map([
      ['src/fake/lazyProseConsumer.js', "const m = await import('../data/dossierStateProse/general.generated.js');\n"],
    ]);
    expect(eagerImportersOf(target, fabricated, () => true), 'a dynamic import was counted as a static eager edge').toEqual([]);
  });
});

describe.runIf(distExists)('ARCH car 2 — the corpus rides data-lazy, and that chunk has a row', () => {
  it('anti-vacuity: every leaf yields a fingerprint, and they are unique to their leaf', () => {
    // If the derivation stops finding sentences (a schema change, a new escaping) the
    // membership arms below would search for null and pass on nothing. Say so here.
    const leaves = proseLeafFiles();
    const sources = new Map(leaves.map((rel) => [rel, readFileSync(resolve(process.cwd(), rel), 'utf-8')]));
    for (const rel of leaves) {
      const fp = proseLeafFingerprint(rel);
      expect(
        fp,
        `${rel} yielded no quote-free authored sentence, so its membership arm would prove nothing.`
        + ' Widen the safe-character class in proseLeafFingerprint rather than dropping the leaf.',
      ).toBeTruthy();
      expect(fp.length, `${rel}'s fingerprint is too short to be distinctive`).toBeGreaterThan(40);
      const carriers = leaves.filter((other) => sources.get(other).includes(fp));
      expect(carriers, `${rel}'s fingerprint is not unique to it among the leaf sources`).toEqual([rel]);
    }
  });

  it('every prose leaf lands in a data-lazy chunk and in NO first-paint chunk', () => {
    const { files: closure } = entryStaticClosure();
    const closureSet = new Set(closure);
    const chunks = readdirSync(assetsDir).filter((f) => f.endsWith('.js'));
    const text = new Map(chunks.map((f) => [f, readFileSync(join(assetsDir, f), 'utf-8')]));
    const eagerDataChunks = chunks.filter((f) => /^data-(?!lazy-)[A-Za-z0-9_-]+\.js$/.test(f));
    const entryChunks = chunks.filter((f) => /^index-[A-Za-z0-9_-]+\.js$/.test(f));
    const findings = [];
    for (const rel of proseLeafFiles()) {
      const fp = proseLeafFingerprint(rel);
      const carriers = chunks.filter((f) => text.get(f).includes(fp));
      if (rel === PROSE_CAUSAL_LEAF) {
        // The causal register is DARK: src/domain/display/stateProse/causalDossierProse.js
        // has no product importer at this tip, so the leaf reaches no chunk at all (a
        // measured correction to §10, which states it rides data-lazy). §12 car 13 is
        // owner-gated, "wire or retire", so BOTH states are lawful and this arm names the
        // one thing that never is: reaching first paint. Wiring it will move this row.
        const unlawful = carriers.filter((f) => !/^data-lazy-/.test(f));
        if (unlawful.length) findings.push(`${rel}: carried by ${unlawful.join(', ')} — a wired causal register must ride data-lazy`);
        continue;
      }
      if (!carriers.length) {
        findings.push(`${rel}: reached NO emitted chunk. Either its desk lost its last importer (the corpus is dead code) or the fingerprint no longer survives minification.`);
        continue;
      }
      const strays = carriers.filter((f) => !/^data-lazy-/.test(f));
      if (strays.length) findings.push(`${rel}: carried by non-data-lazy chunk(s) ${strays.join(', ')}`);
      const inClosure = carriers.filter((f) => closureSet.has(f));
      if (inClosure.length) findings.push(`${rel}: reached FIRST PAINT via ${inClosure.join(', ')}`);
      const inEagerData = carriers.filter((f) => eagerDataChunks.includes(f));
      if (inEagerData.length) findings.push(`${rel}: landed in the EAGER data chunk ${inEagerData.join(', ')}`);
      const inEntry = carriers.filter((f) => entryChunks.includes(f));
      if (inEntry.length) findings.push(`${rel}: landed in the ENTRY chunk ${inEntry.join(', ')}`);
    }
    expect(
      findings,
      `the composed-prose corpus left the lazy chunk. Closure (${closure.length} files):\n  ${closure.join('\n  ')}\n`
      + `Findings:\n  ${findings.join('\n  ')}`,
    ).toEqual([]);
  });

  it.skipIf(!requireDistRead)(`the data-lazy chunk stays under its raw ceiling (${DATA_LAZY_RAW_CEILING_BYTES})`, () => {
    const chunks = readdirSync(assetsDir).filter((f) => /^data-lazy-[A-Za-z0-9_-]+\.js$/.test(f));
    expect(chunks.length, 'no data-lazy chunk was emitted — the corpus went somewhere else').toBeGreaterThan(0);
    let total = 0;
    const lines = [];
    for (const f of chunks.sort()) {
      const size = statSync(join(assetsDir, f)).size;
      total += size;
      lines.push(`  ${String(size).padStart(9)}  ${f}`);
    }
    expect(total, `data-lazy raw = ${total} B, under the floor:\n${lines.join('\n')}`).toBeGreaterThan(DATA_LAZY_FLOOR_BYTES);
    expect(
      total,
      `data-lazy raw = ${total} B against the ceiling ${DATA_LAZY_RAW_CEILING_BYTES}:\n${lines.join('\n')}`,
    ).toBeLessThanOrEqual(DATA_LAZY_RAW_CEILING_BYTES);
  });

  it.skipIf(!requireDistRead)(`the data-lazy chunk stays under its gzip ceiling (${DATA_LAZY_GZIP_CEILING_BYTES})`, () => {
    const chunks = readdirSync(assetsDir).filter((f) => /^data-lazy-[A-Za-z0-9_-]+\.js$/.test(f));
    let total = 0;
    const lines = [];
    for (const f of chunks.sort()) {
      const gzip = gzipSync(readFileSync(join(assetsDir, f)), { level: 9 }).length;
      total += gzip;
      lines.push(`  gzip ${String(gzip).padStart(8)}  ${f}`);
    }
    expect(
      total,
      `data-lazy gzip = ${total} B against the ceiling ${DATA_LAZY_GZIP_CEILING_BYTES}:\n${lines.join('\n')}`,
    ).toBeLessThanOrEqual(DATA_LAZY_GZIP_CEILING_BYTES);
  });
});

// ── ARCH car 2 — THE THREE FIRST-PAINT CEILINGS ARE BYTE-UNTOUCHED ───────────
// §12 row 2's acceptance and §13 row 17 both say it: this design raises none of the
// three constitutional budgets. They are pinned to their literals here so a car that
// moves one has to move this pin in the same commit, which makes a raise a deliberate,
// reviewable act rather than a diff nobody reads. Raises stay owner-signed; the long
// ratification histories above each constant are the record of what that costs.
describe('ARCH car 2 — the three first-paint budgets stay where the owner signed them', () => {
  it('the raw, gzip and Brotli closure budgets are unmoved', () => {
    expect(CLOSURE_BUDGET_BYTES, 'the raw first-paint budget moved').toBe(1_048_000);
    expect(CLOSURE_GZIP_BUDGET_BYTES, 'the gzip transfer budget moved').toBe(337_000);
    expect(CLOSURE_BROTLI_BUDGET_BYTES, 'the Brotli transfer budget moved').toBe(283_000);
  });
});
