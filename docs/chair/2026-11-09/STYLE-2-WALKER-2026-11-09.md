# STYLE-2-WALKER — THE STYLE WALKER, LANDED AS A RATCHET (2026-11-09)

Seat SW-0 · STYLE-WALKER (Opus 5.5), a child of the cloud chair (session `session_01FbPLbejcfwX5nii12VM673`), on `lane/style-2-walker-2026-11-09`, cut at `a7bc2e4ce` (= `origin/lane/integration-2026-11-07` HEAD, of which `5b267578c` is an ancestor). The brief is `BRIEF-STYLE-2-WAVE-2026-11-09.md` §1 SW-0, and the ruling is `STYLE-RULINGS-2-2026-11-09.md` A10, both on `lane/chair-2026-11-08`. The worklist is `STYLE-AUDIT-2-SOURCES-2026-11-09.md` §0, §3, §3a and §4 on `lane/style-2-sources-2026-11-09`. Time labels are from `date` (first measurement 01:21 UTC).

**No product byte moved.** The lane writes five files:
- `scripts/lib/style-law-scan.mjs`, the scanner (a pure module and its `--record` door);
- `tests/lint/styleLaw.walker.test.js`, the walker;
- `tests/lint/.style-law-baseline.json`, the baseline (written only by the door);
- `scripts/mutation-coverage-manifest.json`, one rationale row for the new walker (see §5);
- this record, with the roster bump it needs (`tests/lint/.source-citation-baseline.json` `dated` 168 → 169 and the header line of `tests/lint/sourceCitationIntegrity.walker.test.js`).

## §1 The scanner's rules (its header is the rule book)

- **Roots.**
  - The chair's 29 census roots (BRIEF-STYLE-2-AUDIT §2, run by the audit's §0).
  - Plus `src/data/dossierStateProse` (the six `*.generated.js`), `src/data/dossierCausalProse.generated.js`, `src/domain/worldPulse` and `src/components/map`.
  - Every `.js/.jsx/.mjs/.ts/.tsx` file under a root is read, except `node_modules`, `*.test.*` and `__snapshots__`. The census's own skip of `dossierStateProse|\.generated\.` is NOT inherited. The audit's §3a measurement did not apply it either: it counts `proseNorms.generated.js`, `customContentManifest.generated.js` and `institutionServiceKeys.generated.js`.
  - **Less the audit's §4 exclusions BY PATH:** 109 files, `EXCLUDED_PATHS`, extracted from the §4 table and pinned at 109.
  - **1,096 files are read at the tip; 203 carry a hit.**
- **Units.** Units are read from the TypeScript parse, so comments are blanked by construction and a regex literal or a quote inside a slot cannot derail the reader. There are three kinds:
  - a string literal;
  - a template literal, with each `${…}` read as the token `{…}` (a nested template inside a slot is its own unit);
  - a JSX text run: the JsxText and `{…}` children between two element boundaries, each `{…}` a slot (`{}` and `{/* comment */}` read as nothing).
  
  In every unit, a brace placeholder `{name}` / `{a.b}` (the annex's and `t()`'s slot syntax) is read as `{…}`: a slot NAME is filled at print time and never prints as a word. A unit counts only with two or more whitespace-separated words, a slot counted as one.
- **Phrases.** The audit's §3 list, case-insensitive, word-bounded, any whitespace run inside a phrase. Every occurrence counts. There are 17 ids:
  - `faction` (faction · factions · factional · factionalism)
  - `rather-than`
  - `the-record`
  - `the-ledger`
  - `the-engine` (the engine / the simulator / the simulation)
  - `a-stranger`
  - `arithmetic`
  - `per-cent` (per cent / percent)
  - `on-the-roster` (on / from / in the roster)
  - `not-merely`
  - `legitimacy-score`
  - `the-gap-widens`
  - `the-space-its-authority-does-not-occupy`
  - `two-different-things` (two different things / do not contradict)
  - `a-separate-question`
  - `nothing-has-broken-yet`
  - `which-is-the-kind-of`
