# DESIGN — THE CHRONICLE: span-scaled advance legibility + THE DECREE TRACKER
## Owner commission 2026-07-17 (verbatim intent: the world pulse bar / wizard news /
## autoresolver surfaces "also need to be perfect and readible and digestible and navigable
## and workable. after every advance, then how do we compress or relay differences that
## happened between a 1 week advance to the difference of a 1 month to a season to a year";
## and for DM-queued changes applied across a long advance: "what matters to them, besides
## all of the events that transpired and what to accept, is how those recent changes were
## reflected, or not, its not necessary to make them the most important news but it should
## be noted for the user because that was their choice.")
### Fable 5 design, frozen on dispatch. Display lane ONLY — zero engine contact.

## 0. The diagnosis (why the current surface under-serves the data)
The data layer is A-grade (receipts on everything, typed reasons, tempo-governor-bounded
drama, week-by-week interval execution). The presentation layer is feed-shaped and
SPAN-BLIND: a year-advance renders as scroll-archaeology; retention caps are TRUNCATION not
compression; auto-verdicts arrive as a pile; DM decrees have no reflection surface. The
entire fix is read-models + UI. No engine file changes.

## 1. THE ZOOM LAW (hierarchical, never truncating)
One advance renders at four altitudes, each drilling into the next:
HEADLINE (1 line, fiction register) → CHAPTERS (seasons) → THREADS (stories) → EVENTS
(receipts). Scaffolding grows with span: week ⇒ events only · month ⇒ threads+events ·
season ⇒ chapter+threads · year ⇒ the full pyramid. Default altitude matches span; full
descent always available. Compression is a PURE DERIVED READ over durable stores — facts
frozen, meaning derived, applied to the news.

## 2. THREADS OVER TIMELINE (the story-sifting move)
The unit of comprehension is the causally-linked chain, extracted (never authored) from the
receipt graph: connected causal chains, typed by the E0 drama classes (all 8). THE
TRACTABILITY GUARANTEE: the tempo governor bounds concurrent drama ⇒ a year contains a
BOUNDED number of threads by construction. Thread render: title (register prose) · arc
(began → turned → stands-now) · key beats · current state · receipts beneath. Cross-links
where threads touch (the war thread references the famine thread it caused).

## 3. DELTA-FIRST FRAMING
The lead surface after any advance answers WHAT IS DIFFERENT: standings deltas (rose/fell),
holdings/map deltas, relationship deltas (wars/peaces/alliances started/ended), world vitals
then→now. Orientation by difference; threads carry the why. (The forecast's before/after
diff machinery is the precedent.)

## 4. THE DEPUTY'S DIARY (autoresolver legibility)
Auto-verdicts are BEATS IN THREADS, never a separate pile. Plus a dedicated "rulings in your
absence" view: grouped by thread; each verdict with its typed reason + receipts +
REVERSIBILITY STATUS (still-amendable vs consumed). Accept-flow scales BY THREAD (bulk
verdicts per story), not item-by-item.

## 5. THE DECREE TRACKER (the owner's second requirement — verbatim-anchored above)
Every DM-queued change (docket entries, pending edits) applied during the advance gets a
permanent thread class: YOUR DECREES. Per decree:
(a) WHEN it landed (week k of N — the engine already applies at the correct week);
(b) the immediate effect (its direct receipt);
(c) WHAT IT CAUSED across the span = the CAUSAL CONE: the descendants of the decree's
    receipt id in the provenance graph (a graph walk — the receipts architecture makes
    "how did my choice matter" a query);
(d) WHERE IT STANDS at span-end: held / absorbed / contested / undone — with the breaking
    event linked when undone;
(e) HONEST NULLS: "this decree produced no measurable downstream effect" is a reported
    FINDING — noted because it was their choice; never silently dropped.
PLACEMENT (owner's ruling): not forced to top news; ALWAYS present, findable, never lost —
a consistent section of every advance report. FUTURE HOOK (seam, not this wave): the D7
reframe read applied to decrees — intended vs believed reception of the DM's own acts.

## 5b. ENTANGLEMENT CONSOLIDATION (owner amendment 2026-07-17: "some of these queued events
## per the DM's orders directly entangle with each other. so that is an area to consolidate")
Per-decree isolation MISLEADS when decrees interact: intersecting cones double-count, and
the most important finding — the DM's own orders interacting — vanishes between separate
entries. Entanglement is DETECTED mechanically over the receipts graph and rendered
CONSOLIDATED:
- **CHAINED**: decree B applied to state decree A created (B's cone roots inside A's cone).
- **SHARED**: both cones feed the same downstream event.
- **CONFLICTING**: a descendant of one reverses/negates a descendant of the other —
  SELF-CONFLICT is a first-class named finding ("your embargo undid your granary order").
- **SYNERGISTIC**: an outcome whose receipt traces to descendants of BOTH.
RENDERING: entangled decrees form ONE cluster entry — the joint story, then per-decree
contributions and standings WITHIN it; singletons render per §5 unchanged. Shared
descendants attributed once (no double-count). The honest-nulls rule extends: "absorbed BY
YOUR OWN DECREE Y" is a distinct standing from plain "absorbed" — the interaction IS the
news, because both were their choices. Pin: a constructed two-decree conflict fixture must
render as one cluster naming the conflict, never as two independent entries.

## 6. LOAD-BEARING SOURCING RULE
The chronicle derives from the DURABLE stores (receipts / chronicle / obligations / op
ledgers) — NEVER from the capped display feeds (wizardNews 240 etc.), so long spans never
read through eviction holes. Caps remain a display-feed concern only. If any story-relevant
durable source is itself capped, that is a FINDING to report, not to paper over.

## 7. LAWS
Pure read-models (view-time projection; nothing persists — the SM town-map precedent);
deterministic (same world ⇒ same chronicle, pinned); zero eager (lazy panel; entry-cost
measured + quoted); register guards bind all prose (crier voice via existing corpora;
glossary-linked; no UI verbs in fiction); every claim clickable to receipts (the S1
citation-law pattern applied to the UI); goldens byte-identical (display lane).

## 8. COHERENCE MATRIX
×RECEIPTS/PROVENANCE (the substrate — threads and cones are graph reads) · ×E0 TEMPO
(drama classes type the threads; boundedness = tractability) · ×D7 REFRAME (decree-reception
irony, seamed) · ×S2 BRIEFS (the composers are ingredient bundles; the chronicle is the
in-app sibling of the session-prep brief — share extraction, don't duplicate) · ×FORECAST
(delta-diff precedent) · ×CATCH-UP COLLAPSE (the interval already executes week-by-week —
the chronicle READS what it wrote) · ×GUIDANCE (the pyramid is self-explaining; whispers
per the standing criterion) · ×PREMIUM SEAM (chronicle depth is display; tier never touches
derivation).
