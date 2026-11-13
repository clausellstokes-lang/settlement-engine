# REVIEW-VEIL-3 — the reviewer's probes, saved for the next reviewer

These are the probes behind the three review files beside this folder:
- `REVIEW-VEIL-211-f07db8760-2026-11-12.md`
- `REVIEW-VEIL-211-5a2399cf9-2026-11-13.md`
- `REVIEW-VEIL-211-master-client-2026-11-13.md`

They were saved on the chair's word when the session closed. They are scratch tools, not pins.

**Paths are absolute.** Every file names the old scratchpad,
`/tmp/claude-0/-home-user-settlement-engine/41bd6027-5844-54f9-b716-fc5eddd88409/scratchpad`, in a constant `SP`
or in literal paths. Point them at your own:
- `veil` / `veil5`: lane worktrees;
- `master`: db832c892 with `npm ci`;
- `pgmod`: an `npm i pg@8.13.1` folder outside the repository.

## The native cluster

`native/chain.sh <db> <through> [migrations dir]`:
- needs a scratch PostgreSQL 16 cluster on `PGHOST=/var/tmp/rv3`, user `postgres`, trust auth;
- builds 001..through, each file in its own transaction (as `supabase db push` does);
- uses `scaffold.sql`, the lane's scaffold plus Supabase-style default privileges.

Build the chains one at a time the first time. Roles are cluster-global, and two scaffolds racing on
`create role` fail one of them.

The other native files:
- `native/catalog.sql`: the catalogue for the exact-rollback comparison (functions with ACL, configuration,
  owner and the md5 of each definition; relations; policies; default ACLs; triggers; constraints). Diff two
  databases' outputs.
- `native/rrows.sql`, `native/r1.sql`: the second review's rows by hand. They need the lane's
  `veil-probe-3/rv.sql`.
- `native/relcount.sql`: the read-only count that decides "211 alone now".
- `native/unlisted203.sql`: 203's `get_unlisted_dossier`, the extra rollback statement for a deploy of 211 alone.

## The fuzz and the hand rows

- `leakfuzz.mjs <db cloned from a 211 chain> <cases> <seed>`: 2,000 hand-built shares in all (8 seeds × 250).
  - The 211 response against the page the 210 client drew.
  - Each share is classified as a veil miss, a projection divergence, a page change (nameless card, or
    `decrees`/`dmLayer`, or DM-revealed), or hide-more.
- `v31.mjs`: V3-1's routes round the cure: top level, frozen copy, narration, nested, case variants; gallery,
  overrides, import, link and map.
- `decrees.mjs`: V3-1's first table.
- `live.mjs`, `catalog.mjs`, `db.mjs`: the cold pass, in PGlite.
- `townscls.probe.mjs`: the lane's six-size probe with `importMap` split by kind. Copy it into
  `veil-probe-2/` to run it.

## The fixture of shares stored by the old client (master db832c892)

`master-client/master.probe.jsx` with its `vitest.config.mjs`. Run it from a master worktree:
`npx vitest run --config <this folder>/master-client/vitest.config.mjs`.

**How the fixture is made:**
- master's own generator: `birthConfig({...DEFAULT_CONFIG, ...browser dials})`, after `loadGenerationLawPayloads()`;
- 12 towns, 6 sizes × calm and infiltrated;
- 8 shares each, written by master's `writeShareVeil` and `galleryPayloadFor`:
  - unmarked; the default veil; every eye shut (from master's `curateModelFor`); every default opened;
  - Reveal DM;
  - frozen with the default veil; frozen with every eye shut; frozen with Reveal DM;
  - every frozen share's live row is edited after the freeze.

The same rows go into three databases (`m203`, `mfull`, `m203p211`). Master's four read paths run over a fake
supabase whose `rpc` runs the real SQL.

**Then:**
- `classify.mjs`: show-more on master's gallery page, by path. It found only `relationships[].description`.
- `residual.mjs`: what the response carries beyond master's page.
- `mapcheck.mjs`: new map strings that are not on the 203 gallery page.
- `where.mjs`: find a string's path in raw and served data.
- `out-2026-11-13.json`: the run's totals.

## What to test first on the next push of the lane's cures

1. **Both stored shapes of a relationship's ends.**
   - Master-era deltas address `relationship.<npc1Id>-<npc2Id>-<type>` (`npc1Id` `npc_1` slugs to `npc-1`).
   - The new client and 211 address `relationship.<from || npc1Name>-<to || npc2Name>-<type>`.
   - A cure must hide a hand-shut relationship field under either spelling, on rows whose relationship carries
     `npc1Id/npc2Id/npc1Name/npc2Name` (the generator's shape at master), `from/to` (the new shape), or both.
     Use the master fixture's "every eye shut" shares: 22 of them, 1,028 hand hides.
   - Expected: `classify.mjs` finds 0, at 211 and under the new client.
2. **A hand-shut goals or ties eye under a DM reveal.**
   - Set `revealDm: true` on a person (or Reveal DM on the share), then shut `field:npc:<id>:goals` / `:ties`
     by hand.
   - The server's DM-full splice brings those fields back. Check the veil still removes them: from the gallery,
     the import (`for_import` splice) and the frozen copy.
   - Check the same with master-era person ids (`galleryMemberKey`: a string id, else `npc.<snake(name)>`).
3. **The composition with the powers lane's new leaders.** Whatever new person or faction fields that lane
   writes (new leaders, their ties, their houses):
   - are they in `_gallery_veil_kinds()`, and in its `floor` or its `fields`?
   - do the sanitiser and `toPublicSafe` agree on them?
   - does a hidden power's name ride any new id?

   Run `leakfuzz.mjs` with those fields added to `doc()`, and the lane's id differential with them.
4. Re-run the exact rollback (`native/catalog.sql`) both ways. If 211 goes out alone, also run the
   "211 then 204..210" chain: 208 overwrites the veiled `get_unlisted_dossier`.
