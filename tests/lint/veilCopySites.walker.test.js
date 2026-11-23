/**
 * veilCopySites.walker.test.js — EVERY PLACE A NON-OWNER SURFACE COPIES A PAGE MODEL, REGISTERED (VEIL-VR17; the
 * sixth chair's ruling VR17 of 2026-11-19, from the security reader's commit 3da0516c7; vetoable by the owner).
 *
 * THE CLASS. A shut grouping's DERIVED blocks (Defense's criminal-structure label and ring note, read from house names
 * and the powers' roster the veil keeps) are silenced only by a signal beside the data. While that signal lived in a
 * WeakMap keyed by the page model OBJECT, every copy lost it: measured at bedd5a392, the gallery page and the party link
 * whenever the civility mask rewrote one string (gallery.js :: sanitizeDossier -> veilPublicPayload -> veilDeep rebuilds
 * the object), the campaign map's member (never marked), and any structuredClone / JSON round trip / spread of the page
 * model. The cure reads, on a visitor's page, the EVIDENCE IN THE DATA that a grouping is open (galleryVeil.js ::
 * GROUPING_OPEN_EVIDENCE: the keys its remover deletes and the generator always writes), so a copy of the data keeps
 * the signal by construction. What could still break it: a copy that RE-FILLS the removed keys (a normalizer's
 * defaults) and is then drawn on a visitor's page, or a derived-block reader with no evidence row.
 *
 * THE WALKER. Every copy idiom (structuredClone, deepClone, a JSON round trip, Object.assign, the civility rebuild
 * veilDeep / veilPublicPayload, the public projection toPublicSafe, normalizeSettlement, and a spread of a value named
 * like a page model) in every module a non-owner page model passes through is a SITE, `path :: symbol :: idiom`, and
 * must be REGISTERED below with its verdict:
 *   keeps          the copy carries the page model's data whole (no key re-filled); its idiom is EXECUTED below on a
 *                  projected page model: the grouping stays veiled on the copy, and open where it was open;
 *   before-veil    the copy is the projection's own INPUT: the page model is made after it;
 *   import-save    an import's send or save: the importer's OWN record, drawn as the owner's (no visitor inference),
 *                  so the derived block is drawn there from the facts the import carries (the hand-back's residual);
 *   own-record     print, PDF, journal and Foundry export run on the viewer's OWN saved record (an importer's copy
 *                  included), never on a page model;
 *   not-page-model the value copied is not a page model (a tile, React state, a style, a view-model row).
 * RED on a site not registered, on a registered site gone (stale), on a count that moved, on a `keeps` idiom whose
 * execution loses the signal, and on a reader of the signal (isVeiled) whose address has no evidence row or which
 * does not say its audience. A new surface module is added to SURFACE_ROOTS with its sites.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();

/** The modules a non-owner page model passes through, and the importer's own surfaces (scanned so a copy there is registered too). */
const SURFACE_ROOTS = Object.freeze([
  // the reads and the page model (a visitor reaches these)
  'src/lib/gallery.js', 'src/lib/galleryUnlisted.js', 'src/domain/display/galleryVeil.js',
  'src/components/PublicDossierView.jsx', 'src/components/PartyLinkView.jsx', 'src/components/gallery',
  'src/components/OutputContainer.jsx', 'src/components/new', 'src/components/dossier',
  // the import's send and save
  'src/store/galleryImportSettlement.js', 'src/store/galleryImportMap.js',
  // print, PDF, journal and Foundry export, Session Mode: the viewer's own saved record only
  'src/components/SettlementDetail.jsx', 'src/components/session', 'src/pdf', 'src/foundry', 'src/utils/generateSettlementPDF.js',
]);

