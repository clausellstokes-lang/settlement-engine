# Historical urbanism evidence registry

This directory is SettlementForge's machine-readable boundary between historical research and
generation law. It stores concise, cited factual claims and their epistemic limits. It does **not**
store traced atlas geometry, copied symbols, map pixels, or a probability distribution over
“medieval towns.”

The current manifest is explicitly `historical-urbanism-wave-1`: an exploratory case registry with
no sampling frame, no sealed holdout and no prevalence eligibility. The binding expansion and
completion requirements live in `../docs/HISTORICAL-EVIDENCE-EXPANSION-PROTOCOL.md`; Wave 1 must
never be relabelled as completed calibration.

## Files

- `manifest.json` registers atlas programs, bounded mechanism ids, any predeclared comparative
  cohorts, and the evidence files that support them.
- `records.json` stores claim-sized evidence records.
- `historical-evidence.schema.json` is the closed record grammar.
- `../docs/historical_evidence_integrity.py` validates schema-critical and cross-record laws.
- `../docs/HISTORICAL-URBANISM-EVIDENCE.md` is the human-readable survey, case matrix, method and
  bibliography.

## Authority and use

One record supports only the uses named in `allowedUses`. A case witness can establish that a
mechanism is historically possible or provide a validation case; it cannot establish prevalence.
`COHORT_STATISTIC` is legal only for a cohort registered before counting with a reproducible
inclusion rule. This initial registry deliberately contains no prevalence cohort and therefore
licenses no frequency tuning.

Runtime generation does not read `records.json`. A reviewed mechanism must first be promoted into
the executable generation manifest with schema/law versions, chronological preconditions and
before/after edges, a registered temporal operation, compiler derivation stages, a typed effect
receipt, counterexamples and a declared activation source. Historical chronology and compiler
dataflow are separate orders. Adding a citation must never silently change every seed.

## Rights boundary

All initial records are `CITATION_ONLY` or `FACT_METADATA_ONLY`. They retain direct official-source
URLs and concise paraphrases. `DIRECT_GEOMETRY_COPY`, `PIXEL_STYLE_COPY`, `UNIVERSAL_RULE`, and
`UNREGISTERED_PREVALENCE_PRIOR` are prohibited on every record. Geometry may enter a future corpus
only under an explicit compatible licence and a separate owner-reviewed ingestion.

## Run

```sh
python3 map-corpus/docs/historical_evidence_integrity.py
python3 map-corpus/docs/corpus_integrity.py
```

Both gates are read-only. The first validates the historical registry; the second validates the
synthetic visual corpus and calls the historical gate so the complete evidence boundary can be
checked with one command.
