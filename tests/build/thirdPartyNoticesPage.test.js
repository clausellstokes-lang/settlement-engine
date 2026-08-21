/**
 * thirdPartyNoticesPage.test.js — the THIRD-PARTY NOTICES guard (ODQ 295.5c).
 *
 * The notices surface is two files that say the same thing in two formats:
 * THIRD-PARTY-NOTICES.md at the repository root (the authoritative copy) and
 * public/third-party-notices.html (the served page, reachable at
 * /third-party-notices.html). A compliance surface rots in exactly two ways, and
 * both are silent:
 *
 *   1. THE TWO COPIES DRIFT. Someone updates the Markdown after a dependency
 *      change and forgets the page, so the URL a recipient actually visits
 *      describes a build we no longer ship. This file derives the package
 *      inventory FROM the Markdown table and requires every row to be present on
 *      the page, so drift on any of the 107 rows reddens rather than shipping.
 *   2. A LOAD-BEARING ENTRY VANISHES. The entries that carry real obligation are
 *      the vendored map fork (MIT, with its widened grant), TinyMCE (GPL-2.0 or
 *      later, reported as it ships and deliberately deciding nothing), and the
 *      two dual-licence elections the notices exist to record — MIT elected for
 *      JSZip and for jQuery UI Touch Punch. Those four are pinned by name in
 *      BOTH files.
 *
 * The page is also held to the status page's contract: self-contained, so it can
 * be read independently of the application, and carrying exactly one href (the
 * support mailto) so a compliance page never becomes a set of outbound jumps.
 *
 * THE PAGE SHIPS DARK, BY DESIGN. Nothing in src/ links to it. Lighting a
 * navigation or footer link is a separate, owner-visible act; until then the
 * darkness itself is pinned, so a link cannot appear by accident.
 *
 * Every absence assertion below is expressed as an empty-match list with a
 * CONTROL case proving the same matcher fires on forged input, so none of them
 * can pass by looking at nothing.
 *
 * CANNOT-CATCH — the residual, named so nobody trusts this guard past its reach:
 *   - A DEPENDENCY ADDED WITHOUT A ROW. Both extractors read the two documents;
 *     neither reads package-lock.json, so a new package that nobody writes down
 *     is invisible here. The residual is covered by habit and by the notices
 *     document's own section 5, which states the obligation; closing it properly
 *     means deriving section 3.2 from the lock file, which would make the
 *     document a generated artifact with a freshness contract of its own.
 *   - A ROW THAT IS WRONG IN BOTH COPIES. Agreement is not correctness: a
 *     mis-stated licence or copyright holder that is mis-stated identically in
 *     both files passes. The four load-bearing entries are pinned to their
 *     literal values, so the residual is the long tail.
 *   - LICENCE FACTS ABOUT THE VENDORED MAP FILES. Section 1.2's twenty rows are
 *     pinned as text, not re-read from public/map/libs/. A vendored file swapped
 *     for a differently-licensed one is caught by the vendor manifest's SHA-256
 *     exact-set contract (scripts/validate-map-fork.mjs), not by this file.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const MD_PATH = join(ROOT, 'THIRD-PARTY-NOTICES.md');
const HTML_PATH = join(ROOT, 'public', 'third-party-notices.html');

const md = readFileSync(MD_PATH, 'utf8');
const html = readFileSync(HTML_PATH, 'utf8');

/**
 * Collapse whitespace so a prose assertion survives re-wrapping. The Markdown is
 * hard-wrapped at 78 columns and the page is not, so the SAME sentence appears
 * with different line breaks in the two files; comparing raw text would pin the
 * wrap rather than the sentence.
 */
const flat = (source) => source.replace(/\s+/g, ' ');
const mdFlat = flat(md);
const htmlFlat = flat(html);

