#!/bin/sh
# run213.sh <migdir 001..210[+211,212]> <migration 213 file> <outdir> — the proof of migration 213 (SEC-GRANTS-2):
# four scratch databases from the same chain: `pre` (the chain as it stands), `post` (213 applied, twice), `posta`
# (EMERGENCY_REVOKE.sql first, then 213: production's history, the owner's report of 02:48 UTC) and `postt` (the
# emergency script AND the ticket thread's two lines the chair gave the owner, then 213). The ACLs and bodies of every
# function compared across post, posta and postt; the reader's calls, the admin doors, the actor class, the ticket probe, the product flows, the
# visitor closure and the full call harness on pre and post; outputs into <outdir>.
set -u
MIG=$1; M213=$2; OUT=$3; P=$(cd "$(dirname "$0")" && pwd); SEC=$(cd "$P/.." && pwd)
export PGHOST=/var/tmp/sg PGUSER=postgres
mkdir -p $OUT
for db in pre post posta postt; do
  sh $P/chain.sh $db $MIG 2>&1 | grep -v NOTICE
done
psql -qX -d posta -v ON_ERROR_STOP=1 -f $SEC/EMERGENCY_REVOKE.sql > $OUT/emergency.txt 2>&1; echo "posta: emergency script exit=$?"
psql -qX -d postt -v ON_ERROR_STOP=1 -f $SEC/EMERGENCY_REVOKE.sql > /dev/null 2>&1; echo "postt: emergency script exit=$?"
psql -qX -d postt -v ON_ERROR_STOP=1 -c "revoke execute on function public.list_ticket_thread(uuid) from public, anon;" -c "grant execute on function public.list_ticket_thread(uuid) to authenticated, service_role;"; echo "postt: ticket lines exit=$?"
for db in post posta postt; do
  psql -qX -d $db -1 -v ON_ERROR_STOP=1 -f $M213 > $OUT/apply213-$db-1.txt 2>&1; echo "$db: 213 run 1 exit=$?"
  psql -qX -d $db -1 -v ON_ERROR_STOP=1 -f $M213 > $OUT/apply213-$db-2.txt 2>&1; echo "$db: 213 run 2 exit=$?"
done
ACL="select p.oid::regprocedure::text, coalesce(array_to_string(array(select x::text from unnest(p.proacl) x order by 1),','),'<default>'), md5(pg_get_functiondef(p.oid)) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prokind in ('f','p') order by 1"
for db in post posta postt; do psql -qXAt -d $db -c "$ACL" > $OUT/acl-$db.txt; done
if cmp -s $OUT/acl-post.txt $OUT/acl-posta.txt && cmp -s $OUT/acl-post.txt $OUT/acl-postt.txt; then echo "ALL HISTORIES: identical ACLs and bodies ($(wc -l < $OUT/acl-post.txt) functions)"; else echo "HISTORIES DIFFER"; fi
for db in pre post; do
  psql -qX -d $db -v DBNAME=$db -f $P/plant.sql
  psql -qXAt -d $db -f $P/plant2.sql | grep -vE "^f(\|f)?$"
done
psql -qXAt -d pre -f $P/calls.sql > $OUT/calls.tsv
for db in pre post; do
  psql -qXAt -d $db -f $P/visitor-closure.sql > $OUT/visitor-closure-$db.txt
  psql -qXAt -d $db -f $P/calls.sql > $OUT/open-$db.tsv
  psql -qX -d $db -f $P/reader.sql 2>&1 | grep -vE "^f(\|f)?$" > $OUT/reader-$db.txt
  psql -qX -d $db -f $P/flows.sql 2>&1 | grep -vE "^f(\|f)?$" > $OUT/flows-$db.txt
  psql -qX -d $db -f $P/flows213.sql 2>&1 | grep -vE "^f(\|f)?$" | sed 's#psql:[^ ]*flows213.sql:##' > $OUT/flows213-$db.txt
  psql -qX -d $db -f $P/admin-doors.sql 2>&1 | grep -vE "^f(\|f)?$" | sed 's#psql:[^ ]*admin-doors.sql:##' > $OUT/admin-doors-$db.txt
  psql -qX -d $db -f $P/actor.sql 2>&1 | grep -vE "^f(\|f)?$" | sed 's#psql:[^ ]*actor.sql:##' > $OUT/actor-$db.txt
  psql -qX -d $db -f $P/ticket.sql 2>&1 | grep -vE "^f(\|f)?$" | sed 's#psql:[^ ]*ticket.sql:##' > $OUT/ticket-$db.txt
  sh $P/harness.sh $db $OUT/calls.tsv > $OUT/harness-$db.tsv
done
