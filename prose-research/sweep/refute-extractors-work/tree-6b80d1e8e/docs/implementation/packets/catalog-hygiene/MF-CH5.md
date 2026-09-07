# Catalog hygiene / MF-CH5 — ALCHEMY IS A TRADE: the magic-dependence list stops carrying a craft, the three rows that disagreed with their own licence stop disagreeing, and the hand-typed fifth copy of the list is derived

- **Status:** LANDED
- **Packet version:** 1
- **Verified base:** `claude/composite-r4` at `510c51b766a4ef329a697d61f3006e23d4fb2325`
  ⚠ The status value above stands ALONE on its line because `parsePacketHeader`
  (`scripts/implementation-packets.mjs`) anchors the status row at end-of-line (J-TEWF1B-1).
- **Provenance:** implemented by lane **TE-CH-5**. The vocabulary car of the catalog-hygiene
  train, after `MF-CH1` and `MF-CH2A` (both LANDED at this base) and beside `MF-CH3` (DRAFT).
- **Charter and rulings:** **ODQ §541**, which ruled **SHAPE F** over the four shapes
  `MF-CH2B` §0.0 put to the chair and the six the CH-5 prep lane measured. Classified a
  **REPAIR** — chair-ruled, not owner-gated. Every figure below is **re-derived at this base**
  by execution; where the prep lane's figure at the older base `79b78881c` is reproduced
  exactly, that is stated rather than carried.
- **Family preamble:** `docs/implementation/preambles/MF-PREAMBLE.md`, SHA-256
  `0706aad6a84e4f74ec47602e9e3222fc398c4c8864bb38c79ac480c2a11db4ed`.

---

## §0 · THE ONE SENTENCE

`ARCANE_INST_TAGS` answers exactly one question — **"does this institution need magic to
exist?"** — and it was carrying `alchemy`, which names a chemical trade. A member of that list
does not merely mis-label a row: every reader of the list (the generation **world law**'s
`carriesExplicitMagicMetadata`, `magicFilter`'s catalog and service filters, the faction-boost
eligibility filter, and the authored-arcane verdict) is deciding whether a candidate may stand
in a **magic-free world**. A trade word in a dependence list therefore **deletes that trade
from every magic-free world**.

This car moves `alchemy` — and only `alchemy` — into a sibling `TRADE_INST_TAGS` in the same
zero-import leaf, and then deletes the now-redundant `arcane` tag from the three
`magicLicense: 'none'` rows that carried it, so **tag and licence agree in the DATA rather than
being ordered by a precedence rule**.

## §0.1 · WHY ONE MEMBER AND NOT TWO — four authorities, none of them this lane's

| authority | `arcane` | `planar` | `enchanting` | `alchemy` |
|---|:--:|:--:|:--:|:--:|
| `textAssertsFunctionalMagic` — the world law's own prose detector (`src/domain/magicAssertionText.js`) | yes | yes | yes | **NO** |
| the `arcane` row of `INSTITUTION_KEYWORD_TAGS` (`src/lib/entities.js`) | yes | — | yes (`enchant`) | **NO — there is no `alchem` stem** |
| the carrying rows' own `magicLicense` | — | `high`, `high` | `high` | **`none`, `none`** |
| `entityTags.js`'s own sectioning | "Knowledge + magic" | the A+ P1.6 trade block | the trade block | **the trade block, beside METALWORK / LEATHER / TEXTILE** |

`planar` and `enchanting` name practices that cannot exist without magic, and both of their rows
are licensed `high`. The defect is **one member wide**. The packet's own option 2 took
`enchanting` out as well; that would leave `isArcaneInstitution({tags:['enchanting']})` reading
mundane, which is simply wrong, and `tests/domain/arcaneIdentity.test.js` says so.

## §1 · WHAT CHANGED

