# RECEIPT POOLS — CHANCE MEETING (ENC-4/ENC-5)

⭐ **THE WORDS ARE AUTHORED.** The owner handed ENC-5 to the chair in chat, 2026-09-04, verbatim:
*"Also for ENC-5.. you write it"*. Every sentence below is written to ship. Variants marked
`§8.3` are the design's own and are kept because they are good, not because they were inherited.

**Voice**: `docs/content/RECEIPT_POOLS_FAITH.md` §D is the register — plain, concrete, understated,
and it REPORTS rather than judges. Zero em dashes and zero exclamation marks anywhere below (voice
E2, hard). No variant contains the words "chance" and "meeting" adjacent in any order, so no raw
engine identifier can reach a townsperson's mouth (§886).

---

## §A ENC-4 — THE MEETING NEITHER COURT ARRANGED

### chance_meeting_recorded (ENC-4) — Herald `events` — significance: notable
SLOTS: {npc} {counterpart} {settlement} {home} {outcome_phrase}
AUDIENCE: public
1. {npc} of {home}, passing through {settlement}, {outcome_phrase} in {counterpart}.
2. Word from {settlement}: {npc} and {counterpart} {outcome_phrase}, and neither court sent them to.
3. On the road to {settlement}, {npc} of {home} fell in with {counterpart} and {outcome_phrase} before either reached the gate.
4. {counterpart} spent a market day in {settlement} with {npc} of {home} and {outcome_phrase}; the two courts have a thread between them now that neither one spun.
5. Neither {home} nor {settlement} arranged it. {npc} and {counterpart} met, {outcome_phrase}, and the tie will keep as long as ties keep.
6. The register at {settlement} lists {npc} of {home} among the season's guests; what it does not list is that {counterpart} {outcome_phrase} that week.

**Per-variant required slots** (the walker pins `requiredSlots.length === pool.length`):
1. `{npc} {home} {settlement} {outcome_phrase} {counterpart}`
2. `{settlement} {npc} {counterpart} {outcome_phrase}`
3. `{settlement} {npc} {home} {counterpart} {outcome_phrase}`
4. `{counterpart} {settlement} {npc} {home} {outcome_phrase}`
5. `{home} {settlement} {npc} {counterpart} {outcome_phrase}`
6. `{settlement} {npc} {home} {counterpart} {outcome_phrase}`

**REASON, riding every variant** (design §8.3): a guest and a notable met by chance; what passed
between them is now a tie across two courts, and it will fade as ties do.

**`{outcome_phrase}` — a CLOSED MAP of three. KEPT as designed:**

| band | fill |
|---|---|
| `bond` | found a friend |
| `respect` | found a worthy stranger |
| `rivalry` | found a rival |

⭐ Kept rather than amended: the three are parallel, they all fit the frame `{outcome_phrase} in
{counterpart}` and the bare frame equally, and "a worthy stranger" is a genuine middle rung rather
than a hedge. Churning them would cost the design and buy nothing.

---

## §B ENC-4 — THE REFUSAL THAT TRAVELLED

### chance_meeting_exposed (ENC-4) — Herald `events` — significance: major
SLOTS: {npc} {counterpart} {settlement} {home}
AUDIENCE: public
⛔ **§B speaks only where the approach is known.**
1. {counterpart} of {settlement} refused what {npc} of {home} offered, and the refusal was spoken of.
2. In {settlement}, {counterpart} said no to {npc} of {home}, and said it where it could be heard.
3. {npc} of {home} made an approach at {settlement}; {counterpart} declined it, and the declining did not stay between the two of them.
4. {settlement} knows that {counterpart} turned {npc} of {home} away. It does not know what was offered, and it has not stopped guessing.
5. Neither court announced it, and {settlement} has it anyway: {counterpart} refused {npc} of {home}.

**Per-variant required slots:**
1. `{counterpart} {settlement} {npc} {home}`
2. `{settlement} {counterpart} {npc} {home}`
3. `{npc} {home} {settlement} {counterpart}`
4. `{settlement} {counterpart} {npc} {home}`
5. `{settlement} {counterpart} {npc} {home}`

