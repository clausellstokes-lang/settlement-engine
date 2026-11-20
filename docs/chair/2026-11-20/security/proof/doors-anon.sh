#!/bin/sh
# doors-anon.sh <db> <calls.tsv> <uuid>... — each DOOR called as anon with every uuid argument set to each given real
# row id in turn (a settlement, a map, a comment, a report, a user), each call rolled back. Prints OK outcomes only:
# a door that completes for anon on a real row.
DB=$1; CALLS=$2; shift 2; export PGHOST=/var/tmp/sg PGUSER=postgres
while IFS="$(printf '\t')" read -r sig call; do
  for u in "$@"; do
    c=$(printf '%s' "$call" | sed "s/22222222-2222-2222-2222-222222222222/$u/g")
    out=$(psql -X -qAt -d $DB 2>&1 <<SQL
begin;
set local statement_timeout = '5s';
select set_config('request.jwt.claim.role', 'anon', true) is null, set_config('test.uid', '', true) is null;
set local role anon;
select 'OK rows=' || count(*) from $c;
rollback;
SQL
)
    r=$(printf '%s' "$out" | grep -E '^(OK|ERROR)' | head -1 | cut -c1-120)
    case "$r" in OK*) printf '%s\t%s\t%s\n' "$sig" "$u" "$r";; esac
  done
done < $CALLS
