/**
 * nameListColumns.walker.test.js — THE NAME-LIST CENSUS (owner order 2026-09-19).
 *
 * ── THE ORDER ────────────────────────────────────────────────────────────────
 * The owner, on the Power tab's "Institutions behind this power (25)": "could we
 * also have sections like these be in two or three columns to conserve space?".
 * "Sections like these" is the class, not the one list — twenty-five SHORT rows,
 * each a name, each taking a full-width line.
 *
 * ── WHY A WALKER RATHER THAN FOUR EDITS ──────────────────────────────────────
 * The cure for one list is an import. The cure for the CLASS is a rule about
 * which lists take columns and which do not, written down where the next list to
 * arrive has to answer it. Without that, the fifth list ships single-column and
 * nobody finds out, because nothing on the page looks broken — it just reads
 * long, which is exactly the defect the owner had to report by eye.
 *
 * ⛔ SO THE CENSUS IS TOTAL AND THE RULING IS WRITTEN. Every list site the scan
 * below finds must carry a verdict in `RULED`, and a verdict of `columns` must
 * actually render through `primitives/NameColumns.jsx`. A NEW list reds here and
 * takes a ruling; a ruling whose site is gone reds too, so the table cannot rot
 * into a list of things that used to be true.
 *
 * ── WHAT THE SCAN CAN AND CANNOT SEE, SAID PLAINLY ───────────────────────────
 * "Six or more SHORT rows" is half a runtime fact: how MANY rows a list has is a
 * property of the settlement, and nothing static can know it. So the scan does
 * not claim to. It finds the mechanical signature of a one-row-per-line list of
 * short rows — a `.map(` rendering JSX, whose row body carries no prose marker
 * and no bar, and which is not inside a wrapping chip row — and it makes every
 * such site take a verdict. The COUNT question is answered at RUNTIME by the
 * primitive itself, whose own floor (`min`, `MIN_ROWS_PER_COLUMN`) renders a
 * short list single-column. The two halves are not redundant: this one sees
 * every site including the ones no fixture reaches; the primitive sees the
 * length this settlement actually has.
 *
 * KNOWN EDGES (line-scan heuristics, accepted and named):
 *   - A `.map(` that renders NO JSX (it builds a string, or calls a plain
 *     function that returns the row) is out of the walk: there is no row body to
 *     judge. `MarketPricesSection`'s `moved.map(q => Movement(q, mobile))` is the
 *     one such site in the tree today, and its rows carry a price phrase, which
 *     is prose under the rule below.
 *   - The chip test reads the 300 characters BEFORE the site for `flexWrap`,
 *     because the wrapping is declared on the PARENT. A chip row whose container
 *     is declared further away than that reads as a candidate and takes an
 *     `inline-run` verdict instead of being skipped — one extra row, never a
 *     miss.
 *   - `src/components/dossier/**` is OUT of the scan and it is a ruling: that
 *     tree is the workbench, the tab strips, the pending-changes bar and the
 *     cascade preview — the chrome AROUND a dossier tab rather than the read
 *     inside one. Its lists are controls and receipts, not rosters.
 *
 * @enforced-by this test
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/** The one tree this census governs — the dossier's tab content (see the edges above). */
const CENSUS_TREE = 'src/components/new/tabs';

/** The shared primitive a `columns` verdict must go through. */
const PRIMITIVE = 'NameColumns';

/**
 * ⛔ THE CLOSED VERDICT VOCABULARY. A site takes exactly one of these, and the
 * words are the rule rather than labels for it:
 *
 *   columns     — a list of short rows: it renders through NameColumns.
 *   prose       — a row carries a SENTENCE. The owner's rule is explicit that a
 *                 prose row stays single-column: a paragraph in a 240px column is
 *                 a worse read than a long page.
 *   card        — the row is a CARD or a disclosure with its own detail beneath
 *                 it. Columns would put an expansion body inside a column and the
 *                 card's own internal layout into a third of its width.
 *   inline-run  — the "rows" are not rows: they run inline, separated by a glyph
 *                 or a middot, inside one line. There is nothing to column.
 *   short       — the list is bounded below the column floor by construction, so
 *                 the primitive would render one column anyway and the import
 *                 would be a promise the page never keeps.
 */
