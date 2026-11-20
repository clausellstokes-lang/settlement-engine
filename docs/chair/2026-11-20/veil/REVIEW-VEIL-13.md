# REVIEW-VEIL-13 — the thirteenth fresh security reader of the share veil (212)

Seat of the seventh chair (session_019yED1SUxGVHyjQnoqoFvQ8). Assignment: `lane/chair-2026-11-08 ::
docs/chair/2026-11-20/seventh/prompts/REVIEW-VEIL-13.txt` (with REVIEW-VEIL-12.txt as its body). I change no product code.
**No verdict yet: 212 is NOT cleared.** Probes and outputs: `probes/REVIEW-VEIL-13/`. Hours by `date -u`.

## 0. Instruments (written 12:57 UTC)

Scratch PostgreSQL 16.15, unix socket `/var/tmp/rv7`, `listen_addresses = ''`, fsync off. Chains by REVIEW-VEIL-12's
`chain.sh` (scaffold from `docs/chair/2026-11-13/veil-probe-5/native/scaffold.sql`) then `seed.sql` (owner, reader,
profiles, the premium stub: the one step my predecessor did not commit). `x212` = the lane `origin/lane/veil-25-2026-11-20`
at **15567e597** (211 `eface6d0…`, 212 `05b915ab…`); `pre212` = R2's base 302850b0b (212 `fec111c2…`).
BITE: REVIEW-VEIL-11's `r2a.probe.jsx` arm C: RED at 302850b0b (each raw measure served 24/24 per arm), GREEN at 15567e597
(0/24 every raw measure, every arm); the tile's stability 21/24 still red at the lane (VR44 is DOORS-IN's).
`catalogue.sh x212`: violators empty (`out/`).

## 1. The lead from another lane: `brokerageLegalityOf` and the function eye (executed 13:04 UTC): DOES NOT BITE

`brk.probe.jsx` (16 born towns, criminal dial 85; `out/brk-at-15567e597.txt`, `brk-at-c5786c5ce.txt`). CENSUS: 6 born
illegal brokerages, every one `category` Criminal, so hideable by category whatever its tags (0 hideable by tags alone).
PLANT (6 towns): an illegal brokerage hideable BY ITS TAGS ALONE (category economic, no facet), a holder card and a
sentence naming it in another house's description. The default veil holds its card and its function eye;
`isHideable` accepts the card on the stored copy AND on the public-safe copy (which keeps `tags`). Served name hits,
Reveal DM off and on: SERVER 0, TWIN 0, at the lane 15567e597 and at R3-CURE-4's tip c5786c5ce (12 of 12 each).
CONTROL, unmarked share: SERVER 1, TWIN 1 (the search bites). WHY (read): 212's `_gallery_veil` decides `gone_ids` from the
stored card before any eye trims it (its own V7-3 comment); the twin's `applyVeil` decides it on the public-safe copy,
where tags survive. Not executed: R3-CURE-5's own re-derivation over a SHOWN house whose function eye is shut (it can
only read that house as less criminal: toward withholding); re-run at the R3 read.

## 2. R3 instruments ready (13:20 UTC; leads, not verdicts)