- **The allow-list.** `ALLOW` holds 23 app-chrome keys of `src/copy/en.js` by key path inside `en`, for `the-engine` only:
  - `generate.subtitle` · `generate.introSubtitleBasic`
  - `surveyorDoor.proposed`
  - `onboarding.coach.step2Body` · `onboarding.checklist.itemRail`
  - `guidance.dossierFirstCallouts` · `guidance.postGenCoach.simulated`
  - `guidance.notes.realm.empty.a` · `guidance.notes.dossier.first.a` · `guidance.notes.dossier.onward.a` · `guidance.notes.simulation.onward.a`
  - `gallery.antiAi`
  - `errors.generateFail`
  - `moments.regen_burst.headline`
  - `pricingPitch.wanderer.lineWorldbuilder`
  - `sampleDossier.footer`
  - `aboutLiving.headerEyebrow` · `aboutLiving.intro` · `aboutLiving.systems.war.coherence` · `aboutLiving.systems.chronicle.coherence`
  - `replay.subtitle`
  - `accountFaq.aiOrSim.a`
  - `edit.shell.counterparty.note`
  
  What stays counted in en.js, and why:
  - The retired word stays counted there (5: `hero.subtitle`, `onboarding.firstRun.step1Body`, `guidance.compendium.culture.body`, `narrativeDrift.body`, `accountFaq.aiOrSim.a`). It is SW-8's rename (A8).
  - The one "the record" (`edit.dialog.refusalUnknownTarget`) stays counted until a lane rules it.
  
  The walker reds on a dead allowance, that is, a named key that no longer exists or no longer carries its phrase.
- **The ratchet.** The baseline holds a count per file per phrase. The walker reds:
  - when any (file, phrase) count rises above its baseline (a file the baseline does not name starts at 0);
  - when a phrase whose baseline total is 0 appears anywhere.
  
  A fall is green. STYLE-2-MERGE re-measures downward at the final tip through the door (`node scripts/lib/style-law-scan.mjs --record`). The baseline carries a sha256 `digest` over its rows; a hand edit that does not re-run the door breaks it, and the walker reds.

## §2 The baseline at the tip (`a7bc2e4ce`; 1,096 files read, 203 with a hit)

| phrase | count | files | the top files |
|---|---|---|---|
| faction | **345** | 107 | narrativeText.js 18 · stressFactions.js 16 · power.generated.js 15 |
| rather than | **323** | 65 | habitForkRegistry.js 64 · warFaith.generated.js 26 · defense.generated.js 23 |
| the record | **102** | 41 | warReceiptPools.js 8 · warRemembrance.js 7 · rumorPhrasePools.js 7 |
| the ledger | **41** | 26 | warReceiptPools.js 6 · newsVoice.js 4 · dossierCausalProse.generated.js 3 |
| a stranger | **31** | 16 | economy.generated.js 10 · general.generated.js 3 · dossierCausalProse.generated.js 3 |
| arithmetic | **27** | 15 | warReceiptPools.js 5 · general.generated.js 4 · generalStateProse.js 2 |
| the engine / simulator / simulation | **13** | 10 | InstitutionsTab.jsx 2 · DailyLifeTab.jsx 2 · WorldMapToolbar.jsx 2 |
| on/from/in the roster | **9** | 4 | cascadePass.js 3 · military.js 2 · crisisCast.js 2 |
| per cent / percent | **8** | 7 | demographicsPlans.js 2 |
| not merely | **3** | 3 | rulingStructure.js · isolationGenerator.js · institutionDescVariants.js |
| legitimacy score | **1** | 1 | causalState.js |
| the gap widens | **1** | 1 | warReceiptPools.js |
| the space its authority does not occupy · two different things / do not contradict · a separate question · nothing has broken yet · which is the kind of | **0** each | 0 | **refused outright** |

The top files by total:
- `habitForkRegistry.js` 69
- `dossierCausalProse.generated.js` 36
- `general.generated.js` 35
- `economy.generated.js` 30
- `power.generated.js` 30
- `defense.generated.js` 28
- `warFaith.generated.js` 28
- `warReceiptPools.js` 24
- `narrativeText.js` 24
- `rumorFallbackPhrasePools.js` 23

## §3 The differences against the audit's §3a, every one explained

