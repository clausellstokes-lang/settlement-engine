/**
 * scripts/lib/style-law-scan.mjs — THE STYLE WALKER'S SCANNER (STYLE-2-WAVE lane SW-0, ruling A10).
 *
 * A pure module: it reads source text and returns counts. tests/lint/styleLaw.walker.test.js imports it.
 * The baseline tests/lint/.style-law-baseline.json is written ONLY by this file's own door:
 *
 *     node scripts/lib/style-law-scan.mjs --record     (write the baseline at the tree as it stands)
 *     node scripts/lib/style-law-scan.mjs              (report: totals by phrase, the top files, rises)
 *
 * THE RULES (the audit STYLE-AUDIT-2-SOURCES-2026-11-09 §3, as the chair's ruling A10 approved them):
 *
 *   ROOTS — the chair's census roots (the audit's §0, brief BRIEF-STYLE-2-AUDIT §2), plus the generated
 *     annex projections (`src/data/dossierStateProse/*.generated.js`, `src/data/dossierCausalProse.generated.js`),
 *     plus `src/domain/worldPulse` and `src/components/map`. Every .js/.jsx/.mjs/.ts/.tsx file under a root is
 *     read except test files and snapshots. LESS the audit's §4 exclusions BY PATH (109 files; EXCLUDED_PATHS).
 *
 *   UNITS — what the reader could be shown. Three kinds, read from the TypeScript parse (so comments are
 *     blanked by construction, and a regex literal or a quote inside a slot never derails the reader):
 *       • a string literal ('…' or "…");
 *       • a template literal, its slots `${…}` read as the token `{…}` (a nested template inside a slot is
 *         its own unit);
 *       • a JSX text run: the text between `>` and `<` — the JsxText and `{…}` children between two element
 *         boundaries, each `{…}` read as the token `{…}` (an empty `{}` or a `{/* comment *\/}` reads as
 *         nothing);
 *       • in every unit, a brace placeholder `{name}` / `{a.b}` (the annex's and `t()`'s slot syntax) is read
 *         as `{…}` too: a slot NAME is filled at print time and never prints as a word.
 *     A unit counts only when it carries TWO OR MORE words (whitespace-separated tokens, a slot counted as one).
 *
 *   PHRASES — PHRASES below, case-insensitive and word-bounded (`\b` on both ends; whitespace inside a phrase
 *     may be any run of whitespace). Every OCCURRENCE counts (a unit with two hits counts two).
 *
 *   THE ALLOW-LIST — ALLOW below: named app-chrome keys of `src/copy/en.js` (the key path of the string inside
 *     `en`), per phrase. An allowed hit is not counted. Every allowed key must exist and carry its phrase
 *     (the walker's anti-padding arm), so a dead entry cannot sit here silently.
 *
 *   THE RATCHET — the baseline holds a count per file per phrase. The walker FAILS when any file's count of
 *     any phrase RISES above its baseline (a file absent from the baseline has a baseline of 0), and when a
 *     phrase whose baseline TOTAL is 0 appears anywhere. A count that FALLS is green; the baseline is
 *     re-measured downward through this door (STYLE-2-MERGE at the final tip).
 */
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BASELINE_REL = 'tests/lint/.style-law-baseline.json';

/** The chair's census roots, verbatim from BRIEF-STYLE-2-AUDIT-2026-11-09 §2 (the audit's §0 ran them). */
export const CENSUS_ROOTS = Object.freeze([
  'src/components/new', 'src/components/dossier', 'src/components/settlementDetail',
  'src/components/PublicDossierView.jsx', 'src/components/OutputContainer.jsx',
  'src/domain/display', 'src/domain/dossier', 'src/domain/prose', 'src/domain/crisis', 'src/domain/npc',
  'src/domain/townScene', 'src/domain/summary', 'src/domain/dailyLife.js', 'src/domain/hookEscalation.js',
  'src/domain/hookThemes.js', 'src/domain/explanation.js', 'src/domain/rulingPower.js', 'src/domain/npcProfile.js',
  'src/domain/districtProfile.js', 'src/domain/magicProfile.js', 'src/domain/institutions', 'src/domain/content',
  'src/domain/activeConditions.js', 'src/domain/causalState.js', 'src/generators', 'src/pdf', 'src/foundry',
  'src/copy', 'src/data',
]);