| file | change |
|---|---|
| `src/domain/arcaneInstitutionVocabulary.js` | `ARCANE_INST_TAGS = ['arcane','planar','enchanting']`; new `TRADE_INST_TAGS = ['alchemy']`; a header stating which question each list answers and the rule a NEW member is filed by |
| `src/domain/npcProfile.js` | `POWER_DOMAIN_TAGS.arcane` becomes `[...ARCANE_INST_TAGS, ...TRADE_INST_TAGS]` |
| `src/data/institutionalCatalog.js` | `Alchemist shop` → `['alchemy']`, `Alchemist quarter` → `['alchemy']`, `Warden's Lodge` → `['military']` |

### §1.1 · ⛔ THE SECOND FILE IS NOT OPTIONAL, and it is the thing a vocabulary split gets wrong

`npcProfile.js` held a **hand-typed duplicate of all four members** —
`arcane: ['arcane', 'alchemy', 'planar', 'enchanting']` — inside `POWER_DOMAIN_TAGS`. That is a
**fifth typing** of a list whose zero-import leaf exists precisely to stop such drift, and a
split that edited only the canonical list would have shipped a silent divergence between the two.

The site does a legitimately **different** job. Power-domain affinity asks a **third** question —
*"which power does this institution belong to?"* — and an alchemist genuinely belongs to the
arcane power whether or not alchemy needs magic to exist. So the row **keeps all four members**,
but it now **spreads both lists** instead of retyping them. Order is irrelevant there: the
consumer is `tags.includes(t)` in `institutionsForPower`, a membership test.

⚠ The edge this adds is `npcProfile.js → arcaneInstitutionVocabulary.js`. The leaf has **zero
imports**, so it cannot be one end of a cycle — which is the whole reason that leaf was carved
out (lane BT, 2026-08-03, the `Cannot access 'Ot' before initialization` boot crash).

## §2 · THE DECLARED SHIFT — 187 of 525, and ZERO rosters

**TOTALITY CONTROL, which licenses every count below.** The measuring harness regenerates all
**525** committed golden-master hashes at this base with **0 mismatches**, so "187" is a count
over the whole corpus and not a sample of it. It is the real engine driven through
`generateSettlementPipeline`, not a model of it.

| | golden 525: hashes / rosters | sweep 2,555: hashes / rosters |
|---|---|---|
| **the vocabulary split ALONE** | **0 / 0** | **0 / 0** — 0 in all five magic cases |
| **the whole car** | **187 / 0** | **409 / 0** |

**The split half is FREE, and that was measured separately rather than assumed** — both
alchemy-carrying rows also carried `arcane`, so moving the member between the two lists changes
no verdict anywhere. Every moved hash is bought by the three-row DATA edit.

**Where it lands, and where it does not.** Over the 511-row grid × five magic cases:

| magic case | hashes moved of 511 | rosters moved |
|---|---:|---:|
| `magicExists:false` | **0** | 0 |
| `priorityMagic:0` | **0** | 0 |
| `priorityMagic:20` | **0** | 0 |
| `priorityMagic:50` | 174 | 0 |
| `priorityMagic:80` | 235 | 0 |

A magic-free world and a low-magic world are **byte-identical to before** — which is exactly the
region `MF-CH2B` is about, so the two cars do not interfere.

### §2.1 · The complete path-template census — ten templates, two families, zero key-order moves

Taken over the 511-row grid at `priorityMagic: 80` (where 235 rows move), deep-diffed field by
field with array indices collapsed to `[*]`:

```
264 /  235 rows   $.simulationTrace[*].downstreamEffects.length            [lenmove]
264 /  235 rows   $.simulationTrace[*].downstreamEffects[*].target|.effect [removed]
192 /  163 rows   $.institutions[*].tags[*] and .tags.length
150 /  150 rows   $.defenseProfile.institutions.magicDef[*].tags[*] and .tags.length
 10 /   10 rows   $.simulationTrace[*].downstreamEffects[*].target         [changed]
```

