# K2 MEASURE: WHERE A BORN TOWN STORES ITS OWN NAME, AND THE HAZARDS

RENAME-BUILD, 2026-11-28. The base tree is 5ad631588. Every count is a script's (CONFIRMED) unless marked PLAUSIBLE.

- Script: `tools/f2-leaves.jsx`, analysed by `tools/analyze-f2.mjs`. It visits every string leaf of every born record of C and V (900 + 900, every size). A leaf is counted when it holds the town's name as a WHOLE WORD by `substituteWholeWord`'s own Unicode-aware rule.
- It also records three hazards:
  - the name inside a longer word (case folded);
  - the name as a whole word inside another stored NAME (a person's, a house's, a power's, a quarter's, a label);
  - an exact repeat of the name in another field.

## Every stored string field holding the town's name, by path

| path (indices folded) | C: towns (leaves, hits) | V: towns (leaves, hits) |
|---|---|---|
| `arrivalScene` | 889 (889, 1,069) | 883 (883, 1,088) |
| `stress.summary` | 289 (289, 289) | 277 (277, 277) |
| `stressors.summary` (the mirror of `stress`) | 289 | 277 |
| `pressureSentence` | 246 (246, 258) | 293 (293, 307) |
| `stress[].summary` (a second crisis) | 4 (8, 8) | 10 (20, 20) |
| `stressors[].summary` (its mirror) | 4 | 10 |
| `generationCoherenceReceipt.judgments[].findings[].evidence` | 1 | 0 |

- 900 of 900 C births and 893 of 900 V births hold the name in a stored string.
- Larger towns were walked here; RENAME-MEASURE's (F) walked thorps and hamlets only. They add no home: no history event, tension, hook, tradition or person's prose stores the town's name. Those are composed from `settlement.name` at view.

## The hazards, measured, and the rule for each

| hazard | measured on 1,800 births | the rule |
|---|---|---|
| a name inside a longer word ("Ford" in "Fordham") | 0 | Whole-word only (`substituteWholeWord`, Unicode-aware lookarounds: "Ö" and "Á" names match where `\b` does not). "Fordham" is never touched. |
| a possessive ("Linyuan's") | in the homes above (e.g. `pressureSentence`) | Rewritten: the apostrophe is not a word character. |
| a common word as a name ("Salt") | no born name is a common word in these homes | Case-sensitive, and only the homes above are rewritten, never any other field. A lower-case "salt" is never touched. A sentence-initial "Salt" in one of these homes would be. RESIDUAL, named: the homes are composed from a `{name}` slot, so the name appears only where the slot put it (PLAUSIBLE, by reading the generators). |
| the name inside another stored name (a person "Ana Ford", a house "Ford Abbey") | 0 | Masked: every occurrence lying inside another stored proper name of the record (people, houses, powers, quarters, neighbours) is left as it is. |
| the name equal to a person's, a house's or a power's whole name | 0 | The cascade rewrites nothing and only the name changes. "Linyuan" could then be the house as well as the town, and the cascade does not guess. |
| a multi-word name | 0 of 1,800 (every born name is one word); a DM's new name may have several | Matched as one phrase by the same whole-word rule. |
| the new name already in a home (a rename back) | 0 for "Quillmarsh" | A rename back restores the page byte for byte when the new name was absent before; the test holds that on the corpus. |

## What is left alone, and why

- `generationCoherenceReceipt` (1 town): a generation receipt quoting evidence as it was judged at birth. It is a record of the birth and is not printed.
- The share's stamp is re-composed by the persisting save (`supabaseUpdate`), as after any rename.
- THE AI NARRATIVE (`ai_data`, not the record). The town's rename never calls `aiSlice :: applyCosmeticRename`, which the person and power renames do call (RENAME-MEASURE (C), (F)). Not in K2's brief, so NAMED for the chair: the same whole-word cascade is one call away.

## The writer

There is ONE helper, `src/domain/townRename.js :: renameTownInRecord(settlement, oldName, newName)`. It returns the record with `name` and the homes above rewritten by `lib/narrativeMutations.js :: substituteWholeWord` (the helper `applyFactionRenameToSettlement` uses), with the masks above. It is read by:
- `renameSettlementImpl` (the saved row and the active record);
- the unsaved town's rename (`settlementPendingEdits.js`, the same action, T1);
- the saved view's detail copy (`renameDetailSettlement`), so the open page shows what the store holds.
