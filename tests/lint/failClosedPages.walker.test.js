/**
 * failClosedPages.walker.test.js — THE TOTALITY WALKER OF THE FAIL-CLOSED PAGES (VEIL-53, the chair's RULING V6 (c),
 * vetoable by the owner; brief docs/chair/2026-11-24/tenth/veil/briefs/V53-FAILCLOSED-BRIEF.md, commit 2).
 *
 * THE LAW (V6 (b)): every page reader of an ALWAYS-WITHHELD key prints NOTHING where the key is absent; the owner's own
 * read unchanged. tests/components/failClosedSharedPage.test.jsx proves it class by class; this walker holds it TOTAL.
 *
 * THE KEYS, READ AT RUN TIME (never a copied list): `galleryWithholdAlways.js :: withholdAlways`, group by group, each
 * group its `// registry: <id>` rows (each a row of `rosterChoiceRegistry.js :: REGISTRY_ROWS`) and the paths its code
 * withholds (`minusAt` / `eachMinusAt` calls: the parent step and each key; `delete s.<key>`: a top-level key). A group
 * whose code names no path (a helper call, the stability word's rewrite) takes its rows' registry paths.
 *
 * THE READERS, BY PROPERTY PATH (as the hideable walker scans): every code line (comment lines are not code) of every
 * module under src/components/**, src/domain/display/** and src/domain/dailyLife* that reads `<parent>.<key>` (optional
 * chaining and an index between them allowed) or names the path in the walker's array form (`['<parent>'], '<key>'`, as
 * `minusAt` and `failClosedReads.js :: absentAt` write it); a key under a computed parent, and a top-level key, by its
 * word. Each is a SITE `path :: top-level symbol` with its count, REGISTERED below with its FAIL-CLOSED ARM:
 *   arm          the test (`<file> :: <its title, a distinctive part>`) that proves it prints nothing on absence;
 *   guarded      it prints the key only under a guard on the key itself (`guard`, a substring the walker finds in the
 *                site's code): absent, nothing is printed, by construction;
 *   re-derived   the page puts the key back from the served document alone (`pageRederive.js :: rederiveForPage`) before
 *                any reader runs, so the reader reads the page's own copy (the residual absence, a document the engine
 *                cannot read, is listed in the written reason);
 *   owner-draw   a desk run on the OWNER'S record at the save (`publicProseCompose.js`); a shared page prints the shipped
 *                lens and never re-draws (the desk reads' public branch: an absent lens key reads null, SILENT);
 *   own-record   print and PDF: the viewer's own saved record;
 *   veil         the share veil's own engine (it withholds the key);
 *   not-a-read   the words in a table, a path list or a label, or a property path that is not the withheld one.
 * RED on a site with no row, a row whose site is gone (stale), a count that moved, an arm whose test or title is not
 * found, a guard not in its site, a reason under 20 characters.
 *
 * THE KNOWN LIMIT (in the hideable walker's words): an aliased read (`const sp = …safetyProfile; sp.blackMarketCapture`)
 * or a read in a module outside the scope (`causalState.js`, `historyBeats.js`, `facts/lawBand.js`) escapes the scan;
 * the HAND list is its remedy: each page reader the build found by its printed words, `path :: symbol`, the predicate or
 * fail-closed rule its body must hold, and its arm. Listed and NOT cured (commit 1's notes): the law band's other page
 * readers (`dossierViewModel.js :: outlookFactsOf`, `guardLineUnderTheLaw.js :: guardLineUnderTheBand`, `safetyShown.js`),
 * not on the slice.
 *
 * IN IT, by the brief: readiness and severity (V6: a wrong band is not a listed loss; severity is re-derived on every page,
 * its class STOPPED in commit 1); cure A's governance paragraph (a HAND row, its arm fortuneLastingSentence's); VEIL-55's
 * item: `governanceAccount.js :: BREAKDOWN_WITHHELD_TERMS` held EQUAL to the registry row `legitimacy.breakdown`'s withheld
 * terms and to `withholdAlways`' (a term added to the row later reds). The plant (a control `it`): a new reader of a
 * withheld key in a scratch copy of the scope reds the census.
 *
 * It renders nothing and births nothing: seconds.
 */
import { describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGISTRY_ROWS } from '../../src/domain/veil/rosterChoiceRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const DECL_RE = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)/;
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const isComment = (l) => /^\s*(\/\/|\*|\/\*|\{\/\*)/.test(l);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The body of a top-level declaration `name` in `text` (to the next top-level declaration), or null. */
function declBody(text, name) {
  const lines = text.split('\n');
  const i = lines.findIndex((l) => { const m = DECL_RE.exec(l); return !!m && (m[1] || m[2]) === name; });
  if (i < 0) return null;
  let j = i + 1;
  while (j < lines.length && !DECL_RE.exec(lines[j])) j += 1;
  return lines.slice(i, j).join('\n');
}
/** A body's code lines alone. */
const codeOf = (body) => String(body ?? '').split('\n').filter((l) => !isComment(l)).join('\n');

/** A registry row's path as (parent, key) pairs: the last two steps, each alternation expanded. */
function rowPaths(row) {
  if (!row.path.startsWith('^')) {
    const seg = row.path.replace(/ \(only in [AB]\)$/, '').split('.').map((s) => s.replace('[]', ''));
    return [{ parent: seg[seg.length - 2] || null, key: seg[seg.length - 1] }];
  }
  const p = row.path.replace(/^\^/, '').replace(/\$$/, '').replace(/\\b$/, '').replace(/\(\\\.\([^)]*\)\)\?$/, '').replace(/\\\[\\\]/g, '');
  const segs = p.split('\\.');
  const alts = (s) => { const m = /^\((.*)\)$/.exec(s); return m ? m[1].split('|') : [s]; };
  return alts(segs[segs.length - 2] || '').flatMap((parent) => alts(segs[segs.length - 1]).map((key) => ({ parent: parent || null, key })));
}
const lits = (s) => s.split(',').map((x) => x.trim()).filter(Boolean);

/** THE KEYS: `withholdAlways`' groups, each { ids, paths: [{ parent | null, key }] }, read at run time. */
function withheldGroups(source = read('src/domain/display/galleryWithholdAlways.js')) {
  const body = declBody(source, 'withholdAlways') || '';
  /** @type {Array<{ ids: string[], code: string[] }>} */ const groups = [];
  let cur = null;
  for (const line of body.split('\n')) {
    const m = /^\s*\/\/ registry: ([\w.]+)/.exec(line);
    if (m) { if (!cur || cur.code.length) { cur = { ids: [], code: [] }; groups.push(cur); } cur.ids.push(m[1]); continue; }
    if (cur && line.trim() && !isComment(line)) cur.code.push(line);
  }
  return groups.map(({ ids, code }) => {
    const text = code.join('\n');
    const paths = [];
    for (const m of text.matchAll(/(?:each)?[mM]inusAt\(\w+, \[([^\]]*)\], \[([^\]]*)\]\)/g)) {
      const path = lits(m[1]);
      const computed = path.some((x) => !/^'.*'$/.test(x));
      for (const k of lits(m[2])) paths.push({ parent: computed || !path.length ? null : path[path.length - 1].replace(/'/g, ''), key: k.replace(/'/g, '') });
    }
    for (const m of text.matchAll(/\bdelete s\.(\w+)/g)) paths.push({ parent: null, key: m[1] });
    if (!paths.length) for (const id of ids) { const row = REGISTRY_ROWS.find((r) => r.id === id); if (row) paths.push(...rowPaths(row)); }
    return { ids, paths };
  });
}

