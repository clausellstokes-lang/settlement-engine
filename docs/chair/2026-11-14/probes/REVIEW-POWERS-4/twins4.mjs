// REVIEW-POWERS-4 twins4.mjs — BASE= TIP= node twins4.mjs : the claim ladders' NATIVE lines that carry the clause the stage's
// rungs now condition (a council; a merchant power ahead; any merchant power; a merchant power stronger than this one), read
// against the final roster at the tip, and whether the same power printed the same opening at the base (CARRIED) or not.
import fs from 'node:fs'; import zlib from 'node:zlib';
const L = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
const B = L(process.env.BASE), T = L(process.env.TIP);
const MERCHANT = /merchant|trade|commerc|consortium|mercantile/i, COUNCIL = /council|assembly|senate|parliament|moot/i;
const LINES = {
  council: ['present in council discussions through intermediaries', (f, F, gov) => COUNCIL.test(gov?.faction || '')],
  outpaced: ['outpaced by merchant capital', (f, F) => F.some((m) => m !== f && MERCHANT.test(m.faction) && m.power > f.power)],
  competitive: ['competitive with merchant capital', (f, F) => F.some((m) => m !== f && MERCHANT.test(m.faction))],
  notyet: ['without yet being the dominant commercial voice', (f, F, gov) => MERCHANT.test(gov?.faction || '') || F.some((m) => m !== f && MERCHANT.test(m.faction) && m.power > f.power)],
};
const C = {};
for (const [seed, t] of T) { const b = B.get(seed); const F = t.powerStructure.factions; const gov = F.find((f) => f.isGoverning); const bf = new Map((b?.powerStructure?.factions || []).map((f) => [f.faction, f]));
  for (const f of F) for (const [k, [needle, ok]] of Object.entries(LINES)) { if (!String(f.desc).includes(needle)) continue;
    const truth = ok(f, F, gov); const atBase = String(bf.get(f.faction)?.desc || '').includes(needle);
    const c = (C[`${k} · ${truth ? 'TRUE' : 'FALSE'} · ${atBase ? 'same at base' : 'NEW at tip'}`] ||= { n: 0, towns: new Set(), ex: [] }); c.n++; c.towns.add(seed);
    if (c.ex.length < 8) c.ex.push(`${seed} ${f.faction} ${f.power}/${f.powerLabel} gov=${gov?.faction} | ${F.map((x) => x.faction + ':' + x.power).join(', ')} :: ${String(f.desc).slice(0, 200)}`); } }
for (const [k, c] of Object.entries(C).sort()) { console.log(`${k} :: ${c.n} prints in ${c.towns.size} towns`); if (/FALSE/.test(k)) for (const e of c.ex.slice(0, 4)) console.log('   ', e); }
