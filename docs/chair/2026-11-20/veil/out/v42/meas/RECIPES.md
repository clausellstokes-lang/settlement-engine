# R4I-MEASURE — RECIPES (every input and run this unit depends on; the data itself is not committed)

All from `/home/user/wt/meas` (branch `lane/veil-42-2026-11-23-meas-wip`), `PGHOST=/var/tmp/rv7 PGUSER=postgres`, every command with
the prefix `E="env -u GIT_DIR -u GIT_WORK_TREE -u GIT_INDEX_FILE -u GIT_COMMON_DIR -u GIT_OBJECT_DIRECTORY -u GIT_PREFIX -u GIT_NAMESPACE"`,
every run over a minute through `GATE_MUTEX_MAX_POLLS=100000 sh scripts/gate-mutex.sh --run -- <cmd>`. `V=docs/chair/2026-11-20/veil/out`.

## TREES (scratch, never committed to)
    git worktree add --detach /home/user/wt/tip    23bb8b8ae1155e948bca4308e479fba7adc8639c   # the lane's TIP (no re-key)
    git worktree add --detach /home/user/wt/master db832c8926e9b7784c607a38929629b1dbe15110   # origin/master
    ln -s /home/user/wip/node_modules /home/user/wt/tip/node_modules       # package-lock.json byte-identical (cmp) in both
    ln -s /home/user/wip/node_modules /home/user/wt/master/node_modules

## TEMPLATES
- `v28tpl`: the seat's (`$V/v28/seated/make-instruments.sh /home/user/wip ...`: `createdb -T v27x211 v28tpl` + the -wip's 212, sha256 7a85dec3…).
- `v42tip`: `createdb -T v27x211 v42tip && psql -q -v ON_ERROR_STOP=1 -d v42tip -f /home/user/wt/tip/supabase/migrations/212_share_veil_later_cures.sql`
  (rc 0, 06:22 UTC; tip 212 sha256 ff20ed89…; `logs/templates.txt`).

## THE STORED SETS (`chain.sh` step `dumps`, 07:06 UTC; the committed door `$V/v33/legacy/dump.sh`, R4I-PAGE-3's form)
    mkdir -p /var/tmp/v18/out/v42/emptypool
    $E LP_A=0 LP_B=0 LP_TOWNS=1 sh $V/v33/legacy/dump.sh /home/user/wt/meas   /var/tmp/v18/out/v42/stored-today  /var/tmp/v18/out/v42/emptypool
    $E LP_A=0 LP_B=0 LP_TOWNS=1 sh $V/v33/legacy/dump.sh /home/user/wt/master /var/tmp/v18/out/v42/stored-master /var/tmp/v18/out/v42/emptypool
Today-born at the meas tree f4b6c98d1 (= 9f9b819f7 + docs), publicProse composed; master-born at db832c892 (no publicProse module).
140 documents each (the tell gate's 140 seeds); metas `logs/dump-meta-{today,master}.txt`. The today-born set equals the probe's own
births of the same seeds byte for byte (140 of 140, `t140`'s `MEAS_STORED_CMP`).

## THE POOL
`/var/tmp/v18/t2/pool-v42`: the seat's (chain0, `$V/v27/tell2/measure/pool.sh /home/user/wip /var/tmp/v18/t2/pool-v42 v28tpl`, at
9f9b819f7; doneA/doneB 4 x rc=0, ended 06:48 UTC). Read as births by seed, size and crisis (`pool-shard*.json`, `poolb-shard*.json`).

## THE RUNS (`chain.sh <step ...>`; each `/var/tmp/v18/out/v42/meas/<step>/`: `window.txt`, `meas-shard*.json`/`um-shard*.json`, `table.txt`)
| step | command (inside `chain.sh`, each its own mutex hold) | state |
|---|---|---|
| a7 | `MEAS_C=1 MEAS_SEEDS=<the 7> sh meas.sh /home/user/wt/meas <out>/a7 v28tpl towns` | rc 0, 07:01 |
| ctrl | `MEAS_C=1 sh meas.sh /home/user/wt/meas <out>/ctrl v28tpl handreach` | rc 0, 07:06 |
| dumps | the two dump commands above | rc 0, 07:06 |
| t140 | `MEAS_C=1 MEAS_STORED_CMP=/var/tmp/v18/out/v42/stored-today sh meas.sh /home/user/wt/meas <out>/t140 v28tpl towns` | rc 0, 07:43 |
| pool | `MEAS_C=1 MEAS_DOORS=gallery sh meas.sh /home/user/wt/meas <out>/pool v28tpl pool /var/tmp/v18/t2/pool-v42` | rc 0, 11:24 |
| umtoday | `UM_U=1 UM_M=1 sh um.sh /home/user/wt/meas <out>/umtoday v28tpl stored /var/tmp/v18/out/v42/stored-today` | rc 0, 11:34 |
| ummaster | `UM_U=1 UM_M=1 sh um.sh /home/user/wt/meas <out>/ummaster v28tpl stored /var/tmp/v18/out/v42/stored-master` | rc 0, 11:43 |
| umpool | `UM_M=1 sh um.sh /home/user/wt/meas <out>/umpool v28tpl pool /var/tmp/v18/t2/pool-v42` | DROPPED (N90) |
| m140 | `MEAS_C=1 sh meas.sh /home/user/wt/meas <out>/m140 v28tpl stored /var/tmp/v18/out/v42/stored-master` | rc 0, 14:30 (interrupted once at 07:44) |
| bt140 | `MEAS_BIJ=0 MEAS_DOORS=gallery,link sh meas.sh /home/user/wt/tip <out>/bt140 v42tip towns` | DROPPED (N90) |
| bm140 | `MEAS_BIJ=0 MEAS_DOORS=gallery,link sh meas.sh /home/user/wt/tip <out>/bm140 v42tip stored /var/tmp/v18/out/v42/stored-master` | DROPPED (N90) |
| bpool | `MEAS_BIJ=0 MEAS_DOORS=gallery sh meas.sh /home/user/wt/tip <out>/bpool v42tip pool /var/tmp/v18/t2/pool-v42` | DROPPED (N90) |
`<out>` = `/var/tmp/v18/out/v42/meas`; the queue now running: `sh $V/v42/meas/chain.sh umtoday ummaster umpool m140 bt140 bm140 bpool`
(started 08:48, waiting on the mutex behind `pool`). Trials (one or two places, outside the mutex): `MEAS_SHARDS=1 MEAS_SEEDS=<seeds>`
with the same scripts; their tables are in `logs/trial-*.txt`.
