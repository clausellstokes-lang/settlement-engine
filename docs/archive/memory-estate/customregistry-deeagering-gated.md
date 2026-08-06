---
name: customregistry-deeagering-gated
description: "⚠️ customRegistry de-eagering: ~41KB REAL but OWNER-GATED (sync→async on persisted-event-writing deity actions) — never a byte-wave rider; the whale tables do NOT drop with it (FP-G11 verdict, 2026-07-17)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4e5bd424-21ab-4307-ba41-bd048bb9061e
---

FP-G11 (2026-07-17, ledger row) corrected the recorded "customRegistry de-eagering −46KB
ceiling" (FP-G10's future candidate):

**The bytes are real but reframed:** ~41KB = registry CODE only (customRegistry.js 19.8KB
+ dependencyEngine.js 16.6KB + stressTypesMeta 4.6KB minified). **The whale data tables
(institutionServices 114KB, institutionalCatalog 90KB, resourceData, tradeGoodsData,
entityTags) do NOT drop** — each is independently held eager by real first-paint consumers
(toggleSlice's persisted-toggle-key migration, mutateWorld, lookups, institutionClassify,
lib/entities).

**Why it is OWNER-GATED, not a byte problem:** settlementDeityHelpers'
setPrimaryDeityImpl/imposeCultImpl are SYNCHRONOUS, call buildRegistryFromStore, and write
PERSISTED event-log entries (applyEvent); store actions setPrimaryDeity/imposeCult
(settlementSlice.js ~:2257) return synchronously. De-eagering forces these
persistence-writing paths sync→async (+ dependencyEngine consumers in store/index.js,
customContentSlice.js) — a store API-surface change (judgment-ledger §3 class). Persisted
OUTPUT would stay byte-identical; only the API shape moves.

**How to apply:** if the first-paint margin ever demands ~41KB, commission it as its own
owner-gated lane with the async conversion designed first. Never smuggle into a reclaim
wave. Also resolved: FP-G7's formatNumber deferral (excised in FP-G11, −341 B; the two
web-worker bundles keep their independent copies harmlessly). Post-FP-G11 the eager
closure's safe-reclaim space is EXHAUSTED — every remaining eager table has a genuine
first-paint consumer; further reclaims require behavior changes.
