# HEEP-1 UCF-1 frame artifacts

This directory contains only non-secret frame governance artifacts. Candidate identities,
aliases, item-level catalogue URLs, the ordered slate, reserve identities, and any later
holdout assignment must remain in segregated custody and must not be committed here.

`select-ucf1-frame.mjs` deterministically solves the 120-unit slate from a metadata-only
UCF-1 manifest. It exhaustively enumerates the nested 80/90/100/110/120 tranche subsets in
stable tie-hash order, uses only sound necessary-bound pruning, and has no heuristic node
or time cutoff. It can claim infeasibility only with a machine-verifiable frozen-pool bound
or a deterministic complete-search replay certificate. The first complete solution is the
stable lexicographic optimum.

A successful frame also requires a presealed queue for every selected slot. Queue entries
match the slot's exact macro-region/phase/scale stratum and each initial swap must preserve
every physical-context minimum, country/program/prior-exposure cap, quota, and leakage rule
at every affected legal prefix. Substitution scans that queue in order and revalidates the
full current slate after earlier substitutions; it fails closed when none remains legal.
Exact-stratum membership by itself is not an actionable reserve proof. A failed pool-bound
preflight writes an explicit, deterministic `FROZEN_METADATA_SHORTFALL` bundle with no
selected or reserve identities. The selector emits only aggregate data to standard output. The
manifest must be a pre-existing mode-0600 regular
file under a mode-0700 custody directory. The output directory must already exist with
mode 0700. Both realpaths must be outside every Git repository/worktree ancestor and have
no symbolic-link component; the selector never creates an arbitrary custody directory.
Every output file is opened without following links and is written mode 0600.

The frame steward runs the selector with explicit `--manifest` and `--out-dir` paths.
The selector does not allocate the holdout.

`node test-ucf1-exact-solver.mjs` runs identity-free synthetic checks for a satisfiable
nested slate, deterministic tie behavior, all 120 full-vector replacement queues,
replacement-terminal backtracking, a direct necessary-bound certificate, and a complete-
enumeration replay certificate.

Before hashing, the selector validates the frozen Draft 2020-12 schema and semantic joins.
Canonical names and aliases are NFKC/casefold-deduplicated within country/polity. Reused
package identities require an explicit pre-frozen multi-town package relation. Connected
shared-package/equivalent-edition leakage clusters are hashed; non-singleton clusters are
excluded from slate and actionable reserve selection, so no legal prefix or later holdout
can divide one. Known scale/function values require the complete observed P31 class set to
resolve through the pinned exact class allowlist and join the primary frozen catalogue
package; the `UNKNOWN` branch forbids authority-class fields. Program-level synthesized
scale labels cannot authorize `KNOWN`.

Physical-context tags are derived from a pinned complete authority extract for every
resolved candidate and a closed value-to-rule allowlist. Candidate tags and evidence must
equal every applicable rule match; free text and country-level landlocked status cannot
authorize a context. Candidate eligibility, exclusions, prior-seen membership, source
metadata, and all authority registries are closed, hashed joins. Root, candidate, package,
and evidence schemas reject undeclared fields, including outcome-bearing additions.

The UCF-1 selection inputs are limited to the independently frozen metadata axes named
in HEEP-1 section 3.2, plus prior-exposure eligibility. RSLP agrarian, tenurial, and
dispersion variables and AMP function/system, status/resource, construction-system, and
survival variables are not UCF-1 selection or holdout inputs. Unless a later child frame
freezes independent metadata for them, they remain `UNKNOWN` or later cohort variables.

Current status: public UCF-1.1 tooling, metadata rubrics, and an aggregate shortfall receipt
are built. Exact item-level metadata cannot satisfy the scale and affirmative
`OTHER_INLAND` minima at any legal prefix, so no urban slate, actionable reserves, or
holdout is frozen. Child cohorts, source opening, and deep audits remain unbuilt.
