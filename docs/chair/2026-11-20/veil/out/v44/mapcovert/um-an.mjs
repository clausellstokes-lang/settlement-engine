// R4I-MEASURE U and M: the table of one um.sh run. `node um-an.mjs <outdir>`. Exit 0 always (a measure), but UM_ASSERT=map (MAPCOVERT-RED, at the end): exit 1 on a covert carry.
import { readFileSync, readdirSync } from 'node:fs';
const O = process.argv[2];
const sh = readdirSync(O).filter((f) => /^um-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const L = (...a) => console.log(a.join(' '));
const sum = (f) => sh.reduce((a, s) => a + f(s), 0);
L(`documents ${sum((s) => s.docs)}; all done ${sh.every((s) => s.done)}; faults ${sum((s) => s.faults.length)}`); for (const s of sh) for (const f of s.faults.slice(0, 5)) L('  FAULT', f);
if (sum((s) => s.U.docs)) {
  L(`U: documents read unmarked at Reveal off: ${sum((s) => s.U.docs)}; whose stored prominentRelationship is a covert copy: ${sum((s) => s.U.covertPR)}; whose pressureSentence is: ${sum((s) => s.U.covertPS)}`);
  const c = {}; for (const s of sh) for (const [k, v] of Object.entries(s.U.carry)) { c[k] ||= { reads: 0, yes: 0, places: [] }; c[k].reads += v.reads; c[k].yes += v.yes; c[k].places.push(...(v.places || [])); }
  for (const [k, v] of Object.entries(c).sort()) L(`  ${k}: ${v.yes} of ${v.reads} reads${v.places.length ? `; places ${v.places.length}: ${v.places.slice(0, 8).join(', ')}` : ''}`);
  const m = {}; for (const s of sh) for (const [k, v] of Object.entries(s.U.marker || {})) m[k] = (m[k] || 0) + v; L('  ', JSON.stringify(m));
  for (const s of sh) for (const e of s.U.examples.slice(0, 2)) L('  e.g.', JSON.stringify(e));
}
if (sum((s) => s.M.docs)) {
  L(`M (on the projection): documents ${sum((s) => s.M.docs)}, reads ${sum((s) => s.M.reads)}; owner pages' cast persons ${sum((s) => s.M.own)} (nameless ${sum((s) => s.M.ownNoName)}, no card ${sum((s) => s.M.ownNoCard)}, shared keys ${sum((s) => s.M.ownShared)}); served cast person-reads ${sum((s) => s.M.servedPersons)}`);
  L(`  (i) shared (name, crisis, role) keys: ${sum((s) => s.M.i)}; (ii) served name differs: ${sum((s) => s.M.ii)}; (iii) nameless: ${sum((s) => s.M.iii)}; unmapped served cast ids: ${sum((s) => s.M.unmapped)}`);
  const b = {}; for (const s of sh) for (const [k, v] of Object.entries(s.M.byRead)) { b[k] ||= { reads: 0, i: 0, ii: 0, iii: 0, unmapped: 0 }; for (const q of Object.keys(v)) b[k][q] += v[q]; }
  for (const [k, v] of Object.entries(b)) L(`  ${k}: ${JSON.stringify(v)}`);
  const st = sh.flatMap((s) => s.M.stops); L(`  STOPS listed: ${st.length}`); for (const x of st.slice(0, 20)) L('   ', JSON.stringify(x).slice(0, 300));
}
// MAPCOVERT-RED (VEIL-44) unit 2, THE ONE ADDITION: UM_ASSERT=map. The count, per door x marker x key, of the map reads at
// Reveal OFF (get_gallery_map's member, its page fetchGalleryMap, import_gallery_map's member) that carry the stored COVERT
// copy (prominentRelationship) or the stored COVERT-telling sentence (pressureSentence), with the places; EXIT 1 when any
// count is above zero, or when no document was read unmarked (a run that read nothing proves nothing). Read from the
// probe's own carry counts (um.probe.jsx, UM_U=1), unchanged.
if (process.env.UM_ASSERT === 'map') {
  const DOORS = ['get_gallery_map member', 'map page (fetchGalleryMap)', 'import_gallery_map member'];
  const KEYS = ['prominentRelationship = the stored COVERT copy', 'pressureSentence = the stored COVERT-telling sentence'];
  const c = {}; for (const s of sh) for (const [k, v] of Object.entries(s.U.carry)) { c[k] ||= { reads: 0, yes: 0, places: [] }; c[k].reads += v.reads; c[k].yes += v.yes; c[k].places.push(...(v.places || [])); }
  let carried = 0;
  L(`UM_ASSERT=map: documents read unmarked ${sum((s) => s.U.docs)}; stored covert copies ${sum((s) => s.U.covertPR)}; stored covert-telling sentences ${sum((s) => s.U.covertPS)}`);
  for (const door of DOORS) for (const mk of ['unmarked', 'default', 'hand']) for (const key of KEYS) {
    const v = c[`${door} | ${mk} | off | ${key}`] || { reads: 0, yes: 0, places: [] };
    carried += v.yes;
    L(`  ASSERT ${door} | ${mk} | off | ${key}: ${v.yes} of ${v.reads} reads${v.places.length ? `; places ${v.places.length}: ${v.places.slice(0, 8).join(', ')}` : ''}`);
  }
  for (const door of DOORS) for (const mk of ['unmarked', 'default', 'hand']) { const v = c[`${door} | ${mk} | off | NO BODY`]; if (v) L(`  (no body) ${door} | ${mk} | off: ${v.yes}`); }
  const docs = sum((s) => s.U.docs);
  L(`UM_ASSERT=map: ${carried} map reads at Reveal off carry a covert copy or a covert-telling sentence; ${docs ? (carried ? 'RED: exit 1' : 'GREEN: exit 0') : 'NOTHING READ: exit 1'}`);
  if (carried || !docs) process.exitCode = 1;
}
