# P5a — THE WIRING CENSUS LANES (ten seats, one per volume; chair 6eb7b5b6, Fable 5.1, 2026-10-20; CHAIR-NOTES 19 is the law of this census)

**The owner's word (2026-10-19 ~04:02 EDT, verbatim on the BOARD):** "and question, the architecture for the full FP is being built as a coding architecture document correct? i don't want it to be an empty shell. also make sure that everything is wired to something and that something has to be appropraite!"

You are a CENSUS seat (the standard's measure-first rule): you MEASURE whether every mechanism of your ONE volume is wired — one writer, at least one real reader, a seam that exists at master `81f1cd963` (or a named leaf-first car), a flag, a wave — and you CLASSIFY each row. You do not cure; you do not edit any volume. Read `../README.md` RESUME BLOCK 2 (the laws section at its end), `CHAIR-NOTES-FOR-THE-FOLD.md` items 18 (d) and 19, then your volume WHOLE in the ledger checkout `/Users/cstokes/Desktop/settlement-engine/docs/`. The code of record is the detached master worktree named in `RESEARCH-COMMON.md` (READ-ONLY; `rg`, `sed -n`; node probes only under `../assessments/census/<lane>-probe/`). ⛔ The ledger checkout's own `src/` is a fossil — never read code there.

## What a ROW is (one per item; never per paragraph)
1. **A MECHANISM** — every named mechanism of the volume's §3+ sections up to its HEARINGS section (a stage, a read-then-write, a writer, a planner, a resolver; usually one `###` section, sometimes two or three in one section — split them when they have different writers or seams).
2. **A DERIVED READ with a signature** — every row of the ontology's derived-reads table (§2) and every other signature the volume declares (`nameOf(args) → shape`).
3. **A HEARING KIND** — every row of the volume's hearings table (the engagement-registry rows it owns).
4. **A FLAG** — every row of the flags table.
5. **A PERSISTED SHAPE** — every shape (ledger, map, ring, field on a landed record) in the lifecycle table (requirement 22a), and every shape the text declares elsewhere ("a new persisted field", "the OWNER's shape").
Build the list WITH SCRIPTS first (`grep -n '^### \|^## ' <volume>`; the `| Read | Signature |` table; the `| Kind | Owner |` hearings table; the `| Flag |` table; the lifecycle table's columns), then read each section to fill the row. A volume of 400 KB has roughly 60–150 rows; say your count.

## The columns (ONE pipe table; this exact header, so the chair's script can count)
`| id | kind | item | where | writer | readers | seam | flag | wave | class | note |`
- **id** `WC-<V>-<n>`; **kind** `mechanism · read · hearing · flag · shape`; **item** the name (the symbol or the section's own title); **where** `§x.y`.
- **writer** — the ONE writer (a leaf/stage/symbol); for a read "pure"; for a hearing the owner wave's resolver; for a flag "the preset/certification row"; for a shape its one writer. Two writers = note it (a second-truth candidate).
- **readers** — at least ONE REAL CONSUMER: a volume and section that takes the item as an INPUT to its own mechanism (quote ≤1 line in the note), or a landed symbol at master that would consume it (`path :: symbol`). A mention in a cure record, a token register, a coupling list or a scenario row is NOT a reader. Search every FP volume: `grep -n '<item>' /Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_*.md` (and `DESIGN_W_*.md`), then read the hit. For a hearing kind the readers are the fold's §3.4 registry row (quote it) AND the docket (C0) — both must exist. For a flag the readers are the mechanisms it gates (name them). For a shape the readers are the mechanisms that read it.
- **seam** — the landed HOST symbol the item mounts on or reads through (`path :: symbol` at `81f1cd963`; `rg -n '<symbol>' src/` in the worktree, quote the line), and the NEW leaf it names if any; a host at the 800 ceiling (`wc -l`) must have a named leaf-first car — write `CAR: <name>`. A seam that names a symbol NOT at master and no car = SHELL.
- **flag** — the virtual flag that gates it (or `dark-identity`/`none` with a reason); **wave** — `<V>-n`.
- **class** — `OK` · `DEAD END` (no real reader) · `SHELL` (no seam and no car; or the named seam symbol does not exist) · `INAPPROPRIATE` (CHAIR-NOTES 18 (d): a TRUTH read where an ACTOR DECIDES, or a BELIEF read where the PHYSICS RESOLVES; a second truth beside a landed quantity — a second decay, danger, reputation, learning or travel law; a reader in the wrong program — a volume reading another volume's private state instead of its derived read or through its one writer; a hearing kind not in the fold §3.4; a token not in the fold §5; a shape with no lifecycle row).
- **note** — the receipt in ≤1 line (the quoted reader line, or why the class is not OK).

## The two known landed dead ends are NOT findings
GR-3 grants and the commons voice (lens 2) are `NEXT-PROGRAM-INBOX.md` rows. Everything deliberately queued in that file is never a finding either.

## Output — `../assessments/census/WC-<V>.md`, saved incrementally
1. COUNTS FIRST: `rows N · ok A · dead ends B · shells C · inappropriate D` (one line, exactly this shape).
2. The table (every row).
3. **CANDIDATES FOR THE CHAIR** — every non-OK row restated: id · class · the receipt · the cure you would propose and its owning volume (one line each). Default to the non-OK class when uncertain and say so; the synthesis seat adjudicates.
4. One CONFIRMED-vs-PLAUSIBLE sentence (CONFIRMED = read at the cited symbol/section with the line quoted; PLAUSIBLE = reasoned).
Save as you go; stop and report at ~300k tokens of your own context, saying which sections are left. REPORT DIET ≤350 words + the table trimmed to the non-OK rows. Structured return: lane; path; counts (the line of item 1); findings (one line per non-OK row: id · class · receipt); confirmedVsPlausible. Never git; never the test suite; edit nothing but your own census file and probe dir.
