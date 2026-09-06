# OSR-repair / RR-2 — the institution descriptions the export never asked for

- **Status:** LANDED
- **Implementation:** built by lane TE-RR2 on 2026-08-22 as the pair
  `4f42be7085ae29dba02edeecff1dde9e5f48841a` (the cure, the corrected captions, the
  tombstone row and the instrument) and `d6179840558f2b308006078168734079d8f9709b`
  (the governed shrink re-freeze and the two figure re-records); the chair CASes the
  landing. Do not redispatch.
- **Owner exhibit — OWED BEFORE THE EXPOSING CAS (§374):** the before/after render pair
  and its glance summary sit in the lane scratchpad as `laneTERR2-exhibit-base.pdf`,
  `laneTERR2-exhibit-cured.pdf`, their page-1 images, and `laneTERR2-exhibit-GLANCE.md`.
  The chair posts them to the owner surface and opens the veto window while this member
  is still unexposed.
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `19b799ce718d52e36a3b14a85fa9cfd5051ccf26`
- **Last revalidated:** 2026-08-22 at `19b799ce718d52e36a3b14a85fa9cfd5051ccf26`
- **Owner authority:** ODQ §373 ratified INV-DESC's finding; §373.1 ratified the read-side
  design ruling; §374 ruled the compile and ordered the before/after exhibit pair posted to the
  owner before the exposing CAS.
- **Depends on:** the schema-10 OSR mint (`12b3aa53` / `eb6124a6`), and **RR-1 at LANDED**
  (`2f41eb0f` / `dc68128a`, promoted at `19b799ce`). RR-1 is terminal, so it no longer reserves
  the change paths the two members share and this packet's promotion chain is open.
- **Family:** `osr-repair` — un-stamped, so any train carrying it holds the four-member cap.
- **Collision group:** `viewModelBodySlices` — this packet is the second and last member of the
  split-promotion chain RR-1 opened. Both edit `servicesSlice`; RR-1 cured the strain-list
  chain, this one cures the description chain one property up.
- **Behavior posture:** **DECLARED OUTPUT SHIFT on the paid surface**, drafted with exhibits per
  §110.3 and never silent. No tuning, no persistence shape, no migration, no new capability. The
  same seed produces a byte-identical world; the movement is projection-only.
- **Census posture:** zero new test files; exactly ONE new statically-registered test title. The
  tombstone row registers through an existing per-row generator, which costs no title. The
  banked-failure set is unmoved at eleven.

## 1. Measured contradiction

`servicesSlice` mapped its `description` output through a chain whose first arm the majority
producer has never written. The schema's `Institution` typedef carries `desc` and no
`description`; the catalog supplies `desc`, and the variant picker writes its choice back to
`desc` while its own comment records the split — custom institutions "carry `description`, never
a catalog key". The export asked for `description` first and fell back to `blurb`, a key with no
writer anywhere in the estate. So every catalog institution reached the page with nothing to say,
and a custom one printed its generated line even where the DM had written over it.

Every leg was re-derived at the verified base rather than inherited from the compile draft, whose
figures were pinned at `a09138d7` before the closing train, the mint and RR-1 all landed:

| leg | instrument | reading at base |
|---|---|---|
| schema | `Institution` typedef, `src/domain/settlement.schema.js` | `[desc]` present, `description` absent |
| catalog producer | `src/data/institutionalCatalog.js` | 311 entries, 276 distinct names, 311 of 311 carrying a non-empty `desc` |
| variant producer | `assembleInstitutions.js`, the desc-variant write-back | 311 keys / 622 authored strings, written to `desc` |
| custom producer | `assembleInstitutions.js`, the custom arm | the sole live `description` writer on an institution record |
| edit path | `EDITABLE_FIELDS.institution` / `QUEUE_WIRED_PROSE_PATHS.institution` | `['desc']` in both registers |
| `blurb` genesis walk | `git log -S` over `src/generators`, plus the closed admission schema | one commit ever touches the token in `src/generators` and it is a COMMENT about FACTION blurbs; the admission schema has zero occurrences |
| authored prose made invisible | catalog + variants | **933 one-liners** |
| consumers of the cured key | `src/pdf/sections/Institutions.jsx`, `src/foundry/journalPages.js` | both render it and neither needs an edit |

