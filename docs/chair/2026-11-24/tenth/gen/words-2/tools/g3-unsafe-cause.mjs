#!/usr/bin/env node
/**
 * WORDS-2 · G6 #3+4 (the chair's question): of the pages that print "Law & order: Adequate" (Foundations) beside an unsafe
 * reading ("Safety: Unsafe/Dangerous/Desperate/Volatile" on the Overview, or DS-DEF-3's Unsafe lines), how many take the
 * unsafe reading from disorder INSIDE the place and how many from a threat OUTSIDE it. The cause is the record's own: the
 * safety profile's first strain (`economicState.safetyProfile.safetyStrains[0].condition`, the one the label prints), else
 * the crime-against-defence ratio (no strain: crime, inside). A MEASURE; changes nothing.
 * Usage: node g3-unsafe-cause.mjs <battery rows dir> <records dir>
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { join } from 'node:path';
const [rows, recs] = process.argv.slice(2);
const OUTSIDE = new Set(['Active Siege', 'Wartime', 'Monster Threat', 'Occupation Curfew', 'Mass Migration']);
const out = { inside: {}, outside: {} }; const seeds = { inside: [], outside: [] }; let n = 0;
for (const f of readdirSync(rows).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(join(rows, f), 'utf8')); const P = r.printed || {};
  const found = (P['Summary/Foundations'] || []).map(String);
  if (!found.includes('Law & orderAdequate')) continue;
  const ov = (P['Summary/Overview'] || []).map(String); const i = ov.indexOf('Safety');
  const label = i >= 0 ? ov[i + 1] : '';
  const def = (P['Systems/Defense'] || []).join('\n');
  const unsafeLabel = /^(Unsafe|Dangerous|Desperate|Volatile)$/.test(label);
  const def3 = /record of crimes at .* grows faster than its record of arrests|Crime at .* is outrunning the watch|The balance at .* has tipped/.test(def);
  if (!unsafeLabel && !def3) continue;
  n += 1;
  const rec = join(recs, `${r.seed}.json.gz`);
  const s = existsSync(rec) ? JSON.parse(gunzipSync(readFileSync(rec)).toString()).record : null;
  const strain = s?.economicState?.safetyProfile?.safetyStrains?.[0]?.condition ?? null;
  const cause = strain ?? 'crime against defence (no strain)';
  const side = strain && OUTSIDE.has(strain) ? 'outside' : 'inside';
  const k = `${cause} | ${unsafeLabel ? `label ${label}` : ''}${unsafeLabel && def3 ? ' + ' : ''}${def3 ? 'DEF-3 line' : ''}`;
  out[side][k] = (out[side][k] || 0) + 1; if (seeds[side].length < 5) seeds[side].push(r.seed);
}
console.log(`== ${rows}: ${n} pages with "Law & order: Adequate" beside an unsafe reading`);
for (const side of ['inside', 'outside']) {
  const tot = Object.values(out[side]).reduce((a, b) => a + b, 0);
  console.log(`-- ${side.toUpperCase()}: ${tot} (seeds ${seeds[side].join(' ')})`);
  for (const [k, c] of Object.entries(out[side]).sort((a, b) => b[1] - a[1])) console.log(`   ${String(c).padStart(3)}  ${k}`);
}
