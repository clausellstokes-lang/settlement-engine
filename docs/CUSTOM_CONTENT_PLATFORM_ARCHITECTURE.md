# Custom content: a controlled extension language for one world

## Decision

SettlementForge custom content is a controlled extension language over the
existing generator, simulation, campaign, and settlement-scene vocabulary. It
is not a free-form rules engine and it is not a second copy of the world model.

An author may describe anything. An authored definition value may cross into
durable game state only after admission by the icon-free
[`custom-content.manifest.json`](../schema/custom-content.manifest.json).
A reviewed-derived artifact may cross that boundary only through its separately
documented exact schema, and every custom node it names must resolve to
manifest-admitted revision evidence. Every authorable field must say whether it
changes mechanics, presentation, or neither, and whether that behavior is
immediate or conditional. A derived artifact may preserve and review those
registered relationships; it may not invent a second vocabulary of effects.

This distinction is constitutional:

> Imagination may be unbounded; what enters the simulation must be typed,
> bounded, versioned, and explainable.

The platform is materially implemented, but the complete-platform claim is
withheld. The canonical manifest, reviewed authoring flow, deterministic sample
preview, usage echo, immutable definition primitives, strict pack format,
full-constitution archive and deterministic restore, account portability,
repository cutover protocol, command boundary, exact standalone environment
projection, portable campaign bindings, reviewed campaign migration and
rollback, bounded tunables, history management, and TownScene presentation
contract exist. The migration and cutover implementation are not proof that the
target cloud has been migrated or rehearsed. Production cutover proof,
provenance saturation, production-shaped rehearsal, and external product
evidence still need to be completed and certified.

[`CUSTOM_CONTENT_PROMOTION_CONTRACT.json`](./CUSTOM_CONTENT_PROMOTION_CONTRACT.json)
is the machine-readable claim boundary. It separates:

1. capabilities that repository evidence currently proves;
2. integration gates that remain open; and
3. boundaries intentionally deferred by product decision.

It does not convert the existence of a domain type into a claim that the product
uses that type end to end.

## Product promise

Custom content should let a user make a world recognizably theirs without
requiring them to understand SettlementForge's internal state shape. The
experience should answer five questions:

1. **What did the system understand?**
2. **Which parts have mechanical force?**
3. **When can those mechanics activate?**
4. **What would this do in a representative settlement?**
5. **Where is this definition already part of the world?**

That leads to one shared authoring sequence for manual and Surveyor-assisted
work:

```text
Describe
   ↓
Compile a bounded proposal
   ↓
Inspect every field and assumption
   ↓
Review mechanical, conditional, presentation, and unsupported effects
   ↓
Forge an unsaved same-seed sample
   ↓
Revise
   ↓
Approve one fingerprinted command
   ↓
Receive a durable or explicitly unconfirmed receipt
```

The Compendium may expose the typed form directly for experienced authors. It
must still use the same manifest, sample boundary, and mutation command as the
guided flow.

## Current truth, without overclaim

### Implemented and active in this integration

- One icon-free semantic manifest defines authorable buckets, fields, value
  bounds, effect kinds, activation rules, and named consumers.
- Generated client and edge artifacts are checked against that manifest. The
  client sends only a manifest-version handshake; the edge function owns its
  own generated authority.
- The Compendium and Surveyor surfaces show the four user-facing truth labels:
  **Mechanical**, **Conditional**, **Presentation**, and **Unsupported**.
- The manifest's semantic claims are executable. An exact-key matrix binds all
  31 current mechanical fields to their declared canonical consumers, while a
  same-seed neutrality matrix proves that all 53 current presentation fields
  leave the canonical mechanics projection unchanged.
- Current custom display labels cannot acquire built-in physics by impersonating
  legacy catalog keywords. Only unstamped legacy records remain eligible for
  native name fallbacks, and presentation work uses an isolated assembly RNG
  substream so a changed draw count cannot shift later NPC or faction mechanics.
- Surveyor authoring is an explicit seven-stage state machine rather than a
  collection of implicit component booleans.
- Sample generation runs behind a lazy worker and compares baseline and
  candidate settlements with the same seed and configuration.
- Every custom-content write crosses a fingerprinted application-command
  boundary and returns a structured receipt. Authorable content uses the shared
  definition command family; reviewed-derived supply chains use a deliberately
  separate exact-schema command lane.
- Local/offline persistence uses an immutable revision ledger. The cloud client
  is written for append-only revisions and a transactional command RPC.
- Pack v2 parsing is bounded, content-addressed, compatibility-aware, and
  dependency-diagnostic. Its portable top-level shape is exact; duplicate JSON
  keys, unknown fields, and currently unsupported cross-pack dependencies fail
  closed.
- One full-constitution archive preserves archived and active definitions,
  every immutable revision, pack releases and their ordered closures,
  environment history and activation, command receipts, and bounded nested
  audit provenance. This archive—not a publishing pack—is the account
  backup/restore and local-to-cloud transfer unit.
- Archive restore deterministically re-namespaces every identity for the
  receiving owner, rewrites dependency edges, recomputes all identity-sensitive
  hashes, and returns the exact mapping used to rebuild settlements and campaign
  bindings. Replay, browser-ledger merge, and compatible lineage
  fast-forwarding are explicit operations; divergence fails closed.
- Account import lands the constitutional archive before saves. It uses the
  confirmed archive receipt to rebuild settlement provenance plus campaign
  binding/history identities, rather than copying foreign account ids.
- The repository cutover protocol snapshots the anonymous and signed-in browser
  authorities, merges them into one dependency namespace, imports once, and
  clears both local authorities only after a confirmed cloud receipt and one
  all-snapshot compare-and-swap.
- The Compendium projects usage from saved settlements, campaigns, dependency
  records, map structures, simulation traces, and Herald/Chronicle records,
  while distinguishing exact references from legacy name inference.
- Custom institutions can select a registered TownScene profile, landmark
  prominence, material family, and glyph. Geometry, placement, LOD, collision,
  and shader ownership remain in the scene compiler.
- A standalone environment resolves only the exact definition, revision,
  content-hash, and category tuples it names. One missing or advanced head fails
  the whole extension projection closed instead of creating a partial ruleset.
- Vanilla is a true empty runtime environment. Activating it preserves authored
  definitions in the Compendium while excluding them from generation.
- Campaign creation, generation, advancement, forecast, persistence, import,
  and recovery use a portable pinned binding rather than the moving account
  library.
- Campaign migration and rollback forge an unsaved same-seed settlement,
  fingerprint the reviewed plan, compare-and-swap the active binding inside the
  canonical saved-map transaction, and retain immutable binding snapshots in
  the campaign envelope. A stale writer receives the winning remote binding
  rather than overwriting it.
- Registered environment tunables reach generation beneath explicit per-run
  configuration, and definition/environment history is manageable in the
  Compendium.
- New settlement generation retains a tamper-evident receipt containing the
  exact environment, optional campaign binding, and immutable definition
  tuples that actually materialized. Ambiguous name-only matches are omitted
  rather than promoted into false provenance.
- Reviewed supply chains persist through a dedicated local/cloud immutable
  authority. The command verifies every custom node against the owner's current
  authored heads, prevents one artifact identity from being repurposed to a
  different chain, and keeps these derived records out of generic authoring and
  publishing packs. Repository implementation is not production deployment
  evidence.

### Partially implemented or not yet end to end

- Usage echo can report exact stable references where newer records carry them;
  older saved settlements and news records often require explicitly labelled
  name inference. Stable revision provenance is not yet stamped through every
  historical consumer.
- The immutable cloud schema, archive transfer RPC, reviewed-derived command,
  and local-to-cloud cutover protocol are present through repository migration
  188. Their existence is not proof that the complete migration train is
  deployed, that a production clone has passed the rehearsal, or that the
  target policies, grants, and RPC authorities were verified after deployment.
- Mechanical reach remains category-specific. A field labelled Presentation
  is not promoted to Mechanical merely because a future consumer could use it.

### Intentionally deferred

- A public marketplace is deferred until private authoring, portability,
  licensing, moderation, compatibility, recovery, and campaign migration are
  demonstrably excellent.
- Complete genre neutrality is not claimed. The extension wall is general, but
  current vocabulary, tiers, settlement institutions, politics, religion, and
  campaign rhythms remain medieval-fantasy shaped.
- Arbitrary JavaScript, user formulas, schemas, meshes, shaders, network calls,
  and simulation physics are outside user space.
