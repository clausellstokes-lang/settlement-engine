# R4-IDS PART ONE: the measure and the red-first instrument

V34-R4I, a builder of VEIL-34's, 2026-11-22. Brief: `docs/chair/2026-11-20/veil/briefs/R4-IDS-BRIEF.md` (f3e5459e7). Built on
`v34-r4ids`, cut from `lane/veil-34-2026-11-22` at 29521233d. I edited nothing in `src/` or `supabase/`. 211 is byte-frozen
(`eface6d0…0b01`). The tree's 212 (`0352a502…`) was applied, unread, to the template `r4itpl` = `v27x211` + 212 (`r4itpl-212.txt`,
empty: no error). Every database was local: the scratch cluster at `/var/tmp/rv7` (`r4i_m_*`) and pglite. Each heavy run went
through `gate-mutex.sh --run` and `gate-tail.sh`.

## M: the measure (`measure/ids.probe.jsx`, `ids.sh`, `ids-an.mjs`; out `full/`, window 18:34:03Z to 18:56:28Z)

**The page set.** The tell8b arm's 140 births (92 of them hidden-house). Each is read with both engines (the server, and the
twin = projectShareVeil over galleryPayloadFor) and both stored shapes (the new one, and master's, which also puts the powers in
the top-level `factions[]`). The settings: own, g:000..g:110, allOpen, off, allShown and unmarked, each with Reveal off and DM.
The reads: the gallery read and the party link. That makes 6,528 pages × 3 reads.

**An id site** is any string value or object key spelled `npc.`, `npc_` or `tie_npc`, any value equal to a stored card id
(numbers included), and every key of the served marker. A site is a **hit** when it spells a withheld power or a house the read
hides whole. Two tests decide that: the lane's search (`buildNameSearch`), and the name's words joined by `_` or by nothing,
case-blind, in the bare form. "The read withholds or hides" means a stored power or house the read does not serve by name.

