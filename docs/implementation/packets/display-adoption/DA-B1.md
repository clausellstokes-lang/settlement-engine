# DA / DA-B1 — the authored display lexicon, and the two vocabularies that refused a bucket

- **Status:** READY
- **Verified base:** `claude/composite-r4` at `9adb725b907928541cb2e24c63f3c7905dee286f`
- **Train:** `da-c`, family **DA**, member **1**. Change paths disjoint from the `da-c` mint,
  which touches only `tests/lint/`.
- **Authorities:** `OWNER_DECISION_QUEUE.md` **§113** (the leak census) · **§122.3** ·
  **§124** (the `da-c` dispatch). Carries **J-TE22-4**, which deferred the lexicon out of
  DA-A1 so it would land WITH its consumers rather than as unread data.
- **Compile of record:** `laneTC21-DA-PLAN.md` §4.5, annex rows DA.L4, DA.M11, DA.M12, DA.M13.

---

## §1 · THE DEFECT — FOUR SURFACES SPELL ENGINE TOKENS AT THE READER

Four residual leaks survive DA-A1, each re-implementing the same one-line idiom in place of
the estate's chokepoint:

| site | what the reader met | cure |
|---|---|---|
| `map/WizardNewsPanel.jsx:220` | the typed `kind` through a FILE-LOCAL `human()` | the chokepoint `humanizeToken` |
| `new/tabs/ChronicleTab.jsx:75` | `.replace(/_/g,' ')` on a **headline** slot | `humanizeIfToken` |
| `new/tabs/EconomicsTab.jsx:680` | a raw `chainId` **and** a raw status token | `humanizeToken` + the lexicon |
| `dossier/DossierHeaderRow.jsx:72` | a raw `tradeRouteAccess` token | the lexicon |

## §2 · THE LEXICON IS SMALL BECAUSE TWO VOCABULARIES WERE ASKED AND REFUSED

⭐ **The corpus was enumerated before the table was authored, and it refused two of the four
classes outright.** A lexicon written to what looked closed would have rotted on the next
emitter.

- **news `kind` — REFUSED a bucket.** Measured at roughly **200 distinct tokens across 415
  emit sites** in `src/domain/worldPulse/`. No hand-kept table survives that, so the site
  takes the general `humanizeToken` chokepoint. The gain is real anyway: the file-local
  `human()` handled underscores ONLY, so a camelCase token leaked through it.
- **supply-chain `chainId` — REFUSED a bucket.** It is DERIVED
  (`snakeCase(chain.chainId || chain.label)` over node uids), so it has no enumerable domain.

The two that DID enumerate get authored labels:

- **`tradeRouteAccess`** — exactly five values, read off the generator's own
  `TERRAIN_ROUTE_POOLS` and its coastal pools. ⭐ `isolated` earns the lexicon outright: the
  word says nothing about TRADE, which is the only thing it means.
- **`supplyChainStatus`** — the five legacy values `settlement.schema.js` records the
  generator producing, which is the shape `economicState.activeChains` still carries.
  `entrepot` is a term of art the reader should not have to look up.

⚠ **No label invents a fact the engine does not hold.** `vulnerable` stays near its token
deliberately: `inferSupplyChains.js` sets it for a chain that is DISCOVERED-BUT-UNCONFIRMED,
so a confident word would say something the value does not mean.

## §3 · THE CHRONICLE TITLE IS A MIXED SLOT, AND THE PLAIN HUMANIZER WOULD DAMAGE IT

`chronicleFeed.js` fills that slot from `raw.title || raw.label || raw.name || raw.type ||
raw.kind || …`, so the same span renders an authored headline one row and a `succession_coup`
token the next. Routing the whole slot through `humanizeToken` LOWERCASES every real
headline. `humanizeIfToken` tests structurally instead — whitespace means prose, a lone word
with no separator and no camel hump is already a word — and only humanizes the rest.

## §4 · SAME-SEED POSTURE

**NEUTRAL, and structurally rather than by sampling.** `git diff --numstat` on
`humanizeEngineTokens.js` is **+101 / −0**: every pre-existing export keeps a byte-identical
body, so DA.M13's hazard (`humanizeToken` and `humanizeContextSignature` reach persisted
prose through `pressureModel`, `settlementStrategy` and `eventProse`) cannot be reached by
this member. The four cures are display call sites with no persisted consumer.

**§104.4 is INCURRED and paid a second time**, exactly as J-TE22-4 priced at the deferral:
the chokepoint is an input to `aiCharterBundle` (110 inputs) and `aiOutputSchemaBundle` (111).

## §5 · SIZE — THE NAMED STOP

⛔ **`EconomicsTab.jsx` had ONE line of headroom (DA.M12)** and the member spends exactly it:
**599 → 600 against a 600 ceiling**, measured with eslint's own `Linter` under the enforcer's
rule before and after, never `wc -l`. The cure itself is line-neutral; the one line is the
import. **The file now sits AT its ceiling with zero remaining headroom** — the next lane to
touch it must reclaim before it adds.

| file | before → after | ceiling |
|---|---:|---:|
| `new/tabs/EconomicsTab.jsx` | 599 → **600** | 600 |
| `map/WizardNewsPanel.jsx` | 459 → **456** | 600 |
| `new/tabs/ChronicleTab.jsx` | 81 → **82** | 600 |
| `dossier/DossierHeaderRow.jsx` | 61 → **62** | 600 |
| `domain/display/humanizeEngineTokens.js` | 56 → **88** | 800 |

## §6 · STOP CONDITIONS

1. Any pre-existing export of `humanizeEngineTokens.js` changes behaviour (DA.M13).
2. `EconomicsTab.jsx` exceeds 600 effective lines.
3. A bucket is authored for news `kind` or for `chainId` — both vocabularies refused one.
4. The remaining 42 `replace(/_/g` sites are swept (J-TC21-6 dispositioned them as a correct
   authored idiom; sweeping is churn).
5. The chokepoint is imported into an EAGER first-paint closure (J-TE22-5). All four consumers
   here are behind lazy boundaries, verified at landing.