- `roofFamily`, `districtAffinity`, signage, heraldry, and other visual fields
  are not authorable until a registered consumer can validate and render them.
  The current `sceneProfileId` owns the bounded footprint, height, roof, and
  silhouette bundle.

## Constitutional invariants

### One semantic authority

`schema/custom-content.manifest.json` is the authoring, field admission, and
effect-truth authority for user-authored definitions. It contains no icons,
colors, React components, stores, transports, or provider prompts. Presentation
decoration joins by category key outside the manifest.

Reviewed supply chains are not an exception that widens that vocabulary.
`reviewedSupplyChainPersistence.js` admits one exact, non-authorable derived
artifact whose custom nodes must point back to coherent admitted definition
revisions. The derived schema may preserve topology, review evidence, and trade
endpoints; it cannot create arbitrary user mechanics or enter Surveyor, manual
definition authoring, or Pack v2.

Generated client and edge copies are build artifacts, not alternate sources of
truth. A stale artifact fails the repository gate.

The manifest is allowed to describe only behavior with a real consumer. Adding
a field requires:

1. a bounded schema;
2. an effect and activation classification;
3. a named consumer or an explicit Presentation classification;
4. admission and rejection tests;
5. an export/import decision;
6. a versioning and migration decision; and
7. user-facing wording that does not imply more reach than exists.

### Two effect axes, four human labels

The durable contract uses two independent axes:

| Effect kind | Activation | User-facing label | Meaning |
|---|---|---|---|
| `mechanical` | `always` | Mechanical | A registered consumer reads the value without a further world assignment. |
| `mechanical` | `conditional` | Conditional | A registered consumer reads the value only after the named condition becomes true. |
| `presentation` | `always` | Presentation | The value changes names, descriptions, classification, or bounded appearance. |
| unsupported | none | Unsupported | The value stays outside the admitted definition and cannot be persisted as executable meaning. |

“Conditional” does not mean uncertain. It means mechanically defined but
dormant until an explicit condition—such as institution presence, tier
eligibility, deity assignment, or live demand—is satisfied.

Some admitted string fields are mechanical only for a closed registered value
set. `mechanicalValues`, their aliases, and `fallbackEffect` are part of the
manifest authority. For example, a registered `services.category` value selects
the canonical availability and capacity bucket while the service is present;
another admitted category label remains Presentation rather than becoming a
new mechanical key.

Provider prose is never effect authority. The interpretation report is rebuilt
locally from the canonical manifest after compilation.

### Semantic claims must execute

The words Mechanical and Presentation are testable contracts, not editorial
labels. `customContentMechanicalClaims.test.js` derives the complete set of
mechanical `category.field` keys from the manifest and requires an exact match
with its executable claim matrix. Each matrix entry names the manifest consumer,
crosses that real generator or domain boundary, and observes a targeted
canonical consequence. Adding, removing, or reclassifying a mechanical field
therefore fails until its behavior has corresponding evidence.

`customContentPresentationClaims.test.js` applies the inverse law. It derives
every admitted presentation field, changes one field at a time, generates a
control and candidate settlement with the same seed, and requires their
canonical mechanics projections to match. The projection removes only named
narrative, scene, grouping, and provenance surfaces; it retains materialization,
economics, demand, food security, and the remaining simulation state. Custom
names and immutable revision identifiers are normalized because changing
presentation legitimately changes those identity-sensitive values. This makes
the boundary reviewable without pretending that the entire serialized dossier
must be byte-identical.

Mechanical lookup follows the same identity law as provenance. A materialized
definition id or local uid is authoritative and repeated projections of that
same entity count once. A genuinely identity-free legacy name-only surface
remains compatible only when one eligible definition owns that name. Two
distinct same-name definitions must not stack invisible food or finished-goods
effects behind one deduplicated dossier entity, or assign its trade label
whichever category happened to load last. When exact identity is unavailable,
that ambiguous effect fails closed and the unclassified trade label remains
visible.

Display names are not an undeclared mechanical API. Current custom entities
carry provenance, so native catalog-name, category, presentation-tag, and
resource-key heuristics stop at that boundary and read only registered custom
fields. Calling a custom hall “State Granary,” tagging it `criminal`, or naming
a custom resource “fertile_floodplain” cannot grant the corresponding built-in
physics. Unstamped legacy records retain the old unique name fallback for
compatibility.

Mixed legacy arrays are compatibility views, not ownership authorities. Resource
generation carries native membership and native depletion in
`nearbyResourcesNative` and `nearbyResourcesNativeDepleted`; exact custom
membership and depletion live in `nearbyResourceDefinitions` and
`nearbyResourceDefinitionsDepleted`. The flat resource arrays remain available
for display and older saves, while `resourceEdits.depletedCustomDefinitionIds`
persists split custom state through regeneration. Trade follows the same law:
`nativeTradeLabels` and identity-bearing `customTradeEndpoints` own semantics;
`customTradeLabels` is a readable compatibility projection. A shared display
label may therefore represent both owners without merging their activation,
depletion, provenance, or downstream mechanics.

Presentation neutrality also includes random-stream position. Canonical
coherence owns a named `canonical-coherence` assembly substream, so changing
presentation-only draw counts cannot shift later NPC or faction mechanics.

One canonical reference pack supports both proof families. It contains at least
one admitted definition in every authorable category and deliberately exercises
cross-definition relationships. Its bounded certification corpus proves:

- arbitrary fields fail closed in every authorable category;
- one deterministic case per settlement tier crosses six route and terrain
  combinations;
- settlement-bound definitions are active or ineligible according to their
  tier, while event- and assignment-bound categories remain dormant;
- materialized institution, resource, service, and trade-good records retain
  exact revision provenance;
- a custom generation cannot contaminate a later vanilla replay;
- an 18-case adversarial-name matrix crosses all six tiers with road/plains,
  isolated/mountain, and port/coastal configurations without leaking native
  keyword mechanics;
- 100 representative-town seeds retain the essential and critical invariants;
  and
- the same authored meaning survives reviewed environment activation, campaign
  pinning, account-head advancement, rollback, and destination-remapped archive
  restore.

This is strong repository evidence, not a claim of an exhaustive world-state
cross product. The six reference-pack tier cases, separate 18-case adversarial
name matrix, and 100-seed corpus are fixed deterministic regression boundaries;
broader performance, device, production, and uncoached user evidence remain
governed by the open promotion gates.

### Definitions are identities; revisions are meaning

A custom-content definition has stable identity, category, lifecycle, and a
head pointer. Authored meaning lives in immutable revisions.

```text
Definition
  id
  category (immutable)
  localUid (stable dependency address)
  headRevisionId
  archivedAt
      │
      ├── Revision 1: data + contentHash
      ├── Revision 2: data + contentHash + parent
      └── Revision 3: data + contentHash + parent  ← current head
```

An edit appends a revision. It does not rewrite history. The writer compares the
author's expected head with the current head before advancing it. A rollback is
a new forward revision containing the chosen historical data; it is never a
pointer rewind that erases intervening history.

Archive is the default removal operation. Referenced definitions must not be
hard-deleted simply because they should disappear from future authoring or
generation. Restoring an archive uses the same expected-head command path.

### A publishing pack is not an account archive

Pack v2 is a release and distribution format. It intentionally represents one
published closure. It cannot preserve the whole private constitution of an
account.

The canonical custom-content archive therefore carries:

- active and archived authored definitions plus reviewed-derived supply-chain
  artifacts;
- every immutable revision in each contiguous `1..N` lineage;
- pack identity, every retained pack version, stable entry mappings, and each
  version's non-empty ordered closure and canonical manifest;
- every retained content-environment revision and the active-environment
  pointer;
- finalized custom-content application-command receipts; and
- bounded nested provenance for archives imported earlier.

The graph has exact wrapper and row shapes, canonical UTC timestamps, aggregate
byte/node/count limits, a source-ledger fingerprint, and an archive fingerprint.
Every definition head must be the maximum revision in one linear history; every
pack and environment edge must resolve; every content, manifest, import-plan,
and environment hash must match the represented meaning.

“Full fidelity” here means complete graph and canonical JSON meaning. JSONB
does not preserve a file's original whitespace, key ordering, or other raw byte
spelling. Imported command receipts remain opaque canonical JSON evidence; they
do not become executable input.

