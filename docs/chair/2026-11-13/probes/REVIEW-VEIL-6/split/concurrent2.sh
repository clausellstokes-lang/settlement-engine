#!/bin/sh
# REVIEW-VEIL-6 — the same as concurrent.sh, with each raise attributed: six applies and six rollbacks, eight seconds
# apart, three readers running throughout; the reader errors counted in the eight seconds after each act.
DB=$1; UP=$2; DOWN=$3; export PGHOST=${PGHOST:-/var/tmp/rv6} PGUSER=postgres; T=${TMPDIR:-/var/tmp}
reader() { while [ ! -f $T/rv6stop ]; do psql -qAtd $DB -c "select set_config('test.uid','',false)" -c "select count(*) from (select public_slug from public.settlements where public_slug is not null order by random() limit 2) s, lateral public.get_gallery_dossier(s.public_slug) g" >> $T/rv6r.$1.out 2>> $T/rv6r.err; done; }
rm -f $T/rv6stop $T/rv6r.*; touch $T/rv6r.err; reader 1 & reader 2 & reader 3 &
errs() { grep -c ERROR $T/rv6r.err; }; up=0; down=0; sleep 4; base=$(errs)
for n in 1 2 3 4 5 6; do
  psql -qd $DB -v ON_ERROR_STOP=1 -f $UP > /dev/null 2>&1 || echo "APPLY FAILED"; sleep 8; e=$(errs); up=$((up + e - base)); base=$e
  psql -qd $DB -v ON_ERROR_STOP=1 -f $DOWN > /dev/null 2>&1 || echo "ROLLBACK FAILED"; sleep 8; e=$(errs); down=$((down + e - base)); base=$e
done
touch $T/rv6stop; wait
echo "reads answered: $(cat $T/rv6r.*.out | grep -c '^[0-9]')"
echo "reads that raised in the eight seconds after an APPLY of 212 (six applies): $up"
echo "reads that raised in the eight seconds after a ROLLBACK of 212 (six rollbacks): $down"
grep ERROR $T/rv6r.err | sed 's/function [0-9]*/function <oid>/' | sort | uniq -c | sort -rn | head -4