⛔ **STATE, NEVER FATE — how each line holds it.** Every variant reports that a refusal happened and
that it became known. **None adjudicates**: no verdict, no demotion, no ousting, no replacement, and
no line says what follows for either person. Variant 4 carries the law explicitly ("It does not know
what was offered") and is the strongest of the five for that reason.

⛔ **The K3 clause holds: the covert sub-record is never spelled.** `{npc}` appears only by the
declared face the host court knows. No variant names what was offered, so a reader learns exactly
what the court learned and no more.

---

## §B2 ENC-4c — THE OTHER HALF OF §B: THE HOST COURT'S OWN NOTABLE OFFERED

⭐ **THE WORDS ARE THE CHAIR'S**, authored 2026-09-05 under the owner's standing *"you write it"*
(ENC-5). §B is honest only where the one PASSING THROUGH made the offer, because its variant 1
fixes `{counterpart}` as being OF `{settlement}`. The engine lets either party lead, so the other
half of the kind was real news with no authored sentence and the writer withheld it. These five
carry that case, and after them the kind withholds nothing.

⛔ **ROLES, UNCHANGED FROM §B.** `{npc}` is the APPROACHER and `{counterpart}` is the one who
REFUSED. What differs is only where each is from: here `{npc}` is of `{settlement}` (the host
town) and `{counterpart}` is of `{home}` (a guest passing through). No variant below says
"counterpart of settlement", and none says "npc of home".

### case host_offered of chance_meeting_exposed (ENC-4c) — Herald `events` — significance: major
SLOTS: {npc} {counterpart} {settlement} {home}
AUDIENCE: public
⛔ **§B2 speaks only where the approacher is of the host town.**
1. {npc} of {settlement} made an offer to {counterpart} of {home}, a guest that season, and the guest's refusal was spoken of.
2. In {settlement}, {counterpart} of {home} said no to {npc}, one of the town's own, and said it where it could be heard.
3. {npc} of {settlement} made an approach while {counterpart} of {home} was within the walls; {counterpart} declined it, and the declining did not stay between the two of them.
4. {settlement} knows that {counterpart} of {home}, passing through, turned {npc} away. It does not know what was offered, and it has not stopped guessing.
5. Neither court announced it, and {settlement} has it anyway: {counterpart} of {home} refused {npc}, the town's own.

**Per-variant required slots** (the walker pins `requiredSlots.length === pool.length`):
1. `{npc} {settlement} {counterpart} {home}`
2. `{settlement} {counterpart} {home} {npc}`
3. `{npc} {settlement} {counterpart} {home}`
4. `{settlement} {counterpart} {home} {npc}`
5. `{settlement} {counterpart} {home} {npc}`

**Voice**: no em dash, no digit, one semicolon (variant 3, mirroring §B's third).

⛔ **STATE, NEVER FATE — how each line holds it.** Every variant reports that an offer was made and
that a refusal became known. **None adjudicates**: none names what was offered, none says what
follows for either person, and variant 4 carries the law explicitly ("It does not know what was
offered").

⛔ **§B2 TAKES NO SECOND `EXACT_SECTION` ROW AND MINTS NO SECOND KIND.** It is a second authored
CORPUS of the SAME registered kind, chosen by which court the approacher belongs to. The desk, the
audience, the significance and the `{outcome_phrase}`-lessness are §B's, unchanged.

## §C HOLE 3 — THE TWO R1 NOUN PHRASES (`WHAT_PHRASES`, `settlementRumors.js`)

| token | phrase | disposition |
|---|---|---|
| `chance_meeting_recorded` | `a meeting no court arranged` | ⭐ **AMENDED** from the §893 chair draft |
| `chance_meeting_exposed` | `a refusal that did not stay private` | ⭐ **KEPT** as drafted |

**Why the first was amended.** The draft read `a meeting neither party arranged`. "No court" is the
world's own noun (the design speaks of two courts throughout), it is three characters shorter, and
it matches the register of the real rows better than "party" does: compare `a question put to the
brokerage` and `buildings put to the torch`. Read aloud in all six R1 frames it is the stronger of
the two: *wakes to · braces for · has word of · is spared · pays no heed to · has seen the last of*
**a meeting no court arranged**.

**Why the second was kept.** It survives all six frames without strain and says precisely the thing
the kind is about: not that a refusal happened, but that it did not stay private.

**Both checked against the six R1 refusals:** bare lower-case noun phrases; no terminal `.`/`!`/`?`;
no digit; no underscore; no `{`, `}` or `$`; no opening connective (the "that" in the second is
medial, not initial); no em dash; neither starts with a capital; neither equals the refusal phrase
`a matter of some moment`.