**How they were measured.** The audit's §3a was re-parsed into rows (200 files). The audit's own matcher was then re-run at this tip (the census's comment strip and quote regex, word count ≥ 2, phrases counted on the raw literal), once raw and once with `${…}` → X. Each difference between the audit and the walker is attributed by class:
- **D1 — residue (−2, faction).** The audit's regex finds a hit at `b7e32deed` that its own re-run at this tip does not. The two files are byte-identical between the two shas. No literal in either carries the word: it is a quote paired across code or a comment.
- **D2 — slot code (faction −81 · per cent −4).** The audit counted identifiers inside `${…}` (`${f.faction}`, `${govFaction.faction}`, `.percent`). They print as values, never as the word. The walker reads a slot as a slot (the brief's rule).
- **D3 — quote mispairing (faction −70 · rather than +3).** The census regex pairs quote characters across code. An apostrophe in an English string shifts every later pairing, so the "literal" becomes code. Examples: `npcGenerator.js` (the audit says of it "its pools sit inside code the matcher misparsed") holds 10 literals with the word, not 71; `governanceNarrative.js` holds 2, not 10. The same fault also MISSED real literals: `razing.js` "rather than" +1, `npcGenerator.js` "rather than" +2, `headlines.js` "faction{…}" +1.
- **D4 — JSX text (faction +9 · the record +3 · rather than +2 · the engine +2).** The string matcher was blind to JSX text, which the audit itself flagged (§0, "Census limit"; §3: "The walker must not inherit the census's JSX limit"). The walker reads it by rule.
- **D5 — the allow-list (the engine −23).** The 23 en.js keys of §1.
- **D6 — brace placeholders (faction −116).** `{faction}` in the annex projections and in `stressInstitutionEffects.js` is a slot name filled with a power's name, never the word printed.

Net, by phrase:

| phrase | walker | audit | how the gap breaks down |
|---|---|---|---|
| faction | 345 | 605 | D1 −2 · D2 −81 · D3 −70 · D4 +9 · D6 −116 |
| rather than | 323 | 318 | D3 +3 · D4 +2 |
| the record | 102 | 99 | D4 +3 |
| the engine | 13 | 34 | D4 +2 · D5 −23 |
| per cent | 8 | 12 | D2 −4 |

The other seven counted phrases are equal, and the five refused phrases are 0 on both sides.

Every (file, phrase) row that differs is below (35 rows; audit → walker). Four more rows (`narrativeText.js`, `politicsRead.js`, `settlementNarrative.js`, `applyWorldPulseFactionRoster.js` — faction) agree with the audit, because D2 and D3 cancel in them.

| file | phrase | audit | walker | class |
|---|---|---|---|---|
| `src/components/map/AdvanceReport.jsx` | the-record | 0 | 1 | D4 +1 |
| `src/components/map/NpcTrailSection.jsx` | rather-than | 0 | 1 | D4 +1 |
| `src/components/map/RealmForecast.jsx` | rather-than | 0 | 1 | D4 +1 |
| `src/components/map/RelationshipChronicleSection.jsx` | the-record | 5 | 6 | D4 +1 |
| `src/components/map/WhileYouWereAway.jsx` | the-record | 0 | 1 | D4 +1 |
| `src/components/map/WorldPulseData.js` | per-cent | 1 | 0 | D2 -1 |
| `src/components/map/WorldPulsePanel.jsx` | per-cent | 3 | 0 | D2 -3 |
| `src/components/new/tabs/DefenseTab.jsx` | faction | 0 | 1 | D4 +1 |
| `src/components/new/tabs/InstitutionsTab.jsx` | the-engine | 0 | 2 | D4 +2 |
| `src/components/new/tabs/PowerTab.jsx` | faction | 1 | 2 | D4 +1 |
| `src/components/new/tabs/power/PowerStrata.jsx` | faction | 2 | 3 | D4 +1 |
| `src/components/settlementDetail/SettlementDetailEditNames.jsx` | faction | 2 | 5 | D4 +3 |
| `src/copy/en.js` | the-engine | 23 | 0 | D5 -23 |
| `src/data/dossierCausalProse.generated.js` | faction | 18 | 5 | D6 -13 |
| `src/data/dossierStateProse/economy.generated.js` | faction | 3 | 0 | D6 -3 |
| `src/data/dossierStateProse/general.generated.js` | faction | 37 | 8 | D6 -29 |
| `src/data/dossierStateProse/power.generated.js` | faction | 71 | 15 | D6 -56 |
| `src/data/dossierStateProse/warFaith.generated.js` | faction | 3 | 1 | D6 -2 |
| `src/data/stressInstitutionEffects.js` | faction | 19 | 6 | D6 -13 |
| `src/domain/display/stateProse/generalStateProse.js` | faction | 4 | 2 | D3 -2 |
| `src/domain/worldPulse/factionDensityKernel.js` | faction | 1 | 0 | D1 -1 |
| `src/domain/worldPulse/informationReceiptPools.js` | faction | 3 | 0 | D2 -3 |
| `src/domain/worldPulse/razing.js` | rather-than | 0 | 1 | D3 +1 |
| `src/domain/worldPulse/thievesGuild.js` | faction | 1 | 0 | D1 -1 |
| `src/domain/worldPulse/warReceiptPools.js` | faction | 5 | 0 | D2 -5 |
| `src/domain/worldPulse/warRulingsNews.js` | faction | 5 | 1 | D2 -4 |
| `src/generators/factionDynamics.js` | faction | 63 | 0 | D2 -63 |
| `src/generators/narrativeGenerator.js` | faction | 4 | 1 | D2 -3 |
| `src/generators/npcGenerator.js` | faction | 71 | 10 | D3 -61 |
| `src/generators/npcGenerator.js` | rather-than | 1 | 3 | D3 +2 |
| `src/generators/power/governanceNarrative.js` | faction | 10 | 2 | D3 -8 |
| `src/pdf/lib/headlines.js` | faction | 3 | 1 | D2 -3 · D3 +1 |
| `src/pdf/sections/DefenseSecurity.jsx` | faction | 0 | 1 | D4 +1 |
| `src/pdf/sections/NPCQuickRef.jsx` | faction | 0 | 1 | D4 +1 |
| `src/pdf/sections/PowerStructure.jsx` | faction | 0 | 1 | D4 +1 |

**For SW-8 (A8), noticed under the intake rule.** A8 sized its generator causes from the audit's source counts: `npcGenerator.js` 71, `factionDynamics.js` 63, `power.generated.js` 71, `general.generated.js` 37, `stressInstitutionEffects.js` 19, the causal annex 18. The literals that actually carry the word are 10, 0, 15, 8, 6 and 5. The rest is slot code, slot names and code the regex swept. The walker's rows are the rename lane's real worklist. This is the chair's to pass on; nothing here moves it.

**A correction to my first message to the chair (01:2x UTC).** That message split the retired word's gap as −94 slot code, −61 mispairing and +13 JSX. Those figures came from a first cut that I had not yet attributed row by row. The table above is the measured split: D2 −81, D3 −70, D4 +9 (with D1 −2 and D6 −116 unchanged). The totals were right.

## §4 The red-first proof (executed in place at the tip, 01:2x UTC)

1. **The walker at the tip before any plant:** 20 of 20 tests green.
2. **The plants:**
   - `src/domain/summary/tonightSheet.js` (baseline "rather than" 1) gained `'the cast is thanked rather than blamed tonight'`;
   - `src/domain/display/newsBody.js` (not in the baseline for that phrase) gained `'and so far nothing has broken yet in the square'`.
   
   Each was appended as an exported literal from the shell. Both files were first copied to scratch.
3. **The walker with the plants:** exit 1, 2 failed / 18 passed.
   - `⛔ no file's count of any struck phrase RISES above its baseline` failed with `src/domain/summary/tonightSheet.js :: rather-than 1 -> 2`.
   - `⛔ a phrase whose baseline total is 0 appears NOWHERE` failed with `src/domain/display/newsBody.js :: nothing-has-broken-yet (refused outright)`. Each failure printed the planted line's file, line and text.
   - An earlier plant run (`rather than` appended to `newsBody.js`, baseline 0 → 1) also redded a third test, the executed planted-rise pin. That pin compared against the live scan rather than the baseline. It now compares against the baseline, so a real red elsewhere in the tree can no longer red it.
4. **Restored:** both files copied back from scratch (`cmp` equal, `git diff --quiet -- src` clean). The walker: exit 0, 20/20.
5. **In the test body, on every run, in memory:** a planted rise (0 → 1), a planted refused tic in a file the baseline names, a fall that stays green, and one convicting plant per unit rule:
   - comments;
   - case and word bounds;
   - template slots;
   - brace placeholders;
   - JSX runs and element boundaries;
   - the allow-list;
   - each of the 17 phrase rules.

## §5 The registers

- **The `testRatchet` register: STOP reported to the chair with this default, which I took.** `scripts/.test-ratchet-baseline.json` needs no move and was left byte-identical:
  - its `totalTests`/`totalFiles` are FLOORS (90% of the frozen figure), so a new test file reds nothing;
  - its door (`npm run test:ratchet:update`) runs the whole suite, is remove-only, and refuses at a base that is already red.
  
  The register a new `tests/lint` file does owe is the mutation-coverage manifest. Its TOTALITY arm enumerates every `tests/lint/*.test.js`. The walker's rationale row was added: the in-body controls and the executed in-place plant above.
- **`mutationCoverageManifest.test.js` at the tip:** 1 failed / 9. The TOTALITY arm lists the base's same three files: `tests/edgeFunctions/promptsNpcFaction.test.js`, `tests/generators/historicalCharacterMajorEvents.test.js`, `tests/generators/stressNoteDirection.test.js`. The new walker is not among them. This red is the base's, unchanged, and not this lane's.
- **The three record walkers** (`sh scripts/gate-tail.sh npx vitest run tests/lint/sourceCitationIntegrity.walker.test.js tests/lint/ledgerCitationIntegrity.test.js tests/lint/testRatchet.test.js`, with `review-fixes-2026-07-08` fetched locally): green except the inherited roster red. `tree` reads **147** against 139 frozen at this base, not the 140 the brief names. The cause is all MERGE-WAVE's: the eight signed records `docs/shift-records/2026-11-08-merge-wave-{1..8}-*.json`, from `9288badee` (record 1, w1-eco, the brief's 140) through `d8007f696` (record 8, public-veil), none with a roster bump. The 147 was measured at the base before this lane wrote a byte. `tree` is not touched here. `dated` was 168 at the tip and is 169 with this record (`_rosterGrowth2026-11-09-style-2-walker`).
- **eslint** on the two code files: 0 errors, 0 warnings.

## §6 CONFIRMED against PLAUSIBLE

**CONFIRMED** (measured at `a7bc2e4ce` by this seat):
- the baseline's totals and rows (the door's own output, digest-checked by the walker);
- the 1,096 files read and the 109 exclusions none of which is read;
- every difference against §3a and its class, by re-running the audit's own matcher at the tip, raw and slot-replaced, against the walker. D1's two rows rest on the regex's behaviour at a different sha over byte-identical files: CONFIRMED that no literal carries the word, PLAUSIBLE as to the exact pairing;
- the red-first proof (exit codes and failing titles above);
- the manifest red being the base's.

**PLAUSIBLE:**
- **that the 23 allow-listed en.js keys are app chrome.** This follows the audit's §1b judgment of en.js (443 of 444 literals app chrome). Two of them print on or beside a dossier page: the surveyor's guidance notes and the edit shell's counterparty note. They are allowed as product chrome, not dossier prose; the chair or the owner may strike any key by name;
- **that every brace placeholder is a slot name.** The rule reads any bare `{identifier}` as a slot. A literal word in braces meant to print would be missed. At this tip the rule moves only the retired word (−116), in exactly the six files of D6. That was measured by scanning with and without the rule: only those rows differ, and every one is the `{faction}` slot of the annex and of `stressInstitutionEffects.js`'s slot-filled lines. A future placeholder meant to print is the residual risk.

## What stays

Nothing of the lane's charter. STYLE-2-MERGE re-measures the baseline downward at the final tip through `--record`. The A8 sizing note in §3 goes to the chair for SW-8.