/** The patterns that find a reader of one withheld path. */
function patternsOf({ parent, key }) {
  if (!parent) return [new RegExp(`\\b${esc(key)}\\b`, 'g')];
  return [
    new RegExp(`\\b${esc(parent)}(?:\\s*\\[[^\\]]*\\])?\\s*\\??\\.\\s*${esc(key)}\\b`, 'g'),
    new RegExp(`'${esc(parent)}'\\s*\\]\\s*,\\s*\\[?(?:\\s*'\\w+'\\s*,)*\\s*'${esc(key)}'`, 'g'),
  ];
}

const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : /\.(m?js|jsx)$/.test(n) ? [p] : []; });
/** The scope: src/components/**, src/domain/display/**, src/domain/dailyLife*. */
const scopeOf = (root) => [
  ...walk(join(root, 'src/components')), ...walk(join(root, 'src/domain/display')),
  ...readdirSync(join(root, 'src/domain')).filter((n) => /^dailyLife.*\.(m?js|jsx)$/.test(n)).map((n) => join(root, 'src/domain', n)),
];

/** THE READERS: { '<path> :: <symbol>': count } over `root`. */
function census(root, groups) {
  const res = groups.flatMap((g) => g.paths.flatMap(patternsOf));
  /** @type {Record<string, number>} */ const out = {};
  for (const f of scopeOf(root)) {
    const rel = relative(root, f).split('\\').join('/');
    let sym = '(module)';
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      const m = DECL_RE.exec(line);
      if (m) sym = m[1] || m[2];
      if (isComment(line)) continue;
      let n = 0;
      for (const re of res) n += (line.match(re) || []).length;
      if (n) out[`${rel} :: ${sym}`] = (out[`${rel} :: ${sym}`] || 0) + n;
    }
  }
  return out;
}

const ARM_FILE = 'tests/components/failClosedSharedPage.test.jsx';
const ARMS = Object.freeze({
  crime: `${ARM_FILE} :: "Criminal opportunity" (the capture, registry safety.blackMarketCapture): P0 prints "Elevated"; P1 prints no row`,
  law: `${ARM_FILE} :: "Law & order" (the capture): P0 prints its band; P1 prints no row`,
  readiness: `${ARM_FILE} :: "Defense readiness" (registry defence.readiness.score): P0 prints its band; where the page re-derives no score, P1 prints no row`,
  legacy: `${ARM_FILE} :: P0 prints the legacy line; P1 prints nothing, not "Life goes on as usual" nor its siblings`,
  siege: `${ARM_FILE} :: P0 prints the clause the law\\'s band gives; P1 prints neither the clause nor its stored form`,
  ring: 'tests/components/defenseRingNoteProjection.test.jsx :: an unstamped shared record (no shipped note, no seed) prints NO organised-ring note',
  governance: 'tests/domain/fortuneLastingSentence.test.js :: a veiled read (the served read, the widest veil) names no cause, and every sentence is whole',
});
const SCORES_WHY = 'reads the defence profile\'s scores, which the page puts back from the served document before any reader runs (pageRederive.js :: rederiveForPage, PAGE_DRAWN_SCORES, the engine\'s generateDefenseProfile); absent only where the engine cannot read the served document (listed, PLAUSIBLE unreached: every served document carries the config and the economy it reads)';
const DESK_WHY = 'a desk run on the OWNER\'S record at the save (publicProseCompose.js) and on the owner\'s own page; a shared page prints the shipped lens and never re-draws it (the desk read\'s public branch: an absent lens key reads null, SILENT)';
const RECENT_WHY = 'reads the recent-conflict sentence the page re-derives from the served document (pageRederive.js :: rederiveRecentConflict; tests/lint/recentConflictReaders.walker.test.js registers it page-copy); absent where the engine draws none, and the reader then prints none';

/**
 * THE REGISTER: every site the census finds, with its count and its fail-closed arm.
 * @type {Readonly<Record<string, { n: number, verdict: 'arm' | 'guarded' | 're-derived' | 'owner-draw' | 'own-record' | 'veil' | 'not-a-read', arm?: string, guard?: string, why?: string }>>}
 */
