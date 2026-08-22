# laneTCWF1C — COMPILE RECEIPT (WF-1c, the realm last-seat beat)

- **Lane:** TC-WF1C, OPUS COMPILE seat, ODQ §291.5 (the lane compiles and prices; the chair lands).
- **Dispatch authority:** ODQ **§314.3** — *"TC-WF1C dispatched (Opus compile): WF-1c, the realm
  last-seat beat, against the LIVE preamble hash, on WF-1B's landed machinery, with the §309
  boundary kept sharp."* §314 is also the **census authorization** this packet names under §299.4.
- **Verified base:** `claude/composite-r4` @ `f20b9faa` (the MF-PREAMBLE landing).
- **Git writes:** NONE. Working tree untouched. Every read via `git show f20b9faa:<path>`.
- **Deliverables:** `draft-WF-1C.md` (the DRAFT packet) + this receipt, both in the session
  scratchpad. Helper files under `laneTCWF1C/`.

---

## §1 · OUTCOME FIRST

**WF-1c FITS ONE MEMBER, COMFORTABLY, AND IT DOES NOT NEED THE FAITH KIND REGISTRY.** The
STOP-and-RAISE condition §314.3 named is **MEASURED NOT TO FIRE** — and the reason is a single
executed fact the WF-1B compile already half-found: `heraldRouting.js` carries a
`['pantheon_', 'faith']` PREFIX rule, so a beat kind spelled `pantheon_*` routes to the faith desk
with **no `EXACT_SECTION` row, no registry row, and no registry at all**.

⛔⛔ **AND THE INVERSE IS THE SHARPEST FINDING OF THIS COMPILE: TAKING THE `EXACT_SECTION` ROW —
the obvious, sibling-matching, apparently-tidy move — IS A HARD STOP BY ARITHMETIC.** It is what
`pantheon_ascendancy` and `pantheon_twilight` both did, and the door has closed behind them. See
§4.2. This inverts the usual reading of preamble §P4's *"the cheap door and the trap"*: for WF-1c
the prefix is not merely cheap, **it is the only lawful door short of minting the FAITH registry**.

Consequences for the chair:

- **NO RAISE IS OWED ON THE §309 ECONOMICS.** The WF-8 once-built argument does not reach WF-1c,
  because WF-1c incurs none of the costs that argument prices. Stated as a measurement in §4.3.
- **ONE MEMBER, ZERO OVERRIDES.** Every `PACKET_STANDARD` cap has headroom (§5).
- **THREE judgment calls** are raised vetoably in the packet's §11; one of them (the fire
  predicate) is the one I most want the chair's eye on.

**Status labels used below:** CONFIRMED = I executed it and quote the output. PLAUSIBLE =
reasoning only. Nothing in the packet's manifest rests on a PLAUSIBLE row.

---

## §2 · PRELIMINARIES DISCHARGED

### 2.1 The preamble hash — CONFIRMED, and it is the LIVE one

```
$ git show f20b9faa:docs/implementation/preambles/WF-PREAMBLE.md | shasum -a 256
ca02c8a165ddbc18ab3f254bebce8cca5dd945e71e074b526227164e9b0cabfd  -
$ git show f20b9faa:docs/implementation/preambles/WF-PREAMBLE.md | wc -lc
     757   56878
```

Matches the hash §314.2 records as live. The packet cites **`ca02c8a1…`**, not the pre-cure
`cd067ba1…` the landed WF-1B still carries. ⚠ WF-1B's stale citation is a known prose defect whose
re-stamp rides the next landing CAS (ODQ §314.2) — **this lane does not touch it**; it is a chair
act on a landed, chair-signed file.

### 2.2 The base — CONFIRMED

```
$ git log --oneline -3 f20b9faa
f20b9faa docs(MF-PREAMBLE): the map family's preamble lands, chair-signed …
f9bd533f docs(WF-PREAMBLE): paraphrase the naked-claim warning's transcribed vocabulary …
4f25da23 fix(WF-1b): type the sole writer's state param — the any-cast ratchet caught a new hole
$ git branch -a --contains f20b9faa
  claude/composite-r4
```

WF-1B is LANDED and exposed beneath the tip, exactly as the brief states.

### 2.3 The base-state capsule — MEASURED NOT CITABLE, executed at this tip

```
$ git merge-base --is-ancestor b8946403 f20b9faa  → yes
$ git diff --name-only b8946403 f20b9faa | wc -l                 → 236
$ git diff --name-only b8946403 f20b9faa | grep -v '^docs/' | wc -l → 193
   e2e/flow-b-auth-credits-ai.spec.js · e2e/flow-d-export.spec.js · package.json
   · scripts/.size-baseline.json · scripts/audit/behavioral-observation.mjs · …
```

`BASE_STATE.json` is stamped at `b8946403`. It IS an ancestor, but the window is **not**
docs-only, so the J-T1 clause fails and the capsule may not be cited as executed. WF-1A's and
WF-1B's findings **reproduce independently** at this base rather than being inherited (§P8).
Every figure in the packet is this lane's own re-execution.

---

## §3 · THE CHARTER, EXTRACTED

