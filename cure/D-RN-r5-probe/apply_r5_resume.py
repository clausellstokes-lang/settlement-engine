# D-RN-r5 RESUMED seat (2026-10-19 07:3x EDT): exact-once insertions into RN, guarded by the 04:30 sha.
import hashlib, sys
V = '/Users/cstokes/Desktop/settlement-engine/docs/DESIGN_FP_ARCH_RN.md'
EXPECT = '88f23aa571f7dfd7a2b0d618aef5c29741458ed0'
s = open(V, encoding='utf-8').read()
h = hashlib.sha1(s.encode('utf-8')).hexdigest()
if h != EXPECT:
    sys.exit(f'sha mismatch {h} != {EXPECT}: the volume changed under the seat; stop')
CH5 = "`cure/D-CH-r5.md` §5 RN, a sibling round-5 route read live by the resumed seat: \"CH's registered kinds gain `warden_attempted` (doer a NAMED body by its RN key `g:<bodyId>`, target the warden `p:<wnpcId>`; two rows, bribe and strike)\""
edits = [
 # E1 the paragon_act slot row: the warden-attempt card is a second CH door
 ("register `hunt_won`'s doer as any leader the `hunt_taken` card names\"]",
  "register `hunt_won`'s doer as any leader the `hunt_taken` card names\"]; and CH's WARDEN-ATTEMPT card at its close (CH §11, the road arm's second card) — the act kind `warden_attempted` (CH §2.2b, two rows: a bribe, a strike), ONE deed per card whatever its verdict, its DOER the NAMED body that made the attempt (`{kind:'body', id}`, keyed `g:<bodyId>`; a nameless body mints nothing, no key, §2.2), its TARGET the warden (`p:<wnpcId>`); the card's owner mints, never a `body_act` beside it [CURED 2026-10-19 (fp-final r5) — " + CH5 + "]"),
 # E1b the gate cell
 ("so a clash the riders win is `patrol_clash`'s, its doer the TOWN (below) |",
  "so a clash the riders win is `patrol_clash`'s, its doer the TOWN (below); `warden_attempted` also CH §11's TIER (`paragonGateEnabled` ∧ THE BODIES' `bodiesEnabled`) [CURED 2026-10-19 (fp-final r5) — the same route] |"),
 # E2 the doer row: a body doer by CH's door
 ("a site it took or cleared, ST's `site_verdict` — §3.1)",
  "a site it took or cleared, ST's `site_verdict`; an attempt on a WARDEN, CH's `warden_attempted`, a `paragon_act` kind CH registers [CURED 2026-10-19 (fp-final r5) — `cure/D-CH-r5.md` §5 RN] — §3.1)"),
 # E3 body_act's ONE ACT, ONE DEED list
 ("a hunt's success (and a claimed bounty) CH's `hunt_won` (B.5), never a `body_act` beside them",
  "a hunt's success (and a claimed bounty) CH's `hunt_won` (B.5), an attempt on a warden CH's `warden_attempted` (CH §11's card) [CURED 2026-10-19 (fp-final r5) — `cure/D-CH-r5.md` §5 RN], never a `body_act` beside them"),
 # E4 §6.1 the inherent-value block
 ("registered by CH whoever the leader is (the office-holder included, §3.1)",
  "registered by CH whoever the leader is (the office-holder included, §3.1); CH's two **`warden_attempted`** rows (a bribe `0.30 · 0.20 · 0.40`, shameful; a strike `0.10 · 0.15 · 0.85`, villainous — CH §2.2b) are rows of the same block whose DOER is a body, read on the body's key exactly as any body doer's deed (§2.1), the walker counting them CH's [CURED 2026-10-19 (fp-final r5) — `cure/D-CH-r5.md` §5 RN]"),
 # E5 §18 (7): the routes' state and the leak key's spelling
 ("and cites OD-RN-48 RULED at §3.1.25.",
  "and cites OD-RN-48 RULED at §3.1.25. [REFINED 2026-10-19 (fp-final r5) — the resumed seat's cross-volume re-grep, 07:3x EDT: (i) CH and PR LANDED their halves of (7) in their own round-5 lanes — CH §2.2b/§11 `hunt_won`'s doer any leader the card names (the office-holder included), CH §8 the guarded `hopWeeks` arrival (SEAMS-r4-13), PR §9.3 an unled clash the town's tale and none inside a led hunt — so they are no longer owed; (ii) ROUTED — the body leak key has THREE spellings across the volumes: RN's registry row `leak:body:<bodyId>:<courtId>:<sinceTick>` (§2.4, §3.4), BD §7.1 and CH §9 `<employerId>`, BD §10.4 `<sponsorId>`; BD and CH spell it as RN's `TELLING_SOURCES` row does, `courtId` the employing or the sponsoring court (`employerId` and `sponsorId` are its two values, one row per tie, never two rows); (iii) CH r5's `warden_attempted` is applied here (§2.1, §3.1, §6.1)]"),
 # E6 §18 REFINED list
 ("κ only on a true label (§6.2, OD-RN-48).",
  "κ only on a true label (§6.2, OD-RN-48) · the body leak key's one spelling routed and the landed halves marked (§18 (7), the resumed seat)."),
]
for old, new in edits:
    n = s.count(old)
    if n != 1:
        sys.exit(f'anchor count {n} != 1: {old[:70]}')
    s = s.replace(old, new)
# E7 §19 r5 block: two rows before the COUNTS line, and the COUNTS line
anchor = "\nCOUNTS (round r5): 39 disposed of 39 — CURED 29, REFUTED 0, ⛔ STOP 0, NOTED 10. REFINED this round: two (no hearer, no card — §5.5, OD-RN-50; `pairNet`'s two leaf choices under §E, the vassal contract read true and κ on a true label only — §6.2, OD-RN-48)."
if s.count(anchor) != 1:
    sys.exit('COUNTS anchor not found once')
rows = ("\n| `cure/D-CH-r5.md` §5 RN: `warden_attempted` joins `paragon_act` (a sibling round-5 route, read live by the resumed seat, 07:3x) | sibling | CURED — the slot row's second CH door with its tier, the body doer by CH's door, the ONE ACT, ONE DEED list, §6.1's two CH rows | §2.1 `doer`, §3.1, §6.1 |"
        "\n| `cure/D-CH-r5.md` §5 RN: `hunt_won`'s doer any leader the card names (`p:` · `u:`) | sibling | NOTED — holds (§3.1 as cured at 04:2x) | §3.1 |\n")
newcounts = ("\nCOUNTS (round r5): 41 disposed of 41 — CURED 30, REFUTED 0, ⛔ STOP 0, NOTED 11. REFINED this round: three (no hearer, no card — §5.5, OD-RN-50; `pairNet`'s two leaf choices under §E, the vassal contract read true and κ on a true label only — §6.2, OD-RN-48; the body leak key's one spelling routed — §18 (7)). "
             "RESUMED 2026-10-19 07:3x EDT (the same lane re-seated): the volume was found unchanged since 04:29 (sha1 `88f23aa5…`), `r5Probe.mjs` was re-run against master `81f1cd963` with a byte-identical output, the two `cure/D-CH-r5.md` rows above were added, and the sibling volumes were re-grepped (§18 (7)).")
# the original COUNTS line continues after the REFINED sentence; keep the rest of the line
i = s.index(anchor)
s = s[:i] + rows + newcounts + s[i+len(anchor):]
open(V, 'w', encoding='utf-8').write(s)
print('applied', hashlib.sha1(s.encode('utf-8')).hexdigest())
