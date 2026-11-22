# REGRESS · what became of each flagged sentence between two renders

`regress.py <base-render> <new-render> <flags.json> [--sev MED,HIGH] [--verdict STANDS] [--list]`

A render directory holds `dumps/<town>.txt` (the page-reading copy's output: `docs/chair/2026-11-16/probes/PAGE-COPY`).
A flags file is a JSON list of rows with `town` and `text` (and, where present, `sev`, `id`, `verdict`): the wide read's
`docs/chair/2026-11-16/review-wide-6/SECOND-CHECK.final221.json`, or the bar read's
`docs/chair/2026-11-16/review-bar-5/SECOND-CHECK.final72.json`.

For each row the tool finds the page lines that hold the row's folded text at the base and at the new render:

- `SAME`: the same lines hold it: the sentence prints as it did.
- `CHANGED`: lines still hold it but they are not the base's lines (a mark was added before it, the line re-worded round
  it): READ THEM (`--list` prints them).
- `GONE`: no line holds it now.
- `NOBASE`: the base did not hold it as quoted: not counted.

THE USE: after a round of cures is joined, render the SAME towns at the joined tree and count, without a reader, which
standing sentences are gone. It measures what a round cleared of rows its builders never saw.

PROVEN (2026-11-16): the wide read's 126 MED rows of its first 41 packets against their own render: SAME 126; the bar
read's 41 standing rows against their own render (bb60c1a0a): SAME 41; the same 41 from bb60c1a0a to the line's tip
600b7683a: SAME 41, CHANGED 0, GONE 0 (the tip's only page changes are thirteen sawmill marks).

A LIMIT: a sentence whose FAULT is a missing mark is CHANGED, not GONE, when the mark arrives: read the new line.
