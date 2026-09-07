-- ────────────────────────────────────────────────────────────────────────────
-- 031_gallery_dm_strip_notes.sql — keep the DM's private note space confidential
-- even in the full "Reveal DM-private content" (gallery_share_dm) view.
--
-- The DM Notes pad is a free-text scratch space that belongs to the DM OUTSIDE
-- the simulation — it can hold genuinely confidential, real-world prep that the
-- DM never intends to publish, regardless of how much of the in-world DM layer
-- (secrets, hooks, compass) they choose to reveal. So it must be stripped from
-- EVERY gallery view: AI-narrated or raw, full DM view or not.
--
--   • The default sanitize (_gallery_sanitize_public_json, migration 020) already
--     drops it via the recursive `note` / `dm` / `aiData` denylist.
--   • DM notes live under aiData (aiData.dossierNotes.dmNotes), which the full DM
--     projection (_gallery_dm_full_json, migration 030) already drops — so there is
--     no active leak today. This change adds explicit top-level strips for parity
--     with the client projection toPublicSafe({full:true}) and to keep the
--     guarantee robust if a top-level notes copy is ever introduced. Defense in
--     depth; the denylist only ever grows.
--
-- No signature change; get_gallery_dossier (migration 030) keeps pointing here.
-- ────────────────────────────────────────────────────────────────────────────

create or replace function public._gallery_dm_full_json(j jsonb)
returns jsonb
language sql
immutable
as $$
  with compass as (
    select jsonb_strip_nulls(jsonb_build_object(
      'identityMarkers', j #> '{aiSettlement,identityMarkers}',
      'frictionPoints',  j #> '{aiSettlement,frictionPoints}',
      'connectionsMap',  j #> '{aiSettlement,connectionsMap}',
      'dmCompass',       j #> '{aiSettlement,dmCompass}'
    )) as c
  )
  select case
    when j is null or jsonb_typeof(j) <> 'object' then j
    else
      -- drop the prose blobs + the full aiSettlement + the DM's private note
      -- space, then re-add the DM Compass only when a field survives.
      (j - 'aiData' - 'aiDailyLife' - 'aiSettlement'
         - 'dossierNotes' - 'dmNotes' - 'notes' - 'narrativeNotes')
      || case
           when (select c from compass) <> '{}'::jsonb
             then jsonb_build_object('aiSettlement', (select c from compass))
           else '{}'::jsonb
         end
  end;
$$;

comment on function public._gallery_dm_full_json(jsonb) is
  'shareDm projection: reveal the DM-private layer but drop AI prose (aiData/aiDailyLife), trim aiSettlement to the DM-Compass fields, and strip the DM private note space (dossierNotes/dmNotes/notes/narrativeNotes). Mirrors client toPublicSafe({full:true}).';
