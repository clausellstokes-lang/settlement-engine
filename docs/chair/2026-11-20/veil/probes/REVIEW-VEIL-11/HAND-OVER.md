# REVIEW-VEIL-11 → REVIEW-VEIL-12: hand-over (LEADS, never proof: re-execute everything)

Branch `lane/review-veil-11-2026-11-20`. Review: `docs/chair/2026-11-20/veil/REVIEW-VEIL-11.md` (sections 1–3j, 4). Hand-off with
FINAL steps 12–22: `docs/chair/2026-11-20/veil/REVIEW-VEIL-11-HANDOFF.md`. Probes and outputs: this folder.

## 1. Re-making the instruments (the order I would use again; about 15 minutes)

1. Cluster: `initdb` into `/var/tmp/v16pg` as postgres, append `listen_addresses = ''`, `unix_socket_directories = '/var/tmp/rv7'`,
   `fsync = off`; `pg_ctl … -w start`. TRAP: a container pause kills it (seen twice): re-run the `pg_ctl start` line; data stays.
2. `cd /var/tmp/v16/pgmod && npm init -y && npm i pg@8.13.1`.
3. `npm ci` in the checkout you push from (installs the hooks; my pushes all ran them). Scratch trees: `git worktree add
   --detach /home/user/wt/<n> <rev>` and `ln -s <checkout>/node_modules` (package-lock was equal at every tip I read; `cmp` it).
