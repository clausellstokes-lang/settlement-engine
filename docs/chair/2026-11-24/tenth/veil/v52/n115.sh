#!/bin/sh
# VEIL-52 (1)(c), N115: the tip's chain (v28tpl = 001..211 + the tip's 212) against master's own chain (db832c892: 001..203, built
# by REVIEW-VEIL-6's chain.sh, unchanged) on the SAME public rows (the today-born stored set), 840 rows and 1 row. Run inside the
# mutex (q52.sh n115). Out: /var/tmp/v52/out/n115/*.json and the table on stdout.
set -u
export PGHOST=/var/tmp/rv7 PGUSER=postgres
O=/var/tmp/v52/out/n115; S=/var/tmp/v52/out/stored-today; HERE=$(cd "$(dirname "$0")" && pwd); mkdir -p $O
P6=/var/tmp/v18/lib/docs/chair/2026-11-13/probes/REVIEW-VEIL-6
sh $P6/native/chain.sh v52mst 203 /home/user/wt/master/supabase/migrations 2>&1 | grep -v NOTICE
for side in tip:v28tpl master:v52mst; do n=${side%%:*}; tpl=${side#*:}
  for rows in 840 1; do db=v52t_${n}_$rows
    psql -qd postgres -c "drop database if exists $db with (force)" -c "create database $db template $tpl" >/dev/null
    node $HERE/n115.mjs $db $S $rows $O/$n-$rows.json > $O/$n-$rows.log 2>&1; echo "$n $rows rc=$?"
    psql -qd postgres -c "drop database if exists $db with (force)" >/dev/null
  done
done
node -e "
const f=(n,r)=>JSON.parse(require('fs').readFileSync('$O/'+n+'-'+r+'.json','utf8'));
console.log('door | tip 1 row | tip 840 | master 1 row | master 840 | tip/master at 840 | tip 840/1 | master 840/1   (median ms)');
for (const d of ['gallery','link','import','map']) { const a=f('tip',1).doors[d].median,b=f('tip',840).doors[d].median,c=f('master',1).doors[d].median,e=f('master',840).doors[d].median;
 console.log([d,a,b,c,e,(b/e).toFixed(2),(b/a).toFixed(1),(e/c).toFixed(1)].join(' | ')); }
for (const n of ['tip','master']) for (const r of [1,840]) { const j=f(n,r); console.log(n,r,'public rows',j.publicRows,'missing',JSON.stringify(j.missingColumns),'empty',JSON.stringify(j.empty)); }
"