**Family one is the tag string leaving.** **Family two is the ONE effect it drove** —
`{ target: 'magicCapacity', effect: 'reinforced' }`, emitted by `tagsToDownstream`
(`src/generators/steps/assembleInstitutions.js`), which its own docstring calls a light
heuristic and which feeds nothing but the trace. The 10 `changed` rows are `Warden's Lodge`,
whose surviving tag re-points the effect from `tag.arcane` to `tag.military`.

**No capacity, economy, magic-profile, count, name, id or rng draw moves anywhere**, there are
**zero key-order moves**, and **zero rows are added or removed**. The alchemist simply stops
being *reported* as reinforcing magic capacity, which is the correct reading once the estate has
ruled that alchemy is chemistry.

### §2.2 · THE PROMISE

Institution tags are **stamped at generation and persisted**; no store, migration or rehydration
path re-reads `institutionalCatalog` (verified: no importer of it under `src/store`,
`src/application` or `src/kernel`). A saved world keeps its stored tags and is untouched. Only
NEWLY generated worlds differ — so **two worlds generated either side of this car will disagree
about the same institution**, and that is what THE PROMISE requires rather than a defect. THE
PROMISE protects lived history; it does not freeze the generator's future output, or no defect in
generation could ever be repaired.

## §3 · THE CATALOG VERDICTS THAT MOVE

| measure over the 276 distinct catalog names | base | after |
|---|---:|---:|
| names carrying an `ARCANE_INST_TAGS` member | 21 | **18** |
| names passing `magicForms`' ARCANE GATE (`institutionHasTag(TAG.ARCANE)`) | 20 | **17** |
| `magicLicense: 'none'` names passing that gate | 3 | **0 of 6** |
| **tag-vs-licence divergences** | **4** | **1** |

The single survivor moves the **other** way and is deliberately left standing:
`Healer (divine, 1st level)` is tagged `['divine','healing']` and licensed `low`, so the licence
pulls it ONTO the arcane side — meaning a magic-free world can hold no divine healer. That is a
live **deity-doctrine** question ("faith is culture, never theological") and it belongs to the
car that owns it, not to this one. This car does not touch `ARCANE_INST_KW`, that row, or its
licence, and neither improves nor worsens it.

## §4 · THE TEST BILL, AND WHY THE WALKER GOING RED IS THE WALKER WORKING

| test | what moved | why |
|---|---|---|
| `tests/lint/magicLicenceCensus.walker.test.js` A5 | the divergence roster **4 → 1**, and the arm title with it | that walker was built to make this statement mandatory; the roster shrinking is the divergence being REMOVED, not an alarm being deleted |
| `tests/lint/magicLicenceCensus.walker.test.js` A8 | the three names now answer MUNDANE, **plus a new ANCHOR** | see below |
| `tests/lint/arcaneClassifierCensus.walker.test.js` | `npcProfile.js:333 → :334` and `:374 → :375` | ADDRESS ROT from this car's one added import line, the same form as the recorded `factionRoles.js:57 → 58` re-point. The pattern text is byte-identical and both sites stay recorded |
| `tests/domain/institutionsForPower.test.js` | a NEW PIN for the union (no new `it()`) | nothing previously held `POWER_DOMAIN_TAGS.arcane` |
| `tests/property/generatorGoldenMaster.test.js` + its fixture | the declared re-record, with its SHIFT RECORD row | §2 |
| `tests/domain/arcaneIdentity.test.js` | **unmoved** | its `tags:['enchanting']` row stays arcane because this car keeps `enchanting` |
| `tests/lint/facetInferenceHonesty.walker.test.js` | **unmoved** | it pins `Warden's Lodge` on a `/den/` NAME regex, not on the tag |