Nested audit provenance is logically a multi-root directed acyclic graph. The
archive serializes it as nested trees because JSON has no shared-node reference,
so the same ancestor may appear beneath more than one root. Admission counts
unique archive fingerprints across the complete graph. A repeated fingerprint
is valid only when every occurrence has identical complete canonical JSON
meaning; the importer rejects a divergent duplicate. No archive may contain
more than 128 unique provenance nodes. Repeated tree serialization still
consumes the archive byte and canonical-node budgets.

Archive export is an authenticated ownership and data-rights read; it is not
premium-gated. Archive import changes the active owner graph and therefore
requires an active premium entitlement at the transaction boundary.

### Restore re-namespaces identity and proves the whole transfer

An archive contains source-account identities as provenance. A restore must
never install those identities unchanged into another owner.

The destination namespace is derived deterministically from:

```text
destination owner + stable source key + identity kind + source identity
```

That produces a complete source-to-destination map for definition ids, revision
ids, local dependency uids, pack ids, environment ids, and environment-revision
ids. The importer then:

1. rewrites every graph edge and admitted `custom:<localUid>` dependency;
2. recomputes revision content hashes after dependency rewriting;
3. rebuilds pack manifests, manifest hashes, and ordered import-plan hashes;
4. rebuilds environment revisions and environment hashes; and
5. returns the destination content and environment hashes in the identity
   receipt.

Reviewed-chain remap is ordered after authored-revision remap. The importer
first proves that every source custom node names one coherent
definition/revision/category/local-uid/revision-number/content-hash tuple. It
then rewrites those exact tuples, recomputes the ordered topology id, projection
fingerprint, and artifact content hash, and re-admits the result. A malformed
source graph cannot be “repaired” by remapping, and two current artifacts may
not converge onto the same destination chain identity.

Client preparation is not the trust boundary. The transactional server import
must independently prove that the source graph, destination transfer, and
identity map describe this exact remap before it writes anything. A valid
source archive paired with an unrelated transfer or identity map is invalid.
Source command receipts remain nested audit provenance. The destination command
journal records its own import result.

### Replay, merge, and fast-forward are distinct laws

Archive import is content-addressed and owner-scoped:

- **Replay:** the same command id and fingerprint returns the finalized receipt.
  A command id paired with different meaning fails.
- **Semantic replay and provenance convergence:** different export timestamps
  or outer archive fingerprints for the same source key, source-ledger
  fingerprint, command receipts, and nested provenance graph reuse the prior
  destination result and one provenance slot rather than consuming another
  receipt. Richer or stripped receipts and provenance remain distinct semantic
  artifacts.
- **Ledger merge:** anonymous and signed-in browser ledgers are joined before
  cloud import so cross-ledger dependencies enter one destination namespace.
  Exact immutable duplicates converge. A shared id, lineage number, local uid,
  pack entry, environment revision, or receipt with different meaning is a
  conflict, not an invitation to rename history.
- **Fast-forward:** a later archive from the same stable source may append only
  a contiguous suffix when the installed destination chain is an exact prefix.
  Replaying an equal snapshot is non-mutating; an older exact-source snapshot
  records `stale-preserved` and does not rewind. Fast-forward also requires the
  installed definition lifecycle to remain the state previously imported from
  that source; a local archive, restore, or other lifecycle edit wins and makes
  the source advance a conflict. A branch, gap, changed ancestor, or conflicting
  destination head likewise fails closed.

Admission applies limits to the resulting owner graph, not merely to the
incoming file. A sequence of individually valid imports may not accumulate a
destination state that can no longer be represented by the archive contract.
The server also constructs and re-admits the prospective canonical export
inside a subtransaction before reporting success. A size, receipt, or nested
provenance overflow rolls back every graph write and leaves a replayable failed
command outcome. The final available exported-receipt slot remains usable;
crossing the hard cap is non-mutating.

### Activation is an explicit import policy

Data merge and runtime activation are separate decisions:

- `preserve` is the default for account restore. Imported history is additive;
  the receiving owner's active pack and environment pointers remain
  authoritative.
- `adopt-if-empty` is reserved for local-to-cloud cutover. The server may adopt
  source activation only while holding the owner lock and proving the
  destination constitution was pristine before this import.

Neither mode lets a file silently replace an existing owner's active setting.
The activation policy is part of the fingerprinted import command and durable
receipt. Compatibility pointers are rebuilt only from the winning active-pack
facts; an imported but inactive closure cannot become mechanically active as a
side effect of restore.

An explicit SQL or PostgREST refusal is a confirmed `failed` outcome. Only a
response whose transaction result is genuinely unknown is
`reconcile-required`. This distinction prevents deterministic admission or
conflict errors from masquerading as transport ambiguity.

### Campaigns bind resolved environments, not a moving library

The target model has four nested immutable layers:

```text
PersistedRevision(s)
  authored definitions + reviewed-derived chains
          │
          ├── PackVersion(s) — authorable definitions only
          │       content, dependencies, compatibility,
          │       bounded tunables, visual selections
          │
          └──────────────┐
                         ↓
              ContentEnvironmentRevision
               ordered pack versions
               direct persisted revisions
               bounded tunables
               bounded visual selections
                         │
                         ↓
                CampaignContentBinding
              frozen resolved definitions and artifacts
              environment and binding hashes
```

A campaign never means “whatever is currently in My Custom Content.” It resolves
from one explicit portable binding. Existing settlements retain the definition
revision they consumed, while future generations and campaign advancement use
the campaign's current binding.

Updating a pack or direct definition in a campaign therefore requires a new
environment revision and a reviewed migration. The old binding remains a valid
rollback target. A vanilla environment is a first-class empty binding, not a
special destructive cleanup operation.

The canonical campaign record in `saved_maps.map_data` stores the active
`contentBinding` and its unique `contentBindingHistory`. A migration is accepted
only after exact-head CAS against the reviewed binding hash in
`compare_and_swap_campaign_content_binding`. The RPC locks the authenticated
owner's saved-map row, admits the complete target binding and bounded history,
and patches only binding-owned JSON paths. Concurrent map, world, and campaign
fields therefore survive a binding change. Rollback is a forward activation of
a historical snapshot; history is never rewritten. There is intentionally no
second `campaign_content_bindings` table to drift from the saved-map envelope.
The authority also requires its current history to be an exact prefix of the
reviewed history. Binding hashes may legitimately return to an earlier value,
so this second condition prevents an old review from mistaking `B -> C -> B`
for its original `B` head and erasing the intervening `C` snapshot.

The application-command journal makes an applied or stale outcome durably
replayable after a lost response. Replayed stale commands remain permanently
non-mutating, while the RPC refreshes their remote binding projection so a
second intervening device update is not presented as current truth. A saved-map
trigger rejects later blind changes to `contentBinding` or
`contentBindingHistory`, preventing an older whole-envelope upsert from undoing
a successful CAS. On conflict, the store loads only the winning remote binding
and history and requires a new review. On an ambiguous transport answer, it
restores the prior local projection, marks the binding `persistence-unknown`,
retains the exact review, and retries the same idempotent command. It never
issues a blind compensating cloud write.

### Standalone environments select definitions, not merely settings

The editable account library and the active generation environment are
different things. A personal or imported environment enumerates exact authored
definition heads and reviewed-derived artifact heads. Runtime admits a selected
head only when definition id, revision id, content hash, and category all match
the current resolved library projection. If any selected head is missing,
archived, duplicated, malformed, or advanced, the complete extension runtime
fails closed to vanilla; it never runs the surviving subset.

The Compendium exposes a reviewed **authored library** activation that creates a
content-addressed personal environment from current heads. A vanilla reset is
non-destructive: authored definitions and immutable revisions remain available
for inspection and later activation, while standalone generation receives an
empty custom-content projection.

### Stable references outrank names

The admitted tuple of `localUid`, definition id, revision id, category, and
content hash is identity. Human-readable names are labels. A content hash or
fingerprint alone is corroboration, not an address: two definitions may share
semantic content, so usage echo never upgrades a digest-only occurrence into
definition-exact evidence.

New consumers should carry a stable reference and resolved snapshot where
headless or historical execution requires one. A name match is permitted only
as a compatibility inference for older saves and must be labelled
`legacy-name` in usage evidence. It cannot be upgraded silently into exact
provenance.

### Account portability restores content before dependent saves

