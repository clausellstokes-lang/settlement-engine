# RE-REFUTE (the cure) — block DS-DEF-2 · pool `Internal Security: court without detention`

Re-refuter seat: Opus 5. Test: ADDENDUM 14 as the Fable sitting re-worded it (ADDENDUM 18 and
CONTRADICTION-TABLE §V) — a face is lawful unless it CONTRADICTS the record; silence is permission;
"the card does not license it" is not a finding. Instruments read: the card, `speakers.md`,
`cure.md`, the prior `refute.md`, the CONTRADICTION TABLE (header strike list, §R-1/R-3/R-4/R-12,
§V.1, §V.2), the pool's rows in the dock annex, and the dock source (executed reads, cited below).

**Scope.** One target was named and one was cured: **variant 1 face 10 `[garrison]`**. I refute the
cured face and re-take the CRAFT verdict at the pool grain. The two WITHHELD faces (v1f2 `[court]`,
v3f3 `[market]`) were not targets; they stand withheld to the chair and are byte-identical.

**Counts.** 1 cured face refuted: **1 PASS · 0 FAIL · 0 WITHHELD.** Craft at the pool grain: **PASS.**

---

## THE CURE'S BYTE-IDENTITY CLAIM — VERIFIED, EXECUTED

`git -C <dock> diff HEAD~1 HEAD -- docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` (d794c3a78 →
73d32a126). This pool's hunk is `@@ -2890,7 +2890,7 @@` — **a seven-line hunk with exactly one
changed line**, and that line is v1f10:

- was: `A soldier says the wall is the garrison's business and the people walked out past it are not.`
- now: `A soldier says what comes at the town is the garrison's business and the people walked out of it are not.`

Three spines and twenty-four other faces are unchanged to the byte. The curer's claim holds; nothing
was moved on the chair's behalf.

---

## THE CURED FACE

| face | source | verdict | floor | the field | quote | finding | cure |
|---|---|---|---|---|---|---|---|
| v1 f10 | garrison | **PASS** | — | `Garrison` → `Defence services` p 1.0 "Patrol, wall-walking, gate duty", `src/data/institutionServices.js:186` (EXECUTED); `Barracks` → `Military escort` p 0.8 / `Guard hire` p 0.9, `:1555-1557`; `hasGarrison`, `priorityHelpers.js:46` (EXECUTED) | "what comes at the town is the garrison's business" | The floor-1 fault is gone at the root and nothing took its place. No wall, circuit, perimeter or line around the town survives anywhere in the sentence, so F1-07 is not approached on the ~34 town-tier preimage towns where `Barracks` (0.3) resolves and `Town walls` (0.5) does not. What replaces it is the seating row's OWN service at the top of its menu, which holds wherever the source is seated: at city and metropolis `Garrison` is required and its p 1.0 service is *patrol, wall-walking, gate duty*; at town the `Barracks` menu is escort and guard hire. "What comes at the town" carries no fabric, no count, no rate and no event. | — |

### The attacks I pressed, and why each failed

1. **Does the word "the garrison" survive at TOWN, where the seating row is a `Barracks`?**
   YES, and this is settled law, not my reading. **§R-3 is STRUCK:** *"The garrison" is lawful
   wherever `inst.hasGarrison` or the garrison bucket resolves, Barracks included.* Executed:
   `priorityHelpers.js:46` matches `'barracks'`; `defenseInstitutionBuckets.js` puts `'barracks'` in
   the `garrison` bucket; the row's own description is "Housing for guards or **small garrison**"
   (`institutionalCatalog.js:1363-1368`). §V-28 records A-2's Barracks clause struck on the same
   ground. The chair's block-ruling line ("only where a Garrison row resolves, city tier") is the
   pre-sitting wording; §V governs where it and an earlier row disagree.
2. **Does "A soldier" assert a body or a person the record denies?** No. The `Barracks` menu's own
   words are "**Soldiers** available for static guard duty on contract" (`institutionServices.js:1557`)
   and the `Garrison` menu's are "Off-duty **soldiers**" (`:187`). Indefinite, plural-capable, and
   not the tier's singular named office (the `Guard Captain` / `City Watch Chief` stay off the page).
   §V-27 and §V-30 bite only where NO force row resolves; here the source's own seat is the row.
