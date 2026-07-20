/**
 * generateWorldBook.js — R-4 THE WORLD BOOK: the bound-book export.
 *
 * One printable artifact that binds a campaign's whole world: a cover, the
 * chronicle of what happened, a dossier for every settlement, the realm's
 * connective map, the state of the realm, and a receipts appendix tracing the
 * forces between places. The keepsake a DM gifts and a table treasures.
 *
 * RIDES THE jsPDF IMPERATIVE IDIOM (the same hand-painted, deterministic, vector
 * path as generateCampaignPDF.js) — NEVER @react-pdf/renderer, never byte
 * comparisons (the react-pdf tree in src/pdf/** is the other engine; do not cross
 * them). The one nondeterministic byte in any jsPDF cover is the generation date;
 * it is INJECTABLE here (opts.now) so a fixed fixture renders reproducibly, and the
 * pins walk the COLLECTOR's structure (collectWorldBook), not painter bytes.
 *
 * TWO FACES (the secrets seam as a display mode): mode:'dm' binds everything;
 * mode:'player' projects each settlement through toPublicSafe and drops covert
 * history — the party gets the world as its inhabitants know it, never the DM's
 * ledger. The player-safe pin proves no covert mark survives.
 *
 * Lazy: reached only through a dynamic import on user action (jsPDF is ~200KB), so
 * it never touches first paint.
 */
import { jsPDF } from 'jspdf';
import { formatCount } from '../domain/formatNumber.js';
import { truncateAtWord } from '../lib/text.js';
import { getAllModifiers } from '../lib/relationshipGraph.js';
import { autoLayout } from './graphLayout.js';
import { toPublicSafe } from '../domain/display/publicSafe.js';
import { collectRealmSummary } from './generateCampaignPDF.js';

// ── Page geometry + palette (mirrors the campaign PDF) ───────────────────────────
const PW = 210, PH = 297;
const ML = 14, MR = 14, MT = 14, MB = 14;
const CW = PW - ML - MR;
const BOT = PH - MB;

const INK   = [28,  20,  9];
const PARCH = [250, 244, 232];
const CREAM = [245, 237, 224];
const TAN   = [200, 184, 154];
const GOLD  = [160, 118, 42];
const BROWN = [107, 83,  48];
const MUTED = [140, 120, 90];

// ── jsPDF helpers (the campaign-PDF idiom) ───────────────────────────────────────
const sf = (d, c) => d.setFillColor(c[0], c[1], c[2]);
const sd = (d, c) => d.setDrawColor(c[0], c[1], c[2]);
const st = (d, c) => d.setTextColor(c[0], c[1], c[2]);
function rect(d, x, y, w, h, fill, stroke = null) {
  sf(d, fill);
  if (stroke) { sd(d, stroke); d.setLineWidth(0.25); d.rect(x, y, w, h, 'FD'); }
  else d.rect(x, y, w, h, 'F');
}
function hline(d, x1, y, x2, clr = TAN, lw = 0.2) { sd(d, clr); d.setLineWidth(lw); d.line(x1, y, x2, y); }
function s(v) {
  // eslint-disable-next-line no-control-regex
  return String(v || '').replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, ' ').replace(/\s+/g, ' ').trim();
}
function wrap(d, text, maxW, fontSize) { d.setFontSize(fontSize); return d.splitTextToSize(s(text), maxW); }
function clampLines(lines, maxLines) {
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  if (kept.length) kept[kept.length - 1] += '...';
  return kept;
}
function secBar(d, y, label, clr = INK) {
  const bh = 6;
  rect(d, ML, y, CW, bh, clr);
  d.setFont('helvetica', 'bold'); d.setFontSize(8); st(d, [255, 255, 255]);
  d.text(s(label).toUpperCase(), ML + 3, y + 4.2);
  return y + bh + 3;
}
function footer(d, title, pageN) {
  d.setFont('helvetica', 'italic'); d.setFontSize(7); st(d, MUTED);
  d.text(s(title), ML, PH - 5);
  const right = `Page ${pageN}`;
  const w = d.getStringUnitWidth(right) * 7 / d.internal.scaleFactor;
  d.text(right, PW - MR - w, PH - 5);
}
function ensureSpace(d, y, h, title, pageN) {
  if (y + h < BOT) return { y, pageN };
  footer(d, title, pageN);
  d.addPage();
  return { y: MT, pageN: pageN + 1 };
}