`WF-1A` §0 defers to WF-1c: *"the realm last-seat beat (seats 1 → 0) in `realmEvents.js`,
distinct from the existing `pantheon_twilight` tier-change beat."* The volume's own WF-1 spec
gives it one clause; the substantive charter is in the parent faith volume,
`docs/DESIGN_FP_FAITH.md`, the CORRECTED extinction beat, half **(b)**:

> *"REALM twilight already exists (`pantheon_twilight`) — WF-1 adds the LAST-SEAT edge case
> (seats 1 → 0) as its own kind, distinct from tier demotion; the realm record IS the pantheon
> ledger (zero-seat remnants persist), deliberately not a new census. Extinction is an ENDING,
> not a deletion: the pantheon entry persists as the remnant it already is."*

⚠ **THE VOLUME'S ADDRESS FOR THE JOIN SITE IS REFUTED AND THE ANNEX ALREADY CAUGHT IT.**
`WF-SUBSTRATE.md` **WF-S009** grades *"the realm tier-change beats WF-1c joins sit at
`realmEvents.js:270-294`"* as **REFUTED (address)** — the beats are `pantheon_ascendancy` at
`:284` and `pantheon_twilight` at `:307`. Re-executed at `f20b9faa`: **both addresses hold
EXACT**, and the enclosing function is `synthesizePantheonArcs` at `:264`. Navigating by symbol,
per §P0.

---

## §4 · THE §314.3 STOP-AND-RAISE CONDITION, MEASURED — IT DOES NOT FIRE

### 4.1 The question, stated precisely

§314.3 instructs: *"if the realm beat also needs the missing FAITH kind registry, STOP-and-RAISE
with numbers — the WF-8 once-built economics may claim it too."* §309.1(b) measured, for WF-1B's
obituary beat, that *"the FAITH family has NO kind registry (two of the beat's five registration
homes are files that do not exist; a one-row registry mints the estate's second small family)."*

**So: does a new realm beat kind need a registry row?** Executed answer: **no — and the reason is
structural, not incidental.**

### 4.2 ⛔⛔ THE MEASUREMENT, AND ITS INVERSION OF THE FAMILIAR READING

`heraldRouting.js` carries a **PREFIX RULE**, executed at `f20b9faa`:

```
:357  ['faith_', 'faith'],
:358  ['pantheon_', 'faith'],
```

and `isExplicitlyRouted(kind)` (`:447-458`) returns **true** on a bare prefix match, with no
`EXACT_SECTION` row required. So a kind spelled `pantheon_*`:

| instrument | figure at `f20b9faa` | WF-1c's effect |
|---|---:|---|
| `REGISTRIES` length (`kindPoolFloors.walker.test.js:193`) | **10** | **unmoved** |
| the small-family exact list (`:205`, `.toEqual(['INFORMATION'])`) | 1 member | **unmoved** |
| `REGISTERED_KIND_COUNT` (`:184`, `.toHaveLength`) | **112** | **unmoved** |
| `ROUTED_TOKENS` (`:163`, `.toHaveLength`) | **378** | **unmoved** |
| `LEGACY_UNVOICED_TOKENS` (`:153`, `.toBe` AND `.toBeLessThanOrEqual`) | **274** | **unmoved** |
| the registered-minus-routed divergence (`:350`, `.toBe(8)`) | **8** | **unmoved** |

⛔⛔ **AND HERE IS THE SHARPEST THING THIS COMPILE FOUND. THE "TIDY" MOVE — GIVING THE NEW KIND AN
`EXACT_SECTION` ROW BESIDE ITS TWO SIBLINGS, WHICH IS EXACTLY WHAT `pantheon_ascendancy` AND
`pantheon_twilight` BOTH HAVE AT `heraldRouting.js:139` — IS A HARD STOP BY ARITHMETIC.**

`unvoiced` is defined at `:187` as `Object.keys(EXACT_SECTION).filter(t => !REGISTERED_KINDS.has(t))`.
Both sibling kinds are routed-but-unregistered, i.e. **they are two of the 274**. A third such row
would take `ROUTED_TOKENS` to 379 and `unvoiced` to 275 — and `unvoiced` is asserted
**SHRINK-ONLY** (`toBeLessThanOrEqual(274)`) as well as exactly (`toBe(274)`). **A shrink-only
ceiling has no lawful growth cure.** The only way to add an `EXACT_SECTION` row is to add a
registry row with it — which is precisely the FAITH-registry mint §314.3 asked me to watch for.

⇒ **Preamble §P4's *"both the cheap door and the trap"* reads BACKWARDS for this member.** For a
kind that will never be registry-registered, the prefix is not the trap — **taking the exact row
is.** The packet makes this structural rather than advisory: acceptance case **A5** asserts the
new kind is routed by prefix with **no** `EXACT_SECTION` row and that all six figures above stand
still, and **MUTANT (d)** plants the tidy row and proves it reds.

### 4.3 ⇒ NO RAISE IS OWED ON THE §309 ECONOMICS, AND THIS IS WHY