/**
 * The roots A10 adds. The two annex projections sit under `src/data`, which the census root already walks;
 * they are named here because the census's own skip (`dossierStateProse|\.generated\.`) dropped them and the
 * walker does not inherit that skip (see the record: every `.generated.` file under a root is read, as the
 * audit's §3a measurement read them).
 */
export const ADDED_ROOTS = Object.freeze([
  'src/data/dossierStateProse', 'src/data/dossierCausalProse.generated.js',
  'src/domain/worldPulse', 'src/components/map',
]);

export const ROOTS = Object.freeze([...CENSUS_ROOTS, ...ADDED_ROOTS]);

const SOURCE_EXT = /\.(jsx?|mjs|tsx?)$/;
const SKIP = /node_modules|\.test\.|__snapshots__/;

/** The audit's §4 exclusions, BY PATH (109 files; class and reason per row in the audit's §4 table). */
export const EXCLUDED_PATHS = Object.freeze([
  'src/generators/generationReceiptJudgments.js',
  'src/generators/generationCoherence.js',
  'src/generators/steps/stepMetadata.js',
  'src/domain/prose/wiringCensus.js',
  'src/domain/prose/entryWalker.js',
  'src/domain/prose/grammarWalker.js',
  'src/domain/prose/moveGrammar.js',
  'src/domain/display/stateProse/stateProseKernel.js',
  'src/generators/isolationSupport.js',
  'src/copy/landing.js',
  'src/copy/pricingPage.js',
  'src/copy/deityAuthoring.js',
  'src/generators/aiLayer.js',
  'src/data/institutionDescColour.js',
  'src/domain/hookThemes.js',
  'src/domain/institutions/institutionTable.js',
  'src/domain/prose/holderTable.js',
  'src/domain/prose/proseFingerprint.js',
  'src/domain/display/institutionProfile.js',
  'src/generators/structuralValidator.js',
  'src/generators/generationContext.js',
  'src/domain/display/stateProse/dossierMounts.js',
  'src/domain/prose/plantLedger.js',
  'src/domain/npc/livedExperienceSources.js',
  'src/domain/npc/livedExperienceCatalog.js',
  'src/domain/npc/characterConsumers.js',
  'src/domain/npc/characterEdit.js',
  'src/domain/npc/acceptanceCharacterReads.js',
  'src/domain/display/stateProse/weaveBlock.js',
  'src/generators/services/institutionServices.js',
  'src/components/new/tabs/WarFaithDesk.jsx',
  'src/domain/display/parityContract.js',
  'src/domain/prose/presenceMeasure.js',
  'src/domain/prose/fieldSynonyms.js',
  'src/domain/npc/paradigmAxisCatalog.js',
  'src/domain/npc/npcFacets.js',
  'src/domain/npc/characterDrift.js',
  'src/domain/npc/knownCharacter.js',
  'src/domain/display/heraldJoinMolds.js',
  'src/domain/prose/composedWalker.js',
  'src/domain/prose/passageShapes.js',
  'src/domain/prose/wiringBranch.js',
  'src/domain/prose/entryGround.js',
  'src/domain/npc/livedExperienceFunnel.js',
  'src/domain/townScene/compileTownSceneManifest.js',
  'src/domain/townScene/cartographyContract.js',
  'src/domain/townScene/manifestRecordValidation.js',
  'src/domain/townScene/manifestContract.js',
  'src/domain/townScene/sceneCompileInput.js',
  'src/domain/townScene/customDefinitionReferenceValidation.js',
  'src/generators/pipeline.js',
  'src/generators/generateSettlementPipeline.js',
  'src/generators/power/economyReconciliation.js',
  'src/domain/dossier/entityLinks.js',
  'src/domain/content/reviewedSupplyChainPersistence.js',
  'src/domain/content/customContentCommands.js',
  'src/domain/content/contentFingerprint.js',
  'src/domain/content/contentEnvironmentRevision.js',
  'src/domain/content/contentEnvironmentResolution.js',
  'src/domain/content/settlementContentProvenance.js',
  'src/domain/content/customContentVersioning.js',
  'src/domain/content/customSupplyChainReview.js',
  'src/domain/content/contentDraftSession.js',
  'src/domain/content/contentEffectProjection.js',
  'src/domain/content/userContentTunables.js',
  'src/domain/content/contentEnvironmentLibrary.js',
  'src/domain/content/campaignContentLifecycle.js',
  'src/domain/content/customSupplyChainPresentation.js',
  'src/domain/content/contentSamplePreview.js',
  'src/domain/content/contentSampleCategoryFixtures.js',
  'src/components/dossier/SettlementWorkbench.jsx',
  'src/components/dossier/DossierAiConfirms.jsx',
  'src/components/dossier/DossierNarrativeButtons.jsx',
  'src/components/dossier/WorkbenchProseEditor.jsx',
  'src/components/dossier/WorkbenchFactionRename.jsx',
  'src/components/dossier/PendingChangesBar.jsx',
  'src/components/dossier/CascadePreviewPanel.jsx',
  'src/components/settlementDetail/SettlementDetailActions.jsx',
  'src/components/OutputContainer.jsx',
  'src/components/dossier/DossierSessionNotices.jsx',
  'src/components/dossier/WelcomeCreditCard.jsx',
  'src/components/settlementDetail/SettlementDossierHero.jsx',
  'src/components/settlementDetail/SettlementDetailNetworkEffectsPanel.jsx',
  'src/components/dossier/DossierSearchResults.jsx',
  'src/components/new/tabs/NotesTab.jsx',
  'src/components/new/npcComponents.jsx',
  'src/pdf/variants.js',
  'src/foundry/moduleBuilder.js',
  'src/data/securityQuestions.js',
  'src/data/roadmapLedger.js',
  'src/data/sampleSettlements.js',
  'src/data/foundingSeeds.js',
  'src/domain/display/regionWakeReplay.js',
  'src/domain/display/visibilityAudit.js',
  'src/generators/steps/isolationPass.js',
  'src/generators/steps/factionCorrelationPass.js',
  'src/generators/steps/subsumptionPass.js',
  'src/generators/steps/coherenceRepairPass.js',
  'src/generators/steps/generateEconomy.js',
  'src/generators/steps/assembleInstitutions.js',
  'src/generators/steps/resolveResources.js',
  'src/generators/steps/resolveStress.js',
  'src/generators/steps/stressConfirmPass.js',
  'src/generators/steps/resolveNeighbour.js',
  'src/generators/steps/generatePopulation.js',
  'src/generators/steps/generatePower.js',
  'src/generators/steps/generateNarratives.js',
  'src/generators/steps/resolveConfig.js',
  'src/generators/threatDefensePolicy.js',
]);

