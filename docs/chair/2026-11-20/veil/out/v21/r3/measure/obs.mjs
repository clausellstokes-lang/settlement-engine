import { readFileSync, readdirSync } from 'node:fs';
const RIVAL = /exclusive civic power|belongs solely to the wealthy|monopolise power here|hold the civic offices|Civic power rests with|hold the seat of power here/;
const out = [];
for (const dir of process.argv.slice(2)) {
  const T = readdirSync(dir).filter((f) => /^shard\d\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`)));
  const H = T.filter((t) => t.hidden?.length); const F = T.filter((t) => t.hidden && !t.hidden.length);
  const pool = new Set(F.flatMap((t) => ['off', 'dm'].flatMap((v) => (Array.isArray(t[v].crimeTypes) ? t[v].crimeTypes : []))));
  const c = {}; const bump = (k, s) => { (c[k] = c[k] || new Set()).add(s); };
  for (const t of H) for (const v of ['off', 'dm']) {
    const a = t[v]; const s = t.seed;
    if (a.factions.some((f) => !f.g && (f.c === 'criminal' || /thie/i.test(f.n)))) bump('criminal power (not governing) served', s);
    const g = t.stored.factions.find((f) => f.g); if (g && !a.factions.some((f) => f.g && f.n === g.n)) bump('governing row NOT served', s);
    if (a.factions.length < t.stored.factions.length && a.factions.reduce((x, f) => x + Number(f.p), 0) !== 100) bump('shares != 100 where a power is withheld', s);
    const names = new Set(a.factions.map((f) => f.n)); if (a.rels.some((r) => !(r.pair || []).every((p) => names.has(p)))) bump('relation names an unserved power', s);
    for (const x of Array.isArray(a.crimeTypes) ? a.crimeTypes : []) if (!pool.has(x)) bump(`crime type outside the hidden-free pool: ${x}`, s);
    if ((Array.isArray(a.hooks) ? a.hooks : []).some((h) => /smuggl/i.test(h)) && a.inst && !a.inst.hasSmuggling) bump('smuggling hook, no served smuggling flag', s);
    if (/beneath the walls/.test(a.guard || '') && a.inst && !a.inst.hasSmuggling) bump('gates tail beneath the walls, no served smuggling flag', s);
    if (Object.values(a.instDesc).some((d) => RIVAL.test(d || ''))) bump('rival-power description served', s);
    if (a.prose) bump('defense:criminal served', s);
    if (a.drag && a.inst && !a.inst.hasCriminalInst && t.stored.inst?.hasCriminalInst) bump('drag desc served, hasCriminalInst raised by a hidden house', s);
  }
  const keys = {}; for (const t of H) keys[t.off.key] = (keys[t.off.key] || 0) + 1; const ck = {}; for (const t of F) ck[t.off.key] = (ck[t.off.key] || 0) + 1;
  out.push(`== ${dir.split('/').pop()}: ${T.length} towns, ${H.length} with a hideable house, ${F.length} hidden-free (both Reveal settings counted per town)`);
  for (const k of Object.keys(c).sort()) out.push(`  ${String(c[k].size).padStart(3)} towns  ${k}`);
  out.push(`  derived Defense key (served, Reveal off): hidden ${JSON.stringify(keys)} | control ${JSON.stringify(ck)}`);
}
console.log(out.join('\n'));