const REGISTER = Object.freeze({
  'src/domain/display/failClosedReads.js :: captureWithheld': { n: 1, verdict: 'arm', arm: ARMS.crime },
  'src/domain/display/failClosedReads.js :: readinessScoreWithheld': { n: 1, verdict: 'arm', arm: ARMS.readiness },
  'src/domain/display/failClosedReads.js :: legacyWithheld': { n: 2, verdict: 'arm', arm: ARMS.legacy },
  'src/components/new/SummaryTab.jsx :: SummaryTab': { n: 9, verdict: 'guarded', guard: 'r.pressureSentence&&', why: `the pressure sentence prints only under \`r.pressureSentence&&\` (its copy withheld where it equals the recent conflict: nothing printed); the bars ${SCORES_WHY}` },
  'src/components/new/tabs/OverviewTab.jsx :: OverviewTab': { n: 4, verdict: 'guarded', guard: 'r?.pressureSentence && !pressureShared', why: 'the pressure line is the sentence only under a guard on the key itself; withheld, the line is null and nothing prints' },
  'src/components/map/QuickInspector.jsx :: QuickInspector': { n: 1, verdict: 'guarded', guard: "s.pressureSentence || ''", why: 'the map member\'s inspector reads the sentence or the empty string: withheld, nothing prints' },
  'src/domain/display/shadowEconomyShown.js :: shadowCaptureShown': { n: 1, verdict: 'guarded', guard: 'Number.isFinite(n) && n >= SHADOW_CAPTURE_FLOOR ? n : null', why: 'the Shadow Economy block\'s share: an absent capture is NaN, so the block prints no share (null)' },
  'src/domain/display/shadowEconomyShown.js :: criminalsStandHere': { n: 1, verdict: 'guarded', guard: 'list(safetyProfile?.crimeTypes) > 0', why: 'the crime list counts only where it is held (the page re-derives it where its grouping is proven open, pageRederive.js :: rederiveCrimeTypes); absent, it counts nothing' },
  'src/components/new/dailyLifeLogic.js :: extractSettlementContext': { n: 7, verdict: 're-derived', why: `the compound's output (re-derived: getInstFlags over the served houses) and military strength (never served; it falls to the score) and the scores: ${SCORES_WHY}` },
  'src/components/new/tabs/DefenseTab.jsx :: DefenseTab': { n: 4, verdict: 're-derived', why: SCORES_WHY },
  'src/domain/display/defenseDisplay.js :: deriveSupportingCapabilities': { n: 2, verdict: 're-derived', why: SCORES_WHY },
  'src/domain/display/defenseDisplay.js :: deriveDefenseReadiness': { n: 5, verdict: 're-derived', why: `${SCORES_WHY}; the gates are put back whole where the served profile lacks them (rederiveForPage)` },
  'src/domain/display/defenseScoreBands.js :: economicSurvivalBandOf': { n: 1, verdict: 're-derived', why: SCORES_WHY },
  'src/domain/display/magicMeasuresApart.js :: magicMeasuresApartLine': { n: 1, verdict: 're-derived', why: SCORES_WHY },
  'src/domain/display/threatAssessment.js :: disasterReadinessScore': { n: 2, verdict: 're-derived', why: SCORES_WHY },
  'src/domain/display/threatAssessment.js :: buildThreatAssessment': { n: 3, verdict: 're-derived', why: SCORES_WHY },
  'src/components/new/tabs/RelationshipsTab.jsx :: RelationshipsTab': { n: 1, verdict: 're-derived', why: RECENT_WHY },
  'src/domain/display/governanceAccount.js :: governanceAccountOf': { n: 1, verdict: 're-derived', why: RECENT_WHY },
  'src/domain/display/guardLineUnderTheLaw.js :: familiesHeldOf': { n: 1, verdict: 're-derived', why: RECENT_WHY },
  'src/domain/display/stateProse/defenseStateProse.js :: defenseThreatProse': { n: 2, verdict: 'owner-draw', why: DESK_WHY },
  'src/domain/display/stateProse/defenseStateProse.js :: defensePostureProse': { n: 4, verdict: 'owner-draw', why: DESK_WHY },
  'src/domain/display/stateProse/defenseStateProse.js :: defenseWallRationaleProse': { n: 1, verdict: 'owner-draw', why: DESK_WHY },
  'src/domain/display/stateProse/economyStateProse.js :: shadowEconomyPoolKey': { n: 1, verdict: 'owner-draw', why: DESK_WHY },
  'src/domain/display/stateProse/economyStateProse.js :: arcaneMarketPoolKey': { n: 1, verdict: 'owner-draw', why: DESK_WHY },
  'src/domain/display/stateProse/economyStateProse.js :: incomeWeightPoolKey': { n: 4, verdict: 'owner-draw', why: DESK_WHY },
  'src/domain/display/stateProse/economyStateProse.js :: economyStateProse': { n: 2, verdict: 'owner-draw', why: `${DESK_WHY}; it WRITES the incomeWeight and shadowEconomy lens keys` },
  'src/domain/display/stateProse/powerStateProse.js :: capturePoolKey': { n: 2, verdict: 'owner-draw', why: DESK_WHY },
  'src/domain/display/stateProse/powerStateProse.js :: structureFlagPoolKey': { n: 2, verdict: 'owner-draw', why: DESK_WHY },
  'src/domain/display/stateProse/warFaithStateProse.js :: religiousFraudPoolKey': { n: 1, verdict: 'owner-draw', why: DESK_WHY },
  'src/components/new/tabs/EconomicsTab.jsx :: EconomicsTab': { n: 2, verdict: 'not-a-read', why: 'reads the economics block\'s own lens (`economy:economics`), which no rule withholds; the aliases withheld always are the daily_life, resources and services blocks\' copies, which their tabs read through economyDeskRead\'s public branch (an absent key reads null)' },
  'src/domain/display/stateProse/printProse.js :: buildPrintProse': { n: 7, verdict: 'own-record', why: 'the print view\'s prose over the viewer\'s own saved record; a shared page mounts OutputContainer read-only, which offers no export' },
  'src/domain/display/galleryWithholdAlways.js :: withholdAlways': { n: 78, verdict: 'veil', why: 'THE HOST: withholds every key on every non-owner read (each rule its registry row)' },
  'src/domain/display/gallerySecondHomes.js :: withholdSecondHomes': { n: 2, verdict: 'veil', why: 'the second-homes pass judges the pressure sentence against the stored sentence and withholds it' },
  'src/domain/display/gallerySecondHomes.js :: withholdTiesOfTheSwept': { n: 2, verdict: 'veil', why: 'the swept ties\' pass withholds the pressure sentence where it names a swept tie' },
  'src/domain/display/gallerySecondHomes.js :: withholdCovertCopies': { n: 3, verdict: 'veil', why: 'the covert copies\' pass withholds the pressure sentence where it copies a covert line' },
  'src/domain/display/gallerySecondHomes.js :: castByServed': { n: 4, verdict: 'veil', why: 'withholdCastByServed\'s rule: the crisis cast\'s absent list goes, a stake by what is served' },
  'src/domain/display/publicSafe.js :: publicVeilPass': { n: 2, verdict: 'veil', why: 'the public strip filters the crisis cast\'s stakes naming a hidden power' },
  'src/domain/display/publicSafe.js :: PUBLIC_TOPLEVEL_KEYS': { n: 1, verdict: 'not-a-read', why: 'the public strip\'s allowlist of top-level keys (a key name in a list)' },
  'src/components/dossier/EngineSections.jsx :: DefenseWarFrontSection': { n: 1, verdict: 'not-a-read', why: '`model.readiness` is the causal variable (deriveCausalState().variables.defense_readiness), not the defence profile\'s readiness; and no module mounts EngineSections' },
  'src/components/dossier/proseFieldLabels.js :: PROSE_FIELD_LABELS': { n: 1, verdict: 'not-a-read', why: 'a label table\'s path key for the owner\'s editor' },
  'src/components/new/economyDeskRead.js :: SILENT_ECONOMY_DESK': { n: 2, verdict: 'not-a-read', why: 'the economy desk\'s SILENT shape: the lens keys written out as null' },
  'src/components/new/tabs/EconomicsTab.jsx :: SHADOW_ECONOMY_MOUNT': { n: 1, verdict: 'not-a-read', why: 'a mount id string naming the shadow-economy lens' },
  'src/domain/display/parityContract.js :: PARITY_EXEMPT': { n: 1, verdict: 'not-a-read', why: 'a parity exemption\'s fact name and reason string' },
  'src/domain/display/stateProse/dmFieldProjection.js :: DM_EDITABLE_PROSE_PATHS_BY_KIND': { n: 1, verdict: 'not-a-read', why: 'the owner\'s editable prose paths (a path list)' },
  'src/domain/display/stateProse/dossierMounts.js :: DOSSIER_MOUNTS': { n: 1, verdict: 'not-a-read', why: 'a mount table\'s lens key string' },
});

