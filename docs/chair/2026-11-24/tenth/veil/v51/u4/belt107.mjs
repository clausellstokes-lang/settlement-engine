// VEIL-51 N3 probe: why R5D's belt serves The Trade Compact's base naming its hidden host (107 (3)). Offline, twin only.
const W = '/home/user/wt/r5desc';
const veil = await import(`${W}/src/domain/display/galleryVeil.js`);
const rec = JSON.parse((await import('node:fs')).readFileSync('/var/tmp/v51/out/p1/stored-today/r3m-city-none-0-37.json', 'utf8'));
const t = rec.data || rec.settlement || rec;
const x = structuredClone(t);
x.powerStructure.factions = x.powerStructure.factions.map((f) => ((f.name || f.faction) === 'Craft Guilds' ? { ...f, hidden: true } : f));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
for (const dm of [false, true]) {
  const payload = veil.galleryPayloadFor(structuredClone(x), { shareDm: dm, memberOverrides: ov });
  const pf = (payload.powerStructure?.factions || []).map((f) => `${f.faction}|${f.name ?? ''}|hidden=${f.hidden ?? ''}|${String(f.desc ?? '<none>').slice(0, 40)}`);
  const out = veil.projectShareVeil(payload, ov);
  const of = (out.powerStructure?.factions || []).map((f) => `${f.faction}|${f.name ?? ''}|${String(f.desc ?? '<none>').slice(0, 60)}`);
  console.log(`dm=${dm}\n  payload (pub):\n    ${pf.join('\n    ')}\n  served:\n    ${of.join('\n    ')}`);
}
