# DCS / DCS-1 — the four absent PACKET_STANDARD law texts (member 1 of `dcs`)

- **Status:** LANDED
- **Verified base:** `claude/composite-r4` at `b49a7daf86d6f7d27eaa685b7e52ea16edbc4bf4`
  (the `dom` terminal; the micro-batch's dispatch base)
- **Train:** `dcs`, family **DCS**, member **1** of 2. Its change path is disjoint from DCS-2's
  two volume files, so both members promote together.
- **Preamble:** none — DCS is its own family.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§101.4** (the `requiredSymbols` defect docketed
  with executed evidence) · **§102.3** (J-TE17-10 ratified and made law) · **§103.2** (the
  ungated-persistence rule, estate-wide from that section forward) · **§104.4** (the
  bundle-closure law minted) · **§137** (this micro-batch's stacking authorization).
- **Compile of record:** `laneTC23-MICRO-PLAN.md` §3.5.

---

## §1 · WHY THIS MEMBER EXISTS

Four rulings were signed into the queue and never reached the standard that packets are
actually written against. A law that lives only in a queue section is a law every future
compile has to rediscover, and three of these four were rediscovered the expensive way —
at a terminal, inside a train that was otherwise proven.

The compile measured the gap rather than assuming it. Of the five texts the dispatch named,
exactly **one** (§95.2, the census-burn law) is already present at `PACKET_STANDARD.md`
`:299-313` with its authority cited. It is **not re-landed and not re-worded**. The other four
are absent:

| law | measured state at this base |
|---|---|
| §101.4 | the DEFECTIVE wording is live — `requiredSymbols` "preserves **or creates**" |
| §102.3 | the "Registration obligations" section enumerates a flag mint and a seeded-chooser mint ONLY |
| §103.2 | zero occurrences anywhere in the file |
| §104.4 | present only as a FLAG-MINT-SCOPED clause naming `simulationRules.js` |

## §2 · WHAT LANDS

**§101.4 — the `requiredSymbols` cure.** The defective sentence is replaced. The validator
resolves `requiredSymbols` against the live tree at every status
(`scripts/implementation-packets.mjs:574-581`, unconditional), so a `READY` packet naming a
symbol its deliverable has yet to write cannot pass its own promotion commit. The replacement
states the rule the estate already practises — promotion names what is PRESERVED, the flip adds
what was CREATED — and cites its authority.

**§102.3 — the third mint class.** A new `tests/lint/` file owes its mutation-coverage row,
priced at compile. `tests/lint` is one of the directories `tests/lint/mutationCoverage.shared.mjs`
enumerates, and `tests/lint/mutationCoverageManifest.test.js` asserts every enumerated file owns
an `invariants` entry in `scripts/mutation-coverage-manifest.json`. The never-re-serialise rule
for that manifest rides with it.

**§103.2 — ungated persistence.** Its own section. An arm that normalizes or cleans PERSISTED
state runs unconditionally; gating persistence hygiene behind a flag is the fail-OPEN direction.
The section carries the preflight question the law reduces to.

**§104.4 — bundle closures, generalised.** Its own section. The trigger is membership of an
edge-shared bundle closure, never the identity of one file. The existing flag-mint-scoped clause
is left where it is and is named as the narrow case.

## §3 · SCOPE AND BOUNDARY

This member edits ONE file and creates none. It lands four law texts and cures one defective
sentence. It does not touch §95.2. It does not renumber, reorder or re-word any other section,
and it adds no figure of any kind — the standard carries no per-wave numbers by its own rule.

## §4 · THE STANDING DOCS HAZARD THIS MEMBER MUST CLEAR

⛔ Naked-claim debt is PER CLAIM since `32f4e520`. A new claim in any `docs/**.md` mints a NEW
key in `tests/docs/enforcement-claims.test.js` and reds a test that is GREEN today, which the
ratchet cannot absorb. Every added body line is screened with the file's own live `CLAIM_RE`
before the commit — the exact regex, not a paraphrase. Two of its alternatives are traps: the
zero-problem spelling matches INSIDE a thirty-problem sentence, and the verb pair for a red gate
is safe only in its "reds" form, never its "f-word" form.

## §5 · ACCEPTANCE

| id | case |
|---|---|
| A1 | `PACKET_STANDARD.md` carries §101.4's cure, and the string "preserves or creates" is gone |
| A2 | the "Registration obligations" section enumerates THREE mint classes, the third being the `tests/lint/` coverage row |
| A3 | an "Ungated persistence" section exists and states the unconditional rule with its authority |
| A4 | an "Edge-shared bundle closures" section exists, generalises the law past `simulationRules.js`, and names the narrow clause |
| A5 | §95.2's census-burn text is byte-unchanged |
| A6 | the exact live `CLAIM_RE` finds zero matches across every added body line |

## §6 · CHECKS

```
npx vitest run tests/docs/enforcement-claims.test.js tests/docs/docCounts.test.js \
  tests/docs/enforcedByExists.test.js tests/scripts/implementationSession.test.js
node scripts/implementation-packets.mjs validate
```

## §7 · MUTANTS AND HAZARDS

- **The vocabulary mutant.** Re-writing any added line with the forbidden verb in place of
  "reds the gate" mints a new naked-claim key and reds a green test. Screened mechanically by
  running the live regex over the added lines, never by eye.
- **The re-land mutant.** Adding a second §95.2 body would duplicate a law and leave two
  wordings to drift apart. The measured state says it is present; it stays untouched.
- **Hazard: the standard is read by the capsule generator.** `scripts/base-state-capsule.mjs`
  parses this file's "Hot files" table for ceilings. No section this member adds sits inside
  that table, and the table is not touched.
