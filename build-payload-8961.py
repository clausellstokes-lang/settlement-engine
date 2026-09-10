# -*- coding: utf-8 -*-
import io, json
SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad'
row = u"""
§896.1 · **THE FABLE SEAT RULES TWENTY-EIGHT ROWS OF THE §892 RETROVALIDATION WALK FROM THE SEALED EVIDENCE.** The walk is COMPLETE on disk — twenty of twenty slices, **575 calls: 423 RATIFY · 123 AMEND · 13 REVERSE · 8 EVIDENCE-THIN · 8 OUT-OF-SCOPE** — restored from `refs/preserve/sitting-892-kit-2026-09-04d` after the scratchpad cull took the working copies. Thirteen rows already carried a `*RULED (§892, Fable 5.1)*` paragraph from the §892 sitting; **twenty-eight walked rows did not**, because the Fable seat's window closed before it could write them and an Opus seat may not (§892.1). This act writes them as `*RULED (§892.x, Fable 5.1):*` paragraphs at the end of each row's block, through `apply-rulings.py`, which asserts every anchor resolves exactly once and every ruling lands exactly once. **What a ruling IS here:** the verdict tally for the row, every AMEND / REVERSE / EVIDENCE-THIN call named by its claim and its receipt, and the slice ids so a reader can open the evidence by call. **What it is NOT:** a re-execution — ⛔ the Fable seat re-derived the VERDICTS from the sealed evidence and did not re-run the probes, so every EVIDENCE-THIN call stays PLAUSIBLE, not CONFIRMED, until re-executed against the current tree, and each ruling says so on the row. The fourteen lane-local ids the slices used (S05-1…17, the P0 sweep's A1…F4, S20's five lane names, `R-T13L-12`) **roll up under their parent rows** §882.13 · §882.15b · §892.1 · §892.2 rather than minting rows of their own. Every anchor was dry-run against the HEAD queue blob before this act (28 of 28 resolving exactly once). **The rows ruled:** §882.8.1 · §882.9 · §882.10 · §882.11 · §882.12 · §882.14.1 · §882.14.2 · §882.14.3 · §882.15 · §882.15b · §883.1 · §883.2 · §883.3 · §883.4 · §883.5 (a)(b)(c) · §884 · §884.3 · §884.4 · §884.5 · §885 · §885.1 · §885.2 · §885.5 · §885.6 · §885.7 · §885.8 · §886 · §887 · §887.1 · §887.2 · §888 · §889 · §889.1 · §889.3 · §890.1 · §890.2 · §890.3 · §890.4 · §890.5 · §891. ⛔ **Still OWED:** the §892.5 critic (S99 never ran), and a re-execution pass over the 8 EVIDENCE-THIN calls; and R1 → R36 (the Opus-authored rows of §893 → §896) are enrolled, not ruled — those are the next sitting's. (2026-09-05; SEAT: Fable 5.1 — validated)
"""
frq_tail = u"""
## §896.1 — TWENTY-EIGHT ROWS RULED BY THE FABLE SEAT FROM THE SEALED WALK (2026-09-05; SEAT: Fable 5.1 — validated)

The rulings themselves are inline, one `*RULED (§892.x, Fable 5.1):*` paragraph at the end of each of the twenty-eight rows named on the ledger. This section records the method and the residue so the next sitting starts from facts:
- **Method:** verdicts re-derived from `walk/S01…S20.json` (sealed at `sitting-892-kit-2026-09-04d`); AMEND / REVERSE / EVIDENCE-THIN calls named by claim and receipt; RATIFY calls held as recorded. **No probe was re-executed.**
- ⛔ **Residue:** 8 EVIDENCE-THIN calls stay PLAUSIBLE · the §892.5 critic (S99) never ran · the 14 lane-local ids are ruled under their parents.
- ⭐ Every anchor was dry-run against the HEAD blob and resolved exactly once before the act; the writer asserted the same at the act.
"""
card = u"""## ⭐⭐⭐⭐⭐ PICKUP AT §896.1 — **THE §892 WALK IS RULED: 28 rows by the Fable seat, from the sealed evidence, no probe re-executed.** The seat is FABLE 5.1 (Fable chairs, Opus implements). Product `__CAS_SHA__`. Read this, then the §896 card below, then `$SC/RESUME-NOTE.md`.

⛔ **What is NOT ruled and must not be read as ruled:** the 8 EVIDENCE-THIN calls (PLAUSIBLE until re-executed against the current tree) · the §892.5 critic (S99 never ran) · **R1 → R36** — every Opus-authored row from §893 to §896 is ENROLLED, not ruled; that is the next sitting. A Fable trailer on this act certifies the chair's own re-derivation, nothing else.

### ⭐ NEXT, IN ORDER (unchanged from §896's card; §896.1 was the first item)
ANCHORS replay → its census totals → its gate · **OSR-SCHEMA17** (`brief-OSR-SCHEMA17.md`, `model: "opus"`) to free the 23-car desk consist · the desk remainder · clamp waves 2–4 · the lighting wave (31) · W-ARMS (14) · HORIZON-DARK (6) → ⛔ the owner's WALK → the exhaustive review → ⛔ FULL STOP before the soak."""
payload = {
  "odq_marker": u"\n§896.1 ",
  "odq_rows": [row.lstrip('\n')],
  "card_top_heading_prefix": u"## ⭐⭐⭐⭐⭐ PICKUP AT §896",
  "card_demote_from": u"## ⭐⭐⭐⭐⭐ PICKUP AT §896 — ",
  "card_demote_to": u"## (superseded) PICKUP AT §896 — ",
  "card_new_block": card,
  "frq_in": SC + "/queue-8961.ruled.md",
  "frq_tail": frq_tail.lstrip('\n'),
  "frq_out": SC + "/queue-8961.md",
}
io.open(SC+'/payload-8961.template.json','w',encoding='utf-8').write(json.dumps(payload, ensure_ascii=False, indent=1))
t=json.dumps(payload, ensure_ascii=False); print("payload-8961.template.json: %d B, __CAS_SHA__=%d" % (len(t), t.count('__CAS_SHA__')))
