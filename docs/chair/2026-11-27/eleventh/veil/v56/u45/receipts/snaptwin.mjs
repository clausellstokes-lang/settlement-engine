// U45B TERM (b) SNAPSHOT PLANT, THE TWIN: the 107 (3) record (VEIL-51's v27twin.mjs), Craft Guilds hand-hidden in the LIVE
// row; the share in SNAPSHOT mode, its frozen copy made by the client's own path (galleryPayloadFor: a public projection,
// the hidden power dropped). The twin is handed (a) the copy alone (the old fifth argument, src.j) and (b) [live, copy].
// Usage: node snaptwin.mjs <tree> <stored doc json>
import { readFileSync } from 'node:fs';
const [W, F] = process.argv.slice(2);
const veil = await import(`${W}/src/domain/display/galleryVeil.js`);
const rec = JSON.parse(readFileSync(F, 'utf8'));
const live = structuredClone(rec.data || rec.settlement || rec);
live.powerStructure.factions = live.powerStructure.factions.map((f) => ((f.name || f.faction) === 'Craft Guilds' ? { ...f, hidden: true } : f));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const copy = veil.galleryPayloadFor(structuredClone(live), { shareDm: false });
const copyHas = (copy.powerStructure?.factions || []).some((f) => (f.name || f.faction) === 'Craft Guilds');
const ov = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'snapshot', at: '2026-11-01T00:00:00.000Z', snapshot: copy });
for (const [k, st] of [['copy alone', copy], ['[live, copy]', [live, copy]]]) {
  const out = veil.projectShareVeil(veil.galleryPayloadFor(structuredClone(copy), { shareDm: false, memberOverrides: ov }), ov, { stored: st });
  const tc = (out.powerStructure?.factions || []).find((f) => (f.name || f.faction) === 'The Trade Compact');
  const d = tc && typeof tc.desc === 'string' ? tc.desc : null;
  console.log(`twin stored=${k}: copy holds Craft Guilds=${copyHas}; Trade Compact desc ${d === null ? 'WITHHELD' : `SERVED (names Craft Guilds: ${/craft guild/i.test(d)})`}`);
}
