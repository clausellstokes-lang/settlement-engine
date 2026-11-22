// coin.mjs — READ-ONLY: is carrying crime_wave / guild_conflict related to the place's own strength of crime / guilds?
// node coin.mjs <poolDir>
import { readFileSync, readdirSync } from 'node:fs'; import { join } from 'node:path';
const dir = process.argv[2];
for (const size of ['town', 'city', 'metropolis']) {
  const recs = readdirSync(dir).filter((f) => f.startsWith(size + '-') && f.endsWith('.json')).map((f) => JSON.parse(readFileSync(join(dir, f), 'utf8')));
  const rows = recs.map((r) => ({ types: (r.history?.currentTensions || []).map((t) => t.type), ce: r.economicState?.compound?.criminalEffective ?? 0,
    crimInst: (r.institutions || []).filter((i) => i.priorityCategory === 'criminal').length, eco: r.economicState?.priorities?.economy ?? 0,
    guildFac: (r.powerStructure?.factions || []).filter((f) => /guild/i.test(f.faction || '')).length }));
  const q = (key, kind, filt = () => true) => {
    const rs = rows.filter(filt).sort((a, b) => a[key] - b[key]); const n = rs.length; const out = [];
    for (let k = 0; k < 4; k++) { const part = rs.slice(Math.floor(k * n / 4), Math.floor((k + 1) * n / 4)); out.push(`Q${k + 1}(${part[0]?.[key]?.toFixed?.(0)}..${part.at(-1)?.[key]?.toFixed?.(0)}) ${Math.round(100 * part.filter((r) => r.types.includes(kind)).length / part.length)}%`); }
    return out.join('  ');
  };
  console.log(`${size} crime_wave by criminalEffective (admitted only): ${q('ce', 'crime_wave', (r) => r.crimInst > 0)}`);
  console.log(`${size} guild_conflict by priorities.economy:          ${q('eco', 'guild_conflict')}`);
  console.log(`${size} guild_conflict by #guild-named factions:       ${[0, 1, 2].map((g) => { const p = rows.filter((r) => Math.min(r.guildFac, 2) === g); return `${g}${g === 2 ? '+' : ''}: ${p.length ? Math.round(100 * p.filter((r) => r.types.includes('guild_conflict')).length / p.length) : '-'}% (n=${p.length})`; }).join('  ')}`);
}