const VERDICTS = Object.freeze(['columns', 'prose', 'card', 'inline-run', 'short']);

/** A verdict has to argue; this is the floor that stops a word buying a ruling. */
const REASON_FLOOR = 24;

/**
 * ⭐ THE CENSUS. Every list site in the tree, keyed `<file> :: <subject>`, with
 * its verdict and the reason for it.
 *
 * KEYED BY SUBJECT AND NOT BY LINE, deliberately: a line number churns under
 * every unrelated edit above it, which would make this a nuisance gate rather
 * than a ruling. Two sites in one file over the SAME subject (a list rendered
 * twice, e.g. the roaming and settled halves of one roster) share one row,
 * because they are one shape and take one verdict.
 * @type {Readonly<Record<string, string>>}
 */
const RULED = Object.freeze({
  // ── THE COLUMNED HALF (owner order 2026-09-19) ─────────────────────────────
  'src/components/new/tabs/power/PowerStrata.jsx :: group.edges':
    'columns — THE ORDER\'S OWN LIST: the institutions behind a power, one name per row, '
    + 'under a basis caption said once for the whole group. Twenty-five of them on a real town.',
  'src/components/new/tabs/SubstrateTab.jsx :: rows':
    'columns — the sixteen settlement foundations, each a label and one band word. A glance '
    + 'table, not a passage; the band still sits at the right edge of its own column.',
  'src/components/new/tabs/MagicTab.jsx :: FACET_ORDER':
    'columns — the six envelope facets, each a label and one typed word. At six rows the '
    + 'primitive\'s own floor gives two columns and never three.',
  'src/components/new/tabs/FaithTab.jsx :: rows':
    'columns — the divine-influence channels, each a channel word and two band words. The '
    + 'pantheon moves up to nine of them; below six the primitive renders one column.',

  // ── PROSE ROWS: THEY STAY SINGLE-COLUMN (the owner\'s rule) ─────────────────
  'src/components/new/tabs/DMCompassTab.jsx :: hooks':
    'prose — a BulletRow holding a whole adventure hook, set in a serif reading face.',
  'src/components/new/tabs/DMCompassTab.jsx :: redFlags':
    'prose — a BulletRow holding the red flag as a sentence, same row component as the hooks.',
  'src/components/new/tabs/DMCompassTab.jsx :: markers':
    'prose — a BulletRow holding a concrete scene detail to read aloud at the table.',
  'src/components/new/tabs/DMCompassTab.jsx :: points':
    'prose — a friction point is a name and then the grievance, which is a sentence.',
  'src/components/new/tabs/WarTab.jsx :: beliefs':
    'prose — what this town believes of one neighbour, as a clause with two band words and a '
    + 'heard-how-long-ago tail.',
  'src/components/new/tabs/WarTab.jsx :: doc.successionLines':
    'prose — the treaty\'s open-question line, a full sentence inside the document card.',
  'src/components/new/tabs/ServicesTab.jsx :: searchResults':
    'prose — a ServiceItem (its own description sentence and impairment reason) with the '
    + 'category word beneath it.',

  // ── CARDS AND DISCLOSURES: THE ROW HAS ITS OWN INSIDE ──────────────────────
  'src/components/new/tabs/DefenseTab.jsx :: walls':
    'card — a ForceCard: the fortification with its own figures and condition beneath the name.',
  'src/components/new/tabs/DefenseTab.jsx :: mercForces':
    'card — a ForceCard, the same shape as the walls above and the garrison beside it.',
  'src/components/new/tabs/DefenseTab.jsx :: charterForces':
    'card — a ForceCard; a chartered company carries its terms under its name.',
  'src/components/new/tabs/DefenseTab.jsx :: magicDef':
    'card — a ForceCard for an arcane defence, with the same inside as its siblings.',
  'src/components/new/tabs/FaithTab.jsx :: ranks':
    'card — a niche row carries the creed\'s deepening rows (character, boon and bane) beneath '
    + 'it, so the row has an inside a column would break.',
  'src/components/new/tabs/NPCsTab.jsx :: presentFactions':
    'card — an NPCCategoryGroup is a whole faction\'s roster, not a row.',
  'src/components/new/tabs/NPCsTab.jsx :: settlement?.relationships':
    'card — an NPCRelCard2 carries the tie and its description.',
  'src/components/new/tabs/RelationshipsTab.jsx :: filteredRels':
    'card — an NPCRelCard2, the same component the NPCs tab lists.',
  'src/components/new/tabs/RelationshipsTab.jsx :: conflicts':
    'card — a ConflictCard: parties, issue, stakes and hooks under one head.',
  'src/components/new/tabs/RumorsTab.jsx :: rumors':
    'card — a RumorCard carries the rumour, its provenance chain and its truth state.',
  'src/components/new/tabs/TraditionsTab.jsx :: traditions':
    'card — a TraditionRow: the motif, the window it is kept in, its owner and its last outcome.',
  'src/components/new/tabs/UnaffiliatesSection.jsx :: rows.roaming':
    'card — an UnaffiliateCard carries why, when and whereabouts under the name, and the '
    + 'wanderer verb controls beneath that.',
  'src/components/new/tabs/UnaffiliatesSection.jsx :: rows.settled':
    'card — the same UnaffiliateCard as the roaming half above; one shape, one ruling.',
  'src/components/new/tabs/ServicesTab.jsx :: catOrder':
    'card — a whole service CATEGORY: a toggle header and the list of its services inside.',
  'src/components/new/tabs/ServicesTab.jsx :: missing':
    'card — an absence tile, already laid in the two- or three-column grid above it.',
  'src/components/new/tabs/power/PowerStrata.jsx :: matchedGroups':
    'card — a faction group\'s sub-row, rendered INSIDE its faction\'s roster card and indented '
    + 'under it; it belongs to that row rather than being a list of its own.',

  // ── NOT ROWS, OR TOO FEW TO BE ─────────────────────────────────────────────
  'src/components/new/tabs/FaithTab.jsx :: depth.top3':
    'inline-run — the three character words run INLINE in one line, separated by a middot.',
  'src/components/new/tabs/ResourcesTab.jsx :: chain.finalProducts':
    'inline-run — the chain\'s final products run inline with arrow separators, as one flow.',
  'src/components/new/tabs/ViabilityTab.jsx :: generationReceipt.checks':
    'short — only the FAILING checks render, and a settlement that ships carries a handful; '
    + 'the receipt is a short list by construction.',
});