/**
 * THE HAND LIST (the known limit's remedy): page readers of a withheld key the property-path scan cannot see (an aliased
 * read, or the read in a module outside the scope), each with what its body must hold and its arm.
 * @type {Readonly<Record<string, { holds: ReadonlyArray<string>, arm: string, why: string }>>}
 */
const HAND = Object.freeze({
  'src/domain/display/foundationBandShown.js :: foundationRowWithheld': { holds: ['captureWithheld(settlement)', 'readinessScoreWithheld(settlement)'], arm: ARMS.law, why: 'the Foundations rows "Criminal opportunity" and "Law & order" (causalState.js reads the capture by an alias) and "Defense readiness" (defenseLedger.js reads the score); SubstrateTab filters on it' },
  'src/components/new/tabs/SubstrateTab.jsx :: SubstrateTab': { holds: ['.filter(([key]) => !foundationRowWithheld(settlement, key))'], arm: ARMS.crime, why: 'the Foundations tab prints no row foundationRowWithheld names' },
  'src/domain/display/guardLineUnderTheLaw.js :: safetyLineAsPrinted': { holds: ['captureWithheld(record)', "out.replace(SIEGE_ORDER_SENTENCE, '')"], arm: ARMS.siege, why: 'the Defense tab\'s siege order sentence reads the law\'s band (facts/lawBand.js), which reads the capture through causalState.js' },
  'src/domain/dailyLife.js :: deriveRecentChanges': { holds: ['!legacyWithheld(s)'], arm: ARMS.legacy, why: 'the recent-changes beat reads the legacy in historyBeats.js (outside the scope); the calm default is not said where it is withheld' },
  'src/components/new/defenseDeskRead.js :: criminalRingNoteRead': { holds: ["options.publicDossier && csd?.key === 'organized'"], arm: ARMS.ring, why: 'THE RING NOTE (the chair\'s class of 23:27): the organised ring\'s vantage is drawn by the seed, which no shared read carries; no shipped note and no seed, no note' },
  'src/domain/display/governanceAccount.js :: wholeBreakdown': { holds: ['BREAKDOWN_WITHHELD_TERMS.every('], arm: ARMS.governance, why: 'CURE A\'s governance paragraph: the cause clause reads the breakdown\'s three withheld terms by name (`b[field]`, an alias); where one is absent it names no cause' },
});

