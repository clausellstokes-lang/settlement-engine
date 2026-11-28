// U45B: writes the snapshot plant's live row and overrides for the server probe (snapsql.sh). Usage: node snapprep.mjs <tree> <doc> <outdir>
import { readFileSync, writeFileSync } from 'node:fs';
const [W, F, O] = process.argv.slice(2);
const veil = await import(`${W}/src/domain/display/galleryVeil.js`);
const rec = JSON.parse(readFileSync(F, 'utf8'));
const live = structuredClone(rec.data || rec.settlement || rec);
live.powerStructure.factions = live.powerStructure.factions.map((f) => ((f.name || f.faction) === 'Craft Guilds' ? { ...f, hidden: true } : f));
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const copy = veil.galleryPayloadFor(structuredClone(live), { shareDm: false });
const snap = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'snapshot', at: '2026-11-01T00:00:00.000Z', snapshot: copy });
const liveOv = veil.writeShareVeil({}, OPEN.map((a) => ({ address: a, hidden: false })), { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
writeFileSync(`${O}/live.json`, JSON.stringify(live));
writeFileSync(`${O}/ov-snap.json`, JSON.stringify(snap));
writeFileSync(`${O}/ov-live.json`, JSON.stringify(liveOv));
console.log(`prep: copy holds Craft Guilds=${(copy.powerStructure?.factions || []).some((f) => (f.name || f.faction) === 'Craft Guilds')}`);