const W = '\\s+';
/** The audit's §3 list. `id` is the baseline's key; `re` is built case-insensitive and global. */
export const PHRASES = Object.freeze([
  { id: 'faction', klass: 'retired word', source: '\\bfaction(?:s|al|alism)?\\b' },
  { id: 'rather-than', klass: 'struck tic', source: `\\brather${W}than\\b` },
  { id: 'the-record', klass: 'struck tic', source: `\\bthe${W}record\\b` },
  { id: 'the-ledger', klass: 'machinery', source: `\\bthe${W}ledger\\b` },
  { id: 'the-engine', klass: 'machinery', source: `\\bthe${W}(?:engine|simulator|simulation)\\b` },
  { id: 'a-stranger', klass: 'struck tic', source: `\\ba${W}stranger\\b` },
  { id: 'arithmetic', klass: 'struck tic', source: '\\barithmetic\\b' },
  { id: 'per-cent', klass: 'machinery', source: `\\bper(?:${W})?cent\\b` },
  { id: 'on-the-roster', klass: 'machinery', source: `\\b(?:on|from|in)${W}the${W}roster\\b` },
  { id: 'not-merely', klass: 'struck tic', source: `\\bnot${W}merely\\b` },
  { id: 'legitimacy-score', klass: 'machinery', source: `\\blegitimacy${W}score\\b` },
  { id: 'the-gap-widens', klass: 'machinery', source: `\\bthe${W}gap${W}widens\\b` },
  { id: 'the-space-its-authority-does-not-occupy', klass: 'machinery', source: `\\bthe${W}space${W}its${W}authority${W}does${W}not${W}occupy\\b` },
  { id: 'two-different-things', klass: 'struck tic', source: `\\b(?:two${W}different${W}things|do${W}not${W}contradict)\\b` },
  { id: 'a-separate-question', klass: 'struck tic', source: `\\ba${W}separate${W}question\\b` },
  { id: 'nothing-has-broken-yet', klass: 'struck tic', source: `\\bnothing${W}has${W}broken${W}yet\\b` },
  { id: 'which-is-the-kind-of', klass: 'struck tic', source: `\\bwhich${W}is${W}the${W}kind${W}of\\b` },
]);
export const PHRASE_IDS = Object.freeze(PHRASES.map((p) => p.id));

