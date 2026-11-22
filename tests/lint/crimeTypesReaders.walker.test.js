/**
 * crimeTypesReaders.walker.test.js — EVERY READER OF THE CRIME LIST, REGISTERED (R3-TELL-8 unit (viii); the eighth chair's
 * ruling (b) of 2026-11-22 05:15 UTC, "THE OTHER WAY", vetoable by the owner; brief R3-TELL-8 step 2 (iii)).
 *
 * THE LAW. `economicState.safetyProfile.crimeTypes`, THE KEY ITSELF, is on NO shared read of ANY place (212 ::
 * _gallery_veil_withhold_always and the twin galleryWithholdAlways.js :: withholdAlways, `registry: safety.crimeTypes`), and
 * ONE reader derives the list from the document in hand by the engine's own writer (src/domain/veil/pageRederive.js ::
 * rederiveCrimeTypes: generateSafetyProfile then settleCrimeLinesToSignal over the served page), only where the served data
 * proves the types' grouping open. The page calls it through rederiveForPage at both of its doors (src/lib/gallery.js ::
 * sanitizeDossier for the gallery page and the party link, fetchGalleryMap for the map's member) and the import's save
 * through importRederive.js :: rederiveInPlace, so every shared surface reads ONE derived list.
 *
 * THE WALKER, in the door walker's shape (tests/lint/veilCopySites.walker.test.js): every code line of every module under
 * src/ that names `crimeTypes` (a word; comment lines are not code) is a SITE `path :: top-level symbol` with its count, and
 * is REGISTERED below with its verdict:
 *   one-reader  the ONE reader itself;
 *   veil        the share veil's own engine (it withholds the key, removes it with its grouping, or reads `pub`, the
 *               projection the veil ran on, which is the owner's input to the veil and never leaves it);
 *   page-copy   runs on a SHARED document (the gallery page, the party link, the map's member): it reads the page's own
 *               copy, on which the ONE reader put the list back (or left none, where the grouping is not proven open);
 *   own-record  print, PDF, journal and Foundry export: the viewer's OWN saved record (an importer's copy is the save the
 *               import re-derived), never a page model (PublicDossierView mounts OutputContainer read-only, with no export);
 *   owner-only  the birth, the editor's register or the owner's AI layer: never on a shared document, BY CONSTRUCTION (the
 *               written reason);
 *   not-a-read  the word in a string that reads nothing.
 * RED on a site not registered, on a registered site gone (stale), on a count that moved; on THE ONE READER missing or not
 * wired at a door; and on THE KEY SHIPPING (an always-host, server or twin, that does not withhold it; the R3 attribution
 * block left behind as a false assurance, ruling 59; the registry row not `when: 'always'`, `page: 're-derive'`).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { REGISTRY_ROWS } from '../../src/domain/veil/rosterChoiceRegistry.js';

const ROOT = process.cwd();
const WORD = /\bcrimeTypes\b/g;
const DECL_RE = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)/;
/** Modules not scanned, each with its reason. */
const NOT_SCANNED = Object.freeze({
  'src/domain/veil/rosterChoiceRegistry.js': 'the registry itself: it names the row (`safety.crimeTypes`) and its chooser sites, and reads no document',
});
const PDF_WHY = 'the PDF view model and its sections run on the viewer\'s OWN saved record (SettlementDetail :: ExportSheet); a shared page mounts OutputContainer read-only, which offers no export; an importer\'s record is the save importRederive.js re-derived through the ONE reader';