## 2. The ruling, and the three options refused

The chain becomes `desc` first, `description` second, `blurb` struck.

- **`desc` FIRST, not merely aliased.** A custom institution can carry both keys at once —
  a generated `description` and a DM-written `desc`. Reading `desc` first is the estate's own
  recorded law twice over: the DM-field projection module's header ("a DM-edited field always
  wins its position whole") and `format.js`'s `prominentProse`, which reads `phrasing` before
  `full` for exactly this reason. The ordering is pinned by its own acceptance arm, not left
  incidental.
- **The `description` arm SURVIVES.** It is the only live read for the custom producer. This is
  also why the reader-with-no-writer inventory never carried a row here: a PARTIAL writer
  satisfies that detector, which is precisely the blindness this member's instrument answers.
- **The `blurb` arm is STRUCK** under the §369 genesis standard, re-proven at this base rather
  than inherited. No persisted save from any app version can carry it on an institution record.
- **WRITE-SIDE RENAME refused.** The write already lands on the schema's canonical key, spelled
  identically in four lockstep registers. A rename would contradict the schema and force a
  migration over saved worlds — persistence shape, owner-gated. The read-side cure is
  migration-free: every persisted institution already carries its prose at `desc`, so every
  existing save renders correctly on its next export with nothing touched.
- **ALIAS WITHOUT REORDER refused.** It would restore the catalog prose and keep printing the
  stale generated line over the DM's text — fixing the absence while preserving the divergence.

## 3. The declared shift, priced

On the next export after landing, the PDF Institutions chapter and the Foundry journal begin
printing institution descriptions for every settlement.

- **CAUSE — a repaired read.** The writer and the schema were always right; the reader asked the
  wrong key. No generator, no simulation path and no persisted byte moves. Lived history and the
  standing promise are untouched.
- **ENUMERATION — key by key, executed.** 60 cases (five configurations across twelve seeds,
  including the committed parity, exemptions and byte-render seeds) walking 2396 institution
  rows. The raw settlement was byte-identical between the base tree and the cured tree at every
  case, so the shift is provably projection-only. Keys added: none. Keys removed: none. Keys
  moved: 2396, and every one of them is `services.detailed[i].description` moving from `null` to
  an authored string. Nothing else in the view model moved.
- **STILLNESS.** `description` sits in no `SHARED_FIELDS` row, so the golden view-model snapshot
  does not move; the whole `tests/pdf` suite passes with no snapshot re-recorded anywhere.
- **THE EXHIBIT.** One settlement rendered both ways — seed `RR2-exhibit-2026`, a germanic river
  town of 59 institutions. At base, ONE of the 59 cards prints a description, and that one is the
  custom institution showing its stale generated line. At the cure, 59 of 59 print, and the custom
  card shows the DM's own words. The Foundry bullet goes from a bare name to a name and its line.

## 4. Evidence

- **Reproduce before cure.** The tombstone row and the agreement pin were added FIRST and both
  refused at base — the registry walker naming its own row, and the pin reporting a failure list
  of exactly `['institution.desc']` while its other fifty-nine assertions passed. A pin that does
  not refuse at base, or refuses on any other path, is misaimed; this one refused on exactly the
  row the member cures, and the captured transition to green is the conviction.
- **Lifecycle round trip.** Edit, then revert: the slice returns to the generated `desc` string
  rather than to the absence the base defect produced. The persist, regenerate and import paths
  are untouched and were proven clean by the originating investigation.
