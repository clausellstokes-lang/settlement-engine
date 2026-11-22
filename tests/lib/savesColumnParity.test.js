/**
 * savesColumnParity.test.js — SS4: the GHOST-COLUMN structural remover.
 *
 * THE CLASS. The settlements-table read SELECT (saves.js supabaseList) and the
 * writers (mutationRow / supabaseSave / supabaseUpdate / gallery.js's
 * galleryMetadataPatch) are separate hand-maintained column lists. A column
 * written but dropped from the read SELECT reads back `undefined` on every
 * reload and GHOSTS — this already shipped as real data loss (the gallery
 * opt-ins, fixed in saves.js with a 2-column comment pin). That fix repaired
 * the instance; THIS walker removes the habitat: every written column must be
 * read back by supabaseList, be an exempt-with-reason column, or the gate goes
 * red naming the column.
 *
 * Source-scan (not a runtime probe) because the writers are plain object
 * literals/assignments — the exact surface a hand edit drifts on.
 *
 * CANNOT-CATCH: a column written with a computed key (`row[colVar] = …` — zero
 * instances at freeze time); writers outside saves.js/gallery.js that reach the
 * settlements table (census 2026-07-20: `.from('settlements')` appears ONLY in
 * these two files — the census test below fails if a third writer file appears).
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const savesSrc = fs.readFileSync(path.join(REPO, 'src/lib/saves.js'), 'utf8');
const gallerySrc = fs.readFileSync(path.join(REPO, 'src/lib/gallery.js'), 'utf8');

/**
 * Columns deliberately written but NOT read back by supabaseList — each with the
 * reason it is safe. Frozen 2026-07-20; SHRINK-ONLY. Adding a row here requires
 * the same scrutiny as the SELECT itself: "why is it safe for the library reload
 * to never see this column?"
 */
const EXEMPT_UNREAD = Object.freeze({
  // Ownership column: server/RLS-scoped on every read; never surfaced client-side.
  user_id: 'RLS ownership column — reads are already scoped to the owner',
  // Gallery-surface provenance/facet columns: read by the PUBLIC gallery RPCs
  // (browse/sanitize), not the owner library list. Safe from the ghost-wipe
  // mechanism because galleryMetadataPatch is MERGE-PATCH (a field is written
  // only when the caller provides it — omission preserves), so a library entry
  // that lacks the column can never clear it by re-saving.
  gallery_updated_at: 'server-side gallery provenance timestamp; merge-patch write',
  gallery_realm_arc_summary: 'public-gallery facet; merge-patch write; read via gallery RPCs',
  gallery_facet_culture: 'public-gallery facet; merge-patch write; read via gallery RPCs',
  gallery_facet_prosperity: 'public-gallery facet; merge-patch write; read via gallery RPCs',
  gallery_facet_deity: 'public-gallery facet; merge-patch write; read via gallery RPCs',
  gallery_facet_at_war: 'public-gallery facet; merge-patch write; read via gallery RPCs',
  gallery_facet_aliveness: 'public-gallery facet; merge-patch write; read via gallery RPCs',
});

/** Extract a named function's source block (brace-balanced from its BODY brace —
 *  skipping the parameter list first, so a `(metadata = {})` default-param brace
 *  cannot truncate the block to `{}`). */
function fnBlock(src, header) {
  const start = src.indexOf(header);
  if (start === -1) return null;
  // Walk past the balanced parameter list.
  let i = src.indexOf('(', start);
  let pdepth = 0;
  for (; i < src.length; i++) {
    if (src[i] === '(') pdepth++;
    else if (src[i] === ')') { pdepth--; if (pdepth === 0) break; }
  }
  // The body block opens at the next '{' after the params close.
  let depth = 0;
  i = src.indexOf('{', i);
  const open = i;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') { depth--; if (depth === 0) break; }
  }
  return src.slice(open, i + 1);
}

/** The columns supabaseList reads back. */
function selectColumns() {
  const block = fnBlock(savesSrc, 'async function supabaseList()');
  const m = block && block.match(/\.select\('([^']+)'\)/);
  if (!m) throw new Error('could not parse supabaseList SELECT — update this walker with the new shape');
  return m[1].split(',').map((s) => s.trim()).filter(Boolean);
}

/** Written column names from one function block, from `X.col =` and object-literal keys. */
function writtenColumns(block, receivers) {
  const cols = new Set();
  for (const r of receivers) {
    for (const m of block.matchAll(new RegExp(String.raw`\b${r}\.([a-z][a-z0-9_]*)\s*=`, 'g'))) cols.add(m[1]);
  }
  return cols;
}