`r3.probe.jsx` (the ruled search: case-blind, name and bare form, possessive/plural ending a boundary, strings AND keys, the
only exemption a hit wholly inside a served name, named; ids whole/bounded/key; the HUSK by path: a served list row equal to
a stored row of the same pattern with a naming field removed or emptied; key-level counts; VR31; VR42; gallery, link, twin,
Reveal DM off/on). Smoke at c5786c5ce (`out/r3-smoke-at-c5786c5ce.txt`): it finds `factions[].desc` naming the guild
(R5's named row) and `.relationships[]` ties of a hidden Black market's HOLDER served with the role "the black marketeer"
nulled (VR9's holder pass: R4's, named there).
`tell.probe.jsx` (my own counterfactual by onStep; the gate's pool recipe; the served page against its own house-free
regeneration under all 16 switch settings, plus the possible-world signature by tier). AT THE PRE-R3 LANE 15567e597
(`out/tell-at-15567e597.txt`): 92 towns with a hideable house (the gate's 92); my recompute of the gate, server: HIGHER
21, EQUAL 65, LOWER 6 per Reveal arm; twin = server on every read. My gate CAN FAIL; at R3 it must read HIGHER 0.

## 3. Cold read: "TRAD-SHARE 1f3cdc135" (written 13:39 UTC). A HOLE.

THE HOLE (executed, `traddead.probe.jsx`, `out/traddead-at-1f3cdc135-on-212.txt`): the reader's dead-clause skips events whose
name holds a FULL held name (`traditionDescription.js :: heldNamesOf`); 212's sweep also takes an event by a hidden house's
BARE form. Plant: the house renamed "<n> (word of mouth)", a great fire named "The <n> Fire": 212 withholds the event, the
served rows say "…in memory of the great fire, 2 years ago": 16/16 reads; control served and recalled 16/16. Cure: fold
the bare form in `heldNamesOf`, red first by this plant.
LOWER (executed, `tradfloor.probe.jsx`): no eye of any card kind moves a row in 140 born towns; a DM-made power with no
mapped category takes its archetype from its hideable `description`: the keeper moves in 25/140 (plant).
HOLDS, executed on 4 towns only (`out/trad-smoke-at-1f3cdc135.txt`): rows equal with every hideable row removed; served rows
byte-equal to the client's on gallery and link, lane chain and 212, nothing hidden / default / every Curate address
hidden, Reveal off and on; a pre-change save serves none. NOT DONE: import (stub missing then); the 140-town round trip.

## R. REBUILD (another account; one command each; paths relative to the repo root; R12=probes/REVIEW-VEIL-12, R13=probes/REVIEW-VEIL-13 under docs/chair/2026-11-20/veil)
1. Cluster: `mkdir -p /var/tmp/rv7 /var/tmp/v16/pgdata /var/tmp/v16/rv12/nat && chown postgres /var/tmp/rv7 /var/tmp/v16/pgdata && su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/tmp/v16/pgdata -U postgres -A trust" && printf "listen_addresses = ''\nunix_socket_directories = '/var/tmp/rv7'\nfsync = off\n" >> /var/tmp/v16/pgdata/postgresql.conf && touch /var/tmp/v16/pg.log && chown postgres /var/tmp/v16/pg.log && su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v16/pgdata -l /var/tmp/v16/pg.log start"`
2. Scaffold, seed, runner: `cp docs/chair/2026-11-13/veil-probe-5/native/scaffold.sql $R13/seed.sql /var/tmp/v16/rv12/nat/ && mkdir -p /var/tmp/v16/rv10 /var/tmp/v16/pgmod && cp $R12/vitest.config.mjs /var/tmp/v16/rv10/ && (cd /var/tmp/v16/pgmod && npm init -y && npm i pg@8)`
3. A tree: `git worktree add --detach /var/tmp/v16/wt-<c> <c> && ln -s $PWD/node_modules /var/tmp/v16/wt-<c>/node_modules` (after `npm ci` in the checkout)
4. A chain: `sh $R12/chain.sh <db> 212 /var/tmp/v16/wt-<c>/supabase/migrations && PGHOST=/var/tmp/rv7 psql -U postgres -qd <db> -f $R13/seed.sql`
5. A probe: `env RV6_SRC=/var/tmp/v16/wt-<c> RV10_TPL=<db> RV10_OUT=<out> sh $R12/run.sh $R13/<probe>.probe.jsx <log>` (tell/r3: RV9_N=2 is the gate's pool; RV13_TOWNS=<tags> narrows tell)
Chains used: x212 = 15567e597; pre212 = 302850b0b; r3c4 = c5786c5ce; trad = 1f3cdc135 (`chain.sh trad 999`).
