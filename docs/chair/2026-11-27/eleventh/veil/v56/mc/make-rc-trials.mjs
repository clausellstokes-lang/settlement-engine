// MC (VEIL-56): READ-COST's LOCAL TRIAL COPIES (V11 (i) and (ii)), cut mechanically from a tree's 147 and 212 (never applied
// but to a local test database).   node make-rc-trials.mjs <147 file> <212 file> <out dir>
//  rc-keep-old.sql  the helper as built, copied under a second name (_gallery_public_tile_rows_old) for the row-for-row check
//  rc-i.sql         (i) ONE ROW's TILE: a one-row twin _gallery_public_tile_row(p_id) (the helper's body, `and s.id = p_id`),
//                   and 212's get_gallery_dossier reading the twin for its own row instead of joining the whole helper
//  rc-ii.sql        (ii) THE FACETS AS STORED COLUMNS: ten local columns mc_* holding each tile field the helper reads off
//                   `data` (backfilled by the helper's own expressions), and the helper reading the columns
//  rc-iid.sql       (ii') ONE READ OF THE DOCUMENT A ROW: the helper as built with `data` de-toasted once a row (a lateral
//                   `s.data || '{}'`) and every path read from that one copy; no column, no backfill
import { readFileSync, writeFileSync } from 'node:fs';
const [F147, F212, O] = process.argv.slice(2);
const t147 = readFileSync(F147, 'utf8'); const t212 = readFileSync(F212, 'utf8');
const HDR = '-- MC LOCAL TRIAL ONLY (never applied but to a local test database)\n';
const cut = (t, head, end) => { const a = t.indexOf(head); if (a < 0) throw new Error(`no ${head}`); const b = t.indexOf(end, a); return t.slice(a, b + end.length); };
const rep = (s, a, b, label) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${label}: found ${n} times`); return s.replace(a, () => b); };
const helper = cut(t147, 'create or replace function public._gallery_public_tile_rows()', '\n$$;');
writeFileSync(`${O}/rc-keep-old.sql`, HDR + helper.replace('public._gallery_public_tile_rows()', 'public._gallery_public_tile_rows_old()') + '\n');
// (i)
let one = helper.replace('public._gallery_public_tile_rows()', 'public._gallery_public_tile_row(p_id uuid)');
one = rep(one, '  where s.is_public = true;\n$$;', '  where s.is_public = true and s.id = p_id;\n$$;', 'twin where');
let gd = cut(t212, 'create or replace function public.get_gallery_dossier(dossier_slug text)', '\n$$;');
gd = rep(gd, '  join public._gallery_public_tile_rows() r on r.id = s.id', '  cross join lateral public._gallery_public_tile_row(s.id) r', 'dossier join');
writeFileSync(`${O}/rc-i.sql`, `${HDR}${one}\nrevoke execute on function public._gallery_public_tile_row(uuid) from public;\n${gd}\n`);
// (ii): the ten fields read off `data`, each by the helper's own expression
const FIELDS = ['population', 'terrain', 'government_type', 'magic_level', 'stability', 'primary_resource', 'threat_level', 'culture', 'prosperity', 'primary_deity'];
const sel = helper.slice(helper.indexOf('  select\n'), helper.indexOf('  from public.settlements s'));
const chunks = sel.split(/\n(?=    (?!end\b|\))[^ ])/).map((c) => c.replace(/^\n/, ''));
const exprOf = (f) => {
  const c = chunks.filter((x) => x.endsWith(` as ${f},`)); if (c.length !== 1) throw new Error(`no expr for ${f}`);
  return c[0].replace(/^    /, '').replace(new RegExp(` as ${f},$`), '');
};
const ex = Object.fromEntries(FIELDS.map((f) => [f, exprOf(f)]));
const typ = (f) => (f === 'population' ? 'integer' : 'text');
let ii = `${HDR}alter table public.settlements ${FIELDS.map((f) => `add column if not exists mc_${f} ${typ(f)}`).join(', ')};\n`;
ii += `-- the backfill writes no row's updated_at (a user trigger would move the tile's own updated_at)\nalter table public.settlements disable trigger user;\nupdate public.settlements s set ${FIELDS.map((f) => `mc_${f} = ${ex[f]}`).join(',\n  ')}\n where s.is_public = true;\nalter table public.settlements enable trigger user;\n`;
let h2 = helper;
for (const f of FIELDS) h2 = rep(h2, `${ex[f]} as ${f},`, `s.mc_${f} as ${f},`, `col ${f}`);
{ const left = h2.split('\n').filter((l) => l.includes('s.data')); if (left.length) throw new Error('(ii) still reads data: ' + left.join(' / ')); }
ii += h2 + '\n';
writeFileSync(`${O}/rc-ii.sql`, ii);
// (ii')
let h3 = helper.split('s.data').join('dd.d');
h3 = rep(h3, '  from public.settlements s\n', "  from public.settlements s\n  cross join lateral (select s.data || '{}'::jsonb as d offset 0) dd\n", 'lateral');
writeFileSync(`${O}/rc-iid.sql`, HDR + h3 + '\n');
console.log('ok', FIELDS.length, 'fields');
