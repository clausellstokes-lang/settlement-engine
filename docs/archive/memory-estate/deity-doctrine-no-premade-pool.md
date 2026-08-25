---
name: deity-doctrine-no-premade-pool
description: Owner ruling 2026-07-21 — NO premade deities; custom-content introduction only; faith engine total over 0..MAX deities; pool+latent-seeding removal queued T4
metadata: 
  node_type: memory
  type: project
  originSessionId: 230c87b4-b237-4d1b-a63e-af48dfb233a0
  modified: 2026-07-22T05:48:57.412Z
---

# THE DEITY DOCTRINE (owner ruling 2026-07-21, supersedes the pool half of the 2026-07-10 religion-rework ratification)

**No premade deities anywhere.** The ~24-name governed pool (src/generators/data/deityPool.js) and
the latent seeding (seedStartingPantheon step + latentPantheon activation seam) are to be REMOVED.
Deities enter a world ONLY via custom-content introduction (customContentSchema.validateDeity —
typed axes = the FINITE-SEMANTICS compliance; name/portfolio = flavor). Premium gate unchanged.

**The engine must be TOTAL over deity count:** correct at 0 (nameless-faith default = the
certified-inert ground state / neutrality theorem — KEEP), at 1, at 2, and at any combination up
to MAX. One deity spreads coherently ALONE — organic rise cult → minor → major via the
faith-delta/advancePantheon tiering; uncontested spread is a legitimate plot line, not an error.
Gates unchanged: faith-spread toggle ON and at least one deity present.

**Why the owner ruled this** (argument that dissolved the manager's pool defense): the schema is
the type system (pool not needed for typing); regional coherence is EARNED by spread simulation,
not pre-baked (more on-brand: simulate, don't roll); the premium loop "author your god, watch it
rise" beats "receive our god names."

## Execution state — ✅ BOTH HALVES DONE (generation half landed 2026-07-28)
- REFERENCE half: deleted 2026-07-22 via the operations-legibility lane.
- **GENERATION half: DONE in the T4 ONE-REGEN batch, 2026-07-28 (UNCOMMITTED at write time;
  orchestrator folds).** `src/generators/data/deityPool.js` and
  `src/generators/steps/seedStartingPantheon.js` DELETED; the step de-registered from
  `steps/index.js`, `assembleSettlement` deps and `stepMetadata`; `tests/domain/deityPool.test.js`
  and `tests/generators/seedStartingPantheon.test.js` deleted. Generation now bakes NO pantheon
  and no `config.faith`.
- ⚠️ **`latentPantheon.js` was deliberately KEPT** and is now a LEGACY-ONLY seam (header says so).
  Pre-batch saves carry `config.latentPantheon`; deleting the seam would strand every
  un-activated old save. The new walker pins its survival so a future "finish the job" cleanup
  reds.
- **PREVENTION:** `tests/lint/noPremadeDeityPool.walker.test.js` — no pool module reference in
  src, no `deity:core:` mint outside a self-invalidating allowlist, the step registered nowhere,
  and the seam still exported. E-A entry is `kind:'rationale'`.
- **DECLARED SHIFT:** `tests/fixtures/generator-golden-master.json` re-recorded **523/523 rows**,
  0 added/removed (the corpus is 523 rows — the batch spec's "187" was WRONG). Root corpus
  `tests/generation.test.js` stayed GREEN with its inline snapshot BYTE-UNCHANGED, which is the
  executable proof that per-step named PRNG forks isolated the removal to the deity keys.
- **The lifecycle hazard above was traced and PROVEN, not assumed:** embeds ride `config` through
  regeneration (new pin), and a fresh generation bakes nothing (new pin). NO read path anywhere
  resolves a `deity:core:` ref against the deleted pool — resolution-by-lookup does not exist in
  this codebase; embeds are self-contained snapshots and refs are opaque strings to every reader.
  The one user-visible consequence, declared: a never-activated old save that is FULLY
  REGENERATED loses its latent gods.
- ⚠️ LIFECYCLE HAZARD for the removal spec: existing premium saves carry activated pool gods
  (primaryDeitySnapshot embedded, refs `deity:core:<slug>`). Every path that could chase a
  core ref back to the deleted pool file must be traced (read, regen, undo, import — E-C class).
  Snapshots ride the save, so embeds should survive; PROVE it, don't assume.
- Related: [[the-promise-ratified]] (tier never touches generation stays true — trivially, since
  nothing seeds), [[finite-semantics-law]] (schema-typed customs ARE compliant), the H19 import
  scrub keeps defending the activation gate.
- The manager's per-world name-skinning proposal is DEAD — superseded by this ruling.

## ⭐⭐ THE FAITH-AGNOSTICISM LAW (owner, 2026-08-06, verbatim intent)

"Faith is right to be [a] slimmer system... we have to treat it
agnostically. It is nothing more than an extension of culture and
traditions. The users have to determine whether a divine act happens
and whether to attribute any meaning to it. Not our faith system. And
by divine action, it simply means that they [the DM] edit the
settlement or states themselves, and they tell their players this
happened because a god did so."

**THE LAW:** the engine simulates faith SOCIOLOGICALLY (belief
communities, traditions, clergy institutions, conversion-as-cultural-
pressure, faiths carried by populations and veterans) and NEVER
THEOLOGICALLY (no engine-resolved miracles, no gods as actors, no
divine causation). Divine action enters ONLY through the DM's
edit-plus-attribution channel — the authorship covenant at its apex
(gods are the ultimate named characters; the no-fates law extends to
them). A simulated god is a mechanic; an unsimulated god is numinous.
The prior "faith is the thinnest limb" assessment is REVISED: the limb
is deliberately capped, and the war-circulation additions (veteran
vectors, blend integrals) ARE its sociological maturation — no
theological waves are owed, ever.

**Chair refinement (accepted, vetoable): THE ATTRIBUTED EDIT** — a
DM's divine-act edit may carry an optional in-world attribution tag
("act of the Reaper"); receipts and the Herald carry it as the world's
story, and the belief machinery treats the attribution as CONTESTED
BELIEF, never fact — pious towns accept, rival faiths reinterpret,
skeptics shrug, per their alignment and faith state. The engine
simulates the congregation, never the miracle. Slots as a small wave
beside the WF sociological set (edit machinery + belief joins + Herald
voice — rides existing machinery).
