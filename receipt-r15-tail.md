# RECEIPT — lane R15-TAIL (PARTIAL)
⟦Chair: Fable 5.1 · Lane: Opus 5 (R15-TAIL) · read-only on every tree · started 2026-09-06⟧

**STATUS: PARTIAL — in flight.** This header is written before any measurement, per the preamble
("Write your receipt FIRST as a PARTIAL header"). Every figure below is added only after the
command that produced it exited in-shell with a captured code.

## Ask
Classify the WHOLE of PROBE_ALL register R15 ("src long tail") per source FILE by CONSUMER
(reader / dm-only / dev / ai-prompt / ambiguous), read from where each string is USED in the tree
at `$SC/laneOSR18` @ fd36f0298 — not from what the string looks like.

## Deliverables (paths)
- `$K/sweep/R15-tail-classification.json`
- `$K/sweep/R15-tail-classification.md`
- this receipt

## Log
- [ ] read PROBE_ALL §R15 + §5 Axis A
- [ ] read REFUTATION R-10 and P-9
- [ ] read CORRECTIONS_RECEIPT owed item
- [ ] confirm corpus.json field names from first rows
- [ ] extract R15 rows at fd36f0298, name the sha
- [ ] classify per file
- [ ] JSON complete:true
- [ ] MD written

---

## Measurements taken (all exits captured in-shell)

### M1 — the corpus file the brief names does not exist; four identical copies do
`$K/probe-all/corpus.json` (the brief's path) is ABSENT: `$K/probe-all/` holds only the ten
`*.mjs` extractors. `find` over `$SC` returns six `corpus*.json`. Four are byte-identical
(`md5 223df7caaeb79c43d10467c72898ec9f`, 14,632,339 B):
`$SC/runHEAD/corpus.json`, `$SC/refute-tics/corpus.json`,
`$K/sweep/bible-work/corpus.json`, `$K/sweep/refute-extractors-work/corpus.json`.
The fifth, `$SC/run6b80/corpus.json` (`e37e8f3d…`, 14,626,929 B), is the 6b80d1e8e run.
**I classified against `$SC/runHEAD/corpus.json`.**

### M2 — which sha that corpus is, re-derived rather than taken on the brief's word
`node count.mjs runHEAD/corpus.json` → total rows **34,527**; `R15` **3,894**.
`node count.mjs run6b80/corpus.json` → total rows **34,508**; `R15` **3,883**.
34,527 admitted and R15 3,883 → 3,894 (**+11**) is exactly P-9's published drift, so the
runHEAD corpus IS the `fd36f0298` corpus. Tree check: `git -C $SC/laneOSR18 rev-parse HEAD`
= `fd36f0298b1ead15f2a80eff83dafb92114a7ea4`, `git status --porcelain` empty (exit 0).
**The sha I classified against is `fd36f0298`, and R15 there is 3,894 rows, not 3,883.**

### M3 — corpus field names, read from the rows, not assumed
Every R15 row carries: `register, file, p, pool, shape, viaFn, angle, audience, slots,
text, from, unit, sentenceShaped`. Across the whole corpus a further five keys appear on
other registers (`line, annex, n, section, kind, wiredTo`). **No R15 row has a `line`
field** (`hasLine: 0` over all 3,894) — the brief's JSON shape asks for `line`, so line
numbers are derived by locating each string in the tree, and are null where the string is
composed at runtime (template/function pools).

### M4 — R15's shape at fd36f0298
3,894 rows · `from` = `X2` for all of them (the export walker) · `unit` = `sentence` for all
· 234 distinct files · 377 (file, top-level export) groups. Concentration: 6 files carry
50%, 36 carry 80%, 120 carry 95%.

### M5 — reachability instrument (the necessary condition for `reader`)
Static import graph over all 2,189 `src/**` modules (import / export-from / dynamic
`import()` / `require` / `new URL(..., import.meta.url)`), roots = every `.jsx` + `src/pdf/**`
+ `src/workers/**` + `src/foundry/**`. 1,990 of 2,189 modules are product-reachable.
**34 of R15's 234 files (359 rows) are reachable from no product surface at all** — they
cannot be reader-facing by construction.
⚠ METHOD HAZARD, found and cured mid-run: a first graph run without the worker roots called
`worldPulse/index.js` unreachable; the barrel is genuinely test-only, but the worker at
`src/workers/advanceInterval.worker.js:23` imports the LEAF, so worker roots are required
before any such claim.
⚠ SECOND METHOD HAZARD: "the only importers are tests" is NOT evidence of dev. Five exports
in `warAndRoadNames.js` have zero non-test importers yet are consumed by `deriveWarName()`
INSIDE their own file, which `WarTab.jsx` renders. Same-file consumption is now shown for
every group.