/** The names a page model goes by in these modules (a spread of anything else is not a copy of one). */
const PAGE_MODEL_NAMES = 'settlement|propSettlement|rawSettlement|activeSettlement|s|r|src|record|town|page|dossier|member|sourceSettlement|pub|publicSettlement|source|saved|imported|payload|data|row';
const SITE_RE = new RegExp(String.raw`\b(structuredClone|deepClone|veilDeep|veilPublicPayload|toPublicSafe|normalizeSettlement|Object\.assign)\(|JSON\.parse\(\s*JSON\.stringify\(|\{\s*\.\.\.(${PAGE_MODEL_NAMES})\b`, 'g');
const DECL_RE = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function\s*\*?\s*([A-Za-z_$][\w$]*)|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=)/;

/**
 * The sites of one module's text: `{ key: '<path> :: <symbol> :: <idiom>', line }`, the symbol the nearest top-level
 * declaration above the site. Comment lines are not code.
 * @param {string} rel @param {string} text
 */
function sitesIn(rel, text) {
  const lines = text.split('\n');
  const out = [];
  for (const m of text.matchAll(SITE_RE)) {
    const line = text.slice(0, m.index).split('\n').length;
    const src = lines[line - 1];
    if (/^\s*(\/\/|\*|\/\*)/.test(src)) continue;
    let symbol = '(module)';
    for (let i = line - 1; i >= 0; i -= 1) {
      const d = DECL_RE.exec(lines[i]);
      if (d) { symbol = d[1] || d[2]; break; }
    }
    const idiom = m[1] || (m[2] ? `{ ...${m[2]} }` : 'JSON.parse(JSON.stringify(…))');
    out.push({ key: `${rel} :: ${symbol} :: ${idiom}`, line });
  }
  return out;
}

function filesUnder(rel) {
  const abs = join(ROOT, rel);
  if (!statSync(abs).isDirectory()) return [rel];
  return readdirSync(abs).flatMap((e) => filesUnder(`${rel}/${e}`));
}

/** Every site, counted by key. */
function scan() {
  /** @type {Map<string, number[]>} */
  const found = new Map();
  for (const root of SURFACE_ROOTS) {
    for (const rel of filesUnder(root).filter((f) => /\.(js|jsx|mjs)$/.test(f)).sort()) {
      for (const s of sitesIn(rel, readFileSync(join(ROOT, rel), 'utf8'))) {
        if (!found.has(s.key)) found.set(s.key, []);
        /** @type {number[]} */ (found.get(s.key)).push(s.line);
      }
    }
  }
  return found;
}

/**
 * THE REGISTER: every site, its count in its symbol, its verdict and why. `idiom` on a `keeps` row names the copy the
 * executed arm runs (spread, wrapper, rebuild).
 * @type {ReadonlyArray<{ key: string, n: number, verdict: 'keeps'|'before-veil'|'import-save'|'own-record'|'not-page-model', idiom?: string, why: string }>}
 */
