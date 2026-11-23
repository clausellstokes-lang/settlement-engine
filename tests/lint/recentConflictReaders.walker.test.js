/**
 * recentConflictReaders.walker.test.js — EVERY READER OF THE RECENT-CONFLICT SENTENCE, REGISTERED (R5-RECENT's cure,
 * second half; the chair's E92 (2), (5), E93 and E97 (1) of 2026-11-22, vetoable by the owner; brief R5C6 item 5; on
 * tests/lint/crimeTypesReaders.walker.test.js's pattern; written by VEIL-33's V33-R5C6).
 *
 * THE LAW. `powerStructure.recentConflict`, THE KEY ITSELF, is on NO shared read of ANY place (212 ::
 * _gallery_veil_withhold_always and the twin galleryWithholdAlways.js :: withholdAlways, `registry: power.recentConflict`),
 * and with it its COPY, the top-level `pressureSentence` wherever it equals the stored sentence (`registry:
 * power.recentConflict.pressureSentence`, E97 (1)). ONE reader re-derives the sentence from the document in hand by the
 * engine's own writer (src/domain/veil/pageRederive.js :: rederiveRecentConflict: generatePowerStructure, which calls
 * governanceNarrative.js :: buildGovernanceLabels, over the served page: reader B, E93). The page calls it through
 * rederiveForPage at both of its doors (src/lib/gallery.js :: sanitizeDossier for the gallery page and the party link,
 * fetchGalleryMap for the map's member) and the import's save through importRederive.js :: rederiveInPlace
 * (authoritative), so every shared surface reads ONE derived sentence. The page does NOT re-fill `pressureSentence`
 * (E97 (1)): the reader never names it.
 *
 * THE WALKER: every code line of every module under src/ that names `recentConflict` (a word; comment lines are not code)
 * is a SITE `path :: top-level symbol` with its count, REGISTERED below with its verdict:
 *   one-reader  the ONE reader itself;
 *   veil        the share veil's own engine (it withholds the key, or judges a copy against it before it leaves);
 *   page-copy   runs on a SHARED document (the gallery page, the party link, the map's member): it reads the page's own
 *               copy, on which the ONE reader put the sentence back (or left none, where the engine cannot read it);
 *   own-record  print and PDF: the viewer's OWN saved record (an importer's copy is the save the import re-derived);
 *   owner-only  the birth, the play-time transfer or the owner's editor: never on a shared document, BY CONSTRUCTION
 *               (the written reason);
 *   not-a-read  the word in a string, a table key or a comment-like line that reads nothing.
 * RED on a site not registered, on a registered site gone (stale), on a count that moved; on THE ONE READER missing, not
 * wired at a door, or re-filling `pressureSentence`; and on THE KEY SHIPPING (an always-host, server or twin, that does not
 * withhold it or its copy; the registry row not `when: 'always'`, `page: 're-derive'`, or its copy row gone).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { REGISTRY_ROWS } from '../../src/domain/veil/rosterChoiceRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const WORD = /\brecentConflict\b/g;
const DECL_RE = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)/;
/** Modules not scanned, each with its reason. */
const NOT_SCANNED = Object.freeze({
  'src/domain/veil/rosterChoiceRegistry.js': 'the registry itself: it names the rows (`power.recentConflict`, its copy) and their chooser sites, and reads no document',
});
const PDF_WHY = 'the PDF view model runs on the viewer\'s OWN saved record (SettlementDetail :: ExportSheet); a shared page mounts OutputContainer read-only, which offers no export; an importer\'s record is the save importRederive.js re-derived through the ONE reader';
const BIRTH_WHY = 'the birth: the generator writes or reads the sentence on the record it is generating, never on a served document';