Account export v3 carries exactly one admitted constitutional archive. Account
import restores that archive before writing settlements or campaigns because
their source identities cannot be translated truthfully without the confirmed
destination identity receipt. A missing, malformed, refused, or unconfirmed
archive receipt stops the v3 import before either dependent family is written;
it is not downgraded into a provenance-stripping partial success.

Export fails preflight when loaded custom content lacks its authoritative
archive or when the archive's active heads disagree with the loaded
projection. Import rejects duplicate decoded JSON keys and an envelope that
tries to carry both the v3 archive and a competing legacy pack authority.

The remap rebuilds, rehashes, and re-admits:

- settlement definition, revision, local-uid, content-hash, environment, and
  environment-hash references;
- current and historical campaign bindings, including pack versions, direct
  definitions, tunables, visual selections, and environment identity; and
- settlement campaign `bindingHash` only when the corresponding campaign
  cutoff was rebuilt in the destination namespace.

A detached imported settlement may retain exact remapped definition and
environment evidence while clearing its old campaign binding hash. If a
confirmed receipt does not map every identity and post-remap hash needed by a
settlement, import removes that source provenance and reports a warning; it
never presents a foreign id as exact destination evidence.

An archive-backed v3 campaign is stricter: definition, revision, local-uid,
destination content-hash, and pack mappings must all be complete and mutually
consistent. When the archive receipt maps a standalone environment, its
environment, environment-revision, and destination-hash joins must also be
complete and hash-consistent; a partial or mismatched join fails closed.
The importer then constructs the complete remapped campaign envelope before
its first `saved_maps` insert and awaits that single insert. It never creates a
campaign with the destination account's current binding and attempts a blind
whole-envelope binding rewrite afterward.

A campaign cutoff is allowed to contain a campaign-only environment snapshot
that never existed as a standalone owner environment row. If the archive
receipt has no environment mapping at all for that snapshot, the importer may
mint one deterministic embedded environment identity in the receiving
namespace. It may not use that exception to conceal a partial mapping or to
embed a missing definition, revision, local uid, content hash, or pack.

Older account envelopes may retain their bounded pack/head compatibility path.
Those legacy envelopes may deterministically embed historical campaign
identities that never existed as account-ledger rows. A v3 archive never takes
that fallback and never degrades into per-head inserts, because doing so would
erase archived definitions, revision history, old pack closures, environment
history, and audit provenance.

### Local-to-cloud cutover is upload, confirmation, then CAS clear

Premium sign-in does not grant permission to erase browser state merely because
an upload was attempted. The repository protocol:

1. captures the anonymous and signed-in local archives under their local
   authorities;
2. records both ledger fingerprints and fences the authenticated owner;
3. explicitly selects the more specific signed-in activation when the two
   sources differ;
4. merges the source graphs and imports them through one stable source key and
   one idempotent `adopt-if-empty` cloud command;
5. accepts only a confirmed `applied` receipt; and
6. clears both local authorities in one compare-all-then-clear operation only
   if both fingerprints still match.

An account switch, ambiguous cloud response, concurrent browser edit, merge
conflict, process restart, or stale clear retains every local ledger for a safe
retry. The device migration flag is written only after the all-source clear
succeeds. That checkpoint is an optimization, not authority: newly authored
local state still triggers a later transfer. Concurrent auth effects coalesce
onto one upload and one clear.

Migration 187 is the constitutional archive and cutover base. Migration 188
forward-patches that authority for reviewed-derived artifacts. These are
repository laws, not deployment proof: production cutover remains unclaimed
until the complete migration train through 188 is deployed and the
production-shaped transfer, policy, rollback, and recovery rehearsal is
recorded.

### Every write has one command and one receipt

Every mutation crosses a fingerprinted application-command boundary and
returns a structured receipt. Manual forms, Surveyor, authored lifecycle, pack
import, mass update, archive, restore, and environment migration use the
generic custom-content command families. Reviewed supply-chain confirmation and
removal use a dedicated exact-schema derived-artifact command and RPC because
`supplyChains` is not an authorable bucket. Public pack publication is
intentionally absent until distribution has a complete moderation, licensing,
compatibility, and support model.

The mutation boundary requires:

- stable owner-scoped command identity;
- a detached preview plan;
- a SHA-256 preview fingerprint;
- manifest admission for every authorable entry, or exact reviewed-artifact
  admission plus custom-node head proof for a derived chain;
- expected-head compare-and-swap where applicable;
- atomicity for a bulk operation or an honest per-entry receipt;
- durable idempotency;
- explicit `applied`, `stale`, `failed`, or `reconcile-required` status; and
- a persistence authority that says whether confirmation came from the local
  immutable ledger or the cloud transaction.

An optimistic local projection is not success. The active store changes only
after a confirmed applied receipt.

### Vanilla behavior is a protected baseline

With no admitted custom content and no non-empty environment, generation and
simulation must retain their established deterministic output. Extension
loops use stable ordering and consume no random numbers when empty.

Preview-only priority overrides must never rewrite an authored definition, save
a sample, or leak into ordinary generation.

## Category reach

The manifest currently admits eight authored categories. Supply chains are a
derived, non-authorable projection.

| Category | Present mechanical reach | Important boundary |
|---|---|---|
| Institutions | tier eligibility, optional preview priority, food and finished-goods contribution, produced services, subsumption, and reviewed-chain input gates | many descriptive facets remain Presentation; presence is a condition for most effects |
| Services | tier eligibility, critical service reconciliation, registered availability/capacity category, provider-bound food effects, and reviewed-chain provider/input gates | a service without its provider is dormant; unregistered category labels fall back to Presentation |
| Resources | tier eligibility, critical/essential presence, presence-bound food effect, and reviewed-chain output gates | `commodities` and `yields` are Conditional only inside an author-confirmed chain; `enables` remains relationship/Presentation vocabulary |
| Trade goods | demand satisfaction, finished-goods supply, institution-gated food/economic effects, and reviewed-chain input gates | free-form category text is not equivalent to a registered demand key; `requiredResources` is mechanical only inside an author-confirmed chain |
| Deities | alignment, law, and rank enter deity snapshots and registered religious consumers | mechanics activate only after assignment or introduction; temperament, portfolio, and domain remain Presentation |
| Stressors | Compendium description and bounded relationship metadata | no general user-authored stressor physics exists |
| Factions | Compendium and event-composer identity/relationships | user-authored faction simulation behavior is not currently claimed |
| Traditions | founding and dossier presentation | intentionally presentation-oriented in the current engine |
| Supply chains | reviewed node projection, per-settlement tier/materialization state, and active-only trade endpoint promotion | confirmation is not activation; custom chains remain outside native impairment/depth physics |

This table must evolve with the manifest. It is an error for UI copy to promote a
field beyond the effect declared by its registered consumer.

The four authorable `foodImpact` fields enter food economics at one boundary:
`generateFoodSecurity`, the writer of `economicState.foodSecurity`. A present
producer adds a bounded agriculture-capacity contribution; a present consumer
adds bounded daily need. Services activate through their provider institution,
trade goods through their required institution, and depleted custom resources
do not contribute. Economic viability reads the resulting canonical production,
need, and deficit rather than applying the authored effect again. World Pulse
then advances its stockpile from that same persisted structural balance, so a
custom food declaration can change later reserve drawdown without creating a
parallel tick-time food formula.

### Reviewed supply chains activate per settlement

Supply-chain confirmation records that an author accepts one deterministic
inferred relationship. It does not record that every future settlement runs
that chain.

The reviewed projection retains stable definition identity and the tier bounds
visible at review time. Confirmation also records one canonical projection
fingerprint and the exact computed authored-content hash for every custom node.
A reviewable projection must carry its exact ordered graph edges plus explicit
`imports` and `exports` arrays, including empty arrays. Top-level `resource`,
`processingInstitutions`, `outputs`, and `upstreamMissing` fields are
compatibility display aliases, not authority: runtime rebuilds those path fields
from the fingerprinted nodes and endpoints. Removing the canonical endpoint
projection therefore blocks the chain instead of reviving an unreviewed
top-level fallback.
A revision change keeps the topology-derived chain id but invalidates the old
confirmation, returns the current projection to the review queue, and blocks
runtime trade until the author reviews it again. Generation evaluates a current
review only after its final institution, resource, and service rosters exist:

- `ineligible` means at least one reviewed component falls outside the
  settlement tier;
- `blocked` means the tier is eligible but a definition is unavailable, a
  required component did not materialize, or a required resource is depleted;
  and
