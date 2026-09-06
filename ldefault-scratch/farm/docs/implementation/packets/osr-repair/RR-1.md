# OSR-repair / RR-1 — the institution strain-list read nothing ever fed

- **Status:** LANDED
- **Implementation:** built by lane TE-RR1B on 2026-08-22 as the pair
  `2f41eb0f568caf0d8168b1d6e9b1a7cbc70ff73e` (the cure) and
  `dc68128afafbfcdf5aa1b6b37006d98f4433d212` (the governed re-freeze); the chair CASes
  the landing. Do not redispatch.
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `eb6124a6f3527d6aebd3119ee3ebebfc42902dd6`
- **Last revalidated:** 2026-08-22 at `eb6124a6f3527d6aebd3119ee3ebebfc42902dd6`
- **Owner authority:** ODQ §353.3 ratified the finding; the chair ratified the design
  ruling (delete the dead arms) and granted this packet's promotions.
- **Depends on:** the schema-10 OSR mint (`12b3aa53` / `eb6124a6`). Before it the
  envelope was broken and every governed write threw, so this member's shrink
  re-freeze was not expressible. The §384 STOP was exactly that blockage.
- **Family:** `osr-repair` — un-stamped, so any train carrying it holds the
  four-member cap.
- **Collision group:** `viewModelBodySlices` — RR-2 is split-promotion-chained behind
  this packet's LANDED status on shared change paths. Nothing here promotes RR-2.
- **Behavior posture:** REPAIR. No declared shift, no golden re-record, no persistence
  shape, no tuning, no dependency, no new capability. Same-seed output is unchanged and
  that is proved rather than asserted.
- **Census posture:** zero new test files and zero new test titles. The behavioural arm
  folds inside an existing title; the tombstone rows register through an existing
  `test.each`. The banked-failure set is unmoved at eleven.

## 1. Measured contradiction

`servicesSlice` mapped its `pressures` output through a two-arm fallback over keys that
no writer in the estate has ever placed on an institution record. Both arms were dead,
so the third — the empty list — has always been the shipped behaviour, and the print
block those values feed has never once fired.

Every leg was re-derived at the verified base rather than inherited from the compile
draft:

| leg | instrument | reading at base |
|---|---|---|
| producer | `src/generators/steps/assembleInstitutions.js`, the sole institution minter | neither token present |
| lifecycle writers | `institutionLifecycle.js`, `moralInstitutionPressure.js`, `institutionTolerance.js` | zero occurrences of either key |
| closed admission list | `src/domain/content/customContentAdmission.generated.js` | neither key admitted, so no user-authored institution can carry one |
| edit path | `EDITABLE_FIELDS.institution` in `src/domain/userEdits.js` | `['desc']` |
| history | `git log -S` over `src/generators` + `src/domain`, back to genesis | every committed write of either key sits on AI-context, narrative-context or settlement records, never on an institution |
| consumer | readers of `services.detailed` | three readers of the row; exactly ONE reader of the `pressures` datum |

The consumer census corrects the compile draft, which recorded two readers of
`detailed`. There are three — `src/foundry/journalPages.js` reads it as well — and that
file was already present with the same read at the draft's own pin, so this is a draft
undercount rather than a leg that went live in the window. It does not disturb the
ruling: `journalPages.js` reads name, status, description and category off those rows
and never touches the strain list, so the `pressures` datum still has a single reader.

## 2. The ruling, and the two options refused

DELETE the dead arms; the line becomes the empty list outright.

- **REPOINT refused.** Institutions carry no unrepresented live strain datum. Their
  strain surface is `status`/`statusReason`, which the slice already reads two
  properties up and the section already renders. Every pressure-like source in the
  estate is settlement- or realm-scoped, so a repoint would invent a mapping no design
  document asked for.
- **WRITER-SIDE ADDITION refused — owner-gated.** Making institutions carry pressures
  is new capability: a new persisted field, a new admission-schema row, new render
  behaviour. Raised, not smuggled.

**What deliberately survives:** the `pressures` field on the slice and the Institutions
PRESSURES block. Removing them would cull a shaped print surface, and a cull is an owner
carve-out by nature. The field keeps the slice contract stable for all three readers of
`detailed`, and the block stays inert on an empty list exactly as today. The cull
question goes to the owner's docket, not to this member.

## 3. Evidence

- **A/B, executed:** 60 cases — five configurations across twelve seeds, including both
  fixed seeds the parity and golden suites use — walking 1957 institution records. No
  record carried either key; the base expression selected non-empty on none of them; the
  full services slice was deep-equal between the cured code and a reconstruction of the
  base expression applied to the same raw records. A planted-carrier negative control
  proves the probe can fail rather than merely pass.
- **The surviving block is live code, not decoration:** handed a non-empty list the
  PRESSURES block still renders, and goes dark only on the empty one. Proved by an
  element-tree probe, since the estate's recorded law is to walk the tree rather than
  compare render bytes.
- **The instrument:** a governed shrink re-freeze, not a hand-edit and not a genesis.
  The inventory moved by exactly the two rows this member deleted — nothing added,
  nothing recounted, no file entering or leaving, row tags identical. Reconciled
  key-by-key against a pre-write copy rather than by the write's own exit status.
- **Schema-10 semantics observed:** "digests unchanged" is a schema-8 expectation and is
  deliberately not claimed. A shrink moves derived digests and subject-tree manifests by
  construction; the condition that must hold is that every moved tree-manifest entry is
  one of this member's own source edits, and each of the three source trees moved by
  exactly the member's two files. The detector tree did not move at all, so the governed
  tool universe stayed still underneath the member.

## 4. Commit shape

Two commits with one named, precomputed interior red between them — the mint's own
precedent. C1 carries the source cure, the tombstone rows and the folded parity arm; at
C1 the walker compares its live scan against the still-committed baseline and reds by
exactly the two-row delta, and the standalone OSR gate refuses on the same two rows.
Neither is exposed: that gate sits outside `npm run check` and CI. C2 carries the
regenerated baseline and the two figure re-records, read off the re-frozen baseline
rather than predicted, and closes the window.

## 5. Judgments, each vetoable

- **J1** — deletion, with the output field and the render block retained, over repoint,
  writer-side addition and cull.
- **J2** — the `REMOVED_DEAD_FIELDS` tombstone registry as the absence machinery, over
  anchored source-text negatives in `tests/pdf`: it is an existing comment-stripped
  walker, it costs no census row, and its stated purpose is exactly this guard. Its doc
  comment gains a line acknowledging the dead-READ mirror class.
- **J3** — exact read expressions as tombstone tokens rather than bare key names. The
  bare name survives as the lawful output property, so a bare-name row would convict a
  lawful line. The walker compares by literal substring, so the punctuation in the token
  is inert rather than a pattern.
- **J4** — the two-commit shape with a named interior red, over landing the source edit
  alone and leaving the instrument refusing at the tip.
- **J5** — the behavioural arm folded inside an existing title rather than given its own,
  so the census stays still; its assertions are titled by their comment.

## 6. Raised, out of scope here

- **Owner docket:** whether the always-empty `pressures` print field and its never-firing
  block should be culled, together with the roughly thirty other speculative alias arms
  in this same file. A dedicated triage lane could rule the nest at once.
- **Owner docket:** whether institutions should ever carry a pressures surface at all.
  That is product law, not repair.
- **Separate assessment, untouched here:** `EDITABLE_FIELDS.institution` admits `desc`
  while `servicesSlice` reads `description` with a `blurb` fallback, so a user's
  institution-description edit may not reach the PDF slice.
