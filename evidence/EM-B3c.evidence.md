# EM-B3c — evidence

Every verified fact below names the command that proved it and quotes its output. A fact
without a command is not verified. Measured by an Opus COMPILE lane (session 7d3418f8's
chair kit, brief `LANE-EM-COMPILE-2.md`) on **2026-09-19 17:0x–17:3x EDT**, read-only, in
`$SP/read-tip-58fcfe614` only.

`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
`T=$SP/read-tip-58fcfe614`

---

## E0 — the tree, the clock, the preamble hash

```
$ git -C $T rev-parse HEAD
58fcfe61458b784b0470b854caf916b7c2961edf
$ git -C $T rev-parse --short HEAD
58fcfe614
$ git -C $T status -sb | head -5
## HEAD (no branch)
$ date
Sat Sep 19 17:08:49 EDT 2026
$ git -C $T status --porcelain | head -5
(no output — the read tree is clean)
```

```
$ shasum -a 256 $T/docs/implementation/preambles/EM-PREAMBLE.md
1cf5442719f2236320068afb6b4bab2b4ea49f3b08457c04ccf5eaae6a11faf6  …/EM-PREAMBLE.md
```

CONFIRMED: the preamble hash equals the chair's stamp in the brief. `docs/implementation/`
`preambles/EM-PREAMBLE.md` is 83 lines; §P2 carries rows 1–11 (row 10 the edge-shared INPUT
membership, row 11 the byte budgets).

---

## E1 — the scanner's NET-CURRENT definition, ordered numerically (measurement 1)

### E1.1 — every migration that creates or replaces the scanner

```
$ grep -rlniE "create[[:space:]]+or[[:space:]]+replace[[:space:]]+function[[:space:]]+public\._gallery_world_snapshot_is_safe" $T/supabase/migrations/ | sort
089_publish_map_server_snapshot_sanitize.sql
127_snapshot_sanitizer_config_denylist.sql
128_latent_pantheon_public_denylist.sql
130_narrow_public_note_denylist.sql
136_world_snapshot_deny_census_lift.sql
202_edit_registry_public_denylist.sql
```

Six definitions. Eleven migrations MENTION the symbol (089, 091, 127, 128, 129, 130, 136,
142, 148, 189, 202); the other five call it, revoke/grant on it, or quote it in a `comment on`.

### E1.2 — the lexical-sort hazard, measured rather than assumed

The chair's warning (`a lexical glob sorts 189 after 202's neighbours wrongly`) does **not**
fire at this tip, and the reason is measurable: every migration filename carries a
**three-digit zero-padded prefix**, so the lexical order the drift test uses is identical to
the numeric order.

```
$ ls $T/supabase/migrations | grep -E '^[0-9]' | sed -E 's/^([0-9]+).*/\1/' | awk '{print length($0)}' | sort | uniq -c
 202 3
$ ls $T/supabase/migrations | grep -vE '^[0-9]'
(none)
$ ls $T/supabase/migrations | grep -cE '^[0-9].*\.sql$'
202
```

Executed both ways (`m1-scanner-and-tokens.mjs`):

```
[LEXICAL .sort() (what the drift test does)]
  definitions, in visit order:
    - 089_publish_map_server_snapshot_sanitize.sql (1 definition(s))
    - 127_snapshot_sanitizer_config_denylist.sql (1 definition(s))
    - 128_latent_pantheon_public_denylist.sql (1 definition(s))
    - 130_narrow_public_note_denylist.sql (1 definition(s))
    - 136_world_snapshot_deny_census_lift.sql (1 definition(s))
    - 202_edit_registry_public_denylist.sql (1 definition(s))
  LATEST-WINS OWNER: 202_edit_registry_public_denylist.sql
  body length (lowercased): 4156

[NUMERIC prefix sort]
  … identical visit order …
  LATEST-WINS OWNER: 202_edit_registry_public_denylist.sql
  body length (lowercased): 4156

  lexical body === numeric body ? true
```

**CONFIRMED.** Net-current owner at `58fcfe614` = `202_edit_registry_public_denylist.sql`
(EM-B3b, landed `ac46d2daf`, 2026-09-19). The two sorts agree **today**; they diverge the
moment a four-digit prefix lands (`'1000_' < '101_'`), which is why the packet's arm A5 pins
the numeric rule now, while it is free.

### E1.3 — how many scanner functions exist, and which one the editor's keys need

```
$ grep -rhoiE "create[[:space:]]+or[[:space:]]+replace[[:space:]]+function[[:space:]]+[a-z_.]+" $T/supabase/migrations/ \
    | sed -E 's/.*function[[:space:]]+//' | sort -u | grep -iE "snapshot|saniti|safe|deny|scrub|public_json|dm_full"
public._gallery_dm_full_json
public._gallery_sanitize_public_json
public._gallery_world_snapshot_is_safe
public._saved_maps_world_snapshot_guard
```

Four related SQL objects, three of them denylist-bearing:

| object | what it is | net-current migration | does the editor's key need it? |
|---|---|---|---|
| `public._gallery_world_snapshot_is_safe(jsonb)` | the **world-snapshot SCANNER** — a recursive boolean predicate over every key at every depth; the thing `publish_map` (089) and the `saved_maps` BEFORE-write trigger (091) and the campaign-tiles RPC (148) call to REFUSE a write | **202** (089→127→128→130→136→202) | ⭐ **YES — this is the one.** `dmLayer`/`decrees` ride the settlement save blob into `gallery_world_snapshot` / `gallery_world_sections` |
| `public._gallery_sanitize_public_json(jsonb)` | the **dossier SANITIZER** — a projection that strips, not a predicate that refuses | 189 (020→033→099→123→128→130→142→189) | **NO**, ruled at EM-B3b and left net-current deliberately: `decrees` is a settlement-ROOT key its TOP-LEVEL ALLOWLIST already drops, one writer, no nested occurrence (202's header, lines 32–38) |
| `public._gallery_dm_full_json(jsonb)` | the DM-full projection (a paid surface) | 129 (030→031→099→121→129) | **NO** — it is the DM's own view |
| `public._saved_maps_world_snapshot_guard()` | the trigger that CALLS the scanner | 091 | n/a — it is a caller |

**CONFIRMED.** There is exactly **one** world-snapshot scanner and the editor's two keys must
be denied by it. EM-B3c's subject is `_gallery_world_snapshot_is_safe` alone.

---

## E2 — the client denylist's token set, through the drift test's own extractors (measurement 2)

### E2.1 — the extractors are ALREADY shared and exported (this settles the brief's question)

```
$ grep -n "^export" $T/tests/helpers/sourceContract.js
37:export function mustExtract(src, needle, label) {
67:export function functionBody(src, fnName) {
84:export function sqlFunctionBody(src, fnName) {
168:export function jsRegexTokens(regexSource) {
195:export function sqlRegexAlternation(sql) {
235:export function statementWindowAt(src, index) {
268:export function sinkStatementOffenders(src, sinkRe, carrierRe, label) {
312:export function sinkLineOffendersBlind(src, sinkRe, carrierRe) {
```

`tests/security/snapshotDenylistDrift.test.js:8` imports both by name:

```js
import { jsRegexTokens, sqlRegexAlternation } from '../helpers/sourceContract.js';
```

**CONFIRMED.** The two token extractors the charter names as EM-B3c's "required symbols" are
**exported from a shared helper**. The walker imports them; **no change-manifest widening is
owed for them.** The brief's alternative ("if file-local, move them to a shared helper — a
wider change manifest") does not arise.

### E2.2 — the extractor that IS file-local, and the measured cost of each option

Two helpers are file-local and are the ones a second consumer would need:

| helper | home | lines | what it does |
|---|---|---|---|
| `netCurrentScannerSql()` | `tests/security/snapshotDenylistDrift.test.js:30–45` | 16 | latest-wins directory walk across `supabase/migrations` |
| `netCurrentGalleryScanner()` | `tests/ops/migrationRehearsal.test.js:38–56` | 19 | **the same walk, already copied once**, returning `{sql, owner}` |
| `hardDenyMembers(sql)` | `tests/ops/migrationRehearsal.test.js:58–63` | 6 | parses the `hard_deny constant text[] := array[…]` literal |

The duplication is already acknowledged in the tree — `migrationRehearsal.test.js:38–41`:

> "the same line-anchored, latest-wins idiom tests/security/snapshotDenylistDrift.test.js
> uses, so the arm below reads the EFFECTIVE server denylist"

**Option (a) — MOVE to `tests/helpers/sourceContract.js`.** MODIFY three files:
`sourceContract.js` (+~25 eff), `snapshotDenylistDrift.test.js` (−16 / +2),
`migrationRehearsal.test.js` (−25 / +2). Four handwritten files in the manifest.
**Cost measured:** it edits two *shipped security guards*, both of them `checks` members of
LANDED packets — `tests/security/snapshotDenylistDrift.test.js` is in EM-B3a `checks[2]` and
EM-B3b `checks[2]`; `tests/ops/migrationRehearsal.test.js` is EM-B3b `checks[0]` **and** an
EM-B3b change-manifest path (E7.2). A terminal status reserves nothing, so there is no
promotion collision — but a security walker would be carrying a three-file refactor of the
two guards it exists to reinforce.
**Benefit:** one spelling of latest-wins for all three consumers.

**Option (b) — RE-IMPLEMENT inside the walker.** ~18 effective lines in the one new file.
**Cost:** a third copy of the walk.
**Benefit:** the manifest is one CREATE + one REGISTER; no landed guard is touched; and —
decisive — the walker's own **reconciliation arm (A4)** is the cure for the copies drifting:
it reds if ANY line-anchored declaration of the scanner is unextractable by *its* copy, which
is exactly the failure mode a third copy could introduce.

**RECOMMENDED: (b)**, with (a) proposed to the chair as a TOOLING-WINDOW item (the charter's
TOOL-1/2/3 slot after run 17), so the three copies collapse under one spelling without a
security walker carrying the refactor. **This is a chair question, listed in §12.**

`tests/lint/contractTestAntiVacuity.walker.test.js` does **not** force option (a): its Rule 1b
keys on extractor-name heuristics and prefers `sourceContract`, but its scope rule is about
negative matchers on extractor bindings, not about where a directory walk lives (its
docblock, lines 24–30, read whole).

### E2.3 — the token sets, executed

```
$ node m1-scanner-and-tokens.mjs
COVERT_KEY_RE tokens  (11): ["covert","rngseed","seed","rollexplanation","rollexplanations",
  "dicedetail","explanation","presnapshot","preworldstate","preregionalgraph","presaves"]
PRIVATE_KEY_RE tokens (26): ["secret","private","dm","gm","guidance","dossiernotes","tabnotes",
  "note","notes","plothook","plot_hooks","hook","compass","chronicle","pinnednpc","aidata",
  "aisettlement","aidailylife","narrativenotes","identitymarkers","frictionpoints",
  "connectionsmap","latentpantheon","decrees","seed","_config"]
JS_TOKENS union       (36)

SQL_ALTS (34): ["covert","rngseed","seed","rollexplanations?","dicedetail","explanation",
  "presnapshot","preworldstate","preregionalgraph","presaves",".*secret.*",".*private.*",
  ".*dm.*",".*gm.*",".*guidance.*",".*dossiernotes.*",".*tabnotes.*",".*notes?.*",
  ".*plothook.*",".*plot_hooks.*",".*hook.*",".*compass.*",".*chronicle.*",".*pinnednpc.*",
  ".*aidata.*",".*aisettlement.*",".*aidailylife.*",".*narrativenotes.*",
  ".*identitymarkers.*",".*frictionpoints.*",".*connectionsmap.*",".*latentpantheon.*",
  ".*decrees.*",".*_config.*"]
```

36 client tokens, 34 SQL alternatives. Note `dmLayer` is **not a token** — the client spells
it `\bdm`, which normalizes to `dm`; and `decrees` **is** a token, added by EM-B3a.

### E2.4 — ⛔ WHICH DIRECTION THE DRIFT TEST ASSERTS TODAY (the charter's premise, measured)

`tests/security/snapshotDenylistDrift.test.js`, read whole (85 lines). Its three tests are:

| line | test | what it asserts |
|---|---|---|
| `:67` | `the net-current server scanner is locatable across the migrations` | `SCANNER_SQL` truthy |
| `:71` | `the JS token set and the SQL alternation set are both non-vacuous` | `JS_TOKENS.length ≥ 30` and `SQL_ALTS.length ≥ 30` |
| `:78` | `the net-current SQL sanitizer denies the "%s" key (membership)` — `test.each(JS_TOKENS)` | for **every client token**, `SQL_ALTS.some(alt => new RegExp('^'+alt+'$','i').test(token))` |

```js
// :64
const sqlDenies = (key) => SQL_ALTS.some((alt) => new RegExp(`^${alt}$`, 'i').test(key));
```

⛔ **THE DIRECTION IT ASSERTS TODAY IS: every CLIENT REGEX TOKEN has a covering SQL
ALTERNATION alternative.** That is, verbatim, the direction the charter's EM-B3c row says it
"does NOT assert". **The charter's premise is refuted on its own wording.** The smallest
contradiction is the file's own `test.each(JS_TOKENS)` at `:78` plus the executed result in
E3.1 (36 of 36 tokens covered).

What the drift test genuinely does **not** assert, measured:

1. the **reverse** direction (a SQL alternative with no client token) — deliberately absent, and
   EM-B3a §8/`Depends on` relies on that absence to let migration 202 land before its client
   token: *"a SQL alternative with no client token reds nothing, while a client token with no
   SQL alternative reds"*;
2. ⭐ **the HARD-DENY ARRAY, in either direction.** `sqlRegexAlternation` (`sourceContract.js:198`)
   matches only `/~\*\s*\(([\s\S]*?)\)\s*then/i` — the `key ~* (…) then` expression. The
   scanner's *other* refusal mechanism, `hard_deny constant text[] := array[…]` applied at
   `202:93` as `lower(key) = any (select lower(x) from unnest(hard_deny) …)`, is **invisible
   to the drift test**. That is the real hole, and E4 shows a live gap inside it.

---

## E3 — what "covering" means, measured token by token (measurement 3)

### E3.1 — every client token against the net-current scanner

```
$ node m1-scanner-and-tokens.mjs   # (full per-token output in the run log)
UNCOVERED client tokens: []
COVERED ONLY BY A BROADER ALTERNATIVE (27):
  - rollexplanation   <= ["rollexplanations?"]        (an optional-char quantifier)
  - rollexplanations  <= ["rollexplanations?"]
  - secret            <= [".*secret.*"]               (contains-semantics)
  - private           <= [".*private.*"]
  - dm                <= [".*dm.*"]      ⭐ this is what covers `dmLayer`
  - gm                <= [".*gm.*"]
  - guidance          <= [".*guidance.*"]
  - dossiernotes      <= [".*dossiernotes.*", ".*notes?.*"]
  - tabnotes          <= [".*tabnotes.*", ".*notes?.*"]
  - note              <= [".*notes?.*"]
  - notes             <= [".*notes?.*"]
  - plothook          <= [".*plothook.*", ".*hook.*"]
  - plot_hooks        <= [".*plot_hooks.*", ".*hook.*"]
  - hook              <= [".*hook.*"]
  - compass           <= [".*compass.*"]
  - chronicle         <= [".*chronicle.*"]
  - pinnednpc         <= [".*pinnednpc.*"]
  - aidata            <= [".*aidata.*"]
  - aisettlement      <= [".*aisettlement.*"]
  - aidailylife       <= [".*aidailylife.*"]
  - narrativenotes    <= [".*notes?.*", ".*narrativenotes.*"]
  - identitymarkers   <= [".*identitymarkers.*"]
  - frictionpoints    <= [".*frictionpoints.*"]
  - connectionsmap    <= [".*connectionsmap.*"]
  - latentpantheon    <= [".*latentpantheon.*"]
  - decrees           <= [".*decrees.*"]
  - _config           <= [".*_config.*"]
```

**CONFIRMED: ZERO client REGEX tokens are uncovered.** 9 of 36 are covered by an EXACT
alternative (the whole-key COVERT channel); 27 are covered only by a broader alternative —
26 of them by the `.*token.*` contains-form, one (`rollexplanation(s)`) by the `s?` optional
quantifier. The broadness is deliberate and documented at `202:96–110`.

### E3.2 — ⛔⛔ THE LIVE FINDING: the HARD-DENY ARRAY direction

```
$ node m1-scanner-and-tokens.mjs
SQL hard_deny    (25): ["npcstates","factionstates","relationshipstates","pendingevents",
  "proposals","stressors","pausedadvance","settlementtickstates","rngseed","deferredimpacts",
  "deferredwarfronts","deferredpartyimpacts","dmlayer","decrees","religionstates","warposture",
  "occupations","martialreadiness","conquestfeeds","mercenarymarket","rulesetlog",
  "spatialdigest","spatialledgers","narrativetempo","politicsledgers"]

client HARD_DENY (28): ["npcStates","factionStates","relationshipStates","pendingEvents",
  "proposals","stressors","settlementTickStates","rngSeed","deferredImpacts","deferredWarFronts",
  "deferredPartyImpacts","dmLayer","decrees","religionStates","warPosture","occupations",
  "pausedAdvance","martialReadiness","conquestFeeds","mercenaryMarket","rulesetLog",
  "spatialDigest","spatialLedgers","narrativeTempo","politicsLedgers","factionPairStates",
  "envoyErrands","concludedWars"]

client hard-deny members ABSENT from the SQL hard_deny array: ["factionPairStates","envoyErrands","concludedWars"]
SQL hard_deny members ABSENT from the client array:            []

Are the client hard-deny members ALSO covered by the SQL alternation?
  ✗ factionPairStates <= []
  ✗ envoyErrands      <= []
  ✗ concludedWars     <= []
  (…and 22 further members ✗ by the alternation, refused by the ARRAY instead;
   only rngSeed ✓["rngseed"], dmLayer ✓[".*dm.*"], decrees ✓[".*decrees.*"] are alternation-covered)
```

⛔ **THREE client `WORLD_SNAPSHOT_HARD_DENY` members are refused by NEITHER mechanism of the
net-current scanner.** All three are real conditional ledgers:

```
$ node -e "import('$T/src/domain/worldPulse/worldState.js').then(m=>{…})"
CONDITIONAL_LEDGER_KEYS (16): ["pantheon","religionStates","warPosture","occupations",
  "pausedAdvance","martialReadiness","conquestFeeds","mercenaryMarket","rulesetLog",
  "spatialDigest","spatialLedgers","narrativeTempo","politicsLedgers","factionPairStates",
  "envoyErrands","concludedWars"]
   factionPairStates -> true
   envoyErrands      -> true
   concludedWars     -> true
```

**The drift is dated.** Migration 136 set the SQL array and its comment claims *"every
CONDITIONAL_LEDGER_KEY but pantheon"* (`136:…hard_deny constant…`, quoted below); 202 copied
136's array verbatim plus the two editor keys (`202:19–27`). Three ledgers landed on the
client after 136 and nothing forced the SQL to follow:

```
$ git -C $T log -1 --format='%h  %ad  %s' --date=short -- supabase/migrations/136_world_snapshot_deny_census_lift.sql
5463c60d3  2026-07-16  Merge branch 'claude/w-r2-guards' into review-fixes-2026-07-08
$ git -C $T log --oneline -S"'factionPairStates'" -- src/domain/display/worldSnapshotPublic.js | tail -1
5b436227f  → 2026-07-20  Round 3 wave F4: the ladder becomes visible …
$ git -C $T log --oneline -S"'envoyErrands'" -- src/domain/display/worldSnapshotPublic.js | tail -1
02a8eddbc  → 2026-08-03  WR-7a ENVOY ERRAND: make accepted peace travel home
$ git -C $T log --oneline -S"'concludedWars'" -- src/domain/display/worldSnapshotPublic.js | tail -1
545410ced  → 2026-08-31  T12 car 3 of 3: THE REGISTRATION EVENT — worldState.concludedWars lands classified
```

136's own text, for the stale claim:

```
  hard_deny constant text[] := array[
    -- always-present private worldState keys
    …
    -- conditional ledgers (135): every CONDITIONAL_LEDGER_KEY but pantheon
    'religionStates','warPosture','occupations','martialReadiness','conquestFeeds',
    'mercenaryMarket','rulesetLog','spatialDigest','spatialLedgers','narrativeTempo',
    'politicsLedgers'
  ];
```

**SEVERITY, stated without adjudication.** This is a **defense-in-depth** gap, not a proven
leak: the client serializer is ALLOWLIST-based, so a conditional ledger is never spread into
the published snapshot by construction (`tests/security/worldSnapshotDenyCensus.test.js:5–8`:
*"allowlist-based, so a conditional-ledger key is never SPREAD into the output"*), and the SQL
scanner is *"the last line before an anon read"* (`snapshotDenylistDrift.test.js:15`). What is
gone is the last line, for three ledgers. **Whether that gap is a real leak, and whether it is
closed by a new migration 203, is a SECURITY-POSTURE matter and therefore the OWNER's** —
reported, never ruled here.

**Consequence for this packet: the chartered walker LANDS RED at `58fcfe614`.** Executed:

```
=== M4b: does the base tree already RED the proposed walker? ===
{ "green": false, "why": "client hard-deny members unrefused: [\"factionPairStates\",\"envoyErrands\",\"concludedWars\"]" }
```

### E3.3 — a measured CANNOT-CATCH inside "covering"

`sourceContract.sqlRegexAlternation` strips Postgres `\m \M \y \Y` word boundaries
(`sourceContract.js:204`) because they are invalid in a JS `RegExp`. The membership test is
therefore **broader than Postgres**: `.*\mdm.*` becomes `.*dm.*`, so a key like `xdm` would
read as covered here while Postgres's anchored form would not match it. No client hard-deny
member is affected today (`dmLayer` has `dm` at a word start, so both forms match), but the
approximation is real and is shared with the drift test (`:64`) and the 202 rehearsal arm.

---

## E4 — the planted mutants (measurement 2's negative control)

Run with `m2-mutants.mjs`. Every mutant is a **string copy held in memory**; no tree file was
written, and each plant's byte change is asserted before its verdict is read (§P6's no-op-plant
rule). Three comparisons are re-implemented verbatim in scratch: today's drift direction, the
proposed walker, and the 202 arm of `tests/ops/migrationRehearsal.test.js`.