// ─────────────────────────────────────────────────────────────────────────────
// THE COLLECTOR — pure, deterministic, unit-testable book model.
// ─────────────────────────────────────────────────────────────────────────────

/** A wizard-news entry is covert iff it is flagged so or tagged concealed/covert. */
function isCovertEntry(e) {
  if (!e) return true;
  if (e.covert === true) return true;
  const tags = Array.isArray(e.tags) ? e.tags : [];
  return tags.includes('covert') || tags.includes('concealed');
}

/** Build one settlement's dossier model. In player mode `st_` is already the
 *  public-safe projection (secrets/hooks/dmNotes stripped by toPublicSafe). */
function buildDossierEntry(save, st_, player) {
  const inst = Array.isArray(st_.institutions) ? st_.institutions : [];
  const npcs = Array.isArray(st_.npcs) ? st_.npcs : [];
  const hist = st_.history || {};
  const overview = hist.historicalCharacter || hist.arrivalScene || hist.pressureSentence || '';
  // Plot hooks are DM content — present only in DM mode (toPublicSafe drops them,
  // but guard here too so the collector is honest without depending on the projector).
  const rawHooks = Array.isArray(st_.plotHooks) ? st_.plotHooks : (Array.isArray(st_.hooks) ? st_.hooks : []);
  const hooks = player ? [] : rawHooks.map(h => (typeof h === 'string' ? h : h?.text || h?.title || '')).filter(Boolean);
  return {
    id: save.id,
    name: st_.name || save.name || 'Unnamed',
    tier: st_.tier || '',
    population: Number(st_.population) || 0,
    culture: st_.culture || '',
    overview: String(overview || ''),
    institutions: inst.map(i => i?.name || i?.type || '').filter(Boolean),
    npcs: npcs.map(n => ({ name: n?.name || '', role: n?.role || '', influence: player ? null : (n?.influence ?? null) })),
    hooks,
  };
}

/** The realm's connective map: nodes (settlements) + edges (neighbour links). */
function buildMapModel(members) {
  const nodes = members.map(m => ({
    id: String(m.id),
    name: m.settlement?.name || m.name || String(m.id),
    tier: m.settlement?.tier || '',
  }));
  const nodeIds = new Set(nodes.map(n => n.id));
  const edges = [];
  const seen = new Set();
  for (const m of members) {
    const net = Array.isArray(m.settlement?.neighbourNetwork) ? m.settlement.neighbourNetwork : [];
    for (const link of net) {
      const to = String(link?.id);
      if (!nodeIds.has(to)) continue;
      const from = String(m.id);
      const key = [from, to].sort().join('|') + '|' + (link?.relationshipType || 'neutral');
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ from, to, type: link?.relationshipType || 'neutral' });
    }
  }
  return { nodes, edges };
}

/** Receipts appendix: the relationship forces acting on each settlement (provenance). */
function buildReceipts(members) {
  const mods = getAllModifiers(members);
  const out = [];
  for (const m of members) {
    const entry = mods.get(m.id);
    const sources = Array.isArray(entry?.sources) ? entry.sources : [];
    if (!sources.length) continue;
    out.push({
      id: m.id,
      name: m.settlement?.name || m.name || String(m.id),
      sources: sources.map(src => ({
        from: src.fromName || src.from || '',
        effect: src.effect || src.category || '',
        detail: src.detail || src.label || '',
      })),
    });
  }
  return out;
}

/**
 * Collect the whole World Book model. Pure + deterministic given (campaign, saves).
 * The mode chooses the face: 'dm' binds everything; 'player' projects each
 * settlement through toPublicSafe and drops covert history.
 * @param {Object} campaign
 * @param {Array} [allSaves]
 * @param {{ mode?: 'dm' | 'player' }} [opts]
 */