4. Chains: `chain.sh` here (edit `S=` to your scratchpad; put `docs/chair/2026-11-13/veil-probe-5/native/scaffold.sql` in
   `$S/nat/`). `sh chain.sh x212 212 <tree>/supabase/migrations`; master's shape: `sh chain.sh xp212 203+211+212 <tree>/…`.
   TRAP 1: every chain then needs the owner, reader, profile and premium stub, or inserts fail ("foreign key", "save limit
   reached"): `insert into auth.users(id,email) values ('1111…1111','o@x.test'),('2222…2222','r@x.test'); insert into
   public.profiles(id) …; update public.profiles set role='developer' where id='1111…'; create or replace function
   public.current_user_has_premium_access() returns boolean language sql stable as $f$ select true $f$;`
   TRAP 2: parallel runs of one probe collide on its scratch DB name: pass a distinct `RV11_DB` (r2a.probe uses fixed names
   `r2a_post`/`r2a_pre`: run it once at a time).
5. Probes: copy REVIEW-VEIL-10's `run.sh` and `vitest.config.mjs` (`git show origin/lane/review-veil-10-2026-11-20:docs/chair/
   2026-11-20/veil/probes/REVIEW-VEIL-10/…`) and mine into `/var/tmp/v16/rv10`. Run: `RV6_SRC=<tree> [RV10_GEN=<master tree>]
   RV10_TPL=<chain> RV10_N=<k> RV10_OUT=<json> [RV11_DB=…] [RV11_CONTROL=1] sh /var/tmp/v16/rv10/run.sh <probe> <log>`; read the
   `exit` line, then the json with a node one-liner. TRAP 3: the link's read returns `{…, dossier}`, not `data`. TRAP 4: a
   probe's example strings must survive `JSON.stringify(undefined)` (my r2a crashed on it once). TRAP 5: memberships are keyed
   by `power`, not `key` or `name` (a false positive cost me a run).

## 2. MY ARMS FOR FINAL (one line each: attack · probe · red)

- Tier-1 precise rows withheld, tier-2 bands counted · `split.probe.jsx`, `split2.probe.jsx` (+`RV11_CONTROL=1`), `splitm.probe.jsx` on xp212 · red: any `defence.scores.*`, `economicGates`, `conditions.severity` served; income or faction-power shares summing below 100 (with OR control).
- Raw crime measures absent, both shapes · `splitp.probe.jsx`, `r2a.probe.jsx` arm C · red: `compound.criminalEffective`, `militaryEffective`, `safetyRatio`, `blackMarketCapture`, readiness `score` present.
- Stability column is the band word alone on every row (VR44) · `r2a.probe.jsx` arm C "stability tile" · red: any tile with `(`, dash, `;` or a crime word, marked OR unmarked.
- Black market's capture (R2) · `r2a.probe.jsx` arm B · red: present on a marked read; unequal to the owner's on an unmarked one.
- Membership re-stamp (R2) · `r2a.probe.jsx` arm A (pre and post trees) · red: memberships differ pre/post; a `veiled !== false` membership drawn with Reveal DM off.
- VR17 evidence keys · `vr17a.probe.jsx` both shapes · red: a shut grouping reads open, or an open one shut (Reveal DM off/on, live/snapshot, gallery and link).
- Income shares can't be inverted by rounding (D) · `dlattice.probe.jsx` (+`RV11_STRIPW=1`) · red: sum ≠ 100, `weight` served, 100 absent from the candidates.
- Crime types by attribution (VR39) · `ct.probe.jsx` with `RV11_OPEN=1` · red: "Smuggling", "Religious fraud" or "Criminal governance" served with the groupings open and the house hidden.
- Derived Defense label and `power.entry` (VR11) · `ct2.probe.jsx` `RV11_OPEN=1` and control · red: a served criminal power a hidden house raised; "organized" above the control's rate (1/25).
- The switch (VR34) · `v102a.probe.jsx` both shapes · red: an unoffered family candidate changes `applyVeil`; an offered part not hidden after Hide-all.
- Chronicle (DOORS, VR41) · `doorsa.probe.jsx`, `d2a.probe.jsx` · red: an entry naming a veil-removed power, a renamed or removed hidden house (old or new name, opaque id). Expected and on the owner's list, not red: a short form in free text; a custom crisis label.
- Governing body (VR42) · `gov.probe.jsx` · tier 2 by ruling; red only if the capture description is served, or `power.entry` drops the governing power while its name stays; `safetyProfile.economicDragDesc` served where a criminal house is hidden is red.
- World columns (VR40) · `worldcol.probe.jsx` · red: any `chronicle` key stored or served in a map's world; publish through the editor failing.
- The salt (VR10, R4) · `salt.sh` · see section 5.
- Inversion counts for the record (tier 2) · REVIEW-VEIL-10's `inversion.probe.jsx` / `inversion2.probe.jsx` · record prosperity, standing, safety and readiness counts with their controls.

## 3. Attacked and found sound (re-execute, don't re-invent)

VR17 (efca35fd6/81dd06d7e): 640 reads, 0 wrong. B/C/D (427ea0bed): lattice inversion of shares fails by construction (p=q gives
P=100). DOORS (cca49cb8d): chronicle and tiles vs veil-removed powers, 0 of 7 served. DOORS-2 (4994ee371): renamed or removed
houses 0/22 served. V10-2 (cabdfaa69): 292 + 389 unoffered candidates, 0 govern. R2 (4ddf8c60c): re-stamp exact, capture rule
holds, raw measures absent. Food writer: no direct hidden-house term (in-pipeline counterfactual, 0/87). Empty evidence arrays
tell nothing (VR29). A hand cannot hide a governing house (0/118). World chronicle key rejected by 089's guard.

## 4. NOT reached

The party link and master's shape through the gate for R2 (the builder did not run them; my r2a covers master's gallery read
only); the snapshot-mode chronicle after DOORS-IN; the session sheet ("Tonight") as a visitor (step 18); a public channel's
`goods[].label` in a map's world; TRAD (step 21a) and the crisis cast's new holders (21b); SEAT-1's seat holder;
REVIEW-VEIL-10's FINAL steps 1–11 (the differ, the gate, the library, the rollback, the cost law: none run by me).

## 5. The salt (R4; VR10, VR45, VR46)

`salt.sh <db> <slug>` (copy `salt.sql` and `salt.sh` to `/var/tmp/v16/rv11`; store one public town with people under a
slug first): (a) the catalogue: every `_gallery_*` function and the public reads with `provolatile`; red: any function that
draws `gen_random_uuid`/`random` or calls one that does, declared `i` or `s`. (b) ten executions of one PREPARED read in one
session, seven default then three under `plan_cache_mode = force_generic_plan`; red: fewer than 10 distinct served person-id
sets. Baseline at R2 (`xr2`): no drawer; 1 distinct of 10 (VR10 not built there). Also: whether 211's byte-frozen
`_gallery_veil` declaration can be the live one after 212's restatement (read `pg_proc` after a full chain: it must be 212's
body); VR46's five teeth each planted against the re-stated guards; VR45's comparison ignoring key order only.
