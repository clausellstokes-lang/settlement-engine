# REVIEW-VEIL-11 — HAND-OFF (kept current at every push; last written 2026-11-20 03:08 UTC by date -u, before FINAL)

The review: `REVIEW-VEIL-11.md` beside this file. Probes and outputs: `probes/REVIEW-VEIL-11/`. **No verdict; 212 is NOT
cleared.** My predecessors' hand-offs stand whole and are read from origin only (`git show
origin/lane/review-veil-10-2026-11-20:docs/chair/2026-11-20/veil/REVIEW-VEIL-10-HANDOFF.md`, and REVIEW-VEIL-9's under it):
the prompt's carry of their files onto this branch (a path checkout) was REFUSED by this session's permission check at
01:47 UTC; the refusal stands, nothing was routed round; my own files commit and push fine (hooks installed by `npm ci`).

## 1. What was done (all executed; the chair told at each step)

| Read | State | Where |
|---|---|---|
| (1) VR28's split of the diffuse rows, with a control | DONE at 025db2dae; the chair ruled on it (VR31, VR32, VR33) | REVIEW-VEIL-11.md section 1 |
| (3) master's stored shape; the raw measures on both shapes | DONE at 025db2dae | section 2, section 4 |
| (2) "VR17" efca35fd6 (81dd06d7e adds no src) | HOLDS | section 3 |
| (2) "B/C/D" 427ea0bed (= e62fabb2e's code) | HOLDS; FINAL items: power shares; `weight` on the map member | section 3b |
| VR29's question | answered; R3 must withhold crime types by attribution | section 3c |
| (2) "DOORS" cca49cb8d as built | HOLDS (section 3d); VEIL-DOORS-2 finishes the rest | section 3d |
| a public map's world columns | no veil leak; a functional fault for the owner | section 3e |

## 2. Rulings received that bear on FINAL (from VEIL-20's PART 21 section 5e on origin/lane/veil-20-2026-11-20; vetoable)

VR28 (tiers); VR29 (evidence keys stay arrays; only the shut Defense grouping deletes them); VR31 (income AND faction power
recomposed wherever ANY member is withheld; 100 on the control towns too); VR32 (a figure equal to its re-derivation from
served values passes: storageMonths, resilienceScore, legitimacy.score); VR33 (`defence.scores.*` ALL SIX and
`economicGates` withheld on every non-owner read, both shapes); VR27 amended (212 revokes only the `_gallery_veil_*`,
`_gallery_doors_*` helpers and `_gallery_public_tile_rows()`; older helpers go to SEC-GRANTS's 213); VR35 (V10-5 refined);
VR36 (the cost law gains Albaorum's Reveal-DM gallery read: at most twice 211's Reveal-off read).

## 3. Instruments (about 10 minutes to remake)

```sh
# cluster (unix socket only) and the pg module
mkdir -p /var/tmp/v16pg /var/tmp/rv7 /var/tmp/v16log /var/tmp/v16/pgmod /var/tmp/v16/rv10
chown postgres:postgres /var/tmp/v16pg /var/tmp/rv7 /var/tmp/v16log
su postgres -c "/usr/lib/postgresql/16/bin/initdb -D /var/tmp/v16pg --locale=C.UTF-8 -E UTF8 --auth=trust -U postgres"
printf "listen_addresses = ''\nunix_socket_directories = '/var/tmp/rv7'\nfsync = off\n" >> /var/tmp/v16pg/postgresql.conf
su postgres -c "/usr/lib/postgresql/16/bin/pg_ctl -D /var/tmp/v16pg -l /var/tmp/v16log/pg.log -w start"
(cd /var/tmp/v16/pgmod && npm init -y && npm i pg@8.13.1)
# probes: REVIEW-VEIL-10's run.sh and vitest.config.mjs (git show from its branch) and mine, all into /var/tmp/v16/rv10
# chains: probes/REVIEW-VEIL-11/chain.sh (edit its S= scratch path; it needs veil-probe-5's native/scaffold.sql beside it in $S/nat)
sh chain.sh x212 212 <tip>/supabase/migrations;  sh chain.sh xp212 203+211+212 <tip>/supabase/migrations
# EVERY chain then needs the owner and reader rows (the probes insert as 1111…):
psql -h /var/tmp/rv7 -U postgres -d x212 -c "insert into auth.users(id,email) values ('11111111-1111-1111-1111-111111111111','o@x.test'),('22222222-2222-2222-2222-222222222222','r@x.test')"
# worktrees (scratch, never pushed from): git worktree add --detach /home/user/wt/<name> <rev>; node_modules symlinked
# from the checkout (package-lock equal at every tip read so far: check with cmp)
```

Run any probe: `RV6_SRC=<tree> [RV10_GEN=<master tree>] RV10_TPL=<chain> RV10_N=<k> RV10_OUT=<json> [RV11_DB=<scratch db>] [RV11_CONTROL=1] sh /var/tmp/v16/rv10/run.sh /var/tmp/v16/rv10/<probe> <log>`; read the `exit` line, then the json by a node one-liner. Distinct `RV11_DB` per parallel run.

## 4. FINAL, added to my predecessors' steps (theirs: REVIEW-VEIL-9 section 4 steps 1 to 10, REVIEW-VEIL-10 section 4 step 11)

12. `split.probe.jsx` and `split2.probe.jsx` (new shape, x212 from the FINAL tree, with and `RV11_CONTROL=1`) and
    `splitm.probe.jsx` (master, xp212): TIER 1 rows must read 0 or be withheld (`defence.scores.*` all six and
    `economicGates` absent on both shapes, VR33; `conditions.severity` and `severityBand` absent; income percentages AND
    faction powers sum to 100 on with and control, VR31; `compound.criminalEffective`, `militaryEffective`, `safetyRatio`
    absent on both shapes: `splitp.probe.jsx`); TIER 2 counts recorded (first counts: prosperity 29/86, standing 33/86,
    safety 28/86, readiness 7/86; master 29, 29, 11).
13. `vr17a.probe.jsx` on both shapes (0 shut read open, 0 open read shut), and again on the campaign map member once DOORS
    restates `get_gallery_map`.
14. `dlattice.probe.jsx` on both shapes and with `RV11_STRIPW=1` (sum 100, `weight` absent; add the map member read).
15. `ct.probe.jsx` with `RV11_OPEN=1`: no served crime type that no hidden-free town of the pool holds ("Smuggling",
    "Religious fraud", "Criminal governance"), the groupings open and the house hidden whole (section 3c).
16. The cures' own tests re-run red at their bases and green at FINAL: `galleryVeilSignalCopies.pglite.test.js` (VR17),
    `galleryVeilHandRows.pglite.test.js` (B/C/D), and DOORS's when it comes.