// ── the walk ─────────────────────────────────────────────────────────────────

/** Every `.jsx` under `dir`, tests excluded. */
function walkJsx(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walkJsx(p, out);
    else if (/\.jsx$/.test(entry) && !/\.test\./.test(entry)) out.push(p);
  }
  return out;
}

/** A row body carrying a SENTENCE — the markers this estate writes prose with. */
const PROSE = /<p[\s>]|ProseBlock|proseFontSize|truncateAtWord|<DeskLines|\.desc\b|\.note\b|\.summary\b|\.reason\b|\.description\b|narrative/;
/** A row body carrying a BAR or a proportional track. */
const BAR = /width:\s*`\$\{|height:\s*\d+,\s*background|flex:\s*Math\.max/;
/** The wrapping chip row: declared on the container, so it is looked for before the site too. */
const CHIP = /flexWrap/;
/** How far back the chip test reads for that container declaration. */
const CHIP_LOOKBACK = 300;
/** A row body that is exactly one component element and nothing else. */
const DELEGATE = /^\(?[^<]*<([A-Z][A-Za-z0-9]*)[\s/][^<]*\/>\s*\)?\s*\)$/s;

/**
 * Every list site in one source, judged. A site is `{subject, line, delegate}`;
 * anything the rules above exclude never becomes one.
 * @param {string} src @param {string} rel
 * @returns {{rel: string, subject: string, line: number, delegate: string|null}[]}
 */
export function listSitesOf(src, rel) {
  const out = [];
  const pattern = /\{\s*(?:\(\s*)?([A-Za-z_$][\w$.?[\]'"]*)\s*(?:\|\|\s*\[\])?\s*\)?\s*(?:\.(?:filter|slice|sort)\([^]*?\))?\.map\s*\(/g;
  for (const m of src.matchAll(pattern)) {
    const open = m.index + m[0].length - 1;
    let depth = 0;
    let i = open;
    for (; i < src.length; i += 1) {
      if (src[i] === '(') depth += 1;
      else if (src[i] === ')') { depth -= 1; if (depth === 0) break; }
    }
    const body = src.slice(open, i + 1);
    const after = src.slice(i + 1, i + 12);
    const before = src.slice(Math.max(0, m.index - CHIP_LOOKBACK), m.index);
    if (/^\s*\.join\s*\(/.test(after)) continue;          // a string, not rows
    if (!body.includes('<')) continue;                    // no JSX row to judge
    if (CHIP.test(before) || CHIP.test(body)) continue;   // a wrapping chip row
    if (PROSE.test(body) || BAR.test(body)) continue;     // a passage, or a track
    const delegated = DELEGATE.exec(body);
    out.push({
      rel,
      subject: m[1],
      line: src.slice(0, m.index).split('\n').length,
      delegate: delegated ? delegated[1] : null,
    });
  }
  return out;
}

const FILES = walkJsx(join(ROOT, CENSUS_TREE))
  .sort()
  .map((abs) => ({ rel: relative(ROOT, abs).replace(/\\/g, '/'), src: readFileSync(abs, 'utf8') }));

const SITES = FILES.flatMap((f) => listSitesOf(f.src, f.rel));
const keyOf = (site) => `${site.rel} :: ${site.subject}`;
const SCANNED = [...new Set(SITES.map(keyOf))].sort();

/** The keys this census says must render through the primitive. */
const COLUMNED = Object.keys(RULED).filter((k) => RULED[k].startsWith('columns')).sort();

/**
 * Does `src` render `site` inside a `<NameColumns …> … </NameColumns>` span?
 * A plain span test rather than a parse: the primitive has one closing tag per
 * opening one and the sites are nested no deeper than one list.
 * @param {string} src @param {number} at the site's character offset
 * @returns {boolean}
 */
function insideColumns(src, at) {
  for (const open of src.matchAll(new RegExp(`<${PRIMITIVE}(?=[\\s>])`, 'g'))) {
    const close = src.indexOf(`</${PRIMITIVE}>`, open.index);
    if (close !== -1 && at > open.index && at < close) return true;
  }
  return false;
}

describe('THE NAME-LIST CENSUS — every dossier list of short rows is ruled on', () => {
  test('the walk is live: it read the tree and found list sites to judge', () => {
    // ⛔ ANTI-VACUITY. A moved tree or a pattern that stopped matching produces an
    // empty walk, and the totality arm below then passes on nothing. The floors are
    // the measurement at landing and they TIGHTEN toward reality; they are never
    // lowered to admit a change. Measured by executing this walk against this tree
    // on 2026-09-19: 27 files, 30 distinct sites, 4 of them ruled `columns`.
    expect(FILES.length, 'the census tree is empty — has src/components/new/tabs moved?')
      .toBeGreaterThanOrEqual(27);
    expect(SCANNED.length, 'the walk judged almost no list sites — the `.map(` shape it looks for has changed')
      .toBeGreaterThanOrEqual(30);
    expect(COLUMNED.length, 'no site is ruled `columns` — the registry half has emptied')
      .toBeGreaterThanOrEqual(4);
  });

  test('TOTALITY: every list site the scan finds carries a written verdict', () => {
    const unruled = SCANNED.filter((key) => !(key in RULED));
    expect(
      unruled,
      '\nA dossier list site has no ruling. Decide what its rows ARE and add a row to RULED:\n'
      + `  columns    — short rows (a name, or a name and one band word): render it through ${PRIMITIVE}\n`
      + '  prose      — the row carries a sentence: it stays single-column (the owner\'s rule)\n'
      + '  card       — the row is a card or a disclosure with its own inside\n'
      + '  inline-run — the "rows" run inline in one line\n'
      + '  short      — the list is bounded below the column floor by construction\n'
      + `${unruled.join('\n')}\n`,
    ).toEqual([]);
  });

  test('no stale rulings: every RULED key is a site the scan still finds', () => {
    const scanned = new Set(SCANNED);
    const stale = Object.keys(RULED).filter((key) => !scanned.has(key)).sort();
    expect(
      stale,
      '\nA ruling names a list site that no longer exists (renamed subject, deleted list, or a '
      + 'row that grew a sentence and left the scan). Delete the row rather than leaving slack '
      + 'for the next arrival:\n'
      + `${stale.join('\n')}\n`,
    ).toEqual([]);
  });

  test('every verdict is one of the five words, with a reason that argues', () => {
    const bad = [];
    for (const [key, ruling] of Object.entries(RULED)) {
      const verdict = ruling.split(' ')[0];
      if (!VERDICTS.includes(verdict)) { bad.push(`${key}: "${verdict}" is not a verdict`); continue; }
      const reason = ruling.slice(verdict.length).replace(/^\s*[—-]\s*/, '');
      if (reason.length < REASON_FLOOR) bad.push(`${key}: a ${reason.length}-character reason buys nothing`);
    }
    expect(bad, `\n${bad.join('\n')}\n`).toEqual([]);
  });

  test(`every 'columns' ruling really renders through ${PRIMITIVE}`, () => {
    // ⛔ THE HALF THAT MAKES THE CENSUS A CURE RATHER THAN A LIST. A row may say
    // `columns` and the file may render exactly what it rendered before; this is
    // what refuses that. Both halves are checked — the import AND the enclosing
    // element — because an import alone is a promise and an element without the
    // import would not compile.
    const bad = [];
    for (const key of COLUMNED) {
      const [rel, subject] = key.split(' :: ');
      const file = FILES.find((f) => f.rel === rel);
      if (!file) { bad.push(`${key}: the file does not exist`); continue; }
      if (!new RegExp(`import\\s+${PRIMITIVE}\\s+from`).test(file.src)) {
        bad.push(`${key}: ${rel} does not import ${PRIMITIVE}`);
        continue;
      }
      const sites = listSitesOf(file.src, rel).filter((s) => s.subject === subject);
      for (const site of sites) {
        const at = file.src.split('\n').slice(0, site.line - 1).join('\n').length;
        const from = file.src.indexOf(`${subject}`, at);
        if (!insideColumns(file.src, from === -1 ? at : from)) {
          bad.push(`${key}: the site at ${rel}:${site.line} is not inside a <${PRIMITIVE}> element`);
        }
      }
    }
    expect(
      bad,
      `\nA site ruled 'columns' does not render through the shared primitive, so the ruling is a `
      + `promise the page does not keep:\n${bad.join('\n')}\n`,
    ).toEqual([]);
  });

  test('the detectors discriminate (executed controls)', () => {
    // ⛔ THREE OF THE ARMS ABOVE ASSERT AN EMPTY LIST, which is also what a scanner
    // that has stopped scanning produces. Each control is a source string this file
    // parses for real.
    const site = (src) => listSitesOf(src, 'control.jsx');

    expect(site('<div>{names.map((n) => <div key={n}>{n}</div>)}</div>').length,
      'a plain short-row list is no longer found').toBe(1);

    expect(site('<div>{names.map((n) => <p key={n}>{n.desc}</p>)}</div>'),
      'a prose row is reported as a short-row list').toEqual([]);

    expect(site('<div style={{flexWrap:\'wrap\'}}>{names.map((n) => <span key={n}>{n}</span>)}</div>'),
      'a wrapping chip row is reported as a short-row list').toEqual([]);

    expect(site('<div>{names.map((n) => n.label).join(\', \')}</div>'),
      'a joined string is reported as a list of rows').toEqual([]);

    expect(site('<div>{rows.map((r) => <div key={r.k} style={{width:`${r.pct}%`}}/>)}</div>'),
      'a bar track is reported as a short-row list').toEqual([]);

    const delegated = site('<div>{rows.map((r) => <ForceCard key={r.id} inst={r} />)}</div>');
    expect(delegated.length, 'a delegating row is no longer found').toBe(1);
    expect(delegated[0].delegate, 'the delegated component is no longer named').toBe('ForceCard');

    // And the `columns` arm's own detector: an element that encloses, and one that does not.
    const wrapped = `<NameColumns count={n}>{names.map((x) => <div key={x}>{x}</div>)}</NameColumns>`;
    expect(insideColumns(wrapped, wrapped.indexOf('names')), 'an enclosed site reads as outside').toBe(true);
    const bare = `<div>{names.map((x) => <div key={x}>{x}</div>)}</div><NameColumns></NameColumns>`;
    expect(insideColumns(bare, bare.indexOf('names')), 'a site outside the element reads as inside').toBe(false);
  });
});