The §309 argument re-filed WF-1B's obituary beat to WF-8 because that beat needed: a new kind
registry (the estate's 11th), a second one-row small family, a `grammarReceiptPools`-class pool
and a `grammarNews`-class registry row — **two files that do not exist** — plus a new
`tests/lint/faithKindPools.walker.test.js` and its mutation-coverage row, plus five moving census
literals. **WF-1c incurs NOT ONE of those.** Its total registration bill is **TWO rows**:

| home | file | why |
|---|---|---|
| `WHAT_PHRASES` | `src/domain/display/settlementRumors.js` (`:302-309`, the faith block) | `impactKindWalkers.test.js:186-188` — `unphrased` `toEqual([])` over the `impactKind:` literal scan |
| `EXPECTED_VOICE` | `tests/domain/impactKindWalkers.test.js` (`:60-176`) | `:191-193` — a new mint forces a conscious voice decision |

plus one OPTIONAL row (`KIND_SECTION` in `chroniclersLetter.js:120`, taken — see §6). The beat is
a **wizard-news `impactKind`**, not a Herald DESK kind in the GR sense; that is the whole
distinction, and it is what the two siblings' own registration shape already demonstrates.

⇒ The WF-8 once-built economics do not reach WF-1c. **The §309 boundary stays sharp, and the
member stands on its own.** Stated as a measurement, per §314.3, rather than assumed.

---

## §5 · WHY IT FITS ONE MEMBER

Priced against `PACKET_STANDARD`'s default hard scope budget — the same table chartered WF-1 broke
five ways (§P1 R-WF-8) and the one-member WF-1b broke twice (§309.1):

| limit | WF-1c | verdict |
|---|---:|---|
| behavior families | 1 | ✓ |
| new persisted record families ≤1 | **0** | ✓ |
| named writers per state | **0** (nothing is persisted) | ✓ |
| feature flags ≤1 | **0 new** (rides landed `faithUnseatingEnabled`) | ✓ |
| user-facing surfaces ≤1 | **1** (the realm beat) | ✓ AT 1 |
| direct production consumers ≤2 | **0** | ✓ |
| new logic-bearing leaves ≤2 | **0** | ✓ |
| existing logic files modified ≤3 | **3** (`pantheon.js`, `realmEvents.js`, `pulseKernel.js`) | ✓ AT CAP |
| registration-only files ≤3 | **2** (`settlementRumors.js`, `chroniclersLetter.js`) | ✓ |
| handwritten files ≤12 | **9** | ✓ |
| new/changed effective production lines ≤400 | **≤49** | ✓ |
| shared/hot-file delta ≤15 | **0 hot-list file named** | ✓ |
| acceptance cases ≤8 | **7** | ✓ one slot spare |

**ZERO overrides needed anywhere.** No split is proposed and none is warranted; the §309 pattern
(price the shapes, propose the smallest) returns "one member" on its own arithmetic.

---

## §6 · THE MEASURED SUBSTRATE — every figure this lane executed at `f20b9faa`

### 6.1 ⛔⛔ THE FINDING THE FAMILY LAW DOES NOT CARRY: `pulseKernel.js` IS A THIRD ZERO-HEADROOM FILE

Measured with eslint's own `Linter` under `max-lines {skipBlankLines:true, skipComments:true}`
(never `wc -l`, never an inherited figure) against the **blob** content at `f20b9faa`:

| file | effective | frozen / ceiling | headroom |
|---|---:|---:|---:|
| `src/domain/worldPulse/realmEvents.js` | **283** | 800 (layer) | 517 |
| `src/domain/worldPulse/pantheon.js` | **160** | 800 (layer) | 640 |
| ⛔ `src/domain/worldPulse/pulseKernel.js` | **1581** | **1581** (`scripts/.size-baseline.json`) | **ZERO** |
| `src/domain/display/settlementRumors.js` | **508** | 800 (layer) | 292 |
| `src/domain/display/chroniclersLetter.js` | **220** | 800 (layer) | 580 |
| `src/domain/worldPulse/warTermination.js` | **818** | **818** | **ZERO** (for the record; untouched) |
| `src/domain/worldPulse/peaceTerms.js` | **797** | 800 (hot list) | 3 (untouched) |
| `src/domain/worldPulse/religionState.js` | 368 | 800 | 432 (untouched) |
| `src/domain/worldPulse/religiousContest.js` | 470 | 800 | 330 (untouched) |

⚠ `realmEvents.js` **283** re-executes the annex's own row (`WF-SUBSTRATE.md`: `realmEvents.js |
283 | 283 | STANDS`) — inherited from nothing, and it agrees.

⛔⛔ **`pulseKernel.js` SITS AT ITS FROZEN BASELINE LITERAL WITH ZERO HEADROOM, AND NEITHER THE WF
PREAMBLE NOR `PACKET_STANDARD` NAMES IT.** Preamble §P7.8 names only `peaceTerms.js` and
`warTermination.js` as ZERO-HEADROOM-CLASS; the hot-file list omits `pulseKernel.js` for exactly
the reason `WF-1A` §13 gave for `warTermination.js` — *"it is not on the hot-file list only
because it HAS a baseline entry; practically it is tighter."* Executed proof that the pin is
**EXACT IN BOTH DIRECTIONS**, from `tests/lint/sizeBaseline.test.js`'s third test:

```
if (actual > frozen) drift.push(`… grew to ${actual} > frozen ${frozen} — decompose it back
                                  under ${frozen}; never raise the number`);
else if (actual < frozen) drift.push(`… shrank to ${actual} < frozen ${frozen} — LOWER its
                                  number here to ${actual} to lock the win`);
expect(drift).toEqual([]);
```

and `eslint.config.js:51` additionally generates a per-file `max-lines: ['error', { max: 1581 }]`
override, so **growth reds the linter as well as the ratchet**. Growth has NO lawful cure; a
shrink is lawful only if the literal is lowered in the same commit.

⇒ **RAISED-2 (§9): this belongs in the family law's STOP list beside the other two.** WF-1d and
every later WF wave that reaches the kernel needs it recorded, and it is a chair edit to a
chair-signed file.

**WF-1c's answer is a strict NET-ZERO, ONE-LINE substitution** (§7, M5) — not a squeeze and not a
growth. The packet requires the executor to re-measure 1581 **before and after** as a STOP.

### 6.2 The registers, swept

| register / instrument | measured at `f20b9faa` | WF-1c |
|---|---|---|
| lighting census tuple (`sovereigntyLightingContract.walker.test.js:4858`) | `files 2484 · parked 364 · credited 2120 · titles 20606 · suiteTitles 5767` | **titles only, `+0/+0/+0/+7/+0`** |
| `PACKET_MANIFEST.json` | **130 rows — 129 LANDED + 1 SUPERSEDED, ZERO non-terminal** | no path reserved by any live packet |
| `UNLAYERED_BASELINE_CEILING` (`couplingInclusion.walker.test.js:646`) | **179** | unmoved — no new module |
| `ARGUED_ROSTER_CEILING` (`:612`) | **20** | unmoved — no new entry |
| edge-shared closures (5 committed `*.meta.json` `inputs`) | 110 / 66 / 111 / 2 / 2 | **no WF-1c path in ANY closure** ⇒ §104.4 NOT INCURRED |
| `.prose-numerics-baseline.json` | **413 rows; ZERO key any WF-1c file** | **no hand-keyed address rot** |
| `.wizard-news-authoring-baseline.json` | **19 debt entries; ZERO for `realmEvents.js`** | debt ledger unmoved (A7 proves it) |
| `scripts/.test-ratchet-baseline.json` | `measuredAtSha 4deb4f02` · **11** entries · `totalTests 28274` · `totalFiles 2387` (FLOORS) | not moved by this member |
| `ENGINE_GATED_VIRTUAL_RULE_KEYS` | **24** members; `faithUnseatingEnabled` at **index 9** | unmoved — no flag mint |
| DS-FTH corpus (`warFaith.generated.js`) | DS-FTH-1/2/3; **ZERO `pantheon` hits** | no corpus row amended; `gen:dossier-prose` NOT run |

⭐ **`.prose-numerics-baseline.json` at zero is a real saving**: WF-1a paid six rows and WF-1b paid
the same six. WF-1c pays none, because no baseline row keys any file it touches.

⭐ **The coupling registry is NOT INCURRED, BOTH HALVES MEASURED** (§P2.8 — a packet naming one half
is defective on its face). (a) **PAIR half:** WF-1c creates no module and **adds no import edge** —
`realmEvents.js` keeps its single `./factionCapture.js` import, `pantheon.js` keeps its single
`./cultImpositionApply.js` import, and `pulseKernel.js` already imports both. (b)
**UNLAYERED half:** no new module ⇒ no new unlayered module. `pantheon.js` is already claimed by
`LAYER_PATTERNS.FAITH`'s subject-noun regex (`…|pantheon|…`); `realmEvents.js` is an existing
member of the 179 baseline; `pulseKernel.js` is an `ARGUED_UNLAYERED` **host** and a member of the
closed `ARGUED_HOSTS` set, which WF-1c does not touch. ⚠ The two display files are outside
`CENSUS_SCOPE_RE = /^src\/domain\/(?:worldPulse|spatial)\//` entirely.

---

## §7 · RUN-THE-FIXTURE-FIRST — THE EXECUTED TRANSCRIPTS

⚠⚠ Standing chair law (§P6, and the estate's canonical `PATRON_FLIP_TICKS` instance): **RUN THE
SPECIFIED FIXTURE AND PRINT WHAT THE ENGINE DID BEFORE WRITING ANY PIN.** This lane did, at
`f20b9faa`, against a clean `git archive f20b9faa src` tree in the scratchpad — **never the
working tree**, which matches no branch. Two of the four results below **refute what reading alone
would have written**, and one of them changes the fire predicate.

### 7.1 ⭐⭐ THE WAVE'S OWN PREMISE, PROVEN — the tier ladder is BLIND to the last seat

```
qualifyingTier(1,"cult")  = cult          qualifyingTier(0,"cult")  = cult
qualifyingTier(0,"minor") = cult          qualifyingTier(0,"major") = cult

--- THE LAST-SEAT DROP 1 -> 0 from cult tier ---
countSeats(before) = {"deity:Pale":1}
countSeats(after)  = {"deity:Rival":1}
advancePantheon.changes  = []
advancePantheon.pantheon = {"deity:Pale":{"wins":0,"losses":0,"seats":0,"tier":"cult","tierHeld":0},
                            "deity:Rival":{…,"seats":1,"tier":"cult","tierHeld":0}}
```

**A 1-seat deity is ALREADY `cult`** (`MINOR_PROMOTE` is 2), so losing that seat produces
**`changes: []` — no tier change, and therefore no `pantheon_twilight`.** The creed leaves the
realm entirely and the pantheon arcs say nothing. That is the gap WF-1c fills, **executed rather
than argued**, and it is the counterfactual arm of acceptance case A3.

⚠ **AND IT CONVICTS A COMMENT IN THE PRODUCTION FILE.** `realmEvents.js:218-219` states: *"A deity
falling TO 'cult' (or losing its last seat — extinction) is 'The Twilight of X'."* The parenthesis
is **FALSE at this base** — the twilight arm keys on `change.to === 'cult' && change.from !== 'cult'`
and can never see a seat count. WF-1c corrects the sentence in the same commit (comment-only,
free under `skipComments`).

### 7.2 ⛔⛔ THE HAZARD THE CHARTER DID NOT ANTICIPATE — THE DOUBLE OBITUARY

A **major** deity collapsing 4 → 0 seats in one tick, four ticks printed:

```
tick 1: changes=[]                                                    sun={seats:0, tier:"major", tierHeld:1}
tick 2: changes=[{"deityId":"deity:Sun","from":"major","to":"cult"},  sun={seats:0, tier:"cult",  tierHeld:0}
                 {"deityId":"deity:X","from":"cult","to":"major"}]
tick 3: changes=[]                                                    sun={seats:0, tier:"cult"}
tick 4: changes=[]                                                    sun={seats:0, tier:"cult"}
```

⛔ **The seat loss lands on tick 1 and the Twilight lands on tick 2** — after the hysteresis dwell.
A naive `prevSeats > 0 && seats === 0` predicate would emit a realm-scale extinction beat on tick 1
**and** a realm-scale twilight about the same deity on tick 2: **two obituaries, one tick apart,
for one event.**

⭐ **THE CURE IS A DERIVATION, NOT A THRESHOLD, AND IT IS THE CHARTER'S OWN WORDS.** The charter
says *"the LAST-SEAT edge case (seats 1 → 0) … distinct from tier demotion"* — the case the tier
ladder **cannot** narrate. So the beat fires exactly when the seats reached zero **and the tier
ladder has nothing left to say**:

```js
const lostLastSeat   = prev.seats > 0 && seats === 0;
const ladderSpeaks   = qualifyingTier(seats, curTier) !== curTier;   // the existing pure function
const lastSeatLost   = lostLastSeat && !ladderSpeaks;
```

- 1-seat cult → `qualifyingTier(0,'cult') === 'cult'` ⇒ ladder silent ⇒ **the beat fires** ✓
- 4-seat major → `qualifyingTier(0,'major') === 'cult' !== 'major'` ⇒ ladder speaks ⇒ **no beat;
  the Twilight covers it** ✓

⛔ **NO LITERAL THRESHOLD IS AUTHORED.** This matters directly: §308.3 **RAISED-4** forbids a
literal where a constant is in scope, and `MINOR_DEMOTE = 1` sits in `pantheon.js`'s module scope —
so the charter's literal reading `prev.seats === 1` would be a **STOP by coincidence of value**.
The predicate above spells no `1` at all: `> 0` and `=== 0` are the presence and absence of seats,
not bands, and the tier question is delegated to the module's own `qualifyingTier`. **RAISED-4 is
satisfied BY CONSTRUCTION**, exactly as WF-1B satisfied it with `KEEP`.

⭐ And it is falsifiable: **MUTANT (a)** deletes `!ladderSpeaks` and must red A4 alone.

### 7.3 ⭐ FIRES ONCE — the remnant persists and says nothing further

```
tick2 changes  = []
tick2 pantheon = {"deity:Pale":{…,"seats":0,"tier":"cult","tierHeld":0}, …}
```

A deity parked at 0 seats re-emits nothing on subsequent ticks, because `prev.seats > 0` is false
from the second tick onward. This is the volume's *"the pantheon entry persists as the remnant it
already is"*, executed. **MUTANT (b)** collapses the predicate to `seats === 0` and must red this
arm — it would re-fire the obituary every tick forever.

### 7.4 ⚠⚠ A MEASURED LEGIBILITY DEFECT READING WOULD HAVE MISSED — THE NAME NEVER RESOLVES

`deityNameForRef(snapshot, deityId)` (`realmEvents.js:231-242`) resolves a display name by scanning
the snapshot for a settlement carrying that deity, and falls back to *"a readable tail of the
ref"*. ⛔ **A deity that lost its last seat is, BY CONSTRUCTION, carried by no settlement in the
snapshot the arcs are given** — so **every** extinction beat takes the fallback. Executed, both
ref shapes:

```
--- deity PRESENT in the snapshot (the sibling arcs' ordinary case) ---
deity:The Pale Warden          => "The Twilight of The Pale Warden"
custom:lu_vael                 => "The Twilight of Lu Vael"

--- deity ABSENT from the snapshot (EVERY extinction) ---
deity:The Pale Warden          => "The Twilight of The Pale Warden"     ✓ full name
custom:lu_vael                 => "The Twilight of Vael"                ⛔ truncated
deity:Harrow                   => "The Twilight of Harrow"              ✓ full name
custom:sun_of_the_deep_forge   => "The Twilight of Forge"               ⛔ truncated
```

The fallback splits on `/[:_]/` and keeps only the **last** token. For the `deity:<Name>` form
(minted by `deityIdOf` from a name) it returns the full name correctly. For the `custom:<slug>`
form — the `_deityRef` path, i.e. **authored and DM-created deities** — it returns one word:
`custom:sun_of_the_deep_forge` becomes **"Forge"**.

⇒ **This is a pre-existing defect in a shared helper, which WF-1c's beat would make systematic
rather than rare.** (It is already reachable today: §7.2's tick-2 Twilight fires on a deity absent
from the snapshot.) **This lane does not repair it** — it is out of WF-1c's chartered scope, it
changes shared display behaviour, and it carries declared-shift risk against any same-seed golden.
**RAISED-1 (§9)** carries it with its measurement and its one-line cure.

**Consequence for the pins, and it is a real one:** A1 pins the headline on a `deity:<Name>` fixture
where the name resolves in full, and the `custom:` truncation is carried as a **separately labelled
measured-truth arm** rather than smuggled into the main assertion — so if the chair takes RAISED-1,
exactly one labelled arm re-records with a declared cause instead of a green pin quietly changing
meaning.

### 7.5 The flag read is real — the virtual key survives normalization

```
normalizeSimulationRules({faithUnseatingEnabled:true}).faithUnseatingEnabled  → true
'faithUnseatingEnabled' in DEFAULT_SIMULATION_RULES                          → false   (VIRTUAL ✓)
ENGINE_GATED_VIRTUAL_RULE_KEYS.length → 24 ;  indexOf(flag) → 9
```

⛔ **Priced rather than assumed**, because it is the failure that would have made the whole gate
vacuous: `pulseKernel.js` reads a **normalized** rules object (`:307`), and had
`normalizeSimulationRules` allow-listed keys, a VIRTUAL flag would be stripped and the gate would
be permanently false — a fully wired feature shipping dark with every fence green. It does not; the
normalizer passes unknown keys through.

⭐ And `simulationRules` (`:307`, inside `simulateCampaignWorldPulse` which opens at `:241`) is **in
scope at both pantheon sites** (`:1601`, `:1871`) — verified by function-boundary scan, which is
what makes the net-zero substitution of §6.1 possible at all.

---

## §8 · THE DESIGN, AND WHY EACH FORK WAS TAKEN

`pantheon.js` computes the last-seat transition inside `advancePantheon` and appends one row per
extinct creed to the `changes` array **pulseKernel already threads**; `realmEvents.js` grows a third
arm on `synthesizePantheonArcs`; two display files take one registration row each; and
`pulseKernel.js` is touched on **exactly one line, at net zero**, to carry the by-name flag read.

**Three forks were priced rather than assumed:**

| fork | taken | rejected, and the measurement |
|---|---|---|
| how the rows reach the arcs | ride the existing `changes` array, one optional `lastSeat` flag, `from === to` | a separate `seatLosses` return key — costs `pulseKernel.js` ≥1 ADDED line against a **1581/1581 EXACT** pin whose growth direction has no lawful cure |
| the fire predicate | `prev.seats > 0 && seats === 0 && !ladderSpeaks`, all derived | the charter's literal `seats === 1` — emits a SECOND realm obituary one tick later on a multi-seat collapse (executed, §7.2), and `MINOR_DEMOTE = 1` in scope makes the literal a RAISED-4 STOP |
| the desk routing | the `pantheon_` PREFIX rule, no `EXACT_SECTION` row | the row its two siblings both have — grows `unvoiced` 274 → 275 against a **shrink-only** ceiling (§4.2) |

⭐ **`ratchetPantheonTiers` IS DELIBERATELY NOT TOUCHED.** Its `changes` stays tier-only, which is
what keeps `pantheon.test.js:247/:266/:271` — three landed `res.changes.length` pins that call it
**directly**, not through `advancePantheon` — green **unedited**. That is the executed proof the
widening is additive, and it is the same shape as WF-1B's untouched `religionState.test.js`.

---

## §9 · RAISED FOR THE CHAIR — three matters, with numbers

- ⛔⛔ **RAISED-A — `pulseKernel.js` IS A THIRD ZERO-HEADROOM-CLASS FILE, AND THE FAMILY LAW DOES
  NOT SAY SO.** Measured **1581/1581**, pinned EXACT in both directions by
  `tests/lint/sizeBaseline.test.js` and re-enforced by a generated per-file `max-lines` override
  from `eslint.config.js:51`. Preamble §P7.8 names only `peaceTerms.js` and `warTermination.js`;
  the `PACKET_STANDARD` hot-file list omits it for precisely the reason `WF-1A` §13 gave for
  `warTermination.js` — *"not on the list only because it HAS a baseline entry."* **WF-1d and every
  later WF wave that reaches the kernel needs this recorded, and amending a chair-signed preamble
  is a chair act.** WF-1c is safe either way: its M5 is net-zero by construction and §11 step 7
  makes re-measuring it a STOP on both sides of the edit.
- ⚠⚠ **RAISED-B — `deityNameForRef` TRUNCATES EVERY `custom:` DEITY REF, AND THIS BEAT MAKES IT
  SYSTEMATIC.** Executed: `custom:lu_vael` → `"Vael"`, `custom:sun_of_the_deep_forge` → `"Forge"`;
  the `deity:<Name>` form resolves in full. Because an extinct creed holds no seat anywhere, **every
  extinction beat takes the fallback** — and the defect is already reachable today through the
  existing Twilight arm (§7.2's tick-2 case). The cheap cure is one line: un-slugify the whole tail
  after the first colon instead of keeping only the last token. It changes existing display output
  and therefore owes a declared-shift proof; the expensive alternative — a display name persisted
  on the pantheon entry — is a **schema addition and owner-gated**. Routed to the chair. WF-1c pins
  the measured behaviour on a separately labelled arm either way, so taking RAISED-B later
  re-records one labelled arm rather than silently changing a green pin.
- ⚠ **RAISED-C — the realm beat's COPY is owner surface and the volume never wrote it.** The packet
  carries compiled house prose in the register of its two siblings. ⛔ The boundary with WF-8's
  re-filed SETTLEMENT obituary must stay legible — that beat is settlement-voiced and names a town,
  this one is realm-voiced and names none. Under the LEGIBILITY and NEWS ADDRESS laws the final
  wording is the owner's to ratify; it is a one-string change at any point.

---

## §10 · WHAT THE CHAIR RECEIVES, AND WHAT IS STILL OPEN

**Deliverables:** `draft-WF-1C.md` (a complete DRAFT packet, 15 sections) and this receipt. **No git
write of any kind was made**; the working tree and the shared index are untouched.

**Pre-flight checks this lane ran on its own deliverable, so the chair does not inherit them:**

| check | result |
|---|---|
| the live `CLAIM_RE` over both files, exact regex from `tests/docs/enforcement-claims.test.js:40` | **0 matches in each** — the §313 lesson applied BEFORE writing, per §314.1's practice |
| `parsePacketHeader` simulated against the draft (blob copy of `scripts/implementation-packets.mjs`) | `status: "DRAFT"` (single row, alone on its line) · `verifiedBase: f20b9faa828469fed6f3fccae19f7c08508a5213` · `verifiedBranch: claude/composite-r4` — **parses clean** |
| the validator's heading id pattern | `WF-1C` appears bounded in the heading; the only other id-like token is the lowercase train id `` `wf-1` `` |
| internal §-reference audit | five stale cross-references found and corrected |

⚠ **The `Verified base` row needs the FULL 40-character SHA** — the parser's regex demands
`[0-9a-f]{40}` and an abbreviated sha leaves `verifiedBase` null. Caught here rather than at
promotion.

**Open, and the chair's to rule:**

1. **RAISED-A / RAISED-B / RAISED-C** above.
2. **The five judgment calls** J-TCWF1C-1..5 in the packet's §13, each written with its veto
   consequence.
3. **Promotion order.** WF-1c promotes ALONE as stage 3. ⭐ It shares **no** change path with WF-1d,
   so the serial constraint that bound stages 1→2→3 does not bind stage 4 to stage 3 by path
   reservation — that is a scheduling freedom the chair may or may not want to use.
4. ⚠ **WF-1B's stale preamble citation** (`cd067ba1…` against the live `ca02c8a1…`) is untouched by
   this lane; per ODQ §314.2 its re-stamp rides the next landing CAS. **If WF-1C lands as that CAS,
   the re-stamp rides with it.**

---

## §11 · CONFIRMED vs PLAUSIBLE — the honest ledger

**CONFIRMED (executed, output quoted above):** the preamble hash and the base identity · the
capsule's inadmissibility · all nine effective-line measurements including `pulseKernel.js`
1581/1581 and its exact-both-directions semantics · the tier ladder's blindness to the last seat ·
the double-obituary hazard on a multi-seat collapse · the fires-once behaviour · the name-resolution
truncation on `custom:` refs · the virtual flag surviving normalization · `simulationRules` being in
scope at both pantheon sites · the six `kindPoolFloors` figures and the shrink-only `unvoiced`
arithmetic · the prefix router and `isExplicitlyRouted`'s prefix arm · `newsVoiceCategory` returning
null for the new token · the `KIND_SECTION` correspondence accepting `traditions → split` · the
lighting tuple · the packet manifest's zero non-terminal rows · both coupling ceilings and the
zero-new-edge finding · all five edge-shared closures · the 413 prose-numerics rows with zero
matches · the 19-row wizard-news authoring ledger with zero `realmEvents.js` rows · the DS-FTH
corpus carrying no pantheon binding · `CLAIM_RE` at zero · the header parse.

**PLAUSIBLE (reasoned, not executed) — and nothing in the manifest rests on these:**

- The **predicted census delta `+0/+0/+0/+7/+0`** is a prediction by construction (seven `test(`
  calls into an existing `describe`), not a measurement. The packet requires the tuple re-derived
  WHOLE at the implementing tip.
- The **`≤25` / `≤22` effective-line budgets** for M1 and M2 are estimates from the shape of the
  code to be written, not measurements of written code.
- The claim that **M5's two-key line costs zero effective lines** follows from `max-lines` counting
  lines rather than statements, and from the file's own precedent at `:307`/`:331`. It is
  arithmetic rather than execution, which is exactly why §11 step 7 makes the before/after
  re-measure a STOP rather than a courtesy.
- The **mutant conviction sets** in §14 are predictions. WF-1B's landing record is the precedent for
  why they are predictions: three of its five mutants convicted **more** arms than the compile
  predicted, and the packet's own STOP language covers that case.

---

## §12 · ⚠⚠ THE BRANCH MOVED UNDER THIS COMPILE — CAUGHT, DISCHARGED, RE-BASED

**On the final verification pass, `git rev-parse claude/composite-r4` returned `2cdb87fa`, not the
`f20b9faa` this lane had compiled against.** The shared-tree law paid for itself: the check that
found it was a routine re-read of the ref, not a belief carried from the start of the session.

**What landed in the window** (`git log --oneline f20b9faa..2cdb87fa`): the TE-T2A build
(`5475110c` → `7567a2c7`, the map family's fabric single-declaration law) and **`2cdb87fa`, the ODQ
§315 re-stamp** — *"the MF-PREAMBLE status line fixed and both citing packets re-stamped to their
live preamble hashes."*

**THE DISCHARGE, EXECUTED — not an assertion that the window "looks docs-only":**

```
$ git merge-base --is-ancestor f20b9faa claude/composite-r4   → YES (no divergence)
$ git diff --name-only f20b9faa 2cdb87fa | wc -l              → 9
$ git diff --name-only f20b9faa 2cdb87fa -- src/ | wc -l      → 0        ⭐
   docs/implementation/INDEX.md · PACKET_MANIFEST.json · packets/fp/WF-1B.md
   · packets/town-cartography/MF-T2A.md · preambles/MF-PREAMBLE.md
   · scripts/mutation-coverage-manifest.json · scripts/mutation-sweep.sh
   · tests/lint/sovereigntyLightingContract.walker.test.js
   · tests/lint/townMapFabricSingleDeclaration.walker.test.js
```

and every production target re-verified **blob-identical** by `git rev-parse <sha>:<path>`:
`pantheon.js` · `realmEvents.js` · `pulseKernel.js` · `settlementRumors.js` · `chroniclersLetter.js`
— **all five IDENTICAL.**

⇒ **Every code reading, every effective-line measurement and all four fixture transcripts carry
unchanged.** `pulseKernel.js` is still 1581, `realmEvents.js` still 283, and the probes were run
against a `git archive` of a tree that did not move.

**THREE FIGURES DID MOVE, AND ALL THREE WERE RE-EXECUTED AT THE NEW TIP RATHER THAN INHERITED:**

| figure | at `f20b9faa` | at `2cdb87fa` | cause |
|---|---|---|---|
| the lighting tuple | `2484/364/2120/20606/5767` @ `:4858` | **`2485/364/2121/20611/5768` @ `:4870`** | MF-T2A minted `townMapFabricSingleDeclaration.walker.test.js` — `+1/+0/+1/+5/+1` |
| `PACKET_MANIFEST.json` | 130 rows, 129 LANDED + 1 SUPERSEDED | **131 rows, 130 LANDED + 1 SUPERSEDED** | MF-T2A's own row; **still ZERO non-terminal**, so the collision check holds |
| the `BASE_STATE` window | 236 paths / 193 non-docs | **239 / 195** | still NOT CITABLE, by a wider margin |

**AND ONE OPEN ITEM CLOSED ITSELF.** ⭐ ODQ §315 executed the WF-1B re-stamp: `WF-1B.md` at
`2cdb87fa` now carries `ca02c8a1…`. The §314.2 defect this receipt opened as item 4 is **CURED**,
and the packet's header row was rewritten from a warning into the record. ⚠ The **WF-PREAMBLE hash
itself is UNCHANGED** at `ca02c8a1…` — re-executed at `2cdb87fa` — so the citation this packet was
written around never needed to move.

**The packet is re-based to `2cdb87fa`** with the window discharge quoted in its header, and its
header re-parses clean (`status: DRAFT`, `verifiedBase:
2cdb87fac566b3d6803a0dce9d59df13f07c1c9e`). ⛔ **Nothing was inherited across the window.**

⭐ **CLASS NOTE, offered for the family law:** a compile lane that measures docs-side censuses —
the lighting tuple and the packet manifest above all — is measuring the **fastest-moving numbers in
the estate**, because every landing anywhere touches them. A code-side figure survives a sibling
lane's landing; a census figure usually does not. The packet already says *"re-read at the
implementing tip, never inherit"* for both (P-7, P-8); this compile is the executed instance of why.
