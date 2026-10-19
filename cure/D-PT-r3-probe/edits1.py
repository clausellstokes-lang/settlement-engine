import sys
p='/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_PT.md'
s=open(p,encoding='utf-8').read()
def rep(old,new,count=1):
    global s
    n=s.count(old)
    if n!=count: sys.exit(f"MISMATCH {n} for: {old[:90]!r}")
    s=s.replace(old,new)
B='[CURED 2026-10-18 (fp-final r3) — '
R='[REFINED 2026-10-18 (fp-final r3) — '

# 1 header
rep("with the same bracket form; the log is `cure/D-PT-r2b.md` (probes `cure/D-PT-r2b-probe/`).",
    "with the same bracket form; the log is `cure/D-PT-r2b.md` (probes `cure/D-PT-r2b-probe/`). Round 3a (2026-10-18, lane D-PT-r3, Opus 5.5) disposed in place `skeptic/PT-r2-verify.md` (its one new MAJOR PT-V1 and its six carries), the rows the other `*-r2-verify.md` files route to PT, and every A-row and the PT B-section of `briefs/RULINGS-ROUND3.md`: each change carries `[CURED 2026-10-18 (fp-final r3) — <id>: …]`, each refinement `[REFINED 2026-10-18 (fp-final r3) — …]`; the log is `cure/D-PT-r3.md` (probes `cure/D-PT-r3-probe/`).")
# 2 status
rep("> **Status: COMPILED DRAFT, ROUND 2b DISPOSED (2026-10-18).** ",
    "> **Status: COMPILED DRAFT, ROUND 3a DISPOSED (2026-10-18).** Round 3a (lane D-PT-r3) cured PT-V1 (a court's seat change lapses ONLY a still-windowed party ban; the DM's indefinite word stands, lifted only by `PARDON_PARTY` — EXECUTED on master's own writers, `cure/D-PT-r3-probe/windowedLapse.out`), the verifier's six carries, and RULINGS-ROUND3's PT rows (A.4 `enemy_in_service` reads the landed pair label; A.7 five actor kinds; A.8 the one ban grammar named apart from `banKeys`; A.11 a court, a person or a corps may voice the party; A.14 the stretch key `stretch:<a|b>`) — §21's round-r3 block; no STOP. ")
# 3 §0 actor kinds row
rep("`site` is a WHERE kind and a subject (the `subject` dial), NEVER an actor kind: a site has no mind (ST4)] | always | 136 |",
    "`site` is a WHERE kind and a subject (the `subject` dial), NEVER an actor kind: a site has no mind (ST4)] "+B+"A.7: the actor convention is FIVE kinds, `settlement · person · party · menace · corps` — a corps decides (its own weekly choice, CH §16b) and a menace stays an actor because the DM's authored course stands in for its mind (MN12, MN6); a site has no course and no choice; the fold's §1 bracket, the spine mirror and §3.3's row are P4's] | always | 136 |")
# 4 §0 population facts
rep("champions are dark, public voices are dark, and party bans are dark.",
    "champions are dark, the public voices of PERSONS and companies are dark (a COURT's voice is not: RULINGS-ROUND3 A.11, §7.3), and party bans are dark. "+B+"A.11]")
# 5 PT5
rep("including a renowned voice that would praise or denounce it in public (`party_voiced`, the chair's ruling of SEAMS-r1-6)",
    "including a court, or a renowned person or company, that would praise or denounce it in public (`party_voiced`, the chair's ruling of SEAMS-r1-6; its voices RULINGS-ROUND3 A.11)")
# 6 banKeys row (shape 1)
rep("| `banKeys` | `[≤ 8 { settlementId, episode }]` | the hearing resolver, at a `party_banned` verdict `banned` (a key drops when its edge lapses, is pardoned or is lifted) |",
    "| `banKeys` | `[{ settlementId, episode }]` — ONE key per door, in mint order; ≤ 8 keys whose door's edge is WINDOWED | the hearing resolver, at a `party_banned` verdict `banned` (a re-ban at the same door replaces its key with the newer episode; a key drops when its edge lapses, is pardoned or is lifted; at a ninth windowed key the OLDEST windowed key evicts — its edge stays and lapses at its own `untilTick`, losing only the early lift at a seat change; a key whose door now stands INDEFINITE — the DM's `BAN_PARTY`, alone or after the strictest-wins merge folded the emergent window into it — is inert, outside the cap, and drops with its edge) "+B+"PT-V1 · the verifier's carry \"`banKeys` has no rule past its cap of 8\" (RULINGS-ROUND3 B: \"the cap counts WINDOWED keys only (the oldest windowed key evicts first); indefinite keys are the DM's and unbounded by the engine\"); EXECUTED, `cure/D-PT-r3-probe/windowedLapse.out` F] "+R+"one key per door, the newer episode replacing: the landed merge keeps one edge per (door, kind), so two keys for one edge would be two lift rules for one fact; vetoable] |")
# 7 §2.2 where
rep("a road is PR's ONE STRETCH KEY road{a, b} (ids codepoint-sorted, keyed a␟b), `half` the land holder of the half the card stands on (the road arm); 'site' with THE SITES, a WHERE only",
    "a road is PR's ONE STRETCH KEY road{a, b} (ids codepoint-sorted, keyed `stretch:<a|b>` — the digest's own pair form, `spatial/distanceRead.js :: pairKey`: \"`` a < b ? `${a}|${b}` : `${b}|${a}` ``\"; RULINGS-ROUND3 A.14), `half` the land holder of the half the card stands on (the road arm); 'site' with THE SITES, a WHERE only")
rep("[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6: a corps as actor and as officer · SEAMS-r2-14 · RULINGS-ROUND2b STOP-PR-2: the road half on `where` · RULINGS-ROUND2b ADDENDUM ST-r2-14: `site` a WHERE only.]",
    "[CURED 2026-10-18 (fp-final r2) — SEAMS-r2-6: a corps as actor and as officer · SEAMS-r2-14 · RULINGS-ROUND2b STOP-PR-2: the road half on `where` · RULINGS-ROUND2b ADDENDUM ST-r2-14: `site` a WHERE only.] "+B+"A.14: the minted `a␟b` → the landed pair form `stretch:<a|b>`, as PR §2.2 keys it]")
open(p,'w',encoding='utf-8').write(s)
print("ok")
