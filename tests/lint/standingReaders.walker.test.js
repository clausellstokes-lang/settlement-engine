/**
 * standingReaders.walker.test.js — EVERY READER OF THE STANDING, REGISTERED, AND THE PAGE READERS' ROSTER PINNED (R5-DESC's
 * page half; VEIL-37's R5D-PAGE-A, brief item 6; the chair's E115, E121, E126, E128, E129, each vetoable by the owner; on
 * tests/lint/crimeTypesReaders.walker.test.js's pattern, as tests/lint/recentConflictReaders.walker.test.js).
 *
 * THE LAW. A power's STANDING (the tail factionStanding.js :: annotateFactionStanding appends to its desc) is on NO shared
 * read of ANY place: 212 :: _gallery_veil_withhold_always and the twin galleryWithholdAlways.js :: withholdAlways cut it by
 * ONE table (`registry: power.desc`). RULING V15 (the tenth chair, 2026-11-25 01:16 UTC): PHASE 1 IS THE CUT ALONE; THE
 * SHARED PAGE PRINTS NO STANDING. The ONE reader (src/domain/veil/pageRederive.js :: rederiveStanding) keeps its name, its
 * export and both doors' calls, and WRITES NOTHING: each served row's desc (pageRederive.js :: servedRosterOf, every row the
 * read hides out) is the twin's table's cut of itself (standingBase: a no-op on a desc the veil already cut), and at the
 * import's save (authoritative) a row the read hides keeps no desc. It calls NO writer of the standing. The page calls it
 * through rederiveForPage; the import's save through importRederive.js :: rederiveInPlace (authoritative).
 *
 * THE WALKER: every code line of every module under src/ that names the standing's writer or its cut
 * (`annotateFactionStanding`, `standingRosterOf`, `standingForceOf`, `standingBase`; a word; comment lines are not code) is a
 * SITE `path :: top-level symbol` with its count, REGISTERED below with its verdict:
 *   one-reader  the ONE reader (and its module's imports);
 *   veil        the share veil's own engine (it cuts the standing, or judges a base by the cut);
 *   owner-only  the birth and the roster's re-settlement: never on a shared document, BY CONSTRUCTION (the written reason);
 *   not-a-read  the word as a local name or an import that reads nothing.
 * RED on a site not registered, on a registered site gone (stale), on a count that moved; on THE ONE READER missing, not
 * reading the served roster, not cutting by the twin's table, or not wired at a door; and on THE TAIL SHIPPING (an
 * always-host that does not cut it; the registry row not withhold / always / page re-derive / built).
 *
 * THE PAGE READERS' ROSTER (E128 (b)): every page reader reads the served roster (servedRosterOf): the crime list's seats,
 * the standing, and the recent-conflict reader, which cuts its writer's roster to the served rows and draws no sentence
 * naming a cut power (holdsOverServed, by the lane's fold).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGISTRY_ROWS } from '../../src/domain/veil/rosterChoiceRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const WORD = /\b(?:annotateFactionStanding|standingRosterOf|standingForceOf|standingBase)\b/g;
const DECL_RE = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)/;
const BIRTH_WHY = 'the birth or the roster\'s re-settlement: the generator writes the standing on the record it is generating, never on a served document';

/** @type {Readonly<Record<string, { n: number, verdict: 'one-reader' | 'veil' | 'owner-only' | 'not-a-read', why?: string }>>} */
const REGISTER = Object.freeze({
  'src/domain/veil/pageRederive.js :: (module)': { n: 1, verdict: 'one-reader' },
  'src/domain/veil/pageRederive.js :: rederiveStanding': { n: 1, verdict: 'one-reader' },
  'src/domain/display/galleryWithholdAlways.js :: standingBase': { n: 1, verdict: 'veil', why: 'THE CUT itself: the twin of 212\'s standing cut by the one table (registry: power.desc)' },
  'src/domain/display/galleryWithholdAlways.js :: withholdAlways': { n: 1, verdict: 'veil', why: 'cuts the standing off every served desc on every non-owner read (registry: power.desc)' },
  'src/domain/display/galleryRosterChoices.js :: (module)': { n: 1, verdict: 'veil', why: 'the belt\'s import of the twin\'s cut (212 (38) (e))' },
  'src/domain/display/galleryRosterChoices.js :: withholdPowerCopies': { n: 1, verdict: 'veil', why: 'the belt: a desc whose base, as the cut leaves it, still names a withheld power leaves whole (212 (38) (e))' },
  'src/domain/display/galleryRosterChoices.js :: withholdStoredNamedDescs': { n: 1, verdict: 'veil', why: 'THE STORED BELT (RULING V27 (1), 212 (38)): a desc naming a stored power no served list names, whose base as the cut leaves it still names one, leaves whole' },
  'src/generators/power/factionStanding.js :: annotateFactionStanding': { n: 1, verdict: 'owner-only', why: 'THE WRITER itself, run at birth only (V15: the ONE reader calls no writer)' },
  'src/generators/power/normalizeAndAnnotateFactions.js :: (module)': { n: 1, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/power/normalizeAndAnnotateFactions.js :: normalizeAndAnnotateFactions': { n: 1, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/power/rosterText.js :: (module)': { n: 1, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/power/rosterText.js :: standingRosterOf': { n: 1, verdict: 'owner-only', why: 'the roster as the standing reads it (by power), run at birth only (V15: the ONE reader calls no writer)' },
  'src/generators/power/rosterText.js :: standingForceOf': { n: 1, verdict: 'owner-only', why: 'the force the standing names, from the houses: run at birth only (V15: the ONE reader calls no writer)' },
  'src/generators/power/rosterText.js :: standingsOf': { n: 1, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/power/rosterText.js :: settleStandingToRoster': { n: 1, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/power/rosterText.js :: settleTensionsToRoster': { n: 1, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/power/rosterText.js :: settleNarrativesToRoster': { n: 1, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/power/rulingStructure.js :: (module)': { n: 1, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/power/rulingStructure.js :: generatePowerStructure': { n: 1, verdict: 'owner-only', why: 'the power step at birth (and the recent-conflict reader\'s engine, whose own roster\'s standings no page reads)' },
  'src/generators/steps/assembleSettlement.js :: (module)': { n: 2, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/steps/assembleSettlement.js :: UNPINNED': { n: 2, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/economy/prosperity.js :: deriveProsperityLabels': { n: 2, verdict: 'not-a-read', why: 'a local name `standingBase` (the prosperity ladder\'s base), not the cut: it reads no power' },
});

/** @param {string} d @returns {string[]} */
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : /\.(m?js|jsx)$/.test(n) ? [p] : []; });
/** A body's code lines alone (comment lines dropped). */
const codeOf = (body) => body.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');

/** Every site of src/: { '<path> :: <symbol>': count }. */
function census() {
  /** @type {Record<string, number>} */ const out = {};
  for (const f of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, f).split('\\').join('/');
    let sym = '(module)';
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      const m = DECL_RE.exec(line);
      if (m) sym = m[1] || m[2];
      if (/^\s*(\/\/|\*|\/\*)/.test(line)) continue;
      const n = (line.match(WORD) || []).length;
      if (n) out[`${rel} :: ${sym}`] = (out[`${rel} :: ${sym}`] || 0) + n;
    }
  }
  return out;
}
/** The body of a top-level declaration `name` in `text` (to the next top-level declaration), or null. */
function declBody(text, name) {
  const lines = text.split('\n');
  const i = lines.findIndex((l) => { const m = DECL_RE.exec(l); return !!m && (m[1] || m[2]) === name; });
  if (i < 0) return null;
  let j = i + 1;
  while (j < lines.length && !DECL_RE.exec(lines[j])) j += 1;
  return lines.slice(i, j).join('\n');
}
function sqlBody(sql, name) {
  const m = new RegExp(`^create or replace function public\\.${name}\\(`, 'm').exec(sql);
  if (!m) return null;
  const j = sql.indexOf('end $$;', m.index);
  return j < 0 ? null : sql.slice(m.index, j);
}
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

describe('the judgment proves itself on a synthetic source (its own controls)', () => {
  it('declBody finds a top-level body to the next declaration; codeOf drops comment lines; the word counts calls, not comments', () => {
    const src = 'export function a(x) {\n  // standingBase in a comment\n  return standingBase(x);\n}\nconst b = 1;\n';
    expect(declBody(src, 'a')).toBe('export function a(x) {\n  // standingBase in a comment\n  return standingBase(x);\n}');
    expect(declBody(src, 'nowhere')).toBeNull();
    expect((codeOf(declBody(src, 'a') || '').match(WORD) || []).length).toBe(1);
  });
});

describe('R5-DESC: every reader of the standing, registered', () => {
  it('every site is registered with its count; none is stale; each owner-only, veil and not-a-read site gives its reason', () => {
    const got = census();
    expect(Object.keys(got).length, 'the census is not vacuous').toBeGreaterThanOrEqual(15);
    const unregistered = Object.entries(got).filter(([k]) => !REGISTER[k]).map(([k, n]) => `${k} (${n}): not registered`);
    const stale = Object.keys(REGISTER).filter((k) => !got[k]).map((k) => `${k}: registered, not found`);
    const moved = Object.entries(REGISTER).filter(([k, r]) => got[k] && got[k] !== r.n).map(([k, r]) => `${k}: count ${got[k]}, registered ${r.n}`);
    const reasonless = Object.entries(REGISTER).filter(([, r]) => r.verdict !== 'one-reader' && !(r.why && r.why.length > 20)).map(([k]) => `${k}: no written reason`);
    expect({ unregistered, stale, moved, reasonless }).toEqual({ unregistered: [], stale: [], moved: [], reasonless: [] });
  });

  it('THE ONE READER exists, CALLS NO WRITER (V15: the page prints no standing), cuts each SERVED ROSTER row\'s desc by the twin\'s table, and is wired at both doors: rederiveForPage and the import\'s save (authoritative)', () => {
    const out = [];
    const page = read('src/domain/veil/pageRederive.js');
    const reader = codeOf(declBody(page, 'rederiveStanding') || '');
    if (!reader) out.push('pageRederive.js :: rederiveStanding: no such top-level declaration');
    else {
      if (!/export function rederiveStanding\(/.test(reader)) out.push('rederiveStanding is not exported');
      for (const call of ['servedRosterOf(', 'standingBase(']) if (!reader.includes(call)) out.push(`rederiveStanding does not call ${call}`);
      // V15 (the inverse of R5-DESC's arm): the reader writes nothing, so it calls no writer of the standing
      for (const call of ['standingRosterOf(', 'annotateFactionStanding(', 'standingForceOf(']) if (reader.includes(call)) out.push(`rederiveStanding calls the writer's ${call} (V15: the page prints no standing)`);
      if (!/if \(authoritative\) for \(const f of ps\.factions\) if \(isRec\(f\) && isCutRow\(f\)\) delete f\.desc;/.test(reader)) out.push('rederiveStanding does not drop a hidden row\'s desc at the import\'s save');
    }
    const roster = codeOf(declBody(page, 'servedRosterOf') || '');
    if (!/!isCutRow\(f\)/.test(roster)) out.push('servedRosterOf does not take the rows the read hides out');
    if (!/f\.hidden === true \|\| f\.faction === HIDDEN_POWER_MASK \|\| f\.name === HIDDEN_POWER_MASK/.test(codeOf(declBody(page, 'isCutRow') || ''))) out.push('isCutRow is not the stamp or the mask');
    if (/import \{[^}]*\b(?:standingRosterOf|standingForceOf|annotateFactionStanding)\b[^}]*\} from/.test(page)) out.push('pageRederive.js imports a writer of the standing (V15: the page prints no standing)');
    if (!/import \{[^}]*\bstandingBase\b[^}]*\} from '\.\.\/display\/galleryWithholdAlways\.js'/.test(page)) out.push('pageRederive.js does not import the twin\'s cut');
    if (!codeOf(declBody(page, 'rederiveForPage') || '').includes('rederiveStanding(s)')) out.push('rederiveForPage does not call rederiveStanding');
    for (const reader2 of ['rederiveCrimeTypes', 'holdsOverServed']) if (!codeOf(declBody(page, reader2) || '').includes('servedRosterOf(s)')) out.push(`${reader2} does not read the served roster`);
    const imp = read('src/domain/veil/importRederive.js');
    if (!/import \{[^}]*\brederiveStanding\b[^}]*\} from '\.\/pageRederive\.js'/.test(imp)) out.push('importRederive.js does not import rederiveStanding from ./pageRederive.js');
    if (!/rederiveStanding\(s, \{ authoritative: true \}\)/.test(codeOf(declBody(imp, 'rederiveInPlace') || ''))) out.push('importRederive.js :: rederiveInPlace does not call rederiveStanding(s, { authoritative: true })');
    const gallery = read('src/lib/gallery.js');
    for (const door of ['fetchGalleryMap', 'sanitizeDossier']) if (!(declBody(gallery, door) || '').includes('rederiveForPage(')) out.push(`gallery.js :: ${door} does not call rederiveForPage`);
    expect(out).toEqual([]);
  });

  it('THE TAIL NEVER SHIPS: both always-hosts cut the standing and drop a hidden or masked row\'s desc; the registry row power.desc is withheld always, NOT DRAWN by the page (RULING V15), built', () => {
    const out = [];
    const always = sqlBody(read('supabase/migrations/212_share_veil_later_cures.sql'), '_gallery_veil_withhold_always') || '';
    if (!always.includes('-- registry: power.desc\n')) out.push('212 :: _gallery_veil_withhold_always does not name power.desc');
    if (!always.includes('-- STANDING_FORMS begin') || !always.includes('-- STANDING_FORMS end')) out.push('212 :: _gallery_veil_withhold_always carries no STANDING_FORMS table');
    const twin = declBody(read('src/domain/display/galleryWithholdAlways.js'), 'withholdAlways') || '';
    if (!twin.includes('// registry: power.desc\n')) out.push('galleryWithholdAlways.js :: withholdAlways does not name power.desc');
    if (!/f\.desc = standingBase\(f\.desc\)/.test(twin)) out.push('galleryWithholdAlways.js :: withholdAlways does not cut the standing');
    if (!/f\.hidden === true \|\| f\.faction === HIDDEN_POWER_MASK \|\| f\.name === HIDDEN_POWER_MASK\)\) delete f\.desc/.test(twin)) out.push('galleryWithholdAlways.js :: withholdAlways does not drop a hidden or masked row\'s desc');
    const row = REGISTRY_ROWS.find((r) => r.id === 'power.desc');
    if (!row) out.push('the registry has no row power.desc');
    else if (row.rule !== 'withhold' || row.when !== 'always' || row.page !== 'not drawn' || !row.built || (row.inputs || []).length) out.push(`the registry row power.desc is ${row.rule}/${row.when}/page ${row.page}/built ${row.built}/inputs ${JSON.stringify(row.inputs)}`);
    expect(out).toEqual([]);
  });
});

describe('THE PAGE READERS\' ROSTER (E128 (b))', () => {
  it('the recent-conflict reader cuts its writer\'s roster to the served roster and draws no sentence naming a cut power (the lane\'s fold)', () => {
    const out = [];
    const page = read('src/domain/veil/pageRederive.js');
    if (!codeOf(declBody(page, 'rederiveRecentConflict') || '').includes('holdsOverServed(v, ')) out.push('rederiveRecentConflict does not cut its writer\'s roster to the served roster');
    const holds = codeOf(declBody(page, 'holdsOverServed') || '');
    for (const call of ['servedRosterOf(s)', 'isCutRow(f)', 'buildNameSearch(', 'search.hit(sentence)']) if (!holds.includes(call)) out.push(`holdsOverServed does not call ${call}`);
    if (!/import \{[^}]*\bbuildNameSearch\b[^}]*\} from '\.\.\/display\/gallerySecondHomes\.js'/.test(page)) out.push('pageRederive.js does not import the lane\'s fold');
    expect(out).toEqual([]);
  });
});
