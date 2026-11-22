# REVIEW-VEIL-15 — the fifteenth fresh security reader of the share veil (212)

Seat of the eighth chair (session_01ACmDYY29VRchM87v1yhL9Q). Assignment: `lane/chair-2026-11-08 :: docs/chair/2026-11-21/eighth/prompts/REVIEW-VEIL-15.txt` (read at 70ca672a4), with REVIEW-VEIL-14/13/12.txt as its body. I change no product code.
**No verdict yet: 212 is NOT cleared.** Probes and outputs: `probes/REVIEW-VEIL-15/`. Hours by `date -u`.

## 0. Instruments (written 2026-11-22 08:14 UTC)

Built by REVIEW-VEIL-13.md section R, steps 0-4, verbatim: scratch PostgreSQL 16.15, unix socket `/var/tmp/rv7`, `listen_addresses = ''` (read back empty), fsync off; scaffold `docs/chair/2026-11-13/veil-probe-5/native/scaffold.sql`, then REVIEW-VEIL-12's `chain.sh <db> 212`, then REVIEW-VEIL-13's `seed.sql`. No FAIL line on either chain.
- `pre212` = 302850b0b (211 `eface6d09393…`, 212 `fec111c20501…`).
- `x212` = the lane `origin/lane/veil-32-2026-11-22` at **6fa4f7619** (211 `eface6d09393…` = the frozen 211; 212 `8688ddb6148e…`).

BITE (executed, `sh probes/REVIEW-VEIL-15/bite.sh 6fa4f7619`; outputs `out/bite-{base,lane}.json`): REVIEW-VEIL-11's `r2a.probe.jsx` arm C, 24 born towns × (unmarked, marked) × (Reveal DM off, on) = 96 rows per measure. At 302850b0b each of the eight raw measures is served 96/96 (`blackMarketCapture` 48/96), `severity` 84/96, `powerStructure.stability` with words after its band 84/96: RED. At 6fa4f7619 every one of those is 0/96: GREEN. The row's `stability` TILE column still carries words after the band at the lane, 21/24 on every arm (e.g. "Shaken — nobody trusts those in charge"), as REVIEW-VEIL-13 found at 15567e597: a lead for DOORS-IN (VR44), not measured further.

Waiting for "R3 <commit>".
