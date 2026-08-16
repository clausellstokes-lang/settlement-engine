# DCS / DCS-2 — the 17 ES/IN stale-site blocks, build-anchored (member 2 of `dcs`)

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `b49a7daf86d6f7d27eaa685b7e52ea16edbc4bf4`
  (the `dom` terminal; the micro-batch's dispatch base)
- **Train:** `dcs`, family **DCS**, member **2** of 2. Its two volume files are disjoint from
  DCS-1's single standard file, so both members promote together.
- **Preamble:** none — DCS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§106** (the nine-volume stale-site sitting
  executed) · **C-TLF-12** (ES/IN are BUILD-ANCHORED; the act lands on the build branch and the
  fold mirrors) · **D-X-5** (the fold carries the whole corrected block) · **§137**.
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.5, annex rows `MB.M20` and `MB.M24`.

---

## §1 · WHY THE BUILD BRANCH

laneSTS consolidated nine volumes of stale-site corrections. Seven volumes' blocks were applied
against ledger-branch contents. ES and IN were SKIPPED there and routed here, for a measured
reason: their anchors sit inside amendment blocks the ledger copy does not carry. Applying them
on the ledger branch would either miss every anchor or invent the surrounding block.

Re-verified at this base rather than inherited: `docs/DESIGN_FP_ARCH_ES.md` and
`docs/DESIGN_FP_ARCH_IN.md` are byte-identical to what laneSTS recorded, and the ledger copies
still lack the amendment blocks — so C-TLF-12's build-branch routing stands unchanged.

## §2 · THE SEVENTEEN BLOCKS

**8 ES blocks.** ES-1 and ES-2 cure D-ES-1's two sites (the certification row AMENDS an
ES-0 landing; there is no pending entry and never was). ES-3 and ES-4 carry C-TLF-11's corrected
blocked-on clause (the blocker is the module's DISPATCHER dead-head, not an absent consumer;
the consumer side is wired). ES-5 adds the missing ES-Da paragraph. ES-6 corrects the row-44
flag attribution to ES-0. ES-7 reconciles the colophon's wave count with §4's amended nine.
ES-8 lands the §49/§50 preflight line.

**9 IN blocks.** IN-1, IN-2 and IN-3 retire the "IN-0c is owed but BLOCKED" reading at its three
sites, on the packet surface's own authority. IN-4 records §55's three-way IN-1c split. IN-5
re-derives the six-zero-kinds row. IN-6 attributes `secondOrderBeliefEnabled` to its landing.
IN-7 dates the headline's refuted premises as history. IN-8 is TWO in-row fragments in one
block. IN-9 replaces two rotted line cites with a navigate-by-symbol instruction.

## §3 · THE THREE APPLY HAZARDS, EACH DISPOSITIONED

⚠ **ES-5 and ES-8 are INSERT-AFTER with POSITIONAL anchors and no OLD body** — the chair-placed
class. ES-5 lands as its own bullet in the C1 amendment blockquote, immediately after the C1
bullet's last line and before C2. ES-8 lands as the next sentence after the anchor sentence
COMPLETES, which is one line past the extract the consolidation quotes.

⚠ **IN-4's anchor hard-wraps differently from the live bytes** — matched against the live text
with its own indentation rather than the consolidation's dedented extract.

⚠ **IN-8 is two fragments in one block**, applied as two edits.

## §4 · THE FIGURE RULING THIS MEMBER CARRIES

⛔ **No figure this member writes may be a count.** The rows it edits are exactly the rows that
rotted by carrying one. IN-8's own proposed replacement quotes a routed-token count that is
ALREADY STALE at this base, and the annex forbids re-typing the live count in its place. So both
IN-5 and IN-8 land as DERIVATION POINTERS: they name which spellings are live and which are
absent (set membership, which the reader can check), mark the surviving historical numbers as
history, and instruct the next compile to derive over `KIND_SECTION_CORRESPONDENCE` at build.
The row's own standing instruction — that the numbers must never be quoted from the volume —
becomes self-executing instead of advisory.

## §5 · SCOPE AND BOUNDARY

Two files, both docs. No source, no test, no new file. No block outside the seventeen. The
ledger copies are NOT touched here — the fold mirrors per D-X-5, and that is a separate act.

## §6 · THE STANDING DOCS HAZARD

⛔ Naked-claim debt is PER CLAIM. laneSTS screened its own new body lines; this member RE-SCREENS,
because two blocks were re-worded by this lane and a re-wording re-incurs the screen. The screen
is per-file and directional: the live regex's match count may not increase in either volume.

## §7 · ACCEPTANCE

| id | case |
|---|---|
| A1 | all seventeen anchors resolve EXACTLY ONCE against the live bytes before any write |
| A2 | ES gains the ES-Da bullet inside the C1 amendment blockquote, between the C1 and C2 bullets |
| A3 | ES gains the §49/§50 preflight sentence after the bundle clause's sentence completes |
| A4 | the "IN-0c is owed but BLOCKED" reading is gone from all three IN sites |
| A5 | neither IN-5 nor IN-8 states a current count; both carry a derive-at-build pointer |
| A6 | the live `CLAIM_RE` match count does not increase in either volume |

## §8 · CHECKS

```
npx vitest run tests/docs/enforcement-claims.test.js tests/docs/docCounts.test.js \
  tests/docs/architectureFreshness.test.js
node scripts/implementation-packets.mjs validate
```

## §9 · MUTANTS AND HAZARDS

- **The count mutant.** Writing the live routed-token figure into IN-8 would reproduce the exact
  defect the block exists to cure, one stamp later. The applier writes no count.
- **The multi-match mutant.** An anchor that resolved twice would apply to the wrong site
  silently. The applier verifies count-1 for all seventeen and refuses to write if any differs.
- **Hazard: the ledger copies drift.** They already lack the amendment blocks; this member widens
  that gap deliberately and the fold closes it per D-X-5.
