# Simulation Intelligence Layer — Design

**Status:** PROPOSED (design only — no code in this revision)
**Companion doc:** [analytics-event-taxonomy.md](./analytics-event-taxonomy.md) (full event catalog + instrumentation map)
**Audience:** future implementation session. Every file path, property path, and enum below was verified against the repo as of this writing.

---

## 1. Goals & two-plane architecture

SettlementForge should capture how users create, edit, connect, map, AI-polish, share, and revisit
settlements — serving two distinct consumers that share one capture pipeline:

| Plane | Consumer | Contents | Storage |
|---|---|---|---|
| **1 · Product telemetry** | tuning the app (funnels, edit heatmaps, AI usage, retention, coarse-region splits) | `essential`-class events: coarse props, enums, bands, counts — never prose, never names | first-party `analytics_events` (canonical) + mirrored to PostHog (dashboards UI) |
| **2 · Research dataset** | a structured corpus of *how humans design coherent settlements* (usable beyond TTRPG: game design, procgen research) | structural fingerprints, edit sequences, regional-graph topology, stressor lifecycles | **first-party only** — `settlement_snapshots`, `edit_events`, `research.*` schema. Never leaves Supabase. Explicit opt-in. |

**Core principle: track semantic actions, not clicks.** The simulation model already speaks in
frozen enums — `EDIT_KINDS` (10 values, `src/domain/pendingEdits.js:42`), 14 `SYSTEM_VARIABLES`
with 5 `CAUSAL_BANDS` (`src/domain/causalState.js:67,89`), 13 `REGIONAL_CHANNEL_TYPES`
(`src/domain/region/graph.js:15`), stressor lifecycle statuses, prosperity labels, defense
readiness labels. Event props and fingerprints are built **from these enums**, which is what makes
the dataset machine-readable and domain-general.

The lifecycle being captured:

```
arrive → configure → generate → inspect → edit → regenerate → connect (neighbours)
       → map → AI-polish → export/share → revisit → evolve (world pulse / regional cascade)
```

### What exists today (build on, don't replace)

- `src/lib/analytics.js` — frozen `EVENTS` enum (**41 events**, lines 48–106), `track(event, props, {userId})`
  with DNT respect, whitelist check, SHA-256-truncated `userIdHash`, fire-and-forget dispatch to
  `window.__sf_analytics_provider`. `Funnel` convenience wrapper; `sf_anon_generated_v1` attribution flag.
- `src/lib/analyticsProvider.js` — provider seam. Plausible path works; **PostHog path is plumbed but
  commented out** (lines 85–104: `npm i posthog-js` + uncomment dispatch; env `VITE_POSTHOG_KEY` / `VITE_POSTHOG_HOST`).
- `scripts/eslint-plugin-analytics.js` — `funnel-event-contract` rule: `track()` must use `EVENTS.*` constants.
- **No backend sink.** Events go nowhere in production. `supabase/functions/_shared/requestMeta.ts:30`
  already anticipates this: *"The optional `anonymous_telemetry` table (migration TBD)…"*.
- Supabase: 31 migrations (next = **032**), `botGuard` ingress guard (`requestMeta.ts:140`), pg_cron
  precedent (migration 024), redaction precedent (`_gallery_sanitize_public_json`, migrations 020/030/031),
  anonymous device-token precedent (`gallery_views` + `src/lib/deviceToken.js` key `sf_view_token`).

---

## 2. Identity & erasure model

### Problem with the status quo

The client-derived `userIdHash` (SHA-256 truncated to 16 hex chars) is weak pseudonymization: it is
brute-forceable against a leaked user-id list, and it permanently couples the analytics key to the
auth key. It also cannot support erasure ("delete my data") because the hash can be re-derived forever.

### Design: random actor id + deletable mapping tables

Events carry a **random `actor_id` uuid derived from nothing**. Two service-role-only tables map
real identities to actors; deleting a mapping row makes that actor's history permanently anonymous,
and deleting by `actor_id` is a cheap indexed hard-erase.

```sql
-- 032_analytics_core.sql (sketch)
create table public.analytics_identity_links (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  actor_id   uuid not null unique,
  created_at timestamptz not null default now()
);

-- device_key = sha256(ANALYTICS_HASH_PEPPER || sf_view_token); pepper lives only
-- in edge-function secrets, so a DB dump alone cannot correlate tokens to actors.
create table public.analytics_device_links (
  device_key text primary key,
  actor_id   uuid not null,
  created_at timestamptz not null default now()
);
-- RLS enabled, ZERO policies, grants revoked from anon/authenticated
-- => service-role only (house pattern: gallery_views, migration 029)
```

