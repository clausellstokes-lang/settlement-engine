import sys
p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PT.md'
s=open(p,encoding='utf-8').read()
def rep(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit(f"MISMATCH {n} for: {old[:100]!r}")
    s=s.replace(old,new)
B='[CURED 2026-10-18 (fp-final r3) — '
R='[REFINED 2026-10-18 (fp-final r3) — '

# §9.3 lifted
rep("each week an edge whose court reads `seatChangedSince(…, episode).changed === true` lapses through the same lift and its key drops (a key also drops when its edge lapses, is pardoned or is lifted).",
    "each week, at a door whose court reads `seatChangedSince(…, episode).changed === true`, the edge lapses through the same lift and its key drops ONLY IF THAT EDGE IS STILL WINDOWED (CH §11's \"the windowed edges IT minted\"); an INDEFINITE edge is the DM's word — `BAN_PARTY`, or the landed strictest-wins merge having folded the emergent window into the DM's later indefinite ban at the same door (`npcLedgerFacets.js :: normalizeExclusionEdges`: \"MERGE RULE when the same door is shut twice: the STRICTER edge wins — indefinite …\") — and is lifted ONLY by `PARDON_PARTY`: there the seat change lifts nothing and the key stays inert, outside the cap (a key also drops when its edge lapses, is pardoned or is lifted). "+B+"PT-V1 (MAJOR; RULINGS-ROUND3 B): round 2b's text had dropped \"windowed\", and `liftExclusionEdges` lifts whatever edge stands at the door — the verifier's probe made an emergent ban plus a DM `BAN_PARTY` at Kell one `indefinite` edge and the seat change's lift erased it (`stillBannedAtKell: false`); RE-RUN at master `81f1cd963` (`cure/D-PT-r3-probe/windowedLapse.out` E: false) and under the cured rule (A: `stillBannedAtKell: true`, nothing lifted; B, the DM's ban first: true; C, an emergent ban alone: lifted, the owner's \"a new ruler at a succession\"; D, Kell's lift leaves the DM's Tolle ban standing). CH §11 states the same rule for a paragon (the guard on its second sentence is CH's, routed)]")
# §11.1 doer row: RN-V2 triple
rep("a declared signature change under which every non-deed telling is byte-identical |",
    "a declared signature change under which every non-deed telling is byte-identical. A swapped doer reaches the hearer's regard through RN's heard pass, whose re-read key is the TRIPLE (`ver`, `mag`, `doerRef`): a changed doer moves the deed's ONE term to the new subject (RULINGS-ROUND3 B for RN, RN-V2 — \"the same gap applies to a corrected `doerRef` (PT-4's swap)\") "+B+"RN-V2 (routed by the RN verifier): PT cites RN's key; RN writes it] |")
# §13 anchor paragraph a␟b
rep("`road{a, b}` is PR's ONE STRETCH KEY (unordered, keyed `a␟b`; a HALF is the part on one holder's land, cut at the digest gate — PR §2.2;",
    "`road{a, b}` is PR's ONE STRETCH KEY (unordered, keyed `stretch:<a|b>`, the digest's own pair form "+B+"A.14: was `a␟b`]; a HALF is the part on one holder's land, cut at the digest gate — PR §2.2;")
# §13 voiced row WHERE
rep("| `party_voiced` | the week RN's crossing occurs | `spoken · withheld` | `spoken` — it decides nothing FOR the party; the DM may withhold it (no trace) or amend it (the chair's ruling, SEAMS-r1-6) | CLIMAX | `settlement` — where the voice stands |",
    "| `party_voiced` | the week RN's crossing occurs (a court's, a person's or a company's — A.11) | `spoken · withheld` | `spoken` — it decides nothing FOR the party; the DM may withhold it (no trace) or amend it (the chair's ruling, SEAMS-r1-6) | CLIMAX | `settlement` — where the voice stands (a court: its own town) |")
# §14 flags
rep("RN's `renownLeansEnabled` (+ persons) for `party_voiced`;",
    "RN's `renownLeansEnabled` for `party_voiced` (+ persons for a person's voice; + CH's `paragonCorpsEnabled` with WC-10 for a company's; a court's voice needs neither — A.11 "+B+"A.11]);")
# §15 PT-5 row
rep("| PT-5 | the call board's party reads, the champions' visits and the meeting, the public voice | reads CH's `callBoard`, `visit_party`; mints `met_in_person`; `party_voiced` from RN's crossings | a paragon's visit card; a voice's card | `npcConsequencesEnabled` + CH's flags; `party_voiced` also `renownLeansEnabled` | requests from courts only; no voices |",
    "| PT-5 | the call board's party reads, the champions' visits and the meeting, the public voice | reads CH's `callBoard`, `visit_party`; mints `met_in_person`; `party_voiced` from RN's crossings | a paragon's visit card; a voice's card | `npcConsequencesEnabled` + CH's flags; `party_voiced` also `renownLeansEnabled` (a court's voice: `renownLeansEnabled` alone, A.11) | requests from courts only; court voices only "+B+"A.11] |")
# §15 EDITOR counterparty
rep("counterparty — `real-only` (every actor is a real court, person or menace; every anchor a real settlement)",
    "counterparty — `real-only` (every actor is a real court, person or corps; every anchor a real settlement) "+B+"the verifier's carry \"§15's EDITOR line … should say 'court, person or corps'\": no PT kind has a menace actor; the party's hand on a menace is a deed (§3.1)]")
# §16 horizon
rep("≤ 8 `banKeys`, each dropped with its edge |",
    "≤ 8 WINDOWED `banKeys` (one per door; the oldest windowed evicts; an indefinite door's key inert, outside the cap), each dropped with its edge "+B+"PT-V1 · the cap carry] |")
open(p,'w',encoding='utf-8').write(s)
print("ok")
