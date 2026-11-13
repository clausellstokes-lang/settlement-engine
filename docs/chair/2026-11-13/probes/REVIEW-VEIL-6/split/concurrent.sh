#!/bin/sh
# REVIEW-VEIL-6 — WHAT 212 LOCKS, AND WHAT A READER MEETS WHILE IT IS APPLIED. Local scratch chain only.
#   concurrent.sh <database with shares at 203 + frozen 211> <2-apply-212.sql> <4-rollback.sql>
# Three readers call the gallery read and the party link in a loop (as anon would) while 212 is applied, rolled
# back and applied again, ten times over. Counted: reads answered, reads that raised (with the first message), and
# the longest any one apply or rollback took.
DB=$1; UP=$2; DOWN=$3; export PGHOST=${PGHOST:-/var/tmp/rv6} PGUSER=postgres; T=${TMPDIR:-/var/tmp}
reader() { i=0; while [ ! -f $T/rv6stop ]; do psql -qAtd $DB -c "select set_config('test.uid','',false)" -c "select count(*) from (select public_slug from public.settlements where public_slug is not null order by random() limit 4) s, lateral public.get_gallery_dossier(s.public_slug) g" -c "select count(public.get_unlisted_dossier(unlisted_slug)) from (select unlisted_slug from public.settlements where unlisted_slug is not null order by random() limit 4) s" >> $T/rv6reader.$1.out 2>> $T/rv6reader.$1.err; i=$((i+1)); done; echo "reader $1: $i rounds"; }
rm -f $T/rv6stop $T/rv6reader.*; reader 1 & reader 2 & reader 3 &
max=0; for n in 1 2 3 4 5 6 7 8 9 10; do for f in $UP $DOWN; do t0=$(date +%s%N); psql -qd $DB -v ON_ERROR_STOP=1 -f $f > /dev/null 2>> $T/rv6apply.err || echo "APPLY FAILED: $f"; ms=$(( ($(date +%s%N) - t0) / 1000000 )); [ $ms -gt $max ] && max=$ms; sleep 0.3; done; done
psql -qd $DB -v ON_ERROR_STOP=1 -f $UP > /dev/null 2>&1; touch $T/rv6stop; wait
echo "applied and rolled back 10 times with three readers running; the longest single apply or rollback: $max ms"
echo "reader statements that raised: $(cat $T/rv6reader.*.err | grep -c ERROR) of about $(cat $T/rv6reader.*.out | grep -c .) answered lines"
cat $T/rv6reader.*.err | grep ERROR | sort | uniq -c | sort -rn | head -5
echo "locks 212 holds at its end, inside its transaction (other than on the catalogue's own rows):"
(echo 'begin;'; sed '1d;$d' $UP; echo "select coalesce(string_agg(distinct l.locktype || ':' || coalesce(c.relname, '') || ':' || l.mode, ' ; '), '(none)') from pg_locks l left join pg_class c on c.oid = l.relation where l.pid = pg_backend_pid() and l.locktype in ('relation', 'object') and coalesce(c.relnamespace, 0) <> 'pg_catalog'::regnamespace;"; echo 'commit;') | psql -qAtd $DB 2>&1 | tail -1 | cut -c1-600
