-- ────────────────────────────────────────────────────────────────────────────
-- 195_civility_guard_and_public_identity.sql
--
-- THE CIVILITY GUARD'S SERVER MIRROR + the public display identity's column and
-- its storage bucket (docs/DESIGN_PROFILE_IMAGE.md §1/§2/§3/§9).
--
-- ⚠️⚠️ OWNER-GATED AND DARK. This migration is AUTHORED, NOT DEPLOYED. Schema
-- shape and deploys are the owner's call, never the implementer's, and this file
-- changes both a security-definer function surface and storage policy. Nothing in
-- the client requires it to land: every consumer feature-detects and hides itself
-- while it is undeployed (AccountIdentitySection's consent switch, the avatars
-- bucket's plain "storage isn't set up yet" sentence), and publicIdentityOf FAILS
-- CLOSED on the absent column, so until this deploys no name or image is
-- published anywhere. That is the intended dormant state, not a degraded one.
--
-- ADDITIVE, IDEMPOTENT, RE-RUNNABLE. Apply order: after 194.
--
-- ── WHAT THIS DOES
--   1. profiles.public_identity_opt_in — THE single §1 consent switch.
--   2. public.civility_terms — the blocklist, as DATA (mirrors src/data/civilityLists.js).
--   3. public.civility_normalize / public.civility_blocked — the SERVER MIRROR of
--      src/lib/civility.js. Client checks are courtesy; server checks are law.
--   4. update_display_name + add_gallery_comment consult the guard.
--   5. the `avatars` storage bucket and its RLS.
--
-- ── ⚠️ ONE VALIDATOR, TWO MIRRORS, ONE VECTOR FILE
-- The two mirrors are proven equivalent by EXECUTION, not by inspection:
-- tests/security/civilityGuard.pglite.test.js loads the functions below into
-- pglite and runs the SAME shared vectors (tests/fixtures/civilityVectors.js)
-- through both, asserting verdict-for-verdict agreement. A fix that lands on one
-- mirror and not the other turns that test red at the shared contract instead of
-- appearing in production on whichever mirror was forgotten.
--
-- ── ⚠️ WHAT THE SERVER MIRROR DELIBERATELY DOES *NOT* DO
-- The VEIL mode is NOT implemented here. Masking flagged terms inside arbitrary
-- JSON prose in PL/pgSQL is a large, slow, and easily-wrong piece of SQL, and the
-- veil's consumers all render through the client projection (toPublicSafe), which
-- does implement it. This is recorded as a KNOWN, DELIBERATE ASYMMETRY rather
-- than implied to exist: BLOCK mode is mirrored server-side and is law; VEIL mode
-- is currently client-side defense-in-depth only. If the owner wants the veil in
-- _gallery_sanitize_public_json too, that is its own wave and its own ruling.
-- ────────────────────────────────────────────────────────────────────────────

-- ── 1. THE SINGLE CONSENT SWITCH (§1) ───────────────────────────────────────
-- Default FALSE and NOT NULL: existing accounts are opted OUT until they choose.
-- Nobody's name or face becomes public because a migration ran.
--
-- No RLS policy change is needed or wanted. The net-current self-UPDATE policy on
-- profiles (075 §6) pins the columns a user may NOT change and leaves the rest
-- owner-writable; consent belongs squarely in the latter group — it is the
-- user's own decision about their own visibility, and pinning it would mean a
-- user could not withdraw it themselves.
alter table public.profiles
  add column if not exists public_identity_opt_in boolean not null default false;

comment on column public.profiles.public_identity_opt_in is
  'THE single public display-identity consent (DESIGN_PROFILE_IMAGE.md §1). Governs the PAIR — display name AND profile image — on every public surface at once. Off by default; withdrawal blanks both everywhere without deleting the stored asset.';

-- ── 2. THE BLOCKLIST, AS DATA ───────────────────────────────────────────────
-- Mirrors src/data/civilityLists.js. Seeded from migration 075's
-- reserved_external_names profanity guard, so the two surfaces cannot disagree
-- about what this product refuses.
create table if not exists public.civility_terms (
  term text primary key
);

insert into public.civility_terms (term) values
  ('fuck'),('shit'),('bitch'),('cunt'),('nigger'),('faggot'),('rape'),('nazi')
on conflict (term) do nothing;

-- The allowlist rides beside it (§9). Empty in v1 by design: whole-TOKEN matching
-- means the classic collisions never reach a list at all. Entries are added when
-- a real false positive is reported, never speculatively.
create table if not exists public.civility_allow (
  term text primary key
);

-- Deny-by-default, mirroring 095's posture for reserved_external_names: the lists
-- need not be world-readable, and the only readers are SECURITY DEFINER functions
-- which bypass RLS. Idempotent; both statements are no-ops on re-apply.
alter table public.civility_terms enable row level security;
alter table public.civility_allow enable row level security;
revoke all on table public.civility_terms from anon, authenticated;
revoke all on table public.civility_allow from anon, authenticated;

-- ── 3. THE NORMALIZER (mirror of src/lib/civility.js) ───────────────────────
-- Folds casual evasion onto the same token the list carries: zero-width padding,
-- case, diacritics, homoglyphs and leet digits.
--
-- IMMUTABLE + no table access, so it is safe to call from any context.
create or replace function public.civility_normalize(p_text text)
returns text
language sql
immutable
set search_path = public, pg_temp
as $$
  select translate(
    lower(
      -- Zero-width space/non-joiner/joiner, the bidi marks, word joiner,
      -- Mongolian vowel separator, BOM, soft hyphen. Written as escapes: literal
      -- invisible bytes in a migration are unreviewable in a diff.
      regexp_replace(coalesce(p_text, ''),
        '[' || chr(8203) || '-' || chr(8207) || chr(8288) || chr(6158) || chr(65279) || chr(173) || ']',
        '', 'g')
    ),
    -- FROM: Cyrillic + Greek homoglyphs, then Latin-1 diacritics, then leet.
    'аеорсухкмнтвіѕјԁɡοικνρτυχαεѵ'
      || 'áàâäãåéèêëíìîïóòôöõúùûüñçýÿ'
      || '01345789@$!|+£€',
    -- TO: one character per FROM character, in the same order.
    'aeopcyxkmhtbisjdgoikvptuxaev'
      || 'aaaaaaeeeeiiiiooooouuuuncyy'
      || 'oieastbgasiitle'
  );
$$;

comment on function public.civility_normalize(text) is
  'Server mirror of src/lib/civility.js normalization: strips zero-width padding, case-folds, and translates homoglyph/diacritic/leet characters onto plain ASCII. Proven equivalent to the client by tests/security/civilityGuard.pglite.test.js over the shared vector file.';

-- ── 3b. THE MATCHER ─────────────────────────────────────────────────────────
-- Whole-TOKEN equality, never substring — the Scunthorpe defense. See the client
-- module's header for why every clause below exists; the two must agree.
create or replace function public.civility_blocked(p_text text)
returns boolean
language plpgsql
stable
set search_path = public, pg_temp
as $$
declare
  toks       text[];
  cands      text[] := '{}';
  tok        text;
  joined     text;
  i          int;
  j          int;
  n          int;
  run_end    int;
begin
  if coalesce(p_text, '') = '' then
    return false;
  end if;

  -- Tokenize the normalized text on any non-alphanumeric run.
  toks := array_remove(
            regexp_split_to_array(public.civility_normalize(p_text), '[^a-z0-9]+'),
            '');
  n := coalesce(array_length(toks, 1), 0);
  if n = 0 then
    return false;
  end if;

  cands := toks;

  -- Re-join runs of SHORT adjacent tokens, so `f u c k`, `fu ck` and `sh it` are
  -- candidates too. All contiguous sub-runs, not just maximal ones, so a fragment
  -- sitting inside a longer run of short words is still found.
  i := 1;
  while i <= n loop
    if char_length(toks[i]) > 2 then
      i := i + 1;
      continue;
    end if;
    run_end := i;
    while run_end < n and char_length(toks[run_end + 1]) <= 2 loop
      run_end := run_end + 1;
    end loop;
    for j in i .. run_end loop
      joined := toks[j];
      for k in (j + 1) .. least(run_end, j + 7) loop
        joined := joined || toks[k];
        cands := array_append(cands, joined);
      end loop;
    end loop;
    i := run_end + 1;
  end loop;

  foreach tok in array cands loop
    -- The allowlist wins outright (§9's known-collision escape hatch).
    if exists (select 1 from public.civility_allow a where a.term = tok) then
      continue;
    end if;
    if public._civility_token_hits(tok) then
      return true;
    end if;
  end loop;

  return false;
end;
$$;

comment on function public.civility_blocked(text) is
  'THE SERVER MIRROR of the civility guard, BLOCK mode (DESIGN_PROFILE_IMAGE.md §9). Whole-token matching over a normalized stream — never substring — so ordinary words containing a blocked substring are not convicted. Client checks are courtesy; this is law.';

-- One token against the blocklist: exact, squeezed-with-a-length-floor, and the
-- closed suffix set with silent-e restoration.
create or replace function public._civility_token_hits(p_token text)
returns boolean
language plpgsql
stable
set search_path = public, pg_temp
as $$
declare
  suffixes constant text[] := array['s','es','ed','er','ers','ing','ings','y','ty'];
  sfx      text;
  stem     text;
begin
  if coalesce(p_token, '') = '' then
    return false;
  end if;
  if public._civility_stem_hits(p_token) then
    return true;
  end if;
  foreach sfx in array suffixes loop
    if char_length(p_token) > char_length(sfx) and p_token like ('%' || sfx) then
      stem := left(p_token, char_length(p_token) - char_length(sfx));
      -- Both the bare stem and the stem with its silent `e` restored: English
      -- drops a final `e` before a vowel-initial suffix, so `rape` + `ing` is
      -- spelled `raping` and stripping `ing` alone yields `rap`, which matches
      -- nothing. Every inflected form of an e-final entry needs this.
      if public._civility_stem_hits(stem) or public._civility_stem_hits(stem || 'e') then
        return true;
      end if;
    end if;
  end loop;
  return false;
end;
$$;

-- Exact match, or a repeat-squeezed match that clears the LENGTH FLOOR.
--
-- ⚠️ THE FLOOR IS LOAD-BEARING. Squeezing runs of repeated letters catches
-- `shiiiit`, but it also squeezes the LIST's own doubled letters onto real words:
-- the racial slur squeezes to `niger` (a country and a river) and the homophobic
-- slur to `fagot` (a bundle of sticks, a bassoon). Requiring the candidate to be
-- at least as long as the entry it squeezed onto clears both while still catching
-- `niggger`. Without it this guard would refuse the names of places.
create or replace function public._civility_stem_hits(p_stem text)
returns boolean
language sql
stable
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.civility_terms t
    where t.term = p_stem
       or (
         regexp_replace(p_stem,  '(.)\1+', '\1', 'g')
           = regexp_replace(t.term, '(.)\1+', '\1', 'g')
         and char_length(p_stem) >= char_length(t.term)
       )
  );
$$;

-- ── 4. THE TWO ORDERED SURFACES CONSULT THE GUARD ───────────────────────────
-- Both bodies are forked VERBATIM from their NET-CURRENT definitions with the
-- guard clause added and NOTHING else changed:
--   • update_display_name  — net-current is 009 (no later redefinition exists).
--     ⚠️ NOTE FOR THE OWNER: 131 repinned every other definer's search_path to
--     `public, pg_temp` but did NOT include this function. That pre-existing gap
--     is carried forward UNCHANGED here rather than silently closed, because
--     changing a security-definer search_path is a security-posture change and
--     therefore the owner's call, not this lane's. Recorded, not fixed.
--   • add_gallery_comment  — net-current is 131 (search_path public, pg_temp).
--
-- The refusal messages are the design's copy: polite, non-accusatory, no echo of
-- the matched term, and a mistake path in the same breath.

create or replace function public.update_display_name(new_name text)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  trimmed_name text;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;

  trimmed_name := btrim(coalesce(new_name, ''));
  if length(trimmed_name) > 64 then
    raise exception 'display name too long (max 64 chars)';
  end if;
  -- 195: THE CIVILITY GUARD. The name is refused and NOTHING ELSE happens to the
  -- account — no lockout, no strike, no shadow penalty. The guard rejects a
  -- string, never a person.
  if public.civility_blocked(trimmed_name) then
    raise exception 'That name can''t be used here. Think this is wrong? Feedback & support.';
  end if;
  if trimmed_name = '' then
    trimmed_name := null;
  end if;

  update public.profiles
    set display_name = trimmed_name,
        updated_at   = now()
    where id = auth.uid();

  return trimmed_name;
end;
$$;

create or replace function public.add_gallery_comment(target_settlement_id uuid, comment_body text)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  comment_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Sign in to comment';
  end if;
  if not public.account_is_active(auth.uid()) then
    raise exception 'account is not active';
  end if;

  -- Velocity guard (125): at most 20 accepted comments/hour/user. Comment storage
  -- is otherwise unbounded (the display list caps at 100 but the rows persist);
  -- 20/hour is generous for a human and useless as a flood vector.
  if public._consume_action_rate_limit(auth.uid(), 'gallery_comment', 3600) > 20 then
    raise exception 'You are commenting too quickly — please slow down and try again shortly.';
  end if;

  if char_length(trim(coalesce(comment_body, ''))) < 1 then
    raise exception 'Comment cannot be empty';
  end if;
  if char_length(trim(comment_body)) > 2000 then
    raise exception 'Comment is too long';
  end if;

  -- 195: THE CIVILITY GUARD. Checked AFTER the cheap length gates and BEFORE the
  -- settlement lookup, so a refused comment costs one function call and touches
  -- no other row. The rate-limit consume above already happened, which is
  -- correct: a client hammering the endpoint with refused text is still traffic.
  if public.civility_blocked(comment_body) then
    raise exception 'That comment can''t be posted. Think this is wrong? Feedback & support.';
  end if;

  perform 1 from public.settlements
    where id = target_settlement_id and is_public = true;
  if not found then
    raise exception 'Settlement is not public';
  end if;

  insert into public.gallery_comments(settlement_id, user_id, body)
    values (target_settlement_id, auth.uid(), trim(comment_body))
    returning id into comment_id;
  return comment_id;
end;
$$;

-- ── 5. THE AVATARS BUCKET (§3.5) ────────────────────────────────────────────
-- A NEW bucket, deliberately not `gallery-images`: that one is provisioned on a
-- public-write pattern for a different lane's needs, and inheriting its RLS shape
-- for the product's most identity-sensitive object would be exactly the recorded
-- audit mistake. Public READ (the asset is public by function), and a user writes
-- ONLY under avatars/{their-uid}/.
--
-- Size and MIME are enforced HERE as well as client-side: client checks are
-- courtesy, server checks are law. 2 MB is generous for a 512×512 WebP.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/webp'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Avatar images are publicly readable" on storage.objects;
create policy "Avatar images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- The folder name must equal the caller's uid on every write verb. `foldername`
-- is Supabase's own helper; [1] is the first path segment.
drop policy if exists "Users write their own avatar" on storage.objects;
create policy "Users write their own avatar"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Users replace their own avatar" on storage.objects;
create policy "Users replace their own avatar"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- DELETE is the garbage-sweep of a superseded ladder, and it is scoped the same
-- way: a user can only ever remove objects under their own folder.
drop policy if exists "Users sweep their own avatar" on storage.objects;
create policy "Users sweep their own avatar"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