- **The instrument.** A governed shrink re-freeze, not a hand edit and not a genesis. The
  inventory moves by exactly the one row this member strikes.
- **Schema-10 semantics observed.** A shrink moves derived digests and subject-tree manifests by
  construction, so "digests unchanged" is a schema-8 expectation and is deliberately not claimed.
  The condition is that every moved tree-manifest entry attributes to one of this member's own
  source edits.

## 5. The instrument this member adds

The reader-with-no-writer ratchet is structurally blind to the class, because a partial writer
satisfies its detector while the majority producer writes another key. The instrument that sees
the class is an editable-path to consumer agreement pin: apply a marked DM edit to every
queue-wired editable prose path and assert the marker arrives at the exact key its rendered
export surface reads.

It carries a register classifying all sixteen queue-wired paths — eleven that reach a rendered
consumer, five excluded with the docket that owns each — and a completeness arm that compares the
register against the live queue in both directions. A path added to the queue without a
classification refuses; a register row whose path has left the queue refuses. That two-direction
closure is what retires the class rather than only this instance.

One correction to the prototype it lifts: the prototype recorded all three `safetyProfile` paths
as unreadable. `guardEffectivenessDesc` DOES reach, through `deriveGuardAssessment` into the
defense slice's `guardAssessment`, and the production pin reads that real surface.

## 6. Commit shape

Three commits with one named, precomputed interior red — RR-1's own shape. C1 carries the source
cure, the corrected exemption captions, the tombstone row and the instrument; at C1 the walker
compares its live scan against the still-committed baseline and refuses by exactly the one-row
delta, and the standalone OSR gate refuses on the same row. Neither is exposed: that gate sits
outside `npm run check` and CI. C2 carries the regenerated baseline and the two figure
re-records, read off the re-frozen baseline rather than predicted. C3 carries this packet's
promotion record.

## 7. Judgments, each vetoable

- **J1** — `desc`-first ordering, pinned by its own acceptance arm, over the faction slice's
  `description`-first form. The DM's pen wins its position.
- **J2** — the instrument folded into `tests/pdf/parityContractExemptions.test.js` as ONE static
  title, over a new test file and over a third RR-1-shared path. That file's own charter is
  contract self-policing, and this completes it for the DM-edit dimension.
- **J3** — an in-pin exclusion register with docket citations and a two-direction completeness
  arm, over banked ratchet rows (the banked set is for failures, not classifications).
- **J4** — the `REMOVED_DEAD_FIELDS` tombstone with the exact read expression as its token,
  mirroring RR-1's ratified shape. The bare key survives lawfully elsewhere, so a bare-name row
  would convict a lawful line.
- **J5** — added the `overview.pressureSentence` exemption row while correcting its sibling's
  caption, over correcting the caption alone. A register that names one of the two paths and
  omits the other is half-honest.
- **J6** — the single-title aggregate shape with a failure list, over per-path generated titles.
  Loop-registered titles are invisible to the census and can park silently; the failure list
  keeps per-path attribution.

## 8. Raised, out of scope here

- **Owner product call:** should the PDF gain the settlement-scalar fallback for
  `arrivalScene` / `pressureSentence`? The screen renders both scalars; the export renders the
  AI-overlay versions only. This member's caption fix is honest under either outcome, and the
  exemptions test's existing arm is the tripwire against anyone adding the fallback quietly.
- **Owner docket (§399):** a custom institution's stale generated `description` beside the DM's
  `desc` is a two-key convergence question on the write side. This member restores the catalog
  read and deliberately touches nothing there.
- **Chartered, not cured:** `economicViability.summary` is overwritten by read-time
  reconciliation on both surfaces while sitting in the edit queue. It is the excluded register's
  third row and belongs to its own diagnosis.
- **Owner-cull docket (§369.2):** `safetyDesc` and `economicDragDesc` are DM-editable with no
  export reader anywhere; adding readers is new capability, not repair.
