// MC (VEIL-56): the LOCAL TRIAL COPIES for PROPOSAL.md, cut mechanically from a tree's 212 and 210 (never applied but to a
// local test database).   node make-trials.mjs <212 file> <210 file> <out dir>
//  fixed-salt.sql    _gallery_veil with its one salt a call made a constant: for the differential only (both databases)
//  trial-roster.sql  _gallery_veil_roster_choices with its four N x N searches of `pub` HOISTED: each search's costly test
//                    (_gallery_veil_copy_names over `pub`'s copies) run ONCE a call into a short list, the per-copy
//                    match (@>, the id) then read against that list. The same predicate, and-ed in another order.
//  trial-sanit.sql   _gallery_sanitize_public_json called only for a child that is an object or an array: a scalar child
//                    (string, number, boolean, JSON null) is returned as it is by the function's own last line, so the
//                    call is skipped, not the rule.
import { readFileSync, writeFileSync } from 'node:fs';
const [F212, F210, O] = process.argv.slice(2);
const t212 = readFileSync(F212, 'utf8'); const t210 = readFileSync(F210, 'utf8');
const cut = (t, head, end = 'end $$;') => { const a = t.indexOf(head); if (a < 0) throw new Error(`no ${head}`); return t.slice(a, t.indexOf(end, a) + end.length); };
const rep = (s, a, b, label) => { const n = s.split(a).length - 1; if (n !== 1) throw new Error(`${label}: found ${n} times`); return s.replace(a, () => b); };
const HDR = '-- MC LOCAL TRIAL ONLY (never applied but to a local test database)\n';

let v = cut(t212, 'create or replace function public._gallery_veil(pub jsonb, overrides jsonb, link boolean, copy boolean default false)');
v = rep(v, 'salt text := gen_random_uuid()::text;', "salt text := 'mc-fixed-salt-for-the-differential';", 'salt');
writeFileSync(`${O}/fixed-salt.sql`, `${HDR}${v}\n`);

let r = cut(t212, 'create or replace function public._gallery_veil_roster_choices(doc jsonb, pub jsonb)');
r = rep(r, '  wn_ids text[];\n', '  wn_ids text[];\n  hz jsonb;   -- MC trial: `pub`\'s copies that name a withheld power, found once\n  hg jsonb;\n  hm jsonb;\n', 'declare');
// (1) the conflicts, both homes
r = rep(r, `        s := jsonb_set(s, pth, coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> pth) with ordinality x(e, o)
          where not (public._gallery_veil_copy_names('conflict', e, wn_ids, hits)
                     or (jsonb_typeof(e) = 'object' and exists (select 1 from jsonb_array_elements(case when jsonb_typeof(p #> pth) = 'array' then p #> pth else '[]' end) z
                                                                 where z @> e and public._gallery_veil_copy_names('conflict', z, wn_ids, hits))))), '[]'));`,
`        hz := coalesce((select jsonb_agg(z) from jsonb_array_elements(case when jsonb_typeof(p #> pth) = 'array' then p #> pth else '[]' end) z
                         where public._gallery_veil_copy_names('conflict', z, wn_ids, hits)), '[]');
        s := jsonb_set(s, pth, coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> pth) with ordinality x(e, o)
          where not (public._gallery_veil_copy_names('conflict', e, wn_ids, hits)
                     or (jsonb_typeof(e) = 'object' and exists (select 1 from jsonb_array_elements(hz) z where z @> e)))), '[]'));`, 'conflicts');
// (2) the tensions
r = rep(r, `    if jsonb_typeof(s #> '{history,currentTensions}') = 'array' then
      s := jsonb_set(s, '{history,currentTensions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> '{history,currentTensions}') with ordinality x(e, o)
        where not (public._gallery_veil_copy_names('tension', e, wn_ids, hits)
                   or (jsonb_typeof(e) = 'object' and exists (select 1 from jsonb_array_elements(case when jsonb_typeof(p #> '{history,currentTensions}') = 'array' then p #> '{history,currentTensions}' else '[]' end) z
                                                               where z @> e and public._gallery_veil_copy_names('tension', z, wn_ids, hits))))), '[]'));`,
`    if jsonb_typeof(s #> '{history,currentTensions}') = 'array' then
      hz := coalesce((select jsonb_agg(z) from jsonb_array_elements(case when jsonb_typeof(p #> '{history,currentTensions}') = 'array' then p #> '{history,currentTensions}' else '[]' end) z
                       where public._gallery_veil_copy_names('tension', z, wn_ids, hits)), '[]');
      s := jsonb_set(s, '{history,currentTensions}', coalesce((select jsonb_agg(e order by o) from jsonb_array_elements(s #> '{history,currentTensions}') with ordinality x(e, o)
        where not (public._gallery_veil_copy_names('tension', e, wn_ids, hits)
                   or (jsonb_typeof(e) = 'object' and exists (select 1 from jsonb_array_elements(hz) z where z @> e)))), '[]'));`, 'tensions');
