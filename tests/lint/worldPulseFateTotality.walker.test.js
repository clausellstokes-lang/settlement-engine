/**
 * worldPulseFateTotality.walker.test.js — EM-B1h: THE PULSE'S FATE WORDS ARE A CLOSED,
 * KINDED SET, AND EVERY SITE THAT WRITES ONE IS DECLARED.
 *
 * THE CLASS. `worldPulseFate` was an OPEN vocabulary: thirteen write sites across six
 * files, five spelling a bare literal and three deriving one, with nothing anywhere saying
 * what the legal words were. FINITE-SEMANTICS is the estate's law, and an open vocabulary is
 * where a nineteenth spelling lands unnoticed — a typo in one writer becomes a permanent
 * value on a saved world, and every reader that ever tests a fate is wrong about it forever.
 * THE PROMISE makes lived history immutable, so the cure can only be a freeze of what the
 * writers ALREADY stamp, never a re-spelling.
 *
 * THE MATCHER, STATED EXACTLY — NO DISCRETIONARY WORD. This walker strips block and line
 * comments from every `.js`/`.jsx` file under `src/` excluding `*.test.*`, with a
 * COMMENT-ONLY strip that KEEPS string contents (copied from
 * tests/domain/ruinInstitution.test.js:192 — ⛔ NEVER tests/helpers/codeOnlySource.js,
 * which blanks string CONTENTS and would return a vacuous zero, the trap EM-B1e measured).
 * It flags each file whose remaining source contains any quoted literal of the TRIGGER SET
 * — the members of the live `WORLD_PULSE_FATES` that belong to no other declared vocabulary
 * in the tree, where a declared vocabulary is a `const SCREAMING_SNAKE = <collection>`
 * initialiser in a file that is not a row of the writer roster — and REDS unless the
 * FLAGGED set is SET-EQUAL, IN BOTH DIRECTIONS, to the roster rows that spell fate literals
 * (∪ the inline exemption register, empty today); and REDS unless every file that writes
 * `worldPulseFate` is a roster row whose declared `spelling` matches the tree.
 *
 * ⓘ THE READING OF "the roster's `literal` rows", MEASURED. All six writer files spell fate
 * words as quoted literals — five write sites directly, and the derived writers through the
 * three derivers, which live in those same files. So the ROW-level question is "does this
 * file spell fate literals" (all six: yes, which is why FLAGGED is 6 and equals the roster
 * both ways), while `spelling` is a per-SITE fact: 5 literal, 1 argument, 3 derived, 4 clear
 * across the thirteen sites. Both are checked below.
 *
 * ⓘ NO SITE IS ADDRESSED BY LINE. The roster declares each file's write-site spellings IN
 * SOURCE ORDER and the enclosing symbols that must resolve live; the walker DERIVES each
 * site's actual spelling from the tree and reports `file:line` only in a FAILURE. A
 * line-keyed roster would red on any unrelated edit above it and be deleted within a week —
 * the lesson scripts/.observed-shape-readers-baseline.json's own header records.
 *
 * ⛔ THE DECLARED `CANNOT-CATCH:` HEADER, IN TWO PARAGRAPHS.
 * (1) A writer that builds a fate from a runtime value no deriver returns — a template, a
 * concatenation, or a `patch.fate` a future producer sets to an unknown word — is invisible
 * to a source scan. MEASURED: no such site exists today; every `patch.fate` producer in
 * `src/` is enumerated (institutionLifecycle:851 calls the same deriver;
 * moralInstitutionPressure:379 passes the :348 ternary). The guarded writer
 * (`ruinInstitution`) is the ONE site where the check runs at RUNTIME, which is why
 * EM-B1a's `set-institution-state` op routes through it.
 * (2) ⭐ THE KIND NOW HAS EXACTLY ONE READER, AND NO ARM *IN THIS FILE* CAN PROVE A KIND
 * *CORRECT* — only that it is present, single, and drawn from the declared three. The kinds
 * were derived at compile from the sibling keys of each writer's own record literal; a writer
 * that later changes what it does to the record WITHOUT changing its fate word would leave the
 * kind stale and nothing here would red. EM-B1i landed the reader and, with it, the arm that
 * closes this half: tests/domain/institutionDestroyedByKind.test.js A7 re-derives every
 * non-`closure` kind from its writer's own record literal. T4 below keeps the other half —
 * WHICH files may read the kind at all — as an EXACT roster rather than an absence.
 *
 * @enforced-by itself (a source scan plus execution through the real writer)
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

import { codeOnly as blankCommentsAndStrings } from '../helpers/codeOnlySource.js';
import { WORLD_PULSE_FATES, WORLD_PULSE_FATE_KIND, WORLD_PULSE_FATE_KINDS, isWorldPulseFate } from '../../src/domain/worldPulse/worldPulseFates.js';
import { ruinInstitution } from '../../src/domain/worldPulse/calamityKernel.js';
import { institutionProvenanceOf } from '../../src/domain/provenance/rosterProvenance.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LEAF = 'src/domain/worldPulse/worldPulseFates.js';
const BADGE = 'src/components/new/tabs/OverviewTab.jsx';

// ── THE MATCHER — a COMMENT-ONLY strip that KEEPS string contents ─────────────
// Copied verbatim from tests/domain/ruinInstitution.test.js:192. The shared `codeOnly`
// blanks string CONTENTS, so every arm below would scan blanks and pass on nothing; T3
// proves that difference by executing both on the same planted line.
function commentsOnly(src) {
  const out = src.split('');
  const n = src.length;
  let i = 0;
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) if (out[k] !== '\n') out[k] = ' '; };
  while (i < n) {
    const c = src[i];
    const d = src[i + 1];
    if (c === '/' && d === '/') { let j = i; while (j < n && src[j] !== '\n') j++; blank(i, j); i = j; continue; }
    if (c === '/' && d === '*') { let j = i + 2; while (j < n && !(src[j] === '*' && src[j + 1] === '/')) j++; blank(i, Math.min(j + 2, n)); i = j + 2; continue; }
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < n) {
        if (src[j] === '\\') { j += 2; continue; }
        if (src[j] === c) break;
        if (c !== '`' && src[j] === '\n') break;
        j++;
      }
      i = j + 1;
      continue;
    }
    i++;
  }
  return out.join('');
}

function walkFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walkFiles(p) : [p];
  });
}

/**
 * The body of `function <name>`, brace-balanced. '' when the symbol does not resolve.
 * ⛔ THE PARAMETER LIST IS BALANCED FIRST: `ruinInstitution(inst, { reason, fate })`
 * destructures, so taking the first `{` after the `(` returns the PARAMETER object and every
 * arm reading that body passes on four bytes. Measured — it did exactly that, once.
 */
