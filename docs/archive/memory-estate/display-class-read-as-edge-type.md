---
name: display-class-read-as-edge-type
description: "⚠️⚠️ A DISPLAY TAXONOMY READ AS AN EDGE TYPE: causeWalk hop `type` is `dramaClass || kind` (chronicle display class), NOT the receipt's own type — four Herald connective pools shipped whole and unreachable; cure = `recordedType` off the provenance ledger row + `edgeTypeOf` preference (CR-HR-F4 @ 41287742)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T19:31:33.065Z
---

**THE DEFECT (cycle-12 finding F4, chair ruling CR-HR-F4, landed @ `41287742` on `claude/composite-r4` in minifold).** `heraldCausalVoice.poolForLink` tested its four TYPE warrants — `exposed` / `refused` / `breached` / `dissolved` — against a cause-walk hop's `type`. But a hop's `type` is `node.dramaClass || node.kind` (`causeWalk.buildReceiptIndex`), and `chronicleGraph.dramaClassForNode` computes that from `stressor.type` / `candidateType` / `ruleFamily` — it **never reads the receipt's own `type` field at all**. MEASURED on the shipped path: a `plant_exposed` selectedOutcome resolves as `'outcome'`.

So four connective pools, their whole §3 corpora, and the direction-safety rule guarding three of them were live, correct, fully pinned — and consulted by nothing. Every existing pin passed because it hand-built links carrying `type:'plant_exposed'` directly (a sibling of [[self-referential-pin-class]]: the pin supplied the very shape the producer could not).

**THE CURE.** A resolved hop additionally carries `recordedType` — the receipt's OWN edge/reason type read verbatim off its provenance-ledger row (`spatialLedgers.provenance[id].type`, written by `provenanceKernel.typeOf` as `type ?? candidateType ?? impactKind`). DERIVED READ-MODEL FIELD: no persisted shape, no writer, no migration. `heraldCausalVoice.edgeTypeOf` prefers it, and **the vocabulary is CLOSED** — an unrecognised `recordedType` draws `followed` rather than falling back to the display class, because a second bite at the display class re-opens the same category error one level down. Redaction strips `recordedType` to `null` (the kind of a hidden receipt is content, like `lineageIds`).

**Why this bit:** two fields named `type`, one a display taxonomy and one a structural edge type, meeting in a read model that flattens both onto one hop. Nothing was broken; the warrant was simply never true. A dead warrant is silent — the composer just draws `followed`, which reads as correct conservative behaviour.

**How to apply:**
1. Before warranting ANY behaviour on a `.type` off a display read model, trace where that field is COMPUTED, not where it is read. In this tree `dramaClass` is display and `recordedType` / the ledger row's `type` is structural; they are never interchangeable.
2. A pin that hand-builds the warranted field is testing the regex, not the plumbing. At least one pin per warrant family must run the REAL producer (`buildCauseWalk` over a real `spatialLedgers.provenance` + `pulseHistory`) so the producer can red.
3. Only `exposed` has an end-to-end fixture; `refused` / `breached` / `dissolved` travel the identical `edgeTypeOf` path — deliberate, recorded in `docs/DESIGN_FP_SPINE.md` lane CF.
4. **A hop's recorded type only exists when the receipt has a ledger row of its own** — i.e. it has parents. A root cause named only as its children's parent reads `recordedType: null` honestly.
5. OPEN: `discourseKernel.realizeCauseWalk` does NOT carry `recordedType` through (rebuilds nodes with `type: hop.type`, classifies against its own `ADVERSATIVE_TYPES`). Nothing there reads `poolForLink`, so no false claim is composable — but that register's classification is reading the display class too. Design question for the discourse lane, deferred and recorded.
