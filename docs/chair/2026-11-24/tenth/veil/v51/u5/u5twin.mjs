// unit 5 probe: the planted seed; each Reveal, with and without the stored row; the seven planted strings served or not;
// plus V27 (2)'s plant: a HAND-HIDDEN power named in a person's role at Reveal off
const W = process.argv[2];
const veil = await import(`${W}/src/domain/display/galleryVeil.js`);
const fs = await import('node:fs');
const rec = JSON.parse(fs.readFileSync('/var/tmp/v51/out/u5/stored-plant5/r3m-town-none-0-23.json', 'utf8'));
const base = rec.data || rec.settlement || rec;
const ov = veil.writeShareVeil({}, [], { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
const planted = (d) => JSON.stringify(d).match(/[^"]*PLANT[^"]*/g) || [];
for (const dm of [false, true]) for (const st of [false, true]) {
  const out = veil.projectShareVeil(veil.galleryPayloadFor(structuredClone(base), { shareDm: dm, memberOverrides: ov }), ov, st ? { stored: base } : undefined);
  console.log(`seed dm=${dm} stored=${st}: planted strings served ${planted(out).length}: ${JSON.stringify(planted(out)).slice(0, 200)}`);
}
// V27 (2): hand-hide a non-governing power and name it in a person's role, Reveal off
const x = structuredClone(base);
const ps = x.powerStructure.factions; const i = ps.findIndex((f) => !f.isGoverning);
const P = ps[i].faction || ps[i].name; ps[i] = { ...ps[i], hidden: true };
x.npcs[2].role = `${P} Courier HANDPLANT`;
for (const st of [false, true]) {
  const out = veil.projectShareVeil(veil.galleryPayloadFor(structuredClone(x), { shareDm: false, memberOverrides: ov }), ov, st ? { stored: x } : undefined);
  const hits = JSON.stringify(out).match(/[^"]*HANDPLANT[^"]*/g) || [];
  console.log(`hand-hidden ${P} dm=false stored=${st}: role strings served ${hits.length}: ${JSON.stringify(hits)}`);
}
