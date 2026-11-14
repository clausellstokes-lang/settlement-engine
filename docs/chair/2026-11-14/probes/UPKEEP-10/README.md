# UPKEEP-10's probes (2026-11-14)

- `m869.mjs`: `TREE=<tree> node m869.mjs <corpus.gz> [--list]`: the births with a siege in force (`stress` holds `under_siege`) and the trade-connectivity band the causal state gives them (the band both Foundations grids print).
- `m10income.mjs`: `TREE=<tree> node m10income.mjs <corpus.gz> [--list]`: the grain line beside a failed grain harvest or a grain/flour export; the coal lines and every road-word income line under a siege.
- `g10.mjs`: `TREE=<tree> node g10.mjs <rr2s-/rww- seeds...>`: one birth in the income test's reader shape, its grain row, failed source and grain exports.
- The corpora: the 1,490 by UPKEEP-9's `birthgz.mjs`; CENSUS-2's 720 by `census2.sh` (its `corpus.ndjson.gz`). The dumps' views are grepped per besieged town for "connectiv" (`awk '/^== /{v=$0} tolower($0) ~ /connectiv/'`).