/** @type {Readonly<Record<string, { n: number, verdict: 'one-reader' | 'veil' | 'page-copy' | 'own-record' | 'owner-only' | 'not-a-read', why?: string }>>} */
const REGISTER = Object.freeze({
  'src/domain/veil/pageRederive.js :: rederiveRecentConflict': { n: 4, verdict: 'one-reader' },
  'src/domain/display/galleryWithholdAlways.js :: withholdAlways': { n: 3, verdict: 'veil', why: 'withholds the key on every non-owner read, and its pressureSentence copy where equal (registry: power.recentConflict, power.recentConflict.pressureSentence)' },
  'src/domain/display/gallerySecondHomes.js :: withholdSecondHomes': { n: 2, verdict: 'veil', why: 'the second-homes pass judges pressureSentence against the stored sentence (not recentConflict: one of its special cases), on the document as passed in' },
  'src/components/new/SummaryTab.jsx :: characterSentence': { n: 5, verdict: 'page-copy' },
  'src/components/new/SummaryTab.jsx :: SummaryTab': { n: 2, verdict: 'page-copy' },
  'src/components/new/tabs/RelationshipsTab.jsx :: RelationshipsTab': { n: 1, verdict: 'page-copy' },
  'src/domain/display/governanceAccount.js :: governanceAccountOf': { n: 1, verdict: 'page-copy' },
  'src/domain/display/guardLineUnderTheLaw.js :: familiesHeldOf': { n: 2, verdict: 'page-copy' },
  'src/domain/display/stateProse/powerStateProse.js :: stabilityLensPoolKey': { n: 3, verdict: 'page-copy' },
  'src/domain/display/stateProse/powerStateProse.js :: powerStateProse': { n: 1, verdict: 'page-copy' },
  'src/pdf/lib/viewModel.js :: powerSlice': { n: 2, verdict: 'own-record', why: PDF_WHY },
  'src/generators/power/rulingStructure.js :: generatePowerStructure': { n: 3, verdict: 'owner-only', why: 'THE WRITER\'s caller: the birth, and the engine the ONE reader runs over a served page (its output read by the reader alone)' },
  'src/generators/power/governanceNarrative.js :: buildGovernanceLabels': { n: 7, verdict: 'owner-only', why: 'THE WRITER (the baseline sentence), run at birth and by the ONE reader through generatePowerStructure' },
  'src/generators/factionDynamics.js :: boycottReadsRelation': { n: 6, verdict: 'owner-only', why: 'the writer\'s settlement of the boycott line by the pair\'s relation row, run by generatePowerStructure' },
  'src/domain/rulingPower.js :: transferRulingPower': { n: 1, verdict: 'owner-only', why: 'the second writer: a transfer of the seat at play on the owner\'s own record (E93 (3): its sentence is not re-derived; the page prints the baseline)' },
  'src/generators/historyGenerator.js :: buildHistoryContext': { n: 3, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/narrativeGenerator.js :: genPressureDetail': { n: 2, verdict: 'owner-only', why: BIRTH_WHY },
  'src/generators/narrativeGenerator.js :: generatePressureSentence': { n: 2, verdict: 'owner-only', why: 'the birth: the pressure sentence\'s fallback COPIES the sentence (E97 (1); registry power.recentConflict.pressureSentence)' },
  'src/domain/factionRename.js :: FACTION_RENAME_SURFACES': { n: 1, verdict: 'owner-only', why: 'the owner\'s rename of a power on the owner\'s own record (a surface table)' },
  'src/domain/factionRename.js :: applyFactionRenameToSettlement': { n: 2, verdict: 'owner-only', why: 'the owner\'s rename of a power, rewriting the sentence on the owner\'s own record' },
  'src/components/new/tabs/PowerTab.jsx :: PowerTab': { n: 1, verdict: 'not-a-read', why: 'a JSX comment ({/* ... */}) recording where the vignette left the box' },
  'src/domain/prose/holderTable.js :: HOLDER_SOURCES': { n: 1, verdict: 'not-a-read', why: 'the holder table\'s key (an instrument citing the writer); it reads no document' },
  'src/data/dossierStateProse/power.generated.js :: DOSSIER_STATE_PROSE_POWER': { n: 3, verdict: 'not-a-read', why: 'a prose spec\'s title and pool key strings' },
  'src/data/proseNorms.generated.js :: DOSSIER_PROSE_NORMS': { n: 1, verdict: 'not-a-read', why: 'a prose norm\'s key string' },
});

/** @param {string} d @returns {string[]} */
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : /\.(m?js|jsx)$/.test(n) ? [p] : []; });

