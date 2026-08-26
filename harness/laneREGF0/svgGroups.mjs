/**
 * harness/laneREGF0/svgGroups.mjs — ⭐ REG-F0 · THE GROUP SCANNER.
 *
 * ⛔ THE ONE THING THIS FILE EXISTS TO AVOID: a sweep that enumerates EMITTERS FROM SOURCE.
 * A `<g id="...">` in a source file proves a WRITE SITE, not a MARK ON A PAGE — the folio's own
 * `g()` helper drops an empty body on the floor, so a source census over-counts by exactly the
 * emitters that draw nothing. Every row this lane publishes is scanned off a RENDERED artifact.
 *
 * ⚠ A GROUP'S COUNT IS ITS OWN MARKS, NOT ITS SUBTREE'S. Nested groups are reported separately
 * under their own path so a parent never absorbs a child's evidence.
 */

const MARK_TAGS = new Set([
  'path', 'line', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'text', 'image', 'use',
]);

/**
 * Scan one SVG string into per-group mark tallies.
 * @param {string} svg
 * @returns {{ groups: Array<{path:string,id:string,depth:number,marks:number,tags:Record<string,number>,subpaths:number}>, total:number, tags:Record<string,number> }}
 */
export function scanGroups(svg) {
  /** @type {Array<{path:string,id:string,depth:number,marks:number,tags:Record<string,number>,subpaths:number}>} */
  const rows = [];
  /** @type {Array<number>} */ const stack = [];   // indices into rows
  const root = { path: '(root)', id: '(root)', depth: 0, marks: 0, tags: {}, subpaths: 0 };
  rows.push(root);
  stack.push(0);
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(\/?)>/g;
  let m;
  let anon = 0;
  const totalTags = {};
  while ((m = tagRe.exec(svg))) {
    const closing = m[1] === '/';
    const tag = m[2];
    const attrs = m[3] || '';
    const selfClose = m[4] === '/';
    if (tag === 'g') {
      if (closing) { if (stack.length > 1) stack.pop(); continue; }
      const idm = attrs.match(/\bid="([^"]*)"/);
      const id = idm ? idm[1] : `(anon${++anon})`;
      const parent = rows[stack[stack.length - 1]];
      const row = {
        path: parent.path === '(root)' ? id : `${parent.path}/${id}`,
        id, depth: stack.length, marks: 0, tags: {}, subpaths: 0,
      };
      rows.push(row);
      if (!selfClose) stack.push(rows.length - 1);
      continue;
    }
    if (closing) continue;
    if (!MARK_TAGS.has(tag)) continue;
    const cur = rows[stack[stack.length - 1]];
    cur.marks += 1;
    cur.tags[tag] = (cur.tags[tag] || 0) + 1;
    totalTags[tag] = (totalTags[tag] || 0) + 1;
    if (tag === 'path') {
      const d = attrs.match(/\bd="([^"]*)"/);
      // A BATCHED path carries many subpaths; `M` starts each one. Reporting both is the
      // whole point — element count and drawn-mark count are different quantities (TC29).
      if (d) cur.subpaths += (d[1].match(/M/g) || []).length;
    } else cur.subpaths += 1;
  }
  let total = 0;
  for (const r of rows) total += r.marks;
  return { groups: rows, total, tags: totalTags };
}