function spanAt(src, openIdx, close) {
  let depth = 0;
  for (let i = openIdx; i < src.length; i += 1) {
    if (src[i] === src[openIdx]) depth += 1;
    else if (src[i] === close) { depth -= 1; if (depth === 0) return { text: src.slice(openIdx, i + 1), end: i }; }
  }
  return { text: '', end: -1 };
}

function declBody(src, name) {
  const at = src.search(new RegExp(`(?:^|\\n)(?:export\\s+)?(?:async\\s+)?function\\s+${name}\\s*\\(`));
  const lparen = at === -1 ? -1 : src.indexOf('(', at);
  const params = lparen === -1 ? { end: -1 } : spanAt(src, lparen, ')');
  const open = params.end === -1 ? -1 : src.indexOf('{', params.end);
  return open === -1 ? '' : spanAt(src, open, '}').text;
}

/** The fate words a deriver RETURNS: a `fate:` property value, else any returned literal. */
function derivedFateWords(body) {
  return [...new Set([...body.matchAll(/return\s+([^;]+);/g)].flatMap(([, expr]) => (/\bfate\s*:/.test(expr)
    ? [...expr.matchAll(/\bfate\s*:\s*['"`]([^'"`]+)['"`]/g)] : [...expr.matchAll(/['"`]([^'"`]+)['"`]/g)]).map((q) => q[1])))];
}

const SRC_FILES = walkFiles(join(ROOT, 'src'))
  .filter((p) => /\.(js|jsx)$/.test(p) && !/\.test\./.test(p))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();
/** rel -> comment-stripped source, string contents intact. @type {Map<string, string>} */
const STRIPPED = new Map(SRC_FILES.map((rel) => [rel, commentsOnly(readFileSync(join(ROOT, rel), 'utf8'))]));
const quoted = (word) => new RegExp(`['"\`]${word}['"\`]`);
const sorted = (xs) => [...xs].sort();

/**
 * THE WRITER ROSTER — one row per FILE that writes `worldPulseFate`. `literals` names the
 * fate words the file spells anywhere in its own source (write site or deriver), which is
 * what FLAGGED is checked against; `spellings` is the ordered per-site declaration; every
 * name in `symbols`, `derivers` and `guardedWriter` must resolve live. Declared here and
 * CHECKED against the tree below, never trusted.
 */
const WRITER_ROSTER = Object.freeze([
  // path, enclosing symbols (all must resolve live), guarded writer, derivers, the fate
  // literals the FILE spells anywhere, and the per-site spellings IN SOURCE ORDER.
  ['src/domain/worldPulse/calamityKernel.js', ['ruinInstitution', 'applyStrikeToRoster'], 'ruinInstitution', [], ['demoted_by_disaster', 'destroyed_by_disaster'], ['argument', 'literal']],
  ['src/domain/worldPulse/institutionLifecycle.js', ['applyInstitutionLifecycleOutcome', 'closureFateForInstitution'], null, ['closureFateForInstitution'], ['shuttered', 'bankrupt', 'closed_for_want_of_custom', 'abolished'], ['clear', 'derived', 'literal', 'clear']],
  ['src/domain/worldPulse/magicRegimeLifecycle.js', ['applyMagicFormPatches', 'magicClosureFate'], null, ['magicClosureFate'], ['bankrupt', 'closed_for_want_of_custom'], ['derived', 'clear']],
  ['src/domain/worldPulse/settlementLifecycleFirstClass.js', ['applySettlementLifecycleOutcomeToSettlement'], null, [], ['abandoned_with_the_settlement'], ['literal']],
  ['src/domain/worldPulse/tierOutcomeApply.js', ['deactivateForDemotion', 'applyTierOutcomeToSettlement'], null, ['demotionFateForInstitution'], ['reduced_to_watch_post', 'abandoned', 'privatized', 'survives_as_remnant', 'downsized', 'captured_by_local_powers', 'hollowed_out'], ['derived', 'clear']],
  ['src/domain/worldPulse/upswingKernel.js', ['advanceUpswing'], null, [], ['upgraded_by_reconstruction', 'founded_by_flourishing'], ['literal', 'literal']],
].map(([path, symbols, guardedWriter, derivers, literals, spellings]) => Object.freeze({ path, symbols, guardedWriter, derivers, literals, spellings })));

/**
 * THE KIND'S READER ROSTER — every `src/` file allowed to read WORLD_PULSE_FATE_KIND, held
 * EXACT in both directions by T4. EM-B1i is the packet that authorised this one reader and
 * that carried the golden and preset-witness measurement for it.
 * @type {readonly string[]}
 */
const KIND_READER_ROSTER = Object.freeze(['src/domain/worldPulse/causeLifecycle.js']);

/** The two files that READ the fate. Both are asserted NON-ENUMERATING and UNFLAGGED. */
const READER_ROSTER = Object.freeze([
  ['src/domain/provenance/rosterProvenance.js', 'institutionLastLifecycle'],
  ['src/domain/worldPulse/causeLifecycle.js', 'institutionDestroyed'],
].map(([path, symbol]) => Object.freeze({ path, symbol })));

/**
 * THE `patch.fate` PRODUCERS — the CANNOT-CATCH header's enumeration, made into an ARM.
 * `disbanded` is spelled by NO write site and by no deriver a write site names: its only
 * producer is moralInstitutionPressure's ternary, which feeds institutionLifecycle's abolish
 * patch. A write-site scan and a deriver walk both miss it, so the producer is declared here
 * by its VERBATIM statement and every word it yields is held to the vocabulary.
 * institutionLifecycle:851's producer is closureFateForInstitution, already walked as the
 * `derived` row's deriver, so one row covers the pair.
 */
const PATCH_FATE_PRODUCERS = Object.freeze([Object.freeze({ path: 'src/domain/worldPulse/moralInstitutionPressure.js', statement: "const fate = best.martial ? 'disbanded' : 'abolished';" })]);

/**
 * THE INLINE EXEMPTION REGISTER — a file allowed to spell a trigger word without being a
 * declared writer. EMPTY, and T3 proves the CHECKER consumes it by planting a row.
 * @type {readonly string[]}
 */
const FLAG_EXEMPTIONS = Object.freeze([]);

const ROSTER_PATHS = WRITER_ROSTER.map((r) => r.path);
const ROSTER_PATH_SET = new Set(ROSTER_PATHS);

/** Every `const SCREAMING_SNAKE = <collection>` initialiser body in a non-roster file. */
const CLOSER = Object.freeze({ '[': ']', '{': '}', '(': ')' });
function declaredVocabularyBodies(src) {
  const bodies = [];
  for (const m of src.matchAll(/const\s+([A-Z][A-Z0-9_]*)\s*=\s*/g)) {
    const from = m.index + m[0].length;
    const at = src.slice(from, from + 40).search(/[[{(]/);
    const { text } = at === -1 ? { text: '' } : spanAt(src, from + at, CLOSER[src[from + at]]);
    if (text) bodies.push({ name: m[1], body: text });
  }
  return bodies;
}

/** member -> the foreign declared vocabularies that also hold it, as `NAME × file`. */
const FOREIGN_HOMES = new Map(WORLD_PULSE_FATES.map((w) => [w, []]));
for (const rel of SRC_FILES.filter((r) => !ROSTER_PATH_SET.has(r))) {
  for (const { name, body } of declaredVocabularyBodies(STRIPPED.get(rel))) {
    for (const word of WORLD_PULSE_FATES) if (quoted(word).test(body)) FOREIGN_HOMES.get(word).push(`${name} × ${rel}`);
  }
}
const HOMONYMS = WORLD_PULSE_FATES.filter((w) => FOREIGN_HOMES.get(w).length > 0);
/** DORMANT: declared, and no writer can produce it until EM-B1a. Never a trigger. */
const DORMANT = 'ruined_by_decree';
const TRIGGER = WORLD_PULSE_FATES.filter((w) => !HOMONYMS.includes(w) && w !== DORMANT);
const FLAGGED = SRC_FILES.filter((rel) => TRIGGER.some((w) => quoted(w).test(STRIPPED.get(rel))));
const WRITER_FILES = SRC_FILES.filter((rel) => /worldPulseFate\s*:/.test(STRIPPED.get(rel)));
const HOMONYM_HOMES = HOMONYMS.map((w) => `${w} -> ${FOREIGN_HOMES.get(w).join(' | ')}`).join(' ;; ');

/** The FLAGGED set the roster + a given exemption register PREDICT. */
function flaggedExpectedFor(register) {
  return sorted([...WRITER_ROSTER.filter((r) => r.literals.some((l) => TRIGGER.includes(l))).map((r) => r.path), ...register]);
}

/**
 * Every `worldPulseFate:` write site in a roster file, with its spelling DERIVED from the
 * tree. An identifier value is resolved to its nearest preceding `const` binding and that
 * binding is classified, which is what separates institutionLifecycle's two `worldPulseFate:
 * fate` sites — one bound from a deriver, one from a bare `'abolished'` fallback.
 */
function discoveredSites(row) {
  const lines = STRIPPED.get(row.path).split('\n');
  const guarded = row.guardedWriter ? declBody(STRIPPED.get(row.path), row.guardedWriter) : '';
  const spellsFate = (t) => Boolean(t) && WORLD_PULSE_FATES.some((w) => quoted(w).test(t));
  const callsDeriver = (t) => Boolean(t) && row.derivers.some((d) => t.includes(`${d}(`));
  const out = [];
  lines.forEach((line, i) => {
    const m = /worldPulseFate\s*:\s*([^,}]+)/.exec(line);
    if (!m) return;
    const value = m[1].trim();
    const ident = /^([A-Za-z_$][\w$]*)/.exec(value);
    const bind = ident ? [...lines.slice(0, i)].reverse().find((l) => new RegExp(`const\\s+${ident[1]}\\s*=`).test(l)) : '';
    const rules = [['clear', /^null$/.test(value)], ['literal', spellsFate(value)], ['derived', callsDeriver(value)],
      ['argument', Boolean(guarded) && guarded.includes(line.trim())], ['derived', callsDeriver(bind)], ['literal', spellsFate(bind)]];
    out.push({ line: i + 1, spelling: (rules.find(([, hit]) => hit) || ['unknown'])[0], text: line.trim().slice(0, 90) });
  });
  return out;
}

describe('EM-B1h — worldPulseFate is a CLOSED, KINDED vocabulary and every writer is declared', () => {
  it('T1 the vocabulary is exact, closed, kinded and honest about its dormant member', () => {
    // GUARD-THE-GUARD FIRST: an absence claim over an empty scan is worthless.
    expect(SRC_FILES.length, 'the src/ scan found no files at all').toBeGreaterThan(2000);
    expect(STRIPPED.size).toBe(SRC_FILES.length);

    expect(WORLD_PULSE_FATES).toHaveLength(18);
    expect(new Set(WORLD_PULSE_FATES).size, 'a member is spelled twice').toBe(18);
    // Object.keys preserves insertion order for these keys, so the LEAF must be re-ordered.
    expect([...WORLD_PULSE_FATES], 'the members are not in codepoint order').toEqual(sorted(WORLD_PULSE_FATES));
    expect([WORLD_PULSE_FATES, WORLD_PULSE_FATE_KIND, WORLD_PULSE_FATE_KINDS].every(Object.isFrozen), 'a vocabulary that can be mutated is not closed').toBe(true);
    // The list is DERIVED from the kind map; decoupling them lets a member exist with no kind.
    expect([...WORLD_PULSE_FATES], 'the list stopped being Object.keys of the kind map').toEqual(Object.keys(WORLD_PULSE_FATE_KIND));

    // ⛔ null is the CLEAR sentinel that four sites write when an institution stands again.
    // Admitting it would make "no fate" a fate, and causeLifecycle reads exactly that absence.
    expect([null, undefined].map(isWorldPulseFate), 'the CLEAR sentinel became a member').toEqual([false, false]);
    expect(isWorldPulseFate('shuttered'), 'the membership test rejects a real member').toBe(true);

    expect(sorted(WORLD_PULSE_FATE_KINDS)).toEqual(['closure', 'rise', 'standing']);
    expect(WORLD_PULSE_FATES.filter((w) => !WORLD_PULSE_FATE_KINDS.includes(WORLD_PULSE_FATE_KIND[w]))
      .map((w) => `${w} has kind ${JSON.stringify(WORLD_PULSE_FATE_KIND[w])}, not one of the declared three`)).toEqual([]);
    // Each kind was DERIVED from the sibling keys of its writer's own record literal, never
    // from the word's English: `closure` sets _worldPulseInactive AND a non-active standing;
    // `standing` changes neither (demoted_by_disaster alone — its writer renames in place);
    // `rise` raises or founds an active institution.
    const populations = {};
    for (const w of WORLD_PULSE_FATES) populations[WORLD_PULSE_FATE_KIND[w]] = (populations[WORLD_PULSE_FATE_KIND[w]] || 0) + 1;
    expect(populations, 'the kind populations moved').toEqual({ closure: 15, standing: 1, rise: 2 });

    // THE HONESTY ARM — seventeen have a live writer or deriver; exactly ONE is dormant, so a
    // nineteenth word cannot arrive quietly and a member that lost its writer must be retired
    // deliberately, never silently: a saved world may still carry it.
    const spelledSomewhere = new Set();
    for (const rel of SRC_FILES) for (const w of WORLD_PULSE_FATES) if (quoted(w).test(STRIPPED.get(rel))) spelledSomewhere.add(w);
    const unspelled = WORLD_PULSE_FATES.filter((w) => !spelledSomewhere.has(w));
    expect(unspelled, `the declared-dormant set moved; only ${DORMANT} may be unproducible (until EM-B1a)`).toEqual([DORMANT]);
  });

  it('T2 declared equals discovered: the roster is the writer set, both ways, and every spelling is checked', () => {
    expect(WRITER_FILES.length, 'the write-site scan found nothing — the matcher is dark').toBeGreaterThan(0);
    // A new writer takes a roster row in the same commit; a retired one loses it.
    expect(sorted(WRITER_FILES), 'the files that WRITE worldPulseFate are not the roster').toEqual(sorted(ROSTER_PATHS));
    expect(sorted(ROSTER_PATHS), 'a roster row names a file that writes no fate').toEqual(sorted(WRITER_FILES));

    const offenders = [];
    let sitesSeen = 0;
    const spellings = {};
    for (const row of WRITER_ROSTER) {
      const src = STRIPPED.get(row.path);
      if (!src) { offenders.push(`${row.path} is a roster row that no longer exists in src/`); continue; }
      // EVERY DECLARED SYMBOL RESOLVES LIVE — path + symbol, never path + line.
      offenders.push(...[...row.symbols, ...row.derivers].filter((sym) => !declBody(src, sym)).map((sym) => `${row.path} declares symbol ${sym}, which does not resolve live`));
      offenders.push(...row.literals.filter((l) => !isWorldPulseFate(l)).map((l) => `${row.path} declares literal '${l}', which is NOT a member`));
      offenders.push(...row.literals.filter((l) => !quoted(l).test(src)).map((l) => `${row.path} declares literal '${l}' it no longer spells`));
      // ⭐ THE ARM THAT CATCHES 'disbanded': a deriver's OWN returns are read, so a word no
      // write site spells is still held to the vocabulary. A literal scan cannot do this.
      for (const deriver of row.derivers) {
        const words = derivedFateWords(declBody(src, deriver));
        if (words.length === 0) offenders.push(`${deriver} in ${row.path} returns no fate literal — the deriver arm went dark`);
        offenders.push(...words.filter((w) => !isWorldPulseFate(w)).map((w) => `${row.path} deriver ${deriver} returns '${w}', NOT a member of WORLD_PULSE_FATES`));
      }
      const sites = discoveredSites(row);
      sitesSeen += sites.length;
      for (const s of sites) spellings[s.spelling] = (spellings[s.spelling] || 0) + 1;
      if (sites.length !== row.spellings.length) {
        offenders.push(`${row.path} declares ${row.spellings.length} write sites and the tree has ${sites.length} (${sites.map((s) => `:${s.line} ${s.spelling}`).join(', ')})`);
        continue;
      }
      offenders.push(...sites.map((s, i) => (s.spelling === row.spellings[i] ? '' : `${row.path}:${s.line} is declared '${row.spellings[i]}' and the tree says '${s.spelling}' — ${s.text}`)).filter(Boolean));
      if (row.guardedWriter) offenders.push(...[[/import\s*\{[^}]*assertWorldPulseFate/, 'never imports assertWorldPulseFate'], [/assertWorldPulseFate\s*\(/, 'never CALLS it, so the writer is unguarded']].filter(([re]) => !re.test(src)).map(([, what]) => `${row.path} holds the guarded writer and ${what}`));
    }
    // ⭐ THE ARM THAT CATCHES 'disbanded' AT ITS SOURCE — no write site and no walked deriver
    // spells it, so its producer is checked directly, by name, against the live vocabulary.
    for (const prod of PATCH_FATE_PRODUCERS) {
      const src = STRIPPED.get(prod.path);
      const hits = src ? src.split(prod.statement).length - 1 : 0;
      if (hits !== 1) offenders.push(`${prod.path} declares the patch.fate producer statement ${JSON.stringify(prod.statement)}, found ${hits} times — re-aim it`);
      offenders.push(...[...prod.statement.matchAll(/['"`]([a-z_]+)['"`]/g)].map((m) => m[1]).filter((w) => !isWorldPulseFate(w))
        .map((w) => `${prod.path} producer yields '${w}', which is NOT a member of WORLD_PULSE_FATES — it reaches worldPulseFate through institutionLifecycle's patch.fate`));
    }
    expect(offenders).toEqual([]);
    expect(sitesSeen, 'the declared write-site population moved').toBe(13);
    expect(spellings, 'the per-site spelling census moved').toEqual({ literal: 5, argument: 1, derived: 3, clear: 4 });
  });

  it('T3 no foreign spelling, the trigger is derived, and the leaf names no entity standing', () => {
    // THE TRIGGER IS DERIVED FROM THE LIVE VOCABULARY, never transcribed. A dark trigger
    // flags nothing and passes everything, so the floor arm reds if it empties or halves.
    expect(TRIGGER.length, 'the trigger emptied or halved — the derivation went dark').toBeGreaterThanOrEqual(10);
    expect(sorted(TRIGGER)).toEqual(sorted(WORLD_PULSE_FATES.filter((w) => !HOMONYMS.includes(w) && w !== DORMANT)));
    expect(TRIGGER).toHaveLength(14);
    expect(HOMONYMS.filter((w) => FOREIGN_HOMES.get(w).length === 0)
      .map((w) => `${w} is treated as a homonym but names no foreign declared vocabulary`)).toEqual([]);
    // A homonym is a fate word that is ALSO a member of some other declared vocabulary, so
    // triggering on it would convict an innocent file — NONSTANDING_STATUS lives in
    // causeLifecycle.js, the fate reader's own file.
    expect(sorted(HOMONYMS), `the homonym set moved. Homes: ${HOMONYM_HOMES}`).toEqual(['abandoned', 'abolished', 'disbanded']);

    // BOTH MATCHER CONTROLS ARE REQUIRED, and they run BEFORE the set-equality below.
    const planted = "const x = { worldPulseFate: 'demoted_by_disaster' };";
    expect(quoted('demoted_by_disaster').test(commentsOnly(planted)), 'the matcher does not FIRE on a planted literal').toBe(true);
    expect(quoted('demoted_by_disaster').test(commentsOnly("// worldPulseFate: 'demoted_by_disaster'")), 'the matcher fires on a COMMENTED literal, so every FLAGGED result is noise').toBe(false);
    // The shared helper blanked string contents when this walker was written; if this flips,
    // re-measure before switching, because a helper that blanks strings makes every arm vacuous.
    expect(quoted('demoted_by_disaster').test(blankCommentsAndStrings(planted)), 'the shared codeOnly helper now KEEPS string contents').toBe(false);

    // A file that spells a pulse fate word is a declared writer or an exemption, or it reds.
    const expectedFlagged = flaggedExpectedFor(FLAG_EXEMPTIONS);
    expect(sorted(FLAGGED), 'an undeclared file spells a pulse fate word').toEqual(expectedFlagged);
    expect(expectedFlagged, 'a declared writer stopped spelling any trigger word').toEqual(sorted(FLAGGED));
    expect(FLAGGED).toHaveLength(6);
    // The exemption CHECKER is proved live on a planted row: the same function, given one,
    // must predict a different set — so an ignored register cannot hide behind a constant.
    expect(flaggedExpectedFor(['src/planted/exemption.js']), 'the exemption register is not consumed by the checker').not.toEqual(expectedFlagged);
    expect(flaggedExpectedFor(['src/planted/exemption.js'])).toContain('src/planted/exemption.js');

    // ⛔ THE LEAF IS CLEAN, IN BOTH DIRECTIONS. tests/domain/ruinInstitution.test.js's LANDED
    // A7 asserts the comment-only-stripped `status: 'ruined'` hit list over every non-test
    // src/ file is EXACTLY ['src/domain/worldPulse/calamityKernel.js'], and this leaf is
    // inside that scan — a record literal here would give the pulse a second ruin writer.
    const [leafRaw, leafCode] = [readFileSync(join(ROOT, LEAF), 'utf8'), STRIPPED.get(LEAF)];
    expect(leafCode, 'the leaf is not in the scan at all').toBeTruthy();
    expect(leafCode.includes('WORLD_PULSE_FATE_KIND'), 'the leaf no longer declares the kind map').toBe(true);
    const leafOffenders = [[/status\s*:/, leafCode, 'a `status:` token in CODE'], [/status\s*:\s*['"`]ruined['"`]/, leafRaw, "`status: 'ruined'` in its RAW source"]]
      .filter(([re, text]) => re.test(text)).map(([, , what]) => `${LEAF} contains ${what}`);
    expect(leafOffenders, "the leaf broke EM-B1e's LANDED A7 one-writer hit list").toEqual([]);
    // Its ARGUED_UNLAYERED row declares `reads: []`, EXACT only while the leaf reaches nothing.
    expect(/(?:^|\n)\s*import\s/.test(leafCode), 'the leaf acquired an import').toBe(false);
  });

  it('T4 the guard is live through the real writer, and EM-B1e\'s verdicts are unmoved', () => {
    const inst = Object.freeze({ name: 'Blacksmith', category: 'crafts' });
    // POSITIVE CONTROL FIRST — all eighteen are accepted, so a refusal below cannot be a
    // broken import masquerading as a working guard.
    const rejected = WORLD_PULSE_FATES.filter((fate) => {
      try { ruinInstitution(inst, { reason: 'r', fate }); return false; } catch { return true; }
    });
    expect(rejected, 'the guarded writer refuses a DECLARED member — vocabulary and guard have drifted').toEqual([]);
    expect(() => ruinInstitution(inst, { reason: 'r', fate: 'razed_by_the_gods' })).toThrow(/is not a member of WORLD_PULSE_FATES/);

    // EM-B1e's FOUR absence verdicts, asserted BY MESSAGE so the check ORDER is pinned: the
    // membership call sits AFTER the fate type check and BEFORE the reason check, so an empty
    // or non-string fate must still fail the TYPE check. A reordering would leave EM-B1e's
    // LANDED A3 green while silently changing which contract refused.
    expect(() => ruinInstitution(inst, { reason: 'r' })).toThrow(/fate is required and must be a non-empty string/);
    expect(() => ruinInstitution(inst, { reason: 'r', fate: '' })).toThrow(/fate is required and must be a non-empty string/);
    expect(() => ruinInstitution(inst, { reason: 'r', fate: 7 })).toThrow(/fate is required and must be a non-empty string/);
    expect(() => ruinInstitution(inst, { fate: 'destroyed_by_disaster' })).toThrow(/reason is required and must be a non-empty string/);

    // THE BYTE ARM — a validating guard is byte-transparent on every call it admits. THE
    // PROMISE makes lived history immutable and the preset lighting witness hashes it, so the
    // five keys and their ORDER are EM-B1e's frozen oracle.
    const record = ruinInstitution(inst, { reason: 'Destroyed outright by the disaster.', fate: 'destroyed_by_disaster' });
    expect(JSON.stringify(record), 'the ruin record moved').toBe('{"name":"Blacksmith","category":"crafts","status":"ruined","_worldPulseInactive":true,"_worldPulseEconomyClosed":true,"worldPulseFate":"destroyed_by_disaster","remnantReason":"Destroyed outright by the disaster."}');

    // ⭐ EXACTLY ONE FILE READS THE KIND, AND IT IS DECLARED. EM-B1i made
    // causeLifecycle.institutionDestroyed test the `closure` kind and carried the golden and
    // preset-witness measurement for doing so. ⛔ NARROWED, NEVER DELETED: this is a both-ways
    // set equality against the roster, so an EMPTY hit list reds too (the cure went missing),
    // and it is not weakened to "at most one".
    const kindReaders = SRC_FILES.filter((rel) => rel !== LEAF && /WORLD_PULSE_FATE_KIND\b/.test(STRIPPED.get(rel)));
    expect(kindReaders, 'the declared reader roster is not what src/ holds: no file reads WORLD_PULSE_FATE_KIND any more, or the one that does has moved').toEqual(KIND_READER_ROSTER);
    expect(KIND_READER_ROSTER, 'a SECOND src/ file now READS WORLD_PULSE_FATE_KIND — EM-B1i authorised exactly one reader, and another one needs its own packet and its own golden and preset-witness measurement').toEqual(kindReaders);

    // BOTH READERS ARE NON-ENUMERATING, and reader 1 is driven through the REAL function with
    // a STANDING-institution negative control FIRST.
    expect(institutionProvenanceOf({ name: 'Tannery', category: 'crafts' }).lastLifecycle, 'an institution with no fate must read as having no lifecycle').toBeNull();
    const dropped = WORLD_PULSE_FATES.filter((fate) => !institutionProvenanceOf({
      name: 'Tannery', category: 'crafts', status: 'remnant', worldPulseFate: fate, remnantReason: 'r',
    }).lastLifecycle);
    expect(dropped, 'reader 1 dropped a member — it must FORWARD every word, never enumerate').toEqual([]);
    const readerOffenders = [];
    for (const row of READER_ROSTER) {
      const body = declBody(STRIPPED.get(row.path), row.symbol);
      if (!body) { readerOffenders.push(`${row.path} no longer declares ${row.symbol}`); continue; }
      const enumerated = WORLD_PULSE_FATES.filter((w) => quoted(w).test(body));
      if (enumerated.length) readerOffenders.push(`${row.symbol} in ${row.path} now BRANCHES on ${enumerated.join(', ')} — it reads presence, never value`);
      if (FLAGGED.includes(row.path)) readerOffenders.push(`${row.path} is a READER and is FLAGGED — it would be convicted as a writer`);
    }
    expect(readerOffenders).toEqual([]);

    // ⭐ NO READER IS A DISPLAY SURFACE: `lastLifecycle` is read nowhere in src/ outside its
    // producer, and OverviewTab's institutionBadge destructures `created` ONLY. If the fate
    // reached a surface, the voice law would apply to words frozen here as engine vocabulary.
    expect(SRC_FILES.filter((rel) => rel !== READER_ROSTER[0].path && /\blastLifecycle\b/.test(STRIPPED.get(rel))), 'the fate reached a surface').toEqual([]);
    const badge = declBody(STRIPPED.get(BADGE), 'institutionBadge');
    expect(badge, 'institutionBadge no longer resolves — re-aim the surface claim').toBeTruthy();
    expect(/institutionProvenanceOf\s*\(/.test(badge), 'the badge no longer calls the provenance reader').toBe(true);
    expect(/const\s*\{\s*created\s*\}\s*=/.test(badge), 'institutionBadge destructures more than `created` — check whether it reached lastLifecycle, which carries the fate').toBe(true);
  });
});
