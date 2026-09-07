# DESK-7 — the eleven in-sentence forms of `{complexity}` (authored by the Fable chair, 2026-09-05; owner veto open by name)

The slot's declared shape is `bare-common`: a lowercase common-noun phrase with NO determiner and NO clause, that reads
after both "the" and "a" and takes a singular verb (*"the {complexity} keeps more hands busy"*, *"a {complexity}"*).
Two shapes were REFUSED on evidence by the annex (§0c-3): lower-casing the display string (*"a agricultural surplus with
trade links"*) and splitting at the em dash (adjectives no seam can take). So the vocabulary below is authored, not derived,
and the map from the producer's eleven values is TOTAL in both directions. Every phrase begins with a consonant (article
agreement after "a"), has a singular head noun (verb agreement), names no place, people or creed (setting-agnostic), and
stays in the dossier's plain register — a clerk's word, never a figure and never a claim the reader cannot see on the tile.

| # | `deriveEconomicComplexity` value (producer, verbatim) | `{complexity}` fill (bare-common) | reads as |
|---|---|---|---|
| 1 | `Highly diversified — multiple major revenue streams` | **spread of trades** | *the spread of trades keeps more hands busy* |
| 2 | `Diversified — broad institutional economic base` | **broad base of trades** | *the broad base of trades keeps…* |
| 3 | `Concentrated — fewer revenue streams than scale suggests` | **handful of trades** | *the handful of trades keeps…* |
| 4 | `Diversified market economy` | **market trade** | *the market trade keeps…* |
| 5 | `Specialized production and trade` | **specialist trade** | *the specialist trade keeps…* |
| 6 | `Limited — narrow economic base for this scale` | **narrow trade** | *the narrow trade keeps…* |
| 7 | `Mixed subsistence and market` | **mix of field and market** | *the mix of field and market keeps…* |
| 8 | `Agricultural surplus with trade links` | **surplus farm trade** | *the surplus farm trade keeps…* |
| 9 | `Subsistence with minor surplus` | **small farm surplus** | *the small farm surplus keeps…* |
| 10 | `Subsistence with surplus` | **farm surplus** | *the farm surplus keeps…* |
| 11 | `Subsistence — survival economy` | **subsistence living** | *the subsistence living keeps…* |

Eleven values, eleven phrases, no two producer values sharing a phrase (the map is injective, so a reader can tell the
rungs apart) and no phrase without a producer (surjective onto the vocabulary). The lane that wires it (`COMPLEXITY_NOUN`
in `economyStateProse.js`, the ACCESS_NOUN pattern) asserts the total map in both directions against the producer's
own eleven strings, and closes annex §0c-3 with the measured per-pool eligibility after the fill (C1 was 1 of 3).
