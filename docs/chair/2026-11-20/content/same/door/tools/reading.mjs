#!/usr/bin/env node
/**
 * door/tools/reading.mjs — SAME-2 brief D part 2, THE FIRST READING (measure only). Reads a rendered door run (150 a
 * size, six sizes) with scripts/sameness-census.mjs's own measure (measureSlots, the door's slot key and attribution)
 * and writes every printed slot x size as JSON: places, distinct, top places, shareAll, shareIn, SEEN, its meet (`by`),
 * the register's class, its stored paths (word for word or by containment) or its composing module, and its five
 * commonest sentences, and every sentence on 15% or more of the size's places, with their places and stored paths. No render; nothing outside <out.json> is written.
 * Usage: node docs/chair/2026-11-20/content/same/door/tools/reading.mjs <run dir> <out.json>
 */
import { writeFileSync } from 'node:fs';
import {
  SIZES, attributionOf, byOf, measureSlots, moduleIndex, moduleOf, readRegister, readSize, sentencesOf, slotKey, storedHeads,
} from '../../../../../../../scripts/sameness-census.mjs';

const [dir, out] = process.argv.slice(2);
const reg = readRegister();
const idx = moduleIndex();
/** @type {Record<string, any>} */ const slots = {};
for (const size of SIZES) {
  const rows = readSize(dir, size);
  const t = measureSlots(rows);
  /** @type {Map<string, Map<string, { places: Set<number>, paths: Set<string> }>>} */ const by = new Map();
  rows.forEach((row, i) => {
    const heads = storedHeads(row.stored);
    for (const [surface, lines] of Object.entries(row.surfaces)) for (const line of lines) for (const s of sentencesOf(line[0])) {
      const k = slotKey(surface, line); let m = by.get(k); if (!m) { m = new Map(); by.set(k, m); }
      let o = m.get(s); if (!o) { o = { places: new Set(), paths: new Set() }; m.set(s, o); }
      o.places.add(i); for (const p of attributionOf(s, row.stored, heads)) o.paths.add(p);
    }
  });
  for (const [slot, m] of t) {
    const o = (slots[slot] ||= { slot, cls: reg.rows[slot]?.class || '(no row)', sizes: {}, paths: {}, module: null, contained: false });
    const tops = [...(by.get(slot) || new Map())].map(([s, x]) => ({ s, places: x.places.size, paths: [...x.paths].sort() }))
      .sort((a, b) => b.places - a.places || (a.s < b.s ? -1 : 1)).filter((x, j) => j < 5 || x.places >= 0.15 * rows.length);
    o.sizes[size] = { places: m.places, of: m.of, distinct: m.distinct, perPlace: m.perPlace, topPlaces: m.topPlaces, shareAll: m.shareAll, shareIn: m.shareIn, seen: m.seen, by: byOf(m), sentence: m.sentence, tops };
    for (const [p, n] of Object.entries(m.paths)) o.paths[p] = (o.paths[p] || 0) + n;
    if (m.contained) o.contained = true;
    if (!Object.keys(m.paths).length && !o.module) o.module = moduleOf(m.sentence, idx)?.file || 'unfound';
  }
  console.log(`${size}: ${rows.length} places, ${t.size} slots`);
}
writeFileSync(out, JSON.stringify({ dir, slots }));
console.log(`slots ${Object.keys(slots).length}`);