export function collectWorldBook(campaign, allSaves = [], opts = {}) {
  const mode = opts.mode === 'player' ? 'player' : 'dm';
  if (!campaign) return { present: false, mode };
  const player = mode === 'player';
  const ids = new Set(campaign.settlementIds || []);
  const members = (Array.isArray(allSaves) ? allSaves : []).filter(s => ids.has(s.id));

  const dossiers = members.map(save => {
    const projected = player ? toPublicSafe(save.settlement || {}) : (save.settlement || {});
    return buildDossierEntry(save, projected, player);
  });

  const rawEntries = Array.isArray(campaign.wizardNews?.entries) ? campaign.wizardNews.entries : [];
  const chronicle = rawEntries
    .filter(e => !player || !isCovertEntry(e))
    .map(e => ({
      tick: Number(e.tick) || 0,
      headline: e.headline || '',
      summary: e.summary || '',
      source: e.source || 'world',
      significance: e.significance || 'notable',
    }));

  const map = buildMapModel(members);
  const receipts = buildReceipts(members);
  const realm = collectRealmSummary(campaign, members);

  return {
    present: true,
    mode,
    title: campaign.name || 'Untitled Campaign',
    description: campaign.description || '',
    settlementCount: members.length,
    chronicle,
    dossiers,
    map,
    receipts,
    realm,
    sections: {
      chronicle: chronicle.length > 0,
      dossiers: dossiers.length > 0,
      map: map.nodes.length > 0,
      receipts: receipts.length > 0,
      realm: !!realm?.present,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// THE PAINTER — the jsPDF idiom over the collected model.
// ─────────────────────────────────────────────────────────────────────────────

function buildCover(d, book, generatedLabel) {
  rect(d, 0, 0, PW, PH, PARCH);
  sd(d, GOLD); d.setLineWidth(1.2); d.rect(10, 10, PW - 20, PH - 20);
  sd(d, GOLD); d.setLineWidth(0.35); d.rect(13, 13, PW - 26, PH - 26);
  const cx = PW / 2;
  d.setFont('helvetica', 'italic'); d.setFontSize(11); st(d, BROWN);
  d.text(book.mode === 'player' ? 'A WORLD BOOK' : 'A WORLD BOOK - DM EDITION', cx, 60, { align: 'center' });
  d.setFont('helvetica', 'bold'); d.setFontSize(28); st(d, INK);
  let ty = 76;
  for (const line of wrap(d, book.title, CW - 20, 28).slice(0, 3)) { d.text(line, cx, ty, { align: 'center' }); ty += 12; }
  sd(d, GOLD); d.setLineWidth(0.6); d.line(cx - 30, ty + 4, cx + 30, ty + 4);
  if (book.description) {
    d.setFont('helvetica', 'normal'); d.setFontSize(10); st(d, BROWN);
    let dy = ty + 14;
    for (const line of clampLines(wrap(d, book.description, CW - 40, 10), 6)) { d.text(line, cx, dy, { align: 'center' }); dy += 5; }
  }
  d.setFont('helvetica', 'normal'); d.setFontSize(9); st(d, MUTED);
  d.text(`${formatCount(book.settlementCount)} settlement${book.settlementCount === 1 ? '' : 's'} bound within`, cx, 236, { align: 'center' });
  if (generatedLabel) { d.setFont('helvetica', 'italic'); d.setFontSize(8); st(d, MUTED); d.text(s(`Bound ${generatedLabel}`), cx, 250, { align: 'center' }); }
}

function chapterHeading(d, title, pageN) {
  d.addPage();
  return { y: secBar(d, MT, title, INK), pageN: pageN + 1 };
}

function buildChronicle(d, book, pageN) {
  let s2 = chapterHeading(d, 'The Chronicle', pageN);
  let { y } = s2; pageN = s2.pageN;
  if (!book.chronicle.length) {
    d.setFont('helvetica', 'italic'); d.setFontSize(9); st(d, MUTED);
    d.text('The ledger holds no chronicle for this world yet.', ML, y + 4);
    return pageN;
  }
  for (const e of book.chronicle) {
    const lines = wrap(d, e.summary || e.headline, CW - 24, 8);
    const rowH = 8 + lines.length * 4;
    const sp = ensureSpace(d, y, rowH, book.title, pageN); y = sp.y; pageN = sp.pageN;
    d.setFont('helvetica', 'bold'); d.setFontSize(8); st(d, e.source === 'table' ? BROWN : INK);
    d.text(s(`Tick ${e.tick}`), ML, y + 3);
    if (e.source === 'table') { d.setFont('helvetica', 'italic'); d.setFontSize(6.5); st(d, MUTED); d.text('at the table', ML + 22, y + 3); }
    d.setFont('helvetica', 'bold'); d.setFontSize(9); st(d, INK);
    d.text(s(e.headline), ML + 40, y + 3);
    y += 5;
    d.setFont('helvetica', 'normal'); d.setFontSize(8); st(d, BROWN);
    for (const line of clampLines(lines, 4)) { d.text(line, ML + 6, y + 3); y += 4; }
    y += 3; hline(d, ML, y, ML + CW, TAN, 0.15); y += 3;
  }
  footer(d, book.title, pageN);
  return pageN;
}

function buildDossiers(d, book, pageN) {
  for (const dos of book.dossiers) {
    let sp = chapterHeading(d, `Dossier - ${dos.name}`, pageN); let y = sp.y; pageN = sp.pageN;
    d.setFont('helvetica', 'normal'); d.setFontSize(9); st(d, BROWN);
    d.text(s(`${dos.tier || 'settlement'} - ${formatCount(dos.population)} souls${dos.culture ? ` - ${dos.culture}` : ''}`), ML, y + 3); y += 8;
    if (dos.overview) {
      d.setFont('helvetica', 'italic'); d.setFontSize(9); st(d, INK);
      for (const line of clampLines(wrap(d, dos.overview, CW - 6, 9), 6)) { d.text(line, ML, y + 3); y += 4.4; }
      y += 3;
    }
    if (dos.institutions.length) {
      d.setFont('helvetica', 'bold'); d.setFontSize(8); st(d, GOLD); d.text('INSTITUTIONS', ML, y + 3); y += 5;
      d.setFont('helvetica', 'normal'); d.setFontSize(8); st(d, BROWN);
      for (const line of clampLines(wrap(d, dos.institutions.join(', '), CW - 6, 8), 4)) { d.text(line, ML, y + 3); y += 4; }
      y += 3;
    }
    if (dos.npcs.length) {
      d.setFont('helvetica', 'bold'); d.setFontSize(8); st(d, GOLD); d.text('NOTABLE FIGURES', ML, y + 3); y += 5;
      d.setFont('helvetica', 'normal'); d.setFontSize(8); st(d, BROWN);
      for (const n of dos.npcs.slice(0, 12)) {
        const sp2 = ensureSpace(d, y, 5, book.title, pageN); y = sp2.y; pageN = sp2.pageN;
        d.text(s(`${n.name}${n.role ? ` - ${n.role}` : ''}`), ML + 3, y + 3); y += 4;
      }
      y += 3;
    }
    if (dos.hooks.length) {
      d.setFont('helvetica', 'bold'); d.setFontSize(8); st(d, GOLD); d.text('HOOKS (DM)', ML, y + 3); y += 5;
      d.setFont('helvetica', 'normal'); d.setFontSize(8); st(d, BROWN);
      for (const h of dos.hooks.slice(0, 6)) {
        for (const line of clampLines(wrap(d, `- ${h}`, CW - 6, 8), 2)) {
          const sp3 = ensureSpace(d, y, 5, book.title, pageN); y = sp3.y; pageN = sp3.pageN;
          d.text(line, ML + 3, y + 3); y += 4;
        }
      }
    }
    footer(d, book.title, pageN);
  }
  return pageN;
}

function buildMapChapter(d, book, pageN) {
  let sp = chapterHeading(d, 'The Realm Map', pageN); const y0 = sp.y; pageN = sp.pageN;
  if (!book.map.nodes.length) {
    d.setFont('helvetica', 'italic'); d.setFontSize(9); st(d, MUTED);
    d.text('No settlements are bound into a realm yet.', ML, y0 + 4); footer(d, book.title, pageN); return pageN;
  }
  const frameY = y0 + 2, frameH = 150;
  rect(d, ML, frameY, CW, frameH, CREAM, TAN);
  const positioned = autoLayout(
    book.map.nodes.map(n => ({ id: n.id, label: n.name })),
    book.map.edges.map(e => ({ source: e.from, target: e.to, type: e.type })),
  );
  const pos = new Map(positioned.map(p => [String(p.id), p]));
  const px = (v) => ML + 10 + v * (CW - 20);
  const py = (v) => frameY + 10 + v * (frameH - 20);
  sd(d, TAN); d.setLineWidth(0.3);
  for (const e of book.map.edges) {
    const a = pos.get(String(e.from)), b = pos.get(String(e.to));
    if (a && b) d.line(px(a.x), py(a.y), px(b.x), py(b.y));
  }
  for (const n of book.map.nodes) {
    const p = pos.get(String(n.id)); if (!p) continue;
    sf(d, GOLD); d.circle(px(p.x), py(p.y), 1.6, 'F');
    d.setFont('helvetica', 'normal'); d.setFontSize(7); st(d, INK);
    d.text(s(n.name), px(p.x) + 2.4, py(p.y) + 1);
  }
  footer(d, book.title, pageN);
  return pageN;
}

function buildReceiptsAppendix(d, book, pageN) {
  if (!book.receipts.length) return pageN;
  let sp = chapterHeading(d, 'Receipts - the forces between places', pageN); let y = sp.y; pageN = sp.pageN;
  for (const r of book.receipts) {
    const sp2 = ensureSpace(d, y, 8, book.title, pageN); y = sp2.y; pageN = sp2.pageN;
    d.setFont('helvetica', 'bold'); d.setFontSize(9); st(d, INK); d.text(s(r.name), ML, y + 3); y += 5;
    d.setFont('helvetica', 'normal'); d.setFontSize(8); st(d, BROWN);
    for (const src of r.sources.slice(0, 8)) {
      const sp3 = ensureSpace(d, y, 5, book.title, pageN); y = sp3.y; pageN = sp3.pageN;
      const line = `- ${src.from ? `${src.from}: ` : ''}${src.effect}${src.detail ? ` (${src.detail})` : ''}`;
      d.text(s(truncateAtWord(line, 90, '...')), ML + 3, y + 3); y += 4;
    }
    y += 3;
  }
  footer(d, book.title, pageN);
  return pageN;
}

function buildRealmChapter(d, book, pageN) {
  const realm = book.realm;
  if (!realm?.present) return pageN;
  let sp = chapterHeading(d, 'State of the Realm', pageN); let y = sp.y; pageN = sp.pageN;
  const section = (label, rows) => {
    if (!rows || !rows.length) return;
    d.setFont('helvetica', 'bold'); d.setFontSize(8); st(d, GOLD); d.text(s(label).toUpperCase(), ML, y + 3); y += 5;
    d.setFont('helvetica', 'normal'); d.setFontSize(8); st(d, BROWN);
    for (const row of rows.slice(0, 10)) {
      const sp2 = ensureSpace(d, y, 5, book.title, pageN); y = sp2.y; pageN = sp2.pageN;
      d.text(s(`- ${row}`), ML + 3, y + 3); y += 4;
    }
    y += 3;
  };
  section('Major headlines', (realm.majors || []).map(m => m.headline || m.summary || String(m)));
  section('Under siege', (realm.sieges || []).map(sg => realm.nameFor ? realm.nameFor(sg.id) : sg.id));
  section('War-weary', (realm.weary || []).map(w => realm.nameFor ? realm.nameFor(w.id) : w.id));
  footer(d, book.title, pageN);
  return pageN;
}

/**
 * Paint + download the World Book. Fire-and-download (mirrors generateCampaignPDF):
 * returns nothing; calls doc.save(). The cover date is injectable via opts.now for
 * reproducible output; the pins walk collectWorldBook's structure, not these bytes.
 * @param {Object} campaign
 * @param {Array} allSaves
 * @param {{ mode?: 'dm' | 'player', now?: string }} [opts]
 */
export function generateWorldBook(campaign, allSaves = [], opts = {}) {
  if (!campaign) throw new Error('generateWorldBook: missing campaign');
  const book = collectWorldBook(campaign, allSaves, opts);
  const d = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  let pageN = 1;
  const generatedLabel = opts.now || new Date().toLocaleDateString('en-US');
  buildCover(d, book, generatedLabel);
  footer(d, book.title, pageN);
  pageN = buildChronicle(d, book, pageN);
  pageN = buildDossiers(d, book, pageN);
  pageN = buildMapChapter(d, book, pageN);
  pageN = buildRealmChapter(d, book, pageN);
  // Last chapter: its returned page count is not read again (the doc saves next).
  buildReceiptsAppendix(d, book, pageN);
  const slug = String(book.title || 'world').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'world';
  d.save(`world-book-${slug}${book.mode === 'player' ? '-player' : ''}.pdf`);
}
