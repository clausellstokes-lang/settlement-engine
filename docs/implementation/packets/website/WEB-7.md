# WEBSITE / WEB-7 — the notices elections recorded, and the section that had to be sliced to prove it

- **Status:** LANDED
- **Landed at:** the `web-b` train's third car, on the lane tip held for the chair's CAS.
  Built by lane TE-WEB7 on 2026-08-22. Do not redispatch.
- **Packet version:** `1`
- **Verified base:** `claude/composite-r4` at `2b82121fccf02d978accfbc82871ca838aea1eff`
- **Last revalidated:** 2026-08-22 at `2b82121fccf02d978accfbc82871ca838aea1eff`
- **Landing note:** authored at the BUILD base `19b799ce718d52e36a3b14a85fa9cfd5051ccf26` as
  `e5975829679ecbf5e048f9f5cce34c01d7bb5ac5` (pinned at `refs/preserve/holding-web7`), rebased at the
  landing onto `2b82121f` (WEB-6, the 30th landing) as member commit
  `16087e2bbb81e01c50ac7c8e17fd4f8aea03a424`; the re-stamps ride the commit after it. The packet was
  ALREADY at the terminal status when authored (the §410 form — see §7), so no status walk was owed
  at the slot and the terminal gate fires at the re-stamped LANDED tip itself. See §8.
