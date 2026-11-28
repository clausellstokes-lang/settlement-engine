// MC (VEIL-56): trial-sanit2.sql, ON TOP OF trial-sanit.sql (never applied but to a local test database).
//   node make-trials2.mjs <trial-sanit.sql> <out file>
// _gallery_sanitize_public_json builds its answer by `out := out || ...` once a kept key (an object) or element (an array):
// each step copies the whole answer so far. Here the kept keys and values are collected into two arrays (appended in
// place) and the answer built ONCE after the loop: jsonb_object_agg over the pairs (a jsonb object's key order is its own,
// not the order of insertion, and jsonb_each never yields a key twice) and jsonb_agg in the elements' order. The keys kept,
// the values, the skips and the root pass are untouched.
import { readFileSync, writeFileSync } from 'node:fs';
const [IN, OUT] = process.argv.slice(2);
let s = readFileSync(IN, 'utf8');
const rep = (a, b, label) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${label}: found ${n} times`); s = s.replace(a, () => b); };
rep('  masked text;\n', '  masked text;\n  ks text[];      -- MC trial: the kept keys and their values, the answer built once\n  vs jsonb[];\n', 'declare');
rep("    out := '{}'::jsonb;\n    for key, child in select * from jsonb_each(value) loop", "    ks := '{}'; vs := '{}';\n    for key, child in select * from jsonb_each(value) loop", 'object start');
rep('      if sanitized is not null then\n        out := out || jsonb_build_object(key, sanitized);\n      end if;\n    end loop;',
  "      if sanitized is not null then\n        ks := array_append(ks, key); vs := array_append(vs, sanitized);\n      end if;\n    end loop;\n    out := coalesce((select jsonb_object_agg(u.k, u.v) from unnest(ks, vs) u(k, v)), '{}'::jsonb);", 'object end');
rep("    out := '[]'::jsonb;\n    for child in select jsonb_array_elements(value) loop", "    vs := '{}';\n    for child in select jsonb_array_elements(value) loop", 'array start');
rep('      if sanitized is not null then\n        out := out || jsonb_build_array(sanitized);\n      end if;\n    end loop;\n    return out;',
  "      if sanitized is not null then\n        vs := array_append(vs, sanitized);\n      end if;\n    end loop;\n    return coalesce((select jsonb_agg(u.v order by u.o) from unnest(vs) with ordinality u(v, o)), '[]'::jsonb);", 'array end');
writeFileSync(OUT, s.replace('-- MC LOCAL TRIAL ONLY', '-- MC LOCAL TRIAL ONLY (trial-sanit.sql plus the answer built once)'));
console.log('ok');
