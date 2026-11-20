#!/bin/sh
# doors-anon-values.sh <db> <calls.tsv> <uuid>... — as doors-anon.sh, but prints each completed call's VALUE (first 120
# characters of the rows, aggregated), so a scalar door that answers for a real row is visible (SEC-GRANTS-2).
DB=$1; CALLS=$2; shift 2; export PGHOST=/var/tmp/sg PGUSER=postgres
while IFS="$(printf '\t')" read -r sig call; do
  for u in "$@"; do
    c=$(printf '%s' "$call" | sed "s/22222222-2222-2222-2222-222222222222/$u/g")
    r=$(psql -X -qAt -d $DB 2>&1 <<SQL | grep -E '^(OK|ERROR)' | head -1 | cut -c1-160
begin;
set local statement_timeout = '5s';
select set_config('request.jwt.claim.role', 'anon', true) is null, set_config('test.uid', '', true) is null;
set local role anon;
select 'OK rows=' || count(*) || ' ' || left(coalesce(string_agg(x::text, ';'), ''), 120) from $c x;
rollback;
SQL
)
    case "$r" in OK*) printf '%s\t%s\t%s\n' "$sig" "$u" "$r";; esac
  done
done < $CALLS