/**
 * THE ALLOW-LIST: the app-chrome keys of `src/copy/en.js`, by key path inside `en`, per phrase. The audit
 * judged 443 of en.js's 444 literals app chrome (its §1b row; the one dossier string, `gallery` line 1029's
 * painting alt text, carries none of these phrases) and named the "simulation" and "engine" words of the
 * landing, onboarding, guidance, pricing and settings strings as the allow-list (§3). Those keys follow,
 * each a string a visitor reads ABOUT the product, never a line of a settlement's dossier. The retired word
 * and "the record" in en.js are NOT allowed: the retired word is lane SW-8's rename (A8), and the one
 * "the record" (a refusal notice) stays counted until a lane rules it.
 */
export const ALLOW = Object.freeze({
  'src/copy/en.js': Object.freeze({
    'the-engine': Object.freeze([
      'generate.subtitle',
      'generate.introSubtitleBasic',
      'surveyorDoor.proposed',
      'onboarding.coach.step2Body',
      'onboarding.checklist.itemRail',
      'guidance.dossierFirstCallouts',
      'guidance.postGenCoach.simulated',
      'guidance.notes.realm.empty.a',
      'guidance.notes.dossier.first.a',
      'guidance.notes.dossier.onward.a',
      'guidance.notes.simulation.onward.a',
      'gallery.antiAi',
      'errors.generateFail',
      'moments.regen_burst.headline',
      'pricingPitch.wanderer.lineWorldbuilder',
      'sampleDossier.footer',
      'aboutLiving.headerEyebrow',
      'aboutLiving.intro',
      'aboutLiving.systems.war.coherence',
      'aboutLiving.systems.chronicle.coherence',
      'replay.subtitle',
      'accountFaq.aiOrSim.a',
      'edit.shell.counterparty.note',
    ]),
  }),
});

const SLOT = '{…}';
/**
 * A brace placeholder inside a string (`'{faction} holds {settlement}'`, the annex's and `t()`'s slot syntax):
 * a slot NAME, filled at print time, so it is read as `{…}` like a template slot. Only a bare dotted
 * identifier in braces is a placeholder; `{ a: 1 }` or `{0}` stay text.
 */
