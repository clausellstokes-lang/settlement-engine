# K2 PROOF: THE OLD NAME LEAVES THE STORED SENTENCES

RENAME-BUILD, 2026-11-28. Base: 5ad631588 (with K1).

**The commits**
- 0acc29494: the store test, RED on the base, 3 of 3.
- ee6fe4dc6: the cure (`src/domain/townRename.js` and its three writers).
- 29c9aa139, then f7649f61e: the AI narrative (the chair's ruling K2-1): RED on the base, then the cure.
- 8bfe1a5f9: the case of a name the DM typed (K2-1 (iv)).

**The measure:** `M3-K2-stored.md`. Every count below is a script's (CONFIRMED).

**The harnesses**
- `tools/k2-harness.jsx`: each birth is renamed to "Quillmarsh" by `renameTownInRecord` (the one writer the store's rename, the unsaved rename and the detail copy all call), then renamed back. Every view is walked as the app renders it: the tabs, the PDF composers, Foundry and Tonight.
- `tools/f3-harness.jsx`: every stored string leaf after the rename, and the shared page.

## The proofs

| proof | C | V |
|---|---|---|
| births (the first 300 of each corpus, every size) | 300, 0 errors | 300, 0 errors |
| pages still printing the old name after the rename, any view (`tools/analyze-k2.mjs`) | **0** (0 lines) | **0** (0 lines) |
| a rename back: pages not byte for byte | **0** | **0** |
| a rename back: records not byte for byte (K2-1 (i), asked on 200) | **0 of 300** | **0 of 300** |
| another stored name changed (people, houses, powers, quarters, neighbours) | **0** | **0** |
| lines moved otherwise than by the name (`tools/analyze-k2-else.mjs`) | 3 pages, explained below | 1 page, explained below |
| (ii) every stored home of the 1,800 after the rename holds the old name nowhere; the receipt unchanged | see F3 below | |
| (iii) the shared page of a renamed, re-saved town | see F3 below | |

**What the lines moved count.** These are lines moved otherwise than by the old name put to the new by whole word. A line where the page glues the name to the next word ("Linyuanthorp", 600 lines on each corpus) is counted as moved by the name. The pages left:
- **C, dp-thorp-21 Ögedeidavan and dp-hamlet-49 Ögedeikum:** the desk lines a name opening on "Ö" loses (the defect sent to the chair at the K1 TIP: `properFill`'s ASCII `/^[A-Z]/`) come back under "Quillmarsh". They are K1's two pages, and not a K2 move.
- **C and V, dp-thorp-148 Qal'atoasis:** Foundry prints the apostrophe as `&#39;`. Unescaped, the line is the name substitution, so the count is my analyser's, not a move.

## The cases (`tests/domain/townRename.test.js`, `tests/store/townRenameCascade.test.js`)

- the four homes and the `stressors` mirror, a possessive included; nothing else touched;
- a crisis list;
- "Fordham" and "salt" left alone;
- THE MASKED CASE ("Ford Abbey", "Ana Ford");
- THE DO-NOTHING CASE (the old name IS a house's name: only `name` changes);
- Unicode, hyphenated and multi-word names;
- a rename back, a no-op and a blank name;
- (iv) a DM-typed note or an edited description is not rewritten;
- the saved town, the unsaved town and the detail copy (born towns of every size);
- the AI narrative handed to `applyCosmeticRename` once, and not for a no-op.