- `active` means every registered gate and materialized component passed.

Only `active` chains promote reviewed imports or exports into canonical trade
lists. `blocked` and `ineligible` chains remain visible with bounded,
player-safe reasons on screen and in PDF export, so absence is explainable
without inventing commerce. A legacy saved chain with no activation evidence is
shown as needing reevaluation rather than being assumed to run.

The relationship and output fields `institutions.requires`,
`services.requires`, `resources.commodities`, `resources.yields`, and
`tradeGoods.requiredResources` are therefore conditionally mechanical: they
shape the reviewed node projection and can prevent that confirmed chain from
promoting trade. They do not independently alter the native economy when no
reviewed chain uses them. Provider and required institution gates remain
authoritative even if a fuzzy inferred path omits the provider node.

Stable identity is fail-closed. If a reviewed `refId` or legacy stable custom
uid no longer resolves, the evaluator never falls back to a same-name
definition. Name fallback exists only for genuinely identity-free legacy nodes
and succeeds only when the category/name match is unique. This prevents a
deleted resource or good from silently rebinding to an unrelated replacement
that happens to reuse its display name. Inference preserves stable references
as byte-exact graph tokens; it does not case-fold them or first convert them to
display names. The topology id includes a canonical hash of the ordered exact
node UIDs, so case- or punctuation-distinct identities cannot collapse through
a readable slug. Final roster matching applies the same rule to projected
definition, revision, and content-hash identity, with exact `localUid` support
for legacy generated entities. An unrelated current entity with the same
visible name cannot materialize the reviewed node. When a label is present but
its exact identity cannot be proved, the bounded reason says the
materialization is ambiguous rather than incorrectly claiming that nothing
with that name exists.

### Reviewed chains have a dedicated persistence lane

A reviewed chain is derived and non-authorable. Surveyor, manual definition
authoring, generic lifecycle commands, and Pack v2 reject `supplyChains`.
Confirmation instead enters an exact artifact schema that carries the ordered
graph, endpoints, review evidence, and the complete custom-node tuple:
`definitionId`, `revisionId`, `revisionNumber`, `contentHash`, `localUid`,
`kind`, and `category`.

Direct confirmation proves every custom node against one coherent current,
active owner-ledger head before mutation. `chainId` is the canonical ordered
topology address; the owner-scoped artifact id is a separate persistence
identity. An existing artifact cannot be repurposed to another chain, and one
owner may have at most one current artifact for a canonical `chainId`, including
under concurrent confirmation.

A confirmation whose reviewed graph changed appends an immutable revision
behind exact-head compare-and-swap. Reconfirming the already-active,
byte-identical graph is idempotent and does not manufacture another content
revision. Archive and restore instead advance a destination-owned lifecycle
generation, so stale commands cannot mistake an `active -> archived -> active`
cycle for the original active state; that operational generation is
intentionally nonportable. The store projects success only from a confirmed
local-ledger or cloud-transaction receipt. None of those facts claims that a
particular settlement runs the chain; the per-settlement
active/blocked/ineligible evaluation remains a later boundary.

Reviewed artifacts may be selected as direct environment and campaign-binding
revisions, but they never become pack entries. Constitutional archives and
account transfer preserve their history. Restore validates the source graph
before remap, rewrites every custom-node tuple, and recomputes the chain id,
projection fingerprint, and artifact hash. A missing or incoherent pair, a
repurposed artifact, or a destination chain collision rejects the import rather
than silently repairing evidence.

Pre-188 generic `supplyChains` rows are not grandfathered into authority. The
local first-paint projection ignores the historical flat bucket while retaining
its recovery bytes; migration 188 records cloud legacy bytes in an owner-readable
quarantine receipt, removes their false definition authority, and requires
rediscovery plus explicit review.

Revisioned local quarantine preserves the affected pack and environment
evidence. An affected pack version is removed independently, so unrelated
versions survive. Environment quarantine is suffix-closed: the first affected
revision and every later revision in that same environment history are
quarantined together, while earlier valid prefixes and unrelated environment
histories survive.

This is intentionally not a second impairment engine. Custom chains still do
not enter native supply-chain depth, regional pressure, or tick-time failure
physics. That boundary remains an explicit future integration decision.

## Authoring and interpretation

### Compilation boundary

The Surveyor may turn natural language into proposed entries, assumptions, and
unsupported requests. It receives only the content-manifest version, not a
client-supplied schema that could widen server behavior.

The result is a proposal, not a write. Each proposed field is admitted again
against the local generated manifest before preview or persistence.

Unknown buckets, unknown fields, invalid enum values, oversized strings and
lists, missing required fields, and malformed records fail closed. Unsupported
authorial context may be shown in the review, but it is not smuggled into a
definition as executable data.

### Review state machine

`contentDraftSession.js` owns the seven stages:

1. `describe`
2. `inspect`
3. `effects`
4. `sample`
5. `revise`
6. `approve`
7. `receipt`

Unknown events and invalid forward transitions are no-ops. Provider calls,
workers, persistence, and React stay outside the reducer.

Every entry can be approved, edited, rejected, or left pending. Revisions clear
stale sample and receipt state. A save action cannot report completion before a
write receipt arrives.

### Same-seed sample taste gate

The sample preview invokes the canonical settlement generator twice:

- once with the current content snapshot; and
- once with accepted candidates layered into an ephemeral snapshot.

Seed and generation configuration are identical. The receipt contains
structured before/after facts—tier, population, prosperity, food state, imports,
exports, and materialized custom entities—not generated prose pretending to
prove causality.

Institutions, resources, and services may be marked mandatory only in the
candidate snapshot so the author can inspect their likely direct output. That
override is an input request, not a materialization claim: tier, provider,
dependency, and final-roster gates remain authoritative. The receipt reports
the exact-identity outcome as `materialized`, `absent`, or `ambiguous`; it never
claims presence merely because the override was requested. Deities, traditions,
factions, stressors, and goods that need assignment or world activation are
listed as `dormant`.

The authoring preview:

- is unsaved;
- runs behind a click-lazy worker;
- is cancellable and stale-response safe;
- imports the heavy generator only inside that worker; and
- does not promise a campaign migration forecast.

Campaign binding migration has a separate bounded preview. It runs the
canonical settlement generator twice with the same seed and base configuration,
once from the current binding and once from the proposed binding. The receipt
is unsaved and fingerprinted into the migration plan. It previews future
settlement generation, not arbitrary future world-pulse causality; a simulation
horizon would require its own seed, activation setup, and receipt.

## Usage echo and provenance

Usage echo is a read model, not a simulation writer. It may report:

- eligible settlement tiers;
- saved settlements with exact or inferred use;
- mechanical activation traces;
- dependent authored definitions;
- map structures carrying the reference;
- campaigns whose content binding carries the reference; and
- Herald or Chronicle mentions.

Every result carries confidence:

- `exact` means a stable identity token was found;
- `legacy-name` means an older record matched only by normalized display name.

Eligibility is not activation. Presence is not proof of causality. A Herald
mention is not a mechanical effect. The compact card summary must preserve
those distinctions even when it collapses the evidence into counts.

The next provenance step is to stamp definition id, revision id, and content
hash into the remaining simulation and historical-event consumers. Current
settlement generation already records the reviewed environment and the exact
materialized definition tuples it can prove; custom TownScene institutions and
generated custom services carry exact definition provenance. Herald, Chronicle,
tick-time simulation, and legacy records still need equivalent saturation
before name inference can shrink rather than become permanent architecture.

## Packs and environments

### Pack v2

The portable pack format separates file-format version from authored pack
version. A pack carries:

- stable `packId` and semantic `packVersion`;
- a deterministic manifest hash;
- stable `packEntryId` values;
- per-entry content hashes;
- authorship, license, and source metadata;
- app and simulation compatibility bounds;
- an explicitly empty cross-pack dependency list until a real resolver exists;
- registered tunables and visual selections; and
- the eight authorable content buckets.

`supplyChains` is deliberately absent. A reviewed chain is derived from an
owner's exact revision graph, not portable authored vocabulary. It may travel
inside the full constitutional archive, where that graph is proved and
re-namespaced, but Pack v2 rejects it as an entry.

Import is bounded to 2 MiB and 1,000 entries. It rejects unknown categories,
duplicate JSON keys, duplicate identities, invalid hashes, invalid or missing
manifest fields, unregistered tunables, unresolved intra-pack definition
references, and non-empty cross-pack dependencies. Pack entry identity maps an
update to the same installed definition rather than cloning it on every import.

