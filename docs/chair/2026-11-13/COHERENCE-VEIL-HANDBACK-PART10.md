# COHERENCE-VEIL — hand-back, part 10: the ninth seat (a house by every name; a name in any script)

Seat: VEIL-9, lane `lane/coherence-veil-2026-11-11`, from **6692efdda** (read back from origin first: equal). Every
database is an in-process pglite or a scratch native PostgreSQL 16.15 cluster in this container (`/var/tmp/cv9`, locale
C.utf8, trust auth, unix socket `/var/tmp/cv9sock` only). No hosted database, no production credential, no
`supabase db push`, no `migration repair`, no deploy, no golden's door. **Nothing is applied anywhere but those local
databases.** The container restarted once (after the item-1 cure was written, before its proof); nothing was lost.

**TIP:** the commit carrying the latest copy of this file, read back from origin.

## 0. The bytes (kept current)

| File | sha256 |
|---|---|
| `supabase/migrations/211_server_side_share_veil.sql` (FROZEN, untouched) | `eface6d093933170b9541fe630068c26e5bd41477e95e913ae7168e373be0b01` |
| `supabase/rollback/211_server_side_share_veil.down.sql` (FROZEN, untouched) | `ce8474ffc251b4c4bd6005d5a409d4a15bd20fef6b507534ef6338d3bd49712f` |
| 212 at 6692efdda (PART 9's last) | `377cc61daf0916fbc769bd34fb5d4383aebf5f630d43f9e0207bb14f937e0733` / down `6a642ad0…fc66d` |
| 212 after item 1 | `a222b83dc0d05a03d0de88106be2e573f8ebf4a3ca5b08a1a871c4c143ed78f3` / down `5e85b349b82305ef3033ea8bfc0abc51dcfac0a81113458504223a4a5b2c4c01` |

**Not final. The owner's pack `veil-212/` still describes old bytes: do not use it.**

## 1. Order of the work, and why it differs from the brief's

The chair's V7-1 ruling (REVIEW-VEIL-7, a name in any script; 23:42 UTC) said it goes FIRST, before item 1. It reached
this seat when item 1's cure was already written and under its proof run; item 1 was committed first and V7-1 is the
next commit, built on it (its fold replaces item 1's). Item 2 follows V7-1.

## 2. Item 1 — a house by every name (the chair's ruling on PART 9's first limit)

**Measured first.** The rename's writer (`src/domain/institutionRename.js :: applyInstitutionRenameToSettlement`)
rewrites `name` (and the handles that join by it) and nothing else: no birth name, no alias is written. A stamped house
keeps `catalogId`, which is the fold of the name it was born with (`institutionalCatalog.js :: catalogIdForName`;
519 of 519 catalogue names, `fold(name) === catalogId`). On the 24 corpus towns (the planted run's seeds, the lane's
generator; scratch probe `measure1`): both lists equal the lower-cased NATIVE roster in the roster's order on 48 of 48
lists; 1,744 entries, 0 that no house accounts for; 821 stamped houses, 51 unstamped (none a catalogue name), 0 custom.
No page component reads `compound.inst.names` (search of `src/`, outside the twin): a dropped entry changes no page.

**The red** (`veil-probe-9/out/guard-every-name-red.txt`, the new arm at 6692efdda): a hidden house renamed after
birth is sent by its birth name in both lists, in a chain's processing names, in the trace (`targetId`, `causes`,
`downstreamEffects.target`) and in a person's goal, by the server and the twin; a hidden name holding U+0130 and
U+212A is sent in both lists by the server only (the twin's fold and PostgreSQL's `lower()` differ there).

**The cure** (212 and the twin, rule for rule):
- the two lists BY POSITIVE ACCOUNT: an entry stays only where a NATIVE house still listed accounts for it, each house
  for one entry, in the list's order: a stamped house by its catalogue identity, an unstamped one by its name;
- the birth name (catalogue identity) of every house removed whole joins its names (the sweep, the trace, the chains);
  a stamped house answers the engine's processor match by its identity (id-first, as `institutionMatchesProcessor`),
  open houses likewise;
- the fold made engine-equal (superseded by V7-1's fold).

**Proof** (`out/guard-every-name-after.txt`): the guard, 5 of 5, at the cured bytes: (i) renamed and hidden whole:
neither name anywhere, six reads and the twin, both shapes, reveal off and on, live, frozen and `houses`; (ii) the
two-engine capitals: not sent; (iii) every entry of a house still listed is still sent, a renamed open house's
included: **0 dropped**, on every share of the guard's towns (arm 1 holds the same check on all its shares). The fold
arm, red at 6692efdda (`out/guard-folds-red-at-6692efdda.txt`), green after. Gates: `typecheck:domain:strict` 0
(1,113), `typecheck:ratchet` 0 (167), eslint 0, each through `scripts/gate-tail.sh`.

**What a renamed open house can lose:** an UNSTAMPED house (no catalogue name) renamed after birth keeps no other name,
so its entry is not accounted for and leaves the lists on a share that hides some house whole. No page reads the lists.

## 3. Rows left outside the law (PART 9's list, kept current)

PART 9 §3's rows stand. Limits closed here: "a house renamed after birth keeps its birth name" (item 1); "the two
engines fold some capitals differently" (item 1, then V7-1).
