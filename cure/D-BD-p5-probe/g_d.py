EDITS = [
# D1 — §10.1 (ii)
(r'''- **(ii) SLOW — habitat spill:** a neighbour N's PROLONGED embattlement (phase `embattled` for DRAFT 13 weeks — the owner's "extended periods of time") raises T's habitat by a bounded fraction (DRAFT `0.15 × N.level`) through the LANDED flows that already carry it — trade losses on the shared roads (EC/TR's losses read the level), refugees (POP's migration from N into T: the let-in raise T's crime pressure, the cast-out detach gangs), the watch stretched (PR's riders called to the border) — DRAWN, not certain: a keyed chance by the shared border's length (the digest's gates between N and T) and the trails between them, stream `bodies:spill:<N>:<T>:<tick>`, the receipt naming the source region ("trouble from the Tolle hills has crept into Ashford's country").''',
r'''- **(ii) SLOW — habitat spill** [CURED 2026-10-20 (fp-final P5) — P5C-13 · WC-BD-69 (RULINGS-P5 C.13): the drawn `0.15 × N.level` was a DEAD END — `bodyHabitat` held no spill part and nothing persisted the draw, so it moved nothing; the landed flows' share is now named as theirs, and the DRAW is ONE habitat part with its decay]: the LANDED flows already carry a neighbour's trouble into T by their own arithmetic, and BD writes none of them — trade losses on the shared roads (EC/TR's losses read the level), refugees (POP's migration from N into T: the let-in raise T's crime pressure, the cast-out detach gangs, §3.2 (e)), the watch stretched (PR's riders called to the border); on top of them the owner's "they have a chance to amplify them in neighbors" is ONE DRAWN TERM: where a neighbour N has stood `embattled` for DRAFT 13 weeks (the owner's "extended periods of time"), each week ONE keyed chance per (N, T) on the stream `bodies:spill:<N>:<T>:<tick>` (HBF `bodySpillDraw`), its odds by the shared border's length (the digest's gates between N and T) and the trails between them, FIRES at most once per dwell — its tick written to the ledger's `spills` map under `'<N>|<T>'` (§2.2; one writer) — and from that week T's `bodyHabitat` carries a `spill` PART (§2.5) for GANGS and BEASTS: `0.15 × N.level × (1 − age ÷ 13 weeks) × the frontier factor below` (DRAFT; N's level read LIVE each week, so the part falls with N's own easing; `age` the weeks since the fire), ZERO once N leaves `embattled`, the key dropped one dwell after its tick — so a spill raises births and recruitment in T for a season and decays legibly, the receipt naming the source region ("trouble from the Tolle hills has crept into Ashford's country").'''),
# D2 — §2.2 shape
(r'''  births: { [sourceKey]: tick },                 // the birth DWELL clocks, sourceKey = '<word>:<placeKey>' (§3.3)
''',
r'''  births: { [sourceKey]: tick },                 // the birth DWELL clocks, sourceKey = '<word>:<placeKey>' (§3.3)
  spills: { ['<N>|<T>']: tick },                 // P5 (P5C-13): the slow spill's FIRED draws — the tick the (N, T) chance fired; read as `bodyHabitat`'s `spill` part (§10.1 (ii)); dropped one dwell (DRAFT 13 weeks) after its tick or with either town; drop-when-empty — a DECLARED addition to THE OWNER'S shape (⭐ OD-BD-1 widened, P5)
'''),
(r'''`births` keys drop after one dwell past their tick;''',
r'''`births` keys drop after one dwell past their tick; `spills` keys one dwell after theirs (P5C-13);'''),
# D3 — §2.5 bodyHabitat
(r'''the town's tier (the wild is wide beside thorps), the season | births (§3), recruitment (§6.2), the scrutiny line |''',
r'''the town's tier (the wild is wide beside thorps), the season; FOR A GANG AND A BEAST the SLOW SPILL's `spill` part while a fired `spills` key from a neighbour still `embattled` stands (§10.1 (ii)) [CURED 2026-10-20 (fp-final P5) — P5C-13] | births (§3), recruitment (§6.2), the scrutiny line |'''),
# D3b — §2.7 step 3
(r'''3. **Births and names** — for each country with habitat over security''',
r'''3. **Births and names** — the slow spill's (N, T) chances are drawn first and a fired one writes its `spills` key (§10.1 (ii); `bodySpillEnabled`) [CURED 2026-10-20 (fp-final P5) — P5C-13]; then for each country with habitat over security'''),
# D4 — §15.3
(r'''| one row per (court, subject); the long rumor TTL |

---

## §16 THE SCENARIO MATRIX''',
r'''| one row per (court, subject); the long rumor TTL |

### 15.3 The P5 addition (DECLARED — ⭐ OD-BD-1 widened; requirement 22a) [CURED 2026-10-20 (fp-final P5) — P5C-13]

| Path | `spatialLedgers.bodies.spills` — the slow spill's fired draws (`'<N>\|<T>'` → tick) |
|---|---|
| create | the stage's births step (§2.7 step 3) the week an (N, T) chance fires; one writer `bodyLedger.js`; at most one key per (N, T) per dwell |
| read | `bodyHabitat`'s `spill` part (gangs, beasts), with N's LIVE level and phase (§10.1 (ii)) |
| persist | the conditional `spatialLedgers` idiom; drop-when-empty |
| regenerate | lived history: kept (outside `rederive`) |
| undo | the proposal ring's snapshot restore |
| import | carried; a key naming a missing town dropped at normalization |
| migrate | none (a new key) |
| dark-after-lit | stays, unread (`bodySpillEnabled` dark ⇒ no part); an expired key drops at the next lit normalization |
| death | either town's death drops the key |
| veil | none (habitat is the world's truth; the birth card's scrutiny names the source region) |
| horizon (req. 23) | one key per (N, T); dropped one dwell (DRAFT 13 weeks) after its tick |

---

## §16 THE SCENARIO MATRIX'''),
# D5 — §22 A12 and B9
(r'''the slow habitat spill (no stressor); refugees through POP's flows''',
r'''the slow habitat spill — ONE `spill` part of `bodyHabitat` (P5C-13; no stressor); refugees through POP's flows'''),
(r'''| B9 | all | the neighbour's prolonged embattlement | the gauge's phase in the neighbour (§10.1 (ii)) |''',
r'''| B9 | gang · beast | the neighbour's prolonged embattlement | the gauge's phase and live level in the neighbour, ONLY through a fired `spill` part (§10.1 (ii)) [CURED 2026-10-20 (fp-final P5) — P5C-13: a conclave's slow carrier is WF's spread] |'''),
# D6 — OD-BD-24, OD-BD-1
(r'''| OD-BD-24 | spill: the 13-week dwell, the 0.15 fraction, the frontier halving (§10.1); the patch `m` 0.02 and its dwell (§10.2) | DRAFT, UNMEASURED. |''',
r'''| OD-BD-24 | spill: the 13-week dwell, the 0.15 fraction, the frontier halving (§10.1); the patch `m` 0.02 and its dwell (§10.2) | DRAFT, UNMEASURED. [CURED 2026-10-20 (fp-final P5) — P5C-13: the 0.15 fraction is the `spill` habitat part's PEAK, decaying linearly over its 13-week dwell with N's live level; its `spills` key the declared addition (OD-BD-1 widened, §15.3)] |'''),
(r'''the `hiddenWays` row gains `since · fresh · upTo` (OD-BD-4's shape, §2.3).] |''',
r'''the `hiddenWays` row gains `since · fresh · upTo` (OD-BD-4's shape, §2.3).] [CURED 2026-10-20 (fp-final P5) — WIDENED: the `spills` dwell map (§2.2, §15.3; P5C-13) — drop-when-empty, one key per (N, T), one writer] |'''),
]