The preview is atomic: a pack with rejected entries is not represented as a
clean partial success. If partial import is ever offered, it must be an explicit
new product mode with a per-entry receipt and resulting pack version.

Legacy v1 packs are adapted through a one-way compatibility path and retain
warnings about information the old format could not carry.

### Bounded tunables

The second ontology rung contains only existing public generator inputs:

- economic emphasis;
- military emphasis;
- arcane emphasis;
- religious emphasis;
- underworld emphasis; and
- whether magic exists.

Numbers are validated in the closed range 0–100. Unknown keys and invalid types
are rejected rather than clamped. Environment values are defaults beneath an
explicit settlement configuration; a setting pack may not silently overwrite a
choice the user made for that generation.

This registry is deliberately separate from internal automatic tuning and from
world-pulse physics. The live generation boundary resolves these values beneath
explicit settlement configuration. Unknown, fractional, out-of-range, or
stale-environment values fail before the PRNG is touched.

### Environment migration

A complete migration experience:

1. resolve the current and proposed environment revisions;
2. compare added, removed, and changed definition revisions;
3. compare pack versions, tunables, and visual selections;
4. identify missing or archived references;
5. show which existing settlements retain snapshots;
6. preview future-generation and bounded campaign consequences honestly;
7. fingerprint the reviewed migration plan;
8. create and bind a new immutable environment revision atomically;
9. retain the prior binding as a rollback target; and
10. offer a non-destructive vanilla reset.

The repository implements these laws for standalone environment activation and
campaign saved-map bindings. No checked box or pack upload silently
reinterprets a running campaign.

## Bounded TownScene presentation

Custom institutions currently admit four presentation fields:

| Field | Purpose |
|---|---|
| `sceneProfileId` | Selects one registered structure grammar and its safe geometry bundle. |
| `landmarkLevel` | Selects standard or landmark prominence within compiler bounds. |
| `materialFamily` | Selects one registered material family. |
| `glyph` | Selects one registered 2D/scene glyph identity. |

The scene profile is the visual archetype. It owns bounded footprint, height,
roof, and silhouette behavior. Authors do not provide raw dimensions.

TownMap and TownScene remain authoritative for:

- placement and district geometry;
- road, wall, water, and terrain interaction;
- height and collision limits;
- condition and deterioration;
- LOD and fallback massing;
- material implementation;
- player-safe projection;
- picking and provenance; and
- performance budgets.

Unknown or invalid presentation values fall back to ordinary safe massing. They
never become arbitrary SVG, mesh, texture, shader, or code execution.

The richer candidates—roof family, district affinity, signage, heraldry, and
setting-pack architecture vocabularies—should be added only as registered
amendments with real 2D and 3D consumers, fallbacks, performance limits, export
behavior, and player-safety tests.

## Security and trust boundaries

### Hostile input

Natural-language output and pack JSON are untrusted. Admission limits record
shape, field names, string lengths, list sizes, enum values, object depth, node
count, total bytes, category count, and entry count.

No content field may become:

- executable JavaScript or expression text;
- a dynamic import;
- an arbitrary URL fetch;
- HTML trusted by the renderer;
- a SQL fragment;
- a shader, mesh, or SVG program;
- a path used for filesystem access; or
- an undocumented state subtree.

### Server authority

The edge compiler uses its bundled generated manifest. The client supplies a
manifest version only for compatibility negotiation.

Cloud writes require authenticated ownership, premium entitlement at the
database policy boundary, expected-owner confirmation, command idempotency,
preview-fingerprint verification, category admission, and transactional
expected-head checks. Authorable definitions are admitted against the generated
manifest. Reviewed chains use their separate exact schema and must cross-prove
every custom node against the owner's active immutable heads; generic and pack
writers reject their category.

Client fallback for an undeployed additive migration may preserve read
availability. It must not report a revisioned cloud write as confirmed when the
transactional schema is unavailable.

### Sensitive content

Usage, previews, analytics, and worker messages must not serialize unrelated
campaign or account data. A future player-facing content browser must project
audience-safe snapshots before indexing or rendering names, descriptions,
dependencies, scene provenance, or Herald mentions.

## Determinism, performance, and accessibility

### Determinism

- Content and environment fingerprints use canonical JSON and SHA-256.
- Definition loops and resolved bindings use stable code-point ordering.
- Empty custom-content paths consume no random values.
- Same-seed previews use identical base configuration.
- Pack entry identity, dependency remapping, and local fallback ids converge
  across retries.
- Environment and campaign binding hashes cover the resolved revision set.
- Archive rows use stable ordering; the ledger and wrapper have separate
  canonical fingerprints.
- Destination archive identities derive from the same owner/source/kind/source
  tuple in local and cloud authorities. Identity-sensitive revision, pack, and
  environment hashes are recomputed after remap.
- Reviewed chain ids hash the ordered exact node identities, and JavaScript and
  SQL admit and hash the same canonical projection.
- Canonical coherence owns a named assembly RNG substream so
  presentation-only draw-count changes cannot shift downstream mechanics.

### Performance

- The custom-content compiler remains behind the Surveyor boundary.
- The sample generator remains worker-lazy and absent from first paint.
- Manifest generation avoids pulling UI decoration into the edge or domain.
- Usage echo is bounded by depth and result count; it should move to an indexed
  projection before account libraries make full JSON walking expensive.
- Pack byte, item, depth, and node limits are admission rules, not UI hints.
- Archive byte, node, graph-family, receipt, and nested-provenance limits are
  enforced before mutation and against the resulting destination constitution.

### Accessibility

- Truth labels use text, not color alone.
- The authoring sequence exposes current stage and live status.
- Typed fields retain programmatic labels, descriptions, and validation text.
- Worker progress, errors, and receipts use live regions without stealing
  focus.
- Review, sample, approve, and archive actions must remain keyboard reachable.
- A future visual vocabulary picker needs textual profile descriptions and
  non-canvas selection parity.

## Failure and recovery model

| Failure | Required behavior |
|---|---|
| Provider returns an unknown field | Show Unsupported; do not persist it. |
| Manifest versions disagree | Refuse compilation with a compatibility error. |
| Sample worker fails or is cancelled | Keep the reviewed draft; report that no sample was saved. |
| A preview priority override does not materialize, or a name-only match is ambiguous | Report `absent` or `ambiguous`; never describe the candidate as present without exact generator evidence. |
| Expected head changed | Return stale; reload history and require a new review. |
| Command response is ambiguous | Return reconcile-required; do not project optimistic success. |
| Archive RPC returns an explicit database or API refusal | Return confirmed failed with its reason; do not label a known refusal as reconcile-required. |
| Pack hash or dependency closure fails | Reject import before mutation. |
| Surveyor, a manual form, a generic lifecycle command, or Pack v2 supplies `supplyChains` | Reject it; only the dedicated reviewed-derived command may persist that category. |
| A reviewed chain's custom node no longer matches the owner's active exact head | Return a non-mutating stale or failed receipt and require rediscovery and review. |
| A reviewed artifact is repurposed to another `chainId`, or two artifacts claim one current chain | Return a non-mutating identity conflict; do not fork or overwrite the authority. |
| A pre-188 generic reviewed-chain row is encountered | Preserve recovery evidence, quarantine affected pack versions independently and the affected environment revision plus its later same-environment suffix, retain unrelated histories, and require rediscovery plus review. |
| Archive source, transfer, or identity map disagree | Reject the complete import before mutation; the server derives or cross-proves every remapped identity, edge, and hash. |
| A reviewed-chain archive node tuple is incoherent or remaps onto a duplicate destination chain | Reject the complete import; remapping may not repair invalid source evidence or merge distinct artifacts. |
| The same archive command is retried | Replay its finalized receipt; do not duplicate definitions, revisions, packs, environments, or provenance. |
| A later snapshot extends an imported lineage | Append only the proved contiguous suffix when the installed lineage is an exact prefix. |
| An imported lineage is stale or divergent | Never rewind or branch the destination. An older exact-source snapshot records `stale-preserved`; divergence finalizes a failed conflict. Both outcomes are replayable. |
| A same-source fast-forward meets a locally changed definition lifecycle | Preserve the local archive/restore state and finalize a non-mutating conflict; source history cannot silently reverse a local lifecycle decision. |
| Browser archives collide on immutable meaning | Reject the merge; do not rename one side and manufacture a false lineage. |
| Browser archives disagree about activation | Require an explicit active environment choice before merge. |
| Account restore carries an activation pointer | Preserve destination activation; only an `adopt-if-empty` cutover may adopt source activation after proving destination emptiness under lock. |
| Account provenance cannot be fully remapped | Remove the foreign source receipt and report a warning; never retain it as exact destination provenance. |
| A v3 campaign definition, revision, local-uid, content-hash, or pack join is incomplete | Fail the campaign remap closed; do not substitute an embedded identity for a missing constitutional archive join. |
| A v3 campaign environment mapping is partial or hash-mismatched | Fail closed. A deterministic embedded environment is allowed only when that campaign-only snapshot has no archive environment mapping at all. |
| Cloud archive response is ambiguous | Keep every local authority and retry the same idempotent import; do not clear or compensate blindly. |
| A local ledger changes after upload | Fail the all-owner snapshot CAS, keep all local authorities, and retry from a new merged snapshot. |
| A local immutable ledger is corrupt or uses an unknown schema | Preserve its bytes, surface a recovery error, and do not rebuild or overwrite it from the flat compatibility projection. |
| An imported campaign insert is unconfirmed | Do not expose or count the campaign as imported; retain the reconciliation result instead of attempting a blind binding rewrite. |
| Definition is still referenced | Archive it; keep revisions and resolved snapshots. |
| Pack update changes meaning | Create a new pack/environment revision and preview migration. |
| Visual profile is unknown | Use safe generic massing; preserve content identity. |
| Standalone environment cannot be resolved | Fail the complete extension projection closed to vanilla and report unresolved references; never run a partial subset. |
| Another tab or device advances the campaign binding | Return stale with the winning remote binding and history, refresh those binding-owned fields locally, and require a new review. |
| Campaign binding response is ambiguous | Restore the prior local projection, mark persistence unknown, retain the exact review, and replay the same journaled command; never issue a blind cloud compensation write. |

