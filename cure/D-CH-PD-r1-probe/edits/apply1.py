# D-CH-PD-r1 — edit script part 1 (in-place amendment of CH's L-CH-PD passages). Run with python3 -I.
import sys
P = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_CH.md'
E = '/Users/cstokes/Desktop/settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-CH-PD-r1-probe/edits/'
s = open(P, encoding='utf-8').read()
def rep(old, new, n=1):
    global s
    c = s.count(old)
    if c != n: sys.exit(f'COUNT {c} != {n} for: {old[:90]!r}')
    s = s.replace(old, new)
def line_starting(prefix):
    L = s.split('\n'); hits = [i for i, x in enumerate(L) if x.startswith(prefix)]
    if len(hits) != 1: sys.exit(f'LINE {len(hits)} for {prefix!r}')
    return L[hits[0]]
def replace_line(prefix, new):
    rep(line_starting(prefix), new)

# (1) STATUS
rep("§25's P6 block holds the record (`cure/L-CH-PD.md`). No STOP stands.",
    "§25's P6 block holds the record (`cure/L-CH-PD.md`). No STOP stands. **P6 r1 DISPOSED (2026-10-20, lane D-CH-PD-r1):** THE PATRON DEITY's first skeptic (`skeptic/CH-PD-r1.md`: 0 BLOCKING · 12 MAJOR · 9 MINOR) and `briefs/RULINGS-P6.md` §F.1–F.6 are disposed in §25's P6 r1 block (`cure/D-CH-PD-r1.md`; probes `cure/D-CH-PD-r1-probe/`): the oath is `swornDeity` (F.3 — `patronDeity` is landed as the SETTLEMENT's seated patron), the lean is re-derived in two monotone halves and RE-RUN against the skeptic's probe (F.1, EXECUTED), the landed temper census walker is named and grown by a declared change (F.2), a saint's oath is required and its `creedRef` derived from it. No STOP stands.")

# (2) the answer in one breath
rep("a merciful god's healer stays where the sick are, a lawful god's captain keeps her bargains longer, a warlike god's champion goes to a fight more readily. A town that seats the same god lets its sworn one in more easily; a town that has put that faith down watches it.",
    "a good god's healer stays where the sick are, a lawful god's captain keeps her bargains longer, a warlike god's champion goes to a fight more readily and a peaceable god's less readily. A town that seats the same god lets its sworn one in more easily; a town where that faith has been put out of the temples watches it. [CURED 2026-10-20 (fp-final P6 r1) — CH-PD-r1-17: no recorded axis is \"merciful\" (a good god) · CH-PD-r1-1: the warlike sentence is now true, by the boldness half (§10b, EXECUTED) · CH-PD-r1-16: a creed is put out of a town's temples by a rival creed's eviction or a siege, never by the court (`religionState.js :: suppressDeity`)]")

# (3) §0 rows
rep("| a SWORN god's recorded character as three coordinates (§10b); a zero-import leaf |",
    "| a SWORN god's recorded character — two coordinates and a temper word (§10b); a zero-import leaf; ⚠ the DERIVED temper is the alignment restated (`TEMPER_DERIVATION = Object.freeze({ W_EVIL: 0.7, W_CHAOS: 0.3, THRESHOLD: 0.15 })` in `deriveTemper`: every evil god `warlike`, every good god `peacelike`, every neutral-alignment god `neutral`) [CURED 2026-10-20 (fp-final P6 r1) — CH-PD-r1-1: the measurement the round-0 lean missed] |")
rep("| the ONE builder of P1's `patronDeity` (the landed embed shape;",
    "| the ONE builder of P1's `swornDeity` — at the DM's door and in `normalizeParagon`'s re-pick, a fixed point (EXECUTED, `cure/D-CH-PD-r1-probe/repick.out.txt`) [CURED 2026-10-20 (fp-final P6 r1) — CH-PD-r1-4 · CH-PD-r1-5] (the landed embed shape;")
row89_old = "| the LANDED idiom `patronLean` takes — one bounded multiplier centred on 1, identity for a neutral god; a different quantity (corruption's knobs), never reused | the corruption lane | — | derived | CONFIRMED |"
row89_new = ("| the LANDED idiom `swornLean`'s halves take — bounded multipliers centred on 1, identity for a neutral god; a different quantity (corruption's knobs), never reused [CURED 2026-10-20 (fp-final P6 r1) — F.3] | the corruption lane | — | derived | CONFIRMED |\n"
 "| `tests/domain/deityTemperConsumerCensus.walker.test.js` (the LANDED temper census) [ADDED 2026-10-20 (fp-final P6 r1) — CH-PD-r1-5 · RULINGS-P6 F.2] | \"the consumer census is EXACTLY the thirteen named modules\" (`expect(found).toHaveLength(13)` over `/\\bdeityTemper\\s*\\(/`); \"twelve of the thirteen consumers read an embed\" (`toHaveLength(12)`); \"the stored-field reader register is EMPTY\" (`/[.[]['\"]?temperamentAxis/` outside `EMBED_WRITERS`); \"exactly one module BUILDS a deity embed\" (`/_deityRef:/` with `/temperamentAxis:\\s/`) | the pins CH-11 meets: ONE new `deityTemper` caller (`paragonSworn.js`, provenance `embed`) by a DECLARED change 13 → 14 and 12 → 13 (OD-CH-56), no hand-built embed, no read of the retired field | every test run | — | — | CONFIRMED |\n"
 "| `src/lib/customRegistry.js :: mintDeityRef(raw)` [ADDED 2026-10-20 (fp-final P6 r1) — CH-PD-r1-6] | \"`return scope ? \\`deity:${scope}:${slug}\\` : \\`deity:${slug}\\`;`\"; the seat's own door keys by it (`DeityAssignmentPanel.jsx`: `mintDeityRef(d.raw) || d.refId`) | the ref a DM-authored god's oath takes — the very key a town seated by the panel holds (§10b, S69) | the authoring surfaces | — | derived | CONFIRMED |")
rep(row89_old, row89_new)
open(P, 'w', encoding='utf-8').write(s)
print('part1 ok')