3. **Floor 1, the required rows.** The face denies no service at or above the bar on any required
   row. It says nothing of `Town watch` → `Night patrol` p 1.0 / `Gate duty` p 0.8, nothing of
   `Professional city watch` → `Law enforcement` p 1.0, nothing of the hall, the market, the parish
   or the housing. It infers no body into the key's silence: every body it names is on the roster of
   every town it draws on.
4. **The hardest reading against it — does it DENY the `Garrison`'s p 1.0 `Defence services`
   ("Patrol, wall-walking, gate duty") at city and metropolis, where a man walked out of the town
   goes out past a gate the garrison's own service names?** I pressed this and it does not. The face
   allocates a REMIT; it asserts nothing about where a soldier stands. It never says the garrison
   does not patrol, does not walk the wall, does not keep the gate — the first half affirms exactly
   that duty. And no field anywhere makes a person the court has sanctioned the garrison's charge:
   nothing in any garrison-seating row's menu touches courts, sanctions or removals. `City walls and
   gates` (`Gate control` p 1.0) is a SEPARATE required row from `Garrison` at city
   (§V.2's own correction of F1-29: two rows at every city, `dedupByName` cannot merge them), so the
   pool's `[gate]` face and this one describe two bodies the roster genuinely keeps apart. Recorded
   here in full so the chair can overturn me on the reading; the field is named either way.
5. **Floor 2.** No magnitude in a digit or a word ("what comes at the town", "the people" — neither
   is a count, share or size). No date, no rate, no term. No event the record did not run: exile is
   the record's own, `defenseDisplay.js:233` "Courts without detention. Fines and exile only." fires
   on EVERY preimage town. The whole sentence is the simple habitual present, which is licensed
   everywhere, so the frozen/live seam is not even reached.
6. **Floor 3.** No named character's fate, no deity, no singular office, no culture-bound furniture.
7. **Floor 4.** No purse is split (F4-02 untouched — the face names no pay at all), no decay clock
   and no permanence (F4-01), no covert fact, no force removed or emptied (F4-04, §V-16).
8. **Ruling 35, the sibling rungs.** `court=false` → `no legal infrastructure`; `prison=true` →
   `full legal chain`. The face does not read as either. It leans toward THIS rung: the sanction it
   presupposes is the one `defenseDisplay.js:233` prints on this key alone — on the full-legal-chain
   rung that line does not fire at all, its predicate being `!(court && prison) && court`. That it
   does not restate the key is no longer a fault (the "same claim set on every face" rule is struck;
   twelve faces are twelve things a person could notice in a town where the key holds).
9. **The citation ceiling.** No record is named — no book, roll, register or road. The PROVENANCE
   shape that refused batch 3's packet is not approached, and the cure spent nothing on it.
10. **The metropolis correction.** Used throughout, as the prior packet did: `assembleInstitutions.js:244`
    (EXECUTED) merges the city catalog into metropolis, so `Garrison`, the watch, the walls, the hall
    and `Multiple courthouses` are required at metropolis. The card's §5 one-row metropolis is a card
    defect (W-3), and a refuter working from it would charge the truthful party (§R-1).

---

## CRAFT — at the pool grain, re-taken

**VERDICT: PASS.**

**The fingerprint I read first (ruling 35), from `measure-block.py` on the dock tree, pool P15:**

> `units 28 · sentences 32 · words 679 | wps 21.25 ±6.2 | same-opener 0.222 (6) | pet 1.18/100w (8) | sensory 2.21/100w (15) | attrib/sent 0.75 (24, strict 0.75) | self-cite 0 | forecast 0 | varied`
> `openers subject 20 · place 8   closes plain 27 · antithesis 1`

**The figure that moved me: `sensory 2.21/100w (15)` against the shipped pool's `sensory 1.43/100w (1)`**
— fifteen concrete particulars where the rows this replaces had one, at `wps 21.25 ±6.2` (real
sentence-length variance, not a metronome) and with `self-cite 0` under ruling 40. The pool is not
duller than what it replaces; on the one measure that tracks whether a reader sees anything, it is
half again richer, and the shipped pool's `summary` close (a tell) is gone — 27 plain closes and one
antithesis across 28 units.

**The nearest approach to a collapse, named and recorded:** the pool opens in only **two** of the
kernel's seven opener classes (`subject 20 · place 8`), the narrowest opener spread of the four
Internal Security pools — P14 `full legal chain` spreads across five classes, P17 `no legal
infrastructure` across four. With `attrib/sent 0.75`, the highest of the Internal Security pools,
the pool's single construction is *[source] says [clause], and that [clause]*. That is the ruling-13
design working (every account names its source) rather than a vocabulary collapse, and the counts
that decide the verdict are against it: **ten distinct sources** (watch · court · hall · market ·
register · guild · tavern · stranger · gate · garrison) plus the public carrying spine 2; three
grounds, one per variant, no two arguing the same thing; two honest disagreements and one honest
reinforce; and real stakes on the page — the hall's one purse, the guild's stronger private
sanction, the gate as the only body that can execute what is decided, the stranger as the person it
falls on worst. This is not a camera without a speaker and it does not read as one sentence twelve
times. PASS.

### Craft observations the CURE introduced (reported, not charged — craft is at the pool grain)

1. ⚠ **A new spine echo, and it is the mechanical rule that reds the build.** A spine co-renders
   with every face of its variant. Spine 1 reads *"**What** the law here can take from a man **is**
   his money or his place **in the town**"*; the cured face now reads *"**what** comes at **the
   town is** the garrison's business"*. The pre-cure sentence carried neither the free-relative
   *What X is Y* frame nor the word *town*; the cure put both beside the spine that always renders
   with it. This is the same family as the prior packet's reservation 1 (spine 1 against v1f8's
   "nothing here to take from a man"), and it now makes **three** faces of variant 1 echoing their
   own spine. Cheap to remove without touching the finding that was cured: *"A soldier says the
   garrison's business is what comes at the place and not the people walked out of it."*
2. **A landing rhyme inside variant 1.** Face 6 ends *"the mark taken off his work **is not**"* and
   face 10 ends *"the people walked out of it **are not**"* — two of the variant's ten faces close
   on the same elided negated copula. Pre-existing in part (the pre-cure face had it too) and not
   charged, but it is the shape to watch: the mechanical rule wants a different order and a
   different landing for every face of a variant.
3. **What the cure did NOT cost, checked:** the sentence is still a different sentence from every
   sibling and from variant 3's `[garrison]` face ("not asked about any of it until somebody runs");
   no source, tag, pair number or join comment moved; no record is cited; the antithesis the
   selector counted in variant 1 is neither added nor removed.

---

## WIRING ROWS

W-1 to W-4 of the prior packet stand unchanged and are not re-argued here (the engine's two
contradictory court surfaces; the town gate; the card's metropolis defect; spine 3's `[unfolding]`
tag). One row is added by the cure's new second clause:

- **W-5 · THE OCCUPATION SURFACE AGAINST THE GARRISON'S REMIT.** None of this block's five key
  functions reads `config.stressTypes`, so this face prints under an occupation banner. There
  `safetyProfile.js:105` prints, for any town with `hasGarrison`, "Movement is restricted and
  monitored. The garrison, now under occupier command, enforces curfew and checkpoint protocols" —
  a page on which the people walked out of the town arguably ARE the garrison's business. The
  denier is engine PROSE, so under §R-1 the face stands and this is filed instead; and the face
  survives the reading on its own terms, since the decision to walk a man out remains the court's
  and the walking the gate's on every surface. F1-121 is not reached: the body named is the town's
  own roster row, which is what the engine's own string calls "the garrison". Charged to the key,
  not to the writer.

---

## WHAT I LOOKED FOR IN THE CURED FACE AND DID NOT FIND

No wall, palisade, circuit, perimeter, line, gate-as-fabric or work of any kind. No count, date,
rate, term or trend. No named record and no PROVENANCE shape. No singular office. No purse. No
covert fact. No stocks, cell, gallows or holding room. No denial of the watch, the gates, the hall
or any required row's service. No em dash, exclamation mark or digit. No self-citation (ruling 40).
