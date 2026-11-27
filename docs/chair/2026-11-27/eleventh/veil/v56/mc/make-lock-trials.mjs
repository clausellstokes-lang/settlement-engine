// MC (VEIL-56): the two LOCAL TRIAL COPIES of get_gallery_map for LOCK.md, cut mechanically from a tree's 212.
//   node make-lock-trials.mjs <212 file> <out dir>
// lock-after.sql: the statement with the view-count UPDATE moved from first to last (just before each of its two returns);
// lock-out.sql:   the statement with no UPDATE at all (the floor: the counter written by some other call, out of the read).
// Nothing else of the text changes; each file is applied only to a local test database.
import { readFileSync, writeFileSync } from 'node:fs';
const [F, O] = process.argv.slice(2);
const t = readFileSync(F, 'utf8');
const a = t.indexOf('create or replace function public.get_gallery_map(p_slug text)');
const b = t.indexOf('end $$;', a) + 'end $$;'.length;
const fn = t.slice(a, b);
const UPD = '  update public.saved_maps set view_count = view_count + 1 where id = row.id;\n';
if (fn.split(UPD).length !== 2) throw new Error('the UPDATE line is not there exactly once');
const without = fn.replace(UPD, '');
const RET = '    return jsonb_build_object(';
const RET2 = '  return jsonb_build_object(\n    \'slug\', row.public_slug, \'name\', row.name, \'kind\', row.share_kind,\n    \'description\', row.gallery_description, \'tags\', to_jsonb(row.gallery_tags),\n    \'imageUrl\'';
if (without.split(RET).length !== 2 || without.split(RET2).length !== 2) throw new Error('the two returns are not where expected');
const after = without.replace(RET, '    update public.saved_maps set view_count = view_count + 1 where id = row.id;\n' + RET)
  .replace(RET2, '  update public.saved_maps set view_count = view_count + 1 where id = row.id;\n' + RET2);
writeFileSync(`${O}/lock-after.sql`, `-- MC LOCAL TRIAL ONLY (never applied but to a local test database): the counter moved after the read\n${after}\n`);
writeFileSync(`${O}/lock-out.sql`, `-- MC LOCAL TRIAL ONLY (never applied but to a local test database): the counter out of the read (the floor)\n${without}\n`);
console.log('ok', fn.length, after.length, without.length);