/** Keys of the `const row = {…}` literal inside supabaseSave. */
function saveRowKeys() {
  const block = fnBlock(savesSrc, 'async function supabaseSave(');
  const lit = block && block.match(/const row = \{([\s\S]*?)\n {2}\};/);
  if (!lit) throw new Error('could not parse supabaseSave row literal — update this walker');
  return [...lit[1].matchAll(/^\s*([a-z][a-z0-9_]*):/gm)].map((m) => m[1]);
}

describe('settlements-table ghost-column walker (written ⊆ read-back ∪ exempt)', () => {
  const SELECT = new Set(selectColumns());

  const writers = [
    { label: 'saves.js mutationRow (batch create/update RPC rows)', cols: [...writtenColumns(fnBlock(savesSrc, 'function mutationRow('), ['row'])] },
    { label: 'saves.js supabaseSave row literal', cols: saveRowKeys() },
    { label: 'saves.js supabaseUpdate assignments', cols: [...writtenColumns(fnBlock(savesSrc, 'async function supabaseUpdate('), ['updates'])] },
    {
      label: 'gallery.js galleryMetadataPatch (settlements gallery columns)',
      // Both write shapes: `patch.col =` assignments AND `col:` keys in the
      // patch initializer literal (gallery_updated_at is minted there).
      cols: (() => {
        const block = fnBlock(gallerySrc, 'function galleryMetadataPatch(');
        const cols = writtenColumns(block, ['patch']);
        for (const m of block.matchAll(/\b(gallery_[a-z0-9_]+)\s*:/g)) cols.add(m[1]);
        return [...cols];
      })(),
    },
  ];

  for (const { label, cols } of writers) {
    it(`${label}: every written column is read back or exempt-with-reason`, () => {
      const ghosts = cols.filter((c) => !SELECT.has(c) && !(c in EXEMPT_UNREAD));
      expect(
        ghosts,
        `\nColumns written by ${label} but never read back by supabaseList:\n` +
        `  ${ghosts.join(', ')}\n` +
        `A written-but-unread column reads undefined after reload and GHOSTS (the\n` +
        `gallery opt-in data loss, generalized). Either add the column to the\n` +
        `supabaseList SELECT in src/lib/saves.js, or — if a public-RPC surface owns\n` +
        `its reads and the write path is merge-patch — add it to EXEMPT_UNREAD here\n` +
        `WITH the reason. Never ignore this failure.\n`,
      ).toEqual([]);
    });
  }

  it('parses are non-vacuous (a refactor must not blind the walker silently)', () => {
    expect(SELECT.size).toBeGreaterThanOrEqual(20);
    expect(writers[0].cols.length).toBeGreaterThanOrEqual(8);  // mutationRow
    expect(writers[1].cols.length).toBeGreaterThanOrEqual(8);  // supabaseSave row
    expect(writers[2].cols.length).toBeGreaterThanOrEqual(8);  // supabaseUpdate
    expect(writers[3].cols.length).toBeGreaterThanOrEqual(10); // gallery patch
  });

  it('detector self-test: a planted ghost column IS caught by the extractor', () => {
    const planted = writtenColumns("{ if (entry.zzz !== undefined) row.zzz_ghost = entry.zzz; }", ['row']);
    expect([...planted]).toContain('zzz_ghost');
  });

  it('exemption honesty: every EXEMPT_UNREAD row is still actually written somewhere', () => {
    const allWritten = new Set(writers.flatMap((w) => w.cols));
    const stale = Object.keys(EXEMPT_UNREAD).filter((c) => !allWritten.has(c));
    expect(stale, `EXEMPT_UNREAD rows no longer written — delete them: ${stale.join(', ')}`).toEqual([]);
  });

  it('writer census: only saves.js and gallery.js touch the settlements table', () => {
    // If a third file starts writing settlements rows, this walker no longer
    // covers the write surface — extend `writers` above before shipping it.
    const offenders = [];
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const fp = path.join(dir, e.name);
        if (e.isDirectory()) walk(fp);
        else if (/\.(?:js|jsx)$/.test(e.name) && fs.readFileSync(fp, 'utf8').includes("from('settlements')")) {
          offenders.push(path.relative(REPO, fp).split(path.sep).join('/'));
        }
      }
    };
    walk(path.join(REPO, 'src'));
    expect(offenders.sort()).toEqual(['src/lib/gallery.js', 'src/lib/saves.js']);
  });
});
