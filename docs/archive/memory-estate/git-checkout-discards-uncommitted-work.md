---
name: git-checkout-discards-uncommitted-work
description: "The mutation sweep's `git checkout -- <file>` revert idiom is safe only for COMMITTED targets; used to undo a negative control on an uncommitted edit it silently discards the real work too — back up with cp instead"
metadata:
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-04T16:51:19.755Z
---

Bit on 2026-08-03 during lane C VH-3. I had edited
`supabase/migrations/195_civility_guard_and_public_identity.sql` (pinning
`update_display_name`'s `search_path` and rewriting its note) but had NOT yet
committed. To prove the new ratchet fired I planted a negative control with
`perl -0pi`, ran the test (correctly red), then reverted with
`git checkout -- <file>` — copying the idiom `scripts/mutation-sweep.sh` uses in
`check_caught`. That restored the file from the INDEX, which discarded the
control AND both of my uncommitted edits. `git status` came back clean and the
migration was silently back to its bare form; the pin and a 20-line authored note
had to be re-written from scratch.

**Why:** `check_caught` is written for MUTATED_FILES, and the sweep refuses to
run at all when any of them is dirty (the dirty-tree guard exists precisely so
`git checkout --` can never eat a maintainer's WIP). Borrowing the revert line
without borrowing that precondition removes the only thing making it safe. The
failure is silent in the worst way: the tree looks clean, so nothing signals loss
— detection is noticing your own edit is gone.

**How to apply:** when running a negative control on a file whose real changes are
UNCOMMITTED, back up and restore by copy, never by git:
`cp <file> /tmp/x.bak` → plant → run → `cp /tmp/x.bak <file>` → `rm /tmp/x.bak`.
Confirm the restore with `git status --porcelain <file>` (expect your own edit
still listed, not an empty result). Reserve `git checkout -- <file>` for controls
on files that are tracked AND clean. Better still: commit the real edit first,
then control against the commit — that is what the sweep assumes.

**BIT AGAIN 2026-08-04 (checkout-index variant, WR-10r):** an Opus lane used
`git checkout-index -f -- <one path>` to restore a document mutant and it
discarded the lane's OWN uncommitted §3 amendment paragraph along with the
mutant (nothing foreign touched; the paragraph was re-authored and
re-verified before commit; incident recorded un-smoothed in the WR-10r ledger
row @ 01ec1409). The whole checkout FAMILY — `checkout --`, `checkout-index`,
`restore` — cannot tell a mutant from real work; the cp-backup rule is
absolute and is now spelled in the §10 preamble.

Related: [[agent-stash-incident-2026-07-14]], [[shared-index-commit-race]],
[[public-payload-veil-seam]].
