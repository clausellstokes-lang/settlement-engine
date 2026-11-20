#!/bin/sh
# harness.sh <db> <calls.tsv> — calls every listed function as anon, authenticated (uid 2222…) and
# service_role, each in its own transaction that is ROLLED BACK; prints sig<TAB>role<TAB>outcome.
DB=$1; CALLS=$2; export PGHOST=/var/tmp/sg PGUSER=postgres
while IFS="$(printf '\t')" read -r sig call; do
  for r in anon authenticated service_role; do
    uid=''; [ $r = authenticated ] && uid='22222222-2222-2222-2222-222222222222'
    out=$(psql -X -qAt -d $DB -v ON_ERROR_STOP=1 2>&1 <<SQL
begin;
set local statement_timeout = '5s';
select set_config('test.uid', '$uid', true) is null, set_config('request.jwt.claim.role', '$r', true) is null;
set local role $r;
select 'OK rows=' || count(*) from $call;
rollback;
SQL
)
    res=$(printf '%s' "$out" | grep -E '^(OK|ERROR)' | head -1 | sed -E 's/ERROR:  /ERR /; s/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/<uuid>/g' | cut -c1-200)
    printf '%s\t%s\t%s\n' "$sig" "$r" "$res"
  done
done < $CALLS
