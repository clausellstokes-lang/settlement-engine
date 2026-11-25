// V27 twin probe: the 107 (3) record, hand-hidden host, Reveal off and DM, with and without the stored row
const W = process.argv[2];
const veil = await import(`${W}/src/domain/display/galleryVeil.js`);
const rec = JSON.parse((await import('node:fs')).readFileSync('/var/tmp/v51/out/p1/stored-today/r3m-city-none-0-37.json', 'utf8'));
const x = structuredClone(rec.data || rec.settlement || rec);
x.powerStructure.factions = x.powerStructure.factions.map((f) => ((f.name || f.faction) === 'Craft Guilds' ? { ...f, hidden: true } : f));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
for (const dm of [false, true]) for (const st of [null, x]) {
  const out = veil.projectShareVeil(veil.galleryPayloadFor(structuredClone(x), { shareDm: dm, memberOverrides: ov }), ov, st ? { stored: st } : undefined);
  const tc = (out.powerStructure?.factions || []).find((f) => f.name === 'The Trade Compact');
  console.log(`dm=${dm} stored=${!!st}: Trade Compact desc ${tc && 'desc' in tc ? JSON.stringify(tc.desc.slice(0, 40)) : 'WITHHELD'}; served ${(out.powerStructure?.factions || []).map((f) => (f.name || f.faction) + (('desc' in f) ? '' : '(-desc)')).join(', ')}`);
}
