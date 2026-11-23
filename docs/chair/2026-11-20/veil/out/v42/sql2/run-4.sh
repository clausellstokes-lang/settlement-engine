#!/bin/sh
# R4I-SQL-2 item 4, from /home/user/wt/sql: 001..211 + 212 + down = 001..211; THE CATALOGUE; THE SALT; the smoke reads.
# Every database local (PGHOST=/var/tmp/rv7), named sql2_*; v42sql2 = v27x211 + this tree's 212 (the brief's template).
# R4I-SQL's recipe (out/v35/r4isql: catalogue-dump.sql, c-catalogue.sql, d-smoke.mjs), read from its own folder, not re-written.
export PGHOST=/var/tmp/rv7 PGUSER=postgres
R=docs/chair/2026-11-20/veil/out/v35/r4isql; O=docs/chair/2026-11-20/veil/out/v42/sql2/logs; mkdir -p $O
M=supabase/migrations/212_share_veil_later_cures.sql; DN=supabase/rollback/212_share_veil_later_cures.down.sql
Q="psql -X -q -v ON_ERROR_STOP=1"
{
  echo "tree $(git rev-parse HEAD) 212 $(sha256sum $M | cut -d' ' -f1) down $(sha256sum $DN | cut -d' ' -f1)"
  for d in sql2_up v42sql2 sql2_smoke; do dropdb --if-exists $d; done
  createdb -T v27x211 sql2_up && $Q -d sql2_up -f $M; echo "(a) 212 on 001..211: rc=$?"
  $Q -d sql2_up -f $DN; echo "(b) the down file: rc=$?"
  for d in v27x211 sql2_up; do $Q -d $d -At -F '|' -f $R/catalogue-dump.sql > $O/4-dump-$d.txt; done
  echo "(b) functions: v27x211 $($Q -d v27x211 -Atc "select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prokind in ('f','p','w')") sql2_up $($Q -d sql2_up -Atc "select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.prokind in ('f','p','w')")"
  echo "(b) dump lines: $(wc -l < $O/4-dump-v27x211.txt) / $(wc -l < $O/4-dump-sql2_up.txt)"
  diff $O/4-dump-v27x211.txt $O/4-dump-sql2_up.txt > $O/4-dump-diff.txt; echo "(b) diff exit $? lines $(wc -l < $O/4-dump-diff.txt) (empty wanted)"
  rm -f $O/4-dump-v27x211.txt $O/4-dump-sql2_up.txt
  createdb -T v27x211 v42sql2 && $Q -d v42sql2 -f $M; echo "(c) v42sql2 = v27x211 + 212: rc=$?"
  $Q -d v42sql2 -At -F '|' -f $R/c-catalogue.sql > $O/4-catalogue-212.txt; echo "(c) the closure (all of it): $O/4-catalogue-212.txt"
  echo "(c) drawers among _gallery_veil%: $(grep -c '^_gallery_veil.*|DRAWS|' $O/4-catalogue-212.txt) ($(grep '^_gallery_veil.*|DRAWS|' $O/4-catalogue-212.txt | cut -d'|' -f1-2))"
  echo "(c) closure members not VOLATILE: $(awk -F'|' '$2 != "v"' $O/4-catalogue-212.txt | wc -l)"
  echo "(c) the reads: $(grep -E '^(get_gallery_dossier|get_unlisted_dossier|import_gallery_dossier|get_gallery_map)\(' $O/4-catalogue-212.txt | cut -d'|' -f1-2 | tr '\n' ';')"
  echo "(c) THE SALT: every function with an argument named salt, and who may execute it (public, anon, authenticated):"
  $Q -d v42sql2 -At -F '|' -c "select p.oid::regprocedure, p.provolatile,
      has_function_privilege('anon', p.oid, 'execute'), has_function_privilege('authenticated', p.oid, 'execute'),
      coalesce(p.proacl::text, '(default: public)') from pg_proc p join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and 'salt' = any(coalesce(p.proargnames, '{}')) order by 1"
  echo "(c) a salt-taking function anon or authenticated may execute: $($Q -d v42sql2 -Atc "select count(*) from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and 'salt' = any(coalesce(p.proargnames, '{}')) and (has_function_privilege('anon', p.oid, 'execute') or has_function_privilege('authenticated', p.oid, 'execute') or coalesce(p.proacl::text, '') ~ '(^|[{,])=X'  or p.proacl is null)") (0 wanted)"
  createdb -T v42sql2 sql2_smoke && node $R/d-smoke.mjs sql2_smoke > $O/4-smoke.txt 2>&1; echo "(d) the smoke reads (R4I-SQL's d-smoke.mjs): rc=$? ($O/4-smoke.txt)"
  dropdb sql2_up; dropdb sql2_smoke
} > $O/4-proofs.txt 2>&1
cat $O/4-proofs.txt
