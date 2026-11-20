-- CHECK_A_KEYS.sql — READ-ONLY, one statement, one row. 2026-11-20 02:08 UTC, SEC-GRANTS.
-- Can anon or a signed-in user call the two BYOK key functions? After the revoke: all four false.
select has_function_privilege('anon',          'public._surveyor_byok_secret()',        'execute') as secret_fn_anon,
       has_function_privilege('authenticated', 'public._surveyor_byok_secret()',        'execute') as secret_fn_signed_in,
       has_function_privilege('anon',          'public.surveyor_byok_get(uuid,text)',   'execute') as key_fn_anon,
       has_function_privilege('authenticated', 'public.surveyor_byok_get(uuid,text)',   'execute') as key_fn_signed_in;
