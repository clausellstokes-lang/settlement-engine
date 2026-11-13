#!/bin/sh
# REVIEW-VEIL-6 — migration 212 and its rollback, on LOCAL scratch chains only.
#   rollback212.sh <split worktree>     (chains s212, s211, s203p211p212, s203p211, l211, l203p211, t203 built first)
# Each file is applied as the owner would: `begin;` + the file + `commit;` in one psql session, ON_ERROR_STOP on.
set -u
SPLIT=$1; HERE=$(cd "$(dirname "$0")" && pwd); export PGHOST=${PGHOST:-/var/tmp/rv6} PGUSER=postgres
UP=$SPLIT/supabase/migrations/212_share_veil_later_cures.sql; DOWN=$SPLIT/supabase/rollback/212_share_veil_later_cures.down.sql
UP211=$SPLIT/supabase/migrations/211_server_side_share_veil.sql; DOWN211=$SPLIT/supabase/rollback/211_server_side_share_veil.down.sql
clone() { psql -qd postgres -c "drop database if exists $1 with (force)" -c "create database $1 template $2" 2>/dev/null; }
tx() { (echo 'begin;'; cat "$2"; echo 'commit;') | psql -qd $1 -v ON_ERROR_STOP=1 >/dev/null 2>${TMPDIR:-/var/tmp}/rv6tx.err; rc=$?; [ $rc -ne 0 ] && echo "    $(basename $2) on $1: exit $rc: $(grep -m1 ERROR ${TMPDIR:-/var/tmp}/rv6tx.err | cut -c1-200)"; return $rc; }
echo "== the full chain (001..210, frozen 211, 212)"
clone r_a s212; tx r_a $DOWN && $HERE/cmp.sh "212's down file, against the frozen 211's chain" r_a s211
tx r_a $DOWN && $HERE/cmp.sh "the down file a second time" r_a s211
tx r_a $UP && $HERE/cmp.sh "then 212 again, against the chain with 212" r_a s212
tx r_a $UP && $HERE/cmp.sh "212 a second time over itself" r_a s212
echo "== 203 + frozen 211 + 212 (the owner's early step)"
clone r_b s203p211p212; tx r_b $DOWN && $HERE/cmp.sh "212's down file, against 203 + frozen 211" r_b s203p211
tx r_b $DOWN && $HERE/cmp.sh "the down file a second time" r_b s203p211
tx r_b $UP && $HERE/cmp.sh "then 212 again" r_b s203p211p212
tx r_b $UP && $HERE/cmp.sh "212 a second time over itself" r_b s203p211p212
echo "== applied by hand as one transaction on 203 + frozen 211, against the chain built file by file"
clone r_c s203p211; tx r_c $UP && $HERE/cmp.sh "begin; 212; commit; on 203 + frozen 211" r_c s203p211p212
echo "== the wrong orders"
clone r_d t203; echo "  212 on a chain at 203 WITHOUT 211:"; tx r_d $UP && echo "    applied without error"; $HERE/cmp.sh "    after it, against 203 untouched" r_d t203
clone r_e s203p211p212; echo "  211's down file while 212 is still applied:"; tx r_e $DOWN211 && echo "    applied without error"; $HERE/cmp.sh "    after it, against 203 + frozen 211 + 212" r_e s203p211p212
clone r_f s203p211p212; echo "  the frozen 211 applied again OVER 211 + 212 (a release push that stops after 211):"; tx r_f $UP211 && echo "    applied without error"; $HERE/cmp.sh "    after it, against 203 + frozen 211 + 212" r_f s203p211p212; $HERE/cmp.sh "    after it, against 203 + frozen 211" r_f s203p211
tx r_f $UP && $HERE/cmp.sh "    then 212 again" r_f s203p211p212
echo "== both rollbacks in order from 203 + 211 + 212: 212's, then 211's, then 203's party-link read"
clone r_g s203p211p212; tx r_g $DOWN && tx r_g $DOWN211 && psql -qd r_g -v ON_ERROR_STOP=1 -f $HERE/../native/unlisted203.sql >/dev/null && $HERE/cmp.sh "against a chain at 203" r_g t203
