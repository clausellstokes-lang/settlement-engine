# DA / DA-A3 — the relationship palette converges, and an alliance stops reading as trade

- **Status:** LANDED
- **Landed at:** `a87b904c`
- **Verified base:** `claude/composite-r4` at `1596b16590216e8a4f5330696689b0f7d595ef38`
- **Train:** `da-b`, family **DA** (un-stamped, cap 4), member **1**. Change paths disjoint
  from DA-A4, DA-B1 and DA-B2.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§67.2** (the whole seven-definition palette
  family; `secret_alliance` asked of the corpus) · **§122.3** (the chair's sharpened DA.M8:
  the react-PDF chapter MISLABELS AN ALLIANCE AS TRADE, so the convergence cures a semantic
  error, not a tint) · **§69.2** (PDF leads).
- **Compile of record:** `laneTC21-DA-PLAN.md` §4.3, annex rows DA.M8, DA.M9, DA.M10, DA.M16.

---

## §1 · THE DEFECT — NOT A STALE TINT

`relationshipColors.js` called itself "the SINGLE source of truth" while **seven** duplicate
tables were live. Six were incomplete; one was **wrong about which relationship it was
showing**, and the paid PDF rendered it.

`src/pdf/theme.js:70` and `SettlementCard.jsx:29` held the same table, measured at this base
against the canonical set:

| type | that table | canonical | verdict |
|---|---|---|---|
| `allied` | `#1a5a28` | `#1a3a7a` | ⛔ **canonical `trade_partner`'s hue — an alliance painted as trade** |
| `trade_partner` | `#a0762a` | `#1a5a28` | ⛔ a hue in no canonical table at all |
| `rival` | `#8b1a1a` | `#8a5010` | ⛔ collapses onto `hostile` |
| `cold_war` | `#8b1a1a` | `#8a3010` | ⛔ collapses onto `hostile` |
| `patron` | `#2a3a7a` | `#4a1a6a` | ⛔ collapses onto `client` |
| `client` | `#2a3a7a` | `#6a3a1a` | ⛔ collapses onto `patron` |
| `vassal`, `neutral` | absent | present | fell to the grey fallback |

**Five of nine types rendered wrong, and three of them were mutually indistinguishable.**
Meanwhile `utils/generateCampaignPDF.js` — the jsPDF exporter — painted the canonical set, so
**one product shipped two PDF systems that disagreed with each other about what an alliance
looks like.**

The other four homes (`SettlementDetail.jsx`, `new/neighbourComponents.jsx`,
`RelationshipsTab.jsx` ×2, `generateCampaignPDF.js`) carried canonical VALUES but each
omitted `vassal` and `criminal_network`, so those two live edge types fell to neutral grey on
every surface except the map (DA.M10).

## §2 · WHAT REPLACES IT

1. **All seven tables are deleted.** Every surface calls `relColor()` / `relRgb()`.
   **`REL_RGB`'s orphan status ends here** — `generateCampaignPDF.js`'s hand-kept RGB copy is
   exactly what it was written for.
2. **The module's overclaiming header is cured in the same packet**, and recorded as HISTORY
   rather than quietly corrected: its "the card was the outlier / recolors three chips"
   account understated the divergence in both size and kind.
3. **`RelationshipsTab.jsx:199` converges (J-TC21-3).** It disagreed with the table thirty
   lines above it in the same file on four values; the compile searched for a recorded intent
   and found none, which discharges §67.2's own condition.
4. **`secret_alliance` stays EXPECTED-DEAD (J-TC21-8)** — zero producers, absent from both
   relationship planes. It keeps its authored PDF label and gets no palette row.
5. **`vassal` and `criminal_network` become visible on every surface.** This is a visible
   output change on live relationships and it is the point of the member.
6. **The card's `en-GB` date rides here** because this member owns the file (§3.1), not
   because it is palette work.

## §3 · THE PARITY WALKER, EXTENDED FROM 3 SPOT CHECKS TO EVERY SURFACE

The three arms that existed pinned the MAP. They could not have caught this: the defect lived
on the surfaces they never looked at. The walker now reads the **source** of all seven
converged surfaces — importing and comparing values cannot see a copy at all — and asserts:

- no surface keeps a colour table of its own, **and** every surface actually reaches the
  canonical module (a file with neither is not converged, it is colourless);
- `REL_HEX` and `REL_RGB` are each a **bijection** with the ten canonical types;
- every type resolves to a **distinct** hue — the property that was actually broken;
- `allied !== trade_partner`, asserted by name;
- `vassal` and `criminal_network` are not the neutral fallback;
- the hex and rgb channels agree type-for-type, so the PDF cannot drift from the web.

⚠ **The detector carries a positive control, and it earned it.** A first cut matched
`\[` for the rgb form and convicted twelve rows in two files that HAD converged —
`trade_partner:['economy']` (an effect-category list) and `patron: [1.5, 1.0]` (a dash
pattern). The triple must be three integers. A detector that convicts a converged file
teaches the next reader to disbelieve it.

## §4 · SIZE — THE MEMBER GAINS HEADROOM

| file | effective | ceiling |
|---|---:|---:|
| `SettlementDetail.jsx` | 587 → **583** (−4) | 600 |
| `utils/generateCampaignPDF.js` | 689 → **680** (−9) | 800 |
| `pdf/theme.js` | 143 → **132** (−11) | 800 |
| `new/tabs/RelationshipsTab.jsx` | 252 → **251** (−1) | 600 |
| `pdf/sections/Relationships.jsx` | 331 → **332** (+1) | 800 |
| `new/neighbourComponents.jsx` | 110 → **111** (+1) | 600 |
| `SettlementCard.jsx`, `relationshipColors.js` | +0 | 600 / 800 |

Net **−22** across the member. `SettlementDetail.jsx` was the compile's second-tightest file
at 587/600 and the cure delivers exactly the predicted −4.

## §5 · SAME-SEED POSTURE

**GENERATION-NEUTRAL; PRESENTATION CHANGES BY DESIGN, and it is stated rather than left to
look silent.** No engine module reads these palettes; they are lazy UI/PDF chunks with no
golden and no first-paint edge. What changes is what the reader SEES: the react-PDF chapter
stops mislabelling alliances as trade, three war-adjacent types stop being one red, and
`vassal` / `criminal_network` stop rendering grey.

## §6 · STOP CONDITIONS

1. `secret_alliance` gains a palette row — the corpus refuses that membership.
2. Any surface keeps a table "temporarily".
3. Two canonical types resolve to one hue.
4. The header keeps a claim that is true only after this member without saying so.
