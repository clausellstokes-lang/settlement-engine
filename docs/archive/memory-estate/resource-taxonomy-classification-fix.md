---
name: resource-taxonomy-classification-fix
description: "resourceTaxonomy substring-collision fix (grain_fields/coal) + the 33-key classification pin; branch 48719d7a verified an ANCESTOR of w7-prep at the 2026-07-17 resume — landed, nothing pending"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4db76617-dfda-4849-8575-e1fd2794926c
---

Fixed two pre-existing misclassifications in `src/domain/worldPulse/resourceTaxonomy.js`
`classifyResource()` on 2026-07-15 (found during the W-DISCOVERY build). recoveryMode is
load-bearing: it drives the lit recovery drift (tierResourceDynamics, resourceDriftEnabled) AND
W-DISCOVERY permanent removal (resourceDynamicsKernel — removal fires only on recoveryMode==='manual').

- **grain_fields** was `magical` (requires_high_magic) because "bar**ley**" tripped the unanchored
  `ley` → `/ley/`→`/\bley\b/`. Now managed/natural (farmland recovers).
- **coal_deposits** was `renewable` because its stray `commodities:["timber"]` tripped RENEWABLE
  `/timber/`. 'timber' is a real token, so a word boundary CANNOT fix it — instead a **subterranean-
  category resource no longer sets `renewable`** (mined seams are exhaustible). Now nonrenewable/manual
  and removal-eligible.
- Hardened: `ore`/`coal` in NONRENEWABLE got leading `\b` (stop matching "forest"/"shore"/"charcoal");
  currently masked, zero-shift, future-proofing.

**The pin:** `tests/domain/resourceTaxonomyClassification.test.js` hand-checks all 33 catalog keys
against an EXPECTED table + boundary guards. RULE: a new RESOURCE_DATA entry must extend EXPECTED
(the coverage assertion fails otherwise — forces a hand-check, don't just trust the regexes).

**Verified CONFIRMED:** base-vs-fix diff = exactly 2 keys changed (31 byte-identical); full suite
9663 green; no golden shifted (dormancy golden's dormant path never calls classifyResource; lit path
uses iron_deposits); 3 adversarial lenses PASS. No one-time-shift needed.

**Handoff:** committed @ `48719d7a` on branch `claude/fix-resource-taxonomy-boundaries` (off
review-fixes tip b9eddc3b, in worktree brave-babbage-67b994). ⚠️ MERGE into `review-fixes-2026-07-08`
is OWNER-GATED — not pushed/merged. (Verifying the build contract here required the
[[stale-dist-gate-gotcha]] workaround.)
