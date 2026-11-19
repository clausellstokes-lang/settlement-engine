**NO VERDICT YET.** REVIEW-VEIL-9, the fresh security reader of migration 212 (the owner's rule: 212 is not applied
until a fresh reader clears its final text). Phase 1 (the cold pass at the tip the chair names "JOINED") has not
started; phase 2 (the clearance at the chair's "FINAL <checksum>") follows it. Until section 7 of this file says
CLEAR at a named checksum: **do not apply 212.**

# REVIEW-VEIL-9

Nothing outside this branch is changed by this seat. Every database is a scratch PostgreSQL 16.15 cluster in this
container (unix socket only, `listen_addresses = ''`). No hosted database, no production credential.

## Instruments (made before the cold pass)
- The cluster, `pg@8.13.1`, the earlier readers' library from 72a3bb24f (outside every tree), a detached worktree of
  origin/master (db832c892; `HUSKY=0 npm ci`, so the shared git config was not written: diffed before and after).
- Baseline, the library at the veil lane's pre-join tip 4fa35f294 (212 `46389052…bce0b0b`): 37 checks, 35 pass, the
  two known open (a07, d06); server against twin 15 of 15 equal; V7-10 and V7-6 rows pass.
- My own probes (`probes/REVIEW-VEIL-9/`): a fold for every script, the rendered public page, the stored public prose
  by counterfactual. The blind spots of the earlier cold passes they answer: a case-sensitive search (REVIEW-VEIL-6),
  a name with no Latin letter (REVIEW-VEIL-7's V7-1; the library's searches still folded with `[^a-z0-9]`), a hidden
  effect inside a composed note (V6-10); and one of my own: no earlier reader read the PAGE drawn at the joined tree,
  whose new display builders (PR #75 points 33 to 73) compose sentences on the reader's side.
- Hooks: `core.hooksPath` is unset in this clone and `.git/hooks` holds no hook, so a plain push runs none; I did not
  install husky's (that writes the shared config). No push used `--no-verify`.
