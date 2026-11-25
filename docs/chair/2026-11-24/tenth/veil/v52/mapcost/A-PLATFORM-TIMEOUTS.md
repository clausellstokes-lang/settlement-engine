# MAP-COST (a): the hosted platform's statement timeouts (VEIL-52; V28 (3); read 2026-11-25 ~08:30 UTC)

HOW READ: web search in generic words only (no project name, no identifier), 2026-11-25. THE PAGES THEMSELVES COULD NOT BE OPENED from
this container (the fetch failed on DNS for the platform's documentation host: it is outside this session's network), so every line
below is the SEARCH ENGINE'S RENDERING of the cited page, not a read of the page: PLAUSIBLE, to be confirmed by a reader who can open them.

1. DEFAULTS, per the platform's "Timeouts" guide (https://supabase.com/docs/guides/database/postgres/timeouts): the `anon` role 3 s, the
   `authenticated` role 8 s; an older page states a global limit of 2 minutes for all users. Role-level change: `alter role ... set
   statement_timeout = ...`, visible in `pg_roles.rolconfig`, not in SHOW; the API layer's config cache must be reloaded to apply it
   (the platform's PostgREST 11.1 post, https://supabase.com/blog/postgrest-11-1-release). A community report says `anon` is reserved and
   only a superuser may alter it (https://github.com/orgs/supabase/discussions/9314; dated, unverified).
2. FUNCTION LEVEL: the same guide lists a function-level option (`create function ... set statement_timeout to '4s'`). THROUGH THE API
   LAYER (RPC): the API layer (PostgREST, since 12.x) HOISTS a function's `SET statement_timeout` clause to a transaction-scoped
   setting, which OVERRIDES the impersonated role's (https://docs.postgrest.org/en/v14/references/transactions.html; the platform's
   PostgREST 12.2 post, https://supabase.com/blog/postgrest-12-2). A `SET` INSIDE a function body does NOT extend the running statement
   (pgsql-general threads, https://www.postgresql.org/message-id/46a33904c2cd86718cb4d7a0291906a08b8e246a.camel@cybertec.at): only the
   clause on the definition counts.
3. WHAT IT MEANS HERE (VEIL-52's inference, not the docs'): a visitor (anon, 3 s) reading `get_gallery_dossier` or the gallery's list at
   ~840 public rows (4.7-4.8 s measured locally, N115 / READ-COST, master and tip alike) or `get_gallery_map` (12.5-50 s for 140 members,
   VEIL-55's figures) would be CANCELLED by the default timeout, unless the function carries its own `set statement_timeout` clause.
   A raised timeout alone is not a cure (V28 (3)); it is the bound any cure must fit under.