/** Every site of src/: { '<path> :: <symbol>': count }. */
function census() {
  /** @type {Record<string, number>} */ const out = {};
  for (const f of walk(join(ROOT, 'src'))) {
    const rel = relative(ROOT, f).split('\\').join('/');
    if (Object.prototype.hasOwnProperty.call(NOT_SCANNED, rel)) continue;
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
/** The body of a 212 function, or null. */
function sqlBody(sql, name) {
  const m = new RegExp(`^create or replace function public\\.${name}\\(`, 'm').exec(sql);
  if (!m) return null;
  const i = m.index;
  const j = sql.indexOf('end $$;', i);
  return j < 0 ? null : sql.slice(i, j);
}
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
/** A body's code lines alone (comment lines dropped), so a word in a comment cannot satisfy or red a code check. */
const codeOf = (body) => body.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l)).join('\n');

describe('the judgment proves itself on a synthetic source (its own controls)', () => {
  it('declBody finds a top-level body to the next declaration; codeOf drops comment lines', () => {
    const src = 'export function a(x) {\n  // recentConflict in a comment\n  return x.recentConflict;\n}\nconst b = 1;\n';
    expect(declBody(src, 'a')).toBe('export function a(x) {\n  // recentConflict in a comment\n  return x.recentConflict;\n}');
    expect(declBody(src, 'nowhere')).toBeNull();
    expect((codeOf(declBody(src, 'a') || '').match(WORD) || []).length).toBe(1);
  });
});

