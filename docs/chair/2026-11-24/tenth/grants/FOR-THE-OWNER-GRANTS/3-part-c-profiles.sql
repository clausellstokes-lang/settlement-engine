-- ════ PART C: profiles, by an ALLOWED list of column grants (ruling G1 §4) ════
-- In plain words: a signed-in user may change, on their own profile row, ONLY the columns the site's
-- own pages write directly: avatar_url, email_notifications, model_preference, public_identity_opt_in.
-- Every other column (the free narrative claim, the downgrade record, the founder roll flag, consent,
-- names, display_name, creation time, and every column a later migration adds) is written only by the
-- server's own functions, which run as their owner and are not affected. display_name is not on the
-- list: every page writes it through update_display_name (the civility guard), and the page's direct
-- fallback after an RPC error is removed with this change. Policy 087 is NOT restated: it still pins
-- its columns and its row scope; this narrows what UPDATE may touch at all.
-- Safe to run twice. To undo:
--     grant update on public.profiles to authenticated;
revoke update on public.profiles from anon, authenticated;
grant update (avatar_url, email_notifications, model_preference, public_identity_opt_in)
  on public.profiles to authenticated;
