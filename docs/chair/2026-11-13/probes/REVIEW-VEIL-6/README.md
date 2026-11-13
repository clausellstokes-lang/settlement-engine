# REVIEW-VEIL-6 — the reviewer's probes

Behind `../../REVIEW-VEIL-212-28f52b1e4-2026-11-13.md`. Scratch tools, not pins. Nothing here touches a hosted
database: every database is a local scratch PostgreSQL 16 cluster on a unix socket (`PGHOST=/var/tmp/rv6`).

## Set-up

```sh
SP=<your scratch dir>
git worktree add --detach $SP/lane 28f52b1e4      # the lane's tip
git worktree add --detach $SP/base 333b33973      # the tip of the last security read (the red control)
git worktree add --detach $SP/master origin/master  # the deployed client (db832c892)
(cd $SP/lane && npm ci); ln -s $SP/lane/node_modules $SP/master/node_modules; ln -s $SP/lane/node_modules $SP/base/node_modules
mkdir $SP/pgmod && (cd $SP/pgmod && npm init -y && npm i pg@8.13.1)
# a cluster: initdb -A trust; listen_addresses=''; unix_socket_directories=/var/tmp/rv6 (run as the postgres user)
export PGHOST=/var/tmp/rv6 PGUSER=postgres
sh native/chain.sh t203 203 $SP/master/supabase/migrations          # production's ledger
sh native/chain.sh l211 211 $SP/lane/supabase/migrations            # the release, the lane's 211
sh native/chain.sh l203p211 203+211 $SP/lane/supabase/migrations    # the lane's 211 alone on production's ledger
sh native/chain.sh b211 211 $SP/base/supabase/migrations            # 333b33973 (red control)
sh native/chain.sh b203p211 203+211 $SP/base/supabase/migrations
```
`native/` is the last reader's, unchanged (`chain.sh` runs each file in its own transaction, then stubs the premium
check and inserts an owner and a reader).

## The cold pass (`cold.probe.jsx`, run by `vitest.config.mjs`)

```sh
cd $SP/lane && RV6_SIDE=tip RV6_SRC=$SP/lane RV6_PGMOD=$SP/pgmod RV6_CHAINS=ct211:l211,ctb211:b211 RV6_PREFIX=t \
  RV6_SEEDS=2 RV6_SHARD=0/4 RV6_OUT=$SP/out/cold-tip-0.json npx vitest run --config <this folder>/vitest.config.mjs
cd $SP/master && RV6_SIDE=master RV6_SRC=$SP/master RV6_PGMOD=$SP/pgmod \
  RV6_CHAINS=cm203p211:l203p211,cm211:l211,cmb:b203p211 RV6_PREFIX=m RV6_SEEDS=2 RV6_SHARD=0/4 \
  RV6_OUT=$SP/out/cold-master-0.json npx vitest run --config <this folder>/vitest.config.mjs
node cold-table.mjs ct211 $SP/out/cold-tip-?.json              # every eye shut by hand: what arrived, by field and read
node cold-table.mjs cm203p211 $SP/out/cold-master-?.json --persons   # the per-person switch alone
node cold-summary.mjs $SP/out/cold-tip-?.json --planted        # totals, reads, lists, what was planted
```
Four shards a side (`RV6_SHARD=0/4` … `3/4`). Each shard works in clones (`<db>_<shard>`), which are kept: the
attack reads them. The header of `cold.probe.jsx` says what is planted and how.

## The attack (`attack/`)

Each on a CLONE of a database a cold run left behind (`create database x template ct211_0`):

- `attack.sql`: the tables under row security, the helpers called directly, arguments out of range, the lists as an
  oracle, ids that belong to another, a stale share. `LEAK` or `OPEN` at the head of a line is a finding.
- `stale-veil.sql -v slug=<public_slug> -v dm=false|true`: a stale or malformed `$veil` record, 22 variants.
- `timing.sql -v dm=false|true`: each read on the heaviest share, the median of five.
- `workhard.sql -v k=20`: the heaviest share amplified in place, the gallery read and the link timed.
- `impression-own-appearance.sql`: how many stored impressions embed the same person's appearance.

## `out/`

The tables behind the review: `table-<side>-<chain>.txt` (every eye shut), `table-<side>-persons-<chain>.txt` (the
per-person switch), `summary-*.txt`, the attack's outputs. The runs' raw JSON (7 MB) is not committed.

## After the cold pass

- `names-anyform.mjs <pg module dir> <db>…`: the name of a house hidden whole in ANY letter case or key form, in
  every string and key of every read (the search that found the twelfth second home).
- `attack/twelfth-booleans.sql`: the booleans and income labels a hidden criminal house still raises, on the link.
- `attack/eleventh-alias.sql`, `attack/eleventh-hand.sql`, `attack/impression-hand.sql`: the eleventh and the tenth
  second homes, by query and on rows written by hand (the hand rows show the twelfth on the same row).
- `client.probe.jsx` (`RV6_PROBE=client.probe.jsx RV6_SRC=<tree> RV6_DBS=…`): that tree's CLIENT veil over the stored
  rows, no server veil in between.
- `v54frozen.probe.jsx`: the frozen copy a client builds for a share with a person switched off, stored and read
  back; and what the player's world export carries.
- `oldclient.probe.jsx` (run in a worktree of origin/master): the deployed client's own page model and its eleven
  tab components rendered over a chain.
- `faults/plant.py <worktree> F1…F7`: one fault each for the lane's new guards, planted in a throwaway worktree.
- `split/`: `catalog2.sql` + `cmp.sh` (two chains' catalogues, line by line), `rollback212.sh`, `responses.sql`
  (the md5 of every read's response, share by share), `concurrent.sh` and `concurrent2.sh` (readers running while
  212 is applied and rolled back). Chains for it: `sh native/chain.sh s212 212 <split>/supabase/migrations`,
  `s203p211p212 203+211+212`, `s203p211 203+211`, `s211 211`, `s_release 203+211+212+204-210+211+212`.
- `text-anyform.mjs <pg module dir> <db>…`: hidden TEXT in any letter case (every governed string of every card, cut
  into pieces and folded), in every string of every read. It finds the thirteenth second home (an event's lasting
  effect inside `history.legacyAnnotations`), which the cold pass's case-sensitive search missed.
- `derived-census.mjs <pg module dir> <db>…`: flags, numbers, labels and paths that occur only in towns with a house
  hidden whole (an association; the review says which causes it read).