- **Anon→signup stitching:** at ingest, resolve actor by JWT first, else by peppered device key.
  When a request carries *both* a JWT and a device token and the user has no actor yet, **adopt the
  device's actor** as the user's actor. One actor then spans the anonymous funnel through signup —
  `SIGNUP_AFTER_ANON` becomes a real join instead of a localStorage flag. (Keep the flag; it still
  drives client-side conditional firing.)
- **Erasure:** `purge_analytics_for_user(p_user_id uuid)` — SECURITY DEFINER, service-role-execute-only.
  Deletes `analytics_events` / `edit_events` / `settlement_snapshots` by actor, then both mapping rows.
  Returns per-table counts. Wire into the account-deletion path and `admin-actions`.
  The `on delete cascade` on the identity link is the belt (account deletion instantly orphans
  history even if nothing else runs); the purge function is the suspenders.
- The client **stops sending `userIdHash` to the first-party sink** entirely. The backend never sees
  a raw user id outside JWT verification. (The PostHog mirror may keep hashed ids — see §9.)
- Pepper rotation orphans device links (acceptable: anon continuity is best-effort). Document in
  `docs/abuse-model.md`.

---

## 3. Consent tiers

Three tiers, stored in `profiles.telemetry_consent jsonb` (column precedent: `email_notifications`,
migration `018_account_billing_models_credits.sql:7`) mirrored to localStorage `sf_consent_v1`
(`{ essential, research, ai_prose, updatedAt }`; newer `updatedAt` wins on login — opt-in propagates
across devices).

| Tier | Default | Unlocks |
|---|---|---|
| `essential` | **on**, unless DNT or explicit opt-out | product telemetry: all 41 existing events + most new ones. Coarse props only. |
| `research` | **off** — explicit opt-in | full structural fingerprints, `edit_events` payloads, raw `_seed`, the 4 research-class events |
| `ai_prose` | **off** — reserved, no v1 events | future prose-delta analysis of `edit-prose` payloads. Named now so the consent UI doesn't churn later. |

Rules:

- **Stamp-at-write:** every row records the `consent_tier` in force at capture. Downgrades apply
  going forward; retroactive erasure goes through `purge_analytics_for_user()`. State this in the UI copy.
- **Server clamps:** effective tier = min(client-asserted, `profiles.telemetry_consent`). Anonymous
  requests clamp to `essential`/product — anon users can never contribute research rows (no account
  to consent with).
- **Client gates before enqueue:** `track()` checks a frozen `EVENT_CLASS` map (parallel to `EVENTS`)
  — `essential` | `research` (| `ai_prose` reserved). Research-class events are never even built
  without consent (defense in depth: `captureFingerprint()` early-returns before extraction).
- **PostHog consent banner** (consequence of the sink decision, §9): PostHog sets cookies, so a
  lightweight banner gates `posthog.init()`. Declining PostHog still allows first-party essential
  telemetry (cookieless, pseudonymous, legitimate-interest posture, DNT honored). Softening options:
  `persistence: 'memory'` (cookieless PostHog, weaker cross-session joins) or the EU cloud host.
- **UI surfaces:** a `PrivacySettings` section in `src/components/AccountPage.jsx` (three plain-language
  toggles + data explainer link), and a one-time post-first-save `ResearchOptInCard`
  (pattern: `src/components/dossier/WelcomeCreditCard.jsx`). Both fire `consent_updated`.
- The default purge deletes **everything including research-consented rows** — erasure beats dataset
  completeness. The research dataset's durability comes from aggregate tables and exports, which
  contain no actor ids.

---

## 4. Backend schema (migrations 032–035)

Storage posture: **Postgres only.** Scale math: a generous 5,000 MAU × 80 events/week ≈ 21M rows/yr
at ~250 B/row ≈ 5 GB/yr before pruning. Plain tables + BRIN + nightly rollups + monthly prune —
no partitioning (its automation is the dominant ops cost at this scale and it breaks the
`(batch_id, seq)` idempotency key), no ClickHouse, no Kafka. The warehouse escape hatch is designed
in, not deferred: monotonic bigint id cursor + typed dimension columns + JSONL export means standing
up DuckDB/ClickHouse later is an afternoon.

### 4a. `032_analytics_core.sql`

Identity/device links (§2), consent column (§3), purge function (§2), plus:

```sql
create table public.analytics_events (
  id           bigint generated always as identity primary key,
  event        text not null check (event ~ '^[a-z][a-z0-9_]{2,63}$'),
  actor_id     uuid,                          -- null => purged/orphaned (kept, anonymous)
  session_id   uuid,
  subject_id   uuid,                          -- settlement/map uuid when relevant; no FK (subjects are deletable)
  props        jsonb not null default '{}'::jsonb
               check (pg_column_size(props) <= 8192),
  consent_tier text not null check (consent_tier in ('product','research')),
  country      char(2),                       -- server-stamped from cf-ipcountry; IP never stored
  app_version  text,
  events_rev   smallint not null default 1,   -- EVENTS contract revision
  client_ts    timestamptz,                   -- client clock (display only)
  created_at   timestamptz not null default now(),  -- server clock (canonical)
  batch_id     uuid not null,
  seq          smallint not null,
  unique (batch_id, seq)                      -- idempotency: retried batches no-op
);
create index analytics_events_event_time on analytics_events (event, created_at desc);
create index analytics_events_actor_time on analytics_events (actor_id, created_at desc) where actor_id is not null;
create index analytics_events_subject    on analytics_events (subject_id) where subject_id is not null;
create index analytics_events_brin_time  on analytics_events using brin (created_at);
create index analytics_events_props_gin  on analytics_events using gin (props jsonb_path_ops);
-- RLS on, zero policies, grants revoked => service-role only
```

Notes: no event-name FK/enum in the DB (validation happens in the edge function against the shared
EVENTS bundle; a DB enum would force a migration per new event — the regex is the backstop). GIN is
included up front because "exhaustive ad-hoc querying" is a stated goal; `jsonb_path_ops` keeps it small.

**`edit_events` — separate table, deliberately.** Three reasons: (1) edits are the highest-value
research signal with a *stable typed shape* (`EDIT_KINDS` is frozen; cascade preview has fixed keys) —
typed columns make every core research query an index scan instead of a jsonb-path scan over the big
table; (2) consent divergence — a `product`-tier user still appears in the edit *heatmap* via the
existing `EDIT_*` events in `analytics_events`, but structured edit payloads are research-gated, and
two tables make that separation structural; (3) the big table stays lean and prunable while
`edit_events` is small and kept forever.

```sql
create table public.edit_events (
  id              bigint generated always as identity primary key,
  actor_id        uuid,
  session_id      uuid,
  settlement_uuid uuid not null,
  snapshot_id     bigint references public.settlement_snapshots(id) on delete set null,
  kind            text not null check (kind in (
    'rename-npc','rename-faction','rename-settlement',
    'add-institution','remove-institution',
    'add-resource','remove-resource',
    'add-stressor','remove-stressor','edit-prose')),   -- verbatim EDIT_KINDS, pendingEdits.js:42
  target_kind     text,            -- npc|faction|institution|resource|stressor|prose|settlement
  payload_redacted jsonb not null default '{}'::jsonb check (pg_column_size(payload_redacted) <= 2048),
  cascade         jsonb,           -- { downstreamCounts:{npcs,hooks,factions,linkedSaves}, narrativeImpact, summaryCount }
  edit_seq        smallint not null,   -- position in the session's edit queue (ordering = research gold)
  reverted        boolean not null default false,
  consent_tier    text not null default 'research' check (consent_tier = 'research'),
  client_ts       timestamptz,
  created_at      timestamptz not null default now(),
  batch_id        uuid not null,
  seq             smallint not null,
  unique (batch_id, seq)
);
create index edit_events_kind_time   on edit_events (kind, created_at desc);
create index edit_events_settlement  on edit_events (settlement_uuid, edit_seq);
```

`payload_redacted` is per-kind allowlist-only, built client-side (§7): e.g.
`rename-npc → { fromLen, toLen, sameInitial }` (never the names);
`add-institution → { category, tags }` (taxonomy values);
`edit-prose → { section, deltaLen }` (never the prose).

Rounding out 032: `ingest_rate_buckets` + `ingest_check_rate(p_key, p_max, p_window)` (tiny
upsert-and-count bucket table; 120 batches/hr per identity key — conservative per
`docs/abuse-model.md` house style, false negatives cheaper than blocking real users).

### 4b. `033_settlement_snapshots.sql`

Hybrid layout: normalized **hot columns** for everything dashboards GROUP BY on, one redacted
`structural` jsonb for everything researchers mine. (Full-jsonb makes the preferences dashboard a
jsonb-extraction festival; full normalization into child tables freezes the structural schema too early.)