## Product and commercial boundary

Custom content is primarily a retention, ownership, and switching-cost feature,
not the first acquisition label. The public wedge remains “settlement
generator.” The value ladder is:

```text
settlement generator
  → saved and canon settlement
  → connected world and worldbuilder
  → living campaign engine
```

Custom content strengthens every rung after acquisition:

- a user can encode a campaign's identity;
- definitions recur across settlements instead of living in one note;
- campaigns can pin and migrate setting revisions;
- the 2D and 3D settlement views can recognize authored institutions;
- packs create portable private settings; and
- usage echo rewards continued authoring by showing content alive in the world.

A marketplace adds moderation, licensing, attribution, compatibility,
malicious-input review, creator support, payment disputes, discovery, and
long-lived update obligations. Those are a separate product program. Private
authoring and pack portability should earn trust before public distribution is
considered.

## Completion and promotion

“Custom content exists” and “the custom-content platform is complete” are
different claims.

Full-platform promotion requires all repository gates in
`CUSTOM_CONTENT_PROMOTION_CONTRACT.json`, including:

- every campaign execution path resolves a pinned environment;
- migration, vanilla reset, and rollback are reviewable and recoverable;
- pack tunables actually reach their bounded runtime consumers;
- revision history and archived definitions are manageable in the product;
- constitutional backup/restore preserves the complete immutable graph and
  account import truthfully remaps dependent settlement and campaign evidence;
- the local-to-cloud protocol proves upload before an all-source snapshot clear;
- durable cloud schema through migration 188 and its policies are rehearsed and
  deployed;
- exact revision provenance reaches every material generator, map, simulation,
  and news consumer;
- deterministic, security, accessibility, performance, and recovery evidence
  is current; and
- user validation shows that authors understand the truth labels and can
  recover from conflicts without coaching.

The current promotion ledger is:

| Contract id | Current state | What the claim means |
|---|---|---|
| `CC-MANIFEST` | implemented | one generated semantic authority |
| `CC-ADMISSION` | implemented | unknown structure fails closed |
| `CC-TRUTH` | implemented | effect labels come from registered consumers |
| `CC-SEMANTIC-CLAIMS` | implemented | exact-key mechanical probes, presentation neutrality, native-keyword isolation, RNG isolation, and one portable all-category reference corpus |
| `CC-AUTHORING-FLOW` | implemented | seven explicit review stages |
| `CC-SAMPLE` | implemented | unsaved same-seed lazy preview with truthful materialized/absent/ambiguous outcomes |
| `CC-USAGE-ECHO` | implemented with legacy inference | exact references are distinguished from name inference |
| `CC-VERSION-PRIMITIVES` | implemented | immutable revisions and expected-head checks |
| `CC-COMMAND` | implemented | every mutation uses a fingerprinted command lane and confirmed receipt |
| `CC-PACK-V2` | implemented | bounded, hashed, dependency-aware portability for authorable buckets only |
| `CC-ARCHIVE-PORTABILITY` | implemented | full constitutional graph, deterministic remap, replay, merge, and compatible fast-forward |
| `CC-ACCOUNT-PORTABILITY` | implemented | archive-first restore rebuilds settlement provenance and campaign bindings in the destination namespace |
| `CC-CUTOVER-PROTOCOL` | implemented in repository | confirmed upload precedes one all-source local snapshot CAS clear |
| `CC-VISUAL-BOUNDARY` | implemented registered subset | no arbitrary geometry or shaders |
| `CC-SUPPLY-CHAIN-ACTIVATION` | implemented | reviewed chains activate only from final tier/materialization evidence; only active endpoints trade |
| `CC-REVIEWED-DERIVED-PERSISTENCE` | implemented in repository | dedicated exact-schema CAS persistence keeps reviewed chains out of generic authoring and packs while retaining immutable lifecycle and portability |
| `CC-CLOUD-CUTOVER` | open | repository protocol and the migration train through 188 do not prove target deployment or production-shaped rehearsal |
| `CC-CAMPAIGN-BINDING` | implemented | creation, runtime, history, migration, and rollback use the saved-map binding |
| `CC-ENVIRONMENT-MIGRATION` | implemented | exact projection, diff, vanilla reset, rollback, and stale review refusal |
| `CC-TUNABLE-RUNTIME` | implemented | validated defaults reach generation beneath explicit choices |
| `CC-HISTORY-UX` | implemented | definition, archive, environment, and campaign binding recovery surfaces |
| `CC-PROVENANCE-COVERAGE` | open | stable revision evidence is not universal |
| `CC-PLATFORM-EVIDENCE` | open | cross-device and uncoached proof remains external work |
| `CC-MARKETPLACE` | deferred | private authoring and portability come first |
| `CC-GENRE-NEUTRALITY` | not claimed | current world vocabulary remains medieval-fantasy shaped |
| `CC-VISUAL-EXPANSION` | deferred | only fields with registered consumers enter the wall |
| `CC-ARBITRARY-RULES` | prohibited | user code and physics never enter this platform |

The following are not prerequisites and remain prohibited or deferred:

- arbitrary execution;
- public marketplace;
- complete genre-neutrality claims; and
- unregistered visual grammar.

## Implementation map

- `schema/custom-content.manifest.json` — canonical semantic authority.
- `scripts/generate-custom-content-manifest.mjs` — generated artifact parity.
- `src/domain/content/customContentManifest.js` — client admission adapter.
- `supabase/functions/_shared/customContentManifest.generated.ts` — edge-owned
  generated authority.
- `src/domain/content/contentDraftSession.js` — authoring state machine.
- `src/domain/content/contentEffectProjection.js` — local truth report.
- `src/domain/content/customContentSemanticAuthority.js` — provenance boundary
  that keeps current custom labels out of native keyword mechanics.
- `src/domain/content/customDefinitionIdentityProjection.js` — exact reusable
  definition/revision/local-uid/content-hash identity projection.
- `tests/domain/customContentMechanicalClaims.test.js` — exact-key executable
  probes for every manifest field currently labelled Mechanical.
- `tests/domain/customContentPresentationClaims.test.js` — same-seed canonical
  mechanics neutrality for every manifest field labelled Presentation,
  including the 18-case adversarial-name matrix.
- `tests/generators/assemblyCoherenceRngIsolation.test.js` — named-substream
  proof that presentation draw counts do not shift NPC or faction mechanics.
