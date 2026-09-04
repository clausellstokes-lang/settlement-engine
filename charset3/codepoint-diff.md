# CHARSET3 — the three-way codepoint diff

Read from the dock at HEAD `1223489c9`. Every figure below is an executed measurement;
`measure-output.txt`, `names-output.txt` and `repair-sim-output.txt` in this directory are
the raw receipts.

## Scope note — there are TWO renderers, and only one of them strips

| surface | renderer | drawable set | sanitiser applied |
|---|---|---|---|
| `web-display` | React DOM | unbounded | none |
| `dossier-pdf` | `@react-pdf/renderer`, 8 embedded TTFs | **759 codepoints** (fontkit intersection) | `safe()` in `src/pdf/lib/format.js` is **IDENTITY** |
| `campaign-pdf` | jsPDF 4.2.1, standard-14 Helvetica | **218 codepoints** (ASCII + Latin-1 + 27 WinAnsi extras) | `sanitizeJsPdfText` → admits **190** |
| `world-book` | jsPDF 4.2.1, standard-14 Helvetica | **218 codepoints** | `sanitizeJsPdfText` → admits **190** |
| `foundry` / `json-export` | n/a | unbounded | none |

The whole defect lives in one place: `src/utils/jsPdfText.js:27`. There is exactly one
character-class sanitiser over rendered prose in `src/` — every other negated-class
`replace()` in `src/` builds a slug or an id, not displayed text.

---

## BUCKET 1 — STRIPPED BUT DRAWABLE (the repair set): **27 codepoints**

Every one of these is in jsPDF's own runtime `WinAnsiEncoding` map, so the shipped encoder
has a byte for it, and every one is also in the dossier fonts' 759-codepoint intersection.
The claimed 27 is **exact**.

| # | codepoint | char | WinAnsi byte | in dossier fonts |
|---|---|---|---|---|
| 1 | U+0152 | Œ | 0x8C | yes |
| 2 | U+0153 | œ | 0x9C | yes |
| 3 | U+0160 | Š | 0x8A | yes |
| 4 | U+0161 | š | 0x9A | yes |
| 5 | U+0178 | Ÿ | 0x9F | yes |
| 6 | U+017D | Ž | 0x8E | yes |
| 7 | U+017E | ž | 0x9E | yes |
| 8 | U+0192 | ƒ | 0x83 | yes |
| 9 | U+02C6 | ˆ | 0x88 | yes |
| 10 | U+02DC | ˜ | 0x98 | yes |
| 11 | U+2013 | – | 0x96 | yes |
| 12 | U+2014 | — | 0x97 | yes |
| 13 | U+2018 | ' | 0x91 | yes |
| 14 | U+2019 | ' | 0x92 | yes |
| 15 | U+201A | ‚ | 0x82 | yes |
| 16 | U+201C | " | 0x93 | yes |
| 17 | U+201D | " | 0x94 | yes |
| 18 | U+201E | „ | 0x84 | yes |
| 19 | U+2020 | † | 0x86 | yes |
| 20 | U+2021 | ‡ | 0x87 | yes |
| 21 | U+2022 | • | 0x95 | yes |
| 22 | U+2026 | … | 0x85 | yes |
| 23 | U+2030 | ‰ | 0x89 | yes |
| 24 | U+2039 | ‹ | 0x8B | yes |
| 25 | U+203A | › | 0x9B | yes |
| 26 | U+20AC | € | 0x80 | yes |
| 27 | U+2122 | ™ | 0x99 | yes |

Only **two** of the 27 are letters that appear in the shipped name pools: U+0161 š and
U+017E ž. The other 25 are typographic punctuation, currency and two spacing modifiers.

### The 28th, and why it is NOT in the repair set

U+00A0 NBSP is also stripped-yet-encodable (WinAnsi 0xA0), which makes the raw
set-difference **28**. It is excluded because the product's own charset table names it in
the `invisible` ban class with a stated reason, and the sanitiser removes it not through
the negated class but through `.replace(/\s+/g,' ')` — JS `\s` includes U+00A0. Widening
the class would not change its fate. **Repair set = 27.**

---

## BUCKET 2 — STRIPPED AND GENUINELY UNDRAWABLE (correctly stripped, on the jsPDF surfaces)

Everything outside the 218-codepoint encodable set: the whole of Latin Extended-A beyond
the seven WinAnsi letters, Latin Extended-B, all combining marks, Greek, Cyrillic, CJK,
Arabic, emoji, and every astral plane. Not enumerable as a table — it is the complement of
218 codepoints in Unicode. The members that matter, because they are in the **shipped
name pools** and the product prints them today:

| codepoint | char | instances in `NAMING_DATA` | encodable by jsPDF | drawable by dossier fonts |
|---|---|---|---|---|
| U+0101 | ā | 1 | **no** | yes |
| U+0107 | ć | **30** | **no** | yes |
| U+010C | Č | 1 | **no** | yes |
| U+010D | č | 1 | **no** | yes |
| U+0110 | Đ | 2 | **no** | yes |
| U+0111 | đ | 1 | **no** | yes |
| U+0161 | š | 3 | yes (bucket 1) | yes |
| U+017E | ž | 2 | yes (bucket 1) | yes |

Total 41 character instances — which **exactly reproduces the census already pinned** at
`tests/data/namingDataCharset.test.js:101-107` (`instances: 41`, those eight codepoints).
Independent derivation, same number.

⚠ "Correctly stripped" here means *correct for jsPDF/Helvetica*, not *correct for the
product*. All six of the non-WinAnsi codepoints are drawable by the dossier fonts. The
asymmetry is the defect, and the sanitiser is only its second cause.

---

## BUCKET 3 — DRAWABLE BUT NOT STRIPPED (already fine, or already wrong): **1 codepoint**

| codepoint | char | status |
|---|---|---|
| U+00AD | SOFT HYPHEN | admitted by `sanitizeJsPdfText` (`"a­a"` round-trips unchanged), encodable as WinAnsi 0xAD, **and named in the `invisible` ban class** of the product's own charset table |

Measured the other direction too: **zero** codepoints are admitted by the sanitiser that
the encoder cannot encode. The sanitiser is a strict subset of the encoder — it is only
ever too narrow, never too loose, with U+00AD the single policy exception.

---

## The two named examples, measured

| name | today, jsPDF surfaces | after the 27-widening | dossier PDF today |
|---|---|---|---|
| `Uroš` (`namingData.js:2053`) | `"Uro"` | `"Uroš"` — **fully repaired** | intact |
| `Hadžić` (`namingData.js:2256`) | `"Had i"` | `"Hadži"` — **still mangled** | intact |

`Hadžić` loses U+0107 ć, which jsPDF cannot encode at all. The widening repairs its ž and
not its ć.

## Repair yield against the shipped pools

35 distinct name tokens in `src/data/namingData.js` are mangled by the jsPDF pass today.
The 27-widening fully repairs **4** of them (`Uroš`, `Uglješa`, `Nataša`, `Snežana`) and
leaves **31** mangled — 5 of the 41 character instances, **12%** of the pinned debt.
