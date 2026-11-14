# REVIEW-VEIL-7 — the reviewer's probes

Behind `../../REVIEW-VEIL-212-FINAL-2026-11-13.md`. Scratch tools, not pins. Every database is a LOCAL scratch
PostgreSQL 16 cluster on a unix socket (`PGHOST=/var/tmp/rv7`, trust auth, `listen_addresses=''`); nothing here is to
be run against anything else. The chains are built by the earlier reader's `../REVIEW-VEIL-6/native/chain.sh`
(`c212` = 001..212, `c211` = 001..211, `p212` = 203+211+212, `p211` = 203+211, from the lane's migrations), and the
born towns by its `cold.probe.jsx`, unchanged (`RV6_CHAINS=ct212:c212` in the lane's worktree, `cm212:p212` in
master's).

- **`run-all.sh <worktree> [outdir]`: THE WHOLE HAND LIBRARY AS ONE COMMAND** (about 60 seconds): two chains from the
  worktree's migrations, the five hand towns, the twin, the table of expected results (`hand/expected.json`,
  `expect.mjs`), the deep and large rows. Exit 0 only when all is green. `born/run-born.sh <worktree> <master's
  worktree>`: the born-town run in both shapes with every census (about 75 minutes).
- `needles.mjs <file.json> <needle>…`: every KEY and string VALUE of a response that holds a needle, as written,
  lower-cased or squeezed.
- `jdiff.mjs <a.json> <b.json>`: the paths at which two responses differ (server against twin).
- `twin.probe.jsx`: the client's own projection of stored rows (run through REVIEW-VEIL-6's `vitest.config.mjs`).
- `hand/run.sh <db> <town.json> <veil.json> <tag>`: one hand-written town stored three times (no veil record; the
  veil; the veil with Reveal DM), read by gallery, link and import into `<tag>-<share>-<read>.json`.
  - `town-a` + `veil-a`: substring names both ways, a renamed house, metacharacters, a key, an id, a join, camel
    case, a plural, nested arrays, a JSON string, a shown power named as a hidden house.
  - `town-b` + `veil-b`: a name with no ASCII letter (V7-1).
  - `town-c` + `veil-c`: U+212A and U+0130 in a name, an empty name, a label with no name.
  - `town-d` + `veil-d`: a clandestine house by facet (V7-3); booleans outside the five; the criminal income row
    with its groupings opened by exception.
  - `town-e` + `veil-e`: five second homes whose hidden source was amended after the birth, and one control (V7-2).
  - `deep-cost.sql -v depth= -v houses= -v strings= -v dm=`: a deep document and the sweep's worst case.
- `flags-census.mjs`, `roles-census.mjs`: over a cold run's databases, the booleans no listed house raises (by the
  engine's own `getInstFlags`) and a withheld role copied elsewhere.
- `born/sweep-removes.mjs`: what the name sweep takes (the same rows read with the sweep and with it a no-op, in a
  throwaway clone). `born/edited-after-birth.sql`: the text cures when a hidden source was edited after the birth.
  `born/stub-census.sql`: a house of the hideable class still listed.
- `deployed.probe.jsx`, `subset.mjs`: the deployed client's page model over a chain without 211 and with it (1.7).
- `out/`: the tables behind the review; `out/hand/`: the responses the findings quote.
