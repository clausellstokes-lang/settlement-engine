-- READS ONLY. How many users have a stored provider key (a number only).
select count(*) as byok_keys from public.surveyor_byok_keys;
