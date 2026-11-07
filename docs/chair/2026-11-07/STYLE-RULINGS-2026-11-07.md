# STYLE — THE CHAIR'S RULINGS ON THE STYLE AUDIT (2026-11-07, 02:4x UTC)

Chair: Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`, under the owner's delegation and the owner's style law (WIRING-RULINGS §5–§8). The audit is `docs/chair/2026-11-07/STYLE-AUDIT-2026-11-07.md` (STYLE-0, `1863515ec`): 4,140 lines audited, PASS 2,378 · REWRITE 1,762 (401 of them print in the 12-town sample), the tics measured (about five "a stranger" and five "rather than" per printed dossier), the twenty most-repeated story frames (the referee), the forty first-impression lines with three vantages each. Every ruling below is vetoable by the owner by a word; every rewritten line is listed old → new in its lane's record for the veto.

## 1. The forty first-impression lines (§2a): APPROVED as proposed, with these strikes and gates

- **Struck as fabrication:** #7 V2 and #12 V1 call Walpurga Corvinus "the fisherman" — the record says Agent of the Elder Council. The lane writes those two variants from the record's role. Every variant is read against the record before it is taken (the audit's own estimate: one rewrite in five carries a clause the record does not hold).
- **#9 (the historical character):** approved only once the character pool READS `history.majorEvents[]` (its `needs`); until then the line stays as it is. W5 adds the read and the variants in one cause.
- **#10 (a port reason without a wharf) — A RECORD DEFECT, not a wording:** `generateSettlementReason`'s port reason must read whether a docks or wharf institution exists; with none, the terrain reason (the pass) prints. W5, red-first, one signed cause (the golden master moves where the reason text sits on the record).
- **#23 (clerks and rolls in a thorp) — a tier gate:** DS-POW-1's pool reads the tier (and the office's existence) before it speaks of clerks; the thorp variants speak of the elder and the households. W3.
- **#37 (the daily-life button caption printed as body text, 500 of 1,000 towns):** the caption leaves the body; the section keeps its heading and its lines (nothing cut). W4.
- **#36 (the viability verdict frame, 346 towns):** per-verdict variants, slotted with the warning the record names. W2.
- **The class rulings the audit asked:** (a) DS-DEF-3, DS-CND-1 and DS-DEF-8 get THE STRESS TYPE IN THE POOL KEY — one variant set per crisis, a declaration change in the annex, not a sentence patch (W2 for DEF, W4 for CND); (b) the eight direction-dependent lines (#1, #8, #19, #20, #29, #30, #38, #39) are authored in TWO sets, arrivals and departures, on W0's `stress[].direction`; the lanes write the arrivals set first and the departures set the day W0's field lands in their base (merge `lane/wiring-w0-2026-11-07`), never one set printed for both; (c) the duplicate crisis summary (#29, four times in one PDF): ONE surface keeps the full text (the crisis section) and every other surface prints a DIFFERENT vantage from the same pool — cover = traveller, Overview = local, Defence = watch, Tonight = official — so the variants cure the duplicate by construction (§3 of the audit governs the rest of the duplicates the same way).
- **The chrome headlines (#1–#7, `headlines.js`):** approved; the machinery leaves; the label stays as the first word where the audit kept it ("Struggling.", "Lightly defended:", "Viable,"). #6's institution list is slotted from the roster only (no "the mill is a walk away" unless the record's gap row is declared as a READ). W7.

## 2. The section tables (§2b): APPROVED AS PROPOSALS, under five laws

1. A lane takes a rewrite only after reading it against its block's declaration; a clause that states a fact the block does not READ is struck or the READ is added (the census law). The one slot the audit struck (`{good}` in DS-POW-1 / PROSPERITY adverse / v01) stays struck.
2. SLOTTED over FRAME; a frame is allowed only where no town noun exists, and then the pool gains variants, never ornament. No rewrite raises the twenty most-repeated frames (§1c); the lane measures its block's frames on the 1,000 before and after where its block is in that table.
3. The tics go: "a stranger …" keeps the visitor's eye and drops the word; "… rather than …" balances become plain statements; "arithmetic", "the record", "two different things", "a separate question", "nothing has broken yet", "which is the kind of …" are struck wherever they print.
4. Vantages: every intro-position pool gets four (the traveller, the official, the local, the newcomer, the trade, the watch; §8); description-position lines stay single and plain; the vantage tags in §2b are PLAUSIBLE and the lane re-reads each against its block's READS.
5. Order within a lane: the 401 LIT rewrites first (they print now), the dark ones second; a lane that reaches its budget pushes with the remainder listed by block in its record, and a second seat takes the list.

## 3. The lanes (the §2 plan of WIRING-RULINGS re-cut by the audit's volume)

| lane | section (audit table) | rewrites (lit) | new facts (inventory) | writer changes it owns |
|---|---|---|---|---|
| W1 ECO | economy (§2b-1) | 148 (47) | 14 | — (W0 owns the import share and the food-source count; merge W0 first) |
| W2 DEF | defence, war, viability (§2b-3) | 375 (94) | 10 (+ the black market and free-company clauses; the isolation-support block) | DS-DEF-3/DS-DEF-8 stress-type keys; #36's per-verdict variants |
| W3 POW | power (§2b-2) | 229 (65) | 10 (+ the NPC `behaviour` line) | DS-POW-1 tier gate (#23) |
| W4 PEOPLE | people, crisis, Tonight, faith (§2b-4) | 276 (55) | 5 (faith) | DS-CND-1 stress-type key; #37's caption; the crisis-text vantage per surface (#29) |
| W5 HIS | history, Overview, relations (§2b-5) | 450 (78) | 4 (+ the migration direction's reader sites) | #10's port-reason gate; #9's history read; the direction lines' two sets |
| W7 HOOKS | hooks, causal joins, PDF chrome (§2b-6) | 284 (46) | — | the seven headlines (#1–#7); `crisisBlindFindings :: CLAIMS` regexes move with their rows |

Coupling the lanes carry: `src/domain/coherence/crisisBlindFindings.js :: CLAIMS` quotes three economy rows by regex (food SECURE v3, income one-source v3, export established v1) — the lane that rewrites a quoted row changes its regex in the same cause.

## 4. What the owner may veto here

Every rewritten line (listed in the lanes' records); the four vantages' vocabulary; #10's and #23's gates; #37's caption removal; the surface-by-vantage rule for the crisis summary.