- `tests/fixtures/customContentReferencePack.js`,
  `tests/generators/customContentReferencePack.matrix.test.js`, and
  `tests/domain/customContentReferencePackLifecycle.test.js` — the canonical
  all-category fixture, six-tier deterministic generation corpus, 100-seed
  representative-town loop, and portable environment/campaign/archive
  lifecycle proof.
- `src/domain/content/contentSamplePreview.js` and
  `src/domain/content/contentSampleCategoryFixtures.js` — generator-neutral
  paired preview and truthful category-specific activation fixtures.
- `tests/ui/contentSampleReceipt.test.jsx` — user-facing
  materialized/absent/ambiguous preview wording.
- `tests/generators/customServiceProvenance.test.js` and
  `tests/generators/customServiceProviderGate.test.js` — exact generated-service
  identity and provider-gate evidence.
- `src/domain/content/customSupplyChainIdentity.js` — canonical ordered-topology
  chain identity shared by inference and persistence.
- `src/domain/content/customSupplyChainActivation.js` — deterministic
  active/blocked/ineligible evaluation and active-only endpoint promotion.
- `src/domain/content/customSupplyChainReview.js` — exact revision evidence,
  canonical review fingerprints, and stale-confirmation comparison.
- `src/domain/content/customSupplyChainPresentation.js` — player-safe state and
  reason copy shared by screen and PDF.
- `src/domain/content/reviewedSupplyChainPersistence.js` — exact
  non-authorable artifact schema, command plan, content hash, and archive-remap
  vocabulary.
- `src/lib/customContentLocalReviewedChains.js`,
  `src/lib/customContentReviewedSupplyChainService.js`, and
  `src/store/customContentReviewedSupplyChainActions.js` — dedicated local/cloud
  command execution, strict receipt admission, owner fencing, and store
  projection.
- `src/components/compendium/SupplyChainsManager.jsx` — discovery, review,
  rereview, and removal surface backed by the dedicated command.
- `src/workers/customContentPreview.worker.js` — lazy generator boundary.
- `src/domain/content/customContentUsage.js` — bounded reverse evidence.
- `src/domain/content/settlementContentProvenance.js` — exact environment and
  materialization receipts retained by generated settlements.
- `src/domain/content/customContentVersioning.js` — immutable revisions.
- `src/domain/content/contentEnvironment.js` — environment and campaign binding
  primitives.
- `src/domain/content/campaignContentLifecycle.js` — reviewed campaign binding
  plans, exact-head CAS, and immutable binding history.
- `src/lib/campaignContentBindingCas.js` — canonical CAS command identity,
  strict receipt admission, and transport-parity local fallback.
- `src/lib/campaignContentBindingCache.js` — narrow owner-cache receipt
  projection that preserves unrelated campaign fields.
- `src/lib/localAuthorityMutex.js` — Web Locks/IndexedDB/process exclusion for
  browser-local read/compare/write authorities.
- `src/store/campaignContentBindingSession.js` — optimistic review projection,
  server receipt handling, remote-conflict refresh, and ambiguous-response
  recovery.
- `supabase/migrations/186_campaign_content_binding_cas.sql` — owner-scoped
  row-locking CAS, narrow saved-map JSON patch, durable replay, and blind-write
  trigger wall.
- `src/domain/content/userContentTunables.js` — registered bounded defaults.
- `src/domain/content/customContentCommands.js` — reviewed command plans.
- `src/application/commands/adapters/customContentApply.js` — application
  command contract.
- `src/lib/customContent.js` — local/cloud persistence service.
- `src/lib/customContentLocalAuthorityRead.js`,
  `src/lib/customContentLocalLedger.js`, and
  `src/lib/customContentLocalLedgerMigration.js` — offline immutable authority
  quarantine, storage, and deterministic legacy identity repair.
- `src/lib/customContentArchiveContract.js`,
  `src/lib/customContentArchiveValidation.js`, and
  `src/lib/customContentArchive.js` — bounded canonical archive vocabulary,
  complete graph proof, sealing, and export projection.
- `src/lib/customContentArchiveReviewedChains.js` — cross-ledger proof for
  reviewed-node tuples, immutable artifact chain identity, and owner-unique
  current chain heads.
- `src/lib/customContentArchivePack.js` — canonical full pack-manifest
  reconstruction for source and destination closures.
- `src/lib/customContentArchiveImport.js` — deterministic destination identity,
  dependency, content-hash, pack, and environment remap.
- `src/lib/customContentArchiveMerge.js` — lossless multi-ledger merge with
  immutable-collision and explicit-activation laws.
- `src/lib/customContentArchiveService.js` and
  `src/lib/customContentLocalArchiveSession.js` — cloud/local authority parity,
  account fencing, replay receipts, and snapshot-checked local orchestration.
- `src/lib/customContentLocalArchive.js` — pure local destination application,
  compatible lineage fast-forward, activation-policy resolution, provenance
  convergence, and destination receipt construction.
- `src/lib/customContentCutover.js` and
  `src/store/customContentArchiveActions.js` — local-to-cloud merge, confirmed
  import, all-source CAS clear, hydration, and safe retry policy.
- `src/lib/accountContentReferenceInspection.js`,
  `src/lib/accountContentPortability.js`,
  `src/lib/accountSettlementContentPortability.js`, and
  `src/store/accountImportBody.js` — read-only export reference proof,
  archive-first account restore, and exact campaign/settlement identity and
  provenance rebuilding.
- `src/store/campaignImportedCreation.js` — final-envelope-first imported
  campaign creation with one awaited persistence receipt.
- `src/lib/accountData.js` and `src/lib/accountImport.js` — v3 account-envelope
  export preflight, constitutional-archive requirement, duplicate-key rejection,
  byte bounds, and one-authority admission.
- `src/lib/contentPacks.js` — strict portable pack format.
- `src/store/customContentSlice.js` — active projections and command routing.
- `src/store/campaignSlice.js` — canonical saved-map binding migration and
  rollback persistence.
- `tests/security/campaignContentBindingCas.pglite.test.js` — executed
  PostgreSQL proof of atomicity, replay, owner isolation, narrow patching, and
  stale-write rejection.
- `supabase/migrations/187_custom_content_archive_transfer.sql` — authenticated
  full-graph export plus server-validated, journaled, activation-aware archive
  import. Its repository presence is not deployment evidence.
- `supabase/migrations/188_reviewed_supply_chain_persistence.sql` — dedicated
  reviewed-derived RPC, generic-authoring fence, legacy quarantine, and
  environment/campaign/archive/account forward patches. Its repository presence
  is not deployment evidence.
- `tests/security/reviewedSupplyChainPersistence.pglite.test.js` — executed
  migration-band and authority-surface evidence. Broader deployment,
  production-policy, and recovery proof remains part of the open cloud gate.
- `tests/security/customContentArchive188Upgrade.pglite.test.js` — executed
  187-to-188 upgrade evidence for null-time normalization, winning-receipt
  lifecycle backfill, stale/local-drift exclusion, clean fast-forward, and
  identical-versus-divergent shared provenance.
- `tests/lib/customContentArchive.test.js`,
  `tests/lib/customContentArchiveMerge.test.js`, and
  `tests/lib/customContentArchiveService.test.js` — archive graph,
  deterministic remap, merge, replay, and authority-parity evidence.
- `tests/security/customContentArchiveTransfer.pglite.test.js` — executed
  PostgreSQL proof of full-graph import/export, activation policy, compatible
  fast-forward without rewind or lifecycle overwrite, finalized divergence and
  aggregate-limit failures, final receipt-slot enforcement, durable replay,
  deterministic server remap verification, owner fencing, and entitlement
  enforcement.
- `tests/lib/accountContentPortability.test.js`,
  `tests/lib/accountSettlementContentPortability.test.js`, and
  `tests/store/customContentCutover.test.js` — campaign/settlement remap and
  local-to-cloud snapshot-clear recovery evidence.
- `tests/lib/accountData.test.js` and `tests/lib/accountImport.test.js` —
  archive-required account export plus hostile envelope and duplicate-key
  admission evidence.
- `src/components/contentStudio/` — shared review and sample presentation.
- `src/components/surveyor/CustomContentPanel.jsx` — guided authoring.
- `src/components/compendium/CustomContent.jsx` — typed manual authoring.
- `src/domain/townScene/customBuildingPresentation.js` — bounded custom
  institution presentation.

If a boundary changes, update the manifest, this document, the promotion
contract, and the enforcing tests together. Do not bridge the change with an
undocumented field or an alternate write path.
