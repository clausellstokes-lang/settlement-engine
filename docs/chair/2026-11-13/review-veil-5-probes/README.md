# REVIEW-VEIL-5 — the reviewer's fixtures and probes

Behind `../REVIEW-VEIL-211-333b33973-2026-11-13.md`. Scratch tools, not pins. Nothing here touches a hosted
database: every database is a local scratch PostgreSQL 16 cluster on a unix socket.

## Set-up

```sh
SP=<your scratch dir>
git worktree add --detach $SP/veil 333b33973            # the lane
git worktree add --detach $SP/master origin/master      # the deployed client (db832c892)
(cd $SP/veil && npm ci); ln -s $SP/veil/node_modules $SP/master/node_modules   # the lockfiles agree
mkdir $SP/pgmod && (cd $SP/pgmod && npm init -y && npm i pg@8.13.1)             # outside the repository
# a cluster: initdb -A trust, listen_addresses='', unix_socket_directories=/var/tmp/rv5 (run as the postgres user)
export PGHOST=/var/tmp/rv5 RV5_MIG=$SP/veil/supabase/migrations
sh native/chain.sh t203 203 $SP/master/supabase/migrations   # production today
sh native/chain.sh t210 210; sh native/chain.sh t211 211      # the release, before and with 211
sh native/chain.sh t203p211 203+211                           # 211 ALONE on production's ledger
sh native/chain.sh t_early 203+211+204-210                    # the early deploy, then the release's other seven
```

Build the chains one at a time (roles are cluster-global). `chain.sh` runs each file in its own transaction, as
`supabase db push` does, then stubs the premium check and inserts an owner and a reader.

## The attack (`attack.probe.jsx`, run by `vitest.config.mjs`)

One harness, two sides. `RV5_SIDE=master` births towns with **master's own generator**, shares them with master's
own `writeShareVeil` / `galleryPayloadFor`, and stores the rows in clones of the chains; `RV5_SIDE=tip` does the same
with the lane's code, and stamps `data.publicProse` as the new client's save does.

For every share and each of the four reads it computes THE REFERENCE: that side's own client veil
(`resolveVeil` + `applyVeil` with the stored deltas) over the chain's own unveiled projection of the row (its
sanitiser or DM-full strip, its member splice, the frozen copy where the share is frozen). The response is then
compared with the reference **leaf by leaf**:

- `EXTRA`: the response carries a leaf the reference removed. A hidden thing was sent.
- `MISSING`: the response lacks a leaf the reference keeps. Something not hidden was taken.
- `TOKEN LEAKS`: every governed key of every card is salted with a unique token (`RV5~…~Z`); a token the reference
  removed that appears anywhere in the whole response row (every column) is counted with no classifier in between.
- `secondHome`: a token whose governed home the reference removed, still present elsewhere in the reference and in
  the response.
- `pageShowMore`: the side's own page (`fetchPublicDossier`) over a 211 chain against its page over the
  reference-only chain (203).
- `postFreeze`: text written to the live row after the freeze, found in a frozen share's response.
- tip only: a hidden power's name (plain, snake, slug) or a covert tie in a read that reveals nothing.

Shares per town (natural and salted variants): unmarked; the default veil; every eye shut; every default opened;
random subsets; each card kind's eyes alone; a third of the people revealed by hand with their goals, ties, secret,
personality, corruption, whereabouts and hooks shut by hand, and a third hidden whole; a narrated share; each with
the DM reveal off and on, live and frozen. `RV5_POWERS=1` adds two shares hiding every person ranked first or second
in a power (field by field; whole). `RV5_MUTANTS=n` adds n mutated towns (the identity of a third of the cards
disturbed: no id, numeric id, an id with colons, no name, a tie by names only or in both spellings, an anonymous
event).

```sh
cd $SP/master && RV5_SIDE=master RV5_SRC=$SP/master RV5_PGMOD=$SP/pgmod \
  RV5_CHAINS=a203:t203,a203p211:t203p211,a211:t211 RV5_SUBJECTS=a203p211,a211 RV5_TAG=m RV5_SHARD=0/4 \
  RV5_OUT=$SP/out/master-0.json npx vitest run --config <this folder>/vitest.config.mjs
cd $SP/veil && RV5_SIDE=tip RV5_POWERS=1 RV5_SRC=$SP/veil RV5_PGMOD=$SP/pgmod RV5_CHAINS=c211:t211 RV5_SUBJECTS=c211 \
  RV5_TAG=t RV5_SHARD=0/4 RV5_OUT=$SP/out/tip-0.json npx vitest run --config <this folder>/vitest.config.mjs
node summarize.mjs $SP/out/master-?.json --examples
```

`RV5_SUBJECTS` names the chains that carry 211 (compared); a chain not named there is reference-only (203: the
deployed page, for `pageShowMore`). Each shard works in its own clones (`<db>_<shard>`), which are kept: the
second-home probes read them. THE RED CONTROL: point a subject at a chain built from 5a2399cf9's migrations
(`sh native/chain.sh t211old 211 <5a2399cf9 worktree>/supabase/migrations`).

## The other probes

- `census.probe.jsx` + `census-compare.mjs`: the key census. Every key of every record the veil addresses, born by
  master's generator and by the tip's, with types; keys only on master's side are retired names.
- `secondhome.mjs`, `secondhome2.mjs`: hidden strings with a second home. Reads the kept clones of an attack run;
  needs no client code (the kinds table is read from the database).
- `r3.probe.jsx`: `composePublicProse(owner)` against `composePublicProse(publicVeiledRecordOf(owner))`.
  `r3-e2e.probe.jsx`: a divergent town saved, shared and read through the four reads.
- `hand/roster.sql` + `hand/roster-page.probe.jsx`: a person hidden by the per-member switch on a Reveal-DM share,
  with the card also in a power's roster; unmarked and marked.
- `hand/fullmode.sql`: the keys the client's full mode never shows, looked for in a Reveal-DM share's reads.
- `native/rollback.sh`: the rollback of 211, exact both ways, on the full chain and on 211 alone.
- `native/catalog.sql`, `native/scaffold.sql`, `native/unlisted203.sql`: from the third review, unchanged.
- `out/`: the runs' totals behind the review's tables.
