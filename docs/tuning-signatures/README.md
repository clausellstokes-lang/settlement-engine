# Tuning signatures — the owner's record of a signed tuning version

This directory holds one file per signed version of the tuning register:
`docs/tuning-signatures/<date>-v<N>.json`.

It is not `docs/shift-records/`. That directory belongs to the GOLDEN freeze door, which
refuses to hold any record at all while the golden register is unfrozen. A tuning signature
happens before that, so it needs a home of its own.

## What a signature is, and what it is not

A tuning value in this project is the owner's. The register at
`tests/lint/.tuning-register.json` measures and describes the tuning estate — which tables
exist, what unit each key carries, which ids name one dial — and every row of it lands
`draft`. Nothing in the engine, and no lane, may write `signed`.

A signature is therefore a record of an act the owner performed at the tuning sitting: these
ids, at these values, on this date, in these words, against this decision-queue row. The
record is the input; the register's `signatures[]` entry is derived from it.

Signing freezes the measured `spanDigest` of each named table at the moment of signing. If a
signed value later moves, that is not an edit — it is version N+1, with its own record.

`@enforced-by tests/lint/tuningRegister.walker.test.js`

## Writing one

Copy `_TEMPLATE.json` and fill every field. The template ships blank on purpose: the walker
keeps a live subject to refuse, so the blank file must never be a valid record.

```json
{
  "ownerWords": "the owner's own sentence about what was decided and why",
  "ownerDate": "2026-09-30",
  "odqRow": "§NNN.N",
  "seat": "owner",
  "version": 1,
  "ids": ["src/domain/worldPulse/npcGrowthKernel.js#GROWTH_TUNING"],
  "note": "anything the next reader needs that the words above do not carry"
}
```

Then run the ritual, naming the record:

```
TUNING_INVENTORY_REFREEZE='<seat>' TUNING_INVENTORY_NOTE='<why it moved>' \
  TUNING_SIGNATURE_RECORD=docs/tuning-signatures/<date>-v<N>.json \
  npx vitest run tests/lint/tuningRegister.walker.test.js
```

The run reports failure when it writes. That is deliberate, and it is the same convention
the lighting census uses: a mode that rewrote a register and also reported green could
disarm the guard it belongs to for a whole run. The proof is a separate, ordinary run
afterwards, and that green is the receipt.

`@enforced-by tests/lint/tuningRegister.walker.test.js`

## What a record is refused for

Each of these is a protection for the owner rather than a formality, and each is driven by a
paired positive control so the check cannot pass by refusing everything.

| refused when | why |
|---|---|
| any of `ownerWords`, `ownerDate`, `odqRow`, `seat` is blank | the owner's words are the record; a record nobody can attribute is not one |
| `version` is not exactly one past the register's | versions are dense from 1, so a signature cannot sit in a gap or be written twice at one number |
| an id has no declared row, or no measured table | a record cannot sign a table nobody registered |
| an id carries no unit | signing a value whose meaning nobody wrote down signs a number, not a decision |
| an id is module-side | the owner ruled that no map constant is launch tuning; the register may index them, the sitting does not sign them |
| a signed table's digest has moved and no record names that id | a retune of a signed value is version N+1 through this door, never an edit |

A record signs exactly the ids it names and never one more. When any id in a record is
refused, the whole write is refused: the signing path is a pure function returning a new
register, so there is no partial state it could leave behind.

`@enforced-by tests/lint/tuningRegister.walker.test.js`

## The desk sheet

`node scripts/count-tuning-inventory.mjs --desk` prints the sitting's sheet: every draft
table with its unit, its live values, how many modules read it, and which role it belongs
to, roster-first. Module-side ids are excluded from it and counted on their own line.
