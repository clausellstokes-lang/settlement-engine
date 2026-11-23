# R5D-SQL-2 hand-back (VEIL-37, the chair's E136 (a): the mask in the name slot)

Brief: `docs/chair/2026-11-20/veil/briefs/R5D-SQL-2-BRIEF.md` (the seat's checkout; not on this branch). Worktree `/home/user/wt/r5desc`,
branch `lane/veil-37-2026-11-23-r5desc-wip`, built on eeda6a126. NOT PUSHED.

## 1. Commits, bytes, runs

**Commits**
- `ab6ade69a`: the cure (standingForms.mjs, the table by its door, the proof, 212, the twin).
- This hand-back with the runner, the probe and the run outputs: the commit after it.

**Bytes** (sha256)
- 212 `supabase/migrations/212_share_veil_later_cures.sql`: **5ad8493af040a6148732d342c6beba67a17c4840f75468816060ad44be3df46c** (was a9b0884e...).
- Rollback `supabase/rollback/212_share_veil_later_cures.down.sql`: 8cbd7d1c7a6d60f609b7473b14b7fe2b2ca8a3b6f3081151c2ae49d82cded5b0, UNCHANGED.
- 211 eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01, UNCHANGED; 210 9118c235c15d4ed434e192fb60e49dacd2040d52b7b8c28b3acc262494358a60, UNCHANGED.
- `standingForms.ids.json` b33edb7f4f1bfd87d183a68e0a538dcb55c0afe5148b938f0f17f21307ab6c0f, UNCHANGED (byte for byte).
- THE LITERAL (`--print`; extracted from 212, undoubled, and from the twin: the same): **sha256
  2dced4651450f4b0f341d447aeee5d6971317523b46fb384c93aa9c69906676b, 24,079 characters** (was 794367e0..., 23,737).
- **Rows whose `re` moved: 16** (the same 117 ids; nothing else of any row moved; the header's `slotPatterns`, `samples` and
  `slots` moved): H-R1-behind-em, H-R1-behind-hy, H-R1-gap-em, H-R1-gap-hy, H-R1-shadow-em, H-R1-shadow-hy, M-R1-behind,
  M-R1-shadow, M-R2-buy, NM-more, OC-named, R1-behind, R1-gap, R1-shadow, R2-buy, RA-more: every row with a name or label slot;
  every closed row and every force/count-only row is byte-unchanged. `--write` twice: the same bytes.

**Runs** (`out/v37/r5dsql2/run.sh <logdir> [main|cost|all]`; all local, PGHOST=/var/tmp/rv7, template `v27x211`, no git
repository variable; the run's own exits in `out/exits.txt`, logs copied to `out/`)
| run | exit |
|---|---|
| (a) `standingForms.mjs --check` | 0 (117 rows) |
| (a) `--check --file <copy of the tip's factionStanding.js, one sentence changed>` | 1, with its message (want 1) |
| (b) `rosterChoiceRegistry.mjs --check` | 0 |
| (c) `vitest run tests/lint/rosterChoiceRegistry.walker.test.js` (gate-tail, mutex shared tier, `--maxWorkers=1`) | 0, 11 of 11 |
| (d) `node scripts/check-full-typecheck.mjs` (gate-tail) | 0 |
| (d) eslint on every JS file touched (the three under scripts/ and src/, the probe, g-cases.mjs, cost.mjs) | 0 |
| (e) 001..211 (`v27x211`) + 212 | 0 |
| (e) the same + the rollback; every public function's definition md5 and ACL against 001..211 | 0, `cmp` equal, 480 functions |
| (e) on 001..211 + 212, `_gallery_veil*` executable by anon or authenticated | 0 functions |
| (e) 001..211 + eeda6a126's 212 (`git show`), for the red | 0 |
| (f) `standingForms.proof.mjs <scratch> --pg --walk 300` | `PROOF exit 0` |
| (g) the proof's 7,555 cases through 212's `_gallery_veil_withhold_always` and the twin's `standingBase` | 0: SQL = JS = reference on 7,555 / 7,555 (the first pass's 6,009 / 6,009; the mask's 1,546 / 1,546) |
| (h) `r5dsql2.probe.jsx` (mutex shared tier, `--maxWorkers=1`) | 0 |
| (i) the cost law (after the seat's chain's END; through the mutex) | 0, WITHIN (section 4) |

(f) in figures: (a) R5D-0's 44 rows, its 4,808 literals over the 65 sample labels (the mask now one) all cut to their own id;
(b) 1,166 samples WHOLE; (c-js) the four bases, 4,843 cases, all back to the base; (m) the mask in 18 slots of 16 rows, 161 mask
samples WHOLE, 1,385 mask base cases back to the base (the four bases + one or two standings with a mask, and two bases that HOLD
the mask mid-sentence, "An external interest with its own people placed inside an unseen interest's council." and "Its patrons
answer to an unseen interest, and say so only in private.": whole alone, never swallowed); lazy = index cut 7,555 / 7,555; (c-pg)
Postgres read the new literal (its sha256) and equals JS on 7,555 / 7,555; (e) 300 births, 1,173 tip and 1,173 master standings
WHOLE, fails 0. The first pass's cases are byte for byte R5D-FORMS's 6,009 (the proof expands them over the header's samples
less the mask), so (g)'s count is "6,009 plus the mask's".

## 2. What a masked name can become, slot by slot (maskText and powerSentenceName read)

`maskText(text, names)` is `text.split(name).join('an unseen interest')` for each hidden power's `faction` (the RAW LABEL), exact
and case-sensitive. A name slot holds `powerSentenceName(label)`; a label slot (master's and older engines) the raw label.
- **The slot names the hidden power itself.** Name slot: masked only where `powerSentenceName(L) === L` (a label with no slash, no
  bracket, not a PROSE_FORMS label); the slot then reads exactly **`an unseen interest`**. A slashed or bracketed label (Military/Guard,
  Third Bloc (Neutrals), ...) is NOT masked in a name slot: its sentence name ("The Guard", "Third Bloc") holds no label, and the slot
  already takes it as words (a leak of the name past the mask, but cut with the standing all the same). Label slot: the label is
  masked whole: **`an unseen interest`**.
- **Mid-sentence** (R1-behind, R1-shadow, R1-gap, R2-buy both slots, OC-named after "It does not bargain for its way: ", and
  master's/history's label rows): `an unseen interest`.
- **At a sentence head** (NM-more, RA-more): `an unseen interest`, its lower-case "an" kept (the verb the engine chose from the
  unmasked name stays: "an unseen interest have more say right now", seen on a birth). The `{has|have}` choice already holds both.
- **After a literal "the "**: no row of the table has one (tip, master and the 40 history rows: 117 of 117 read), and
  powerSentenceName never begins with a lower-case "the" for any birth label. **`the an unseen interest` is not a form of this
  table**: the R5-DESC brief's jp6 sightings came from the joinprobe lane's writer `powerNameWithArticle` (d0549419b, on
  `origin/lane/veil-33-2026-11-22-joinprobe-wip` only; not in HEAD, not in master), whose unmasked "they play the Merchant Guilds
  and the Elder Council" no row holds either. By the brief's "each of them and no more" it is NOT added. **Needs a ruling** if the
  chair wants it anyway (one more literal in each slot; no id moves).
- **Inside a slashed or bracketed label**: over the 64 birth labels (every pair), no birth label is a part of another's slash or
  bracket, so the mask never lands there; not added.
- **A partial name** (a hidden label inside a longer name: "Free Elder Council" -> "Free an unseen interest", "Corrupt City
  Council" -> "Corrupt an unseen interest", "Merchant Guild Council" -> "Merchant an unseen interest": the only three pairs of the
  64 labels) is already words, held by the slot's own pattern; no label of a birth is the HEAD of a longer one, so no partial
  begins with the mask.
So each name and label slot takes `an unseen interest` as one literal alternative (`NAME_RE = WORDS|an unseen interest`,
`LABEL_RE = <label>|an unseen interest`), read from its one writer (publicSafe.js :: HIDDEN_POWER_MASK); case-sensitive, no flags,
no backslash, no `\b`, anchored at the tail; the group depth stays 4 (212's literal-tail precheck reads every row as before: the
rows' tails are unchanged).

## 3. The probe (h) (`r5dsql2.probe.jsx`; output `out/probe.txt`)

72 born towns (`v11-ties-<size>-<calm|infiltrated>-<i>`, six sizes, i 0..5), 288 reads (the gallery read unmarked, with the default
veil, with the default veil and Reveal DM, and the link), against the twin's `projectShareVeil(galleryPayloadFor(...))`:
reads that raise 0; **twin = server on 288 / 288** (every leaf); 964 served descs (512 cut, 452 a base as handed); **0 still ending
in a table tail; 0 differing from the reference cut** of the desc the projection hands the veil, and 0 from the reference cut of
the stored desc.

**Plants** (an owner-hidden power, `hidden: true` set by hand, whose label another power's standing carries; read Reveal off, the
default veil and unmarked): 30 plants, 60 reads, in 16 classes (the row that cuts the masked standing; the slot's place):
mid-sentence R1-behind, R1-shadow, R1-gap, M-R2-buy (R2-buy's sentence over a plain name, the tie named by the smaller id), each
alone and before a rivalry note; at a sentence head NM-more, RA-more, and each after a rank line. THIS TREE: **the served desc is
the base on 60 / 60, server and twin**. AT eeda6a126 (its 212 on its own chain; its twin = this twin with its literal, sha256
794367e0..., the one difference between the two twins): **the masked standing served WHOLE on 60 / 60, both engines (THE RED)**
(where a mask-free rivalry note followed, eeda6a126 cut the note and served the masked rank line). Not reached by a birth: the
partial name (no born town holds both labels of a pair) and OC-named (the occupier's line).

**Item 6, a served BASE holding the mask: 0 reads, 0 towns, 0 sentences** (on the 288 reads; the plants' bases hold none either).

## 4. The cost law (i)

Command: `sh docs/chair/2026-11-20/veil/out/v37/r5dsql2/run.sh <logdir> cost` (waits for `END` in /var/tmp/v18/out/v37/g/done.txt,
then `cost.mjs` through the mutex: the probe's largest born metropolis, the default veil record, as anon, 9 rounds after a warm-up,
medians; chains `r5dsql2_x211` (211 frozen), `r5dsql2_old` (eeda6a126's 212), `r5dsql2_a` (this 212)).
RUN after the seat's chain ended (END 01:35:01; seen 01:35:59), exit 0, `out/i-cost.log`. On v11-ties-metropolis-calm-0
(498,754 characters, the largest of the 72 births; R5D-SQL's 502,604 was another born set), load 1.15 to 3.0:
| read | 211 | eeda6a126's 212 | this 212 |
|---|---|---|---|
| gallery, Reveal DM off | 247.4 | 438.1 | 464.8 ms |
| gallery, Reveal DM | 157.3 | 463.8 | **464.3 ms** |
| link | 178.9 | 372.1 | 388.6 ms |

The Reveal-DM read is **464.3 ms against twice 211's Reveal-off read (2 x 247.4 = 494.8): WITHIN**, by 6% (the same read at
eeda6a126 is 463.8: the margin is the first pass's, not moved here). This 212 against eeda6a126's: 1.06, 1.00, 1.04. 211's own
figures run lower than R5D-SQL's on this box (247 against 423), so the margin is thinner than R5D-SQL's 641.7 / 846.0: said for the
seat.

## 5. Calls made here (vetoable)

- **The registry is unchanged**: power.desc's scope ("the STANDING TAIL is cut ... by ONE TABLE") is true with the cure and needs no
  clause; so no door run beyond `--check`.
- `--write` needs `origin/master`, which this clone had no ref for: `git fetch origin master` (origin's master is db832c892, the
  header's own `origin/master@db832c892`), nothing else fetched or moved.
- The worktree had no `node_modules`: an untracked symlink to the main checkout's (the same package.json and lock), never staged.
- The typecheck and the proof (by its header: "one core") ran outside the mutex, niced, as the seat's own chain runs its
  typecheck; vitest ran in the mutex's shared tier with `--maxWorkers=1`.
- 212's header sentence names the new literal's sha256 and keeps the first pass's (794367e0...) as that pass's.
- The proof's (a) now expands R5D-0's table over 65 labels (the mask one of them): 4,808 cut to their own id, none off.