```
--- BASE (unmutated net-current, owner 202)
    plant actually changed the text/owner? false  (len 4156 vs base 4156)
    snapshotDenylistDrift.test.js : GREEN  — all client tokens covered
    PROPOSED EM-B3c walker        : RED    — client hard-deny members unrefused: ["factionPairStates","envoyErrands","concludedWars"]
    migrationRehearsal 202 arm    : GREEN  — ok

--- M-a  hard_deny loses 'dmLayer' only
    plant actually changed the text/owner? true  (len 4146 vs base 4156)
    snapshotDenylistDrift.test.js : GREEN  — all client tokens covered
    PROPOSED EM-B3c walker        : RED
    migrationRehearsal 202 arm    : RED    — hard_deny missing dmlayer

--- M-b  hard_deny loses 'decrees' only
    plant actually changed the text/owner? true  (len 4146 vs base 4156)
    snapshotDenylistDrift.test.js : GREEN  — all client tokens covered
    PROPOSED EM-B3c walker        : RED
    migrationRehearsal 202 arm    : RED    — hard_deny missing decrees

--- M-c  alternation loses '.*decrees.*' only
    plant actually changed the text/owner? true  (len 4138 vs base 4156)
    snapshotDenylistDrift.test.js : RED    — client tokens uncovered: ["decrees"]
    PROPOSED EM-B3c walker        : RED
    migrationRehearsal 202 arm    : RED    — alternation does not deny decrees

--- M-d  NEW migration 203 re-creates 136's body VERBATIM (no editor alternatives at all)
    plant actually changed the text/owner? true  (len 4105 vs base 4156)
    snapshotDenylistDrift.test.js : RED    — client tokens uncovered: ["decrees"]
    PROPOSED EM-B3c walker        : RED    — …["decrees","factionPairStates","envoyErrands","concludedWars"]
    migrationRehearsal 202 arm    : RED    — owner pin: 203_hypothetical.sql !== 202_…;
                                             hard_deny missing dmlayer; hard_deny missing decrees;
                                             alternation does not deny decrees

--- M-e  NEW migration 203 = 202's body minus BOTH hard_deny members (alternation intact)
    plant actually changed the text/owner? true  (len 4136 vs base 4156)
    snapshotDenylistDrift.test.js : GREEN  — all client tokens covered
    PROPOSED EM-B3c walker        : RED
    migrationRehearsal 202 arm    : RED    — owner pin: 203_hypothetical.sql !== 202_…;
                                             hard_deny missing dmlayer; hard_deny missing decrees
```

**What this measures, precisely:**

1. **The brief's named negative control (M-a, "`dmLayer` removed") DOES survive the drift
   test — GREEN.** The brief's expectation about the drift test is CONFIRMED. The reason is
   E2.4(2): `dmLayer` is not a client token, and the array the plant touches is invisible to
   the drift test.