/** `<file> :: <title part>`: the file exists and holds the title part. */
function armFault(arm) {
  const i = arm.indexOf(' :: ');
  const file = arm.slice(0, i); const title = arm.slice(i + 4);
  let text;
  try { text = read(file); } catch { return `${arm}: no such test file`; }
  return text.includes(title) ? null : `${arm}: the title is not in ${file}`;
}
/** The site's own code (its top-level declaration's body). */
function siteCode(site) {
  const [file, sym] = site.split(' :: ');
  return codeOf(declBody(read(file), sym));
}

describe('the walker proves itself on a synthetic source (its own controls)', () => {
  it('the keys are read off withholdAlways at run time: a minusAt group, an eachMinusAt group, a delete, a computed parent and a helper call each give their paths', () => {
    const src = [
      'export function withholdAlways(s) {',
      '  // registry: safety.blackMarketCapture',
      "  minusAt(s, ['economicState', 'safetyProfile'], ['blackMarketCapture']);",
      '  // registry: conditions.severity',
      "  eachMinusAt(s, ['activeConditions'], ['severity']);",
      '  // registry: power.recentConflict.pressureSentence',
      '  if (x) delete s.pressureSentence;',
      '  // registry: prose.shadowEconomy.alias',
      "  for (const k of ['a']) minusAt(s, ['publicProse', 'blocks', k], ['shadowEconomy']);",
      '  // registry: spatial.quarters',
      '  helper(s);',
      '}',
    ].join('\n');
    expect(withheldGroups(src)).toEqual([
      { ids: ['safety.blackMarketCapture'], paths: [{ parent: 'safetyProfile', key: 'blackMarketCapture' }] },
      { ids: ['conditions.severity'], paths: [{ parent: 'activeConditions', key: 'severity' }] },
      { ids: ['power.recentConflict.pressureSentence'], paths: [{ parent: null, key: 'pressureSentence' }] },
      { ids: ['prose.shadowEconomy.alias'], paths: [{ parent: null, key: 'shadowEconomy' }] },
      { ids: ['spatial.quarters'], paths: [{ parent: 'spatialLayout', key: 'quarters' }] },
    ]);
  });
  it('the patterns read a property path, its index and optional chaining, and the array form; never another parent\'s key', () => {
    const [member, array] = patternsOf({ parent: 'readiness', key: 'score' });
    for (const ok of ['r.defenseProfile.readiness.score', 'dp?.readiness?.score', 'x.readiness [0] .score']) expect(ok.match(member)?.length, ok).toBe(1);
    for (const no of ['band.score', 'readinessScore', 'readiness.scoreBand']) expect(no.match(member), no).toBeNull();
    expect("absentAt(r, ['defenseProfile', 'readiness'], 'score')".match(array)?.length).toBe(1);
  });
  it('THE PLANT: a new reader of a withheld key in a scratch copy of the scope is a site the register does not hold', () => {
    const dir = mkdtempSync(join(tmpdir(), 'failclosed-plant-'));
    try {
      for (const d of ['src/components/new', 'src/domain/display']) mkdirSync(join(dir, d), { recursive: true });
      writeFileSync(join(dir, 'src/components/new/Planted.jsx'), 'export function Planted({ s }) {\n  return <p>{s.economicState.safetyProfile.blackMarketCapture}</p>;\n}\n');
      writeFileSync(join(dir, 'src/domain/dailyLifePlanted.js'), '// a comment naming safetyProfile.blackMarketCapture is not code\nexport const quiet = 1;\n');
      const got = census(dir, withheldGroups());
      expect(got).toEqual({ 'src/components/new/Planted.jsx :: Planted': 1 });
      expect(REGISTER['src/components/new/Planted.jsx :: Planted']).toBeUndefined();
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('V6 (c): every page reader of an always-withheld key, registered with its fail-closed arm', () => {
  it('the keys: every withholdAlways group names registry rows that exist and withholds a path; readiness and severity among them', () => {
    const groups = withheldGroups();
    const ids = groups.flatMap((g) => g.ids);
    expect(ids.length, 'not vacuous').toBeGreaterThanOrEqual(60);
    expect(ids.filter((id) => !REGISTRY_ROWS.some((r) => r.id === id)), 'a registry id with no row').toEqual([]);
    expect(groups.filter((g) => !g.paths.length).map((g) => g.ids.join(',')), 'a group with no path').toEqual([]);
    const keys = groups.flatMap((g) => g.paths.map((p) => `${p.parent}.${p.key}`));
    for (const k of ['readiness.score', 'activeConditions.severity', 'safetyProfile.blackMarketCapture', 'history.legacyAnnotations', 'breakdown.prosperity']) expect(keys, k).toContain(k);
  });

  it('every site is registered with its count and arm; none is stale; every arm\'s test title, guard and reason is found', () => {
    const got = census(ROOT, withheldGroups());
    expect(Object.keys(got).length, 'the census is not vacuous').toBeGreaterThanOrEqual(30);
    const unregistered = Object.entries(got).filter(([k]) => !REGISTER[k]).map(([k, n]) => `${k} (${n}): a reader of an always-withheld key with no fail-closed arm`);
    const stale = Object.keys(REGISTER).filter((k) => !got[k]).map((k) => `${k}: registered, no reader found`);
    const moved = Object.entries(REGISTER).filter(([k, r]) => got[k] && got[k] !== r.n).map(([k, r]) => `${k}: count ${got[k]}, registered ${r.n}`);
    const faults = [];
    for (const [k, r] of Object.entries(REGISTER)) {
      if (r.verdict === 'arm') { const f = armFault(r.arm || ''); if (f) faults.push(`${k}: ${f}`); continue; }
      if (!(r.why && r.why.length > 20)) faults.push(`${k}: no written reason`);
      if (r.verdict === 'guarded' && !siteCode(k).includes(r.guard || '\0')) faults.push(`${k}: the guard \`${r.guard}\` is not in its code`);
    }
    expect({ unregistered, stale, moved, faults }).toEqual({ unregistered: [], stale: [], moved: [], faults: [] });
  });

  it('THE HAND LIST: each reader the scan cannot see exists, holds its fail-closed rule, and has its arm', () => {
    const faults = [];
    for (const [k, h] of Object.entries(HAND)) {
      const code = siteCode(k);
      if (!code) { faults.push(`${k}: no such top-level declaration`); continue; }
      for (const w of h.holds) if (!code.includes(w)) faults.push(`${k}: does not hold \`${w}\``);
      const f = armFault(h.arm); if (f) faults.push(`${k}: ${f}`);
      if (!(h.why.length > 20)) faults.push(`${k}: no written reason`);
    }
    expect(faults).toEqual([]);
  });

  it('VEIL-55\'s item: governanceAccount.js :: BREAKDOWN_WITHHELD_TERMS equals the registry row legitimacy.breakdown\'s withheld terms and withholdAlways\' (a term added later reds)', () => {
    const m = /const BREAKDOWN_WITHHELD_TERMS = Object\.freeze\(\[([^\]]*)\]\)/.exec(read('src/domain/display/governanceAccount.js'));
    expect(m, 'BREAKDOWN_WITHHELD_TERMS is a frozen literal list').not.toBeNull();
    const terms = lits(m?.[1] ?? '').map((t) => t.replace(/'/g, '')).sort();
    const row = REGISTRY_ROWS.find((r) => r.id === 'legitimacy.breakdown');
    expect(row, 'the registry row legitimacy.breakdown').toBeTruthy();
    expect(rowPaths(row).map((p) => p.key).sort(), 'the registry row\'s terms').toEqual(terms);
    const group = withheldGroups().find((g) => g.ids.includes('legitimacy.breakdown'));
    expect((group?.paths ?? []).map((p) => p.key).sort(), 'withholdAlways\' terms').toEqual(terms);
  });
});
