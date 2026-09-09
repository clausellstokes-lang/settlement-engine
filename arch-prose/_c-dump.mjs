// READ-ONLY (design-C): dump the three worked-example blocks + DS-GEN-3's pool list from the
// shipped leaves at the product tip (laneB6). Nothing is written.
import { pathToFileURL } from 'node:url';
const B = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const load = async (f) => Object.values(await import(pathToFileURL(`${B}/src/data/dossierStateProse/${f}.generated.js`).href))[0];
const D = await load('defense'); const E = await load('economy'); const G = await load('general');
const dump = (C, id, full) => {
  const b = C[id];
  const n = Object.values(b.pools).reduce((a, v) => a + v.length, 0);
  console.log(`== ${id} | ${b.title}`);
  console.log(`   slots=${JSON.stringify(b.slots)} sectionTarget=${JSON.stringify(b.sectionTarget || null)} pools=${Object.keys(b.pools).length} variants=${n}`);
  for (const [k, vs] of Object.entries(b.pools)) {
    const slots = [...new Set(vs.flatMap((v) => v.slots))];
    const marks = [...new Set(vs.flatMap((v) => v.marks || []))];
    const sent = vs.map((v) => v.text.replace(/\{[a-z_0-9]+\}/g, 'X').split(/(?<=[.?!])\s+(?=[A-Z"'(])/).length);
    console.log(`   POOL ${JSON.stringify(k)} n=${vs.length} angles=${vs.map((v) => v.angle).join('/')} slots=${JSON.stringify(slots)} marks=${JSON.stringify(marks)} sentences=${sent.join('/')} words=${vs.map((v) => v.text.split(/\s+/).length).join('/')}`);
    if (full) for (const v of vs) console.log(`      [${v.angle}] ${v.text}`);
  }
};
dump(D, 'DS-DEF-11', true);
dump(D, 'DS-DEF-2', false);
dump(E, 'DS-ECO-1', true);
dump(G, 'DS-GEN-3', false);