const REGISTER = Object.freeze([
  // ── the reads (src/lib/gallery.js) ──
  { key: 'src/lib/gallery.js :: fetchDossierForImport :: veilPublicPayload', n: 1, verdict: 'import-save',
    why: "the import's SEND: the server's veiled `data` (the removal travels with it), never drawn as a visitor's page" },
  { key: 'src/lib/gallery.js :: stripImportConfidential :: { ...data }', n: 1, verdict: 'import-save',
    why: "the import's send: a shallow copy of the server's `data` before the seed and the DM scratch keys are deleted; no page model" },
  { key: 'src/lib/gallery.js :: fetchPublicDossier :: veilPublicPayload', n: 1, verdict: 'not-page-model',
    why: "the party link's author name alone (`{ authorName }`)" },
  { key: 'src/lib/gallery.js :: fetchPublicDossier :: { ...row }', n: 1, verdict: 'not-page-model',
    why: 'the RPC row handed to sanitizeDossier, which makes the page model after it' },
  { key: 'src/lib/gallery.js :: sanitizeTile :: veilPublicPayload', n: 1, verdict: 'not-page-model',
    why: 'a gallery tile: no settlement in it' },
  { key: 'src/lib/gallery.js :: sanitizeDossier :: veilPublicPayload', n: 1, verdict: 'keeps', idiom: 'rebuild',
    why: 'THE LOSS MEASURED AT bedd5a392: civility.js :: veilDeep rebuilds every object under a changed string, the page model included, and the WeakMap mark is gone; the rebuild copies every key, so the evidence in the data survives (executed below with a flagged word)' },
  { key: 'src/lib/gallery.js :: sanitizeDossier :: toPublicSafe', n: 1, verdict: 'before-veil',
    why: 'the projection of an unserved share: projectServedVeil runs on its output and writes the signal after it' },
  // ── the veil itself (src/domain/display/galleryVeil.js) ──
  { key: 'src/domain/display/galleryVeil.js :: applyVeil :: deepClone', n: 1, verdict: 'before-veil',
    why: "applyVeil's own working copy of its input: the removal is made on it, and the page model is its output" },
  { key: 'src/domain/display/galleryVeil.js :: projectShareVeil :: deepClone', n: 1, verdict: 'before-veil',
    why: "VEIL-21 (R2): an unmarked share's working copy: withholdAlways removes on it (212 :: _gallery_veil's unmarked body), and the page model is its output" },
  { key: 'src/domain/display/galleryVeil.js :: galleryPayloadFor :: toPublicSafe', n: 1, verdict: 'before-veil',
    why: "the OWNER's frozen public copy (a snapshot share), stored before any veil; every read veils it, and the removal is made on the read" },
  // ── the drawing surfaces ──
  { key: 'src/components/PartyLinkView.jsx :: PartyLinkView :: { ...dossier }', n: 1, verdict: 'keeps', idiom: 'wrapper',
    why: 'a shallow copy of the dossier WRAPPER (shareDm forced off): the page model is the same object (executed below)' },
  { key: 'src/components/new/tabs/EconomicsTab.jsx :: EconomicsTab :: { ...s }', n: 2, verdict: 'keeps', idiom: 'spread',
    why: "the foodways line's and the trade lists' input: a spread keeps every key (executed below); neither reader draws a veiled grouping" },
  { key: 'src/components/new/tabs/CrisisTab.jsx :: CastEditor :: { ...r }', n: 1, verdict: 'not-page-model',
    why: "the authoring draft's row state (`setRows`), an owner's editor surface" },
  { key: 'src/components/new/tabs/WhoRunsThisTownPanel.jsx :: WhoRunsThisTownPanel :: { ...row }', n: 1, verdict: 'not-page-model',
    why: 'a style object' },
  { key: 'src/components/gallery/GalleryHubPage.jsx :: GalleryHubContent :: { ...row }', n: 1, verdict: 'not-page-model',
    why: "a hub tile's vote count in React state" },
  // ── the import's save ──
  { key: 'src/store/galleryImportSettlement.js :: importGallerySettlementImpl :: normalizeSettlement', n: 1, verdict: 'import-save',
    why: "the importer's saved record, normalized: the importer's own copy, drawn as the owner's (the hand-back's residual)" },
  { key: 'src/store/galleryImportSettlement.js :: importGallerySettlementImpl :: { ...src }', n: 1, verdict: 'import-save',
    why: 'the same literal: the import payload spread into the saved record' },
  { key: 'src/store/galleryImportMap.js :: importGalleryMapWithCampaignImpl :: normalizeSettlement', n: 1, verdict: 'import-save',
    why: "a campaign member's saved record, normalized: the importer's own copy" },
  { key: 'src/store/galleryImportMap.js :: importGalleryMapWithCampaignImpl :: { ...sourceSettlement }', n: 1, verdict: 'import-save',
    why: "the same literal: the member's payload spread into the saved record" },
  // ── the viewer's own record: print, PDF, journal, Foundry export ──
  { key: 'src/utils/generateSettlementPDF.js :: generateSettlementPDF :: normalizeSettlement', n: 1, verdict: 'own-record',
    why: "the PDF of the viewer's own saved record (SettlementDetail): no page model reaches it; an importer's copy carries no signal by (2)" },
  { key: 'src/utils/generateSettlementPDF.js :: workerUnavailable :: Object.assign', n: 1, verdict: 'not-page-model',
    why: 'an Error object' },
  { key: 'src/foundry/generateFoundryModule.js :: generateFoundryModule :: normalizeSettlement', n: 1, verdict: 'own-record',
    why: "the Foundry module and journal of the viewer's own saved record (SettlementDetail)" },
  { key: 'src/foundry/journalPages.js :: crisisJournalPage :: { ...s }', n: 1, verdict: 'not-page-model',
    why: "a crisis journal section row of the viewer's own record" },
  { key: 'src/pdf/lib/viewModelBodySlices.js :: normalizeIncomeSources :: { ...s }', n: 2, verdict: 'not-page-model',
    why: "an income-source row of the PDF view model (the viewer's own record)" },
]);