| surface (all pages) | served: gallery / link / twin | hits: gallery / link / twin | |
|---|---|---|---|
| `relationships[].from/to/npc1Id/npc2Id` | 617,536 / 601,792 / 617,536 | 0 / 0 / 0 | CONFIRMED |
| `npcs[].id` | 316,640 / 316,640 / 316,640 | 0 / 0 / 0 | CONFIRMED |
| `relationships[].id` (a tie's id, which spells its ends) | 308,768 / 300,896 / 308,768 | 0 / 0 / 0 | CONFIRMED |
| `npcs[].goal` targets | 90,406 / 0 / 90,406 | 0 / 0 / 0 | CONFIRMED |
| `stress`/`stressors` casts | 42,328 / 42,328 / 42,328 | 0 / 0 / 0 | CONFIRMED |
| `simulationTrace` targets | 2,624 / 0 / 2,624 | 0 | CONFIRMED |
| `npcs[].allegiance` | 1,312 / 0 / 1,312 | 0 | CONFIRMED |
| `generationCoherenceReceipt`, `activeConditions` | 280 + 144 | 0 | CONFIRMED |
| a card's own `relationships[]`, `memberships`, roster copies `factions[].members[]` | 0 on born towns | none | CONFIRMED (born towns carry none: the instrument plants them) |
| served marker person keys | 0 on 6,528 pages | none | CONFIRMED (the settings write none: the instrument plants them) |

- **Gated pages, Reveal off** (1,840 pages; 920 of them in master's shape): 0 hits on every surface. **Gated, DM**: 0 hits.
  CONFIRMED.
- **The server and the twin agree** on the hits on every page: 0 disagreements, so there was nothing to stop on. The gallery and
  the link also agree. CONFIRMED.
- **Stability, the re-key's own baseline.** Across two gallery reads of one row, 129,656 of 129,656 served card ids are the same
  (2,608 pages). And 316,640 of 316,640 served card ids are the stored id. Today every person id is stable and stored. CONFIRMED.
- **The stored id forms in the births:** `npc_` on 140 births, `npc_veiled_` on 95 and `npc_power_` on 71. On this page set
  every power the veil withholds BY RULE carries `npc_veiled_` (castPowers.js :: isVeiledPower at birth), and so does every
  hideable house's face. That is why no born id spells what a read withholds here. CONFIRMED by the 0. That it holds for every
  birth outside this set is PLAUSIBLE.
- **WHAT THIS REFUTES OF THE BRIEF:** on the tell8b page set, the "spells" half of VR10 has no born witness (0 hits). The
  re-key's other half stands whole: every id is stable and stored. The spelling case on born towns needs a power the OWNER hid
  by hand, which this page set does not hold. That is the LIT witness below.

**THE LIT WITNESS (act T)**, read on `origin/lane/veil-33-2026-11-22-joinprobe-wip` at df7447e58, from the probe's litsurf
output. No pool was built.

- `out/v33/joinprobe/lit/measure/litsurf/litsurf-table.txt`, act T, Reveal off: server 79 / twin 79 strings name what the read
  hides, and server = twin. Its printed samples are on jp6-city-8, where the owner hid the power "Noble families":
  - `npcs[2].id`, `stress.cast.roles[0].id`, `stressors.cast.roles[0].id` and `relationships[2].from` each read
    `npc_power_noble_families`;
  - `relationships[2].id` reads `tie_npc_power_noble_families…`.
- `out/v33/joinprobe/JOINPROBE.md` (line 63): "17 person / tie ids `npc_power_<slug>` of the hidden power's representative on
  4 places", from the seat's reading of the 79 one by one. One place (jp6-city-8) and five ids are CONFIRMED in the output. The
  other three places and twelve ids are PLAUSIBLE: the table prints only 6 samples.

## R: the red-first instrument (`tests/security/galleryVeilIds.pglite.test.js`; run at the tip: `ids-test-tip-full.txt`)

The plant carries four cases:

- (a) `npc_power_thieves_guild`, the representative of a criminal power the veil withholds by rule;
- (b) `npc_smugglers_den`, the representative of a house hidden whole;
- (c) a NUMBER id, 90001, and a card whose own tie points to it;
- (d) the marker's person keys: each plant id, `90001` and `npc.vex_morrow`.

There are also two born towns. Each is read in both shapes, with Reveal off and on, marked, unmarked and hiding nothing, through
the gallery and the link: 72 served reads.

**Result: 3 failed, 6 passed. All three reds are by design.**

- **Arm (1): RED, 72 hits on 16 reads**, all on the plant. The gallery has 20 hits: on `npcs[].id`, `relationships[].from`,
  `relationships[].id` and the marker keys. The link has 40 and the twin 12. The plant's withheld power's id is served on the
  gallery even when marked with Reveal off. The marker serves `npc_power_thieves_guild` and `npc_smugglers_den` as keys.
  CONFIRMED.
- **Arm (2): RED on 72 of 72 reads**, each for the same two reasons: stored ids are served, and the two reads share person ids
  (tooth (v)). CONFIRMED.
- **Arm (3), STOP 1: RED, 12.** Card ties are served on the gallery with DM only, on 6 reads, and each serves `from` = `npc.bo`
  and `to` = 90001, both stored ids. CONFIRMED.
- **Arm (4), the catalogue: GREEN today.** 211 and 212 restate 84 functions. A grep finds no `random(`, `gen_random_uuid(` or
  `gen_random_bytes(` in either file, and no closure member is IMMUTABLE or STABLE. The plant proves the arm can fail: a STABLE
  caller of a drawer, created in a scratch transaction and rolled back, reds as `r4i_scratch_caller: provolatile STABLE`.
  CONFIRMED.
- **The teeth that pass today are GREEN**: the same people when nothing is hidden; every person-bearing part matches its
  reference; every non-id byte is equal.
- **The reference.** The gallery is held to its twin. The link is held to its own second read. A second run (`-second.txt`)
  showed the link serves a narrower card than any twin projects, so there is no twin to hold it to. CONFIRMED.
- **The helper.** `personIdBijection.shared.mjs` is brought from a4b89bf9d with four changes, each said in its header:
  - (A) tooth (ii) searches by substring and object key, over the document and the served marker;
  - (B) number ids are taken as person ids;
  - (C) a card's own ties are re-keyed sites;
  - (D) the walk's order is otherwise a4b89bf9d's.
- **The manifest row** is `{kind: rationale, ref: pglite-executed}`.

**`tests/lint` whole** (`lint-whole.txt`): 22 failed and 3,245 passed, of 3,267 tests. The reds are the sixteen standing files
and the same 22 test titles as `out/v32/tell8b/lint-whole-final.txt`, diffed: identical. No red names this work's files.
CONFIRMED.