**A8's ANCHOR is the point of that arm, and it is new.** A8 exists to notice if someone routes
the user-authored-name surface through the licence. This car did not do that — it changed the
DATA. So A8 now also asserts that `Enchanter's shop` and `Planar embassy` still answer ARCANE:
a licence-routed reader would additionally have moved `Healer (divine, 1st level)` to ARCANE, and
it is still MUNDANE below. Those two facts together tell "the data changed" apart from "the
reader was re-routed", which the flipped expectations alone could not.

## §5 · ONE BEHAVIOURAL DELTA THAT SHIPS NOTHING, STATED BECAUSE IT IS REAL

`magicForms`' ladder reads the literal `arcane` tag through `institutionHasTag`, so over the
ladder's own 144-settlement corpus the high-magic half holding at least one form goes
**77 → 69 of 120**. `magicForms.js` has **no `src/` importer** at this base — its only importers
are `magicFormsPractitioner.js` and `magicRegimeLifecycle.js`, themselves unimported, and
`subsystemRowsWaves.js` names it only inside a `module:` *string* — so no shipped byte moves, and
that delta appears in none of §2's hashes. Whoever wires K2 re-prices it at that moment.

## §6 · ⛔ WHAT THIS CAR DOES **NOT** DO FOR `MF-CH2B`, measured rather than assumed

The dispatch expected this ruling to turn `MF-CH2B`'s STOP arm from red to green.
**At this base that arm was already green before this car, and green non-vacuously.**

`tests/domain/magicForms.test.js` — *a `none`-magic world holds NO magic form anywhere in the
corpus* — was driven with the arm's own seeds at **three** bases:

| base | dark rows | dark rows holding a form | dark rows holding one of the three names | ANCHOR: high-magic rows holding a form |
|---|---:|---:|---:|---:|
| `79b78881c` (before `MF-CH2B` landed) | 24 | 0 | 0 | 77 of 120 |
| `86794b5d2` (`MF-CH2B`'s own landing) | 24 | 0 | 0 | 77 of 120 |
| `510c51b76` (this base) | 24 | 0 | 0 | 77 of 120 |

And all four of the reds `MF-CH2B` §0.0 declares as its own — `magicForms`,
`powerEconomyFreshness`, `intentAtlasSoakDistiller` and `effectReachability.coverage` — **pass at
this base before this car**: 4 files, 62 tests, all green in a clean detached worktree at
`510c51b76`. The STOP recorded in that packet was measured at its build tip `b2852ccc3` and does
not reproduce anywhere in the landing chain.

**So this car removes the CAUSE the STOP named — the three `none`-licensed rows no longer pass
the ARCANE GATE at all (§3) — but it is not what makes that arm green, and it must not be
credited with it.**

⚠ **AND THE THREE-PLACE FLIP IS NOT AVAILABLE.** `MF-CH2B` has **no `PACKET_MANIFEST.json` entry
and no `INDEX.md` row**: it is an orphan packet file whose `Status: DRAFT` has exactly one home.
`scripts/implementation-packets.mjs` only reaches packets the manifest lists, so it never sees
that file. Leaving DRAFT is therefore a **MINT**, not a flip — a landing act on TE-CH-2's car,
which would require certifying its nine acceptance arms and re-stamping its `verifiedBase`. This
lane did neither and did not touch that packet. §8 hands it back.

## §7 · ACCEPTANCE

| # | claim |
|---|---|
| **A1** | The measuring harness reproduces all **525** committed golden hashes at the parent, **0 mismatches** — the totality control that licenses every count. |
| **A2** | The vocabulary split alone moves **0 of 525** golden hashes and **0 of 2,555** sweep hashes, in all five magic cases. |
| **A3** | The whole car moves **187 of 525** golden hashes and **ZERO** rosters; the re-recorded fixture is 525 rows with 0 added, 0 removed, key order identical, cross-checked against an independently computed manifest at **0 mismatches**. |
| **A4** | Over 2,555 same-seed settlements: 409 hashes, **0 rosters**, and **0 in `magicExists:false`, `priorityMagic:0` and `priorityMagic:20`**. |
| **A5** | The complete differing path-template census at `priorityMagic:80` is **ten templates in two families**, with **0 key-order moves** and **0 rows added or removed**. |
| **A6** | All six `magicLicense: 'none'` catalog names fail `magicForms`' ARCANE GATE (base: three passed); tag-vs-licence divergences go **4 → 1**. |
| **A7** | `POWER_DOMAIN_TAGS.arcane` is the spread of both lists and a pin holds it — both of the pin's rows sit OUTSIDE the arcane NAME hint and carry no `factionSource`, so only the TAG path can reach them. |
| **A8** | Every pin above is proved live by a deliberate mutation, each verified applied, each restored cmp-exact, with a clean control green before the first and after the last. |

### §7.1 · The mutants

| # | mutation | reds |
|---|---|---|
| CLEAN1 | — | 22 passed (22) |
| M1 | `alchemy` back in `ARCANE_INST_TAGS` | A5 + A8 of the licence census |
| M2 | the `arcane` tag back on `Alchemist shop` | A5 + A8 of the licence census |
| M3 | one line added above `npcProfile.js`'s import | both `arcaneClassifierCensus` arms |
| M4 | the `TRADE_INST_TAGS` spread dropped from `POWER_DOMAIN_TAGS.arcane` | the new union pin |
| CLEAN2 | — | 22 passed (22) |

The golden fixture's own pin was proved live by execution rather than by a plant: *every config
produces byte-identical output to the golden master* failed at this car's edits and passes after
the declared re-record.

## §8 · NOT THIS CAR — handed on rather than re-found

1. **⚠⚠ `ARCANE_INST_KW` bans the divine healer from a magic-free world, and that is live at this
   base.** The keyword list carries `'healer (divine'`, `'divine healer'`, `'druid circle'` and
   `'elder grove'`, and `MF-CH2A` landed `magicLicense: 'low'` on `Healer (divine, 1st level)`
   (tags `['divine','healing']`, `priorityCategory: 'religion'`). Under DEITY DOCTRINE that is a
   theological ruling: it says the god's healing was functional magic. **Not introduced here and
   not touched here** — it is CH-6's.
2. **`MF-CH2B` needs a MINT, not a flip** (§6), and the three reds its §0.0 leaves to the chair
   to price are green at this base, which changes what that mint costs.
3. **`npcProfile.js` holds still more duplicated vocabulary.** Beyond the four-member list this
   car derived, the file carries **two byte-identical copies** of an arcane NAME regex
   (`/mage|wizard|college|alchemist|library|laboratory|tower|sanctum/i` at `:334` and `:375`) —
   a fork of a fork, both recorded UNCONVERTED in `arcaneClassifierCensus`, and a **seventh**
   arcane spelling in the estate. The chair also reports a bare `den` regex at the same two
   sites that CH-1's cure did not travel to. This car moved their line numbers and nothing else.
4. **`CH2B`'s `allowsMagicClaim` allowlist should read `[...ARCANE_INST_TAGS, ...TRADE_INST_TAGS]`.**
   No live hazard — `textAssertsFunctionalMagic('alchemy')` is already false — but the cure's
   principle is "a bucket name is not a sentence", which is true of every tag, so the union covers
   the next trade tag that happens to be a prose word by construction rather than by luck.
5. **A second, parallel tag vocabulary.** `src/data/geographyData.js` declares
   `ARCANE`/`ALCHEMY`/`ENCHANTING`/`PLANAR` alongside `src/data/entityTags.js`'s `TAG` — two
   spellings of the canonical vocabulary, either of which can drift from the other.
6. **Dependence is not participation.** `magicLicense` answers *"does this need magic to exist?"*;
   the forms ladder asks *"is this a realization of the world's magic?"*. Nothing in the catalog
   answers the second, and sooner or later the ladder needs its own authored field rather than a
   borrowed one.