```sql
create table public.settlement_snapshots (
  id                bigint generated always as identity primary key,
  actor_id          uuid,
  session_id        uuid,
  settlement_uuid   uuid not null,
  trigger_event_id  bigint,          -- co-occurring analytics_events.id (no FK; events get pruned)
  capture_point     text not null check (capture_point in
    ('generated','saved','canonized','exported','ai_polished','pulse_advanced')),
  consent_tier      text not null check (consent_tier in ('product','research')),
  schema_version    text, generator_version text,
  seed              text,            -- research-tier only; replays procedural output, never user content
  tier              text, population_band text,
  -- hot columns (exact source paths in §7)
  prosperity        text,            -- economicState.prosperity (label enum)
  food_resilience   smallint,        -- economicState.foodSecurity.resilienceScore
  legitimacy        smallint,        -- powerStructure.publicLegitimacy.score
  defense_military  smallint, defense_monster smallint, defense_internal smallint,
  defense_economic  smallint, defense_magical smallint,   -- defenseProfile.scores
  faction_count     smallint, institution_count smallint,
  npc_count         smallint, condition_count smallint, stressor_count smallint,
  condition_archetypes text[],       -- activeConditions[].archetype
  campaign_phase    text,            -- campaignState.phase: draft|preplay|canon
  narrative_mode    text,            -- ai_data.narrativeMode (null = no AI)
  ai_violation_count smallint,       -- sum of aiViolations counters
  structural        jsonb not null check (pg_column_size(structural) <= 32768),
  fingerprint_hash  text not null,   -- truncated sha256 of canonicalized structural jsonb
  created_at        timestamptz not null default now(),
  unique (settlement_uuid, capture_point, fingerprint_hash)   -- unchanged re-capture = no-op
);
create index snapshots_capture_time   on settlement_snapshots (capture_point, created_at desc);
create index snapshots_settlement     on settlement_snapshots (settlement_uuid, created_at);
create index snapshots_archetypes_gin on settlement_snapshots using gin (condition_archetypes);
```

Capture-point sourcing: `generated` (post-pipeline, anon included — **minimal** fingerprint:
hot columns + causal state only), `saved` / `canonized` (save path + phase transition), `exported`
(PDF success), `ai_polished` (narrative success), `pulse_advanced` (world tick, capped 5 saves/pulse).
The **full** `structural` payload requires `research` consent; product-tier rows carry the minimal form.

**`research` schema** — consent filtering as structure, not as a WHERE clause someone forgets:

```sql
create schema if not exists research;
create view research.snapshots as
  select id, capture_point, schema_version, generator_version, seed, tier, population_band,
         prosperity, food_resilience, legitimacy, faction_count, institution_count,
         condition_archetypes, campaign_phase, narrative_mode, structural, fingerprint_hash, created_at
    from public.settlement_snapshots
   where consent_tier = 'research';            -- actor_id / session_id deliberately not exposed
create view research.edits as
  select id, settlement_uuid, kind, target_kind, payload_redacted, cascade,
         edit_seq, reverted, created_at
    from public.edit_events;                    -- research-only by check constraint
-- granted to service_role only
```

### 4c. `034_analytics_rollups.sql`

- `analytics_daily_rollups (day, metric, dims jsonb, value, pk(day,metric,dims))` — persisted table
  (not an MV) so funnel history **survives raw-event pruning**; upserted nightly.
- Dashboard views: `v_funnel_first_gen`, `v_settlement_preferences`, `v_edit_heatmap`, `v_ai_usage`,
  `mv_retention_cohorts` (§9 lists what each answers). Example fragment:

```sql
-- v_funnel_first_gen
select created_at::date as day,
  count(*) filter (where event = 'homepage_view')                  as homepage,
  count(*) filter (where event = 'anonymous_generation_started')   as gen_started,
  count(*) filter (where event = 'anonymous_generation_completed') as gen_completed,
  count(*) filter (where event = 'signup_gate_seen')               as gate_seen,
  count(*) filter (where event = 'signup_after_anon')              as signup_after_anon,
  count(*) filter (where event = 'paid_after_anon')                as paid_after_anon,
  count(distinct actor_id) filter (where event = 'anonymous_generation_completed') as gen_actors
from analytics_events group by 1;
```

- Research MVs (each with a unique index for `REFRESH … CONCURRENTLY`):
  `research.mv_archetype_clusters` (condition-archetype co-occurrence by tier via `unnest` self-join,
  plus causal-band distributions), `research.mv_institution_cooccurrence` (category pairs from
  `structural->'institutions'`), `research.mv_edit_frequency` (kind × target_kind × phase counts,
  revert rate, median `edit_seq` depth — `percentile_cont(0.5)`).
- `report_*` SECURITY DEFINER functions (one per dashboard, execute → service_role only) so the
  edge function assembles no SQL.
- `export_cursors` one-row table for incremental export bookmarks.

### 4d. `035_analytics_cron.sql`

pg_cron, in migration-024's exception-safe `DO $$ … cron.schedule … $$` style:

