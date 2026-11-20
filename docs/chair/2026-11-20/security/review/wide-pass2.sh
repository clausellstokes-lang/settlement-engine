#!/bin/sh
# wide-pass2.sh <db>: the wide harness again with neutral uuid = the ATTACKER's own id and neutral text cycled through
# every enum value a door's body tests (reactions, categories, question ids, providers, report reasons, kinds).
export PGHOST=/var/tmp/rg1 PGUSER=postgres
SEL="select sum(rg1.run_fn(p.oid)) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prorettype <> 'trigger'::regtype and p.prokind='f' and not exists (select 1 from pg_depend d where d.classid='pg_proc'::regclass and d.objid=p.oid and d.deptype='e') and (has_function_privilege('anon',p.oid,'execute') or has_function_privilege('authenticated',p.oid,'execute'))"
for nt in other worth_walking product_updates first_street anthropic settlement comment map dossier hide dismiss resolved spam surveyor ai_analyst; do
  psql -qXAt -d $1 -c "set statement_timeout='900s'" -c "set rg1.nu='11111111-1111-1111-1111-111111111111'" -c "set rg1.nt='$nt'" -c "$SEL" | tr '\n' ' '; echo " nt=$nt"
done