describe('R5-RECENT: every reader of the recent-conflict sentence, registered', () => {
  it('every site is registered with its count; none is stale; each owner-only, own-record, veil and not-a-read site gives its reason', () => {
    const got = census();
    expect(Object.keys(got).length, 'the census is not vacuous').toBeGreaterThanOrEqual(15);
    const unregistered = Object.entries(got).filter(([k]) => !REGISTER[k]).map(([k, n]) => `${k} (${n}): not registered`);
    const stale = Object.keys(REGISTER).filter((k) => !got[k]).map((k) => `${k}: registered, not found`);
    const moved = Object.entries(REGISTER).filter(([k, r]) => got[k] && got[k] !== r.n).map(([k, r]) => `${k}: count ${got[k]}, registered ${r.n}`);
    const reasonless = Object.entries(REGISTER).filter(([, r]) => ['owner-only', 'own-record', 'veil', 'not-a-read'].includes(r.verdict) && !(r.why && r.why.length > 20)).map(([k]) => `${k}: no written reason`);
    expect({ unregistered, stale, moved, reasonless }).toEqual({ unregistered: [], stale: [], moved: [], reasonless: [] });
  });

  it('THE ONE READER exists, runs the engine\'s own writer, never re-fills pressureSentence, and is wired at every door: rederiveForPage (the gallery page, the party link, the map\'s member) and the import\'s save (authoritative)', () => {
    const out = [];
    const page = read('src/domain/veil/pageRederive.js');
    const reader = declBody(page, 'rederiveRecentConflict');
    if (reader === null) out.push('pageRederive.js :: rederiveRecentConflict: no such top-level declaration');
    else {
      if (!/export function rederiveRecentConflict\(/.test(reader)) out.push('rederiveRecentConflict is not exported');
      if (!codeOf(reader).includes('generatePowerStructure(')) out.push('rederiveRecentConflict does not call generatePowerStructure');
      if (/\bpressureSentence\b/.test(codeOf(reader))) out.push('rederiveRecentConflict names pressureSentence (E97 (1): the page does not re-fill it)');
    }
    if (!/import \{[^}]*\bgeneratePowerStructure\b[^}]*\} from '\.\.\/\.\.\/generators\/power\/rulingStructure\.js'/.test(page)) out.push('pageRederive.js does not import generatePowerStructure from the engine\'s own module');
    if (!codeOf(declBody(page, 'rederiveForPage') || '').includes('rederiveRecentConflict(')) out.push('rederiveForPage does not call rederiveRecentConflict');
    const imp = read('src/domain/veil/importRederive.js');
    if (!/import \{[^}]*\brederiveRecentConflict\b[^}]*\} from '\.\/pageRederive\.js'/.test(imp)) out.push('importRederive.js does not import rederiveRecentConflict from ./pageRederive.js');
    if (!/rederiveRecentConflict\(s, \{ authoritative: true \}\)/.test(codeOf(declBody(imp, 'rederiveInPlace') || ''))) out.push('importRederive.js :: rederiveInPlace does not call rederiveRecentConflict(s, { authoritative: true })');
    const gallery = read('src/lib/gallery.js');
    for (const door of ['fetchGalleryMap', 'sanitizeDossier']) if (!(declBody(gallery, door) || '').includes('rederiveForPage(')) out.push(`gallery.js :: ${door} does not call rederiveForPage`);
    expect(out).toEqual([]);
  });

  it('THE KEY NEVER SHIPS: both always-hosts withhold it and its pressureSentence copy; the registry row is withheld always and re-derived by the page; the copy row stands', () => {
    const out = [];
    const sql = read('supabase/migrations/212_share_veil_later_cures.sql');
    const always = sqlBody(sql, '_gallery_veil_withhold_always') || '';
    for (const id of ['power.recentConflict', 'power.recentConflict.pressureSentence']) if (!always.includes(`-- registry: ${id}\n`)) out.push(`212 :: _gallery_veil_withhold_always does not name ${id}`);
    if (!/_gallery_veil_minus_at\(s, '\{powerStructure\}', array\['recentConflict'\]\)/.test(always)) out.push('212 :: _gallery_veil_withhold_always does not withhold powerStructure.recentConflict');
    if (!/s := s - 'pressureSentence'/.test(always)) out.push('212 :: _gallery_veil_withhold_always does not withhold the pressureSentence copy');
    const twin = declBody(read('src/domain/display/galleryWithholdAlways.js'), 'withholdAlways') || '';
    for (const id of ['power.recentConflict', 'power.recentConflict.pressureSentence']) if (!twin.includes(`// registry: ${id}\n`)) out.push(`galleryWithholdAlways.js :: withholdAlways does not name ${id}`);
    if (!/minusAt\(s, \['powerStructure'\], \['recentConflict'\]\)/.test(twin)) out.push('galleryWithholdAlways.js :: withholdAlways does not withhold powerStructure.recentConflict');
    if (!/delete s\.pressureSentence/.test(twin)) out.push('galleryWithholdAlways.js :: withholdAlways does not withhold the pressureSentence copy');
    const row = REGISTRY_ROWS.find((r) => r.id === 'power.recentConflict');
    if (!row) out.push('the registry has no row power.recentConflict');
    else if (row.rule !== 'withhold' || row.when !== 'always' || row.page !== 're-derive' || !row.built || (row.inputs || []).length) out.push(`the registry row power.recentConflict is ${row.rule}/${row.when}/page ${row.page}/built ${row.built}/inputs ${JSON.stringify(row.inputs)}`);
    const copy = REGISTRY_ROWS.find((r) => r.id === 'power.recentConflict.pressureSentence');
    if (!copy || copy.copyOf !== 'power.recentConflict') out.push('the registry has no copy row power.recentConflict.pressureSentence (copyOf power.recentConflict)');
    expect(out).toEqual([]);
  });
});