| Job | Schedule | Action |
|---|---|---|
| `analytics-rollup-daily` | `25 3 * * *` | `rollup_analytics_daily()` (upsert yesterday) + `REFRESH MATERIALIZED VIEW CONCURRENTLY` all MVs |
| `analytics-prune-monthly` | `45 4 1 * *` | delete `analytics_events` older than **400 days**; delete `ingest_rate_buckets` older than 2 days. `edit_events` / `settlement_snapshots` are **never auto-pruned** — they *are* the dataset |
| `research-export-monthly` | `15 5 2 * *` | `pg_net` POST (shared-secret header) → edge function `analytics-export`, which streams `research.snapshots` / `research.edits` / `analytics_daily_rollups` as gzipped **JSONL** to private bucket `research-exports/YYYY-MM/…`, cursored by `export_cursors` |

JSONL over parquet: no Deno-native parquet writer worth the dependency; JSONL loads into
DuckDB/warehouse with a one-liner, and volumes are megabytes. Guard the pg_net call in the same
`exception when undefined_table` style (pg_net may be unavailable locally).

---

## 5. Ingestion — `supabase/functions/ingest-events/index.ts`

New edge function, deployed `--no-verify-jwt` (anonymous traffic is the point). Direct client
inserts under RLS were rejected: they can't validate event names, can't stamp geo/consent
server-side, can't pepper-hash device tokens, and turn the anon key into a spam funnel into an
append-only table. A SECURITY DEFINER RPC can't validate against the shared JS contract. The house
pattern for guarded ingress (botGuard, requestMeta, validated contracts) lives in edge functions.

### Shared contract module

1. Extract the frozen enum into a **pure data module** `src/lib/analyticsEvents.js`
   (`export const EVENTS`, `EVENT_CLASS`, `EVENTS_REV`, per-event-family prop allowlists, and
   re-export `EDIT_KINDS`). `src/lib/analytics.js` re-exports it — all 41 call sites and the ESLint
   rule are untouched.
2. Generalize `scripts/build-edge-shared.mjs` from its single hardcoded entry to an entries array →
   emits `supabase/functions/_shared/analyticsEventsBundle.js` + its own `.meta.json`. Add a
   freshness test cloned from the aiGrounding bundle's freshness test.

### API contract

```
POST /functions/v1/ingest-events
Headers: Authorization: Bearer <jwt>   (optional)
Body (≤ 64 KB):
{
  "batchId": "uuid",                    // persisted client-side until 2xx ack
  "sessionId": "uuid",
  "deviceToken": "<sf_view_token>",     // optional; hashed server-side with pepper
  "appVersion": "x.y.z",
  "eventsRev": 1,
  "consent": "product" | "research",    // client-asserted; server clamps
  "events":    [ { "seq": 0, "event": "edit_committed", "ts": 171..., "props": {...}, "subjectId": "uuid?" } ],  // ≤ 50
  "edits":     [ { "seq": 60, "settlementUuid": "...", "kind": "add-institution", "targetKind": "institution",
                   "payloadRedacted": {...}, "cascade": {...}, "editSeq": 3, "reverted": false, "ts": ... } ],   // ≤ 20
  "snapshots": [ { "seq": 90, "settlementUuid": "...", "capturePoint": "saved",
                   "hot": {...}, "structural": {...}, "fingerprintHash": "hex", "ts": ... } ]                     // ≤ 2, ≤ 32 KB each
}
→ 202 { "accepted": {events, edits, snapshots},
        "rejected": [ { "seq": 7, "reason": "unknown_event"|"props_too_large"|"duplicate"|"consent_insufficient" } ] }
→ 400 invalid / 403 botGuard / 413 too large / 429 rate-limited
```

Server pipeline per request:

1. `botGuard(req, 'ingest-events')` (`requestMeta.ts:140`; satisfies `validate-edge-functions`' guard contract).
2. Resolve actor: JWT → `analytics_identity_links` (create on first sight, **adopting** the device's
   actor if one exists — §2); else peppered device hash → `analytics_device_links`; neither →
   accept with `actor_id = null` (still useful in aggregate).
3. Clamp consent (§3); reject `edits` and full `snapshots.structural` per-item below `research`.
4. Validate event names against the bundled EVENTS; validate `edits[].kind` against bundled
   `EDIT_KINDS`; enforce prop allowlists; **strip string props > 64 chars** (server-side prose backstop).
5. Rate-limit via `ingest_check_rate` (120 batches/hr per `u:<actor>` / `d:<device_key>` / `ip:<ip>` key).
6. Service-role insert, `on conflict (batch_id, seq) do nothing`; snapshots
   `on conflict (settlement_uuid, capture_point, fingerprint_hash) do nothing`.
7. Stamp `country` (`cf-ipcountry`, fallback `x-vercel-ip-country`), `created_at`, `consent_tier`, `events_rev`.

Side benefit: `generated` snapshots close the gap noted in `docs/abuse-model.md` — anonymous
generation volume finally becomes visible server-side.

---

## 6. Client capture layer

Files to create: `src/lib/analyticsQueue.js`, `src/lib/session.js`, `src/lib/consent.js`,
`src/lib/structuralFingerprint.js`, `src/lib/researchCapture.js`.
Files to modify: `src/lib/analytics.js` (EVENT_CLASS gate; re-export from `analyticsEvents.js`),
`src/lib/analyticsProvider.js` (register first-party sink as default provider, **chained** with PostHog).

### Transport (`analyticsQueue.js`)

- `track()` → consent/DNT/whitelist gate → enqueue record
  `{ event, props, event_ts, seq, session_id, subject_id? }`. Essential-class events are *also*
  mirrored to the third-party provider chain; **research-class events are never mirrored**.
- In-memory queue + write-through localStorage spill (`sf_evt_queue_v1`, debounced 1 s) — survives
  reloads and crashes. Restore on module init.
- Flush triggers: 20 events / 30 s interval (lazily started) / `visibilitychange→hidden` and
  `pagehide` via `navigator.sendBeacon` (≤ 64 KB chunks). Normal flush:
  `fetch(..., { keepalive: true })`, exponential backoff 1 s→4 s→16 s→60 s, max 5 attempts, then
  re-spill for next session; hard-drop after 24 h.
- Caps: 300 events or 256 KB — **drop-oldest**, carry `dropped_count` in the next envelope.
- Consent revocation purges research-class records from the queue before the next flush.
- Never throws, never blocks UI — same contract as today's `track()`.
- Graceful degradation: if Supabase is unconfigured (`saves.js` `isConfigured` pattern), the queue
  disables itself; the provider mirror still works.

### Session (`session.js`)

`sf_session_id` (sessionStorage UUID) + `sf_session_last_seen`; rotate on > 30 min idle, checked on
every `track`. On mint, fire `session_started` (reads the `useReturnVisit` localStorage stamp for
`days_since_last_visit_band`).

---

## 7. Structural fingerprint contract

`extractSettlementFingerprint(settlement, save?, campaignContext?)` in `src/lib/structuralFingerprint.js`
(name avoids clashing with the existing `src/lib/settlementFingerprint.js`, whose
`settlementFingerprint()` stable-stringifies the *entire* settlement including prose — correct as a
hash input, never shippable as a payload).

**Allowlist extraction** — the inverse philosophy of `_gallery_sanitize_public_json` (which strips
known-bad): the extractor **copies known-good paths only**, so prose cannot enter by construction.

Included (exact paths):

| Group | Fields |
|---|---|
| identity/versioning | `schemaVersion`, `generatorVersion`, `_seed` (research tier only — replays *procedural* output, never user edits/prose), `tier`, **banded** `population` |
| config | `config.{culture, terrainType, tradeRouteAccess, magicLevel, monsterThreat}`, priority flags, `selectedStresses` (archetype ids) |
| economy | `economicState.prosperity`, `foodSecurity.resilienceScore`, `primaryExports`/`primaryImports` (category ids), `activeChains` by `status` + `chainId`s |
| power | `publicLegitimacy.{score,label}`, factions as `{category, power_band, archetype}` — **names → stable indices `f0`,`f1`…** so graph topology survives without user text; `conflicts.length` |
| defense | `defenseProfile.scores{military,monster,internal,economic,magical}`, `readiness.label` |
| stress | stressor type/archetype ids; `activeConditions[]` as `{archetype, severityBand, status, affectedSystems}` |
| institutions | counts by `category` + capped tag histogram (taxonomy values) |
| counts | npcs (count + role-category distribution only), relationships, hooks, services |
| causal | full `deriveCausalState(settlement)` output — **both** `scores` (richer for research) and `bands` (what dashboards group by); ~400 B for all 14 variables |
| neighbours | relationship types only (`neutral|allied|trade_partner|patron|client|rival|cold_war|hostile`) |
| lifecycle (from `save`) | `campaignState.phase`, canonized/exported booleans, `eventLog` count, `versionHistory` count, committed-edits-by-kind histogram |
| ai (from `save.aiData`) | has_narrative / has_daily_life / `narrativeMode`, `aiViolations` counters (`invented, removed, renamed, contradicted, canonChanged, historyDropped` — verbatim from `src/store/aiSlice.js:60-61`) |
| world (pulse moments) | `worldState.tick`, volatility band, roaming/residual stressor counts |

**Excluded by construction:** `settlement.name`; every `npcs[]` field (name, personality, goal,
**secret**); institution/faction names; all prose (history text, hook text, dailyLife, thesis,
dmCompass); `dossierNotes`; custom-content text; `eventLog` labels; `wizardNews` text; gallery
description/images; map coordinates; emails.

Sizing: ~1.8–2.5 KB JSON (~700 B gzipped in batch). Hashes:

- `fingerprint_hash` = truncated SHA-256 of `stableStringify(fingerprint)` — export `stableStringify`
  from `src/lib/settlementFingerprint.js:1` (one-line change); reuse the truncated-SHA pattern from
  `analytics.js`'s `hashUserId`.
- `content_hash` = truncated SHA-256 of `settlementFingerprint(settlement)` — correlates analytics
  rows with the `narrativeSourceFingerprint` stale-detection without shipping the source string.
- `prev_fingerprint_hash` (module-level ref per settlement id) chains evolution sequences.

**Reduced fingerprint** — `extractReducedFingerprint(settlement)`:
`{ tier, population_band, culture, terrainType, tradeRouteAccess, magicLevel, monsterThreat,
prosperity, stressor_count, condition_count, institution_count, npc_count, faction_count, causal_bands }`.
Coarse/enum-only, same posture as existing event props → folds into `generation_completed` props
as **essential** class. The settlement-preferences dashboard works from day one, before any
research opt-ins exist.

---

## 8. Event taxonomy v2 (summary)

Full catalog with per-event triggers, props, and the product question each answers:
**[analytics-event-taxonomy.md](./analytics-event-taxonomy.md)**.

- All **41 existing events keep their names**; 6 get richer props (non-breaking).
- ~**58 new events** across 10 namespaces: generation (7), dossier_reading (7), editing (6 new + 4
  extended), ai (7), campaign/world_pulse (10), regional_graph (6), map (5), sharing/export (5),
  library/revisit (5), research/consent (2).
- Exactly **4 are research-class**: `generation_step_timings`, `world_stressor_transitions`,
  `regional_graph_snapshot`, `settlement_fingerprint_captured`. Everything else is essential.
- All durations/gaps **banded** (`lt_5s…gt_30m`; `same_day…gt_30d`); population banded; props use
  model enums verbatim; never names or text.

---

## 9. Dashboards & PostHog division of labor

**Decision (owner): first-party canonical + PostHog in parallel.**

| Concern | PostHog | First-party |
|---|---|---|
| funnels, retention curves, path analysis, ad-hoc product exploration | ✅ zero build cost | possible via SQL but not the first stop |
| essential-class events | ✅ mirrored | ✅ canonical |
| research-class events, fingerprints, edit payloads, seeds | ❌ **never sent** | ✅ only home |
| identity | hashed id (existing `hashUserId`) | random actor (§2) |
| consent | cookie banner gates `posthog.init()` | DNT + essential opt-out |

PostHog activation: `npm i posthog-js`, uncomment the dispatch in
`src/lib/analyticsProvider.js:88-104` (`installPostHog`), set `VITE_POSTHOG_KEY` (+ optional
`VITE_POSTHOG_HOST`; EU host `https://eu.i.posthog.com` is the privacy-friendlier default to note).
The provider seam supports chaining: first-party sink runs always; PostHog only after banner consent.

First-party dashboards: new **"Analytics" tab in `src/components/AdminPanel.jsx`** calling a new
`admin-actions` action `get_analytics_dashboard` (precedent: `get_stats` in
`supabase/functions/admin-actions/index.ts`):

```
POST /functions/v1/admin-actions
{ "action": "get_analytics_dashboard",
  "dashboard": "funnel"|"preferences"|"edit_heatmap"|"ai_usage"|"retention",
  "from": "...", "to": "...", "granularity": "day"|"week" }
→ { success, dashboard, rows, refreshedAt }
```

The five core dashboards and what they answer:

1. **First-gen funnel** (`v_funnel_first_gen`) — does the value moment land; where anon users leak.
2. **Settlement preferences** (`v_settlement_preferences`, snapshots `generated` vs `saved`) — tier
   mix, prosperity/legitimacy/defense distributions (`width_bucket`), top condition archetypes,
   **kept-vs-discarded deltas** (what people generate vs what they bother saving).
3. **Edit heatmap** (`v_edit_heatmap`) — most-edited kinds/sections, commit/revert ratios, cascade-size
   quantiles. *Edits reveal dissatisfaction*: institutions repeatedly removed are over-generated.
4. **AI usage** (`v_ai_usage`, joinable to `credit_ledger`) — completion rate, credits per narrative,
   verifier violation rate, narrative-mode mix, AI-before-vs-after-editing ordering.
5. **Retention / worldbuilding depth** (`mv_retention_cohorts`) — cohort matrix; actors with ≥1
   `canonized` snapshot; `pulse_advanced` recurrence; revisit gaps.

Research questions answered via SQL on `research.*` + monthly JSONL exports (DuckDB-ready):
which stressors are most often removed · which suggested regional channels get confirmed vs disabled ·
edit-sequence motifs before canonization · institution co-occurrence archetypes by tier · whether
AI-polishers edit less afterwards · stressor lifecycle outcomes (resolution vs echo) by counterforce
strength · graph topology of player-built regions.

---

## 10. Dev ergonomics & testing

- **ESLint:** keep `funnel-event-contract`; add `analytics-props-hygiene` to
  `scripts/eslint-plugin-analytics.js` — flags object-literal props in `track()`/`Funnel.track()`
  containing banned keys (`name, newName, text, prose, secret, description, notes, email, body, label`)
  and identifier-spreads of domain objects (`...settlement`, `...npc`). Register in `eslint.config.js`.
- **Taxonomy coverage test** (`tests/analytics-taxonomy.test.js`): `Object.keys(EVENT_CLASS)` ≡
  `Object.keys(EVENTS)`; all classes valid.
- **Redaction canary test** (`tests/lib/structuralFingerprint.test.js`): a fixture settlement's NPC
  names/secrets/prose must never appear in extractor output — recursive value scan. *The privacy
  guarantee is a test, not a convention.* (Style precedent: the prompt-injection canaries.)
- **Debug overlay:** `src/components/dev/DevEventStreamPanel.jsx`, cloned from `DevFlagPanel.jsx`
  (DEV-gated). Shows live event stream (name, class chip, props, gated/dropped reason), consent
  state, session id, queue depth, last flush status, via a DEV-only ring buffer (last 100) exposed
  by `analyticsQueue`.
- **E2E** (`e2e/analytics-capture.spec.js`, pattern: `flow-a-generate-save-export.spec.js`):
  `page.route` the ingest URL; generate→inspect→edit→commit→save; assert envelope contains
  `generation_completed`, `edit_committed`, `settlement_saved`; with research consent pre-seeded,
  assert `settlement_fingerprint_captured` present and recursively free of banned values; with
  DNT/denied consent, assert **zero** ingest calls; assert spill key populated on page close
  (sendBeacon assertions are flaky — test the spill instead).
- **Contract test** for the edge function (`tests/edgeFunctions/ingest-events.contract.test.js`) +
  bundle freshness test.
- CI: `validate:edge` auto-discovers function dirs; write the new functions in TS with the
  `guard.reject` pattern and the existing regex contract passes unchanged.

---

## 11. Phased build order (~12–16 days)

| # | Increment | Contents | Yields |
|---|---|---|---|
| 1 | **Foundation + sink** (3–4 d) | migration 032; `analyticsEvents.js` extraction + multi-entry `build-edge-shared.mjs`; `ingest-events` fn; `analyticsQueue`/`session`/`consent` (minimal settings row, no full UI); `EVENT_CLASS` over the existing 41 (all essential); PostHog activation + consent banner; reduced fingerprint in `generation_completed`; `DevEventStreamPanel` | sessionized funnels over all 41 events + config/output distributions, immediately |
| 2 | **Core taxonomy** (4–5 d) | generation/dossier/editing/ai/library events; `useSectionDwell` hook; extended props on the 6 existing events; `credits_spent`; hygiene lint + taxonomy/canary tests | edit heatmaps, AI-timing-vs-editing, section engagement, revisit gaps |
| 3 | **World, graph, research UX** (3–4 d) | migration 033; campaign/regional/map/sharing events; full fingerprint capture at all 6 points; `PrivacySettings` + `ResearchOptInCard`; consent column sync in `authSlice` | graph-topology + stressor-lifecycle dataset begins accruing |
| 4 | **Dashboards + ops** (2–3 d) | migrations 034–035; `get_analytics_dashboard` in admin-actions; AdminPanel Analytics tab; `analytics-export` fn + bucket; `scripts/deploy.sh` (deploy `ingest-events --no-verify-jwt`; secrets `ANALYTICS_HASH_PEPPER`, `EXPORT_SHARED_SECRET`); `docs/abuse-model.md` update | self-serve dashboards; monthly research exports; ops loop closed |

---

## 12. Scale posture & non-goals

- **Postgres-only until proven otherwise.** ~21M rows/yr, ~5 GB/yr pre-prune; every dashboard hits
  an index or a pre-aggregated table; zero new infrastructure. Escape hatch designed in (§4).
- **Non-goals (v1):** session replay; fine-grained geo (country only — never IP, never city);
  demographic inference; any training on or harvesting of user prose (`ai_prose` tier exists so the
  consent UI is future-proof, but it gates nothing in v1 and defaults off); real-time alerting;
  third-party CDPs.
- **Trust posture, stated plainly for users:** product usage and settlement *structure* are
  collected to improve the generator; private campaign text, NPC secrets, and notes are user IP and
  never enter analytics; research contribution is opt-in, anonymous, and structural-only; data can
  be deleted; DNT is honored.
