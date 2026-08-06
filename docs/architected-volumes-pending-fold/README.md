# Architected volumes awaiting their integration fold

**Why this directory exists (read this first).** These volumes were architected
in the 2026-08-05/06 sessions and lived ONLY in the session scratchpad under
`/private/tmp/`. That directory is session-scoped and is destroyed by a reboot
or a tmp sweep. Roughly 1 MB of architecture — three programs, ~38 build waves
— had no copy in git. This directory is the durability copy, landed on the
LEDGER branch (`review-fixes-2026-07-08`) because it is the branch a successor
bootstraps from and because `claude/composite-r4`'s tree was held by a
concurrent build lane at the time.

**These are SNAPSHOTS, not the canonical home.** Each volume's canonical home
is `docs/DESIGN_FP_ARCH_<PREFIX>.md` on `claude/composite-r4`, landed at an
integration fold using the established fold procedure (the ES + WY fold of
2026-08-05 is the worked precedent). Folding is a real wave — it renumbers
sections, reconciles cross-volume references, and updates the census. Do NOT
simply copy these files across.

## Contents

| File | Program | State at snapshot |
|---|---|---|
| `EPOCH_living-futures_SEALED.md` | EP — advance-epoch / living futures, **16 waves** | **SEALED.** Chair-attested after six adversarial rounds. ⚠ EP-0's charter must RE-DERIVE the §5 VERIFY-AT-FOLD figures after the fold. |
| `HABIT_conditioning_round4-snapshot.md` | HB — habit conditioning, **10 waves** | **MID-ROUND-4** (the cap round) at snapshot time. If the round-4 lane closed after this snapshot, its sealed output supersedes this file — check the session journal before trusting it. |
| `HABIT_countsweep.py` | HB instrument | The COUNT LEDGER (J-HB-27): derives every counted quantity from the volume's own tables and diffs each against its declared prose homes. Round 4 adds the STRUCK-PREMISE SCAN family (J-HB-28). Re-run at EVERY revision; re-paste its census into §9. |
| `HABIT_VERIFY_oddsratio.py` | HB instrument | The preserved sweep proving the ODDS-RATIO LAW (pairwise odds ratios are bounded under renormalization; the per-probability claim is FALSE and was deleted, not narrowed). |
| `WC_war-circulation_in-progress-snapshot.md` | WC — war circulation (a)–(p), **~12 waves est.** | **IN PROGRESS** at snapshot time — the architecture lane was still running. Treat as a draft; the lane's final output supersedes it. |
| `DIAGNOSTIC_SOAK_DESIGN.md` | The diagnostic-soak harness | Design for the composition soak scheduled at build-complete-dark per `START_HERE.md` §3h. FINDINGS ONLY — it may never sign, apply, or adjust a band. |

## The owner directives these volumes serve

Each volume is the architecture of an owner directive recorded verbatim in the
memory estate (`~/.claude/projects/-Users-cstokes-Desktop-settlement-engine/memory/`):
`advance-epoch-living-futures-directive.md`,
`habit-conditioning-directive.md`, and
`war-auxiliary-contribution-directive.md` (sections (a)–(p)).
**If the memory estate is unavailable to you** — a different Claude account, a
different machine — the owner's intent is quoted verbatim inside each volume's
own opening section. The volumes are self-contained by construction, for
exactly this reason.

## Standing obligation

Refresh these snapshots whenever their source volumes change, and DELETE a
file here once its program has folded into `docs/DESIGN_FP_ARCH_*.md` on
`claude/composite-r4` — a stale snapshot beside a landed volume is the
derive-don't-restate hazard this program has been bitten by repeatedly.
