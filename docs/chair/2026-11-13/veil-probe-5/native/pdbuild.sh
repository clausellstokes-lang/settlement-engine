#!/bin/sh
# pdbuild.sh <db> <through> <migdir>: the read-only block's fixture database (owner + reader, the owner a developer).
S=/tmp/claude-0/-home-user-settlement-engine/f87af9a7-d5c7-5553-9326-6c79fdba1af5/scratchpad; export PGHOST=/var/tmp/cv5 PGUSER=postgres
$S/nat/chain.sh $1 $2 $3 >/dev/null 2>&1
psql -qd $1 -c "insert into auth.users (id) values ('11111111-1111-1111-1111-111111111111'),('22222222-2222-2222-2222-222222222222'); insert into public.profiles (id) values ('11111111-1111-1111-1111-111111111111'),('22222222-2222-2222-2222-222222222222') on conflict do nothing; update public.profiles set role = 'developer' where id = '11111111-1111-1111-1111-111111111111';"
psql -qd $1 -v ON_ERROR_STOP=1 -f $4/docs/chair/2026-11-12/veil-probe-3/rv.sql >/dev/null
psql -qd $1 -v ON_ERROR_STOP=1 -f $4/docs/chair/2026-11-12/veil-probe-3/predeploy-fixture.sql > /dev/null 2>$S/nat/fx.err && echo "fixture ok $1" || head -5 $S/nat/fx.err