/** @type {Readonly<Record<string, { n: number, verdict: 'one-reader' | 'veil' | 'page-copy' | 'own-record' | 'owner-only' | 'not-a-read', why?: string }>>} */
const REGISTER = Object.freeze({
  'src/domain/veil/pageRederive.js :: rederiveCrimeTypes': { n: 3, verdict: 'one-reader' },
  'src/domain/display/galleryWithholdAlways.js :: withholdAlways': { n: 1, verdict: 'veil', why: 'withholds the key on every non-owner read (registry: safety.crimeTypes)' },
  'src/domain/display/galleryVeil.js :: GROUPING_REMOVERS': { n: 1, verdict: 'veil', why: 'the types\' grouping\'s remover (the server\'s _gallery_veil_grouping deletes the same key)' },
  'src/domain/display/galleryRosterChoices.js :: applyRosterChoices': { n: 1, verdict: 'veil', why: 'the services rule reads `pub`\'s list (the projection the veil ran on) by CRIME_TYPE_RAISERS: the owner\'s input to the veil, never sent' },
  'src/components/new/tabs/DefenseTab.jsx :: DefenseTab': { n: 4, verdict: 'page-copy' },
  'src/components/new/tabs/EconomicsTab.jsx :: EconomicsTab': { n: 3, verdict: 'page-copy' },
  'src/components/new/dailyLifeLogic.js :: extractSettlementContext': { n: 4, verdict: 'page-copy' },
  'src/domain/display/defenseDisplay.js :: blockListsCrime': { n: 2, verdict: 'page-copy' },
  'src/domain/display/defenseDisplay.js :: ringNoteUnderStreetFighting': { n: 3, verdict: 'page-copy' },
  'src/domain/display/shadowEconomyShown.js :: criminalsStandHere': { n: 1, verdict: 'page-copy' },
  'src/pdf/lib/viewModelBodySlices.js :: economicsSlice': { n: 3, verdict: 'own-record', why: PDF_WHY },
  'src/pdf/lib/viewModelBodySlices.js :: defenseSlice': { n: 2, verdict: 'own-record', why: PDF_WHY },
  'src/pdf/sections/DefenseSecurity.jsx :: DefenseSecurity': { n: 3, verdict: 'own-record', why: PDF_WHY },
  'src/pdf/sections/EconomicsTrade.jsx :: EconomicsTrade': { n: 3, verdict: 'own-record', why: PDF_WHY },
  'src/generators/safetyProfile.js :: generateSafetyProfile': { n: 20, verdict: 'owner-only', why: 'THE WRITER: the birth, and the engine the ONE reader runs over a served page' },
  'src/generators/safetyProfile.js :: settleCrimeLinesOnly': { n: 2, verdict: 'owner-only', why: 'the writer\'s settlement (settleCrimeLinesToSignal), run at birth and by the ONE reader' },
  'src/generators/servicesGenerator.js :: generateAvailableServices': { n: 9, verdict: 'owner-only', why: 'the birth: the services menu over the record\'s own list' },
  'src/generators/generationCoherence.js :: projectionAgreementFindings': { n: 6, verdict: 'owner-only', why: 'the birth\'s coherence audit over the generated record' },
  'src/generators/aiLayer.js :: extractFullContext': { n: 2, verdict: 'owner-only', why: 'the owner\'s AI layer over the owner\'s record' },
  'src/generators/aiLayer.js :: buildAiLayerPrompt': { n: 2, verdict: 'owner-only', why: 'the owner\'s AI layer\'s prompt' },
  'src/domain/edit/recordRegister.js :: KEYED_COLLECTIONS': { n: 1, verdict: 'owner-only', why: 'the editor\'s register of the owner\'s own record (a path key)' },
  'src/data/dossierStateProse/economy.generated.js :: DOSSIER_STATE_PROSE_ECONOMY': { n: 1, verdict: 'not-a-read', why: 'a prose spec\'s title string' },
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

describe('R3-TELL-8 (viii): every reader of the crime list, registered', () => {
  it('every site is registered with its count; none is stale; each owner-only, own-record, veil and not-a-read site gives its reason', () => {
    const got = census();
    const unregistered = Object.entries(got).filter(([k]) => !REGISTER[k]).map(([k, n]) => `${k} (${n}): not registered`);
    const stale = Object.keys(REGISTER).filter((k) => !got[k]).map((k) => `${k}: registered, not found`);
    const moved = Object.entries(REGISTER).filter(([k, r]) => got[k] && got[k] !== r.n).map(([k, r]) => `${k}: count ${got[k]}, registered ${r.n}`);
    const reasonless = Object.entries(REGISTER).filter(([, r]) => ['owner-only', 'own-record', 'veil', 'not-a-read'].includes(r.verdict) && !(r.why && r.why.length > 20)).map(([k]) => `${k}: no written reason`);
    expect({ unregistered, stale, moved, reasonless }).toEqual({ unregistered: [], stale: [], moved: [], reasonless: [] });
  });

  it('THE ONE READER exists and is wired at every door: rederiveForPage (the gallery page, the party link, the map\'s member) and the import\'s save', () => {
    const out = [];
    const page = read('src/domain/veil/pageRederive.js');
    const reader = declBody(page, 'rederiveCrimeTypes');
    if (reader === null) out.push('pageRederive.js :: rederiveCrimeTypes: no such top-level declaration');
    else {
      if (!/export function rederiveCrimeTypes\(/.test(reader)) out.push('rederiveCrimeTypes is not exported');
      for (const w of ['generateSafetyProfile(', 'settleCrimeLinesToSignal(', 'criminalInstitutions']) if (!reader.includes(w)) out.push(`rederiveCrimeTypes does not call or read ${w}`);
    }
    if (!(declBody(page, 'rederiveForPage') || '').includes('rederiveCrimeTypes(')) out.push('rederiveForPage does not call rederiveCrimeTypes');
    const imp = read('src/domain/veil/importRederive.js');
    if (!/import \{[^}]*\brederiveCrimeTypes\b[^}]*\} from '\.\/pageRederive\.js'/.test(imp)) out.push('importRederive.js does not import rederiveCrimeTypes from ./pageRederive.js');
    if (!(declBody(imp, 'rederiveInPlace') || '').includes('rederiveCrimeTypes(')) out.push('importRederive.js :: rederiveInPlace does not call rederiveCrimeTypes');
    const gallery = read('src/lib/gallery.js');
    for (const door of ['fetchGalleryMap', 'sanitizeDossier']) if (!(declBody(gallery, door) || '').includes('rederiveForPage(')) out.push(`gallery.js :: ${door} does not call rederiveForPage`);
    expect(out).toEqual([]);
  });

  it('THE KEY NEVER SHIPS: both always-hosts withhold it; the R3 attribution block has left both engines; the registry row is withheld always and re-derived by the page', () => {
    const out = [];
    const sql = read('supabase/migrations/212_share_veil_later_cures.sql');
    const always = sqlBody(sql, '_gallery_veil_withhold_always') || '';
    if (!always.includes('-- registry: safety.crimeTypes')) out.push('212 :: _gallery_veil_withhold_always does not name safety.crimeTypes');
    if (!/'\{economicState,safetyProfile\}', array\[[^\]]*'crimeTypes'/.test(always)) out.push('212 :: _gallery_veil_withhold_always does not withhold economicState.safetyProfile.crimeTypes');
    const twin = declBody(read('src/domain/display/galleryWithholdAlways.js'), 'withholdAlways') || '';
    if (!twin.includes('// registry: safety.crimeTypes')) out.push('galleryWithholdAlways.js :: withholdAlways does not name safety.crimeTypes');
    if (!/minusAt\(s, \['economicState', 'safetyProfile'\], \[[^\]]*'crimeTypes'/.test(twin)) out.push('galleryWithholdAlways.js :: withholdAlways does not withhold economicState.safetyProfile.crimeTypes');
    if ((sqlBody(sql, '_gallery_veil_roster_choices') || '').includes('-- registry: safety.crimeTypes')) out.push('212 :: _gallery_veil_roster_choices still names safety.crimeTypes (the attribution block: a false assurance, ruling 59)');
    if ((declBody(read('src/domain/display/galleryRosterChoices.js'), 'applyRosterChoices') || '').includes('// registry: safety.crimeTypes')) out.push('galleryRosterChoices.js :: applyRosterChoices still names safety.crimeTypes');
    const row = REGISTRY_ROWS.find((r) => r.id === 'safety.crimeTypes');
    if (!row) out.push('the registry has no row safety.crimeTypes');
    else if (row.rule !== 'withhold' || row.when !== 'always' || row.page !== 're-derive' || !row.built) out.push(`the registry row safety.crimeTypes is ${row.rule}/${row.when}/page ${row.page}/built ${row.built}`);
    expect(out).toEqual([]);
  });
});
