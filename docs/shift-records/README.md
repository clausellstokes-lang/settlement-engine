# Shift records — the signed authorizations behind every golden byte

A **shift record** is the file that authorizes one movement of the same-seed golden estate.
Nothing in `tests/fixtures/` that carries a world fingerprint may move without one. This
directory is where they live; `tests/helpers/goldenRecordDoor.js` is the only thing that reads
them, and `tests/lint/goldenFreeze.walker.test.js` is what notices when one is missing.

## Why a file and not an environment variable

Before the freeze, `UPDATE_GOLDEN=1` was the whole armament. That is provenance in shape only:
it leaves nothing in the tree saying who moved the bytes, when, under what authority, or why —
so a re-record taken in haste and a re-record taken with the owner's signature are
indistinguishable a week later. The door therefore does not accept an environment variable as
authorization. `GOLDEN_SHIFT_SIGNED` names a file **in this directory**, and the door reads that
file and verifies its **content**. An env var's presence is not armament; only the parsed record
is.

The honest limit, stated rather than hidden: the machine can verify the record's form, its
completeness, its internal consistency, and that the fixture, the register row and the record all
close in one commit. It cannot verify that the owner truly spoke the words in `ownerWords`. That
half is human by nature — the ODQ §-row the record cites is the authority and the ledger is the
veto surface. What the file buys over the env var is that a forged authorization is a loud,
durable, attributable artifact committed to the repository, rather than a silent line in
somebody's shell history.

## The schema

```jsonc
{
  // The owner's own sentence, verbatim. Not "1", not boilerplate, not a paraphrase —
  // the door refuses blank, whitespace-only, and "1" alike.
  "ownerWords": "…",

  // ISO date of the signature. YYYY-MM-DD; anything else is refused.
  "ownerDate": "2026-09-01",

  // The ODQ row where the signature lives. Must begin with §. This citation is the
  // authority the machine cannot check, which is exactly why it may not be blank.
  "odqRow": "§NNN",

  // ONE cause. One cause per record is the law: a record that authorizes two unrelated
  // movements makes both unattributable when the next drift arrives.
  "cause": "…",

  // The lane or seat executing the write.
  "seat": "…",

  "surfaces": [
    {
      // Must match a `surface` identity in tests/fixtures/.golden-freeze-register.json.
      "surface": "generator-golden-master",

      // re-record | enroll | retire — see THE VERBS below.
      "action": "re-record",

      // Predicted BEFORE the write. If the produced manifest carries a different row
      // count, the door writes NOTHING and prints the actual figure. Predicted-then-held,
      // made a machine-checked field.
      "predictedRows": 525,

      // settlement-hash | derived-artefact | in-file corpus constant.
      // Must equal the register row's proofForm: a map-family surface may not prove
      // with a settlement-record hash.
      "proofForm": "settlement-hash"
    }
  ]
}
```

## The verbs, and their deliberate asymmetry

| verb | who signs | why |
|---|---|---|
| `re-record` | **owner** | bytes a player would see are moving |
| `retire` | **owner** | protection is shrinking, and protection shrinks only by the pen |
| `enroll` | **chair**, vetoably | protection is *growing*; a new instrument's genesis hash is its own provenance |

The asymmetry is the point. Without an `enroll` verb, the first regression golden a walk-found
fix wants to add would have to wait on a signature, and prevention machinery that waits on a
signature does not get built. Without `retire`, the first legitimate suite retirement would hit a
sealed instrument with no lawful way through — a seal that failed to name its lawful traffic, and
seals like that get hand-amended a week later. The schema names the traffic instead.

New **rows** inside an owner-signed surface remain owner-signed even though adding rows only
grows the corpus: the golden corpus is one of the owner's signed surfaces, and its contents are
his.

## Writing one

1. Draft the record here with `predictedRows` filled in **before** running anything. Predicting
   after measuring is not predicting.
2. Get the signature and record the ODQ §-row.
3. Run the capture arm with the record named:

   ```sh
   GOLDEN_SHIFT_SIGNED=docs/shift-records/<file>.json \
     UPDATE_GOLDEN=1 npx vitest run tests/property/<suite>.test.js
   ```

   The tree must be clean apart from the register, the manifest being written, and the record
   itself. In a shared working tree another lane's uncommitted files would otherwise be charged
   to your measurement, and the result would be a figure no checkout can reproduce.

4. **The run fails. That is correct.** A successful write throws by design, printing old → new
   per surface, so a re-record can never be mistaken for a passing gate.
5. Re-run the suite plainly, and run `tests/lint/goldenFreeze.walker.test.js`. **That** green is
   the receipt.
6. Commit the manifest, the register and the record together, with an `Owner-Signed: §NNN`
   trailer.

## What is in here

`_TEMPLATE.json` is a shape to copy, and it is safe by construction: every provenance field is
blank, so the door refuses it. The freeze walker asserts that refusal on every gate run, which
means the template can never quietly become a signature.

Real records are named for their cause and their date, and they are never edited after the fact —
the register pins each one by hash. A record that needs correcting is superseded by a new record
that says so, not overwritten.