const VERDICTS = new Set(['keeps', 'before-veil', 'import-save', 'own-record', 'not-page-model']);

describe('veilCopySites — every copy a non-owner surface makes of a page model is registered and keeps the signal (VR17)', () => {
  const found = scan();

  it('the register is well-formed: a known verdict and a reason on every row, no key twice, an idiom on every keeps row', () => {
    const keys = REGISTER.map((r) => r.key);
    expect(keys.length).toBe(new Set(keys).size);
    for (const r of REGISTER) {
      expect(VERDICTS.has(r.verdict), r.key).toBe(true);
      expect(r.why.length, r.key).toBeGreaterThan(10);
      if (r.verdict === 'keeps') expect(['spread', 'wrapper', 'rebuild'].includes(r.idiom || ''), r.key).toBe(true);
    }
  });

  it('every copy site in a surface module is registered, at its count (a new copy reds by name)', () => {
    const registered = new Map(REGISTER.map((r) => [r.key, r.n]));
    const unregistered = [...found].filter(([k]) => !registered.has(k)).map(([k, ls]) => `${k} (line ${ls.join(', ')})`);
    const moved = [...found].filter(([k, ls]) => registered.has(k) && registered.get(k) !== ls.length).map(([k, ls]) => `${k}: ${ls.length} found, ${registered.get(k)} registered`);
    expect({ unregistered, moved }).toEqual({ unregistered: [], moved: [] });
  });

  it('no registered site is stale (the register is the tree\'s, not history\'s)', () => {
    expect(REGISTER.filter((r) => !found.has(r.key)).map((r) => r.key)).toEqual([]);
  });

  it('the scan is live: it finds a planted copy of a page model, by every idiom, under its symbol', () => {
    const planted = [
      'export function drawIt(settlement) {',
      '  const a = structuredClone(settlement);',
      '  const b = JSON.parse(JSON.stringify(settlement));',
      '  const c = { ...settlement, x: 1 };',
      '  // const d = structuredClone(settlement);',
      '  return veilPublicPayload({ settlement: deepClone(a) });',
      '}',
    ].join('\n');
    expect(sitesIn('src/components/x.jsx', planted).map((s) => s.key)).toEqual([
      'src/components/x.jsx :: drawIt :: structuredClone',
      'src/components/x.jsx :: drawIt :: JSON.parse(JSON.stringify(…))',
      'src/components/x.jsx :: drawIt :: { ...settlement }',
      'src/components/x.jsx :: drawIt :: veilPublicPayload',
      'src/components/x.jsx :: drawIt :: deepClone',
    ]);
  });

  it('every reader of the signal names an address with evidence in the data, and says its audience', () => {
    const veilSrc = readFileSync(join(ROOT, 'src/domain/display/galleryVeil.js'), 'utf8');
    const evidence = new Set([...veilSrc.slice(veilSrc.indexOf('export const GROUPING_OPEN_EVIDENCE')).matchAll(/^ {2}'([a-z]+:[\w.]+)':/gm)].map((m) => m[1]));
    expect(evidence.size, 'the evidence table is read (the arm is live)').toBeGreaterThan(0);
    const offences = [];
    let readers = 0;
    for (const rel of filesUnder('src').filter((f) => /\.(js|jsx|mjs)$/.test(f) && f !== 'src/domain/display/galleryVeil.js')) {
      const text = readFileSync(join(ROOT, rel), 'utf8');
      for (const m of text.matchAll(/\bisVeiled\(([^)]*)\)/g)) {
        const line = text.slice(0, m.index).split('\n').length;
        if (/^\s*(\/\/|\*)/.test(text.split('\n')[line - 1])) continue;
        readers += 1;
        const address = /'([a-z]+:[\w.]+)'/.exec(m[1])?.[1];
        if (!address || !evidence.has(address)) offences.push(`${rel}:${line} reads ${address || 'a computed address'} with no GROUPING_OPEN_EVIDENCE row`);
        if (!/\{\s*publicDossier\b/.test(m[1])) offences.push(`${rel}:${line} does not say its audience ({ publicDossier })`);
      }
    }
    expect(readers, 'the readers are found (the arm is live)').toBeGreaterThan(0);
    expect(offences).toEqual([]);
  });

  it('EXECUTED: every keeps idiom keeps the signal on a projected page model; the open grouping stays open; the owner\'s read is unchanged', async () => {
    const veil = await import('../../src/domain/display/galleryVeil.js');
    const { veilPublicPayload } = await import('../../src/domain/display/publicSafe.js');
    const G = 'block:defense.criminalStructure';
    const town = { name: 'Copyford', tier: 'town', institutions: [{ name: 'The Rookery', category: 'criminal' }],
      economicState: { safetyProfile: { criminalInstitutions: ['The Rookery'], crimeTypes: [{ type: 'Theft', desc: 'A ring.' }] } } };
    const pageOf = (hidden) => veil.projectShareVeil(town, veil.writeShareVeil({}, [{ address: G, hidden }], { mode: 'live', at: '2026-11-20T00:00:00.000Z' }));
    /** @param {any} page */
    const copiesOf = (page) => ({
      spread: { ...page },
      wrapper: { ...{ settlement: page, shareDm: true }, shareDm: false }.settlement,
      rebuild: veilPublicPayload({ settlement: { ...page, name: 'Copyford shit' } }).settlement,
      structuredClone: structuredClone(page),
      json: JSON.parse(JSON.stringify(page)),
    });
    const shut = pageOf(true);
    const open = pageOf(false);
    expect([veil.isVeiled(shut, G), veil.isVeiled(open, G)]).toEqual([true, false]);
    const shutCopies = copiesOf(shut);
    expect(shutCopies.rebuild.name, 'the civility rebuild ran (the arm is live)').not.toContain('shit');
    // THE CLASS, as it stood: the list beside the object does not survive a copy
    expect(veil.isVeiled(shutCopies.structuredClone, G)).toBe(false);
    for (const [idiom, copy] of Object.entries(shutCopies)) expect(veil.isVeiled(copy, G, { publicDossier: true }), `${idiom}: shut stays shut`).toBe(true);
    for (const [idiom, copy] of Object.entries(copiesOf(open))) expect(veil.isVeiled(copy, G, { publicDossier: true }), `${idiom}: open stays open`).toBe(false);
    for (const r of REGISTER.filter((x) => x.verdict === 'keeps')) expect(Object.keys(shutCopies), r.key).toContain(r.idiom);
    // the served path (211's marker, no client remover run) reads the same
    const served = veil.projectServedVeil(shut, { $veil: { v: 2, mode: 'live', groupings: [G] } });
    expect(veil.isVeiled(structuredClone(served), G, { publicDossier: true })).toBe(true);
    // a visitor's page model with no evidence at all withholds; the owner's own record is read as before
    expect(veil.isVeiled({ name: 'Bare' }, G, { publicDossier: true })).toBe(true);
    expect(veil.isVeiled({ name: 'Bare' }, G)).toBe(false);
    expect(veil.isVeiled(structuredClone(shut), G)).toBe(false);
  });
});