/** Resource-loading vectors. A notices page must pull nothing over the network. */
const EXTERNAL_LOADERS = [
  { name: 'script tag', re: /<script/gi },
  { name: 'link tag', re: /<link\b/gi },
  { name: 'img tag', re: /<img/gi },
  { name: 'remote css url()', re: /url\(\s*['"]?https?:/gi },
];

/**
 * The dependency inventory as each file states it: one `name@version` string per
 * row, in document order.
 *
 * BOTH EXTRACTORS SLICE SECTION 3.2 FIRST, and that scoping is the point.
 * Section 1.2 is a backticked table too — of vendored map FILES, several with
 * numeric versions — so an unscoped Markdown scan would fold six map libraries
 * into the package count. Worse on the page side: a whole-document substring
 * search for a package name also matches the PROSE that lists the direct
 * dependencies, so deleting a row for (say) `zustand` would leave the page
 * "containing" it and the drift would ship. That exact mutation was run against
 * an unscoped version of this check and survived it.
 */
function inventoryFromMarkdown(source) {
  const section = source.split('### 3.2 The inventory')[1];
  if (section === undefined) return [];
  const table = section.split('### 3.3')[0];
  return [...table.matchAll(/^\| `([^`]+)`[^|]*\| (\S+) \|/gm)].map((m) => `${m[1]}@${m[2]}`);
}

function inventoryFromPage(source) {
  const section = source.split('<caption>The production dependency tree,')[1];
  if (section === undefined) return [];
  const table = section.split('</table>')[0];
  return [...table.matchAll(/<tr><td><code>([^<]+)<\/code>[^|]*?<\/td><td>([^<]+)<\/td>/g)]
    .map((m) => `${m[1]}@${m[2]}`);
}

describe('the third-party notices surface exists in both formats', () => {
  it('ships the authoritative Markdown and the served page', () => {
    expect(existsSync(MD_PATH)).toBe(true);
    expect(existsSync(HTML_PATH)).toBe(true);
    expect(md.length).toBeGreaterThan(10000);
    expect(html.length).toBeGreaterThan(10000);
  });

  it('the page is a titled HTML document set to noindex', () => {
    expect(html).toMatch(/<!doctype html>/i);
    expect(html).toMatch(/<title>SettlementForge Third-Party Notices<\/title>/);
    expect(html).toMatch(/<meta[^>]+name="robots"[^>]+content="noindex"/);
  });

  it('the page names the Markdown file as the authoritative copy', () => {
    expect(html).toContain('THIRD-PARTY-NOTICES.md');
    expect(md).toContain('public/third-party-notices.html');
  });
});

/**
 * Assert a string is present in BOTH copies, whitespace-normalised.
 *
 * The rows below are spelled out one `it()` per entry rather than generated from
 * a table on purpose: a loop-registered test carries a template title, which the
 * estate's title census cannot read statically, and one such title parks the
 * whole file out of the credited count. The loop lives INSIDE each named test.
 */
function expectInBothCopies(needles) {
  for (const needle of needles) {
    expect(mdFlat, `THIRD-PARTY-NOTICES.md must name ${needle}`).toContain(needle);
    expect(htmlFlat, `the served page must name ${needle}`).toContain(needle);
  }
}

describe('the entries that carry obligation are named in both copies', () => {
  it('names the vendored map fork and its copyright holder', () => {
    expectInBothCopies(['Fantasy Map Generator', 'Max Haniyeu (Azgaar)']);
  });

  it('names the map fork licence file we serve', () => {
    expectInBothCopies(['LICENSE-FMG.txt']);
  });

  it('names TinyMCE, its version, and its copyright holder', () => {
    expectInBothCopies(['TinyMCE', '7.1.0', 'Ephox Corporation DBA Tiny Technologies, Inc.']);
  });

  it('names the JSZip entry the election applies to', () => {
    expectInBothCopies(['JSZip 3.6.0']);
  });

  it('names the Touch Punch entry the election applies to', () => {
    expectInBothCopies(['jQuery UI Touch Punch 0.2.3']);
  });

  it('records TinyMCE as GPL version 2 or later without claiming to settle it', () => {
    for (const source of [mdFlat, htmlFlat]) {
      expect(source).toContain('GNU General Public Licence version 2 or later');
      // The surface reports; the disposition sits with the owner and counsel.
      expect(source).toContain('This section states what is served. It settles nothing.');
    }
  });

  it('records the MIT election for BOTH dual-licensed map libraries', () => {
    for (const source of [mdFlat, htmlFlat]) {
      expect(source).toContain('We elect the MIT licence for both.');
      // Each library is offered under MIT or a copyleft alternative...
      expect(source).toMatch(/JSZip 3\.6\.0[\s\S]{0,400}GPL-3\.0/);
      expect(source).toMatch(/jQuery UI Touch Punch 0\.2\.3[\s\S]{0,400}GPL-2\.0/);
    }
    // ...and the election table resolves both to MIT.
    const mdElections = [...md.matchAll(/^\| (JSZip 3\.6\.0|jQuery UI Touch Punch 0\.2\.3)[^|]*\| [^|]+\| \*\*MIT\*\* \|$/gm)];
    expect(mdElections.map((m) => m[1]).sort()).toEqual(['JSZip 3.6.0', 'jQuery UI Touch Punch 0.2.3']);
    const htmlElections = [...html.matchAll(/<td>(JSZip 3\.6\.0|jQuery UI Touch Punch 0\.2\.3)<\/td>[\s\S]{0,200}?<td><strong>MIT<\/strong><\/td>/g)];
    expect(htmlElections.map((m) => m[1]).sort()).toEqual(['JSZip 3.6.0', 'jQuery UI Touch Punch 0.2.3']);
  });

  it('carries the third-party-within-third-party provenance note', () => {
    for (const source of [mdFlat, htmlFlat]) {
      expect(source).toContain('calculateUrquhartEdges');
      expect(source).toMatch(/permissive top-level grant\b[^.]*does not reach/i);
      expect(source).toMatch(/our own generators are written from scratch/i);
    }
  });
});

describe('the two copies agree on the dependency inventory', () => {
  const fromMd = inventoryFromMarkdown(md);
  const fromPage = inventoryFromPage(html);

  it('both scans really read an inventory (neither is looking at nothing)', () => {
    expect(fromMd.length).toBeGreaterThan(100);
    expect(fromPage.length).toBeGreaterThan(100);
    for (const known of ['react', 'dompurify', 'three', 'zustand', 'jspdf']) {
      expect(fromMd.some((row) => row.startsWith(`${known}@`))).toBe(true);
      expect(fromPage.some((row) => row.startsWith(`${known}@`))).toBe(true);
    }
  });

  it('the page lists exactly the packages and versions the Markdown lists', () => {
    // Ordered, name AND version: a dropped row, an added row, a re-ordered row
    // and a version that moved on one side only are all caught.
    expect(fromPage).toEqual(fromMd);
  });

  it('the page states the same inventory size it lists', () => {
    expect(html).toContain(`The production dependency tree, ${fromMd.length} packages.`);
  });

  it('CONTROL: both extractors are scoped, and read a forged row the same way', () => {
    const forgedMd = '### 3.2 The inventory\n\n| `left-pad` | 1.0.0 | MIT | Copyright (c) somebody |\n### 3.3 next\n';
    expect(inventoryFromMarkdown(forgedMd)).toEqual(['left-pad@1.0.0']);
    const forgedHtml = '<caption>The production dependency tree, 1 packages.</caption><tbody>'
      + '<tr><td><code>left-pad</code></td><td>1.0.0</td><td>MIT</td><td>x</td></tr></tbody></table>';
    expect(inventoryFromPage(forgedHtml)).toEqual(['left-pad@1.0.0']);
    // Rows OUTSIDE the inventory table are not package rows, however table-shaped.
    expect(inventoryFromMarkdown('| `d3.min.js` | 5.8.0 | ISC | x |\n')).toEqual([]);
    expect(inventoryFromPage('<tr><td><code>d3.min.js</code></td><td>5.8.0</td></tr>')).toEqual([]);
    // ...and prose that merely NAMES a package is not a row.
    expect(inventoryFromPage('<caption>The production dependency tree, 0 packages.</caption>'
      + '<tbody></tbody></table><p><code>zustand</code></p>')).toEqual([]);
  });
});

describe('the served page is self-contained', () => {
  it('loads no external resource', () => {
    for (const { name, re } of EXTERNAL_LOADERS) {
      const hits = html.match(re) || [];
      expect(hits, `the notices page must not carry a ${name}`).toEqual([]);
    }
  });

  it('CONTROL: each loader matcher fires on forged markup', () => {
    const forged = '<script src="x"></script><link rel="stylesheet" href="x">'
      + '<img src="x"><style>a{background:url("https://cdn.example/x.png")}</style>';
    for (const { name, re } of EXTERNAL_LOADERS) {
      expect((forged.match(re) || []).length, `${name} matcher is dead`).toBeGreaterThan(0);
    }
  });

  it('carries exactly one href, the support mailto', () => {
    const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(['mailto:support@settlementforge.com']);
  });
});

describe('the OFL notice rides beside the fonts (ODQ 323.2)', () => {
  const OFL_PATH = join(ROOT, 'public', 'fonts', 'OFL.txt');
  const LORA_COPYRIGHT = 'Copyright 2011 The Lora Project Authors '
    + '(https://github.com/cyrealtype/Lora-Cyrillic), with Reserved Font Name "Lora".';
  const NUNITO_COPYRIGHT = 'Copyright 2014 The Nunito Project Authors '
    + '(https://github.com/googlefonts/nunito)';
  /** The marker the notice file carries while its licence body is still missing. */
  const PENDING = 'FULL LICENCE TEXT NOT YET INCLUDED';

  it('ships an OFL notice file alongside the font files', () => {
    expect(existsSync(OFL_PATH)).toBe(true);
    const ofl = readFileSync(OFL_PATH, 'utf8');
    expect(ofl.length).toBeGreaterThan(1000);
    expect(ofl).toContain('SIL Open Font License, Version 1.1');
  });

  it('the notice carries both families\' copyright lines, matching the Markdown', () => {
    const ofl = readFileSync(OFL_PATH, 'utf8');
    // The strings are the ones read out of the TTF name tables; pinning them in
    // BOTH the notice file and the inventory ties the two to one another, so a
    // font swap that changes a copyright cannot move one and leave the other.
    for (const line of [LORA_COPYRIGHT, NUNITO_COPYRIGHT]) {
      expect(ofl, 'the OFL notice must carry the verbatim copyright line').toContain(line);
      expect(md, 'THIRD-PARTY-NOTICES.md must carry the same line').toContain(line);
    }
  });

  it('the notice file and both notices copies agree on whether the body has landed', () => {
    const ofl = readFileSync(OFL_PATH, 'utf8');
    const bodyStillMissing = ofl.includes(PENDING);
    // This stays green on BOTH sides of the cure and forces the three artefacts to
    // move together: while the body is missing every copy must say so, and once it
    // lands every copy must stop saying so.
    for (const [what, source] of [['the Markdown', mdFlat], ['the page', htmlFlat]]) {
      expect(
        /the licence body is not yet in it/i.test(source),
        `${what} disagrees with public/fonts/OFL.txt about whether the licence body has landed.`
        + ' Paste the body in, drop the marker, and update both notices copies in the same change.',
      ).toBe(bodyStillMissing);
    }
    expect(mdFlat).toContain('public/fonts/OFL.txt');
  });
});

describe('the notices page ships dark (no link is lit)', () => {
  /** Every source file the application builds from. */
  function walkSrc(dir, out = []) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const abs = join(dir, entry.name);
      if (entry.isDirectory()) walkSrc(abs, out);
      else if (/\.(?:js|jsx|ts|tsx|css|html)$/.test(entry.name)) out.push(abs);
    }
    return out;
  }

  const sourceFiles = walkSrc(join(ROOT, 'src'));

  it('the scan really walked the application source (it is not looking at nothing)', () => {
    expect(sourceFiles.length).toBeGreaterThan(300);
    expect(sourceFiles.some((f) => f.endsWith('App.jsx'))).toBe(true);
  });

  it('nothing in src/ references the notices page', () => {
    const linking = sourceFiles
      .filter((abs) => /third-party-notices/i.test(readFileSync(abs, 'utf8')))
      .map((abs) => relative(ROOT, abs));
    expect(
      linking,
      'the notices page is chartered to ship dark: the link is a separate, owner-visible act.'
      + ` These files reference it: ${linking.join(', ')}`,
    ).toEqual([]);
  });

  it('the page and the Markdown both say the link is not lit yet', () => {
    expect(html).toContain('NOT LINKED.');
    expect(md).toContain('public/third-party-notices.html');
  });
});