// (3) the goals and (4) the memberships: `pub`'s naming goals and memberships listed once, with their person's id as text
r = rep(r, `    if jsonb_typeof(s -> 'npcs') = 'array' then
      s := jsonb_set(s, '{npcs}', (select coalesce(jsonb_agg(case when jsonb_typeof(n) <> 'object' then n else
          (n - (select coalesce(array_agg(k), '{}') from unnest(array['faction', 'factionAffiliation', 'affiliation', 'factionId']) k`,
`    if jsonb_typeof(s -> 'npcs') = 'array' then
      hg := coalesce((select jsonb_agg(jsonb_build_object('i', public._gallery_veil_id_text(pq -> 'id'), 'g', pq -> 'goal'))
                        from jsonb_array_elements(case when jsonb_typeof(p -> 'npcs') = 'array' then p -> 'npcs' else '[]' end) pq
                       where jsonb_typeof(pq) = 'object' and public._gallery_veil_copy_names('goal', pq -> 'goal', wn_ids, hits)), '[]');
      hm := coalesce((select jsonb_agg(jsonb_build_object('i', public._gallery_veil_id_text(pq -> 'id'), 'z', z))
                        from jsonb_array_elements(case when jsonb_typeof(p -> 'npcs') = 'array' then p -> 'npcs' else '[]' end) pq,
                             jsonb_array_elements(case when jsonb_typeof(pq -> 'memberships') = 'array' then pq -> 'memberships' else '[]' end) z
                       where jsonb_typeof(pq) = 'object' and public._gallery_veil_copy_names('member', z, wn_ids, hits)), '[]');
      s := jsonb_set(s, '{npcs}', (select coalesce(jsonb_agg(case when jsonb_typeof(n) <> 'object' then n else
          (n - (select coalesce(array_agg(k), '{}') from unnest(array['faction', 'factionAffiliation', 'affiliation', 'factionId']) k`, 'npcs head');
r = rep(r, `                   or exists (select 1 from jsonb_array_elements(case when jsonb_typeof(p -> 'npcs') = 'array' then p -> 'npcs' else '[]' end) pq
                               where jsonb_typeof(pq) = 'object' and public._gallery_veil_copy_names('goal', pq -> 'goal', wn_ids, hits)
                                 and case when public._gallery_veil_id_text(n -> 'id') <> '' then public._gallery_veil_id_text(pq -> 'id') = public._gallery_veil_id_text(n -> 'id')
                                          else (pq -> 'goal') @> (n -> 'goal') end))`,
`                   or exists (select 1 from jsonb_array_elements(hg) pq
                               where case when public._gallery_veil_id_text(n -> 'id') <> '' then (pq ->> 'i') = public._gallery_veil_id_text(n -> 'id')
                                          else (pq -> 'g') @> (n -> 'goal') end))`, 'goals');
r = rep(r, `exists (select 1 from jsonb_array_elements(case when jsonb_typeof(p -> 'npcs') = 'array' then p -> 'npcs' else '[]' end) pq,
                                                       jsonb_array_elements(case when jsonb_typeof(pq -> 'memberships') = 'array' then pq -> 'memberships' else '[]' end) z
                                          where jsonb_typeof(pq) = 'object' and (public._gallery_veil_id_text(n -> 'id') = '' or public._gallery_veil_id_text(pq -> 'id') = public._gallery_veil_id_text(n -> 'id')) and z @> m and public._gallery_veil_copy_names('member', z, wn_ids, hits))`,
`exists (select 1 from jsonb_array_elements(hm) pz
                                          where (public._gallery_veil_id_text(n -> 'id') = '' or (pz ->> 'i') = public._gallery_veil_id_text(n -> 'id')) and (pz -> 'z') @> m)`, 'memberships');
writeFileSync(`${O}/trial-roster.sql`, `${HDR}${r}\n`);

let s = cut(t210, 'create or replace function public._gallery_sanitize_public_json(value jsonb, path text[] default \'{}\')', '\nend;\n$$;');
s = rep(s, '      sanitized := public._gallery_sanitize_public_json(child, path || key);',
  "      sanitized := case when jsonb_typeof(child) in ('object', 'array') then public._gallery_sanitize_public_json(child, path || key) else child end;", 'object arm');
s = rep(s, '      sanitized := public._gallery_sanitize_public_json(child, path);',
  "      sanitized := case when jsonb_typeof(child) in ('object', 'array') then public._gallery_sanitize_public_json(child, path) else child end;", 'array arm');
writeFileSync(`${O}/trial-sanit.sql`, `${HDR}${s}\n`);
console.log('ok');
