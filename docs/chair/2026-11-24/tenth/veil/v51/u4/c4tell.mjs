// VEIL-51 UNIT 4, V14 (4): THE SIZE OF THE PROPOSED MARKER's TELL (offline, the twin only; no lane instrument edited):
//   node c4tell.mjs <R5D tree (aa54a6791)> <stored dir>
// The marker (C4-STOP.md): a row carries it iff its STORED desc has a standing tail (R5D's reference cut). On every twin read of every
// stored place (the settings DESCARM reads: own, g:<bits>, allOpen, off, the hand hide of every hideable house; Reveal off and DM;
// the gallery door, and the player view for link/map), a SERVED row's marker DISAGREES with reader S over the SERVED roster when the
// row is marked and S writes no tail, or unmarked and S writes one. On a read that hides nothing a disagreement is the baseline
// (S's own misses); ON A HIDING READ a disagreement the same row does not show on the place's nothing-hidden read is THE TELL: the
// reader learns the roster held a power the read withholds. Counts: hiding reads, reads with a tell, places with a tell.
import { readFileSync, readdirSync } from 'node:fs';
const [, , TREE, DIR] = process.argv;
const PR = await import(`${TREE}/src/domain/veil/pageRederive.js`);
const V = await import(`${TREE}/src/domain/display/galleryVeil.js`);
const SW = await import(`${TREE}/src/domain/display/criminalVeilSwitch.js`);
const { isHideableHouse } = await import(`${TREE}/src/domain/people/cardVeil.js`);
const SF = await import(`${TREE}/scripts/veil/standingForms.mjs`);
const rows = SF.compileRows(SF.readTable().forms);
const clone = (v) => JSON.parse(JSON.stringify(v));
const arr = (v) => (Array.isArray(v) ? v : []);
const OPEN = ['block:services.criminal', 'block:defense.criminalStructure', 'block:power.criminalUnderside', 'tab:plot_hooks'];
const opened = (as) => as.map((a) => ({ address: a, hidden: false }));
const settingsOf = (stored, dm) => { // DESCARM's (0ff0773c7), carried
  const pub = V.galleryPayloadFor(clone(stored), { shareDm: dm, memberOverrides: null });
  const model = V.curateModelFor(pub, []); const present = SW.presentCriminalGroupings(pub);
  const out = { own: opened(OPEN) };
  for (let b = 0; b < 7; b += 1) { const bits = [4, 2, 1].map((x) => ((b & x) ? '1' : '0')).join(''); out[`g:${bits}`] = opened(['tab:plot_hooks', ...OPEN.slice(0, 3).filter((_g, i) => bits[i] === '1')]); }
  out.allOpen = SW.setCriminalVeil(opened(OPEN), model.defaults, false, present, model).filter((d) => !String(d.address).startsWith('card:institution:'));
  out.off = SW.setCriminalVeil(opened(OPEN), model.defaults, true, present, model);
  out.hide = [...opened(OPEN), ...arr(stored.institutions).filter((h) => isHideableHouse(h)).map((h) => ({ address: `card:institution:${V.CARD_KINDS.institution.idOf(h)}`, hidden: true }))];
  return out;
};
const names = (d) => new Set(arr(d?.powerStructure?.factions).map((f) => f.faction));
let places = 0, reads = 0, hiding = 0, tellReads = 0; const tellPlaces = new Set(); const ex = [];
for (const f of readdirSync(DIR).filter((x) => /^r3m.*\.json$/.test(x)).sort()) {
  const stored = JSON.parse(readFileSync(`${DIR}/${f}`, 'utf8')); places += 1;
  const marked = new Map(arr(stored.powerStructure?.factions).map((p) => [p.faction, !!SF.cutDesc(p.desc || '', rows)]));
  const verdicts = (d) => { const page = PR.rederiveStanding(clone(d)); const m = new Map(); for (const p of arr(page?.powerStructure?.factions)) m.set(p.faction, (marked.get(p.faction) ?? false) !== !!SF.cutDesc(p.desc || '', rows)); return m; };
  const all = names(stored); let base = null;
  for (const dm of [false, true]) for (const [setting, deltas] of Object.entries(settingsOf(stored, dm))) {
    const ov = V.writeShareVeil({}, deltas, { mode: 'live', at: '2026-11-01T00:00:00.000Z' });
    for (const door of dm ? ['gallery'] : ['gallery', 'player']) {
      const d = V.projectShareVeil(V.galleryPayloadFor(clone(stored), { shareDm: door === 'player' ? false : dm, memberOverrides: ov }), ov);
      reads += 1; const served = names(d); const hides = [...all].some((n) => !served.has(n));
      const v = verdicts(d);
      if (!hides) { if (!base) base = v; continue; }
      hiding += 1;
      const tells = [...v].filter(([n, dis]) => dis && !(base ?? verdicts(stored)).get(n));
      if (tells.length) { tellReads += 1; tellPlaces.add(f); if (ex.length < 8) ex.push(`${f} dm=${dm} ${setting} ${door}: ${tells.map(([n]) => `${n} (${marked.get(n) ? 'marked, S writes none' : 'unmarked, S writes one'})`).join('; ')}`); }
    }
  }
}
console.log(`places ${places} | twin reads ${reads} | hiding ${hiding} | hiding reads WITH A TELL ${tellReads} | places ${tellPlaces.size}`);
for (const e of ex) console.log(`  ${e}`);