- **Train:** `web-b`, family **WEBSITE**, member **3**. WEB-1 founded the family at §408.
  At the BUILD base its packet had not yet landed, so this packet was authored creating the
  family directory; at the landing slot the directory already holds WEB-1, WEB-4, WEB-5 and
  WEB-6, and this file is a plain add into it (keep-one on the directory). The packet is
  self-contained: no `preambles/` file exists for the family and none is assumed.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§362.2** (the signature on the two
  elections, and the instruction that the notices surface records both at its next touched
  landing) · **§402 C6** (the chair's inclusion of WEB-7 in the website train) ·
  **§410.1** (this lane's dispatch and seat) · **§295.5c** and **§317.1** (the notices
  surface's own charter, including the law that licence texts are re-derived from the
  shipped artefact and never recalled).
- **censusAuthorization:** §362.2.
- **Compile of record:** `draft-WEBSITE-PLAN.md` §7 (member) and §13 (standing laws).
- **Behavior posture:** DOCUMENTATION + PIN. Zero `src/` motion, no migration, no
  persistence shape, no tuning, no golden, no declared shift, no dependency change. The
  notices page stays **DARK**: lighting its link is an owner act (§317.1) and the darkness
  pin is re-run untouched.
- **Census posture:** no new test file. One `describe` and five `it()` titles are added to
  the already-credited `tests/build/thirdPartyNoticesPage.test.js`, so the estate census
  moves on `titles` and `suiteTitles` alone and is re-recorded with attribution.

---

## §1 · THE RULING, RECORDED

§362.2 signed both elections: **`dompurify` 3.4.12 elects Apache-2.0** and **`rgbcolor`
1.0.1 elects MIT**, following the owner's own §295 precedent — the permissive-standard
election already made for JSZip and jQuery UI Touch Punch and recorded in §1.3 of the
notices document. The row's operative sentence is the schedule: *the notices surface
records both at its next touched landing*. This member is that touch.

Before this member, §3.3 of both notices copies was headed "Dual-licensed packages with
no election recorded" and each row's Status cell read "no election recorded". After it,
§3.3 is headed "The two production-dependency elections" and carries an **Our election**
column in the §1.3 idiom, so the two halves of one question are stated in one voice.
The §3.1 summary rows and the §3.2 inventory rows gain the same election pointer §1.2
already carries for JSZip and Touch Punch, and §4.4 stops describing Apache-2.0 as "one
of the two options" and describes it as the grant `dompurify` reaches a recipient under.

## §2 · THE LICENCE FACTS, RE-DERIVED AT THIS BASE

§317.1 forbids recalling or inventing a licence text. Every fact below was read out of
the package installed by `npm ci` against this base's lock file, in this lane's own
worktree:

| Artefact | Reading |
|---|---|
| `dompurify` manifest | `"license": "(MPL-2.0 OR Apache-2.0)"` at version `3.4.12` |
| `dompurify/LICENSE` | the Apache-2.0 text, 11,358 bytes, SHA-256 `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30` — full, with the APPENDIX and the unfilled boilerplate |
| `dompurify/LICENSE-MPL` | the MPL-2.0 text, 16,726 bytes, SHA-256 `fab3dd6bdab226f1c08630b1dd917e11fcb4ec5e1e020e2c16f83a0a13863e85` |
| `rgbcolor` manifest | `"license": "MIT OR SEE LICENSE IN FEEL-FREE.md"` at version `1.0.1` |
| `rgbcolor/LICENSE.md` | 1,182 bytes, SHA-256 `86045408b01f66f9319a2fe7bc7f7e115f272956ac44d2d840fc00127124a78c` — the copyright line, the MIT body, then an *Exemptions* heading naming the choice |
| `rgbcolor/FEEL-FREE.md` | 256 bytes, SHA-256 `b5aa5b115427980bda4fb6cecdff9f6eab4adafae5ab3aeaf00e0a9ca7f0c780` — the alternative, and it is not the grant we rely on |

⭐ **The MIT claim is derived, not asserted.** §3.3 tells a `rgbcolor` recipient that the
terms are the MIT terms reproduced in §4.1. That sentence was checked rather than written:
`rgbcolor/LICENSE.md`'s body, less its copyright line and its *Exemptions* tail,
whitespace-normalises to exactly the 1,020 characters §4.1 already reproduces from
`react/LICENSE`. **No licence body is added to either copy by this member** — Apache-2.0
is already a §4.4 "longer licence" whose text travels inside the package, and the MIT text
is already reproduced once in §4.1.

## §3 · THE OFL RIDER WAS ALREADY DISCHARGED — RE-DERIVED, NOT INHERITED

The compile's §7 and §402 C6 both carry the OFL font gap ("the OFL-licensed fonts ship
with no licence file") as work riding along with this member. **At this base that gap does
not exist**, and the compile pin is where it went stale rather than anywhere later:

- `public/fonts/OFL.txt` is present at `19b799ce`, 6,668 bytes.
- Its trailing 4,303 bytes hash to
  `3c17a8394f32ef59bcf50896331249c22a4a4b9c53a5c6d5b9b88464b1c77239`, which is the SHA-256
  the chair recorded for the elected OFL 1.1 body — so the shipped tail is that body
  byte-for-byte.
- The incompleteness marker the surface used while the body was outstanding is absent, and
  the two-directional agreement pin that forces the three artefacts to move together is
  green in the cured direction.
- The cure landed at `fb80e32f` (lane TE-OFL, the §323.2 rider's completion), which is an
  ancestor of the compile's own pin `eb6124a6` and therefore was already in the tree when
  the charter described the gap as open.

**Nothing was re-shipped.** Re-pasting a body that is already byte-correct would have been
a licence-text motion with no cause, which is the precise act §317.1 exists to prevent.

## §4 · THE PIN, AND THE VACUITY IT REFUSES

The agreement guard already sliced §3.2 on both sides and compared ordered `name@version`
lists, because a whole-document `includes()` had been measured passing after a row was
deleted — the page's own prose names the packages its table enumerates. The election rows
are the same shape with a worse blast radius, and this member does not repeat the mistake:

- `electionsFromMarkdown` slices between `### 3.3` and the next `##` heading; on the page
  side `electionsFromPage` slices between `<h3>3.3 ` and that section's `</table>`.
- Each row is read as `name@version=licence`, and the two ordered lists are compared with
  `toEqual`. That one assertion catches a dropped row, an added row, a re-ordered row, a
  version moved on one side, **and an election flipped on one side** — the last of which a
  name-only membership check could never see.
- The elected values are ALSO pinned as literals, so the pair agreeing with each other on
  a wrong election still reds.
- The CONTROL feeds both extractors a forged election row, a struck one, and a near-miss:
  a §3.2-shaped inventory row for the same package. It asserts the struck document still
  *contains* the package name and that the extractor nevertheless returns `[]` — which is
  the vacuity, executed, rather than described.

## §5 · EVIDENCE

Four mutations were run against the finished pins, each restored and the restoration
checksum-verified:

| Mutation | Result |
|---|---|
| the `rgbcolor` election row deleted from the page's §3.3 table | 2 failed — the ordered comparison and the literal pin |
| the Markdown `dompurify` election flipped to MPL-2.0 | 2 failed — the same two, so a one-sided flip is caught by both |
| the Markdown §3.3 heading renumbered (the section vanishes) | 5 failed, including the liveness arm proving neither scan is looking at nothing |
| the "option we did not elect" sentence removed from the page | 1 failed — the plain-language arm |

The census was derived figure by figure from the walker's own convictions, never by
arithmetic: `expected 20724 to be 20719`, then on the re-run the sequence permitted,
`expected 5786 to be 5785`. Because the census is sequenced, the first red arriving at
`titles` is itself the executed proof that `files`, `parked` and `credited` did not move.

**Re-derived at the landing slot `2b82121f`.** The authored tuple `2,497/364/2,133/20,724/5,786` was a
reading at the BUILD base and was NOT carried. Six landed re-records (H8B, MF-T2H, WEB-1, WEB-4,
WEB-5, WEB-6) moved the slot's own tuple to `2,500/365/2,135/20,751/5,791`; this member's delta
`+0/+0/+0/+5/+1` crossed the rebase, so the landed tuple is `2,500/365/2,135/20,756/5,792` —
convicted by execution under the shared mutex (33/33, exit 0), with the negative control executed:
the slot's own tuple put back reds at `titles` with *"expected 20756 to be 20751"*, by exactly this
member's delta, and the file was restored byte-identical.

## §6 · JUDGMENTS, EACH VETOABLE

- **J1** — §3.3 is REFRAMED as the elections section rather than given a new section
  beside the old one. Two sections, one saying "no election recorded" and one recording it,
  would leave a compliance surface contradicting itself.
- **J2** — the §3.2 inventory rows keep their raw manifest strings and gain an election
  pointer, exactly as §1.2 does for the two map libraries. The column's contract is what
  the artefact declares; the election is an annotation on it, not a replacement for it.
- **J3** — the §3.1 count rows keep their counts and name the election in the label. The
  offer is still what the manifest says; moving `dompurify` into the Apache-2.0 count would
  have hidden that a choice was ever there.
- **J4** — no licence body is added. §4.4 already routes Apache-2.0 to the package's own
  travelling text and §4.1 already reproduces MIT; a second copy is redundancy that can
  drift.
- **J5** — the elected VALUES are not named in `requiredSymbols`. A landed packet asserting
  `Apache-2.0` as a live symbol would trap a future owner who re-elects; the rows anchor on
  structure — the section headings and the pin's own functions and describe title.
- **J6** — the OFL rider is reported as already discharged rather than re-executed, and the
  compile's stale line is named as stale rather than quietly worked around.

## §7 · RAISED, OUT OF SCOPE HERE

- **Owner and counsel, unchanged:** TinyMCE/GPL (§254.5.5, §295) — a disposition, not a
  signature, and untouched by this member.
- **Owner act, unchanged:** lighting the notices page's navigation link (§317.1). The
  darkness pin is re-run, not relaxed.
- **Still open, carried forward from TE-NOTICES:** `png-js` declares no licence field in
  its manifest while shipping MIT text; §3.1's note already records that reading, and no
  election is owed there because no choice is offered.
- **Recorded for the landing slot:** `docs/implementation/PACKET_MANIFEST.json` and
  `docs/implementation/INDEX.md` share an append anchor with WEB-1 and RR-2, so a conflict
  at the CAS is expected and is a mechanical keep-both — hand-resolved and re-validated,
  never auto-merged. This packet adds NO family header and NO index section: the family
  directory did not exist at this base and is created holding only this file, the manifest
  change is a single appended row, and the index change is a single row inside the existing
  table. Two siblings founded the same family in their own holding trees, so the resolution
  at the rebase is keep-one on the directory and keep-both on the rows. *At the landing
  (§8) this is exactly what happened: the directory was the slot's, the manifest and index
  rows were keep-both, and the walker was the slot's bytes plus this member's block.*

⭐ **THE TERMINAL STATUS IS LOAD-BEARING, AND IT WAS PROVED RATHER THAN ASSUMED.** At the
BUILD base WEB-6 held the census-holder reservation on
`sovereigntyLightingContract.walker.test.js` (at the landing slot WEB-6 is LANDED and the
READY row holding that reservation is MF-T2H's — the same collision, a different holder),
and this member moves that same census. The validator reserves change paths at every
NON-terminal status (`reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)`), so a
DRAFT or READY WEB-7 would collide with the holder. Run against a two-packet probe naming
that one path, with the sibling held at READY:

| this packet's status | duplicate-change-path errors |
|---|---|
| DRAFT | 1 — `(SYN-HOLDER, SYN-MINE)` |
| READY | 1 — the same |
| LANDED | none |
| SUPERSEDED | none |

The §410 retrospective-mint law and the census-holder rule therefore agree rather than
conflict here: the member's work was complete before the packet existed, terminal is the
only valid status for it, and terminal is also the only status that spares the collision.

## §8 · The landing slot

- **Rebase:** `git rebase --onto 2b82121f 19b799ce HEAD`, the single holding commit carried as authored. The
  base was an ancestor of the slot (19 landings between). Carry-proof-by-absence at blob level FIRST: the
  three predicted files moved at the slot (the census walker, `PACKET_MANIFEST.json`, `INDEX.md`) and the
  four others (`THIRD-PARTY-NOTICES.md`, `public/third-party-notices.html`, the `tests/build/` host, this
  packet's CREATE) had the SAME blob at base and slot — no landed sibling touched the notices surface, so
  nothing was re-applied. No other `*notice*` test exists under `tests/docs` or `tests/lint` at the slot.
- **Surgery:** walker = the slot's bytes + this member's block appended below WEB-6's, tuple re-derived
  (§5); manifest = the slot's bytes + this row by string surgery from the holding commit's own insert
  bytes, never re-serialized (deep-compare 153 → 154, ADDED=["WEB-7"], REMOVED=[], DRIFTED=[]); INDEX
  keep-both, this row after WEB-6's in the infrastructure table (append order, where it was authored).
- **Re-stamps:** `verifiedBase` → the slot sha in the header and the manifest row (scoped to this row's
  span; RR-2's `19b799ce` row untouched); the authored member sha kept beside the rebased one (landing
  note). The status was LANDED from the build (§7), so `validate:packets` was green at the rebased
  member commit already — `valid: 154 packets (1 READY)`, the 1 READY being MF-T2H's pre-existing row.
- **S0 at the slot:** `check-observed-shape-readers` exits 1 at the tip and at the chair's baseproof
  `b10ed1a1` with one identical message ("detector or unscanned execution input changed since the
  schema-10 instrument was governed") — and exited 0 at this member's BUILD base (`1996 finding(s),
  exactly matching`, the build receipt), so the break landed between base and slot and is mint-class,
  pre-existing, recorded not cured. The frozen baseline `scripts/.observed-shape-readers-baseline.json`
  is the same blob at slot and tip, and none of the seven delivered files is in its inventory.
- **Terminal:** the full bare `npm run check:tail` fires at the LANDED tip itself (the gate tip and the
  final tip are one commit); its verdict lines are in the lane receipt and the chair's ledger row.
