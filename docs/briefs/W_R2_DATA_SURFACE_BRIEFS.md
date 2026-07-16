# W-R2-DATA + W-R2-SURFACE — two briefs, one file (disjoint fences; dispatched together)
## Read docs/briefs/W_R2_COMMON_PROTOCOL.md FIRST.

---

# W-R2-DATA — Branch: `claude/w-r2-data`
## Base symbols: src/lib/customRegistry.js has an ingest reading IMPORT_GOODS_BY_TIER; src/data/supplyChainResourceIndex.js mentions the retired 'fish' chain.

**FENCE:** src/data/**, src/lib/customRegistry.js, src/domain (only the reconcile alias map if
chosen for fix 3), tests/joins/** + tests/data/**. ⚠️ EVERYTHING here risks goldens — every fix
must prove byte-identity (generator golden + joins pins) or STOP → Track-G2. The known
golden-shifting data fixes (coal commodity, terrain double-stack) are ALREADY G2's — NOT yours.

**THE FIXES:**
1. `data-tables-1` (HIGH) — customRegistry ingest learns the group-array shape of
   IMPORT_GOODS_BY_TIER (flatten {group:[...]} entries); kill the phantom 'basic'/'fromHigher'
   refIds; the anomalous bare 'Enslaved persons' town key moves into a group; joins pin: no
   enumerated prebuilt trade-good name equals a group key; known import goods appear with
   direction 'import'. Registry enumeration is custom-content-side (not generation rng) —
   verify byte-neutrality with the generator golden anyway.
2. `data-tables-4` (PARTIAL — read the correction) — both 'Enslaved persons' rows rewritten in
   the sibling shape ({category, p, on, desc}); dead institutionBoost/routeBoost fields
   dropped (no reader exists — verified); shape pin over both tier tables. ⚠️ Making the
   export row LIVE changes goods rolls = golden-shifting → if so, implement behind the shape
   fix but with p:0 (dead-by-value, shape-clean) and record the enable as a G2 line — the
   verdict correction guides; record your JUDGMENT.
3. `data-tables-3` — the retired-'fish'-chain keeper: an alias map ('fish'→'fishing')
   consulted by reconcileProductionAfterResourceChange + chain lookups, OR a load-time
   migration dropping legacy entries — your call, record it; fix the false comment; extend the
   dedup pin with a persisted-save fixture.
4. `data-tables-6` — NPC_ROLES deletion (byte-compare first: python NUL-safe, expect 12,252
   identical bytes vs NPC_FACTION_GOALS; goldens byte-identical after — it has zero
   importers); the misnomer renames behind re-export shims (NPC_SECRETS→NPC_CATEGORY_GOALS
   etc.) with all consumers updated; the zero-importer data-export ratchet added; extend
   DEAD_CODE_DISPOSITION.md with this entry (the disposition ledger owns deletions).

---

# W-R2-SURFACE — Branch: `claude/w-r2-surface`
## Base symbols: src/hooks/useAdvanceSession.js mentions pendingMajors; src/domain/display/settlementPestilence.js exists (your read-model template).

**FENCE:** src/components/**, src/domain/display/**, src/pdf/**, src/copy/** + tests. ALL
display-lane: lazy leaves, zero eager bytes (measure!), zero goldens (prove via verify:dist +
the display register guards). The engine is NEVER modified here — read-models read.

**THE FIXES:**
1. `experience-product-fit-1` (HIGH) — THE PAUSE-VERDICT SURFACE: WorldPulsePanel's paused
   state renders pendingMajors as decision cards (apply/dismiss per major, the existing
   decisions/dismissMajorIds plumbing); Resume submits collected verdicts; the chip relabels
   'Resume with recommendations'; the while-you-were-away digest says 'paused for your word'
   when a living catch-up parks; fix the useAdvanceSession docstring. Component tests over the
   store contract.
2. `experience-product-fit-2` — SettlementsPanel Advance Time maps typed refusals through
   ADVANCE_ERROR_TEXT (toast/inline) + navigates to the Realm on advance_paused.
3. `experience-product-fit-3` — one shared lapseOf(event, settlement, ctx) consumed by
   RealmDocket + PendingIntentions with the composer's real ctx (campaignPeerCount, canUse-
   Custom); peer-target fixture pin (kills the false LAPSED alarms).
4. `experience-product-fit-4` was REFUTED (the affordance exists) — read the verdict; apply
   only any copy clarity it suggests; record.
5. `domain-display-readmodels-4` (PARTIAL — corrections bind) — the read-model siblings on the
   settlementPestilence pattern for: politics blocs (+conspiracies via includeCovert),
   interventions, credibility, momentum (courses + cliff proximity), resource dynamics (vein
   states + dwell). Lazy leaves + presence gates + includeGroundTruth seams + banded fiction.
   Wire each into the Realm Inspector/dossier surface that fits (the pestilence precedent).
6. `experience-product-fit-5` — navalStrength banded into defenseDisplay's naval note; a
   standing blockades line in warStatus/LiveWarStatus (the liveSieges idiom).
7. `ambition-fit-1` — warCausalBrief mounted (Reasons lane beside TreatyPanel + the line into
   LiveWarStatus).
8. `ambition-fit-2` — the hegemonyRead DISPLAY half per DESIGN_SIM_DEPTH_R2 D4(a): the pure
   lazy read-model + dashboard cluster line + brief count + DM baptism via the canon-label
   lane. (The fear_of_dominance REASON half is W-R2-DEPTH's — do not build reasons here.)
9. `ambition-fit-3` — the campaign_state PDF Treaties section consuming renderAllTreaties
   (the FaithWar vm.liveWorld pattern); register in the PDF parity/field manifest.
10. `composer-realm-verbs-1` (HIGH) — the FORCE_RECONSIDERATION course dial goes real:
    options from courseOptions(ws, tick) as composite values staged into args; tighten the
    realm walker's enum floor (no placeholder-only dials); composer→mint→approve integration
    pin.
11. `composer-realm-verbs-2` — the forecast staleness fingerprint gains the world-revision
    fold (rulesetLog tail + decided-proposal count + stressors length), mirrored in the pinned
    UI twin; staleness tests for rules-edit + party-impact voiding.
12. `composer-realm-verbs-3` (PARTIAL) — the candidate lane UI: 'forecast this order' on the
    staged composer/PendingIntentions calling runRealmForecast; render digest.realm beats.
13. `content-immersion-r2-3` — wire the whispers: RealmVerbComposer + RealmDocket route
    through selectWhisper + t(body) with the unified dismissal; WizardNextSteps migrates off
    its legacy key; empty the GUARDS wave's walker allowlist (coordinate via the allowlist
    file both waves share).
14. `content-immersion-r2-4` — deity names resolve from embedded snapshots everywhere
    (PantheonPanel pattern shared by worldSnapshotPublic/pantheonDepth/campaign PDF);
    displayName persisted on the pantheon entry at first mint; hyphen-splitting title-case
    floor; multi-word pin.
15. `content-immersion-r2-5` — causeLifecycle reasons through causeLabel; partyImpact uses the
    resolved NPC name; the reasons register lint.
16. `content-immersion-r2-7` — factionCompetition per-candidateType verb-phrase map (+
    appliedHeadline twins).
17. `components-map-2/3` — one writer for war/faith channels; palette imports from
    relationshipEdgeStyle everywhere + the no-redeclared-hex source scan; legend rows for
    lifecycle ruins/steadings/charter rings.
18. `components-map-4` — AssignDeityFromMap COMING_SOON block → pointer to Realm Orders.
19. `domain-display-readmodels-1/3` — snapshot deity naming via nameById (shared tail-fallback
    helper ×3 modules) + the snapshot↔selector parity pin (derive-or-pin, your call, record).
20. `components-dossier-library-3` — SummaryTabV2 prosperity tolerant read (+ TableView.jsx:63
    sibling) + the string-shape pin.
21. `pdf-export-1/2/3` — the trade-war 'market/prize' role; ExportSheet effectivePicked +
    useAi derivation; arrivalScene/pressureSentence rendered in Overview (docblock fixed).

**COORDINATION:** item 13 empties the allowlist GUARDS creates; if GUARDS hasn't merged when
you finish, note it — the manager sequences the merges.