2. **But M-a does NOT survive the estate.** `tests/ops/migrationRehearsal.test.js:379–394`
   (EM-B3b's registration) already asserts `hardDenyMembers(scanner.sql)` contains `dmlayer`
   and `decrees`, so M-a and M-b RED there today.
3. **The charter's headline scenario — "a NEW migration re-creating the scanner without the
   editor's alternatives" — is NOT invisible today.** M-d reds three ways; M-e reds twice. The
   catcher is the rehearsal arm's `expect(scanner.owner).toBe('202_edit_registry_public_denylist.sql')`
   pin plus its two key assertions. That pin is **brittle rather than structural**: it fires on
   ANY new scanner migration, legitimate or not, and its natural repair is to re-point it to
   203 — after which its `dmlayer`/`decrees` arms still bind, but only for those two keys and
   only while someone keeps re-pointing it.
4. **The direction that is genuinely new, general, and already violated is the hard-deny array
   subset** — RED at BASE, and it is the only comparison of the three that catches M-e at the
   *substance* rather than at a pin someone will re-point.

---

## E5 — the latest-wins parsing hazards, executed (measurement 4)

Seven synthetic sources through the drift test's regex
`/^create\s+or\s+replace\s+function\s+public\._gallery_world_snapshot_is_safe\b[\s\S]*?\$\$;/igm`
(`m3-parsing-hazards.mjs`):

```
--- H1 plain $$ body (the shape 089/127/128/130/136/202 all use)      1 match, 181 chars
--- H2 NON-$$ dollar-quote tag ($fn$), no later $$; in the file       NO MATCH — INVISIBLE
--- H3 NON-$$ tag, but a LATER unrelated $$; in the same file         1 match, 247 chars — OVER-RUNS into the next function
--- H4 the create INDENTED inside a `do $$ … $$` block                NO MATCH — INVISIBLE
--- H5 the statement quoted in a leading-hyphen COMMENT at line start 1 match — the real definition below is taken (the ^ anchor holds)
--- H6 DROP then a PLAIN `create function` (no `or replace`)          NO MATCH — INVISIBLE
--- H7 an ALTER / COMMENT-ON-only touch                               NO MATCH (changes nothing the guard reads)
```

**Measured against the tree:** no migration DROPs the scanner
(`grep -rniE "drop[[:space:]]+function[^;]*_gallery_world_snapshot_is_safe"` → *(no DROP of
the scanner in any migration)*); none re-creates it inside a `DO` block (the eleven mentions
are calls, revokes and `comment on` — E1.1); no comment quotes the create statement at line
start. **But non-`$$` dollar-quote tags are already routine in this migration corpus**, which
is what makes H2/H3 live rather than theoretical:

```
$ grep -rhoE '\$[a-z_]+\$' $T/supabase/migrations/ | sort | uniq -c | sort -rn | head
 136 $patch$
 104 $q$
  40 $job$
  40 $expr$
  16 $body$
  10 $w$
  10 $tpl$
   8 $d$
   2 $manifest$
   2 $backfill$
```

### E5.1 — the cure, and what it cannot catch

The walker finds the net-current body robustly by adding a **reconciliation arm**: every
migration whose text carries a **line-anchored** `create [or replace] function
public._gallery_world_snapshot_is_safe` must be matched by the latest-wins extractor.
Executed against the same seven cases:

```
=== M5b: reconcile "files that declare the scanner" with "files the extractor matched" ===
  H1   declares=true  extracted=true   -> both — fine
  H2   declares=true  extracted=false  -> RECONCILIATION ARM WOULD RED (declared but unextractable)
  H3   declares=true  extracted=true   -> both — fine
  H4   declares=false extracted=false  -> neither — fine
  H6   declares=true  extracted=false  -> RECONCILIATION ARM WOULD RED (declared but unextractable)
  H7   declares=false extracted=false  -> neither — fine
```

**`CANNOT-CATCH:` (the walker's header carries this list verbatim)**

- **H4** — a scanner re-created inside a `DO $$ … $$` block, where the `create` is indented and
  no line-anchored declaration exists. Zero occurrences at this tip; a `DO`-block re-creation
  is invisible to the extractor AND to the reconciliation arm.
- **H3** — a non-`$$` tag with a later `$$;` in the same file: the extractor over-runs past the
  function's real end. The reconciliation arm sees it as matched, so this shape is reported as
  covered while the parsed body is a superset. `hard_deny` and the alternation are read from
  the first occurrence in that slice, so the read is correct only incidentally.
- **H7** — an `alter function` / `comment on function` that changes nothing the guard reads
  (harmless: neither can change a denylist).
- **Postgres word boundaries** — `\m \y` are stripped, so membership is broader than Postgres
  (E3.3).
- **The database.** The walker reads the COMMITTED migration files, never a live database
  (measurement 7 / E8).
- **A key nobody registered.** The walker's client side is `WORLD_SNAPSHOT_HARD_DENY` ∪ the two
  regexes; a private key in none of them is outside the claim (that is
  `worldSnapshotDenyCensus.test.js`'s job, and it derives from `CONDITIONAL_LEDGER_KEYS`).

---

## E6 — the registration obligations, priced against the tip (measurement 5)

### E6.1 — ⭐ `tests/security/` IS an enforcer directory: the mutation-coverage row IS owed

```
$ grep -n "ENFORCER_DIRS" -A 10 $T/tests/lint/mutationCoverage.shared.mjs
36:export const ENFORCER_DIRS = [
37-  'tests/lint',
38-  'tests/design',
39-  'tests/docs',
40-  'tests/data',
41-  'tests/copy',
42-  'tests/security',      ⭐
43-  'tests/edgeFunctions',
44-  'tests/generators',
45-];
```

```js
// enumerateInvariants(root), same file
const picked = all.filter((rel) =>
  ENFORCER_DIRS.some((d) => rel.startsWith(`${d}/`)) || NAME_PATTERN.test(basename(rel)));
```

**CONFIRMED — a new `tests/security/*.test.js` is enumerated and `mutationCoverageManifest.test.js`'s
TOTALITY arm reds without a row.** 147 `tests/security/` rows exist today
(`grep -c '"tests/security/'` → `147`). The precedents for a static source-scanning security
guard are all `"kind": "uncovered"`:

```
"tests/security/snapshotDenylistDrift.test.js":  { "kind": "uncovered" }
"tests/security/worldSnapshotDenyCensus.test.js": { "kind": "uncovered" }
"tests/security/moneyRpcNetCurrentGuards.test.js": { "kind": "uncovered" }
```

⛔ **But `uncovered` is NOT available to this packet.** The SHRINK-ONLY arm
(`mutationCoverageManifest.test.js:242–258`) demands `uncovered === uncoveredBaseline`
**exactly**, and the baseline is `186` (`grep -n "uncoveredBaseline"` → `"uncoveredBaseline": 186`).
An `uncovered` row makes it 187 > 186 → RED, with the message *"A new invariant needs a
planted sweep mutation or a written rationale — never a silent gap. Never raise the baseline."*

**The row this packet owes is `"kind": "rationale"`** with a written reason ≥ 40 characters
(the well-formedness arm, `:121–124`), inserted **surgically beside its alphabetical siblings**
— the manifest is never re-serialised whole (preamble §P2.2). A `"kind": "mutation"` row would
additionally require a `scripts/mutation-sweep.sh` plant AND a `MUTATED_FILES` row
(`:158–178` DIRTY-GUARD TOTALITY), which is a second file and a second register; the estate's
own precedent for this shape is the `kindNote` idiom (*"rationale rather than a planted sweep
mutation … Upgrading to a plant later is a strict improvement needing no baseline movement"*).

The guard-the-guard floors are unharmed: `enumerated.length ≥ 686` becomes 687;
`sweepLabels.length ≥ 121` unmoved (no plant).

### E6.2 — ⛔ THE ONE COLLISION, and the order that resolves it

```
$ node -e "…PACKET_MANIFEST.json…"
ALL packets naming scripts/mutation-coverage-manifest.json OR tests/security/:  32 rows
NON-TERMINAL of those:
   READY        EM-B1d ["scripts/mutation-coverage-manifest.json"]
status histogram: {"LANDED":185,"SUPERSEDED":2,"READY":1}
```

**Exactly one non-terminal packet in the live manifest reserves this packet's REGISTER path:
`EM-B1d` (READY, building in the slot right now).** Every other 31 holder is LANDED, and a
terminal status reserves nothing.

- **EM-P2 version 3 does NOT collide at promotion**, because it is not in the live manifest at
  all: `grep -c '"EM-P2"' docs/implementation/PACKET_MANIFEST.json` → `0`. It was withdrawn to
  the chair kit at EM-B1d's placement (charter, amendments of 2026-09-19 15:3x). ⚠ It will
  reserve the path again the moment the chair re-admits it, and the charter slots it at
  **EM-T3.5** — *before* EM-B3c's train **EM-T5**.
- The EM ids in the live manifest and their statuses:
  `EM-B3a LANDED · EM-B3b LANDED · EM-B3 SUPERSEDED · EM-P3 LANDED · EM-P0 LANDED · EM-B1d READY`.

**THE ORDER THAT RESOLVES IT (measured, not preferred):** EM-B1d lands first — it is in the
slot now and EM-B3c's train is EM-T5, two trains later; EM-P2 v3 is promoted and lands at
EM-T3.5, also before EM-T5. By the time EM-B3c is dispatched **both holders are terminal and
the path is free**. No re-ordering is required; the charter's existing sequence already
resolves the collision. EM-B3c's `Collision group` is therefore
`scripts/mutation-coverage-manifest.json — with EM-B1d (READY) and EM-P2 v3 (STALE, in the
kit); both land before EM-T5 by the charter's own sequence.`

### E6.3 — the sovereignty-lighting census: a DELTA, never an absolute

```
$ cat $T/tests/lint/.lighting-census-baseline.json   (figures only)
  "measuredAtSha": "baf8ccc1da4f7e327ad1d4d053ad814a830a90bf",
  "measuredBy": "EM-P0",
  "date": "2026-09-19",
  "note": "EM-P0: one new test file (the pinned-mode battery)",
  "files": 2646, "parked": 383, "credited": 2263, "titles": 25005, "suiteTitles": 6671
```

```js
// sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests')).filter((p) => /\.test\.(js|jsx)$/.test(p))…
const titles      = credited.reduce((sum, { src }) => sum + liveTitlesIn(src).length, 0);
const suiteTitles = credited.reduce((sum, { src }) => sum + liveSuiteTitlesIn(src).length, 0);
// :1380 "TWO TITLE ARRAYS, NEVER ONE … `titles` is the EVIDENCE layer and only a credited
//        TEST ever writes to it; `suiteTitles` is kept so the split is observable"
```

So `titles` counts `it` titles and `suiteTitles` counts `describe` titles — confirmed by
EM-B3a's own stamped delta (`files +2 · … · titles +8 · suiteTitles +4` for two files of two
describes and four its each).

**EM-B3c's DELTA (the absolute is the chair's to stamp at promotion, from the live baseline):**

> `files +1 · parked +0 · credited +1 · titles +7 · suiteTitles +1`

derived from the packet's own declared file shape (§7): ONE new `tests/security/*.test.js`
with exactly **one** top-level `describe` and **seven** straight-line `it`s — no `.each`, no
loop, no conditional registration, no nested describe (preamble §P3.4). `parked +0` because
the file imports from `'vitest'` and registers statically, which is the credited shape.

Precedent for the placeholder form, EM-P0 §7: `2645 / 383 / 2262 / 25009 / 6670` →
`2646 / 383 / 2263 / … / …`. **The refreeze is the train's terminal act and the CHAIR's,
never this packet's** (preamble §P2.1: an in-packet refreeze needs a commit, the commit drifts
the sealed HEAD, and the sealed verbs then refuse — measured at EM-P0's build).

### E6.4 — the anchored-negative walker: priced at ZERO rows, with a shape constraint

```
$ grep -n "SCAN_ROOTS\|BARE_NEGATIVE_RE" $T/tests/lint/negativeAssertionAnchor.walker.test.js
83:const SCAN_ROOTS = ['tests'];
91:/** The three matchers whose subject is a collection that can silently vanish. */
92:const BARE_NEGATIVE_RE = /not\.(?:toContain|toMatch|toHaveProperty)\(/g;
809:const ceilingFor = (file) => FROZEN_UNANCHORED_NEGATIVES[file] ?? READMITTED_GENERATION_FACING[file] ?? 0;
```

The new file **is** scanned (`SCAN_ROOTS = ['tests']`) and its ceiling as an unlisted file is
**0**. The detector fires on exactly three matchers. **EM-B3c owes no
`FROZEN_UNANCHORED_NEGATIVES` row provided the walker uses none of
`.not.toContain` / `.not.toMatch` / `.not.toHaveProperty`** — which its acceptance shape does
not (its arms are `expect(list).toEqual([])` and `expect(pred).toBe(true|false)`). That is a
**contract constraint written into §7's coding instruction**, not a register row.

Separately, the estate's law that *a walker asserting absence must pair each negative with a
liveness anchor* is satisfied structurally by acceptance case **A2** (the non-vacuity arm:
extractor located, owner named, `SQL_ALTS ≥ 30`, `hard_deny ≥ 20`, client sets non-empty) —
the same shape `snapshotDenylistDrift.test.js:71` uses, and the same discipline as the
census-burn law's victory assertion.

### E6.5 — `tests/copy/voiceMechanics.test.js`: ZERO owed

Its five tiers scan `src/data/*.js`, `src/domain/**`, `src/**/*.jsx` and `src/generators/**`
(docblock tiers 1–5, read whole). **No tier scans `tests/`.** A test-only packet renders no
figure and owes prose-numerics nothing either (preamble §P2.7: *"Wave 1 renders nothing"*).

### E6.6 — `tests/lint/contractTestAntiVacuity.walker.test.js`: scoped IN, priced as a shape rule

```
 * THE SCOPE. …  tests/security/**\/*.test.*  ·  tests/**\/*.contract.test.*  ·  tests/lint/*.test.js
```

The new file is scanned. Its three rules are satisfied by construction and are written into
§7's coding instruction: **Rule 1a** no bare `if (!x) continue/return;` immediately before an
`expect(`; **Rule 1b** every extractor binding used in a negative matcher carries a non-empty
guard (A2 supplies it, and the walker routes token extraction through `sourceContract`, which
throws); **Rule 2** the exhaustive claim is DERIVED from source (`readFileSync` + `matchAll`
over the migrations and an imported `WORLD_SNAPSHOT_HARD_DENY`), never a local literal.

### E6.7 — the test-file register (`scripts/.test-ratchet-baseline.json`): ZERO owed

```
$ node -e "…"
  measuredAtSha = b43dfb7719722cf224db0d181fd51e15a4f35d85
  totalTests = 33558
  totalFiles = 2586
  skippedCeiling = 1
  uncollectedSuites = {obj 0 keys}
  entries = {obj 0 keys}
```

```
scripts/check-test-ratchet.mjs:1387  const floor = Math.floor((baseline.totalTests || 0) * SCOPE_FLOOR_RATIO);
scripts/check-test-ratchet.mjs:1388  if (baseline.totalTests && rows.length < floor) {…"the gate ran a much smaller suite than it was frozen against"}
scripts/check-test-ratchet.mjs:1408  if (baseline.totalFiles && totalFiles < fileFloor) {…"whole suites left the run"}
```

The register is a **collapse floor**, not an exact pin, and `entries` is empty. Growth by one
file and seven tests moves nothing and owes no row.

### E6.8 — observed-shape / writer-reach: ZERO owed

EM-PREAMBLE §P2.3 and §P2.4 attach to a **new domain reader** of `dmLayer`/`decrees` and to
**new readers of settlement fields under `src/domain/edit/**`**. This packet creates no `src/`
file, modifies no `src/` file and adds no domain reader; `src/domain/edit/` does not exist at
the tip. **No `EXPLAINED_WRITER_EXEMPTIONS` mint, no `check-writer-reach.mjs` movement, no
`check-observed-shape-readers.mjs` movement.** §P2.6 (the denylist mirrors) is explicitly
EM-B3's cost and *"no later member re-owes it"*.

---

## E7 — the bundle and edge-shared questions (measurement 6)

### E7.1 — nothing this packet adds is imported by `src/`, and it reaches no budgeted chunk

The change manifest contains **no `src/` path** (§7). The four budgeted closures are:

```
tests/build/generationWorkerLazy.test.js:159  export const WORKER_BUNDLE_CEILING_BYTES = 1401208;   (EXACT, zero slack)
tests/build/vendorPdfLazy.test.js:787          expect(size).toBeLessThan(679_000);                   (~870 B margin)
vite.config.js                                 EAGER_FIRST_PAINT_MODULES (the first-paint closure)
supabase/functions/_shared/*.meta.json         the five edge-shared bundles
```

A Vite/Rollup chunk is built from `src/` entry closures; a file under `tests/` is never in one,
and a JSON register under `scripts/` is not either. **EM-B3c reaches NO budgeted chunk, so it
carries NO ceiling TEST row** — the same verdict EM-B3a's pre-proof reached for its own two
test files (EM-B3a header: *"The four budgeted bundle closures were priced and this packet
reaches none of them, so it carries no ceiling TEST row"*).

### E7.2 — edge-shared INPUT membership (preamble §P2.10): NONE

The five metas are `aiCharterBundle`, `aiOutputSchemaBundle`, `aiGroundingBundle`,
`analyticsEventsBundle`, `intentAtlasBundle` (`find $T/supabase -name "*.meta.json"`). The test
is **input membership**, and every input list is composed of `src/**` and
`supabase/functions/_shared/**` sources. This packet's two change paths are
`tests/security/…test.js` (CREATE) and `scripts/mutation-coverage-manifest.json` (REGISTER);
neither is an input of any meta. **`npm run build:edge-shared` is NOT owed.**

---

## E8 — unapplied migrations, and what the walker's claim is (measurement 7)

```
$ cat $T/supabase/applied-head.json
{ "appliedHead": 200, "appliedAt": "2026-09-16", … }
```

```
supabase/migrations/202_…sql:40–45
-- ⚠️ WRITTEN, NOT APPLIED: this migration is committed for the owner to deploy. The
-- applied-head ledger (supabase/applied-head.json) is deliberately NOT bumped and stays
-- at 200 — deployment is the owner's manual act … Until then the repo head sits two
-- migrations ahead of prod (201 and 202) … and this scanner's new refusals are inert.
```

**CONFIRMED: migrations 201 and 202 are committed and NOT applied.** Production runs the
net-current scanner as of migration **136** — the body *without* `'dmLayer','decrees'` and
*without* `.*decrees.*`.

**The walker does NOT need to know about unapplied migrations, and its claim says so.** It
reads the committed files, never the database: it guards **the repository's net-current
definition of the scanner**, i.e. the definition that WILL be in force the moment the owner
pushes. It makes no statement about production's current posture. That sentence is written
into the walker's header and into §2's Definition of done, because a guard that reads a repo
and is quoted as if it read a database is exactly the class this estate refuses.

The corollary is worth naming for the chair: **both EM-B3b's server-side mirror AND (if a
migration 203 is chosen as the cure for E3.2's finding) that migration are inert in production
until the owner's `supabase db push`.** The charter already carries the push chain as the
owner's hand (amendments of 2026-09-19 17:0x, *"migrations 201/202 … ride that push"*).

---

## E9 — `requiredSymbols`, proven row by row, and the POST-EDIT simulation

Every row proved present VERBATIM at `58fcfe614` with `grep -cF`:

```
tests/helpers/sourceContract.js                       export function sqlRegexAlternation                              count=1
tests/helpers/sourceContract.js                       export function jsRegexTokens                                    count=1
src/domain/display/worldSnapshotPublic.js             export const WORLD_SNAPSHOT_HARD_DENY                            count=1
src/domain/display/worldSnapshotPublic.js             export const COVERT_KEY_RE                                       count=1
src/domain/display/publicSafe.js                      export const PRIVATE_KEY_RE                                      count=1
supabase/migrations/202_edit_registry_public_denylist.sql  create or replace function public._gallery_world_snapshot_is_safe  count=1
supabase/migrations/202_edit_registry_public_denylist.sql  hard_deny constant text[] := array[                          count=1
tests/security/snapshotDenylistDrift.test.js          function netCurrentScannerSql                                    count=1
tests/lint/mutationCoverage.shared.mjs                export const ENFORCER_DIRS                                       count=1
scripts/mutation-coverage-manifest.json               "uncoveredBaseline"                                              count=1
tests/lint/sovereigntyLightingContract.walker.test.js const CENSUS_FIGURE_KEYS                                          count=1
tests/lint/negativeAssertionAnchor.walker.test.js     const BARE_NEGATIVE_RE                                            count=1
```

**POST-EDIT SIMULATION (pre-proof step 10).** This packet **CREATES one file and INSERTS one
JSON object into an existing map.** It moves, renames and deletes **no symbol at any path**.
Therefore every one of the twelve rows above is still present verbatim after the packet's own
edits: **12 / 12 PASS, `retiredSymbols` is EMPTY**, and no other LANDED packet's rows for any
of these (path, symbol) pairs need discharging. The single REGISTER path,
`scripts/mutation-coverage-manifest.json`, is edited by insertion beside its alphabetical
siblings, so its `"uncoveredBaseline"` row (a requiredSymbols member here precisely because the
new row must NOT be `uncovered`) is untouched.

```
$ ls $T/tests/security/galleryScannerMirrorTotality.test.js
ls: …: No such file or directory          ← the CREATE target is absent
$ git -C $T status --porcelain | head -5
(no output)                                ← the tree is Git-clean
```

---

## E10 — a dry read of the sealed dispatch (`scripts/implementation-session.mjs`)

```
:176  git merge-base --is-ancestor <verifiedBase> <head>
:182  throw  "verified base is not an ancestor of HEAD"
:185  const substrate = [...new Set([ … ])]
:192  git --literal-pathspecs diff --name-only -z <verifiedBase>..<head> -- <substrate>
:195  throw  "verified-base descendant changed declared substrate"
:199  throw  "capsule omitted declared substrate"
:210  throw  "CREATE target must be absent and Git-clean"
:213  throw  "non-CREATE target must be Git-clean"
:353  throw  "dispatch branch mismatch: expected <verifiedBranch>, found <branch>"
```

Check by check, with the base set to the tip:

| check | verdict |
|---|---|
| branch name | **PASSES** once the build lane holds the integration branch in its own worktree (the standing law: one build lane holds the branch; the chair detaches). |
| ancestry (`verifiedBase` is an ancestor of HEAD) | **PASSES** with `__BASE__` stamped to the promotion tip. |
| substrate unchanged since the verified base | **PASSES** — with the base at the promotion tip the window is empty by construction; the twelve declared substrate paths are E9's. |
| CREATE target absent and Git-clean | **PASSES** — `tests/security/galleryScannerMirrorTotality.test.js` does not exist (E9). |
| non-CREATE target Git-clean | **PASSES** — `scripts/mutation-coverage-manifest.json` is clean in a clean tree; ⚠ **it is EM-B1d's change path too**, so the dispatch fails if EM-B1d's build is still holding an uncommitted edit to it. E6.2's ordering resolves this. |
| capsule names every declared substrate path | **PASSES** — §7 and `requiredSymbols` name the same twelve paths. |

⚠ **The `_gallery_world_snapshot_is_safe` substrate row is path-based**, so a NEW migration
`203_*.sql` remains invisible to this check even with EM-B3c landed. That is not a defect of
EM-B3c: the walker closes it at the GATE, which is where a new file becomes visible. The
packet says so in §11 rather than implying the dispatch now sees it.

---

## E11 — the budget, measured

| Limit | Budget | EM-B3c | Source |
|---|---:|---:|---|
| Behavior families | 1 | **1** | one walker, one claim |
| New persisted record families | 0–1 | **0** | |
| Named state writers | 0–1 | **0** | |
| Feature flags | 0–1 | **0** | wave 1 is headless |
| User-facing surfaces | 0–1 | **0** | |
| New logic-bearing production leaves | ≤2 | **0** | no `src/` path |
| Existing logic-bearing production files modified | ≤3 | **0** | no `src/` path |
| Additional registration-only files | ≤3 | **1** | `scripts/mutation-coverage-manifest.json` |
| Handwritten files total | ≤12 | **2** | one CREATE + one REGISTER |
| New/changed effective PRODUCTION lines | ≤400 | **0** | test-only |
| Effective lines per new leaf | ≤250 | **n/a** (the test file is ~150–190 eff, not a production leaf) | |
| Delta in a shared/hot file | ≤15 | **+4** (one JSON object of 3–4 lines) | |
| Acceptance cases | ≤8 | **7** | §9 |

No hot file is named. The packet fits the default budget with wide margin; **no override is
requested.**

---

## E12 — scratch scripts (read-only, in this lane's scratch root)

| script | what it executed |
|---|---|
| `m1-scanner-and-tokens.mjs` | E1.2, E2.3, E3.1, E3.2 |
| `m2-mutants.mjs` | E4 (six plants × three comparisons) |
| `m3-parsing-hazards.mjs` | E5 (seven synthetic sources) |

All three import from `$SP/read-tip-58fcfe614` only, write nothing, and were run one process
at a time. No vitest, no eslint, no npm script, no build was run by this lane, and none is
claimed.

---
---

# VERSION 2 — evidence added under the chair's rulings R1–R5 (2026-09-19 17:3x–17:5x EDT)

E0–E12 above are UNCHANGED and were re-confirmed at the same tree and sha (E13.1). Sections
E13–E20 are new. Scratch scripts added: `m4-migration-203.mjs`, `m5-budget.mjs`.

## E13 — the base re-confirmed, and 203 is free

```
$ git -C $T rev-parse HEAD
58fcfe61458b784b0470b854caf916b7c2961edf
$ git -C $T status --porcelain | head -3
(empty)
$ date
Sat Sep 19 17:33:12 EDT 2026
```

### E13.1 — v1's three findings re-executed at the tip, inside the v2 script

```
$ node m4-migration-203.mjs
=== V1 RECONFIRMED at the tip ===
net-current owner        : 202_edit_registry_public_denylist.sql
declarers                : ["089_…","127_…","128_…","130_…","136_…","202_edit_registry_public_denylist.sql"]
declared-but-unextracted : []
unrefused client members : ["factionPairStates","envoyErrands","concludedWars"]
202 raw file lines       : 148
202 function body lines  : 88
```

### E13.2 — migration 203 is free

```
$ ls $T/supabase/migrations | sed -E 's/^([0-9]+).*/\1/' | sort -n | tail -3
200
201
202
$ ls $T/supabase/migrations/203*
(no matches found)
```

**CONFIRMED: 202 is the highest number on disk; 203 is unused.** The rollback directory holds
six `.down.sql` files and none for 200/201/202 — those use the in-file `@rollback:` annotation
idiom, so **203 owes no `supabase/rollback/` file**:

```
$ ls $T/supabase/rollback/
087_refund_unique_index.down.sql   097_enforce_allocation_within_grant.down.sql
103_service_adjust_credits.down.sql 107_referral_redeem.down.sql
108_dossier_entitlements.down.sql   195_civility_guard_and_public_identity.down.sql
README.md
```

---

## E14 — migration 203, built and proved mechanically (ruling R2(b))

### E14.1 — how 202 lowers both sides, and therefore how the three members are spelled

`202:90–93`:

```sql
      -- Reject an exact HARD-DENY key, CASE-INSENSITIVELY (lower on both sides) so a
      -- mixed/upper-cased forbidden key like NpcStates cannot slip past the literal
      -- camelCase list.
      if lower(key) = any (select lower(x) from unnest(hard_deny) as t(x)) then
```

**Both sides are lowered at comparison time**, and the array literal itself is written in the
client's camelCase (`'npcStates'`, `'dmLayer'`, `'politicsLedgers'`). The three new members are
therefore spelled **exactly as the client spells them** and exactly as the array's existing
members are spelled: `'factionPairStates','envoyErrands','concludedWars'`.

### E14.2 — the plant, and the no-op guard

```
=== 2. THE PLANT CHANGED THE TEXT (no-op guard) ===
202 body chars: 4156 -> 203 body chars: 4751 delta 595
203 function body lines: 94 (202: 88, delta +6)
```

The replaced region is the array's tail — the three members appended to the existing
`'politicsLedgers'` line, and the stale `-- conditional ledgers (135): every
CONDITIONAL_LEDGER_KEY but pantheon` comment replaced by seven lines that state **the rule
instead of a snapshot** and name the three dates the old claim went stale.

### E14.3 — ⭐ THE MECHANICAL-DIFF CONTRACT, EXECUTED

```
=== 3. MECHANICAL DIFF: everything OUTSIDE the hard_deny array literal ===
byte-identical outside the array literal? true
residual length (identical both sides): 3582
alternation UNCHANGED? true (34 alternatives both sides)
hard_deny 202 -> 25 members; 203 -> 28 members; ADDED: ["factionpairstates","envoyerrands","concludedwars"] ; REMOVED: []
```

**CONFIRMED.** Mask the `hard_deny constant text[] := array[…];` literal in both bodies and the
remaining **3,582 characters are byte-identical**. The alternation is unchanged — 34
alternatives, same order, both sides. The array gains exactly three members and loses none.

**The exact check the build lane runs** (the packet's §8 step 4 gives it as a scratch script):

```js
const mask = (b) => b.replace(/hard_deny\s+constant\s+text\[\]\s*:=\s*array\[[\s\S]*?\];/, '<<ARRAY>>');
assert(mask(body203) === mask(body202));                                  // 3,582 chars, identical
assert(JSON.stringify(alts203) === JSON.stringify(alts202));              // 34 both sides
assert(added.length === 3 && removed.length === 0);                       // three in, none out
```

### E14.4 — the walker is GREEN after 203

```
=== 4. THE WALKER AFTER 203 ===
net-current owner        : 203_gallery_scanner_client_mirror_totality.sql
declared-but-unextracted : []
unrefused client members : []  ✅ GREEN
per-member mechanism after 203:  28 of 28 refused, every one by=array
```

All 28 client hard-deny members are refused, each by the array. (`rngSeed`, `dmLayer` and
`decrees` are additionally covered by the alternation; the predicate checks the array first and
records `by`, and the walker never demands exactly one mechanism.)

---

## E15 — the mutants re-run against the post-203 text (ruling R2(d))

```
=== 5. THE MUTANTS, RE-RUN AGAINST THE POST-203 TEXT ===
--- BASE post-203                                    drift GREEN | subset GREEN | owner pin GREEN
--- M-a' hard_deny loses 'dmLayer'                   drift GREEN | subset GREEN | owner pin GREEN
--- M-b' hard_deny loses 'decrees'                   drift GREEN | subset GREEN | owner pin GREEN
--- M-c' alternation loses '.*decrees.*'             drift RED ["decrees"] | subset GREEN | owner pin GREEN
--- M-d' a NEW 204 re-creating 136's body verbatim   drift RED ["decrees"]
                                                     subset RED ["decrees","factionPairStates","envoyErrands","concludedWars"]
                                                     owner pin RED
--- M-e' a NEW 204 = 203 minus the THREE new members (alternation intact)
                                                     drift GREEN | ⭐ subset RED ["factionPairStates","envoyErrands","concludedWars"] | owner pin RED
--- M-f' a NEW 204 = 203 minus BOTH editor keys from the array (alternation intact)
                                                     drift GREEN | subset GREEN | owner pin RED
```

Every plant's byte change was asserted before its verdict was read (§P6's no-op-plant rule);
the run prints `plant changed the text/owner? true` and both lengths for each.

### E15.1 — ⭐ the chair's demand is met: M-e′ is caught AT THE SUBSTANCE

**CONFIRMED.** A hypothetical 204 that re-creates 203's body with the three new array members
dropped and the alternation intact is **GREEN on the drift test** and **RED on EM-B3c's subset
claim, naming the three members** — independent of the owner pin. That is the class the packet
exists for, and it is caught by substance, not by a filename.

### E15.2 — ⛔ A FINDING THE CHAIR SHOULD SEE: M-a′/M-b′/M-f′ are GREEN on the subset claim

This is **correct behaviour, not a hole**, and it has a consequence for ruling R2(c).

After 203, striking `'dmLayer'` (or `'decrees'`) from the array leaves the key still refused —
by the alternation, `.*dm.*` and `.*decrees.*` respectively. The subset claim asks *is the key
refused*, not *by which mechanism*, so it is correctly GREEN. Therefore:

> **The `dmLayer`/`decrees` literal lines in the 202-wave arm of `tests/ops/migrationRehearsal.test.js`
> (`:383`, `expect(hardDenyMembers(scanner.sql)).toEqual(expect.arrayContaining(['dmlayer','decrees']))`)
> assert something STRICTLY STRONGER than EM-B3c's subset claim** — the *array* mechanism
> specifically, which is 202's deliberate belt-and-suspenders over the alternation. **They are
> NOT subsumed and must be KEPT.**

**Answer to the chair's question in R2(c):** those two lines **simply keep passing** under 203 —
203's array retains both members (E14.3: zero removed) — so they need **no 203 twin and no
edit**. Only the `scanner.owner` pin on the line above them is re-pointed.

### E15.3 — the division of labour, measured

| mutant class | caught by |
|---|---|
| an alternation alternative removed (M-c′) | `snapshotDenylistDrift.test.js` — **only** |
| a client hard-deny member unmirrored in the SQL (M-e′, and the live gap) | **EM-B3c's subset claim — only** |
| a wholesale regression to a pre-202 body (M-d′) | all three |
| the *array* mechanism weakened for the two editor keys while the alternation still covers them (M-a′/M-b′/M-f′) | the 202-wave arm's two literal lines — **only** |

No guard is redundant; each owns a class the others miss. §P6's "a redundant second guard
subsumes the first" is satisfied — nothing here duplicates anything.

---

## E16 — everything a new scanner migration owes, measured from EM-B3b (ruling R2(c))

### E16.1 — EM-B3b's own change manifest, the ground truth

```
$ node -e "…PACKET_MANIFEST.json, EM-B3b…"
CREATE    supabase/migrations/202_edit_registry_public_denylist.sql
MODIFY    scripts/ops/migrationRehearsalCore.mjs
TEST      tests/ops/migrationRehearsal.test.js
DOC       docs/DEPLOY.md
DOC       ARCHITECTURE.md
DOC       docs/CURRENT_STATE.md
```

### E16.2 — the full census of sites that name 202, classified

```
$ grep -rn "202_edit_registry_public_denylist|migration 202|REPO_HEAD|repoHead|repo head" tests/ scripts/ src/ docs/DEPLOY.md ARCHITECTURE.md docs/CURRENT_STATE.md
$ grep -rnE "\b202\b" tests/ops/ tests/docs/ scripts/ops/ supabase/applied-head.json docs/DEPLOY.md ARCHITECTURE.md docs/CURRENT_STATE.md
```

| # | site | line(s) | classification | 203's obligation |
|---|---|---|---|---|
| 1 | `scripts/ops/migrationRehearsalCore.mjs` | `:19` `export const MIGRATION_TRAIN_REPO_HEAD = 202;` | **HARD-PINNED CONSTANT** | `202` → `203`, **+0 eff** (one line, in place) |
| 2 | `scripts/ops/migrationRehearsalCore.mjs` | `:551–584` the `edit-registry-public-denylist` wave row | **HARD-PINNED, appended** | one new frozen wave row copying the 202 row field for field (`id`, `from`/`to` 203, `purpose`, `rollback` forward-only with its `@rollback` reversal spelled, `expectedObjects` naming `_gallery_world_snapshot_is_safe`), **≤34 eff** — EM-B3b's own measured figure for the same shape |
| 3 | `tests/ops/migrationRehearsal.test.js` | `:108` `plan.repoHead` `202`→`203`; `:109` `pendingCount` `81`→`82`; `:131` append `[203, 203]`; `:138` `Array.from({length: 81})`→`82`; `:496` `{appliedHead:200, repoHead:203, pendingCount:3}`; `:499` append `['gallery-scanner-client-mirror-totality', 203, 203]`; `:511` the throw regex gains `203`; `:521` `repoHead`→`203`; `:522` `migrationCount`→`203`; `:644` `repoHead`→`203`; plus one `plan.waves.find(…id==='gallery-scanner-client-mirror-totality')` `toMatchObject` inside the EXISTING wave `it` | **HARD-PINNED figures** | ten figures move, one `toMatchObject` block added inside an existing `it`. ⭐ **NO new `describe`, NO new `it`** — so `tests/ops/` contributes **0** to the lighting title delta |
| 4 | `tests/ops/migrationRehearsal.test.js` | `:382` `expect(scanner.owner).toBe('202_edit_registry_public_denylist.sql')` | **HARD-PINNED, re-pointed** | → `'203_gallery_scanner_client_mirror_totality.sql'`. See E17 for the structural replacement, recorded as a finding and NOT built here |
| 5 | `tests/ops/migrationRehearsal.test.js` | `:383` `hardDenyMembers ⊇ ['dmlayer','decrees']`; `:387–388` `denies('decrees')`, `denies('dmLayer')` | **KEEPS PASSING UNCHANGED** | **no edit, no 203 twin** — E15.2 proves they assert something the subset claim does not, and 203 preserves both |
| 6 | `docs/DEPLOY.md` | `:198` `**Current migration head: \`202_…sql\`**` | **DERIVED PIN** — `tests/docs/deployRunbookFreshness.test.js:121` derives the head from `supabase/migrations/` and reds if the line drifts | one line → 203's filename. **FORCED** |
| 7 | `ARCHITECTURE.md` | `:269` `- **migrations/** (202) —` | **DERIVED PIN** — `tests/docs/docCounts.test.js:30–33` reads the directory and asserts the stated count | `(202)` → `(203)`. **FORCED** |
| 8 | `docs/CURRENT_STATE.md` | `:5` `contiguous to 202`; `:79–83` `head 202 is 2 migrations ahead … 201 … and 202 …` | **DERIVED PIN** — `tests/docs/architectureFreshness.test.js:161–180` parses `/migration head (\d+) is (\d+) migrations? ahead\s+of the live-verified production head (\d+)/` and `contiguous to (\d+)` and compares against disk | `202`→`203`, `2`→`3` migrations ahead, and the sentence names 203's purpose. **FORCED** |
| 9 | `supabase/applied-head.json` | `"appliedHead": 200` | **DELIBERATELY NOT MOVED** | **no edit.** The owner bumps it in the same act as `supabase db push`. `tests/docs/migrationAppliedHead.test.js:39` only asserts `appliedHead <= repoHead`, which 200 ≤ 203 satisfies |
| 10 | `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md` | — | **names no migration number** (`grep -nE "\b(200\|201\|202)\b"` → no output) | **no edit** |
| 11 | `scripts/check-migration-head.mjs`, `scripts/vercel-ignore-build.mjs`, `scripts/backup-restore-drill.mjs`, `scripts/ops/migration-rehearsal.mjs`, `tests/ops/postDeployVerify.test.js`, `tests/lint/testRatchet.test.js`, `tests/docs/migrationContiguity.test.js` | various | **DERIVED from disk or from `MIGRATION_TRAIN_REPO_HEAD`** | **no edit.** The pending-count surfacing (`validate:migration-head`) will simply report three pending instead of two |
| 12 | `tests/scripts/implementationPackets.test.js` | `:865, :893–915` `MIGRATION_TRAIN_REPO_HEAD = 198` | **SYNTHETIC FIXTURE** inside the validator's own test | **no edit** — a fixture string, not a claim about the tree |
| 13 | `supabase/rollback/` | — | 202 has no `.down.sql`; it uses the in-file `@rollback:` annotation | **no file owed** (E13.2) |

**⛔ A TRAP MEASURED, AND AVOIDED.** `scripts/implementation-packets.mjs:775–783` (rule HK-5)
**REFUSES** any `requiredSymbols` row that pins a migration-head FIGURE in one of five paths:

```
const MIGRATION_HEAD_FIGURE_PATHS = ['docs/DEPLOY.md', 'ARCHITECTURE.md', 'docs/CURRENT_STATE.md',
  'scripts/ops/migrationRehearsalCore.mjs', 'docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md'];
…
  `${at}.symbol pins a MIGRATION HEAD FIGURE in ${row.path}: ${row.symbol} (${headShape}).`
  + ' The head is a figure that moves with the next migration, so this row traps every'
  + ' later migration member against a packet it never touched.'
```

So `{path: 'scripts/ops/migrationRehearsalCore.mjs', symbol: 'MIGRATION_TRAIN_REPO_HEAD = 202'}`
would be **rejected by `implementation:dispatch`**. EM-B3b's own row is the figure-free
`export const MIGRATION_TRAIN_REPO_HEAD`, and this packet copies that shape exactly.

---

## E17 — the structural replacement for the `scanner.owner` pin (a FINDING; not built here)

The pin `expect(scanner.owner).toBe('202_edit_registry_public_denylist.sql')` conflates two
different claims:

1. **the extraction works** — latest-wins resolves to *some* file, and to the right one; and
2. **this particular migration is the newest** — which is true only until the next scanner
   migration, and rots by design.

Claim (1) is what has value, and **EM-B3c's arm A5 states it structurally**:
`owner === max(declarers, by numeric prefix)` — true at any tip, forever, red only when the
extraction is actually broken. Claim (2) is a wave fact, and its non-rotting form is an
EXISTENCE claim, not an identity one.

**The structural replacement would assert, per wave:**

```js
expect(scanner.declarers).toContain('<this wave's migration file>');        // never rots
expect(scanner.owner).toBe(highestNumberedDeclarer(scanner.declarers));     // EM-B3c arm A5
// …and the wave's SUBSTANCE claims (hardDenyMembers ⊇ {…}, denies(…)) stay exactly as they are
```

⛔ **Not built by this packet** (chair's instruction). Recorded for the chair as a candidate
tooling item beside TOOL-4; it would edit a LANDED packet's `checks` member and belongs in the
tooling window, not inside a security landing. Until then, EM-B3c re-points the pin as every
previous scanner migration has.

---

## E18 — the budget, re-measured for the two-half packet

```
$ node m5-budget.mjs
202 whole file : raw 148 | effective (non-blank, non `--`) 58
202 fn body    : raw 88  | effective 58
203 fn body    : raw 88  | effective 58   => EFFECTIVE DELTA vs 202 body: 0
  203 whole file effective (header is all `--` comment, so it costs 0): 58 SQL lines
```

⭐ **203 costs exactly what 202 cost: 58 effective SQL lines.** The three new members ride the
existing `'politicsLedgers'` line, and the seven lines of new explanation are `--` comment.
(EM-B3b priced its own 202 CREATE at `<=60 SQL raw` by the same accounting.)

| row | effective PRODUCTION lines | files |
|---|---:|---|
| `supabase/migrations/203_gallery_scanner_client_mirror_totality.sql` (CREATE, registration-only) | **58** | 1 |
| `scripts/ops/migrationRehearsalCore.mjs` (MODIFY: one wave row + the head constant in place) | **≤34** | 1 |
| `scripts/mutation-coverage-manifest.json` (REGISTER) | **+4** | 1 |
| `tests/security/galleryScannerMirrorTotality.test.js` (CREATE, TEST) | **0** (test lines) — ≤190 raw | 1 |
| `tests/ops/migrationRehearsal.test.js` (TEST: ten figures + one `toMatchObject`) | **0** (test lines) | 1 |
| `docs/DEPLOY.md`, `ARCHITECTURE.md`, `docs/CURRENT_STATE.md` (DOC) | **0** | 3 |
| **TOTAL** | **≤96 of 400** | **8 of 12** |

Existing logic-bearing production files modified: **1** (`migrationRehearsalCore.mjs`) of ≤3.
Registration-only files: **2** (the migration, the mutation register) of ≤3. New logic-bearing
production leaves: **0**. Acceptance cases: **8** of ≤8. Delta in a shared/hot file: **+4** of
≤15; no hot file named.

⭐ **NO SPLIT IS NEEDED AND NONE IS PROPOSED.** The measured total is 24% of the line budget and
67% of the file budget. The red-first proof and its cure stay in ONE landing, as ruled.

---

## E19 — the collision census, re-run over every 203-obliged path (ruling R5)

```
$ node -e "…PACKET_MANIFEST.json…"
NON-TERMINAL packets in the live manifest:
   READY EM-B1d ["src/domain/entities/npcs.js", …, "scripts/mutation-coverage-manifest.json",
                 "supabase/functions/_shared/aiCharterBundle.js", …]

Any packet (ANY status) reserving one of my eight paths:   35 rows, of which:
   LANDED  WEB-1 / WEB-2 / WEB-3  [migrationRehearsalCore.mjs, migrationRehearsal.test.js, DEPLOY.md, CURRENT_STATE.md, ARCHITECTURE.md, mutation-coverage-manifest.json]
   LANDED  EM-B3b                 [migrationRehearsalCore.mjs, migrationRehearsal.test.js, DEPLOY.md, ARCHITECTURE.md, CURRENT_STATE.md]
   LANDED  DOM-1 / DOM-2 / IA-1 / WEB-8   [the three DOCs]
   LANDED  ×25 others             [mutation-coverage-manifest.json]
   READY   EM-B1d                 [mutation-coverage-manifest.json]

EM ids and status: EM-B3a LANDED · EM-B3b LANDED · EM-B3 SUPERSEDED · EM-P3 LANDED · EM-P0 LANDED · EM-B1d READY
EM-P1 present? false | EM-P2 present? false
status histogram: LANDED 185 · SUPERSEDED 2 · READY 1
```

**CONFIRMED, path by path:**

| change path | non-terminal reservers TODAY |
|---|---|
| `tests/security/galleryScannerMirrorTotality.test.js` | **none** (the file does not exist) |
| `supabase/migrations/203_gallery_scanner_client_mirror_totality.sql` | **none** — no packet at any status names any `supabase/migrations/` path but EM-B3b (LANDED, its own 202) |
| `scripts/ops/migrationRehearsalCore.mjs` | **none** — WEB-1/2/3 and EM-B3b are all LANDED |
| `tests/ops/migrationRehearsal.test.js` | **none** — same |
| `docs/DEPLOY.md`, `ARCHITECTURE.md`, `docs/CURRENT_STATE.md` | **none** — DOM-1, DOM-2, IA-1, WEB-8, WEB-1/2/3, EM-B3b all LANDED |
| `scripts/mutation-coverage-manifest.json` | ⭐ **EM-B1d (READY) — the ONLY one** |

⚠ **On the chair's list of three.** **EM-P1 and EM-P2 are ABSENT from the live manifest**
(`EM-P1 present? false | EM-P2 present? false`; the histogram shows exactly one non-terminal
packet). They reserve nothing **today**; their reservation is **prospective** — it begins the
moment the chair re-admits them, and the charter slots EM-P2 v3 at EM-T3.5 and EM-P1 at EM-T4.

**What this means for R5's FLOAT.** If EM-B3c is floated with priority into the slot after train
EM-T3's terminal, the only live contention is EM-B1d's hold on
`scripts/mutation-coverage-manifest.json`, and EM-B1d is *closing* EM-T3 — so the contention
ends at that terminal by construction. **Floating EM-B3c immediately after EM-T3's terminal is
collision-free on all eight paths.** If it were floated *earlier* — into EM-T3 alongside
EM-B1d — the dispatch's "non-CREATE target must be Git-clean" check would fail on that one
path while EM-B1d's build holds it (E10).

---

## E20 — `requiredSymbols` for version 2, proven

```
$ cd $T && for each pair: grep -cF "<symbol>" "<path>"
supabase/migrations/202_edit_registry_public_denylist.sql  create or replace function public._gallery_world_snapshot_is_safe   1
supabase/migrations/202_edit_registry_public_denylist.sql  hard_deny constant text[] := array[                                 1
supabase/migrations/202_edit_registry_public_denylist.sql  if lower(key) = any (select lower(x) from unnest(hard_deny) as t(x)) then   1
src/domain/display/worldSnapshotPublic.js                  export const WORLD_SNAPSHOT_HARD_DENY                               1
src/domain/display/worldSnapshotPublic.js                  export const COVERT_KEY_RE                                          1
src/domain/display/publicSafe.js                           export const PRIVATE_KEY_RE                                         1
tests/helpers/sourceContract.js                            export function sqlRegexAlternation                                 1
tests/helpers/sourceContract.js                            export function jsRegexTokens                                       1
tests/security/snapshotDenylistDrift.test.js               function netCurrentScannerSql                                       1
tests/lint/mutationCoverage.shared.mjs                     export const ENFORCER_DIRS                                          1
scripts/mutation-coverage-manifest.json                    "uncoveredBaseline"                                                 1
tests/lint/sovereigntyLightingContract.walker.test.js      const CENSUS_FIGURE_KEYS                                            1
tests/lint/negativeAssertionAnchor.walker.test.js          const BARE_NEGATIVE_RE                                              1
scripts/ops/migrationRehearsalCore.mjs                     export const MIGRATION_TRAIN_REPO_HEAD                              1
scripts/ops/migrationRehearsalCore.mjs                     export const MIGRATION_WAVES                                        1
scripts/ops/migrationRehearsalCore.mjs                     export function buildMigrationRehearsalPlan                         1
tests/ops/migrationRehearsal.test.js                       covers the exact applied-head to repository-head gap in semantic waves  1
tests/docs/deployRunbookFreshness.test.js                  names the current migration head file                               1
tests/docs/architectureFreshness.test.js                   migrations? ahead                                                   1
supabase/applied-head.json                                 "appliedHead"                                                       1
docs/DEPLOY.md                                             Current migration head                                              1
```

**21 of 21 rows resolve, count = 1 each.** Verified with the same `grep -cF` harness as E9; the
three new `migrationRehearsalCore.mjs` rows, the two doc-freshness rows, the `applied-head.json`
row and the `docs/DEPLOY.md` heading row are **copied from EM-B3b's own requiredSymbols list**,
which is the estate's proven set for a scanner migration. The `202` row naming the
case-insensitive comparison is new to this packet: it is what makes the array spelling
contractual (E14.1).

⛔ **Deliberately NOT in `requiredSymbols`:** any row naming a migration-head FIGURE in
`docs/DEPLOY.md`, `ARCHITECTURE.md`, `docs/CURRENT_STATE.md`, `scripts/ops/migrationRehearsalCore.mjs`
or `docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md` — rule HK-5 refuses them (E16.2). The four rows
this packet DOES place in those paths were run through HK-5's own predicate in scratch:

```
=== HK-5 trap check ===
  ✅ ACCEPTED: scripts/ops/migrationRehearsalCore.mjs :: export const MIGRATION_TRAIN_REPO_HEAD
  ✅ ACCEPTED: scripts/ops/migrationRehearsalCore.mjs :: export const MIGRATION_WAVES
  ✅ ACCEPTED: scripts/ops/migrationRehearsalCore.mjs :: export function buildMigrationRehearsalPlan
  ✅ ACCEPTED: docs/DEPLOY.md :: Current migration head
```

### E20.1 — the POST-EDIT simulation, version 2

The packet now MODIFIES two files and edits three docs, so step 10 is re-run properly:

| # | path :: symbol | does the packet's own edit disturb it? | POST-EDIT |
|---:|---|---|:--:|
| 1–2 | `202_…sql` :: the scanner + its array | **no** — 202 is never edited; 203 is a NEW file | **HOLD** |
| 3 | `202_…sql` :: `if lower(key) = any (select lower(x) from unnest(hard_deny)` | **no** | **HOLD** |
| 4–6 | `worldSnapshotPublic.js` ×2, `publicSafe.js` | **no** — no `src/` path in the manifest | **HOLD** |
| 7–8 | `sourceContract.js` ×2 | **no** — imported, never edited (R3) | **HOLD** |
| 9 | `snapshotDenylistDrift.test.js` :: `function netCurrentScannerSql` | **no** — shape copied, file untouched | **HOLD** |
| 10 | `mutationCoverage.shared.mjs` :: `ENFORCER_DIRS` | **no** | **HOLD** |
| 11 | `mutation-coverage-manifest.json` :: `"uncoveredBaseline"` | the packet INSERTS a sibling object; the baseline line is untouched | **HOLD** |
| 12–13 | the lighting + anchored-negative constants | **no** | **HOLD** |
| 14 | `migrationRehearsalCore.mjs` :: `export const MIGRATION_TRAIN_REPO_HEAD` | the packet changes the **value** `202`→`203`; the symbol text is figure-free | **HOLD** |
| 15 | `migrationRehearsalCore.mjs` :: `export const MIGRATION_WAVES` | the packet APPENDS a row to the array; the declaration is untouched | **HOLD** |
| 16 | `migrationRehearsalCore.mjs` :: `export function buildMigrationRehearsalPlan` | not touched (EM-B3b: "every other function is NOT touched") | **HOLD** |
| 17 | `migrationRehearsal.test.js` :: `covers the exact applied-head to repository-head gap in semantic waves` | the packet moves FIGURES **inside** that `it`; the TITLE is untouched | **HOLD** |
| 18–19 | the two doc-freshness test titles | not touched | **HOLD** |
| 20 | `applied-head.json` :: `"appliedHead"` | **not edited** — the bump is the owner's act | **HOLD** |

**20 / 20 HOLD. `retiredSymbols` is EMPTY.** The packet renames, moves and deletes no symbol.
No other LANDED packet's rows for any of these (path, symbol) pairs need discharging — and in
particular **EM-B3b's ten `requiredSymbols` rows all survive**: it names `export const
MIGRATION_TRAIN_REPO_HEAD` (figure-free, so the `202`→`203` value change does not disturb it),
`export const MIGRATION_WAVES` (appended to, not replaced), the wave-gap test title (unchanged),
`136_…sql`'s scanner (untouched), `snapshotDenylistDrift.test.js`'s test title (untouched),
`"appliedHead"` (untouched), `docs/DEPLOY.md :: Current migration head` (the HEADING survives;
only the filename after it changes), and the two freshness titles.

```
$ ls $T/tests/security/galleryScannerMirrorTotality.test.js
ls: …: No such file or directory                ← CREATE target 1 absent
$ ls $T/supabase/migrations/203*
(no matches found)                               ← CREATE target 2 absent
$ git -C $T status --porcelain | head -3
(empty)                                          ← tree Git-clean
```
