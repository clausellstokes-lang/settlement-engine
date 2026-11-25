// VEIL-51 UNIT 4, V14 CONDITION (4)'s DECIDING COUNT (offline; no server; no instrument of the lane edited):
//   node c4count.mjs <R5D tree (aa54a6791)> <stored dir>...
// For every stored power of every stored document (the owner's whole roster = a read that hides NOTHING), R5D's own page reader
// (`pageRederive.js :: rederiveStanding`, not authoritative) re-writes the desc: base (its own cut) + S's tail over the roster.
// Classes: SAME (byte-equal); ADDED (the stored desc had NO tail, S writes one: B2's STOP class); CHANGED (both have a tail, they
// differ); DROPPED (stored tail, S writes none). For ADDED rows: which of the row's keys could mark them, and whether each key is
// SERVED on the twin's nothing-hidden read (galleryPayloadFor + projectShareVeil, the own setting, Reveal off).
import { readFileSync, readdirSync } from 'node:fs';
const [, , TREE, ...DIRS] = process.argv;
const PR = await import(`${TREE}/src/domain/veil/pageRederive.js`);
const V = await import(`${TREE}/src/domain/display/galleryVeil.js`);
const SF = await import(`${TREE}/scripts/veil/standingForms.mjs`);
const rows = SF.compileRows(SF.readTable().forms);
const clone = (v) => JSON.parse(JSON.stringify(v));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'].map((a) => ({ address: a, hidden: false }));
for (const dir of DIRS) {
  const tally = { SAME: 0, ADDED: 0, CHANGED: 0, DROPPED: 0 }; const keysAdded = {}; const keysOther = {}; const ex = { ADDED: [], CHANGED: [], DROPPED: [] };
  const served = {}; let docs = 0;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
    const stored = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'));
    if (!Array.isArray(stored?.powerStructure?.factions)) { console.log(`  (no powerStructure.factions: ${f})`); continue; }
    docs += 1;
    const page = PR.rederiveStanding(clone(stored));
    const ov = V.writeShareVeil({}, OPEN, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    const twin = V.projectShareVeil(V.galleryPayloadFor(clone(stored), { shareDm: false, memberOverrides: ov }), ov);
    const tRows = new Map((twin?.powerStructure?.factions || []).map((r) => [r.faction, r]));
    stored.powerStructure.factions.forEach((p, i) => {
      const got = page.powerStructure.factions[i]?.desc ?? ''; const want = p.desc ?? '';
      const hadTail = !!SF.cutDesc(want, rows); const hasTail = !!SF.cutDesc(got, rows);
      const k = got === want ? 'SAME' : !hadTail && hasTail ? 'ADDED' : hadTail && !hasTail ? 'DROPPED' : 'CHANGED';
      tally[k] += 1;
      const bag = k === 'ADDED' ? keysAdded : keysOther;
      for (const key of Object.keys(p)) bag[key] = (bag[key] || 0) + 1;
      if (k === 'ADDED') for (const key of Object.keys(p)) { const t = tRows.get(p.faction); served[key] = served[key] || { served: 0, of: 0 }; served[key].of += 1; if (t && key in t) served[key].served += 1; }
      if (k !== 'SAME' && ex[k].length < 4) ex[k].push(`${f} ${p.faction}: stored "${want.slice(-90)}" | page "${got.slice(-90)}"`);
    });
  }
  console.log(`== ${dir}: documents ${docs}, powers ${Object.values(tally).reduce((a, b) => a + b, 0)}`, JSON.stringify(tally));
  console.log('  ADDED rows, their keys (count; served on the twin\'s nothing-hidden read):', Object.entries(keysAdded).map(([k, n]) => `${k} ${n} (served ${served[k]?.served}/${served[k]?.of}; on other rows ${keysOther[k] || 0})`).join('; '));
  for (const k of ['ADDED', 'CHANGED', 'DROPPED']) for (const e of ex[k]) console.log(`  ${k} ${e}`);
}