const PLACEHOLDER = /\{[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*\}/g;

function scriptKindOf(file) {
  if (file.endsWith('.tsx')) return ts.ScriptKind.TSX;
  if (file.endsWith('.ts')) return ts.ScriptKind.TS;
  if (file.endsWith('.jsx')) return ts.ScriptKind.JSX;
  return ts.ScriptKind.JS;
}

function propName(name) {
  if (!name) return null;
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  if (ts.isPrivateIdentifier?.(name)) return name.text;
  return '[computed]';
}

/** The dotted path of object-literal property names that encloses `node` (innermost last). */
function keyPathOf(node) {
  const parts = [];
  for (let n = node.parent; n; n = n.parent) {
    if (ts.isPropertyAssignment(n)) parts.unshift(propName(n.name));
    else if (ts.isFunctionLike(n)) break;
  }
  return parts.length ? parts.join('.') : null;
}

export function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

/**
 * Every unit of one source file: `{ kind, text, line, key }`. `kind` is 'string' | 'template' | 'jsx'.
 * Units of fewer than two words are dropped here.
 */
export function extractUnits(sourceText, fileName = 'unit.js') {
  const sf = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, scriptKindOf(fileName));
  const units = [];
  const lineOf = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
  const push = (kind, text, node) => {
    const norm = text.replace(PLACEHOLDER, SLOT).replace(/\s+/g, ' ').trim();
    if (wordCount(norm) < 2) return;
    units.push({ kind, text: norm, line: lineOf(node.getStart(sf)), key: keyPathOf(node) });
  };
  const jsxRuns = (children) => {
    let run = [];
    let start = null;
    const flush = () => {
      if (run.length && run.some((p) => p !== SLOT)) push('jsx', run.join(''), start);
      run = [];
      start = null;
    };
    for (const child of children) {
      if (ts.isJsxText(child)) {
        if (child.containsOnlyTriviaWhiteSpaces) { if (run.length) run.push(' '); continue; }
        if (!start) start = child;
        run.push(child.text);
      } else if (ts.isJsxExpression(child)) {
        if (!child.expression) continue; // `{}` or `{/* comment */}` reads as nothing
        if (!start) start = child;
        run.push(SLOT);
      } else {
        flush(); // an element boundary ends the run
      }
    }
    flush();
  };
  const visit = (node) => {
    if (ts.isStringLiteral(node)) {
      push('string', node.text, node);
    } else if (ts.isNoSubstitutionTemplateLiteral(node)) {
      push('template', node.text, node);
    } else if (ts.isTemplateExpression(node)) {
      let text = node.head.text;
      for (const span of node.templateSpans) text += SLOT + span.literal.text;
      push('template', text, node);
    } else if (ts.isJsxElement(node) || ts.isJsxFragment(node)) {
      jsxRuns(node.children);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return units;
}

const COMPILED = PHRASES.map((p) => ({ id: p.id, re: new RegExp(p.source, 'gi') }));

/** Occurrences of every phrase in one text: `{ [id]: n }`, only the non-zero ids. */
export function phraseHits(text) {
  const out = {};
  for (const { id, re } of COMPILED) {
    re.lastIndex = 0;
    const n = (text.match(re) || []).length;
    if (n) out[id] = n;
  }
  return out;
}

function allowedFor(rel, key, id) {
  const byPhrase = ALLOW[rel];
  return Boolean(key && byPhrase && byPhrase[id] && byPhrase[id].includes(key));
}

/**
 * Scan one file's text. Returns `{ counts: {id: n}, hits: [{ id, line, key, text, allowed }] }`; an allowed
 * hit is listed (with `allowed: true`) but not counted.
 */
export function scanSource(rel, sourceText) {
  const counts = {};
  const hits = [];
  for (const u of extractUnits(sourceText, rel)) {
    for (const [id, n] of Object.entries(phraseHits(u.text))) {
      const allowed = allowedFor(rel, u.key, id);
      hits.push({ id, n, line: u.line, key: u.key, kind: u.kind, text: u.text, allowed });
      if (!allowed) counts[id] = (counts[id] || 0) + n;
    }
  }
  return { counts, hits };
}

function* walk(abs) {
  const st = statSync(abs);
  if (!st.isDirectory()) { yield abs; return; }
  for (const e of readdirSync(abs).sort()) {
    const p = path.join(abs, e);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (SOURCE_EXT.test(e)) yield p;
  }
}

/** The repo-relative files the walker reads: under ROOTS, not SKIPped, not EXCLUDED. Sorted, unique. */
export function listFiles(root) {
  const excluded = new Set(EXCLUDED_PATHS);
  const out = new Set();
  for (const r of ROOTS) {
    const abs = path.join(root, r);
    try { statSync(abs); } catch { continue; }
    for (const f of walk(abs)) {
      const rel = path.relative(root, f).split(path.sep).join('/');
      if (SKIP.test(rel) || !SOURCE_EXT.test(rel) || excluded.has(rel)) continue;
      out.add(rel);
    }
  }
  return [...out].sort();
}

/** Scan the tree. `{ files: { rel: {id: n} }, hits: { rel: [...] }, scanned: n }` — only files with a count. */
export function scanTree(root) {
  const files = {};
  const hits = {};
  const scanned = listFiles(root);
  for (const rel of scanned) {
    const r = scanSource(rel, readFileSync(path.join(root, rel), 'utf8'));
    if (Object.keys(r.counts).length) files[rel] = sortCounts(r.counts);
    if (r.hits.length) hits[rel] = r.hits;
  }
  return { files, hits, scanned: scanned.length };
}

function sortCounts(c) {
  const out = {};
  for (const id of PHRASE_IDS) if (c[id]) out[id] = c[id];
  return out;
}

export function totalsOf(files) {
  const t = Object.fromEntries(PHRASE_IDS.map((id) => [id, 0]));
  for (const c of Object.values(files)) for (const [id, n] of Object.entries(c)) t[id] += n;
  return t;
}

/** The digest the door stamps: sha256 over the canonical files map. A hand edit of `files` breaks it. */
export function digestOf(files) {
  const canon = Object.keys(files).sort().map((f) => [f, PHRASE_IDS.filter((id) => files[f][id]).map((id) => [id, files[f][id]])]);
  return createHash('sha256').update(JSON.stringify(canon)).digest('hex');
}

/**
 * Compare a scan to a baseline. `rises`: every (file, phrase) above its baseline (absent = 0).
 * `refused`: every (file, phrase) hit of a phrase whose baseline TOTAL is 0. `falls`: every count below.
 */
export function compare(scanFiles, baseline) {
  const base = baseline.files || {};
  const baseTotals = totalsOf(base);
  const rises = [];
  const refused = [];
  const falls = [];
  for (const [rel, counts] of Object.entries(scanFiles)) {
    for (const [id, n] of Object.entries(counts)) {
      const was = (base[rel] && base[rel][id]) || 0;
      if (baseTotals[id] === 0) refused.push({ file: rel, id, now: n });
      else if (n > was) rises.push({ file: rel, id, was, now: n });
    }
  }
  for (const [rel, counts] of Object.entries(base)) {
    for (const [id, was] of Object.entries(counts)) {
      const now = (scanFiles[rel] && scanFiles[rel][id]) || 0;
      if (now < was) falls.push({ file: rel, id, was, now });
    }
  }
  return { rises, refused, falls };
}

export function buildBaseline(scan, sha) {
  return {
    _doc: 'THE STYLE WALKER\'S BASELINE (STYLE-2-WAVE SW-0, ruling A10): per file, per phrase, the count of the audit\'s §3 phrases in the reader-facing units the scanner reads. ONLY-SHRINKS: tests/lint/styleLaw.walker.test.js fails when any count rises and when a phrase whose total is 0 appears anywhere. Written ONLY by `node scripts/lib/style-law-scan.mjs --record`; never hand-edited (the digest is checked). The rules are the scanner\'s header.',
    door: 'node scripts/lib/style-law-scan.mjs --record',
    measuredAtSha: sha,
    phrases: PHRASE_IDS,
    scannedFiles: scan.scanned,
    totals: totalsOf(scan.files),
    digest: digestOf(scan.files),
    files: scan.files,
  };
}

function headSha(root) {
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(); } catch { return null; }
}

function main(argv) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const scan = scanTree(root);
  if (argv.includes('--record')) {
    const b = buildBaseline(scan, headSha(root));
    writeFileSync(path.join(root, BASELINE_REL), `${JSON.stringify(b, null, 2)}\n`);
    console.log(`recorded ${BASELINE_REL}: ${Object.keys(scan.files).length} files with a hit of ${scan.scanned} scanned`);
    console.log(JSON.stringify(b.totals));
    return 0;
  }
  const totals = totalsOf(scan.files);
  console.log(`scanned ${scan.scanned} files; ${Object.keys(scan.files).length} with a hit`);
  console.log(JSON.stringify(totals));
  const top = Object.entries(scan.files).map(([f, c]) => [f, Object.values(c).reduce((a, b) => a + b, 0)]).sort((a, b) => b[1] - a[1]).slice(0, 15);
  for (const [f, n] of top) console.log(`${n}\t${f}\t${Object.entries(scan.files[f]).map(([i, k]) => `${i} ${k}`).join(' · ')}`);
  if (argv.includes('--json')) console.log(JSON.stringify(scan.files));
  let baseline = null;
  try { baseline = JSON.parse(readFileSync(path.join(root, BASELINE_REL), 'utf8')); } catch { /* none yet */ }
  if (baseline) {
    const c = compare(scan.files, baseline);
    console.log(`against the baseline: ${c.rises.length} rises · ${c.refused.length} refused · ${c.falls.length} falls`);
    for (const r of [...c.rises, ...c.refused]) console.log(`  ${r.file} :: ${r.id} ${r.was ?? 0} -> ${r.now}`);
    return c.rises.length || c.refused.length ? 1 : 0;
  }
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
